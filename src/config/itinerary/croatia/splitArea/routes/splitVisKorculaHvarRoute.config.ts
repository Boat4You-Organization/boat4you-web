import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const splitVisKorculaHvarRoute: ItineraryRoute = {
  metaTitle: '7-Day Split to Vis, Korčula and Hvar Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Split via Šolta, Vis, Blue Cave, Korčula, Pakleni Islands, Stari Grad & Brač — sailor brief with NM and mooring notes.',
  id: 'split-vis-korcula-hvar-route',
  startingPoint: 'Split',
  otherPoints: ['Vis', 'Korčula', 'Hvar'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/split-hvar-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/hvar-banner-large.webp',
      alt: 'Hvar',
    },
    {
      src: '/images/itinerary/croatia/banners/golden-horn-brac-banner-large.webp',
      alt: 'Golden horn brac',
    },
    {
      src: '/images/itinerary/croatia/banners/korcula-banner.webp',
      alt: 'Korcula',
    },
    {
      src: '/images/itinerary/croatia/banners/stiniva-bay-banner.webp',
      alt: 'Stiniva bay',
    },
  ],
  routeDays: [
    {
      id: 'split-maslinica-bay',
      routeFrom: 'Split',
      routeTo: 'Maslinica Bay',
      day: 1,
      mapPin: {
        desktop: { left: 31.8, top: 36.1 },
        mobile: { left: 24.8, top: 36.7 },
      },
      shortDescription:
        '15 nm southwest from ACI Marina Split or the Split Riva to Maslinica Bay on Šolta — the deep S-shaped natural harbour at the western tip of the island, fully sheltered behind a chain of seven islets at the entrance.',
      description:
        'The opening leg out of Split is 15 miles southwest into Maslinica Bay on Šolta — a deep, S-shaped natural harbour walled by hills on the village side and broken open seaward by a chain of seven small islets that kill any swell from the open Adriatic. Šolta is the closest island to Split (15 miles out) but the quietest in the central Dalmatian group: there is no day-tripper traffic, no resort overlay, and the konobas in the village square run on Šoltansko olive oil and the indigenous Dobričić red. Mooring is split between the Martinis Marchi Marina on the south side (lazy lines, 18th-century baroque-castle hotel attached, full services) and the village quay on the north side (stern-to with own anchor for a modest harbour fee). The afternoon move is to walk across to Polebrnjak islet at the western entrance, swim from the rocks, and watch the open-Adriatic sunset before settling in for dinner ashore. Day 2 pushes south into the open water, so the early night here pays off.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village agricultural shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead in July–August. Village quay (north side) takes stern-to with own anchor for a modest fee. Bay is fully sheltered from S, SW, W and NW thanks to the islet chain at the entrance; only N gradient (rare in summer) is exposed.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-bay-komiza',
      routeFrom: 'Maslinica Bay',
      routeTo: 'Komiza',
      day: 2,
      mapPin: {
        desktop: { left: 27.2, top: 59 },
        mobile: { left: 21, top: 52.8 },
      },
      shortDescription:
        '24 nm south to Komiža on Vis — the longest open-water leg of the week, crossing past the southern coast of Brač into the most westerly inhabited Croatian island and a working fishing port.',
      description:
        "Twenty-four miles south to Komiža is the longest open-water leg of the week, and the route crosses past the southern coast of Brač with the wide Hvar Channel opening up on the port quarter as you push out. Vis is the most westerly inhabited Croatian island, and the 1989 lifting of its closed-zone military status is still visible in the relative absence of resort development. Komiža sits on the western side, a working fishing port wrapped around a small bay; the harbour is split between the inner basin (stern-to with own anchor, sand-and-weed bottom, mostly good holding) and the outer wall (open to SW swell, unsuitable overnight). The town itself is small enough to walk in fifteen minutes — the working fishing fleet on the eastern side of the harbour, the Fishermen's Museum in the old Venetian tower (open afternoons), and the konoba scene built around grilled bogueroni and the indigenous Vugava white. Komiža sunset is the best in central Dalmatia by a clear margin — the western horizon is uninterrupted to Italy.",
      thingsToDo: [
        'Walk the working fishing fleet on the eastern harbour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Visit the Fishermen's Museum in the Venetian tower",
        'Hike up Mount Hum (587 m) for the 360° view',
        'Watch the open-Adriatic sunset from the harbour wall',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay — sand and weed, mostly good holding, harbour fee. Outer wall is exposed to SW swell and not safe overnight. If SW gradient is forecast above 15 kn, push 6 nm north to Vis Town in St. George Bay, which is fully sheltered.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-bisevo-islet-budihovac-vela-luka',
      routeFrom: 'Komiza',
      routeTo: 'Bisevo – Islet Budihovac – Vela Luka',
      day: 3,
      mapPin: {
        desktop: { left: 47.3, top: 63 },
        mobile: { left: 44.2, top: 57.9 },
      },
      shortDescription:
        'Blue Cave at first light, then a swim stop at Budihovac islet on the south coast of Vis, and 18 nm east into Vela Luka on Korčula. Three-stop day driven by the Blue Cave morning sun-angle window.',
      description:
        'The day starts at the Blue Cave on Biševo, where the underwater opening lights the cavern interior an unreal ultramarine only between roughly 09:00 and 11:00. Tie alongside the small concession quay outside the entrance (no overnight, lunchtime fee paid at the kiosk) and queue for one of the official tenders that ferry visitors inside; private dinghies are not allowed in. Forty minutes in and out, then back on board for the second stop — Budihovac, a small twin-islet pair off the southern coast of Vis with one of the cleanest and most photographed swim anchorages in the central Adriatic. Drop the hook in 6–8 metres on a pale sand floor and swim once before lunch on board. The afternoon push is 18 miles east into Vela Luka, the deep west-facing harbour at the end of Korčula — full town services, fuel pump at the western end of the quay, excellent shelter. Konoba dinner runs on žrnovski makaruni, the hand-rolled local pasta.',
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Swim at Budihovac twin islet on the southern coast of Vis',
        'Anchor in clean turquoise water in 6–8 m sand',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Walk the Vela Luka waterfront promenade at dusk',
      ],
      mooringTip:
        'Vela Luka offers stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Holding is excellent in mud and sand. Bay is fully sheltered from N, NE and E; only S gradient above 18 kn pushes any swell into the inner harbour, and even then the inner pontoon stays comfortable.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vela-luka.webp', alt: 'Vela Luka' }],
    },
    {
      id: 'vela-luka-hvar-palmizana',
      routeFrom: 'Vela Luka',
      routeTo: 'Hvar (Palmizana)',
      day: 4,
      mapPin: {
        desktop: { left: 38, top: 51.1 },
        mobile: { left: 37, top: 47.2 },
      },
      shortDescription:
        '30 nm east-northeast across the Korčula and Hvar Channels to Palmižana in the Pakleni Islands. The longest single passage of the week — start at first light to clear the channel before W Maestral fills in.',
      description:
        "Thirty miles east-northeast is the longest single passage of the week. Start at first light to clear the Korčula Channel before the prevailing W Maestral fills in around 14:00 — once it builds, the wind sits squarely on the beam for the remaining 18 miles into Hvar Channel and pushes you neatly into the Pakleni archipelago at hull speed. Palmižana sits on the eastern side of Sv. Klement, the largest of the Pakleni islets, and is the only one of the cluster with a marina — Palmižana ACI Marina, with stern-to lazy-line slots and limited summer capacity (book online for July–August or expect to anchor). The main bay holds in 5–10 metres on a sand-and-weed bottom but turns rolly when the Maestral funnel kicks in around 14:00, so the more comfortable overnight options are the south-side coves: Vinogradišće and Tarsce, both holding well in W gradient with line ashore the standard configuration. The afternoon ritual on Palmižana is the Meneghello family's 1906 botanical garden, dinner at one of the four konobas spread along the bay, and snorkelling over the submerged Roman amphorae off the western shore.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
        'Anchor with line ashore in Vinogradišće if the marina is full',
        'Take the water taxi across to Hvar Town for the evening',
        'Walk the path across Sv. Klement to Vlaka Bay',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, online booking essential for July–August. If full, anchor in Vinogradišće cove (south side, sand and weed, line ashore standard) — better protection from afternoon W. Avoid the main Palmižana bay overnight when SW gradient builds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/palmizana.webp', alt: 'Palmizana' }],
    },
    {
      id: 'hvar-palmizana-stari-grad',
      routeFrom: 'Hvar (Palmizana)',
      routeTo: 'Stari Grad',
      day: 5,
      mapPin: {
        desktop: { left: 42.7, top: 50.5 },
        mobile: { left: 47.3, top: 47.9 },
      },
      shortDescription:
        '14 nm clockwise around the western tip of Hvar to Stari Grad — the oldest town in Croatia (founded 384 BC as Greek Pharos) and gateway to the UNESCO Stari Grad Plain.',
      description:
        "From Palmižana the route bends 14 miles clockwise around the western tip of Hvar and into Stari Grad, set deep in a long fjord-like bay on the island's north coast. Stari Grad is the oldest town in Croatia, founded as Greek Pharos in 384 BC by colonists from Paros; the original Greek street grid is still visible in the central old town, and the surrounding Stari Grad Plain — the large agricultural plateau east of the town — is UNESCO-listed as one of the oldest continuously cultivated landscapes in Europe (the original Greek field divisions are still in use 2,400 years later). Mooring is straightforward: the town quay accepts stern-to with own anchor for a harbour fee on the entire western side of the bay, and a small ACI Marina Stari Grad sits on the eastern side with lazy lines and shore power for the all-weather option. Tvrdalj Castle, the 16th-century fortified residence of the poet Petar Hektorović with its famous freshwater fishpond, is the headline historical stop. The afternoon move is to bike out into the Stari Grad Plain through the Greek field grid.",
      thingsToDo: [
        'Walk inland through the UNESCO Stari Grad Plain',
        "Visit Tvrdalj Castle and Hektorović's freshwater fishpond",
        'Walk the Greek-grid streets in the central old town',
        'Bike the lavender belt road east of Stari Grad',
        'Order peka at a Stari Grad Plain konoba (book 3 hours ahead)',
      ],
      mooringTip:
        'Town quay stern-to with own anchor — modest harbour fee, water and power on the central section. ACI Marina Stari Grad on the eastern side has lazy lines and is the all-weather alternative. Bay is fjord-shaped and fully sheltered in any wind direction; one of the most reliable overnight bays on Hvar.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/stari-grad.webp', alt: 'Stari grad' }],
    },
    {
      id: 'stari-grad-milna',
      routeFrom: 'Stari Grad',
      routeTo: 'Milna',
      day: 6,
      mapPin: {
        desktop: { left: 39.4, top: 38.6 },
        mobile: { left: 38.3, top: 39 },
      },
      shortDescription:
        '12 nm north across the Brač Channel into Milna, the most sheltered harbour on Brač’s western coast. Sets up a short Saturday return — leave Milna at 06:30 and you are alongside in Split by 09:00.',
      description:
        "Twelve miles north across the Brač Channel takes you to Milna, the deep, narrow inlet on Brač's western coast. The bay has been a working harbour since the Venetian era and the entrance is unmistakable — the 17th-century parish church on the inner quay, stone houses stepping back from the water, the inner basin narrowing into a sheltered overnight pocket. Stern-to mooring with own anchor on the inner town quay for a modest harbour fee, water and power on the central section. Outer half of the bay is the anchorage — drop the hook in 6–10 metres on sand, take a stern line to the rocks if the afternoon Maestral builds. Brač is famous for the white limestone (the same stone used for Diocletian's Palace and quarried for centuries at Pučišća on the north coast) and for lamb under the peka, the village's three-hour Sunday lunch tradition. Order the peka the moment you tie up. The afternoon walk is to the small church on the headland north of the harbour.",
      thingsToDo: [
        'Order lamb under the peka three hours before dinner',
        'Walk to the parish church on the inner quay',
        'Anchor with stern line to rocks in the outer bay',
        "Sample Brač's olive oil at the village agricultural cooperative",
        'Dinghy 3 nm north to Bobovišća for a glassy sunset swim',
      ],
      mooringTip:
        'Stern-to on the inner town quay with own anchor — modest harbour fee, water and power on the central stretch. Outer bay accepts free anchoring with stern line to rocks. Open SW to W; if afternoon Maestral builds above 15 kn, the inner quay stays comfortable. Bobovišća (3 nm N) is the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/milna.webp', alt: 'Milna' }],
    },
    {
      id: 'milna-split',
      routeFrom: 'Milna',
      routeTo: 'Split',
      day: 7,
      mapPin: {
        desktop: { left: 37.8, top: 27.6 },
        mobile: { left: 33.3, top: 32.4 },
      },
      shortDescription:
        '15 nm east-northeast back into ACI Marina Split or the Split Riva for the Saturday handover by 09:00. Early start out of Milna, decks washed at the marina, then a final walk through Diocletian’s Palace.',
      description:
        "The final leg is fifteen miles east-northeast from Milna across the open Split Channel back into Split. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. Most Boat4You boats out of Split are based at ACI Marina Split (just west of Diocletian's Palace, the most central handover point), Marina Kaštela, or ACI Trogir — the route into all three is straightforward in any visibility. With fuel pumped and inspection clear, ACI Marina Split is a 5-minute walk from Diocletian's Palace and 25 minutes by car from Split airport. The traditional close to a Croatian charter week is a long lunch on the Split Riva or a slow walk through the Palace's Peristyle and substructures — the route just covered is one of the most balanced 7-day options out of Split, hitting Vis, Korčula and Hvar without rushing.",
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk Diocletian's Palace one final time before the airport",
        'Climb the bell tower of St. Domnius Cathedral for the panorama',
        'Take a final swim at Bačvice Beach east of the Old Town',
        'Stand a long lunch on the Split Riva before the transfer',
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
        alt: 'Split – Vis – Korčula – Hvar Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Split – Vis – Korčula – Hvar Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(splitVisKorculaHvarRoute);
