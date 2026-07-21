import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const grenadaRoute: ItineraryRoute = {
  metaTitle: '7-Day Grenada Catamaran Charter Itinerary: Grenadines Adventure',
  metaDesc:
    'Explore the Caribbean on a 7-day Grenada catamaran charter. Sail Port Louis Marina, Dragon Bay, Carriacou, Mayreau, Tobago Cays, Sandy Island & more.',
  id: 'grenada-route',
  startingPoint: 'Port Louis Marina',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/caribbeans/grenada-itinerary/itinerary-card.webp',
    alt: 'Grenada route card',
  },
  gallery: [
    {
      src: '/images/itinerary/caribbeans/banners/grenada-banner-large.webp',
      alt: 'Grenada banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/st-george-banner-large.webp',
      alt: 'St. George banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/albaicin-banner.webp',
      alt: 'Albaicin banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/st-george-banner.webp',
      alt: 'St. George banner',
    },
  ],
  routeDays: [
    {
      id: 'port-louis-marina-dragon-bay-grenada',
      routeFrom: 'Port Louis Marina',
      routeTo: 'Dragon Bay, Grenada',
      day: 1,
      shortDescription:
        'Short 4 nm hop north up Grenada’s leeward west coast from Port Louis Marina to Dragon Bay. Anchor on sand at the south end of the bay; the Molinière Underwater Sculpture Park itself is no-anchor — pick up the marked snorkel buoy and dinghy in. Calm leeward waters, easy shake-down day.',
      description:
        'Your adventure begins at Port Louis Marina in St. George’s, Grenada’s vibrant capital. Before setting sail, stroll through the historic Carenage, browse the spice markets, and enjoy lunch overlooking the colorful waterfront. A short sail brings you to Dragon Bay, a peaceful anchorage on Grenada’s west coast. This area is part of the Molinière Underwater Sculpture Park, the world’s first of its kind. Snorkel among coral-covered sculptures and tropical fish for a truly unique start to your charter.',
      thingsToDo: [
        'Snorkel the Molinière Underwater Sculpture Park',
        'Walk the Carenage waterfront in St. George’s before departure',
        'Browse Grenada’s spice markets for nutmeg and cocoa',
        'Sundowner anchored in Dragon Bay',
      ],
      mooringTip:
        'Dragon Bay is a marine-protected zone — anchor only on sand at the south end of the bay (4–6 m). The sculpture park itself is no-anchor; pick up the marked snorkel buoy and use the dinghy.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/dragon-bay.webp',
          alt: 'Dragon Bay, Grenada',
        },
      ],
    },
    {
      id: 'dragon-bay-tyrell-bay-carriacou',
      routeFrom: 'Dragon Bay, Grenada',
      routeTo: 'Tyrell Bay, Carriacou',
      day: 2,
      shortDescription:
        'Open-water 35 nm passage north from Dragon Bay to Tyrell Bay on Carriacou. Beam reach with the trades; departure by 09:00 to clear customs in daylight before the EC$25 Carriacou Customs office at the Tyrell dock closes. Holding excellent on sand at 4–8 m in the marine-park zone.',
      description:
        'Sail north across open water to Carriacou, known as the “Island of Reefs.” Anchor in Tyrell Bay, a lively harbor that is also part of a protected marine park. Go ashore to explore the town, enjoy fresh seafood in a beachside restaurant, or hike up to High North National Park for panoramic island views. The bay is popular with sailors, giving it a friendly, international atmosphere.',
      thingsToDo: [
        'Hike up to High North National Park for panoramic views',
        'Lunch at the Slipway Restaurant on Tyrell Bay',
        'Walk the boatbuilding sheds at Windward — wooden Carriacou sloops still made by hand',
        'Sundowner at Lazy Turtle Pizzeria on the waterfront',
      ],
      mooringTip:
        'Customs and immigration clearance happens here on the way north — Carriacou Customs office on the Tyrell Bay dock, EC$25 fee. Anchor on sand at 4–8 m; holding is excellent in the marine-park zone.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/tyrell-bay.webp',
          alt: 'Tyrell Bay, Carriacou',
        },
      ],
    },
    {
      id: 'tyrell-bay-salt-whistle-bay-mayreau',
      routeFrom: 'Tyrell Bay, Carriacou',
      routeTo: 'Salt Whistle Bay, Mayreau',
      day: 3,
      shortDescription:
        'Short 8 nm sail north from Tyrell Bay across into St Vincent & the Grenadines waters and onto Mayreau’s Salt Whistle Bay. Tiny anchorage — only 8–10 boats fit comfortably; arrive before noon or fall back to Saline Bay on the south side. Customs cleared the day before in Tyrell Bay.',
      description:
        'Continue north to Salt Whistle Bay on the small island of Mayreau. This is one of the most photographed anchorages in the Caribbean, with its perfect crescent-shaped beach and swaying palm trees. Spend the afternoon swimming, snorkeling, or strolling the beach. Hike up the hill to the tiny village of Mayreau, where the Catholic Church offers incredible views over the Tobago Cays. As evening falls, enjoy dinner ashore at a rustic beach bar.',
      thingsToDo: [
        'Walk the crescent of Salt Whistle Bay at sunrise',
        'Hike to the Catholic Church for views over the Tobago Cays',
        'Lobster dinner ashore at Robert Righteous & De Youths or Last Bar Before The Jungle',
        'Snorkel the windward reef on Mayreau’s east shore',
      ],
      mooringTip:
        'Salt Whistle Bay is small — only 8–10 boats fit comfortably. Arrive before noon in season or anchor on the south side of Saline Bay (Mayreau’s other anchorage) instead. Customs at Union Island handled the day before in Tyrell Bay.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/salt-whistle-bay.webp',
          alt: 'Salt Whistle Bay, Mayreau',
        },
      ],
    },
    {
      id: 'salt-whistle-bay-tobago-cays',
      routeFrom: 'Salt Whistle Bay, Mayreau',
      routeTo: 'Tobago Cays',
      day: 4,
      shortDescription:
        'Short 3 nm hop south to the Tobago Cays — uninhabited islets ringed by Horseshoe Reef. Mooring-only park (US$10/night per person, paid to wardens on arrival); anchoring on the reef is illegal. Snorkel turtles guaranteed; beach barbecue with grilled lobster on Petit Bateau is the local ritual.',
      description:
        'Sail a short distance to the breathtaking Tobago Cays, a cluster of uninhabited islets surrounded by a horseshoe reef. This protected marine park is the jewel of the Grenadines and a must on any Grenada catamaran charter. Here you can snorkel with sea turtles, explore coral reefs, and relax on powdery white-sand beaches. Many charter guests opt for a beach barbecue prepared by local fishermen—fresh lobster grilled on the sand is a Tobago Cays tradition.',
      thingsToDo: [
        'Snorkel the Horseshoe Reef — turtles guaranteed, eagle rays common',
        'Beach barbecue with grilled lobster on Petit Bateau',
        'Walk the windward beaches of Petit Rameau for shell-collecting',
        'Sunset photos with the boats anchored among the cays',
      ],
      mooringTip:
        'Tobago Cays Marine Park is mooring-only (US$10/night per person, paid to the wardens who come to the boat). Anchoring on the reef is illegal and damages coral. Holding is poor anyway — moorings keep you safe.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/tobago-cays.webp',
          alt: 'Tobago Cays',
        },
      ],
    },
    {
      id: 'tobago-cays-sandy-island-carriacou',
      routeFrom: 'Tobago Cays',
      routeTo: 'Sandy Island, Carriacou',
      day: 5,
      shortDescription:
        'About 12 nm south back into Grenadian waters to anchor off Sandy Island — a 200 m sandbar with a protected snorkel reef on the leeward side. Day-stop preferred (no protection from north swell overnight); most charters return to Tyrell Bay for the night. Customs back into Grenada handled at St George’s on Day 7.',
      description:
        'After a morning swim, sail back towards Carriacou and anchor off Sandy Island, a tiny strip of sand surrounded by crystal-clear water. Despite its size, the snorkeling here is superb, with vibrant coral and tropical fish just meters from the beach. Spend the day enjoying this idyllic setting—paddleboarding, swimming, or simply soaking in the serenity of one of the Caribbean’s most beautiful natural escapes.',
      thingsToDo: [
        'Snorkel the protected reef on Sandy Island’s leeward side',
        'Paddleboard the calm water between Sandy Island and Carriacou',
        'Beach picnic on the 200-metre sandbar',
        'Return to Tyrell Bay for the night and dinner ashore',
      ],
      mooringTip:
        'Sandy Island is anchor-only on sand at 3–5 m, day-stop preferred (no protection from north swell overnight). Most charters return to Tyrell Bay for the night — clearance back into Grenada happens in St. George’s on Day 7 anyway.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/sandy-island.webp',
          alt: 'Sandy Island, Carriacou',
        },
      ],
    },
    {
      id: 'sandy-island-st-georges-grenada',
      routeFrom: 'Sandy Island, Carriacou',
      routeTo: 'St. George’s, Grenada',
      day: 6,
      shortDescription:
        'Open-water 35 nm passage south back to St George’s. Steady trade-wind reach with the swells on the beam; pre-book a Port Louis Marina slip (US$2/ft) via VHF 16. Anchoring outside the marina is allowed but the harbour is busy with cruise traffic. Customs back into Grenada handled at the marina dock.',
      description:
        'Set course south for St. George’s, Grenada’s picturesque capital. Along the way, enjoy open-water sailing with steady trade winds, perfect for catamaran cruising. Once anchored, explore St. George’s colorful markets, historic forts, and spice shops. Visit the House of Chocolate Museum or wander the Carenage for a taste of Grenada’s colonial charm. In the evening, enjoy fine dining or casual beachside bars before your final sail.',
      thingsToDo: [
        'Tour Fort George overlooking the Carenage harbour',
        'Visit the House of Chocolate Museum on Young Street',
        'Buy nutmeg, mace, and cocoa from the open-air spice market',
        'Sunset dinner at the BB’s Crabback Caribbean restaurant',
      ],
      mooringTip:
        'Cleared into Grenada at Port Louis Marina — VHF 16 ahead for slip availability (US$2/ft). Anchoring outside the marina is allowed but the harbour is busy with cruise traffic; the marina is the safer overnight.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/st-george.webp',
          alt: 'St. George’s, Grenada',
        },
      ],
    },
    {
      id: 'st-georges-port-louis-marina',
      routeFrom: 'St. George’s, Grenada',
      routeTo: 'Port Louis Marina',
      day: 7,
      shortDescription:
        'Final morning at Port Louis Marina. Boat alongside by 17:00 Friday for end-cleaning per typical charter contract. Top up at the south-end fuel dock before slipping into your assigned berth. Esplanade Mall for souvenirs, lunch at the Victory Bar on the marina dock before hand-back inspection.',
      description:
        'On your last morning, enjoy a leisurely sail back to Port Louis Marina, completing your Grenada and Grenadines loop. Depending on your schedule, you can relax by the marina’s pool, shop for souvenirs, or take a final stroll through town before checking out.',
      thingsToDo: [
        'Final swim at the Port Louis Marina pool',
        'Souvenir shopping at the Esplanade Mall',
        'Lunch at the Victory Bar on the marina dock',
        'Hand-back inspection with the charter operator',
      ],
      mooringTip:
        'Charter contracts typically require boat alongside by 17:00 Friday for end-cleaning. Port Louis fuel dock is on the south end of the marina; top up before slipping into your assigned berth.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/port-louis-marina.webp',
          alt: 'Port Louis Marina',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/caribbeans/grenada-itinerary/map.webp',
        alt: 'Grenada Route map',
      },
      width: 1230,
      height: 1018,
    },
    mobile: {
      image: {
        src: '/images/itinerary/caribbeans/grenada-itinerary/mobile-map.webp',
        alt: 'Grenada Route map',
      },
      width: 910,
      height: 1186,
    },
  },
};

export default computeItineraryNumberOfDays(grenadaRoute);
