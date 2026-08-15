#!/bin/bash
# nextapp disk guard v4 (15.8.2026) — SATNI run.
#
# ZASTO SE DISK PUNIO: Next pise SVAKU posjecenu stranicu na disk (ISR file
# cache, bez ikakvog limita). boat4you ima deseci tisuca URL-ova (9 jezika x
# itinerari+jahte+kategorije), a stranice su debele (~1.3MB HTML + ~1MB RSC).
# Crawleri + Ads promet na 12k stranica plovila pune cache ~2GB/sat.
#
# ZASTO v4: v2/v3 trim je isao kroz `sort` nad milijunima linija — a sort na
# 100% punom disku ne moze pisati temp fajlove pa UMRE i nista se ne obrise.
# Guard je tako radio uvijek osim bas onda kad je bio najpotrebniji (15.8:
# "trimming oldest..." svaki sat, ISR ostao 8757MB cijelu noc, site 502).
# v4 brise u VREMENSKIM KANTAMA od najstarijih prema novijima dok velicina ne
# padne ispod cilja: nula temp prostora, nula memorije, radi na 0 B slobodno.
# Pravilo iz v2 ostaje: NIKAD ne dirati .js/.nft.json (build output!).
set -u
APP=/home/cusma1/nextapp
LOG="logger -t nextapp-disk-guard"

# Cap se SKALIRA s velicinom diska (radi i nakon upgradea 26G->50G):
# ISR cache smije max 20% diska; kad probije, srezi na 15%; kriza (>90%) na 8%.
TOTAL_MB=$(df --output=size -m / | tail -1 | tr -dc '0-9')
CAP_MB=$((TOTAL_MB * 20 / 100))
TRIM_TO_MB=$((TOTAL_MB * 15 / 100))
CRISIS_TO_MB=$((TOTAL_MB * 8 / 100))
USE=$(df --output=pcent / | tail -1 | tr -dc '0-9')

isr_find() { # $1 = extra find args (e.g. "-mmin +60"), prints matching files' KiB
  # shellcheck disable=SC2086
  find "$APP/.next/server/app" -type f \
    \( -name '*.html' -o -name '*.rsc' -o -name '*.prefetch.rsc' -o -name '*.meta' -o -name '*.body' \) \
    $1 -printf '%k\n' 2>/dev/null | awk '{s+=$1} END {print s+0}'
}
isr_del() { # $1 = extra find args; deletes matching artefacts
  # shellcheck disable=SC2086
  find "$APP/.next/server/app" -type f \
    \( -name '*.html' -o -name '*.rsc' -o -name '*.prefetch.rsc' -o -name '*.meta' -o -name '*.body' \) \
    $1 -delete 2>/dev/null
}

# Bucket trim: minute u kantama 7d,3d,2d,1d,12h,6h,3h,2h,1h,30m,10m,SVE.
# Brise kantu po kantu (najstarije prvo) dok ISR ne padne ispod cilja.
trim_isr_to() { # $1 = target MB
  local target=$1 m kb
  for m in 10080 4320 2880 1440 720 360 180 120 60 30 10 0; do
    kb=$(isr_find "")
    [ $((kb / 1024)) -le "$target" ] && return 0
    if [ "$m" -eq 0 ]; then
      isr_del ""            # kriza: sve je mladje od 10 min — cache se regenerira
      return 0
    fi
    isr_del "-mmin +$m"
  done
}

# --- SIZE CAP (svaki sat, jeftino) ---
ISR_MB=$(( $(isr_find "") / 1024 ))
if [ "$ISR_MB" -gt "$CAP_MB" ]; then
  trim_isr_to "$TRIM_TO_MB"
  ISR_AFTER=$(( $(isr_find "") / 1024 ))
  # log REZULTAT, ne namjeru — v2 je logirao "trimming..." dok je trim bio no-op
  $LOG "ISR ${ISR_MB}MB > cap ${CAP_MB}MB — trimmed to ${ISR_AFTER}MB (target ${TRIM_TO_MB}MB)"
fi

# --- KRIZNI POJAS (svaki sat kad je disk >90%) ---
if [ "$USE" -gt 90 ]; then
  rm -rf "$APP/.next.prev" 2>/dev/null           # rollback zrtvujemo za uptime
  truncate -s 0 /var/log/nginx/*.log 2>/dev/null # guard vrti root — smije
  trim_isr_to "$CRISIS_TO_MB"
  USE_NOW=$(df --output=pcent / | tail -1 | tr -dc '0-9')
  $LOG "CRISIS: disk was ${USE}%, now ${USE_NOW}% (ISR $(( $(isr_find "") / 1024 ))MB, .next.prev dropped, nginx logs truncated)"
fi

# --- nocna/pritisna dubinska metla ---
HOUR=$(date -u +%H)
if [ "$HOUR" = "04" ] || [ "$USE" -gt 80 ]; then
  isr_del "-mtime +7"
  find "$APP/.next/cache" -type f -mtime +7 -delete 2>/dev/null
  find "$APP" -maxdepth 1 -name '*.tar.gz' -mtime +2 -delete 2>/dev/null
  rm -rf "$APP"/.next.bak-* "$APP"/.next.staging /home/cusma1/.cache/yarn 2>/dev/null
  journalctl --vacuum-size=200M >/dev/null 2>&1
  USE2=$(df --output=pcent / | tail -1 | tr -dc '0-9')
  $LOG "deep pass: disk ${USE}% -> ${USE2}% (ISR now $(( $(isr_find "") / 1024 ))MB)"
  if [ "$USE2" -gt 85 ]; then
    $LOG "ERROR: disk still ${USE2}% after cleanup — cusma1 needs attention/bigger disk"
  fi
fi
