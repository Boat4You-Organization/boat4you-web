import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const athensMykonosParosRoute: ItineraryRoute = {
  metaTitle: '7-Day Athens–Mykonos–Paros Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Athens via Kea, Syros & Mykonos to Paros. Explore iconic towns, hidden coves, island culture & Aegean magic.',
  id: 'athens-mykonos-paros',
  startingPoint: 'Athens',
  otherPoints: ['Mykonos', 'Paros'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/athens-mykonos-paros.webp',
    alt: 'Athens Mykonos Paros',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/mykonos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/paros-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/syros-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/serifos-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'athens-kea',
      routeFrom: 'Athens',
      routeTo: 'Kea',
      day: 1,
      mapPin: {
        desktop: { left: 13, top: 12.3 },
        mobile: { left: 3.6, top: 18.5 },
      },
      description:
        "Start your journey in Athens, drinking thick Greek coffee among the early bustle of Plaka, the Acropolis under protection. Let the salty breeze carry you past the Cape Sounion cliffs, where Poseidon's temple clings to the rocks like a myth come alive. You are sailing. Kea's verdant slopes stand to welcome you by afternoon. Explore the azure seas of Vourkari Bay, then go to a laid-back taverna serving grilled octopus and tales from former fishermen. Trekkers to the ancient stone Lion of Kea will find its silent roar echoing the wild soul of the island as evening paints the heavens.",
      shortDescription:
        'Long 28 nm shake-down from Athens (Alimos Marina) — the largest charter base in Greece by berth count — south past Cape Sounion (Temple of Poseidon, 5th-century BC) to Kea. Vourkari Bay is the protected charter anchorage with the Lion of Kea hilltop sculpture above.',
      thingsToDo: [
        'Pass Cape Sounion Temple of Poseidon',
        'See the 6th-century BC Lion of Kea',
        'Hike to Ioulida hilltop village',
        'Grilled octopus at a Vourkari taverna',
      ],
      mooringTip:
        'Vourkari Bay stern-to or anchor on sand at 5-7 m. Sheltered from the Meltemi but watch for sudden gusts off the hill.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-syros',
      routeFrom: 'Kea',
      routeTo: 'Syros',
      day: 2,
      mapPin: {
        desktop: { left: 39.9, top: 35.1 },
        mobile: { left: 34.7, top: 36.8 },
      },
      description:
        'Get up to smell freshly made tiropita and hear the soft clink of sail rigging. Ahead like a liquid sapphire road is the Aegean. Dolphins dance beside your boat as Syros emerges, Venetian bell towers and pastel palaces challenging the azure horizon. Dock at Ermoupolis, where secret courtyards and great staircases follow marble streets. At sunset, climb to Ano Syros, the whitewashed village shining like an illuminated maze, then toast with a glass of ouzo as bouzouki music erupts from a taverna below.',
      shortDescription:
        'Twenty nautical miles southeast to Syros — administrative capital of the Cyclades, with the only neoclassical Cycladic capital (Ermoupolis), Catholic + Orthodox cathedral district, and the marble-paved Miaouli Square that hosts free summer orchestra concerts.',
      thingsToDo: [
        'Walk Ermoupolis marble Riva',
        'Climb to Ano Syros (Catholic district)',
        'See a free Miaouli Square concert',
        'Ouzo and meze at a backstreet taverna',
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
        desktop: { left: 67.4, top: 52.6 },
        mobile: { left: 67.1, top: 47.9 },
      },
      description:
        'As you hurl toward Mykonos, the "Island of the Winds," feel the Meltemi breezes fill your sails. First to show guard over a labyrinth of sugar-cube homes and fashionable stores are the famous white windmills. Wander along the streets of Mykonos Town, where cobalt doors frame Instagram-perfect scenes. By noon, find a sunbed at Paradise Beach—the pulse of DJ mixed with the sea. Join the sparkling throng in Little Venice as night falls and sip cocktails while the sun sets like a golden coin in the sea.',
      shortDescription:
        'Easy 14 nm leg east to Mykonos — the most fashionable Cycladic island, with the cobalt-domed Chora town, Little Venice waterfront, and the windmill row above the old port. The neighbouring sacred island of Delos is a UNESCO World Heritage day-trip.',
      thingsToDo: [
        'Day trip to UNESCO Delos',
        'See the Mykonos 5 famous windmills',
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
      routeTo: 'Paros',
      day: 4,
      mapPin: {
        desktop: { left: 83.5, top: 50.7 },
        mobile: { left: 85.8, top: 47.2 },
      },
      description:
        "After the celebration yesterday, let Paros calm your soul. Enter Parikia's harbor, where the fourth-century Panagia Ekatontapiliani church murmurs Byzantine secrets. Wander inland to discover communities unspoiled by time, their lanes carpeted with jasmine and elderly men backgammon playing. Later, follow the light to Naoussa, a postcard-perfect fishing harbor where octopuses dry on lines and boats bob near worn-out wooden kaikia. At Kolymbithres, cap the day with a moonlit dip as your toes sink into lunar shapes created from sand carved by wind.",
      shortDescription:
        'Easy downwind 18 nm leg south to Paros — the geographic centre of the Cyclades. Parikia (capital, the Panagia Ekatontapiliani 4th-century church) and Naoussa (the chic fishing-port-now-resort) are the two main harbours.',
      thingsToDo: [
        'Visit the 4th-century Ekatontapiliani church',
        'Walk the Naoussa pastel waterfront',
        'Day-trip inland to Lefkes village',
        'Kolymbithres lunar-rock swim',
      ],
      mooringTip:
        'Parikia town quay stern-to is busy in summer — Naoussa harbour for a quieter overnight; Anti-Paros has restaurant moorings.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-serifos',
      routeFrom: 'Paros',
      routeTo: 'Serifos',
      day: 5,
      mapPin: {
        desktop: { left: 75.2, top: 80.5 },
        mobile: { left: 77.2, top: 70 },
      },
      description:
        "Trade Paros' refined appeal contrasts with Serifos' unvarnished beauty. The island opens out as you get closer: a jagged masterpiece of cliffs and secret coves. Drop anchor in Livadi, where water so clean golden sand meets. You will swear it is liquid glass. Trekking the donkey trail to Chora, a town set like a cubist picture, fall at a hillside taverna. Here the view runs all the way to Sifnos while nonnas serve clay pots of revithada—slow-cooked chickpeas in lemony broth. You dreamed of Greece, and here is that country.",
      shortDescription:
        "Long 30 nm leg west to Serifos — one of the wildest Cyclades, with a barren volcanic interior and a cliffside Chora rising 200 m above the harbour of Livadi. Population under 1,500 year-round; the headline 'pure Cyclades' island.",
      thingsToDo: [
        'Climb to Chora cliffside village',
        'Walk the medieval Kastro castle',
        'Swim Livadi crescent-bay shallows',
        'Revithada chickpea stew (Sunday only)',
      ],
      mooringTip: 'Livadi harbour stern-to or anchor on sand at 5-7 m. Sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/greece/destinations/serifos.webp', alt: 'Serifos' }],
    },
    {
      id: 'serifos-kythnos',
      routeFrom: 'Serifos',
      routeTo: 'Kythnos',
      day: 6,
      mapPin: {
        desktop: { left: 47.6, top: 74.5 },
        mobile: { left: 44.7, top: 65.3 },
      },
      description:
        "Today the sea offers you solitude. Sail south to Kythnos, where thermal springs steam down the coast and goat count exceeds human population. Dock in Merihas, a slumbering port where tavernas present grilled sardines sloshed with lemon. Claim Kolona Beach as your own—a strip of sand between two bays—or swim in Loutra's warm, mineral-rich waves. Anchor in uninhabited Apokrousi Bay, where the Milky Way reflects the gliding sea, as night falls.",
      shortDescription:
        'Easy 18 nm coastal leg back northwest to Kythnos — the most under-rated Cycladic island for charter clients, with Kolona Beach (a sandy double-bay isthmus) and the natural thermal springs at Loutra (the only naturally heated mineral baths in the Cyclades).',
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
      id: 'kythnos-athens',
      routeFrom: 'Kythnos',
      routeTo: 'Athens',
      day: 7,
      mapPin: {
        desktop: { left: 43.1, top: 55.4 },
        mobile: { left: 40.7, top: 51.3 },
      },
      description:
        "Savor the simplicity on your last morning: thick yogurt sloshed with Kythnos honey, the sun warming your shoulders as you plot a return to Athens. Already yearning the cadence of the waves, glide by Hydra's silhouette. As the Acropolis bids farewell, return to Piraeus with salt in your hair and stories in your heart lingering over one last platter of fried calamari.",
      shortDescription:
        'Final 22 nm leg back north into the Saronic Gulf and Alimos Marina (the largest charter base in Greece, in the southern Athens suburbs). Optional Cape Sounion stop for a final Temple of Poseidon view.',
      thingsToDo: [
        'Optional Cape Sounion stop',
        'Photograph the Temple of Poseidon',
        'Final swim in a Cyclades passage',
        'Pack-and-clean for handover',
      ],
      mooringTip:
        'Alimos Marina is the standard charter handover; the largest charter base in Greece by berth count. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alimos.webp', alt: 'Athens' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/mykonos/map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1530,
      height: 1043,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/mykonos/mobile-map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1132,
      height: 1216,
    },
  },
};

export default computeItineraryNumberOfDays(athensMykonosParosRoute);
