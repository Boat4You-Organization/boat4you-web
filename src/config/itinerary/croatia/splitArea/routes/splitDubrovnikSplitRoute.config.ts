import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const splitDubrovnikSplitRoute: ItineraryRoute = {
  metaTitle: '14-Day Split to Dubrovnik Round-Trip Yacht Route | Boat4You',
  metaDesc:
    '14-day yacht route from Split south to Dubrovnik via Hvar, Vis, Lastovo & Mljet — return via Korčula & Šolta. Sailor brief with NM and mooring notes.',
  id: 'split-dubrovnik-split-14day-route',
  startingPoint: 'Split',
  otherPoints: ['Dubrovnik'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/split-dubrovnik-card-image.webp',
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
      src: '/images/itinerary/croatia/banners/dubrovnik-banner.webp',
      alt: 'Dubrovnik',
    },
    {
      src: '/images/itinerary/croatia/banners/stiniva-bay-banner.webp',
      alt: 'Stiniva bay',
    },
  ],
  routeDays: [
    {
      id: 'split-milna-brac',
      routeFrom: 'Split',
      routeTo: 'Milna (Brač)',
      day: 1,
      mapPin: {
        desktop: { left: 38, top: 40.3 },
        mobile: { left: 35.8, top: 38 },
      },
      shortDescription:
        "Easy 15 nm kickoff southwest from Split into Brač's most sheltered west-coast inlet. Settle the boat, take the first swim in the outer anchorage, then walk the 17th-century parish quay before booking lamb under the peka.",
      description:
        "From the Boat4You Split base the opening leg is forgiving: 15 nautical miles southwest across the open Brački Kanal, plenty of time to settle into the boat, set up the running rigging and shake out the headsail before the route turns serious. Milna sits at the head of a long inlet on Brač's western coast — entrance unmistakable thanks to the 17th-century parish church on the inner quay and stone houses stepping back from the water. The bay has been a working harbour since the Venetian era and still pulls a mix of charter fleets and the local fishing boats. There is no urgency. Drop the hook in the outer anchorage, swim once, then step ashore. Lamb under the peka cooks for three hours, so order it the moment you tie up — that is the whole rhythm of an evening here.",
      thingsToDo: [
        'Order lamb under the peka three hours before dinner',
        'Walk the 17th-century parish church on the inner quay',
        'Anchor and swim in the outer bay before mooring up',
        "Sample Brač's olive oil at a village shop",
        'Take the dinghy across to Osibova Bay for sunset',
      ],
      mooringTip:
        'Stern-to on the town quay with your own anchor — modest harbour fee, water and power available on the inner stretch. Bay is open SW to W so afternoon Maestral can roll in; if the quay is full or the forecast turns, slip 3 nm north into Bobovišća, which stays glassy in westerlies.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/milna.webp', alt: 'Milna' }],
    },
    {
      id: 'milna-palmizana-hvar',
      routeFrom: 'Milna',
      routeTo: 'Palmižana (Hvar)',
      day: 2,
      mapPin: {
        desktop: { left: 36.2, top: 51.4 },
        mobile: { left: 27, top: 46.7 },
      },
      shortDescription:
        '15 nm southeast crossing the Hvar Channel into the Pakleni archipelago. Palmižana is the busy heart of the cluster — moor stern-to on the marina pontoon or anchor in any of the three sheltered coves on the lee side.',
      description:
        "Cast off after coffee for the 15-mile run across the Hvar Channel into the Pakleni Islands, the long string of pine-covered islets guarding the southern approach to Hvar Town. Palmižana is the largest and the only one with a small marina, set on the eastern side of the cluster. The main bay holds in 5–10 metres of sand and weed, but the wind funnel between St. Klement and Hvar can turn the anchorage rolly when the Maestral fills in around 14:00 — most skippers either take a stern-to slot at the Palmižana ACI Marina pontoon or duck into one of the smaller coves on the south side (Vinogradišće and Tarsce hold better in W). Once secured, the day is built around the Meneghello family's botanical garden, the 1906 estate that put the island on the map, plus a long lunch at one of the four restaurants spread along the bay. Snorkelling over the submerged Roman amphorae off the western shore is the late-afternoon ritual.",
      thingsToDo: [
        'Snorkel over the Roman amphora field on the western shore',
        "Walk Meneghello's 1906 botanical garden",
        'Hop the dinghy to Marinkovac for a quieter beach',
        'Sample a chilled Plavac Mali at a quay-side bar',
        'Catch the water taxi across to Hvar Town for the evening',
      ],
      mooringTip:
        'ACI Marina Palmižana stern-to with lazy lines, must be booked online for July–August. If full, anchor in Vinogradišće cove (south side, sand/weed, line ashore standard) — better protection from afternoon W. Avoid the main Palmižana bay overnight when SW gradient builds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/palmizana.webp', alt: 'Palmizana' }],
    },
    {
      id: 'palmizana-hvar-town',
      routeFrom: 'Palmižana',
      routeTo: 'Hvar Town',
      day: 3,
      mapPin: {
        desktop: { left: 42, top: 48.8 },
        mobile: { left: 33.7, top: 46.4 },
      },
      shortDescription:
        "5 nm hop across to Hvar Town, the Adriatic's loudest harbour in summer. ACI Marina is the only safe overnight in any blow — the town quay is a daytime visit and a Mediterranean-moor scrum after 18:00.",
      description:
        "The shortest leg of the week — five nautical miles back across the channel into Hvar Town's harbour. The skyline is unmistakable: the 16th-century Fortica fortress rising over the rooftops, the Arsenal's stone arches on the seafront, the Cathedral of St. Stephen marking the central square. ACI Marina Hvar sits on the western side of the bay and is the only practical overnight option for a 12-metre yacht in anything more than a flat calm. The town quay (riva) accepts mooring against a fee but it fills with tour boats, taxi rides and superyacht tenders by midday, plus there is no protection from the afternoon Maestral funnel. Use the marina, then walk in. Climb the Fortica before the heat — early afternoon cuts the queue and the view across the Pakleni stretches all the way to Vis on a clear day. The evening picks itself: konobas in the back lanes off the square, then the harbour wall after dark.",
      thingsToDo: [
        'Climb the Fortica before midday for the Pakleni view',
        "Walk the Arsenal and St. Stephen's Cathedral on the main square",
        'Stand a round at one of the back-lane konobas',
        'Take the lavender shop tour off Trg Sv. Stjepana',
        'Watch the harbour traffic from the marina seawall after dark',
      ],
      mooringTip:
        'ACI Marina Hvar is mandatory in any wind — book ahead, lazy lines provided, water and power on every berth. Town quay accepts boats by the hour for a stiff fee but is exposed to W gusts and crowded with tenders; it is not a viable overnight option in season.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-komiza-vis',
      routeFrom: 'Hvar',
      routeTo: 'Komiža (Vis)',
      day: 4,
      mapPin: {
        desktop: { left: 27.1, top: 59 },
        mobile: { left: 19.9, top: 52.6 },
      },
      shortDescription:
        '25 nm west to Vis with a Stiniva Cove stop on the southern coast. Komiža sits on the western side of the island — a working fishing harbour with the best sunsets in central Dalmatia and a town quay that swallows the fleet by late afternoon.',
      description:
        "Sail west off Hvar mid-morning, leaving the Pakleni in your wake for the 25-mile crossing to Vis — the most westerly inhabited Croatian island and, until 1989, a closed Yugoslav military zone. The southern coastline of Vis is stitched with coves; the headline stop is Stiniva, a near-circular cove walled by 100-metre cliffs with an entrance only a metre wide visible from outside. Drop the hook in 8–10 metres on a sand patch (do not anchor on the seagrass) and swim. The cove fills with day-tripper RIBs from 11:00, so an early arrival or a late stop after they clear is the move. Continue four miles west to Komiža, the island's old fishing port. The town quay accepts stern-to with own anchor on the inner basin; outer wall is open to SW swell. Ashore, the working fishing fleet is still there, the konoba scene runs to grilled bogueroni and the Vis-grown Vugava white, and the sunset over the Adriatic horizon is the best in central Dalmatia by a clear margin.",
      thingsToDo: [
        'Anchor in Stiniva Cove before the day-trip RIBs arrive',
        'Walk the working fishing harbour at golden hour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        'Hike up to Mount Hum for a 360° island view',
        'Visit the WWII tunnels at Tito’s Cave above the town',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay — sand and weed, mostly good holding, harbour fee. Outer wall is exposed to SW swell and unsuitable overnight. If SW or W gradient is forecast above 15 kn, push north 6 nm to Vis Town in St. George Bay, which is fully sheltered.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-blue-cave-bisevo-green-cave-ravnik-vela-luka-korcula',
      routeFrom: 'Komiža',
      routeTo: 'Blue Cave (Biševo) → Green Cave (Ravnik) → Vela Luka (Korčula)',
      day: 5,
      mapPin: {
        desktop: { left: 46.1, top: 65.9 },
        mobile: { left: 43, top: 56.9 },
      },
      shortDescription:
        'Two-cave morning then a 20 nm leg east to Vela Luka on the western tip of Korčula. Blue Cave only works between 09:00 and 12:00 with the right light angle; Vela Luka is one of the best-sheltered overnight bays in the area.',
      description:
        "An early start — the Blue Cave on Biševo only lights up between roughly 09:00 and 12:00, when the sun angle pushes through the underwater opening and turns the interior an unreal ultramarine. Tie alongside the small concession quay outside the cave (no overnight, lunchtime fee) and wait in line for one of the official tenders that ferry visitors inside; the cave is closed to private dinghies. Forty minutes later you are back on board for the short hop east to Ravnik islet and its Green Cave (Zelena špilja), where the morning light filters down through a roof opening and turns the floor of the cavern emerald — this one is open to private dinghy entry, easier and quieter than Biševo. By early afternoon it is time to push 18 nm southeast to Korčula's Vela Luka, the deep west-facing harbour at the end of the island. Excellent shelter from N to E; full town services. Lunch on board, ashore for an evening at the quayside konobas — žrnovski makaruni, hand-rolled by a generation that still does it the right way, is the headline dish.",
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 11:00',
        'Dinghy into the Green Cave at Ravnik',
        'Sail past the south face of Vis on the leg east',
        'Order žrnovski makaruni at a Vela Luka konoba',
        'Walk the Vela Luka waterfront promenade at dusk',
      ],
      mooringTip:
        'Vela Luka offers stern-to with own anchor on the long town quay — modest fee, water and power, fuel pump at the western end. Holding is excellent in mud and sand. Bay is fully sheltered from N, NE and E; only S gradient above 18 kn pushes any swell into the inner harbour and even then the inner pontoon stays comfortable.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vela-luka.webp', alt: 'Vela Luka' }],
    },
    {
      id: 'vela-luka-lastovo-zaklopatica',
      routeFrom: 'Vela Luka',
      routeTo: 'Lastovo (Zaklopatica)',
      day: 6,
      mapPin: {
        desktop: { left: 51.1, top: 77.2 },
        mobile: { left: 46.1, top: 65.4 },
      },
      shortDescription:
        '14 nm south to Lastovo, the most isolated inhabited island in the Adriatic. Zaklopatica is the natural overnight — a tight U-shaped bay with five konobas hanging mooring buoys and the cleanest water on the route.',
      description:
        "From Vela Luka the course bends south for the 14-mile run across to Lastovo — a Nature Park, the lowest light pollution in Croatia, and as quiet as the central Adriatic gets in season. Zaklopatica is the obvious overnight: a U-shaped bay carved into the north coast, a low islet across the entrance breaking any swell, and five family-run konobas that each maintain a string of free mooring buoys for guests who eat ashore. Pick up a buoy, dinghy in, walk the perimeter, choose a konoba and order — the local lobster (jastog) and šporki makaruli (a 'dirty' beef-and-pasta stew) are what the island runs on. Off the water there is little to do except snorkel and read; with no light pollution the night sky is the entertainment, and on a clear August evening the Milky Way is overhead before the konoba clears its tables. If Zaklopatica is full or the wind picks up SE, Skrivena Luka on the south coast is the all-weather alternative.",
      thingsToDo: [
        "Pick up a konoba's free buoy in exchange for dinner",
        'Order Lastovo lobster or šporki makaruli',
        'Dinghy across to the islet at the bay entrance',
        'Walk the path to the Lastovo Town fumari (chimney stacks)',
        'Stay on deck for the Milky Way after midnight',
      ],
      mooringTip:
        'Free konoba mooring buoys at Zaklopatica — confirm with the konoba on arrival, dinner reservation locks the buoy. Anchoring on bottom is discouraged due to seagrass. Bay is fully sheltered from N to W; if SE forecast above 15 kn, move 4 nm south through the channel to Skrivena Luka (also called Portorus), the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zaklopatica.webp', alt: 'Zaklopatica' }],
    },
    {
      id: 'lastovo-mljet-polace',
      routeFrom: 'Lastovo',
      routeTo: 'Mljet (Polače)',
      day: 7,
      mapPin: {
        desktop: { left: 69.6, top: 78.3 },
        mobile: { left: 66.1, top: 64.3 },
      },
      shortDescription:
        '22 nm east-northeast to Mljet — the Roman Polače complex sits at the head of a deep, hill-rimmed bay inside the National Park. Pick up a Park buoy, then walk to Veliko Jezero and the islet monastery.',
      description:
        "The leg from Lastovo to Mljet is 22 nautical miles north-east, and the second half delivers the most dramatic landfall on the route: the long Polače inlet on Mljet's north coast, walled by pine-covered hills, the entrance unobtrusive until you are inside it. Polače itself is the landing for the western half of Mljet National Park. The remains of a 4th-century Roman complex sit metres from the waterfront — the basilica walls and the corner tower are the obvious survivors and they can be walked through with no fee. The bay is managed by the National Park: pick up one of the green Park buoys (overnight fee paid at the ranger kiosk on the waterfront, includes Park entry for the crew), or take a stern-to slot at the small village pontoon. From Polače a 30-minute walk leads to Veliko Jezero, the larger of Mljet's two saltwater lakes, where a small Park ferry runs out to the 12th-century Benedictine monastery on St. Mary's islet. Allow the whole afternoon for the lakes circuit — the trail loops both lakes, swimming is permitted, the cicadas are deafening.",
      thingsToDo: [
        'Pick up a Park buoy and pay at the ranger kiosk',
        'Walk through the 4th-century Roman complex on the waterfront',
        'Take the Park ferry to St. Mary’s monastery on Veliko Jezero',
        'Swim in the saltwater lakes (cooler than the sea)',
        'Hike the perimeter trail of both lakes (about 9 km)',
      ],
      mooringTip:
        'Polače uses paid Park mooring buoys (current 2025 rate around €40/night including crew Park entry) — pay the ranger on arrival. Bay is one of the best-sheltered overnight options on the entire south Croatian coast: fully protected N, NE, E and SE. Village pontoon also takes a few stern-to boats with own anchor.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mljet.webp', alt: 'Mljet' }],
    },
    {
      id: 'mljet-dubrovnik',
      routeFrom: 'Mljet',
      routeTo: 'Dubrovnik',
      day: 8,
      mapPin: {
        desktop: { left: 90.2, top: 86.2 },
        mobile: { left: 89.6, top: 68.5 },
      },
      shortDescription:
        '24 nm southeast to ACI Marina Dubrovnik in Komolac — eight kilometres up the Rijeka Dubrovačka inland from the Old Town. Taxi or Bus 1A handles the connection; the marina is a calm overnight, never the harbour itself.',
      description:
        "From Polače the run to Dubrovnik is 24 miles southeast, and on a settled summer day the prevailing W Maestral fills in by mid-morning to push you down the coast. Dubrovnik's Old Port is a UNESCO surface — small, picturesque, and useless as an overnight: it accepts daytime visitors only, exposed to S gradient, and crowded with tourist tenders all season. Every charter yacht overnights at ACI Marina Dubrovnik in Komolac, eight kilometres inland up the long fjord-like Rijeka Dubrovačka river estuary. Lazy lines, water and power on every berth, fuel pontoon, the lot. From the marina pontoon Bus 1A or a taxi takes you to the Pile Gate of the Old City in 15 minutes, dropping you at the head of the Stradun. The walls walk is mandatory — start it at the Pile end before sunset, the full circuit takes about 90 minutes, the view back across the rooftops is the postcard. Then dinner in one of the Prijeko side streets, ideally somewhere off the main artery.",
      thingsToDo: [
        'Walk the full Old City walls circuit before sunset',
        'Eat down a Prijeko side street, off the main Stradun',
        'Take the cable car to Mt. Srđ for the panorama',
        'Visit the Rector’s Palace and the cloister of the Franciscan monastery',
        'Stand a drink at Buža bar, on the rocks outside the south wall',
      ],
      mooringTip:
        'ACI Marina Dubrovnik in Komolac is the only practical overnight — book ahead in season, lazy lines, full services. Old Port is a daytime tender stop, never overnight; exposed to S gradient and saturated with tour boats. Allow 30 minutes door-to-door from the marina pontoon to Pile Gate by Bus 1A or taxi.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/dubrovnik.webp', alt: 'Dubrovnik' }],
    },
    {
      id: 'dubrovnik-okuklje-mljet',
      routeFrom: 'Dubrovnik',
      routeTo: 'Okuklje (Mljet)',
      day: 9,
      mapPin: {
        desktop: { left: 75.8, top: 80.5 },
        mobile: { left: 74.1, top: 66.9 },
      },
      shortDescription:
        '20 nm back northwest along Mljet’s south coast to Okuklje — a tight, deeply sheltered bay outside the National Park boundary. Three konobas with their own buoys, no town, no traffic, the quietest night of the route.',
      description:
        "The first day of the return leg covers 20 miles back northwest, and the destination — Okuklje, on Mljet's south-east coast — is deliberately the opposite of Dubrovnik: no town, no day-trippers, three family konobas and a tight U-shaped bay that takes maybe twenty boats. Okuklje sits outside the National Park boundary, so there are no Park fees and the konobas hang their own free buoys for guests who eat ashore. Pick up a buoy, dinghy in, choose a konoba — black risotto (crni rižot) cooked with cuttlefish ink and the boat's catch of the day are the stand-bys. The bay is shaped like a long crescent walled by 100-metre hills on three sides, so the wind drops dead at sunset regardless of the gradient outside. The afternoon move is to swim from the boat, walk the path that loops the headland for the southern view down to Korčula, then settle in. There is no nightlife and that is the entire point of stopping here.",
      thingsToDo: [
        'Pick up a free konoba buoy and book dinner ashore',
        'Order black risotto with the day’s catch',
        'Walk the headland path for the view down to Korčula',
        'Swim straight from the boat in glass-flat water',
        'Sleep with no town noise — the quietest stop of the route',
      ],
      mooringTip:
        'Free konoba buoys at Okuklje, dinner reservation locks the buoy — confirm on arrival. Anchoring on the bottom is possible but holding is patchy in seagrass. Bay is fully sheltered N, E and S; only NW gradient above 18 kn pushes any noticeable swell into the entrance, and even then the inner part of the bay stays comfortable.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/okuklje.webp', alt: 'Okuklje' }],
    },
    {
      id: 'okuklje-korcula-town',
      routeFrom: 'Okuklje',
      routeTo: 'Korčula Town',
      day: 10,
      mapPin: {
        desktop: { left: 52.1, top: 67.9 },
        mobile: { left: 49.9, top: 55.6 },
      },
      shortDescription:
        '15 nm northwest to Korčula Town — the walled medieval port on the eastern tip of Korčula island. ACI Marina or stern-to on the town quay, both work; the Old Town fits in your hand and is best walked at dusk.',
      description:
        'Fifteen miles northwest along the Pelješac Channel brings you to Korčula Town, the walled medieval port on the eastern tip of Korčula island. The skyline is unmistakable from offshore: a peninsula of red roofs and a single bell tower, the limestone curtain wall sliding down to the sea on three sides. ACI Marina Korčula is on the eastern side of the peninsula and offers full services with lazy lines; alternatively the town quay on the western side accepts a few stern-to boats with own anchor for a harbour fee — closer to the gates but exposed to W and rolly when the Maestral pushes through the channel. The Old Town is genuinely small — a ten-minute walk gets you across it — but the layout is famously the precursor to the radial grids the Venetians later used elsewhere. The Marco Polo House (whose actual link to the explorer is debated but the building is real and 14th-century) and the Cathedral of St. Mark are the headline stops. Best time to walk it is dusk, after the day-trip ferries have left for Split.',
      thingsToDo: [
        'Walk the Old Town at dusk after the ferries leave',
        'Climb the bell tower of St. Mark’s Cathedral',
        'Visit the (debated) Marco Polo House',
        'Order fish brodet at a courtyard konoba in the back lanes',
        'Watch a Moreška sword dance performance (Mon and Thu in season)',
      ],
      mooringTip:
        'ACI Marina Korčula on the eastern side is the all-weather option — lazy lines, water, power, full services. Town quay on the western side accepts stern-to with own anchor but is exposed to W Maestral; rolly after 14:00 in summer. If the channel turns rough, the sheltered alternative is Lumbarda Bay 3 nm southeast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/korcula.webp', alt: 'Korcula' }],
    },
    {
      id: 'korcula-jelsa-hvar',
      routeFrom: 'Korčula',
      routeTo: 'Jelsa (Hvar)',
      day: 11,
      mapPin: {
        desktop: { left: 46.5, top: 51.5 },
        mobile: { left: 41.2, top: 47.9 },
      },
      shortDescription:
        '23 nm northwest to Jelsa on Hvar’s northern coast — the quieter alternative to Hvar Town, with a town quay big enough to swallow the fleet and direct walking access to the lavender-belt villages.',
      description:
        "From Korčula the leg is 23 miles northwest across the Hvar Channel to Jelsa — the third-largest town on Hvar island, set on the central north coast and roughly half the size and a quarter of the noise of Hvar Town. The bay is wide, the town quay accepts stern-to with own anchor for a harbour fee (good holding in mud and sand), and a small marina on the eastern side handles boats that need lazy lines and shore power overnight. Jelsa is the working heart of Hvar's interior agriculture: the lavender belt that fills the road inland to Vrboska and on to Stari Grad still produces commercial yields each July, and the small konobas in the back lanes lean on the local Bogdanjuša white wine and the Faros (the Greek-name) cheese. The afternoon move is to walk or rent a bike out to Vrboska — three miles along the coast road, sometimes called 'the little Venice of Hvar' for its canal-bridged centre — and back in time for dinner in Jelsa.",
      thingsToDo: [
        'Walk or bike to Vrboska for the canal-bridged old centre',
        'Order Bogdanjuša white at a back-lane konoba',
        'Visit the Tor watchtower above the town for the channel view',
        'Sample Hvar lavender oil at a producer’s shop in season',
        'Take the path inland through the Stari Grad Plain (UNESCO site)',
      ],
      mooringTip:
        'Stern-to on the Jelsa town quay with own anchor — modest harbour fee, water and power on the central section. Bay is well-sheltered from S, SE and SW; exposed to N gradient, which is rare in summer except during the late-season Bora. Small marina on the eastern side has lazy lines and is the all-weather alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/jelsa.webp', alt: 'Jelsa' }],
    },
    {
      id: 'jelsa-lucice-bay-brac',
      routeFrom: 'Jelsa',
      routeTo: 'Lučice Bay (Brač)',
      day: 12,
      mapPin: {
        desktop: { left: 42.2, top: 44 },
        mobile: { left: 38.5, top: 43.1 },
      },
      shortDescription:
        '10 nm north across the Brač Channel to Lučice — a chain of small adjoining bays just east of Pučišća. No town, no quay, just lazy-line buoys laid by a couple of restaurants and the cleanest swimming on the route.',
      description:
        "Ten miles north across the Brač Channel takes you to the south coast of Brač and the chain of small adjoining bays at Lučice, immediately east of Pučišća. There is no town here — the headland is uninhabited, walled by white limestone cliffs and pine, and the only structures are the two seasonal beach restaurants that lay out free mooring buoys for guests who eat ashore. Pick up a buoy in the deepest of the three coves, dive overboard, and the day is essentially that. The water is exceptional: the famous white limestone of Brač (the same stone used for Diocletian's Palace and, allegedly, parts of the White House in Washington) gives the seabed its characteristic pale floor, and the visibility runs to 20 metres on a calm summer day. The two restaurants do simple grilled fish and the local Plavac Mali red. There is no nightlife, no shops, and that is exactly the point — this is the deliberate quiet day before the final run-in.",
      thingsToDo: [
        'Pick up a free restaurant buoy in the central cove',
        'Snorkel over the white limestone seabed (20 m visibility)',
        'Order grilled fish and Plavac Mali ashore',
        'Dinghy 1 nm west into Pučišća to see the working stone-mason yards',
        'Stand-up paddle the headland coast at sunrise',
      ],
      mooringTip:
        'Free restaurant buoys at Lučice — dinner ashore secures the buoy, confirm with the restaurant on arrival. Anchoring on bottom is possible (8–12 m, sand and weed) if buoys are full. Bays are sheltered from N, NE and E; exposed to S gradient. If S forecast above 15 kn, push 1 nm west into Pučišća harbour, which is fully enclosed.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lucice.webp', alt: 'Lucice' }],
    },
    {
      id: 'lucice-maslinica-solta',
      routeFrom: 'Lučice',
      routeTo: 'Maslinica (Šolta)',
      day: 13,
      mapPin: {
        desktop: { left: 31.1, top: 36.3 },
        mobile: { left: 24.9, top: 38.8 },
      },
      shortDescription:
        '15 nm northwest to Maslinica on Šolta’s western tip — the only proper natural harbour on Šolta and the perfect penultimate stop before the Saturday return. Martinis Marchi marina or stern-to on the inner quay.',
      description:
        'Fifteen miles northwest along the Brač south coast and across the Šolta Channel takes you to Maslinica, a deep, S-shaped natural harbour at the western tip of Šolta. The village wraps the inner half of the bay; the outer half holds an archipelago of seven small islets, the largest of which (Stipanska) is perfectly placed to break any swell from the open Adriatic. Two mooring options: the Martinis Marchi marina on the southern side of the bay (lazy lines, water, power, full services, attached to the 18th-century baroque castle that now operates as a hotel and restaurant) or stern-to with own anchor on the village quay opposite. The marina is the comfortable choice; the quay is the cheaper, atmospheric one. Šolta is the closest of the central Dalmatian islands to Split (15 nm out) but also the quietest — outside Maslinica there is essentially no charter traffic, and the local konobas on the village square run on Šoltansko olive oil and the local Dobričić red. Saturday return-to-base is 12 miles east, so the morning is unrushed.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Dinghy across to Stipanska island for the swim path',
        'Order the Šoltansko olive-oil tasting flight at a konoba',
        'Sample the Dobričić, Šolta’s indigenous red grape',
        'Take a sundowner on the islet of Polebrnjak west of the village',
      ],
      mooringTip:
        'Martinis Marchi Marina on the southern side has lazy lines and full services — the all-weather choice, book ahead in July–August. Village quay on the northern side accepts stern-to with own anchor for a modest fee; exposed to N gradient (rare in summer). Bay is fully sheltered from S, SW, W and NW thanks to the island chain at the entrance.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'maslinica' }],
    },
    {
      id: 'maslinica-split',
      routeFrom: 'Maslinica',
      routeTo: 'Split',
      day: 14,
      mapPin: {
        desktop: { left: 37.9, top: 29.4 },
        mobile: { left: 32.2, top: 32 },
      },
      shortDescription:
        '12 nm east back into Marina Kaštela or ACI Trogir for the Saturday handover by 09:00. Time the morning so the 12-mile return finishes with full light, fuel pumped, decks washed and the boat presented for the next charter.',
      description:
        "The final day of the route is the shortest — twelve miles east from Maslinica back into the Split charter cluster. Saturday handover protocol applies: the boat must be back at base, fuel topped, holding tanks emptied, decks rinsed and inventory checked, with the skipper available for the off-going inspection between 08:00 and 09:00 in the standard Croatian charter calendar. Most Boat4You boats out of Split are based at Marina Kaštela, ACI Marina Split, or ACI Trogir; the route into all three is straightforward in any visibility. Plan an early departure from Maslinica — the Maestral has not yet filled in at first light, the channel is glass-calm, and you arrive with time to clear customs (if booked) and walk into Split's Diocletian's Palace one final time. A long lunch at one of the Riva cafés before the airport transfer is the unwritten rule of the last day.",
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        'Walk Diocletian’s Palace one final time before the airport',
        'Take a final swim at Bačvice Beach east of the Old Town',
        'Pick up Šoltansko olive oil at the Pazar farmers market',
        'Stand a long lunch at a Riva café before the transfer',
      ],
      mooringTip:
        'Return to your booked Boat4You base — Marina Kaštela, ACI Marina Split or ACI Trogir, whichever is on your charter contract. All three accept stern-to or alongside per the base manager’s direction. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/split.webp', alt: 'Split' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Split – Dubrovnik – Split Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Split – Dubrovnik – Split Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(splitDubrovnikSplitRoute);
