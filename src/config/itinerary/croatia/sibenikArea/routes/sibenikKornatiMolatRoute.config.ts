import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sibenikKornatiMolatRoute: ItineraryRoute = {
  metaTitle: '7-Day Šibenik to Kornati and Molat Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Šibenik via Kaprije, Piškera (Kornati NP), Telašćica, Veli Iž, Molat & Ugljan — sailor brief with NM.',
  id: 'sibenik-kornati-molat-route',
  startingPoint: 'Šibenik',
  otherPoints: ['Kornati', 'Molat'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/sibenik-kornati-card-image.webp',
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
      id: 'sibenik-kaprije',
      routeFrom: 'Šibenik',
      routeTo: 'Kaprije',
      day: 1,
      mapPin: { desktop: { left: 46.9, top: 56.4 }, mobile: { left: 46.9, top: 56.4 } },
      shortDescription:
        '15 nm west out of ACI Marina Šibenik through the St. Anthony channel narrows to Kaprije — small car-free island in the Šibenik archipelago, simple village quay and cleanest swimming in the area.',
      description:
        'Out of ACI Marina Šibenik (or D-Marin Mandalina), the opening leg is 15 miles west: down through the St. Anthony channel narrows (49 m clearance under the Šibenik bridge), past Zlarin and Krapanj, into the deep bay at Kaprije village on the eastern coast of Kaprije island. Kaprije is a small car-free island with a single working village wrapped around the bay. Stern-to mooring with own anchor on the village quay for a modest harbour fee, water on the central berths but no shore power. The bay is well-sheltered from S, SW, W and NW; only NE gradient is exposed. Off the boat the island is small enough to walk in 90 minutes — the path inland to the small chapel on the spine of the island gives the panoramic view of the Kornati cluster offshore. Konoba dinner runs on grilled fish and the local Babić red.',
      thingsToDo: [
        'Walk the path to the small chapel on the spine of the island',
        'Order grilled fish at a Kaprije konoba',
        'Swim from the rocks south of the village',
        'Sample Babić red at a quayside table',
        'Take the dinghy across to the small islets at the bay entrance',
      ],
      mooringTip:
        'Stern-to on Kaprije village quay with own anchor — modest fee, water on the central berths (no shore power). Bay is well-sheltered from S, SW, W and NW; exposed to NE gradient. If NE forecast above 18 kn, push 4 nm east into Žirje (Mikavica Bay).',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kaprije.webp', alt: 'Kaprije' }],
    },
    {
      id: 'kaprije-opat-piskera-kornati',
      routeFrom: 'Kaprije',
      routeTo: 'Piškera (Kornati)',
      day: 2,
      mapPin: { desktop: { left: 37.7, top: 53.3 }, mobile: { left: 37.7, top: 53.3 } },
      shortDescription:
        '10 nm northwest into Kornati National Park to ACI Marina Piškera — the only marina inside the Park boundary, with 150 lazy-line berths and a single restaurant on the rocks above.',
      description:
        'Ten miles northwest takes you into Kornati National Park, the 89-island archipelago that protects the densest cluster of uninhabited islets in the Mediterranean — a sea-level lunar landscape of bare karst, dry-stone walls running up the spines of the islands, zero permanent residents and a strict no-fishing rule. The headline anchorage is ACI Marina Piškera, technically on Panitula Vela on the western edge of the Park. The marina has 150 berths with lazy lines, water and power, and a single restaurant on the rocks above the harbour. Park entry fee is paid online before arrival or at the marina kiosk on check-in (current 2025 charter-yacht day rate around €100, lower outside July–August). The afternoon move is to dinghy across to the snorkelling spots in the channel between Piškera and Lavsa, or to motor out to the southern crowns of the Park where the bare karst drops 80 metres into the water.',
      thingsToDo: [
        'Pay the Park entry online before arrival (cheaper than at the kiosk)',
        'Snorkel the channel between Piškera and Lavsa',
        'Sail past the southern cliffs of Mana and Kornat (80 m drops)',
        'Eat at the single restaurant above the marina',
        'Walk the bare-karst spine of Panitula Vela',
      ],
      mooringTip:
        'ACI Marina Piškera (Panitula) lazy lines on every berth — book online for July–August. Anchoring outside the marina inside the Park is regulated: only certain bays (Lavsa, Lojena, Vrulje, Stiniva, Statival) allow overnight. Park ranger boats patrol.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Kornati' }],
    },
    {
      id: 'piskera-telaščica-bay',
      routeFrom: 'Piškera',
      routeTo: 'Telašćica Bay',
      day: 3,
      mapPin: { desktop: { left: 31.3, top: 46.3 }, mobile: { left: 31.3, top: 46.3 } },
      shortDescription:
        '8 nm north into Telašćica Nature Park — the long, deep bay carved into the southern tip of Dugi Otok, with the saltwater Mir Lake and the cliffs of Grpašćak overhead.',
      description:
        'Eight miles north takes you to Telašćica Nature Park, set on the southern tip of Dugi Otok — a long deep bay walled by cliffs and pine on the western side, opening to a string of small bays and islets on the eastern side. The Park has its own entry fee (separate from Kornati, paid at the ranger boat or kiosk in the bay), and pickup of one of the Park mooring buoys is mandatory. The headline draws are the saltwater Mir Lake (a small lake on the southern edge of the bay, separated from the sea by a narrow strip of land — popular for swimming because the water warms much faster than the open sea) and the Grpašćak cliffs on the western side, which rise 160 metres straight from the water and offer the best Adriatic panoramic from the marked walking trail at the top.',
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
      id: 'telaščica-veli-iz',
      routeFrom: 'Telašćica',
      routeTo: 'Veli Iž',
      day: 4,
      mapPin: { desktop: { left: 27.5, top: 38.1 }, mobile: { left: 20.8, top: 39.9 } },
      shortDescription:
        '15 nm northeast across the Iž Channel to Veli Iž — small island town on Iž, with stone houses around the bay and direct access to the indigenous "fjaka" pace of the Zadar archipelago.',
      description:
        'Fifteen miles northeast takes you across the Iž Channel to Veli Iž, the larger of the two villages on Iž island (Mali Iž is the smaller, on the southeast side). Stern-to mooring with own anchor on the village quay for a modest harbour fee, water on the central berths. The bay is well-sheltered from W, SW and S; exposed to NE gradient (Bora). Veli Iž is a quiet, agricultural village — pottery is the historic local craft, with a small workshop on the village square that still produces hand-thrown clay pieces using techniques unchanged for centuries. The afternoon move is to bike or walk inland to the highest point of the island (Korinjak, 168 m, signed trail) for the panoramic view of the Zadar archipelago, or to swim from the rocks on the south side of the bay.',
      thingsToDo: [
        'Visit the village pottery workshop on the central square',
        'Hike to Korinjak (168 m) for the Zadar archipelago view',
        'Order pasticada at a village konoba',
        'Swim from the rocks on the south side of the bay',
        'Sample the local figs and olive oil at a small farm',
      ],
      mooringTip:
        'Stern-to on Veli Iž village quay with own anchor — modest fee, water on the central berths. Bay is well-sheltered from W, SW and S; exposed to NE gradient (Bora). If Bora forecast above 20 kn, push 8 nm into ACI Marina Veli Iž (newer pontoon on the SE side of the bay) which has lazy lines and full services.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/iz.webp', alt: 'Iž' }],
    },
    {
      id: 'veli-iz-molat',
      routeFrom: 'Veli Iž',
      routeTo: 'Molat',
      day: 5,
      mapPin: { desktop: { left: 28.5, top: 31.8 }, mobile: { left: 28.5, top: 31.8 } },
      shortDescription:
        '12 nm northwest to Molat — long thin outer island in the Zadar archipelago, three small villages, almost no charter traffic. Natural overnight is Zapuntel Bay on the east coast: stern-to on the village pontoon (free, no services) or anchor in 6–10 m on sand-and-weed; sheltered W, SW, NW, N.',
      description:
        'Twelve miles northwest takes you to Molat, a long thin outer island in the Zadar archipelago with three small villages (Molat on the south coast, Brgulje on the north, and Zapuntel on the east) and almost no charter traffic — the island is a deliberate choice for crews who want quiet anchorages over town life. The natural overnight is Zapuntel Bay on the east coast, with stern-to mooring on the small village pontoon (free, no services) or anchor in 6–10 metres on sand-and-weed in the bay. Off the boat the move is to walk inland along the marked path to the WWII airbase ruins on the spine of the island (the Italian air force used Molat as a forward base in WWII; the runway is overgrown but the foundations are still visible) and to swim from the rocks at the bay entrance.',
      thingsToDo: [
        'Walk inland to the WWII airbase ruins on the spine of the island',
        'Anchor in Zapuntel Bay and swim from the boat',
        'Order grilled dentex at the small village konoba',
        'Sample the local sage and rosemary at a village shop',
        'Take the dinghy along the rocky east coast for snorkelling',
      ],
      mooringTip:
        'Stern-to on Zapuntel village pontoon with own anchor (free, no services), or anchor in 6–10 m on sand-and-weed in the bay. Bay is well-sheltered from W, SW, NW and N; exposed to E and SE. If SE forecast above 15 kn, push 3 nm to Brgulje on the north coast of the island.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/molat.webp', alt: 'Molat' }],
    },
    {
      id: 'molat-sutomiscica-bay-ugljan',
      routeFrom: 'Molat',
      routeTo: 'Sutomišćica Bay (Ugljan)',
      day: 6,
      mapPin: { desktop: { left: 21.2, top: 18.5 }, mobile: { left: 21.2, top: 18.5 } },
      shortDescription:
        '14 nm southeast to Sutomišćica Bay on the eastern coast of Ugljan — sheltered bay with Olive Island Marina (lazy lines) and easy walking access to the village.',
      description:
        'Fourteen miles southeast takes you to Sutomišćica Bay on the eastern coast of Ugljan island, the long thin barrier island that screens the Zadar mainland from the open Adriatic. The bay is wide and well-sheltered, with Olive Island Marina on the north shore offering stern-to lazy lines, full services, water and power. The village of Sutomišćica wraps the southern half of the bay, with a small pontoon for daytime visitors and a string of konobas along the waterfront. Off the boat the move is to walk inland on the marked path to the small chapel of St. Peter on the headland north of the bay (panoramic view across the Zadar Channel to the city, plus the Sveti Petar islet just off the coast for a paddleboard or dinghy lunch trip), or to swim from the rocks on the eastern side of the bay.',
      thingsToDo: [
        'Paddleboard out to Sveti Petar islet for the chapel-topped panorama',
        'Order škampi na buzaru (garlicky shrimp) at a Sutomišćica konoba',
        'Walk to the chapel of St. Peter for the Zadar Channel view',
        'Swim from the rocks on the eastern side of the bay',
        'Sample Ugljan olive oil at the village agricultural cooperative',
      ],
      mooringTip:
        'Olive Island Marina on the north shore is the all-weather option — lazy lines, full services, water and power. Village pontoon on the south side accepts daytime visitors only. Bay is well-sheltered in any wind direction.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sutomiscica.webp', alt: 'Sutomišćica' }],
    },
    {
      id: 'sutomiscica-vrgada-sibenik',
      routeFrom: 'Sutomišćica',
      routeTo: 'Šibenik',
      day: 7,
      mapPin: { desktop: { left: 53.8, top: 53.6 }, mobile: { left: 54.9, top: 53.6 } },
      shortDescription:
        '25 nm southeast back into ACI Marina Šibenik for the Saturday handover by 09:00, with optional Vrgada islet swim stop en route. arrive by 17:00 Friday if your contract specifies night-before return. Plan to stop at Vrgada (Mala Lamjana) for a final swim and walk to St. James.',
      description:
        "The final leg is twenty-five miles southeast from Sutomišćica back into the Šibenik charter cluster. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked. The course passes Vrgada, a small island with a single village and several quiet bays — Mala Lamjana on the south coast is the standard final-swim stop on the way south, with anchoring in 5–8 metres on sand. Then back into the Šibenik river estuary (passing the 16th-century St. Nicholas fortress at the river mouth) and up to ACI Marina Šibenik or D-Marin Mandalina. With fuel pumped and inspection clear, the marina is a 5-minute walk from St. James' Cathedral (UNESCO-listed).",
      thingsToDo: [
        'Stop at Vrgada (Mala Lamjana) for a final swim',
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk to St. James' Cathedral, UNESCO-listed",
        'Visit the medieval Šibenik town walls and St. Michael fortress',
        'Stand a long lunch on the Šibenik Riva before the transfer',
      ],
      mooringTip:
        'Return into your booked Boat4You base — ACI Marina Šibenik or D-Marin Mandalina. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sibenik.webp', alt: 'Šibenik' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Šibenik – Kornati – Molat Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Šibenik – Kornati – Molat Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(sibenikKornatiMolatRoute);
