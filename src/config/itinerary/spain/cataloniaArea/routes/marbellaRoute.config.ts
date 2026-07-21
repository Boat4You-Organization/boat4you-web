import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const marbellaRoute: ItineraryRoute = {
  metaTitle: 'Marbella Yacht Charter Route | Costa del Sol Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Marbella through Cabopino, Fuengirola, Benalmádena, Torremolinos, Málaga, Torre de Benagalbón and Churriana — Andalusian Costa del Sol loop.',
  id: 'marbella',
  startingPoint: 'Marbella',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/spain/catalonia-itinerary/routes/marbella.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/marbella-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/malaga-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/fuengirola-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/torremolinos-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'marbella-puerto-de-cabopino',
      routeFrom: 'Marbella',
      routeTo: 'Puerto de Cabopino',
      day: 1,
      mapPin: {
        desktop: { left: 32.6, top: 62.2 },
        mobile: { left: 23.3, top: 53.9 },
      },
      description:
        '8 nm shake-down east from Puerto Banús to Puerto de Cabopino. Costa del Sol summer wind regime is the levante from E (warm dry) at 10-15 kn alternating with the poniente from W. Pass the Marbella superyacht dock at Puerto Banús (largest mega-yacht marina in Andalucía).',
      shortDescription:
        '8 nm shake-down E from Puerto Banús to Cabopino. Levante E + poniente W winds 10-15 kn. Pass Puerto Banús superyacht dock (largest in Andalucía).',
      thingsToDo: [
        'Walk Puerto Banús superyacht dock for spotting',
        'Anchor swim at Playa de Cabopino dunes',
        'Espetos sardine skewers at a beach chiringuito',
        'Walk the Cabopino dunes nature reserve',
      ],
      mooringTip:
        'Puerto de Cabopino stern-to, €80-120/night peak, sheltered from N. Puerto Banús is the larger glitz alternative at €200-400/night peak.',
      gallery: [{ src: '/images/itinerary/spain/destinations/puerto-de-cabopino.webp', alt: 'Puerto de Cabopino' }],
    },
    {
      id: 'puerto-de-cabopino-fuengirola',
      routeFrom: 'Puerto de Cabopino',
      routeTo: 'Fuengirola',
      day: 2,
      mapPin: {
        desktop: { left: 42.9, top: 66.3 },
        mobile: { left: 34.3, top: 54.5 },
      },
      description:
        '12 nm east to Fuengirola — Costa del Sol family resort. Sohail Castle (10th-c Moorish, restored, on a hill above the Río Fuengirola estuary) is the headline shore activity. Marina di Fuengirola stern-to, fully sheltered. Plenty of capacity. Plan to visit Bioparc Fuengirola tropical-jungle zoo and beach lunch on the Paseo Marítimo.',
      shortDescription:
        '12 nm E to Fuengirola — Costa del Sol family resort. 10th-c Moorish Sohail Castle on hill above river estuary. Marina fully sheltered. Plenty of capacity. Plan to visit Bioparc Fuengirola tropical-jungle zoo and beach lunch on the Paseo Marítimo.',
      thingsToDo: [
        'Walk to the 10th-c Moorish Sohail Castle',
        'Visit Bioparc Fuengirola tropical-jungle zoo',
        'Beach lunch on the Paseo Marítimo',
        'Espetos sardines at a Carihuela beach chiringuito',
      ],
      mooringTip: 'Marina di Fuengirola stern-to, €80-130/night peak, fully sheltered. Plenty of capacity.',
      gallery: [{ src: '/images/itinerary/spain/destinations/fuengirola.webp', alt: 'Fuengirola' }],
    },
    {
      id: 'fuengirola-benalmadena',
      routeFrom: 'Fuengirola',
      routeTo: 'Benalmádena',
      day: 3,
      mapPin: {
        desktop: { left: 57.2, top: 57.3 },
        mobile: { left: 49.3, top: 51 },
      },
      description:
        '6 nm short hop east to Benalmádena. Puerto Marina (the postmodern Venetian-Moorish-arched marina, 1980s, the most-photographed marina in Spain) is the headline. The Buddhist Stupa above the resort is the largest Buddhist monument in Europe (33 m). Pre-book in peak August. Plan to tinto de verano at a marina café and tivoli World rollercoaster for sea views.',
      shortDescription:
        '6 nm short hop E to Benalmádena. Puerto Marina (Venetian-Moorish 1980s, most-photographed in Spain). Buddhist Stupa above (largest in Europe, 33 m). Pre-book in peak August. Plan to tinto de verano at a marina café and tivoli World rollercoaster for sea views.',
      thingsToDo: [
        'Walk the Puerto Marina Venetian-Moorish quays',
        'Visit the Buddhist Stupa (largest in Europe)',
        'Tinto de verano at a marina café',
        'Tivoli World rollercoaster for sea views',
      ],
      mooringTip: 'Puerto Marina Benalmádena stern-to, €100-160/night peak, fully sheltered. Pre-book in peak August.',
      gallery: [{ src: '/images/itinerary/spain/destinations/benalmadena.webp', alt: 'Benalmádena' }],
    },
    {
      id: 'benalmadena-torremolinos',
      routeFrom: 'Benalmádena',
      routeTo: 'Torremolinos',
      day: 4,
      mapPin: {
        desktop: { left: 62.6, top: 49 },
        mobile: { left: 55.8, top: 43.8 },
      },
      description:
        '4 nm short hop east to Torremolinos — historic Costa del Sol resort, Carihuela fishing-quarter still active alongside the modern hotel zone. Anchor near Carihuela beach on sand 4-6 m. 17th-c Molino de Inca windmill in tropical gardens above the village.',
      shortDescription:
        '4 nm short hop E to Torremolinos. Carihuela fishing-quarter alongside hotels. 17th-c Molino de Inca windmill in tropical gardens above. Anchor off Carihuela on sand at 4-6 m, sheltered from N; Marina di Benalmádena 4 nm west is the larger alternative.',
      thingsToDo: [
        'Walk Carihuela fishing-quarter alleys',
        'Anchor swim at Carihuela beach sand',
        'Gambas al ajillo at a Carihuela family taverna',
        'Visit the 17th-c Molino de Inca windmill',
      ],
      mooringTip:
        'Anchor off Carihuela on sand at 4-6 m, sheltered from N. Marina di Benalmádena 4 nm west is the larger alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/torremolinos.webp', alt: 'Torremolinos' }],
    },
    {
      id: 'torremolinos-malaga',
      routeFrom: 'Torremolinos',
      routeTo: 'Málaga',
      day: 5,
      mapPin: {
        desktop: { left: 69.4, top: 42.1 },
        mobile: { left: 63, top: 39.7 },
      },
      description:
        "8 nm east to Málaga — Andalusian capital, Picasso's birthplace. Muelle Uno modern marina (2011, in the historic harbour) is the standard charter overnight. Walk to the Alcazaba (11th-c Moorish fortress, second-best preserved in Spain after Granada's Alhambra). Marina di Benalmádena 12 nm west is cheaper alternative. Plan to visit the Picasso Museum (birthplace city) and olive + jamón ibérico at Atarazanas Market.",
      shortDescription:
        '8 nm E to Málaga — Andalusian capital, Picasso birthplace. Muelle Uno marina 2011 in historic harbour. 11th-c Moorish Alcazaba fortress. Marina di Benalmádena 12 nm west is cheaper alternative. Plan to visit the Picasso Museum (birthplace city) and olive + jamón ibérico at Atarazanas Market.',
      thingsToDo: [
        'Walk the 11th-c Moorish Alcazaba fortress',
        'Visit the Picasso Museum (birthplace city)',
        'Olive + jamón ibérico at Atarazanas Market',
        'Vermút on Muelle Uno at sunset',
      ],
      mooringTip:
        'Muelle Uno Málaga stern-to, €120-200/night peak, fully sheltered. Pre-book in peak. Marina di Benalmádena 12 nm west is cheaper alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/malaga.webp', alt: 'Málaga' }],
    },
    {
      id: 'malaga-torre-de-benagalbon',
      routeFrom: 'Málaga',
      routeTo: 'Torre de Benagalbón',
      day: 6,
      mapPin: {
        desktop: { left: 74.9, top: 24.6 },
        mobile: { left: 70.9, top: 24.4 },
      },
      description:
        '6 nm short hop east to Torre de Benagalbón — small fishing village east of Málaga. 16th-c watchtower (Torre del Rincón) on the headland. Sendero Litoral coastal path runs east through whitewashed villages and lemon groves. Anchor off Torre de Benagalbón on sand at 4-6 m, sheltered from N. Plan to paddleboard to the secret sea caves and beach lunch at a cliffside chiringuito.',
      shortDescription:
        '6 nm short hop E to Torre de Benagalbón. 16th-c watchtower on headland. Sendero Litoral coastal path through whitewashed villages. Anchor off Torre de Benagalbón on sand at 4-6 m, sheltered from N. Plan to paddleboard to the secret sea caves and beach lunch at a cliffside chiringuito.',
      thingsToDo: [
        'Walk to the 16th-c Torre del Rincón',
        'Hike the Sendero Litoral coastal path',
        'Paddleboard to the secret sea caves',
        'Beach lunch at a cliffside chiringuito',
      ],
      mooringTip:
        'Anchor off Torre de Benagalbón on sand at 4-6 m, sheltered from N. Marina di Vélez 4 nm east is the small alternative for paid mooring.',
      gallery: [{ src: '/images/itinerary/spain/destinations/torre-de-benagalbon.webp', alt: 'Torre de Benagalbón' }],
    },
    {
      id: 'torre-de-benagalbon-churriana-marbella',
      routeFrom: 'Torre de Benagalbón',
      routeTo: 'Churriana',
      day: 7,
      mapPin: {
        desktop: { left: 93.2, top: 23.9 },
        mobile: { left: 93.2, top: 23.9 },
      },
      description:
        '32 nm long west back to Marbella via Churriana swim stop (small Costa del Sol quiet inlet). Refuel at Puerto Banús before tying up. Standard 14:00 marina arrival for handover-prep evening. Marina la Bajadilla is cheaper alternative at €100-150/night. Plan to crew dinner on the Marbella Paseo Marítimo.',
      shortDescription:
        '32 nm long W back to Marbella via Churriana quiet-inlet swim. Refuel at Puerto Banús before mooring. Standard 14:00 marina arrival. Marina la Bajadilla is cheaper alternative at €100-150/night. Plan to crew dinner on the Marbella Paseo Marítimo.',
      thingsToDo: [
        'Optional Churriana inlet swim stop',
        'Refuel and clean the boat at Puerto Banús',
        'Crew dinner on the Marbella Paseo Marítimo',
        'Sunset photo at Puerto Banús superyacht dock',
      ],
      mooringTip:
        'Puerto Banús Marbella stern-to, €200-400/night peak. Marina la Bajadilla is cheaper alternative at €100-150/night. Refuel at entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/spain/destinations/churriana-marina.webp', alt: 'Churriana' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/malaga/map.webp',
        alt: 'Marbella Route Image',
      },
      width: 1922,
      height: 1148,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/malaga/mobile-map.webp',
        alt: 'Marbella Route Image',
      },
      width: 1300,
      height: 1314,
    },
  },
};

export default computeItineraryNumberOfDays(marbellaRoute);
