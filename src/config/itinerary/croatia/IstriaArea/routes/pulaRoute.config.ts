import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const pulaRoute: ItineraryRoute = {
  metaTitle: '7-Day Pula to Cres and Lošinj Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from ACI Marina Pula via Medulin, Unije, Vele Srakane, Cres (Martinšćica & Cres Town) & Rabac — sailor brief with NM.',
  id: 'pula',
  startingPoint: 'Pula',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/croatia/istria-itinerary/routes/pula-card-image.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/croatia/banners/krk-banner-large.webp', alt: 'Krk' },
    { src: '/images/itinerary/croatia/banners/cres-banner-large.webp', alt: 'Cres' },
    { src: '/images/itinerary/croatia/banners/lovran-banner.webp', alt: 'Lovran' },
    { src: '/images/itinerary/croatia/banners/cres-banner.webp', alt: 'Cres' },
  ],
  routeDays: [
    {
      id: 'pula-medulin',
      routeFrom: 'Pula',
      routeTo: 'Medulin',
      day: 1,
      mapPin: { desktop: { left: 24.9, top: 39.6 }, mobile: { left: 24.9, top: 39.6 } },
      shortDescription:
        '8 nm south from ACI Marina Pula to Medulin Bay — wide shallow bay on the southern tip of the Istrian peninsula, with Marina Medulin (lazy lines) and easy walking access to the village.',
      description:
        'Out of ACI Marina Pula (or Marina Veruda just south of the city), the opening leg is 8 miles south rounding Cape Kamenjak (the southernmost point of the Istrian peninsula, a Nature Park) into Medulin Bay. Marina Medulin on the western side of the bay offers stern-to lazy lines, full services, water and power. The bay is wide and shallow with a sand-and-weed bottom holding well at 4–8 metres for boats anchoring outside the marina. Off the boat: walk the Cape Kamenjak coastal path (signed dinosaur footprints in the limestone), swim from one of the small bays inside the cape, or visit the small Medulin village for a brodet dinner.',
      thingsToDo: [
        'Walk the Cape Kamenjak coastal path with the dinosaur footprints',
        'Anchor outside the marina for a quieter swim',
        'Order brodet (fish stew) at a Medulin waterfront konoba',
        'Take the dinghy across to Levan islet for a beach swim',
        'Watch the sunset over Brijuni National Park to the west',
      ],
      mooringTip:
        'Marina Medulin (lazy lines, full services) is the all-weather option — book ahead in season. Anchoring outside the marina is fine on sand-and-weed at 4–8 m. Bay is sheltered from N, E and W; exposed to S gradient.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/medulin.webp', alt: 'Medulin' }],
    },
    {
      id: 'medulin-unije',
      routeFrom: 'Medulin',
      routeTo: 'Unije',
      day: 2,
      mapPin: { desktop: { left: 35.9, top: 48.2 }, mobile: { left: 35.9, top: 48.2 } },
      shortDescription:
        '20 nm southeast across the open Kvarner Gulf to Unije — small car-free island in the Lošinj archipelago, with the rare sandy Maracol beach on the west coast.',
      description:
        'Twenty miles southeast across the open Kvarner Gulf to Unije, a small car-free island in the Lošinj archipelago. The single village wraps the eastern bay (Maračol on the east, with stern-to mooring on the village quay for a modest fee, water on the central berths but no shore power). Maracol Bay on the western side of the island has a rare crescent of sand — anchorage-only, lunchtime swim stop, exposed to W gradient. Off the boat: walk the path inland to the small chapel on the island spine, swim from the rocks south of the village, and order grilled lamb at a quayside konoba.',
      thingsToDo: [
        'Walk to Maracol Bay for the rare sandy beach swim',
        'Order grilled lamb at a Unije village konoba',
        'Walk the path inland to the small chapel on the island spine',
        'Swim from the rocks south of the village',
        'Sample local olive oil at a small farm shop',
      ],
      mooringTip:
        'Stern-to on Unije village quay (Maračol) with own anchor — modest fee, water on the central berths (no shore power). Bay is sheltered from W, NW and N; exposed to SE. If SE forecast above 15 kn, push 6 nm east into Mali Lošinj for the protected harbour.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/unije.webp', alt: 'Unije' }],
    },
    {
      id: 'unije-vele-srakane',
      routeFrom: 'Unije',
      routeTo: 'Vele Srakane',
      day: 3,
      mapPin: { desktop: { left: 38.8, top: 52.2 }, mobile: { left: 38.8, top: 52.2 } },
      shortDescription:
        '6 nm southeast to Vele Srakane — tiny island with a population in single digits and almost no infrastructure. Anchorage-only, lunchtime stop, then push to Mali Lošinj or back to Unije for the night.',
      description:
        'Six miles southeast takes you to Vele Srakane, one of the smallest inhabited islands in Croatia — population in the single digits, no shops, no road, no marina. The island is anchorage-only and best treated as a lunchtime swim stop rather than overnight (no shelter from W/NW). Anchor in 5–8 metres on the eastern shore where the holding is sand-and-weed, walk the small village path, swim in exceptionally clear water (visibility 25 m on a calm day), then push 5 miles south to Mali Lošinj for the overnight or back 6 nm to Unije.',
      thingsToDo: [
        'Anchor on the eastern shore for lunchtime swimming',
        'Walk the small village path through olive groves',
        'Snorkel in exceptional 25-metre visibility water',
        'Picnic on board with Pag cheese and local olive oil',
        'Push to Mali Lošinj or Unije before sunset for the overnight',
      ],
      mooringTip:
        'Vele Srakane is anchorage-only and lunchtime. No shelter from W or NW. Push 5 nm south to Mali Lošinj (Marina Mali Lošinj, lazy lines, full services) or 6 nm back to Unije for the protected overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vele-srakane.webp', alt: 'Vele Srakane' }],
    },
    {
      id: 'vele-srakane-martinšćica-cres',
      routeFrom: 'Vele Srakane',
      routeTo: 'Martinšćica (Cres)',
      day: 4,
      mapPin: { desktop: { left: 41.5, top: 42.8 }, mobile: { left: 41.5, top: 42.8 } },
      shortDescription:
        '12 nm northeast to Martinšćica on the western coast of Cres — small fishing village with a stone village quay, gateway to the Tramuntana Forest with its griffon vulture colony.',
      description:
        "Twelve miles northeast takes you to Martinšćica on the western coast of Cres island. The village is small and quiet, with stern-to mooring on the village quay for a modest fee, water on the central berths. The bay is well-sheltered from N, NE and E; exposed to SW gradient. Cres is the largest Croatian island by area and the home of the Tramuntana Forest in the north — one of the last European griffon vulture colonies, with the visitor centre at Beli (a 30-minute drive from Martinšćica). Off the boat: hike the Tramuntana trails, swim from the rocks south of the village, and order Cres lamb (the island's signature dish, lambs grazed on wild herbs) at Konoba Bukaleta.",
      thingsToDo: [
        'Hike the Tramuntana Forest with its griffon vulture colony',
        'Order Cres lamb at Konoba Bukaleta (book 24 hours ahead)',
        'Visit the Beli vulture rescue centre',
        'Swim from the rocks south of the village',
        'Sample Cres olive oil at a village shop (the island has the highest density of old olive trees in Croatia)',
      ],
      mooringTip:
        'Stern-to on Martinšćica village quay with own anchor — modest fee, water on the central berths. Bay is well-sheltered from N, NE and E; exposed to SW gradient.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/cres.webp', alt: 'Cres' }],
    },
    {
      id: 'martinšćica-cres-town',
      routeFrom: 'Martinšćica',
      routeTo: 'Cres Town',
      day: 5,
      mapPin: { desktop: { left: 43, top: 38.3 }, mobile: { left: 43, top: 38.3 } },
      shortDescription:
        '15 nm clockwise around the northern tip of Cres into Cres Town — Venetian-era harbour on the eastern coast, with ACI Marina Cres (lazy lines) inside the protected inner basin.',
      description:
        'Fifteen miles clockwise around the northern tip of Cres takes you to Cres Town, the largest settlement on the island and a former Venetian administrative seat. The Old Town wraps the inner basin of a deep, protected harbour; ACI Marina Cres sits on the eastern side with lazy lines, water and power on every berth, fuel pontoon, full services. The Venetian heritage is visible everywhere: the 15th-century Loggia in the central square, the medieval town walls and gates, the 16th-century clock tower walking-accessible for the panoramic view across the harbour.',
      thingsToDo: [
        'Climb the 16th-century clock tower for the harbour view',
        'Walk the medieval town walls and gates',
        'Visit the 15th-century Loggia in the central square',
        'Swim at Slatina Beach south of the marina',
        'Order Creska janjetina (Cres lamb) at a courtyard konoba',
      ],
      mooringTip:
        'ACI Marina Cres (eastern side of the harbour) is the all-weather option — lazy lines, full services. Town quay accepts daytime visitors only. Bay is fully sheltered in any wind direction.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/cres.webp', alt: 'Cres' }],
    },
    {
      id: 'cres-rabac',
      routeFrom: 'Cres',
      routeTo: 'Rabac',
      day: 6,
      mapPin: { desktop: { left: 32.5, top: 22.9 }, mobile: { left: 32.5, top: 22.9 } },
      shortDescription:
        '15 nm west across the Kvarner Gulf to Rabac — small resort town on the eastern coast of Istria, with Marina Rabac (lazy lines) and pebbled-beach swimming below medieval Labin on the hill above.',
      description:
        'Fifteen miles west across the Kvarner Gulf takes you to Rabac, a small resort town on the eastern coast of Istria. Marina Rabac sits on the southern side of the bay with lazy lines, water and power on every berth, full services. Rabac is the seaside resort beneath the medieval hill town of Labin (a 10-minute taxi or shuttle bus inland) — the medieval Labin old town with its 14th-century walls, narrow lanes and small museum is the headline historical detour. Off the boat at Rabac: pebbled-beach swimming along the Lungomare promenade, scampi buzara at a cliffside konoba, and the easy uphill walk through the pine forest to Labin.',
      thingsToDo: [
        'Take the shuttle or taxi up to medieval Labin old town',
        'Walk the Rabac Lungomare promenade',
        'Swim at one of the pebbled beaches along the bay',
        'Order scampi buzara at a Rabac konoba',
        'Sample Istrian truffle products at a Labin small shop',
      ],
      mooringTip:
        'Marina Rabac (lazy lines, full services) is the all-weather option. Bay is well-sheltered from N, NE and W; exposed to S gradient.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rabac.webp', alt: 'Rabac' }],
    },
    {
      id: 'rabac-trget-pula',
      routeFrom: 'Rabac',
      routeTo: 'Pula',
      day: 7,
      mapPin: { desktop: { left: 18.8, top: 38.7 }, mobile: { left: 18.8, top: 38.7 } },
      shortDescription:
        '20 nm southwest back to ACI Marina Pula for the Saturday handover by 09:00, with optional Trget swim stop in the long Raša Bay en route.',
      description:
        'Twenty miles southwest back to ACI Marina Pula. Saturday handover protocol: boat back at base by 09:00, fuel topped, holding tanks emptied, decks rinsed, inventory checked. Course passes the long fjord-like Raša Bay (the largest natural harbour on the eastern Istrian coast); a quick stop at Trget on the western side of the bay for a final swim is the standard close to the week. With fuel pumped and inspection clear, ACI Marina Pula is a 5-minute walk from the 1st-century AD Roman Arena (one of the six largest surviving Roman amphitheatres in the world). Pula airport 15 minutes by car.',
      thingsToDo: [
        'Stop for a final swim at Trget in Raša Bay',
        'Top up fuel and pump out before the 09:00 inspection',
        'Walk to the Roman Arena (1st century AD)',
        'Visit the Temple of Augustus on the central forum',
        'Take a final swim at Verudela Beach south of the marina',
      ],
      mooringTip:
        'Return into ACI Marina Pula per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/marina-pula.webp', alt: 'Pula' }],
    },
  ],
  map: {
    desktop: {
      image: { src: '/images/itinerary/croatia/istria-itinerary/map.webp', alt: 'Pula Route Image' },
      width: 1480,
      height: 1556,
    },
    mobile: {
      image: { src: '/images/itinerary/croatia/istria-itinerary/mobile-map.webp', alt: 'Pula Route Image' },
      width: 1064,
      height: 1514,
    },
  },
};

export default computeItineraryNumberOfDays(pulaRoute);
