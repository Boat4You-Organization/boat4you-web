import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lefkasIthakaKastosRoute: ItineraryRoute = {
  metaTitle: 'Lefkas–Ithaka–Kastos Yacht Charter Route | Ionian Sailin',
  metaDesc:
    'Sail a yacht charter from Lefkas through Ithaka to Kastos. Explore Odysseus’ island lore, serene bays, historic harbors, and the unspoiled charm of the Ionian.',
  id: 'lefkas-ithaka-kastos',
  startingPoint: 'Lefkas',
  otherPoints: ['Ithaka', 'Kastos'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/lefkas-ithaka-kastos.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/kefalonia-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/lefkas-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/lefkas-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/ithaka-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'lefkas-meganisi',
      routeFrom: 'Lefkas (D-Marin)',
      routeTo: 'Meganisi',
      day: 1,
      mapPin: {
        desktop: { left: 68.5, top: 44.4 },
        mobile: { left: 69.9, top: 45.1 },
      },
      description:
        "From Lefkas's busy D-Marin, fly across the blue embrace of the Ionian Sea. Meganisi is like a secret gem, its rocky coast lined with little bays. Drop anchor at Spartochori, where pastel homes stick to cliffs above the port. Discover the fabled Papanikolis Cave by boat; formerly housed WWII submarines, its echoing chambers Feast on grilled octopus at a waterfront taverna as evening colors the sky; the waves will be singing your first night under the stars.",
      shortDescription:
        'Easy 6 nm shake-down hop out of D-Marin Lefkas south to Meganisi — the most popular first-day Ionian anchorage. Spartochori sits high on the western cliffs; Vathi and Porto Atheni are the two main bays opposite.',
      thingsToDo: [
        'Visit the Papanikolis WWII sub cave',
        'Climb to Spartochori cliff village',
        'Snorkel sheltered Atheni Bay',
        'Grilled octopus at Niagas Taverna',
      ],
      mooringTip:
        'Vathi small marina or Porto Atheni stern-to. Restaurant moorings in many of the smaller bays — pay for dinner, buoy is included.',
      gallery: [{ src: '/images/itinerary/greece/destinations/meganisi.webp', alt: 'Meganisi' }],
    },
    {
      id: 'meganisi-ithaka',
      routeFrom: 'Meganisi',
      routeTo: 'Ithaka',
      day: 2,
      mapPin: {
        desktop: { left: 77.3, top: 52.5 },
        mobile: { left: 85, top: 54 },
      },
      description:
        "Track the echoes of Odysseus toward Ithaka, the legendary hero's realm. Dock in Vathy, a horseshoe harbor encircled in terracotta houses and cypress trees. Swim in the sparkling waves of Dexa Bay or hike to the School of Homer, where ancient ruins lie above olive farms. By dusk, sip local Robola wine in a taverna courtyard; the air smelled strongly of jasmine and stories of homecoming.",
      shortDescription:
        'Twenty nautical miles southeast to Ithaka — the legendary kingdom of Odysseus, with the headline horseshoe harbour of Vathy and the cliff-top village of Anogi. The Cave of the Nymphs (where Odysseus hid his treasure on returning home) sits above Dexa Bay.',
      thingsToDo: [
        'Visit the Cave of the Nymphs',
        'Hike to the School of Homer ruins',
        'Swim aquamarine Dexa Bay',
        'Robola wine in a Vathy courtyard',
      ],
      mooringTip:
        'Vathy town quay stern-to with own anchor — first-come. Kioni and Frikes (north Ithaka) as quieter alternatives.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ithaka.webp', alt: 'Ithaka' }],
    },
    {
      id: 'ithaka-kefalonia',
      routeFrom: 'Ithaka',
      routeTo: 'Kefalonia',
      day: 3,
      mapPin: {
        desktop: { left: 67.7, top: 62.2 },
        mobile: { left: 71.7, top: 62.6 },
      },
      description:
        'Sail south to Kefalonia, where cobalt waters and drama plays out on cliffs. Explore the famous crescent of Myrtos Beach, its marble pebbles shining in the sun. Wander Assos, a pastel village defended by a Venetian castle, or explore Melissani Cave, where sunshine pours down the subterranean lake like liquid gold. Feast on kreatopita, meat pie, in Fiskardo, whose harbour is alive with yachts and neoclassical appeal.',
      shortDescription:
        'Coastal sail to Fiskardo on the northern tip of Kefalonia — the only village to survive the 1953 earthquake intact. Pastel-painted neoclassical waterfront, dense yacht harbour, and the headline Myrtos and Assos beaches an hour drive south.',
      thingsToDo: [
        'Walk the pastel Fiskardo Riva',
        'Day-trip to Myrtos beach overlook',
        'Visit Melissani underground lake',
        'Kreatopita meat pie at a quayside taverna',
      ],
      mooringTip:
        'Fiskardo town quay stern-to is small — arrive early. Anchor in Foki Bay 1 nm south for a quieter alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia.webp', alt: 'Kefalonia' }],
    },
    {
      id: 'kefalonia-kastos',
      routeFrom: 'Kefalonia',
      routeTo: 'Kastos',
      day: 4,
      mapPin: {
        desktop: { left: 63.3, top: 60.5 },
        mobile: { left: 64, top: 60.9 },
      },
      description:
        "Get away to Kastos, an island lost in time. Anchor at the single harbor, where fishing boats bob next to a lazy promenade. Snorkel the Blue Cave's glittering depths or hike the donkey paths to Kastos Village, their stone cottages sheltered by fig trees. Lunch is scheduled. Simple perfection: tomato-drenched briam (grilled vegetables) in a family-owned kafeneio, the sea breeze your lone friend.",
      shortDescription:
        'Easy coastal sail east back across the inner Ionian to Kastos — a long thin island east of Ithaka, population under 50, single village around the small harbour. One of the quietest charter destinations in Greece.',
      thingsToDo: [
        'Snorkel the Blue Cave shore',
        'Walk the Kastos donkey paths',
        'See the abandoned hilltop windmill',
        'Briam vegetable stew at a kafeneio',
      ],
      mooringTip: 'Kastos harbour town quay or restaurant moorings off the village — pay for dinner ashore.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kastos.webp', alt: 'Kastos' }],
    },
    {
      id: 'kastos-kalamos',
      routeFrom: 'Kastos',
      routeTo: 'Kalamos',
      day: 5,
      mapPin: {
        desktop: { left: 76.3, top: 56.9 },
        mobile: { left: 81.9, top: 61.7 },
      },
      description:
        'Go west to Kalamos, where isolated bays are lined with pine trees. Hike to the Abandoned Village, where crumbling stone walls tell of past life, or swim at Asprogiali Beach, its pebbles polished to moonstone smoothness. Join residents of Port Kalamos for savoro fish—fried crisp with rosemary and vinegar—at sunset as the sky becomes apricot and rose.',
      shortDescription:
        "Short hop east to Kalamos — slightly bigger than Kastos but still authentic, mountainous and pine-clad, with two villages (Episkopi and Port Kalamos) and one of the Ionian's most striking abandoned settlements at Port Leone.",
      thingsToDo: [
        'Hike to the Port Leone ghost village',
        'Swim moonstone-pebble Asprogiali Beach',
        'Climb up to Episkopi village',
        'Savoro vinegar-fried fish at the harbour',
      ],
      mooringTip: 'Port Kalamos town quay stern-to. Anchor in Asprogiali Bay on sand at 5-7 m for a quieter night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kalamos.webp', alt: 'Kalamos' }],
    },
    {
      id: 'kalamos-lefkas',
      routeFrom: 'Kalamos',
      routeTo: 'Lefkas (D-Marin)',
      day: 6,
      description:
        'Go back to Lefkas sailing slowly down the lush shoreline of the mainland. Stop for a last plunge at Egremni Beach (if accessible; its waters are strange; its cliffs are sheer). At a marina-side taverna in D-Marin, toast your journey with ouzo and saganaki; the rigging of ships clinking like wind chimes in the twilight.',
      shortDescription:
        "Long 22 nm coastal sail back along the mainland coast to D-Marin Lefkas. Optional Egremni or Porto Katsiki swim stop on Lefkas's southwest shore — the headline white-cliff beaches of the western Ionian.",
      thingsToDo: [
        'Optional Porto Katsiki cliff-beach stop',
        'Final passage with the afternoon thermal',
        'Browse Lefkas market for embroidery',
        'Ouzo and saganaki at a marina taverna',
      ],
      mooringTip: 'D-Marin Lefkas — full-service charter base. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Lefkas',
      routeTo: 'Check-out',
      day: 7,
      description:
        "Savour one last Ionian morning in Lefkas Town with a strong Greek coffee accompanied by honey-drenched loukoumades, or doughnuts. Search the cobblestone market for leather sandals, then stroll the lagoon's floating bridges. Disembark with salt-streaked hair, a heart full of fabled waters, and a pledge to return—because the Ionian never really lets you go.",
      shortDescription:
        "Final morning at D-Marin Lefkas. Optional walk through Lefkas Town's covered market and the lagoon floating bridges. D-Marin Lefkas handover — confirm fuel slot and clean-time the evening before. Plan to greek coffee with loukoumades and browse the leather-sandal market.",
      thingsToDo: [
        'Greek coffee with loukoumades',
        'Walk the lagoon floating bridges',
        'Browse the leather-sandal market',
        'Pack-and-clean for handover',
      ],
      mooringTip: 'D-Marin Lefkas handover — confirm fuel slot and clean-time the evening before.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Lefkas Ithaka Kastos Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Lefkas Ithaka Kastos Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(lefkasIthakaKastosRoute);
