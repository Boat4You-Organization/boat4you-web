import { Itinerary } from '@/types/itinerary.type';

import { kos14DaysRouteConfig, kosRouteConfig, rhodes14DaysRouteConfig, rhodesRouteConfig } from './routes';

const dodecaneseItinerary: Itinerary = {
  metaTitle: 'Dodecanese Yacht Charter Itineraries | Greek Island Sailing Routes',
  metaDesc:
    'Yacht charter itineraries in the Dodecanese — Rhodes, Kos, Symi, Patmos, Nisyros. 7 and 14-day routes plus Bodrum cross-border charters. Soft meltemi, dense harbour network.',
  id: 'dodecanese',
  sailingArea: 'Dodecanese',
  image: {
    src: '/images/itinerary/greece/dodecanese-itinerary/itinerary-card.webp',
    alt: 'Dodecanese',
  },
  title: 'Dodecanese area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/greece/greece-banner.webp',
    alt: 'Dodecanese area banner image',
  },
  description: `The Dodecanese is the eastern Aegean charter chain — twelve major islands hugging the Turkish coast, with Rhodes (RHO airport) and Kos (KGS) as primary embarkation marinas. The proximity to Turkey opens up cross-border one-way charters: Bodrum → Rhodes via Symi (Greek port-of-entry checkpoint at Symi) is a popular 7-day delivery format, and Bodrum → Kos via Kalymnos is the shorter cross-border option for crews wanting a half-Turkish half-Greek week. The cluster's southern position keeps the meltemi noticeably softer than the Cyclades while still providing reliable 3–5 Bft afternoon sailing wind.

Two embarkation models work here. From Rhodes the standard week runs north through Symi (the most photographed neoclassical-painted harbour in Greece, with the famous façade-painted town climbing the bowl behind the port), then Tilos (a Special Protection Area for migratory birds — 100+ species in spring/autumn), Nisyros (an active volcano with a sailable caldera and the Stefanos crater walkable from Mandraki port), and back via Chalki. Total roughly 90 NM, sheltered passages, good harbour overnight options.

From Kos the typical loop covers Patmos (the Cave of the Apocalypse, where John of Patmos wrote Revelation — UNESCO site, walkable from Skala port), Leros (Lakki harbour, Italian-built art-deco port from the 1930s), Lipsi (the quietest taverna island in the Dodecanese — 800 inhabitants, three small ports), and Kalymnos (historically the Mediterranean's sponge-diving centre, today better known as a world-class climbing destination with 3,400+ bolted routes on the limestone cliffs above Massouri). Distances are moderate (15–25 NM legs) and harbour density is high, so even slower-paced crews comfortably hit 5–6 islands in a week.

Symi gets its own paragraph. The Italian-period (1912–1947) facades give Symi the postcard architecture you saw on the brochure — yellow, terracotta, ochre, mostly preserved because the Greek Government protected the island as a historic settlement. Anchoring options are limited; book a Symi harbour quay slot 48 hours ahead through the charter base in peak season or anchor outside in Pedi bay (3 NM east) and tender in. Symi's restaurant standout is Tholos at the harbour's south end — fresh fish, run by the same family for 40+ years.

Vessel mix suits all formats equally — sailing yachts (Bavaria, Bénéteau, Jeanneau 40–50 ft) for sailing-first crews, catamarans (Lagoon 42-46, Bali 4.4) for families and groups, motor yachts for shorter charter weeks combining a couple of overnight stops with longer marina stays, and gulet weeks for the Turkish-coast crossover routes. Crewed luxury yachts (50–100+ ft) work the Rhodes-Symi-Bodrum corridor as a premium segment.

Best season May–early July and September. Rhodes and Kos airports both have direct EU flights all summer (Rhodes from London/Manchester/Berlin/Vienna/Stockholm/Milan/Rome, Kos slightly fewer routes), making Saturday-afternoon arrivals straightforward. October is still sailable but Rhodes's tourist crowds thin sharply after mid-September.

Greek cruising-fee taxes (TEPAI) apply per yacht per day for all charters — the broker pre-pays them out of the APA, so they appear as a transparent line item on the charter accounting, not a surprise at check-out. Cross-border to Turkey requires transit log paperwork lodged 24 hours ahead at the port-of-entry checkpoint (Rhodes, Kos or Symi southbound; Bodrum northbound).`,
  routes: [kosRouteConfig, rhodesRouteConfig, kos14DaysRouteConfig, rhodes14DaysRouteConfig],
};

export default dodecaneseItinerary;
