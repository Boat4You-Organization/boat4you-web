import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const bodrumRoute: ItineraryRoute = {
  metaTitle: 'Bodrum Yacht Charter Route | Turkey Blue Cruise | Boat4You',
  metaDesc:
    'Sail a 7-day yacht charter from Bodrum through Kara Ada, Çökertme, Cleopatra Island (Sedir), Karaca and Mersincik — Gulf of Gökova loop, sheltered Turkish Aegean.',
  id: 'bodrum',
  startingPoint: 'Bodrum',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/turkey/bodrum-itinerary/routes/bodrum.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/turkey/banners/bodrum-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/aegean-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/bodrum-banner.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/bodrum-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'bodrum-kara-ada',
      routeFrom: 'Bodrum',
      routeTo: 'Kara Ada',
      day: 1,
      mapPin: {
        desktop: { left: 26.5, top: 41.2 },
        mobile: { left: 32.1, top: 51.7 },
      },
      description:
        '4 nm short shake-down south from Bodrum Marina to Kara Ada (Black Island) — small volcanic islet with thermal-spring pools at the south end. Anchor in the cove on sand 4-6 m, sheltered from N. Turkish Aegean summer wind regime is the Meltemi from N (15-25 kn) accelerating in late July through August.',
      shortDescription:
        '4 nm shake-down S from Bodrum to Kara Ada (Black Island) thermal-spring pools at S end. Meltemi N 15-25 kn summer regime. Sand anchorage sheltered N.',
      thingsToDo: [
        'Soak in the Kara Ada thermal-spring pools',
        'Snorkel the volcanic shoreline',
        'Sunset on deck with meze platters',
        'Walk the small island goat-trails',
      ],
      mooringTip:
        'Free anchoring at Kara Ada on sand at 4-6 m, sheltered from N. No marina on the island. Bodrum Marina 4 nm N for paid alternative (€80-130/night peak).',
      gallery: [{ src: '/images/itinerary/turkey/destinations/karaada.webp', alt: 'Kara Ada' }],
    },
    {
      id: 'kara-ada-cokertme',
      routeFrom: 'Kara Ada',
      routeTo: 'Çökertme',
      day: 2,
      mapPin: {
        desktop: { left: 29.6, top: 48.3 },
        mobile: { left: 18.1, top: 56.3 },
      },
      description:
        '15 nm east into the Gulf of Gökova to Çökertme — pine-clad horseshoe bay, family-run restaurant moorings (pick up a buoy, eat dinner ashore, the buoy is free). Çökertme is the entrance to the Gökova Gulf — the wind drops away significantly inside the gulf compared to the outer Aegean coast.',
      shortDescription:
        '15 nm E into Gulf of Gökova to Çökertme pine-clad horseshoe. Family-run restaurant buoys (free with dinner). Gökova drops wind vs outer Aegean. Anchor in the bay on sand at 5-7 m as alternative; Sheltered from N.',
      thingsToDo: [
        'Köfte meatballs on olivewood at a family taverna',
        'Anchor swim — bioluminescent water at night',
        'Hike to the pine-clad ridge above the bay',
        'Folk music at a quay restaurant',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Çökertme — pay for dinner, buoy included. Anchor in the bay on sand at 5-7 m as alternative. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/cokertme.webp', alt: 'Çökertme' }],
    },
    {
      id: 'cokertme-cleopatra-island',
      routeFrom: 'Çökertme',
      routeTo: 'Cleopatra Island',
      day: 3,
      mapPin: {
        desktop: { left: 51.2, top: 44.3 },
        mobile: { left: 56.2, top: 53.5 },
      },
      description:
        '15 nm east deeper into Gökova to Cleopatra Island (Sedir Adası). Famous for the imported-Egyptian-sand legend (Mark Antony, 1st-c BC, sand-grain microscopy confirms North African origin distinct from local Aegean sand). Anchor in the channel north of the island; access to the beach is regulated, no walking on the sand (only swim from the water).',
      shortDescription:
        '15 nm E deeper into Gökova to Cleopatra Island (Sedir Adası). 1st-c BC Egyptian-sand legend (microscopy confirms N African origin). Beach swim only — no walking on sand.',
      thingsToDo: [
        'Swim around the regulated golden-sand beach',
        'Snorkel the partially buried Roman piers',
        'Hike to the Cedrae temple ruins',
        'Sea bass grilled with wild herbs at a quay taverna',
      ],
      mooringTip:
        'Anchor in the channel north of Cleopatra Island on sand at 5-7 m, sheltered from N. Park rules — no walking on the protected beach.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/cokertme.webp', alt: 'Çökertme' }],
    },
    {
      id: 'cleopatra-island-karaca',
      routeFrom: 'Cleopatra Island',
      routeTo: 'Karaca',
      day: 4,
      mapPin: {
        desktop: { left: 80.8, top: 45.9 },
        mobile: { left: 83.3, top: 52.9 },
      },
      description:
        '12 nm east to Karaca — small fishing-village inlet on the south side of the Gökova Gulf, oleander-fringed pebble beach, restaurant moorings (pay-for-dinner system). Anchor in the inlet on sand 4-6 m, fully sheltered from N. Anchor in the inlet on sand at 4-6 m as alternative. Plan to beachcomb sea-glass along the shoreline and backgammon under the village fig tree.',
      shortDescription:
        '12 nm E to Karaca — small fishing-village inlet S side of Gökova. Oleander pebble beach. Restaurant moorings (pay-for-dinner). Sand anchorage sheltered N. Anchor in the inlet on sand at 4-6 m as alternative. Plan to beachcomb sea-glass along the shoreline and backgammon under the village fig tree.',
      thingsToDo: [
        'Anchor swim at Karaca pebble beach',
        'Beachcomb sea-glass along the shoreline',
        'Backgammon under the village fig tree',
        'Lamb-spit at a family taverna',
      ],
      mooringTip:
        'Free restaurant mooring buoy in Karaca — pay for dinner, buoy included. Anchor in the inlet on sand at 4-6 m as alternative. Fully sheltered from N.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/karaca-island.webp', alt: 'Karaca' }],
    },
    {
      id: 'karaca-mersincik',
      routeFrom: 'Karaca',
      routeTo: 'Mersincik',
      day: 5,
      mapPin: {
        desktop: { left: 58.2, top: 66.1 },
        mobile: { left: 59.2, top: 66.4 },
      },
      description:
        '15 nm west back along the Gulf to Mersincik — protected bay on the south side, granite-rock entrance, sea cave at the head of the bay. Hike to the wild-thyme ridge above the bay. Anchor in the bay on sand 4-6 m, fully sheltered.',
      shortDescription:
        '15 nm W back along Gulf to Mersincik — protected bay, granite entrance, sea cave at head. Wild-thyme ridge hike. Sand anchorage fully sheltered. provision before arriving. Plan to kayak into the sea cave at bay head and zeytinyağlı olive-oil-poached dishes on deck.',
      thingsToDo: [
        'Kayak into the sea cave at bay head',
        'Hike the wild-thyme ridge above',
        'Zeytinyağlı olive-oil-poached dishes on deck',
        'Stargaze with no light pollution',
      ],
      mooringTip:
        'Free anchoring in Mersincik on sand at 4-6 m, fully sheltered from any direction. No marina; provision before arriving.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/mersincik.webp', alt: 'Mersincik' }],
    },
    {
      id: 'mersincik-bodrum',
      routeFrom: 'Mersincik',
      routeTo: 'Bodrum',
      day: 6,
      mapPin: {
        desktop: { left: 34.2, top: 71.9 },
        mobile: { left: 35.4, top: 70.4 },
      },
      description:
        '15 nm west back to Bodrum Marina. Castle of St Peter (15th-c Crusader fortress at the harbour entrance, now Museum of Underwater Archaeology — Uluburun Bronze Age shipwreck displayed inside) is the headline shore activity. Refuel before tying up. Plan to the 15th-c Castle of St Peter + Underwater Archaeology Museum, see the Uluburun Bronze Age shipwreck display, bazaar haggling for handcrafted fabrics.',
      shortDescription:
        '15 nm W back to Bodrum Marina. 15th-c Castle of St Peter Crusader fortress (now Underwater Archaeology Museum, Uluburun Bronze Age shipwreck). Refuel before mooring.',
      thingsToDo: [
        'Visit the 15th-c Castle of St Peter + Underwater Archaeology Museum',
        'See the Uluburun Bronze Age shipwreck display',
        'Bazaar haggling for handcrafted fabrics',
        'Refuel and clean the boat at Bodrum Marina',
      ],
      mooringTip:
        'Bodrum Marina stern-to with lazy lines, €80-130/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/bodrum-town.webp', alt: 'Bodrum' }],
    },
    {
      id: 'bodrum-checkout',
      routeFrom: 'Bodrum',
      routeTo: 'Bodrum',
      day: 7,
      description:
        'Handover at Bodrum Marina before 09:00. Inspection — deposit released within 7 days. Bodrum airport (BJV) is 35 minutes by road. Last morning swim at a beach club + Turkish coffee on the quay before transfer. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager.',
      shortDescription:
        'Handover before 09:00 at Bodrum Marina. Inspection, deposit release within 7 days. BJV airport 35 min by road. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and last swim at a Bodrum beach club.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at a Bodrum beach club',
        'Turkish coffee at a harbourside café',
        'Airport transfer (35 min from Bodrum Marina)',
      ],
      mooringTip:
        'Hand over at Bodrum Marina before 09:00. Deposit released within 7 days post-inspection. Photo evidence of any noted damage before signing.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/bodrum-town.webp', alt: 'Bodrum' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/turkey/bodrum-itinerary/map.webp',
        alt: 'Bodrum Route Image',
      },
      width: 1432,
      height: 1170,
    },
    mobile: {
      image: {
        src: '/images/itinerary/turkey/bodrum-itinerary/mobile-map.webp',
        alt: 'Bodrum Route Image',
      },
      width: 875,
      height: 1093,
    },
  },
};

export default computeItineraryNumberOfDays(bodrumRoute);
