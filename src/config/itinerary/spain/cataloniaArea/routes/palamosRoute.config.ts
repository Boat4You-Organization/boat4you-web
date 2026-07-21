import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const palamosRoute: ItineraryRoute = {
  metaTitle: 'Palamós Yacht Charter Route | Costa Brava Sailing',
  metaDesc:
    "Sail a 7-day yacht charter from Palamós through Platja d'Aro, Sant Feliu, Tossa, Lloret, Blanes, Calella and Mataró. Costa Brava south + Maresme coast loop.",
  id: 'palamos',
  startingPoint: 'Palamós',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/spain/catalonia-itinerary/routes/palamos.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/palamos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/calella-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/lloret-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/palamos-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'palamos-platja-daro',
      routeFrom: 'Palamós',
      routeTo: "Platja d'Aro",
      day: 1,
      mapPin: {
        desktop: { left: 89.6, top: 14.9 },
        mobile: { left: 91.4, top: 16.5 },
      },
      description:
        "6 nm short shake-down south from Palamós to Platja d'Aro. Pass Illes Formigues 1 nm offshore (small islets, 1285 AD naval-battle site between Aragonese and French fleets). Marina Port d'Aro stern-to is the standard charter overnight. Marina Port d'Aro stern-to, €80-120/night peak, fully sheltered. Anchor in the bay outside on sand at 5-7 m as alternative. Plan to snorkel Illes Formigues naval-battle site, walk the Cami de Ronda coastal path, suquet de peix fish stew at Villa Mas.",
      shortDescription:
        "6 nm shake-down S from Palamós to Platja d'Aro. Pass Illes Formigues 1 nm offshore (1285 AD naval battle site). Marina Port d'Aro overnight. Anchor in the bay outside on sand at 5-7 m as alternative.",
      thingsToDo: [
        'Snorkel Illes Formigues naval-battle site',
        'Walk the Cami de Ronda coastal path',
        'Suquet de peix fish stew at Villa Mas',
        "Swim Platja d'Aro long sand crescent",
      ],
      mooringTip:
        "Marina Port d'Aro stern-to, €80-120/night peak, fully sheltered. Anchor in the bay outside on sand at 5-7 m as alternative.",
      gallery: [{ src: '/images/itinerary/spain/destinations/platja-daro.webp', alt: "Platja d'Aro" }],
    },
    {
      id: 'platja-daro-sant-feliu-de-guixols',
      routeFrom: "Platja d'Aro",
      routeTo: 'Sant Feliu de Guíxols',
      day: 2,
      mapPin: {
        desktop: { left: 94, top: 8.2 },
        mobile: { left: 97.5, top: 11.4 },
      },
      description:
        '4 nm short south to Sant Feliu de Guíxols — Costa Brava cork-and-Modernisme town, the Monestir de Sant Feliu Benedictine monastery (10th c, rust-red arches) at the centre. Marina del Sant Feliu de Guíxols stern-to. Camí de Ronda coastal path north to Cala Salionç (boat-only access).',
      shortDescription:
        '4 nm short S to Sant Feliu — Costa Brava cork + Modernisme town. 10th-c Benedictine monastery centre. Camí de Ronda N to Cala Salionç.',
      thingsToDo: [
        'Visit the 10th-c Sant Feliu monastery',
        'Kayak to Cala Salionç (boat-only access)',
        'Cremat flaming-rum coffee at Bar Bistrot',
        'Buy cork souvenirs from old-quarter workshops',
      ],
      mooringTip:
        'Marina del Sant Feliu stern-to, €70-110/night peak, sheltered from N. Anchor in Cala Salionç on rocky bottom 5-7 m as alternative.',
      gallery: [
        { src: '/images/itinerary/spain/destinations/sant-feliu-de-guixols.webp', alt: 'Sant Feliu de Guíxols' },
      ],
    },
    {
      id: 'sant-feliu-tossa-de-mar',
      routeFrom: 'Sant Feliu',
      routeTo: 'Tossa de Mar',
      day: 3,
      mapPin: {
        desktop: { left: 87.7, top: 20 },
        mobile: { left: 87.7, top: 20 },
      },
      description:
        '6 nm south to Tossa de Mar — most photographed Costa Brava village, the 12th-century Vila Vella ramparts on the cliff above the harbour (the only fully fortified medieval coastal town in Catalonia). Tossa harbour stern-to small, fills by 16:00.',
      shortDescription:
        '6 nm S to Tossa de Mar — most photographed Costa Brava. 12th-c Vila Vella ramparts (only fully fortified Catalan coastal town). Harbour fills by 16:00.',
      thingsToDo: [
        'Walk the 12th-c Vila Vella medieval ramparts',
        'Anchor swim at Cala Giverola turquoise pool',
        'Mar i muntanya surf-and-turf paella at La Cuina de Can Simón',
        'Sunset on the cliff-top fortifications',
      ],
      mooringTip:
        'Tossa harbour stern-to, €60-100/night, slot fills by 16:00 in peak. Anchor in Cala Giverola on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/tossa-de-mar.webp', alt: 'Tossa de Mar' }],
    },
    {
      id: 'tossa-lloret-de-mar',
      routeFrom: 'Tossa',
      routeTo: 'Lloret de Mar',
      day: 4,
      mapPin: {
        desktop: { left: 84.5, top: 25 },
        mobile: { left: 84.5, top: 25 },
      },
      description:
        '6 nm south to Lloret de Mar — Costa Brava resort scene. Santa Clotilde Renaissance gardens (1919, terraced on the cliff above the sea) is the architectural highlight. Cala Banys (pine-fringed cove, 1 nm south of the village) for swim.',
      shortDescription:
        '6 nm S to Lloret de Mar — Costa Brava resort. Santa Clotilde Renaissance gardens 1919 cliff terraced. Cala Banys pine-fringed swim. Lloret marina stern-to, €70-110/night peak. Plan to jet-ski rental at Lloret central beach and sunset cocktails at Tropics Beach Club.',
      thingsToDo: [
        'Walk Santa Clotilde Renaissance gardens',
        'Anchor swim at Cala Banys pine fringe',
        'Jet-ski rental at Lloret central beach',
        'Sunset cocktails at Tropics Beach Club',
      ],
      mooringTip: 'Lloret marina stern-to, €70-110/night peak. Anchor in Cala Banys on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/lloret-de-mar.webp', alt: 'Lloret de Mar' }],
    },
    {
      id: 'lloret-blanes',
      routeFrom: 'Lloret',
      routeTo: 'Blanes',
      day: 5,
      mapPin: {
        desktop: { left: 79.4, top: 28.4 },
        mobile: { left: 78.5, top: 28.9 },
      },
      description:
        "4 nm short south to Blanes — gateway port to the Costa Brava, where the cliffs end and the Maresme sand coast begins. Marimurtra Botanical Garden 1928 (cliff cactus + Mediterranean flora over the sea). Coves d'Ànfores rock arches for snorkel.",
      shortDescription:
        "4 nm short S to Blanes — Costa Brava gateway port. Marimurtra Botanical Garden 1928 cliff cactus. Coves d'Ànfores arches snorkel. Port de Blanes stern-to, €60-100/night, sheltered from N. Plan to visit the Jardí Botànic Marimurtra (1928).",
      thingsToDo: [
        'Visit the Jardí Botànic Marimurtra (1928)',
        "Snorkel Coves d'Ànfores rock arches",
        'Esqueixada salt-cod salad at El Trull',
        'Walk Sa Palomera rock viewpoint',
      ],
      mooringTip:
        'Port de Blanes stern-to, €60-100/night, sheltered from N. Anchor in Cala Sant Francesc on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/blanes.webp', alt: 'Blanes' }],
    },
    {
      id: 'blanes-calella',
      routeFrom: 'Blanes',
      routeTo: 'Calella',
      day: 6,
      mapPin: {
        desktop: { left: 74.8, top: 35.8 },
        mobile: { left: 75.6, top: 33.9 },
      },
      description:
        '8 nm south to Calella on the Maresme coast. Far de Calella 19th-c lighthouse on the headland; Camí de Ronda coastal path winds up to the lighthouse. Cala Sant Francesc (boat-only access) on the way for swim. Port de Calella stern-to, €50-80/night, sheltered from N. Anchor in Cala Sant Francesc on sand at 4-6 m as alternative. Plan to hike Camí de Ronda to the 19th-c Far de Calella, anchor swim at Cala Sant Francesc (boat-only), pa amb tomàquet bread at a quay bar.',
      shortDescription:
        '8 nm S to Calella Maresme. Far de Calella 19th-c lighthouse on headland. Camí de Ronda coastal path. Cala Sant Francesc boat-only swim on way.',
      thingsToDo: [
        'Hike Camí de Ronda to the 19th-c Far de Calella',
        'Anchor swim at Cala Sant Francesc (boat-only)',
        'Pa amb tomàquet bread at a quay bar',
        'Sardana folk dance at evening promenade',
      ],
      mooringTip:
        'Port de Calella stern-to, €50-80/night, sheltered from N. Anchor in Cala Sant Francesc on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/calella.webp', alt: 'Calella' }],
    },
    {
      id: 'calella-mataro-palamos',
      routeFrom: 'Calella',
      routeTo: 'Mataró',
      day: 7,
      mapPin: {
        desktop: { left: 68.5, top: 39.7 },
        mobile: { left: 68.7, top: 38.1 },
      },
      description:
        '24 nm long north back to Palamós via Mataró swim stop (Cala Sant Simó on south side). Refuel at Marina Palamós before tying up. The Palamós lighthouse blinks awake at sunset for the last-evening photo. Refuel at the entrance fuel berth. Plan to optional Mataró Cala Sant Simó swim stop and last-night dinner on the Palamós quay.',
      shortDescription:
        '24 nm long N back to Palamós via Mataró swim. Refuel at Marina Palamós before mooring. Palamós lighthouse for sunset photo. Highlights: Optional Mataró Cala Sant Simó swim stop and Photograph the Palamós lighthouse at sunset.',
      thingsToDo: [
        'Optional Mataró Cala Sant Simó swim stop',
        'Photograph the Palamós lighthouse at sunset',
        'Refuel and clean the boat at Marina Palamós',
        'Last-night dinner on the Palamós quay',
      ],
      mooringTip:
        'Marina Palamós stern-to with lazy lines, €80-120/night peak, sheltered from N. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/spain/destinations/mataro.webp', alt: 'Mataró' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/map.webp',
        alt: 'Palamos Route Image',
      },
      width: 2462,
      height: 1340,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/mobile-map.webp',
        alt: 'Palamos Route Image',
      },
      width: 1654,
      height: 1346,
    },
  },
};

export default computeItineraryNumberOfDays(palamosRoute);
