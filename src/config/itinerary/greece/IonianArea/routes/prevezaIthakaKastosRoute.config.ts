import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const prevezaIthakaKastosRoute: ItineraryRoute = {
  metaTitle: 'Preveza–Ithaka–Kastos Yacht Charter Route | Ionian Sailing',
  metaDesc:
    'Sail a yacht charter from Preveza to Ithaka & Kastos. Explore Meganisi’s secret coves, Odysseus’ Ithaka, stone-quiet Kastos & timeless Ionian charm.',
  id: 'preveza-ithaka-kastos',
  startingPoint: 'Preveza',
  otherPoints: ['Ithaka', 'Kastos'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/preveza-ithaka-kastos.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/kefalonia-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/preveza-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/preveza-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/ithaka-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'preveza-meganisi',
      routeFrom: 'Preveza',
      routeTo: 'Meganisi',
      day: 1,
      mapPin: {
        desktop: { left: 70.5, top: 38.3 },
        mobile: { left: 73.8, top: 38.7 },
      },
      description:
        'Start your journey at Preveza, where the limitless blue Ionian Sea welcomes you. Arriving in Meganisi, an island of olive orchards and secret coves, sail across the Lefkada Canal, its waters glittering like liquid turquoise. Anchor in Spartochori, where whitewashed homes hang on rocks above a slumbering port. Explore the crystalline bay, then savor bourdeto (spicy fish stew) at a taverna illuminated by lanterns, the stars reflecting like diamonds on the sea.',
      shortDescription:
        'Long 18 nm leg out of Preveza Marina south through the Lefkada canal and into Meganisi — the most popular first-day Ionian anchorage. Spartochori sits high on the western cliffs; Vathi and Porto Atheni are the two main bays opposite.',
      thingsToDo: [
        'Pass through Lefkada canal',
        'Visit the Papanikolis WWII sub cave',
        'Snorkel sheltered Atheni Bay',
        'Bourdeto stew at a Spartochori taverna',
      ],
      mooringTip:
        'Vathi small marina or Porto Atheni stern-to. Restaurant moorings in many smaller bays — pay for dinner, buoy is included.',
      gallery: [{ src: '/images/itinerary/greece/destinations/meganisi.webp', alt: 'Meganisi' }],
    },
    {
      id: 'meganisi-ithaka',
      routeFrom: 'Meganisi',
      routeTo: 'Ithaka',
      day: 2,
      mapPin: {
        desktop: { left: 71.4, top: 52.9 },
        mobile: { left: 74.2, top: 52.9 },
      },
      description:
        "Glide east toward Odysseus's fabled kingdom, Ithaka. Fish boats bob next to cypress trees at Vathy, a horseshoe-shaped bay. Legend has Odysseus hiding his wealth at the Cave of the Nymphs; then swim in the crystal shallows of Dexa Bay. At a seafront taverna, eat sofrito (garlicky veal), and smell jasmine mixing with sea breeze.",
      shortDescription:
        'Easy 12 nm leg southeast to Ithaka — the legendary kingdom of Odysseus, with the headline horseshoe harbour of Vathy and the cliff-top village of Anogi.',
      thingsToDo: [
        'Visit the Cave of the Nymphs',
        'Hike to the School of Homer ruins',
        'Swim aquamarine Dexa Bay',
        'Sofrito veal at a seafront taverna',
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
        desktop: { left: 68.2, top: 62.7 },
        mobile: { left: 70.1, top: 62.1 },
      },
      description:
        'Sail south to the island of natural beauty known as Kefalonia Anchor under Asos, a Venetian fortress capped pastel village. Drink Robola wine in a vineyard with view of the sea, or explore Myrtos Beach, with its blue waves bordered by limestone cliffs. Join residents in Argostoli for kreatopita (savory pie) and stories of earthquake and resiliency as evening falls.',
      shortDescription:
        "Easy 14 nm coastal sail to Argostoli on the southwest shore of Kefalonia — the island's main town, sheltered behind the long Lassi peninsula. The Robola wine cooperative inland is a worthwhile day trip; the famous Myrtos Beach is 30 minutes by car north.",
      thingsToDo: [
        'Walk Argostoli waterfront Riva',
        'Day-trip to Myrtos beach overlook',
        'Robola wine cooperative tasting',
        'Kreatopita pie at a quayside taverna',
      ],
      mooringTip: 'Argostoli town quay stern-to. Anchor in Fanari Bay outside the harbour for a quieter night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia.webp', alt: 'Kefalonia' }],
    },
    {
      id: 'kefalonia-kastos',
      routeFrom: 'Kefalonia',
      routeTo: 'Kastos',
      day: 4,
      mapPin: {
        desktop: { left: 68.5, top: 73.1 },
        mobile: { left: 72.5, top: 74.4 },
      },
      description:
        'Get away to Kastos, a small island with time stopped. In Vathy Bay, where the only noises are lapping waves and goat bells, drop anchors. Share a magirefta (homemade stew) with locals in their sunlit taverna, kayak to sea caves, climb to abandoned windmills. Let the simplicity of life here to sweep over you like the tide.',
      shortDescription:
        'Long 22 nm leg back northeast across the inner Ionian to Kastos — a long thin island east of Ithaka, population under 50, one of the quietest charter destinations in Greece.',
      thingsToDo: [
        'Snorkel the Blue Cave shore',
        'Walk the Kastos donkey paths',
        'See the abandoned hilltop windmill',
        'Magirefta stew at a kafeneio',
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
        desktop: { left: 77.7, top: 57.3 },
        mobile: { left: 80.5, top: 57.9 },
      },
      description:
        'Drift to Kalamos, a tough paradise of stone ruins and pine woodlands. Snorkel in the unspoiled waters of Agrapidias Beach and explore Port Leone, a spooky harbor of crumbling homes. Climb to the historic hilltop town of Kastro and let the Ionian panoramic vistas to take your breath. Dine under a fig tree grilled sardines; the taste of lemon and salt will remain on your lips.',
      shortDescription:
        "Short hop east to Kalamos — slightly bigger than Kastos, mountainous and pine-clad, with two villages (Episkopi and Port Kalamos) and one of the Ionian's most striking abandoned settlements at Port Leone.",
      thingsToDo: [
        'Hike to the Port Leone ghost village',
        'Snorkel Agrapidias clear shore',
        'Climb up to Episkopi village',
        'Grilled sardines at a fig-shaded taverna',
      ],
      mooringTip: 'Port Kalamos town quay stern-to. Anchor in Asprogiali Bay on sand at 5-7 m for a quieter night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kalamos.webp', alt: 'Kalamos' }],
    },
    {
      id: 'kalamos-preveza',
      routeFrom: 'Kalamos',
      routeTo: 'Preveza',
      day: 6,
      mapPin: {
        desktop: { left: 79.1, top: 53 },
        mobile: { left: 84.7, top: 50.4 },
      },
      description:
        'Go back to Preveza, stopping at Mytikas Beach to swim a last lap where green seas meet golden sand. At a marina taverna, dock at twilight and greet your voyage with moussaka and ouzo; the air alive with cicadas and sailor laughter.',
      shortDescription:
        'Long 25 nm coastal sail back to Preveza through the Lefkada canal. Optional Mytikas Bay swim stop on the mainland coast — soft golden-sand shore, rare for the Ionian.',
      thingsToDo: [
        'Optional Mytikas sandy-bay swim',
        'Cross the Lefkada canal again',
        'Walk Preveza marina Riva',
        'Moussaka dinner at the marina',
      ],
      mooringTip: 'Preveza Cleopatra Marina is the standard charter base. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/preveza.webp', alt: 'Preveza' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Preveza',
      routeTo: 'Check-Out',
      day: 7,
      description:
        "Say goodbye with a slow walk throughout Preveza's Old Town, whose cobblestone streets and Venetian arches speak of bygone years. Sip one last Greek coffee; honey softens its bitterness; carry the Ionian gifts—sun-kissed skin, salt in your hair, and a heart full of vistas home with you.",
      shortDescription:
        "Final morning at Preveza's Cleopatra Marina. Optional walk through Preveza Old Town: Venetian arches, cobblestone lanes, last Greek coffee. Cleopatra Marina handover — confirm fuel slot and clean-time the evening before. Plan to walk Preveza Old Town and visit the ancient Nikopolis ruins.",
      thingsToDo: [
        'Greek coffee at a Venetian-arch café',
        'Walk Preveza Old Town',
        'Visit the ancient Nikopolis ruins',
        'Pack-and-clean for handover',
      ],
      mooringTip: 'Cleopatra Marina handover — confirm fuel slot and clean-time the evening before.',
      gallery: [{ src: '/images/itinerary/greece/destinations/preveza.webp', alt: 'Check out' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Preveza Ithaka Kastos Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Preveza Ithaka Kastos Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(prevezaIthakaKastosRoute);
