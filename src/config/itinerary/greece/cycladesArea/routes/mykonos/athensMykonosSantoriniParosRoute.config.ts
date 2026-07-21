import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const athensMykonosSantoriniParosRoute: ItineraryRoute = {
  metaTitle: '14-Day Athens–Mykonos–Santorini–Paros Yacht Route | Boat4You',
  metaDesc:
    'Sail a 14-day yacht charter from Athens (Alimos) through Mykonos and Santorini and back via Paros — the headline downwind Cyclades loop, planned for Meltemi-confident crews.',
  id: 'athens-mykonos-santorini-paros',
  startingPoint: 'Athens',
  otherPoints: ['Mykonos', 'Santorini', 'Paros'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/athens-mykonos-santorini-paros.webp',
    alt: 'athens-mykonos-santorini-paros',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/mykonos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/paros-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/syros-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/serifos-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'athens-kea',
      routeFrom: 'Athens (Alimos)',
      routeTo: 'Kea (Vourkari)',
      day: 1,
      mapPin: {
        desktop: { left: 18.1, top: 4.3 },
        mobile: { left: 5.9, top: 17.4 },
      },
      description:
        "Lift lines at Alimos Marina around 11:00 once provisioning is on board, then run east-southeast across the Saronic. Cape Sounion stays to starboard inside the first hour — Poseidon's columns the navigation marker for the channel exit. From there it's a 20 nm reach across to Kea on whatever the morning wind gives you; in summer that is usually a building northerly. Vourkari Bay opens on the northwest side of the island and is the natural first overnight: shelter from the prevailing N Meltemi, a long stern-to quay, and a string of seafood ouzeris running the length of the waterfront.",
      shortDescription:
        '20 nm shake-down leg out of Alimos across the Saronic to Kea. Aim for Vourkari on the northwest of the island for sheltered overnight; Korissia town quay is the cheaper alternative when winds stay below 18 kn from N.',
      thingsToDo: [
        'Walk to the 6th-century BC Stone Lion of Kea',
        'Snorkel the Patris steamship wreck off Koundouros',
        'Octopus carpaccio at a Vourkari ouzeri',
        'Dusk stroll through Ioulida marble alleys',
      ],
      mooringTip:
        'Stern-to in Vourkari with lazy lines, around €25-35/night for a 45-foot boat. Excellent shelter from N Meltemi. If full, drop anchor in Otzias 2 nm east on sand at 6-8 m.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-syros',
      routeFrom: 'Kea',
      routeTo: 'Syros (Ermoupoli)',
      day: 2,
      mapPin: {
        desktop: { left: 39.4, top: 20.6 },
        mobile: { left: 35.7, top: 31.1 },
      },
      description:
        'Slip the lines at Vourkari soon after coffee — the morning wind is usually under 12 kn before the Meltemi fills in around 13:00. Course is east-southeast across open water to Syros, roughly 32 nm. Once the Meltemi builds the second half of the leg becomes a beam reach with fast sea state, so reef early. Ermoupoli town quay sits at the head of a deep harbour with the neoclassical capital climbing the slope above; the quay is one of the easiest stern-to mooring positions in the whole Cyclades.',
      shortDescription:
        '32 nm passage southeast to Syros — first half light air, second half full Meltemi beam reach. Reef before the wind builds. Ermoupoli quay is fully sheltered and one of the most forgiving overnights in the Cyclades.',
      thingsToDo: [
        'Climb Ano Syros for the medieval Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim the rock platforms at Asteria Beach',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, lazy lines mostly absent — your own anchor). Excellent shelter in any wind direction. Marina slot inside Manna marina is the paid alternative for €60-80/night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-tinos',
      routeFrom: 'Syros',
      routeTo: 'Tinos',
      day: 3,
      mapPin: {
        desktop: { left: 60.3, top: 34.2 },
        mobile: { left: 67, top: 40.7 },
      },
      description:
        'Short 14 nm hop east-southeast to Tinos through one of the breeziest channels in the Cyclades — the gap between Syros and Tinos accelerates the Meltemi and 25-knot afternoons are normal in late July. Take the wind on the beam at speed, but plan to be moored before 16:00. Tinos new harbour has stern-to berths but the holding is moderate; the better-protected option is the small inner harbour reserved for charter and local craft. The island itself is the marble-carving capital of the Aegean and the pilgrimage centre of the Greek Orthodox church.',
      shortDescription:
        '14 nm fast beam reach east to Tinos — the Syros-Tinos channel funnels the Meltemi, expect 5-knot extra wind here. Be in the harbour by 16:00; afternoon swell builds at the entrance.',
      thingsToDo: [
        'Marble-carving workshop visit in Pyrgos village',
        'Walk the dovecote trail above Falatados',
        'Artichoke à la polita lunch in a courtyard taverna',
        'Sunset at Volax granite-boulder field',
      ],
      mooringTip:
        'Stern-to in Tinos new harbour, around €25-40/night. Holding is moderate sand — set the anchor with a long scope. Inner small craft harbour is the calmer alternative when Meltemi is forecast above 25 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tinos.webp', alt: 'Tinos' }],
    },
    {
      id: 'tinos-mykanos',
      routeFrom: 'Tinos',
      routeTo: 'Mykonos',
      day: 4,
      mapPin: {
        desktop: { left: 67.9, top: 26.5 },
        mobile: { left: 77.7, top: 35.5 },
      },
      description:
        'Short 8 nm leg east to Mykonos. The straight line crosses the open Tinos-Mykonos channel where the wind is reliably 5 kn stronger than the regional forecast — short, choppy state in the afternoon. Pre-book a slot at Tourlos New Marina online 24 hours ahead in July-August, or aim for the older Mykonos town quay (free but very exposed to swell, only viable if Meltemi is forecast below 18 kn). Day-anchor at Ornos or Psarou for an afternoon swim before mooring.',
      shortDescription:
        '8 nm short hop east to Mykonos. Tourlos New Marina is the safe overnight; Mykonos town quay is exposed and only feasible in light Meltemi. Pre-book Tourlos online 24h ahead in July-August.',
      thingsToDo: [
        'Day-trip across to ancient Delos',
        'Beach lunch at Agios Sostis (no road access)',
        'Walk the Little Venice waterfront at sunset',
        'Hike Armenistis lighthouse loop',
      ],
      mooringTip:
        'Stern-to in Tourlos New Marina, €70-110/night peak. Pre-book online for July-August. Mykonos town quay is free but only safe under 18 kn N — swell builds fast on the entrance.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
    {
      id: 'mykanos-paros',
      routeFrom: 'Mykonos',
      routeTo: 'Paros (Naoussa)',
      day: 5,
      mapPin: {
        desktop: { left: 73.3, top: 32.8 },
        mobile: { left: 85.6, top: 40.4 },
      },
      description:
        'Run southwest to Paros, roughly 22 nm of open-water Meltemi sailing with the wind on the quarter — one of the most consistent downwind legs in the Cyclades summer programme. Passage time is 4-5 hours under sail. Naoussa, on the north coast of Paros, is the obvious overnight: a small Cycladic fishing harbour transformed into a yacht-set village, with the original octopus-on-the-rope quay still in place at the centre. Anchor in the bay outside the town if Meltemi pushes the inner harbour.',
      shortDescription:
        '22 nm fast downwind run southwest to Paros (Naoussa). Quarter-reach the whole way — one of the best sailing days in the central Cyclades. Be alert to gusts off Naxos — the leg passes the windiest channel in the area.',
      thingsToDo: [
        'Snorkel the moon-rock outcrops at Kolymbithres',
        'Wine tasting at a Marpissa vineyard',
        'Ouzo at the Naoussa fishing-harbour quay',
        'Hike Lefkes village marble paths at dusk',
      ],
      mooringTip:
        'Naoussa harbour stern-to — small, €30-50/night, often full by 17:00. If full, anchor in Plastira Bay 0.5 nm east on sand at 5-7 m, sheltered from N. Parikia is the larger alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-ios',
      routeFrom: 'Paros',
      routeTo: 'Ios',
      day: 6,
      mapPin: {
        desktop: { left: 69.8, top: 51 },
        mobile: { left: 80.8, top: 55.7 },
      },
      description:
        'Drop south to Ios — 28 nm passage through the Naxos-Sikinos channel. The Meltemi is at its strongest in this stretch and the boat is on the wind, not behind it; expect a port-tack reach with steady 22-30 knots through the channel itself. Ios harbour at Ormos is sheltered and the marina is undergoing expansion; the older quay is still serviceable but limited slot count. Mylopotas Bay 1 nm south is the standard daytime anchorage for swimming.',
      shortDescription:
        '28 nm reach south to Ios on full Meltemi. Strongest wind day of the route — reef early, plan to be inside Ormos harbour before 16:00. Mylopotas Bay is the daytime swim stop.',
      thingsToDo: [
        'Hike to the supposed tomb of Homer above Plakotos',
        'Swim Manganari Bay (south coast)',
        'Sunset drinks above Chora windmills',
        'Late-night Chora rembetika square',
      ],
      mooringTip:
        'Ormos harbour stern-to, €25-40/night. New marina slots when available are pre-bookable. Mylopotas anchorage is the daytime alternative on sand at 5-8 m, untenable overnight in Meltemi.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ios.webp', alt: 'Ios' }],
    },
    {
      id: 'ios-santorini',
      routeFrom: 'Ios',
      routeTo: 'Santorini',
      day: 7,
      mapPin: {
        desktop: { left: 71.7, top: 73.8 },
        mobile: { left: 84.3, top: 73.1 },
      },
      description:
        'Last leg south — only 18 nm but Santorini caldera entry deserves daylight and a calm wind window. The recommended anchorage is Vlychada Marina on the south coast (paid berth, sheltered, road access for crew change). Caldera anchoring is technically possible but only off Thirasia at the cruise-ship buoys; the inside of the caldera bottoms out beyond 200 m so swing-anchoring is impossible. Plan to leave Ios at first light, be at Vlychada by lunchtime, and hire a road taxi up to Oia for the sunset.',
      shortDescription:
        '18 nm south to Santorini — leave Ios at first light, be moored at Vlychada by lunchtime. The caldera itself is unanchorable (300+ m deep); Vlychada Marina on the south coast is the only real overnight.',
      thingsToDo: [
        'Taxi to Oia for the cliff-top sunset',
        'Wine tasting at Santo Wines or Domaine Sigalas',
        'Swim off Red Beach (south coast access)',
        'Caldera-edge fava with capers in Megalochori',
      ],
      mooringTip:
        'Vlychada Marina stern-to, around €60-100/night. Book ahead in peak season. Cruise-ship buoys off Thirasia are an unreliable alternative — caldera depth makes free anchoring unfeasible.',
      gallery: [{ src: '/images/itinerary/greece/destinations/santorini.webp', alt: 'Santorini' }],
    },
    {
      id: 'santorini-folegandros',
      routeFrom: 'Santorini',
      routeTo: 'Folegandros',
      day: 8,
      mapPin: {
        desktop: { left: 76.8, top: 93.3 },
        mobile: { left: 91.1, top: 87 },
      },
      description:
        'Turn west and start the return loop — the last week is upwind work against the Meltemi, planned in shorter legs. Folegandros is 22 nm northwest of Santorini and the smallest of the headline Cyclades stops. Karavostasi is the only practical port; small, exposed to the south, but sheltered when the Meltemi sits in the standard N quadrant. Anchor or stern-to depending on slot availability. The Chora itself is high above the harbour on a cliff edge — taxi or a serious 30-minute climb.',
      shortDescription:
        '22 nm northwest into wind to Folegandros — first true upwind leg. Karavostasi port is small and sheltered from N Meltemi; expose to S, so check forecast. Two tacks out of Santorini, then a long port-tack reach.',
      thingsToDo: [
        'Taxi to Chora for the cliff-edge Panagia church',
        'Swim Katergo Bay (boat-only access)',
        'Matsata pasta with goat ragù in a lantern courtyard',
        'Walk the kalderimi path to Ano Meria',
      ],
      mooringTip:
        'Karavostasi stern-to, €25-40/night, limited slots. Anchor in the bay east of the port on sand at 4-7 m if full. Avoid in S winds — port is fully exposed south.',
      gallery: [{ src: '/images/itinerary/greece/destinations/folegandros.webp', alt: 'Folegandros' }],
    },
    {
      id: 'folegandros-milos',
      routeFrom: 'Folegandros',
      routeTo: 'Milos (Adamas)',
      day: 9,
      mapPin: {
        desktop: { left: 58.7, top: 79.6 },
        mobile: { left: 64.1, top: 77.1 },
      },
      description:
        '20 nm northwest to Milos — second upwind leg, Meltemi on the bow. Adamas harbour at the head of the long Milos bay is the safest overnight on the island and one of the most sheltered in the western Cyclades. Once inside the bay, the wind drops away and the protection from any direction is excellent. Plan a daytime swim stop at Sarakiniko on the way past — the bone-white volcanic landscape is unmissable, but the anchorage is exposed and only viable in calm wind.',
      shortDescription:
        '20 nm northwest upwind to Milos — Meltemi on the bow, plan two long tacks. Adamas Bay at the head of the long Milos inlet is the most sheltered overnight in the western Cyclades.',
      thingsToDo: [
        'Swim stop at the lunar Sarakiniko cliffs',
        'Snorkel Papafragas sea caves',
        'Visit Plaka Castle for the panorama',
        'Klima fishermen syrmata photo walk',
      ],
      mooringTip:
        'Stern-to in Adamas town quay, around €30-50/night. Excellent shelter in any wind direction. Pollonia on the northeast is the cheaper alternative but exposed in N Meltemi.',
      gallery: [{ src: '/images/itinerary/greece/destinations/adhamas.webp', alt: 'Milos' }],
    },
    {
      id: 'milos-sifnos',
      routeFrom: 'Milos',
      routeTo: 'Sifnos (Kamares)',
      day: 10,
      mapPin: {
        desktop: { left: 42.8, top: 73.3 },
        mobile: { left: 41.6, top: 73.7 },
      },
      description:
        'Short 18 nm hop north to Sifnos — Kamares Bay on the west coast is the obvious overnight. The bay is sheltered from N and NE but opens to the W; in late summer when the Meltemi has a westerly component, swell rolls in and the bay can become unsettled. Platys Gialos on the south coast is the alternative when wind veers west. Sifnos is the gastronomy island of the Cyclades — chickpea revithada cooked in a wood oven overnight, mastelo lamb in clay pots, and the original Tselemes 19th-century cookbook tradition.',
      shortDescription:
        '18 nm north to Sifnos. Kamares Bay is the standard overnight, sheltered from N/NE. When wind has a W component (late August), swell rolls in — switch to Platys Gialos south coast.',
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
      routeTo: 'Serifos',
      day: 11,
      mapPin: {
        desktop: { left: 51.6, top: 59.3 },
        mobile: { left: 55.1, top: 62.5 },
      },
      description:
        '14 nm short upwind hop north to Serifos. Livadi Bay on the south coast opens directly into the Meltemi and acts as a wind funnel; the holding is good sand but the wind can stretch any anchor and drag is the most common Serifos charter incident. Set with long scope, dive to verify, and stay aboard for the first hour after mooring. Chora above the harbour is one of the most photogenic Cycladic villages and worth the donkey path or the road taxi.',
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
      id: 'serifos-kithnos',
      routeFrom: 'Serifos',
      routeTo: 'Kythnos (Merichas)',
      day: 12,
      mapPin: {
        desktop: { left: 44.4, top: 48.8 },
        mobile: { left: 43.7, top: 52.8 },
      },
      description:
        '15 nm north to Kythnos — quieter than the headline islands, with Merichas the small ferry port on the west coast and the Kolona double-bay sandbar 6 nm further north as the headline anchorage. Kolona is the unique Kythnos feature: a 200-metre sand spit joining the islet of Agios Loukas to Kythnos proper, with a beach and shallow swimming on both sides of the spit. Anchor and stay through dinner — the swim is the destination.',
      shortDescription:
        '15 nm north to Kythnos. Drop in Kolona double-bay (boat-only access, sand spit joining the islet to Kythnos) for the headline swim of the route. Merichas is the alternative paid quay.',
      thingsToDo: [
        'Anchor swim at the Kolona sandbar',
        'Soak in the Loutra natural hot springs',
        'Cycle the Chora-Driopida ridge road',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Free anchoring on sand at 4-6 m at Kolona (sheltered from N Meltemi by the islet). Merichas town quay stern-to, €20-30/night. Loutra port has natural hot springs and small marina slots.',
      gallery: [{ src: '/images/itinerary/greece/destinations/serifos.webp', alt: 'Serifos' }],
    },
    {
      id: 'kithnos-athens',
      routeFrom: 'Kythnos',
      routeTo: 'Athens (Alimos)',
      day: 13,
      mapPin: {
        desktop: { left: 41.3, top: 35.4 },
        mobile: { left: 41.2, top: 41.9 },
      },
      description:
        'Final leg back to Alimos — 35 nm west-northwest across the open Saronic. With the Meltemi behind the beam this is fast downwind sailing if the wind cooperates; in light wind days plan motor-sail to make the 16:00 marina arrival. Cape Sounion appears to starboard halfway across — last navigation marker before the Saronic itself. Refuel at Alimos before tying up so the crew can step off the boat ready for transfers.',
      shortDescription:
        '35 nm final leg WNW to Alimos. Downwind in Meltemi or motor-sail in light air. Refuel before tying up so the boat is ready for handover the next morning.',
      thingsToDo: [
        'Last swim under the Cape Sounion temple',
        'Refuel and clean the boat at Alimos',
        'Crew dinner at a Glyfada taverna',
        'Souvenir-stop on Faliro promenade',
      ],
      mooringTip:
        'Alimos Marina stern-to with lazy lines, €70-100/night. Refuel at the entrance fuel berth before mooring. Confirm the handover slot 24h ahead with the base.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alimos.webp', alt: 'Alimos' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Athens (Alimos)',
      routeTo: 'Athens (Check Out)',
      day: 14,
      description:
        'Handover at Alimos before 09:00. The base inspects the boat with the skipper present — the deposit is released within 7 days assuming nothing flagged. Crew transfer to Athens airport is 25 minutes by road; allow an hour in Friday traffic. Coffee and breakfast at a Glyfada beachfront café before the goodbyes.',
      shortDescription:
        'Handover before 09:00 at Alimos. Boat inspection with the skipper, deposit release within 7 days. Airport transfer is 25 minutes; allow 60 in Friday traffic.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Coffee on the Glyfada promenade',
        'Airport transfer (25 min from Alimos)',
        'Tip the dock crew if service was good',
      ],
      mooringTip:
        'Hand over at Alimos before 09:00. Deposit released within 7 days post-inspection. Confirm any damage notes with photo evidence before signing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/alimos.webp', alt: 'Athens' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/mykonos/athens-mykanos-santorini-paros/map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 1408,
      height: 1062,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/mykonos/athens-mykanos-santorini-paros/mobile-map.webp',
        alt: 'Athens Mykonos Paros Route Map',
      },
      width: 889,
      height: 1211,
    },
  },
};

export default computeItineraryNumberOfDays(athensMykonosSantoriniParosRoute);
