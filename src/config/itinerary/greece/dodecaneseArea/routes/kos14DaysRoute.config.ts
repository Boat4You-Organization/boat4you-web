import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const kos14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Kos Round-Trip Yacht Charter | Dodecanese Sailing',
  metaDesc:
    'Sail a 14-day yacht charter from Kos via Kalymnos, Leros, Patmos, Fourni, Lipsi, Levitha, Astypalaia, Nisyros, Tilos, Chalki, Rhodes and Symi. Full Dodecanese grand tour.',
  id: 'kos-14-days',
  startingPoint: 'Kos',
  otherPoints: ['14 days'],
  cardImage: {
    src: '/images/itinerary/greece/dodecanese-itinerary/routes/kos-14-days.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/kos-town-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/kos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/kalymnos-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/kalymnos-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'kos-kalymnos',
      routeFrom: 'Kos Marina',
      routeTo: 'Kalymnos',
      day: 1,
      mapPin: {
        desktop: { left: 60.2, top: 42.4 },
        mobile: { left: 57.6, top: 40.2 },
      },
      description:
        '15 nm shake-down north to Kalymnos. Pothia harbour on the south coast is the standard charter overnight; the cliffs of Telendos islet are visible 1 nm west. Kalymnos hosts the annual climbing festival each October; world-class limestone routes at Massouri and Armeos on the west coast accessible by road.',
      shortDescription:
        '15 nm shake-down north to Kalymnos. Pothia harbour for overnight; Telendos islet 1 nm west. World-class limestone climbing on the west coast. Stern-to in Pothia harbour, €30-50/night; Vathy on the east coast is the alternative for sheltered fjord-like inlet.',
      thingsToDo: [
        'Climb Grande Grotta limestone cliff',
        'Snorkel Vathy Bay turquoise inlet',
        'Visit the Sponge Diving Museum at Pothia',
        'Mououri stuffed squid at a Pothia ouzeri',
      ],
      mooringTip:
        'Stern-to in Pothia harbour, €30-50/night. Vathy on the east coast is the alternative for sheltered fjord-like inlet.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kalymnos.webp', alt: 'Kalymnos' }],
    },
    {
      id: 'kalymnos-leros',
      routeFrom: 'Kalymnos',
      routeTo: 'Leros',
      day: 2,
      mapPin: {
        desktop: { left: 49.1, top: 39.3 },
        mobile: { left: 43.1, top: 37.7 },
      },
      description:
        '12 nm north to Leros. Lakki on the south coast is one of the largest natural harbours in the Mediterranean; sheltered, Italian-fascist Art Deco quay architecture from the 1930s. Agia Marina town quay on the north coast is the alternative for the photogenic pastel waterfront.',
      shortDescription:
        '12 nm north to Leros. Lakki bay (south) is one of the largest natural harbours in the Mediterranean. Agia Marina (north) is photogenic but exposed in Meltemi.',
      thingsToDo: [
        'Walk Lakki Art Deco quay (1930s architecture)',
        'Climb to Panteli Castle for the panorama',
        'Swim Xerokambos Beach (south coast)',
        'Pitaroudia chickpea fritters at a quay taverna',
      ],
      mooringTip:
        'Lakki Marina stern-to with lazy lines, €40-60/night, fully sheltered. Agia Marina town quay €25-40/night but exposed in N Meltemi above 22 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/leros.webp', alt: 'Leros' }],
    },
    {
      id: 'leros-patmos',
      routeFrom: 'Leros',
      routeTo: 'Patmos',
      day: 3,
      mapPin: {
        desktop: { left: 45.3, top: 29.5 },
        mobile: { left: 38.8, top: 30 },
      },
      description:
        '12 nm north to Patmos. Skala harbour on the east coast is the standard charter overnight — large quay, sheltered from N. The Cave of the Apocalypse and 11th-century Monastery of St John (UNESCO) are both on the road from Skala up to Chora.',
      shortDescription:
        '12 nm north to Patmos. Skala harbour on the east coast — large quay, sheltered from N. UNESCO Cave of the Apocalypse + 11th-c Monastery on the road to Chora.',
      thingsToDo: [
        'Walk to the Cave of the Apocalypse (UNESCO)',
        'Visit the 11th-c Monastery of St John',
        'Swim Psili Ammos golden-sand beach',
        'Mastiha cocktails in Chora alleys',
      ],
      mooringTip: 'Stern-to in Skala harbour, €30-50/night. Large quay, sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/patmos.webp', alt: 'Patmos' }],
    },
    {
      id: 'patmos-fourni',
      routeFrom: 'Patmos',
      routeTo: 'Fourni',
      day: 4,
      mapPin: {
        desktop: { left: 33.3, top: 19.7 },
        mobile: { left: 45.6, top: 19 },
      },
      description:
        '24 nm northwest to Fourni — small archipelago between Ikaria and Samos, formerly a pirate hideout. Fourni Korseon harbour is the only practical overnight, sheltered from N. Quiet island stop — fewer charter boats reach this far north. Anchor in Kambi Bay on sand at 4-6 m as alternative. Plan to hike to the Christos Chapel viewpoint and anchor swim at Petrokopio Bay (boat-only access).',
      shortDescription:
        '24 nm NW to Fourni — small archipelago, former pirate hideout. Fourni Korseon harbour for overnight, sheltered from N. Quiet stop, few charter boats. Anchor in Kambi Bay on sand at 4-6 m as alternative.',
      thingsToDo: [
        'Hike to the Christos Chapel viewpoint',
        'Anchor swim at Petrokopio Bay (boat-only access)',
        'Lobster astakomakaronada at a Kambi taverna',
        'Buy hand-carved wooden boat models from local craftsmen',
      ],
      mooringTip:
        'Stern-to in Fourni Korseon harbour, €20-30/night, sheltered from N. Anchor in Kambi Bay on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/fourni.webp', alt: 'Fourni' }],
    },
    {
      id: 'fourni-lipsi',
      routeFrom: 'Fourni',
      routeTo: 'Lipsi',
      day: 5,
      mapPin: {
        desktop: { left: 30.9, top: 5.1 },
        mobile: { left: 30.4, top: 4.4 },
      },
      description:
        '22 nm south to Lipsi — small island archipelago, 700 residents. Lipsi town harbour stern-to is the only quay; family tavernas on the waterfront, single bakery, single church-clock-tower square. Aspronissi Bay 2 nm east is the headline snorkel anchorage. Plan to snorkel Aspronissi Bay (2 nm east), walk to Chapel of Panagia (single rock), lipsiako cheese with thyme honey at a taverna.',
      shortDescription:
        '22 nm south to Lipsi — quiet island, 700 residents. Single bakery, family tavernas. Aspronissi Bay 2 nm east is the headline snorkel anchorage. Stern-to in Lipsi town quay, €15-25/night, sheltered from N. Plan to walk to Chapel of Panagia (single rock) and lipsiako cheese with thyme honey at a taverna.',
      thingsToDo: [
        'Snorkel Aspronissi Bay (2 nm east)',
        'Walk to Chapel of Panagia (single rock)',
        'Lipsiako cheese with thyme honey at a taverna',
        'Buy fresh koulouria at the village bakery',
      ],
      mooringTip:
        'Stern-to in Lipsi town quay, €15-25/night, sheltered from N. Anchor in Aspronissi Bay on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lipsi.webp', alt: 'Lipsi' }],
    },
    {
      id: 'lipsi-levitha',
      routeFrom: 'Lipsi',
      routeTo: 'Levitha',
      day: 6,
      mapPin: {
        desktop: { left: 40.5, top: 16.2 },
        mobile: { left: 42.7, top: 11.9 },
      },
      description:
        '22 nm west to Levitha — population 6, no scheduled ferry, no ATM, single goat-herding family running the only taverna. Ammoudi Bay anchorage on sand at 5-7 m, fully sheltered from N. The night sky here is the darkest in the central Aegean.',
      shortDescription:
        '22 nm west to Levitha — population 6, no ferry, no ATM. Ammoudi Bay anchorage fully sheltered from N. Darkest night sky in the central Aegean.',
      thingsToDo: [
        'Help the goat-herders at the family farm',
        'Anchor swim at Ammoudi Bay sand bottom',
        'Astakomakaronada at the only taverna on the island',
        'Stargaze on deck — no light pollution',
      ],
      mooringTip:
        'Free anchoring in Ammoudi Bay on sand at 5-7 m. Fully sheltered from N. No services — bring cash, no ATM on the island.',
      gallery: [{ src: '/images/itinerary/greece/destinations/levitha.webp', alt: 'Levitha' }],
    },
    {
      id: 'levitha-astypalaia',
      routeFrom: 'Levitha',
      routeTo: 'Astypalaia',
      day: 7,
      mapPin: {
        desktop: { left: 29.9, top: 34.6 },
        mobile: { left: 24.9, top: 34.6 },
      },
      description:
        '22 nm south to Astypalaia — butterfly-shaped island, the geographic westernmost of the Dodecanese. Pera Gialos harbour on the east side of the kastro is the standard overnight; the Venetian castle of Querini sits on the cliff above. Vatses Beach south coast for sand-and-pebble swim.',
      shortDescription:
        '22 nm south to Astypalaia — butterfly-shaped island, westernmost Dodecanese. Pera Gialos harbour for overnight; Venetian Querini castle on the cliff above. Stern-to in Pera Gialos harbour, €25-40/night, sheltered from N. Plan to swim Vatses Beach (south coast, sand) and ladenia tomato pie at Kaminakia Taverna.',
      thingsToDo: [
        'Walk Chora Venetian castle of Querini',
        'Swim Vatses Beach (south coast, sand)',
        'Ladenia tomato pie at Kaminakia Taverna',
        'Search for Roman mosaics near Mesa Nisi',
      ],
      mooringTip:
        'Stern-to in Pera Gialos harbour, €25-40/night, sheltered from N. Maltezana on the south coast is the alternative for sheltered anchorage.',
      gallery: [{ src: '/images/itinerary/greece/destinations/palaia.webp', alt: 'Palaia' }],
    },
    {
      id: 'astypalaia-nisyros',
      routeFrom: 'Astypalaia',
      routeTo: 'Nisyros',
      day: 8,
      mapPin: {
        desktop: { left: 25.5, top: 58.9 },
        mobile: { left: 22.9, top: 51 },
      },
      description:
        '38 nm long beam-reach southeast to Nisyros — active volcanic island. Pali harbour on the north coast is the standard overnight, sheltered from N. The Stefanos crater on the inland caldera floor is a hike from the ridge road and one of the more dramatic shore activities in the Dodecanese.',
      shortDescription:
        '38 nm long beam reach SE to Nisyros — active volcanic island. Pali harbour north coast for overnight. Stefanos crater hike is the headline. Stern-to in Pali harbour, €25-35/night, sheltered from N; Mandraki west coast is the alternative; smaller, exposed in NW wind.',
      thingsToDo: [
        'Hike into the Stefanos volcanic crater',
        'Walk Mandraki cobblestone alleys',
        'Soak in Loutra natural thermal springs',
        'Buy local capers (volcanic-soil grown)',
      ],
      mooringTip:
        'Stern-to in Pali harbour, €25-35/night, sheltered from N. Mandraki west coast is the alternative; smaller, exposed in NW wind.',
      gallery: [{ src: '/images/itinerary/greece/destinations/nisyros.webp', alt: 'Nisyros' }],
    },
    {
      id: 'nisyros-tilos',
      routeFrom: 'Nisyros',
      routeTo: 'Tilos',
      day: 9,
      mapPin: {
        desktop: { left: 55, top: 57.7 },
        mobile: { left: 58.6, top: 55.5 },
      },
      description:
        '15 nm east to Tilos — first zero-waste island in Greece (powered by solar + wind, no plastic bags allowed since 2018). Livadia harbour on the east coast is the standard overnight. Mikro Chorio is a 19th-century abandoned mountain village rebuilt as a single taverna-and-bar destination.',
      shortDescription:
        '15 nm east to Tilos — first zero-waste island in Greece. Livadia harbour east coast for overnight. Mikro Chorio abandoned village is the headline. Stern-to in Livadia harbour, €20-30/night, sheltered from N; Eristos Bay south coast is the alternative.',
      thingsToDo: [
        'Hike to Agios Panteleimon monastery',
        'Mikro Chorio abandoned village taverna at night',
        'Mizithra cheese with thyme honey at a hilltop kafeneio',
        'Tilos organic wine tasting',
      ],
      mooringTip:
        'Stern-to in Livadia harbour, €20-30/night, sheltered from N. Eristos Bay south coast is the alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tilos.webp', alt: 'Tilos' }],
    },
    {
      id: 'tilos-chalki',
      routeFrom: 'Tilos',
      routeTo: 'Chalki',
      day: 10,
      mapPin: {
        desktop: { left: 63.1, top: 64.6 },
        mobile: { left: 68.6, top: 63 },
      },
      description:
        "15 nm south to Chalki — small island west of Rhodes, car-free village, 300 residents. Pontamos Cove 1 nm east is the headline snorkel anchorage. Knights' Castle on the ridge above the village is the medieval fortification. Stern-to in Emporio harbour, €20-30/night, sheltered from N. Pontamos anchor on sand at 4-6 m for swim alternative.",
      shortDescription:
        '15 nm south to Chalki — car-free village, 300 residents. Emporio quay; Pontamos Cove 1 nm east for snorkel. Stern-to in Emporio harbour, €20-30/night, sheltered from N; Pontamos anchor on sand at 4-6 m for swim alternative.',
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
      id: 'chalki-rhodes',
      routeFrom: 'Chalki',
      routeTo: 'Rhodes',
      day: 11,
      mapPin: {
        desktop: { left: 69.6, top: 74.7 },
        mobile: { left: 79, top: 73.4 },
      },
      description:
        '32 nm east to Mandraki Marina at Rhodes. Rhodes Old Town (UNESCO, the largest inhabited medieval town in Europe) is the headline shore activity — Knights Street, Palace of the Grand Master, the medieval walls. Anchor swim at Anthony Quinn Bay south of Mandraki on the way.',
      shortDescription:
        '32 nm east to Mandraki Marina, Rhodes. Old Town (UNESCO, largest inhabited medieval town in Europe). Anthony Quinn Bay swim stop on the way. Refuel at the entrance fuel berth before mooring. Plan to walk the Street of the Knights (UNESCO) and visit the Palace of the Grand Master.',
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
      id: 'rhodes-symi',
      routeFrom: 'Rhodes',
      routeTo: 'Symi',
      day: 12,
      mapPin: {
        desktop: { left: 94, top: 64.9 },
        mobile: { left: 89, top: 64.5 },
      },
      description:
        "24 nm NNW to Symi — most photographed neoclassical waterfront in the Dodecanese, ochre and peach captains' mansions on tiered slopes. Inner quay stern-to fills by 16:00 in peak; Pedi Bay 2 nm east of the town is the alternative.",
      shortDescription:
        '24 nm NNW to Symi — most photographed Dodecanese harbour. Inner quay fills by 16:00; Pedi Bay 2 nm east is the alternative. Highlights: Walk to the 18th-c Panormitis Monastery and Buy fresh sponges from harbour stalls.',
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
      id: 'symi-kos',
      routeFrom: 'Symi',
      routeTo: 'Kos',
      day: 13,
      mapPin: {
        desktop: { left: 81.1, top: 56 },
        mobile: { left: 86.6, top: 50.6 },
      },
      description:
        '38 nm long beam-reach northwest back to Kos Marina. Largest charter base in the Dodecanese, full services, fuel berth. Refuel before tying up. Last evening: kleftiko slow-cooked lamb on Platia Platanou under the 2400-year plane tree. Kos Marina stern-to with lazy lines, €60-90/night. Plan to walk Kos Town Asklepion ruins and swim Therma Beach hot springs.',
      shortDescription:
        '38 nm long beam reach NW back to Kos Marina. Largest charter base. Refuel before mooring. Last evening kleftiko under the 2400-year plane tree. Kos Marina stern-to with lazy lines, €60-90/night; Confirm handover slot 24h ahead.',
      thingsToDo: [
        'Walk Kos Town Asklepion ruins',
        'Swim Therma Beach hot springs',
        'Kleftiko slow-cooked lamb on Platia Platanou',
        'Refuel and clean the boat at Kos Marina',
      ],
      mooringTip:
        'Kos Marina stern-to with lazy lines, €60-90/night. Refuel at entrance fuel berth before mooring. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kos.webp', alt: 'Kos' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Kos',
      routeTo: 'Check-out',
      day: 14,
      description:
        'Handover at Kos Marina before 09:00. Inspection — deposit released within 7 days. KGS airport 25 minutes by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Tigaki Beach (north coast).',
      shortDescription:
        'Handover before 09:00. Inspection, deposit release within 7 days. KGS airport 25 min by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Tigaki Beach (north coast).',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Tigaki Beach (north coast)',
        'Coffee at a Kos Town café',
        'Airport transfer (25 min from Kos Marina)',
      ],
      mooringTip: 'Hand over at Kos Marina before 09:00. Deposit released within 7 days post-inspection.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kos.webp', alt: 'Kos' }],
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

export default computeItineraryNumberOfDays(kos14DaysRoute);
