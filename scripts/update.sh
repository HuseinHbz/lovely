#!/usr/bin/env bash
#
# به‌روزرسانی بدون قطعی.
#
#   sudo ./update.sh [--ref main] [--dir /var/www/wolf-hedgehog] [--rollback]
#
# منطق مرکزی: **هیچ‌وقت روی ریلیز زنده build نمی‌کنیم.** build در یک پوشه‌ی
# تازه انجام می‌شود و فقط اگر موفق بود، symlink `current` جابه‌جا می‌شود.
# پس یک build شکسته هرگز سایت زنده را پایین نمی‌آورد.
#
set -euo pipefail

readonly C_RESET=$'\033[0m'
readonly C_BOLD=$'\033[1m'
readonly C_DIM=$'\033[2m'
readonly C_RED=$'\033[31m'
readonly C_GREEN=$'\033[32m'
readonly C_YELLOW=$'\033[33m'
readonly C_BLUE=$'\033[34m'

STEP=0
step() { STEP=$((STEP + 1)); printf '\n%s[%d]%s %s%s%s\n' "$C_BLUE" "$STEP" "$C_RESET" "$C_BOLD" "$1" "$C_RESET"; }
info() { printf '     %s%s%s\n' "$C_DIM" "$1" "$C_RESET"; }
ok()   { printf '     %s✓%s %s\n' "$C_GREEN" "$C_RESET" "$1"; }
warn() { printf '     %s!%s %s\n' "$C_YELLOW" "$C_RESET" "$1"; }
die()  { printf '\n%s✗ %s%s\n\n' "$C_RED" "$1" "$C_RESET" >&2; exit "${2:-1}"; }

REF="main"
DIR="/var/www/wolf-hedgehog"
ROLLBACK=0
KEEP=5

usage() {
  cat <<'USAGE'
Usage: sudo ./update.sh [--ref main] [--dir /var/www/wolf-hedgehog] [--keep 5] [--rollback]

  --ref <ref>     شاخه یا تگ برای به‌روزرسانی        (پیش‌فرض main)
  --dir <path>    محل نصب              (پیش‌فرض /var/www/wolf-hedgehog)
  --keep <n>      چند ریلیز نگه داشته شود                 (پیش‌فرض 5)
                  هر ریلیز حدود ۱۸۰MB روی دیسک اضافه می‌کند
                  (node_modules بین ریلیزها هاردلینک است، .next نه).
                  روی سرور با دیسک تنگ: --keep 2
  --rollback      بازگشت به ریلیز قبلی؛ با آرگومان دیگری ترکیب نمی‌شود
  -h, --help      همین راهنما
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref)      REF="${2:-}"; shift 2 ;;
    --dir)      DIR="${2:-}"; shift 2 ;;
    --keep)     KEEP="${2:-}"; shift 2 ;;
    --rollback) ROLLBACK=1; shift ;;
    -h|--help)  usage; exit 0 ;;
    *) usage; die "آرگومان ناشناخته: $1" 2 ;;
  esac
done

[[ "$KEEP" =~ ^[0-9]+$ && "$KEEP" -ge 1 ]] || die "‏--keep باید عددی ۱ یا بیشتر باشد." 2

[[ "${EUID}" -eq 0 ]] || die "با sudo اجرا کن." 3
[[ -d "$DIR" ]] || die "‏$DIR وجود ندارد. اول install.sh را اجرا کن." 3

SHARED_DIR="$DIR/shared"
RELEASES_DIR="$DIR/releases"
CURRENT_LINK="$DIR/current"
ENV_FILE="$SHARED_DIR/.env"

# پورت را از همان فایلی می‌خوانیم که install.sh نوشته، تا از آن جدا نیفتد.
# شرط وجود فایل لازم است: با `pipefail` یک `sed` روی فایل ناموجود کل انتساب
# را شکست می‌دهد و `set -e` اسکریپت را بی‌صدا می‌کشد.
PORT=""
if [[ -f "$SHARED_DIR/ecosystem.config.cjs" ]]; then
  PORT="$(sed -n "s/.*WH_PORT = '\\([0-9]*\\)'.*/\\1/p" "$SHARED_DIR/ecosystem.config.cjs" | head -1 || true)"
fi
PORT="${PORT:-3000}"

health_check() {
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    curl -fsS --max-time 8 -o /dev/null "http://127.0.0.1:$PORT/gate" 2>/dev/null && return 0
    sleep 2
  done
  return 1
}

# ---------------------------------------------------------------------------
# بازگشت
# ---------------------------------------------------------------------------
if [[ $ROLLBACK -eq 1 ]]; then
  step "بازگشت به ریلیز قبلی"
  current_target="$(readlink -f "$CURRENT_LINK" || true)"
  previous="$(find "$RELEASES_DIR" -maxdepth 1 -mindepth 1 -type d | sort -r \
              | grep -v "^${current_target}$" | head -1 || true)"
  [[ -n "$previous" ]] || die "ریلیز قبلی وجود ندارد." 4

  info "از $(basename "$current_target") به $(basename "$previous")"
  ln -sfn "$previous" "$CURRENT_LINK"
  pm2 reload wolf-hedgehog --update-env >/dev/null

  if health_check; then
    ok "بازگشت انجام شد و سایت سالم است."
    exit 0
  fi
  ln -sfn "$current_target" "$CURRENT_LINK"
  pm2 reload wolf-hedgehog --update-env >/dev/null
  die "ریلیز قبلی هم سالم نبود؛ به همان قبلی برگردانده شد." 5
fi

# ---------------------------------------------------------------------------
step "پشتیبان‌گیری قبل از هر کاری"
# ---------------------------------------------------------------------------
if [[ -x "$CURRENT_LINK/scripts/backup.sh" ]]; then
  "$CURRENT_LINK/scripts/backup.sh" --dir "$DIR" >/dev/null && ok "پشتیبان گرفته شد"
else
  warn "backup.sh پیدا نشد — بدون پشتیبان ادامه می‌دهم."
fi

# ---------------------------------------------------------------------------
step "دریافت کد تازه ($REF)"
# ---------------------------------------------------------------------------
SRC_DIR="$SHARED_DIR/source"
if [[ -d "$SRC_DIR/.git" ]]; then
  git -C "$SRC_DIR" fetch --quiet origin "$REF"
  git -C "$SRC_DIR" checkout --quiet "$REF"
  git -C "$SRC_DIR" reset --hard --quiet "origin/$REF" 2>/dev/null \
    || git -C "$SRC_DIR" reset --hard --quiet "$REF"
else
  origin="$(git -C "$CURRENT_LINK" remote get-url origin 2>/dev/null || true)"
  [[ -n "$origin" ]] || die "مخزن مبدأ پیدا نشد. یک بار «git clone <url> $SRC_DIR» بزن." 4
  git clone --quiet "$origin" "$SRC_DIR"
  git -C "$SRC_DIR" checkout --quiet "$REF"
fi
NEW_SHA="$(git -C "$SRC_DIR" rev-parse --short HEAD)"
ok "روی $REF @ $NEW_SHA"

# ---------------------------------------------------------------------------
step "‏build در پوشه‌ی تازه"
# ---------------------------------------------------------------------------
RELEASE_STAMP="$(date -u +%Y%m%d-%H%M%S)"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_STAMP"
mkdir -p "$RELEASE_DIR"

cleanup_release() {
  warn "برگرداندن مرحله: ریلیز ناقص حذف شد. سایت زنده دست نخورد."
  rm -rf "$RELEASE_DIR"
}
trap cleanup_release ERR

rsync -a --delete \
  --exclude '.git' --exclude 'node_modules' --exclude '.next' \
  --exclude 'tests/node_modules' --exclude '.env' --exclude '.env.local' \
  "$SRC_DIR/" "$RELEASE_DIR/"
ln -sfn "$ENV_FILE" "$RELEASE_DIR/.env"

info "نصب وابستگی‌ها…"
( cd "$RELEASE_DIR" && pnpm install --frozen-lockfile --prod=false >/dev/null )

info "‏build…"
( cd "$RELEASE_DIR" && NODE_ENV=production pnpm build >/dev/null )
trap - ERR
ok "‏build موفق — سایت زنده هنوز روی ریلیز قبلی است"

chown -R wolfapp:wolfapp "$RELEASE_DIR" 2>/dev/null || true

# ---------------------------------------------------------------------------
step "سواپ اتمیک و ریلود"
# ---------------------------------------------------------------------------
PREVIOUS_TARGET="$(readlink -f "$CURRENT_LINK" || true)"
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"
pm2 reload wolf-hedgehog --update-env >/dev/null
ok "‏current → releases/$RELEASE_STAMP"

# ---------------------------------------------------------------------------
step "بررسی سلامت"
# ---------------------------------------------------------------------------
if health_check; then
  ok "سایت سالم است"
else
  warn "سایت جواب نداد — بازگشت خودکار…"
  if [[ -n "$PREVIOUS_TARGET" && -d "$PREVIOUS_TARGET" ]]; then
    ln -sfn "$PREVIOUS_TARGET" "$CURRENT_LINK"
    pm2 reload wolf-hedgehog --update-env >/dev/null
    if health_check; then
      rm -rf "$RELEASE_DIR"
      die "به‌روزرسانی برگشت. سایت روی $(basename "$PREVIOUS_TARGET") سالم است." 5
    fi
  fi
  die "سایت پایین است و بازگشت هم جواب نداد. «pm2 logs wolf-hedgehog» را ببین." 6
fi

# ---------------------------------------------------------------------------
step "نگه‌داشتن $KEEP ریلیز آخر"
# ---------------------------------------------------------------------------
mapfile -t old < <(find "$RELEASES_DIR" -maxdepth 1 -mindepth 1 -type d | sort -r | tail -n +$((KEEP + 1)))
for dir in "${old[@]:-}"; do
  [[ -n "$dir" && "$dir" != "$(readlink -f "$CURRENT_LINK")" ]] || continue
  rm -rf "$dir"
  info "حذف $(basename "$dir")"
done
ok "${#old[@]} ریلیز قدیمی پاک شد"

printf '\n%s به‌روزرسانی تمام شد — بدون قطعی. %s\n' "$C_GREEN$C_BOLD" "$C_RESET"
printf '  %sریلیز: %s @ %s%s\n' "$C_DIM" "$RELEASE_STAMP" "$NEW_SHA" "$C_RESET"
printf '  %sبازگشت در صورت نیاز:  sudo ./update.sh --rollback%s\n\n' "$C_DIM" "$C_RESET"
