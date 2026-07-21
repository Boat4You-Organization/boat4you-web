import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const skiathosRoute: ItineraryRoute = {
  metaTitle: '7-Day Skiathos Sporades Yacht Charter Route | Sporades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Skiathos via Skopelos, Skyros, Kyra Panagia, Alonissos and Koukounaries. Sporades National Marine Park loop with monk-seal sanctuary anchorages.',
  id: 'skiathos-route',
  startingPoint: 'Skiathos',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/greece/skiathos-itinerary/routes/sporades.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/skopelos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/skiathos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/skiathos-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/skiathos-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'skiathos-skopelos',
      routeFrom: 'Skiathos Marina',
      routeTo: 'Skopelos',
      day: 1,
      mapPin: {
        desktop: { left: 34.9, top: 50.2 },
        mobile: { left: 42.5, top: 47.7 },
      },
      description:
        '15 nm shake-down east to Skopelos. The Sporades sit in the northern Aegean — wind regime is the meltémi from N at 15-20 knots in summer, milder than the Cyclades. Skopelos town harbour stern-to is the standard overnight, sheltered from N. Stafylos Bay 4 nm south for swim before mooring; Mamma Mia chapel (Agios Ioannis Kastri) on the east coast accessible by road from Skopelos town.',
      shortDescription:
        '15 nm shake-down east to Skopelos. Sporades meltémi milder than Cyclades. Stafylos Bay swim before mooring; Mamma Mia chapel road-accessible from town. Skopelos town harbour stern-to, €25-40/night, sheltered from N. Plan to anchor swim at Stafylos Bay (4 nm south) and stuffed tomato yemista at Ouzeri Anatoli.',
      thingsToDo: [
        'Walk to the Mamma Mia Agios Ioannis Kastri chapel',
        'Anchor swim at Stafylos Bay (4 nm south)',
        'Stuffed tomato yemista at Ouzeri Anatoli',
        'Climb Skopelos Town stone alleys at sunset',
      ],
      mooringTip:
        'Skopelos town harbour stern-to, €25-40/night, sheltered from N. Loutraki on Glossa side is the smaller alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/skopelos.webp', alt: 'Skopelos' }],
    },
    {
      id: 'skopelos-skyros',
      routeFrom: 'Skopelos',
      routeTo: 'Skyros',
      day: 2,
      mapPin: {
        desktop: { left: 45.6, top: 53.4 },
        mobile: { left: 55.3, top: 49.8 },
      },
      description:
        '38 nm long beam-reach southeast to Skyros — largest of the Sporades, the southernmost. Linaria harbour on the southwest coast is the standard overnight, sheltered from N. Walk or taxi up to Chora on the cliff above the harbour; the Byzantine Castle of Skyros is the headline shore activity.',
      shortDescription:
        '38 nm long beam reach SE to Skyros — largest of the Sporades. Linaria harbour SW coast for overnight, sheltered N. Chora + Byzantine castle taxi above.',
      thingsToDo: [
        'Walk to the Byzantine Castle of Skyros',
        'Buy a hand-carved Skyrian wooden horse from a craftsman',
        'Goat stew at a Chora courtyard taverna',
        'Swim Pefkos Beach (south coast)',
      ],
      mooringTip:
        'Stern-to in Linaria harbour, €25-40/night, sheltered from N. Atsitsa Bay west coast is the alternative for sheltered anchorage.',
      gallery: [{ src: '/images/itinerary/greece/destinations/skyros.webp', alt: 'Skyros' }],
    },
    {
      id: 'skyros-kyra-panagia',
      routeFrom: 'Skyros',
      routeTo: 'Kyra Panagia',
      day: 3,
      mapPin: {
        desktop: { left: 54.7, top: 50.5 },
        mobile: { left: 64.2, top: 48.4 },
      },
      description:
        '32 nm northwest to Kyra Panagia — uninhabited island inside the Alonissos Marine Park. No road, no village, no quay; anchorage only. Planitis Bay on the north coast (sand 5-7 m, sheltered from N) is the standard anchorage. The 12th-century Panagia Monastery is a 30-minute hike up from the bay.',
      shortDescription:
        '32 nm NW to Kyra Panagia — uninhabited, inside Alonissos Marine Park. Anchorage only at Planitis Bay; 12th-c monastery hike from bay. Free anchoring in Planitis Bay on sand at 5-7 m, sheltered from N. Plan to snorkel for monk-seal sightings (Marine Park) and read on deck under the cicadas.',
      thingsToDo: [
        'Anchor swim at Planitis Bay (sand bottom)',
        'Hike to the 12th-c Panagia Monastery',
        'Snorkel for monk-seal sightings (Marine Park)',
        'Read on deck under the cicadas',
      ],
      mooringTip:
        'Free anchoring in Planitis Bay on sand at 5-7 m, sheltered from N. No services on the island. Park rules: no spearfishing, no beach fires.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kyra.webp', alt: 'Kira Panagia' }],
    },
    {
      id: 'kyra-panagia-alonissos',
      routeFrom: 'Kyra Panagia',
      routeTo: 'Alonissos',
      day: 4,
      mapPin: {
        desktop: { left: 62.5, top: 33.8 },
        mobile: { left: 73.8, top: 37.4 },
      },
      description:
        '15 nm south to Alonissos — eastern Sporades, the only inhabited island inside the Marine Park (the largest marine protected area in Europe). Patitiri harbour on the south coast is the standard charter overnight; Old Alonissos village on the cliff above is car-free, accessed by road or stone-stair hike.',
      shortDescription:
        '15 nm south to Alonissos — only inhabited island inside the Marine Park (largest in Europe). Patitiri harbour for overnight; Old Alonissos cliff village above.',
      thingsToDo: [
        'Walk Old Alonissos cliff village (car-free)',
        'Snorkel for the Peristera shipwreck (5th-c BC, dive operators only)',
        'Lobster pasta at Y Plex taverna',
        'Sign up for a Marine Park guided snorkel',
      ],
      mooringTip:
        'Stern-to in Patitiri harbour, €25-40/night, sheltered from N. Steni Vala on the east coast is the smaller alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alonissos.webp', alt: 'Alonissos' }],
    },
    {
      id: 'alonissos-koukounaries',
      routeFrom: 'Alonissos',
      routeTo: 'Koukounaries (Skiathos)',
      day: 5,
      mapPin: {
        desktop: { left: 83.8, top: 77.2 },
        mobile: { left: 96.1, top: 64.9 },
      },
      description:
        '20 nm west to Skiathos. Anchor in Koukounaries Bay on the southwest coast — golden-sand beach backed by a pine forest, one of the most photographed beaches in the Sporades. Sand bottom 4-6 m, sheltered from N. Walk the wetlands behind the beach for flamingo and heron sightings.',
      shortDescription:
        '20 nm west to Skiathos. Koukounaries Bay SW coast — golden-sand beach + pine forest, sheltered from N. Wetlands flamingos + herons. Skiathos Marina town quay is the alternative for paid stern-to. Plan to sunset cocktails at Achladies Beach Bar and live rembetika music at Bourtzi (Skiathos Town).',
      thingsToDo: [
        'Anchor swim at Koukounaries golden sand',
        'Walk Koukounaries wetlands flamingo trail',
        'Sunset cocktails at Achladies Beach Bar',
        'Live rembetika music at Bourtzi (Skiathos Town)',
      ],
      mooringTip:
        'Free anchoring in Koukounaries Bay on sand at 4-6 m, sheltered from N. Skiathos Marina town quay is the alternative for paid stern-to.',
      gallery: [{ src: '/images/itinerary/greece/destinations/koukounaries.webp', alt: 'Koukounaries' }],
    },
    {
      id: 'koukounaries-skiathos',
      routeFrom: 'Koukounaries',
      routeTo: 'Skiathos Marina',
      day: 6,
      mapPin: {
        desktop: { left: 30.1, top: 50 },
        mobile: { left: 37.4, top: 50.3 },
      },
      description:
        '8 nm short hop east back to Skiathos Marina. Optional Lalaria Beach swim stop on the north coast — white-pebble cove framed by chalk cliffs, boat-only access. Skiathos town quay stern-to for handover-prep evening; the Bourtzi Peninsula is the small Venetian fort at the harbour entrance.',
      shortDescription:
        '8 nm short hop east back to Skiathos Marina. Optional Lalaria Beach swim stop (white-pebble, chalk-cliffs, boat-only). Bourtzi fort at harbour entrance. Refuel at the entrance fuel berth before mooring; Confirm handover slot 24h ahead.',
      thingsToDo: [
        'Swim stop at Lalaria Beach (boat-only access)',
        'Walk Bourtzi Peninsula Venetian fort',
        'Grilled octopus at Taverna Alektor',
        'Refuel and clean the boat at Skiathos Marina',
      ],
      mooringTip:
        'Skiathos Marina stern-to with lazy lines, €40-60/night. Refuel at the entrance fuel berth before mooring. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/skiathos-marina.webp', alt: 'Skiathos' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Skiathos',
      routeTo: 'Check-out',
      day: 7,
      description:
        'Handover at Skiathos Marina before 09:00. Inspection — deposit released within 7 days. Skiathos airport (JSI) is 5 minutes by road from the marina. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last spanakopita at Skiathos Bakery.',
      shortDescription:
        'Handover before 09:00 at Skiathos Marina. Inspection, deposit release within 7 days. JSI airport 5 min by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last spanakopita at Skiathos Bakery.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last spanakopita at Skiathos Bakery',
        'Coffee at a Skiathos town café',
        'Airport transfer (5 min from marina)',
      ],
      mooringTip: 'Hand over at Skiathos Marina before 09:00. Deposit released within 7 days post-inspection.',
      gallery: [{ src: '/images/itinerary/greece/destinations/skiathos-town-island.webp', alt: 'Skiathos' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/skiathos-itinerary/map.webp',
        alt: 'Skiathos Route Image',
      },
      width: 1577,
      height: 1105,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/skiathos-itinerary/mobile-map.webp',
        alt: 'Skiathos Route Image',
      },
      width: 980,
      height: 1130,
    },
  },
};

export default computeItineraryNumberOfDays(skiathosRoute);
