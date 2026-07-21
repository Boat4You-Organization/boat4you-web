import { Itinerary } from '@/types/itinerary.type';

import lauriumSubarea from './routes/laurium';
import mykonosSubarea from './routes/mykonos';
import parosSubarea from './routes/paros';
import saronicSubarea from './routes/saronic';

const cycladesItinerary: Itinerary = {
  metaTitle: 'Cyclades Yacht Charter Itineraries | Greece Island Sailing Routes',
  metaDesc:
    'Yacht charter itineraries in the Cyclades — Mykonos, Santorini, Paros, plus quieter stops at Syros and Sifnos. Meltemi-driven southbound routes from Athens-area bases (Alimos, Lavrion).',
  id: 'cyclades',
  sailingArea: 'Cyclades',
  image: {
    src: '/images/itinerary/greece/cyclades-itinerary/itinerary-card.webp',
    alt: 'Cyclades',
  },
  title: 'Cyclades area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/greece/greece-banner.webp',
    alt: 'Cyclades area banner image',
  },
  description: `The Cyclades are the most demanding charter ground in Greece — and the most photogenic. Bases at Athens (Alimos, Kalamaki, Lavrion) put you 30–45 NM from Kea on the first leg, and from there the meltemi (typically 4–6 Bft, peaking 7+ in late July/August) drives a southward arc through Kythnos, Serifos, Sifnos, Paros, Mykonos, Santorini and Ios. Charters that try to claw back north against the meltemi without time and patience get expensive in fuel and uncomfortable in passages — the conventional one-way drop in Paros or Mykonos solves both.
    Vessel mix in the Cyclades runs heavy on monohull sailing yachts (45–55 ft) because they handle the meltemi better than catamarans on close-reach upwind legs. Catamarans excel for crews staying in the more-protected southern Cyclades cluster (Sifnos, Folegandros, Milos) where the wind angle is mostly downwind. Motor yachts and crewed luxury yachts dominate the Mykonos–Santorini party charter market.
    Best season is May–June and September — meltemi blows lighter, town anchorages are uncrowded, water temperature stays swimmable, and prices drop 30–40% vs August peak. The Cyclades reward experienced skippers; first-time bareboaters typically pick the gentler Ionian first.`,
  routes: [...mykonosSubarea, ...saronicSubarea, ...parosSubarea, ...lauriumSubarea],
};

export default cycladesItinerary;
