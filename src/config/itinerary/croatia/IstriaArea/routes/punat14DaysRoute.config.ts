import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const punat14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Punat Yacht Charter Route | Istria & Kvarner Sailing Adventure',
  metaDesc:
    'Embark on a 14-day yacht charter from Punat exploring Istria & Kvarner—Rovinj, Cres, Lošinj, Brijuni, Rabac & beyond—hidden coves, historic towns & Adriatic charm.',
  id: 'punat-14days',
  startingPoint: 'Punat',
  otherPoints: ['14 Days'],
  cardImage: {
    src: '/images/itinerary/croatia/istria-itinerary/routes/punat-14-days-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/kornati-banner-large.webp', alt: 'Kornati' },
    { src: '/images/itinerary/croatia/banners/rovinj-banner-large.webp', alt: 'Rovinj' },
    { src: '/images/itinerary/croatia/banners/krk-banner.webp', alt: 'Krk' },
    { src: '/images/itinerary/croatia/banners/losinj-banner.webp', alt: 'Losinj' },
  ],
  routeDays: [
    {
      id: 'punat-lopar-rab',
      routeFrom: 'Punat',
      routeTo: 'Lopar (Rab)',
      day: 1,
      mapPin: {
        desktop: { left: 60.4, top: 52.3 },
        mobile: { left: 60.4, top: 52.3 },
      },
      description:
        'Start in Punat, the calm marina of Krk, where olive groves still smell. Sail to the Lopar Peninsula of Rab, site to Paradise Beach—a remarkable length of golden sand. Ascend the St. Euphemia Church from the 12th century and feast on Rapska torta, almond cake, while the sun sets over the Kvarner Gulf.',
      shortDescription:
        "Easy 18 nm leg out of Punat south to the Lopar peninsula on Rab. Lopar's Sahara Beach (sandy dunes, rare in Croatia) and the Rajska Plaža (Paradise Beach, 1.5 km of golden sand) are the headline shores of the upper Adriatic.",
      thingsToDo: [
        'Walk Paradise Beach (1.5 km sand)',
        'Beach day at Sahara dunes',
        'Hike to Lopar lookout cross',
        'Rapska torta at the bakery',
      ],
      mooringTip:
        'Anchor in San Marino Bay sheltered from N/NE; Lopar pier is for ferries, not charter overnights. Overnight in Rab Town is also a possibility.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lopar.webp', alt: 'Lopar' }],
    },
    {
      id: 'lopar-novalja-pag',
      routeFrom: 'Lopar',
      routeTo: 'Novalja (Pag)',
      day: 2,
      mapPin: {
        desktop: { left: 64.2, top: 56.2 },
        mobile: { left: 64.2, top: 56.2 },
      },
      description:
        "An island of moonlike fields and saline breezes, Glide to Pag. Dock near Novalja, where Lun's forest features twisted ancient olive trees. Taste Paški Sir (sheep cheese) at Gligora Dairy; then, at Zrče Beach, the Adriatic's response to Ibiza, dance barefoot.",
      shortDescription:
        "Short crossing across to Novalja, the lively summer capital of Pag — Croatia's longest island and the country's most distinctive lunar moonscape. Zrće Beach hosts the headline Adriatic festival nightlife.",
      thingsToDo: [
        'Visit Lun olive grove (1600 trees)',
        'Paški sir tasting at Gligora dairy',
        'Day on Zrće Beach',
        'Sunrise dancing at Papaya club',
      ],
      mooringTip: 'Novalja town quay + small marina; pre-book in summer. Anchor in nearby coves for a quieter night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/novalja.webp', alt: 'Novalja' }],
    },
    {
      id: 'novalja-susak',
      routeFrom: 'Novalja',
      routeTo: 'Susak',
      day: 3,
      mapPin: {
        desktop: { left: 38.1, top: 57.6 },
        mobile: { left: 38.1, top: 57.6 },
      },
      description:
        "Sail to Susak, a sandy speck where ladies dress in ethnic clothes and time slows down. Under a star-flecked sky, swim in the blue seas of Bok Bay, wander among sage fields, and eat šokol, or fig cake. Small fishing harbour — limited slots. Anchor in Bok Bay on sand at 4-6 m, sheltered from N/NE. Plan to walk the windblown sandy paths, swim shallow Bok Bay, try šokol cured meat with the locals. ong 25 nm crossing west to Susak — the Adriatic's only true sand island, formed entirely from windblown loess soil. Population under 100 year-round; the women wear distinctive short red-orange skirts on local festivals.",
      shortDescription:
        "Long 25 nm crossing west to Susak — the Adriatic's only true sand island, formed entirely from windblown loess soil. Population under 100 year-round; the women wear distinctive short red-orange skirts on local festivals.",
      thingsToDo: [
        'Walk the windblown sandy paths',
        'Swim shallow Bok Bay',
        'Try šokol cured meat with the locals',
        'Watch the silent Susak sunset',
      ],
      mooringTip: 'Small fishing harbour — limited slots. Anchor in Bok Bay on sand at 4-6 m, sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/susak.webp', alt: 'Susak' }],
    },
    {
      id: 'susak-mali-losinj',
      routeFrom: 'Susak',
      routeTo: 'Mali Lošinj',
      day: 4,
      mapPin: {
        desktop: { left: 46.3, top: 58.6 },
        mobile: { left: 46.3, top: 58.6 },
      },
      description:
        'Run toward Mali Lošinj, the "Island of Vitality." Wander pastel villas in Čikat Bay\'s soothing waters, then snorkel. See the Apoxyomenos Museum, where an ancient bronze athlete guards island secrets 2,000 years ago. ACI Marina Mali Lošinj is the safe pre-book in summer; town quay slots are first-come. Plan to the Apoxyomenos bronze athlete, walk the Čikat aromatic trails, sunset paddleboard the Riva.',
      shortDescription:
        "Short 6 nm hop east to Mali Lošinj. The Apoxyomenos bronze (1st-century BC athlete pulled from the seabed in 1999) is the museum highlight; Čikat Bay's medicinal-pine air gave Lošinj its WHO climatic-spa status more than a century ago.",
      thingsToDo: [
        'See the Apoxyomenos bronze athlete',
        'Walk the Čikat aromatic trails',
        'Sunset paddleboard the Riva',
        'Seafood platter at a riva taverna',
      ],
      mooringTip: 'ACI Marina Mali Lošinj is the safe pre-book in summer; town quay slots are first-come.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mali-losinj.webp', alt: 'Mali Lošinj' }],
    },
    {
      id: 'mali-losinj-unije',
      routeFrom: 'Mali Lošinj',
      routeTo: 'Unije',
      day: 5,
      mapPin: {
        desktop: { left: 37.2, top: 49.5 },
        mobile: { left: 37.2, top: 49.5 },
      },
      description:
        "Anchor at the secret coves-filled car-free Unije. Kayak the sandy lap of Maracol Bay, then accompany fishermen for brudet (fish stew) as evening paints the sea indigo. Small fishing-port quay — first-come. Anchor in Maracol Bay on sand at 4-6 m, sheltered from N/NE. Plan to swim Maracol sandy bay, walk the car-free island path, watch sunset from the lighthouse. asy 7 nm hop northwest to Unije — population under 100, no cars on the island, and one of the few sandy-beach destinations in northern Croatia. Maracol Bay's golden-sand shore is exceptional for the Adriatic.",
      shortDescription:
        "Easy 7 nm hop northwest to Unije — population under 100, no cars on the island, and one of the few sandy-beach destinations in northern Croatia. Maracol Bay's golden-sand shore is exceptional for the Adriatic.",
      thingsToDo: [
        'Swim Maracol sandy bay',
        'Walk the car-free island path',
        'Watch sunset from the lighthouse',
        'Brudet stew at the family konoba',
      ],
      mooringTip: 'Small fishing-port quay — first-come. Anchor in Maracol Bay on sand at 4-6 m, sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/unije.webp', alt: 'Unije' }],
    },
    {
      id: 'unije-pula',
      routeFrom: 'Unije',
      routeTo: 'Pula',
      day: 6,
      mapPin: {
        desktop: { left: 19.8, top: 40.5 },
        mobile: { left: 19.8, top: 40.5 },
      },
      description:
        'Sail south to Pula, where modern wonders coexist with Roman remains. Look at the enormous arches of the Arena, then plunge into the beautiful waters of Verudela. Dine at a vineyard restaurant on truffle pasta; your tongue will taste earthy flavors.',
      shortDescription:
        'Long 25 nm crossing west across the Kvarner Gulf to Pula — the largest historic city of Istria, with one of the six largest surviving Roman amphitheatres in the world (still hosting summer concerts and the Pula Film Festival).',
      thingsToDo: [
        'Tour the Pula Roman Amphitheatre',
        'Walk Sergian Triumphal Arch',
        'Swim the Verudela peninsula',
        'Truffle pasta at a vineyard restaurant',
      ],
      mooringTip:
        'Marina Veruda or Marina Pula — both full-service. Pre-book in July-August. Pula city quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/marina-pula.webp', alt: 'Pula' }],
    },
    {
      id: 'pula-medulin',
      routeFrom: 'Pula',
      routeTo: 'Medulin',
      day: 7,
      mapPin: {
        desktop: { left: 24.4, top: 41.4 },
        mobile: { left: 24.4, top: 41.4 },
      },
      description:
        "Coast to Medulin, the heaven of beach lowers. Search for dinosaur footprints, swim in Kamenjak's emerald coves, then have brodet (fish stew) at Konoba Batelina, the abundance of the sea on your table. Marina Veruda or Medulin port. Anchor in Bijeca Bay on sand at 3-5 m for a quiet evening, sheltered from N/NE. Plan to hike Cape Kamenjak coastal trails, see the dinosaur footprints, swim emerald Kolombarica cove.",
      shortDescription:
        "Easy 6 nm down the south Istrian coast to Medulin — gateway to Cape Kamenjak nature reserve. Konoba Batelina is one of Croatia's most respected fish restaurants (Marin Vlašić's family kitchen, fish-of-the-day-only menu).",
      thingsToDo: [
        'Hike Cape Kamenjak coastal trails',
        'See the dinosaur footprints',
        'Swim emerald Kolombarica cove',
        'Dinner at Konoba Batelina',
      ],
      mooringTip:
        'Marina Veruda or Medulin port. Anchor in Bijeca Bay on sand at 3-5 m for a quiet evening, sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/medulin.webp', alt: 'Medulin' }],
    },
    {
      id: 'medulin-rabac',
      routeFrom: 'Medulin',
      routeTo: 'Rabac',
      day: 8,
      mapPin: {
        desktop: { left: 33, top: 26.9 },
        mobile: { left: 33, top: 26.9 },
      },
      description:
        'From Rabac, the "Pearl of Kvarner," glide. Walk the Lungomare promenade and cliff-jump at Girandella Cove. As the sun sets behind Učka Mountain, sip malvasia wine paints the bay molten gold. ACI Marina Rabac for an overnight; town quay short-stay only. Plan to walk the curved Rabac promenade, cable car up Mount Učka, hike to medieval Labin. asy 22 nm leg around the southern tip of Istria into the Kvarner Gulf to Rabac. The Učka mountain rising behind the village is the most dramatic backdrop on Croatia\'s east-Istrian coast.',
      shortDescription:
        "Easy 22 nm leg around the southern tip of Istria into the Kvarner Gulf to Rabac. The Učka mountain rising behind the village is the most dramatic backdrop on Croatia's east-Istrian coast.",
      thingsToDo: [
        'Walk the curved Rabac promenade',
        'Cable car up Mount Učka',
        'Hike to medieval Labin',
        'Malvasia wine tasting at sunset',
      ],
      mooringTip: 'ACI Marina Rabac for an overnight; town quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rabac.webp', alt: 'Rabac' }],
    },
    {
      id: 'rabac-opatija',
      routeFrom: 'Rabac',
      routeTo: 'Opatija',
      day: 9,
      mapPin: {
        desktop: { left: 40.3, top: 7.9 },
        mobile: { left: 40.3, top: 7.9 },
      },
      description:
        'Fly to Opatija, the Belle Époque gem of Croatia. Wander the Lungomare, where once-prominent Habsburg nobility walked. Eat Istrian fuzi (truffle pasta) on a seashore terrace, then toast Hemingway Bar with a Maraschino sour. ACI Marina Opatija (Ičići) is the standard berth. Town quay short-stay only. Plan to walk the 12 km Lungomare promenade, tour Villa Angiolina park, sip cocktails at Hemingway Bar. orthern leg around the cape to Opatija — the 19th-century Habsburg riviera that once hosted Austrian emperors and Italian opera stars. The 12 km Lungomare promenade between Volosko and Lovran is a national heritage walk.',
      shortDescription:
        'Northern leg around the cape to Opatija — the 19th-century Habsburg riviera that once hosted Austrian emperors and Italian opera stars. The 12 km Lungomare promenade between Volosko and Lovran is a national heritage walk.',
      thingsToDo: [
        'Walk the 12 km Lungomare promenade',
        'Tour Villa Angiolina park',
        'Sip cocktails at Hemingway Bar',
        'Fuzi pasta at a seafront terrace',
      ],
      mooringTip: 'ACI Marina Opatija (Ičići) is the standard berth. Town quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/opatija.webp', alt: 'Opatija' }],
    },
    {
      id: 'opatija-rijeka',
      routeFrom: 'Opatija',
      routeTo: 'Rijeka',
      day: 10,
      mapPin: {
        desktop: { left: 49.2, top: 12.4 },
        mobile: { left: 49.2, top: 12.4 },
      },
      description:
        'Dock in Rijeka, a port city throbbing with artistic expression and grit. Discover the mediaeval ramparts of Trsat Castle then delve into the café scene on Korzo Street. From the Dolac Market, snack on kvarner scampi with their briny Adriatic sweet taste in every mouthful.',
      shortDescription:
        "Short 6 nm hop east into the Bay of Rijeka. Croatia's third-largest city and 2020 European Capital of Culture — a port city with industrial edge, alternative-culture quarters, and the medieval Trsat castle ruins above the harbour.",
      thingsToDo: [
        'Climb to Trsat castle and church',
        'Walk the Korzo café strip',
        'Tour the City Museum of Rijeka',
        'Kvarner scampi at the Dolac fish market',
      ],
      mooringTip:
        'Rijeka has a small charter quay near the city centre; berth limited. ACI Marina Opatija (Ičići) for an alternative protected overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rijeka.webp', alt: 'Rijeka' }],
    },
    {
      id: 'rijeka-crikvenica',
      routeFrom: 'Rijeka',
      routeTo: 'Crikvenica',
      day: 11,
      mapPin: {
        desktop: { left: 55.2, top: 20.5 },
        mobile: { left: 55.2, top: 20.5 },
      },
      description:
        "From coast to Crikvenica, where vineyards of Vinodol Valley converge. After snorkel over Roman remains close to Kaštel, climb to Grič's chapel. Feast on škampi Na buzaru, garlic prawns, as swallows fly across lavender sky. Crikvenica marina is small — pre-book. Anchor outside the port in light winds. Plan to snorkel the Roman ruins, vinodol vineyard visit, hike to Grič chapel viewpoint.",
      shortDescription:
        'Easy 12 nm hop south to Crikvenica — the Vinodol coast of vineyards and citrus orchards. The Roman ruins of Antiqua Ad Turres still emerge from the seabed off the Kaštel headland; the Vinodol Charter (1288) signed at Bribir is one of the oldest preserved European vernacular legal codes.',
      thingsToDo: [
        'Snorkel the Roman ruins',
        'Vinodol vineyard visit',
        'Hike to Grič chapel viewpoint',
        'Škampi buzara dinner ashore',
      ],
      mooringTip: 'Crikvenica marina is small — pre-book. Anchor outside the port in light winds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/crikvenica.webp', alt: 'Crikvenica' }],
    },
    {
      id: 'crikvenica-senj',
      routeFrom: 'Crikvenica',
      routeTo: 'Senj',
      day: 12,
      mapPin: {
        desktop: { left: 65.4, top: 31.3 },
        mobile: { left: 65.4, top: 31.3 },
      },
      description:
        'Track the Bura wind toward Senj, a pirate refuge below Nehaj Fortress. Taste maneštra, or bean stew, in cobblestone lanes; then, after twilight, ascend the fortress walls while the Velebit Mountains scream with stories of Uskok fighters. Senj harbour quay is short-stay only; check the marina options in nearby Stinica or Crikvenica for an overnight. Watch for Bura — leave for shelter if forecast. Plan to tour Nehaj fortress museum, walk the medieval old-town lanes, maneštra bean stew at a konoba.',
      shortDescription:
        'Twenty nautical miles south down the Velebit channel to Senj — historic stronghold of the Uskok pirate-defenders against the Ottomans. Nehaj Fortress (1558) sits 80 m above the harbour; the Velebit massif rises 1700 m straight from the sea behind the town.',
      thingsToDo: [
        'Tour Nehaj fortress museum',
        'Walk the medieval old-town lanes',
        'Maneštra bean stew at a konoba',
        'Listen for the Bura wind warning',
      ],
      mooringTip:
        'Senj harbour quay is short-stay only; check the marina options in nearby Stinica or Crikvenica for an overnight. Watch for Bura — leave for shelter if forecast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/senj.webp', alt: 'Senj' }],
    },
    {
      id: 'senj-baška-krk',
      routeFrom: 'Senj',
      routeTo: 'Baška (Krk)',
      day: 13,
      mapPin: {
        desktop: { left: 55.3, top: 31.5 },
        mobile: { left: 55.3, top: 31.5 },
      },
      description:
        'Go back to Krk, anchored in the bay shaped like Baška. Trekking the lunarscape of the Moon Plateau, strewn with old Glagolitic engravings, then plunge into the pebbled embrace of Vela Plaza. Under the bell, dine on lamb with sea salt mixing with rosemary scent.',
      shortDescription:
        'Easy 12 nm crossing back across the channel to Baška on the southern shore of Krk. Vela Plaža is one of the longest pebble beaches on the Adriatic; the limestone Bašćanska Ploča (Glagolitic stone tablet) is one of the oldest written records of Croatian.',
      thingsToDo: [
        'Walk Vela Plaža pebble shore',
        'Hike the lunar Moon Plateau trail',
        'Visit the Bašćanska Ploča museum',
        'Lamb peka at a stone konoba',
      ],
      mooringTip:
        'Baška small marina + town quay; pre-book in peak. Anchor in front of the beach in light winds — exposed to S/SE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/baska.webp', alt: 'Baska' }],
    },
    {
      id: 'baška-rab-punat',
      routeFrom: 'Baška',
      routeTo: 'Punat',
      day: 14,
      mapPin: {
        desktop: { left: 57, top: 40.6 },
        mobile: { left: 57, top: 40.6 },
      },
      description:
        'Sail to one last time the medieval spires of Rab. Swim on the lovely dunes of Lopar, then investigate Romanesque towers in Rab Town. Return to Punat as the sun gilds Krk’s limestone ridges, toasting your voyage with Žlahtina wine—the Adriatic’s whispers lingering like a lover’s promise.',
      shortDescription:
        "Final day passage 18 nm via Rab Town and back into Punat Bay — one of the Adriatic's largest natural harbours, almost entirely enclosed by Krk's coast. Marina Punat is the second-largest marina in Croatia by berth count and the original Croatian charter base (since 1964).",
      thingsToDo: [
        'Last swim at Rab Lopar dunes',
        'Brief stop in medieval Rab Town',
        'Žlahtina wine toast in Vrbnik',
        'Pack-and-clean for Punat handover',
      ],
      mooringTip:
        'Marina Punat is full-service with own boatyard and fuel quay. Request fuel slot 24h ahead and confirm berth before final approach.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rab.webp', alt: 'Rab' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/map.webp',
        alt: 'Punat Route Image',
      },
      width: 1480,
      height: 1556,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/mobile-map.webp',
        alt: 'Punat Route Image',
      },
      width: 1064,
      height: 1514,
    },
  },
};

export default computeItineraryNumberOfDays(punat14DaysRoute);
