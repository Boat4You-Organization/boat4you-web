import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lipariRoute: ItineraryRoute = {
  metaTitle: '7-Day Lipari Aeolian Islands Yacht Charter Route | Sicily Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Lipari through Vulcano, Filicudi, Stromboli, Panarea and Salina — the seven Aeolian volcanic islands, UNESCO listed.',
  id: 'lipari',
  startingPoint: 'Lipari',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/sicily-itinerary/routes/lipari.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/lipari-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/stromboli-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/panarea-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/saura-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'lipari-portorosa',
      routeFrom: 'Lipari',
      routeTo: 'Portorosa',
      day: 1,
      mapPin: {
        desktop: { left: 85.4, top: 42.4 },
        mobile: { left: 85.4, top: 42.4 },
      },
      description:
        '20 nm shake-down south from Lipari to Portorosa Marina on the north Sicilian coast. Wind regime is the Maestrale (NW thermal) at 10-15 kn. Portorosa is one of the largest mainland-side charter marinas in Sicily; full services, lazy lines. Mount Etna visible 50 nm south on a clear day.',
      shortDescription:
        '20 nm shake-down S from Lipari to Portorosa mainland marina. Maestrale NW thermal 10-15 kn. Full services, lazy lines. Mount Etna visible 50 nm S in clear weather.',
      thingsToDo: [
        'Sunset on the marina pier with Etna view',
        'Pasta alla Norma at a quay trattoria',
        'Refuel and provision for the Aeolian week',
        'Walk the historic Tindari archaeological site (taxi)',
      ],
      mooringTip: 'Marina di Portorosa stern-to with lazy lines, €100-160/night peak. Full services. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/italy/destinations/portorosa.webp', alt: 'Portorosa' }],
    },
    {
      id: 'portorosa-vulcano',
      routeFrom: 'Portorosa',
      routeTo: 'Vulcano',
      day: 2,
      mapPin: {
        desktop: { left: 89.2, top: 74.2 },
        mobile: { left: 93.4, top: 55.6 },
      },
      description:
        '15 nm north to Vulcano — southernmost Aeolian island, active volcanic vents, sulphur-scented air. Porto di Levante on the north coast is the standard charter overnight. Laghetto di Fanghi mud bath at the harbour foot is the headline activity (sulphur thermal mud, claimed therapeutic, €5 entry).',
      shortDescription:
        '15 nm N to Vulcano — southernmost Aeolian, active volcanic vents. Porto di Levante for overnight. Laghetto di Fanghi sulphur mud bath at harbour foot, €5 entry.',
      thingsToDo: [
        'Sulphur mud bath at Laghetto di Fanghi',
        'Hike Gran Cratere (1 h up, 391 m, panorama)',
        'Snorkel the Pool of Venus thermal vents',
        'Grilled swordfish at Trattoria Vulcano',
      ],
      mooringTip:
        'Porto di Levante stern-to, €60-100/night, sheltered from N. Sulphur smell is real but localised — moor on the far side of the harbour from the fumarolic vents.',
      gallery: [{ src: '/images/itinerary/italy/destinations/vulcano.webp', alt: 'Vulcano' }],
    },
    {
      id: 'vulcano-filicudi',
      routeFrom: 'Vulcano',
      routeTo: 'Filicudi',
      day: 3,
      mapPin: {
        desktop: { left: 86.9, top: 50 },
        mobile: { left: 89.5, top: 43.9 },
      },
      description:
        '20 nm west to Filicudi — wildest of the Aeolians, 250 residents, donkeys still working the village paths. La Canna 85 m volcanic spire rises from the sea 1 nm west of the island. Pecorini a Mare is the fishing-village quay; Filicudi Porto on the east is the small charter port.',
      shortDescription:
        '20 nm W to Filicudi — wildest Aeolian, 250 residents, donkey paths. La Canna 85 m volcanic spire 1 nm W. Filicudi Porto E coast or Pecorini quay.',
      thingsToDo: [
        'Snorkel La Canna volcanic spire (85 m)',
        'Kayak into Grotta del Bue Marino sea cave',
        'Hike to the Bronze Age Capo Graziano ruins',
        'Pasta con le sarde at a Pecorini taverna',
      ],
      mooringTip:
        'Filicudi Porto stern-to, €60-90/night, sheltered from N. Pecorini anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/filicudi.webp', alt: 'Filicudi' }],
    },
    {
      id: 'filicudi-stromboli',
      routeFrom: 'Filicudi',
      routeTo: 'Stromboli',
      day: 4,
      mapPin: {
        desktop: { left: 73.5, top: 35.6 },
        mobile: { left: 73.5, top: 35.6 },
      },
      description:
        '32 nm long northeast to Stromboli — active volcano, Strombolian eruptions every 15-20 minutes. Sciara del Fuoco (north slope) is where lava flows into the sea; charter boats anchor offshore at sundown for the night-eruption viewing. Scari quay on the south coast for daytime mooring.',
      shortDescription:
        '32 nm long NE to Stromboli — active volcano, eruptions every 15-20 min. Anchor off Sciara del Fuoco at sundown for the night-eruption show. Scari quay daytime.',
      thingsToDo: [
        'Anchor offshore Sciara del Fuoco for sunset eruption show',
        'Walk Ginostra car-free white-cube village',
        "Cannoli at L'Osservatorio with volcano view",
        'Hike to 400 m viewpoint (no permit) for daytime crater view',
      ],
      mooringTip:
        'Anchor off Sciara del Fuoco on rocky bottom 8-12 m for the eruption viewing (no overnight). Scari quay stern-to €40-60/night for daytime/calm-night mooring.',
      gallery: [{ src: '/images/itinerary/italy/destinations/stromboli.webp', alt: 'Stromboli' }],
    },
    {
      id: 'stromboli-panarea',
      routeFrom: 'Stromboli',
      routeTo: 'Panarea',
      day: 5,
      mapPin: {
        desktop: { left: 93.1, top: 14.5 },
        mobile: { left: 94.9, top: 21.7 },
      },
      description:
        '12 nm southwest to Panarea — smallest and most fashionable of the Aeolians, the favourite of the Milanese summer set. Cala Junco UNESCO Bronze Age archaeological cove on the south coast. Lisca Bianca underwater fumaroles 1 nm east for snorkel. Marina San Pietro on the east coast is the small charter port.',
      shortDescription:
        '12 nm SW to Panarea — smallest, most fashionable Aeolian. Cala Junco UNESCO Bronze Age cove. Lisca Bianca underwater fumaroles 1 nm E. Marina San Pietro stern-to, €100-160/night peak, sheltered from N. Plan to aperol spritz at Raya Bar (cliff-cut DJ bar) and hand-painted ceramics at San Pietro studios.',
      thingsToDo: [
        'Snorkel Cala Junco UNESCO Bronze Age cove',
        'Snorkel Lisca Bianca underwater fumaroles (champagne bubbles)',
        'Aperol spritz at Raya Bar (cliff-cut DJ bar)',
        'Hand-painted ceramics at San Pietro studios',
      ],
      mooringTip:
        'Marina San Pietro stern-to, €100-160/night peak, sheltered from N. Cala Junco day-anchor on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/panarea.webp', alt: 'Panarea' }],
    },
    {
      id: 'panarea-salina',
      routeFrom: 'Panarea',
      routeTo: 'Salina',
      day: 6,
      mapPin: {
        desktop: { left: 88.9, top: 29.2 },
        mobile: { left: 88.9, top: 29.2 },
      },
      description:
        '8 nm west to Salina — second-largest Aeolian, twin volcanic peaks, the only fertile island (Malvasia vineyards + caper terraces). Santa Marina Salina on the east coast is the standard charter overnight. Pollara on the west coast is the Il Postino cliffside village setting (1994 film).',
      shortDescription:
        '8 nm W to Salina — twin volcanic peaks, only fertile Aeolian. Santa Marina E coast for overnight. Pollara W coast = Il Postino 1994 film village.',
      thingsToDo: [
        'Tasting Malvasia delle Lipari at Hauner Winery',
        'Granita di gelsi (mulberry ice) at Da Alfredo',
        'Walk Pollara cliff-village (Il Postino setting)',
        'Hike Monte Fossa delle Felci (962 m, 4 h)',
      ],
      mooringTip: 'Santa Marina Salina stern-to, €60-100/night, sheltered from N. Rinella south coast as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/salina.webp', alt: 'Salina' }],
    },
    {
      id: 'salina-lipari',
      routeFrom: 'Salina',
      routeTo: 'Lipari',
      day: 7,
      mapPin: {
        desktop: { left: 83.5, top: 32.1 },
        mobile: { left: 83.5, top: 32.1 },
      },
      description:
        '6 nm short southeast back to Lipari — largest and most populous Aeolian, the archipelago capital. Marina Lunga at Lipari town for stern-to overnight. Pumice Quarries on the north coast are the unique post-industrial swim site (white pumice cliffs + Caribbean water). Refuel at Marina Lunga before tying up.',
      shortDescription:
        '6 nm short SE back to Lipari — capital of archipelago. Marina Lunga for overnight. Pumice Quarries N coast for unique post-industrial swim. Refuel before mooring.',
      thingsToDo: [
        'Swim Pumice Quarries (white cliffs + Caribbean water)',
        'Visit the Aeolian Archaeological Museum',
        'Walk the Norman Lipari Cathedral cobbled lanes',
        'Limoncello tasting on Marina Corta',
      ],
      mooringTip:
        'Marina Lunga stern-to, €70-120/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/italy/destinations/lipari.webp', alt: 'Lipari' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/map.webp',
        alt: 'Lipari Route Image',
      },
      width: 2778,
      height: 1162,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/mobile-map.webp',
        alt: 'Lipari Route Image',
      },
      width: 1814,
      height: 1336,
    },
  },
};

export default computeItineraryNumberOfDays(lipariRoute);
