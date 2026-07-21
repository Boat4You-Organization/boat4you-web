import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const bahamasRoute: ItineraryRoute = {
  metaTitle: '7-Day Abacos Catamaran Charter Itinerary: Explore the Bahamas',
  metaDesc:
    'Sail the Bahamas with a 7-day Abacos catamaran charter. Discover Great Guana Cay, Green Turtle Cay, Hope Town, Man-O-War Cay and Tahiti Beach on this perfect sailing route.',
  id: 'bahamas-route',
  startingPoint: 'Marsh Harbour',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/caribbeans/bahamas-itinerary/itinerary-card.webp',
    alt: 'Bahamas route card',
  },
  gallery: [
    {
      src: '/images/itinerary/caribbeans/banners/bahamas-banner-large.webp',
      alt: 'Bahamas banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/bahamas-sea-banner-large.webp',
      alt: 'Bahamas sea banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/stocking-banner.webp',
      alt: 'Stocking banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/bahamas-banner.webp',
      alt: 'Bahamas banner',
    },
  ],
  routeDays: [
    {
      id: 'marsh-harbour-hope-town',
      routeFrom: 'Marsh Harbour',
      routeTo: 'Hope Town',
      day: 1,
      shortDescription:
        'Short 3 nm downwind drift from Marsh Harbour to Hope Town in steady SE trades. Pick up a harbour-master mooring before 16:00 — anchoring is illegal in the protected basin and the buoy field fills fast. The candy-striped lighthouse and a settle-in walk on the Atlantic-side beach are the first afternoon.',
      description:
        'Pick up your catamaran at Marsh Harbour Boat Yard or Conch Inn Marina by mid-afternoon and start with a relaxed downwind half-hour to Hope Town Harbour, the most photographed spot in the Abacos. The candy-striped Hope Town Lighthouse — one of only three manually operated kerosene lighthouses left in the world — is your first photo of the trip. Pick up a mooring inside the protected harbour (free anchoring is illegal here) and dinghy ashore for a settle-in walk along the Atlantic-side beach and dinner at Cap’n Jack’s or Hope Town Inn.',
      thingsToDo: [
        'Climb the candy-striped Hope Town Lighthouse for sunset',
        'Walk Hope Town settlement and the Atlantic-side beach',
        'Dinner at Cap’n Jack’s or Hope Town Inn',
        'First-night swim in the protected harbour',
      ],
      mooringTip:
        'Anchoring is prohibited in Hope Town Harbour — moorings only (US$25/night, pay the harbour master in person or by VHF). Pick up a buoy on arrival; the harbour fills by 16:00 in season.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/bahamas-banner.webp',
          alt: 'Hope Town',
        },
      ],
    },
    {
      id: 'hope-town-tahiti-beach',
      routeFrom: 'Hope Town',
      routeTo: 'Marsh Harbour',
      day: 2,
      shortDescription:
        'Short morning hop ~3 nm south to anchor off Tahiti Beach for the low-tide sandbar walk and Cracker P’s lunch on Lubbers Quarters. Late-afternoon 5 nm beam reach back across the Sea of Abaco to Marsh Harbour for the Maxwell’s provisioning run before the second-half push north.',
      description:
        'A short morning sail to anchor off Tahiti Beach — a sand spit on the south end of Elbow Cay that uncovers at low tide and looks straight off a postcard. Walk the dry sandbar at low water, swim in chest-deep turquoise water at high tide, then dinghy 200 m across to Cracker P’s on Lubbers Quarters for the standout lunch on this end of the lagoon. Late afternoon, sail back across the Sea of Abaco to Marsh Harbour for re-provisioning at Maxwell’s Supermarket and dinner at Snappa’s on the marina dock.',
      thingsToDo: [
        'Walk the Tahiti Beach sandbar at low tide',
        'Lunch at Cracker P’s on Lubbers Quarters',
        'Top up provisions at Maxwell’s Supermarket in Marsh Harbour',
        'Dinner at Snappa’s on the Marsh Harbour dock',
      ],
      mooringTip:
        'Tahiti Beach is anchor-only on sand at 2–4 m — not protected for overnight. Marsh Harbour offers paid moorings at Conch Inn (US$25) or free anchoring on the south end of the harbour at 4 m.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/bahamas-sea-banner-large.webp',
          alt: 'Tahiti Beach',
        },
      ],
    },
    {
      id: 'marsh-harbour-great-guana-cay',
      routeFrom: 'Marsh Harbour',
      routeTo: 'Great Guana Cay',
      day: 3,
      shortDescription:
        'About 6 nm beam-reach across the Sea of Abaco to anchor in Fisher’s Bay on the south side of Great Guana Cay. Public moorings at Grabbers (US$20/night) plus excellent free anchoring on white sand at 3–5 m. Walk over the dune for the Atlantic-side Nippers pig roast — the headline social lunch of the week.',
      description:
        'A pleasant beam reach across the Sea of Abaco to anchor in Fisher’s Bay on the south side of Great Guana Cay. Walk over the dune to the Atlantic-side beach and head straight to Nippers Beach Bar & Grill for the legendary Sunday pig roast or a Wednesday-evening pool party — the most-photographed lunch in the Abacos and Atlantic-side waves washing right up to the deck. Walking distance back to the boat for sunset on the Sea of Abaco side.',
      thingsToDo: [
        'Sunday pig roast (or Wednesday party) at Nippers Beach Bar',
        'Walk the 7-mile Atlantic-side beach',
        'Snorkel the reef off Baker’s Bay',
        'Sunset drinks at Grabbers Bed Bar & Grill in Fisher’s Bay',
      ],
      mooringTip:
        'Fisher’s Bay has a dozen public moorings (US$20/night, pay at Grabbers) plus good free anchoring on white sand at 3–5 m. Holding is excellent; the bay is well protected from prevailing easterlies.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/stocking-banner.webp',
          alt: 'Great Guana Cay',
        },
      ],
    },
    {
      id: 'great-guana-green-turtle-cay',
      routeFrom: 'Great Guana Cay',
      routeTo: 'Green Turtle Cay',
      day: 4,
      shortDescription:
        'Day’s longest leg — about 15 nm including the open-ocean Whale Cay Channel pinch. Pick a slack-tide window between 10:00 and 14:00 with swell under 4 ft and wind under 15 kn. Listen to the 08:15 VHF 68 Cruisers Net for the daily "Whale status" before casting off; reschedule if marginal.',
      description:
        'The day’s longest leg — including the one open-ocean stretch through Whale Cay Channel. Pick a window where the swell is under 4 ft and the wind is 15 knots or less, ideally a 10:00–14:00 slack tide. Once through, a quiet beam reach into White Sound on Green Turtle Cay. Pick up a mooring at the Green Turtle Club and dinghy or walk into New Plymouth — the historic Loyalist village, the oldest settlement on the cay, with brightly painted clapboard houses straight out of New England.',
      thingsToDo: [
        'Walk the historic Loyalist village of New Plymouth',
        'Visit the Albert Lowe Museum and Memorial Sculpture Garden',
        'Sample a Goombay Smash at Miss Emily’s Blue Bee Bar (the original)',
        'Snorkel the reef off Manjack Cay’s east shore',
      ],
      mooringTip:
        'Whale Cay Channel only opens in fair weather — listen to the morning Cruisers Net (VHF 68 at 08:15) for the daily "Whale status." White Sound moorings (US$25) at Green Turtle Club; outer Black Sound has good free anchoring at 3 m sand.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/stocking-banner.webp',
          alt: 'Green Turtle Cay',
        },
      ],
    },
    {
      id: 'green-turtle-manjack-powell',
      routeFrom: 'Green Turtle Cay',
      routeTo: 'Green Turtle Cay',
      day: 5,
      shortDescription:
        'Short hops north to Manjack Cay (2 nm) and Powell Cay (2 nm further) for the day’s snorkel and an empty-beach lunch — Manjack reef is reliable for turtles, eagle rays, and nurse sharks. Back to Green Turtle for the night unless a north cold-front swell is forecast (both day-stops are fully exposed to north).',
      description:
        'A morning hop to anchor off Manjack Cay for the best snorkelling on this end of the lagoon — the reef on the east side hosts turtles, eagle rays, and reliable nurse-shark encounters within 200 m of the beach. Continue 2 nm north to Powell Cay for an empty-beach lunch on a cay that frequently has zero other boats, then back south to Green Turtle for the night. Dinner ashore at the Green Turtle Club or Sundowners.',
      thingsToDo: [
        'Snorkel the Manjack reef for turtles and rays',
        'Empty-beach lunch on Powell Cay',
        'Dinner at the Green Turtle Club waterfront',
        'Sunset at the Bluff House overlook',
      ],
      mooringTip:
        'Manjack and Powell Cay are anchor-only on white sand at 3 m — protected from easterlies but exposed to north swell in winter cold-front conditions. Return south to Green Turtle Cay for the night if a front is forecast.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/bahamas-banner-large.webp',
          alt: 'Manjack Cay',
        },
      ],
    },
    {
      id: 'green-turtle-man-o-war',
      routeFrom: 'Green Turtle Cay',
      routeTo: 'Man-O-War Cay',
      day: 6,
      shortDescription:
        'Reverse passage through Whale Cay Channel — same forecast rules as Day 4 (slack tide 10:00–14:00, swell <4 ft, wind <15 kt). About 12 nm with downwind run to Man-O-War Cay after the channel. Self-catered dinner aboard recommended: Man-O-War is a "dry" community, no alcohol sold ashore.',
      description:
        'A reverse passage through Whale Cay Channel — same forecast rules as Day 4 — then downwind to Man-O-War Cay. The cay is dry (no alcohol sold ashore) and quiet, but the boat-building heritage, the harbour at sunset, and the tiny Albury’s Sail Shop (sail-cloth bags handmade since the 1960s) are the trip’s most peaceful evening. Self-catered dinner aboard recommended; provisioning at Man-O-War Pavilion Grocery.',
      thingsToDo: [
        'Visit Albury’s Sail Shop on the harbour',
        'Walk the cay’s narrow main street between the harbours',
        'Snorkel the wreck of the USS Adirondack off the south reef',
        'Self-catered sunset dinner aboard in the protected harbour',
      ],
      mooringTip:
        'Man-O-War Marina moorings (US$30/night) book ahead by VHF 16. Eastern Harbour has good anchoring at 4 m sand. Note: Man-O-War is a "dry" community — no alcohol sold ashore, BYO from Marsh Harbour.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/bahamas-banner.webp',
          alt: 'Man-O-War Cay',
        },
      ],
    },
    {
      id: 'man-o-war-marsh-harbour',
      routeFrom: 'Man-O-War Cay',
      routeTo: 'Marsh Harbour',
      day: 7,
      shortDescription:
        'Short final 6 nm downwind hop across the Sea of Abaco back to Marsh Harbour. Charter contracts usually require return by 16:00 Friday or noon Saturday. Top up fuel and water at the harbour fuel dock; final lunch at Wally’s, sundowner at the Jib Room before hand-back inspection.',
      description:
        'A short final morning back to base — 6 nm downwind across the Sea of Abaco. Charter operators typically require return by 16:00 Friday or noon Saturday. Top up fuel and water at the Marsh Harbour fuel dock, then walk into town for a final lunch at Wally’s or a sundowner at the Jib Room before hand-back inspection.',
      thingsToDo: [
        'Top up fuel and water at the Marsh Harbour fuel dock',
        'Final lunch at Wally’s or Snappa’s',
        'Sundowner at the Jib Room overlooking the harbour',
        'Hand-back inspection with the charter operator',
      ],
      mooringTip:
        'Confirm your specific contract clause for return time — most operators want the boat alongside by 16:00 Friday for end-cleaning. Don’t cut it fine; the Whale Cay return passage adds time pressure if you stayed north.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/bahamas-banner-large.webp',
          alt: 'Marsh Harbour',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/caribbeans/bahamas-itinerary/map.webp',
        alt: 'Bahamas Route map',
      },
      width: 1222,
      height: 1116,
    },
    mobile: {
      image: {
        src: '/images/itinerary/caribbeans/bahamas-itinerary/map.webp',
        alt: 'Bahamas Route map',
      },
      width: 1222,
      height: 1116,
    },
  },
};

export default computeItineraryNumberOfDays(bahamasRoute);
