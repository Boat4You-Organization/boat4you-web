import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const zadarVisHvarRoute: ItineraryRoute = {
  metaTitle: '7-Day Zadar–Vis–Hvar Yacht Charter Route | Croatia Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Zadar via Ždrelac Bay, Primošten & Komiža to Hvar. Discover the Blue Cave, historic towns & Adriatic island charm.',
  id: 'zadar-vis-hvar-route',
  startingPoint: 'Zadar',
  otherPoints: ['Vis', 'Hvar'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/zadar-hvar-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/cyclades-itinerary/mykonos/athens-mykonos-paros-route/day-gallery/feature1.webp',
      alt: 'Exploring Ždrelac Bay on Day 1',
    },
    {
      src: '/images/itinerary/greece/cyclades-itinerary/mykonos/athens-mykonos-paros-route/day-gallery/feature2.webp',
      alt: 'Exploring Molat on Day 2',
    },
    {
      src: '/images/itinerary/greece/cyclades-itinerary/mykonos/athens-mykonos-paros-route/day-gallery/feature3.webp',
      alt: 'Exploring Silba on Day 3',
    },
    {
      src: '/images/itinerary/greece/cyclades-itinerary/mykonos/athens-mykonos-paros-route/day-gallery/feature4.webp',
      alt: 'Exploring Šimuni on Day 4',
    },
  ],
  routeDays: [
    {
      id: 'zadar-zdrelac-bay',
      routeFrom: 'Zadar',
      routeTo: 'Ždrelac Bay',
      day: 1,
      mapPin: {
        desktop: { left: 34.4, top: 37.7 },
        mobile: { left: 29.2, top: 43.4 },
      },
      description:
        'Begin your voyage in Zadar, where ancient Roman ruins hum alongside modern marvels like the Sea Organ’s melodic tides. Set sail past the Kornati’s jagged silhouette, anchoring in Ždrelac Bay—a hidden cove where pine trees lean lazily over turquoise shallows. Dive into water so clear it mirrors the sky, then feast on pašticada (beef stewed in wine) at a stone-walled tavern as swallows dart through the golden hour.',
      shortDescription:
        'Easy 8 nm shake-down leg across the Pašman channel into Ždrelac — a sheltered passage between Pašman and Ugljan with calm sandy-bottomed water either side. Perfect first-night transition from city to sailing rhythm.',
      thingsToDo: [
        'Listen to the Zadar Sea Organ',
        'Anchor for an afternoon swim',
        'Walk the Ugljan/Pašman bridge',
        'Pašticada beef stew dinner',
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
        desktop: { left: 54.8, top: 59.1 },
        mobile: { left: 55.9, top: 58.5 },
      },
      description:
        'Glide south along the mainland’s sunbaked coast, passing Šibenik’s fortress skyline. Arrive in Primošten, a fairytale town where cobbled streets spiral up to a hilltop church. Swim beneath the iconic Kamenar vineyard island, its terraced vines glowing like amber, then sip Babić wine at a cliffside bar as fishing boats paint the harbor with ripples.',
      shortDescription:
        'Long 30 nm coastal leg south past Šibenik to Primošten — the medieval town set on a near-island headland, with a Romanesque church on the high point. The Bucavac vineyards on the surrounding terraces are listed by UNESCO as a candidate cultural landscape.',
      thingsToDo: [
        'Swim below Bucavac vineyard island',
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
        desktop: { left: 63.2, top: 87.5 },
        mobile: { left: 67.5, top: 77.2 },
      },
      description:
        'Sail westward to Vis, the Adriatic’s wild heart. Komiža greets you with pastel facades and fishermen mending nets in the shade of palm trees. Climb Hum Hill at dusk for a panorama of the archipelago, then devour komiška pogača—a savory pie oozing with anchovies and tomatoes—at a harborside table, the air thick with salt and laughter.',
      shortDescription:
        'Long offshore 28 nm passage southwest to Vis — the most isolated mid-Dalmatian island, closed to outsiders during Yugoslav military years and only reopened to civilian visitors in 1989. Komiža is the western fishing port; the famous Blue Cave (Modra špilja) on Biševo islet is 5 nm to the southwest.',
      thingsToDo: [
        'Day trip to the Blue Cave',
        'Climb Hum Hill at sunset',
        'Komiška pogača anchovy pie',
        'Tour the Fishing Museum',
      ],
      mooringTip:
        'Komiža harbour quay is short-stay only; pre-book ACI Marina Vis (other side of the island) for a safer overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-hvar-town',
      routeFrom: 'Komiža',
      routeTo: 'Hvar Town',
      day: 4,
      mapPin: {
        desktop: { left: 71.7, top: 81.5 },
        mobile: { left: 78.8, top: 73.2 },
      },
      description:
        'Chase the horizon to Hvar, where lavender fields melt into yacht-dotted bays. Dock in Hvar Town, a blend of Venetian glamour and bohemian buzz. Wander through St. Stephen’s Square, then hike to Španjola Fortress as the sun dips, painting the Pakleni Islands in hues of burnt sienna. Let the night lead you to a secret konoba where jazz mingles with the clink of Prošek dessert wine.',
      shortDescription:
        "Easy 22 nm leg northeast to Hvar Town — the Adriatic's most fashionable port, with the largest open public square in Dalmatia, a 16th-century Spanish fortress, and the Pakleni Islands archipelago directly opposite the harbour.",
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
        desktop: { left: 64.2, top: 69.6 },
        mobile: { left: 70.3, top: 63.5 },
      },
      description:
        'Sail north to Šolta, an island where time moves to the rustle of olive groves. Anchor in Maslinica Bay, where a 17th-century castle stands guard over mirror-still waters. Kayak to Čikat’s sandy cove, then dine on soltinski šokol (chocolate-shaped fig cake) as the sky erupts in tangerine and lavender—the Adriatic’s nightly masterpiece.',
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
        desktop: { left: 53, top: 52.8 },
        mobile: { left: 55.6, top: 51.6 },
      },
      description:
        'Return to Šibenik, where medieval walls cradle Croatia’s crown jewel: the UNESCO-listed St. James Cathedral. Lose yourself in its lace-like stone facade, then cool off with a swim beneath Krka River’s waterfalls. As twilight falls, join locals on the riva for crispy fritule doughnuts and tales of the city’s pirate-chasing past.',
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
      id: 'sibenik-zadar',
      routeFrom: 'Šibenik',
      routeTo: 'Zadar',
      day: 7,
      mapPin: {
        desktop: { left: 32.2, top: 31.6 },
        mobile: { left: 32, top: 36.8 },
      },
      description:
        'Sail homeward along the coast, stopping to dive in hidden coves where sunlight fractures into liquid gold. Return to Zadar as the Greeting to the Sun installation begins its neon dance beneath your feet. Toast your journey with Maraschino liqueur, the city’s ancient stones whispering Doviđenja—until next time.',
      shortDescription:
        'Final 30 nm coastal leg back along the Pašman channel to Zadar. Time the approach for the Greeting to the Sun light show at dusk on the Riva.',
      thingsToDo: [
        'Final swim in Pašman channel coves',
        'Walk the Zadar Roman Forum',
        'Watch Greeting to the Sun show',
        'Maraschino tasting at Skoblar',
      ],
      mooringTip: 'Marina Zadar (Borik) is the standard charter berth. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zadar.webp', alt: 'Zadar' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Zadar Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Zadar Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(zadarVisHvarRoute);
