import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const primostenVisKorculaHvarSoltaRoute: ItineraryRoute = {
  metaTitle: '7-Day Primošten–Vis–Hvar–Šolta Yacht Route | Boat4You',
  metaDesc:
    '7-day yacht route from ACI Kremik (Primošten) via Krknjaši, Vis (Komiža & Vis Town), Blue Cave, Hvar, Stari Grad & Maslinica (Šolta) — sailor brief with NM.',
  id: 'primosten-vis-korcula-hvar-solta-route',
  startingPoint: 'Primošten',
  otherPoints: ['Vis', 'Korcula', 'Hvar', 'Šolta'],
  cardImage: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/routes/primosten-korcula-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/hvar-banner-large.webp', alt: 'Hvar' },
    { src: '/images/itinerary/croatia/banners/golden-horn-brac-banner-large.webp', alt: 'Golden horn brac' },
    { src: '/images/itinerary/croatia/banners/korcula-banner.webp', alt: 'Korcula' },
    { src: '/images/itinerary/croatia/banners/stiniva-bay-banner.webp', alt: 'Stiniva bay' },
  ],
  routeDays: [
    {
      id: 'primosten-krknjasi-bay',
      routeFrom: 'Primošten',
      routeTo: 'Krknjaši Bay',
      day: 1,
      mapPin: { desktop: { left: 28.4, top: 32.7 }, mobile: { left: 19.7, top: 34.7 } },
      shortDescription:
        '15 nm southeast from ACI Marina Kremik to Krknjaši Bay between Veli and Mali Drvenik — glass-water swim anchorage 4 nm west of Trogir, sand floor at 3–6 m, holding excellent. Three small Veli Drvenik restaurants hang free buoys with dinner ashore; ideal first-night settle before pushing south.',
      description:
        'Out of ACI Marina Kremik (Primošten), 15 miles southeast along the open coast and into the channel between Veli Drvenik and Mali Drvenik. Krknjaši is a swim anchorage: shallow with a pale sand floor at 3–6 metres, holding excellent. Three small restaurants on Veli Drvenik (no road access — boat or foot only) lay free mooring buoys for guests, but anchoring on the sand floor is the more common choice. Day 1 is operational: get the boat off the open coast, settle the crew, deliver a quiet first night before the route turns south.',
      thingsToDo: [
        'Anchor on the sand floor in 4–6 m and swim',
        'Walk the 30-minute headland loop on Veli Drvenik',
        'Order grilled fish at a Veli Drvenik beach restaurant',
        'Sample the local Plavac Mali at a quayside table',
        'Watch the open-Adriatic sunset from the deck',
      ],
      mooringTip:
        'Anchor in 4–6 m on excellent sand holding. Free restaurant buoys also available with dinner ashore. Bay is sheltered from N, NE, E, S and SE; exposed only to W and NW. If W gradient above 18 kn, push 2 nm into ACI Marina Trogir.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/krknjasi.webp', alt: 'krknjasi' }],
    },
    {
      id: 'krknjasi-bay-komiza-vis',
      routeFrom: 'Krknjaši Bay',
      routeTo: 'Komiža (Vis)',
      day: 2,
      mapPin: { desktop: { left: 32, top: 57.7 }, mobile: { left: 29.5, top: 48 } },
      shortDescription:
        '24 nm southwest to Komiža on Vis — most westerly inhabited Croatian island and the most authentic working fishing port in central Dalmatia (closed military zone until 1989). Stern-to with own anchor on the inner basin (sand and weed, mostly good holding); outer wall open to SW swell.',
      description:
        "Twenty-four miles southwest takes you to Komiža, the working fishing port on the western side of Vis. Vis is the most westerly inhabited Croatian island and the 1989 lifting of its closed-zone military status is still visible in the relative absence of resort development. Stern-to mooring with own anchor on the inner basin (sand and weed, mostly good holding) — outer wall is open to SW swell. Konoba scene runs to grilled bogueroni and the indigenous Vugava white. Vis is also where the British SOE and Tito's Partisans coordinated WWII operations — Tito's Cave on Mount Hum is open as a site.",
      thingsToDo: [
        "Hike up Mount Hum (587 m) to Tito's WWII cave",
        'Walk the working fishing fleet on the eastern harbour',
        'Order grilled bogueroni and a glass of Vugava at a konoba',
        "Visit the Fishermen's Museum in the Venetian tower",
        'Watch the open-Adriatic sunset from the harbour wall',
      ],
      mooringTip:
        'Stern-to with own anchor on the inner basin of Komiža town quay. Outer wall is exposed to SW swell. If SW gradient above 15 kn, push 6 nm north to Vis Town in St. George Bay.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/komiza.webp', alt: 'Komiza' }],
    },
    {
      id: 'komiza-blue-cave-bisevo-budihovac-vis-town',
      routeFrom: 'Komiža',
      routeTo: 'Vis Town',
      day: 3,
      mapPin: { desktop: { left: 29.2, top: 59.8 }, mobile: { left: 22.3, top: 52.3 } },
      shortDescription:
        'Blue Cave at first light, Budihovac islet swim stop, then 6 nm clockwise around the western tip of Vis to Vis Town in St. George Bay — fully sheltered north-coast harbour.',
      description:
        'The day starts at the Blue Cave on Biševo (sun-angle window 09:00–11:00, official tender ferry, no private dinghies). Then south to Budihovac, a small twin-islet pair off the southern coast of Vis with one of the cleanest swim anchorages in central Dalmatia. Drop the hook in 6–8 metres on a pale sand floor and swim once before lunch on board. The afternoon push is 6 miles clockwise around the western tip of Vis to Vis Town in St. George Bay — fully sheltered from S, SW, W and NW; the bay holds the Roman colony of Issa from 397 BC, with surviving thermae and Hellenistic walls along the harbour promenade.',
      thingsToDo: [
        'Queue for the Blue Cave tender between 09:00 and 10:30',
        'Swim at Budihovac twin islet on the southern coast',
        'Walk the Hellenistic walls along the Vis Town harbour',
        'Climb up to the Austro-Hungarian Fort George above the town',
        'Order peka-cooked octopus at a Vis Town konoba (book 3 hours ahead)',
      ],
      mooringTip:
        'Stern-to with own anchor on the long Vis Town seafront promenade — modest harbour fee, water and power on the central berths. Bay is fully sheltered from S, SW, W and NW; the most reliable overnight on Vis in any wind condition.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/vis.webp', alt: 'Vis' }],
    },
    {
      id: 'vis-hvar',
      routeFrom: 'Vis',
      routeTo: 'Hvar',
      day: 4,
      mapPin: { desktop: { left: 37.4, top: 51.3 }, mobile: { left: 40, top: 56.9 } },
      shortDescription:
        '20 nm east-northeast across the Hvar Channel to Hvar Town — the loudest harbour on the Croatian coast in summer, with ACI Marina Hvar the only safe overnight option in any blow.',
      description:
        "Twenty miles east-northeast takes you to Hvar Town, the most photographed harbour on the entire Croatian coast in summer. The skyline is unmistakable: the 16th-century Fortica fortress rising over the rooftops, the Arsenal's stone arches on the seafront, the Cathedral of St. Stephen marking the central square. ACI Marina Hvar on the western side of the bay is the only practical overnight option for a 12-metre yacht in anything more than a flat calm — book ahead, lazy lines, water and power on every berth. Climb the Fortica before the heat, walk the Arsenal and St. Stephen's, then settle in for the konoba dinner in the back lanes off the central square.",
      thingsToDo: [
        'Climb the Fortica before midday for the Pakleni view',
        "Walk the Arsenal and St. Stephen's Cathedral on the main square",
        'Stand a round at one of the back-lane konobas',
        'Take the lavender shop tour off Trg Sv. Stjepana',
        'Watch the harbour traffic from the marina seawall after dark',
      ],
      mooringTip:
        'ACI Marina Hvar is mandatory in any wind — book ahead, lazy lines, water and power. Town quay accepts boats by the hour for a stiff fee but is exposed to W gusts and crowded with tenders; not viable overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/hvar.webp', alt: 'Hvar' }],
    },
    {
      id: 'hvar-stari-grad',
      routeFrom: 'Hvar',
      routeTo: 'Stari Grad',
      day: 5,
      mapPin: { desktop: { left: 41.6, top: 49.9 }, mobile: { left: 52, top: 55.3 } },
      shortDescription:
        '12 nm clockwise around the western tip of Hvar to Stari Grad — the oldest town in Croatia (founded 384 BC as Greek Pharos) and gateway to the UNESCO Stari Grad Plain.',
      description:
        "Twelve miles clockwise around the western tip of Hvar takes you to Stari Grad, set deep in a long fjord-like bay on the island's north coast. Stari Grad is the oldest town in Croatia, founded as Greek Pharos in 384 BC; the original Greek street grid is still visible in the central old town, and the surrounding Stari Grad Plain — UNESCO-listed — is one of the oldest continuously cultivated landscapes in Europe. Town quay accepts stern-to with own anchor for a modest fee, and ACI Marina Stari Grad on the eastern side has lazy lines for the all-weather option. Tvrdalj Castle (16th-century, fortified Hektorović residence) is the headline historical stop.",
      thingsToDo: [
        'Walk inland through the UNESCO Stari Grad Plain',
        "Visit Tvrdalj Castle and Hektorović's freshwater fishpond",
        'Walk the Greek-grid streets in the central old town',
        'Bike the lavender belt road east of Stari Grad',
        'Order peka at a Stari Grad Plain konoba (book 3 hours ahead)',
      ],
      mooringTip:
        'Town quay stern-to with own anchor — modest harbour fee, water and power on the central section. ACI Marina Stari Grad on the eastern side has lazy lines. Bay is fjord-shaped and fully sheltered in any wind direction.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/stari-grad.webp', alt: 'Stari grad' }],
    },
    {
      id: 'stari-grad-maslinica-solta',
      routeFrom: 'Stari Grad',
      routeTo: 'Maslinica (Šolta)',
      day: 6,
      mapPin: { desktop: { left: 31.3, top: 37.3 }, mobile: { left: 27.1, top: 40.8 } },
      shortDescription:
        '20 nm northwest to Maslinica on Šolta’s western tip — only proper natural harbour on Šolta, fully sheltered behind a chain of seven islets at the entrance.',
      description:
        'Twenty miles northwest takes you to Maslinica, the deep S-shaped natural harbour at the western tip of Šolta. Mooring is split between Martinis Marchi Marina on the south side (lazy lines, 18th-century baroque-castle hotel attached) and the village quay on the north side (stern-to with own anchor). Šolta is the closest island to Split (15 miles out) but the quietest in the central Dalmatian group — the konobas in the village square run on Šoltansko olive oil and the indigenous Dobričić red.',
      thingsToDo: [
        'Walk into the Martinis Marchi castle courtyard',
        'Order the Dobričić red, Šolta’s indigenous grape',
        'Dinghy across to Stipanska island for the swim path',
        'Sample Šoltansko olive oil at the village shop',
        'Watch the sunset from Polebrnjak islet at the bay entrance',
      ],
      mooringTip:
        'Martinis Marchi Marina (south side) has lazy lines and full services — book ahead. Village quay (north side) takes stern-to with own anchor. Bay is fully sheltered from S, SW, W and NW.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/maslinica.webp', alt: 'Maslinica' }],
    },
    {
      id: 'maslinica-primosten',
      routeFrom: 'Maslinica',
      routeTo: 'Primošten',
      day: 7,
      mapPin: { desktop: { left: 23, top: 23.9 }, mobile: { left: 11.7, top: 29.2 } },
      shortDescription:
        '20 nm northwest back into ACI Marina Kremik for the Saturday handover by 09:00 — fuel topped, holding tanks emptied, decks rinsed, inventory checked. Course passes the south coast of Šolta and the Drvenik islands; Split airport is 45 minutes north for the transfer.',
      description:
        'Final leg: 20 miles northwest from Maslinica back into ACI Marina Kremik. Saturday handover protocol: boat back at base by 09:00, fuel topped, holding tanks emptied, decks rinsed, inventory checked. Course passes the south coast of Šolta and the Drvenik islands on the way north. With fuel pumped and inspection clear, walk up to the 16th-century St. George church on the peak of the Primošten peninsula one last time, or stand a long lunch on the harbour wall before the airport transfer (Split airport 45 minutes north).',
      thingsToDo: [
        'Top up fuel and pump out before the 09:00 inspection',
        'Walk up to St. George church on the Primošten peninsula',
        'Stand a long lunch on the Primošten harbour wall',
        'Sample Babić red at a peninsula konoba',
        'Take the shuttle from Marina Kremik to Primošten old town',
      ],
      mooringTip:
        'Return into ACI Marina Kremik per your charter contract — base manager directs the slot. Saturday handover window 08:00–09:00; arrive by 17:00 Friday if your contract specifies night-before return.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/primosten.webp', alt: 'Primosten' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/map.webp',
        alt: 'Primošten – Vis – Korcula – Hvar – Šolta Route Image',
      },
      width: 2422,
      height: 1550,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/split-dubrovnik-itinerary/mobile-map.webp',
        alt: 'Primošten – Vis – Korcula – Hvar – Šolta Route Image',
      },
      width: 1144,
      height: 1354,
    },
  },
};

export default computeItineraryNumberOfDays(primostenVisKorculaHvarSoltaRoute);
