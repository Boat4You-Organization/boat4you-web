# Boat4You (main) — Production Deploy Notes

## 2026-10-01 — 🧭 Sadržaj: Krka (kupanje zabranjeno od 2021.) + povrat novca = pravilo 72 h — ⏳ NIJE DEPLOYANO

Samo tekst, bez koda. Izvor za Krku: npkrka.hr (kupanje samo na Roškom slapu, Stinicama i Pisku 1.6.–30.9.; uzvodno od Skradinskog mosta voze samo brodovi parka; ulaznica uključuje brod Skradin → Skradinski buk; staza 3,4 km). Izvor za povrat: Uvjeti §7.1 (72 h od rezervacije, puni povrat; nakon toga uvjeti operatera prikazani prije plaćanja).

- **Krka, `public/seo-content` (9 jezika, ~44 rečenice × 9):** maknuto kupanje na Skradinskom buku, „sidrenje kod slapova", plovidba vlastitim brodom / gumenjakom iznad Skradina, „UNESCO bazen", pristojbe „po plovilu"; Marina Zaton (katamaran + jedrilica) prepisana — brod parka ili staza od Skradina.
- **Krka, `messages/*/itineraryCroatia.json` (9 jezika) + `src/config/itinerary/croatia/**` (EN fallback, custom builder):\*\* „zadnje kupanje pod slapovima" → šetnja drvenim stazama; „zabranjeno kupanje ravno pod slapovima" → kupanje na Skradinskom buku.
- **Povrat novca, `public/seo-content` (9 jezika):** ~110 izmišljenih pravila („povrat do 60/30/14 dana prije", „48 h puni povrat", „fleksibilna otkazivanja", vrijeme/kvar = puni povrat) → 72 h besplatno otkazivanje + uvjeti operatera prije plaćanja; predložak „Booking Flexibility and Cancellation Protection" (91 stranica × 9) prepisan.
- **`messages/*/home.json` `riskFreeBooking.cancellingDescription` (9 jezika):** „potpuno bez rizika i fleksibilno" → 72 h + uvjeti operatera.
- Provjere: `scripts/seo-corpus-qa.py --check` 0 nalaza, `check-corpus-holes` OK.
- Deploy: standardni b4y (novi `.next` + `messages` + `public`).

## 2026-10-01 — 🔒 Next.js 16.1.1 → 16.3.8 (sigurnosno izdanje 30.9.) + deploy sada mijenja i `node_modules` na cusma1 — ⏳ NIJE DEPLOYANO (commit `138ede62`)

Codex audit F3 (`codexverify/next.md`). Na 16.1.1 je b4y imao objavljene DoS ranjivosti u Server Components i Server Actions (visoko), zaobilaženje proxyja, request smuggling u rewriteovima i trovanje ISR cachea kod `[locale]/[...rest]`. Zakrpa postoji samo u 16.3.8; zakrpanih 16.1.x ni 16.2.x nema. Samo lokalno, nije pushano.

- **Verzije:** `next`, `@next/third-parties` i `@next/bundle-analyzer` na točno `16.3.8`. `yarn.lock` mijenja samo `next`, `@next/*`, `@swc/helpers`, `postcss`, `sharp` 0.35 (opcionalan, ne koristi se jer je loader custom), `baseline-browser-mapping`, `nanoid`, `semver` i `source-map-js`.
- **`eslint-config-next` ostaje na 15.5.x.** Verzija 16.x je samo flat config i traži ESLint ≥ 9, a b4y je na ESLint 8 + `.eslintrc` + airbnb (airbnb ne podržava ESLint 9). Migracija lint stacka je zaseban posao i ne utječe na runtime.
- **`next.config.js`:**
  - `experimental.turbopackFileSystemCacheForBuild: false`. Ključ je provjeren u `config-shared.js` 16.3.8, gdje je zadana vrijednost `true`. Inače bi `.next/cache/turbopack` išao u deploy tar.
  - `cpus`, `staticGenerationMaxConcurrency` i `staticGenerationRetryCount` u 16.3.8 i dalje postoje (`config-schema`) i ostaju.
- **Regresija nađena u smoke testu i popravljena (deployment id):**
  - 16.3 uz `deploymentId` u `.next/BUILD_ID` piše konstantu `build-TfctsWXpff2fKS` i ignorira `generateBuildId`.
  - Config je id za runtime čitao iz `BUILD_ID`. Zato su dinamički renderi miješali dva id-a: na `/search` je bilo 751× pravi `dpl=` i 90× `dpl=build-Tfcts…`. Klijent bi svaki RSC odgovor s tuđim id-om shvatio kao drugi deployment i klijentsku navigaciju pretvorio u full page load.
  - Sada se id čita iz `.next/required-server-files.json` (`config.deploymentId`). Isto polje postoji i u 16.1.1 buildovima (provjereno na cusma1 `.next` i `.next.prev`), pa novi config radi i nakon rollbacka. `generateBuildId` je maknut.
  - **Marker builda je deployment id, ne `BUILD_ID`.** Deploy skripte su prilagođene.

**Provjere:**

- `tsc` 0 grešaka.
- eslint 0 grešaka (18 starih warninga). Generirani `messages/*.d.json.ts` su izuzeti jer su ignorirani u gitu, a `yarn lint --fix` ih ionako prepravi.
- prettier čist; husky `yarn lint` prošao.
- Build pod lockom, prod API, `cpus=1`: 106–116 s (16.1.1: 118 s). `.next` ima 146 MB, od toga cache 4,3 MB (samo fetch-cache, bez turbopacka); tar je 39 MB. Tablica ruta je identična 16.1.1 buildu.

**Smoke test** (`next start` :3162, curl + headless Chrome, sekvencijalno):

- **Curl:**
  - Početna EN/DE 200. Cookie `NEXT_LOCALE=de` na `/` daje 307 na `/de` s `Vary: Cookie, Accept-Language` i `private`.
  - Brod 200 (title, canonical, 10 hreflang, JSON-LD Product + Breadcrumb + FAQ). Krivi slug daje 308 (i s `/de` i query).
  - `/fleet` i `/fleet/2` 200 (canonical `/fleet/2`). `/deals/early-booking` 200 s bannerom.
  - `/search` s filterima 200 (ItemList). Terms 200 (noindex).
  - `sitemap.xml`, shard `/sitemap-yachts/0/yacht.xml` (6.705 `<url>`) i `robots.txt` 200.
  - 404 URL i nepostojeći brod daju 404 (noindex).
  - `/_next/image?url=…&w=640&q=75` daje 404 (dva URL-a).
  - `/my-profile` bez prijave daje 307 i završi na `/`.
  - `/pdf-image/94856?width=800` 200 `image/webp`. `/llms.txt` i `/api/me` 200.
- **Chrome:**
  - Nema hidracijskih upozorenja ni iznimaka.
  - Link hub: 12 tabova, 140 linkova. Promo banner na početnoj, DE početnoj i deals stranici.
  - Klik na banner (`<Link>`) je soft navigacija: isti dokument, RSC 200, isti deployment id u zahtjevu i odgovoru. Svih oko 25 RSC prefetcha po stranici je 200.
  - Server akcije kalendara broda daju 200 `text/x-component`.
  - Upitna forma: prazan submit daje 5 × „Required”. Nijedan POST nije poslan (Fetch interceptor bi ga srušio).
  - `?currency=USD` prikazuje cijene u $.
- **Produkcijski Origin u Chromeu (samo lokalno):** API i Bunny origin odbijaju `Origin: localhost` (CORS, „Invalid CORS request” na cache MISS za `/pdf-image`). Zato je Chrome test pušten i s Originom prepisanim na www i bez CORS provjere. Tada:
  - Kalendar dostupnosti se učita.
  - Klik na tjedan, pa „Reserve”, je soft navigacija na `/enter-your-details` s formom (ništa nije poslano).
  - PDF broda se preuzme (464 KB, 5 × `/pdf-image` 200).
- **Usporedba s live (16.1.1):**
  - JSON-LD početne i broda identičan po svim listovima (111 i 177).
  - Struktura bodyja identična (linkovi, H2/H3, slike, sekcije, gumbi, tekst).
  - Response headeri isti.
  - U `<head>` su 2 async chunk skripte više (drugačiji bundling). Lokalno nema GA preloada jer build nema GAID.
  - `/fleet/2` lokalno nema CSS preload u `Link` headeru. To je kozmetika.
- **Stripe nije testiran do checkouta.** `/payment` traži rezervaciju kreiranu na produkcijskom API-ju, a to bi bio submit. Stripe.js se učitava na `/enter-your-details` i `/payment`.
- **Postojeće, nije regresija:**
  - 404 stranica u Chromeu nakon hidracije nosi naslov početne. Isto je na live.
  - Upozorenja „CSS preloaded but not used” javljaju se u istom broju kao na live.
  - `/payment` sa spremljenom rezervacijom, a bez `reservationId`: 16.3 preusmjeri na `/`, ali `previewPaymentPhases` iz `Booking.tsx` (zove se i kad se preusmjerava) ode na `/` i u konzoli javi `UnrecognizedActionError`. Live 16.1.1 u istom slučaju baci „Connection closed” i ne preusmjeri. Korisnik završi na `/`.
- **Nije dirano:** `next dev` (pisao bi `AGENTS.md`) nije pokretan. `next-env.d.ts` je i prije bio izmijenjen u radnoj kopiji (build ga generira; 16.3 dodaje `root-params.d.ts`) i nije commitan.

**Deploy (NOVI recept, `infra/deploy-scripts`, backupi `*.bak-1-10`):** prije se na cusma1 slao samo `.next` (+ config, messages, public), a `node_modules` je ostajao iz kolovoza. Build sa 16.3.8 bi se tako vrtio na runtimeu 16.1.1. Sada:

1. **Lokalno (2b):** `node_modules/next` mora biti verzija iz `yarn.lock`, inače ABORT prije slanja. `package.json` i `yarn.lock` idu u runtime tar.
2. **Na serveru, dok nextapp radi:** ako se `package.json` ili `yarn.lock` razlikuju od živih, ili živi `node_modules/next` nije verzija builda:
   - provjera da je slobodno ≥ 4 GB i da je stage na istom filesystemu;
   - `sudo -u cusma1 HUSKY=0 timeout 1800 nice -n 19 ionice -c2 -n7 yarn install --frozen-lockfile --production=false --network-concurrency 4 --child-concurrency 1` u `/home/cusma1/nextapp_nm_stage` (vlastiti yarn cache u stageu, briše se);
   - provjere: verzija `next` jednaka buildu, postoji `.bin/next`, `require('next/dist/server/next')` prolazi;
   - config test s tim `node_modules`.

   Svaki neuspjeh do ovdje je ABORT, a živo ostaje netaknuto (`.next`, `node_modules`, config, messages).

3. **Prozor (samo preimenovanja):** stop → `.next` → `.next.prev` → `node_modules` → `node_modules.prev` → staged unutra → `package.json.prev` i `yarn.lock.prev` → start. Neuspjeh unutar prozora vraća staro i ponovno starta.
   - `.next.prev` i stari `node_modules.prev` brišu se prije stopa, pa je downtime kraći.
   - Na kraju se provjeri `next-server (v16.3.8)` u `ps` i ispiše rollback naredba.
   - Deployment id se ispiše za staged i live, a u koraku 5 broji se `dpl=<id>` na živom `/contact-us` (mora biti > 0).
   - Bez promjene ovisnosti tok je isti kao prije.
4. **Dry run** u Docker kontejneru (Debian, node 24, lažni systemctl):
   - instalacija 952 MB za oko 65 s, swap, `next-server (v16.3.8)`, deployment id u HTML-u;
   - drugi deploy bez instalacije;
   - ABORT (živo netaknuto) na lockfileu koji ne odgovara, na krivoj verziji i na pokvarenom configu;
   - ispisani rollback radi.

   Na cusma1 (2 jezgre) instalacija će trajati nekoliko minuta i odvija se prije stopa.

**Nakon deploya:**

- `ps` mora pokazati `next-server (v16.3.8)`, a `dpl=<deployment id>` mora biti na živom HTML-u.
- Smoke: soft navigacija, server akcije kalendara, PDF.
- Deploy izvan sync prozora.

**Rollback:**

- **(a) Brzi**, dok je `.next.prev` prethodnik ovog deploya: naredbu ispiše skripta. Stop, vrate se `.next.prev`, `node_modules.prev`, `package.json.prev`, `yarn.lock.prev` i `next.config.js.prev`, `DEPLOYED_COMMIT`, start. Novi `next.config.js` radi i na 16.1.1.
- **(b) Uvijek:** `git revert 138ede62`, `HUSKY=0 yarn install`, rebuild i standardni deploy. Tail sam vidi drugačiji `yarn.lock` i instalira staru verziju u stage. `node_modules.prev` se čuva.

## 2026-10-01 — 🔍 Review vala 2: FR PDF brojevi, web-vitals samo u GA4, `<lastmod>` iz `updatedAt`, korpus bez lažnih usluga i rupa — ⏳ NIJE DEPLOYANO (commit `da26d56f`, nadograđuje `73c4afaf`)

Adversarijalni review vala 2 (`73c4afaf` / `1e52b4c4`). Samo lokalno, nije pushano.

- **FR PDF broda (P2, regresija B29):** `Intl` za francuski grupira tisućice znakom U+202F, a ugrađeni Helvetica u PDF-u (WinAnsi) ga ne zna kodirati pa je ispisao `3/702 €` i `1/000 L`. Novi `src/components/YachtPDF/pdfNumber.ts` mijenja U+202F / U+2009 / U+2007 / U+200A u U+00A0 za sve brojeve, cijene i depozit. `yarn test:pdf` (5 testova); pdftotext renderiranog FR PDF-a: `3 702 €`, `1 000 L`.
- **Web-vitals (P3):** eventi imaju `send_to` = GA4 id, pa LCP/INP/CLS više ne idu u Google Ads tag kao remarketing eventi. Callback je stabilan po GA id-u.
- **N7 `<lastmod>`:** id-range yacht shardovi ispisuju `updatedAt` broda iz liste (backend `4d3a303`, V9_71) odmah iza `<loc>`. Bez zapisa ili sa starim jarom nema `<lastmod>`, nikad vrijeme requesta (`src/utils/static/sitemapLastmod.ts`, `yarn test:sitemap` 6 testova). **Deploy tek nakon backend jara**; do tada se ništa ne mijenja.
- **Korpus (`public/seo-content`, 9 jezika):**
  - **Lažne usluge neutralizirane** (subjekt je „your charter operator"/„the charter operator", nikad ime): carina za Albaniju (D-Marin Gouvia ×3), transferi (Tourlos ×2), concierge osoblje u D-Marinu, 24/7 hitna pomoć (Murcia, Taranto, Mandalina ×3, Fethiye i Greece gulet, Kos, Nassau, Athens, Campania), osiguranje (Komolac, BVI, Split west coast), partnerstvo s marinom (Palairos), „release the yacht" (Hotel Armonia), produljenje najma (San Vincenzo, Talamone, Road Town).
  - **Superlativi maknuti:** „most trusted platform / provider / operator / broker / sailing company", „premier choice / provider", „the region's leading charter operator", „unmatched fleet quality" (11 stranica × 9 jezika).
  - **EN rupe koje prvi prolaz nije znao:** „why has become / why is your trusted partner / why remains", „sailors choose for / trust for", „Trust for", „book again with because" (41 stranica), „us's" (20), „with us support", „Learn more about and our", „how works". Nova pravila `holes` + neovisni `HOLE_DENY`.
  - **Prijevodi:** ~85 prijedloga ispred interpunkcije („Schiffe von , die", „par .", „fornite da .", „przez .") i prijevodi EN rupa („warum der Ihr vertrauenswürdiger Partner", „perché è il tuo partner", „Confíe en para", „con perché") — ime ili „naši partneri" vraćeni ručno. HR „Krpanje u Albaniju" → „Krstarenje".
  - **Ostalo:** putanje iza Boat4You linka na bilo kojem jeziku („Boat4You/recherche?…", „Boat4You /how-we-work", „/o-nama"; 60 na Cannigione stranicama), Cannigione dvostruko „na Boat4You" (9 jezika), FR naslovi „Voiliers/Voileux" → „Navigateurs", DE „pro viantieren".
  - **Zaštita:** `HOLE_DENY` i `scripts/check-corpus-holes.mjs` znaju nove oblike te po jeziku prijedlog iza kojeg je samo interpunkcija (na tekstu bez tagova, pa „an</a>." nije nalaz) i prijedlog ispred „because/weil/perché…". `check-corpus-holes --staged` sada čita index, ne radnu kopiju. `python3 scripts/seo-corpus-qa.py --check`: 0 promjena, 0 nalaza.
- **Nije rađeno (svjesno):** proširenje `claims` prepisivanja na sve glagole usluga — korpus ima ~2.500 takvih fraza (B23, otvoreno, posebna odluka); neutralizirane su samo rizične kategorije. Filtriranje localhost pingova u GA4 je postavka u GA4 adminu (filter po hostnameu), ne kod.

**Provjere:** `tsc` čist; eslint i prettier čisti na promijenjenom kodu; `yarn test:pdf` 5/5, `yarn test:sitemap` 6/6; `check-corpus-holes` OK (12.789 datoteka, cijeli korpus i `--staged`). Build nije rađen (mala promjena koda; tsc + testovi).

**Deploy:** standardni b4y (`reference_boat4you_web_manual_deploy`). Korpus je u `public/`, pa ide s buildom. `<lastmod>` se pojavi tek nakon backend jara i prvog yacht synca.

## 2026-10-01 — ✍️ SEO korpus: vraćen „Boat4You" u rečenice (N5) · 🔗 `_gl` sa 6 sistera (N6) · 📈 INP/LCP/CLS u GA4 (E5) · 🧾 PDF brojevi po jeziku (B29) — ⏳ NIJE DEPLOYANO

Codex audit 1.10., val 2 (`codexverify/full_review.md`: N5, N6, N7, E5, B21, B29). Commit `73c4afaf`, samo lokalno,
nije pushano.

- **N5 — kurirani korpus (`public/seo-content`, 974 datoteke, 9 jezika):** prolaz koji je generirao tekstove izbacio je
  „Boat4You" i iz sredine rečenica: „Why Stands Out for Ionian Catamarans", „Contact today to reserve…", „Whether …,
  delivers exceptional value", „facilities.partners with", „transfers are coordinated by.", „Discover why has become…".
  Prisutno od prvog commita (26.5.). **Uzrok nije sanitizer:** `sanitizeCuratedHtml` reže samo head i prvi H1, a ime ne
  dira. Prijevodi rađeni iz pokidanog EN nasljeđuju rupe (DE „Warum Segler zu zurückkehren" ×60, FR „Reviennent Chez",
  NL „Terugkeren Naar", HR „Zašto se ističe" …).
  - Vraćeno je oko 350 EN rečenica i oko 770 mjesta u prijevodima. Nova pravila `holes` u `scripts/seo_corpus_rules.py`
    vrte se nakon `subject`, pa claims pravila odmah prepišu vraćene tvrdnje o vlasništvu („Boat4You has the perfect
    catamaran" → „our partner network has …"). Dodani su i naslovi bez obzira na velika slova te jednokratni EDITS za
    prekinute rečenice. Gdje je jedan prijevod sačuvao original (PL piso-livadi, DE/FR italy-power), ostali su poravnati
    prema njemu. Prijevodi su jednom popravljeni blok po blok prema EN popravku (skripta izvan repoa); generičko ide kroz
    pravila.
  - Usput popravljeno: interna bilješka „Call to action:" kao naslov (6 stranica × 9 jezika), putanje
    „Boat4You/search?destinations=…" ispisane kao tekst iza linka (Cannigione), zalutala devanagari, bengalska, mjanmarska
    i grčka slova u prijevodima (NL „पहली बार", HR „ပေါ", DE „μποέμsten").
  - **B21:** Krka više nije „inland waterways" (Zaton i Šibenik regija, 9 jezika). ⚠️ Stranica Marina Zaton i dalje
    opisuje plovidbu rijekom i kupanje na Skradinskom buku (zabranjeno od 2021.); treba prepisati, nije dirano.
  - **Da se ne vrati:** `python3 scripts/seo-corpus-qa.py --check` ima neovisne provjere `brand-hole` i `foreign-glyph`
    (sada 0 promjena, 0 nalaza). Novi `scripts/check-corpus-holes.mjs` je u `yarn lint` (`--staged`, ispod 1 s; cijeli
    korpus oko 5 s). Samoprovjera na HEAD kopijama hvata sve oblike.
- **N6 — cross-domain (`src/config/crossDomainLinker.ts`, `[locale]/layout.tsx`):** `gtag('set','linker',{domains: 7
domena, accept_incoming: true})` u istoj inline head skripti kao consent default, prije nego gtag.js vrti prvi
  `config`. Posjet sa sistera s `?_gl=` zadržava GA client id i Ads klik (AW-11060948992 je isti na svih 7). Consent
  Mode je nepromijenjen: bez pristanka linker ne piše kolačić. Isti popis dekorira i naše linkove prema sisterima
  (footer). Sisteri moraju dekorirati „Reserve" link (njihov dio).
- **E5 — Web Vitals (`GoogleAnalyticsConsent.tsx`):** `next/web-vitals` (bez nove ovisnosti) šalje INP, LCP i CLS kao
  GA4 evente imena metrike, s parametrima `value`, `metric_id`, `metric_value`, `metric_delta`, `metric_rating`,
  `debug_target` (element) i `debug_event` (tip interakcije za INP). Šalje se samo uz ANALYTICS pristanak i nikad na
  `/review`. **Mario:** u GA4 Admin → Custom definitions registrirati `metric_rating`, `debug_target`, `debug_event`
  (dimenzije) i `metric_value` (metrika), inače se ne vide u izvještajima.
- **B29 — PDF broda (`YachtPDF.tsx`, `useYachtPdfDownload.tsx`):** cijene, duljina, širina, tankovi i depozit sada su u
  jeziku stranice. Prije su tankovi i depozit bili en-US, a cijene hr-HR. Oznake PDF-a ostaju engleske (dizajn 10.7.).
- **FR `itineraryGreece`:** „grotte Cave of the Wall" → „grotte du Mur (Cave of the Wall)".
- **N7 — `<lastmod>`: TODO, nije implementirano.** Backend `updatedAt` (`boat4you-ws-main` `4d3a303`, V9_71) nije live:
  `GET /public/yachts?sortBy=id&idFrom=3400&idTo=3500` 1.10. poslijepodne nema polje. Nakon backend deploya treba:
  `updatedAt?: string | null` u `YachtModelShortInfo`, `<lastmod>` u `sitemap-yachts/[page]/yacht.xml` samo kad nije
  `null`, a prazno ili staro polje znači bez `<lastmod>`. Nikad vrijeme requesta.
- **Lažno pozitivni iz statičkih provjera (Codex), bez promjene:**
  - B38 „nested `<a>`" (checker ne prepoznaje `</a >`; html.parser nalazi 0 u 12.789 datoteka);
  - B32 TrustBadges (literal je samo u komentaru);
  - B29 „7 NIGHTS" (samo u komentaru);
  - B06 `htmlLimitedBots` (postoji kao `HTML_LIMITED_BOTS`).
  - B23 („Boat4You manages") i B35 (did/natpis) ostaju otvoreni (P3).

**Provjereno lokalno** (build `73c4afaf` pod build lockom, `next start :3153`, prod API):

- EN `/search?destinations=palairos&boatTypes=CATAMARAN`: „Why Boat4You Stands Out for Ionian Catamarans", „Contact
  Boat4You today", „facilities. Boat4You partners". HR: „Zašto se Boat4You ističe za jonske katamarane". DE: „Warum
  Boat4You für Katamarane im Ionischen Meer herausragt".
- `dataLayer` redom: consent default (denied) → `set linker` (7 domena, `accept_incoming`) → `js` → `config`. `?_gl=`
  ostaje u URL-u, a krivi slug broda (`/boat/old-slug-3445?_gl=…`) daje 308 s `_gl` u `Location`.
- Vitals:
  - bez pristanka nijedan event;
  - s analytics pristankom (gtag zamijenjen snimačem, ništa nije otišlo u GA) LCP event s
    `debug_target: h1.HeroSection…` i `metric_rating: good`.
- PDF `/de/boat/…-3445`: „12,4 m", „12,35 m", „3.702 €", „Security deposit 3.000 €" (prije „€3,000").
- Shard `sitemap-yachts/3`: 5.904 `<loc>`, 0 `<lastmod>`.
- tsc čist, eslint `src` 0 grešaka, `seo-corpus-qa.py --check` exit 0.

**Deploy:** standardni web build → tar → cusma1 swap, **s `public/`** (korpus) i `messages/`. Provjera uživo:

- `curl -s 'https://www.boat4you.com/search?destinations=palairos&boatTypes=CATAMARAN' | grep -c 'Why Boat4You Stands Out'`
  daje ≥ 1;
- `curl -s https://www.boat4you.com/ | grep -c "set','linker'"` daje ≥ 1.

## 2026-10-01 — ⚡ Stranica broda 1 dohvat + rok 8 s · 🗺️ sitemap brodova po rasponu id-eva · ⚖️ Uvjeti: 72 h besplatno otkazivanje — ⏳ NIJE DEPLOYANO

Codex audit 1.10. (F2, F7, F8), verificirano (`_seo-audit-2026-10-01/codex-review/`). Commitovi `723704c6` (F2),
`9ffbc079` (F7), `62e0c1b9` (F8) + review popravci `da16e778` (RelatedBoats, F8 tekst), samo lokalno, nije pushano.

**Redoslijed:** ovaj deploy ide PRIJE backend deploya teških upita (`boat4you-ws-main` `4f0f815` + `f4dbb23`) ili u istom
prozoru — backend pod naletom namjerno vraća 503 + `Retry-After` na `/public/yachts`, a stari `RelatedBoats` je to
ponavljao (~9,5 s po stranici broda).

- **F2 — stranica broda (`yacht.actions.ts`, `boat/[slug]/page.tsx`):** `generateMetadata` i stranica su svaki
  dohvaćali `/public/yachts/{slug}` (zbog `signal` ih Next nije spajao → API je vidio dva ista GET-a u sekundi po
  stranici). Sad je dohvat React `cache()` po (slug, query, jezik), a metadata pita s valutom i jezikom stranice (ne
  mijenjaju nijedno polje koje metadata čita) → **jedan dohvat po renderu**. Rok cijelog poziva s retryjima
  (`fetchWithRetry`) **25 s → 8 s**: zdrav detalj je 0,1–0,2 s; kad je backend pool iscrpljen čeka 20 s na vezu, pa je
  25 s samo držalo posjetitelja do nginx 499. Nakon 8 s stranica daje 500 → nginx 503 + Retry-After.
- **F7 — sitemap brodova (`sitemap.xml`, `sitemap-yachts/[page]/yacht.xml`, `utils/server/yachtSitemapShards.ts`):**
  dijelovi su bili stranice živog „Recommended" poretka (po cijeni), svaki zaseban ISR unos u drugom trenutku → brod je
  prelazio granicu: dupli i propušteni (B03 nije bio stvarno riješen). Sad dio k = brodovi s id-em u
  **[k·1000, (k+1)·1000)**, backend `sortBy=id&idFrom&idTo`, po 100 keysetom (sljedeće čitanje kreće iza zadnjeg id-a,
  nikad offset). Broj dijelova iz najvećeg id-a (`sortBy=idDesc&size=1`). **1000, ne 100:** danas je 20 od 202
  stotke-raspona prazno (20 × 404 u indexu); nijedan tisućni nije (21 dio, najviše 768 brodova = 6.912 URL-ova).
  Greška i dalje baca (ISR drži zadnju dobru verziju); odgovor izvan raspona ili ne po id-u baca; prazan raspon → 404
  (prazan katalog baca).
- **F8 — Uvjeti (`src/posts/static/<9 jezika>/terms-and-conditions.md`):** Mario 1.10.: „klijent uzme plovilo, plati i u
  roku od 72 sata se odluči da ipak neće, mi mu sve vraćamo bez pitanja… sve ručno, samo treba pisati". 7.1 novi prvi
  bullet: svaka rezervacija na Platformi može se besplatno otkazati u roku od 72 sata od trenutka rezervacije, **a
  najkasnije do početka najma**, bez navođenja razloga; Boat4You vraća cijeli plaćeni iznos, uključujući service fee i
  **naknadu za plaćanje karticom ili bankovnim prijenosom koju je naplatio Boat4You; trošak povratne uplate snosi
  Boat4You**; nakon 72 h vrijede redovni uvjeti. Uvod 7.1: „If you need to cancel a booking, the following applies"
  (bez „confirmed" i „generally", koji su ublažavali bullet). 6.9 i bullet Service Fee: „nepovratno" / bankovne
  naknade kupca sad imaju iznimku za 72 h. NL: u istom retku popravljen razbijeni bold (`\***\*Boat4You** …`).
  E-mailovi, checkout, My Bookings i FAQ NEtaknuti (Mario). Review `da16e778`: granica „do početka najma" (inače
  rezervacija < 72 h prije check-ina daje pravo na puni povrat i nakon isplovljavanja) i točan opseg povrata (prije
  „payment processing and bank fees" — čitljivo i kao naknade kupčeve vlastite banke). ⚠️ Sisteri imaju istu klauzulu
  bez granice početka najma (CC `termsOfService.config.ts:235` i ostalih 5) — izvan Mariova opsega F8 („samo b4y"),
  NIJE dirano.
- **Review — RelatedBoats (`views/Boat/RelatedBoats`, `services/yacht.service.ts`, `utils/server/fetchWithRetry.ts`):**
  „slični brodovi" su lista `/public/yachts` (`did=l-…`, `size=12`), koju backend gate pod naletom odbija s 503 +
  `Retry-After` (nakon do 1,5 s u redu). S uobičajenim retryjima (0,5/1/2 s) svaka stranica broda čekala je ~9,5 s pa se
  ionako renderirala bez sekcije. Sad **jedan pokušaj, rok 2 s** (`fetchYachts` opcija `singleAttemptMs`;
  `fetchWithRetry` prima listu backoffa pozivatelja, `[]` = bez retryja). Ostali pozivatelji nepromijenjeni.

**Provjereno lokalno** (build `dfb4a5e2`+promjene, `next start :3143`, prod API, logger na `fetch`): lejla-11707 EN,
HR s datumima, DE `?currency=USD`, IT bali-41 s datumima → **točno 1 poziv `/public/yachts/{slug}`** po renderu (+1
lista related), title/description/canonical isti kao live; nepostojeći brod → 404 s 1 pozivom. Sitemap: index 200, **21
dio, svi 200**, dio 21 → 404; **94.824 `<loc>`, 0 duplikata, 10.536 brodova × 9 jezika = API total 10.536 (razlika 0)**,
svi id-evi u svom rasponu i rastućem redu. `/terms-and-conditions` u 9 jezika 200, klauzula prisutna (6 × „72" u tekstu).

**Deploy:** F2 + F7 = standardni web build → tar → cusma1 swap. F8 sam ne treba build (getPage čita `.md` s diska,
recept 18.9.), ali ide s istim deployem. Nakon deploya: `/sitemap.xml` lista `sitemap-yachts/0…20`; stari URL-ovi
dijelova 21–105 postaju 404 (nisu više u indexu, Google ih ispušta). Provjera uživo: `curl /sitemap.xml | grep -c
sitemap-yachts` = 21, dio 0 i 20 = 200, `/terms-and-conditions` + `/hr/…` imaju „72".

## 2026-10-01 — 🔗 Naslovnica: blok ključnih riječi i linkova na dnu (6 tabova, 140 linkova, 9 jezika) — ⏳ NIJE DEPLOYANO

Mario 1.10.: „napravi to ali stavi na dnu main paiga od boat4you, neka bude kao što su napravili na Borrow a Boat… više nam je
to da Google vidi ključnu riječ i link na to". Commitovi: `211705e3` + review popravci (`fix(home): link hub review fixes`),
samo lokalno, nije pushano.

- **Gdje:** zadnja sekcija naslovnice, odmah iznad footera (iza `SeoTextSection`). `src/views/Home/HomeLinkHub/` (server
  komponenta, bez MUI i bez vlastitog JS-a), popis u `src/config/homeHub.config.ts`, filtar u `src/utils/server/homeHubLinks.ts`.
- **Kako:** tabovi su radio + label, „Prikaži više" je checkbox (samo CSS). Svih 140 linkova svih tabova je u server HTML-u
  (12 vidljivo po tabu, ostatak skriva CSS), bez `title`, bez `nofollow`, bez brojeva. Linkovi su obični `<a>` s
  `getPathname` hrefom (ne next-intl `Link`, koji je klijentska komponenta → 140 hidratacija), bez prefetcha.
- **Izgled:** mobitel i tablet (< 1024 px): tabovi su „chipovi" koji se lome u 2–3 reda (svih 6 vidljivo, nema skrivenog
  bočnog scrolla); desktop: jedan podvučeni red. „Prikaži više/manje" stoji između prvih 12 linkova i ostatka, pa se kod
  „Prikaži manje" ne pomiče s ekrana.
- **Filtar:** /search landing se linka samo dok ga landing manifest drži indeksabilnim u tom jeziku (isti URL builder kao
  sitemap); itinerari i vodiči cijena dok su u configu; modeli dok su u katalogu modela. Tijekom `next build` hub se ne renderira
  (bez navale na produkcijski API). Spor ili pao izvor (manifest, indeks destinacija, katalog modela, > 3 s ukupno) više ne
  briše linkove: služi se zadnja dobra lista tog procesa (po jeziku) uz `console.warn` `[homeHub] …`; link otpada samo kad ga
  svježa lista izostavi. Bez huba je samo hladan proces koji još ništa nije složio.
- **Prijevodi:** `messages/<9 jezika>/homeHub.json`. **Pravilo vlasništva ključnih riječi:** nijedan anchor ni naslov ne smije
  sadržavati „catamaran charter Croatia/Greece/Italy/Caribbean/BVI" ni „yacht charter Croatia/Greece/Italy/Spain/Türkiye" (ni
  prijevode, ni ES/FR/IT/PT „alquiler/location/noleggio/aluguer" oblike koje sisteri koriste). „Yacht charter Split" je naš.
- **Landing naslovi (`landing.json` `override`, svih 9 jezika):** katamaran × Hrvatska/Grčka/Italija/BVI/Martinique dobiva
  naslov bez sisterovog head terma (EN „Catamaran rental in Greece", DE „Katamaran mieten in Griechenland", PL „Wynajem
  katamaranów w Chorwacji"…). Review popravak: i **motorni katamaran** × Hrvatska/Grčka/Italija/BVI/Martinique te katamaran
  i motorni katamaran × Bahami/Grenada/Karibi/Sjeverna Grčka i Egej/talijanski Jadran (EN „Power catamaran rental in Croatia",
  „Catamaran rental in the Bahamas", DE „Motor-Katamaran mieten in Kroatien") — +144 overridea (16 kombinacija × 9 jezika).
  Mijenja `<title>`, H1 i meta description tih landinga (gdje landing postoji). Kod (`landingCopy.ts`) čita override za
  svaki jezik.
- **Provjera:** `yarn check:home-hub` (dio `yarn lint`, pre-commit): ključevi, jedinstveni anchori, zabranjeni izrazi u
  anchorima i u **svakom landing naslovu koji predlošci mogu složiti** (mjesto iz `landing.in` × bez tipa / svaki tip broda,
  override → lead → default, h1 + meta; 10.413 tekstova), složenice (Segelyacht-Charter, Zeiljachtcharter, Motoryacht charter,
  Motorkatamaran) i samotest 53 loša / 27 dobrih izraza. Jahte (vidi Otvoreno) se ispisuju kao „pending", ne ruše provjeru.

**Provjereno lokalno** (`next start :3130`, prod API, build `8e341f07`+promjene): na `/`, `/de`, `/es`, `/fr`, `/hr`, `/it`, `/nl`,
`/pl`, `/pt` hub je zadnji prije footera, **140/140 linkova u svakom jeziku, 0 filtriranih**, redoslijed = config; svih 1.260 hrefova
je u live sitemapovima (30.9.), ispravan jezični prefiks, 0 `title`/`rel`, 0 zabranjenih izraza. Landing override radi
(`/search?destinations=greece&boatTypes=CATAMARAN` EN + DE, PL croatia, FR BVI, IT martinique: title = H1 = override, index).
Headless Chrome bez JS-a (1400 px i 375 px): tabovi i „Prikaži više/manje" rade, nema horizontalnog scrolla stranice; tipkovnica:
Tab → tab, strelica → sljedeći tab, 12 × Tab kroz linkove, Space na „Prikaži više".

**Veličina naslovnice:** nakon review popravka **+≈72 KB raw / +≈7 KB gzip** po jeziku (EN 445.358 → 516.945 B; HTML huba
≈27 KB + RSC payload ≈44 KB), prije +≈119 KB raw / +≈9,7 KB gzip s next-intl `Link`.

**Review popravci provjereni lokalno** (build `211705e3`+popravci, `next start :3132`, prod API): 9 jezika × 140 = **1.260
hrefova** = sitemap `<loc>` (30.9.), ispravan prefiks, redoslijed = config, „Prikaži više" između listi (12 + 13/8). Headless
Chrome (de 390/1400, fr 360/900, pl 768): svih 6 tabova vidljivo, bez bočnog scrolla; „Prikaži manje" ostaje na istom mjestu
(y prije = y poslije); strelica → zadnji tab vidljiv, prsten 2 px izvan labele, jedan Tab → prvi link; 0 JS grešaka. Landing:
EN croatia×motorni katamaran, DE bahamas×katamaran, FR grenada×katamaran → title = H1 = override, index.

**Otvoreno, za Marija:**

- **Jahte × „yacht charter + zemlja" (postojalo prije huba):** landing naslovi jedrilica/motornih jahti × Hrvatska/Grčka/
  Italija/Španjolska/Türkiye (EN „Sailing yacht charter in Croatia", „Motoryacht charter in Greece") i vodiči cijena „Yacht
  charter prices in Croatia/Greece/Italy" — hub linka 11 takvih stranica (anchori su čisti: „Sailboat charter in Croatia",
  „Croatia charter prices by month"). Isto vrijedi za naslove država bez tipa u de/es/fr/it/nl/pt („Yachtcharter und
  Bootsverleih in Kroatien"). Odluka: override (+ novi naslov vodiča cijena) ili maknuti tih 11 linkova. Do odluke ostaju,
  a provjera ih ispisuje kao pending (278 tekstova).
- **ES/FR/PT obiteljski oblici:** „Catamaranes de alquiler", „Catamarans à louer", „Catamarãs para alugar" su blizu sisterovih
  „Alquiler/Location/Aluguer de catamarã…" (Google ih tretira kao istu obitelj riječi) — potvrditi sva tri zajedno.
- **Pre-existing (nije hub):** na mobitelu chat gumb prekriva „Install Boat4You" traku (gumb Instaliraj i ×).

**Deploy napomena:** prerenderana naslovnica iz builda nema hub; pojavi se na prvoj ISR revalidaciji (zagrijati naslovnice
×9 dvaput, s razmakom). Provjera nakon deploya: `curl -s https://www.boat4you.com/de | grep -c 'home-hub-title'` = 1.

## 2026-10-01 — 📱 Mobitel: nema više zumiranja kad se dotakne polje — ✅ DEPLOYED

Mario 1.10. (screenshot, filteri na /search): „kada se na mobitelu traži filter, onda radi zum… ne smije biti zumiranja".
iOS Safari sam zumira stranicu kad polje ima font < 16 px; nakon toga klijent teško vraća pravu veličinu.
Commit `bcc59495`, BUILD_ID `bcc59495e3ce-mup71x3r`, rollback `.next.prev` = `a52960d9` build.

- `src/styles/globals/_base.scss`: samo na zaslonima na dodir (`(hover: none) and (pointer: coarse)`) `input`/`textarea`/
  `select` dobivaju `font-size: max(16px, 1em) !important`. Izuzeti: checkbox/radio/range/file/hidden i Tailwind
  `text-[…]` polja. Pinch-zoom ostaje (nismo dirali `viewport`, pristupačnost).
- **Mjereno uživo (iPhone UA, touch, 390×844):** naslovnica, /search, filteri, stranica broda, kontakt → 0 polja ispod 16 px
  (prije 13/14 px). **Desktop (1440, miš):** nepromijenjeno, polja filtera ostaju 13 px.
- **Deploy:** `infra/deploy-scripts/b4y_web_deploy.sh` → zagrijavanje 139/139 OK, SEO regresija bez novih grešaka.
- Isto pravilo na svih 6 sistera (isti dan).

## 2026-10-01 — 🔎 Mobilna tražilica: promjena samo datuma + brz kalendar — ✅ DEPLOYED

Mario 1.10. (screenshot, /search na mobitelu): „stavim datum i vrstu plovila, a kad idem promijeniti samo datum, ne mogu,
moram ponovno pretisnuti vrstu plovila" + „grozno je sporo kada se pretisne datum, sporo otvara kalendar".
Commit `a52960d9`, BUILD_ID `a52960d92b4f-mup5llj5`, rollback `.next.prev` = `0309268f` build.

**1. Gumb „Pretraži brodove" neaktivan:** `GeneralSearchBarMobile.tsx` ga je palio samo kad forma ima `did`. Landing i sitemap
URL-ovi nose `?destinations=croatia` BEZ `did` → chip „croatia" vidljiv, gumb sivi. Korak vrste plovila je „radio" jer sam zove
`form.requestSubmit()` mimo gumba. Sad vrijedi i ime destinacije: `disabled={!did?.length && !destinations?.length}`.

**2. Kalendar spor (izmjereno uživo, mobitel, CPU ×4):** otvaranje 4,0 s blokade glavne niti, tap na dan 1,7 s (bez usporavanja
808 ms / 315 ms).

- `CustomDateCalendar.tsx`: `slots.day` je bio inline arrow → novi tip komponente svaki render → React je rušio i ponovno gradio
  svih ~460 dana na svaki render. Sad modul-level `CalendarDay`, vrijednosti kroz `slotProps.day`.
- `DatePickerDropdown.tsx` + novi `LazyMonth.tsx`: mobilni sheet je montirao 15+ MUI kalendara odjednom. Sad prva 2 odmah, ostali
  kad se približe (IntersectionObserver na scrolleru sheeta, `rootMargin` 600 px, placeholder iste visine 286 px).

**Mjereno (CPU ×4):** otvaranje 4,0 s → **0,53 s** do vidljivih dana (live), tap na dan 1,7 s → **0,39 s**; mjeseci se dodaju
skrolanjem do prosinca 2027; samo-datum tijek (04.–12. lis.) → gumb aktivan. Regresija na lokalnom prod buildu: desktop i mobilni
kalendar naslovnice (raspon OK), kalendar na stranici broda (raspon 9 dana), 0 grešaka u konzoli.

**Deploy:** jedan lokalni build (cpus=1) → provjera na `next start :3999` → `infra/deploy-scripts/b4y_web_ship.sh` (isti `.next`,
bez drugog builda) → zagrijavanje 139/139 OK.

## 2026-10-01 — 📱 Kartica broda: oznaka „Dostupno"/„Pod opcijom" više ne ulazi pod sliku — ✅ DEPLOYED

Mario 30.9. (screenshot s mobitela, /hr/search): oznaka dostupnosti na kartici broda ulazila je ispod fotografije.
Commit `0309268f`, BUILD_ID `0309268fa172-mup4zjje`, rollback `.next.prev` = build 30.9. (13663438).

**Uzrok:** `src/components/BoatListingItemCard/BoatListingItemCard.tsx` — oznaka (Dostupno / Pod opcijom / Na upit) i gumb
„Detalji broda" u jednom `nowrap` redu, poravnatom desno na dnu stupca sadržaja. Na mobitelu je stupac uzak (slika 40 %), pa je
red bio širi od stupca i „curio" ulijevo pod sliku. Izmjereno uživo prije popravka: 18/18 kartica pod slikom na 320/360/375 px,
na 390 px oznaka već izvan stupca (veći sistemski font na iPhoneu = isto i na 390+).

**Fix:** red smije prijeći u novi red (`flexWrap: wrap`, `rowGap`, `maxWidth: 100%`, desno poravnanje; grid prikaz zadržava
lijevo) → kad nema mjesta, oznaka stane u svoj red IZNAD gumba; kad ima mjesta, sve kao prije.

**Provjera uživo (headless Chrome, iPhone UA, DPR 3):** `/hr/search?destinations=croatia&boatTypes=MOTORBOAT`, `?destinations=croatia`
i `?destinations=croatia&startDate=2026-10-10&endDate=2026-10-17` (ima 2 × „Pod opcijom") na 320/360/375/390/430/466/890/1280 px:
0 oznaka pod slikom, 0 izvan stupca; do 390 px oznaka u svom redu, od 430 px pokraj gumba (široka „Pod opcijom" još u svom redu na 430).

**Deploy:** `infra/deploy-scripts/b4y_web_deploy.sh` (build cpus=1, config test, swap) — aplikacija se ugasila nakon swapa, pa je
zagrijavanje (5b) pokrenuto ručno iz iste skripte; SEO regresija (6) nije pokrenuta (promjena je samo CSS kartice).

## 2026-09-30 — 📱 Promo banners: countdown pill no longer breaks inside the time, phone balloons fade again — ⏳ NOT DEPLOYED (commit `fix(promo): countdown pill breaks only before the clock, restore bfade keyframes`)

Fixes two regressions QA found in the refined phone/tablet commit below (deploy both together).

- **Countdown pill:** below 900px the refined `.when:has(.dot)` rule lets the pill wrap, and the boxed digits (`.digit`, inline-block) allowed a break between any two digits: "Ends in 06:19:" / "33", "Ends in 10d 1" / "1:59". `DeadlinePill` now wraps days and time in a no-wrap `.clock` span, so the only break is before the clock ("Ends in" / "10d 11:59").
- **Balloons (phone, Birthday Week):** `@keyframes bfade` sat in the prototype's base region, which the narrow-only sync skips, so the phone `.balloon` rule referenced a missing animation and the balloons rose at full opacity through the sticker. The keyframes are now in the base region. In `refine.html` the rule moved above the phone section header (no rendering change), so the phone block keeps its "phone containers" header on the next sync.
- **Correction to the entry below:** the `/search` listing banner is about 854px wide at a 1400px viewport, so it uses the tablet (600–899px) layout and does change on desktop screens (rotated sticker off the bottom edge, sun above the mast, no cloud or gull behind the sub). Every other desktop banner is unchanged apart from the subtitle shadow.
- **Deploy:** `.next` only.

## 2026-09-30 — 📱 Promo banners: refined phone/tablet layout, subtitle shadow, count-up clamp — ⏳ NOT DEPLOYED (commit `fix(promo): refined phone/tablet banner layout, subtitle shadow, count-up clamp`)

The tablet (600–899px) and phone (<600px) blocks of `PromoBanner.module.scss` are re-synced from the refined prototype (`refine.html`, checked better than the live layout by independent QA) with `sync_narrow_css.py` (narrow region only). Desktop (≥900px) is unchanged apart from the subtitle shadow (but see the correction above: the `/search` banner is below 900px wide).

- **Phone:** the character is sized from a pinned CTA row, the sun hangs under the CTA, price tags, lightning and fireworks fly in a masked band beside the character, balloons fade out at CTA height, and a countdown with days left breaks onto two lines inside the sticker. Title and sub are centred above the CTA in hero, tile and strip. The `/search` strip keeps them top-aligned, level with the sticker (title 15–17px from the top at 398–430px), with the CTA on the bottom row.
- **Tablet:** from 680px the sailing boats and the strip's speedboat rock in place past the CTA (≥34px clear at 680–699px, was 7.7–13.5px). The sun moves between the copy and the character, and price tags stay inside the right edge.
- **Flash Deals, phone <530px:** no clouds in the lightning band (a cloud cut by the band's fade read as a smudge under the CTA).
- **Subtitle:** the base shadow is stronger (`0 1px 2px` 38% + `0 0 14px` 20%). The text stays white. The phone block keeps its own shadow.
- **Count-up:** the progress is clamped at 0, so the first frame can no longer show "-1%".
- **Checks:** geometry port vs prototype is 0 differences at phone 341/398, tile 535, tablet 620/690/736 and desktop (also 0 vs the live prototype on desktop). At phone 286 one hero title (September) is 2px shorter, from the title-fit rule. deco and probe_anim report 0 issues. measure reports 4 more "sub-CTA gap" flags on the `/search` strip at 398px, the same gaps as the live layout. Build and tsc pass.
- **Deploy:** `.next` only, no public, messages or config changes. The six sister sites still need the same re-sync.

## 2026-09-30 — 🎞️ Animated campaign banners (11 campaigns, all formats) — ⏳ NOT DEPLOYED (commit `feat(promo): animated campaign banners`)

The approved animated prototype (Mario 30.9.2026) replaces the static PromoBanner: a layered scene (sky effects per campaign, three seas, an animated character and boat, parallax on hover), a morphing "up to X%" sticker with the campaign clock ("Book by …", a ticking countdown in the last 14 days, "Starts …"), and a CTA. The count-up runs when the banner scrolls into view. With reduced motion the banner shows static posters.

- **Formats:** deals hero `/deals/<slug>` (not a link, its CTA scrolls to the deals list), home tile in the destinations grid (the desktop layout from 1280px, a full-width row below), and the `/search` strip above the first boat.
- **CSS:** `PromoBanner.module.scss` is a 1:1 port of the prototype between the `sync:*` markers, re-copied mechanically by `sync_narrow_css.py`. The site rules sit outside the markers.
- **Data:** `campaigns.config.ts` gets bright gradients, sticker and sun colours, and the character, boat and sky per campaign. The windows are unchanged.
- **Copy:** `messages/*/promo.json` (9 locales) adds `banner.bookBy`, `banner.endsIn`, `banner.startsOn` and a `cta` per campaign. Titles, subtitles and SEO texts are unchanged.
- **Review fixes (30.9.):**
  - Titles with a long single word (nl VROEGBOEKKORTING, de GEBURTSTAGSWOCHE) step down to fit their column.
  - Below 900px the countdown drops its seconds while days are left. Its digits sit in fixed-width boxes, and it scales down to fit inside the sticker.
  - The deals CTA scrolls by script, with no hash history entry, so Back works.
  - Off-screen banners pause their animations, and the banner is `contain: layout paint`.
  - Focus rings are visible, and the link is named by its title and CTA.
  - `/search` resolves the campaign and its percentage on the server (BoatsWrapper). This avoids a hydration mismatch at the midnight switch and the no-discount state showing first.
  - A cached banner past its end shows "Ends in 00:00:00" instead of next year's start.
  - The hero at 900–1231px scales the character and boat, so they no longer overlap.
  - Clouds and gulls cross the whole wide hero, and stay spread out with reduced motion.
  - The CTA shine moves by transform.
  - `PromoBannerServer` (unused) is removed.
- **🔴 Deploy:** ship the new `public/promo/` directory by hand (30 files, 5.8 MB), then restart `nextapp`, because Next caches the public file list at start. Also ship `next.config.js` (`/promo/*` cache header: 1 day plus a week of stale-while-revalidate) and `messages/`.
- **Open, for Mario:**
  - White subtitle contrast on the bright gradients is 2.5–3.9:1.
  - There is no pause control (WCAG 2.2.2).
  - The phone copy/CTA/sun spacing for 3-line titles (hr, it) and the `/search` strip at 530–899px (it never reaches the desktop layout) are left to the refine pass on the narrow blocks.
  - The six sister sites are not done yet.

## 2026-09-27 — 📊 Yacht charter price guides: Croatia, Greece, Italy + hub (9 locales) — ✅ LIVE cusma1 ~10:3x UTC (`a25f3497`, BUILD_ID `-lmVriz3biqnrAc5dmybb`)

`/[locale]/yacht-charter-prices` (hub) and `/[locale]/yacht-charter-prices/{croatia|greece|italy}` (36 URLs, in sitemap-static and llms.txt), built only from `/public/charter-facts` (c-54, c-86, c-110; nightly 08:00 UTC): data-derived summary, month tables for all boats and each boat type with ≥6 months of data, skipper/extras/deposit/check-in tiles, top bases (plain text: all are noindex landings) and models (linked to /yachts pages), method section, 6 FAQs (FAQPage, visible). BreadcrumbList + WebPage `dateModified` = computedAt; no Dataset markup (no licence to declare). Keyword: "yacht charter prices" — NOT "catamaran charter croatia price" (sister CC owns /catamaran-charter-croatia-price). Linked from the country landings + type landings, the footer (hub) and blog Explore blocks.
Review fixes: tile overflow at 375 px; p25–p75 are charter WEEKS ("middle half of weeks", also on the landing facts tables); FAQ no longer claims the priced-boat count as the sample; extras = per-boat weekly fees (0 € if none, per-person items and % APA excluded); stable model counts (facts row, not the cold listing facet); EN plural "Motor yachts" (site-wide); HR/IT wording.
Deploy with the new tail: runtime files shipped (next.config.js registers priceGuide messages), public/ diff 1 file (the Croatia corpus fix `12c35fa9`), warm-up incl. the guides (0.2 s), sitemap-models 26 s cold. Regression Stage B: 0 new FAIL (51 known, 69 WARN).
Pages render on demand (ƒ) with the facts fetch cached 6 h; a facts outage on a cold cache returns 5xx rather than an empty guide.

## 2026-09-26 — 🧹 26.9 audit fixes (web-tech, web-ui, web-content) + metadata always in <head> — ✅ LIVE cusma1 21:40 UTC (`68af4cd7`, BUILD_ID `o-jJN_zc-pZdGi49uqXa7`)

Merges `f82370a1` (fix27/web-tech), `c4b60fbf` (fix27/web-ui), `dd932f7f` (fix27/web-content) + `68af4cd7`. Audit `_seo-audit-2026-09-26/synthesis.md`, defects B01–B51.

- **web-tech:** API error → 5xx (never a cached 404+noindex); type-only `/search?boatTypes=X` noindex,follow; duplicate landings/boat URLs → one canonical + 308; stable landing identity via backend region aliases (B01); sitemaps never cache an empty/error answer, privacy/terms out of sitemap-static; locale-prefixed links; real manufacturer in ItemList `Product.brand`; titles/descriptions trimmed; blog BreadcrumbList; weekly prices on itinerary/similar-boat cards + "which week" note; price filter converts currency.
- **web-ui:** guest number in the boat description; no raw true/null/false; FAQ H3 nesting; accents restored in 12 card labels (DE/HR/FR/ES/PT); localised number formats + UI strings; region/base names translated in titles/H1 (landing.json); unsourced "40,000+ happy sailors" removed; one boat total per page; model pages get data-driven FAQs; mobile price period, search pill, unavailable-week message, first paint.
- **web-content** (`scripts/seo-corpus-qa.py --check` = 0 findings over 12,789 files): operator names out of copy, France/Normandy houseboat/canal copy rewritten to sea charter, COVID "flexible cancellation" string → 72 h from booking, "Boat4You owns/operates the fleet" → partner network, IT "Adriatico italiano" fixed, 146 dead corpus links fixed, facts contradictions, Greece guides linked; inland places (casale-sul-sile, european-inland, ile-de-france) removed.
- **`htmlLimitedBots: /.*/`** (`68af4cd7`): cold ISR renders streamed title/robots/canonical/hreflang into `<body>` even for Googlebot (11/12 cold blog posts); now 12/12 in `<head>`.
- **🔴 runtime files:** cusma1's `next.config.js` was from 2.9.2026 — the deploy shipped only `.next`, so runtime config never changed. `b4y_web_ship_tail.sh` now ships `next.config.js` + `messages/` + public/ diff since `DEPLOYED_COMMIT`, tests the config as cusma1 before the swap (first attempt aborted on root-owned messages — fixed: chown before the test), stops if the swap fails, warms `/sitemap-models.xml` (≈90 s cold) and key pages before the regression run.
- public/: corpus shipped by tar (backup `/home/cusma1/seo-content.bak-20260926b.tgz`), `images/destinations/france.webp` + `turkey.webp` (backups in /home/cusma1).
- **Regression (Stage B, 21:52 UTC):** 0 new FAIL, 59 known open rows (XFAIL), 17 audit defects confirmed fixed (XPASS). Known transient: charter-facts block empty until 27.9 08:00 UTC (table reset at the backend deploy); extras "0 €" await an owner decision (ADMIN session).
  Rollback: `.next.prev` on cusma1 (= `D1x5HKkQn6e_xWl9fJm9J`), `next.config.js.prev`, messages backup `/home/cusma1/messages.bak-20260926.tgz`.

## 2026-09-26 — 🔧 After-comparison fixes (Mario „sve ovo sredi odmah") — ✅ LIVE cusma1 ~23:00 UTC 25.9. (`eb711938`, BUILD_ID `zPqErlXO_gjrBO0zRIXwr`)

Merges `a52ae599` (fix/linking incl. fix/metadata), `caa7ebe6` (fix/listing), `977549ec` (fix/corpus) + `eb711938` (canonical shard numbers).

- **hreflang:** next-intl `alternateLinks: false` — no hreflang in the HTTP `Link` header anywhere; the in-HTML alternates (query kept) are the only source. Live: 0 header hreflang on landings, home, /yachts.
- **Owner decisions:** croatia × CATAMARAN = "Catamaran rental in Croatia" (the exact phrase "Catamaran charter Croatia" belongs to catamaran-croatia-charter.com); Split Region title/H1 lead with "Split" (9 locales + × type); country count from siteStats in meta/copy (54), no "100+"/"more than 40"; LinkedIn `/company/boat4you-com` in footer + sameAs, foundingDate 2013.
- **Titles/H1:** `messages/<locale>/landing.json` — 58 regions translated with their "in …" phrase (DE "in der Ägäis", FR "en Croatie", PL "na Karaibach"); 61 curated files lacking `</body>` no longer leak a 2nd `<title>`/meta into the page (sanitizeCuratedHtml).
- **Links:** landing link blocks built from the landing manifest (never a noindex landing), "Boat types in {place}", "Popular models here" → /yachts, itineraries; homepage brand tiles → /yachts/<brand> hubs where a hub exists; itinerary did=/noindex leftovers fixed; landing BreadcrumbList Home > Country > Region > Place.
- **Listing:** 0 € and non-positive prices → "Price on request"; Offer.price = card total + UnitPriceSpecification (referenceQuantity N DAY); SSR sidebar count; home country cards = landing totals (Croatia 3,864, Greece 3,408, France 428; was 5,658/5,573/1,587 from `/public/countries-count`, which counts inactive boats — backend endpoint NOT changed). Weekly-only prices on undated landings need backend `priceBasis=week` (branch fix/after-counts `c597759`, under review, not deployed) — until then Greece still mixes 1/2/3/7-day cards.
- **Yacht sitemaps:** ISR 1 h (were dynamic 3–8 s), empty/failed backend page throws (keeps last good copy), only canonical shard numbers (`01` → 404).
- **Corpus** (`scripts/seo-corpus-qa.py`, re-runnable, `--check`): FAQ duplicates removed, "ACI = Adriatic Croatia Insurance" fixed, kuna, hard-coded fleet counts, "Boat4You owns/operates the fleet" → partner network, country names in headings translated; 36 unfilled Sicily templates (motor-yacht/gulet/motorboat/luxury-motor-yacht × 9) deleted → those landings noindex + out of the sitemap. **public/ shipped by hand:** cusma1 has no rsync → tar + scp + directory swap (backup `/home/cusma1/seo-content.bak-20260926.tgz`); 12,870 files.
- Live check 23:01 UTC: titles above ×1 each, Greece 0 × "0 €", 1 × "Price on request", sidebar 3,408 SSR, LinkedIn ×7 on home, shard 5 200 / 01 404, Sicily motor-yacht noindex.
  Rollback: `.next.prev` (= `1XgW0PfIHzRDQsUaTzqnn`) + restore the corpus tarball.

## 2026-09-25 — Wave 2 LIVE: manifest sitemaps, boat breadcrumbs, blog/itinerary links, counts, /yachts model pages, charter facts block, review form — ✅ LIVE ~13:56 UTC

Merge `49380893` (main wave 2 `d9201e58…9b421877` + branch `feat/models-facts-reviews` `ca063d26…148bc650`), BUILD_ID
`Exdbl9XqGGF0iWgTMyMIq`. Verified on production: croatia 3,866 / greece 3,407 / paros 29 boats (index, distinct lists);
sitemap index 127 files, 0 lastmod except blogs; sitemap-locations 576, categories 3,240, models 342, static 198;
/yachts, /yachts/lagoon, /yachts/lagoon/lagoon-42 (+/de) 200 index, 24 boat cards; boat page `<nav aria-label="Breadcrumb">`

- "More catamarans in Zadar (139)" + "All Lagoon 42 boats (438)"; blog post: Explore block, 0 did= / 0 startDate hrefs;
  /itineraries/split: 12 boat cards "Boats available from Marina Kastela (301)", 1.29 MB (was 2.47 MB); /about-us SSR
  13.600 / 58 / 50; /review/<bad token> 200 noindex,nofollow + Referrer-Policy no-referrer; robots.txt 9 × Disallow review.
  Charter facts block renders nothing until the backend's first nightly run (08:00 UTC 26.9.; endpoint 404 today).
  **Gotcha:** the deploy ships only `.next` — a stale `public/llms.txt` (1.8.2026, "100+ countries") on cusma1 shadowed the new
  route handler; moved to `/home/cusma1/llms.txt.bak-20260925` + `systemctl restart nextapp` (Next caches the public file
  list at start). Any future public/ removal or addition must be synced by hand.
  Rollback `.next.prev` (= release A1 `PNhZDQdC3LxKlsbbcJvKl`).

## 2026-09-25 — 🌊 Wave 2: sitemap iz korpusa (prag 10), lastmod, cache landinga, linkovi brod/blog/itinerari → hubovi, jedan izvor brojki — ⏳ NIJE DEPLOYANO

Commiti `d9201e58` … `6cd95cdc` (8, na HEAD iznad `fc1ee504`). Nije pushano, nije deployano.

**Što i zašto**

1. **Sitemap iz korpusa + prag (Mario 25.9.)** — `src/utils/server/landingManifest.ts` čita popis `public/seo-content/en`,
   svaki file rezolvira u katalošku landing stranicu (isti resolver kao /search; `DESTINATION_ALIAS` u `curatedSeoSlug.ts`
   proširen s ~80 ručno provjerenih imena, npr. Alimos Marina → `athens-alimos-marina`) i emitira ga ako prođe
   `landingGate.ts`. **Prag (jedna konstanta, `MIN_LANDING_FLEET = 10`):** 12 promoted zemalja uvijek; sve ostalo (regija,
   baza, destinacija × tip) ≥ 10 aktivnih brodova (tog tipa) + vlastiti kurirani tekst (tip-landing treba tip-tekst; alias
   koji posuđuje tuđi file ne dobiva index). Regije bez countryCode (MMK „Dubrovnik / Montenegro") samo ako im je cijela
   flota u promoted zemljama. Lokalno uz prod API: `sitemap-locations` **171 → 576** (64 × 9), `sitemap-categories`
   **468 → 3.240** (360 × 9), 0 URL-ova sa zarezom; 180/180 uzorkovanih URL-ova = `index` + canonical = `<loc>`.
   Apostrof u URL-u sad `%27` (canonical ga tako renderira). Korpus: 1.432 filea → 385 bez kataloškog mjesta (190
   prefiksa: sibenik-region, athens, milazzo, zadar-region, pula, crete, epirus, istra, kvarner, trogir-yachtclub-seget…),
   287 „shadowed" (drugi tekst za isto mjesto, npr. `split` uz `split-region`), ~336 ispod praga. Popis:
   `SEO_MANIFEST_REPORT=1` → log `[seo-manifest]` pri generiranju sitemap-locations.
2. **lastmod** — maknut request-time `<lastmod>` iz sitemap indeksa, static, itineraries, yachts, locations, categories.
   Ostaje samo sitemap-blogs (pravi datum posta).
3. **Cache landinga** — `fetchYachts` prima `revalidate`; landing BEZ datuma i filtera (samo destinations/boatTypes/page)
   čita listu brodova kroz Data Cache **600 s** (`landingFetchRevalidate`, `searchLanding.ts`). Datumi, vlastiti did,
   sidebar filteri, sort i admin inquiry ostaju `no-store`.
4. **Brod → hubovi** — na `/boat/[slug]` (×9) vidljivi `<nav>` breadcrumb Početna › Zemlja › Regija/baza › Tip › brod
   (link samo ako landing prolazi gate, inače tekst) + „Još {tip}: {regija} (N) →"; BreadcrumbList JSON-LD iste URL-ove
   (prije: `/search?boatTypes=X` i `?destinations=<grad>`, oboje noindex). Blok je između sadržaja i „slični brodovi" —
   hero netaknut, SSR, bez pomaka. Marina → regija: `/public/regions?countryCode` + `/public/locations-count?regionId`
   (1 h cache). Product/FAQ JSON-LD broda sad kroz `serializeJsonLd`.
5. **Blog → katalog** — u tijelu posta `/boat/<slug>?startDate…` → čisti URL, `/search?…did=` → kanonski landing;
   SSR blok „Istražite brodove" (3–6 hubova iz naslova/kategorija/teksta + tip×mjesto kad je post o tipu/modelu + itinerar
   područja); /blog: 6 najvećih promoted zemalja. Hreflang postova i dalje samo `en` + `x-default` (provjereno).
6. **Itinerari → brodovi** — area i route stranice: „Dostupni brodovi – polazna luka: {baza} (N)" (12 kartica,
   `StaticBoatListingItemCard` bez useSearchParams) + „Najbolji tipovi brodova za ovu rutu" (tip-landinzi koji prolaze gate).
   Stranice su sad **ISR 1 h**. **Payload:** segment layout `/itineraries` je slao svih 12 itinerary namespaceova
   (~1,9 MB od 2,47 MB) → layout obrisan, area/route dobivaju samo svoj (hub i builder i dalje sve). Lokalno (dev)
   `/itineraries/split` 2,71 → 1,57 MB s karticama.
7. **Jedan izvor brojki** — `src/utils/server/siteStats.ts` (6 h cache): brodovi = `/public/yachts` total (= /search
   naslov), zemlje/marine s brodovima iz count endpointa. Koristi ga /about-us (SSR broj, ne „0+"), hero pillovi na
   naslovnici (**zamjenjuje ručno fiksirane 11.982 / 647 od 2.6.**), JSON-LD opis (novi namespace `siteFacts`, 9 jezika)
   i `llms.txt` (sad route handler, `public/llms.txt` obrisan). Organization: `alternateName ["Boat4You","boat4you.com"]`,
   legalName i sameAs (Wikidata Q141206019 + 4 profila) nepromijenjeni.

Novi namespaceovi (server-only): `catalogueLinks`, `siteFacts` — svih 9 jezika.

**Popravci recenzije (25.9., commiti `1eb0d13b` … `53401c11`)**

- **Cache landinga = allowlist** (`searchLanding.ts`): Data Cache samo kad su SVI parametri landing parametri s valjanom
  vrijednošću (rezolvirana destinacija, poznati boatTypes, page 1–500, poznata valuta) ili tracking; backend upit se
  gradi iz kanonskih vrijednosti (did, tip, page, valuta). `gclid`/`utm_*`/`fbclid`… se više NIKAD ne šalju backendu.
  Prije: svaki gclid = novi ~22 KB zapis u fetch-cache (bez evikcije) + hladan poziv na cusma2. Lokalno: 7 varijanti
  (gclid, utm, fbclid+page=2, izmišljeni param, nepoznata destinacija, krivi boatTypes/page) → +1 zapis (legit page=2).
- **Brojke hubova = lista** (`landingGate.ts`): zemlje i mjesta s tekstom broje `/public/yachts` totalElements (kao
  landing), ne countries-/locations-count. Blog pillovi sad Croatia 3.865 / Greece 3.407 / Türkiye 793 (prije 5.658 /
  5.573 / 1.145). Prag 10 za netipizirane baze isto po listi → `sitemap-locations` lokalno **576 → 540** (60 × 9;
  Paros l-151 sad ulazi, 29 brodova).
- **Itinerari**: naslov = lista baze, „See all" = broj stranice na koju vodi; kad vodi na regiju, imenuje je
  („See all 1,727 boats in Split Region") — novi ključ `catalogueLinks.itinerary.seeAllBoatsIn` ×9.
- **Blog**: `?did=` link bez vlastitog landinga → najbliži indeksabilni hub (lagoon-47: Trogir → Split Region);
  „Aegean"/„Ionian"/… samo u postu o toj zemlji (nestalo s Cyclades/Dodecanese/BVI postova).
- **siteStats**: zemlje/marine = redovi čija lista nije prazna → **58 zemalja, 720+ marina** (prije 62 / 830+).
  ~900 `size=1` upita, rezultat u `unstable_cache` 6 h (single-flight, rok 45 s). **Layout čeka max 1,5 s**, inače
  JSON-LD sa statičnim opisom (i dalje „100+ countries", vidi otvoreno niže) dok se cache ne napuni.
- [ ] Build: +~900 malih upita za siteStats (llms.txt / naslovnica). Ne buildati u sync prozoru cusma2.

**Akcije pred / nakon deploya**

- [ ] Build prerenderira sitemape: manifest = ~0,7–1K malih `size=1` upita (max 6 paralelno, 1 h Data Cache; prije ~150).
      Ne buildati u sync prozoru cusma2. Itinerari (ISR) pri buildu dohvaćaju listu brodova po bazi (jednom po bazi, EN).
- [ ] nginx (cusma1/cusma5): provjeriti da `/llms.txt` NIJE statički serviran iz starog `public/` (sad je Next ruta).
- [ ] Nakon deploya: GSC → ponovno poslati `sitemap.xml`; pratiti indexed/submitted za locations/categories 8 tjedana.
- [ ] Provjera uživo: `curl -s https://www.boat4you.com/sitemap-locations.xml | grep -c '<loc>'` ≈ 540,
      `sitemap-categories` ≈ 3.240, `grep -c lastmod` = 0 (osim sitemap-blogs); `/boat/<slug>` ima
      `<nav aria-label=…>`; `/blog/<slug>` ima `explore-boats-title`; `/itineraries/split` < 1,5 MB i 12 `/boat/` linkova;
      `/about-us` bez „0+"; `/llms.txt` 200 text/plain.
- [ ] Otvoreno (nije dirano): `metadata.base.description` (meta description naslovnice, 9 jezika) i dalje kaže „100+
      countries" — katalog ima 62 zemlje; promjena SERP snippeta = Mariova odluka.

**Rollback:** `.next.prev` swap (kao inače). Kod: `git revert 53401c11 793228fa 2ce6fb2f 1119fd7c 1eb0d13b 6cd95cdc c6c24ea8 71ab7882 5cc0feab 6cb7e17e a629cad9
c0b20c60 d9201e58`.

## 2026-09-25 — 🛥️ Wave 2: /yachts model stranice, charter facts blok, /review forma, prag 10 brodova — ⏳ NIJE DEPLOYANO

Grana `feat/models-facts-reviews` (worktree `boat4you-web/b4y-web-wave2`, od `fc1ee504`), NIJE pushano ni deployano.
Commiti: `ca063d26` prag · `8e7f7778` model stranice · `ed52be78` charter facts · `e9e9ded2` review forma ·
`9c84af6b` memo kataloga · `041ed4c9` PL/HR množina · `8f5ba69e` sitemap-models bez build prerendera.
Popravci recenzije: `081fdc66` GA/Ads se ne učitavaju na `/review/*` (token više ne ide u `page_location`) ·
`ed8d3c7c` facts tablica stane na 375 px · `50cda4c2` model stranice: rasponi p5–p95 (bez outliera iz partnerskih
podataka), bez „46–46 ft", meta = tipičan tjedan p25–p75, gumb bez broja, link s broda samo za 12 promoviranih
zemalja, „Lagoon 450 Sport" → 450 S, Motor Sailer / Sunsail / The Moorings / „Gulet"-jezgre bez stranice.

**1. Prag landinga (Mario 25.9.):** `MIN_LANDING_FLEET = 10` u `src/utils/server/landingGate.ts` (jedino mjesto).
Promovirana država (12) = uvijek indeksabilna (ako ima brodova, sva 9 jezika); regija / baza / destinacija × tip / model
stranica = ≥ 10 aktivnih brodova I jedinstven sadržaj. Lokalno uz prod API: `sitemap-locations` 171 → **162** (ispada
`marina aliki`), `sitemap-categories` 468 → **351** (ispada 13 kombinacija država × tip s < 10 brodova tog tipa, npr.
`bahamas&boatTypes=SAILING_YACHT`, `turkey&boatTypes=MOTORBOAT`). Te stranice postaju noindex,follow.

**2. Model stranice (plan #8):** `/[locale]/yachts`, `/yachts/{brand}` (samo brendovi s ≥ 2 model stranice),
`/yachts/{brand}/{model}` — top 30 modela s ≥ 10 aktivnih brodova u 12 promoviranih zemalja. Rangiranje:
`/public/yachts/distribution?did=<12 c- id>` (`byModel`, ~14 s hladno, Data Cache 24 h) + `/public/catalogue/models`
po proizvođaču (24 h); MMK/NauSys varijante spojene u jedan ključ (`src/utils/static/yachtModelKey.ts`: „Dufour 460 GL /
Grand Large", „Bavaria Cruiser 46 / 46 Cruiser", „Lagoon 450 F / Fly", „Elba 45 / Fountaine Pajot Elba 45",
Lagoon-Bénéteau → Lagoon). Slug iz ključa (stabilan). Stranica: SSR specifikacije iz flote (duljina, kabine, osobe,
kreveti/WC = najčešći raspored iz uzorka od 6 detalja, godine gradnje), „Where to charter" tablica (linkovi SAMO na
landinge koje gate indeksira, prvo tip modela), tjedna cijena p25–p75 (×7 od dnevne, period total), 24 kartice brodova,
link na blog ako naslov posta sadrži model, BreadcrumbList + ItemList JSON-LD (bez Product/Offer), canonical, hreflang ×9

- x-default, novi namespace `models` (9 jezika). Ispod praga / nepoznat slug → 404. `sitemap-models.xml` (u indeksu,
  **342 URL-a** = (1 + 7 hubova + 30 modela) × 9, bez lastmod, `force-dynamic`). Stranica broda: „All {model} boats (N)"
  kad model stranica postoji (budžet 1,5 s, katalog memoiziran 30 min po procesu). ISR 12 h.

**3. Charter facts blok (plan #6):** na landinzima koji prolaze gate u tom jeziku, iz
`GET /public/charter-facts?did=…[&vesselType=…]` (backend V9_61, revalidate 3600, timeout 2,5 s). Aktivni brodovi,
tjedne cijene po mjesecu (medijan + p25–p75, najjeftiniji/najskuplji mjesec), skiper/tjedno, obvezni extrasi/tjedno,
polog, dan ukrcaja, medijan godine gradnje, top modeli (link na model stranicu) i top baze (link samo na gated landing).
Valuta stranice preko tečaja iz liste (`clientPriceInfo.rate`), inače EUR s oznakom. 404 / greška → ništa (bez praznog
okvira). Bez FAQPage sheme. Namespace `charterFacts`. **Prod endpoint danas vraća 500 (backend jar još nije na
cusma2) → blok se ne prikazuje dok backend ne ode live i prvi 08:00 UTC run (ili ručni recompute) ne napuni tablicu.**
Lokalno provjereno s fixture proxyjem (payload po `CharterFactsMath.buildPayload`): EN/DE, USD konverzija, did-link →
nema bloka, 2 destinacije → nema bloka.

**4. Review forma:** `/[locale]/review/{token}` (backend V9_62): SSR kontekst (GET, no-store), forma: ukupna ocjena 1–5
(MUI Rating = nativna radio grupa u fieldset/legend), pod-ocjene tipa, naslov (120), tekst (3000, brojač), privola za
objavu (ime + država). `?rating=1..5` iz maila predselektira. Submit = server action, prosljeđuje IP posjetitelja kao
`X-Forwarded-For` (backend rate-limit 10/min po IP). Stanja: uspjeh (novo / izmjena), 404 istekao link, 409 prošao
24 h prozor, 400 poruke po polju, 429, greška. noindex,nofollow bez canonical/hreflang/og:url, `Disallow: /review/`
×9 u robots.txt, `Cache-Control: private, no-store` + `Referrer-Policy: no-referrer` (next.config.js), nije u sitemapu.
Namespace `review` (klijentski samo u tom segmentu).

**Akcije pred / nakon deploya:**

- [ ] Backend V9_61 + V9_62 live PRIJE ili ZAJEDNO s ovim; `REVIEWS_ENABLED=true` na cusma2 + cusma3 tek kad je
      `/review/<token>` live (inače mail vodi na 404 i troši jednokratni zahtjev).
- [ ] Build: `/yachts*` i `sitemap-models.xml` se NE prerenderiraju. Nakon swapa jednom zagrijati: `curl /yachts`,
      `/sitemap-models.xml` (prvi zahtjev ~15–30 s: distribution + 30 flota; poslije iz Data Cachea).
- [ ] GSC: ponovno poslati `sitemap.xml` (novi `sitemap-models.xml`); očekivano +13 × 9 „Excluded by noindex" s
      country × type kombinacija ispod 10 brodova.
- [ ] Nakon prvog 08:00 UTC runa: `curl https://www.boat4you.com/search?destinations=croatia | grep charter-facts-heading`.
- [ ] Lokalni dev iz worktreeja sa simlinkanim `node_modules`: Turbopack puca („Symlink node_modules is invalid") →
      `next dev --webpack`.

**Pre-existing (nije dirano):** backend spaja „Marina Frapa | Rogoznica" (l-2029) s „Marina Frapa Dubrovnik" (l-775) u
jedan red `/public/locations` → landing „marina frapa dubrovnik" nosi i Rogoznicu; FR/IT/PT H1 na /search „à Grèce" /
„a Grecia" / „em Grécia" (predlošci `searchH1NoBoatType`); GA `page_location` nosi token na /unsubscribe i
/trip (/review popravljen u `081fdc66`); inquiry server action ide s IP-a web servera pa svi dijele backend
rate-limit (5/min); ISR piše zapis i za 404 na `/yachts/<bilo što>` (kao /boat).

## 2026-09-25 — 🧭 /search landing: filtriranje, SSR tekstovi, sitemap = index gate — ⏳ NIJE DEPLOYANO

**✅ LIVE 25.9.2026 ~12:27 UTC — BUILD_ID `PNhZDQdC3LxKlsbbcJvKl` (HEAD `1d7b9aa8`).** Verified on production: greece/italy/split/croatia×CATAMARAN/greece×CATAMARAN each render their own boat list (md5 differ; Greece first boat jeanneau-sun-odyssey-479-sirius-19668, heading "3,407 boats available"); curated H2 in raw HTML; "sought-after sailing destinations" template 0×; unknown destination (atlantis) → noindex; `/seo-content/*` → `x-robots-tag: noindex, nofollow`; `</script>` XSS probe → 0 hits; sitemap-locations 5,985 → 171 URLs, sitemap-categories 468. `public/seo-content/en` on cusma1 = 1,435 files. Rollback `.next.prev`.

Release A (commiti `99695426`, `6bf68c45`, `d4594f6b`, `3f1da651` + popravci recenzije 25.9.). `/search?destinations=<ime>`
filtrira po did-u na serveru, kurirani tekst je u SSR HTML-u, `/seo-content/*` šalje `X-Robots-Tag: noindex`.
**Sitemapi se sad grade iz istog predikata kao robots tag** (`src/utils/server/landingGate.ts`): mjesto s brodovima (za
boatType: brodovi TOG tipa) + kurirani tekst u tom jeziku (za boatType: tekst za taj tip, ne country overview).
Lokalno uz prod API: `sitemap-locations` 5.175 → **171** URL-ova (19 × 9), `sitemap-categories` 1.296 → **468** (52 × 9);
svih 639 odgovara `index` + canonical = `<loc>`, svi imaju brodove.

**Akcije pred / nakon deploya:**

- [ ] Deploy radi `public/seo-content/` na serveru (search stranica i sitemapi ga čitaju s diska, `process.cwd()/public`).
- [ ] Build prerenderira sitemape protiv prod API-ja: ~150 malih `size=1` upita (max 6 paralelno) — ne pokretati build
      u sync prozoru na cusma2.
- [ ] Nakon deploya: GSC → ponovno poslati `sitemap.xml`; očekivano ~4,8K „Excluded by noindex" s landing URL-ova koji više
      nisu u sitemapu (marine bez teksta, tip × zemlja bez teksta ili bez brodova tog tipa) — namjerno (plan, release A).
- [ ] Prag flote je `MIN_LANDING_FLEET = 1` (landingGate.ts); plan predlaže N (regija ≥30, zemlja×tip ≥25) — čeka Mariovu odluku.

## 2026-09-24 — 🔠 toTitleCase: samo pravi rimski brojevi, elizija — ✅ DEPLOYED

Nastavak „' Sunny'" popravka (isti dan). Commit `05b07fd9`, BUILD_ID `ryyExLpWs0fiHHcdctuIk`, rollback `.next.prev` =
`2KnEbAAsuK9IcbaF3iWy7`. `src/utils/static/toTitleCase.ts`: velika slova ostaju samo za PRAVE rimske brojeve (stari „bilo koja
slova MDCLXVI" ostavljao je „LILI"/„MIMI" velikim slovima) + veliko slovo nakon elizije jednog slova („L'AVVENTURA" →
„L'Avventura"; „OCEAN'S" → „Ocean's"). Isti helper sad na svih 7 stranica (sisteri istog dana dobili title-case imena na
stranici broda; EY/CY i bez ponovljenog proizvođača). Uživo: `/boat/lagoon-40-lavventura-8273` → „Lagoon 40 'L'Avventura'
(2020)", H1 „Lagoon 40 | L'Avventura"; rute 200.

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

## 2026-09-29 — Inquiry: one per submit; boats without a bookable future offer = inquiry-only page; never "0 €"

Mario 27.9.2026: (1) boats without any future offer are hidden from listings/sitemaps (backend, ADMIN session: `/public/yachts` excludes them, `/public/yachts/{id}` returns `hasBookableFutureOffer`, live cusma2 27.9. 17:12 UTC); (2) their boat page STAYS 200 + index with an inquiry form without price; (3) an inquiry form sends exactly ONE inquiry (27.9. Samsung Internet visitor → 6 identical inquiries in one second on the Greece sister).

Branch `fix/inq27` (worktree `../wt-inq27`), 18 commits (2800467a…416642ac), merged into main 29.9.:

- `src/utils/static/inquiryOnlyBoat.ts` — `isInquiryOnlyBoat(yacht) = hasBookableFutureOffer === false` (missing/null = bookable, deploy order irrelevant). Inquiry-only page: `InquiryOnlyPanel` in booking box / availability tab / phone bar ("Price on request" + "Send inquiry"), no calendar, no Reserve, no Product JSON-LD (Breadcrumb + FAQ stay; a Product without offers is a Search Console error), FAQ + description + meta description (`metadata.boat.descCtaInquiry`, 9 locales) ask for an inquiry. Form gets free date fields (past days off).
- One inquiry per submit: `BoatInquiryModal` locks on first submit (double tap / Enter / re-submit ignored, unlock only on failure or reopen); `src/utils/server/inquiryGuard.ts` (in-memory): same e-mail+boat+dates+phone+name+message within 10 min → first answer, no second forward; different inquiry from the same IP within 5 s → refused. `sendYachtInquiry` sends the visitor IP as `X-Forwarded-For` to `/public/inquiries` (backend limiter keys on it; before, every visitor shared cusma1's IP). Backend dedupe (advisory lock, same key) LIVE cusma2 29.9. 10:31 UTC (ADMIN, f5e6b02). Same lock on `AdminInquiryModal` (custom offers).
- Never "0 €": `isPositivePrice`, `unpricedExtraLabelKey(paymentType)` → INCLUDED = "Included", else "Price on request" (boat page, calendar rows, phone price sheet, booking PaymentPoliciesCard, My Bookings PaymentTab); week cards/heatmap "Price on request" / "—"; "0 €" without dates → "Price on request".
- i18n leftovers: phone price sheet days via `useDaysText`; phone bar dates in page locale (`DateTime.formatShortWithoutDay(locale)`, PT without "de" to fit one line).
- Inquiry e-mail template untouched (backend). Tests (16 + 3) live in the session scratchpad (repo has no runner).

Deploy: `infra/deploy-scripts/b4y_web_deploy.sh` (build + runtime files + swap + SEO regression).

- Backend blips (29.9.: local/deploy `next build` prerender flooded the API → Hikari pool full → live 500s): `next.config.js` `experimental.cpus=1`, `staticGenerationMaxConcurrency=2`, `staticGenerationRetryCount=2` (builds slower, gentle on the API); `src/utils/server/fetchWithRetry.ts` — 5xx/429/network → retries 0.5/1/2 s, then typed `ApiUnavailableError` (page 500 = retryable; Next 16 pages cannot emit 503 — that needs nginx `error_page 500 502 504 =503` on cusma1, not done). Applied to boat page + metadata, /search landings, sitemaps, /fleet, model catalogue, destination lookup, charter facts. 404/410/400 still → notFound without retry.

## 2026-09-29 (2) — Operators never appear as brand/manufacturer; yacht labels de-duplicated

Full SEO regression (J3) found Product.brand = "Odisej Ltd" (a charter operator delivered by the partner system as the manufacturer) on landings and boat pages. New `src/utils/static/operatorNames.ts` (copy of infra/deploy-scripts/operators.txt + agencies found as "manufacturer": Odisej Ltd, Sunsail, The Moorings, Catlante catamarans, More Charter d.o.o., Brodarstvo Marasovic Ltd, Coastal Leisure Ltd, Mariner Don 17 Ltd, Kanula/Manikela/Dunkić/Intermare d.o.o., Kolotura, Houseboat Holidays Italia, Riverboating Holidays) with `isOperatorName()` (whole words, case/accent/punctuation-insensitive) used everywhere a manufacturer is public: JSON-LD brand omitted, word dropped from H1/title/meta/cards/alt/PDF/breadcrumb, no /yachts hub or model page (404), removed from the manufacturer filter, not in charter facts. `toTitleCase.ts` gains `yachtLabel()` / `nameRepeatsModel()`: a boat name equal to (or ending) the model is shown once ("MS Custom Aurum Sky", not "MS Custom Aurum Sky M/S Aurum Sky"; gulets "Acapella Acapella" etc.), prefixes M/S, MS, MY, S/Y, SY, MSY, M/V, MV stay upper-case. Slugs/URLs unchanged (operator-in-slug = backend/Mario decision). Commits: 12ea9125 dcbec3ae 00c8dc9c

## 2026-09-29 (3) — Partner free text and partner identifiers never reach the public page

Audit 29.9. (content-i18n-01, critical): partner extras/services descriptions were rendered verbatim (English on all 9 locales) and named the agency ("Athenian Yachts solely provides facilitation services…", "processed through Hermes's base", "(number of guests to update manually)"). New `src/utils/server/partnerText.ts` (server-only, tests in the session scratchpad): descriptions are shown only if ≤160 chars and free of operator names (operatorNames.ts), operator-voice/terms words (Yachts, Yachting, Charter, Sailing, Ltd, d.o.o., base, pier, pontoon, liable, Charterer, the Company, manually, to be confirmed, our/we/office/agency/owner, allowance), e-mails/phones/URLs and bracketed notes; unsafe bracketed parts are cut from extra names; partner boat descriptions hidden; repeated paragraphs (60+ chars) shown once; applies to boat page, recap, phone price sheet, booking recap, my-bookings, PDF, JSON-LD. Second commit strips partner identifiers (externalId ×100–990 per boat page, agencyName ×18 on landings, agencyCommission, sourceSystem, agency) from everything serialized to the client. Left for the backend: extra KEYS equal to partner text (4 of 40 boats), boat literally named "Rhodes Yachting" (8477). Commits: 90d98d92 968cc061

## 2026-09-29 (4) — Re-audit fix release (fix/audit29-b4y-ux + fix/audit29-b4y-seo, 24 commits)

Defects from \_seo-audit-2026-09-29/synthesis.md (R-ids in the commit subjects). Not adversarially reviewed (usage limit); verified by lint 0 / tsc 0 / Stage A 0 new FAIL on the merged main and the post-deploy Stage B regression. next.config.js is now a phase function (BUILD_ID + deploymentId = git sha + time; the ship script config test handles it). Merge gotcha: both branches regenerated messages/en/\*.d.json.ts — regenerate after merging. Commits:

- a37395f1 fix: one Data Cache entry per landing for all nine locales (R11)
- a9e047be chore: drop the unused rest binding in the landing listing (R10)
- 02a0e48e fix: listing cards show the marina name with its diacritics (R32)
- 0626953e feat: one more paragraph each on /yachts and /contact-us (R35)
- dcbabdc3 fix: diacritics in the price-guide base rows and the itinerary JSON-LD (R32)
- 603232c0 fix: make the deals and blog routes really static-capable (R11)
- 055dd5a7 search: listing Product JSON-LD never prices an inquiry-only boat (R69)
- 16c81589 deploy skew: deploymentId per build and a reload for stale tabs (R62)
- 23c24bec language switch: native language names, applied on the tap (R54)
- 7823c458 a11y: translated control labels and a country-specific phone placeholder (R56)
- 74df2438 checkout: the cancellation timeline starts with the 72 h free window (R04, web part)
- abaf198c boat page: honest mobile bar, an inquiry for unbookable dates, one price formatter (R24, R25, R53, R67)
- 1e7edde7 dates: blog, availability chips, past bookings and date fields in the page locale (R47, R67)
- 37e631a9 messages: 72 h timeline key, accessible labels, translations left in English (R04, R56, R52)
- 95d3ca28 price guides: one boat count per page and no literal "0 €" (R33, R36)
- d73a579b faq: euro formats and Croatian charter-type names in the HR and ES FAQ (R48)
- 8e45a3ae feat: real content on the thin hubs /yacht-charter-prices, /yachts and /contact-us (R35)
- 47a054ee fix: base diversity on the first cards of country and region landings (R10)
- c71803d6 fix: Croatian diacritics in place labels, facts bases, fleet and itinerary hubs (R32)
- ef705db4 fix: nofollow the home links to the noindex type pages (R59)
- f3b10489 fix: ISR for the deals landings (R11)
- fc838b94 fix: 308 locale copies of blog posts to EN, cookie-aware cache headers, blog ISR (R40, R55, R11)
- 95407dd1 fix: lower-case Sicily route slug with 301s, day-long cache for /public assets (R34, R64)
