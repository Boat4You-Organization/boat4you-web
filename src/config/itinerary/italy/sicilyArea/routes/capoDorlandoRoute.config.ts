import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const capoDorlandoRoute: ItineraryRoute = {
  metaTitle: "Capo d'Orlando – Aeolian Islands Yacht Itinerary | Sicily Sailing",
  metaDesc:
    "Sail a 7-day yacht charter from Capo d'Orlando through Vulcano, Filicudi, Salina, Stromboli, Panarea and Lipari — Aeolian volcanic archipelago from the Sicilian mainland.",
  id: 'capo-dorlando',
  startingPoint: "Capo d'Orlando",
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/sicily-itinerary/routes/capo-dorlando.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/lipari-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/stromboli-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/panarea-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/saura-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'capo-d-orlando-vulcano-porto',
      routeFrom: "Capo d'Orlando",
      routeTo: 'Vulcano Porto',
      day: 1,
      mapPin: {
        desktop: { left: 94.5, top: 62.8 },
        mobile: { left: 94.5, top: 62.8 },
      },
      description:
        "20 nm shake-down north from Capo d'Orlando Marina to Vulcano. Porto di Levante is the standard charter overnight. Sulphur thermal mud bath at Laghetto di Fanghi by the harbour foot is the headline shore activity (€5 entry). Hike Gran Cratere (1 h up, 391 m) for the post-sundown panorama back to Stromboli.",
      shortDescription:
        "20 nm shake-down N from Capo d'Orlando to Vulcano. Porto di Levante for overnight. Sulphur mud bath at Laghetto di Fanghi (€5). Gran Cratere hike for panorama.",
      thingsToDo: [
        'Sulphur mud bath at Laghetto di Fanghi',
        'Hike Gran Cratere (391 m, 1 h up)',
        'Snorkel the Pool of Venus thermal vents',
        'Pesce stocco salted-cod stew at a quay trattoria',
      ],
      mooringTip:
        'Porto di Levante stern-to, €60-100/night, sheltered from N. Sulphur smell localised — moor on the far side of the harbour.',
      gallery: [{ src: '/images/itinerary/italy/destinations/vulcano.webp', alt: 'Vulcano Porto' }],
    },
    {
      id: 'vulcano-filicudi-porto',
      routeFrom: 'Vulcano',
      routeTo: 'Filicudi Porto',
      day: 2,
      mapPin: {
        desktop: { left: 84.8, top: 49.9 },
        mobile: { left: 84.8, top: 49.9 },
      },
      description:
        '20 nm west to Filicudi — wildest of the Aeolians, donkey paths, 250 residents. La Canna 85 m volcanic spire 1 nm west. Filicudi Porto on the east is the small charter port; Pecorini a Mare on the south is the fishing-village quay alternative.',
      shortDescription:
        '20 nm W to Filicudi — wildest Aeolian, donkey paths. La Canna 85 m volcanic spire 1 nm W. Filicudi Porto E coast or Pecorini quay.',
      thingsToDo: [
        'Snorkel La Canna volcanic spire',
        'Kayak into Grotta del Bue Marino sea cave',
        'Hike to the Bronze Age Capo Graziano ruins',
        'Sea-urchin ricci pasta at a Pecorini taverna',
      ],
      mooringTip:
        'Filicudi Porto stern-to, €60-90/night, sheltered from N. Pecorini anchor on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/filicudi.webp', alt: 'Filicudi Porto' }],
    },
    {
      id: 'filicudi-santa-marina-salina',
      routeFrom: 'Filicudi',
      routeTo: 'Santa Marina Salina',
      day: 3,
      mapPin: {
        desktop: { left: 72.8, top: 36.1 },
        mobile: { left: 72.8, top: 36.1 },
      },
      description:
        '15 nm east to Salina — twin volcanic peaks, only fertile Aeolian. Santa Marina on the east coast is the standard overnight; Malvasia vineyards + caper terraces on the slopes above. Pollara on the west coast is the Il Postino cliff-village setting (1994 film).',
      shortDescription:
        '15 nm E to Salina — only fertile Aeolian, Malvasia + capers. Santa Marina E for overnight. Pollara W coast = Il Postino 1994 setting.',
      thingsToDo: [
        'Tasting Malvasia delle Lipari at Hauner Winery',
        'Walk Pollara cliff-village (Il Postino setting)',
        'Black-sand swim at Pollara Bay',
        'Hike Monte Fossa delle Felci (962 m)',
      ],
      mooringTip:
        'Santa Marina Salina stern-to, €60-100/night, sheltered from N. Rinella on south coast as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/salina.webp', alt: 'Santa Marina Salina' }],
    },
    {
      id: 'salina-stromboli',
      routeFrom: 'Salina',
      routeTo: 'Stromboli',
      day: 4,
      mapPin: {
        desktop: { left: 82, top: 31.7 },
        mobile: { left: 82, top: 31.7 },
      },
      description:
        '20 nm northeast to Stromboli — active volcano, eruptions every 15-20 minutes from the summit. Sciara del Fuoco (north slope) is the lava-flow viewing point; charter boats anchor offshore at sundown. Scari quay on the south coast for daytime mooring.',
      shortDescription:
        '20 nm NE to Stromboli — active volcano. Sciara del Fuoco N slope for sundown eruption viewing. Scari S quay for daytime mooring. Highlights: Anchor offshore Sciara del Fuoco for sunset eruption show and Walk Ginostra car-free white-cube village.',
      thingsToDo: [
        'Anchor offshore Sciara del Fuoco for sunset eruption show',
        'Walk Ginostra car-free white-cube village',
        "Cannoli at L'Osservatorio with volcano view",
        'Daytime hike to 400 m crater viewpoint',
      ],
      mooringTip:
        'Anchor off Sciara del Fuoco on rocky bottom 8-12 m for the night-eruption show. Scari quay stern-to €40-60/night for calm-night mooring.',
      gallery: [{ src: '/images/itinerary/italy/destinations/stromboli.webp', alt: 'Stromboli' }],
    },
    {
      id: 'stromboli-panarea',
      routeFrom: 'Stromboli',
      routeTo: 'Panarea',
      day: 5,
      mapPin: {
        desktop: { left: 93.7, top: 13.4 },
        mobile: { left: 93.7, top: 13.4 },
      },
      description:
        '12 nm southwest to Panarea — smallest, most fashionable Aeolian. Cala Junco UNESCO Bronze Age archaeological cove on the south coast. Basiluzzo islet 1 nm east has Roman remains underwater. Marina San Pietro on the east coast for overnight. Cala Junco day-anchor on sand at 4-6 m as alternative. Plan to black-sand swim at Spiaggia degli Zimmari and aperol spritz at Raya Bar (cliff-cut DJ bar).',
      shortDescription:
        '12 nm SW to Panarea — smallest, most fashionable Aeolian. Cala Junco UNESCO cove + Basiluzzo Roman underwater remains 1 nm E. Marina San Pietro stern-to, €100-160/night peak, sheltered from N. Plan to black-sand swim at Spiaggia degli Zimmari and aperol spritz at Raya Bar (cliff-cut DJ bar).',
      thingsToDo: [
        'Snorkel Cala Junco UNESCO Bronze Age cove',
        'Snorkel Basiluzzo underwater Roman columns',
        'Black-sand swim at Spiaggia degli Zimmari',
        'Aperol spritz at Raya Bar (cliff-cut DJ bar)',
      ],
      mooringTip:
        'Marina San Pietro stern-to, €100-160/night peak, sheltered from N. Cala Junco day-anchor on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/panarea.webp', alt: 'Panarea' }],
    },
    {
      id: 'panarea-lipari',
      routeFrom: 'Panarea',
      routeTo: 'Lipari',
      day: 6,
      mapPin: {
        desktop: { left: 88.5, top: 27.8 },
        mobile: { left: 88.5, top: 27.8 },
      },
      description:
        '12 nm southwest to Lipari — capital of the Aeolians. Marina Lunga at Lipari town for stern-to overnight. Pumice Quarries on the north coast for the unique white-cliff swim. Aeolian Archaeological Museum at the kastro is the regional headline shore activity.',
      shortDescription:
        '12 nm SW to Lipari — capital of Aeolians. Marina Lunga for overnight. Pumice Quarries N coast white-cliff swim. Archaeological Museum at kastro. Marina Lunga stern-to, €70-120/night peak. Plan to walk the Norman Lipari Cathedral cobbled lanes and cunigghiu rabbit stew on Marina Corta.',
      thingsToDo: [
        'Swim Pumice Quarries (white cliffs + Caribbean water)',
        'Visit the Aeolian Archaeological Museum',
        'Walk the Norman Lipari Cathedral cobbled lanes',
        'Cunigghiu rabbit stew on Marina Corta',
      ],
      mooringTip: 'Marina Lunga stern-to, €70-120/night peak. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/italy/destinations/lipari.webp', alt: 'Lipari' }],
    },
    {
      id: 'lipari-tono-capo-d-orlando',
      routeFrom: 'Lipari',
      routeTo: "Tono - Capo d'Orlando",
      day: 7,
      mapPin: {
        desktop: { left: 86.8, top: 41.8 },
        mobile: { left: 86.8, top: 41.8 },
      },
      description:
        "20 nm south back to Capo d'Orlando Marina via Tono — small bay on the north Sicilian coast for swim. Refuel at Capo d'Orlando before tying up. Standard 14:00 marina arrival for handover-prep evening. Refuel at the entrance fuel berth.",
      shortDescription:
        "20 nm S back to Capo d'Orlando via Tono swim. Refuel at marina before mooring. Standard 14:00 arrival for handover-prep. Refuel at the entrance fuel berth.",
      thingsToDo: [
        'Optional swim stop at Tono Bay',
        "Almond granita at a Capo d'Orlando seafront kiosk",
        "Refuel and clean the boat at Capo d'Orlando",
        'Crew dinner on the Lungomare promenade',
      ],
      mooringTip:
        "Capo d'Orlando Marina stern-to with lazy lines, €70-110/night peak. Refuel at the entrance fuel berth. Confirm handover slot 24h ahead.",
      gallery: [{ src: '/images/itinerary/italy/destinations/lipari.webp', alt: 'Tono' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/map.webp',
        alt: "Capo d'Orlando Route Image",
      },
      width: 2778,
      height: 1162,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/mobile-map.webp',
        alt: "Capo d'Orlando Route Image",
      },
      width: 1814,
      height: 1336,
    },
  },
};

export default computeItineraryNumberOfDays(capoDorlandoRoute);
