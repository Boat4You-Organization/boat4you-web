import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const zadarKornatiKrkaRoute: ItineraryRoute = {
  metaTitle: '7-Day Zadar–Kornati & Krka Yacht Charter Route | Croatia Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Zadar through Kornati National Park and Krka. Enjoy Telaščica, hidden bays, waterfalls & Adriatic island serenity.',
  id: 'zadar-kornati-krka-route',
  startingPoint: 'Zadar',
  otherPoints: ['Kornati', 'Krka'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/zadar-kornati-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/kornati-banner-large.webp', alt: 'Kornati' },
    {
      src: '/images/itinerary/croatia/banners/national-park-kornati-banner-large.webp',
      alt: 'National park Kornati',
    },
    {
      src: '/images/itinerary/croatia/banners/skradin-marina-banner.webp',
      alt: 'Skradin marina',
    },
    {
      src: '/images/itinerary/croatia/banners/primosten-marina-banner.webp',
      alt: 'Primosten marina',
    },
  ],
  routeDays: [
    {
      id: 'zadar-ugljan-bozava-bay-dugi-otok',
      routeFrom: 'Zadar',
      routeTo: 'Božava Bay (Dugi Otok)',
      day: 1,
      mapPin: {
        desktop: { left: 30.5, top: 33.9 },
        mobile: { left: 26.8, top: 34.4 },
      },
      description:
        'Begin in Zadar, where the Sea Organ’s haunting melodies bid you farewell. Sail past Ugljan, the “Green Island,” its slopes quilted with olive groves and fig trees. Anchor in Božava Bay, Dugi Otok’s hidden gem, where cliffs cradle a crescent of pebbles. Dive into water so clear it feels like flying, then feast on grilled orada at a beachside tavern as swallows pirouette above your mast.',
      shortDescription:
        "Steady 22 nm out of Zadar, threading past Ugljan and around Dugi Otok's northwest tip into Božava — the headline northern-shore village. Sakarun Bay (1 nm to the west) has the only Caribbean-style white-sand beach in the Zadar archipelago.",
      thingsToDo: [
        'Listen to the Zadar Sea Organ',
        'Swim sandy Sakarun Bay',
        'Tour Veli Rat lighthouse',
        'Grilled orada at the harbour',
      ],
      mooringTip:
        'Božava harbour quay is small — pre-book. Anchor in Sakarun Bay 1 nm west on sand at 4-6 m for an alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/bozava.webp', alt: 'Božava' }],
    },
    {
      id: 'bozava-telaščica-bay',
      routeFrom: 'Božava',
      routeTo: 'Telaščica Bay',
      day: 2,
      mapPin: {
        desktop: { left: 21.3, top: 34.7 },
        mobile: { left: 20.9, top: 36.7 },
      },
      description:
        'At dawn, sail south to Telaščica’s dramatic embrace—a nature park where cliffs plunge into indigo depths. Swim in Mir Lake’s saltwater lagoon, its warmth defying logic, then hike the clifftop trail to spot wild donkeys grazing among ancient olives. Dare to leap from Stene’s rocky ledge, your laughter echoing across the bay.',
      shortDescription:
        "Easy 14 nm leg south down Dugi Otok's outer shore into Telaščica Nature Park — 14 km of fjord-like inlet, the 161 m Stene cliffs, and the saltwater Mir Lake on the southern tip.",
      thingsToDo: [
        'Swim the saltwater Mir Lake',
        'Hike to Stene cliff lookout',
        'Spot the Telaščica wild donkeys',
        'Cliff jump (responsibly) into the bay',
      ],
      mooringTip: 'Park entry fee at the buoy. Pre-book moorings inside the park during July-August.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/telescica.webp', alt: 'Telascica' }],
    },
    {
      id: 'telaščica-bay-kornati-national-park-levrnaka-piskera',
      routeFrom: 'Telaščica Bay',
      routeTo: 'Kornati National Park (Levrnaka, Piškera)',
      day: 3,
      mapPin: {
        desktop: { left: 33.8, top: 48.3 },
        mobile: { left: 33.8, top: 48.3 },
      },
      description:
        'Enter Kornati’s lunar realm, where stone walls stitch 89 islands into a labyrinth of myth. Moor at Levrnaka’s Vrulje Bay, snorkeling over coral gardens in water bluer than a kingfisher’s wing. By dusk, anchor near Piškera’s abandoned fisherman’s huts and grill fresh bream under a sky ablaze with stars—the Milky Way your only witness.',
      shortDescription:
        'Short 8 nm leg into the heart of Kornati National Park — 89 islands, islets and reefs of bare karst, no permanent habitation. Levrnaka and Piškera have the headline restaurant moorings; the marine surface is subject to a daily Park entry fee.',
      thingsToDo: [
        'Snorkel coral gardens at Levrnaka',
        'Hike up Metlina lookout (237 m)',
        'See the Magazinova Škrila salt flats',
        'Grill fresh bream on the deck',
      ],
      mooringTip:
        'Pre-paid Park ticket on entry. Restaurant buoys at Levrnaka, Piškera, Vrulje — pay for dinner ashore and the buoy is included.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Kornati' }],
    },
    {
      id: 'kornati-zlarin',
      routeFrom: 'Kornati',
      routeTo: 'Zlarin',
      day: 4,
      mapPin: {
        desktop: { left: 50.3, top: 55 },
        mobile: { left: 53.3, top: 56.4 },
      },
      description:
        'Sail north to Zlarin, Croatia’s “Coral Island.” Drop anchor where generations of divers have hunted crimson treasure beneath the waves. Wander car-free paths past coral workshops, then sip loza rakija at a harborside bench, watching old men play briškula as the sun gilds Šibenik’s distant fortresses.',
      shortDescription:
        "Coastal sail south to Zlarin — Croatia's coral-diving island, car-free, with a single village around the harbour. Coral has been hand-harvested off Zlarin since the 15th century; the Centre for Coral Tradition tells the story.",
      thingsToDo: [
        'Tour the Coral Centre museum',
        'Walk car-free island paths',
        'Watch old men play briškula',
        'Loza rakija on the harbour bench',
      ],
      mooringTip:
        'Zlarin harbour quay is short-stay; pre-book ahead in summer. Anchor outside the bay on sand at 5-7 m.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zlarin.webp', alt: 'Zlarin' }],
    },
    {
      id: 'zlarin-skradin-krka-national-park',
      routeFrom: 'Zlarin',
      routeTo: 'Skradin (Krka National Park)',
      day: 5,
      mapPin: {
        desktop: { left: 52.5, top: 48.4 },
        mobile: { left: 49.9, top: 48.4 },
      },
      description:
        'Follow the Krka River inland, where waterfalls roar like ancient gods. Dock in Skradin, a town of stone arches and timeworn courtyards. Trade sails for a wooden boat to Skradinski Buk—swim beneath cascades that sculpt natural pools, then picnic on prosciutto and Pag cheese as dragonflies dart through rainbows in the mist.',
      shortDescription:
        'Inland river leg up the Krka through the lower Šibenik basin to Skradin — a small medieval town inside Krka National Park. Park ticket gets you a boat transfer up to Skradinski Buk waterfall complex.',
      thingsToDo: [
        'Boat transfer up to Skradinski Buk',
        'Walk the Skradin medieval lanes',
        'Cycle a Krka park trail',
        'Dalmatian prosciutto picnic',
      ],
      mooringTip: 'ACI Marina Skradin sits at the river mouth. Pre-book in July-August. Town quay is short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
    {
      id: 'skradin-vrgada',
      routeFrom: 'Skradin',
      routeTo: 'Vrgada',
      day: 6,
      mapPin: {
        desktop: { left: 39.9, top: 43.5 },
        mobile: { left: 40.5, top: 44.3 },
      },
      description:
        'Return to the coast, charting a course for Vrgada—an island forgotten by time. Anchor in a bay of powdered sand, where pine shadows stripe the sea. Hunt for sea glass on deserted beaches, then join villagers for brudet (fish stew) at a farmhouse table, the air thick with the scent of sage and salt.',
      shortDescription:
        'Easy 18 nm back down the river and along the coast to Vrgada — a tiny island near Pirovac, no cars, sandy bay, and a population that swells from 250 to 600 in August. Sandy bay is unusual for the central Dalmatian shore.',
      thingsToDo: [
        'Swim the sandy Lučica Bay',
        'Walk the no-car island paths',
        'Beachcomb for sea glass',
        'Brudet stew at the family konoba',
      ],
      mooringTip:
        'Restaurant moorings off Lučica Bay — free with dinner ashore. Free anchoring on sand at 4-6 m for a quieter night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vrgada.webp', alt: 'Vrgada' }],
    },
    {
      id: 'vrgada-zadar',
      routeFrom: 'Vrgada',
      routeTo: 'Zadar',
      day: 7,
      mapPin: {
        desktop: { left: 32.7, top: 32.3 },
        mobile: { left: 33.6, top: 38.3 },
      },
      description:
        'Sail homeward along the Zadar Archipelago, pausing to dive in the “Moon Craters” near Molat—submerged karst formations teeming with life. Return to Zadar as the Greeting to the Sun begins its neon dance beneath your feet. Toast your odyssey with Maraschino liqueur, the city’s Roman ruins glowing like embers in the twilight.',
      shortDescription:
        'Final 22 nm coastal leg north along the Pašman channel back into Zadar. Time the approach for the Greeting to the Sun light show at dusk on the Riva.',
      thingsToDo: [
        'Final swim off Pašman',
        'Walk the Roman Forum',
        'Watch the Greeting to the Sun show',
        'Maraschino tasting at Skoblar',
      ],
      mooringTip: 'Marina Zadar (Borik) is the standard charter berth. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zadar.webp', alt: 'Zadar' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Zadar Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Zadar Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(zadarKornatiKrkaRoute);
