import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const rogoznicaDubrovnikRogoznica14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Rogoznica to Dubrovnik Round-Trip Yacht Route | Boat4You',
  metaDesc:
    '14-day yacht route from Marina Frapa Rogoznica south to Dubrovnik via Brač, Hvar, Vis, Lastovo & Mljet — return via Korčula & Šolta. Sailor brief with NM.',
  id: 'rogoznica-dubrovnik-rogoznica-route-14-days',
  startingPoint: 'Rogoznica',
  otherPoints: ['Dubrovnik', '14 Days'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/rogoznica-dubrovnik-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/pakleni-islands-banner-large.webp', alt: 'Pakleni islands' },
    { src: '/images/itinerary/croatia/banners/hvar-banner-large.webp', alt: 'Hvar' },
    { src: '/images/itinerary/croatia/banners/mljet-banner.webp', alt: 'Mljet' },
    { src: '/images/itinerary/croatia/banners/dubrovnik-banner.webp', alt: 'Dubrovnik' },
  ],
  routeDays: [
    {
      id: 'rogoznica-veli-drvenik-krknjasi-bay',
      routeFrom: 'Rogoznica',
      routeTo: 'Veli Drvenik (Krknjaši Bay)',
      day: 1,
      mapPin: { desktop: { left: 28.3, top: 34.8 }, mobile: { left: 22.2, top: 34.7 } },
      shortDescription:
        '15 nm southeast from Marina Frapa Rogoznica to Krknjaši Bay between Veli and Mali Drvenik. Glass-water swim anchorage 4 nm west of Trogir, sand floor at 3-6 m, holding excellent. Three small Veli Drvenik konobas hang free buoys with dinner ashore.',
      description:
        'Out of Marina Frapa Rogoznica, 15 miles southeast along the open coast and into the channel between Veli Drvenik and Mali Drvenik. Krknjaši is a swim anchorage: shallow with a pale sand floor at 3–6 metres, holding excellent. Three small restaurants on Veli Drvenik (no road access — boat or foot only) lay free mooring buoys for guests. Day 1 settles the crew, delivers a quiet first night before the route turns south.',
      thingsToDo: [
        'Anchor on the sand floor in 4–6 m and swim',
        'Walk the 30-minute headland loop on Veli Drvenik',
        'Order grilled fish at a Veli Drvenik beach restaurant',
        'Sample the local Plavac Mali at a quayside table',
        'Watch the open-Adriatic sunset from the deck',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding. Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NE, E, S and SE; exposed only to W and NW.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/veli-drvenik.webp', alt: 'Veli Drvenik' }],
    },
    {
      id: 'veli-drvenik-milna-brac',
      routeFrom: 'Veli Drvenik',
      routeTo: 'Milna, Brač',
      day: 2,
      mapPin: { desktop: { left: 37.5, top: 40.4 }, mobile: { left: 41.7, top: 43.2 } },
      shortDescription:
        '12 nm east-southeast across the Brač Channel into Milna — most sheltered harbour on Brač’s west coast. Stern-to with own anchor on the inner town quay (modest fee, water and power). Order lamb under the peka three hours before dinner — the village’s signature tradition.',
      description:
        "Twelve miles east-southeast across the Brač Channel into Milna. The bay has been a working harbour since the Venetian era, the entrance unmistakable — the 17th-century parish church on the inner quay, stone houses stepping back from the water. Stern-to mooring with own anchor on the inner town quay for a modest harbour fee. Brač is famous for the white limestone (the same stone used for Diocletian's Palace) and lamb under the peka, the village's three-hour Sunday lunch tradition.",
      thingsToDo: [
        'Order lamb under the peka three hours before dinner',
        'Walk to the parish church on the inner quay',
        'Anchor with stern line to rocks in the outer bay',
        'Sample Brač olive oil at the village agricultural cooperative',
        'Dinghy 3 nm north to Bobovišća for a glassy sunset swim',
      ],
      mooringTip:
        'Stern-to on the inner town quay with own anchor — modest harbour fee, water and power on the central stretch. Open SW to W; if afternoon Maestral builds above 15 kn, the inner quay stays comfortable.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/milna.webp', alt: 'Milna' }],
    },
    {
      id: 'milna-palmizana-hvar',
      routeFrom: 'Milna',
      routeTo: 'Palmižana, Hvar',
      day: 3,
      mapPin: { desktop: { left: 35.6, top: 51.4 }, mobile: { left: 32.5, top: 47.7 } },
      shortDescription:
        '15 nm southeast across the Hvar Channel into Palmižana on Sv. Klement — the only inhabited islet in the Pakleni cluster and the only one with a marina.',
      description:
        "Fifteen miles southeast across the Hvar Channel into the Pakleni Islands. Palmižana sits on the eastern side of Sv. Klement, the largest islet in the cluster, with stern-to lazy-line slots at Palmižana ACI Marina (book online for July–August). South-side coves Vinogradišće and Tarsce are the comfortable W-gradient alternatives. Afternoon ritual: Meneghello family's 1906 botanical garden, dinner at one of the four konobas, snorkelling over the submerged Roman amphorae off the western shore.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
        'Anchor with line ashore in Vinogradišće if the marina is full',
        'Take the water taxi across to Hvar Town for the evening',
        'Walk the path across Sv. Klement to Vlaka Bay',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, online booking essential for July–August. If full, anchor in Vinogradišće cove (south side, sand and weed, line ashore standard).',
      gallery: [{ src: '/images/itinerary/croatia/destinations/palmizana.webp', alt: 'Palmižana' }],
    },
    {
      id: 'palmizana-komiza',
      routeFrom: 'Palmižana',
      routeTo: 'Komiža',
      day: 4,
      mapPin: { desktop: { left: 30, top: 58.4 }, mobile: { left: 19.4, top: 52.4 } },
      shortDescription:
        '20 nm southwest from the Pakleni cluster to Komiža on Vis — most westerly inhabited Croatian island, working fishing port, the best sunset on the route.',
      description:
        "Twenty miles southwest to Komiža, the working fishing port on the western side of Vis. Vis is the most westerly inhabited Croatian island and the 1989 lifting of its closed-zone military status is still visible. Stern-to with own anchor on the inner basin (sand and weed, mostly good holding) — outer wall open to SW swell. Konoba scene runs to grilled bogueroni and the indigenous Vugava white. Tito's Cave on Mount Hum is open as a site.",
      thingsToDo: [
        "Hike up Mount Hum (587 m) to Tito's WWII cave",
        'Walk the working fishing fleet on the eastern harbour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Visit the Fishermen's Museum in the Venetian tower",
        'Watch the open-Adriatic sunset from the harbour wall',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay. If SW gradient above 15 kn, push 6 nm north to Vis Town in St. George Bay.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-vela-luka-korcula',
      routeFrom: 'Komiža',
      routeTo: 'Vela Luka (Korčula)',
      day: 5,
      mapPin: { desktop: { left: 45.6, top: 64.9 }, mobile: { left: 41.1, top: 56.1 } },
      shortDescription:
        'Blue Cave morning then 18 nm east to Vela Luka at the western end of Korčula. Day driven by the Blue Cave morning sun-angle window.',
      description:
        'The day is dictated by the sun angle inside the Blue Cave on Biševo (09:00–11:00, official tender ferry, no private dinghies). Then short hop east to Ravnik islet and the Green Cave (open to private dinghies, easier and quieter). By early afternoon the route pushes 18 miles east to Vela Luka. Excellent shelter from N to E, full town services, fuel pump at the western end. Konoba dinner runs on žrnovski makaruni.',
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Dinghy into the Green Cave at Ravnik',
        'Sail past the south face of Vis on the leg east',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Walk the Vela Luka waterfront promenade at dusk',
      ],
      mooringTip:
        'Vela Luka offers stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Bay is fully sheltered from N, NE and E.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vela-luka.webp', alt: 'Vela Luka' }],
    },
    {
      id: 'vela-luka-lastovo-zaklopatica-bay',
      routeFrom: 'Vela Luka',
      routeTo: 'Lastovo (Zaklopatica Bay)',
      day: 6,
      mapPin: { desktop: { left: 52.4, top: 76.8 }, mobile: { left: 47.7, top: 66 } },
      shortDescription:
        '14 nm south to Lastovo, the most isolated inhabited Adriatic island. Zaklopatica U-shaped bay is the natural overnight — five family konobas hang free mooring buoys with dinner ashore. Lowest light pollution in Croatia: Milky Way directly overhead before midnight.',
      description:
        "Fourteen miles south takes you to Lastovo. Zaklopatica is the natural overnight: U-shaped bay with five family-run konobas that maintain free mooring buoys for guests who eat ashore. Lastovo's signature dishes are the local lobster (jastog) and šporki makaruli. Lowest light pollution in Croatia — Milky Way directly overhead before midnight.",
      thingsToDo: [
        "Pick up a konoba's free buoy in exchange for dinner",
        'Order Lastovo lobster (jastog) or šporki makaruli',
        'Walk the path inland to the Lastovo Town fumari (chimney stacks)',
        'Snorkel the islet at the bay entrance',
        'Stay on deck for the Milky Way after midnight',
      ],
      mooringTip:
        'Free konoba mooring buoys at Zaklopatica — confirm with the konoba on arrival, dinner reservation locks the buoy. Bay is fully sheltered from N to W; if SE forecast above 15 kn, move 4 nm south to Skrivena Luka.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zaklopatica.webp', alt: 'Zaklopatica' }],
    },
    {
      id: 'lastovo-mljet-polace',
      routeFrom: 'Lastovo',
      routeTo: 'Mljet (Polače)',
      day: 7,
      mapPin: { desktop: { left: 70.9, top: 78.4 }, mobile: { left: 64.5, top: 63.6 } },
      shortDescription:
        '22 nm northeast to Mljet — Polače inlet on the north coast holds Roman ruins on the waterfront and gives walking access to the saltwater lakes.',
      description:
        "Twenty-two miles northeast takes you to Polače, the long fjord-like inlet on Mljet's north coast. The bay is one of the best-sheltered overnight options on the entire south Croatian coast. Pick up one of the green Park mooring buoys (overnight fee paid at the ranger kiosk, includes Park entry). The remains of a 4th-century Roman complex sit metres from the waterfront. From Polače a 30-minute walk leads to Veliko Jezero and the Park ferry to St. Mary's monastery.",
      thingsToDo: [
        'Pick up a Park buoy and pay the ranger on arrival',
        'Walk through the 4th-century Roman complex on the waterfront',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Hike the 9 km lake-loop trail through the National Park',
        'Swim in the saltwater lakes',
      ],
      mooringTip: 'Polače uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry).',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mljet.webp', alt: 'Mljet' }],
    },
    {
      id: 'mljet-dubrovnik',
      routeFrom: 'Mljet',
      routeTo: 'Dubrovnik',
      day: 8,
      mapPin: { desktop: { left: 90.3, top: 86.3 }, mobile: { left: 90.1, top: 68.6 } },
      shortDescription:
        '24 nm southeast to ACI Marina Dubrovnik in Komolac, set up the long Rijeka Dubrovačka river estuary. Lazy lines, water and power on every berth, fuel pontoon. Old Port is a daytime tender stop only — exposed to S gradient. Bus 1A or taxi to Pile Gate in 15 min.',
      description:
        'Twenty-four miles southeast to ACI Marina Dubrovnik in Komolac, set up the long fjord-like Rijeka Dubrovačka river estuary. Lazy lines, water and power on every berth, fuel pontoon. Old Port is a daytime tender stop only — exposed to S gradient. Bus 1A or taxi to the Pile Gate of the Old City in 15 minutes. The walls walk is mandatory: 1.94 km circuit, 90 minutes.',
      thingsToDo: [
        'Walk the 1.94 km Old City wall circuit before sunset',
        'Take the cable car up to Mt. Srđ for the panorama',
        'Eat down a Prijeko side street, off the main Stradun',
        "Visit the Rector's Palace and the Franciscan cloister",
        'Stand a drink at Buža bar, on the rocks outside the south wall',
      ],
      mooringTip:
        'ACI Marina Dubrovnik in Komolac is the only practical overnight — book ahead in season. Old Port is a daytime tender stop only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/dubrovnik.webp', alt: 'Dubrovnik' }],
    },
    {
      id: 'dubrovnik-mljet-okuklje',
      routeFrom: 'Dubrovnik',
      routeTo: 'Mljet (Okuklje)',
      day: 9,
      mapPin: { desktop: { left: 73.9, top: 79.3 }, mobile: { left: 70.4, top: 65.2 } },
      shortDescription:
        '20 nm northwest back to Okuklje on Mljet’s southeast coast — outside the National Park (no Park fees), three family konobas hang free mooring buoys. Tight U-shaped bay takes maybe twenty boats. Black risotto cooked with cuttlefish ink is the standby.',
      description:
        "Twenty miles northwest to Okuklje on Mljet's southeast coast — outside the National Park boundary, no Park fees, three family konobas and a tight U-shaped bay that takes maybe twenty boats. The konobas hang their own free mooring buoys. Black risotto cooked with cuttlefish ink is the standby.",
      thingsToDo: [
        'Pick up a free konoba buoy and book dinner ashore',
        'Order black risotto (crni rižot) cooked with cuttlefish ink',
        'Walk the headland path for the view down to Korčula',
        'Swim straight from the boat in flat water',
        'Sleep with no town noise — the quietest stop of the route',
      ],
      mooringTip:
        'Free konoba buoys at Okuklje, dinner reservation locks the buoy. Bay is fully sheltered N, E and S; only NW gradient above 18 kn pushes any noticeable swell.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/okuklje.webp', alt: 'Okuklje' }],
    },
    {
      id: 'mljet-okuklje-korcula-town',
      routeFrom: 'Okuklje',
      routeTo: 'Korčula Town',
      day: 10,
      mapPin: { desktop: { left: 58.8, top: 65.4 }, mobile: { left: 56.2, top: 56.6 } },
      shortDescription:
        '15 nm northwest along the Pelješac Channel to Korčula Town — walled medieval port, layout the precursor to Venetian radial grids. ACI Marina Korčula on the east side is the all-weather option (lazy lines). Town quay west side stern-to but exposed to W Maestral.',
      description:
        'Fifteen miles northwest along the Pelješac Channel to Korčula Town. ACI Marina Korčula on the eastern side offers full services with lazy lines; town quay on the western side accepts stern-to but is exposed to W Maestral. Old Town fits in the palm of your hand, layout famously the precursor to Venetian radial grids. Moreška sword-dance Mon and Thu evenings 21:00.',
      thingsToDo: [
        'Watch the Moreška sword dance (Mon and Thu evenings in season)',
        'Walk the Old Town at dusk after the ferries leave',
        "Climb the bell tower of St. Mark's Cathedral",
        'Visit the (debated) Marco Polo House',
        'Pair dinner with a glass of indigenous Grk white from Lumbarda',
      ],
      mooringTip:
        'ACI Marina Korčula on the eastern side is the all-weather option. Town quay is exposed to W Maestral.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/korcula.webp', alt: 'Korcula' }],
    },
    {
      id: 'korcula-jelsa',
      routeFrom: 'Korčula',
      routeTo: 'Jelsa',
      day: 11,
      mapPin: { desktop: { left: 46.1, top: 51.4 }, mobile: { left: 47.8, top: 48.8 } },
      shortDescription:
        '23 nm northwest from Korčula across the Hvar Channel into Jelsa — quieter alternative to Hvar Town. Town quay stern-to with own anchor (good holding mud and sand); small marina on east side has lazy lines. Working heart of Hvar’s lavender belt and UNESCO Stari Grad Plain.',
      description:
        "Twenty-three miles northwest from Korčula across the Hvar Channel into Jelsa. The town quay accepts stern-to with own anchor (good holding in mud and sand), and a small marina on the eastern side handles boats that need lazy lines. Jelsa is the working heart of Hvar's interior agriculture: the lavender belt and the UNESCO Stari Grad Plain.",
      thingsToDo: [
        'Bike the 3 nm coast road to Vrboska’s canal-bridged old centre',
        'Walk inland through the UNESCO Stari Grad Plain',
        'Order Bogdanjuša white at a back-lane konoba',
        'Sample Hvar lavender oil at a producer in season',
        'Climb up to the Tor watchtower for the channel view',
      ],
      mooringTip:
        'Stern-to on the Jelsa town quay with own anchor — modest harbour fee, water and power. Small marina on the eastern side has lazy lines.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/jelsa.webp', alt: 'Jelsa' }],
    },
    {
      id: 'jelsa-lucice-bay-brac',
      routeFrom: 'Jelsa',
      routeTo: 'Lučice Bay (Brač)',
      day: 12,
      mapPin: { desktop: { left: 43.7, top: 44.8 }, mobile: { left: 26.9, top: 38.6 } },
      shortDescription:
        '10 nm north across the Brač Channel to Lučice — chain of small adjoining bays just east of Pučišća. No town: uninhabited limestone cliffs, two seasonal beach restaurants hang free buoys with dinner ashore. White seabed gives 20 m visibility on calm summer days.',
      description:
        'Ten miles north across the Brač Channel to Lučice, immediately east of Pučišća. No town — uninhabited headland walled by white limestone cliffs and pine forest, two seasonal beach restaurants with free buoys. The white limestone of Brač gives the seabed its characteristic pale floor; visibility runs to 20 metres on a calm summer day.',
      thingsToDo: [
        'Pick up a free restaurant buoy in the central cove',
        'Snorkel over the white limestone seabed (20 m visibility)',
        'Order grilled fish and Plavac Mali ashore',
        'Dinghy 1 nm west into Pučišća to see the working stone-mason yards',
        'Stand-up paddle the headland coast at sunrise',
      ],
      mooringTip:
        'Free restaurant buoys at Lučice — dinner ashore secures the buoy. Bays sheltered from N, NE and E; exposed to S.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lucice.webp', alt: 'lucice' }],
    },
    {
      id: 'lucice-bay-maslinica',
      routeFrom: 'Lučice Bay',
      routeTo: 'Maslinica',
      day: 13,
      mapPin: { desktop: { left: 32.6, top: 36.4 }, mobile: { left: 32.6, top: 36.4 } },
      shortDescription:
        '14 nm northwest to Maslinica on Šolta’s western tip — deep S-shaped natural harbour fully sheltered behind a chain of seven islets. Mooring split between Martinis Marchi Marina (south side, lazy lines, baroque-castle hotel) and the village quay (north side, stern-to with own anchor).',
      description:
        'Fourteen miles northwest to Maslinica, the deep S-shaped natural harbour at the western tip of Šolta. Mooring split between Martinis Marchi Marina on the south side (lazy lines, baroque-castle hotel) and the village quay on the north side. Šolta is the closest island to Split (15 miles out) but the quietest in the central Dalmatian group.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines — book ahead. Village quay (north side) takes stern-to with own anchor. Bay fully sheltered from S, SW, W and NW.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-rogoznica',
      routeFrom: 'Maslinica',
      routeTo: 'Rogoznica',
      day: 14,
      mapPin: { desktop: { left: 23, top: 28.1 }, mobile: { left: 14.7, top: 31 } },
      shortDescription:
        '15 nm northwest back into Marina Frapa Rogoznica for the Saturday handover by 09:00. Course past the Drvenik islands and the Šolta south coast. Boat at base by 09:00 — fuel topped, holding tanks emptied, decks rinsed, inventory checked, deposit released within 7 days.',
      description:
        "Final leg: 15 miles northwest from Maslinica back into Marina Frapa Rogoznica. Saturday handover protocol: boat back at base by 09:00, fuel topped, holding tanks emptied, decks rinsed, inventory checked. Course passes the Drvenik islands and the south coast of Šolta. With fuel pumped and inspection clear, walk the path to the Dragon's Eye Lake on the southern tip of Rogoznica peninsula one last time.",
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk the path to the Dragon's Eye Lake",
        'Stand a long lunch at the marina hotel restaurant',
        'Walk the small old quarter on Rogoznica peninsula',
        'Sample local olive oil at a village shop',
      ],
      mooringTip:
        'Return into Marina Frapa Rogoznica per your charter contract. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rogoznica.webp', alt: 'Rogoznica' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Rogoznica – Dubrovnik – Rogoznica Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Rogoznica – Dubrovnik – Rogoznica Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(rogoznicaDubrovnikRogoznica14DaysRoute);
