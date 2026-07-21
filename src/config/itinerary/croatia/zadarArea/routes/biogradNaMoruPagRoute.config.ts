import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const biogradNaMoruPagRoute: ItineraryRoute = {
  metaTitle: '7-Day Biograd–Pag Yacht Route | N Dalmatia | Boat4You',
  metaDesc:
    '7-day yacht charter from Biograd na Moru north to Pag — Olib, Premuda & Lošinj-Cres channel. Northern Dalmatia anchorages, sailor brief with NM.',
  id: 'biograd-na-moru-pag-route',
  startingPoint: 'Biograd na Moru',
  otherPoints: ['Pag'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/biograd-pag-card-image.webp',
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
      id: 'biograd-zdrelac-bay',
      routeFrom: 'Biograd',
      routeTo: 'Ždrelac Bay',
      day: 1,
      mapPin: {
        desktop: { left: 33.6, top: 37.7 },
        mobile: { left: 29.9, top: 36.9 },
      },
      description:
        'Start your Adriatic story in Biograd, the "White City," whose sunlit marinas hum centuries of marine mythology. Sail north to Ždrelac Bay, a secluded nook on Pašman Island where pine forests stretch into blue sea. Explore liquid clarity, then indulge in brudet (fish stew) at a cliffside konoba—the aroma of wild rosemary mixing with salted air. Watch the bay ripple under the silver moon like folded silk as evening falls.',
      shortDescription:
        'Easy 8 nm shake-down leg out of Biograd up the Pašman channel to Ždrelac — a sheltered passage between Pašman and Ugljan with calm sandy-bottomed water either side. Perfect first-night transition.',
      thingsToDo: [
        'Walk the Biograd Riva',
        'Anchor for an afternoon swim',
        'Cross the Ugljan/Pašman bridge',
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
        desktop: { left: 19.6, top: 27 },
        mobile: { left: 23, top: 26.4 },
      },
      description:
        'Follow the morning breeze to Molat, an island where time melts and goats rule. Anchor in Brgulje Bay, its pebbles humming under your feet, then climb to Zapuntel Beach—a crescent of sand unspoiled but by seabirds. Under a sky ablaze with stars, the Milky Way so near you will swear you could pluck a constellation. Join villagers for gregada, fish stew, at dusk.',
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
        desktop: { left: 11, top: 13.9 },
        mobile: { left: 3.2, top: 23.9 },
      },
      description:
        'Fig trees serve as a meeting place for artists and sailors in the car-free bohemian paradise of Silba, which may be reached by following the horizon. Visit Torta Beach for a swim in the topaz-studded shallows, and then set sail south for Ilovik, also known as the "Island of Flowers." Set sail toward Paradise Bay and snorkel among glistening schools of fish. As the moon and stars twinkle and the sound of the waves ebb and flow, enjoy a meal of slow-cooked lamb under the bell with rosemary and island wine beneath a bougainvillea canopy.',
      shortDescription:
        'Easy crossing west to Silba — the artist colony of the Zadar archipelago: car-free, unique sandstone-arched alleys, and a long-running summer festival of art exhibitions in the village. Torta Beach on the western shore is the headline swim spot.',
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
        desktop: { left: 22.1, top: 13.3 },
        mobile: { left: 13, top: 14.7 },
      },
      description:
        "Pag is a stunningly beautiful place to sail west, where the blue edge of the sea meets moonlike stone. The salt pans of Šimuni, a fishing community, shimmer like broken glass as you dock. After a leisurely bike ride through Lun's ancient olive grove, where the gnarled trees are older than empires, you may enjoy a beachside barbecue with Pag's smoky lamb and the sharp tang of sheep cheese. Listen to the melodies of the klapa singers as they transport you to a starry night on Pag.",
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
        desktop: { left: 18.5, top: 18.6 },
        mobile: { left: 16.3, top: 21.1 },
      },
      description:
        'Olib is a secluded sand island, so glide north to get there. Step onto the powdery dunes of Slatina Bay as you wade ashore, and then investigate the crumbling stone homes engulfed by fig trees. Explore a meadow in search of Roman mosaics, then stop at a farmhouse for honey-drizzled fritule (doughnuts) while cicadas hum and thyme scent the air.',
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
        desktop: { left: 28.3, top: 35.3 },
        mobile: { left: 24.4, top: 41.3 },
      },
      description:
        'Journey to Iž, a place where potters weave tradition into clay. In a sunny workshop, make your own peka pot. Then, ride your bike to Koromačna Bay and swim in water so calm that it reflects the clouds. Come to a fjera feast as the sun sets in a tangerine sky; the tables will be groaning with sheep cheese, smoked ham, and wine poured from old jugs; the sound of a mandolin will weave in and out of the laughter and clinking of glasses.',
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
      id: 'iz-biograd',
      routeFrom: 'Iž',
      routeTo: 'Biograd',
      day: 7,
      mapPin: {
        desktop: { left: 40.1, top: 41.1 },
        mobile: { left: 38.2, top: 43.2 },
      },
      description:
        "Return home by stopping at Ugljan for one last dive into the turquoise waters of Veli Školj. Go back to Biograd when the lights of the marina shine like stars in the sky. Under an indigo sky, with the Adriatic's whispers echoing, toast your voyage with crni rižot, often known as black risotto. You will carry these waves forever.",
      shortDescription:
        'Final 16 nm leg back through the Pašman channel to Biograd. Stop on Ugljan for a final swim, then push on for a clean handover at Marina Kornati or Marina Šangulin.',
      thingsToDo: [
        'Final swim off Ugljan',
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

export default computeItineraryNumberOfDays(biogradNaMoruPagRoute);
