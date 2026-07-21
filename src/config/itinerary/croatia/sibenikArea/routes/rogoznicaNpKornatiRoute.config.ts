import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const rogoznicaNpKornatiRoute: ItineraryRoute = {
  metaTitle: '7-Day Rogoznica–Kornati & Krka NP Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Marina Frapa Rogoznica via Zlarin, Skradin (Krka NP), Kaprije, Telašćica, Piškera (Kornati) & Murter — sailor brief with NM.',
  id: 'rogoznica-np-kornati-route',
  startingPoint: 'Rogoznica',
  otherPoints: ['National park Kornati'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/rogoznica-kornati-card-image.webp',
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
      id: 'rogoznica-zlarin',
      routeFrom: 'Rogoznica',
      routeTo: 'Zlarin',
      day: 1,
      mapPin: { desktop: { left: 50.9, top: 56.6 }, mobile: { left: 50.9, top: 56.6 } },
      shortDescription:
        '15 nm north from Marina Frapa Rogoznica to Zlarin in the Šibenik islands — small car-free island with seven centuries of red-coral diving on the offshore beds. Stern-to with own anchor on the village quay (modest fee, water and power); bay sheltered W, NW and N, exposed to SE.',
      description:
        "Out of Marina Frapa Rogoznica (south side of the peninsula, lazy lines, full services, fuel pontoon), the opening leg is 15 miles north along the open coast and into the Šibenik islands group to Zlarin. The island is car-free; Zlarin's claim to history is red coral — local divers have been harvesting Adriatic coral from the offshore beds for at least seven centuries. Stern-to mooring with own anchor on the village quay for a modest fee, water and power on the central berths.",
      thingsToDo: [
        'Visit the coral museum on the village square',
        'Walk inland through the cypress and pine forests',
        'Swim from the rocks on the south side',
        'Order grilled fish at a quayside konoba',
        'Pick up coral jewellery from a village workshop',
      ],
      mooringTip:
        'Stern-to on Zlarin village quay with own anchor — modest fee, water and power on the central berths. Bay is well-sheltered from W, NW and N; exposed to SE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zlarin.webp', alt: 'Zlarin' }],
    },
    {
      id: 'zlarin-skradin-np-krka',
      routeFrom: 'Zlarin',
      routeTo: 'Skradin, NP Krka',
      day: 2,
      mapPin: { desktop: { left: 51.5, top: 50.7 }, mobile: { left: 51.5, top: 50.7 } },
      shortDescription:
        '12 nm into the Krka River estuary to ACI Marina Skradin — gateway to Krka National Park, with the Park shuttle to Skradinski Buk waterfalls.',
      description:
        'Twelve miles upriver: past Šibenik old town, under the St. Anthony channel narrows (49 m clearance under the Šibenik bridge), into the freshwater section of the Krka River that ends at ACI Marina Skradin. Park entry paid at the kiosk on the marina seawall; the shuttle boat to Skradinski Buk waterfalls (15 minutes upstream) runs every 30 minutes in season. The waterfalls drop 46 metres in 17 limestone cascades. Konoba dinner runs on Skradin risotto (slow-cooked beef and saffron).',
      thingsToDo: [
        'Take the Park shuttle boat to Skradinski Buk waterfalls',
        'Walk the boardwalk loop on both sides of the river',
        'Order Skradin risotto (slow-cooked beef and saffron)',
        'Walk the medieval town behind the marina',
        'Hike up the lookout point above the waterfalls',
      ],
      mooringTip:
        'ACI Marina Skradin lazy lines on every berth, full services, fuel pontoon at the entrance. Allow 90 minutes from Šibenik river mouth at displacement speed.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
    {
      id: 'skradin-kaprije',
      routeFrom: 'Skradin',
      routeTo: 'Kaprije',
      day: 3,
      mapPin: { desktop: { left: 46.8, top: 55.4 }, mobile: { left: 46.3, top: 53.6 } },
      shortDescription:
        '15 nm back through the Krka estuary southwest to Kaprije village — small car-free island in the Šibenik archipelago. Stern-to with own anchor on the village quay (modest fee, water on central berths, no shore power); 90-minute walk inland to the chapel on the spine for the Kornati view.',
      description:
        'Back through the river estuary and 7 miles southwest to Kaprije village. The island is small enough to walk in 90 minutes; the path inland to the small chapel on the spine gives the panoramic view of the Kornati cluster offshore. Stern-to mooring with own anchor on the village quay for a modest fee, water on the central berths but no shore power.',
      thingsToDo: [
        'Walk the path to the small chapel on the spine of the island',
        'Order grilled fish at a Kaprije konoba',
        'Swim from the rocks south of the village',
        'Sample Babić red at a quayside table',
        'Take the dinghy across to the small islets at the bay entrance',
      ],
      mooringTip:
        'Stern-to on Kaprije village quay with own anchor — modest fee, water on the central berths (no shore power). Bay is sheltered from S, SW, W and NW; exposed to NE Bora.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kaprije.webp', alt: 'Kaprije' }],
    },
    {
      id: 'kaprije-telaščica-bay',
      routeFrom: 'Kaprije',
      routeTo: 'Telaščica Bay',
      day: 4,
      mapPin: { desktop: { left: 29.4, top: 43.2 }, mobile: { left: 29.4, top: 43.2 } },
      shortDescription:
        '14 nm northwest into Telašćica Nature Park on the southern tip of Dugi Otok — Park mooring buoy mandatory (separate fee from Kornati, paid to ranger). Headline draws: saltwater Mir Lake (warms faster than open sea) and the 160-metre Grpašćak cliffs; bay fully sheltered any direction.',
      description:
        'Fourteen miles northwest takes you to Telašćica Nature Park on the southern tip of Dugi Otok. Pickup of one of the Park mooring buoys is mandatory (separate fee from Kornati, paid to the ranger). The headline draws: the saltwater Mir Lake (warms much faster than the open sea) and the Grpašćak cliffs on the western side, which rise 160 metres straight from the water with a marked walking trail at the top.',
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
      mapPin: { desktop: { left: 33.3, top: 49.2 }, mobile: { left: 33.3, top: 49.2 } },
      shortDescription:
        '10 nm south into Kornati National Park to ACI Marina Piškera on Panitula Vela — 150 lazy-line berths, single restaurant on the rocks above. Park entry paid online before arrival; afternoon snorkel the Piškera-Lavsa channel or motor out to the southern crowns where karst drops 80 metres.',
      description:
        'Ten miles south into Kornati National Park to ACI Marina Piškera (Panitula Vela). 150 berths with lazy lines, water and power, single restaurant on the rocks above. Park entry paid online before arrival or at the marina kiosk (current 2025 charter-yacht day rate around €100). Afternoon move: dinghy across to the snorkelling spots in the channel between Piškera and Lavsa, or motor out to the southern crowns of the Park where the bare karst drops 80 metres into the water.',
      thingsToDo: [
        'Pay the Park entry online before arrival',
        'Snorkel the channel between Piškera and Lavsa',
        'Sail past the southern cliffs of Mana and Kornat (80 m drops)',
        'Eat at the single restaurant above the marina',
        'Walk the bare-karst spine of Panitula Vela',
      ],
      mooringTip:
        'ACI Marina Piškera lazy lines on every berth — book online for July–August. Anchoring outside the marina is regulated: only Lavsa, Lojena, Vrulje, Stiniva, Statival allow overnight within Park boundaries.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Kornati' }],
    },
    {
      id: 'piskera-jezera-murter',
      routeFrom: 'Piškera',
      routeTo: 'Jezera (Murter)',
      day: 6,
      mapPin: { desktop: { left: 41.3, top: 44.6 }, mobile: { left: 41.3, top: 44.6 } },
      shortDescription:
        '12 nm east out of Kornati to Jezera on the south coast of Murter — gateway island to the Park, with ACI Marina Jezera (lazy lines, full services).',
      description:
        'Twelve miles east out of Kornati to Murter — closest inhabited island to the Park, connected to the mainland by a small bridge at Tisno. ACI Marina Jezera on the south coast offers full services with lazy lines, fuel pontoon at the entrance. Off the boat: walk to the Tisno bridge and the Roman-era salt pans, or swim from Slanica beach. Konoba dinner on pasticada (slow-cooked beef in red wine).',
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
      id: 'jezera-murter-rogoznica',
      routeFrom: 'Jezera (Murter)',
      routeTo: 'Rogoznica',
      day: 7,
      mapPin: { desktop: { left: 54.9, top: 67.1 }, mobile: { left: 59.6, top: 60.2 } },
      shortDescription:
        '20 nm south back into Marina Frapa Rogoznica for the Saturday handover by 09:00 — fuel topped, holding tanks emptied, decks rinsed, inventory checked. Optional final swim at Primošten Raduča beach en route; Split airport is 1 hour north for the transfer.',
      description:
        "Twenty miles south back into Marina Frapa Rogoznica. Saturday handover protocol: boat back at base by 09:00, fuel topped, holding tanks emptied, decks rinsed, inventory checked. Course passes Primošten (worth a brief swim stop at Raduča beach if time allows). With fuel pumped and inspection clear, walk the path to the Dragon's Eye Lake on the southern tip of Rogoznica peninsula one last time, or stand a long lunch at the marina hotel restaurant before the airport transfer (Split airport 1 hour north).",
      thingsToDo: [
        'Stop for a final swim at Primošten Raduča beach',
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk the path to the Dragon's Eye Lake",
        'Stand a long lunch at the marina hotel restaurant',
        'Walk the small old quarter on Rogoznica peninsula',
      ],
      mooringTip:
        'Return into Marina Frapa Rogoznica per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rogoznica.webp', alt: 'Rogoznica' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Rogoznica – National park Kornati Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Rogoznica – National park Kornati Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(rogoznicaNpKornatiRoute);
