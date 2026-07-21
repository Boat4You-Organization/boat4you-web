import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const biogradKornatiKrkaRoute: ItineraryRoute = {
  metaTitle: '7-Day Biograd–Kornati & Krka NP Yacht Route | Boat4You',
  metaDesc:
    'Sail a 7-day yacht charter from Biograd via Dugi Otok, NP Kornati & Krka National Park. Discover Božava, Telaščica, hidden bays & Adriatic island serenity.',
  id: 'biograd-na-moru-kornati-krka-route',
  startingPoint: 'Biograd na Moru',
  otherPoints: ['Kornati', 'Krka'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/biograd-kornati-card-image.webp',
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
      id: 'biograd-ugljan-bozava-bay-dugi-otok',
      routeFrom: 'Biograd',
      routeTo: 'Božava Bay (Dugi Otok)',
      day: 1,
      mapPin: {
        desktop: { left: 21.9, top: 27 },
        mobile: { left: 21.9, top: 27 },
      },
      description:
        'Starting at Biograd, the "White City," history murmurs through sun-bleached stone. Sail by Ugljan, the "Green Island," whose slopes are olive gardens and fig trees. Anchor at Božava Bay, the secret gem of Dugi Otok—cliffs cradle turquoise waves, their reflections whirling like liquid emeralds. Explore crystalline depths, then savor lignje na gradele ( roasted squid) in a seashore taverna; the air perfumed with wild sage and adventure promised.',
      shortDescription:
        "Long opening 25 nm passage out of Biograd, threading past Ugljan and around Dugi Otok's northwest tip into Božava — the headline northern-shore village. Sakarun Bay (1 nm to the west) has the only Caribbean-style white-sand beach in the Zadar archipelago.",
      thingsToDo: [
        'Visit Biograd Heritage Museum',
        'Swim sandy Sakarun Bay',
        'Tour Veli Rat lighthouse',
        'Grilled squid at the harbour',
      ],
      mooringTip:
        'Božava harbour quay is small — pre-book. Anchor in Sakarun Bay 1 nm west on sand at 4-6 m for an alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/bozava.webp', alt: 'Božava' }],
    },
    {
      id: 'bozava-telascica-bay',
      routeFrom: 'Božava',
      routeTo: 'Telaščica Bay',
      day: 2,
      mapPin: {
        desktop: { left: 15.4, top: 23.8 },
        mobile: { left: 15.4, top: 23.8 },
      },
      description:
        "Sail south toward Telaščica's wild embrace at dawn, where cliffs sink into indigo nothingness. Swim in the saltwater lagoon of Mir Lake; its warmth is a contrast against the frigid Adriatic depths. Your laughter echoes across the bay as the sun melts into a horizon of molten gold. Wild donkeys graze ancient olive groves, then dare to leap from Stene's rocky ledge.",
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
      id: 'telascica-bay-kornati-national-park-levrnaka-piskera',
      routeFrom: 'Telaščica Bay',
      routeTo: 'Kornati National Park (Levrnaka, Piškera)',
      day: 3,
      mapPin: {
        desktop: { left: 25.2, top: 38.1 },
        mobile: { left: 25.2, top: 38.1 },
      },
      description:
        "Now enter the stone maze created by Kornati, where 89 islands weaves myth into reality. Moor in Vrulje Bay in Levrnaka, snorkel amid coral gardens glistening like submerged galaxies. By evening, anchor near Piškera's abandoned fishing shelters. Under a sky bursting with stars, the Milky Way your only observer, grill fresh-caught bream.",
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
        desktop: { left: 32.7, top: 48.4 },
        mobile: { left: 32.7, top: 48.4 },
      },
      description:
        'Sail north to Zlarin, the "Coral Island," where blue waves hide red wealth. Wander past workshops building coral jewelry car-free paths, then sip loza rakija from a bench by the port. See Šibenik\'s fortress illuminate amber in the distance while old men play briškula, their cards striking the table like a challenge to time itself.',
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
        desktop: { left: 51.1, top: 56.3 },
        mobile: { left: 51.1, top: 56.3 },
      },
      description:
        "Along the Krka River, drift inland where waterfalls howl like dragons defending Eden. Dock in Skradin, a town with stone arches and figs blooming with summer's delicacy. Glide by boat to Skradinski Buk—plunge into natural pools under cascades to make rainbows in the mist. Picnic on sun-warmed tomatoes and Pag cheese, dragonflies flying like jeweled messengers.",
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
        desktop: { left: 53.2, top: 49.6 },
        mobile: { left: 53.2, top: 49.6 },
      },
      description:
        'Set off for Vrgada, an island lost to time. Anchor in a harbor of powdery sand where the shallows show pine shadows. Search for sea glass on desolate beaches; then, join the locals for a brudet feast—fish stew simmering in a century-old pot—as accordion music overflows from open windows and stars swarm the heavens like unwelcome visitors.',
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
      id: 'vrgada-biograd',
      routeFrom: 'Vrgada',
      routeTo: 'Biograd',
      day: 7,
      mapPin: {
        desktop: { left: 39.5, top: 41.9 },
        mobile: { left: 36.7, top: 43.6 },
      },
      description:
        'Sail homeward, stopping to dive in Molat\'s "Moon Craters," underwater karst gardens alive. Go back to Biograd; the lights of the marina seem to be ground-based fireflies. Under an indigo sky, toast your journey with crni rižot, black risotto, the murmurs of the Adriatic echoing: You are always part of the story of this water.',
      shortDescription:
        "Final 12 nm leg up the Pašman channel back into Biograd — Croatia's medieval royal coronation city, now the largest charter base on the Zadar coast with three full marinas.",
      thingsToDo: [
        'Final swim in Pašman coves',
        'Walk the Biograd Riva',
        'Visit the Heritage Museum',
        'Crni rižot dinner at the marina',
      ],
      mooringTip:
        'Marina Kornati or Marina Šangulin — both inside the old-town breakwater. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/biograd.webp', alt: 'Biograd na moru' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Biograd Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Biograd Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(biogradKornatiKrkaRoute);
