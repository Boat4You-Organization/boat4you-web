import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const bviRoute: ItineraryRoute = {
  metaTitle: '7-Day BVI Catamaran Charter: Tortola, Anegada, Jost Van Dyke & More',
  metaDesc:
    'Plan the ultimate 7-day BVI catamaran charter. Daily route, anchorages, snorkel sites, beach bars, mooring tips, and dining—from Tortola to Anegada and back.',
  id: 'bvi-route',
  startingPoint: 'Tortola',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/caribbeans/bvi-itinerary/itinerary-card.webp',
    alt: 'BVI route card',
  },
  gallery: [
    {
      src: '/images/itinerary/caribbeans/banners/bvi-banner-large.webp',
      alt: 'British Virgin Islands banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/tortola-banner-large.webp',
      alt: 'Tortola banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/bvi-sailing-banner.webp',
      alt: 'British Virgin Islands banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/bvi-banner.webp',
      alt: 'BVI banner',
    },
  ],
  routeDays: [
    {
      id: 'tortola-peter-island',
      routeFrom: 'Tortola',
      routeTo: 'Peter Island',
      day: 1,
      shortDescription:
        'Pick up at Road Town or Nanny Cay, snorkel The Indians off Pelican Island on the way out, then about 6 nm downwind across Drake Channel to Peter Island. Grab a National Parks Trust buoy at The Indians before 11:00 — the field fills early. Anchor in Great Harbour on sand at 6–10 m for the first night.',
      description:
        'Begin your charter from Tortola, the sailing hub of the BVIs. Your first stop is Pelican Island, home to the world-famous snorkel site known as The Indians. Here, you’ll find dramatic rock pinnacles surrounded by tropical fish, coral gardens, and crystal-clear waters. Sail on to Peter Island, where you can anchor in Great Harbour or Little Harbour. Peter Island offers secluded bays, hiking trails, and calm anchorages perfect for your first evening onboard. Enjoy a swim before dining at anchor under the stars.',
      thingsToDo: [
        'Snorkel The Indians (Pelican Island) coral pinnacles',
        'Anchor in Great Harbour or Little Harbour for sunset swim',
        'Walk Peter Island’s south-coast trails',
        'Dine at anchor under the stars',
      ],
      mooringTip:
        'BVI National Parks Trust mooring at The Indians is first-come, first-served (US$30/night). Pick up the buoy before 11:00 in season — it fills fast. Great Harbour on Peter Island has free anchoring on sand at 6–10 m.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/peter-island.webp',
          alt: 'Peter Island',
        },
      ],
    },
    {
      id: 'peter-island-cooper-island',
      routeFrom: 'Peter Island',
      routeTo: 'Cooper Island',
      day: 2,
      shortDescription:
        'About 8 nm east-south-east from Peter Island, with the Salt Island RMS Rhone wreck dive on the way. Pick up a Cooper Island Beach Club mooring before 14:00 — VHF 16 ahead to reserve. Holding outside the field is poor coral, so the buoy is the safe choice for the night.',
      description:
        'After breakfast, sail to Salt Island to explore the RMS Rhone, one of the Caribbean’s most famous wreck dives. Divers and snorkelers alike will be enchanted by the coral-covered remains of this 19th-century steamship. From here, set course for Cooper Island and pick up a mooring ball at Manchioneel Bay. Snorkel at Cistern Point for vibrant marine life, then head ashore to the eco-friendly Cooper Island Beach Club for cocktails, Caribbean dishes, and a famous rum bar.',
      thingsToDo: [
        'Dive or snorkel the RMS Rhone wreck off Salt Island',
        'Snorkel Cistern Point reef on Cooper Island',
        'Sample the Cooper Island Beach Club rum tasting flight',
        'Watch the sunset from Manchioneel Bay',
      ],
      mooringTip:
        'Cooper Island Beach Club moorings (US$30/night) book up by 14:00 in winter — VHF channel 16 ahead to reserve, or arrive before noon. Holding outside the field is poor coral, so a mooring is the safe choice.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/cooper-island.webp',
          alt: 'Cooper Island',
        },
      ],
    },
    {
      id: 'cooper-island-scrub-island',
      routeFrom: 'Cooper Island',
      routeTo: 'Scrub Island',
      day: 3,
      shortDescription:
        'Day’s longest leg — about 16 nm north to Anegada, the only coral atoll in the BVIs. Channel is reef-fringed and shallow; only attempt with marked buoys in good light (10:00–15:00) and under 20 kt winds. Lobster lunch ashore, then return south via The Dogs to Scrub Island marina for the night.',
      description:
        'Day three is your longest passage, sailing north to Anegada, the only coral atoll in the BVIs. Known for its endless sandy beaches and shallow turquoise waters, Anegada feels like another world. Spend your day exploring Loblolly Bay or Cow Wreck Beach, spot flamingos in the salt ponds, or rent a scooter to explore the island. In the evening, enjoy freshly caught lobster, a specialty of Anegada. On your way back, stop at The Dogs, a small group of islets ideal for snorkeling. End the day at Scrub Island, where you can enjoy a luxury marina, resort facilities, and fine dining.',
      thingsToDo: [
        'Lobster dinner at Anegada Reef Hotel or Cow Wreck Beach Bar',
        'Snorkel at Loblolly Bay reefs',
        'Spot pink flamingos in the inland salt ponds',
        'Snorkel The Dogs on the return passage',
      ],
      mooringTip:
        'Anegada channel is shallow and reef-fringed — only attempt with the marked buoys in good light (10:00–15:00) and under 20 kt winds. Pick up a mooring at Setting Point (US$40/night) rather than anchor; turtle-grass patches make holding inconsistent.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/scrub-island.webp',
          alt: 'Scrub Island',
        },
      ],
    },
    {
      id: 'scrub-island-jost-van-dyke',
      routeFrom: 'Scrub Island',
      routeTo: 'Jost Van Dyke',
      day: 4,
      shortDescription:
        'About 18 nm west across Drake Channel and round Tortola’s east tip to Jost Van Dyke. White Bay anchor only when north-swell forecast is under 4 ft; move to Great Harbour for the night (US$30 mooring or sand at 6–8 m). Painkiller at Soggy Dollar is the headline lunch ashore.',
      description:
        'Cruise west to lively Jost Van Dyke, one of the most famous islands in the BVIs. Anchor in White Bay, where you can swim ashore to the legendary Soggy Dollar Bar, home of the original Painkiller cocktail. For overnight, move to Great Harbour and enjoy dinner at Foxy’s Tamarind Bar, where live music and a festive atmosphere make for an unforgettable Caribbean night. If you prefer tranquility, anchor in Little Harbour, where lobster dinners at Sidney’s Peace & Love are a tradition.',
      thingsToDo: [
        'Swim ashore at White Bay for a Painkiller at Soggy Dollar Bar',
        'Dinner at Foxy’s Tamarind Bar in Great Harbour',
        'Lobster dinner at Sidney’s Peace & Love in Little Harbour',
        'Snorkel the Bubbly Pool tidal blow-hole on the north shore',
      ],
      mooringTip:
        'White Bay is exposed to north swell — pick it only when the swell forecast is under 4 ft from the north. Move to Great Harbour for the night; moorings (US$30) and good sand-bottom anchoring at 6–8 m.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/jost-van-dyke.webp',
          alt: 'Jost Van Dyke',
        },
      ],
    },
    {
      id: 'jost-van-dyke-cane-garden-bay',
      routeFrom: 'Jost Van Dyke',
      routeTo: 'Cane Garden Bay',
      day: 5,
      shortDescription:
        'About 6 nm east round Tortola’s north-west tip to Cane Garden Bay. Avoid in winter cold-front conditions (Dec–Feb) when north swell builds — switch to Brewer’s Bay or Soper’s Hole. Moorings on the north end of the bay are the most protected. Callwood Rum Distillery (400 years old) is the inland headline.',
      description:
        'After a relaxed morning, sail to Great Thatch, a peaceful and undeveloped island that offers great snorkeling in calm weather. Continue to Cane Garden Bay on Tortola, one of the most iconic anchorages in the BVIs. With its wide sandy beach, palm trees, and colorful beach bars, Cane Garden Bay is a favorite among sailors. Visit the Callwood Rum Distillery, operating for over 400 years, and enjoy live music at Quito’s Gazebo or sunset cocktails at Myett’s.',
      thingsToDo: [
        'Tour the 400-year-old Callwood Rum Distillery',
        'Live music night at Quito’s Gazebo',
        'Sunset cocktails at Myett’s Garden & Grill',
        'Beach swim and stand-up paddle on the wide sandy bay',
      ],
      mooringTip:
        'Cane Garden Bay is exposed to north and north-west swell from December through February — moorings on the north end of the bay are most protected. Avoid in winter cold-front conditions; switch to Brewer’s Bay or Soper’s Hole instead.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/cane-garden-bay.webp',
          alt: 'Cane Garden Bay',
        },
      ],
    },
    {
      id: 'cane-garden-bay-norman-island',
      routeFrom: 'Cane Garden Bay',
      routeTo: 'Norman Island',
      day: 6,
      shortDescription:
        'About 12 nm south back across Drake Channel to Norman Island — the inspiration for Stevenson’s Treasure Island. The Bight has the BVI’s largest mooring field (~70 buoys, US$30/night) — usually room even in peak season. Snorkel The Caves at Treasure Point; dinghy run to Willy T floating bar is the headline stop.',
      description:
        'Head south to Norman Island, the inspiration for Robert Louis Stevenson’s Treasure Island. Stop at The Caves, where you can snorkel into sea caves filled with shimmering schools of fish. For another underwater highlight, visit The Indians again if you missed it earlier in the week. Spend the night in The Bight, Norman Island’s main anchorage. Here, you’ll find hiking trails with panoramic views, lively bars, and calm waters for a perfect overnight stay.',
      thingsToDo: [
        'Snorkel The Caves at Treasure Point on Norman Island',
        'Hike the ridge above The Bight for panoramic views',
        'Drinks at Pirate’s Bight or the Willy T floating bar',
        'Sunset swim in The Bight before dinner',
      ],
      mooringTip:
        'The Bight has the BVI’s largest mooring field (~70 buoys, US$30/night) — even in peak season there is usually room. Free anchoring is permitted in the south-east corner on sand at 8–12 m.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/norman-island.webp',
          alt: 'Norman Island',
        },
      ],
    },
    {
      id: 'norman-island-tortola',
      routeFrom: 'Norman Island',
      routeTo: 'Tortola',
      day: 7,
      shortDescription:
        'Final 5 nm north back to Tortola — Road Town, Nanny Cay, or your base depending on operator. Plan to depart The Bight by 11:00; Drake Channel gets busy with returning fleets after 14:00. Top up fuel and water; charter contracts usually require return alongside by 16:00 Saturday for end-cleaning.',
      description:
        'On your final day, enjoy a leisurely morning swim before sailing back to Tortola. Depending on your base, you’ll return to Road Town, Nanny Cay, or another marina for refueling and checkout. Spend one last evening onshore, dining at a waterfront restaurant and reflecting on a week of unforgettable memories.',
      thingsToDo: [
        'Final morning swim and snorkel in The Bight',
        'Top up fuel and water at Road Town or Nanny Cay',
        'Sunset dinner at a Tortola waterfront restaurant',
        'Hand-back inspection with the charter operator',
      ],
      mooringTip:
        'Most charter contracts require return alongside by 16:00 Saturday. Plan to depart The Bight by 11:00 — the south-east trades push you back gently but Drake Channel gets busy with returning fleets after 14:00.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/tortola.webp',
          alt: 'Tortola',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/caribbeans/bvi-itinerary/map.webp',
        alt: 'BVI Route map',
      },
      width: 1222,
      height: 1116,
    },
    mobile: {
      image: {
        src: '/images/itinerary/caribbeans/bvi-itinerary/map.webp',
        alt: 'BVI Route map',
      },
      width: 1222,
      height: 1116,
    },
  },
};

export default computeItineraryNumberOfDays(bviRoute);
