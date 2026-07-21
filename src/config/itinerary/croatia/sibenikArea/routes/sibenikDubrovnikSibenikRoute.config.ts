import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sibenikDubrovnikSibenikRoute: ItineraryRoute = {
  metaTitle: '14-Day Šibenik to Dubrovnik Round-Trip Yacht Route | Boat4You',
  metaDesc:
    '14-day yacht route from Šibenik south to Dubrovnik via Brač, Hvar, Vis, Lastovo, Mljet & Korčula — return via Šolta. Sailor brief with NM and mooring notes.',
  id: 'sibenik-dubrovnik-sibenik-route',
  startingPoint: 'Šibenik',
  otherPoints: ['Dubrovnik', '14 Days'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/sibenik-dubrovnik-card-image.webp',
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
      id: 'sibenik-veli-drvenik-krknjasi-bay',
      routeFrom: 'Šibenik',
      routeTo: 'Veli Drvenik (Krknjaši Bay)',
      day: 1,
      mapPin: { desktop: { left: 28.3, top: 33.2 }, mobile: { left: 19.9, top: 35.4 } },
      shortDescription:
        '25 nm southeast out of ACI Marina Šibenik through the St. Anthony channel narrows into Krknjaši Bay between the two Drvenik islands — a glass-water swim anchorage 4 nm west of Trogir.',
      description:
        'Out of ACI Marina Šibenik (or alternatively Mandalina or D-Marin Mandalina) the opening leg pushes 25 miles southeast: down the river to the St. Anthony channel narrows (the 600-metre rock-cut passage at the river mouth, 49 m clearance under the Šibenik bridge — no issue for any charter mast), then south past Zlarin and Drvenik Veli into Krknjaši Bay between the two Drvenik islands. Krknjaši is a swim anchorage rather than a destination: shallow with a pale sand floor at 3–6 metres, holding excellent, water turning turquoise on a calm day. Three small restaurants on Veli Drvenik (no road access — boat or foot from the south-coast village only) lay free mooring buoys for guests, but anchoring on the sand floor is the more common choice. The point of stopping here on Day 1 is operational: it gets the boat out of the river, lets the crew check sail trim in light open-sea air, and delivers a quiet first night before the route turns south for serious miles.',
      thingsToDo: [
        'Anchor on the sand floor in 4–6 m and swim',
        'Walk the 30-minute headland loop on Veli Drvenik',
        'Order grilled fish at a Veli Drvenik beach restaurant',
        'Check sail trim and reefing in light open-sea air',
        'Watch the open-Adriatic sunset from the deck',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding (the standard choice). Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NE, E, S and SE; exposed only to W and NW. If W gradient forecast above 18 kn, push 2 nm into ACI Marina Trogir for the night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/veli-drvenik.webp', alt: 'Veli Drvenik' }],
    },
    {
      id: 'veli-drvenik-milna-brac',
      routeFrom: 'Veli Drvenik',
      routeTo: 'Milna (Brač)',
      day: 2,
      mapPin: { desktop: { left: 31, top: 37.2 }, mobile: { left: 24.6, top: 39.2 } },
      shortDescription:
        '12 nm east-southeast across the Split Channel and the Brač Channel into Milna — the most sheltered harbour on Brač’s western coast and the lamb-peka village.',
      description:
        "Twelve miles east-southeast takes you across the Split Channel and the Brač Channel into Milna, the deep, narrow inlet on Brač's western coast that has been a working harbour since the Venetian era. The entrance is unmistakable — the 17th-century parish church on the inner quay, stone houses stepping back from the water. Stern-to mooring with own anchor on the inner town quay for a modest harbour fee, water and power on the central section. Outer half of the bay is the anchorage — drop the hook in 6–10 metres on sand with a stern line to the rocks if afternoon Maestral builds. Brač is famous for the white limestone (the same stone used for Diocletian's Palace) and lamb under the peka, the village's three-hour Sunday lunch tradition. Order the peka the moment you tie up.",
      thingsToDo: [
        'Order lamb under the peka three hours before dinner',
        'Walk to the parish church on the inner quay',
        'Anchor with stern line to rocks in the outer bay',
        'Sample Brač olive oil at the village agricultural cooperative',
        'Dinghy 3 nm north to Bobovišća for a glassy sunset swim',
      ],
      mooringTip:
        'Stern-to on the inner town quay with own anchor — modest harbour fee, water and power on the central stretch. Outer bay accepts free anchoring with stern line to rocks. Open SW to W; if afternoon Maestral builds above 15 kn, the inner quay stays comfortable. Bobovišća (3 nm N) is the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/milna.webp', alt: 'Milna' }],
    },
    {
      id: 'milna-palmizana-hvar',
      routeFrom: 'Milna',
      routeTo: 'Palmižana (Hvar)',
      day: 3,
      mapPin: { desktop: { left: 35.9, top: 51.2 }, mobile: { left: 31.8, top: 48.1 } },
      shortDescription:
        '15 nm southeast across the Hvar Channel into Palmižana on Sv. Klement — the only inhabited islet in the Pakleni cluster and the only one with a marina.',
      description:
        "Fifteen miles southeast across the Hvar Channel takes you into the Pakleni Islands. Palmižana sits on the eastern side of Sv. Klement and is the only one of the cluster with a marina — Palmižana ACI Marina, with stern-to lazy-line slots and limited summer capacity (book online for July–August or expect to anchor). The main bay holds in 5–10 metres on sand-and-weed but turns rolly when the Maestral funnel kicks in around 14:00, so the comfortable overnight options are the south-side coves Vinogradišće and Tarsce, both holding well in W gradient with line ashore. The afternoon ritual is the Meneghello family's 1906 botanical garden, dinner at one of the four konobas spread along the bay, and snorkelling over the submerged Roman amphorae off the western shore. Hvar Town is a short water-taxi hop east if the crew wants the nightlife.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
        'Anchor with line ashore in Vinogradišće if the marina is full',
        'Take the water taxi across to Hvar Town for the evening',
        'Walk the path across Sv. Klement to Vlaka Bay',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, online booking essential for July–August. If full, anchor in Vinogradišće cove (south side, sand and weed, line ashore standard). Avoid the main Palmižana bay overnight when SW gradient builds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/palmizana.webp', alt: 'Palmižana' }],
    },
    {
      id: 'palmizana-komiza-vis',
      routeFrom: 'Palmižana',
      routeTo: 'Komiža (Vis)',
      day: 4,
      mapPin: { desktop: { left: 30.8, top: 59.1 }, mobile: { left: 21.5, top: 53.8 } },
      shortDescription:
        '20 nm southwest from the Pakleni cluster to Komiža on Vis — working fishing port on the western side of the island, the most authentic harbour in central Dalmatia and the best sunset on the route.',
      description:
        "Twenty miles southwest takes you to Komiža, the working fishing port on the western side of Vis. Vis is the most westerly inhabited Croatian island and the 1989 lifting of its closed-zone military status is still visible in the relative absence of resort development. Komiža itself is small enough to walk in fifteen minutes — the working fishing fleet on the eastern side of the harbour, the Fishermen's Museum in the old Venetian tower (open afternoons), and the konoba scene built around grilled bogueroni and the indigenous Vugava white. Stern-to mooring with own anchor on the inner basin (sand and weed, mostly good holding) — outer wall is open to SW swell and unsuitable overnight. Vis is also where the British SOE and Tito's Partisans coordinated WWII operations — Tito's Cave on Mount Hum is open as a site, and the hike up gets you the best 360° view in central Dalmatia.",
      thingsToDo: [
        "Hike up Mount Hum (587 m) to Tito's WWII cave",
        'Walk the working fishing fleet on the eastern harbour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Visit the Fishermen's Museum in the Venetian tower",
        'Watch the open-Adriatic sunset from the harbour wall',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay — sand and weed, mostly good holding, harbour fee. Outer wall is exposed to SW swell. If SW gradient is forecast above 15 kn, push 6 nm north to Vis Town in St. George Bay, which is fully sheltered.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-vela-luka-korcula',
      routeFrom: 'Komiža',
      routeTo: 'Vela Luka (Korčula)',
      day: 5,
      mapPin: { desktop: { left: 44.1, top: 62.2 }, mobile: { left: 40, top: 56.9 } },
      shortDescription:
        'Blue Cave morning then 18 nm east to Vela Luka at the western end of Korčula. Day driven by the Blue Cave morning sun-angle window — Biševo first, then Ravnik Green Cave, then push east.',
      description:
        "The day is dictated by the sun angle inside the Blue Cave on Biševo: the underwater opening lights the cavern interior an unreal ultramarine only between roughly 09:00 and 11:00. Tie alongside the small concession quay outside the entrance (no overnight, lunchtime fee paid at the kiosk) and queue for one of the official tenders that ferry visitors inside. Forty minutes in and out, then the short hop east to Ravnik islet and the Green Cave (Zelena špilja) — open to private dinghies, easier and quieter. By early afternoon the route pushes 18 miles east to Korčula's Vela Luka, the deep west-facing harbour at the end of the island. Excellent shelter from N to E, full town services, fuel pump at the western end of the quay. Konoba dinner runs on žrnovski makaruni, the hand-rolled local pasta.",
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Dinghy into the Green Cave at Ravnik (private entry allowed)',
        'Sail past the south face of Vis on the leg east',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Walk the Vela Luka waterfront promenade at dusk',
      ],
      mooringTip:
        'Vela Luka offers stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Holding is excellent in mud and sand. Bay is fully sheltered from N, NE and E.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vela-luka.webp', alt: 'Vela Luka' }],
    },
    {
      id: 'vela-luka-lastovo-zaklopatica-bay',
      routeFrom: 'Vela Luka',
      routeTo: 'Lastovo (Zaklopatica Bay)',
      day: 6,
      mapPin: { desktop: { left: 50.6, top: 76.7 }, mobile: { left: 45.4, top: 64.3 } },
      shortDescription:
        '14 nm south to Lastovo, the most isolated inhabited Adriatic island and a designated Nature Park. Zaklopatica is the natural overnight — five konobas hang free buoys, the lowest light pollution in Croatia.',
      description:
        "Fourteen miles south takes you to Lastovo — a Nature Park, the lowest light pollution in Croatia, the quietest island in the central Adriatic in season. Zaklopatica is the natural overnight: a U-shaped bay carved into the north coast with a low islet across the entrance breaking any swell, and five family-run konobas that each maintain a string of free mooring buoys for guests who eat ashore. Anchoring on bottom is discouraged because of the seagrass meadow. Lastovo's signature dishes are the local lobster (jastog) and šporki makaruli, a rustic beef-and-pasta stew. On a clear August evening the Milky Way is visible directly overhead before midnight.",
      thingsToDo: [
        "Pick up a konoba's free buoy in exchange for dinner",
        'Order Lastovo lobster (jastog) or šporki makaruli',
        'Walk the path inland to the Lastovo Town fumari (chimney stacks)',
        'Snorkel the islet at the bay entrance',
        'Stay on deck for the Milky Way after midnight',
      ],
      mooringTip:
        'Free konoba mooring buoys at Zaklopatica — confirm with the konoba on arrival, dinner reservation locks the buoy. Bay is fully sheltered from N to W; if SE forecast above 15 kn, move 4 nm south through the channel to Skrivena Luka.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zaklopatica.webp', alt: 'Zaklopatica' }],
    },
    {
      id: 'lastovo-mljet-polace',
      routeFrom: 'Lastovo',
      routeTo: 'Mljet (Polače)',
      day: 7,
      mapPin: { desktop: { left: 72.4, top: 80.6 }, mobile: { left: 69.2, top: 64.1 } },
      shortDescription:
        '22 nm northeast to Mljet — the long Polače inlet on the north coast holds Roman ruins on the waterfront and gives walking access to the saltwater lakes of Mljet National Park.',
      description:
        "Twenty-two miles northeast takes you to Polače, the long fjord-like inlet on Mljet's north coast that serves as the western landing of Mljet National Park. The bay is one of the best-sheltered overnight options on the entire south Croatian coast — fully protected from N, NE, E and SE — and the entrance is unobtrusive until you are inside it. Pick up one of the green Park mooring buoys (overnight fee paid at the ranger kiosk on the waterfront, includes Park entry for the crew) or take a stern-to slot at the small village pontoon. The remains of a 4th-century Roman complex sit metres from the waterfront. From Polače a 30-minute walk leads to Veliko Jezero, the larger of Mljet's two saltwater lakes, where a small Park ferry runs out to the 12th-century Benedictine monastery on St. Mary's islet.",
      thingsToDo: [
        'Pick up a Park buoy and pay the ranger on arrival',
        'Walk through the 4th-century Roman complex on the waterfront',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Hike the 9 km lake-loop trail through the National Park',
        'Swim in the saltwater lakes (cooler than the open sea)',
      ],
      mooringTip:
        'Polače uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is one of the best-sheltered overnight options on the entire south coast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mljet.webp', alt: 'Mljet' }],
    },
    {
      id: 'mljet-dubrovnik',
      routeFrom: 'Mljet',
      routeTo: 'Dubrovnik',
      day: 8,
      mapPin: { desktop: { left: 90.8, top: 85.6 }, mobile: { left: 89.9, top: 67.7 } },
      shortDescription:
        '24 nm southeast to ACI Marina Dubrovnik in Komolac — eight kilometres up the Rijeka Dubrovačka inland from the Old City. Old Port is daytime tender stop only.',
      description:
        'Twenty-four miles southeast brings you to Dubrovnik — but operationally to the marina eight kilometres inland: every charter yacht overnights at ACI Marina Dubrovnik in Komolac, set up the long fjord-like Rijeka Dubrovačka river estuary. The marina has lazy lines, water and power on every berth, fuel pontoon, restaurants. The Old Port on the seafront is a small, picturesque, UNESCO surface, but it accepts daytime visitors only, is exposed to S gradient, and is crowded with tour-boat tenders all season. From the marina pontoon, Bus 1A or a taxi takes you to the Pile Gate of the Old City in 15 minutes. The walls walk is mandatory: 1.94 km circuit, 90 minutes.',
      thingsToDo: [
        'Walk the 1.94 km Old City wall circuit before sunset',
        'Take the cable car up to Mt. Srđ for the panorama',
        'Eat down a Prijeko side street, off the main Stradun',
        "Visit the Rector's Palace and the Franciscan cloister",
        'Stand a drink at Buža bar, on the rocks outside the south wall',
      ],
      mooringTip:
        'ACI Marina Dubrovnik in Komolac is the only practical overnight — book ahead in season, lazy lines, full services. Old Port is a daytime tender stop only. Allow 30 minutes door-to-door from the marina pontoon to Pile Gate by Bus 1A or taxi.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/dubrovnik.webp', alt: 'Dubrovnik' }],
    },
    {
      id: 'dubrovnik-okuklje-mljet',
      routeFrom: 'Dubrovnik',
      routeTo: 'Okuklje (Mljet)',
      day: 9,
      mapPin: { desktop: { left: 81.6, top: 79.3 }, mobile: { left: 82.2, top: 65.9 } },
      shortDescription:
        '20 nm back northwest to Okuklje on Mljet’s southeast coast — outside the National Park, three family konobas hanging free buoys for guests who eat ashore. Tight U-shaped bay walled by 100-metre hills, fully sheltered N, E and S; black risotto is the standby.',
      description:
        "Twenty miles northwest takes you to Okuklje, on Mljet's southeast coast — outside the National Park boundary, no Park fees, three family konobas and a tight U-shaped bay that takes maybe twenty boats. The konobas hang their own free mooring buoys for guests who eat ashore — pick up a buoy, dinghy in, choose a konoba, lock the buoy by booking the table. Black risotto (crni rižot, cooked with cuttlefish ink and the day's catch) is the standby. The bay is shaped like a long crescent walled by 100-metre hills on three sides, so the wind drops dead at sunset regardless of the gradient outside.",
      thingsToDo: [
        'Pick up a free konoba buoy and book dinner ashore',
        'Order black risotto (crni rižot) cooked with cuttlefish ink',
        'Walk the headland path for the view down to Korčula',
        'Swim straight from the boat in flat water',
        'Sleep with no town noise — the quietest stop of the route',
      ],
      mooringTip:
        'Free konoba buoys at Okuklje, dinner reservation locks the buoy. Bay is fully sheltered N, E and S; only NW gradient above 18 kn pushes any noticeable swell into the entrance.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/okuklje.webp', alt: 'Okuklje' }],
    },
    {
      id: 'okuklje-korcula-town',
      routeFrom: 'Okuklje',
      routeTo: 'Korčula Town',
      day: 10,
      mapPin: { desktop: { left: 58.6, top: 65.4 }, mobile: { left: 54.9, top: 57.2 } },
      shortDescription:
        '15 nm northwest along the Pelješac Channel to Korčula Town — walled medieval port, the precursor to Venetian radial street grids, with a Moreška sword-dance Mon and Thu evenings.',
      description:
        'Fifteen miles northwest along the Pelješac Channel takes you to Korčula Town. The skyline is unmistakable from offshore: a peninsula of red roofs, a single bell tower, the limestone curtain wall sliding down to the sea on three sides. ACI Marina Korčula sits on the eastern side of the peninsula and offers full services with lazy lines; alternatively the town quay on the western side accepts a few stern-to boats with own anchor for a harbour fee. The Old Town fits in the palm of your hand but the layout is famously the precursor to Venetian radial grids. Headline stops: the Cathedral of St. Mark (climb the bell tower for the channel view), the (debated) Marco Polo House, the Land Gate. Moreška sword-dance Mon and Thu evenings 21:00.',
      thingsToDo: [
        'Watch the Moreška sword dance (Mon and Thu evenings in season)',
        'Walk the Old Town at dusk after the ferries leave',
        "Climb the bell tower of St. Mark's Cathedral",
        'Visit the (debated) Marco Polo House',
        'Pair dinner with a glass of indigenous Grk white from Lumbarda',
      ],
      mooringTip:
        'ACI Marina Korčula on the eastern side is the all-weather option — lazy lines, water, power, full services. Town quay on the western side accepts stern-to with own anchor but is exposed to W Maestral; rolly after 14:00.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/korcula.webp', alt: 'Korcula' }],
    },
    {
      id: 'korcula-jelsa-hvar',
      routeFrom: 'Korčula',
      routeTo: 'Jelsa (Hvar)',
      day: 11,
      mapPin: { desktop: { left: 46.8, top: 51.8 }, mobile: { left: 46.8, top: 51.8 } },
      shortDescription:
        '23 nm northwest across the Hvar Channel into Jelsa on the central north coast of Hvar — quieter alternative to Hvar Town, with the lavender belt running inland.',
      description:
        "Twenty-three miles northwest from Korčula across the Hvar Channel into Jelsa — the third-largest town on Hvar island, set on the central north coast. The town quay accepts stern-to with own anchor for a harbour fee (good holding in mud and sand), and a small marina on the eastern side handles boats that need lazy lines. Jelsa is the working heart of Hvar's interior agriculture: the lavender belt that fills the road inland to Vrboska and Stari Grad still produces commercial yields each July, and the konobas in the back lanes lean on the local Bogdanjuša white wine. Two strong afternoon options: bike the three miles along the coast road to Vrboska, or walk inland through the UNESCO Stari Grad Plain (one of the oldest continuously cultivated landscapes in Europe).",
      thingsToDo: [
        'Bike the 3 nm coast road to Vrboska’s canal-bridged old centre',
        'Walk inland through the UNESCO Stari Grad Plain',
        'Order Bogdanjuša white at a back-lane konoba',
        'Sample Hvar lavender oil at a producer in season',
        'Climb up to the Tor watchtower for the channel view',
      ],
      mooringTip:
        'Stern-to on the Jelsa town quay with own anchor — modest harbour fee, water and power on the central section. Bay is well-sheltered from S, SE and SW; small marina on the eastern side has lazy lines and is the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/jelsa.webp', alt: 'Jelsa' }],
    },
    {
      id: 'jelsa-lucice-bay-brac',
      routeFrom: 'Jelsa',
      routeTo: 'Lučice Bay (Brač)',
      day: 12,
      mapPin: { desktop: { left: 46.9, top: 43.6 }, mobile: { left: 43.7, top: 42.9 } },
      shortDescription:
        '10 nm north across the Brač Channel to Lučice — chain of small adjoining bays just east of Pučišća. No town, no quay, two seasonal beach restaurants with free buoys, cleanest swimming on the route.',
      description:
        'Ten miles north across the Brač Channel takes you to the south coast of Brač and the chain of small adjoining bays at Lučice, immediately east of Pučišća. There is no town — the headland is uninhabited, walled by white limestone cliffs and pine forest, and the only structures are the two seasonal beach restaurants that lay free mooring buoys for guests who eat ashore. The water here is exceptional: the famous white limestone of Brač gives the seabed its characteristic pale floor, and the visibility runs to 20 metres on a calm summer day.',
      thingsToDo: [
        'Pick up a free restaurant buoy in the central cove',
        'Snorkel over the white limestone seabed (20 m visibility)',
        'Order grilled fish and Plavac Mali ashore',
        'Dinghy 1 nm west into Pučišća to see the working stone-mason yards',
        'Stand-up paddle the headland coast at sunrise',
      ],
      mooringTip:
        'Free restaurant buoys at Lučice — dinner ashore secures the buoy. Anchoring on bottom possible (8–12 m, sand and weed) if buoys are full. Bays are sheltered from N, NE and E; exposed to S gradient.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lucice.webp', alt: 'lucice' }],
    },
    {
      id: 'lucice-bay-maslinica-solta',
      routeFrom: 'Lučice Bay',
      routeTo: 'Maslinica (Šolta)',
      day: 13,
      mapPin: { desktop: { left: 35.4, top: 36.7 }, mobile: { left: 28.9, top: 38.1 } },
      shortDescription:
        '14 nm northwest to Maslinica on Šolta’s western tip — the only proper natural harbour on Šolta, fully sheltered behind a chain of seven islets at the entrance.',
      description:
        'Fourteen miles northwest to Maslinica, the deep S-shaped natural harbour at the western tip of Šolta. The chain of seven islets at the entrance kills any swell from the open Adriatic. Mooring is split between Martinis Marchi Marina on the south side (lazy lines, 18th-century baroque-castle hotel attached) and the village quay on the north side (stern-to with own anchor for a modest fee). Šolta is the closest island to Split (15 miles out) but the quietest in the central Dalmatian group — the konobas in the village square run on Šoltansko olive oil and the indigenous Dobričić red.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead. Village quay (north side) takes stern-to with own anchor. Bay is fully sheltered from S, SW, W and NW thanks to the islet chain at the entrance.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-sibenik',
      routeFrom: 'Maslinica',
      routeTo: 'Šibenik',
      day: 14,
      mapPin: { desktop: { left: 20.8, top: 14.2 }, mobile: { left: 8.7, top: 24.3 } },
      shortDescription:
        '30 nm northwest back into ACI Marina Šibenik (or D-Marin Mandalina) for the Saturday handover by 09:00. Long final leg — early start, pass the south coast of Brač and Šolta on the way north.',
      description:
        "The final leg is thirty miles northwest from Maslinica back into the Šibenik charter cluster. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked. Most Boat4You boats out of Šibenik are based at ACI Marina Šibenik (in the inner harbour, walking distance to St. James' Cathedral) or D-Marin Mandalina (on the south side of the river estuary, full services). Allow an early start — the prevailing summer winds are favourable on this heading and the channel into the river estuary is well-marked.",
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk to St. James' Cathedral, UNESCO-listed",
        'Visit the medieval Šibenik town walls and St. Michael fortress',
        'Take a final swim at one of the small bays on Brač south coast',
        'Stand a long lunch on the Šibenik Riva before the transfer',
      ],
      mooringTip:
        'Return into your booked Boat4You base — ACI Marina Šibenik or D-Marin Mandalina, whichever is on your charter contract. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sibenik.webp', alt: 'Šibenik' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Šibenik – Dubrovnik – Šibenik Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Šibenik – Dubrovnik – Šibenik Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(sibenikDubrovnikSibenikRoute);
