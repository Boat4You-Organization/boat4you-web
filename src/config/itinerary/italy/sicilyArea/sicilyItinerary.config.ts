import { Itinerary } from '@/types/itinerary.type';

import { aeolianFullCircle14Route, capoDorlandoRoute, lipariRoute, palermoLongRoute, palermoRoute } from './routes';

const sicilyItinerary: Itinerary = {
  metaTitle: 'Sicily Yacht Charter Itineraries | Aeolian Island Blue Route',
  metaDesc:
    'Yacht charter itineraries from Sicily — Aeolian Islands (Stromboli, Vulcano, Lipari, Salina, Panarea), Egadi Marine Park, Palermo and Portorosa bases. Volcanic Mediterranean sailing.',
  id: 'sicily',
  sailingArea: 'Sicily',
  image: {
    src: '/images/itinerary/italy/sicily-itinerary/itinerary-card.webp',
    alt: 'Sicily',
  },
  title: 'Sicily area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/italy/italy-banner.webp',
    alt: 'Sicily',
  },
  description: `Sicily and the Aeolian Islands offer Italy's most dramatic charter ground — seven volcanic islands including the constantly-erupting Stromboli (its lava flow is visible from sea after dark, the "Sciara del Fuoco" sliding down the north-west face into the water roughly every 10–20 minutes), the active Vulcano with its sulphuric mud baths and the post-eruption Gran Cratere walk, and the wine-and-caper terraces of Salina. Charters depart from Portorosa or Capo d'Orlando on Sicily's north coast (90-minute drive from Catania-Fontanarossa airport CTA, 2 hours from Palermo PMO); the Aeolian chain sits 25–40 NM offshore, putting Lipari and Vulcano within a single day-sail and Stromboli within reach by day 3.

The classic 7-day Aeolian week loops Portorosa → Vulcano → Lipari → Salina → Panarea → Stromboli → Filicudi → return. Stromboli's "sciara del fuoco" lava-flow viewing at twilight is the moment most charters plan around — the captain holds the boat 0.5–1 NM off the north-west face from dusk onward, the explosions are visible above the rim and the lava falls into the sea with audible hiss-and-steam from the deck. Land-side, Lipari town is the Aeolian's lively port (the only one with a year-round local economy outside tourism, plus an excellent archaeological museum on the citadel); Salina has the pre-eminent caper farms (the Marisa Tasca farm at Lingua is worth the 20-minute walk from the port) and the Malvasia delle Lipari sweet wine — a Sicilian DOC built on six small producers; Panarea draws the high-glamour Italian set — Hotel Raya has been the late-night anchor since the 1980s.

The 14-day extended Sicily charter adds the west and south coasts. From Palermo (Marina Villa Igiea or Cala Marina) a long-week itinerary heads west along the Tyrrhenian coast — Castellammare del Golfo, Scopello, San Vito Lo Capo (the standout beach at the western tip), then around to the Egadi Marine Park (Favignana, Levanzo, Marettimo). The Egadi cluster — Sicily's other charter draw — sits 5–15 NM off Trapani and offers Caribbean-clear water, ancient tuna-fishing village ports (Favignana's Tonnara Florio museum), and far fewer charter boats than the Aeolians at peak season. South-coast destinations (Agrigento Valle dei Templi, Selinunte ruins, Marsala wine region) take the 14-day loop into Greek-temple territory unmatched anywhere else in the Mediterranean.

Vessel mix is mixed — sailing yachts (45–55 ft Bavaria, Bénéteau, Jeanneau) and catamarans (Lagoon 42-50, Bali 4.4-5.4) for crews wanting full-week Aeolian or Egadi immersion, motor yachts (38–60 ft Princess, Sunseeker, Azimut) for shorter Vulcano-Lipari-Salina loops with more time at anchor and ashore. Gulet charters are uncommon here (Sicily isn't on the Turkish-coast gulet circuit). Crewed luxury yachts in the 60+ ft range work the Aeolian-Capri long-distance routes.

Sicilian cuisine is a charter draw of its own. The Aeolians and the north coast deliver Messinese arancini (the rice ball — bigger, browner, ragu-filled vs the Palermo version), spada (swordfish, grilled in olive oil and lemon at every port), and granita served at breakfast with a brioche col tuppo (the bun that holds the granita like an ice-cream cone). Marsala wine on the west coast, Nero d'Avola reds in the south-east, Malvasia sweet wine on Salina — each port has its own pairing.

Best season May–June and early September. Midsummer (mid-July through August) brings volcanic-tourism crowds at the Stromboli boat-tour landings and the Vulcano mud baths; the heat in Palermo and the south coast hits 35–38 °C; the Lipari and Vulcano marina overnight rates double. The shoulder months drop rates 30–35% and the volcano visibility from offshore is still strong (Stromboli explosions are continuous year-round). Late September can deliver the best balance — water 23 °C, light maestrale wind, Aeolians half-empty.

Permits and paperwork: the Aeolian Islands sit inside a UNESCO World Heritage site but there is no per-yacht entry permit — anchoring is regulated through standard maritime norms (no anchor on protected seabed in marked zones). The Egadi Marine Park does charge per-day entry fees (€20–60/yacht, payable at the Capo d'Orlando port office or online ahead). The broker handles all filings inside the charter quote.`,
  routes: [capoDorlandoRoute, lipariRoute, palermoLongRoute, palermoRoute, aeolianFullCircle14Route],
};

export default sicilyItinerary;
