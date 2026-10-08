#!/usr/bin/env python3
"""
QA fixer for the curated SEO corpus in public/seo-content/{locale}/*.html.

Since 25.9.2026 these texts are rendered server-side on every /search landing
(src/utils/server/curatedSeoContent.ts), so production defects in them are
what Google reads. This script finds and fixes them in place. It is
re-runnable: a second run reports 0 changes.

Rules (all locales unless noted), in this order:
  foreign    machine-translation debris: Ukrainian text in HR files (incl. a
             leaked content brief), stray CJK/Arabic glyphs, "{anchor}"
             placeholders — replaced with the intended text
  structure  files cut off mid-text (no </body>): drop the unfinished trailing
             block (half sentence, open <a>, dangling question), close the tags;
             two EN files whose meta description swallowed </head><body><h1>
  faq        duplicate FAQ: repeated question headings (<h3>…?) are removed
             (the first occurrence wins), a later FAQ section left with only
             new questions is merged into the first one, empty FAQ headings
             and exact duplicate <h2> sections are dropped
  brand      "Boat4You" dropped from the text: EN sentences without a subject
             ("<p> arranges skippers…", "'s fleet", "Why Sailors Return to"),
             headings "Why Choose for …" in EN/FR/ES/IT/PT/PL/HR
  facts      targeted factual fixes (ACI, kuna as current currency,
             "Boat4You base" ownership claims, sea names, …) — see FACTS
  claims     Boat4You as owner/operator of fleets, bases or their insurance
             ("Boat4You maintains a curated fleet …", "Boat4You's Ionian
             fleet") → "Our partner network maintains …", "our partners' …
             fleet" (singular collective subject in all 9 languages)
  counts     hard-coded fleet counts ("Over 1,642 vessels", "Catamarans
             (506)", "a 395-yacht inventory") → count-free wording; a number
             after a comparison/limiting word ("exceeds", "fewer than",
             "only", "moins de", "nur") stays, one set off by a dash or colon
             gets a size phrase ("—hundreds of vessels—")
  headings   untranslated place names in headings (non-EN)
  junk, subject, casing, claims2, operators, inland, compass, links, dupes,
  edits, recap
             added after the 26.9.2026 audit — see scripts/seo_corpus_rules.py:
             charter-company names, houseboat/canal/river copy, fleet
             ownership in every form ("Boat4You's fleet", "our yachts", "we
             inspect our boats", Boat4You-Flotte, Boat4You-vloot, subjectless
             upkeep sentences), sentences and "Warum … für" headings whose
             subject the brand pass removed, founding year (2013) and
             experience claims, compass directions around Split/Trogir/
             Primošten and the ACI Split superlatives, HR/PL heading sentence
             case, raw URLs and "[Brand]" placeholders as link text,
             broken/relative/stale-did links, page furniture
  holes      added 1.10.2026 (audit N5), runs after subject so the claims
             rules see the restored text: the brand cut from the middle of an
             EN sentence ("Contact today", "Whether …, delivers", "Why Stands
             Out", "coordinated by.", "facilities.partners with"), writer's
             notes as headings ("Call to action: …", all locales) and raw
             "Boat4You/search?…" paths printed after a link — see
             scripts/seo_corpus_rules.py (holes)

After the fixers, every file is checked (seo_corpus_rules.checks): operator
names, inland terms, ownership claims (plus an independent deny-list that
does not reuse the fixer patterns), raw URLs / "\">" / brackets in visible
text, sentences starting in lower case, founded≠2013, compass directions,
broken hrefs, did/label mismatch, nested links, Cyrillic, the wrong language,
English text in a translation, a translation about other places than its EN
source, numbers a retranslated page has that its EN source does not,
duplicate paragraphs/headings, the deleted-brand shapes (HOLE_DENY), licence
names that do not exist — "International Yacht Certificate (IYC)", "IYCC",
"Izaslanica za Brodicu", "International Boating License", "Internationaler
Segelschein" and the International Sailing Federation (ISAF) as a licence
body (only next to licence wording, so regatta history passes), in all 9
locales with their translations (LICENCE_NAME_DENY / LICENCE_BODY_DENY, check
"licence-name"; added 6.10.2026, the licence is the ICC or a national
licence), the formal register on the informal NL and PL sites ("u/uw",
"Państwo/Proszę …"; check "register", FORMAL_REGISTER, 6.10.2026) — and the
UI strings in messages/<locale>/*.json
(seo_corpus_rules.message_checks). Any finding fails --check.

Added 6.10.2026 (w610, checks only, in this file; review of 6.10.2026 widened
them and added `--self-test`, which proves every sentence the review quoted is
found and every allowed one passes): "perday-crew-price" — a per-day price on
a skipper/crew/hostess/chef/instructor in any locale ("Skippered charters add
EUR 300-500 daily", "150 bis 200 Euro pro Tag plus Verpflegung"; vessel day
rates, crewed packages, food budgets, tips, fuel and mooring pass, decided by
the words next to the amount; since 7.10.2026 also in the FAQ,
src/posts/static/<locale>/faq.md, file "faq/<locale>"); "operator-claim" — Boat4You as employer of
crews, owner of fleets/bases or the party that briefs and maintains the boats
("Boat4You's skippers", "la flotte ... de Boat4You", "employés par Boat4You",
"mantidas pela Boat4You", "Unsere Schiffe", "Boat4You posiada 14", "Boat4You
conducts pre-departure briefings"; since 7.10.2026 also a Boat4You office at the
destination, OFFICE_DENY: "Our Marbella office", "our marina office"); "brand-hole" — a sentence the brand was
cut from ("Stocks 14 multihulls", "Learn how manages", "Das Team von kümmert
sich"); "fee-repeat" — the "fees are shown on each boat's page" sentence more
than once on a page; "ascii-hr-name" — Šibenik, Kaštela, Sukošan, Korčula,
Primošten, Palmižana, Komiža, Biševo, Lošinj written without diacritics in
visible text (hrefs, did= and file names are not text; Greek Kastela in
Piraeus passes). Added 8.10.2026 ("GULET JE UVIJEK SA POSADOM"): "gulet-crewed"
— on a gulet landing (file name with "gulet") no sentence may offer or imply the
gulet bareboat or skipper-only ("Can I add a skipper after booking bareboat?",
"For bareboat charter, a valid skipper licence…", "mixed bareboat-and-skippered
packages", "Semi-bareboat gulets", "Most gulets … include professional crew",
"skipper (if hired)", "…and crew arrangement if you prefer cold-season
sailing"), per-locale lists (GULET_CREWED_DENY); the <title> and meta
description of a gulet landing may not say bareboat / without skipper at all
(GULET_HEAD_DENY; the landing does not render the head, the file still
carries it); comparisons ("you cannot bareboat a gulet", "Unlike bareboat
charters…") and the other landings, mixed destination pages included, pass.

Unfilled page templates (PLACEHOLDER / "Key Advantage Section 1") are only
reported, and fail --check: they must be written or removed by hand.

Usage:
  python3 scripts/seo-corpus-qa.py            # fix in place, print summary
  python3 scripts/seo-corpus-qa.py --check    # report only; exit 1 if anything would change
  python3 scripts/seo-corpus-qa.py --log changes.tsv   # every change: rule, file, before, after
  python3 scripts/seo-corpus-qa.py --only faq,facts
  python3 scripts/seo-corpus-qa.py --report findings.tsv   # every check finding
  python3 scripts/seo-corpus-qa.py --refresh-locations     # re-snapshot /public/locations first
  python3 scripts/seo-corpus-qa.py --self-test   # the w610 checks against the review's sentences (no corpus scan)
  python3 scripts/seo-corpus-qa.py --gulet-crewed   # only the gulet-crewed check on the gulet landings (seconds)
"""

import argparse
import collections
import html
import json
import multiprocessing
import os
import re
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import seo_corpus_rules as R  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'seo-content')
LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr']
# brand runs before facts/counts: a restored "Boat4You's … base" or
# "Boat4You's 395-yacht" is then handled in the same pass.
RULES = ['foreign', 'structure', 'faq', 'junk', 'brand', 'subject', 'holes', 'facts', 'claims', 'casing', 'claims2',
         'counts', 'headings', 'operators', 'inland', 'compass', 'links', 'dupes', 'edits', 'recap']


class Ctx:
    """Per-file context: locale, file name, change log."""

    def __init__(self, locale, name, log, corpus_slugs=frozenset()):
        self.locale = locale
        self.name = name
        self.log = log
        self.corpus_slugs = corpus_slugs

    def record(self, rule, before, after, context=''):
        self.log.append((rule, f'{self.locale}/{self.name}', before, after, context))


def squash(text):
    return re.sub(r'\s+', ' ', text).strip()


def plain(fragment):
    """Visible text of an HTML fragment, whitespace-collapsed (a literal "<" in the text is not a tag)."""
    return squash(html.unescape(R.TAG.sub(' ', fragment)))


def split_body(src):
    """(head, body, tail) — the rules only edit the body."""
    m = re.search(r'<body\b[^>]*>', src)
    if not m:
        return '', src, ''
    start = m.end()
    end = src.find('</body>', start)
    if end < 0:
        return src[:start], src[start:], ''
    return src[:start], src[start:end], src[end:]


# ----------------------------------------------------------------- foreign

# Machine-translation debris: Ukrainian text inside HR files (in
# sailing-yacht-charter-paros-port.html half the file is a leaked Ukrainian
# content brief), single CJK/Arabic glyphs, and an ES file whose output looped
# on a "{anchor}" placeholder. Each segment is replaced with the text it should
# have been (from the EN source); runs before `structure`, which then closes
# the files the loop left without </body>.
PAROS_HR_REST = '''po kojoj su jednotrupne jedrilice poznate. Moderna jedra s namatanjem pojednostavljuju rukovanje, a hidraulični sustavi smanjuju napor posade. Neposredna veza kormila i mora – osjet kormila, pritisak vjetra u jedrima, pramčani val – obilježje je jedriličarske tradicije jednotrupaca.</p>

<p>Sidrište i vezovi luke Paros savršeno odgovaraju jedrilicama. Klasične plutače ili fiksni vezovi mediteranskog tipa primaju više od 30 gostujućih jednotrupaca. Stalna aktivnost trajektnog terminala znači svakodnevne vremenske prognoze, dostavu namirnica i živu atmosferu na rivi. Jedrilice se neprimjetno uklapaju u ritam ove radne luke.</p>

<p>Jednotrupci s dubokim gazom mijenjaju pristup plitkim sidrištima za bolju plovidbu uz vjetar i veću sigurnost na moru. Kikladske plovidbe često uključuju jedrenje uz vjetar (orcanje prema Naxosu protiv popodnevnog meltemija); tu jednotrupci dolaze do izražaja – jedre oštrije u vjetar i napreduju brže od katamarana ili motornih brodova slične veličine.</p>

<h2>Rute i planiranje plovidbe iz luke Paros</h2>

<p><strong>Probna plovidba do Antiparosa (1,5 nm):</strong> Orcanje ili jedrenje uz pomoć motora prema jugozapadu do Antiparosa. Istražite morske špilje (dostupne pomoćnim čamcem) i prenoćite na sidru u zaštićenoj luci. Povratak jedrenjem prema sjeveroistoku. Najlakša plovidba, prikladna za posade svih razina.</p>

<p><strong>Plovidba do Naxosa (8 nm):</strong> Jedrenje do glavne luke Naxosa kod Hore. Umjereno zahtjevna plovidba (popodnevni meltemi često puše u pramac). Usidrite se, razgledajte spomenik Portaru i opskrbite se na gradskim tržnicama. Povratak donosi brže jedrenje. Ukupno 4–5 sati, ovisno o jačini vjetra.</p>

<p><strong>Duže istraživanje Ciklada:</strong> Višednevni trokuti Paros–Antiparos–Naxos s neobaveznim produžetkom do Koufonisija (18 nm istočno, za iskusnije). Dnevne dionice od 8 do 18 nm odgovaraju mješovitim posadama. Večeri na sidrištima u tirkiznom moru; jutarnji polasci prije nego što meltemi ojača. Opskrba u luci Paros, gradu Naxosu i, ako postoje, u skromnim trgovinama udaljenih uvala.</p>

<p><strong>Sjeverna ruta – od Parosa prema Sporadima:</strong> Zahtjevan višednevni itinerar prema sjeveru, do Skiathosa ili Skopelosa. Traži iskusnu posadu i fleksibilan raspored; obično se kombinira s trokutom Paros–Naxos za tjedne avanture.</p>

<h2>Vezovi i sadržaji u luci Paros</h2>

<p>Luka Paros prima gostujuće jedrilice na fiksnim mediteranskim vezovima ili na plutačama. Recepcija osigurava priključak struje od 220 V (ormarići od 16 A), pitku vodu na svakom vezu i dostavu goriva s obližnjeg gata. Trajektni terminal jamči opskrbu u svako doba: supermarketi, ribarnice, pekarnice, delikatese i restorani rade bez prekida. Bankomati, praonice rublja i nautičke trgovine olakšavaju duže najmove.</p>

<p>Osoblje recepcije pomaže oko vremenskih prognoza, lokalnih preporuka i pravila vezivanja. Wi-Fi omogućuje komunikaciju posade i planiranje rute. Živa riva – trajekti koji pristaju, ribarski brodovi koji iskrcavaju ulov, užurbane taverne – pruža posadama doživljaj lokalnog života.</p>

<h2>Jedrenje uz meltemi: vjetrovi i strategija</h2>

<p><strong>Podrijetlo meltemija:</strong> Poznati sjeverni vjetar nastaje nad srednjom Europom, ubrzava niz Balkanski poluotok i izbija sa sjevera preko Egejskog mora. Popodnevno zagrijavanje pojačava razliku tlaka pa vjetar najjače puše od 14 do 18 sati, a slabi o zalasku sunca.</p>

<p><strong>Uobičajeni obrasci:</strong> svibanj–lipanj: slab do umjeren, 10–15 čvorova. Srpanj–kolovoz: jak, 15–22 čvora, najpostojaniji. Rujan–listopad: slabiji, 12–18 čvorova. Jutarnje tišine (od 6 do 11 sati) idealne su za sidrenje, opskrbu i odmor posade. Popodnevno jedrenje traži punu pozornost; iskusne posade uživaju u izazovu.</p>

<p><strong>Strategija plovidbe:</strong> Plovidbe uz vjetar (npr. orcanje od Parosa prema Naxosu) traže precizno taktičko jedrenje ili strpljenje. Kombinacija jedara i motora odgovara obiteljima i manje ambicioznim posadama. Plovidbe niz vjetar čisti su užitak – jedra „na leptir“, bočni vjetar i opušteno kormilarenje.</p>

<h2>Obuka posade i dozvole</h2>

<p>Većina najmova jedrilica bez posade traži međunarodnu svjedodžbu o osposobljenosti (ICC) ili odgovarajuću nacionalnu dozvolu. <strong>Boat4You</strong> provjerava dozvole prije isplovljavanja. Ako dozvole nema ili posada ima malo iskustva, organiziramo profesionalnog skipera ili obuku prije najma.</p>

<p>Najam s posadom potpuno uklanja brigu oko dozvola. Profesionalni skiperi vode navigaciju, rukovanje jedrima i planiranje plovidbe, a posada uživa u jedrenju, učenju i istraživanju otoka. Najam s posadom odgovara mladencima, obiteljima koje žele učiti kroz praksu i manje iskusnim avanturistima.</p>

<h2>Primjer 7-dnevnog itinerara iz luke Paros</h2>

<p><strong>1. dan (luka Paros):</strong> Dolazak ujutro, preuzimanje jedrilice, sigurnosni brifing, vježba rukovanja jedrima, prva opskrba i večernja probna plovidba do sidrišta Naoussa na sjeveru otoka (10 nm, 3–4 sata). Noćenje u zaljevu Naoussa.</p>

<p><strong>2. dan:</strong> Jutarnje jedrenje do Antiparosa (4–5 sati). Sidrenje u luci, obilazak špilja, ronjenje na dah, večera na kopnu i noćenje.</p>

<p><strong>3. dan:</strong> Od Antiparosa do Naxosa (12 nm, promjenjivi vjetrovi). Sidrenje kod Hore, razgledavanje grada i spomenika Portara, večera u taverni i noćenje.</p>

<p><strong>4. dan:</strong> Dnevno jedrenje oko Naxosa – do Mikri Vigle (6 nm). Ronjenje na dah, ručak na brodu i popodnevni povratak u Horu. Noćenje u luci.</p>

<p><strong>5. dan:</strong> Neobavezna plovidba do Koufonisija (18 nm, za iskusnije posade). U suprotnom ostajete u području Naxosa za dan odmora i kulture. Noćenje na sidrištu.</p>

<p><strong>6. dan:</strong> Povratak prema Parosu. Ako ste 5. dan plovili do Koufonisija, prenoćite na usputnom sidrištu; u suprotnom plovite izravno do luke Paros ili preko Antiparosa.</p>

<p><strong>7. dan:</strong> Završni povratak u luku Paros (8 nm), jutarnje kupanje, predaja jedrilice i oproštajna večera posade.</p>

<h2>Često postavljana pitanja</h2>

<h3>Kolika je razlika u gazu između jednotrupne jedrilice i katamarana?</h3>

<p>Jednotrupci od 30 do 40 stopa obično imaju gaz od 1,8 do 2,2 metra, a katamarani od 1,0 do 1,5 metara. Duboka kobilica jednotrupca poboljšava jedrenje uz vjetar, stabilnost i sigurnost na moru, dok katamarani ulaze u plića sidrišta. Iz luke Paros većina kikladskih odredišta ide u prilog jednotrupcu; istraživanje plitkih uvala ide u prilog katamaranu.</p>

<h3>Mogu li naučiti jedriti tijekom najma s posadom?</h3>

<p>Da. Najam s posadom idealan je za učenje. Profesionalni skiperi podučavaju trimanje jedara, upravljanje kormilom, planiranje plovidbe i navigaciju. Boat4You organizira skipere-instruktore s iskustvom u podučavanju. Učenje kroz praksu od izlaska do zalaska sunca pravo je jedriličarsko obrazovanje.</p>

<h3>Kako autopilot radi na jakom meltemiju?</h3>

<p>Suvremene jedrilice imaju hidraulične ili električne autopilote koji drže kurs unutar 2–3 stupnja. Meltemi od 12 do 20 čvorova idealan je za autopilot – dovoljno jak da smanji umor kormilara, a ne toliko ekstreman da bi ručno kormilarenje bilo nužno. Odmor posade, priprema obroka i dogovor oko sidrenja prednosti su autopilota.</p>

<h3>Što ako vjetar bude jači od prognoze?</h3>

<p>Mogućnosti su: smanjiti jedra (kratiti glavno jedro, namotati floks), upaliti motor uz jedra ili se vratiti u zaštićeno sidrište. Na Kikladima zaklon nikad nije daleko, pa je povlačenje jednostavno. Boat4You savjetuje kako itinerar prilagoditi vremenu; grčko ljeto rijetko donosi ekstremne nevere.</p>

<h3>Je li noćna plovidba uobičajena na Kikladima?</h3>

<p>Neke posade vole polazak predvečer (od 16 do 18 sati) i jedrenje u sumrak. Noćne plovidbe traže iskusnog skipera i potpunu opremu za noćnu plovidbu (navigacijska svjetla, navigacijski uređaji). Većina najmoprimaca radije jedri danju i noći na sidru.</p>

<h2>Zašto jedriti jednotrupcem iz luke Paros uz Boat4You</h2>

<p>Boat4You surađuje s pouzdanim operaterima na Parosu koji održavaju moderne jedrilice s učinkovitim jedrima, autopilotom i potpunom navigacijskom opremom. Naša <a href="https://www.boat4you.com/search?destinations=Greece&did=c-86">pretraga jedrilica na Parosu</a> prikazuje dostupnost u stvarnom vremenu i transparentne cijene. Brinemo o provjeri dozvola, osiguranju i logistici posade kako bi vaša avantura iz luke Paros nadmašila očekivanja.</p>

<p>Spremni za jedrenje? <a href="https://www.boat4you.com/search?destinations=Greece&did=c-86">Pretražite jedrilice iz luke Paros</a> ili se obratite našem timu za najam s posadom, obuku prije najma ili planiranje plovidbe po mjeri. Posjetite stranicu <a href="https://www.boat4you.com/how-we-work">kako radimo</a> ili <a href="https://www.boat4you.com/faq">česta pitanja</a> za sve informacije o jedrenju u Grčkoj.</p>
</body>
</html>
'''

FOREIGN_FIXES = [
    ('hr', 'sailing-yacht-charter-paros-port.html',
     re.compile(r'za koju su(?=Якщо виникла)[\s\S]*$'), PAROS_HR_REST),
    ('hr', 'kornati-sailing-yacht-charter.html',
     re.compile(r'Jedrilice su izbor purista:Якщо ви шукаєте[^<]*'),
     'Jedrilice su izbor purista: ako tražite pravo jedriličarsko iskustvo, odaberite jedrilicu. To su jednotrupna '
     'plovila osmišljena prema filozofiji da je snaga vjetra – uz pomoćni motor za manevriranje – pravo okruženje '
     'jedrenja. Na Kornatima, gdje ljeti postojano puše maestral, jedrilice dolaze do punog izražaja: učinkovite su '
     'na plovidbi, troše minimalno goriva i stvaraju vezu između jedriličara i mora koju snaga motora i tehnologija ne '
     'mogu zamijeniti. Dostupne bez posade (za kvalificirane skipere) ili s punom posadom (profesionalni skiper i '
     'kuhar), jedrilice odgovaraju onima koji cijene tradiciju, pomorstvo i romantiku obzora ispunjenog jedrima.'),
    ('hr', 'lavrion-sailing-yacht-charter.html',
     re.compile(r'koji tražeЯкщо ви шукаєте[^<]*'),
     'koji traže pravo grčko iskustvo, a ne blještavu međunarodnu atmosferu nekih charter luka – Lavrion je sačuvao '
     'svoj autentični karakter. Tradicionalne taverne poslužuju prženu ribu ulovljenu tog jutra, a lukom odjekuju '
     'razgovori na grčkom i zveckanje užadi o aluminijske jarbole. Gradski rudarski muzej pripovijeda o dugoj '
     'povijesti ovog kraja. Šetajući ulicama vidjet ćete stare vile, lokalne pekarnice i ribare koji krpaju mreže – '
     'prizore koji vas povezuju s naraštajima mediteranskih pomoraca.'),
    ('hr', 'croatia-sailing-yacht-charter.html',
     re.compile(r'Za razliku od svojih katamaranskih srodnika,Якщо ви шукаєте[^<]*?на катамарані\.'),
     'Za razliku od svojih katamaranskih srodnika, jedrilice nude autentičan doživljaj jedrenja kakav katamaran ne '
     'može pružiti – ako tražite pravo jedriličarsko iskustvo, jedrilica u Hrvatskoj idealan je izbor.'),
    ('hr', 'sailing-yacht-charter-corfu-gouvia-marina.html',
     re.compile(r'ovdje nude moderneЯкщо ви шукаєте[^<]*'),
     'ovdje nude moderne jedrilice za tradicionalno jedrenje, istraživačka putovanja ili plovidbu prema Jadranu. '
     'S Krfa se more otvara u svim smjerovima: na jug prema Lefkadi i srcu Jonskog mora, na sjever prema '
     'Diapontijskim otocima, na istok prema obali Albanije, a preko otvorenog mora na zapad prema Italiji. '),
    ('hr', 'bay-of-biscay-sailing-yacht-charter.html',
     re.compile(r'<strong>Boat4You</strong>oveЯкщо ви плануєте[^<]*?isporučuje povjerenje'),
     'jedrilice koje nudi <strong>Boat4You</strong> pružaju povjerenje'),
    # Cyrillic inside <head> meta descriptions (not rendered, but the files are public).
    ('hr', 'bay-of-biscay-sailing-yacht-charter.html',
     re.compile(r'(content="Unajmite oceanske jedrilice u Biskajskom zaljevu): 11Якщо[^"]*'),
     r'\1: jednotrupne jedrilice za obalna krstarenja i višetjedne pučinske plovidbe prema Španjolskoj.'),
    ('hr', 'bodrum-sailing-yacht-charter.html',
     re.compile(r'(content="Najmite jedrilicu u Bodrumu\.) ModerneЯкщо[^"]*'),
     r'\1 Bez posade, sa skiperom ili s punom posadom – jedrilice za parove, obitelji i grupe, uz transparentne '
     r'cijene i dostupnost u stvarnom vremenu.'),
    ('hr', 'primosten-sailing-yacht-charter.html',
     re.compile(r'(content="Najam jedrilica u Primoštenu, Hrvatska\.) VisokoučinkoviteЯкщо[^"]*'),
     r'\1 Jedrilice bez posade i sa skiperom – idealna polazna točka za otoke srednje Dalmacije između Splita i '
     r'Šibenika.'),
    ('hr', 'sailing-yacht-charter-athens-alimos-marina.html',
     re.compile(r'(content="Najam jedrilica iz Marine Alimos u Ateni\.) KlasičneЯкщо[^"]*'),
     r'\1 Klasične i moderne jedrilice sa skiperom ili bez njega za istraživanje Saronskog zaljeva i Kikladskih '
     r'otoka.'),
    # Stray CJK / Arabic glyphs.
    ('pl', 'italian-adriatic-sailing-yacht-charter.html', re.compile(r'([Cc]zarter [Jj]achtów) z日本では Włoski Adriatyk'),
     r'\1 na włoskim Adriatyku'),
    ('nl', 'rhodes-sailing-yacht-charter.html', re.compile(r'Haveninvعلopen'), 'Haveninvaarten'),
    ('de', 'sailing-yacht-charter-corfu-gouvia-marina.html', re.compile(r'keine Mittelmeer-Gale встречать'),
     'keine Mittelmeer-Stürme erleben'),
    ('it', 'rijeka-sailing-yacht-charter.html', re.compile(r'il suo castello франкопан'), 'il suo castello dei Frankopan'),
    ('pt', 'catamaran-charter-paros.html', re.compile(r'os transturными da sua chegada'), 'os transtornos da sua chegada'),
    ('nl', 'catamaran-charter-cote-d-azur-port-pin-rolland.html', re.compile(r'om вашем catamaran te ontdekken'),
     'om uw catamaran te ontdekken'),
    ('nl', 'dubrovnik-catamaran-charter.html', re.compile(r'in de hoofdването van Korčula'), 'in de hoofdhaven van Korčula'),
    ('hr', 'marina-aliki-sailing-yacht-charter.html', re.compile(r'Istražite Ciklade modernomЯкщо jedrilicom'),
     'Istražite Ciklade modernom jedrilicom'),
    ('fr', 'sailing-yacht-charter-marina-imbat.html', re.compile(r'que toute autreも luxury à terre'),
     'que tout autre luxe à terre'),
    # "{anchor}" = the word "anchor" the translation turned into a placeholder.
    ('es', 'tyrrhenian-sea-gulet-charter.html', re.compile(r'cenar a la\{anchor\} en lugar de en\{anchor\}'),
     'cenar al ancla en lugar de en puerto'),
    ('es', 'tyrrhenian-sea-gulet-charter.html', re.compile(r'(?: a la\{anchor\}){3,}[\s\S]*$'), ''),
    ('es', 'tyrrhenian-sea-gulet-charter.html', re.compile(r'a la\{anchor\}'), 'al ancla'),
]
# An unfilled page template ("TITLE_PLACEHOLDER", "Key Advantage Section 1",
# "First benefit paragraph providing …") and its translations. Such a file
# cannot be fixed by a rule — it has to be written or removed — so it is only
# reported (and fails --check). A translation is flagged when its EN source
# is, whatever its own heading reads ("Ključne prednosti").
TEMPLATE_LEFT = re.compile(
    r'PLACEHOLDER|Key Advantage Section|benefit paragraph|Sektion \d<|Sezione \d<|Sección \d<|Seção \d<|Secção \d<|'
    r'Sectie \d<|Sekcja \d|Section \d<', re.I)
FOREIGN_LEFT = re.compile(r'[\u0400-\u04ff]{2,}|[\u3040-\u30ff\u4e00-\u9fff\u0600-\u06ff]|\{[a-z_]+\}')


def fix_foreign(src, ctx):
    for locale, name, pattern, repl in FOREIGN_FIXES:
        if locale != ctx.locale or name != ctx.name:
            continue
        def sub(m, repl=repl):
            new = m.expand(repl) if repl and '\\' in repl else repl
            ctx.record('foreign', squash(m.group(0))[:160], squash(new)[:160] or '(removed)')
            return new

        src = pattern.sub(sub, src)
    return src


# ---------------------------------------------------------------- structure

# Two EN files lost `">…</head><body><h1>` and the start of the first
# paragraph: the meta description attribute runs into the body text, so the
# page rendered from the middle of a sentence. Rebuilt from the DE/HR
# translations, which still have the intro.
BROKEN_HEAD = {
    ('en', 'catamaran-charter-procida.html'): (
        re.compile(r'(<meta name="description" content=")Charter a catamaran from Procida[^"]*?fisheri\.(?=\'s compact harbor)'),
        '\\1Charter a catamaran from Procida and explore all of Campania.">\n</head>\n<body>\n'
        '<h1>Catamaran Charter from Procida – Campania Island Base</h1>\n'
        '<p>Charter a catamaran from Procida and explore all of Campania. This charming island community, '
        'renowned for its pastel-colored house facades, authentic fishing harbors and lively traditions, is an '
        'ideal starting point for exploring the Tyrrhenian Sea. Procida',
    ),
    ('en', 'istra-motorboat-charter.html'): (
        re.compile(r'(<meta name="description" content=")Charter a motorboat in Istra[^"]*?and Kv\.(?=\'s moderate distances)'),
        '\\1Charter a motorboat in Istra for day trips and island-hopping. Explore Brijuni, Rovinj, Pag and Krk fast.">\n'
        '</head>\n<body>\n<h1>Motorboat Charter in Istra: Speed and Flexibility in the Northern Adriatic</h1>\n'
        '<p>Istria, the largest peninsula in the Adriatic, is a first-class cruising ground for motorboat charters. Istria',
    ),
}


def repair_broken_head(src, ctx):
    fix = BROKEN_HEAD.get((ctx.locale, ctx.name))
    if not fix or '<body' in src:
        return src
    pattern, replacement = fix
    new, n = pattern.subn(replacement, src, count=1)
    if n:
        # The stray `</head>`/`</body>` markers the swallowed text carried are gone with it; the
        # document tail still closes </body></html>.
        ctx.record('structure', squash(pattern.search(src).group(0))[:160], '(meta description closed; head/body/h1 restored)')
    return new


BLOCK_END = re.compile(r'</(?:p|h[2-6]|ul|ol|table|div|blockquote)\s*>')
DANGLING_HEADING = re.compile(r'<h[2-6]\b[^>]*>(?:(?!<h[1-6]\b)[\s\S])*?</h[2-6]\s*>\s*$')


MISMATCHED_HEADING = re.compile(r'<h([1-6])(\b[^>]*)>([^<]*)</h(?!\1)[1-6]\s*>')


def fix_structure(src, ctx):
    src = repair_broken_head(src, ctx)

    def close_heading(m):
        fixed = f'<h{m.group(1)}{m.group(2)}>{m.group(3)}</h{m.group(1)}>'
        ctx.record('structure', m.group(0), fixed)
        return fixed

    src = MISMATCHED_HEADING.sub(close_heading, src)
    if '</body>' in src or '<body' not in src:
        return src
    head, body, _ = split_body(src)
    ends = list(BLOCK_END.finditer(body))
    if not ends:
        return src
    kept = body[: ends[-1].end()]
    # A heading whose content was cut away (a question without its answer).
    while True:
        m = DANGLING_HEADING.search(kept)
        if not m:
            break
        kept = kept[: m.start()]
    kept = kept.rstrip()
    # Close list/table/div wrappers the cut left open.
    closers = ''
    for tag in ('li', 'ul', 'ol', 'table', 'div'):
        opened = len(re.findall(rf'<{tag}\b', kept))
        closed = len(re.findall(rf'</{tag}\s*>', kept))
        closers += f'</{tag}>' * max(0, opened - closed)
    dropped = body[len(kept):]
    ctx.record('structure', squash(dropped)[-160:], '(dropped unfinished tail; closed body/html)')
    return f'{head}{kept}{closers}\n</body>\n</html>\n'


# ---------------------------------------------------------------------- faq

FAQ_HEADING = {
    'en': r'\bFAQs?\b|Frequently Asked Questions|Common Questions',
    'de': r'\bFAQs?\b|Häufig gestellte Fragen|Häufige Fragen',
    'fr': r'\bFAQs?\b|Foire aux questions|Questions fréquemment posées|Questions fréquentes',
    'it': r'\bFAQs?\b|Domande frequenti',
    'es': r'\bFAQs?\b|Preguntas frecuentes',
    'pt': r'\bFAQs?\b|Perguntas frequentes',
    'nl': r'\bFAQs?\b|Veelgestelde vragen',
    'pl': r'\bFAQs?\b|(?:Najczęściej|Często) zadawane pytania',
    'hr': r'\bFAQs?\b|Često postavljana pitanja|Pitanja i odgovori|Česta pitanja',
}
H2_OPEN = re.compile(r'<h2\b[^>]*>([\s\S]*?)</h2\s*>')
H3_OPEN = re.compile(r'<h3\b[^>]*>([\s\S]*?)</h3\s*>')


def question_key(fragment):
    text = plain(fragment).lower()
    text = text.replace('’', "'").replace('‘', "'").replace('–', '-').replace('—', '-')
    return re.sub(r'[\s?¿!.:]+$', '', text)


def shingles(text, n=3):
    words = re.findall(r'\w+', text.lower())
    return {tuple(words[i : i + n]) for i in range(len(words) - n + 1)}


def is_question(fragment):
    return plain(fragment).rstrip().endswith('?')


def fix_faq(src, ctx):
    head, body, tail = split_body(src)
    faq_re = re.compile(FAQ_HEADING[ctx.locale], re.I)
    chunks = re.split(r'(?=<h2\b)', body)
    pre, sections = chunks[0], chunks[1:]

    # 1) A repeated non-FAQ <h2> heading: the later section goes when it is a
    #    paraphrase of the first (shared 3-grams >= 40 %) or the short generic
    #    "Plan your charter" link block appended a second time.
    first_by_heading = {}
    kept_sections = []
    for sec in sections:
        m = H2_OPEN.match(sec)
        heading = plain(m.group(1)).lower() if m else ''
        if heading and not faq_re.search(heading) and heading in first_by_heading:
            earlier = first_by_heading[heading]
            a, b = shingles(plain(earlier)), shingles(plain(sec))
            overlap = len(a & b) / max(1, min(len(a), len(b)))
            if overlap >= 0.4 or len(plain(sec)) <= 350:
                ctx.record('faq', plain(sec)[:160], f'(repeated section removed, overlap {overlap:.2f})')
                continue
        if heading and heading not in first_by_heading:
            first_by_heading[heading] = sec
        kept_sections.append(sec)
    sections = kept_sections

    # 2) Repeated question headings (<h3> ending with "?"): the first wins.
    seen_q = set()

    def dedupe_units(text):
        parts = re.split(r'(?=<h3\b)', text)
        out = [parts[0]]
        for unit in parts[1:]:
            m = H3_OPEN.match(unit)
            if m and is_question(m.group(1)):
                key = question_key(m.group(1))
                if key in seen_q:
                    ctx.record('faq', plain(unit)[:160], '(repeated question removed)')
                    continue
                seen_q.add(key)
            out.append(unit)
        return ''.join(out)

    pre = dedupe_units(pre)
    sections = [dedupe_units(sec) for sec in sections]

    # 3) One FAQ section: later FAQ sections holding only questions are merged
    #    into the first FAQ section that has questions; emptied ones dropped.
    target = None
    result = []
    for sec in sections:
        m = H2_OPEN.match(sec)
        if not m or not faq_re.search(plain(m.group(1))):
            result.append(sec)
            continue
        rest = sec[m.end():]
        parts = re.split(r'(?=<h3\b)', rest)
        intro, units = parts[0], parts[1:]
        questions = [bool(H3_OPEN.match(u)) and is_question(H3_OPEN.match(u).group(1)) for u in units]
        if not units and not plain(intro):
            ctx.record('faq', plain(m.group(0)), '(empty FAQ heading removed)')
            continue
        if target is None:
            if any(questions):
                target = len(result)
            result.append(sec)
            continue
        if units and all(questions) and not plain(intro):
            merged = ''.join(units)
            body_t = result[target].rstrip()
            trailing = result[target][len(body_t):]
            result[target] = f'{body_t}\n{merged.strip()}\n{trailing}' if trailing else f'{body_t}\n{merged.strip()}\n'
            ctx.record('faq', plain(m.group(0)), '(second FAQ heading merged into the first FAQ)')
            continue
        result.append(sec)

    new_body = pre + ''.join(result)
    if new_body == body:
        return src
    return head + new_body + tail

# ------------------------------------------------------------------- facts

# Exact sentence-level fixes: (locale, file or None for all, old, new).
FACT_REPLACEMENTS = [
    # ACI = Adriatic Croatia International Club (not "Insurance"); ACI runs
    # marinas along the whole coast (no hard count), and ACI Marina Split is a
    # base of many charter companies — not "the primary base for Boat4You"
    # (a booking platform has no bases).
    ('en', 'croatia-catamaran-charter.html',
     'ACI stands for Adriatic Croatia Insurance—the largest marina group in the country with 23 locations. Split ACI is the primary base for Boat4You and most international charter companies.',
     'ACI stands for Adriatic Croatia International Club—the largest marina group in the country, with marinas along the whole coast. ACI Marina Split is a major base for many international charter companies.'),
    ('de', 'croatia-catamaran-charter.html',
     'ACI steht für Adriatic Croatia Insurance – die größte Marina-Gruppe des Landes mit 23 Standorten. Split ACI ist die Hauptbasis für Boat4You und die meisten internationalen Charterfirmen.',
     'ACI steht für Adriatic Croatia International Club – die größte Marina-Gruppe des Landes, mit Marinas entlang der gesamten Küste. Die ACI Marina Split ist eine wichtige Basis für viele internationale Charterfirmen.'),
    ('fr', 'croatia-catamaran-charter.html',
     'ACI signifie Adriatic Croatia Insurance, le plus grand groupe de marinas du pays avec 23 sites. Split ACI est la base principale pour Boat4You et la plupart des sociétés de location internationales.',
     "ACI signifie Adriatic Croatia International Club, le plus grand groupe de marinas du pays, avec des marinas tout le long de la côte. L'ACI Marina Split est une base importante pour de nombreuses sociétés de location internationales."),
    ('it', 'croatia-catamaran-charter.html',
     'ACI sta per Adriatic Croatia Insurance, il più grande gruppo di porti turistici del paese con 23 sedi. Spalato ACI è la base principale per Boat4You e la maggior parte delle compagnie di charter internazionali.',
     "ACI sta per Adriatic Croatia International Club, il più grande gruppo di porti turistici del paese, con marine lungo tutta la costa. L'ACI Marina Spalato è una base importante per molte compagnie di charter internazionali."),
    ('es', 'croatia-catamaran-charter.html',
     'ACI significa Adriatic Croatia Insurance, el mayor grupo de puertos deportivos del país con 23 ubicaciones. Split ACI es la base principal para Boat4You y la mayoría de las compañías de alquiler internacionales.',
     'ACI significa Adriatic Croatia International Club, el mayor grupo de puertos deportivos del país, con puertos a lo largo de toda la costa. ACI Marina Split es una base importante para muchas compañías de alquiler internacionales.'),
    ('pt', 'croatia-catamaran-charter.html',
     'ACI significa Adriatic Croatia Insurance – o maior grupo de marinas do país com 23 localizações. Split ACI é a base principal para a Boat4You e a maioria das empresas internacionais de aluguer.',
     'ACI significa Adriatic Croatia International Club – o maior grupo de marinas do país, com marinas ao longo de toda a costa. A ACI Marina Split é uma base importante para muitas empresas internacionais de aluguer.'),
    ('nl', 'croatia-catamaran-charter.html',
     'ACI staat voor Adriatic Croatia Insurance—de grootste jachthaven groep in het land met 23 locaties. Split ACI is de primaire basis voor Boat4You en de meeste internationale chartermaatschappijen.',
     'ACI staat voor Adriatic Croatia International Club—de grootste jachthavengroep van het land, met jachthavens langs de hele kust. ACI Marina Split is een belangrijke basis voor veel internationale chartermaatschappijen.'),
    ('pl', 'croatia-catamaran-charter.html',
     'ACI to skrót od Adriatic Croatia Insurance – największej grupy marin w kraju z 23 lokalizacjami. Split ACI jest główną bazą dla Boat4You i większości międzynarodowych firm czarterowych.',
     'ACI to skrót od Adriatic Croatia International Club – największej grupy marin w kraju, z marinami wzdłuż całego wybrzeża. ACI Marina Split jest ważną bazą wielu międzynarodowych firm czarterowych.'),
    ('hr', 'croatia-catamaran-charter.html',
     'ACI je skraćenica od Adriatic Croatia Insurance – najveća marina grupa u zemlji s 23 lokacije. Split ACI je glavna baza za Boat4You i većinu međunarodnih charter tvrtki.',
     'ACI je skraćenica od Adriatic Croatia International Club – najveća grupa marina u zemlji, s marinama duž cijele obale. ACI marina Split važna je baza mnogih međunarodnih charter tvrtki.'),
    # Spain: "RYA/Adriatic Club" is not a sailing school body.
    ('en', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(such as the RYA)'),
    ('de', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(z. B. RYA)'),
    ('fr', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(comme la RYA)'),
    ('it', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(come la RYA)'),
    ('es', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(como la RYA)'),
    ('pt', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(como a RYA)'),
    ('nl', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(zoals de RYA)'),
    ('pl', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(np. RYA)'),
    ('hr', 'spain-sailing-yacht-charter.html', '(RYA/Adriatic Club)', '(npr. RYA)'),
    # Croatia and Montenegro both use the euro; the kuna stopped being legal
    # tender on 15.1.2023.
    ('en', 'dubrovnik-catamaran-charter.html',
     ', currency differences (Euro used, though Croatian Kuna still legal tender), and different', ' and different'),
    ('de', 'dubrovnik-catamaran-charter.html',
     ', Währungsunterschiede (Euro wird verwendet, obwohl die kroatische Kuna weiterhin gesetzliches Zahlungsmittel ist) und', ' und'),
    ('fr', 'dubrovnik-catamaran-charter.html',
     ", des différences de monnaie (l'Euro est utilisé, bien que la Kuna croate soit toujours légale), et une", ' et une'),
    ('it', 'dubrovnik-catamaran-charter.html',
     ", differenze valutarie (si usa l'Euro, sebbene la Kuna croata sia ancora corso legale) e una", ' e una'),
    ('es', 'dubrovnik-catamaran-charter.html',
     ', diferencias de divisas (se usa el Euro, aunque la Kuna croata sigue siendo moneda de curso legal) y diferentes', ' y diferentes'),
    ('pt', 'dubrovnik-catamaran-charter.html',
     ', diferenças de moeda (o Euro é usado, embora a Kuna croata ainda seja moeda de curso legal) e logística', ' e logística'),
    ('nl', 'dubrovnik-catamaran-charter.html',
     ', valutaverschillen (Euro wordt gebruikt, hoewel Kroatische Kuna nog steeds wettig betaalmiddel is), en verschillende', ' en verschillende'),
    ('pl', 'dubrovnik-catamaran-charter.html',
     ', różnic walutowych (Euro jest używane, choć kuny chorwackie nadal są legalnym środkiem płatniczym) oraz innych', ' oraz innych'),
    ('hr', 'dubrovnik-catamaran-charter.html',
     ', razlike u valutama (koristi se Euro, iako su hrvatske kune još uvijek zakonsko sredstvo plaćanja) i drugačiju', ' i drugačiju'),
    # From Lefkas, Italy lies across the Ionian Sea, not the Adriatic.
    ('en', 'greece-luxury-motor-yacht-charter.html', 'accessing Italy across the Adriatic', 'accessing Italy across the Ionian Sea'),
    ('de', 'greece-luxury-motor-yacht-charter.html', 'erreicht Italien über die Adria', 'erreicht Italien über das Ionische Meer'),
    ('fr', 'greece-luxury-motor-yacht-charter.html', "accédant à l'Italie à travers l'Adriatique", "accédant à l'Italie à travers la mer Ionienne"),
    ('it', 'greece-luxury-motor-yacht-charter.html', "accedendo all'Italia attraverso l'Adriatico", "accedendo all'Italia attraverso il Mar Ionio"),
    ('es', 'greece-luxury-motor-yacht-charter.html', 'accediendo a Italia a través del Adriático', 'accediendo a Italia a través del mar Jónico'),
    ('pt', 'greece-luxury-motor-yacht-charter.html', 'acedendo à Itália através do Adriático', 'acedendo à Itália através do mar Jónico'),
    ('nl', 'greece-luxury-motor-yacht-charter.html', 'bereikt Italië over de Adriatische Zee', 'bereikt Italië over de Ionische Zee'),
    ('pl', 'greece-luxury-motor-yacht-charter.html', 'docierając do Włoch przez Adriatyk', 'docierając do Włoch przez Morze Jońskie'),
    ('hr', 'greece-luxury-motor-yacht-charter.html', 'dosežući Italiju preko Jadrana', 'dosežući Italiju preko Jonskog mora'),
]

# "Boat4You base" claims: Boat4You is a booking platform, the bases belong to
# the charter companies. (pattern, replacement) per locale, applied in order.
BASE_CLAIMS = {
    'en': [
        (r'handover to Boat4You base team', 'handover to the charter base team'),
        (r'handover to Boat4You base\b', 'handover to the charter base'),
        (r"(?:<strong>)?\bBoat4You(?:</strong>)?['’]s (?:\d+-boat )?"
         r"((?:(?!(?:includes|offers|provides|covers|charges|adds|has|is|and|or|with|to|at|in|of)\b)[\w-]+ ){0,4})(base|bases)\b",
         'BASE_EN'),
        (r'\b(base for) Boat4You (?=[a-z])', r'\1 '),
        (r'\bthe Boat4You base\b', 'the charter base'),
        (r'\bat Boat4You bases\b', 'at the charter bases'),
        (r'\bMost Boat4You charter bases\b', 'Most charter bases'),
        (r'\byour Boat4You rental base\b', 'your rental base'),
        (r'\bBoat4You maintains a dedicated base manager and technical team at\b',
         'The charter operator keeps a dedicated base manager and technical team at'),
        (r'\bBoat4You bases in both locations;', 'Charter fleets are based in both locations;'),
        (r'\b(Most|Some|Many|many) Boat4You (power catamarans|catamarans|charter vessels|yachts) base\b', r'\1 \2 base'),
    ],
    'de': [
        (r'Hauptoperationsbasis von Boat4You', 'wichtigste Charterbasis'),
        (r'(\w+basis) von Boat4You', r'\1'),
        (r'(?:\d+-Boots-)?Basis von Boat4You(?: mit \d+ Booten)?', 'Charterbasis'),
        (r'Hauptbasis von Boat4You', 'wichtigste Charterbasis'),
        (r'Boat4You-Basen', 'Charterbasen'),
    ],
    'fr': [
        (r"l'équipe de base de Boat4You", "l'équipe de la base de location"),
        (r'opérateurs de base de Boat4You', 'opérateurs de la base de location'),
        (r'base principale (?:de|pour) Boat4You', 'principale base de location'),
        (r'principale base de Boat4You', 'principale base de location'),
        (r'\b(bases?) (?:de )?Boat4You', r'\1 de location'),
        (r'(base de location à [A-ZÀ-Ž][\w\'-]*), avec ses \d+ bateaux,', r'\1,'),
    ],
    'it': [
        (r'\bbasi (?:di )?Boat4You', 'basi di charter'),
        (r'\bbase (?:di )?Boat4You', 'base di charter'),
    ],
    'es': [
        (r'equipo de base de Boat4You', 'equipo de la base de chárter'),
        (r'operadores de base de Boat4You', 'operadores de la base de chárter'),
        (r'base principal (?:de|para) Boat4You', 'principal base de chárter'),
        (r'\b(bases?) de Boat4You', r'\1 de chárter'),
    ],
    'pt': [
        (r'dupla base da Boat4You', 'dupla base'),
        (r'base principal da Boat4You', 'principal base de charter'),
        (r'\b(bases?) (?:da )?Boat4You', r'\1 de charter'),
    ],
    'nl': [
        (r'primaire operationele basis van Boat4You', 'primaire charterbasis'),
        (r'\bhet charterbasis van Boat4You', 'de charterbasis'),
        (r'(\w+basis) van Boat4You', r'\1'),
        (r'belangrijkste basis van Boat4You', 'belangrijkste charterbasis'),
        (r'primaire basis van Boat4You', 'primaire charterbasis'),
        (r'(?:\d+-boten )?basis van Boat4You(?: met \d+ boten)?', 'charterbasis'),
        (r'(charterbasis in [A-Z]\w+) met \d+ boten', r'\1'),
    ],
    'pl': [
        (r'Boat4You bazuje tutaj katamarany', 'Katamarany stacjonują tutaj'),
        (r'Boat4You bazuje swoją większą flotę', 'Większa flota stacjonuje'),
        (r'(katamaran\w*|jacht\w*|motorowych|żaglowych) Boat4You (bazuj\w*)', r'\1 \2'),
        (r'Flagowa baza Boat4You', 'Główna baza czarterowa'),
        (r'podwójnej bazy Boat4You', 'podwójnej bazy'),
        (r'\bbaza Boat4You', 'baza czarterowa'),
        (r'\bbazy Boat4You', 'bazy czarterowej'),
        (r'\bbazie Boat4You', 'bazie czarterowej'),
        (r'\bbazą Boat4You', 'bazą czarterową'),
        (r'\bbazę Boat4You', 'bazę czarterową'),
        (r'\bbazach Boat4You', 'bazach czarterowych'),
        (r'\bbaz Boat4You', 'baz czarterowych'),
    ],
    'hr': [
        (r'timu baze Boat4You', 'timu charter baze'),
        (r'primopredaja Boat4You bazi', 'primopredaja charter bazi'),
        (r'operateri baza Boat4Youa', 'operateri charter baza'),
        (r'u bazama Boat4You', 'u charter bazama'),
        (r'Većina Boat4You baza za najam', 'Većina baza za najam'),
        (r'Boat4You bazira katamarane ovdje', 'Katamarani su ovdje bazirani'),
        (r'Boat4You bazira \d+ katamarana u luci', 'Katamarani su bazirani u luci'),
        (r'(Jedrilice|jedrilice|Katamarani|katamarani|Katamaran|katamarane|čarter jahte|Flota|jedrilica i katamarana) Boat4You (bazira\w*)', r'\1 \2'),
        (r'charter baza Boat4You', 'charter baza'),
        (r'\b(Glavna|glavna|primarna je) baza Boat4You', r'\1 charter baza'),
        (r'\bbaza Boat4You', 'charter baza'),
        (r'\bbaze Boat4You', 'charter baze'),
    ],
}


# "22 of Boat4You's catamarans base here", "Boat4You's packages typically
# include base fees": "base" is not the noun there.
_BASE_NOT_NOUN = re.compile(r'\b(?:catamarans|yachts|vessels|boats|fleets|packages|typically|usually|often|also|include|offer|provide|cover)\b')


def _base_en(m, src):
    if _BASE_NOT_NOUN.search(m.group(1)):
        return m.group(0)
    words = m.group(1).split() + [m.group(2)]
    noun = words[-1]
    swap = {'flagship': 'main', 'premier': 'main', 'preferred': 'main'}
    adjectives = [swap.get(w, w) for w in words[:-1] if w not in ('dedicated', 'operational')]
    if not any(w in ('charter', 'sailing', 'motorboat', 'catamaran', 'luxury', 'yacht', 'marina', 'bareboat') for w in adjectives):
        adjectives.append('charter')
    article = 'The' if at_sentence_start(src, m.start()) else 'the'
    return ' '.join([article] + adjectives + [noun])


BLOCK_OPEN = re.compile(r'<(?:p|li|h[1-6]|td|dd|blockquote)\b[^>]*>')


def at_sentence_start(src, pos, colon=True):
    """True when `pos` starts a sentence: nothing but tags since the block
    opened, or the text before ends with . ! ? (or : when `colon`)."""
    opens = list(BLOCK_OPEN.finditer(src, max(0, pos - 3000), pos))
    start = opens[-1].end() if opens else max(0, pos - 3000)
    text = re.sub(r'<[^>]+>', '', src[start:pos])
    return not text.strip() or bool(re.search(r'[.!?:]\s*$' if colon else r'[.!?]\s*$', text))


KUNA_NUM = r'\d{1,3}(?:[.,\u00a0\u202f ]\d{3})+|\d+'
KUNA_AMOUNT = re.compile(
    rf'(?P<entre>entre )?(?P<a>{KUNA_NUM})(?:(?P<sep>\s*[-–]\s*| à | a | y | to | bis | do | tot )(?P<b>{KUNA_NUM}))?\s*(?P<k>kunas|kuna|Kuna|kune|kuny|kun)\b'
)
EURO_WORD = {'en': 'euros', 'de': 'Euro', 'fr': 'euros', 'it': 'euro', 'es': 'euros', 'pt': 'euros', 'nl': 'euro', 'pl': 'euro', 'hr': 'eura'}
HRK_PER_EUR = 7.5345
MARK = '\x02'


def _kuna_value(text, locale):
    digits = re.sub(r'[.,\u00a0\u202f ]', '', text)
    return int(digits) / HRK_PER_EUR


def _eur(v, locale):
    if v < 3:
        out = f'{round(v * 20) / 20:.2f}'
    elif v < 100:
        out = str(int(round(v)))
    elif v < 1000:
        out = str(int(round(v / 10) * 10))
    else:
        out = str(int(round(v / 50) * 50))
    return out if locale == 'en' else out.replace('.', ',')


def fix_kuna(body, ctx):
    loc = ctx.locale
    # HR: "200–300 € (oko 1.500–2.250 kn)" — drop the kuna conversion.
    def drop_kn(m):
        ctx.record('facts', m.group(0).strip(), '(kuna conversion removed)')
        return ''
    body = re.sub(rf'\s*\((?:oko |cca\. )?(?:{KUNA_NUM})(?:\s*[-–]\s*(?:{KUNA_NUM}))?\s*kn\)', drop_kn, body)

    def convert(m):
        if m.group('k') == 'kun' and loc not in ('hr', 'pl'):
            return m.group(0)  # Dutch "voor dag 4 kun je …" is the verb, not the currency
        a = _eur(_kuna_value(m.group('a'), loc), loc)
        if m.group('b'):
            b = _eur(_kuna_value(m.group('b'), loc), loc)
            amount = f"{m.group('entre') or ''}{a}{m.group('sep')}{b}"
        else:
            amount = a
        new = f'{amount} {EURO_WORD[loc]}{MARK}'
        ctx.record('facts', m.group(0), new.replace(MARK, ''))
        return new

    body = KUNA_AMOUNT.sub(convert, body)
    if MARK not in body:
        return body
    lead = r'(?:approximately |approx\. |about |ca\. |soit environ |environ |circa |aproximadamente |cerca de |ongeveer |około |czyli około |oko |unos )?'
    per = r'(?: per liter| pro Liter| par litre| al litro| por litro| za litr| po litri)?'
    euro = r'(?:euros?|Euro|eura|€)'
    num = r'[\d.,]+(?:\s*[-–]\s*[\d.,]+)?'
    # A euro amount in brackets right after a converted amount is now redundant.
    body = re.sub(rf'({MARK}[^()<;]{{0,60}}?)\s*\({lead}{num}\s*{euro}{per}\)', r'\1', body)
    body = re.sub(rf'({MARK}[^()<]{{0,40}}?),\s*{lead}{num}\s*{euro}(?=\))', r'\1', body)
    return body.replace(MARK, '')


def fix_facts(src, ctx):
    head, body, tail = split_body(src)
    for locale, name, old, new in FACT_REPLACEMENTS:
        if locale == ctx.locale and (name is None or name == ctx.name) and old in body:
            body = body.replace(old, new)
            ctx.record('facts', old, new)
    for pattern, repl in BASE_CLAIMS.get(ctx.locale, []):
        def sub(m, repl=repl, text=body):
            new = _base_en(m, text) if repl == 'BASE_EN' else m.expand(repl)
            if repl != 'BASE_EN' and m.group(0)[:1].isupper() and new[:1].islower():
                new = new[:1].upper() + new[1:]
            if new != m.group(0):
                ctx.record('facts', m.group(0), new)
            return new
        # Spaces in the patterns match any whitespace (the corpus wraps lines);
        # PL/HR sentences may start with the claim ("Baza Boat4You …").
        flags = re.I if ctx.locale in ('pl', 'hr', 'it') else 0
        body = re.sub(pattern.replace(' ', r'\s+'), sub, body, flags=flags)
    body = fix_kuna(body, ctx)
    return head + body + tail


# ------------------------------------------------------------------ counts

# Fleet counts in the texts ("Over 1,642 vessels", "71 dedicated catamarans",
# "Catamarans (506 Vessels)") contradict the live listing count shown above
# them and go stale. They are replaced by count-free wording, never by new
# numbers. Marina capacity, race fields, anchorage crowds, sizes and prices
# are left alone.
#
# Per locale:
#   num     number format (thousand separators)
#   nouns   boat nouns in the form a numeral >= 5 takes
#   dets    words after which the number is simply dropped ("the 39 yachts")
#   of      prepositions after which it is dropped ("fleet of 39 yachts")
#   quant   "over / more than / about …" before the number (replaced with it)
#   skip    context (40 chars before) that marks a non-fleet number
#   phrase  (>=100, >=20, <20) replacement when the number can't just go
COUNT_LOCALES = {
    'en': dict(
        num=r'\d{1,3}(?:,\d{3})+|\d+',
        nouns=r'boats|vessels|yachts|sailboats|catamarans|motorboats|monohulls|gulets|motorsailers|units|listings|RIBs|speedboats|superyachts',
        dets=r"the|its|their|our|your|these|those|'s|’s",
        of=r'of',
        quant=r'over|more than|nearly|almost|around|about|approximately|roughly|some|close to|at least|well over|upwards of',
        skip=r'accommodat|capacity|berth|mooring|compet|regatta|\brace|rally|anchor|alongside|queue|up to\s*$|between\s*$|\bother\b|\bunder\s*$|\baged?\s*$',
        phrase=('thousands of', 'hundreds of', 'dozens of', 'several'),
        mode='delete',
    ),
    'de': dict(
        num=r'\d{1,3}(?:\.\d{3})+|\d+',
        nouns=r'Booten?|Schiffen?|Yachten|Segelyachten|Segelbooten?|Katamaranen?|Motoryachten|Motorbooten?|Einrumpfbooten?|Gulets|Motorseglern?|Einheiten|Jachten|Power-Katamaranen?|Luxus-Motoryachten|Charteryachten|Charterbooten?|Wasserfahrzeugen?',
        dets=r'die|den|der|ihre|ihren|seine|seinen|unsere|unseren|diese|diesen',
        of=r'von',
        quant=r'über|mehr als|fast|nahezu|rund|etwa|ca\.|knapp|annähernd|mindestens|gut|weit über',
        skip=r'Liegepl|Kapazität|aufnehm|beherberg|Regatta|Rennen|Anker|ankern|Platz für|bis zu\s*$|zwischen\s*$|\banderen?\b',
        phrase=None,
        mode='delete',
    ),
    'fr': dict(
        num=r'\d{1,3}(?:[\u00a0\u202f ]\d{3})+|\d+',
        nouns=r'bateaux|navires|voiliers|yachts|catamarans|monocoques|vedettes|embarcations|unités|goélettes|gulets|motorsailers|annonces',
        dets=r'les|des|ses|nos|vos|leurs|ces|aux|mes',
        of=r"de|d'|d’",
        quant=r'plus de|près de|environ|quelque|au moins|pas moins de|presque',
        skip=r"postes d'amarrage|anneaux|capacité|accueill|régate|course|mouill|jusqu'à\s*$|entre\s*$|\bautres\b",
        phrase=('des milliers de', 'plusieurs centaines de', 'plusieurs dizaines de', 'plusieurs'),
        mode='phrase',
    ),
    'it': dict(
        num=r'\d{1,3}(?:\.\d{3})+|\d+',
        nouns=r'yacht|imbarcazioni|barche|catamarani|velieri|motoscafi|monoscafi|gommoni|unità|caicchi|gulet|motorsailer|natanti|navi',
        dets=r'i|gli|le|dei|degli|delle|ai|agli|alle|nei|negli|nelle|suoi|sue|loro|nostri|nostre|questi|queste|quei|quelle',
        of=r'di',
        quant=r'oltre|più di|circa|quasi|almeno|ben',
        skip=r'posti barca|ormegg|capacità|ospit|accogli|regat|ancora|fino a\s*$|tra\s*$|\baltr[ie]\b',
        phrase=('migliaia di', 'centinaia di', 'decine di', ('diversi', 'diverse')),
        fem=r'imbarcazioni|barche|unità|navi',
        mode='phrase',
    ),
    'es': dict(
        num=r'\d{1,3}(?:\.\d{3})+|\d+',
        nouns=r'barcos|embarcaciones|yates|veleros|catamaranes|lanchas|monocascos|goletas|gulets|unidades|motoveleros|buques|naves',
        dets=r'los|las|sus|nuestros|nuestras|estos|estas|esos|esas|unos|unas',
        of=r'de',
        quant=r'más de|casi|alrededor de|cerca de|aproximadamente|al menos|unos|unas',
        skip=r'amarre|capacidad|alberg|acog|regata|fonde|anclad|hasta\s*$|entre\s*$|\botr[oa]s\b',
        phrase=('miles de', 'cientos de', 'decenas de', ('varios', 'varias')),
        fem=r'embarcaciones|lanchas|goletas|unidades|naves',
        mode='phrase',
    ),
    'pt': dict(
        num=r'\d{1,3}(?:\.\d{3})+|\d+',
        nouns=r'barcos|embarcações|iates|veleiros|catamarãs|lanchas|monocascos|goletas|gulets|unidades|motoveleiros|navios',
        dets=r'os|as|seus|suas|nossos|nossas|estes|estas|esses|essas|dos|das|nos|nas|aos|às|pelos|pelas',
        of=r'de',
        quant=r'mais de|quase|cerca de|aproximadamente|pelo menos|perto de',
        skip=r'amarração|lugares|capacidade|acolh|alberg|regata|fundead|ancorad|até\s*$|entre\s*$|\boutr[oa]s\b',
        phrase=('milhares de', 'centenas de', 'dezenas de', ('vários', 'várias')),
        fem=r'embarcações|lanchas|goletas|unidades',
        mode='phrase',
    ),
    'nl': dict(
        num=r'\d{1,3}(?:\.\d{3})+|\d+',
        nouns=r'boten|schepen|jachten|zeiljachten|zeilboten|catamarans|motorjachten|motorboten|eenrompers|gulets|motorzeilers|vaartuigen|eenheden',
        dets=r'de|haar|zijn|onze|deze|die',
        of=r'van',
        quant=r'meer dan|bijna|ruim|ongeveer|circa|zo\'n|minstens|ruim over',
        skip=r'ligplaats|capaciteit|biedt plaats|herberg|regatta|race|anker|tot\s*$|tussen\s*$|\bandere\b',
        phrase=None,
        mode='delete',
    ),
    'pl': dict(
        num=r'\d{1,3}(?:[\u00a0 ]\d{3})+|\d+',
        nouns=r'jachtów|łodzi|łódek|jednostek|katamaranów|żaglówek|motorówek|guletów|statków|jednokadłubowców|motorsailerów|jachtami|łodziami|jednostkami|katamaranami|żaglówkami|motorówkami|jachtach|łodziach|jednostkach|katamaranach|jachtom|jednostkom|katamaranom',
        dets=r'\w+(?:ych|ich)',
        of=r'',
        quant=r'ponad|około|prawie|niemal|blisko|przeszło|co najmniej|aż',
        # after "naszych", "tych" … the number is dropped ("naszych 18 jachtów" → "naszych jachtów")
        skip=r'miejsc|stanowisk|pojemn|mieści|pomieści|regat|kotwic|do\s*$|między\s*$|\binnych\b',
        mode='pl',
    ),
    'hr': dict(
        num=r'\d{1,3}(?:\.\d{3})+|\d+',
        nouns=r'brodova|plovila|jahti|jahta|jedrilica|katamarana|brodica|glisera|guleta|jedinica|motorsailera|čamaca|gumenjaka',
        dets=r'\w+ih',  # "Naših 18 jedrilica", "Boat4You-ovih 14 jedrilica" → the number is dropped
        of=r'',
        quant=r'preko|više od|oko|gotovo|skoro|najmanje|čak',
        skip=r'vezov|kapacitet|\bprim|regat|sidr|do\s*$|između\s*$|\bdrugih\b',
        phrase=('nekoliko tisuća', 'nekoliko stotina', 'mnogo', 'više'),
        mode='phrase',
    ),
}
# Words that may sit between the number and the noun ("39 carefully curated
# sailing yachts", "62 modern catamarans"): adjective/adverb-like words only,
# so a clause break ("children under 12 specifically request …") stops it.
_FUNCTION_WORDS = (
    r'des|les|ses|nos|vos|aux|pas|plus|très|sous|dans|sans|chez|vers|mais|puis|dei|nei|sui|che|tre|sei|più|'
    r'dos|das|nos|nas|aos|seus|suas|los|las|sus|unos|unas|más|tres|seis|entre|desde|hasta|pues|este|esta|'
    r'die|der|den|des|eine|einen|einer|ohne|oder|aber|sie|wie|alle|ihre|unsere|diese|je|te|in|op|en|voor|'
    r'uit|naar|door|over|de|het|ze|zich|oraz|lub|albo|ale|jak|dla|przez|nad|pod|przed|które|których|koje|kojih|'
    r'ili|ali|kao|za|pod|nad|preko|između|'
    r'di|da|ed|od|al|del|della|dei|degli|delle|nel|nella|sul|sulla|per|con|tra|fra|su|il|lo|la|gli|le|un|una|uno|'
    r'du|et|ou|au|une|sur|par|pour|avec|del|el|y|o|con|por|para|a|do|na|no|em|com|um|uma|e|'
    r'van|met|of|een|te|i|w|z|na|od|po|u|s|sa|iz'
)
COUNT_FILLER_WORD = {
    'en': r"(?:(?:modern|new|premium|available|dedicated|selected|luxury|sailing|motor|power|charter|crewed|bareboat|"
          r"classic|large|small|spacious|comfortable|family|well|fully|curated|verified|quality|top|different|various|"
          r"gulet|motorsailer|superyacht|cruising|performance|private|local|twin-hulled|high-end|late-model|"
          r"catamaran|monohull|motorboat|yacht|[a-z]+(?:ed|al|ive|ous|able|ible|ic|ary|ly|ing|ern|ful|ian|ular|ile))|[A-Z][\w'’-]+)",
    'de': r'(?:(?!(?:unser|ihr|sein|dies|ein|kein|jed|all|viel|weiter|ander|mehrer|einig|d)[a-zäöüß]*\b)'
          r'[a-zäöüß-]+(?:e|en|er|es|em)|sorgfältig|bestens|gut|top|hochwertig|modern)',
    'fr': rf'(?:(?!(?:{_FUNCTION_WORDS})\b)[a-zàâçéèêëîïôûùüÿœ-]+(?:s|x|es))',
    'it': rf'(?:(?!(?:{_FUNCTION_WORDS})\b)[a-zàèéìíîòóùú-]+(?:i|e))',
    'es': rf'(?:(?!(?:{_FUNCTION_WORDS})\b)[a-záéíóúñü-]+(?:os|as|es|les))',
    'pt': rf'(?:(?!(?:{_FUNCTION_WORDS})\b)[a-záâãàçéêíóôõú-]+(?:os|as|es|is|eis))',
    'nl': rf'(?:(?!(?:{_FUNCTION_WORDS})\b)[a-zëïéèöü-]+(?:e|en))',
    'pl': rf'(?:(?!(?:{_FUNCTION_WORDS})\b)[a-ząćęłńóśźż-]+(?:ych|ich|ymi|imi))',
    'hr': rf'(?:(?!(?:{_FUNCTION_WORDS})\b)[a-zčćđšž-]+(?:ih|ima))',
}


def count_filler(locale):
    return rf'(?:{COUNT_FILLER_WORD[locale]}[ \u00a0]){{0,3}}'


PL_FORMS = {  # (nominative/accusative, genitive/dative/locative, instrumental)
    2000: ('kilka tysięcy', 'kilku tysięcy', 'kilkoma tysiącami'),
    200: ('kilkaset', 'kilkuset', 'kilkuset'),
    20: ('wiele', 'wielu', 'wieloma'),
    10: ('kilkanaście', 'kilkunastu', 'kilkunastoma'),
    5: ('kilka', 'kilku', 'kilkoma'),
}
PL_GEN_BEFORE = r'(?:z|ze|od|dla|bez|spośród|wśród|u|koło|obok|zamiast|oprócz|obsługa|obsługi|obsługę|flota|floty|flotę|flotą|flocie|wybór|wyboru|wyborze|park|parku|kolekcja|kolekcji|ofertę|oferty|ofercie)'
BOAT_WORD = r"(?i:yacht|boat|vessel|catamaran|motorboat|monohull|gulet|sailer|jacht|boot|schiff|katamaran|voilier|bateau|vedette|barc|imbarcazion|velier|motoscaf|yate|veler|lancha|iate|veleiro|embarca|jedrilic|brod|plovil|jaht|łodz|łódź|żaglów|motorów|statk|zeiljacht|boten|motorjacht)[\w-]*"


def _count_value(text):
    return int(re.sub(r'[^\d]', '', text))


def _magnitude(n, phrases):
    # "hundreds" only from 200 up: "hundreds of vessels" for 103 would overstate.
    return phrases[0] if n >= 2000 else phrases[1] if n >= 200 else phrases[2] if n >= 20 else phrases[3]


# Context that marks a number as something other than the fleet on offer:
# boats at anchor or racing, comparisons, "other" boats.
COUNT_SKIP_AFTER = r'^\W{0,3}(?:at anchor|anchored|moored|compet|racing|vor Anker|ankern|au mouillage|mouill|all.ancora|fondead|ancorad|voor anker|na kotwic|zakotwicz|na sidr|usidren)'
COUNT_SKIP_ANY = (r'compared|Vergleich|compar|rispetto|vergeleken|porównan|usporedb|'
                  r'crowd|Menschenmass|foule|folla|multitud|multid|drukte|tłum|gužv|'
                  r'accommodat|acomod|accueil|accogli|ospita|aufnehm|beherberg|biedt plaats|mieści|\\bprima|'
                  r'storage|Winterlager|stockage|rimessaggio|almacen|armazen|stalling|zimowani|zimovanj|ancorag|anchorage')
COUNT_OTHER = r'\b(?:other|weitere|andere|anderen|autres|altri|altre|otros|otras|outros|outras|innych|drugih)\b'

# A comparison or limiting word right before the number ("exceeds 792 vessels",
# "fewer than 100 yachts", "With only 6 catamarans", "moins de 100 bateaux",
# "Mit nur 9 Schiffen"): deleting the number or swapping in a size phrase
# breaks the sentence ("exceeds vessels", "Avec seulement plusieurs"), so the
# number stays.
COUNT_LIMIT = {
    'en': r"\b(?:fewer|less|more|greater|no more|not more|no fewer|little more|slightly more|just over|just under|well under)\s+than"
          r"|\b(?:under|below|exceed(?:s|ed|ing)?|surpass(?:es|ed|ing)?|tops|topping|only|just|merely|mere|barely|solely|as few as|as many as)",
    'de': r"\b(?:weniger|nicht mehr|kaum mehr|mehr)\s+als|\b(?:unter|nur|lediglich|bloß|gerade(?:\s+(?:mal|einmal))?|"
          r"übersteig\w*|übertr[ei]ff\w*|überschreit\w*|höchstens|maximal)",
    'fr': r"\b(?:moins|pas plus|guère plus|plus)\s+(?:de|d['’])|\b(?:seulement|uniquement|à peine|tout juste|dépass\w*|"
          r"excéd\w*|surpass\w*)|(?:\bne\s+|\bn['’])\w+(?:\s+\w+)?\s+que",
    'it': r"\b(?:meno|non più|più)\s+di|\b(?:solo|soltanto|solamente|appena|supera\w*|oltrepass\w*|ecced\w*)",
    'es': r"\b(?:menos|no más|más)\s+de|\b(?:solo|sólo|solamente|únicamente|apenas|supera\w*|exced\w*|sobrepasa\w*)",
    'pt': r"\b(?:menos|não mais|mais)\s+de|\b(?:só|somente|apenas|unicamente|supera\w*|ultrapassa\w*|exced\w*)",
    'nl': r"\b(?:minder|niet meer|nauwelijks meer|meer)\s+dan|\b(?:slechts|maar|alleen|amper|nauwelijks|onder|overschrijd\w*|overtre\w*)",
    'pl': r"\b(?:mniej|nie więcej|więcej)\s+niż|\b(?:tylko|jedynie|zaledwie|raptem|poniżej|przekracza\w*|przewyższa\w*)",
    'hr': r"\b(?:manje|ne više|ne manje|više)\s+od|\b(?:samo|svega|tek|jedva|ispod|premašuj\w*|nadmašuj\w*)",
}
# The number set off by a dash or a colon ("the largest fleet in Greece—301
# vessels—all based …", "unmatched choice: 395 sailing yachts") cannot simply
# go: the delete-mode locales write a size phrase there instead ("—hundreds of
# vessels—"); EN uses its `phrase`, DE/NL these.
COUNT_DASH_PHRASE = {
    'de': ('Tausende', 'Hunderte', 'Dutzende', 'mehrere'),
    'nl': ('duizenden', 'honderden', 'tientallen', 'enkele'),
}
DASH_OR_COLON = re.compile(r'(?:[—–:]|\s-)\s*$')


def fix_counts(src, ctx):
    cfg = COUNT_LOCALES[ctx.locale]
    head, body, tail = split_body(src)

    # 1) "Catamarans (506 Vessels)", "stability (138 + 15 vessels)", "Sailing Yachts (792)"
    num_ = cfg['num']
    paren_noun = re.compile(rf'\s*\(\s*(?:{num_})(?:\s*\+\s*(?:{num_}))*\s*\+?\s*(?i:{cfg["nouns"]}|boats?|vessels?)\s*\)')
    paren_bare = re.compile(rf'({BOAT_WORD})\s*\(\s*(?:{num_})\s*\+?\s*\)')

    def drop_paren(m):
        ctx.record('counts', m.group(0).strip(), '(count in brackets removed)')
        return ''

    def drop_bare(m):
        ctx.record('counts', m.group(0), m.group(1))
        return m.group(1)

    body = paren_noun.sub(drop_paren, body)
    body = paren_bare.sub(drop_bare, body)

    # 2) EN compound counts: "a 506-vessel fleet", "'s 395-yacht inventory"
    if ctx.locale == 'en':
        def drop_compound(m):
            article = m.group(1) or ''
            nxt = m.group(3)
            if article:
                article = ('an ' if re.match(r'[aeiouAEIOU]', nxt) else 'a ') if article.lower() in ('a ', 'an ') else article
                if m.group(1)[0].isupper():
                    article = article[0].upper() + article[1:]
            new = f'{article}{nxt}'
            ctx.record('counts', m.group(0), new)
            return new

        body = re.sub(r"\b(an? |An? )?\d[\d,]*\+?-(?:boat|yacht|vessel|catamaran|strong) (\s*)(\w)", lambda m: drop_compound(m), body)

    # 3) "N [adjectives] noun" with optional quantifier / determiner before it.
    num = cfg['num']
    pattern = re.compile(
        rf'(?P<quant>\b(?i:{cfg["quant"]})\s+)?(?<![\w€$£/.,–-])(?P<n>{num})(?P<plus>\s?\+)?(?![.,]\d)[ \u00a0](?P<rest>{count_filler(ctx.locale)}(?P<noun>{cfg["nouns"]}))\b'
    )

    def replace(m):
        n = _count_value(m.group('n'))
        before = body_now[max(0, m.start() - 60): m.start()]
        sentence_before = re.split(r'[.!?]\s', re.sub(r'<[^>]+>', ' ', before))[-1]
        if n < 5 or (1900 <= n <= 2099 and m.group('n').isdigit()):
            return m.group(0)
        if re.search(r'\d\s*(?:[-–]|to|à|a|y|bis|do|tot|i|e|und|and|or|ou|o|of)\s*$', before):
            return m.group(0)  # a range or list: "80–120 yachts", "10, 20 or 30 boats"
        if re.search(cfg['skip'], sentence_before, re.I) or re.search(COUNT_SKIP_ANY, sentence_before, re.I):
            return m.group(0)
        after_text = re.sub(r'<[^>]+>', ' ', body_now[m.end(): m.end() + 60])
        if re.search(COUNT_SKIP_AFTER, after_text, re.I) or re.search(COUNT_OTHER, m.group('rest'), re.I):
            return m.group(0)
        if re.search(rf'(?:{COUNT_LIMIT[ctx.locale]})\s*$', sentence_before, re.I):
            return m.group(0)  # "exceeds 792 vessels", "fewer than 100 yachts", "Mit nur 9 Schiffen"
        rest, noun = m.group('rest'), m.group('noun')
        prev = re.search(r"([\w'’]+)\s*$", re.sub(r'<[^>]+>', ' ', before))
        prev_word = prev.group(1) if prev else ''
        quant = m.group('quant')
        if quant and not (cfg.get('dets') and prev_word and re.fullmatch(cfg['dets'], prev_word, re.I)):
            prev_word = ''  # "over 1,642 vessels" → magnitude phrase; "les plus de 195" → dropped
        start = at_sentence_start(body_now, m.start())
        mode = cfg['mode']

        if mode == 'delete' or (cfg.get('dets') and prev_word and re.fullmatch(cfg['dets'], prev_word, re.I)) \
                or (cfg.get('of') and prev_word and re.fullmatch(cfg['of'], prev_word, re.I)):
            if quant and not prev_word and cfg.get('phrase'):
                new = f"{_magnitude(n, cfg['phrase'])} {rest}"
            else:
                new = rest
                if start:
                    after = body_now[m.end(): m.end() + 2]
                    if re.match(r'\s*[.;]', after) and not re.search(r'\w', rest[: -len(noun)]):
                        # "<strong>Sailing Yachts:</strong> 46 vessels. …" — a bare count fragment
                        ctx.record('counts', m.group(0) + after.strip()[:1], '(count fragment removed)')
                        return '\x03'
                if not prev_word and DASH_OR_COLON.search(re.sub(r'<[^>]+>', ' ', before)):
                    # "fleet in Greece—301 vessels—all based": a size phrase, not a gap
                    phrases = cfg.get('phrase') or COUNT_DASH_PHRASE.get(ctx.locale)
                    if not phrases or (ctx.locale == 'de' and re.search(r'(?:boot|schiff|katamaran|fahrzeug)en$|seglern$', noun, re.I)):
                        return m.group(0)
                    new = f"{_magnitude(n, phrases)} {rest}"
        elif mode == 'pl':
            forms = next(v for k, v in sorted(PL_FORMS.items(), reverse=True) if n >= k)
            if re.search(r'(?:ami|mi)$', noun):
                word = forms[2]
            elif re.search(r'(?:ach|om)$', noun) or re.search(rf'\b{PL_GEN_BEFORE}\s*$', before, re.I):
                word = forms[1]
            else:
                word = forms[0]
            new = f'{word} {rest}'
        else:
            phrase = _magnitude(n, cfg['phrase'])
            if isinstance(phrase, tuple):
                phrase = phrase[1] if re.fullmatch(cfg.get('fem', '$^'), noun) else phrase[0]
            new = f'{phrase} {rest}'
        if at_sentence_start(body_now, m.start(), colon=False):
            new = new[:1].upper() + new[1:]
        ctx.record('counts', m.group(0), new, plain(body_now[max(0, m.start() - 90): m.start()])[-70:])
        return new

    body_now = body
    body = pattern.sub(replace, body)
    # Drop the "46 vessels." fragments marked above (and the space after them).
    body = re.sub(r'\x03[.;]?\s?', '', body)
    return head + body + tail


# ---------------------------------------------------------------- headings

# English place names left in translated headings (non-EN). Applied inside
# <h1>–<h6> only, in order. Marina / proper names (Porto Montenegro, Rhodes
# New Marina, Île-de-France) stay as they are.
HEADING_FIXES = {
    'de': [
        ('Bodrum, Türkiye', 'Bodrum, Türkei'),
        ('Ionian Inseln', 'Ionische Inseln'),
        ('Ionian Islands Segelgebiet', 'Segelgebiet Ionische Inseln'),
        ('Saronic Luxury Escape', 'Luxus-Auszeit im Saronischen Golf'),
        ('unter den Bedingungen der Saronic', 'unter den Bedingungen des Saronischen Golfs'),
        ('in der Saronic', 'im Saronischen Golf'),
        ('Dubrovnik Region Segelrevier', 'Segelrevier Region Dubrovnik'),
        ('Segelgebiet Split Region', 'Segelgebiet Region Split'),
        ('Segelgebiet Zadar Region', 'Segelgebiet Region Zadar'),
    ],
    'fr': [
        ("sur la French Riviera (Côte d'Azur)", "sur la Côte d'Azur"),
        ('sur la French Riviera', "sur la Côte d'Azur"),
        ("La French Riviera et la Côte d'Azur", "La Riviera française et la Côte d'Azur"),
        ('Bodrum, Türkiye', 'Bodrum, Turquie'),
        ("mouillages de l'Ionian", 'mouillages de la mer Ionienne'),
        ("navigation de l'Ionian", 'navigation de la mer Ionienne'),
        ('voile en Ionian', 'voile en mer Ionienne'),
        ("dans l'Ionian", 'en mer Ionienne'),
    ],
    'it': [
        (r're:\bGolfo Saronic\b', 'Golfo Saronico'),
        (r're:\bnel Saronic\b', 'nel Golfo Saronico'),
        ('Costa Azzurra (French Riviera)', 'Costa Azzurra'),
        ('Bodrum, Türkiye', 'Bodrum, Turchia'),
        ('Scopri Perché Rules Caribbean Charters', 'Scopri perché scegliere Boat4You per i charter ai Caraibi'),
    ],
    'es': [
        ('Bodrum, Türkiye', 'Bodrum, Turquía'),
        ('Skiathos/Sporades', 'Skiathos/Espóradas'),
        ('las Sporades', 'las Espóradas'),
    ],
    'pt': [
        ('Bodrum, Türkiye', 'Bodrum, Turquia'),
        ('A Experiência Athens Riviera', 'A Experiência da Riviera de Atenas'),
        ('da Athens Riviera', 'da Riviera de Atenas'),
        ('Porquê Escolher para o Seu Charter nas Sporades', 'Porquê Escolher a Boat4You para o Seu Charter nas Espórades'),
        ('Skiathos/Sporades', 'Skiathos/Espórades'),
        ('em Sporades', 'nas Espórades'),
        ('para Sporades', 'para as Espórades'),
        ('Sporades', 'Espórades'),
        ('Istria e Kvarner', 'Ístria e Kvarner'),
        ('Campania Motor Yacht Charter', 'Aluguer de Iates a Motor na Campânia'),
    ],
    'nl': [
        ('Bodrum, Türkiye', 'Bodrum, Turkije'),
        ('British Virgin Islands Vaargebied', 'Britse Maagdeneilanden Vaargebied'),
        ('aan de Athens Riviera', 'aan de Atheense Rivièra'),
        ('De Athens Riviera Ervaring', 'De Atheense Rivièra-ervaring'),
        (r're:\bin de Saronic\b(?: Golf)?', 'in de Saronische Golf'),
        ('Ontspannen Saronic Routes', 'Ontspannen routes in de Saronische Golf'),
        ('Ionian Islands Vaargebied', 'Ionische Eilanden Vaargebied'),
        ('Ionian Eilanden', 'Ionische Eilanden'),
        ('Ionian Griekenland', 'Ionisch Griekenland'),
        ('Ontdek Waarom Rules Caribbean Charters', 'Ontdek waarom Boat4You de keuze is voor charters in het Caribisch gebied'),
    ],
    'pl': [
        ('Bodrum, Türkiye', 'Bodrum, Turcja'),
    ],
    'hr': [
        ('za Istria/Kvarner', 'za Istru i Kvarner'),
        ('Sporades Fleet & Pomorski centar', 'flota Sporada i pomorski centar'),
        ('Skiathos/Sporades', 'Skiathos/Sporadi'),
        ('Sardinia i Costa Smeralda', 'Sardinija i Costa Smeralda'),
        ('u Ateni i Zaljevu Saronic', 'u Ateni i Saronskom zaljevu'),
        ('za Saronic', 'za Saronski zaljev'),
        ('Najam jedrilica Campania', 'Najam jedrilica u Kampaniji'),
        ('Otkrijte zašto Pravila Caribbean Charters', 'Otkrijte zašto je Boat4You prvi izbor za charter na Karibima'),
        ('Zašto odabrati za Vaš Porto Montenegro Monohull Charter?', 'Zašto odabrati Boat4You za najam jednotrupca u Porto Montenegru?'),
    ],
}


def fix_headings(src, ctx):
    fixes = HEADING_FIXES.get(ctx.locale)
    if not fixes:
        return src
    head, body, tail = split_body(src)

    def fix_one(m):
        inner = m.group(2)
        for old, new in fixes:
            if old.startswith('re:'):
                inner = re.sub(old[3:], new, inner)
            elif old in inner:
                inner = inner.replace(old, new)
        if inner == m.group(2):
            return m.group(0)
        ctx.record('headings', plain(m.group(2)), plain(inner))
        return f'<{m.group(1)}{m.group(3)}>{inner}</{m.group(1)}>'

    body = re.sub(r'<(h[1-6])(\b[^>]*)>([\s\S]*?)</\1\s*>', lambda m: fix_one(_Heading(m)), body)
    return head + body + tail


class _Heading:
    """Adapter so fix_one reads (tag, inner, attrs) as groups 1, 2, 3."""

    def __init__(self, m):
        self._m = m

    def group(self, i):
        return {0: self._m.group(0), 1: self._m.group(1), 2: self._m.group(3), 3: self._m.group(2)}[i]


# ------------------------------------------------------------------- brand

# The EN corpus went through a pass that deleted "Boat4You" (the eight
# translations still carry it — e.g. 16 mentions in DE/FR vs 1 in EN on
# aegean-catamaran-charter), leaving sentences without a subject:
# "<p> arranges professional skippers…", "'s transparent booking process…",
# "Why Sailors Return to </h2>". The brand goes back where the hole is
# unambiguous; any other sentence that starts in lower case is capitalised.
BRAND_VERBS = set('''
arranges coordinates publishes maintains recommends specializes specialises accommodates keeps negotiates matches helps
handles connects tailors manages facilitates verifies operates includes reviews requires customizes customises advises
clarifies simplifies assesses accepts prioritizes prioritises transforms emphasizes supports assists delivers streamlines
curates understands monitors provides brings stands recognizes encourages conducts finds educates leverages confirms
partners specifies offers quotes respects reserves evaluates lists supplies assigns welcomes pre-arranges combines secures
believes pre-coordinates creates vets collaborates pre-provisions harnesses ensures orchestrates represents schedules
commits briefs optimizes develops itemizes compares equips embraces invites communicates estimates pre-fuels carries
caters takes explains eliminates appreciates guides highlights catalogs aggregates sources shows works pre-orders knows
presents complies employs hosts invests co-ordinates adjusts passes interviews reaches extends bundles celebrates elevates
enables exceeds builds remains designates pre-stocks expedites displays proposes calculates warns participates processes
adapts removes covers aligns uses meets stays enforces prepares continues teaches introduces recruits
details designs plans values filters structures pairs positions books checks requests champions selected
can will may is has also partnered typically specifically carefully frequently strongly explicitly honestly
strategically proudly deliberately consistently actively primarily readily expertly strictly clearly
'''.split())
BRAND_NOUNS = set('support staff team concierge coordinators specialists advisors consultants representatives professionals'.split())
R.SUBJECT_VERBS['en'] = BRAND_VERBS | BRAND_NOUNS | {'brokers', 'catalogs', 'lists', 'believes'}
SENTENCE_START = re.compile(
    r"(?:(?<=<p>)|(?<=<li>)|(?<=<td>)|(?<=<p> )|(?<=<li> )|(?<=[a-z0-9)%”\"'][.!?] ))"
    r"(?<!e\.g\. )(?<!i\.e\. )(?<!etc\. )(?<!approx\. )(?<!vs\. )(?<!incl\. )(?<!ca\. )(?<!cf\. )(?<!no\. )(?<!avg\. )"
    r"([a-z][a-z-]*)\b"
)
BRAND_FIXES = [
    (re.compile(r'Why Sailors Return to\s*</h2>'), 'Why Sailors Return to Boat4You</h2>'),
    (re.compile(r'\bWhy (Recommends|Rules) '), r'Why Boat4You \1 '),
    (re.compile(r'\bWhy for Your '), 'Why Boat4You for Your '),
    (re.compile(r'\bLet (connect|guide|take|help|arrange|handle|match|show|find|plan|coordinate|craft|design|curate|tailor|make) '),
     r'Let Boat4You \1 '),
    (re.compile(r'\b(resources|details|information) at \.'), r'\1 at Boat4You.'),
    (re.compile(r'(?<=[a-z,] )With us\b'), 'with us'),
]


# "Why Choose for …" — the brand dropped out of translated headings too.
HEADING_BRAND = {
    'en': (r'\bWhy Choose for\b', 'Why Choose Boat4You for'),
    'fr': (r'\bPourquoi Choisir pour\b', 'Pourquoi Choisir Boat4You pour'),
    'es': (r'\bPor qué (elegir|Elegir) para\b', r'Por qué \1 Boat4You para'),
    'it': (r'\bPerché (Scegliere|scegliere) per\b', r'Perché \1 Boat4You per'),
    'pt': (r'\bPorquê (Escolher|escolher) para\b', r'Porquê \1 a Boat4You para'),
    'pl': (r'\bDlaczego (wybrać|Wybrać) dla\b', r'Dlaczego \1 Boat4You dla'),
    'hr': (r'\bZašto (odabrati|Odabrati) za\b', r'Zašto \1 Boat4You za'),
}


def fix_heading_brand(body, ctx):
    rule = HEADING_BRAND.get(ctx.locale)
    if not rule:
        return body

    def heading(m):
        new = re.sub(rule[0], rule[1], m.group(0))
        if new != m.group(0):
            ctx.record('brand', plain(m.group(0)), plain(new))
        return new

    return re.sub(r'<h([1-6])\b[^>]*>[\s\S]*?</h\1\s*>', heading, body)


def fix_brand(src, ctx):
    head, body, tail = split_body(src)
    body = fix_heading_brand(body, ctx)
    if ctx.locale != 'en':
        return head + body + tail

    for pattern, repl in BRAND_FIXES:
        def sub(m, repl=repl):
            new = m.expand(repl)
            ctx.record('brand', m.group(0), new)
            return new
        body = pattern.sub(sub, body)

    # "'s" with no word before it: "…Abaco Sound, 's three power catamarans"
    def possessive(m):
        before = body_now[max(0, m.start() - 40): m.start()]
        if re.search(r'Boat4You\s*$|</[a-z0-9]+>\s*$', before):
            return m.group(0)
        if before.endswith('>') and not re.search(r'<(?!/)[^>]*>$', before):
            return m.group(0)
        ctx.record('brand', plain(before)[-30:] + m.group(0), 'Boat4You' + m.group(0))
        return 'Boat4You' + m.group(0)

    body_now = body
    body = re.sub(r"(?<=[\s>(])['’]s(?=\s)", possessive, body)

    def sentence(m):
        word = m.group(1)
        if word in BRAND_VERBS or word in BRAND_NOUNS:
            new = f'Boat4You {word}'
        else:
            new = word[:1].upper() + word[1:]
        ctx.record('brand', plain(body_now2[max(0, m.start() - 30): m.start()])[-25:] + ' ' + word, new)
        return new

    body_now2 = body
    body = SENTENCE_START.sub(sentence, body)
    return head + body + tail



# ------------------------------------------------------------------ claims

# Boat4You is a booking platform: the fleets, bases and their insurance belong
# to the charter companies. "Boat4You maintains a curated fleet of catamarans
# at Marina Benitses", "Boat4You bases its Ionian fleet here", "Boat4You
# maintains comprehensive hull … insurance" (EN, partly restored by `brand`)
# and their translations ("Boat4You unterhält eine Flotte …") get a singular
# collective subject — "Our partner network maintains …" — so the verb, any
# coordinated verb and "its" stay grammatical in all 9 languages. EN
# "Boat4You's … fleet" becomes "our partners' … fleet".
#
# A claim = subject Boat4You + claim verb whose object (the next few words of
# the same sentence) names boats or a fleet before any relationship/service
# noun ("maintains partnerships with gulet operators" stays).
CLAIM_SUBJECT = {
    'en': ('Our partner network', 'our partner network'),
    'de': ('Unser Partnernetzwerk', 'unser Partnernetzwerk'),
    'fr': ('Notre réseau de partenaires', 'notre réseau de partenaires'),
    'it': ('La nostra rete di partner', 'la nostra rete di partner'),
    'es': ('Nuestra red de socios', 'nuestra red de socios'),
    'pt': ('A nossa rede de parceiros', 'a nossa rede de parceiros'),
    'nl': ('Ons partnernetwerk', 'ons partnernetwerk'),
    'pl': ('Nasza sieć partnerów', 'nasza sieć partnerów'),
    'hr': ('Naša mreža partnera', 'naša mreža partnera'),
}
CLAIM_VERBS = {
    'en': r'maintains|operates|keeps|bases|stations|owns|houses|moors|has',
    'de': r'unterhält|betreibt|stationiert|besitzt|hält|wartet|pflegt|inspiziert|repariert',
    'fr': r'entretient|exploite|maintient|stationne|possède|opère|base|gère',
    'it': r'mantiene|gestisce|possiede|opera|ormeggia|staziona|basa|tiene',
    'es': r'mantiene|opera|gestiona|posee|estaciona|basa|tiene|amarra',
    'pt': r'mantém|opera|gere|gerencia|possui|estaciona|baseia|tem',
    'nl': r'onderhoudt|exploiteert|beheert|stationeert|bezit|baseert|houdt|heeft',
    'pl': r'utrzymuje|posiada|eksploatuje|stacjonuje|bazuje|prowadzi|ma',
    'hr': r'održava|posjeduje|upravlja|bazira|drži|stacionira|ima',
}
# Verbs that are a claim only with a fleet object right behind them (a short
# window): "Boat4You has 12 catamarans here" vs "Boat4You has years of …".
CLAIM_WEAK_VERBS = {'has', 'houses', 'moors', 'hält', 'tiene', 'tem', 'houdt', 'heeft', 'ma', 'ima', 'gère', 'gestisce'}
CLAIM_FLEET = {
    'en': r'fleets?|vessels?|catamarans?|yachts?|monohulls?|motorboats?|boats?|gulets?|sailboats?|superyachts?|motorsailers?|RIBs?|trimarans?|bases',
    'de': r'\w*(?:[Ff]lotte|[Ff]lotten|[Kk]atamaran|[Yy]acht|[Jj]acht|[Bb]oot|[Ss]chiff|[Gg]ulet|[Ee]inrumpf|[Ss]egler|Stützpunkt|[Bb]asis|[Bb]asen|[Vv]ersicherung)\w*',
    'fr': r'flottes?|catamarans?|voiliers?|yachts?|bateaux|bateau|navires?|vedettes?|goélettes?|gulets?|monocoques?|unités|bases|assurances?',
    'it': r'flott[ae]|catamarani|catamarano|yacht|barche|barca|imbarcazion[ei]|velieri|veliero|motoscafi|gulet|caicchi|monoscafi|basi|base|assicurazion[ei]|assicurativ\w*',
    'es': r'flotas?|catamaranes|catamarán|yates?|veleros?|barcos?|embarcaciones|embarcación|lanchas?|goletas?|gulets?|monocascos?|bases|cobertura|pólizas?',
    'pt': r'frotas?|catamarãs|catamarã|iates?|veleiros?|barcos?|embarcações|embarcação|lanchas?|goletas?|gulets?|monocascos?|bases|cobertura|apólices?',
    'nl': r'\w*vloot\w*|\w*vloten|catamarans?|\w*jachten|\w*jacht|\w*boten|\w*boot|schepen|schip|vaartuigen|gulets?|eenrompers?|\w*basis|bases|\w*verzekering\w*',
    'pl': r'flot\w*|katamaran\w*|jacht\w*|łodzi\w*|łód\w*|jednost\w*|żaglów\w*|motorów\w*|gulet\w*|baz[aęyi]\w*|ubezpiecz\w*',
    'hr': r'flot\w*|katamaran\w*|jaht\w*|jedrilic\w*|brod\w*|plovil\w*|gliser\w*|gulet\w*|brodic\w*|baz[aeiu]\w*|osiguranj\w*',
}
CLAIM_STOP = {
    'en': r'aspects?|details?|logistics|documentation|pages?|articles?|guides?|alliances?|partnerships?|relationships?|contacts?|standards?|knowledge|records?|polic\w*|pricing|prices?|quotes?|communications?|presence|offices?|teams?|staff|network|cooperation|access|links?|ties|agreements?|relations|liaison|charters|rentals?|bookings?|website|platform|listings?|availability|every|a\s+\w+\s+of\s+(?:partner|operator)',
    'de': r'Aspekt\w*|Detail\w*|Dokumentation|Seiten|Allianz\w*|Partnerschaft\w*|Beziehung\w*|Kontakt\w*|Kommunikation|Zugang|Zugriff|Standard\w*|Logistik|Büro\w*|Team\w*|Netzwerk\w*|Zusammenarbeit|Preis\w*|Angebot\w*|Charter\b|Liegepl\w*|Website|Plattform',
    'fr': r'aspects?|détails?|logistique|documentation|pages?|alliances?|partenariats?|relations?|contacts?|communication|accès|normes?|standards?|réseau\w*|équipes?|bureaux?|bureau|collaboration\w*|prix|tarifs?|locations?|plateforme|site',
    'it': r'aspett\w*|dettagl\w*|logistica|documentazion\w*|pagine|alleanz\w*|partnership|rapport\w*|relazion\w*|contatt\w*|comunicazion\w*|accesso|standard|rete|team|uffic\w*|collaborazion\w*|prezz\w*|tariff\w*|noleggi\w*|piattaforma|sito',
    'es': r'aspectos?|detalles?|logística|documentaci\w*|páginas|alianzas?|asociaci\w*|relaci\w*|contactos?|comunicaci\w*|acceso|estándar\w*|red|redes|equipos?|oficinas?|colaboraci\w*|precios?|tarifas?|alquiler\w*|plataforma|sitio',
    'pt': r'aspetos?|aspectos?|detalhes?|logística|documentaç\w*|páginas|alianças?|parceri\w*|relaç\w*|contact\w*|contat\w*|comunicaç\w*|acesso|padr\w*|rede|equipas?|equipes?|escritório\w*|colabora\w*|preços?|tarifas?|aluguer\w*|plataforma|site',
    'nl': r'aspect\w*|detail\w*|logistiek|documentatie|pagina\w*|allianties?|partnerschap\w*|relatie\w*|contact\w*|communicatie|toegang|standaard\w*|netwerk\w*|team\w*|kantor\w*|kantoor|samenwerking\w*|prijz\w*|tarie\w*|verhuur\w*|platform|website',
    'pl': r'aspekt\w*|szczeg[oó]ł\w*|logistyk\w*|dokumentacj\w*|stron\w*|sojusz\w*|partnerstw\w*|relacj\w*|kontakt\w*|komunikacj\w*|dostęp\w*|standard\w*|sie[ćc]\w*|zesp[oó]ł\w*|biur\w*|współprac\w*|cen\w*|taryf\w*|wynajem\w*|platform\w*|stron\w*',
    'hr': r'aspekt\w*|detalj\w*|logistik\w*|dokumentacij\w*|stranic\w*|savez\w*|partnerstv\w*|odnos\w*|kontakt\w*|komunikacij\w*|pristup\w*|standard\w*|mrež\w*|tim\w*|ured\w*|suradnj\w*|cijen\w*|tarif\w*|najam\w*|platform\w*|stranic\w*',
}
# Boat4You as the object of a preposition is not the subject of the verb.
CLAIM_NOT_AFTER = re.compile(
    r"\b(?:with|by|at|for|through|from|via|mit|von|bei|für|über|durch|avec|par|chez|pour|de|con|per|di|da|por|para|com|pela|pelo|"
    r"met|door|bij|voor|van|przez|dla|od|z|ze|u|s|sa|kod|za|preko)\s*$", re.I)
# "gestiona la selección de la flota, la logística …" = Boat4You's service
# (the selection process, not "a selection of yachts").
CLAIM_STOP_START = {
    'en': r'the\s+selection', 'de': r'die\s+Auswahl', 'fr': r"la\s+sélection|l['’]\s*sélection|(?:des\s+)?bases\s+de\s+données", 'it': r'la\s+selezione|(?:le\s+)?banche\s+dati',
    'es': r'la\s+selección|(?:las\s+)?bases\s+de\s+datos', 'pt': r'a\s+seleção|(?:as\s+)?bases\s+de\s+dados', 'nl': r'de\s+selectie',
    'pl': r'wyb[oó]r\s+(?:jednostki|jachtu|łodzi)|baz\w*\s+danych', 'hr': r'odabir\s+(?:plovila|broda|jahte)|baz\w*\s+podataka',
}
CLAIM_WINDOW = 9
CLAIM_WEAK_WINDOW = 3
# EN only: the insurance / damage-waiver promises the brand restore produced.
CLAIM_INSURANCE_EN = re.compile(
    r'(?P<subj>(?:<strong>)?\bBoat4You(?:</strong>)?)(?P<mid>\s+(?:[a-z]+ly\s+)?)(?P<verb>maintains|includes|provides|carries|offers)\b')
CLAIM_INSURANCE_WORD = re.compile(r'insurance|damage\s+waiver', re.I)
CLAIM_INSURANCE_STOP = re.compile(r'\b(?:pricing|prices?|quotes?|transparent|all-inclusive|all-in|travel|medical|cancellation|knowledge|records?)\b', re.I)
CLAIM_POSSESSIVE_EN = re.compile(
    r"(?P<subj>(?:<strong>)?\bBoat4You(?:</strong>)?)['’]s\s+"
    r"(?P<mid>(?:(?!(?:the|a|an|to|at|in|of|for|from|on|with|by|is|are|was|has|have|had|can|will|lets?|allows?|filters?|shows?|"
    r"includes?|offers?|provides?|covers?|website|platform|search|team|booking|site|app|staff|experts?|advisors?|partners?|"
    r"network|service|support|approach|policy|commitment|expertise|experience|knowledge|reputation|operators?|own)\b)[\w’'&-]+\s+){0,5}?)(?P<fleet>fleets?)\b")
SENTENCE_END = re.compile(r'[.!?;](?=\s|<|$)|</(?:p|li|h[1-6]|td|dd|blockquote)\s*>')


def _claim_object_is_fleet(text, locale, window):
    """True when the first words of `text` (up to the sentence end) name boats
    or a fleet before any relationship/service noun."""
    end = SENTENCE_END.search(text)
    # Bare numbers don't count towards the window: `counts` removes them later,
    # which must not bring a fleet noun into the window on a second run.
    words = [w for w in re.sub(r'<[^>]+>', ' ', text[: end.start() if end else len(text)]).split()
             if not re.fullmatch(r'[\d.,+–-]+', w)][:window]
    fleet = re.compile(rf'(?:{CLAIM_FLEET[locale]})[,;:)]*', re.I if locale != 'de' else 0)
    stop = re.compile(rf'(?:{CLAIM_STOP[locale]})[,;:)]*', re.I)
    if re.match(CLAIM_STOP_START[locale], ' '.join(words), re.I):
        return False
    for w in words:
        w = w.strip('("“”„«»')
        # A hyphenated compound ("Luxus-Katamarane", "Segelyacht-Inventar",
        # "Katamaran-Liegeplatzvereinbarungen"): its last part is the head.
        parts = [p for p in w.split('-') if p]
        if stop.fullmatch(w) or (parts and stop.fullmatch(parts[-1])):
            return False
        if fleet.fullmatch(w) or any(fleet.fullmatch(p) for p in parts):
            return True
    return False


def fix_claims(src, ctx):
    loc = ctx.locale
    head, body, tail = split_body(src)
    cap, low = CLAIM_SUBJECT[loc]
    body_now = body

    def subject(m, start):
        return cap if at_sentence_start(body_now, start, colon=False) else low

    # 1) EN "Boat4You's Ionian fleet" → "our partners' Ionian fleet"; an
    #    earlier pass left "through our partners's platform" (40 files).
    if loc == 'en':
        def partners_s(m):
            new = m.group(1) + "'"
            ctx.record('claims', m.group(0), new)
            return new
        body = re.sub(r"\b([Oo]ur partners)['’]s\b", partners_s, body)
        body_now = body
        def poss(m):
            new_subj = "Our partners'" if at_sentence_start(body_now, m.start(), colon=False) else "our partners'"
            new = f"{new_subj} {m.group('mid')}{m.group('fleet')}"
            ctx.record('claims', plain(m.group(0)), plain(new))
            return new
        body = CLAIM_POSSESSIVE_EN.sub(poss, body)
        body_now = body

    # 2) Subject + claim verb (+ inverted "betreibt Boat4You" in DE/NL).
    article = r'(?:\b[Aa]\s+)?' if loc == 'pt' else ''
    forward = re.compile(
        rf'(?P<subj>{article}(?:<strong>)?\bBoat4You(?:</strong>)?)(?P<mid>\s+(?:(?:also|still|now|currently|auch|aussi|également|anche|también|também|ook|również|także|također|još|[\w-]+(?:ly|lich|ment|mente|nie))\s+)?)(?P<verb>{CLAIM_VERBS[loc]})\b(?![-’\'])')

    def fwd(m):
        if CLAIM_NOT_AFTER.search(re.sub(r'<[^>]+>', ' ', body_now[max(0, m.start() - 20): m.start()])):
            return m.group(0)
        weak = m.group('verb') in CLAIM_WEAK_VERBS
        if not _claim_object_is_fleet(body_now[m.end(): m.end() + 600], loc, CLAIM_WEAK_WINDOW if weak else CLAIM_WINDOW):
            return m.group(0)
        new = f"{subject(m, m.start())}{m.group('mid')}{m.group('verb')}"
        ctx.record('claims', plain(m.group(0)) + ' …', plain(new) + ' …',
                   plain(body_now[m.end(): m.end() + 120])[:80])
        return new

    body = forward.sub(fwd, body)
    body_now = body

    if loc in ('de', 'nl'):
        inverted = re.compile(rf'\b(?P<verb>{CLAIM_VERBS[loc]})(?P<mid>\s+)(?P<subj>(?:<strong>)?Boat4You(?:</strong>)?)(?=\s)')

        def inv(m):
            weak = m.group('verb') in CLAIM_WEAK_VERBS
            if not _claim_object_is_fleet(body_now[m.end(): m.end() + 600], loc, CLAIM_WEAK_WINDOW if weak else CLAIM_WINDOW):
                return m.group(0)
            new = f"{m.group('verb')}{m.group('mid')}{low}"
            ctx.record('claims', plain(m.group(0)) + ' …', plain(new) + ' …',
                       plain(body_now[m.end(): m.end() + 120])[:80])
            return new

        body = inverted.sub(inv, body)
        body_now = body

    # 3) EN insurance / damage-waiver promises.
    if loc == 'en':
        def ins(m):
            if CLAIM_NOT_AFTER.search(re.sub(r'<[^>]+>', ' ', body_now[max(0, m.start() - 20): m.start()])):
                return m.group(0)
            rest = body_now[m.end(): m.end() + 600]
            end = SENTENCE_END.search(rest)
            words = re.sub(r'<[^>]+>', ' ', rest[: end.start() if end else len(rest)]).split()[:6]
            text = ' '.join(words)
            if not CLAIM_INSURANCE_WORD.search(text) or CLAIM_INSURANCE_STOP.search(text):
                return m.group(0)
            new = f"{subject(m, m.start())}{m.group('mid')}{m.group('verb')}"
            ctx.record('claims', plain(m.group(0)) + ' …', plain(new) + ' …', text)
            return new

        body = CLAIM_INSURANCE_EN.sub(ins, body)

    return head + body + tail


# ------------------------------------------------------------------ driver

def rule_functions():
    return {
        'foreign': fix_foreign,
        'structure': fix_structure,
        'faq': fix_faq,
        'facts': fix_facts,
        'counts': fix_counts,
        'headings': fix_headings,
        'brand': fix_brand,
        'subject': R.fix_subject,
        'holes': R.fix_holes,
        'claims': fix_claims,
        'junk': R.fix_junk,
        'operators': R.fix_operators,
        'inland': R.fix_inland,
        'claims2': R.fix_claims2,
        'compass': R.fix_compass,
        'casing': R.fix_casing,
        'recap': R.fix_recap,
        'links': R.fix_links,
        'dupes': R.fix_dupes,
        'edits': R.fix_edits,
    }


# ---------------------------------------------------------------------------------------------------
# Regression checks added 6.10.2026 (w610 b4y-corpus): R14 per-day crew prices, R13 operator claims,
# R32 Croatian place names without diacritics, EN brand holes and a repeated fee sentence.
# Report only (fail --check); the fixes were made by hand. `--self-test` runs W610_SELF_TEST (every
# sentence the review of 6.10.2026 quoted must be found, every allowed sentence must pass).

# R14 — a per-day price put on a skipper / crew / hostess / chef / instructor. Allowed: a vessel's
# own day rate, crewed packages ("with crew", "including crew"), food and provisioning budgets,
# tips, fuel and mooring — decided by the words next to the amount and between the crew word and
# the amount, never by a word elsewhere in the sentence ("150–220 euro per day plus meals" is found).
PERDAY_MARK = {
    'en': r"per\s+day|a\s+day\b|/\s*day\b|daily|per-day|per\s+diem|day\s+rates?|(?:one|first|1)[-\s]day|day\s+charters?",
    'de': r"pro\s+Tag|am\s+Tag|/\s*Tag\b|täglich\w*|Tages(?:satz|sätze|miete|gage|honorar|preis|gebühr|charter)\w*"
          r"|je\s+Tag|(?:einen|ersten|ein)\s+Tag\b|eintägig\w*",
    'fr': r"par\s+jour|/\s*jour\b|journali\w*|quotidien\w*|(?:une|la\s+première|première)\s+journée|à\s+la\s+journée"
          r"|(?:premier|un)\s+jour\b",
    'it': r"al\s+giorno|per\s+giorno|/\s*giorno\b|giornalier\w*|al\s+dì|(?:un|primo)\s+giorno\b",
    'es': r"por\s+día|al\s+día|/\s*día\b|diari\w*|(?:un|primer)\s+día\b|de\s+día\b",
    'pt': r"por\s+dia|ao\s+dia|/\s*dia\b|diári\w*|(?:um|primeiro)\s+dia\b",
    'nl': r"per\s+dag|/\s*dag\b|dagtarie\w*|daghuur|dagprijs\w*|daags|dagelijks\w*|(?:één|eerste)\s+dag\b|dagcharter\w*",
    'pl': r"dzienn\w*|za\s+dzień|na\s+dzień|/\s*dzień|za\s+dobę|(?:jeden|pierwszy)\s+dzień",
    'hr': r"dnevn\w*|po\s+danu|na\s+dan\b|/\s*dan\b|(?:jedan|prvi)\s+dan\b|jednodnevn\w*",
}
# crew words as stems ("Skippered", "Crews", "bemanningen", "skiperi"); DE/NL also inside compounds
# ("Anglercrews"). A hyphen compound ("Crew-Anforderungen") is not a person, a fee compound is.
CREW_WORD = {
    'en': r"(?<![\w-])(?:skipper\w*|crew\w*|hostess\w*|chef\w*|captain\w*|stewardess\w*|deckhand\w*|cook\w*"
          r"|instructor\w*|navigator\w*)",
    'de': r"(?<![\w-])\w*(?:skipper|crew|besatzung|hostess|köch|koch\b|kapitän|ausbilder)\w*",
    'fr': r"(?<![\w-])(?:skipper\w*|équipag\w*|hôtess\w*|chef\w*|capitain\w*|cuisinier\w*|moniteur\w*)",
    'it': r"(?<![\w-])(?:skipper\w*|equipagg\w*|hostess\w*|chef\w*|cuoc\w*|capitan\w*|istrut\w*)",
    'es': r"(?<![\w-])(?:patr[oó]n\w*|skipper\w*|tripula\w*|azafat\w*|chef\w*|cociner\w*|capit[aá]n\w*|instruct\w*)",
    'pt': r"(?<![\w-])(?:skipper\w*|tripula\w*|hospedeir\w*|chef\w*|cozinheir\w*|capitão|capitães|comandante\w*"
          r"|instrut\w*)",
    'nl': r"(?<![\w-])\w*(?:schipper|skipper|bemanning|hostess|kok\b|koks\b|chef|kapitein|instructeur)\w*",
    'pl': r"(?<![\w-])(?:skipper\w*|skiper\w*|załog\w*|hostess\w*|kuchar\w*|kapitan\w*|instruktor\w*|sternik\w*)",
    'hr': r"(?<![\w-])(?:skiper\w*|skipper\w*|posad\w*|hostes\w*|kuhar\w*|kapetan\w*|instrukt\w*)",
}
# a hyphen compound that is not a person ("Crew-Anforderungen", "Skipper-Trinkgeld")
CREW_NONPERSON = (r"-(?:Anforderung|Option|Qualifikation|Erfahrung|Konfiguration|Größe|Zusammensetzung|Trinkgeld"
                  r"|Unterkunft|Kabine|Quartier|Bereich|Wechsel|Anzahl|Lizenz|Schein|Kurs|Pr[üu]fung|vereisten|samenstelling"
                  r"|grootte|ervaring|opties|fooi|verblijf|hut|Expertise|Wissen|Kenntnis|Segelyacht|Yacht|Motoryacht"
                  r"|Charter|Katamaran|Boot|Paket|Service|Dienst|Arrangement)")
_CUR = r"(?:€|\$|£|(?:EUR|USD|GBP|[Ee]uros?|[Ee]ura|Euro)\b)"
_NUM = r"\d(?:[\d.,]|\s(?=\d{3}\b))*"
_RANGE = r"(?:\s?[–—-]\s?|\s+(?:to|and|bis|und|à|et|a|y|e|tot|en|do|i|till)\s+)"
DAY_AMOUNT = (rf"(?:{_CUR}\s?{_NUM}(?:{_RANGE}(?:{_CUR}\s?)?{_NUM}(?:\s?{_CUR})?)?"
              rf"|{_NUM}(?:\s?{_CUR})?{_RANGE}{_NUM}\s?{_CUR}|{_NUM}\s?{_CUR})")
# between the crew word and the amount: the amount is a vessel's or a package's price ...
CREW_GAP_VESSEL = (r"(?i)\b(?:yachts?|vessels?|boats?|catamarans?|monohulls?|gulets?|motorsailers?|RIBs?|charters?"
                   r"|Yachten|Schiffe?|Boote?|Katamarane?|Bootsmiete|navires?|bateaux?|vedettes?|voiliers?|imbarcazion\w*"
                   r"|barche|barca|catamarani|yates?|embarcaci\w*|barcos?|veleros?|lanchas?|iates?|embarcaç\w*|veleiros?"
                   r"|jachten|schepen|boten|vaartuigen|jacht\w*|jednost\w*|łodzi|łódź|katamaran\w*|plovil\w*|brod\w*"
                   r"|jahte?|jedrilic\w*|najam\w*|alquiler\w*|location|noleggi\w*|aluguer\w*|czarter\w*|huur)\b")
# ... unless the crew is what is added ("Skippered charters add €300-500 daily")
CREW_GAP_ADD = (r"(?i)\b(?:add|adds|extra|additional|zusätzlich\w*|hinzu|ajout\w*|en\s+sus|supplément\w*|aggiung\w*"
                r"|in\s+più|añad\w*|suman|adicional\w*|acrescent\w*|adicion\w*|toeslag|dodaj\w*|dodatkow\w*|dodatn\w*)\b")
# food, provisioning, tips, fuel, mooring, a per-guest budget: words next to the amount or between
NEAR_VETO = (r"(?i)provision|groceri|\beat\b|\bmeals?\b|\bfood|\btips?\b|gratuit|fuel|diesel|moor|berth|marina fee"
             r"|parking|victual|\bguests?\b|\bprovide\b|\bpersons?\b|\bpeople\b|\bpax\b|per\s+head"
             r"|Proviant|Verpfleg|Lebensmittel|Trinkgeld|Treibstoff|Kraftstoff|Liegepl|Person|Gäste"
             r"|avitaill|approvision|ravitaill|courses|pourboire|carburant|amarr|mouillage|personne|invité"
             r"|approvvig|rifornim|mangiare|mancia|mance|carburante|gasolio|ormegg|persona|ospit"
             r"|avituall|aprovision|comestibles|comida|propina|combustible|amarre|huésped"
             r"|abastec|mercearia|refei|gorjeta|combustível|amarra|pessoa|hóspede"
             r"|boodschap|proviand|\beten\b|maaltijd|fooi|brandstof|ligplaats|persoon|gasten"
             r"|zaopatrz|żywnoś|jedzen|z?jeść|posiłk|napiw|paliw|cumow|\bosob\w*|gości|goście|convidad|invitad|fornec"
             r"|opskrb|namirnic|hran[aeiu]|obro[kc]|napojnic|goriv|\bvez\w*|gost\w*")
# a vessel's own day rate right next to the amount ("€250–500 per day bareboat", "Bareboat: €200")
BAREBOAT = r"(?i)bareboat|without\s+(?:a\s+)?skipper|ohne\s+Skipper|sans\s+(?:skipper|équipage)|senza\s+skipper|sin\s+(?:patr|tripula)|sem\s+(?:skipper|tripula)|zonder\s+(?:schipper|bemanning)|bez\s+(?:załogi|skippera|skipera|posade)"
# "with crew", "including crew", "crew included": a crewed vessel's price; "without a skipper": a bareboat price
CREW_WITH = (r"(?i)\b(?:with|incl\w*|including|mit|inkl\w*|einschließlich|avec|compris|con|incluso|inclus\w*"
             r"|incluid\w*|com|incluindo|met|inclusief|z|ze|w\s+tym|wraz\s+z|s|sa|uključujući|uz)\s+(?:[\w']+\s+){0,3}$")
CREW_WITHOUT = (r"(?i)\b(?:without|ohne|sans|senza|sin|sem|zonder|bez)\s+(?:[\w']+\s+){0,2}$")
CREW_INCLUDED = r"(?i)^\s*(?:included|inbegriffen|inklusive|inclus\w*|compris|incluso|incluid\w*|inclu[ií]d\w*|inbegrepen|wliczon\w*|uključen\w*)\b"
# a crew word after the amount must be what the amount is for: "€150 per day for a skipper"
CREW_AFTER = r"(?i)^[\s,)]*(?:for|für|pour|per|para|por|voor|za|dla|na)\s+(?:[\w']+\s+){0,3}$"
TAIL_CUT = r"[,;()]"
PLUS_LEAD = r"(?i)^[\s,]*(?:plus|\+|zzgl\.?|zuzüglich|più|más|mais|além\s+de|oraz|uz|en\s+plus)\s"


# a crew word that is the guests themselves ("a crew of four", "vierköpfige Crew", "czteroosobowa załoga")
CREW_GROUP = (r"(?i)(?:\b(?:two|three|four|five|six|eight|\d+)[- ]person\b|köpfig\w*|osobow\w*|članu?\w*\s*$|koppig\w*|persoons\w*"
              r"|^\s*(?:of|de|di|van|von|od|da)\s+(?:two|three|four|five|six|eight|deux|trois|quatre|cinq|six|due|tre|quattro"
              r"|cinque|sei|dos|tres|cuatro|cinco|seis|duas|quatro|twee|drie|vier|vijf|zes|dwóch|trzech|czterech|dvoje|troje"
              r"|četvero|\d+)\b)")
# an amount that belongs to another period or unit ("€2,500–€7,000/week", "€40 per night")
_UNIT_LEAD = r"(?i)^\s*\+?\s*(?:/\s*|per\s+|pro\s+|par\s+|a\s+|al\s+|alla\s+|por\s+|za\s+|po\s+|la\s+)?"
OTHER_UNIT = (_UNIT_LEAD + r"(?:night|Nacht|nuit|nott|noche|noite|nacht|noc|noć|hour|Stunde|heure|ora\b|hora|uur|godzin"
              r"|sat\b|person|Person|personne|persona|pessoa|persoon|osob|metre|meter|Meter|mètre|metro|metr|foot|pied|piede"
              r"|pie\b|pé\b|voet|stop)")
WEEK_UNIT = _UNIT_LEAD + r"(?:week|Woche|wöchentlich|semaine|hebdo|settiman|semana|semanal|tydzień|tygodniow|tjed)"


CREW_DEPEND = (r"(?i)depend\w*\s+on|je\s+nach|abhängig|selon|en\s+fonction|a\s+seconda|in\s+base\s+a|según|dependiendo"
               r"|dependendo|consoante|afhankelijk|w\s+zależności|zależnie|ovisno|zahtjev\w*|équipage\s+libre|solo\s+patr|patrones\s+de")
CREW_COMPOUND_NONPERSON = r"(?i)(?:eisen|grootte|samenstelling|ervaring|größe|anforderung\w*|zusammensetzung|erfahrung|qualifikation\w*)$"
MODAL = (r"(?i)\b(?:can|could|may|kann|können|peut|peuvent|può|possono|puede|pueden|pode|podem|kan|kunnen|może|mogą"
         r"|može|mogu)\b")


def _crew_spans(clause, locale):
    for m in re.finditer(CREW_WORD[locale], clause, re.I):
        rest = clause[m.end():]
        if re.match(CREW_NONPERSON, rest, re.I) or re.match(CREW_INCLUDED, rest):
            continue
        before = clause[max(0, m.start() - 60):m.start()]
        bare = re.search(BAREBOAT, before)
        if re.search(CREW_WITHOUT, before[-30:]) or (bare and not re.search(MODAL, before[bare.end():])):
            continue
        if re.search(CREW_GROUP, before[-25:]) or re.match(CREW_GROUP, rest[:30]) or re.search(CREW_GROUP, m.group(0)):
            continue
        # the crew word describes a vessel ("goleta tripulada", "Posadom opremljena jahta", "(vaartuig + bemanning")
        if re.search(CREW_GAP_VESSEL[4:] + r"[\s+(]{1,4}$", before[-20:], re.I) or (re.match(r"\s+\w+\s+" + CREW_GAP_VESSEL[4:], rest[:30], re.I)
                                                                          and not re.search(CREW_GAP_ADD, rest[:40])):
            continue
        # "depending on … crew", "Napiwki dla załogi", a compound that is not a person ("bemanningseisen")
        if re.search(CREW_DEPEND, before[-30:]) or re.search(NEAR_VETO, before[-25:]) or re.search(CREW_COMPOUND_NONPERSON, m.group(0)):
            continue
        yield m.start(), m.end(), bool(re.search(CREW_WITH, before[-30:]))


def _crew_price_clause(clause, locale):
    marks = [(m.start(), m.end()) for m in re.finditer(r"(?i)(?:(?<!\w)|(?=/))(?:%s)" % PERDAY_MARK[locale], clause)]
    if not marks:
        return False
    crews = list(_crew_spans(clause, locale))
    if not crews:
        return False
    for am in re.finditer(DAY_AMOUNT, clause):
        a0, a1 = am.span()
        after_amount = clause[a1:a1 + 14]
        if re.search(r"\d", clause[max(0, a0 - 1):a0]) or re.match(OTHER_UNIT, after_amount) or re.match(WEEK_UNIT, after_amount):
            continue
        if re.search(NEAR_VETO, clause[max(0, a0 - 30):a0]) or re.search(BAREBOAT, clause[max(0, a0 - 15):a1 + 15]):
            continue
        for d0, d1 in marks:
            after = a1 <= d0 <= a1 + 25      # "€120–€180 per day", "80 € do 150 € dnevnom trošku"
            if after:
                if re.search(NEAR_VETO, clause[a1:d0]):
                    continue
                tail = re.split(TAIL_CUT, clause[d1:d1 + 30])[0]
                if not re.match(PLUS_LEAD, tail) and (re.search(NEAR_VETO, tail) or re.search(BAREBOAT, tail)):
                    continue
            elif d1 > a0:
                continue
            for c0, c1, with_ in crews:
                # "for the first day—an investment (€100–€150)", "one-day skippered introduction (… 250-350 euro)",
                # "Die täglichen Raten für Skipper liegen … 250 €"
                if not after and not (c1 <= d0 or 0 <= c0 - d1 <= 15):
                    continue
                if c1 <= a0 and a0 - c1 <= 110:
                    gap = clause[c1:a0]
                    add = re.search(CREW_GAP_ADD, gap)
                    if (re.search(NEAR_VETO, gap) or re.search(DAY_AMOUNT, gap)
                            or (with_ and not re.search(CREW_GAP_ADD, gap[:25]))):
                        continue
                    head = re.match(r"[\s-]*(?:[\w-]+\s+){0,2}?" + CREW_GAP_VESSEL[4:], gap, re.I)
                    if (head or re.search(CREW_GAP_VESSEL, gap[-40:])) and not add:
                        continue
                    return True
                if (after and c0 >= d1 and not with_ and re.match(CREW_AFTER, clause[d1:c0])
                        and not re.search(NEAR_VETO, clause[c1:c1 + 30])):
                    return True
    return False


def perday_crew_prices(sentences, locale):
    return [s for s in sentences if any(_crew_price_clause(c, locale) for c in re.split(r';\s', s))]




# R13 — Boat4You as employer of skippers/crews, owner of fleets and bases ("Boat4You's skippers",
# "Boat4You deploys/employs …", "our fleet/base"). The broker's own team, its skipper service or
# network, partner fleets and "via Boat4You" stay allowed (OPERATOR_KEEP around the match).
OPERATOR_DENY = {
    'en': [r"\bBoat4You['’]s\s+(?:[\w-]+\s+){0,2}?(?:fleet|bases?|mechanics|technicians|engineers|skippers|captains|crews"
           r"|crew members|instructors)\b(?!\s+(?:network|services?|options|recommendations|support))",
           r"\bBoat4You\s+(?:professional\s+|experienced\s+|local\s+)?(?:skippers|captains|crews|crew members|mechanics|instructors)\b",
           r"\b(?:[Yy]our|[Aa]|[Mm]any|[Mm]ost)\s+Boat4You\s+(?:captain|crew|skipper)",
           r"\bBoat4You\s+(?:employs|recruits|owns|deploys)\b",
           r"\b[Oo]ur\s+(?:own\s+)?(?:[\w-]+\s+)?(?:fleet|bases|mechanics|captains|skippers)\b",
           r"\b[Oo]ur\s+(?:[\w-]+\s+)?base\b(?!\s+pric)"],
    'de': [r"Boat4You(?:s|-)\s?(?:[a-zäöü][\w-]*\s+){0,2}(?:[\w-]*[Ff]lotte\w*|Basis|Crews?|Skipper|Kapitäne|Mechaniker)\b",
           r"\b(?:Crews?|Skipper|Kapitäne|Mechaniker|Flotte|Basis)\s+von\s+Boat4You\b",
           r"\bBoat4You\s+(?:beschäftigt|rekrutiert|besitzt)\b",
           r"\bBoat4You\s+setzt\s+(?:\d+\s+)?(?:[\w-]+\s+){0,2}?(?:Katamarane|Segelyachten|Motoryachten|Motorboote|Yachten|Boote)\b",
           r"\b[Uu]nser(?:e|er|en|em)?\s+(?:eigene\w*\s+)?(?:[\w-]+\s+)?(?:Flotte|Basis|Mechaniker|Kapitäne)\b"],
    'fr': [r"\b(?:équipages?|skippers?|capitaines|mécaniciens|flotte|base)\s+(?:[\w'-]+\s+){0,2}?de\s+Boat4You\b",
           r"\bBoat4You\s+(?:emploie|recrute|déploie|possède\s+(?:sa|ses|une|la)\s+(?:propre\s+)?flotte)\b",
           r"\b[Nn]otre\s+(?:propre\s+)?(?:flotte|base)\b|\b[Nn]os\s+(?:propres\s+)?(?:bases|capitaines|mécaniciens)\b"],
    'it': [r"\b(?:equipaggi?o?|skipper|capitani|meccanici|flotta|base)\s+(?:[\w'-]+\s+){0,2}?di\s+Boat4You\b",
           r"\bBoat4You\s+(?:impiega\s+(?:capitani|skipper|equipaggi)|recluta|schiera|possiede\s+(?:la|una)\s+flotta)\b",
           r"\b(?:[Ll]a|[Dd]alla|[Nn]ella|[Ss]ulla)\s+nostra\s+(?:flotta|base)\b|\b[Ii]\s+nostri\s+(?:capitani|meccanici)\b"],
    'es': [r"\b(?:tripulaci(?:ón|ones)|patrones|capitanes|mecánicos|flota|base)\s+(?:[\w'-]+\s+){0,2}?de\s+Boat4You\b",
           r"\bBoat4You\s+(?:emplea\s+(?:capitanes|patrones|tripulaci)|recluta|despliega|posee\s+(?:su|una)\s+(?:propia\s+)?flota)",
           r"\b[Nn]uestra\s+(?:propia\s+)?(?:flota|base)\b|\b[Nn]uestros\s+(?:\w+\s+)?(?:capitanes|mecánicos)\b"
           r"|\b[Nn]uestras\s+(?:\w+\s+)?tripulaciones\b"],
    'pt': [r"\b(?:tripulaç(?:ão|ões)|skippers?|capitães|comandantes|mecânicos|frota|base)\s+(?:[\w'-]+\s+){0,2}?da\s+Boat4You\b",
           r"\bBoat4You\s+(?:emprega|recruta|possui\s+(?:a|uma)\s+frota)\b",
           r"\b[Nn]oss[ao]\s+(?:própri[ao]\s+)?(?:frota|base)\b|\b[Nn]ossos\s+(?:capitães|mecânicos)\b"
           r"|\b[Nn]ossa\s+experiente\s+tripulação\b"],
    'nl': [r"\bBoat4You(?:['’]s|-)\s?(?:[\w-]+e\s+){0,2}(?:vloot|basis|bemanning\w*|schippers|kapiteins|monteurs)\b",
           r"\b(?:bemanning\w*|schippers|kapiteins|monteurs|vloot|basis|crews)\s+van\s+Boat4You\b",
           r"\bBoat4You\s+(?:werft|bezit|heeft\s+\w+\s+in\s+dienst)\b",
           r"\bBoat4You\s+zet\s+(?:\d+\s+)?(?:[\w-]+\s+){0,2}?(?:catamarans|zeiljachten|motorjachten|motorboten|jachten|boten)\b",
           r"\b[Oo]nze?\s+(?:eigen\s+)?(?:[\w-]+\s+)?(?:[\w-]*vloot|[\w-]*basis|monteurs|kapiteins)\b"],
    'pl': [r"\b(?:[Zz]ałog\w*|[Ss]kipper\w*|[Kk]apitan\w*|mechani[kc]\w*|flot\w*|baz[aęyie]\w*)\s+Boat4You\b(?!\s+(?:oferuje|organizuje))",
           r"\bBoat4You\s+(?:zatrudnia|rekrutuje|dysponuje|posiada\s+flot)",
           r"\b[Nn]asz(?:a|ej|ą|e|ych)?\s+(?:własn\w+\s+)?(?:flot\w*|baz[aęyie]\w*)\b"],
    'hr': [r"\bBoat4You-?ov(?:a|u|e|i|ih|om|oj)\s+(?:\w+\s+){0,2}?(?:flot\w*|baz[aeiu]\b|posad\w*|skiper\w*|kapetan\w*|mehaničar\w*)",
           r"\b(?:[Pp]osad\w*|skiper\w*|kapetan\w*|mehaničar\w*|flot\w*|baz[aeiu])\s+(?:tvrtke\s+)?Boat4You(?:a|e|u)?\b",
           r"\bBoat4You\s+(?:zapošljava|raspolaže|posjeduje\s+(?:flotu|rezervn))",
           r"\b[Nn]a(?:š|ša|še|ši|šu|šoj|šom)\s+(?:vlastit\w+\s+)?(?:flot\w*|baz[aeiu]\b)"],
}
OPERATOR_KEEP = (
    r"(?i)network|services?\b|options?\b|recommendations|réseau|rete\b|red de|rede de|netwerk|sieć|sieci|mrež|service de"
    r"|servizio|servicio|serviço|opzion|opción|opcion|opções|opçã|opcj|opcij|Netzwerk|Service|Option|Empfehlung|recomenda"
    r"|raccomand|preporuk|rekomendac|aanbeveling|recommandation|consigli|base (?:pric|de client)|prix de base|precio base"
    r"|prezzi base|preço base|base de clientes|baza klientów|clients|customer base|client base|Basispreis|partner fleet"
    r"|partnervloot|partner vloot|partenaire|asociad|parceir|Partner|expertise|connaissance|experiencia|através|tramite"
    r"|\bvia\b|przez|pośrednictwem|putem|preko|usług|podršk|suporte")




# Review of 6.10.2026: the forms the first patterns missed. These are checked without OPERATOR_KEEP
# (a "Partner" or "przez" elsewhere in the sentence does not excuse them); only the words inside the
# match itself can ("… sur la page de recherche de Boat4You").
_W8 = r"(?:[\w'’-]+\s+){0,8}?"
FLEET_NOUN = {
    'fr': r"flottes?", 'it': r"flott[ae]", 'es': r"flotas?", 'pt': r"frotas?", 'nl': r"vloot|vloten", 'de': r"Flotten?",
}
# "Les 6 catamarans de Saint-Mandrier de Boat4You", "flota de 3 motorsailers de Boat4You"
COUNT_VESSEL = {
    'fr': r"\d+\s+(?:[\w'’-]+\s+){0,2}?(?:catamarans|motorsailers|voiliers|yachts|vedettes|bateaux|navires|multicoques|monocoques|goélettes|unités)",
    'it': r"\d+\s+(?:[\w'’-]+\s+){0,2}?(?:catamarani|motorsailer|velieri|yacht|motoscafi|barche|imbarcazioni|multiscafi|monoscafi|caicchi|unità)",
    'es': r"\d+\s+(?:[\w'’-]+\s+){0,2}?(?:catamaranes|motoveleros|motorsailers|veleros|yates|lanchas|barcos|embarcaciones|multicascos|monocascos|goletas|unidades)",
    'pt': r"\d+\s+(?:[\w'’-]+\s+){0,2}?(?:catamarãs|motorsailers|veleiros|iates|lanchas|barcos|embarcações|multicascos|monocascos|goletas|unidades)",
    'nl': r"\d+\s+(?:[\w'’-]+\s+){0,2}?(?:catamarans|motorsailers|zeiljachten|jachten|motorboten|boten|schepen|vaartuigen|meerrompers)",
    'de': r"\d+\s+(?:[\w'’-]+\s+){0,2}?(?:Katamarane|Motorsegler|Segelyachten|Yachten|Motorboote|Boote|Schiffe|Mehrrumpfboote)",
}
FLEET_OF = {'fr': r"de", 'it': r"di|della", 'es': r"de", 'pt': r"da|de", 'nl': r"van", 'de': r"von"}
# words that make "… de Boat4You" the platform, its search page, its team, prices or its partners
FLEET_OF_KEEP = (r"(?i)plateforme|site|recherche|page|catalogue|\bsélection\b|offre|réseau|partenaire|équipe|service|client"
                 r"|piattaforma|sito|ricerca|pagina|catalogo|\bselezione\b|offerta|rete|partner|team|plataforma|sitio"
                 r"|búsqueda|página|catálogo|\bselección\b|oferta|\bred\b|socios|equipo|pesquisa|\bseleção\b|\brede\b|parceiros|equipa"
                 r"|platform|website|zoek|selectie|aanbod|netwerk|Plattform|Suche|Seite|Auswahl|Angebot|Kunden"
                 r"|tarif|prezz|precio|preço|prijs|Preis|inventa|gamma|gamme|gama|disponib|beschikbaar|Verfügbar"
                 r"|réserv|prenot|reserv|boek|Buchung|liste|elenco|lista|lijst|Liste|través|através|tramite|intermédiaire"
                 r"|mediante|disponibles? (?:sur|en)|disponibili su|disponíve(?:l|is) na|beschikbaar op|verfügbar auf"
                 r"|asociad|associé|associat|parceir|base de (?:datos|dados)|database|banca dati|databank|Datenbank|buscable"
                 r"|consultabile|pesquisável|durchsuchbar|doorzoekbaar|searchable|recherchable")
_PL_NOT_AFTER = r"(?<!przez )(?<!z )(?<!ze )(?<!na )(?<!w )(?<!od )(?<!do )(?<!dla )"
_PL_VERB = (r"oferuje|organizuje|pomaga|zapewnia|współpracuje|ułatwia|poleca|rekomenduje|łączy|umożliwia|może|dopasowuje"
            r"|wybiera|koordynuje|sprawdza|weryfikuje|przygotowuje|udostępnia|prezentuje|pozwala")
_HR_VERB = (r"nudi|organizira|pomaže|osigurava|surađuje|preporučuje|povezuje|omogućuje|može|odabire|koordinira|provjerava"
            r"|priprema|pruža|predstavlja")
STRICT_KEEP = r"(?i)partner|parceir|socios\b|partenaire"
_EN_DO = (r"conducts|provides|supplies|offers|gives|delivers|insists on|includes|handles|manages|managing|handling"
          r"|conducting|providing|offering|delivering|deliver|provide|offer|conduct|handle|manage")
OPERATOR_DENY_STRICT = {
    'en': [r"\bemployed by (?:Boat4You|possess|have)\b",
           r"\bBoat4You\s+manages the full\b[^.]{0,40}\bexperience\b",
           r"\bBoat4You\s+(?:operates|maintains|runs) (?:its|a|the|their) (?:\w+ ){0,2}?(?:fleet|boats|vessels|yachts|bases?)\b",
           r"\bBoat4You\s+(?:stocks|has|owns) \d+\s+(?:\w+\s+)?(?:boats|yachts|catamarans|vessels|multihulls|motorsailers|gulets)\b",
           r"(?:^|[.!?]\s)(?:Stocks|Maintains|Manages|Operates|Owns)\s+(?:\d|its\b|the\b)",
           r"\bBoat4You(?:['’]s)?\s+(?:[\w-]+\s+){0,4}?(?:" + _EN_DO + r")\b[^.;]*\b(?:pre-departure|pre-charter|navigation) briefings?\b",
           r"\bBoat4You['’]s (?:pre-departure|pre-charter) briefings?\b",
           r"\b[Oo]ur (?:own )?(?:vessels|boats|yachts|catamarans|motorsailers|gulets|motorboats|sailboats)\b",
           r"\b(?:maintained|serviced|crewed|staffed) by Boat4You\b",
           r"\bBoat4You['’]s\s+(?:\w+\s+){0,2}?(?:vessels|boats|yachts|catamarans|motorsailers)\b(?!\s+(?:page|search|listings?))"],
    'de': [r"\b(?:von|bei) Boat4You (?:\w+ ){0,2}(?:angestellt|beschäftigt|gewartet|betrieben)\b",
           r"\bBoat4You\s?-(?:Katamaran|Yacht|Segelyacht|Motoryacht|Flotte|Boot|Schiff|Motorsegler|Crew)\w*",
           r"\b[Uu]nsere (?:eigenen )?(?:Schiffe|Boote|Yachten|Katamarane|Segelyachten|Motoryachten|Motorsegler)\b",
           r"\bBoat4You\b[^.]{0,40}\bverfügt\b[^.]{0,30}\büber \d+ (?:\w+ )?(?:Katamaran|Yacht|Boot|Schiff|Motorsegler|Mehrrumpf)",
           r"\bverfügt Boat4You\b[^.]{0,40}über \d+",
           r"\bBoat4You verwaltet das gesamte\b[^.]{0,30}(?:Erlebnis|Charter)"],
    'fr': [r"\bemployés par Boat4You\b", r"\b(?:entretenu|maintenu)e?s? (?:\w+ ){0,2}(?:par|de) Boat4You\b",
           r"\b[Nn]os (?:propres )?(?:navires|bateaux|catamarans|voiliers|yachts|motorsailers|vedettes|goélettes)\b",
           r"\bBoat4You (?:possède (?:sa |ses |une |la )?(?:propre )?flotte|possède \d|dispose de \d|a \d+ (?:bateaux|catamarans|yachts|voiliers|vedettes)"
           r"|exploite (?:sa|ses|une|des|la|les) (?:\w+ )?(?:flotte|bateaux|bases?|navires))",
           r"\bBoat4You gère (?:l['’]ensemble de l['’]|toute l['’])expérience"],
    'it': [r"\bimpiegati da Boat4You\b", r"\bmantenut[aeio] (?:\w+ ){0,2}da Boat4You\b",
           r"\bflott[ae]\b[^.]{0,60}\bgestit[aeio] da Boat4You\b",
           r"\b(?:[Ii] )?nostri (?:catamarani|yacht|velieri|motorsailer|motoscafi)\b|\b(?:[Ll]e )?nostre (?:imbarcazioni|barche|unità)\b",
           r"\bBoat4You (?:dispone di \d|possiede (?:la |una )?(?:propria )?flotta|possiede \d|gestisce l['’]intera esperienza)"],
    'es': [r"\bempleados por Boat4You\b", r"\bmantenid[ao]s? (?:\w+ ){0,2}por Boat4You\b",
           r"\bflotas?\b[^.]{0,60}\bgestionad[ao]s? por Boat4You\b",
           r"\b[Nn]uestros (?:barcos|catamaranes|yates|veleros|motoveleros|motorsailers)\b"
           r"|\b[Nn]uestras (?:embarcaciones|lanchas|goletas|unidades)\b",
           r"\bBoat4You (?:tiene \d|posee (?:su |una |la )?(?:propia )?flota|posee \d|dispone de \d|gestiona toda la experiencia)",
           r"\b(?:goletas|barcos|yates|catamaranes|embarcaciones|veleros) asociad[ao]s de Boat4You\b"],
    'pt': [r"\bempregados pela Boat4You\b", r"\bmantid[ao]s? (?:\w+ ){0,2}pela Boat4You\b",
           r"\bfrotas?\b[^.]{0,60}\bgerid[ao]s? pela Boat4You\b",
           r"\b(?:[Oo]s )?nossos (?:barcos|catamarãs|iates|veleiros|motorsailers)\b|\b(?:[Aa]s )?nossas (?:embarcações|lanchas|goletas|unidades)\b",
           r"\bBoat4You (?:tem \d|possui \d|dispõe de \d|gere toda a experiência)"],
    'nl': [r"\b(?:door|bij) Boat4You (?:\w+ ){0,2}(?:ingezet|in dienst|onderhouden)\b|\bingezet door Boat4You\b",
           r"\bBoat4You\s?-(?:vloot|catamaran|jacht|zeiljacht|motorjacht|motorsailer|bemanning)\w*",
           r"\b[Oo]nze (?:eigen )?(?:schepen|boten|catamarans|jachten|zeiljachten|motorjachten|motorsailers|vaartuigen)\b",
           r"\bBoat4You heeft\b[^.]{0,30}?\b\d+ (?:\w+ )?(?:multihulls|catamarans|jachten|boten|schepen|motorsailers|zeiljachten"
           r"|motorjachten|vaartuigen|meerrompers)"
           r"|\bheeft Boat4You \d+\b|\bBoat4You beheert de (?:volledige|gehele|hele) charterervaring"],
    'pl': [r"\bzatrudni\w* przez Boat4You\b", r"\butrzymywan\w* (?:\w+ ){0,2}przez Boat4You\b",
           r"\b[Nn]asze (?:jachty|łodzie|katamarany|jednostki|motorsailery|motorówki)\b|\b[Nn]aszych (?:jachtów|łodzi|katamaranów|jednostek)\b",
           r"\bBoat4You (?:posiada \d|ma \d+ (?:\w+ )?(?:jacht|katamaran|łodzi|jednost|motor)|zarządza całym doświadczeniem)",
           r"\bflot\w*\s+(?:[\w-]+\s+){0,3}?" + _PL_NOT_AFTER + r"Boat4You\b(?!\s+(?:" + _PL_VERB + r"))"],
    'hr': [r"\bzaposlen\w* (?:u|kod|od strane) Boat4You\b", r"\bodržavan\w* (?:\w+ ){0,2}od strane Boat4You\b",
           r"\b[Nn]aš(?:a|e|i|ih) (?:plovila|brodovi|brodove|jahte|katamarani|katamarane|jedrilice|motorne jedrilice)\b",
           r"\bBoat4You (?:posjeduje \d|ima \d+ (?:\w+ )?(?:jaht|katamaran|brod|plovil)|raspolaže s \d|upravlja (?:cjelokupnim|cijelim) (?:doživljajem|iskustvom))",
           r"\bflot\w*\s+(?:[\w-]+\s+){0,3}?(?<!preko )(?<!putem )(?<!s )(?<!sa )"
           r"(?<!na )(?<!u )(?<!kod )Boat4You\b(?!\s+(?:" + _HR_VERB + r"))"],
}

# Review of 7.10.2026 (R13 follow-up): a Boat4You office at the destination ("Our Marbella office (open 24/7
# during charters)", "our marina office", "Boat4You maintains an office at the marina"). Boat4You's one office
# is in Split; the base at the marina belongs to the charter company. "Contact our office" (no place) passes.
OFFICE_DENY = {
    'en': [r"\b[Oo]ur\s+(?!Split\b)(?:[A-Z][\w'’-]+\s+){1,2}office\b",
           r"\b[Oo]ur\s+(?:marina|waterfront|harbou?r|harbourside|port|dockside|quayside|base|local|on-site|onsite)\s+office\b",
           r"\b[Oo]ur\s+offices?\s+(?:in|at|on)\s+(?!Split\b)(?:the\s+)?(?:marina|harbou?r|port|waterfront|[A-Z])",
           r"\bBoat4You\s+(?:maintains|has|operates|runs|keeps|staffs)\s+(?:an?|its)\s+(?:own\s+)?(?:[\w-]+\s+){0,3}?(?:office|desk)\b"],
    'de': [r"\b[Uu]nser(?:e|em|en|es)?\s+Büro\s+(?:in|auf|am|an)\s+(?!Split\b)",
           r"\b[Uu]nser(?:e|em|en|es)?\s+[\w-]+-Büro\b",
           r"\b(?:unterhält|betreibt|hat)\s+Boat4You\s+(?:ein|eigenes)\s+(?:\w+\s+)?Büro\b"
           r"|\bBoat4You\s+(?:unterhält|betreibt|hat)\s+(?:ein|eigenes)\s+(?:eigenes\s+)?(?:\w+\s+)?Büro\b"],
    'fr': [r"\b(?:[Nn]otre\s+bureau|[Nn]os\s+bureaux)\s+(?:de|du|à|d['’]|en bord|sur|au)\s*(?!Split\b)",
           r"\bBoat4You\s+(?:dispose|possède|gère|exploite|tient)\s+(?:d['’]un|un)\s+bureau\b"],
    'it': [r"\b[Nn]ostro\s+ufficio\s+(?:di|a|del|dello|della|sul|in|presso)\s+(?!Spalato\b|Split\b)",
           r"\bBoat4You\s+(?:gestisce|dispone di|ha|mantiene)\s+(?:un|il proprio)\s+ufficio\b"],
    'es': [r"\b[Nn]uestra\s+oficina\s+(?:de|en|del|frente)\s+(?!Split\b)",
           r"\bBoat4You\s+(?:mantiene|tiene|dispone de|gestiona|opera)\s+(?:una|su propia)\s+oficina\b"],
    'pt': [r"\b[Nn]oss[ao]s?\s+escritórios?\s+(?:de|em|da|do|à|na|no)\s+(?!Split\b)",
           r"\bBoat4You\s+(?:mantém|tem|dispõe de|gere|opera)\s+(?:um|o seu próprio)\s+escritório\b"],
    'nl': [r"\b[Oo]ns\s+kantoor\s+(?:in|op|aan|bij)\s+(?!Split\b)",
           r"\b[Oo]ns\s+(?!hoofd)[\w-]+kantoor\b",
           r"\bBoat4You\s+(?:heeft\s+|onderhoudt\s+)?een\s+(?:eigen\s+)?kantoor\s+(?:in|op|aan|bij)\b"],
    'pl': [r"\b[Nn]asz\w*\s+biur\w*\s+(?:w|na|przy)\s+(?!Splicie\b|Split\b|sprawie\b|celu\b)",
           r"\b[Nn]asz\w*\s+biur\w*\s+portow\w*",
           r"\bBoat4You\s+(?:posiada|prowadzi|ma|utrzymuje)\s+(?:\w+\s+){0,2}biur\w*"],
    'hr': [r"\b[Nn]a[šs]\w*\s+ured\w*\s+(?:u|na|uz|pri)\s+(?!Splitu\b)",
           r"\b[Nn]a[šs]\w*\s+ured\w*\s+marin\w*",
           r"\bBoat4You\s+(?:ima|upravlja|posjeduje|održava)\s+(?:\w+\s+){0,2}ured\w*"],
}
for _locale, _patterns in OFFICE_DENY.items():
    OPERATOR_DENY_STRICT[_locale] = OPERATOR_DENY_STRICT[_locale] + _patterns


# "Les motorsailers de Boat4You", "De motorsailers van Boat4You": boats of Boat4You
DIRECT_VESSEL_OF = {
    'fr': r"\b(?:[Ll]es|[Dd]es|[Ss]es) (?:catamarans|motorsailers|voiliers|yachts|vedettes|bateaux|navires|goélettes|gulets) de Boat4You\b",
    'it': r"\b(?:[Ii]|[Gg]li|[Ll]e|[Dd]ei|[Dd]egli|[Dd]elle) (?:catamarani|motorsailer|velieri|yacht|motoscafi|barche|imbarcazioni|caicchi|gulet) di Boat4You\b",
    'es': r"\b(?:[Ll]os|[Ll]as) (?:catamaranes|motosailers|motorsailers|veleros|yates|lanchas(?: motoras)?|barcos|embarcaciones|goletas) de Boat4You\b",
    'pt': r"\b(?:[Oo]s|[Aa]s) (?:catamarãs|motorsailers|veleiros|iates|lanchas|barcos|embarcações|goletas|gulets) da Boat4You\b",
    'nl': r"\b[Dd]e (?:catamarans|motorsailers|zeiljachten|motorjachten|jachten|boten|motorboten|schepen|vaartuigen|gulets) van Boat4You\b",
    'de': r"\b(?:[Dd]ie|[Dd]er) (?:Katamarane|Motorsegler|Segelyachten|Yachten|Motorboote|Boote|Schiffe|Gulets) von Boat4You\b",
}


def operator_claims(sentences, locale):
    rxs = [re.compile(p) for p in OPERATOR_DENY[locale]]
    strict = [re.compile(p) for p in OPERATOR_DENY_STRICT[locale]]
    fleet_of = (re.compile(r"\b(?:%s|%s)\s+%s(?:%s)\s+Boat4You\b"
                           % (FLEET_NOUN[locale], COUNT_VESSEL[locale], _W8, FLEET_OF[locale]))
                if locale in FLEET_NOUN else None)
    out = []
    for s in sentences:
        hit = False
        for rx in rxs:
            m = rx.search(s)
            if m and not re.search(OPERATOR_KEEP, s[max(0, m.start() - 60):m.end() + 40]):
                hit = True
                break
        hit = hit or any(not re.search(STRICT_KEEP, m.group(0)) for rx in strict for m in rx.finditer(s))
        if not hit and fleet_of:
            hit = any(not re.search(FLEET_OF_KEEP, m.group(0)) for m in fleet_of.finditer(s))
        if not hit and locale in DIRECT_VESSEL_OF:
            hit = bool(re.search(DIRECT_VESSEL_OF[locale], s))
        if hit:
            out.append(s)
    return out


# EN and translations: "Boat4You" cut from the sentence ("Stocks 14 multihulls", "Learn how manages",
# "employed by possess", "Das Team von kümmert sich", "Il team di gestisce", "A equipa da trata").
BRAND_HOLE = {
    'en': [r"(?:^|[.!?]\s)(?:Stocks|Maintains|Manages|Operates|Curates|Employs|Offers)\s+(?:\d|its\b|the\b|a\b|an\b)",
           r"\bhow (?:manages|maintains|curates|selects|operates|supports|handles|works with|vets|chooses|coordinates|arranges)\b",
           r"\b(?:employed|deployed|operated|managed) by (?:possess|have|bring|incorporate|offer|feature|use)\b"],
    'de': [r"\b(?:von|bei|mit|durch) (?:kümmert|bietet|hilft|sorgt|unterstützt|arrangiert|organisiert|koordiniert|verwaltet|managt)\b",
           r"\b(?:Engagement|Hingabe|Einsatz|Team|Partnerschaft|Concierge|Expertise) von (?:für|kümmert|sorgt|bietet)\b",
           r"\bkennt jeden einzelnen\b", r"\bwie regionale Charteroperationen\b"],
    'fr': [r"\b(?:de|par|avec) (?:s['’]occupe|gère|propose|aide|organise|coordonne|fournit)\b"],
    'it': [r"\b(?:di|da|con) (?:si occupa|gestisce|offre|aiuta|organizza|coordina|fornisce)\b"],
    'es': [r"\b(?:de|por|con) (?:se encarga|gestiona|ofrece|organiza|coordina|proporciona)\b"],
    'pt': [r"\b(?:da|pela) (?:trata|gere|oferece|organiza|coordena|fornece)\b"],
    'nl': [r"\b(?:van|door|met) (?:regelt|handelt|biedt|helpt|zorgt|organiseert|coördineert|beheert)\b",
           r"^Onderhoudt "],
    'pl': [r"^Zarządza całym\b"],
    'hr': [r"^Inače, (?:organizira|nudi|osigurava)\b", r"(?:^|, )poznaje svako plovilo\b"],
}


def brand_holes(sentences, locale):
    return [s for s in sentences if any(re.search(p, s) for p in BRAND_HOLE[locale])]


# R32 — Croatian place names without diacritics in visible text (hrefs, did= and attributes are not text).
# A hyphen-joined name in text ("Hvar-Korcula") counts too.
HR_ASCII_NAME = re.compile(
    r"(?<![\w/=%+.])(Sibenik(?:a|u|om)?|Kastel(?:a|ima)|Kastel(?= Gomilica)|Sukosan(?:a|u|om)?"
    r"|Korcul(?:a|e|i|u|ę|om|ansk\w*)|Primosten(?:a|u|om)?|Palmizan(?:a|e|i|u|om)|Komizia|Komiz(?:a|e|i|u|y|om)"
    r"|Bisev(?:o|a|u|om)|Losinj(?:a|u|em|om)?)(?!\w)")


def ascii_croatian_names(body, name):
    out = []
    greek = 'mikrolimano' in name  # "Kastela" there is the Piraeus quarter, not Kaštela
    for part in re.split(r'<[^>]*>', body):
        text = html.unescape(part)
        for m in HR_ASCII_NAME.finditer(text):
            if not (greek and m.group(1).startswith('Kastel')):
                out.append(text[max(0, m.start() - 40):m.end() + 40])
    return out


# R14 follow-up — the "fees are shown on each boat's page" sentence is stated once per page.
FEE_SENTENCE = {
    'en': r"shown on (?:each|the) boat['’]s page|shown on the page of each boat",
    'de': r"auf der Seite (?:jedes|des) Bootes angegeben",
    'fr': r"figur\w* sur la page (?:de chaque|du) bateau",
    'it': r"indicat\w* nella pagina (?:di ogni|della) barca",
    'es': r"figur\w* en la página (?:de cada|del) barco",
    'pt': r"consta\w* da página (?:de cada|do) barco",
    'nl': r"sta(?:at|an) op de pagina van (?:elke|de) boot",
    'pl': r"podan\w* na stronie (?:każdej )?łodzi",
    'hr': r"naveden\w* (?:je |su )?na stranici (?:svakog )?broda",
}


def fee_repeats(sentences, locale):
    hits = [s for s in sentences if re.search(FEE_SENTENCE[locale], s)]
    return hits[1:]


# Mario 8.10.2026: "GULET JE UVIJEK SA POSADOM" — a gulet is always chartered with its crew. On a gulet landing
# (file name with "gulet") no sentence may offer or imply the gulet bareboat or skipper-only: "Can I add a skipper
# after booking bareboat?", "For bareboat charter, a valid skipper licence…", "mixed bareboat-and-skippered packages",
# "Semi-bareboat gulets", "Most gulets … include professional crew", "skipper (if hired)", "Skipper fees are shown…",
# "On most European bareboat charters, fuel…", "recommends experienced sailors … and crew arrangement if you prefer"
# (Porto Santa Maria Maggiore, review of 8.10.2026), and their translations. Comparisons stay ("you cannot bareboat a
# gulet", "Unlike bareboat charters…", "compare crewed and bareboat options" for the other boats); price lists that
# "typically include crew, fuel, …" are not flagged (the corpus says "always include the crew and typically also
# fuel…" since 8.10.2026); other landings (catamarans, destinations, mixed pages) are not checked.
GULET_CREWED_DENY = {
    'en': [r"\bafter (?:booking|you book)\b[^.?!]{0,20}\bbare-?boat",
           r"(?i:\bfor bare-?boat (?:gulet )?charters?, (?:a|the)\b)",
           r"\blicen[cs]e (?:is )?required for bare-?boat\b",
           r"(?i:\bmixed bare-?boat)", r"(?i:\bsemi-bare-?boat)", r"(?i:\bbare-?boat gulets?\b)",
           r"(?i:\bcrewed bare-?boat\b)", r"(?i:\bbare-?boat options dominate\b)",
           r"(?i:\bon most european bare-?boat charters\b)",
           r"(?i:\bskipper (?:and crew )?fees? (?:is |are )?shown\b)",
           r"(?i:\bskipper service\b|\bskipper \(if hired\)|\bskipper/hostess if aboard\b)",
           r"\bA skipper makes the trip\b", r"(?i:\bcrew arrangements? if you prefer\b)",
           r"(?i:\b(?:typically|usually|generally) (?:includes? (?:a )?crew(?=\s?[.;]|$)|crewed\b))",
           r"\b(?:Most|Many)\b[^.;]{0,40}(?:charters?|gulets?)\b[^.;]{0,20}\b(?:include|includes|come with) "
           r"(?:an? )?(?:professional |experienced )?(?:crew|skippers?|captains?)\b"],
    'de': [r"\bnach der Buchung (?:eines |einer |des )?Bareboat",
           r"\bgemischte Bareboat-", r"(?i:\bsemi-bareboat)", r"\bBareboat-Gulet", r"\bCrewed Bareboat\b",
           r"\bFür Bareboat-(?:Gulet-)?Charter (?:ist|sind)\b", r"\bLizenz für Bareboat-Charter\b",
           r"\bBareboat-Optionen dominieren\b", r"\bBei den meisten europäischen Bareboat-Charter",
           r"\b(?:Skippergebühr|Gebühren für Skipper|Skipper-Service)\b",
           r"\bSkipper \(falls engagiert\)|\bSkipper/Hostess, falls an Bord\b", r"\bEin Skipper macht die Reise\b",
           r"\bCrew-Organisation helfen, wenn Sie\b",
           r"\btypischerweise (?:eine )?Crew(?=\s?[.;]|$)|\btypischerweise mit Besatzung \(",
           r"\b(?:Die meisten|Viele)\b[^.;]{0,40}(?:Charter|Gulets?)\b[^.;]{0,20}\b(?:beinhalten|verfügen über|umfassen) "
           r"(?:eine |die )?(?:professionelle |erfahrene )?(?:Crew|Skipper|Besatzung)\b"],
    'fr': [r"\baprès avoir réservé\b[^?]{0,40}(?:voile nue|sans skipper|bateau nu|sans équipage)",
           r"\bforfaits mixtes\b", r"\bsemi-sans skipper\b",
           r"(?i:\b(?:locations?|charters?) de (?:gulets?|goélettes?) sans (?:skipper|équipage)\b)",
           r"\bPour une location sans (?:équipage|skipper)\b", r"\blicence est-elle requise pour une location sans skipper\b",
           r"\blocations sans équipage avec équipage obligatoire\b", r"\boptions sans skipper dominent\b",
           r"\bSur la plupart des (?:locations|charters)\b[^.]{0,40}(?:sans skipper|équipement libre|bareboat)",
           r"(?i:\btarifs? du skipper\b)", r"\bservice du skipper\b",
           r"\bskipper \(si loué\)|\bskipper/hôtesse si à bord\b", r"\bUn skipper rend le voyage\b",
           r"\bconstitution d['’]équipage si vous préférez\b",
           r"\b(?:comprend|incluent) généralement un équipage(?=\s?[.;]|$)|\bgénéralement équipés d'un équipage \(",
           r"\b(?:La plupart des|De nombreux)\b[^.;]{0,40}(?:charters?|locations?|gulets?|goélettes?)\b[^.;]{0,20}"
           r"\b(?:incluent|comprennent) (?:un |l'|l’)?(?:équipage|des skippers)\b"],
    'it': [r"\bdopo aver prenotato\b[^?]{0,40}(?:bareboat|senza (?:equipaggio|skipper)|scafo nudo)",
           r"\bpacchetti misti\b", r"(?i:\bsemi-bareboat\b)", r"\bgulet bareboat\b", r"\bbareboat di gulet\b",
           r"\bPer il (?:charter|noleggio) (?:bareboat|senza skipper)\b", r"\blicenza per il noleggio bareboat\b",
           r"\bbareboat con equipaggio\b", r"\bopzioni senza skipper dominano\b",
           r"\bSulla maggior parte dei charter\b[^.]{0,30}(?:bareboat|senza skipper)",
           r"(?i:\b(?:il costo dello skipper|i costi di skipper)\b)", r"\bservizio skipper\b",
           r"\bskipper \(se noleggiato\)|\bskipper/hostess se a bordo\b", r"\bUno skipper rende il viaggio\b",
           r"\borganizzazione dell['’]equipaggio se preferisce\b",
           r"\b(?:include|includono) tipicamente un equipaggio(?=\s?[.;]|$)|\bsono tipicamente con equipaggio \(",
           r"\b(?:La maggior parte de(?:i|l|gli|lle)|Molti)\b[^.;]{0,40}(?:charter|gulet|caicchi)\b[^.;]{0,20}"
           r"\b(?:include|includono) (?:l'|l’)?(?:equipaggio|skipper)\b"],
    'es': [r"\bdespués de reservar\b[^?]{0,40}(?:sin (?:tripulación|patrón)|bareboat|casco desnudo)",
           r"\bpaquetes mixtos\b", r"(?i:\bsemi-bareboat\b)",
           r"(?i:\b(?:chárteres|alquileres|alquiler) de goletas? (?:a casco desnudo|sin (?:patrón|tripulación)))",
           r"\bPara el (?:alquiler|chárter) (?:sin (?:tripulación|patrón)|bareboat|a casco desnudo)\b",
           r"\blicencia para el alquiler sin patrón\b", r"\bopciones de bareboat dominan\b",
           r"\bEn la mayoría de los (?:alquileres|chárteres)\b[^.]{0,30}(?:bareboat|a pelo|sin tripulación)",
           r"(?i:\btarifas? del patrón\b)", r"\bservicio de patrón\b",
           r"\bcapitán \(si se contrata\)|\bcapitán/azafata si están a bordo\b", r"\bUn patrón hace que el viaje\b",
           r"\borganización de la tripulación si prefiere\b",
           r"\b(?:típicamente incluye|suelen incluir|suelen tener) tripulación(?=\s?[.;]| \(|$)",
           r"\b(?:La mayoría de|Muchos)\b[^.;]{0,40}(?:chárteres|alquileres|goletas)\b[^.;]{0,20}\bincluyen "
           r"(?:tripulación|capitanes)\b"],
    'pt': [r"\bapós reservar\b[^?]{0,40}(?:sem (?:skipper|tripulação)|barco nu|bareboat)",
           r"\bpacotes mistos\b", r"(?i:\bsemi-bareboat\b)",
           r"(?i:\balugue(?:r|res) de (?:gulets?|goletas?) sem (?:skipper|tripulação)\b)",
           r"\bPara aluguer sem skipper\b", r"\blicença para aluguer sem skipper\b", r"\bopções sem skipper dominam\b",
           r"\bNa maioria dos (?:alugueres|charters)\b[^.]{0,30}sem skipper",
           r"(?i:\bpreços? do skipper\b)", r"\bserviço de skipper\b",
           r"\bskipper \(se contratado\)|\bskipper/hostess, se a bordo\b", r"\bUm skipper torna a viagem\b",
           r"\barranjos de tripulação, se preferir\b",
           r"\b(?:inclui|incluem) tipicamente tripulação(?=\s?[.;]|$)|\bsão tipicamente tripulados \(",
           r"\b(?:A maioria d[oa]s|Muitos)\b[^.;]{0,40}(?:alugueres|gulets?|goletas?)\b[^.;]{0,20}\binclu(?:i|em) "
           r"(?:tripulação|capitães)\b"],
    'nl': [r"\bna (?:het boeken van (?:een |de )?|een )bareboat", r"\bgemengde bareboat", r"(?i:\bsemi-bareboat\b)",
           r"(?i:\bbareboat gulet\b)", r"\bVoor bareboat charter (?:is|zijn)\b", r"\bvaarbewijs vereist voor bareboat\b",
           r"\bbemande bareboat\b", r"\bbareboat-opties domineren\b", r"\bBij de meeste Europese bareboat\b",
           r"(?i:\btarie(?:f|ven) van (?:de )?schipper\b)", r"\bkan een professionele schipper worden geboekt\b",
           r"\bschipper ?service\b|\bschippersservice\b",
           r"\bschipper \(indien gehuurd\)|\bschipper/gastvrouw indien aan boord\b", r"\bEen schipper maakt de reis\b",
           r"\bhet regelen van bemanning als je\b",
           r"\bguletschipper",
           r"\b(?:omvat|zijn) doorgaans (?:een )?bemanning(?=\s?[.;]|$)|\bdoorgaans bemand(?=\s?[.;]| \(|$)",
           r"\b(?:De meeste|Veel)\b[^.;]{0,40}(?:charters?|gulets?)\b[^.;]{0,20}\b(?:zijn inclusief|omvatten) "
           r"(?:een )?(?:professionele |ervaren )?(?:bemanning|schippers)\b"],
    'pl': [r"\bpo (?:rezerwacji|zarezerwowaniu) czarteru bez załogi\b", r"\b(?:pakiety mieszane|mieszane pakiety)\b",
           r"\bpół-samodzieln", r"(?i:\bczarter\w* gul(?:i|etu|etów) bez załogi\b)", r"\bW przypadku czarteru bez załogi\b",
           r"\blicencja jest wymagana do czarteru bez załogi\b", r"\bopcje czarteru bez załogi dominują\b",
           r"\bW większości europejskich czarterów (?:typu )?bareboat\b",
           r"(?i:\bstawk[ai] skippera\b)", r"\busług[ai] (?:skippera|kapitana)\b",
           r"\bskippera \(jeśli wynajęty\)|\bskładka dla skippera/gospodyni\b", r"\bSkipper sprawia, że podróż\b",
           r"\borganizacji załogi, jeśli preferujesz\b",
           r"\bzazwyczaj obejmuj[eą] załogę(?=\s?[.;]|$)|\bzazwyczaj posiadają załogę \(",
           r"\b(?:Większość|Wiele)\b[^.;]{0,40}(?:czarter\w*|gul\w*)\b[^.;]{0,20}\bobejmuje "
           r"(?:profesjonaln\w+ |doświadczon\w+ )?(?:załogę|skipper\w*)"],
    'hr': [r"\bnakon rezervacije\b[^?]{0,40}(?:bez (?:skipera|posade)|bareboata)", r"\bmješ(?:ani|oviti) paketi\b",
           r"(?i:\bpolubareboat)", r"(?i:\bna(?:jam|jm\w*) guleta bez (?:posade|skipera)\b)",
           r"\bZa najam bez (?:posade|skipera)\b",
           r"\bnajam bez posade dominira\b", r"\bNa većini europskih najmova bez posade\b",
           r"(?i:\bcijen[ae] skipera\b)", r"\busluga (?:skipera|kapetana)\b",
           r"\bskiper \(ako je unajmljen\)|\bfond za skipera/hostesu\b", r"\bSkiper čini putovanje\b",
           r"\baranžmanom posade ako preferirate\b",
           r"\bobično uključuj[eu] posadu(?=\s?[.;]|$)|\bsu obično s posadom \(",
           r"\b(?:Većina|Mnogi)\b[^.;]{0,40}(?:najmov\w*|gulet\w*|gumenjak\w*)\b[^.;]{0,20}\buključuj[eu] "
           r"(?:profesionaln\w+ |iskusn\w+ )?(?:posadu|skiper\w*)"],
}


def gulet_crewed(sentences, locale):
    return [s for s in sentences if any(re.search(p, s) for p in GULET_CREWED_DENY[locale])]


# The <title> and meta description of a gulet landing (review of 8.10.2026: "Bareboat and skippered options via
# Boat4You" in 71 gulet descriptions, "Gulet Charter Sumpetar. Bare." cut short). The landing never renders the head
# (sanitizeCuratedHtml strips it) and the raw /seo-content/ file is noindex, but the file carries it: a head has no
# comparisons, so any bareboat / without-skipper wording is a finding.
GULET_HEAD_DENY = {
    'en': r"(?i)\bbare(?:-?boat|b?\.)|\bwithout (?:a )?skipper\b|\bskippered\b",
    'de': r"(?i)\bbareboat|\bohne Skipper\b|\bSkippertörn",
    'fr': r"(?i)\bbareboat|\bsans (?:skipper|équipage)\b|\bvoile nue\b",
    'it': r"(?i)\bbareboat|\bsenza (?:skipper|equipaggio)\b|\bbarche a vela e con skipper\b",
    'es': r"(?i)\bbareboat|\bsin (?:patrón|tripulación)\b|\bcasco desnudo\b",
    'pt': r"(?i)\bbareboat|\bsem (?:skipper|tripulação)\b",
    'nl': r"(?i)\bbareboat|\bzonder (?:schipper|bemanning)\b",
    'pl': r"(?i)\bbareboat|\bbez załogi\b",
    'hr': r"(?i)\bbareboat|\bbez (?:posade|skipera)\b",
}
_GULET_HEAD_TEXT = re.compile(r'<title[^>]*>([\s\S]*?)</title>|<meta name="description" content="([^"]*)"')


def gulet_head(src, locale):
    """Title / meta description texts of a gulet landing that offer the gulet bareboat or without skipper."""
    texts = [squash(html.unescape(m.group(1) if m.group(1) is not None else m.group(2)))
             for m in _GULET_HEAD_TEXT.finditer(src)]
    return [t for t in texts if re.search(GULET_HEAD_DENY[locale], t)]


def w610_checks(src, locale, name):
    body = split_body(src)[1]
    sentences = [plain(p) for m in R.BLOCK.finditer(body) for p in R.split_sentences(m.group(3))]
    found = [('perday-crew-price', s) for s in perday_crew_prices(sentences, locale)]
    found += [('operator-claim', s) for s in operator_claims(sentences, locale)]
    found += [('brand-hole', s) for s in brand_holes(sentences, locale)]
    found += [('fee-repeat', s) for s in fee_repeats(sentences, locale)]
    found += [('ascii-hr-name', x) for x in ascii_croatian_names(body, name)]
    if 'gulet' in name:
        found += [('gulet-crewed', s) for s in gulet_crewed(sentences, locale)]
        found += [('gulet-crewed', f'head: {t}') for t in gulet_head(src, locale)]
    return found


# R14 on the FAQ too (review of 7.10.2026): src/posts/static/<locale>/faq.md had "A skipper is roughly
# **€150/day** (plus food), hostess maybe **€130/day**" in all 9 locales; the corpus scan never saw it.
FAQ_ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'posts', 'static')


def faq_sentences(md):
    """Sentences of a markdown FAQ (emphasis markers and link targets dropped), each also joined with the
    sentence before it in the same paragraph: "Ako zatražite skipera, njegova naknada … Naknada se često
    naplaćuje po danu (npr. 150–200 €/dan …)" names the skipper one sentence before the amount."""
    out = []
    for para in re.split(r'\n\s*\n', md):
        text = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', para)
        text = squash(re.sub(r'[*`]+|(?<!\w)_+|_+(?!\w)', '', text))
        text = re.sub(r'\b([zdup])\.\s(B|h|a|ej|ex)\.', r'\1.\2.', text)   # "z. B." is not two sentences
        sentences = [s for s in (plain(p) for p in R.split_sentences(text)) if s]
        out.extend(sentences)
        out.extend(f'{a} {b}' for a, b in zip(sentences, sentences[1:]))
    return out


def faq_findings():
    found = []
    for locale in LOCALES:
        path = os.path.join(FAQ_ROOT, locale, 'faq.md')
        if os.path.exists(path):
            with open(path, encoding='utf-8') as fh:
                hits = perday_crew_prices(faq_sentences(fh.read()), locale)
            # a pair is reported only when neither of its sentences is reported on its own
            found += [('perday-crew-price', f'faq/{locale}', s) for s in hits
                      if not any(h != s and h in s for h in hits)]
    return found


# --self-test: every sentence the review of 6.10.2026 quoted (found on origin/main or on the branch
# before the fix) must be reported, every allowed sentence must pass.
W610_SELF_TEST = {
    'perday-crew-price': (perday_crew_prices, [
        ('en', "Skippered charters add €300-500 daily."),
        ('en', "If you don't hold one, hiring a professional skipper is straightforward — pricing runs roughly 150–220 euro per day plus meals."),
        ('pl', "Skipper kosztuje zwykle 180–250 € dziennie."),
        ('pl', "Czartery ze skipperem dodają 300-500 EUR dziennie za profesjonalną załogę."),
        ('de', "Ein Skipper kostet in der Regel 150 bis 200 Euro pro Tag plus Verpflegung."),
        ('de', "Crews kosten zusätzlich 400–700 € pro Tag."),
        ('nl', "Gecharterde bemanningen kosten € 400–€ 700 extra per dag."),
        ('hr', "Skiperi dodaju 80 € do 150 € dnevnom trošku ako je za Vaše plovilo potrebna dozvola, a nitko u Vašoj skupini je nema."),
        ('en', "Skipper hire (if you lack a boat license or prefer professional guidance) runs €120–€180 per day."),
        ('hr', "Naknada za profesionalnog skipera dodatni je dnevni trošak, obično u rasponu od 170 do 250 eura, plus troškovi prehrane."),
        ('de', "Die täglichen Raten für Skipper liegen je nach Qualifikation und Saison zwischen 150 und 250 €."),
        ('de', "Professionelle Anglercrews können arrangiert werden (zusätzlich 200-400 €/Tag); die Adria bietet ganzjährig Zahnbrassen."),
        ('pl', "Boat4You może zorganizować przygotowanie do licencji lub wynająć licencjonowanego skippera (150-250 EUR/dzień)."),
        ('fr', "Le capitaine lit les régimes de vent – des services qui valent la prime de 400-600 € par jour dans des scénarios de grande valeur."),
        ('pt', "O capitão lê os padrões de vento — serviços que valem o prémio diário de €400-600 em cenários de alto valor."),
        ('fr', "Les coûts de coordination d'équipage (embauche d'équipage local) s'élèvent à 100–200 € par membre d'équipage par jour."),
        ('en', "Captained day charters add approximately EUR 150-250 depending on vessel size and itinerary complexity."),
        ('en', "Many charter companies recommend hiring a skipper for the first day—an investment (€100–€150) yielding invaluable confidence and local knowledge."),
        ('en', "Upgrades commonly chosen include provisioning (marina staff stock your galley before arrival, typically 25-40 euro per person daily) and a one-day skippered introduction (helpful for first-time bareboat charterers, usually 250-350 euro)."),
        ('de', "Professionelle Kapitäne (150–250 € Tagesmiete) übernehmen die alleinige Verantwortung für die Pelagische Navigation."),
        ('it', "Servizi professionali di equipaggio opzionali (150-250 € al giorno) trasformano i charter di catamarani in esperienze di lusso."),
        ('en', "First-time bareboat sailors can arrange on-site skipper training (typically one day, 300–500 EUR) to familiarize with the specific yacht."),
        ('en', "Boat4You can arrange certified sailing instructors for one-day introductions (typically 250-350 euro) if you're keen to attempt bareboat."),
        ('fr', "Les coûts supplémentaires comprennent les services optionnels d'équipage (150-250 € par jour), les frais d'amarrage/de marina (40-100 € par nuit)."),
        ('nl', "Standaard vaartuigen zijn geschikt voor bemanningen; professionele schippers (€150–250 daghuur) beheren momenten met hoge verantwoordelijkheid."),
        ('de', "Erstcharterer mieten oft einen professionellen Hauptskipper – 150–200 € pro Tag – als Lerninvestition."),
    ], [
        ('en', "Mid-range vessels (50–65 feet) run €250–500 per day bareboat, €600–1200 with crew."),
        ('de', "Superyachten (65+ Fuß) beginnen bei 800 €+ pro Tag Bareboat, mit Crew-Optionen, die je nach spezifischem Schiff und Crew-Anforderungen 2000–5000 €+ pro Tag kosten."),
        ('en', "Budget €15–20 per crew daily for full meals."),
        ('en', "Many guests provide €10–15 per day per crew member."),
        ('en', "Provisioning budgets scale from €30–€50 per person daily (casual self-catering) to €150+ per person (fine dining with private chef)."),
        ('en', "Catamaran charters from Tourlos Marina range €400–900 per day for 40–55 foot vessels depending on season, cabin count, and crew composition."),
        ('en', "Pricing ranges 1,500-4,000 EUR daily depending on vessel size, season, and crew requirements."),
        ('en', "Motor yacht charters typically cost 250–500 EUR per day for a 10–12 guest vessel, including crew, fuel, and provisioning."),
        ('en', "Provisioning is reasonable — a crew of four can eat well on 20–30 euros per day using market vendors and konobas."),
        ('en', "Daily rates for a catamaran typically range from 800 to 2,500 euros per day, excluding extras like fuel, provisions, and skipper fees."),
        ('en', "Crewed motor yacht charters: 50-foot all-inclusive vessels start €5,000–€8,000 daily; larger superyachts exceed €15,000 daily (captain, chef, crew, meals, beverages included)."),
        ('en', "All-In Day Cost: Skippered motorboat charter (€800–€1,200/day) + fuel (€200–€400/day) = €1,000–€1,600 daily."),
        ('en', "Crew gratuities (€10-15 per person daily, approximately €70-105 weekly) remain customary though sometimes included within quoted rates."),
        ('en', "Sport-fishing charters command premium rates (€800–€1,500 daily) due to specialized equipment and skipper expertise."),
        ('en', "Crewed cons: Higher daily cost (€2,500–€7,000/week vs. €1,200–€2,500 bareboat)."),
        ('de', "Mittelklasse-Schiffe (50–65 Fuß) kosten 250–500 € pro Tag Bareboat, 600–1200 € mit Crew."),
        ('de', "Planen Sie 100-150 Euro pro Tag für eine vierköpfige Crew für Lebensmittel ein."),
        ('hr', "Za jednodnevni najam, motorne jahte bez skipera mogu se kretati od 4.000 do 15.000 €+, dok luksuzna jahta sa skiperom ili punom posadom lako može premašiti 20.000 € tjedno."),
        ('en', "Skipper fees are shown on each boat's page."),
        ('en', "For captained day charters, the skipper fee is shown on each boat's page."),
    ]),
    'operator-claim': (operator_claims, [
        ('en', "Boat4You manages the full charter experience: vessel selection, pre-departure briefings, weather routing advice, and 24/7 support throughout your Abaco voyage."),
        ('de', "Boat4You verwaltet das gesamte Chartererlebnis: Auswahl des Schiffes, Einweisungen vor dem Start."),
        ('fr', "La flotte de catamarans BVI de Boat4You comprend des navires méticuleusement entretenus des principaux fabricants."),
        ('fr', "Les navires méticuleusement entretenus de Boat4You, le soutien d'équipage expert et une connaissance régionale approfondie."),
        ('pt', "As embarcações cuidadosamente mantidas pela Boat4You, o apoio de tripulação especializada e o profundo conhecimento regional."),
        ('de', "Unsere Schiffe verwenden moderne Motoren mit geringeren Emissionen."),
        ('de', "Die Boat4You -Katamaranen ab Marina Kos werden sorgfältig gewartet, mit den neuesten Navigationssystemen."),
        ('fr', "La flotte soigneusement sélectionnée de 3 motorsailers de Boat4You combine l'expérience authentique de la voile."),
        ('fr', "Contrairement aux flottes massives de location sans skipper, nos motorsailers reçoivent des soins individuels."),
        ('nl', "In tegenstelling tot enorme bareboat vloten krijgen onze motorsailers individuele zorg."),
        ('nl', "De motorsailers van Boat4You balanceren klassieke houten interieurcharme met hedendaags comfort."),
        ('nl', "De vloot van 5 motorsailers van Boat4You ligt aangemeerd in de haven van Split."),
        ('nl', "Boat4You-vlootcatamarans zijn uitgerust met moderne navigatie."),
        ('nl', "Moderne luxe motorjachten ingezet door Boat4You maken gebruik van technologie."),
        ('it', "Boat4You dispone di 3 motoscafi a Marina Medulin, ciascuno posizionato per una partenza immediata."),
        ('pl', "Dlatego Boat4You posiada 14 wielokadłubowców w Ajaccio."),
        ('de', "Aus diesem Grund verfügt Boat4You in Ajaccio über 14 Mehrrumpfboote."),
        ('es', "Boat4You tiene 14 multicascos en Ajaccio por esta razón."),
        ('pt', "A Boat4You tem 14 multicascos em Ajaccio por esta razão."),
        ('nl', "Boat4You heeft om deze reden 14 multihulls in Ajaccio op voorraad."),
        ('fr', "Les capitaines et membres d'équipage professionnels employés par Boat4You possèdent une passion authentique."),
        ('de', "Professionelle Kapitäne und Besatzungsmitglieder, die von Boat4You angestellt werden, haben eine echte Leidenschaft."),
        ('it', "Gli skipper e i membri dell'equipaggio professionisti impiegati da Boat4You possiedono una genuina passione."),
        ('es', "Los capitanes y tripulantes profesionales empleados por Boat4You poseen una pasión genuina."),
        ('pt', "Os capitães e membros da tripulação profissionais empregados pela Boat4You possuem uma paixão genuína."),
        ('nl', "Professionele kapiteins en bemanningsleden die door Boat4You worden ingezet, hebben een oprechte passie."),
        ('pl', "Profesjonalni kapitanowie i członkowie załogi zatrudnieni przez Boat4You posiadają prawdziwą pasję."),
        ('es', "Las goletas asociadas de Boat4You emplean chefs formados en academias culinarias italianas."),
        ('en', "Professional captains and crew members employed by possess genuine passion for Mediterranean sailing."),
        ('en', "Boat4You conducts pre-departure briefings covering engine start/stop, navigation systems, and safety protocols."),
        ('en', "Boat4You provides detailed navigation briefings covering Krka River conditions, depth profiles, and transitions to open water."),
        ('pl', "Załogi Boat4You znają najlepsze kotwicowiska do robienia zdjęć."),
        ('hr', "Posade Boat4Youa dobivaju upute o granicama rezervata i održivim praksama."),
        # OFFICE_DENY (review of 7.10.2026)
        ('en', "Our Marbella office (open 24/7 during charters) handles any questions or emergencies."),
        ('en', "Kavala's central market district sits a 5-minute walk from our marina office."),
        ('en', "Most importantly, Boat4You maintains an office at the marina with experienced staff."),
        ('de', "Unser Büro in Marbella (24/7 während der Charter geöffnet) kümmert sich um alle Fragen oder Notfälle."),
        ('fr', "Boat4You dispose d'un bureau dédié à la voile à Cannigione."),
        ('it', "Il nostro ufficio di Cannigione mantiene un contatto 24/7 con tutti i charter attivi."),
        ('es', "Nuestra oficina de Marbella (abierta 24/7 durante los alquileres) se encarga de cualquier pregunta."),
        ('pt', "O nosso escritório de Marbella (aberto 24/7 durante os alugueres) trata de quaisquer questões."),
        ('nl', "Ons kantoor in Marbella (24/7 geopend tijdens verhuurperiodes) behandelt alle vragen of noodgevallen."),
        ('pl', "Skontaktuj się z naszym biurem w Salerno w celu zaplanowania spersonalizowanych wypraw."),
        ('hr', "Naš ured u Cannigioneu održava 24/7 kontakt sa svim aktivnim najmovima."),
    ], [
        ('en', "Boat4You helps you choose the right boat and supports you 24/7 throughout your Abaco voyage; the operator's base team gives the pre-departure briefing."),
        ('fr', "La flotte de catamarans BVI de nos partenaires comprend des navires méticuleusement entretenus."),
        ('es', "Ya sea que esté alquilando un yate de vela a través de Boat4You o planeando un circuito más largo."),
        ('es', "Consulte nuestra oferta completa en la base de datos de flotas buscable de Boat4You."),
        ('pt', "A frota parceira da Boat4You enfatiza embarcações mais novas."),
        ('en', "Boat4You maintains relationships with charter companies operating each manufacturer's models."),
        ('en', "Boat4You coordinates pre-departure briefings covering local sailing conditions."),
        ('en', "Boat4You's team handles marina coordination and 24/7 support; the base team gives the pre-departure briefing."),
        ('fr', "Les goélettes partenaires de Boat4You emploient des chefs formés dans des académies culinaires italiennes."),
        ('it', "Per questo motivo, 14 delle barche disponibili ad Ajaccio sono multiscafi."),
        ('nl', "Boat4You heeft 24/7 ondersteuning voor alle gasten."),
        ('en', "The operator's local base (reachable 24/7 during charters) handles any questions or emergencies."),
        ('en', "Contact our office to explore available vessels and review detailed itineraries."),
        ('en', "Free WiFi is available at the marina office."),
        ('en', "Our Split office answers before and after your charter."),
        ('nl', "De lokale basis van de verhuurder (24/7 bereikbaar tijdens de charter) behandelt alle vragen of noodgevallen."),
        ('pl', "Skontaktuj się z naszym biurem w sprawie wielotygodniowych wypraw."),
    ]),
    'brand-hole': (brand_holes, [
        ('en', "Stocks 14 multihulls in Ajaccio for this reason."),
        ('en', "Learn how manages these destinations responsibly at Boat4You"),
        ('en', "Discover how maintains and supports its fleet on our about page ."),
        ('en', "Visit about us to learn how manages regional charter operations with excellence."),
        ('en', "Learn how manages charter operations at Boat4You ."),
        ('en', "Professional captains and crew members employed by possess genuine passion for Mediterranean sailing."),
        ('en', "Modern luxury motor yachts deployed by incorporate technology specifically optimized for Eastern Mediterranean cruising."),
        ('de', "Mit nur 3 Motoryachten kennt jeden einzelnen Schiff genau."),
        ('de', "Erfahren Sie mehr über das Engagement von für Segel-Exzellenz."),
        ('de', "Das Team von kümmert sich um Pre-Departure-Briefings, Routenplanung und Notfallunterstützung."),
        ('fr', "L'équipe de gère les briefings avant le départ, la planification des itinéraires et le support d'urgence."),
        ('it', "Il team di gestisce il resto: briefing pre-partenza, coordinamento della marina e supporto 24 ore su 24."),
        ('pt', "A equipa da trata dos briefings pré-partida, planeamento de rotas e suporte de emergência."),
        ('nl', "Het team van handelt briefings voor vertrek, routeplanning en noodondersteuning af."),
        ('nl', "Onderhoudt uitgebreide ondersteuningsnetwerken op Corsica en Sardinië."),
        ('hr', "Samo 3 motorne jedrilice, poznaje svako plovilo izbliza."),
        ('hr', "Inače, organizira profesionalne skipera."),
    ], [
        ('en', "Offers vary by season and boat size."),
        ('de', "Die Lage von Marbella am Mittelmeer sorgt das ganze Jahr über für ausgezeichnetes Wetter."),
        ('de', "Die Südküste Teneriffas umfasst mehrere Tauchplätze, die von für Anfänger geeigneten flachen Riffen bis zu Steilwänden reichen."),
        ('hr', "Naš stručni tim poznaje svako plovilo, svakog kapetana i svako tajno sidrište."),
        ('en', "Learn how Boat4You selects these destinations responsibly."),
    ]),
    'fee-repeat': (fee_repeats, [
        ('en', ["Skipper fees are shown on each boat's page.", "Bareboat is cheaper.", "Skipper and crew fees are shown on each boat's page."]),
        ('de', ["Die Skippergebühr ist auf der Seite jedes Bootes angegeben.", "Die Gebühren für Skipper und Crew sind auf der Seite jedes Bootes angegeben."]),
    ], [
        ('en', ["Skipper fees are shown on each boat's page.", "Crewed options are also available."]),
    ]),
    # Mario 8.10.2026: the gulet landings before the fix (positives) and the comparisons / new answers (negatives)
    'gulet-crewed': (gulet_crewed, [
        ('en', "Can I add a skipper after booking bareboat?"),
        ('en', "Yes — split weeks, multi-boat fleet charters for larger parties, and mixed bareboat-and-skippered packages are all possible."),
        ('en', "For bareboat gulet charter, a recognised skipper licence and VHF certificate are typically required."),
        ('en', "Bareboat gulet charters (captain and crew absent) are available for experienced sailors."),
        ('en', "Most Boat4You gulet charters include experienced skippers, crew, full insurance, and berthing at Marina Kaštela."),
        ('en', "Gulets typically include crew; motoryachts are often bareboat."),
        ('en', "Fuel, provisioning, transit fees (country-specific), end-cleaning, and skipper (if hired) are typically added on top."),
        ('de', "Kann ich nach der Buchung eines Bareboat-Charters einen Skipper hinzufügen?"),
        ('de', "Semi-Bareboat-Optionen eignen sich für erfahrene Segler, die Unabhängigkeit suchen."),
        ('de', "Die meisten Gulets ab Stobreč verfügen über eine professionelle Crew: einen Skipper, der die Navigation übernimmt."),
        ('fr', "Puis-je ajouter un skipper ou une hôtesse après avoir réservé le bateau nu ?"),
        ('fr', "Les charters de gulets sans équipage (skipper et équipage absents) sont disponibles pour les marins expérimentés."),
        ('it', "Per il noleggio bareboat di gulet, è tipicamente richiesta una licenza di skipper riconosciuta e un certificato VHF."),
        ('it', "Se non ne possedete una, assumere uno skipper professionista è semplice – il costo dello skipper è indicato nella pagina di ogni barca."),
        ('es', "Los chárteres de goletas a casco desnudo (sin capitán ni tripulación) están disponibles para navegantes experimentados."),
        ('es', "Las goletas suelen tener tripulación (capitán, marinero, cocinero)."),
        ('pt', "Para aluguer de gulet sem skipper, é tipicamente necessária uma licença de skipper reconhecida e um certificado VHF."),
        ('pt', "A maioria dos alugueres de gulet da Boat4You inclui capitães experientes, tripulação, seguro completo e amarração."),
        ('nl', "Kan ik na een bareboat boeking een schipper toevoegen?"),
        ('nl', "Is Fethiye Haven geschikt voor beginnende guletschippers?"),
        ('pl', "Czartery guli bez załogi (bez kapitana i załogi) są dostępne dla doświadczonych żeglarzy."),
        ('pl', "Gulety pół-samodzielne: 2500–4000 € tygodniowo dla doświadczonych żeglarzy szukających niezależności."),
        ('hr', "Je li potrebna licenca za najam guleta bez skipera u Hrvatskoj?"),
        ('hr', "Najmovi guleta bez posade (bez kapetana i posade) dostupni su iskusnim jedriličarima."),
        ('hr', "Da – podijeljeni tjedni, najam flote od više plovila za veće grupe i mješani paketi najma bez posade i s posadom su mogući."),
        # Porto Santa Maria Maggiore, winter (review of 8.10.2026): the guest sails, crew only "if you prefer"
        ('en', "Boat4You recommends experienced sailors for off-season charters and can assist with seasonal itinerary planning and crew arrangement if you prefer cold-season sailing adventures."),
        ('de', "Boat4You empfiehlt erfahrenen Seglern Charter außerhalb der Saison und kann bei der Planung von Saisonrouten und der Crew-Organisation helfen, wenn Sie Abenteuer im kalten Wetter bevorzugen."),
        ('fr', "Boat4You recommande des navigateurs expérimentés pour les croisières hors saison et peut aider à la planification d'itinéraires saisonniers et à la constitution d'équipage si vous préférez les aventures de navigation en saison froide."),
        ('it', "Boat4You raccomanda velisti esperti per i charter fuori stagione e può assistere nella pianificazione dell'itinerario stagionale e nell'organizzazione dell'equipaggio se preferisce avventure veliche nella stagione fredda."),
        ('es', "Boat4You recomienda marineros experimentados para alquileres fuera de temporada y puede ayudar con la planificación de itinerarios estacionales y la organización de la tripulación si prefiere aventuras de navegación en temporada fría."),
        ('pt', "A Boat4You recomenda marinheiros experientes para alugueres fora de época e pode ajudar no planeamento de itinerários sazonais e arranjos de tripulação, se preferir aventuras de vela na estação fria."),
        ('nl', "Boat4You raadt ervaren zeilers aan voor charters buiten het seizoen en kan helpen bij het plannen van routes buiten het seizoen en het regelen van bemanning als je de voorkeur geeft aan avonturen op zee in de koude maanden."),
        ('pl', "Boat4You zaleca doświadczonych żeglarzy do czarterów poza sezonem i może pomóc w planowaniu tras sezonowych i organizacji załogi, jeśli preferujesz przygody żeglarskie w zimnym sezonie."),
        ('hr', "Boat4You preporučuje iskusne jedriličare za najmove izvan sezone i može pomoći s planiranjem itinerara za sezonu i aranžmanom posade ako preferirate avanture jedrenja u hladnoj sezoni."),
    ], [
        ('en', "This crew structure is non-negotiable: you cannot bareboat a gulet, nor would you want to."),
        ('en', "Unlike bareboat or skipper-only charters, a gulet comes as a complete package: professional captain, cook, crew, and often meals."),
        ('en', "Browse our partners' current Croatia gulet fleet or explore our full Croatia yacht selection to compare crewed and bareboat options."),
        ('en', "These rates typically include crew, fuel, and basic provisioning; guests cover food upgrades and shore excursions."),
        ('en', "Dinner service often includes crew participation in meal preparation."),
        ('en', "Do I need to add a skipper after booking?"),
        ('en', "No. A gulet is always chartered with its professional crew, captain included, so nobody in your group needs a skipper licence or VHF certificate."),
        ('en', "Gulets are always crewed, typically by a captain, deckhand and cook."),
        ('de', "Diese Crew-Struktur ist nicht verhandelbar: Sie können kein Gulet als Bareboat chartern, noch würden Sie es wollen."),
        ('de', "Diese Raten beinhalten typischerweise Crew, Treibstoff und grundlegende Verpflegung."),
        ('fr', "Cette structure d'équipage est non négociable : vous ne pouvez pas louer un gulet sans équipage, et vous ne le voudriez pas."),
        ('it', "Questa struttura dell'equipaggio è non negoziabile: non è possibile noleggiare un caicco bareboat, né si vorrebbe farlo."),
        ('es', "Los alquileres de goletas suelen incluir tripulación profesional, comidas y bebidas, y tasas de amarre."),
        ('pt', "Esta estrutura de tripulação é inegociável: não se pode alugar um gulet sem skipper, nem se quereria."),
        ('nl', "Is Fethiye Haven geschikt voor wie voor het eerst met een gulet vaart?"),
        ('nl', "Deze tarieven zijn doorgaans inclusief bemanning, brandstof en basisproviand."),
        ('pl', "Stawki te zazwyczaj obejmują załogę, paliwo i podstawowe zaopatrzenie."),
        ('pl', "To nie jest czarter bez załogi; to gościnność na morzu."),
        ('hr', "Ova struktura posade je neupitna: ne možete unajmiti GULET bez posade, niti biste to željeli."),
        ('hr', "Je li za najam guleta u Hrvatskoj potrebna dozvola?"),
        ('en', "Boat4You recommends off-season charters for guests comfortable with livelier seas and can assist with seasonal itinerary planning if you prefer cold-season sailing adventures; the gulet always sails with its professional crew."),
        ('de', "Boat4You empfiehlt Charter außerhalb der Saison für Gäste, die etwas bewegtere See nicht scheuen, und kann bei der Planung von Saisonrouten helfen, wenn Sie Abenteuer im kalten Wetter bevorzugen; die Gulet fährt dabei immer mit ihrer professionellen Crew."),
        ('fr', "Boat4You recommande les croisières hors saison aux voyageurs qui ne craignent pas une mer plus animée et peut aider à la planification d'itinéraires saisonniers si vous préférez les aventures de navigation en saison froide ; le gulet navigue toujours avec son équipage professionnel."),
        ('it', "Boat4You raccomanda i charter fuori stagione agli ospiti che non temono un mare più vivace e può assistere nella pianificazione dell'itinerario stagionale se preferisce avventure veliche nella stagione fredda; il gulet naviga sempre con il suo equipaggio professionale."),
        ('es', "Boat4You recomienda los alquileres fuera de temporada a quienes no temen un mar más movido y puede ayudar con la planificación de itinerarios estacionales si prefiere aventuras de navegación en temporada fría; la goleta navega siempre con su tripulación profesional."),
        ('pt', "A Boat4You recomenda os alugueres fora de época a quem não se importa com um mar mais mexido e pode ajudar no planeamento de itinerários sazonais, se preferir aventuras de vela na estação fria; o gulet navega sempre com a sua tripulação profissional."),
        ('nl', "Boat4You raadt charters buiten het seizoen aan voor gasten die een wat woeligere zee niet erg vinden en kan helpen bij het plannen van routes buiten het seizoen als je de voorkeur geeft aan avonturen op zee in de koude maanden; de gulet vaart altijd met een eigen professionele bemanning."),
        ('pl', "Boat4You poleca czartery poza sezonem gościom, którym nie przeszkadza bardziej wzburzone morze, i może pomóc w planowaniu tras sezonowych, jeśli preferujesz przygody żeglarskie w zimnym sezonie; gulet zawsze pływa ze swoją profesjonalną załogą."),
        ('hr', "Boat4You najmove izvan sezone preporučuje gostima kojima ne smeta valovitije more i može pomoći s planiranjem itinerara za sezonu ako preferirate avanture jedrenja u hladnoj sezoni; gulet uvijek plovi sa svojom profesionalnom posadom."),
    ]),
}
# gulet-crewed in the head: (locale, meta description) — positives before 8.10.2026, negatives after.
W610_SELF_TEST_GULET_HEAD = (
    [('en', "Gulet charter from Marina Kastela, Croatia. Bareboat and skippered options via Boat4You. Browse pricing and dates."),
     ('en', "Slow Dalmatian cruising to Brač, Hvar, and Vis. Gulet Charter Sumpetar. Bare."),
     ('de', "Gulet Charter in Griechenland. Bareboat- und Skippertörns – durchsuchen Sie die Boat4You-Flotte."),
     ('de', "Entdecken Sie traditionelle Holz-Yachten mit oder ohne Skipper."),
     ('fr', "Location de gulet en Grèce. Location de yachts avec ou sans skipper – parcourez la flotte Boat4You."),
     ('it', "Noleggio Gulet Turchia: Avventure in Crociera Blu. Noleggio barche a vela e con skipper — scopri la flotta Boat4You."),
     ('es', "Alquiler de goletas en el Puerto de Split. Alquiler de yates a casco desnudo y con patrón."),
     ('pt', "Aluguer de iates sem skipper e com skipper — explore a frota Boat4You."),
     ('nl', "Gulet charter in Griekenland. Bareboat en met schipper jachtverhuur — bekijk de Boat4You vloot."),
     ('pl', "Czarter Guletów Sumpetar. Bez załogi."),
     ('hr', "Unajmite gulet iz luke Fethiye. Najam jahti bez posade i s kapetanom.")],
    [('en', "Gulet charter from Marina Kastela, Croatia. Crewed gulets via Boat4You. Browse pricing and dates."),
     ('en', "Charter a gulet (traditional wooden yacht) in Athens with 4 luxury crewed vessels."),
     ('de', "Gulet Charter in Griechenland. Immer mit professioneller Crew – durchsuchen Sie die Boat4You-Flotte."),
     ('fr', "Vacances tout compris en goélette avec équipage."),
     ('it', "Noleggio Gulet Turchia: Avventure in Crociera Blu. Sempre con equipaggio professionale — scopri la flotta Boat4You."),
     ('es', "Alquiler de goletas en el Puerto de Split. Siempre con tripulación profesional."),
     ('pt', "Sempre com tripulação profissional — explore a frota Boat4You."),
     ('nl', "Gulet charter in Griekenland. Altijd met professionele bemanning — bekijk de Boat4You vloot."),
     ('pl', "Czarter Guletów Sumpetar."),
     ('hr', "Unajmite gulet iz luke Fethiye. Uvijek s profesionalnom posadom.")])
# gulet-crewed runs on gulet landings only: the same sentence on a catamaran or destination page passes.
W610_SELF_TEST_GULET_SCOPE = ('<body><p>Can I add a skipper after booking bareboat?</p></body>',
                              'gulet-charter-kastela.html', 'catamaran-charter-kastela.html')
W610_SELF_TEST_ASCII = (['Route Zadar-Kornati-Hvar-Korcula-Vis-Skradin', 'Sail from Sibenik to Primosten'],
                        ['<a href="/search?destinations=Korcula">Korčula</a>', 'Šibenik and Primošten'])
# faq_sentences() + perday_crew_prices: the FAQ paragraphs the review quoted (markdown, "z. B.", "npr.").
W610_SELF_TEST_FAQ = (
    [('en', "**Skipper or Crew Fees**: If you hire a skipper, hostess, chef, etc., those are paid separately. A skipper is roughly **€150/day** (plus food), hostess maybe **€130/day**, etc., though rates vary by location."),
     ('de', "**Skipper-Charter**: Wenn Sie einen Skipper anfordern, wird die Skipper-Gebühr zusätzlich zum Bareboat-Preis berechnet. Skipper-Gebühren werden oft pro Tag berechnet (z. B. 150 €–200 € pro Tag, abhängig von Standort und Qualifikationen, zuzüglich Verpflegung)."),
     ('hr', "**Čarter sa skiperom**: Ako zatražite skipera, njegova naknada se dodaje na bareboat cijenu. Naknada se često naplaćuje po danu (npr. 150–200 €/dan, ovisno o lokaciji i kvalifikacijama, plus troškovi opskrbe)."),
     ('pl', "Koszt skippera to około **150 euro dziennie** (plus wyżywienie), hostessy może **130 euro dziennie**, itp.")],
    [('en', "**Skipper or Crew Fees**: If you hire a skipper, hostess, chef, etc., those are paid separately. Skipper and crew rates vary by location and are shown on each boat's page."),
     ('en', "- Fuel: €150 (moderate engine use)\n- Moorings: if 3 nights in marinas at ~€50 each = €150"),
     ('hr', "**Naknade skipera ili posade**: Plaća se posebno. Iznosi za skipera i posadu ovise o lokaciji i navedeni su na stranici svakog broda.")])
# The register check reads plain(): a literal "<" before the slip ("(< 3 knopen)", "(<8)") used to hide the
# rest of the paragraph (review of 7.10.2026). (locale, body) — positives must give a 'register' finding.
W610_SELF_TEST_REGISTER = (
    [('nl', '<p>Nader langzaam (< 3 knopen) en laat de bemanning u naar de boeiring leiden (niet ankeren).</p>'),
     ('nl', '<p>Bareboat charters met zeer jonge kinderen (<8) zijn minder ideaal, tenzij u over aanzienlijke zeilervaring beschikt.</p>'),
     ('nl', '<p>Diepte &lt; 3 meter: <strong>let op</strong>, uw anker houdt slecht.</p>')],
    [('nl', '<p>Nader langzaam (< 3 knopen) en laat de bemanning je naar de boeiring leiden (niet ankeren).</p>'),
     ('nl', '<p>Bareboat charters met zeer jonge kinderen (<8) zijn minder ideaal, tenzij je over zeilervaring beschikt.</p>')])


def run_w610_self_test():
    failed = []
    for check, (func, positives, negatives) in W610_SELF_TEST.items():
        for locale, case in positives:
            sentences = case if isinstance(case, list) else [case]
            if not func(sentences, locale):
                failed.append(f'MISSED  {check} {locale}: {sentences[-1][:110]}')
        for locale, case in negatives:
            sentences = case if isinstance(case, list) else [case]
            if func(sentences, locale):
                failed.append(f'FLAGGED {check} {locale}: {sentences[-1][:110]}')
    for text in W610_SELF_TEST_ASCII[0]:
        if not ascii_croatian_names(f'<p>{text}</p>', 'x.html'):
            failed.append(f'MISSED  ascii-hr-name: {text}')
    for text in W610_SELF_TEST_ASCII[1]:
        if ascii_croatian_names(f'<p>{text}</p>', 'x.html'):
            failed.append(f'FLAGGED ascii-hr-name: {text}')
    for positive, cases in ((True, W610_SELF_TEST_FAQ[0]), (False, W610_SELF_TEST_FAQ[1])):
        for locale, md in cases:
            if bool(perday_crew_prices(faq_sentences(md), locale)) != positive:
                failed.append(f'{"MISSED " if positive else "FLAGGED"} faq perday-crew-price {locale}: {md[:110]}')
    for positive, cases in ((True, W610_SELF_TEST_REGISTER[0]), (False, W610_SELF_TEST_REGISTER[1])):
        for locale, body in cases:
            hit = any(check == 'register' for check, _ in R.independent_checks(body, locale, R.plain(body)))
            if hit != positive:
                failed.append(f'{"MISSED " if positive else "FLAGGED"} register {locale}: {R.plain(body)[:110]}')
    src, gulet_page, other_page = W610_SELF_TEST_GULET_SCOPE
    if not any(check == 'gulet-crewed' for check, _ in w610_checks(src, 'en', gulet_page)):
        failed.append(f'MISSED  gulet-crewed on {gulet_page}')
    if any(check == 'gulet-crewed' for check, _ in w610_checks(src, 'en', other_page)):
        failed.append(f'FLAGGED gulet-crewed on {other_page}')
    for positive, cases in ((True, W610_SELF_TEST_GULET_HEAD[0]), (False, W610_SELF_TEST_GULET_HEAD[1])):
        for locale, desc in cases:
            page = f'<head><title>Gulet Charter | Boat4You</title><meta name="description" content="{desc}"></head><body></body>'
            hit = any(check == 'gulet-crewed' for check, _ in w610_checks(page, locale, 'gulet-charter-x.html'))
            if hit != positive:
                failed.append(f'{"MISSED " if positive else "FLAGGED"} gulet-crewed head {locale}: {desc[:110]}')
    total = (sum(len(p) + len(n) for _, p, n in W610_SELF_TEST.values()) + sum(map(len, W610_SELF_TEST_ASCII))
             + sum(map(len, W610_SELF_TEST_REGISTER)) + sum(map(len, W610_SELF_TEST_FAQ))
             + sum(map(len, W610_SELF_TEST_GULET_HEAD)) + 2)
    for line in failed:
        print(line)
    print(f'w610 self-test: {total - len(failed)}/{total} cases pass')
    return not failed


def run_gulet_crewed(root):
    """The gulet-crewed check alone, on every gulet landing in every locale (no fixers, no other checks)."""
    findings, scanned = [], 0
    for locale in LOCALES:
        for name in sorted(os.listdir(os.path.join(root, locale))):
            if not (name.endswith('.html') and 'gulet' in name):
                continue
            scanned += 1
            with open(os.path.join(root, locale, name), encoding='utf-8') as fh:
                src = fh.read()
            body = split_body(src)[1]
            sentences = [plain(p) for m in R.BLOCK.finditer(body) for p in R.split_sentences(m.group(3))]
            findings += [f'{locale}/{name}: {squash(s)[:150]}' for s in gulet_crewed(sentences, locale)]
            findings += [f'{locale}/{name}: head: {t[:150]}' for t in gulet_head(src, locale)]
    for line in findings:
        print(f'  gulet-crewed  {line}')
    print(f'gulet-crewed: {len(findings)} finding(s) in {scanned} gulet landings')
    return not findings


_WORKER = {}


def _init_worker(common, en_text):
    _WORKER['common'] = common
    R.CORPUS_ROOT[:] = [common[0]]
    _WORKER['en_text'] = en_text


def _process_file(job):
    """Run the selected rules and the checks on one corpus file.
    Returns (log entries, check findings, changed?, final text)."""
    locale, name = job
    root, selected, corpus_slugs, check_only = _WORKER['common']
    funcs = rule_functions()
    path = os.path.join(root, locale, name)
    with open(path, encoding='utf-8') as fh:
        original = fh.read()
    file_log = []
    ctx = Ctx(locale, name, file_log, corpus_slugs)
    text = original
    for rule in selected:
        text = funcs[rule](text, ctx)
    if text != original and not check_only:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(text)
    en_src = text if locale == 'en' else _WORKER['en_text'].get(name)
    file_findings = [(check, f'{locale}/{name}', squash(excerpt))
                     for check, excerpt in R.checks(text, locale, name, en_src if locale != 'en' else None)]
    file_findings += [(check, f'{locale}/{name}', squash(excerpt)) for check, excerpt in w610_checks(text, locale, name)]
    return file_log, file_findings, text != original, (text if locale == 'en' else None)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true', help='report only; exit 1 if anything would change')
    ap.add_argument('--log', help='write every change as TSV (rule, file, before, after)')
    ap.add_argument('--only', help='comma-separated subset of rules: ' + ','.join(RULES))
    ap.add_argument('--root', default=ROOT)
    ap.add_argument('--report', help='write every check finding as TSV (check, file, excerpt)')
    ap.add_argument('--jobs', type=int, default=min(4, os.cpu_count() or 1),
                    help='parallel worker processes (default 4)')
    ap.add_argument('--self-test', action='store_true',
                    help='run the w610 checks against the sentences of the review of 6.10.2026 and exit')
    ap.add_argument('--refresh-locations', action='store_true',
                    help='re-snapshot /public/locations into scripts/seo-corpus-locations.json first')
    ap.add_argument('--gulet-crewed', action='store_true',
                    help='only the gulet-crewed check, on the gulet landings (a few seconds; yarn test:gulet runs it)')
    args = ap.parse_args()
    if args.self_test:
        sys.exit(0 if run_w610_self_test() else 1)
    if args.gulet_crewed:
        sys.exit(0 if run_gulet_crewed(args.root) else 1)

    if args.refresh_locations:
        api = os.environ.get('NEXT_PUBLIC_BOAT_WS_API_URL', 'https://api.boat4you.com')
        with urllib.request.urlopen(f'{api}/public/locations?size=5000', timeout=60) as resp:
            rows = json.load(resp)['content']
        rows = sorted(({'id': r['id'], 'name': r['name'], 'type': r['locationType'], 'cc': r.get('countryCode')}
                       for r in rows), key=lambda r: r['id'])
        with open(R.LOCATIONS_FILE, 'w', encoding='utf-8') as fh:
            fh.write('[\n' + ',\n'.join(json.dumps(r, ensure_ascii=False) for r in rows) + '\n]\n')
        print(f'locations snapshot: {len(rows)} rows')

    selected = [r for r in RULES if not args.only or r in args.only.split(',')]
    funcs = rule_functions()
    log = []
    changed = collections.Counter()
    per_rule = collections.defaultdict(collections.Counter)
    files_per_rule = collections.defaultdict(lambda: collections.defaultdict(set))
    scanned = collections.Counter()
    findings = []
    en_text = {}

    # prune: pages about inland waterways only, and non-HTML files
    pruned = R.prune_targets(args.root) if (not args.only or 'prune' in args.only.split(',')) else []
    for locale, name, reason in pruned:
        log.append(('prune', f'{locale}/{name}', reason, '(file deleted)', ''))
        per_rule['prune'][locale] += 1
        files_per_rule['prune'][locale].add(name)
        changed[locale] += 1
        if not args.check:
            os.remove(os.path.join(args.root, locale, name))
    pruned_set = {(l, n) for l, n, _ in pruned}
    corpus_slugs = frozenset(n[:-5] for n in os.listdir(os.path.join(args.root, 'en')) if n.endswith('.html'))

    jobs = []
    for locale in LOCALES:
        folder = os.path.join(args.root, locale)
        for name in sorted(os.listdir(folder)):
            if name.endswith('.html') and (locale, name) not in pruned_set:
                jobs.append((locale, name))
    common = (args.root, selected, corpus_slugs, args.check)
    # corpus-wide statistics are taken before any worker writes a file
    R.CORPUS_ROOT[:] = [args.root]
    if 'casing' in selected:
        for loc in ('hr', 'pl'):
            R._casing_stats(loc)
    # EN first: the translation checks compare against the fixed EN text.
    en_jobs = [j for j in jobs if j[0] == 'en']
    other_jobs = [j for j in jobs if j[0] != 'en']
    results = []
    workers = max(1, args.jobs)
    if workers > 1:
        ctx_mp = multiprocessing.get_context('fork')
        with ctx_mp.Pool(workers, initializer=_init_worker, initargs=(common, {})) as pool:
            results.extend(pool.map(_process_file, en_jobs, chunksize=16))
            en_text = {name: text for (locale, name), (_, _, _, text) in zip(en_jobs, results)}
        with ctx_mp.Pool(workers, initializer=_init_worker, initargs=(common, en_text)) as pool:
            results.extend(pool.map(_process_file, other_jobs, chunksize=16))
    else:
        _init_worker(common, {})
        results.extend(_process_file(j) for j in en_jobs)
        en_text = {name: text for (locale, name), (_, _, _, text) in zip(en_jobs, results)}
        _init_worker(common, en_text)
        results.extend(_process_file(j) for j in other_jobs)
    for (locale, name), (file_log, file_findings, was_changed, _) in zip(en_jobs + other_jobs, results):
        scanned[locale] += 1
        log.extend(file_log)
        for entry in file_log:
            per_rule[entry[0]][locale] += 1
            files_per_rule[entry[0]][locale].add(name)
        if was_changed:
            changed[locale] += 1
        findings.extend(file_findings)

    width = max(len(r) for r in RULES + ['prune'])
    print(f"{'rule':<{width}}  " + ' '.join(f'{l:>6}' for l in LOCALES) + '   total  (changes / files)')
    for rule in (['prune'] if pruned else []) + selected:
        cells = [f'{per_rule[rule][l]:>6}' for l in LOCALES]
        total = sum(per_rule[rule].values())
        nfiles = sum(len(v) for v in files_per_rule[rule].values())
        print(f'{rule:<{width}}  ' + ' '.join(cells) + f'   {total:>5}  ({nfiles} files)')
    print(f"{'files':<{width}}  " + ' '.join(f'{changed[l]:>6}' for l in LOCALES) + f'   {sum(changed.values()):>5}  changed of {sum(scanned.values())} scanned')

    left = []
    for locale in LOCALES:
        folder = os.path.join(args.root, locale)
        for name in sorted(os.listdir(folder)):
            if name.endswith('.html'):
                with open(os.path.join(folder, name), encoding='utf-8') as fh:
                    if FOREIGN_LEFT.search(fh.read()):
                        left.append(f'{locale}/{name}')
    if not args.check:
        print(f'foreign-script / placeholder fragments left: {len(left)}' + (f' ({", ".join(left[:10])})' if left else ''))

    templates = []
    for locale in LOCALES:
        folder = os.path.join(args.root, locale)
        for name in sorted(os.listdir(folder)):
            if not name.endswith('.html'):
                continue
            paths = [os.path.join(folder, name), os.path.join(args.root, 'en', name)]
            for path in paths:
                if os.path.exists(path):
                    with open(path, encoding='utf-8') as fh:
                        if TEMPLATE_LEFT.search(fh.read()):
                            templates.append(f'{locale}/{name}')
                            break
    print(f'unfilled templates (write or remove): {len(templates)}' + (f' ({", ".join(templates[:12])}{" …" if len(templates) > 12 else ""})' if templates else ''))

    if args.log:
        with open(args.log, 'w', encoding='utf-8') as fh:
            fh.write('rule\tfile\tbefore\tafter\tcontext\n')
            for rule, f, before, after, context in log:
                cells = [rule, f, before, after, context]
                fh.write('\t'.join(squash(c).replace('\t', ' ') for c in cells) + '\n')

    for check, excerpt in R.message_checks():
        findings.append((check, 'messages', squash(excerpt)))
    findings.extend(faq_findings())
    by_check = collections.Counter(c for c, _, _ in findings)
    files_by_check = collections.defaultdict(set)
    for check, f, _ in findings:
        files_by_check[check].add(f)
    print(f'check findings: {len(findings)}' + ('' if not findings else ' — ' + ', '.join(
        f'{c} {n} ({len(files_by_check[c])} files)' for c, n in by_check.most_common())))
    for check, _ in by_check.most_common():
        for c, f, excerpt in [x for x in findings if x[0] == check][:3]:
            print(f'  {c:<22} {f}: {excerpt[:150]}')
    if args.report:
        with open(args.report, 'w', encoding='utf-8') as fh:
            fh.write('check\tfile\texcerpt\n')
            for c, f, excerpt in findings:
                fh.write(f'{c}\t{f}\t{excerpt}\n')

    if args.check and (sum(changed.values()) or templates or findings):
        sys.exit(1)


if __name__ == '__main__':
    main()
