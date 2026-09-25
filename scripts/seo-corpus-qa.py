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
  facts      targeted factual fixes (ACI, kuna as current currency,
             "Boat4You base" ownership claims, sea names, …) — see FACTS
  counts     hard-coded fleet counts ("Over 1,642 vessels", "Catamarans
             (506)", "a 395-yacht inventory") → count-free wording
  headings   untranslated place names in headings (non-EN)
  brand      "Boat4You" dropped from the text: EN sentences without a subject
             ("<p> arranges skippers…", "'s fleet", "Why Sailors Return to"),
             headings "Why Choose for …" in EN/FR/ES/IT/PT/PL/HR

Usage:
  python3 scripts/seo-corpus-qa.py            # fix in place, print summary
  python3 scripts/seo-corpus-qa.py --check    # report only; exit 1 if anything would change
  python3 scripts/seo-corpus-qa.py --log changes.tsv   # every change: rule, file, before, after
  python3 scripts/seo-corpus-qa.py --only faq,facts
"""

import argparse
import collections
import html
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'seo-content')
LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr']
# brand runs before facts/counts: a restored "Boat4You's … base" or
# "Boat4You's 395-yacht" is then handled in the same pass.
RULES = ['foreign', 'structure', 'faq', 'brand', 'facts', 'counts', 'headings']


class Ctx:
    """Per-file context: locale, file name, change log."""

    def __init__(self, locale, name, log):
        self.locale = locale
        self.name = name
        self.log = log

    def record(self, rule, before, after, context=''):
        self.log.append((rule, f'{self.locale}/{self.name}', before, after, context))


def squash(text):
    return re.sub(r'\s+', ' ', text).strip()


def plain(fragment):
    """Visible text of an HTML fragment, whitespace-collapsed."""
    return squash(html.unescape(re.sub(r'<[^>]+>', ' ', fragment)))


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
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true', help='report only; exit 1 if anything would change')
    ap.add_argument('--log', help='write every change as TSV (rule, file, before, after)')
    ap.add_argument('--only', help='comma-separated subset of rules: ' + ','.join(RULES))
    ap.add_argument('--root', default=ROOT)
    args = ap.parse_args()

    selected = [r for r in RULES if not args.only or r in args.only.split(',')]
    funcs = rule_functions()
    log = []
    changed = collections.Counter()
    per_rule = collections.defaultdict(collections.Counter)
    files_per_rule = collections.defaultdict(lambda: collections.defaultdict(set))
    scanned = collections.Counter()

    for locale in LOCALES:
        folder = os.path.join(args.root, locale)
        for name in sorted(os.listdir(folder)):
            if not name.endswith('.html'):
                continue
            path = os.path.join(folder, name)
            with open(path, encoding='utf-8') as fh:
                original = fh.read()
            scanned[locale] += 1
            ctx = Ctx(locale, name, log)
            text = original
            for rule in selected:
                before_len = len(log)
                text = funcs[rule](text, ctx)
                n = len(log) - before_len
                if n:
                    per_rule[rule][locale] += n
                    files_per_rule[rule][locale].add(name)
            if text != original:
                changed[locale] += 1
                if not args.check:
                    with open(path, 'w', encoding='utf-8') as fh:
                        fh.write(text)

    width = max(len(r) for r in RULES)
    print(f"{'rule':<{width}}  " + ' '.join(f'{l:>6}' for l in LOCALES) + '   total  (changes / files)')
    for rule in selected:
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

    if args.log:
        with open(args.log, 'w', encoding='utf-8') as fh:
            fh.write('rule\tfile\tbefore\tafter\tcontext\n')
            for rule, f, before, after, context in log:
                cells = [rule, f, before, after, context]
                fh.write('\t'.join(squash(c).replace('\t', ' ') for c in cells) + '\n')

    if args.check and sum(changed.values()):
        sys.exit(1)


if __name__ == '__main__':
    main()
