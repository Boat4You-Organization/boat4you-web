import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const zadarKornatiHvarKorculaVisSkradin14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Zadar–Kornati–Vis–Skradin Yacht Route | Boat4You',
  metaDesc:
    'Embark on a 14-day yacht charter from Zadar through Kornati, Hvar, Korčula & Vis, ending in Skradin. Explore hidden bays, historic islands & Adriatic island bliss.',
  id: 'zadar-kornati-hvar-korcula-vis-skradin-14days-route',
  startingPoint: 'Zadar',
  otherPoints: ['Kornati', 'Hvar', 'Korcula', 'Vis', 'Skradin'],
  cardImage: {
    src: '/images/itinerary/croatia/zadar-itinerary/routes/zadar-hvar-card-image.webp',
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
      id: 'zadar-izut',
      routeFrom: 'Zadar',
      routeTo: 'Island Žut',
      day: 1,
      mapPin: {
        desktop: { left: 27.4, top: 35.8 },
        mobile: { left: 27.4, top: 35.8 },
      },
      description:
        'Start at Zadar, where the melodies of the Sea Organ float over Roman remains. Sail to Žut, a tough Kornati jewel where quiet in cerulean colors falls from rocks. Anchor at a secret cove and dive into water so pure it seems like flying. At a lone taverna, dine on brudet, fish stew, while the Adriatic breeze dances across olive groves the stars ignite.',
      shortDescription:
        "Twenty-five nautical miles south out of Zadar to Žut — the largest of the Kornati's outer islands, with quiet anchorages all around. Three small konobe operate seasonally; year-round population is zero.",
      thingsToDo: [
        'Anchor in Žut Bay',
        'Hike up to lookout point',
        'Snorkel sheltered shallows',
        'Brudet fish stew at the konoba',
      ],
      mooringTip:
        'Restaurant moorings off Žut Bay — pay for dinner ashore and the buoy is included. Free anchoring further out on sand at 7-10 m.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/sukosan.webp', alt: 'Sukošan' }],
    },
    {
      id: 'izut-pantera-bay-dugi-otok',
      routeFrom: 'Žut',
      routeTo: 'Pantera Bay (Dugi Otok)',
      day: 2,
      mapPin: {
        desktop: { left: 24, top: 30.4 },
        mobile: { left: 24, top: 30.4 },
      },
      description:
        'Go north to the wild center of Dugi Otok. Pantera Bay runs your boat between pebbled beaches and pine-covered rocks. Snorkel through underwater caverns, then climb to Veli Rat Lighthouse, whose white tower pierces a twilight-painted sky canvas. Feast under a star canopy on grilled squid, the water mumbling old stories.',
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
        desktop: { left: 31.4, top: 44.3 },
        mobile: { left: 31.4, top: 44.3 },
      },
      description:
        "Sail into Kornati's lunar domain, where islands are labyrinthically stitched together from stone walls. Drop anchor in Vrulja Bay, snorkel over shimmering coral gardens like underwater gems. Grill fresh fish on deck as sunset ballet by birds glows amber as dusk descends. The cliffs are glowing.",
      shortDescription:
        'Easy 12 nm leg into the heart of Kornati National Park to Vrulja Bay on Kornat island. The bay holds the largest restaurant cluster in the entire archipelago — three side-by-side konobe with full restaurant moorings.',
      thingsToDo: [
        'Snorkel coral gardens',
        'Hike up Metlina (237 m)',
        'See the dry-stone walls of Kornat',
        'Grill fresh fish on deck',
      ],
      mooringTip:
        'Pre-paid Park ticket on entry. Restaurant moorings off Vrulja — pay for dinner and the buoy is included.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kornati.webp', alt: 'Kornati' }],
    },
    {
      id: 'vrulja-primosten',
      routeFrom: 'Vrulja',
      routeTo: 'Primošten',
      day: 4,
      mapPin: {
        desktop: { left: 53.4, top: 60.2 },
        mobile: { left: 53.4, top: 60.2 },
      },
      description:
        'Race south toward Primošten, with its terracotta rooftops falling into the sea. Swim under the famous vineyard island, then enjoy Babić wine from a bar along a cliff. Wander cobbled lanes while fisherman repair nets; the port lights sparkle like ground-based constellations.',
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
        desktop: { left: 63.9, top: 64.3 },
        mobile: { left: 63.9, top: 64.3 },
      },
      description:
        'Dock in Trogir, a stone labyrinth where Venetian palaces mumble secrets. See yourself in the sculpted portals of St. Lawrence Cathedral; then, cool off on the riva with lemon gelato. Kayak under Trakoščan Castle at evening, its reflection rippling in the moonlit canal.',
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
        desktop: { left: 70.5, top: 81.4 },
        mobile: { left: 70.5, top: 81.4 },
      },
      description:
        'Follow the horizon to Hvar, where boat-dotted bays melt lavender fields. After seeing sunset from Španjola Fortress, slide inside a secret konoba for lobster risotto. Let the glitz of Hvar Town enthrall you with sip rosemary-infused cocktails as DJ beats vibrate across old stone walls.',
      shortDescription:
        "Coastal sail south past Brač and Šolta into Hvar — the Adriatic's most fashionable port, with the largest open public square in Dalmatia, a 16th-century Spanish fortress, and the Pakleni Islands directly opposite the harbour.",
      thingsToDo: [
        "Tour Hvar's St. Stephen Cathedral",
        'Hike to Španjola Fortress at sunset',
        'Day-cruise the Pakleni Islands',
        'Cocktails at Hula-Hula sunset bar',
      ],
      mooringTip:
        'ACI Marina Palmižana on Sveti Klement (Pakleni Is., 2 nm) is the safest pre-book; Hvar town quay slots are first-come.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-korcula',
      routeFrom: 'Hvar',
      routeTo: 'Korčula',
      day: 7,
      mapPin: {
        desktop: { left: 93.2, top: 90.2 },
        mobile: { left: 93.2, top: 90.2 },
      },
      description:
        'Sail to Korčula, supposedly the birthplace of Marco Polo. Follow herringbone streets to a rooftop bar for grk wine; Adriatic breezes have reduced the bitter edge. See the moreška sword dance at evening, a clashing display of love and battle older than the cobblestones.',
      shortDescription:
        "Long 35 nm leg southeast to Korčula — the walled town with claim to Marco Polo's birthplace, a Venetian-era fishbone street plan optimised against the sirocco wind, and the unique moreška sword dance still performed in summer.",
      thingsToDo: [
        "Visit Marco Polo's birthplace house",
        'Climb the cathedral bell tower',
        'Watch the moreška sword dance',
        'Grk wine in the herringbone lanes',
      ],
      mooringTip:
        'ACI Marina Korčula is small — pre-book. Stari Grad on Hvar offers an alternative if Korčula is full.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/korcula.webp', alt: 'Korcula' }],
    },
    {
      id: 'korcula-skrivena-luka-lastovo',
      routeFrom: 'Korčula',
      routeTo: 'Skrivena Luka (Lastovo)',
      day: 8,
      mapPin: {
        desktop: { left: 50, top: 50 },
        mobile: { left: 50, top: 50 },
      },
      description:
        'The "Hidden Harbor" of Lastovo gently cradles your yacht alone. Trekkers across pine forests to reach a mountaintop chapel, then plunge into quiet water to reflect the clouds. Feast on smoked pig in a farmhouse, rakija running as residents relate stories of pirate ghosts.',
      shortDescription:
        "Coastal sail south to Lastovo — Croatia's most remote inhabited island and a designated Nature Park. Skrivena Luka (Hidden Harbour) on the south coast is one of the most sheltered overnight anchorages in Croatia.",
      thingsToDo: [
        'Tour Skrivena Luka anchorage',
        'Hike to Sušac lighthouse views',
        'See the Lastovo poklad procession story',
        'Smoked-pork dinner at a farmhouse',
      ],
      mooringTip: 'Pre-paid Lastovo Nature Park ticket. Restaurant moorings in Skrivena Luka — pay for dinner ashore.',
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
        desktop: { left: 60.2, top: 87.8 },
        mobile: { left: 60.2, top: 87.8 },
      },
      description:
        'Once restricted, sail to Vis today freely. Pastel cottages built by Komiža frame a bay where nets are repaired by fisherman. climb Hum Hill for sunset, then feast on komiška pogača, a savory anchovy pie, at a table caressed by sea spray.',
      shortDescription:
        'Long offshore 25 nm passage north to Vis — the most isolated mid-Dalmatian island, closed to outsiders during Yugoslav military years and only reopened in 1989. Komiža is the western fishing port; the Blue Cave on Biševo islet is 5 nm to the southwest.',
      thingsToDo: [
        'Day trip to the Blue Cave',
        'Climb Hum Hill at sunset',
        'Komiška pogača anchovy pie',
        'Tour the Vis Fishing Museum',
      ],
      mooringTip:
        'Komiža harbour is short-stay only; pre-book ACI Marina Vis (other side of the island) for a safer overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-zlarin',
      routeFrom: 'Komiža',
      routeTo: 'Zlarin',
      day: 10,
      mapPin: {
        desktop: { left: 52.5, top: 54.6 },
        mobile: { left: 52.5, top: 54.6 },
      },
      description:
        'The “Coral Island,” Zlarin welcomes you with car-free calm. Search for red coral in shallow seas, then meander alleyways dotted with craft stores. Sip loza rakija on a seat sun-warmed, the smell of pine and salt weaving memories. Zlarin harbour quay is short-stay; anchor outside the bay on sand at 5-7 m. Plan to tour the Coral Centre museum, walk car-free island paths, shop a coral workshop.',
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
        desktop: { left: 52.7, top: 48.2 },
        mobile: { left: 52.7, top: 48.2 },
      },
      description:
        'Wander inland beside the Krka River, where waterfalls howl like dragons. Swim under the cascades of Skradinski Buk, then picnic on Pag cheese under dappled shadow. By night, eat in the medieval square of Skradin, where fireflies dance above stone arches.',
      shortDescription:
        'Inland river leg up the Krka through the lower Šibenik basin to Skradin — a small medieval town inside Krka National Park. Park ticket gets you a boat transfer up to Skradinski Buk waterfall complex.',
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
        desktop: { left: 43.7, top: 47 },
        mobile: { left: 43.7, top: 47 },
      },
      description:
        'Anchor at Tijat, an island with time stopped. Kayak across mangroves; afterward, snooze in hammocks hung between olive trees. The only sound the lap of waves and your own heartbeat when evening gilds the bay grill sardines on deck. Free anchoring on sand and seagrass at 5-8 m. No services — stock up at Skradin or Šibenik. Plan to kayak the offshore islets, snorkel sheltered shallows, hammock between olive trees. asy 8 nm back down the river and along the coast to Tijat — a tiny uninhabited island in the Šibenik archipelago, surrounded by pine-clad islets. Quiet anchorage day, no facilities ashore.',
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
        desktop: { left: 40.8, top: 44.4 },
        mobile: { left: 40.8, top: 44.4 },
      },
      description:
        'Get back to Murter, the Kornati gateway. After swimming on the golden sand of Claim Slanica Beach, indulge in pasticada—slow-cooked beef—at a vine-dressed bar. Allow the clink of wine glasses to complement far-off accordion melodies. Marina Hramina or Marina Betina (both within 1 nm of Murter Town) — pre-book in summer. Plan to swim sandy Slanica Beach, tour the Murter ethno museum, walk the Tisno bridge.',
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
      id: 'murter-zadar',
      routeFrom: 'Murter',
      routeTo: 'Zadar',
      day: 14,
      mapPin: {
        desktop: { left: 32.6, top: 31.9 },
        mobile: { left: 32.6, top: 31.9 },
      },
      description:
        'Sail homeward, stopping to plunge into Molat\'s "Moon Craters." Go back to Zadar as the greeting to the sun sparkles with bright energy. Maraschino liquor will help you toast your voyage; the murmurs of the Adriatic suggest just the beginning.',
      shortDescription:
        'Final 22 nm leg back along the Pašman channel to Zadar. Time the approach for the Greeting to the Sun light show at dusk on the Riva.',
      thingsToDo: [
        'Final swim in Pašman coves',
        'Walk the Roman Forum',
        'Watch Greeting to the Sun show',
        'Maraschino tasting at Skoblar',
      ],
      mooringTip: 'Marina Zadar (Borik) is the standard charter berth. Confirm fuel slot 24h ahead.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/zadar.webp', alt: 'Zadar' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/map.webp',
        alt: 'Zadar-Kornati-Hvar-Korcula-Vis-Skradin Route Image',
      },
      width: 1350,
      height: 1111,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/zadar-itinerary/mobile-map.webp',
        alt: 'Zadar-Kornati-Hvar-Korcula-Vis-Skradin Route Image',
      },
      width: 868,
      height: 1228,
    },
  },
};

export default computeItineraryNumberOfDays(zadarKornatiHvarKorculaVisSkradin14DaysRoute);
