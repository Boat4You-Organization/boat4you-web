import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const slanoHvarLastovoKorculaRoute: ItineraryRoute = {
  metaTitle: '7-Day Slano–Mljet–Lastovo–Korčula Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Marina Frapa Slano via Mljet, Lastovo, Vela Luka, the Pakleni Islands & Korčula — sailor brief with NM and mooring notes.',
  id: 'slano-hvar-lastovo-korcula-route',
  startingPoint: 'Slano',
  otherPoints: ['Mljet', 'Lastovo', 'Korčula', 'Hvar', 'Pelješac'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/slano-hvar-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/pakleni-islands-banner-large.webp',
      alt: 'Pakleni islands',
    },
    {
      src: '/images/itinerary/croatia/banners/hvar-banner-large.webp',
      alt: 'Hvar',
    },
    {
      src: '/images/itinerary/croatia/banners/lastovo-banner.webp',
      alt: 'Lastovo',
    },
    {
      src: '/images/itinerary/croatia/banners/peljesac-banner.webp',
      alt: 'Peljesac',
    },
  ],
  routeDays: [
    {
      id: 'slano-saplunara-mljet',
      routeFrom: 'Slano',
      routeTo: 'Saplunara (Mljet)',
      day: 1,
      mapPin: {
        desktop: { left: 75.9, top: 75.7 },
        mobile: { left: 76.6, top: 62.8 },
      },
      shortDescription:
        '14 nm southwest from Marina Frapa Resort Slano to Saplunara on Mljet’s southeast tip — outside the National Park boundary, no Park fees, one of the few sandy beaches on the Croatian coast.',
      description:
        "Out of Marina Frapa Resort Slano (set at the head of Slano Bay, 25 miles northwest of Dubrovnik), the opening leg is a 14-mile run southwest to Saplunara on Mljet's southeast tip. Slano is a smaller and quieter alternative to ACI Marina Dubrovnik for crews who want to skip the Dubrovnik tourist density on day one — the marina has lazy lines, full services, and a hotel-restaurant complex on the waterfront. Saplunara sits outside the National Park boundary, so no Park fees apply, and the headline draw is the long, shallow sandy beach at Saplunara Bay (one of only a handful of natural sand beaches on the entire Croatian coast). Drop the hook in 4–6 metres on the sand floor or pick up one of the seasonal restaurant buoys laid by two of the konobas on the beach. Once secured, swim from the boat (the water is exceptional thanks to the sand floor and shallow depth) or walk the path inland to Blace Bay 20 minutes north.",
      thingsToDo: [
        'Anchor on the sand floor and swim from the boat',
        'Walk to Blace Bay 20 minutes north (smaller, quieter beach)',
        'Order grilled orada at a Saplunara beach konoba',
        'Climb the path to the small white chapel above the village',
        'Stay on deck for the open-Adriatic stars after dark',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding (the standard choice). Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NW and W; exposed to S gradient. If S forecast above 18 kn, push 6 nm north into Okuklje (also outside the National Park, fully sheltered).',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/lopud.webp',
          alt: 'Lopud',
        },
      ],
    },
    {
      id: 'saplunara-skrivena-luka-lastovo',
      routeFrom: 'Saplunara',
      routeTo: 'Skrivena Luka (Lastovo)',
      day: 2,
      mapPin: {
        desktop: { left: 59, top: 63.4 },
        mobile: { left: 46.7, top: 64 },
      },
      shortDescription:
        '15 nm west to Skrivena Luka — the "Hidden Harbour" on Lastovo’s south coast, fjord-like bay walled by 200-metre hills, the most sheltered overnight on the entire south Adriatic.',
      description:
        "Fifteen miles west takes you to Skrivena Luka — the literal Croatian translation is 'Hidden Harbour' — a fjord-like bay carved into the south coast of Lastovo, walled by 200-metre hills on three sides and accessed through a narrow entrance that is invisible from offshore until you are inside it. Skrivena Luka (also called Portorus on older charts) is one of the most sheltered overnight bays on the entire south Adriatic coast: the bay is fully protected from every wind direction, the holding is excellent on a sand-and-mud bottom, and a single restaurant on the eastern shore lays free mooring buoys for guests who eat ashore. The afternoon move is to walk the path that climbs the eastern hill to the Struga Lighthouse — a 19th-century lighthouse on the southern cliff with the best view of the Italian coast on a clear evening — and back down for a swim in the inner bay. Lastovo is a designated Nature Park with the lowest light pollution in Croatia.",
      thingsToDo: [
        'Pick up a free restaurant buoy in exchange for dinner',
        'Walk the path up to the Struga Lighthouse',
        'Swim in the inner bay (water is exceptional)',
        'Order Lastovo lobster (jastog) at the konoba',
        'Stay on deck for the Milky Way after dark',
      ],
      mooringTip:
        'Free restaurant buoys at Skrivena Luka — dinner ashore secures the buoy, confirm with the konoba on arrival. Anchoring on bottom is also possible (sand and mud, excellent holding). Bay is fully sheltered from every wind direction — the all-weather alternative when Zaklopatica on the north coast turns rough.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/skrivena-luka.webp',
          alt: 'Skrivena Luka',
        },
      ],
    },
    {
      id: 'skrivena-luka-vela-luka-korcula',
      routeFrom: 'Skrivena Luka',
      routeTo: 'Vela Luka (Korčula)',
      day: 3,
      mapPin: {
        desktop: { left: 46.8, top: 63.1 },
        mobile: { left: 40.4, top: 57.2 },
      },
      shortDescription:
        '14 nm north to Vela Luka at the western end of Korčula — deep west-facing harbour with full town services, fuel pump, and excellent shelter. The natural Day 3 stop on the southern arc.',
      description:
        "Fourteen miles north takes you to Vela Luka, the deep west-facing harbour at the western end of Korčula. The bay is fully sheltered from N, NE and E; only S gradient above 18 kn pushes any swell into the inner harbour. Mooring is straightforward: stern-to with own anchor on the long town quay, modest fee, water and power on the central section, fuel pump at the western end. Vela Luka village wraps the inner half of the harbour, with three good konobas on the waterfront promenade — the headline dish is žrnovski makaruni, a hand-rolled pasta tradition that two of the village kitchens still maintain by hand. The afternoon move is a 30-minute walk inland to Vela Spila ('Big Cave'), a prehistoric site with 20,000 years of continuous occupation that has produced some of the most important Mesolithic finds in the eastern Adriatic.",
      thingsToDo: [
        'Visit the prehistoric Vela Spila above the town',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Walk the Vela Luka waterfront promenade at dusk',
        'Pump fuel at the western end of the town quay',
        'Take the dinghy out to Proizd islet for the natural rock pools',
      ],
      mooringTip:
        'Stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Holding is excellent in mud and sand. Bay is fully sheltered from N, NE and E; only S gradient above 18 kn pushes any swell into the inner harbour.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/vela-luka.webp',
          alt: 'Vela Luka',
        },
      ],
    },
    {
      id: 'vela-luka-palmizana-hvar',
      routeFrom: 'Vela Luka',
      routeTo: 'Palmižana (Hvar)',
      day: 4,
      mapPin: {
        desktop: { left: 43.6, top: 65.9 },
        mobile: { left: 28.4, top: 47 },
      },
      shortDescription:
        '30 nm east-northeast across the Korčula and Hvar Channels to Palmižana in the Pakleni Islands. The longest single passage of the week — start at first light to clear the channel before W Maestral fills in.',
      description:
        "Thirty miles east-northeast is the longest single passage of the week. Start at first light to clear the Korčula Channel before the prevailing W Maestral fills in around 14:00 — once it builds, the wind sits squarely on the beam for the remaining 18 miles into Hvar Channel. Palmižana sits on the eastern side of Sv. Klement, the largest of the Pakleni islets, and is the only one of the cluster with a marina: Palmižana ACI Marina, with stern-to lazy-line slots and limited summer capacity (book online for July–August or expect to anchor). The main bay holds in 5–10 metres on a sand-and-weed bottom but turns rolly when the Maestral funnel kicks in around 14:00, so the more comfortable overnight options are the south-side coves: Vinogradišće and Tarsce, both holding well in W gradient with line ashore the standard configuration. The afternoon ritual on Palmižana is the Meneghello family's 1906 botanical garden, dinner at one of the four konobas spread along the bay, and snorkelling over the submerged Roman amphorae off the western shore.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
        'Anchor with line ashore in Vinogradišće if the marina is full',
        'Take the water taxi across to Hvar Town for the evening',
        'Walk the path across Sv. Klement to Vlaka Bay',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, online booking essential for July–August. If full, anchor in Vinogradišće cove (south side, sand and weed, line ashore standard) — better protection from afternoon W. Avoid the main Palmižana bay overnight when SW gradient builds.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/palmizana.webp',
          alt: 'Palmizana',
        },
      ],
    },
    {
      id: 'palmizana-korcula-town',
      routeFrom: 'Palmižana',
      routeTo: 'Korčula Town',
      day: 5,
      mapPin: {
        desktop: { left: 49.9, top: 78 },
        mobile: { left: 51.7, top: 55 },
      },
      shortDescription:
        '22 nm southeast back across the Hvar Channel into Korčula Town — walled medieval port, ACI Marina or stern-to on the town quay both viable, Moreška sword-dance Mon and Thu evenings.',
      description:
        'Twenty-two miles southeast back across the Hvar Channel takes you to Korčula Town, the walled medieval port on the eastern tip of Korčula island. The skyline is unmistakable from offshore: a peninsula of red roofs, a single bell tower, the limestone curtain wall sliding down to the sea on three sides. ACI Marina Korčula sits on the eastern side of the peninsula and offers full services with lazy lines; alternatively the town quay on the western side accepts a few stern-to boats with own anchor for a harbour fee — closer to the gates but exposed to W Maestral and rolly when the channel funnel kicks in around 14:00. The Old Town fits in the palm of your hand, but the layout is famously the precursor to the radial grids the Venetians later used elsewhere. The Moreška sword-dance performance — a 16th-century theatrical sword combat — runs Monday and Thursday evenings at 21:00 in season. Pair the dinner with a glass of Grk, the indigenous white grape grown on the sandy soils of Lumbarda just east of the town.',
      thingsToDo: [
        'Watch the Moreška sword dance (Mon and Thu evenings in season)',
        'Walk the Old Town at dusk after the ferries leave',
        "Climb the bell tower of St. Mark's Cathedral",
        'Visit the (debated) Marco Polo House',
        'Pair dinner with a glass of indigenous Grk white from Lumbarda',
      ],
      mooringTip:
        'ACI Marina Korčula on the eastern side is the all-weather option — lazy lines, water, power, full services. Town quay on the western side accepts stern-to with own anchor but is exposed to W Maestral; rolly after 14:00. Lumbarda Bay 3 nm southeast is the sheltered alternative.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/korcula.webp',
          alt: 'Korčula',
        },
      ],
    },
    {
      id: 'korcula-kobas-peljesac',
      routeFrom: 'Korčula',
      routeTo: 'Kobaš (Pelješac)',
      day: 6,
      mapPin: {
        desktop: { left: 36.7, top: 51.3 },
        mobile: { left: 59.7, top: 55.4 },
      },
      shortDescription:
        '10 nm east into Kobaš Bay on the south coast of Pelješac peninsula — a pine-walled cove with a single waterside konoba, free guest buoys, and the closest approach to the Pelješac wine country.',
      description:
        "Ten miles east takes you to Kobaš Bay on the south coast of Pelješac peninsula — Croatia's longest peninsula and the heartland of the indigenous Plavac Mali red, the parent grape of Zinfandel. Kobaš itself is a small pine-walled cove with a single waterside konoba (Konoba Kobaš), which lays free mooring buoys for guests who eat ashore — pick up a buoy, dinner reservation locks it. The headline draw is the Pelješac wine country: the steep south-facing vineyards on the cliffs above Dingač and Postup villages produce the densest, most concentrated Plavac Mali wines in Croatia, with the Dingač appellation in particular requiring 100% old-vine south-slope fruit. A 30-minute taxi or village shuttle from Kobaš gets you to the cellars at Bartulović, Grgić or Saints Hills for tastings; book one or two ahead. The konoba's headline dishes are local oysters from Mali Ston (the next bay east, the most famous oyster region in Croatia) and beef pasticada slow-cooked overnight.",
      thingsToDo: [
        'Pick up a free buoy at Konoba Kobaš and book dinner ashore',
        'Taxi to the Dingač or Postup vineyards for tastings',
        'Order Mali Ston oysters and Pelješac Plavac Mali at the konoba',
        'Walk the path inland to the small chapel above the bay',
        'Swim from the boat in the pine-walled inner cove',
      ],
      mooringTip:
        'Free Konoba Kobaš buoys — dinner ashore secures the buoy, confirm on arrival. Anchoring on bottom possible (8–12 m, sand and weed) if buoys are full. Bay is sheltered from N, NE, W and NW; exposed to S gradient. If S forecast above 15 kn, push 6 nm east into Mali Ston Bay, fully sheltered.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/lopud.webp',
          alt: 'Lopud',
        },
      ],
    },
    {
      id: 'kobas-slano',
      routeFrom: 'Kobaš',
      routeTo: 'Slano',
      day: 7,
      mapPin: {
        desktop: { left: 81.2, top: 75 },
        mobile: { left: 83.4, top: 64.4 },
      },
      shortDescription:
        '12 nm southeast back into Marina Frapa Resort Slano for the Saturday handover by 09:00. Final swim at one of the small bays on the south coast of Pelješac on the way.',
      description:
        'The final leg is twelve miles southeast from Kobaš back into Marina Frapa Resort Slano. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. The course passes the southeast coast of Pelješac and a string of small swimming bays — a final swim stop in any of them is the standard close to the week before pushing into Slano Bay and up to the marina pontoon. Marina Frapa Resort Slano sits at the head of a long, deep, fully-sheltered bay (one of the best naturally protected anchorages in the south Adriatic) — the marina has lazy lines, water and power, fuel pontoon at the entrance, hotel and restaurants on the marina grounds. With fuel pumped and inspection clear, Dubrovnik airport is 45 minutes by car south. A long lunch at the marina hotel restaurant or in the small Slano village closes the week.',
      thingsToDo: [
        'Stop for a final swim on the south coast of Pelješac',
        'Top up fuel and pump out before the 09:00 inspection',
        'Take a final dip from the marina pontoon',
        'Stand a long lunch at the marina hotel restaurant',
        'Walk to the small village of Slano for the local konoba scene',
      ],
      mooringTip:
        'Return into Marina Frapa Resort Slano per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return. Fuel pontoon is on the western entrance side of the marina.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/slano.webp',
          alt: 'Slano',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Slano – Hvar – Lastovo – Korčula – Slano Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Slano – Hvar – Lastovo – Korčula – Slano Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(slanoHvarLastovoKorculaRoute);
