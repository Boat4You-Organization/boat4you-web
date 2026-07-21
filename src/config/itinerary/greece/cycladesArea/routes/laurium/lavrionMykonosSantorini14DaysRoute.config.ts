import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lavrionMykonosSantorini14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Lavrion–Mykonos–Santorini Yacht Route | Boat4You',
  metaDesc:
    'Sail a 14-day yacht charter from Lavrion through Syros, Tinos, Mykonos and Santorini and back. Lavrion start saves the Saronic crossing — the central Cyclades on minimum motoring.',
  id: 'lavrion-mykonos-santorini-14-days',
  startingPoint: 'Lavrion',
  otherPoints: ['Mykonos', 'Santorini'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/lavrion-mykonos-santorini.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/santorini-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/milos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/ios-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/paros-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'lavrion-kea',
      routeFrom: 'Lavrion',
      routeTo: 'Kea (Vourkari)',
      day: 1,
      mapPin: {
        desktop: { left: 8.9, top: 13.4 },
        mobile: { left: 3.1, top: 16.9 },
      },
      description:
        'Lavrion sits 12 nm closer to the central Cyclades than Alimos and the start day reflects it — one short channel crossing east to Kea, comfortable inside an afternoon. Cast off after lunch when the Meltemi is at its strongest, take the wind on the quarter, and run south of Cape Sounion before turning east. Vourkari Bay opens on the northwest of Kea; long stern-to quay, well sheltered from the prevailing N, and lined with seafood ouzeris that have been at the same family pier for three generations.',
      shortDescription:
        'Easy 18 nm afternoon hop east-southeast from Lavrion to Kea. Lavrion is 12 nm closer than Alimos so the first day stays short. Vourkari for the overnight; Korissia town quay is the cheaper alternative.',
      thingsToDo: [
        'Walk to the 6th-century BC Stone Lion of Kea',
        'Snorkel the Patris steamship wreck off Koundouros',
        'Octopus carpaccio at a Vourkari ouzeri',
        'Walk Ioulida marble streets at dusk',
      ],
      mooringTip:
        'Stern-to in Vourkari with lazy lines, around €25-35/night. Excellent shelter from N Meltemi. If full, drop anchor in Otzias 2 nm east on sand at 6-8 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-syros',
      routeFrom: 'Kea',
      routeTo: 'Syros (Ermoupoli)',
      day: 2,
      mapPin: {
        desktop: { left: 23.3, top: 15.3 },
        mobile: { left: 19.1, top: 18.2 },
      },
      description:
        'Slip the lines around 09:00 — the morning wind is usually under 12 kn before the Meltemi fills in around 13:00. 32 nm east-southeast across open water to Syros. Once the Meltemi builds the second half of the leg becomes a beam reach with fast sea state, so reef early. Ermoupoli town quay is one of the most forgiving stern-to mooring positions in the entire Cyclades and the capital climbs the slope above in pastel neoclassical layers.',
      shortDescription:
        '32 nm east-southeast to Syros — first half light air, second half full Meltemi beam reach. Reef before the wind builds. Ermoupoli town quay is fully sheltered.',
      thingsToDo: [
        'Climb Ano Syros for the medieval Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim the rock platforms at Asteria Beach',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any wind direction. Manna marina is the paid alternative for €60-80/night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-tinos',
      routeFrom: 'Syros',
      routeTo: 'Tinos',
      day: 3,
      mapPin: {
        desktop: { left: 49.3, top: 30.2 },
        mobile: { left: 46.8, top: 32.2 },
      },
      description:
        '14 nm hop east-southeast. The Syros-Tinos channel is the breeziest in the central Cyclades — gap effect adds 5 knots to the regional forecast and 25-knot afternoons are normal in late July. Ride the wind on the beam at speed but plan to be moored before 16:00. Tinos new harbour stern-to has moderate sand holding; the inner small craft harbour is the calmer alternative when Meltemi is forecast above 25 knots. Tinos is the Greek Orthodox pilgrimage centre and the marble-carving capital of the Aegean.',
      shortDescription:
        '14 nm fast beam reach east to Tinos. The Syros-Tinos channel funnels the Meltemi — expect 5 kn extra. Be in the harbour by 16:00; afternoon swell builds at the entrance.',
      thingsToDo: [
        'Marble-carving workshop visit in Pyrgos village',
        'Walk the dovecote trail above Falatados',
        'Artichoke à la polita lunch in a courtyard taverna',
        'Sunset at Volax granite-boulder field',
      ],
      mooringTip:
        'Stern-to in Tinos new harbour, €25-40/night. Holding moderate sand — set anchor with long scope. Inner small craft harbour is calmer when Meltemi exceeds 25 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tinos.webp', alt: 'Tinos' }],
    },
    {
      id: 'tinos-mykonos',
      routeFrom: 'Tinos',
      routeTo: 'Mykonos',
      day: 4,
      mapPin: {
        desktop: { left: 62, top: 21.4 },
        mobile: { left: 61.3, top: 23.7 },
      },
      description:
        'Short 8 nm leg east. The Tinos-Mykonos channel is reliably 5 knots stronger than the regional forecast — short, choppy state in the afternoon. Pre-book a slot at Tourlos New Marina online 24 hours ahead in July-August, or aim for the older Mykonos town quay (free but very exposed to swell, only viable if Meltemi is forecast below 18 knots). Day-anchor at Ornos or Psarou for an afternoon swim before mooring.',
      shortDescription:
        '8 nm short hop east to Mykonos. Tourlos New Marina is the safe overnight; town quay only works under 18 kn N. Pre-book Tourlos online 24h ahead in peak season.',
      thingsToDo: [
        'Day-trip across to ancient Delos',
        'Beach lunch at Agios Sostis (no road access)',
        'Walk the Little Venice waterfront at sunset',
        'Hike the Armenistis lighthouse loop',
      ],
      mooringTip:
        'Stern-to in Tourlos New Marina, €70-110/night peak. Pre-book online for July-August. Mykonos town quay free but only safe under 18 kn N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
    {
      id: 'mykonos-paros',
      routeFrom: 'Mykonos',
      routeTo: 'Paros (Naoussa)',
      day: 5,
      mapPin: {
        desktop: { left: 70.1, top: 28.2 },
        mobile: { left: 69.5, top: 30.5 },
      },
      description:
        'Run southwest to Paros, roughly 22 nm of open-water Meltemi sailing with the wind on the quarter. Passage time 4-5 hours under sail. Naoussa on the north coast of Paros is the obvious overnight: the original Cycladic fishing harbour at the centre and a thriving yacht-village restaurant scene around it. Anchor in Plastira Bay outside the town if Meltemi pushes the inner harbour or if the small quay is full by 17:00.',
      shortDescription:
        '22 nm fast downwind run southwest to Paros (Naoussa). Quarter-reach the whole way. Be alert to gusts off Naxos — the leg passes the windiest channel in the area.',
      thingsToDo: [
        'Snorkel the moon-rock outcrops at Kolymbithres',
        'Wine tasting at a Marpissa vineyard',
        'Ouzo at the Naoussa fishing-harbour quay',
        'Hike Lefkes village marble paths at dusk',
      ],
      mooringTip:
        'Naoussa harbour stern-to, €30-50/night, often full by 17:00. Anchor in Plastira Bay 0.5 nm east on sand at 5-7 m if full. Parikia is the larger alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-ios',
      routeFrom: 'Paros',
      routeTo: 'Ios',
      day: 6,
      mapPin: {
        desktop: { left: 66, top: 48.9 },
        mobile: { left: 61.5, top: 49 },
      },
      description:
        '28 nm passage south through the Naxos-Sikinos channel — one of the strongest Meltemi stretches of the central Cyclades. Expect a port-tack reach with steady 22-30 knots through the channel itself. Reef early. Ormos harbour at Ios is sheltered and the marina is undergoing expansion; the older quay is still serviceable. Mylopotas Bay 1 nm south is the standard daytime swim anchorage but unsafe overnight in any Meltemi.',
      shortDescription:
        '28 nm reach south to Ios on full Meltemi — strongest wind day of the route. Reef early, plan to be inside Ormos harbour before 16:00. Mylopotas is the daytime swim stop only.',
      thingsToDo: [
        'Hike to the supposed tomb of Homer above Plakotos',
        'Swim Manganari Bay (south coast)',
        'Sunset drinks above Chora windmills',
        'Late-night Chora rembetika square',
      ],
      mooringTip:
        'Ormos harbour stern-to, €25-40/night. New marina slots when available are pre-bookable. Mylopotas anchorage daytime only — untenable overnight in Meltemi.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ios.webp', alt: 'Ios' }],
    },
    {
      id: 'ios-santorini',
      routeFrom: 'Ios',
      routeTo: 'Santorini',
      day: 7,
      mapPin: {
        desktop: { left: 80.8, top: 54.8 },
        mobile: { left: 69, top: 69.5 },
      },
      description:
        '18 nm south to Santorini. The caldera deserves a daylight entry and a calm wind window. Vlychada Marina on the south coast is the only practical overnight (paid berth, road access, sheltered). Caldera anchoring is technically possible at the cruise-ship buoys off Thirasia, but the bottom drops past 200 m so swing-anchoring is impossible. Plan to leave Ios at first light, be at Vlychada by lunchtime, and taxi up to Oia for the sunset.',
      shortDescription:
        '18 nm south to Santorini. Leave Ios at first light, be moored at Vlychada by lunchtime. The caldera is unanchorable (300+ m deep); Vlychada is the only real overnight.',
      thingsToDo: [
        'Taxi to Oia for the cliff-top sunset',
        'Wine tasting at Santo Wines or Domaine Sigalas',
        'Swim off Red Beach (south coast access)',
        'Caldera-edge fava with capers in Megalochori',
      ],
      mooringTip:
        'Vlychada Marina stern-to, €60-100/night. Book ahead in peak season. Cruise-ship buoys off Thirasia are an unreliable alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/santorini.webp', alt: 'Santorini' }],
    },
    {
      id: 'santorini-folegandros',
      routeFrom: 'Santorini',
      routeTo: 'Folegandros',
      day: 8,
      mapPin: {
        desktop: { left: 76.4, top: 94.4 },
        mobile: { left: 75.6, top: 85.7 },
      },
      description:
        'Turn west and start the return. 22 nm northwest to Folegandros, first true upwind leg of the trip — Meltemi on the bow. Karavostasi is the only practical port; small, sheltered from N, exposed to S. Anchor or stern-to depending on slot availability. The Chora itself is high above the harbour on the cliff edge — taxi or a 30-minute climb up the kalderimi. Day-anchor at Katergo Bay (boat-only access) for a swim before mooring.',
      shortDescription:
        '22 nm upwind northwest to Folegandros — first true upwind leg, Meltemi on the bow. Karavostasi sheltered from N, exposed S. Chora is a taxi above the harbour.',
      thingsToDo: [
        'Taxi up to Chora for the cliff-edge Panagia church',
        'Swim Katergo Bay (boat-only access)',
        'Matsata pasta with goat ragù in a lantern courtyard',
        'Walk the kalderimi path to Ano Meria',
      ],
      mooringTip:
        'Karavostasi stern-to, €25-40/night, limited slots. Anchor in the bay east of port on sand at 4-7 m if full. Avoid in S winds — port fully exposed south.',
      gallery: [{ src: '/images/itinerary/greece/destinations/folegandros.webp', alt: 'Folegandros' }],
    },
    {
      id: 'folegandros-milos',
      routeFrom: 'Folegandros',
      routeTo: 'Milos (Adamas)',
      day: 9,
      mapPin: {
        desktop: { left: 51.4, top: 79.8 },
        mobile: { left: 48.4, top: 74.9 },
      },
      description:
        '20 nm northwest to Milos — second upwind leg, Meltemi on the bow. Adamas harbour at the head of the long Milos bay is the safest overnight on the island and one of the most sheltered in the western Cyclades. Once inside the bay, the wind drops away and protection from any direction is excellent. Plan a daytime swim stop at Sarakiniko on the way past — the bone-white volcanic landscape is unmissable but the anchorage is exposed and only viable in calm wind.',
      shortDescription:
        '20 nm upwind northwest to Milos. Adamas Bay at the head of the long inlet is the most sheltered overnight in the western Cyclades. Two long tacks, Meltemi on the bow.',
      thingsToDo: [
        'Swim stop at lunar Sarakiniko cliffs',
        'Snorkel Papafragas sea caves',
        'Visit Plaka Castle for the panorama',
        'Klima fishermen syrmata photo walk',
      ],
      mooringTip:
        'Stern-to in Adamas town quay, €30-50/night. Excellent shelter in any wind direction. Pollonia northeast is cheaper but exposed in N Meltemi.',
      gallery: [{ src: '/images/itinerary/greece/destinations/adhamas.webp', alt: 'Milos' }],
    },
    {
      id: 'milos-sifnos',
      routeFrom: 'Milos',
      routeTo: 'Sifnos (Kamares)',
      day: 10,
      mapPin: {
        desktop: { left: 26, top: 74.3 },
        mobile: { left: 24, top: 72.5 },
      },
      description:
        '18 nm short hop north to Sifnos. Kamares Bay on the west coast is the obvious overnight — sheltered from N and NE but opens to the W. In late summer when the Meltemi has a westerly component, swell rolls in and the bay can become unsettled; Platys Gialos on the south coast is the alternative. Sifnos is the gastronomy island of the Cyclades — chickpea revithada cooked in a wood oven overnight, mastelo lamb in clay pots, and the original Tselemes 19th-century cookbook tradition.',
      shortDescription:
        '18 nm north to Sifnos. Kamares is the standard overnight, sheltered from N/NE. When wind has a W component (late August), switch to Platys Gialos on the south coast.',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calm)',
      ],
      mooringTip:
        'Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (limited slots, €20-30/night). Switch to Platys Gialos south coast when wind clocks west.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kamares.webp', alt: 'Kamares' }],
    },
    {
      id: 'sifnos-serifos',
      routeFrom: 'Sifnos',
      routeTo: 'Serifos (Livadi)',
      day: 11,
      mapPin: {
        desktop: { left: 39.9, top: 58.2 },
        mobile: { left: 39, top: 56.2 },
      },
      description:
        '14 nm short upwind hop north to Serifos. Livadi Bay on the south coast opens directly into the Meltemi and acts as a wind funnel; holding is good sand but the wind stretches any anchor and drag is the most common Serifos charter incident. Set with long scope, dive to verify, stay aboard for the first hour after mooring. Chora above the harbour is one of the most photogenic Cycladic villages and worth the donkey path or the road taxi up.',
      shortDescription:
        '14 nm hop north to Serifos. Livadi Bay funnels the Meltemi — set anchor with long scope and dive to verify. Drag is the most common charter incident here.',
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
      routeTo: 'Kythnos (Merichas)',
      day: 12,
      mapPin: {
        desktop: { left: 30.4, top: 45.9 },
        mobile: { left: 26.9, top: 46.1 },
      },
      description:
        '15 nm north to Kythnos. Merichas is the small ferry port on the west coast and the Kolona double-bay sandbar 6 nm further north is the headline anchorage of the whole island. Kolona is unique — a 200-metre sand spit joining the islet of Agios Loukas to Kythnos proper, with a beach and shallow swimming on both sides of the spit. Anchor and stay through dinner — the swim is the destination, not the village.',
      shortDescription:
        '15 nm north to Kythnos. Drop in Kolona double-bay (boat-only access, sand spit joining the islet to Kythnos) for the headline swim. Merichas is the alternative paid quay.',
      thingsToDo: [
        'Anchor swim at the Kolona sandbar',
        'Soak in the Loutra natural hot springs',
        'Cycle the Chora-Driopida ridge road',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Free anchoring on sand at 4-6 m at Kolona, sheltered from N Meltemi by the islet. Merichas town quay €20-30/night. Loutra has small marina slots and natural hot springs.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-lavrion',
      routeFrom: 'Kythnos',
      routeTo: 'Lavrion',
      day: 13,
      mapPin: {
        desktop: { left: 27.2, top: 32.3 },
        mobile: { left: 23.4, top: 33.1 },
      },
      description:
        'Final leg back to Lavrion — 24 nm northwest. Shorter than the Alimos return because Lavrion sits east of Athens. Cape Sounion to starboard halfway across — last navigation marker before the home port. Refuel at Lavrion fuel berth before tying up so the crew can step off the boat ready for transfers. The Lavrion base typically wants the boat in by 17:00 the day before the official handover.',
      shortDescription:
        '24 nm northwest back to Lavrion. Shorter than Alimos because Lavrion is east of Athens — easier final day, sometimes a downwind drift in evening Meltemi. Refuel before mooring.',
      thingsToDo: [
        'Last swim under the Cape Sounion temple',
        'Refuel and clean the boat at Lavrion',
        'Crew dinner at a Lavrion harbourside taverna',
        'Souvenir-stop in Lavrion town',
      ],
      mooringTip:
        'Lavrion Olympic Marina stern-to with lazy lines, €60-90/night. Refuel at the entrance fuel berth before mooring. Confirm handover slot 24h ahead with the base.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lavrion.webp', alt: 'Lavrion' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Lavrion',
      routeTo: 'Check-out',
      day: 14,
      description:
        'Handover at Lavrion before 09:00. Base inspects the boat with the skipper present — deposit released within 7 days assuming nothing flagged. Crew transfer to Athens airport is roughly 50 minutes by road, plus traffic. Coffee and breakfast at a Lavrion harbour café before goodbyes; the espresso here is half the price of Glyfada.',
      shortDescription:
        'Handover before 09:00 at Lavrion. Boat inspection, deposit release within 7 days. Airport transfer is 50 minutes plus traffic — leave 90 in Friday peak.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Coffee at a Lavrion harbour kafeneio',
        'Airport transfer (50 min from Lavrion)',
        'Tip the dock crew if service was good',
      ],
      mooringTip:
        'Hand over at Lavrion before 09:00. Deposit released within 7 days post-inspection. Confirm any damage notes with photo evidence before signing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lavrion.webp', alt: 'Lavrion' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/map.webp',
        alt: 'Lavrion Mykonos Santorini Route Image',
      },
      width: 1147,
      height: 1103,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/mobile-map.webp',
        alt: 'Lavrion Mykonos Santorini Route Image',
      },
      width: 1032,
      height: 1165,
    },
  },
};

export default computeItineraryNumberOfDays(lavrionMykonosSantorini14DaysRoute);
