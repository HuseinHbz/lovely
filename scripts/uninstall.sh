#!/usr/bin/env bash
#
# حذف کامل.
#
#   sudo ./uninstall.sh [--dir /var/www/wolf-hedgehog] [--purge] [--keep-cert] [--yes]
#
# پیش‌فرض محافظه‌کار است: برنامه و سایت Nginx می‌روند، ولی پشتیبان‌ها، کاربر
# سیستمی و گواهی می‌مانند. `--purge` همه را می‌برد.
#
# آخر کار دقیقاً می‌گوید چه چیزی حذف شد و چه چیزی دست‌نخورده ماند — چون
# «فکر کردم پاک شده» بدترین حالت ممکن برای این پروژه است.
#
set -euo pipefail

readonly C_RESET=$'\033[0m'
readonly C_BOLD=$'\033[1m'
readonly C_DIM=$'\033[2m'
readonly C_RED=$'\033[31m'
readonly C_GREEN=$'\033[32m'
readonly C_YELLOW=$'\033[33m'

ok()   { printf '  %s✓%s %s\n' "$C_GREEN" "$C_RESET" "$1"; }
warn() { printf '  %s!%s %s\n' "$C_YELLOW" "$C_RESET" "$1"; }
die()  { printf '\n%s✗ %s%s\n\n' "$C_RED" "$1" "$C_RESET" >&2; exit "${2:-1}"; }

DIR="/var/www/wolf-hedgehog"
PURGE=0
KEEP_CERT=0
ASSUME_YES=0
APP_USER="wolfapp"

usage() {
  cat <<'USAGE'
Usage: sudo ./uninstall.sh [options]

  --dir <path>    محل نصب        (پیش‌فرض /var/www/wolf-hedgehog)
  --purge         کاربر سیستمی، پشتیبان‌ها، تایمر و قواعد ufw را هم حذف کن
  --keep-cert     گواهی Let's Encrypt را نگه دار
  --yes           بدون تأیید تعاملی
  -h, --help      همین راهنما
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)       DIR="${2:-}"; shift 2 ;;
    --purge)     PURGE=1; shift ;;
    --keep-cert) KEEP_CERT=1; shift ;;
    --yes)       ASSUME_YES=1; shift ;;
    -h|--help)   usage; exit 0 ;;
    *) usage; die "آرگومان ناشناخته: $1" 2 ;;
  esac
done

[[ "${EUID}" -eq 0 ]] || die "با sudo اجرا کن." 3

# دامنه را از پیکربندی Nginx برمی‌داریم تا تأیید تعاملی معنا داشته باشد.
#
# فایل ممکن است نباشد (نصب ناقص، یا اجرای دوباره‌ی همین اسکریپت). با
# `set -o pipefail` یک `sed` روی فایل ناموجود کل انتساب را شکست می‌دهد و
# `set -e` اسکریپت را بی‌صدا می‌کشد — پس شرط وجود فایل لازم است، نه فقط
# `2>/dev/null`.
NGINX_AVAILABLE="/etc/nginx/sites-available/wolf-hedgehog.conf"
DOMAIN=""
if [[ -f "$NGINX_AVAILABLE" ]]; then
  DOMAIN="$(sed -n 's/^[[:space:]]*server_name[[:space:]]*\([^;]*\);.*/\1/p' "$NGINX_AVAILABLE" | head -1 | tr -d ' ' || true)"
fi

REMOVED=()
KEPT=()

printf '\n%s حذف پرونده‌ی محرمانه شماره ۲۷ %s\n\n' "$C_BOLD" "$C_RESET"
printf '  محل نصب: %s\n' "$DIR"
[[ -n "$DOMAIN" ]] && printf '  دامنه:    %s\n' "$DOMAIN"
printf '  حالت:     %s\n\n' "$([[ $PURGE -eq 1 ]] && echo 'purge — همه‌چیز' || echo 'معمولی — پشتیبان‌ها می‌مانند')"

# ---------------------------------------------------------------------------
# تأیید تعاملی با تایپ نام دامنه
# ---------------------------------------------------------------------------
if [[ $ASSUME_YES -eq 0 ]]; then
  if [[ -z "$DOMAIN" ]]; then
    printf '%sدامنه از Nginx خوانده نشد. برای ادامه «حذف» را تایپ کن: %s' "$C_YELLOW" "$C_RESET"
    read -r answer
    [[ "$answer" == "حذف" ]] || die "لغو شد." 4
  else
    printf '%sبرای تأیید، نام دامنه را تایپ کن (%s): %s' "$C_YELLOW" "$DOMAIN" "$C_RESET"
    read -r answer
    [[ "$answer" == "$DOMAIN" ]] || die "دامنه مطابقت نداشت — لغو شد." 4
  fi
  echo
fi

# ---------------------------------------------------------------------------
# ۱. pm2
# ---------------------------------------------------------------------------
if command -v pm2 >/dev/null 2>&1 && pm2 describe wolf-hedgehog >/dev/null 2>&1; then
  pm2 delete wolf-hedgehog >/dev/null 2>&1 || true
  pm2 save --force >/dev/null 2>&1 || true
  ok "پروسه‌ی pm2 حذف شد"
  REMOVED+=("پروسه‌ی pm2 «wolf-hedgehog»")
else
  warn "پروسه‌ی pm2 پیدا نشد"
fi

# ---------------------------------------------------------------------------
# ۲. Nginx
# ---------------------------------------------------------------------------
if [[ -e /etc/nginx/sites-enabled/wolf-hedgehog.conf || -e "$NGINX_AVAILABLE" ]]; then
  rm -f /etc/nginx/sites-enabled/wolf-hedgehog.conf "$NGINX_AVAILABLE"
  if nginx -t >/dev/null 2>&1; then
    systemctl reload nginx >/dev/null 2>&1 || true
    ok "سایت Nginx حذف و سرویس بارگذاری شد"
  else
    warn "سایت حذف شد ولی «nginx -t» ایراد دارد — دستی ببین."
  fi
  REMOVED+=("پیکربندی Nginx")
else
  warn "پیکربندی Nginx پیدا نشد"
fi

# `rm -f` روی فایل ناموجود هم موفق است، پس بدون این شرط گزارش ادعا می‌کرد
# چیزی را حذف کرده که اصلاً نبوده. کل ارزش این گزارش به دقیق بودنش است.
if [[ -f /var/log/nginx/wolf-hedgehog.error.log ]]; then
  rm -f /var/log/nginx/wolf-hedgehog.error.log
  REMOVED+=("لاگ خطای Nginx")
fi

# ---------------------------------------------------------------------------
# ۳. گواهی
# ---------------------------------------------------------------------------
if [[ $KEEP_CERT -eq 1 ]]; then
  KEPT+=("گواهی Let's Encrypt برای ${DOMAIN:-دامنه}")
  warn "گواهی نگه داشته شد (--keep-cert)"
elif [[ -n "$DOMAIN" ]] && command -v certbot >/dev/null 2>&1; then
  if certbot delete --cert-name "$DOMAIN" --non-interactive >/dev/null 2>&1; then
    ok "گواهی حذف شد"
    REMOVED+=("گواهی Let's Encrypt")
  else
    warn "گواهی حذف نشد (شاید از اول نبود)"
  fi
fi

# ---------------------------------------------------------------------------
# ۴. تایمر پشتیبان
# ---------------------------------------------------------------------------
if systemctl list-unit-files 2>/dev/null | grep -q '^wolf-hedgehog-backup'; then
  systemctl disable --now wolf-hedgehog-backup.timer >/dev/null 2>&1 || true
  rm -f /etc/systemd/system/wolf-hedgehog-backup.{service,timer}
  systemctl daemon-reload
  ok "تایمر پشتیبان حذف شد"
  REMOVED+=("تایمر systemd پشتیبان")
fi

# ---------------------------------------------------------------------------
# ۵. پوشه‌ی برنامه — شامل .env
# ---------------------------------------------------------------------------
if [[ -d "$DIR" ]]; then
  rm -rf "$DIR"
  ok "پوشه‌ی برنامه حذف شد (شامل .env و توکن)"
  REMOVED+=("$DIR — کد، build و .env")
else
  warn "پوشه‌ی برنامه پیدا نشد"
fi

# ---------------------------------------------------------------------------
# ۶. purge
# ---------------------------------------------------------------------------
BACKUP_DIR="/var/backups/wolf-hedgehog"
if [[ $PURGE -eq 1 ]]; then
  if [[ -d "$BACKUP_DIR" ]]; then
    rm -rf "$BACKUP_DIR"
    ok "پشتیبان‌ها حذف شدند"
    REMOVED+=("$BACKUP_DIR")
  fi
  if id -u "$APP_USER" >/dev/null 2>&1; then
    userdel "$APP_USER" >/dev/null 2>&1 || true
    ok "کاربر $APP_USER حذف شد"
    REMOVED+=("کاربر سیستمی $APP_USER")
  fi
  # فقط قواعد وب؛ ۲۲ عمداً دست نمی‌خورد وگرنه دسترسی SSH قطع می‌شود.
  if command -v ufw >/dev/null 2>&1; then
    ufw delete allow 80/tcp  >/dev/null 2>&1 || true
    ufw delete allow 443/tcp >/dev/null 2>&1 || true
    ok "قواعد ufw مربوط به ۸۰ و ۴۴۳ حذف شد"
    REMOVED+=("قواعد ufw ۸۰ و ۴۴۳")
    KEPT+=("قاعده‌ی ufw پورت ۲۲ — عمداً، تا SSH قطع نشود")
  fi
else
  [[ -d "$BACKUP_DIR" ]] && KEPT+=("$BACKUP_DIR — پشتیبان‌ها")
  id -u "$APP_USER" >/dev/null 2>&1 && KEPT+=("کاربر سیستمی $APP_USER")
  KEPT+=("قواعد ufw")
fi

KEPT+=("Node.js، pnpm، pm2 و Nginx — بسته‌های سیستمی دست نخوردند")

# ---------------------------------------------------------------------------
# گزارش
# ---------------------------------------------------------------------------
printf '\n%s حذف شد: %s\n' "$C_BOLD" "$C_RESET"
for item in "${REMOVED[@]:-}"; do [[ -n "$item" ]] && printf '  %s−%s %s\n' "$C_RED" "$C_RESET" "$item"; done

printf '\n%s دست‌نخورده ماند: %s\n' "$C_BOLD" "$C_RESET"
for item in "${KEPT[@]:-}"; do [[ -n "$item" ]] && printf '  %s·%s %s\n' "$C_DIM" "$C_RESET" "$item"; done

printf '\n%sدرباره‌ی داده‌ی کاربر:%s پیشرفت و انتخاب‌ها هیچ‌وقت روی این سرور نبودند —\n' "$C_BOLD" "$C_RESET"
printf 'فقط در localStorage مرورگر خودِ کاربر. حذف سرور آن‌ها را پاک نمی‌کند و\n'
printf 'تنها راهش دکمه‌ی «پاک کردن همه‌ی داده‌های من» یا پاک کردن داده‌های سایت\n'
printf 'از تنظیمات مرورگر است. کوکی هم می‌ماند ولی بی‌معنی است.\n\n'
