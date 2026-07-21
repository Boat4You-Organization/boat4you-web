import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const gocekRoute: ItineraryRoute = {
  metaTitle: '7-Day Göcek Yacht Charter Route | Turkish Riviera Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Göcek via Sarsala, Fethiye, Gemiler Island, Butterfly Valley, Ölüdeniz, Kapı Creek and Ruin Bay — Turquoise Coast 12 Islands loop.',
  id: 'gocek-7-days',
  startingPoint: 'Göcek',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/turkey/gocek-itinerary/routes/gocek.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/turkey/banners/oludeniz-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/yassica-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/gemiler-banner.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/sarsala-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'gocek-sarsala',
      routeFrom: 'Göcek',
      routeTo: 'Sarsala',
      day: 1,
      mapPin: {
        desktop: { left: 39.5, top: 31.6 },
        mobile: { left: 38.3, top: 37.5 },
      },
      description:
        '5 nm short shake-down south from D-Marin Göcek to Sarsala Bay — pine-clad inlet inside the 12 Islands archipelago, sheltered from any direction. Göcek summer wind regime is the imbat (sea breeze from W) at 10-15 kn, milder than the outer Aegean Meltemi. Anchor on sand 4-6 m.',
      shortDescription:
        '5 nm shake-down S from D-Marin Göcek to Sarsala Bay — pine-clad 12 Islands inlet, fully sheltered. Imbat W sea breeze 10-15 kn (mild vs Aegean Meltemi).',
      thingsToDo: [
        'Snorkel the rocky shoreline pine-cliff edge',
        'Hike pine-and-thyme ridge above bay',
        'Grilled sea bream on deck for sunset',
        'Stargaze with no light pollution',
      ],
      mooringTip:
        'Free anchoring in Sarsala Bay on sand at 4-6 m, fully sheltered. No marina; provision before arriving.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/sarsala-bay.webp', alt: 'Sarsala' }],
    },
    {
      id: 'sarsala-bay-fethiye',
      routeFrom: 'Sarsala Bay',
      routeTo: 'Fethiye',
      day: 2,
      mapPin: {
        desktop: { left: 46.5, top: 37.2 },
        mobile: { left: 45.9, top: 42.3 },
      },
      description:
        '12 nm east-southeast to Fethiye — major Turkish Riviera town, Lycian rock-cut tombs (4th-c BC, the tomb of Amyntas with full Ionic temple façade) carved into the cliff above the city. Marina di Fethiye ECE is the standard charter overnight. Tuesday market is the headline shore activity.',
      shortDescription:
        '12 nm ESE to Fethiye — Lycian 4th-c BC rock-cut tombs (Amyntas tomb with Ionic temple façade) on cliff. Marina di Fethiye ECE. Tuesday market headline.',
      thingsToDo: [
        'Climb to the 4th-c BC tomb of Amyntas',
        'Tuesday market spices + handcrafted rugs',
        'Day-trip to ancient Tlos rock tombs (taxi)',
        'Çay with locals at a quay café',
      ],
      mooringTip:
        'Marina di Fethiye ECE stern-to with lazy lines, €70-110/night peak, fully sheltered. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/fethiye.webp', alt: 'Fethiye' }],
    },
    {
      id: 'fethiye-gemiler-island-coldwater-bay',
      routeFrom: 'Fethiye',
      routeTo: 'Gemiler Island',
      day: 3,
      mapPin: {
        desktop: { left: 54.8, top: 44 },
        mobile: { left: 59.2, top: 45.4 },
      },
      description:
        '8 nm south to Gemiler Island (St Nicholas Island) — Byzantine pilgrimage site (4th-6th c, the original tomb of St Nicholas of Myra before relocation to Bari, 1087 AD). Anchor in Coldwater Bay (Soğuksu Koyu) on the mainland opposite — freshwater springs flowing into the sea make the surface temperature drop suddenly, signature Turquoise Coast feature.',
      shortDescription:
        '8 nm S to Gemiler Island Byzantine pilgrimage (original tomb of St Nicholas of Myra). Anchor in Coldwater Bay opposite — freshwater springs drop surface temp.',
      thingsToDo: [
        'Walk Gemiler Byzantine pilgrimage paths',
        'Snorkel for freshwater-spring temperature drop',
        'Anchor swim in Coldwater Bay',
        'Meze platters at a quay restaurant',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Coldwater Bay — pay for dinner, buoy included. Anchor on sand at 5-7 m as alternative. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/gemiler-island.webp', alt: 'Gemiler' }],
    },
    {
      id: 'coldwater-bay-butterfly-valley-oludeniz',
      routeFrom: 'Coldwater Bay',
      routeTo: 'Butterfly Valley',
      day: 4,
      mapPin: {
        desktop: { left: 51.4, top: 49 },
        mobile: { left: 53.1, top: 50.4 },
      },
      description:
        '4 nm short hop south to Butterfly Valley + Ölüdeniz. Butterfly Valley (Kelebekler Vadisi) is a 350-m-deep canyon hosting the endemic Jersey tiger butterfly. Day-anchor only — overnight at Ölüdeniz Bay 1 nm east (the Blue Lagoon Mediterranean-most-photographed beach, paragliders from Babadağ Mountain 1969 m above).',
      shortDescription:
        '4 nm short hop S to Butterfly Valley + Ölüdeniz. 350-m canyon, endemic Jersey tiger butterfly. Day-anchor only Butterfly Valley; overnight at Ölüdeniz Blue Lagoon.',
      thingsToDo: [
        'Hike to the Butterfly Valley waterfall',
        'Anchor swim at Ölüdeniz Blue Lagoon',
        'Watch paragliders from Babadağ Mountain (1969 m)',
        'Spot the endemic Jersey tiger butterfly',
      ],
      mooringTip:
        'Butterfly Valley day-anchor only on rocky bottom 6-8 m — no overnight (canyon-funnel wind). Overnight at Ölüdeniz on sand at 5-7 m.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/butterfly-valley.webp', alt: 'Butterfly Valley' }],
    },
    {
      id: 'oludeniz-kapi-creek',
      routeFrom: 'Ölüdeniz',
      routeTo: 'Kapı Creek',
      day: 5,
      mapPin: {
        desktop: { left: 54, top: 58 },
        mobile: { left: 54, top: 58 },
      },
      description:
        "12 nm south to Kapı Creek — narrow inlet inside the Skopea Limanı (Göcek's 12 Islands cluster), restaurant-mooring system. Sheltered from any direction. Pebble beach at the head of the creek for swim. The creek narrows to 80 m at the entrance — feels like a fjord.",
      shortDescription:
        '12 nm S to Kapı Creek — narrow inlet inside Skopea Limanı 12 Islands. Restaurant moorings. Fjord-like, 80 m entrance. Pebble beach at head. Anchor on sand at 5-7 m as alternative. Plan to rakı + thyme honey at a quay restaurant and stargaze with creek-cliff frame.',
      thingsToDo: [
        'Anchor swim at Kapı Creek pebble head',
        'Paddle to the narrow 80-m entrance',
        'Rakı + thyme honey at a quay restaurant',
        'Stargaze with creek-cliff frame',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Kapı Creek — pay for dinner, buoy included. Anchor on sand at 5-7 m as alternative. Fully sheltered.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/kapi.webp', alt: 'Kapı Creek' }],
    },
    {
      id: 'kapi-creek-ruin-bay',
      routeFrom: 'Kapı Creek',
      routeTo: 'Ruin Bay',
      day: 6,
      mapPin: {
        desktop: { left: 55.4, top: 65.3 },
        mobile: { left: 58.5, top: 65.6 },
      },
      description:
        '4 nm short hop south to Ruin Bay (Kleopatra Bay, Tomb Bay) — submerged Lycian city under the cliffs (3rd-c BC remains, Roman columns visible at 2-3 m depth, accessible by snorkel only). Lydae ruins above the bay overgrown with goats and olive trees. Restaurant-mooring system.',
      shortDescription:
        '4 nm short hop S to Ruin Bay (Tomb Bay) — submerged Lycian city + 3rd-c BC Roman columns at 2-3 m depth (snorkel only). Lydae ruins above. Restaurant moorings.',
      thingsToDo: [
        'Snorkel above 3rd-c BC submerged Roman columns',
        'Hike to Lydae ruins above (goats + olive trees)',
        'Sunset BBQ on deck (lamb köfte)',
        'Dive off the bow into silk-warm water',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Ruin Bay — pay for dinner, buoy included. Sheltered from N. Anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/ruin-bay.webp', alt: 'Ruin Bay' }],
    },
    {
      id: 'ruin-bay-gocek',
      routeFrom: 'Ruin Bay',
      routeTo: 'Göcek',
      day: 7,
      mapPin: {
        desktop: { left: 55.7, top: 71.4 },
        mobile: { left: 62.4, top: 73 },
      },
      description:
        '6 nm short north back to D-Marin Göcek. Optional Yassıca Islands swim stop on the way (12-Islands archipelago, sand-bottom coves, sheltered). Refuel at D-Marin before tying up. Standard 14:00 marina arrival for handover-prep evening. D-Marin Göcek stern-to with lazy lines, €100-160/night peak, fully sheltered. Plan to walk D-Marin promenade boutiques and saffron-honey tasting at a Göcek artisan.',
      shortDescription:
        '6 nm short N back to D-Marin Göcek. Optional Yassıca Islands swim stop. Refuel at D-Marin before mooring. Standard 14:00 arrival. D-Marin Göcek stern-to with lazy lines, €100-160/night peak, fully sheltered. Plan to walk D-Marin promenade boutiques and saffron-honey tasting at a Göcek artisan.',
      thingsToDo: [
        'Optional Yassıca Islands swim stop',
        'Walk D-Marin promenade boutiques',
        'Saffron-honey tasting at a Göcek artisan',
        'Refuel and clean the boat at D-Marin',
      ],
      mooringTip:
        'D-Marin Göcek stern-to with lazy lines, €100-160/night peak, fully sheltered. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/gocek.webp', alt: 'Göcek' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/turkey/gocek-itinerary/map.webp',
        alt: 'Fethiye Route Image',
      },
      width: 1251,
      height: 1058,
    },
    mobile: {
      image: {
        src: '/images/itinerary/turkey/gocek-itinerary/mobile-map.webp',
        alt: 'Fethiye Route Image',
      },
      width: 842,
      height: 1094,
    },
  },
};

export default computeItineraryNumberOfDays(gocekRoute);
