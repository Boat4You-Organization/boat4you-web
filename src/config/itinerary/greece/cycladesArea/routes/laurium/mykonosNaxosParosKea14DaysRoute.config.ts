import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const mykonosNaxosParosKea14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Mykonos–Naxos–Paros–Kea Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 14-day yacht charter from Mykonos through Naxos, Paros, Milos, Sifnos, Serifos, Kythnos, Kea, Andros, Tinos and Syros — the full central + western Cyclades grand tour.',
  id: 'mykonos-naxos-paros-kea-14-days',
  startingPoint: 'Mykonos',
  otherPoints: ['Naxos', 'Paros', 'Kea'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/mykonos-naxos-paros-kea.webp',
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
        desktop: { left: 70.1, top: 28.4 },
        mobile: { left: 70.7, top: 28.4 },
      },
      description:
        '22 nm south to Naxos — the largest Cycladic island, fertile interior, mountains over 1000 m. Naxos town harbour is well-protected and stern-to is reliable. The Portara — a single marble doorway from the unfinished 6th-century BC Apollo temple — sits on the small islet at the harbour entrance and is the headline sunset spot. Optional Delos detour on the way south if start time allows.',
      shortDescription:
        '22 nm south to Naxos. Town harbour well-protected; Portara marble doorway is the headline sunset. Optional Delos detour if start time allows arrival before 18:00.',
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
        'Short 6 nm hop west across the Naxos-Paros channel. Parikia is the larger of the two Paros harbours and the easier mooring; Naoussa on the north coast is the photogenic alternative. Day-anchor at Antiparos east coast for a swim before mooring. The shallow channel between Paros and Antiparos is one of the prettier swim spots in the central Cyclades.',
      shortDescription:
        '6 nm short hop west to Paros (Parikia). Day-anchor at Antiparos east-coast channel for swim. Parikia easier mooring than Naoussa; Ekatontapiliani church is the headline.',
      thingsToDo: [
        'Visit the 4th-century Ekatontapiliani church',
        'Anchor swim in the Paros-Antiparos channel',
        'Wine tasting at a Marpissa vineyard',
        'Walk Lefkes village marble paths at dusk',
      ],
      mooringTip:
        'Stern-to in Parikia harbour, €30-50/night, easier than Naoussa. Naoussa is the photogenic alternative; expect to compete for slot.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-milos',
      routeFrom: 'Paros',
      routeTo: 'Milos (Adamantas Port)',
      day: 3,
      mapPin: {
        desktop: { left: 64, top: 50.8 },
        mobile: { left: 62.2, top: 48.6 },
      },
      description:
        '38 nm long beam-reach southwest to Milos — full-day passage in standard Meltemi. The long Milos inlet provides one of the most sheltered overnights in the western Cyclades; once inside Adamas Bay the wind drops away from any direction. Sarakiniko on the way past is the unmissable swim stop, but the anchorage is exposed and only viable in calm wind.',
      shortDescription:
        '38 nm full-day beam reach SW to Milos. Adamas Bay at the head of the inlet is the most sheltered overnight in the western Cyclades. Sarakiniko swim only in calm wind.',
      thingsToDo: [
        'Swim stop at lunar Sarakiniko cliffs',
        'Snorkel Papafragas sea caves',
        'Visit Plaka Castle for the panorama',
        'Klima fishermen syrmata photo walk',
      ],
      mooringTip:
        'Stern-to in Adamas town quay, €30-50/night. Excellent shelter in any wind direction. Pollonia northeast is cheaper but exposed in N Meltemi.',
      gallery: [{ src: '/images/itinerary/greece/destinations/adhamas.webp', alt: 'Milos' }],
    },
    {
      id: 'milos-sifnos',
      routeFrom: 'Milos',
      routeTo: 'Sifnos (Kamares Harbor)',
      day: 4,
      mapPin: {
        desktop: { left: 30.1, top: 74.2 },
        mobile: { left: 24.8, top: 72.5 },
      },
      description:
        '18 nm short hop north to Sifnos. Kamares Bay on the west coast is the obvious overnight — sheltered from N and NE but opens to W. In late summer when Meltemi has a westerly component, swell rolls in and the bay can become unsettled; switch to Vathi on the south coast. Sifnos is the gastronomy island of the Cyclades.',
      shortDescription:
        '18 nm short hop north to Sifnos. Kamares sheltered from N/NE but opens W — switch to Vathi south coast in late August westerly. Best Cycladic gastronomy.',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
      ],
      mooringTip:
        'Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night). Switch to Vathi (south coast, fully sheltered) when wind clocks west.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kamares.webp', alt: 'Kamares' }],
    },
    {
      id: 'sifnos-serifos',
      routeFrom: 'Sifnos',
      routeTo: 'Serifos',
      day: 5,
      mapPin: {
        desktop: { left: 41.4, top: 58.1 },
        mobile: { left: 39.5, top: 55.7 },
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
      id: 'serifos-explore',
      routeFrom: 'Serifos',
      routeTo: 'Serifos',
      day: 6,
      description:
        'Lay-day on Serifos. Day-anchor at Vagia Beach (north coast, sheltered from S) or Psili Ammos (south coast, sheltered from N) for swim. Hike from Livadi up to Chora via the old donkey path (40 minutes one way) and back via the road. Lunch at a hilltop kafeneio in Chora; the views back across the south coast are some of the best in the western Cyclades.',
      shortDescription:
        'Lay-day on Serifos. Day-anchor swim at Vagia (sheltered S) or Psili Ammos (sheltered N). Donkey-path hike Livadi to Chora, lunch in the village. Overnight back at Livadi. Plan to mega Livadi abandoned mines walk and sunset on the Chora windmills hillside.',
      thingsToDo: [
        'Day-anchor swim at Vagia Beach (north coast)',
        'Donkey-path hike Livadi to Chora',
        'Mega Livadi abandoned mines walk',
        'Sunset on the Chora windmills hillside',
      ],
      mooringTip:
        'Stay anchored in Livadi or move day-anchor to Vagia/Psili Ammos. Overnight back at Livadi. Long scope mandatory in any anchorage.',
      gallery: [{ src: '/images/itinerary/greece/destinations/serifos.webp', alt: 'Serifos' }],
    },
    {
      id: 'serifos-kythnos',
      routeFrom: 'Serifos',
      routeTo: 'Kythnos (Merichas Port)',
      day: 7,
      mapPin: {
        desktop: { left: 30.5, top: 45.7 },
        mobile: { left: 27.6, top: 46.1 },
      },
      description:
        '15 nm north to Kythnos. Merichas is the small ferry port on the west coast and the easier mooring than Loutra in build wind. Day-anchor at Apokrousi cove for lunch (sheltered from N). The Kolona double-bay sandbar 6 nm further north is the headline anchorage of the island and worth the detour if time and wind allow — boat-only access, sheltered from N by the islet.',
      shortDescription:
        '15 nm north to Kythnos (Merichas). Day-anchor lunch at Apokrousi; detour to Kolona sandbar if time allows. Easier mooring than Loutra in build wind. Stern-to in Merichas town quay, €20-30/night; Sheltered from N Meltemi; Loutra (north coast) is the alternative for thermal springs.',
      thingsToDo: [
        'Day-anchor lunch at Apokrousi cove',
        'Anchor swim at the Kolona sandbar (detour)',
        'Soak in Loutra hot springs (taxi)',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Stern-to in Merichas town quay, €20-30/night. Sheltered from N Meltemi. Loutra (north coast) is the alternative for thermal springs.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-kea',
      routeFrom: 'Kythnos',
      routeTo: 'Kea (Korissia/Vourkari)',
      day: 8,
      mapPin: {
        desktop: { left: 26.8, top: 32.1 },
        mobile: { left: 24.5, top: 33 },
      },
      description:
        '15 nm north to Kea. Vourkari Bay on the northwest of the island is the better-protected overnight (stern-to lazy lines, €25-35/night); Korissia is the larger free quay alternative when winds stay below 18 knots. Plan to be moored before 16:00 — afternoon swell builds at Korissia entrance once Meltemi exceeds 20 knots.',
      shortDescription:
        '15 nm north to Kea. Vourkari Bay sheltered for overnight; Korissia free quay alternative below 18 kn N. Be moored by 16:00. Stern-to in Vourkari with lazy lines, €25-35/night. Plan to walk to the 6th-century BC Stone Lion of Kea and snorkel the Patris steamship wreck off Koundouros.',
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
      id: 'kea-andros',
      routeFrom: 'Kea',
      routeTo: 'Andros (Batsi Port)',
      day: 9,
      mapPin: {
        desktop: { left: 23.4, top: 18 },
        mobile: { left: 20.6, top: 19.7 },
      },
      description:
        '32 nm east-northeast to Andros — long beam-reach leg in standard Meltemi. Batsi on the southwest coast is the small charter port; Gavrio further north is the larger harbour with more capacity. Andros has surface water unique in the Cyclades — streams, waterfalls and stone bridges in the inland villages, accessible by car or hike.',
      shortDescription:
        '32 nm long beam reach ENE to Andros. Batsi small charter port; Gavrio is the larger alternative. Inland Andros has waterfalls and stone bridges unique in the Cyclades.',
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
      id: 'andros-tinos',
      routeFrom: 'Andros',
      routeTo: 'Tinos',
      day: 10,
      mapPin: {
        desktop: { left: 50.6, top: 7.7 },
        mobile: { left: 45.4, top: 9.9 },
      },
      description:
        '20 nm southeast to Tinos. The Andros-Tinos channel funnels the Meltemi but the leg is short. Tinos new harbour stern-to has moderate sand holding; the inner small craft harbour is the calmer alternative when Meltemi exceeds 25 knots. Tinos is the marble-carving capital of the Aegean and the Greek Orthodox pilgrimage centre.',
      shortDescription:
        '20 nm southeast to Tinos. Andros-Tinos channel funnels the Meltemi but the leg is short. Inner small craft harbour is calmer above 25 kn. Stern-to in Tinos new harbour, €25-40/night; Holding moderate sand — set anchor with long scope.',
      thingsToDo: [
        'Marble-carving workshop visit in Pyrgos',
        'Walk the dovecote trail above Falatados',
        'Artichoke à la polita lunch in a courtyard',
        'Sunset at Volax granite-boulder field',
      ],
      mooringTip:
        'Stern-to in Tinos new harbour, €25-40/night. Holding moderate sand — set anchor with long scope. Inner craft harbour is calmer above 25 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tinos.webp', alt: 'Tinos' }],
    },
    {
      id: 'tinos-explore',
      routeFrom: 'Tinos',
      routeTo: 'Tinos',
      day: 11,
      description:
        'Lay-day on Tinos. Inland day — taxi or rental car to Pyrgos for the marble-carving workshops, lunch at a Falatados taverna, and back via Volax (granite-boulder field around the village). Surf or swim Kolymbithra Beach on the north coast. Sunset at Agios Fokas (south of Tinos town) for the panoramic sea-and-mountain framing.',
      shortDescription:
        'Lay-day on Tinos. Inland day — Pyrgos marble workshops, Volax granite-boulder field, Falatados lunch. Surf or swim Kolymbithra on the north coast. Stay overnight in Tinos new harbour or inner craft harbour. Plan to surf Kolymbithra Beach (north coast) and sunset at Agios Fokas south of town.',
      thingsToDo: [
        'Marble workshops at Pyrgos village',
        'Walk Volax granite-boulder field',
        'Surf Kolymbithra Beach (north coast)',
        'Sunset at Agios Fokas south of town',
      ],
      mooringTip:
        'Stay overnight in Tinos new harbour or inner craft harbour. Day-anchor at Kolymbithra (sheltered from S) or Agios Fokas for swim before re-mooring.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tinos.webp', alt: 'Tinos' }],
    },
    {
      id: 'tinos-syros',
      routeFrom: 'Tinos',
      routeTo: 'Syros (Ermoupoli Port)',
      day: 12,
      mapPin: {
        desktop: { left: 62.4, top: 22.4 },
        mobile: { left: 59.5, top: 23.4 },
      },
      description:
        '14 nm fast beam reach west to Syros — Tinos-Syros channel funnels the Meltemi, expect 5 knots extra. Ermoupoli town quay sits at the head of a deep harbour and is one of the most forgiving stern-to in the entire Cyclades. The capital climbs the slope above in pastel neoclassical layers.',
      shortDescription:
        '14 nm fast beam reach west to Syros. Channel funnels the Meltemi — 5 kn extra. Ermoupoli town quay is the most forgiving stern-to in the Cyclades.',
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
      routeTo: 'Mykonos (Tourlos Marina)',
      day: 13,
      mapPin: {
        desktop: { left: 50.3, top: 28.6 },
        mobile: { left: 48.8, top: 30 },
      },
      description:
        '22 nm east back to Mykonos. The leg passes south of Delos — day-anchor possible for a 3-4 hour UNESCO visit (closes sundown). Tourlos New Marina arrival by 17:00 for handover-prep evening. Pre-book the slot online in peak season. Last evening dinner in Little Venice on Mykonos main town waterfront.',
      shortDescription:
        '22 nm east back to Mykonos. Optional Delos detour. Tourlos New Marina arrival by 17:00 for handover-prep. Pre-book online in peak season. Stern-to in Tourlos New Marina, €70-110/night peak. Plan to day-anchor at Delos archaeological site and walk the Apollo sanctuary and lion terrace.',
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
      day: 14,
      description:
        'Handover at Tourlos before 09:00. Inspection with the skipper present — deposit released within 7 days. Mykonos airport (JMK) is 10 minutes by road from Tourlos. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and last swim at Agios Stefanos beach.',
      shortDescription:
        'Handover before 09:00 at Tourlos. Inspection, deposit release within 7 days. JMK airport is 10 minutes by road. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and last swim at Agios Stefanos beach.',
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

export default computeItineraryNumberOfDays(mykonosNaxosParosKea14DaysRoute);
