import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sukosanVisHvarRoute: ItineraryRoute = {
  metaTitle: '7-Day Sukošan–Vis–Hvar Yacht Charter Route | Croatia Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Sukošan via Ždrelac Bay, Primošten & Komiža to Hvar. Explore hidden bays, coastal towns & Adriatic island charm.',
  id: 'sukosan-vis-hvar-route',
  startingPoint: 'Sukošan',
  otherPoints: ['Vis', 'Hvar'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/sukosan-hvar-card-image.webp',
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
      id: 'sukosan-zdrelac-bay',
      routeFrom: 'Sukosan',
      routeTo: 'Ždrelac Bay',
      day: 1,
      mapPin: {
        desktop: { left: 33.7, top: 38.9 },
        mobile: { left: 34.1, top: 48 },
      },
      description:
        'Start your Adriatic story at Sukosan, a little harbor town where fishing boats bob like drowsy sentinels. Sail north to the secluded bay known as Ždrelac Bay on Pašman Island, where pine woods hug blue waves. Then relax at a waterfront konoba with platters of grilled orada (sea bream) and tales of Dalmatian mariners after diving into the crystalline embrace. Watch the surface of the bay glitter like scattered sapphires as evening paints the sky apricot colors.',
      shortDescription:
        'Easy 4 nm shake-down leg out of Sukošan to Ždrelac. Marina Dalmacija (in Sukošan) is the largest charter base in Croatia by berth count — a quick clean exit from a crowded marina to the calm Ždrelac passage.',
      thingsToDo: [
        'Visit the Sukošan harbour Riva',
        'Anchor for an afternoon swim',
        'Walk the Ugljan/Pašman bridge',
        'Grilled orada at the konoba',
      ],
      mooringTip: 'Free anchoring on sand at 5-7 m. Sheltered from N/NW; town quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zdrelac.webp', alt: 'Ždrelac' }],
    },
    {
      id: 'zdrelac-bay-primosten',
      routeFrom: 'Ždrelac Bay',
      routeTo: 'Primošten',
      day: 2,
      mapPin: {
        desktop: { left: 54.1, top: 59.3 },
        mobile: { left: 57.7, top: 59.5 },
      },
      description:
        'Glide south over the sun-kissed coast of the mainland, past the skyline of Šibenik. Arriving in Primošten, a picturesque town with cobblestone lanes spiraling up to a hilltop church, Swim under the famous Kamenar vineyard, its terraced amber-glowing vines, then sip strong Babić wine at a cliffside bar. Allow the rhythm of fishermen repairing nets to transport you into the timeless Adriatic enchantment.',
      shortDescription:
        'Long 32 nm coastal leg south past Šibenik to Primošten — the medieval town set on a near-island headland, with a Romanesque church on the high point. The Bucavac vineyards on the surrounding terraces produce the dense Babić red.',
      thingsToDo: [
        'Swim below Bucavac vineyard',
        'Climb to St. George cliff church',
        'Babić red wine tasting',
        'Dinner at Konoba Mediteran',
      ],
      mooringTip: 'Marina Kremik (1.5 nm south) is the standard berth — pre-book in summer.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primosten' }],
    },
    {
      id: 'primosten-komiza',
      routeFrom: 'Primošten',
      routeTo: 'Komiža',
      day: 3,
      mapPin: {
        desktop: { left: 60.6, top: 88.6 },
        mobile: { left: 65.6, top: 78.8 },
      },
      description:
        'Sail west toward the enigmatic island Vis. Komiža welcomes you with pastel homes and boats battered by salt-crust. After climbing Hum Hill at twilight for panoramic views of the archipelago, feast on komiška pogača, a savory anchovy pie, at a harborside table, the air heavy with laughter and the tang of the sea.',
      shortDescription:
        'Long offshore 28 nm passage south to Vis — the most isolated mid-Dalmatian island, closed to outsiders during Yugoslav military years and only reopened in 1989. Komiža is the western fishing port; the Blue Cave on Biševo islet is 5 nm to the southwest.',
      thingsToDo: [
        'Day-trip to the Blue Cave',
        'Climb Hum Hill at sunset',
        'Komiška pogača anchovy pie',
        'Tour the Vis Fishing Museum',
      ],
      mooringTip: 'Komiža harbour is short-stay only; pre-book ACI Marina Vis (other side of the island).',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-hvar-town',
      routeFrom: 'Komiža',
      routeTo: 'Hvar Town',
      day: 4,
      mapPin: {
        desktop: { left: 69.7, top: 82.2 },
        mobile: { left: 79.7, top: 71.5 },
      },
      description:
        "Track the horizon to Hvar, where lavender meadows blend with boat-studded coves. Dock in Hvar Town combines bohemian flair with Venetian majesty. Wander St. Stephen's Square and then climb to Španjola Fortress as the sun sets to gold the Pakleni Islands ablaze. By night, slip into a secret konoba for truffle-infused spaghetti and let the murmur of DJ rhythms resound across old stone lanes.",
      shortDescription:
        "Easy 22 nm leg northeast to Hvar Town — the Adriatic's most fashionable port, with the largest open public square in Dalmatia, a 16th-century Spanish fortress, and the Pakleni Islands directly opposite the harbour.",
      thingsToDo: [
        "Tour Hvar's St. Stephen Cathedral",
        'Hike to Španjola Fortress at sunset',
        'Day-cruise the Pakleni Islands',
        'Sunset cocktails at Hula-Hula',
      ],
      mooringTip: 'ACI Marina Palmižana on Sveti Klement (Pakleni Is., 2 nm) is the safest pre-book.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-maslinica-solta',
      routeFrom: 'Hvar',
      routeTo: 'Maslinica (Šolta)',
      day: 5,
      mapPin: {
        desktop: { left: 62.7, top: 69.2 },
        mobile: { left: 67.5, top: 64.1 },
      },
      description:
        "Sail north to the island of olive orchards and peaceful magic, Šolta. Anchor at Maslinica Bay, where a fortress from the eighteenth century watches over mirror-still sea. Kayak to Čikat's sandy cove, then eat soltinski šokol (fig cake) at a family-owned bar. As twilight gilds the bay, toast with rožulin, Šolta’s rose-hued liqueur, and let the stars claim the sky.",
      shortDescription:
        'Easy 18 nm leg north to Šolta — the quieter neighbour of Brač, with the western harbour of Maslinica facing seven small uninhabited islets. The 17th-century Martinis-Marchi castle hotel is the village landmark.',
      thingsToDo: [
        'Day-trip the seven Maslinica islets',
        'Visit the Martinis-Marchi castle',
        'Bike Šolta olive-grove trails',
        'Dine on local Šolta lamb',
      ],
      mooringTip: 'ACI Marina Maslinica is small but well-protected; book ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Veli Drvenik' }],
    },
    {
      id: 'maslinica-sibenik',
      routeFrom: 'Maslinica',
      routeTo: 'Šibenik',
      day: 6,
      mapPin: {
        desktop: { left: 52.9, top: 51.7 },
        mobile: { left: 55.9, top: 52.6 },
      },
      description:
        'Go back to Šibenik, where the crown gem of Croatia—the UNESCO-listed St. James Cathedral—medieval walls cradle. lose yourself in its lace-like stone façade, then cool off swimming under the thunderous cascade of Krka Waterfalls. Dine along the river on fritule, delicious doughnuts, as fireflies dance in the warm evening air like embers.',
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
      id: 'sibenik-sukosan',
      routeFrom: 'Šibenik',
      routeTo: 'Sukosan',
      day: 7,
      mapPin: {
        desktop: { left: 36.8, top: 36.7 },
        mobile: { left: 40, top: 44.7 },
      },
      description:
        'Sail homeward down the coast, stopping to dive in secret nooks where sunshine dances into liquid gold. Go back to Sukosan when church bells ring, their echoes blending with the clink of rigging. Under the glittering lights of the marina, toast your journey with a sunset feast of black risotto; the whispers of the Adriatic promise not an end but a beginning.',
      shortDescription:
        'Final 30 nm leg back along the Pašman channel to Sukošan and Marina Dalmacija — the largest marina in Croatia, ready for the handover. Highlights: Final swim in a Pašman cove and Final-night seafood platter.',
      thingsToDo: [
        'Final swim in a Pašman cove',
        'Final-night seafood platter',
        'Browse the Marina Dalmacija strip',
        'Pack-and-clean for handover',
      ],
      mooringTip: 'Marina Dalmacija (Sukošan) — pre-confirm berth assignment and fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sukosan.webp', alt: 'Sukošan' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Sukosan Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Sukosan Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(sukosanVisHvarRoute);
