import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const salernoSouthRoute: ItineraryRoute = {
  metaTitle: 'Salerno–Cilento South Yacht Charter | Italy Sailing Routes',
  metaDesc:
    'Sail a 7-day yacht charter from Salerno south to Cetara, Agropoli, Acciaroli, Casalvelino, Palinuro and Camerota — Cilento national park loop, quietest Tyrrhenian cruising.',
  id: 'salerno-south',
  startingPoint: 'Salerno',
  otherPoints: ['South'],
  cardImage: { src: '/images/itinerary/italy/amalfi-itinerary/routes/salerno-south.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/salerno-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/castellabate-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/san-marco-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/acciaroli-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'salerno-cetara',
      routeFrom: 'Salerno',
      routeTo: 'Cetara',
      day: 1,
      mapPin: {
        desktop: { left: 56.1, top: 27.7 },
        mobile: { left: 59.6, top: 37.9 },
      },
      description:
        "8 nm shake-down west from Marina d'Arechi to Cetara — small Amalfi fishing port, the colatura di alici (anchovy garum) capital, family workshops along the harbour. Quick first day allows full afternoon for tasting and shore activity. Plan to tour a colatura di alici workshop, spaghetti with colatura at a quay trattoria, walk to the lesser-known Path of the Gods east section.",
      shortDescription:
        "8 nm shake-down W from Marina d'Arechi to Cetara. Colatura di alici (Roman fish sauce) capital. Family workshops on the harbour. Highlights: Tour a colatura di alici workshop and Spaghetti with colatura at a quay trattoria.",
      thingsToDo: [
        'Tour a colatura di alici workshop',
        'Spaghetti with colatura at a quay trattoria',
        'Walk to the lesser-known Path of the Gods east section',
        'Limoncello on a fairy-light terrace',
      ],
      mooringTip:
        "Cetara small port stern-to, €40-60/night, sheltered from N. Marina d'Arechi 8 nm east is the larger alternative for full services.",
      gallery: [{ src: '/images/itinerary/italy/destinations/cetara.webp', alt: 'Cetara' }],
    },
    {
      id: 'cetara-agropoli',
      routeFrom: 'Cetara',
      routeTo: 'Agropoli',
      day: 2,
      mapPin: {
        desktop: { left: 51.8, top: 29.9 },
        mobile: { left: 51.2, top: 38 },
      },
      description:
        '20 nm south to Agropoli — gateway to the Cilento national park. Aragonese castle on the headland above the village. Trentova Bay 1 nm north for marine reserve anchorage; the Greek temples of Paestum (UNESCO, 6th-c BC) are 8 km inland by taxi from the marina.',
      shortDescription:
        '20 nm south to Agropoli — Cilento national park gateway. Trentova Bay marine reserve 1 nm north. Paestum 6th-c BC Greek temples 8 km inland.',
      thingsToDo: [
        'Taxi to the 6th-c BC Paestum Greek temples',
        'Snorkel Trentova Bay marine reserve',
        'Walk up to the Aragonese castle',
        'Mozzarella di bufala straight from a Cilento farm',
      ],
      mooringTip:
        'Marina di Agropoli stern-to, €40-70/night, sheltered from N. Anchor in Trentova Bay on sand at 4-6 m for marine reserve swim.',
      gallery: [{ src: '/images/itinerary/italy/destinations/agropoli.webp', alt: 'Agropoli' }],
    },
    {
      id: 'agropoli-acciaroli',
      routeFrom: 'Agropoli',
      routeTo: 'Acciaroli',
      day: 3,
      mapPin: {
        desktop: { left: 69.4, top: 54.1 },
        mobile: { left: 69.4, top: 54.1 },
      },
      description:
        '15 nm south to Acciaroli — small fishing port in the Cilento national park, Hemingway 1952 summer base. Pioppi 3 nm south is the village where the Mediterranean Diet was first scientifically defined by American physiologist Ancel Keys. Stern-to in Acciaroli harbour, €30-50/night, sheltered from N. Pioppi anchor on sand at 4-6 m for swim alternative. Plan to anchor swim at Sirenuse rock spires, walk Hemingway plaque waterfront, alici arraganate (oregano-baked anchovies) at a quay trattoria.',
      shortDescription:
        '15 nm south to Acciaroli — Cilento fishing port, Hemingway 1952. Pioppi 3 nm south is the Mediterranean Diet birthplace. Stern-to in Acciaroli harbour, €30-50/night, sheltered from N; Pioppi anchor on sand at 4-6 m for swim alternative.',
      thingsToDo: [
        'Anchor swim at Sirenuse rock spires',
        'Walk Hemingway plaque waterfront',
        'Alici arraganate (oregano-baked anchovies) at a quay trattoria',
        'Cycle Pioppi Mediterranean Diet trail',
      ],
      mooringTip:
        'Stern-to in Acciaroli harbour, €30-50/night, sheltered from N. Pioppi anchor on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/acciaroli.webp', alt: 'Acciaroli' }],
    },
    {
      id: 'acciaroli-marina-di-casalvelino',
      routeFrom: 'Acciaroli',
      routeTo: 'Marina di Casalvelino',
      day: 4,
      mapPin: {
        desktop: { left: 70.4, top: 70.7 },
        mobile: { left: 70.4, top: 70.7 },
      },
      description:
        '8 nm south to Marina di Casalvelino — small marina at the foot of the Velia archaeological site. Velia (ancient Elea, 6th-c BC Greek colony, Parmenides + Zeno school of philosophy) is 3 km inland. Pine-forest beach at Ascea, sand bottom 4-6 m, sheltered from N.',
      shortDescription:
        '8 nm south to Marina di Casalvelino. Velia (ancient Elea, Parmenides school) 3 km inland. Pine-forest beach at Ascea, sheltered from N. Anchor at Ascea on sand at 4-6 m for swim alternative. Plan to walk the Velia 6th-c BC archaeological site and hand-rolled fusilli with wild boar ragù at a contadino farm.',
      thingsToDo: [
        'Walk the Velia 6th-c BC archaeological site',
        'Anchor swim at Ascea pine-forest beach',
        'Hand-rolled fusilli with wild boar ragù at a contadino farm',
        'Hike the Cilento national park ridge trail',
      ],
      mooringTip:
        'Stern-to in Marina di Casalvelino, €40-60/night, sheltered from N. Anchor at Ascea on sand at 4-6 m for swim alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/casalvelino.webp', alt: 'Marina di Casalvelino' }],
    },
    {
      id: 'marina-di-casalvelino-palinuro',
      routeFrom: 'Marina di Casalvelino',
      routeTo: 'Palinuro',
      day: 5,
      mapPin: {
        desktop: { left: 76.8, top: 74.2 },
        mobile: { left: 76.8, top: 74.2 },
      },
      description:
        "15 nm south to Palinuro — Cilento national park's headline destination, Capo Palinuro headland with the Blue Grotto sea cave (sunlight refracted through underwater opening, accessible by tender). Arco Naturale stone arch on the south side of the cape. Marina di Palinuro on the east coast for overnight.",
      shortDescription:
        '15 nm south to Palinuro — Cilento headland. Blue Grotto sea cave (tender access) + Arco Naturale stone arch. Marina di Palinuro east coast overnight.',
      thingsToDo: [
        'Tender into the Blue Grotto sea cave',
        'Snorkel the Arco Naturale stone arch',
        "Pezzogna all'acqua pazza at Da Nonna",
        'Hike Capo Palinuro lighthouse trail',
      ],
      mooringTip:
        'Marina di Palinuro stern-to, €50-80/night, sheltered from N. Anchor in Cala del Buon Dormire (south side) for swim alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/palinuro.webp', alt: 'Palinuro' }],
    },
    {
      id: 'palinuro-marina-di-camerota',
      routeFrom: 'Palinuro',
      routeTo: 'Marina di Camerota',
      day: 6,
      mapPin: {
        desktop: { left: 84.9, top: 86.4 },
        mobile: { left: 89.2, top: 82.1 },
      },
      description:
        "8 nm south to Marina di Camerota — entrance to the Infreschi marine reserve, the protected wildest stretch of the Cilento coast. Cala degli Infreschi (boat-only, juniper-lined turquoise water) is the headline anchorage. Sentiero degli Innamorati (Lovers' Path) above the bay.",
      shortDescription:
        '8 nm south to Marina di Camerota. Infreschi marine reserve entrance. Cala degli Infreschi (boat-only) is the headline anchorage. Sentiero degli Innamorati cliff path. Highlights: Anchor swim at Cala degli Infreschi and Walk the Sentiero degli Innamorati cliff path.',
      thingsToDo: [
        'Anchor swim at Cala degli Infreschi',
        'Walk the Sentiero degli Innamorati cliff path',
        'Sea-urchin ricci on the dock with Fiano wine',
        'Hike to the Marciotto cave network',
      ],
      mooringTip:
        'Marina di Camerota stern-to, €40-60/night, sheltered from N. Cala degli Infreschi day-anchor on sand at 4-6 m, no overnight.',
      gallery: [{ src: '/images/itinerary/italy/destinations/camerota.webp', alt: 'Marina di Camerota' }],
    },
    {
      id: 'marina-di-camerota-san-marco-salerno',
      routeFrom: 'Marina di Camerota',
      routeTo: 'Salerno',
      day: 7,
      mapPin: {
        desktop: { left: 89.9, top: 91.8 },
        mobile: { left: 95.9, top: 84.8 },
      },
      description:
        "38 nm long north back to Salerno. Optional swim stop at San Marco di Castellabate (16th-c watchtower, sand beach). Marina d'Arechi for the final handover-prep evening. Refuel at the entrance fuel berth before tying up. Plan to swim at the San Marco beach below the watchtower, refuel and clean at Marina d'Arechi, and finish with sunset on the Lungomare Trieste before the morning hand-back inventory.",
      shortDescription:
        "38 nm long N back to Salerno via San Marco di Castellabate optional swim stop (16th-c watchtower above the sand). Marina d'Arechi for handover-prep — refuel at the entrance fuel berth before mooring, full services on the marina pontoon. Plan to swim at San Marco and walk the Salerno Lungomare at sunset.",
      thingsToDo: [
        'Swim stop at San Marco di Castellabate',
        "Refuel and clean the boat at Marina d'Arechi",
        'Sunset on the Lungomare Trieste',
        'Sfogliatella pastries at a Salerno seafront café',
      ],
      mooringTip:
        "Marina d'Arechi stern-to, €100-160/night peak, full services. Refuel at the entrance fuel berth before mooring.",
      gallery: [{ src: '/images/itinerary/italy/banners/san-marco-banner.webp', alt: 'San Marco' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/map.webp',
        alt: 'Salerno south Route Image',
      },
      width: 1588,
      height: 1230,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/mobile-map.webp',
        alt: 'Salerno south Route Image',
      },
      width: 1252,
      height: 1300,
    },
  },
};

export default computeItineraryNumberOfDays(salernoSouthRoute);
