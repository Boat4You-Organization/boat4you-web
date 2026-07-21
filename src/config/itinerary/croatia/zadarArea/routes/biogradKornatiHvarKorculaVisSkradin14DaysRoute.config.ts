import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const biogradKornatiHvarKorculaVisSkradin14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Biograd–Kornati–Vis–Skradin Yacht Route | Boat4You',
  metaDesc:
    'Sail a 14-day yacht charter from Biograd na Moru through Kornati, Hvar, Korčula, Vis, ending in Skradin. Discover hidden bays, historic islands & Adriatic beauty.',
  id: 'biograd-na-moru-kornati-hvar-korcula-vis-skradin-14days-route',
  startingPoint: 'Biograd na Moru',
  otherPoints: ['Kornati', 'Hvar', 'Korcula', 'Vis', 'Skradin'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/biograd-kornati-14-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/kornati-banner-large.webp', alt: 'Kornati' },
    {
      src: '/images/itinerary/croatia/banners/national-park-kornati-banner-large.webp',
      alt: 'National park Kornati',
    },
    {
      src: '/images/itinerary/croatia/banners/skradin-marina-banner.webp',
      alt: 'Skradin marina',
    },
    {
      src: '/images/itinerary/croatia/banners/primosten-marina-banner.webp',
      alt: 'Primosten marina',
    },
  ],
  routeDays: [
    {
      id: 'biograd-na-moru-izut',
      routeFrom: 'Biograd na moru',
      routeTo: 'Island Žut',
      day: 1,
      mapPin: {
        desktop: { left: 23.2, top: 34.9 },
        mobile: { left: 19.7, top: 43 },
      },
      description:
        'Start in Biograd, often known as the "White City," where marinas bask in the sun and a heritage that dates back centuries. Get on a boat and head to Žut, a stunning Kornati jewel where the cliffs plunge into azure solitude. While snorkeling over seabeds covered with starfish, anchor in a quiet bay. Enjoy brudet (fish stew) at a lonely bar while staring up at the dark sky and the aroma of wild sage mingling with the salty air.',
      shortDescription:
        "Twenty nautical miles south out of Biograd to Žut — the largest of the Kornati's outer islands, with quiet anchorages all around. Three small konobe operate seasonally; year-round population is zero.",
      thingsToDo: [
        'Anchor in Žut Bay',
        'Hike up to lookout point',
        'Snorkel sheltered shallows',
        'Brudet fish stew at the konoba',
      ],
      mooringTip: 'Restaurant moorings off Žut Bay — pay for dinner ashore and the buoy is included.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zut.webp', alt: 'Žut' }],
    },
    {
      id: 'izut-pantera-bay-dugi-otok',
      routeFrom: 'Žut',
      routeTo: 'Pantera Bay (Dugi Otok)',
      day: 2,
      mapPin: {
        desktop: { left: 25.7, top: 28.3 },
        mobile: { left: 23.1, top: 35.5 },
      },
      description:
        "Nordward, you will find Dugi Otok's untamed spirit. With its gravel beaches and pine-covered cliffs, Pantera Bay is the perfect place to anchor your boat. Hike up to Veli Rat Lighthouse, whose white spire slices through the golden light of nightfall, after kayaking through secret sea caverns. In the company of the stars, as the waves whispered legends, dine on grilled squid.",
      shortDescription:
        "Coastal sail north to Pantera Bay — a sheltered cove on Dugi Otok's northern shore. Veli Rat lighthouse (40 m) is the tallest in the Adriatic; built in 1849 with egg whites mixed into the masonry to whiten the limestone.",
      thingsToDo: [
        'Climb Veli Rat lighthouse',
        'Snorkel underwater caverns',
        'Walk to Sakarun sandy beach',
        'Grilled squid on the deck',
      ],
      mooringTip: 'Free anchoring on sand at 5-8 m, sheltered from N/NE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/pantera-bay.webp', alt: 'Dugi otok' }],
    },
    {
      id: 'pantera-bay-vrulja-bay-kornati-np',
      routeFrom: 'Pantera Bay',
      routeTo: 'Vrulja Bay (Kornati NP)',
      day: 3,
      mapPin: {
        desktop: { left: 32.2, top: 44.2 },
        mobile: { left: 28.7, top: 48 },
      },
      description:
        "Sail into the stone maze of Kornati, where 89 islands thread myth into reality. Drop anchor in Vrulja Bay among shimmering coral gardens reminiscent of buried galaxies. Grill fresh catch on deck as evening fires the cliffs; the horizon blazing with amber and violet—nature's parting kiss to the day.",
      shortDescription:
        'Easy 12 nm leg into the heart of Kornati National Park to Vrulja Bay on Kornat island. The bay holds the largest restaurant cluster in the entire archipelago — three side-by-side konobe with full restaurant moorings.',
      thingsToDo: [
        'Snorkel coral gardens',
        'Hike up Metlina (237 m)',
        'See the dry-stone walls of Kornat',
        'Grill fresh fish on deck',
      ],
      mooringTip: 'Pre-paid Park ticket on entry. Restaurant moorings off Vrulja — pay for dinner ashore.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Kornati' }],
    },
    {
      id: 'vrulja-primosten',
      routeFrom: 'Vrulja',
      routeTo: 'Primošten',
      day: 4,
      mapPin: {
        desktop: { left: 52.7, top: 58.9 },
        mobile: { left: 52.7, top: 58.9 },
      },
      description:
        'Race south to Primošten, where the terracotta rooftops are falling toward the sea. Swim under the famous vineyard island, set in limestone amphitheater form. Sip bold Babič wine at a cliffside bar, then stroll cobbled lanes where fisherman repair nets to match lapping waves.',
      shortDescription:
        'Twenty nautical mile leg south past Šibenik to Primošten — the medieval town set on a near-island headland. The Bucavac vineyards on the surrounding terraces produce the dense Babić red.',
      thingsToDo: [
        'Swim below Bucavac vineyard',
        'Climb to St. George cliff church',
        'Babić red wine tasting',
        'Dinner at Konoba Mediteran',
      ],
      mooringTip: 'Marina Kremik (1.5 nm south) is the standard berth — pre-book in summer.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primosten' }],
    },
    {
      id: 'primosten-trogir',
      routeFrom: 'Primošten',
      routeTo: 'Trogir',
      day: 5,
      mapPin: {
        desktop: { left: 62.8, top: 63.8 },
        mobile: { left: 62.8, top: 63.8 },
      },
      description:
        'Dock at Trogir, a Roman ruin and Venetian palace maze. Then cool yourself with lemon gelato on the riva after losing yourself in the stone lacework of St. Lawrence Cathedral. Under Trakoščan Castle at evening, paddleboards reflect rippling lunar waves.',
      shortDescription:
        'Easy 14 nm leg southeast to Trogir — the UNESCO World Heritage island town, a 13th-century Romanesque-Gothic walled city built on a small islet between the mainland and Čiovo. Cathedral of St. Lawrence (Radovan portal) is the headline.',
      thingsToDo: [
        'Tour UNESCO Cathedral of St. Lawrence',
        'Climb the Kamerlengo fortress',
        'Walk the medieval Riva',
        'Lemon gelato in the cathedral square',
      ],
      mooringTip: 'ACI Marina Trogir (Čiovo side) is the safe pre-book; town quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/trogir.webp', alt: 'Trogir' }],
    },
    {
      id: 'trogir-hvar',
      routeFrom: 'Trogir',
      routeTo: 'Hvar',
      day: 6,
      mapPin: {
        desktop: { left: 70.8, top: 81.9 },
        mobile: { left: 81, top: 71.8 },
      },
      description:
        'Follow the horizon to Hvar, where coves dotted with lavender meadows merge with yacht-studded platforms. Slip inside a secret konoba for truffle-laced pasta after climbing Španjola Fortress for sunset views of the Pakleni Islands. Rosemary cocktails in a palace patio, DJ rhythms throbbing through old stone, let the glitz of Hvar Town enthrall you.',
      shortDescription:
        "Coastal sail south past Brač and Šolta into Hvar — the Adriatic's most fashionable port, with the largest open public square in Dalmatia, a 16th-century Spanish fortress, and the Pakleni Islands directly opposite the harbour.",
      thingsToDo: [
        "Tour Hvar's St. Stephen Cathedral",
        'Hike to Španjola Fortress at sunset',
        'Day-cruise the Pakleni Islands',
        'Cocktails at Hula-Hula sunset bar',
      ],
      mooringTip: 'ACI Marina Palmižana on Sveti Klement (Pakleni Is., 2 nm) is the safest pre-book.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-korcula',
      routeFrom: 'Hvar',
      routeTo: 'Korčula',
      day: 7,
      mapPin: {
        desktop: { left: 89.6, top: 89.4 },
        mobile: { left: 93.9, top: 81 },
      },
      description:
        'Sail to Korčula, supposedly the birthplace of Marco Polo. Travel herringbone streets to a rooftop bar for grk wine; sea breeze softens the bitter taste. See the moreška sword dance at dusk, where 500 years of history reverberate fights of love and bloodshed.',
      shortDescription:
        "Long 35 nm leg southeast to Korčula — the walled town with claim to Marco Polo's birthplace, a Venetian-era fishbone street plan optimised against the sirocco wind, and the unique moreška sword dance still performed in summer.",
      thingsToDo: [
        "Visit Marco Polo's birthplace house",
        'Climb the cathedral bell tower',
        'Watch the moreška sword dance',
        'Grk wine in the herringbone lanes',
      ],
      mooringTip:
        'ACI Marina Korčula is small — pre-book. Exposed in sirocco — re-anchor or shift to a leeward bay if forecast peaks above 25 kn. Alternative: nearest sheltered marina if conditions deteriorate overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/korcula.webp', alt: 'Korcula' }],
    },
    {
      id: 'korcula-skrivena-luka-lastovo',
      routeFrom: 'Korčula',
      routeTo: 'Skrivena Luka (Lastovo)',
      day: 8,
      mapPin: {
        desktop: { left: 50, top: 50 },
        mobile: { left: 47.9, top: 49.2 },
      },
      description:
        'Lastovo\'s "Hidden Harbor" welcomes your yacht by itself. After hiking pine paths to a hilltop church, plunge into water so quiet it reflects the skies. Feast on smoked pig at a farmhouse; rakija flows as residents weave stories of pirate ghosts and starlit secrets.',
      shortDescription:
        "Coastal sail south to Lastovo — Croatia's most remote inhabited island and a designated Nature Park. Skrivena Luka (Hidden Harbour) on the south coast is one of the most sheltered overnight anchorages in Croatia.",
      thingsToDo: [
        'Tour Skrivena Luka anchorage',
        'Hike to Sušac lighthouse views',
        'See the Lastovo poklad procession story',
        'Smoked-pork dinner at a farmhouse',
      ],
      mooringTip: 'Pre-paid Lastovo Nature Park ticket. Restaurant moorings in Skrivena Luka.',
      gallery: [
        {
          src: '/images/itinerary/croatia/destinations/skrivena-luka.webp',
          alt: 'Skrivena Luka',
        },
      ],
    },
    {
      id: 'skrivena-luka-komiza-vis',
      routeFrom: 'Skrivena Luka',
      routeTo: 'Komiža (Vis)',
      day: 9,
      mapPin: {
        desktop: { left: 59.4, top: 88.2 },
        mobile: { left: 65, top: 77.3 },
      },
      description:
        'Originally a military fortitude, Sail to Vis is now an open secret. Pastel cottages built by Komiža frame a bay where nets are repaired by fisherman. climb Hum Hill for sunset, then feast on komiška pogača, a savory anchovy pie, at a table caressed by sea spray.',
      shortDescription:
        'Long offshore 25 nm passage north to Vis — the most isolated mid-Dalmatian island, closed to outsiders during Yugoslav military years and only reopened in 1989. Komiža is the western fishing port.',
      thingsToDo: [
        'Day trip to the Blue Cave',
        'Climb Hum Hill at sunset',
        'Komiška pogača anchovy pie',
        'Tour the Vis Fishing Museum',
      ],
      mooringTip: 'Komiža harbour is short-stay only; pre-book ACI Marina Vis (other side of the island).',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-zlarin',
      routeFrom: 'Komiža',
      routeTo: 'Zlarin',
      day: 10,
      mapPin: {
        desktop: { left: 49.8, top: 55.2 },
        mobile: { left: 50.7, top: 54.1 },
      },
      description:
        "The “Coral Island,” Zlarin welcomes you with car-free peace. Snorkel red coral gardens, then stroll paths surrounded by craft stores. Sip loza rakija on a bench sun-warmed, Šibenik's fortitude shining amber in the distance. Zlarin harbour quay is short-stay; anchor outside the bay on sand at 5-7 m. Plan to tour the Coral Centre museum, walk car-free island paths, shop a coral workshop.",
      shortDescription:
        "Long 30 nm leg back northeast across the channel to Zlarin — Croatia's coral-diving island, car-free, with a single village around the harbour. Coral has been hand-harvested off Zlarin since the 15th century.",
      thingsToDo: [
        'Tour the Coral Centre museum',
        'Walk car-free island paths',
        'Shop a coral workshop',
        'Loza rakija on the harbour bench',
      ],
      mooringTip: 'Zlarin harbour quay is short-stay; anchor outside the bay on sand at 5-7 m.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zlarin.webp', alt: 'Zlarin' }],
    },
    {
      id: 'zlarin-skradin-krka-np',
      routeFrom: 'Zlarin',
      routeTo: 'Skradin (Krka NP)',
      day: 11,
      mapPin: {
        desktop: { left: 45.1, top: 53.7 },
        mobile: { left: 43.4, top: 55.1 },
      },
      description:
        'Wander inland beside the Krka River, where waterfalls howl like dragons. Swim under the cascades of Skradinski Buk, then picnic on Pag cheese under dappled shadow. By night, eat in the medieval square of Skradin, and see fireflies dancing over stone arches like live confetti.',
      shortDescription:
        'Inland river leg up the Krka through the lower Šibenik basin to Skradin — a small medieval town inside Krka National Park. ACI Marina Skradin sits at the river mouth. Plan to boat transfer up to Skradinski Buk and cycle a Krka park trail.',
      thingsToDo: [
        'Boat transfer up to Skradinski Buk',
        'Walk Skradin medieval lanes',
        'Cycle a Krka park trail',
        'Dalmatian prosciutto picnic',
      ],
      mooringTip: 'ACI Marina Skradin sits at the river mouth. Pre-book in July-August.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/skradin.webp', alt: 'Krka' }],
    },
    {
      id: 'skradin-tijat',
      routeFrom: 'Skradin',
      routeTo: 'Tijat',
      day: 12,
      mapPin: {
        desktop: { left: 43.5, top: 51 },
        mobile: { left: 33.6, top: 53.5 },
      },
      description:
        'Anchor at Tijat, an island where time disappears. Kayak across mangroves then relax in hammocks strung between olive trees. Grill sardines on deck as evening gilds the bay; the only sound the lap of waves and your own heartbeat produces.',
      shortDescription:
        'Easy 8 nm back down the river and along the coast to Tijat — a tiny uninhabited island in the Šibenik archipelago, surrounded by pine-clad islets. Quiet anchorage day, no facilities ashore.',
      thingsToDo: [
        'Kayak the offshore islets',
        'Snorkel sheltered shallows',
        'Hammock between olive trees',
        'Grill sardines on the deck',
      ],
      mooringTip: 'Free anchoring on sand and seagrass at 5-8 m. No services — stock up at Skradin or Šibenik.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/tijat.webp', alt: 'Tijat' }],
    },
    {
      id: 'tijat-murter',
      routeFrom: 'Tijat',
      routeTo: 'Murter',
      day: 13,
      mapPin: {
        desktop: { left: 44.2, top: 45.6 },
        mobile: { left: 42, top: 48.1 },
      },
      description:
        'Get back to Murter, the Kornati gateway. Claim the golden sand of Slanica Beach for a last swim, then feast on pasticada—beef braised in wine—at a tavern covered in vines. Let clinking glasses match far-off accordion melodies, a goodbye song from the sea.',
      shortDescription:
        'Easy 8 nm to Murter — the gateway island for Kornati charters and itself the home base for many of the konoba owners on the Kornati islands. Slanica Beach is the headline sandy bay.',
      thingsToDo: [
        'Swim sandy Slanica Beach',
        'Tour the Murter ethno museum',
        'Walk the Tisno bridge',
        'Pašticada beef stew at a vine konoba',
      ],
      mooringTip: 'Marina Hramina or Marina Betina (both within 1 nm of Murter Town) — pre-book in summer.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/murter.webp', alt: 'Murter' }],
    },
    {
      id: 'murter-biograd-na-moru',
      routeFrom: 'Murter',
      routeTo: 'Biograd na moru',
      day: 14,
      mapPin: {
        desktop: { left: 40.1, top: 42.1 },
        mobile: { left: 37.7, top: 44.6 },
      },
      description:
        'Sail homeward, stopping to dive in Molat\'s "Moon Craters," buried karst gardens bursting with life. Go back to Biograd; the lights of the marina seem to be grounded stars. Under an indigo sky, toast your journey with crni rižot; the whisper of the Adriatic will always be carried with you.',
      shortDescription:
        'Final 8 nm leg back along the coast to Biograd. Time the approach for sunset on the Riva. Marina Kornati or Marina Šangulin — both inside the old-town breakwater. Plan to final swim in Pašman coves and walk the Biograd Riva.',
      thingsToDo: [
        'Final swim in Pašman coves',
        'Walk the Biograd Riva',
        'Visit the Heritage Museum',
        'Crni rižot dinner at the marina',
      ],
      mooringTip:
        'Marina Kornati or Marina Šangulin — both inside the old-town breakwater. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/biograd.webp', alt: 'Biograd na moru' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Biograd Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Biograd Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(biogradKornatiHvarKorculaVisSkradin14DaysRoute);
