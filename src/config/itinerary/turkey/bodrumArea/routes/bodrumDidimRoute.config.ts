import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const bodrumDidimRoute: ItineraryRoute = {
  metaTitle: 'Bodrum–Didim Yacht Charter Route | Turkish Aegean Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Bodrum north via Yalıkavak, Türkbükü, Güllük, Didim, Kuşadası and Özdere — Turkish Aegean north coast loop with Ephesus + Apollo temple ruins.',
  id: 'bodrum-didim',
  startingPoint: 'Bodrum',
  otherPoints: ['Didim'],
  cardImage: { src: '/images/itinerary/turkey/bodrum-itinerary/routes/bodrum-didim.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/turkey/banners/bodrum-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/aegean-banner-large.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/bodrum-banner.webp', alt: '' },
    { src: '/images/itinerary/turkey/banners/bodrum-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'bodrum',
      routeFrom: 'Bodrum',
      routeTo: 'Bodrum',
      day: 1,
      mapPin: {
        desktop: { left: 56.9, top: 90.4 },
        mobile: { left: 56.9, top: 90.4 },
      },
      description:
        'Provisioning + harbour day at Bodrum Marina. Walk the 15th-c Castle of St Peter (Museum of Underwater Archaeology, Uluburun Bronze Age shipwreck displayed inside). Ancient Halicarnassus mausoleum ruins (one of the Seven Wonders of the Ancient World, 4th-c BC) 500 m from the marina.',
      shortDescription:
        'Provisioning day at Bodrum Marina. 15th-c Castle of St Peter (Underwater Archaeology Museum) + 4th-c BC Halicarnassus mausoleum (Seven Wonders). Refuel at the entrance fuel berth. Plan to bazaar haggling for spices + leather and meze platters at a waterfront meyhane.',
      thingsToDo: [
        'Visit the 15th-c Castle of St Peter Museum',
        'See the 4th-c BC Halicarnassus mausoleum ruins',
        'Bazaar haggling for spices + leather',
        'Meze platters at a waterfront meyhane',
      ],
      mooringTip:
        'Bodrum Marina stern-to with lazy lines, €80-130/night peak, fully sheltered. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/bodrum-town.webp', alt: 'Bodrum' }],
    },
    {
      id: 'bodrum-yalikavak-gol-turkbuku',
      routeFrom: 'Bodrum',
      routeTo: 'Yalıkavak & Göl Türkbükü',
      day: 2,
      mapPin: {
        desktop: { left: 48.7, top: 83.5 },
        mobile: { left: 48.7, top: 83.5 },
      },
      description:
        '12 nm north to Yalıkavak — most exclusive marina on the Turkish Aegean (Palmarina, opened 2014, the closest competitor to Costa Smeralda for premium-yacht clientele). Göl Türkbükü 4 nm east is the quieter alternative — pine-fringed coves, smaller harbour. Göl Türkbükü small marina €100-160/night cheaper alternative. Plan to boutique browse along Palmarina alleys and sundowner at a beach bar.',
      shortDescription:
        '12 nm N to Yalıkavak Palmarina (2014, most exclusive Turkish Aegean — Costa Smeralda competitor). Göl Türkbükü 4 nm E quieter alternative. Highlights: Walk Yalıkavak Palmarina superyacht dock and Anchor swim at Göl Türkbükü pine-fringed cove.',
      thingsToDo: [
        'Walk Yalıkavak Palmarina superyacht dock',
        'Anchor swim at Göl Türkbükü pine-fringed cove',
        'Boutique browse along Palmarina alleys',
        'Sundowner at a beach bar',
      ],
      mooringTip:
        'Yalıkavak Palmarina stern-to, €200-400/night peak (premium). Göl Türkbükü small marina €100-160/night cheaper alternative.',
      gallery: [
        { src: '/images/itinerary/turkey/destinations/yalikavak-golturkbuku.webp', alt: 'Yalıkavak & Göl Türkbükü' },
      ],
    },
    {
      id: 'gol-turkbuku-gulluk',
      routeFrom: 'Göl Türkbükü',
      routeTo: 'Güllük',
      day: 3,
      mapPin: {
        desktop: { left: 71.6, top: 71.7 },
        mobile: { left: 71.6, top: 71.7 },
      },
      description:
        '12 nm north to Güllük — quiet fishing port, Iasos archaeological site (4th-c BC Carian-Greek city, Byzantine walls + Roman agora) on the headland 2 km south. Anchor in Güllük Bay on sand 5-7 m, sheltered from N. Plan to walk the 4th-c BC Iasos Byzantine + Roman ruins, anchor swim in glassy Güllük Bay, çöp şiş grilled lamb skewers at a family quay restaurant.',
      shortDescription:
        '12 nm N to Güllük quiet fishing port. Iasos 4th-c BC Carian-Greek city + Byzantine walls + Roman agora 2 km S. Sand anchorage sheltered N.',
      thingsToDo: [
        'Walk the 4th-c BC Iasos Byzantine + Roman ruins',
        'Anchor swim in glassy Güllük Bay',
        'Çöp şiş grilled lamb skewers at a family quay restaurant',
        'Smell olive-wood and sage on the waterfront',
      ],
      mooringTip:
        'Güllük small marina stern-to, €60-100/night, sheltered from N. Anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/milas-gulluk.webp', alt: 'Güllük' }],
    },
    {
      id: 'gulluk-didim',
      routeFrom: 'Güllük',
      routeTo: 'Didim',
      day: 4,
      mapPin: {
        desktop: { left: 44.7, top: 59.1 },
        mobile: { left: 44.7, top: 59.1 },
      },
      description:
        '20 nm north to Didim — site of the Temple of Apollo (4th-c BC, the third-largest Greek temple ever built, 122 columns each 19.7 m tall, sanctuary of the Branchidae oracle). D-Marin Didim stern-to is the standard charter overnight. Altınkum Beach golden sand 1 nm south.',
      shortDescription:
        '20 nm N to Didim — 4th-c BC Temple of Apollo (3rd-largest Greek temple, 122 cols 19.7 m, Branchidae oracle). D-Marin Didim. Altınkum gold-sand 1 nm S.',
      thingsToDo: [
        'Visit the 4th-c BC Temple of Apollo (122 columns)',
        'Anchor swim at Altınkum Beach golden sand',
        'Buy lokum (Turkish delight) from a family confectionery',
        'Walk the harbour bazaar for handwoven textiles',
      ],
      mooringTip:
        'D-Marin Didim stern-to with lazy lines, €100-160/night peak, fully sheltered. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/didim.webp', alt: 'Didim' }],
    },
    {
      id: 'didim-kusadasi',
      routeFrom: 'Didim',
      routeTo: 'Kuşadası',
      day: 5,
      mapPin: {
        desktop: { left: 42.8, top: 14 },
        mobile: { left: 42.8, top: 14 },
      },
      description:
        '32 nm long north to Kuşadası — major cruise-ship port + gateway to Ephesus (UNESCO, 1st-c AD Roman city, the largest archaeological site in the eastern Mediterranean). Setur Kuşadası Marina stern-to. Ephesus tour is 4-hour shore excursion by taxi. Refuel at the entrance fuel berth.',
      shortDescription:
        '32 nm long N to Kuşadası — gateway to UNESCO Ephesus (1st-c AD Roman city, largest E Med archaeological site). Setur Marina. Ephesus 4-h taxi excursion.',
      thingsToDo: [
        'Day-trip to Ephesus UNESCO Roman city',
        'Walk the Library of Celsus + Great Theatre',
        "Anchor swim at Ladies' Beach",
        'Browse the Kuşadası bazaar for silk + spices',
      ],
      mooringTip:
        'Setur Kuşadası Marina stern-to, €100-160/night peak, fully sheltered. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/kusadasi.webp', alt: 'Kuşadası' }],
    },
    {
      id: 'kusadasi-ozdere',
      routeFrom: 'Kuşadası',
      routeTo: 'Özdere',
      day: 6,
      mapPin: {
        desktop: { left: 32, top: 4.8 },
        mobile: { left: 32, top: 4.8 },
      },
      description:
        '15 nm west to Özdere — quiet Aegean coastal village, natural rock-pool thermal springs at the shore, paddleboard-friendly cliff coves with wildflowers. Anchor in the bay on sand 4-6 m, sheltered from N. Anchor in the bay on sand at 4-6 m as alternative. Plan to zeytinyağlı olive-oil dishes at a beach taverna and tasting local Aegean white wine.',
      shortDescription:
        '15 nm W to Özdere — quiet Aegean village, natural rock-pool thermal springs at shore. Cliff-cove paddleboard. Sand anchorage sheltered N. Highlights: Soak in the rock-pool thermal springs and Paddleboard the cliff coves with wildflowers.',
      thingsToDo: [
        'Soak in the rock-pool thermal springs',
        'Paddleboard the cliff coves with wildflowers',
        'Zeytinyağlı olive-oil dishes at a beach taverna',
        'Tasting local Aegean white wine',
      ],
      mooringTip:
        'Özdere small marina stern-to, €40-70/night, sheltered from N. Anchor in the bay on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/ozdere.webp', alt: 'Özdere' }],
    },
    {
      id: 'ozdere-bodrum',
      routeFrom: 'Özdere',
      routeTo: 'Bodrum',
      day: 7,
      description:
        '60 nm long south back to Bodrum Marina. Long passage day — leave at first light. Optional Kara Ada thermal-spring swim stop on the way. Refuel at Bodrum before tying up. Refuel at the entrance fuel berth. Plan to crew dinner at a cliffside restaurant and sunset cocktail with the Aegean breeze.',
      shortDescription:
        '60 nm long S back to Bodrum Marina. Leave at first light. Optional Kara Ada thermal-spring swim stop. Refuel before mooring. Refuel at the entrance fuel berth. Plan to crew dinner at a cliffside restaurant and sunset cocktail with the Aegean breeze.',
      thingsToDo: [
        'Optional Kara Ada thermal-spring swim',
        'Refuel and clean the boat at Bodrum Marina',
        'Crew dinner at a cliffside restaurant',
        'Sunset cocktail with the Aegean breeze',
      ],
      mooringTip:
        'Bodrum Marina stern-to with lazy lines, €80-130/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/turkey/destinations/bodrum-town.webp', alt: 'Bodrum' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/turkey/bodrum-itinerary/bodrumDidim-map.webp',
        alt: 'Bodrum Route Image',
      },
      width: 952,
      height: 1063,
    },
    mobile: {
      image: {
        src: '/images/itinerary/turkey/bodrum-itinerary/bodrumDidim-map.webp',
        alt: 'Bodrum Route Image',
      },
      width: 952,
      height: 1063,
    },
  },
};

export default computeItineraryNumberOfDays(bodrumDidimRoute);
