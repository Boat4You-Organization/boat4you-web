import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const olbiaLongRoute: ItineraryRoute = {
  metaTitle: '7-Day Olbia Round-Trip Yacht Charter | Sardinia + Corsica + Maddalena',
  metaDesc:
    'Sail a 7-day yacht charter from Olbia through Tavolara, Caprera, Spargi, Bonifacio (Corsica), Santa Teresa Gallura and Palau — full Maddalena + Bonifacio Strait loop.',
  id: 'olbia-long',
  startingPoint: 'Olbia',
  otherPoints: ['Long'],
  cardImage: { src: '/images/itinerary/italy/sardinia-itinerary/routes/olbia-long.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/rotondo-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/olbia-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/olbia-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/travolara-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'olbia-tavolara-island',
      routeFrom: 'Olbia',
      routeTo: 'Tavolara Island',
      day: 1,
      mapPin: {
        desktop: { left: 70.9, top: 72.2 },
        mobile: { left: 78, top: 84.1 },
      },
      description:
        '15 nm shake-down south from Olbia to Tavolara — limestone islet rising 565 m straight from the sea, formerly the smallest historical kingdom in the world. Anchor at Spalmatore di Terra (sand 4-6 m, sheltered from N) for the headline beach swim. Day-stop only — overnight back at Porto San Paolo opposite.',
      shortDescription:
        '15 nm shake-down S to Tavolara — 565 m limestone islet, former smallest kingdom in world. Spalmatore swim sheltered N. Overnight at Porto San Paolo opposite.',
      thingsToDo: [
        'Anchor swim at Spalmatore di Terra sand',
        'Walk to the "royal cemetery" of the kingdom',
        'Free-dive the limestone underwater arches',
        'Lunch at Da Tonino taverna ashore',
      ],
      mooringTip:
        'Anchor day-stop only at Spalmatore di Terra on sand at 4-6 m, sheltered from N. Overnight at Porto San Paolo small marina (€60-90/night) opposite.',
      gallery: [{ src: '/images/itinerary/italy/destinations/tavolara-island.webp', alt: 'Tavolara' }],
    },
    {
      id: 'tavolara-caprera',
      routeFrom: 'Tavolara',
      routeTo: 'Caprera',
      day: 2,
      mapPin: {
        desktop: { left: 77.6, top: 71.5 },
        mobile: { left: 96.4, top: 89 },
      },
      description:
        '20 nm north to Caprera — Maddalena National Park, Garibaldi\'s home (the Italian unification revolutionary lived here from 1855-1882). Cala Coticcio ("Tahiti of the Med", boat-only access) is the headline anchorage of the entire park. Park rules: mooring buoys must be pre-booked online for July-August.',
      shortDescription:
        '20 nm N to Caprera — Maddalena Park, Garibaldi 1855-1882 home. Cala Coticcio "Tahiti of Med" headline anchorage. Park: pre-book buoys for Jul-Aug. Cala Portese on sand at 5-7 m as alternative for free anchorage.',
      thingsToDo: [
        'Anchor swim at Cala Coticcio "Tahiti of Med"',
        "Visit Garibaldi's house museum",
        'Snorkel the Spargi Shipwreck cannons',
        'Hike the Cala Portese-Cala Garibaldi ridge',
      ],
      mooringTip:
        'Maddalena Park mooring buoys at Cala Coticcio, €40-80/night peak, pre-book online via the Park. Cala Portese on sand at 5-7 m as alternative for free anchorage.',
      gallery: [{ src: '/images/itinerary/italy/destinations/caprera.webp', alt: 'Caprera' }],
    },
    {
      id: 'caprera-spargi',
      routeFrom: 'Caprera',
      routeTo: 'Spargi',
      day: 3,
      mapPin: {
        desktop: { left: 65.9, top: 50.9 },
        mobile: { left: 70.1, top: 61.4 },
      },
      description:
        '5 nm short west to Spargi — uninhabited Maddalena Park island, pink-granite boulders. Cala Corsara (sand bottom 4-6 m, sheltered from N) is the headline swim anchorage. Piscine Naturali tidal pools on the south coast for snorkel. Park mooring buoys at Cala Corsara, €40-60/night peak, pre-book online. Anchorage on sand 4-6 m for free as alternative if buoys unavailable. Plan to anchor swim at Cala Corsara pink-granite cove, snorkel Piscine Naturali tidal pools, beachcomb sea-glass on the empty shoreline.',
      shortDescription:
        '5 nm short W to Spargi — uninhabited Maddalena Park island. Cala Corsara pink-granite swim anchorage; Piscine Naturali tidal pools south. Park mooring buoys at Cala Corsara, €40-60/night peak, pre-book online. Plan to beachcomb sea-glass on the empty shoreline and picnic on deck under junipers.',
      thingsToDo: [
        'Anchor swim at Cala Corsara pink-granite cove',
        'Snorkel Piscine Naturali tidal pools',
        'Beachcomb sea-glass on the empty shoreline',
        'Picnic on deck under junipers',
      ],
      mooringTip:
        'Park mooring buoys at Cala Corsara, €40-60/night peak, pre-book online. Anchorage on sand 4-6 m for free as alternative if buoys unavailable.',
      gallery: [{ src: '/images/itinerary/italy/destinations/spargi.webp', alt: 'Spargi' }],
    },
    {
      id: 'spargi-bonifacio',
      routeFrom: 'Spargi',
      routeTo: 'Bonifacio',
      day: 4,
      mapPin: {
        desktop: { left: 60.9, top: 51.1 },
        mobile: { left: 74.4, top: 55.3 },
      },
      description:
        '12 nm north across the Bonifacio Strait into Corsica. The strait accelerates the Mistral by 5-8 knots — the windiest passage in the western Mediterranean, only viable in daylight + below 25 kn forecast. Bonifacio is a limestone fjord, the harbour cut into a 70 m cliff. Marina de Bonifacio stern-to inside the inner fjord.',
      shortDescription:
        '12 nm N across Bonifacio Strait into Corsica. Strait accelerates Mistral 5-8 kn — windiest western Med passage. Cross only daylight + below 25 kn forecast.',
      thingsToDo: [
        'Walk the upper-town citadel walls',
        "Descend the King of Aragon's Steps to the sea",
        'Tender into the limestone sea grottoes',
        'Langoustine risotto at U Castille',
      ],
      mooringTip:
        'Marina de Bonifacio stern-to inside the inner fjord, €100-180/night peak. Fully sheltered. Crossing the strait only viable in daylight + Mistral below 25 kn forecast.',
      gallery: [{ src: '/images/itinerary/italy/destinations/bonifacio.webp', alt: 'Bonifacio' }],
    },
    {
      id: 'bonifacio-santa-teresa-gallura',
      routeFrom: 'Bonifacio',
      routeTo: 'Santa Teresa Gallura',
      day: 5,
      mapPin: {
        desktop: { left: 54.1, top: 33.9 },
        mobile: { left: 48, top: 39.5 },
      },
      description:
        '8 nm south back across the strait to Sardinia. Santa Teresa Gallura is the northernmost Sardinian charter port, sheltered from any direction by the headland. Anchor off Rena Bianca (white-sand crescent, sheltered from N) for swim. Longonsardo Tower (16th-c, Aragonese) above the village.',
      shortDescription:
        '8 nm S back across strait to Santa Teresa. Northernmost Sardinian charter port, fully sheltered. Rena Bianca white-sand swim. 16th-c Longonsardo Tower above. Highlights: Anchor swim at Rena Bianca white-sand crescent and Climb the 16th-c Longonsardo Tower.',
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
      id: 'santa-teresa-palau',
      routeFrom: 'Santa Teresa',
      routeTo: 'Palau',
      day: 6,
      mapPin: {
        desktop: { left: 54.9, top: 48.2 },
        mobile: { left: 52.3, top: 55 },
      },
      description:
        '12 nm east to Palau — the gateway port to the Maddalena archipelago, 200 m from La Maddalena island by car ferry. Capo d\'Orso ("Bear Rock", wind-carved granite headland 4 nm east) is the headline shore activity, accessible by road from Palau marina.',
      shortDescription:
        "12 nm E to Palau — gateway to La Maddalena archipelago. Capo d'Orso wind-carved granite Bear Rock 4 nm E by road from marina. Marina di Palau stern-to, €80-120/night peak, sheltered from N. Plan to walk to the wind-carved Capo d\\ and bear Rock.",
      thingsToDo: [
        'Walk to the wind-carved Capo d\'Orso "Bear Rock"',
        'Day-trip ferry across to La Maddalena town',
        'Malloreddus saffron gnocchi at a port trattoria',
        'Sunset on the Porto Rafael waterfront',
      ],
      mooringTip:
        "Marina di Palau stern-to, €80-120/night peak, sheltered from N. Marina dell'Orso 1 nm east is the larger alternative.",
      gallery: [{ src: '/images/itinerary/italy/destinations/palau.webp', alt: 'Palau' }],
    },
    {
      id: 'palau-porto-cervo',
      routeFrom: 'Palau',
      routeTo: 'Olbia',
      day: 7,
      mapPin: {
        desktop: { left: 70.8, top: 57.2 },
        mobile: { left: 80.3, top: 65.1 },
      },
      description:
        '20 nm south back to Olbia via Costa Smeralda. Optional anchor stop at Cala Granu off Porto Cervo (sand 5-7 m, boat-only access, sheltered from N) for swim. Refuel at Olbia Marina before tying up. Olbia Marina stern-to with lazy lines, €100-150/night peak. Plan to crew dinner at a Porto San Paolo trattoria.',
      shortDescription:
        '20 nm S back to Olbia via Costa Smeralda. Optional Cala Granu off Porto Cervo for swim. Refuel at Olbia Marina before mooring. Olbia Marina stern-to with lazy lines, €100-150/night peak. Plan to crew dinner at a Porto San Paolo trattoria.',
      thingsToDo: [
        'Anchor swim at Cala Granu off Porto Cervo',
        'Walk the Porto Cervo Piazzetta marble',
        'Refuel and clean the boat at Olbia Marina',
        'Crew dinner at a Porto San Paolo trattoria',
      ],
      mooringTip:
        'Olbia Marina stern-to with lazy lines, €100-150/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-cervo.webp', alt: 'Porto Cervo' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/sardinia-itinerary/map.webp',
        alt: 'Olbia Route Image',
      },
      width: 1790,
      height: 1322,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/sardinia-itinerary/mobile-map.webp',
        alt: 'Olbia Route Image',
      },
      width: 1164,
      height: 1318,
    },
  },
};

export default computeItineraryNumberOfDays(olbiaLongRoute);
