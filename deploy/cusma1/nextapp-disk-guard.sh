#!/bin/bash
# nextapp disk guard v2 (26.7.2026) — SATNI run.
# ZASTO SE DISK PUNIO: Next pise SVAKU posjecenu stranicu na disk (ISR file
# cache, bez ikakvog limita). boat4you ima deseci tisuca URL-ova (9 jezika x
# itinerari+jahte+kategorije), a stranice su debele (~1.3MB HTML + ~1MB RSC;
# itinerary i >2MB). Crawleri (Google/Bing) sustavno prolaze sitemap => cache
# raste vise GB/dan i popuni 26G disk svaka ~2 dana. Uz to je svaki deploy /
# kriza ostavljala visegigabajtne .next.prev/tarball ostatke.
# V2: tvrdi SIZE CAP na ISR artefakte (oldest-first) + satna provjera.
set -u
APP=/home/cusma1/nextapp
LOG="logger -t nextapp-disk-guard"
# Cap se SKALIRA s velicinom diska (radi i nakon upgradea 26G->50G):
# ISR cache smije zauzeti max 20% diska; kad probije, srezi na 15%.
TOTAL_MB=$(df --output=size -m / | tail -1 | tr -dc '0-9')
CAP_MB=$((TOTAL_MB * 20 / 100))
TRIM_TO_MB=$((TOTAL_MB * 15 / 100))

USE=$(df --output=pcent / | tail -1 | tr -dc '0-9')

# --- SIZE CAP na ISR artefakte (uvijek, jeftino) ---
ISR_KB=$(find "$APP/.next/server/app" -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.prefetch.rsc' -o -name '*.meta' -o -name '*.body' \) -printf '%k\n' 2>/dev/null | awk '{s+=$1} END {print s+0}')
ISR_MB=$((ISR_KB / 1024))
if [ "$ISR_MB" -gt "$CAP_MB" ]; then
  $LOG "ISR cache ${ISR_MB}MB > cap ${CAP_MB}MB — trimming oldest to ${TRIM_TO_MB}MB"
  find "$APP/.next/server/app" -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.prefetch.rsc' -o -name '*.meta' -o -name '*.body' \) -printf '%T@ %k %p\n' 2>/dev/null \
    | sort -n \
    | awk -v excess=$((ISR_KB - TRIM_TO_MB*1024)) '{if (freed < excess) { freed+=$2; print $3 }}' \
    | xargs -r rm -f
fi

# --- nocna/pritisna dubinska metla ---
HOUR=$(date -u +%H)
if [ "$HOUR" = "04" ] || [ "$USE" -gt 80 ]; then
  AGE=7; [ "$USE" -gt 80 ] && AGE=1
  find "$APP/.next/server/app" -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.prefetch.rsc' -o -name '*.meta' -o -name '*.body' \) -mtime +$AGE -delete 2>/dev/null
  find "$APP/.next/cache" -type f -mtime +7 -delete 2>/dev/null
  find "$APP" -maxdepth 1 -name '*.tar.gz' -mtime +2 -delete 2>/dev/null
  rm -rf "$APP"/.next.bak-* "$APP"/.next.staging /home/cusma1/.cache/yarn 2>/dev/null
  journalctl --vacuum-size=200M >/dev/null 2>&1
  USE2=$(df --output=pcent / | tail -1 | tr -dc '0-9')
  $LOG "deep pass: disk ${USE}% -> ${USE2}% (ISR was ${ISR_MB}MB)"
  if [ "$USE2" -gt 85 ]; then
    $LOG "ERROR: disk still ${USE2}% after cleanup — cusma1 needs attention/bigger disk"
  fi
fi
