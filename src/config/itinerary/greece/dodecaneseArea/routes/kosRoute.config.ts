import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const kosRoute: ItineraryRoute = {
  metaTitle: '7-Day Kos Yacht Charter Itinerary | Dodecanese Sailing Route',
  metaDesc:
    'Sail a 7-day yacht charter from Kos via Leros, Patmos, Lipsi, Arki and Kalymnos — northern Dodecanese loop with sponge-diving heritage and Byzantine pilgrimage sites.',
  id: 'kos',
  startingPoint: 'Kos',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/greece/dodecanese-itinerary/routes/kos.webp',
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
      id: 'kos-leros',
      routeFrom: 'Kos Marina',
      routeTo: 'Leros',
      day: 1,
      mapPin: {
        desktop: { left: 59, top: 41.7 },
        mobile: { left: 58.2, top: 41.4 },
      },
      description:
        '32 nm shake-down NNW from Kos Marina along the limestone west coast of Kalymnos. The Dodecanese summer wind regime is the Meltemi from N — at this latitude consistently 18-25 knots in afternoon, building from 13:00. Lakki on the south coast of Leros is one of the largest natural harbours in the Mediterranean and a sheltered overnight; Agia Marina town quay on the north coast is the alternative for the photogenic pastel waterfront scene.',
      shortDescription:
        '32 nm shake-down NNW to Leros along Kalymnos west coast. Lakki bay (south) is huge and sheltered; Agia Marina (north) is photogenic but exposed in N Meltemi above 22 kn.',
      thingsToDo: [
        'Walk Lakki Art Deco quay (1930s Italian fascist architecture)',
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
      day: 2,
      mapPin: {
        desktop: { left: 43.7, top: 28.7 },
        mobile: { left: 40.5, top: 31.1 },
      },
      description:
        '22 nm north to Patmos. Skala harbour on the east coast is the standard charter overnight — large quay, sheltered from N. Patmos is the UNESCO-listed Greek Orthodox pilgrimage island; the Cave of the Apocalypse (where St John dictated the Book of Revelation in AD 95) and the 11th-century Monastery of St John are both on the road from Skala up to Chora.',
      shortDescription:
        '22 nm north to Patmos. Skala harbour on the east coast — large quay, sheltered from N. Cave of the Apocalypse + Monastery of St John (UNESCO) on the road up to Chora.',
      thingsToDo: [
        'Walk to the Cave of the Apocalypse (UNESCO)',
        'Visit the 11th-c Monastery of St John',
        'Swim Psili Ammos golden-sand beach (south)',
        'Mastiha cocktails in Chora alleys',
      ],
      mooringTip:
        'Stern-to in Skala harbour, €30-50/night. Large quay, sheltered from N. Anchorage in Grikos Bay south coast is the alternative for swim-anchorage.',
      gallery: [{ src: '/images/itinerary/greece/destinations/patmos.webp', alt: 'Patmos' }],
    },
    {
      id: 'patmos-lipsi',
      routeFrom: 'Patmos',
      routeTo: 'Lipsi',
      day: 3,
      mapPin: {
        desktop: { left: 33.7, top: 18.5 },
        mobile: { left: 28.9, top: 23.6 },
      },
      description:
        '12 nm southeast to Lipsi — small island archipelago, 700 residents. Lipsi town harbour stern-to is the only quay; small, family tavernas on the waterfront, single bakery, single church-clock-tower square. Aspronissi Bay 2 nm east is the headline snorkel anchorage.',
      shortDescription:
        '12 nm SE to Lipsi — quiet island, 700 residents, single bakery, family tavernas. Aspronissi Bay 2 nm east is the headline snorkel anchorage. Stern-to in Lipsi town quay, €15-25/night, sheltered from N. Plan to walk to Chapel of Panagia (single rock) and lipsiako cheese with thyme honey at a taverna.',
      thingsToDo: [
        'Snorkel Aspronissi Bay (2 nm east)',
        'Walk to Chapel of Panagia (single rock)',
        'Lipsiako cheese with thyme honey at a taverna',
        'Buy fresh koulouria sesame rings at the village bakery',
      ],
      mooringTip:
        'Stern-to in Lipsi town quay, €15-25/night, sheltered from N. Anchor in Aspronissi Bay on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lipsi.webp', alt: 'Lipsi' }],
    },
    {
      id: 'lipsi-arki',
      routeFrom: 'Lipsi',
      routeTo: 'Arki',
      day: 4,
      mapPin: {
        desktop: { left: 41.3, top: 19.1 },
        mobile: { left: 42.1, top: 20.2 },
      },
      description:
        '8 nm short hop east to Arki — population 40, no scheduled ferry, single taverna on the harbour. Tiganakia Bay on the south coast is the headline anchorage of the entire Dodecanese — turquoise shallows over white sand, sheltered from N. Stavento taverna at the harbour is the only restaurant; the fisherman-chef brings the day catch direct.',
      shortDescription:
        '8 nm short hop east to Arki — population 40, single taverna. Tiganakia Bay south coast is the headline anchorage of the entire Dodecanese — turquoise shallows.',
      thingsToDo: [
        'Anchor swim at Tiganakia Bay turquoise shallows',
        'Hike to the mountaintop Panagia chapel',
        'Lobster astakomakaronada at Stavento taverna',
        'Read on deck under the cicadas',
      ],
      mooringTip:
        'Stern-to in Arki harbour, €15-20/night, sheltered from N. Anchor in Tiganakia Bay on sand at 3-5 m for the headline swim anchorage.',
      gallery: [{ src: '/images/itinerary/greece/destinations/arki.webp', alt: 'Arki' }],
    },
    {
      id: 'arki-kalymnos',
      routeFrom: 'Arki',
      routeTo: 'Kalymnos',
      day: 5,
      mapPin: {
        desktop: { left: 39.2, top: 15.2 },
        mobile: { left: 38, top: 15.4 },
      },
      description:
        '22 nm south to Kalymnos — sponge-diving heritage island, world-class limestone climbing routes (Kalymnos hosts the annual climbing festival each October). Pothia harbour on the south coast is the main charter overnight; the cliffs of Telendos islet are visible 1 nm west, the climbing zones at Massouri and Armeos on the west coast are accessible by road from Pothia.',
      shortDescription:
        '22 nm south to Kalymnos — sponge-diving + world-class climbing. Pothia harbour for overnight; Telendos islet 1 nm west; climbing zones at Massouri/Armeos west coast.',
      thingsToDo: [
        "Climb the Grande Grotta limestone cliff (route guide at Climber's Nest cafe)",
        'Snorkel Vathy Bay turquoise inlet',
        'Visit the Sponge Diving Museum at Pothia',
        'Mououri stuffed squid at a Pothia ouzeri',
      ],
      mooringTip:
        'Stern-to in Pothia harbour, €30-50/night, sheltered from N. Vathy on the east coast is the alternative for sheltered fjord-like inlet.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kalymnos.webp', alt: 'Kalymnos' }],
    },
    {
      id: 'kalymnos-kos',
      routeFrom: 'Kalymnos',
      routeTo: 'Kos Marina',
      day: 6,
      mapPin: {
        desktop: { left: 47.8, top: 37.8 },
        mobile: { left: 48.4, top: 36 },
      },
      description:
        '15 nm south back to Kos Marina. Optional swim stop at Pserimos (small island halfway, sand 4-6 m, sheltered from N). Kos Marina is the largest charter base in the Dodecanese — full services, fuel berth, lazy lines, well-protected from any direction. Refuel before tying up.',
      shortDescription:
        '15 nm south back to Kos Marina. Optional Pserimos swim stop halfway. Kos Marina largest charter base in the Dodecanese; refuel before tying up. Kos Marina stern-to with lazy lines, €60-90/night; Confirm handover slot 24h ahead.',
      thingsToDo: [
        'Optional Pserimos swim stop',
        'Walk Kos Town Asklepion ruins',
        'Swim Therma Beach hot springs (south coast)',
        'Kleftiko slow-cooked lamb under the 2400-year plane tree',
      ],
      mooringTip:
        'Kos Marina stern-to with lazy lines, €60-90/night. Refuel at the entrance fuel berth before mooring. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kos.webp', alt: 'Kos' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Kos',
      routeTo: 'Check-out',
      day: 7,
      description:
        'Handover at Kos Marina before 09:00. Boat inspection — deposit released within 7 days. Crew transfer to Kos airport (KGS) is 25 minutes by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Tigaki Beach (north coast).',
      shortDescription:
        'Handover before 09:00 at Kos Marina. Inspection, deposit release within 7 days. KGS airport 25 min by road. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Tigaki Beach (north coast).',
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
        alt: 'Kos Route Image',
      },
      width: 1065,
      height: 938,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/dodecanese-itinerary/mobile-map.webp',
        alt: 'Kos Route Image',
      },
      width: 809,
      height: 1077,
    },
  },
};

export default computeItineraryNumberOfDays(kosRoute);
