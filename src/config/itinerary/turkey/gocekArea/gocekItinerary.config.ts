import { Itinerary } from '@/types/itinerary.type';

import { fethiyeRoute, gocekKizikuyrukKoyuRoute, gocekRoute, lycianCoast14Route } from './routes';

const gocekItinerary: Itinerary = {
  metaTitle: 'Göcek Yacht Charter Itineraries | Turkish Riviera Sailing',
  metaDesc:
    'Yacht charter itineraries from Göcek — 12 Islands, Hammam Bay, Tomb Bay, Lycian Coast routes east to Kaş and Kekova. Skopea Marina, D-Marin and Marinturk Village Port bases.',
  id: 'gocek',
  sailingArea: 'Gocek',
  image: {
    src: '/images/itinerary/turkey/gocek-itinerary/itinerary-card.webp',
    alt: 'Cyclades',
  },
  title: 'Gocek area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/turkey/turkey-banner.webp',
    alt: 'Gocek',
  },
  description: `Göcek is the eastern Turkish charter base — D-Marin Göcek, Skopea Marina and Marinturk Village Port between them handle the bulk of embarkations, with Dalaman airport (DLM) 15 minutes north and running direct EU flights April through October from London, Manchester, Berlin, Vienna, Brussels, Amsterdam and most major German hubs. Göcek itself is a small town built around the marinas; most charterers see only the marina, the chandlery and the first restaurant on the way back to the boat, but the village holds its own and the Sunday morning markets are worth the 10-minute walk inland.

Göcek's signature is the "12 Islands" — a cluster of pine-backed islets and protected bays inside Fethiye Bay where most of a 7-day week unfolds without ever leaving the inner waters. Cleopatra's Baths (Hammam Bay, with the Roman-era stone hammam ruins visible underwater at the back of the bay), Tomb Bay (Lycian rock-cut tombs in the cliff face above the anchorage), Wall Bay (named for the ancient harbour wall), Sarsala, Kapı Creek and Boynuzbükü are the canonical stops. The protected geography means the meltemi blows over the top of the surrounding hills but the anchorages stay calm — most evenings the only sound at anchor is the cicadas and the launch tenders moving between yachts and shore-side restaurants.

Classic 7-day inner-loop: Day 1 short hop to Hammam Bay for the shake-down lunch and snorkel over the underwater ruins, Day 2 to Tomb Bay with the rock-tomb hike in the late afternoon, Day 3 lay-day at Wall Bay or onward to Sarsala for the long swim-bay, Day 4 Boynuzbükü (the "horn bay") with the famous Olive Garden taverna ashore, Day 5 Kapı Creek night-end stern-to-tree mooring with dinner at one of the three family tavernas, Day 6 short trip across to Ruin Bay, Day 7 return via Tersane Island. Total 60–80 NM over the week — small daily passages and shallow anchorages everywhere.

Longer 10–14 day routes head east along the Lycian Coast through Fethiye, Ölüdeniz (the lagoon visible from the air on the approach to Dalaman), Butterfly Valley (anchorage outside, beach inside reachable by tender or footpath only — no road), Kaş (the standout Lycian-coast town, walkable to Hellenistic ruins), Kekova (sunken Lycian city, ruins partially submerged and visible through a glass-bottom tender), Demre (Saint Nicholas's church, the original Father Christmas — Lycian Myra), and Çıralı with the active Mount Chimaera natural-gas flames burning out of the rock-face above the beach (sailable approach, walkable inland from the anchorage). Phaselis and Olympos give two more Lycian-era harbour ruins on the same coast.

The Lycian Coast offers Turkey's deepest archaeological sailing — more identifiable ancient harbour ruins, more rock-cut tombs, more visible submerged classical-period structures than any other Mediterranean charter ground. Crews more interested in culture than party-week beach scenes consistently rank the Lycian Coast their favourite. The added passage time is 15–35 NM legs (vs Göcek's 5–15 NM inner loop), so the 14-day format works better than trying to compress it into 7 days.

Göcek itself sits inside a strict Special Environmental Protection Area — no jet-ski, no anchoring damage to seagrass, no fishing in marked zones — which keeps the inner Fethiye Bay anchorages in better shape than the Adriatic or Spanish equivalents at peak season. The protection authority occasionally inspects yachts at anchor; the broker briefs the captain on which bays have stricter enforcement.

Vessel mix is a strong gulet market (the Göcek–Fethiye one-way "Blue Cruise" is the most traditional Turkish charter format — 20–35 m wooden motor-sailers with full crew, all-inclusive pricing) plus a growing bareboat catamaran and sailing yacht segment from Skopea and D-Marin. Crewed luxury motor yachts run the Yalıkavak-Göcek long-haul corridor and the eastbound Lycian-Coast 14-day weeks.

Best season May–early July and September–October. The Turkish season runs Apr–Nov, longer than any other Mediterranean ground; August Göcek heat (33–36 °C onshore) and the marina full-book situation are the only real downside. Permits, transit logs and Turkish-side regulatory paperwork are all handled by the partner agency in the booking quote.`,
  routes: [fethiyeRoute, gocekKizikuyrukKoyuRoute, gocekRoute, lycianCoast14Route],
};

export default gocekItinerary;
