import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const primostenNpKornatiRoute: ItineraryRoute = {
  metaTitle: '7-Day Primošten–Kornati & Krka NP Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from ACI Marina Kremik (Primošten) via Zlarin, Skradin (Krka NP), Kaprije, Telašćica, Piškera (Kornati) & Murter — sailor brief with NM.',
  id: 'primosten-np-kornati-route',
  startingPoint: 'Primošten',
  otherPoints: ['National park Kornati'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/primosten-kornati-card-image.webp',
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
      id: 'primosten-zlarin',
      routeFrom: 'Primošten',
      routeTo: 'Zlarin',
      day: 1,
      mapPin: { desktop: { left: 51.7, top: 57.3 }, mobile: { left: 51.7, top: 57.3 } },
      shortDescription:
        '12 nm north from ACI Marina Kremik to Zlarin in the Šibenik islands — small car-free island with seven centuries of red-coral diving on the offshore beds. Stern-to with own anchor on the village quay (modest fee, water and power); bay sheltered W, NW and N, exposed to SE.',
      description:
        "Out of ACI Marina Kremik (Primošten), the opening leg is 12 miles north along the open coast and into the Šibenik islands group to Zlarin. The island is car-free, with a single working village on the eastern coast. Zlarin's claim to history is red coral: local divers have been harvesting Adriatic coral from the offshore beds for at least seven centuries; the small coral museum on the village square documents the trade. Stern-to mooring with own anchor on the village quay for a modest fee, water and power on the central berths. Konoba dinner runs on the catch of the day and the local Babić red.",
      thingsToDo: [
        'Visit the coral museum on the village square',
        'Walk inland through the cypress and pine forests',
        'Swim from the rocks on the south side',
        'Order grilled squid at a quayside konoba',
        'Pick up coral jewellery from a village workshop',
      ],
      mooringTip:
        'Stern-to on Zlarin village quay with own anchor — modest fee, water and power on the central berths. Bay is well-sheltered from W, NW and N; exposed to SE. If SE forecast above 15 kn, push 4 nm north into Šibenik estuary.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zlarin.webp', alt: 'Zlarin' }],
    },
    {
      id: 'zlarin-skradin-np-krka',
      routeFrom: 'Zlarin',
      routeTo: 'Skradin, NP Krka',
      day: 2,
      mapPin: { desktop: { left: 52.1, top: 48.9 }, mobile: { left: 52.1, top: 48.9 } },
      shortDescription:
        '12 nm into the Krka River estuary to ACI Marina Skradin — unique upriver passage past Šibenik, under the St. Anthony channel narrows, into the freshwater section of Krka National Park.',
      description:
        'Twelve miles upriver: past Šibenik old town, under the St. Anthony channel narrows (49 m clearance under the Šibenik bridge), into the deep, hill-walled freshwater section that ends at ACI Marina Skradin. Park entry paid at the kiosk on the marina seawall; the shuttle boat to Skradinski Buk waterfalls (15 minutes upstream) is included in the ticket and runs every 30 minutes in season. The waterfalls drop 46 metres in 17 limestone cascades, with a wooden boardwalk that loops both sides of the river. Konoba dinner runs on Skradin risotto (slow-cooked beef and saffron).',
      thingsToDo: [
        'Take the Park shuttle boat to Skradinski Buk waterfalls',
        'Walk the boardwalk loop on both sides of the river',
        'Order Skradin risotto (slow-cooked beef and saffron)',
        'Walk the medieval town behind the marina',
        'Hike up the lookout point above the waterfalls',
      ],
      mooringTip:
        'ACI Marina Skradin lazy lines on every berth, full services, fuel pontoon at the entrance. River entrance well-marked, deep enough for any charter draft; allow 90 minutes from Šibenik river mouth at displacement speed. No anchoring in the Park section.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
    {
      id: 'skradin-kaprije',
      routeFrom: 'Skradin',
      routeTo: 'Kaprije',
      day: 3,
      mapPin: { desktop: { left: 46.4, top: 56.2 }, mobile: { left: 46.4, top: 56.2 } },
      shortDescription:
        '15 nm back down the Krka and west to Kaprije village — small car-free island in the Šibenik archipelago. Stern-to with own anchor on the village quay (modest fee, water on central berths but no shore power); bay sheltered S, SW, W and NW, exposed to NE Bora.',
      description:
        'Back down the Krka River, through the St. Anthony channel narrows, and 7 miles west to Kaprije village on the eastern coast of Kaprije island. Kaprije is a small car-free island with a single working village wrapped around the bay. Stern-to mooring with own anchor on the village quay for a modest harbour fee, water on the central berths but no shore power. The island is small enough to walk in 90 minutes — the path inland to the small chapel on the spine gives the panoramic view of the Kornati cluster offshore. Konoba dinner runs on grilled fish and the local Babić red.',
      thingsToDo: [
        'Walk the path to the small chapel on the spine of the island',
        'Order grilled fish at a Kaprije konoba',
        'Swim from the rocks south of the village',
        'Sample Babić red at a quayside table',
        'Take the dinghy across to the small islets at the bay entrance',
      ],
      mooringTip:
        'Stern-to on Kaprije village quay with own anchor — modest fee, water on the central berths (no shore power). Bay is well-sheltered from S, SW, W and NW; exposed to NE. If NE Bora forecast above 18 kn, push 4 nm east into Žirje (Mikavica Bay).',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kaprije.webp', alt: 'Kaprije' }],
    },
    {
      id: 'kaprije-telaščica-bay',
      routeFrom: 'Kaprije',
      routeTo: 'Telaščica Bay',
      day: 4,
      mapPin: { desktop: { left: 43.4, top: 47.3 }, mobile: { left: 43.4, top: 47.3 } },
      shortDescription:
        '14 nm northwest into Telašćica Nature Park on the southern tip of Dugi Otok — long bay walled by cliffs and pine on the western side. Park mooring buoy mandatory (separate fee from Kornati, paid to ranger); headline draws are the saltwater Mir Lake and the 160-metre Grpašćak cliffs.',
      description:
        'Fourteen miles northwest takes you to Telašćica Nature Park, set on the southern tip of Dugi Otok. The bay is long and deep, walled by cliffs and pine on the western side, opening to a string of small bays and islets on the eastern side. Pickup of one of the Park mooring buoys is mandatory (separate fee from Kornati, paid to the ranger). Headline draws: the saltwater Mir Lake (warms much faster than the open sea — popular swim) and the Grpašćak cliffs on the western side, which rise 160 metres straight from the water with a marked walking trail at the top.',
      thingsToDo: [
        'Pick up a Park mooring buoy and pay the ranger',
        'Walk the path to Mir Lake for a warm-water swim',
        'Hike to the Grpašćak cliffs (160 m drop) for the panoramic view',
        'Snorkel the eastern shore of the bay',
        'Stay on board for the cicadas after dark',
      ],
      mooringTip:
        'Telašćica Nature Park mooring buoy mandatory (overnight fee paid to the ranger, includes Park entry). Bay is fully sheltered in any wind direction.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/telescica.webp', alt: 'Telascica' }],
    },
    {
      id: 'telaščica-bay-np-kornati-piskera',
      routeFrom: 'Telaščica Bay',
      routeTo: 'NP Kornati, Piškera',
      day: 5,
      mapPin: { desktop: { left: 34.3, top: 49 }, mobile: { left: 34.3, top: 49 } },
      shortDescription:
        '10 nm south into Kornati National Park to ACI Marina Piškera on Panitula Vela — only marina inside the Park boundary, 150 lazy-line berths, single restaurant on the rocks. Park entry paid online before arrival (cheaper than at the kiosk); dinghy across to snorkel the Piškera-Lavsa channel.',
      description:
        'Ten miles south into Kornati National Park to ACI Marina Piškera, technically on Panitula Vela on the western edge of the Park. 150 berths with lazy lines, water and power, single restaurant on the rocks. Park entry paid online before arrival or at the marina kiosk (current 2025 charter-yacht day rate around €100, lower outside July–August). Afternoon move: dinghy across to the snorkelling spots in the channel between Piškera and Lavsa, or motor out to the southern crowns of the Park where the bare karst drops 80 metres into the water.',
      thingsToDo: [
        'Pay the Park entry online before arrival (cheaper than at the kiosk)',
        'Snorkel the channel between Piškera and Lavsa',
        'Sail past the southern cliffs of Mana and Kornat (80 m drops)',
        'Eat at the single restaurant above the marina',
        'Walk the bare-karst spine of Panitula Vela',
      ],
      mooringTip:
        'ACI Marina Piškera (Panitula) lazy lines on every berth — book online for July–August. Anchoring outside the marina is regulated: only Lavsa, Lojena, Vrulje, Stiniva, Statival allow overnight anchoring within Park boundaries.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Kornati' }],
    },
    {
      id: 'piskera-jezera-murter',
      routeFrom: 'Piškera',
      routeTo: 'Jezera (Murter)',
      day: 6,
      mapPin: { desktop: { left: 29.8, top: 40.1 }, mobile: { left: 29.8, top: 40.1 } },
      shortDescription:
        '12 nm east out of Kornati to Jezera on the south coast of Murter — gateway island to the Park, with ACI Marina Jezera (lazy lines, full services).',
      description:
        'Twelve miles east takes you out of Kornati to Murter, the closest inhabited island to the Park and the traditional gateway for charter boats. Murter is technically a peninsula — connected to the mainland by a small bridge at Tisno. ACI Marina Jezera on the south coast offers full services with lazy lines, fuel pontoon at the entrance. The village of Jezera wraps the bay, with a few good konobas in the back lanes serving local fish and pasticada (slow-cooked beef in red wine). Off the boat the move is to walk to the Tisno bridge and the historic salt pans (Roman-era pans still in use today) or swim from Slanica beach on the south coast.',
      thingsToDo: [
        'Walk to the Tisno saltworks (Roman-era pans still in use)',
        'Swim at Slanica beach on the south coast',
        'Order pasticada at a Jezera konoba',
        'Visit the Murter Maritime Heritage Museum in Betina',
        'Sample Murter olive oil at a quayside table',
      ],
      mooringTip:
        'ACI Marina Jezera (lazy lines, full services, fuel pontoon) is the all-weather option. Bay is well-sheltered in most wind directions.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/murter.webp', alt: 'Murter' }],
    },
    {
      id: 'jezera-murter-primosten',
      routeFrom: 'Jezera (Murter)',
      routeTo: 'Primošten',
      day: 7,
      mapPin: { desktop: { left: 54.9, top: 62.7 }, mobile: { left: 56.8, top: 60.1 } },
      shortDescription:
        '20 nm south back into ACI Marina Kremik for the Saturday handover by 09:00 — fuel topped, holding tanks emptied, decks rinsed, inventory checked. Course passes the shallow shoals around Vodice and Tribunj (well-marked, careful chart check); Split airport is 45 minutes north.',
      description:
        'Twenty miles south takes you back into ACI Marina Kremik. Saturday handover protocol applies: boat back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed, inventory checked. The course passes the shallow shoals around Vodice and Tribunj — well-marked, no issue but worth a careful chart check. With fuel pumped and inspection clear, walk up to the 16th-century St. George church on the peak of the Primošten peninsula one last time, or stand a long lunch on the harbour wall before the airport transfer (Split airport 45 minutes north).',
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        'Walk up to St. George church on the Primošten peninsula',
        'Stand a long lunch on the Primošten harbour wall',
        'Sample Babić red one last time at a peninsula konoba',
        'Take the shuttle from Marina Kremik to Primošten old town',
      ],
      mooringTip:
        'Return into ACI Marina Kremik per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primosten' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Primošten – National park Kornati Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Primošten – National park Kornati Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(primostenNpKornatiRoute);
