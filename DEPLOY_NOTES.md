# Boat4You (main) — Production Deploy Notes

Infra: **cusma1** FE (`nextapp.service`, port 3001, `/home/cusma1/nextapp`, `yarn start`) +
nginx (`/etc/nginx/conf.d/boat4you.conf`); **cusma2/cusma3** backend; **cusma4** DB.
cusma1 source resynced to git HEAD on 2026-06-01.

---

## 2026-06-02 — Raleway → Latin-subset woff2 (commit `29bfbfa`) — ✅ DEPLOYED

**Deployed 2026-06-02 to cusma1, build-on-server** (CI `deploy_prod.yml` couldn't be triggered
from this machine — no `gh`/token). Method: scp'd the 2 changed source files + 18 woff2 onto
`/home/cusma1/nextapp`, paused watchdog, `cp -a .next .next.bak`, `NODE_OPTIONS=--max-old-space-size=2048 yarn build`
(server has full src + devDeps + prod `.env`; build OK in 66s, 0 localhost baked), `sudo -S systemctl
restart nextapp`, re-enabled watchdog, removed `.next.bak`. Live BUILD_ID `u-Za4fwpnDwILePja2vLy`.
Verified on www.boat4you.com: **0 `.ttf`, 7 woff2 = 174 KB** (was ~617 KB, −72%), Raleway renders.

Perf fix #1 for slow mobile LCP: home pulled ~617 KB of `.ttf` fonts (7 weights) that
saturated slow-4G bandwidth ahead of the LCP hero background. All 18 Raleway weights are
now Brotli **woff2**, subset to Latin + Latin-Ext (every shipped locale; drops Cyrillic) →
~23 KB/weight, home payload **~170 KB (−72 %, ~444 KB off the wire)**. `_fonts.scss` is
woff2-first + ttf fallback; the 2 preload `<link>` in `layout.tsx` switched to woff2.
Verified locally (mobile): 0 `.ttf` fetched, Raleway + HR diacritics render, 0 errors.

**✅ Easiest + correct path — GitHub Actions `deploy_prod.yml`** (repo → Actions → "Deploy to
Production" → Run workflow → branch `main`): builds on CI with the prod `.env` secrets and its
tar **includes `public/`** (`tar … .next public src/posts …`), then on cusma1 does
`stop nextapp → rm -rf .next node_modules public → extract → start`. So the 18 new woff2 ship
**automatically** — no manual step. (Note: ~30–60 s downtime during the stop/start swap.)

**⚠️ Only if you hand-deploy** via the "build locally, ship `.next`" recipe below: that tar does
**NOT** include `public/`, so you must also run

```bash
scp public/fonts/Raleway/*.woff2 cusma1:/home/cusma1/nextapp/public/fonts/Raleway/
```

else a missing woff2 → **404 → font silently drops to system sans-serif** (a 404 does NOT trigger
the `.ttf` format-fallback; that only fires for unsupported formats).

The `_fonts.scss` + `layout.tsx` edits ride along in `src` (and bake into `.next`) either way.
The `.ttf` files stay in place as the legacy fallback — do not delete them.

---

## FE deploy (cusma1) — build LOCALLY, ship `.next` (do NOT build on server)

On-server `yarn build` regenerates `.next` from cusma1's source and can silently revert
any `.next`-only deploy. Always build locally from git HEAD and ship the artifact:

1. `scp cusma1:/home/cusma1/nextapp/.env ./.env` (prod URLs) **and `mv .env.local .env.local.devbak`**
   — otherwise `.env.local`'s `NEXT_PUBLIC_BOAT_WS_API_URL=https://localhost:8443` bakes into `.next`
   (→ prod `getFilters ECONNREFUSED 127.0.0.1:8443`, boat pages 404).
2. `rm -rf .next && yarn build`; **verify `grep -rl localhost:8443 .next` == 0** and `api.boat4you.com` present.
3. `tar -czf x.tgz --exclude='.next/cache' .next src messages next.config.js next-env.d.ts package.json yarn.lock`
   (NOT `.env`, NOT `node_modules` — cusma1 reuses its own; package.json/yarn.lock are identical).
4. cusma1: `stop nextapp` → `mv .next .next.bak; mv src src.bak; mv messages messages.bak` → `tar -xzf` → `start`
   → verify localhost boat 200 + journalctl has no ECONNREFUSED. Restore `*.bak` on failure.
5. local: `mv .env.local.devbak .env.local`, `rm .env`, `find src -name '._*' -delete` (macOS tar artifacts).

## nginx (cusma1 `/etc/nginx/conf.d/boat4you.conf`) — NOT repo-managed; recorded here

Backups on server: `boat4you.conf.pre-wpproxy`, `boat4you.conf.pre-redir`.
Inside the `server_name boat4you.com www.boat4you.com;` block:

**1. De-WordPress media proxy** — keeps `wp.boat4you.com` out of all HTML (FE host-swaps WP URLs →
`www.boat4you.com` in `lib/api.ts`; nginx serves them; cusma1 IP is allowlisted by WP):

```nginx
location /wp-content/ {
    proxy_pass https://wp.boat4you.com;
    proxy_set_header Host wp.boat4you.com;
    proxy_ssl_server_name on;
    proxy_hide_header Set-Cookie;
}
```

> FE prerequisite: because blog cards render via the Next `<Image>` optimizer, the
> swapped host **`www.boat4you.com` must be in `next.config.js` images.remotePatterns**
> (added 2026-06-01, commit 86df718). Next matches hostname exactly, so the bare
> `boat4you.com` entry does NOT cover `www` — without it `/_next/image` returns 400 and
> blog images render as broken alt text (the raw `/wp-content` URL still 200s via the
> proxy; only the optimizer fails). Test with `/_next/image?url=<enc www url>&w=384&q=75`.

**2. Retired-blog 301 redirects** (regex `$1` = optional `/locale` prefix, covers all 9 locales):

```nginx
location ~ ^(/(?:fr|de|it|es|pt|nl|pl|hr))?/blog/what-is-a-boat-hostess/?$ { return 301 $1/blog/a-day-in-the-life-on-a-charter-yacht; }
location ~ ^(/(?:fr|de|it|es|pt|nl|pl|hr))?/blog/the-ultimate-guide-to-sailing-north-dalmatia/?$ { return 301 $1/blog/croatia-sailing-guide-2026; }
location ~ ^(/(?:fr|de|it|es|pt|nl|pl|hr))?/blog/is-a-security-deposit-required-for-renting-a-yacht/?$ { return 301 $1/blog/yacht-charter-cost-2026-full-breakdown; }
location ~ ^(/(?:fr|de|it|es|pt|nl|pl|hr))?/blog/what-insurance-is-needed-for-a-yacht-charter-in-croatia-and-greece/?$ { return 301 $1/blog/yacht-charter-cost-2026-full-breakdown; }
```

After editing: `sudo nginx -t && sudo systemctl reload nginx`.

---

## SEO / indexing decisions (GSC, 2026-06-01)

- Boat cards link to clean `/boat/<slug>` (only sailing dates forwarded) — no `?destinations=` crawl spam.
- `/search` indexes only the headline single-destination [× single boat type]; `did` / multi-destination /
  filter combinations are `noindex` (canonical → clean headline). robots.txt must NOT block `?destinations=`
  (curated destination pages in `sitemap-locations` rely on it).
- 5xx / "Page with redirect" buckets were transient (end-May `?destinations=` crawl spike); resolved.

## Recent prod state (2026-06-01)

- web @ git `main` (86df718): LiveCalendar availability, `/api/me` auth, de-WP, SEO fixes,
  `www.boat4you.com` in image remotePatterns (blog-image fix).
- backend @ git `main` 95d0db2: extras period-correct selection, Damage-Waiver-with-skipper from NauSys,
  extras dedupe by partner `externalId`.
