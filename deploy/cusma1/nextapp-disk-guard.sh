#!/bin/bash
# nextapp disk guard (26.7.2026) — cusma1 ima 26G; ISR cache + deploy debris
# su ga dvaput napunili do 100% (24.7 i 26.7) i srusili boat4you.
# Svaku noc: obrezi regenerabilne cacheve + pocisti deploy ostatke.
# ISR page artefakti (.html/.rsc/.meta) se regeneriraju on-demand — brisati ih
# je sigurno; .js/.nft.json su BUILD OUTPUT i NIKAD se ne diraju.
set -u
APP=/home/cusma1/nextapp
LOG="logger -t nextapp-disk-guard"

USE=$(df --output=pcent / | tail -1 | tr -dc '0-9')
$LOG "start: disk ${USE}%"

# 1) ISR/page cache artefakti stariji od 7 dana (agresivnije: 1 dan ako je disk >80%)
AGE=7; [ "$USE" -gt 80 ] && AGE=1
find "$APP/.next/server/app" -type f \( -name '*.html' -o -name '*.rsc' -o -name '*.prefetch.rsc' -o -name '*.meta' -o -name '*.body' \) -mtime +$AGE -delete 2>/dev/null
# 2) image/fetch cache stariji od 7 dana
find "$APP/.next/cache" -type f -mtime +7 -delete 2>/dev/null
# 3) deploy ostaci: tarballi stariji od 2 dana, svi .next.bak-*, visak .next.prev NE diramo (1 backup je dozvoljen)
find "$APP" -maxdepth 1 -name '*.tar.gz' -mtime +2 -delete 2>/dev/null
rm -rf "$APP"/.next.bak-* "$APP"/.next.staging 2>/dev/null
# 4) yarn cache (on-server buildovi ne postoje vise)
rm -rf /home/cusma1/.cache/yarn 2>/dev/null
# 5) journald cap
journalctl --vacuum-size=200M >/dev/null 2>&1

USE2=$(df --output=pcent / | tail -1 | tr -dc '0-9')
$LOG "done: disk ${USE2}%"
# 6) glasan alarm u syslog (pokupi ga log-watchdog mail) ako je i dalje kriticno
if [ "$USE2" -gt 85 ]; then
  $LOG "ERROR: disk still ${USE2}% after cleanup — cusma1 needs a bigger disk or manual attention"
fi
