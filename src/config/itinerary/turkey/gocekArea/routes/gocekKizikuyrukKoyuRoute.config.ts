import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const gocekKizikuyrukKoyuRoute: ItineraryRoute = {
  metaTitle: '7-Day Göcek + Ekincik Yacht Charter Route | Turkish Riviera Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Göcek through Kapı Creek, Ekincik (Dalyan delta), Gemiler, Kızıkuyruk Koyu, Fethiye and Wall Bay — Turquoise Coast wide loop.',
  id: 'gocek-kizikuyruk-koyu',
  startingPoint: 'Göcek',
  otherPoints: ['Kizikuyruk Koyu'],
  cardImage: { src: '/images/itinerary/turkey/gocek-itinerary/routes/gocek-koyu.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/turkey/banners/oludeniz-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/yassica-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/gemiler-banner.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/sarsala-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'gocek-kapi-creek',
      routeFrom: 'Göcek',
      routeTo: 'Kapı Creek',
      day: 1,
      mapPin: {
        desktop: { left: 39.4, top: 32.1 },
        mobile: { left: 38.2, top: 39.3 },
      },
      description:
        '8 nm shake-down south from D-Marin Göcek to Kapı Creek via Yassıca Islands swim stop. The 12 Islands cluster (Skopea Limanı) has 12 named islets within a 6 nm radius — the most concentrated charter cruising ground on the Turquoise Coast. Restaurant-mooring system in Kapı Creek (free with dinner).',
      shortDescription:
        '8 nm shake-down S from D-Marin Göcek via Yassıca Islands swim. 12 Islands cluster (most concentrated cruising on Turquoise Coast). Kapı Creek restaurant moorings. Anchor on sand at 5-7 m as alternative. Plan to dive a natural rock arch at Kapı Creek and şakşuka fried-vegetable yogurt on deck.',
      thingsToDo: [
        'Anchor swim at Yassıca Islands neon fish',
        'Dive a natural rock arch at Kapı Creek',
        'Şakşuka fried-vegetable yogurt on deck',
        'Stargaze with creek-cliff frame',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Kapı Creek — pay for dinner, buoy included. Anchor on sand at 5-7 m as alternative. Fully sheltered.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/kapi.webp', alt: 'Kapı Creek' }],
    },
    {
      id: 'kapi-creek-ekincik',
      routeFrom: 'Kapı Creek',
      routeTo: 'Ekincik',
      day: 2,
      mapPin: {
        desktop: { left: 29.7, top: 40.7 },
        mobile: { left: 30.3, top: 46.5 },
      },
      description:
        '20 nm west to Ekincik — gateway to the Dalyan Delta (Köyceğiz Lake + Dalyan River, loggerhead-turtle nesting beach at İztuzu). 4th-c BC Lycian rock-cut tombs of Kaunos line the river-bank cliffs. Day-trip up the river by traditional gulet. Anchor in Ekincik Bay on sand at 5-7 m, sheltered from N. Restaurant moorings on the south side as alternative. Plan to day-trip up the Dalyan Delta by gulet, see 4th-c BC Kaunos Lycian rock tombs, walk loggerhead-turtle nesting İztuzu Beach.',
      shortDescription:
        '20 nm W to Ekincik — Dalyan Delta gateway, loggerhead-turtle İztuzu Beach. 4th-c BC Kaunos Lycian rock tombs on river cliffs. Day-trip up river by gulet.',
      thingsToDo: [
        'Day-trip up the Dalyan Delta by gulet',
        'See 4th-c BC Kaunos Lycian rock tombs',
        'Walk loggerhead-turtle nesting İztuzu Beach',
        'Soak in Sultaniye thermal mud baths',
      ],
      mooringTip:
        'Anchor in Ekincik Bay on sand at 5-7 m, sheltered from N. Restaurant moorings on the south side as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/ekincik.webp', alt: 'Ekincik' }],
    },
    {
      id: 'ekincik-gemiler',
      routeFrom: 'Ekincik',
      routeTo: 'Gemiler',
      day: 3,
      mapPin: {
        desktop: { left: 10.3, top: 24.2 },
        mobile: { left: 8, top: 33.2 },
      },
      description:
        '20 nm east-southeast back across to Gemiler Island (St Nicholas Island). Byzantine pilgrimage site, the original tomb of St Nicholas of Myra (relocated to Bari 1087 AD). Anchor in Coldwater Bay opposite — freshwater springs flowing into the sea drop the surface temperature suddenly.',
      shortDescription:
        '20 nm ESE back to Gemiler Island Byzantine pilgrimage (original St Nicholas tomb). Coldwater Bay opposite (freshwater springs drop surface temp). Free restaurant mooring buoy in Coldwater Bay — pay for dinner, buoy included; Anchor on sand at 5-7 m as alternative.',
      thingsToDo: [
        'Walk Gemiler Byzantine pilgrimage paths',
        'Snorkel for the freshwater-spring temperature drop',
        'Anchor swim in Coldwater Bay',
        'Nar ekşili pomegranate-glazed meze on deck',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Coldwater Bay — pay for dinner, buoy included. Anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/gemiler-island.webp', alt: 'Gemiler' }],
    },
    {
      id: 'gemiler-kizikuyruk-koyu',
      routeFrom: 'Gemiler',
      routeTo: 'Kızıkuyruk Koyu',
      day: 4,
      mapPin: {
        desktop: { left: 54.4, top: 60.6 },
        mobile: { left: 57.5, top: 71 },
      },
      description:
        '6 nm north to Kızıkuyruk Koyu — pebble-beach cove inside the 12 Islands cluster, pine-fringed, mountaintop overlook on the trail above. Sea caves at the south side for kayak. Anchor on sand 4-6 m, sheltered from N. Free anchoring on sand at 4-6 m, sheltered from N. Restaurant moorings on the south side as alternative. Plan to kayak the south-side sea caves, hike thyme-and-pine ridge for Blue Lagoon overlook, snorkel for sea-urchins and starfish.',
      shortDescription:
        '6 nm N to Kızıkuyruk Koyu — pebble cove in 12 Islands. Pine-fringed. Mountaintop trail overlook. Sea caves S side for kayak. Free anchoring on sand at 4-6 m, sheltered from N; Restaurant moorings on the south side as alternative.',
      thingsToDo: [
        'Kayak the south-side sea caves',
        'Hike thyme-and-pine ridge for Blue Lagoon overlook',
        'Snorkel for sea-urchins and starfish',
        'Grilled prawns with lemon-oregano on deck',
      ],
      mooringTip:
        'Free anchoring on sand at 4-6 m, sheltered from N. Restaurant moorings on the south side as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/gocek-koyu.webp', alt: 'Kızıkuyruk Koyu' }],
    },
    {
      id: 'kizikuyruk-koyu-fethiye',
      routeFrom: 'Kızıkuyruk Koyu',
      routeTo: 'Fethiye',
      day: 5,
      mapPin: {
        desktop: { left: 47.9, top: 52.2 },
        mobile: { left: 55.2, top: 57.5 },
      },
      description:
        '6 nm east to Marina di Fethiye ECE. Lycian 4th-c BC tomb of Amyntas (full Ionic temple façade carved into the cliff above the city) is the headline shore activity. Tuesday market spices + handcrafted rugs. Marina di Fethiye ECE stern-to with lazy lines, €70-110/night peak, fully sheltered. Plan to climb to the 4th-c BC tomb of Amyntas, tuesday market for handcrafted rugs, kabak çiçeği dolması stuffed zucchini flowers at a lokanta.',
      shortDescription:
        '6 nm E to Fethiye. Lycian 4th-c BC tomb of Amyntas (Ionic façade in cliff). Tuesday market spices + rugs. Marina di Fethiye ECE stern-to with lazy lines, €70-110/night peak, fully sheltered. Plan to kabak çiçeği dolması stuffed zucchini flowers at a lokanta and cold rakı toast on the seafront.',
      thingsToDo: [
        'Climb to the 4th-c BC tomb of Amyntas',
        'Tuesday market for handcrafted rugs',
        'Kabak çiçeği dolması stuffed zucchini flowers at a lokanta',
        'Cold rakı toast on the seafront',
      ],
      mooringTip: 'Marina di Fethiye ECE stern-to with lazy lines, €70-110/night peak, fully sheltered.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/fethiye.webp', alt: 'Fethiye' }],
    },
    {
      id: 'fethiye-wall-bay',
      routeFrom: 'Fethiye',
      routeTo: 'Wall Bay',
      day: 6,
      mapPin: {
        desktop: { left: 53.1, top: 44 },
        mobile: { left: 55.8, top: 46.1 },
      },
      description:
        '6 nm short south to Wall Bay (Hamam Bay) — limestone-cliff cove with snorkel-friendly underwater gorges, octopus + parrotfish habitat. Sand bottom 4-6 m, sheltered from N. Anchor in the bay; no marina here. Free anchoring in Wall Bay on sand at 4-6 m, sheltered from N. No marina; provision before arriving. Plan to snorkel the underwater gorges (octopus + parrotfish), paddle to hidden beach for olive-bread + labneh lunch, walk the limestone cliff trail.',
      shortDescription:
        '6 nm short S to Wall Bay — limestone-cliff cove, snorkel-friendly underwater gorges. Octopus + parrotfish habitat. Sand sheltered N. No marina. Free anchoring in Wall Bay on sand at 4-6 m, sheltered from N. Plan to paddle to hidden beach for olive-bread + labneh lunch and stargaze with cliff-shining frame.',
      thingsToDo: [
        'Snorkel the underwater gorges (octopus + parrotfish)',
        'Paddle to hidden beach for olive-bread + labneh lunch',
        'Walk the limestone cliff trail',
        'Stargaze with cliff-shining frame',
      ],
      mooringTip:
        'Free anchoring in Wall Bay on sand at 4-6 m, sheltered from N. No marina; provision before arriving.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/wall-bay.webp', alt: 'Wall Bay' }],
    },
    {
      id: 'wall-bay-gocek',
      routeFrom: 'Wall Bay',
      routeTo: 'Göcek',
      day: 7,
      mapPin: {
        desktop: { left: 40, top: 40 },
        mobile: { left: 46.2, top: 39.7 },
      },
      description:
        '8 nm west back to D-Marin Göcek via Tersane Island swim stop (Byzantine shipyard remains visible underwater in the shallows). Refuel at D-Marin before tying up. D-Marin Göcek stern-to with lazy lines, €100-160/night peak, fully sheltered. Plan to walk D-Marin promenade boutiques and turkish coffee at a bougainvillea café.',
      shortDescription:
        '8 nm W back to D-Marin Göcek via Tersane Island swim (Byzantine shipyard remains underwater). Refuel before mooring. D-Marin Göcek stern-to with lazy lines, €100-160/night peak, fully sheltered. Plan to walk D-Marin promenade boutiques and turkish coffee at a bougainvillea café.',
      thingsToDo: [
        'Snorkel the Tersane Byzantine shipyard underwater',
        'Walk D-Marin promenade boutiques',
        'Turkish coffee at a bougainvillea café',
        'Refuel and clean the boat at D-Marin Göcek',
      ],
      mooringTip:
        'D-Marin Göcek stern-to with lazy lines, €100-160/night peak, fully sheltered. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/gocek.webp', alt: 'Göcek' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/turkey/gocek-itinerary/map.webp',
        alt: 'Fethiye Route Image',
      },
      width: 1251,
      height: 1058,
    },
    mobile: {
      image: {
        src: '/images/itinerary/turkey/gocek-itinerary/mobile-map.webp',
        alt: 'Fethiye Route Image',
      },
      width: 842,
      height: 1094,
    },
  },
};

export default computeItineraryNumberOfDays(gocekKizikuyrukKoyuRoute);
