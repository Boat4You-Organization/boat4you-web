import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const corfuKassiopiSagiadaRoute: ItineraryRoute = {
  metaTitle: '7-Day Corfu–Kassiopi–Sagiada Yacht Charter Route | Ionian Sailing',
  metaDesc:
    'Sail a yacht charter from Corfu to Kassiopi and Sagiada. Explore Byzantine forts, hidden coves, lush Ionian landscapes & the timeless charm of Greece’s north Ionian coast.',
  id: 'corfu-kassiopi-sagiada',
  startingPoint: 'Corfu',
  otherPoints: ['Kassiopi', 'Sagiada'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/corfu-kassiopi-sagiada.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/mourtos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/corfu-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/mourtos-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/corfu-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'corfu-kassiopi',
      routeFrom: 'Corfu (Gouvia Marina)',
      routeTo: 'Kassiopi',
      day: 1,
      mapPin: {
        desktop: { left: 39.8, top: 10.9 },
        mobile: { left: 27.1, top: 13.2 },
      },
      description:
        "Starting your journey in Gouvia Marina, where elegant ships bob in the shadow of Venetian past, Sail north on the rocky coast of the island, passing olive trees and monasteries by cliffs. In Kassiopi, a picturesque town capped with a Byzantine castle, dock. Swim at Bataria Beach, its stones polished smooth by the Ionian's turquoise waves, then eat pastitsada (cinnamon-laced beef stew) at a taverna nest under old plane trees. Wander the harbor lighted by lanterns as night sets; the smell of jasmine mingles with sea salt.",
      shortDescription:
        'Easy 14 nm leg out of Gouvia Marina up the eastern shore of Corfu to Kassiopi — the harbour village at the foot of a 13th-century Byzantine castle. The Albanian coast sits 1.5 nm across the strait; Mount Pantokrator (906 m) rises behind the village.',
      thingsToDo: [
        'Walk the Byzantine castle ruins',
        'Swim at smooth-pebble Bataria Beach',
        'Hike the Mount Pantokrator trail',
        'Pastitsada beef stew at a plane-shaded taverna',
      ],
      mooringTip:
        'Kassiopi small harbour quay — pre-book in summer. Anchor in nearby Avlaki bay 1 nm east on sand at 4-6 m for an alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kassiopi.webp', alt: 'Kassiopi' }],
    },
    {
      id: 'kassiopi-ereikoussa',
      routeFrom: 'Kassiopi',
      routeTo: 'Ereikoussa',
      day: 2,
      mapPin: {
        desktop: { left: 41.9, top: 3.7 },
        mobile: { left: 29.4, top: 4.6 },
      },
      description:
        "Glide northwest to Ereikoussa, the smallest of the Diapontia Islands, where unspoiled beaches collide with pine woods. Anchor in the lazy harbor, where visitors are outnumbered by fishing boats. Walk to the hilltop church for views of Albania's far-off mountains or snorkel the glittering depths of the Blue Cave. Eat bianco, garlicky fish stew, in a family-run taverna; the stars on the quiet water seem like diamonds. Tip: This is Greece as it once was—quiet, unvarnished, and rather magical.",
      shortDescription:
        "Long 18 nm offshore passage northwest to Ereikoussa — the smallest of the Diapontia Islands cluster off Corfu's northwest tip. Population under 50 year-round; one harbour, one beach, two tavernas. Quiet and unpolished.",
      thingsToDo: [
        'Hike to the hilltop chapel',
        'Snorkel the Blue Cave shore',
        'Walk Bragini sandy beach',
        'Bianco garlic-fish stew at a family taverna',
      ],
      mooringTip:
        'Ereikoussa harbour quay is small — first-come. Anchor on sand off the main beach at 4-6 m, sheltered from S/SE.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ereikoussa.webp', alt: 'Ereikoussa' }],
    },
    {
      id: 'ereikoussa-free-day',
      routeFrom: 'Ereikoussa',
      routeTo: 'Ereikoussa',
      day: 3,
      mapPin: {
        desktop: { left: 24.1, top: 1.8 },
        mobile: { left: 9.8, top: 4 },
      },
      description:
        'Free day to unload. Claim Braghini Beach as your own; paddle to Othonoi, the legendary island of Calypso; its beautiful sand flanked by cedar trees is yours. Lunch is feta and sun-warmed tomatoes at a seaside picnic table; afterward, siesta in a hammock stretched between pines. Join residents for raki and dominoes at the kafeneio by dusk to hear laughter across the harbour.',
      shortDescription:
        'Layover day on Ereikoussa with an optional 4 nm sail west to Othonoi — the westernmost inhabited point of Greece, sandstone cliffs, the legendary cave of Calypso, and a single tiny harbour with two tavernas.',
      thingsToDo: [
        'Cedar-shaded Bragini Beach picnic',
        'Optional sail to Othonoi',
        "Tour Calypso's legendary cave",
        'Late raki at the kafeneio',
      ],
      mooringTip: 'Othonoi has a small harbour quay — first-come. Plan day return to Ereikoussa for the night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ereikoussa.webp', alt: 'Ereikoussa' }],
    },
    {
      id: 'ereikoussa-sagiada',
      routeFrom: 'Ereikoussa',
      routeTo: 'Sagiada',
      day: 4,
      description:
        'Go east to Sagiada, a mainland fishing community where Greece joins Albania. Dock at a harbour bustling with yells of "Yassou!," clattering fishing nets. At a seaside ouzeri, feast on grilled sardines and stroll the peaceful alleyways where time moves to the rhythm of the sea. Local secret: Worth an early wake-up, the Kalamas River Delta nearby teems with flamingos at sunrise.',
      shortDescription:
        'Twenty nautical miles back east to Sagiada — a mainland fishing village right at the Albanian border, with the Kalamas River delta (a wetland reserve) just south. Authentic, working-port Greece, far from the Corfu tourist track.',
      thingsToDo: [
        'Sunrise birdwatching at Kalamas Delta',
        'Walk Sagiada working harbour',
        'Try mussels at a quayside ouzeri',
        'Day-trip to ancient Bouthrotum (Albania)',
      ],
      mooringTip:
        'Small fishing-port quay — first-come. Cross-border to Albania is permissible with pre-arranged transit log.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sagiada.webp', alt: 'Sagiada' }],
    },
    {
      id: 'sagiada-mourtos',
      routeFrom: 'Sagiada',
      routeTo: 'Mourtos',
      day: 5,
      mapPin: {
        desktop: { left: 54.6, top: 16.2 },
        mobile: { left: 45.4, top: 15.9 },
      },
      description:
        "Go south to Mourtos, a group of islets in the Syvota archipelago. Drop anchor in the Blue Lagoon; its sapphire to emerald water gradient is gradual. Swim, paddleboard, or just float; then land in Syvota's harbor for bourdeto (spicy scorpionfish stew) at a taverna covered in bougainvillea. Watch the bay spark with the lights of yachts and laughter as evening falls.",
      shortDescription:
        'Easy coastal sail south to the Sivota archipelago and Mourtos — a cluster of islets that frame the famous Blue Lagoon (Voutoumi-style aquamarine over white-sand seabed). The bay is a magnet for yachts but the water clarity is exceptional.',
      thingsToDo: [
        'Swim the Blue Lagoon',
        'Paddleboard between the islets',
        'Walk the Sivota waterfront',
        'Bourdeto scorpionfish stew at the taverna',
      ],
      mooringTip:
        'Sivota harbour quay or stern-to inside the bay. Anchor in the Blue Lagoon for swim stop; not for overnight in summer.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mourtos.webp', alt: 'Mourtos' }],
    },
    {
      id: 'mourtos-corfu',
      routeFrom: 'Mourtos',
      routeTo: 'Corfu',
      day: 6,
      mapPin: {
        desktop: { left: 62.4, top: 27.7 },
        mobile: { left: 56.9, top: 25.6 },
      },
      description:
        'Go back to Corfu, but first stop in Paleokastritsa, where legends of Odysseus shipwrecked find azure bays cradled on cliffs. Explore Agios Spiridon Beach then sail into the Old Port of Corfu Town. Search for kumquat liqueur and gold-thread needlework by meandering the UNESCO-listed lanes of the Liston. At a courtyard taverna, toast your trip with sofrito—veal in wine sauce—while the sound of accordions floats from secret alleyways.',
      shortDescription:
        'Long 22 nm coastal leg back to Corfu Town. Optional Paleokastritsa stop on the western shore (where Homer placed the shipwreck of Odysseus on Phaeacian shores). Final-night dinner in the UNESCO-listed Corfu Old Town.',
      thingsToDo: [
        'Stop at Paleokastritsa azure coves',
        'Walk the UNESCO Corfu Old Town',
        'Tour the Old Fortress',
        'Sofrito veal stew at a Liston taverna',
      ],
      mooringTip: 'Gouvia Marina is the standard charter berth; Corfu Town quay is short-stay only.',
      gallery: [{ src: '/images/itinerary/greece/destinations/corfu.webp', alt: 'Corfu' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Corfu',
      routeTo: 'Check-out',
      day: 7,
      description:
        'One farewell cappuccino at Café Bristol, its marble tables glistened in Habsburg grandeur. Walk the Spianada, the biggest square in Europe, where cricket matches take place under the Old Fortress. Disembark carrying olive oil soap, a heart full of Ionian sunshine, and the serene assurance that Corfu—like all great loves—will welcome you back in a suitcase.',
      shortDescription:
        'Final morning at Gouvia Marina. Optional walk in Corfu Town: cricket on the Spianada square, last cappuccino at Café Bristol, kumquat liqueur shopping at the Liston.',
      thingsToDo: [
        'Cappuccino on the Liston arcades',
        'Walk the Spianada (largest square in Europe)',
        'Visit Corfu Asian Art Museum',
        'Pack-and-clean for handover',
      ],
      mooringTip: 'Gouvia Marina handover — confirm fuel slot and clean-time the evening before.',
      gallery: [{ src: '/images/itinerary/greece/destinations/corfu-town.webp', alt: 'Corfu' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Corfu Kassiopi Sagiada Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Corfu Kassiopi Sagiada Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(corfuKassiopiSagiadaRoute);
