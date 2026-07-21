import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const parosSyrosMykonosRoute: ItineraryRoute = {
  metaTitle: 'Paros–Syros–Mykonos Yacht Charter Route | Cyclades Sailings',
  metaDesc:
    'Sail a 7-day yacht charter from Paros via Sifnos, Syros, Tinos and Mykonos. Northern Cyclades loop covering the marble-carving capital, neoclassical Ermoupoli and Mykonos.',
  id: 'paros-syros-mykanos',
  startingPoint: 'Paros',
  otherPoints: ['Syros', 'Mykonos'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/paros-syros-mykonos.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/mykonos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/paros-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/syros-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/paros-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'paros-sifnos-vathi',
      routeFrom: 'Paros',
      routeTo: 'Sifnos (Vathi Port)',
      day: 1,
      mapPin: {
        desktop: { left: 51.1, top: 40.4 },
        mobile: { left: 48.5, top: 41.4 },
      },
      description:
        '24 nm west to Sifnos. Vathi on the south coast is the calmest swim anchorage on the island — fjord-like inlet, sand bottom, salt flats inland. The Vathi quay has a small pottery tradition (Sifnos potters at the kilns above the bay) and one of the better seafood tavernas on the island.',
      shortDescription:
        '24 nm west shake-down to Sifnos (Vathi). Fjord-like south-coast inlet, fully sheltered, sand bottom. Pottery kilns ashore, seafood taverna on the quay. Anchor on sand at 4-6 m in Vathi Bay (fully sheltered). Plan to pottery workshop visit in Vathy and swim Vathi Bay (south coast, calmest).',
      thingsToDo: [
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
        'Hike to Chrysopigi monastery (taxi or walk)',
        'Slow-cooked chickpea revithada at a kafeneio',
      ],
      mooringTip:
        'Anchor on sand at 4-6 m in Vathi Bay (fully sheltered). Stern-to on the small quay if available, €15-25/night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vathi.webp', alt: 'Vathi' }],
    },
    {
      id: 'sifnos-kamares',
      routeFrom: 'Sifnos (Vathi)',
      routeTo: 'Kamares Harbor',
      day: 2,
      mapPin: {
        desktop: { left: 27.7, top: 52.3 },
        mobile: { left: 29.6, top: 47.6 },
      },
      description:
        '8 nm short hop north to Kamares — the larger Sifnos charter port on the west coast. Sheltered from N and NE but opens to W. Walk the cliff path to Chrysopigi monastery; eat mastelo (lamb in clay pots) at Artemonas in the inland village.',
      shortDescription:
        '8 nm short north hop to Kamares west coast. Sheltered from N/NE, opens W. Walk to Chrysopigi monastery; mastelo lamb at Artemonas. Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night).',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Swim Platys Gialos (south coast, sheltered)',
        'Sunset on the Kamares quay',
      ],
      mooringTip:
        'Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night). Switch to Vathi or Platys Gialos if wind clocks west.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kamares.webp', alt: 'Kamares' }],
    },
    {
      id: 'sifnos-syros',
      routeFrom: 'Sifnos',
      routeTo: 'Syros (Ermoupoli or Finikas)',
      day: 3,
      mapPin: {
        desktop: { left: 24.8, top: 53.1 },
        mobile: { left: 23, top: 50 },
      },
      description:
        '32 nm north-northeast to Syros — long beam reach in standard Meltemi. Ermoupoli town quay sits at the head of the deep harbour and is one of the most forgiving stern-to in the entire Cyclades. Finikas Bay on the southwest coast is the alternative for a sheltered swim anchorage.',
      shortDescription:
        '32 nm long beam reach NNE to Syros. Ermoupoli town quay is the most forgiving stern-to in the Cyclades. Finikas Bay south coast for swim anchorage.',
      thingsToDo: [
        'Climb Ano Syros for the Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim at Foinikas Bay (south coast)',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any direction. Manna marina €60-80/night if quay full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-tinos',
      routeFrom: 'Syros',
      routeTo: 'Tinos',
      day: 4,
      mapPin: {
        desktop: { left: 23.7, top: 48.6 },
        mobile: { left: 21.7, top: 43.9 },
      },
      description:
        '14 nm fast beam reach east-southeast to Tinos. The Syros-Tinos channel funnels the Meltemi — expect 5 knots extra. Tinos new harbour stern-to has moderate sand holding; the inner small craft harbour is the calmer alternative when Meltemi exceeds 25 knots.',
      shortDescription:
        '14 nm fast beam reach ESE to Tinos. Channel funnels the Meltemi — 5 kn extra. Be moored by 16:00; afternoon swell builds at the entrance.',
      thingsToDo: [
        'Marble-carving workshop visit in Pyrgos',
        'Walk the dovecote trail above Falatados',
        'Artichoke à la polita lunch in a courtyard',
        'Sunset at Volax granite-boulder field',
      ],
      mooringTip:
        'Stern-to in Tinos new harbour, €25-40/night. Holding moderate sand — set anchor with long scope. Inner craft harbour is calmer above 25 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tinos.webp', alt: 'Tinos' }],
    },
    {
      id: 'tinos-mykonos',
      routeFrom: 'Tinos',
      routeTo: 'Mykonos',
      day: 5,
      mapPin: {
        desktop: { left: 37.6, top: 17.1 },
        mobile: { left: 10.4, top: 26.4 },
      },
      description:
        'Short 8 nm leg east to Mykonos. The Tinos-Mykonos channel is reliably 5 knots stronger than the regional forecast. Pre-book a slot at Tourlos New Marina online 24 hours ahead in July-August. Day-anchor at Ornos or Psarou for an afternoon swim before mooring.',
      shortDescription:
        '8 nm short hop east to Mykonos. Tourlos New Marina is the safe overnight; town quay only works under 18 kn N. Pre-book Tourlos online 24h ahead.',
      thingsToDo: [
        'Day-trip across to ancient Delos',
        'Beach lunch at Agios Sostis (no road access)',
        'Walk the Little Venice waterfront at sunset',
        'Hike the Armenistis lighthouse loop',
      ],
      mooringTip:
        'Stern-to in Tourlos New Marina, €70-110/night peak. Pre-book online for July-August. Mykonos town quay only safe under 18 kn N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
    {
      id: 'mykonos-paros',
      routeFrom: 'Mykonos',
      routeTo: 'Paros',
      day: 6,
      mapPin: {
        desktop: { left: 47.9, top: 8.7 },
        mobile: { left: 49.4, top: 16.9 },
      },
      description:
        '22 nm fast downwind run southwest back to Paros. Quarter-reach the whole way in standard Meltemi — one of the most consistent downwind legs in the Cyclades summer. Naoussa on the north coast for the photogenic fishing-harbour overnight; Parikia for easier mooring.',
      shortDescription:
        '22 nm fast downwind SW back to Paros. Quarter-reach in Meltemi. Naoussa for the photogenic harbour or Parikia for easier mooring. Plastira Bay 0; 5 nm east on sand at 5-7 m; Parikia is the larger alternative.',
      thingsToDo: [
        'Snorkel the moon-rock outcrops at Kolymbithres',
        'Wine tasting at a Marpissa vineyard',
        'Octopus on the rope at a Naoussa pier taverna',
        'Walk Lefkes village marble paths at dusk',
      ],
      mooringTip:
        'Naoussa harbour stern-to, €30-50/night, often full by 17:00. Plastira Bay 0.5 nm east on sand at 5-7 m. Parikia is the larger alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Mykonos',
      routeTo: 'Paros (Check Out)',
      day: 7,
      mapPin: {
        desktop: { left: 57.7, top: 18.7 },
        mobile: { left: 58.3, top: 23.5 },
      },
      description:
        'Handover at Parikia or Naoussa before 09:00. Boat inspection — deposit released within 7 days. Crew transfer to Paros airport (PAS) is 15 minutes from Parikia. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Golden Beach (south coast).',
      shortDescription:
        'Handover before 09:00. Inspection, deposit release within 7 days. PAS airport 15 min from Parikia. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Golden Beach (south coast).',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Golden Beach (south coast)',
        'Breakfast on the Parikia portside',
        'Airport transfer (15 min to PAS)',
      ],
      mooringTip: 'Hand over at Parikia or Naoussa before 09:00. Deposit released within 7 days post-inspection.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros-town.webp', alt: 'Paros' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/paros/map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1293,
      height: 1173,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/paros/mobile-map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 780,
      height: 1090,
    },
  },
};

export default computeItineraryNumberOfDays(parosSyrosMykonosRoute);
