"""
Corpus rules added after the 26.9.2026 audit; loaded by scripts/seo-corpus-qa.py.

Fixers (run in this order after the older rules):
  prune      corpus pages about inland waterways only (European Inland,
             Île-de-France, Casale sul Sile, Niderviller) and non-HTML files
             in public/seo-content are deleted (sea charter only)
  junk       page furniture that leaked into the texts: "© 2026 … All rights
             reserved" paragraphs, "Home | How We Work | …" nav bars, nested
             <a> (`<a href=X><a href=home>Boat4You</a></a>`), "how operates"
  operators  charter-company names (Sunsail, The Moorings, Dream Yacht
             Charter, Sea Independent …): we never show which company
             operates a boat — sentences rewritten (OPERATOR_FIXES); any
             other sentence naming one is dropped
  inland     sea charter only: houseboat / canal / river-cruise sections, list
             items and sentences removed (Krka, Rance, Ombla … estuaries that
             sea yachts sail up are allowed)
  claims2    Boat4You as fleet owner/operator: "our fleet" → "our partners'
             fleet" (9 languages), "Boat4You operates …" and "maintains
             rigorous standards" → our partner network, priority-berth
             promises removed, "since 2008" → 2013 (founding year)
  links      hrefs: relative / *.html corpus file names → the landing they
             mean, dead paths (/contact, /practices, /deals …) fixed or
             unlinked, non-EN links to /how-we-work, /faq, /about-us,
             /contact-us and home localised, search links with a stale or
             wrong did (Croatia c-98, Montenegro c-146 = Monaco, Mykonos c-132
             = Madagascar …) rewritten to the catalogue place they mean
             (scripts/seo-corpus-locations.json, refresh with
             --refresh-locations)
  dupes      a paragraph repeated verbatim in one file: later copies removed
  subject    sentences and headings whose subject "Boat4You" an earlier pass
             removed ("<p> arranges …", "Warum für …", "Why Choose for …"):
             the brand or a subject is restored per language (fix_subject,
             fix_heading_holes); recap re-runs it after the last rewrites
  casing     HR/PL headings in Title Case → sentence case: a word is lowered
             only when the corpus writes it in lower case mid-sentence (the
             rule web-ui's sentence_case.py applied once, kept reproducible)
  compass    wrong directions around Trogir/Split/Primošten/Rogoznica/
             Kaštela and the airport (COMPASS_CASES, with the distance fixes
             that go with them), ACI Split "largest/primary base" (ACI_FIXES)
  (claims2 also covers "our yachts", "we inspect/maintain our boats",
  subjectless upkeep sentences, Boat4You-Flotte / Boat4You-vloot compounds,
  founded-in and "15+ years" experience claims)

Checks (report; fail --check), see `checks()`: operator names, inland terms,
ownership claims, broken/relative hrefs, did/label mismatch, un-localised
static links, nested <a>, page furniture, Cyrillic, English text in a
translated file, a translation about other places than its EN source,
duplicate paragraphs/headings, founding year ≠ 2013 and experience claims,
and `independent_checks()`: a deny-list for fleet ownership written apart
from the fixer patterns (CLAIM_DENY), raw URLs / '">' / "[…]" in visible
text, sentences starting in lower case, compass directions (COMPASS_WRONG),
ACI Split superlatives, the wrong language; numbers a retranslated page
(RETRANSLATED) has that its EN source does not. `message_checks()` applies
the owner rules to messages/<locale>/*.json.
"""

import functools
import html
import json
import os
import re
import unicodedata
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.join(HERE, '..')
LOCATIONS_FILE = os.path.join(HERE, 'seo-corpus-locations.json')
LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr']
SITE = 'https://www.boat4you.com'


def squash(text):
    return re.sub(r'\s+', ' ', text).strip()


def plain(fragment):
    return squash(html.unescape(re.sub(r'<[^>]+>', ' ', fragment)))


def split_body(src):
    m = re.search(r'<body\b[^>]*>', src)
    if not m:
        return '', src, ''
    end = src.find('</body>', m.end())
    if end < 0:
        return src[: m.end()], src[m.end():], ''
    return src[: m.end()], src[m.end(): end], src[end:]


def norm(value):
    """normalizeDestinationName (src/utils/static/searchLandingPath.ts)."""
    s = (value or '').lower().replace('đ', 'd').replace('ł', 'l')
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


def slugify(name):
    """slugifyDestination (src/utils/static/curatedSeoSlug.ts)."""
    s = name.lower()
    for a, b in (('č', 'c'), ('ć', 'c'), ('đ', 'd'), ('š', 's'), ('ž', 'z')):
        s = s.replace(a, b)
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if not unicodedata.combining(c))
    s = re.sub(r"[/&,'’]+", ' ', s)
    s = re.sub(r'[^a-z0-9\s-]', '', s).strip()
    return re.sub(r'-+', '-', re.sub(r'\s+', '-', s))


# ------------------------------------------------------------- sentences

INLINE = r'(?:a|strong|em|b|i|span|u|sup|sub)'
ABBREVIATIONS = re.compile(
    r'(?:^|[\s(])(?:e\.g|i\.e|approx|incl|etc|vs|St|Ste|Mt|No|Nr|ca|z\.\s?B|d\.\s?h|u\.\s?a|bzw|ggf|evtl|inkl|Dr|Sr|Jr|'
    r'npr|tj|itd|tzv|tzw|np|m\.in|ok|sv|ul|p\.\s?ej|p\.\s?ex|cf|Prof|Sig|nm|km|min|max|av|Av|Hr|Nº|n°)$')
SENTENCE_CUT = re.compile(
    r'[.!?…](?:["”»’)]|</' + INLINE + r'\s*>)*(\s+)(?=(?:<' + INLINE + r'\b[^>]*>)*["“„«(¿¡]?[A-ZÀ-ÖØ-ÞĀ-ŽА-Я0-9])')
TAG_OPEN = re.compile(r'<(' + INLINE[3:-1] + r')\b[^>]*>')


def _balanced(piece):
    for tag in ('a', 'strong', 'em', 'b', 'i', 'span', 'u'):
        if len(re.findall(rf'<{tag}\b', piece)) != len(re.findall(rf'</{tag}\s*>', piece)):
            return False
    return True


def split_sentences(fragment):
    """Sentence pieces of an inline HTML fragment; each piece but the first
    starts with the whitespace that separated it, and keeps its tags
    balanced (a sentence cut inside an <a> is merged with the next one)."""
    cuts = [0]
    for m in SENTENCE_CUT.finditer(fragment):
        before = re.sub(r'<[^>]+>', '', fragment[max(0, m.start() - 14): m.start()])
        if ABBREVIATIONS.search(before):
            continue
        cuts.append(m.start(1))
    cuts.append(len(fragment))
    pieces = [fragment[a:b] for a, b in zip(cuts, cuts[1:]) if b > a]
    merged = []
    for piece in pieces:
        if merged and not _balanced(merged[-1]):
            merged[-1] += piece
        else:
            merged.append(piece)
    return merged


def drop_sentences(fragment, predicate):
    """(new fragment, [dropped plain sentences]) — sentences whose plain text
    matches `predicate` removed."""
    pieces = split_sentences(fragment)
    kept, dropped = [], []
    for piece in pieces:
        (dropped if predicate(plain(piece)) else kept).append(piece)
    if not dropped:
        return fragment, []
    out = ''.join(kept)
    if kept and kept[0] is not pieces[0]:
        out = out.lstrip()
    return out, [plain(p) for p in dropped]


BLOCK = re.compile(r'<(p|li|td|dd|blockquote|h[1-6])\b([^>]*)>([\s\S]*?)</\1\s*>')
HEADING = re.compile(r'<h([2-4])\b[^>]*>([\s\S]*?)</h\1\s*>')


def remove_sections(body, heading_predicate, ctx, rule):
    """Remove every <h2>–<h4> section whose heading matches, up to the next
    heading of the same or a higher level."""
    while True:
        for m in HEADING.finditer(body):
            if heading_predicate(plain(m.group(2))):
                level = int(m.group(1))
                nxt = re.compile(rf'<h[1-{level}]\b').search(body, m.end())
                end = nxt.start() if nxt else len(body)
                ctx.record(rule, plain(body[m.start(): end])[:160], '(section removed)')
                body = body[: m.start()] + body[end:]
                break
        else:
            return body


def edit_blocks(body, fn):
    """fn(tag, attrs, inner) -> new inner | None (block removed) | inner unchanged."""
    def sub(m):
        new = fn(m.group(1), m.group(2), m.group(3))
        if new is None:
            return ''
        if new == m.group(3):
            return m.group(0)
        return f'<{m.group(1)}{m.group(2)}>{new}</{m.group(1)}>'
    body = BLOCK.sub(sub, body)
    # lists / tables emptied by the removal
    body = re.sub(r'<(ul|ol)\b[^>]*>\s*</\1\s*>', '', body)
    return body


def tolerant(text):
    """Regex for a plain-text snippet as it may appear in the corpus HTML:
    any whitespace run may be a line break, apostrophes may be entities."""
    out = []
    for ch in text:
        if ch.isspace():
            if not out or out[-1] != r'\s+':
                out.append(r'\s+')
        elif ch in "'’":
            out.append(r"(?:'|’|&#x27;|&#39;|&rsquo;)")
        elif ch == '&':
            out.append(r'(?:&|&amp;)')
        elif ch == '"':
            out.append(r'(?:"|&quot;)')
        else:
            out.append(re.escape(ch))
    return re.compile(''.join(out))


# ------------------------------------------------------------------ prune

# Inland-waterway pages (canal / river bases): nothing to rewrite, the
# places are not sea charter. Deleted in all 9 locales; a catalogue place
# with one of these names then has no curated text (landing stays noindex).
PRUNE_SLUGS = {
    'european-inland-motor-yacht-charter',
    'european-inland-motorboat-charter',
    'european-inland-sailing-area-yacht-charter-and-boat-rental',
    'ile-de-france-motor-yacht-charter',
    'ile-de-france-sailing-area-yacht-charter-and-boat-rental',
    'casale-sul-sile-motor-yacht-charter',
    'motor-yacht-charter-casale-sul-sile',
    'niderviller-motorboat-charter',
    'motorboat-charter-niderviller-marina',
}


def prune_targets(root):
    """Files the prune rule deletes: [(locale, name, reason)]."""
    out = []
    for locale in LOCALES:
        folder = os.path.join(root, locale)
        for name in sorted(os.listdir(folder)):
            if not name.endswith('.html'):
                out.append((locale, name, 'not an HTML page (public, served as-is)'))
            elif name[:-5] in PRUNE_SLUGS:
                out.append((locale, name, 'inland waterways only'))
    return out


# ------------------------------------------------------------------- junk

COPYRIGHT_BLOCK = re.compile(r'\s*<(p|div|footer|small)\b[^>]*>(?:(?!</\1>)[\s\S]){0,400}?(?:&copy;|©)(?:(?!</\1>)[\s\S]){0,400}?</\1\s*>')
NAV_BAR = re.compile(r'\s*(?:<a\b[^>]*>[^<]{1,40}</a\s*>\s*\|\s*){2,}<a\b[^>]*>[^<]{1,40}</a\s*>')
NESTED_WRAP = re.compile(r'<a\b([^>]*)>\s*<a\b[^>]*>([^<]*)</a\s*>\s*</a\s*>')
LOOKALIKE = str.maketrans({chr(0x430): 'a', chr(0x435): 'e', chr(0x43E): 'o', chr(0x440): 'p', chr(0x441): 'c',
                           chr(0x445): 'x', chr(0x443): 'y', chr(0x456): 'i', chr(0x410): 'A', chr(0x415): 'E',
                           chr(0x41E): 'O', chr(0x420): 'P', chr(0x421): 'C', chr(0x425): 'X', chr(0x406): 'I'})
_CYR = chr(0x400) + '-' + chr(0x4FF)
LATIN_WORD_WITH_CYRILLIC = re.compile(rf'\b(?=[\w{_CYR}]*[A-Za-zÀ-ž])(?=[\w{_CYR}]*[{_CYR}])[\w{_CYR}]+\b')
BRACKET_BRAND = re.compile(r"\[(?:Boat4You|Subject Missing|Subject|Company Name|Nome Azienda|Firma|Empresa|Bedrijfsnaam|Nazwa firmy|Naziv tvrtke|Nom de l['’]entreprise|Nome da empresa|Firmenname|Brand)\]")
PLACEHOLDER_LINK = re.compile(r'<a\b[^>]*\shref="#?"[^>]*>((?:(?!</a\s*>)[\s\S])*)</a\s*>')
BRAND_GAP_EN = [
    (re.compile(r'\b([Hh]ow) operates\b'), r'\1 Boat4You works'),
]


def unnest_anchors(body, ctx):
    """An <a> opened inside an open <a>, or still open when its block ends,
    is closed there (what browsers do); the orphan </a> it leaves is dropped."""
    out, pos, depth, orphans = [], 0, 0, 0
    for m in re.finditer(r'<a\b[^>]*>|</a\s*>|</(?:p|li|h[1-6]|td|dd|blockquote)\s*>', body):
        out.append(body[pos: m.start()])
        pos = m.end()
        tag = m.group(0)
        if tag.startswith('</a'):
            if depth == 0:
                if orphans:
                    orphans -= 1
                    ctx.record('junk', '</a>', '(orphan </a> of an unclosed link removed)')
                    continue
                out.append(tag)
                continue
            depth -= 1
            out.append(tag)
        elif tag.startswith('</'):
            if depth:
                out.append('</a>')
                depth = 0
                orphans += 1
                ctx.record('junk', tag, '(link left open at the end of its block closed)')
            out.append(tag)
        else:
            if depth == 1:
                out.append('</a>')
                depth = 0
                orphans += 1
                ctx.record('junk', tag, '(outer link closed before nested link)')
            depth += 1
            out.append(tag)
    out.append(body[pos:])
    return ''.join(out)


# Links an earlier brand-removal pass broke: it cut '<a href="https://www.'
# (and the words around it) out of call-to-action sentences, so readers saw
# 'boat4you.com/search?…">catamaran fleet</a>' or a bare URL. The sentence is
# rebuilt per file where words are missing (RAW_LINK_EDITS); anything else
# gets a working link: the URL as visible text becomes "Boat4You" (a static
# page's own name when the URL is the whole link text), and 'boat4you.com/x">'
# becomes '<a href="https://www.boat4you.com/x">'.
_S = f'{SITE}/search?destinations=Athens%2FSaronic+Gulf&did=r-165'
_RIV = f'{SITE}/search?destinations=French+Riviera&did=r-184'
_RAW_S = 'boat4you.com/search?destinations=Athens%2FSaronic+Gulf&did=r-165">'
_RAW_RIV = 'boat4you.com/search?destinations=French+Riviera&did=r-184">'
_OLY_C = 'catamaran-charter-olympic-marina.html'
_NUR_C = 'catamaran-charter-sardinia-punta-nuraghe.html'
_NUR_S = 'sailing-yacht-charter-sardinia-punta-nuraghe.html'
_GRI = 'grimaud-catamaran-charter.html'
_DRAGE_M = 'motorboat-charter-drage.html'
_DRAGE_S = 'sailing-yacht-charter-drage.html'
_PORT = 'sailing-yacht-charter-portisco.html'
_CAG = 'sailing-yacht-charter-marina-cagliari.html'
RAW_LINK_EDITS = [
    ('en', _OLY_C, 'sailing waters. ' + _RAW_S, f'sailing waters. Browse the <a href="{_S}">'),
    ('en', _NUR_C, 'how-we-work">how boat4you.com/about-us">', f'how-we-work">how Boat4You works</a> and meet the <a href="{SITE}/about-us">'),
    ('en', _GRI, 'protected coves. ' + _RAW_RIV, f'protected coves. The <a href="{_RIV}">'),
    ('en', 'kornati-motor-yacht-charter.html', 'how-we-work">how boat4you.com/faq">', f'how-we-work">how Boat4You works</a> and read our <a href="{SITE}/faq">'),
    ('en', 'lavrion-catamaran-charter.html', 'departure advantage. ' + _RAW_S, f'departure advantage. Browse the <a href="{_S}">'),
    ('en', 'lavrion-sailing-yacht-charter.html', 'on the horizon. ' + _RAW_S, f'on the horizon. Browse the <a href="{_S}">'),
    ('en', 'motorboat-charter-brodogradiliste-filipi.html', '<p>Explore how boat4you.com/how-we-work">', f'<p>Explore how Boat4You works in our <a href="{SITE}/how-we-work">'),
    ('en', _DRAGE_M, 'to learn how boat4you.com/faq">', f'to learn how Boat4You works, or see our <a href="{SITE}/faq">'),
    ('en', 'motorboat-charter-olympic-marina.html', 'exactly that. ' + _RAW_S, f'exactly that. Check the <a href="{_S}">'),
    ('en', _DRAGE_S, 'to understand how boat4you.com/faq">', f'to understand how Boat4You works, or see our <a href="{SITE}/faq">'),
    ('en', _CAG, 'how-we-work">how boat4you.com/about-us">', f'how-we-work">how Boat4You works</a> and meet our <a href="{SITE}/about-us">'),
    ('en', 'sailing-yacht-charter-marina-delta-kallithea.html', 'filling your sails. ' + _RAW_S, f'filling your sails. Browse the <a href="{_S}">'),
    ('en', 'sailing-yacht-charter-olympic-marina.html', 'through the water. ' + _RAW_S, f'through the water. Browse the <a href="{_S}">'),
    ('en', _PORT, 'how-we-work">how boat4you.com/about-us">', f'how-we-work">how Boat4You works</a> and meet the <a href="{SITE}/about-us">'),
    ('en', _NUR_S, 'how-we-work">how boat4you.com/about-us">', f'how-we-work">how Boat4You works</a> and meet our <a href="{SITE}/about-us">'),
    ('de', _NUR_C, 'Erfahren Sie <a href="/de/how-we-work">wie boat4you.com/about-us">Team widmet sich der Exzellenz im Segeln an abgelegenen Orten</a>.',
     'Erfahren Sie, <a href="/de/how-we-work">wie Boat4You arbeitet</a>, und lernen Sie unser <a href="/de/about-us">Team</a> kennen, das sich dem Segeln an abgelegenen Orten verschrieben hat.'),
    ('de', _DRAGE_S, 'um zu verstehen, wie boat4you.com/faq">FAQ</a> für Segelspezifische Fragen.',
     'um zu verstehen, wie Boat4You arbeitet, oder lesen Sie unsere <a href="/de/faq">FAQ</a> zu Fragen rund ums Segeln.'),
    ('fr', _GRI, 'Les annonces de catamarans sur ' + _RAW_RIV + 'French Riviera catamaran listings</a>',
     f'Les <a href="{_RIV}">annonces de catamarans sur la Côte d\'Azur</a>'),
    ('fr', _DRAGE_M, 'pour en savoir plus sur boat4you.com/faq">', 'pour en savoir plus sur Boat4You, ou consultez notre <a href="/fr/faq">'),
    ('fr', _PORT, 'comment l\'équipe passionnée de boat4you.com/about-us">est derrière votre aventure de navigation</a>.',
     'comment fonctionne Boat4You</a> et rencontrez l\'<a href="/fr/about-us">équipe passionnée derrière votre aventure de navigation</a>.'),
    ('fr', _NUR_S, 'how-we-work">comment boat4you.com/about-us">', 'how-we-work">comment fonctionne Boat4You</a> et découvrez <a href="/fr/about-us">'),
    ('it', _GRI, 'Le schede dei catamarani su ' + _RAW_RIV, f'Le schede dei catamarani in <a href="{_RIV}">'),
    ('it', _DRAGE_M, 'per saperne di più su boat4you.com/faq">', 'per saperne di più su Boat4You, oppure consulta le nostre <a href="/it/faq">'),
    ('it', 'motorboat-charter-olympic-marina.html', 'esattamente questo. ' + _RAW_S, f'esattamente questo. Verifica la <a href="{_S}">'),
    ('it', _DRAGE_S, 'per capire come boat4you.com/faq">', 'per capire come funziona Boat4You, oppure consulta le nostre <a href="/it/faq">'),
    ('it', _PORT, 'come il team appassionato di boat4you.com/about-us</a>', 'come lavora il team appassionato di Boat4You</a>'),
    ('es', _OLY_C, 'en ' + _RAW_S + _RAW_S + 'catamaranes en la región de Atenas/Golfo Sarónico</a>', f'en <a href="{_S}">Boat4You</a>'),
    ('es', _GRI, 'Los listados de catamaranes de ' + _RAW_RIV, f'Los <a href="{_RIV}">listados de '),
    ('es', _DRAGE_S, 'cómo funciona boat4you.com/faq">FAQ</a> para preguntas específicas de navegación.',
     'cómo funciona Boat4You, o consulte nuestras <a href="/es/faq">preguntas frecuentes</a> sobre navegación.'),
    ('es', _PORT, 'cómo el apasionado equipo de boat4you.com/about-us detrás', 'cómo trabaja el apasionado equipo de Boat4You detrás'),
    ('pt', _GRI, 'As listagens de catamarãs da ' + _RAW_RIV, f'As listagens de catamarãs da <a href="{_RIV}">'),
    ('pt', 'lavrion-catamaran-charter.html', 'em ' + _RAW_S + 'frota de catamarãs na região de Atenas/Golfo Sarónico</a>', f'na <a href="{_S}">Boat4You</a>'),
    ('pt', _DRAGE_S, 'para entender como boat4you.com/faq">', 'para entender como funciona a Boat4You, ou consulte as nossas <a href="/pt/faq">'),
    ('pt', 'sailing-yacht-charter-marina-delta-kallithea.html', 'Visite ' + _RAW_S, f'Veja os <a href="{_S}">'),
    ('nl', _NUR_C, 'how-we-work">hoe boat4you.com/about-us">team toegewijd aan uitmuntendheid in zeilen op afgelegen locaties</a>',
     'how-we-work">hoe Boat4You werkt</a> en maak kennis met ons <a href="/nl/about-us">team, toegewijd aan uitmuntend zeilen op afgelegen locaties</a>'),
    ('nl', _GRI, 'De catamaranaanbiedingen op ' + _RAW_RIV, f'De catamaranaanbiedingen aan de <a href="{_RIV}">'),
    ('nl', 'kornati-motor-yacht-charter.html', 'how-we-work">hoe boat4you.com/faq">', 'how-we-work">hoe Boat4You werkt</a> en bekijk onze <a href="/nl/faq">'),
    ('nl', _DRAGE_M, 'om te leren hoe boat4you.com/faq">', 'om te leren hoe Boat4You werkt, of bekijk onze <a href="/nl/faq">'),
    ('nl', _DRAGE_S, 'om te begrijpen hoe boat4you.com/faq">', 'om te begrijpen hoe Boat4You werkt, of bekijk onze <a href="/nl/faq">'),
    ('nl', _PORT, '<a href="/nl/how-we-work">hoe het gepassioneerde team achter uw zeilavontuur</a> werkt op boat4you.com/about-us.',
     '<a href="/nl/how-we-work">hoe Boat4You werkt</a> en maak kennis met het <a href="/nl/about-us">gepassioneerde team achter uw zeilavontuur</a>.'),
    ('pl', _NUR_C, 'how-we-work">jak działa boat4you.com/about-us">zespół dedykowany doskonałości w żeglarstwie w odległych lokalizacjach</a>',
     'how-we-work">jak działa Boat4You</a> i poznaj nasz <a href="/pl/about-us">zespół oddany żeglarstwu w odległych lokalizacjach</a>'),
    ('pl', _GRI, 'Katamarany dostępne na ' + _RAW_RIV, f'Katamarany dostępne na <a href="{_RIV}">'),
    ('pl', 'motorboat-charter-brodogradiliste-filipi.html', '<p>Dowiedz się, jak działa boat4you.com/how-we-work">', '<p>Dowiedz się, jak działa Boat4You, w sekcji <a href="/pl/how-we-work">'),
    ('hr', _OLY_C, '. flota katamarana u regiji Atena/Saronik (https://www.' + _RAW_S + ' flota katamarana u regiji Atena/Saronik</a>',
     f'. Pregledajte <a href="{_S}">katamarane u regiji Atena/Saronik</a>'),
    ('hr', _PORT, 'how-we-work">kako tim boat4you.com/about-us">strastveni tim stoji iza Vaše jedriličarske avanture</a>',
     'how-we-work">kako radi Boat4You</a> i upoznajte <a href="/hr/about-us">strastveni tim koji stoji iza Vaše jedriličarske avanture</a>'),
]
PAGE_LABEL = {
    '/how-we-work': {'en': 'How We Work', 'de': 'Wie wir arbeiten', 'fr': 'Comment nous fonctionnons', 'it': 'Come lavoriamo',
                     'es': 'Cómo trabajamos', 'pt': 'Como trabalhamos', 'nl': 'Hoe wij werken', 'pl': 'Jak pracujemy', 'hr': 'Kako radimo'},
    '/about-us': {'en': 'About Us', 'de': 'Über uns', 'fr': 'À propos', 'it': 'Chi siamo', 'es': 'Sobre nosotros',
                  'pt': 'Sobre nós', 'nl': 'Over ons', 'pl': 'O nas', 'hr': 'O nama'},
    '/faq': {loc: 'FAQ' for loc in LOCALES},
}
RAW_URL_TAIL = re.compile(r'(?<![\w/"=.@-])(?:https?://)?(?:www\.)?boat4you\.com(?P<path>/[^\s"<>]*)">', re.I)
RAW_URL_TEXT = re.compile(r'(?<![\w/"=.@-])(?:https?://)?(?:www\.)?boat4you\.com(?P<path>/[^\s"<>]*)?(?P<label>\s*[—–]\s*[^<]*$)?', re.I)
PT_BRAND_PREP = re.compile(r'\b([Ee])m (<a\b[^>]*>)Boat4You')


def _in_anchor(body, pos):
    return body.rfind('<a ', 0, pos) > body.rfind('</a>', 0, pos)


def fix_raw_links(body, ctx):
    for locale, name, old, new in RAW_LINK_EDITS:
        if locale == ctx.locale and name == ctx.name:
            pattern = tolerant(old)
            if pattern.search(body):
                body = pattern.sub(lambda m: new, body, count=1)
                ctx.record('junk', old[:160], plain(new)[:160])

    def tail(m):
        new = f'<a href="{SITE}{m.group("path")}">'
        ctx.record('junk', m.group(0), new)
        return new

    body = RAW_URL_TAIL.sub(tail, body)
    out, pos = [], 0
    for tm in re.finditer(r'<[^>]+>|\Z', body):
        text = body[pos: tm.start()]
        closes = tm.group(0).startswith('</a')
        if 'boat4you.com' in text.lower():
            def visible(m, start=pos, text=text, closes=closes):
                if not m.group('path') and not re.match(r'https?:|www\.', m.group(0), re.I):
                    return m.group(0)  # the domain named as a word ("at boat4you.com") is fine
                path = (m.group('path') or '').rstrip('.,;:)')
                rest = (m.group('path') or '')[len(path):]
                inside = _in_anchor(body, start + m.start())
                # "boat4you.com/search — Volos catamarans</a>": the dash label goes too
                label_text = m.group('label') if (m.group('label') and inside and closes) else None
                if m.group('label') and not label_text:
                    rest += m.group('label')
                whole = inside and closes and not text[: m.start()].strip() and not text[m.end():].strip() and not label_text
                label = PAGE_LABEL.get(path.rstrip('/'), {}).get(ctx.locale) if whole else None
                label = label or 'Boat4You'
                new = label if inside else f'<a href="{SITE}{path}">{label}</a>'
                ctx.record('junk', m.group(0), new)
                return new + rest
            text = RAW_URL_TEXT.sub(visible, text)
        out.append(text)
        out.append(tm.group(0))
        pos = tm.end()
        if not tm.group(0):
            break
    body = ''.join(out)
    if ctx.locale == 'pt':
        body = PT_BRAND_PREP.sub(lambda m: ('N' if m.group(1) == 'E' else 'n') + 'a ' + m.group(2) + 'Boat4You', body)
    return body


def fix_junk(src, ctx):
    head, body, tail = split_body(src)
    body = fix_raw_links(body, ctx)

    def drop(m):
        ctx.record('junk', plain(m.group(0))[:160], '(removed)')
        return ''

    body = COPYRIGHT_BLOCK.sub(drop, body)
    body = NAV_BAR.sub(drop, body)

    def wrap(m):
        new = f'<a{m.group(1)}>{m.group(2)}</a>'
        ctx.record('junk', m.group(0)[:160], new)
        return new

    body = NESTED_WRAP.sub(wrap, body)
    body = unnest_anchors(body, ctx)

    # Placeholder links (href="#" or empty) lead nowhere: keep the text.
    def placeholder(m):
        ctx.record('junk', m.group(0)[:160], m.group(1))
        return m.group(1)

    body = PLACEHOLDER_LINK.sub(placeholder, body)

    # Cyrillic look-alike letters inside Latin words ("Eginе"): transliterated.
    def lookalike(m):
        new = m.group(0).translate(LOOKALIKE)
        ctx.record('junk', m.group(0), new)
        return new

    body = LATIN_WORD_WITH_CYRILLIC.sub(lookalike, body)
    if ctx.locale == 'en':
        for pattern, repl in BRAND_GAP_EN:
            def gap(m, repl=repl):
                new = m.expand(repl)
                ctx.record('junk', m.group(0), new)
                return new
            body = pattern.sub(gap, body)
    return head + body + tail


# -------------------------------------------------------------- operators

# Charter companies / agencies named in the texts (owner rule: a page never
# says which company owns or operates a boat). "Moorings" alone is a common
# noun (mooring buoys, German "Moorings"), so only "The Moorings", "Moorings
# Bahamas" and "Moorings" next to Sunsail count. "Ionian Catamarans" is a
# company in <title>s only; in body text it is the generic phrase.
OPERATOR = re.compile(
    r"\b(?:Sunsail|The Moorings|Moorings Bahamas|Dream Yacht(?: Charter)?|Sea Independent|Active Cruises|Odisej Ltd|"
    r"Kiriacoulis|Navigare Yachting|Pitter Yacht\w*|Neilson|Istion Yachting|Kufner|MarineMax|Horizon Yacht Charters|"
    r"Voyage Charters|Cruise Abaco|Nautilus Yachting|Ultra Sailing|Angelina Yachting|Sailing Holidays Ltd)\b"
    r"|(?<=Sunsail, )Moorings\b|(?<=Sunsail and )Moorings\b|(?<=Sunsail und )Moorings\b|(?<=Sunsail et )Moorings\b"
    r"|(?<=Sunsail e )Moorings\b|(?<=Sunsail y )Moorings\b|(?<=Sunsail en )Moorings\b|(?<=Sunsail i )Moorings\b"
    r"|\bMoorings(?=,? (?:and |und |et |e |y |en |i |oraz )?Sunsail)")
OPERATOR_TITLE = re.compile(r'\s*\|\s*Ionian Catamarans(?=\s*\|)')

# (locale, file, old text, new text). Old text is plain text as it reads on
# the page; whitespace and apostrophe entities are matched tolerantly.
_ALIMOS_C = 'catamaran-charter-athens-alimos-marina.html'
_ALIMOS_S = 'sailing-yacht-charter-athens-alimos-marina.html'
_ALIMOS_M = 'motor-yacht-charter-athens-alimos-marina.html'
_NANNY_C = 'catamaran-charter-bvi-tortola-nanny-cay-marina.html'
_NANNY_S = 'sailing-yacht-charter-bvi-tortola-nanny-cay-marina.html'
_CONCH = 'catamaran-charter-marsh-harbour-conch-inn-marina.html'
_SPLIT = 'split-region-sailing-area-yacht-charter-and-boat-rental.html'
OPERATOR_FIXES = [
    # --- en
    ('en', _ALIMOS_C, 'Alimos—Sunsail, Dream Yacht Charter, and Sea Independent—to deliver', 'Alimos to deliver'),
    ('en', _NANNY_C, ' (The Moorings, Sunsail, and numerous independent operators)', ''),
    ('en', _NANNY_C, 'from primary operators like The Moorings and Sunsail, complemented', 'from major international operators, complemented'),
    ('en', _NANNY_C, 'The Moorings operates extensively at Nanny Cay with particularly strong family-focused fleet management; Sunsail emphasises modern vessels with cutting-edge navigation systems; independent operators frequently maintain more specialised, personality-distinctive fleet selections.',
     'Larger operators focus on family-friendly layouts and recent models with up-to-date navigation, while independent operators often keep more specialised boats with a character of their own.'),
    ('en', _CONCH, 'home to The Moorings Bahamas fleet and one of the Caribbean\'s oldest charter operations', 'home to one of the Caribbean\'s oldest charter bases'),
    ('en', _ALIMOS_M, 'Charter companies like Sunsail, Dream Yacht Charter, and independent operators maintain', 'International and independent charter companies maintain'),
    ('en', _ALIMOS_S, 'With professional charter companies like Sunsail, Dream Yacht Charter, and Sea Independent managing fleets,', 'With professional charter companies managing the fleets,'),
    ('en', _NANNY_S, 'The Moorings and Sunsail operate extensive', 'Large international charter companies operate extensive'),
    ('en', _NANNY_S, 'The Moorings emphasises proven cruising designs prioritising safety and reliability; Sunsail maintains some sportier models appealing to sailors seeking enhanced performance; independent operators frequently maintain specialty vessels with distinctive personalities or unique historical significance.',
     'Some operators emphasise proven cruising designs that prioritise safety and reliability, others keep sportier models for sailors seeking more performance, and independent operators often maintain specialty boats with a distinctive character or history.'),
    ('en', _SPLIT, 'Charter companies like Sunsail, Moorings, and independent operators maintain', 'International and independent charter companies maintain'),
    # --- de
    ('de', _ALIMOS_C, 'in Alimos zusammen – Sunsail, Dream Yacht Charter und Sea Independent –, um', 'in Alimos zusammen, um'),
    ('de', _NANNY_C, ' (The Moorings, Sunsail und zahlreichen unabhängigen Betreibern)', ''),
    ('de', _NANNY_C, 'von Hauptbetreibern wie The Moorings und Sunsail, ergänzt', 'großer internationaler Betreiber, ergänzt'),
    ('de', _NANNY_C, 'The Moorings operiert umfangreich in Nanny Cay mit besonders starkem Familienflottenmanagement; Sunsail legt Wert auf moderne Schiffe mit modernsten Navigationssystemen; unabhängige Betreiber unterhalten oft spezialisiertere, charakterlich unterschiedliche Flottensauswahlen.',
     'Größere Betreiber setzen auf familienfreundliche Layouts und neue Modelle mit moderner Navigation, während unabhängige Betreiber oft spezialisiertere Boote mit eigenem Charakter anbieten.'),
    ('de', _CONCH, 'Heimat der Moorings Bahamas Flotte sowie einer der ältesten Charterbetriebe in der Karibik', 'Heimat einer der ältesten Charterbasen der Karibik'),
    ('de', _ALIMOS_M, 'Charterfirmen wie Sunsail, Dream Yacht Charter und unabhängige Betreiber halten', 'Internationale und unabhängige Charterfirmen halten'),
    ('de', _ALIMOS_S, 'Mit professionellen Charterunternehmen wie Sunsail, Dream Yacht Charter und Sea Independent, die Flotten verwalten,', 'Mit professionellen Charterunternehmen, die die Flotten verwalten,'),
    ('de', _NANNY_S, 'The Moorings und Sunsail betreiben umfangreiche', 'Große internationale Charterfirmen betreiben umfangreiche'),
    ('de', _NANNY_S, 'The Moorings legt Wert auf bewährte Fahrtenyacht-Designs, die Sicherheit und Zuverlässigkeit priorisieren; Sunsail unterhält einige sportlichere Modelle, die Segler mit gesteigerter Leistung ansprechen; unabhängige Betreiber pflegen häufig Spezialyachten mit unverwechselbarem Charakter oder einzigartiger historischer Bedeutung.',
     'Manche Betreiber setzen auf bewährte Fahrtenyachten mit Fokus auf Sicherheit und Zuverlässigkeit, andere auf sportlichere Modelle für leistungsorientierte Segler, und unabhängige Betreiber pflegen oft Spezialyachten mit unverwechselbarem Charakter oder besonderer Geschichte.'),
    ('de', _SPLIT, 'Charterunternehmen wie Sunsail, Moorings und unabhängige Betreiber unterhalten', 'Internationale und unabhängige Charterunternehmen unterhalten'),
    # --- fr
    ('fr', _ALIMOS_C, ' — Sunsail, Dream Yacht Charter et Sea Independent —', ''),
    ('fr', _NANNY_C, ' (The Moorings, Sunsail et de nombreux opérateurs indépendants)', ''),
    ('fr', _NANNY_C, 'des opérateurs principaux tels que The Moorings et Sunsail,', 'de grands opérateurs internationaux,'),
    ('fr', _NANNY_C, 'The Moorings opère largement à Nanny Cay avec une gestion de flotte particulièrement axée sur la famille ; Sunsail met l\'accent sur les navires modernes avec des systèmes de navigation de pointe ; les opérateurs indépendants maintiennent fréquemment des sélections de flotte plus spécialisées et distinctives.',
     'Les grands opérateurs misent sur des aménagements adaptés aux familles et des modèles récents dotés d\'une navigation moderne, tandis que les opérateurs indépendants proposent souvent des bateaux plus spécialisés, au caractère affirmé.'),
    ('fr', _CONCH, 'abritant la flotte de The Moorings Bahamas et l\'une des plus anciennes opérations de charter des Caraïbes', 'abritant l\'une des plus anciennes bases de charter des Caraïbes'),
    ('fr', _ALIMOS_M, 'Des sociétés de location comme Sunsail, Dream Yacht Charter et des opérateurs indépendants maintiennent', 'Des sociétés de location internationales et indépendantes maintiennent'),
    ('fr', _ALIMOS_S, 'Avec des sociétés de charter professionnelles comme Sunsail, Dream Yacht Charter et Sea Independent gérant leurs flottes,', 'Avec des sociétés de charter professionnelles qui gèrent les flottes,'),
    ('fr', _NANNY_S, 'The Moorings et Sunsail opèrent de vastes flottes', 'De grandes sociétés de charter internationales exploitent de vastes flottes'),
    ('fr', _NANNY_S, 'The Moorings met l\'accent sur des conceptions de croisière éprouvées privilégiant la sécurité et la fiabilité ; Sunsail maintient certains modèles plus sportifs attrayants pour les marins recherchant des performances accrues ; les opérateurs indépendants maintiennent fréquemment des navires spécialisés avec des personnalités distinctives ou une signification historique unique.',
     'Certains opérateurs privilégient des modèles de croisière éprouvés, axés sur la sécurité et la fiabilité, d\'autres des modèles plus sportifs pour les marins en quête de performance, et les opérateurs indépendants entretiennent souvent des bateaux spéciaux au caractère ou à l\'histoire uniques.'),
    ('fr', _SPLIT, 'Des compagnies de charter comme Sunsail, Moorings et des opérateurs indépendants maintiennent', 'Des compagnies de charter internationales et indépendantes maintiennent'),
    # --- it
    ('it', _ALIMOS_C, 'ad Alimos—Sunsail, Dream Yacht Charter e Sea Independent—per offrire', 'ad Alimos per offrire'),
    ('it', _NANNY_C, ' (The Moorings, Sunsail e numerosi operatori indipendenti)', ''),
    ('it', _NANNY_C, 'dei principali operatori come The Moorings e Sunsail,', 'dei principali operatori internazionali,'),
    ('it', _NANNY_C, 'The Moorings opera ampiamente a Nanny Cay con una gestione della flotta particolarmente focalizzata sulle famiglie; Sunsail enfatizza imbarcazioni moderne con sistemi di navigazione all\'avanguardia; gli operatori indipendenti mantengono spesso selezioni di flotta più specializzate e distintive.',
     'I grandi operatori puntano su layout adatti alle famiglie e modelli recenti con navigazione moderna, mentre gli operatori indipendenti offrono spesso barche più specializzate e dal carattere distintivo.'),
    ('it', _CONCH, 'sede della flotta The Moorings Bahamas e una delle più antiche operazioni di charter nei Caraibi', 'sede di una delle più antiche basi di charter dei Caraibi'),
    ('it', _ALIMOS_M, 'Compagnie di charter come Sunsail, Dream Yacht Charter e operatori indipendenti mantengono', 'Compagnie di charter internazionali e indipendenti mantengono'),
    ('it', _ALIMOS_S, 'Con compagnie di charter professionali come Sunsail, Dream Yacht Charter e Sea Independent che gestiscono flotte,', 'Con compagnie di charter professionali che gestiscono le flotte,'),
    ('it', _NANNY_S, 'The Moorings e Sunsail operano ampie flotte', 'Grandi compagnie di charter internazionali operano ampie flotte'),
    ('it', _NANNY_S, 'The Moorings enfatizza design da crociera comprovati che danno priorità alla sicurezza e all\'affidabilità; Sunsail mantiene alcuni modelli più sportivi che attraggono i velisti in cerca di prestazioni migliorate; gli operatori indipendenti mantengono frequentemente imbarcazioni speciali con personalità distintive o un significato storico unico.',
     'Alcuni operatori puntano su modelli da crociera collaudati, incentrati su sicurezza e affidabilità, altri su modelli più sportivi per chi cerca prestazioni, e gli operatori indipendenti mantengono spesso imbarcazioni speciali dal carattere o dalla storia unici.'),
    ('it', _SPLIT, 'Compagnie di noleggio come Sunsail, Moorings e operatori indipendenti mantengono', 'Compagnie di noleggio internazionali e indipendenti mantengono'),
    # --- es
    ('es', _ALIMOS_C, ' —Sunsail, Dream Yacht Charter y Sea Independent—', ''),
    ('es', _NANNY_C, ' (The Moorings, Sunsail y numerosos operadores independientes)', ''),
    ('es', _NANNY_C, 'de operadores principales como The Moorings y Sunsail,', 'de grandes operadores internacionales,'),
    ('es', _NANNY_C, 'The Moorings opera extensamente en Nanny Cay con una gestión de flotas especialmente centrada en la familia; Sunsail enfatiza embarcaciones modernas con sistemas de navegación de vanguardia; los operadores independientes a menudo mantienen selecciones de flotas más especializadas y distintivas.',
     'Los grandes operadores apuestan por distribuciones pensadas para familias y modelos recientes con navegación moderna, mientras que los operadores independientes suelen ofrecer barcos más especializados y con carácter propio.'),
    ('es', _CONCH, 'hogar de la flota de The Moorings Bahamas y una de las operaciones de alquiler más antiguas del Caribe', 'hogar de una de las bases de chárter más antiguas del Caribe'),
    ('es', _ALIMOS_M, 'Empresas de chárter como Sunsail, Dream Yacht Charter y operadores independientes mantienen', 'Empresas de chárter internacionales e independientes mantienen'),
    ('es', _ALIMOS_S, 'Con compañías de chárter profesionales como Sunsail, Dream Yacht Charter y Sea Independent gestionando flotas,', 'Con compañías de chárter profesionales gestionando las flotas,'),
    ('es', _NANNY_S, 'The Moorings y Sunsail operan extensas flotas', 'Grandes compañías de chárter internacionales operan extensas flotas'),
    ('es', _NANNY_S, 'The Moorings enfatiza diseños de crucero probados que priorizan la seguridad y la confiabilidad; Sunsail mantiene algunos modelos más deportivos que atraen a navegantes que buscan un rendimiento mejorado; los operadores independientes frecuentemente mantienen embarcaciones especializadas con personalidades distintivas o un significado histórico único.',
     'Algunos operadores priorizan diseños de crucero probados, centrados en la seguridad y la fiabilidad, otros modelos más deportivos para quienes buscan rendimiento, y los operadores independientes suelen mantener embarcaciones especiales con un carácter o una historia únicos.'),
    ('es', _SPLIT, 'Compañías de alquiler como Sunsail, Moorings y operadores independientes mantienen', 'Compañías de alquiler internacionales e independientes mantienen'),
    # --- pt
    ('pt', _ALIMOS_C, ' — Sunsail, Dream Yacht Charter e Sea Independent —', ''),
    ('pt', _NANNY_C, ' (The Moorings, Sunsail e inúmeros operadores independentes)', ''),
    ('pt', _NANNY_C, 'dos principais operadores como The Moorings e Sunsail,', 'dos principais operadores internacionais,'),
    ('pt', _NANNY_C, 'The Moorings opera extensivamente em Nanny Cay com uma gestão de frota particularmente forte focada em famílias; Sunsail enfatiza embarcações modernas com sistemas de navegação de ponta; operadores independentes mantêm frequentemente seleções de frota mais especializadas e distintas.',
     'Os grandes operadores apostam em layouts pensados para famílias e modelos recentes com navegação moderna, enquanto os operadores independentes oferecem muitas vezes barcos mais especializados e com carácter próprio.'),
    ('pt', _CONCH, 'sede da frota The Moorings Bahamas e uma das mais antigas operações de aluguer do Caribe', 'sede de uma das mais antigas bases de charter do Caribe'),
    ('pt', _ALIMOS_M, 'Companhias de aluguer como Sunsail, Dream Yacht Charter e operadores independentes mantêm', 'Companhias de aluguer internacionais e independentes mantêm'),
    ('pt', _ALIMOS_S, 'Com empresas de aluguer profissionais como Sunsail, Dream Yacht Charter e Sea Independent a gerir frotas,', 'Com empresas de aluguer profissionais a gerir as frotas,'),
    ('pt', _NANNY_S, 'The Moorings e Sunsail operam extensas frotas', 'Grandes empresas de charter internacionais operam extensas frotas'),
    ('pt', _NANNY_S, 'The Moorings enfatiza designs de cruzeiro comprovados que priorizam segurança e fiabilidade; Sunsail mantém alguns modelos mais desportivos que apelam a velejadores que procuram desempenho aprimorado; operadores independentes mantêm frequentemente embarcações especializadas com personalidades distintas ou significado histórico único.',
     'Alguns operadores privilegiam projetos de cruzeiro comprovados, centrados na segurança e na fiabilidade, outros modelos mais desportivos para quem procura desempenho, e os operadores independentes mantêm frequentemente embarcações especiais com carácter ou história únicos.'),
    ('pt', _SPLIT, 'Companhias de aluguer como Sunsail, Moorings e operadores independentes mantêm', 'Companhias de aluguer internacionais e independentes mantêm'),
    # --- nl
    ('nl', _ALIMOS_C, ' - Sunsail, Dream Yacht Charter en Sea Independent -', ''),
    ('nl', _NANNY_C, ' (The Moorings, Sunsail en talrijke onafhankelijke operators)', ''),
    ('nl', _NANNY_C, 'van belangrijke operators zoals The Moorings en Sunsail,', 'van grote internationale operators,'),
    ('nl', _NANNY_C, 'The Moorings opereert uitgebreid in Nanny Cay met bijzonder sterke, gezinsgerichte vlootmanagement; Sunsail benadrukt moderne vaartuigen met geavanceerde navigatiesystemen; onafhankelijke operators onderhouden vaak meer gespecialiseerde, persoonlijk onderscheidende vlootselecties.',
     'Grotere operators kiezen voor gezinsvriendelijke indelingen en recente modellen met moderne navigatie, terwijl onafhankelijke operators vaak meer gespecialiseerde boten met een eigen karakter aanbieden.'),
    ('nl', _CONCH, 'de thuisbasis van de vloot van The Moorings Bahamas en een van de oudste charteroperaties in het Caribisch gebied', 'de thuisbasis van een van de oudste charterbases in het Caribisch gebied'),
    ('nl', _ALIMOS_M, 'Charterbedrijven zoals Sunsail, Dream Yacht Charter en onafhankelijke exploitanten hanteren', 'Internationale en onafhankelijke charterbedrijven hanteren'),
    ('nl', _ALIMOS_S, 'Met professionele charterbedrijven zoals Sunsail, Dream Yacht Charter en Sea Independent die vloten beheren,', 'Met professionele charterbedrijven die de vloten beheren,'),
    ('nl', _NANNY_S, 'The Moorings en Sunsail exploiteren uitgebreide', 'Grote internationale charterbedrijven exploiteren uitgebreide'),
    ('nl', _NANNY_S, 'The Moorings legt de nadruk op bewezen cruisingsontwerpen die veiligheid en betrouwbaarheid prioriteren; Sunsail onderhoudt enkele sportievere modellen die zeilers aanspreken die op zoek zijn naar verbeterde prestaties; onafhankelijke operators onderhouden vaak gespecialiseerde vaartuigen met een onderscheidend karakter of unieke historische betekenis.',
     'Sommige operators kiezen voor beproefde cruiseontwerpen met de nadruk op veiligheid en betrouwbaarheid, andere voor sportievere modellen voor zeilers die prestaties zoeken, en onafhankelijke operators onderhouden vaak bijzondere schepen met een eigen karakter of geschiedenis.'),
    ('nl', _SPLIT, 'Charterbedrijven zoals Sunsail, Moorings en onafhankelijke exploitanten onderhouden', 'Internationale en onafhankelijke charterbedrijven onderhouden'),
    # --- pl
    ('pl', _ALIMOS_C, ' – Sunsail, Dream Yacht Charter i Sea Independent –', ''),
    ('pl', _NANNY_C, ' (The Moorings, Sunsail i wielu niezależnych operatorów)', ''),
    ('pl', _NANNY_C, 'od głównych operatorów, takich jak The Moorings i Sunsail,', 'dużych międzynarodowych operatorów,'),
    ('pl', _NANNY_C, 'The Moorings działa szeroko w Nanny Cay, z szczególnie silnym zarządzaniem flotą zorientowaną na rodziny; Sunsail kładzie nacisk na nowoczesne jednostki z najnowocześniejszymi systemami nawigacyjnymi; niezależni operatorzy często utrzymują bardziej wyspecjalizowane, odróżniające się charakterem floty.',
     'Więksi operatorzy stawiają na układy przyjazne rodzinom i nowe modele z nowoczesną nawigacją, a niezależni operatorzy często oferują bardziej wyspecjalizowane jednostki o wyrazistym charakterze.'),
    ('pl', _CONCH, 'będąc domem dla floty The Moorings Bahamas i jednej z najstarszych operacji czarterowych na Karaibach', 'będąc jedną z najstarszych baz czarterowych na Karaibach'),
    ('pl', _ALIMOS_M, 'Firmy czarterowe takie jak Sunsail, Dream Yacht Charter i niezależni operatorzy utrzymują', 'Międzynarodowe i niezależne firmy czarterowe utrzymują'),
    ('pl', _ALIMOS_S, ', takimi jak Sunsail, Dream Yacht Charter i Sea Independent zarządzającymi flotami,', ' zarządzającymi flotami'),
    ('pl', _NANNY_S, 'The Moorings i Sunsail operują rozległymi flotami', 'Duże międzynarodowe firmy czarterowe operują rozległymi flotami'),
    ('pl', _NANNY_S, 'The Moorings kładzie nacisk na sprawdzone projekty turystyczne priorytetyzujące bezpieczeństwo i niezawodność; Sunsail utrzymuje niektóre modele bardziej sportowe, przemawiające do żeglarzy poszukujących zwiększonej wydajności; niezależni operatorzy często utrzymują specjalistyczne jednostki o charakterystycznej osobowości lub unikalnym znaczeniu historycznym.',
     'Niektórzy operatorzy stawiają na sprawdzone jachty turystyczne, w których liczy się bezpieczeństwo i niezawodność, inni na bardziej sportowe modele dla żeglarzy szukających osiągów, a niezależni operatorzy często utrzymują wyjątkowe jednostki o wyrazistym charakterze lub historii.'),
    ('pl', _SPLIT, 'Firmy czarterowe, takie jak Sunsail, Moorings i niezależni operatorzy, utrzymują', 'Międzynarodowe i niezależne firmy czarterowe utrzymują'),
    # --- hr
    ('hr', _ALIMOS_C, 'u Alimosu—Sunsail, Dream Yacht Charter i Sea Independent—kako', 'u Alimosu kako'),
    ('hr', _NANNY_C, ' (The Moorings, Sunsail i brojnim neovisnim operaterima)', ''),
    ('hr', _NANNY_C, 'glavnih operatera poput The Moorings i Sunsail,', 'velikih međunarodnih operatera,'),
    ('hr', _NANNY_C, 'The Moorings opsežno djeluje u Nanny Cayu s posebno jakim upravljanjem flotom usmjerenom na obitelj; Sunsail naglašava moderne plovila s najsuvremenijim navigacijskim sustavima; neovisni operateri često održavaju specijaliziranije, osobno prepoznatljive odabire flote.',
     'Veći operateri nude obiteljima prilagođene rasporede i novije modele sa suvremenom navigacijom, dok neovisni operateri često održavaju specijaliziranija plovila prepoznatljiva karaktera.'),
    ('hr', _CONCH, 'dom floti The Moorings Bahamas i jednoj od najstarijih charter operacija na Karibima', 'dom jedne od najstarijih charter baza na Karibima'),
    ('hr', _ALIMOS_M, 'Čarter tvrtke poput Sunsail, Dream Yacht Charter i neovisni operateri održavaju', 'Međunarodne i neovisne čarter tvrtke održavaju'),
    ('hr', _ALIMOS_S, 'S profesionalnim čarter tvrtkama poput Sunsail, Dream Yacht Charter i Sea Independent koje upravljaju flotama,', 'S profesionalnim čarter tvrtkama koje upravljaju flotama,'),
    ('hr', _NANNY_S, 'The Moorings i Sunsail upravljaju opsežnim flotama', 'Velike međunarodne charter tvrtke upravljaju opsežnim flotama'),
    ('hr', _NANNY_S, 'The Moorings naglašava provjerene dizajne za krstarenje koji daju prednost sigurnosti i pouzdanosti; Sunsail održava neke sportskije modele koji privlače jedriličare koji traže poboljšane performanse; neovisni operateri često održavaju specijalizirana plovila s prepoznatljivim osobinama ili jedinstvenim povijesnim značajem.',
     'Neki operateri naglašavaju provjerene brodove za krstarenje koji daju prednost sigurnosti i pouzdanosti, drugi sportskije modele za jedriličare koji traže bolje performanse, a neovisni operateri često održavaju specijalizirana plovila prepoznatljiva karaktera ili povijesti.'),
    ('hr', _SPLIT, 'Charter tvrtke poput Sunsail, Moorings i neovisni operateri održavaju', 'Međunarodne i neovisne charter tvrtke održavaju'),
]
TITLE_FIXES = {
    ('en', 'catamaran-charter-paleros.html'): ('Ionian Catamarans', 'Ionian Sea'),
    ('nl', 'catamaran-charter-paleros.html'): ('Ionian Catamarans', 'Ionische Zee'),
    ('pt', 'catamaran-charter-paleros.html'): ('Ionian Catamarans', 'Mar Jónico'),
}


def fix_operators(src, ctx):
    head, body, tail = split_body(src)
    for locale, name, old, new in OPERATOR_FIXES:
        if locale != ctx.locale or name != ctx.name:
            continue
        pattern = tolerant(old)
        if pattern.search(body):
            body = pattern.sub(lambda m: new, body, count=1)
            ctx.record('operators', old, new or '(removed)')
    fix = TITLE_FIXES.get((ctx.locale, ctx.name))
    if fix and fix[0] in head:
        head = head.replace(fix[0], fix[1])
        ctx.record('operators', fix[0], fix[1], 'title/meta')

    # Fallback: any other sentence naming a charter company goes.
    if not OPERATOR.search(body):
        return head + body + tail

    def block(tag, attrs, inner):
        if not OPERATOR.search(plain(inner)):
            return inner
        new, dropped = drop_sentences(inner, lambda t: bool(OPERATOR.search(t)))
        for d in dropped:
            ctx.record('operators', d[:200], '(sentence removed)')
        return new if plain(new) else None

    body = edit_blocks(body, block)
    return head + body + tail


# ----------------------------------------------------------------- inland

# Sea charter only. HARD terms are inland boating in any context (houseboats,
# canal boats, the Canal du Midi …); SOFT terms (river navigation) are fine
# where a sea yacht sails up an estuary — Krka to Skradin, the Rance to
# Dinan, the Ombla at Komolac, the Magra, Empuriabrava's Fluvià.
RIVER_HARD = {
    'all': r"house-?boat\w*|(?-i:Sile)|Treviso\w* (?:river|Fluss|fiume|rivier)\w*|canal[- ]?boats?|canal[- ]cruis\w*|Canal du Midi|Canal d['’]Ille-et-Rance|Ille-et-Rance|"
           r"Canal de (?:la Marne|Nantes|Garonne|Bourgogne|Briare)\w*|Nantes[- ]Brest|narrowboats?|barge cruis\w*|"
           r"lock[- ]keepers?|Le Boat|Nicols|Linssen|Pénichette|IJsselmeer|Sile River|river Sile|fiume Sile|"
           r"Casale sul Sile|Niderviller|Marne au Rhin|canal (?:network|system)s?",
    'de': r"Hausboot\w*|Kanalboot\w*|Kanalkreuzfahrt\w*|Kanalsystem\w*",
    'fr': r"péniches?|bateaux?[- ]habitables?|coches? de plaisance|tourisme fluvial",
    'it': r"barche? da canale",
    'es': r"barcos? vivienda|barcos? de canal|sistemas? de canales",
    'pt': r"barcos?[- ]casa|barcos? de canal",
    'nl': r"woonbo(?:o)?t\w*|kanaalboten|kanaalboot|kanaalsysteem\w*",
    'pl': r"łodzi\w* mieszkaln\w*|łód\w* mieszkaln\w*|domy na wodzie|domach na wodzie|Kana\w* Południow\w*|system\w* kanałów",
    'hr': r"kuć\w* na vodi|brod\w*[- ]kuć\w*|kanalsk\w* brod\w*|brodic\w* za kanale|sustav\w* kanala",
}
RIVER_SOFT = {
    'all': r"inland waterways?|river cruis\w*|inland rivers?|river (?:navigation|channels?|cruisers?|corridor|systems?)|"
           r"canals and waterways|interconnected canals|towards? Treviso|lagoon and river",
    'de': r"Flusskreuzfahrt\w*|Binnenflüss\w*|Flusskanäl\w*|Flusskreuzer\w*|Flussnavigation|Binnenwasserstra\w*|Flusssystem\w*|"
          r"vernetzte Kanäle|Richtung Treviso",
    'fr': r"croisières? fluviales?|navigation fluviale|voies navigables intérieures|rivières intérieures|canaux fluviaux|"
          r"navigation en lagune et fluviale|croiseurs fluviaux|canaux et (?:les )?voies navigables interconnectés|vers Trévise",
    'it': r"crociere? fluviali?|navigazione fluviale|vie navigabili interne|fiumi interni|canali fluviali|navigazione lagunare e fluviale|"
          r"barche fluviali|imbarcazioni fluviali|corsi d'acqua interconnessi|verso Treviso",
    'es': r"cruceros? fluviales?|navegación fluvial|vías (?:navegables|fluviales) interiores|ríos interiores|canales fluviales|"
          r"navegación en lagunas y ríos|casas? flotantes?|vías fluviales interconectadas|hacia Treviso",
    'pt': r"cruzeiros? fluviais|cruzeiro fluvial|navegação fluvial|vias navegáveis interiores|rios interiores|canais fluviais|"
          r"navegação em lagoas e rios|casas? flutuantes?|vias navegáveis interligadas|direção a Treviso",
    'nl': r"riviercruise\w*|binnenwater\w*|rivierkanal\w*|rivier\w*corridor|navigatie in lagunes en rivieren|verbonden kanalen|richting Treviso",
    'pl': r"rejs\w* rzeczn\w*|śródlądow\w* drog\w* wodn\w*|rzekami w głąb lądu|kanały rzeczne|krążownik\w* rzeczn\w*|"
          r"nawigacji po lagunach i rzekach|połączone kanały|kierunku Treviso",
    'hr': r"riječn\w* krstarenj\w*|unutarnj\w* plovn\w* put\w*|unutarnjim rijekama|kanale rijeka|riječn\w* brodic\w*|"
          r"navigaciju u lagunama i rijekama|povezane kanale|prema Trevisu",
}
RIVER_ALLOW = re.compile(r'Krka|Skradin|Šibenik|Sibenik|Zaton|Prokljan|Ombla|Komolac|Rijeka Dubrova\w*|Fluvi[aà]|Empuriabrava|Magra|Rance|Ebro|Neretva', re.I)


@functools.lru_cache(maxsize=None)
def _river_rx(locale, which):
    table = RIVER_HARD if which == 'hard' else RIVER_SOFT
    parts = [table['all']] + ([table[locale]] if locale != 'en' and table.get(locale) else [])
    return re.compile(r'(?i)(?<!\w)(?:' + '|'.join(parts) + r')(?!\w)')


def river_hit(text, locale):
    if _river_rx(locale, 'hard').search(text):
        return True
    return bool(_river_rx(locale, 'soft').search(text)) and not RIVER_ALLOW.search(text)


def _river_any(text, locale):
    return bool(_river_rx(locale, 'hard').search(text) or _river_rx(locale, 'soft').search(text))


def fix_inland(src, ctx):
    head, body, tail = split_body(src)
    loc = ctx.locale
    if not _river_any(body, loc):
        return src
    body = remove_sections(body, lambda h: river_hit(h, loc), ctx, 'inland')

    def block(tag, attrs, inner):
        text = plain(inner)
        if not _river_any(text, loc):
            return inner
        if tag == 'li' or tag.startswith('h'):
            if not river_hit(text, loc):
                return inner
            ctx.record('inland', text[:200], f'(<{tag}> removed)')
            return None
        new, dropped = drop_sentences(inner, lambda t: river_hit(t, loc))
        for d in dropped:
            ctx.record('inland', d[:200], '(sentence removed)')
        return new if plain(new) else None

    body = edit_blocks(body, block)
    return head + body + tail


# ---------------------------------------------------------------- claims2

# Boat4You is a booking platform: the boats belong to charter companies.
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
BLOCK_OPEN = re.compile(r'<(?:p|li|h[1-6]|td|dd|blockquote)\b[^>]*>')


def at_sentence_start(src, pos):
    opens = list(BLOCK_OPEN.finditer(src, max(0, pos - 3000), pos))
    start = opens[-1].end() if opens else max(0, pos - 3000)
    text = re.sub(r'<[^>]+>', '', src[start:pos])
    return not text.strip() or bool(re.search(r'[.!?:]\s*$', text))


def _cap(word, upper):
    return word[:1].upper() + word[1:] if upper else word


# "our fleet" → "our partners' fleet". Words between the possessive and the
# noun must be adjectives (no preposition), so "notre sélection de flotte"
# or "our fleet team" are left alone; "Boat4You" in between is dropped.
_MID_STOP = (r"of|Partners|Partnernetzwerk|partnernetwerk|network|sieć|mreža|réseau|rete|red|rede|de|di|da|du|des|del|della|van|von|od|z|ze|iz|the|la|le|les|a|e|and|und|et|y|en|i|oraz|for|für|"
             r"pour|per|para|voor|dla|za|with|mit|avec|con|com|met|s|sa|na|w|we|u|op|in|im|au|al|ao|do|entire|partners|partner")
_SEP = r"(?:\s|</?(?:strong|em|b|a)\b[^>]*>)+"
_MID = rf"(?P<mid>(?:{_SEP}(?!(?:{_MID_STOP})\b)[\w’'-]+){{0,2}}?)(?P<sep>{_SEP})"
# EN allows one more modifier ("our complete Sardinia catamaran fleet")
_MID_EN = rf"(?P<mid>(?:{_SEP}(?!(?:{_MID_STOP})\b)[\w’'-]+){{0,3}}?)(?P<sep>{_SEP})"
FLEET_MOD_NOUNS = r'team|teams|coordinator|coordinators|specialists?|experts?|partners?|database|operations'


def _mid(m):
    """Words between the possessive and the noun, tags kept, "Boat4You" dropped."""
    mid = re.sub(r'\s*(?:<strong>)?\bBoat4You\b(?:</strong>)?', '', m.group('mid'))
    return mid + m.group('sep')


def _cap_first_text(fragment):
    """Upper-case the first letter outside tags."""
    out, in_tag = list(fragment), False
    for i, ch in enumerate(out):
        if ch == '<':
            in_tag = True
        elif ch == '>':
            in_tag = False
        elif not in_tag and ch.isalpha():
            out[i] = ch.upper()
            break
    return ''.join(out)


def _de_article(m):
    ending = m.group('e') or ''
    art = {'': 'die', 'e': 'die', 'er': 'der', 'en': 'den' if m.group('n').lower().endswith('flotten') else 'der'}[ending]
    return _cap(art, m.group('u') == 'U')


def _it_article(m):
    return m.group('art') or _cap('la' if m.group('g') == 'a' else 'le', m.group('n0') == 'N')


def _es_article(m):
    return m.group('art') or _cap('las' if m.group('pl') else 'la', m.group('n0') == 'N')


# PT: the article folds into the preposition before "nossa" ("de nossa frota"
# → "da frota dos nossos parceiros").
_PT_ART = {'a': 'a', 'da': 'da', 'na': 'na', 'à': 'à', 'pela': 'pela', 'de': 'da', 'em': 'na', 'por': 'pela',
           'com a': 'com a', 'para a': 'para a', 'com': 'com a', 'para': 'para a'}


def _pt_article(m):
    pre = m.group('pre') or ''
    art = _PT_ART[pre.lower()] if pre else 'a'
    if m.group('pl'):
        art += 's'
    if (pre and pre[:1].isupper()) or (not pre and m.group('n0') == 'N'):
        art = art[:1].upper() + art[1:]
    return art


# locale: (pattern, article/prefix(m), phrase appended after the noun)
OUR_FLEET = {
    'en': (re.compile(rf"\b(?P<o>[Oo])ur(?P<own>\s+own)?{_MID_EN}(?P<n>[Ff]leets?)\b(?!\s+(?:{FLEET_MOD_NOUNS})\b)"),
           lambda m: f"{m.group('o')}ur {'Partners' if m.group('n')[0] == 'F' else 'partners'}'", ''),
    'de': (re.compile(rf"\b(?P<u>[Uu])nser(?P<e>e|er|en)?{_MID}(?P<n>[\w-]*?[Ff]lotten?)\b(?!\s+unserer\s+Partner)"), _de_article, ' unserer Partner'),
    'fr': (re.compile(rf"\b(?P<n0>[Nn])(?P<pl>otre|os){_MID}(?P<n>[Ff]lottes?)\b"),
           lambda m: _cap('la' if m.group('pl') == 'otre' else 'les', m.group('n0') == 'N'), ' de nos partenaires'),
    'it': (re.compile(rf"\b(?:(?P<art>[Ll]a|[Dd]ella|[Nn]ella|[Aa]lla|[Dd]alla|[Ss]ulla|[Ll]e|[Dd]elle|[Nn]elle|[Aa]lle|[Dd]alle|[Ss]ulle)\s+)?(?P<n0>[Nn])ostr(?P<g>[ae]){_MID}(?P<n>[Ff]lott[ae])\b"),
           _it_article, ' dei nostri partner'),
    'es': (re.compile(rf"\b(?:(?P<art>[Ll]as?)\s+)?(?P<n0>[Nn])uestra(?P<pl>s?){_MID}(?P<n>[Ff]lotas?)\b"),
           _es_article, ' de nuestros socios'),
    'pt': (re.compile(rf"\b(?:(?P<pre>com a|para a|[Dd]a|[Nn]a|[Àà]|[Pp]ela|[Dd]e|[Ee]m|[Pp]or|[Cc]om|[Pp]ara|[Aa])\s+)?(?P<n0>[Nn])ossa(?P<pl>s?){_MID}(?P<n>[Ff]rotas?)\b"),
           _pt_article, ' dos nossos parceiros'),
    'nl': (re.compile(rf"\b(?P<o>[Oo])nze{_MID}(?P<n>\w*[Vv]loot|\w*[Vv]loten)\b(?!\s+van\s+onze\s+partners)"),
           lambda m: _cap('de', m.group('o') == 'O'), ' van onze partners'),
    'pl': (re.compile(rf"\b(?P<n0>[Nn])asz(?:a|ej|ą|ych|ymi|e|ym){_MID}(?P<n>[Ff]lot(?:a|y|ę|ą|cie|om|ami|ach)|[Ff]locie)\b"),
           lambda m: '', ' naszych partnerów'),
    'hr': (re.compile(rf"\b(?P<n0>[Nn])aš(?:a|e|u|oj|om|im|ih|ega|em)?{_MID}(?P<n>[Ff]lot(?:a|e|u|i|om|ama))\b"),
           lambda m: '', ' naših partnera'),
}


# "la flota de nuestros socios de catamaranes" → "la flota de catamaranes de
# nuestros socios": the partner phrase goes after the fleet's complement when
# the complement is a plain boat noun (whitelisted, so a verb, a number or a
# place name after the noun never moves).
_END = r"(?=[\s,.;:!?<])"
FLEET_REORDER = {
    'de': re.compile(r"(?P<n>\bFlotten?)(?P<p> unserer Partner)(?P<c> von (?:[A-Z][\wäöüß]+-)?(?:Segelyachten|Katamaranen|Booten|Motorjachten|Motorbooten|Motoryachten|Yachten|Einrumpfbooten|Einrumpfseglern|Einrumpfyachten|Zweirumpfbooten|Gulets))" + _END),
    'fr': re.compile(r"(?P<n>\b[Ff]lottes?)(?P<p> de nos partenaires)(?P<c> de (?:yachts à moteur|bateaux à moteur|catamarans(?: à moteur)?|voiliers(?: de croisière)?|bateaux|monocoques|vedettes|navires|goélettes|gulets|yachts|motorsailers))" + _END, re.I),
    'it': re.compile(r"(?P<n>\b[Ff]lott[ae])(?P<p> dei nostri partner)(?P<c> di (?:yacht a vela|yacht a motore|barche a vela|monoscafi a vela|catamarani(?: a motore)?|motoscafi|imbarcazioni|barche|monoscafi|caicchi|gulet|yacht))" + _END, re.I),
    'es': re.compile(r"(?P<n>\b[Ff]lotas?)(?P<p> de nuestros socios)(?P<c> de (?:yates de vela|yates a motor|lanchas a motor|lanchas motoras|catamaranes(?: a motor)?|veleros|lanchas|embarcaciones|barcos|monocascos|goletas|yates|gulets))" + _END, re.I),
    'pt': re.compile(r"(?P<n>\b[Ff]rotas?)(?P<p> dos nossos parceiros)(?P<c> de (?:iates a motor|lanchas a motor|barcos a motor|catamarãs|catamarans|veleiros|lanchas|embarcações|barcos|monocascos|goletas|gulets|iates))" + _END, re.I),
    'nl': re.compile(r"(?P<n>\b[Vv]lo(?:ot|ten))(?P<p> van onze partners)(?P<c> van (?:(?:moderne|premium) )?(?:zeiljachten|motorjachten|motorboten|catamarans|zeilboten|schepen|vaartuigen|jachten|boten|monohulls))" + _END),
    'pl': re.compile(r"(?P<n>\b[Ff]lo[tc]\w*)(?P<p> naszych partnerów)(?P<c> (?:(?:nowoczesnych|luksusowych) )?(?:jachtów żaglowych|jachtów motorowych|katamaranów(?: motorowych)?|motorówek|jednokadłubowców|dwukadłubowców|guletów|żaglowców|statków|jachtów|łodzi))" + _END),
    'hr': re.compile(r"(?P<n>\b[Ff]lot\w*)(?P<p> naših partnera)(?P<c> (?:(?:modernih|motornih|jednotrupnih|samotrupnih|dvotrupnih) )?(?:katamarana|jedrilica|jahti|brodova|brodica|plovila|guleta))" + _END),
}


def our_fleet_replacement(locale, m):
    _, prefix_fn, suffix = OUR_FLEET[locale]
    prefix = prefix_fn(m)
    rest = _mid(m) + m.group('n') + suffix
    if locale == 'en' and m.group('own'):
        rest = re.sub(r'^\s*own\b', '', rest)
    if not prefix:
        rest = rest.lstrip()
        return _cap_first_text(rest) if m.group('n0') == 'N' else rest
    return prefix + rest


BRAND_POSS_BOATS_EN = re.compile(
    r"(?:<strong>)?\bBoat4You(?:</strong>)?['’]s(?P<sep>(?:\s|<a\b[^>]*>)+)(?P<mods>(?:(?!partner|network|team|platform|search|website)[\w-]+\s+){0,3}?)"
    r"(?P<n>boats|yachts|catamarans|vessels|monohulls|motorboats|gulets|sailboats|motorsailers|fleets?)\b(?!\s+(?:search|listings?|page|section|guide|specialists?|team)\b)")
BRAND_BOATS_EN = re.compile(
    r"\b(?P<q>(?:[Aa]ll|[Mm]odern|[Mm]ost|[Mm]any|[Oo]ur|[Tt]he|[Ee]xperienced)\s+(?:(?:modern|new|experienced)\s+)?)?(?:<strong>|<a\b[^>]*>)?Boat4You(?:</strong>|</a\s*>)?\s+"
    r"(?P<n>(?:sailing |motor |power |luxury |charter |monohull |catamaran )?(?:monohulls|catamarans|yachts|motorboats|gulets|boats|vessels|motor yachts|sailing yachts|fleet|crews))\b(?P<poss>['’](?!s))?")

# "la flotta di catamarani di Boat4You", "die Boat4You-Flotte", "Boat4You
# flota": Boat4You as the owner of a fleet → our partners.
_B = r"(?:<strong>|<a\b[^>]*>)?Boat4You(?:</strong>|</a\s*>)?"
BRAND_FLEET = {
    'de': [(re.compile(rf"(\b(?:[\w-]*[Ff]lotten?)(?:\s+von\s+[\w-]+)?)\s+von\s+{_B}(?![\w-])"), r"\1 unserer Partner"),
           (re.compile(rf"(?<!über )(?<!bei )(?<!mit )(?<!auf )(?<!via )\b{_B}\s+(Flotten?|Katamarane|Segelyachten|Yachten|Motoryachten|Motorboote|Boote)\b"), r"\1 unserer Partner"),
           (re.compile(rf"\b{_B}-(Flotten?|Katamarane|Segelyachten|Yachten|Motoryachten|Motorboote|Boote)\b"), r"\1 unserer Partner"),
           (re.compile(r"\b([Uu])nsere\s+((?:Flotten?|Katamarane|Segelyachten|Yachten|Motoryachten|Motorboote|Boote)\s+unserer\s+Partner)\b"), lambda m: ('Die ' if m.group(1) == 'U' else 'die ') + m.group(2)),
           (re.compile(r"\b([Uu])nserer\s+((?:Flotten?)\s+unserer\s+Partner)\b"), lambda m: ('Der ' if m.group(1) == 'U' else 'der ') + m.group(2))],
    'fr': [(re.compile(rf"\b(catamarans|voiliers|bateaux|yachts|vedettes)\s+{_B}\s+(modernes|récents|récentes)\b"), r"\1 \2 de nos partenaires"),
           (re.compile(rf"(\b[Ff]lottes?(?:\s+de\s+[\w'-]+(?:\s+à\s+moteur)?)?)\s+de\s+{_B}(?![\w-])"), r"\1 de nos partenaires"),
           (re.compile(rf"\b(catamarans|voiliers|bateaux|yachts|vedettes)\s+{_B}(?![\w-])"), r"\1 de nos partenaires"),
           (re.compile(rf"(\b[Ff]lottes?)\s+{_B}(?![\w-])"), r"\1 de nos partenaires")],
    'it': [(re.compile(rf"(\b[Ff]lott[ae](?:\s+(?:di\s+[\w'-]+|velica|a\s+motore)(?:\s+a\s+(?:vela|motore))?)?)\s+di\s+{_B}(?![\w-])"), r"\1 dei nostri partner"),
           (re.compile(rf"(\b[Ff]lott[ae])\s+(?:da\s+)?{_B}(?![\w-])"), r"\1 dei nostri partner"),
           (re.compile(rf"\b(catamarani|yacht|barche|imbarcazioni|velieri|monoscafi)\s+{_B}(?![\w-])"), r"\1 dei nostri partner")],
    'es': [(re.compile(rf"(\b[Ff]lotas?)\s+de\s+nuestros\s+socios\s+de\s+{_B}(?![\w-])"), r"\1 de nuestros socios"),
           (re.compile(rf"(\b[Ff]lotas?(?:\s+de\s+[\w-]+(?:\s+(?:motoras|de\s+vela|a\s+motor))?)?(?:</a\s*>)?)\s+de\s+{_B}(?![\w-])"), r"\1 de nuestros socios"),
           (re.compile(rf"(\b[Ff]lotas?)\s+{_B}(?![\w-])"), r"\1 de nuestros socios"),
           (re.compile(rf"\b(catamaranes|yates|veleros|barcos|embarcaciones)\s+{_B}(?![\w-])"), r"\1 de nuestros socios")],
    'pt': [(re.compile(rf"(\b[Ff]rotas?(?:\s+de\s+[\w-]+(?:\s+a\s+motor)?)?)\s+da\s+{_B}(?![\w-])"), r"\1 dos nossos parceiros"),
           (re.compile(rf"(\b[Ff]rotas?)\s+(?:de\s+)?{_B}(?![\w-])"), r"\1 dos nossos parceiros"),
           (re.compile(rf"\b(catamarãs|iates|veleiros|barcos|embarcações)(</a\s*>)?\s+(?:da\s+)?{_B}(?![\w-])"), lambda m: m.group(1) + (m.group(2) or '') + ' dos nossos parceiros')],
    'nl': [(re.compile(rf"(\b\w*[Vv]lo(?:ot|ten)(?:\s+van\s+[\w-]+)?)\s+van\s+{_B}(?![\w-])"), r"\1 van onze partners"),
           (re.compile(rf"(?<!via )(?<!bij )(?<!met )(?<!op )\b{_B}\s+(vloot|vloten|catamarans|katamarans|jachten|zeiljachten|motorboten|motorjachten|motorcatamarans|boten|schepen|[Zz]eiljachten|[Cc]atamarans)\b"), lambda m: m.group(1).lower() + ' van onze partners'),
           (re.compile(rf"\b{_B}-(vloot|vloten|catamarans|jachten|zeiljachten|motorboten|motorjachten)\b"), r"\1 van onze partners"),
           (re.compile(r"\b([Oo])nze\s+((?:vloot|vloten|catamarans|jachten|zeiljachten|motorboten|motorjachten)\s+van\s+onze\s+partners)\b"), lambda m: ('De ' if m.group(1) == 'O' else 'de ') + m.group(2))],
    'pl': [(re.compile(rf"\b([Kk]atamarany|[Kk]atamaranów|[Jj]achty|[Jj]achtów|[Łł]odzie|[Łł]odzi|[Jj]ednostki|[Jj]ednostek)\s+{_B}(?![\w-])"), r"\1 naszych partnerów"),
           (re.compile(rf"(\b[Ff]lot\w*(?:</a\s*>)?(?:\s+(?:<strong>)?[\wąćęłńóśźż]+(?:ów|ych|ich|i)(?:</strong>)?){{0,2}})\s+{_B}(?![\w-])"), r"\1 naszych partnerów")],
    'hr': [(re.compile(r"\b([Nn])aš\s+vozni\s+park(?P<c>\s+(?:katamarana|jedrilica|jahti|brodova|plovila|brodica))?\b"),
            lambda m: _cap('vozni park', m.group(1) == 'N') + (m.group('c') or '') + ' naših partnera'),
           (re.compile(rf"\b([Kk]atamarana|[Kk]atamarani|[Jj]edrilica|[Jj]edrilice|[Jj]ahti|[Jj]ahte|[Bb]rodova|[Pp]lovila)\s+{_B}(?:a|u)?(?![\w-])"), r"\1 naših partnera"),
           (re.compile(rf"(\b[Ff]lot\w*(?:</a\s*>)?(?:\s+(?:<strong>)?[\wčćđšž]+(?:a|ih)(?:</strong>)?){{0,2}})\s+{_B}(?![\w-])"), r"\1 naših partnera"),
           (re.compile(r"(\b[Ff]lot\w*)\s+(?:<strong>)?Boat4You(?:a|u|om|e)(?:</strong>)?\b"), r"\1 naših partnera"),
           (re.compile(rf"\b{_B}(?:ova|ove|ovu|ovoj|ovom)?\s+(flot\w*)\b"), r"\1 naših partnera")],
}


def _keep_close_tags(old, new):
    """A replacement that swallowed the </a> or </strong> of an element
    opened before the match gives it back (at the end of the new text)."""
    for tag in ('a', 'strong'):
        surplus = (len(re.findall(rf'</{tag}\s*>', old)) - len(re.findall(rf'<{tag}\b', old))) - \
                  (len(re.findall(rf'</{tag}\s*>', new)) - len(re.findall(rf'<{tag}\b', new)))
        new += f'</{tag}>' * max(0, surplus)
    return new

BRAND_BEFORE_BOATS = re.compile(
    r'<strong>\s*(Boat4You)\s*</strong>(?=[\s-]+[A-Za-zÀ-ž]*(?:[Ff]lotten?|[Ff]leets?|[Vv]loot|[Kk]atamarane|[Cc]atamarans|[Yy]achten|[Yy]achts|[Jj]achten|[Bb]oote|[Bb]oats|[Bb]oten)\b)')


# Strong operator verbs: Boat4You never operates boats or charters.
OPERATE = {
    'en': r'operates(?!\s+as\b)',
    'de': r'betreibt',
    'fr': r'(?:exploite|opère)(?!\s+(?:comme|en\s+tant\s+que)\b)',
    'it': r'opera(?!\s+come\b)',
    'es': r'opera(?!\s+como\b)',
    'pt': r'opera(?!\s+como\b)',
    'nl': r'exploiteert',
    'pl': r'prowadzi(?=\s+(?:czarter\w*|baz\w*|flot\w*|jednost\w*|operacj\w*|działalność\s+czarter\w*))|operuje(?=\s+(?:\w+\s+){0,2}?(?:jacht\w*|katamaran\w*|łodzi\w*|jednost\w*|flot\w*))',
    'hr': r'(?:posluje|operira)(?!\s+kao\b)',
}
# "Boat4You manages catamaran fleets / obsługuje kilka katamaranów / gestisce
# la più grande flotta": managing or operating boats is the partners' job.
# Choosing boats for a guest ("fleet selection", "wyborem") and handling
# charters/bookings stay with Boat4You.
_MANAGE_SKIP = (r"(?!(?:selection|selections|selezione|scelta|selección|sélection|selectie|keuze|wyborem|wybór|seleção|odabir\w*|"
                r"charters?|czarter\w*|noleggi\w*|locations?|alquiler\w*|aluguer\w*|verhuur\w*|najm\w*|bookings?|rezerwacj\w*|"
                r"logistics|logistyk\w*|every|each|all)\b)")


def _manage(verb, nouns, words=3):
    return verb + r"(?=\s+(?:" + _MANAGE_SKIP + r"[\w'’-]+\s+){0," + str(words) + r"}?" + nouns + r")"


MANAGE = {
    'en': _manage(r'manages', r"(?:fleets?|boats|yachts|catamarans|vessels)\b(?!\s+selection)"),
    'de': _manage(r'verwaltet', r"\w*(?:[Ff]lotten?|[Bb]oote|[Yy]achten|[Kk]atamarane)\b"),
    'fr': _manage(r'gère', r"(?:flottes?|bateaux|yachts|voiliers|catamarans)\b"),
    'it': _manage(r'gestisce', r"(?:flott[ae]|imbarcazioni|barche|yacht|catamarani|velieri)\b", 4),
    'es': _manage(r'gestiona', r"(?:flotas?|barcos|yates|veleros|catamaranes|embarcaciones)\b"),
    'pt': _manage(r'gere', r"(?:frotas?|barcos|iates|veleiros|catamarãs|embarcações)\b"),
    'nl': _manage(r'(?:opereert|beheert)', r"\w*(?:vloot|vloten|catamarans|jachten|boten)\b", 4),
    'pl': _manage(r'(?:zarządza|obsługuje|dysponuje)', r"(?:flot\w*|katamaran\w*|\w*jacht\w*|łodzi\w*|łodzie|jednost\w*)", 5),
    'hr': _manage(r'upravlja', r"(?:flot\w*|brodov\w*|jaht\w*|katamaran\w*|plovil\w*)"),
}
# "die Katamarane von Boat4You", "los yates de Boat4You", "jachty żaglowe
# Boat4You": the translations of "Boat4You's catamarans", which the EN pass
# turned into "catamarans on Boat4You". Same here: the boats are listed on
# Boat4You, they are not its own.
_B4Y = r"(?P<b>(?:<[Ss]trong>)?Boat4You(?:</[Ss]trong>)?)(?!['’]s|\w|-)"
_C = r"(?P<c>(?:</[Ss]trong>)?)"
BOATS_OF_BRAND = {
    'de': (r"\b(?P<noun>[\w-]*(?:[Yy]achten|[Jj]achten|[Kk]atamarane|[Bb]oote|Gulets|Schiffe|Einrumpfer|Monohulls))" + _C + r"\s+von\s+" + _B4Y, r"\g<noun>\g<c> auf \g<b>"),
    'fr': (r"\b(?P<noun>(?:catamarans|voiliers|bateaux|yachts|monocoques|navires|goélettes|gulets|vedettes)(?:\s+(?:à\s+(?:moteur|voile)|monocoques|de\s+luxe))?)" + _C + r"\s+de\s+" + _B4Y, r"\g<noun>\g<c> sur \g<b>"),
    'it': (r"\b(?P<noun>(?:catamarani|barche|yacht|imbarcazioni|velieri|monoscafi|motoscafi|caicchi|gulet)(?:\s+a\s+(?:vela|motore))?)" + _C + r"\s+(?:di\s+|della\s+)?" + _B4Y
           + r"(?!\s+(?:offre|propone|mette|è|ha|gestisce|consente|fornisce|garantisce|vi|ti|Le|può|dispone|seleziona|collabora|verifica|organizza|si)\b)", r"\g<noun>\g<c> su \g<b>"),
    'es': (r"\b(?P<noun>(?:catamaranes|yates|veleros|barcos|embarcaciones|monocascos|goletas|lanchas|guletas)(?:\s+(?:de\s+vela|a\s+motor|de\s+lujo))?)" + _C + r"\s+de\s+(?:la\s+)?" + _B4Y, r"\g<noun>\g<c> en \g<b>"),
    'pt': (r"\b(?P<noun>(?:catamarãs|iates|veleiros|barcos|embarcações|monocascos|goletas|lanchas)(?:\s+(?:à\s+vela|a\s+motor|de\s+luxo))?)" + _C + r"\s+(?:da|de|do)\s+" + _B4Y, r"\g<noun>\g<c> na \g<b>"),
    'nl': (r"\b(?P<noun>(?:\w*jachten|catamarans|\w*boten|schepen|gulets|vaartuigen|monohulls))" + _C + r"\s+van\s+" + _B4Y, r"\g<noun>\g<c> op \g<b>"),
    'pl': (r"\b(?P<noun>(?:jachty|jachtów|katamarany|katamaranów|łodzie|łodzi|jednostki|jednostek|motorówki|motorówek|gulety|guletów)(?:\s+(?:żaglowe|żaglowych|motorowe|motorowych))?)" + _C + r"\s+" + _B4Y, r"\g<noun>\g<c> na \g<b>"),
    'hr': (r"\b(?P<noun>(?:jedrilice|jedrilica|katamarani|katamarana|brodovi|brodova|plovila|jahte|jahti|guleti|guleta)(?:\s+(?:na\s+jedra|motorne|motornih))?)" + _C + r"\s+" + _B4Y, r"\g<noun>\g<c> na \g<b>"),
}
# "Every Boat4You sailing yacht", "Uw Boat4You zeiljacht", "Boat4You
# jedrilice imaju": the brand used as the boats' owner. It goes — "every
# sailing yacht", "uw zeiljacht" — except in the booking sense ("Boat4You
# catamaran charter"). DE/NL only after a determiner, so a subordinate clause
# ("dass Boat4You Katamarane anbietet") keeps its subject.
_MOD_B4Y = r"(?:<strong>)?Boat4You(?:</strong>)?\s+"
BRAND_MODIFIER = {
    'en': (r"(?<![\w/.-])" + _MOD_B4Y + r"(?=(?:sailing\s+|motor\s+|power\s+|luxury\s+|crewed\s+|bareboat\s+)?(?:yachts?|catamarans?|boats?|vessels?|gulets?|monohulls?|motorboats?|multihulls?|fleets?)\b"
           r"(?!\s+(?:charters?|rentals?|search|listings?|page|guide|options|holidays?|vacations?|experiences?|trips?|bookings?|adventures?|hire|clients?|guests?|customers?)\b))"),
    'nl': (r"(?P<det>\b(?:[Ee]en|[Dd]e|[Hh]et|[Uu]w|[Ee]lk|[Ee]lke|[Vv]eel|[Aa]lle|[Oo]nze|meeste|typisch|[Dd]eze|[Ee]nkele)\s)" + _MOD_B4Y
           + r"(?=(?:\w*jachten|\w*jacht|catamarans?|catamaranvlo\w+|\w*boten|\w*boot|schepen|vaartuigen|gulets?|vloot)\b)"),
    'de': (r"(?P<det>\b(?:[Ee]ine?|[Dd]ie|[Dd]er|[Dd]as|[Ii]hre?|[Jj]ede[rs]?|[Vv]iele|[Aa]lle|[Uu]nsere|meisten|typische[rn]?)\s)" + _MOD_B4Y
           + r"(?=(?:[\w-]*[Yy]achte?n?|[Kk]atamarane?|[Bb]oote?|Gulets?|Flotte)\b)"),
    'hr': (r"(?<!\bda\s)(?<!\bšto\s)(?<!\bjer\s)(?<!\bkako\s)(?<![\w/.-])" + _MOD_B4Y
           + r"(?=(?:jedrilic\w*|katamaran\w*|brodov\w*|brodic\w*|plovil\w*|jaht\w*|gulet\w*|motorn\w+\s+jaht\w*|flot\w*)\b)"),
    'pl': (r"(?<![\w/.-])" + _MOD_B4Y + r"(?=(?:jacht\w*|katamaran\w*|łodzi\w*|łodzie|jednost\w*|flot\w*)\b(?!\s+(?:z|od|w)\b))"),
}
# "maintained to Boat4You's rigorous standards", "nach den Standards von
# Boat4You gewartet": the upkeep standards are the operators'; the brand goes.
STANDARDS_OF_BRAND = {
    'en': (r"(?<![\w>])(?:<strong>)?Boat4You(?:</strong>)?['’]s\s+(?P<s>(?:[\w-]+\s+)?standards)\b", r"\g<s>"),
    'de': (r"(?P<s>\b\w*[Ss]tandards)\s+von\s+(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
    'fr': (r"(?P<s>\bnormes(?:\s+\w+)?|\bstandards(?:\s+\w+)?)\s+(?:de\s+)?(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
    'it': (r"(?P<s>\bstandard(?:\s+\w+)?)\s+(?:(?:di|della)\s+)?(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
    'es': (r"(?P<s>\bestándares(?:\s+\w+)?|\bnormas(?:\s+\w+)?)\s+de\s+(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
    'pt': (r"(?P<s>\bpadrões(?:\s+\w+)?|\bnormas(?:\s+\w+)?)\s+(?:(?:da|de|do)\s+)?(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
    'nl': (r"(?P<s>\bnormen|\bstandaarden)\s+van\s+(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
    'pl': (r"(?P<s>\bstandard(?:ami|ów|y)(?:\s+\w+)?)\s+(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
    'hr': (r"(?P<s>\bstandard(?:ima|a|e)(?:\s+\w+)?)\s+(?:<strong>)?Boat4You(?:</strong>)?(?![\w-])", r"\g<s>"),
}
# Superlative fleet claims that come with it ("the largest catamaran fleet in
# the region") — nobody can verify them.
FLEET_SUPERLATIVE = {
    'it': [(r"\bla più grande flotta\b", "un'ampia flotta"), (r"\bla flotta più grande\b", "un'ampia flotta")],
    'pl': [(r"\bnajlepszą flotą\b", "starannie dobraną flotą"), (r"\bnajwiększą flotą\b", "dużą flotą")],
    'en': [(r"\bthe largest (catamaran |yacht |sailing yacht |motor yacht )?fleet\b", r"a large \1fleet")],
}
# Upkeep / inspection promises only the charter company can make.
UPKEEP = {
    'en': r"(?:maintains|enforces|upholds|applies|inspects|services|repairs)\s+(?:(?:rigorous|strict|stringent|exacting|high|the highest)\s+(?:\w+\s+){0,2}standards|every\s+(?:vessel|boat|yacht)|each\s+(?:vessel|boat|yacht)|backup\s+sails|rapid-response\s+repair|dedicated\s+berths|preferred\s+berths|specialist\s+river)",
    'de': r"(?:hält|unterhält|pflegt|wahrt|wartet|inspiziert|prüft)\s+(?:(?:strenge|rigorose|hohe|höchste)\s+(?:\w+\s+)?\w*[Ss]tandards|jedes\s+(?:Boot|Schiff|Yacht))",
    'fr': r"(?:maintient|applique|impose|entretient|inspecte)\s+(?:des\s+normes\s+(?:rigoureuses|strictes|élevées)|des\s+standards\s+(?:rigoureux|stricts|élevés)|chaque\s+(?:bateau|navire|yacht))",
    'it': r"(?:mantiene|applica|ispeziona)\s+(?:(?:rigorosi|elevati|severi)\s+standard|standard\s+(?:rigorosi|elevati|severi)|norme\s+(?:rigorose|severe)|ogni\s+(?:imbarcazione|barca|yacht))",
    'es': r"(?:mantiene|aplica|inspecciona)\s+(?:(?:rigurosos|estrictos|elevados)\s+estándares|estándares\s+(?:rigurosos|estrictos|elevados)|normas\s+(?:rigurosas|estrictas)|cada\s+(?:embarcación|barco|yate))",
    'pt': r"(?:mantém|aplica|inspeciona)\s+(?:(?:rigorosos|elevados)\s+padrões|padrões\s+(?:rigorosos|elevados|rígidos)|normas\s+(?:rigorosas|rígidas)|cada\s+(?:embarcação|barco|iate))",
    'nl': r"(?:handhaaft|hanteert|onderhoudt|inspecteert)\s+(?:(?:strenge|hoge|rigoureuze)\s+\w*normen|(?:strenge|hoge)\s+\w*standaarden|elk\s+(?:schip|jacht|vaartuig)|elke\s+boot)",
    'pl': r"(?:utrzymuje|stosuje|kontroluje|sprawdza)\s+(?:(?:rygorystyczne|wysokie|surowe)\s+standardy|każd\w+\s+(?:jednostk\w+|jacht\w*|łód\w*))",
    'hr': r"(?:održava|primjenjuje|pregledava|provjerava)\s+(?:(?:rigorozne|stroge|visoke)\s+standarde|svak\w+\s+(?:plovil\w+|brod\w*|jaht\w+))",
}
_NOT_SUBJECT = re.compile(r"\b(?:how|why|where|wie|warum|comment|come|cómo|como|hoe|jak|kako|with|by|at|for|through|via|mit|von|bei|für|über|durch|avec|par|chez|pour|con|per|di|da|por|para|com|met|door|bij|voor|van|przez|dla|od|z|ze|u|s|sa|kod|za|preko|on|op|auf|sur|su|en|na|in)\s+(?:(?:a|la|le|el|o)\s+|l['’])?$", re.I)


def _not_subject(before):
    return bool(_NOT_SUBJECT.search(' ' + before))

PRIORITY_BERTH = {
    'en': r"priority\s+berth\w*(?:\s+(?:allocation|assignments?|placement|availability|access))?|preferred\s+berths|preferential\s+berth\w*|priority\s+access\s+to\s+(?:premium\s+)?berths",
    'de': r"bevorzugte\w*\s+Liegepl\w*",
    'fr': r"(?:un\s+|l['’])?amarrage\s+prioritaire\w*|places?\s+(?:d['’]amarrage\s+)?prioritaires?",
    'it': r"(?:l['’])?ormegg\w*\s+(?:prioritari\w*|preferenziali|privilegiati)|posti\s+barca\s+prioritari|priorità\s+(?:negli|di|per\s+l['’]|all['’])\s*ormegg\w*",
    'es': r"amarres?\s+(?:prioritari\w*|preferenciales|privilegiados)|lugares\s+privilegiados|prioridad\s+(?:de|en\s+el)\s+amarre",
    'pt': r"(?:ancoradouros|lugares|atracação|atracações)\s+(?:prioritári\w*|privilegiad\w*)|prioridade\s+(?:de|na)\s+atracação",
    'nl': r"prioritaire\s+ligplaats\w*|prioriteit\s*ligplaats\w*|voorrang\s+bij\s+(?:de\s+)?ligplaats\w*",
    'pl': r"priorytetow\w*\s+(?:miejsc\w*|cumowani\w*|przydział\w*)(?:\s+\w+)?|pierwszeństw\w*\s+(?:w\s+|przy\s+)?(?:cumowani\w*|miejsc\w*)",
    'hr': r"prioritetn\w*\s+(?:vez\w*|dodjel\w*\s+vezova|pristup\s+vrhunskim\s+vezovima|vezivanj\w*)",
}
AND = {'en': 'and', 'de': 'und', 'fr': 'et', 'it': 'e', 'es': 'y', 'pt': 'e', 'nl': 'en', 'pl': 'i', 'hr': 'i'}
# "…, ensuring priority berths for charterers." — the participle clause goes.
PARTICIPLE = {
    'en': r'ensuring|guaranteeing|securing|providing|meaning',
    'de': r'gewährleistet|garantiert|sichert|um',
    'fr': r'garantissant|assurant|offrant',
    'it': r'garantendo|assicurando|offrendo',
    'es': r'garantizando|asegurando|ofreciendo',
    'pt': r'garantindo|assegurando|oferecendo',
    'nl': r'zorgt\s+voor|garandeert|wat\s+zorgt\s+voor',
    'pl': r'zapewniając|gwarantując',
    'hr': r'osiguravajući|jamčeći|jamči|osigurava',
}
FOUNDED = re.compile(r'\b((?:since|seit|depuis|dal|desde|sinds|od)\s+)(2008|2007|2010|2011|2012)\b')
CLAIM_EXACT = {
    'en': [('For operators like Boat4You managing large fleets,', 'For charter operators managing large fleets,')],
}


def _drop_priority_berth(piece, locale):
    """Remove the promise from one sentence piece; None when the sentence has
    to go as a whole."""
    pb = PRIORITY_BERTH[locale]
    conj = AND[locale]
    tail = r"(?:\s+[\w-]+){0,2}?"
    for pattern in (
        rf"(?:{pb}){tail},\s+",                              # first/middle list item
        rf"(?:{pb}){tail}\s+{conj}\s+",                      # "A and B" → "B"
        rf",\s+(?:{conj}\s+)?(?:{pb}){tail}(?=\s*[.;]|\s*$)",  # last list item
        rf"\s+{conj}\s+(?:{pb})",                            # "B and A …" → "B …"
        rf",\s+(?:{PARTICIPLE[locale]})\s+(?:{pb})[^,.;<]*(?=[.;])",  # ", ensuring priority berths for all."
    ):
        new, n = re.subn(pattern, '', piece, count=1, flags=re.I)
        if n and plain(new) != plain(piece) and len(plain(new).split()) >= 4:
            if locale == 'en':
                # "ensuring A, and B" left with two items: no serial comma
                new = re.sub(rf"\b((?:{PARTICIPLE['en']})\s+[^,.;]+),\s+and\s+(?=[^,]*[.;]?\s*$)", r"\1 and ", new)
            return new
    return None


# "our catamarans / unsere Katamarane / nos voiliers": boats Boat4You would
# own. Plural boat nouns only (a guest's "our yacht" in an FAQ stays); search
# pages, specialists, charters … after the noun are ours ("our catamaran
# search"). The partner phrase follows the noun, the article follows the
# language ("die Katamarane unserer Partner", "les voiliers de nos
# partenaires", "i catamarani dei nostri partner").
_EN_BOAT = r'catamarans|yachts|vessels|boats|monohulls|motorboats|gulets|sailboats|motorsailers|superyachts'
_EN_NOT_HEAD = r'(?:search|specialists?|experts?|charters?|listings?|inventory|collection|portal|packages?|page|guide|section|team|brokers?|crews?|skippers?)\b'
OUR_BOATS = {
    'en': re.compile(rf"\b(?P<o>[Oo])ur\s+(?!partner)(?P<tag>(?:<a\b[^>]*>)?)(?P<mods>(?:(?!(?:of|for|and|or|to|in|at|with|from|the|a|an|own|partner|partners)\b)[\w-]+\s+){{0,3}}?)"
                     rf"(?P<n>{_EN_BOAT})\b(?!\s+{_EN_NOT_HEAD})"),
    'de': re.compile(r"\b(?P<u>[Uu])nser(?P<e>e|en|er)\s+(?P<tag>(?:<a\b[^>]*>)?)(?P<mods>(?:(?:[a-zäöüß][\w-]*|\d+)\s+){0,2}?)"
                     r"(?P<n>(?:[A-ZÄÖÜ\d][\w-]*?)?(?:[Kk]atamaranen?|[Yy]achten|[Jj]achten|[Bb]ooten?|[Ss]chiffen?|Gulets))\b(?!\s+unserer\s+Partner)(?!\s+[a-zäöüß]\w*ende[nrs]?\b)"),
    'fr': re.compile(r"(?:(?P<pre>\b[Dd]e|\b[Àà])\s+)?\b(?P<n0>[Nn])os\s+(?P<tag>(?:<a\b[^>]*>)?)(?P<mods>(?:(?!(?:de|du|des|à|au|aux|en|et|pour|avec|sur|dans|les|la|le|partenaires)\b)[a-zàâçéèêëîïôûùüÿœ][\w-]*\s+|\d+\s+){0,2}?)"
                     r"(?P<n>(?:catamarans|voiliers|yachts|bateaux|navires|vedettes|gulets|goélettes|monocoques|unités|embarcations)(?:\s+à\s+(?:moteur|voile|double coque))?)\b(?!\s+de\s+nos\s+partenaires)"),
    'it': re.compile(r"(?P<art>\b(?:[Ii]|[Ll]e|[Gg]li|[Dd]ei|[Dd]elle|[Dd]egli|[Aa]i|[Aa]lle|[Aa]gli|[Nn]ei|[Nn]elle|[Nn]egli|[Ss]ui|[Ss]ulle|[Ss]ugli|[Dd]ai|[Dd]alle|[Dd]agli|[Cc]on\s+i|[Cc]on\s+le|[Pp]er\s+i|[Pp]er\s+le|[Tt]ra\s+i|[Tt]ra\s+le|[Ff]ra\s+i|[Ff]ra\s+le)\s+)nostr[ie]\s+(?P<tag>(?:<a\b[^>]*>)?)"
                     r"(?P<mods>(?:(?!(?:di|del|della|dei|delle|da|in|a|e|con|per|su|tra|fra|il|la|le|gli|i|partner)\b)[a-zàèéìòù][\w-]*\s+|\d+\s+){0,2}?)"
                     r"(?P<n>(?:catamarani|yacht|barche|imbarcazioni|velieri|monoscafi|motoscafi|caicchi|gulet|golette)(?:\s+a\s+(?:motore|vela|doppio scafo))?)\b(?!\s+dei\s+nostri\s+partner)"),
    'es': re.compile(r"(?P<pre>\b(?:[Dd]e|[Aa]|[Ee]n|[Cc]on|[Pp]or|[Pp]ara|[Ee]ntre|[Ss]obre|[Dd]esde|[Tt]odos|[Tt]odas)\s+)?\b(?P<n0>[Nn])uestr(?P<g>[oa])s\s+(?P<tag>(?:<a\b[^>]*>)?)"
                     r"(?P<mods>(?:(?!(?:de|del|en|a|y|con|para|por|la|el|los|las|socios)\b)[a-záéíóúñ][\w-]*\s+|\d+\s+){0,2}?)"
                     r"(?P<n>(?:catamaranes|yates|veleros|barcos|embarcaciones|lanchas|goletas|gulets|monocascos|motoveleros)(?:\s+(?:a motor|de vela|de doble casco))?)\b(?!\s+de\s+nuestros\s+socios)"),
    'pt': re.compile(r"(?:(?P<art>\b(?:[Oo]s|[Aa]s|[Dd]os|[Dd]as|[Nn]os|[Nn]as|[Aa]os|[Àà]s|[Pp]elos|[Pp]elas|[Tt]odos\s+os|[Tt]odas\s+as))\s+)?\b(?P<n0>[Nn])oss(?P<g>[oa])s\s+(?P<tag>(?:<a\b[^>]*>)?)"
                     r"(?P<mods>(?:(?!(?:de|da|do|dos|das|em|na|no|a|e|com|para|por|o|os|as|parceiros)\b)[a-záâãéêíóôõúç][\w-]*\s+|\d+\s+){0,2}?)"
                     r"(?P<n>(?:catamarãs|catamarans|iates|veleiros|barcos|embarcações|lanchas|goletas|gulets|monocascos)(?:\s+(?:a motor|à vela|de dois cascos))?)\b(?!\s+dos\s+nossos\s+parceiros)"),
    'nl': re.compile(r"\b(?P<o>[Oo])nze\s+(?P<tag>(?:<a\b[^>]*>)?)(?P<mods>(?:(?!(?:van|voor|met|in|op|de|het|en|partners?)\b)(?:[A-Za-z][\w-]*|\d+)\s+){0,2}?)"
                     r"(?P<n>\w*(?:catamarans|jachten|boten|schepen|vaartuigen|gulets|monohulls|eenrompers))\b(?!\s+van\s+onze\s+partners)"),
    'pl': re.compile(r"\b(?P<n0>[Nn])asz(?:e|ych|ymi|ym|ymi)\s+(?P<tag>(?:<a\b[^>]*>)?)(?P<mods>(?:(?!(?:w|z|na|do|dla|i|oraz|od|po|przez|partnerów|partnera)\b)[a-ząćęłńóśźż][\w-]*\s+|\d+\s+){0,2}?)"
                     r"(?P<n>katamarany|katamaranów|katamaranami|katamaranach|jachty|jachtów|jachtami|jachtach|łodzie|łodzi|łodziami|jednostki|jednostek|jednostkami|motorówki|motorówek|gulety|guletów|żaglówki|żaglówek)"
                     r"(?P<post>(?:\s+(?:żaglow|motorow|czarterow)\w*)?)\b(?!\s+naszych\s+partnerów)"),
    'hr': re.compile(r"\b(?P<n0>[Nn])aš(?:i|ih|im|e|ima|a)\s+(?P<tag>(?:<a\b[^>]*>)?)(?P<mods>(?:(?!(?:u|za|na|od|do|i|s|sa|iz|po|partnera)\b)[a-zčćđšž][\w-]*\s+|\d+\s+){0,2}?)"
                     r"(?P<n>katamarani|katamarane|katamarana|katamaranima|jahte|jahti|jahtama|jedrilice|jedrilica|jedrilicama|brodovi|brodove|brodova|brodovima|plovila|plovilima|gulete|guleta|guletama|brodice|brodica|brodicama)\b(?!\s+naših\s+partnera)"),
}

# "our Marina di Cagliari fleet": a place name with a lower-case particle
OUR_PLACE_EN = re.compile(rf"\b([Oo])ur\s+((?:[A-Z][\w’'-]*\s+(?:(?:di|de|del|della|da|dei|la|le|of)\s+)?){{1,4}})(fleets?|{_EN_BOAT})\b(?!\s+{_EN_NOT_HEAD})")

# "notre gestion de flotte", "our catamaran base", "os nossos gestores de
# frota": fleet operations that belong to the charter company.
FLEET_ROLE = {
    'fr': [(r"\b([Nn])otre\s+(gestion de (?:la )?flotte|coordinateur de flotte|base de (?:catamarans|voiliers|bateaux))", lambda m: _cap('la', m.group(1) == 'N') + ' ' + m.group(2) + ' de nos partenaires'),
           (r"\bde\s+nos\s+(skippers de flotte|gestionnaires de flotte)", lambda m: 'des ' + m.group(1) + ' de nos partenaires'),
           (r"(?<!de )\b([Nn])os\s+(gestionnaires de flotte|opérations de (?:catamarans|voiliers)|skippers de flotte)", lambda m: _cap('les', m.group(1) == 'N') + ' ' + m.group(2) + ' de nos partenaires')],
    'it': [(r"\b([Ll]a)\s+nostra\s+(gestione della flotta|base di (?:catamarani|barche a vela))", lambda m: m.group(1) + ' ' + m.group(2) + ' dei nostri partner'),
           (r"\b([Ii])\s+nostri\s+(gestori (?:della|di) flotta|responsabili della flotta)", lambda m: m.group(1) + ' ' + m.group(2) + ' dei nostri partner'),
           (r"\bdei\s+nostri\s+(skipper di flotta)", lambda m: 'degli ' + m.group(1) + ' dei nostri partner'),
           (r"\b(con la|alla|della|dalla|nella)\s+nostra\s+(base di (?:catamarani|barche a vela))", lambda m: m.group(1) + ' ' + m.group(2) + ' dei nostri partner')],
    'es': [(r"\b([Nn])uestros\s+(gestores de flota|patrones de flota)", lambda m: _cap('los', m.group(1) == 'N') + ' ' + m.group(2) + ' de nuestros socios'),
           (r"\bde\s+nuestros\s+(patrones de flota|gestores de flota)", lambda m: 'de los ' + m.group(1) + ' de nuestros socios'),
           (r"\b([Nn])uestra\s+(gestión de flotas?|base de (?:catamaranes|veleros|yates de vela))", lambda m: _cap('la', m.group(1) == 'N') + ' ' + m.group(2) + ' de nuestros socios'),
           (r"\b([Nn])uestras\s+(operaciones de (?:catamaranes|veleros))", lambda m: _cap('las', m.group(1) == 'N') + ' ' + m.group(2) + ' de nuestros socios')],
    'pt': [(r"\b([Aa])\s+nossa\s+(gestão de frota|base de (?:catamarãs|veleiros)|diversidade de frota)", lambda m: m.group(1) + ' ' + m.group(2) + ' dos nossos parceiros'),
           (r"\b([Oo]s)\s+nossos\s+(gestores de frota|skippers de frota)", lambda m: m.group(1) + ' ' + m.group(2) + ' dos nossos parceiros'),
           (r"\b([Oo])\s+nosso\s+(coordenador de frota)", lambda m: m.group(1) + ' ' + m.group(2) + ' dos nossos parceiros'),
           (r"\b([Aa]s)\s+nossas\s+(operações de (?:catamarãs|veleiros))", lambda m: m.group(1) + ' ' + m.group(2) + ' dos nossos parceiros'),
           (r"\b(sobre|de|com)\s+as\s+nossas\s+(operações de (?:catamarãs|veleiros))", lambda m: m.group(1) + ' as ' + m.group(2) + ' dos nossos parceiros')],
    'nl': [(r"\b([Oo])ns\s+(vlootbeheer)", lambda m: _cap('het', m.group(1) == 'O') + ' ' + m.group(2) + ' van onze partners'),
           (r"(?:<strong>)?\bBoat4You(?:</strong>)?['’]s\s+(catamarans|gulets|jachten|zeiljachten|motorjachten|boten|schepen|vloot)\b", lambda m: 'de ' + m.group(1) + ' van onze partners')],
    'pl': [(r"\b([Nn])asz(?:ą|a)\s+(baz[ęa] (?:katamaranów|jachtów))", lambda m: m.group(2) + ' naszych partnerów'),
           (r"\b([Nn])asze\s+(zarządzanie flotą)", lambda m: _cap(m.group(2), m.group(1) == 'N') + ' naszych partnerów'),
           (r"\bnaszych\s+(skipperów flotowych)", lambda m: m.group(1) + ' naszych partnerów')],
    'hr': [(r"\b(s\s+)?[Nn]ašom\s+(bazom (?:katamarana|jedrilica))", lambda m: (m.group(1) or '') + m.group(2) + ' naših partnera'),
           (r"\b([Nn])aše\s+(upravljanje flotom)", lambda m: _cap(m.group(2), m.group(1) == 'N') + ' naših partnera'),
           (r"\b([Nn])aši\s+(upravitelji flote)", lambda m: _cap(m.group(2), m.group(1) == 'N') + ' naših partnera')],
    'de': [(r"\b([Uu])nser(?:e)?\s+(Flottenmanagement|Flottenverwaltung|Katamaranbasis)", lambda m: _cap('das' if m.group(2) == 'Flottenmanagement' else 'die', m.group(1) == 'U') + ' ' + m.group(2) + ' unserer Partner')],
    'en': [],
}


def _our_boats(loc, m):
    n, mods = m.group('n'), (m.group('tag') or '') + (m.group('mods') or '')
    if loc == 'en':
        return f"{m.group('o')}ur partners' {mods}{n}"
    if loc == 'de':
        art = {'e': 'die', 'en': 'den', 'er': 'der'}[m.group('e')]
        return f"{_cap(art, m.group('u') == 'U')} {mods}{n} unserer Partner"
    if loc == 'fr':
        pre = m.group('pre')
        art = 'des' if pre and pre.lower() == 'de' else 'aux' if pre else 'les'
        art = _cap(art, (pre or m.group('n0'))[0].isupper())
        return f"{art} {mods}{n} de nos partenaires"
    if loc == 'it':
        return f"{m.group('art')}{mods}{n} dei nostri partner"
    if loc == 'es':
        pre = m.group('pre') or ''
        art = 'los' if m.group('g') == 'o' else 'las'
        if not pre:
            art = _cap(art, m.group('n0') == 'N')
        return f"{pre}{art} {mods}{n} de nuestros socios"
    if loc == 'pt':
        art = m.group('art') or _cap('os' if m.group('g') == 'o' else 'as', m.group('n0') == 'N')
        return f"{art} {mods}{n} dos nossos parceiros"
    if loc == 'nl':
        return f"{_cap('de', m.group('o') == 'O')} {mods}{n} van onze partners"
    if loc == 'pl':
        out = f"{mods}{n}{m.group('post')} naszych partnerów"
        return _cap(out, m.group('n0') == 'N')
    if loc == 'hr':
        return _cap(f"{mods}{n} naših partnera", m.group('n0') == 'N')
    return m.group(0)


# "We inspect every vessel", "Wir überprüfen jedes Schiff", "Verifichiamo
# ogni imbarcazione": upkeep and inspection of the boats is the charter
# company's job, so the sentence goes.
WE_UPKEEP = {
    'en': r"\b[Ww]e\s+(?:\w+ly\s+)?(?:inspect|verify|maintain|service|repair|check)\s+(?:every|each|all|our|the)?\s*(?:vessels?|boats?|yachts?|catamarans?|fleet|a\s+diverse\s+\w+\s+fleet)\b"
          r"|\b[Oo]ur\s+(?:brokers|maintenance\s+team|technicians)\s+(?:inspect|ensures?|maintain)\w*\b|\bWe\s+maintain\s+fleet\s+integrity",
    'de': r"\b[Ww]ir\s+(?:\w+\s+)?(?:überprüfen|prüfen|inspizieren|warten|pflegen|kontrollieren)\s+(?:jedes|jede|jeden|alle|unsere|die)\s+(?:\w+\s+)?\w*(?:Schiff|Boot|Yacht|Jacht|Katamaran|Flotte)\w*"
          r"|\b[Uu]nser\s+Wartungsteam\b|\b[Uu]nsere\s+Makler\s+(?:prüfen|inspizieren|überprüfen)\s+(?:die\s+)?(?:Schiffe|Boote|Yachten)",
    'fr': r"\b[Nn]ous\s+(?:\w+\s+)?(?:vérifions|inspectons|entretenons|contrôlons)\s+(?:chaque|tous\s+les|toutes\s+les|nos|les)\s+(?:navire|bateau|yacht|catamaran|flotte|unité)\w*"
          r"|\b[Nn]otre\s+équipe\s+(?:de\s+)?maintenance\b|\b[Nn]os\s+courtiers\s+(?:inspectent|vérifient)\s+(?:les\s+)?(?:navires|bateaux|yachts)",
    'it': r"\b(?:[Vv]erifichiamo|[Ii]spezioniamo|[Mm]anteniamo|[Cc]ontrolliamo)\s+(?:personalmente\s+)?(?:ogni|ciascuna|tutte\s+le|tutti\s+gli|le|gli|i|la)\s+(?:nostr\w+\s+)?(?:imbarcazion|barc|yacht|catamaran|flott|scaf)\w*"
          r"|\b[Ii]l\s+nostro\s+team\s+di\s+manutenzione\b|\b[Ii]\s+nostri\s+broker\s+(?:ispezionano|verificano)\s+(?:le\s+)?(?:imbarcazioni|barche)",
    'es': r"\b(?:[Vv]erificamos|[Ii]nspeccionamos|[Mm]antenemos|[Rr]evisamos)\s+(?:personalmente\s+)?(?:cada|todas\s+las|todos\s+los|las|los|nuestr\w+)\s+(?:embarcaci|barco|yate|catamar|flota)\w*"
          r"|\b[Nn]uestro\s+equipo\s+de\s+mantenimiento\b|\b[Nn]uestros\s+corredores\s+(?:inspeccionan|revisan)\s+(?:las\s+)?(?:embarcaciones|barcos)",
    'pt': r"\b(?:[Vv]erificamos|[Ii]nspecionamos|[Mm]antemos|[Rr]evemos)\s+(?:pessoalmente\s+)?(?:cada|todas\s+as|todos\s+os|as|os|os\s+nossos|as\s+nossas)\s+(?:embarca|barco|iate|catamar|frota)\w*"
          r"|\b[Aa]\s+nossa\s+equipa\s+de\s+manutenção\b|\b[Oo]s\s+nossos\s+corretores\s+(?:inspecionam|verificam)\s+(?:as\s+)?(?:embarcações|barcos)",
    'nl': r"\b[Ww]e\s+(?:\w+\s+)?(?:inspecteren|controleren|onderhouden|verifiëren)\s+(?:elk|elke|alle|onze|de)?\s*(?:schip|schepen|boot|boten|jacht|jachten|vaartuig\w*|catamaran\w*|vloot)\b"
          r"|\b[Oo]ns\s+onderhoudsteam\b|\b[Oo]nze\s+makelaars\s+inspecteren\s+(?:de\s+)?(?:schepen|boten|jachten)",
    'pl': r"\b(?:[Ww]eryfikujemy|[Ss]prawdzamy|[Kk]ontrolujemy|[Ss]erwisujemy|[Pp]rzeglądamy)\s+(?:osobiście\s+)?(?:każd\w+|wszystkie|nasze)\s+(?:statek|statk|jednost|łód|łodz|jacht|katamaran|flot)\w*"
          r"|\b[Nn]asz\s+zespół\s+(?:serwisowy|techniczny|konserwacyjny)\b|\b[Nn]asi\s+brokerzy\s+(?:sprawdzają|kontrolują)\s+(?:jednostki|łodzie|jachty)",
    'hr': r"\b(?:[Pp]rovjeravamo|[Pp]regledavamo|[Oo]državamo|[Ss]erviseramo)\s+(?:osobno\s+)?(?:svako|svaki|svaku|sva|sve|naša|naše|naše)\s+(?:plovil|brod|jaht|katamaran|flot)\w*"
          r"|\b[Nn]aš\s+tim\s+za\s+održavanje\b|\b[Nn]aši\s+brokeri\s+pregledavaju\s+(?:plovila|brodove|jahte)",
}
# Boat4You + any verb + maintenance/repair within a few words: the upkeep is
# the partner's ("Boat4You koordiniert präventive Wartung", "unterhält
# schnelle Reaktionsprotokolle für Reparaturen").
UPKEEP_NOUN = {
    'en': r'maintenance|repairs?|upkeep|servicing|refits?', 'de': r'\w*[Ww]artung\w*|\w*[Rr]eparatur\w*|\w*[Ii]nstandhaltung\w*',
    'fr': r'entretien|maintenance|réparations?', 'it': r'manutenzion\w*|riparazion\w*', 'es': r'mantenimiento|reparacion\w*',
    'pt': r'manutenç\w*|reparaç\w*', 'nl': r'\w*onderhoud\w*|reparatie\w*', 'pl': r'konserwacj\w*|napraw\w*|serwis\w*',
    'hr': r'održavanj\w*|popravk\w*|servis\w*',
}
UPKEEP_ADVISE = re.compile(
    r'^(?:recommends|advises|suggests|explains|informs|explain|empfiehlt|rät|erklärt|informiert|recommande|conseille|explique|'
    r'consiglia|raccomanda|spiega|recomienda|aconseja|explica|recomenda|aconselha|explica|raadt|adviseert|beveelt|legt|'
    r'zaleca|poleca|wyjaśnia|preporučuje|savjetuje|objašnjava|publishes|veröffentlicht|publie|pubblica|publica|publiceert|publikuje|objavljuje)$')
EXPERIENCE_WORD = re.compile(r'(?i)expertise|experience|Erfahrung|expérience|esperienza|experiencia|experiência|ervaring|doświadcz|iskust')
EXPERIENCE_YEARS = {
    'en': (r'\b(?:more than |over )?1[4-9]\+? years\b', 'more than 10 years'),
    'de': (r'\b(?:über |mehr als )?1[4-9]\+? Jahre\b', 'über 10 Jahre'),
    'fr': (r'\b(?:plus de )?1[4-9]\+? ans\b', 'plus de 10 ans'),
    'it': (r'\b(?:oltre |più di )?1[4-9]\+? anni\b', 'oltre 10 anni'),
    'es': (r'\b(?:más de )?1[4-9]\+? años\b', 'más de 10 años'),
    'pt': (r'\b(?:mais de )?1[4-9]\+? anos\b', 'mais de 10 anos'),
    'nl': (r'\b(?:meer dan )?1[4-9]\+? jaar\b', 'meer dan 10 jaar'),
    'pl': (r'\b(?:ponad )?1[4-9]\+? lat\b', 'ponad 10 lat'),
    'hr': (r'\b(?:više od )?1[4-9]\+? godina\b', 'više od 10 godina'),
}
FOUNDED_ANY = re.compile(r'\b((?:since|seit|depuis|dal|desde|sinds|od|od roku)\s+)(200\d|201[0-2])\b')
COMPANY_VOICE = re.compile(
    r'Boat4You|\b(?:[Ww]e|[Oo]ur|[Ww]ir|[Uu]nser\w*|[Nn]ous|[Nn]otre|[Nn]oi|[Nn]ostr\w|[Nn]osotros|[Nn]uestr\w|[Nn]ós|[Nn]oss\w|[Ww]ij|[Oo]nze|'
    r'[Nn]asz\w*|[Nn]aš\w*|[Cc]hartering|[Cc]harteren|[Nn]oleggiamo|[Cc]harterujemy|[Ii]znajmljivanje)\b')


def _claims_more(body, ctx):
    loc = ctx.locale
    cap, low = CLAIM_SUBJECT[loc]
    # 5) our boats
    body_now = body

    def boats(m):
        new = _our_boats(loc, m)
        if at_sentence_start(body_now, m.start()) and not new[:1].isupper():
            new = new[:1].upper() + new[1:]
        ctx.record('claims2', m.group(0), new)
        return new

    body = OUR_BOATS[loc].sub(boats, body)
    for rx, fn in FLEET_ROLE.get(loc, []):
        body_now = body

        def role(m, fn=fn):
            new = fn(m)
            if at_sentence_start(body_now, m.start()):
                new = new[:1].upper() + new[1:]
            ctx.record('claims2', m.group(0), new)
            return new

        body = re.sub(rx, role, body)
    if loc == 'en':
        body_now = body

        def place(m):
            new = f"{m.group(1)}ur partners' {m.group(2)}{m.group(3)}"
            ctx.record('claims2', m.group(0), new)
            return new

        body = OUR_PLACE_EN.sub(place, body)

    # 6) first-person upkeep sentences go
    we = re.compile(WE_UPKEEP[loc])

    def upkeep_block(tag, attrs, inner):
        if not we.search(plain(inner)):
            return inner
        new, dropped = drop_sentences(inner, lambda t: bool(we.search(t)))
        for d in dropped:
            ctx.record('claims2', d[:200], '(sentence removed: we maintain/inspect the boats)')
        return new if plain(new) else None

    body = edit_blocks(body, upkeep_block)

    # 7) Boat4You + verb + maintenance/repair → partner network
    body_now = body
    noun = UPKEEP_NOUN[loc]
    rx = re.compile(rf"(?:<strong>)?\bBoat4You(?:</strong>)?(?P<mid>\s+(?:(?:also|auch|aussi|anche|también|também|ook|również|także|također|[\w-]+(?:ly|lich|ment|mente|nie))\s+)?)(?P<verb>[^\W\d_][\w-]*)(?P<obj>(?:\s+[\w'’-]+){{0,5}}?\s+(?:{noun})\b)")

    def upkeep(m):
        if UPKEEP_ADVISE.match(m.group('verb')) or re.search(r'[.!?;:]', m.group('obj')):
            return m.group(0)
        before = re.sub(r'<[^>]+>', ' ', body_now[max(0, m.start() - 25): m.start()])
        if before.strip() and _not_subject(before):
            return m.group(0)
        who = cap if at_sentence_start(body_now, m.start()) else low
        new = f"{who}{m.group('mid')}{m.group('verb')}{m.group('obj')}"
        ctx.record('claims2', plain(m.group(0)), plain(new))
        return new

    body = rx.sub(upkeep, body)

    # 8) founding year and years of experience in the company's own voice
    years_rx, years_new = EXPERIENCE_YEARS[loc]

    def company(tag, attrs, inner):
        if not (FOUNDED_ANY.search(inner) or re.search(years_rx, inner)):
            return inner
        out = []
        for piece in split_sentences(inner):
            text = plain(piece)
            new = piece
            if FOUNDED_ANY.search(text) and COMPANY_VOICE.search(text):
                new = FOUNDED_ANY.sub(lambda mm: mm.group(1) + '2013', new)
            if 'Boat4You' in text and EXPERIENCE_WORD.search(text):
                new = re.sub(years_rx, years_new, new)
            if new != piece:
                ctx.record('claims2', text[:160], plain(new)[:160])
            out.append(new)
        return ''.join(out)

    body = edit_blocks(body, company)
    return body


def fix_claims2(src, ctx):
    head, body, tail = split_body(src)
    loc = ctx.locale
    cap, low = CLAIM_SUBJECT[loc]

    for old, new in CLAIM_EXACT.get(loc, []):
        if old in body:
            body = body.replace(old, new)
            ctx.record('claims2', old, new)

    # 1) our fleet
    pattern = OUR_FLEET[loc][0]
    body_now = body

    def fleet(m):
        new = our_fleet_replacement(loc, m)
        if at_sentence_start(body_now, m.start()) and not new[:1].isupper():
            new = new[:1].upper() + new[1:]
        if new != m.group(0):
            ctx.record('claims2', m.group(0), new)
        return new

    body = pattern.sub(fleet, body)
    reorder = FLEET_REORDER.get(loc)
    if reorder:
        def swap_complement(m):
            new = m.group('n') + m.group('c') + m.group('p')
            ctx.record('claims2', m.group(0), new)
            return new
        body = reorder.sub(swap_complement, body)

    # 1b) EN "Boat4You catamarans / the Boat4You fleet": the boats listed on
    #     Boat4You, not boats Boat4You owns; "Boat4You's 5 gulets" → "our
    #     partners' 5 gulets".
    if loc == 'en':
        body_now = body

        def brand_poss(m):
            tags = ''.join(re.findall(r'<a\b[^>]*>', m.group('sep')))
            new = ("Our" if at_sentence_start(body_now, m.start()) else "our") + f" partners' {tags}{m.group('mods')}{m.group('n')}"
            ctx.record('claims2', plain(m.group(0)), new)
            return new

        body = BRAND_POSS_BOATS_EN.sub(brand_poss, body)
        body_now = body

        def team(m):
            new = ("The" if at_sentence_start(body_now, m.start()) else "the") + " charter operator's maintenance team"
            ctx.record('claims2', plain(m.group(0)), new)
            return new

        body = re.sub(r"(?:<strong>)?\bBoat4You(?:</strong>)?['’]s\s+maintenance\s+team", team, body)
        body_now = body

        def brand_boats(m):
            q, n = (m.group('q') or ''), m.group('n')
            start = at_sentence_start(body_now, m.start())
            if n.endswith('crews'):
                new = q + n
            elif n == 'fleet':
                new = ('the boats on Boat4You' if q.strip().lower() == 'the' else
                       "our partners' fleet" if q.strip().lower() == 'our' else 'charter fleet')
            elif m.group('poss'):
                new = f"the {n}{m.group('poss')}"
            elif q.strip().lower() in ('our', 'the', ''):
                new = f'the {n} on Boat4You' if q else f'{n} on Boat4You'
            else:
                new = f'{q}{n} on Boat4You'
            if start or (q[:1].isupper()):
                new = new[:1].upper() + new[1:]
            if new != m.group(0):
                ctx.record('claims2', plain(m.group(0)), new)
            return new

        body = BRAND_BOATS_EN.sub(brand_boats, body)

    # 1c) possessive "fleet of Boat4You" in the translations ("Unsere
    #     <strong>Boat4You</strong> Segelyachten": the emphasis goes first)
    body = BRAND_BEFORE_BOATS.sub(r'\1', body)
    body = re.sub(r'<strong>([^<]{1,40})</strong>(?=\s+(?:da|de|di|del|della|van|von|of|dos|das|do|des)\s+(?:<strong>)?Boat4You)', r'\1', body)
    for pattern, repl in BRAND_FLEET.get(loc, []):
        body_now = body

        def brand_fleet(m, repl=repl):
            new = _keep_close_tags(m.group(0), repl(m) if callable(repl) else m.expand(repl))
            if at_sentence_start(body_now, m.start()):
                new = new[:1].upper() + new[1:]
            ctx.record('claims2', plain(m.group(0)), plain(new))
            return new

        body = pattern.sub(brand_fleet, body)

    # 2) Boat4You operates … / maintains rigorous standards … → partner network
    body_now = body
    verbs = rf"(?:{OPERATE[loc]})\b|{UPKEEP[loc]}|(?:{MANAGE[loc]})"
    art_rx = r"(?P<art>\b[Aa]\s+)?" if loc == 'pt' else r"(?P<art>(?!))?"
    subj = re.compile(
        art_rx + rf"(?:<strong>)?\bBoat4You(?:</strong>)?(?P<mid>\s+(?:[\w-]+(?:ly|lich|ment|mente|nie|no)\s+)?)(?P<verb>{verbs})")

    def swap(m):
        before = re.sub(r'<[^>]+>', ' ', body_now[max(0, m.start() - 25): m.start()])
        if (m.group('art') and _not_subject(before + m.group('art'))) or (not m.group('art') and _not_subject(before) and before.strip()):
            return m.group(0)
        who = cap if at_sentence_start(body_now, m.start()) else low
        new = f"{who}{m.group('mid')}{m.group('verb')}"
        ctx.record('claims2', plain(m.group(0)) + ' …', plain(new) + ' …')
        return new

    body = subj.sub(swap, body)
    if loc in BRAND_MODIFIER:
        body_now = body

        def modifier(m):
            keep = m.groupdict().get('det') or ''
            ctx.record('claims2', plain(body_now[m.start(): m.end() + 30]), plain(keep + body_now[m.end(): m.end() + 30]))
            return keep
        # a sentence that now starts with the boat noun gets its capital in
        # the recap pass
        body = re.sub(BRAND_MODIFIER[loc], modifier, body)
    for rules in (BOATS_OF_BRAND, STANDARDS_OF_BRAND):
        if loc not in rules:
            continue
        rx, repl = rules[loc]
        body_now = body

        def own(m, repl=repl):
            new = m.expand(repl)
            if at_sentence_start(body_now, m.start()):
                new = new[:1].upper() + new[1:]
            ctx.record('claims2', plain(m.group(0)), plain(new))
            return new
        body = re.sub(rx, own, body)
    for rx, repl in FLEET_SUPERLATIVE.get(loc, []):
        def tone(m, repl=repl):
            new = m.expand(repl)
            ctx.record('claims2', m.group(0), new)
            return new
        body = re.sub(rx, tone, body)

    # 3) priority-berth promises
    pb = re.compile(PRIORITY_BERTH[loc], re.I)

    def block(tag, attrs, inner):
        if not pb.search(plain(inner)):
            return inner
        out = []
        for piece in split_sentences(inner):
            if not pb.search(plain(piece)):
                out.append(piece)
                continue
            new = _drop_priority_berth(piece, loc)
            while new is not None and pb.search(plain(new)):
                new = _drop_priority_berth(new, loc)
            if new is None:
                ctx.record('claims2', plain(piece)[:200], '(sentence removed: priority berths)')
                continue
            ctx.record('claims2', plain(piece)[:200], plain(new)[:200])
            out.append(new)
        new_inner = ''.join(out)
        if out and out[0] is not split_sentences(inner)[0]:
            new_inner = new_inner.lstrip()
        return new_inner if plain(new_inner) else None

    if pb.search(body):
        body = edit_blocks(body, block)

    # 4) founding year: Boat4You was founded in 2013
    def founded(tag, attrs, inner):
        if 'Boat4You' not in inner or not FOUNDED.search(inner):
            return inner
        out = []
        for piece in split_sentences(inner):
            if 'Boat4You' in piece and FOUNDED.search(piece):
                new = FOUNDED.sub(lambda m: m.group(1) + '2013', piece)
                ctx.record('claims2', plain(piece)[:160], plain(new)[:160])
                piece = new
            out.append(piece)
        return ''.join(out)

    if FOUNDED.search(body):
        body = edit_blocks(body, founded)
    body = _claims_more(body, ctx)
    if reorder:
        body = reorder.sub(swap_complement, body)
    return head + body + tail


# ---------------------------------------------------------------- subject

# An earlier pass deleted "Boat4You" from the texts and left sentences that
# start with a lower-case verb: DE ". koordiniert die Verfügbarkeit von
# Skippern", NL "<p> regelt professionele schippers", IT "ti collega",
# FR "s'occupe des briefings". The subject goes back ("Boat4You koordiniert
# …", PT "A Boat4You coordena …") when the first word is a verb the corpus
# uses with Boat4You (SUBJECT_VERBS, collected from the corpus itself), or a
# clitic/adverb followed by one ("se especializa", "también ofrece"); any
# other sentence that starts in lower case is capitalised. The fleet/upkeep
# claims then run on the restored subject (claims, claims2).
SUBJECT_VERBS = {
    'de': set('''
wählte achtet aggregiert akzeptiert anerkennt arbeitet arrangiert basiert baut bedient befindet befolgt begrüßt behält
beinhaltet beobachtet berechnet bereitet berät berücksichtigt beschleunigt bestellt bestätigt betankt beteiligt betont
betreibt bewertet bietet bleibt bringt bucht chartert deckt empfiehlt engagiert enthält entwickelt entwirft erfordert
erkennt erklärt erlaubt erleichtert ermutigt ermöglicht erweckt erweitert feiert filtert findet fordert fördert führt
gewährleistet gibt glaubt grenzt hat hebt heißt hilft hält informiert ist kann kennt klärt kombiniert koordiniert
koppelt kuratiert kümmert legt liefert listet lädt nutzt operiert optimiert orchestriert organisiert passt pflegt
plant positioniert priorisiert pro-proviantiert profitiert präsentiert prüft repräsentiert reserviert respektiert
richtet rät schafft schließt schlägt schult schätzt setzt sichert spezialisiert spezifiziert stationiert steht stellt
stimmt strafft strukturiert teilt umarmt umfasst unterhält unterstützt verbindet vereinfacht verfolgt verfügt
vergleicht verhandelt verifiziert verlangt vermittelt verpflichtet versorgt versteht verwaltet verwandelt
veröffentlicht warnt weist wickelt widmet wird wählt zeigt übernimmt überprüft übertrifft überwacht
'''.split()),
    'nl': set('''
accepteert accommodeert accomodateert adresseert adviseert aggregeert arrangeert assisteert bedient begeleidt begrijpt
beheert behoudt benadrukt benut beoordeelt beschikt beschrijft beveelt bevestigt bevordert biedt blijft blokkeert
boekt bouwt breidt brengt catalogiseert citeert combineert controleert coördineert creëert curateert erkent evalueert
exploiteert faciliteert filtert gebruikt geeft handelt handhaaft hanteert heeft helpt houdt informeert interviewt is
kan kent keurt koppelt legt levert maakt matcht moedigt monitort neemt nodigt omarmt omvat onderhandelt onderhoudt
ondersteunt ontwerpt ontwikkelt opereert optimaliseert organiseert orkestreert overtreft past plaatst plant
positioneert prioriteert profiteert promoot publiceert raadt regelt reserveert respecteert schat selecteert sluit somt
specialiseert specificeert staat stelt stemt steunt streeft stroomlijnt toont transformeert verbindt verduidelijkt
vereenvoudigt vereist vergelijkt verhoogt verifieert verwacht verwelkomt verwerkt verzekert viert vindt voert voorziet
vraagt waardeert werkt wijst zal zet zorgt
'''.split()),
    'fr': set('''
a aborde accepte accueille adapte affiche agrège aide applique apporte apprécie assiste associe assure attribue base
catalogue clarifie collabore combine compare comprend confirme connecte conseille conserve conçoit coordonne crée
dispose donne définit dépasse détaille effectue encourage entretient est examine exige exploite facilite fait filtre
fournit garantit gère inclut informe liste livre maintient met négocie offre optimise opère orchestre organise
orientera perpétue personnalise peut planifie positionne prend privilégie profite propose pré-organise précise prépare
présente prône publie recommande reconnaît rend respecte reste répertorie réserve s'adapte s'aligne s'associe s'engage
s'occupe sensibilise simplifie souligne source soutient spécifie surveille sécurise sélectionne traite transforme
travaille utilise valorise vérifie éduque élimine élève établit étend évalue
'''.split()),
    'it': set('''
abbina accetta accoglie adatta affronta aggrega aiuta apprezza assegna assicura assiste basa beneficia cataloga
celebra chiarisce collabora collega combina comprende comunica conduce conferma consegna consiglia continua coordina
corrisponde costruisce crea cura delinea dettaglia dispone dà educa effettua elenca eleva enfatizza esamina estende
facilita filtra fornirà fornisce garantisce gestisce ha implementa include incoraggia indirizzerà informa intervista
lavora mantiene monitora mostra negozia offre opera orchestra ordina organizza ospita ottimizza partecipa personalizza
pianifica pone porta posiziona pre-approvvigiona pre-ordina pre-organizza prenota prepara presenta privilegia progetta
promuove pubblica può raccomanda rappresenta richiede riconosce rimane riserva rispetta semplifica sfrutta sostiene
sottolinea specifica supera supporta sviluppa trasferisce trasforma trasporta trova unisce utilizza valorizza valuta
verifica visualizza è
'''.split()),
    'es': set('''
aborda acepta aclara acomoda aconseja adapta admite advierte agiliza anima aporta apoya aprecia aprovecha aprovisiona
asegura asigna asiste ayuda basa cataloga celebra coincide colabora combina compara comprende comunica conecta
confirma confía continúa coordina cotiza crea cubre cuenta cumple da desarrolla describe destaca detalla diseña educa
eleva eligió elimina empareja encuentra enfatiza entiende entrevista enumera es especifica está evalúa exige explica
extiende facilita filtra fomenta garantiza gestiona ha iguala incluye informa invita lleva maneja mantiene monitorea
monitoriza muestra negocia ofrece opera optimiza organiza orquesta participa permite personaliza planifica posiciona
pre-aprovisiona pre-organiza presenta prioriza procesa promueve proporciona publica puede realiza recomienda reconoce
representa requiere reserva respalda respeta revisa selecciona seleccionó significa sigue simplifica solicita soporta
suele suministra tiene trae transforma traslada utiliza valora verifica
'''.split()),
    'pt': set('''
aceita acomoda aconselha adapta adequa ajuda ajuda-o analisa aplica apoia aproveita auxilia avalia beneficia cataloga
celebra clarifica colabora combina compreende conecta confirma constrói continua convida-o coordena coordena-se
corresponde cria defende delineia descreve desenha educa enfatiza entrevista esclarece especializa-se especifica
estabelece estrutura está exibe exige facilita faz filtra garante gere gerencia incentiva inclui irá liga liga-o lista
mantém mantém-se monitoriza mostra negoceia negocia oferece opera organiza otimiza permite personaliza pode prioriza
proporciona pré-abastece publica realiza recomenda reconhece requer reserva respeita revê seleciona selecionou
simplifica suporta tem transfere transforma transporta trata traz valoriza verifica é
'''.split()),
    'pl': set('''
agreguje akceptuje aranżuje buduje celebruje ceni cumuje docenia dopasowuje dopasuje doradza dostarcza dostosowuje
działa edukuje filtruje informuje jest kataloguje kontynuuje koordynuje korzysta kuruje kładzie monitoruje może
negocjuje obejmuje obsługuje ocenia oferuje określa operuje optymalizuje organizuje ożywia personalizuje planuje
podaje podkreśla pokazuje poleca pomaga pomoże porównuje posiada potwierdza pozycjonuje projektuje promuje prowadzi
przekazuje przekształca przeprowadza przydziela przydzieli przynosi przyspiesza publikuje rekomenduje rezerwuje
rozszerza rozumie specjalizuje sprawdza stoi stosuje szanuje tworzy umożliwia upraszcza usprawnia ustala utrzymuje
uwzględnia uznaje ułatwia weryfikuje wita wnosi wprowadza wspiera współpracuje wybrał wybrała wyjaśnia wykorzystuje
wymaga wyświetla zachowuje zachęca zajmuje zaleca zaleci zapewnia zaprasza zarządza zastrzega zawiera zna znajduje
zobowiązuje łączy
'''.split()),
    'hr': set('''
agregira bazira brine cijeni daje definira dizajnira djeluje dodjeljuje dogovara donosi dopušta dovodi dočekuje
educira eliminira filtrira ima intervjuira iskorištava isporučuje ističe je katalogizira koordinira koristi kurira
može naglašava nalazi nastavlja navodi nosi nudi obavještava obavlja objavljuje obrađuje odabire odabrala odabrao
odgovara održava olakšava omogućuje opskrbljuje optimizira organizira osigurava oživljava parira planira podržava
podudara pojašnjava pojednostavljuje pomaže posjeduje posluje postavlja posvećen potiče potvrđuje povezuje pozdravlja
pozicionira poziva poznaje poštuje prati predan predstavlja pregledava pregovara premašuje prenosi preporučuje
prepoznaje pretvara pridržava prihvaća prikazuje prilagođava prioritetizira prioritizira procjenjuje promiče pronalazi
provjerava provodi proširuje pruža radi razumije razvija rezervira rješava rukuje sastavlja savjetuje shvaća slavi
spaja specijalizira specijaliziran specijalizirao spreman stoji stvara surađuje svakom svaku udovoljava uključuje
upozorava upravlja usklađuje uspoređuje vrši zadržava zagovara zahtijeva će
'''.split()),
}

SUBJECT_CLITIC = {
    'fr': {'se', 'vous'}, 'it': {'si', 'ti', 'vi', 'ci', 'lo', 'la', 'le', 'gli'},
    'es': {'se', 'le', 'les', 'lo', 'la', 'nos', 'te'}, 'pt': set(), 'nl': set(), 'de': set(),
    'pl': set(), 'hr': {'se', 'vam', 'vas', 'vi'}, 'en': set(),
}
SUBJECT_PRONOUN = {
    'es': {'se', 'le', 'les', 'te', 'nos'}, 'it': {'si', 'ti', 'vi', 'ci'}, 'fr': {'se', 'lui', 'leur'}, 'hr': {'se', 'vam', 'vas'},
    'pt': set(), 'de': set(), 'nl': set(), 'pl': set(), 'en': set(),
}
SUBJECT_ADVERB = {
    'es': {'también', 'normalmente', 'generalmente', 'típicamente', 'rara', 'siempre', 'además'},
    'it': {'tipicamente', 'spesso', 'raramente', 'anche', 'inoltre', 'sempre', 'generalmente', 'normalmente'},
    'pt': {'também', 'geralmente', 'normalmente', 'sempre'},
    'fr': {'aussi', 'également', 'généralement', 'toujours'},
    'pl': {'zazwyczaj', 'często', 'starannie', 'szczegółowo', 'wstępnie', 'dokładnie', 'codziennie', 'stale',
           'priorytetowo', 'bezbłędnie', 'bezwzględnie', 'aktywnie', 'rzadko', 'wyraźnie', 'również', 'także', 'zawsze'},
    'hr': {'obično', 'često', 'pažljivo', 'izravno', 'također', 'iskreno', 'detaljno', 'jasno', 'dodatno', 'transparentno',
           'neprekidno', 'besprijekorno', 'posebno', 'svakodnevno', 'prethodno', 'unaprijed', 'rigorozno', 'apsolutno',
           'kontinuirano', 'aktivno', 'rijetko', 'namjerno', 'uvijek'},
    'de': set(), 'nl': set(), 'en': set(),
}
# Words the brand pass left in a wrong form: "arrange" (EN) in a DE text.
SUBJECT_WORD_FIX = {
    'de': {'arrange': 'arrangiert'}, 'fr': {'spécialise': 'se spécialise'}, 'it': {'specializza': 'si specializza'},
    'es': {'estaciones': 'estaciona'},
}
SUBJECT_BRAND = {'pt': 'A Boat4You'}
_INL = r'(?:a|strong|em|b|i|span|u)'
SUBJECT_START = re.compile(
    r'(?P<pre>^\s*|[.!?…](?:["”»’)]|</' + _INL + r'\s*>)*\s+)(?P<open>(?:<' + _INL + r'\b[^>]*>\s*)*)'
    r'(?P<word>[^\W\d_][\w’\'-]*)(?P<gap>\s+)?(?P<next>[^\W\d_][\w’\'-]*)?')
# a period that does not end a sentence: abbreviations, initials, ordinals
# ("18. stoljeća", "7. dnia"), "490 v. Chr.", "p. m."
SUBJECT_ABBR = re.compile(
    r'(?:\b(?:vs|e\.g|i\.e|etc|approx|incl|ca|bzw|ggf|inkl|usw|evtl|Chr|J\.-C|n\.Chr|v\.Chr|av|apr|pr|Kr|ds|np|tj|tzw|'
    r'tzn|npr|itd|tzv|sv|ul|wg|godz|tys|mln|min|max|Min|Vol|Std|nm|km|Nr|No|St|Ste|Mt|Dr|Sr|Jr|Prof|Sig|bijv|resp|evt|'
    r'aprox|p\.\s?ej|p\.\s?ex|m\.in|n\.p\.m|p\.n\.e|n\.e|a\.C|d\.C|z\.\s?B|d\.\s?h|u\.\s?a|t\.o\.v|o\.a)|(?:^|(?<=[\s(.]))[A-Za-z]|\d)'
    r'[.)]*$')
SUBJECT_SKIP_WORDS = {'e.g', 'i.e', 'vs', 'iOS', 'eSIM', 'eBay', 'iPhone', 'iPad', 'km', 'nm', 'kn', 'www'}


def _subject_action(loc, word, nxt):
    verbs = SUBJECT_VERBS.get(loc, set())
    if word in SUBJECT_SKIP_WORDS or word.split('.')[0] in SUBJECT_SKIP_WORDS or word.lower().startswith('boat4you'):
        return 'skip'
    # an object or reflexive pronoun cannot start a sentence: "se especializa",
    # "si occupa", "ti collega", "le conecta", "vous aide"
    if nxt and nxt[:1].islower() and word in SUBJECT_PRONOUN.get(loc, ()):
        return 'brand'
    if word in verbs or word in SUBJECT_WORD_FIX.get(loc, {}):
        return 'brand'
    if loc == 'fr' and re.match(r"s['’]\w", word):
        return 'brand'
    if loc == 'fr' and word == 'vous':
        return 'brand' if nxt and not nxt.endswith('ez') else 'cap'
    if nxt and (word in SUBJECT_CLITIC.get(loc, ()) or word in SUBJECT_ADVERB.get(loc, ())):
        if nxt in verbs or (loc == 'es' and word == 'rara' and nxt == 'vez') or (loc == 'fr' and nxt in ('y', 'en')):
            return 'brand'
    return 'cap'


# A block that ends in the middle of a sentence because the main clause
# ("…, Boat4You delivers …") was cut when the texts were generated:
# "Whether you're a first-time charterer or a seasoned skipper," — the
# dangling clause goes; "…, and" at the very end becomes a full stop.
DANGLING_CONJ = re.compile(r',\s*(?:and|und|et|e|y|en|i|a|oraz|kao i)(?P<tags>(?:\s*</?(?:strong|em|b|i|span)>)*)\s*$')
_ENDS_COMMA = re.compile(r',(?P<tags>(?:\s*</?(?:strong|em|b|i|span)>)*)\s*$')


def fix_dangling_end(body, ctx):
    def block(tag, attrs, inner):
        if tag not in ('p', 'li'):
            return inner
        m = DANGLING_CONJ.search(inner)
        if m and re.search(r'[\w)]$', re.sub(r'<[^>]+>', '', inner[:m.start()]).rstrip()):
            new = inner[:m.start()] + '.' + m.group('tags')
            ctx.record('recap', plain(inner)[-120:], plain(new)[-120:])
            return new
        if not _ENDS_COMMA.search(inner):
            return inner
        pieces = split_sentences(inner)
        if len(pieces) < 2:
            ctx.record('recap', plain(inner)[:160], '(block removed: unfinished sentence)')
            return None
        new = ''.join(pieces[:-1]).rstrip()
        ctx.record('recap', plain(pieces[-1])[:160], '(unfinished sentence removed)')
        return new

    return edit_blocks(body, block)


def fix_recap(src, ctx):
    """Last pass: a sentence that a later rule left starting in lower case is
    capitalised (no brand is inserted this late); a block that ends in an
    unfinished sentence loses the fragment."""
    src = fix_subject(src, ctx, allow_brand=False)
    head, body, tail = split_body(src)
    return head + fix_dangling_end(body, ctx) + tail


def fix_subject(src, ctx, allow_brand=True):
    head, body, tail = split_body(src)
    loc = ctx.locale

    # "[Boat4You] verifica…", "[Subject Missing]", "[Nome Azienda]": a
    # translator's marker for the brand the earlier pass removed.
    def bracket(m):
        ctx.record('subject', m.group(0), 'Boat4You')
        return 'Boat4You'

    body = BRACKET_BRAND.sub(bracket, body)

    def block(tag, attrs, inner):
        if tag == 'td':
            return inner

        def start(m):
            word, nxt = m.group('word'), m.group('next')
            if not word[:1].islower():
                return m.group(0)
            if m.group('pre').strip():
                if m.group('pre').lstrip()[:1] == '.' and SUBJECT_ABBR.search(plain(inner[max(0, m.start() - 40): m.start()])):
                    return m.group(0)
            action = _subject_action(loc, word, nxt if m.group('gap') else None)
            if action == 'brand' and not allow_brand:
                action = 'cap'

            rest = m.group(0)[len(m.group('pre')) + len(m.group('open')) + len(word):]
            if action == 'skip':
                return m.group(0)
            if action == 'cap':
                new_word = word[:1].upper() + word[1:]
                ctx.record('subject', word, new_word, plain(inner)[:80])
                return m.group('pre') + m.group('open') + new_word + rest
            brand = SUBJECT_BRAND.get(loc, 'Boat4You')
            new_word = SUBJECT_WORD_FIX.get(loc, {}).get(word, word)
            if loc == 'hr' and nxt in ('je', 'se') and m.group('gap'):
                # clitic second: "Boat4You je odabrao", "Boat4You se specijalizirao"
                new = f"{brand} {nxt} {new_word}"
                rest = rest[len(m.group('gap')) + len(nxt):]
            else:
                new = f"{brand} {new_word}"
            ctx.record('subject', word, new, plain(inner)[:80])
            return m.group('pre') + m.group('open') + new + rest
        return SUBJECT_START.sub(start, inner)

    body = edit_blocks(body, block)
    body = fix_heading_holes(body, ctx)
    return head + body + tail


# Headings the brand pass left with a hole: "Warum für Ihren Segelyachtcharter?",
# "Perché i Velisti Tornano da", "Waarom Zeilers Terugkeren naar",
# "¿Qué se incluye en el precio del alquiler de catamarán de ?".
_HEAD_END = r'\s*(?P<q>[?!:]?)\s*$'
HEADING_HOLE = {
    'en': [(r'^(?P<a>Why)\s+(?P<b>for\b)', r'\g<a> Boat4You \g<b>'),
           (r'(?P<a>\b(?:Return|Returns|Come Back|Keep Coming Back) to|\bTrust|\bChoose|\bwith|\bat|\bthrough|\bhandled by)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'de': [(r'^(?P<a>Warum)\s+(?P<b>für\b)', r'\g<a> Boat4You \g<b>'),
           (r'(?P<a>\b(?:zurückkehren zu|kehren zurück zu|vertrauen|mit)|\bflotte bei)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'fr': [(r'^(?P<a>Pourquoi)\s+(?P<b>pour\b)', r'\g<a> Boat4You \g<b>'),
           (r'(?P<a>\breviennent chez|\bfont confiance à|\bchez|\bavec|\bde catamaran de|\bde location de)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'it': [(r'^(?P<a>Perché)\s+(?P<b>per\b)', r'\g<a> Boat4You \g<b>'),
           (r'(?P<a>\b[Tt]ornano (?:da|a)|\bsi [Aa]ffidano a|\bcon|\bdi catamarano di)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'es': [(r'^(?P<a>¿?Por qué)\s+(?P<b>para\b)', r'\g<a> Boat4You \g<b>'),
           (r'(?P<a>\b[Rr]egresan a|\b[Vv]uelven a|\b[Cc]onfían en|\bcon|\ba través de|\bde catamarán de|\b[Vv]ela en)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'pt': [(r'^(?P<a>Porquê|Porque)\s+(?P<b>para\b)', r'\g<a> a Boat4You \g<b>'),
           (r'(?P<a>\b[Rr]egressam) (?:à|a)' + _HEAD_END, r'\g<a> à Boat4You\g<q>'),
           (r'(?P<a>\bcom|\bde catamarãs da|\b[Vv]eleiros em)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'nl': [(r'^(?P<a>Waarom)\s+(?P<b>voor\b)', r'\g<a> Boat4You \g<b>'),
           (r'(?P<a>\b[Tt]erugkeren naar|\b[Kk]eren terug naar|\b[Vv]ertrouwen op|\bcharterprijzen van)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'pl': [(r'^(?P<a>Dlaczego)\s+(?P<b>dla\b)', r'\g<a> Boat4You \g<b>'),
           (r'^(?P<a>Dlaczego wybrać)\s+(?P<b>(?:do|na|dla)\b)', r'\g<a> Boat4You \g<b>'),
           (r'(?P<a>\b(?:[Ww]racają|[Ww]rócą|[Pp]owracają) do|\bufają|\bwe [Ww]łoszech z)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
    'hr': [(r'^(?P<a>Zašto)\s+(?P<b>za\b)', r'\g<a> Boat4You \g<b>'),
           (r'^(?P<z>Zašto) [Ss]e (?P<w>[\wčćđšž]+) [Vv]raćaju u' + _HEAD_END, r'\g<z> nam se \g<w> vraćaju\g<q>'),
           (r'(?P<a>\bu Italiji s|\bflote jedrilica kod)' + _HEAD_END, r'\g<a> Boat4You\g<q>')],
}


def fix_heading_holes(body, ctx):
    rules = [(re.compile(p), r) for p, r in HEADING_HOLE.get(ctx.locale, [])]
    if not rules:
        return body
    space_q = ' ' if ctx.locale == 'fr' else ''

    def heading(m):
        inner = m.group(3)
        if '<' in inner or 'Boat4You' in inner:
            return m.group(0)
        text = inner.strip()
        new = text
        for rx, repl in rules:
            def sub(mm, repl=repl):
                out = mm.expand(repl.replace(r'\g<q>', ''))
                q = mm.groupdict().get('q') or ''
                return out + (space_q + q if q else '')
            new = rx.sub(sub, new)
        if new == text:
            return m.group(0)
        ctx.record('subject', text, new)
        return f'<h{m.group(1)}{m.group(2)}>{inner.replace(text, new)}</h{m.group(1)}>'

    return re.sub(r'<h([2-4])(\b[^>]*)>([\s\S]*?)</h\1\s*>', heading, body)


# ---------------------------------------------------------------- compass

# Wrong compass directions and distances between Split-area places (B37).
# Trogir lies west of Split (about 27 km by road, 15 nm by sea), east and
# south-east of Rogoznica and Primošten; Split airport is next to Trogir;
# Hvar and Šolta lie south / south-east of Trogir, the Kornati north-west.
# Each case: files, anchor place, where the direction word sits relative to
# the anchor (chars before, chars after), the right direction, and distance
# corrections inside that window, and optionally the other place of the
# pair: when it sits close to the anchor the window spans both ("nach
# Norden von Split und besuchen … Trogir"). Direction words are swapped per language
# with the grammar of the phrase ("nördlich von" → "westlich von", "au nord
# de" → "à l'ouest de", "na sjever" → "na zapad").
_AIRPORT = r"(?i:airport|flughafen|aéroport|aeroporto|aeropuerto|luchthaven|lotnisk\w*|zračn\w* luk\w*)"
_TROGIR = r"Trogir\w*|Traù"
COMPASS_CASES = [
    (('croatia-gulet-charter', 'croatia-sailing-yacht-charter', 'split-catamaran-charter',
      'split-motorsailer-charter', 'split-power-catamaran-charter', 'split-sailing-yacht-charter', 'split-region-catamaran-charter',
      'split-region-sailing-area-yacht-charter-and-boat-rental', 'split-sailing-area-yacht-charter-and-boat-rental',
      'gulet-charter-split-west-coast-zapadna-obala', 'split-motor-yacht-charter', 'split-region-gulet-charter'),
     _TROGIR, (45, 55), 'west', 'north', {}, r'Split\w*|Spalat\w*'),
    (('croatia-power-catamaran-charter',), _TROGIR, (0, 40), 'west', 'any', {}),
    (('primosten-catamaran-charter', 'primosten-motorboat-charter', 'primosten-sailing-yacht-charter'),
     _TROGIR + r"|[Kk]aštel\w*|[Kk]astel\w*|Castelli", (45, 55), 'south-east', 'north', {}),
    (('rogoznica-motor-yacht-charter',), _TROGIR, (0, 60), 'east', 'north', {}),
    (('catamaran-charter-marina-baotic',), _AIRPORT, (0, 60), 'east', 'any', {'25': '8'}),
    (('catamaran-charter-port-of-split-west-harbour',), _AIRPORT, (0, 60), 'west', 'any', {'25': '20'}),
    (('catamaran-charter-trogir-marina-trogir-exsct', 'motor-yacht-charter-trogir-marina-trogir-exsct',
      'sailing-yacht-charter-trogir-marina-trogir-exsct'), _AIRPORT, (0, 60), 'east', 'any', {'25': '6'}),
    (('trogir-catamaran-charter', 'trogir-motor-yacht-charter', 'trogir-motorboat-charter'), _AIRPORT, (0, 60), 'east', 'any', {'20': '6'}),
    (('catamaran-charter-trogir',), r"Šolt\w*|Solt\w*", (0, 40), 'south', 'north', {}),
    (('trogir-catamaran-charter',), r"Hvar\w*", (0, 70), 'south-east', 'north', {}),
    (('trogir-motor-yacht-charter',), r"Kornat\w*", (40, 0), 'north-west', 'any', {}),
    (('catamaran-charter-trogir-yachtclub-seget-marina-baotic', 'motor-yacht-charter-trogir-yachtclub-seget-marina-baotic'),
     r"Kornat\w*", (0, 60), 'north-west', 'north', {'30': '40'}),
    (('motor-yacht-charter-trogir-yachtclub-seget-marina-baotic', 'sailing-yacht-charter-trogir-yachtclub-seget-marina-baotic'),
     _TROGIR, (0, 40), 'east', 'any', {}),
    (('marina-catamaran-charter', 'marina-sailing-yacht-charter'), _TROGIR, (45, 0), 'west', 'north', {'25': '12'}),
    (('power-catamaran-charter-trogir-yachtclub-seget-marina-baotic',), r"Split\w*|Spalato", (40, 0), 'west', 'north', {'8': '12'}),
    (('motorboat-charter-marina-zadar-ex-tankerkomerc',), _TROGIR, (45, 60), 'south-east', 'north', {'25': '60'}),
    (('trogir-sailing-yacht-charter',), r"[Kk]aštel\w*|[Kk]astel\w*|Castelli", (120, 0), 'east', 'north', {}),
]
_DIRS = ('west', 'east', 'south', 'south-east', 'north-west')
_UNIT = (r'(?=\s*(?:km\b|kilomet\w*|Kilomet\w*|kilomèt\w*|chilometr\w*|kilómetr\w*|quil[óô]metr\w*|nm\b|nautical|nautische\w*|'
         r'milles?|miglia|millas?|milhas?|zeemijl\w*|mil\w*|nautičk\w*|NM\b|Seemeilen))')


def _d(*forms):
    return dict(zip(_DIRS, forms))


_EN_DIR = re.compile(r'(?i)(?<![-\w])(?P<d>north(?:-?east|-?west)?|south)(?P<suf>wards?|ern|erly|bound)?(?![-\w])')
_EN_FORMS = {'west': 'west', 'east': 'east', 'south': 'south', 'south-east': 'south-east', 'north-west': 'north-west'}
_EN_SUF = {'ward': {'south-east': '', 'north-west': ''}, 'wards': {'south-east': '', 'north-west': ''},
           'ern': {'south-east': 'ern', 'north-west': 'ern'}, 'erly': {'south-east': 'erly', 'north-west': 'erly'}}

# (pattern, replacement per target, family) — family "south" is only
# replaced where the case allows any direction.
COMPASS_WORDS = {
    'de': [(r'nach Nord(?:osten|westen|en)|nach Süden|nordwärts|südwärts',
            _d('nach Westen', 'nach Osten', 'nach Süden', 'nach Südosten', 'nach Nordwesten')),
           (r'im Nord(?:osten|westen|en)|im Süden', _d('im Westen', 'im Osten', 'im Süden', 'im Südosten', 'im Nordwesten')),
           (r'nordöstlich|nordwestlich|nördlich|südlich', _d('westlich', 'östlich', 'südlich', 'südöstlich', 'nordwestlich')),
           (r'Nord(?:osten|westen|en)|Süden', _d('Westen', 'Osten', 'Süden', 'Südosten', 'Nordwesten')),
           (r'nördliche', _d('westliche', 'östliche', 'südliche', 'südöstliche', 'nordwestliche')),
           (r'nördlichen', _d('westlichen', 'östlichen', 'südlichen', 'südöstlichen', 'nordwestlichen')),
           (r'nördlicher', _d('westlicher', 'östlicher', 'südlicher', 'südöstlicher', 'nordwestlicher'))],
    'fr': [(r"au nord(?:-est|-ouest)?|au sud", _d("à l'ouest", "à l'est", 'au sud', 'au sud-est', 'au nord-ouest')),
           (r"vers le nord(?:-est|-ouest)?|vers le sud", _d("vers l'ouest", "vers l'est", 'vers le sud', 'vers le sud-est', 'vers le nord-ouest')),
           (r"du nord(?:-est|-ouest)?|du sud", _d("de l'ouest", "de l'est", 'du sud', 'du sud-est', 'du nord-ouest')),
           (r"le nord(?:-est|-ouest)?|le sud", _d("l'ouest", "l'est", 'le sud', 'le sud-est', 'le nord-ouest')),
           (r"nord-est|nord-ouest|nord|sud", _d('ouest', 'est', 'sud', 'sud-est', 'nord-ouest'))],
    'it': [(r"a nord(?:-?est|-?ovest)?|a sud", _d('a ovest', 'a est', 'a sud', 'a sud-est', 'a nord-ovest')),
           (r"verso nord(?:-?est|-?ovest)?|verso sud", _d('verso ovest', 'verso est', 'verso sud', 'verso sud-est', 'verso nord-ovest')),
           (r"nord-?est|nord-?ovest|nord|sud", _d('ovest', 'est', 'sud', 'sud-est', 'nord-ovest')),
           (r"settentrionale", _d('occidentale', 'orientale', 'meridionale', 'sud-orientale', 'nord-occidentale'))],
    'es': [(r"al nor(?:te|este|oeste)|al sur", _d('al oeste', 'al este', 'al sur', 'al sureste', 'al noroeste')),
           (r"hacia el nor(?:te|este|oeste)|hacia el sur", _d('hacia el oeste', 'hacia el este', 'hacia el sur', 'hacia el sureste', 'hacia el noroeste')),
           (r"noreste|noroeste|norte|sur", _d('oeste', 'este', 'sur', 'sureste', 'noroeste'))],
    'pt': [(r"a nor(?:te|deste|oeste)|ao norte|a sul", _d('a oeste', 'a leste', 'a sul', 'a sudeste', 'a noroeste')),
           (r"para (?:o )?nor(?:te|deste)|para (?:o )?sul", _d('para oeste', 'para leste', 'para sul', 'para sudeste', 'para noroeste')),
           (r"nordeste|noroeste|norte|sul", _d('oeste', 'leste', 'sul', 'sudeste', 'noroeste'))],
    'nl': [(r"ten noord(?:oosten|westen|en)|ten zuiden", _d('ten westen', 'ten oosten', 'ten zuiden', 'ten zuidoosten', 'ten noordwesten')),
           (r"noordwaarts|naar het noord(?:oosten|en)|naar het zuiden", _d('westwaarts', 'oostwaarts', 'zuidwaarts', 'naar het zuidoosten', 'naar het noordwesten')),
           (r"noordoosten|noordwesten|noorden|zuiden", _d('westen', 'oosten', 'zuiden', 'zuidoosten', 'noordwesten')),
           (r"noordelijke", _d('westelijke', 'oostelijke', 'zuidelijke', 'zuidoostelijke', 'noordwestelijke')),
           (r"noordelijk", _d('westelijk', 'oostelijk', 'zuidelijk', 'zuidoostelijk', 'noordwestelijk')),
           (r"noordwaartse", _d('westwaartse', 'oostwaartse', 'zuidwaartse', 'zuidoostwaartse', 'noordwestwaartse')),
           (r"noord|zuid", _d('west', 'oost', 'zuid', 'zuidoost', 'noordwest'))],
    'pl': [(r"na północny wschód|na północny zachód|na północ|na południe",
            _d('na zachód', 'na wschód', 'na południe', 'na południowy wschód', 'na północny zachód')),
           (r"na północy|na południu", _d('na zachodzie', 'na wschodzie', 'na południu', 'na południowym wschodzie', 'na północnym zachodzie')),
           (r"w kierunku północnym|w kierunku północy|ku północy",
            _d('w kierunku zachodnim', 'w kierunku wschodnim', 'w kierunku południowym', 'w kierunku południowo-wschodnim', 'w kierunku północno-zachodnim')),
           (r"północn(?:ą|a|ej|y|e)\s+pętl\w*", _d('zachodnią pętlę', 'wschodnią pętlę', 'południową pętlę', 'południowo-wschodnią pętlę', 'północno-zachodnią pętlę')),
           (r"pętla\s+północna", _d('pętla zachodnia', 'pętla wschodnia', 'pętla południowa', 'pętla południowo-wschodnia', 'pętla północno-zachodnia'))],
    'hr': [(r"sjeveroistočno|sjeverozapadno|sjeverno|južno", _d('zapadno', 'istočno', 'južno', 'jugoistočno', 'sjeverozapadno')),
           (r"na sjever(?:oistok|ozapad)?|na jug", _d('na zapad', 'na istok', 'na jug', 'na jugoistok', 'na sjeverozapad')),
           (r"na sjeveru|na jugu", _d('na zapadu', 'na istoku', 'na jugu', 'na jugoistoku', 'na sjeverozapadu')),
           (r"prema sjeveru|prema jugu", _d('prema zapadu', 'prema istoku', 'prema jugu', 'prema jugoistoku', 'prema sjeverozapadu')),
           (r"sjevern(?:a|u|oj)\s+petlj\w*", _d('zapadna petlja', 'istočna petlja', 'južna petlja', 'jugoistočna petlja', 'sjeverozapadna petlja')),
           (r"sjevernije", _d('zapadnije', 'istočnije', 'južnije', 'jugoistočnije', 'sjeverozapadnije')),
           (r"sjeverni", _d('zapadni', 'istočni', 'južni', 'jugoistočni', 'sjeverozapadni')),
           (r"sjevera", _d('zapada', 'istoka', 'juga', 'jugoistoka', 'sjeverozapada'))],
}
_SOUTHISH = re.compile(r'(?i)^(?:nach |im |au |vers le |a |verso |al |hacia el |ao |para (?:o )?|ten |naar het |na |prema )?(?:süd|sud|sur|sul|zuid|połud|jug|južn)')


def _swap_direction(word, forms, target, family_any):
    if not family_any and _SOUTHISH.match(word):
        return word
    new = forms[target]
    # Only the first letter follows the original: "Pętla Północna" → "Pętla
    # zachodnia", the sentence case the HR/PL casing pass would give it.
    return new[:1].upper() + new[1:] if word[:1].isupper() else new


def _compass_window(text, locale, target, family_any):
    if locale == 'en':
        def en(m):
            d = m.group('d')
            if d.lower() == 'south' and not family_any:
                return m.group(0)
            suf = m.group('suf') or ''
            new = _EN_FORMS[target] + _EN_SUF.get(suf.lower(), {}).get(target, suf)
            return new[:1].upper() + new[1:] if d[:1].isupper() else new
        return _EN_DIR.sub(en, text)
    for pattern, forms in COMPASS_WORDS[locale]:
        rx = re.compile(r'(?i)(?<![-\w])(?:' + pattern + r')(?![-\w])')
        text = rx.sub(lambda m, forms=forms: _swap_direction(m.group(0), forms, target, family_any), text)
    return text


def fix_compass(src, ctx):
    src = fix_aci(src, ctx)
    slug = ctx.name[:-5]
    cases = [c for c in COMPASS_CASES if slug in c[0]]
    if not cases:
        return src
    head, body, tail = split_body(src)

    def block(tag, attrs, inner):
        out = []
        for piece in split_sentences(inner):
            new = piece
            for _, anchor, (before, after), target, family, numbers, *pair in cases:
                spans = []
                others = list(re.finditer(pair[0], new)) if pair else []
                for am in re.finditer(anchor, new):
                    lo, hi = am.start() - before, am.end() + after
                    for om in others:
                        if abs(om.start() - am.start()) <= 110:
                            lo, hi = min(lo, om.start() - before), max(hi, om.end() + after)
                    spans.append((max(0, lo), min(len(new), hi)))
                # merge overlapping windows, apply once
                merged = []
                for lo, hi in sorted(spans):
                    if merged and lo <= merged[-1][1]:
                        merged[-1] = (merged[-1][0], max(hi, merged[-1][1]))
                    else:
                        merged.append((lo, hi))
                for lo, hi in reversed(merged):
                    window = new[lo: hi]
                    changed = _compass_window(window, ctx.locale, target, family == 'any')
                    if changed != window:
                        for old, repl in numbers.items():
                            changed = re.sub(rf'(?<![\d.,]){old}(?![\d.,]){_UNIT}', repl, changed)
                    new = new[:lo] + changed + new[hi:]
            if new != piece:
                ctx.record('compass', plain(piece)[:200], plain(new)[:200])
            out.append(new)
        return ''.join(out)

    body = edit_blocks(body, block)
    return head + body + tail


# ACI Marina Split is not the biggest base (the charter facts rank Baotić/
# Seget, Kaštela and D-Marin Dalmacija above it): superlatives go, applied
# only in sentences that name ACI (Marina) Split.
ACI_FIXES = {
    'en': [(r'\bMost (Split[\w -]*? (?:charters|catamarans|motorsailers|yachts|power catamarans)) depart', r'Many \1 depart'),
           (r', the (?:region\'s )?largest facility(?: with full services)?,', r', a full-service marina,'),
           (r'\(largest, busiest, central\)', '(central, busy)'), (r'\(the largest\)', '(in the city centre)'), (r'\(largest\)', '(city centre)'),
           (r'\(largest fleet, full services\)', '(full services)'), (r'\(largest fleet\)', '(city centre)'),
           (r'is the region\'s largest facility', 'is a full-service marina in the city centre'),
           (r'is the primary bareboat base, with the largest fleet and most flexible', 'is a major bareboat base, with flexible'),
           (r'is the primary base for', 'is a major base for'),
           (r'anchors the region\'s primary charter operations, located within the city', 'is the charter marina in the city centre')],
    'de': [(r'Die meisten ((?:Katamaran-Charter ab Split|Split-Motorsailer|in Split ansässigen Power-Katamarane|Segelyachten in Split)) starten', r'Viele \1 starten'),
           (r', der größten Anlage(?: der Region)?(?:, die| mit)', lambda m: ', einer Marina mit vollem Service,' + (' die' if m.group(0).endswith('die') else ' mit')),
           (r'\(größte, belebteste, zentral\)', '(zentral, belebt)'), (r'\(die größte\)', '(im Stadtzentrum)'),
           (r'\(größte Flotte, volle Dienstleistungen\)', '(volle Dienstleistungen)'), (r'\(größte Flotte\)', '(im Stadtzentrum)'),
           (r'ist die größte Anlage der Region', 'ist eine Marina mit vollem Service im Stadtzentrum'),
           (r'ist die wichtigste Bareboat-Basis mit der größten Flotte und den flexibelsten', 'ist eine wichtige Bareboat-Basis mit flexiblen')],
    'fr': [(r'La plupart des ((?:locations de catamarans basées à Split|motorsailers de Split|voiliers de Split|locations de luxe)) partent', r'De nombreux \1 partent'),
           (r', la plus grande installation(?: de la région)?(?: avec des services complets)?,', ', une marina offrant tous les services,'),
           (r'\(la plus grande, la plus fréquentée, centrale\)', '(centrale, animée)'), (r'\(la plus grande\)', '(en centre-ville)'),
           (r'\(la plus grande flotte, services complets\)', '(services complets)'), (r'\(installation principale\)', '(en centre-ville)'),
           (r'est la plus grande installation de la région', 'est une marina offrant tous les services en centre-ville'),
           (r'est la principale base de location sans skipper, avec la plus grande flotte et les horaires d\'embarquement/débarquement les plus flexibles',
            "est une base importante de location sans skipper, avec des horaires d'embarquement/débarquement flexibles"),
           (r'est la base principale pour', 'est une base importante pour'),
           (r'concentre les principales opérations de location de la région, située dans la ville', 'est la marina de location du centre-ville')],
    'it': [(r'La maggior parte (dei (?:charter di lusso|motoryacht a vela di Spalato|catamarani a motore con base a Spalato)) (ha origine|parte)', r'Molti \1 \2'),
           (r'\(struttura principale\)', '(in centro città)'), (r'\(flotta più grande, servizi completi\)', '(servizi completi)'),
           (r'\(flotta più grande\)', '(in centro città)'), (r'\(la più grande, più trafficata, centrale\)', '(centrale, animata)'),
           (r'è la base principale per', 'è una base importante per')],
    'es': [(r'La mayoría de (los (?:alquileres de catamaranes con base en Split|alquileres de lujo|motorsailers de Split|catamaranes a motor con base en Split|yates de vela de Split)) (parten|se originan)', r'Muchos de \1 \2'),
           (r', la (?:instalación más grande|mayor instalación de la región con servicios completos),', ', una marina con todos los servicios,'),
           (r'\(instalación principal\)', '(en el centro)'), (r'\(la flota más grande, servicios completos\)', '(servicios completos)'),
           (r'\(la flota más grande\)', '(en el centro)'), (r'\(la más grande, concurrida, céntrica\)', '(céntrica, concurrida)'),
           (r'\(el más grande\)', '(en el centro)'), (r'\(la más grande\)', '(en el centro)'),
           (r'es la instalación más grande de la región', 'es una marina con todos los servicios en el centro de la ciudad'),
           (r'es la principal base de alquiler sin tripulación, con la mayor flota y las opciones de entrada/salida más flexibles',
            'es una base importante de alquiler sin tripulación, con opciones de entrada y salida flexibles'),
           (r'es la base principal para', 'es una base importante para'),
           (r'alberga las principales operaciones de alquiler de la región, ubicada dentro de la ciudad', 'es la marina de alquiler del centro de la ciudad')],
    'pt': [(r'A maioria dos ((?:alugueres de catamarãs com base em Split|alugueres de luxo|motosailers de Split|catamarãs a motor baseados em Split|veleiros de Split)) (parte|origina-se)', r'Muitos \1 \2'),
           (r', a maior instalação(?: da região com serviços completos)?,', ', uma marina com todos os serviços,'),
           (r'\(instalação principal\)', '(no centro)'), (r'\(maior frota, serviços completos\)', '(serviços completos)'), (r'\(maior frota\)', '(no centro)'),
           (r'\(maior, mais movimentada, central\)', '(central, movimentada)'), (r'\(a maior\)', '(no centro)'),
           (r'é a maior instalação da região', 'é uma marina com todos os serviços no centro da cidade'),
           (r'é a principal base para aluguer sem skipper, com a maior frota e os horários de check-in/check-out mais flexíveis',
            'é uma base importante para aluguer sem skipper, com horários de check-in/check-out flexíveis'),
           (r'é a base principal para', 'é uma base importante para')],
    'nl': [(r'De meeste ((?:catamaran charters vanuit Split|Split-motorsailers|motorcatamarans die vanuit Split vertrekken|zeiljachten in Split)) (vertrekken|doen)', r'Veel \1 \2'),
           (r', de grootste faciliteit(?: van de regio met volledige diensten)?,', ', een jachthaven met volledige service,'),
           (r'\(grootste, drukste, centraal\)', '(centraal, druk)'), (r'\(de grootste\)', '(in het centrum)'), (r'\(grootste\)', '(centrum)'),
           (r'\(grootste vloot, volledige diensten\)', '(volledige diensten)'), (r'\(grootste vloot\)', '(in het centrum)'),
           (r'is de grootste faciliteit van de regio', 'is een jachthaven met volledige service in het centrum'),
           (r'is de belangrijkste bareboat basis, met de grootste vloot en de meest flexibele', 'is een belangrijke bareboatbasis, met flexibele'),
           (r'is de belangrijkste basis voor', 'is een belangrijke basis voor')],
    'pl': [(r'Większość ((?:czarterów katamaranów ze Splitu|motorówek żaglowych ze Splitu|katamaranów motorowych stacjonujących w Splicie|jachtów żaglowych ze Splitu)) (wylatuje|wypływa)', r'Wiele \1 wypływa'),
           (r', największego obiektu(?: w regionie z pełnymi usługami)?,', ', mariny z pełną obsługą,'),
           (r'\(największa, najbardziej ruchliwa, centralna\)', '(centralna, ruchliwa)'), (r'\(największa\)', '(w centrum)'),
           (r'\(największa flota, pełne usługi\)', '(pełne usługi)'), (r'\(największa flota\)', '(w centrum)'),
           (r'to największy obiekt w regionie', 'to marina z pełną obsługą w centrum miasta'),
           (r'jest główną bazą dla czarterów bez załogi, z największą flotą i najbardziej elastycznymi', 'jest ważną bazą dla czarterów bez załogi, z elastycznymi'),
           (r'jest główną bazą dla', 'jest ważną bazą dla')],
    'hr': [(r'\(najveća, najprometnija, centralna\)', '(središnja, prometna)'), (r'\(najveća\)', '(u središtu grada)'),
           (r'je najveća luka u regiji', 'je marina s punom uslugom u središtu grada'),
           (r'glavno je polazište za najam bez posade, s najvećom flotom i najfleksibilnijim', 'važno je polazište za najam bez posade, s fleksibilnim'),
           (r'glavna je baza za', 'važna je baza za'),
           (r'sidri glavne čarter operacije regije, smještena unutar grada', 'je čarter marina u središtu grada')],
}


def fix_aci(src, ctx):
    rules = ACI_FIXES.get(ctx.locale)
    if not rules or 'ACI' not in src:
        return src
    head, body, tail = split_body(src)

    def block(tag, attrs, inner):
        out = []
        for piece in split_sentences(inner):
            if re.search(r'ACI\b[^.]{0,20}Split|Split[^.]{0,5}ACI|ACI Split', piece):
                new = piece
                for rx, repl in rules:
                    new = re.sub(rx, repl, new)
                if new != piece:
                    ctx.record('compass', plain(piece)[:200], plain(new)[:200])
                piece = new
            out.append(piece)
        return ''.join(out)

    body = edit_blocks(body, block)
    return head + body + tail


# ----------------------------------------------------------------- casing

# Croatian and Polish do not use Title Case in headings ("Zašto je Katamaran
# Prikladan za Hrvatsku" → "Zašto je katamaran prikladan za Hrvatsku").
# A capitalised word after the first is lowered only when the same corpus
# writes it in lower case mid-sentence in at least 80 % of its uses, so names
# stay ("… za Hrvatsku", "Kvarneru", "Boat4You"). Only H2/H3 headings in
# which most longer words are capitalised are touched. (Rule of the
# fix27/web-ui pass, kept here so a corpus run re-applies it.)
CORPUS_ROOT = []
_CASING_WORD = re.compile(r"[A-Za-zÀ-žĆČĐŠŽćčđšžŁłŃńŚśŹźŻżĄąĘęÓó]+")
_CASING_STATS = {}


def _casing_stats(locale):
    if locale not in _CASING_STATS:
        lower, capmid = {}, {}
        folder = os.path.join(CORPUS_ROOT[0] if CORPUS_ROOT else os.path.join(REPO, 'public', 'seo-content'), locale)
        for name in sorted(os.listdir(folder)):
            if not name.endswith('.html'):
                continue
            src = _read(os.path.join(folder, name))
            for p in re.findall(r'<p[^>]*>(.*?)</p>|<li[^>]*>(.*?)</li>', src, re.S):
                txt = html.unescape(re.sub('<[^>]+>', ' ', p[0] or p[1]))
                for sent in re.split(r'(?<=[.!?:])\s+', txt):
                    for w in _CASING_WORD.findall(sent)[1:]:
                        if w.islower():
                            lower[w] = lower.get(w, 0) + 1
                        elif w[0].isupper() and w[1:].islower():
                            capmid[w.lower()] = capmid.get(w.lower(), 0) + 1
        _CASING_STATS[locale] = (lower, capmid)
    return _CASING_STATS[locale]


def fix_casing(src, ctx):
    if ctx.locale not in ('hr', 'pl'):
        return src
    lower, capmid = _casing_stats(ctx.locale)
    head, body, tail = split_body(src)

    def heading(m):
        tag, attrs, inner = m.group(1), m.group(2), m.group(3)
        text = html.unescape(re.sub('<[^>]+>', '', inner))
        words = _CASING_WORD.findall(text)
        longw = [w for w in words[1:] if len(w) > 3]
        if not longw or sum(1 for w in longw if w[0].isupper()) / len(longw) <= 0.5:
            return m.group(0)
        first = [True]

        def low(wm):
            w = wm.group(0)
            if first[0]:
                first[0] = False
                return w
            if len(w) > 1 and w[0].isupper() and w[1:].islower():
                lw = w.lower()
                if lower.get(lw, 0) >= 1 and capmid.get(lw, 0) / (lower.get(lw, 0) + capmid.get(lw, 0)) < 0.2:
                    return lw
            if len(w) == 1 and w.isupper() and lower.get(w.lower(), 0) >= 50:
                return w.lower()
            return w

        parts = re.split(r'(<[^>]+>)', inner)
        new_inner = ''.join(p if p.startswith('<') else _CASING_WORD.sub(low, p) for p in parts)
        if new_inner == inner:
            return m.group(0)
        ctx.record('casing', plain(inner), plain(new_inner))
        return f'<{tag}{attrs}>{new_inner}</{tag}>'

    body = re.sub(r'<(h[23])([^>]*)>(.*?)</\1>', heading, body, flags=re.S)
    return head + body + tail


# ------------------------------------------------------------------ links

def _read(path):
    with open(path, encoding='utf-8') as fh:
        return fh.read()


class Catalogue:
    """/public/locations snapshot + the web app's name tables, parsed from the
    TypeScript sources so the script resolves names the way the renderer does
    (curatedSeoContent.ts → destinationDid.ts)."""

    def __init__(self):
        rows = json.loads(_read(LOCATIONS_FILE))
        self.by_name, self.by_did = {}, {}
        for row in rows:
            self.by_name.setdefault(norm(row['name']), []).append(row)
            for did in row['id'].split(','):
                self.by_did[did.strip()] = row
        src = os.path.join(REPO, 'src')
        popular = _read(os.path.join(src, 'config', 'popular-searches.config.ts'))
        self.popular = {}
        for entry in re.split(r"\n  \{\n", popular)[1:]:
            label = re.search(r"displayLabel: '([^']+)'", entry)
            cc = re.search(r"countryCode: '([A-Z]{2})'", entry)
            members = re.findall(r"name: '([^']+)'", entry)
            if label and len(members) >= 2:
                spec = {'name': label.group(1), 'id': None, 'type': 'REGION', 'cc': cc.group(1) if cc else None}
                for key in [label.group(1)] + members:
                    self.popular[norm(key)] = spec
        curated = _read(os.path.join(src, 'utils', 'server', 'curatedSeoContent.ts'))
        block = curated[curated.index('CORPUS_LABEL_TARGET'):]
        block = block[: block.index('};')]
        self.overrides = {norm(k): v for k, v in re.findall(r"'?([\w ]+?)'?:\s*'([^']+)'", block.split('{', 1)[1])}
        slug_ts = _read(os.path.join(src, 'utils', 'static', 'curatedSeoSlug.ts'))
        alias_src = slug_ts[slug_ts.index('DESTINATION_ALIAS_SOURCE'): slug_ts.index('const DESTINATION_ALIAS = ')]
        self.alias_prefix = {}
        for m in re.finditer(r"""^\s*(?:'([^']*)'|"([^"]*)"|(\w+)):\s*(\[[^\]]*\]|'[^']*')""", alias_src, re.M):
            key = m.group(1) or m.group(2) or m.group(3)
            for prefix in re.findall(r"'([^']*)'", m.group(4)):
                self.alias_prefix.setdefault(prefix, key)

    def resolve(self, label):
        key = norm(label)
        if not key:
            return None
        key = {'turkiye': 'turkey'}.get(key, key)
        key = norm(EXONYMS.get(key, key))
        if key in self.popular:
            return self.popular[key]
        if key in self.overrides:
            return self.resolve(self.overrides[key])
        rows = self.by_name.get(key)
        if rows:
            # A country before a same-named region (Montenegro, Grenada), a
            # region before a same-named marina (Zadar, Paros).
            rows = sorted(rows, key=lambda r: {'COUNTRY': 0, 'REGION': 1, 'MARINA': 2}[r['type']])
            best = rows[0]
            return {'name': best['name'].strip(), 'id': best['id'] if ',' not in best['id'] else None,
                    'type': best['type'], 'cc': best['cc']}
        if ',' in label:
            for part in label.split(','):
                hit = self.resolve(part)
                if hit:
                    return hit
        return None

    def place_for_slug(self, dest):
        """Catalogue place a corpus file-name prefix is about."""
        if dest in self.alias_prefix:
            hit = self.resolve(self.alias_prefix[dest])
            if hit:
                return hit
        for key, rows in self.by_name.items():
            if slugify(rows[0]['name']) == dest:
                return self.resolve(rows[0]['name'])
        for spec in self.popular.values():
            if slugify(spec['name']) == dest:
                return spec
        return self.resolve(dest.replace('-', ' '))


# Non-English spellings of places used as link labels.
EXONYMS = {
    'croazia': 'croatia', 'kroatien': 'croatia', 'croatie': 'croatia', 'croacia': 'croatia', 'croacia ': 'croatia',
    'kroatie': 'croatia', 'chorwacja': 'croatia', 'hrvatska': 'croatia', 'croatian adriatic': 'croatia',
    'adriatico croato': 'croatia', 'grecia': 'greece', 'griechenland': 'greece', 'grece': 'greece',
    'griekenland': 'greece', 'grecja': 'greece', 'grcka': 'greece', 'italia': 'italy', 'italien': 'italy',
    'italie': 'italy', 'italije': 'italy', 'wlochy': 'italy', 'italija': 'italy', 'spagna': 'spain',
    'spanien': 'spain', 'espagne': 'spain', 'espana': 'spain', 'espanha': 'spain', 'spanje': 'spain',
    'hiszpania': 'spain', 'spanjolska': 'spain', 'francia': 'france', 'frankreich': 'france', 'frankrijk': 'france',
    'francja': 'france', 'francuska': 'france', 'franca': 'france', 'north east egean': 'north east aegean',
    'gulf of tarent': 'gulf of taranto', 'antiparos': 'paros', 'marmaris': 'marmaris fethiye gocek',
}
STALE_DID = {  # dids the corpus was written with, renumbered since (the label says which place)
    'c-98': 'Croatia', 'r-189': 'Split Region', 'r-191': 'Šibenik', 'r-192': 'Zadar', 'r-95': 'Cyclades',
}
VESSEL_ENUM = {'CATAMARAN', 'SAILING_YACHT', 'MOTOR_YACHT', 'LUXURY_MOTOR_YACHT', 'MOTORBOAT', 'MOTORSAILER', 'GULET',
               'POWER_CATAMARAN'}
VESSEL_SLUG = {'catamaran': 'CATAMARAN', 'sailing-yacht': 'SAILING_YACHT', 'motor-yacht': 'MOTOR_YACHT',
               'luxury-motor-yacht': 'LUXURY_MOTOR_YACHT', 'motorboat': 'MOTORBOAT', 'motorsailer': 'MOTORSAILER',
               'gulet': 'GULET', 'power-catamaran': 'POWER_CATAMARAN'}
LOCALISED_PATHS = {'', '/', '/how-we-work', '/faq', '/about-us', '/contact-us', '/blog'}
DEAD_PATHS = {'/contact': '/contact-us', '/practices': None, '/environmental-practices': None, '/deals': None}
ROUTE_OK = re.compile(r'^/(?:(?:de|fr|it|es|pt|nl|pl|hr)(?:/|$))?(?:$|search$|how-we-work$|faq$|about-us$|contact-us$|'
                      r'blog(?:/[a-z0-9-]+)?$|yachts(?:/[a-z0-9-]+){0,2}$|fleet$|itineraries(?:/[a-z0-9-]+){0,3}$|'
                      r'boat/[a-z0-9-]+$|terms-and-conditions$|privacy-policy$)')
ANCHOR = re.compile(r'<a\b(?P<pre>[^>]*?)\shref="(?P<href>[^"]*)"(?P<post>[^>]*)>(?P<inner>[\s\S]*?)</a\s*>')
_CATALOGUE = []


def catalogue():
    if not _CATALOGUE:
        _CATALOGUE.append(Catalogue())
    return _CATALOGUE[0]


def vessel_type(params):
    for key in ('boatTypes', 'boat_types', 'boat_type', 'boatType', 'vesselType'):
        raw = params.get(key)
        if raw:
            value = re.sub(r'[\s-]+', '_', re.sub(r'([a-z])([A-Z])', r'\1_\2', raw[0].strip())).upper()
            return value if value in VESSEL_ENUM else None
    return None


def search_href(place, vtype):
    query = [('destinations', place['name'])]
    if place.get('id'):
        query.append(('did', place['id']))
    if vtype:
        query.append(('boatTypes', vtype))
    return f"{SITE}/search?{urllib.parse.urlencode(query, quote_via=urllib.parse.quote)}"


def parse_corpus_slug(slug):
    """parseCuratedFileSlug (curatedSeoSlug.ts)."""
    m = re.match(r'^(.+?)-(?:sailing-area-)?yacht-charter-and-boat-rental$', slug)
    if m:
        return m.group(1), None
    for vslug in sorted(VESSEL_SLUG, key=len, reverse=True):
        if slug.startswith(f'{vslug}-charter-'):
            return slug[len(vslug) + 9:], VESSEL_SLUG[vslug]
        if slug.endswith(f'-{vslug}-charter'):
            return slug[: -len(vslug) - 9], VESSEL_SLUG[vslug]
    return None, None


def search_link_problem(href, text=''):
    """None when the corpus search link is consistent, else (reason, new place or None)."""
    cat = catalogue()
    url = urllib.parse.urlparse(html.unescape(href))
    params = urllib.parse.parse_qs(url.query)
    label = (params.get('destinations') or params.get('destination') or [''])[0]
    did = (params.get('did') or [''])[0].strip()
    if not label and not did:
        return None
    lab = cat.resolve(label) if label else None
    if did and ',' not in did:
        loc = cat.by_did.get(did)
        if loc:
            if lab and lab.get('cc') and loc.get('cc') and lab['cc'] != loc['cc']:
                return (f'did {did} is {loc["name"]} ({loc["cc"]}), label "{label}" is {lab["cc"]}', lab)
            if lab and lab['type'] == 'COUNTRY' and loc['type'] == 'REGION' and norm(loc['name']) == norm(lab['name']):
                return (f'did {did} is the region named like the country {lab["name"]}', lab)
            return None
        stale = cat.resolve(STALE_DID[did]) if did in STALE_DID else None
        target = lab if lab and (not stale or lab['type'] != 'COUNTRY') else (stale or lab)
        return (f'stale did {did}', target)
    if did:
        return None
    if lab:
        return None
    return (f'label "{label}" is not a catalogue place', None)


def fix_links(src, ctx):
    head, body, tail = split_body(src)
    cat = catalogue()
    existing = ctx.corpus_slugs

    def anchor(m):
        href = m.group('href')
        inner = m.group('inner')
        raw = html.unescape(href)
        if raw.startswith(('mailto:', 'tel:', '#')):
            return m.group(0)
        path_q = re.sub(r'^https?://(?:www\.)?boat4you\.com', '', raw)
        if re.match(r'^https?://', path_q):
            return m.group(0)  # external
        path = path_q.split('?')[0].split('#')[0]
        new = None
        if path == '/search':
            problem = search_link_problem(href, plain(inner))
            if problem:
                reason, place = problem
                vtype = vessel_type(urllib.parse.parse_qs(urllib.parse.urlparse(raw).query))
                if place:
                    new = search_href(place, vtype)
                else:
                    ctx.record('links', href, '(unlinked: ' + reason + ')')
                    return inner
        else:
            slug = path.rstrip('/').rsplit('/', 1)[-1]
            slug = slug[:-5] if slug.endswith('.html') else slug
            is_file = raw.endswith('.html') or not path_q.startswith('/') or (slug in existing and path.count('/') == 1)
            if is_file and path_q not in ('', '/'):
                dest, vtype = parse_corpus_slug(slug)
                place = cat.place_for_slug(dest) if dest else None
                if not place:
                    ctx.record('links', href, '(unlinked: corpus file name, no landing)')
                    return inner
                new = search_href(place, vtype)
            elif path in DEAD_PATHS:
                if DEAD_PATHS[path] is None:
                    ctx.record('links', href, '(unlinked: page does not exist)')
                    return inner
                new = SITE + DEAD_PATHS[path]
                path = DEAD_PATHS[path]
            elif not ROUTE_OK.match(path or '/'):
                ctx.record('links', href, '(unlinked: not a route)')
                return inner
            if ctx.locale != 'en':
                target = (new and re.sub(r'^https?://(?:www\.)?boat4you\.com', '', new)) or path_q
                if target.split('?')[0].split('#')[0] in LOCALISED_PATHS:
                    base = target.split('?')[0].split('#')[0].rstrip('/')
                    new = f'/{ctx.locale}{base}'
        if new is None or new == href:
            return m.group(0)
        ctx.record('links', href, new)
        return f'<a{m.group("pre")} href="{new.replace("&", "&amp;") if "&amp;" in href else new}"{m.group("post")}>{inner}</a>'

    body = ANCHOR.sub(anchor, body)
    return head + body + tail


# ------------------------------------------------------------------ dupes

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
HEAD_ANY = re.compile(r'<h([2-4])\b[^>]*>([\s\S]*?)</h\1\s*>')


def _question_key(text):
    t = plain(text).lower().replace('’', "'").replace('licence', 'license')
    return re.sub(r'[\s?¿!.:]+$', '', t)


def _headings(body):
    return [(m.start(), m.end(), int(m.group(1)), plain(m.group(2))) for m in HEAD_ANY.finditer(body)]


def _next_heading(body, pos, max_level):
    m = re.compile(rf'<h[1-{max_level}]\b').search(body, pos)
    return m.start() if m else len(body)


def fix_dupes(src, ctx):
    """One file, one FAQ: a second FAQ section (the "Plan your charter"
    template appended to files that already had an <h3> FAQ) is merged into
    the first; a question asked twice keeps its first answer; a paragraph
    repeated verbatim (>= 60 characters) keeps its first copy."""
    head, body, tail = split_body(src)
    faq_re = re.compile(FAQ_HEADING[ctx.locale], re.I)

    def faq_heads():
        return [h for h in _headings(body) if faq_re.search(h[3]) and not h[3].rstrip().endswith('?') and len(h[3]) < 70]

    faqs = faq_heads()
    while len(faqs) >= 2:
        first, last = faqs[0], faqs[-1]
        end = _next_heading(body, last[1], last[2])
        units = body[last[1]: end]
        body = body[: last[0]] + body[end:]
        insert = _next_heading(body, first[1], 2)
        body = body[:insert] + units.rstrip() + '\n' + body[insert:]
        ctx.record('dupes', last[3], f'(second FAQ heading removed, {len(re.findall(r"<h[34]", units))} questions moved to the first FAQ)')
        faqs = faq_heads()

    seen = set()
    while True:
        for start, end_h, level, text in _headings(body):
            if not text.rstrip().endswith('?'):
                continue
            key = _question_key(text)
            if key in seen:
                end = _next_heading(body, end_h, level)
                ctx.record('dupes', text, '(repeated question removed)')
                body = body[:start] + body[end:]
                seen = set()
                break
            seen.add(key)
        else:
            break

    seen_p = set()

    def para(m):
        key = plain(m.group(0)).lower()
        if len(key) < 60:
            return m.group(0)
        if key in seen_p:
            ctx.record('dupes', plain(m.group(0))[:160], '(repeated paragraph removed)')
            return ''
        seen_p.add(key)
        return m.group(0)

    body = re.sub(r'\s*<p\b[^>]*>[\s\S]*?</p\s*>', para, body)
    return head + body + tail


# ----------------------------------------------------------------- checks

CYRILLIC = re.compile('[' + chr(0x400) + '-' + chr(0x4FF) + ']')
EN_FUNCTION = {'the', 'and', 'with', 'your', 'which', 'from', 'this', 'that', 'you', 'will', 'are', 'have', 'their',
               'there', 'when', 'where', 'while', 'these', 'those', 'would', 'should', 'could', 'than', 'into',
               'about', 'our', 'for', 'is', 'of', 'to', 'it', 'be', 'can'}
EN_FUNCTION_NOT = {'de': {'will'}, 'nl': {'is', 'of'}, 'pl': {'to'}, 'hr': {'to'}}
PLACE_STOP = set('''Vela Yates Costa Golfo Haven Hafen Marinas Marine Region Toscana Isla Baia Playa Capo Cabo Punta Monte Porto
Voda Luka Stari Novi Mali Alter Klima Sami Olímpic Zante Lefkas Dénia Deportivo Náutico Vecchio Vieux Vieille Côte Darsena
Verde Fort Istria Toscano Arcipelago Isola Golfe Lagoon Laguna Base Grand Gran Joya Apulia Marin Hotel Resort Canal Antico
Turistico Kaštela Dalmacija Kampanija Sicilia Sardegna Sardinia Grecia Croazia Italia Spagna Lagos Santa Saint Sankt
Marina Services Villa Yachtclub Yachting Golf Yacht Azur Yachthafen Club Nautic Nautico Port Harbour Bay Beach Island Islands
National Park Royal Real Nautique Nautica Nàutic Resort Holiday Bahía Bucht Baie Bocca Riva Cala Canale Kanal Otok Uvala'''.split())
UNLINKED_GUIDE = re.compile(
    r"\b(?:our|the)\s+(?:[\w-]+\s+){0,4}(?:price|pricing|licen[cs]e|licensing|documentation|first-time|packing|safety|"
    r"country-by-country)[\w-]*\s+(?:guide|article|breakdown)\b|\bwe have a detailed breakdown\b|"
    r"\bour (?:comprehensive )?guide (?:to|on) (?:renting|chartering|yacht|packing)", re.I)
_PLACE_RX = []


_PLACE_WORD = re.compile(r'\b[A-ZČĆŠŽ][a-zà-žčćđšž]{3,}\b')


def _place_rx():
    """Catalogue place-name tokens (capitalised words of 4+ letters)."""
    if not _PLACE_RX:
        toks = set()
        for rows in catalogue().by_name.values():
            for row in rows:
                if row.get('cc'):
                    toks.update(w for w in re.findall(r'[A-ZČĆŠŽ][a-zà-žčćđšž]{3,}', row['name']) if w not in PLACE_STOP)
        _PLACE_RX.append(frozenset(toks))
    return _PLACE_RX[0]


def _places_in(text):
    return {w for w in _PLACE_WORD.findall(text) if w in _place_rx()}


# ------------------------------------------------------ independent checks
# Written separately from the fixers (and broader), so that what a fixer
# misses still fails --check (26.9.2026 review: checks() reused the fixer
# regexes and could not see their gaps).
_DENY_NOT = {
    'en': r'partner\w*|specialists?|charters?|availability|selection|search|team|network|rentals?|inventory|listings?|experts?|focus|options?|offers?|collection|catalogue|catalog|portfolio|range|expertise|diversity|process|operations|coordinator|directory|search|finder',
    'de': r'Partner\w*|Spezialist\w*|Charter\w*|Verfügbarkeit|Auswahl|Suche|Team|Netzwerk|Vermietung|Inventar|Angebot\w*|Expert\w*|Fokus|Optionen|Liste\w*|Kollektion|Katalog|Portfolio|Sortiment|Expertise|Vielfalt|Prozess|Verzeichnis|Suchmaschine',
    'fr': r'partenaires?|spécialistes?|locations?|disponibilités?|sélection|recherche|équipe|réseau|inventaire|listes?|annonces?|experts?|options?|offres?|collection|catalogue|portefeuille|gamme|expertise|diversité|processus|charters|répertoire|moteur|capitaines|skippers',
    'it': r'partner|specialist\w*|specializzazione|noleggi\w*|charter|disponibilità|selezione|ricerca|team|rete|inventario|annunci|elenchi|esperti|focus|opzioni|offerta|collezione|catalogo|portfolio|gamma|competenza|diversità|processo|directory|esperienza|motore|skipper|gestori|offerte',
    'es': r'socios?|especialistas?|especialización|alquiler\w*|chárteres|disponibilidad|selección|búsqueda|equipo|red|inventario|listados?|expertos|enfoque|opciones|oferta|colección|catálogo|cartera|gama|experiencia|diversidad|proceso|listas|directorio|buscador|ofertas|patrones|gestores',
    'pt': r'parceiros?|especialistas?|especialização|alugue\w*|charters?|disponibilidade|seleção|pesquisa|equipa|rede|inventário|listagens?|foco|opções|oferta|coleção|catálogo|portfólio|gama|experiência|processo|FAQ|diretório|motor|ofertas|skippers|gestores',
    'nl': r'partners?|specialist\w*|specialisatie|charters?|verhuur|beschikbaarheid|selectie|zoek\w*|team|netwerk|inventaris|lijst\w*|experts?|focus|opties|aanbod|makelaars|collectie|catalogus|portfolio|assortiment|expertise|diversiteit|proces|vlootopties|zoekmachine|overzicht',
    'pl': r'partner\w*|specjali\w*|czarter\w*|dostępnoś\w*|wyb\w*|wyszuk\w*|zesp\w*|sie\w*|katalog\w*|list\w*|ofert\w*|selekcj\w*|proces\w*|koncentracj\w*|opcj\w*|kolekcj\w*|portfolio|asortyment\w*|koordynator\w*|różnorodnoś\w*|katalog\w*|wyszukiwark\w*|skipper\w*',
    'hr': r'partner\w*|stručnjak\w*|specijalist\w*|najam\w*|najm\w*|charter\w*|dostupnost\w*|izbor\w*|pretrag\w*|tražilic\w*|tim\w*|mrež\w*|ponud\w*|popis\w*|fokus|opcij\w*|brokeri|inventar\w*|katalog\w*|kolekcij\w*|portfelj\w*|proces\w*|koordinator\w*|stručnjac\w*|direktorij\w*|pretraživač\w*|stručnost\w*|selekcij\w*|odabir\w*|flotil\w*|upravitelj\w*',
}


_FUNCTION = r'de|di|da|du|des|del|della|dei|of|van|von|z|ze|od|za|u|w|na|e|et|y|and|und|en|i|oraz|voor|für|pour|per|para|com|con|met|with|in|im|au|a|al|ao|do|dla|s|sa|iz'


def _mid_words(loc, n):
    return r'(?:(?!(?:' + _DENY_NOT[loc] + r'|' + _FUNCTION + r')\b)[\w-]+\s+){0,' + str(n) + r'}?'


_BOAT_EN = r'fleets?|catamarans|yachts|vessels|boats|monohulls|motorboats|gulets|sailboats|motorsailers'
CLAIM_DENY = {
    'all': [
        r"Boat4You['’]s\s+(?:[\w-]+\s+)?standards\b|\b(?:[\w-]*[Ss]tandards|normen|normes|estándares|padrões|normas|standardami|standardima)\s+(?:(?!(?:with|on|in|for|at|und|et|e|y|en|i)\b)\w+\s+)?"
        r"(?:(?:of|von|de|di|van|da|della)\s+)?Boat4You\b(?!\s*[-'’])(?!\s+(?:charter\s+)?(?:partners?|listings?|search|process\w*))|"
        r"\b(?:gli|degli|agli|negli|dagli|i)\s+standard\s+(?:\w+\s+)?(?:di\s+)?Boat4You\b",
        r"\bBoat4You\s+(?:\w+\s+)?(?:manages|runs|gestisce|gère|verwaltet|beheert|gestiona|gere|zarządza|obsługuje|dysponuje|upravlja|opereert)\s+"
        r"(?:(?!(?:selection|selezione|selección|sélection|selectie|seleção|wyborem|charters?|czarter\w*|noleggi\w*|locations?|alquiler\w*|"
        r"aluguer\w*|verhuur\w*|najm\w*|bookings?|logistics|logistyk\w*|every|each|all|elk|alle)\b)[\w'’-]+\s+){0,4}?"
        r"(?![\w-]*(?:charter|czarter|verhuur|noleggi|klant|gast))[\w-]*(?:fleets?|[Ff]lott[ae]n?|[Ff]lot[aąeyęo]\w*|vloot|vloten|flotas?|frotas?|boats|yachts|catamarans|vessels|Boote|Yachten|"
        r"Katamarane|barche|imbarcazioni|catamarani|bateaux|voiliers|barcos|yates|catamaranes|iates|catamarãs|boten|jachten|"
        r"katamaran\w*|jacht\w*|łodzi\w*|łodzie|brodov\w*|plovil\w*)\b(?!\s+selection)",
        r"Boat4You\b(?!\s+(?:współpracuje|works\s+with|cooperates|collabora|coopera|werkt\s+samen|surađuje|arbeitet))[^.]{0,80}?(?:gestione della flotta|fleet management|Flottenmanagement|gestion de (?:la )?flotte|gestión de (?:la )?flota|"
        r"gestão d[ae] frota|vlootbeheer|zarządzani\w+ flot\w+|upravljanj\w+ flot\w+)",
        r"Boat4You['’]s?\s+(?:own\s+)?(?:(?!(?:partner\w*|inventory|inventaris|listings?|search|network|and|en)\b)[\w-]+\s+){0,2}?(?:" + _BOAT_EN + r")\b",
        r"\b(?:[Ff]lott[ae]|[Ff]lotas?|[Ff]rotas?|[Ff]lottes?|\w*[Ff]lotten?|\w*[Vv]lo(?:ot|ten)|[Ff]lot[aęyąoiu]\w*)\s+(?:de\s+|di\s+|da\s+|do\s+|van\s+|von\s+|der\s+|des\s+|del\s+)?(?:la\s+|a\s+)?Boat4You\w*",
        r"(?<!przez )(?<!through )(?<!via )(?<!über )(?<!par )(?<!tramite )(?<!preko )(?<!kroz )\bBoat4You[- ](?:Flotten?|flottes?|fleets?|vloot|vloten|catamarans|katamarans|Katamarane|jachten|zeiljachten|Segelyachten|Yachten|Boote|yachts|boats|flota|frota|flotta)\b",
    ],
    'en': [
        r"\b(?:[Ee]very|[Ee]ach|[Yy]our|[Aa]|typical|[Mm]ost|[Mm]any|[Aa]ll)\s+Boat4You\s+(?:sailing\s+|motor\s+|power\s+|crewed\s+)?(?:yacht|catamaran|boat|vessel|gulet|monohull)s?\b(?!\s+(?:charters?|rentals?|clients?|guests?|customers?|partners?|listings?|owners?))",
        r"\b[Oo]ur\s+(?!partner)(?:(?!(?:of|for|and|or|to|in|at|with|from|the|a|an|partner\w*|specialists?|team|network|search|selection)\b)[\w-]+\s+){0,3}?(?:" + _BOAT_EN + r")\b"
        r"(?!\s+(?:search|specialists?|experts?|charters?|listings?|inventory|collection|portal|packages?|page|guide|section|team|brokers?|crews?|skippers?|management|managers?|coordinators?)\b)",
        r"\b[Ww]e\s+(?:\w+ly\s+)?(?:inspect|maintain|service|repair|own|operate)\s+(?:every|each|all|our|the|a)?\s*(?:[\w-]+\s+){0,2}?(?:vessels?|boats?|yachts?|catamarans?|fleets?)\b",
        r"\b(?:[Oo]ur|Boat4You['’]s?)\s+maintenance\s+team\b|\bfleet integrity\b",
        r"Boat4You['’]s\s+(?:[\w-]+\s+){0,2}?operations?\s+(?:cent(?:er|re)|hub|base)\b|Boat4You['’]s\s+(?:[\w-]+\s+){0,2}?operations\s+(?:from|in|at)\b|"
        r"\bBoat4You['’]s\s+\w+\s+operation\b",
        r"\bBoat4You\s+(?:\w+ly\s+)?(?:owns|operates|maintains|inspects|services|repairs)\s+(?:(?:its|a|an|the|every|each|all|\d+)\s+)?(?:[\w-]+\s+){0,2}?(?:" + _BOAT_EN + r")\b",
    ],
    'de': [
        r"\b[\w-]*(?:[Yy]achten|[Kk]atamarane|[Bb]oote|Gulets)\s+von\s+Boat4You\b",
        r"\b[Uu]nser(?:e|er|en|es)?\s+(?:(?!(?:" + _DENY_NOT['de'] + r")\b)(?:[a-zäöüß][\w-]*|\d+)\s+){0,3}?[\w-]*(?:[Ff]lotten?|[Kk]atamarane\w*|[Yy]achten|[Bb]oote\w*|[Ss]chiffe\w*)\b(?!\s+unserer\s+Partner)(?!\s+[a-zäöüß]\w*ende)",
        r"\b[Ww]ir\s+(?:\w+\s+)?(?:überprüfen|prüfen|inspizieren|warten|pflegen)\s+(?:jedes|jede|jeden|alle|unsere)\s+(?:\w+\s+)?\w*(?:Schiff|Boot|Yacht|Katamaran|Flotte)",
        r"\bBoat4You\s+(?:\w+\s+)?(?:besitzt|betreibt|wartet|inspiziert|unterhält)\s+(?:(?:eine|die|ihre|seine|alle|jedes|\d+)\s+)?(?:[\w-]+\s+){0,2}?\w*(?:[Ff]lotte|[Kk]atamarane|[Yy]achten|[Bb]oote|[Ss]chiffe)\b",
    ],
    'fr': [
        r"(?<!locations de )(?<!location de )(?<!recherche de )\b(?:catamarans|voiliers|bateaux|yachts|monocoques|navires)(?:\s+(?:à\s+(?:moteur|voile)|monocoques))?\s+de\s+Boat4You\b",
        r"\b(?:[Nn]otre|[Nn]os)\s+" + _mid_words('fr', 2) + r"(?:flottes?|catamarans|voiliers|yachts|bateaux|navires|vedettes|monocoques)\b(?!\s+de\s+nos\s+partenaires)",
        r"\b[Nn]ous\s+(?:\w+\s+)?(?:vérifions|inspectons|entretenons|contrôlons)\s+(?:chaque|tous les|toutes les|nos|les)\s+(?:navire|bateau|yacht|catamaran|flotte)",
    ],
    'it': [
        r"(?<!charter di )(?<!noleggio di )(?<!noleggi di )(?<!charter )\b(?:catamarani|barche|yacht|imbarcazioni|velieri|caicchi)(?:\s+a\s+(?:vela|motore))?\s+(?:di\s+)?Boat4You\b(?!\s+(?:offre|propone|è|ha|gestisce|consente|fornisce|garantisce|può|dispone|seleziona|collabora|verifica|organizza|si|vi|ti|Le|mette)\b)",
        r"\b[Nn]ostra\s+" + _mid_words('it', 2) + r"flott[ae]\b",
        r"\b[Nn]ostr[ie]\s+" + _mid_words('it', 2) + r"(?:catamarani|yacht|barche|imbarcazioni|velieri|monoscafi|motoscafi)\b(?!\s+dei\s+nostri\s+partner)",
        r"\b(?:[Vv]erifichiamo|[Ii]spezioniamo|[Mm]anteniamo|[Cc]ontrolliamo)\s+(?:\w+\s+)?(?:ogni|tutte|tutti|le|gli|i)\s+(?:\w+\s+)?(?:imbarcazion|barc|yacht|catamaran|flott)",
    ],
    'es': [
        r"(?<!alquileres de )(?<!alquiler de )(?<!experiencias en )\b(?:catamaranes|yates|veleros|barcos|embarcaciones|goletas|lanchas)(?:\s+(?:de\s+vela|a\s+motor))?\s+de\s+(?:la\s+)?Boat4You\b",
        r"\b[Nn]uestr[ao]s?\s+" + _mid_words('es', 2) + r"(?:flotas?|catamaranes|yates|veleros|barcos|embarcaciones|monocascos)\b(?!\s+de\s+nuestros\s+socios)",
        r"\b(?:[Vv]erificamos|[Ii]nspeccionamos|[Mm]antenemos|[Rr]evisamos)\s+(?:\w+\s+)?(?:cada|todas|todos|las|los|nuestr\w+)\s+(?:\w+\s+)?(?:embarcaci|barco|yate|catamar|flota)",
    ],
    'pt': [
        r"(?<!charter de )(?<!aluguer de )(?<!alugueres de )\b(?:catamarãs|iates|veleiros|barcos|embarcações|lanchas)(?:\s+(?:à\s+vela|a\s+motor))?\s+da\s+Boat4You\b",
        r"\b[Nn]oss[ao]s?\s+" + _mid_words('pt', 2) + r"(?:frotas?|catamarãs|iates|veleiros|barcos|embarcações|monocascos)\b(?!\s+dos\s+nossos\s+parceiros)",
        r"\b(?:[Vv]erificamos|[Ii]nspecionamos|[Mm]antemos|[Rr]evemos)\s+(?:\w+\s+)?(?:cada|todas|todos|as|os)\s+(?:\w+\s+)?(?:embarca|barco|iate|catamar|frota)",
    ],
    'nl': [
        r"\b(?:\w*jachten|catamarans|\w*boten|schepen|vaartuigen)\s+van\s+Boat4You\b|\b(?:[Ee]en|[Uu]w|[Ee]lk|[Ee]lke|typisch|meeste)\s+Boat4You\s+(?:\w*jacht|\w*jachten|catamarans?|\w*boot|\w*boten|gulets?)\b",
        r"\b[Oo]nze\s+" + _mid_words('nl', 2) + r"\w*(?:vloot|vloten|catamarans|jachten|boten|schepen|vaartuigen)\b(?!\s+van\s+onze\s+partners)",
        r"\b[Ww]e\s+(?:\w+\s+)?(?:inspecteren|controleren|onderhouden)\s+(?:elk|elke|alle|onze|de)?\s*\w*(?:schip|schepen|boot|boten|jacht|jachten|vaartuig|catamaran|vloot)",
    ],
    'pl': [
        r"(?<!czarteru )(?<!czarterów )(?<!czarter )\b(?:jachty|jachtów|katamarany|katamaranów|łodzie|jednostki)(?:\s+(?:żaglowe|żaglowych|motorowe|motorowych))?\s+Boat4You\b",
        r"\b[Nn]asz(?:a|ej|ą|e|ych|ymi|ym)?\s+" + _mid_words('pl', 2) + r"(?:flot[aęyąo]\w*|katamaran[yóa]\w*|jacht[yóa]\w*|łodzie|jednostki)\b(?!\s+naszych\s+partnerów)",
        r"\b(?:[Ww]eryfikujemy|[Ss]prawdzamy|[Kk]ontrolujemy|[Ss]erwisujemy)\s+(?:\w+\s+)?(?:każd\w+|wszystkie|nasze)\s+(?:statek|statk|jednost|łód|łodz|jacht|katamaran)",
    ],
    'hr': [
        r"(?<![\w.])Boat4You\s+(?:jedrilic\w*|katamaran\w*|brodov\w*|plovil\w*|jaht\w*|gulet\w*)\b|\b(?:jedrilice|katamarani|brodovi|guleti)\s+Boat4You\b",
        r"\b[Nn]aš\s+vozni\s+park\b",
        r"\b[Nn]aš(?:a|u|oj|om)?\s+" + _mid_words('hr', 2) + r"flot[aeiu]\w*\b(?!\s+naših\s+partnera)",
        r"\b[Nn]aš(?:a|ih|im|ima)\s+" + _mid_words('hr', 2) + r"plovil\w*\b(?!\s+naših\s+partnera)",
        r"\b[Nn]aš(?:e|i|ih|im|ima)\s+" + _mid_words('hr', 2) + r"(?:katamaran[aie]\w*|jaht(?:e|i|ama)|jedrilic(?:e|a|ama)|brodov\w*)\b(?!\s+naših\s+partnera)",
        r"\b(?:[Pp]rovjeravamo|[Pp]regledavamo|[Oo]državamo)\s+(?:\w+\s+)?(?:svako|svaki|svaku|sva|sve|naša|naše)\s+(?:plovil|brod|jaht|katamaran)",
    ],
}
# A heading whose object (the brand) was removed: "Warum für …", "Dlaczego
# wybrać do …" — written apart from HEADING_HOLE so a gap in it still shows.
HEADING_HOLE_CHECK = re.compile(
    r'^(?:Warum für|Why [Cc]hoose for|Why for|Pourquoi (?:choisir )?pour|Perché (?:scegliere )?per|¿?Por qué (?:elegir )?para|'
    r'Porqu[eê] (?:escolher )?para|Waarom (?:kiezen )?voor voor|Dlaczego (?:wybrać )?(?:do|na|dla)|Zašto (?:odabrati )?za)\b')
RAW_VISIBLE = re.compile(r'boat4you\.com/|https?://|\bwww\.[a-z]|">|\bhref=', re.I)
BRACKET_VISIBLE = re.compile(r'\[[^\]\n]{1,40}\]')
_YEAR_CLAIM = re.compile(r'\b(?:since|seit|depuis|dal|desde|sinds|od|od roku)\s+((?:19|20)\d\d)\b')
_FOUNDED_WORD = re.compile(r'(?i)\b(?:founded|established|gegründet|fondée?|fondata|fundad[ao]|opgericht|założon\w*|osnovan\w*)\b')
_EXPERIENCE_CLAIM = re.compile(r'\b(?:1[4-9]|[2-9]\d)\+?\s+(?:years?|Jahre\w*|ans|anni|años|anos|jaar|lat|godina)\b')
COMPASS_WRONG = {  # (anchor, other place, wrong direction words, window spans both places)
    # Trogir lies due west of Split: any "north" near the pair is wrong.
    'Trogir~Split': (r'Trogir|Traù', r'Split|Spalat', {
        'en': r'north(?:-?east|wards?|ern|erly|bound)?', 'de': r'nord(?:östlich|wärts|en)?|nördlich\w*|Norden|Nord-\w+',
        'fr': r'nord(?:-est)?', 'it': r'nord(?:-?est)?|settentrional\w*', 'es': r'nor(?:te|este)', 'pt': r'nor(?:te|deste)',
        'nl': r'noord(?!west)\w*', 'pl': r'półno(?!cno-zach)\w*', 'hr': r'sjever(?!ozapad)\w*'}, True),
    # Trogir lies east-south-east of Primošten and Rogoznica.
    'Trogir~Primošten/Rogoznica': (r'Trogir|Traù', r'Primo[sš]ten|Rogoznic', {
        'en': r'north(?:ern|wards?|bound)?', 'de': r'nord(?!west)\w*|nördlich\w*|Norden', 'fr': r'nord', 'it': r'nord', 'es': r'norte',
        'pt': r'norte', 'nl': r'noord(?!west)\w*', 'pl': r'półno(?!cno-zach)\w*', 'hr': r'sjever(?!ozapad)\w*'}, True),
    # Hvar lies south-east of Trogir ("Hvar, north-west of Trogir").
    'Hvar~Trogir': (r'Hvar', r'Trogir|Traù', {
        'en': r'north-?west', 'de': r'nordwest\w*', 'fr': r'nord-ouest', 'it': r'nord-?ovest', 'es': r'noroeste', 'pt': r'noroeste',
        'nl': r'noordwest\w*', 'pl': r'północno-zachod\w*', 'hr': r'sjeverozapad\w*'}, False),
}
ACI_SPLIT_SUPERLATIVE = re.compile(
    r'ACI\s+(?:Marina\s+)?Split\b[^.]{0,60}?(?:\b(?:largest|biggest|busiest|größte\w*|größten|plus grand\w*|più grande|flotta più grande|más grande|mayor flota|la mayor|maior|grootste|największ\w*|najveć\w*)\b|'
    r'\b(?:primary|principal\w*|main|wichtigste|principale|główn\w*|glavn\w*|belangrijkste)\s+(?:\w+\s+){0,2}?(?:base|basis|Basis|Bareboat-Basis|bazą|baza|polazište))',
    re.I)
LANG_STOPWORDS = {
    'en': 'the and with your which from this that you will are have their there when where for is of to it be can our',
    'de': 'der die das und mit ist sie ihr ihre ein eine den dem des nicht auch für von auf zu im wird werden oder sich',
    'fr': 'le la les et des une un est vous votre vos pour avec dans sur qui que du au aux pas plus sont ce',
    'it': 'il lo la gli le e di che per con una un è sono della del delle dei nel nella alla al questo più',
    'es': 'el la los las y de que en con una un es por para su sus del al se más como está son',
    'pt': 'o a os as e de que em com uma um é para por do da dos das no na ao mais seu sua são',
    'nl': 'de het een en van in is met voor op dat die zijn u uw te bij naar ook niet of',
    'pl': 'i w z na do się jest oraz dla że to od po jak przez są lub ich jego',
    'hr': 'i u je na za se da s od su kao ili koji koja što po iz sa prema biti',
    'tr': 've bir bu için ile da de olarak daha en çok gibi olan veya ise',
}
LANG_STOPWORDS = {k: set(v.split()) for k, v in LANG_STOPWORDS.items()}


def language_of(text):
    words = re.findall(r"[a-zà-žąćęłńóśźżçğışöü]+", text.lower())
    if len(words) < 100:
        return None
    scores = {k: sum(1 for w in words if w in v) / len(words) for k, v in LANG_STOPWORDS.items()}
    return max(scores, key=scores.get)


def _sentences(text):
    return re.split(r'(?<=[.!?])\s+', text)


def independent_checks(body, locale, text):
    out = []
    for rx in CLAIM_DENY['all'] + CLAIM_DENY.get(locale, []):
        for bm in BLOCK.finditer(body):
            block_text = plain(bm.group(3))
            for m in re.finditer(rx, block_text):
                out.append(('claim', block_text[max(0, m.start() - 60): m.end() + 60]))
    for bm in re.finditer(r'<(p|li)\b[^>]*>([\s\S]*?)</\1\s*>', body):
        block_text = plain(bm.group(2))
        if re.search(r',$|,\s*(?:and|und|et|e|y|en|i|oraz)$', block_text):
            out.append(('dangling-end', block_text[-120:]))
    for hm in re.finditer(r'<h[1-4]\b[^>]*>([\s\S]*?)</h[1-4]\s*>', body):
        heading = plain(hm.group(1)).strip()
        if HEADING_HOLE_CHECK.match(heading):
            out.append(('heading-hole', heading[:120]))
    for m in RAW_VISIBLE.finditer(text):
        out.append(('raw-url', text[max(0, m.start() - 60): m.end() + 60]))
    for m in BRACKET_VISIBLE.finditer(text):
        out.append(('placeholder', text[max(0, m.start() - 60): m.end() + 60]))
    for bm in BLOCK.finditer(body):
        if bm.group(1) == 'td':
            continue
        block_text = plain(bm.group(3))
        starts = [(0, block_text)] + [(sm.end(), block_text[sm.end():]) for sm in re.finditer(r'[.!?…]["”»’)]*\s+(?=\S)', block_text)
                                      if not SUBJECT_ABBR.search(block_text[max(0, sm.start() - 40): sm.start()])]
        for pos, rest in starts:
            word = re.match(r"[^\s]*", rest).group(0)
            if rest[:1].isalpha() and rest[:1].islower() and word.rstrip('.,;:') not in SUBJECT_SKIP_WORDS and not word.lower().startswith('boat4you'):
                out.append(('lower-start', block_text[max(0, pos - 40): pos + 80]))
    # Sentences per block: a heading never runs into the next paragraph.
    sentences = [x for bm in BLOCK.finditer(body) for x in _sentences(plain(bm.group(3)))]
    for sentence in sentences:
        company = COMPANY_VOICE.search(sentence)
        ym = _YEAR_CLAIM.search(sentence)
        if ym and company and ym.group(1) != '2013' and (1990 <= int(ym.group(1)) < 2013) and (
                _FOUNDED_WORD.search(sentence) or re.search(r'Boat4You|[Cc]harter\w*|noleggi\w*|czarter\w*|iznajm\w*|najm\w*', sentence)):
            out.append(('founded', sentence[:200]))
        if re.search(r'Boat4You\W+(?:\w+\W+){0,6}?' + _EXPERIENCE_CLAIM.pattern, sentence) and EXPERIENCE_WORD.search(sentence):
            out.append(('founded', sentence[:200]))
        for key, (a, b, dirs, span) in COMPASS_WRONG.items():
            others = [m for m in re.finditer(b, sentence)] if dirs.get(locale) else []
            if not others:
                continue
            wrong = re.compile(r'(?<![-\w])(?:' + dirs[locale] + r')(?![-\w])', re.I)
            for am in re.finditer(a, sentence):
                lo, hi = am.start() - 35, am.end() + 45
                for bm in others if span else ():
                    if abs(bm.start() - am.start()) <= 90:  # "north from Split, visiting Trogir"
                        lo, hi = min(lo, bm.start() - 35), max(hi, bm.end() + 45)
                if wrong.search(sentence[max(0, lo): hi]):
                    out.append(('compass', f'{key}: {sentence[:200]}'))
                    break
        if ACI_SPLIT_SUPERLATIVE.search(sentence):
            out.append(('aci-split', sentence[:200]))
    lang = language_of(text)
    if lang and lang != locale and not (locale in ('es', 'pt') and lang in ('es', 'pt')):
        out.append(('wrong-language', f'text reads as {lang}'))
    return out


# Retranslated from the corrected EN text (26.9.2026): the translation may not
# carry a number the EN page does not have (a stale "40 km" or "since 2008").
RETRANSLATED = {
    'italian-adriatic-sailing-area-yacht-charter-and-boat-rental.html', 'catamaran-charter-olbia.html',
    'balearic-islands-sailing-yacht-charter.html', 'veneto-motor-yacht-charter.html',
    'veneto-sailing-area-yacht-charter-and-boat-rental.html', 'epirus-sailing-area-yacht-charter-and-boat-rental.html',
}
_NUMBER = re.compile(r'(?<![\w.,])\d+(?:[.,]\d+)?(?![\w])')


def _numbers(text):
    """Numbers in a text, thousands separators removed ("1,800", "1.800",
    "1 800" → 1800) and decimal commas read as points."""
    prev = None
    while prev != text:
        prev = text
        text = re.sub(r'(?<![\d.,])(\d{1,3})[\s\u00a0\u202f.,](\d{3})(?![\d])', r'\1\2', text)
    return {n.replace(',', '.') for n in _NUMBER.findall(text)}


def checks(src, locale, name, en_src=None):
    """[(check id, excerpt)] for one corpus file (after the fixers ran)."""
    out = []
    head, body, _ = split_body(src)
    text = plain(body)
    head_text = ' '.join(plain(x) for x in re.findall(r'<title[^>]*>([\s\S]*?)</title>', head)) + ' ' + \
        ' '.join(html.unescape(x) for x in re.findall(r'<meta name="description" content="([^"]*)"', head))

    def add(check, m, source):
        out.append((check, source[max(0, m.start() - 60): m.end() + 60]))

    for m in OPERATOR.finditer(text + ' ' + head_text):
        add('operator', m, text + ' ' + head_text)
    if OPERATOR_TITLE.search(head):
        out.append(('operator', 'title: Ionian Catamarans'))
    for m in _river_rx(locale, 'hard').finditer(text + ' ' + head_text):
        add('inland', m, text + ' ' + head_text)
    for sentence in re.split(r'(?<=[.!?])\s+', text) + [head_text]:
        if _river_rx(locale, 'soft').search(sentence) and not RIVER_ALLOW.search(sentence):
            out.append(('inland', sentence[:200]))
    for m in OUR_FLEET[locale][0].finditer(text):
        add('claim-our-fleet', m, text)
    subj = re.compile(rf"\bBoat4You\s+(?:[\w-]+(?:ly|lich|ment|mente|nie|no)\s+)?(?:(?:{OPERATE[locale]})\b|{UPKEEP[locale]})")
    for m in subj.finditer(text):
        before = text[max(0, m.start() - 25): m.start()]
        if not (before.strip() and _not_subject(before)):
            add('claim-operates', m, text)
    for m in re.finditer(PRIORITY_BERTH[locale], text, re.I):
        add('claim-priority-berth', m, text)
    if locale == 'en':
        for m in BRAND_BOATS_EN.finditer(text):
            add('claim-brand-boats', m, text)
    for bm in BLOCK.finditer(body):
        block_text = plain(bm.group(3))
        for pattern, _ in BRAND_FLEET.get(locale, []):
            for m in pattern.finditer(block_text):
                add('claim-brand-fleet', m, block_text)
    for sentence in re.split(r'(?<=[.!?])\s+', text):
        if 'Boat4You' in sentence and FOUNDED.search(sentence):
            out.append(('founded', sentence[:160]))
    for pattern, _ in CLAIM_EXACT.get(locale, []):
        if pattern in body:
            out.append(('claim-operates', pattern))

    for m in ANCHOR.finditer(body):
        raw = html.unescape(m.group('href'))
        path_q = re.sub(r'^https?://(?:www\.)?boat4you\.com', '', raw)
        if raw in ('#', ''):
            out.append(('href-dead', 'placeholder href="' + raw + '"'))
            continue
        if raw.startswith(('mailto:', 'tel:', '#')) or re.match(r'^https?://', path_q):
            continue
        path = path_q.split('?')[0].split('#')[0]
        if raw.endswith('.html') or (path_q and not path_q.startswith('/')):
            out.append(('href-file', raw))
        elif path == '/search':
            problem = search_link_problem(raw, plain(m.group('inner')))
            if problem:
                out.append(('href-did', f'{raw} → {problem[0]}'))
        elif path in DEAD_PATHS or not ROUTE_OK.match(path or '/'):
            out.append(('href-dead', raw))
        elif locale != 'en' and path.rstrip('/') in {p.rstrip('/') for p in LOCALISED_PATHS}:
            out.append(('href-locale', raw))
    nested = re.search(r'<a\b[^>]*>(?:(?!</a\s*>)[\s\S])*?(?:<a\b|</(?:p|li|h[1-6]|td)\s*>)', body)
    if nested:
        out.append(('nested-a', nested.group(0)[:160]))
    if COPYRIGHT_BLOCK.search(body) or NAV_BAR.search(body):
        out.append(('furniture', (COPYRIGHT_BLOCK.search(body) or NAV_BAR.search(body)).group(0)[:160]))
    m = CYRILLIC.search(src)
    if m:
        add('cyrillic', m, src)
    if locale == 'en':
        for m in UNLINKED_GUIDE.finditer(body):
            sentence_start = max(body.rfind('. ', 0, m.start()), body.rfind('>', 0, m.start()))
            sentence_end = body.find('.', m.end())
            if '<a ' not in body[sentence_start: sentence_end if sentence_end > 0 else len(body)]:
                add('guide-unlinked', m, body)
    else:
        words = re.findall(r"[a-zA-ZÀ-ž']+", text.lower())
        if len(words) > 150:
            fn = EN_FUNCTION - EN_FUNCTION_NOT.get(locale, set())
            ratio = sum(1 for w in words if w in fn) / len(words)
            if ratio > 0.05:
                out.append(('english', f'{ratio:.1%} English function words'))
        if en_src:
            mine = _places_in(text)
            theirs = _places_in(plain(split_body(en_src)[1]))
            extra = sorted(mine - theirs)
            if len(extra) >= 5:
                out.append(('foreign-places', ', '.join(extra[:10])))
    paras = [plain(p).lower() for p in re.findall(r'<p\b[^>]*>([\s\S]*?)</p\s*>', body)]
    seen = set()
    for p in paras:
        if len(p) >= 60 and p in seen:
            out.append(('dup-paragraph', p[:120]))
        seen.add(p)
    heads = [plain(h).lower() for h in re.findall(r'<h[23]\b[^>]*>([\s\S]*?)</h[23]\s*>', body)]
    for h in {h for h in heads if heads.count(h) > 1 and h}:
        out.append(('dup-heading', h[:120]))
    out.extend(independent_checks(body, locale, text))
    if locale != 'en' and en_src and name in RETRANSLATED:
        extra = sorted(_numbers(text) - _numbers(plain(split_body(en_src)[1])))
        if extra:
            out.append(('numbers-parity', 'numbers not in the EN page: ' + ', '.join(extra[:10])))
    return out


# ------------------------------------------------------------------ edits

# One-off text fixes found in the 26.9.2026 audit, kept here so a reverted
# file gets them again: (locale, file, old plain text, new HTML).
BLOG_COST = f'{SITE}/blog/yacht-charter-cost-2026-full-breakdown'
BLOG_BUDGET = f'{SITE}/blog/yacht-charter-on-a-budget-money-saving-tactics'
BLOG_LICENCE = f'{SITE}/blog/do-i-need-sailing-license-charter-yacht-croatia-greece-italy-spain-turkey-2026'
BLOG_SKIPPER = f'{SITE}/blog/bareboat-vs-skippered-charter-guide'


def _a(href, text):
    return f'<a href="{href}">{text}</a>'


def _faq(locale):
    return f'{SITE}/faq' if locale == 'en' else f'/{locale}/faq'


def _hww(locale):
    return f'{SITE}/how-we-work' if locale == 'en' else f'/{locale}/how-we-work'


_FR = 'france-yacht-charter-and-boat-rental.html'
_GR = 'greece-yacht-charter-and-boat-rental.html'
_IT = 'italy-yacht-charter-and-boat-rental.html'
_ES = 'spain-yacht-charter-and-boat-rental.html'
_TR = 'turkiye-yacht-charter-and-boat-rental.html'
_HRC = 'croatia-catamaran-charter.html'
_RITTER = 'sailing-yacht-charter-bvi-tortola-ritter-house-marina.html'
_ALBATROS = 'sailing-yacht-charter-marmaris-albatros-marina.html'
EDITS = [
    # B21 France overview: sea charter only, no canal / Burgundy cruising
    ('en', _FR, 'You can anchor off Porquerolles one week and navigate through Burgundy the next.', 'You can anchor off Porquerolles one week and explore the granite islands of Brittany the next.'),
    ('de', _FR, 'Sie können eine Woche vor Porquerolles ankern und in der nächsten durch Burgund navigieren.', 'Sie können eine Woche vor Porquerolles ankern und in der nächsten die Granitinseln der Bretagne ansteuern.'),
    ('fr', _FR, 'Vous pouvez jeter l\'ancre au large de Porquerolles une semaine et naviguer à travers la Bourgogne la suivante.', 'Vous pouvez jeter l\'ancre au large de Porquerolles une semaine et découvrir les îles de granit de Bretagne la suivante.'),
    ('it', _FR, 'Puoi ancorare a Porquerolles una settimana e navigare attraverso la Borgogna la successiva.', 'Puoi ancorare a Porquerolles una settimana e scoprire le isole di granito della Bretagna la successiva.'),
    ('es', _FR, 'Puede anclar frente a Porquerolles una semana y navegar por Borgoña la siguiente.', 'Puede fondear frente a Porquerolles una semana y descubrir las islas de granito de Bretaña la siguiente.'),
    ('pt', _FR, 'Pode ancorar em Porquerolles numa semana e navegar pela Borgonha na seguinte.', 'Pode ancorar em Porquerolles numa semana e descobrir as ilhas de granito da Bretanha na seguinte.'),
    ('nl', _FR, 'U kunt de ene week voor anker gaan bij Porquerolles en de volgende week door de Bourgogne varen.', 'U kunt de ene week voor anker gaan bij Porquerolles en de volgende week de granieten eilanden van Bretagne verkennen.'),
    ('pl', _FR, 'Możesz zakotwiczyć przy Porquerolles jednego tygodnia, a drugiego nawigować po Burgundii.', 'Możesz zakotwiczyć przy Porquerolles jednego tygodnia, a następnego odkrywać granitowe wyspy Bretanii.'),
    ('hr', _FR, 'Jedne vas sedmice mogu sidriti kod Porquerollesa, a druge ploviti kroz Burgundiju.', 'Jedan tjedan možete sidriti kod Porquerollesa, a sljedeći istraživati granitne otoke Bretanje.'),
    ('pl', _FR, 'Ale zapuść się w głąb lądu, a Kanał Południowy otworzy zupełnie inny świat – płaską wodę, zabytkowe śluzy, nadbrzeżne wioski, gdzie cumujesz przed piekarnią. ', ''),
    ('it', _FR, 'Che tu voglia navigare con vento forte nella tramontana o scivolare lentamente attraverso acque più tranquille, che tu preferisca l\'intensità di uno yacht a sei posti letto o il ritmo rilassato di una casa galleggiante per due, la Francia dispone di infrastrutture, basi e rotte che soddisfano ogni preferenza. ', ''),
    ('es', _FR, 'Ya sea que desee navegar con fuerza con el viento del mistral o derivar lentamente por aguas más tranquilas, ya sea que prefiera la intensidad de un yate de seis plazas o el ritmo pausado de una casa flotante para dos, Francia tiene la infraestructura, las bases y las rutas que se adaptan a todas las preferencias. ', ''),
    ('pt', _FR, 'Quer velejar intensamente com o vento mistral ou deslizar lentamente por águas mais calmas, quer prefira a intensidade de um iate para seis pessoas ou o ritmo tranquilo de uma casa-barco para dois, França tem a infraestrutura, bases e rotas que satisfazem todas as preferências. ', ''),
    ('hr', _FR, 'Želite li jedriti snažno na vjetru mistralu ili polako plutati mirnijim vodama, želite li intenzitet jahte s šest ležajeva ili ležeran tempo brodice za dvoje, Francuska ima infrastrukturu, baze i rute koje zadovoljavaju sve preferencije. ', ''),
    ('de', _FR, ' Das Kanalsystem bietet etwas, das kaum ein anderes Land bieten kann: 1000 Kilometer schiffbare Binnenwasserstraßen, viele davon aus dem 17. Jahrhundert, mit Schleusen, Tunneln und Dörfern, die sich seit Jahrhunderten nicht verändert haben.', ''),
    ('es', _FR, ' El sistema de canales ofrece algo que casi ningún otro país puede igualar: 1000 kilómetros de vías fluviales interiores navegables, muchas que datan de la década de 1600, con esclusas, túneles y pueblos que no han cambiado en siglos.', ''),
    ('nl', _FR, ' Het kanaalsysteem biedt iets wat bijna geen enkel ander land kan evenaren: 1000 kilometer bevaarbare binnenwateren, veel daterend uit de 17e eeuw, met sluizen, tunnels en dorpen die al eeuwenlang onveranderd zijn.', ''),
    ('pl', _FR, ' System kanałów oferuje coś, czego prawie żaden inny kraj nie jest w stanie dorównać: 1000 kilometrów żeglownych dróg śródlądowych, wiele z XVI-XVII wieku, ze śluzami, tunelami i wioskami, które nie zmieniły się od wieków.', ''),
    ('hr', _FR, ' Sustav kanala nudi nešto što gotovo nijedna druga zemlja ne može nadmašiti: 1000 kilometara plovnih unutarnjih voda, od kojih mnoge datiraju iz 1600-ih, s ustama, tunelima i selima koja se stoljećima nisu promijenila.', ''),
    ('pl', _FR, ' Żeglarstwo po Kanale Południowym odbywa się przez cały rok, ale od listopada staje się ciche, a wiele firm wynajmujących zmniejsza swoją aktywną flotę w tym okresie.', ''),
    ('pl', _FR, 'La Ciotat leży na zachód od Tuluzy,', 'La Ciotat leży na wschód od Marsylii,'),
    ('en', _FR, 'Côte d\'Azur or Corsica or the canals', 'Côte d\'Azur, Corsica or Brittany'),
    # B23 France overview: no "thousands of boats / charters" claims
    ('en', _FR, 'We\'ve chartered thousands of boats here over decades.', 'Our team has helped many crews plan their charters here.'),
    ('de', _FR, 'Wir haben hier über Jahrzehnte hinweg Tausende von Booten gechartert.', 'Unser Team hat hier schon vielen Crews bei der Planung ihres Charters geholfen.'),
    ('fr', _FR, 'Nous affrétons des milliers de bateaux ici depuis des décennies.', 'Notre équipe a déjà aidé de nombreux équipages à préparer leur location ici.'),
    ('it', _FR, 'Abbiamo noleggiato migliaia di barche qui in decenni.', 'Il nostro team ha già aiutato molti equipaggi a pianificare qui il loro charter.'),
    ('es', _FR, 'Hemos alquilado miles de barcos aquí durante décadas.', 'Nuestro equipo ya ha ayudado a muchas tripulaciones a planificar aquí su alquiler.'),
    ('pt', _FR, 'Temos alugado milhares de barcos aqui ao longo de décadas.', 'A nossa equipa já ajudou muitas tripulações a planear aqui o seu aluguer.'),
    ('nl', _FR, 'Wij verhuren hier al decennia duizenden boten.', 'Ons team heeft hier al veel bemanningen geholpen hun charter te plannen.'),
    ('pl', _FR, 'Przez dziesięciolecia wyczarterowaliśmy tu tysiące łodzi.', 'Nasz zespół pomógł tu już wielu załogom zaplanować czarter.'),
    ('hr', _FR, 'Iznajmili smo tisuće brodova ovdje tijekom desetljeća.', 'Naš tim ovdje je već pomogao mnogim posadama isplanirati najam.'),
    ('en', _FR, 'We handle thousands of France charters. ', ''),
    ('en', _FR, 'why thousands of charterers trust us', 'why charterers trust us'),
    # B39 France overview: guides named but not linked
    ('en', _FR, 'More details on documentation requirements are available in our guide to chartering requirements.', f'More detail on licences, country by country, is in our {_a(BLOG_LICENCE, "sailing licence guide")}.'),
    ('de', _FR, 'Weitere Details zu den Dokumentationsanforderungen finden Sie in unserem Leitfaden zu Charteranforderungen.', f'Welche Scheine in welchem Land verlangt werden, erklärt unser {_a(BLOG_LICENCE, "Ratgeber zum Segelschein")} (englisch).'),
    ('fr', _FR, 'Plus de détails sur les exigences en matière de documentation sont disponibles dans notre guide sur les exigences de location.', f'Notre {_a(BLOG_LICENCE, "guide des permis bateau")} (en anglais) détaille les exigences pays par pays.'),
    ('it', _FR, 'Maggiori dettagli sui requisiti documentali sono disponibili nella nostra guida ai requisiti di charter.', f'La nostra {_a(BLOG_LICENCE, "guida alle patenti nautiche")} (in inglese) spiega i requisiti paese per paese.'),
    ('es', _FR, 'Hay más detalles sobre los requisitos de documentación disponibles en nuestra guía de requisitos de alquiler.', f'Nuestra {_a(BLOG_LICENCE, "guía de titulaciones náuticas")} (en inglés) explica los requisitos país por país.'),
    ('pt', _FR, 'Mais detalhes sobre os requisitos de documentação estão disponíveis no nosso guia sobre requisitos de aluguer.', f'O nosso {_a(BLOG_LICENCE, "guia de cartas de navegador")} (em inglês) explica os requisitos país a país.'),
    ('en', _FR, 'More comprehensive details are available in the documentation guide for yacht charters.', f'Our {_a(_faq("en"), "FAQ")} lists the documents charter bases usually ask for.'),
    ('en', _FR, 'The clearest entry point is our comprehensive guide to renting a boat for the first time, which walks through the practical questions and process regardless of destination. For those wanting to understand pricing more precisely before committing, we have a detailed breakdown of boat rental costs that covers France specifically.',
     f'The clearest entry point is our {_a(_hww("en"), "how we work")} page, which walks through the booking process step by step, whatever the destination. For those wanting to understand pricing more precisely before committing, our {_a(BLOG_COST, "yacht charter cost guide")} explains what a charter week really costs.'),
    # B39 Greece overview: the four guides it mentions, linked
    ('en', _GR, 'For broader pricing context, the complete price guide breaks down seasonal rate shifts across destinations.', f'For broader pricing context, our {_a(BLOG_COST, "yacht charter cost guide")} explains what a charter week costs and how rates shift through the season.'),
    ('en', _GR, 'The first-time boat rental guide covers additional budgeting strategies.', f'Our guide to {_a(BLOG_BUDGET, "chartering on a budget")} covers more ways to save.'),
    ('en', _GR, 'The country-by-country license guide covers specific requirements in detail.', f'Our {_a(BLOG_LICENCE, "sailing licence guide")} covers the requirements country by country.'),
    ('en', _GR, 'The charter documentation guide lists everything bases typically ask for before check-in approval.', f'Our {_a(_faq("en"), "FAQ")} lists the documents bases typically ask for before check-in.'),
    ('de', _GR, 'Für einen breiteren Preisüberblick finden Sie im vollständigen Preisleitfaden saisonale Ratenverschiebungen über die Destinationen hinweg.', f'Einen breiteren Preisüberblick gibt unsere {_a(BLOG_COST, "Kostenübersicht für Yachtcharter")} (englisch): was eine Charterwoche kostet und wie sich die Preise über die Saison verschieben.'),
    ('de', _GR, 'Der Leitfaden für die erste Bootsvermietung behandelt zusätzliche Budgetierungsstrategien.', f'Weitere Spartipps finden Sie in unserem Ratgeber {_a(BLOG_BUDGET, "Yachtcharter mit kleinem Budget")} (englisch).'),
    ('de', _GR, 'Der Länderleitfaden für Lizenzen behandelt spezifische Anforderungen im Detail.', f'Welche Scheine in welchem Land verlangt werden, erklärt unser {_a(BLOG_LICENCE, "Ratgeber zum Segelschein")} (englisch).'),
    ('de', _GR, 'Die Anleitung zur Charterdokumentation listet alles auf, was Basen normalerweise vor der Check-in-Genehmigung verlangen.', f'Welche Dokumente die Basen vor dem Check-in üblicherweise verlangen, steht in unseren {_a(_faq("de"), "FAQ")}.'),
    ('fr', _GR, 'Pour un contexte de prix plus large, le guide complet des prix détaille les variations saisonnières des tarifs dans les différentes destinations.', f'Pour une vue d\'ensemble des prix, notre {_a(BLOG_COST, "guide des coûts de location")} (en anglais) explique ce que coûte une semaine de location et comment les tarifs évoluent au fil de la saison.'),
    ('fr', _GR, 'Le guide de location de bateau pour débutants couvre des stratégies budgétaires supplémentaires.', f'Notre guide {_a(BLOG_BUDGET, "louer un yacht avec un petit budget")} (en anglais) donne d\'autres astuces pour économiser.'),
    ('fr', _GR, 'Le guide des permis par pays couvre les exigences spécifiques en détail.', f'Notre {_a(BLOG_LICENCE, "guide des permis bateau")} (en anglais) détaille les exigences pays par pays.'),
    ('fr', _GR, 'Le guide de la documentation de charter liste tout ce que les bases demandent généralement avant l\'approbation de l\'embarquement.', f'Notre {_a(_faq("fr"), "FAQ")} liste les documents que les bases demandent généralement avant l\'embarquement.'),
    ('it', _GR, 'Per un contesto di prezzi più ampio, la guida completa dei prezzi scompone gli spostamenti stagionali delle tariffe attraverso le destinazioni.', f'Per un quadro più ampio dei prezzi, la nostra {_a(BLOG_COST, "guida ai costi del charter")} (in inglese) spiega quanto costa una settimana di noleggio e come cambiano le tariffe nel corso della stagione.'),
    ('it', _GR, 'La guida al primo noleggio di barche copre ulteriori strategie di budget.', f'La nostra guida al {_a(BLOG_BUDGET, "charter con un budget limitato")} (in inglese) offre altri consigli per risparmiare.'),
    ('it', _GR, 'La guida per paese sui requisiti di licenza copre i dettagli specifici.', f'La nostra {_a(BLOG_LICENCE, "guida alle patenti nautiche")} (in inglese) spiega i requisiti paese per paese.'),
    ('it', _GR, 'La guida alla documentazione di charter elenca tutto ciò che le basi solitamente chiedono prima dell\'approvazione del check-in.', f'Le nostre {_a(_faq("it"), "domande frequenti")} elencano i documenti che le basi chiedono di solito prima del check-in.'),
    ('es', _GR, 'Para un contexto de precios más amplio, la guía completa de precios detalla los cambios estacionales de tarifas en los destinos.', f'Para una visión más amplia de los precios, nuestra {_a(BLOG_COST, "guía de costes del chárter")} (en inglés) explica cuánto cuesta una semana de alquiler y cómo cambian las tarifas a lo largo de la temporada.'),
    ('es', _GR, 'La guía de alquiler de barcos por primera vez cubre estrategias adicionales de presupuesto.', f'Nuestra guía de {_a(BLOG_BUDGET, "chárter con poco presupuesto")} (en inglés) reúne más formas de ahorrar.'),
    ('es', _GR, 'La guía de licencias por país cubre los requisitos específicos en detalle.', f'Nuestra {_a(BLOG_LICENCE, "guía de titulaciones náuticas")} (en inglés) explica los requisitos país por país.'),
    ('es', _GR, 'La guía de documentación de chárter enumera todo lo que las bases suelen pedir antes de la aprobación del check-in.', f'Nuestras {_a(_faq("es"), "preguntas frecuentes")} enumeran los documentos que las bases suelen pedir antes del check-in.'),
    ('pt', _GR, 'Para um contexto de preços mais amplo, o guia de preços completo detalha as mudanças sazonais nas taxas entre destinos.', f'Para uma visão mais ampla dos preços, o nosso {_a(BLOG_COST, "guia de custos do charter")} (em inglês) explica quanto custa uma semana de aluguer e como as tarifas mudam ao longo da época.'),
    ('pt', _GR, 'O guia de aluguer de barcos pela primeira vez cobre estratégias adicionais de orçamento.', f'O nosso guia de {_a(BLOG_BUDGET, "charter com orçamento reduzido")} (em inglês) reúne mais formas de poupar.'),
    ('pt', _GR, 'O guia de licenças por país cobre os requisitos específicos em detalhe.', f'O nosso {_a(BLOG_LICENCE, "guia de cartas de navegador")} (em inglês) explica os requisitos país a país.'),
    ('pt', _GR, 'O guia de documentação de aluguer lista tudo o que as bases normalmente pedem antes da aprovação do check-in.', f'As nossas {_a(_faq("pt"), "perguntas frequentes")} listam os documentos que as bases normalmente pedem antes do check-in.'),
    ('nl', _GR, 'Voor een bredere prijscontext, de complete prijsgids geeft een overzicht van seizoensgebonden prijsverschuivingen in verschillende bestemmingen.', f'Voor een breder prijsbeeld legt ons {_a(BLOG_COST, "overzicht van de chartertarieven")} (Engelstalig) uit wat een charterweek kost en hoe de prijzen door het seizoen verschuiven.'),
    ('nl', _GR, 'De gids voor bootverhuur voor beginners behandelt aanvullende budgetteringsstrategieën.', f'Onze gids {_a(BLOG_BUDGET, "chartern met een klein budget")} (Engelstalig) geeft meer bespaartips.'),
    ('nl', _GR, 'De gids per land voor vaarbewijzen behandelt specifieke vereisten in detail.', f'Onze {_a(BLOG_LICENCE, "gids over vaarbewijzen")} (Engelstalig) zet de eisen per land op een rij.'),
    ('nl', _GR, 'De gids voor charterdocumentatie somt alles op wat bases doorgaans vragen voordat de check-in wordt goedgekeurd.', f'In onze {_a(_faq("nl"), "veelgestelde vragen")} staat welke documenten bases doorgaans vóór de check-in vragen.'),
    ('pl', _GR, 'Aby uzyskać szerszy kontekst cenowy, kompletny przewodnik po cenach rozbija sezonowe zmiany stawek w różnych miejscach.', f'Szerszy obraz cen daje nasz {_a(BLOG_COST, "przewodnik po kosztach czarteru")} (po angielsku): ile kosztuje tydzień czarteru i jak ceny zmieniają się w ciągu sezonu.'),
    ('pl', _GR, 'Przewodnik po pierwszym wynajmie łodzi zawiera dodatkowe strategie budżetowania.', f'Więcej sposobów na oszczędności znajdziesz w naszym przewodniku {_a(BLOG_BUDGET, "czarter przy niewielkim budżecie")} (po angielsku).'),
    ('pl', _GR, 'Przewodnik po licencjach kraj po kraju szczegółowo opisuje konkretne wymagania.', f'Nasz {_a(BLOG_LICENCE, "przewodnik po patentach żeglarskich")} (po angielsku) opisuje wymagania kraj po kraju.'),
    ('pl', _GR, 'Przewodnik po dokumentacji czarterowej wymienia wszystko, o co bazy zazwyczaj proszą przed zatwierdzeniem odbioru.', f'W naszych {_a(_faq("pl"), "najczęstszych pytaniach")} znajdziesz listę dokumentów, o które bazy zwykle proszą przed odbiorem jachtu.'),
    ('hr', _GR, 'Za širi kontekst cijena, potpuni vodič za cijene razlaže sezonske promjene cijena diljem destinacija.', f'Širi pregled cijena daje naš {_a(BLOG_COST, "vodič kroz troškove najma")} (na engleskom): koliko stoji tjedan najma i kako se cijene mijenjaju tijekom sezone.'),
    ('hr', _GR, 'Vodič za prvi najam plovila pokriva dodatne strategije proračuna.', f'Više načina za uštedu donosi naš vodič {_a(BLOG_BUDGET, "najam jahte uz manji budžet")} (na engleskom).'),
    ('hr', _GR, 'Vodič za licence po zemljama detaljno pokriva specifične zahtjeve.', f'Naš {_a(BLOG_LICENCE, "vodič za dozvole za upravljanje brodicom")} (na engleskom) opisuje zahtjeve po zemljama.'),
    ('hr', _GR, 'Vodič za dokumentaciju za najam navodi sve što baze obično traže prije odobrenja prijave.', f'U našim {_a(_faq("hr"), "čestim pitanjima")} navedeni su dokumenti koje baze obično traže prije preuzimanja broda.'),
    # B39 Italy overview
    ('en', _IT, 'For more details on documentation requirements, see our guide on yacht chartering documentation.', f'Our {_a(_faq("en"), "FAQ")} lists the documents charter bases usually ask for.'),
    ('en', _IT, 'Read our first-time renter guide for more on safety and confidence building.', f'Our guide to {_a(BLOG_SKIPPER, "bareboat versus skippered charter")} helps you decide how much support you need.'),
    ('en', _IT, 'For a detailed breakdown, see our complete price guide.', f'For a detailed breakdown, see our {_a(BLOG_COST, "yacht charter cost guide")}.'),
    ('en', _IT, 'Check our guide on packing for Mediterranean sailing for season-specific preparation.', f'Our {_a(_faq("en"), "FAQ")} covers what to pack for a week on board.'),
    ('en', _IT, ' For details on safety gear, see our article on safety equipment on chartered yachts.', ''),
    ('de', _IT, 'Weitere Details zu den Dokumentationsanforderungen finden Sie in unserem Leitfaden zur Dokumentation für Yachtcharter.', f'Welche Dokumente die Charterbasen üblicherweise verlangen, steht in unseren {_a(_faq("de"), "FAQ")}.'),
    ('de', _IT, 'Lesen Sie unseren Leitfaden für Erstmieter für mehr über Sicherheit und Vertrauensbildung.', f'Unser Ratgeber {_a(BLOG_SKIPPER, "Bareboat oder mit Skipper")} (englisch) hilft bei der Entscheidung, wie viel Unterstützung Sie brauchen.'),
    ('de', _IT, 'Eine detaillierte Aufschlüsselung finden Sie in unserem vollständigen Preisleitfaden.', f'Eine detaillierte Aufschlüsselung bietet unsere {_a(BLOG_COST, "Kostenübersicht für Yachtcharter")} (englisch).'),
    ('de', _IT, 'Sehen Sie sich unseren Leitfaden zum Packen für Mittelmeerssegeln für saisonspezifische Vorbereitungen an.', f'Was Sie für eine Woche an Bord einpacken sollten, steht in unseren {_a(_faq("de"), "FAQ")}.'),
    ('de', _IT, ' Details zur Sicherheitsausrüstung finden Sie in unserem Artikel über Sicherheitsausrüstung auf gecharterten Yachten.', ''),
    ('fr', _IT, 'Pour plus de détails sur les exigences documentaires, consultez notre guide sur la documentation de location de yacht.', f'Notre {_a(_faq("fr"), "FAQ")} liste les documents que les bases de location demandent généralement.'),
    ('fr', _IT, 'Lisez notre guide pour les premiers locataires pour en savoir plus sur la sécurité et le renforcement de la confiance.', f'Notre guide {_a(BLOG_SKIPPER, "location sans skipper ou avec skipper")} (en anglais) vous aide à choisir le niveau d\'accompagnement qu\'il vous faut.'),
    ('fr', _IT, 'Pour une ventilation détaillée, consultez notre guide complet des prix.', f'Pour le détail des coûts, consultez notre {_a(BLOG_COST, "guide des coûts de location")} (en anglais).'),
    ('fr', _IT, 'Consultez notre guide sur la préparation pour la navigation méditerranéenne pour une préparation spécifique à la saison.', f'Notre {_a(_faq("fr"), "FAQ")} indique quoi emporter pour une semaine à bord.'),
    ('fr', _IT, ' Pour plus de détails sur l\'équipement de sécurité, consultez notre article sur l\'équipement de sécurité sur les yachts loués.', ''),
    ('it', _IT, 'Per maggiori dettagli sui requisiti di documentazione, consulta la nostra guida sulla documentazione per il noleggio di yacht.', f'Le nostre {_a(_faq("it"), "domande frequenti")} elencano i documenti che le basi di charter chiedono di solito.'),
    ('it', _IT, 'Leggi la nostra guida per i primi noleggiatori per saperne di più sulla sicurezza e sulla costruzione della fiducia.', f'La nostra guida {_a(BLOG_SKIPPER, "bareboat o con skipper")} (in inglese) ti aiuta a capire di quanto supporto hai bisogno.'),
    ('it', _IT, 'Per una ripartizione dettagliata, consulta la nostra guida completa sui prezzi.', f'Per il dettaglio dei costi, consulta la nostra {_a(BLOG_COST, "guida ai costi del charter")} (in inglese).'),
    ('it', _IT, 'Controlla la nostra guida su come preparare la valigia per la navigazione mediterranea per la preparazione specifica per stagione.', f'Nelle nostre {_a(_faq("it"), "domande frequenti")} trovi cosa mettere in valigia per una settimana a bordo.'),
    ('it', _IT, ' Per i dettagli sull\'attrezzatura di sicurezza, consulta il nostro articolo sull\'attrezzatura di sicurezza sugli yacht noleggiati.', ''),
    ('es', _IT, 'Para más detalles sobre los requisitos de documentación, consulte nuestra guía sobre documentación de alquiler de yates.', f'Nuestras {_a(_faq("es"), "preguntas frecuentes")} enumeran los documentos que suelen pedir las bases de chárter.'),
    ('es', _IT, 'Lea nuestra guía para el primer inquilino para obtener más información sobre seguridad y fomento de la confianza.', f'Nuestra guía {_a(BLOG_SKIPPER, "sin patrón o con patrón")} (en inglés) le ayuda a decidir cuánto apoyo necesita.'),
    ('es', _IT, 'Para un desglose detallado, consulte nuestra guía completa de precios.', f'Para el desglose de costes, consulte nuestra {_a(BLOG_COST, "guía de costes del chárter")} (en inglés).'),
    ('es', _IT, 'Consulte nuestra guía sobre cómo empacar para la navegación mediterránea para prepararse según la temporada.', f'En nuestras {_a(_faq("es"), "preguntas frecuentes")} encontrará qué llevar para una semana a bordo.'),
    ('es', _IT, ' Para obtener detalles sobre el equipo de seguridad, consulte nuestro artículo sobre equipo de seguridad en yates alquilados.', ''),
    ('pt', _IT, 'Para mais detalhes sobre requisitos de documentação, consulte o nosso guia sobre documentação de aluguer de iates.', f'As nossas {_a(_faq("pt"), "perguntas frequentes")} listam os documentos que as bases de charter costumam pedir.'),
    ('pt', _IT, 'Leia o nosso guia para alugadores de primeira viagem para mais informações sobre segurança e construção de confiança.', f'O nosso guia {_a(BLOG_SKIPPER, "sem skipper ou com skipper")} (em inglês) ajuda-o a decidir de quanto apoio precisa.'),
    ('pt', _IT, 'Para um detalhe completo, consulte o nosso guia de preços completo.', f'Para o detalhe dos custos, consulte o nosso {_a(BLOG_COST, "guia de custos do charter")} (em inglês).'),
    ('pt', _IT, 'Consulte o nosso guia sobre como fazer a mala para navegação no Mediterrâneo para preparação específica da estação.', f'Nas nossas {_a(_faq("pt"), "perguntas frequentes")} encontra o que levar para uma semana a bordo.'),
    ('pt', _IT, ' Para detalhes sobre equipamento de segurança, consulte o nosso artigo sobre equipamento de segurança em iates alugados.', ''),
    ('nl', _IT, 'Zie onze gids over documentatie voor jachtverhuur voor meer details over de vereisten.', f'In onze {_a(_faq("nl"), "veelgestelde vragen")} staat welke documenten charterbases doorgaans vragen.'),
    ('nl', _IT, 'Lees onze gids voor eerstekomers voor meer informatie over veiligheid en het opbouwen van vertrouwen.', f'Onze gids {_a(BLOG_SKIPPER, "bareboat of met schipper")} (Engelstalig) helpt je te bepalen hoeveel ondersteuning je nodig hebt.'),
    ('nl', _IT, 'Zie onze complete prijsgids voor een gedetailleerde uitsplitsing.', f'Zie ons {_a(BLOG_COST, "overzicht van de chartertarieven")} (Engelstalig) voor een gedetailleerde uitsplitsing.'),
    # B39 Spain overview
    ('en', _ES, 'For more detailed pricing information, our complete price guide for boat rental breaks down costs across different destinations and boat types.', f'For more detailed pricing information, our {_a(BLOG_COST, "yacht charter cost guide")} breaks down costs across destinations and boat types.'),
    ('en', _ES, 'For more detail on requirements across destinations, check out the country-by-country licensing guide.', f'For more detail on requirements across destinations, see our {_a(BLOG_LICENCE, "sailing licence guide")}.'),
    ('de', _ES, 'Detailliertere Preisinformationen finden Sie in unserem vollständigen Preisleitfaden für Bootsvermietung, der die Kosten für verschiedene Ziele und Bootstypen aufschlüsselt.', f'Detailliertere Preisinformationen bietet unsere {_a(BLOG_COST, "Kostenübersicht für Yachtcharter")} (englisch) mit den Kosten nach Revier und Bootstyp.'),
    ('de', _ES, 'Weitere Details zu den Anforderungen in verschiedenen Zielen finden Sie im länderübergreifenden Leitfaden für Lizenzen.', f'Welche Scheine in welchem Land verlangt werden, erklärt unser {_a(BLOG_LICENCE, "Ratgeber zum Segelschein")} (englisch).'),
    ('fr', _ES, 'Pour des informations tarifaires plus détaillées, notre guide complet des prix de location de bateaux détaille les coûts dans différentes destinations et types de bateaux.', f'Pour des informations tarifaires plus détaillées, notre {_a(BLOG_COST, "guide des coûts de location")} (en anglais) détaille les coûts par destination et par type de bateau.'),
    ('fr', _ES, 'Pour plus de détails sur les exigences dans les différentes destinations, consultez le guide des permis par pays.', f'Pour les exigences dans les différentes destinations, consultez notre {_a(BLOG_LICENCE, "guide des permis bateau")} (en anglais).'),
    ('it', _ES, 'Per maggiori dettagli sui requisiti nelle diverse destinazioni, consultate la guida sui requisiti di licenza per paese.', f'Per i requisiti nelle diverse destinazioni, consultate la nostra {_a(BLOG_LICENCE, "guida alle patenti nautiche")} (in inglese).'),
    ('es', _ES, 'Para obtener información de precios más detallada, nuestra guía completa de precios de alquiler de barcos desglosa los costos en diferentes destinos y tipos de barcos.', f'Para obtener información de precios más detallada, nuestra {_a(BLOG_COST, "guía de costes del chárter")} (en inglés) desglosa los costes por destino y tipo de barco.'),
    ('es', _ES, 'Para obtener más detalles sobre los requisitos en los diferentes destinos, consulte la guía de licencias por país.', f'Para los requisitos en los distintos destinos, consulte nuestra {_a(BLOG_LICENCE, "guía de titulaciones náuticas")} (en inglés).'),
    ('pt', _ES, 'Para informações de preços mais detalhadas, o nosso guia completo de preços de aluguer de barcos detalha os custos em diferentes destinos e tipos de barcos.', f'Para informações de preços mais detalhadas, o nosso {_a(BLOG_COST, "guia de custos do charter")} (em inglês) detalha os custos por destino e tipo de barco.'),
    ('pt', _ES, 'Para mais detalhes sobre os requisitos em diferentes destinos, consulte o guia de licenciamento por país.', f'Para os requisitos nos diferentes destinos, consulte o nosso {_a(BLOG_LICENCE, "guia de cartas de navegador")} (em inglês).'),
    ('nl', _ES, 'Voor meer gedetailleerde prijsinformatie, onze complete prijsgids voor bootverhuur geeft een overzicht van de kosten in verschillende bestemmingen en boottypes.', f'Meer gedetailleerde prijsinformatie vindt u in ons {_a(BLOG_COST, "overzicht van de chartertarieven")} (Engelstalig), per bestemming en boottype.'),
    ('nl', _ES, 'Voor meer details over vereisten in verschillende bestemmingen, bekijk de land-specifieke gids voor vaarbewijzen.', f'De eisen per bestemming vindt u in onze {_a(BLOG_LICENCE, "gids over vaarbewijzen")} (Engelstalig).'),
    ('pl', _ES, 'Aby uzyskać bardziej szczegółowe informacje o cenach, nasz kompletny przewodnik po cenach wynajmu łodzi szczegółowo opisuje koszty w różnych destynacjach i typach łodzi.', f'Szczegółowe informacje o cenach znajdziesz w naszym {_a(BLOG_COST, "przewodniku po kosztach czarteru")} (po angielsku), z podziałem na akweny i typy jednostek.'),
    ('pl', _ES, 'Aby uzyskać więcej szczegółów na temat wymagań w różnych destynacjach, zapoznaj się z przewodnikiem po licencjach w poszczególnych krajach.', f'Wymagania w poszczególnych krajach opisuje nasz {_a(BLOG_LICENCE, "przewodnik po patentach żeglarskich")} (po angielsku).'),
    ('hr', _ES, 'Za detaljnije informacije o cijenama, naš potpuni vodič za cijene najma plovila razlaže troškove u različitim destinacijama i tipovima plovila.', f'Detaljnije informacije o cijenama donosi naš {_a(BLOG_COST, "vodič kroz troškove najma")} (na engleskom), po destinacijama i vrstama plovila.'),
    ('hr', _ES, 'Za više detalja o zahtjevima u različitim destinacijama, pogledajte vodič za licenciranje po zemljama.', f'Zahtjeve po zemljama opisuje naš {_a(BLOG_LICENCE, "vodič za dozvole za upravljanje brodicom")} (na engleskom).'),
    # B39 Türkiye overview (EN only has the sentence)
    ('en', _TR, 'Visit Boat4You\'s comprehensive guide on how we work to understand our booking process, or explore our detailed pricing guide to see how Türkiye\'s exceptional value compares to other Mediterranean destinations.',
     f'Visit our {_a(_hww("en"), "how we work")} page to understand the booking process, or read our {_a(BLOG_COST, "yacht charter cost guide")} to see how Türkiye\'s prices compare with other Mediterranean destinations.'),
    # B37 Croatia × catamaran: bases and distances as the facts block shows them
    ('en', _HRC, 'ACI Split dominates the catamaran charter fleet.', 'The Split-area catamaran fleet is spread across several marinas, including Kaštela, Marina Baotić in Seget Donji near Trogir and the marinas in Split itself.'),
    ('en', _HRC, 'Marina Trogir, 20 kilometers north of Split,', 'Marina Trogir, about 20 kilometres west of Split,'),
    ('de', _HRC, 'ACI Split dominiert die Katamaran-Charterflotte.', 'Die Katamaranflotte rund um Split verteilt sich auf mehrere Marinas, darunter Kaštela, die Marina Baotić in Seget Donji bei Trogir und die Marinas in Split selbst.'),
    ('de', _HRC, 'Marina Trogir, 20 Kilometer nördlich von Split,', 'Marina Trogir, rund 20 Kilometer westlich von Split,'),
    ('fr', _HRC, 'ACI Split domine la flotte de location de catamarans.', 'La flotte de catamarans autour de Split se répartit entre plusieurs marinas, dont Kaštela, la marina Baotić à Seget Donji près de Trogir et les marinas de Split même.'),
    ('fr', _HRC, 'La marina de Trogir, à 20 kilomètres au nord de Split,', 'La marina de Trogir, à une vingtaine de kilomètres à l\'ouest de Split,'),
    ('it', _HRC, 'ACI Spalato domina la flotta di charter di catamarani.', 'La flotta di catamarani intorno a Spalato è distribuita su diversi porti turistici, tra cui Kaštela, la Marina Baotić a Seget Donji vicino a Trogir e i porti di Spalato stessa.'),
    ('it', _HRC, 'Il porto turistico di Trogir, 20 chilometri a nord di Spalato,', 'Il porto turistico di Trogir, circa 20 chilometri a ovest di Spalato,'),
    ('es', _HRC, 'ACI Split domina la flota de alquiler de catamaranes.', 'La flota de catamaranes de la zona de Split se reparte entre varios puertos deportivos, entre ellos Kaštela, la Marina Baotić en Seget Donji, cerca de Trogir, y los puertos de la propia Split.'),
    ('es', _HRC, 'El puerto deportivo de Trogir, a 20 kilómetros al norte de Split,', 'El puerto deportivo de Trogir, a unos 20 kilómetros al oeste de Split,'),
    ('pt', _HRC, 'ACI Split domina a frota de aluguer de catamarãs.', 'A frota de catamarãs da zona de Split reparte-se por várias marinas, incluindo Kaštela, a Marina Baotić em Seget Donji, perto de Trogir, e as marinas da própria Split.'),
    ('pt', _HRC, 'A Marina de Trogir, 20 quilómetros a norte de Split,', 'A Marina de Trogir, cerca de 20 quilómetros a oeste de Split,'),
    ('nl', _HRC, 'ACI Split domineert de vloot van catamaranverhuur.', 'De catamaranvloot rond Split is verdeeld over meerdere jachthavens, waaronder Kaštela, Marina Baotić in Seget Donji bij Trogir en de jachthavens in Split zelf.'),
    ('nl', _HRC, 'Marina Trogir, 20 kilometer ten noorden van Split,', 'Marina Trogir, zo\'n 20 kilometer ten westen van Split,'),
    ('pl', _HRC, 'ACI Split dominuje we flocie czarterowej katamaranów.', 'Flota katamaranów w rejonie Splitu rozkłada się na kilka marin, m.in. Kaštela, Marinę Baotić w Seget Donji koło Trogiru i mariny w samym Splicie.'),
    ('pl', _HRC, 'Marina Trogir, 20 kilometrów na północ od Splitu,', 'Marina Trogir, około 20 kilometrów na zachód od Splitu,'),
    ('hr', _HRC, 'ACI Split dominira flotom charter katamarana.', 'Flota katamarana u splitskom području raspoređena je u nekoliko marina, među kojima su Kaštela, Marina Baotić u Segetu Donjem kraj Trogira i marine u samom Splitu.'),
    ('hr', _HRC, 'Marina Trogir, 20 kilometara sjeverno od Splita,', 'Marina Trogir, dvadesetak kilometara zapadno od Splita,'),
    # our-fleet rewrite + count rule left "la flota de nuestros socios de 44 yates" oddities
    ('pl', 'sailing-yacht-charter-lavrion-main-port.html', 'a flota naszych partnerów wiele jachtów żaglowych obejmuje', 'a flota jachtów żaglowych naszych partnerów obejmuje'),
    # B21 Veneto motor yachts: meta description promised river / houseboat cruising
    ('en', 'veneto-motor-yacht-charter.html', 'for Venice lagoon cruising, river navigation, and houseboat-style adventures.', 'for Venice lagoon cruising and the Adriatic coast.'),
    ('de', 'veneto-motor-yacht-charter.html', 'für Fahrten auf der Lagune von Venedig, Flussfahrten und Hausboot-Abenteuer.', 'für Fahrten auf der Lagune von Venedig und entlang der Adriaküste.'),
    ('fr', 'veneto-motor-yacht-charter.html', 'pour la navigation dans la lagune de Venise, les rivières et les aventures de type péniche.', 'pour naviguer dans la lagune de Venise et le long de la côte adriatique.'),
    ('it', 'veneto-motor-yacht-charter.html', 'per crociere nella laguna di Venezia, navigazione fluviale e avventure in stile houseboat.', 'per crociere nella laguna di Venezia e lungo la costa adriatica.'),
    ('es', 'veneto-motor-yacht-charter.html', 'para navegar por la laguna de Venecia, ríos y aventuras estilo casa flotante.', 'para navegar por la laguna de Venecia y la costa del Adriático.'),
    ('pt', 'veneto-motor-yacht-charter.html', 'para cruzeiros na lagoa de Veneza, navegação fluvial e aventuras estilo casa flutuante.', 'para cruzeiros na lagoa de Veneza e ao longo da costa do Adriático.'),
    ('nl', 'veneto-motor-yacht-charter.html', 'voor tochten in de lagune van Venetië, riviernavigatie en avonturen in houseboat-stijl.', 'voor tochten in de lagune van Venetië en langs de Adriatische kust.'),
    ('pl', 'veneto-motor-yacht-charter.html', 'na rejs po lagunie weneckiej, żeglugę po rzekach i przygody w stylu houseboat.', 'na rejs po lagunie weneckiej i wzdłuż wybrzeża Adriatyku.'),
    ('hr', 'veneto-motor-yacht-charter.html', 'za krstarenje Venecijanskom lagunom, riječnim plovidbama i avanturama poput kućice na vodi.', 'za krstarenje Venecijanskom lagunom i duž jadranske obale.'),
    ('pl', 'occitanie-sailing-area-yacht-charter-and-boat-rental.html', 'Sète, Kanał Południowy, Port Camargue', 'Sète, Port Camargue'),
    # Balearic sailing yachts (EN source of the DE rewrite): wrong facts and invented names
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'The Copa del Rey regatta, held annually in August in Palma since 1904, attracts', 'The Copa del Rey regatta, sailed in Palma every summer since 1982, attracts'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Palma\'s Michelin-starred establishments—Zaranda, Móvil, Can Culleretes—serve world-class Mediterranean cuisine.', 'Palma\'s restaurant scene runs from Michelin-starred tasting menus to traditional tapas bars and seafood grills by the harbour.'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Yes. August charters often coincide with Copa del Rey. Boat4You arranges participation in class racing or cruise-in divisions; professional skippers provide race coaching and competitive guidance.', 'The Copa del Rey is sailed in Palma in late July and early August. Whether a charter boat may enter a regatta depends on the charter company, so ask before you book; watching the racing from the water is always possible.'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Chartered Boat4You monohulls can participate in class racing or cruise amid the spectacle', 'Charter crews can watch the racing from the water or cruise amid the spectacle'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Professional charter skippers aboard Boat4You monohulls incorporate sail-trim coaching', 'Professional charter skippers can add sail-trim coaching'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'August brings Europe\'s elite to Palma for the Copa del Rey.', 'Late July and early August bring Europe\'s racing elite to Palma for the Copa del Rey.'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'commands the archipelago\'s reliable Tramontana winds', 'makes the most of the archipelago\'s reliable winds'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'The Balearic Islands host the oldest continuous sailing tradition in the Mediterranean.', 'The Balearic Islands have one of the liveliest sailing traditions in the Mediterranean.'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Summer Tramontana winds—consistent northerlies averaging 10–14 knots—were carved into these waters by generations of skippers, making monohulls', 'Steady summer winds averaging 10–14 knots make monohulls'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Summer Tramontana winds define Balearic sailing. These northerlies, born from pressure differences between the Atlantic and Mediterranean, blow consistently 10–15 knots June through September, with occasional gusts to 20+ knots.', 'Summer winds typically blow 10–15 knots from June through September, with occasional gusts over 20 knots.'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Secondary easterly Gregal winds provide variation; their interaction with Tramontana creates beam reaches and challenging wind-shifts rewarding experienced crews.', 'Northerlies such as the Tramontana and the easterly Gregal add variety, creating beam reaches and wind shifts that reward experienced crews.'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Monohull draft (1.2–1.5 metres)', 'Monohull draft (typically 1.8–2.2 metres)'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Ibiza\'s Es Vedrà island (the iconic 370-metre rock stack)', 'Ibiza\'s Es Vedrà (the iconic rock stack, nearly 400 metres high)'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Bareboat charters typically require RYA/ASA Level 2 or equivalent (coastal navigation, basic sail trim, anchoring).', 'Bareboat charters typically require a licence such as the ICC or an equivalent certificate (coastal navigation, basic sail trim, anchoring).'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'Boat4You matches crew experience to vessel and conditions; professional skippers augment crews seeking coaching.', 'Boat4You helps you match the boat and area to your crew\'s experience; a professional skipper can join crews who want coaching.'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'In 10–14 knot Tramontana winds,', 'In 10–14 knots of wind,'),
    ('en', 'balearic-islands-sailing-yacht-charter.html', 'morning departures optimise afternoon Tramontana winds.', 'morning departures make the most of the afternoon breeze.'),
    # B38 links whose text the translation cut off ("learn how For more insights …")
    ('en', 'andratx-catamaran-charter.html', '<a href="https://www.boat4you.com/how-we-work">learn how For more insights, visit our </a>', '<a href="https://www.boat4you.com/how-we-work">learn how Boat4You works</a>. For more insights, visit our '),
    ('de', 'andratx-catamaran-charter.html', '<a href="/de/how-we-work">erfahren Sie, wie Sie für weitere Einblicke unsere </a><a href="/de/faq">FAQ-Sektion</a> besuchen oder', '<a href="/de/how-we-work">erfahren Sie, wie Boat4You arbeitet</a>. Für weitere Einblicke besuchen Sie unsere <a href="/de/faq">FAQ-Sektion</a> oder'),
    ('es', 'andratx-catamaran-charter.html', '<a href="/es/how-we-work">aprenda cómo Para obtener más información, visite nuestra </a>', '<a href="/es/how-we-work">aprenda cómo trabaja Boat4You</a>. Para obtener más información, visite nuestra '),
    ('pl', 'andratx-catamaran-charter.html', '<a href="/pl/how-we-work">dowiedz się, jak. Po więcej informacji odwiedź naszą </a>', '<a href="/pl/how-we-work">dowiedz się, jak działa Boat4You</a>. Po więcej informacji odwiedź naszą '),
    ('en', 'motorboat-charter-pirovac.html', '<a href="https://www.boat4you.com/how-we-work">learn how Questions? </a>', '<a href="https://www.boat4you.com/how-we-work">learn how Boat4You works</a>. Questions? '),
    ('de', 'motorboat-charter-pirovac.html', '<a href="/de/how-we-work">erfahren Sie, wie Fragen? </a>', '<a href="/de/how-we-work">erfahren Sie, wie Boat4You arbeitet</a>. Fragen? '),
    ('en', 'catamaran-charter-marina-dell-isola.html', 'Learn more about <a href="https://www.boat4you.com/how-we-work">how </a></p>', 'Learn more about <a href="https://www.boat4you.com/how-we-work">how Boat4You works</a>.</p>'),
    ('nl', 'catamaran-charter-marina-dell-isola.html', 'Lees meer over <a href="/nl/how-we-work">hoe </a></p>', 'Lees meer over <a href="/nl/how-we-work">hoe Boat4You werkt</a>.</p>'),
    ('en', 'motorboat-charter-alimos-marina.html', 'or learn <a href="https://www.boat4you.com/how-we-work">how </a></p>', 'or learn <a href="https://www.boat4you.com/how-we-work">how Boat4You works</a>.</p>'),
    # B38 repeated headings with different sections under them
    ('fr', _RITTER, 'Découvrez Pourquoi les Marins Font Confiance à Boat4You</h2> <p>La marina Ritter House', 'Vivez la Vraie Voile à Ritter House</h2> <p>La marina Ritter House'),
    ('it', _RITTER, 'Scoprite Perché i Velisti si Affidano a </h2> <p>La Ritter House Marina', 'Vivete la Vera Vela alla Ritter House</h2> <p>La Ritter House Marina'),
    ('hr', _ALBATROS, 'Planirajte svoj najam s nama</h2> <p>Najam jedrilice iz marine Albatros', 'Započnite jedriličarsku avanturu iz marine Albatros</h2> <p>Najam jedrilice iz marine Albatros'),
]
# Headings the brand-removal pass left dangling ("Why Sailors Return to").
HEADING_BRAND_GAP = {
    'en': [(r'(Discover Why Sailors Trust|Why Sailors Return to)\s*(</h[2-4]\s*>)', r'\1 Boat4You\2')],
    'es': [(r'(¿)(Por [Qq]ué los (?:[Nn]avegantes|[Mm]arineros) [Rr]egresan a)\s*(</h[2-4]\s*>)', r'\1\2 Boat4You?\3'),
           (r'(?<!¿)(Por [Qq]ué los (?:[Nn]avegantes|[Mm]arineros) [Rr]egresan a)\s*(</h[2-4]\s*>)', r'\1 Boat4You\2')],
    'it': [(r'(Perché i Velisti (?:Tornano a|si Affidano a))\s*(</h[2-4]\s*>)', r'\1 Boat4You\2')],
    'pt': [(r'(Porquê os Velejadores Regressam) a\s*(</h[2-4]\s*>)', r'\1 à Boat4You\2')],
    'hr': [(r'Zašto se [Jj]edriličari [Vv]raćaju u\s*(</h[2-4]\s*>)', r'Zašto nam se jedriličari vraćaju\1')],
}
# Links to landings that are noindex today (no curated text or too few boats
# for the type): pointed at the indexable landing one level up. (file, old
# href fragment, new href fragment), every locale.
HREF_EDITS = [
    ('calabria-sailing-yacht-charter.html', 'destinations=Gulf+of+Taranto&did=r-143', 'destinations=Calabria&did=r-58&boatTypes=SAILING_YACHT'),
    ('athens-area-saronic-peloponese-sailing-area-yacht-charter-and-boat-rental.html', '&did=r-24&boatTypes=LUXURY_MOTOR_YACHT', '&did=r-24&boatTypes=MOTOR_YACHT'),
    ('athens-area-saronic-peloponese-sailing-area-yacht-charter-and-boat-rental.html', '&did=r-24&boatTypes=MOTORSAILER', '&did=r-24'),
    ('port-of-mykonos-sailing-area-yacht-charter-and-boat-rental.html', 'destinations=Port%20of%20Mykonos&boatTypes=MOTOR_YACHT', 'destinations=Port%20of%20Mykonos'),
    ('piso-livadi-port-paros-sailing-area-yacht-charter-and-boat-rental.html', '&did=l-1005&boatTypes=CATAMARAN', '&did=l-1005'),
]
HEAD_INLAND = re.compile(r'(?:,\s*Canal du Midi(?=[,.\s])|Canal du Midi,\s*)')
# Words the machine translation split in two: HR "ski pere" = "skipere".
SPLIT_WORDS = {
    'hr': [(re.compile(r'(?<![\wčćšžđČĆŠŽĐ])([Ss])ki per(eima|eom|a|e|om|ima|i|u|ska|sku|sko|ski|skom|skoj)?\b'),
            lambda m: m.group(1) + 'kiper' + {'eima': 'ima', 'eom': 'om'}.get(m.group(2) or '', m.group(2) or ''))],
}


def fix_edits(src, ctx):
    for rx, repl in SPLIT_WORDS.get(ctx.locale, []):
        head, body, tail = split_body(src)

        def join(m, repl=repl):
            new = repl(m)
            ctx.record('edits', m.group(0), new)
            return new
        src = head + rx.sub(join, body) + tail
    for locale, name, old, new in EDITS:
        if locale != ctx.locale or name != ctx.name:
            continue
        pattern = tolerant(old)
        if pattern.search(src):
            src = pattern.sub(lambda m: new, src, count=1)
            ctx.record('edits', old[:200], plain(new)[:200] or '(removed)')
    for name, old, new in HREF_EDITS:
        if name != ctx.name:
            continue
        for o, n in ((old, new), (old.replace('&', '&amp;'), new.replace('&', '&amp;'))):
            if f'{o}"' in src:
                src = src.replace(f'{o}"', f'{n}"')
                ctx.record('edits', o, n)
    for pattern, repl in HEADING_BRAND_GAP.get(ctx.locale, []):
        def gap(m, repl=repl):
            new = m.expand(repl)
            ctx.record('edits', plain(m.group(0)), plain(new))
            return new
        src = re.sub(pattern, gap, src)
    head, body, tail = split_body(src)
    if HEAD_INLAND.search(head):
        new_head = HEAD_INLAND.sub('', head)
        ctx.record('edits', 'Canal du Midi (title/meta)', '(removed)')
        head = new_head
    return head + body + tail


# ------------------------------------------------------------ messages

# The same owner rules for the UI strings (messages/<locale>/*.json): no fleet
# ownership, no charter-company names, sea charter only, founding year 2013,
# no internal notes or placeholders (synthesis 6.4, Stage A).
MESSAGE_PLACEHOLDER = re.compile(r"\bTODO\b|\bFIXME\b|Mario rule|\{' '\}|\[(?:Subject|Company Name|Boat4You|Brand)[^\]]*\]|(?i:lorem ipsum)")
_MESSAGE_TYPE_LABEL = re.compile(r'HOUSE_BOAT\s*\{[^}]*\}')


def message_checks(repo=REPO):
    out = []
    root = os.path.join(repo, 'messages')
    for locale in LOCALES:
        folder = os.path.join(root, locale)
        if not os.path.isdir(folder):
            continue
        for name in sorted(os.listdir(folder)):
            if not name.endswith('.json'):
                continue
            data = json.loads(_read(os.path.join(folder, name)))
            stack = [((), data)]
            while stack:
                path, node = stack.pop()
                if isinstance(node, dict):
                    stack.extend((path + (k,), v) for k, v in node.items())
                    continue
                if isinstance(node, list):
                    stack.extend((path + (str(i),), v) for i, v in enumerate(node))
                    continue
                if not isinstance(node, str):
                    continue
                key = f"{locale}/{name}:{'.'.join(path)}"
                if re.search(r'house_?boat', path[-1] if path else '', re.I):
                    continue  # boat-type label for the HOUSE_BOAT enum, not a promotion
                text = plain(_MESSAGE_TYPE_LABEL.sub('', node))
                for rx in CLAIM_DENY['all'] + CLAIM_DENY.get(locale, []):
                    m = re.search(rx, text)
                    if m:
                        out.append(('msg-claim', f'{key}: {text[max(0, m.start() - 40): m.end() + 40]}'))
                if OPERATOR.search(text):
                    out.append(('msg-operator', f'{key}: {text[:120]}'))
                if river_hit(text, locale):
                    out.append(('msg-inland', f'{key}: {text[:120]}'))
                if MESSAGE_PLACEHOLDER.search(node):
                    out.append(('msg-placeholder', f'{key}: {node[:120]}'))
                for sentence in _sentences(text):
                    ym = _YEAR_CLAIM.search(sentence)
                    if ym and 1990 <= int(ym.group(1)) < 2013 and COMPANY_VOICE.search(sentence):
                        out.append(('msg-founded', f'{key}: {sentence[:160]}'))
                    if re.search(r'Boat4You\W+(?:\w+\W+){0,6}?' + _EXPERIENCE_CLAIM.pattern, sentence) and EXPERIENCE_WORD.search(sentence):
                        out.append(('msg-founded', f'{key}: {sentence[:160]}'))
    return out
