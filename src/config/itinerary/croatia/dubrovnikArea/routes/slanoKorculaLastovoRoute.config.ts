import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const slanoKorculaLastovoRoute: ItineraryRoute = {
  metaTitle: '7-Day Slano–Korčula–Lastovo Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from Marina Frapa Slano via Lopud, Mljet (Saplunara, Pomena, Polače), Lastovo & Korčula — sailor brief with NM and mooring notes.',
  id: 'slano-korcula-lastovo-route',
  startingPoint: 'Slano',
  otherPoints: ['Lastovo', 'Korčula'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/slano-korcula-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/hvar-banner-large.webp',
      alt: 'Hvar',
    },
    {
      src: '/images/itinerary/croatia/banners/korcula-banner-large.webp',
      alt: 'Korcula',
    },
    {
      src: '/images/itinerary/croatia/banners/korcula-banner.webp',
      alt: 'Korucla',
    },
    {
      src: '/images/itinerary/croatia/banners/mljet-banner.webp',
      alt: 'Mljet',
    },
  ],
  routeDays: [
    {
      id: 'slano-lopud',
      routeFrom: 'Slano',
      routeTo: 'Lopud',
      day: 1,
      mapPin: {
        desktop: { left: 77.2, top: 76.7 },
        mobile: { left: 82.8, top: 65.5 },
      },
      shortDescription:
        '10 nm southwest from Marina Frapa Resort Slano into Lopud — car-free island in the Elaphiti chain, with the Šunj sandy beach a 30-minute walk across the island from the main harbour.',
      description:
        'Out of Marina Frapa Resort Slano, the opening leg is a 10-mile run southwest into Lopud, the second-largest of the three inhabited Elaphiti Islands. Lopud is car-free — the small village wraps the main bay on the northwest side, with stern-to mooring on the village quay accepting own anchor for a modest harbour fee. The headline draw is the Šunj sandy beach on the southeast side: one of the few natural sand beaches on the entire Croatian coast, reached by a 30-minute walk across the island from the village. Off the boat the ritual is the walk across to Šunj for an afternoon swim, the small Franciscan monastery (15th-century, fortified) on the village seafront, and the konoba dinner — grilled squid (lignje na žaru) and the local Pošip white from the Korčula vineyards across the channel are the standbys.',
      thingsToDo: [
        'Walk the 30-minute path across to Šunj sandy beach',
        'Visit the 15th-century Franciscan monastery on the seafront',
        'Order grilled squid (lignje na žaru) at a village konoba',
        'Pair with a glass of Pošip white from Korčula',
        'Climb the ruined fortress above the village for the panoramic view',
      ],
      mooringTip:
        'Stern-to on Lopud village quay with own anchor — modest harbour fee, water and power on the central berths. Bay is well-sheltered from S, SE and SW; exposed to N gradient (rare in summer). If N forecast above 18 kn, push 4 nm into Šipanska Luka on Šipan or back into Marina Frapa Resort Slano.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/lopud.webp',
          alt: 'Lopud',
        },
      ],
    },
    {
      id: 'lopud-saplunara-bay-mljet',
      routeFrom: 'Lopud',
      routeTo: 'Saplunara Bay (Mljet)',
      day: 2,
      mapPin: {
        desktop: { left: 68.8, top: 79.4 },
        mobile: { left: 67.9, top: 67.1 },
      },
      shortDescription:
        '14 nm west to Saplunara on Mljet’s southeast tip — outside the National Park boundary, no Park fees. Anchor in 4–6 m on a pale sand floor or take one of the seasonal restaurant buoys; bay sheltered N, NW and W, exposed only to S gradient.',
      description:
        'Fourteen miles west takes you to Saplunara, the small village on the southeast tip of Mljet. Saplunara sits outside the National Park boundary — no Park fees apply — and the headline draw is the long, shallow sandy beach at Saplunara Bay (one of only a handful of natural sand beaches on the entire Croatian coast). Drop the hook in 4–6 metres on the sand floor or pick up one of the seasonal restaurant buoys laid by two of the konobas on the beach. The bay is well-sheltered from N, NW and W; only S gradient pushes any swell into the inner section. Once secured, swim from the boat (the water is exceptional thanks to the sand floor and shallow depth) or walk the path inland to Blace Bay 20 minutes north on foot.',
      thingsToDo: [
        'Anchor on the sand floor and swim from the boat',
        'Walk to Blace Bay 20 minutes north (smaller, quieter sand beach)',
        'Order grilled orada at a Saplunara beach konoba',
        'Climb the path to the small white chapel above the village',
        'Stay on deck for the open-Adriatic stars after dark',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding (the standard choice). Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NW and W; exposed to S gradient. If S forecast above 18 kn, push 6 nm north into Okuklje (also outside the National Park, fully sheltered).',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/saplunara-mljet.webp',
          alt: 'Saplunara',
        },
      ],
    },
    {
      id: 'saplunara-pomena-mljet-national-park',
      routeFrom: 'Saplunara',
      routeTo: 'Pomena (Mljet National Park)',
      day: 3,
      mapPin: {
        desktop: { left: 65.5, top: 77.4 },
        mobile: { left: 65.9, top: 62.3 },
      },
      shortDescription:
        '15 nm west around Mljet to Pomena — small village at the western tip of the island and the eastern landing of Mljet National Park, with walking access to the saltwater lakes.',
      description:
        "Fifteen miles west around Mljet takes you to Pomena, the small village at the western tip of the island and the eastern landing of Mljet National Park. Pick up one of the green Park mooring buoys in Pomena Bay (overnight fee paid at the ranger kiosk, includes Park entry for the crew) or take a stern-to slot at the village pontoon. From Pomena, a 15-minute walk leads to Malo Jezero, the smaller of the two saltwater lakes inside the Park, and a short footpath connects to Veliko Jezero where the Park ferry runs out to the 12th-century Benedictine monastery on St. Mary's islet. Allow the afternoon for the lake circuit — the trail loops both lakes in about 9 km, swimming is permitted, the cicadas are deafening.",
      thingsToDo: [
        'Pick up a Park buoy in Pomena Bay and pay the ranger',
        'Walk 15 minutes inland to Malo Jezero saltwater lake',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Hike the 9 km lake-loop trail',
        'Order grilled fish and Pošip white at a Pomena konoba',
      ],
      mooringTip:
        'Pomena Bay uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is well-sheltered; only NW gradient above 18 kn pushes any noticeable swell into the entrance.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/pomena.webp',
          alt: 'Pomena',
        },
      ],
    },
    {
      id: 'pomena-lastovo-zaklopatica-bay',
      routeFrom: 'Pomena',
      routeTo: 'Lastovo (Zaklopatica Bay)',
      day: 4,
      mapPin: {
        desktop: { left: 51.2, top: 78 },
        mobile: { left: 46.4, top: 64.5 },
      },
      shortDescription:
        '20 nm southwest to Lastovo, the most isolated inhabited Adriatic island and a designated Nature Park. Zaklopatica is the natural overnight — five konobas hang free buoys.',
      description:
        "Twenty miles southwest takes you to Lastovo — a Nature Park, the lowest light pollution in Croatia, the quietest island in the central Adriatic in season. Zaklopatica is the natural overnight: a U-shaped bay carved into the north coast with a low islet across the entrance breaking any swell, and five family-run konobas that each maintain a string of free mooring buoys for guests who eat ashore. The mooring economics are simple — book a buoy and a dinner table at the same konoba. Lastovo's signature dishes are the local lobster (jastog) and šporki makaruli, a rustic beef-and-pasta stew. On a clear August evening the Milky Way is visible directly overhead before midnight.",
      thingsToDo: [
        "Pick up a konoba's free buoy in exchange for dinner",
        'Order Lastovo lobster (jastog) or šporki makaruli',
        'Walk the path inland to the Lastovo Town fumari (chimney stacks)',
        'Snorkel the islet at the bay entrance',
        'Stay on deck for the Milky Way after midnight',
      ],
      mooringTip:
        'Free konoba mooring buoys at Zaklopatica — confirm with the konoba on arrival, dinner reservation locks the buoy. Anchoring on bottom is discouraged due to seagrass. Bay is fully sheltered from N to W; if SE forecast above 15 kn, move 4 nm south through the channel to Skrivena Luka.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/zaklopatica.webp',
          alt: 'Zaklopatica',
        },
      ],
    },
    {
      id: 'zaklopatica-korcula-town',
      routeFrom: 'Zaklopatica',
      routeTo: 'Korčula Town',
      day: 5,
      mapPin: {
        desktop: { left: 57.8, top: 65.7 },
        mobile: { left: 53, top: 54.5 },
      },
      shortDescription:
        '14 nm northeast to Korčula Town — walled medieval port on the eastern tip of Korčula island, ACI Marina or stern-to on the town quay both viable.',
      description:
        'Fourteen miles northeast takes you to Korčula Town, the walled medieval port on the eastern tip of Korčula island. The skyline is unmistakable from offshore: a peninsula of red roofs, a single bell tower, the limestone curtain wall sliding down to the sea on three sides. ACI Marina Korčula sits on the eastern side of the peninsula and offers full services with lazy lines; alternatively the town quay on the western side accepts a few stern-to boats with own anchor for a harbour fee. The Old Town is small but the layout is famously the precursor to the radial grids the Venetians later used elsewhere. The Moreška sword-dance performance — a 16th-century theatrical sword combat between Christian and Moorish armies — runs Monday and Thursday evenings at 21:00 in season. Pair the dinner with a glass of Grk, the indigenous white grape grown on the sandy soils of Lumbarda just east of the town.',
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
      id: 'korcula-polace-mljet',
      routeFrom: 'Korčula',
      routeTo: 'Polače (Mljet)',
      day: 6,
      mapPin: {
        desktop: { left: 67.3, top: 74.8 },
        mobile: { left: 72, top: 63.4 },
      },
      shortDescription:
        '18 nm southeast back to Polače on Mljet’s north coast — the western landing of Mljet National Park, with Roman ruins on the waterfront and the most sheltered overnight bay on the south coast.',
      description:
        "Eighteen miles southeast takes you back to Polače, the long fjord-like inlet on Mljet's north coast that serves as the western landing of Mljet National Park. The bay is one of the best-sheltered overnight options on the entire south Croatian coast — fully protected from N, NE, E and SE — and the entrance is unobtrusive until you are inside it. Pick up one of the green Park mooring buoys (overnight fee paid at the ranger kiosk on the waterfront, includes Park entry for the crew) or take a stern-to slot at the small village pontoon. The remains of a 4th-century Roman complex sit metres from the waterfront. The afternoon move is to hike Montokuc Hill (253 m, the highest point on Mljet's western half, with a 360° view across the Park) or to take the Park ferry across to St. Mary's monastery on Veliko Jezero.",
      thingsToDo: [
        'Pick up a Park buoy and pay the ranger on arrival',
        'Walk through the 4th-century Roman complex on the waterfront',
        'Hike Montokuc Hill (253 m) for the 360° Park view',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Order black risotto at a village konoba',
      ],
      mooringTip:
        'Polače uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is one of the best-sheltered overnight options on the entire south coast: fully protected N, NE, E and SE.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/mljet.webp',
          alt: 'Mljet',
        },
      ],
    },
    {
      id: 'polace-slano',
      routeFrom: 'Polače',
      routeTo: 'Slano',
      day: 7,
      mapPin: {
        desktop: { left: 83.2, top: 77.1 },
        mobile: { left: 92.1, top: 68.4 },
      },
      shortDescription:
        '20 nm east-northeast back into Marina Frapa Resort Slano for the Saturday handover by 09:00. Final stop at one of the Elaphiti islands for a swim before pushing into Slano Bay.',
      description:
        'The final leg is twenty miles east-northeast from Polače back into Marina Frapa Resort Slano. Saturday handover protocol applies: the boat must be back at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. The course passes the Elaphiti chain on the way northeast — a final swim stop in Šipanska Luka, Lopud or one of the small bays on Koločep is the standard close to the week before pushing into Slano Bay and up to the marina pontoon. With fuel pumped and inspection clear, Dubrovnik airport is 45 minutes by car south. A long lunch at the marina hotel restaurant or in the small Slano village closes the week.',
      thingsToDo: [
        'Stop for a final swim in the Elaphiti islands',
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
        alt: 'Slano – Korčula – Lastovo Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Slano – Korčula – Lastovo Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(slanoKorculaLastovoRoute);
