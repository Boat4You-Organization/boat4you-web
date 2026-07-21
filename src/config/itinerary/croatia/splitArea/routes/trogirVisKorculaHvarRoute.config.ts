import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const trogirVisKorculaHvarRoute: ItineraryRoute = {
  metaTitle: '7-Day Trogir to Vis, Korčula and Hvar Yacht Route | Boat4You',
  metaDesc:
    'Saturday-to-Saturday yacht route from ACI Trogir via Šolta, Vis, the Blue Cave, Korčula, Hvar and Stari Grad — full sailor brief with distances, marinas and mooring notes.',
  id: 'trogir-vis-korcula-hvar-route',
  startingPoint: 'Trogir',
  otherPoints: ['Vis', 'Korčula', 'Hvar'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/trogir-korcula-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/kornati-national-park-banner-large.webp',
      alt: 'Kornati national park',
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
      id: 'trogir-maslinica-solta',
      routeFrom: 'Trogir',
      routeTo: 'Maslinica (Šolta)',
      day: 1,
      mapPin: {
        desktop: { left: 30.9, top: 36.6 },
        mobile: { left: 24.6, top: 39.1 },
      },
      shortDescription:
        '12 nm south from ACI Trogir into Maslinica on the western tip of Šolta — the only proper natural harbour on the island, fully sheltered behind a chain of seven islets at the entrance.',
      description:
        "Out of ACI Marina Trogir the route bends south for the 12-mile crossing to Maslinica on Šolta. ACI Trogir sits on the western side of Čiovo, immediately east of the UNESCO old town of Trogir, and the leg out is straightforward — clear the Trogir bridge channel, push south past the southern coast of Čiovo, and round the western tip into Šolta's wide bay. Maslinica is the deep S-shaped natural harbour walled by hills on the village side and broken open seaward by a chain of seven small islets that kill any swell. Mooring is split between Martinis Marchi Marina on the south side (lazy lines, baroque-castle hotel attached) and the village quay on the north side (stern-to with own anchor). Šolta is the closest island to Split but the quietest in the central group — no day-tripper traffic, no resort overlay, konobas running on Šoltansko olive oil and the indigenous Dobričić red. The afternoon move is to walk across to Polebrnjak islet at the western entrance, swim from the rocks, and watch the open-Adriatic sunset before settling in for dinner ashore.",
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead in July–August. Village quay (north side) takes stern-to with own anchor for a modest fee. Bay is fully sheltered from S, SW, W and NW thanks to the islet chain at the entrance; only N gradient (rare in summer) is exposed.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-komiza',
      routeFrom: 'Maslinica',
      routeTo: 'Komiža (Vis)',
      day: 2,
      mapPin: {
        desktop: { left: 26.8, top: 59.8 },
        mobile: { left: 19.4, top: 52.1 },
      },
      shortDescription:
        '24 nm south to Komiža on Vis — the longest open-water leg of the week, crossing past the southern coast of Brač into the most westerly inhabited Croatian island and a working fishing port.',
      description:
        "Twenty-four miles south to Komiža is the longest open-water leg of the week, and the route crosses past the southern coast of Brač with the wide Hvar Channel opening up on the port quarter as you push out. Vis is the most westerly inhabited Croatian island, until 1989 a closed Yugoslav military zone, and the relative absence of resort development is still visible across the island. Komiža sits on the western side, a working fishing port wrapped around a small bay; the harbour is split between the inner basin (stern-to with own anchor on a sand-and-weed bottom, mostly good holding) and the outer wall (open to SW swell, unsuitable overnight). The town itself is small enough to walk in fifteen minutes — the working fishing fleet on the eastern side of the harbour, the Fishermen's Museum in the old Venetian tower (open afternoons), and the konoba scene built around grilled bogueroni and the indigenous Vugava white. The Komiža sunset is the best in central Dalmatia by a clear margin — the western horizon is uninterrupted to Italy.",
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
      id: 'komiza-bisevo-budihovac-vela-luka',
      routeFrom: 'Komiža',
      routeTo: 'Biševo – Budihovac – Vela Luka',
      day: 3,
      mapPin: {
        desktop: { left: 46.3, top: 65.4 },
        mobile: { left: 42.9, top: 58.3 },
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
        'Vela Luka offers stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Holding is excellent in mud and sand. Bay is fully sheltered from N, NE and E; only S gradient above 18 kn pushes any swell into the inner harbour.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vela-luka.webp', alt: 'Vela Luka' }],
    },
    {
      id: 'vela-luka-hvar',
      routeFrom: 'Vela Luka',
      routeTo: 'Hvar',
      day: 4,
      mapPin: {
        desktop: { left: 39, top: 51.7 },
        mobile: { left: 34.9, top: 49.1 },
      },
      shortDescription:
        '32 nm east-northeast across the Korčula and Hvar Channels into Hvar Town — the loudest harbour in the Adriatic in summer, with ACI Marina the only safe overnight option in any blow.',
      description:
        "Thirty-two miles east-northeast is the longest single passage of the week. Start at first light to clear the Korčula Channel before the prevailing W Maestral fills in around 14:00 — once it builds, the wind sits squarely on the beam for the remaining 18 miles into Hvar Channel. The destination is Hvar Town, the loudest and most photographed harbour on the entire Croatian coast in summer. The skyline is unmistakable: the 16th-century Fortica fortress rising over the rooftops, the Arsenal's stone arches on the seafront, the Cathedral of St. Stephen marking the central square. ACI Marina Hvar sits on the western side of the bay and is the only practical overnight option for a 12-metre yacht in anything more than a flat calm — book ahead, lazy lines provided, water and power on every berth. The town quay (riva) accepts mooring against a fee but it fills with tour boats, taxi rides and superyacht tenders by midday, plus there is no protection from the afternoon Maestral funnel. Use the marina, walk in, climb the Fortica before the heat, then settle in for the konoba dinner in the back lanes off the central square.",
      thingsToDo: [
        'Climb the Fortica before midday for the Pakleni view',
        "Walk the Arsenal and St. Stephen's Cathedral on the main square",
        'Stand a round at one of the back-lane konobas',
        'Take the lavender shop tour off Trg Sv. Stjepana',
        'Watch the harbour traffic from the marina seawall after dark',
      ],
      mooringTip:
        'ACI Marina Hvar is mandatory in any wind — book ahead, lazy lines provided, water and power on every berth. Town quay accepts boats by the hour for a stiff fee but is exposed to W gusts and crowded with tenders; not viable overnight in season.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-stari-grad',
      routeFrom: 'Hvar',
      routeTo: 'Stari Grad',
      day: 5,
      mapPin: {
        desktop: { left: 42.8, top: 49.1 },
        mobile: { left: 41.3, top: 45.9 },
      },
      shortDescription:
        '14 nm clockwise around the western tip of Hvar to Stari Grad — the oldest town in Croatia (founded 384 BC as Greek Pharos) and gateway to the UNESCO Stari Grad Plain agricultural landscape.',
      description:
        "Fourteen miles clockwise around the western tip of Hvar takes you to Stari Grad, set deep in a long fjord-like bay on the island's north coast. Stari Grad is the oldest town in Croatia, founded as Greek Pharos in 384 BC by colonists from Paros; the original Greek street grid is still visible in the central old town, and the surrounding Stari Grad Plain — the large agricultural plateau east of the town — is UNESCO-listed as one of the oldest continuously cultivated landscapes in Europe (the original Greek field divisions are still in use 2,400 years later). Mooring is straightforward: the town quay accepts stern-to with own anchor for a harbour fee on the entire western side of the bay, and a small ACI Marina Stari Grad sits on the eastern side with lazy lines and shore power for the all-weather option. Tvrdalj Castle, the 16th-century fortified residence of the poet Petar Hektorović with its famous freshwater fishpond, is the headline historical stop.",
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
        desktop: { left: 38.4, top: 41.9 },
        mobile: { left: 34.3, top: 37.7 },
      },
      shortDescription:
        '12 nm north across the Brač Channel into Milna, the most sheltered harbour on Brač’s western coast. Sets up a short Saturday return — leave Milna at 06:30 and you are alongside in Trogir by 09:00.',
      description:
        "Twelve miles north across the Brač Channel takes you to Milna, the deep, narrow inlet on Brač's western coast. The bay has been a working harbour since the Venetian era and the entrance is unmistakable — the 17th-century parish church on the inner quay, stone houses stepping back from the water, the inner basin narrowing into a sheltered overnight pocket. Stern-to mooring with own anchor on the inner town quay for a modest harbour fee, water and power on the central section. Outer half of the bay is the anchorage — drop the hook in 6–10 metres on sand, take a stern line to the rocks if the afternoon Maestral builds. Brač is famous for the white limestone (the same stone used for Diocletian's Palace and quarried for centuries at Pučišća on the north coast) and for lamb under the peka, the village's three-hour Sunday lunch tradition. Order the peka the moment you tie up.",
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
      id: 'milna-trogir',
      routeFrom: 'Milna',
      routeTo: 'Trogir',
      day: 7,
      mapPin: {
        desktop: { left: 32.7, top: 28.1 },
        mobile: { left: 25.3, top: 30.9 },
      },
      shortDescription:
        '15 nm northwest across the Brač and Split Channels back into ACI Marina Trogir for the Saturday handover by 09:00. Final swim off the south coast of Čiovo before pushing into the marina entrance.',
      description:
        "The final leg is fifteen miles northwest from Milna across the Brač and Split Channels back into ACI Marina Trogir. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. The course passes the southern coast of Čiovo on the run northwest, with a string of small swimming bays along its southern shore; Slatine and Saldun are the obvious choices for a final dip before pushing west into the marina entrance. Once the inspection is clear, ACI Trogir is a 5-minute walk from Trogir's UNESCO old town. The Cathedral of St. Lawrence with the 13th-century Radovan portal — one of the most important pieces of medieval Croatian sculpture — is the headline stop. The Kamerlengo fortress on the western tip of the old town is the panoramic alternative. Split airport is 10 minutes north by car; a long lunch on Trogir Riva closes the week.",
      thingsToDo: [
        'Stop for a final swim off the south coast of Čiovo',
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk Trogir UNESCO old town and the Cathedral's Radovan portal",
        'Climb the Kamerlengo fortress on the western tip of Trogir',
        'Stand a long lunch on Trogir Riva before the transfer',
      ],
      mooringTip:
        'Return into ACI Marina Trogir per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return. Fuel pontoon is on the western entrance side of the marina.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/trogir.webp', alt: 'Trogir' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Trogir – Vis – Korčula – Hvar Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Trogir – Vis – Korčula – Hvar Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(trogirVisKorculaHvarRoute);
