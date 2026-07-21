import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const athensSaronicGulfPorosRoute: ItineraryRoute = {
  metaTitle: 'Athens – Saronic Gulf to Poros Yacht Charter Route | Greece Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Athens through the Saronic — Aegina, Poros, Ermioni, Methana, Palaia Epidavros and Agistri. Mainland-side Saronic loop with archaeological focus.',
  id: 'athens-saronic-gulf-poros',
  startingPoint: 'Athens',
  otherPoints: ['Saronic gulf', 'Poros'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/athens-saronic-gulf-poros.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/agistri-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/spetses-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/aegina-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/poros-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'athens-aegina',
      routeFrom: 'Athens (Alimos)',
      routeTo: 'Aegina',
      day: 1,
      mapPin: {
        desktop: { left: 53.1, top: 5.6 },
        mobile: { left: 49.3, top: 16.8 },
      },
      description:
        '15 nm shake-down hop southwest from Alimos to Aegina. The Saronic is sheltered cruising — wind rarely above 18 knots in summer. Aegina town harbour is on the west coast; stern-to quay, €25-40/night. Temple of Aphaia (5th-century BC, predates the Parthenon) is the headline shore activity.',
      shortDescription:
        '15 nm shake-down SW to Aegina. Sheltered Saronic cruising. Town quay overnight; Temple of Aphaia is the headline shore activity. Perdika south coast is the quieter alternative. Plan to buy roasted pistachios at the harbour stalls and swim Marathonas Beach (south of town).',
      thingsToDo: [
        'Taxi to the Temple of Aphaia (5th-c BC)',
        'Buy roasted pistachios at the harbour stalls',
        'Swim Marathonas Beach (south of town)',
        'Revithokeftedes chickpea fritters at a quay taverna',
      ],
      mooringTip:
        'Aegina town quay stern-to, €25-40/night, sheltered from N. Perdika south coast is the quieter alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/aegina.webp', alt: 'Aegina' }],
    },
    {
      id: 'aegina-poros',
      routeFrom: 'Aegina',
      routeTo: 'Poros',
      day: 2,
      mapPin: {
        desktop: { left: 43.8, top: 19.4 },
        mobile: { left: 39.8, top: 24.3 },
      },
      description:
        '14 nm southwest to Poros. Pine-clad island separated from the Peloponnese mainland by a 200-m channel. Stern-to on the long town quay, €25-40/night. Day-anchor at Love Bay on the south coast for swim before mooring. Sheltered from any direction. Plan to anchor swim at Love Bay (south coast) and walk to the Temple of Poseidon ruins.',
      shortDescription:
        '14 nm SW to Poros. Pine-clad island separated from mainland by 200 m channel. Long town quay for stern-to overnight; day-anchor at Love Bay before mooring.',
      thingsToDo: [
        'Anchor swim at Love Bay (south coast)',
        'Walk to the Temple of Poseidon ruins',
        'Saganaki cheese flambéed at the waterfront',
        'Cycle the lemon-grove loop',
      ],
      mooringTip:
        'Stern-to in Poros town quay, €25-40/night. Sheltered from any direction. Love Bay day-anchor on sand at 5-7 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/poros.webp', alt: 'Poros' }],
    },
    {
      id: 'poros-ermioni',
      routeFrom: 'Poros',
      routeTo: 'Ermioni',
      day: 3,
      mapPin: {
        desktop: { left: 43.9, top: 36 },
        mobile: { left: 39, top: 34.5 },
      },
      description:
        '10 nm south to Ermioni — small fishing port on the Peloponnese mainland, the quietest stop on the loop. Two harbours either side of the headland: north for the smaller anchorage, south for the longer town quay. Day-anchor at Bisti Beach (3 nm west) for swim before mooring. The 4th-century BC Temple of Demeter is a 30-minute hike above the village.',
      shortDescription:
        '10 nm south to Ermioni — quietest stop on the loop, fishing port on the mainland. Two harbours either side of the headland; day-anchor at Bisti Beach before mooring.',
      thingsToDo: [
        'Hike to the Temple of Demeter (30 min)',
        'Anchor swim at Bisti Beach (boat-only)',
        'Octopus drying on ropes at the fish quay',
        'Stifado beef stew at a courtyard taverna',
      ],
      mooringTip:
        'Stern-to in Ermioni town quay (south side), €15-25/night. North side anchorage on sand at 4-6 m. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ermioni.webp', alt: 'Ermioni' }],
    },
    {
      id: 'ermioni-methana',
      routeFrom: 'Ermioni',
      routeTo: 'Methana',
      day: 4,
      mapPin: {
        desktop: { left: 89.9, top: 44.2 },
        mobile: { left: 82.9, top: 39.9 },
      },
      description:
        '15 nm north to Methana — volcanic peninsula on the Peloponnese mainland, sulphur thermal springs in the harbour itself. Mooring at Methana port stern-to, around €20-30/night. The lunar volcanic landscape is a 1-hour hike from the village; thermal-spring soak is the standard end-of-day routine.',
      shortDescription:
        '15 nm north to Methana volcanic peninsula. Sulphur thermal springs flow into the harbour itself. Stern-to at Methana port; lunar volcano hike in the late afternoon.',
      thingsToDo: [
        'Soak in the harbour thermal springs',
        'Hike to the volcano lunar terrain',
        'Swim Vathy Bay (north of port)',
        'Local rosé and grilled fish at the quay',
      ],
      mooringTip:
        'Methana port stern-to, €20-30/night, sheltered from N. Sulphur smell is real but localised to the spring outflow — moor on the far side of the harbour.',
      gallery: [{ src: '/images/itinerary/greece/destinations/methana.webp', alt: 'Methana' }],
    },
    {
      id: 'methana-palaia-epidavros',
      routeFrom: 'Methana',
      routeTo: 'Palaia Epidavros',
      day: 5,
      mapPin: {
        desktop: { left: 85.2, top: 28.1 },
        mobile: { left: 78.6, top: 29.3 },
      },
      description:
        '8 nm north to Palaia Epidavros — small Peloponnese mainland port, 4 km below the famous 4th-century BC Epidavros theatre (UNESCO). Day-anchor at the Sunken City (Roman ruins under 2-3 m water, snorkel-accessible) before mooring. Stern-to on the town quay, €15-25/night.',
      shortDescription:
        '8 nm north to Palaia Epidavros. Underwater Roman Sunken City for snorkel; the famous 4th-c BC Epidavros theatre (UNESCO) is 4 km inland by taxi.',
      thingsToDo: [
        'Snorkel the underwater Sunken City',
        'Taxi to the 4th-c BC Epidavros theatre',
        'Lunch on ladenia tomato flatbread',
        'Paddleboard at sunset off the quay',
      ],
      mooringTip:
        'Stern-to in Palaia Epidavros town quay, €15-25/night, sheltered from N. Sunken City for day-anchor (no overnight) on sand at 3-5 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/palaia.webp', alt: 'Palaia' }],
    },
    {
      id: 'palaia-epidavros-agistri',
      routeFrom: 'Palaia Epidavros',
      routeTo: 'Agistri',
      day: 6,
      mapPin: {
        desktop: { left: 70.9, top: 25.6 },
        mobile: { left: 62.7, top: 27.7 },
      },
      description:
        '15 nm east-southeast to Agistri — small pine-fringed island 5 nm west of Aegina, the quietest island stop in the Saronic. Skala harbour on the east coast is the standard overnight; family tavernas on the quay. Day-anchor at Halikiada Beach (south coast, sand 4-6 m) for swim before mooring.',
      shortDescription:
        '15 nm ESE to Agistri — quietest Saronic island. Skala harbour for overnight. Day-anchor at Halikiada Beach south coast for swim. Stern-to in Skala harbour, €20-30/night, sheltered from N. Plan to kayak to Dragonera caves and cycle the cypress-grove island loop.',
      thingsToDo: [
        'Anchor swim at Halikiada Beach',
        'Kayak to Dragonera caves',
        'Cycle the cypress-grove island loop',
        'Lobster spaghetti at a Skala family taverna',
      ],
      mooringTip: 'Stern-to in Skala harbour, €20-30/night, sheltered from N. Halikiada day-anchor on sand at 4-6 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/agistri.webp', alt: 'Agistri' }],
    },
    {
      id: 'agistri-athens',
      routeFrom: 'Agistri',
      routeTo: 'Athens (Alimos)',
      day: 7,
      description:
        '20 nm northeast back to Alimos. Optional swim stop at Moni Island (off Aegina). Refuel at Alimos before tying up. Standard 14:00 marina arrival for a relaxed handover-prep afternoon. Confirm handover slot 24h ahead. Plan to crew dinner at a Glyfada taverna and souvenir-stop on Faliro promenade.',
      shortDescription:
        '20 nm NE back to Alimos. Optional Moni Island swim stop. Standard 14:00 marina arrival. Refuel before mooring. Confirm handover slot 24h ahead. Plan to crew dinner at a Glyfada taverna and souvenir-stop on Faliro promenade.',
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

export default computeItineraryNumberOfDays(athensSaronicGulfPorosRoute);
