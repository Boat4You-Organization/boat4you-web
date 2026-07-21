import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const rhodes14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Rhodes Round-Trip Yacht Charter | Dodecanese Sailing',
  metaDesc:
    'Sail a 14-day yacht charter from Rhodes via Symi, Nisyros, Kos, Leros, Patmos, Lipsi, Levitha, Kalymnos, Astypalaia, Tilos, Chalki and Lindos. Full Dodecanese grand tour.',
  id: 'rhodes-14-days',
  startingPoint: 'Rhodes',
  otherPoints: ['14 days'],
  cardImage: {
    src: '/images/itinerary/greece/dodecanese-itinerary/routes/rhodes-14-days.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/rhodes-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/kos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/chalki-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/rhodes-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'rhodes-symi',
      routeFrom: 'Rhodes',
      routeTo: 'Symi',
      day: 1,
      mapPin: {
        desktop: { left: 93.9, top: 65.3 },
        mobile: { left: 87.9, top: 64.8 },
      },
      description:
        '24 nm shake-down NNW from Mandraki Marina to Symi. Symi inner quay stern-to fills by 16:00 in peak; Pedi Bay 2 nm east of the town is the alternative. Most photographed neoclassical waterfront in the Dodecanese. Stern-to inner quay, €30-50/night, slot fills by 16:00 in peak. Plan to walk to the 18th-c Panormitis Monastery and buy fresh sponges from harbour stalls.',
      shortDescription:
        '24 nm shake-down NNW to Symi. Inner quay fills by 16:00; Pedi Bay 2 nm east is the alternative. Most photographed Dodecanese harbour. Highlights: Walk to the 18th-c Panormitis Monastery and Buy fresh sponges from harbour stalls.',
      thingsToDo: [
        'Walk to the 18th-c Panormitis Monastery',
        'Buy fresh sponges from harbour stalls',
        'Symian shrimp at a quay taverna',
        'Swim Nanou Beach (boat-only access)',
      ],
      mooringTip:
        'Stern-to inner quay, €30-50/night, slot fills by 16:00 in peak. Pedi Bay 2 nm east anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/symi.webp', alt: 'Symi' }],
    },
    {
      id: 'symi-nisyros',
      routeFrom: 'Symi',
      routeTo: 'Nisyros (Pali)',
      day: 2,
      mapPin: {
        desktop: { left: 81.5, top: 55.5 },
        mobile: { left: 77.9, top: 51.7 },
      },
      description:
        '32 nm west to Nisyros. Pali harbour on the north coast for the standard overnight. Stefanos crater hike on the inland caldera floor is the headline shore activity. Loutra natural thermal springs on the road from Mandraki. Stern-to in Pali harbour, €25-35/night, sheltered from N. Mandraki west coast smaller alternative. Plan to hike into the Stefanos volcanic crater, walk Mandraki cobblestone alleys, soak in Loutra natural thermal springs.',
      shortDescription:
        '32 nm west to Nisyros — active volcanic island. Pali harbour north coast. Stefanos crater hike + Loutra thermal springs. Stern-to in Pali harbour, €25-35/night, sheltered from N. Plan to walk Mandraki cobblestone alleys and buy local capers (volcanic-soil grown).',
      thingsToDo: [
        'Hike into the Stefanos volcanic crater',
        'Walk Mandraki cobblestone alleys',
        'Soak in Loutra natural thermal springs',
        'Buy local capers (volcanic-soil grown)',
      ],
      mooringTip: 'Stern-to in Pali harbour, €25-35/night, sheltered from N. Mandraki west coast smaller alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/nisyros.webp', alt: 'Nisyros' }],
    },
    {
      id: 'nisyros-kos',
      routeFrom: 'Nisyros',
      routeTo: 'Kos',
      day: 3,
      mapPin: {
        desktop: { left: 70.3, top: 50.8 },
        mobile: { left: 68.6, top: 47 },
      },
      description:
        '15 nm north to Kos Marina — largest charter base in the Dodecanese, full services. Walk to Kos Town for the 4th-century BC Asklepion ruins, the 2400-year-old plane tree on Platia Platanou. Kos Marina stern-to with lazy lines, €60-90/night. Refuel at entrance fuel berth. Plan to walk Kos Town Asklepion ruins, sit under the 2400-year plane tree, swim Therma Beach hot springs.',
      shortDescription:
        '15 nm north to Kos Marina. Largest Dodecanese charter base. Asklepion + 2400-year plane tree + Therma hot springs. Kos Marina stern-to with lazy lines, €60-90/night. Plan to walk Kos Town Asklepion ruins and kleftiko slow-cooked lamb at a Kos Town taverna.',
      thingsToDo: [
        'Walk Kos Town Asklepion ruins',
        'Sit under the 2400-year plane tree',
        'Swim Therma Beach hot springs',
        'Kleftiko slow-cooked lamb at a Kos Town taverna',
      ],
      mooringTip: 'Kos Marina stern-to with lazy lines, €60-90/night. Refuel at entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kos.webp', alt: 'Kos' }],
    },
    {
      id: 'kos-leros',
      routeFrom: 'Kos',
      routeTo: 'Leros',
      day: 4,
      mapPin: {
        desktop: { left: 60.7, top: 41.9 },
        mobile: { left: 54.9, top: 40.6 },
      },
      description:
        '20 nm north to Leros. Lakki on the south coast is one of the largest natural harbours in the Mediterranean — sheltered, Italian-fascist Art Deco quay architecture from the 1930s. Lakki Marina stern-to with lazy lines, €40-60/night, fully sheltered. Agia Marina town quay €25-40/night exposed in N Meltemi above 22 kn. Plan to walk Lakki Art Deco quay (1930s architecture), climb to Panteli Castle, swim Xerokambos Beach (south coast).',
      shortDescription:
        '20 nm north to Leros. Lakki bay (south) is one of largest Mediterranean natural harbours. Agia Marina (north) photogenic but exposed in Meltemi. Highlights: Walk Lakki Art Deco quay (1930s architecture) and Climb to Panteli Castle.',
      thingsToDo: [
        'Walk Lakki Art Deco quay (1930s architecture)',
        'Climb to Panteli Castle',
        'Swim Xerokambos Beach (south coast)',
        'Pitaroudia chickpea fritters at a quay taverna',
      ],
      mooringTip:
        'Lakki Marina stern-to with lazy lines, €40-60/night, fully sheltered. Agia Marina town quay €25-40/night exposed in N Meltemi above 22 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/leros.webp', alt: 'Leros' }],
    },
    {
      id: 'leros-patmos',
      routeFrom: 'Leros',
      routeTo: 'Patmos',
      day: 5,
      mapPin: {
        desktop: { left: 43.7, top: 26.1 },
        mobile: { left: 39.4, top: 26.1 },
      },
      description:
        '12 nm north to Patmos. Skala harbour on the east coast — large quay, sheltered from N. UNESCO Cave of the Apocalypse + 11th-century Monastery of St John on the road up to Chora. Stern-to in Skala harbour, €30-50/night. Plan to walk to the Cave of the Apocalypse and swim Psili Ammos golden-sand beach.',
      shortDescription:
        '12 nm north to Patmos. Skala harbour east coast. UNESCO Cave of the Apocalypse + 11th-c Monastery of St John on road to Chora. Stern-to in Skala harbour, €30-50/night. Plan to walk to the Cave of the Apocalypse and swim Psili Ammos golden-sand beach.',
      thingsToDo: [
        'Walk to the Cave of the Apocalypse',
        'Visit the 11th-c Monastery of St John',
        'Swim Psili Ammos golden-sand beach',
        'Mastiha cocktails in Chora alleys',
      ],
      mooringTip: 'Stern-to in Skala harbour, €30-50/night. Large quay, sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/patmos.webp', alt: 'Patmos' }],
    },
    {
      id: 'patmos-lipsi',
      routeFrom: 'Patmos',
      routeTo: 'Lipsi',
      day: 6,
      mapPin: {
        desktop: { left: 33.8, top: 17.4 },
        mobile: { left: 28, top: 16.7 },
      },
      description:
        '12 nm southeast to Lipsi — small island archipelago, 700 residents. Aspronissi Bay 2 nm east is the headline snorkel anchorage. Single bakery, family tavernas on the waterfront. Stern-to in Lipsi town quay, €15-25/night, sheltered from N. Plan to walk to Chapel of Panagia (single rock) and lipsiako cheese with thyme honey at a taverna.',
      shortDescription:
        '12 nm SE to Lipsi — quiet island, 700 residents. Aspronissi Bay 2 nm east is the headline snorkel anchorage. Stern-to in Lipsi town quay, €15-25/night, sheltered from N. Plan to walk to Chapel of Panagia (single rock) and lipsiako cheese with thyme honey at a taverna.',
      thingsToDo: [
        'Snorkel Aspronissi Bay (2 nm east)',
        'Walk to Chapel of Panagia (single rock)',
        'Lipsiako cheese with thyme honey at a taverna',
        'Buy fresh koulouria at the village bakery',
      ],
      mooringTip:
        'Stern-to in Lipsi town quay, €15-25/night, sheltered from N. Anchor in Aspronissi Bay on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lipsi.webp', alt: 'Lipsi' }],
    },
    {
      id: 'lipsi-levitha',
      routeFrom: 'Lipsi',
      routeTo: 'Levitha',
      day: 7,
      mapPin: {
        desktop: { left: 6.4, top: 26.8 },
        mobile: { left: 8.6, top: 26.3 },
      },
      description:
        '20 nm southwest to Levitha — population 6, no scheduled ferry, no ATM, single goat-herding family running the only taverna. Ammoudi Bay anchorage on sand 5-7 m, fully sheltered from N. Darkest night sky in the central Aegean. Plan to help the goat-herders at the family farm, anchor swim at Ammoudi Bay sand bottom, astakomakaronada at the only taverna on the island.',
      shortDescription:
        '20 nm SW to Levitha — population 6, no ferry, no ATM. Ammoudi Bay fully sheltered from N. Darkest night sky in central Aegean. Free anchoring in Ammoudi Bay on sand at 5-7 m; No services — bring cash, no ATM.',
      thingsToDo: [
        'Help the goat-herders at the family farm',
        'Anchor swim at Ammoudi Bay sand bottom',
        'Astakomakaronada at the only taverna on the island',
        'Stargaze on deck — no light pollution',
      ],
      mooringTip:
        'Free anchoring in Ammoudi Bay on sand at 5-7 m. Fully sheltered from N. No services — bring cash, no ATM.',
      gallery: [{ src: '/images/itinerary/greece/destinations/levitha.webp', alt: 'Levitha' }],
    },
    {
      id: 'levitha-kalymnos',
      routeFrom: 'Levitha',
      routeTo: 'Kalymnos',
      day: 8,
      mapPin: {
        desktop: { left: 30.5, top: 35.1 },
        mobile: { left: 24.5, top: 34.2 },
      },
      description:
        '32 nm east to Kalymnos. Pothia harbour on the south coast for overnight. Climbing-festival island — Massouri/Armeos west coast for world-class limestone routes. Stern-to in Pothia harbour, €30-50/night. Plan to snorkel Vathy Bay turquoise inlet and visit the Sponge Diving Museum at Pothia.',
      shortDescription:
        '32 nm east to Kalymnos. Pothia for overnight. Climbing-festival island — Massouri/Armeos west coast for world-class limestone. Stern-to in Pothia harbour, €30-50/night. Plan to snorkel Vathy Bay turquoise inlet and visit the Sponge Diving Museum at Pothia.',
      thingsToDo: [
        'Climb Grande Grotta limestone cliff',
        'Snorkel Vathy Bay turquoise inlet',
        'Visit the Sponge Diving Museum at Pothia',
        'Mououri stuffed squid at a Pothia ouzeri',
      ],
      mooringTip:
        'Stern-to in Pothia harbour, €30-50/night. Vathy east coast alternative for sheltered fjord-like inlet.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kalymnos.webp', alt: 'Kalymnos' }],
    },
    {
      id: 'kalymnos-astypalaia',
      routeFrom: 'Kalymnos',
      routeTo: 'Astypalaia',
      day: 9,
      mapPin: {
        desktop: { left: 47.6, top: 37.1 },
        mobile: { left: 45.9, top: 36.2 },
      },
      description:
        '38 nm long beam-reach southwest to Astypalaia — butterfly-shaped island, geographic westernmost of the Dodecanese. Pera Gialos harbour on the east side of the kastro is the standard overnight; Venetian castle of Querini on the cliff above. Stern-to in Pera Gialos harbour, €25-40/night, sheltered from N. Maltezana south coast for sheltered anchorage alternative. Plan to walk Chora Venetian castle of Querini, swim Vatses Beach (south coast, sand), ladenia tomato pie at Kaminakia Taverna.',
      shortDescription:
        '38 nm long beam reach SW to Astypalaia. Butterfly-shaped, westernmost Dodecanese. Pera Gialos harbour for overnight; Querini castle on cliff above. Stern-to in Pera Gialos harbour, €25-40/night, sheltered from N. Plan to swim Vatses Beach (south coast, sand) and ladenia tomato pie at Kaminakia Taverna.',
      thingsToDo: [
        'Walk Chora Venetian castle of Querini',
        'Swim Vatses Beach (south coast, sand)',
        'Ladenia tomato pie at Kaminakia Taverna',
        'Search for Roman mosaics near Mesa Nisi',
      ],
      mooringTip:
        'Stern-to in Pera Gialos harbour, €25-40/night, sheltered from N. Maltezana south coast for sheltered anchorage alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/palaia.webp', alt: 'Palaia' }],
    },
    {
      id: 'astypalaia-tilos',
      routeFrom: 'Astypalaia',
      routeTo: 'Tilos',
      day: 10,
      mapPin: {
        desktop: { left: 24.9, top: 58.3 },
        mobile: { left: 23.5, top: 50.9 },
      },
      description:
        '38 nm long beam-reach southeast to Tilos — first zero-waste island in Greece. Livadia harbour on the east coast. Mikro Chorio abandoned mountain village rebuilt as a single taverna-and-bar destination. Stern-to in Livadia harbour, €20-30/night, sheltered from N. Plan to hike to Agios Panteleimon monastery and mizithra cheese with thyme honey at a hilltop kafeneio.',
      shortDescription:
        '38 nm long beam reach SE to Tilos — first zero-waste island in Greece. Livadia harbour east coast. Mikro Chorio abandoned village taverna. Stern-to in Livadia harbour, €20-30/night, sheltered from N; Eristos Bay south coast alternative.',
      thingsToDo: [
        'Hike to Agios Panteleimon monastery',
        'Mikro Chorio abandoned village taverna at night',
        'Mizithra cheese with thyme honey at a hilltop kafeneio',
        'Tilos organic wine tasting',
      ],
      mooringTip: 'Stern-to in Livadia harbour, €20-30/night, sheltered from N. Eristos Bay south coast alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tilos.webp', alt: 'Tilos' }],
    },
    {
      id: 'tilos-chalki',
      routeFrom: 'Tilos',
      routeTo: 'Chalki',
      day: 11,
      mapPin: {
        desktop: { left: 62.6, top: 65 },
        mobile: { left: 68.4, top: 62.3 },
      },
      description:
        "15 nm south to Chalki — car-free village, 300 residents. Pontamos Cove 1 nm east is the headline snorkel anchorage. Knights' Castle on the ridge above the village. Stern-to in Emporio harbour, €20-30/night, sheltered from N. Pontamos anchor on sand at 4-6 m for swim alternative. Plan to hike to the Knights' Castle on the ridge above Emporio, snorkel Pontamos Cove neon-blue water, and try pougia (sun-dried octopus) at Taverna Giorgos before dinner.",
      shortDescription:
        "15 nm south to Chalki — car-free village. Pontamos Cove 1 nm east for snorkel. Knights' Castle ridge above village. Stern-to in Emporio harbour, €20-30/night, sheltered from N; Pontamos anchor on sand at 4-6 m for swim alternative.",
      thingsToDo: [
        'Snorkel Pontamos Cove (neon-blue water)',
        "Hike to Knights' Castle on the ridge",
        'Pougia sun-dried octopus at Taverna Giorgos',
        'Buy souma fig spirit from Yiannis distillery',
      ],
      mooringTip:
        'Stern-to in Emporio harbour, €20-30/night, sheltered from N. Pontamos anchor on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/chalki.webp', alt: 'Chalki' }],
    },
    {
      id: 'chalki-lindos',
      routeFrom: 'Chalki',
      routeTo: 'Lindos (Rhodes)',
      day: 12,
      mapPin: {
        desktop: { left: 69, top: 75.6 },
        mobile: { left: 74.5, top: 69.1 },
      },
      description:
        "32 nm east to Lindos — second-largest town on Rhodes after the capital. Acropolis of Lindos (5th-century BC Athena temple) on the cliff above. Anchor in St Paul's Bay south of the village; Lindos has no town quay. No town quay at Lindos.",
      shortDescription:
        "32 nm east to Lindos. Acropolis of Lindos (5th-c BC Athena temple) on cliff. No town quay; anchor in St Paul's Bay south. No town quay at Lindos.",
      thingsToDo: [
        'Hike up to the Acropolis of Lindos',
        "Swim St Paul's Bay (rock-lined turquoise crescent)",
        'Melekouni sesame-honey bars at a rooftop taverna',
        'Walk the white-cube alleys at sunset',
      ],
      mooringTip:
        "Anchor in St Paul's Bay on sand at 4-6 m, sheltered from N. No town quay at Lindos. Lardos Bay 2 nm south alternative.",
      gallery: [{ src: '/images/itinerary/greece/destinations/lindos.webp', alt: 'Lindos' }],
    },
    {
      id: 'lindos-rhodes-town',
      routeFrom: 'Lindos',
      routeTo: 'Rhodes Town',
      day: 13,
      mapPin: {
        desktop: { left: 77.4, top: 80 },
        mobile: { left: 77.2, top: 75.5 },
      },
      description:
        '20 nm north back to Mandraki Marina at Rhodes. Old Town (UNESCO, the largest inhabited medieval town in Europe) is the headline shore activity. Refuel at Mandraki before tying up. Refuel at the entrance fuel berth before mooring. Plan to walk the Street of the Knights (UNESCO) and visit the Palace of the Grand Master.',
      shortDescription:
        '20 nm north back to Mandraki Marina. Old Town (UNESCO, largest inhabited medieval town in Europe). Refuel before mooring. Highlights: Walk the Street of the Knights (UNESCO) and Visit the Palace of the Grand Master.',
      thingsToDo: [
        'Walk the Street of the Knights (UNESCO)',
        'Visit the Palace of the Grand Master',
        'Swim Anthony Quinn Bay (south of Mandraki)',
        'Cocktails at Socratous Garden hidden courtyard',
      ],
      mooringTip:
        'Mandraki Marina stern-to with lazy lines, €60-90/night. Refuel at the entrance fuel berth before mooring.',
      gallery: [{ src: '/images/itinerary/greece/destinations/rhodes.webp', alt: 'Rhodes' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Rhodes',
      routeTo: 'Check-out',
      day: 14,
      description:
        'Handover at Mandraki Marina before 09:00. Inspection — deposit released within 7 days. RHO airport 30 min by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and walk medieval Old Town Knights Street.',
      shortDescription:
        'Handover before 09:00 at Mandraki Marina. Inspection, deposit release within 7 days. RHO airport 30 min by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and walk medieval Old Town Knights Street.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Walk medieval Old Town Knights Street',
        'Coffee at Marco Polo Café (Old Town)',
        'Airport transfer (30 min from Mandraki)',
      ],
      mooringTip: 'Hand over at Mandraki Marina before 09:00. Deposit released within 7 days post-inspection.',
      gallery: [{ src: '/images/itinerary/greece/destinations/rhodes.webp', alt: 'Rhodes' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/dodecanese-itinerary/map.webp',
        alt: 'Skiathos Route Image',
      },
      width: 1065,
      height: 938,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/dodecanese-itinerary/mobile-map.webp',
        alt: 'Skiathos Route Image',
      },
      width: 809,
      height: 1077,
    },
  },
};

export default computeItineraryNumberOfDays(rhodes14DaysRoute);
