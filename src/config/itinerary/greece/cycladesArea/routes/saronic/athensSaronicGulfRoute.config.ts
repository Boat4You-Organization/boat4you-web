import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const athensSaronicGulfRoute: ItineraryRoute = {
  metaTitle: 'Athens – Saronic Gulf Yacht Charter | Greece Sailing Routes',
  metaDesc:
    'Sail a 7-day yacht charter from Athens through the Saronic — Aegina, Poros, Spetses, Hydra and Agistri. Sheltered cruising ground for first-time bareboat or family crews.',
  id: 'athens-saronic-gulf',
  startingPoint: 'Athens',
  otherPoints: ['Saronic gulf'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/athens-saronic-gulf.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/agistri-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/spetses-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/aegina-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/spetses-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'athens-aegina',
      routeFrom: 'Athens (Alimos)',
      routeTo: 'Aegina',
      day: 1,
      mapPin: {
        desktop: { left: 54.2, top: 6.4 },
        mobile: { left: 50.1, top: 17.1 },
      },
      description:
        '15 nm shake-down hop southwest from Alimos to Aegina. The Saronic is a sheltered cruising ground — wind rarely above 18 knots in summer, fetch limited by surrounding islands and Peloponnese mainland. Aegina town harbour is on the west coast; stern-to quay, €25-40/night. The Temple of Aphaia (5th-century BC, predates the Parthenon) is a 30-minute taxi from the harbour and the headline shore activity.',
      shortDescription:
        '15 nm shake-down SW to Aegina. Saronic is sheltered — wind rarely above 18 kn. Aegina town harbour stern-to; Temple of Aphaia (5th-c BC) is the headline shore activity.',
      thingsToDo: [
        'Taxi to the Temple of Aphaia (5th-c BC)',
        'Buy roasted pistachios at the harbour stalls',
        'Swim Marathonas Beach (south of town)',
        'Gourounopoulo (suckling pig) at a waterfront taverna',
      ],
      mooringTip:
        'Aegina town quay stern-to, €25-40/night, sheltered. Perdika (south coast) is the alternative for the quieter overnight.',
      gallery: [{ src: '/images/itinerary/greece/destinations/aegina.webp', alt: 'Aegina' }],
    },
    {
      id: 'aegina-poros',
      routeFrom: 'Aegina',
      routeTo: 'Poros',
      day: 2,
      mapPin: {
        desktop: { left: 42.9, top: 18.5 },
        mobile: { left: 39.2, top: 24 },
      },
      description:
        '14 nm southwest to Poros. Pine-clad island separated from the Peloponnese mainland by a 200-m channel. Stern-to on the long town quay along the waterfront — easy mooring, €25-40/night. Day-anchor at Love Bay on the south coast for swim before mooring; pine trees come down to the water, sand bottom, sheltered from N.',
      shortDescription:
        '14 nm southwest to Poros. Pine-clad island separated from the mainland by a 200 m channel. Day-anchor at Love Bay before mooring at the long town quay.',
      thingsToDo: [
        'Anchor swim at Love Bay (south coast)',
        'Walk to the Temple of Poseidon ruins',
        'Saganaki cheese flambéed at the waterfront',
        'Cycle the island lemon-grove loop',
      ],
      mooringTip:
        'Stern-to in Poros town quay, €25-40/night. Sheltered from any direction. Love Bay anchor on sand at 5-7 m, sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/poros.webp', alt: 'Poros' }],
    },
    {
      id: 'poros-spetses',
      routeFrom: 'Poros',
      routeTo: 'Spetses',
      day: 3,
      mapPin: {
        desktop: { left: 43.3, top: 36.5 },
        mobile: { left: 39.8, top: 34.5 },
      },
      description:
        '20 nm southwest to Spetses — the southernmost Saronic charter island, no cars allowed in the old town (horse carriages and bicycles only). Dapia Old Harbour stern-to is the headline overnight; the surrounding 19th-century shipowner mansions are the architectural payload of the visit. Day-anchor at Zogeria (north coast, sand 5-7 m) for swim before mooring.',
      shortDescription:
        '20 nm southwest to Spetses. Car-free old town, 19th-c shipowner mansions. Dapia harbour for overnight; Zogeria north coast for day-anchor swim. Stern-to in Dapia harbour, €30-50/night. Plan to walk the car-free old town with horse carriages and cycle the island perimeter road.',
      thingsToDo: [
        'Walk the car-free old town with horse carriages',
        'Anchor swim at Zogeria (north coast)',
        'Cycle the island perimeter road',
        'Sunset cocktails at Old Harbour pirate bars',
      ],
      mooringTip:
        'Stern-to in Dapia harbour, €30-50/night. Sheltered from N. Old Harbour is the smaller alternative for the photogenic 19th-c waterfront.',
      gallery: [{ src: '/images/itinerary/greece/destinations/spetses.webp', alt: 'Spetses' }],
    },
    {
      id: 'spetses-hydra',
      routeFrom: 'Spetses',
      routeTo: 'Hydra',
      day: 4,
      mapPin: {
        desktop: { left: 26.3, top: 53.5 },
        mobile: { left: 22.7, top: 44.8 },
      },
      description:
        '20 nm north to Hydra. No cars on Hydra either — donkeys carry luggage from the harbour to the cliff-side village houses. Hydra harbour stern-to is fierce competition for slots; arrive by 15:00 or anchor in Mandraki Bay 1 nm east of the town and tender in. The cliff-cut Spilia Beach Bar above the harbour is the famous sunset stop.',
      shortDescription:
        '20 nm north to Hydra. No cars, donkeys carry luggage. Harbour stern-to slot competition fierce — arrive by 15:00 or anchor in Mandraki Bay east of town.',
      thingsToDo: [
        'Walk the cliff-side stone alleys (no cars)',
        'Drink at Spilia Beach Bar cliff cut-out',
        'Swim Vlychos Beach (15 min walk west)',
        'Hike to Profitis Ilias monastery',
      ],
      mooringTip:
        'Hydra harbour stern-to, €30-50/night, slot fills by 15:00. Anchor in Mandraki Bay 1 nm east on sand at 6-8 m if full. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/hydra.webp', alt: 'Hydra' }],
    },
    {
      id: 'hydra-aegina',
      routeFrom: 'Hydra',
      routeTo: 'Aegina',
      day: 5,
      mapPin: {
        desktop: { left: 41.7, top: 47.9 },
        mobile: { left: 37.9, top: 41.7 },
      },
      description:
        '25 nm north back to Aegina. Second visit on the route — switch to Perdika village on the south coast of Aegina for the quieter overnight. Smaller harbour, no Aphaia Temple crowds, family tavernas on the quay. Day-anchor at Marathonas Beach for swim before Perdika mooring.',
      shortDescription:
        '25 nm north back to Aegina — second visit, switch to Perdika village south coast for the quieter overnight. Day-anchor at Marathonas Beach for swim.',
      thingsToDo: [
        'Walk the Perdika fishing-quay tavernas',
        'Swim Marathonas Beach (sand)',
        'Visit Agios Nektarios monastery',
        'Pistachio-crust baklava at a Perdika kafeneio',
      ],
      mooringTip:
        'Stern-to in Perdika harbour, €20-30/night, sheltered from N. Aegina town quay is the alternative for the larger waterfront scene.',
      gallery: [{ src: '/images/itinerary/greece/destinations/aegina.webp', alt: 'Aegina' }],
    },
    {
      id: 'aegina-agistri',
      routeFrom: 'Aegina',
      routeTo: 'Agistri',
      day: 6,
      mapPin: {
        desktop: { left: 450, top: 250 },
        mobile: { left: 230, top: 300 },
      },
      description:
        '5 nm short hop northwest to Agistri — small pine-fringed island 5 nm west of Aegina, the quietest stop in the Saronic charter circuit. Skala harbour on the east coast is the standard overnight; small, sheltered, family tavernas on the quay. Day-anchor at Aponissos (south coast, sand 4-6 m, sheltered from N) for swim.',
      shortDescription:
        '5 nm short hop NW to Agistri — quietest stop in the Saronic. Skala harbour for overnight. Day-anchor at Aponissos south coast for swim before mooring.',
      thingsToDo: [
        'Anchor swim at Aponissos (south coast)',
        'Cycle the cypress-grove island loop',
        'Lobster spaghetti at a Skala family taverna',
        'Hike to Metochi village (15 min from Skala)',
      ],
      mooringTip:
        'Stern-to in Skala harbour, €20-30/night, sheltered from N. Aponissos for day-anchor on sand at 4-6 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/agistri.webp', alt: 'Agistri' }],
    },
    {
      id: 'agistri-athens',
      routeFrom: 'Agistri',
      routeTo: 'Athens (Alimos)',
      day: 7,
      mapPin: {
        desktop: { left: 35.9, top: 23.2 },
        mobile: { left: 33, top: 27 },
      },
      description:
        '20 nm northeast back to Alimos. Optional swim stop at Moni Island (off Aegina) on the way. Refuel at Alimos before tying up so the crew can step off the boat ready for transfers. Standard 14:00 marina arrival for a relaxed handover-prep afternoon.',
      shortDescription:
        '20 nm NE back to Alimos. Optional swim stop at Moni Island off Aegina. Standard 14:00 marina arrival. Refuel before mooring. Confirm handover slot 24h ahead. Plan to crew dinner at a Glyfada taverna and souvenir-stop on Faliro promenade.',
      thingsToDo: [
        'Optional swim at Moni Island (uninhabited)',
        'Refuel and clean the boat at Alimos',
        'Crew dinner at a Glyfada taverna',
        'Souvenir-stop on Faliro promenade',
      ],
      mooringTip:
        'Alimos Marina stern-to with lazy lines, €70-100/night. Refuel at the entrance fuel berth before mooring. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alimos.webp', alt: 'Athens' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/saronic/map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1293,
      height: 1173,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/saronic/mobile-map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 780,
      height: 1090,
    },
  },
};

export default computeItineraryNumberOfDays(athensSaronicGulfRoute);
