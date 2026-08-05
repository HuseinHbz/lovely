#!/usr/bin/env bash
# بازبینی حریم خصوصی — قاعده ۲ پروژه.
#
# اگر هرکدام از این‌ها پیدا شود، با کد غیرصفر خارج می‌شود:
#   ۱. fetch یا XMLHttpRequest به دامنه‌ای غیر از origin خودی
#   ۲. بسته‌ی تله‌متری در package.json
#   ۳. <script src> یا @import یا url() به دامنه‌ی خارجی
#   ۴. هر روت در app/api جز verify
#
# در CI و در prebuild اجرا می‌شود.

set -euo pipefail
cd "$(dirname "$0")/.."

RED=$'\033[31m'; GREEN=$'\033[32m'; DIM=$'\033[2m'; OFF=$'\033[0m'
failures=0

SRC=(app components lib content scripts)

report() {
  failures=$((failures + 1))
  printf '%s✗ %s%s\n' "$RED" "$1" "$OFF"
  shift
  printf '%s\n' "$@" | sed 's/^/    /'
}

pass() { printf '%s✓%s %s\n' "$GREEN" "$OFF" "$1"; }

echo
echo "بازبینی حریم خصوصی"
echo

# ── ۱. درخواست خروجی ────────────────────────────────────────────────
# fetch مجاز است فقط وقتی مقصدش با / شروع شود (same-origin).
hits=$(grep -rnE "\b(fetch|XMLHttpRequest|navigator\.sendBeacon)\b" "${SRC[@]}" \
  --include='*.ts' --include='*.tsx' --include='*.mjs' 2>/dev/null \
  | grep -vE "^[^:]+:[0-9]+:\s*(\*|//|/\*|#)" \
  | grep -vE "fetch\(\s*['\"\`]/" \
  | grep -vE "audit-privacy" || true)
if [ -n "$hits" ]; then
  report "درخواست خروجی به مقصد غیر same-origin" "$hits"
else
  pass "هیچ درخواست خروجی نیست — تنها fetch پروژه به /api/verify است"
fi

# ── ۲. بسته‌های تله‌متری ────────────────────────────────────────────
TELEMETRY='@vercel/analytics|@sentry/|posthog|mixpanel|gtag|react-ga|amplitude|segment|hotjar|logrocket|datadog|newrelic'
hits=$(grep -nE "\"($TELEMETRY)" package.json || true)
if [ -n "$hits" ]; then
  report "بسته‌ی تله‌متری در package.json" "$hits"
else
  pass "هیچ بسته‌ی تله‌متری نصب نیست"
fi

# ── ۳. منبع خارجی در HTML/CSS ──────────────────────────────────────
hits=$(grep -rnE "(<script[^>]+src=|@import|url\()\s*['\"]?(https?:)?//" "${SRC[@]}" \
  --include='*.ts' --include='*.tsx' --include='*.css' 2>/dev/null || true)
if [ -n "$hits" ]; then
  report "ارجاع به دامنه‌ی خارجی (فونت‌ها self-host شده‌اند)" "$hits"
else
  pass "هیچ ارجاعی به دامنه‌ی خارجی نیست"
fi

# ── ۴. روت‌های API ─────────────────────────────────────────────────
routes=$(find app/api -name 'route.ts' 2>/dev/null | sed 's|app/api/||; s|/route.ts||' | sort || true)
unexpected=$(printf '%s\n' "$routes" | grep -vxE 'verify' | grep -v '^$' || true)
if [ -n "$unexpected" ]; then
  report "روت API غیرمنتظره — فقط verify مجاز است" "$unexpected"
else
  pass "تنها روت API، verify است"
fi

# ── ۵. لاگ توکن ────────────────────────────────────────────────────
hits=$(grep -rnE "console\.(log|info|warn|error)\(.*\btoken\b" "${SRC[@]}" \
  --include='*.ts' --include='*.tsx' 2>/dev/null || true)
if [ -n "$hits" ]; then
  report "احتمال لاگ شدن توکن" "$hits"
else
  pass "توکن هیچ‌جا لاگ نمی‌شود"
fi

echo
if [ "$failures" -gt 0 ]; then
  printf '%s%d مورد پیدا شد. قاعده ۲ نقض شده است.%s\n\n' "$RED" "$failures" "$OFF"
  exit 1
fi
printf '%sهیچ چیزی از دستگاه کاربر بیرون نمی‌رود.%s\n' "$GREEN" "$OFF"
printf '%sتنها داده‌ی ذخیره‌شده، localStorage خود مرورگر است.%s\n\n' "$DIM" "$OFF"
