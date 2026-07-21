import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const virginGordaAnegadaRoute: ItineraryRoute = {
  metaTitle: 'Virgin Gorda & Anegada: 7-Day BVI Catamaran Itinerary',
  metaDesc:
    'Sail a 7-day BVI catamaran loop from Tortola: The Baths, North Sound, Anegada lobster nights, Scrub Island and Jost Van Dyke. Day-by-day with mooring tips.',
  id: 'virgin-gorda-anegada-route',
  startingPoint: 'Tortola',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/caribbeans/banners/tortola-banner-large.webp',
    alt: 'Tortola route card',
  },
  gallery: [
    {
      src: '/images/itinerary/caribbeans/banners/bvi-banner-large.webp',
      alt: 'British Virgin Islands',
    },
    {
      src: '/images/itinerary/caribbeans/banners/tortola-banner-large.webp',
      alt: 'Tortola',
    },
    {
      src: '/images/itinerary/caribbeans/banners/bvi-sailing-banner.webp',
      alt: 'BVI sailing',
    },
    {
      src: '/images/itinerary/caribbeans/banners/bvi-banner.webp',
      alt: 'BVI',
    },
  ],
  routeDays: [
    {
      id: 'tortola-the-baths',
      routeFrom: 'Tortola (Road Town)',
      routeTo: 'The Baths (Virgin Gorda)',
      day: 1,
      shortDescription:
        "Ease out of Road Town and point the bows up Sir Francis Drake Channel for a lively 12 NM beat to Virgin Gorda. Trade-wind breeze, flat-ish water in the islands' lee, then pick up a national park mooring off The Baths and swim into the boulder grottoes.",
      description:
        "Charter starts easy: finish the chart briefing, top up provisions near Wickham's Cay, and clear Road Harbour by late morning. The 12 NM to Virgin Gorda is a classic Drake Channel beat — trades typically 15–20 knots from the east, so expect a couple of long tacks past Beef Island and the Dog Islands with flat-ish water the whole way. Aim to reach The Baths National Park by early afternoon when the day crowd thins. Anchoring is prohibited here; pick up one of the orange NP mooring balls, dinghy to the swim line, and paddle the last stretch ashore. The trail through the granite boulder grottoes to Devil's Bay takes about 20 minutes with ladders and rope handrails — wear reef shoes and keep cameras in a dry bag. Back on board, motor two miles north to St Thomas Bay off Spanish Town for a settled overnight, with Top of the Baths and the Virgin Gorda Yacht Harbour restaurants an easy taxi or dinghy ride away.",
      thingsToDo: [
        "Swim the granite grottoes at The Baths and follow the ladder-and-rope trail to Devil's Bay",
        "Snorkel the boulder-strewn shallows of Spring Bay, The Baths' quieter neighbour",
        'Climb the hill to Top of the Baths for a rum punch overlooking Drake Channel',
        'Wander the docks and restaurants of Virgin Gorda Yacht Harbour in Spanish Town after dark',
      ],
      mooringTip:
        "The Baths' orange NP balls are day-use only and anchoring is banned — you'll need a BVI National Parks permit, arranged through your charter base. Overnight on a mooring or in 4–6 m of sand at St Thomas Bay off Spanish Town.",
      gallery: [{ src: '/images/itinerary/caribbeans/banners/bvi-banner.webp', alt: 'The Baths, Virgin Gorda' }],
    },
    {
      id: 'the-baths-north-sound',
      routeFrom: 'The Baths',
      routeTo: 'North Sound (Leverick Bay)',
      day: 2,
      shortDescription:
        "Just 10 easy NM today: a relaxed morning close reach past Spanish Town and up Virgin Gorda's leeward coast, then through the buoyed channel off Colquhoun Reef into North Sound — a reef-locked lagoon of superyachts, beach bars and glassy water. Grab a Leverick Bay mooring and settle in.",
      description:
        "No rush this morning — snorkel Spring Bay or The Crawl before the breeze fills in, then work north along Virgin Gorda's leeward side past Spanish Town and the Dog Islands. It's a short close reach in flat water, so let the crew helm. Enter North Sound through the marked channel between Mosquito Island and Colquhoun Reef; leave the Anguilla Point shortcut to shoal-draft locals. Inside, the sound opens into a fully protected lagoon where superyachts share water with kite foilers off Eustatia. Pick up a Leverick Bay mooring and explore by dinghy: Saba Rock, the rebuilt one-island bar and grill, sits five minutes across the water, with the reborn Bitter End Yacht Club just beyond. Ashore at Leverick Bay you'll find fuel, water, ice, a small market and Jumbies beach bar — time it right for Michael Beans' famously silly happy-hour pirate show. Finish with a beach walk on Prickly Pear Island's Vixen Point as the sun drops behind Mosquito Island.",
      thingsToDo: [
        'Dinghy across to Saba Rock for a sundowner at the rebuilt one-acre island bar',
        'Snorkel the coral heads along the reef edge of Eustatia Sound',
        "Catch Michael Beans' happy-hour pirate show at Leverick Bay",
        'Walk the beach at Vixen Point on Prickly Pear Island National Park',
      ],
      mooringTip:
        "Leverick Bay's rental balls can be pre-booked through the BoatyBall app and go fast in season; the marina also offers berths with water and power. Miss out, and there's decent sand to anchor in at 5–8 m north of the mooring field.",
      gallery: [
        { src: '/images/itinerary/caribbeans/banners/bvi-sailing-banner.webp', alt: 'North Sound, Virgin Gorda' },
      ],
    },
    {
      id: 'north-sound-anegada',
      routeFrom: 'North Sound',
      routeTo: 'Anegada',
      day: 3,
      shortDescription:
        "The one everyone talks about: 14 NM of open-water beam reaching from North Sound to Anegada, the BVI's only coral island. It barely clears the horizon — you'll spot palm tops before land — then a buoyed channel leads you through the reef to Setting Point.",
      description:
        "Get the anchor gear stowed and clear North Sound by mid-morning: the run to Anegada wants the sun high when you arrive. Outside the reef the trades swing onto the beam and the cat settles into an effortless 14 NM reach across open water — the first proper ocean sailing of the week. Anegada is a coral atoll rising barely eight metres, so trust the plotter: for the best part of an hour you'll see nothing, then palm trees and casuarinas lift out of the sea. Horseshoe Reef sprawls for miles east of the entrance, so stand well off and line up on the buoyed channel to Setting Point in good light — no arrivals after mid-afternoon. Once you're on a ball, dinghy ashore and book dinner before four o'clock; the beach restaurants along Setting Point, from the Anegada Reef Hotel to the Wonky Dog and Potter's by the Sea, grill their famous lobster to order over open flames.",
      thingsToDo: [
        "Book your lobster dinner at Potter's by the Sea or the Wonky Dog before 16:00",
        "Toast landfall with a cold Painkiller at the Anegada Reef Hotel's beach bar",
        'Wade the flats near Setting Point and watch for tailing bonefish at dusk',
        'Swim off the transom in the glassy shallows inside Horseshoe Reef',
      ],
      mooringTip:
        "Setting Point's moorings are limited and first-come, so arrive early; otherwise anchor west of the field in 2–3 m over grass-flecked sand and make sure the hook digs in. Enter only in daylight with good overhead light — never against late-afternoon glare.",
      gallery: [{ src: '/images/itinerary/caribbeans/banners/bvi-banner-large.webp', alt: 'Anegada' }],
    },
    {
      id: 'anegada-layover',
      routeFrom: 'Anegada',
      routeTo: 'Anegada',
      day: 4,
      shortDescription:
        "Zero NM today — the hook stays down. Rent scooters or flag one of Anegada's open-air taxis for a lap of the island: Loblolly Bay and Cow Wreck Beach for powder sand and reef snorkelling, flamingos on the salt ponds, and one more legendary lobster feast on the beach.",
      description:
        "A lay day, and Anegada rewards it. Ashore by nine, pick up scooters or a rental jeep near the Setting Point dock — or wave down one of the open-sided taxis — and head across the salt ponds to the north shore. Loblolly Bay is the classic: miles of white sand, a beach-bar lunch at the Big Bamboo, and snorkelling straight off the beach where the inner edge of Horseshoe Reef comes alive with parrotfish and rays. Work west to Cow Wreck Beach for a slower afternoon — the bar there pours a dangerous rum punch and the water stays hip-deep for a hundred metres. Stop at the Flamingo Pond lookout on the way back; the pink flock returned in the 1990s and is now hundreds strong. Horseshoe Reef itself is protected, so snorkel the marked beach areas rather than roaming by dinghy. Then it's one more lobster dinner — season runs November to July, so it comes straight from the traps.",
      thingsToDo: [
        'Snorkel the reef edge straight off the sand at Loblolly Bay',
        'Ride a scooter to Cow Wreck Beach for rum punch in hip-deep turquoise water',
        'Spot Caribbean flamingos from the Flamingo Pond lookout',
        'Feast on grilled Anegada lobster on the beach at Setting Point',
      ],
      mooringTip:
        "You're staying put, so check bridle chafe and swing room on your Setting Point ball before heading ashore for the day. If anchored, the 2–3 m sand-and-grass shelf holds well once set, but chop builds across the lagoon when the trades pipe up.",
      gallery: [{ src: '/images/itinerary/caribbeans/banners/bvi-sailing-banner.webp', alt: 'Anegada reefs' }],
    },
    {
      id: 'anegada-scrub-island',
      routeFrom: 'Anegada',
      routeTo: 'Scrub Island',
      day: 5,
      shortDescription:
        "Time the channel exit for morning light, then enjoy the payoff leg: 16 NM of trade-wind beam reaching back south to Scrub Island, the little resort isle off Great Camanoe. Berth in the marina or grab a ball, then it's infinity pool, hot showers and a proper dinner ashore.",
      description:
        "Slip the ball early, retrace the buoyed channel with the morning sun behind you, and set a course south. This is the leg crews remember: 16 NM of open Caribbean with the trades on the beam, both hulls humming at seven knots and Virgin Gorda slowly hardening on the horizon. Aim for the channel between Great Camanoe and Scrub Island, watching the current where it funnels through the cut. Scrub Island Resort, Spa & Marina takes charter cats well over 60 feet, and a berth buys the whole resort: freshwater pools with a swim-up bar, spa treatments, proper showers and laundry if you need them. Snorkel gear rinsed and stowed, walk the ten minutes over the hill to quiet North Beach, or just claim a lounger. Dinner is a step up from beach-bar fare — Donovan's Reef by the docks does easy-going plates and cocktails, while Caravela handles the white-tablecloth end of things.",
      thingsToDo: [
        "Cool off at Scrub Island's tiered pools and swim-up bar",
        'Walk over the hill to North Beach for a quiet swim',
        "Book a treatment at the resort's Ixora Spa",
        'Dinghy to the Marina Cay mooring field for an easy late-afternoon snorkel',
      ],
      mooringTip:
        'Reserve a Scrub Island marina berth ahead in high season — call on VHF 16 or book through the resort, and dockage includes pool and resort access. For a quieter night on a ball, the Marina Cay mooring field is a five-minute motor away.',
      gallery: [{ src: '/images/itinerary/caribbeans/destinations/scrub-island.webp', alt: 'Scrub Island' }],
    },
    {
      id: 'scrub-island-jost-van-dyke',
      routeFrom: 'Scrub Island',
      routeTo: 'Jost Van Dyke',
      day: 6,
      shortDescription:
        "Today you finally sail downwind: 14 NM sliding through the Camanoe and Guana channels, then a lazy run along Tortola's green north shore to Jost Van Dyke. Anchor off White Bay for a Soggy Dollar Painkiller, then shift around to Great Harbour and Foxy's for the evening.",
      description:
        "Drop lines after breakfast and thread the cut between Great Camanoe and Guana Island — if the swell is down, hang on a national park day ball at Monkey Point for a snorkel with turtles and clouds of fry before the main event. From there the trades go aft and the cat rolls into a gentle downwind run past Brewers Bay and Cane Garden Bay, Tortola's north shore sliding by to port. Close on Jost Van Dyke by early afternoon and nose into White Bay through the marked gaps in the reef. This is the home of the Painkiller: the Soggy Dollar Bar has no dock, so swim your bar money ashore the traditional way, or beach the dinghy near Hendo's Hideout next door. White Bay gets rolly and crowded by dusk, so round the corner to Great Harbour, take a mooring, and give the evening to Foxy's Tamarind Bar — calypso, barbecue and stories from one of the Caribbean's great institutions.",
      thingsToDo: [
        'Swim ashore for an original Painkiller at the Soggy Dollar Bar',
        'Snorkel with turtles off Monkey Point on Guana Island en route',
        "Catch live calypso and barbecue at Foxy's Tamarind Bar in Great Harbour",
        "Taxi out to the Bubbly Pool, Jost's natural sea-foam jacuzzi, if the north swell is running",
      ],
      mooringTip:
        "Anchoring space inside White Bay's reef is tight, 2–3 m over sand — treat it as a lunch stop only. Overnight on a rental mooring in Great Harbour, where thin grass-over-sand holding makes the ball a better bet than the anchor.",
      gallery: [{ src: '/images/itinerary/caribbeans/destinations/jost-van-dyke.webp', alt: 'Jost Van Dyke' }],
    },
    {
      id: 'jost-van-dyke-tortola',
      routeFrom: 'Jost Van Dyke',
      routeTo: 'Tortola (Road Town)',
      day: 7,
      shortDescription:
        'A short 8 NM farewell leg: reach across to Sandy Cay for one last swim on a postcard sandbar, then slide through Thatch Island Cut and along Sir Francis Drake Channel to Road Town. Fuel up, drop the mainsail one final time and check out with salt in your hair.',
      description:
        "Save room for one more perfect stop. It's a short morning reach from Great Harbour to Sandy Cay, the uninhabited national park islet that looks Photoshopped from every angle — pick up a day ball, swim the ring of white sand and walk the fifteen-minute loop trail through sea grape to the low summit. From there, ride the current through Thatch Island Cut past Soper's Hole, then turn up Sir Francis Drake Channel for the last stretch to Road Town; with the trades on the nose, most crews motorsail the final miles and use the time to strip beds and gather gear. Call your base for fuel-dock instructions before entering Road Harbour — queues build near check-out time — and have paperwork and the snorkel-gear count ready. Most charters want the boat back by mid-morning, so confirm the deadline the night before. Then it's one last Painkiller at the marina bar and the slow, happy walk back to real life.",
      thingsToDo: [
        'Take a final swim off the sandbar at Sandy Cay National Park',
        "Photograph Soper's Hole's pastel waterfront as you round West End",
        'Tick off fuel, water and the equipment count before base check-out',
        'Toast the loop with a farewell lunch on the Road Town waterfront',
      ],
      mooringTip:
        "Sandy Cay's day balls are first-come, with sand at 3–5 m for anchoring — day use only, and skip it entirely in a north swell. Back in Road Harbour, call your base on VHF for fuel-dock and berthing instructions rather than improvising a slip.",
      gallery: [{ src: '/images/itinerary/caribbeans/destinations/tortola.webp', alt: 'Tortola' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/caribbeans/bvi-itinerary/map.webp',
        alt: 'BVI Route map',
      },
      width: 1222,
      height: 1116,
    },
    mobile: {
      image: {
        src: '/images/itinerary/caribbeans/bvi-itinerary/map.webp',
        alt: 'BVI Route map',
      },
      width: 1222,
      height: 1116,
    },
  },
};

export default computeItineraryNumberOfDays(virginGordaAnegadaRoute);
