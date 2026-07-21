import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const slanoKorculaHvarVisLastovo14dayRoute: ItineraryRoute = {
  metaTitle: '14-Day Slano–Korčula–Hvar–Vis Yacht Route | Boat4You',
  metaDesc:
    '14-day yacht route from Marina Frapa Slano via Mljet, Korčula, Vis (Blue Cave), Hvar Stari Grad & Lastovo — sailor brief with NM and mooring notes.',
  id: 'slano-korcula-hvar-vis-lastovo-14day-route',
  startingPoint: 'Slano',
  otherPoints: ['Korčula', 'Hvar', 'Vis', 'Lastovo', '14 Days'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/slano-hvar-vis-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/hvar-banner-large.webp',
      alt: 'Hvar',
    },
    {
      src: '/images/itinerary/croatia/banners/golden-horn-brac-banner-large.webp',
      alt: 'Golden horn, Brač',
    },
    {
      src: '/images/itinerary/croatia/banners/korcula-banner.webp',
      alt: 'Korčula',
    },
    {
      src: '/images/itinerary/croatia/banners/mljet-banner.webp',
      alt: 'Mljet',
    },
  ],
  routeDays: [
    {
      id: 'slano-sipan',
      routeFrom: 'Slano',
      routeTo: 'Šipan',
      day: 1,
      mapPin: {
        desktop: { left: 79.3, top: 72.3 },
        mobile: { left: 78.2, top: 60 },
      },
      shortDescription:
        '6 nm southwest from Marina Frapa Resort Slano into Šipanska Luka — Šipan is the largest of the Elaphiti chain and the natural soft kickoff before pushing west towards Mljet.',
      description:
        'Out of Marina Frapa Resort Slano, the opening leg is a short six miles southwest into Šipanska Luka — the largest village on Šipan, the largest of the three inhabited Elaphiti Islands. Slano sits at the head of a long, deep, fully-sheltered bay 25 miles northwest of Dubrovnik, and the marina has lazy lines, water and power, fuel pontoon at the entrance, hotel and restaurants on the marina grounds. The leg out is straightforward: clear the bay, push southwest along the coast, round the headland into Šipanska Luka. Šipan is the most agriculturally active of the three Elaphiti islets — olive groves, citrus, a few small konobas in the village of Suđurađ on the southeast coast, and the long, deep bay on the northwest side at Šipanska Luka where most of the charter overnight traffic lands. Stern-to mooring with own anchor on the village quay, modest fee, water and power. The afternoon move is to walk inland through the olive groves to Suđurađ village (45 minutes signed) — the small Skočibuha summer palace (16th-century fortified Renaissance country residence) is the headline historical stop.',
      thingsToDo: [
        'Walk the path to Suđurađ village and the Skočibuha palace',
        'Order black risotto at a Šipanska Luka konoba',
        'Sample Elaphiti olive oil at a small farm',
        'Swim from the rocks south of the village',
        'Take the dinghy across to Lopud for the afternoon',
      ],
      mooringTip:
        'Stern-to on Šipanska Luka village quay with own anchor — modest fee, water and power on the central berths. Bay is well-sheltered from S, SE and SW; exposed to N gradient (rare in summer). If N forecast above 18 kn, push back into Marina Frapa Resort Slano for the night.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/sipan.webp',
          alt: 'Sipan',
        },
      ],
    },
    {
      id: 'sipan-polace-mljet',
      routeFrom: 'Šipan',
      routeTo: 'Polače (Mljet)',
      day: 2,
      mapPin: {
        desktop: { left: 75.1, top: 74.7 },
        mobile: { left: 77.3, top: 63.8 },
      },
      shortDescription:
        '20 nm west to Polače on Mljet’s north coast — the western landing of Mljet National Park, with Roman ruins on the waterfront and walking access to the saltwater lakes inside the Park.',
      description:
        "Twenty miles west takes you to Polače, the long fjord-like inlet on Mljet's north coast that serves as the western landing of Mljet National Park. The bay is one of the best-sheltered overnight options on the entire south Croatian coast — fully protected from N, NE, E and SE — and the entrance is unobtrusive until you are inside it. Pick up one of the green Park mooring buoys (overnight fee paid at the ranger kiosk on the waterfront, includes Park entry for the crew) or take a stern-to slot at the small village pontoon. The remains of a 4th-century Roman complex sit metres from the waterfront — the basilica walls and the corner tower are the obvious survivors. From Polače a 30-minute walk leads to Veliko Jezero, the larger of Mljet's two saltwater lakes, where a small Park ferry runs out to the 12th-century Benedictine monastery on St. Mary's islet. The trail loops both lakes in about 9 km.",
      thingsToDo: [
        'Pick up a Park buoy and pay the ranger on arrival',
        'Walk through the 4th-century Roman complex on the waterfront',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Hike the 9 km lake-loop trail through the National Park',
        'Swim in the saltwater lakes (cooler than the open sea)',
      ],
      mooringTip:
        'Polače uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is one of the best-sheltered overnight options on the entire south coast: fully protected N, NE, E and SE.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/mljet.webp',
          alt: 'Mljet',
        },
      ],
    },
    {
      id: 'polace-korcula-town',
      routeFrom: 'Polače',
      routeTo: 'Korčula Town',
      day: 3,
      mapPin: {
        desktop: { left: 60, top: 69.2 },
        mobile: { left: 53.7, top: 55.3 },
      },
      shortDescription:
        '18 nm northwest along the Pelješac Channel into Korčula Town — walled medieval port, the precursor to Venetian radial street grids, with a Moreška sword-dance performance Mon and Thu evenings.',
      description:
        'Eighteen miles northwest along the Pelješac Channel takes you to Korčula Town, the walled medieval port on the eastern tip of Korčula island. The skyline is unmistakable from offshore: a peninsula of red roofs, a single bell tower, the limestone curtain wall sliding down to the sea on three sides. ACI Marina Korčula sits on the eastern side of the peninsula and offers full services with lazy lines; alternatively the town quay on the western side accepts a few stern-to boats with own anchor for a harbour fee. The Old Town fits in the palm of your hand — a ten-minute walk gets you across it — but the layout is famously the precursor to the radial grids the Venetians later used elsewhere. Headline stops: the Cathedral of St. Mark (climb the bell tower for the channel view), the (debated) Marco Polo House, the Land Gate. The Moreška sword-dance performance — a 16th-century theatrical sword combat between Christian and Moorish armies — runs Mon and Thu evenings in season.',
      thingsToDo: [
        'Watch the Moreška sword dance (Mon and Thu evenings in season)',
        'Walk the Old Town at dusk after the ferries leave',
        "Climb the bell tower of St. Mark's Cathedral",
        'Visit the (debated) Marco Polo House',
        'Order fish brodet at a courtyard konoba',
      ],
      mooringTip:
        'ACI Marina Korčula on the eastern side is the all-weather option — lazy lines, water, power, full services. Town quay on the western side accepts stern-to with own anchor but is exposed to W Maestral; rolly after 14:00. Lumbarda Bay 3 nm southeast is the sheltered alternative.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/korcula.webp',
          alt: 'Koručula',
        },
      ],
    },
    {
      id: 'korcula-scedro',
      routeFrom: 'Korčula',
      routeTo: 'Šćedro',
      day: 4,
      mapPin: {
        desktop: { left: 45.6, top: 57.1 },
        mobile: { left: 42, top: 51.3 },
      },
      shortDescription:
        '12 nm north into the channel between Korčula and Hvar to Šćedro — a small uninhabited island with two seasonal beach restaurants and free konoba buoys at Lovišće Bay.',
      description:
        'Twelve miles north into the channel between Korčula and Hvar takes you to Šćedro, a small uninhabited island sitting halfway between the two larger islands. There is no permanent population, no town, no infrastructure beyond two seasonal beach restaurants on the north coast that lay free mooring buoys for guests who eat ashore. The two main bays are Lovišće on the north (the larger, with more buoys) and Mostir on the south (smaller, quieter, with the ruins of a 14th-century Dominican monastery on the shore). Lovišće is the natural overnight: pick up a buoy, dinghy in, choose a konoba — both run grilled-fish menus and the local Plavac Mali. The afternoon move is to walk the path inland to the monastery ruins on the south coast (40 minutes one way) or just snorkel from the boat. Visibility runs to 25 metres on a calm summer day — the best on the route by a clear margin.',
      thingsToDo: [
        'Pick up a free konoba buoy at Lovišće Bay',
        'Walk the path to the 14th-century Dominican monastery ruins on Mostir',
        'Snorkel in 25-metre visibility water',
        'Order grilled fish and Plavac Mali ashore',
        'Sleep with no town noise — the quietest stop of the route',
      ],
      mooringTip:
        'Free konoba buoys at Lovišće on the north coast — dinner ashore secures the buoy, confirm on arrival. Anchoring on bottom possible (8–12 m, sand and weed) if buoys are full. Lovišće sheltered from S, SW and SE; if N gradient forecast above 15 kn, push around to Mostir Bay on the south coast.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/scedro.webp',
          alt: 'Šćedro',
        },
      ],
    },
    {
      id: 'scedro-vis-town',
      routeFrom: 'Šćedro',
      routeTo: 'Vis Town',
      day: 5,
      mapPin: {
        desktop: { left: 28.9, top: 61.2 },
        mobile: { left: 19.4, top: 55.7 },
      },
      shortDescription:
        '20 nm west to Vis Town on the north coast of Vis — set in the wide, fully-sheltered St. George Bay with the largest natural harbour on the island and Roman archaeological remains on the waterfront.',
      description:
        "Twenty miles west takes you to Vis Town, the larger of Vis island's two settlements, set on the north coast in the wide St. George Bay. The bay is fully sheltered from S, SW, W and NW; only N gradient (rare in summer) is exposed. Stern-to mooring with own anchor on the long curved seafront promenade for a modest harbour fee, water and power on the central berths. Vis Town was the seat of the Roman colony of Issa from 397 BC and the earliest Greek settlement on the entire eastern Adriatic; the surviving Roman thermae (baths) and the Hellenistic walls along the harbour promenade are the headline archaeological stops. The Austro-Hungarian Fort George above the town (19th-century, walking-accessible) gives the panoramic view east over the harbour. Konoba dinner runs on the indigenous Vugava white, peka-cooked octopus, and the local Plavac Mali red.",
      thingsToDo: [
        'Walk the Hellenistic walls along the harbour promenade',
        'Climb up to the Austro-Hungarian Fort George above the town',
        'Visit the Roman thermae (baths) on the seafront',
        'Order peka-cooked octopus at a Vis Town konoba (book 3 hours ahead)',
        'Sample Vugava white at a village wine producer',
      ],
      mooringTip:
        'Stern-to with own anchor on the long Vis Town seafront promenade — modest harbour fee, water and power on the central berths. Bay is fully sheltered from S, SW, W and NW; only N gradient is exposed. The most reliable overnight bay on Vis in any wind condition.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/vis.webp',
          alt: 'Vis',
        },
      ],
    },
    {
      id: 'vis-komiza',
      routeFrom: 'Vis',
      routeTo: 'Komiža',
      day: 6,
      mapPin: {
        desktop: { left: 28.6, top: 57.7 },
        mobile: { left: 21.5, top: 51.5 },
      },
      shortDescription:
        '6 nm clockwise around the western end of Vis to Komiža — working fishing port on the western side of the island, the most authentic harbour in central Dalmatia.',
      description:
        "The Day 6 leg is the shortest of the entire 14-day route — six miles clockwise around the western end of Vis from the north-coast harbour at Vis Town to the western-coast fishing port at Komiža. Komiža is the most authentic working harbour in central Dalmatia: the working fishing fleet is still on the eastern side of the harbour, the absence of resort development is immediately obvious, and the konoba scene runs to grilled bogueroni and the indigenous Vugava white. Stern-to mooring with own anchor on the inner basin of the town quay (sand-and-weed bottom, mostly good holding, harbour fee). The afternoon move is to hike up Mount Hum (587 m, the highest point on Vis) — the trail starts from the town and climbs through dry-stone-walled vineyards and pine forest in 90 minutes one way; the summit gives the best 360° view in central Dalmatia, with Italy visible on a clear day, plus Tito's WWII command cave is a 15-minute detour off the main trail.",
      thingsToDo: [
        "Hike up Mount Hum (587 m) to Tito's WWII cave",
        'Walk the working fishing fleet on the eastern harbour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Visit the Fishermen's Museum in the Venetian tower",
        'Watch the open-Adriatic sunset from the harbour wall',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay — sand and weed, mostly good holding, harbour fee. Outer wall is exposed to SW swell and not safe overnight. If SW gradient is forecast above 15 kn, push 6 nm back to Vis Town in St. George Bay.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/komiza.webp',
          alt: 'Komiža',
        },
      ],
    },
    {
      id: 'komiza-blue-cave-stari-grad',
      routeFrom: 'Komiža',
      routeTo: 'Blue Cave (Biševo) – Stari Grad',
      day: 7,
      mapPin: {
        desktop: { left: 43.1, top: 50.4 },
        mobile: { left: 37.5, top: 46.2 },
      },
      shortDescription:
        'Blue Cave morning then 25 nm east-northeast to Stari Grad on Hvar — the oldest town in Croatia (founded 384 BC as Greek Pharos) and gateway to the UNESCO Stari Grad Plain.',
      description:
        "The day starts at the Blue Cave on Biševo — the underwater opening lights the cavern interior an unreal ultramarine only between roughly 09:00 and 11:00. Tie alongside the small concession quay outside the entrance (no overnight, lunchtime fee paid at the kiosk) and queue for one of the official tenders that ferry visitors inside. Forty minutes in and out, then push 25 miles east-northeast to Stari Grad on Hvar — the oldest town in Croatia, founded as Greek Pharos in 384 BC. The original Greek street grid is still visible in the central old town, and the surrounding Stari Grad Plain — the agricultural plateau east of the town — is UNESCO-listed as one of the oldest continuously cultivated landscapes in Europe. Stari Grad sits deep in a long fjord-like bay on the island's north coast and is fully sheltered in any wind direction; town quay accepts stern-to with own anchor for a modest fee, and a small ACI Marina Stari Grad on the eastern side has lazy lines.",
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Walk inland through the UNESCO Stari Grad Plain',
        "Visit Tvrdalj Castle and Hektorović's freshwater fishpond",
        'Walk the Greek-grid streets in the central old town',
        'Order peka at a Stari Grad Plain konoba (book 3 hours ahead)',
      ],
      mooringTip:
        'Town quay stern-to with own anchor — modest harbour fee, water and power on the central section. ACI Marina Stari Grad on the eastern side has lazy lines and is the all-weather alternative. Bay is fjord-shaped and fully sheltered in any wind direction.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/stari-grad.webp',
          alt: 'Stari grad',
        },
      ],
    },
    {
      id: 'stari-grad-hvar-palmizana',
      routeFrom: 'Stari Grad',
      routeTo: 'Hvar (Palmižana)',
      day: 8,
      mapPin: {
        desktop: { left: 37.6, top: 52.4 },
        mobile: { left: 30.5, top: 51.3 },
      },
      shortDescription:
        '14 nm counterclockwise around the western tip of Hvar into Palmižana on Sv. Klement — the largest of the Pakleni Islands and the only one in the cluster with a marina.',
      description:
        "Fourteen miles counterclockwise around the western tip of Hvar into Palmižana on Sv. Klement, the largest of the Pakleni Islands. Palmižana ACI Marina sits on the eastern side of the islet with stern-to lazy-line slots and limited summer capacity (book online for July–August or expect to anchor). The main bay holds in 5–10 metres on a sand-and-weed bottom but turns rolly when the Maestral funnel kicks in around 14:00, so the more comfortable overnight options are the south-side coves: Vinogradišće and Tarsce, both holding well in W gradient with line ashore the standard configuration. The afternoon ritual on Palmižana is the Meneghello family's 1906 botanical garden, dinner at one of the four konobas spread along the bay, and snorkelling over the submerged Roman amphorae off the western shore.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
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
      id: 'hvar-proizd-vela-luka',
      routeFrom: 'Hvar',
      routeTo: 'Proizd – Vela Luka',
      day: 9,
      mapPin: {
        desktop: { left: 46.1, top: 64.9 },
        mobile: { left: 42.1, top: 57.4 },
      },
      shortDescription:
        'Lunchtime stop at Proizd, a small uninhabited islet off Korčula’s western tip with natural rock pools, then 4 nm into Vela Luka for the night.',
      description:
        'Twenty-five miles south-southwest takes you across to the small uninhabited islet of Proizd, a few miles north of the western tip of Korčula. Proizd is famous on the local charter circuit for its natural rock pools — wave-cut basins on the western side that fill with seawater and warm up in the sun — and for some of the cleanest swim water in central Dalmatia (visibility runs to 25 metres on a calm day). The islet is anchorage-only and lunchtime — overnight is not safe in any gradient — so anchor in 6–8 metres on the small sand patch on the eastern side, swim once, walk the path that loops the islet in 30 minutes, then push the short 4 miles southeast into Vela Luka for the overnight. Vela Luka is the deep west-facing harbour at the western tip of Korčula, with full town services, fuel, water and power on the long town quay.',
      thingsToDo: [
        'Anchor at Proizd for lunchtime swimming in natural rock pools',
        'Walk the 30-minute path that loops the islet',
        'Snorkel the western shore of Proizd in 25 m visibility water',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Pump fuel at the western end of the Vela Luka town quay',
      ],
      mooringTip:
        'Proizd is anchorage-only and lunchtime — never overnight (no shelter from any direction, exposed to all gradient). Vela Luka offers stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Bay is fully sheltered from N, NE and E.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/vela-luka.webp',
          alt: 'Vela Luka',
        },
      ],
    },
    {
      id: 'vela-luka-lastovo-zaklopatica',
      routeFrom: 'Vela Luka',
      routeTo: 'Lastovo (Zaklopatica)',
      day: 10,
      mapPin: {
        desktop: { left: 49.2, top: 78.3 },
        mobile: { left: 46.8, top: 64.3 },
      },
      shortDescription:
        '14 nm south to Lastovo, the most isolated inhabited Adriatic island and a designated Nature Park. Zaklopatica is the natural overnight — five konobas hang free buoys, the lowest light pollution in Croatia.',
      description:
        "Fourteen miles south takes you to Lastovo — a Nature Park, the lowest light pollution in Croatia, the quietest island in the central Adriatic in season. Zaklopatica is the natural overnight: a U-shaped bay carved into the north coast with a low islet across the entrance breaking any swell, and five family-run konobas that each maintain a string of free mooring buoys for guests who eat ashore. The mooring economics are simple — book a buoy and a dinner table at the same konoba. Lastovo's signature dishes are the local lobster (jastog) — boats fish them daily on traps north of the island — and šporki makaruli, a rustic beef-and-pasta stew. Off the water there is little to do, which is the entire point: on a clear August evening the Milky Way is visible directly overhead before midnight.",
      thingsToDo: [
        "Pick up a konoba's free buoy in exchange for dinner",
        'Order Lastovo lobster (jastog) or šporki makaruli',
        'Walk the path inland to the Lastovo Town fumari (chimney stacks)',
        'Snorkel the islet at the bay entrance',
        'Stay on deck for the Milky Way after midnight',
      ],
      mooringTip:
        'Free konoba mooring buoys at Zaklopatica — confirm with the konoba on arrival, dinner reservation locks the buoy. Anchoring on bottom is discouraged due to seagrass. Bay is fully sheltered from N to W; if SE forecast above 15 kn, move 4 nm south through the channel to Skrivena Luka.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/zaklopatica.webp',
          alt: 'Zaklopatica',
        },
      ],
    },
    {
      id: 'lastovo-pomena-mljet',
      routeFrom: 'Lastovo',
      routeTo: 'Pomena (Mljet)',
      day: 11,
      mapPin: {
        desktop: { left: 65.6, top: 75 },
        mobile: { left: 62, top: 60.6 },
      },
      shortDescription:
        '20 nm northeast to Pomena at the western tip of Mljet — the eastern landing of Mljet National Park. Pick up a green Park mooring buoy in Pomena Bay (ranger fee includes crew Park entry) and walk 15 minutes inland to Malo Jezero saltwater lake.',
      description:
        "Twenty miles northeast takes you to Pomena, the small village at the western tip of Mljet and the eastern landing of Mljet National Park. Pick up one of the green Park mooring buoys in Pomena Bay (overnight fee paid at the ranger kiosk, includes Park entry for the crew) or take a stern-to slot at the village pontoon. From Pomena, a 15-minute walk leads to Malo Jezero, the smaller of the two saltwater lakes inside the Park, and a short footpath connects to Veliko Jezero where the Park ferry runs out to the 12th-century Benedictine monastery on St. Mary's islet. Allow the afternoon for the lake circuit — the trail loops both lakes, swimming is permitted, the cicadas are deafening. The Pomena overnight pairs naturally with the lake walk; the small village has two konobas and a tiny shop, the dinner runs on grilled fish and the local Pošip white from the Korčula vineyards across the channel.",
      thingsToDo: [
        'Pick up a Park buoy in Pomena Bay and pay the ranger',
        'Walk 15 minutes inland to Malo Jezero saltwater lake',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Hike the 9 km lake-loop trail',
        'Order grilled fish and Pošip white at a Pomena konoba',
      ],
      mooringTip:
        'Pomena Bay uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is well-sheltered; only NW gradient above 18 kn pushes any noticeable swell into the entrance.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/pomena.webp',
          alt: 'Pomena',
        },
      ],
    },
    {
      id: 'pomena-saplunara-bay-mljet',
      routeFrom: 'Pomena',
      routeTo: 'Saplunara Bay (Mljet)',
      day: 12,
      mapPin: {
        desktop: { left: 66.3, top: 78.5 },
        mobile: { left: 69.1, top: 68.6 },
      },
      shortDescription:
        '20 nm east-southeast around the south coast of Mljet to Saplunara Bay on the southeast tip — outside the National Park boundary, sandy beach, no Park fees.',
      description:
        'The Day 12 leg is a 20-mile run east-southeast around the south coast of Mljet to Saplunara Bay on the southeast tip — outside the National Park boundary, no Park fees, and one of the few natural sand beaches on the entire Croatian coast. The bay is wide and shallow with a pale sand floor at 4–6 metres; drop the hook on the sand, or pick up one of the seasonal restaurant buoys laid by the two konobas on the beach. The bay is well-sheltered from N, NW and W; only S gradient pushes any swell into the inner section. Once secured, swim from the boat (the water is exceptional thanks to the sand floor and shallow depth, with classic turquoise tones) or walk the path inland to Blace Bay (a smaller, quieter sand beach 20 minutes north on foot).',
      thingsToDo: [
        'Anchor on the sand floor and swim from the boat',
        'Walk to Blace Bay 20 minutes north (smaller, quieter sand beach)',
        'Climb the path to the small white chapel above the village',
        'Order grilled orada at a Saplunara beach konoba',
        'Stay on deck for the open-Adriatic stars after dark',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding (the standard choice). Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NW and W; exposed to S gradient. If S forecast above 18 kn, push 6 nm north into Okuklje (also outside the National Park, fully sheltered).',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/saplunara-mljet.webp',
          alt: 'Saplunara',
        },
      ],
    },
    {
      id: 'saplunara-lopud',
      routeFrom: 'Saplunara',
      routeTo: 'Lopud',
      day: 13,
      mapPin: {
        desktop: { left: 75.2, top: 81.2 },
        mobile: { left: 73.9, top: 68.1 },
      },
      shortDescription:
        '18 nm east into Lopud Bay in the Elaphiti chain — a car-free island with the rare Šunj sandy beach on the southeast side and the deliberate quiet stop before the Saturday return into Slano.',
      description:
        'Eighteen miles east takes you to Lopud, the second-largest of the three inhabited Elaphiti Islands. Lopud is car-free — the small village wraps the main bay on the northwest side, and a 30-minute walk across the island leads to the Šunj sandy beach on the southeast coast (one of the few natural sand beaches on the entire Croatian coast and the headline draw of the island). Mooring is straightforward: stern-to with own anchor on the village quay for a modest harbour fee, water and power on the central berths. The bay is well-sheltered from S, SE and SW; exposed to N gradient (rare in summer). Off the boat the ritual is the walk across to Šunj for an afternoon swim, the small Franciscan monastery (15th-century, fortified) on the village seafront, and the konoba dinner — black risotto and the local oysters from Mali Ston Bay are the standbys.',
      thingsToDo: [
        'Walk the 30-minute path across to Šunj sandy beach',
        'Visit the 15th-century Franciscan monastery on the seafront',
        'Order black risotto at a village konoba',
        'Sample the Mali Ston oysters at a quayside table',
        'Climb the ruined fortress above the village for the panoramic view',
      ],
      mooringTip:
        'Stern-to on Lopud village quay with own anchor — modest fee, water and power on the central berths. Bay is well-sheltered from S, SE and SW; exposed to N gradient. If N forecast above 18 kn, push 4 nm into the more sheltered Šipanska Luka on Šipan or back into Marina Frapa Resort Slano.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/lopud.webp',
          alt: 'Lopud',
        },
      ],
    },
    {
      id: 'lopud-slano',
      routeFrom: 'Lopud',
      routeTo: 'Slano',
      day: 14,
      mapPin: {
        desktop: { left: 82, top: 77.8 },
        mobile: { left: 85, top: 65 },
      },
      shortDescription:
        '10 nm northeast back into Marina Frapa Resort Slano for the Saturday handover by 09:00. Final stop at Koločep islet for a swim before pushing into Slano Bay.',
      description:
        'The final leg is ten miles northeast from Lopud back into Marina Frapa Resort Slano. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. The course passes Koločep, the smallest and closest of the three inhabited Elaphiti Islands, and the small bays on its eastern coast are the standard final-swim stop on the way northeast — drop the hook in 6–8 metres on sand, swim once, then push into Slano Bay and up to the marina pontoon. Marina Frapa Resort Slano sits at the head of a long, deep, fully-sheltered bay; once fuel is pumped and inspection clear, Dubrovnik airport is 45 minutes by car south. A long lunch at the marina hotel restaurant or in the small Slano village closes the week.',
      thingsToDo: [
        'Stop for a final swim in a Koločep bay',
        'Top up fuel and pump out before the 09:00 inspection',
        'Take a final dip from the marina pontoon',
        'Stand a long lunch at the marina hotel restaurant',
        'Walk to the small village of Slano for the local konoba scene',
      ],
      mooringTip:
        'Return into Marina Frapa Resort Slano per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return. Fuel pontoon is on the western entrance side of the marina.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/slano.webp',
          alt: 'Slano',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Slano – Korčula – Hvar – Vis – Lastovo Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Slano – Korčula – Hvar – Vis – Lastovo Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(slanoKorculaHvarVisLastovo14dayRoute);
