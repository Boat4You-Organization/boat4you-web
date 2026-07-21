import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const barcelonaRoute: ItineraryRoute = {
  metaTitle: 'Barcelona to Costa Brava: 7-Day Catamaran Itinerary',
  metaDesc:
    "7-day catamaran loop from Barcelona along the Costa Brava: Tossa's walled old town, Palamós prawns, cliff coves and easy sailing legs. With mooring tips.",
  id: 'barcelona',
  startingPoint: 'Barcelona',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/spain/catalonia-itinerary/routes/barcelona.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/spain/banners/barcelona-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/calella-banner-large.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/barcelona-banner.webp', alt: '' },
    { src: '/images/itinerary/spain/banners/barcelona-town-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'barcelona-arenys',
      routeFrom: 'Barcelona (Port Olímpic)',
      routeTo: 'Arenys de Mar',
      day: 1,
      description:
        'Charter day one is admin first, sailing second: boat handover, gas and rig checks, dinghy and chartplotter briefing at Port Olímpic. Stow provisions early — Mercat de la Barceloneta is a short taxi away — and aim to slip lines by early afternoon, when the garbí thermal breeze is established. Once clear of the breakwater, set a course of roughly 045° up the Maresme coast, keeping half a mile off the long sandy beaches and the commuter rail line that hugs them. This is a gentle warm-up leg: flat water close inshore, the cat trotting along at 6-7 knots under full main and genoa. Badalona, El Masnou and Mataró ports slide past to port if you need a bail-out. Arenys de Mar announces itself with a working fishing fleet; time your arrival before about 5 pm and you may catch the boats coming in and the wholesale auction at the llotja. Ashore, the town climbs a single rambla — the Riera — lined with tapas bars, and the local strawberries are a point of civic pride.',
      shortDescription:
        'Check in at Port Olímpic, run the safety brief, then point the bows north-east for roughly 20 NM along the Maresme coast to Arenys de Mar. The afternoon garbí sea breeze usually fills in from the south-west, giving a relaxed downwind first leg at an easy 6-7 knots.',
      thingsToDo: [
        'Watch the late-afternoon fish auction at the llotja in the fishing port.',
        "Taste the famous Arenys strawberries — in season you'll find them all along the Riera.",
        "Walk up the Riera, the leafy rambla that forms the town's spine, for tapas.",
        "Visit the Museu Marès de la Punta to see Arenys's celebrated bobbin lace.",
      ],
      mooringTip:
        "Port d'Arenys is shared between the fishing fleet and Club Nàutic Arenys de Mar; call the marina on VHF 9 before entering and expect 3-5 m in the visitor berths. Book ahead in July and August — transit space is limited.",
      gallery: [{ src: '/images/itinerary/spain/destinations/el-masnou.webp', alt: 'Maresme coast' }],
    },
    {
      id: 'arenys-tossa',
      routeFrom: 'Arenys de Mar',
      routeTo: 'Tossa de Mar',
      day: 2,
      description:
        "Leave Arenys mid-morning and hold the coast past Canet and Sant Pol de Mar. Off Blanes, watch for the Sa Palomera rock — the official gateway of the Costa Brava — and the character of the shore changes within a mile: red cliffs, pines to the waterline, and the first proper calas. If the breeze is late arriving, motor-sail the first hour and pick up the thermal wind after lunch. Tossa de Mar is unmistakable from seaward: the crenellated towers of the Vila Vella, the only fortified medieval town still standing on the Catalan coast, rise straight from the south end of the main beach. Anchor off Platja Gran, drop the hook in 4-6 m over sand, and take the dinghy in. Climb the walls before dinner — the light on the battlements an hour before sunset is the best photograph of the week — and look for the statue of Ava Gardner, who filmed here in 1950 and put Tossa on the map. Eat cim i tomba, the local fishermen's stew.",
      shortDescription:
        "An 18 NM leg north-east into the Costa Brava proper — the beaches of the Maresme give way to pine-backed cliffs after Blanes. With the afternoon south-westerly behind you it's a broad reach most of the way, arriving off Tossa de Mar's walled old town by mid-afternoon.",
      thingsToDo: [
        'Climb the Vila Vella ramparts to the lighthouse for the classic Costa Brava panorama.',
        'Find the bronze statue of Ava Gardner on the walls above Platja Gran.',
        'Swim or paddleboard from the boat to the small Es Codolar cove below the walls.',
        "Order cim i tomba, Tossa's traditional fish-and-potato stew, at a beachfront restaurant.",
      ],
      mooringTip:
        'There is no marina in Tossa; anchor off Platja Gran in 4-8 m over sand with decent holding, or pick up one of the seasonal buoys laid in summer. The bay is open from south to east — move on early if swell is forecast.',
      gallery: [{ src: '/images/itinerary/spain/destinations/tossa-de-mar.webp', alt: 'Tossa de Mar' }],
    },
    {
      id: 'tossa-sant-feliu',
      routeFrom: 'Tossa de Mar',
      routeTo: 'Sant Feliu de Guíxols',
      day: 3,
      description:
        "This stretch between Tossa and Sant Feliu is the Costa Brava at its most photogenic, so treat the 8 miles as a full day out. Round the Tossa headland and work north-east close inshore: Cala Pola, Cala Giverola and Cala Futadera come one after another, each a slot of turquoise water between pine-covered rock. Giverola is the easiest for a catamaran — anchor in 5-8 m over sand outside the buoyed swim zone and dinghy in for a coffee at the beach bar. Water clarity here is the best of the route; bring the snorkels. Sant Feliu de Guíxols opens up behind Punta de Garbí, a genuinely sheltered natural harbour that has been trading since Roman times. Ashore, the Benedictine monastery with its pre-Romanesque Porta Ferrada is worth an hour, but the essential outing is the camí de ronda footpath north to S'Agaró — twenty minutes of carved-stone coastal path ending at Sa Conca beach and the 1920s garden-city villas above it.",
      shortDescription:
        "Only 8 NM today, and that's the point: a slow cruise past the cliff coves of Giverola and Pola with time to anchor, swim and lunch on board before the short run into Sant Feliu de Guíxols. Light airs close under the cliffs — expect to motor-sail between swim stops.",
      thingsToDo: [
        'Anchor for a swim at Cala Giverola — the clearest water of the week.',
        'Snorkel the rocky edges of Cala Pola before the day-tripper boats arrive.',
        "Walk the camí de ronda from Sant Feliu to S'Agaró and Sa Conca beach.",
        'Visit the monastery and its pre-Romanesque Porta Ferrada in the old town.',
      ],
      mooringTip:
        'Port de Sant Feliu is one of the best natural shelters on this coast; the marina answers on VHF 9 with visitor berths in 3-5 m. In settled weather you can anchor off the town beach instead, keeping clear of the fairway.',
      gallery: [
        { src: '/images/itinerary/spain/destinations/sant-feliu-de-guixols.webp', alt: 'Sant Feliu de Guíxols' },
      ],
    },
    {
      id: 'sant-feliu-palamos',
      routeFrom: 'Sant Feliu de Guíxols',
      routeTo: 'Palamós',
      day: 4,
      description:
        "Short legs are a feature of this route, not a bug — today's 7 miles let you sleep in, swim off the transom and still be alongside in Palamós by early afternoon. The town runs on its fishing fleet: boats land their catch at the quay on weekday afternoons, and the public gallery above the llotja lets you watch the auction of the gamba de Palamós, the intensely sweet red prawn that carries its own quality seal. Eat it simply grilled at one of the restaurants along the fishing port — expect to pay serious money and consider it worth every cent. The Museu de la Pesca on the quay tells the story well if you want context. With the boat settled in Marina Palamós, take the dinghy a mile north-east to Cala S'Alguer, a pocket cove lined with whitewashed nineteenth-century fishermen's huts, or to the wide, undeveloped sand of Platja de Castell behind it. Both are protected and both are lovely in the evening light.",
      shortDescription:
        "A 7 NM lunch-hop past S'Agaró and the long sweep of Platja d'Aro to Palamós — an hour and a bit of easy reaching, leaving the whole afternoon for the fish quay. This is the gastronomic stop of the week: the famous Palamós prawn is landed right here.",
      thingsToDo: [
        'Watch the weekday fish auction from the public gallery at the Palamós llotja.',
        'Order grilled gamba de Palamós at a restaurant on the fishing port.',
        "Dinghy to Cala S'Alguer and photograph the whitewashed fishermen's huts.",
        'Spend an hour in the Museu de la Pesca on the quay.',
      ],
      mooringTip:
        'Marina Palamós sits in a deep, well-protected bay and takes catamarans without fuss — berths run 3-6 m, VHF 9, but book ahead in high season as cruise calls and regattas fill the town. In settled weather, anchoring is good off Platja de Castell in 4-6 m over sand.',
      gallery: [{ src: '/images/itinerary/spain/catalonia-itinerary/routes/palamos.webp', alt: 'Palamós' }],
    },
    {
      id: 'palamos-blanes',
      routeFrom: 'Palamós',
      routeTo: 'Blanes',
      day: 5,
      description:
        "Retracing a coast is no hardship when it looks like this. Leave Palamós after breakfast and take the rhumb line south-west; if the crew wants one more cove, Cala Futadera or Giverola make an easy mid-morning swim stop. Blanes is the full stop of the Costa Brava — the Sa Palomera rock on the town beach officially marks where the 'wild coast' begins and ends. The reason to stop here rather than push on is Marimurtra, the clifftop botanical garden founded by the German businessman Karl Faust in the 1920s: some four thousand species terraced down the rock face, with a temple lookout over Cala Sa Forcanera that appears on half the postcards in Catalonia. Go late afternoon when the coach parties have gone. Blanes itself is a real working town rather than a resort — fishing fleet, evening paseo, and a good line of bars around the port. If your dates land in late July, the international fireworks competition fires straight over the anchorage.",
      shortDescription:
        "Turn for home: 14 NM south-west along the coast you climbed, from Palamós back past Sant Feliu and Tossa to Blanes. Morning departures often mean motoring in flat calm until the sea breeze fills; then it's a close reach with the cliffs sliding by to starboard.",
      thingsToDo: [
        'Wander Marimurtra botanical garden and stand in the Linnaeus temple above Cala Sa Forcanera.',
        'Walk out to the Sa Palomera rock, the official start of the Costa Brava.',
        'Join the evening crowd at Blanes fishing port when the boats come in.',
        'Swim at Cala Sant Francesc, a sheltered sandy cove just north of the harbour.',
      ],
      mooringTip:
        'Port de Blanes has visitor berths in 3-6 m — call ahead, as space is tighter than at Palamós. In calm, settled conditions you can anchor off Cala Sant Francesc over sand, but it is untenable in any southerly swell.',
      gallery: [{ src: '/images/itinerary/spain/destinations/blanes.webp', alt: 'Blanes' }],
    },
    {
      id: 'blanes-arenys',
      routeFrom: 'Blanes',
      routeTo: 'Arenys de Mar',
      day: 6,
      description:
        "The return along the Maresme is the day to slow right down. Clear Blanes early while the water is glassy. Calella's 1859 lighthouse on its headland is the first easy mark to steer for; a few miles beyond it, Sant Pol de Mar is the prettiest lunch stop — a whitewashed village stacked above a string of small beaches, with good holding in sand a couple of hundred metres off. Swim, paddleboard, and eat on board; there is no better-value restaurant than your own cockpit on this coast. Weekend jet-ski and small-boat traffic can be busy inshore here, so keep a proper lookout when swimmers are off the transom. Aim to be back inside Port d'Arenys by late afternoon — the berth will feel like home by now — and use the last evening well: this is the night for a long dinner ashore, a suquet de peix or fideuà, and settling the crew kitty.",
      shortDescription:
        'Cross back onto the Maresme with a 12 NM leg from Blanes to Arenys de Mar, breaking it up with lunch at anchor off Sant Pol de Mar or Calella. The morning is usually quiet water for motoring; linger too long and the afternoon garbí turns the last miles into a gentle beat.',
      thingsToDo: [
        'Anchor for lunch off Sant Pol de Mar and swim in to its village beaches.',
        'Steer for the 1859 Far de Calella lighthouse — the classic Maresme landmark.',
        'Get the paddleboards and snorkels out for one final full session at anchor.',
        'Book a table in Arenys for a farewell suquet de peix or fideuà dinner.',
      ],
      mooringTip:
        "Same drill as day one at Port d'Arenys — call ahead on VHF 9 and ask for your previous berth. The Maresme lunch anchorages are open roadsteads over sand: fine in daytime settled weather, not overnight stops.",
      gallery: [{ src: '/images/itinerary/spain/destinations/calella.webp', alt: 'Maresme coast' }],
    },
    {
      id: 'arenys-barcelona',
      routeFrom: 'Arenys de Mar',
      routeTo: 'Barcelona (Port Olímpic)',
      day: 7,
      description:
        "Slip lines at first light — partly for the schedule, mostly because the Maresme at dawn, flat calm with fishermen working their pots, is a memory worth having. It is three hours of easy motoring or motor-sailing at 6-7 knots, so build in one last swim stop off Ocata or El Masnou if time allows. The approach to Barcelona is a proper piece of theatre: Tibidabo and the Collserola tower on the ridge, Montjuïc dropping to the sea, the twin towers of Port Olímpic and the Frank Gehry goldfish glinting behind the beach. Keep a sharp watch in the last two miles — swimmers, SUP boards and tour boats crowd the water off Barceloneta and Bogatell all summer. Top up at the fuel berth inside Port Olímpic before taking your assigned pontoon, then run the standard handover: engine hours, tank levels, inventory, damage walk-round. If the flight is late, the beach promenade and Barceloneta's tapas bars are ten minutes' walk from the pontoon.",
      shortDescription:
        "The final 20 NM run home, ideally started early to make check-out comfortably: south-west down the Maresme in the morning calm, Barcelona's skyline lifting over the bow — Tibidabo, the Sagrada Família spires, the sail-shaped W hotel — before you round into Port Olímpic for fuel and handover.",
      thingsToDo: [
        'Leave at first light and watch the Maresme fishing fleet work the dawn calm.',
        "Photograph the skyline approach — Gehry's golden fish, the twin towers, Montjuïc behind.",
        'Take one last swim off Ocata beach before the final miles.',
        'Toast the loop with vermut and tapas in Barceloneta after handover.',
      ],
      mooringTip:
        'Fuel up at the station inside Port Olímpic before returning to the charter pontoon — queues build on Friday and Saturday mornings, so arrive early. Depths inside are a comfortable 3-5 m; call the base as you pass the breakwater for berthing directions.',
      gallery: [{ src: '/images/itinerary/spain/destinations/barcelona.webp', alt: 'Barcelona' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/map.webp',
        alt: 'Barcelona Route Image',
      },
      width: 2462,
      height: 1340,
    },
    mobile: {
      image: {
        src: '/images/itinerary/spain/catalonia-itinerary/mobile-map.webp',
        alt: 'Barcelona Route Image',
      },
      width: 1654,
      height: 1346,
    },
  },
};

export default computeItineraryNumberOfDays(barcelonaRoute);
