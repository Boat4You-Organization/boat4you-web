import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lavagnaRoute: ItineraryRoute = {
  metaTitle: 'Lavagna Yacht Charter Route | Italian Riviera + Cinque Terre Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Lavagna along the Ligurian Riviera through Sestri Levante, Moneglia, Bonassola, Cinque Terre, Anzo and Portofino — UNESCO Cinque Terre loop.',
  id: 'lavagna',
  startingPoint: 'Lavagna',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/amalfi-itinerary/routes/lavagna.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/sestri-levante-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/monterosso-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/vernazza-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/lavagna-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'lavagna-sestri-levante',
      routeFrom: 'Lavagna',
      routeTo: 'Sestri Levante',
      day: 1,
      mapPin: {
        desktop: { left: 42.7, top: 34.4 },
        mobile: { left: 42.7, top: 34.4 },
      },
      description:
        '4 nm short shake-down south from Marina Porto di Lavagna (one of the largest charter marinas in Liguria, 1700 berths) to Sestri Levante. Twin coves: Baia del Silenzio (south, sand + village) and Baia delle Favole (north, more open). Day-anchor in Baia del Silenzio for swim, mooring on town quay.',
      shortDescription:
        '4 nm shake-down S from Lavagna (1700-berth marina) to Sestri Levante. Twin coves: Baia del Silenzio (S) + Baia delle Favole (N). Day-anchor + mooring.',
      thingsToDo: [
        'Walk Punta Manara hiking trail',
        'Anchor swim at Baia del Silenzio sand',
        'Trofie al pesto at a harbourside trattoria',
        'Sunset on Baia delle Favole pebble shore',
      ],
      mooringTip:
        'Sestri Levante town quay stern-to, €50-80/night, sheltered from N. Anchor in Baia del Silenzio on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/levante.webp', alt: 'Sestri Levante' }],
    },
    {
      id: 'sestri-levante-moneglia',
      routeFrom: 'Sestri Levante',
      routeTo: 'Moneglia',
      day: 2,
      mapPin: {
        desktop: { left: 58.2, top: 48.1 },
        mobile: { left: 58.2, top: 48.1 },
      },
      description:
        '5 nm short hop east to Moneglia — small Riviera town with terracotta-roofed houses falling toward pebble beaches. Anchor at Spiaggia di San Giorgio (sand + olive groves), sheltered from N. 16th-century Castle of Monleone on the cliff above. Plan to anchor swim at Spiaggia di San Giorgio, walk to the 16th-c Castle of Monleone, focaccia di Recco at Osteria del Porto.',
      shortDescription:
        '5 nm short hop E to Moneglia. Spiaggia di San Giorgio anchorage (sand + olive groves), sheltered N. 16th-c Castle of Monleone above. Small village quay slots €40-60/night, lazy lines absent. Plan to focaccia di Recco at Osteria del Porto and snorkel for octopus in seagrass beds.',
      thingsToDo: [
        'Anchor swim at Spiaggia di San Giorgio',
        'Walk to the 16th-c Castle of Monleone',
        'Focaccia di Recco at Osteria del Porto',
        'Snorkel for octopus in seagrass beds',
      ],
      mooringTip:
        'Anchor on sand at 4-6 m off Spiaggia di San Giorgio, sheltered from N. Small village quay slots €40-60/night, lazy lines absent.',
      gallery: [{ src: '/images/itinerary/italy/destinations/moneglia.webp', alt: 'Moneglia' }],
    },
    {
      id: 'moneglia-bonassola',
      routeFrom: 'Moneglia',
      routeTo: 'Bonassola',
      day: 3,
      mapPin: {
        desktop: { left: 79, top: 75.2 },
        mobile: { left: 79, top: 75.2 },
      },
      description:
        '8 nm east to Bonassola — car-free Riviera village, 1000 residents, the railway-turned-bike-path "Ligurian Greenway" runs east through tunnels to Levanto and Cinque Terre. Anchor in Bonassola Bay on sand at 5-7 m, sheltered from N. Five Bays at Framura 2 nm west are boat-only secret coves.',
      shortDescription:
        '8 nm E to Bonassola — car-free village, 1000 residents. Ligurian Greenway bike path E to Cinque Terre. Five Bays Framura 2 nm W are boat-only.',
      thingsToDo: [
        'Cycle the Ligurian Greenway tunnel bike path',
        'Anchor swim at Five Bays of Framura',
        'Salt-cured anchovies at a family osteria',
        'Walk to Madonna della Punta chapel viewpoint',
      ],
      mooringTip:
        'Free anchoring in Bonassola Bay on sand at 5-7 m, sheltered from N. Small village quay slots limited.',
      gallery: [{ src: '/images/itinerary/italy/destinations/bonassola.webp', alt: 'Bonassola' }],
    },
    {
      id: 'bonassola-monterosso',
      routeFrom: 'Bonassola',
      routeTo: 'Monterosso',
      day: 4,
      mapPin: {
        desktop: { left: 88.9, top: 86.9 },
        mobile: { left: 88.9, top: 86.9 },
      },
      description:
        '6 nm east to Monterosso — largest of the Cinque Terre, the only sandy beach (Spiaggia di Fegina, sand + striped umbrellas). Cinque Terre is UNESCO listed; the Sentiero Azzurro hiking path connects all five villages. Anchor in Monterosso Bay; no marina, the village quay is for ferries only.',
      shortDescription:
        '6 nm E to Monterosso — largest Cinque Terre village, only sandy beach. UNESCO listed; Sentiero Azzurro path connects all 5 villages. Anchor in bay; no marina.',
      thingsToDo: [
        'Hike the Sentiero Azzurro to Vernazza',
        'Swim Spiaggia di Fegina sand beach',
        'Anchovy fritters + chickpea farinata at a trattoria',
        'Tasting Cinque Terre Sciacchetrà dessert wine',
      ],
      mooringTip:
        'Free anchoring in Monterosso Bay on sand at 6-8 m, sheltered from N. Quay only for ferries — no overnight mooring at the quay.',
      gallery: [{ src: '/images/itinerary/italy/destinations/monterosso.webp', alt: 'Monterosso' }],
    },
    {
      id: 'monterosso-vernazza',
      routeFrom: 'Monterosso',
      routeTo: 'Vernazza',
      day: 5,
      mapPin: {
        desktop: { left: 95.8, top: 91.4 },
        mobile: { left: 95.8, top: 91.4 },
      },
      description:
        '3 nm short hop east to Vernazza — most photographed of the Cinque Terre, tiered pastel houses around the harbour, 11th-century Castello Doria on the cliff above. Anchor in Vernazza Bay on rocky bottom, holding moderate; many charter boats prefer day-stop only and back to Monterosso for overnight.',
      shortDescription:
        '3 nm short hop E to Vernazza — most photographed Cinque Terre. Castello Doria 11th-c on cliff. Anchor moderate holding; many boats day-only + back to Monterosso.',
      thingsToDo: [
        'Climb to the 11th-c Castello Doria',
        'Snorkel near Punta Mesco underwater cliffs',
        'Lemon granita at Gelateria Vernazza',
        'Photograph the harbour at golden hour',
      ],
      mooringTip:
        'Anchor in Vernazza Bay on rocky bottom 6-8 m, holding moderate. Day-stop preferred; overnight back at Monterosso (3 nm west).',
      gallery: [{ src: '/images/itinerary/italy/destinations/vernazza.webp', alt: 'Vernazza' }],
    },
    {
      id: 'vernazza-anzo-setta',
      routeFrom: 'Vernazza',
      routeTo: 'Anzo-Setta',
      day: 6,
      mapPin: {
        desktop: { left: 71.3, top: 63 },
        mobile: { left: 71.3, top: 63 },
      },
      description:
        '15 nm west to Portofino Marine Reserve. Paraggi Bay 1 nm east of Portofino — boat-only cove, sand + turquoise water, holding excellent. San Fruttuoso Abbey (10th c, accessible only by sea or hiking trail from Camogli) is 2 nm further west. Day-stop at Paraggi or San Fruttuoso, overnight at Santa Margherita Ligure marina.',
      shortDescription:
        '15 nm W to Portofino Marine Reserve. Paraggi Bay (boat-only cove) + San Fruttuoso Abbey 10th-c (sea-access only). Overnight at Santa Margherita. Highlights: Anchor swim at Paraggi Bay turquoise water and Visit the 10th-c San Fruttuoso Abbey.',
      thingsToDo: [
        'Anchor swim at Paraggi Bay turquoise water',
        'Visit the 10th-c San Fruttuoso Abbey',
        'Snorkel above the Christ of the Abyss bronze statue',
        'Trenette al pesto at a Santa Margherita osteria',
      ],
      mooringTip:
        'Santa Margherita marina stern-to, €100-160/night peak, sheltered from N. Paraggi day-anchor on sand at 5-7 m, no overnight inside the reserve.',
      gallery: [{ src: '/images/itinerary/italy/destinations/anzo-setta.webp', alt: 'Anzo-Setta' }],
    },
    {
      id: 'anzo-setta-portofino-lavagna',
      routeFrom: 'Anzo-Setta',
      routeTo: 'Portofino',
      day: 7,
      mapPin: {
        desktop: { left: 4.4, top: 22.7 },
        mobile: { left: 4.4, top: 22.7 },
      },
      description:
        '8 nm south back to Lavagna via Portofino. Portofino is the iconic small fishing-village-turned-superyacht stop; Piazzetta with pastel mansions, Castello Brown above. Anchor outside the harbour entrance; mooring inside is prohibitively expensive (€800+/night for charter craft). Final overnight at Lavagna.',
      shortDescription:
        '8 nm S back to Lavagna via Portofino. Portofino Piazzetta + Castello Brown. Anchor outside; inside mooring €800+/night charter craft. Overnight at Lavagna. Highlights: Walk Portofino Piazzetta + Castello Brown and Anchor outside Portofino entrance for swim.',
      thingsToDo: [
        'Walk Portofino Piazzetta + Castello Brown',
        'Anchor outside Portofino entrance for swim',
        'Sunset aperitivo at Bar Caffetteria Chicco (Lavagna)',
        'Refuel and clean the boat at Marina Porto di Lavagna',
      ],
      mooringTip:
        'Anchor outside Portofino entrance on sand at 8-10 m for day stop. Marina Porto di Lavagna stern-to with lazy lines, €80-120/night, full services for handover.',
      gallery: [{ src: '/images/itinerary/italy/destinations/portofino.webp', alt: 'Portofino' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/lavagna/map.webp',
        alt: 'Genova Route Image',
      },
      width: 1433,
      height: 946,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/lavagna/map.webp',
        alt: 'Genova Route Image',
      },
      width: 1433,
      height: 946,
    },
  },
};

export default computeItineraryNumberOfDays(lavagnaRoute);
