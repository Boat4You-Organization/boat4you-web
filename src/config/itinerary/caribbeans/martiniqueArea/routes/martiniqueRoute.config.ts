import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const martiniqueRoute: ItineraryRoute = {
  metaTitle: '7-Day Martinique Catamaran Charter Itinerary',
  metaDesc:
    'Explore the French Caribbean with this 7-day Martinique catamaran charter itinerary. Discover Le Marin, Saint-Pierre, Anse Dufour, Les Salines, and more.',
  id: 'martinique-route',
  startingPoint: 'Le Marin',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/caribbeans/martinique-itinerary/itinerary-card.webp',
    alt: 'Martinique route card',
  },
  gallery: [
    {
      src: '/images/itinerary/caribbeans/banners/martinique-banner-large.webp',
      alt: 'Martinique banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/martinique-town-banner-large.webp',
      alt: 'Martinique town banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/martinique-banner.webp',
      alt: 'Martinique island banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/turtle-swimming-banner.webp',
      alt: 'Turtle swimming banner',
    },
  ],
  routeDays: [
    {
      id: 'le-marin',
      routeFrom: 'Le Marin',
      routeTo: 'Le Marin',
      day: 1,
      shortDescription:
        'Embark day at Marina du Marin — the largest charter base in the Eastern Caribbean. Slip pre-allocated by the operator (EU 220 V/50 Hz shore power). No passage today: provision at Carrefour 200 m from the marina, dinghy the mangrove channels north of the harbour, and settle in before tomorrow’s first leg west to Grande Anse d’Arlet.',
      description:
        'Your charter begins in Le Marin, one of the largest marinas in the Caribbean and the sailing hub of Martinique. Before you set off, explore the town’s charming boutiques, bakeries, and local markets. Stock up on fresh baguettes, tropical fruits, and fine French wines for your journey. Le Marin is also home to stunning views across the bay and the nearby mangroves, which are perfect for a short paddle or tender trip if you arrive early. This is the ideal place to get comfortable with your catamaran and prepare for the adventure ahead.',
      thingsToDo: [
        'Stock up at Carrefour Le Marin (200 m from the marina)',
        'Walk the boardwalk along Marina du Marin at sunset',
        'Dinghy through the mangrove channels north of the marina',
        'Dinner at Mango Bay or Le Zanzibar on the marina front',
      ],
      mooringTip:
        'Marina du Marin is the largest charter base in the Eastern Caribbean — your slip is pre-allocated by the operator. EU-style 220 V/50 Hz shore power and 16 mm fitting; bring an adapter if you charter from a US-based fleet.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/le-marin.webp',
          alt: 'Le Marin',
        },
      ],
    },
    {
      id: 'le-marin-grande-anse-d-arlet',
      routeFrom: 'Le Marin',
      routeTo: 'Grande Anse d’Arlet',
      day: 2,
      shortDescription:
        'About 12 nm west around Pointe Borgnèse to Grande Anse d’Arlet. Yellow Atlantis-managed mooring buoys cover the bay (free daytime, €10 overnight via app); anchoring on seagrass is forbidden. Snorkel the seagrass beds for green turtles in chest-deep water — the headline marine highlight of the trip.',
      description:
        'Sail west along the southern coast to Grande Anse d’Arlet, a postcard-perfect anchorage lined with a long sandy beach and colorful Creole houses. The bay is calm and sheltered, making it ideal for swimming, snorkeling, and paddleboarding straight from your catamaran. The snorkeling here is exceptional—you’ll often see turtles gliding through the seagrass beds. Ashore, enjoy a seaside restaurant serving fresh fish, Creole specialties, and French-Caribbean fusion cuisine.',
      thingsToDo: [
        'Snorkel the seagrass beds for green turtles in 2–3 m water',
        'Photo the church on the headland — most photographed in Martinique',
        'Lunch at Ti’ Sable on the beach or Le Bidjoul for grilled lobster',
        'Sunset paddleboard from the bay’s south end',
      ],
      mooringTip:
        'Yellow Atlantis-managed mooring buoys cover the bay (free for daytime stops, €10/night for overnight, paid via the mobile app). Anchoring on seagrass is forbidden — moorings only.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/grande-anse.webp',
          alt: 'Grande Anse d’Arlet',
        },
      ],
    },
    {
      id: 'grande-anse-d-arlet-saint-pierre',
      routeFrom: 'Grande Anse d’Arlet',
      routeTo: 'Saint-Pierre',
      day: 3,
      shortDescription:
        'About 22 nm north up the west coast past Fort-de-France to Saint-Pierre under the shadow of Mount Pelée. Anchor on volcanic sand at 8–15 m or pick up a mooring (€15/night) at the south-end breakwater. The 1902 wreck dives off the breakwater are the marine highlight; Mémorial de la Catastrophe museum is the inland headline.',
      description:
        'Continue sailing north to Fort-de-France, the capital of Martinique. This lively city blends French colonial history with Caribbean rhythm. Visit Schoelcher Library, Saint-Louis Cathedral, and the bustling spice markets. For food lovers, Fort-de-France offers some of the best gourmet dining in the Caribbean. In the afternoon, sail further north to Saint-Pierre, once known as the "Paris of the Caribbean" before it was destroyed by a volcanic eruption in 1902. Today, it is a charming town with fascinating ruins, a volcano museum, and cobbled streets. Anchoring here gives you a mix of history, culture, and dramatic views of Mount Pelée.',
      thingsToDo: [
        'Visit the Mémorial de la Catastrophe de 1902 (volcano museum)',
        'Walk the ruined theatre and Cyparis prison cell',
        'Dive the 1902 shipwrecks at 30–50 m off the breakwater',
        'Dinner at La Tamaya in the cobbled centre',
      ],
      mooringTip:
        'Saint-Pierre Bay is anchor-only on volcanic sand at 8–15 m, no protection from north swell. Moorings (€15/night) at the south end of the bay near the breakwater. Don’t anchor closer than 100 m to the wrecks — they’re a marine archaeology site.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/saint-pierre.webp',
          alt: 'Saint-Pierre',
        },
      ],
    },
    {
      id: 'saint-pierre-anse-couleuvre',
      routeFrom: 'Saint-Pierre',
      routeTo: 'Anse Couleuvre',
      day: 4,
      shortDescription:
        'Short 5 nm hop further north up the coast to Anse Couleuvre — one of Martinique’s most secluded volcanic black-sand beaches, backed by rainforest. Anchor on black sand at 6–10 m; bay protected from easterlies but exposed to north swell — back off to Anse Mitan if a swell event is forecast. Trace des Caps rainforest hike from the beach.',
      description:
        'Sail further along the northwest coast to Anse Couleuvre, one of Martinique’s most secluded and unspoiled beaches. Backed by lush rainforest and cliffs, this anchorage is perfect for nature lovers. Go ashore to hike the nearby trails through tropical forest, where you can spot exotic birds, tropical plants, and waterfalls. The black-sand beach here is less crowded than other areas, giving you a peaceful day in a truly wild setting.',
      thingsToDo: [
        'Hike the Trace des Caps trail through tropical rainforest',
        'Swim from the volcanic black-sand beach',
        'Watch for hummingbirds in the cliff foliage',
        'Sunset dinner aboard with no other lights on the horizon',
      ],
      mooringTip:
        'Anse Couleuvre is anchor-only on black volcanic sand at 6–10 m. The bay is protected from easterlies but exposed to north swell — check forecast and back off to Anse Mitan if a swell event is forecast.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/anse-couleuvre.webp',
          alt: 'Anse Couleuvre',
        },
      ],
    },
    {
      id: 'anse-couleuvre-anse-dufour',
      routeFrom: 'Anse Couleuvre',
      routeTo: 'Anse Dufour',
      day: 5,
      shortDescription:
        'About 18 nm south back down the leeward coast to Anse Dufour — small fishing village with yellow Atlantis mooring buoys (€8/night). Bay is small (12 boats max); arrive before noon. Swimming with green turtles in chest-deep water is the most reliable spot in Martinique; reliable dolphin-watching trips run from the village.',
      description:
        'Head south again to Anse Dufour, a small fishing village famous for its calm turquoise waters and incredible snorkeling. The bay is home to a thriving population of sea turtles, which makes swimming here a magical experience. Onshore, the village offers authentic Creole charm, with family-run restaurants serving grilled fish and accras (Caribbean fritters). It’s the perfect stop to enjoy both underwater adventures and local hospitality.',
      thingsToDo: [
        'Swim with green turtles in chest-deep water (most reliable in Martinique)',
        'Lunch on accras and grilled poisson at Le Bouchon Vert',
        'Dolphin-watching trip — Anse Dufour is the island’s reliable spot',
        'Walk to neighbouring Anse Noire for the volcanic black sand',
      ],
      mooringTip:
        'Anse Dufour has yellow Atlantis mooring buoys (€8/night) — anchoring on seagrass is prohibited and the bay is small (12 boats max). Arrive before noon in season.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/anse-dufour.webp',
          alt: 'Anse Dufour',
        },
      ],
    },
    {
      id: 'anse-dufour-saint-anne',
      routeFrom: 'Anse Dufour',
      routeTo: 'Saint-Anne',
      day: 6,
      shortDescription:
        'About 14 nm south-east round Pointe du Diamant back to Sainte-Anne, with a long lunch stop at Les Salines (kilometre-long white-sand crescent) on the way. Sainte-Anne anchor on white sand at 4–6 m; bay holds 60+ boats comfortably even in February peak. Saturday-market crafts and rum is the village highlight.',
      description:
        'Sail further southeast to Les Salines, one of Martinique’s most famous beaches. Stretching for over a kilometer, this palm-lined white sand beach offers shallow, crystal-clear waters—ideal for a leisurely swim or beach picnic. In the afternoon, anchor off Saint-Anne, a vibrant village known for its markets, lively waterfront, and beachside cafés. It’s a wonderful place to pick up artisanal crafts, enjoy fresh crepes or rum punch, and take in the festive island atmosphere.',
      thingsToDo: [
        'Beach picnic at Les Salines’ kilometre-long white-sand crescent',
        'Browse the Saint-Anne Saturday market for crafts and rum',
        'Sundowner crepe at La Dunette on the waterfront',
        'Walk the Trace des Caps coastal trail south to Anse Trabaud',
      ],
      mooringTip:
        'Sainte-Anne Bay is anchor-only on white sand at 4–6 m, exposed to south swell only (rare). Excellent holding; the bay holds 60+ boats comfortably even in February peak.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/sainte-anne.webp',
          alt: 'Saint-Anne',
        },
      ],
    },
    {
      id: 'saint-anne-le-marin',
      routeFrom: 'Saint-Anne',
      routeTo: 'Le Marin',
      day: 7,
      shortDescription:
        'Short final 5 nm hop west back to Le Marin. Charter contracts typically require return by 17:00 Friday for inspection. Marina fuel dock fills early on hand-back days — top up between 09:00 and 12:00 to avoid the queue. Final lunch at Mango Bay or Le Zanzibar on the marina front.',
      description:
        'On your final day, enjoy a short sail back to Le Marin. Depending on your schedule, you can fit in a last swim at one of the nearby coves or simply relax onboard before returning your catamaran. Le Marin’s marina is well-equipped, so you can end your trip with a celebratory dinner ashore—pairing French wine with Caribbean flavors—as you look back on a week of unforgettable sailing.',
      thingsToDo: [
        'Final morning swim at Sainte-Anne before weighing anchor',
        'Top up fuel and water at the Marina du Marin fuel dock',
        'Final lunch at Mango Bay or Le Zanzibar',
        'Hand-back inspection with the charter operator',
      ],
      mooringTip:
        'Charter contracts typically require return by 17:00 Friday for inspection. Marina fuel dock fills early on hand-back days — top up between 09:00–12:00 to avoid the queue.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/le-marin.webp',
          alt: 'Le Marin',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/caribbeans/martinique-itinerary/map.webp',
        alt: 'Martinique Route map',
      },
      width: 854,
      height: 850,
    },
    mobile: {
      image: {
        src: '/images/itinerary/caribbeans/martinique-itinerary/map.webp',
        alt: 'Martinique Route map',
      },
      width: 854,
      height: 850,
    },
  },
};

export default computeItineraryNumberOfDays(martiniqueRoute);
