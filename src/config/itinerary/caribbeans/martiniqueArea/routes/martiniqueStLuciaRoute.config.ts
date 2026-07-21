import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const martiniqueStLuciaRoute: ItineraryRoute = {
  metaTitle: 'Martinique & St. Lucia Catamaran Itinerary – 7 Days',
  metaDesc:
    'Sail Le Marin to the Pitons and back: a 7-day Martinique & St. Lucia catamaran route with channel crossings, Marigot Bay, SMMA moorings and turtle-filled bays.',
  id: 'martinique-st-lucia-route',
  startingPoint: 'Le Marin',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/caribbeans/banners/martinique-banner-large.webp',
    alt: 'Le Marin route card',
  },
  gallery: [
    {
      src: '/images/itinerary/caribbeans/banners/martinique-banner-large.webp',
      alt: 'Martinique',
    },
    {
      src: '/images/itinerary/caribbeans/banners/martinique-town-banner-large.webp',
      alt: 'Martinique town',
    },
    {
      src: '/images/itinerary/caribbeans/banners/martinique-banner.webp',
      alt: 'Martinique',
    },
  ],
  routeDays: [
    {
      id: 'le-marin-sainte-anne',
      routeFrom: 'Le Marin',
      routeTo: 'Sainte-Anne',
      day: 1,
      shortDescription:
        "Ease into the week with a gentle 2 NM shakedown from Le Marin's mangrove-lined channel to the huge, sandy Sainte-Anne anchorage. Flat water, light trade-wind puffs and just enough time to test the sails, the dinghy and the rum supply before sunset.",
      description:
        "Most crews step aboard in Le Marin around midday, so keep day one simple. Finish provisioning at the supermarkets within walking distance of the marina, run through the boat briefing properly, then slip the lines and follow the well-marked channel out through the mangroves. Sainte-Anne sits barely 2 NM away — a wide, sand-bottomed bay with room for a hundred boats and rarely a rolly night. Use the short hop as a shakedown: hoist the main, check the furler, calibrate the autopilot, and make sure the dinghy outboard starts on the first pull. Anchor in 2–4 metres over clean sand off the village, then dinghy ashore for a sundowner. Sainte-Anne itself is a sleepy French-Creole village with a pretty stone church, a few beach bars and a boulangerie for tomorrow's baguettes. If there's daylight left, walk south toward Grande Anse des Salines, often called Martinique's finest beach. Early night — tomorrow is the real sailing.",
      thingsToDo: [
        "Stock up on fresh baguettes and rum at Le Marin's marina-side shops before departure",
        'Run a full sail and systems shakedown on the short hop to Sainte-Anne',
        'Dinghy ashore to Sainte-Anne village and its old stone church',
        'Walk south to Grande Anse des Salines for a sunset swim',
      ],
      mooringTip:
        'Anchor anywhere off Sainte-Anne in 2–5 m over sand — holding is excellent and there is acres of room. Keep clear of the marked swimming zones close to the beach and leave the dinghy channel free.',
      gallery: [{ src: '/images/itinerary/caribbeans/destinations/sainte-anne.webp', alt: 'Sainte-Anne' }],
    },
    {
      id: 'sainte-anne-rodney-bay',
      routeFrom: 'Sainte-Anne',
      routeTo: 'Rodney Bay (St. Lucia)',
      day: 2,
      shortDescription:
        "The week's first proper passage: 22 NM across the St. Lucia Channel, where the trades funnel and open Atlantic swell rolls between the islands. Expect a lively beam reach and a wet foredeck, then flat water, customs formalities and cold Piton beers waiting in Rodney Bay.",
      description:
        "Get the anchor up early — the St. Lucia Channel is best crossed before the afternoon trades stack up. Once you clear Pointe des Salines the shelter of Martinique disappears fast, and for around three hours you're in open Atlantic water: 20-plus knots on the beam, a long ocean swell and a west-setting current that rewards steering a few degrees high of the rhumb line. Put a reef in at the start; a catamaran at 6–7 knots eats this crossing in style. St. Lucia's dramatic north tip rises steadily ahead, and once you round Pigeon Island the water flattens like a switch was flipped. Head into IGY Rodney Bay Marina to clear customs and immigration — filing your details in advance on SailClear speeds things up considerably. Formalities done, anchor off Reduit Beach or stay on the dock, then dinghy or walk to Pigeon Island National Park and climb to Fort Rodney for a view back across the channel you just crossed.",
      thingsToDo: [
        'Clear in to St. Lucia at Rodney Bay Marina — pre-file on SailClear to save time',
        'Hike up to Fort Rodney on Pigeon Island for channel-wide views',
        "Swim off Reduit Beach's long strip of pale sand",
        'Celebrate the crossing with a cold Piton lager at the marina bars',
      ],
      mooringTip:
        'Anchor off Reduit Beach in 3–6 m over sand with good holding, or book a berth at IGY Rodney Bay Marina for water, power and an easy walk to customs. Pigeon Island National Park charges a small landing fee if you go ashore.',
      gallery: [
        { src: '/images/itinerary/caribbeans/banners/martinique-banner.webp', alt: 'Windward Islands channel' },
      ],
    },
    {
      id: 'rodney-bay-marigot-bay',
      routeFrom: 'Rodney Bay',
      routeTo: 'Marigot Bay (St. Lucia)',
      day: 3,
      shortDescription:
        "A short, easy 8 NM slide down St. Lucia's sheltered lee coast, motorsailing or ghosting along in flat water past Castries. By lunchtime you're threading the narrow entrance into Marigot Bay — a mangrove-wrapped hurricane hole so pretty it barely looks real.",
      description:
        "After yesterday's channel, day three is pure decompression. The lee of St. Lucia gives you flat water and shifty puffs spilling off the hills, so expect a lazy mix of sailing and motoring as you pass Castries — keep an eye out for cruise-ship traffic off the harbour mouth. Marigot Bay's entrance is famously hard to spot from seaward; a narrow cut between steep green headlands suddenly opens into a perfectly protected lagoon that has sheltered boats from hurricanes for centuries. Legend says a British admiral once hid his fleet in here with palm fronds tied to the masts, and Hollywood shot the 1967 Doctor Dolittle along its shoreline. Pick up a mooring in the inner lagoon or take a berth at Marigot Bay Marina, then spend the afternoon exactly as the bay demands: swim off the palm-fringed sandbar, ride the little water taxi across to the beach side, and settle in somewhere with a rum punch as the frigatebirds circle the ridgeline at dusk.",
      thingsToDo: [
        'Swim off the palm-fringed sandbar guarding the lagoon entrance',
        'Ride the tiny water taxi across the bay for a beachside lunch',
        'Paddleboard deep into the mangrove fringe at the head of the lagoon',
        'Toast the sunset with a rum punch on the Marigot Bay Marina waterfront',
      ],
      mooringTip:
        'The inner lagoon is deep with limited swinging room, so most crews pick up one of the managed mooring balls or berth at Marigot Bay Marina — book ahead in season. Local boatmen may offer to help with lines; agree any tip beforehand.',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/banners/martinique-town-banner-large.webp',
          alt: 'Marigot Bay, St. Lucia',
        },
      ],
    },
    {
      id: 'marigot-bay-soufriere',
      routeFrom: 'Marigot Bay',
      routeTo: 'Soufrière (Pitons)',
      day: 4,
      shortDescription:
        "Just 7 NM, but the payoff is enormous: the twin volcanic spires of the Pitons growing off the bow all morning. Expect fluky lee-shore breeze, then a mandatory SMMA park mooring beneath Petit Piton and an afternoon snorkelling some of St. Lucia's best reef.",
      description:
        "This is the leg everyone books the route for. From Marigot it's a lazy 7 NM under the lee of the island, and within an hour the Pitons — Gros and Petit, both UNESCO-listed — start filling the horizon like something from another planet. The whole Soufrière coastline sits inside the Soufrière Marine Management Area: anchoring is prohibited, so you must take a park mooring. Rangers come by to collect the fee, and local boat boys will meet you well offshore offering to run lines — choose one, agree the price with a smile, and they'll earn it, since moorings off Sugar Beach often need a stern line to a palm tree. Once secure, you're floating between two volcanic spires with reef right under the boat. Snorkel Anse Chastanet's protected reef, taxi up to the Sulphur Springs drive-in volcano and the Diamond Falls Botanical Gardens, or walk the Tet Paul Nature Trail for the classic between-the-Pitons photograph. Sunset here, tucked under Petit Piton, is a lifetime keeper.",
      thingsToDo: [
        'Snorkel the reef drop-off at Anse Chastanet inside the marine reserve',
        "Bathe in the mud pools at Sulphur Springs, the 'drive-in volcano'",
        'Walk the Tet Paul Nature Trail for the iconic Pitons viewpoint',
        'Swim off Sugar Beach with Petit Piton towering straight overhead',
      ],
      mooringTip:
        "Anchoring is banned throughout the SMMA — pick up a park mooring off Sugar Beach, Anse Chastanet or Soufrière town and pay the ranger's fee in cash (EC or US dollars). Off Sugar Beach the shelf drops steeply, so expect a boat boy to run your stern line ashore.",
      gallery: [
        { src: '/images/itinerary/caribbeans/banners/martinique-banner-large.webp', alt: 'The Pitons, St. Lucia' },
      ],
    },
    {
      id: 'soufriere-rodney-bay',
      routeFrom: 'Soufrière',
      routeTo: 'Rodney Bay (St. Lucia)',
      day: 5,
      shortDescription:
        "Retrace the lee coast 14 NM north, close enough inshore to trace waterfalls and fishing villages, with gusty puffs off the valleys keeping the trim interesting. Back in Rodney Bay, clear customs out for tomorrow's channel crossing, then claim a sunset spot near Pigeon Island.",
      description:
        "Take a last morning swim under the Pitons before dropping the mooring — the light on Petit Piton just after sunrise is worth the early alarm. The 14 NM back north runs the same lee coast in reverse, and it's worth breaking it up: Anse Cochon, roughly halfway, is a quiet dark-sand cove with some of the island's healthiest inshore snorkelling and makes a perfect mooring-ball lunch stop. Winds funnel and die off the valleys, so keep the sheets in hand and let the engines fill the gaps. Arriving into Rodney Bay mid-afternoon leaves time for the important job: clearing customs and immigration out of St. Lucia at the marina office, so tomorrow's crossing can start at first light with paperwork already done. Chores finished, reward the crew — dinghy toward Pigeon Island for a swim and watch the sun drop into the sea beside Fort Rodney. If it happens to be Friday, the famous street party at Gros Islet fires up just behind the anchorage.",
      thingsToDo: [
        'Break the passage at Anse Cochon for a snorkel over its inshore reef',
        'Clear customs and immigration out of St. Lucia at Rodney Bay Marina',
        'Dinghy to Pigeon Island for a sunset swim below Fort Rodney',
        'Join the Friday-night street party at Gros Islet if your timing lands right',
      ],
      mooringTip:
        'Drop the hook off Reduit Beach again in 3–6 m of good sand, handy for the marina customs office. Clear out the evening before so you can sail for Martinique at dawn without waiting for offices to open.',
      gallery: [{ src: '/images/itinerary/caribbeans/banners/martinique-banner.webp', alt: 'Rodney Bay, St. Lucia' }],
    },
    {
      id: 'rodney-bay-grande-anse',
      routeFrom: 'Rodney Bay',
      routeTo: "Grande Anse d'Arlet",
      day: 6,
      shortDescription:
        "Back across the St. Lucia Channel — 20 NM of proper trade-wind sailing, reaching through open Atlantic swell until Martinique's lee smooths everything out. Clear back into France ashore at Grande Anse d'Arlet, then spend the afternoon drifting over seagrass beds thick with green turtles.",
      description:
        "Slip out of Rodney Bay at first light with clearance papers already stamped, and the channel usually rewards you: 20 NM on a fast beam-to-broad reach, the Atlantic swell shouldering under the hulls until Martinique's Cap Salomon draws its wind shadow over the water. Grande Anse d'Arlet opens up as a deep, calm horseshoe of pale sand backed by a low-key fishing village — this is the French clearance point on this coast, so head ashore to the customs computer, tap in the crew list, and you're legally back in France in ten minutes. Then the real business: the bay's seagrass meadows host one of the Caribbean's most reliable green turtle populations, and you'll likely spot them surfacing beside the boat before you've even got fins on. Snorkel slowly, keep your distance, and let them graze. Ashore, beach restaurants line the sand, and a short dinghy ride south brings you to Les Anses-d'Arlet's photogenic church-and-pier waterfront.",
      thingsToDo: [
        "Snorkel the seagrass beds with Grande Anse's resident green turtles",
        'Clear back into France at the village customs computer',
        "Dinghy south to Les Anses-d'Arlet's famous church-and-pier view",
        'Grab a barefoot creole lunch at the beach restaurants lining the sand',
      ],
      mooringTip:
        'Pick up one of the white visitor buoys laid to protect the seagrass — anchoring is restricted across much of the bay, and the turtles are the reason why. Buoys are first-come, so arrive by early afternoon in high season.',
      gallery: [{ src: '/images/itinerary/caribbeans/destinations/grande-anse.webp', alt: "Grande Anse d'Arlet" }],
    },
    {
      id: 'grande-anse-le-marin',
      routeFrom: "Grande Anse d'Arlet",
      routeTo: 'Le Marin',
      day: 7,
      shortDescription:
        'A gentle 12 NM finale: morning swim with the turtles, then a close pass around HMS Diamond Rock — the volcanic islet the Royal Navy once commissioned as a warship — before a flat-water reach along the south coast back into Le Marin for check-out.',
      description:
        "Save one last snorkel with the turtles before coffee, then point the bows south for the finale. Twenty minutes out you'll round Diamond Rock, a sheer 175-metre volcanic plug with a story worth telling on the way: in 1804 the Royal Navy landed cannon and sailors on it and commissioned the islet as 'HMS Diamond Rock', a stone warship that harassed French shipping for a year and a half before being retaken. The wind accelerates between the rock and the Martinique shore, so expect a few lively gusts and short chop as you pass — a final flourish before the south coast flattens the sea for the reach home. If the schedule allows, drop the hook off Sainte-Anne one more time for lunch and a swim, then follow the buoyed channel through the mangroves into Le Marin. Top up the fuel at the marina dock, hand back the boat, and start plotting the return trip — most crews do before they've left the dock.",
      thingsToDo: [
        'Take a farewell snorkel with the turtles before slipping the mooring',
        'Round HMS Diamond Rock and retell its 1804 stone-warship story',
        'Anchor off Sainte-Anne for one last lunch swim if time allows',
        "Refuel at Le Marin's fuel dock before the check-out walkthrough",
      ],
      mooringTip:
        "Give Diamond Rock a respectful offing — wind funnels and seas stack in the gap between rock and shore — then time your arrival to reach Le Marin's fuel dock before the late-afternoon rush. Berthing for check-out is directed by the base team on VHF.",
      gallery: [{ src: '/images/itinerary/caribbeans/destinations/le-marin.webp', alt: 'Le Marin' }],
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

export default computeItineraryNumberOfDays(martiniqueStLuciaRoute);
