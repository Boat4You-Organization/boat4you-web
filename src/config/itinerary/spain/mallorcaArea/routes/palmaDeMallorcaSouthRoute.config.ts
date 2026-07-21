import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const palmaDeMallorcaSouthRoute: ItineraryRoute = {
  metaTitle: 'Palma de Mallorca – South Coast Yacht Charter Route | Balearic Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Palma via Cala Pi, Es Trenc, Cabrera, Cala Figuera, Portocolom and Cala Santanyí — Mallorca south + Cabrera National Park loop.',
  id: 'palma-de-mallorca-south',
  startingPoint: 'Palma de Mallorca',
  otherPoints: ['South'],
  cardImage: {
    src: '/images/itinerary/spain/mallorca-itinerary/routes/palma-de-mallorca-south.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/spain/banners/palma-de-mallorca-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/mallorca-town-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/mallorca-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/mallorca-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'palma-cala-pi',
      routeFrom: 'Palma',
      routeTo: 'Cala Pi',
      day: 1,
      mapPin: {
        desktop: { left: 17.2, top: 51.3 },
        mobile: { left: 27.3, top: 48.8 },
      },
      description:
        '15 nm shake-down south from Real Club Náutico de Palma to Cala Pi — narrow inlet on the south coast of Mallorca, pine-covered cliffs either side. Cala Pi 17th-century watchtower at the entrance (Aragonese, anti-Barbary defense). Anchor in the inlet on sand 4-6 m, fully sheltered from N.',
      shortDescription:
        '15 nm shake-down S from Real Club Náutico to Cala Pi narrow inlet. 17th-c watchtower at entrance. Anchor on sand fully sheltered N. Highlights: Walk to the 17th-c Cala Pi watchtower and Paddleboard the narrow inlet to head.',
      thingsToDo: [
        'Walk to the 17th-c Cala Pi watchtower',
        'Paddleboard the narrow inlet to head',
        'Hike the Migjorn coast trail',
        'Arròs brut Mallorcan stew at Sa Sinia',
      ],
      mooringTip:
        'Free anchoring in Cala Pi on sand at 4-6 m, fully sheltered from N. No marina inside the inlet — anchor only.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-pi.webp', alt: 'Cala Pi' }],
    },
    {
      id: 'cala-pi-es-trenc-sa-rapita',
      routeFrom: 'Cala Pi',
      routeTo: 'Es Trenc',
      day: 2,
      mapPin: {
        desktop: { left: 23.4, top: 71.3 },
        mobile: { left: 30.7, top: 58.6 },
      },
      description:
        '8 nm east to Es Trenc + Sa Ràpita. Es Trenc is the longest sand-only beach on Mallorca (3 km, the only Caribbean-quality sand on the island, no resort development). Sa Ràpita marina 2 nm east. Salinas de Levante salt flats inland with flamingos.',
      shortDescription:
        '8 nm E to Es Trenc + Sa Ràpita. Es Trenc is longest sand-only beach in Mallorca (3 km, no resort development). Salinas de Levante flamingos inland.',
      thingsToDo: [
        'Anchor swim at Es Trenc 3-km Caribbean sand',
        'Cycle the Salinas de Levante salt-flat path',
        'Spot flamingos at the saltworks',
        'Pa amb oli garlic-olive bread at a beach cottage',
      ],
      mooringTip:
        'Sa Ràpita marina stern-to, €80-130/night peak, sheltered from N. Anchor off Es Trenc on sand at 4-6 m as alternative (no facilities).',
      gallery: [{ src: '/images/itinerary/spain/destinations/es-trenc.webp', alt: 'Es Trenc' }],
    },
    {
      id: 'sa-rapita-cabrera-archipelago',
      routeFrom: 'Sa Ràpita',
      routeTo: 'Cabrera Archipelago',
      day: 3,
      mapPin: {
        desktop: { left: 28.9, top: 70 },
        mobile: { left: 37.3, top: 58.9 },
      },
      description:
        '8 nm south to Cabrera Archipelago — National Park since 1991, 7 main islands + dozens of islets. Mooring inside the Park requires pre-booked buoys (50 buoys at Es Port main bay, opens online 30 days ahead, fills for July-August by mid-May). Park Authority: Govern de les Illes Balears. The Park has the best swimming-water clarity in the Mediterranean (Posidonia meadows visible at 35 m).',
      shortDescription:
        '8 nm S to Cabrera Park (since 1991). 50 buoys at Es Port, online 30 days ahead. Best Med swimming clarity (Posidonia at 35 m). Pre-book essential.',
      thingsToDo: [
        'Hike to the 14th-c Castle of Cabrera',
        'Snorkel the Blue Grotto sea cave',
        'Visit the small Park Visitors Centre',
        'Stargaze with no light pollution',
      ],
      mooringTip:
        'Cabrera Park mooring buoys at Es Port, €40-80/night peak, pre-book online 30 days ahead via Govern Balear. Anchoring outside zones prohibited (€500+ fine).',
      gallery: [{ src: '/images/itinerary/spain/destinations/cabrera-archipelago.webp', alt: 'Cabrera Archipelago' }],
    },
    {
      id: 'cabrera-cala-figuera',
      routeFrom: 'Cabrera',
      routeTo: 'Cala Figuera',
      day: 4,
      mapPin: {
        desktop: { left: 31.8, top: 88.8 },
        mobile: { left: 36.9, top: 70.1 },
      },
      description:
        '12 nm northeast back to Mallorca east coast at Cala Figuera — postcard-perfect fishing village (still working, not resort-developed). Cobalt-blue painted boats line the inlet. Cala Santanyí limestone cliffs 1 nm east for kayak. Cala Figuera small marina stern-to, €60-100/night, sheltered from N. Anchor in the inlet on sand at 4-6 m as alternative. Plan to walk the cobblestone fishing-village paths, kayak to Cala Santanyí limestone cliffs, caldereta lobster stew at Es Port (since 1954).',
      shortDescription:
        '12 nm NE back to Mallorca at Cala Figuera — working fishing village (not resort). Cobalt-blue boats line inlet. Cala Santanyí cliffs 1 nm E.',
      thingsToDo: [
        'Walk the cobblestone fishing-village paths',
        'Kayak to Cala Santanyí limestone cliffs',
        'Caldereta lobster stew at Es Port (since 1954)',
        'Photograph cobalt-blue painted boats',
      ],
      mooringTip:
        'Cala Figuera small marina stern-to, €60-100/night, sheltered from N. Anchor in the inlet on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-figuera.webp', alt: 'Cala Figuera' }],
    },
    {
      id: 'cala-figuera-portocolom',
      routeFrom: 'Cala Figuera',
      routeTo: 'Portocolom',
      day: 5,
      mapPin: {
        desktop: { left: 43.9, top: 73.5 },
        mobile: { left: 45.7, top: 58.6 },
      },
      description:
        '15 nm north to Portocolom — horseshoe harbour, rainbow-painted houses, fully sheltered. Cap de Ses Salines lighthouse 4 nm south for the view to Sa Dragonera islet. Cala Marçal 1 nm south for swim. Plenty of capacity. Plan to anchor swim at Cala Marçal and visit Can Gaià vineyard (sea-spray salted grapes).',
      shortDescription:
        '15 nm N to Portocolom — horseshoe harbour, rainbow houses, fully sheltered. Cap de Ses Salines lighthouse 4 nm S. Cala Marçal swim. Plenty of capacity. Plan to anchor swim at Cala Marçal and visit Can Gaià vineyard (sea-spray salted grapes).',
      thingsToDo: [
        'Anchor swim at Cala Marçal',
        'Walk Cap de Ses Salines lighthouse trail',
        'Visit Can Gaià vineyard (sea-spray salted grapes)',
        'Walk Portocolom rainbow-painted seafront',
      ],
      mooringTip: 'Portocolom marina stern-to, €80-130/night peak, fully sheltered. Plenty of capacity.',
      gallery: [{ src: '/images/itinerary/spain/destinations/portocolom.webp', alt: 'Portocolom' }],
    },
    {
      id: 'portocolom-cala-santanyi',
      routeFrom: 'Portocolom',
      routeTo: 'Cala Santanyí',
      day: 6,
      mapPin: {
        desktop: { left: 48.7, top: 61.3 },
        mobile: { left: 54.6, top: 44.1 },
      },
      description:
        '8 nm south to Cala Santanyí — limestone-cliff cove, snorkel-friendly underwater arches. Santueri Castle 4 km inland (14th-c, hilltop ruins on the cliff above the town of Santanyí, panoramic Mediterranean views). Hierbas liqueur tasting at Sa Cova. Anchor in Cala Santanyí on sand at 4-6 m, sheltered from N. No marina inside the cove. Cala Mondragó 2 nm south is the alternative (nature park, mooring buoys). Plan to snorkel underwater arches at Cala Santanyí, walk to the 14th-c Santueri Castle ruins, tasting hierbas liqueur at Sa Cova.',
      shortDescription:
        '8 nm S to Cala Santanyí — limestone-cliff cove, snorkel-friendly arches. Santueri Castle 14th-c hilltop ruins 4 km inland. Hierbas liqueur tasting. No marina inside the cove; Cala Mondragó 2 nm south is the alternative (nature park, mooring buoys).',
      thingsToDo: [
        'Snorkel underwater arches at Cala Santanyí',
        'Walk to the 14th-c Santueri Castle ruins',
        'Tasting hierbas liqueur at Sa Cova',
        'Beach lunch at Cala Llombards',
      ],
      mooringTip:
        'Anchor in Cala Santanyí on sand at 4-6 m, sheltered from N. No marina inside the cove. Cala Mondragó 2 nm south is the alternative (nature park, mooring buoys).',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-santanyi.webp', alt: 'Cala Santanyí' }],
    },
    {
      id: 'cala-santanyi-palma',
      routeFrom: 'Cala Santanyí',
      routeTo: 'Palma',
      day: 7,
      mapPin: {
        desktop: { left: 46.8, top: 67.5 },
        mobile: { left: 51.4, top: 50.7 },
      },
      description:
        '24 nm long west back to Palma. Optional swim stop at Cala Llombards (limestone cliffs, sand bottom). Refuel at Real Club Náutico de Palma before tying up. Standard 14:00 marina arrival for handover-prep evening. Real Club Náutico de Palma stern-to, €150-250/night peak.',
      shortDescription:
        '24 nm long W back to Palma. Optional Cala Llombards swim stop. Refuel at Real Club Náutico before mooring. Standard 14:00 arrival. Real Club Náutico de Palma stern-to, €150-250/night peak.',
      thingsToDo: [
        'Optional Cala Llombards swim stop',
        'Walk Passeig des Born promenade (Palma)',
        "Almond ensaimada pastry at Ca'n Joan de S'Aigo",
        'Refuel and clean the boat at Real Club Náutico',
      ],
      mooringTip:
        'Real Club Náutico de Palma stern-to, €150-250/night peak. Marina Port de Mallorca alternative at €120-200/night. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/spain/destinations/palma.webp', alt: 'Palma' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/map.webp',
        alt: 'Palma de Mallorca south Route Image',
      },
      width: 1838,
      height: 1286,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/mobile-map.webp',
        alt: 'Palma de Mallorca south Route Image',
      },
      width: 1312,
      height: 1358,
    },
  },
};

export default computeItineraryNumberOfDays(palmaDeMallorcaSouthRoute);
