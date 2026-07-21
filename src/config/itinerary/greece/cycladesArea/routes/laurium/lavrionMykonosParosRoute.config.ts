import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lavrionMykonosParosRoute: ItineraryRoute = {
  metaTitle: '7-Day Lavrion–Mykonos–Paros Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail from Lavrion via Mykonos to Paros on a yacht charter. Discover iconic nightlife, hidden coves, blue domes & the timeless charm of the Cyclades.',
  id: 'lavrion-mykonos-paros',
  startingPoint: 'Lavrion',
  otherPoints: ['Mykonos', 'Paros'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/lavrion-mykonos-paros.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/mykonos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/paros-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/syros-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/serifos-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'lavrion-kea',
      routeFrom: 'Lavrion',
      routeTo: 'Kea',
      day: 1,
      mapPin: {
        desktop: { left: 9.1, top: 12.8 },
        mobile: { left: 2.3, top: 16 },
      },
      description:
        "From Lavrion's industrial buzz, set sail with the Aegean stretching ahead like a turquoise promise. Kea's emerald slopes rise in a cycladic mystery within hours. Anchor at V ourkari Bay, where fishermen boats float next to elegant yachts. After climbing to the historic stone Lion of Kea, whose mossy eyes watched over the island, plunge into the WWII wreck Brittany at nightfall. At a riverside bara, feast on octopus carpaccio while the harbor lights sparkle like stars.",
      shortDescription:
        'Easy 14 nm shake-down hop out of Lavrion (the Cyclades launch port, 45 min east of Athens airport) to Kea — the closest Cycladic island and the gentlest first-day. Vourkari Bay is the protected charter anchorage; the Lion of Kea (6th-century BC sculpture) sits on the hillside above Ioulida.',
      thingsToDo: [
        'See the 6th-century BC Lion of Kea',
        'Hike to Ioulida hilltop village',
        'Dive the Britannic WWI wreck',
        'Octopus carpaccio at a quayside bar',
      ],
      mooringTip:
        'Vourkari Bay stern-to or anchor on sand at 5-7 m. Sheltered from the Meltemi but watch for sudden gusts off the hill.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-syros',
      routeFrom: 'Kea',
      routeTo: 'Syros (Ermoupolis)',
      day: 2,
      mapPin: {
        desktop: { left: 24.9, top: 16 },
        mobile: { left: 19.1, top: 23 },
      },
      description:
        "Rising to the aroma of freshly made koulouri, sail toward Syros where Cycladic simplicity meets Venetian grandeur. Dock in Ermoupolis, with its pastel homes down to a port covered with marble. Climb Ano Syros' twisting stairs to a cliffside church, bouzouki music floating from blue-door cafes. Sip soumada, or almond milk, at Miaouli Square at nightfall while residents argue politics over little coffee cups.",
      shortDescription:
        'Twenty nautical miles southeast to Syros — administrative capital of the Cyclades, with the only neoclassical Cycladic capital (Ermoupolis), Catholic + Orthodox cathedral district (rare in Greece), and the marble-paved Miaouli Square that hosts free summer orchestra concerts.',
      thingsToDo: [
        'Walk Ermoupolis marble Riva',
        'Climb to Ano Syros (Catholic district)',
        'See a free Miaouli Square concert',
        'Soumada almond milk at a kafeneio',
      ],
      mooringTip: 'Ermoupolis town quay stern-to with own anchor — first-come; the Meltemi can blow into the harbour.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-mykonos',
      routeFrom: 'Syros',
      routeTo: 'Mykonos',
      day: 3,
      mapPin: {
        desktop: { left: 49.2, top: 27.4 },
        mobile: { left: 49.5, top: 27.7 },
      },
      description:
        "Let the Meltemi winds drive you to the 'Island of the Winds,' Mykonos. Dock at MykonosTown, where cobalt domes and sugar-cube homes challenge the unceasing blue of the sea. From the pulsating DJ beats of Paradise to Agios Sostis' secret peace, beach-hop Join the sparkling throng in Little Venice—Aperol spritz in hand—at evening as the sun fades into the Aegean. Pro tip: Early on grab a marina location; this island never sleeps.",
      shortDescription:
        'Easy 14 nm leg east to Mykonos — the most fashionable Cycladic island, with the cobalt-domed Chora town, Little Venice waterfront, and the windmill row above the old port. The neighbouring sacred island of Delos is a UNESCO World Heritage day-trip.',
      thingsToDo: [
        'Day trip to UNESCO Delos',
        "See the Mykonos Cathedral's 5 famous windmills",
        'Sunset Aperol spritz in Little Venice',
        'Beach club at Paradise or Super Paradise',
      ],
      mooringTip:
        'Mykonos new port (Tourlos) — pre-book in summer; old harbour quay is short-stay only. Meltemi can be fierce on the harbour mouth.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
    {
      id: 'mykonos-paros',
      routeFrom: 'Mykonos',
      routeTo: 'Paros (Parikia)',
      day: 4,
      mapPin: {
        desktop: { left: 72.6, top: 27 },
        mobile: { left: 72, top: 29.3 },
      },
      description:
        "Trade the soulful appeal of Paros for Mykonos' glitz. Sail into the whitewashed bay of Parikia, where the fourth-century Panagia Ekatontapiliani church whispers Byzantine mysteries. Wander inland to Lefkes village, with jasmine shaded on stone roads. Later, follow the sunset to Naoussa, a fashion hotspot converted from a fishing port. At a seaside table, dine on astakomakaronada (lobster pasta), the waves singing your dinner.",
      shortDescription:
        'Easy downwind 18 nm leg south to Paros — the geographic centre of the Cyclades and the headline charter base alongside Mykonos. Parikia (capital, the Panagia Ekatontapiliani 4th-century church) and Naoussa (the chic fishing-port-now-resort) are the two main harbours.',
      thingsToDo: [
        'Visit the 4th-century Ekatontapiliani church',
        'Walk the Naoussa pastel waterfront',
        'Day-trip inland to Lefkes village',
        'Astakomakaronada lobster pasta ashore',
      ],
      mooringTip:
        'Parikia town quay stern-to is busy in summer — Naoussa harbour for a quieter overnight; Anti-Paros has restaurant moorings.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-serifos',
      routeFrom: 'Paros',
      routeTo: 'Serifos (Livadi)',
      day: 5,
      mapPin: {
        desktop: { left: 63.1, top: 50.9 },
        mobile: { left: 61.1, top: 49.9 },
      },
      description:
        "Fly southwest to Serifos, where unspoiled beauty rules. Anchor in Livadi's gorgeous crescent bay and climb the donkey trek to Chora, a whitewashed swarm clinging to a volcanic mountain. Lunch in a cliffside taverna on revithada (lemony chickpea stew), the cat of the owner sleeping at your feet. Swim in water that is so clean you will count ten meters down pebbles. Greece is naked—wild, peaceful, absolutely alive.",
      shortDescription:
        "Long 30 nm leg west to Serifos — one of the wildest Cyclades, with a barren volcanic interior and a cliffside Chora rising 200 m above the harbour of Livadi. Population under 1,500 year-round; one of the headline 'pure Cyclades' islands for charter clients escaping Mykonos crowds.",
      thingsToDo: [
        'Climb to Chora cliffside village',
        'Walk the medieval Kastro castle',
        'Swim Livadi crescent-bay shallows',
        'Revithada chickpea stew (Sunday only)',
      ],
      mooringTip: 'Livadi harbour stern-to or anchor on sand at 5-7 m in the bay. Sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/greece/destinations/serifos.webp', alt: 'Serifos' }],
    },
    {
      id: 'serifos-kythnos',
      routeFrom: 'Serifos',
      routeTo: 'Kythnos (Merihas)',
      day: 6,
      mapPin: {
        desktop: { left: 30.5, top: 46 },
        mobile: { left: 29.3, top: 45.4 },
      },
      description:
        "Allow the water to lead you to the understated beauty of the Cyclades, Kythnos. Dock in Merihas' peaceful harbor, where stories of pirate raids and grilled sfoungato (cheese pie) are served from tavernas. Warm the sliver of sand separating two tones of blue at Snorkel Kolona Beach by soaking in Loutra's thermal springs, heated by the ancient fire of the soil. Anchor in Apokrousi Bay at evening; the Milky Way reflects the glitter of the sea.",
      shortDescription:
        'Easy 18 nm coastal leg back northwest to Kythnos — the most under-rated Cycladic island for charter clients, with Kolona Beach (a sandy double-bay isthmus) and the natural thermal springs at Loutra (the only naturally heated mineral baths in the Cyclades).",',
      thingsToDo: [
        'Swim Kolona double-bay isthmus',
        'Soak Loutra thermal springs',
        'Walk Chora cobbled main street',
        'Sfoungato cheese pie at a kafeneio',
      ],
      mooringTip:
        'Merihas town quay stern-to. Anchor in Kolona Bay or Apokrousi Bay on sand at 5-7 m for a quieter night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-lavrion',
      routeFrom: 'Kythnos',
      routeTo: 'Lavrion',
      day: 7,
      mapPin: {
        desktop: { left: 27.4, top: 31.5 },
        mobile: { left: 23.6, top: 33.9 },
      },
      description:
        "Breathe in your last morning at sea while dolphins sprint your bow and Lavrion's shadow shows up. Stop for one last swim at Cape Sounion, the temple guard over the Attica shore. Salt still crusted in your hair, celebrate your trip with ouzo and garlicky taramasalata in a dockside taverna back in port. The islands whisper, 'Efharisto,' as you say you will be back.",
      shortDescription:
        'Final 18 nm leg back northwest to Lavrion. Optional swim stop at Cape Sounion (Temple of Poseidon) — the southernmost tip of Attica with one of the most photographed temple ruins in Greece.',
      thingsToDo: [
        'Optional Cape Sounion stop',
        'Photograph the Temple of Poseidon',
        'Final swim in a Cyclades passage',
        'Pack-and-clean for handover',
      ],
      mooringTip: 'Lavrion Marina is the standard charter base. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lavrion.webp', alt: 'Lavrion' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/map.webp',
        alt: 'Lavrion Mykonos Paros Route Image',
      },
      width: 1147,
      height: 1103,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/mobile-map.webp',
        alt: 'Lavrion Mykonos Paros Route Image',
      },
      width: 1032,
      height: 1165,
    },
  },
};

export default computeItineraryNumberOfDays(lavrionMykonosParosRoute);
