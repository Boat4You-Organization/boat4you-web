# Boat4You (main) — Production Deploy Notes

Infra: **cusma1** FE (`nextapp.service`, port 3001, `/home/cusma1/nextapp`, `yarn start`) +
nginx (`/etc/nginx/conf.d/boat4you.conf`); **cusma2/cusma3** backend; **cusma4** DB.
cusma1 source resynced to git HEAD on 2026-06-01.

---

## 2026-09-03 — ⚡🔒 Fleet-audit quick wins: i18n payload 2.35 MB → 330 KB, blog/sitemap robustness, newsletter hardening, headers (commit `2723b201`) — ✅ DEPLOYED

**Deployed 2026-09-03 ~22:30 UTC, build-on-Mac + ship `.next` (COPYFILE_DISABLE=1, start-before-cleanup recipe). Live BUILD_ID `UIT5afA6HjB2sFJbkBi6e`.**

1. **i18n payload (the big one):** `[locale]/layout.tsx` handed ALL 25 message namespaces (2.2 MB, incl. 12 `itinerary*` country catalogues) to `NextIntlClientProvider`, so every page's HTML carried a ~2.2 MB flight payload — measured `en.html` 2,349,987 B; this was also the driver behind the cusma1 ISR disk-full incidents and nextapp memory pressure. Now `src/i18n/clientMessages.ts` lists the 11 namespaces client components actually use (derived from an import-graph walk of all 'use client' roots) and the root layout passes `pickMessages(...)`; the `/itineraries` segment has its own provider adding the `itinerary*` namespaces (builder + route pages read them via `useMessages`). `SuggestedItineraries` (boat page) gets localized route titles from the server instead of pulling `itinerary*` client-side. **en.html 2,349,987 → 330,152 B**; live home 330 KB raw. Itinerary pages unchanged (~2.2 MB, by design). Watch the nextapp journal for `MISSING_MESSAGE` in the first days — adding a namespace back is one line in `clientMessages.ts`.
2. **Blog:** RankMath getHead fetch 1h Data Cache + 5 s timeout, `getBlog` in react `cache()`; `blog/[slug]` metadata + page catch WP failures → notFound() (a WP outage used to 500 every /blog/\* URL in 9 locales).
3. **Sitemaps:** `fetchYachts` throws on `!response.ok` so the 503 fallback branches in `sitemap.xml` / `sitemap-yachts/[page]` are finally reachable — a backend blip returns 503 (GSC retries) instead of publishing an empty/404 yacht index. Search/related/deals callers keep the empty-list UX via `.catch`.
4. **/api/newsletter:** email validation + HTML escaping, unknown fields ignored, per-IP limit 10/h (x-real-ip / last XFF).
5. **Headers:** `poweredByHeader: false` + X-Content-Type-Options / X-Frame-Options SAMEORIGIN / Referrer-Policy / Permissions-Policy from Next. nginx on cusma1 already sends CSP/HSTS/XFO DENY/nosniff/Referrer → some headers are now duplicated (XFO DENY+SAMEORIGIN conflict fails safe). Cosmetic; could drop the Next-level duplicates on b4y later.

**Ops shipped together (one restart):** nextapp `--max-old-space-size` 512 → **1536**, cgroup MemoryHigh/Max 700/800 → **1800/2200 MB** (box 3.8 GB) — the app was heap-OOM-crashing every few days and swapping 1.8 GB. **Server `next.config.js` resynced** to git HEAD (was 64 lines stale — `next start` reads `poweredByHeader` and images config from the server copy, so runtime-read config must be shipped with every deploy that touches it).

## 2026-08-30 — 🗺️ CARTO→OSM basemaps + builder promo content (commits `dc34db7e`, `8cc167fb`) — ✅ DEPLOYED

**Deployed 2026-08-30 to cusma1, build-on-Mac + ship `.next`.** Live BUILD_ID `ew49nPYLK-voUuzLrnQqp`.

1. **Maps:** CARTO started requiring an API key for `basemaps.cartocdn.com` raster tiles —
   keyless requests now render an "API KEY REQUIRED" watermark on every tile (Mario spotted it
   on the builder map). Builder map, day-detail light maps and the custom-itinerary PDF canvas
   now use free `tile.openstreetmap.org` tiles; the light Positron look is recreated with a
   `.tiles-light-mute` CSS filter (web) / white wash (PDF canvas). OSM serves
   `Access-Control-Allow-Origin: *`, so the PDF canvas stays untainted. Same fix shipped to all
   6 sisters (their day-detail maps used the same CARTO URL). If we ever want true Positron
   back: CARTO issues free keys per domain (email + domain at carto.com/basemaps/apikey,
   5M tiles/mo), but the free tier is "intended for non-commercial use".
2. **Builder content:** `/itineraries/builder` had no copy below the hero — added
   server-rendered `BuilderIntro` (2 promo paragraphs, 3 how-it-works cards, 4 highlight
   chips) + an empty-state hint in `CustomBuilder`; 14 new `itinerary.builder` keys × 9 locales.

**⚠️ Ship-recipe hardening (incident during this deploy):** the macOS tar carried AppleDouble
`._*` entries, so on the server `rmdir _stage` failed and — because the swap script ran with
`set -e` — it died AFTER `mv .next` but BEFORE `systemctl start nextapp` → ~2 min downtime
until a manual restart. Rules from now on: **(a)** always create the tarball with
`COPYFILE_DISABLE=1 tar czf …` (documented 25.8, forgotten tonight), **(b)** in the swap script
put the service `start` IMMEDIATELY after the `mv`, with cleanup (`rm -rf _stage`, `rm .next.prev`)
strictly afterwards, so no cleanup hiccup can leave the site down. nextapp serves on **port 3001**
(health check `curl localhost:3001/en` → 307 is normal, root serves 200).

---

## 2026-08-01 — Localized boat-page `<title>` for all 9 locales (commit `c593c35e`) — ✅ DEPLOYED

**Deployed 2026-08-01 to cusma1, build-on-Mac + ship `.next`** (recipe below). The boat detail
`<title>` tail is now a translatable ICU message in `metadata.boat` (`titleTail` / `titleTailNoCity`)
instead of the hard-coded map that served English "Charter" to de/it/nl. Live BUILD_ID
`aal5x7mmNLnztmqStt92Q`. Verified on www.boat4you.com: all 9 locales render native tails
(de "Yachtcharter …", it "Noleggio …", nl "Jachtcharter …", fr "Location …", es "Alquiler …",
pt "Aluguer …", pl "Czarter …", hr "Najam …", en unchanged), canonical + `<html lang>` intact,
home/search/JS chunks 200, `pk_live` baked (no `pk_test`), 0 `localhost:8443`.

Deploy-mechanics updates:

- cusma1 now accepts **key-based SSH** (`ssh-copy-id` of the Mac's `~/.ssh/id_ed25519.pub`,
  2026-08-01) → `scp`/`ssh` need no password; only `sudo systemctl stop/start nextapp` still
  prompts, so the server-side swap script is run by Mario (`ssh -t cusma1@91.98.209.180 '<script>'`).
- **⚠️ CI `deploy_prod.yml` is BROKEN — do not use until fixed.** First-ever run (31.7.2026,
  run 30663101753) failed prerendering `/de` with `fetch('')`: NO repo secrets are configured
  (`gh secret list` is empty), and even with secrets the workflow writes only 6 of the 10 env
  vars the code needs — it misses `NEXT_PUBLIC_STRIPE_KEY`, `NEXT_PUBLIC_IMAGE_CDN_URL`,
  `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_FACEBOOK_APP_ID`, so a "successful" CI deploy
  would ship a build with broken Stripe checkout, broken boat images and disabled Google login.
  A fix task is open (add the 4 echo lines + document the full PRODUCTION\_\* secret set).

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
