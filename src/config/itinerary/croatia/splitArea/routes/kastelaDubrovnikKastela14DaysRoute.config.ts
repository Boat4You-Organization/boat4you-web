import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const kastelaDubrovnikKastela14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Kaštela to Dubrovnik Round-Trip Yacht Route | Boat4You',
  metaDesc:
    '14-day yacht route from Kaštela south to Dubrovnik via Šolta, Vis, Lastovo & Mljet — return via Korčula, Hvar & Brač. Sailor brief with NM.',
  id: 'kastela-dubrovnik-kastela-14day-route',
  startingPoint: 'Kaštela',
  otherPoints: ['Dubrovnik', 'Kaštela (14 Days)'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/kastela-dubrovnik-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/hvar-banner-large.webp',
      alt: 'Hvar',
    },
    {
      src: '/images/itinerary/croatia/banners/korcula-banner-large.webp',
      alt: 'Korcula',
    },
    {
      src: '/images/itinerary/croatia/banners/dubrovnik-banner.webp',
      alt: 'Dubrovnik',
    },
    {
      src: '/images/itinerary/croatia/banners/mljet-banner.webp',
      alt: 'Mljet',
    },
  ],
  routeDays: [
    {
      id: 'kastela-maslinica-solta',
      routeFrom: 'Kaštela',
      routeTo: 'Maslinica (Šolta)',
      day: 1,
      mapPin: {
        desktop: { left: 31.8, top: 34.8 },
        mobile: { left: 24.3, top: 39 },
      },
      shortDescription:
        '13 nm southwest from Marina Kaštela across the Split Channel to Maslinica on Šolta — the only proper natural harbour on the island and a soft, low-distance opener while you find your sea legs.',
      description:
        'Out of Marina Kaštela the route turns immediately southwest, leaving Split off the port quarter for the 13-mile crossing to Maslinica on the western tip of Šolta. Kaštela is the largest charter base in Croatia by berth count, so the channel can be busy on a Saturday afternoon — give the outgoing fleet a wide berth and aim for the chain of seven small islets that mark the entrance to Maslinica Bay. The bay is S-shaped, walled by hills on the village side and broken open seaward by the islet chain, which kills any swell from the open Adriatic. Mooring is split between Martinis Marchi Marina on the south side (lazy lines, 18th-century baroque-castle hotel attached) and the village quay on the north side (stern-to with own anchor, harbour fee). Šolta is the closest island to Split but the quietest in the whole central group — there is no day-tripper traffic and the konobas in the village square run on Šoltansko olive oil, the indigenous Dobričić red and not much else.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Watch the sunset from Polebrnjak islet west of the village',
        'Pick up Šoltansko olive oil at the village shop',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead in July–August. Village quay (north side) takes stern-to with own anchor, modest fee. Bay is fully sheltered from S, SW, W and NW thanks to the islet chain at the entrance; only N gradient (rare in summer) is exposed.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-milna-brac',
      routeFrom: 'Maslinica',
      routeTo: 'Milna (Brač)',
      day: 2,
      mapPin: {
        desktop: { left: 38.3, top: 41.2 },
        mobile: { left: 29.8, top: 41.2 },
      },
      shortDescription:
        '12 nm east across the Brač Channel into Milna, the most sheltered harbour on Brač’s western coast. The shortest passage of the route — leave at 09:30, anchored or moored by lunch.',
      description:
        "Twelve miles east across the Brač Channel takes you to Milna, the deep, narrow inlet on the western side of Brač that has been a working harbour since the Venetian era. The entrance is unmistakable: the 17th-century parish church on the inner quay marks the line, the bay narrows in past the church and offers stern-to mooring with own anchor for the entire inner half of the harbour. The outer half is the anchorage — drop the hook in 6–10 metres of sand and take a stern line to the rocks if Maestral picks up in the afternoon. Brač is famous for two things, the white limestone (the same stone used for Diocletian's Palace and quarried for centuries at Pučišća on the north coast) and the lamb under the peka, which is the village's Sunday lunch tradition the whole year round. Order the peka by 14:00 — three hours of slow cooking under hot embers is non-negotiable — then fill the gap with a swim and a walk to the small church on the headland.",
      thingsToDo: [
        'Order the peka by 14:00 to eat at 18:00',
        'Walk to the parish church on the inner quay',
        'Anchor with stern line to rocks in the outer bay',
        'Pick up Brač olive oil at the village agricultural cooperative',
        'Dinghy 3 nm north to Bobovišća for a glassy sunset swim',
      ],
      mooringTip:
        'Stern-to on the inner town quay with own anchor — modest harbour fee, water and power on the central section. Outer bay accepts free anchoring with stern line to rocks (the standard configuration for charter yachts here). Open SW to W; if afternoon Maestral builds above 15 kn, the inner quay stays comfortable.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/milna.webp', alt: 'Milna' }],
    },
    {
      id: 'milna-palmizana-hvar',
      routeFrom: 'Milna',
      routeTo: 'Palmižana (Hvar)',
      day: 3,
      mapPin: {
        desktop: { left: 35.7, top: 51.6 },
        mobile: { left: 31.3, top: 47.3 },
      },
      shortDescription:
        '15 nm southeast across the Hvar Channel into the Pakleni archipelago. Palmižana is the only inhabited islet in the chain and the only one with a marina — the rest are anchorage-only lunchtime stops.',
      description:
        "From Milna the leg bends southeast for 15 miles across the Hvar Channel into the Pakleni Islands, the long string of pine-covered islets that screen the southern approach to Hvar Town. The chain runs a few miles offshore: outermost is Sv. Klement (the largest), then Marinkovac, then a string of smaller islets ending at Jerolim and Galešnik. Palmižana sits on the eastern side of Sv. Klement and is the only one of the cluster with a marina — Palmižana ACI Marina, with stern-to lazy-line slots and limited summer capacity (book online for July and August or expect to anchor). The main bay holds in 5–10 metres on a sand-and-weed bottom but turns rolly when the Maestral funnel kicks in around 14:00, so the more comfortable overnight options are the south-side coves: Vinogradišće and Tarsce, both holding well in W gradient with line ashore the standard configuration. The afternoon ritual on Palmižana is the Meneghello family's 1906 botanical garden, the four konobas spread along the bay, and the snorkelling over the submerged Roman amphorae off the western shore.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        'Walk Meneghello’s 1906 botanical garden',
        'Anchor with line ashore in Vinogradišće if the marina is full',
        'Take the water taxi across to Hvar Town for the evening',
        'Walk the path across Sv. Klement to Vlaka Bay',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, online booking essential for July–August. If full, anchor in Vinogradišće cove (south side, sand and weed, line ashore standard) — better protection from afternoon W. Avoid the main Palmižana bay overnight when SW gradient builds.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/palmizana.webp',
          alt: 'Palmizana',
        },
      ],
    },
    {
      id: 'palmizana-komiza-vis',
      routeFrom: 'Palmižana',
      routeTo: 'Komiža (Vis)',
      day: 4,
      mapPin: {
        desktop: { left: 30.2, top: 57.6 },
        mobile: { left: 20.6, top: 51.5 },
      },
      shortDescription:
        '23 nm southwest into Komiža on the western side of Vis — the most westerly inhabited Croatian island, until 1989 a closed Yugoslav military zone, and still the most authentic working fishing port in the central Adriatic.',
      description:
        "Twenty-three miles southwest from the Pakleni cluster takes you to Vis, the most westerly inhabited Croatian island and a place that still feels like the Adriatic of three decades ago. Until 1989 Vis was a closed Yugoslav military zone — no foreign visitors allowed — and the absence of resort development from that era is visible everywhere on the island. Komiža sits on the western side, a working fishing port wrapped around a small bay; the harbour is split between the inner basin (stern-to with own anchor on a sand-and-weed bottom, mostly good holding) and the outer wall (open to SW swell, unsuitable overnight). The town is small enough to walk in fifteen minutes: the working fleet is still tied up on the eastern side of the harbour, the Fishermen's Museum in the old Venetian tower is open afternoons, and the konoba scene runs to grilled bogueroni and the indigenous Vugava white. Vis is also where the British SOE and Tito's Partisans coordinated WWII operations — Tito's Cave on Mount Hum is open as a site, and the hike up gets you the best 360° view in central Dalmatia.",
      thingsToDo: [
        'Walk the working fishing fleet at golden hour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Hike up Mount Hum (587 m) to Tito's WWII cave",
        "Visit the Fishermen's Museum in the Venetian tower",
        'Dinghy across to Mali Barjak islet for snorkelling',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay — sand and weed, mostly good holding, harbour fee. Outer wall is exposed to SW swell and not safe overnight. If the SW gradient is forecast above 15 kn, push 6 nm north to Vis Town in St. George Bay, which is fully sheltered.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/komiza.webp',
          alt: 'Komiza',
        },
      ],
    },
    {
      id: 'komiza-blue-cave-bisevo-green-cave-ravnik-vela-luka-korcula',
      routeFrom: 'Komiža',
      routeTo: 'Blue Cave (Biševo) → Green Cave (Ravnik) → Vela Luka (Korčula)',
      day: 5,
      mapPin: {
        desktop: { left: 47.1, top: 66.5 },
        mobile: { left: 41.6, top: 57 },
      },
      shortDescription:
        'Two-cave morning then 18 nm east to Vela Luka at the western end of Korčula. The Blue Cave on Biševo only lights up for two morning hours; everything else on the day flexes around that window.',
      description:
        "The day's calendar is dictated by the sun angle inside the Blue Cave on Biševo: the underwater opening lights the cavern interior an unreal ultramarine only between roughly 09:00 and 11:00, after which the colour fades. Tie alongside the small concession quay outside the entrance (no overnight, lunchtime fee paid at the kiosk) and queue for one of the official tenders that ferry visitors inside; private dinghies are not allowed in. Forty minutes in and out, then back on board for the short hop east to Ravnik islet and its Green Cave (Zelena špilja), which lights through a roof opening rather than underwater — open to private dinghies, easier and less crowded than Biševo, the floor of the cavern an emerald green when the sun is overhead. By early afternoon the route pushes 18 miles southeast to Korčula's Vela Luka, the deep west-facing harbour at the end of the island, with full town services, fuel, and one of the best-sheltered overnight bays on the entire south coast. Konoba dinner in the village — žrnovski makaruni, hand-rolled by a generation that still does it the right way.",
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Dinghy into the Green Cave at Ravnik (private entry allowed)',
        'Sail past the south face of Vis on the leg east',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Walk the Vela Luka waterfront promenade at dusk',
      ],
      mooringTip:
        'Vela Luka offers stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Holding is excellent in mud and sand. Bay is fully sheltered from N, NE and E; only S gradient above 18 kn pushes any swell into the inner harbour, and even then the inner pontoon stays comfortable.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/vela-luka.webp',
          alt: 'Vela luka',
        },
      ],
    },
    {
      id: 'vela-luka-lastovo-zaklopatica',
      routeFrom: 'Vela Luka',
      routeTo: 'Lastovo (Zaklopatica)',
      day: 6,
      mapPin: {
        desktop: { left: 51.2, top: 77.4 },
        mobile: { left: 47.9, top: 63.9 },
      },
      shortDescription:
        '14 nm south to Lastovo, the most isolated inhabited Adriatic island and a designated Nature Park. Zaklopatica is the obvious overnight: a U-shaped bay on the north coast with five konobas hanging free buoys for guests who eat ashore.',
      description:
        "From Vela Luka the heading bends south for 14 miles across to Lastovo — a Nature Park, the lowest light pollution in Croatia, and the quietest island in the central Adriatic in season. Zaklopatica is the natural overnight: a U-shaped bay carved into the north coast with a low islet across the entrance breaking any swell, and five family-run konobas that each maintain a string of free mooring buoys for guests who eat ashore. The mooring economics are simple — book a buoy and a dinner table at the same konoba. Anchoring on bottom is discouraged because of the seagrass meadow, but the buoy field has plenty of capacity outside July peak. Lastovo's signature dishes are the local lobster (jastog) — boats fish them daily on traps north of the island — and šporki makaruli, a rustic beef-and-pasta stew. Off the water there is little to do, which is the entire point. The island has the lowest light pollution rating in Croatia; on a clear August evening the Milky Way is visible directly overhead before midnight.",
      thingsToDo: [
        "Pick up a konoba's free buoy in exchange for dinner",
        'Order Lastovo lobster (jastog) or šporki makaruli',
        'Walk the path inland to the Lastovo Town fumari (chimney stacks)',
        'Snorkel the islet at the bay entrance',
        'Stay on deck for the Milky Way after midnight',
      ],
      mooringTip:
        'Free konoba mooring buoys at Zaklopatica — confirm with the konoba on arrival, dinner reservation locks the buoy. Anchoring on bottom is discouraged due to seagrass. Bay is fully sheltered from N to W; if SE forecast above 15 kn, move 4 nm south through the channel to Skrivena Luka (also called Portorus), the all-weather alternative.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/zaklopatica.webp',
          alt: 'Zaklopatica',
        },
      ],
    },
    {
      id: 'lastovo-mljet-polace',
      routeFrom: 'Lastovo',
      routeTo: 'Mljet (Polače)',
      day: 7,
      mapPin: {
        desktop: { left: 65.3, top: 76.1 },
        mobile: { left: 66, top: 63.1 },
      },
      shortDescription:
        '22 nm northeast to Mljet — the long Polače inlet on the north coast holds Roman ruins on the waterfront and gives walking access to the saltwater lakes of Mljet National Park.',
      description:
        "Mljet is a 22-mile run northeast from Lastovo, and the second half of the leg delivers the most dramatic landfall on the route: Polače, a long, walled inlet on Mljet's north coast, the entrance unobtrusive until you are inside it, then opening out into one of the best-sheltered overnight bays in southern Croatia. Polače is the western landing of Mljet National Park. The remains of a 4th-century Roman complex sit metres from the waterfront — the basilica walls and the corner tower are the obvious survivors and can be walked through with no fee. The bay is managed by the National Park: pick up one of the green Park buoys (overnight fee paid at the ranger kiosk on the waterfront, includes Park entry for the crew), or take a stern-to slot at the small village pontoon. From Polače a 30-minute walk leads to Veliko Jezero, the larger of Mljet's two saltwater lakes, where a small Park ferry runs out to the 12th-century Benedictine monastery on St. Mary's islet. The trail loops both lakes in about 9 km, swimming is allowed, and the cicadas are the only soundtrack you get.",
      thingsToDo: [
        'Pick up a Park buoy and pay the ranger on arrival',
        'Walk through the 4th-century Roman complex on the waterfront',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Hike the 9 km lake-loop trail through the National Park',
        'Swim in the saltwater lakes (cooler than the open sea)',
      ],
      mooringTip:
        'Polače uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is one of the best-sheltered overnight options on the entire south Croatian coast: fully protected N, NE, E and SE. Village pontoon also takes a few stern-to boats with own anchor.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mljet.webp', alt: 'Mljet' }],
    },
    {
      id: 'mljet-dubrovnik',
      routeFrom: 'Mljet',
      routeTo: 'Dubrovnik',
      day: 8,
      mapPin: {
        desktop: { left: 90.4, top: 85.1 },
        mobile: { left: 93, top: 71.7 },
      },
      shortDescription:
        '24 nm southeast to ACI Marina Dubrovnik in Komolac — eight kilometres up the Rijeka Dubrovačka inland from the Old City. The Old Port is a daytime tender stop only; never an overnight option.',
      description:
        'The leg from Polače to Dubrovnik is 24 miles southeast and on a settled summer day the prevailing W Maestral fills in by mid-morning to push you down the coast. The destination on paper is Dubrovnik, but operationally it is the marina eight kilometres inland: every charter yacht overnights at ACI Marina Dubrovnik in Komolac, set up the long fjord-like Rijeka Dubrovačka river estuary. The marina has lazy lines, water and power on every berth, fuel pontoon, restaurants, and a chandler — the lot. The Old Port on the seafront is a small, picturesque, UNESCO surface, but it accepts daytime visitors only, is exposed to S gradient, and is crowded with tour-boat tenders all season. From the marina pontoon, Bus 1A or a taxi takes you to the Pile Gate of the Old City in 15 minutes. The Old City walk is mandatory: start at Pile, climb onto the walls, walk the full 1.94 km circuit (90 minutes including a few stops), then drop down into the Stradun for dinner in the back lanes off Prijeko.',
      thingsToDo: [
        'Walk the 1.94 km Old City wall circuit before sunset',
        'Take the cable car up to Mt. Srđ for the panorama',
        'Eat down a Prijeko side street, off the main Stradun',
        "Visit the Rector's Palace and the Franciscan cloister",
        'Stand a drink at Buža bar, on the rocks outside the south wall',
      ],
      mooringTip:
        'ACI Marina Dubrovnik in Komolac is the only practical overnight — book ahead in season, lazy lines, full services. Old Port is a daytime tender stop only, never overnight; exposed to S gradient and saturated with tour boats. Allow 30 minutes door-to-door from the marina pontoon to Pile Gate by Bus 1A or taxi.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/dubrovnik.webp',
          alt: 'Dubrovnik',
        },
      ],
    },
    {
      id: 'dubrovnik-okuklje-mljet',
      routeFrom: 'Dubrovnik',
      routeTo: 'Okuklje (Mljet)',
      day: 9,
      mapPin: {
        desktop: { left: 75.4, top: 80.8 },
        mobile: { left: 75.5, top: 66.6 },
      },
      shortDescription:
        '20 nm back northwest along Mljet’s south-east coast to Okuklje — outside the National Park boundary, three konoba buoy fields, no town, no day-trippers. The deliberate quiet stop after the Dubrovnik noise.',
      description:
        "The first leg of the return runs 20 miles northwest, and the destination — Okuklje, on Mljet's southeast coast — is deliberately the opposite of what you just walked away from: no town, no day-tripper traffic, no Park fees (Okuklje sits outside the National Park boundary), three family konobas and a tight U-shaped bay that takes maybe twenty boats. The konobas hang their own free mooring buoys for guests who eat ashore — pick up a buoy, dinghy in, choose a konoba, lock the buoy by booking the table. Black risotto (crni rižot, cooked with cuttlefish ink and the day's catch) and grilled bream are the standbys. The bay is shaped like a long crescent walled by 100-metre hills on three sides, so the wind drops dead at sunset regardless of the gradient outside, and the night is silent except for the sea on the rocks at the entrance. Off the boat the move is to swim once before lunch, then walk the path that loops the headland — the southern view down to the Pelješac Channel and Korčula is the reward.",
      thingsToDo: [
        'Pick up a free konoba buoy and book dinner ashore',
        'Order black risotto (crni rižot) cooked with cuttlefish ink',
        'Walk the headland path for the view down to Korčula',
        'Swim straight from the boat in flat water',
        'Sleep with no town noise — the quietest stop of the route',
      ],
      mooringTip:
        'Free konoba buoys at Okuklje, dinner reservation locks the buoy — confirm on arrival. Anchoring on the bottom is possible but holding is patchy in seagrass. Bay is fully sheltered N, E and S; only NW gradient above 18 kn pushes any noticeable swell into the entrance, and even then the inner part of the bay stays comfortable.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/okuklje.webp',
          alt: 'Okuklje',
        },
      ],
    },
    {
      id: 'okuklje-korcula-town',
      routeFrom: 'Okuklje',
      routeTo: 'Korčula Town',
      day: 10,
      mapPin: {
        desktop: { left: 58.1, top: 64.5 },
        mobile: { left: 53.2, top: 55.4 },
      },
      shortDescription:
        '15 nm northwest along the Pelješac Channel to Korčula Town — the walled medieval port on the eastern tip of Korčula, with a layout often described as the precursor to the Venetian radial street grid.',
      description:
        'Fifteen miles northwest along the Pelješac Channel takes you to Korčula Town, the walled medieval port on the eastern tip of Korčula island. The skyline is unmistakable from offshore: a peninsula of red roofs, a single bell tower, the limestone curtain wall sliding down to the sea on three sides. ACI Marina Korčula sits on the eastern side of the peninsula and offers full services with lazy lines; alternatively the town quay on the western side accepts a few stern-to boats with own anchor for a harbour fee — closer to the gates but exposed to W Maestral and rolly when the channel funnel kicks in around 14:00. The Old Town fits in the palm of your hand — a ten-minute walk gets you across it — but the layout is famously the precursor to the radial grids the Venetians later used elsewhere. Headline stops are the Cathedral of St. Mark (climb the bell tower for the channel view), the (debated) Marco Polo House, and the Land Gate with its surviving Venetian relief. Best time to walk it is dusk, after the day-trip ferries have left for Split.',
      thingsToDo: [
        'Walk the Old Town at dusk after the ferries leave',
        'Climb the bell tower of St. Mark’s Cathedral',
        'Visit the (debated) Marco Polo House',
        'Order fish brodet at a courtyard konoba in the back lanes',
        'Watch a Moreška sword dance performance (Mon and Thu in season)',
      ],
      mooringTip:
        'ACI Marina Korčula on the eastern side is the all-weather option — lazy lines, water, power, full services. Town quay on the western side accepts stern-to with own anchor but is exposed to W Maestral; rolly after 14:00 in summer. If the channel turns rough, the sheltered alternative is Lumbarda Bay 3 nm southeast.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/korcula.webp',
          alt: 'Korcula',
        },
      ],
    },
    {
      id: 'korcula-jelsa-hvar',
      routeFrom: 'Korčula',
      routeTo: 'Jelsa (Hvar)',
      day: 11,
      mapPin: {
        desktop: { left: 44.3, top: 48.5 },
        mobile: { left: 42.7, top: 47.2 },
      },
      shortDescription:
        '23 nm northwest across the Hvar Channel into Jelsa on the central north coast of Hvar — the quieter alternative to Hvar Town, with the lavender belt running inland from the harbour and the UNESCO Stari Grad Plain a short walk away.',
      description:
        "Twenty-three miles northwest from Korčula across the Hvar Channel into Jelsa — the third-largest town on Hvar island, set on the central north coast, and roughly half the size and a quarter of the noise of Hvar Town on the south side. The bay is wide and well-sheltered from southern gradients; the town quay accepts stern-to with own anchor for a harbour fee (good holding in mud and sand), and a small marina on the eastern side handles boats that need lazy lines and shore power overnight. Jelsa is the working heart of Hvar's interior agriculture: the lavender belt that fills the road inland to Vrboska and Stari Grad still produces commercial yields each July, and the konobas in the back lanes of the town lean on the local Bogdanjuša white wine and the Faros (the Greek-name) cheese. Two strong afternoon options: bike the three miles along the coast road to Vrboska, sometimes called 'the little Venice of Hvar' for its canal-bridged centre, or walk inland through the Stari Grad Plain — UNESCO-listed, one of the oldest continuously cultivated landscapes in Europe (since 384 BC).",
      thingsToDo: [
        'Bike the 3 nm coast road to Vrboska’s canal-bridged old centre',
        'Walk inland through the UNESCO Stari Grad Plain',
        'Order Bogdanjuša white at a back-lane konoba',
        'Sample Hvar lavender oil at a producer in season',
        'Climb up to the Tor watchtower for the channel view',
      ],
      mooringTip:
        'Stern-to on the Jelsa town quay with own anchor — modest harbour fee, water and power on the central section. Bay is well-sheltered from S, SE and SW; exposed to N gradient, which is rare in summer except during the late-season Bora. Small marina on the eastern side has lazy lines and is the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/jelsa.webp', alt: 'Jelsa' }],
    },
    {
      id: 'jelsa-lucice-bay-brac',
      routeFrom: 'Jelsa',
      routeTo: 'Lučice Bay (Brač)',
      day: 12,
      mapPin: {
        desktop: { left: 41.3, top: 44.8 },
        mobile: { left: 36, top: 42.5 },
      },
      shortDescription:
        '10 nm north across the Brač Channel to Lučice — a chain of small adjoining bays just east of Pučišća. No town, no quay, two seasonal beach restaurants with free buoys, and the cleanest swimming on the route.',
      description:
        "Ten miles north across the Brač Channel takes you to the south coast of Brač and the chain of small adjoining bays at Lučice, immediately east of Pučišća. There is no town — the headland is uninhabited, walled by white limestone cliffs and pine forest, and the only structures are the two seasonal beach restaurants that lay free mooring buoys for guests who eat ashore. Pick up a buoy in the deepest of the three coves, dive overboard, and the day is essentially that. The water here is exceptional: the famous white limestone of Brač (the same stone used for Diocletian's Palace and reportedly parts of the White House in Washington) gives the seabed its characteristic pale floor, and the visibility runs to 20 metres on a calm summer day. The two restaurants do simple grilled fish and the local Plavac Mali red. There is no nightlife, no shops, and that is the entire reason to stop here. If buoys are full, anchoring is fine on bottom in 8–12 metres on a sand-and-weed mix.",
      thingsToDo: [
        'Pick up a free restaurant buoy in the central cove',
        'Snorkel over the white limestone seabed (20 m visibility)',
        'Order grilled fish and Plavac Mali ashore',
        'Dinghy 1 nm west into Pučišća to see the working stone-mason yards',
        'Stand-up paddle the headland coast at sunrise',
      ],
      mooringTip:
        'Free restaurant buoys at Lučice — dinner ashore secures the buoy, confirm with the restaurant on arrival. Anchoring on bottom is possible (8–12 m, sand and weed) if buoys are full. Bays are sheltered from N, NE and E; exposed to S gradient. If S forecast above 15 kn, push 1 nm west into Pučišća harbour, which is fully enclosed.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lucice.webp', alt: 'lucice' }],
    },
    {
      id: 'lucice-krknjasi-bay',
      routeFrom: 'Lučice',
      routeTo: 'Krknjaši Bay',
      day: 13,
      mapPin: {
        desktop: { left: 28.9, top: 33 },
        mobile: { left: 20.1, top: 33.9 },
      },
      shortDescription:
        '15 nm northwest to Krknjaši Bay between the two Drvenik islands — a glass-water swim anchorage 4 nm west of the Trogir base, ideal for the penultimate-day chill before Saturday handover.',
      description:
        'The last anchorage of the route is Krknjaši Bay, a 15-mile run northwest from Lučice, set in the channel between Veli Drvenik and Mali Drvenik — two small uninhabited islands four miles west of the Trogir charter base. Krknjaši is essentially a swim anchorage: the bay is shallow, the seabed is pale sand at 3–6 metres, the water turns turquoise on a calm day, and the holding is excellent. Three restaurants on Veli Drvenik (no road access — they are reached only by boat) lay free mooring buoys for guests, but with the shallow sand floor, anchoring is the more common choice and free. There is a tiny chapel on the eastern side of the bay, a footpath that loops the headland in 30 minutes, and no other infrastructure. The point of stopping here on Day 13 is logistical: Saturday return-to-base is 4 nm east into Marina Kaštela, so the morning is unrushed and the boat arrives at the base with the right amount of fuel and zero stress. Sunset over the open Adriatic from this position is the quiet farewell to the route.',
      thingsToDo: [
        'Anchor on the sand floor in 4–6 m and swim',
        'Walk the 30-minute headland loop on Veli Drvenik',
        'Order grilled fish at a Veli Drvenik beach restaurant',
        'Sample the local Plavac and rakija at a quayside table',
        'Watch the open-Adriatic sunset from the deck',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding (the standard choice — bay is shallow and forgiving). Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NE, E, S and SE; exposed only to W and NW. If W gradient forecast above 18 kn, push 4 nm east directly into Marina Kaštela.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/krknjasi.webp', alt: 'krknjasi' }],
    },
    {
      id: 'krknjasi-bay-kastela',
      routeFrom: 'Krknjaši Bay',
      routeTo: 'Kaštela',
      day: 14,
      mapPin: {
        desktop: { left: 36.6, top: 26.1 },
        mobile: { left: 28.9, top: 32.3 },
      },
      shortDescription:
        '4 nm east into Marina Kaštela for the Saturday handover by 09:00. Unrushed morning, a final swim, fuel pumped at the base pontoon, decks washed, then the airport transfer ten minutes inland.',
      description:
        "The last leg is the shortest on the entire 14-day round trip: four miles east from Krknjaši into Marina Kaštela, the Boat4You Split-area home base. Saturday handover protocol applies — the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. Marina Kaštela is one of the largest Adriatic marinas by berth count, sitting in a deep west-facing bay between Split and Trogir, and the run-in is straightforward in any visibility — the marina control tower is unmistakable from offshore. With fuel pumped and inspection clear, the marina is a fifteen-minute drive from Split airport and twenty-five minutes from the city centre. A long walk through Diocletian's Palace and a coffee on the Riva is the standard closing ritual, before the airport transfer. Most charter weeks end here on a satisfied silence — the route just covered is one of the longest and most scenic on the Adriatic.",
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk Diocletian's Palace one final time before the airport",
        'Take a final swim at Bačvice Beach east of the Old Town',
        'Pick up Šoltansko olive oil at the Pazar farmers market',
        'Stand a long lunch at a Riva café before the transfer',
      ],
      mooringTip:
        'Return into Marina Kaštela per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return. Fuel pontoon is on the western entrance side of the marina.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/kastela.webp',
          alt: 'Kastela',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Kaštela – Dubrovnik – Kaštela Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Kaštela – Dubrovnik – Kaštela Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(kastelaDubrovnikKastela14DaysRoute);
