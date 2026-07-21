import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const zakynthosRoute: ItineraryRoute = {
  metaTitle: '7-Day Zakynthos Yacht Charter Route | Ionian Sailing',
  metaDesc:
    'Sail a 7-day yacht charter round Zakynthos. Navagio Shipwreck Cove, the Cape Skinari Blue Caves, Marathonisi turtle lagoon and Keri sea cliffs across one Ionian week.',
  id: 'zakynthos',
  startingPoint: 'Zakynthos',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/zakynthos.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/zakynthos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/zakynthos-town-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/zente-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/zakynthos-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'zakynthos-keri-bay',
      routeFrom: 'Zakynthos Town',
      routeTo: 'Keri Bay',
      day: 1,
      mapPin: {
        desktop: { left: 68.6, top: 85.6 },
        mobile: { left: 67.8, top: 85.1 },
      },
      shortDescription:
        'Roughly 12 nm south down the Zakynthos east coast to Keri Bay. Easy shake-down day under the lee of the island; arrive by early afternoon for the limestone-cave dinghy tour and a long sheltered anchorage night.',
      thingsToDo: [
        'Dinghy the Keri sea caves at golden hour',
        'Climb to the Keri lighthouse viewpoint',
        'Swim under the limestone arches off the cape',
        'Visit the natural-asphalt Keri tar springs',
        'Saganaki flame-cheese at a cliffside taverna',
      ],
      mooringTip:
        'Anchor free in Keri Bay on sand at 5–8 m — excellent holding, well sheltered from the prevailing N–NW. Drop early in August; the bay fills with day-tripper boats by 18:00. Watch for weed patches on the eastern edge — back down to test the set.',
      description:
        "First passage of the week — out of Zakynthos Town and 12 nautical miles south down the east coast under the lee of the island. The wind is forgiving on day one (SW thermal on the beam, rarely above 12 kn this side), and the bay opens out at Cape Keri with the limestone cliffs rising 80 m straight from the water. Keri Bay itself is the headline anchorage of the south coast — natural-asphalt tar springs at the back of the bay (the geological curiosity that supplied caulking pitch to ancient Mediterranean shipyards from Homer's time onward), the lighthouse on the cape with the long view across the strait to the Peloponnese, and a string of cliffside tavernas above the anchorage. The sea caves on the cape itself are the dinghy tour — limestone arches that filter sunlight onto the seabed and turn the water inside the chambers a hard electric blue. Saganaki — flame-flambéed feta or kefalograviera, doused in lemon at the table — is the local plate at any of the cliff-edge restaurants.",
      gallery: [{ src: '/images/itinerary/greece/destinations/keri-bay-zakynthos.webp', alt: 'Keri' }],
    },
    {
      id: 'keri-bay-porto-koukla',
      routeFrom: 'Keri Bay',
      routeTo: 'Porto Koukla',
      day: 2,
      mapPin: {
        desktop: { left: 69.6, top: 90.8 },
        mobile: { left: 68, top: 90.3 },
      },
      shortDescription:
        'Tiny 6 nm east hop across Laganas Bay to Porto Koukla. Pine-fringed shore, dense posidonia meadows, and a small taverna-served quay. Easy noon arrival before the SW breeze fills in across the open bay.',
      thingsToDo: [
        'Snorkel the posidonia seagrass for octopus',
        'Paddleboard to a secret pebble cove',
        'Bianco garlic-fish stew at the quayside taverna',
        'Sundowner stargazing — near-zero light pollution',
        'Dawn run along the pine-shaded coast road',
      ],
      mooringTip:
        'Lazy lines on the small Porto Koukla quay (small fee, limited slots — first-come). South-exposed — if a SW swell builds overnight, fall back to deeper anchoring in Keri Bay 4 nm west on sand. No services beyond water.',
      description:
        "A six-nautical-mile drift east across Laganas Bay drops you onto Porto Koukla — a small pine-fringed quay on the south coast that most charter brochures skip in favour of the busier east-coast harbours. The reason to come is the seabed: dense posidonia meadows in 3–5 m of water, with octopus, sea bream and the occasional moray reliable enough that the snorkel-mask-and-fin set is the morning's activity. The taverna at the head of the quay runs bianco — the Ionian garlic-and-lemon fish stew, distinct from the spicier bourdeto — and the family that owns the place catches its own fish in the morning. The pine-shaded coast road runs flat from the quay west toward Keri and east toward Laganas; the dawn run before the heat is the local exercise. Near-zero light pollution on this stretch of the coast — the deep south-east stargazing slot at midnight pulls the Milky Way down to the deck.",
      gallery: [{ src: '/images/itinerary/greece/destinations/koukla.webp', alt: 'Koukla' }],
    },
    {
      id: 'porto-koukla-vromi-bay',
      routeFrom: 'Porto Koukla',
      routeTo: 'Vromi Bay',
      day: 3,
      mapPin: {
        desktop: { left: 73, top: 94.1 },
        mobile: { left: 73, top: 94.1 },
      },
      shortDescription:
        'About 18 nm round Cape Keri to Vromi Bay on the wild west coast. Towering chalk cliffs, Eleonora falcon nests, and the Navagio Shipwreck approach. Sail it only on a settled forecast — this coast has no bail-out anchorages.',
      thingsToDo: [
        'Tender to Navagio Shipwreck Cove for the photo',
        'Snorkel the cliff base for falcon-eye views',
        'Spot Eleonora falcons nesting on the cliffs',
        'Drone the chalk cliffs at golden hour',
        'Toast mandolato wine at sunset on deck',
      ],
      mooringTip:
        'Free anchor only — Vromi Bay has no quay. Use 8–12 m sand close to the south wall, sheltered from N–NE. Bail out at the first sign of W or SW swell as the bay is fully exposed. If wind backs SW overnight, run east back round Cape Keri to Porto Koukla.',
      description:
        'Eighteen nautical miles round Cape Keri brings you onto the wild west coast — and the only segment of the week that has to be sailed in a settled forecast. The chalk cliffs along this side rise 200 m above the waterline for the entire 20-km stretch, the rockfalls are frequent enough that the official restricted zone is now buoyed off for parts of the coast, and there are no intermediate anchorages or harbours to bail out into. Vromi Bay is the only protected indentation — a small north-facing inlet at the south end of Navagio Beach (Shipwreck Cove) with deep anchoring on 8–12 m sand. The bay is fully exposed W–SW; this is a fair-weather-only overnight, and the rule is to leave at first sign of a southerly forecast. Navagio itself is the headline photograph of Greek-island marketing — a 200-m crescent of fine sand at the cliff base, with the rusted Panagiotis freighter aground since a 1980 smuggling-run wreck. Tender in for the photo; the cliffs above are unstable, and the swim is the safer way to land. Eleonora falcons nest on the cliff faces between Vromi and Skinari (resident colony, the only Greek breeding site).',
      gallery: [{ src: '/images/itinerary/greece/destinations/vromi.webp', alt: 'Vromi' }],
    },
    {
      id: 'vromi-bay-agios-nikolaos',
      routeFrom: 'Vromi Bay',
      routeTo: 'Agios Nikolaos',
      day: 4,
      mapPin: {
        desktop: { left: 77.9, top: 91.8 },
        mobile: { left: 82.3, top: 91.8 },
      },
      shortDescription:
        'About 22 nm round Cape Skinari to Agios Nikolaos on the north-east coast. Cobalt-domed harbour church, the sheltered fishing port, and the gateway to the Blue Caves and Cape Skinari excursions.',
      thingsToDo: [
        'Snorkel the electric-blue waters of the Blue Caves',
        'Hike up to the Panagia Skopiotissa Monastery',
        'Rabbit stifado in a vine-shaded courtyard',
        'Coffee on the quay below the cobalt church dome',
        'Sundowner photo from the small Skinari headland',
      ],
      mooringTip:
        'Lazy lines or stern-to on the Agios Nikolaos quay (small fee — limited slots, call ahead in August). Sheltered from the prevailing N; the harbour entrance can chop up in a SE gale. Overflow at Makris Gialos anchorage 1 nm south on 5–7 m sand.',
      description:
        'Twenty-two nautical miles round Cape Skinari at the north tip of the island onto the east coast — the easy stretch of the week after the exposed west-coast leg, with the wind dropping under the lee from Skinari onward and the run south to Agios Nikolaos turning into a beam reach. The Blue Caves on the cape itself are the headline morning excursion — a series of sea caves where the limestone overhangs filter sunlight onto the seabed and turn the water inside the chambers a hard electric blue (the same geological feature as the Keri caves on the south coast, but more concentrated). The local glass-bottom-boat tours run from Skinari port; you can do the same circuit on your own dinghy with a torch and a snorkel. Agios Nikolaos itself is the small fishing port at the south end of this stretch — the harbour-front Panagia church with the cobalt-blue dome is the village landmark, and the 15th-century Skopiotissa Monastery 30 minutes up the hill behind the village is the walk. Rabbit stifado (slow-cooked in cinnamon, red wine and pearl onions) is the local plate worth ordering at any vine-shaded courtyard taverna.',
      gallery: [{ src: '/images/itinerary/greece/destinations/agios.webp', alt: 'Agios Nikolaos' }],
    },
    {
      id: 'agios-nikolaos-tsilivi',
      routeFrom: 'Agios Nikolaos',
      routeTo: 'Tsilivi',
      day: 5,
      mapPin: {
        desktop: { left: 73.2, top: 84.5 },
        mobile: { left: 73.5, top: 83.8 },
      },
      shortDescription:
        'Easy 12 nm south down the east coast to Tsilivi. Wide sandy bay, deep-water anchoring on a clean sand seabed, and the gateway to the inland highlights (Bochali castle, the wine villages of Volimes).',
      thingsToDo: [
        'Swim the long Tsilivi sand crescent',
        'Drive to Bochali for the panorama over Zante Town',
        'Tour the Volimes mountain wine villages',
        'Buy local ladotyri cheese at the market',
        'Sundowner on the seafront promenade',
      ],
      mooringTip:
        'Anchor in Tsilivi Bay on clean sand at 4–6 m — holding good, sheltered from N–NW. Bay is exposed S–SE; if a southerly is forecast, shift round to the Zakynthos Town quay (5 nm south) for the night. No quay services in Tsilivi.',
      description:
        'An easy 12-nautical-mile run south down the east coast under the lee of the island — the wind is forgiving here, the SW thermal carries you down on the beam, and the bay at Tsilivi opens out by mid-afternoon. The anchorage itself is straightforward: clean sand seabed at 4–6 m, holding good, sheltered from anything except a strong southerly. The reason to stop here rather than continue to Zakynthos Town is the inland access — Tsilivi is the closest harbour to the Bochali castle on the ridge above Zante Town (Venetian fortifications dating from the 15th century, with the panorama back down across the island that documents the geography in a single frame) and to the wine villages of Volimes in the central mountains. The Volimes villages run the only commercial cheese and ceramics production on the island; ladotyri (cheese matured in olive oil, the regional staple) is the local plate worth carrying back to the boat. The seafront promenade in Tsilivi itself is the evening walk — quiet end of the resort, the row of tavernas at the south end is the better dinner stretch.',
      gallery: [{ src: '/images/itinerary/greece/destinations/zakynthos.webp', alt: 'Tsilivi' }],
    },
    {
      id: 'tsilivi-marathonisi',
      routeFrom: 'Tsilivi',
      routeTo: 'Marathonisi (Laganas Bay)',
      day: 6,
      mapPin: {
        desktop: { left: 70.4, top: 92.6 },
        mobile: { left: 69.8, top: 92.6 },
      },
      shortDescription:
        'About 10 nm south round the south-east corner into Laganas Bay and the Marathonisi marine park. Loggerhead turtle nesting ground; anchor outside the buoyed exclusion zone on the south end of the islet.',
      thingsToDo: [
        'Spot loggerhead turtles surfacing every 10–15 min',
        'Swim the south-end Marathonisi sand crescent',
        'Snorkel the limestone caves on the south coast',
        'Photograph the islet at golden hour',
        'Dinner ashore at a Limni Keriou taverna',
      ],
      mooringTip:
        'Anchor in 4–6 m sand off the south end of Marathonisi islet, outside the buoyed turtle-nesting exclusion zone (the north end is protected and off-limits). Sheltered from N–NW; relocate to Limni Keriou 2 nm west if a SE swell builds. National Marine Park rules — no jet skis, no music after 22:00.',
      description:
        'Ten nautical miles south round the south-east corner of Zakynthos brings you into Laganas Bay and the National Marine Park — the loggerhead-turtle (Caretta caretta) nesting ground for the entire Mediterranean. Marathonisi islet (the small uninhabited island at the centre of the bay, sometimes called Turtle Island by the boat-tour operators) is the headline anchorage, but the rules matter: anchor only outside the buoyed exclusion zone on the south end, no jet skis or wakeboards within the marine park boundary, no music or amplified sound after 22:00 in the nesting season (May–October). The turtles surface to breathe every 10–15 minutes between June and August, and the south-end sand crescent of the islet is the photogenic backdrop. The limestone caves on the south coast of Marathonisi itself are the snorkel excursion — small sea caves at the cliff base, easy 5-minute dinghy access. Limni Keriou on the mainland side of the bay is the dinner village; the row of tavernas under the cliffs runs the local fish plates with the Marathonisi backdrop.',
      gallery: [{ src: '/images/itinerary/greece/destinations/zakynthos.webp', alt: 'Marathonisi' }],
    },
    {
      id: 'marathonisi-zakynthos-town',
      routeFrom: 'Marathonisi',
      routeTo: 'Zakynthos Town',
      day: 7,
      mapPin: {
        desktop: { left: 75.3, top: 87.9 },
        mobile: { left: 78.6, top: 85.9 },
      },
      shortDescription:
        'Final 8 nm hop round Cape Gerakas and back up the east coast to Zakynthos Town. Last swim at Pelouzo Islet on the way in; berth by 18:00 for the technical hand-back and a last evening on the seafront.',
      thingsToDo: [
        'Last swim off Pelouzo Islet',
        'Walk the Solomos Square evening volta',
        'Souzoukakia spiced meatballs at a Bohali taverna',
        'Honeyed baklava from the harbour bakery',
        'Hand-back briefing & marina departure',
      ],
      mooringTip:
        'Stern-to on the Zakynthos Town main quay (free — exposed to S–SW swell; tie up tight and double the stern lines if a southerly is forecast overnight). Return by 18:00 Friday for the technical hand-back; sleep aboard, disembark Saturday by 09:00. Direct 15-minute shuttle to Zakynthos airport (ZTH).',
      description:
        "Final passage of the week — eight nautical miles round Cape Gerakas at the south-east tip of the island and back up the east coast to Zakynthos Town. Pelouzo Islet on the way in is the last swim stop — small uninhabited rock 1 nm offshore, deep-water anchoring on 8–10 m sand, water clarity that earns the photograph. Zakynthos Town itself was rebuilt almost identically after the 1953 earthquake (which destroyed the entire Ionian; only Fiskardo on Kefalonia escaped intact), and the Venetian-arched seafront is the result — visually convincing if you don't know the date stamp. Solomos Square at the north end of the seafront is the evening volta walk; the row of bougainvillea-covered bars on the south side is the sundowner waypoint. Souzoukakia — spiced lamb-and-cumin meatballs in a slow-cooked tomato sauce, the Smyrna recipe that came to Greece with the 1922 refugee transfer — is the local plate at any Bohali-hill taverna for the farewell dinner. Hand-back at 09:00 Saturday from the town quay; the airport shuttle is 15 minutes south.",
      gallery: [{ src: '/images/itinerary/greece/destinations/zakynthos.webp', alt: 'Zakynthos' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Zakynthos Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Zakynthos Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(zakynthosRoute);
