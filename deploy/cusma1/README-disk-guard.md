# nextapp-disk-guard (cusma1)

Instalirano 26.7.2026 nakon DVA disk-full pada boat4you (24.7 i 26.7 — 26G disk).

- Skripta: /usr/local/bin/nextapp-disk-guard.sh (kopija ovdje)
- Timer: /etc/systemd/system/nextapp-disk-guard.timer — svake noći 04:20 UTC, Persistent=true
- Radi: prune ISR page artefakata (.html/.rsc/.meta — NIKAD .js!) >7d (>80% disk: >1d),
  image/fetch cache >7d, deploy tarballi >2d, svi .next.bak-\*, yarn cache, journald cap 200M.
- Disk >85% nakon čišćenja → ERROR u syslog (pokupi ga dnevni log-watchdog mail).
- Provjera: `systemctl list-timers nextapp-disk-guard.timer` + `journalctl -t nextapp-disk-guard`
