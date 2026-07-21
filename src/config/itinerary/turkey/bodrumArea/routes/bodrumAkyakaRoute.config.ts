import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const bodrumAkyakaRoute: ItineraryRoute = {
  metaTitle: 'Bodrum–Akyaka Yacht Charter Route | Gökova Bay Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Bodrum via Mersincik, Kairos, Karaca, Akyaka, Ören and Çökertme — full Gulf of Gökova loop, deepest sheltered Aegean cruising.',
  id: 'bodrum-akyaka',
  startingPoint: 'Bodrum',
  otherPoints: ['Akyaka'],
  cardImage: { src: '/images/itinerary/turkey/bodrum-itinerary/routes/bodrum-akyaka.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/turkey/banners/bodrum-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/aegean-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/bodrum-banner.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/bodrum-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'bodrum-mersincik',
      routeFrom: 'Bodrum',
      routeTo: 'Mersincik',
      day: 1,
      mapPin: {
        desktop: { left: 27, top: 42.8 },
        mobile: { left: 32.6, top: 53.3 },
      },
      description:
        '15 nm shake-down south-southeast from Bodrum Marina to Mersincik — protected granite-rock-entrance bay on the south side of the Gulf of Gökova. Anchor on sand 4-6 m, fully sheltered. Sea cave at the head of the bay for kayak. provision before arriving. Plan to kayak into the sea cave at bay head and snorkel undersea grottoes.',
      shortDescription:
        '15 nm shake-down SSE from Bodrum to Mersincik — protected granite-entrance bay S side of Gökova. Sea cave at head for kayak. Sand anchorage fully sheltered.',
      thingsToDo: [
        'Kayak into the sea cave at bay head',
        'Snorkel undersea grottoes',
        'Hike wild-thyme ridge above bay',
        'Meze of grilled halloumi + creamy tarama on deck',
      ],
      mooringTip:
        'Free anchoring in Mersincik on sand at 4-6 m, fully sheltered. No marina; provision before arriving.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/mersincik.webp', alt: 'Mersincik' }],
    },
    {
      id: 'mersincik-kairos',
      routeFrom: 'Mersincik',
      routeTo: 'Kairos',
      day: 2,
      mapPin: {
        desktop: { left: 31.5, top: 70.9 },
        mobile: { left: 31.5, top: 70.9 },
      },
      description:
        '8 nm east to Kairos — small Gökova cove with Lycian outpost ruins, sun-warmed stones above the pebble beach. Sand-pebble bottom 4-6 m, sheltered from N. Restaurant moorings system (pay-for-dinner). Anchor on sand-pebble at 4-6 m as alternative. Plan to balık ekmek fish sandwich at a quay grill and listen for distant gull cries — total silence otherwise.',
      shortDescription:
        '8 nm E to Kairos. Small Gökova cove with Lycian outpost ruins above pebble beach. Restaurant moorings (pay-for-dinner). Sheltered N. Anchor on sand-pebble at 4-6 m as alternative. Plan to balık ekmek fish sandwich at a quay grill and listen for distant gull cries — total silence otherwise.',
      thingsToDo: [
        'Kayak the pebble beach to the cliff edge',
        'Hike to Lycian outpost ruins above',
        'Balık ekmek fish sandwich at a quay grill',
        'Listen for distant gull cries — total silence otherwise',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Kairos — pay for dinner, buoy included. Anchor on sand-pebble at 4-6 m as alternative. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/kairos.webp', alt: 'Kairos' }],
    },
    {
      id: 'kairos-karaca',
      routeFrom: 'Kairos',
      routeTo: 'Karaca',
      day: 3,
      mapPin: {
        desktop: { left: 44.5, top: 73.1 },
        mobile: { left: 50.9, top: 69.6 },
      },
      description:
        '12 nm east to Karaca — small fishing-village inlet on the south side of the Gulf, oleander-fringed pebble beach. Sand-pebble bottom 4-6 m, sheltered from N. Restaurant moorings (pay-for-dinner). Anchor in inlet on sand at 4-6 m as alternative. Plan to hike pine-and-thyme cliff trail and snorkel for damselfish in the rocky shoreline.',
      shortDescription:
        '12 nm E to Karaca — small fishing inlet S side of Gökova. Oleander pebble beach. Restaurant moorings (pay-for-dinner). Sheltered N. Anchor in inlet on sand at 4-6 m as alternative. Plan to hike pine-and-thyme cliff trail and snorkel for damselfish in the rocky shoreline.',
      thingsToDo: [
        'Hike pine-and-thyme cliff trail',
        'Snorkel for damselfish in the rocky shoreline',
        'Çay (tea) with fishermen on the quay',
        'Red mullet grilled with lemon and olive oil',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Karaca — pay for dinner, buoy included. Sheltered N. Anchor in inlet on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/karaca-island.webp', alt: 'Karaca' }],
    },
    {
      id: 'karaca-akyaka',
      routeFrom: 'Karaca',
      routeTo: 'Akyaka',
      day: 4,
      description:
        '8 nm east to Akyaka — bohemian Gulf-of-Gökova town, the Azmak River freshwater estuary opens here. Akyaka has Ottoman-era wood-balcony architecture preserved. Kayak the Azmak River for 2 km inland through the heron-and-otter wetland. Akyaka small marina stern-to, €60-90/night, sheltered from N. Anchor in the bay on sand at 4-6 m as alternative. Plan to kayak the Azmak River 2 km inland, walk Ottoman-era wood-balcony streets, manti Turkish dumplings with garlic-yogurt at a riverbank lokanta.',
      shortDescription:
        '8 nm E to Akyaka — Gökova bohemian town, Azmak River freshwater estuary. Ottoman wood-balcony architecture. Kayak the river 2 km inland (heron + otter).',
      thingsToDo: [
        'Kayak the Azmak River 2 km inland',
        'Walk Ottoman-era wood-balcony streets',
        'Manti Turkish dumplings with garlic-yogurt at a riverbank lokanta',
        'Hike pine forest to a hidden cove',
      ],
      mooringTip:
        'Akyaka small marina stern-to, €60-90/night, sheltered from N. Anchor in the bay on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/akyaka.webp', alt: 'Akyaka' }],
    },
    {
      id: 'akyaka-oren',
      routeFrom: 'Akyaka',
      routeTo: 'Ören',
      day: 5,
      mapPin: {
        desktop: { left: 86.4, top: 39.1 },
        mobile: { left: 81.4, top: 53.1 },
      },
      description:
        '12 nm north to Ören — laid-back Gökova south-shore village, olive farms above the beach, ancient Keramos archaeological site (4th-c BC, half-buried among wildflowers). Weekly market on the village square for spices and ceramics. Ören small marina stern-to, €40-60/night, sheltered from N. Anchor on sand at 4-6 m as alternative. Plan to walk the 4th-c BC Keramos ruins, beach lunch with frosty ayran under straw umbrella, browse the weekly Ören market.',
      shortDescription:
        '12 nm N to Ören — laid-back Gökova S-shore village, olive farms. 4th-c BC Keramos ruins half-buried in wildflowers. Weekly market spices + ceramics. Ören small marina stern-to, €40-60/night, sheltered from N; Anchor on sand at 4-6 m as alternative.',
      thingsToDo: [
        'Walk the 4th-c BC Keramos ruins',
        'Beach lunch with frosty ayran under straw umbrella',
        'Browse the weekly Ören market',
        'Mangal cumin-lamb barbecue on the beach',
      ],
      mooringTip: 'Ören small marina stern-to, €40-60/night, sheltered from N. Anchor on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/oren.webp', alt: 'Ören' }],
    },
    {
      id: 'oren-cokertme',
      routeFrom: 'Ören',
      routeTo: 'Çökertme',
      day: 6,
      mapPin: {
        desktop: { left: 64.6, top: 42.5 },
        mobile: { left: 62.9, top: 52.3 },
      },
      description:
        '15 nm west back to Çökertme — pine-clad horseshoe bay, family-run restaurant moorings. Bioluminescent water at night (microalgae bloom in late August). Live folk music at the quay tavernas. Anchor in bay on sand at 5-7 m as alternative. Plan to walk pine ridge above bay.',
      shortDescription:
        '15 nm W back to Çökertme — pine-clad horseshoe. Restaurant moorings (free with dinner). Bioluminescent water late Aug. Live folk music at quay. Anchor in bay on sand at 5-7 m as alternative; Sheltered N.',
      thingsToDo: [
        'Anchor swim — bioluminescent water at night (late Aug)',
        'Köfte meatballs on olivewood at a family taverna',
        'Live folk music at quay restaurant',
        'Walk pine ridge above bay',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Çökertme — pay for dinner, buoy included. Anchor in bay on sand at 5-7 m as alternative. Sheltered N.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/cokertme.webp', alt: 'Çökertme' }],
    },
    {
      id: 'cokertme-bodrum',
      routeFrom: 'Çökertme',
      routeTo: 'Bodrum',
      day: 7,
      mapPin: {
        desktop: { left: 43, top: 45.8 },
        mobile: { left: 49.2, top: 54.8 },
      },
      description:
        '15 nm west back to Bodrum Marina. Optional swim stop at Çökertme bioluminescent bay one last time. Refuel at Bodrum Marina before tying up. Castle of St Peter for last-day shore activity. Refuel at the entrance fuel berth. Plan to bazaar haggling for leather and saffron and sunset cocktails at a harbourside meyhane.',
      shortDescription:
        '15 nm W back to Bodrum Marina. Optional final Çökertme swim. Refuel at Bodrum. 15th-c Castle of St Peter for last shore activity. Refuel at the entrance fuel berth. Plan to bazaar haggling for leather and saffron and sunset cocktails at a harbourside meyhane.',
      thingsToDo: [
        'Visit the 15th-c Castle of St Peter Museum',
        'Bazaar haggling for leather and saffron',
        'Refuel and clean the boat at Bodrum Marina',
        'Sunset cocktails at a harbourside meyhane',
      ],
      mooringTip:
        'Bodrum Marina stern-to with lazy lines, €80-130/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/bodrum-town.webp', alt: 'Bodrum' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/turkey/bodrum-itinerary/map.webp',
        alt: 'Bodrum Route Image',
      },
      width: 1432,
      height: 1170,
    },
    mobile: {
      image: {
        src: '/images/itinerary/turkey/bodrum-itinerary/mobile-map.webp',
        alt: 'Bodrum Route Image',
      },
      width: 875,
      height: 1093,
    },
  },
};

export default computeItineraryNumberOfDays(bodrumAkyakaRoute);
