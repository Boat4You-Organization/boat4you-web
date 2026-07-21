import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const santoriniMilosParosRoute: ItineraryRoute = {
  metaTitle: 'Santorini–Milos–Paros Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Santorini through Ios, Paros, Serifos, Sifnos and Milos and back. Southern + western Cyclades loop combining caldera + lunar volcanic islands.',
  id: 'santorini-milos-paros',
  startingPoint: 'Santorini',
  otherPoints: ['Milos', 'Paros'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/santorini-milos-paros.webp',
    alt: 'athens-saronic-gulf',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/santorini-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/milos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/ios-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/paros-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'santorini-ios',
      routeFrom: 'Santorini (Vlychada Marina)',
      routeTo: 'Ios',
      day: 1,
      mapPin: {
        desktop: { left: 61.5, top: 89 },
        mobile: { left: 62.7, top: 72.6 },
      },
      description:
        '18 nm shake-down north to Ios — first leg out of Vlychada. Ormos harbour at the south end of Ios is sheltered and stern-to is reliable. The new marina is undergoing expansion. Mylopotas Bay 1 nm south is the standard daytime swim anchorage but unsafe overnight in any Meltemi.',
      shortDescription:
        '18 nm shake-down north to Ios — first leg out of Vlychada. Ormos harbour is sheltered. Mylopotas swim is daytime only. Highlights: Hike to the supposed tomb of Homer above Plakotos and Swim Manganari Bay (south coast).',
      thingsToDo: [
        'Hike to the supposed tomb of Homer above Plakotos',
        'Swim Manganari Bay (south coast)',
        'Late-night Chora rembetika square',
        'Sunset drinks above the windmills',
      ],
      mooringTip:
        'Ormos harbour stern-to, €25-40/night. Mylopotas anchorage daytime only — untenable overnight in Meltemi.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ios.webp', alt: 'Ios' }],
    },
    {
      id: 'ios-paros',
      routeFrom: 'Ios',
      routeTo: 'Paros (Parikia Harbor)',
      day: 2,
      mapPin: {
        desktop: { left: 55.8, top: 68.3 },
        mobile: { left: 55.2, top: 57.1 },
      },
      description:
        '28 nm north on Meltemi reach. Naxos-Sikinos channel is the breeziest stretch of the leg — port-tack reach with steady 22-30 knots. Reef early. Parikia harbour is dredged and easier mooring than Naoussa. The 4th-century Panagia Ekatontapiliani sits in the centre of the old town.',
      shortDescription:
        '28 nm north reach on Meltemi to Paros (Parikia). Naxos-Sikinos channel stretch is the breeziest. Reef early. Parikia easier mooring than Naoussa. Naoussa is the alternative for the photogenic fishing-harbour scene. Plan to visit the 4th-century Ekatontapiliani church and sunset off Kolymbithres lunar rocks.',
      thingsToDo: [
        'Visit the 4th-century Ekatontapiliani church',
        'Sunset off Kolymbithres lunar rocks',
        'Wine tasting at a Marpissa vineyard',
        'Walk Parikia old town marble lanes',
      ],
      mooringTip:
        'Stern-to in Parikia harbour, €30-50/night, easier mooring than Naoussa. Naoussa is the alternative for the photogenic fishing-harbour scene.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-serifos',
      routeFrom: 'Paros',
      routeTo: 'Serifos (Livadi)',
      day: 3,
      mapPin: {
        desktop: { left: 49.5, top: 43 },
        mobile: { left: 46.9, top: 42.2 },
      },
      description:
        '32 nm west to Serifos — long beam-reach leg in standard Meltemi. Livadi Bay on the south coast funnels the Meltemi but holds well on sand. Drag is the most common Serifos charter incident — set anchor with long scope, dive to verify.',
      shortDescription:
        '32 nm long beam reach west to Serifos. Livadi Bay funnels the Meltemi — set anchor with long scope and dive to verify. Stern-to on town quay, €20-30/night. Plan to walk the donkey path up to Chora and revithada chickpea stew in a kafeneio.',
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
      id: 'serifos-sifnos',
      routeFrom: 'Serifos',
      routeTo: 'Sifnos (Kamares Harbor)',
      day: 4,
      mapPin: {
        desktop: { left: 14.7, top: 37.2 },
        mobile: { left: 13.1, top: 37.6 },
      },
      description:
        '14 nm short hop south to Sifnos. Kamares Bay on the west coast is the obvious overnight — sheltered from N and NE but opens to W. Switch to Vathi south coast when wind clocks west. Sifnos is the gastronomy island of the Cyclades.',
      shortDescription:
        '14 nm short hop south to Sifnos. Kamares sheltered from N/NE; switch to Vathi south coast when wind clocks west. Best Cycladic gastronomy. Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night).',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
      ],
      mooringTip:
        'Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night). Switch to Vathi south coast when wind clocks west.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kamares.webp', alt: 'Kamares' }],
    },
    {
      id: 'sifnos-milos',
      routeFrom: 'Sifnos',
      routeTo: 'Milos (Adamantas Port)',
      day: 5,
      mapPin: {
        desktop: { left: 26.3, top: 49.1 },
        mobile: { left: 23.2, top: 46.8 },
      },
      description:
        '18 nm south to Milos. The long Milos inlet provides one of the most sheltered overnights in the western Cyclades. Sarakiniko bone-white volcanic moonscape on the way past is the unmissable swim stop, but exposed and only viable in calm wind. Klima fishermen syrmata photo walk ashore.',
      shortDescription:
        '18 nm south to Milos. Adamas Bay at the head of the long inlet is the most sheltered overnight in the western Cyclades. Sarakiniko swim only in calm wind.',
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
      id: 'milos-santorini',
      routeFrom: 'Milos',
      routeTo: 'Santorini (Vlychada Marina)',
      day: 6,
      mapPin: {
        desktop: { left: 10.7, top: 70.8 },
        mobile: { left: 11.5, top: 59.4 },
      },
      description:
        '38 nm long beam-reach southeast back to Santorini. Vlychada Marina arrival before 17:00 for handover-prep evening. Caldera entry deserves daylight; book ahead for the marina slot in peak season. Last evening: taxi to Oia for the cliff-top sunset. Plan to taxi to Oia for the cliff-top sunset, wine tasting at Santo Wines or Domaine Sigalas, swim Red Beach (south coast access).',
      shortDescription:
        '38 nm long beam reach SE back to Santorini. Vlychada arrival before 17:00 for handover-prep. Last-evening Oia cliff-top sunset by taxi. Vlychada Marina stern-to, €60-100/night; Book ahead in peak season; Confirm handover slot 24h ahead with the base.',
      thingsToDo: [
        'Taxi to Oia for the cliff-top sunset',
        'Wine tasting at Santo Wines or Domaine Sigalas',
        'Swim Red Beach (south coast access)',
        'Crew dinner in caldera-edge Megalochori',
      ],
      mooringTip:
        'Vlychada Marina stern-to, €60-100/night. Book ahead in peak season. Confirm handover slot 24h ahead with the base.',
      gallery: [{ src: '/images/itinerary/greece/destinations/vlychada.webp', alt: 'Vlychada' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Paros',
      routeTo: 'Santorini (Check Out)',
      day: 7,
      description:
        'Handover at Vlychada before 09:00. Boat inspection — deposit released within 7 days. Crew transfer to Santorini airport (JTR) is 25 minutes by road. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and last swim at Ammoudi Bay below Oia.',
      shortDescription:
        'Handover before 09:00 at Vlychada. Inspection, deposit release within 7 days. JTR airport 25 min by road. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and last swim at Ammoudi Bay below Oia.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Last swim at Ammoudi Bay below Oia',
        'Breakfast at a caldera-edge café',
        'Airport transfer (25 min from Vlychada)',
      ],
      mooringTip:
        'Hand over at Vlychada before 09:00. Deposit released within 7 days post-inspection. Photo evidence of any noted damage before signing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros-town.webp', alt: 'Paros' }],
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

export default computeItineraryNumberOfDays(santoriniMilosParosRoute);
