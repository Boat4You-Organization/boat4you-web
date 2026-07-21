import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const sibenikHvarVisSoltaRoute: ItineraryRoute = {
  metaTitle: '7-Day Šibenik to Hvar, Vis and Šolta Yacht Route | Boat4You',
  metaDesc:
    'Saturday-to-Saturday yacht route from Šibenik via Primošten, Vis, the Blue Cave, the Pakleni Islands and Šolta — full sailor brief with distances, marinas and mooring notes.',
  id: 'sibenik-hvar-vis-solta-route',
  startingPoint: 'Šibenik',
  otherPoints: ['Hvar', 'Vis', 'Solta'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/sibenik-vis-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/hvar-banner-large.webp', alt: 'Hvar' },
    { src: '/images/itinerary/croatia/banners/golden-horn-brac-banner-large.webp', alt: 'Golden horn brac' },
    { src: '/images/itinerary/croatia/banners/korcula-banner.webp', alt: 'Korcula' },
    { src: '/images/itinerary/croatia/banners/stiniva-bay-banner.webp', alt: 'Stiniva bay' },
  ],
  routeDays: [
    {
      id: 'sibenik-primosten',
      routeFrom: 'Šibenik',
      routeTo: 'Primošten',
      day: 1,
      mapPin: { desktop: { left: 22.1, top: 22.9 }, mobile: { left: 13.6, top: 29.6 } },
      shortDescription:
        '14 nm south from ACI Marina Šibenik through the St. Anthony channel narrows into Primošten — peninsula town with the 16th-century St. George church on the high point and the Bukovac dry-stone vineyards stepping up the hills inland.',
      description:
        'Out of ACI Marina Šibenik (or D-Marin Mandalina), the opening leg is 14 miles south down through the St. Anthony channel narrows (49 m clearance under the Šibenik bridge) and along the open coast to Primošten. The peninsula is unmistakable from offshore: barely connected to the mainland by a sandy spit, the 16th-century church of St. George at the top, terracotta roofs running down to the water on every side. The town quay accepts daytime visitors only, and ACI Marina Kremik (two miles south of the centre) handles the overnight slots with lazy lines and a regular shuttle bus to Primošten itself. Behind the town are the Bukovac vineyards — dry-stone-walled terraces stepped up the hills to grow the indigenous Babić red — listed in MoMA New York as agricultural land art. Order a glass on the harbour wall at sunset.',
      thingsToDo: [
        'Walk up to the 16th-century St. George church on the peak',
        'Order Babić red on the harbour wall at sunset',
        'Walk the dry-stone Bukovac vineyard terraces',
        'Eat brudet (fish stew) at a peninsula konoba',
        'Take the shuttle from Marina Kremik for dinner in town',
      ],
      mooringTip:
        'ACI Marina Kremik (2 nm south of the town) is the all-weather overnight option — lazy lines, full services, regular shuttle into Primošten. Town quay accepts daytime stops only and is exposed to W.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primosten' }],
    },
    {
      id: 'primosten-krknjasi-bay-veli-drvenik',
      routeFrom: 'Primošten',
      routeTo: 'Krknjaši Bay (Veli Drvenik)',
      day: 2,
      mapPin: { desktop: { left: 26.8, top: 32 }, mobile: { left: 22.1, top: 35.7 } },
      shortDescription:
        '12 nm south to Krknjaši Bay between the two Drvenik islands — glass-water swim anchorage 4 nm west of Trogir, ideal lunchtime stop and second-night quiet.',
      description:
        'Twelve miles south takes you across to Krknjaši Bay in the channel between Veli Drvenik and Mali Drvenik, two small uninhabited islands four miles west of Trogir. Krknjaši is a swim anchorage rather than a destination: shallow with a pale sand floor at 3–6 metres, holding excellent, water turning turquoise on a calm day. Three small restaurants on Veli Drvenik (no road access — boat or foot from the south-coast village only) lay free mooring buoys for guests, but anchoring on the sand floor is the more common choice. Off the boat the move is to swim, walk the 30-minute headland loop, and eat ashore at one of the restaurants for grilled orada and the local Plavac Mali.',
      thingsToDo: [
        'Anchor on the sand floor in 4–6 m and swim',
        'Walk the 30-minute headland loop on Veli Drvenik',
        'Order grilled fish at a Veli Drvenik beach restaurant',
        'Sample the local Plavac Mali at a quayside table',
        'Watch the open-Adriatic sunset from the deck',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding (the standard choice). Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NE, E, S and SE; exposed only to W and NW.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/krknjasi.webp', alt: 'krknjasi' }],
    },
    {
      id: 'krknjasi-bay-komiza-vis',
      routeFrom: 'Krknjaši Bay',
      routeTo: 'Komiža (Vis)',
      day: 3,
      mapPin: { desktop: { left: 31.2, top: 56.9 }, mobile: { left: 23.1, top: 51.3 } },
      shortDescription:
        '25 nm southwest to Komiža on Vis — most westerly inhabited Croatian island, until 1989 closed military zone, working fishing port and the best sunset on the route.',
      description:
        "Twenty-five miles southwest to Komiža is one of the longest single legs of the week. Vis is the most westerly inhabited Croatian island and the 1989 lifting of its closed-zone military status is still visible in the relative absence of resort development. Komiža sits on the western side, a working fishing port wrapped around a small bay; stern-to with own anchor on the inner basin (sand and weed, mostly good holding) — outer wall is open to SW swell. The town itself is small enough to walk in fifteen minutes — the working fishing fleet on the eastern side of the harbour, the Fishermen's Museum in the old Venetian tower, and the konoba scene built around grilled bogueroni and the indigenous Vugava white. The Komiža sunset is the best in central Dalmatia by a clear margin.",
      thingsToDo: [
        "Hike up Mount Hum (587 m) to Tito's WWII cave",
        'Walk the working fishing fleet on the eastern harbour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Visit the Fishermen's Museum in the Venetian tower",
        'Watch the open-Adriatic sunset from the harbour wall',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay — sand and weed, mostly good holding, harbour fee. Outer wall is exposed to SW swell. If SW gradient above 15 kn, push 6 nm north to Vis Town in St. George Bay.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-blue-cave-bisevo-palmizana-hvar',
      routeFrom: 'Komiža',
      routeTo: 'Palmižana (Hvar)',
      day: 4,
      mapPin: { desktop: { left: 37.3, top: 51.8 }, mobile: { left: 35, top: 46.7 } },
      shortDescription:
        'Blue Cave morning then 20 nm east-northeast to Palmižana in the Pakleni Islands — only inhabited islet in the cluster and the only one with a marina.',
      description:
        "The day starts at the Blue Cave on Biševo — the underwater opening lights the cavern interior an unreal ultramarine only between roughly 09:00 and 11:00. Tie alongside the small concession quay outside the entrance (no overnight, lunchtime fee) and queue for one of the official tenders that ferry visitors inside; private dinghies are not allowed in. Forty minutes in and out, then push 20 miles east-northeast to Palmižana on Sv. Klement, the largest of the Pakleni Islands. ACI Marina Palmižana with stern-to lazy lines (book online for July–August). Main bay holds in 5–10 m on sand-and-weed but turns rolly when Maestral funnel kicks in around 14:00; comfortable overnight options are south-side coves Vinogradišće and Tarsce. The afternoon ritual is the Meneghello family's 1906 botanical garden, dinner at one of the four konobas spread along the bay, and snorkelling over the submerged Roman amphorae off the western shore.",
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
        'Anchor with line ashore in Vinogradišće if the marina is full',
        'Take the water taxi across to Hvar Town for the evening',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, online booking essential for July–August. If full, anchor in Vinogradišće cove (south side, sand and weed, line ashore standard). Avoid the main bay overnight when SW gradient builds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/palmizana.webp', alt: 'Palmižana' }],
    },
    {
      id: 'palmizana-maslinica-solta',
      routeFrom: 'Palmižana',
      routeTo: 'Maslinica (Šolta)',
      day: 5,
      mapPin: { desktop: { left: 31.1, top: 37.2 }, mobile: { left: 27.3, top: 38.2 } },
      shortDescription:
        '18 nm northwest to Maslinica on Šolta’s western tip — the only proper natural harbour on Šolta, fully sheltered behind a chain of seven islets.',
      description:
        'Eighteen miles northwest takes you to Maslinica, the deep S-shaped natural harbour at the western tip of Šolta. The chain of seven small islets at the entrance kills any swell from the open Adriatic. Mooring is split between Martinis Marchi Marina on the south side (lazy lines, 18th-century baroque-castle hotel attached) and the village quay on the north side (stern-to with own anchor for a modest fee). Šolta is the closest island to Split (15 miles out) but the quietest in the central Dalmatian group — the konobas in the village square run on Šoltansko olive oil and the indigenous Dobričić red. The afternoon move is to walk across to Polebrnjak islet at the western entrance, swim from the rocks, and watch the open-Adriatic sunset.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead. Village quay (north side) takes stern-to with own anchor. Bay is fully sheltered from S, SW, W and NW thanks to the islet chain at the entrance.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-rogoznica',
      routeFrom: 'Maslinica',
      routeTo: 'Rogoznica',
      day: 6,
      mapPin: { desktop: { left: 22.8, top: 29.5 }, mobile: { left: 15.5, top: 33 } },
      shortDescription:
        '15 nm northwest to Rogoznica — peninsula town with the inland Dragon’s Eye salt lake and Marina Frapa on the south side, one of the largest marinas in central Dalmatia.',
      description:
        "Fifteen miles northwest along the open coast takes you to Rogoznica, a peninsula town set on a low headland between Šibenik and Split. Rogoznica's geographic curiosity is the Dragon's Eye Lake (Zmajevo Oko) — a deep saltwater karst lake on the southern tip of the peninsula, connected to the sea through a hidden underwater channel that flushes the basin twice a day with the tide. Marina Frapa sits on the south side of the peninsula and is one of the largest marinas in central Dalmatia by berth count, with lazy lines, full services, a hotel, several restaurants and a fuel pontoon at the entrance. Smaller boats can also stern-to on the village quay on the north side, but exposure to NW gradient makes the marina the more reliable choice in season.",
      thingsToDo: [
        "Walk the path to the Dragon's Eye Lake on the southern tip",
        'Look down at the karst lake from the limestone cliffs',
        'Order brudet (fish stew) at a peninsula konoba',
        'Walk the small old quarter on the headland',
        'Take the dinghy across to Smokvica islet for an afternoon swim',
      ],
      mooringTip:
        'Marina Frapa on the south side of the peninsula is the all-weather overnight — lazy lines, full services, fuel pontoon at the entrance. Village quay on the north side is exposed to NW gradient.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rogoznica.webp', alt: 'Rogoznica' }],
    },
    {
      id: 'rogoznica-zlarin-sibenik',
      routeFrom: 'Rogoznica',
      routeTo: 'Šibenik',
      day: 7,
      mapPin: { desktop: { left: 21.4, top: 14.2 }, mobile: { left: 10, top: 24.6 } },
      shortDescription:
        '15 nm northwest into ACI Marina Šibenik (or D-Marin Mandalina) for the Saturday handover by 09:00 — fuel topped, holding tanks emptied, decks rinsed, inventory checked. Course passes Zlarin (car-free island, optional coral-museum stop) and the 16th-century St. Nicholas fortress at the river mouth.',
      description:
        "The final leg is fifteen miles northwest from Rogoznica back into the Šibenik charter cluster. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked. The course passes Zlarin, a car-free island known for centuries of red-coral diving — the small coral museum in the village square is open afternoons and worth a 30-minute stop if time allows. Then up the Šibenik river estuary (passing the 16th-century St. Nicholas fortress at the river mouth) to ACI Marina Šibenik or D-Marin Mandalina. With fuel pumped and inspection clear, the marina is a 5-minute walk from St. James' Cathedral (UNESCO-listed).",
      thingsToDo: [
        'Stop at Zlarin for the coral museum and a final swim',
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
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Šibenik – Hvar – Vis – Solta Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Šibenik – Hvar – Vis – Solta Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(sibenikHvarVisSoltaRoute);
