import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const ibizaRoute: ItineraryRoute = {
  metaTitle: '7-Day Ibiza Yacht Charter Route | Balearic Blue Cruise',
  metaDesc:
    'Sail a 7-day yacht charter from Marina Eivissa via Santa Eulària, Portinatx, Sant Antoni, Cala Vedella, Ses Salines and Formentera — Ibiza + Formentera UNESCO loop.',
  id: 'ibiza',
  startingPoint: 'Marina Eivissa',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/spain/ibiza-itinerary/routes/ibiza.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/ibiza-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/vedella-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/platja-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/ibiza-boat-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'marina-eivissa-santa-eularia-des-riu',
      routeFrom: 'Marina Eivissa',
      routeTo: 'Santa Eulària des Riu',
      day: 1,
      mapPin: {
        desktop: { left: 53.6, top: 43.5 },
        mobile: { left: 53.6, top: 43.5 },
      },
      description:
        '8 nm shake-down east from Marina Botafoch (or Marina Eivissa) to Santa Eulària. Balearic summer wind regime is the Tramuntana from N (15-25 kn) alternating with the lighter Mestral from W. Marina Santa Eulària stern-to is the standard charter overnight; Cala Martina pine-fringed cove for swim before mooring.',
      shortDescription:
        '8 nm shake-down E to Santa Eulària. Tramuntana N (15-25 kn) + Mestral W summer regime. Marina Santa Eulària overnight; Cala Martina pine swim. Pre-book in peak August. Plan to snorkel Cala Martina posidonia meadows and walk Puig de Missa hilltop chapel for sunset.',
      thingsToDo: [
        'Snorkel Cala Martina posidonia meadows',
        'Walk Puig de Missa hilltop chapel for sunset',
        'Bullit de peix fish stew at Es Trull de Ca Palai',
        'Swim Cala Llonga sand cove',
      ],
      mooringTip: 'Marina Santa Eulària stern-to, €100-160/night peak, fully sheltered. Pre-book in peak August.',
      gallery: [{ src: '/images/itinerary/spain/destinations/garraf.webp', alt: 'Garraf' }],
    },
    {
      id: 'santa-eularia-portinatx',
      routeFrom: 'Santa Eulària',
      routeTo: 'Portinatx',
      day: 2,
      mapPin: {
        desktop: { left: 65.7, top: 26.9 },
        mobile: { left: 65.7, top: 26.9 },
      },
      description:
        "15 nm north to Portinatx — quietest of the Ibiza resorts, small natural harbour, S'Arenal Gros golden-sand crescent. 16th-c Xarraca pirate watchtower 1 nm west. Anchor in S'Arenal Petit on sand 4-6 m, sheltered from N. Anchor on sand 4-6 m as alternative.",
      shortDescription:
        "15 nm N to Portinatx — quietest Ibiza resort. S'Arenal Gros golden-sand. 16th-c Xarraca pirate watchtower 1 nm W. S'Arenal Petit sand anchorage. Portinatx small marina stern-to, €70-110/night peak, sheltered from N.",
      thingsToDo: [
        "Anchor swim at S'Arenal Petit sand cove",
        'Kayak to the 16th-c Xarraca pirate watchtower',
        'Walk to Portinatx lighthouse viewpoint',
        "Hierbas ibicencas herbal liqueur at Restaurante S'Espartar",
      ],
      mooringTip:
        'Portinatx small marina stern-to, €70-110/night peak, sheltered from N. Anchor on sand 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/spain/destinations/portinatx.webp', alt: 'Portinatx' }],
    },
    {
      id: 'portinatx-sant-antoni-de-portmany',
      routeFrom: 'Portinatx',
      routeTo: 'Sant Antoni de Portmany',
      day: 3,
      mapPin: {
        desktop: { left: 60, top: 5.6 },
        mobile: { left: 60, top: 5.6 },
      },
      description:
        '15 nm southwest along the wild north coast to Sant Antoni — west-coast resort, the Sunset Strip cliff bars (Café del Mar opened 1980, the original sunset venue). Marina di Sant Antoni stern-to. Cala Salada (boat-only access, terracotta-rock cove) is the headline swim.',
      shortDescription:
        '15 nm SW along wild N coast to Sant Antoni — west-coast resort, Sunset Strip (Café del Mar 1980). Marina di Sant Antoni. Cala Salada boat-only swim.',
      thingsToDo: [
        'Anchor swim at Cala Salada (boat-only, terracotta cove)',
        'Hike Cap Nunó for Conillera Island view',
        'Sunset at Café del Mar (the original 1980 venue)',
        'Paella de marigo at El Chiringuito',
      ],
      mooringTip:
        'Marina di Sant Antoni stern-to, €100-160/night peak, sheltered from N/E (exposed W). Cala Salada day-anchor on sand at 4-6 m as alternative.',
      gallery: [
        { src: '/images/itinerary/spain/destinations/sant-antoni-de-portmany.webp', alt: 'Sant Antoni de Portmany' },
      ],
    },
    {
      id: 'sant-antoni-cala-vedella',
      routeFrom: 'Sant Antoni',
      routeTo: 'Cala Vedella',
      day: 4,
      mapPin: {
        desktop: { left: 36.8, top: 28.6 },
        mobile: { left: 36.8, top: 28.6 },
      },
      description:
        '8 nm south to Cala Vedella — quieter west-coast cove, sand bottom 4-6 m, sheltered from N. Es Vedrà 380-m limestone needle 2 nm offshore is the iconic Ibiza geological landmark (claimed third-most magnetic point on Earth, attracts the New Age set). Day-anchor only at Es Vedrà; no overnight (rocky bottom, exposed).',
      shortDescription:
        '8 nm S to Cala Vedella — quieter west-coast cove. Es Vedrà 380 m limestone needle 2 nm offshore (iconic Ibiza landmark). Day-anchor only. Highlights: Day-anchor under Es Vedrà 380 m limestone needle and Snorkel Cala Vedella underwater arches.',
      thingsToDo: [
        'Day-anchor under Es Vedrà 380 m limestone needle',
        'Snorkel Cala Vedella underwater arches',
        'Sunbed lunch at El Chiringuito',
        'Sunset above Es Vedrà from the cliff viewpoint',
      ],
      mooringTip:
        'Anchor in Cala Vedella on sand at 4-6 m, sheltered from N. Es Vedrà day-anchor only on rocky bottom 8-10 m, no overnight.',
      gallery: [{ src: '/images/itinerary/spain/destinations/cala-vedella.webp', alt: 'Cala Vedella' }],
    },
    {
      id: 'cala-vedella-platja-de-ses-salines',
      routeFrom: 'Cala Vedella',
      routeTo: 'Platja de ses Salines',
      day: 5,
      mapPin: {
        desktop: { left: 26.2, top: 39.3 },
        mobile: { left: 26.2, top: 39.3 },
      },
      description:
        '6 nm south to Ses Salines — Ibiza salt flats nature reserve. Posidonia seagrass beds (UNESCO listed since 1999) require designated mooring zones; anchoring outside zones prohibited. Sa Trinxa beach bar (1980s bohemian icon) on the headland end. Cavallet Beach to the south for quieter swim.',
      shortDescription:
        '6 nm S to Ses Salines — UNESCO posidonia seagrass beds. Designated mooring zones only; no anchor outside. Sa Trinxa beach bar 1980s bohemian icon.',
      thingsToDo: [
        'Pick up a posidonia-zone mooring buoy',
        'Walk Sa Trinxa 1980s bohemian beach bar',
        'Beachcomb sea-glass at Cavallet Beach',
        'Bullit de peix at Salinas (reservation essential)',
      ],
      mooringTip:
        'Posidonia-zone mooring buoys at Ses Salines, €40-80/night peak, pre-book online via Govern Balear. Anchoring outside zones prohibited (€500+ fine).',
      gallery: [
        { src: '/images/itinerary/spain/destinations/platja-de-ses-salines.webp', alt: 'Platja de ses Salines' },
      ],
    },
    {
      id: 'ses-salines-puerto-formentera',
      routeFrom: 'Ses Salines',
      routeTo: 'Puerto Formentera',
      day: 6,
      mapPin: {
        desktop: { left: 42.2, top: 54.7 },
        mobile: { left: 42.2, top: 54.7 },
      },
      description:
        '4 nm south across the Freus Strait to Formentera — small flat island, white-sand beaches that compete with the Caribbean. La Savina is the only port. Ses Illetes (Caribbean-quality sandbar, posidonia-zone mooring required). La Mola lighthouse on the east end.',
      shortDescription:
        '4 nm S across Freus Strait to Formentera. La Savina only port. Ses Illetes Caribbean-quality sandbar (posidonia-zone mooring). La Mola lighthouse E end. La Savina marina stern-to, €120-200/night peak. Plan to cycle the flat path to La Mola lighthouse and espardeñas sea cucumber at Juan y Andrea.',
      thingsToDo: [
        'Posidonia-zone mooring at Ses Illetes Caribbean sandbar',
        'Cycle the flat path to La Mola lighthouse',
        'Espardeñas sea cucumber at Juan y Andrea',
        'Beach lunch at Ses Salines south side',
      ],
      mooringTip:
        'La Savina marina stern-to, €120-200/night peak. Ses Illetes posidonia-zone mooring buoys €40-80/night, pre-book.',
      gallery: [{ src: '/images/itinerary/spain/destinations/puerto-formentera.webp', alt: 'Puerto Formentera' }],
    },
    {
      id: 'formentera-eivissa',
      routeFrom: 'Formentera',
      routeTo: 'Eivissa',
      day: 7,
      mapPin: {
        desktop: { left: 52.5, top: 84.4 },
        mobile: { left: 52.5, top: 84.4 },
      },
      description:
        '8 nm north back to Marina Eivissa via Espalmador. Espalmador (private islet between Ibiza + Formentera, mud-bath beach on the north side) is the headline last-day swim stop. Marina Botafoch for the final overnight; Marina Eivissa town quay for the more central handover.',
      shortDescription:
        '8 nm N back to Eivissa via Espalmador. Mud-bath beach on Espalmador N side. Marina Botafoch final overnight; Eivissa town quay for central handover. Refuel at the entrance fuel berth. Plan to sunset at Cala Saona honey-hued cliffs and last-night cocktails at Lío waterfront.',
      thingsToDo: [
        'Mud-bath swim at Espalmador N beach',
        'Sunset at Cala Saona honey-hued cliffs',
        'Refuel and clean the boat at Marina Botafoch',
        'Last-night cocktails at Lío waterfront',
      ],
      mooringTip:
        'Marina Botafoch stern-to, €200-350/night peak. Marina Eivissa town quay is cheaper alternative at €120-180/night. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/spain/destinations/eivissa.webp', alt: 'Eivissa' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/ibiza-itinerary/map.webp',
        alt: 'Ibiza Route Image',
      },
      width: 1838,
      height: 1286,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/ibiza-itinerary/map.webp',
        alt: 'Ibiza Route Image',
      },
      width: 1838,
      height: 1286,
    },
  },
};

export default computeItineraryNumberOfDays(ibizaRoute);
