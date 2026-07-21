import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sukosanPagRoute: ItineraryRoute = {
  metaTitle: '7-Day Sukošan–Pag Yacht Charter Route | Croatia Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Sukošan via Ždrelac, Molat, Silba, Ilovik, Šimuni & Olib to Pag & back. Discover hidden bays, island charm & Adriatic beauty',
  id: 'sukosan-pag-route',
  startingPoint: 'Sukošan',
  otherPoints: ['Pag'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/sukosan-pag-card-image.webp',
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
      id: 'sukosan-zdrelac-bay',
      routeFrom: 'Sukosan',
      routeTo: 'Ždrelac Bay',
      day: 1,
      mapPin: {
        desktop: { left: 31.8, top: 36.5 },
        mobile: { left: 23.9, top: 41.8 },
      },
      description:
        'Starting your journey in Sukosan, where the soft clinking of masts hints of adventures just ahead, Sail north to Ždrelac Bay, a secluded Eden on Pašman Island where pine forests flood into blue sea. Enter liquid clarity, then indulge in brudet (fish stew) at a stone-walled konoba, the aroma of wild rosemary mixing with the salted breeze. See the surface of the bay ripple like folded silk under the silver moon as evening sets.',
      shortDescription:
        'Easy 4 nm shake-down leg out of Sukošan north across the Pašman channel to Ždrelac. Marina Dalmacija (in Sukošan) is the largest charter base in Croatia by berth count — a quick clean exit from a crowded marina to the calm Ždrelac passage.',
      thingsToDo: [
        'Visit the Sukošan harbour Riva',
        'Anchor for an afternoon swim',
        'Walk the Ugljan/Pašman bridge',
        'Brudet fish stew at the konoba',
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
        desktop: { left: 19.8, top: 26.3 },
        mobile: { left: 22.4, top: 25.5 },
      },
      description:
        'Allow the dawn light to lead you to Molat, an island where time runs out and goats outnumber people. Anchor at Brgulje Bay, its pebbles singing underfoot, then climb to Zapuntel Beach—a crescent of sand unspoiled except by the wind. Join neighbors for gregada stew at night under a star-filled sky ablaze with the Milky Way so near you will swear you could pluck a constellation.',
      shortDescription:
        'Quiet 14 nm coastal leg west to Molat — one of the quietest islands in the Zadar archipelago. Year-round population around 200; the three small villages (Molat, Zapuntel, Brgulje) are connected by a single rural lane.',
      thingsToDo: [
        'Walk between three Molat villages',
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
      routeTo: 'Silba',
      day: 3,
      mapPin: {
        desktop: { left: 10.3, top: 14 },
        mobile: { left: 2.3, top: 23.3 },
      },
      description:
        'Follow the horizon to car-free Silba, a bohemian paradise where sailors and artists exchange stories under fig trees. Swim at Torta Beach, where the shallows sparkle topaz, then sail south to Ilovik, the "Island of Flowers." Drop anchor across Paradise Bay, snorkel over shimmering fish clouds. Dine under bougainvillea on lamb under the bell, slow-cooked with rosemary and island wine, as fireflies dance to the sea.',
      shortDescription:
        'Long 18 nm leg west to Silba — the artist colony of the Zadar archipelago: car-free, unique sandstone-arched alleys, and a long-running summer festival of art exhibitions in the village. Torta Beach on the western shore is the headline swim spot.',
      thingsToDo: [
        'Swim Torta Beach turquoise shallows',
        'Walk Silba car-free art alleys',
        'Visit a sandstone gallery',
        'Lamb peka under the bell',
      ],
      mooringTip: 'Anchor in Pocukmarak Bay on sand at 5-8 m, sheltered from N/NE. Town quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/silba.webp', alt: 'Silba' }],
    },
    {
      id: 'ilovik-simuni-pag',
      routeFrom: 'Ilovik',
      routeTo: 'Šimuni (Pag)',
      day: 4,
      mapPin: {
        desktop: { left: 23.7, top: 12.9 },
        mobile: { left: 15.5, top: 18.9 },
      },
      description:
        "Sail west to Pag's extreme splendor, where blue edge of the sea meets moonlike stone. Dock at Šimuni, a fishing community where salt pans sparkle like broken glass. Cycle across Lun's ancient olive grove, gnarled giants older than memory, then eat Pag's smoky lamb at a seashore grill, the tang of sheep cheese sharp on your tongue. The melodies of klapa singers will help you to relax into Pag's star-strewn evening.",
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
        desktop: { left: 18.2, top: 18.1 },
        mobile: { left: 11.5, top: 26.8 },
      },
      description:
        'Glide north to the sand-covered island of mysteries known as Olib. Wade ashore at Slatina Bay, your toes sinking into powder-soft dunes, and investigate former stone buildings buried under fig trees. Search for Roman mosaics buried in meadows; later, eat at a farmhouse on honey-drizzled fritule (doughnuts), the air scented with thyme and the murmur of cicadas.',
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
        desktop: { left: 27.1, top: 35 },
        mobile: { left: 23.6, top: 36.4 },
      },
      description:
        'Sail to Iž, where customists twist clay into legacy. Create your own peka pot in a sunny workshop; then, cycle to Koromačna Bay and swim in water so still it reflects the clouds. Join a fjera feast: tables groan with smoked ham, sheep cheese, and wine poured from worn-out jugs, mandolin strings weaving through laughing and clinking glasses as evening turns the sky tangerine.',
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
      id: 'iz-sukosan',
      routeFrom: 'Iž',
      routeTo: 'Sukosan',
      day: 7,
      mapPin: {
        desktop: { left: 35.1, top: 36.4 },
        mobile: { left: 33.6, top: 39.9 },
      },
      description:
        'Sail homeward, stopping at Ugljan for a last plunge into the azure embrace of Veli Školj. Go back to Sukosan where the lights of the marina shine like ground-based stars. Under an indigo sky, toast your voyage with crni rižot (black risotto), the murmurs of the Adriatic reminding you you will be returning.',
      shortDescription:
        'Final 12 nm leg back through the Pašman channel to Sukošan. Marina Dalmacija handles the largest volume of charter handovers in Croatia — request fuel slot 24h ahead.',
      thingsToDo: [
        'Final swim off Ugljan',
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

export default computeItineraryNumberOfDays(sukosanPagRoute);
