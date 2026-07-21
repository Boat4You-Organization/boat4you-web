import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const parosMilosSantoriniSyros14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Paros–Milos–Santorini–Syros Yacht Route | Boat4You',
  metaDesc:
    'Sail a 14-day yacht charter from Paros via Naxos, Donousa, Amorgos, Small Cyclades, Santorini, Milos, Sifnos, Kythnos and Syros. Cyclades grand tour from Paros base.',
  id: 'paros-ios-santorini-14-days',
  startingPoint: 'Paros',
  otherPoints: ['Milos', 'Santorini', 'Syros (14 days)'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/paros-milos-santorini-syros-14-days.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/santorini-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/milos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/syros-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/serifos-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'paros-naxos',
      routeFrom: 'Paros',
      routeTo: 'Naxos',
      day: 1,
      mapPin: {
        desktop: { left: 49.4, top: 42.2 },
        mobile: { left: 48.3, top: 41.9 },
      },
      description:
        '6 nm shake-down hop east to Naxos. Town harbour well-protected and stern-to is reliable. Portara marble doorway from the unfinished 6th-century BC Apollo temple is the headline sunset spot at the islet on the harbour entrance. Stern-to in Naxos town harbour, €30-50/night. Plan to hike Mount Zas (Zeus birthplace, 4 h) and kitro citron liqueur tasting at Halki.',
      shortDescription:
        '6 nm shake-down hop east to Naxos. Well-protected town harbour, reliable stern-to. Portara marble doorway is the headline sunset. Well-protected from any wind direction. Plan to hike Mount Zas (Zeus birthplace, 4 h) and kitro citron liqueur tasting at Halki.',
      thingsToDo: [
        'Sunset at the Portara marble doorway',
        'Hike Mount Zas (Zeus birthplace, 4 h)',
        'Kitro citron liqueur tasting at Halki',
        'Swim Agios Prokopios Beach',
      ],
      mooringTip:
        'Stern-to in Naxos town harbour, €30-50/night. Well-protected from any wind direction. Plenty of slot capacity even in peak season.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Naxos' }],
    },
    {
      id: 'naxos-donoussa',
      routeFrom: 'Naxos',
      routeTo: 'Donoussa',
      day: 2,
      mapPin: {
        desktop: { left: 62.4, top: 40 },
        mobile: { left: 62.2, top: 41 },
      },
      description:
        '24 nm east-southeast to Donousa — most remote populated Small Cyclades, 100 residents. Stavros harbour or anchor in the bay outside. Kedros Beach south of village is the headline swim. Stern-to in Stavros harbour, €15-25/night, limited slots. Plan to hike to Kalotaritissa stone village and snorkel the Cave of the Wall.',
      shortDescription:
        '24 nm ESE to Donousa — most remote Small Cyclades, 100 residents. Stavros quay or anchor in bay outside. Stern-to in Stavros harbour, €15-25/night, limited slots. Plan to swim Kedros Beach (south of village) and hike to Kalotaritissa stone village.',
      thingsToDo: [
        'Swim Kedros Beach (south of village)',
        'Hike to Kalotaritissa stone village',
        'Snorkel the Cave of the Wall',
        'Grilled gouna sun-dried mackerel at a beach shack',
      ],
      mooringTip:
        'Stern-to in Stavros harbour, €15-25/night, limited slots. Anchor in bay outside on sand at 5-7 m. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/donoussa.webp', alt: 'Donoussa' }],
    },
    {
      id: 'donoussa-amorgos',
      routeFrom: 'Donoussa',
      routeTo: 'Amorgos (Aegiali Harbor)',
      day: 3,
      mapPin: {
        desktop: { left: 81.9, top: 40 },
        mobile: { left: 86.3, top: 39.9 },
      },
      description:
        '15 nm southeast to Amorgos. Cliff-clinging Hozoviotissa Monastery (1088 AD) is the headline excursion — 300 steps up the cliff face from the road. Aegiali sheltered from N; Katapola south for S wind. Katapola south alternative for S wind. Plan to dive the Olympia shipwreck off Liveros and psimeni raki and goat in a Tholaria taverna.',
      shortDescription:
        '15 nm SE to Amorgos. Hozoviotissa monastery (cliff-side, 1088 AD) is the headline shore excursion. Aegiali sheltered N; Katapola for S wind. Highlights: Climb to cliff-clinging Hozoviotissa monastery and Dive the Olympia shipwreck off Liveros.',
      thingsToDo: [
        'Climb to cliff-clinging Hozoviotissa monastery',
        'Dive the Olympia shipwreck off Liveros',
        'Psimeni raki and goat in a Tholaria taverna',
        'Hike Aegiali-Tholaria ridge path',
      ],
      mooringTip: 'Aegiali stern-to, €25-40/night, sheltered from N. Katapola south alternative for S wind.',
      gallery: [{ src: '/images/itinerary/greece/destinations/amorgos.webp', alt: 'Amorgos' }],
    },
    {
      id: 'amorgos-koufonissi',
      routeFrom: 'Amorgos',
      routeTo: 'Koufonissi',
      day: 4,
      mapPin: {
        desktop: { left: 90.4, top: 54.9 },
        mobile: { left: 93.8, top: 48.4 },
      },
      description:
        '15 nm WSW to Koufonissi — boutique-yachting hub of Small Cyclades. Pano Koufonissi for the village/quay; day-anchor at uninhabited Kato Koufonissi for Pori Beach turquoise lagoon. Pano Koufonissi harbour stern-to, €25-40/night, slots fill by 17:00. Plan to snorkel cliff caves on the southeast coast and astakomakaronada lobster spaghetti at the harbour.',
      shortDescription:
        '15 nm WSW to Koufonissi — boutique hub. Pano Koufonissi for quay; day-anchor at Kato Koufonissi for Pori lagoon swim. Pano Koufonissi harbour stern-to, €25-40/night, slots fill by 17:00. Plan to snorkel cliff caves on the southeast coast and astakomakaronada lobster spaghetti at the harbour.',
      thingsToDo: [
        'Day-anchor swim at Pori Beach lagoon',
        'Snorkel cliff caves on the southeast coast',
        'Astakomakaronada lobster spaghetti at the harbour',
        'Walk Pano Koufonissi white-washed alleys',
      ],
      mooringTip:
        'Pano Koufonissi harbour stern-to, €25-40/night, slots fill by 17:00. Anchor on sand at 4-7 m east of village if full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/koufonissi.webp', alt: 'Koufonissi' }],
    },
    {
      id: 'koufonissi-schoinousa',
      routeFrom: 'Koufonissi',
      routeTo: 'Schoinousa',
      day: 5,
      mapPin: {
        desktop: { left: 72.5, top: 51.9 },
        mobile: { left: 74.6, top: 48.3 },
      },
      description:
        '5 nm short hop west to Schoinousa — quietest of populated Small Cyclades, 200 residents. Mersini harbour at the foot, Chora hilltop village. Tsigouri Beach for the swim. Stern-to in Mersini harbour, €15-25/night, limited slots. Anchor on sand at 4-6 m east. Sheltered from N. Plan to swim Tsigouri Beach (sheltered from N), walk up to Chora hilltop village, tomato keftedes under a tamarisk tree.',
      shortDescription:
        '5 nm short hop west to Schoinousa — 200 residents. Mersini harbour at the foot, Chora hilltop above. Tsigouri Beach swim. Stern-to in Mersini harbour, €15-25/night, limited slots; Anchor on sand at 4-6 m east; Sheltered from N.',
      thingsToDo: [
        'Swim Tsigouri Beach (sheltered from N)',
        'Walk up to Chora hilltop village',
        'Tomato keftedes under a tamarisk tree',
        'Hike to Panagia mountain church',
      ],
      mooringTip:
        'Stern-to in Mersini harbour, €15-25/night, limited slots. Anchor on sand at 4-6 m east. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/schoinousa.webp', alt: 'Schoinousa' }],
    },
    {
      id: 'schoinousa-irakleia',
      routeFrom: 'Schoinousa',
      routeTo: 'Irakleia',
      day: 6,
      mapPin: {
        desktop: { left: 67.9, top: 55.8 },
        mobile: { left: 69.1, top: 50.3 },
      },
      description:
        '7 nm west to Irakleia. Population 100, one taverna, single road, the Blue Cave 30 minutes hike from village. Quietest island stop in the Cyclades charter circuit. Anchor in Agios Georgios bay on sand at 5-7 m. Sheltered from N. Small quay slots €15-25/night, lazy lines absent. Plan to hike to the Blue Cave (30 min from village), beach swim at Livadi (best swim water in Small Cyclades), grilled gouna at the harbour taverna.',
      shortDescription:
        '7 nm west to Irakleia — 100 residents, single taverna, single road. Quietest Cycladic stop. Anchor in Agios Georgios bay on sand at 5-7 m; Sheltered from N; Small quay slots €15-25/night, lazy lines absent.',
      thingsToDo: [
        'Hike to the Blue Cave (30 min from village)',
        'Beach swim at Livadi (best swim water in Small Cyclades)',
        'Grilled gouna at the harbour taverna',
        'Walk the kastro pirate-era ruins',
      ],
      mooringTip:
        'Anchor in Agios Georgios bay on sand at 5-7 m. Sheltered from N. Small quay slots €15-25/night, lazy lines absent.',
      gallery: [{ src: '/images/itinerary/greece/destinations/irakleia.webp', alt: 'Irakleia' }],
    },
    {
      id: 'irakleia-santorini',
      routeFrom: 'Irakleia',
      routeTo: 'Santorini (Vlychada Marina)',
      day: 7,
      mapPin: {
        desktop: { left: 63.6, top: 58.8 },
        mobile: { left: 63.8, top: 52 },
      },
      description:
        '32 nm south through the Naxos-Sikinos-Ios channel — Meltemi reach. Optional swim stop at Manganari Bay on Ios. Vlychada Marina arrival before 17:00 — caldera deserves daylight, anchoring impossible (300+ m). Book ahead in peak season. Plan to taxi to Oia for the cliff-top sunset and wine tasting at Santo Wines or Domaine Sigalas.',
      shortDescription:
        '32 nm south reach to Santorini. Optional Manganari swim stop on Ios. Vlychada Marina by 17:00; caldera unanchorable. Book ahead in peak season. Plan to taxi to Oia for the cliff-top sunset and wine tasting at Santo Wines or Domaine Sigalas.',
      thingsToDo: [
        'Taxi to Oia for the cliff-top sunset',
        'Wine tasting at Santo Wines or Domaine Sigalas',
        'Swim Red Beach (south coast access)',
        'Caldera-edge fava with capers in Megalochori',
      ],
      mooringTip:
        'Vlychada Marina stern-to, €60-100/night. Book ahead in peak season. Caldera 300+ m deep — anchoring impossible.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vlychada.webp', alt: 'Vlychada' }],
    },
    {
      id: 'santorini-folegandros',
      routeFrom: 'Santorini',
      routeTo: 'Folegandros',
      day: 8,
      mapPin: {
        desktop: { left: 56.3, top: 66.8 },
        mobile: { left: 57.1, top: 58.6 },
      },
      description:
        '22 nm upwind northwest to Folegandros — first true upwind leg, Meltemi on the bow. Karavostasi sheltered from N, exposed S. Cliff-top Chora is a 30-minute kalderimi climb above the harbour. Karavostasi stern-to, €25-40/night, limited slots. Anchor in bay east of port on sand at 4-7 m if full. Avoid in S winds. Plan to taxi up to Chora for the cliff-edge Panagia church, swim Katergo Bay (boat-only access), matsata pasta with goat ragù in a courtyard.',
      shortDescription:
        '22 nm upwind NW to Folegandros — first upwind leg. Karavostasi sheltered N, exposed S. Chora is a kalderimi climb above the harbour. Karavostasi stern-to, €25-40/night, limited slots; Anchor in bay east of port on sand at 4-7 m if full.',
      thingsToDo: [
        'Taxi up to Chora for the cliff-edge Panagia church',
        'Swim Katergo Bay (boat-only access)',
        'Matsata pasta with goat ragù in a courtyard',
        'Walk the kalderimi path to Ano Meria',
      ],
      mooringTip:
        'Karavostasi stern-to, €25-40/night, limited slots. Anchor in bay east of port on sand at 4-7 m if full. Avoid in S winds.',
      gallery: [{ src: '/images/itinerary/greece/destinations/folegandros.webp', alt: 'Folegandros' }],
    },
    {
      id: 'folegandros-milos',
      routeFrom: 'Folegandros',
      routeTo: 'Milos',
      day: 9,
      mapPin: {
        desktop: { left: 62.1, top: 89.3 },
        mobile: { left: 64.3, top: 75.1 },
      },
      description:
        '20 nm upwind northwest to Milos. Adamas Bay at the head of the long inlet is the most sheltered overnight in the western Cyclades. Sarakiniko swim only in calm wind. Stern-to in Adamas town quay, €30-50/night. Excellent shelter in any direction. Pollonia northeast cheaper but exposed in N. Plan to swim stop at lunar Sarakiniko cliffs, snorkel Papafragas sea caves, visit Plaka Castle for the panorama.',
      shortDescription:
        '20 nm upwind NW to Milos. Adamas Bay most sheltered in western Cyclades. Sarakiniko swim in calm wind. Stern-to in Adamas town quay, €30-50/night; Excellent shelter in any direction; Pollonia northeast cheaper but exposed in N.',
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
      routeTo: 'Sifnos',
      day: 10,
      mapPin: {
        desktop: { left: 36.4, top: 74.1 },
        mobile: { left: 33.8, top: 62.3 },
      },
      description:
        '18 nm north to Sifnos. Vathi south coast is the calmest swim anchorage; Kamares west coast is the larger paid quay. Switch to Vathi when wind clocks west. Sifnos is the gastronomy island. Switch to Vathi when wind clocks west. Plan to walk to cliffside Chrysopigi monastery at Faros and mastelo lamb in clay pots at Artemonas.',
      shortDescription:
        '18 nm north to Sifnos. Vathi south coast calmest; Kamares west coast for the larger quay. Best Cycladic gastronomy. Highlights: Walk to cliffside Chrysopigi monastery at Faros and Mastelo lamb in clay pots at Artemonas.',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
      ],
      mooringTip:
        'Anchor on sand at 4-6 m in Vathi (sheltered) or stern-to on Kamares quay €20-30/night. Switch to Vathi when wind clocks west.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vathi.webp', alt: 'Vathi' }],
    },
    {
      id: 'sifnos-serifos-kythnos',
      routeFrom: 'Sifnos',
      routeTo: 'Kythnos (Loutra)',
      day: 11,
      mapPin: {
        desktop: { left: 12.9, top: 68.7 },
        mobile: { left: 8.1, top: 58.3 },
      },
      description:
        '32 nm north via Serifos to Kythnos. Optional Serifos lunch swim at Vagia Beach (sheltered from S) on the way. Loutra harbour has natural thermal springs flowing in. Long upwind day, plan two long port tacks. Stern-to in Loutra harbour, €25-40/night with lazy lines. Sheltered from N. Merichas west coast is the alternative. Plan to soak in Loutra natural thermal springs, optional Serifos lunch swim at Vagia, anchor swim at the Kolona sandbar (detour).',
      shortDescription:
        '32 nm long upwind north via Serifos to Kythnos. Optional Serifos lunch swim. Loutra harbour with natural thermal springs. Stern-to in Loutra harbour, €25-40/night with lazy lines. Plan to anchor swim at the Kolona sandbar (detour) and sfougato cheese pie at a Driopida taverna.',
      thingsToDo: [
        'Soak in Loutra natural thermal springs',
        'Optional Serifos lunch swim at Vagia',
        'Anchor swim at the Kolona sandbar (detour)',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Stern-to in Loutra harbour, €25-40/night with lazy lines. Sheltered from N. Merichas west coast is the alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-syros-paros',
      routeFrom: 'Kythnos',
      routeTo: 'Syros',
      day: 12,
      mapPin: {
        desktop: { left: 26.2, top: 50.3 },
        mobile: { left: 23.1, top: 45.2 },
      },
      description:
        '32 nm east-southeast to Syros — long beam reach in Meltemi. Ermoupoli town quay is the most forgiving stern-to in the Cyclades. The capital climbs the slope above in pastel neoclassical layers. Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any direction. Manna marina €60-80/night if full. Plan to climb Ano Syros for the Catholic quarter, loukoumi tasting at a 19th-century confectionery, walk Miaouli marble square at dusk.',
      shortDescription:
        '32 nm long beam reach ESE to Syros. Ermoupoli town quay is the most forgiving stern-to in the Cyclades. Excellent shelter in any direction. Plan to climb Ano Syros for the Catholic quarter and loukoumi tasting at a 19th-century confectionery.',
      thingsToDo: [
        'Climb Ano Syros for the Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim the rock platforms at Asteria Beach',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any direction. Manna marina €60-80/night if full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-final',
      routeFrom: 'Syros',
      routeTo: 'Paros',
      day: 13,
      mapPin: {
        desktop: { left: 14.4, top: 35 },
        mobile: { left: 12.1, top: 36.6 },
      },
      description:
        '24 nm southeast back to Paros — beam-reach leg in Meltemi. Naoussa for the photogenic fishing-harbour overnight; Parikia for easier mooring. Last evening dinner on the Naoussa pier. Plastira Bay 0.5 nm east on sand at 5-7 m. Plan to snorkel the moon-rock outcrops at Kolymbithres and octopus on the rope at a Naoussa pier taverna.',
      shortDescription:
        '24 nm SE back to Paros — beam reach in Meltemi. Naoussa for the photogenic harbour or Parikia for easier mooring. Plastira Bay 0; 5 nm east on sand at 5-7 m; Parikia is the larger alternative.',
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
      id: 'checkout',
      routeFrom: 'Paros',
      routeTo: 'Check-out',
      day: 14,
      mapPin: {
        desktop: { left: 13, top: 19.9 },
        mobile: { left: 7.6, top: 25.2 },
      },
      description:
        'Handover at Parikia or Naoussa before 09:00. Boat inspection — deposit released within 7 days. Crew transfer to Paros airport (PAS) is 15 minutes from Parikia. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Golden Beach.',
      shortDescription:
        'Handover before 09:00. Inspection, deposit release within 7 days. PAS airport 15 min from Parikia. Deposit released within 7 days post-inspection. Plan to final inspection with the base manager and last swim at Golden Beach. Plan to breakfast on the Parikia portside and airport transfer (15 min to PAS).',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Golden Beach',
        'Breakfast on the Parikia portside',
        'Airport transfer (15 min to PAS)',
      ],
      mooringTip: 'Hand over at Parikia or Naoussa before 09:00. Deposit released within 7 days post-inspection.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
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

export default computeItineraryNumberOfDays(parosMilosSantoriniSyros14DaysRoute);
