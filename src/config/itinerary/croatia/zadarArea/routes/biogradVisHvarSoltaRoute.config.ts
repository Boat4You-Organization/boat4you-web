import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const biogradVisHvarSoltaRoute: ItineraryRoute = {
  metaTitle: '7-Day Biograd–Vis–Hvar–Šolta Yacht Route | Boat4You',
  metaDesc:
    'Sail a 7-day yacht charter from Biograd na Moru via Vrgada, Primošten, Komiža & Hvar to Šolta. Discover hidden bays, iconic towns & Adriatic island charm.',
  id: 'biograd-na-moru-vis-hvar-solta-route',
  startingPoint: 'Biograd na Moru',
  otherPoints: ['Vis', 'Hvar', 'Solta'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/biograd-hvar-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/hvar-banner-large.webp', alt: 'Hvar' },
    {
      src: '/images/itinerary/croatia/banners/golden-horn-brac-banner-large.webp',
      alt: 'Golden horn brac',
    },
    { src: '/images/itinerary/croatia/banners/korcula-banner.webp', alt: 'Korcula' },
    { src: '/images/itinerary/croatia/banners/stiniva-bay-banner.webp', alt: 'Stiniva bay' },
  ],
  routeDays: [
    {
      id: 'biograd-vrgada',
      routeFrom: 'Biograd',
      routeTo: 'Vrgada',
      day: 1,
      mapPin: {
        desktop: { left: 41.3, top: 47.8 },
        mobile: { left: 39.8, top: 49.3 },
      },
      description:
        'Starting your adventure in Biograd, the "White City," history hums through mediaeval ruins and elegant boats bob in the marina. Sail to Vrgada, a car-free island where time stops to the sound of bicycle bells. Anchor in a remote bay, snorkel over sandy areas glowing like liquid gold. Dine at a family konoba on brudet, fish stew, the tang of Adriatic herbs blending with stories of fisherman who have risked these waters for millennia.',
      shortDescription:
        'Easy 12 nm shake-down leg out of Biograd to Vrgada — a tiny island near Pirovac, no cars, sandy bay, and a population that swells from 250 to 600 in August. Sandy bay is unusual for the central Dalmatian shore.',
      thingsToDo: [
        'Swim the sandy Lučica Bay',
        'Walk no-car island paths',
        'Beachcomb for sea glass',
        'Brudet stew at the family konoba',
      ],
      mooringTip:
        'Restaurant moorings off Lučica Bay — free with dinner ashore. Free anchoring on sand at 4-6 m for a quieter night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vrgada.webp', alt: 'Vrgada' }],
    },
    {
      id: 'vrgada-zdrelac-bay-primosten',
      routeFrom: 'Vrgada',
      routeTo: 'Primošten',
      day: 2,
      mapPin: {
        desktop: { left: 53.7, top: 60.2 },
        mobile: { left: 58.7, top: 58.8 },
      },
      description:
        'Glide south to the secluded bay known as Ždrelac Bay on Pašman Island, where pine forests flood into azure sea. Explore crystalline shallows then sail forward to Primošten, whose terracotta rooftops flow down the sea like a stone waterfall. Swim under the famous vineyard island, with its limestone terraces shining amber at sunset, and toast with strong Babič wine at a cliffside bar while fishermen repair nets below.',
      shortDescription:
        'Long 22 nm coastal leg south past Šibenik to Primošten — the medieval town set on a near-island headland, with a Romanesque church on the high point. The Bucavac vineyards on the surrounding terraces produce the dense Babić red.',
      thingsToDo: [
        'Swim below Bucavac vineyard',
        'Climb to St. George cliff church',
        'Babić red wine tasting',
        'Dinner at Konoba Mediteran',
      ],
      mooringTip:
        'Marina Kremik (1.5 nm south) is the standard berth — pre-book in summer. Anchor in nearby Garma cove on sand at 5-7 m.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primosten' }],
    },
    {
      id: 'primosten-komiza',
      routeFrom: 'Primošten',
      routeTo: 'Komiža',
      day: 3,
      mapPin: {
        desktop: { left: 61.8, top: 86.2 },
        mobile: { left: 67, top: 77.2 },
      },
      description:
        'Track the horizon westward to Vis, Croatia\'s "island of mystery." Komiža welcomes you with boats battered by salt and pastel homes. Climb Hum Hill for sunset views of the archipelago, then eat komiška pogača—a savory anchovy pie—at a harborside restaurant, the air heavy with laughter and the briny kiss of the sea.',
      shortDescription:
        'Long offshore 28 nm passage south to Vis — the most isolated mid-Dalmatian island, closed to outsiders during Yugoslav military years and only reopened in 1989. Komiža is the western fishing port; the Blue Cave on Biševo islet is 5 nm to the southwest.',
      thingsToDo: [
        'Day-trip to the Blue Cave',
        'Climb Hum Hill at sunset',
        'Komiška pogača anchovy pie',
        'Tour the Vis Fishing Museum',
      ],
      mooringTip:
        'Komiža harbour is short-stay only; pre-book ACI Marina Vis (other side of the island) for a safer overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-hvar-town',
      routeFrom: 'Komiža',
      routeTo: 'Hvar Town',
      day: 4,
      mapPin: {
        desktop: { left: 69.7, top: 82.1 },
        mobile: { left: 79.7, top: 73.8 },
      },
      description:
        "Set out for Hvar, where boat-studded bays dissolve lavender fields. Dock in Hvar Town, a mix of bohemian flair and Venetian majesty. Wander St. Stephen's Square, then climb to Španjola Fortress as the sun sets to paint the Pakleni Islands molten gold. By night, slink into a secret courtyard for spaghetti with truffle-laced hum from ancient stone.",
      shortDescription:
        "Easy 22 nm leg northeast to Hvar Town — the Adriatic's most fashionable port, with the largest open public square in Dalmatia, a 16th-century Spanish fortress, and the Pakleni Islands directly opposite the harbour.",
      thingsToDo: [
        "Tour Hvar's St. Stephen Cathedral",
        'Hike to Španjola Fortress at sunset',
        'Day-cruise the Pakleni Islands',
        'Sunset cocktails at Hula-Hula',
      ],
      mooringTip:
        'ACI Marina Palmižana on Sveti Klement (Pakleni Is., 2 nm) is the safest pre-book; Hvar town quay slots are first-come.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-maslinica-solta',
      routeFrom: 'Hvar',
      routeTo: 'Maslinica (Šolta)',
      day: 5,
      mapPin: {
        desktop: { left: 63.5, top: 69.5 },
        mobile: { left: 70.2, top: 63.7 },
      },
      description:
        "Sail north to the island of olive orchards and peaceful magic, Šolta. Anchor at Maslinica Bay, where a mirror-still castle protects from the eighteenth century. Kayak to Čikat's sandy cove, then at a family restaurant enjoy soltinski šokol (fig cake). Toast with rožulin liquor as evening gilds the bay, the stars rising like old friends.",
      shortDescription:
        'Easy 18 nm leg north to Šolta — the quieter neighbour of Brač, with the western harbour of Maslinica facing seven small uninhabited islets. The 17th-century Martinis-Marchi castle hotel is the village landmark.',
      thingsToDo: [
        'Day-trip the seven Maslinica islets',
        'Visit the Martinis-Marchi castle',
        'Bike Šolta olive-grove trails',
        'Dine on local Šolta lamb',
      ],
      mooringTip:
        'ACI Marina Maslinica is small but well-protected; book ahead. Anchor in Šešula Bay (1 nm south) on sand at 5-8 m.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Veli Drvenik' }],
    },
    {
      id: 'maslinica-sibenik',
      routeFrom: 'Maslinica',
      routeTo: 'Šibenik',
      day: 6,
      mapPin: {
        desktop: { left: 53.4, top: 52.9 },
        mobile: { left: 56, top: 53.2 },
      },
      description:
        'Go back to Šibenik, where St. James Cathedral pierces the heavens with its stone lacework, designated by UNESCO. After swimming beneath the roaring falls of Krka Waterfalls, eat fritule (sweet doughnuts) by the river, fireflies dancing like embers in the warm night air.',
      shortDescription:
        'Long 28 nm coastal leg back northwest to Šibenik — the medieval Croatian royal seat, with the UNESCO-listed Cathedral of St. James (built entirely of stone, no wood, no mortar) and the four hilltop forts surrounding the harbour.',
      thingsToDo: [
        'Tour UNESCO Cathedral of St. James',
        'Climb to St. Michael Fortress',
        'Krka National Park afternoon',
        'Fritule doughnuts at the Riva',
      ],
      mooringTip: 'Mandalina Marina is the standard charter berth; ACI Marina Skradin upriver is the alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sibenik.webp', alt: 'Šibenik' }],
    },
    {
      id: 'sibenik-biograd',
      routeFrom: 'Šibenik',
      routeTo: 'Biograd',
      day: 7,
      mapPin: {
        desktop: { left: 39.4, top: 41.9 },
        mobile: { left: 37.9, top: 43.7 },
      },
      description:
        'Sail homeward down the coast, stopping to dive in secret nooks where sunshine dances into liquid gold. Go back to Biograd; the lights of the marina seem to be ground-based constellations. Under an indigo sky, toast your journey with crni rižot (black risotto) the Adriatic whispering: You will carry this salt in your soul always.',
      shortDescription:
        'Final 12 nm leg back along the coast to Biograd. Time the approach for sunset on the Riva. Marina Kornati or Marina Šangulin — both inside the old-town breakwater. Plan to final swim in Pašman coves and walk the Biograd Riva.',
      thingsToDo: [
        'Final swim in Pašman coves',
        'Walk the Biograd Riva',
        'Visit the Heritage Museum',
        'Crni rižot dinner at the marina',
      ],
      mooringTip:
        'Marina Kornati or Marina Šangulin — both inside the old-town breakwater. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/biograd.webp', alt: 'Biograd na moru' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Biograd Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Biograd Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(biogradVisHvarSoltaRoute);
