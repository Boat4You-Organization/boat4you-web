# Boat4You (main) — Production Deploy Notes

## 2026-09-24 — ✂️ Ime broda bez zalutalih razmaka („' Sunny'" → „'Sunny'") — ✅ DEPLOYED

Mario 24.9.: „sredi to". Partneri šalju ime s razmakom na početku/kraju ili dvostrukim u sredini — skenirano svih 41
`/fleet` stranica: **342 od 12.100** brodova („ Sunny", „BARNEY ", „FILIPPOS I Boat location…"). Stranica broda ime stavlja u
navodnike, pa su naslov, meta description i H1 glasili „Oceanis 52 ' Sunny' (2027)" / „'Barney '". Commit `bedf97e0`,
BUILD_ID `2KnEbAAsuK9IcbaF3iWy7`, rollback `.next.prev` = `orL7SfFl75a2EpCB43flr`.

**Fix:** `src/utils/static/toTitleCase.ts` (koristi se na svih 21 mjesta prikaza) → `trim()` + svaki niz razmaka = jedan razmak;
stranica broda `displayName` fallback `yacht.name?.trim()`; tri sirova spajanja model+ime (Product JSON-LD ime, breadcrumb,
`/search` ItemList) → `.replace(/\s+/g, ' ').trim()`. Ostatak ponašanja `toTitleCase` nepromijenjen (test na 11 primjera).
DB/sync nije diran (ime ostaje kako ga partner šalje — prikaz se normalizira, kao i velika/mala slova).

**Provjera uživo:** 40 od 40 pogođenih brodova ima čist naslov (`'Sunny'`, `'Antonela M'`, `'Maresol (pax 12)'`), EN i DE; rute 200.
Sister stranice nemaju ovaj problem (ne stavljaju ime u navodnike). **Uočeno usput (nije dirano):** EY/CY naslovi ponavljaju
proizvođača („Lagoon Lagoon 40 L'Avventura", „D&D Yachts D&D Kufner 54") i ostavljaju ime velikim slovima („OCEAN'S BLUE").

## 2026-09-24 — 🌍 Meta description stranica brodova na svih 9 jezika — ✅ DEPLOYED

Mario 24.9.: „Na sve jezike treba biti" (nakon GSC pregleda: meta description na stranicama brodova bio je native samo EN
i HR; fr/de/pt/it/es/pl/nl dobivali engleski „Charter the … Check availability and book directly on boat4you.com." —
tekst koji Google prikazuje ispod naslova). Commit `dce7b2ad`, BUILD_ID `orL7SfFl75a2EpCB43flr`, rollback `.next.prev` =
`ilJzTI3EjMd0V8fNM3hn3`.

**Kod:** novi `src/utils/static/boatMetaDescription.ts` (`buildBoatDescription(t, {name, marina, cabins, berths, guests})`
→ `lead. specs. cta`) iz ICU ključeva `metadata.boat.descLead / descLeadFrom / descCabins / descBerths / descGuests /
descCta` u svih 9 `messages/<loc>/metadata.json`. Koristi se na 3 mjesta: meta description stranice broda, Product JSON-LD
fallback stranice broda (kad partner nema opis) i Product opisi u ItemList JSON-LD-u na `/search` (i oni su bili engleski
na svim jezicima). Stari `buildDescriptionEN/HR` + `pluralizeHR` uklonjeni. EN i HR ispis **bajt-identičan** starom
(uspoređeno 2.352 kombinacije marina × kabine 0–40 × kreveti).

**Prijevodi (workflow: 1 nacrt + 7 nativnih recenzenata, svaki renderirao sve oblike kroz `intl-messageformat` iz repoa):**
DE „Yachtcharter {name} ab {marina}… Verfügbarkeit prüfen und direkt auf boat4you.com buchen." · FR „Location {name},
départ {marina}… Vérifiez les disponibilités…" · IT „Noleggio {name} in partenza da {marina}…" · ES „Alquiler de {name}
en {marina}…" · PT (pt-PT) „Aluguer do barco {name} em {marina}…" · PL „Czarter {name} z bazy {marina}…" (sve 4 CLDR
kategorije) · NL „Jachtcharter {name} vanuit {marina}…". Pravila: isti čarter-izraz kao `titleTail` u naslovu, register
kao ostatak stranice na tom jeziku, bez člana/padeža uz proizvoljno ime broda/marine, bez ravnog apostrofa uz `{`/`}`
(ICU), uzorak ≤ 165 znakova. Recenzenti ispravili: „do/up to" nedostajao u jednini (6 jezika), PL „z mariny Alimos Marina"
→ „z bazy", ES „Alquiler {name}" → „Alquiler de {name}", PT „camas" → „beliches" (riječ stranice), IT „dal porto di …
Marina" → „in partenza da".

**Provjera uživo:** meta description na `/…/boat/beneteau-oceanis-52-sunny-19915` na svih 9 jezika na svom jeziku (142–167
znakova); `/de/search` i `/pl/search` ItemList Product opisi na njemačkom/poljskom; rute 200; next-intl 0 grešaka.

**Pre-existing (nije dirano):** ime broda od partnera ponekad ima vodeći razmak („' Sunny'") — `toTitleCase` ne trimma.

## 2026-09-24 — 🔎 GSC: robots za parametarske kopije brodova + blog canonical na EN — ✅ DEPLOYED

Mario 24.9. (GSC Page indexing, www.boat4you.com, stanje 21.9.: indeksirano 53,3K, neindeksirano 232K) → „1 i 2 odradi,
ali želim da čita brodove i na drugim jezicima". Commit `c26170dc`, BUILD_ID `ilJzTI3EjMd0V8fNM3hn3`, rollback
`.next.prev` = `jIJbyOKhFcfJ0U0SySwbY` (build druge sesije, „preferred source" — uključen u ovaj build jer je iz HEAD-a).

**1. robots.txt — `Disallow: /boat/*?` + `/<locale>/boat/*?` (`src/app/robots.ts`).** 51,5K brod-URL-ova s
`?startDate=` / `?did=` / `?destinations=` („Alternate page with proper canonical") Google je obilazio jedan po jedan,
iako svi canonicaliziraju na čisti `/boat/<slug>` — a 2.638 pravih novih brodova čeka u „Discovered – not indexed".
**Jezične stranice brodova ostaju otvorene** (`/de/boat/<slug>` itd., self-canonical, hreflang ×9 + x-default, u sitemapu):
provjereno da su stvarno prevedene (DE/HR dijele svega 16–20 % riječi s EN, opis broda preveden). `/search?…` kategorije
netaknute (indeksirane, u sitemap-categories). Pravila testirana na 17 primjera (Googleova semantika `*`, najduže
pravilo pobjeđuje): 0 odstupanja.

**2. Blog — jedan engleski canonical.** WP daje tijelo posta SAMO na engleskom (`getBlog` ne zna za jezik), pa je
`/nl/blog/<slug>` isti engleski članak u nizozemskom okviru; self-canonical lokalne kopije → 1.324 „Duplicate without
user-selected canonical" (većinom nl/it). Sad: canonical svih lokala = `/blog/<slug>` (RankMath canonical i dalje ima
prednost), hreflang samo `en` + `x-default`, `og:url` = canonical, BlogPosting JSON-LD `@id`/`inLanguage` = EN
(`src/utils/static/blogJsonLd.ts`), `sitemap-blogs.xml` samo EN (504 → 56). Ako postovi jednom dobiju prave prijevode →
vratiti per-locale canonical.

**Provjera uživo:** robots.txt 9 novih pravila; rute /, /fleet, /search, /boat, /de/boat, /blog, /nl/blog = 200; `/nl/blog/…`
i `/hr/blog/…` canonical `/blog/…`, hreflang en + x-default, BlogPosting `inLanguage` en; sitemap-blogs 56 URL-a, 0 s
jezičnim prefiksom; `/boat/…` i `/de/boat/…` self-canonical, hreflang 10, index — nepromijenjeno.

**Deploy:** lokalni build s prod `.env` (obrisan) → pre-ship grepovi (localhost:8443 = 0, api chunks 66, en.html) → tar
30 MB → cusma3 → cusma1 staged swap s guardom „live BUILD_ID se nije promijenio od provjere" (druga sesija danas
deploya) → `nextapp` active.

**Otvoreno (predloženo Mariju):** meta description na stranicama brodova je preveden samo za EN i HR — fr/de/pt/it/es/pl/nl
dobivaju engleski („Charter the … Check availability…"), `src/app/[locale]/(search)/boat/[slug]/page.tsx`
`buildDescriptionEN` fallback. GSC „Validate fix" za 25 × 5xx (svi danas 200/404) — ručno.

## 2026-09-24 — Google preferred source made prominent: footer pill + blog cards (ac9fb841, ✅ LIVE cusma1 BUILD_ID jIJbyOKhFcfJ0U0SySwbY)

Owner: the footer text link "jedva se vidi". Decision: keep yacht/booking pages quiet (their CTA is
the inquiry), make it prominent where it has an effect — the blog (Top Stories / AI Mode for users
who add us).

- `src/components/SvgIcons/GoogleG.tsx` (4-colour Google "G", inline SVG, no Google script).
- `FooterBottomBar.tsx`: caption link → outlined pill (`<a>`, border black200, hover blue50), same
  slot, same key `common.googlePreferredSource`.
- `src/components/GooglePreferredSourceCard/`: blue50 panel + primary button, rendered after the
  article body in `SingleBlogContent.tsx` (before related itineraries/posts) and once under the
  post grid in `BlogsSection.tsx` (`/blog`). Copy `common.googlePreferred.{title,body,button}`
  with `{brand}` = "Boat4you", all 9 locales.
  Verified: served `/` has the pill SVG, `/blog` and a post page render the card (SSR), link
  `google.com/preferences/source?q=boat4you.com`. Rollback `.next.prev` (BUILD_ID yrcu9Ij1HUZkNUWPXwCuY).

## 2026-09-24 — Footer: "★ Add us as a preferred source on Google" (2a909f7d, ✅ LIVE cusma1 BUILD_ID yrcu9Ij1HUZkNUWPXwCuY)

Owner (google.com/preferences): let readers add every site of the family as a Google "preferred
source" (Top Stories / AI Mode ranking for that signed-in user). Google's publisher deeplink:
`https://www.google.com/preferences/source?q=<apex domain>`; plain link, no Google script.

- `src/utils/static/googlePreferredSource.ts` (new): `GOOGLE_PREFERRED_SOURCE_URL` from
  `NEXT_PUBLIC_BASE_URL` hostname minus `www.`, fallback `boat4you.com`. ⚠️ local `.env.local`
  has `NEXT_PUBLIC_BASE_URL=http://localhost:3000` → a local build bakes `q=localhost`; the
  deploy recipe (prod `.env` → `.env.production.local`) bakes `q=boat4you.com` (verified in the
  served HTML).
- `FooterBottomBar.tsx`: one caption line under the Storyset attribution, `target=_blank
rel=noopener noreferrer`; key `common.googlePreferredSource` in all 9 locales. Footer is global
  (hidden by design only on payment-pending/success/cancelled).

Deploy: same recipe as this morning (build 60 s, tar 30 MB, staged swap). Verified: www 200,
served HTML contains `preferences/source?q=boat4you.com`. Rollback `.next.prev` (BUILD_ID
7eVerb8DY51E4vKwAEFnQ = the GeoIP phone default build, also from today).

## 2026-09-24 — 📱 iPhone Duo: datumski prozor nakon preklapanja, /search header po širini, /fleet naslov, install chip — ✅ DEPLOYED

Mario 19.9. („Apple duo je izašao”) → audit svih 7 stranica na formatima iPhone Dua (zatvoren 466×678 / 678×466,
otvoren 890×626, Split View ~445×626); 24.9. „kreni”. Popravljeni nalazi za boat4you.com (commits `1230bdd9` +
`c01dae35`, BUILD_ID `z6DeUMJ49T_rYzZrCVUOw`, rollback `.next.prev` = `7LJoWH_n9LEPNHZQZxO63`).

**1. „Select Dates” sheet otvarao se SAM nakon preklapanja (jedini bug koji postoji samo zbog preklapanja).**
`src/components/DatePickerDropdown/DatePickerDropdown.tsx` držao je DVA open-flaga — `anchorEl` za desktop `<Menu>`
(≥ md = 768) i `isModalOpen` toggle za mobilni sheet — a `handleClose` je okretao oba: zatvaranje menija je „naoružalo”
sheet. Odabir datuma na otvorenom ekranu (890) → preklop na 466 → sheet montiran već otvoren preko početne. Obrnuto
(sheet otvoren na 466 → rasklop na 890) kalendar je nestajao usred odabira. Sad jedan `isOpen` + `anchorEl` samo za
pozicioniranje (`anchorEl ?? buttonRef.current`); `useToggleState` više se ne koristi ovdje.

**2. /search i /boat header biran je jednom, po user-agentu, na serveru.**
`src/app/[locale]/(search)/layout.tsx` + novi `src/components/HeaderSearchSwitch/` (client): UA sada samo sije
`defaultMatches` za prvi render (server HTML = hydration), potom `useMediaQuery(breakpoints.down('lg'))` odlučuje
uživo i prati svaki resize/rotaciju/preklop. ⚠️ Na Duu otvorenom (890) header je i DALJE telefonski — namjerno: cijela
stranica je ispod 1024 px „telefon” (hamburger, filter sidebar `display:none` < lg), pa je ikona filtera u telefonskom
headeru jedini ulaz u filtere. Nuspojava (poboljšanje): desktop prozor 640–1023 px sad dobiva telefonski header s
filterima — prije je dobivao desktop header BEZ ikakvog ulaza u filtere.

**3. /fleet — H1 potpuno ispod fixed headera na SVIM širinama (moja greška od 10.9.).**
`src/views/Fleet/FleetDirectory/FleetDirectory.module.scss`: `.root` padding-top 104 px (telefon) / 120 px u
`@media (width >= 600px)` bloku. Prvi pokušaj (`1230bdd9`) stavio je 120 samo u osnovno pravilo, a blok ≥ 600 px na
kraju datoteke vraćao je 48 → drugi build `c01dae35`. Pouka: pročitati CIJELU scss datoteku, ne samo `.root`.

**4. „Install Boat4You” chip prekrivao gumb „Search boats” na 466×678.**
`src/components/InstallPrompt/InstallPrompt.tsx`: prikazuje se tek kad se posjetitelj poskrola > 160 px (scroll
listener, passive). Cookie sheet nije diran.

**Provjera uživo (headless Chrome, iPhone UA, DPR 3, promjena viewporta BEZ reloada = preklapanje):**

- #1: dates @890 → odabir raspona → sheet zatvoren → preklop na 466: `openLayers=[]` ✅; sheet @466 → rasklop 890:
  `MuiMenu` otvoren, 61 dana vidljivo ✅; natrag na 466: drawer otvoren ✅ (stanje preživi oba smjera).
- #2: /search @890 iPhone UA: telefonski header + 1 ulaz u filtere; resize na 1100 bez reloada → desktop header;
  natrag na 890 → telefonski ✅.
- #3: /fleet H1 top 120/120/104 @1280/890/466, header 89/81/81, `h1Covered=false` ✅ (prije: 48 pod headerom).
- #4: chip na učitavanju `false`, nakon scrolla 600 px `true` ✅.
- Rute /, /fleet, /search, /boat, /hr/ = 200.

**Deploy:** lokalni `next build` s prod `.env` (cusma1 `.env` → `.env.production.local`, obrisan poslije; ⚠️ NIJE u
.gitignore) → pre-ship grepovi (localhost:8443 = 0, api.boat4you.com u chunks = 66, en.html) → tar `.next` (29 MB,
0 AppleDouble) → cusma3 → cusma1 staged swap (guard BUILD_ID + en.html, `sudo -S` iz `/tmp/.p1` chmod 600, obrisan)
→ restart `nextapp`. Gotcha: `ssh -n` na UNUTARNJEM ssh-u odbaci `bash -s < script` (stdin = /dev/null) — prvi
pokušaj swapa tiho ništa nije izveo.

**Nije dirano (svjesno):** cookie sheet na prvom posjetu; „Choose a boat”/sort tab sitnice iz audita.

## 2026-09-24 — Phone dial code defaults to the visitor's GeoIP country (48b35996 + 8c2c0c16, ✅ LIVE cusma1 BUILD_ID 7eVerb8DY51E4vKwAEFnQ)

Owner: clients who never touch the dial-code dropdown sent US-prefixed (the old hard default,
ipapi.co often blocked) or brand-prefixed numbers. nginx on cusma1 now runs GeoIP2
(`libnginx-mod-http-geoip2`, DB-IP country lite mmdb copied from cusma5, `conf.d/00-geoip2.conf`)
and forwards `X-Country-Code` to the app (`location /` in `boat4you.conf`; restart ~1 s).

- `src/proxy.ts`: `withGeoCountryCookie()` sets `b4y_country` (validated 2-letter, upper-case;
  1 y, path /, lax, secure, NOT httpOnly) on all four return paths (intl response, protected
  redirects, token-refresh response). Header absent → no cookie.
- `src/utils/static/geoCountryCookie.ts` (new): `readGeoCountryCookie()`, browser-only, validated.
- `src/components/PhoneInput/PhoneInput.tsx`: default = country in the prefilled form value →
  `b4y_country` cookie → ipapi.co ONLY when the cookie is absent → UI locale when unambiguous
  (de/fr/it/hr/pl/nl; en/es/pt map to nothing) → US. Applied only until the user types or picks.
  Shared dial codes resolve detected country → main country (`PRIMARY_BY_DIAL`: +1 US, +44 GB,
  +39 IT — Italy keeps the trunk 0 in E.164, the Vatican entry would drop it) → first listed.
  E.164 output, formatting, validation (still required) and callers unchanged.

Deploy: prod `.env` → `.env.production.local` → `yarn build` (59 s) → tar `.next` (30 MB) → scp →
`_stage` → stop → `mv .next .next.prev` → start → `chown cusma1`. Verified: www 200,
`Set-Cookie: b4y_country=HR` for a Croatian caller, inquiry modal on a boat page shows 🇭🇷 +385
(was 🇺🇸 +1). Rollback: `.next.prev` (BUILD_ID y4M4frrDu66tpFBorIi6t).
Pre-ship guard gotcha: `grep -rl localhost:8443 .next/server` hits a code COMMENT inside a
source map — check the context before aborting.

Known pre-existing (not touched): `PhoneInput` never displays a prefilled form value (a logged-in
user with a stored number sees an empty required field while the form silently holds `+385…`);
the US-style placeholder `(123) 456-7890` shows for every country.

## 2026-09-18 — 🔴 Boat page: hard-coded "free before 14 Feb 2025" removed + catalogue lists cached — ✅ LIVE 18.9. 20:34 UTC (BUILD_ID `53ZK-Ln4ywrBv16qhyqZt`, swap 1 s; verified: boat page en/hr/de shows the 72 h text and no 2025 date, /terms-and-conditions carries the ADR bullet)

**Found during the 16.-18.9.2026 cusma2 load incident review** (see backend DEPLOY_NOTES same date).

**1. `src/config/availabilityCard.config.ts` + `AvailabilityCard.tsx`:** the Availability tab's three payment-policy
bullets were literal ENGLISH strings from the initial commit, and the green one read _"Cancel and reschedule for free
before 14 Feb 2025"_ — on every boat page, in all 9 locales. The config now stores i18n keys from the `common`
namespace (`100PercentBookingPrepayment`, `bestPriceOnTheMarket` already existed) and one new key
**`freeCancellationWithin72Hours`** in all 9 locales ("Free cancellation within 72 hours of booking" /
"Besplatno otkazivanje unutar 72 sata od rezervacije"). Business rule: free cancellation is the 72-hour cooling-off
window from the moment of booking; on a boat page no booking or option exists yet, so NO date is shown. Rendering is
unchanged (same colours, tooltip = same string).

**2. `src/actions/catalogue.actions.ts`:** the static public catalogue lists were uncached `fetch()` calls — every
listing render hit the API for data that changes once a night. They now carry `next: { revalidate: 3600 }`.
`getModels` stays UNCACHED on purpose: it is the free-text model typeahead (a cacheable fetch writes one persistent
disk entry per distinct URL).

This deploy also ships the pending 17.9. Terms 12.4 change (`1f9fc97a`, Croatian ADR bodies).
Build-on-Mac with cusma1's prod `.env` as `.env.production.local`, pre-ship greps, COPYFILE_DISABLE tar, staged swap.

## 2026-09-17 — ⚖️ Uvjeti 12.4: hrvatska ADR tijela umjesto ugašene EU ODR platforme — ✅ DEPLOYED 18.9.2026.

EU ODR platforma (ec.europa.eu/consumers/odr) ugašena je 20.7.2025. (Uredba (EU) 2024/3228 ukinula 524/2013).
Link je uklonjen 30.5. (f0129d65), ali je u 12.4 ostao "Primjerice:" bez ijednog navedenog mehanizma. ZZP
(NN 19/22, 59/23, 59/26) čl. 60 st. 1 t. 26 i dalje traži informaciju o izvansudskom rješavanju sporova
(tijelo + način pristupa) — samo ODR link više ne.

**Fix:** u `src/posts/static/{en,hr,de,es,fr,it,nl,pl,pt}/terms-and-conditions.md` u 12.4 vraćen prvi bullet:
izvansudsko (alternativno) rješavanje sporova, notificirana tijela — Centar za mirenje pri HGK (Rooseveltov trg 2,
Zagreb) i Centar za mirenje / Sud časti HOK (Ilica 49/II, Zagreb), popis objavljuje Ministarstvo gospodarstva
(izvor: szp.hr, ARPS). Bez URL-a (da opet ne zastari). Drugi bullet ("Boat4You nije obvezan…") i sav ostali
tekst Uvjeta netaknuti; završna rečenica bulleta preuzeta doslovno iz stare verzije po jeziku.

**Deploy:** samo statični sadržaj (.md) — standardni web build → tar → cusma1 staged swap; provjera `/terms` i
`/hr/terms` (sekcija 12.4 ima dva bulleta, `curl | grep -c ec.europa.eu` = 0).

**✅ Deploy 18.9.2026. (Mario: „sredi”) — BEZ builda i BEZ prekida:** `/terms-and-conditions` se NE prerenderira
(nema ga u `prerender-manifest.json`); `getPage()` čita `.md` s diska (`process.cwd()/src/posts/static/<locale>/`) pri
svakom zahtjevu. Commit dira samo 9 `.md`, pa je dovoljno poslati te datoteke na cusma1 (kroz cusma3 jumphost) —
novi `.next` ne treba, restart ne treba. Prije zamjene svih 9 na serveru md5-identično staroj git verziji; rollback kopija
`/home/cusma1/terms_md_backup_2026-09-18.tgz`; nakon zamjene md5 = lokalni HEAD. Uživo svih 9 jezika: status 200,
„Rooseveltov” + „Ilica 49/II” prisutni, `ec.europa.eu` = 0 (HR piše puni naziv komore umjesto „HGK”). ⚠️ Ispravak
gornje upute: URL je `/terms-and-conditions`, ne `/terms`.

## 2026-09-14 — 📅 Change Dates dijalog više ne mijenja visinu — ✅ DEPLOYED

Isti razred greške koji je Mario prijavio na sister sajtovima, ovdje puno manji: MUI dnevna mreža sjedila je
na podu od `minHeight: 276px` za peteroredni mjesec, a narasla na 291px za šesteroredni — dijalog je pri
prvom prelasku (rujan→listopad 2026) dobio **15px (564 → 579)** i zadržao ih.

**Fix:** `fixedWeekNumber={6}` na `MuiDateCalendar` u `src/components/CustomDateCalendar` — uvijek šest
tjednih redova; dodatni red su prazne ćelije (dani izvan mjeseca ostaju skriveni), što je točno prostor koji
je `minHeight` ionako rezervirao.

**Live provjereno:** dijalog konstantan na **564px kroz 8 mjeseci** (prije 564 → 579).
Deploy standardnim putem: lokalni build s prod `.env` s cusma1 → tar (0 upozorenja, valid, 11/11 root html,
bez AppleDouble) → cusma3 → cusma1 → staged swap uz guard na `_stage/.next/server/app/en.html`,
`.next.prev` obrisan prije `mv`. BUILD_ID `Qfk0rgB8mUSJEGyqCActh`. Nakon swapa provjereno: `/`, `/search`,
`/faq`, `/about-us`, `/blog`, `/fleet`, `/de`, `/hr` i detalj plovila — svi 200.

## 2026-09-10 — 🔗 Crawlable /fleet katalog (svako plovilo dobiva HTML link) — ✅ DEPLOYED

**Problem:** `/search` na zahtjev bez URL parametara — a Googlebot uvijek dolazi bez njih — server-renderira
samo 18 plovila, naslovnica nijedno. Cijeli promovirani katalog je za Google postojao samo kao redak u
`sitemap-yachts`, bez ijednog internog linka: otkrivanje jednom, ne put za ponovno indeksiranje. GSC potvrda
s Greecea (ista arhitektura): stranice plovila nose ~3% impresija sajta.

**Rješenje:** `/fleet` + `/fleet/2…41` — server-renderirani katalog svih **12.128** promoviranih plovila
(scope = `PROMOTED_COUNTRY_CODES`, isti kao yacht sitemap), 300 po stranici, grupirano po marini, linkano
sitewide iz footera (`footerMenu.ts`, company kolona) i upisano u `sitemap-static.xml` za svih 9 jezika.

- **Stranica dohvaća SAMO svoja plovila**, ne cijeli katalog: `FLEET_PAGE_SIZE` (300) = točno 3 backend chunka,
  pa je stranica N = chunkovi 3N-2…3N u jednom round tripu. Prva verzija je hodala svih 122 chunka i mjerila
  **213–226 s** — nginx reže na 60 s, pa bi `/fleet` uvijek pucao na prvi zahtjev nakon deploya.
  Live izmjereno nakon zamjene: **/fleet 281 ms**, `/de/fleet` i `/hr/fleet` isto (dijele Data Cache).
- `fetchFleetChunk` je odvojen od `fetchYachts` (koji NAMJERNO ostaje `no-store` — pretraga mora biti živa):
  pina Accept-Language `en` i valutu EUR pa svih 9 jezika dijeli JEDAN cache entry, `revalidate 21600`,
  baca iznimku na loš odgovor uz **jedan retry** (700 ms) na prolazni 429/502.
- `getFleetPage` baca iznimku ako je stranica u rasponu a prazna (inače bi se linkless stranica keširala 6 h);
  `MAX_FLEET_PAGES = 100` odbija apsurdan broj stranice PRIJE ijednog backend poziva.
- **Deploy je išao standardnim putem** (lokalni build s `.env.production.local` s cusma1 → tar → cusma3 →
  cusma1 → staged swap uz guard na `_stage/.next/server/app/en.html`). Integrity: tar warnings 0,
  `tar -tzf` valid, root html 11/11, BUILD_ID `Xo4DzsNEgidUxjCvYAXF0`, `.next.prev` obrisan prije `mv`.
  Nakon swapa provjereno: `/`, `/search`, `/faq`, `/about-us`, `/blog`, `/de`, `/hr` svi 200.

**Datoteke:** `src/utils/static/fleetIndex.ts`, `src/app/[locale]/(root)/fleet/[[...page]]/page.tsx`,
`src/views/Fleet/FleetDirectory/*`, `fetchFleetChunk` u `src/services/yacht.service.ts`,
`src/config/footerMenu.ts`, `src/app/sitemap-static.xml/route.ts`, `messages/<9 locales>/{metadata,navigation}.json`.

**Otvoreno (zaseban ticket):** backend paginacija nije determinističa — 122 chunka vrate 12.128 redaka ali
~12.014 jedinstvenih, tj. ~114 plovila (0,9%) ne uhvati nijedan chunk. Isto pogađa i `sitemap-yachts`, koji
uz to nema dedupe. Fix = pinati `sortBy` + tiebreak po id-u na backend upitu.

Infra: **cusma1** FE (`nextapp.service`, port 3001, `/home/cusma1/nextapp`, `yarn start`) +
nginx (`/etc/nginx/conf.d/boat4you.conf`); **cusma2/cusma3** backend; **cusma4** DB.
cusma1 source resynced to git HEAD on 2026-06-01.

---

## 2026-09-03 — 👥 Social-proof chip on listing cards ("X people are also interested") + es/fr/pt diacritics — ✅ LIVE (00:08 UTC, swap 1 s, chips verified in SSR HTML en/de)

**Why:** Mario (3.9.2026): "napravi istu logiku na boat4you kao na ostalim stranicama — broj ljudi je interesantno za ovaj brod — samo boat4you nema." The urgency cues (social proof, countdown) are INTENTIONAL across the group and must stay.

**What:** `src/components/BoatListingItemCard/BoatListingItemCard.tsx` — same demo logic as the six sister sites'
card: `showSocialProof = id % 10 < 6` (~60 % of yachts), `interestedCount = 30 + (id % 51)` (stable per id).
Chip = blue50 pill, AccessTime 11 px, 11 px/500 text, right-aligned at the top of the price block (list AND grid
view). Desktop reserves 22 px so cards without the chip keep the price at the same height; mobile renders no
placeholder (vertical space is scarce there). Text key already existed in all 9 locales
(`common.peopleAlsoInterested`) but was unused; es/fr/pt strings had lost their diacritics → fixed
("también están", "intéressées", "também estão").

**Ship:** build-on-Mac with cusma1's prod `.env` as `.env.production.local` (`.env.local` stashed), explicit repo
`cd`, pre-ship greps (`https://localhost:8443` in `.next/server` = 0; `api.boat4you.com` present in chunks;
key present in card chunk) → `COPYFILE_DISABLE=1 tar` → cusma1 `/tmp/b4y_swap.sh <BUILD_ID>` (stage-extract,
BUILD_ID check, stop → one `.next.prev` → start IMMEDIATELY → cleanup). Live BUILD_ID `IScT8nRZeE9h1YmDePLsW`.
Verify: `curl -s https://www.boat4you.com/search | grep -c "people are also interested"` > 0 (card is SSR'd).

## 2026-09-03 — ⚡🔒 Fleet-audit quick wins: i18n payload 2.35 MB → 330 KB, blog/sitemap robustness, newsletter hardening, headers (commit `2723b201`) — ✅ DEPLOYED

**Deployed 2026-09-03 22:29 UTC (bad build, see incident) → corrected 22:47 UTC, build-on-Mac + ship `.next` (COPYFILE_DISABLE=1, start-before-cleanup recipe). Live BUILD_ID `VTaL35q5zxNTg-2xr8YeM`.**

**⚠️ INCIDENT (22:29–22:47 UTC, ~18 min): /search had NO listings and no filters.** The 'prod build' shell command ran without an explicit `cd` and executed in the catamaran-charter-greece checkout (cwd carried over from the previous command), so what got shipped was the implementation agent's b4y build made with the dev `.env.local` → `https://localhost:8443` baked into 69 server chunks (`[getFilters] fetch failed: ECONNREFUSED 127.0.0.1:8443`, 258 errors). The pre-ship check `grep -rl localhost .next/server/app` passed because Turbopack emits code into `.next/server/chunks/`, not `app/`. Rules from now on: **(a) every Bash step of a deploy starts with an explicit `cd <repo>`; (b) pre-ship check is `grep -rlE 'https://localhost:8443' .next/server --include='*.js'` = 0 AND `grep -rl api.boat4you.com .next/server/chunks` > 0; (c) never `rm .next.prev` in the same step as the swap when the previous build is the only rollback** (it was, and the rollback copy was gone). Collateral: b4y `.env.local` got overwritten with the greece dev env (reconstructed from prod public keys; Stripe test key + nodemailer creds must be re-entered by Mario) and greece got a stray `.env.production.local` (removed).

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
