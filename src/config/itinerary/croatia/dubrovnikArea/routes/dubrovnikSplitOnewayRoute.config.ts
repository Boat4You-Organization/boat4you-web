import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const dubrovnikSplitOnewayRoute: ItineraryRoute = {
  metaTitle: '7-Day Dubrovnik to Split One-Way Yacht Route | Boat4You',
  metaDesc:
    '7-day one-way yacht route from Dubrovnik via the Elaphiti Islands, Mljet, Korčula, Lastovo, Vis & Hvar into Split — sailor brief with NM and mooring notes.',
  id: 'dubrovnik-split-oneway-route',
  startingPoint: 'Dubrovnik',
  otherPoints: ['Split', 'One way'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/dubrovnik-split-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/hvar-banner-large.webp',
      alt: 'Hvar',
    },
    {
      src: '/images/itinerary/croatia/banners/golden-horn-brac-banner-large.webp',
      alt: 'Golden horn, Brac',
    },
    {
      src: '/images/itinerary/croatia/banners/korcula-banner.webp',
      alt: 'Koručula',
    },
    {
      src: '/images/itinerary/croatia/banners/stiniva-bay-banner.webp',
      alt: 'Stiniva Bay',
    },
  ],
  routeDays: [
    {
      id: 'dubrovnik-sipan-lopud',
      routeFrom: 'Dubrovnik',
      routeTo: 'Šipan – Lopud',
      day: 1,
      mapPin: {
        desktop: { left: 91.2, top: 86.5 },
        mobile: { left: 91.4, top: 70.2 },
      },
      shortDescription:
        '8 nm northwest from ACI Marina Dubrovnik (Komolac) into the Elaphiti chain — Šipan and Lopud are the two largest of the small islands sitting just off Dubrovnik’s coast and the natural soft kickoff before pushing west.',
      description:
        'Out of ACI Marina Dubrovnik in Komolac, the opening leg is a short eight miles down the Rijeka Dubrovačka, past the Old Port (a daytime tender stop, never an overnight) and northwest along the coast into the Elaphiti Islands — a small chain of three inhabited islets (Koločep, Lopud, Šipan) plus a handful of uninhabited ones, sitting just off Dubrovnik. Šipan is the largest and the most agriculturally active of the three: olive groves, citrus, a few small konobas in the village of Suđurađ on the southeast coast, and a long, deep bay on the northern side at Šipanska Luka that takes most of the charter overnight traffic. Lopud is car-free and quieter, with the headline beach (Šunj on the southeast side, sandy, shallow, rare on this coast) reached by a 30-minute walk across the island from the main harbour. Either island works as the overnight; Šipan is the bigger town, Lopud the calmer beach.',
      thingsToDo: [
        'Walk the path across Lopud to Šunj sandy beach',
        'Order black risotto at a Šipanska Luka konoba',
        'Visit the Skočibuha summer palace at Suđurađ on Šipan',
        'Swim at the Franciscan monastery beach on Lopud',
        'Sample Elaphiti olive oil at a Šipan farm',
      ],
      mooringTip:
        'Šipanska Luka on Šipan: stern-to with own anchor on the long town quay, modest fee, water and power. Lopud: stern-to on the village quay with own anchor, similar setup. Both bays are sheltered from S, SE and SW; exposed to N gradient (rare in summer). If N forecast above 18 kn, push back into ACI Marina Dubrovnik for the night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lopud.webp', alt: 'Lopud' }],
    },
    {
      id: 'sipan-kobas-bay-pomena-mljet',
      routeFrom: 'Šipan',
      routeTo: 'Kobaš Bay – Pomena (Mljet)',
      day: 2,
      mapPin: {
        desktop: { left: 82.9, top: 81.4 },
        mobile: { left: 76.6, top: 63.8 },
      },
      shortDescription:
        '15 nm west to Pomena on the western tip of Mljet, with a lunchtime swim at Kobaš Bay on the south coast of Pelješac on the way. Pomena is the eastern landing of Mljet National Park.',
      description:
        "Fifteen miles west takes you to Pomena, the small village at the western tip of Mljet and the eastern landing of Mljet National Park. The natural lunchtime stop is Kobaš Bay on the south coast of Pelješac peninsula — a pine-walled cove with a single waterside konoba (Konoba Kobaš, dinner-only with mooring buoys for guests, but daytime swim anchoring is fine on the sand floor at 6–8 m). Push on to Pomena in the afternoon: pick up one of the Park mooring buoys in Pomena Bay (overnight fee paid at the ranger kiosk, includes Park entry for the crew) or take a stern-to slot at the village pontoon. From Pomena, a 15-minute walk leads to Malo Jezero, the smaller of the two saltwater lakes inside the Park, and a short footpath connects to Veliko Jezero where a Park ferry runs out to the 12th-century Benedictine monastery on St. Mary's islet. Allow the afternoon for the lake circuit — the trail loops both lakes, swimming is allowed.",
      thingsToDo: [
        'Lunch swim at Kobaš Bay on the Pelješac south coast',
        'Pick up a Park buoy in Pomena Bay and pay the ranger',
        'Walk 15 minutes inland to Malo Jezero saltwater lake',
        "Take the Park ferry to St. Mary's monastery on Veliko Jezero",
        'Hike the 9 km lake-loop trail through the National Park',
      ],
      mooringTip:
        'Pomena Bay uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is well-sheltered; only NW gradient above 18 kn pushes any noticeable swell into the entrance. Village pontoon also takes a few stern-to boats with own anchor as the alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/pomena.webp', alt: 'Pomena' }],
    },
    {
      id: 'pomena-mljet-korcula',
      routeFrom: 'Pomena (Mljet)',
      routeTo: 'Korčula',
      day: 3,
      mapPin: {
        desktop: { left: 66.8, top: 76.5 },
        mobile: { left: 65.5, top: 63.6 },
      },
      shortDescription:
        '14 nm west across the Pelješac Channel to Korčula Town — walled medieval port on the eastern tip of Korčula island, with ACI Marina or stern-to on the town quay both viable.',
      description:
        'Fourteen miles west across the Pelješac Channel takes you to Korčula Town, the walled medieval port on the eastern tip of Korčula island. The skyline is unmistakable from offshore: a peninsula of red roofs, a single bell tower, the limestone curtain wall sliding down to the sea on three sides. ACI Marina Korčula sits on the eastern side of the peninsula and offers full services with lazy lines; alternatively the town quay on the western side accepts a few stern-to boats with own anchor for a harbour fee — closer to the gates but exposed to W Maestral and rolly when the channel funnel kicks in around 14:00. The Old Town is genuinely small — a ten-minute walk gets you across it — but the layout is famously the precursor to the radial grids the Venetians later used elsewhere. Headline stops: the Cathedral of St. Mark (climb the bell tower for the channel view), the (debated) Marco Polo House, the Land Gate with its surviving Venetian relief. The Moreška sword-dance performance runs Mondays and Thursdays in season at 21:00.',
      thingsToDo: [
        'Walk the Old Town at dusk after the ferries leave',
        "Climb the bell tower of St. Mark's Cathedral",
        'Visit the (debated) Marco Polo House',
        'Order fish brodet at a courtyard konoba in the back lanes',
        'Watch a Moreška sword dance performance (Mon and Thu in season)',
      ],
      mooringTip:
        'ACI Marina Korčula on the eastern side is the all-weather option — lazy lines, water, power, full services. Town quay on the western side accepts stern-to with own anchor but is exposed to W Maestral; rolly after 14:00 in summer. If the channel turns rough, the sheltered alternative is Lumbarda Bay 3 nm southeast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mljet.webp', alt: 'Korčula' }],
    },
    {
      id: 'korcula-zaklopatica-lastovo',
      routeFrom: 'Korčula',
      routeTo: 'Zaklopatica (Lastovo)',
      day: 4,
      mapPin: {
        desktop: { left: 51.3, top: 67.2 },
        mobile: { left: 43.4, top: 56.9 },
      },
      shortDescription:
        '14 nm south to Lastovo, the most isolated inhabited Adriatic island and a designated Nature Park. Zaklopatica is the natural overnight — five konobas hang free buoys, the lowest light pollution in Croatia.',
      description:
        "Fourteen miles south takes you to Lastovo — a Nature Park, the lowest light pollution in Croatia, the quietest island in the central Adriatic in season. Zaklopatica is the natural overnight: a U-shaped bay carved into the north coast with a low islet across the entrance breaking any swell, and five family-run konobas that each maintain a string of free mooring buoys for guests who eat ashore. The mooring economics are simple — book a buoy and a dinner table at the same konoba. Anchoring on bottom is discouraged because of the seagrass meadow, but the buoy field has plenty of capacity outside July peak. Lastovo's signature dishes are the local lobster (jastog) and šporki makaruli, a rustic beef-and-pasta stew. Off the water there is little to do, which is the entire point: on a clear August evening the Milky Way is visible directly overhead before midnight.",
      thingsToDo: [
        "Pick up a konoba's free buoy in exchange for dinner",
        'Order Lastovo lobster (jastog) or šporki makaruli',
        'Walk the path inland to the Lastovo Town fumari (chimney stacks)',
        'Snorkel the islet at the bay entrance',
        'Stay on deck for the Milky Way after midnight',
      ],
      mooringTip:
        'Free konoba mooring buoys at Zaklopatica — confirm with the konoba on arrival, dinner reservation locks the buoy. Anchoring on bottom is discouraged due to seagrass. Bay is fully sheltered from N to W; if SE forecast above 15 kn, move 4 nm south through the channel to Skrivena Luka (also called Portorus), the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zaklopatica.webp', alt: 'Zaklopatica' }],
    },
    {
      id: 'zaklopatica-lastovo-komiza-vis',
      routeFrom: 'Zaklopatica (Lastovo)',
      routeTo: 'Komiža (Vis)',
      day: 5,
      mapPin: {
        desktop: { left: 48.8, top: 79.4 },
        mobile: { left: 44.3, top: 66 },
      },
      shortDescription:
        '22 nm northwest to Komiža on Vis — most westerly inhabited Croatian island, until 1989 a closed military zone, and the most authentic working fishing port in central Dalmatia.',
      description:
        "Twenty-two miles northwest takes you to Vis, the most westerly inhabited Croatian island and a place that still feels like the Adriatic of three decades ago — the 1989 lifting of its closed-zone military status is still visible in the relative absence of resort development. Komiža sits on the western side, a working fishing port wrapped around a small bay; the harbour is split between the inner basin (stern-to with own anchor, sand-and-weed bottom, mostly good holding) and the outer wall (open to SW swell, unsuitable overnight). The town itself is small enough to walk in fifteen minutes — the working fishing fleet on the eastern side of the harbour, the Fishermen's Museum in the old Venetian tower (open afternoons), and the konoba scene built around grilled bogueroni and the indigenous Vugava white. Vis is also where the British SOE and Tito's Partisans coordinated WWII operations — Tito's Cave on Mount Hum is open as a site, and the hike up gets you the best 360° view in central Dalmatia.",
      thingsToDo: [
        'Walk the working fishing fleet at golden hour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Hike up Mount Hum (587 m) to Tito's WWII cave",
        "Visit the Fishermen's Museum in the Venetian tower",
        'Watch the open-Adriatic sunset from the harbour wall',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay — sand and weed, mostly good holding, harbour fee. Outer wall is exposed to SW swell and not safe overnight. If SW gradient is forecast above 15 kn, push 6 nm north to Vis Town in St. George Bay, which is fully sheltered.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-vis-hvar-palmizana',
      routeFrom: 'Komiža (Vis)',
      routeTo: 'Hvar (Palmižana)',
      day: 6,
      mapPin: {
        desktop: { left: 29.7, top: 61.2 },
        mobile: { left: 19.4, top: 52.3 },
      },
      shortDescription:
        '20 nm east-northeast across the Hvar Channel into Palmižana on Sv. Klement — the only inhabited islet in the Pakleni cluster and the only one with a marina, with three south-side coves as anchorage backups.',
      description:
        "Twenty miles east-northeast from Komiža takes you across the Hvar Channel into Palmižana on Sv. Klement, the largest of the Pakleni Islands. Palmižana ACI Marina sits on the eastern side of the islet with stern-to lazy-line slots and limited summer capacity (book online for July–August or expect to anchor). The main bay holds in 5–10 metres on a sand-and-weed bottom but turns rolly when the Maestral funnel kicks in around 14:00, so the more comfortable overnight options are the south-side coves: Vinogradišće and Tarsce, both holding well in W gradient with line ashore the standard configuration. The afternoon ritual on Palmižana is the Meneghello family's 1906 botanical garden, dinner at one of the four konobas spread along the bay, and snorkelling over the submerged Roman amphorae off the western shore. Hvar Town is a short water-taxi hop east if the crew wants the nightlife, but the Palmižana side is the calmer overnight.",
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
      id: 'hvar-palmizana-split',
      routeFrom: 'Hvar (Palmižana)',
      routeTo: 'Split (Trogir, Kaštela)',
      day: 7,
      mapPin: {
        desktop: { left: 38.1, top: 53.1 },
        mobile: { left: 35.5, top: 45.7 },
      },
      shortDescription:
        '22 nm northeast to the Split-area charter cluster for the Saturday handover by 09:00 — drop off at ACI Marina Split, Marina Kaštela or ACI Trogir per the charter contract.',
      description:
        "The final leg is twenty-two miles northeast from Palmižana into the Split-area charter cluster. Saturday handover protocol applies: the boat must be at base by 09:00 with fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00. One-way charter contracts specify which of the three Split-area bases is the drop-off point — ACI Marina Split (most central, walking distance to Diocletian's Palace), Marina Kaštela (largest, 15 minutes drive west of Split) or ACI Trogir (smallest, immediately east of the UNESCO old town, closest to the airport). The route into all three is straightforward in any visibility. With fuel pumped and inspection clear, the Split airport is 10–15 minutes by car from Trogir or Kaštela bases, 25 minutes from ACI Marina Split. A long lunch on the Split Riva or in Trogir's old town closes the week — the one-way Dubrovnik-to-Split direction is one of the most ambitious 7-day routes available on the entire Croatian coast.",
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        "Walk Diocletian's Palace one final time before the airport",
        'Walk Trogir UNESCO old town if dropping at Trogir',
        'Take a final swim at Bačvice Beach east of Split Old Town',
        'Stand a long lunch on the Riva before the transfer',
      ],
      mooringTip:
        'Drop off at the base specified on your one-way charter contract — ACI Marina Split, Marina Kaštela or ACI Trogir. All three accept stern-to or alongside per the base manager’s direction. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/trogir.webp', alt: 'Trogir' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Dubrovnik – Split One-Way Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Dubrovnik – Split One-Way Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(dubrovnikSplitOnewayRoute);
