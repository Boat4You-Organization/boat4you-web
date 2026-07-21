import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const lefkasPaxosIthaka14DaysRoute: ItineraryRoute = {
  metaTitle: '14-Day Lefkas–Paxos–Ithaka Yacht Charter Route | Ionian Sailing',
  metaDesc:
    'Sail a 14-day yacht charter from Lefkas through Paxos to Ithaka. Olive groves, Byzantine harbours, hidden coves and the myths of the Ionian Islands across two weeks.',
  id: 'lefkas-paxos-ithaka-14-days',
  startingPoint: 'Lefkas',
  otherPoints: ['Paxos', 'Ithaka'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/lefkas-paxos-ithaka.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/greece/banners/kefalonia-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/corfu-banner-large.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/lefkas-banner.webp',
      alt: '',
    },
    {
      src: '/images/itinerary/greece/banners/ithaka-banner.webp',
      alt: '',
    },
  ],
  routeDays: [
    {
      id: 'lefkas-parga',
      routeFrom: 'Lefkas',
      routeTo: 'Parga',
      day: 1,
      mapPin: {
        desktop: { left: 69.4, top: 46.9 },
        mobile: { left: 69.4, top: 45.7 },
      },
      shortDescription:
        'Roughly 30 nm north up the Epirus mainland coast out of D-Marin Lefkas to Parga. Lefkas Canal swing-bridge opens on the hour — plan around it. Pastel village under a Venetian castle on a turquoise bay.',
      thingsToDo: [
        'Swim Valtos Beach golden crescent',
        'Climb to the Venetian castle ramparts',
        'Saganaki prawns on the harbour Bara taverna',
        'Lantern-lit stairs of the old town at dusk',
        'Coffee with view at the Krioneri kafenio',
      ],
      mooringTip:
        'Anchor in Parga bay (5–10 m sand, holding good) or stern-to on the small town quay (limited slots). Exposed to S–SW — shift round to Valtos cove (1 nm west) if a southerly is forecast.',
      description:
        'First passage of the week — D-Marin Lefkas up the Epirus mainland to Parga, about 30 nm with the Lefkas Canal swing-bridge gating the start. The bridge opens on the hour every hour, and the waiting basin on the south side holds 30+ boats in season; aim for the 09:00 lift to clear it without rushing. Once through, the SW thermal builds along the mainland from late morning and carries you north on a beam reach. Parga itself is the postcard town under the 14th-century Norman-Venetian castle — pastel houses staggered down the hillside to the bay, Valtos Beach 1 nm west for the swim stop, and a row of harbour-side tavernas at sea level. Krioneri kafenio on the eastern arm of the bay is the local coffee waypoint; the climb to the castle ramparts (~25 min) lands you above the rooftops in time for the sunset photograph.',
      gallery: [{ src: '/images/itinerary/greece/destinations/parga.webp', alt: 'Parga' }],
    },
    {
      id: 'parga-sivota',
      routeFrom: 'Parga',
      routeTo: 'Sivota',
      day: 2,
      mapPin: {
        desktop: { left: 58.8, top: 24.2 },
        mobile: { left: 51.3, top: 24.5 },
      },
      shortDescription:
        'About 14 nm north along the mainland to Sivota (Mourtos) — the mainland village, not the Lefkas namesake. Blue Lagoon islets and a cypress-fringed horseshoe bay. Easy passage with a settled NW.',
      thingsToDo: [
        'Snorkel the Blue Lagoon between Mavro Oros and Mourtemeno',
        'Lunch of bourdeto fish stew on the inner quay',
        'Dinghy out to the Bella Vraka sandbar',
        'Walk the pine path above Mega Trafos cove',
        'Mastiha cocktail nightcap on the seafront',
      ],
      mooringTip:
        'Stern-to on Sivota town quay (small fee, water/electric) or anchor off Bella Vraka (5–8 m sand, sheltered from N–NW). Weekend crowding common — radio Port Police on Ch 9 ahead.',
      description:
        "A short 14-nautical-mile leg north to the mainland Sivota, often called Mourtos to disambiguate from the Sivota on Lefkas's south coast — same name, two different villages, a constant source of charter-crew confusion. The geography here is the headline: the village sits inside a horseshoe bay protected by two long, cypress-covered islets (Mavro Oros and Mourtemeno), with a 200-m gap between them that the local marketing has christened the Blue Lagoon. The water clarity in that gap is real — 4 m sand seabed, no posidonia. Bella Vraka sandbar between the islets is the photo stop. Move into the town quay before 17:00; the inner berth has water and electric and the harbour-side tavernas (Stavros, Karnayio) run bourdeto — the spicy Ionian fish stew that needs an hour and is worth ordering when you sit down.",
      gallery: [{ src: '/images/itinerary/greece/destinations/sivota.webp', alt: 'Sivota' }],
    },
    {
      id: 'sivota-corfu',
      routeFrom: 'Sivota',
      routeTo: 'Corfu',
      day: 3,
      mapPin: {
        desktop: { left: 54.1, top: 19.5 },
        mobile: { left: 48.5, top: 19.5 },
      },
      shortDescription:
        'About 18 nm west across the channel to Gouvia Marina. Optional Agios Stefanos swim stop on the Corfu side. Calm crossing under the lee of the island; leisurely afternoon arrival into the standard charter berth.',
      thingsToDo: [
        'Swim stop at Agios Stefanos cove',
        'Walk the UNESCO-listed Liston arcades',
        'Pastitsada beef stew at a courtyard taverna',
        'Buy kumquat liqueur in the Old Town',
        'Sundowner at the Old Fortress sound-and-light',
      ],
      mooringTip:
        'Gouvia Marina (lazy lines, full services, fee — pre-booked through charter agent). Corfu NAOK quay opposite the Old Fortress is the short-stay alternative for dinner ashore; no overnight without prior call.',
      description:
        'Eighteen nautical miles west across the channel to Corfu, with the island shadowing you the whole way and the wind dropping under the lee — most crews motor-sail the second half. Drop into Agios Stefanos cove on the Greek side for the lunchtime swim if you have time in hand; the deep-water anchorage at 5–8 m sand sits below pine cliffs and gives you a calm hour before the marina approach. Gouvia is the charter base — full services, fuel adjacent, taxi rank for the run into Old Town. Once berthed, the 15-minute taxi into Corfu Town drops you at the Spianada square; the Liston arcades on its west side (built under French occupation in 1807, Napoleonic neoclassical, the rue de Rivoli in miniature) hold the row of cafés worth the evening. Sofrito at a courtyard taverna; kumquat liqueur from a shop on N. Theotoki street as the souvenir.',
      gallery: [{ src: '/images/itinerary/greece/destinations/corfu.webp', alt: 'Corfu' }],
    },
    {
      id: 'corfu-paxos',
      routeFrom: 'Corfu',
      routeTo: 'Paxos',
      day: 4,
      mapPin: {
        desktop: { left: 41, top: 11 },
        mobile: { left: 30.2, top: 11.4 },
      },
      shortDescription:
        "About 30 nm south down the Corfu Channel to Lakka on Paxos's north tip — quieter and more sheltered than Gaios on the south side. Optional Lakka Blue Caves snorkel on approach.",
      thingsToDo: [
        'Snorkel the Lakka Blue Caves on approach',
        'Walk the olive groves above Lakka village',
        'Browse the Lakka Saturday morning market',
        'Try local Ladotyri cheese soaked in olive oil',
        'Sundowner at the harbour-side Romanzo taverna',
      ],
      mooringTip:
        'Anchor in Lakka bay (4–6 m sand, excellent holding — drop the hook well clear and back in among the moorings). Free, sheltered from S–SW. Restaurant moorings off the quay for dinner; pick up the buoy and pay ashore.',
      description:
        "Thirty nautical miles south down the Corfu Channel onto Paxos — but where the standard route fly south to Gaios, the better call on this itinerary is to drop into Lakka on the north tip first. Lakka is the quieter of Paxos's two main harbours, an almost-perfectly-round bay rimmed with restaurants and a swim platform stretched between the moorings. The Blue Caves on the headland 1 nm west are the snorkel waypoint on approach; the water clarity at the cliff base reads as electric blue from the dinghy. The bay itself holds 40+ boats on mooring buoys (restaurant-tied — pick up the buoy and the dinner ashore covers the fee) plus an anchorage in 4–6 m sand to the south. Romanzo on the harbour and Diogenes one street back are the local picks; ladotyri cheese in olive oil is the Paxos plate worth ordering. Lakka Saturday market is small but worth half an hour if your day aligns.",
      gallery: [{ src: '/images/itinerary/greece/destinations/paxos.webp', alt: 'Paxos' }],
    },
    {
      id: 'paxos-free-day',
      routeFrom: 'Paxos',
      routeTo: 'Paxos',
      day: 5,
      mapPin: {
        desktop: { left: 50.1, top: 28.5 },
        mobile: { left: 44.5, top: 30.8 },
      },
      shortDescription:
        'Layover day on Paxos. Optional 4 nm hop south to Antipaxos (Voutoumi and Vrika beaches for the lunchtime swim) or shift down to Gaios for the night via the east coast.',
      thingsToDo: [
        'Anchor at Voutoumi for the long midday swim',
        'Hillside vineyard tasting of Verdea white',
        'Lobster pasta at the Antipaxos taverna',
        'Explore the Erimitis cliffs on the west coast',
        'Hunt sea glass at Levrecchio cove',
      ],
      mooringTip:
        'Anchor in Voutoumi or Vrika on Antipaxos (3–7 m sand, excellent holding) for the day; back to Paxos for the night — no overnight harbour on Antipaxos. If shifting to Gaios, lazy-line stern-to on the town quay (small fee, tight).',
      description:
        "A free day on Paxos opens two distinct itineraries — the south run to Antipaxos and the cliff-walk on the west coast. Antipaxos is 4 nm south of Gaios, and the beaches at Voutoumi and Vrika are the headline anchorages of the entire week: 3–7 m sand seabed, no posidonia, sunlight that hits the bottom and bounces back as the cliché turquoise that earns the island its 'Caribbean of the Ionian' marketing tag (unkind to both sides of the comparison, but accurate to the water). The single hillside vineyard above Vrika produces Verdea — the white-and-amber blend that isn't bottled for export; this is the only place you'll drink it. The west coast of Paxos itself is the cliff alternative — the Erimitis cliffs north of Lakka run for 3 nm of unbroken limestone, the Tripitos rock arch is the photogenic landmark, and Levrecchio cove on the way north is the sea-glass beach.",
      gallery: [{ src: '/images/itinerary/greece/destinations/paxos.webp', alt: 'Paxos' }],
    },
    {
      id: 'paxos-lefkas-vasiliki',
      routeFrom: 'Paxos',
      routeTo: 'Lefkas (Vasiliki Port)',
      day: 6,
      shortDescription:
        "Long 40 nm passage south-east to Vasiliki on Lefkas's south tip. Famous afternoon W thermal builds above 18 kn from 13:00 onward — windsurfers' favourite, but tough on a beat home. Plan an 08:00 start.",
      thingsToDo: [
        'Mid-passage swim stop at Atokos or Arkoudi',
        'Watch the kitesurfers off Vasiliki bay',
        'Sofrito at a quayside village taverna',
        'Cliff walk to Porto Katsiki overlook',
        'Sundowner across the Ionian horizon',
      ],
      mooringTip:
        'Stern-to on Vasiliki town quay (small fee, basic — water but no electric). Holding good in the bay on 4–6 m sand. Strong W thermal in the afternoon — pick your slot before 14:00 or the gusts make the back-down awkward.',
      description:
        "The longest passage of the week — 40 nm south-east from Paxos across the open Ionian to Vasiliki, on Lefkas's south tip. Two things shape the day. First, the wind: the W thermal that funnels through the gap between Lefkas and Kefalonia builds from 13:00 and routinely reaches 20–25 kn by 16:00 — the reason Vasiliki has the kitesurfing reputation it does, and the reason this leg is best done with an early start so you arrive on the easy beam reach rather than the late beat. Second, the mid-passage swim: Atokos (the small uninhabited island 25 nm south-east of Paxos) or Arkoudi 6 nm further south sit on the rhumb line and give you the lunchtime stop in deep blue water. Vasiliki itself is a fishing village turned watersports hub — the bay is wide and shallow on the western side (kite zone) and tighter on the east where the town quay sits. Berth before 14:00 to avoid the wind on the back-down.",
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
    {
      id: 'vasiliki-ithaka',
      routeFrom: 'Vasiliki',
      routeTo: 'Ithaka',
      day: 7,
      mapPin: {
        desktop: { left: 64.8, top: 52.5 },
        mobile: { left: 64.8, top: 52.5 },
      },
      shortDescription:
        'Easy 14 nm hop south-east from Vasiliki to Vathy on Ithaka. Horseshoe harbour ringed by cypress, the Cave of the Nymphs above the village, and the steepest entry channel in the inner Ionian.',
      thingsToDo: [
        'Hike up to the Cave of the Nymphs',
        'Swim Dexa Bay where Odysseus came ashore',
        'Grilled sardines under the harbour plane trees',
        'Walk the cobbled lanes of Vathy old town',
        'Sundowner at the harbour-entrance battery',
      ],
      mooringTip:
        'Stern-to on Vathy town quay (small fee, water/electric). Holding good in 5–8 m mud — set the anchor well as the bay is narrow and the entry channel is steep. Tight in mid-August; consider Kioni 3 nm north as the quieter overflow.',
      description:
        'An easy 14-nautical-mile hop south-east drops you onto Vathy — the main town of Ithaka and the harbour where most Homer-as-tour-guide itineraries land. The bay is a near-perfect horseshoe, narrow at the entry channel and widening into a sheltered inner basin lined with cypress trees and pale-stucco houses. The Cave of the Nymphs above the village (where Homer has Odysseus hide his treasure on returning home, the cave open to the sea on one side and to the gods on the other) is the textbook walk — 25 minutes up the dirt path from the harbour, with the dripstone interior worth the headlamp you should bring. Dexa Bay on the way back is the swim stop — the small white-pebble beach where the Phaeacians supposedly set Odysseus ashore. Grilled sardines under the harbour plane trees at To Trehantiri or Sirenes is the local dinner. The harbour-entrance battery (small Venetian artillery emplacement) is the sundowner walk.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ithaka.webp', alt: 'Ithaka' }],
    },
    {
      id: 'ithaka-free-day',
      routeFrom: 'Ithaka',
      routeTo: 'Ithaka',
      day: 8,
      mapPin: {
        desktop: { left: 67.5, top: 59.7 },
        mobile: { left: 70.1, top: 62.7 },
      },
      shortDescription:
        'Layover day on Ithaka. Short 6 nm hop north from Vathy to Kioni for the second night, with detours into Polis Bay (snorkel the submerged ruins) and Frikes (octopus stifado on the quay).',
      thingsToDo: [
        'Sail north to picture-perfect Kioni harbour',
        'Snorkel the submerged ruins in Polis Bay',
        'Walk the goat path between Frikes and Kioni',
        'Visit the Stavros archaeological museum',
        'Octopus stifado at a Frikes fish taverna',
      ],
      mooringTip:
        'Kioni: stern-to on the small town quay (free, fills by 16:00 in season) or anchor in 4–6 m sand off the bay. Frikes is the overflow if Kioni is full. Both bombproof in N–NW; the entire north coast of Ithaka is sheltered.',
      description:
        'A free day on Ithaka is best spent stepping north up the coast in short hops. Six nautical miles north of Vathy, Kioni is the photogenic harbour — three Venetian windmills on the headland (one of them recently restored, two ruined), pastel houses tucked into a tight bowl, and a small free quay that holds 8–10 boats. Polis Bay 2 nm south of Kioni is the headline mid-day swim — the cave at the back of the bay holds Mycenaean-era ceramic finds; the seafloor at the entry has clearly visible submerged foundations of what archaeologists have alternately called a port, a temple, and a cliff-collapsed terrace (no consensus). Frikes is the third option, between Kioni and Polis — a working fishing port with the octopus stifado that the small village tavernas (Penelope, Ulysses) have made into the local plate. Walk the 45-minute goat path between Frikes and Kioni in the afternoon; the views back across the channel to Kefalonia open up halfway.',
      gallery: [{ src: '/images/itinerary/greece/destinations/ithaka.webp', alt: 'Ithaka' }],
    },
    {
      id: 'ithaka-kefalonia-fiscardo',
      routeFrom: 'Ithaka',
      routeTo: 'Kefalonia (Fiscardo Port)',
      day: 9,
      shortDescription:
        'Short 5 nm hop west across the channel to Fiskardo on Kefalonia. The only village to escape the 1953 earthquake intact — pastel neoclassical waterfront, cypress-lined quay, the most photographed harbour in the Ionian.',
      thingsToDo: [
        'Walk the cypress-lined Fiskardo quay',
        'Snorkel the Roman-villa ruins at Emplisi Beach',
        'Kreatopita meat pie at a waterfront taverna',
        'Sundowner above the harbour at Tselenti',
        'Dinghy to the cove shipwreck off the entry',
      ],
      mooringTip:
        'Fiskardo: stern-to on the town quay (free, fills by 14:00 in August — radio Port Police on Ch 12 ahead). Foulis Bay 1 nm east is the overflow anchorage — 4–6 m sand, holding good. Quay can be tight with wash from ferry traffic.',
      description:
        'Five nautical miles west across the channel brings you onto Fiskardo, the only village on Kefalonia to escape the 1953 Ionian earthquake (magnitude 7.2, which leveled most of the northern peninsula) intact. The pastel neoclassical waterfront is the result — protected by national heritage status since the 1960s, photographed enough to become its own genre of charter brochure. The quay is free but fills hard; radio ahead before 13:00 in mid-summer. Emplisi Beach 1 nm east of the harbour is the snorkel waypoint — the seabed off the headland holds Roman-villa ruins, with submerged walls and pottery scattered across the sand at 3–5 m depth. The cove shipwreck off the entry channel (a small Greek caïque that sank in the 1980s, now a popular fish-life dive site) is the dinghy excursion. Tselenti on the hillside above the harbour and Lagoudera on the quay are the dinner picks; kreatopita — Kefalonian meat-and-rice pie under a thin pastry — is the regional plate worth asking for.',
      gallery: [{ src: '/images/itinerary/greece/destinations/fiscardo.webp', alt: 'Fiscardo' }],
    },
    {
      id: 'fiscardo-kastos',
      routeFrom: 'Fiscardo',
      routeTo: 'Kastos',
      day: 10,
      mapPin: {
        desktop: { left: 63.6, top: 61 },
        mobile: { left: 61.7, top: 63.8 },
      },
      shortDescription:
        'About 18 nm north-east back across the channel to Kastos — a long thin island east of Ithaka, population under 50, single village around the small harbour. One of the quietest charter destinations in Greece.',
      thingsToDo: [
        'Climb to the abandoned hilltop windmills',
        'Snorkel the Blue Cave on the south side',
        'Tomato-stewed chickpeas at the harbour taverna',
        'Walk the donkey path to Kastos Village',
        'Sundowner at the single quayside table',
      ],
      mooringTip:
        'Stern-to on Kastos Port single quay (free, no services). Tight — 8–10 boats max. Holding fair on 5–7 m sand; drop the anchor well clear and back in. Bombproof in any wind direction.',
      description:
        "Eighteen nautical miles north-east back across the channel onto Kastos — a long, thin island east of Ithaka that holds fewer than 50 year-round residents and has the kind of stillness that makes you check the engine just to be sure it's running. Single village wrapped around the small harbour, single free quay with room for 8–10 boats, single fig-tree-shaded taverna run by the same family for three generations. The abandoned hilltop windmills above the village are the walk — 30 minutes up the donkey path, with the panorama back across to Ithaka opening on the ridge. The Blue Cave on the south side of the island (sea cave with a sand floor and natural skylight) is the snorkel stop; the local fishermen run the small motor boats across for €10 per head. Dinner is the same plate every taverna in the Ionian does in their own way — slow-cooked tomato chickpeas with rosemary, sopped up with bread. No fuel, no provisioning. Top up at Fiskardo or Lefkas before sailing.",
      gallery: [{ src: '/images/itinerary/greece/destinations/kastos.webp', alt: 'Kastos' }],
    },
    {
      id: 'kastos-free-day',
      routeFrom: 'Kastos',
      routeTo: 'Kastos',
      day: 11,
      shortDescription:
        'Free day on Kastos — no passage. Lazy dinghy laps to nearby coves (1–2 nm), short walk to the abandoned village ruins, the kind of unplugged afternoon that justified booking two weeks instead of one.',
      thingsToDo: [
        'Kayak round the south coast to Sarakiniko Bay',
        'Fish off the rocks at the harbour entrance',
        'Read in the shade of the harbour fig tree',
        'Hike to the abandoned village above the port',
        'Raki and dominoes at the kafeneio',
      ],
      mooringTip:
        'Stay on Kastos Port quay or shift to Sarakiniko Bay (1 nm south, 4–6 m sand) for a quieter night. No fuel, no provisioning — last chance to use what you brought from Lefkas before the run east.',
      description:
        'A free day on Kastos is the test of whether you booked the 14-day route for the right reasons. There is no passage, no marina to clear, no town to visit beyond the single village wrapped around the harbour. The dinghy laps to nearby coves run 1–2 nm — Sarakiniko Bay south (white-pebble beach, no road access, the kind of swim stop you have to yourself), the south-coast Blue Cave for the second snorkel, and the small cove on the east side where the donkey path comes down to the water. The abandoned village above the port is the walk for late afternoon — 20 minutes up the donkey path, stone houses unroofed but still standing, the kind of decay that documents emigration to America in the 1950s. The kafeneio on the harbour serves raki by the carafe and lets you take a dominoes set to the outside table; this is the quiet evening that justifies the second week.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kastos.webp', alt: 'Kastos' }],
    },
    {
      id: 'kastos-kalamos',
      routeFrom: 'Kastos',
      routeTo: 'Kalamos',
      day: 12,
      shortDescription:
        'Tiny 4 nm hop east to Kalamos — slightly bigger than Kastos, mountainous, pine-clad, two villages (Episkopi and Port Kalamos) and the headline ghost-village at Port Leone. Calm crossing under engine.',
      thingsToDo: [
        'Hike to the Port Leone ghost village',
        'Swim moonstone-pebble Asprogiali Beach',
        'Climb up to Episkopi village (~45 min)',
        'Savoro vinegar-fried fish at the harbour',
        'Watch the goats come down to the water at dusk',
      ],
      mooringTip:
        'Stern-to on Port Kalamos single quay (small fee, basic — water but no electric). Limited slots — 12 boats max. Holding excellent on 5–8 m sand. Sheltered from N–NW; gusty afternoons in the channel between Kastos and Kalamos.',
      description:
        'Four nautical miles east is the shortest passage of the week — almost not worth setting the main for, often done under engine in calm water. Kalamos itself is the larger neighbour of Kastos: still small, still uncomplicated, but with two villages (the harbour-side Port Kalamos and the higher Episkopi on the ridge) and the headline ghost village at Port Leone on the north coast. Port Leone is the half-day walk — an entire stone-built fishing village abandoned after the 1953 earthquake destroyed the spring that supplied its water, never reoccupied, the houses now slowly collapsing into the bay. The dinghy across to the bay (or the 90-minute coast walk) is the local pilgrimage. Asprogiali Beach south of the harbour is the swim stop — moonstone-pebble strand, the kind of grey-blue that ties the chart back to the geology of the Pindus range. Savoro (vinegar-and-rosemary-fried small fish, a Cretan technique that travelled north) is the local dinner plate at the harbour taverna.',
      gallery: [{ src: '/images/itinerary/greece/destinations/kalamos.webp', alt: 'Kalamos' }],
    },
    {
      id: 'kalamos-lefkas',
      routeFrom: 'Kalamos',
      routeTo: 'Lefkas (D-Marin)',
      day: 13,
      mapPin: {
        desktop: { left: 76.4, top: 56.6 },
        mobile: { left: 81.6, top: 54.8 },
      },
      shortDescription:
        "About 18 nm north back through the Meganisi Channel to D-Marin Lefkas. Last plunge at Agiofili Beach on Lefkas's south coast, then under the canal swing-bridge for the final approach to base.",
      thingsToDo: [
        'Last swim at Agiofili Beach white-cliff cove',
        'Optional dinghy stop at Skorpios beach',
        'Bakaliaros (salt cod) at a marina-front taverna',
        'Walk the Lefkas Town floating bridges',
        'Refuel at the D-Marin fuel dock',
      ],
      mooringTip:
        'Berth back at D-Marin Lefkas (lazy lines, full services, fee — pre-booked through charter agent). Allow time for the canal swing-bridge — opens on the hour, queue early in August. Refuel before the technical hand-back.',
      description:
        'Eighteen nautical miles north back through the Meganisi Channel and the inner waterway to D-Marin Lefkas. Agiofili Beach 1 nm south of Vasiliki on the way through is the last swim of the week — a small white-cliff cove with a coarse-pebble strand and a turquoise patch in the centre that earns the photograph. The Lefkas Canal swing-bridge gates the final approach: it opens on the hour every hour, and the waiting basin on the south side fills by 16:30 in August — arrive by 15:30 to clear the 16:00 lift comfortably. D-Marin is the full-service base for the second handover; refuel before 18:00, run laundry through the marina concierge for next-morning collection, walk into Lefkas Town (15 min) for the dinner. The floating bridges across the lagoon are the local oddity worth a 20-minute walk; bakaliaros (salt cod with skordalia garlic-potato dip, the Greek lenten standard) is the harbour-side plate to finish on.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Lefkas',
      routeTo: 'Check-out',
      day: 14,
      shortDescription:
        "Final morning at D-Marin Lefkas. Optional walk through Lefkas Town's covered market and the lagoon floating bridges. Aktion (PVK) airport is 25 minutes by taxi across the canal.",
      thingsToDo: [
        'Greek coffee with honey-drenched loukoumades',
        'Browse the leather-sandal market stalls',
        'Walk the lagoon floating bridges',
        'Last swim at Agios Ioannis beach (west side)',
        'Transfer to Aktion PVK airport (~25 min taxi)',
      ],
      mooringTip:
        'D-Marin Lefkas handover — confirm fuel slot and clean-time with base manager the evening before. Boat back by 09:00 Saturday for the technical hand-over. Direct taxi or KTEL bus to Aktion PVK airport across the canal.',
      description:
        'The technical hand-back at D-Marin is straightforward — papers signed at reception, fuel receipt logged, clean-time agreed the night before. The morning before the airport transfer is worth filling with the short walk into Lefkas Town: the covered market on the eastern side of the old centre runs leather sandals, embroidery from the inland villages, and local thyme honey. Loukoumades (honey-drenched dough fritters, dipped in cinnamon at the older bakeries) at any of the kafenia round the main square are the breakfast plate. The floating bridges across the lagoon north of the town are the local quirk — they swing rather than lift, and the walk across to the western beach at Agios Ioannis takes 25 minutes for the last swim of the week. Aktion airport (PVK) is 8 nm south, 25 minutes by taxi or the local KTEL bus from the town stop.',
      gallery: [{ src: '/images/itinerary/greece/destinations/lefkas.webp', alt: 'Lefkas' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Lefkas Paxos Ithaka 14 Days Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Lefkas Paxos Ithaka 14 Days Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(lefkasPaxosIthaka14DaysRoute);
