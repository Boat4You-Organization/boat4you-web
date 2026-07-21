import { Itinerary } from '@/types/itinerary.type';

import { bodrumAkyakaRoute, bodrumDidimRoute, bodrumRoute, gokovaGulf14Route } from './routes';

const bodrumItinerary: Itinerary = {
  metaTitle: 'Bodrum Yacht Charter Itineraries | Aegean Blue Cruise from Bodrum',
  metaDesc:
    'Yacht charter itineraries from Bodrum — Gulf of Gökova, Cleopatra Island, Çökertme. Yalıkavak / Turgutreis / Bodrum Marmara bases. Gulet, bareboat and crewed, season Apr–Nov.',
  id: 'bodrum',
  sailingArea: 'Bodrum',
  image: {
    src: '/images/itinerary/turkey/bodrum-itinerary/itinerary-card.webp',
    alt: 'Bodrum',
  },
  title: 'Bodrum area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/turkey/turkey-banner.webp',
    alt: 'Bodrum',
  },
  description: `Bodrum is the western embarkation hub for Turkish yacht charters — Yalıkavak Marina (the largest superyacht marina in the eastern Mediterranean, 400+ berths, the Med's busiest 60+ m yacht cluster after Antibes), Turgutreis Marina (the bareboat fleet centre, lower overnight rates and fast access to the western anchorages), and Bodrum's own Marmara Marina inside the castle bay (closest to Bodrum Old Town, walking distance to the Mausoleum at Halicarnassus). All three handle embarkation; Milas-Bodrum airport (BJV) is 35 minutes north and runs direct EU flights April through October.

The Gulf of Gökova south of Bodrum is the standout itinerary: 25 NM of protected anchorages between Cleopatra (Sedir) Island — the legend says Cleopatra's white-sand beach was imported here from Egypt for her, and the sand grain analysis genuinely matches a North African source — Bencik, Longoz, Çökertme, English Harbour and Karacasöğüt. The Gulf is walled by 800 m mountains on three sides, so the meltemi blows in at the entrance but the inner two-thirds stays sheltered even on strong-wind days. Most evenings end with the boat moored stern-to a tree on the shore (a Turkish charter signature — the partner agency provides the marlin line, the captain rigs it), the restaurant launch comes out to collect the crew, and dinner runs ashore at a family-run dock-side meyhane.

Bodrum's signature pull is the Turkish gulet — traditional wooden motor-sailers (typically 20–40 m, 6–12 cabins) with full crew (captain, chef, hostess, deckhand) at all-inclusive pricing 30–40% below equivalent crewed yachts in Croatia or Greece. The gulet market dominates the Turkish charter scene, but the bareboat segment is growing: sailing yachts (Bavaria, Sun Odyssey, Hanse 40–50 ft) and catamarans (Lagoon 42-50, Bali 4.4-5.4, Leopard 45) are available in increasing numbers from Turgutreis and Bodrum bases. The motor yacht segment serves the Yalıkavak superyacht scene — 30 m+ Westport, Princess and Sunseeker hulls, weekly rates €40,000+.

The standard 7-day Bodrum loop runs counter-clockwise into Gökova: Day 1 short hop to Karaada (Black Island, swim/snorkel stop 4 NM south of Bodrum harbour), Day 2 into the Gulf to Cleopatra/Sedir, Day 3 deeper to Çökertme (with the famous shore-side restaurant cluster), Day 4 lay-day at Çökertme or onward to English Harbour, Day 5 Karacasöğüt for Wednesday night fish dinner, Day 6 return via Akbük and the Bodrum peninsula coves, Day 7 base. Roughly 110 NM total, almost all sheltered.

Cross-border one-ways are popular: Bodrum → Kos (one-day delivery to the Greek Dodecanese) is the easiest way to combine Turkish and Greek sailing in 14 days. The transit log filing runs 24 hours ahead at the port-of-entry checkpoint, broker handles it. The southbound version (Kos → Bodrum) also works for crews wanting the cheaper-overall Turkish hospitality side after a meltemi week.

The Turkish season runs longest of all Mediterranean grounds — April through early November — with August Bodrum heat (35–38 °C onshore) being the only real downside. May, June, September and October are the broker's preferred windows: water 22–25 °C, light afternoon meltemi 3–4 Bft, the marinas reachable without pre-booking. Turkish cuisine at Çökertme, Karacasöğüt and Kapı Creek meyhanes is a charter draw of its own — meze plates, raki, fresh-caught fish grilled simply, prices roughly half of comparable Greek tavernas.

Permits and paperwork: Turkish charter agencies handle the transit log, marina fees, fishing-licence-where-needed, and the Turkish VAT-equivalent (KDV) on the charter base price (already in the broker quote). National Park entry fees apply to Saklıkent Gorge inland excursions if the crew wants the shore tour, but Gökova is a Special Environmental Protection Area, not a fee-charged National Park.`,
  routes: [bodrumRoute, bodrumAkyakaRoute, bodrumDidimRoute, gokovaGulf14Route],
};

export default bodrumItinerary;
