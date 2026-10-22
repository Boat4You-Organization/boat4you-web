import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lefkasKefaloniaZakynthos14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Lefkas–Kefalonia–Zakynthos Yacht Charter Route | Ionian Sailing',
  metaDesc:
    'Sail a 14-day yacht charter from Lefkas via Kefalonia to Zakynthos. Discover Myrtos Beach, Melissani Cave, hidden bays & world-famous Ionian island beauty.',
  id: 'lefkas-kefalonia-zakynthos-14-days',
  startingPoint: 'Lefkas',
  otherPoints: ['Kefalonia', 'Zakynthos'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/lefkas-kefalonia-zakynthos.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/kefalonia-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/lefkas-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/lefkas-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/ithaka-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'lefkas-meganisi',
      routeFrom: 'Lefkas',
      routeTo: 'Meganisi',
      day: 1,
      mapPin: {
        desktop: { left: 68.4, top: 45.4 },
        mobile: { left: 71.7, top: 44 },
      },
      description:
        'From Lefkas, glide over the blue Ionian Sea to Meganisi, where emerald slopes hug secret coves. Fishermen mend nets in the cover of tamarisk trees at Spartochori, a postcard harbor with drop anchors. After exploring the Papanikolis Cave by dinghy—its echoing chambers formerly sheltered WWII submarines—then feast on garlicky octopus at a seaside taverna as the sun sets below the horizon. Try to anchor early; this small port fills quickly!',
      gallery: [{ src: '/images/itinerary/greece/destinations/meganisi.webp', alt: 'Meganisi' }],
    },
    {
      id: 'meganisi-ithaka',
      routeFrom: 'Meganisi',
      routeTo: 'Ithaka',
      day: 2,
      mapPin: {
        desktop: { left: 72, top: 51.9 },
        mobile: { left: 66.8, top: 50.5 },
      },
      description:
        "Follow Odysseus's story to Ithaka, mooring in Vathy, a horseshoe bay surrounded with cypress trees. Explore the crystalline waves of Dexa Bay or climb to the School of Homer, where old stones murmur stories of courage. Drink Robola wine in a patio taverna at evening; the air is heavy with jasmine and the clink of olive-based cuisine.",
      gallery: [{ src: '/images/itinerary/greece/destinations/ithaka.webp', alt: 'Ithaka' }],
    },
    {
      id: 'ithaka-kefalonia',
      routeFrom: 'Ithaka',
      routeTo: 'Kefalonia (Asos)',
      day: 3,
      mapPin: {
        desktop: { left: 69, top: 61.6 },
        mobile: { left: 70.4, top: 61.6 },
      },
      description:
        "Sail south to Asos, a pastel village perched under Venetian castle on a peninsula covered in pine. Swim at Myrtos Beach; the marble pebbles there sparkle like pearls under midday light. Wander Asos's cobblestone streets, where family-run restaurants' grilled souvlaki smells permeate and kittens slumber in doors.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia.webp', alt: 'Asos' }],
    },
    {
      id: 'kefalonia-asos',
      routeFrom: 'Kefalonia (Asos)',
      routeTo: 'Asos',
      day: 4,
      mapPin: {
        desktop: { left: 63.1, top: 60.8 },
        mobile: { left: 61.9, top: 60.8 },
      },
      description:
        "Free day to absorb Asos' peace. For panoramic views of the Ionian, or boat to Arginia Beach, a remote cove accessible only by water, hike the cliff walk to the castle remains. Local secret: Join residents for afternoon coffee and pirate raid stories in the kafeneio.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia.webp', alt: 'Asos' }],
    },
    {
      id: 'asos-kefalonia-lixouri',
      routeFrom: 'Asos',
      routeTo: 'Kefalonia (Lixouri)',
      day: 5,
      mapPin: {
        desktop: { left: 62.1, top: 65.9 },
        mobile: { left: 57.6, top: 66.9 },
      },
      description:
        'From Lixouri, the laid-back counterpart of Argostoli, cruise west. Use the local ferry to cross the bay, then relax at Petani Beach where cliffs sink into azure seas. Dinner is here. Kreatopita, a spicy pork pie, at a taverna with a view of the sunset-drenched port.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia-lixouri.webp', alt: 'Lixouri' }],
    },
    {
      id: 'lixouri-zakynthos',
      routeFrom: 'Lixouri',
      routeTo: 'Zakynthos',
      day: 6,
      mapPin: {
        desktop: { left: 59.2, top: 70.8 },
        mobile: { left: 55, top: 73.1 },
      },
      description:
        'Sail to Zakynthos, site of the famous Navagio Beach (Shipwreck Cove). Arriving early to avoid the throngs, swim in the electric-blue waves before noon excursions arrive. Later, kayak the Keri Caves or enjoy mandolato, honey-nut candy, at Bohali, a mountaintop community with views all the way to infinity.',
      gallery: [{ src: '/images/itinerary/greece/destinations/zakynthos.webp', alt: 'Zakynthos' }],
    },
    {
      id: 'zakynthos-day-off',
      routeFrom: 'Zakynthos',
      routeTo: 'Zakynthos',
      day: 7,
      mapPin: {
        desktop: { left: 71.7, top: 92.8 },
        mobile: { left: 74.5, top: 92.1 },
      },
      description:
        'Free day to delve more deeply. Go on a turtle-spotting trip at Lagana Bay, climb to Xigia Sulfur Springs, or eat slow-cooked rabbit stifado in Meso Gerakari. Pro tip: Golden hour for the Ionian is front-row available at Sunset at Kampi Cliffs.',
      gallery: [{ src: '/images/itinerary/greece/destinations/zakynthos.webp', alt: 'Zakynthos' }],
    },
    {
      id: 'zakynthos-kefalonia-sami',
      routeFrom: 'Zakynthos',
      routeTo: 'Kefalonia (Sami)',
      day: 8,
      description:
        'Go back to Kefalonia and anchor in Sami. Swim at Antisamos Beach, framed by jungled hills, or explore Melissani Cave, where sunlight dances over an underground lake. Dinner is fresh-caught Barbounia (red mullet) from a port taverna accompanied by Muscat wine from the area.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sami-kefalonia.webp', alt: 'Sami' }],
    },
    {
      id: 'sami-fiscardo',
      routeFrom: 'Sami',
      routeTo: 'Fiscardo',
      day: 9,
      mapPin: {
        desktop: { left: 68.2, top: 70.6 },
        mobile: { left: 70.8, top: 70.6 },
      },
      description:
        'Sail north to Fiscardo, a Venetian harbor with pastel villas along the waterfront. After strolling under cypress trees to Emplisi Beach, feast on bourdeto (hot fish stew) from a riverside table. Not missed is a nightcap at Tassia Restaurant, a Fiscardo establishment..',
      gallery: [{ src: '/images/itinerary/greece/destinations/fiscardo.webp', alt: 'Fiscardo' }],
    },
    {
      id: 'fiscardo-astakos',
      routeFrom: 'Fiscardo',
      routeTo: 'Astakos',
      day: 10,
      description:
        'Cross to the mainland, anchored in Astakos, a peaceful port where time flows in sync with fishing boats. Wander the quay tasting taramasalata whipped with local olive oil, then see the stars reflected on the peaceful waters of the port.',
      gallery: [{ src: '/images/itinerary/greece/destinations/astakos.webp', alt: 'Astakos' }],
    },
    {
      id: 'astakos-kastos',
      routeFrom: 'Astakos',
      routeTo: 'Kastos',
      day: 11,
      mapPin: {
        desktop: { left: 82.8, top: 57.3 },
        mobile: { left: 92.4, top: 56.8 },
      },
      description:
        "Get away to Kastos, an island lost to mass tourist. Snorkel the blue depths of the Blue Cave, climb to the Abandoned Windmills, and have fasolada—bean soup—at Mama's taverna, where the recipe hasn't changed in fifty years.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kastos.webp', alt: 'Kastos' }],
    },
    {
      id: 'kastos-kalamos',
      routeFrom: 'Kastos',
      routeTo: 'Kalamos',
      day: 12,
      mapPin: {
        desktop: { left: 76.6, top: 58.2 },
        mobile: { left: 79.6, top: 56.7 },
      },
      description:
        "It's only a short hop to Kalamos, where pine woods meet rocky shores. You can swim at Asprogiali Beach, hike to the ruins of the Old Village, and eat savoro fish at a beach ouzeri. This type of fish is fried crisp with rosemary and vinegar.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kalamos.webp', alt: 'Kalamos' }],
    },
    {
      id: 'kalamos-lefkas',
      routeFrom: 'Kalamos',
      routeTo: 'Lefkas',
      day: 13,
      mapPin: {
        desktop: { left: 77.1, top: 53.9 },
        mobile: { left: 82.5, top: 51.6 },
      },
      description:
        "Reversing course to Lefkas, stop at Skorpios Island (Onassis's former hideaway) for a last swim in billionaire-worthy seas. At a marina taverna, greet your journey with ouzo and bakaliaros (salt cod), the rigging of yachts chiming in the breeze at D-Marin.",
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Lefkas',
      routeTo: 'Check-out',
      day: 14,
      description:
        'Taste one last Ionian daybreak in Lefkas Town with honey-drenched loukoumades. Look for handcrafted leather sandals on the market or walk the floating bridges across Lagoon. The Ionian never really lets you go; thus, set forth with salt-streaked hair, a camera roll of turquoise dreams, and a promise to return.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
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

export default computeItineraryNumberOfDays(lefkasKefaloniaZakynthos14DaysRoute);
