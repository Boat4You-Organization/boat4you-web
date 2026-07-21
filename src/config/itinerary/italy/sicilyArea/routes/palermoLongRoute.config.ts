import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const palermoLongRoute: ItineraryRoute = {
  metaTitle: '7-Day Palermo Round-Trip Yacht Charter | Aeolian Islands Adventure',
  metaDesc:
    'Sail a 7-day yacht charter from Palermo through Mondello, Cefalù, Lipari, Salina, Panarea and Ustica — Aeolian volcanic archipelago + Tyrrhenian island reserve.',
  id: 'palermoLong',
  startingPoint: 'Palermo',
  otherPoints: ['Long'],
  cardImage: { src: '/images/itinerary/italy/sicily-itinerary/routes/palermo-long.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/lipari-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/stromboli-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/panarea-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/saura-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'palermo-mondello',
      routeFrom: 'Palermo',
      routeTo: 'Mondello',
      day: 1,
      mapPin: {
        desktop: { left: 40.1, top: 73.7 },
        mobile: { left: 44.1, top: 58.7 },
      },
      description:
        '8 nm shake-down north from Marina Cala to Mondello — turquoise crescent at the foot of Monte Pellegrino, Belle Époque pier, the closest swim beach to Palermo. Day-anchor at Mondello on sand 4-6 m, sheltered from N. Mooring at the small Mondello marina or back at Marina Cala for the night.',
      shortDescription:
        '8 nm shake-down N to Mondello — turquoise crescent at foot of Monte Pellegrino. Belle Époque pier. Closest swim to Palermo. Day-anchor sheltered N. Anchor on sand at 4-6 m as alternative; Marina Cala 8 nm S for overnight return.',
      thingsToDo: [
        'Anchor swim at Mondello sand crescent',
        'Walk the Belle Époque Mondello pier',
        'Hike Monte Pellegrino panorama trail',
        'Pasta con le sarde at Antica Focacceria',
      ],
      mooringTip:
        'Mondello small marina stern-to, €60-90/night, sheltered from N. Anchor on sand at 4-6 m as alternative. Marina Cala 8 nm S for overnight return.',
      gallery: [{ src: '/images/itinerary/italy/destinations/mondello.webp', alt: 'Mondello' }],
    },
    {
      id: 'mondello-cefalu',
      routeFrom: 'Mondello',
      routeTo: 'Cefalù',
      day: 2,
      mapPin: {
        desktop: { left: 38.2, top: 67.5 },
        mobile: { left: 40.6, top: 53.5 },
      },
      description:
        '32 nm east to Cefalù — Norman cathedral town (12th-c, UNESCO mosaics). Marina di Cefalù stern-to is the standard charter overnight, sheltered from N. Climb the serpentine road to La Rocca cliff-top ruins for the panorama back to the cathedral and the beach.',
      shortDescription:
        '32 nm E to Cefalù — Norman 12th-c UNESCO cathedral. Marina di Cefalù sheltered N. Climb La Rocca cliff-top ruins for panorama. Anchor in the bay outside on sand at 5-7 m as alternative. Plan to swim Spiaggia di Mazzaforno marble pebbles and sunset at Bastione waterfront restaurant.',
      thingsToDo: [
        'Visit the 12th-c Norman Cathedral (UNESCO mosaics)',
        'Climb La Rocca cliff-top ruins for panorama',
        'Swim Spiaggia di Mazzaforno marble pebbles',
        'Sunset at Bastione waterfront restaurant',
      ],
      mooringTip:
        'Marina di Cefalù stern-to, €80-120/night peak, sheltered from N. Anchor in the bay outside on sand at 5-7 m as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/cefalu.webp', alt: 'Cefalù' }],
    },
    {
      id: 'cefalu-lipari',
      routeFrom: 'Cefalù',
      routeTo: 'Lipari',
      day: 3,
      mapPin: {
        desktop: { left: 56.9, top: 78.9 },
        mobile: { left: 56.4, top: 63.1 },
      },
      description:
        '38 nm long northeast to Lipari — capital of the Aeolian archipelago. Marina Lunga at Lipari town for stern-to overnight. Pumice Quarries on the north coast for the unique post-industrial swim site (white pumice cliffs + Caribbean water). Marina Lunga stern-to, €70-120/night peak. Refuel at the entrance fuel berth before mooring. Plan to swim Pumice Quarries (white cliffs + Caribbean water), visit the Aeolian Archaeological Museum, walk the Norman Lipari Cathedral cobbled lanes.',
      shortDescription:
        '38 nm long NE to Lipari — capital of Aeolians. Marina Lunga for overnight. Pumice Quarries N coast for unique post-industrial swim. Marina Lunga stern-to, €70-120/night peak. Plan to visit the Aeolian Archaeological Museum and walk the Norman Lipari Cathedral cobbled lanes.',
      thingsToDo: [
        'Swim Pumice Quarries (white cliffs + Caribbean water)',
        'Visit the Aeolian Archaeological Museum',
        'Walk the Norman Lipari Cathedral cobbled lanes',
        'Totani rings + Malvasia on Marina Corta',
      ],
      mooringTip: 'Marina Lunga stern-to, €70-120/night peak. Refuel at the entrance fuel berth before mooring.',
      gallery: [{ src: '/images/itinerary/italy/destinations/lipari.webp', alt: 'Lipari' }],
    },
    {
      id: 'lipari-salina',
      routeFrom: 'Lipari',
      routeTo: 'Salina',
      day: 4,
      mapPin: {
        desktop: { left: 85.7, top: 43.8 },
        mobile: { left: 85.7, top: 43.8 },
      },
      description:
        '6 nm short northwest to Salina — twin volcanic peaks, only fertile Aeolian. Santa Marina Salina for stern-to overnight. Hike Monte Fossa delle Felci (962 m, 4 h up) through fern-forest. Granita di gelsi (mulberry ice) at Da Alfredo on the harbour quay is the local institution.',
      shortDescription:
        '6 nm short NW to Salina — only fertile Aeolian. Santa Marina E for overnight. Monte Fossa delle Felci (962 m, fern forest) hike. Da Alfredo granita on quay.',
      thingsToDo: [
        'Granita di gelsi (mulberry ice) at Da Alfredo',
        'Hike Monte Fossa delle Felci (962 m, 4 h)',
        'Tasting Malvasia delle Lipari at Hauner',
        'Swim Pollara black-sand bay (Il Postino setting)',
      ],
      mooringTip: 'Santa Marina Salina stern-to, €60-100/night, sheltered from N. Rinella south coast as alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/salina.webp', alt: 'Salina' }],
    },
    {
      id: 'salina-vulcano',
      routeFrom: 'Salina',
      routeTo: 'Vulcano',
      day: 5,
      description:
        "Slip out of Santa Marina di Salina mid-morning; the run to Vulcano is only 12 NM, most of it in the lee of Lipari. If the wind cooperates, sail the channel between the two islands and hold close along Lipari's east coast past the white pumice slopes above Canneto. Through the Bocche di Vulcano, the sulphur reaches you before the harbour does. Pick up a buoy in Porto di Levante and go ashore early for the Gran Cratere: the trail starts a short walk south of the port, climbs 391 m in under an hour, and the rim view over the whole archipelago is the best in the Aeolians — carry water and check locally that the path is open, as it closes when gas levels spike. Back at sea level, the famous mud pools sit right by the harbour (opening has varied in recent seasons, so ask), and the fumarole-warmed shallows beside the beach stay bathtub-warm. Cross the neck of the island on foot for sunset at Sabbie Nere, the black-sand beach on the Ponente side.",
      shortDescription:
        "A short 12 NM hop south from Salina, sliding past Lipari's pumice-scarred east coast into Porto di Levante on Vulcano. Expect an easy two-hour sail, often a relaxed reach once the afternoon westerly fills in — time enough for a swim stop before the sulphur smell announces your arrival.",
      thingsToDo: [
        'Hike the Gran Cratere rim trail (391 m) early or late in the day to dodge the heat',
        'Soak in the fumarole-warmed shallows beside the beach at Porto di Levante',
        'Ask locally whether the sulphur mud pools by the harbour are open and take a dip',
        "Walk across the island's neck to Sabbie Nere black-sand beach for sunset",
      ],
      mooringTip:
        "Porto di Levante is mostly buoy moorings run by local concessions — call ahead in July–August and expect constant ferry and hydrofoil wash. If you prefer to anchor, Porto di Ponente's black sand holds well in 3–8 m but is open to the NW.",
      gallery: [{ src: '/images/itinerary/italy/destinations/vulcano.webp', alt: 'Vulcano' }],
    },
    {
      id: 'vulcano-cefalu',
      routeFrom: 'Vulcano',
      routeTo: 'Cefalù',
      day: 6,
      description:
        "Set an alarm: with 46 NM to cover, aim to be off the buoy by 06:00. Clear the Bocche di Vulcano and lay a course of roughly 240° for Cefalù; in the usual morning calm you'll motor at first, then the afternoon NW breeze often gives you the last hours under sail. It's the emptiest stretch of the week — log the miles, watch for the hydrofoil traffic converging on Milazzo behind you, and set fixed watches so everyone gets a rest. La Rocca, the 268 m crag that shelters Cefalù, shows itself from a long way out. Berth in Porto Presidiana on the east side of the headland and walk the ten minutes into town. Climb La Rocca while the light is low — the path leaves from the Salita Saraceni off Piazza Garibaldi (ticketed; last entry well before sunset) — then see the Norman cathedral, whose 12th-century Christ Pantocrator mosaic anchors the UNESCO Arab-Norman route. Finish with dinner in the lanes off Via Vittorio Emanuele; you've earned it.",
      shortDescription:
        "The big one: 46 NM of open Tyrrhenian back to Sicily, so slip your mooring at first light. In the morning calm you'll motor the first hours; a NW sea breeze often fills in after midday for a beam reach into Cefalù. Watch for ferry traffic off Vulcano.",
      thingsToDo: [
        'Climb La Rocca via the Salita Saraceni to the Temple of Diana and the castle ruins',
        'Visit the Duomo di Cefalù and its Byzantine Christ Pantocrator mosaic (UNESCO)',
        'Find the medieval Lavatoio washhouse carved into the rock below Via Vittorio Emanuele',
        "Swim off the old-town beach beneath the fishermen's houses before dinner",
      ],
      mooringTip:
        'Reserve a berth at Porto Presidiana, the harbour NE of La Rocca — transit space is limited in season, with roughly 3–5 m inside. In settled weather you can anchor off the old-town beach on sand instead, but it is untenable in any NW swell.',
      gallery: [{ src: '/images/itinerary/italy/destinations/cefalu.webp', alt: 'Cefalù' }],
    },
    {
      id: 'cefalu-palermo',
      routeFrom: 'Cefalù',
      routeTo: 'Palermo',
      day: 7,
      description:
        "The last leg runs 36 NM west along the Sicilian coast, and there's no reason to hurry out of Cefalù before a proper breakfast. Stay a mile or so offshore, tick off Capo Plaia and the cranes of Termini Imerese, and plan a final swim under the limestone cliffs of Capo Zafferano — the small bay at Sant'Elia, the fishing village tucked under the cape's eastern side, does the job. Rounding into the Gulf of Palermo, Monte Pellegrino fills the horizon; the city berths lie beneath it at Marina Villa Igiea and the Cala. Get lines and fuel sorted first — Friday afternoon is when the whole charter fleet returns — then head into town while it's still light. Ballarò, Palermo's oldest street market, runs until early evening in the Albergheria quarter: eat panelle and sfincione where you stand. If energy remains, the Quattro Canti and the cathedral are a short walk on. Back aboard, pack, settle the fuel receipt, and be ready for the 09:00 handover.",
      shortDescription:
        'A final 36 NM west along the Sicilian shore, cape to cape past Termini Imerese and Capo Zafferano, then across the Gulf of Palermo. Usually a gentle morning motor-sail with a lunchtime swim stop, docking mid-afternoon with time for the markets before checkout.',
      thingsToDo: [
        "Take a last swim beneath the cliffs of Capo Zafferano off Sant'Elia",
        'Graze Ballarò market in the Albergheria — panelle, sfincione and a stand-up glass of wine',
        'Walk from the Quattro Canti to Palermo Cathedral for a final dose of Arab-Norman Sicily',
        'Refuel, square away the boat and run through the inventory before the morning handover',
      ],
      mooringTip:
        'Marina Villa Igiea and the Cala both take returning charter yachts — confirm your assigned berth with the base the day before, med-moor on lazy lines in 4–6 m. Refuel on Friday afternoon early; a queue builds at the fuel quay as the fleet comes home.',
      gallery: [{ src: '/images/itinerary/italy/destinations/palermo.webp', alt: 'Palermo' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/map.webp',
        alt: 'Palermo Route Image',
      },
      width: 2778,
      height: 1162,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/sicily-itinerary/mobile-map.webp',
        alt: 'Palermo Route Image',
      },
      width: 1814,
      height: 1336,
    },
  },
};

export default computeItineraryNumberOfDays(palermoLongRoute);
