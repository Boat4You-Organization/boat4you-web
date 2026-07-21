import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sorentoRoute: ItineraryRoute = {
  metaTitle: 'Sorrento Yacht Charter Route | Amalfi Coast Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Sorrento via Positano, Praiano, Amalfi, Vietri, Salerno, Agropoli and Acciaroli — Amalfi Coast loop down to the Cilento marine reserve.',
  id: 'sorento',
  startingPoint: 'Sorrento',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/amalfi-itinerary/routes/sorrento.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/amalfi-sea-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/amalfi-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/sorento-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/sorento-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'sorrento-positano',
      routeFrom: 'Sorrento',
      routeTo: 'Positano',
      day: 1,
      mapPin: {
        desktop: { left: 36.1, top: 30.1 },
        mobile: { left: 36.1, top: 30.1 },
      },
      description:
        '12 nm short shake-down south from Marina Piccola di Sorrento round the Punta Campanella headland to Positano. Pass Li Galli Islands (3 nm east of Positano, the legendary Sirens islets, private and uninhabited). Positano has no marina; mooring is on the Spiaggia Grande town buoys (€80-150/night peak) booked through the harbour master. Anchor in Fornillo Bay 0.3 nm west if buoys are full.',
      shortDescription:
        '12 nm shake-down S from Sorrento round Punta Campanella to Positano. Pass Li Galli Islands. Positano has buoys only (€80-150/night), no marina; anchor in Fornillo Bay if full.',
      thingsToDo: [
        'Climb the cliff stairs to Chiesa di Santa Maria Assunta',
        'Swim Spiaggia Grande and Fornillo bays',
        'Lemon delizia at a cliff-side bar',
        'Walk the Path of the Gods (Sentiero degli Dei)',
      ],
      mooringTip:
        'Positano town buoys €80-150/night peak — book ahead via the harbour master. Fornillo Bay anchor on sand at 6-8 m if full. Sheltered from N; exposed to S libeccio.',
      gallery: [{ src: '/images/itinerary/italy/destinations/positano.webp', alt: 'Positano' }],
    },
    {
      id: 'positano-praiano-conca-dei-marini',
      routeFrom: 'Positano',
      routeTo: 'Praiano',
      day: 2,
      mapPin: {
        desktop: { left: 38.4, top: 31.7 },
        mobile: { left: 38.4, top: 31.7 },
      },
      description:
        '6 nm short hop east along the Amalfi Coast cliffs to Praiano + Conca dei Marini area. The Emerald Grotto (Grotta dello Smeraldo) at Conca dei Marini is the highlight — sea cave 24 m deep with sunlight filtering through an underwater opening, accessible by tender. Marina di Praia is the small fishing-boat harbour at Praiano; anchor outside on sand at 6-8 m.',
      shortDescription:
        '6 nm short hop east along Amalfi cliffs. Emerald Grotto at Conca dei Marini is the highlight (sea cave with underwater light). Marina di Praia anchor outside.',
      thingsToDo: [
        'Tender into the Emerald Grotto cave',
        'Snorkel Marina di Praia rocky shoreline',
        'Zucchini-blossom risotto at Il Monastero',
        'Walk Praiano cliff-stair belvedere viewpoints',
      ],
      mooringTip:
        'Anchor outside Marina di Praia on sand at 6-8 m, sheltered from N. Buoys at Conca dei Marini for daytime cave visit only.',
      gallery: [{ src: '/images/itinerary/italy/destinations/praiano.webp', alt: 'Praiano' }],
    },
    {
      id: 'conca-amalfi-maiori',
      routeFrom: 'Conca',
      routeTo: 'Amalfi',
      day: 3,
      mapPin: {
        desktop: { left: 44, top: 32.7 },
        mobile: { left: 44, top: 32.7 },
      },
      description:
        '8 nm east to Amalfi + Maiori. Amalfi has a small marina (Porto di Amalfi) — pre-book in peak July-August. Maiori 2 nm further east is the longest sandy beach on the coast (1 km), with a dedicated marina inside the breakwater. The Cathedral of Amalfi (St Andrew the Apostle, 9th c) and the Museo della Carta (medieval paper mill) are the headline shore activities.',
      shortDescription:
        '8 nm east to Amalfi + Maiori. Porto di Amalfi small marina pre-book in peak; Maiori has the longest sandy beach + dedicated marina. Cathedral + Museo della Carta.',
      thingsToDo: [
        'Visit the 9th-c Cathedral of Amalfi',
        'Tour the medieval Museo della Carta paper mill',
        'Cycle the Lemon Trail through sfusato groves',
        'Granita di limone on the Maiori boardwalk',
      ],
      mooringTip:
        'Porto di Amalfi stern-to, €100-180/night peak, pre-book. Maiori marina is the larger alternative at €70-120/night.',
      gallery: [{ src: '/images/itinerary/italy/destinations/amalfi.webp', alt: 'Amalfi' }],
    },
    {
      id: 'maiori-vietri-sul-mare-salerno',
      routeFrom: 'Maiori',
      routeTo: 'Vietri sul Mare',
      day: 4,
      mapPin: {
        desktop: { left: 46.5, top: 30.6 },
        mobile: { left: 46.5, top: 30.6 },
      },
      description:
        "8 nm east to Vietri sul Mare + Salerno. Vietri is the ceramics capital of the Amalfi Coast; family workshops along the Corso line the road from the marina up to the village. Salerno itself is the major mainland port at the eastern end of the Amalfi Coast — Marina d'Arechi 4 nm south is the modern charter overnight, the largest in Campania.",
      shortDescription:
        "8 nm east to Vietri + Salerno. Vietri ceramics workshops along the Corso. Marina d'Arechi 4 nm south is largest charter overnight in Campania. Porto Vietri is the smaller historic alternative at €40-60/night. Plan to make a pulcinella ceramic figure at a family studio and scialatielli pasta with seafood at Mamma Rosa.",
      thingsToDo: [
        'Make a pulcinella ceramic figure at a family studio',
        'Walk the Vietri Corso ceramic-tiled stairs',
        'Scialatielli pasta with seafood at Mamma Rosa',
        'Visit Giardino della Minerva (oldest botanical garden in Europe)',
      ],
      mooringTip:
        "Marina d'Arechi stern-to, €100-160/night peak, full services. Porto Vietri is the smaller historic alternative at €40-60/night.",
      gallery: [{ src: '/images/itinerary/italy/destinations/sulmare.webp', alt: 'Vietri sul Mare' }],
    },
    {
      id: 'salerno-agropoli',
      routeFrom: 'Salerno',
      routeTo: 'Agropoli',
      day: 5,
      mapPin: {
        desktop: { left: 53.5, top: 26.9 },
        mobile: { left: 53.5, top: 26.9 },
      },
      description:
        '20 nm south to Agropoli — Cilento national park starts here, dramatically different from the Amalfi cliffs. Aragonese castle on the headland above the village. Trentova Bay 1 nm north is the marine reserve anchorage with seagrass meadows. The Greek temples of Paestum (UNESCO, 6th-c BC) are 8 km inland by taxi.',
      shortDescription:
        '20 nm south to Agropoli — Cilento park starts here. Trentova Bay 1 nm north for marine reserve anchorage. Paestum 6th-c BC Greek temples 8 km inland.',
      thingsToDo: [
        'Taxi to the 6th-c BC Paestum Greek temples',
        'Snorkel Trentova Bay marine reserve seagrass meadows',
        'Walk up to the Aragonese castle',
        'Mozzarella di bufala straight from a Cilento farm',
      ],
      mooringTip:
        'Stern-to in Agropoli town quay, €40-70/night, sheltered from N. Marina di Agropoli inside the breakwater is the modern alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/agropoli.webp', alt: 'Agropoli' }],
    },
    {
      id: 'agropoli-acciaroli',
      routeFrom: 'Agropoli',
      routeTo: 'Acciaroli',
      day: 6,
      mapPin: {
        desktop: { left: 57.6, top: 27 },
        mobile: { left: 57.6, top: 27 },
      },
      description:
        '15 nm south to Acciaroli — small fishing port in the Cilento national park, the village where Hemingway spent the summer of 1952 and is rumoured to have started Old Man and the Sea. Sirenuse rock spires offshore. Pioppi, 3 nm south, is the village where the Mediterranean Diet was first scientifically defined.',
      shortDescription:
        '15 nm south to Acciaroli — Cilento fishing port, Hemingway 1952 summer base. Pioppi 3 nm south is the Mediterranean Diet birthplace village. Stern-to in Acciaroli harbour, €30-50/night, sheltered from N; Pioppi anchor on sand at 4-6 m for swim alternative.',
      thingsToDo: [
        'Anchor swim at Sirenuse rock spires',
        'Walk the Hemingway plaque waterfront',
        'Pesce alla brace at a Pioppi quay taverna',
        'Cycle the Pioppi Mediterranean Diet trail',
      ],
      mooringTip:
        'Stern-to in Acciaroli harbour, €30-50/night, sheltered from N. Pioppi anchor on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/acciaroli.webp', alt: 'Acciaroli' }],
    },
    {
      id: 'acciaroli-sirens-island-sorrento',
      routeFrom: 'Acciaroli',
      routeTo: 'Sorrento',
      day: 7,
      mapPin: {
        desktop: { left: 40.8, top: 36.1 },
        mobile: { left: 40.8, top: 36.1 },
      },
      description:
        '38 nm long northwest back to Sorrento — full-day passage along the Cilento coast and round the Punta Campanella headland. Optional Li Galli Islands swim stop (private islets, anchorage permitted on the south side). Marina Piccola di Sorrento is the standard charter overnight.',
      shortDescription:
        '38 nm long NW back to Sorrento. Full-day passage round Punta Campanella. Optional Li Galli Islands swim stop on the way. Marina Piccola di Sorrento stern-to, €100-160/night peak; Refuel at the entrance fuel berth; Confirm handover slot 24h ahead.',
      thingsToDo: [
        'Optional Li Galli Islands swim stop',
        'Linguine alle vongole on deck for lunch',
        'Refuel and clean the boat at Marina Piccola',
        'Crew dinner on the Sorrento waterfront',
      ],
      mooringTip:
        'Marina Piccola di Sorrento stern-to, €100-160/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/italy/destinations/sorrento.webp', alt: 'Acciaroli' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/map.webp',
        alt: 'Sorento Route Image',
      },
      width: 1588,
      height: 1230,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/mobile-map.webp',
        alt: 'Sorento Route Image',
      },
      width: 1252,
      height: 1300,
    },
  },
};

export default computeItineraryNumberOfDays(sorentoRoute);
