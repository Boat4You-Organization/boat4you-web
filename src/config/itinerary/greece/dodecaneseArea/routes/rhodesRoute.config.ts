import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const rhodesRoute: ItineraryRoute = {
  metaTitle: 'Rhodes to Dodecanese Yacht Charter Route | 7-Day Sailing from Rhodes',
  metaDesc:
    'Sail a 7-day yacht charter from Rhodes via Symi, Nisyros, Kos, Tilos and Chalki — southern Dodecanese loop with medieval harbours, volcanic islands and Knights heritage.',
  id: 'rhodes-route',
  startingPoint: 'Rhodes',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/greece/dodecanese-itinerary/routes/rhodes.webp',
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
        desktop: { left: 92.8, top: 65.2 },
        mobile: { left: 89.2, top: 65.2 },
      },
      description:
        "24 nm shake-down NNW to Symi from Mandraki Marina at Rhodes. Symi harbour is the most photographed neoclassical waterfront in the Dodecanese — ochre and peach captains' mansions on tiered slopes. Stern-to on the inner quay, €30-50/night, slot fills by 16:00 in peak. Anchor in Pedi Bay 2 nm east of the town if quay is full.",
      shortDescription:
        '24 nm shake-down NNW to Symi. Most photographed Dodecanese harbour, neoclassical mansions on tiered slopes. Inner quay fills by 16:00; Pedi Bay 2 nm east is the alternative.',
      thingsToDo: [
        'Walk to the 18th-c Panormitis Monastery (south end of island)',
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
        desktop: { left: 81.7, top: 56.2 },
        mobile: { left: 81.5, top: 53.5 },
      },
      description:
        '32 nm west to Nisyros — active volcanic island, the Stefanos crater on the inland caldera floor is a hike from the ridge road and one of the more dramatic shore activities in the Dodecanese. Pali harbour on the north coast is the standard charter overnight — small marina, sheltered from N. Mandraki port on the west coast is the alternative.',
      shortDescription:
        '32 nm west to Nisyros — active volcanic island. Pali harbour north coast for overnight; Mandraki west coast alternative. Stefanos crater hike is the headline.',
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
      id: 'nisyros-kos',
      routeFrom: 'Nisyros',
      routeTo: 'Kos',
      day: 3,
      mapPin: {
        desktop: { left: 55.2, top: 55.2 },
        mobile: { left: 52.8, top: 50.9 },
      },
      description:
        '15 nm north to Kos Marina — largest charter base in the Dodecanese, full services, fuel berth, lazy lines, well-protected from any direction. Walk to Kos Town for the 4th-century BC Asklepion ruins, the 2400-year-old plane tree on Platia Platanou, and the Roman Therma Beach hot springs 5 km south.',
      shortDescription:
        '15 nm north to Kos. Largest Dodecanese charter base; full services, fuel berth. Asklepion ruins, 2400-year plane tree, Therma hot springs all from Kos Town.',
      thingsToDo: [
        'Walk Kos Town Asklepion ruins (4th-c BC)',
        'Sit under the 2400-year plane tree on Platia Platanou',
        'Swim Therma Beach hot springs (south coast)',
        'Kleftiko slow-cooked lamb at a Kos Town taverna',
      ],
      mooringTip:
        'Kos Marina stern-to with lazy lines, €60-90/night. Refuel at entrance fuel berth before mooring. Lambi marina on the north coast is the smaller alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kos.webp', alt: 'Kos' }],
    },
    {
      id: 'kos-tilos',
      routeFrom: 'Kos',
      routeTo: 'Tilos',
      day: 4,
      mapPin: {
        desktop: { left: 59.3, top: 42.2 },
        mobile: { left: 55.7, top: 41.5 },
      },
      description:
        '22 nm south to Tilos — the first zero-waste island in Greece (powered by solar + wind, no plastic bags allowed since 2018). Livadia harbour on the east coast is the standard overnight, sheltered from N. Mikro Chorio is a 19th-century abandoned mountain village rebuilt as a single taverna-and-bar destination — accessed by road from Livadia.',
      shortDescription:
        '22 nm south to Tilos — first zero-waste island in Greece. Livadia harbour east coast for overnight. Mikro Chorio abandoned village (now taverna) is the headline shore activity.',
      thingsToDo: [
        'Hike to Agios Panteleimon monastery (cliff path)',
        'Mikro Chorio abandoned village taverna at night',
        'Mizithra cheese with thyme honey at a hilltop kafeneio',
        'Tilos organic wine tasting (solar-powered vineyards)',
      ],
      mooringTip:
        'Stern-to in Livadia harbour, €20-30/night, sheltered from N. Eristos Bay on the south coast is the alternative for sand-bottom anchorage.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tilos.webp', alt: 'Tilos' }],
    },
    {
      id: 'tilos-chalki',
      routeFrom: 'Tilos',
      routeTo: 'Chalki',
      day: 5,
      mapPin: {
        desktop: { left: 63.8, top: 65.5 },
        mobile: { left: 60.2, top: 56.5 },
      },
      description:
        "15 nm south to Chalki — small island west of Rhodes, car-free village, 300 residents, the harbour at Emporio is the only quay. Pontamos Cove 1 nm east is the headline swim anchorage — neon-blue water, snorkel-friendly. Knights' Castle on the ridge above the village is the medieval fortification.",
      shortDescription:
        '15 nm south to Chalki — car-free village, 300 residents. Emporio quay for overnight; Pontamos Cove 1 nm east is the headline snorkel anchorage. Stern-to in Emporio harbour, €20-30/night, sheltered from N.',
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
      id: 'chalki-rhodes-lindos',
      routeFrom: 'Chalki',
      routeTo: 'Rhodes (Lindos)',
      day: 6,
      mapPin: {
        desktop: { left: 70.1, top: 73.9 },
        mobile: { left: 73.7, top: 73.4 },
      },
      description:
        "32 nm east to Lindos — the second-largest town on Rhodes after the capital, the Acropolis of Lindos (5th-century BC Athena temple) sits on the cliff above. Anchor in St Paul's Bay (south of the village) for swim before mooring; Lindos has no town quay, the standard overnight is anchor in St Paul's Bay.",
      shortDescription:
        "32 nm east to Lindos — Acropolis of Lindos (5th-c BC Athena temple) on the cliff. No town quay; anchor in St Paul's Bay south of village for overnight.",
      thingsToDo: [
        'Hike up to the Acropolis of Lindos',
        "Swim St Paul's Bay (rock-lined turquoise crescent)",
        'Melekouni sesame-honey bars at a rooftop taverna',
        'Walk the white-cube alleys at sunset',
      ],
      mooringTip:
        "Anchor in St Paul's Bay on sand at 4-6 m, sheltered from N. No town quay at Lindos. Lardos Bay 2 nm south is the alternative if SPB is full.",
      gallery: [{ src: '/images/itinerary/greece/destinations/lindos.webp', alt: 'Lindos' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Rhodes',
      routeTo: 'Check-out',
      day: 7,
      description:
        'Sail back to Mandraki Marina at Rhodes (20 nm north along the east coast). Handover before 09:00 the following morning. Inspection — deposit released within 7 days. Rhodes airport (RHO) is 30 minutes by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and walk the medieval Old Town Knights Street.',
      shortDescription:
        'Handover before 09:00 at Mandraki Marina, Rhodes. Inspection, deposit release within 7 days. RHO airport 30 min by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and walk the medieval Old Town Knights Street.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Walk the medieval Old Town Knights Street',
        'Coffee at Marco Polo Café (Old Town)',
        'Airport transfer (30 min from Mandraki)',
      ],
      mooringTip: 'Hand over at Mandraki Marina before 09:00. Deposit released within 7 days post-inspection.',
      gallery: [{ src: '/images/itinerary/greece/destinations/rhodes-town.webp', alt: 'Rhodes' }],
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

export default computeItineraryNumberOfDays(rhodesRoute);
