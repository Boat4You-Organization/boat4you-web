import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const santoriniMykonosMilos14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Santorini–Mykonos–Milos Yacht Route | Boat4You',
  metaDesc:
    'Sail a 14-day yacht charter round-trip from Santorini through Mykonos, Amorgos, Naxos and Milos. Vlychada start avoids the Athens crossing — straight into the southern Cyclades.',
  id: 'santorini-mykonos-milos-14-days',
  startingPoint: 'Santorini',
  otherPoints: ['Mykonos', 'Milos'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/santorini-mykonos-milos.webp',
    alt: 'athens-saronic-gulf',
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
      id: 'santorini-folegandros',
      routeFrom: 'Santorini (Vlychada Marina)',
      routeTo: 'Folegandros',
      day: 1,
      mapPin: {
        desktop: { left: 47.9, top: 47.4 },
        mobile: { left: 48.7, top: 44.4 },
      },
      description:
        'Provisioning at Vlychada in the morning, lift lines after lunch. 22 nm northwest with the Meltemi on the bow — first day is also the first upwind work. Folegandros has only one practical port, Karavostasi, on the southeast coast. Sheltered from N, exposed S; check forecast for the second half of the week. Cliff-top Chora is 200 m above the harbour, accessed by taxi or a 30-minute climb up the kalderimi. Day-anchor at Katergo Bay (boat-only access) for a swim before mooring.',
      shortDescription:
        '22 nm upwind northwest to Folegandros. Bear in mind the route starts upwind on day 1 — the long downwind leg is the back-half. Karavostasi sheltered N, exposed S.',
      thingsToDo: [
        'Swim Katergo Bay (boat-only access)',
        'Taxi to Chora for the cliff-edge Panagia church',
        'Matsata pasta with goat ragù in a courtyard',
        'Walk the kalderimi path to Ano Meria',
      ],
      mooringTip:
        'Karavostasi stern-to, €25-40/night, limited slots. Anchor in the bay east of port on sand at 4-7 m if full. Avoid in S winds — port fully exposed south.',
      gallery: [{ src: '/images/itinerary/greece/destinations/folegandros.webp', alt: 'Folegandros' }],
    },
    {
      id: 'folegandros-milos',
      routeFrom: 'Folegandros',
      routeTo: 'Milos (Adamantas Port)',
      day: 2,
      mapPin: {
        desktop: { left: 35.5, top: 73 },
        mobile: { left: 35, top: 62.6 },
      },
      description:
        '20 nm northwest, second upwind day. Milos opens up at the long inlet entrance and the wind drops away once inside; Adamas at the head of the inlet is one of the most sheltered overnights in the western Cyclades and the stop where the crew gets the first relaxed evening. Sarakiniko on the way past is the unmissable swim stop — bone-white volcanic moonscape, but the anchorage is exposed and only viable in calm wind.',
      shortDescription:
        '20 nm upwind northwest to Milos. Adamas at the head of the long inlet is the most sheltered overnight in the western Cyclades. Sarakiniko swim stop on the way past.',
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
      id: 'milos-sifnos-paros',
      routeFrom: 'Milos',
      routeTo: 'Paros (Parikia)',
      day: 3,
      mapPin: {
        desktop: { left: 12.8, top: 67.1 },
        mobile: { left: 8.3, top: 62.5 },
      },
      description:
        'Long 35 nm leg via Sifnos. Lunch swim at Vathi Bay on Sifnos — sheltered and one of the calmest swim anchorages in the western Cyclades — then continue north 18 nm to Parikia on Paros. Parikia is bigger than Naoussa, less photogenic but easier mooring; the harbour is dredged and stern-to is straightforward. The 4th-century Panagia Ekatontapiliani (Church of a Hundred Doors) sits in the centre of the old town.',
      shortDescription:
        '35 nm via Sifnos to Paros (Parikia). Lunch swim stop at Sifnos Vathi Bay. Parikia harbour is bigger and easier than Naoussa for stern-to mooring; less photogenic but more reliable.',
      thingsToDo: [
        'Swim stop at Sifnos Vathi Bay',
        'Visit the 4th-century Ekatontapiliani church',
        'Sunset off Kolymbithres rocks',
        'Walk Parikia old town marble lanes',
      ],
      mooringTip:
        'Stern-to in Parikia harbour, €30-50/night, easier mooring than Naoussa. Naoussa is the alternative for the photogenic fishing-harbour scene; expect to compete for slot.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-explore',
      routeFrom: 'Paros',
      routeTo: 'Paros',
      day: 4,
      mapPin: {
        desktop: { left: 26, top: 50.3 },
        mobile: { left: 23.7, top: 47.5 },
      },
      description:
        'Lay-day on Paros — no leg. Use the morning for laundry and provisioning at Parikia, then anchor at Antiparos for the afternoon (sheltered cove on the east side facing the channel). Kolymbithres lunar rocks are 2 nm round the corner from Naoussa for a swim. Bike rental is the standard way to see Lefkes village in the inland highlands; the marble paths there are some of the prettiest in the Cyclades.',
      shortDescription:
        'Lay-day on Paros. Anchor at Antiparos for the afternoon, swim Kolymbithres, bike to Lefkes inland village. Use the day for laundry and provisioning if a long Cyclades leg is upcoming.',
      thingsToDo: [
        'Anchor lunch at Antiparos east coast',
        'Swim Kolymbithres lunar rocks',
        'Bike to Lefkes marble village',
        'Wine tasting at a Marpissa vineyard',
      ],
      mooringTip:
        'Free anchoring at Antiparos east coast on sand at 4-7 m. Stern-to in Parikia or Naoussa for the overnight; switch from morning anchor to evening berth.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paros.webp', alt: 'Paros' }],
    },
    {
      id: 'paros-syros',
      routeFrom: 'Paros',
      routeTo: 'Syros',
      day: 5,
      mapPin: {
        desktop: { left: 48.9, top: 41.9 },
        mobile: { left: 49.6, top: 39.5 },
      },
      description:
        '24 nm northwest to Syros — beam reach in Meltemi, one of the better sailing legs of the round trip. Ermoupoli town quay sits at the head of a deep harbour and is one of the most forgiving mooring positions in the entire Cyclades. The capital climbs the slope above in pastel neoclassical layers — Greek-orthodox Vrontado on one hill, Catholic Ano Syros on the other, the only Cycladic town where both communities are roughly equal in size.',
      shortDescription:
        '24 nm beam reach northwest to Syros. Ermoupoli town quay is one of the most forgiving stern-to in the Cyclades. Best sailing day of the route in normal Meltemi.',
      thingsToDo: [
        'Climb Ano Syros for the Catholic quarter',
        'Loukoumi tasting at a 19th-century confectionery',
        'Walk Miaouli marble square at dusk',
        'Swim the rock platforms at Asteria Beach',
      ],
      mooringTip:
        'Stern-to on Ermoupoli town quay (no fee, your own anchor). Excellent shelter in any wind direction. Manna marina slot for €60-80/night if quay is full.',
      gallery: [{ src: '/images/itinerary/greece/destinations/syros.webp', alt: 'Syros' }],
    },
    {
      id: 'syros-tinos',
      routeFrom: 'Syros',
      routeTo: 'Tinos',
      day: 6,
      mapPin: {
        desktop: { left: 36.9, top: 19.7 },
        mobile: { left: 33.9, top: 24.5 },
      },
      description:
        '14 nm hop east-southeast — the breeziest channel in the central Cyclades. Gap effect adds 5 knots to the regional forecast and 25-knot afternoons are normal in late July. Beam reach at speed but plan to be moored before 16:00. Tinos new harbour stern-to has moderate sand holding; the inner small craft harbour is the calmer alternative when Meltemi is forecast above 25 knots. Tinos is the marble-carving capital of the Aegean.',
      shortDescription:
        '14 nm fast beam reach east to Tinos. Syros-Tinos channel funnels the Meltemi — expect 5 kn extra. Be moored by 16:00; afternoon swell builds at the entrance.',
      thingsToDo: [
        'Marble-carving workshop visit in Pyrgos',
        'Walk the dovecote trail above Falatados',
        'Artichoke à la polita lunch in a courtyard',
        'Sunset at Volax granite-boulder field',
      ],
      mooringTip:
        'Stern-to in Tinos new harbour, €25-40/night. Holding moderate sand — set anchor with long scope. Inner craft harbour is calmer above 25 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/tinos.webp', alt: 'Tinos' }],
    },
    {
      id: 'tinos-mykonos',
      routeFrom: 'Tinos',
      routeTo: 'Mykonos (Tourlos Marina)',
      day: 7,
      mapPin: {
        desktop: { left: 49.4, top: 10.1 },
        mobile: { left: 48.7, top: 18.9 },
      },
      description:
        'Short 8 nm leg east to Mykonos — Tinos-Mykonos channel reliably 5 knots stronger than the regional forecast, short choppy state in the afternoon. Pre-book a slot at Tourlos New Marina online 24 hours ahead in July-August. The older Mykonos town quay is free but very exposed to swell, only viable if Meltemi is forecast below 18 knots. Day-anchor at Ornos or Psarou for an afternoon swim before mooring.',
      shortDescription:
        '8 nm short hop east to Mykonos. Tourlos New Marina is the safe overnight; town quay only works under 18 kn N. Pre-book Tourlos online 24h ahead in peak season.',
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
      id: 'mykonos-explore',
      routeFrom: 'Mykonos',
      routeTo: 'Mykonos',
      day: 8,
      mapPin: {
        desktop: { left: 90, top: 90 },
        mobile: { left: 59, top: 23.5 },
      },
      description:
        'Lay-day on Mykonos. The unmissable activity is the day-trip across to ancient Delos — UNESCO archaeological site on the small uninhabited island 3 nm west, sailable as a day-anchor. Marble lions, Apollo sanctuary, mosaic floors, all visible in 3-4 hours ashore. Anchor off the south side in 5-8 m on sand. Otherwise: beach-hop the south coast (Paradise, Super Paradise, Elia, Agrari) and end the day at Scorpios for sunset.',
      shortDescription:
        'Lay-day on Mykonos. Day-trip to ancient Delos UNESCO site (3 nm west, day-anchor only) is the unmissable shore excursion. South-coast beach loop in the afternoon.',
      thingsToDo: [
        'Day-anchor at Delos archaeological site',
        'Walk the Apollo sanctuary and lion terrace',
        'Beach lunch at Agios Sostis',
        'Sunset at Scorpios beach club',
      ],
      mooringTip:
        'Tourlos Marina overnight as the day before. Day-anchor at Delos south side on sand at 5-8 m, no overnight allowed (closes sundown). Return to Tourlos by 19:00.',
      gallery: [{ src: '/images/itinerary/greece/destinations/mykonos.webp', alt: 'Mykonos' }],
    },
    {
      id: 'mykonos-amorgos',
      routeFrom: 'Mykonos',
      routeTo: 'Amorgos (Aegiali Harbor)',
      day: 9,
      mapPin: {
        desktop: { left: 61.6, top: 14 },
        mobile: { left: 95.2, top: 48.4 },
      },
      description:
        'Long 35 nm passage southeast to Amorgos. The leg crosses open water away from the headline Cyclades and into the Small Cyclades zone — fewer charter boats, quieter anchorages. Aegiali on the north coast is the safer overnight in N Meltemi (Katapola on the south is the alternative). The cliff-clinging Hozoviotissa Monastery 6 nm south is the headline excursion: 300 steps up the cliff face from the road, brilliant white walls against ochre rock.',
      shortDescription:
        '35 nm long leg southeast to Amorgos — crosses into the Small Cyclades. Aegiali sheltered from N Meltemi; Katapola is the south-coast alternative. Hozoviotissa monastery 6 nm south.',
      thingsToDo: [
        'Climb to cliff-clinging Hozoviotissa monastery',
        'Dive the Olympia shipwreck off Liveros',
        'Psimeni raki and goat in a Tholaria taverna',
        'Hike the Aegiali-Tholaria ridge path',
      ],
      mooringTip:
        'Aegiali stern-to, €25-40/night, sheltered from N. Katapola is the south-coast alternative for wind from the south. Confirm slot in peak season — Amorgos has limited charter capacity.',
      gallery: [{ src: '/images/itinerary/greece/destinations/amorgos.webp', alt: 'Amorgos' }],
    },
    {
      id: 'amorgos-irakleia',
      routeFrom: 'Amorgos',
      routeTo: 'Irakleia',
      day: 10,
      mapPin: {
        desktop: { left: 86.9, top: 57.6 },
        mobile: { left: 67.8, top: 51.1 },
      },
      description:
        '18 nm west into the Small Cyclades cluster. Irakleia is the smallest of the four populated Small Cyclades islands (Donousa, Schinoussa, Koufonisia and Irakleia) — population 100, one taverna at Agios Georgios harbour, a single road, and the Blue Cave 30 minutes hike from the village. This is where Cyclades cruising goes quiet: the headline tourist crowd never reaches the Small Cyclades.',
      shortDescription:
        '18 nm west into the Small Cyclades. Irakleia population 100 — the quietest island on the route. Anchor in Agios Georgios bay; one taverna in the village.',
      thingsToDo: [
        'Hike to the Blue Cave (30 min from village)',
        'Beach swim at Livadi (best swim water in the Small Cyclades)',
        'Grilled gouna sun-dried mackerel at the harbour taverna',
        'Walk the kastro pirate-era ruins',
      ],
      mooringTip:
        'Anchor in Agios Georgios bay on sand at 5-7 m. Sheltered from N Meltemi. Small quay slots for €15-25/night, lazy lines absent.',
      gallery: [{ src: '/images/itinerary/greece/destinations/irakleia.webp', alt: 'Irakleia' }],
    },
    {
      id: 'irakleia-naxos',
      routeFrom: 'Irakleia',
      routeTo: 'Naxos',
      day: 11,
      mapPin: {
        desktop: { left: 63.9, top: 59.2 },
        mobile: { left: 60.1, top: 40.4 },
      },
      description:
        '20 nm northwest to Naxos — the largest Cycladic island, fertile interior, mountains over 1000 m. Naxos town harbour is well-protected and stern-to is reliable. The Portara — a single marble doorway from the unfinished 6th-century BC Apollo temple — sits on the small islet at the harbour entrance and is the headline sunset spot. Inland, Mount Zas (1004 m) is the Cyclades highest peak and a 4-hour hike from Filoti village.',
      shortDescription:
        '20 nm northwest to Naxos — biggest Cycladic island, fertile, mountains over 1000 m. Town harbour stern-to is reliable; Portara marble doorway is the headline sunset.',
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
      id: 'naxos-ios',
      routeFrom: 'Naxos',
      routeTo: 'Ios',
      day: 12,
      mapPin: {
        desktop: { left: 60.5, top: 42.6 },
        mobile: { left: 57.3, top: 58.9 },
      },
      description:
        '20 nm south through the Naxos-Sikinos channel — Meltemi reach. Plan a swim stop at Manganari Bay on the south coast of Ios, then back round to Ormos for the overnight. Ios is the late-night party island of the central Cyclades: Chora square fills with crowds from 23:00, and the small alleys turn into open-air clubs through the summer months.',
      shortDescription:
        '20 nm south to Ios. Manganari swim stop on the south coast, then round to Ormos for overnight. Late-night Chora is the headline Ios scene from 23:00.',
      thingsToDo: [
        'Swim stop at Manganari Beach',
        'Hike to the supposed tomb of Homer above Plakotos',
        'Chora rembetika square late-night',
        'Sunset drinks above the windmills',
      ],
      mooringTip:
        'Ormos harbour stern-to, €25-40/night. Mylopotas anchorage is daytime only — untenable overnight in Meltemi. Manganari is sheltered from N for swim stop.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ios.webp', alt: 'Ios' }],
    },
    {
      id: 'ios-santorini',
      routeFrom: 'Ios',
      routeTo: 'Santorini (Vlychada Marina)',
      day: 13,
      mapPin: {
        desktop: { left: 54.6, top: 67.5 },
        mobile: { left: 63.7, top: 73 },
      },
      description:
        'Last leg back to Santorini — 18 nm south. Plan a swim stop at Thirasia (the small inhabited island on the west side of the caldera) before rounding the south coast to Vlychada Marina. The caldera entry is dramatic but anchoring is impossible (300+ m); the cruise-ship buoys off Thirasia are not reliable for charter. End the trip with a taxi to Oia for the cliff-top sunset before the morning handover.',
      shortDescription:
        '18 nm south back to Vlychada. Swim stop at Thirasia caldera-side. Caldera unanchorable (300+ m); Vlychada is the only practical Santorini overnight. Taxi to Oia for the sunset.',
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
      routeFrom: 'Santorini',
      routeTo: 'Check-out',
      day: 14,
      mapPin: {
        desktop: { left: 150, top: 150 },
        mobile: { left: 150, top: 150 },
      },
      description:
        'Handover at Vlychada before 09:00. Boat inspection with the skipper present — deposit released within 7 days. Crew transfer to Santorini airport (JTR) is 25 minutes by road. Last morning swim at Ammoudi Bay below Oia (taxi from Vlychada) and breakfast at a caldera-edge café is the standard last-day routine.',
      shortDescription:
        'Handover before 09:00 at Vlychada. Inspection and deposit release within 7 days. Airport (JTR) is 25 minutes by road. Ammoudi swim and Oia breakfast are the standard last-morning routine.',
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

export default computeItineraryNumberOfDays(santoriniMykonosMilos14DaysRoute);
