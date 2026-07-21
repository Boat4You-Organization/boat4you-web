import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const mykanosSirosMilosIos14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Paros–Mykonos–Syros–Milos Yacht Route | Boat4You',
  metaDesc:
    'Sail a 14-day yacht charter round-trip from Paros via Sifnos, Serifos, Kythnos, Syros, Mykonos, Naxos, Ios, Santorini, Folegandros and Milos. Full grand-tour Cyclades.',
  id: 'mykanos-siros-milos-ios-14-days',
  startingPoint: 'Paros',
  otherPoints: ['Siros', 'Milos', 'Ios (14 days)'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/paros-siros-milos-ios-14-days.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/santorini-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/milos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/ios-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/serifos-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'paros-sifnos',
      routeFrom: 'Paros',
      routeTo: 'Sifnos (Kamares Harbor)',
      day: 1,
      mapPin: {
        desktop: { left: 47.8, top: 43.6 },
        mobile: { left: 48.5, top: 42.6 },
      },
      description:
        '20 nm shake-down southwest to Sifnos. Kamares Bay on the west coast is the obvious overnight — sheltered from N and NE but opens W. Mastelo lamb in clay pots at Artemonas inland village is the headline meal. Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night). Switch to Vathi when wind clocks west. Plan to walk to cliffside Chrysopigi monastery at Faros, mastelo lamb in clay pots at Artemonas, pottery workshop visit in Vathy.',
      shortDescription:
        '20 nm shake-down SW to Sifnos. Kamares sheltered from N/NE, opens W. Mastelo lamb at Artemonas; Cyclades gastronomy island. Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night).',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
      ],
      mooringTip:
        'Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night). Switch to Vathi when wind clocks west.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kamares.webp', alt: 'Kamares' }],
    },
    {
      id: 'sifnos-serifos',
      routeFrom: 'Sifnos',
      routeTo: 'Serifos (Livadi)',
      day: 2,
      mapPin: {
        desktop: { left: 26.1, top: 47.5 },
        mobile: { left: 24.4, top: 44.1 },
      },
      description:
        '14 nm short hop north to Serifos. Livadi Bay funnels the Meltemi but holds well on sand. Drag is the most common Serifos charter incident — set anchor with long scope, dive to verify. Chora a 30-min donkey path above.',
      shortDescription:
        '14 nm short hop north to Serifos. Livadi Bay funnels the Meltemi — long scope, dive to verify. Chora donkey-path climb above. Anchor in Livadi Bay on sand at 5-8 m, long scope mandatory. Plan to revithada chickpea stew in a kafeneio and swim Psili Ammos beach (south coast).',
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
      id: 'serifos-kythnos',
      routeFrom: 'Serifos',
      routeTo: 'Kythnos (Loutra)',
      day: 3,
      mapPin: {
        desktop: { left: 16.1, top: 36.8 },
        mobile: { left: 13.2, top: 38.2 },
      },
      description:
        '15 nm north to Kythnos. Loutra harbour has natural thermal springs flowing in at around 38°C. Day-anchor at Kolona double-bay sandbar on the way for a swim — boat-only access, sheltered from N. Stern-to in Loutra harbour, €25-40/night with lazy lines. Sheltered from N. Merichas west coast is the alternative. Plan to soak in Loutra natural thermal springs, anchor swim at the Kolona sandbar, cycle the Chora-Driopida ridge road.',
      shortDescription:
        '15 nm north to Kythnos. Loutra has thermal springs flowing in. Day-anchor at Kolona sandbar on the way north. Stern-to in Loutra harbour, €25-40/night with lazy lines; Sheltered from N; Merichas west coast is the alternative.',
      thingsToDo: [
        'Soak in Loutra natural thermal springs',
        'Anchor swim at the Kolona sandbar',
        'Cycle the Chora-Driopida ridge road',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Stern-to in Loutra harbour, €25-40/night with lazy lines. Sheltered from N. Merichas west coast is the alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-syros',
      routeFrom: 'Kythnos',
      routeTo: 'Syros',
      day: 4,
      mapPin: {
        desktop: { left: 13, top: 21.4 },
        mobile: { left: 9.2, top: 26.5 },
      },
      description:
        '28 nm east-southeast to Syros — beam reach in standard Meltemi. Ermoupoli town quay is one of the most forgiving stern-to in the entire Cyclades. The capital climbs in pastel neoclassical layers. Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any direction. Manna marina €60-80/night if full. Plan to climb Ano Syros for the Catholic quarter, loukoumi tasting at a 19th-century confectionery, walk Miaouli marble square at dusk.',
      shortDescription:
        '28 nm beam reach ESE to Syros. Ermoupoli town quay is the most forgiving stern-to in the Cyclades. Excellent shelter in any direction. Plan to climb Ano Syros for the Catholic quarter and loukoumi tasting at a 19th-century confectionery.',
      thingsToDo: [
        'Climb Ano Syros for the Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim at Foinikas Bay (south coast)',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any direction. Manna marina €60-80/night if full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-mykonos',
      routeFrom: 'Syros',
      routeTo: 'Mykonos (Tourlos Marina)',
      day: 5,
      mapPin: {
        desktop: { left: 34.9, top: 19.8 },
        mobile: { left: 35.3, top: 22.2 },
      },
      description:
        '22 nm east to Mykonos. Optional Delos detour for UNESCO archaeological site (day-anchor, closes sundown). Tourlos New Marina pre-book online 24h ahead in peak. Stern-to in Tourlos New Marina, €70-110/night peak. Plan to day-trip across to ancient Delos and beach lunch at Agios Sostis (no road access).',
      shortDescription:
        '22 nm east to Mykonos. Optional Delos detour. Tourlos New Marina pre-book online 24h ahead in peak. Stern-to in Tourlos New Marina, €70-110/night peak. Plan to day-trip across to ancient Delos and beach lunch at Agios Sostis (no road access).',
      thingsToDo: [
        'Day-trip across to ancient Delos',
        'Beach lunch at Agios Sostis (no road access)',
        'Walk the Little Venice waterfront at sunset',
        'Hike the Armenistis lighthouse loop',
      ],
      mooringTip:
        'Stern-to in Tourlos New Marina, €70-110/night peak. Pre-book online for July-August. Mykonos town quay only safe under 18 kn N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
    {
      id: 'mykonos-naxos',
      routeFrom: 'Mykonos',
      routeTo: 'Naxos',
      day: 6,
      mapPin: {
        desktop: { left: 57.6, top: 17.1 },
        mobile: { left: 58.7, top: 24.3 },
      },
      description:
        '22 nm south to Naxos. Town harbour is well-protected and stern-to is reliable. Portara marble doorway at the islet on the harbour entrance is the headline sunset spot. Stern-to in Naxos town harbour, €30-50/night. Plan to hike Mount Zas (Zeus birthplace, 4 h) and kitro citron liqueur tasting at Halki.',
      shortDescription:
        '22 nm south to Naxos. Well-protected town harbour, reliable stern-to. Portara marble doorway is the headline sunset. Well-protected from any direction. Plan to hike Mount Zas (Zeus birthplace, 4 h) and kitro citron liqueur tasting at Halki.',
      thingsToDo: [
        'Sunset at the Portara marble doorway',
        'Hike Mount Zas (Zeus birthplace, 4 h)',
        'Kitro citron liqueur tasting at Halki',
        'Swim Agios Prokopios Beach',
      ],
      mooringTip:
        'Stern-to in Naxos town harbour, €30-50/night. Well-protected from any direction. Plenty of slot capacity.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Naxos' }],
    },
    {
      id: 'naxos-ios',
      routeFrom: 'Naxos',
      routeTo: 'Ios',
      day: 7,
      mapPin: {
        desktop: { left: 60.2, top: 40.4 },
        mobile: { left: 60.6, top: 39 },
      },
      description:
        '20 nm south on Meltemi reach. Manganari Bay swim stop on the south coast of Ios, then round to Ormos for overnight. Late-night Chora is the headline Ios scene from 23:00. Ormos harbour stern-to, €25-40/night. Mylopotas anchorage daytime only. Manganari sheltered from N for swim stop. Plan to swim stop at Manganari Beach, hike to the supposed tomb of Homer above Plakotos, chora rembetika square late-night.',
      shortDescription:
        '20 nm south reach to Ios. Manganari swim stop on south coast, Ormos for overnight. Late-night Chora from 23:00. Ormos harbour stern-to, €25-40/night. Plan to swim stop at Manganari Beach and hike to the supposed tomb of Homer above Plakotos.',
      thingsToDo: [
        'Swim stop at Manganari Beach',
        'Hike to the supposed tomb of Homer above Plakotos',
        'Chora rembetika square late-night',
        'Sunset drinks above the windmills',
      ],
      mooringTip:
        'Ormos harbour stern-to, €25-40/night. Mylopotas anchorage daytime only. Manganari sheltered from N for swim stop.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ios.webp', alt: 'Ios' }],
    },
    {
      id: 'ios-santorini',
      routeFrom: 'Ios',
      routeTo: 'Santorini (Vlychada Marina)',
      day: 8,
      mapPin: {
        desktop: { left: 56.3, top: 64.5 },
        mobile: { left: 55.2, top: 59.6 },
      },
      description:
        '18 nm south to Santorini. Caldera entry deserves daylight; leave Ios at first light. Vlychada Marina is the only practical overnight; caldera 300+ m deep, anchoring impossible. Book ahead in peak season. Plan to taxi to Oia for the cliff-top sunset and wine tasting at Santo Wines or Domaine Sigalas.',
      shortDescription:
        '18 nm south to Santorini. Leave Ios at first light. Vlychada Marina is the only practical overnight; caldera 300+ m deep. Book ahead in peak season. Plan to taxi to Oia for the cliff-top sunset and wine tasting at Santo Wines or Domaine Sigalas.',
      thingsToDo: [
        'Taxi to Oia for the cliff-top sunset',
        'Wine tasting at Santo Wines or Domaine Sigalas',
        'Swim Red Beach (south coast access)',
        'Caldera-edge fava with capers in Megalochori',
      ],
      mooringTip: 'Vlychada Marina stern-to, €60-100/night. Book ahead in peak season.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vlychada.webp', alt: 'Vlychada' }],
    },
    {
      id: 'santorini-explore',
      routeFrom: 'Santorini',
      routeTo: 'Santorini',
      day: 9,
      mapPin: {
        desktop: { left: 61.4, top: 89 },
        mobile: { left: 64.1, top: 74.3 },
      },
      description:
        'Lay-day on Santorini. Akrotiri Bronze Age archaeological site (1700 BC, the Pompeii of the Cyclades) is the headline land excursion; volcanic caldera tour by tender; wine tasting at one of the cliff-edge vineyards. Stay overnight at Vlychada Marina. Day-anchor at the Thirasia cruise-ship buoys is unreliable for charter — keep at Vlychada. Plan to bronze Age Akrotiri archaeological site, caldera tour by tender to Thirasia, assyrtiko wine tasting at Santo or Sigalas.',
      shortDescription:
        'Lay-day on Santorini. Akrotiri Bronze Age site (1700 BC) is the headline land excursion. Caldera by tender; cliff-edge wine tasting. Stay overnight at Vlychada Marina; Day-anchor at the Thirasia cruise-ship buoys is unreliable for charter — keep at Vlychada.',
      thingsToDo: [
        'Bronze Age Akrotiri archaeological site',
        'Caldera tour by tender to Thirasia',
        'Assyrtiko wine tasting at Santo or Sigalas',
        'Sunset at Ammoudi Bay below Oia',
      ],
      mooringTip:
        'Stay overnight at Vlychada Marina. Day-anchor at the Thirasia cruise-ship buoys is unreliable for charter — keep at Vlychada.',
      gallery: [{ src: '/images/itinerary/greece/destinations/santorini.webp', alt: 'Santorini' }],
    },
    {
      id: 'santorini-folegandros',
      routeFrom: 'Santorini',
      routeTo: 'Folegandros',
      day: 10,
      description:
        '22 nm upwind northwest to Folegandros — Meltemi on the bow. Karavostasi sheltered from N, exposed S. Cliff-top Chora is a 30-minute kalderimi climb above the harbour. Karavostasi stern-to, €25-40/night, limited slots. Anchor in bay east on sand at 4-7 m if full. Avoid in S winds. Plan to taxi up to Chora for the cliff-edge Panagia church, swim Katergo Bay (boat-only access), matsata pasta with goat ragù in a courtyard.',
      shortDescription:
        '22 nm upwind NW to Folegandros — Meltemi on the bow. Karavostasi sheltered N, exposed S. Chora is a kalderimi climb above. Karavostasi stern-to, €25-40/night, limited slots; Anchor in bay east on sand at 4-7 m if full.',
      thingsToDo: [
        'Taxi up to Chora for the cliff-edge Panagia church',
        'Swim Katergo Bay (boat-only access)',
        'Matsata pasta with goat ragù in a courtyard',
        'Walk the kalderimi path to Ano Meria',
      ],
      mooringTip:
        'Karavostasi stern-to, €25-40/night, limited slots. Anchor in bay east on sand at 4-7 m if full. Avoid in S winds.',
      gallery: [{ src: '/images/itinerary/greece/destinations/folegandros.webp', alt: 'Folegandros' }],
    },
    {
      id: 'folegandros-milos',
      routeFrom: 'Folegandros',
      routeTo: 'Milos (Port Adamantas)',
      day: 11,
      mapPin: {
        desktop: { left: 36.1, top: 73.5 },
        mobile: { left: 35.9, top: 63 },
      },
      description:
        '20 nm upwind NW to Milos. Adamas Bay at the head of the long inlet is the most sheltered overnight in the western Cyclades. Sarakiniko swim only in calm wind. Stern-to in Adamas town quay, €30-50/night. Excellent shelter in any direction. Pollonia northeast cheaper but exposed in N. Plan to swim stop at lunar Sarakiniko cliffs, snorkel Papafragas sea caves, visit Plaka Castle for the panorama.',
      shortDescription:
        '20 nm upwind NW to Milos. Adamas Bay most sheltered in western Cyclades. Sarakiniko swim only in calm wind. Stern-to in Adamas town quay, €30-50/night; Excellent shelter in any direction; Pollonia northeast cheaper but exposed in N.',
      thingsToDo: [
        'Swim stop at lunar Sarakiniko cliffs',
        'Snorkel Papafragas sea caves',
        'Visit Plaka Castle for the panorama',
        'Klima fishermen syrmata photo walk',
      ],
      mooringTip:
        'Stern-to in Adamas town quay, €30-50/night. Excellent shelter in any direction. Pollonia northeast cheaper but exposed in N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/adhamas.webp', alt: 'Milos' }],
    },
    {
      id: 'milos-sifnos',
      routeFrom: 'Milos',
      routeTo: 'Sifnos (Vathi Port)',
      day: 12,
      mapPin: {
        desktop: { left: 11.9, top: 69.6 },
        mobile: { left: 9.1, top: 57.7 },
      },
      description:
        '18 nm north to Sifnos. Vathi south coast for the calmest swim anchorage; sand bottom, salt flats inland, pottery kilns ashore. Switch to Kamares for a larger paid quay if Vathi quay is unavailable. Anchor on sand at 4-6 m in Vathi (fully sheltered). Plan to pottery workshop visit in Vathy and swim Vathi Bay (south coast, calmest).',
      shortDescription:
        '18 nm north to Sifnos (Vathi). Calmest swim anchorage on the island; pottery kilns ashore. Switch to Kamares if Vathi quay unavailable. Highlights: Pottery workshop visit in Vathy and Swim Vathi Bay (south coast, calmest).',
      thingsToDo: [
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
        'Walk to Chrysopigi monastery (taxi or walk)',
        'Mastelo lamb at Artemonas inland',
      ],
      mooringTip: 'Anchor on sand at 4-6 m in Vathi (fully sheltered). Kamares quay stern-to €20-30/night, opens W.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vathi.webp', alt: 'Vathi' }],
    },
    {
      id: 'sifnos-paros',
      routeFrom: 'Sifnos',
      routeTo: 'Paros',
      day: 13,
      mapPin: {
        desktop: { left: 27.4, top: 52.4 },
        mobile: { left: 28.5, top: 47.8 },
      },
      description:
        '20 nm northeast back to Paros — Meltemi on the beam, easier sailing leg of the return. Naoussa for the photogenic fishing-harbour overnight; Parikia for easier mooring. Last evening dinner on the Naoussa pier. Plastira Bay 0.5 nm east on sand at 5-7 m. Plan to snorkel the moon-rock outcrops at Kolymbithres and octopus on the rope at a Naoussa pier taverna.',
      shortDescription:
        '20 nm NE back to Paros — Meltemi on the beam. Naoussa for the photogenic harbour; Parikia for easier mooring. Plastira Bay 0; 5 nm east on sand at 5-7 m; Parikia is the larger alternative.',
      thingsToDo: [
        'Snorkel the moon-rock outcrops at Kolymbithres',
        'Octopus on the rope at a Naoussa pier taverna',
        'Wine tasting at a Marpissa vineyard',
        'Walk Lefkes village marble paths at dusk',
      ],
      mooringTip:
        'Naoussa harbour stern-to, €30-50/night, often full by 17:00. Plastira Bay 0.5 nm east on sand at 5-7 m. Parikia is the larger alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-check-out',
      routeFrom: 'Paros',
      routeTo: 'Check-out',
      day: 14,
      description:
        'Handover at Parikia or Naoussa before 09:00. Inspection — deposit released within 7 days. Crew transfer to Paros airport (PAS) is 15 minutes from Parikia. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Golden Beach.',
      shortDescription:
        'Handover before 09:00. Inspection, deposit release within 7 days. PAS airport 15 min from Parikia. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Golden Beach. Plan to breakfast on the Parikia portside and airport transfer (15 min to PAS).',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Golden Beach',
        'Breakfast on the Parikia portside',
        'Airport transfer (15 min to PAS)',
      ],
      mooringTip: 'Hand over before 09:00. Deposit released within 7 days post-inspection.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykanos' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/paros/map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1293,
      height: 1173,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/paros/mobile-map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 780,
      height: 1090,
    },
  },
};

export default computeItineraryNumberOfDays(mykanosSirosMilosIos14DaysRoute);
