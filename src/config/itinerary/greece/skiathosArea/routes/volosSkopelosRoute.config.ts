import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const volosSkopelosRoute: ItineraryRoute = {
  metaTitle: '7-Day Volos–Skopelos Yacht Charter Route | Sporades Island Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Volos through Trikeri, Skiathos, Alonissos, Kyra Panagia and Skopelos. Pelion-side Sporades loop with Marine Park access.',
  id: 'volos-skopelos',
  startingPoint: 'Volos',
  otherPoints: ['Skopelos'],
  cardImage: {
    src: '/images/itinerary/greece/skiathos-itinerary/routes/volos-skopelos.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/volos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/alonissos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/alonissos-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/destinations/skopelos.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'volos-trikeri-island',
      routeFrom: 'Volos',
      routeTo: 'Trikeri Island',
      day: 1,
      mapPin: {
        desktop: { left: 6.6, top: 30.2 },
        mobile: { left: 12.4, top: 35.9 },
      },
      description:
        '20 nm shake-down south down the Pagasetic Gulf to Trikeri — small island at the gulf entrance, sheltered from any direction. The Pelion peninsula on starboard side dominates the leg with steep mountain cliffs falling into the sea. Anchor in Trikeri harbour on sand 4-6 m. Walk up to the Panagia Evangelistria Monastery (whitewashed, founded 1734, perched on the ridge above the village).',
      shortDescription:
        '20 nm shake-down south down the Pagasetic Gulf to Trikeri. Pelion mountain cliffs to starboard. Walk up to Panagia Evangelistria Monastery (1734). Free anchoring in Trikeri harbour on sand at 4-6 m, sheltered from any direction; Small village quay slots €15-25/night.',
      thingsToDo: [
        'Hike up to Panagia Evangelistria Monastery',
        'Snorkel the harbour rocky shoreline',
        'Saganaki shrimp at a quay taverna',
        'Walk the Trikeri village stone alleys',
      ],
      mooringTip:
        'Free anchoring in Trikeri harbour on sand at 4-6 m, sheltered from any direction. Small village quay slots €15-25/night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/trikeri.webp', alt: 'Trikeri' }],
    },
    {
      id: 'trikeri-island-koukounaries',
      routeFrom: 'Trikeri Island',
      routeTo: 'Koukounaries',
      day: 2,
      mapPin: {
        desktop: { left: 14.4, top: 53 },
        mobile: { left: 23.1, top: 49.5 },
      },
      description:
        '20 nm east to Skiathos. Anchor in Koukounaries Bay on the southwest coast — golden-sand beach backed by a pine forest, sand bottom 4-6 m, sheltered from N. Day-anchor for swim + walk the wetlands behind the beach for flamingo and heron sightings.',
      shortDescription:
        '20 nm east to Skiathos. Koukounaries Bay SW coast — golden-sand + pine forest, sand bottom, sheltered from N. Wetlands flamingos behind beach. Skiathos Marina town quay alternative for paid stern-to. Plan to paddle to Banana Beach (boat-only) and sunset cocktails at Achladies Beach Bar.',
      thingsToDo: [
        'Anchor swim at Koukounaries golden sand',
        'Walk Koukounaries wetlands flamingo trail',
        'Paddle to Banana Beach (boat-only)',
        'Sunset cocktails at Achladies Beach Bar',
      ],
      mooringTip:
        'Free anchoring in Koukounaries Bay on sand at 4-6 m, sheltered from N. Skiathos Marina town quay alternative for paid stern-to.',
      gallery: [{ src: '/images/itinerary/greece/destinations/koukounaries.webp', alt: 'Koukounaries' }],
    },
    {
      id: 'koukounaires-tzortzi-bay-alonissos',
      routeFrom: 'Koukounaires',
      routeTo: 'Tzortzi Bay (Alonissos)',
      day: 3,
      mapPin: {
        desktop: { left: 29.9, top: 50.9 },
        mobile: { left: 46.3, top: 47.3 },
      },
      description:
        '22 nm east to Alonissos. Tzortzi Bay on the west coast is a sheltered cove inside the Marine Park; sand bottom 5-7 m, sheltered from N and E. The Peristera shipwreck (5th-century BC merchant vessel, the largest known of antiquity) sits just outside the bay — accessible only with licensed dive operators.',
      shortDescription:
        '22 nm east to Alonissos. Tzortzi Bay west coast — sheltered cove inside Marine Park. Peristera 5th-c BC shipwreck just outside (licensed dive operators only).',
      thingsToDo: [
        'Anchor swim at Tzortzi Bay (sand bottom)',
        'Snorkel the rocky cove edges (Park rules — no spearfishing)',
        'Lobster astakomakaronada at a Patitiri taverna',
        'Walk Old Alonissos cliff village (car-free)',
      ],
      mooringTip:
        'Free anchoring in Tzortzi Bay on sand at 5-7 m, sheltered from N/E. Patitiri harbour stern-to is the paid alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alonissos.webp', alt: 'Alonissos' }],
    },
    {
      id: 'tzortzi-bay-kira-panagia',
      routeFrom: 'Tzortzi Bay',
      routeTo: 'Kira Panagia',
      day: 4,
      mapPin: {
        desktop: { left: 53.8, top: 48.6 },
        mobile: { left: 61.3, top: 48.4 },
      },
      description:
        '8 nm short hop north to Kyra Panagia — uninhabited island inside the Marine Park, no road, no village, no quay; anchorage only. Planitis Bay on the north coast (sand 5-7 m, sheltered from N) is the standard anchorage. The 12th-century Panagia Monastery is a 30-minute hike up from the bay.',
      shortDescription:
        '8 nm short hop north to Kyra Panagia — uninhabited Marine Park island. Planitis Bay anchorage; 12th-c monastery hike from bay. Free anchoring in Planitis Bay on sand at 5-7 m, sheltered from N. Plan to snorkel for monk-seal sightings and forage wild oregano on the slopes.',
      thingsToDo: [
        'Anchor swim at Planitis Bay (sand bottom)',
        'Hike to the 12th-c Panagia Monastery',
        'Snorkel for monk-seal sightings',
        'Forage wild oregano on the slopes',
      ],
      mooringTip:
        'Free anchoring in Planitis Bay on sand at 5-7 m, sheltered from N. No services on the island. Park rules: no spearfishing, no beach fires.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kyra.webp', alt: 'Kira Panagia' }],
    },
    {
      id: 'kira-panagia-skopelos',
      routeFrom: 'Kira Panagia',
      routeTo: 'Skopelos',
      day: 5,
      mapPin: {
        desktop: { left: 62.6, top: 34.2 },
        mobile: { left: 78.5, top: 34.9 },
      },
      description:
        '20 nm west to Skopelos — the "Green Queen" of the Sporades, pine-forest-clad slopes. Skopelos town harbour stern-to is the standard overnight, sheltered from N. Glossa on the northwest coast is the alternative — Loutraki port at the foot of the village. The Mamma Mia chapel (Agios Ioannis Kastri) on the east coast is the headline shore activity.',
      shortDescription:
        '20 nm west to Skopelos — "Green Queen" of Sporades, pine-forest slopes. Town harbour sheltered N; Loutraki/Glossa NW alternative. Mamma Mia chapel. Highlights: Walk to Mamma Mia Agios Ioannis Kastri chapel and Swim Kastani Beach (Mamma Mia setting).',
      thingsToDo: [
        'Walk to Mamma Mia Agios Ioannis Kastri chapel',
        'Swim Kastani Beach (Mamma Mia setting)',
        'Tasting plum wine at a hillside taverna',
        'Walk Glossa terracotta-roofed alleys',
      ],
      mooringTip:
        'Skopelos town harbour stern-to, €25-40/night, sheltered from N. Loutraki on Glossa side is the smaller alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/skopelos.webp', alt: 'Skopelos' }],
    },
    {
      id: 'skopelos-agia-kiriaki',
      routeFrom: 'Skopelos',
      routeTo: 'Agia Kiriaki',
      day: 6,
      mapPin: {
        desktop: { left: 45.7, top: 54.1 },
        mobile: { left: 55, top: 53.8 },
      },
      description:
        '15 nm southwest to Agia Kiriaki on the Pelion mainland — small fishing village, traditional shipyard still active, two tavernas at the quay. Pebble beach, sand bottom 4-6 m, sheltered from N. The Pelion peninsula slopes above the village are the most fragrant olive-grove country in mainland Greece.',
      shortDescription:
        '15 nm SW to Agia Kiriaki on Pelion mainland. Traditional shipyard, two tavernas. Sheltered cove. Pelion olive-grove slopes above village. Free anchoring on sand at 4-6 m, sheltered from N; Small village quay slots €15-20/night, lazy lines absent.',
      thingsToDo: [
        'Visit the working traditional Pelion shipyard',
        'Snorkel the rocky shoreline north of the cove',
        'Spanakopita and honey-yogurt at a quay taverna',
        'Walk olive-grove trail above the village',
      ],
      mooringTip:
        'Free anchoring on sand at 4-6 m, sheltered from N. Small village quay slots €15-20/night, lazy lines absent.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kiriaki.webp', alt: 'Kiriaki' }],
    },
    {
      id: 'agia-kiriaki-volos',
      routeFrom: 'Agia Kiriaki',
      routeTo: 'Volos',
      day: 7,
      mapPin: {
        desktop: { left: 39.5, top: 47.4 },
        mobile: { left: 54.6, top: 47.4 },
      },
      description:
        '15 nm north back to Volos. Optional swim stop at Agios Ioannis Beach (Pelion east coast, sand) on the way. Volos Marina is a large protected harbour at the head of the Pagasetic Gulf — well-sheltered, full services, fuel berth. Refuel before tying up.',
      shortDescription:
        '15 nm north back to Volos. Optional Agios Ioannis swim. Volos Marina is large/protected at head of Pagasetic Gulf. Refuel before mooring. Volos Marina stern-to with lazy lines, €40-60/night. Plan to grilled octopus and tsipouro at a Volos seafront ouzeri and walk the Volos waterfront promenade.',
      thingsToDo: [
        'Optional swim stop at Agios Ioannis Beach',
        'Refuel and clean the boat at Volos Marina',
        'Grilled octopus and tsipouro at a Volos seafront ouzeri',
        'Walk the Volos waterfront promenade',
      ],
      mooringTip:
        'Volos Marina stern-to with lazy lines, €40-60/night. Refuel at the entrance fuel berth before mooring. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/volos-town-island.webp', alt: 'Volos' }],
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

export default computeItineraryNumberOfDays(volosSkopelosRoute);
