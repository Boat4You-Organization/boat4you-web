import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const mykonosNaxosParosRoute: ItineraryRoute = {
  metaTitle: '7-Day Mykonos–Naxos–Paros Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Mykonos via Naxos and Paros, returning through Sifnos, Serifos and Syros — central Cyclades downwind loop with Meltemi-confident sailing.',
  id: 'mykonos-naxos-paros',
  startingPoint: 'Mykonos',
  otherPoints: ['Naxos', 'Paros'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/mykonos-naxos-paros.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/mykonos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/serifos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/syros-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/serifos-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'mykonos-naxos',
      routeFrom: 'Mykonos (Tourlos Marina)',
      routeTo: 'Naxos',
      day: 1,
      mapPin: {
        desktop: { left: 71.6, top: 27.9 },
        mobile: { left: 71.3, top: 30.5 },
      },
      description:
        '22 nm south to Naxos. The leg passes the Delos archaeological site to starboard — possible to day-anchor at the south side for 3-4 hours but only viable if the start time allows arrival at Naxos before 18:00. Naxos town harbour is well-protected and stern-to is reliable; the Portara — a single marble doorway from the unfinished 6th-century BC Apollo temple — sits on the small islet at the harbour entrance and is the headline sunset spot.',
      shortDescription:
        '22 nm south to Naxos. Optional Delos detour if start time allows. Naxos town harbour is well-protected; Portara marble doorway at the entrance is the headline sunset.',
      thingsToDo: [
        'Sunset at the Portara marble doorway',
        'Hike Mount Zas (Zeus birthplace, 4 h)',
        'Kitro citron liqueur tasting at Halki',
        'Swim Agios Prokopios Beach',
      ],
      mooringTip:
        'Stern-to in Naxos town harbour, €30-50/night. Well-protected from any wind direction. Plenty of slot capacity even in peak season.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Naxos' }],
    },
    {
      id: 'naxos-paros',
      routeFrom: 'Naxos',
      routeTo: 'Paros (Parikia Harbor)',
      day: 2,
      mapPin: {
        desktop: { left: 73.7, top: 49.3 },
        mobile: { left: 72.7, top: 47.9 },
      },
      description:
        'Short 6 nm hop west across the Naxos-Paros channel. Parikia is the larger of the two main Paros harbours, more reliable mooring than Naoussa, and the site of the 4th-century Panagia Ekatontapiliani (Church of a Hundred Doors). Day-anchor at Antiparos east coast for a swim before mooring. The shallow channel between Paros and Antiparos is one of the prettier swim spots in the central Cyclades.',
      shortDescription:
        '6 nm short hop west to Paros (Parikia). Day-anchor at Antiparos east-coast channel for swim. Parikia easier mooring than Naoussa; Ekatontapiliani church is the headline.',
      thingsToDo: [
        'Visit the 4th-century Ekatontapiliani church',
        'Anchor swim in the Paros-Antiparos channel',
        'Wine tasting at a Marpissa vineyard',
        'Walk Lefkes village marble paths at dusk',
      ],
      mooringTip:
        'Stern-to in Parikia harbour, €30-50/night, easier than Naoussa. Naoussa is the alternative for the photogenic fishing-harbour scene.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-sifnos',
      routeFrom: 'Paros (Parikia Harbor)',
      routeTo: 'Sifnos (Vathi Port)',
      day: 3,
      mapPin: {
        desktop: { left: 62.2, top: 51 },
        mobile: { left: 62.2, top: 51 },
      },
      description:
        '24 nm west to Sifnos. Vathi on the south coast is the calmest swim anchorage on the island — fjord-like inlet, sand bottom, salt flats inland. Kamares on the west coast is the larger paid quay overnight. In late summer when Meltemi has a westerly component, switch to Vathi for shelter. Sifnos is the gastronomy island of the Cyclades — chickpea revithada cooked overnight in a wood oven, mastelo lamb in clay pots.',
      shortDescription:
        '24 nm west to Sifnos. Vathi south coast is the calmest swim anchorage; Kamares west coast is the larger quay. Switch to Vathi when wind clocks west.',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
      ],
      mooringTip:
        'Anchor on sand at 4-6 m in Vathi Bay (fully sheltered). Kamares quay stern-to, €20-30/night, opens to W.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vathi.webp', alt: 'Vathi' }],
    },
    {
      id: 'sifnos-serifos',
      routeFrom: 'Sifnos (Vathi Port)',
      routeTo: 'Serifos (Livadi Port)',
      day: 4,
      mapPin: {
        desktop: { left: 41, top: 57.7 },
        mobile: { left: 37.4, top: 55.7 },
      },
      description:
        '14 nm short upwind hop north to Serifos. Livadi Bay on the south coast funnels the Meltemi but holds well on sand. Drag is the most common Serifos charter incident — set anchor with long scope, dive to verify, stay aboard for the first hour after mooring. Chora above the harbour is one of the most photogenic Cycladic villages and a 30-minute donkey-path climb.',
      shortDescription:
        '14 nm hop north to Serifos. Livadi Bay funnels the Meltemi — set anchor with long scope and dive to verify. Drag is the most common charter incident here.',
      thingsToDo: [
        'Walk the donkey path up to Chora',
        'Revithada chickpea stew in a kafeneio',
        'Swim Psili Ammos beach (south coast)',
        'Sunset at the windmills above Chora',
      ],
      mooringTip:
        'Anchor in Livadi Bay on sand at 5-8 m, long scope mandatory. Stern-to on town quay, €20-30/night. Drag risk above 22 kn — dive the anchor before going ashore.',
      gallery: [{ src: '/images/itinerary/greece/destinations/serifos.webp', alt: 'Serifos' }],
    },
    {
      id: 'serifos-syros',
      routeFrom: 'Serifos (Livadi Port)',
      routeTo: 'Syros (Ermoupoli)',
      day: 5,
      mapPin: {
        desktop: { left: 28.9, top: 45.9 },
        mobile: { left: 28.9, top: 45.9 },
      },
      description:
        '32 nm northeast to Syros — long beam-reach leg in standard Meltemi. Ermoupoli town quay sits at the head of a deep harbour and is one of the most forgiving stern-to in the entire Cyclades. The capital climbs the slope above in pastel neoclassical layers — Greek-orthodox Vrontado on one hill, Catholic Ano Syros on the other. Plan to be in by 17:00; in build wind, set anchor with long scope on the town-quay sand.',
      shortDescription:
        '32 nm long beam reach NE to Syros. Ermoupoli town quay is one of the most forgiving stern-to in the Cyclades. Be moored by 17:00 in build wind.',
      thingsToDo: [
        'Climb Ano Syros for the Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim the rock platforms at Asteria Beach',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any direction. Manna marina €60-80/night if quay full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-mykonos',
      routeFrom: 'Syros',
      routeTo: 'Mykonos (Tourlos Marina by 17:00)',
      day: 6,
      mapPin: {
        desktop: { left: 52.2, top: 28.1 },
        mobile: { left: 46.9, top: 30.4 },
      },
      description:
        '22 nm east back to Mykonos. The leg passes south of Delos — day-anchor possible for a 3-4 hour UNESCO visit (closes sundown). Tourlos New Marina arrival by 17:00 for handover-prep evening. Pre-book the slot online in peak season. Last evening dinner in Little Venice on Mykonos main town waterfront.',
      shortDescription:
        '22 nm east back to Mykonos. Optional Delos detour. Tourlos New Marina arrival by 17:00 for handover-prep evening. Pre-book online in peak season. Stern-to in Tourlos New Marina, €70-110/night peak. Plan to day-anchor at Delos archaeological site and walk the Apollo sanctuary and lion terrace.',
      thingsToDo: [
        'Day-anchor at Delos archaeological site',
        'Walk the Apollo sanctuary and lion terrace',
        'Last-evening dinner in Little Venice',
        'Sunset at Scorpios beach club',
      ],
      mooringTip:
        'Stern-to in Tourlos New Marina, €70-110/night peak. Pre-book online. Mykonos town quay only safe under 18 kn N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Mykonos',
      routeTo: 'Check-out',
      day: 7,
      description:
        'Handover at Tourlos before 09:00. Inspection with the skipper present — deposit released within 7 days. Mykonos airport (JMK) is 10 minutes by road from Tourlos. Last morning swim at Agios Stefanos (5 minutes from marina) is the standard last-day routine.',
      shortDescription:
        'Handover before 09:00 at Tourlos. Inspection, deposit release within 7 days. JMK airport is 10 minutes by road. Last swim at Agios Stefanos before transfer.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Agios Stefanos beach',
        'Coffee at a Mykonos town café',
        'Airport transfer (10 min from Tourlos)',
      ],
      mooringTip:
        'Hand over at Tourlos before 09:00. Deposit released within 7 days post-inspection. Photo evidence of any noted damage before signing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykanos' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/map.webp',
        alt: '',
      },
      width: 1147,
      height: 1103,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/mobile-map.webp',
        alt: '',
      },
      width: 1032,
      height: 1165,
    },
  },
};

export default computeItineraryNumberOfDays(mykonosNaxosParosRoute);
