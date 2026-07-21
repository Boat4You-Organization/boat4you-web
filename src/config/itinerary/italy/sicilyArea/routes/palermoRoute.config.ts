import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const palermoRoute: ItineraryRoute = {
  metaTitle: 'Palermo Yacht Charter Route | Western Sicily + Egadi Islands Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Palermo via San Vito Lo Capo, Favignana, Marettimo and Levanzo — Egadi marine reserve loop with Tyrrhenian + western Sicily access.',
  id: 'palermo',
  startingPoint: 'Palermo',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/sicily-itinerary/routes/palermo.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/lipari-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/stromboli-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/panarea-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/saura-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'palermo-san-vito-lo-capo',
      routeFrom: 'Palermo',
      routeTo: 'San Vito Lo Capo',
      day: 1,
      mapPin: {
        desktop: { left: 40.1, top: 73.7 },
        mobile: { left: 40.1, top: 73.7 },
      },
      description:
        '32 nm shake-down west from Marina di Palermo to San Vito Lo Capo. Pass the cliffs of the Zingaro nature reserve (no anchorage in the reserve, 7 km of protected coastline). San Vito harbour stern-to is the standard charter overnight; the white-sand crescent beach of San Vito is one of the few sand beaches in northwest Sicily.',
      shortDescription:
        '32 nm shake-down W from Palermo to San Vito Lo Capo. Pass Zingaro nature reserve cliffs (no anchorage). White-sand crescent beach is the rare NW Sicily sand.',
      thingsToDo: [
        'Swim San Vito white-sand crescent beach',
        'Hike Zingaro nature reserve coastal path',
        'Couscous alla trapanese at a quay trattoria',
        'Sunset behind Monte Monaco viewpoint',
      ],
      mooringTip:
        'San Vito harbour stern-to, €60-100/night, sheltered from N. Anchor in the bay outside on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/san-vito-capo.webp', alt: 'San Vito Lo Capo' }],
    },
    {
      id: 'san-vito-favignana',
      routeFrom: 'San Vito',
      routeTo: 'Favignana',
      day: 2,
      mapPin: {
        desktop: { left: 23, top: 68.1 },
        mobile: { left: 23, top: 68.1 },
      },
      description:
        '20 nm southwest to Favignana — butterfly-shaped largest of the Egadi islands. Cala Rossa on the east coast (red-tinged limestone, blood-hued bay where the ancient Roman naval battle of 241 BC took place) is the headline anchorage. Tonnara di Favignana — the abandoned tuna-processing factory — is the village landmark.',
      shortDescription:
        '20 nm SW to Favignana — butterfly-shaped largest Egadi. Cala Rossa E coast (Roman naval battle 241 BC site) is headline anchorage. Tonnara abandoned tuna factory landmark.',
      thingsToDo: [
        'Anchor swim at Cala Rossa (Roman naval battle site)',
        'Walk through the abandoned Tonnara tuna factory',
        'Visit Bue Marino abandoned tuff quarry beach',
        'Pesto-tossed busiate pasta at Trattoria del Marinaio',
      ],
      mooringTip:
        'Favignana port stern-to, €60-100/night, sheltered from N. Cala Rossa anchor on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/favignana.webp', alt: 'Favignana' }],
    },
    {
      id: 'favignana-marettimo',
      routeFrom: 'Favignana',
      routeTo: 'Marettimo',
      day: 3,
      mapPin: {
        desktop: { left: 10.2, top: 88.6 },
        mobile: { left: 10.2, top: 88.6 },
      },
      description:
        '15 nm west to Marettimo — wildest Egadi sibling, 700 residents, no road network outside the village, donkeys carry the goods. Cala Bianca on the south coast is the headline limestone-cliff swim. Norman 12th-century Punta Troia castle on the north end of the island.',
      shortDescription:
        '15 nm W to Marettimo — wildest Egadi, 700 residents, no roads outside village. Cala Bianca limestone swim. 12th-c Norman Punta Troia castle N end.',
      thingsToDo: [
        'Anchor swim at Cala Bianca limestone cliffs',
        'Hike donkey paths to the 12th-c Punta Troia castle',
        'Snorkel the Grotta del Cammello underwater cathedral',
        'Pesce alla stemperata sweet-and-sour fish at Da Enzo',
      ],
      mooringTip:
        'Marettimo port stern-to, €40-60/night, sheltered from N. Cala Bianca anchor on sand at 5-7 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/marettimo.webp', alt: 'Marettimo' }],
    },
    {
      id: 'marettimo-levanzo',
      routeFrom: 'Marettimo',
      routeTo: 'Levanzo',
      day: 4,
      mapPin: {
        desktop: { left: 9.5, top: 81.4 },
        mobile: { left: 9.5, top: 81.4 },
      },
      description:
        '12 nm east to Levanzo — smallest of the three populated Egadi, 200 residents. Grotta del Genovese on the north coast is the headline shore activity — Neolithic cave paintings + Ice Age deer engravings, accessible by guided tour from the village. Cala Fredda on the east coast for swim.',
      shortDescription:
        '12 nm E to Levanzo — smallest Egadi, 200 residents. Grotta del Genovese Neolithic cave paintings + Ice Age deer engravings (guided tour from village).',
      thingsToDo: [
        'Guided tour of Grotta del Genovese cave paintings',
        'Anchor swim at Cala Fredda (pebble + lapping waves)',
        "Sea-urchin ricci with Nero d'Avola at a waterfront shanty",
        'Walk the village to Cala Tramontana north shore',
      ],
      mooringTip:
        'Levanzo port stern-to, €30-50/night, limited slots. Anchor in Cala Fredda on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/levanzo.webp', alt: 'Levanzo' }],
    },
    {
      id: 'levanzo-san-vito-lo-capo',
      routeFrom: 'Levanzo',
      routeTo: 'San Vito Lo Capo',
      day: 5,
      mapPin: {
        desktop: { left: 2.1, top: 84.6 },
        mobile: { left: 2.1, top: 84.6 },
      },
      description:
        '20 nm northeast back to San Vito Lo Capo. Optional swim stop at Cala Mancina on the Zingaro reserve south side (no anchorage inside reserve, swim from outside). Hike to Santuario di Santa Crocifissa di Custonaci for the cliff-edge sunset.',
      shortDescription:
        '20 nm NE back to San Vito. Optional Cala Mancina swim outside Zingaro reserve. Sanctuary cliff-edge sunset. San Vito harbour stern-to, €60-100/night, sheltered from N. Plan to hike to Santuario di Santa Crocifissa cliff edge and almond granita at Bar Monte Monaco.',
      thingsToDo: [
        'Swim Cala Mancina outside Zingaro reserve',
        'Hike to Santuario di Santa Crocifissa cliff edge',
        'Almond granita at Bar Monte Monaco',
        'Walk the white-sand San Vito beach again',
      ],
      mooringTip:
        'San Vito harbour stern-to, €60-100/night, sheltered from N. Repeat overnight from the start of the route.',
      gallery: [{ src: '/images/itinerary/italy/destinations/san-vito-capo.webp', alt: 'San Vito Lo Capo' }],
    },
    {
      id: 'san-vito-terrasini',
      routeFrom: 'San Vito',
      routeTo: 'Terrasini',
      day: 6,
      mapPin: {
        desktop: { left: 20.8, top: 68.7 },
        mobile: { left: 20.8, top: 68.7 },
      },
      description:
        '15 nm east to Terrasini — small fishing harbour west of Palermo, Baroque buildings around the central square. Anchor at Cala Rossa di Terrasini for swim, mooring on the town quay. Capo Rama nature reserve 1 nm west for snorkel.',
      shortDescription:
        '15 nm E to Terrasini — small fishing harbour W of Palermo. Cala Rossa swim. Capo Rama nature reserve 1 nm W for snorkel. Terrasini town quay stern-to, €40-60/night, sheltered from N. Plan to buy blood oranges at Mercato del Pesce and pasta con le sarde at La Cambusa.',
      thingsToDo: [
        'Anchor swim at Cala Rossa di Terrasini',
        'Snorkel Capo Rama nature reserve sea caves',
        'Buy blood oranges at Mercato del Pesce',
        'Pasta con le sarde at La Cambusa',
      ],
      mooringTip:
        'Terrasini town quay stern-to, €40-60/night, sheltered from N. Anchor in Cala Rossa on sand at 4-6 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/terrasini.webp', alt: 'Terrasini' }],
    },
    {
      id: 'terrasini-palermo',
      routeFrom: 'Terrasini',
      routeTo: 'Palermo',
      day: 7,
      mapPin: {
        desktop: { left: 29.7, top: 76.4 },
        mobile: { left: 29.7, top: 76.4 },
      },
      description:
        '15 nm east back to Palermo. Optional swim stop at Capo Gallo nature reserve + Isola delle Femmine on the way. Marina Cala (or Marina di Villa Igiea) inside Palermo bay for the final overnight. Refuel before tying up. Marina Cala stern-to, €100-160/night peak. Plan to walk Vucciria Market chaos at sunset and uNESCO Palatine Chapel mosaics tour.',
      shortDescription:
        '15 nm E back to Palermo. Optional Capo Gallo + Isola delle Femmine swim stop. Marina Cala (or Villa Igiea) inside Palermo bay. Refuel before mooring.',
      thingsToDo: [
        'Optional Capo Gallo swim stop',
        'Walk Vucciria Market chaos at sunset',
        'UNESCO Palatine Chapel mosaics tour',
        'Panino con panelle (chickpea fritter sandwich)',
      ],
      mooringTip:
        'Marina Cala stern-to, €100-160/night peak. Marina di Villa Igiea is the alternative for premium service. Refuel at the entrance fuel berth.',
      gallery: [{ src: '/images/itinerary/italy/destinations/palermo.webp', alt: 'Palermo' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/map.webp',
        alt: 'Palermo Route Image',
      },
      width: 2778,
      height: 1162,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/mobile-map.webp',
        alt: 'Palermo Route Image',
      },
      width: 1814,
      height: 1336,
    },
  },
};

export default computeItineraryNumberOfDays(palermoRoute);
