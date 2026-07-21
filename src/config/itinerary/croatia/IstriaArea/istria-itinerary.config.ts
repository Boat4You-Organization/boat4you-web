import { Itinerary } from '@/types/itinerary.type';

import {
  pomer14DaysRoute,
  pomerKrkRoute,
  pula14DaysRoute,
  pulaRoute,
  punat14DaysRoute,
  punatMaliLosinjRoute,
  punatRijekaRoute,
} from './routes';

const istriaItinerary: Itinerary = {
  metaTitle: 'Istria Sailing Itineraries | Croatia Yacht Routes from Istra',
  metaDesc:
    'Istria yacht charter routes from Pula, Pomer & Punat — 7- and 14-day Brijuni, Cres, Lošinj, Krk and Kvarner Gulf itineraries. Sailor brief with NM.',
  id: 'istria',
  sailingArea: 'Istria',
  image: {
    src: '/images/itinerary/croatia/istria-itinerary/itinerary-card.webp',
    alt: 'Istria',
  },
  title: 'Istria area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/croatia/croatia-banner.webp',
    alt: 'Istria',
  },
  description: `The Istrian charter market sits in northern Croatia and serves a different audience from Dalmatia: shorter passages between sheltered Kvarner Gulf islands, easier road access from Slovenia/Italy/Austria via Trieste or Ljubljana, and a culinary scene built on truffle, olive oil and Malvazija wine rather than Dalmatian seafood-and-wood-fire. Marina ACI Pula, Marina Pomer and Marina Punat (on Krk) handle most embarkations, with weekly check-in / check-out as in the rest of Croatia.
    A 7-day Istrian week typically loops from Pula past Brijuni National Park (former presidential summer residence, controlled-anchorage, a unique sailing-protected reserve), into the Kvarner via Cres, Lošinj and Rab, returning via Pag or back to Pomer. The Punat marina on Krk gives access to the Lošinj dolphin pods and Susak's red-sand beaches that stay quieter than south-Adriatic anchorages. Distances are short — most legs are 12–18 NM — and the maestral kicks in reliably around 14:00.
    Istria suits crews driving in from Central Europe, families with kids who want shorter daily passages, and food-focused charters wanting the truffle-region restaurants in Motovun and Grožnjan a short shore excursion from the marina.`,
  routes: [
    pomer14DaysRoute,
    pomerKrkRoute,
    pula14DaysRoute,
    pulaRoute,
    punat14DaysRoute,
    punatMaliLosinjRoute,
    punatRijekaRoute,
  ],
};

export default istriaItinerary;
