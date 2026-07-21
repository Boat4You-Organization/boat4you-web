import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const portiscoRoute: ItineraryRoute = {
  metaTitle: 'Portisco Yacht Charter Route | Sardinia Costa Smeralda Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Portisco via Mortorio, Porto Rotondo, Golfo Aranci, Olbia, Porto San Paolo, Molara and Tavolara — Costa Smeralda south loop.',
  id: 'portisco',
  startingPoint: 'Portisco',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/sardinia-itinerary/routes/portisco.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/portisco-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/maddalena-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/portisco-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/bonifacio-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'portisco-mortorio-island',
      routeFrom: 'Portisco',
      routeTo: 'Mortorio Island',
      day: 1,
      mapPin: {
        desktop: { left: 64.4, top: 55.4 },
        mobile: { left: 61.8, top: 61.5 },
      },
      description:
        '4 nm short shake-down south to Mortorio — uninhabited granite islet inside the Costa Smeralda, day-anchor only. Cala dei Sassi (sand 4-6 m, sheltered from N) is the headline swim cove. Pools of Venus tidal pools on the south side for snorkel.',
      shortDescription:
        '4 nm short shake-down S to Mortorio — uninhabited granite islet, day-anchor only. Cala dei Sassi sand swim. Pools of Venus tidal pools south side.',
      thingsToDo: [
        'Anchor swim at Cala dei Sassi sand cove',
        'Snorkel the Pools of Venus tidal pools',
        'Beachcomb sea-glass quartz on the shore',
        'Picnic on deck under the granite cliffs',
      ],
      mooringTip:
        'Free anchoring in Cala dei Sassi on sand at 4-6 m, sheltered from N. Day-stop only — no overnight, return to Portisco or Cala di Volpe.',
      gallery: [{ src: '/images/itinerary/italy/destinations/mortorio-island.webp', alt: 'Mortorio' }],
    },
    {
      id: 'mortorio-porto-rotondo',
      routeFrom: 'Mortorio',
      routeTo: 'Porto Rotondo',
      day: 2,
      mapPin: {
        desktop: { left: 68.3, top: 49 },
        mobile: { left: 69.9, top: 58.8 },
      },
      description:
        '4 nm short north to Porto Rotondo — designed 1963 by the Donà delle Rose family, all marble piazzas + bougainvillea villas. Marina di Porto Rotondo stern-to among the most expensive in the Mediterranean (€200-400/night peak). Spiaggia Ira pink-granite cove for swim before mooring.',
      shortDescription:
        '4 nm short N to Porto Rotondo — designed 1963. Marina €200-400/night peak. Spiaggia Ira pink-granite swim before mooring. Spiaggia Ira anchor on sand at 5-7 m as cheaper alternative. Plan to walk the Pietro Cascella Circle of Life sculpture and aperitivo on the Piazzetta marble chessboard.',
      thingsToDo: [
        'Anchor swim at Spiaggia Ira pink-granite cove',
        'Walk the Pietro Cascella Circle of Life sculpture',
        'Aperitivo on the Piazzetta marble chessboard',
        'Boutique browse along Via dei Negozi',
      ],
      mooringTip:
        'Marina di Porto Rotondo stern-to, €200-400/night peak Aug. Spiaggia Ira anchor on sand at 5-7 m as cheaper alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-rotondo.webp', alt: 'Porto Rotondo' }],
    },
    {
      id: 'porto-rotondo-golfo-aranci',
      routeFrom: 'Porto Rotondo',
      routeTo: 'Golfo Aranci',
      day: 3,
      mapPin: {
        desktop: { left: 71.3, top: 55.1 },
        mobile: { left: 75.8, top: 62.3 },
      },
      description:
        '6 nm east to Golfo Aranci — small Costa Smeralda port at the NE tip of Sardinia. Marina di Golfo Aranci stern-to, fully sheltered. Secca di Capo Figari underwater mountain 1 nm east is the headline dive site. Pre-book in peak August. Plan to sunset cocktails at Rosa dei Venti and lobster linguine at Ristorante Da Paolo.',
      shortDescription:
        '6 nm E to Golfo Aranci NE tip. Marina di Golfo Aranci fully sheltered. Secca di Capo Figari underwater mountain 1 nm E for dive.',
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
      id: 'golfo-aranci-olbia',
      routeFrom: 'Golfo Aranci',
      routeTo: 'Olbia',
      day: 4,
      mapPin: {
        desktop: { left: 74.1, top: 64.2 },
        mobile: { left: 84.4, top: 71.7 },
      },
      description:
        '8 nm south to Olbia. Olbia Marina stern-to with full services, fuel berth. Walk to the historic Phoenician/Roman archaeological museum and the medieval Basilica di San Simplicio. Cycle to Pittulongu Beach (sand, sheltered from N) for evening swim. Refuel at the entrance fuel berth. Plan to porceddu suckling pig at Mercato San Paolo.',
      shortDescription:
        '8 nm S to Olbia Marina. Full services, fuel berth. Walk Phoenician/Roman archaeological museum + medieval San Simplicio basilica. Cycle to Pittulongu Beach. Highlights: Visit Olbia Phoenician/Roman archaeological museum and Walk medieval Basilica di San Simplicio.',
      thingsToDo: [
        'Visit Olbia Phoenician/Roman archaeological museum',
        'Walk medieval Basilica di San Simplicio',
        'Cycle to Pittulongu Beach (sand, sheltered)',
        'Porceddu suckling pig at Mercato San Paolo',
      ],
      mooringTip: 'Olbia Marina stern-to with lazy lines, €100-150/night peak. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/italy/destinations/olbia.webp', alt: 'Olbia' }],
    },
    {
      id: 'olbia-porto-san-paolo',
      routeFrom: 'Olbia',
      routeTo: 'Porto San Paolo',
      day: 5,
      mapPin: {
        desktop: { left: 68.5, top: 71.8 },
        mobile: { left: 80.4, top: 85.1 },
      },
      description:
        '12 nm south to Porto San Paolo — small fishing village opposite Tavolara. Cala Girgolu seagrass-meadow anchorage on the way for snorkel. Climb to Monte Coda Cavallo viewpoint for the panorama back across to Tavolara. Porto San Paolo small marina stern-to, €60-90/night, sheltered from N. Plan to bottarga shaved over pasta at a quay trattoria and visit a working bottarga workshop.',
      shortDescription:
        '12 nm S to Porto San Paolo — opposite Tavolara islet. Cala Girgolu seagrass snorkel on way. Climb Monte Coda Cavallo for Tavolara panorama. Highlights: Snorkel Cala Girgolu seagrass meadows and Climb to Monte Coda Cavallo viewpoint.',
      thingsToDo: [
        'Snorkel Cala Girgolu seagrass meadows',
        'Climb to Monte Coda Cavallo viewpoint',
        'Bottarga shaved over pasta at a quay trattoria',
        'Visit a working bottarga workshop',
      ],
      mooringTip:
        'Porto San Paolo small marina stern-to, €60-90/night, sheltered from N. Anchor in Cala Girgolu on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/porto-san-paolo.webp', alt: 'Porto San Paolo' }],
    },
    {
      id: 'porto-san-paolo-molara-island',
      routeFrom: 'Porto San Paolo',
      routeTo: 'Molara Island',
      day: 6,
      mapPin: {
        desktop: { left: 75.4, top: 81.6 },
        mobile: { left: 93.6, top: 95.8 },
      },
      description:
        '4 nm short east to Molara — uninhabited granite island east of Tavolara, Neolithic ruins, wild goats. Cala Spagnola on the south coast for swim. Day-stop only — no overnight, return to Tavolara or Porto San Paolo. Free anchoring on sand at 4-6 m, sheltered from N. Plan to picnic on pane carasau crisp Sardinian flatbread and snorkel the granite shoreline.',
      shortDescription:
        '4 nm short E to Molara — uninhabited, Neolithic ruins. Cala Spagnola south swim. Day-stop only; overnight at Tavolara or Porto San Paolo. Free anchoring on sand at 4-6 m, sheltered from N. Plan to picnic on pane carasau crisp Sardinian flatbread and snorkel the granite shoreline.',
      thingsToDo: [
        'Kayak swim at Cala Spagnola south coast',
        'Picnic on pane carasau crisp Sardinian flatbread',
        'Hike to the Neolithic ruins',
        'Snorkel the granite shoreline',
      ],
      mooringTip:
        'Free anchoring on sand at 4-6 m, sheltered from N. Day-stop only — return to Porto San Paolo or Spalmatore (Tavolara) for overnight.',
      gallery: [{ src: '/images/itinerary/italy/destinations/molara-island.webp', alt: 'Molara Island' }],
    },
    {
      id: 'molara-tavolara-portisco',
      routeFrom: 'Molara',
      routeTo: 'Portisco',
      day: 7,
      mapPin: {
        desktop: { left: 75.5, top: 74 },
        mobile: { left: 92.7, top: 78.2 },
      },
      description:
        '15 nm north back to Portisco. Optional swim stop at Spalmatore di Terra (Tavolara) and Secca del Papa coral garden snorkel on the way. Refuel at Marina di Portisco before tying up. Refuel at the entrance fuel berth. Plan to mirto liqueur tasting at La Sorgente.',
      shortDescription:
        '15 nm N back to Portisco. Optional Spalmatore + Secca del Papa coral garden snorkel on way. Refuel at Marina di Portisco before mooring. Refuel at the entrance fuel berth. Plan to mirto liqueur tasting at La Sorgente.',
      thingsToDo: [
        'Optional Spalmatore (Tavolara) swim stop',
        'Snorkel Secca del Papa coral garden',
        'Mirto liqueur tasting at La Sorgente',
        'Refuel and clean the boat at Marina di Portisco',
      ],
      mooringTip:
        'Marina di Portisco stern-to with lazy lines, €120-200/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/italy/destinations/tavolara-island.webp', alt: 'Tavolara' }],
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

export default computeItineraryNumberOfDays(portiscoRoute);
