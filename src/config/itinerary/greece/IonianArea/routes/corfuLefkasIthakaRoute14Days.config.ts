import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const corfuLefkasIthaka14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Corfu–Lefkas–Ithaka Yacht Charter Route | Ionian Sailing',
  metaDesc:
    'Sail a 14-day yacht charter from Corfu through Lefkas and Ithaka. Paxos, Antipaxos, Meganisi, Kefalonia and the Diapontia outliers across two weeks in the Ionian.',
  id: 'corfu-lefkas-ithaka-14-days',
  startingPoint: 'Corfu',
  otherPoints: ['Lefkas', 'Ithaka (14 Days)'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/corfu-lefkas-ithaka.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/mourtos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/corfu-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/mourtos-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/corfu-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'corfu-paxos',
      routeFrom: 'Corfu (Gouvia Marina)',
      routeTo: 'Paxos (Gaios Harbor)',
      day: 1,
      mapPin: {
        desktop: { left: 40.1, top: 10.3 },
        mobile: { left: 26.5, top: 12.1 },
      },
      shortDescription:
        'Roughly 30 nm south down the Corfu Channel from Gouvia Marina to Gaios on Paxos. Pleasant beam reach once clear of the harbour; arrive by mid-afternoon before the inner basin fills with charter boats from the Albanian side.',
      thingsToDo: [
        'Tender through the Tripitos rock arch off Gaios',
        'Coffee on the Venetian-blue waterfront',
        'Order ladotyri cheese with island olive oil',
        'Walk the cobbles to Panagia islet at dusk',
        'Dinner of grilled sea bream on the inner quay',
      ],
      mooringTip:
        'Lazy-line stern-to on Gaios town quay (small fee, water). Tight basin — radio Port Police before 15:00 in July/August. If full, drop on sand in Mongonissi cove (2 nm south, 4–6 m) or pick up a free buoy off Lakka.',
      description:
        "Cast off from Gouvia Marina and pick up the SW thermal as it builds along Corfu's east coast. Thirty nautical miles south, Paxos opens up: a chain of olive-green slopes that look modest from offshore and improbable up close. Gaios is the headline port — a Venetian-blue inlet defended by two tiny islets (Agios Nikolaos and Panagia) that turn the approach into a narrow corridor. The town itself wraps the inner quay with low stone houses, the kind of waterfront that has changed very little since the 17th-century campiello layout. Pick a taverna on the inner basin once the lines are set; ladotyri cheese matured in olive oil is the local plate worth asking for. Tomorrow's hop to Antipaxos is short — no need to rush dinner.",
      gallery: [{ src: '/images/itinerary/greece/destinations/gaios.webp', alt: 'Gaios' }],
    },
    {
      id: 'paxos-antipaxos',
      routeFrom: 'Paxos',
      routeTo: 'Antipaxos',
      day: 2,
      mapPin: {
        desktop: { left: 50.5, top: 26.7 },
        mobile: { left: 40.8, top: 28 },
      },
      shortDescription:
        'Day-anchor leg of about 4 nm south to Antipaxos. Voutoumi and Vrika bays are the headline stops — white-sand seabed under 3–7 m of water that reads as turquoise from the deck. Back to Paxos for the night; no overnight harbour on Antipaxos.',
      thingsToDo: [
        'Anchor at Voutoumi for a long midday swim',
        'Hike up to a hillside vineyard for Verdea',
        'Lunch of lobster spaghetti at the Voutoumi taverna',
        'Paddleboard the rocky coast across to Vrika',
        'Photograph the cliff caves on the west coast',
      ],
      mooringTip:
        'Free anchor in Voutoumi or Vrika (3–7 m sand, holding excellent). No overnight allowed — clear back to Gaios, Mongonissi or Lakka before sundown. If a SE swell builds, leave early; both bays open south.',
      description:
        "A four-nautical-mile drift south brings you onto Antipaxos, which charter crews tend to oversell as 'the Caribbean of the Ionian' — the comparison is unkind to both. The water clarity is genuine: sand seabed, 3–7 m depth, no posidonia patches, sunlight that hits the bottom and bounces back as the aqua-turquoise you see in every aerial shot of the island. Drop the hook in Voutoumi for the long midday swim — there's one taverna on the beach with a few outdoor tables and a lobster pasta that earns its price. The hillside vineyard above Vrika produces Verdea, the white-and-amber blend that doesn't travel; this is the only place you'll drink it. Photograph the west-coast cliff caves on the way back to Paxos before you lose the light.",
      gallery: [{ src: '/images/itinerary/greece/destinations/antipaxos.webp', alt: 'Antipaxos' }],
    },
    {
      id: 'antipaxos-lefkas',
      routeFrom: 'Antipaxos',
      routeTo: 'Lefkas',
      day: 3,
      mapPin: {
        desktop: { left: 53.6, top: 30.4 },
        mobile: { left: 48.8, top: 31.9 },
      },
      shortDescription:
        'Long 40 nm passage south-east to Nydri on Lefkas. Open Ionian crossing — leave by 08:00, lunch under sail with the afternoon W thermal on the beam, drop at Nydri before the breeze stiffens above 18 kn.',
      thingsToDo: [
        'Mid-passage swim stop at Kastos or Kalamos',
        'Tour Skorpios anchorage on the approach',
        'Sofrito veal at a Nydri waterfront taverna',
        'Walk the Nydri Waterfalls trail (1 hr return)',
        'Coffee at a quayside kafenio',
      ],
      mooringTip:
        'Stern-to on Nydri town quay (small fee, water/electric). Holds 20+ boats but fills by 16:00 in season. Alternative: Tranquil Bay (1 nm south, 5–8 m sand) or the small Vlicho marina 2 nm further south.',
      description:
        "Forty nautical miles is a long day for the Ionian — most weeks won't ask for it — but Antipaxos to Lefkas crosses open water with no realistic intermediate. Plan to be off the hook by 08:00, sail south under the lee of Paxos, then bend east toward Kastos or Kalamos for a mid-day swim once you're across the channel. The afternoon W thermal usually fills in around 13:00; if it builds above 18 kn (rare but possible) you'll want the bow already pointing at Lefkas. Nydri is a working town — busy in summer, water-taxi loud, but the quay is straightforward and the tavernas know charter routine cold. Skorpios anchorage just to the north is worth the detour if you arrive with daylight in hand; Onassis's old retreat still has the rope cordon around the landing.",
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
    {
      id: 'lefkas-meganisi',
      routeFrom: 'Lefkas',
      routeTo: 'Meganisi',
      day: 4,
      mapPin: {
        desktop: { left: 68.6, top: 45.2 },
        mobile: { left: 68.1, top: 45.1 },
      },
      shortDescription:
        'Easy 6 nm shake-day across the channel to Meganisi. Three main bays — Spartochori, Vathy and Porto Atheni — all line-of-sight from each other. Pick the bay you sleep in by lunch.',
      thingsToDo: [
        'Snorkel inside the Papanikolis WWII sub cave',
        'Climb the staircase to Spartochori village',
        'Grilled octopus on the Atheni Bay quay',
        'Dinghy circumnavigation of Skorpios',
        'Swim stop at a south-coast pebble cove',
      ],
      mooringTip:
        'Restaurant moorings in Vathy, Atheni and Spilia bays — pay for dinner, the buoy is free. Vathy small marina (lazy lines, fee) is the formal alternative. Holding good on 4–8 m sand throughout; bombproof in N–NW.',
      description:
        "A six-nautical-mile hop is almost not worth setting the main for, but Meganisi rewards the short day. The island sits opposite Nydri across a channel barely a mile wide and packs three deep, well-sheltered bays into a coastline you can drive round in an hour. Papanikolis Cave on the western tip is the easy highlight — a WWII submarine pen the Greek navy used to hide from German aerial patrols, now a 10-minute dinghy tour. Spartochori village climbs the cliffs above the western bay; the stair-walk up earns the view back across to Lefkas. The bay-side tavernas (Niagas in Atheni, Errikos in Vathy) run restaurant moorings — book ashore in the morning, the buoy comes free with dinner. Settle on which bay you'll sleep in by lunch and the afternoon is yours.",
      gallery: [{ src: '/images/itinerary/greece/destinations/meganisi.webp', alt: 'Meganisi' }],
    },
    {
      id: 'meganisi-kefalonia',
      routeFrom: 'Meganisi',
      routeTo: 'Kefalonia',
      day: 5,
      mapPin: {
        desktop: { left: 72.6, top: 52.6 },
        mobile: { left: 76.8, top: 52.3 },
      },
      shortDescription:
        'About 18 nm south to Fiskardo on the northern tip of Kefalonia. Asos and Myrtos Beach sit further down the west coast (only by car). Fiskardo itself is the most photographed harbour in the Ionian.',
      thingsToDo: [
        'Walk the pastel neoclassical waterfront',
        'Drive south to Myrtos Beach overlook',
        'Visit Melissani underground lake (cave)',
        'Snorkel the cove shipwreck off Emplisi',
        'Sundowner at Tselenti hillside taverna',
      ],
      mooringTip:
        'Fiskardo town quay (free, fills by 14:00 in August). Foulis Bay 1 nm south is the formal overflow — 4–6 m sand, holding good. Radio Fiskardo Port on Ch 12 in mid-summer; tight basin and the wash from passing yachts can be heavy.',
      description:
        'Eighteen nautical miles south takes you onto Fiskardo, the only village on Kefalonia to escape the 1953 earthquake intact. The whole northern peninsula was rebuilt from rubble in the years after; Fiskardo was spared, and the result is a row of pastel neoclassical houses on a tight inner harbour that has been photographed enough to become its own genre. The town quay is free but fills hard in summer — radio Port Police on Ch 12 before 13:00 or fall back to the anchorage in Foulis Bay (4–6 m sand, 1 nm south). If you have a car booked, the run to Myrtos Beach is worth the half-day; the limestone cliffs above the crescent are the headline image of the island. Melissani Cave, the sinkhole lake near Sami, is the other half-day inland excursion. Dinner at Tselenti or Lagoudera on the harbour.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kefalonia.webp', alt: 'Kefalonia' }],
    },
    {
      id: 'kefalonia-ithaka',
      routeFrom: 'Kefalonia',
      routeTo: 'Ithaka (Frikes Harbor)',
      day: 6,
      mapPin: {
        desktop: { left: 64.5, top: 61 },
        mobile: { left: 62.9, top: 63.4 },
      },
      shortDescription:
        'Short 5 nm crossing east to Frikes on Ithaka. Tiny working-port quay under a windmill, less crowded than Vathy or Kioni further south. Octopus stifado at the harbour-front taverna is the lunch waypoint.',
      thingsToDo: [
        'Walk inland to Stavros for the Odysseus museum',
        'Hike the goat path north to Kioni',
        'Swim at Polis Bay (1 nm south)',
        'Robola wine flight at a quayside ouzeri',
        'Sundowner under the harbour windmill',
      ],
      mooringTip:
        'Frikes town quay stern-to with own anchor (free, no services). Holds 8–10 boats — tight but manageable. Overflow at Kioni 2 nm south (also free) or the anchorage in Polis Bay (5–7 m sand). Bombproof shelter in all but a strong S/SE.',
      description:
        "Five nautical miles east drops you onto Frikes, the smallest of Ithaka's three charter ports and the one most charter crews skip in favour of Vathy. It's a working harbour — fishing boats first, yachts second — with a windmill on the headland and a row of tavernas where the kitchens still cook the catch the same morning. The octopus stifado at the harbour-front taverna (Symposium, Penelope) is the local plate worth ordering. Inland, the Stavros archaeological site preserves what's claimed to be the foundation of Odysseus's palace; the Ithaka Archaeological Museum at the same village explains why the attribution still draws disagreement. Walk the goat path north to Kioni for the afternoon if you have the legs — 45 minutes each way, easier than it looks on the map. Sundowner back under the windmill.",
      gallery: [{ src: '/images/itinerary/greece/destinations/ithaka.webp', alt: 'Ithaka' }],
    },
    {
      id: 'ithaka-lefkas',
      routeFrom: 'Ithaka',
      routeTo: 'Lefkas (Nidri Port)',
      day: 7,
      mapPin: {
        desktop: { left: 69.2, top: 60.8 },
        mobile: { left: 71.3, top: 60.5 },
      },
      shortDescription:
        'About 14 nm north back up the Meganisi Channel to Nydri. Optional Skorpios anchorage swim stop on approach. Mid-week reset point — provisioning, laundry, fuel for the second leg.',
      thingsToDo: [
        'Anchor and swim off Skorpios beach',
        'Refuel at the Nydri fuel dock',
        'Restock provisions at Nydri SuperMarket',
        'Run laundry at the Nydri laundromat',
        'Mezedopoleio dinner with live laouto',
      ],
      mooringTip:
        'Nydri town quay stern-to (small fee, water/electric, fuel adjacent). Easy berthing — long quay, plenty of slots, but books out by 17:00 in August. Tranquil Bay 1 nm south as the quiet overnight alternative on 5–8 m sand.',
      description:
        "Fourteen nautical miles north is a comfortable afternoon under the lee of Lefkas's east coast. If the weather has been kind, the Skorpios anchorage on the way through is worth the swim stop — the small western beach is the only legal landing on the island, but the water around the cape is open to anyone. Nydri itself is the mid-week reset: it's busy and slightly touristy, and that's exactly what you want when the laundry, the fuel dock, the provisioning supermarket and the Vodafone shop are all within 200 m of the quay. The mezedopoleia on the harbour front run live music (laouto, bouzouki, occasional violin) most evenings in July–August; pick one with a covered courtyard at the back. Bunker fuel before 18:00 so you have a clear next morning.",
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas-nidri-port.webp', alt: 'Lefkas' }],
    },
    {
      id: 'lefkas-parga',
      routeFrom: 'Lefkas',
      routeTo: 'Parga',
      day: 8,
      description:
        'Twenty-five nautical miles north up the Epirus mainland coast to Parga. The leg requires the Lefkas Canal bridge — it opens on the hour, every hour, so plan an 08:00 or 09:00 cast-off and queue early; the basin north of the bridge can hold 30+ boats and the marineros move them through methodically. Once clear, a beam reach on the SW thermal carries you up the mainland past Sivota to Parga. The town itself climbs a hillside under a 14th-century Venetian castle, with pastel houses staggered down to the bay. Anchor off Valtos Beach 1 nm west for the swim stop, then move into the town anchorage or pick up a free buoy off Krioneri for the night. Saganaki prawns at any of the harbour-side tavernas; the sunset from the castle ramparts is the cliché walk and earns its reputation.',
      shortDescription:
        'About 25 nm north up the mainland Epirus coast to Parga. Allow time for the Lefkas Canal bridge — opens on the hour. Beam-reach run with the SW thermal up the coast; arrive by mid-afternoon for the castle walk before dinner.',
      thingsToDo: [
        'Swim at Valtos Beach turquoise shallows',
        'Climb to the Venetian castle for sunset',
        'Saganaki prawns on a quayside table',
        'Walk the lantern-lit old-town stairs',
        'Coffee at the Krioneri beach café',
      ],
      mooringTip:
        'Anchor in Parga bay (5–10 m sand, holding good) or stern-to on the small town quay (limited slots). Exposed to S–SW — shift round to Valtos cove (1 nm west) if a southerly is forecast.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
    {
      id: 'parga-sivota',
      routeFrom: 'Parga',
      routeTo: 'Sivota',
      day: 9,
      mapPin: {
        desktop: { left: 59.1, top: 25.7 },
        mobile: { left: 57.2, top: 25.8 },
      },
      shortDescription:
        'About 14 nm north back down the Epirus coast to Sivota (Syvota). Cypress-fringed horseshoe bay and the Blue Lagoon islets — calm sailing, perfect long lunch stop on approach.',
      thingsToDo: [
        'Snorkel the Blue Lagoon between the islets',
        'Lunch of bourdeto fish stew on the quay',
        'Dinghy beach-hop to Bella Vraka sandbar',
        'Mastiha cocktail nightcap on the seafront',
        'Pine walk above Mega Trafos cove',
      ],
      mooringTip:
        'Stern-to on Sivota town quay (small fee, water/electric) or anchor off Bella Vraka (5–8 m sand). Sheltered from N–NW; mostly bombproof for an overnight. Crowded on weekends — radio Port Police on Ch 9.',
      description:
        'Fourteen nautical miles north drops you onto Sivota — confusingly named the same as the Sivota on Lefkas, but a different and much smaller mainland village a short hop from Parga. The headline feature is the Blue Lagoon, a 200-m gap between Mavro Oros and Mourtemeno islets where the water turns the cliché shade of turquoise that earns the name. Anchor in 5–8 m sand off Bella Vraka for the long swim stop; the sandbar between the islets is the photogenic backdrop. Move into the town quay for the night — small fee, water and electric, and a row of harbour-side tavernas that run bourdeto (spicy scorpionfish stew) as the signature plate. The walk along the pine path above Mega Trafos cove fills an hour before dinner.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sivota.webp', alt: 'Sivota' }],
    },
    {
      id: 'sivota-sagiada',
      routeFrom: 'Sivota',
      routeTo: 'Sagiada',
      day: 10,
      mapPin: {
        desktop: { left: 54.4, top: 19.7 },
        mobile: { left: 48.4, top: 18.7 },
      },
      shortDescription:
        'About 18 nm north up the mainland to Sagiada at the Albanian border. Working fishing village, Kalamas River wetland reserve just south. Authentic, far from the Corfu tourist track.',
      thingsToDo: [
        'Sunrise birdwatching at Kalamas Delta',
        'Walk the Sagiada working fishing harbour',
        'Try mussels at a quayside ouzeri',
        'Day-trip to Bouthrotum ruins (Albania)',
        'Sundowner over the Albanian coastline',
      ],
      mooringTip:
        'Small fishing-port quay — first-come, free, basic. Cross-border to Albania is permitted with a pre-arranged transit log (lodge with the marina office in Corfu before sailing). Wind shelter excellent in any direction.',
      description:
        "Eighteen nautical miles north along the mainland brings you to Sagiada — a working fishing village on the very edge of Greece, with the Albanian border 2 nm further north and the Kalamas River wetland reserve just south of the harbour. The contrast with Corfu's marinas is the point: a quay full of working caïques, a row of one-table ouzeria, and a quietness that makes the chart make sense — this side of the channel was always the poor relation of the island opposite. The Kalamas Delta is the local headline for birdwatching; the dawn slot brings flamingos and herons across the reedbeds, and the boardwalk from the village south runs the edge of the reserve. If your transit log is in order, the ferry to Bouthrotum on the Albanian side puts you at one of the Mediterranean's best-preserved Hellenistic-Roman sites within an hour.",
      gallery: [{ src: '/images/itinerary/greece/destinations/sagiada.webp', alt: 'Sagiada' }],
    },
    {
      id: 'sagiada-ereikoussa',
      routeFrom: 'Sagiada',
      routeTo: 'Ereikoussa',
      day: 11,
      mapPin: {
        desktop: { left: 50.6, top: 10 },
        mobile: { left: 44.3, top: 9.7 },
      },
      shortDescription:
        'About 12 nm offshore to Ereikoussa, smallest of the Diapontia Islands. Population under 50 year-round, one harbour, one beach, two tavernas. Unpolished Greece, the kind that disappeared from Corfu in the 1980s.',
      thingsToDo: [
        'Hike to the hilltop chapel',
        'Walk Bragini sandy beach',
        'Optional 4 nm sail west to Othonoi',
        'Bianco garlic-fish stew at a family taverna',
        'Late raki at the kafeneio',
      ],
      mooringTip:
        'Ereikoussa harbour quay is small — first-come, free. Anchor on sand off the main beach at 4–6 m, sheltered from S/SE. No fuel, no provisioning — top up at Corfu Town before crossing.',
      description:
        'Twelve nautical miles offshore lifts you out of mainland Greece and onto the Diapontia cluster — three small islands northwest of Corfu (Ereikoussa, Othonoi, Mathraki) that sit closer to Italy than to Athens and read like a different country. Ereikoussa is the smallest and the most accessible — one harbour, one beach (Braghini, cedar-shaded), two tavernas, fewer than 50 year-round residents. The hilltop chapel reached by a 40-minute walk gives you the panorama back across the Strait of Otranto on a clear day; in the right light you can see the Albanian mountains and the Salentine peninsula in Italy at the same time. Othonoi 4 nm west is the optional add-on for the afternoon — the legendary cave of Calypso is on the south coast, with a small harbour and two more tavernas. Back to Ereikoussa for the night; raki and dominoes at the harbour kafeneio is the local evening.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ereikoussa.webp', alt: 'Ereikoussa' }],
    },
    {
      id: 'ereikoussa-kassiopi',
      routeFrom: 'Ereikoussa',
      routeTo: 'Kassiopi',
      day: 12,
      mapPin: {
        desktop: { left: 23.2, top: 2.6 },
        mobile: { left: 7.2, top: 2.5 },
      },
      shortDescription:
        "About 16 nm south-east to Kassiopi on Corfu's northern tip. Harbour village at the foot of a 13th-century Byzantine castle. Albanian coast 1.5 nm across the strait; Mount Pantokrator (906 m) behind the village.",
      thingsToDo: [
        'Walk the Byzantine castle ruins above the bay',
        'Swim at smooth-pebble Bataria Beach',
        'Hike the Mount Pantokrator trail',
        'Pastitsada beef stew at a plane-shaded taverna',
        'Sundowner at the Avlaki beach taverna',
      ],
      mooringTip:
        'Kassiopi small harbour quay — pre-book in summer (charter agents handle this). Avlaki Bay 1 nm east is the standard overflow anchorage on sand at 4–6 m, sheltered from N.',
      description:
        "Sixteen nautical miles south-east brings you back to the Greek side and onto Kassiopi, the harbour village wrapped around the headland under a 13th-century Byzantine fortress. The castle itself is ruined — the Venetians dismantled the upper walls in 1386 to prevent the Genoese reusing it — but the bailey and the lower fortifications are intact and walkable. The village quay is small (8–10 boats stern-to with own anchor) and gets pre-booked in season; if your charter agent hasn't held a slot, drop in Avlaki Bay 1 nm east, 4–6 m sand, sheltered from anything except a strong NE. The pastitsada — cinnamon-spiced beef stew on bucatini — at the plane-shaded tavernas in the upper village is the local plate. The Pantokrator trail from the village reaches the 906-m summit with the monastery view across Albania and back over the entire island.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kassiopi.webp', alt: 'Kassiopi' }],
    },
    {
      id: 'kassiopi-corfu',
      routeFrom: 'Kassiopi',
      routeTo: 'Corfu (Gouvia Marina)',
      day: 13,
      mapPin: {
        desktop: { left: 40.2, top: 3.4 },
        mobile: { left: 26.4, top: 3.7 },
      },
      shortDescription:
        'About 12 nm south down the Corfu east coast back to Gouvia Marina. Optional Paleokastritsa detour around the western tip (where Homer placed the shipwreck of Odysseus). Final-night dinner in the UNESCO Old Town.',
      thingsToDo: [
        'Optional Paleokastritsa cliff-coast swim',
        'Walk the UNESCO-listed Old Town Liston',
        'Tour the Old Fortress at sunset',
        'Sofrito veal stew at a Liston arcade taverna',
        'Last kumquat liqueur at the Old Port',
      ],
      mooringTip:
        'Gouvia Marina is the standard final-night berth — full services, fuel adjacent, taxi rank for next-day handover. Corfu NAOK quay opposite the Old Fortress is the short-stay alternative for dinner ashore — no overnight.',
      description:
        "The final passage day is mercifully short — twelve nautical miles south brings you back into Gouvia Marina, with the rest of the day for the UNESCO-listed Old Town across the bay. If you have the legs and the weather, the detour round the northwest tip to Paleokastritsa is worth a half-day; the limestone coves at Agios Spyridon and the cliff-cliff approach to the Theotokos monastery sit on the headland where Homer placed Odysseus's shipwreck on the Phaeacian shore. Otherwise, fly straight south, berth at Gouvia by mid-afternoon, taxi into Corfu Old Town for the evening. The Liston arcades (French neoclassical, built under Napoleon's occupation in 1807) line the side of the Spianada square opposite the Old Fortress; pick a Liston-side taverna for sofrito (veal in white wine and garlic) and finish with kumquat liqueur from a shop on N. Theotoki street. The Old Fortress sound-and-light show runs from 21:00 in summer.",
      gallery: [{ src: '/images/itinerary/greece/destinations/corfu.webp', alt: 'Corfu' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Corfu',
      routeTo: 'Check-out',
      day: 14,
      shortDescription:
        'Final morning at Gouvia Marina. Optional walk in Corfu Town: cricket on the Spianada (the largest square in the Balkans), cappuccino at Café Liston, kumquat liqueur shopping on N. Theotoki street.',
      thingsToDo: [
        'Cappuccino under the Liston arcades',
        'Walk the Spianada (largest square in the Balkans)',
        'Visit the Corfu Asian Art Museum',
        'Pick up local olive-oil soap as a parting gift',
        'Pack-and-clean for technical hand-back',
      ],
      mooringTip:
        'Gouvia Marina handover — confirm fuel slot and clean-time with base manager the evening before. Boat back by 09:00 Saturday for the technical hand-over; airport transfer (CFU, ~20 min by taxi) from the marina gate.',
      description:
        'The technical hand-back at Gouvia is straightforward — fuel slot booked the night before, clean-time agreed with the base manager, papers signed at reception. If you have the morning free, the run into Corfu Town is a 15-minute taxi and worth the effort: the Spianada (the largest public square in the Balkans) hosts cricket matches under the Old Fortress most summer Sundays, the Asian Art Museum in the Palace of Saints Michael and George holds the best Indian and Chinese collection in Greece, and Café Liston on the arcades does the cappuccino-and-loukoumades breakfast as well as anyone in town. Pick up olive-oil soap on the way back to the marina; the Corfu Soap Factory shop on the Liston is the local outlet. Airport transfer (CFU, ~20 min) directly from Gouvia gate.',
      gallery: [{ src: '/images/itinerary/greece/destinations/corfu-town.webp', alt: 'Corfu' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Corfu Lefkas Ithaka 14 Days Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Corfu Lefkas Ithaka 14 Days Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(corfuLefkasIthaka14DaysRoute);
