import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const palmaDeMallorcaRoute: ItineraryRoute = {
  metaTitle: 'Palma de Mallorca Yacht Charter Route | Balearic Sailing from Palma',
  metaDesc:
    "Sail a 7-day yacht charter from Palma via El Toro, Sóller, Pollença, Alcúdia, Colonia de Sant Pere, Porto Cristo and Ca'n Pastilla — Mallorca grand-loop circumnavigation.",
  id: 'palma-de-mallorca',
  startingPoint: 'Palma de Mallorca',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/spain/mallorca-itinerary/routes/palma-de-mallorca.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/palma-de-mallorca-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/mallorca-town-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/mallorca-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/mallorca-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'palma-de-mallorca-el-toro',
      routeFrom: 'Palma de Mallorca',
      routeTo: 'El Toro',
      day: 1,
      mapPin: {
        desktop: { left: 16.2, top: 52.5 },
        mobile: { left: 26.7, top: 46.6 },
      },
      description:
        '8 nm shake-down southwest from Real Club Náutico de Palma to El Toro. Mallorca summer wind regime is the embat (sea breeze from S/SW) at 8-15 kn. El Toro small marina + sheltered bay between Mallorca mainland and the Sa Dragonera islet 4 nm west. Cala Caragol on sand 4-6 m for swim.',
      shortDescription:
        '8 nm shake-down SW from Real Club Náutico de Palma to El Toro. Embat S/SW sea breeze 8-15 kn. El Toro small marina + Sa Dragonera 4 nm W. Cala Caragol swim.',
      thingsToDo: [
        'Anchor swim at Cala Caragol sand cove',
        'Day-trip to Sa Dragonera natural park (4 nm W)',
        'Arròs brut Mallorcan stew at a chiringuito',
        'Walk Port Adriano luxury marina (next bay E)',
      ],
      mooringTip:
        'Port Adriano stern-to, €150-250/night peak (luxury marina). El Toro small marina €100-160/night cheaper alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/el-toro-mallorca.webp', alt: 'El Toro' }],
    },
    {
      id: 'el-toro-port-de-soller',
      routeFrom: 'El Toro',
      routeTo: 'Port de Sóller',
      day: 2,
      mapPin: {
        desktop: { left: 10.3, top: 59.5 },
        mobile: { left: 15.6, top: 50.4 },
      },
      description:
        '32 nm long northwest along the Serra de Tramuntana cliff coast to Port de Sóller. The Tramuntana mountains run 90 km NE-SW, peaks over 1400 m falling straight to sea — the most dramatic coastline in the Balearics. Port de Sóller horseshoe bay sheltered from any direction. Wooden 1912 tram from the port up to Sóller town.',
      shortDescription:
        '32 nm long NW along Tramuntana cliff coast (UNESCO listed). Port de Sóller horseshoe bay sheltered any direction. 1912 wooden tram up to Sóller town.',
      thingsToDo: [
        'Ride the 1912 wooden tram up to Sóller town',
        'Hike to Sa Foradada cliff with natural-window viewpoint',
        'Llampuga local fish at Sa Cova',
        'Walk Sóller cobbled plaza of orange trees',
      ],
      mooringTip:
        'Marina di Port de Sóller stern-to, €120-180/night peak, fully sheltered. Anchor in the bay outside on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/port-de-soller.webp', alt: 'Port de Sóller' }],
    },
    {
      id: 'port-de-soller-port-de-pollenca',
      routeFrom: 'Port de Sóller',
      routeTo: 'Port de Pollença',
      day: 3,
      mapPin: {
        desktop: { left: 14.9, top: 38.4 },
        mobile: { left: 18.4, top: 39 },
      },
      description:
        '32 nm long northeast around Cap de Formentor (the spectacular northeast tip, limestone cliffs 384 m straight from sea, Mallorca\'s "meeting of the winds"). Port de Pollença harbour stern-to. Platja de Formentor (silk-white sand, pine-fringed) for swim before mooring. Port de Pollença marina stern-to, €100-160/night peak, sheltered from N. Cap de Formentor anchorage on rocky bottom — daytime only. Plan to anchor swim at Platja de Formentor (silk-white sand), cycle the Pine Walk under century-old trees, almond horchata at a cliff-top café.',
      shortDescription:
        '32 nm long NE around Cap de Formentor (384 m cliffs, "meeting of the winds"). Port de Pollença harbour. Platja de Formentor silk-white sand swim.',
      thingsToDo: [
        'Anchor swim at Platja de Formentor (silk-white sand)',
        'Cycle the Pine Walk under century-old trees',
        'Almond horchata at a cliff-top café',
        'Suckling pig at Stay Restaurant (almond-wood roast)',
      ],
      mooringTip:
        'Port de Pollença marina stern-to, €100-160/night peak, sheltered from N. Cap de Formentor anchorage on rocky bottom — daytime only.',
      gallery: [{ src: '/images/itinerary/spain/destinations/port-de-pollenca.webp', alt: 'Port de Pollença' }],
    },
    {
      id: 'port-de-pollenca-alcudia',
      routeFrom: 'Port de Pollença',
      routeTo: 'Alcúdia',
      day: 4,
      mapPin: {
        desktop: { left: 36.3, top: 22.2 },
        mobile: { left: 36.5, top: 30.5 },
      },
      description:
        "6 nm short hop east to Alcúdia — Roman Pollentia (1st-c BC, the Roman capital of Mallorca, ruins still visible). Medieval walls of the old town (14th-c, restored). Port d'Alcúdia stern-to. Tuesday market in the old town plaza is the headline shore activity.",
      shortDescription:
        "6 nm short hop E to Alcúdia. Roman Pollentia 1st-c BC ruins + 14th-c medieval walls. Tuesday market in old-town plaza is headline. Port d'Alcúdia stern-to with lazy lines, €100-160/night peak, fully sheltered; Plenty of capacity.",
      thingsToDo: [
        'Walk the 14th-c medieval town walls',
        'Visit the Roman Pollentia 1st-c BC ruins',
        'Tuesday market in old-town plaza',
        'Tumbet vegetable layered pie at a courtyard taverna',
      ],
      mooringTip: "Port d'Alcúdia stern-to with lazy lines, €100-160/night peak, fully sheltered. Plenty of capacity.",
      gallery: [{ src: '/images/itinerary/spain/destinations/alcudia.webp', alt: 'Alcúdia' }],
    },
    {
      id: 'alcudia-colonia-de-sant-pere',
      routeFrom: 'Alcúdia',
      routeTo: 'Colonia de Sant Pere',
      day: 5,
      mapPin: {
        desktop: { left: 40.2, top: 28.6 },
        mobile: { left: 49.2, top: 37.3 },
      },
      description:
        '8 nm east to Colonia de Sant Pere — quiet Mallorcan east-coast village, Artà peninsula behind. Cala Mitjana (boat-only access) for swim. Caldereta de langosta lobster stew at Sa Sinia is the local institution. Colonia de Sant Pere small marina stern-to, €70-110/night, sheltered from N. Anchor in Cala Mitjana on sand at 4-6 m as alternative.',
      shortDescription:
        '8 nm E to Colonia de Sant Pere — quiet east-coast village. Cala Mitjana boat-only swim. Caldereta de langosta at Sa Sinia local institution. Colonia de Sant Pere small marina stern-to, €70-110/night, sheltered from N. Plan to anchor swim at Cala Mitjana (boat-only) and hike Artà Peninsula trail for Badia d\\.',
      thingsToDo: [
        'Anchor swim at Cala Mitjana (boat-only)',
        "Hike Artà Peninsula trail for Badia d'Alcúdia panorama",
        'Caldereta de langosta lobster stew at Sa Sinia',
        'Walk village seafront at sunset',
      ],
      mooringTip:
        'Colonia de Sant Pere small marina stern-to, €70-110/night, sheltered from N. Anchor in Cala Mitjana on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/colonia-de-sant-pere.webp', alt: 'Colonia de Sant Pere' }],
    },
    {
      id: 'colonia-de-sant-pere-porto-cristo',
      routeFrom: 'Colonia de Sant Pere',
      routeTo: 'Porto Cristo',
      day: 6,
      mapPin: {
        desktop: { left: 50.3, top: 55 },
        mobile: { left: 48.5, top: 52.7 },
      },
      description:
        '15 nm south to Porto Cristo — east-coast horseshoe harbour. Coves del Drac (limestone caves with underground river, 4 km of explored chambers, classical-music quartet plays in the cathedral chamber) is the headline shore activity. Cala Anguila for swim. Plan to the Coves del Drac (4 km cave network), anchor swim at Cala Anguila, walk to Cala Manacor old fishing village.',
      shortDescription:
        '15 nm S to Porto Cristo — east-coast horseshoe harbour. Coves del Drac (4 km caves with underground river + classical music in cathedral chamber).',
      thingsToDo: [
        'Visit the Coves del Drac (4 km cave network)',
        'Anchor swim at Cala Anguila',
        'Walk to Cala Manacor old fishing village',
        'Sobrassada spicy sausage at Celler Sa Premsa',
      ],
      mooringTip:
        'Porto Cristo stern-to, €80-130/night peak, sheltered from N. Anchor in Cala Anguila on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/porto-cristo.webp', alt: 'Porto Cristo' }],
    },
    {
      id: 'porto-cristo-can-pastilla-palma',
      routeFrom: 'Porto Cristo',
      routeTo: "Ca'n Pastilla",
      day: 7,
      mapPin: {
        desktop: { left: 22.4, top: 59.4 },
        mobile: { left: 30.3, top: 57.5 },
      },
      description:
        "32 nm long west back to Palma via Ca'n Pastilla swim stop (Platja de Palma long sand, sheltered from S). Refuel at Real Club Náutico de Palma before tying up. Standard 14:00 marina arrival for handover-prep evening. Real Club Náutico de Palma stern-to, €150-250/night peak. Plan to optional Cala Vinyes swim stop.",
      shortDescription:
        "32 nm long W back to Palma via Ca'n Pastilla. Platja de Palma long sand swim. Refuel at Real Club Náutico before mooring. Real Club Náutico de Palma stern-to, €150-250/night peak. Plan to optional Cala Vinyes swim stop.",
      thingsToDo: [
        'Optional Cala Vinyes swim stop',
        "Walk Platja de Palma long sand at Ca'n Pastilla",
        'Refuel and clean the boat at Real Club Náutico',
        "Ensaimada pastry at Ca'n Joan de S'Aigo (1700)",
      ],
      mooringTip:
        'Real Club Náutico de Palma stern-to, €150-250/night peak. Marina Port de Mallorca alternative at €120-200/night. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/spain/destinations/can-pastilla.webp', alt: "Ca'n Pastilla" }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/map.webp',
        alt: 'Palma de Mallorca Route Image',
      },
      width: 1838,
      height: 1286,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/mobile-map.webp',
        alt: 'Palma de Mallorca Route Image',
      },
      width: 1312,
      height: 1358,
    },
  },
};

export default computeItineraryNumberOfDays(palmaDeMallorcaRoute);
