import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const zadarPagRoute: ItineraryRoute = {
  metaTitle: '7-Day Zadar–Pag Yacht Charter Route | Croatia Sailing',
  metaDesc:
    "Sail a 7-day yacht charter from Zadar to Pag via Molat, Silba, Ilovik, Šimuni & Olib. Discover hidden bays, tranquil islands & the 'Moon Island' charm.",
  id: 'zadar-pag-route',
  startingPoint: 'Zadar',
  otherPoints: ['Pag'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/zadar-pag-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/kornati-banner-large.webp', alt: 'Kornati' },
    {
      src: '/images/itinerary/croatia/banners/national-park-kornati-banner-large.webp',
      alt: 'National park Kornati',
    },
    { src: '/images/itinerary/croatia/banners/pag-banner.webp', alt: 'Pag' },
    {
      src: '/images/itinerary/croatia/banners/primosten-marina-banner.webp',
      alt: 'Primosten marina',
    },
  ],
  routeDays: [
    {
      id: 'zadar-zdrelac-bay',
      routeFrom: 'Zadar',
      routeTo: 'Ždrelac Bay',
      day: 1,
      mapPin: {
        desktop: { left: 35.9, top: 40.5 },
        mobile: { left: 28.5, top: 44.3 },
      },
      description:
        'Begin in Zadar, where ancient Roman stones hum alongside the Sea Organ’s eerie melodies. Sail north to Ždrelac Bay, a sheltered Eden where pines lean over turquoise shallows like gossiping elders. Dive into water so clear you’ll swear you’re floating in air, then feast on brudet (fish stew) at a cliffside tavern as the sun stains the horizon burnt orange.',
      shortDescription:
        'Easy 8 nm shake-down leg out of Zadar across the Pašman channel to Ždrelac — a 250-metre passage between Pašman and Ugljan with a sheltered bay either side. Sandy bottom, calm water, perfect first-night transition from city to sailing rhythm.',
      thingsToDo: [
        'Listen to the Zadar Sea Organ',
        'Anchor for an afternoon swim',
        'Walk the Ugljan/Pašman bridge',
        'Brudet stew dinner ashore',
      ],
      mooringTip: 'Free anchoring on sand at 5-7 m. Sheltered from N/NW; town quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zdrelac.webp', alt: 'Ždrelac' }],
    },
    {
      id: 'zdrelac-molat',
      routeFrom: 'Ždrelac',
      routeTo: 'Molat',
      day: 2,
      mapPin: {
        desktop: { left: 21.1, top: 29.6 },
        mobile: { left: 14.2, top: 35.4 },
      },
      description:
        'Follow the scent of wild sage to Molat, an island where goats reign and time dissolves. Anchor in Brgulje Bay, its pebbles whispering underfoot, and hike to Zapuntel’s deserted beach—a crescent of sand untouched but by seabirds. At dusk, join villagers for arancini (fried citrus peels) and rakija under a sky thick with stars, the Milky Way your only map.',
      shortDescription:
        'Quiet 14 nm coastal leg west to Molat — one of the quietest islands in the Zadar archipelago. Year-round population around 200; the three small villages (Molat, Zapuntel, Brgulje) are connected by a single rural lane.',
      thingsToDo: [
        'Walk between the three Molat villages',
        'Beach time at deserted Zapuntel',
        'Try Molat arancini citrus sweets',
        'Stargaze in true dark-sky waters',
      ],
      mooringTip: 'Free anchoring on sand and seagrass at 5-8 m in Brgulje Bay. Restaurant moorings off the village.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/molat.webp', alt: 'Molat' }],
    },
    {
      id: 'molat-silba-ilovik',
      routeFrom: 'Molat',
      routeTo: 'Ilovik',
      day: 3,
      mapPin: {
        desktop: { left: 10.6, top: 13.8 },
        mobile: { left: 3, top: 26.5 },
      },
      description:
        'Chase the horizon to car-free Silba, a bohemian oasis where cobbled paths lead to secret art studios. Swim at Torta Beach, then sail south to Ilovik, the “Island of Flowers.” Drop anchor in Paradise Bay, snorkeling through schools of glittering sardines. Dine under bougainvillea on lamb under the bell, its rosemary perfume mingling with the salt-kissed breeze.',
      shortDescription:
        'Long passage day with two stops — Silba (car-free, the artist colony of the Zadar archipelago) for a Torta Beach swim, then south to Ilovik. The Ilovik–Sveti Petar channel is one of the best protected anchorages in the entire Kvarner.',
      thingsToDo: [
        'Lunch swim at Silba Torta Beach',
        'Walk Silba car-free art alleys',
        'Anchor in Ilovik–Sveti Petar channel',
        'Lamb peka at an oleander konoba',
      ],
      mooringTip:
        'Pick up a free restaurant buoy in the Ilovik–Sveti Petar channel — pay for dinner ashore and the buoy is included. Channel is fully sheltered.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/ilovik.webp', alt: 'Ilovik' }],
    },
    {
      id: 'ilovik-simuni-pag',
      routeFrom: 'Ilovik',
      routeTo: 'Šimuni (Pag)',
      day: 4,
      mapPin: {
        desktop: { left: 24.8, top: 15 },
        mobile: { left: 16.6, top: 21 },
      },
      description:
        'Sail west to Pag’s moonlike terrain, where stone and salt sculpt the landscape. Dock in Šimuni, a village of fishermen mending nets under olive trees. Cycle through Lun’s ancient olive grove—gnarled giants older than empires—then devour Pag’s famed lamb at a beach grill, its smoky richness paired with the sharp tang of sheep cheese.',
      shortDescription:
        'Easy 14 nm crossing east into the Pag channel and Šimuni — a quiet fishing village mid-island, with a small marina and the famous Lun olive groves a short bike ride to the north (1600 trees, some over 2000 years old).',
      thingsToDo: [
        'Cycle the Lun olive grove (1600 trees)',
        'Paški sir tasting at Gligora dairy',
        'Day-trip to Pag salt flats',
        'Pag lamb at a beach grill',
      ],
      mooringTip:
        'ACI Marina Šimuni — book ahead in summer. Anchor in adjacent coves on sand at 5-7 m for a quieter night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/simuni.webp', alt: 'Šimuni' }],
    },
    {
      id: 'simuni-olib',
      routeFrom: 'Šimuni',
      routeTo: 'Olib',
      day: 5,
      mapPin: {
        desktop: { left: 16.9, top: 20.8 },
        mobile: { left: 10.8, top: 27.1 },
      },
      description:
        'Glide north to Olib, where sandy coves defy Croatia’s rocky reputation. Wade ashore in Slatina Bay, your toes sinking into powder-soft sand, and explore abandoned stone houses reclaimed by fig trees. Hunt for Roman mosaics hidden in meadows, then feast on honey-drenched fritule (doughnuts) at a farmhouse lit by fireflies.',
      shortDescription:
        "Short 10 nm hop to Olib — population under 200, sandy beaches at Slatina and Banve bays, and an endemic pasta speciality (olibške makarule, hand-rolled by hour-long elders). One of the Adriatic's quietest charter destinations.",
      thingsToDo: [
        'Swim sandy Slatina and Banve bays',
        'Cycle the deserted stone-village trail',
        'Olibške makarule pasta lunch',
        'Hunt for Roman mosaics in fields',
      ],
      mooringTip: 'Small fishing port — limited slots. Anchor in Slatina Bay on sand at 4-6 m, sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/olib.webp', alt: 'Olib' }],
    },
    {
      id: 'olib-iz',
      routeFrom: 'Olib',
      routeTo: 'Iž',
      day: 6,
      mapPin: {
        desktop: { left: 29.3, top: 37.6 },
        mobile: { left: 24.7, top: 38.8 },
      },
      description:
        'Sail to Iž, where potters spin clay into tradition. Tour workshops crafting peka bells, then bike to Koromačna Bay—swim in water so still it mirrors the sky. As dusk falls, join a fjera feast: tables groan with smoked ham, sheep cheese, and wine poured from dusty jugs, mandolin strings weaving through laughter and clinking glasses.',
      shortDescription:
        'Easy 16 nm leg back across the channel to Iž — a quiet long thin island, famous for the Iž ceramic pottery tradition (the only place in Croatia where peka bells are still hand-thrown). Veli Iž has a small ACI marina; quieter Mali Iž is anchorage-only.',
      thingsToDo: [
        'Visit a Veli Iž peka pottery',
        'Cycle to Koromašnjak swim cove',
        'Try smoked Iž octopus salad',
        'Stay for a Fjera village fair',
      ],
      mooringTip:
        'ACI Marina Iž (Veli Iž) — small but well-protected. Anchor in Knež Bay on sand at 5-8 m for a quieter alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/iz.webp', alt: 'Iž' }],
    },
    {
      id: 'iz-zadar',
      routeFrom: 'Iž',
      routeTo: 'Zadar',
      day: 7,
      mapPin: {
        desktop: { left: 31.5, top: 31.7 },
        mobile: { left: 31.3, top: 37.4 },
      },
      description:
        'Sail homeward, stopping at Ugljan for a final plunge into Veli Školj’s aquamarine embrace. Return to Zadar as the Greeting to the Sun ignites, its kaleidoscope of light dancing beneath your feet. Toast your odyssey with Maraschino liqueur, the Adriatic’s whispers promising: This is not goodbye, but until next time.',
      shortDescription:
        'Final leg back across the Zadar channel — short hop with a swim stop on Ugljan, then into Marina Zadar (Borik) or Tankerkomerc for the handover. Time the arrival for the Greeting to the Sun installation light show on the Riva at dusk.',
      thingsToDo: [
        'Final swim off Ugljan',
        'Walk the Roman Forum at the centre',
        'Watch Greeting to the Sun light show',
        'Maraschino tasting at Konoba Skoblar',
      ],
      mooringTip:
        'Marina Zadar (Borik) is the standard charter berth. Confirm fuel slot 24h ahead and clean the boat the evening before.',
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

export default computeItineraryNumberOfDays(zadarPagRoute);
