import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const salernoRoute: ItineraryRoute = {
  metaTitle: 'Salerno Yacht Charter Route | Amalfi Coast & Sorrento Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Salerno via Vietri, Maiori, Amalfi, Sorrento, Naples, Ischia and Cetara — full Amalfi Coast loop with Bay of Naples extension.',
  id: 'salerno',
  startingPoint: 'Salerno',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/amalfi-itinerary/routes/salerno.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/amalfi-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/maiori-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/sorento-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/ischia-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'salerno-vietri-sul-mare',
      routeFrom: 'Salerno',
      routeTo: 'Vietri sul Mare',
      day: 1,
      mapPin: {
        desktop: { left: 56.3, top: 26.2 },
        mobile: { left: 58.5, top: 35.2 },
      },
      description:
        "4 nm short shake-down west from Marina d'Arechi to Vietri sul Mare. Vietri is the ceramics capital of the Amalfi Coast — family workshops along the Corso line the road from the small marina up to the village. Quick first day allows full afternoon ashore.",
      shortDescription:
        "4 nm short shake-down W from Marina d'Arechi to Vietri. Ceramics capital of Amalfi; family workshops along the Corso. Quick day, full afternoon ashore. Highlights: Make a pulcinella ceramic at a family studio and Walk the Vietri Corso ceramic-tiled stairs.",
      thingsToDo: [
        'Make a pulcinella ceramic at a family studio',
        'Walk the Vietri Corso ceramic-tiled stairs',
        'Scialatielli ai frutti di mare at a quay trattoria',
        'Sunset gelato on the seafront passeggiata',
      ],
      mooringTip:
        "Porto Vietri stern-to, €40-60/night, sheltered from N. Marina d'Arechi 4 nm east is the larger alternative for full services.",
      gallery: [{ src: '/images/itinerary/italy/destinations/sulmare.webp', alt: 'Vietri sul Mare' }],
    },
    {
      id: 'vietri-maiori-minori',
      routeFrom: 'Vietri',
      routeTo: 'Maiori',
      day: 2,
      mapPin: {
        desktop: { left: 52.5, top: 28.1 },
        mobile: { left: 52.5, top: 39 },
      },
      description:
        '8 nm west to Maiori — longest sandy beach on the Amalfi Coast (1 km), dedicated marina inside the breakwater. Day-anchor at Minori 1 nm east (small fishing-village beach, sand 4-6 m, sheltered from N) for swim. Sal De Riso pastry shop in Minori is the Amalfi sfusato lemon pastry institution.',
      shortDescription:
        '8 nm west to Maiori. Longest Amalfi sandy beach + dedicated marina. Day-anchor at Minori for swim; Sal De Riso pastry shop for sfusato lemon delizie.',
      thingsToDo: [
        'Sfusato lemon delizie at Sal De Riso (Minori)',
        'Swim Minori sand-bottom beach',
        'Walk the Lemon Trail through sfusato groves',
        'Limoncello tasting at a Minori orchard',
      ],
      mooringTip:
        'Maiori marina stern-to, €70-120/night, sheltered from N. Minori anchor on sand at 4-6 m for day swim.',
      gallery: [{ src: '/images/itinerary/italy/destinations/maiori.webp', alt: 'Maiori' }],
    },
    {
      id: 'minori-amalfi-conca-dei-marini',
      routeFrom: 'Minori',
      routeTo: 'Amalfi',
      day: 3,
      mapPin: {
        desktop: { left: 45.1, top: 30.3 },
        mobile: { left: 45.8, top: 41.1 },
      },
      description:
        '6 nm west to Amalfi + Conca dei Marini. Porto di Amalfi small marina pre-book in peak July-August. Tender to the Emerald Grotto at Conca dei Marini for the cave with underwater light. Cathedral of St Andrew (9th c) on the central piazza.',
      shortDescription:
        '6 nm west to Amalfi. Porto di Amalfi small marina, pre-book peak. Tender to Emerald Grotto cave. 9th-c Cathedral of St Andrew on central piazza.',
      thingsToDo: [
        'Visit the 9th-c Cathedral of St Andrew',
        'Tender into the Emerald Grotto cave',
        'Tour the medieval Museo della Carta',
        "Pezzogna all'acqua pazza at a quay taverna",
      ],
      mooringTip:
        'Porto di Amalfi stern-to, €100-180/night peak, pre-book. Anchor outside on sand at 6-8 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/amalfi.webp', alt: 'Amalfi' }],
    },
    {
      id: 'conca-sorrento',
      routeFrom: 'Conca',
      routeTo: 'Sorrento',
      day: 4,
      mapPin: {
        desktop: { left: 40, top: 31.7 },
        mobile: { left: 38, top: 41 },
      },
      description:
        '12 nm northwest round Punta Campanella to Sorrento. Pass Positano (3 nm east of Punta Campanella, day-anchor on the buoys for lunch swim if time allows) and Li Galli Islands. Marina Piccola di Sorrento for the overnight; the Sorrento waterfront restaurants are a 10-minute walk from the marina up the Corso.',
      shortDescription:
        '12 nm NW round Punta Campanella to Sorrento. Pass Positano (lunch buoys) + Li Galli Islands. Marina Piccola for overnight. exposed to S libeccio. Plan to walk the Path of the Gods (Sentiero degli Dei) and gnocchi alla Sorrentina at Donna Sofia.',
      thingsToDo: [
        'Walk the Path of the Gods (Sentiero degli Dei)',
        'Gnocchi alla Sorrentina at Donna Sofia',
        "Sunset on the cliff terrace at Foreigners' Club",
        'Limoncello tasting in a Sorrento orchard',
      ],
      mooringTip: 'Marina Piccola di Sorrento stern-to, €100-160/night peak. Sheltered from N; exposed to S libeccio.',
      gallery: [{ src: '/images/itinerary/italy/destinations/sorrento.webp', alt: 'Sorrento' }],
    },
    {
      id: 'sorrento-naples',
      routeFrom: 'Sorrento',
      routeTo: 'Naples',
      day: 5,
      mapPin: {
        desktop: { left: 34.7, top: 30.2 },
        mobile: { left: 32.7, top: 38.3 },
      },
      description:
        "20 nm north across the Bay of Naples. Mergellina marina at the centre of Naples is the standard charter overnight; Castel dell'Ovo and the Lungomare promenade are 1 km east. Day-anchor at Marechiaro (south of Mergellina) for swim before mooring.",
      shortDescription:
        "20 nm north across Bay of Naples. Mergellina marina central; Castel dell'Ovo + Lungomare 1 km east. Day-anchor at Marechiaro for swim. Highlights: Pizza margherita at Sorbillo (Spaccanapoli) and Caravaggio at Pio Monte della Misericordia.",
      thingsToDo: [
        'Pizza margherita at Sorbillo (Spaccanapoli)',
        'Caravaggio at Pio Monte della Misericordia',
        'Walk Spaccanapoli alleys for espresso stops',
        'Cocktails on the Lungomare promenade',
      ],
      mooringTip:
        "Mergellina marina stern-to, €80-130/night, sheltered from N. Borgo Marinari at Castel dell'Ovo is the alternative for fewer slots but better location.",
      gallery: [{ src: '/images/itinerary/italy/destinations/naples.webp', alt: 'Naples' }],
    },
    {
      id: 'naples-casamicciola-terme',
      routeFrom: 'Naples',
      routeTo: 'Casamicciola Terme',
      day: 6,
      mapPin: {
        desktop: { left: 28.3, top: 9.4 },
        mobile: { left: 28.5, top: 22.9 },
      },
      description:
        "15 nm west to Ischia — volcanic spa island. Casamicciola Terme on the north coast is the historic thermal-spring port; Forio on the west and Sant'Angelo on the south are alternatives. Soak at Giardini Poseidon (terraced thermal pools, day pass €35), hike Monte Epomeo (789 m, 2 h up) for the panorama back to Capri.",
      shortDescription:
        '15 nm west to Ischia. Casamicciola Terme on N coast for historic thermal port. Giardini Poseidon thermal pools (€35 day) + Monte Epomeo hike for panorama.',
      thingsToDo: [
        'Soak at Giardini Poseidon thermal pools',
        'Hike Monte Epomeo (789 m, 2 h up)',
        "Coniglio all'ischitana rabbit stew at a vineyard",
        'Beach swim at Sorgeto thermal-spring bay',
      ],
      mooringTip:
        "Casamicciola Terme stern-to, €60-100/night, sheltered from N. Forio and Sant'Angelo are the south-coast alternatives.",
      gallery: [{ src: '/images/itinerary/italy/destinations/casamicciola.webp', alt: 'Casamicciola Terme' }],
    },
    {
      id: 'ischia-cetara-salerno',
      routeFrom: 'Ischia',
      routeTo: 'Salerno',
      day: 7,
      mapPin: {
        desktop: { left: 7.6, top: 22.5 },
        mobile: { left: 9.3, top: 32 },
      },
      description:
        "32 nm long southeast back to Salerno via Cetara. Cetara is the colatura di alici (anchovy garum) capital — small Amalfi fishing port, the Roman fish-sauce tradition still active in family workshops. Lunch stop on the way; final overnight at Marina d'Arechi.",
      shortDescription:
        "32 nm long SE back to Salerno via Cetara. Cetara colatura di alici (Roman fish sauce) capital. Lunch stop, then Marina d'Arechi for handover. Refuel at the entrance fuel berth before mooring.",
      thingsToDo: [
        'Tour a colatura di alici workshop in Cetara',
        'Spaghetti with colatura at a Cetara trattoria',
        "Refuel and clean the boat at Marina d'Arechi",
        'Sunset aperitivo on the Lungomare Trieste',
      ],
      mooringTip:
        "Marina d'Arechi stern-to, €100-160/night peak, full services. Refuel at the entrance fuel berth before mooring.",
      gallery: [{ src: '/images/itinerary/italy/destinations/cetara.webp', alt: 'Cetara' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/map.webp',
        alt: 'Salerno Route Image',
      },
      width: 1588,
      height: 1230,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/mobile-map.webp',
        alt: 'Salerno Route Image',
      },
      width: 1252,
      height: 1300,
    },
  },
};

export default computeItineraryNumberOfDays(salernoRoute);
