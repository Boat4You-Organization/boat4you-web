import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const punatRijekaRoute: ItineraryRoute = {
  metaTitle: 'Punat to Rijeka Yacht Route | Kvarner | Boat4You',
  metaDesc:
    'Sail a scenic yacht journey from Punat via Malinska, Opatija to Rijeka and onward to Crikvenica & Senj. Hidden coves, coastal towns & Kvarner’s charm.',
  id: 'punat-rijeka',
  startingPoint: 'Punat',
  otherPoints: ['Rijeka'],
  cardImage: {
    src: '/images/itinerary/croatia/istria-itinerary/routes/punat-rijeka-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/croatia/banners/opatija-banner-large.webp', alt: 'Opatija' },
    { src: '/images/itinerary/croatia/banners/crikvenica-banner-large.webp', alt: 'Crikvenica' },
    { src: '/images/itinerary/croatia/banners/senj-banner.webp', alt: 'Senj' },
    { src: '/images/itinerary/croatia/banners/rab-banner.webp', alt: 'Rab' },
  ],
  routeDays: [
    {
      id: 'punat-malinska',
      routeFrom: 'Punat',
      routeTo: 'Malinska',
      day: 1,
      mapPin: {
        desktop: { left: 47.1, top: 23.9 },
        mobile: { left: 47.1, top: 23.9 },
      },
      description:
        'Starting your journey at Punat, where the smell of pine blends with saline air, Sail down the rocky coast of Krk to Malinska, a sun-drenched harbor surrounded by vineyards. Explore the blue shallows of Porto Bay then stroll to Konoba Nada for šurlice, hand-rolled pasta, soaked in truffles. Drink Žlahtina wine on the harbor as evening colors the Velebit Mountains gold moves ships like lullabies.',
      shortDescription:
        'Easy 8 nm hop along the western shore of Krk to Malinska — a Belle Époque resort village with a curving Riva, vineyards inland, and direct access to the famous Vrbnik Žlahtina wine region (one of the rarer indigenous Croatian whites).',
      thingsToDo: [
        'Walk the Malinska seafront Riva',
        'Inland vineyard tasting in Vrbnik',
        'Šurlice pasta at Konoba Nada',
        'Sunset Žlahtina on the harbour',
      ],
      mooringTip:
        'Marina Malinska is small but well-protected; pre-book in summer. Anchor in Porto Bay outside the marina for a quieter night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/malinska.webp', alt: 'Malinska' }],
    },
    {
      id: 'malinska-opatija',
      routeFrom: 'Malinska',
      routeTo: 'Opatija',
      day: 2,
      mapPin: {
        desktop: { left: 38.3, top: 12.2 },
        mobile: { left: 38.3, top: 12.2 },
      },
      description:
        'To Opatija, the crown gem of the "Austrian Riviera," glide by Cres\'s rugged cliffs. Dock in the shadow of Mount Učka and walk the Lungomare, a beach promenade where Adriatic villas flirt. At a terrace café, savor Istrian fuzi (pasta with truffles), then toast with a Maraschino sour at Hemingway Bar, where jazz notes float over the water.',
      shortDescription:
        'Twelve nautical miles north to Opatija — the 19th-century Habsburg riviera that once hosted Austrian emperors and Italian opera stars. The 12 km Lungomare promenade between Volosko and Lovran is a national heritage walk.',
      thingsToDo: [
        'Walk the 12 km Lungomare',
        'Tour Villa Angiolina park',
        'Sip cocktails at Hemingway Bar',
        'Fuzi pasta at a seafront terrace',
      ],
      mooringTip: 'ACI Marina Opatija (Ičići) is the standard berth. Town quay short-stay only.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/opatija.webp', alt: 'Opatija' }],
    },
    {
      id: 'opatija-rijeka',
      routeFrom: 'Opatija',
      routeTo: 'Rijeka',
      day: 3,
      mapPin: {
        desktop: { left: 48.5, top: 12.7 },
        mobile: { left: 48.5, top: 12.7 },
      },
      description:
        "Sail to Rijeka, the rough-port meets cultural treasure of Croatia. See Kvarner Bay from Trsat Castle, then plunge into the anarchy of the Dolac Market—snack on kvarner scampi from a fishmonger's stall. Join residents on Korzo Street for espresso and people-watching at evening, the air heavy with stories of smugglers and sailors.",
      shortDescription:
        "Short 6 nm hop east into the Bay of Rijeka. Croatia's third-largest city and 2020 European Capital of Culture — a port city with industrial edge, alternative-culture quarters, and the medieval Trsat castle ruins above the harbour.",
      thingsToDo: [
        'Climb to Trsat castle and church',
        'Walk the Korzo café strip',
        'Tour the Maritime and History Museum',
        'Kvarner scampi at the Dolac fish market',
      ],
      mooringTip:
        'Rijeka has a small charter quay near the city centre; berth limited. ACI Marina Opatija (Ičići) for an alternative protected overnight.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rijeka.webp', alt: 'Rijeka' }],
    },
    {
      id: 'rijeka-crikvenica',
      routeFrom: 'Rijeka',
      routeTo: 'Crikvenica',
      day: 4,
      mapPin: {
        desktop: { left: 57, top: 19.7 },
        mobile: { left: 57, top: 19.7 },
      },
      description:
        "Coast south to Crikvenica, a crescent of beaches surrounded by vineyards from Vinodol Valley. Anchor close to Kaštel in the fifteenth century snorkel over buried Roman remains. At Konoba Feral, feast on škampi Na buzaru (garlicky shrimp) then climb to Grič's hilltop chapel as swallows fly across lavender fields.",
      shortDescription:
        'Easy 12 nm hop south to Crikvenica — the Vinodol coast of vineyards and citrus orchards. The Roman ruins of Antiqua Ad Turres still emerge from the seabed off the Kaštel headland; the Vinodol Charter (1288) signed at Bribir is one of the oldest preserved European vernacular legal codes.',
      thingsToDo: [
        'Snorkel the Roman ruins',
        'Vinodol vineyard visit',
        'Hike to Grič chapel viewpoint',
        'Škampi buzara dinner ashore',
      ],
      mooringTip: 'Crikvenica marina is small — pre-book. Anchor outside the port in light winds.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/crikvenica.webp', alt: 'Crikvenica' }],
    },
    {
      id: 'crikvenica-senj',
      routeFrom: 'Crikvenica',
      routeTo: 'Senj',
      day: 5,
      mapPin: {
        desktop: { left: 65.8, top: 32.1 },
        mobile: { left: 65.8, top: 32.1 },
      },
      description:
        "Track the Bura wind to Senj, where the sea swallows the Velebit Mountains. Dock under a 16th-century pirate stronghold called Nehaj Fortress. Taste maneštra (hearty bean stew) while wandering cobbled lanes; then, at twilight, ascend the fortress walls, the Bura's howl echoing tales of Uskok warriors.",
      shortDescription:
        'Twenty nautical miles south down the Velebit channel to Senj — historic stronghold of the Uskok pirate-defenders against the Ottomans. Nehaj Fortress (1558) sits 80 m above the harbour; the Velebit massif rises 1700 m straight from the sea behind the town.',
      thingsToDo: [
        'Tour Nehaj fortress museum',
        'Walk the medieval old-town lanes',
        'Maneštra bean stew at a konoba',
        'Listen for the Bura wind warning',
      ],
      mooringTip:
        'Senj harbour quay is short-stay only; check the marina options in nearby Stinica or Crikvenica for an overnight. Watch for Bura — leave for shelter if forecast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/senj.webp', alt: 'Senj' }],
    },
    {
      id: 'senj-baska-krk',
      routeFrom: 'Senj',
      routeTo: 'Baška (Krk)',
      day: 6,
      mapPin: {
        desktop: { left: 40, top: 40 },
        mobile: { left: 40, top: 40 },
      },
      description:
        'Go back to Krk, anchored in the bay shaped like Baška. Trekkers across the lunar terrain of the Moon Plateau, strewn with old Glagolitic writings, then enter the pebbled lap of Vela Plaza. Dine on lamb under the bell at a hillside farmhouse, the scent of rosemary mixing with the sea air.',
      shortDescription:
        'Easy 12 nm crossing back across the channel to Baška on the southern shore of Krk. Vela Plaža is one of the longest pebble beaches on the Adriatic; the limestone Bašćanska Ploča (Glagolitic stone tablet) is one of the oldest written records of Croatian.',
      thingsToDo: [
        'Walk Vela Plaža pebble shore',
        'Hike the lunar Moon Plateau trail',
        'Visit the Bašćanska Ploča museum',
        'Lamb peka at a stone konoba',
      ],
      mooringTip:
        'Baška small marina + town quay; pre-book in peak. Anchor in front of the beach in light winds — exposed to S/SE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/baska.webp', alt: 'Baska' }],
    },
    {
      id: 'baska-lopar-rab-punat',
      routeFrom: 'Baška (Krk)',
      routeTo: 'Punat',
      day: 7,
      mapPin: {
        desktop: { left: 52.1, top: 29 },
        mobile: { left: 52.1, top: 29 },
      },
      description:
        "Sail to Rab's Lopar Peninsula, where the magnificent beaches of Paradise Beach challenge Croatia's rocky convention. Swim in shallow blue seas then investigate the historic spires of Rab Town. Return to Punat as the sun sets below Krk's limestone ridges to celebrate your journey with Vrbnička Žlahtina at Konoba Nono—the whispers of the Adriatic promising until next time.",
      shortDescription:
        "Final day passage 18 nm via Rab Town and back into Punat Bay — one of the Adriatic's largest natural harbours, almost entirely enclosed by Krk's coast. Marina Punat is the second-largest marina in Croatia by berth count and the original Croatian charter base (since 1964).",
      thingsToDo: [
        'Last swim at Rab Lopar dunes',
        'Brief stop in medieval Rab Town',
        'Žlahtina wine toast in Vrbnik',
        'Pack-and-clean for Punat handover',
      ],
      mooringTip:
        'Marina Punat is full-service with own boatyard and fuel quay. Request fuel slot 24h ahead and confirm berth before final approach.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/lopar.webp', alt: 'Lopar' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/map.webp',
        alt: 'Punat Route Image',
      },
      width: 1480,
      height: 1556,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/mobile-map.webp',
        alt: 'Punat Route Image',
      },
      width: 1064,
      height: 1514,
    },
  },
};

export default computeItineraryNumberOfDays(punatRijekaRoute);
