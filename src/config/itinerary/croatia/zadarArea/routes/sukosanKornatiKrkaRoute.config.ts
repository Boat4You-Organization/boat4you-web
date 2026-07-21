import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sukosanKornatiKrkaRoute: ItineraryRoute = {
  metaTitle: '7-Day Sukosan–Kornati & Krka Yacht Charter Route | Croatia Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Sukosan through Kornati Islands and Krka National Park. Explore Telaščica, hidden bays, waterfalls & Adriatic island serenity.',
  id: 'sukosan-kornati-krka-route',
  startingPoint: 'Sukošan',
  otherPoints: ['Kornati', 'Krka'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/sukosan-kornati-card-image.webp',
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
      id: 'sukosan-ugljan-bozava-bay-dugi-otok',
      routeFrom: 'Sukosan',
      routeTo: 'Božava Bay (Dugi Otok)',
      day: 1,
      mapPin: {
        desktop: { left: 21.1, top: 30.5 },
        mobile: { left: 21.1, top: 30.5 },
      },
      description:
        'Starting at Sukosan\'s slumbering port, fishing boats swing like old friends sharing secrets. Sail by Ugljan, the "Green Island," its sloping olive groves and fig tree covered ground. Arriving in Božava Bay, the hidden gem of Dugi Otok, find crescent of pebbles and emerald reflections created by trees cradling cliffs. After diving into water so pure it feels like swimming in liquid sky, savor lignje na gradele ( barbecued squid) at a seashore taverna, the air scented with Dalmatian sage and the promise of adventure.',
      shortDescription:
        "Long 25 nm out of Sukošan, threading past Ugljan and around Dugi Otok's northwest tip into Božava — the headline northern-shore village. Sakarun Bay (1 nm to the west) has the only Caribbean-style white-sand beach in the Zadar archipelago.",
      thingsToDo: [
        "Exit Marina Dalmacija (Croatia's largest)",
        'Swim sandy Sakarun Bay',
        'Tour Veli Rat lighthouse',
        'Grilled squid at the harbour',
      ],
      mooringTip:
        'Božava harbour quay is small — pre-book. Anchor in Sakarun Bay 1 nm west on sand at 4-6 m for an alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/bozava.webp', alt: 'Božava' }],
    },
    {
      id: 'bozava-bay-telaščica-bay',
      routeFrom: 'Božava',
      routeTo: 'Telaščica Bay',
      day: 2,
      mapPin: {
        desktop: { left: 29.6, top: 44.6 },
        mobile: { left: 29.6, top: 44.6 },
      },
      description:
        "Sail south to Telaščica's wild theater at dawn—cliffs falling 100 meters into indigo depths, their edges under constant swooping falcons. Swim in the salty lagoon of Mir Lake, its warmth defying logic, then climb clifftop paths where wild donkeys graze beneath old olive trees. Leap from Stene's stony brink, and let your joy resound across the sea as the sun melts into a horizon of molten gold.",
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
        desktop: { left: 35.5, top: 48.4 },
        mobile: { left: 35.5, top: 48.4 },
      },
      description:
        "Now enter the stone maze of Kornati, where 89 islands whisper stories of fisherman and lost civilizations. Snorkelling over coral gardens glistening like buried treasure at Levrnaka's Vrulje Bay By evening, anchor close to Piškera's abandoned fishing camps grills fresh-caught bream under a star-filled sky. Your compass is the Milky Way, the rhythm of the water your lullaby.",
      shortDescription:
        'Short 8 nm leg into the heart of Kornati National Park — 89 islands, islets and reefs of bare karst, no permanent habitation. Levrnaka and Piškera have the headline restaurant moorings; the marine surface is subject to a daily Park entry fee.',
      thingsToDo: [
        'Snorkel coral gardens at Levrnaka',
        'Hike up Metlina lookout (237 m)',
        'See the dry-stone walls of Kornat',
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
        desktop: { left: 49, top: 53.1 },
        mobile: { left: 49, top: 53.1 },
      },
      description:
        'Sail north to Zlarin, the "Coral Island," where red riches lie under blue waves. Wander past workshops creating coral jewelry car-free lanes, then sip loza rakija from a harborside bench. As ancient men play briškula, their cards striking the table like a challenge to time itself, see Šibenik\'s stronghold light amber in the distance.',
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
        desktop: { left: 52.8, top: 47.8 },
        mobile: { left: 52.8, top: 47.8 },
      },
      description:
        "Track the Krka River inland, where waterfalls scream like dragons defending Eden. Dock in Skradin, a town with stone arches and figs blooming with summer's delicacy. Glide by boat to Skradinski Buk, plunging into natural pools below cascades creating misted rainbow patterns. Picnic on sun-warmed tomatoes and Pag cheese, dragonflies flying like jeweled messengers.",
      shortDescription:
        'Inland river leg up the Krka through the lower Šibenik basin to Skradin — a small medieval town inside Krka National Park. Park ticket gets you a boat transfer up to Skradinski Buk waterfall complex.',
      thingsToDo: [
        'Boat transfer up to Skradinski Buk',
        'Walk Skradin medieval lanes',
        'Cycle a Krka park trail',
        'Dalmatian prosciutto picnic',
      ],
      mooringTip: 'ACI Marina Skradin sits at the river mouth. Pre-book in July-August.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
    {
      id: 'skradin-vrgada',
      routeFrom: 'Skradin',
      routeTo: 'Vrgada',
      day: 6,
      mapPin: {
        desktop: { left: 45.5, top: 51.4 },
        mobile: { left: 45.5, top: 51.4 },
      },
      description:
        'Set off for Vrgada, an island lost to time. Anchor in a harbor of powdery sand where the shallows show pine shadows. Search for sea glass on desolate beaches; then, join the locals for a brudet feast—fish stew simmering in a century-old pot—as accordion music overflows from open windows and stars swarm the heavens like unwelcome visitors.',
      shortDescription:
        'Easy 18 nm back down the river and along the coast to Vrgada — a tiny island near Pirovac, no cars, sandy bay, and a population that swells from 250 to 600 in August.',
      thingsToDo: [
        'Swim the sandy Lučica Bay',
        'Walk the no-car island paths',
        'Beachcomb for sea glass',
        'Brudet stew at the family konoba',
      ],
      mooringTip: 'Restaurant moorings off Lučica Bay — free with dinner ashore.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vrgada.webp', alt: 'Vrgada' }],
    },
    {
      id: 'vrgada-sukosan',
      routeFrom: 'Vrgada',
      routeTo: 'Sukosan',
      day: 7,
      mapPin: {
        desktop: { left: 36.1, top: 36.7 },
        mobile: { left: 36.1, top: 36.7 },
      },
      description:
        'Sail homeward, stopping to dive in Molat\'s "Moon Craters," underwater karst gardens alive. Go back to Sukosan where the lights of the marina sparkle like ground-based fireflies. Under an indigo sky, toast your journey with crni rižot (black risotto), the murmurs of the Adriatic echoing: You are always part of the story of this sea.',
      shortDescription:
        'Final 16 nm leg up the Pašman channel back into Sukošan and Marina Dalmacija — the largest marina in Croatia by berth count and the most efficient handover base on the upper Adriatic.',
      thingsToDo: [
        'Final swim in Pašman coves',
        'Final-night seafood platter',
        'Browse the Marina Dalmacija strip',
        'Pack-and-clean for handover',
      ],
      mooringTip: 'Marina Dalmacija (Sukošan) — pre-confirm berth assignment and fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sukosan.webp', alt: 'Sukošan' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Sukosan Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Sukosan Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(sukosanKornatiKrkaRoute);
