import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const pomer14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Pomer Round Trip: Kornati & Zadar Archipelago',
  metaDesc:
    'Sail a 14-day catamaran loop from Marina Pomer: Susak, Dugi Otok, NP Kornati, Krka falls, Zadar and Silba. Day-by-day legs, mooring tips and park-fee advice.',
  id: 'pomer-14days',
  startingPoint: 'Pomer',
  otherPoints: ['14 Days'],
  cardImage: {
    src: '/images/itinerary/croatia/istria-itinerary/routes/pomer-14-days-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/kornati-murter-banner-large.webp',
      alt: 'Kornati, Murter',
    },
    {
      src: '/images/itinerary/croatia/banners/rovinj-banner-large.webp',
      alt: 'Rovinj',
    },
    {
      src: '/images/itinerary/croatia/banners/krk-banner.webp',
      alt: 'Krk',
    },
    {
      src: '/images/itinerary/croatia/banners/losinj-banner.webp',
      alt: 'Losinj',
    },
  ],
  routeDays: [
    {
      id: 'marina-pomer-medulin',
      routeFrom: 'Marina Pomer',
      routeTo: 'Medulin',
      day: 1,
      description:
        "Charter day one is about doing the unglamorous things properly. Check in at ACI Marina Pomer, sign the paperwork, walk through the catamaran's systems with the base staff and stow provisions — the supermarkets in Medulin and Pula are the last big shops you will see for a fortnight. Once the safety briefing is done, slip the lines and motor the 3 NM across the sheltered waters of Medulin bay. The bay is shallow, well protected and dotted with low islets, ideal for a first anchoring drill and a swim before dinner. To the south, the pine-covered finger of Cape Kamenjak marks the very tip of Istria — you will round it homeward-bound on day fourteen. Keep the evening simple: check the engine hours, log the fuel state, agree the watch and galley rota, and study the forecast for tomorrow's open-water leg across the Kvarner to Susak. An early night pays off; the second day is the longest early passage of the trip.",
      shortDescription:
        'Board in ACI Marina Pomer, complete check-in and provisioning, then make an easy 3 NM shakedown swing into Medulin bay. It is a short first hop by design — time to test the systems, brief the crew and anchor early, with Cape Kamenjak waiting just beyond the headland.',
      thingsToDo: [
        'Provision at the supermarkets in Medulin or Pula before slipping lines',
        'Run an anchoring and windlass drill in the shallow, sheltered bay',
        "Swim off the transoms in Medulin bay's sandy shallows",
        "Dinghy or walk to Lower Kamenjak's trails if time allows",
      ],
      mooringTip:
        'Anchor in Medulin bay in 3–5 m over sand with good holding, tucked behind the islets according to wind; alternatively stay on your berth in ACI Pomer for the first night and leave at dawn.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/medulin.webp', alt: 'Medulin' }],
    },
    {
      id: 'medulin-susak',
      routeFrom: 'Medulin',
      routeTo: 'Susak',
      day: 2,
      description:
        "Leave Medulin bay early — the Kvarner is calmest in the morning, and the afternoon breeze can build a short, steep chop between Istria and the islands. Round Cape Kamenjak with sea room to spare; the shallows off the cape kick up broken water even in light winds. From there it is open sea for most of the 24 NM, with Unije and the Lošinj chain slowly rising on the bow. Susak is unlike anywhere else on this coast: a 96-metre-high island of sand and loess held together by reeds and vines, with terraced vineyards stepping down to the water and not a stone karst ridge in sight. Approach from the north, where the bottom shelves gently — sound your way in, as depths shoal well offshore. Ashore, climb from the harbour through the lower village to Gornje Selo for the view over the terraces, and note the island's own dialect and costume traditions that survived generations of emigration to America.",
      shortDescription:
        'The first proper passage: 24 NM of open Kvarner water from Medulin to Susak. Clear Cape Kamenjak early, settle onto a steady southeasterly course and let the catamaran stretch its legs — around four hours at cruising speed to the strangest island in the Adriatic.',
      thingsToDo: [
        'Climb the steps from the harbour to Gornje Selo for a terrace-top panorama',
        'Walk barefoot on Spiaza beach — real sand, a rarity in the Adriatic',
        "Taste Trojiščina, the local wine grown on Susak's sandy terraces",
        "Swim from the shallow sandy shelf on the island's north side",
      ],
      mooringTip:
        'The small harbour mole at Susak is shallow and fills fast; most crews anchor off Bok bay or the north shore in 3–6 m over sand — excellent holding, but open to the north, so leave if bura is forecast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/susak.webp', alt: 'Susak' }],
    },
    {
      id: 'susak-ilovik',
      routeFrom: 'Susak',
      routeTo: 'Ilovik',
      day: 3,
      description:
        "After yesterday's passage, today is a recovery leg: 7 NM of easy water between Susak and Ilovik, an hour and a bit at catamaran pace. There is no reason to hurry — swim off Susak in the morning, then idle south past the scattered islets off Lošinj's tail. Ilovik village faces the islet of Sveti Petar across a narrow channel, and this strip of protected water is the island's anchorage, harbour and main street rolled into one. Pick up a mooring buoy mid-channel and take the dinghy ashore. Ilovik is called the island of flowers for good reason: oleander, palms and tended gardens front nearly every house, and the pace is set by the ferry and the fishermen. Walk over the low ridge to Paržine, a long sandy beach on the southeast shore, or take the tender across to Sveti Petar, where an eleventh-century Benedictine site and the island cemetery sit among the pines. Eat ashore tonight — the village konobas grill whatever came off the boats.",
      shortDescription:
        "A gentle 7 NM hop from Susak around the southern tip of Lošinj's outliers to Ilovik, the island of flowers. Barely more than an hour under way, which leaves the whole afternoon for the oleander-lined channel, garden-fronted houses and a long, unhurried swim.",
      thingsToDo: [
        'Pick up a buoy in the Ilovik–Sveti Petar channel and dinghy ashore',
        'Walk across the island to the sandy sweep of Paržine beach',
        'Visit the old Benedictine site and island cemetery on Sveti Petar',
        'Order grilled fish at a waterfront konoba in the village',
      ],
      mooringTip:
        'Moor on one of the numbered buoys in the channel between Ilovik and Sveti Petar and pay ashore; the channel is busy with moorings and an underwater cable, so arrive early in high season rather than counting on anchoring room.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/ilovik.webp', alt: 'Ilovik' }],
    },
    {
      id: 'ilovik-brbinj',
      routeFrom: 'Ilovik',
      routeTo: 'Brbinj (Dugi Otok)',
      day: 4,
      description:
        'This is a proper island-hopping leg: 20 NM that carries you out of the Kvarner and into the Zadar archipelago. From Ilovik, shape a course southeast for the Maknare channel, the gap between Molat and the northwest tip of Dugi Otok. As you close the passage, the stone tower of Veli Rat lighthouse — at over 40 metres the tallest on the Croatian coast, working since 1849 — stands among the pines to starboard. Once through, the long spine of Dugi Otok runs ahead of you for the next two days. Brbinj is a quiet ferry village folded into a double bay, its two coves separated by a wooded peninsula and backed by some of the oldest olive groves on the island. There is little to do here, which is exactly the point: swim from the boat, walk the shore path among the olives, and watch the Zadar ferry come and go. Provision lightly ashore — the village shop is small.',
      shortDescription:
        'Back on passage: 20 NM southeast from Ilovik through the Maknare channel, leaving Molat to port and closing the long wooded shore of Dugi Otok. Reckon on three hours; the reward is Brbinj, a sleepy twin-coved harbour wrapped in olive woods.',
      thingsToDo: [
        'Photograph Veli Rat lighthouse as you clear the Maknare channel',
        "Swim in the clear shallows of Brbinj's sheltered twin coves",
        "Walk the shoreside path through Brbinj's centuries-old olive groves",
        'Watch the Zadar ferry work the pier from your cockpit at dusk',
      ],
      mooringTip:
        "Pick up one of the mooring buoys in Lučina, Brbinj's southern cove, or anchor in 4–8 m over mud and sand with good holding; keep well clear of the ferry pier and its turning circle.",
      gallery: [{ src: '/images/itinerary/croatia/destinations/bozava.webp', alt: 'Dugi Otok' }],
    },
    {
      id: 'brbinj-zaglav',
      routeFrom: 'Brbinj',
      routeTo: 'Zaglav',
      day: 5,
      description:
        "Today stays in Dugi Otok's lee, tracking the northeast shore for 12 NM. The island's sheltered side is a run of small settlements — Savar, Luka, Žman — each with a handful of houses and a church by the water, and the pilotage is simple: hold a sensible offing and enjoy the coast sliding by. Zaglav is a practical stop with real charm. Its concrete quay serves the island's only fuel station, so top up the tanks here — the next straightforward fuel is days away — and the village above the harbour is home to the fifteenth-century Franciscan monastery of St Michael on the hill. Sali, Dugi Otok's main village and its thousand-year-old fishing port, is a half-hour walk or a short dinghy ride south if you want more life ashore. Better still, use the spare afternoon hours to prepare tomorrow: the Kornati crossing is short, so a lazy start is allowed, but a fuel-and-water top-up tonight keeps the morning free.",
      shortDescription:
        "An easy 12 NM run down Dugi Otok's green northeast shore, past a string of hamlets and olive terraces, to Zaglav — a working village quay beside the island's only fuel berth, one bay short of Sali. Two hours of relaxed coastal pilotage.",
      thingsToDo: [
        "Refuel at Zaglav's pumps — the only fuel berth on Dugi Otok",
        'Climb to the 15th-century Franciscan monastery of St Michael',
        'Walk or dinghy over to Sali for an evening in the old fishing port',
        'Buy Dugi Otok olive oil directly from a village producer',
      ],
      mooringTip:
        "Berth bow- or stern-to on Zaglav's village quay (space is limited, so arrive by mid-afternoon) or anchor off in 4–6 m; the fuel berth itself is for fuelling only, so shift off promptly.",
      gallery: [{ src: '/images/itinerary/croatia/destinations/sali.webp', alt: 'Zaglav & Sali, Dugi Otok' }],
    },
    {
      id: 'zaglav-zut',
      routeFrom: 'Zaglav',
      routeTo: 'Žut (Kornati)',
      day: 6,
      description:
        "Round Dugi Otok's southeastern end and the landscape changes character completely. Astern lie green olive slopes; ahead, the Kornati — bare, grey-gold ridges rising straight from the sea. Today's 14 NM leg crosses the mouth of Telašćica, the great natural harbour at Dugi Otok's tip (a nature park with its own mooring buoys, worth a lunch detour if the schedule allows), then carries on across the channel to Žut. Žut is the second-largest island of the Kornati chain but sits outside the national park boundary, so no park ticket is needed tonight. There is no village and no fresh water source on the island — just stone, scrub, scattered olive terraces still worked by families from Murter, and a handful of seasonal konobas around the shore. ACI Marina Žut, open through the season, occupies the head of a wide bay with lazy lines and a restaurant terrace above the pontoons. Watch the light go copper on the ridgelines at sunset; this is the Kornati at their emptiest and best.",
      shortDescription:
        'Cross from Dugi Otok into the Kornati back range: 14 NM past the mouth of Telašćica and over the channel to Žut. Expect a couple of hours under way, finishing between bare stone slopes and olive terraces at ACI Marina Žut.',
      thingsToDo: [
        "Detour into Telašćica's buoy field for a swim under the cliffs",
        'Hike up behind the marina for a ridge-top view over the Kornati',
        "Eat lamb or fresh fish at a konoba on Žut's shore",
        'Buy your NP Kornati tickets online tonight — cheaper than from the rangers',
      ],
      mooringTip:
        'ACI Marina Žut is seasonal and popular — book a berth ahead in July and August, and remember water and power are limited since the island has no fresh water; lazy lines are provided.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zut.webp', alt: 'Žut' }],
    },
    {
      id: 'zut-kaprije',
      routeFrom: 'Žut',
      routeTo: 'Kaprije',
      day: 7,
      description:
        "South of Žut you enter Kornati National Park proper — 89 islands, islets and reefs with barely a tree among them, and by law every vessel needs a valid park ticket (buy online in advance; it is cheaper than paying the ranger boat). Take the day slowly. The Kornatski kanal runs down the inside of Kornat, the archipelago's namesake island, past dry-stone walls that lattice the slopes and lonely field houses used by Murter farmers. Above Tarac cove, the sixth-century Byzantine fort of Tureta watches the channel as it has for 1,400 years. Anchor for lunch and a swim wherever the wind allows — the water over the pale bottoms is absurdly clear. By mid-afternoon, clear the park's southeastern edge and cross into the Šibenik island group. Kaprije, your night stop, is a one-village island with no cars to speak of, a working fishing fleet, and a broad bay where the evening goes quiet early. It is a fitting decompression after the park's stark drama.",
      shortDescription:
        'The showpiece leg: 15 NM through the heart of NP Kornati, running the channel between Kornat and its scatter of islets before breaking out into Šibenik waters at Kaprije. Have your park tickets ready — rangers patrol — and budget extra time for swim stops along the way.',
      thingsToDo: [
        'Cruise the Kornatski kanal beneath the Byzantine fort of Tureta',
        "Drop the hook for a lunch swim over the Kornati's pale seabeds",
        'Spot the dry-stone walls Murter farmers laid across the bare islands',
        "Stretch your legs on Kaprije's single, car-free village waterfront",
      ],
      mooringTip:
        "Kaprije's village bay has buoys and room to anchor in 5–8 m over sand with reliable holding; deep Medoš bay is the fallback shelter if the village fills or the wind turns in. Park tickets bought in advance cost noticeably less than those sold on the water.",
      gallery: [{ src: '/images/itinerary/croatia/destinations/kaprije.webp', alt: 'Kaprije' }],
    },
    {
      id: 'kaprije-skradin',
      routeFrom: 'Kaprije',
      routeTo: 'Skradin',
      day: 8,
      description:
        "Few arrivals in the Adriatic beat this one. From Kaprije it is a short reach across to the mainland coast, where the entrance to Šibenik's inner waters announces itself with St Nicholas Fortress, a sixteenth-century Venetian sea-fort built low on its islet and now UNESCO-listed. Beyond it the St Anthony channel narrows between pine-covered banks — commercial traffic uses it too, so keep right and keep watch — before opening suddenly onto Šibenik's harbour, with the cathedral dome and stacked old town to starboard. Carry on north under the road bridge, across the broad, brackish Prokljan lake, and into the final wooded bends of the Krka river canyon. Skradin appears at the end of it: a tiny, ancient town at the foot of the falls, with ACI Marina Skradin tucked into the riverbank alongside. The water here is nearly fresh — a strange, pleasant novelty after a week of salt. Tie up, rinse the boat, and book the morning's national park boat to Skradinski Buk.",
      shortDescription:
        'A 14 NM leg with a spectacular finish: across to the mainland, in past the sea-fort of St Nicholas, up the St Anthony channel beneath Šibenik, across Prokljan lake and up the Krka canyon to ACI Marina Skradin — river water under the keels by nightfall.',
      thingsToDo: [
        'Salute St Nicholas Fortress as you enter the St Anthony channel',
        "Pick out Šibenik's UNESCO cathedral of St James from the water",
        "Taste Skradin's famous slow-cooked risotto in the old town",
        'Book NP Krka tickets and the park boat for tomorrow morning',
      ],
      mooringTip:
        'ACI Marina Skradin lies in the river with all-round shelter but heavy summer demand — reserve a berth in advance; alternatively anchor just downstream of the town in 5–10 m of mud, mindful of the current and the excursion-boat fairway.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Skradin' }],
    },
    {
      id: 'skradin-np-krka',
      routeFrom: 'Skradin',
      routeTo: 'NP Krka',
      day: 9,
      description:
        "Today the log stays at zero and the skipper gets a holiday too. National park boats run from Skradin's waterfront up the last unnavigable stretch of river to Skradinski Buk, the great terminal cascade of the Krka — seventeen travertine steps dropping some 45 metres through a wooded gorge, and the reason this river has been protected since 1985. The boat transfer is included in the park ticket; in July and August, take the first departure of the morning and you will have the boardwalks nearly to yourselves. Allow two to three hours for the full loop: wooden walkways cross the rapids and pools, viewpoints stack up along the gorge side, and restored watermills show how the falls once powered the region. Note that swimming at Skradinski Buk has been prohibited since 2021 — this is a walking day, not a bathing one. Back in Skradin by afternoon, there is time for the fortress viewpoint above town, an ice cream on the riverfront, and a proper dinner ashore.",
      shortDescription:
        'A layover day — 0 NM on the log. Leave the boat on her lines in Skradin and take the national park boat upriver to Skradinski Buk, where the Krka steps down through a chain of travertine falls. Boardwalks, viewpoints, watermills and an easy, boat-free day.',
      thingsToDo: [
        'Ride the first park boat upriver to beat the crowds at Skradinski Buk',
        'Walk the full boardwalk loop past the watermills and rapids',
        'Climb to Turina fortress for the view back over Skradin and the river',
        'Join a park excursion to Visovac island monastery or Roški Slap',
      ],
      mooringTip:
        'Stay put on your ACI Skradin berth — a second night is far easier than re-mooring — and buy NP Krka tickets online the evening before; the park boat from Skradin is included in the ticket.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'NP Krka' }],
    },
    {
      id: 'skradin-tribunj',
      routeFrom: 'Skradin',
      routeTo: 'Tribunj',
      day: 10,
      description:
        "Running the Krka canyon in reverse is no hardship — the morning light comes into the gorge differently, and Šibenik's waterfront makes a fine slow-speed flypast on the way out. Once clear of St Nicholas Fortress, turn northwest along the coast for the short remaining stretch to Tribunj, about 10 NM all told from Skradin. Tribunj's old core is crammed onto a tiny islet, joined to the mainland by a small stone bridge, with fishing boats rafted along both quays — this remains one of the busiest small fishing fleets in the Šibenik area. The village keeps up an old affection for donkeys, once the working animal of these dry hills; a summer donkey race is a fixture of the local calendar. Berth in the marina beside the village, then walk up the low hill of St Nicholas behind town for a sunset view across the Kornati fringe. Fresh fish for dinner is not optional here — it is the whole point.",
      shortDescription:
        'Retrace the canyon: 10 NM back down the Krka, across Prokljan lake, through the St Anthony channel and out past St Nicholas Fortress, then a short coastal hop northwest to Tribunj — a fishing village packed onto its own islet, with a full-service marina alongside.',
      thingsToDo: [
        "Cross the little stone bridge onto Tribunj's islet old town",
        'Hike up to St Nicholas chapel for sunset over the outer islands',
        'Watch the fishing fleet land its catch along the village quay',
        "Order today's fish, sold by the kilo, at a harbourfront konoba",
      ],
      mooringTip:
        'Marina Tribunj sits right beside the village with lazy lines and full services; the village quay is dominated by the fishing fleet, so the marina is the realistic option — call ahead in peak season.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/tribunj.webp', alt: 'Tribunj' }],
    },
    {
      id: 'tribunj-zadar',
      routeFrom: 'Tribunj',
      routeTo: 'Zadar',
      day: 11,
      description:
        "Today strings together some of the most protected water on this coast. From Tribunj, work northwest across the Murter Sea, leave Murter and its bridge-town of Tisno inshore, and enter the Pašman channel — a long, green corridor between the mainland and the islands of Pašman and Ugljan. Mind the buoyed fairway: parts of the channel are shallow, and the tidal stream here runs harder than anywhere else in the area. Biograd's waterfront and a steady parade of local boats keep the middle hours interesting. Zadar announces itself with church towers on a compact walled peninsula. Berth across the harbour from the old town, then give the evening to the city: the Roman forum, the ninth-century round church of St Donatus, and finally the Riva at sunset, where the Sea Organ plays chords pushed by the swell through submerged pipes and the Greeting to the Sun lights up underfoot. Alfred Hitchcock rated Zadar's sunset above Key West's; judge for yourself from the quay.",
      shortDescription:
        'The longest leg of the second week: 25 NM up the Murter Sea and the length of the Pašman channel to Zadar. Around four hours of sheltered, island-flanked motoring or sailing, timed to arrive with daylight to spare — the Sea Organ is best at dusk.',
      thingsToDo: [
        'Listen to the Sea Organ as the evening swell plays it',
        'Stand on the Greeting to the Sun as its lights come alive',
        'Circle the Roman forum and the round church of St Donatus',
        "Stock up in Zadar's markets — the best provisioning until Pomer",
      ],
      mooringTip:
        'Marina Zadar lies directly opposite the old town peninsula and takes catamarans on lazy lines — book ahead in summer, as the city quay is reserved for ferries and excursion boats; D-Marin Borik, 2 NM northwest, is the alternative.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zadar.webp', alt: 'Zadar' }],
    },
    {
      id: 'zadar-silba',
      routeFrom: 'Zadar',
      routeTo: 'Silba',
      day: 12,
      description:
        "Leaving Zadar's channel behind, the day runs northwest past Ugljan and Rivanj into progressively emptier water, with the low profiles of Sestrunj, Molat and finally Silba sorting themselves out ahead. Silba is the kind of island the Adriatic does not make any more: no cars at all, no hotels of any size, and in July and August even bicycles are banned from the village lanes. The single village sits on a narrow waist of land with a landing place on each side — Mul to the east, Žalić to the west — so there is always a lee to be found. Above the rooftops stands the Toreta, a nineteenth-century hexagonal tower with an external spiral stair, built by sea captain Petar Marinić and wrapped in a story of love and long absence; climb it for a view across the whole northern archipelago. The rest of the day writes itself: sandy-bottomed coves, pine shade, and a village dinner eaten at walking pace, because that is the only pace Silba has.",
      shortDescription:
        "Point northwest for 24 NM along the Zadar channel, past Ugljan's villages and the low outer islands, to car-free Silba. It is a straightforward half-day passage — around four hours — with the afternoon kept free for the island's sandy coves and the climb up the Toreta tower.",
      thingsToDo: [
        "Climb the Toreta's outside spiral stair for an archipelago panorama",
        'Swim in the sandy shallows of Šotorišće north of the village',
        "Wander the car-free lanes between gardens and captains' houses",
        "Take the dinghy to a deserted cove on the island's west shore",
      ],
      mooringTip:
        'Pick up a buoy off Mul or Žalić according to the wind — swell can work in on either side — or anchor south of the village in Sveti Ante bay in 4–8 m over sand; there is no marina on Silba.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/silba.webp', alt: 'Silba' }],
    },
    {
      id: 'silba-veli-losinj',
      routeFrom: 'Silba',
      routeTo: 'Veli Lošinj',
      day: 13,
      description:
        "The passage from Silba to Lošinj crosses one of the best cetacean patches in the Adriatic: these waters hold a resident population of bottlenose dolphins, studied for decades by the Blue World Institute based in Veli Lošinj itself, so keep a lookout posted once you are in open water. Lošinj's southeast coast comes up tall and green — this island made its money in sail, and by the nineteenth century Veli Lošinj's captains were building the tall pastel houses that still crowd its absurdly small harbour. The inlet is barely a boat-length wide at the mouth, with the pink bulk of St Anthony the Abbot's church standing right over the quay. Space inside is tight; the neighbouring bay of Rovenska, behind its old stone breakwater, is the catamaran-friendly alternative a ten-minute walk away. Ashore, climb through the lanes to the Venetian defence tower of 1455, now a small museum, and idle through gardens full of plants that homecoming captains carried back from other seas.",
      shortDescription:
        "Cross the open gap between the Zadar and Kvarner archipelagos: 20 NM from Silba over to Lošinj's steep southeast coast and into Veli Lošinj's pocket-sized harbour, ringed by pastel captains' houses. About three hours under way, with dolphins a real possibility mid-passage.",
      thingsToDo: [
        "Scan the crossing for Lošinj's resident bottlenose dolphins",
        'Visit the 1455 Venetian tower museum above the harbour',
        'Walk the coastal path from Rovenska round to Veli Lošinj',
        "Drink a coffee on the tiny quay under St Anthony's church",
      ],
      mooringTip:
        "Veli Lošinj's inner harbour is too tight for most catamarans; berth instead in Rovenska bay on the quay or buoys behind the breakwater — sheltered except from the southeast — and walk the coastal path over.",
      gallery: [{ src: '/images/itinerary/croatia/destinations/veli-losinj.webp', alt: 'Veli Lošinj' }],
    },
    {
      id: 'veli-losinj-marina-pomer',
      routeFrom: 'Veli Lošinj',
      routeTo: 'Marina Pomer',
      day: 14,
      description:
        "Save some concentration for the last day: this is the longest single passage of the itinerary and it is nearly all open water. Clear Veli Lošinj early, round the island's southern tail and run up the outer shore past Unije, then lay a course across the Kvarner for the tip of Istria — the same stretch you crossed southbound on day two, now with thirteen days of boat-handling behind you. Cape Kamenjak wants respect on the way round: give the off-lying shallows a wide berth, expect confused water if wind stands against sea, and only then turn into the broad shelter of Medulin bay. From there it is a short, quiet final mile to ACI Marina Pomer. Fuel the boat as agreed with the base, run the checkout list against the inventory, and get the crew's bags staged for the morning. Then the important part: a last swim off the stern, a last dinner together, and the ritual argument about which anchorage of the fourteen was best. Kornati usually wins. Sometimes Silba.",
      shortDescription:
        'The homeward passage: 27 NM of open Kvarner water from Veli Lošinj back to Istria, rounding Cape Kamenjak and easing into Medulin bay to ACI Marina Pomer. Four to four and a half hours — leave early, keep a weather eye, and be alongside in good time for disembarkation.',
      thingsToDo: [
        'Round Cape Kamenjak with a wide, respectful offing',
        'Take a farewell swim in Medulin bay before entering the marina',
        'Refuel and square away the boat ahead of the handover',
        'Toast the trip with a final crew dinner in Pomer or Medulin',
      ],
      mooringTip:
        'Be back on your ACI Pomer berth by late afternoon at the latest — check-out inspections start early next morning — and plan the refuelling stop into the day, as the base will specify where to fill before handover.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/marina-pomer.webp', alt: 'Marina Pomer' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/map.webp',
        alt: 'Pomer Route Image',
      },
      width: 1480,
      height: 1556,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/mobile-map.webp',
        alt: 'Pomer Route Image',
      },
      width: 1064,
      height: 1514,
    },
  },
};

export default computeItineraryNumberOfDays(pomer14DaysRoute);
