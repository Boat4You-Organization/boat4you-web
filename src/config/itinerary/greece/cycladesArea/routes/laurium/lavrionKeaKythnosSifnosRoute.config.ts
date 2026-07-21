import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lavrionKeaKythnosSifnosRoute: ItineraryRoute = {
  metaTitle: '7-Day Lavrion–Kea–Kythnos–Sifnos Yacht Route | Boat4You',
  metaDesc:
    'Sail a 7-day yacht charter from Lavrion through Kea, Kythnos and Sifnos with Serifos on the return. Compact western Cyclades loop suitable for shoulder-season Meltemi.',
  id: 'lavrion-kea-kythnos-sifnos',
  startingPoint: 'Lavrion',
  otherPoints: ['Kea', 'Kythnos', 'Sifnos'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/lavrion-kea-kythnos-sifnos.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/kythnos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/serifos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/kythnos-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/sifnos-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'lavrion-kea',
      routeFrom: 'Lavrion',
      routeTo: 'Kea (Korissia Harbor)',
      day: 1,
      mapPin: {
        desktop: { left: 10, top: 11.9 },
        mobile: { left: 4.1, top: 15.8 },
      },
      description:
        '18 nm shake-down hop east-southeast from Lavrion to Kea. Korissia harbour on the northwest of the island is the larger overnight option (free quay, exposed in N Meltemi above 18 kn); Vourkari Bay 1 nm north is the better-protected alternative with stern-to lazy lines and a string of seafood ouzeris on the waterfront. Plan to be moored before 16:00 — afternoon swell builds at the Korissia entrance once Meltemi exceeds 20 knots.',
      shortDescription:
        '18 nm afternoon hop east-southeast from Lavrion to Kea. Korissia is the larger free quay; Vourkari is the sheltered paid alternative when Meltemi blows above 18 kn from N.',
      thingsToDo: [
        'Walk to the 6th-century BC Stone Lion of Kea',
        'Snorkel the Patris steamship wreck off Koundouros',
        'Octopus carpaccio at a Vourkari ouzeri',
        'Walk Ioulida marble alleys at dusk',
      ],
      mooringTip:
        'Korissia town quay is free but exposed in N Meltemi above 18 kn. Switch to Vourkari Bay (€25-35/night, lazy lines) when wind builds.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-kythnos',
      routeFrom: 'Kea',
      routeTo: 'Kythnos (Loutra Harbor)',
      day: 2,
      mapPin: {
        desktop: { left: 25.3, top: 16.1 },
        mobile: { left: 19.8, top: 17.8 },
      },
      description:
        '20 nm south to Kythnos with the Meltemi on the quarter — comfortable downwind reach in the standard summer regime. Loutra on the northeast coast is the headline overnight: small marina with natural thermal springs flowing into the harbour, mineral-rich water at around 38°C. Stern-to with lazy lines, around €25-40/night. Day-anchor at Kolona double-bay (sand spit between Kythnos and the Agios Loukas islet) on the way south for a swim.',
      shortDescription:
        '20 nm south to Kythnos with Meltemi on the quarter. Loutra harbour has natural thermal springs flowing in — a working soak after a day under sail. Day-anchor at Kolona on the way.',
      thingsToDo: [
        'Soak in Loutra natural thermal springs',
        'Anchor swim at the Kolona sandbar',
        'Cycle the Chora-Driopida ridge road',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Stern-to in Loutra harbour, €25-40/night with lazy lines. Sheltered from N. Merichas on the west coast is the alternative if Loutra is full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-sifnos',
      routeFrom: 'Kythnos',
      routeTo: 'Sifnos (Kamares Harbor)',
      day: 3,
      mapPin: {
        desktop: { left: 28.4, top: 30.2 },
        mobile: { left: 23.4, top: 30.4 },
      },
      description:
        '28 nm south to Sifnos via Serifos — beam reach in standard Meltemi, fast passage. Kamares Bay on the west coast of Sifnos is the obvious overnight: sheltered from N and NE but opens to W. In late August when the Meltemi has a westerly component, swell rolls in and the bay can become unsettled — switch to Platys Gialos on the south coast. Sifnos is the gastronomy island of the Cyclades: chickpea revithada cooked overnight in a wood oven, mastelo lamb in clay pots.',
      shortDescription:
        '28 nm south to Sifnos via Serifos. Kamares Bay sheltered from N/NE but opens W — switch to Platys Gialos south coast when wind clocks west. Best Cycladic gastronomy of the route.',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest swim)',
      ],
      mooringTip:
        'Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night). Switch to Platys Gialos south coast when wind clocks west.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kamares.webp', alt: 'Kamares' }],
    },
    {
      id: 'sifnos-serifos',
      routeFrom: 'Sifnos',
      routeTo: 'Serifos (Koutalas Beach)',
      day: 4,
      mapPin: {
        desktop: { left: 41.5, top: 57.8 },
        mobile: { left: 37.9, top: 57.2 },
      },
      description:
        'Short 14 nm hop north to Serifos. Koutalas Bay on the south coast is the day-anchor for swim and snorkel — sheltered from N Meltemi by the headland. Move to Livadi for the overnight: the main port on the south coast funnels the Meltemi but holds well on sand. Drag is the most common Serifos charter incident — set anchor with long scope, dive to verify, stay aboard for the first hour after mooring. Chora is a 30-minute donkey-path climb above the harbour.',
      shortDescription:
        '14 nm hop north to Serifos. Day-anchor at Koutalas (sheltered from N), overnight at Livadi. Livadi funnels the Meltemi — long scope and dive the anchor before going ashore.',
      thingsToDo: [
        'Walk the donkey path up to Chora',
        'Revithada chickpea stew in a kafeneio',
        'Swim Psili Ammos beach (south coast)',
        'Sunset at the windmills above Chora',
      ],
      mooringTip:
        'Day-anchor at Koutalas on sand at 5-7 m. Overnight in Livadi Bay anchored on sand at 5-8 m, long scope mandatory, or stern-to on town quay €20-30/night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/serifos.webp', alt: 'Serifos' }],
    },
    {
      id: 'serifos-kythnos',
      routeFrom: 'Serifos',
      routeTo: 'Kythnos (Merichas Harbor)',
      day: 5,
      mapPin: {
        desktop: { left: 30.6, top: 46.5 },
        mobile: { left: 25.2, top: 45.8 },
      },
      description:
        '15 nm north back to Kythnos, this time to Merichas on the west coast — small ferry port, family tavernas on the quay, an easier mooring than the Kolona anchorage if winds are forecast to build. Day-anchor at Apokrousi cove for lunch (sheltered from N), then move to Merichas for the overnight. Walk up to Chora for the panoramic ridge views; the road from Merichas to Chora is one of the prettier rural drives in the western Cyclades.',
      shortDescription:
        '15 nm north back to Kythnos (Merichas). Day-anchor lunch at Apokrousi, overnight at Merichas. Easier mooring than Kolona if winds are forecast to build over 25 kn.',
      thingsToDo: [
        'Day-anchor lunch at Apokrousi cove',
        'Walk Merichas-Chora ridge road',
        'Soak in Loutra hot springs (taxi)',
        'Sunset drinks at the Merichas pier',
      ],
      mooringTip:
        'Stern-to in Merichas town quay, €20-30/night. Sheltered from N Meltemi. Loutra (north coast) is the alternative for thermal springs; Merichas closer for sailing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-lavrion',
      routeFrom: 'Kythnos',
      routeTo: 'Lavrion',
      day: 6,
      mapPin: {
        desktop: { left: 26.3, top: 36.2 },
        mobile: { left: 22.7, top: 34.8 },
      },
      description:
        "Final leg back — 22 nm northwest to Lavrion. Stop at Cape Sounion on the way for a last anchor swim under Poseidon's temple (anchorage 0.5 nm offshore on sand at 5-8 m, sheltered from N). Refuel at the Lavrion fuel berth before tying up so the boat is handover-ready. The Lavrion Olympic Marina base typically wants the boat in by 17:00 the day before official handover.",
      shortDescription:
        '22 nm northwest back to Lavrion. Last swim stop at Cape Sounion under Poseidon temple (0.5 nm offshore, sand, sheltered from N). Refuel before mooring at Lavrion.',
      thingsToDo: [
        'Last swim under the Cape Sounion temple',
        'Refuel and clean the boat at Lavrion',
        'Crew dinner at a Lavrion harbourside taverna',
        'Souvenir-stop in Lavrion town',
      ],
      mooringTip:
        'Lavrion Olympic Marina stern-to with lazy lines, €60-90/night. Refuel at the entrance fuel berth before mooring. Confirm handover slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lavrion.webp', alt: 'Lavrion' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Lavrion',
      routeTo: 'Check Out',
      day: 7,
      description:
        'Handover at Lavrion before 09:00. Boat inspection with the skipper present — deposit released within 7 days. Crew transfer to Athens airport is roughly 50 minutes by road, plus traffic. Coffee at a Lavrion harbour kafeneio before goodbyes. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and tip the dock crew if service was good.',
      shortDescription:
        'Handover before 09:00 at Lavrion. Inspection, deposit release within 7 days. Airport transfer 50 minutes plus traffic — leave 90 in Friday peak. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and coffee at a Lavrion harbour kafeneio.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Coffee at a Lavrion harbour kafeneio',
        'Airport transfer (50 min from Lavrion)',
        'Tip the dock crew if service was good',
      ],
      mooringTip:
        'Hand over at Lavrion before 09:00. Deposit released within 7 days post-inspection. Photo evidence of any noted damage before signing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/map.webp',
        alt: 'Lavrion Kea Kythnos Sifnos Route Image',
      },
      width: 1147,
      height: 1103,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/mobile-map.webp',
        alt: 'Lavrion Kea Kythnos Sifnos Route Image',
      },
      width: 1032,
      height: 1165,
    },
  },
};

export default computeItineraryNumberOfDays(lavrionKeaKythnosSifnosRoute);
