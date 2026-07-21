import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const kastelaKornatiKrkaRoute: ItineraryRoute = {
  metaTitle: 'Kaštela to Kornati & Krka 7-Day Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Kaštela north into Kornati NP, up the Krka River to Skradin & back via Primošten & Rogoznica — sailor brief with NM.',
  id: 'kastela-kornati-krka-route',
  startingPoint: 'Kaštela',
  otherPoints: ['Kornati', 'Krka'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/kastela-kornati-card-image.webp',
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
      src: '/images/itinerary/croatia/banners/skradin-marina-banner.webp',
      alt: 'Skradin marina',
    },
    {
      src: '/images/itinerary/croatia/banners/primosten-marina-banner.webp',
      alt: 'Primosten marina',
    },
  ],
  routeDays: [
    {
      id: 'kastela-veli-drvenik-krknjasi-bay',
      routeFrom: 'Kaštela',
      routeTo: 'Veli Drvenik (Krknjaši Bay)',
      day: 1,
      mapPin: {
        desktop: { left: 32.9, top: 29.3 },
        mobile: { left: 27.1, top: 38.2 },
      },
      shortDescription:
        '4 nm west from Marina Kaštela into Krknjaši Bay between the two Drvenik islands — a glass-water swim anchorage that doubles as the soft kickoff while the crew gets their bearings on the boat.',
      description:
        'The opening leg out of Marina Kaštela is the shortest of the week — four miles west into the channel between Veli Drvenik and Mali Drvenik, two small uninhabited islands sitting just off Trogir. Krknjaši is essentially a swim anchorage rather than a destination: the bay is shallow, the seabed is pale sand at 3–6 metres, the water turns turquoise on a calm day, and the holding is excellent. Three small restaurants on Veli Drvenik (no road access — they are reached only by boat or by foot from the small village on the south coast) lay free mooring buoys for guests, but with the shallow sand floor, anchoring is the more common choice. There is a tiny chapel on the eastern side of the bay, a footpath that loops the headland in 30 minutes, and no other infrastructure. The point of stopping here on Day 1 is operational: it gets the boat away from the marina without committing to a long passage, lets the crew check sail trim and reefing in light air, and delivers a quiet first night before the route turns north towards Kornati.',
      thingsToDo: [
        'Anchor on the sand floor in 4–6 m and swim',
        'Walk the 30-minute headland loop on Veli Drvenik',
        'Order grilled fish at a Veli Drvenik beach restaurant',
        'Check sail trim and reefing in light afternoon air',
        'Watch the open-Adriatic sunset from the deck',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding (the standard choice — bay is shallow and forgiving). Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NE, E, S and SE; exposed only to W and NW. If W gradient forecast above 18 kn, push 2 nm into ACI Marina Trogir for the night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/veli-drvenik.webp', alt: 'Veli Drvenik' }],
    },
    {
      id: 'krknjasi-bay-primosten',
      routeFrom: 'Krknjaši Bay',
      routeTo: 'Primošten',
      day: 2,
      mapPin: {
        desktop: { left: 21.5, top: 25.5 },
        mobile: { left: 14.9, top: 34.8 },
      },
      shortDescription:
        '14 nm northwest along the coast to Primošten — a peninsula town wrapped around a 16th-century church on a near-island, with Marina Kremik 2 nm south of the centre and a small town quay for daytime visitors.',
      description:
        'Fourteen miles northwest along the open coast takes you past the resort town of Rogoznica (the Day 6 stop on the way back) and on to Primošten, instantly recognisable from offshore: a peninsula barely connected to the mainland by a sandy spit, the 16th-century church of St. George at the highest point, terracotta roofs running down to the water on every side. The peninsula is a working old town with no resort overlay, a few good konobas in the back lanes, and a town quay that accepts daytime visitors only — ACI Marina Kremik, two miles south of the centre, handles the overnight slots with lazy lines, full services and a regular shuttle bus into Primošten itself. Behind the town the slopes are stepped with the famous Primošten Bukowac vineyards, the dry-stone-walled terraces that produce the indigenous Babić red and have been listed in MoMA New York as an example of agricultural land art. Order a glass on the harbour wall at sunset; the wine is the more interesting choice than the regional whites.',
      thingsToDo: [
        'Walk up to the 16th-century St. George church on the peak',
        'Order Babić red on the harbour wall at sunset',
        'Walk the dry-stone Bukovac vineyard terraces',
        'Eat brudet (fish stew) at a peninsula konoba',
        'Take the shuttle from Marina Kremik for dinner in town',
      ],
      mooringTip:
        'ACI Marina Kremik (2 nm south of the town) is the all-weather overnight option — lazy lines, full services, regular shuttle into Primošten. Town quay accepts daytime stops only and is exposed to W. If staying on the town quay during settled weather, leave by 17:00 to clear the berth before evening fishing fleet returns.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primošten' }],
    },
    {
      id: 'primosten-piskera-kornati-national-park',
      routeFrom: 'Primošten',
      routeTo: 'Piškera (Kornati National Park)',
      day: 3,
      mapPin: {
        desktop: { left: 21.2, top: 18.9 },
        mobile: { left: 9.1, top: 26 },
      },
      shortDescription:
        '20 nm northwest into Kornati National Park — the 89-island archipelago that protects the densest concentration of uninhabited islets on the Mediterranean. ACI Marina Piškera (Panitula) is the only marina inside the Park.',
      description:
        'Twenty miles northwest from Primošten takes you into Kornati National Park, the 89-island archipelago that protects the densest cluster of uninhabited islets in the Mediterranean — a sea-level lunar landscape of bare karst, dry-stone walls running up the spines of the islands, and zero permanent residents. The headline anchorage on Day 3 is ACI Marina Piškera (technically on Panitula Vela, a small islet on the western edge of the Park), the only marina inside the Park boundary and the natural overnight for boats coming up from Šibenik or down from Murter. The marina has 150 berths with lazy lines, water and power, and a single restaurant on the rocks above the harbour. The Park entry fee is paid online before arrival or at the marina kiosk on check-in (current 2025 charter-yacht day rate around €100, lower outside July–August). The afternoon move is to dinghy across to the snorkelling spots in the channel between Piškera and Lavsa, or to motor out to the southern crowns of the Park (the south-side cliffs of Mana, Kornat and Lavsa) where the bare karst drops 80 metres into the water.',
      thingsToDo: [
        'Pay the Park entry online before arrival (cheaper than at the kiosk)',
        'Snorkel the channel between Piškera and Lavsa',
        'Sail past the southern cliffs of Mana and Kornat (80 m drops)',
        'Eat at the single restaurant above the marina',
        'Walk the bare-karst spine of Panitula Vela',
      ],
      mooringTip:
        'ACI Marina Piškera (Panitula) lazy lines on every berth — book online for July–August. Anchoring outside the marina inside the Park is regulated: only certain bays allow overnight anchoring (Lavsa, Lojena, Vrulje, Stiniva, Statival), and free konoba buoys are common in those bays. Outside Park hours, free anchoring rules apply but the Park ranger boats patrol.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Piskera' }],
    },
    {
      id: 'piskera-zlarin',
      routeFrom: 'Piškera',
      routeTo: 'Zlarin',
      day: 4,
      mapPin: {
        desktop: { left: 20.4, top: 11.2 },
        mobile: { left: 8.5, top: 18.8 },
      },
      shortDescription:
        '15 nm east out of Kornati and into the Šibenik islands group, dropping into Zlarin — a small car-free island with a single village on its eastern coast and centuries of red-coral diving history.',
      description:
        "Fifteen miles east from Piškera, leaving Kornati on the port quarter, brings you into the Šibenik islands group and Zlarin — a small car-free island with a single working village on its eastern coast. Zlarin's claim to history is red coral: the local divers have been harvesting Adriatic coral from the offshore beds for at least seven centuries, and a small coral museum in the village square documents the trade and shows the original tools (foot-stones, weighted ropes, and the ladder-frame harvesting cages that were used until the 20th century). The village quay accepts stern-to with own anchor for a modest fee, water and power on the central berths. The island has no cars and no industrial development — the lanes inland are pedestrianised, the cypress and pine forests on the western slopes are walkable in 30 minutes, and the local konobas run on grilled fish and the catch of the day. The afternoon move is to walk inland to the small chapels on the spine of the island, or to swim from the rocks on the south side. After dinner, the harbour wall is the Zlarin equivalent of nightlife — fishing crews, a few yachts, and the cicadas.",
      thingsToDo: [
        'Visit the coral museum on the village square',
        'Walk inland through the cypress and pine forests',
        'Swim from the rocks on the south side',
        'Order grilled fish on the harbour wall at sunset',
        'Pick up coral jewellery from a village workshop (still hand-made)',
      ],
      mooringTip:
        'Stern-to on Zlarin village quay with own anchor — modest fee, water and power on the central berths. Bay is well-sheltered from W, NW and N; exposed to SE gradient. If SE forecast above 15 kn, push 4 nm north into the protected estuary at Šibenik (ACI Marina Mandalina or the town quay).',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zlarin.webp', alt: 'Zlarin' }],
    },
    {
      id: 'zlarin-skradin-krka-national-park',
      routeFrom: 'Zlarin',
      routeTo: 'Skradin (Krka National Park)',
      day: 5,
      mapPin: {
        desktop: { left: 19.3, top: 17.8 },
        mobile: { left: 12.7, top: 29.2 },
      },
      shortDescription:
        '12 nm into the Krka River estuary to ACI Marina Skradin — a unique upriver passage past Šibenik, under the St. Anthony channel narrows, and into the freshwater section of Krka National Park. The marina is at the gateway of Skradinski Buk waterfalls.',
      description:
        'The Day 5 leg is one of the most unusual on the entire Croatian coast: 12 miles upriver into the Krka estuary, past the medieval city of Šibenik, under the narrow St. Anthony channel (a 600-metre rock-cut passage, height under the Šibenik bridge 49 metres, posing no issue for any charter mast), into the brackish lower river, and finally into the deep, hill-walled freshwater section that ends at ACI Marina Skradin. The marina sits at the gateway to Krka National Park, with the famous Skradinski Buk waterfalls a 15-minute Park-shuttle-boat ride upstream from the marina pontoon. The Park entry is paid at the kiosk in the marina; the shuttle boat is included in the ticket and runs every 30 minutes in season. At Skradinski Buk the waterfalls drop 46 metres in a series of 17 limestone cascades, with a wooden boardwalk that loops both sides of the river. Swimming directly under the falls was banned in 2021 but the boardwalk lookouts and the upstream pools are the headline experience. Back in Skradin the medieval town wraps the marina; konoba dinner runs on Skradin risotto (slow-cooked beef and saffron), the local Babić, and the freshwater eels and trout pulled from the river upstream.',
      thingsToDo: [
        'Take the Park shuttle boat to Skradinski Buk waterfalls',
        'Walk the boardwalk loop on both sides of the river',
        'Order Skradin risotto (slow-cooked beef and saffron)',
        'Walk the medieval town behind the marina',
        'Hike up the lookout point above the waterfalls for the panorama',
      ],
      mooringTip:
        'ACI Marina Skradin lazy lines on every berth, full services, fuel pontoon at the entrance. The river entrance is well-marked and deep enough for any charter draft; allow 90 minutes from Šibenik river mouth to the marina at displacement speed. Park entry kiosk and shuttle-boat departure point are on the marina seawall. No anchoring in the Park section of the river — marina or nothing.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
    {
      id: 'skradin-rogoznica',
      routeFrom: 'Skradin',
      routeTo: 'Rogoznica',
      day: 6,
      mapPin: {
        desktop: { left: 9.5, top: 15.6 },
        mobile: { left: 3.2, top: 21.8 },
      },
      shortDescription:
        '20 nm back downriver and southeast along the open coast to Rogoznica — a peninsula town with the inland Dragon’s Eye salt lake and the modern Marina Frapa on the south side, the largest marina between Šibenik and Split.',
      description:
        "Twenty miles back downriver and southeast along the open coast takes you to Rogoznica, a peninsula town set on a low headland between Šibenik and Split. Rogoznica's geographic curiosity is the Dragon's Eye Lake (Zmajevo Oko) — a deep saltwater karst lake on the southern tip of the peninsula, connected to the sea through a hidden underwater channel that flushes the basin twice a day with the tide. The lake sits 6 metres below the surrounding sea level at low tide, and the surrounding limestone cliffs walk-up easily; the path from the town is signed in 20 minutes. Marina Frapa sits on the south side of the peninsula and is one of the largest marinas in central Dalmatia by berth count, with lazy lines, full services, a hotel, several restaurants and a fuel pontoon at the entrance. Smaller boats can also stern-to on the village quay on the north side, but exposure to NW gradient makes the marina the more reliable choice in season. The town itself is small and walkable — fishing fleet, a few konobas, and the small old quarter on the headland.",
      thingsToDo: [
        "Walk the path to the Dragon's Eye Lake on the southern tip",
        'Look down at the karst lake from the limestone cliffs',
        'Order brudet (fish stew) at a peninsula konoba',
        'Walk the small old quarter on the headland',
        'Take the dinghy across to Smokvica islet for an afternoon swim',
      ],
      mooringTip:
        'Marina Frapa on the south side of the peninsula is the all-weather overnight — lazy lines, full services, fuel pontoon at the entrance, hotel and restaurants on the marina grounds. Village quay on the north side accepts stern-to with own anchor for a modest fee but is exposed to NW gradient; switch to the marina if NW forecast above 15 kn.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rogoznica.webp', alt: 'Rogoznica' }],
    },
    {
      id: 'rogoznica-kastela',
      routeFrom: 'Rogoznica',
      routeTo: 'Kaštela',
      day: 7,
      mapPin: {
        desktop: { left: 37, top: 26.3 },
        mobile: { left: 32.3, top: 33 },
      },
      shortDescription:
        '15 nm southeast back into Marina Kaštela for the Saturday handover by 09:00. Pass Čiovo island on the way; final swim at one of the small bays on its southern coast before pushing east into the marina entrance.',
      description:
        "The final leg is fifteen miles southeast from Rogoznica back into Marina Kaštela. The course passes the southern coast of Čiovo, the long peninsula-island that hosts ACI Trogir on its eastern end and a string of small swimming bays along its southern shore — Slatine, Saldun, and Mavarstica are the obvious choices for a final swim before pushing east into the marina entrance. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. Marina Kaštela sits in a deep west-facing bay between Split and Trogir; the marina control tower is unmistakable from offshore and the run-in is straightforward in any visibility. With fuel pumped and inspection clear, the marina is a fifteen-minute drive from Split airport. The traditional close to a Croatian charter week is a long lunch on Trogir's seafront (10 minutes by car west of Marina Kaštela) — the Riva is lined with cafés, the UNESCO old town is a 5-minute walk from the marina, and the airport is 10 minutes north from there.",
      thingsToDo: [
        'Stop for a final swim off the south coast of Čiovo',
        'Top up fuel and pump out before the 09:00 inspection',
        'Walk Trogir UNESCO old town before the airport transfer',
        "Visit Trogir Cathedral's Radovan portal (1240 AD)",
        'Stand a long lunch on Trogir Riva before the transfer',
      ],
      mooringTip:
        'Return into Marina Kaštela per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return. Fuel pontoon is on the western entrance side of the marina.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kastela.webp', alt: 'Marina Kastela' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Kaštela – Kornati – Krka Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Kaštela – Kornati – Krka Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(kastelaKornatiKrkaRoute);
