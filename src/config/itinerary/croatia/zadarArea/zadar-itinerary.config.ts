import { Itinerary } from '@/types/itinerary.type';

import {
  biogradKornatiHvarKorculaVisSkradin14DaysRoute,
  biogradKornatiKrkaRoute,
  biogradNaMoruPagRoute,
  biogradVisHvarSoltaRoute,
  sukosanKornatiHvarKorculaVisSkradinRoute,
  sukosanKornatiKrkaRoute,
  sukosanPagRoute,
  sukosanVisHvarRoute,
  zadarKornatiHvarKorculaVisSkradin14DaysRoute,
  zadarKornatiKrkaRoute,
  zadarPagRoute,
  zadarVisHvarRoute,
} from './routes';

const zadarItinerary: Itinerary = {
  metaTitle: 'Zadar Area Yacht Charter Itineraries | Croatia Sailing Routes',
  metaDesc:
    'Explore Zadar-area yacht charter routes—from 7-day Kornati & Pag trips to 14-day Biograd to Vis & Hvar voyages. Ideal for sailing yachts, catamarans & motor yachts.',
  id: 'zadar',
  sailingArea: 'Zadar',
  image: {
    src: '/images/itinerary/croatia/zadar-itinerary/itinerary-card.webp',
    alt: 'Zadar',
  },
  title: 'Zadar area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/croatia/croatia-banner.webp',
    alt: 'Zadar',
  },
  description: `The Zadar charter cluster — Marina Sukošan, Marina Kornati Biograd, Marina Tankerkomerc Zadar — sits north of Šibenik and gives the most direct northbound route into Pag, Lošinj and the Kvarner Gulf, plus southbound access to the Kornati national park within 12 NM of departure. Zadar Airport handles direct flights from most European hubs in summer, and the road from Zagreb runs an easy 3 hours via the A1 motorway.
    Zadar's old town sits on a small peninsula with Roman ruins, a Venetian-era cathedral and the celebrated Sea Organ — a row of marble steps that sing when waves push air through underwater pipes. The marina cluster is residential rather than nightlife-driven, which suits crews wanting a calm Saturday embarkation. From here a 7-day week typically loops Kornati → Žirje → Krka → return; longer 14-day charters drop south to Hvar/Vis/Korčula or north to Lošinj and Cres.
    Strong vessel selection across sailing yachts, catamarans and motor yachts at all price tiers — Zadar's marina cluster has the deepest pure-bareboat fleet in Croatia after Split, with prices typically 5–10% lower than equivalent boats in Trogir. Excellent shoulder-season value because the bulk of charter pressure stays around Split.`,
  routes: [
    biogradKornatiHvarKorculaVisSkradin14DaysRoute,
    biogradKornatiKrkaRoute,
    biogradNaMoruPagRoute,
    biogradVisHvarSoltaRoute,
    sukosanKornatiHvarKorculaVisSkradinRoute,
    sukosanKornatiKrkaRoute,
    sukosanPagRoute,
    sukosanVisHvarRoute,
    zadarKornatiHvarKorculaVisSkradin14DaysRoute,
    zadarKornatiKrkaRoute,
    zadarPagRoute,
    zadarVisHvarRoute,
  ],
};

export default zadarItinerary;
