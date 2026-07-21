import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const kastelaVisKorculaHvarRoute: ItineraryRoute = {
  metaTitle: '7-Day Kaštela to Vis, Korčula and Hvar Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Kaštela via Šolta, Vis, Blue Cave, Korčula, Pakleni Islands, Stari Grad & Brač — sailor brief with NM and mooring notes.',
  id: 'kastela-vis-korcula-hvar-route',
  startingPoint: 'Kaštela',
  otherPoints: ['Vis', 'Korčula', 'Hvar'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/kastela-vis-hvar-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/kornati-national-park-banner-large.webp',
      alt: 'Kornati national park',
    },
    {
      src: '/images/itinerary/croatia/banners/national-park-kornati-banner-large.webp',
      alt: 'Kornati national park',
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
      id: 'kastela-maslinica-bay-solta',
      routeFrom: 'Kaštela',
      routeTo: 'Maslinica Bay (Šolta)',
      day: 1,
      mapPin: {
        desktop: { left: 32.5, top: 35.2 },
        mobile: { left: 32.5, top: 35.2 },
      },
      shortDescription:
        '13 nm southwest from Marina Kaštela across the Split Channel to Maslinica on Šolta — the only proper natural harbour on the island and a quiet, low-distance opener while the crew finds its rhythm on board.',
      description:
        'Out of Marina Kaštela the course swings southwest for the 13-mile crossing to Maslinica, the deep S-shaped bay on the western tip of Šolta. The seven-islet chain at the entrance breaks any swell from the open Adriatic, leaving the inner half of the bay glass-flat in almost any condition; the village wraps the inner half on the north side, and the 18th-century baroque Martinis Marchi castle sits on the south side, now operating as a marina, hotel and restaurant. Šolta is the closest island to Split (15 miles out) but the quietest in the central Dalmatian group — there is no day-tripper traffic, no resort overlay, and the konobas in the village square run on Šoltansko olive oil and the indigenous Dobričić red. The afternoon move is to walk across to Polebrnjak islet at the western entrance, swim from the rocks, and watch the open-Adriatic sunset before settling in for dinner ashore. Day 2 pushes south into the open water, so the early night here pays off.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village agricultural shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead in July–August. Village quay (north side) takes stern-to with own anchor, modest fee. Bay is fully sheltered from S, SW, W and NW thanks to the islet chain at the entrance; only N gradient (rare in summer) is exposed.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-bay-komiza-vis',
      routeFrom: 'Maslinica Bay',
      routeTo: 'Komiža (Vis)',
      day: 2,
      mapPin: {
        desktop: { left: 27.5, top: 56.3 },
        mobile: { left: 18.3, top: 53.4 },
      },
      shortDescription:
        '24 nm south to Komiža on Vis — the longest open-water leg of the week, crossing past the southern coast of Brač and into the most westerly inhabited Croatian island, until 1989 a closed Yugoslav military zone.',
      description:
        "Twenty-four miles south to Komiža is the longest open-water leg of the week, and the route crosses past the southern coast of Brač with the wide Hvar Channel opening up on the port quarter as you push out. Vis is the most westerly inhabited Croatian island, and the 1989 lifting of its closed-zone military status is still visible in the relative absence of resort development — the small towns on Vis still feel like the Adriatic of three decades ago. Komiža sits on the western side, a working fishing port wrapped around a small bay; the harbour is split between the inner basin (stern-to with own anchor, sand-and-weed bottom, mostly good holding) and the outer wall (open to SW swell, unsuitable overnight). The town itself is small enough to walk in fifteen minutes — the working fishing fleet on the eastern side of the harbour, the Fishermen's Museum in the old Venetian tower (open afternoons), and the konoba scene built around grilled bogueroni and the indigenous Vugava white. The Komiža sunset is the best in central Dalmatia by a clear margin — the western horizon is uninterrupted to Italy.",
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
      id: 'komiza-blue-cave-bisevo-vela-luka-korcula',
      routeFrom: 'Komiža',
      routeTo: 'Blue Cave (Biševo) – Vela Luka (Korčula)',
      day: 3,
      mapPin: {
        desktop: { left: 45.1, top: 64.4 },
        mobile: { left: 45.1, top: 64.4 },
      },
      shortDescription:
        'Blue Cave morning then 18 nm east to Vela Luka at the western end of Korčula. The Blue Cave on Biševo only lights up between roughly 09:00 and 11:00 — the day flexes around that window.',
      description:
        "The day's calendar is dictated by the sun angle inside the Blue Cave on Biševo: the underwater opening turns the cavern interior an unreal ultramarine only between roughly 09:00 and 11:00, after which the colour fades. Tie alongside the small concession quay outside the entrance (no overnight, lunchtime fee paid at the kiosk) and queue for one of the official tenders that ferry visitors inside; private dinghies are not allowed in. Forty minutes in and out, then back on board for the 18-mile run southeast to Korčula's Vela Luka, the deep west-facing harbour at the end of the island. Vela Luka has full town services — fuel, water, power on the long town quay — and is one of the best-sheltered overnight bays on the entire south coast: the bay is fully protected from N, NE and E. Konoba dinner in the village runs on žrnovski makaruni, the hand-rolled local pasta, and the catch of the day off the boat fleet on the inner quay.",
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Sail past the south face of Vis on the leg east',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Walk the Vela Luka waterfront promenade at dusk',
        'Visit the prehistoric Vela Spila (Big Cave) above the town',
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
        desktop: { left: 38.4, top: 51.8 },
        mobile: { left: 31.3, top: 49.1 },
      },
      shortDescription:
        '30 nm east-northeast across the Korčula and Hvar Channels to Palmižana in the Pakleni Islands. Long day — start at first light, expect prevailing W Maestral on the beam by mid-morning.',
      description:
        "The leg from Vela Luka to Palmižana is 30 miles east-northeast and is the longest single passage of the week. Start at first light to clear the Korčula Channel before the W Maestral fills in around 14:00 — once it builds, the wind sits squarely on the beam for the remaining 18 miles into Hvar Channel and pushes you neatly into the Pakleni archipelago at hull speed. Palmižana sits on the eastern side of Sv. Klement, the largest of the Pakleni islets, and is the only one of the cluster with a marina — Palmižana ACI Marina, with stern-to lazy-line slots and limited summer capacity (book online for July–August or expect to anchor). The main bay holds in 5–10 metres on a sand-and-weed bottom but turns rolly when the Maestral funnel kicks in around 14:00, so the more comfortable overnight options are the south-side coves: Vinogradišće and Tarsce, both holding well in W gradient with line ashore the standard configuration. After the long day, the afternoon ritual is the Meneghello family's 1906 botanical garden, dinner at one of the four konobas spread along the bay, and the snorkelling over the submerged Roman amphorae off the western shore.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
        'Anchor with line ashore in Vinogradišće if the marina is full',
        'Take the water taxi across to Hvar Town for the evening',
        'Walk the path across Sv. Klement to Vlaka Bay',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, online booking essential for July–August. If full, anchor in Vinogradišće cove (south side, sand and weed, line ashore standard) — better protection from afternoon W Maestral. Avoid the main Palmižana bay overnight when SW gradient builds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/palmizana.webp', alt: 'Palmizana' }],
    },
    {
      id: 'hvar-stari-grad',
      routeFrom: 'Hvar',
      routeTo: 'Stari Grad',
      day: 5,
      mapPin: {
        desktop: { left: 41, top: 49.3 },
        mobile: { left: 43.1, top: 46 },
      },
      shortDescription:
        '12 nm clockwise around the western end of Hvar into Stari Grad — the oldest town in Croatia (founded 384 BC as Greek Pharos) and gateway to the UNESCO Stari Grad Plain agricultural landscape.',
      description:
        "The Day 5 leg is short — 12 miles clockwise around the western tip of Hvar into Stari Grad, set deep in a long fjord-like bay on the island's north coast. Stari Grad is the oldest town in Croatia, founded as Greek Pharos in 384 BC by colonists from Paros; the original Greek street grid is still visible in the central old town, and the surrounding Stari Grad Plain — the large agricultural plateau that opens up east of the town — is UNESCO-listed as one of the oldest continuously cultivated landscapes in Europe (the original Greek field divisions are still in use 2,400 years later). Mooring is straightforward: the town quay accepts stern-to with own anchor for a harbour fee on the entire western side of the bay, and a small ACI Marina Stari Grad sits on the eastern side with lazy lines and shore power for the all-weather option. Tvrdalj Castle, the 16th-century fortified residence of the poet Petar Hektorović with its famous freshwater fishpond, is the headline historical stop. The afternoon move is to bike out into the Stari Grad Plain — the road runs straight east from town through the original Greek field grid and the lavender belt — or to walk the medieval lanes back from the harbour.",
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
      id: 'stari-grad-milna-brac',
      routeFrom: 'Stari Grad',
      routeTo: 'Milna (Brač)',
      day: 6,
      mapPin: {
        desktop: { left: 38.9, top: 39.8 },
        mobile: { left: 38.9, top: 39.8 },
      },
      shortDescription:
        '12 nm north across the Brač Channel into Milna, the most sheltered harbour on Brač’s western coast. The Day 6 stop sets up a short Saturday return — leave Milna at 06:30 and you are alongside in Kaštela by 09:00.',
      description:
        "Twelve miles north across the Brač Channel takes you to Milna, the deep, narrow inlet on Brač's western coast. The bay has been a working harbour since the Venetian era and the entrance is unmistakable — the 17th-century parish church on the inner quay, stone houses stepping back from the water, the inner basin narrowing into a sheltered overnight pocket. Stern-to mooring with own anchor on the inner town quay for a modest harbour fee, water and power on the central section. Outer half of the bay is the anchorage — drop the hook in 6–10 metres on sand, take a stern line to the rocks if the afternoon Maestral builds. Brač is famous for the white limestone (the same stone used for Diocletian's Palace and quarried for centuries at Pučišća on the north coast) and for lamb under the peka, the village's three-hour Sunday lunch tradition. Order the peka the moment you tie up. The afternoon walk is to the small church on the headland north of the harbour, then back for the slow konoba dinner.",
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
      id: 'milna-kastela',
      routeFrom: 'Milna',
      routeTo: 'Kaštela',
      day: 7,
      mapPin: {
        desktop: { left: 35.6, top: 26.7 },
        mobile: { left: 27.7, top: 31.2 },
      },
      shortDescription:
        '15 nm east-northeast back into Marina Kaštela for the Saturday handover by 09:00. Early start out of Milna, fuel up at the marina pontoon, decks washed and the boat presented for inspection.',
      description:
        "The final leg is fifteen miles east-northeast from Milna across the open Split Channel into Marina Kaštela. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. Marina Kaštela sits in a deep west-facing bay between Split and Trogir; the marina control tower is unmistakable from offshore and the run-in is straightforward in any visibility. With fuel pumped and inspection clear, the marina is a fifteen-minute drive from Split airport and twenty-five minutes from the city centre. Most charter weeks end here on a satisfied silence — the route just covered is one of the most balanced 7-day options out of Split, hitting the headline destinations of central Dalmatia (Vis, Korčula, Hvar) without the rushed tempo of trying to push further south to Dubrovnik in a single week. A long lunch on the Riva in Trogir or in Diocletian's Palace in Split closes the week.",
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk Diocletian's Palace one final time before the airport",
        'Take a final swim at Bačvice Beach east of the Old Town',
        'Pick up Šoltansko olive oil at the Pazar farmers market',
        'Stand a long lunch on Trogir Riva before the transfer',
      ],
      mooringTip:
        'Return into Marina Kaštela per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return. Fuel pontoon is on the western entrance side of the marina.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kastela.webp', alt: 'Kastela' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Kaštela – Vis – Korčula – Hvar Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Kaštela – Vis – Korčula – Hvar Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(kastelaVisKorculaHvarRoute);
