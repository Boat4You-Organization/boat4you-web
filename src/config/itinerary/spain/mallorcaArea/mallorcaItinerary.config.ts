import { Itinerary } from '@/types/itinerary.type';

import {
  ciutadellaRoute,
  ciutadellaSouthRoute,
  mallorcaRoundIsland14Route,
  palmaDeMallorcaRoute,
  palmaDeMallorcaSouthRoute,
} from './routes';

const mallorcaItinerary: Itinerary = {
  metaTitle: 'Mallorca Yacht Charter Itineraries | Balearic Island Sailing',
  metaDesc:
    'Yacht charter itineraries from Mallorca — Palma marina cluster, Cabrera National Park, Sóller, Sa Calobra, Mondragó. Largest Spanish fleet, Saturday afternoon PMI embarkation.',
  id: 'mallorca',
  sailingArea: 'Mallorca',
  image: {
    src: '/images/itinerary/spain/mallorca-itinerary/itinerary-card.webp',
    alt: 'Mallorca',
  },
  title: 'Mallorca area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/spain/spain-banner.webp',
    alt: 'Mallorca',
  },
  description: `Mallorca is the largest Balearic and the most balanced charter ground in the western Mediterranean — Palma's deep marina cluster (Marina Port de Mallorca, Real Club Náutico de Palma, Marina Naviera Balear, Club de Mar, STP) gives the broadest fleet selection in Spain by berth count, the southern and eastern coasts have the cove-and-cala anchorages (Cala Pi, Cala Mondragó, Cala Figuera, Cala d'Or, Porto Petro), the Cabrera National Park sits 8 NM south of the Cap de Salinas tip, and the western Tramuntana coast offers dramatic cliff-backed sailing past Sa Calobra and Port de Sóller. Direct EU flights into Palma airport (PMI — Spain's third-busiest after MAD and BCN) make Saturday-afternoon embarkation effortless from London, Manchester, Dublin, Paris, Berlin, Munich, Vienna, Amsterdam, Zürich, Geneva, Stockholm, Copenhagen and most major Italian hubs.

A 7-day Mallorca week typically runs counter-clockwise from Palma: Day 1 short hop to Sa Rapita or El Arenal for the shake-down swim, Day 2 across to Cabrera National Park (overnight buoy permit required, controlled-anchorage marine park — see paragraph below), Day 3 east-coast climb to Porto Petro and Cala d'Or, Day 4 lay-day at Mondragó or Cala Llombards, Day 5 north to Porto Cristo (the Coves del Drac stalactite caves are a worthwhile shore-half-day), Day 6 Cala Ratjada or Capdepera at the northeastern tip, Day 7 return via Cala Bona and Cala Millor or the long sail back along the east coast. Total roughly 110 NM.

The northern route runs counter-clockwise via the Tramuntana coast: Palma → Andratx and Sant Telm (sail past Sa Dragonera island), then north up the rocky west coast to Port de Sóller (the standout north-coast harbour, walkable to the Sóller town centre via the historic wooden tram), Sa Calobra (the canyon-mouth anchorage at the foot of the Torrent de Pareis gorge), Cap Formentor (the northernmost tip of Mallorca with the Formentor lighthouse), Pollença Bay, then back south via Alcúdia and the east coast. Heavier sailing, more dramatic scenery, more demand on skipper experience — the west coast doesn't have many bail-out harbours if the Tramuntana wind shifts.

Cabrera National Park deserves its own paragraph. The 19-island archipelago 8 NM south of Mallorca was designated Spain's first National Park (1991 — terrestrial and marine combined). The whole area is permit-controlled: anchoring outside designated mooring zones is prohibited, the Park boundary is patrolled by Park rangers, and the 50 mooring buoys in the main bay (Es Port) book out for July-August by mid-May. Reservations open online 30 days ahead through the Govern de les Illes Balears Park reservation system; the partner agency in Palma handles the booking as part of pre-charter setup. The reward: water clarity that the Balearics' developed coastline can't match, with the Posidonia seagrass meadows and a Roman-period wreck visible to 30+ m depth on a settled day.

Vessel mix is the most diverse in Spain — sailing yachts (Bavaria, Jeanneau, Bénéteau, Hanse 40–55 ft), catamarans (Lagoon 42-50, Bali 4.4-5.4, Leopard 45 — excellent for Cabrera and Mondragó shallow-bottom anchorages), motor yachts (Princess, Sunseeker, Azimut, Pershing 40–70 ft — the Palma marina scene rivals Costa Smeralda in megayacht concentration), and a strong crewed luxury yacht segment in the 50+ ft range serving the Mallorca-Menorca-Ibiza Balearic-triangle market. Crewed mega yachts (30+ m) launch from STP and Marina Port de Mallorca as the home base for the western-Med summer season.

Best season May–early July and September. The Tramuntana wind from the north-west builds in winter and shoulder seasons (genuinely dangerous in late autumn — the season effectively closes mid-November); summer is settled with reliable south-westerly afternoon thermals 3–5 Bft. July–August brings family-tourism crowds (PMI airport at peak capacity, the Palma harbour at full-night-fee €130–250 for a 45 ft yacht), but Mallorca handles them better than Ibiza — the cove network is dense enough that even peak August has empty bays within 10 NM of any port. May has the smallest crowds and the cooler swim; September is the broker's preferred window — water 24 °C, water clarity at peak, Tramuntana risk still moderate.

Mallorcan cuisine is a charter draw — sobrassada (the soft cured pork spread), ensaïmada (the spiral coiled pastry, eaten at breakfast), tumbet (the layered aubergine and potato), Mahón cheese (technically from Menorca but ubiquitous on the Mallorcan tables), and Binissalem DO red wines from the centre of the island. Marina-side dining at Puerto Portals (high-end west of Palma) and Port d'Andratx delivers consistent quality; the village trattorie at Deià (Sa Foradada cove restaurant, only reachable by boat or by 45-minute hike) and Sóller (Béns d'Avall, the standout Tramuntana-coast establishment) are the gastronomic anchors of the western route.`,
  routes: [
    ciutadellaRoute,
    ciutadellaSouthRoute,
    palmaDeMallorcaRoute,
    palmaDeMallorcaSouthRoute,
    mallorcaRoundIsland14Route,
  ],
};

export default mallorcaItinerary;
