#!/usr/bin/env bash
#
# تست دود بعد از استقرار — یک دستور، همه‌ی چیزهای مهم.
#
#   ./smoke.sh --url https://zahrajim.ir --token <کد دسترسی>
#   ./smoke.sh --url https://zahrajim.ir            # بدون کد: فقط بررسی‌های عمومی
#
# چیزی را عوض نمی‌کند و چیزی را پاک نمی‌کند. فقط می‌خواند.
#
# ⚠️ محدودکننده‌ی نرخ را عمداً تست نمی‌کند: ۱۰ تلاش ناموفق، IP تو را برای
#    ۱۵ دقیقه می‌بندد — و آن ۱۵ دقیقه شامل توکن درست هم می‌شود.
#
set -uo pipefail

readonly C_RESET=$'\033[0m'
readonly C_BOLD=$'\033[1m'
readonly C_DIM=$'\033[2m'
readonly C_RED=$'\033[31m'
readonly C_GREEN=$'\033[32m'
readonly C_YELLOW=$'\033[33m'

PASS=0
FAIL=0
ok()   { PASS=$((PASS+1)); printf '  %s✓%s %s %s%s%s\n' "$C_GREEN" "$C_RESET" "$1" "$C_DIM" "${2:-}" "$C_RESET"; }
bad()  { FAIL=$((FAIL+1)); printf '  %s✗%s %s %s%s%s\n' "$C_RED" "$C_RESET" "$1" "$C_DIM" "${2:-}" "$C_RESET"; }
warn() { printf '  %s!%s %s %s%s%s\n' "$C_YELLOW" "$C_RESET" "$1" "$C_DIM" "${2:-}" "$C_RESET"; }
head2(){ printf '\n%s%s%s\n' "$C_BOLD" "$1" "$C_RESET"; }

URL=""
TOKEN=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --url)   URL="${2:-}"; shift 2 ;;
    --token) TOKEN="${2:-}"; shift 2 ;;
    -h|--help) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "آرگومان ناشناخته: $1" >&2; exit 2 ;;
  esac
done
[[ -n "$URL" ]] || { echo "‏--url لازم است." >&2; exit 2; }
URL="${URL%/}"

JAR="$(mktemp)"
trap 'rm -f "$JAR"' EXIT

code() { curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$@"; }

printf '\n%s تست دود — %s %s\n' "$C_BOLD" "$URL" "$C_RESET"

# ---------------------------------------------------------------------------
head2 "۱. دروازه"
c=$(code "$URL/gate")
[[ "$c" == "200" ]] && ok "صفحه‌ی دروازه بالاست" "($c)" || bad "دروازه جواب نداد" "($c)"

for path in /story/p00 /story/p13 /story/p27 /museum /replay /; do
  loc=$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 15 "$URL$path")
  c=$(code "$URL$path")
  if [[ "$c" == "307" && "$loc" == *"/gate"* ]]; then
    ok "$path بدون کوکی بسته است" "→ /gate"
  else
    bad "$path محافظت نشد" "($c → ${loc:-هیچ})"
  fi
done

# ---------------------------------------------------------------------------
head2 "۲. جلوگیری از ایندکس"
hdr=$(curl -sI --max-time 15 "$URL/gate")
grep -qi 'x-robots-tag:.*noindex' <<<"$hdr" \
  && ok "هدر X-Robots-Tag سر جایش است" || bad "هدر noindex نیست"
grep -qi 'referrer-policy:.*no-referrer' <<<"$hdr" \
  && ok "Referrer-Policy: no-referrer" || bad "Referrer-Policy نیست"
grep -qi 'strict-transport-security' <<<"$hdr" \
  && ok "HSTS فعال است" || warn "HSTS نیست" "(اگر هنوز روی http هستی طبیعی است)"

robots=$(curl -s --max-time 15 "$URL/robots.txt")
grep -q 'Disallow: /' <<<"$robots" \
  && ok "robots.txt همه را می‌بندد" || bad "robots.txt درست نیست" "$robots"

# ---------------------------------------------------------------------------
head2 "۳. گواهی"
if [[ "$URL" == https://* ]]; then
  host="${URL#https://}"; host="${host%%/*}"
  info=$(echo | openssl s_client -servername "$host" -connect "$host:443" 2>/dev/null \
         | openssl x509 -noout -dates -subject 2>/dev/null)
  if [[ -n "$info" ]]; then
    until=$(sed -n 's/^notAfter=//p' <<<"$info")
    ok "گواهی معتبر" "تا $until"
  else
    bad "گواهی خوانده نشد"
  fi
else
  warn "روی http هستی" "گواهی بررسی نشد"
fi

# ---------------------------------------------------------------------------
head2 "۴. کد دسترسی"
if [[ -z "$TOKEN" ]]; then
  warn "کد داده نشد" "بررسی‌های پشت دروازه رد شد"
else
  c=$(code -X POST "$URL/api/verify" -H 'Content-Type: application/json' \
        -H "Origin: $URL" -d '{"token":"این-قطعا-غلط-است"}')
  [[ "$c" == "401" ]] && ok "کد غلط رد می‌شود" "($c)" || bad "کد غلط رفتار عجیبی داشت" "($c)"

  c=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 -c "$JAR" \
        -X POST "$URL/api/verify" -H 'Content-Type: application/json' \
        -H "Origin: $URL" -d "{\"token\":\"$TOKEN\"}")
  if [[ "$c" == "200" ]]; then
    ok "کد درست پذیرفته شد" "($c)"
  else
    bad "کد درست پذیرفته نشد" "($c)"
    [[ "$c" == "403" ]] && warn "۴۰۳ یعنی بلوک location /api/ در Nginx هدر Origin را رد کرده"
    [[ "$c" == "429" ]] && warn "۴۲۹ یعنی محدودکننده‌ی نرخ فعال است — ۱۵ دقیقه صبر کن"
  fi

  cookie=$(awk '/wh_access/{print $7}' "$JAR" 2>/dev/null)
  if [[ -n "$cookie" ]]; then
    [[ "$cookie" == "$TOKEN" ]] \
      && bad "کوکی خودِ توکن است — نباید باشد" \
      || ok "کوکی امضاست نه توکن" "${#cookie} کاراکتر"
  else
    bad "کوکی صادر نشد"
  fi

  head2 "۵. پشت دروازه"
  for path in /story/p00 /story/p13 /story/p27 /museum /replay /about-this; do
    c=$(code -b "$JAR" "$URL$path")
    [[ "$c" == "200" ]] && ok "$path باز می‌شود" || bad "$path باز نشد" "($c)"
  done

  body=$(curl -s -b "$JAR" --max-time 15 "$URL/story/p00")
  grep -q 'تشکیل پرونده' <<<"$body" \
    && ok "برگه ۰۰ محتوای درست دارد" || bad "محتوای برگه ۰۰ پیدا نشد"
fi

# ---------------------------------------------------------------------------
head2 "۶. لاگ دسترسی خاموش است"
if [[ -r /var/log/nginx/access.log ]]; then
  host="${URL#*://}"; host="${host%%/*}"
  if grep -q "$host" /var/log/nginx/access.log 2>/dev/null; then
    bad "لاگ دسترسی دارد نوشته می‌شود" "قول /about-this را می‌شکند"
  else
    ok "چیزی از این دامنه در لاگ دسترسی نیست"
  fi
else
  ok "لاگ دسترسی Nginx اصلاً وجود ندارد"
fi

# ---------------------------------------------------------------------------
printf '\n%s%d سبز%s · %s%d قرمز%s\n\n' \
  "$C_GREEN" "$PASS" "$C_RESET" \
  "$([[ $FAIL -gt 0 ]] && echo "$C_RED" || echo "$C_DIM")" "$FAIL" "$C_RESET"
[[ $FAIL -eq 0 ]] || exit 1
