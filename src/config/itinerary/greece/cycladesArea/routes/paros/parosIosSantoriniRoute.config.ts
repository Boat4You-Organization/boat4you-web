import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const parosIosSantoriniRoute: ItineraryRoute = {
  metaTitle: 'Paros → Ios → Santorini Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Paros via Ios and Santorini, returning through Folegandros and Sifnos. Compact southern Cyclades loop for confident-Meltemi crews.',
  id: 'paros-ios-santorini',
  startingPoint: 'Paros',
  otherPoints: ['Ios', 'Santorini'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/paros-ios-santorini.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/santorini-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/ios-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/sifnos-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/paros-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'paros-ios',
      routeFrom: 'Paros',
      routeTo: 'Ios (Ormos)',
      day: 1,
      mapPin: {
        desktop: { left: 50.1, top: 43 },
        mobile: { left: 49, top: 40.7 },
      },
      description:
        'Cast off from Parikia after the lunchtime provisioning run and head south on the Meltemi reach. 22 nm to Ios — the Naxos-Sikinos channel is the breeziest part of the leg, expect 22-30 knots steady on a port-tack reach. Reef early. Ormos harbour at the south end of Ios is sheltered and has stern-to slots; the new marina is undergoing expansion. Mylopotas Bay 1 nm south is the standard daytime swim anchorage but unsafe overnight in Meltemi.',
      shortDescription:
        '22 nm south to Ios on Meltemi reach — strongest wind day of the route. Reef early, plan to be inside Ormos by 16:00. Mylopotas swim is daytime only.',
      thingsToDo: [
        'Hike to the supposed tomb of Homer above Plakotos',
        'Swim Manganari Bay (south coast)',
        'Late-night Chora rembetika square',
        'Sunset drinks above the windmills',
      ],
      mooringTip:
        'Ormos harbour stern-to, €25-40/night. New marina slots when available are pre-bookable. Mylopotas anchorage daytime only.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ios.webp', alt: 'Ios' }],
    },
    {
      id: 'ios-santorini',
      routeFrom: 'Ios',
      routeTo: 'Santorini (Vlychada Marina)',
      day: 2,
      mapPin: {
        desktop: { left: 54.3, top: 67.1 },
        mobile: { left: 56.6, top: 58 },
      },
      description:
        'Short 18 nm south to Santorini. Caldera entry deserves daylight and a calm wind window — leave Ios at first light, be at Vlychada by lunchtime. The caldera itself is unanchorable (depth 300+ m); Vlychada Marina on the south coast is the only practical overnight. Taxi to Oia in the late afternoon for the cliff-top sunset; the famous viewpoint above Ammoudi Bay fills with crowds from 18:00.',
      shortDescription:
        '18 nm south to Santorini — leave Ios at first light. Vlychada Marina is the only practical overnight; caldera is 300+ m deep, unanchorable. Taxi up to Oia for sunset.',
      thingsToDo: [
        'Taxi to Oia for the cliff-top sunset',
        'Wine tasting at Santo Wines or Domaine Sigalas',
        'Swim off Red Beach (south coast)',
        'Caldera-edge fava with capers in Megalochori',
      ],
      mooringTip:
        'Vlychada Marina stern-to, €60-100/night. Book ahead in peak season. Cruise-ship buoys off Thirasia are an unreliable alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vlychada.webp', alt: 'Vlychada' }],
    },
    {
      id: 'santorini-folegandros',
      routeFrom: 'Santorini',
      routeTo: 'Folegandros (Katergo Islet)',
      day: 3,
      mapPin: {
        desktop: { left: 61.7, top: 93.3 },
        mobile: { left: 61.4, top: 73.7 },
      },
      description:
        'Turn west for the return loop. 22 nm northwest to Folegandros — first true upwind leg, Meltemi on the bow. Day-anchor at Katergo Bay (boat-only access, sheltered from N) for a swim before mooring. Karavostasi is the only practical port; small, sheltered from N, exposed S. Cliff-top Chora is a 30-minute climb up the kalderimi or a taxi from the harbour.',
      shortDescription:
        '22 nm upwind northwest to Folegandros — first upwind leg, Meltemi on the bow. Day-anchor at Katergo for the swim, overnight at Karavostasi. Sheltered from N, exposed S.',
      thingsToDo: [
        'Swim Katergo Bay (boat-only access)',
        'Taxi up to Chora for the cliff-edge Panagia church',
        'Matsata pasta with goat ragù in a courtyard',
        'Walk the kalderimi path to Ano Meria',
      ],
      mooringTip:
        'Karavostasi stern-to, €25-40/night, limited slots. Anchor in the bay east of port on sand at 4-7 m if full. Avoid in S winds.',
      gallery: [{ src: '/images/itinerary/greece/destinations/folegandros.webp', alt: 'Folegandros' }],
    },
    {
      id: 'folegandros-karavostasi',
      routeFrom: 'Folegandros (Katergo)',
      routeTo: 'Karavostasi Harbor',
      day: 4,
      mapPin: {
        desktop: { left: 36.3, top: 74.7 },
        mobile: { left: 34.6, top: 62 },
      },
      description:
        'Lay-day on Folegandros. Morning at Katergo (anchor 4-7 m on sand, sheltered from N), afternoon ashore. Cliff-top Chora is the headline activity — 200 m above the harbour, accessed by taxi or the kalderimi up. Walk along the cliff edge from Chora to Panagia church for the panorama back across the caldera. Lunch at one of the courtyard tavernas in the village; the cheese-and-honey pies here are the local speciality.',
      shortDescription:
        'Lay-day on Folegandros. Morning swim at Katergo, afternoon walk Chora cliff-edge to Panagia church. Cheese-and-honey pies at a courtyard taverna for lunch. Stay at Karavostasi for the second night, no leg; Day-anchor at Katergo (sheltered N) and at Agali (sheltered N).',
      thingsToDo: [
        'Cliff-edge walk Chora to Panagia church',
        'Swim Agali Beach (south coast)',
        'Cheese-and-honey pies at a Chora taverna',
        'Sunset cocktail above Ano Meria',
      ],
      mooringTip:
        'Stay at Karavostasi for the second night, no leg. Day-anchor at Katergo (sheltered N) and at Agali (sheltered N). Book the harbour slot 24h ahead in peak.',
      gallery: [{ src: '/images/itinerary/greece/destinations/karavostasi.webp', alt: 'Karavostasi' }],
    },
    {
      id: 'folegandros-sifnos',
      routeFrom: 'Folegandros',
      routeTo: 'Sifnos',
      day: 5,
      description:
        '32 nm northwest to Sifnos — long upwind day, plan two long port tacks. Platys Gialos on the south coast is the most reliable overnight when Meltemi is in the standard N quadrant; the wind shadow off the south end of the island gives full shelter. Kamares on the west coast is the alternative when wind clocks east. Sifnos is the gastronomy island of the Cyclades — chickpea revithada cooked overnight in a wood oven, mastelo lamb in clay pots.',
      shortDescription:
        '32 nm long upwind northwest to Sifnos. Two long port tacks in Meltemi. Platys Gialos south coast is the standard overnight in N wind; switch to Kamares when wind clocks east.',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest swim)',
      ],
      mooringTip:
        'Platys Gialos anchorage on sand at 5-8 m, sheltered from N. Kamares quay stern-to, €20-30/night. Vathi south coast is the alternative for E wind.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sifnos.webp', alt: 'Sifnos' }],
    },
    {
      id: 'sifnos-paros',
      routeFrom: 'Sifnos',
      routeTo: 'Paros',
      day: 6,
      mapPin: {
        desktop: { left: 25.1, top: 50.2 },
        mobile: { left: 24.3, top: 46.8 },
      },
      description:
        '20 nm northeast back to Paros. Meltemi on the beam — the easier sailing leg of the return half. Naoussa on the north coast is the headline Cycladic fishing-harbour-turned-yacht-village; the inner harbour mooring slot competition is real, plan to arrive by 16:00 or anchor in Plastira Bay. Parikia on the west coast is the larger alternative if Naoussa is full. Last evening: dinner at one of the Naoussa pier tavernas, octopus dried on the rope at the centre of the village.',
      shortDescription:
        '20 nm northeast back to Paros — Meltemi on the beam, the easiest leg of the return. Naoussa is the headline overnight; Parikia is the larger alternative if full.',
      thingsToDo: [
        'Snorkel the moon-rock outcrops at Kolymbithres',
        'Wine tasting at a Marpissa vineyard',
        'Octopus on the rope at a Naoussa pier taverna',
        'Walk Lefkes village marble paths at dusk',
      ],
      mooringTip:
        'Naoussa harbour stern-to, €30-50/night, often full by 17:00. Plastira Bay 0.5 nm east on sand at 5-7 m. Parikia is the larger alternative.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-checkout',
      routeFrom: 'Paros',
      routeTo: 'Check Out',
      day: 7,
      description:
        'Handover at Parikia or Naoussa before 09:00. Inspection with the skipper present — deposit released within 7 days. Crew transfer to Paros airport (PAS) is 15 minutes from Parikia. Standard last-morning routine: laundry pickup the night before, breakfast at a portside café, last swim off Golden Beach (south coast) before the airport drive.',
      shortDescription:
        'Handover before 09:00 at Parikia. Boat inspection, deposit release within 7 days. Paros airport (PAS) is 15 minutes from Parikia. Last swim at Golden Beach before transfer.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Golden Beach (south coast)',
        'Breakfast on the Parikia portside',
        'Airport transfer (15 min to PAS)',
      ],
      mooringTip:
        'Hand over at Parikia or Naoussa before 09:00. Deposit released within 7 days post-inspection. Confirm any damage notes with photo evidence.',
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

export default computeItineraryNumberOfDays(parosIosSantoriniRoute);
