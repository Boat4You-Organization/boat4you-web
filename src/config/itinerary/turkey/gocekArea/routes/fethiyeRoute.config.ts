import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const fethiyeRoute: ItineraryRoute = {
  metaTitle: 'Göcek → Fethiye Yacht Charter Route | Turkish Blue Cruise',
  metaDesc:
    'Sail a 7-day yacht charter from Fethiye via Gemiler, Butterfly Valley, Ölüdeniz, Kapı Creek, Ruin Bay and Göcek — Turquoise Coast 12 Islands loop, sheltered Aegean.',
  id: 'fethiye',
  startingPoint: 'Fethiye',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/turkey/bodrum-itinerary/routes/bodrum-didim.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/turkey/banners/oludeniz-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/yassica-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/gemiler-banner.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/sarsala-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'fethiye-gemiler-island-coldwater-bay',
      routeFrom: 'Fethiye',
      routeTo: 'Gemiler Island',
      day: 1,
      mapPin: {
        desktop: { left: 54.6, top: 43.7 },
        mobile: { left: 48.4, top: 43.5 },
      },
      description:
        '8 nm shake-down south from Marina di Fethiye ECE to Gemiler Island (St Nicholas Island, original tomb of St Nicholas of Myra before relocation to Bari 1087 AD). Anchor in Coldwater Bay opposite — freshwater springs flowing into the sea drop the surface temperature suddenly.',
      shortDescription:
        '8 nm shake-down S from Fethiye to Gemiler Island Byzantine pilgrimage (original St Nicholas tomb). Coldwater Bay freshwater springs drop surface temp. Free restaurant mooring buoy in Coldwater Bay — pay for dinner, buoy included; Anchor on sand at 5-7 m as alternative.',
      thingsToDo: [
        'Walk Gemiler Byzantine pilgrimage paths',
        'Snorkel for the freshwater-spring temperature drop',
        'Anchor swim in Coldwater Bay',
        'Meze platters at a quay restaurant',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Coldwater Bay — pay for dinner, buoy included. Anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/gemiler-island.webp', alt: 'Gemiler' }],
    },
    {
      id: 'coldwater-bay-butterfly-valley-oludeniz',
      routeFrom: 'Coldwater Bay',
      routeTo: 'Butterfly Valley',
      day: 2,
      mapPin: {
        desktop: { left: 52.5, top: 48 },
        mobile: { left: 56.5, top: 47.2 },
      },
      description:
        '4 nm short hop south to Butterfly Valley + Ölüdeniz. Butterfly Valley canyon (350 m deep, endemic Jersey tiger butterfly). Day-anchor only — overnight at Ölüdeniz Bay 1 nm east (Mediterranean-most-photographed Blue Lagoon). Overnight at Ölüdeniz on sand 5-7 m. Plan to watch paragliders from Babadağ Mountain (1969 m).',
      shortDescription:
        '4 nm short hop S to Butterfly Valley + Ölüdeniz. 350-m canyon, endemic Jersey tiger butterfly. Overnight at Ölüdeniz Blue Lagoon. Highlights: Hike to the Butterfly Valley waterfall and Anchor swim at Ölüdeniz Blue Lagoon.',
      thingsToDo: [
        'Hike to the Butterfly Valley waterfall',
        'Anchor swim at Ölüdeniz Blue Lagoon',
        'Watch paragliders from Babadağ Mountain (1969 m)',
        'Spot the endemic Jersey tiger butterfly',
      ],
      mooringTip:
        'Butterfly Valley day-anchor only on rocky bottom 6-8 m — no overnight (canyon-funnel wind). Overnight at Ölüdeniz on sand 5-7 m.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/butterfly-valley.webp', alt: 'Butterfly Valley' }],
    },
    {
      id: 'oludeniz-kapi-creek',
      routeFrom: 'Ölüdeniz',
      routeTo: 'Kapı Creek',
      day: 3,
      mapPin: {
        desktop: { left: 53.2, top: 56 },
        mobile: { left: 56.5, top: 55.5 },
      },
      description:
        '12 nm south to Kapı Creek — narrow fjord-like inlet inside the Skopea Limanı (12 Islands cluster), restaurant-mooring system. The creek narrows to 80 m at the entrance. Pebble beach at the head for swim. Anchor on sand at 5-7 m as alternative. Plan to ezme + figs picnic on a tamarisk shore and rakı + thyme honey at a quay restaurant.',
      shortDescription:
        '12 nm S to Kapı Creek — narrow fjord-like inlet, 80 m entrance. Restaurant moorings. Pebble beach at head for swim. Anchor on sand at 5-7 m as alternative. Plan to ezme + figs picnic on a tamarisk shore and rakı + thyme honey at a quay restaurant.',
      thingsToDo: [
        'Anchor swim at Kapı Creek pebble head',
        'Paddle to the narrow 80-m entrance',
        'Ezme + figs picnic on a tamarisk shore',
        'Rakı + thyme honey at a quay restaurant',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Kapı Creek — pay for dinner, buoy included. Anchor on sand at 5-7 m as alternative. Fully sheltered.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/kapi.webp', alt: 'Kapı Creek' }],
    },
    {
      id: 'kapi-creek-ruin-bay',
      routeFrom: 'Kapı Creek',
      routeTo: 'Ruin Bay',
      day: 4,
      mapPin: {
        desktop: { left: 54.5, top: 63.7 },
        mobile: { left: 57.2, top: 63.7 },
      },
      description:
        '4 nm short hop south to Ruin Bay (Tomb Bay, Kleopatra Bay) — submerged Lycian city under the cliffs (3rd-c BC, Roman columns at 2-3 m depth, snorkel only). Lydae ruins above the bay overgrown with goats and olive trees.',
      shortDescription:
        '4 nm short hop S to Ruin Bay (Tomb Bay) — submerged Lycian city, 3rd-c BC Roman columns at 2-3 m (snorkel only). Lydae ruins above.',
      thingsToDo: [
        'Snorkel above 3rd-c BC submerged Roman columns',
        'Hike to Lydae ruins (goats + olive trees)',
        'Sunset BBQ lamb köfte on deck',
        'Dive off the bow into silk-warm water',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Ruin Bay — pay for dinner, buoy included. Anchor on sand at 5-7 m as alternative. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/ruin-bay.webp', alt: 'Ruin Bay' }],
    },
    {
      id: 'ruin-bay-gocek',
      routeFrom: 'Ruin Bay',
      routeTo: 'Göcek',
      day: 5,
      mapPin: {
        desktop: { left: 55.2, top: 70.5 },
        mobile: { left: 59.2, top: 72.4 },
      },
      description:
        '6 nm short north to D-Marin Göcek. Optional Yassıca Islands or Domuz Adası anchor swim on the way (12-Islands archipelago, neon-fish-and-seagrass snorkel sites). D-Marin Göcek for stern-to overnight. Refuel at the entrance fuel berth. Plan to hand-painted pottery at D-Marin shops and meze + stories of the week at a meyhane.',
      shortDescription:
        '6 nm short N to D-Marin Göcek. Optional Yassıca / Domuz Adası swim stop (12-Islands cluster). D-Marin for stern-to overnight. Refuel at the entrance fuel berth. Plan to hand-painted pottery at D-Marin shops and meze + stories of the week at a meyhane.',
      thingsToDo: [
        'Anchor swim at Yassıca Islands neon fish',
        'Snorkel Domuz Adası seagrass meadows',
        'Hand-painted pottery at D-Marin shops',
        'Meze + stories of the week at a meyhane',
      ],
      mooringTip:
        'D-Marin Göcek stern-to with lazy lines, €100-160/night peak, fully sheltered. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/gocek.webp', alt: 'Göcek' }],
    },
    {
      id: 'gocek-sarsala-bay',
      routeFrom: 'Göcek',
      routeTo: 'Sarsala Bay',
      day: 6,
      mapPin: {
        desktop: { left: 40.8, top: 33 },
        mobile: { left: 38.5, top: 37.1 },
      },
      description:
        '5 nm short south to Sarsala Bay — pine-clad inlet inside the 12 Islands archipelago, sheltered from any direction. Anchor on sand 4-6 m. Heron-spotting in the inlet shallows. Last-night barbecue on deck with no lights, just stars. Free anchoring in Sarsala Bay on sand at 4-6 m, fully sheltered. No marina; provision before arriving. Plan to snorkel pine-cliff edge for octopus, spot herons in inlet shallows, sea bass with lemon and oregano on deck.',
      shortDescription:
        '5 nm short S to Sarsala Bay — pine-clad 12-Islands inlet fully sheltered. Heron-spotting shallows. Last-night BBQ on deck under stars. provision before arriving. Plan to snorkel pine-cliff edge for octopus and sea bass with lemon and oregano on deck.',
      thingsToDo: [
        'Snorkel pine-cliff edge for octopus',
        'Spot herons in inlet shallows',
        'Sea bass with lemon and oregano on deck',
        'Stargaze with no light pollution',
      ],
      mooringTip:
        'Free anchoring in Sarsala Bay on sand at 4-6 m, fully sheltered. No marina; provision before arriving.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/sarsala-bay.webp', alt: 'Sarsala Bay' }],
    },
    {
      id: 'sarsala-bay-fethiye',
      routeFrom: 'Sarsala Bay',
      routeTo: 'Fethiye',
      day: 7,
      mapPin: {
        desktop: { left: 36.7, top: 38.3 },
        mobile: { left: 30.7, top: 43.1 },
      },
      description:
        '12 nm east-southeast back to Marina di Fethiye ECE. Standard mid-morning departure. Refuel at Fethiye before tying up. Standard 14:00 marina arrival for handover-prep evening. Refuel at the entrance fuel berth. Plan to final swim under the Lycian rock tombs and tuesday market stops on the way to handover.',
      shortDescription:
        '12 nm ESE back to Marina di Fethiye. Standard mid-morning departure. Refuel before mooring. Standard 14:00 arrival. Refuel at the entrance fuel berth. Plan to final swim under the Lycian rock tombs and tuesday market stops on the way to handover.',
      thingsToDo: [
        'Final swim under the Lycian rock tombs',
        'Tuesday market stops on the way to handover',
        'Pomegranate şalgam toast at a quay café',
        'Refuel and clean the boat at Marina di Fethiye',
      ],
      mooringTip:
        'Marina di Fethiye ECE stern-to with lazy lines, €70-110/night peak, fully sheltered. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/fethiye.webp', alt: 'Fethiye' }],
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

export default computeItineraryNumberOfDays(fethiyeRoute);
