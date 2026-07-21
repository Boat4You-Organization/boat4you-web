import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const pula14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Pula Yacht Charter Route | Istria & Kvarner Sailing Adventure',
  metaDesc:
    'Embark on a 14-day yacht charter from Pula exploring Istria & Kvarner—Rovinj, Cres, Lošinj, Brijuni, Rabac & beyond—hidden coves, historic towns & Adriatic charm.',
  id: 'pula-14days',
  startingPoint: 'Pula',
  otherPoints: ['14 Days'],
  cardImage: {
    src: '/images/itinerary/croatia/istria-itinerary/routes/pula-14-days-card-image.webp',
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
      id: 'pula-rabac',
      routeFrom: 'Pula',
      routeTo: 'Rabac',
      day: 1,
      mapPin: {
        desktop: { left: 30.6, top: 31.5 },
        mobile: { left: 30.6, top: 31.5 },
      },
      description:
        "Start your trip at Pula, where the Roman Amphitheatre is a stoic guardian of past events. Sail east to Rabac, the “Pearl of Kvarner,” where green waters lap against a crescent of stones. Wander Rabac's promenade as the sun sets behind Učka Mountain, then savor scampi na buzaru (garlicky shrimp stew) in a seaside bar, the air heavy with the aroma of rosemary and salt.",
      shortDescription:
        "Long opening passage 35 nm around the southern tip of Istria and into the Kvarner Gulf to Rabac. The Učka mountain rising behind the village is the most dramatic backdrop on Croatia's east-Istrian coast — a former fishing village that grew into a quiet resort without losing its scale.",
      thingsToDo: [
        "Walk Rabac's curved promenade",
        'Take the cable car up Mount Učka',
        'Hike to the medieval Labin old town',
        'Scampi buzara dinner at the harbour',
      ],
      mooringTip:
        'ACI Marina Rabac is the safe pre-book; town quay only short-stay. Anchor outside the bay in light winds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rabac.webp', alt: 'Rabac' }],
    },
    {
      id: 'rabac-cres-island',
      routeFrom: 'Rabac',
      routeTo: 'Cres Island',
      day: 2,
      mapPin: {
        desktop: { left: 41.7, top: 36.8 },
        mobile: { left: 44.2, top: 39.2 },
      },
      description:
        'Set off for Cres, an island where griffon vultures fly above the Tramuntana woodland. Anchor above submerged Roman mosaics in Valun Bay. Snorkel. Taste as wild as the island itself, eat Cres lamb cooked with wild herbs and hike to Lubenice, a cliffside town locked in time.',
      shortDescription:
        'Easy 12 nm crossing east to Cres. Valun Bay sits below the cliff-perched village of Lubenice (population still under 30) — one of the longest continuously inhabited settlements on the Adriatic. The Tramuntana forest above hosts a protected griffon vulture colony.',
      thingsToDo: [
        'Hike up the Lubenice cliff trail',
        'See the 10th-century Valun Tablet',
        'Watch griffon vultures soar overhead',
        'Cres lamb dinner at a stone konoba',
      ],
      mooringTip:
        'Restaurant moorings off Valun village — free with dinner ashore. Anchor on sand at 7-10 m further out.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/cres.webp', alt: 'Cres' }],
    },
    {
      id: 'cres-unije-island',
      routeFrom: 'Cres',
      routeTo: 'Unije Island',
      day: 3,
      mapPin: {
        desktop: { left: 41.3, top: 45.2 },
        mobile: { left: 44.4, top: 45.2 },
      },
      description:
        "Glide to Unije, car-free where sandy beaches deviate from Croatia's rocky convention. Kayak to Maracol Bay, where blue waves are behind limestone cliffs. Join fisherman dragging nets at evening, then have brudet, fish stew, under a star-dusted sky. Small fishing-port quay — first-come. Anchor in Maracol Bay on sand at 4-6 m, sheltered from N/NE. Plan to swim Maracol sandy bay, walk the car-free island path, watch sunset from the lighthouse. hort hop south to Unije — population under 100, no cars on the island, and one of the few sandy-beach destinations in northern Croatia (Maracol Bay's golden-sand shore is exceptional for the Adriatic).",
      shortDescription:
        "Short hop south to Unije — population under 100, no cars on the island, and one of the few sandy-beach destinations in northern Croatia (Maracol Bay's golden-sand shore is exceptional for the Adriatic).",
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
      id: 'unije-premuda-island',
      routeFrom: 'Unije',
      routeTo: 'Premuda Island',
      day: 4,
      mapPin: {
        desktop: { left: 41.5, top: 52.4 },
        mobile: { left: 44.2, top: 52.4 },
      },
      description:
        'Dive the WWI relic, the Tunjina underwater tunnel, from Sail to Premuda, a spit of land with a great narrative. Picnic on limestone bluffs on Pršut (Istrian prosciutto), then see the horizon swallowing the sun entirely. Free anchoring in Krijal Bay on sand at 5-8 m; sheltered from S/SW. Restaurant moorings available. Plan to wreck dive (organised) the Szent István, hike the Premuda spine trail, pršut and figs picnic ashore. hort south crossing to Premuda — a thin limestone island with one of the most famous wreck-dive sites in the Adriatic (the WWI Austro-Hungarian battleship SMS Szent István sits at 65 m). Population around 70, two tavernas.',
      shortDescription:
        'Short south crossing to Premuda — a thin limestone island with one of the most famous wreck-dive sites in the Adriatic (the WWI Austro-Hungarian battleship SMS Szent István sits at 65 m). Population around 70, two tavernas.',
      thingsToDo: [
        'Wreck dive (organised) the Szent István',
        'Hike the Premuda spine trail',
        'Pršut and figs picnic ashore',
        'Limestone-bluff sunset',
      ],
      mooringTip: 'Free anchoring in Krijal Bay on sand at 5-8 m; sheltered from S/SW. Restaurant moorings available.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/premuda.webp', alt: 'Premuda' }],
    },
    {
      id: 'premuda-zapuntel-molat-island',
      routeFrom: 'Premuda',
      routeTo: 'Zapuntel, Molat Island',
      day: 5,
      mapPin: {
        desktop: { left: 51.9, top: 69 },
        mobile: { left: 55.7, top: 67.1 },
      },
      description:
        "Anchor in Molat's Zapuntel Bay, a remote paradise with pebble coastlines where pine forests meet. Search for sea glass on abandoned beaches; then, join residents for gregada (fisherman's stew) in Brgulje Village, where evening accordion music flows out. Free anchoring on sand at 5-8 m. Sheltered from S/SE; exposed to the Bora — leave for Zadar if a Bora is forecast. Plan to walk between Brgulje and Zapuntel villages, beachcombing for sea glass, gregada (fisherman. asy coastal sail to Molat — one of the quietest islands in the Zadar archipelago. Zapuntel Bay is on the northern shore: pebble beaches, pine forest, and a population that swells from 20 to 200 in August.",
      shortDescription:
        'Easy coastal sail to Molat — one of the quietest islands in the Zadar archipelago. Zapuntel Bay is on the northern shore: pebble beaches, pine forest, and a population that swells from 20 to 200 in August.',
      thingsToDo: [
        'Walk between Brgulje and Zapuntel villages',
        'Beachcombing for sea glass',
        "Gregada (fisherman's stew) ashore",
        'Stargazing in true dark-sky waters',
      ],
      mooringTip:
        'Free anchoring on sand at 5-8 m. Sheltered from S/SE; exposed to the Bora — leave for Zadar if a Bora is forecast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/molat.webp', alt: 'Molat' }],
    },
    {
      id: 'molat-bozava-dugi-otok',
      routeFrom: 'Molat',
      routeTo: 'Božava, Dugi Otok',
      day: 6,
      mapPin: {
        desktop: { left: 59.6, top: 73.6 },
        mobile: { left: 64.6, top: 71.5 },
      },
      description:
        'Follow the morning to the Božava at Dugi Otok, where blue depths meet rocks. After swimming in the sugar-white sand of Sakarun Bay, climb to Veli Rat Lighthouse. Feast on grilled orada, sea bream, as the heavens ablaze in orange tones.',
      shortDescription:
        'Short hop east to the northern shore of Dugi Otok and Božava. Sakarun Bay (1 nm to the west) has the only Caribbean-style white-sand beach in the Zadar archipelago; Veli Rat lighthouse is the tallest in the Adriatic.',
      thingsToDo: [
        'Swim sandy Sakarun Bay',
        'Tour the Veli Rat lighthouse',
        'Photograph the lavender-pink sunset',
        'Grilled orada at the harbour',
      ],
      mooringTip: 'Božava harbour quay is small — pre-book. Anchor in Sakarun Bay 1 nm west on sand at 4-6 m.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/bozava.webp', alt: 'Božava' }],
    },
    {
      id: 'bozava-sali-dugi-otok',
      routeFrom: 'Božava',
      routeTo: 'Sali, Dugi Otok',
      day: 7,
      mapPin: {
        desktop: { left: 63, top: 79.8 },
        mobile: { left: 70.5, top: 77.7 },
      },
      description:
        'Sail to Sali, the beating core of Dugi Otok. Cycle to Tovarle Salt Lake; the pink tones there reflect the sunset. Join the Sali Summer Festival, dance the moreska with residents, then eat pašticada (beef stew) under fairy light strings.',
      shortDescription:
        "Easy southern leg along Dugi Otok's outer shore to Sali — the largest village on the island and the gateway to Telašćica Nature Park. Sali holds the annual Saljske Užance fishermen's festival (first weekend of August) with traditional tovareća muzika donkey-bell music.",
      thingsToDo: [
        'Cycle to the Tovarle salt pans',
        'Plan an early Telašćica day-trip',
        'Catch the Sali summer festival',
        'Pašticada beef stew at the konoba',
      ],
      mooringTip: 'ACI Marina Sali — book ahead in summer. Town quay slots come and go through the day.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/pantera-bay.webp', alt: 'Dugi otok' }],
    },
    {
      id: 'sali-telascica-nature-park-zut-island',
      routeFrom: 'Sali',
      routeTo: 'Telašćica Nature Park / Žut Island',
      day: 8,
      mapPin: {
        desktop: { left: 67.9, top: 62.2 },
        mobile: { left: 84.8, top: 87 },
      },
      description:
        "Now enter Telašćica's wild embrace—cliffs rising over the gentle lagoon of Mir Lake. From Stene Cliffs, leap and then sail to Kornati's tough outpost, Žut. Under a Milky Way so brilliant it produces shadows, grill fresh fish. Telašćica Park entry fee at the buoy. Žut has restaurant buoys in Žut Bay — pay for dinner ashore and the buoy is included. Plan to swim the saltwater Mir Lake, view the Stene cliffs from the sea, cliff jump (responsibly) into Telašćica.",
      shortDescription:
        "Short sail through Telašćica Nature Park — 14 km of fjord-like inlet, the 161 m cliffs (Stene), and the saltwater Mir Lake on Dugi Otok's southern tip. Continue 4 nm east to Žut, the northernmost outpost of the Kornati archipelago.",
      thingsToDo: [
        'Swim the saltwater Mir Lake',
        'View the Stene cliffs from the sea',
        'Cliff jump (responsibly) into Telašćica',
        'Grill fresh fish on the deck',
      ],
      mooringTip:
        'Telašćica Park entry fee at the buoy. Žut has restaurant buoys in Žut Bay — pay for dinner ashore and the buoy is included.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/telescica.webp', alt: 'Telascica' }],
    },
    {
      id: 'zut-biograd',
      routeFrom: 'Žut',
      routeTo: 'Biograd',
      day: 9,
      mapPin: {
        desktop: { left: 89, top: 91 },
        mobile: { left: 93.5, top: 87.1 },
      },
      description:
        "Race to Biograd, the White City. Near Kornati's edge, stray old churches before savoring crni rižot (black risotto) at Konoba Barbara, the taste of squid ink lingering like a salted kiss. Marina Kornati or Marina Šangulin — both inside the old-town breakwater. Pre-book in July-August. Plan to stroll the Biograd Riva, visit the Heritage Museum, day-trip to Vransko Lake nature park. hort coastal leg to Biograd — Croatia's medieval royal coronation city, now the largest charter base on the Zadar coast with three full marinas. The old town sits on a small peninsula with stone churches and a clean stone-paved Riva.",
      shortDescription:
        "Short coastal leg to Biograd — Croatia's medieval royal coronation city, now the largest charter base on the Zadar coast with three full marinas. The old town sits on a small peninsula with stone churches and a clean stone-paved Riva.",
      thingsToDo: [
        'Stroll the Biograd Riva',
        'Visit the Heritage Museum',
        'Day-trip to Vransko Lake nature park',
        'Crni rižot at Konoba Barbara',
      ],
      mooringTip: 'Marina Kornati or Marina Šangulin — both inside the old-town breakwater. Pre-book in July-August.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/biograd.webp', alt: 'Biograd na moru' }],
    },
    {
      id: 'biograd-zadar',
      routeFrom: 'Biograd',
      routeTo: 'Zadar',
      day: 10,
      mapPin: {
        desktop: { left: 78.6, top: 79.9 },
        mobile: { left: 89.3, top: 76.7 },
      },
      description:
        'Sail to Zadar, where modern meets historical. Stomp the stone steps of the sea organ, its tunes matching waves. Toast at dusk with Maraschino liqueur as the Greeting to the Sun light show lights the city. Zadar Marina (Borik) is the standard berth; Tankerkomerc Marina also serves charters. Town quay is ferry-and-fishing only. Plan to listen to the Sea Organ at sunset, greeting to the Sun light show, walk the Roman Forum ruins.',
      shortDescription:
        'Short coastal sail north to Zadar — the historic capital of northern Dalmatia. The Sea Organ (built into the Riva, plays music with wave action) and the Greeting to the Sun solar art installation light up at sunset and draw a crowd along the waterfront.',
      thingsToDo: [
        'Listen to the Sea Organ at sunset',
        'Greeting to the Sun light show',
        'Walk the Roman Forum ruins',
        'Maraschino tasting at Konoba Skoblar',
      ],
      mooringTip:
        'Zadar Marina (Borik) is the standard berth; Tankerkomerc Marina also serves charters. Town quay is ferry-and-fishing only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zadar.webp', alt: 'Zadar' }],
    },
    {
      id: 'zadar-olib-island',
      routeFrom: 'Zadar',
      routeTo: 'Olib Island',
      day: 11,
      mapPin: {
        desktop: { left: 71.9, top: 84.8 },
        mobile: { left: 78.6, top: 82.2 },
      },
      description:
        "Get away to Olib, where Caribbean rivals are sandy Slatina Bay. Bike past deserted stone towns, then have lunch in a field humming with bees on olibške makarule (pasta). Small fishing port — limited slots. Anchor in Slatina Bay on sand at 4-6 m, sheltered from N/NE. Plan to swim sandy Slatina and Banve bays, cycle the deserted stone-village trail, olibške makarule pasta lunch. uiet 12 nm crossing to Olib — population under 200, sandy beaches at Slatina and Banve bays, and an endemic pasta speciality (olibške makarule, hand-rolled by hour-long elders). One of the Adriatic's quietest charter destinations.",
      shortDescription:
        "Quiet 12 nm crossing to Olib — population under 200, sandy beaches at Slatina and Banve bays, and an endemic pasta speciality (olibške makarule, hand-rolled by hour-long elders). One of the Adriatic's quietest charter destinations.",
      thingsToDo: [
        'Swim sandy Slatina and Banve bays',
        'Cycle the deserted stone-village trail',
        'Olibške makarule pasta lunch',
        'Beachcomb for sea-polished glass',
      ],
      mooringTip: 'Small fishing port — limited slots. Anchor in Slatina Bay on sand at 4-6 m, sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/olib.webp', alt: 'Olib' }],
    },
    {
      id: 'olib-novalja-pag-island',
      routeFrom: 'Olib',
      routeTo: 'Novalja, Pag Island',
      day: 12,
      mapPin: {
        desktop: { left: 63.7, top: 56 },
        mobile: { left: 71.9, top: 57.6 },
      },
      description:
        "Sail to Pag where electrifying nightlife meets moonlike settings. Visit the old olive trees of Tour Lun, then sample Paški Sir—sheep cheese—at Gligora Dairy. By night, dance barefoot in Zrče's beach clubs, the Adriatic breeze in your hair. Novalja town quay + small marina; pre-book in summer. Anchor in nearby coves for a quieter night. Plan to paški sir tasting at Gligora dairy, visit Lun olive grove (1600 trees), day on Zrće Beach. asy 14 nm leg east to Novalja, the lively summer capital of Pag — Croatia's longest island and the country's most distinctive lunar moonscape. Zrće Beach (15 minutes by taxi from the harbour) hosts the headline Adriatic festival nightlife.",
      shortDescription:
        "Easy 14 nm leg east to Novalja, the lively summer capital of Pag — Croatia's longest island and the country's most distinctive lunar moonscape. Zrće Beach (15 minutes by taxi from the harbour) hosts the headline Adriatic festival nightlife.",
      thingsToDo: [
        'Paški sir tasting at Gligora dairy',
        'Visit Lun olive grove (1600 trees)',
        'Day on Zrće Beach',
        'Dance under sunrise at Papaya club',
      ],
      mooringTip: 'Novalja town quay + small marina; pre-book in summer. Anchor in nearby coves for a quieter night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/novalja.webp', alt: 'Novalja' }],
    },
    {
      id: 'novalja-mali-losinj',
      routeFrom: 'Novalja',
      routeTo: 'Mali Lošinj',
      day: 13,
      mapPin: {
        desktop: { left: 48.6, top: 58.5 },
        mobile: { left: 50.5, top: 54.7 },
      },
      description:
        'On Lošinj, the "Island of Vitality," return to peace. Wander pastel villas in Snorkel Čikat Bay, then backtrack. See the Apoxyomenos Museum, where an ancient bronze athlete guards island secrets 2,000 years ago. ACI Marina Mali Lošinj is the safe pre-book in summer; town quay slots are first-come. Plan to the Apoxyomenos bronze athlete, cycle the aromatic Čikat trails, sunset paddleboard the Riva. wenty nautical miles back across the channel to Mali Lošinj — the busiest harbour on the upper Adriatic charter map. Lošinj\'s medicinal-pine air gave the island its WHO-recognised "climatic spa" status more than a century ago.',
      shortDescription:
        'Twenty nautical miles back across the channel to Mali Lošinj — the busiest harbour on the upper Adriatic charter map. Lošinj\'s medicinal-pine air gave the island its WHO-recognised "climatic spa" status more than a century ago.',
      thingsToDo: [
        'See the Apoxyomenos bronze athlete',
        'Cycle the aromatic Čikat trails',
        'Sunset paddleboard the Riva',
        'Last-night seafood platter',
      ],
      mooringTip: 'ACI Marina Mali Lošinj is the safe pre-book in summer; town quay slots are first-come.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mali-losinj.webp', alt: 'Mali Lošinj' }],
    },
    {
      id: 'mali-losinj-pula',
      routeFrom: 'Mali Lošinj',
      routeTo: 'Pula',
      day: 14,
      mapPin: {
        desktop: { left: 23.3, top: 39.8 },
        mobile: { left: 23.3, top: 39.8 },
      },
      description:
        "Sail back to Pula along the dramatic northern cliffs of Cres. Stop at Susak's sandy beaches for one more dip. Disembark with salt on your skin and stories carved in your heart—the Adriatic murmurs, Come back shortly. Marina Veruda Pula or Marina Pula — both full-service, both accept charter handovers. Request fuel slot 24h ahead. Plan to swim Susak sandy dunes en route, final passage with the morning thermal, tour the Pula Roman Amphitheatre. ong 35 nm return passage back across the Kvarner Gulf to Pula. Susak Island midway has the Adriatic's most distinctive sandy dunes (the only true sand island in Croatia). Final-night handover at Marina Veruda or directly into Pula city marina.",
      shortDescription:
        "Long 35 nm return passage back across the Kvarner Gulf to Pula. Susak Island midway has the Adriatic's most distinctive sandy dunes (the only true sand island in Croatia). Final-night handover at Marina Veruda or directly into Pula city marina.",
      thingsToDo: [
        'Swim Susak sandy dunes en route',
        'Final passage with the morning thermal',
        'Tour the Pula Roman Amphitheatre',
        'Pack-and-clean for handover',
      ],
      mooringTip:
        'Marina Veruda Pula or Marina Pula — both full-service, both accept charter handovers. Request fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/marina-pula.webp', alt: 'Pula' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/map.webp',
        alt: 'Pula Route Image',
      },
      width: 1480,
      height: 1556,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/mobile-map.webp',
        alt: 'Pula Route Image',
      },
      width: 1064,
      height: 1514,
    },
  },
};

export default computeItineraryNumberOfDays(pula14DaysRoute);
