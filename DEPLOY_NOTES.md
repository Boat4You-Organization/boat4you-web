# Boat4You (main) — Production Deploy Notes

Infra: **cusma1** FE (`nextapp.service`, port 3001, `/home/cusma1/nextapp`, `yarn start`) +
nginx (`/etc/nginx/conf.d/boat4you.conf`); **cusma2/cusma3** backend; **cusma4** DB.
cusma1 source resynced to git HEAD on 2026-06-01.

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
