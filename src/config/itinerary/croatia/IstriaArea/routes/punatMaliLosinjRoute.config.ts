import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const punatMaliLosinjRoute: ItineraryRoute = {
  metaTitle: '7-Day Punat–Mali Lošinj Yacht Charter Route | Istria & Kvarner Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Punat via Lopar (Rab), Novalja, Susak to Mali Lošinj. Discover sandy beaches, hidden coves & unique island charm.',
  id: 'punat-mali-losinj-route',
  startingPoint: 'Punat',
  otherPoints: ['Mali Lošinj'],
  cardImage: {
    src: '/images/itinerary/croatia/istria-itinerary/routes/punat-mali-losinj-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/krk-banner-large.webp', alt: 'Krk' },
    { src: '/images/itinerary/croatia/banners/cres-banner-large.webp', alt: 'Cres' },
    { src: '/images/itinerary/croatia/banners/lovran-banner.webp', alt: 'Lovran' },
    { src: '/images/itinerary/croatia/banners/cres-banner.webp', alt: 'Cres' },
  ],
  routeDays: [
    {
      id: 'punat-lopar-rab',
      routeFrom: 'Punat (Krk)',
      routeTo: 'Lopar (Rab)',
      day: 1,
      mapPin: {
        desktop: { left: 58.8, top: 49.9 },
        mobile: { left: 58.8, top: 49.9 },
      },
      description:
        "Start your journey at Punat, a calm marina on Krk Island, where the air smells of pine mixed with sea. Sail north to Lopar, the northern point of Rab known for its beautiful Paradise Beach. Wander around Lopar's sandy dunes, then go to the 12th-century St. Euphemia Church for expansive views of the Kvarner Gulf. Feast on Rab cake (Rapska torta), a delectable almond confection created years ago by nearby sisters.",
      shortDescription:
        "Easy 18 nm leg out of Punat south to the Lopar peninsula on Rab. Lopar's Sahara Beach (sandy dunes, rare in Croatia) and the Rajska Plaža (Paradise Beach, 1.5 km of golden sand) are the headline shores of the upper Adriatic.",
      thingsToDo: [
        'Walk Paradise Beach (1.5 km sand)',
        'Beach day at Sahara dunes',
        'Hike to Lopar lookout cross',
        'Rapska torta at the bakery',
      ],
      mooringTip: 'Anchor in San Marino Bay sheltered from N/NE; Lopar pier is for ferries, not charter overnights.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lopar.webp', alt: 'Lopar' }],
    },
    {
      id: 'lopar-novalja-pag',
      routeFrom: 'Lopar',
      routeTo: 'Novalja (Pag)',
      day: 2,
      mapPin: {
        desktop: { left: 64.3, top: 55.5 },
        mobile: { left: 64.3, top: 55.5 },
      },
      description:
        "Glide southwest to the island of strikingly moonlike beauty, Pag. Dock in Novalja, where electric nightlife meets olive gardens and salt pans. Discover Lun's ancient olive woodland, where millennia of Bura winds have twisted gnarled trees. Pair a crisp Žlahtina wine with lamb slow-roasted under ash and relish Paški sir, the renowned sheep cheese, at sunset.",
      shortDescription:
        "Short crossing southwest to Novalja, the lively summer capital of Pag — Croatia's longest island and the country's most distinctive lunar moonscape. Zrće Beach hosts the headline Adriatic festival nightlife.",
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
        desktop: { left: 42.1, top: 47.1 },
        mobile: { left: 42.1, top: 47.1 },
      },
      description:
        'Sail to Susak, a sandy oasis where time seems to stop. The women on this car-free island still wear vibrant folk clothes, and walkways meander across aromatic sage fields. Explore the blue shallows of Bok Bay then climb to the hilltop chapel to see sunset. At a family konoba, dine on homemade rakija and šokol, or fig cake, while crickets fill the evening.',
      shortDescription:
        "Long 25 nm crossing west to Susak — the Adriatic's only true sand island, formed entirely from windblown loess soil. Population under 100 year-round; the women wear distinctive short red-orange skirts on local festivals.",
      thingsToDo: [
        'Walk the windblown sandy paths',
        'Swim shallow Bok Bay',
        'Try šokol cured meat with the locals',
        'Sunset from the hilltop chapel',
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
        desktop: { left: 46.8, top: 58.2 },
        mobile: { left: 46.8, top: 58.2 },
      },
      description:
        'Chart Mali Lošinj, the "Island of Vitality." Anchor at Čikat Bay, a crescent of stones lapped by sparkling waves. Cycle scented routes through pine forests to Veli Lošinj\'s Baroque homes, then stop at the Apoxyomenos Museum to see the 2,000-year-old "Croatian Athlete" bronze monument. On a balcony by the harbor, finish the day with scampi buzara, spicy shrimp stew.',
      shortDescription:
        "Short 6 nm hop east to Mali Lošinj. The Apoxyomenos bronze (1st-century BC athlete pulled from the seabed in 1999) is the museum highlight; Čikat Bay's medicinal-pine air gave Lošinj its WHO climatic-spa status more than a century ago.",
      thingsToDo: [
        'See the Apoxyomenos bronze athlete',
        'Cycle the aromatic Čikat trails',
        'Evening at Veli Lošinj Riva',
        'Scampi buzara at the harbour',
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
        desktop: { left: 41.5, top: 54.6 },
        mobile: { left: 41.5, top: 54.6 },
      },
      description:
        "Sail to Unije, a car-free paradise where wild beaches challenge Croatia's stony convention. Kayak to the secret coves of Maracol Bay, then accompany fishermen carrying nets at evening. Feast on brudet (fish stew) beneath a star-filled sky mirror reflecting the Milky Way in quiet bay.",
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
      id: 'unije-cres',
      routeFrom: 'Unije',
      routeTo: 'Cres',
      day: 6,
      mapPin: {
        desktop: { left: 40, top: 40 },
        mobile: { left: 40, top: 40 },
      },
      description:
        'Flying above the Tramuntana Forest, griffon vultures glide to Cres, an island. Dock in Cres Town, a medieval Venetian arches and stone well maze. Swim on the turquoise waves of Slatina Beach, then climb to Lubenice, a village on the edge locked in time. Dine on Cres lamb, grilled with wild herbs, its taste wild as the island.',
      shortDescription:
        'Easy 12 nm hop east to Cres Town — the medieval administrative centre of Cres island. The Venetian arched waterfront, a Romanesque cathedral, and the protected harbour are textbook upper-Adriatic charter scenery; the Tramuntana forest above hosts a griffon vulture colony.',
      thingsToDo: [
        'Walk medieval Cres Town lanes',
        'Hike up to Lubenice cliff village',
        'Swim turquoise Slatina Bay',
        'Cres lamb at a stone konoba',
      ],
      mooringTip: 'Cres Town has a small marina + town quay; pre-book in peak. Anchor in Tiha Bay on sand at 5-8 m.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/cres.webp', alt: 'Cres' }],
    },
    {
      id: 'cres-malinska-punat',
      routeFrom: 'Cres',
      routeTo: 'Punat',
      day: 7,
      mapPin: {
        desktop: { left: 59.3, top: 44.8 },
        mobile: { left: 59.3, top: 44.8 },
      },
      description:
        "Go back to Krk, anchored in the calm bay of Malinska. Swim in Porto's sun-dappled shallows then meander across vineyards to the Glavotok Monastery from 15th century. Toast your path with Vrbnička Žlahtina wine by a konoba covered in bougainvillea. Sail back to Punat when the light gilds the Velebit Mountains, the Adriatic whispering, You'll see me shortly.",
      shortDescription:
        'Final coastal sail back across to Krk, with a Malinska swim stop on the western shore, then south to Marina Punat — the second-largest marina in Croatia by berth count and the original Croatian charter base (since 1964).',
      thingsToDo: [
        'Swim Malinska shallows',
        'Visit Glavotok Monastery',
        'Žlahtina wine at a Vrbnik konoba',
        'Pack-and-clean for handover',
      ],
      mooringTip:
        'Marina Punat is full-service with own boatyard and fuel quay. Request fuel slot 24h ahead and confirm berth before final approach.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/malinska.webp', alt: 'Malinska' }],
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

export default computeItineraryNumberOfDays(punatMaliLosinjRoute);
