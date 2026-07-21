import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const ciutadellaRoute: ItineraryRoute = {
  metaTitle: 'Ciutadella Yacht Charter Route | Menorca Sailing',
  metaDesc:
    "Sail a 7-day yacht charter from Ciutadella through Cala en Bosch, Son Saura, Cala Galdana, Son Bou, Cala en Porter, Mahón and Port d'Addaia — Menorca circumnavigation.",
  id: 'ciutadella',
  startingPoint: 'Ciutadella',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/spain/mallorca-itinerary/routes/ciutadella.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/ciutadella-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/ciutadella-south-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/saura-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/galdana-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'ciutadella-cala-en-bosch',
      routeFrom: 'Ciutadella',
      routeTo: 'Cala en Bosch',
      day: 1,
      mapPin: {
        desktop: { left: 72.5, top: 12.4 },
        mobile: { left: 73.8, top: 20.7 },
      },
      description:
        "6 nm shake-down south from Ciutadella harbour to Cala en Bosch — pine-fringed sand cove. Menorca is UNESCO Biosphere Reserve since 1993, planning controls keep large resort development off the coast. 18th-c Torre d'en Quart British colonial watchtower above the cove.",
      shortDescription:
        "6 nm shake-down S from Ciutadella to Cala en Bosch pine-fringed sand cove. Menorca = UNESCO Biosphere Reserve 1993. 18th-c Torre d'en Quart watchtower. Cala en Bosch marina stern-to, €70-110/night peak, sheltered from N. Plan to anchor swim at Cala en Bosch sand cove and walk to the watchtower at sunset.",
      thingsToDo: [
        'Anchor swim at Cala en Bosch sand cove',
        "Walk to the 18th-c Torre d'en Quart watchtower",
        "Caldereta de langosta lobster stew at S'Amarador",
        'Tasting Vi de la Terra Menorca local wine',
      ],
      mooringTip:
        'Cala en Bosch marina stern-to, €70-110/night peak, sheltered from N. Anchor in the cove on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-en-bosch.webp', alt: 'Cala en Bosch' }],
    },
    {
      id: 'cala-en-bosch-son-saura',
      routeFrom: 'Cala en Bosch',
      routeTo: 'Son Saura',
      day: 2,
      mapPin: {
        desktop: { left: 72.8, top: 19.5 },
        mobile: { left: 71.2, top: 27.6 },
      },
      description:
        '4 nm short east to Son Saura — twin sand beaches (Es Talaier + Cala en Turqueta), boat-only access from sea side, Camí de Cavalls horse-trail access from land. Anchor in the bay on sand 4-6 m, posidonia-zone restrictions apply (designated buoys only July-August).',
      shortDescription:
        '4 nm short E to Son Saura twin beaches. Boat-only from sea side; Camí de Cavalls from land. Posidonia-zone buoys only Jul-Aug. Posidonia-zone buoys at Son Saura, €40-60/night peak, pre-book online via Govern Balear. Plan to anchor swim at Es Talaier + Cala en Turqueta and hike Camí de Cavalls horse-trail section.',
      thingsToDo: [
        'Anchor swim at Es Talaier + Cala en Turqueta',
        'Hike Camí de Cavalls horse-trail section',
        'Visit Bronze Age Talaiot de Son Catlar',
        'Formatjades sweet cheese pastries on a carob bench',
      ],
      mooringTip:
        'Posidonia-zone buoys at Son Saura, €40-60/night peak, pre-book online via Govern Balear. Anchoring on sand outside zones permitted Sep-Jun.',
      gallery: [{ src: '/images/itinerary/spain/destinations/son-saura.webp', alt: 'Son Saura' }],
    },
    {
      id: 'son-saura-cala-galdana',
      routeFrom: 'Son Saura',
      routeTo: 'Cala Galdana',
      day: 3,
      mapPin: {
        desktop: { left: 75.8, top: 20.8 },
        mobile: { left: 74.2, top: 29.1 },
      },
      description:
        '6 nm east to Cala Galdana — horseshoe bay with limestone cliffs, the most-photographed cove on Menorca. Cala Macarella (boat-only) 1 nm east is the headline swim anchorage. Camí de Cavalls trail climbs the cliff for the panorama. Cala Galdana marina stern-to, €100-160/night peak, sheltered from N. Cala Macarella day-anchor on sand at 4-6 m, no overnight (posidonia zone). Plan to anchor swim at Cala Macarella (boat-only), hike Camí de Cavalls cliff path, arròs de peix at Es Bruc cliff-top.',
      shortDescription:
        '6 nm E to Cala Galdana horseshoe bay — most-photographed cove on Menorca. Cala Macarella 1 nm E (boat-only) is headline swim. Camí de Cavalls cliff trail.',
      thingsToDo: [
        'Anchor swim at Cala Macarella (boat-only)',
        'Hike Camí de Cavalls cliff path',
        'Arròs de peix at Es Bruc cliff-top',
        'Day-trip horseback ride along cliff trail',
      ],
      mooringTip:
        'Cala Galdana marina stern-to, €100-160/night peak, sheltered from N. Cala Macarella day-anchor on sand at 4-6 m, no overnight (posidonia zone).',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-galdana.webp', alt: 'Cala Galdana' }],
    },
    {
      id: 'cala-galdana-son-bou',
      routeFrom: 'Cala Galdana',
      routeTo: 'Son Bou',
      day: 4,
      mapPin: {
        desktop: { left: 79.5, top: 20.1 },
        mobile: { left: 78.8, top: 31.6 },
      },
      description:
        "5 nm short east to Son Bou — Menorca's longest sand beach (2 km, dunes inland). 5th-c Basilica de Son Bou ruins half-buried in wildflowers near the western end. Albufera des Grau wetlands 4 nm north for flamingo spotting. Anchor off Son Bou on sand at 5-7 m, sheltered from N. No marina at the beach. Cala Galdana 5 nm west is the alternative for paid mooring. Plan to anchor swim at Son Bou 2-km sand beach, walk to the 5th-c Basilica de Son Bou ruins, day-trip to Albufera des Grau flamingo wetland.",
      shortDescription:
        '5 nm short E to Son Bou — Menorca longest sand (2 km). 5th-c Basilica de Son Bou ruins. Albufera des Grau wetlands 4 nm N for flamingos.',
      thingsToDo: [
        'Anchor swim at Son Bou 2-km sand beach',
        'Walk to the 5th-c Basilica de Son Bou ruins',
        'Day-trip to Albufera des Grau flamingo wetland',
        'Olíaigua tomato-pepper stew at Sa Paissa',
      ],
      mooringTip:
        'Anchor off Son Bou on sand at 5-7 m, sheltered from N. No marina at the beach. Cala Galdana 5 nm west is the alternative for paid mooring.',
      gallery: [{ src: '/images/itinerary/spain/destinations/son-bou.webp', alt: 'Son Bou' }],
    },
    {
      id: 'son-bou-cala-en-porter',
      routeFrom: 'Son Bou',
      routeTo: 'Cala en Porter',
      day: 5,
      mapPin: {
        desktop: { left: 85.7, top: 24.1 },
        mobile: { left: 87, top: 31.5 },
      },
      description:
        "5 nm short east to Cala en Porter — limestone-cliff cove, the famous Cova d'en Xoroi cliffside cave bar (carved into the cliff face 30 m above the sea, opens at sunset, DJ from 22:00). Anchor in Cala en Porter on sand 4-6 m.",
      shortDescription:
        "5 nm short E to Cala en Porter — limestone cove. Cova d'en Xoroi cliffside cave bar (30 m above sea, DJ from 22:00). Anchor on sand.",
      thingsToDo: [
        "Sunset cocktails at Cova d'en Xoroi cliff cave bar",
        'Anchor swim at Cala en Porter cliff cove',
        'Squid stuffed with sobrasada at Àmbit farm-to-table',
        'Walk the limestone cliff path to viewpoints',
      ],
      mooringTip: 'Anchor in Cala en Porter on sand at 4-6 m, sheltered from N. No marina at the cove.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-en-porter.webp', alt: 'Cala en Porter' }],
    },
    {
      id: 'cala-en-porter-mao-mahon',
      routeFrom: 'Cala en Porter',
      routeTo: 'Maó-Mahón',
      day: 6,
      mapPin: {
        desktop: { left: 89.5, top: 28.5 },
        mobile: { left: 95, top: 34.7 },
      },
      description:
        '8 nm east to Mahón (Maó) — second-largest natural harbour in the Mediterranean (after Pearl Harbour by water surface area), fjord-like 6 km inlet. Marina di Mahón at the head. Xoriguer Gin Distillery is the headline ashore (gin distilled at Mahón since 1700, British colonial heritage).',
      shortDescription:
        '8 nm E to Mahón — second-largest Med natural harbour (6 km fjord-like inlet). Marina di Mahón at head. Xoriguer Gin Distillery (since 1700, British heritage).',
      thingsToDo: [
        'Tour the Xoriguer Gin Distillery (since 1700)',
        'Pomada gin-lemon punch on the harbour',
        'Negotiate prawns at the Mercat de Peix',
        'Fish stew at Sa Llagosta',
      ],
      mooringTip:
        'Marina di Mahón stern-to, €100-160/night peak, fully sheltered. Cala Padera anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/mahon.webp', alt: 'Maó-Mahón' }],
    },
    {
      id: 'mao-port-d-addaia-ciutadella',
      routeFrom: 'Maó',
      routeTo: "Port d'Addaia",
      day: 7,
      mapPin: {
        desktop: { left: 93.8, top: 16.1 },
        mobile: { left: 90.9, top: 24.4 },
      },
      description:
        "24 nm long west back to Ciutadella via Port d'Addaia salt-flat inlet swim stop + Cala Mesquida swim. Refuel at Ciutadella before tying up. Standard 14:00 marina arrival for handover-prep evening. Ciutadella harbour stern-to, €80-130/night peak. Refuel at the entrance fuel berth. Plan to swim Cala Mesquida sand cove and walk Port d\\.",
      shortDescription:
        "24 nm long W back to Ciutadella via Port d'Addaia salt flats + Cala Mesquida swim. Refuel at Ciutadella before mooring. Ciutadella harbour stern-to, €80-130/night peak.",
      thingsToDo: [
        'Swim Cala Mesquida sand cove',
        "Walk Port d'Addaia salt-flat path",
        'Greixonera cinnamon-spiced custard on Plaça des Born',
        'Refuel and clean the boat at Ciutadella',
      ],
      mooringTip:
        'Ciutadella harbour stern-to, €80-130/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/spain/destinations/puerto-de-addaya.webp', alt: "Port d'Addaia" }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/map.webp',
        alt: 'Ciutadella Route Image',
      },
      width: 1838,
      height: 1286,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/mallorca-itinerary/mobile-map.webp',
        alt: 'Ciutadella Route Image',
      },
      width: 1312,
      height: 1358,
    },
  },
};

export default computeItineraryNumberOfDays(ciutadellaRoute);
