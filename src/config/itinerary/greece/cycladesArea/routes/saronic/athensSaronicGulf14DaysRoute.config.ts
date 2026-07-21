import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const athensSaronicGulf14DayRoute: ItineraryRoute = {
  metaTitle: '14-Day Athens–Saronic Gulf Yacht Charter | Greece Sailing Adventure',
  metaDesc:
    'Sail a 14-day yacht charter from Athens through the Saronic and the Argolic Gulf to Monemvasia and back via Hydra. Mainland Peloponnese cruising for archaeology + quiet anchorages.',
  id: 'athens-saronic-gulf-14-day',
  startingPoint: 'Athens',
  otherPoints: ['Saronic gulf (14 day)'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/athens-saronic-gulf-14-day.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/agistri-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/spetses-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/aegina-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/spetses-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'athens-poros',
      routeFrom: 'Athens (Alimos)',
      routeTo: 'Poros',
      day: 1,
      mapPin: {
        desktop: { left: 53.8, top: 5.2 },
        mobile: { left: 50.5, top: 17.8 },
      },
      description:
        '28 nm shake-down southwest from Alimos to Poros. Long first day in sheltered Saronic water. Stern-to on the long town quay along the Poros waterfront, €25-40/night. Day-anchor at Love Bay on the south coast for late-afternoon swim before mooring. Plan to anchor swim at Love Bay (south coast), walk to the Temple of Poseidon ruins, saganaki cheese flambéed at the waterfront.',
      shortDescription:
        '28 nm shake-down SW to Poros. Long first day in sheltered Saronic water. Town quay overnight; day-anchor at Love Bay before mooring. Stern-to in Poros town quay, €25-40/night. Plan to anchor swim at Love Bay (south coast) and walk to the Temple of Poseidon ruins.',
      thingsToDo: [
        'Anchor swim at Love Bay (south coast)',
        'Walk to the Temple of Poseidon ruins',
        'Saganaki cheese flambéed at the waterfront',
        'Cycle the lemon-grove loop',
      ],
      mooringTip: 'Stern-to in Poros town quay, €25-40/night. Sheltered from any direction.',
      gallery: [{ src: '/images/itinerary/greece/destinations/poros.webp', alt: 'Poros' }],
    },
    {
      id: 'poros-spetses',
      routeFrom: 'Poros',
      routeTo: 'Spetses',
      day: 2,
      mapPin: {
        desktop: { left: 42.9, top: 36.4 },
        mobile: { left: 40, top: 34.5 },
      },
      description:
        '20 nm southwest to Spetses. Car-free old town with horse carriages and bicycles only. Dapia Old Harbour stern-to, €30-50/night. Day-anchor at Zogeria (north coast, sand 5-7 m) for swim before mooring. Stern-to in Dapia harbour, €30-50/night, sheltered from N. Plan to cycle the island perimeter road and sunset cocktails at Old Harbour pirate bars.',
      shortDescription:
        '20 nm SW to Spetses. Car-free old town, 19th-c shipowner mansions. Dapia harbour overnight; Zogeria north coast day-anchor. Stern-to in Dapia harbour, €30-50/night, sheltered from N. Plan to walk the car-free old town with horse carriages and cycle the island perimeter road.',
      thingsToDo: [
        'Walk the car-free old town with horse carriages',
        'Anchor swim at Zogeria (north coast)',
        'Cycle the island perimeter road',
        'Sunset cocktails at Old Harbour pirate bars',
      ],
      mooringTip:
        'Stern-to in Dapia harbour, €30-50/night, sheltered from N. Old Harbour smaller alternative for the photogenic 19th-c waterfront.',
      gallery: [{ src: '/images/itinerary/greece/destinations/spetses.webp', alt: 'Spetses' }],
    },
    {
      id: 'spetses-kiparissi',
      routeFrom: 'Spetses',
      routeTo: 'Kiparissi',
      day: 3,
      mapPin: {
        desktop: { left: 26.1, top: 53 },
        mobile: { left: 24.1, top: 45 },
      },
      description:
        '32 nm south to Kiparissi — small Peloponnese mainland fishing village in the Argolic Gulf, dramatic mountain backdrop, accessible only by sea or a long mountain road. Anchorage in the bay at the foot of the village, sand 5-7 m, sheltered from N. Few charter boats reach this far south — quietest anchorage of the entire route.',
      shortDescription:
        '32 nm south to Kiparissi — Peloponnese mainland fishing village, sea-or-mountain-road access only. Quietest anchorage of the route. Sheltered from N. Free anchoring in Kiparissi bay on sand at 5-7 m; Limited shore facilities — provision before leaving Spetses.',
      thingsToDo: [
        'Hike to the abandoned Vathy stone village',
        'Snorkel the rocky shoreline north of village',
        'Grilled red mullet at the quay taverna',
        'Sunset behind the Parnon mountain ridge',
      ],
      mooringTip:
        'Free anchoring in Kiparissi bay on sand at 5-7 m. Sheltered from N. Limited shore facilities — provision before leaving Spetses.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kiparissi.webp', alt: 'Kiparissi' }],
    },
    {
      id: 'kiparissi-monemvasia',
      routeFrom: 'Kiparissi',
      routeTo: 'Monemvasia',
      day: 4,
      mapPin: {
        desktop: { left: 17.9, top: 66.3 },
        mobile: { left: 16.5, top: 55.9 },
      },
      description:
        '20 nm south to Monemvasia — UNESCO-listed medieval rock-fortress town on a tidal islet connected to the mainland by a single causeway. Anchorage off the small port at Gefyra (the mainland-side modern town), sand 5-8 m, sheltered from N. Walk across the causeway to the medieval Lower Town (car-free, working population around 100); steep stairs up to the Upper Town for panoramic views.',
      shortDescription:
        '20 nm south to Monemvasia — UNESCO medieval fortress town on a tidal rock. Anchor off Gefyra mainland port; walk the causeway into the medieval Lower Town.',
      thingsToDo: [
        'Walk car-free medieval Lower Town',
        'Climb to the Upper Town for the panorama',
        'Tasting Monemvasia (malvasia) wine',
        'Photograph the rock at sunset from the causeway',
      ],
      mooringTip:
        'Anchor off Gefyra port on sand at 5-8 m. Sheltered from N. Small marina slots inside Gefyra for €30-40/night when wind builds.',
      gallery: [{ src: '/images/itinerary/greece/destinations/monemvasia.webp', alt: 'Monemvasia' }],
    },
    {
      id: 'monemvasia-gerakas',
      routeFrom: 'Monemvasia',
      routeTo: 'Gerakas',
      day: 5,
      mapPin: {
        desktop: { left: 20.8, top: 92 },
        mobile: { left: 17.1, top: 69 },
      },
      description:
        '12 nm south to Gerakas — the southernmost natural harbour in mainland Greece, a fjord-shaped inlet cut into the Cape Maleas peninsula. Sheltered from any direction. Sand bottom, holding excellent. Tiny year-round fishing community, two tavernas, single road to the Spartan-era Zarax cliffside ruins above the village.',
      shortDescription:
        '12 nm south to Gerakas — fjord-shaped natural harbour, southernmost mainland Greek port. Sheltered from any direction. Two tavernas, Spartan-era cliffside ruins above. Free anchoring on sand 5-7 m, fully sheltered; Stern-to on the small village quay if available, €15-25/night.',
      thingsToDo: [
        'Hike to the Zarax cliffside ruins',
        'Swim the inlet sand bottom',
        'Grilled octopus at a quay taverna',
        'Walk the olive-grove trail above the bay',
      ],
      mooringTip:
        'Free anchoring on sand 5-7 m, fully sheltered. Stern-to on the small village quay if available, €15-25/night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/garakas.webp', alt: 'Gerakas' }],
    },
    {
      id: 'gerakas-leonidio',
      routeFrom: 'Gerakas',
      routeTo: 'Leonidio',
      day: 6,
      mapPin: {
        desktop: { left: 21.2, top: 81.9 },
        mobile: { left: 19.6, top: 62.9 },
      },
      description:
        '32 nm north to Leonidio — Peloponnese mainland port, red-cliff town wedged between the sea and a 600 m red sandstone wall. Citrus orchards, world-class climbing routes (Leonidio is a winter destination for European sport climbers). Plaka harbour at the foot of the cliff is the anchorage; small quay for stern-to.',
      shortDescription:
        '32 nm north to Leonidio — red-cliff mainland port, citrus orchards, world-class climbing. Plaka harbour at the foot of the cliff for overnight. Stern-to in Plaka harbour, €15-25/night; Sheltered from N; Anchor in the bay outside on sand at 5-7 m.',
      thingsToDo: [
        'Hike Lousios River canyon',
        'Visit Elonis monastery cliff path',
        'Slow-cooked goat kleftiko at a courtyard',
        'Walk the citrus orchards above the village',
      ],
      mooringTip:
        'Stern-to in Plaka harbour, €15-25/night. Sheltered from N. Anchor in the bay outside on sand at 5-7 m if quay full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/leonidio.webp', alt: 'Leonidio' }],
    },
    {
      id: 'leonidio-sampatiki',
      routeFrom: 'Leonidio',
      routeTo: 'Sampatiki',
      day: 7,
      mapPin: {
        desktop: { left: 13.8, top: 61.3 },
        mobile: { left: 9.9, top: 51.2 },
      },
      description:
        '15 nm north to Sampatiki — quiet mainland fishing inlet under a Venetian watchtower. Small pebble cove, two tavernas, no road from the major Peloponnese routes. Anchor on sand at 4-6 m, sheltered from N. The single best lay-day stop on the entire route.',
      shortDescription:
        '15 nm north to Sampatiki — quiet inlet under a Venetian watchtower, no road access. Pebble cove, two tavernas. Best lay-day stop on the route.',
      thingsToDo: [
        'Snorkel the rocky shoreline below the watchtower',
        'Hike up to the Venetian watchtower ruins',
        'Pitaroudia chickpea fritters at a beach taverna',
        'Read on deck under the cicadas',
      ],
      mooringTip: 'Free anchoring on sand at 4-6 m, sheltered from N. No marina services — provision before arriving.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sampatiki.webp', alt: 'Sampatiki' }],
    },
    {
      id: 'sampatiki-nafplio',
      routeFrom: 'Sampatiki',
      routeTo: 'Nafplio',
      day: 8,
      mapPin: {
        desktop: { left: 13.9, top: 57.7 },
        mobile: { left: 8.2, top: 44.1 },
      },
      description:
        '20 nm north to Nafplio — the first capital of modern Greece, Venetian fortress walls, Old Town pedestrian streets, the most photogenic port in the Peloponnese. Stern-to in the small marina under the Palamidi fortress walls, €30-50/night. Climb the 999 steps up to the fortress for the panoramic late-afternoon view.',
      shortDescription:
        '20 nm north to Nafplio — first capital of modern Greece, Venetian fortress walls, photogenic Old Town. Marina stern-to under Palamidi. 999 fortress steps for the view.',
      thingsToDo: [
        'Climb the 999 steps to Palamidi fortress',
        'Buy komboloi worry beads in the Old Town',
        'Almond amygdalota pastries at a candle-lit café',
        'Walk the seawall promenade at sunset',
      ],
      mooringTip:
        'Stern-to in Nafplio marina, €30-50/night. Sheltered from N. Town quay anchorage is not available — marina only for charter boats.',
      gallery: [{ src: '/images/itinerary/greece/destinations/nafplio.webp', alt: 'Nafplio' }],
    },
    {
      id: 'nafplio-dhokos',
      routeFrom: 'Nafplio',
      routeTo: 'Dhokos',
      day: 9,
      mapPin: {
        desktop: { left: 9.1, top: 32.7 },
        mobile: { left: 9.4, top: 32.7 },
      },
      description:
        '32 nm east to Dhokos — uninhabited island between the Argolic peninsula and Hydra, famous for the Dhokos shipwreck (Bronze Age, 2200 BC, the oldest shipwreck in the world). The wreck is 15 m down — only certified divers. Skindahos Bay on the north coast is the anchorage; sand at 5-7 m, sheltered from S.',
      shortDescription:
        '32 nm east to Dhokos — uninhabited island, world-oldest shipwreck (Bronze Age 2200 BC) at 15 m. Skindahos Bay anchorage; sand 5-7 m, sheltered from S.',
      thingsToDo: [
        'Snorkel above the Bronze Age shipwreck site',
        'Beachcomb the uninhabited shoreline',
        'Picnic with feta and figs on deck',
        'Walk the dry-stone walls inland',
      ],
      mooringTip:
        'Free anchoring in Skindahos Bay on sand at 5-7 m. Sheltered from S. No services — provision before arriving.',
      gallery: [{ src: '/images/itinerary/greece/destinations/dhokos.webp', alt: 'Dhokos' }],
    },
    {
      id: 'dhokos-hydra',
      routeFrom: 'Dhokos',
      routeTo: 'Hydra',
      day: 10,
      mapPin: {
        desktop: { left: 35.3, top: 48.5 },
        mobile: { left: 32, top: 42 },
      },
      description:
        '8 nm east to Hydra. No cars on the island; donkeys carry luggage from harbour up to cliff-side village houses. Hydra harbour stern-to slot competition is fierce — arrive by 15:00 or anchor in Mandraki Bay 1 nm east. Cliff-cut Spilia Beach Bar above the harbour is the famous sunset stop.',
      shortDescription:
        '8 nm east to Hydra. No cars; donkeys carry luggage. Slot competition fierce — arrive by 15:00 or anchor in Mandraki east of town. Hydra harbour stern-to, €30-50/night, slot fills by 15:00. Plan to walk the cliff-side stone alleys (no cars) and drink at Spilia Beach Bar cliff cut-out.',
      thingsToDo: [
        'Walk the cliff-side stone alleys (no cars)',
        'Drink at Spilia Beach Bar cliff cut-out',
        'Swim Vlychos Beach (15 min walk west)',
        'Hike to Profitis Ilias monastery',
      ],
      mooringTip:
        'Hydra harbour stern-to, €30-50/night, slot fills by 15:00. Anchor in Mandraki Bay 1 nm east on sand at 6-8 m if full. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/hydra.webp', alt: 'Hydra' }],
    },
    {
      id: 'hydra-palaia-epidavros',
      routeFrom: 'Hydra',
      routeTo: 'Palaia Epidavros',
      day: 11,
      mapPin: {
        desktop: { left: 43, top: 48.6 },
        mobile: { left: 39.4, top: 41.7 },
      },
      description:
        '20 nm north to Palaia Epidavros — small Peloponnese mainland port, 4 km below the famous 4th-century BC Epidavros theatre (UNESCO). Day-anchor at the underwater Sunken City (Roman ruins under 2-3 m water, snorkel-accessible) before mooring on the town quay.',
      shortDescription:
        '20 nm north to Palaia Epidavros. Underwater Roman Sunken City for snorkel; the 4th-c BC Epidavros theatre (UNESCO) is 4 km inland by taxi. Highlights: Snorkel the underwater Sunken City and Taxi to the 4th-c BC Epidavros theatre.',
      thingsToDo: [
        'Snorkel the underwater Sunken City',
        'Taxi to the 4th-c BC Epidavros theatre',
        'Lunch on ladenia tomato flatbread',
        'Paddleboard at sunset off the quay',
      ],
      mooringTip:
        'Stern-to in Palaia Epidavros town quay, €15-25/night, sheltered from N. Sunken City for day-anchor on sand at 3-5 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/palaia.webp', alt: 'Palaia' }],
    },
    {
      id: 'palaia-epidavros-aegina',
      routeFrom: 'Palaia Epidavros',
      routeTo: 'Aegina',
      day: 12,
      mapPin: {
        desktop: { left: 29.6, top: 31 },
        mobile: { left: 25.6, top: 31.7 },
      },
      description:
        '20 nm east to Aegina. Switch to Perdika village on the south coast for the quieter overnight (smaller harbour, family tavernas on the quay). Visit the Temple of Aphaia (5th-century BC) by taxi; the temple predates the Parthenon and is the second-best preserved Doric temple in Greece.',
      shortDescription:
        '20 nm east to Aegina. Perdika south coast for the quieter overnight. Temple of Aphaia (5th-c BC) is the headline shore activity. Stern-to in Perdika harbour, €20-30/night; Aegina town quay alternative for the larger waterfront scene.',
      thingsToDo: [
        'Taxi to the Temple of Aphaia (5th-c BC)',
        'Walk Perdika fishing-quay tavernas',
        'Swim Marathonas Beach (sand)',
        'Pistachio-crust baklava at a Perdika kafeneio',
      ],
      mooringTip:
        'Stern-to in Perdika harbour, €20-30/night. Aegina town quay alternative for the larger waterfront scene.',
      gallery: [{ src: '/images/itinerary/greece/destinations/aegina.webp', alt: 'Aegina' }],
    },
    {
      id: 'aegina-athens',
      routeFrom: 'Aegina',
      routeTo: 'Athens (Alimos)',
      day: 13,
      mapPin: {
        desktop: { left: 43.6, top: 20.6 },
        mobile: { left: 39.6, top: 25.2 },
      },
      description:
        '15 nm northeast back to Alimos. Optional swim stop at Agistri Skala Beach on the way. Refuel at Alimos before tying up. Standard 14:00 marina arrival for relaxed handover-prep afternoon. Confirm handover slot 24h ahead. Plan to crew dinner at a Glyfada taverna and souvenir-stop on Faliro promenade.',
      shortDescription:
        '15 nm NE back to Alimos. Optional Agistri Skala swim stop. Standard 14:00 marina arrival. Refuel before mooring. Confirm handover slot 24h ahead. Plan to crew dinner at a Glyfada taverna and souvenir-stop on Faliro promenade.',
      thingsToDo: [
        'Optional swim stop at Agistri Skala Beach',
        'Refuel and clean the boat at Alimos',
        'Crew dinner at a Glyfada taverna',
        'Souvenir-stop on Faliro promenade',
      ],
      mooringTip:
        'Alimos Marina stern-to with lazy lines, €70-100/night. Refuel at the entrance fuel berth before mooring. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alimos.webp', alt: 'Athens' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Aegina',
      routeTo: 'Athens (Check Out)',
      day: 14,
      description:
        'Handover at Alimos before 09:00. Boat inspection with the skipper present — deposit released within 7 days. Crew transfer to Athens airport is 25 minutes by road; allow an hour in Friday traffic. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and coffee on the Glyfada promenade.',
      shortDescription:
        'Handover before 09:00 at Alimos. Inspection, deposit release within 7 days. Airport transfer 25 minutes; allow 60 in Friday peak. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and coffee on the Glyfada promenade.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Coffee on the Glyfada promenade',
        'Airport transfer (25 min from Alimos)',
        'Tip the dock crew if service was good',
      ],
      mooringTip:
        'Hand over at Alimos before 09:00. Deposit released within 7 days post-inspection. Photo evidence of any noted damage before signing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alimos.webp', alt: 'Athens' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/saronic/map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1293,
      height: 1173,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/saronic/mobile-map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 780,
      height: 1090,
    },
  },
};

export default computeItineraryNumberOfDays(athensSaronicGulf14DayRoute);
