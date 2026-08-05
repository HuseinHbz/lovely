#!/usr/bin/env bash
#
# پشتیبان روزانه.
#
#   ./backup.sh [--dir /var/www/wolf-hedgehog] [--out /var/backups/wolf-hedgehog] [--keep 14]
#
# **دیتابیسی وجود ندارد.** تنها دو چیز ارزش پشتیبان دارند:
#
#   • `.env` — اگر گم شود، توکن و سکرت گم می‌شوند و لینکی که فرستاده شده
#     دیگر باز نمی‌شود.
#   • `content/` — متن پرونده.
#
# پیشرفت کاربر پشتیبان **نمی‌شود** و نباید بشود: فقط در `localStorage` مرورگر
# خودش است و هیچ نسخه‌ای از آن روی سرور وجود ندارد. همین قاعده ۲ است.
#
set -euo pipefail

DIR="/var/www/wolf-hedgehog"
OUT="/var/backups/wolf-hedgehog"
KEEP=14

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)  DIR="${2:-}"; shift 2 ;;
    --out)  OUT="${2:-}"; shift 2 ;;
    --keep) KEEP="${2:-}"; shift 2 ;;
    -h|--help)
      sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "آرگومان ناشناخته: $1" >&2; exit 2 ;;
  esac
done

CURRENT="$DIR/current"
ENV_FILE="$DIR/shared/.env"
[[ -d "$CURRENT" ]] || { echo "‏$CURRENT وجود ندارد." >&2; exit 3; }

mkdir -p "$OUT"
chmod 700 "$OUT"

STAMP="$(date -u +%Y%m%d-%H%M%S)"
ARCHIVE="$OUT/$STAMP.tar.gz"

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

[[ -f "$ENV_FILE" ]] && cp "$ENV_FILE" "$STAGE/.env"
[[ -d "$CURRENT/content" ]] && cp -r "$CURRENT/content" "$STAGE/content"

# نسخه‌ی کد را هم ثبت کن تا بعداً معلوم باشد این پشتیبان مال چه ریلیزی است.
{
  echo "date=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "release=$(basename "$(readlink -f "$CURRENT")")"
  echo "commit=$(git -C "$CURRENT" rev-parse --short HEAD 2>/dev/null || echo 'نامعلوم')"
} > "$STAGE/MANIFEST"

umask 077
tar -czf "$ARCHIVE" -C "$STAGE" .
chmod 600 "$ARCHIVE"

# نگه‌داشتن آخرین $KEEP روز
mapfile -t old < <(find "$OUT" -maxdepth 1 -name '*.tar.gz' -type f | sort -r | tail -n +$((KEEP + 1)))
for file in "${old[@]:-}"; do
  [[ -n "$file" ]] && rm -f "$file"
done

echo "پشتیبان: $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1)) · ${#old[@]} فایل قدیمی حذف شد"
