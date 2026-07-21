import { Itinerary } from '@/types/itinerary.type';

import ibizaFormentera14Route from './routes/ibizaFormentera14Route.config';
import ibizaRoute from './routes/ibizaRoute.config';

const ibizaItinerary: Itinerary = {
  metaTitle: 'Ibiza Yacht Charter Itineraries | Balearic Island Sailing Routes',
  metaDesc:
    'Yacht charter itineraries from Ibiza — Formentera, Es Vedrà, Cala Comte, Sant Antoni. Marina Ibiza, Botafoch & Sant Antoni bases. Bareboat and crewed, 72h free cancellation.',
  id: 'ibiza',
  sailingArea: 'Ibiza',
  image: {
    src: '/images/itinerary/spain/ibiza-itinerary/itinerary-card.webp',
    alt: 'Ibiza',
  },
  title: 'Ibiza area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/spain/spain-banner.webp',
    alt: 'Ibiza',
  },
  description: `Ibiza sits 80 NM south of Mallorca and 4 NM north of Formentera, at the western edge of the Balearic chain. The island runs roughly 41 km north-south and 25 km east-west — the whole coastline is reachable in a 7-day charter without ever clocking more than a 20 NM day. Three embarkation marinas serve the charter fleet: Marina Ibiza in Ibiza Town (300+ berths, the megayacht cluster, walking distance to the Old Town and beach-club transfers), Marina Botafoch (the upscale alternative on the north side of the harbour, slightly quieter), and Sant Antoni on the west coast (smaller, faster access to Cala Conta and Es Vedrà, lower mooring fees). Ibiza Airport (IBZ) is 15 minutes from Ibiza Town and 25 from Sant Antoni; direct flights run April through October from London, Manchester, Paris, Milan, Munich, Zürich, Amsterdam and most major EU hubs.

The classic 7-day week from Ibiza Town runs counter-clockwise: Day 1 short hop to Talamanca for the shake-down swim, Day 2 cross to Formentera (Cala Saona, Espalmador), Day 3 stay on Formentera (Illetes + Llevant beaches on the north tip), Day 4 jump back to Cala Jondal or Cala Bassa for the beach-club afternoon, Day 5 round Es Vedrà to Cala d'Hort and Cala Comte, Day 6 north to Sant Antoni and Cala Salada, Day 7 return down the west coast to base. Total distance roughly 80 NM over the week — small daily passages, prevailing south-westerly afternoon breeze, sheltered anchorages at every stop. Bareboat crews with one or two seasons of Med experience handle it comfortably.

Two distinct charter audiences come to Ibiza. The first is the high-end party-week crowd — motor yachts and crewed luxury yachts in the 50–100+ ft range, anchoring off Salinas or Cala Jondal for Blue Marlin, Nikki Beach or Beachouse afternoons, mooring at Marina Ibiza overnight, and budgeting €150,000+ for the full week (yacht, crew, fuel, beach-club tabs). The second is the Formentera-and-coves crew on bareboat catamarans (Lagoon 42, Bali 4.6, Leopard 45) wanting clear-water anchorages, minimal crowds, and a per-week budget closer to €10,000–18,000 base. Sailing monohulls work for either group, but party-week dynamics push most of the segment toward catamarans for the stable hull under load at busy beach-clubs.

Formentera deserves its own paragraph. The island is a protected Natural Park, the Posidonia seagrass meadows around it are a UNESCO World Heritage marine ecosystem, and anchoring restrictions are real and enforced. Espalmador (the small island off Formentera's north tip) requires a mooring permit booked through the Govern de les Illes Balears (€20–50 per night, opens 30 days ahead, books out by early May for July-August). Illetes and Llevant beaches have designated buoy zones — drop anchor outside the buoys and the Park inspector boat will move you within the hour. The reward is some of the clearest water in the western Mediterranean (12–15 m visibility on a settled day) and the white-sand backdrop the brochure pictures actually deliver.

Es Vedrà — the 380 m limestone needle 2 NM off Ibiza's south-west coast — is the iconic Ibiza anchorage. Day-time swim stop only; the swell builds at sunset and the holding is patchy, so don't plan to overnight there. Run inshore to Cala d'Hort or Cala Llentrisca for the sleep. The Es Vedrà sunset from a yacht deck is the closest the Mediterranean comes to a guaranteed photograph — the catamaran fleet drifts together off the south side from 19:00 onwards in summer.

Best season is May–early July and September. July is hot and the marinas fill; August is full-rate everywhere — Marina Ibiza peak nightly fees hit €150–250 for a 45 ft yacht, the beach-club sun-bed minimum spend runs €100+, and Espalmador buoys are gone two weeks before you ask. September drops the same yacht to €80–120/night, water stays 23–24 °C, and the queue at Es Vedrà thins to a handful. May has the lightest wind and the smallest crowds but cooler water (19–21 °C) — best for couples and families more interested in the cruising than the swim.

Weather pattern: prevailing south-westerly afternoon breeze 3–5 Bft (10–18 kt), light morning calm, occasional Tramuntana from the north when a Pyrenean front pushes through — pins the fleet in for 24 hours typically. Autumn storms can be sudden from mid-October; charter season effectively closes November–April. VHF Ch 16 monitored 24/7 by Salvamento Marítimo (Tarragona MRCC); the broker's emergency cycle wakes a duty captain in Palma if a partner-side issue lands outside business hours.`,
  routes: [ibizaRoute, ibizaFormentera14Route],
};

export default ibizaItinerary;
