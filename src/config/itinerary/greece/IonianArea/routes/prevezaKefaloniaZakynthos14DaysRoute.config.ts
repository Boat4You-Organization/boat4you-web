import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const prevezaKefaloniaZakynthos14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Preveza–Kefalonia–Zakynthos Yacht Route | Boat4You',
  metaDesc:
    'Sail a 14-day yacht charter from Preveza via Meganisi, Ithaka, Kefalonia, Zakynthos, Kastos and Kalamos. Hidden coves, Homeric myths and Ionian beauty across two weeks.',
  id: 'preveza-kefalonia-zakynthos-14-days',
  startingPoint: 'Preveza',
  otherPoints: ['Kefalonia', 'Zakynthos'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/preveza-kefalonia-zakynthos.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/kefalonia-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/zakynthos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/zakynthos-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/ithaka-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'preveza-meganisi',
      routeFrom: 'Preveza',
      routeTo: 'Meganisi',
      day: 1,
      mapPin: {
        desktop: { left: 71, top: 39.9 },
        mobile: { left: 72.4, top: 39.5 },
      },
      shortDescription:
        'Roughly 22 nm south from Cleopatra Marina (Preveza) through the Lefkas Canal to Meganisi. Allow time for the swing-bridge — opens on the hour. Easy shake-down day with three sheltered bays to choose from for the night.',
      thingsToDo: [
        'Snorkel inside the WWII Papanikolis Cave',
        'Climb the cliff staircase to Spartochori',
        'Anchor for a long swim in Atherinos Bay',
        'Grilled octopus on the Vathy quay',
        'Sundowner above the port at Errikos',
      ],
      mooringTip:
        'Restaurant moorings in Vathy, Atheni and Spilia bays — pay for dinner, the buoy comes free. Vathy small marina (lazy lines, fee) is the formal alternative. Holding good on 4–8 m sand across the island; bombproof in N–NW.',
      description:
        "First day out of Cleopatra Marina — the full-service base on the Preveza side of the Ambracian Gulf — and the run south takes you through the Lefkas Canal on the second hour. The canal swing-bridge gates the start of every charter week here; the 09:00 lift is the standard target, and the waiting basin holds 30+ boats in season. Once through, the SW thermal builds along the inside of Lefkas's east coast and you arrive at Meganisi mid-afternoon. The island sits across the channel from Nydri, packs three sheltered bays into a coastline you can drive round in an hour, and gives you the choice of how social you want the first night to be. Atheni Bay is the quietest — narrow inlet, one restaurant-mooring taverna (Niagas), and a path up to Spartochori village on the cliffs above. Vathy on the eastern side has the small marina and the busier quay. Papanikolis Cave on the western tip is the 10-minute dinghy tour.",
      gallery: [{ src: '/images/itinerary/greece/destinations/meganisi.webp', alt: 'Meganisi' }],
    },
    {
      id: 'meganisi-ithaka',
      routeFrom: 'Meganisi',
      routeTo: 'Ithaka',
      day: 2,
      mapPin: {
        desktop: { left: 71.4, top: 52.7 },
        mobile: { left: 68.6, top: 52.6 },
      },
      shortDescription:
        'About 14 nm south-east round the southern tip of Meganisi to Vathy on Ithaka. Horseshoe harbour ringed by cypress, Mt Nirito (806 m) behind, and the steepest entry channel in the inner Ionian.',
      thingsToDo: [
        'Hike to the Cave of the Nymphs',
        'Sofrito veal at To Trehantiri waterfront',
        'Walk the cobbled lanes of Vathy old town',
        'Swim Dexa Bay where Odysseus came ashore',
        'Sundowner up at the harbour-entrance battery',
      ],
      mooringTip:
        'Stern-to on Vathy town quay (small fee, water/electric). Holding good in 5–8 m mud — set the anchor well as the bay is narrow. Tight in mid-August; arrive before 16:00 or fall back to Kioni 6 nm north for the quieter night.',
      description:
        "Fourteen nautical miles south-east drops you onto Vathy — the main town of Ithaka and the harbour where most Homer-led itineraries land. The bay is a near-perfect horseshoe ringed by cypress and pale-stucco houses, with the steepest entry channel in the inner Ionian (cliffs at the inlet rise 80 m on both sides) and Mt Nirito throwing the sunset back across the basin. The Cave of the Nymphs above the village — where Homer has Odysseus hide his treasure on returning home, the dripstone interior reached by a 25-minute dirt path from the harbour — is the textbook walk. Dexa Bay on the way back down is the swim stop, the small white-pebble cove where the Phaeacians supposedly set Odysseus ashore. To Trehantiri or Sirenes on the harbour for dinner; the sofrito (veal slow-cooked in white wine, garlic and parsley, the Ionian's signature meat plate) is the local order. The small Venetian battery at the harbour entrance is the sundowner walk.",
      gallery: [{ src: '/images/itinerary/greece/destinations/ithaka.webp', alt: 'Ithaka' }],
    },
    {
      id: 'ithaka-kefalonia',
      routeFrom: 'Ithaka',
      routeTo: 'Kefalonia (Asos)',
      day: 3,
      mapPin: {
        desktop: { left: 68.5, top: 59.3 },
        mobile: { left: 68.5, top: 59.3 },
      },
      shortDescription:
        "About 16 nm south-west across the channel to Assos on Kefalonia's northwest coast. Pine-clad hillside under a 16th-century Venetian castle, Myrtos Beach 1 nm south by car (not by sea), and the most photographed anchorage on the island.",
      thingsToDo: [
        'Walk the Venetian fortress walls above the village',
        'Drive south to Myrtos Beach overlook',
        'Kayak to remote pebble coves north of the bay',
        'Hike the wild-oregano coastal paths',
        'Robola wine flight at a hillside taverna',
      ],
      mooringTip:
        'Anchor in 5–8 m sand off Assos village; second-line stern-to on the small quay if a slot is free. Bay is open W — relocate to Foulis or Fiskardo 3 nm north if a westerly is forecast. Holding excellent on clean sand.',
      description:
        "Sixteen nautical miles south-west across the channel onto Kefalonia's northwest coast. Asos itself is the pastel village under the 16th-century Venetian fortress — built in 1593 to defend the strait between Kefalonia and Ithaka against Ottoman pirate raids, the citadel was the headquarters of the entire Venetian Ionian for 90 years. The walls take an hour to walk in full; the cliff-top trail from the village reaches the inner bailey, where the cisterns and the gunpowder magazine are still intact. The bay below is the photo anchorage — pine-clad hillside, terracotta roofs against turquoise water, the kind of frame that explains why Kefalonia ends up on every Greek-island top-ten list. Myrtos Beach 1 nm south by road is the half-day excursion — the limestone-cliff overlook from the access road is the more photogenic angle than the beach itself. Robola — the dry white made from the indigenous Kefalonian grape grown only on this island — is the local wine worth a tasting flight at any hillside taverna.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia.webp', alt: 'Asos' }],
    },
    {
      id: 'kefalonia-asos-free',
      routeFrom: 'Kefalonia (Asos)',
      routeTo: 'Asos',
      day: 4,
      mapPin: {
        desktop: { left: 63.5, top: 61.4 },
        mobile: { left: 59.3, top: 61.4 },
      },
      shortDescription:
        'Layover day at anchor under Assos castle — no passage. Dinghy hop down to Myrtos Beach for the limestone-cliff swim, or the half-day inland excursion to the Drogarati Cave and the Melissani sinkhole lake.',
      thingsToDo: [
        'Swim the limestone crescent at Myrtos',
        'Tour the Drogarati Cave stalactite chambers',
        'Kayak to the Foulis Bay pebble cove',
        'Coastal trail north to the abandoned hamlet',
        'Kreatopita at a family kafeneio in the village',
      ],
      mooringTip:
        'Stay at anchor in 5–8 m sand off Assos. If wind clocks W, shift round to Foulis or Fiskardo (3–5 nm north). No fuel — top up at Sami later in the week.',
      description:
        "A free day at anchor under the Venetian castle is the test of whether you booked the 14-day itinerary for the right reasons — the alternative was to keep moving south after day 3. Myrtos Beach 1 nm south by road is the cliché walk, and the limestone crescent below the cliffs does live up to the brochure photography; bring water shoes — the 'sand' is actually pulverised marble pebbles, and the shelving is steep. The Drogarati Cave 20 km south of Sami is the better half-day inland excursion — a 60-m-deep stalactite chamber discovered in 1963, used for occasional classical concerts because the acoustics carry the resonance of a 10-second decay. Melissani Cave nearby (the sinkhole lake whose collapsed roof lets sunlight column-down onto the water at noon) is the second cave on the same circuit. Kreatopita — Kefalonian meat-and-rice pie under a thin pastry, distinct from the Macedonian or Athenian versions — is the local lunch plate at any village kafeneio.",
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Asos' }],
    },
    {
      id: 'asos-kefalonia-lixouri',
      routeFrom: 'Asos',
      routeTo: 'Kefalonia (Lixouri)',
      day: 5,
      mapPin: {
        desktop: { left: 63.1, top: 66.6 },
        mobile: { left: 58.2, top: 66.7 },
      },
      shortDescription:
        "About 25 nm south down Kefalonia's west coast to Lixouri, the island's laid-back twin town across the Argostoli Gulf. Petani Beach swim stop on the way; long quay with plenty of space for the night.",
      thingsToDo: [
        'Swim at gold-cliffed Petani Beach',
        'Cycle the vineyards to Xi rust-red sand',
        'Robola tasting at the Calliga family winery',
        'Walk the long Lixouri seafront promenade',
        'Watch for kantadores fiddlers in the square',
      ],
      mooringTip:
        'Stern-to on Lixouri main quay (small fee, water/electric — long quay, plenty of slots). Argostoli town quay across the gulf is the alternative if a strong N–NW is forecast; commercial port traffic is heavier on the Argostoli side.',
      description:
        "Twenty-five nautical miles south down Kefalonia's west coast — long enough to feel like a passage day but inside the lee of the island the whole way, so the sailing is mostly under engine on a still afternoon. Petani Beach on the way down is the headline swim stop — golden-limestone cliffs at the north end and a deep-water anchorage at 5–7 m sand. Lixouri itself sits at the head of the Paliki peninsula, the laid-back twin to the commercial Argostoli town across the gulf. The long quay holds 30+ boats and has water and electric; the seafront promenade runs for half a kilometre under tamarisk and plane trees. Xi Beach 6 km south is the bicycle excursion (rentals at the harbour-front) — the rust-red sand here is the result of the surrounding clay cliffs, and the water shelves shallowly for 50 m off the beach. Calliga winery in the hills behind town runs Robola flights for visitors. Kantadores — the local stringed-instrument trio (mandolin, mandola, guitar) — play the village square most weekend evenings.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia-lixouri.webp', alt: 'Lixouri' }],
    },
    {
      id: 'lixouri-zakynthos',
      routeFrom: 'Lixouri',
      routeTo: 'Zakynthos',
      day: 6,
      mapPin: {
        desktop: { left: 59.1, top: 73.5 },
        mobile: { left: 57.7, top: 73.6 },
      },
      shortDescription:
        'About 30 nm south across open water to Zakynthos. Day-anchor under the Navagio shipwreck cliffs on the way down (no overnight there — fully exposed to N–NW), then round to Zakynthos Town quay for the night.',
      thingsToDo: [
        'Anchor under Navagio Shipwreck for the photo',
        'Mandolato and ouzo on a Zante Town terrace',
        'Walk Solomos Square at the evening volta',
        'Try the local nougat at a harbour bakery',
        'Cliff-top viewpoint at Cape Skinari',
      ],
      mooringTip:
        'Stern-to on Zakynthos Town quay (small fee, basic — water but no electric). Exposed to S–SW — relocate to Keri Bay (8 nm south, 5–8 m sand) if a southerly is forecast. No proper marina on Zakynthos.',
      description:
        "Thirty nautical miles south takes you off Kefalonia and onto Zakynthos — the southernmost of the Ionian Islands and the one with the most-photographed beach in Greece. Navagio Beach (Shipwreck Cove) on the wild west coast is the headline waypoint — a 200-m crescent of white sand at the base of vertical chalk cliffs, the rusted Panagiotis freighter aground on the sand since a 1980 smuggling-run wreck. The bay is impossible to enter except by tender; anchor your yacht in the deep water outside the cliff arc and dinghy in. It's day-only — the bay is fully exposed N–NW and the cliffs are unstable (rockfalls have killed beach tourists in recent summers; the official restricted zone is now buoyed off). Round Cape Skinari and run down the east coast to Zakynthos Town for the night; the Venetian-arched seafront here was rebuilt almost identically after the 1953 earthquake, and the row of bougainvillea-covered bars on Solomos Square is the evening waypoint. Mandolato (white nougat with almonds, the Zakynthos specialty) is the local plate worth carrying back to the boat.",
      gallery: [{ src: '/images/itinerary/greece/destinations/zakynthos.webp', alt: 'Zakynthos' }],
    },
    {
      id: 'zakynthos-free',
      routeFrom: 'Zakynthos',
      routeTo: 'Zakynthos',
      day: 7,
      mapPin: {
        desktop: { left: 76, top: 90.1 },
        mobile: { left: 76, top: 90.1 },
      },
      shortDescription:
        'Free day around Zakynthos. Short 8 nm hops between Cape Skinari Blue Caves to the north and the Keri-Marathonisi turtle lagoons to the south. SW thermal carries you down the lee shore.',
      thingsToDo: [
        'Snorkel the Blue Caves at Cape Skinari',
        "Anchor in Keri's warm shallow lagoon",
        'Spot loggerhead turtles around Marathonisi',
        'Saganaki flame-cheese at a cliffside taverna',
        'Cliff hike at the Vromi viewpoint',
      ],
      mooringTip:
        'Anchor in Keri Bay (5–8 m sand, holding good) for the quiet overnight, or back to Zakynthos Town quay. Marathonisi is a National Marine Park — anchor only outside the buoyed turtle-nesting zone (south end of the islet).',
      description:
        'A free day on Zakynthos is best framed as two short hops north and south of the town. The Cape Skinari Blue Caves on the north tip are the morning excursion — a series of sea caves where the limestone overhangs filter sunlight onto the seabed and turn the water inside the chambers a hard electric blue. The local glass-bottom-boat tours run from Skinari port; you can do the same circuit on your own dinghy with a torch and a snorkel. To the south, the Keri-Marathonisi area is the National Marine Park — the lagoon between Cape Keri and the small uninhabited Marathonisi islet is the loggerhead-turtle (Caretta caretta) nesting ground for the Mediterranean. Anchor outside the buoyed exclusion zone on the south end of the islet; the turtles surface to breathe every 10–15 minutes between June and August. Saganaki — flame-flambéed feta or kefalograviera, doused in lemon — is the cliffside-taverna plate worth ordering at any of the Keri-edge restaurants.',
      gallery: [{ src: '/images/itinerary/greece/destinations/zakynthos.webp', alt: 'Zakynthos' }],
    },
    {
      id: 'zakynthos-kefalonia-sami',
      routeFrom: 'Zakynthos',
      routeTo: 'Kefalonia (Sami)',
      day: 8,
      shortDescription:
        "About 38 nm north back across the open Ionian to Sami on Kefalonia's east coast. Long passage — depart by 08:00 to arrive before the SW thermal builds. Beam-reach all the way in a steady NW.",
      thingsToDo: [
        'Kayak into the sunlit Melissani sinkhole',
        'Lounge on cinematic Antisamos Beach',
        "Walk Sami's Captain Corelli waterfront",
        'Drive to the Drogarati Cave (15 min inland)',
        'Refuel at the Sami fuel dock',
      ],
      mooringTip:
        'Stern-to on Sami main quay (small fee, water/electric, fuel adjacent — easiest fuel stop in the inner Ionian). Long quay, easy berthing. Sheltered from N–NW. Holding good in 5–8 m mud at the anchorage just east of the harbour.',
      description:
        "Thirty-eight nautical miles north back across the open water — the longest single passage of the week and the reason for the early start. Depart by 08:00 in the early light, sail under the lee of Zakynthos for the first 10 nm, then cross the open channel as the wind builds on the beam. Sami sits on Kefalonia's east coast — a working town that the 2001 film Captain Corelli's Mandolin shot most of its harbour scenes in, with the result that the waterfront has been preserved largely as filmed and the local taverna naming has not exactly resisted the marketing opportunity. The harbour itself is the easiest fuel stop in the inner Ionian — long quay, water and electric, and the diesel pump 30 m from the bow. Melissani Cave is the headline excursion — the sinkhole lake whose collapsed roof lets sunlight column-down onto the water at noon, reachable only by the small boats inside the cave (€8 per head from the visitor centre). Antisamos Beach 5 km north is the swim alternative for the afternoon.",
      gallery: [{ src: '/images/itinerary/greece/destinations/sami-kefalonia.webp', alt: 'Sami' }],
    },
    {
      id: 'sami-fiscardo',
      routeFrom: 'Sami',
      routeTo: 'Fiscardo',
      day: 9,
      mapPin: {
        desktop: { left: 68.9, top: 70.5 },
        mobile: { left: 72.2, top: 70.9 },
      },
      shortDescription:
        "Easy 12 nm north up Kefalonia's east coast to Fiskardo. Pastel neoclassical waterfront, cypress-lined quay, the only village to escape the 1953 earthquake intact. Fiskardo: stern-to on the town quay (free, fills by 14:00 in August — radio Port Police on Ch 12 ahead).",
      thingsToDo: [
        'Walk the cypress-lined Fiskardo quay',
        'Snorkel the Roman-villa ruins at Emplisi',
        'Bakaliaros (salt cod) on the waterfront',
        'Sundowner above the harbour at Tselenti',
        'Dinghy to the cove shipwreck off the entry',
      ],
      mooringTip:
        'Fiskardo: stern-to on the town quay (free, fills by 14:00 in August — radio Port Police on Ch 12 ahead). Foulis Bay 1 nm east is the overflow anchorage — 4–6 m sand, holding good.',
      description:
        "Twelve nautical miles north up the inside of Kefalonia's east coast — straightforward sailing, often under engine in calm afternoon water, with the headland approach to Fiskardo opening from 4 nm out. The village is the only one on the island to escape the 1953 Ionian earthquake (magnitude 7.2, which leveled most of the northern peninsula) intact, and the pastel neoclassical waterfront has been protected by national heritage status since the 1960s — the result is the most-photographed harbour in the inner Ionian and a quay that fills by 14:00 in August. Emplisi Beach 1 nm east holds Roman-villa ruins on the seabed at 3–5 m depth — submerged walls, ceramic shards scattered on the sand, visible without a mask in calm water. The cove shipwreck off the entry channel is the second dinghy excursion. Tselenti on the hillside and Lagoudera on the quay are the dinner picks; bakaliaros (salt cod with skordalia, the Greek lenten plate) is the harbour-side order to finish on.",
      gallery: [{ src: '/images/itinerary/greece/destinations/fiscardo.webp', alt: 'Fiscardo' }],
    },
    {
      id: 'fiscardo-astakos',
      routeFrom: 'Fiscardo',
      routeTo: 'Astakos',
      day: 10,
      shortDescription:
        'About 22 nm east across the channel to mainland Astakos. Working fishing harbour where time slows down — olive farms, tamarisk-shaded quay, and revithada chickpea stew at the family tavernas.',
      thingsToDo: [
        'Walk past olive farms to Kounina Beach',
        'Lunch of revithada with quayside fishermen',
        "Watch the day's catch land at the harbour",
        'Buy thyme honey from the village shop',
        'Sundowner under the tamarisk trees',
      ],
      mooringTip:
        'Stern-to on Astakos town quay (free, basic). Holding fair on 4–6 m mud and weed — set the anchor well, back down to test. Sheltered from N–NW; quiet overnight, occasional katabatic gusts off the Acarnanian mountains in the morning.',
      description:
        "Twenty-two nautical miles east back across the channel onto the mainland Acarnanian coast — a part of Greece almost no charter brochure includes, and a quiet relief after the photo-tourism of Fiskardo. Astakos itself is a working fishing village; the harbour is filled with caïques first and yachts second, the quay is free, and the row of one-table ouzeria along the seafront has not yet caught the international-menu virus. Revithada — chickpea stew slow-cooked overnight in a clay pot with lemon, oregano and olive oil — is the local plate that the inland-Greek tavernas have made their own; the harbour-side restaurants here cook the same dish, but with the morning's fresh fish on the side. Kounina Beach 2 km north of the village is the walk — coastal trail past olive farms and tamarisk groves, with a 200-m strand of fine pebble and clear water shelving steeply to 4 m. Thyme honey from the small village shop is the local takeaway; the bee-keepers run hives on the wild-thyme hillsides above the town.",
      gallery: [{ src: '/images/itinerary/greece/destinations/astakos.webp', alt: 'Astakos' }],
    },
    {
      id: 'astakos-kastos',
      routeFrom: 'Astakos',
      routeTo: 'Kastos',
      day: 11,
      mapPin: {
        desktop: { left: 82.8, top: 57.6 },
        mobile: { left: 84.9, top: 58 },
      },
      shortDescription:
        'Short 8 nm hop south-south-west across to Kastos — long thin island east of Ithaka, population under 50, single village around the small harbour, abandoned stone windmills on the ridge.',
      thingsToDo: [
        'Anchor and swim in Sarakiniko Bay',
        'Climb to the abandoned stone windmills',
        'Homemade lemonade in the fig-tree shade',
        'Walk the donkey path to Kastos Village',
        'Snorkel the Blue Cave on the south side',
      ],
      mooringTip:
        'Stern-to on Kastos Port single quay (free, no services). Tight — 8–10 boats max. Holding fair on 5–7 m sand; drop the anchor well clear and back in. Bombproof in any wind direction; no fuel, no provisioning.',
      description:
        'Eight nautical miles south-south-west across to Kastos — the long, thin island east of Ithaka that holds fewer than 50 year-round residents and the kind of stillness that documents what most of the Ionian was before the 1980s tourism boom. Single village wrapped around the small harbour, single free quay, single fig-tree-shaded taverna at the head of the harbour. The abandoned stone windmills on the ridge above the village are the morning walk — 30 minutes up the donkey path, with the panorama back across to Ithaka opening on the climb; the windmills themselves are roofless but the masonry is intact. Sarakiniko Bay on the south coast is the swim anchorage (4–6 m sand, no road access — the kind of beach you have to yourself unless another charter crew has had the same idea). The harbour kafeneio runs homemade lemonade from the dock-side lemon tree all day; the dinner plate is whatever fish came in that morning. Last fuel and provisioning was Sami three days back — make sure you used it.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kastos.webp', alt: 'Kastos' }],
    },
    {
      id: 'kastos-kalamos',
      routeFrom: 'Kastos',
      routeTo: 'Kalamos',
      day: 12,
      mapPin: {
        desktop: { left: 77, top: 56.3 },
        mobile: { left: 76.5, top: 57 },
      },
      shortDescription:
        'Tiny 4 nm hop east across to Kalamos — pine-clad mountain island, two villages (Episkopi and Port Kalamos), and the headline ghost village at Port Leone, abandoned after the 1953 earthquake.',
      thingsToDo: [
        'Hike or dinghy to the Port Leone ghost village',
        'Swim moonstone-pebble Asprogiali Beach',
        'Climb up to Episkopi village (~45 min)',
        'Savoro vinegar-fried fish at the harbour taverna',
        'Watch the goats come down to the water at dusk',
      ],
      mooringTip:
        'Stern-to on Port Kalamos single quay (small fee, basic — water but no electric). Limited slots — 12 boats max. Holding excellent on 5–8 m sand. Sheltered from N–NW; gusty afternoons in the channel between Kastos and Kalamos.',
      description:
        "Four nautical miles east is the shortest passage of the week — almost not worth setting the main for, usually done under engine in calm afternoon water. Kalamos is the larger neighbour of Kastos: still small, still uncomplicated, but with two villages (the harbour-side Port Kalamos and the higher Episkopi on the ridge), pine forests right down to the water, and the headline ghost village at Port Leone on the north coast. Port Leone is the half-day pilgrimage — an entire stone-built fishing village abandoned after the 1953 earthquake destroyed the spring that supplied its water, never reoccupied, the houses now slowly collapsing into the bay over 70 years. The 90-minute coast walk from Port Kalamos (or the easier dinghy crossing) is the local visit. Asprogiali Beach south of the harbour is the swim stop — moonstone-pebble strand, blue-grey water, the geology of the Pindus range visible at the cliff base. Savoro — vinegar-and-rosemary-fried small fish, a Cretan technique that travelled north — is the harbour taverna's signature plate.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kalamos.webp', alt: 'Kalamos' }],
    },
    {
      id: 'kalamos-preveza',
      routeFrom: 'Kalamos',
      routeTo: 'Preveza',
      day: 13,
      mapPin: {
        desktop: { left: 77.7, top: 52.3 },
        mobile: { left: 81.2, top: 52 },
      },
      shortDescription:
        'About 28 nm north up the inner channel back to Cleopatra Marina (Preveza). Optional Mytikas Beach swim stop on the mainland side, then under the Lefkas Canal swing-bridge for the final approach.',
      thingsToDo: [
        'Last swim at Mytikas Beach golden sand',
        'Restock provisions in Preveza Town',
        'Moussaka and retsina at a marina-front taverna',
        "Walk Preveza's Venetian-arched old town",
        'Refuel at the Cleopatra Marina fuel dock',
      ],
      mooringTip:
        'Berth back at Cleopatra Marina (lazy lines, full services, fee — pre-booked through charter agent). Allow time for the Lefkas Canal swing-bridge — opens on the hour, queue early in August. Refuel before the technical hand-back.',
      description:
        'Twenty-eight nautical miles north back through the inner channel to Cleopatra Marina — straightforward sailing, mostly under engine, with the Lefkas Canal swing-bridge gating the final approach. The 16:00 lift is the standard target on hand-back day; the waiting basin on the south side holds 30+ boats and fills by 15:30 in season. Mytikas Beach on the mainland side north of Mytikas village is the last swim of the week — golden sand at the back of a shallow bay, deep-water anchorage at 5–7 m, sheltered from N–NW. Preveza Town itself is worth the 20-minute walk from Cleopatra Marina — the Venetian-arched old town wraps the seafront, the old market street runs perpendicular to the harbour, and the moussaka-and-retsina row of tavernas along Pantokratoras Street has not yet been priced for tourism. Refuel at the marina fuel dock before 18:00, run laundry through the concierge for next-morning collection, walk into town for the dinner.',
      gallery: [{ src: '/images/itinerary/greece/destinations/parga.webp', alt: 'Preveza' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Preveza',
      routeTo: 'Check-Out',
      day: 14,
      shortDescription:
        "Final morning at Cleopatra Marina. Optional walk through Preveza's Venetian-arched old town and the Pantokratoras seafront. Aktion (PVK) airport is 5 minutes by taxi across the canal.",
      thingsToDo: [
        'Greek coffee on Pantokratoras Street',
        "Walk Preveza's cobblestone old town",
        'Pick up local thyme honey at the market',
        'Last swim at Monolithi Beach to the south',
        'Transfer to Aktion PVK airport (~5 min taxi)',
      ],
      mooringTip:
        'Return to Cleopatra Marina Friday by 18:00 for technical hand-back; sleep aboard, disembark Saturday by 09:00. Direct taxi or 10-minute shuttle to Aktion PVK airport on the same peninsula.',
      description:
        "The technical hand-back at Cleopatra Marina is straightforward — papers signed at reception, fuel receipt logged, clean-time agreed the night before. The morning before the airport transfer is worth filling with the short walk into Preveza: the Venetian-arched old town wraps the seafront for half a kilometre, the Pantokratoras seafront café strip runs the morning coffee circuit, and the small market on the parallel street stocks the local thyme honey and the kalamata olives. Monolithi Beach 5 km south of the town is the longest sand beach in Epirus — a 22-km arc of fine sand backed by pine forest, with the deep-water swimming that you didn't get inside the Ambracian Gulf. The airport (Aktion, PVK) is on the same peninsula as the marina, 5 minutes by taxi or 10 minutes by shuttle — the easiest transfer of any Ionian charter base.",
      gallery: [{ src: '/images/itinerary/greece/destinations/preveza.webp', alt: 'Preveza' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Preveza Kefalonia Zakynthos Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Preveza Kefalonia Zakynthos Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(prevezaKefaloniaZakynthos14DaysRoute);
