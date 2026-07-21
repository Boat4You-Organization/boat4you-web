import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const skradinHvarRoute: ItineraryRoute = {
  metaTitle: '7-Day Skradin to Hvar Yacht Route via Krka and Šolta | Boat4You',
  metaDesc:
    '7-day yacht route from ACI Marina Skradin (Krka NP gateway) via Primošten, Šolta (Maslinica), Hvar Town, Milna (Brač) & Rogoznica — sailor brief with NM.',
  id: 'skradin-hvar-route',
  startingPoint: 'Skradin',
  otherPoints: ['Hvar'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/skradin-vis-hvar-card-image.webp',
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
      id: 'skradin-primosten',
      routeFrom: 'Skradin',
      routeTo: 'Primošten',
      day: 1,
      mapPin: { desktop: { left: 22.6, top: 23.2 }, mobile: { left: 22.6, top: 23.2 } },
      shortDescription:
        '20 nm down the Krka River and south along the open coast to Primošten — peninsula town with the 16th-century St. George church on the high point and the Bukovac dry-stone vineyards inland.',
      description:
        'Out of ACI Marina Skradin (set at the head of the freshwater section of the Krka River, gateway to Krka National Park), the opening leg is 20 miles: 12 miles back downriver through the brackish lower Krka, past Šibenik old town and through the St. Anthony channel narrows (49 m clearance under the Šibenik bridge), then 8 miles south along the open coast to Primošten. The peninsula is unmistakable from offshore: barely connected to the mainland by a sandy spit, the 16th-century church of St. George at the top, terracotta roofs running down to the water on every side. ACI Marina Kremik (two miles south of the centre) handles the overnight slots with lazy lines, full services, and a regular shuttle bus to Primošten itself. Behind the town are the Bukovac vineyards — dry-stone-walled terraces stepped up the hills to grow the indigenous Babić red.',
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
      id: 'primosten-solta-island',
      routeFrom: 'Primošten',
      routeTo: 'Šolta Island',
      day: 2,
      mapPin: { desktop: { left: 31.8, top: 36 }, mobile: { left: 31.8, top: 36 } },
      shortDescription:
        '20 nm southeast to Maslinica on Šolta’s western tip — the only proper natural harbour on Šolta, fully sheltered behind a chain of seven islets at the entrance.',
      description:
        'Twenty miles southeast takes you to Maslinica, the deep S-shaped natural harbour at the western tip of Šolta. The chain of seven small islets at the entrance kills any swell from the open Adriatic. Mooring is split between Martinis Marchi Marina on the south side (lazy lines, 18th-century baroque-castle hotel attached) and the village quay on the north side (stern-to with own anchor for a modest fee). Šolta is the closest island to Split (15 miles out) but the quietest in the central Dalmatian group — the konobas in the village square run on Šoltansko olive oil and the indigenous Dobričić red. Off the boat the move is to walk across to Polebrnjak islet at the western entrance, swim from the rocks, and watch the open-Adriatic sunset.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead. Village quay (north side) takes stern-to with own anchor. Bay is fully sheltered from S, SW, W and NW thanks to the islet chain at the entrance.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Šolta' }],
    },
    {
      id: 'solta-hvar-town-hvar-island',
      routeFrom: 'Šolta',
      routeTo: 'Hvar Town (Hvar Island)',
      day: 3,
      mapPin: { desktop: { left: 38, top: 49.9 }, mobile: { left: 38, top: 49.9 } },
      shortDescription:
        '15 nm southeast to Hvar Town — the loudest harbour on the Croatian coast in summer, with ACI Marina Hvar the only safe overnight option in any blow.',
      description:
        "Fifteen miles southeast takes you to Hvar Town, the loudest and most photographed harbour on the Croatian coast in summer. The skyline is unmistakable: the 16th-century Fortica fortress rising over the rooftops, the Arsenal's stone arches on the seafront, the Cathedral of St. Stephen marking the central square. ACI Marina Hvar sits on the western side of the bay and is the only practical overnight option for a 12-metre yacht in anything more than a flat calm — book ahead, lazy lines provided, water and power on every berth. Town quay accepts mooring for a stiff hourly fee but fills with tour boats and superyacht tenders by midday and has no protection from the afternoon Maestral funnel. Use the marina, walk in, climb the Fortica before the heat, then settle in for the konoba dinner in the back lanes off the central square.",
      thingsToDo: [
        'Climb the Fortica before midday for the Pakleni view',
        "Walk the Arsenal and St. Stephen's Cathedral on the main square",
        'Stand a round at one of the back-lane konobas',
        'Take the lavender shop tour off Trg Sv. Stjepana',
        'Watch the harbour traffic from the marina seawall after dark',
      ],
      mooringTip:
        'ACI Marina Hvar is mandatory in any wind — book ahead, lazy lines, water and power on every berth. Town quay accepts boats by the hour for a stiff fee but is exposed to W gusts and crowded with tenders; not viable overnight in season.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-milna-brac-island',
      routeFrom: 'Hvar',
      routeTo: 'Milna (Brač Island)',
      day: 4,
      mapPin: { desktop: { left: 38.5, top: 41.3 }, mobile: { left: 38.5, top: 41.3 } },
      shortDescription:
        '12 nm north across the Hvar Channel to Milna — the most sheltered harbour on Brač’s western coast and the lamb-peka village. Stern-to on the inner town quay with own anchor — modest harbour fee, water and power on the central stretch.',
      description:
        "Twelve miles north across the Hvar Channel takes you to Milna, the deep, narrow inlet on Brač's western coast. The bay has been a working harbour since the Venetian era and the entrance is unmistakable — the 17th-century parish church on the inner quay, stone houses stepping back from the water. Stern-to mooring with own anchor on the inner town quay for a modest harbour fee, water and power on the central section. Outer half of the bay is the anchorage — drop the hook in 6–10 metres on sand with a stern line to the rocks if afternoon Maestral builds. Brač is famous for the white limestone (the same stone used for Diocletian's Palace) and lamb under the peka. The afternoon walk is to the small church on the headland north of the bay, then back for the slow konoba dinner.",
      thingsToDo: [
        'Order lamb under the peka three hours before dinner',
        'Walk to the parish church on the inner quay',
        'Anchor with stern line to rocks in the outer bay',
        'Sample Brač olive oil at the village agricultural cooperative',
        'Dinghy 3 nm north to Bobovišća for a glassy sunset swim',
      ],
      mooringTip:
        'Stern-to on the inner town quay with own anchor — modest harbour fee, water and power on the central stretch. Open SW to W; if afternoon Maestral builds above 15 kn, the inner quay stays comfortable. Bobovišća (3 nm N) is the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/milna.webp', alt: 'Milna' }],
    },
    {
      id: 'milna-rogoznica',
      routeFrom: 'Milna',
      routeTo: 'Rogoznica',
      day: 5,
      mapPin: { desktop: { left: 23.5, top: 28.6 }, mobile: { left: 23.5, top: 28.6 } },
      shortDescription:
        '20 nm northwest to Rogoznica — peninsula town with the inland Dragon’s Eye salt lake and Marina Frapa, one of the largest marinas in central Dalmatia.',
      description:
        "Twenty miles northwest along the open coast takes you to Rogoznica. Rogoznica's geographic curiosity is the Dragon's Eye Lake (Zmajevo Oko) — a deep saltwater karst lake on the southern tip of the peninsula, connected to the sea through a hidden underwater channel that flushes the basin twice a day with the tide. The lake sits 6 metres below surrounding sea level at low tide. Marina Frapa sits on the south side of the peninsula and is one of the largest marinas in central Dalmatia by berth count, with lazy lines, full services, a hotel, several restaurants and a fuel pontoon at the entrance.",
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
      id: 'rogoznica-sibenik',
      routeFrom: 'Rogoznica',
      routeTo: 'Šibenik',
      day: 6,
      mapPin: { desktop: { left: 21.6, top: 16.9 }, mobile: { left: 21.6, top: 16.9 } },
      shortDescription:
        '12 nm north into the Šibenik river estuary, past the 16th-century St. Nicholas fortress at the river mouth, into ACI Marina Šibenik or D-Marin Mandalina.',
      description:
        "Twelve miles north takes you back into the Šibenik river estuary. The approach is one of the most distinctive on the Croatian coast: pass the 16th-century St. Nicholas fortress at the river mouth (a UNESCO-listed Venetian sea fortification, recently restored, walking-accessible from the Šibenik town side), then up through the St. Anthony channel narrows (the 600-metre rock-cut passage with 49 m clearance under the Šibenik bridge). ACI Marina Šibenik sits in the inner harbour, walking distance to St. James' Cathedral; D-Marin Mandalina is on the south side of the estuary with full services. Off the boat the move is to walk through the medieval Šibenik old town — St. James' Cathedral (UNESCO) is the headline stop, the medieval town walls and the climb up to St. Michael's Fortress give the panoramic view across the estuary.",
      thingsToDo: [
        "Walk through the medieval old town to St. James' Cathedral",
        "Climb up to St. Michael's Fortress for the panoramic view",
        'Visit the Mediterranean Garden in the medieval St. Lawrence cloister',
        'Eat at Pelegrini (Michelin-starred Dalmatian on the cathedral square)',
        'Swim from Banj Beach east of the old town',
      ],
      mooringTip:
        'ACI Marina Šibenik in the inner harbour or D-Marin Mandalina on the south side — both have lazy lines, full services. The river entrance is well-marked and deep enough for any charter draft.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sibenik.webp', alt: 'Šibenik' }],
    },
    {
      id: 'sibenik-skradin',
      routeFrom: 'Šibenik',
      routeTo: 'Skradin',
      day: 7,
      mapPin: { desktop: { left: 21.1, top: 12 }, mobile: { left: 21.1, top: 12 } },
      shortDescription:
        '8 nm upriver back into ACI Marina Skradin for the Saturday handover by 09:00, with optional Skradinski Buk waterfall stop via the Park shuttle boat.',
      description:
        'The final leg is an 8-mile upriver run from Šibenik back into ACI Marina Skradin. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked. The river run is one of the most unusual on the Croatian coast — through the deep, hill-walled freshwater section of the Krka River that ends at the marina. Allow 90 minutes from Šibenik river mouth to the marina at displacement speed. With time before handover, take the Park shuttle boat from the marina pontoon to Skradinski Buk waterfalls (15 minutes upstream, included in the Park entry ticket) for a final morning swim and walk on the boardwalks. Split airport is 1 hour by car south.',
      thingsToDo: [
        'Take the Park shuttle to Skradinski Buk waterfalls one last time',
        'Walk the boardwalk loop on both sides of the river',
        'Top up fuel and pump out before the 09:00 inspection',
        'Order Skradin risotto at a quayside konoba before the airport',
        'Walk the medieval town behind the marina',
      ],
      mooringTip:
        'Return into ACI Marina Skradin per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return. Fuel pontoon at the entrance.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
  ],
  map: {
    desktop: {
      image: { src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp', alt: 'Skradin - Hvar Route Image' },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: { src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp', alt: 'Skradin - Hvar Route Image' },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(skradinHvarRoute);
