import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const portiscoLongRoute: ItineraryRoute = {
  metaTitle: '7-Day Portisco Round-Trip Yacht Charter | Sardinia + Corsica Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Portisco via Porto Cervo, La Maddalena, Bonifacio (Corsica), Porto Vecchio, Cala Santa Maria and Capriccioli. Sardinia + Corsica grand loop.',
  id: 'portisco-long',
  startingPoint: 'Portisco',
  otherPoints: ['Long'],
  cardImage: { src: '/images/itinerary/italy/sardinia-itinerary/routes/portisco-long.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/portisco-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/maddalena-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/portisco-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/bonifacio-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'portisco-porto-cervo',
      routeFrom: 'Portisco',
      routeTo: 'Porto Cervo',
      day: 1,
      mapPin: {
        desktop: { left: 68.6, top: 62.9 },
        mobile: { left: 68.6, top: 62.9 },
      },
      description:
        '6 nm shake-down north to Porto Cervo — the most exclusive Mediterranean port, Aga Khan founding 1962. Cala Granu (boat-only access, sand 5-7 m, sheltered from N) for swim before mooring. Marina di Porto Cervo is the most expensive charter slot in the Mediterranean (€300-600/night peak).',
      shortDescription:
        '6 nm shake-down N to Porto Cervo — most exclusive Med port. Cala Granu swim. Marina €300-600/night peak Aug — most expensive in Med. Highlights: Anchor swim at Cala Granu (boat-only, sand) and Walk the geometric marble Piazzetta.',
      thingsToDo: [
        'Anchor swim at Cala Granu (boat-only, sand)',
        'Walk the geometric marble Piazzetta',
        'Champagne aperitivo at Phi Beach',
        'Browse the boutique alleys',
      ],
      mooringTip:
        'Marina di Porto Cervo stern-to, €300-600/night peak Aug. Anchor in Cala Granu on sand at 5-7 m for cheaper alternative (no shore power).',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-cervo.webp', alt: 'Porto Cervo' }],
    },
    {
      id: 'porto-cervo-la-maddalena',
      routeFrom: 'Porto Cervo',
      routeTo: 'La Maddalena',
      day: 2,
      mapPin: {
        desktop: { left: 68.7, top: 54.6 },
        mobile: { left: 68.7, top: 54.6 },
      },
      description:
        '12 nm north into the Maddalena National Park. Porto Massimo on the north coast of La Maddalena island is a natural amphitheatre of pink-rock coves. Cala Francese (jade-and-sapphire mosaic water) for snorkel. Park rules: mooring buoys must be pre-booked online for July-August.',
      shortDescription:
        '12 nm N into Maddalena Park. Porto Massimo natural pink-rock amphitheatre. Cala Francese for snorkel. Park: pre-book buoys for Jul-Aug. Highlights: Anchor swim at Cala Francese (jade-sapphire water) and Kayak the pink-rock coves of Porto Massimo.',
      thingsToDo: [
        'Anchor swim at Cala Francese (jade-sapphire water)',
        'Kayak the pink-rock coves of Porto Massimo',
        'Hunt for Napoleon-era shipwreck remains',
        'Fregola with clams at a harbourside osteria',
      ],
      mooringTip:
        'Maddalena Park mooring buoys at Porto Massimo + Cala Francese, €40-80/night peak, pre-book online via the Park.',
      gallery: [{ src: '/images/itinerary/italy/destinations/la-maddalena.webp', alt: 'La Maddalena' }],
    },
    {
      id: 'la-maddalena-santa-teresa-gallura',
      routeFrom: 'La Maddalena',
      routeTo: 'Santa Teresa Gallura',
      day: 3,
      mapPin: {
        desktop: { left: 64.2, top: 52.6 },
        mobile: { left: 64.2, top: 52.6 },
      },
      description:
        '8 nm west to Santa Teresa Gallura — northernmost Sardinian charter port, sheltered from any direction by the headland. Rena Bianca white-sand crescent for swim. 16th-century Aragonese Longonsardo Tower above the village for the panorama back to Bonifacio. Anchor off Rena Bianca on sand at 4-6 m as alternative. Plan to mirto liqueur tasting on Piazza Vittorio Emanuele and beach lunch at Capo Testa wind-sculpted granite.',
      shortDescription:
        '8 nm W to Santa Teresa — northernmost Sardinian port. Rena Bianca white-sand swim. 16th-c Longonsardo Tower for Bonifacio panorama. Santa Teresa Gallura marina stern-to, €60-100/night, sheltered from any direction. Plan to mirto liqueur tasting on Piazza Vittorio Emanuele and beach lunch at Capo Testa wind-sculpted granite.',
      thingsToDo: [
        'Anchor swim at Rena Bianca white-sand crescent',
        'Climb the 16th-c Longonsardo Tower',
        'Mirto liqueur tasting on Piazza Vittorio Emanuele',
        'Beach lunch at Capo Testa wind-sculpted granite',
      ],
      mooringTip:
        'Santa Teresa Gallura marina stern-to, €60-100/night, sheltered from any direction. Anchor off Rena Bianca on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/santa-teresa-gallura.webp', alt: 'Santa Teresa Gallura' }],
    },
    {
      id: 'santa-teresa-bonifacio',
      routeFrom: 'Santa Teresa',
      routeTo: 'Bonifacio',
      day: 4,
      mapPin: {
        desktop: { left: 54.4, top: 48.9 },
        mobile: { left: 54.4, top: 48.9 },
      },
      description:
        '8 nm north across the Bonifacio Strait into Corsica. The strait accelerates the Mistral by 5-8 knots — windiest western Mediterranean passage, only viable in daylight + below 25 kn forecast. Bonifacio harbour cut into a 70 m limestone cliff. Marina de Bonifacio inside the inner fjord.',
      shortDescription:
        '8 nm N across Bonifacio Strait into Corsica. Mistral 5-8 kn extra in strait — windiest western Med. Daylight + below 25 kn only. Inner-fjord marina.',
      thingsToDo: [
        'Walk the upper-town citadel walls',
        "Descend the King of Aragon's Steps to the sea",
        'Tender into the limestone sea grottoes',
        'Corsican wild boar stew at U Castille',
      ],
      mooringTip:
        'Marina de Bonifacio stern-to, €100-180/night peak. Fully sheltered inside the inner fjord. Strait crossing only viable in daylight + Mistral below 25 kn.',
      gallery: [{ src: '/images/itinerary/italy/destinations/bonifacio.webp', alt: 'Bonifacio' }],
    },
    {
      id: 'bonifacio-porto-vecchio',
      routeFrom: 'Bonifacio',
      routeTo: 'Porto Vecchio',
      day: 5,
      mapPin: {
        desktop: { left: 52.8, top: 36.7 },
        mobile: { left: 52.8, top: 36.7 },
      },
      description:
        '20 nm northeast along the Corsican east coast to Porto Vecchio — major Corsican charter port, Genoese 16th-century citadel above. Palombaggia Beach (powder sand, blood-red cliffs, day-anchor) is the headline shore activity. Île de Cerbicale marine reserve 4 nm offshore for snorkel.',
      shortDescription:
        '20 nm NE to Porto Vecchio — major Corsican charter port. 16th-c Genoese citadel above. Palombaggia Beach + Île de Cerbicale marine reserve snorkel. Marina de Porto Vecchio stern-to, €100-150/night peak, sheltered from N. Plan to chestnut-flour beer at a hillside microbrewery.',
      thingsToDo: [
        'Anchor swim at Palombaggia powder-sand beach',
        'Walk the 16th-c Genoese citadel walls',
        'Snorkel Île de Cerbicale marine reserve',
        'Chestnut-flour beer at a hillside microbrewery',
      ],
      mooringTip:
        'Marina de Porto Vecchio stern-to, €100-150/night peak, sheltered from N. Palombaggia day-anchor on sand at 4-6 m.',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-vecchio.webp', alt: 'Porto Vecchio' }],
    },
    {
      id: 'porto-vecchio-cala-santa-maria',
      routeFrom: 'Porto Vecchio',
      routeTo: 'Cala Santa Maria',
      day: 6,
      mapPin: {
        desktop: { left: 59.4, top: 20.9 },
        mobile: { left: 59.4, top: 20.9 },
      },
      description:
        '15 nm south back across the strait to Sardinia. Cala Santa Maria on La Maddalena (boat-only access, pine-fringed turquoise cove, sand 4-6 m, sheltered from N) is the headline anchorage. Park mooring buoys must be pre-booked. Maddalena Park mooring buoys at Cala Santa Maria, €40-60/night peak, pre-book online via the Park. Plan to snorkel for parrotfish and anemones and picnic with fiadone (lemon cheesecake) on deck.',
      shortDescription:
        '15 nm S back across strait. Cala Santa Maria on La Maddalena (boat-only, pine-fringed, sand) is headline anchorage. Park: pre-book buoys. Highlights: Anchor swim at Cala Santa Maria (boat-only) and Snorkel for parrotfish and anemones.',
      thingsToDo: [
        'Anchor swim at Cala Santa Maria (boat-only)',
        'Snorkel for parrotfish and anemones',
        'Picnic with fiadone (lemon cheesecake) on deck',
        'Walk the pine-stone shoreline',
      ],
      mooringTip: 'Maddalena Park mooring buoys at Cala Santa Maria, €40-60/night peak, pre-book online via the Park.',
      gallery: [{ src: '/images/itinerary/italy/destinations/cala-santa-maria.webp', alt: 'Cala Santa Maria' }],
    },
    {
      id: 'cala-santa-maria-capriccioli-portisco',
      routeFrom: 'Cala Santa Maria',
      routeTo: 'Portisco',
      day: 7,
      mapPin: {
        desktop: { left: 72.2, top: 58.7 },
        mobile: { left: 72.2, top: 58.7 },
      },
      description:
        '15 nm south back to Portisco via Capriccioli + Cala di Volpe. Capriccioli granite-sentinel beach + Cala di Volpe (Aga Khan 1960s celebrity bay) for last swim stops. Refuel at Marina di Portisco before tying up. Refuel at the entrance fuel berth. Plan to last-day swim in Cala di Volpe and liscia Ruja warm-water beach lunch.',
      shortDescription:
        '15 nm S back to Portisco via Capriccioli + Cala di Volpe. Last swim stops at celebrity bays. Refuel at Marina di Portisco before mooring.',
      thingsToDo: [
        'Anchor swim at Capriccioli granite sentinels',
        'Last-day swim in Cala di Volpe',
        'Liscia Ruja warm-water beach lunch',
        'Refuel and clean the boat at Marina di Portisco',
      ],
      mooringTip:
        'Marina di Portisco stern-to with lazy lines, €120-200/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/italy/destinations/portisco.webp', alt: 'Portisco' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/sardinia-itinerary/map.webp',
        alt: 'Portisco Route Image',
      },
      width: 1790,
      height: 1322,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/sardinia-itinerary/mobile-map.webp',
        alt: 'Portisco Route Image',
      },
      width: 1164,
      height: 1318,
    },
  },
};

export default computeItineraryNumberOfDays(portiscoLongRoute);
