import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const splitKornatiKrkaRoute: ItineraryRoute = {
  metaTitle: '7-Day Split to Kornati and Krka Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Split north into Kornati NP, up the Krka River to Skradin & back via Primošten & Rogoznica — sailor brief with NM.',
  id: 'split-kornati-krka-route',
  startingPoint: 'Split',
  otherPoints: ['Kornati', 'Krka'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/split-kornati-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/kornati-banner-large.webp',
      alt: 'Kornati',
    },
    {
      src: '/images/itinerary/croatia/banners/national-park-kornati-banner-large.webp',
      alt: 'National park Kornati',
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
      id: 'split-veli-drvenik-krknjasi-bay',
      routeFrom: 'Split',
      routeTo: 'Veli Drvenik, Krknjaši bay',
      day: 1,
      mapPin: {
        desktop: { left: 29.4, top: 33.6 },
        mobile: { left: 20.4, top: 37.2 },
      },
      shortDescription:
        '8 nm west out of Split’s ACI Marina or the city Riva to Krknjaši Bay between the two Drvenik islands. The deliberate quiet kickoff while the crew gets bearings on the boat before pushing north.',
      description:
        "Split is the busiest charter base on the Croatian coast and Saturday afternoon traffic out of ACI Marina Split (just west of Diocletian's Palace) or the city Riva can be congested — the soft 8-mile leg west to Krknjaši Bay puts the noise behind you and lets the crew check sail trim in light air without committing to a long passage. Krknjaši sits in the channel between Veli Drvenik and Mali Drvenik, two small uninhabited islands four miles west of the Trogir base. The bay is shallow with a pale sand floor at 3–6 metres, the holding is excellent, and the water turns turquoise on a calm day. Three small restaurants on Veli Drvenik (no road access — they are reached only by boat or by foot from the south-coast village) lay free mooring buoys for guests, but most boats anchor on the sand floor and dinghy ashore for dinner. There is a small chapel on the eastern side of the bay, a 30-minute footpath that loops the headland, and absolute silence after dark. Day 2 is a longer leg northwest, so the early night here pays off.",
      thingsToDo: [
        'Anchor on the sand floor in 4–6 m and swim',
        'Walk the 30-minute headland loop on Veli Drvenik',
        'Check sail trim and reefing in light afternoon air',
        'Order grilled fish at a Veli Drvenik beach restaurant',
        'Watch the open-Adriatic sunset from the deck',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding. Free restaurant buoys available with dinner ashore. Bay is sheltered from N, NE, E, S and SE; exposed only to W and NW. If W gradient forecast above 18 kn, push 2 nm into ACI Marina Trogir for the night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/krknjasi.webp', alt: 'Krknjasi' }],
    },
    {
      id: 'veli-drvenik-krknjasi-bay-primosten',
      routeFrom: 'Veli Drvenik, Krknjaši bay',
      routeTo: 'Primošten',
      day: 2,
      mapPin: {
        desktop: { left: 22.6, top: 24.1 },
        mobile: { left: 13.8, top: 31.9 },
      },
      shortDescription:
        '14 nm northwest along the open coast to Primošten — peninsula town with the 16th-century St. George church on the high point and the famous Bukovac dry-stone-walled vineyards stepping up the hills inland.',
      description:
        'Fourteen miles northwest along the open coast takes you past Rogoznica (the Day 6 stop on the way back) and into Primošten — instantly recognisable from offshore with its peninsula barely connected to the mainland by a sandy spit, the 16th-century church of St. George at the top, terracotta roofs running down to the water on every side. The peninsula is a working old town with no resort overlay and a few good konobas in the back lanes; the town quay accepts daytime visitors only, and ACI Marina Kremik (two miles south of the centre) handles the overnight slots with lazy lines and a regular shuttle bus to Primošten itself. The famous part of the landscape sits behind the town: the Bukovac vineyards — dry-stone-walled terraces stepped up the hills to grow the indigenous Babić red — were listed in MoMA New York as an example of agricultural land art, and the walking path up through them is signed from the marina. Order a glass of Babić on the harbour wall at sunset; the local red is the more interesting choice than the regional whites.',
      thingsToDo: [
        'Walk up to the 16th-century St. George church on the peak',
        'Order Babić red on the harbour wall at sunset',
        'Walk the dry-stone Bukovac vineyard terraces',
        'Eat brudet (fish stew) at a peninsula konoba',
        'Take the shuttle from Marina Kremik for dinner in town',
      ],
      mooringTip:
        'ACI Marina Kremik (2 nm south of the town) is the all-weather overnight option — lazy lines, full services, regular shuttle into Primošten. Town quay accepts daytime stops only and is exposed to W. If staying on the town quay during settled weather, leave by 17:00 to clear the berth before evening fishing fleet returns.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primosten' }],
    },
    {
      id: 'primosten-piskera-np-kornati',
      routeFrom: 'Primošten',
      routeTo: 'Piškera, NP Kornati',
      day: 3,
      mapPin: {
        desktop: { left: 22.1, top: 18.6 },
        mobile: { left: 13.5, top: 26.4 },
      },
      shortDescription:
        '20 nm northwest into Kornati National Park — 89 islands, the densest cluster of uninhabited islets in the Mediterranean. ACI Marina Piškera (Panitula) is the only marina inside the Park boundary.',
      description:
        'Twenty miles northwest from Primošten takes you into Kornati National Park, the 89-island archipelago that protects the densest cluster of uninhabited islets in the Mediterranean — a sea-level lunar landscape of bare karst, dry-stone walls running up the spines of the islands, zero permanent residents and a strict no-fishing rule that keeps the underwater life thick. The headline anchorage on Day 3 is ACI Marina Piškera, technically on Panitula Vela (a small islet on the western edge of the Park), the only marina inside the Park boundary. The marina has 150 berths with lazy lines, water and power, and a single restaurant on the rocks above the harbour. Park entry fee is paid online before arrival or at the marina kiosk on check-in (current 2025 charter-yacht day rate around €100, lower outside July–August). The afternoon move is to dinghy across to the snorkelling spots in the channel between Piškera and Lavsa, or to motor out to the southern crowns of the Park (the south-side cliffs of Mana, Kornat and Lavsa) where the bare karst drops 80 metres into the water.',
      thingsToDo: [
        'Pay the Park entry online before arrival (cheaper than at the kiosk)',
        'Snorkel the channel between Piškera and Lavsa',
        'Sail past the southern cliffs of Mana and Kornat (80 m drops)',
        'Eat at the single restaurant above the marina',
        'Walk the bare-karst spine of Panitula Vela',
      ],
      mooringTip:
        'ACI Marina Piškera (Panitula) lazy lines on every berth — book online for July–August. Anchoring outside the marina inside the Park is regulated: only certain bays allow overnight anchoring (Lavsa, Lojena, Vrulje, Stiniva, Statival). Free konoba buoys are common in those bays. Outside Park hours, free anchoring rules apply but the Park ranger boats patrol.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Kornati' }],
    },
    {
      id: 'piskera-zlarin',
      routeFrom: 'Piškera',
      routeTo: 'Zlarin',
      day: 4,
      mapPin: {
        desktop: { left: 20.7, top: 14.6 },
        mobile: { left: 8.6, top: 22.8 },
      },
      shortDescription:
        '15 nm east out of Kornati and into the Šibenik islands group, dropping into Zlarin — a small car-free island with a single working village and centuries of red-coral diving history.',
      description:
        "Fifteen miles east from Piškera, leaving Kornati on the port quarter, brings you into the Šibenik islands group and Zlarin — a small car-free island with a single working village on its eastern coast. Zlarin's claim to history is red coral: the local divers have been harvesting Adriatic coral from the offshore beds for at least seven centuries, and a small coral museum on the village square documents the trade and shows the original tools (foot-stones, weighted ropes, the ladder-frame harvesting cages used until the 20th century). The village quay accepts stern-to with own anchor for a modest fee, water and power on the central berths. There is no industrial or resort development on the island — the lanes inland are pedestrianised, the cypress and pine forests on the western slopes walk in 30 minutes, and the local konobas run on grilled fish and the catch of the day. The afternoon move is to walk inland to the small chapels on the spine of the island, or to swim from the rocks on the south side. After dinner, the harbour wall is the Zlarin equivalent of nightlife.",
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
      id: 'zlarin-skradin-np-krka',
      routeFrom: 'Zlarin',
      routeTo: 'Skradin, NP Krka',
      day: 5,
      mapPin: {
        desktop: { left: 20.9, top: 10 },
        mobile: { left: 12.1, top: 17.9 },
      },
      shortDescription:
        '12 nm into the Krka River estuary to ACI Marina Skradin — a unique upriver passage past Šibenik, under the St. Anthony channel narrows, and into the freshwater section of Krka National Park.',
      description:
        'The Day 5 leg is one of the most unusual on the Croatian coast: 12 miles upriver into the Krka estuary, past the medieval city of Šibenik, under the narrow St. Anthony channel (a 600-metre rock-cut passage with a clearance of 49 metres under the Šibenik bridge — no issue for any charter mast), into the brackish lower river, and finally into the deep, hill-walled freshwater section that ends at ACI Marina Skradin. The marina sits at the gateway of Krka National Park, with the famous Skradinski Buk waterfalls a 15-minute Park-shuttle-boat ride upstream from the marina pontoon. Park entry is paid at the kiosk on the marina seawall; the shuttle boat is included in the ticket and runs every 30 minutes in season. At Skradinski Buk the waterfalls drop 46 metres in a series of 17 limestone cascades, with a wooden boardwalk that loops both sides of the river. Swimming directly under the falls was banned in 2021 but the boardwalk lookouts and the upstream pools are the headline experience. Back in Skradin the medieval town wraps the marina; konoba dinner runs on Skradin risotto (slow-cooked beef and saffron), the local Babić, and the freshwater eels and trout pulled from the river upstream.',
      thingsToDo: [
        'Take the Park shuttle boat to Skradinski Buk waterfalls',
        'Walk the boardwalk loop on both sides of the river',
        'Order Skradin risotto (slow-cooked beef and saffron)',
        'Walk the medieval town behind the marina',
        'Hike up the lookout point above the waterfalls for the panorama',
      ],
      mooringTip:
        'ACI Marina Skradin lazy lines on every berth, full services, fuel pontoon at the entrance. The river entrance is well-marked and deep enough for any charter draft; allow 90 minutes from Šibenik river mouth to the marina at displacement speed. Park entry kiosk and shuttle-boat departure point on the marina seawall. No anchoring in the Park section of the river — marina or nothing.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Skradin' }],
    },
    {
      id: 'skradin-rogoznica',
      routeFrom: 'Skradin',
      routeTo: 'Rogoznica',
      day: 6,
      mapPin: {
        desktop: { left: 24.5, top: 28.7 },
        mobile: { left: 15.2, top: 36.3 },
      },
      shortDescription:
        '20 nm back downriver and southeast along the open coast to Rogoznica — peninsula town with the inland Dragon’s Eye salt lake and Marina Frapa on the south side, one of the largest marinas in central Dalmatia.',
      description:
        "Twenty miles back downriver and southeast along the open coast takes you to Rogoznica, a peninsula town set on a low headland between Šibenik and Split. Rogoznica's geographic curiosity is the Dragon's Eye Lake (Zmajevo Oko) — a deep saltwater karst lake on the southern tip of the peninsula, connected to the sea through a hidden underwater channel that flushes the basin twice a day with the tide. The lake sits 6 metres below surrounding sea level at low tide, and the limestone cliffs around it are walkable in 20 minutes from the town. Marina Frapa sits on the south side of the peninsula and is one of the largest marinas in central Dalmatia by berth count, with lazy lines, full services, a hotel, several restaurants and a fuel pontoon at the entrance. Smaller boats can also stern-to on the village quay on the north side, but exposure to NW gradient makes the marina the more reliable choice in season. The town is small and walkable — fishing fleet, a few konobas, and the small old quarter on the headland.",
      thingsToDo: [
        "Walk the path to the Dragon's Eye Lake on the southern tip",
        'Look down at the karst lake from the limestone cliffs',
        'Order brudet (fish stew) at a peninsula konoba',
        'Walk the small old quarter on the headland',
        'Take the dinghy across to Smokvica islet for an afternoon swim',
      ],
      mooringTip:
        'Marina Frapa on the south side of the peninsula is the all-weather overnight — lazy lines, full services, fuel pontoon at the entrance, hotel and restaurants on the marina grounds. Village quay on the north side accepts stern-to with own anchor for a modest fee but is exposed to NW gradient; switch to the marina if NW forecast above 15 kn.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rogoznica.webp', alt: 'rogoznica' }],
    },
    {
      id: 'rogoznica-split',
      routeFrom: 'Rogoznica',
      routeTo: 'Split',
      day: 7,
      mapPin: {
        desktop: { left: 38.5, top: 29.8 },
        mobile: { left: 31.3, top: 33.2 },
      },
      shortDescription:
        '20 nm east-southeast back into ACI Marina Split or the Split Riva for the Saturday handover by 09:00. Pass the south coast of Čiovo on the way; final swim before pushing into the marina entrance.',
      description:
        "The final leg is twenty miles east-southeast from Rogoznica back into Split. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. Most Boat4You boats out of Split are based at ACI Marina Split (just west of Diocletian's Palace, the most central handover point), Marina Kaštela (10 minutes drive west), or ACI Trogir (20 minutes drive west) — the route into all three is straightforward in any visibility. The course passes the southern coast of Čiovo on the run east, with a string of small swimming bays along its southern shore; Slatine and Saldun are the obvious choices for a final dip before pushing east. With fuel pumped and inspection clear, ACI Marina Split is a 5-minute walk from Diocletian's Palace and 25 minutes by car from Split airport. A long lunch on the Riva or in the Palace is the standard close.",
      thingsToDo: [
        'Stop for a final swim off the south coast of Čiovo',
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk Diocletian's Palace one final time before the airport",
        'Take a final swim at Bačvice Beach east of the Old Town',
        'Stand a long lunch on the Riva before the transfer',
      ],
      mooringTip:
        'Return into your booked Boat4You base — ACI Marina Split, Marina Kaštela or ACI Trogir, whichever is on your charter contract. All three accept stern-to or alongside per the base manager’s direction. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/split.webp', alt: 'Split' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Split – Kornati – Krka Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Split – Kornati – Krka Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(splitKornatiKrkaRoute);
