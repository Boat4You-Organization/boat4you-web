import { Itinerary } from '@/types/itinerary.type';

import { olbiaLongRoute, olbiaRoute, portiscoLongRoute, portiscoRoute, sardiniaMaddalena14Route } from './routes';

const sardiniaItinerary: Itinerary = {
  metaTitle: 'Sardinia Yacht Itineraries | Costa Smeralda & Maddalena',
  metaDesc:
    'Yacht charter itineraries from Sardinia — Costa Smeralda, La Maddalena National Park, Bonifacio crossing, Spiaggia Rosa. Olbia / Portisco / Porto Rotondo bases. Permit-regulated anchorages.',
  id: 'sardinia',
  sailingArea: 'Sardinia',
  image: {
    src: '/images/itinerary/italy/sardinia-itinerary/itinerary-card.webp',
    alt: 'Sardinia',
  },
  title: 'Sardinia area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/italy/italy-banner.webp',
    alt: 'Sardinia',
  },
  description: `Northeast Sardinia and the La Maddalena Archipelago deliver the western Mediterranean's clearest water — granite-cove anchorages with 10–14 m visibility on a settled day, white-sand beaches that pose against turquoise lagoons, and the Costa Smeralda's exclusive marina cluster (Porto Cervo, Porto Rotondo, Cala di Volpe) for the high-end charter market. Charters launch from Marina di Olbia (the main commercial port and the broadest fleet selection), Marina di Portisco (10 minutes north, more bareboat-focused), or Porto Rotondo (smaller, walkable to the piazza, slightly higher overnight rates). Olbia–Costa Smeralda airport (OLB) is 20 minutes from all three and runs direct EU flights April through October from London, Manchester, Düsseldorf, Frankfurt, Munich, Vienna, Geneva, Madrid and most major Italian hubs.

The Sardinian itinerary is unique among Mediterranean charters because the La Maddalena Geomarine National Park (established 1994) sits on the doorstep — 60 islands and islets in the Strait of Bonifacio, with a permit system regulating anchoring to protect the Posidonia seagrass beds. Park entry fee is roughly €100+ per yacht per day, payable to the Park authority (the partner agency files it as part of pre-charter setup, broker shows it as a line item on the quote). Designated mooring buoys cover the most fragile zones; the Park patrol enforces the no-anchor lines and moves yachts that drop on protected seabed.

The classic 7-day week from Olbia loops Olbia → Porto Cervo → La Maddalena (overnight at Cala Gavetta or Porto Massimo) → Spargi (Cala Corsara, the standout swim stop) → Budelli (Spiaggia Rosa — the pink-sand beach, viewable from the water but not landable; landing has been banned since 1994 to protect the unique microflora that gives the sand its colour) → Caprera (Giuseppe Garibaldi's villa, the Italian unification museum) → Bonifacio (Corsica, day trip — the limestone-cliff harbour-mouth approach is the most photographed in the Mediterranean) → Porto Cervo → Olbia. Distances are short (8–22 NM legs) and the maestrale provides reliable 3–5 Bft afternoon sailing.

The Costa Smeralda paragraph deserves its own. The 20-km stretch from Porto Rotondo to Cala di Volpe was developed in the 1960s by the Aga Khan as Italy's answer to the Côte d'Azur — the architecture is intentionally Sardinian-vernacular (granite walls, terracotta roofs, no high-rise) and the marinas hold the largest concentration of 60–100+ m superyachts in the Mediterranean east of Antibes. Porto Cervo's "Old Port" piazza, the Phi Beach club on the rocky promontory, the Cala di Volpe Hotel beach restaurant — the high-glamour scene Charters built for the Costa Smeralda crowd are crewed motor yachts in the 30+ m range, weekly rates €60,000–250,000+ depending on the hull. The bareboat segment co-exists but doesn't dominate this corner of the island.

The longer 10–14 day Sardinia route adds the western coast (Alghero, Bosa, Capo Caccia caves), the southern coast (Cagliari and Villasimius Marine Protected Area), and the Bonifacio-Corsica delivery (cross-border one-way runs to Calvi or Ajaccio). For most charter crews staying in the northeast, the 7-day Maddalena loop is the sweet spot — short legs, dense anchorage options, and the Costa Smeralda marinas within reach for any single overnight port-call.

Vessel mix tilts strongly toward catamarans (shallow draft is critical for the Maddalena lagoon anchorages where 2–3 m sand-bottom depths are common) and motor yachts (the Costa Smeralda marina-and-beach-club scene). Sailing yachts (45–55 ft Bavaria, Bénéteau, Hanse) work for crews skipping the high-end ports and focusing on the Maddalena Park anchorages. Crewed luxury yacht segment (60+ ft) handles the Costa Smeralda corridor as its own premium market.

Best season May–early July and September. The maestrale builds in mid-summer and can blow 6–7 Bft on exposed western anchorages — most of the eastern itinerary stays sheltered. July–August is the glamour season but Porto Cervo mooring fees can hit €600+/night for 50-ft boats, the Cala di Volpe restaurant minimum spend climbs to four figures, and the Maddalena buoys book out three weeks ahead. September drops rates 25–35% and the water stays 23–24 °C through the first half of October.

Sardinian cuisine is a charter draw — fregola con arselle (clam couscous), pane carasau (the wafer-thin Sardinian shepherd bread), seadas (cheese-and-honey fried pastry), Cannonau red wine, Vermentino di Gallura white DOCG. Many of the standout restaurants are inland (the broker can pre-book the rental car for the shore-side day); the dock-side trattorie at La Maddalena port deliver simpler but consistently excellent fish dinners.`,
  routes: [olbiaRoute, olbiaLongRoute, portiscoRoute, portiscoLongRoute, sardiniaMaddalena14Route],
};

export default sardiniaItinerary;
