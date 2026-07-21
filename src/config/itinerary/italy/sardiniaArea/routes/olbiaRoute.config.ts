import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const olbiaRoute: ItineraryRoute = {
  metaTitle: 'Olbia Yacht Charter Route | Sardinia & Costa Smeralda Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Olbia via Tavolara, Golfo Aranci, Porto Rotondo, Portisco, Porto Cervo and Caprera. Costa Smeralda + Maddalena south route.',
  id: 'olbia',
  startingPoint: 'Olbia',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/sardinia-itinerary/routes/olbia.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/rotondo-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/olbia-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/olbia-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/travolara-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'olbia-porto-san-paolo',
      routeFrom: 'Olbia',
      routeTo: 'Porto San Paolo',
      day: 1,
      mapPin: {
        desktop: { left: 26.4, top: 63.9 },
        mobile: { left: 26.4, top: 63.9 },
      },
      description:
        '12 nm shake-down south from Olbia Marina to Porto San Paolo — small fishing village opposite the limestone Tavolara islet. The Sardinian summer wind is the Mistral from NW (10-25 kn) accelerating through the Bonifacio Strait — Costa Smeralda anchorages are sheltered from N. Anchor at Cala Girgolu on sand at 4-6 m, or stern-to in Porto San Paolo small marina.',
      shortDescription:
        '12 nm shake-down S to Porto San Paolo opposite Tavolara islet. Mistral NW wind regime accelerates through Bonifacio Strait. Cala Girgolu sand anchorage. Highlights: Snorkel Cala Girgolu seagrass meadows and Visit a bottarga (cured fish roe) workshop.',
      thingsToDo: [
        'Snorkel Cala Girgolu seagrass meadows',
        'Visit a bottarga (cured fish roe) workshop',
        'Walk to Capo Coda Cavallo viewpoint',
        'Grilled octopus at a quay trattoria',
      ],
      mooringTip:
        'Porto San Paolo small marina stern-to, €60-90/night, sheltered from N. Anchor in Cala Girgolu on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-san-paolo.webp', alt: 'Porto San Paolo' }],
    },
    {
      id: 'porto-san-paolo-tavolara',
      routeFrom: 'Porto San Paolo',
      routeTo: 'Tavolara Island',
      day: 2,
      mapPin: {
        desktop: { left: 56.6, top: 81.6 },
        mobile: { left: 56.6, top: 81.6 },
      },
      description:
        '4 nm short hop east to Tavolara — Sardinian limestone islet rising 565 m straight from the sea, formerly a self-declared micronation (the kingdom of Tavolara, the smallest historical kingdom in the world). Anchor at Spalmatore di Terra (sand bottom 4-6 m, sheltered from N) for the headline sand beach swim.',
      shortDescription:
        '4 nm short hop E to Tavolara — limestone 565 m islet, former smallest kingdom in the world. Spalmatore di Terra sand-beach anchorage, sheltered N.',
      thingsToDo: [
        'Anchor swim at Spiaggia Spalmatore sand beach',
        'Walk to the "royal cemetery" of the kingdom',
        'Free-dive the underwater limestone arches',
        'Lunch at the famous Da Tonino taverna ashore',
      ],
      mooringTip:
        'Free anchoring at Spalmatore di Terra on sand at 4-6 m, sheltered from N. No marina on the island. Day-stop only — no overnight if Mistral forecast above 18 kn.',
      gallery: [{ src: '/images/itinerary/italy/destinations/tavolara-island.webp', alt: 'Tavolara' }],
    },
    {
      id: 'tavolara-golfo-aranci',
      routeFrom: 'Tavolara',
      routeTo: 'Golfo Aranci',
      day: 3,
      mapPin: {
        desktop: { left: 68.6, top: 75.1 },
        mobile: { left: 68.6, top: 75.1 },
      },
      description:
        '12 nm north to Golfo Aranci — small Costa Smeralda port at the northeast tip of Sardinia. Marina di Golfo Aranci stern-to is the standard charter overnight, fully sheltered. Secca di Capo Figari underwater mountain 1 nm east is the headline dive/snorkel site.',
      shortDescription:
        '12 nm N to Golfo Aranci NE tip of Sardinia. Marina di Golfo Aranci fully sheltered. Secca di Capo Figari underwater mountain 1 nm E for dive.',
      thingsToDo: [
        'Snorkel Secca di Capo Figari underwater mountain',
        'Sunset cocktails at Rosa dei Venti',
        'Lobster linguine at Ristorante Da Paolo',
        'Walk Capo Figari lighthouse trail',
      ],
      mooringTip:
        'Marina di Golfo Aranci stern-to with lazy lines, €100-150/night peak. Fully sheltered. Pre-book in peak August.',
      gallery: [{ src: '/images/itinerary/italy/destinations/golfo-aranci.webp', alt: 'Golfo Aranci' }],
    },
    {
      id: 'golfo-aranci-porto-rotondo',
      routeFrom: 'Golfo Aranci',
      routeTo: 'Porto Rotondo',
      day: 4,
      mapPin: {
        desktop: { left: 55.6, top: 40.3 },
        mobile: { left: 55.6, top: 40.3 },
      },
      description:
        '6 nm short west to Porto Rotondo — Costa Smeralda playground, designed in 1963 by the Donà delle Rose family, all marble piazzas and bougainvillea-clad villas. Marina di Porto Rotondo stern-to is among the most expensive in the Mediterranean (€200-400/night peak August).',
      shortDescription:
        '6 nm short W to Porto Rotondo — Costa Smeralda playground. Designed 1963. Marina among the most expensive in the Mediterranean (€200-400/night peak). Anchor in Cala di Volpe outside as alternative, on sand at 6-8 m.',
      thingsToDo: [
        'Walk the Pietro Cascella Circle of Life sculpture',
        'Anchor swim at Spiaggia Ira pink-granite cove',
        'Aperitivo on the Piazzetta marble',
        'Boutique browse along Via dei Negozi',
      ],
      mooringTip:
        'Marina di Porto Rotondo stern-to, €200-400/night peak Aug, premium service. Anchor in Cala di Volpe outside as alternative, on sand at 6-8 m.',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-rotondo.webp', alt: 'Porto Rotondo' }],
    },
    {
      id: 'porto-rotondo-portisco',
      routeFrom: 'Porto Rotondo',
      routeTo: 'Portisco',
      day: 5,
      mapPin: {
        desktop: { left: 40.3, top: 28.1 },
        mobile: { left: 40.3, top: 28.1 },
      },
      description:
        "4 nm short hop north to Portisco. Marina di Portisco stern-to is the Costa Smeralda charter base — large quay, full services, lazy lines. Cala di Volpe (south coast, the Aga Khan's 1960s celebrity bay) is 1 nm east; Cupaccia (boat-only access) is the quieter alternative.",
      shortDescription:
        '4 nm short hop N to Portisco. Marina di Portisco is the Costa Smeralda charter base. Cala di Volpe (Aga Khan 1960s) 1 nm E; Cupaccia boat-only quieter.',
      thingsToDo: [
        'Anchor swim at Cala di Volpe celebrity bay',
        'Boat-only access to Cupaccia hidden cove',
        'Culurgiones herb-stuffed pasta at La Sorgente',
        'Sunset cocktail at Phi Beach club',
      ],
      mooringTip:
        'Marina di Portisco stern-to with lazy lines, €120-200/night peak. Full services. Pre-book in peak August.',
      gallery: [{ src: '/images/itinerary/italy/destinations/portisco.webp', alt: 'Portisco' }],
    },
    {
      id: 'portisco-porto-cervo',
      routeFrom: 'Portisco',
      routeTo: 'Porto Cervo',
      day: 6,
      mapPin: {
        desktop: { left: 30.8, top: 22.3 },
        mobile: { left: 30.8, top: 22.3 },
      },
      description:
        '6 nm short hop north to Porto Cervo — the most exclusive Mediterranean port, Aga Khan founding 1962. Anchor in Cala Granu (boat-only, sand 5-7 m, sheltered from N) for swim before mooring. Marina di Porto Cervo stern-to is the most expensive charter slot in the Mediterranean (€300-600/night peak).',
      shortDescription:
        '6 nm short hop N to Porto Cervo — most exclusive Med port, Aga Khan 1962. Cala Granu boat-only swim. Marina €300-600/night peak Aug — most expensive in Med.',
      thingsToDo: [
        'Anchor swim at Cala Granu (boat-only, sand)',
        'Walk the geometric marble Piazzetta',
        'Champagne aperitivo at Phi Beach',
        'Browse the boutique alleys (Hermès, Cartier, Bulgari)',
      ],
      mooringTip:
        'Marina di Porto Cervo stern-to, €300-600/night peak Aug. Premium full services. Anchor in Cala Granu on sand at 5-7 m for cheaper alternative (no shore power).',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-cervo.webp', alt: 'Porto Cervo' }],
    },
    {
      id: 'porto-cervo-caprera-olbia',
      routeFrom: 'Porto Cervo',
      routeTo: 'Olbia',
      day: 7,
      mapPin: {
        desktop: { left: 36.6, top: 9.5 },
        mobile: { left: 36.6, top: 9.5 },
      },
      description:
        '20 nm south back to Olbia via Caprera. Cala Coticcio on Caprera (the "Tahiti of the Med", boat-only access, sand bottom 4-6 m, sheltered from N) is the headline anchorage of the entire Maddalena park. Refuel at Olbia Marina before tying up.',
      shortDescription:
        '20 nm S back to Olbia via Caprera. Cala Coticcio "Tahiti of the Med" boat-only access. Refuel at Olbia Marina before mooring. Olbia Marina stern-to with lazy lines, €100-150/night peak. Plan to anchor swim at Cala Coticcio .',
      thingsToDo: [
        'Anchor swim at Cala Coticcio "Tahiti of Med"',
        "Visit Garibaldi's house museum on Caprera",
        'Snorkel the Spargi Shipwreck cannons',
        'Refuel and clean the boat at Olbia Marina',
      ],
      mooringTip:
        'Olbia Marina stern-to with lazy lines, €100-150/night peak. Refuel at the entrance fuel berth. Park rules: Cala Coticcio mooring buoys must be pre-booked online for July-August.',
      gallery: [{ src: '/images/itinerary/italy/destinations/caprera.webp', alt: 'Caprera' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/sardinia-itinerary/olbia/map.webp',
        alt: 'Olbia Route Image',
      },
      width: 1534,
      height: 1336,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/sardinia-itinerary/olbia/map.webp',
        alt: 'Olbia Route Image',
      },
      width: 1534,
      height: 1336,
    },
  },
};

export default computeItineraryNumberOfDays(olbiaRoute);
