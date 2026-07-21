import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const parosNaxosSchoinousaRoute: ItineraryRoute = {
  metaTitle: 'Paros–Naxos–Schoinousa Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Paros via Naxos, Donousa, Koufonissi, Schoinousa and Irakleia. Central + Small Cyclades loop with the quietest anchorages on the Aegean charter map.',
  id: 'paros-naxos-schoinousa',
  startingPoint: 'Paros',
  otherPoints: ['Naxos', 'Schoinousa'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/paros-naxos-schoinousa.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/naxos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/koufonissi-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/naxos-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/paros-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'paros-naxos',
      routeFrom: 'Paros',
      routeTo: 'Naxos',
      day: 1,
      mapPin: {
        desktop: { left: 48.4, top: 43.1 },
        mobile: { left: 49.2, top: 41.4 },
      },
      description:
        'Short 6 nm shake-down hop east across the Naxos-Paros channel. Naxos town harbour is well-protected and stern-to is reliable. The Portara — a single marble doorway from the unfinished 6th-century BC Apollo temple — sits on the islet at the harbour entrance and is the headline sunset spot.',
      shortDescription:
        '6 nm short shake-down hop east to Naxos. Town harbour well-protected; Portara marble doorway is the headline sunset spot. Stern-to in Naxos town harbour, €30-50/night. Plan to hike Mount Zas (Zeus birthplace, 4 h) and kitro citron liqueur tasting at Halki.',
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
        desktop: { left: 60.5, top: 40.5 },
        mobile: { left: 63.1, top: 40.3 },
      },
      description:
        '24 nm east-southeast to Donousa — most remote populated Small Cyclades island, 100 year-round residents. Stavros harbour on the southwest is small and sheltered; anchor in the bay outside if the quay is full. Kedros Beach south of the village is the headline swim, sand and turquoise water, sheltered from N.',
      shortDescription:
        '24 nm ESE to Donousa — most remote Small Cyclades, 100 residents. Stavros harbour or anchor in bay outside. Kedros Beach for the swim. Stern-to in Stavros harbour, €15-25/night, limited slots; Sheltered from N Meltemi.',
      thingsToDo: [
        'Swim Kedros Beach (south of village)',
        'Hike to Kalotaritissa stone village',
        'Snorkel the Cave of the Wall',
        'Grilled gouna sun-dried mackerel at a beach shack',
      ],
      mooringTip:
        'Stern-to in Stavros harbour, €15-25/night, limited slots. Anchor in the bay outside on sand at 5-7 m. Sheltered from N Meltemi.',
      gallery: [{ src: '/images/itinerary/greece/destinations/donoussa.webp', alt: 'Donoussa' }],
    },
    {
      id: 'donoussa-koufonissi',
      routeFrom: 'Donoussa',
      routeTo: 'Koufonissi',
      day: 3,
      mapPin: {
        desktop: { left: 82.5, top: 40 },
        mobile: { left: 85.2, top: 39.2 },
      },
      description:
        '15 nm southwest to Koufonissi — boutique-yachting hub of the Small Cyclades. Pano Koufonissi (the inhabited island) has the quay; Kato Koufonissi (uninhabited) is the day-anchor for the Pori Beach turquoise lagoon swim. Astakomakaronada (lobster spaghetti) is the local speciality.',
      shortDescription:
        '15 nm SW to Koufonissi — boutique hub of the Small Cyclades. Pano for village/quay; day-anchor at uninhabited Kato Koufonissi for Pori lagoon swim. Highlights: Day-anchor swim at Pori Beach lagoon and Snorkel the cliff caves on the southeast coast.',
      thingsToDo: [
        'Day-anchor swim at Pori Beach lagoon',
        'Snorkel the cliff caves on the southeast coast',
        'Astakomakaronada lobster spaghetti at the harbour',
        'Walk Pano Koufonissi white-washed alleys',
      ],
      mooringTip:
        'Pano Koufonissi harbour stern-to, €25-40/night, slots fill by 17:00. Anchor on sand at 4-7 m east of the village if full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/koufonissi.webp', alt: 'Koufonissi' }],
    },
    {
      id: 'koufonissi-schoinousa',
      routeFrom: 'Koufonissi',
      routeTo: 'Schoinousa (Mirsini Harbor)',
      day: 4,
      mapPin: {
        desktop: { left: 90.8, top: 54.2 },
        mobile: { left: 95.2, top: 49.6 },
      },
      description:
        '5 nm short hop west to Schoinousa — quietest of the populated Small Cyclades, 200 residents. Mersini harbour at the foot, Chora village on the hill above. Tsigouri Beach is the headline swim — sandy, shallow, sheltered from N. Stern-to in Mersini harbour, €15-25/night, limited slots. Anchor on sand at 4-6 m east of the harbour. Sheltered from N. Plan to swim Tsigouri Beach (sheltered from N), walk up to Chora hilltop village, tomato keftedes under a tamarisk tree.',
      shortDescription:
        '5 nm short hop west to Schoinousa — 200 residents. Mersini harbour at the foot, Chora hilltop village above. Tsigouri Beach for the swim. Stern-to in Mersini harbour, €15-25/night, limited slots; Anchor on sand at 4-6 m east of the harbour.',
      thingsToDo: [
        'Swim Tsigouri Beach (sheltered from N)',
        'Walk up to Chora hilltop village',
        'Tomato keftedes under a tamarisk tree',
        'Hike to Panagia mountain church',
      ],
      mooringTip:
        'Stern-to in Mersini harbour, €15-25/night, limited slots. Anchor on sand at 4-6 m east of the harbour. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/schoinousa.webp', alt: 'Schoinousa' }],
    },
    {
      id: 'schoinousa-irakleia',
      routeFrom: 'Schoinousa',
      routeTo: 'Irakleia',
      day: 5,
      mapPin: {
        desktop: { left: 71.8, top: 51.9 },
        mobile: { left: 77.8, top: 49.6 },
      },
      description:
        '7 nm west to Irakleia — population 100, one taverna at Agios Georgios harbour, single road, the Blue Cave a 30-minute hike from the village. Quietest island stop on the Cycladic charter circuit. If a panigiri (saint-day festival) coincides, the entire village joins.',
      shortDescription:
        '7 nm west to Irakleia — 100 residents, single taverna, single road. Quietest Cycladic stop. Blue Cave 30-min hike from village. Anchor in Agios Georgios bay on sand at 5-7 m; Sheltered from N Meltemi; Small quay slots €15-25/night, lazy lines absent.',
      thingsToDo: [
        'Hike to the Blue Cave (30 min from village)',
        'Beach swim at Livadi (best swim water in Small Cyclades)',
        'Grilled gouna at the harbour taverna',
        'Walk the kastro pirate-era ruins',
      ],
      mooringTip:
        'Anchor in Agios Georgios bay on sand at 5-7 m. Sheltered from N Meltemi. Small quay slots €15-25/night, lazy lines absent.',
      gallery: [{ src: '/images/itinerary/greece/destinations/irakleia.webp', alt: 'Irakleia' }],
    },
    {
      id: 'irakleia-paros',
      routeFrom: 'Irakleia',
      routeTo: 'Paros',
      day: 6,
      mapPin: {
        desktop: { left: 67.4, top: 57 },
        mobile: { left: 70, top: 50.4 },
      },
      description:
        '20 nm west back to Paros. Optional snorkel detour to the Antiparos Cave (south coast of Antiparos, 0.5 nm short of the cave entrance). Naoussa for the photogenic fishing harbour overnight; Parikia for easier mooring. Last evening dinner on the Naoussa pier with octopus drying on the rope at the centre of the village.',
      shortDescription:
        '20 nm west back to Paros. Optional Antiparos Cave snorkel detour. Naoussa for photogenic harbour or Parikia for easier mooring. Dinner on the Naoussa pier.',
      thingsToDo: [
        'Snorkel the Antiparos Cave detour',
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
      routeTo: 'Paros (Check Out)',
      day: 7,
      mapPin: {
        desktop: { left: 63.9, top: 59 },
        mobile: { left: 56.9, top: 57.7 },
      },
      description:
        'Handover at Parikia or Naoussa before 09:00. Boat inspection — deposit released within 7 days. Crew transfer to Paros airport (PAS) is 15 minutes from Parikia. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and last swim at Golden Beach (south coast).',
      shortDescription:
        'Handover before 09:00 at Parikia or Naoussa. Inspection, deposit release within 7 days. PAS airport 15 min from Parikia. Hand over before 09:00. Plan to final inspection with the base manager and last swim at Golden Beach (south coast).',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Golden Beach (south coast)',
        'Breakfast on the Parikia portside',
        'Airport transfer (15 min to PAS)',
      ],
      mooringTip:
        'Hand over before 09:00. Deposit released within 7 days post-inspection. Photo evidence of any noted damage before signing.',
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

export default computeItineraryNumberOfDays(parosNaxosSchoinousaRoute);
