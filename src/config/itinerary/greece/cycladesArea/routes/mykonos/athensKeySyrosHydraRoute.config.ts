import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const athensKeySyrosHydraRoute: ItineraryRoute = {
  metaTitle: '7-Day Athens–Kea–Syros–Hydra Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Athens via Cape Sounion, Kea, Syros, Serifos, Hydra and Poros — a hybrid Cyclades + Saronic loop with the most varied wind regimes of the route map.',
  id: 'athens-key-syros-hydra',
  startingPoint: 'Athens',
  otherPoints: ['Kea', 'Syros', 'Hydra'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/athens-kea-syros-hydra.webp',
    alt: 'athens-key-syros-hydra',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/hydra-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/serifos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/poros-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/sounion-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'athens-cape',
      routeFrom: 'Athens (Alimos)',
      routeTo: 'Cape Sounion',
      day: 1,
      mapPin: {
        desktop: { left: 12.2, top: 11.2 },
        mobile: { left: 17.9, top: 12.4 },
      },
      description:
        '15 nm shake-down hop east-southeast along the Attica coast. Anchor 0.5 nm offshore from the Temple of Poseidon at Cape Sounion on sand at 5-8 m, sheltered from N. The temple is the marker for crews running south to the Cyclades; floodlit at night for the post-sunset photograph. No marina at Sounion — anchor only, viable when wind stays below 18 kn from N.',
      shortDescription:
        '15 nm shake-down ESE to Cape Sounion. Anchor 0.5 nm offshore from the Poseidon temple, no marina here. Sheltered from N below 18 kn — switch to Lavrion if wind builds.',
      thingsToDo: [
        'Sunset under Poseidon temple columns',
        'Snorkel the rocky platforms east of the temple',
        'Grilled sea bass at a Sounion taverna ashore',
        'Photograph the floodlit temple at night',
      ],
      mooringTip:
        'Free anchoring on sand at 5-8 m, 0.5 nm offshore from the temple. Sheltered from N below 18 kn. Switch to Lavrion Olympic Marina (€60-90/night) if wind builds.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sounion.webp', alt: 'Cape Sounion' }],
    },
    {
      id: 'cape-kea',
      routeFrom: 'Cape Sounion',
      routeTo: 'Kea (Vourkari)',
      day: 2,
      mapPin: {
        desktop: { left: 24.9, top: 32.9 },
        mobile: { left: 37.3, top: 32.8 },
      },
      description:
        '20 nm east-southeast across to Kea. Comfortable downwind run in standard Meltemi. Vourkari Bay on the northwest of Kea is the better-protected overnight (stern-to lazy lines, €25-35/night); Korissia is the larger free quay alternative. Plan to be moored before 16:00. The Stone Lion of Kea (6th-century BC) is a 30-minute walk above Ioulida — the climb is the single best half-day shore activity on the island.',
      shortDescription:
        '20 nm ESE to Kea — downwind run in standard Meltemi. Vourkari Bay sheltered for overnight; Korissia free quay alternative below 18 kn. Stone Lion of Kea is the headline.',
      thingsToDo: [
        'Walk to the 6th-century BC Stone Lion of Kea',
        'Snorkel the Patris steamship wreck off Koundouros',
        'Octopus carpaccio at a Vourkari ouzeri',
        'Walk Ioulida marble alleys at dusk',
      ],
      mooringTip:
        'Stern-to in Vourkari with lazy lines, €25-35/night. Korissia town quay free but exposed in N Meltemi above 18 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-syros',
      routeFrom: 'Kea',
      routeTo: 'Syros (Ermoupoli or Finikas)',
      day: 3,
      mapPin: {
        desktop: { left: 40.5, top: 32.9 },
        mobile: { left: 58.8, top: 32.2 },
      },
      description:
        '32 nm east-southeast to Syros. Beam reach in standard Meltemi, fast passage. Ermoupoli town quay at the head of the deep harbour is one of the most forgiving stern-to in the entire Cyclades. Finikas Bay on the southwest coast is the alternative for a sheltered swim anchorage — sand bottom, lined with tamarisk trees ashore. The capital climbs the slope above in pastel neoclassical layers.',
      shortDescription:
        '32 nm fast beam reach east-southeast to Syros. Ermoupoli town quay is the most forgiving stern-to in the Cyclades. Finikas Bay south coast for sheltered swim alternative.',
      thingsToDo: [
        'Climb Ano Syros for the Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim at Foinikas Bay (south coast)',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any direction. Finikas anchor on sand at 4-7 m, sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-serifos',
      routeFrom: 'Syros',
      routeTo: 'Serifos (Livadi)',
      day: 4,
      mapPin: {
        desktop: { left: 66.8, top: 52.7 },
        mobile: { left: 95.9, top: 51.1 },
      },
      description:
        '32 nm southwest to Serifos — long downwind leg, comfortable in standard Meltemi. Livadi Bay on the south coast funnels the Meltemi but holds well on sand. Drag is the most common Serifos charter incident — set anchor with long scope, dive to verify, stay aboard for the first hour. Chora above the harbour is one of the most photogenic Cycladic villages and a 30-minute donkey-path climb.',
      shortDescription:
        '32 nm long downwind SW to Serifos. Livadi Bay funnels the Meltemi — set anchor with long scope and dive to verify. Chora is a donkey-path climb above the harbour.',
      thingsToDo: [
        'Walk the donkey path up to Chora',
        'Revithada chickpea stew in a kafeneio',
        'Swim Psili Ammos beach (south coast)',
        'Sunset at the windmills above Chora',
      ],
      mooringTip:
        'Anchor in Livadi Bay on sand at 5-8 m, long scope mandatory. Stern-to on town quay, €20-30/night. Drag risk above 22 kn — dive the anchor before going ashore.',
      gallery: [{ src: '/images/itinerary/greece/destinations/serifos.webp', alt: 'Serifos' }],
    },
    {
      id: 'serifos-hydra',
      routeFrom: 'Serifos',
      routeTo: 'Hydra',
      day: 5,
      mapPin: {
        desktop: { left: 48.6, top: 74.9 },
        mobile: { left: 69.1, top: 72.5 },
      },
      description:
        '38 nm long beam reach west to Hydra. The leg crosses out of the Cyclades into the Saronic — wind regime drops by 5-8 knots once west of Kythnos. Hydra harbour is small and stern-to slot competition is fierce; arrive by 15:00 or anchor in Mandraki Bay 1 nm east of the town and tender in. No cars on Hydra; donkeys carry the luggage from the harbour up to the village houses on the cliff.',
      shortDescription:
        '38 nm long beam reach west to Hydra. Cyclades wind regime drops once west of Kythnos. Arrive Hydra by 15:00 or anchor in Mandraki Bay east of town.',
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
      id: 'hydra-poros',
      routeFrom: 'Hydra',
      routeTo: 'Poros',
      day: 6,
      mapPin: {
        desktop: { left: 5.5, top: 59.2 },
        mobile: { left: 9.1, top: 56.8 },
      },
      description:
        '15 nm northwest to Poros. The Poros channel between the island and the Peloponnese mainland is one of the prettier passages in the Saronic — pine-clad slopes either side, sheltered water. Anchor in Russian Bay (north coast, sand 5-7 m, sheltered from N) for the afternoon, then move to Poros town quay for the overnight. Poros town is the lay-day stop on most Saronic loops.',
      shortDescription:
        '15 nm northwest to Poros. Poros channel between island and mainland is one of the prettier sheltered passages in the Saronic. Russian Bay swim, town quay overnight.',
      thingsToDo: [
        'Anchor swim at Russian Bay (north coast)',
        'Swim Love Bay (south coast pine fringe)',
        'Walk to the Temple of Poseidon ruins',
        'Saganaki cheese flambéed at the waterfront',
      ],
      mooringTip:
        'Stern-to in Poros town quay, €25-40/night. Sheltered from any direction. Russian Bay for day-anchor on sand at 5-7 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/poros.webp', alt: 'Poros' }],
    },
    {
      id: 'poros-athens',
      routeFrom: 'Poros',
      routeTo: 'Athens (Alimos)',
      day: 7,
      mapPin: {
        desktop: { left: 2.8, top: 48.6 },
        mobile: { left: 4, top: 46.9 },
      },
      description:
        '30 nm north back to Alimos. Standard Saronic mid-morning departure for a 14:00 marina arrival. Optional swim stop at Aegina (10 nm into the leg) if time and wind allow. Refuel at Alimos before tying up so the boat is ready for handover the next morning.',
      shortDescription:
        '30 nm north back to Alimos. Standard mid-morning departure for 14:00 arrival. Optional Aegina swim stop on the way. Refuel before mooring. Alimos Marina stern-to with lazy lines, €70-100/night. Plan to crew dinner at a Glyfada taverna and souvenir-stop on Faliro promenade.',
      thingsToDo: [
        'Optional Aegina swim stop',
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
        src: '/images/itinerary/greece/cyclades-itinerary/mykonos/map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1530,
      height: 1043,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/mykonos/athens-kea-syros-hydra/mobile-map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1062,
      height: 1043,
    },
  },
};

export default computeItineraryNumberOfDays(athensKeySyrosHydraRoute);
