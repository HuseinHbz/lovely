#!/usr/bin/env bash
#
# نصب یک‌دستوری روی یک سرور Ubuntu تازه.
#
#   sudo ./install.sh --domain <domain> --email <email> [--dir /var/www/wolf-hedgehog]
#                     [--port 3000] [--expires 2027-01-01T00:00:00Z] [--no-ssl]
#
# اصول:
#   • `set -euo pipefail` — هر خطا فوراً متوقف می‌کند.
#   • idempotent — اجرای دوباره چیزی را خراب نمی‌کند. مهم‌تر از همه: اگر
#     `.env` از قبل باشد **دست نمی‌خورد**، چون بازتولید توکن یعنی باطل شدن
#     لینکی که قبلاً فرستاده شده.
#   • هر مرحله لاگ رنگی دارد و در صورت خطا همان مرحله برگردانده می‌شود.
#
set -euo pipefail

# ---------------------------------------------------------------------------
# ظاهر
# ---------------------------------------------------------------------------
readonly C_RESET=$'\033[0m'
readonly C_BOLD=$'\033[1m'
readonly C_DIM=$'\033[2m'
readonly C_RED=$'\033[31m'
readonly C_GREEN=$'\033[32m'
readonly C_YELLOW=$'\033[33m'
readonly C_BLUE=$'\033[34m'

STEP=0
step()  { STEP=$((STEP + 1)); printf '\n%s[%d/11]%s %s%s%s\n' "$C_BLUE" "$STEP" "$C_RESET" "$C_BOLD" "$1" "$C_RESET"; }
info()  { printf '      %s%s%s\n' "$C_DIM" "$1" "$C_RESET"; }
ok()    { printf '      %s✓%s %s\n' "$C_GREEN" "$C_RESET" "$1"; }
warn()  { printf '      %s!%s %s\n' "$C_YELLOW" "$C_RESET" "$1"; }
die()   { printf '\n%s✗ %s%s\n\n' "$C_RED" "$1" "$C_RESET" >&2; exit "${2:-1}"; }

# ---------------------------------------------------------------------------
# آرگومان‌ها
# ---------------------------------------------------------------------------
DOMAIN=""
EMAIL=""
DIR="/var/www/wolf-hedgehog"
PORT="3000"
EXPIRES=""
USE_SSL=1
APP_USER="wolfapp"

usage() {
  cat <<'USAGE'
Usage: sudo ./install.sh --domain <domain> --email <email> [options]

  --domain <domain>    دامنه‌ی سایت، مثل example.ir            (لازم)
  --email  <email>     ایمیل برای Let's Encrypt                (لازم مگر --no-ssl)
  --dir    <path>      محل نصب        (پیش‌فرض /var/www/wolf-hedgehog)
  --port   <port>      پورت داخلی Next                (پیش‌فرض 3000)
  --expires <iso8601>  تاریخ انقضای لینک       (پیش‌فرض یک سال بعد)
  --no-ssl             بدون certbot — فقط برای تست محلی
  -h, --help           همین راهنما
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)  DOMAIN="${2:-}"; shift 2 ;;
    --email)   EMAIL="${2:-}"; shift 2 ;;
    --dir)     DIR="${2:-}"; shift 2 ;;
    --port)    PORT="${2:-}"; shift 2 ;;
    --expires) EXPIRES="${2:-}"; shift 2 ;;
    --no-ssl)  USE_SSL=0; shift ;;
    -h|--help) usage; exit 0 ;;
    *) usage; die "آرگومان ناشناخته: $1" 2 ;;
  esac
done

[[ -n "$DOMAIN" ]] || { usage; die "‏--domain لازم است." 2; }
[[ $USE_SSL -eq 0 || -n "$EMAIL" ]] || { usage; die "‏--email لازم است (یا --no-ssl بده)." 2; }

# مسیر مخزن = پوشه‌ی والد این اسکریپت
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_STAMP="$(date -u +%Y%m%d-%H%M%S)"
RELEASE_DIR="$DIR/releases/$RELEASE_STAMP"
SHARED_DIR="$DIR/shared"

printf '\n%s پرونده‌ی محرمانه شماره ۲۷ — نصب %s\n' "$C_BOLD" "$C_RESET"
info "دامنه: $DOMAIN · محل: $DIR · پورت: $PORT"

# ---------------------------------------------------------------------------
step "بررسی محیط"
# ---------------------------------------------------------------------------
[[ "${EUID}" -eq 0 ]] || die "با sudo اجرا کن." 3

if [[ -r /etc/os-release ]]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  [[ "${ID:-}" == "ubuntu" ]] || warn "این اسکریپت برای Ubuntu نوشته شده (اینجا: ${PRETTY_NAME:-نامعلوم})."
  ok "سیستم: ${PRETTY_NAME:-نامعلوم}"
else
  warn "‏/etc/os-release خوانده نشد؛ تشخیص توزیع رد شد."
fi

# DNS: هشدار می‌دهد ولی متوقف نمی‌کند — ممکن است رکورد تازه ساخته شده باشد.
if command -v getent >/dev/null 2>&1; then
  if resolved="$(getent ahostsv4 "$DOMAIN" 2>/dev/null | awk 'NR==1{print $1}')" && [[ -n "$resolved" ]]; then
    ok "‏DNS دامنه به $resolved می‌رسد"
    public_ip="$(curl -fsS --max-time 8 https://api.ipify.org 2>/dev/null || echo '')"
    if [[ -n "$public_ip" && "$public_ip" != "$resolved" ]]; then
      warn "‏IP این سرور ($public_ip) با DNS دامنه ($resolved) یکی نیست — certbot ممکن است شکست بخورد."
    fi
  else
    warn "دامنه در DNS پیدا نشد. اگر رکورد را همین الان ساخته‌ای، کمی صبر کن."
  fi
fi

# ---------------------------------------------------------------------------
step "نصب Node.js 22، pnpm و pm2"
# ---------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive

need_node=1
if command -v node >/dev/null 2>&1; then
  major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
  [[ "$major" -ge 22 ]] && { need_node=0; ok "Node $(node -v) از قبل هست"; }
fi

if [[ $need_node -eq 1 ]]; then
  info "نصب Node.js 22 LTS از NodeSource…"
  apt-get update -qq
  apt-get install -y -qq curl ca-certificates gnupg >/dev/null
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
  ok "Node $(node -v) نصب شد"
fi

command -v pnpm >/dev/null 2>&1 || { npm install -g pnpm >/dev/null 2>&1; ok "pnpm نصب شد"; }
command -v pm2  >/dev/null 2>&1 || { npm install -g pm2  >/dev/null 2>&1; ok "pm2 نصب شد"; }
info "pnpm $(pnpm -v 2>/dev/null || echo '?') · pm2 $(pm2 -v 2>/dev/null | tail -1 || echo '?')"

for pkg in nginx openssl rsync ufw; do
  command -v "$pkg" >/dev/null 2>&1 || { apt-get install -y -qq "$pkg" >/dev/null && ok "$pkg نصب شد"; }
done

# ---------------------------------------------------------------------------
step "ساخت کاربر سیستمی $APP_USER"
# ---------------------------------------------------------------------------
if id -u "$APP_USER" >/dev/null 2>&1; then
  ok "کاربر $APP_USER از قبل هست"
else
  useradd --system --no-create-home --shell /usr/sbin/nologin "$APP_USER"
  ok "کاربر $APP_USER ساخته شد (بدون shell)"
fi

# ---------------------------------------------------------------------------
step "کپی سورس و build"
# ---------------------------------------------------------------------------
mkdir -p "$RELEASE_DIR" "$SHARED_DIR" "$SHARED_DIR/logs" "$DIR/releases"

# rollback همین مرحله: اگر build شکست، ریلیز ناقص پاک می‌شود.
cleanup_release() {
  if [[ -d "$RELEASE_DIR" ]]; then
    warn "برگرداندن مرحله: ریلیز ناقص $RELEASE_STAMP حذف شد."
    rm -rf "$RELEASE_DIR"
  fi
}
trap cleanup_release ERR

info "کپی سورس به $RELEASE_DIR …"
rsync -a --delete \
  --exclude '.git' --exclude 'node_modules' --exclude '.next' \
  --exclude 'tests/node_modules' --exclude '.env' --exclude '.env.local' \
  "$REPO_ROOT/" "$RELEASE_DIR/"
ok "سورس کپی شد"

info "نصب وابستگی‌ها…"
( cd "$RELEASE_DIR" && pnpm install --frozen-lockfile --prod=false >/dev/null )
ok "وابستگی‌ها نصب شدند"

info "‏build (نگهبان پیش‌نویس و بازبینی حریم خصوصی هم اینجا اجرا می‌شوند)…"
( cd "$RELEASE_DIR" && NODE_ENV=production pnpm build >/dev/null ) \
  || die "‏build شکست خورد. با «cd $RELEASE_DIR && pnpm build» خطای کامل را ببین." 4
ok "‏build موفق"

trap - ERR

# ---------------------------------------------------------------------------
step "ساخت .env و توکن دسترسی"
# ---------------------------------------------------------------------------
ENV_FILE="$SHARED_DIR/.env"
TOKEN_IS_NEW=0

if [[ -f "$ENV_FILE" ]]; then
  ok "‏.env از قبل هست — دست نخورد"
  info "بازتولید توکن یعنی باطل شدن لینکی که قبلاً فرستاده شده."
else
  [[ -n "$EXPIRES" ]] || EXPIRES="$(date -u -d '+1 year' +%Y-%m-%dT%H:%M:%SZ)"
  ACCESS_TOKEN="$(openssl rand -hex 16)"
  SESSION_SECRET="$(openssl rand -hex 32)"
  scheme="https"; [[ $USE_SSL -eq 1 ]] || scheme="http"

  umask 077
  cat > "$ENV_FILE" <<EOF
# ساخته‌شده توسط install.sh در $(date -u +%Y-%m-%dT%H:%M:%SZ)
# این فایل هرگز نباید commit یا فرستاده شود.
ACCESS_TOKEN=$ACCESS_TOKEN
SESSION_SECRET=$SESSION_SECRET
LINK_EXPIRES_AT=$EXPIRES
SITE_URL=$scheme://$DOMAIN
NEXT_TELEMETRY_DISABLED=1
EOF
  umask 022
  TOKEN_IS_NEW=1
  ok "‏.env ساخته شد · انقضا: $EXPIRES"
fi

chown -R "$APP_USER:$APP_USER" "$DIR"
chmod 600 "$ENV_FILE"
ln -sfn "$ENV_FILE" "$RELEASE_DIR/.env"

# فعال کردن ریلیز
ln -sfn "$RELEASE_DIR" "$DIR/current"
ok "‏current → releases/$RELEASE_STAMP"

# ---------------------------------------------------------------------------
step "راه‌اندازی pm2"
# ---------------------------------------------------------------------------
cat > "$SHARED_DIR/ecosystem.config.cjs" <<EOF
// ساخته‌شده توسط install.sh — دست‌نویس ویرایش نکن.
process.env.WH_DIR = '$DIR';
process.env.WH_PORT = '$PORT';
process.env.WH_USER = '$APP_USER';
module.exports = require('$DIR/current/deploy/ecosystem.config.cjs');
EOF

if pm2 describe wolf-hedgehog >/dev/null 2>&1; then
  pm2 reload "$SHARED_DIR/ecosystem.config.cjs" --update-env >/dev/null
  ok "‏pm2 ریلود شد"
else
  pm2 start "$SHARED_DIR/ecosystem.config.cjs" >/dev/null
  ok "‏pm2 اجرا شد"
fi
pm2 save >/dev/null
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || warn "‏pm2 startup را دستی اجرا کن."
ok "‏pm2 برای بوت ذخیره شد"

# ---------------------------------------------------------------------------
step "پیکربندی Nginx"
# ---------------------------------------------------------------------------
NGINX_AVAILABLE="/etc/nginx/sites-available/wolf-hedgehog.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/wolf-hedgehog.conf"

sed -e "s|__DOMAIN__|$DOMAIN|g" -e "s|__PORT__|$PORT|g" \
  "$RELEASE_DIR/deploy/nginx.conf.template" > "$NGINX_AVAILABLE"

# قبل از certbot هنوز گواهی نیست؛ بلوک ۴۴۳ موقتاً کنار می‌رود.
if [[ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
  info "گواهی هنوز نیست — فعلاً فقط بلوک ۸۰ فعال می‌شود."
  awk '/^server \{/{n++} n==1' "$NGINX_AVAILABLE" > "$NGINX_AVAILABLE.tmp"
  printf 'server {\n    listen 80;\n    listen [::]:80;\n    server_name %s;\n    location /.well-known/acme-challenge/ { root /var/www/html; }\n    location / { proxy_pass http://127.0.0.1:%s; proxy_set_header Host $host; }\n}\n' \
    "$DOMAIN" "$PORT" > "$NGINX_AVAILABLE.tmp"
  mv "$NGINX_AVAILABLE.tmp" "$NGINX_AVAILABLE"
fi

ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"
rm -f /etc/nginx/sites-enabled/default
mkdir -p /var/www/html
nginx -t >/dev/null 2>&1 || die "پیکربندی Nginx نامعتبر است. با «nginx -t» ببین." 5
systemctl reload nginx
ok "‏Nginx بارگذاری شد"

# ---------------------------------------------------------------------------
step "گواهی SSL"
# ---------------------------------------------------------------------------
if [[ $USE_SSL -eq 0 ]]; then
  warn "‏--no-ssl داده شده — گواهی گرفته نشد. سایت فقط روی http است."
elif [[ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
  ok "گواهی از قبل هست"
  sed -e "s|__DOMAIN__|$DOMAIN|g" -e "s|__PORT__|$PORT|g" \
    "$RELEASE_DIR/deploy/nginx.conf.template" > "$NGINX_AVAILABLE"
  nginx -t >/dev/null 2>&1 && systemctl reload nginx
else
  command -v certbot >/dev/null 2>&1 || apt-get install -y -qq certbot python3-certbot-nginx >/dev/null
  if certbot certonly --webroot -w /var/www/html -d "$DOMAIN" \
      --email "$EMAIL" --agree-tos --non-interactive >/dev/null 2>&1; then
    ok "گواهی گرفته شد"
    sed -e "s|__DOMAIN__|$DOMAIN|g" -e "s|__PORT__|$PORT|g" \
      "$RELEASE_DIR/deploy/nginx.conf.template" > "$NGINX_AVAILABLE"
    nginx -t >/dev/null 2>&1 && systemctl reload nginx
    ok "‏Nginx با HTTPS بارگذاری شد"
  else
    warn "certbot شکست خورد. سایت روی http بالاست؛ بعد از درست شدن DNS دوباره اجرا کن."
    USE_SSL=0
  fi
fi

# ---------------------------------------------------------------------------
step "فایروال"
# ---------------------------------------------------------------------------
if command -v ufw >/dev/null 2>&1; then
  ufw allow 22/tcp  >/dev/null 2>&1 || true
  ufw allow 80/tcp  >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
  ufw --force enable >/dev/null 2>&1 || true
  ok "‏ufw فعال شد (۲۲، ۸۰، ۴۴۳)"
fi

# ---------------------------------------------------------------------------
step "تایمر پشتیبان روزانه"
# ---------------------------------------------------------------------------
cat > /etc/systemd/system/wolf-hedgehog-backup.service <<EOF
[Unit]
Description=پشتیبان پرونده‌ی گرگ و جوجه‌تیغی

[Service]
Type=oneshot
ExecStart=$DIR/current/scripts/backup.sh --dir $DIR
EOF

cat > /etc/systemd/system/wolf-hedgehog-backup.timer <<'EOF'
[Unit]
Description=پشتیبان روزانه

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now wolf-hedgehog-backup.timer >/dev/null 2>&1
ok "تایمر پشتیبان روزانه فعال شد"

# ---------------------------------------------------------------------------
step "بررسی سلامت"
# ---------------------------------------------------------------------------
scheme="https"; [[ $USE_SSL -eq 1 ]] || scheme="http"
HEALTH_URL="$scheme://$DOMAIN/gate"

healthy=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 10 -o /dev/null "$HEALTH_URL" 2>/dev/null; then healthy=1; break; fi
  sleep 3
done

if [[ $healthy -eq 0 ]]; then
  printf '\n%s✗ سایت جواب نداد: %s%s\n\n' "$C_RED" "$HEALTH_URL" "$C_RESET" >&2
  cat >&2 <<EOF
راهنمای رفع، به ترتیب:

  ۱. لاگ برنامه:        pm2 logs wolf-hedgehog --lines 50
     اگر پیام «پیکربندی ناقص است» دیدی، $ENV_FILE ناقص است.
  ۲. وضعیت پروسه:       pm2 status
  ۳. پاسخ مستقیم Next:  curl -I http://127.0.0.1:$PORT/gate
     اگر اینجا جواب داد ولی از بیرون نه، مشکل Nginx یا فایروال است.
  ۴. پیکربندی Nginx:    nginx -t && systemctl status nginx
  ۵. لاگ خطای Nginx:    tail -50 /var/log/nginx/wolf-hedgehog.error.log
  ۶. ‏DNS:               getent ahostsv4 $DOMAIN

سرویس بالا مانده تا بتوانی بررسی کنی. برای حذف کامل:
  sudo $DIR/current/scripts/uninstall.sh --purge
EOF
  exit 6
fi
ok "سایت جواب داد: $HEALTH_URL"

# ---------------------------------------------------------------------------
# نتیجه
# ---------------------------------------------------------------------------
printf '\n%s نصب تمام شد. %s\n\n' "$C_GREEN$C_BOLD" "$C_RESET"
printf '  %sلینک:%s  %s://%s\n' "$C_BOLD" "$C_RESET" "$scheme" "$DOMAIN"

if [[ $TOKEN_IS_NEW -eq 1 ]]; then
  printf '  %sکد دسترسی:%s  %s\n\n' "$C_BOLD" "$C_RESET" "$(grep '^ACCESS_TOKEN=' "$ENV_FILE" | cut -d= -f2- || true)"
  printf '  %sلینک و کد را جدا از هم بفرست.%s\n' "$C_YELLOW" "$C_RESET"
  printf '  %sکد در URL نیست تا در تاریخچه‌ی مرورگر و هدر Referer ننشیند.%s\n' "$C_DIM" "$C_RESET"
  printf '  %sاین تنها باری است که کد چاپ می‌شود؛ در %s هم هست.%s\n' "$C_DIM" "$ENV_FILE" "$C_RESET"
else
  printf '  %sکد دسترسی عوض نشد.%s  دیدنش:  sudo grep ACCESS_TOKEN %s\n' "$C_DIM" "$C_RESET" "$ENV_FILE"
fi

printf '\n  %sانقضای لینک:%s %s\n' "$C_BOLD" "$C_RESET" "$(grep '^LINK_EXPIRES_AT=' "$ENV_FILE" | cut -d= -f2- || true)"
printf '  %sبعد از این تاریخ همه‌چیز به /expired می‌رود، حتی با کوکی معتبر.%s\n' "$C_DIM" "$C_RESET"
printf '  %sبرای تغییرش: .env را عوض کن و «pm2 restart wolf-hedgehog» بزن — ری‌استارت لازم است.%s\n\n' "$C_DIM" "$C_RESET"
