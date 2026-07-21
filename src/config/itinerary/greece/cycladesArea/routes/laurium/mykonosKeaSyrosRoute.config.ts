import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const mykonosKeaSyrosRoute: ItineraryRoute = {
  metaTitle: '7-Day Mykonos–Kea–Syros Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Mykonos via Tinos, Andros, Kea, Kythnos and Syros — northern Cyclades loop covering the marble-carving capital and the neoclassical Ermoupoli.',
  id: 'mykonos-kea-syros',
  startingPoint: 'Mykonos',
  otherPoints: ['Kea', 'Syros'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/mykonos-kea-syros.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/mykonos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/kythnos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/syros-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/kythnos-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'mykonos-tinos',
      routeFrom: 'Mykonos (Tourlos Marina)',
      routeTo: 'Tinos',
      day: 1,
      mapPin: {
        desktop: { left: 71.3, top: 27.2 },
        mobile: { left: 69.8, top: 31.9 },
      },
      description:
        'Short 8 nm shake-down west to Tinos. The Mykonos-Tinos channel is one of the breeziest in the Cyclades — gap effect adds 5 knots to the regional forecast and 25-knot afternoons are normal in late July. Beam reach at speed but plan to be moored before 16:00. Tinos new harbour stern-to has moderate sand holding; the inner small craft harbour is the calmer alternative when Meltemi exceeds 25 knots.',
      shortDescription:
        '8 nm short shake-down west to Tinos. Mykonos-Tinos channel funnels the Meltemi — 5 kn extra. Be moored by 16:00; afternoon swell builds at the entrance.',
      thingsToDo: [
        'Marble-carving workshop visit in Pyrgos',
        'Walk the dovecote trail above Falatados',
        'Artichoke à la polita lunch in a courtyard',
        'Surf Kolymbithra Beach (north coast)',
      ],
      mooringTip:
        'Stern-to in Tinos new harbour, €25-40/night. Holding moderate sand — set anchor with long scope. Inner craft harbour is calmer above 25 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tinos.webp', alt: 'Tinos' }],
    },
    {
      id: 'tinos-andros',
      routeFrom: 'Tinos',
      routeTo: 'Andros (Batsi Port)',
      day: 2,
      mapPin: {
        desktop: { left: 62.1, top: 22.4 },
        mobile: { left: 61, top: 22.4 },
      },
      description:
        '20 nm northwest to Andros — the northernmost Cycladic island and one of the greenest. Batsi on the southwest coast is the small charter port; Gavrio further north is the larger harbour with more capacity. The Andros-Tinos channel funnels the Meltemi but the leg is short. Andros has surface water unique in the Cyclades — streams, waterfalls and stone bridges in the inland villages, accessible by car or hike.',
      shortDescription:
        '20 nm northwest to Andros. Batsi small charter port; Gavrio is the larger alternative. Inland Andros has waterfalls and stone bridges unique in the Cyclades.',
      thingsToDo: [
        'Hike to Pithara waterfalls (inland)',
        'Walk Chora marble paths and contemporary art museum',
        'Froutalia herb omelette at a kafeneio',
        'Swim Achla Beach (north coast, river estuary)',
      ],
      mooringTip:
        'Stern-to in Batsi harbour, €25-40/night, sheltered from N. Gavrio is the larger alternative, well-protected from any direction.',
      gallery: [{ src: '/images/itinerary/greece/destinations/andros.webp', alt: 'Andros' }],
    },
    {
      id: 'andros-kea',
      routeFrom: 'Andros',
      routeTo: 'Kea (Korissia/Vourkari)',
      day: 3,
      mapPin: {
        desktop: { left: 50.4, top: 7.7 },
        mobile: { left: 44.6, top: 11 },
      },
      description:
        '32 nm west-southwest to Kea — long downwind leg in standard Meltemi. Vourkari Bay on the northwest of Kea is the better-protected overnight (stern-to lazy lines, €25-35/night); Korissia is the larger free quay alternative when winds stay below 18 knots. Plan to be moored by 16:00 — afternoon swell builds at Korissia entrance once Meltemi exceeds 20 knots.',
      shortDescription:
        '32 nm long downwind WSW to Kea. Vourkari Bay sheltered for overnight; Korissia is the free quay alternative below 18 kn. Be moored by 16:00.',
      thingsToDo: [
        'Walk to the 6th-century BC Stone Lion of Kea',
        'Snorkel the Patris steamship wreck off Koundouros',
        'Octopus carpaccio at a Vourkari ouzeri',
        'Walk Ioulida marble streets at dusk',
      ],
      mooringTip:
        'Stern-to in Vourkari with lazy lines, €25-35/night. Korissia town quay free but exposed in N Meltemi above 18 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-kythnos',
      routeFrom: 'Kea',
      routeTo: 'Kythnos',
      day: 4,
      mapPin: {
        desktop: { left: 24, top: 14.2 },
        mobile: { left: 18.3, top: 19.6 },
      },
      description:
        '20 nm south to Kythnos with the Meltemi on the quarter — comfortable downwind reach. Loutra on the northeast coast is the headline overnight: small marina with natural thermal springs flowing into the harbour at around 38°C. Day-anchor at Kolona double-bay (sand spit between Kythnos and the Agios Loukas islet) on the way south for a swim — boat-only access, sheltered from N.',
      shortDescription:
        '20 nm south to Kythnos with Meltemi on the quarter. Loutra harbour has thermal springs flowing in. Day-anchor at Kolona sandbar on the way south.',
      thingsToDo: [
        'Soak in Loutra natural thermal springs',
        'Anchor swim at the Kolona sandbar',
        'Cycle the Chora-Driopida ridge road',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Stern-to in Loutra harbour, €25-40/night with lazy lines. Sheltered from N. Merichas on the west coast is the alternative if Loutra is full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-syros',
      routeFrom: 'Kythnos',
      routeTo: 'Syros (Foinikas/Ermoupoli)',
      day: 5,
      mapPin: {
        desktop: { left: 28.1, top: 30.8 },
        mobile: { left: 23.9, top: 32.8 },
      },
      description:
        '28 nm east-southeast to Syros — beam reach in standard Meltemi, fast passage. Ermoupoli town quay sits at the head of a deep harbour and is one of the most forgiving stern-to mooring positions in the entire Cyclades. The capital climbs the slope above in pastel neoclassical layers — Greek-orthodox Vrontado on one hill, Catholic Ano Syros on the other. Foinikas on the southwest coast is the alternative for a sheltered swim anchorage.',
      shortDescription:
        '28 nm beam reach ESE to Syros. Ermoupoli town quay is the most forgiving stern-to in the Cyclades. Foinikas south coast is the alternative for sheltered swim anchorage.',
      thingsToDo: [
        'Climb Ano Syros for the Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim at Foinikas Bay (south coast)',
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
        desktop: { left: 51.2, top: 30.2 },
        mobile: { left: 48.6, top: 29.9 },
      },
      description:
        '22 nm east back to Mykonos. The leg passes south of Delos — day-anchor possible at the Delos south-side anchorage on sand at 5-8 m for a 3-4 hour visit to the UNESCO archaeological site (closes at sundown). Tourlos New Marina arrival by 17:00 for the handover-prep evening; pre-book the slot online. Day-anchor at Ornos or Psarou on Mykonos south coast for an afternoon swim if Delos is skipped.',
      shortDescription:
        '22 nm east back to Mykonos. Detour to Delos UNESCO site (day-anchor only, closes sundown). Tourlos New Marina arrival by 17:00 for handover-prep. Stern-to in Tourlos New Marina, €70-110/night peak. Plan to walk the Apollo sanctuary and lion terrace and beach lunch at Agios Sostis.',
      thingsToDo: [
        'Day-anchor at Delos archaeological site',
        'Walk the Apollo sanctuary and lion terrace',
        'Beach lunch at Agios Sostis',
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
        'Handover at Tourlos before 09:00. Boat inspection with the skipper present — deposit released within 7 days. Mykonos airport (JMK) is 10 minutes by road from Tourlos. Last morning swim at Agios Stefanos (5 minutes from the marina) is the standard last-day routine.',
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
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/map.webp',
        alt: 'Mykonos Kea Syros Route Image',
      },
      width: 1147,
      height: 1103,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/mobile-map.webp',
        alt: 'Mykonos Kea Syros Route Image',
      },
      width: 1032,
      height: 1165,
    },
  },
};

export default computeItineraryNumberOfDays(mykonosKeaSyrosRoute);
