import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lavrionMilosSifnos14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Lavrion–Milos–Sifnos Yacht Charter Route | Cyclades Sailing',
  metaDesc:
    'Sail a 14-day yacht charter from Lavrion through Andros, Tinos, Donousa, Amorgos, Koufonissi, Folegandros and back via Milos and Sifnos. Full Cyclades grand tour.',
  id: 'lavrion-milos-sifnos-14-days',
  startingPoint: 'Lavrion',
  otherPoints: ['Milos', 'Sifnos'],
  cardImage: {
    src: '/images/itinerary/greece/cyclades-itinerary/routes/lavrion-milos-sifnos.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/milos-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/koufonissi-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/folegandros-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/milos-banner.webp',
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
        desktop: { left: 9.5, top: 12.1 },
        mobile: { left: 5.4, top: 16.6 },
      },
      description:
        '18 nm shake-down hop east-southeast from Lavrion to Kea. Korissia harbour on the northwest of the island is the larger overnight option; Vourkari Bay 1 nm north is the better-protected alternative with stern-to lazy lines. Plan to be moored before 16:00 — afternoon Meltemi swell builds at the Korissia entrance once wind exceeds 20 knots.',
      shortDescription:
        '18 nm afternoon hop east-southeast from Lavrion to Kea. Korissia is the larger free quay; Vourkari is the sheltered paid alternative when Meltemi blows above 18 kn N.',
      thingsToDo: [
        'Walk to the 6th-century BC Stone Lion of Kea',
        'Snorkel the Patris steamship wreck off Koundouros',
        'Octopus carpaccio at a Vourkari ouzeri',
        'Walk Ioulida marble alleys at dusk',
      ],
      mooringTip:
        'Korissia town quay free but exposed in N Meltemi. Switch to Vourkari Bay (€25-35/night, lazy lines) when wind builds above 18 kn.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kea.webp', alt: 'Kea' }],
    },
    {
      id: 'kea-andros',
      routeFrom: 'Kea',
      routeTo: 'Andros',
      day: 2,
      mapPin: {
        desktop: { left: 23.8, top: 16.5 },
        mobile: { left: 18.8, top: 20.8 },
      },
      description:
        '32 nm east-northeast to Andros — the northernmost of the Cyclades and one of the greenest. Gavrio on the west coast is the standard charter overnight; the harbour is large, well-protected and stern-to is straightforward. Andros is unusual in the Cyclades for its surface water — streams, waterfalls and stone bridges — and the inland hiking is the equal of any Aegean island. The capital Chora is on the east coast and accessed by road.',
      shortDescription:
        '32 nm east-northeast to Andros. Gavrio harbour on the west coast is the standard charter overnight — large, well-protected, easy stern-to. Andros has surface water and inland hiking unique in the Cyclades.',
      thingsToDo: [
        'Hike to Pithara waterfalls (inland)',
        'Walk Chora marble paths and contemporary art museum',
        'Froutalia herb omelette at a kafeneio',
        'Swim Vitali Beach (north coast)',
      ],
      mooringTip:
        'Stern-to in Gavrio harbour, €30-50/night. Well-protected from any wind direction. Plenty of slot capacity in peak season.',
      gallery: [{ src: '/images/itinerary/greece/destinations/andros.webp', alt: 'Andros' }],
    },
    {
      id: 'andros-tinos',
      routeFrom: 'Andros',
      routeTo: 'Tinos',
      day: 3,
      mapPin: {
        desktop: { left: 50.7, top: 9.7 },
        mobile: { left: 48.1, top: 10.4 },
      },
      description:
        '20 nm southeast to Tinos. The Andros-Tinos channel funnels the Meltemi but the leg is short. Tinos new harbour stern-to has moderate sand holding; the inner small craft harbour is the calmer alternative when Meltemi is forecast above 25 knots. Tinos is the marble-carving capital of the Aegean and the Greek Orthodox pilgrimage centre — over 100 cliff-side dovecotes in the inland villages.',
      shortDescription:
        '20 nm southeast to Tinos. Andros-Tinos channel funnels the Meltemi but the leg is short. Inner small craft harbour is calmer above 25 kn. Stern-to in Tinos new harbour, €25-40/night; Holding moderate sand — set anchor with long scope.',
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
      id: 'tinos-donousa',
      routeFrom: 'Tinos',
      routeTo: 'Donousa',
      day: 4,
      mapPin: {
        desktop: { left: 63.5, top: 22.1 },
        mobile: { left: 59.7, top: 24.4 },
      },
      description:
        'Long 38 nm southeast to Donousa — first of the Small Cyclades. Donousa is the most remote of the four populated Small Cyclades islands, with 100 year-round residents and limited charter capacity. The harbour at Stavros on the southwest coast is small but sheltered. Anchor in the bay outside the village if the quay is full. Kedros Beach south of the village is the headline swim — sand, turquoise water, sheltered from N.',
      shortDescription:
        '38 nm long southeast leg to Donousa — most remote of the Small Cyclades, 100 residents, limited slots. Anchor in Stavros bay if the small quay is full. Kedros Beach for the swim.',
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
      id: 'donousa-amorgos',
      routeFrom: 'Donousa',
      routeTo: 'Amorgos',
      day: 5,
      mapPin: {
        desktop: { left: 93.1, top: 49.6 },
        mobile: { left: 93.5, top: 47.1 },
      },
      description:
        '15 nm southeast to Amorgos. The cliff-clinging Hozoviotissa Monastery is the headline excursion — 300 steps up the cliff face from the road, brilliant white walls against ochre rock, founded 1088 AD. Aegiali on the north coast is the safer overnight in N Meltemi; Katapola on the south is the alternative when wind clocks south. Olympia shipwreck off Liveros is the dive spot if anyone aboard has certification.',
      shortDescription:
        '15 nm southeast to Amorgos. Hozoviotissa monastery (cliff-side, 1088 AD) is the headline shore excursion — 300 steps up. Aegiali sheltered N Meltemi; Katapola for S wind.',
      thingsToDo: [
        'Climb to cliff-clinging Hozoviotissa monastery',
        'Dive the Olympia shipwreck off Liveros',
        'Psimeni raki and goat in a Tholaria taverna',
        'Hike Aegiali-Tholaria ridge path',
      ],
      mooringTip:
        'Aegiali stern-to, €25-40/night, sheltered from N. Katapola is the south-coast alternative for S wind. Confirm slot in peak — limited charter capacity.',
      gallery: [{ src: '/images/itinerary/greece/destinations/amorgos.webp', alt: 'Amorgos' }],
    },
    {
      id: 'amorgos-koufonissi',
      routeFrom: 'Amorgos',
      routeTo: 'Koufonissi',
      day: 6,
      mapPin: {
        desktop: { left: 96.7, top: 65.5 },
        mobile: { left: 96.4, top: 64 },
      },
      description:
        '15 nm west-southwest to Koufonissi — the largest of the populated Small Cyclades and increasingly the boutique-yachting hub of the cluster. Pano Koufonissi (the inhabited island) has the harbour and village; Kato Koufonissi (uninhabited) is the day-anchor for the famous Pori Beach turquoise lagoon. Astakomakaronada (lobster spaghetti) is the local speciality; the catch is brought in early morning by the village fleet.',
      shortDescription:
        '15 nm WSW to Koufonissi — biggest of Small Cyclades, boutique-yachting hub. Pano Koufonissi has the village and quay; day-anchor at uninhabited Kato Koufonissi for Pori lagoon swim.',
      thingsToDo: [
        'Day-anchor swim at Pori Beach lagoon',
        'Snorkel the cliff caves on the southeast coast',
        'Astakomakaronada lobster spaghetti at the harbour',
        'Walk Pano Koufonissi white-washed alleys',
      ],
      mooringTip:
        'Pano Koufonissi harbour stern-to, €25-40/night, slots fill by 17:00 in peak. Anchor on sand at 4-7 m east of the village if full. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/koufonissi.webp', alt: 'Koufonissi' }],
    },
    {
      id: 'koufonissi-schoinousa',
      routeFrom: 'Koufonissi',
      routeTo: 'Schoinousa',
      day: 7,
      mapPin: {
        desktop: { left: 85.7, top: 62.1 },
        mobile: { left: 85.4, top: 59.4 },
      },
      description:
        'Short 5 nm hop west to Schoinousa — smallest populated Small Cyclades island, 200 residents, the white-washed village Chora on a hill above the small harbour at Mersini. Walk up from the port, swim Tsigouri Beach (sheltered from N, sandy, shallow), eat tomato keftedes and house wine under a tamarisk tree. Schoinousa is the quietest stop on the Small Cyclades cluster.',
      shortDescription:
        'Short 5 nm hop west to Schoinousa — quietest of the Small Cyclades, 200 residents. Mersini harbour at the foot, Chora village on the hill above. Tsigouri Beach is the headline swim.',
      thingsToDo: [
        'Swim Tsigouri Beach (sheltered from N)',
        'Walk up to Chora hilltop village',
        'Tomato keftedes under a tamarisk tree',
        'Hike to Panagia mountain church',
      ],
      mooringTip:
        'Stern-to in Mersini harbour, €15-25/night, limited slots. Anchor on sand at 4-6 m east of the harbour if full. Sheltered from N.',
      gallery: [{ src: '/images/itinerary/greece/destinations/schoinousa.webp', alt: 'Schoinousa' }],
    },
    {
      id: 'schoinousa-irakleia',
      routeFrom: 'Schoinousa',
      routeTo: 'Irakleia',
      day: 8,
      mapPin: {
        desktop: { left: 79.1, top: 63.7 },
        mobile: { left: 78.1, top: 59.8 },
      },
      description:
        '7 nm west to Irakleia. Population 100, one taverna at Agios Georgios harbour, a single road, the Blue Cave 30 minutes hike from the village. This is where Cyclades cruising goes quiet — the headline tourist crowd never reaches the Small Cyclades. If a panigiri (saint-day festival) coincides with the visit, the entire village joins in; the Saint Trinity festival in late August is the biggest of the year.',
      shortDescription:
        '7 nm west to Irakleia. 100 residents, one taverna, single road. Quietest island on the route. Blue Cave hike from the village. Saint Trinity panigiri in late August.',
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
      id: 'irakleia-folegandros',
      routeFrom: 'Irakleia',
      routeTo: 'Folegandros',
      day: 9,
      mapPin: {
        desktop: { left: 76.1, top: 66.7 },
        mobile: { left: 72.6, top: 62.7 },
      },
      description:
        '32 nm west to Folegandros — beam reach in standard Meltemi, fast passage. Karavostasi is the only practical port; small, sheltered from N, exposed S. Cliff-top Chora is a 30-minute kalderimi climb above the harbour or a taxi up. The cliff-edge walk from Chora to the Panagia church is the headline shore activity — 30 minutes one way, panoramic views all the way back to the southern Cyclades.',
      shortDescription:
        '32 nm fast beam reach west to Folegandros. Karavostasi sheltered from N, exposed S. Chora is a kalderimi climb above the harbour; Panagia cliff-edge walk is the headline.',
      thingsToDo: [
        'Cliff-edge walk Chora to Panagia church',
        'Swim Katergo Bay (boat-only access)',
        'Matsata pasta with goat ragù in a courtyard',
        'Walk the kalderimi path to Ano Meria',
      ],
      mooringTip:
        'Karavostasi stern-to, €25-40/night, limited slots. Anchor in the bay east of port on sand at 4-7 m if full. Avoid in S winds.',
      gallery: [{ src: '/images/itinerary/greece/destinations/folegandros.webp', alt: 'Folegandros' }],
    },
    {
      id: 'folegandros-milos',
      routeFrom: 'Folegandros',
      routeTo: 'Milos (Port Adamantas)',
      day: 10,
      mapPin: {
        desktop: { left: 51.5, top: 79.7 },
        mobile: { left: 50.2, top: 74.2 },
      },
      description:
        '20 nm northwest to Milos. The long Milos inlet provides one of the most sheltered overnights in the western Cyclades — once inside Adamas Bay the wind drops away from any direction. Sarakiniko bone-white volcanic moonscape on the way past is the unmissable swim stop, but the anchorage is exposed and only viable in calm wind. Klima fishermen syrmata (rainbow-painted boat houses on the water) are the photo activity ashore.',
      shortDescription:
        '20 nm northwest to Milos. Adamas Bay at the head of the long inlet is the most sheltered overnight in the western Cyclades. Sarakiniko swim only in calm wind.',
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
      routeTo: 'Sifnos (Vathi or Kamares)',
      day: 11,
      mapPin: {
        desktop: { left: 26.6, top: 74.7 },
        mobile: { left: 25.1, top: 68.8 },
      },
      description:
        '18 nm north to Sifnos. Vathi on the south coast is the calmest swim anchorage on the island — fjord-like inlet, sand bottom, salt flats inland. Kamares on the west coast is the larger paid quay overnight. In late summer when Meltemi has a westerly component switch from Kamares to Vathi for shelter. Sifnos is the gastronomy island of the Cyclades; mastelo lamb in clay pots and chickpea revithada cooked overnight in a wood oven are the two standard orders.',
      shortDescription:
        '18 nm north to Sifnos. Vathi south coast is the calmest swim anchorage; Kamares west coast is the larger quay. Switch to Vathi when wind clocks west.',
      thingsToDo: [
        'Walk to cliffside Chrysopigi monastery at Faros',
        'Mastelo lamb in clay pots at Artemonas',
        'Pottery workshop visit in Vathy',
        'Swim Vathi Bay (south coast, calmest)',
      ],
      mooringTip:
        'Anchor on sand at 5-8 m in Kamares Bay or stern-to on the small quay (€20-30/night). Vathi anchor on sand at 4-6 m, fully sheltered.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kamares.webp', alt: 'Kamares' }],
    },
    {
      id: 'sifnos-kythnos',
      routeFrom: 'Sifnos',
      routeTo: 'Kythnos (Merichas Harbor)',
      day: 12,
      mapPin: {
        desktop: { left: 40.7, top: 59.4 },
        mobile: { left: 27.5, top: 45.9 },
      },
      description:
        '32 nm north back to Kythnos — long upwind day, plan two long port tacks against the Meltemi. Merichas on the west coast is the easier mooring than Loutra in builder forecast. Day-anchor at Apokrousi cove for lunch (sheltered from N). The Kolona double-bay sandbar 6 nm further north is the headline anchorage of the island and worth the detour if time and wind allow.',
      shortDescription:
        '32 nm long upwind north back to Kythnos. Merichas is the easier mooring than Loutra in build wind. Day-anchor lunch at Apokrousi; detour to Kolona sandbar if time allows.',
      thingsToDo: [
        'Day-anchor lunch at Apokrousi cove',
        'Anchor swim at the Kolona sandbar (detour)',
        'Walk Merichas-Chora ridge road',
        'Sfougato cheese pie at a Driopida taverna',
      ],
      mooringTip:
        'Stern-to in Merichas town quay, €20-30/night. Sheltered from N Meltemi. Loutra is the alternative for thermal springs.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kythnos.webp', alt: 'Kythnos' }],
    },
    {
      id: 'kythnos-lavrion',
      routeFrom: 'Kythnos',
      routeTo: 'Lavrion',
      day: 13,
      mapPin: {
        desktop: { left: 26.6, top: 32.9 },
        mobile: { left: 22.8, top: 33.8 },
      },
      description:
        "Final leg back — 22 nm northwest to Lavrion. Stop at Cape Sounion for a last anchor swim under Poseidon's temple (anchorage 0.5 nm offshore on sand at 5-8 m, sheltered from N). Refuel at the Lavrion fuel berth before tying up so the boat is handover-ready.",
      shortDescription:
        '22 nm northwest back to Lavrion. Last swim stop at Cape Sounion under Poseidon temple. Refuel at the entrance fuel berth before mooring at Lavrion.',
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
      routeTo: 'Check-out',
      day: 14,
      description:
        'Handover at Lavrion before 09:00. Boat inspection with the skipper present — deposit released within 7 days. Crew transfer to Athens airport is roughly 50 minutes by road. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and coffee at a Lavrion harbour kafeneio.',
      shortDescription:
        'Handover before 09:00 at Lavrion. Inspection, deposit release within 7 days. Athens airport 50 min by road; allow 90 in Friday peak. Photo evidence of any noted damage before signing. Plan to final inspection with the base manager and coffee at a Lavrion harbour kafeneio.',
      thingsToDo: [
        'Final inspection with the base manager',
        'Coffee at a Lavrion harbour kafeneio',
        'Airport transfer (50 min from Lavrion)',
        'Tip the dock crew if service was good',
      ],
      mooringTip:
        'Hand over at Lavrion before 09:00. Deposit released within 7 days post-inspection. Photo evidence of any noted damage before signing.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lavrion.webp', alt: 'Lavrion' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/map.webp',
        alt: 'Lavrion Milos Sifnos Route Image',
      },
      width: 1147,
      height: 1103,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/cyclades-itinerary/laurium/mobile-map.webp',
        alt: 'Lavrion Milos Sifnos Route Image',
      },
      width: 1032,
      height: 1165,
    },
  },
};

export default computeItineraryNumberOfDays(lavrionMilosSifnos14DaysRoute);
