import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sitgesRoute: ItineraryRoute = {
  metaTitle: 'Sitges Yacht Charter Route | Costa Brava Sailing from Barcelona',
  metaDesc:
    'Sail a 7-day yacht charter from Sitges through Garraf, Castelldefels, Barcelona, Badalona, El Masnou and Mataró — south Catalan coast loop with Maresme coastline.',
  id: 'sitges',
  startingPoint: 'Sitges',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/spain/catalonia-itinerary/routes/sitges.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/barcelona-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/badalona-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/mataro-sailing-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/barcelona-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'sitges-garraf',
      routeFrom: 'Sitges',
      routeTo: 'Garraf',
      day: 1,
      mapPin: {
        desktop: { left: 30.9, top: 81.1 },
        mobile: { left: 22.6, top: 70.5 },
      },
      description:
        '4 nm short shake-down west from Port Aiguadolç de Sitges to Garraf — small fishing harbour at the foot of the Garraf Natural Park (limestone cliffs 590 m above the sea). Quick first day allows full afternoon for park hiking and modernist 19th-c bodega visit.',
      shortDescription:
        '4 nm shake-down W from Sitges to Garraf — small fishing harbour at foot of Garraf Park (590 m limestone cliffs). Quick day for park hiking + bodega.',
      thingsToDo: [
        'Hike the Garraf Park limestone trail',
        'Visit a 19th-c modernist bodega ashore',
        'Suquet de peix at Can Toni',
        'Walk to the small village marina',
      ],
      mooringTip:
        'Garraf small marina stern-to, €60-90/night, sheltered from N. Port Aiguadolç de Sitges 4 nm east is the larger alternative for full services.',
      gallery: [{ src: '/images/itinerary/spain/destinations/garraf.webp', alt: 'Garraf' }],
    },
    {
      id: 'garraf-castelldefels',
      routeFrom: 'Garraf',
      routeTo: 'Castelldefels',
      day: 2,
      mapPin: {
        desktop: { left: 37.4, top: 80.7 },
        mobile: { left: 29.2, top: 70.4 },
      },
      description:
        '6 nm east to Castelldefels. Pass the Delta del Llobregat (flamingo-bird wetland reserve, 22 km southwest of Barcelona). Castelldefels long sand beach + 10th-century Castell de Fels on the hill above the village. Port Ginesta marina stern-to, €70-110/night peak, fully sheltered. Plenty of capacity. Plan to walk to the 10th-c Castell de Fels, beach lunch at Platja de Castelldefels long sand, spot flamingos at Llobregat Delta wetland.',
      shortDescription:
        '6 nm E to Castelldefels via Llobregat Delta flamingo reserve. Long sand beach + 10th-c Castell de Fels on hill above. Port Ginesta marina stern-to, €70-110/night peak, fully sheltered. Plan to arròs negre squid-ink rice at Restaurant Voramar.',
      thingsToDo: [
        'Walk to the 10th-c Castell de Fels',
        'Beach lunch at Platja de Castelldefels long sand',
        'Spot flamingos at Llobregat Delta wetland',
        'Arròs negre squid-ink rice at Restaurant Voramar',
      ],
      mooringTip: 'Port Ginesta marina stern-to, €70-110/night peak, fully sheltered. Plenty of capacity.',
      gallery: [{ src: '/images/itinerary/spain/destinations/castelldefels.webp', alt: 'Castelldefels' }],
    },
    {
      id: 'castelldefels-barcelona',
      routeFrom: 'Castelldefels',
      routeTo: 'Barcelona',
      day: 3,
      mapPin: {
        desktop: { left: 42.1, top: 78.1 },
        mobile: { left: 34.6, top: 66.7 },
      },
      description:
        '8 nm east to Barcelona. Port Vell or Port Olímpic for stern-to overnight. Walk the Gothic Quarter, Sagrada Família + Casa Batlló by Gaudí (UNESCO). Frank Gehry golden fish sculpture at Port Olímpic for the photograph. Port Vell stern-to, €120-200/night peak. Port Olímpic alternative at €100-160/night. Pre-book in peak. Plan to walk the Gothic Quarter cobbled lanes, visit Gaudí UNESCO Sagrada Família + Casa Batlló, bombas potato croquettes at La Cova Fumada (1944).',
      shortDescription:
        '8 nm E to Barcelona. Port Vell or Olímpic stern-to. Gaudí UNESCO sites + Gothic Quarter. Gehry golden fish at Port Olímpic. Port Vell stern-to, €120-200/night peak. Plan to bombas potato croquettes at La Cova Fumada (1944) and sunset cocktails at Eclipse rooftop bar.',
      thingsToDo: [
        'Walk the Gothic Quarter cobbled lanes',
        'Visit Gaudí UNESCO Sagrada Família + Casa Batlló',
        'Bombas potato croquettes at La Cova Fumada (1944)',
        'Sunset cocktails at Eclipse rooftop bar',
      ],
      mooringTip:
        'Port Vell stern-to, €120-200/night peak. Port Olímpic alternative at €100-160/night. Pre-book in peak.',
      gallery: [{ src: '/images/itinerary/spain/destinations/barcelona.webp', alt: 'Barcelona' }],
    },
    {
      id: 'barcelona-badalona',
      routeFrom: 'Barcelona',
      routeTo: 'Badalona',
      day: 4,
      mapPin: {
        desktop: { left: 45.6, top: 64.9 },
        mobile: { left: 37.2, top: 61.4 },
      },
      description:
        '5 nm short hop north to Badalona — Roman heritage suburb of Barcelona, Pont del Petroli iron pier (former oil-tanker dock, now a swim platform). Marina di Badalona stern-to, fully sheltered. Roman Baths Museum in the old town. Plenty of capacity. Plan to swim off the Pont del Petroli iron pier and mercat Municipal seafood haggling.',
      shortDescription:
        '5 nm short hop N to Badalona — Roman heritage. Pont del Petroli iron pier swim platform. Marina di Badalona fully sheltered. Plenty of capacity. Plan to swim off the Pont del Petroli iron pier and visit the Roman Baths Museum.',
      thingsToDo: [
        'Swim off the Pont del Petroli iron pier',
        'Visit the Roman Baths Museum',
        'Mercat Municipal seafood haggling',
        'Esqueixada salt-cod salad at Can Xim',
      ],
      mooringTip:
        'Marina di Badalona stern-to with lazy lines, €70-110/night peak, fully sheltered. Plenty of capacity.',
      gallery: [{ src: '/images/itinerary/spain/destinations/badalona.webp', alt: 'Badalona' }],
    },
    {
      id: 'badalona-el-masnou',
      routeFrom: 'Badalona',
      routeTo: 'El Masnou',
      day: 5,
      mapPin: {
        desktop: { left: 50.3, top: 55.3 },
        mobile: { left: 41.9, top: 54.2 },
      },
      description:
        '5 nm short hop north to El Masnou. Marina del Masnou stern-to, fully sheltered. Cami de Ronda coastal path runs north to Premià de Mar — pine-clad cliffs + small swim coves on the way. Plan to walk the Cami de Ronda coastal path to Premià, snorkel the Illes Costes rocky islets, fideuà seafood noodles at El Racó de la Mar.',
      shortDescription:
        '5 nm short hop N to El Masnou. Marina del Masnou fully sheltered. Cami de Ronda coastal path N to Premià de Mar. Highlights: Walk the Cami de Ronda coastal path to Premià and Snorkel the Illes Costes rocky islets.',
      thingsToDo: [
        'Walk the Cami de Ronda coastal path to Premià',
        'Snorkel the Illes Costes rocky islets',
        'Fideuà seafood noodles at El Racó de la Mar',
        'Swim at Platja del Masnou',
      ],
      mooringTip: 'Marina del Masnou stern-to with lazy lines, €60-100/night peak, fully sheltered.',
      gallery: [{ src: '/images/itinerary/spain/destinations/el-masnou.webp', alt: 'El Masnou' }],
    },
    {
      id: 'el-masnou-mataro',
      routeFrom: 'El Masnou',
      routeTo: 'Mataró',
      day: 6,
      mapPin: {
        desktop: { left: 54.7, top: 54.5 },
        mobile: { left: 47, top: 50.8 },
      },
      description:
        '6 nm short hop north to Mataró. Casa Coll i Regàs (Modernista mansion, 1898, attributed to Gaudí school) is the architectural highlight. Weekly Mercat de Mataró Saturdays for jewellery and antiques. Port de Mataró stern-to with lazy lines, €70-110/night peak, fully sheltered. Plan to Casa Coll i Regàs Modernista mansion, saturday Mercat de Mataró antiques, swim Platja del Callao golden sand.',
      shortDescription:
        '6 nm short hop N to Mataró. Casa Coll i Regàs Modernista mansion 1898. Saturday Mercat de Mataró jewellery + antiques. Port de Mataró stern-to with lazy lines, €70-110/night peak, fully sheltered. Plan to swim Platja del Callao golden sand and vermút + esqueixada at a harbourside bar.',
      thingsToDo: [
        'Visit Casa Coll i Regàs Modernista mansion',
        'Saturday Mercat de Mataró antiques',
        'Swim Platja del Callao golden sand',
        'Vermút + esqueixada at a harbourside bar',
      ],
      mooringTip: 'Port de Mataró stern-to with lazy lines, €70-110/night peak, fully sheltered.',
      gallery: [{ src: '/images/itinerary/spain/destinations/mataro.webp', alt: 'Mataró' }],
    },
    {
      id: 'mataro-barcelona-sitges',
      routeFrom: 'Mataró',
      routeTo: 'Sitges',
      day: 7,
      mapPin: {
        desktop: { left: 58.9, top: 48.3 },
        mobile: { left: 51.9, top: 45.9 },
      },
      description:
        '24 nm long south back to Sitges via Barcelona Barceloneta swim stop. Refuel at Port Aiguadolç de Sitges before tying up. Carrer de Sant Pere, the Sitges old town main pedestrian street, for last-evening dinner. Refuel at the entrance fuel berth. Plan to optional Barceloneta swim stop and xató bitter-green-anchovy salad at El Vivero.',
      shortDescription:
        '24 nm long S back to Sitges via Barceloneta swim. Refuel at Port Aiguadolç. Carrer de Sant Pere old town pedestrian for last dinner. Highlights: Optional Barceloneta swim stop and Walk Carrer de Sant Pere old-town pedestrian.',
      thingsToDo: [
        'Optional Barceloneta swim stop',
        'Walk Carrer de Sant Pere old-town pedestrian',
        'Xató bitter-green-anchovy salad at El Vivero',
        'Refuel and clean the boat at Port Aiguadolç',
      ],
      mooringTip:
        'Port Aiguadolç de Sitges stern-to with lazy lines, €80-130/night peak, fully sheltered. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/spain/destinations/barcelona.webp', alt: 'Barcelona' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/map.webp',
        alt: 'Sitges Route Image',
      },
      width: 2462,
      height: 1340,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/mobile-map.webp',
        alt: 'Sitges Route Image',
      },
      width: 1654,
      height: 1346,
    },
  },
};

export default computeItineraryNumberOfDays(sitgesRoute);
