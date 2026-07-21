import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const ciutadellaSouthRoute: ItineraryRoute = {
  metaTitle: 'Ciutadella–South Coast Yacht Charter Route | Menorca Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Ciutadella via Cala Galdana, Cala Ratjada (Mallorca), Colonia de Sant Pere, Alcúdia and Port de Pollença — Menorca + north Mallorca cross-island.',
  id: 'ciutadella-south',
  startingPoint: 'Ciutadella',
  otherPoints: ['South'],
  cardImage: { src: '/images/itinerary/spain/mallorca-itinerary/routes/ciutadella-south.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/ciutadella-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/ciutadella-south-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/saura-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/galdana-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'ciutadella-cala-galdana',
      routeFrom: 'Ciutadella',
      routeTo: 'Cala Galdana',
      day: 1,
      mapPin: {
        desktop: { left: 74.3, top: 15.7 },
        mobile: { left: 73.6, top: 22.7 },
      },
      description:
        '12 nm shake-down south from Ciutadella to Cala Galdana — most-photographed Menorca cove, horseshoe bay with limestone cliffs. Cala Macarella (boat-only) 1 nm east is the headline swim anchorage. Cala Galdana marina stern-to, €100-160/night peak, sheltered from N. Cala Macarella day-anchor on sand at 4-6 m, no overnight (posidonia zone). Plan to anchor swim at Cala Macarella (boat-only), hike Camí de Cavalls cliff path, arròs de la terra rabbit-saffron rice at Es Bruc.',
      shortDescription:
        '12 nm shake-down S to Cala Galdana — most-photographed Menorca cove, limestone-cliff horseshoe. Cala Macarella 1 nm E (boat-only) is headline swim. Highlights: Anchor swim at Cala Macarella (boat-only) and Hike Camí de Cavalls cliff path.',
      thingsToDo: [
        'Anchor swim at Cala Macarella (boat-only)',
        'Hike Camí de Cavalls cliff path',
        'Arròs de la terra rabbit-saffron rice at Es Bruc',
        'Day-trip horseback ride along cliff trail',
      ],
      mooringTip:
        'Cala Galdana marina stern-to, €100-160/night peak, sheltered from N. Cala Macarella day-anchor on sand at 4-6 m, no overnight (posidonia zone).',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-galdana.webp', alt: 'Cala Galdana' }],
    },
    {
      id: 'cala-galdana-cala-ratjada',
      routeFrom: 'Cala Galdana',
      routeTo: 'Cala Ratjada (Mallorca)',
      day: 2,
      mapPin: {
        desktop: { left: 78.7, top: 21.5 },
        mobile: { left: 83.3, top: 28.7 },
      },
      description:
        '32 nm long west to Cala Ratjada on the northeast tip of Mallorca. Long open-water passage across the Menorca-Mallorca channel; check forecast for Tramuntana N wind, can build to 25+ kn in afternoon. Cala Ratjada marina stern-to, fully sheltered. Anchor in Cala Agulla on sand at 4-6 m as alternative.',
      shortDescription:
        '32 nm long W across Menorca-Mallorca channel to Cala Ratjada NE Mallorca. Tramuntana N can build 25+ kn afternoon. Marina fully sheltered. Anchor in Cala Agulla on sand at 4-6 m as alternative.',
      thingsToDo: [
        "Snorkel Coves d'Artà underwater arches",
        'Walk to the 14th-c Capdepera Castle',
        'Llagosta amb sobrasada at Es Mollet',
        'Day-trip to Formentor lookout (taxi)',
      ],
      mooringTip:
        'Cala Ratjada marina stern-to, €100-160/night peak, fully sheltered. Anchor in Cala Agulla on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-ratjada.webp', alt: 'Cala Ratjada' }],
    },
    {
      id: 'cala-ratjada-colonia-de-sant-pere',
      routeFrom: 'Cala Ratjada',
      routeTo: 'Colonia de Sant Pere',
      day: 3,
      mapPin: {
        desktop: { left: 56.1, top: 39.2 },
        mobile: { left: 50.3, top: 36.4 },
      },
      description:
        '15 nm west to Colonia de Sant Pere — quiet Mallorcan east-coast village, dunes meet pine forests. Es Coll Baix pebble cove (boat-only access, limestone-cliff backdrop) is the headline swim. Betlem hilltop village 4 km inland by bike. Colonia de Sant Pere small marina stern-to, €70-110/night, sheltered from N. Anchor in Es Coll Baix on sand at 4-6 m as alternative.',
      shortDescription:
        '15 nm W to Colonia de Sant Pere — quiet east-coast village. Es Coll Baix boat-only pebble cove is headline. Betlem hilltop village 4 km inland.',
      thingsToDo: [
        'Anchor swim at Es Coll Baix (boat-only)',
        'Cycle 4 km inland to Betlem hilltop village',
        "Tumbet vegetable layered pie at Ca'n Bernat",
        'Walk the dune-and-pine seafront',
      ],
      mooringTip:
        'Colonia de Sant Pere small marina stern-to, €70-110/night, sheltered from N. Anchor in Es Coll Baix on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/colonia-de-sant-pere.webp', alt: 'Colonia de Sant Pere' }],
    },
    {
      id: 'colonia-de-sant-pere-alcudia',
      routeFrom: 'Colonia de Sant Pere',
      routeTo: 'Alcúdia',
      day: 4,
      mapPin: {
        desktop: { left: 46.8, top: 39 },
        mobile: { left: 56.7, top: 43.2 },
      },
      description:
        "10 nm west to Alcúdia — Roman Pollentia (1st-c BC) + 14th-c medieval walls. Port d'Alcúdia stern-to. Platja d'Alcúdia long-sand beach for swim before mooring. Ca'n Costa palo-liquor pub (oldest in Mallorca, 1761). Port d'Alcúdia stern-to with lazy lines, €100-160/night peak, fully sheltered. Plenty of capacity.",
      shortDescription:
        "10 nm W to Alcúdia. Roman Pollentia 1st-c BC + 14th-c medieval walls. Port d'Alcúdia stern-to. Ca'n Costa palo pub since 1761 (oldest in Mallorca).",
      thingsToDo: [
        'Walk the 14th-c medieval town walls',
        'Visit the Roman Pollentia 1st-c BC ruins',
        "Palo herbal liqueur at Ca'n Costa (since 1761)",
        "Swim Platja d'Alcúdia long-sand beach",
      ],
      mooringTip: "Port d'Alcúdia stern-to with lazy lines, €100-160/night peak, fully sheltered. Plenty of capacity.",
      gallery: [{ src: '/images/itinerary/spain/destinations/alcudia.webp', alt: 'Alcúdia' }],
    },
    {
      id: 'alcudia-port-de-pollenca',
      routeFrom: 'Alcúdia',
      routeTo: 'Port de Pollença',
      day: 5,
      mapPin: {
        desktop: { left: 37.6, top: 22.1 },
        mobile: { left: 44.2, top: 26.8 },
      },
      description:
        "8 nm short hop north to Port de Pollença — Tramuntana mountain marina, Cap de Formentor headland 4 nm north. Platja de Formentor (silk-white sand, pine fringe) for swim. Boquer Valley hike for Eleonora's falcon spotting. Port de Pollença marina stern-to, €100-160/night peak, sheltered from N.",
      shortDescription:
        '8 nm short hop N to Port de Pollença. Tramuntana mountains. Cap de Formentor 4 nm N. Platja de Formentor swim. Boquer Valley falcon hike.',
      thingsToDo: [
        'Anchor swim at Platja de Formentor silk-white sand',
        "Hike Boquer Valley (Eleonora's falcon spotting)",
        'Lechona suckling pig at Stay Restaurant',
        "Climb to Talaia d'Albercutx watchtower",
      ],
      mooringTip: 'Port de Pollença marina stern-to, €100-160/night peak, sheltered from N.',
      gallery: [{ src: '/images/itinerary/spain/destinations/port-de-pollenca.webp', alt: 'Port de Pollença' }],
    },
    {
      id: 'port-de-pollenca-cala-sant-vicenc',
      routeFrom: 'Port de Pollença',
      routeTo: 'Cala Sant Vicenç',
      day: 6,
      mapPin: {
        desktop: { left: 33.9, top: 21 },
        mobile: { left: 37.4, top: 29.9 },
      },
      description:
        '4 nm short west to Cala Sant Vicenç — trio of bays under the Tramuntana cliffs (Cala Molins, Cala Carbó, Cala Sant Vicenç proper). Sea-tunnel snorkel at Cala Molins is the headline. Anchor in any of the three bays on sand 4-6 m, sheltered from N.',
      shortDescription:
        '4 nm short W to Cala Sant Vicenç — trio of bays under Tramuntana cliffs. Sea-tunnel snorkel at Cala Molins headline. Sand anchorages all three.',
      thingsToDo: [
        'Snorkel the Cala Molins sea tunnel',
        "Climb to Talaia d'Albercutx watchtower",
        'Frit de marisc fried fish at Restaurant Clivia',
        'Walk between the three bays at sunset',
      ],
      mooringTip:
        'Free anchoring in any of three Cala Sant Vicenç bays on sand at 4-6 m, sheltered from N. No marina; provision before arriving.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-sant-vicenc.webp', alt: 'Cala Sant Vicenç' }],
    },
    {
      id: 'cala-sant-vicenc-cala-en-bosch-ciutadella',
      routeFrom: 'Cala Sant Vicenç',
      routeTo: 'Ciutadella',
      day: 7,
      mapPin: {
        desktop: { left: 71.9, top: 22.2 },
        mobile: { left: 77.6, top: 29 },
      },
      description:
        "38 nm long east back across the Mallorca-Menorca channel to Ciutadella via Cala en Bosch. Long open-water passage; check Tramuntana forecast — can build 25+ kn afternoon. Refuel at Ciutadella before tying up. Cap d'Artrutx lighthouse on the southwest corner of Menorca is the navigational marker.",
      shortDescription:
        "38 nm long E across Mallorca-Menorca channel back to Ciutadella. Tramuntana 25+ kn afternoon risk. Cap d'Artrutx lighthouse SW marker. Refuel before mooring. Ciutadella harbour stern-to, €80-130/night peak.",
      thingsToDo: [
        'Anchor swim at Son Xoriguer turquoise',
        "Photograph Cap d'Artrutx lighthouse",
        'Greixonera cinnamon custard on Plaça des Born',
        'Refuel and clean the boat at Ciutadella',
      ],
      mooringTip:
        'Ciutadella harbour stern-to, €80-130/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-en-bosch.webp', alt: 'Cala en Bosch' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/map.webp',
        alt: 'Ciutadella - south Route Image',
      },
      width: 1838,
      height: 1286,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/mobile-map.webp',
        alt: 'Ciutadella - south Route Image',
      },
      width: 1312,
      height: 1358,
    },
  },
};

export default computeItineraryNumberOfDays(ciutadellaSouthRoute);
