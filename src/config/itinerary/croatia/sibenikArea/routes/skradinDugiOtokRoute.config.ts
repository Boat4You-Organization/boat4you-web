import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const skradinDugiOtokRoute: ItineraryRoute = {
  metaTitle: '7-Day Skradin–Dugi Otok via Kornati Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from ACI Marina Skradin (Krka NP) via Zlarin, Ravni Žakan, Telašćica NP, Žut, Murter & Tribunj — sailor brief with NM.',
  id: 'skradin-dugi-otok-route',
  startingPoint: 'Skradin',
  otherPoints: ['Dugi otok'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/skradin-dugi-otok-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/kornati-banner-large.webp', alt: 'Kornati' },
    { src: '/images/itinerary/croatia/banners/national-park-kornati-banner-large.webp', alt: 'National park Kornati' },
    { src: '/images/itinerary/croatia/banners/skradin-marina-banner.webp', alt: 'Skradin marina' },
    { src: '/images/itinerary/croatia/banners/primosten-marina-banner.webp', alt: 'Primosten marina' },
  ],
  routeDays: [
    {
      id: 'skradin-zlarin-island',
      routeFrom: 'Skradin',
      routeTo: 'Zlarin Island',
      day: 1,
      mapPin: { desktop: { left: 50.5, top: 54.9 }, mobile: { left: 50.5, top: 54.9 } },
      shortDescription:
        '15 nm down the Krka River and into the Šibenik islands group to Zlarin — small car-free island with a single working village and centuries of red-coral diving history.',
      description:
        "Out of ACI Marina Skradin (Krka National Park gateway), the opening leg is 15 miles: 8 miles back downriver through the freshwater section, past Šibenik old town, through the St. Anthony channel narrows (49 m clearance under the Šibenik bridge), then 7 miles south to Zlarin. The island is car-free, with a single working village on the eastern coast. Zlarin's claim to history is red coral: the local divers have been harvesting Adriatic coral from the offshore beds for at least seven centuries, and a small coral museum on the village square documents the trade. Stern-to mooring with own anchor on the village quay for a modest fee, water and power on the central berths. Konoba dinner runs on the catch of the day and the local Babić red.",
      thingsToDo: [
        'Visit the coral museum on the village square',
        'Walk inland through the cypress and pine forests',
        'Swim from the rocks on the south side',
        'Order škampi na buzaru at a quayside konoba',
        'Pick up coral jewellery from a village workshop',
      ],
      mooringTip:
        'Stern-to on Zlarin village quay with own anchor — modest fee, water and power on the central berths. Bay is well-sheltered from W, NW and N; exposed to SE gradient. If SE forecast above 15 kn, push 4 nm north into the protected estuary at Šibenik.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zlarin.webp', alt: 'Zlarin' }],
    },
    {
      id: 'zlarin-ravni-zakan',
      routeFrom: 'Zlarin',
      routeTo: 'Ravni Žakan',
      day: 2,
      mapPin: { desktop: { left: 39.5, top: 55 }, mobile: { left: 39.5, top: 55 } },
      shortDescription:
        '15 nm west into the southern edge of Kornati National Park to Ravni Žakan — small uninhabited islet with a tiny ACI Marina pontoon and one konoba.',
      description:
        'Fifteen miles west takes you into the southern edge of Kornati National Park to Ravni Žakan, a small uninhabited islet on the southwestern fringe of the Park boundary. The islet has a tiny ACI Marina pontoon (handful of berths with lazy lines, water and power) and a single konoba on the rocks above the harbour — small, family-run, the only structure on the islet. Park entry fee paid online before arrival or at the marina kiosk. The islet itself walks in 30 minutes; the snorkelling along the rocky northwest shore (where the bottom drops to 15 m on a sand-and-rock mix) is the best on the entire route. The night is silent — no light pollution, the Milky Way directly overhead.',
      thingsToDo: [
        'Pay the Park entry online before arrival',
        'Walk the 30-minute spine of the islet for the panoramic view',
        'Snorkel the rocky northwest shore in 15 m visibility',
        'Eat at the single konoba above the harbour',
        'Stay on deck for the Milky Way after dark',
      ],
      mooringTip:
        'ACI Marina Ravni Žakan is small (limited berths) — book online for July–August or arrive by 14:00 to secure a slot. Anchoring outside the marina is regulated within Park boundaries; only Lavsa, Lojena, Vrulje, Stiniva, Statival allow overnight anchoring.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/ravni-zakan.webp', alt: 'Ravni Žakan' }],
    },
    {
      id: 'ravni-zakan-telaščica',
      routeFrom: 'Ravni Žakan',
      routeTo: 'Telašćica',
      day: 3,
      mapPin: { desktop: { left: 27.8, top: 41.9 }, mobile: { left: 27.8, top: 41.9 } },
      shortDescription:
        '12 nm northwest into Telašćica Nature Park — long, deep bay carved into the southern tip of Dugi Otok, with the saltwater Mir Lake and the 160-metre Grpašćak cliffs.',
      description:
        'Twelve miles northwest takes you to Telašćica Nature Park, set on the southern tip of Dugi Otok. The bay is long and deep, walled by cliffs and pine on the western side, opening to a string of small bays and islets on the eastern side. The Park has its own entry fee (separate from Kornati, paid at the ranger boat or kiosk in the bay), and pickup of one of the Park mooring buoys is mandatory. The headline draws: the saltwater Mir Lake (a small lake on the southern edge, separated from the sea by a narrow strip of land — popular for swimming because the water warms much faster than the open sea) and the Grpašćak cliffs on the western side, which rise 160 metres straight from the water and offer the best Adriatic panoramic from the marked walking trail at the top.',
      thingsToDo: [
        'Pick up a Park mooring buoy and pay the ranger',
        'Walk the path to Mir Lake for a warm-water swim',
        'Hike to the Grpašćak cliffs (160 m drop) for the panoramic view',
        'Snorkel the eastern shore of the bay',
        'Stay on board for the cicadas after dark',
      ],
      mooringTip:
        'Telašćica is a Nature Park — pick up a Park mooring buoy at the southern part of the bay (overnight fee paid to the ranger, includes Park entry). Bay is fully sheltered in any wind direction; one of the most reliable overnight bays on the entire central Adriatic.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/telescica.webp', alt: 'Telascica' }],
    },
    {
      id: 'telaščica-žut-island',
      routeFrom: 'Telašćica',
      routeTo: 'Žut Island',
      day: 4,
      mapPin: { desktop: { left: 33, top: 42 }, mobile: { left: 33, top: 42 } },
      shortDescription:
        '8 nm southeast back into Kornati National Park to Žut — second-largest island in the Park, with the Marina Žut pontoon at Pristanišće and several deep bays on the south coast.',
      description:
        'Eight miles southeast takes you back into Kornati National Park to Žut, the second-largest island after Kornat itself. Žut is uninhabited but has a small ACI-affiliated Marina Žut pontoon at Pristanišće on the south coast (lazy lines, water, no shore power, harbour fee includes Park entry). Several deep bays on the south coast offer free konoba mooring buoys laid by the seasonal restaurants — Pinizel, Žut Kod Pristana, and Sarušćica are the main ones, each with a small konoba on the rocks above and free buoys for guests who eat ashore. The island itself is bare karst with dry-stone walls running up the spines, signed walking trails, and zero infrastructure beyond the konobas.',
      thingsToDo: [
        'Pick up a free konoba buoy in one of the south-coast bays',
        'Walk the bare-karst spine of the island',
        'Order grilled fish and Pošip white at a konoba',
        'Snorkel the rocky east coast in clear water',
        'Sail past the southern cliffs of Kornat for the dramatic horizon',
      ],
      mooringTip:
        'Marina Žut at Pristanišće (limited berths, lazy lines) or free konoba buoys in Pinizel/Sarušćica/Žut Kod Pristana on the south coast. Park entry is included in the marina fee or paid separately for buoys. Anchoring on the bottom is regulated within Park boundaries.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zut.webp', alt: 'Žut' }],
    },
    {
      id: 'žut-murter-island',
      routeFrom: 'Žut',
      routeTo: 'Murter Island',
      day: 5,
      mapPin: { desktop: { left: 42.5, top: 47.7 }, mobile: { left: 42.5, top: 47.7 } },
      shortDescription:
        '12 nm east out of Kornati to Murter — gateway island to the Park, with the working harbour of Betina on the east coast and ACI Marina Jezera on the north coast.',
      description:
        'Twelve miles east takes you out of Kornati to Murter, the closest inhabited island to the Park and the traditional gateway for charter boats heading west. Murter is technically a peninsula — connected to the mainland by a small bridge at Tisno, walking-accessible. Betina on the east coast is the main charter overnight: a working harbour with stern-to mooring on the long town quay (modest fee, water and power on the central berths), good konoba scene running on local fish and the Babić red. ACI Marina Jezera on the north coast is the all-weather alternative with lazy lines and full services. Off the boat the move is to walk to the Tisno saltworks (Roman-era salt pans still in use today) or to swim from one of the small bays around Slanica on the south coast.',
      thingsToDo: [
        'Walk to the Tisno saltworks (Roman-era pans still in use)',
        'Swim at Slanica beach on the south coast',
        'Order pašticada at a Betina konoba',
        'Visit the Murter Maritime Heritage Museum in Betina',
        'Sample Pag cheese and Murter olive oil at a quayside table',
      ],
      mooringTip:
        'Stern-to on Betina town quay with own anchor — modest fee, water and power on the central section. ACI Marina Jezera on the north coast (lazy lines, full services) is the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/murter.webp', alt: 'Murter' }],
    },
    {
      id: 'murter-tribunj',
      routeFrom: 'Murter',
      routeTo: 'Tribunj',
      day: 6,
      mapPin: { desktop: { left: 46.6, top: 50.3 }, mobile: { left: 46.6, top: 50.3 } },
      shortDescription:
        '6 nm southeast to Tribunj — small fishing village on the mainland coast just north of Vodice, with Marina Tribunj (ACI-affiliated, lazy lines) and a walkable medieval old town.',
      description:
        'Six miles southeast takes you to Tribunj, a small fishing village on the mainland coast just north of Vodice. Marina Tribunj (ACI-affiliated, formerly known as Marina Tribunj) sits on the south side of the village with stern-to lazy lines, water and power on every berth, fuel pontoon at the entrance. The medieval old town of Tribunj is on a small islet connected to the mainland by a stone bridge — narrow lanes, fig trees in the courtyards, a few good konobas. The bay is well-sheltered in most wind directions; only S gradient pushes any noticeable swell. Off the boat the afternoon move is to walk the medieval lanes, swim from Čista Bay just east of the marina, and catch the klapa singing that runs informally on the harbour wall on summer evenings.',
      thingsToDo: [
        'Walk the medieval old town on the islet',
        'Swim at Čista Bay east of the marina',
        'Order crni rižot (squid ink risotto) at Konoba Bepo',
        'Catch klapa singing on the harbour wall after dinner',
        'Sample local Vodice olive oil at a small farm shop',
      ],
      mooringTip:
        'Marina Tribunj (south side of the village) has lazy lines and full services — book ahead in season. Bay is well-sheltered in most wind directions; only S gradient pushes any noticeable swell.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/tribunj.webp', alt: 'Tribunj' }],
    },
    {
      id: 'tribunj-skradin',
      routeFrom: 'Tribunj',
      routeTo: 'Skradin',
      day: 7,
      mapPin: { desktop: { left: 52.7, top: 49.2 }, mobile: { left: 52.7, top: 49.2 } },
      shortDescription:
        '12 nm into the Šibenik river estuary and upriver to ACI Marina Skradin for the Saturday handover by 09:00. Optional Skradinski Buk waterfall stop via the Park shuttle boat.',
      description:
        'The final leg is 12 miles south-southeast into the Šibenik river estuary and upriver to ACI Marina Skradin. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked. The river run is one of the most unusual on the Croatian coast: pass the 16th-century St. Nicholas fortress at the river mouth, through the St. Anthony channel narrows (49 m clearance under the Šibenik bridge), past Šibenik old town, then into the deep, hill-walled freshwater section that ends at the marina. With time before handover, take the Park shuttle boat from the marina pontoon to Skradinski Buk waterfalls (15 minutes upstream, included in the Park entry ticket) for a final swim.',
      thingsToDo: [
        'Take the Park shuttle to Skradinski Buk waterfalls one last time',
        'Walk the boardwalk loop on both sides of the river',
        'Top up fuel and pump out before the 09:00 inspection',
        'Order Skradin risotto at a quayside konoba before the airport',
        'Walk the medieval town behind the marina',
      ],
      mooringTip:
        'Return into ACI Marina Skradin per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
  ],
  map: {
    desktop: {
      image: { src: '/images/itinerary/croatia/zadar-itinerary/map.webp', alt: 'Skradin Route Image' },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: { src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp', alt: 'Skradin Route Image' },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(skradinDugiOtokRoute);
