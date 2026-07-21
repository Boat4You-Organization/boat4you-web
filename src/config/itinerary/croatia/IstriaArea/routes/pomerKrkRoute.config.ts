import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const pomerKrk: ItineraryRoute = {
  metaTitle: 'Pomer → Cape Kamenjak Yacht Route | Istria | Boat4You',
  metaDesc:
    'Sail from Pomer to scenic Portić Bay and Cape Kamenjak. Explore hidden coves, dramatic coastlines, prehistoric trails & prime diving in Istria’s wild south.',
  id: 'pomer-portic-bay-cape-kamenjak',
  startingPoint: 'Pomer',
  otherPoints: ['Krk'],
  cardImage: {
    src: '/images/itinerary/croatia/istria-itinerary/routes/pomer-krk-card-image.webp',
    alt: 'Card image',
  },
  gallery: [
    {
      src: '/images/itinerary/croatia/banners/kornati-murter-banner-large.webp',
      alt: 'Kornati, Murter',
    },
    {
      src: '/images/itinerary/croatia/banners/rovinj-banner-large.webp',
      alt: 'Rovinj',
    },
    {
      src: '/images/itinerary/croatia/banners/krk-banner.webp',
      alt: 'Krk',
    },
    {
      src: '/images/itinerary/croatia/banners/losinj-banner.webp',
      alt: 'Losinj',
    },
  ],
  routeDays: [
    {
      id: 'pomer-portic-bay-cape-kamenjak',
      routeFrom: 'Pomer',
      routeTo: 'Portic Bay (Cape Kamenjak)',
      day: 1,
      mapPin: {
        desktop: { left: 41.3, top: 53.7 },
        mobile: { left: 43.4, top: 48.8 },
      },
      description:
        'Starting your journey in Pomer, the sapphire waves of the Adriatic call. Sail south to Portic Bay, a secret treasure within the Cape Kamenjak natural reserve. Anchor close to cliffs molded by time, then explore coves where the sea sparkles resemble liquid green. Then feast on Istrian burek (savory pastry) at a rustic konoba while the sun stains the sky coral and gold. Hike paths surrounded with wild orchids to find dinosaur tracks engraved into limestone.',
      shortDescription:
        "Short hop south from Pomer to Portić Bay inside Cape Kamenjak nature reserve — the southern tip of Istria. Limestone-cliff coves, a 75-million-year-old dinosaur track on shore, and Croatia's southernmost mainland anchorage with no road access on the headland.",
      thingsToDo: [
        'Hike to the dinosaur footprints',
        'Snorkel hidden cliff coves',
        'Watch sunset from the lighthouse',
        'Burek dinner at the konoba',
      ],
      mooringTip:
        'Free anchoring on sand and seagrass at 5-8 metres. Sheltered from S/SE; exposed to the Bora — leave for Pomer if a Bora is forecast.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/kamenjak.webp', alt: 'Kamenjak' }],
    },
    {
      id: 'portic-bay-mali-losinj',
      routeFrom: 'Portic Bay',
      routeTo: 'Mali Lošinj',
      day: 2,
      mapPin: {
        desktop: { left: 46.6, top: 56.5 },
        mobile: { left: 49.7, top: 56.8 },
      },
      description:
        'Set out from Mali Lošinj, the "Island of Vitality." Glide along the rocky shore of Cres, where bow-racing bottlenose dolphins abound. At Čikat Bay, a crescent of rocks lapped by blue seas. Wander Mali Lošinj\'s pastel harbour, where art galleries spill into cobbled squares, then cycle scented trails into pine forests. At a riverside table, dine on scampi buzara, garlicky shrimp stew, the air fragrant with Adriatic herbs.',
      shortDescription:
        'Big crossing day — 25 nm across the Kvarner Gulf to Mali Lošinj, one of the busiest charter harbours on the upper Adriatic. Watch for the resident bottlenose dolphin pod tracked by the Blue World research centre.',
      thingsToDo: [
        'Spot the resident dolphin pod',
        'Walk the Mali Lošinj Riva',
        'Cycle the Čikat Bay aromatic trails',
        'Scampi buzara at a harbour table',
      ],
      mooringTip: 'ACI Marina Mali Lošinj — pre-book in summer. Town quay slots on the Riva are first-come.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/mali-losinj.webp', alt: 'Mali Lošinj' }],
    },
    {
      id: 'mali-losinj-ilovik-sveti-petar',
      routeFrom: 'Mali Lošinj',
      routeTo: 'Ilovik & Sveti Petar',
      day: 3,
      mapPin: {
        desktop: { left: 49, top: 61.2 },
        mobile: { left: 52.8, top: 61.2 },
      },
      description:
        'From Ilovik, the "Island of Flowers," where oleander and hibiscus frame whitewashed houses, Kayak to Sveti Petar, a little island capped by a single chapel, from the crystalline shallows of Swim in Paradise Bay. Under ancient olive trees, a picnic on Pag cheese and figs under murmurs of Venetian traders carried by the sea. By evening, go back to Ilovik for lamb under the bell, slow-cooked with rosemary and island wine.',
      shortDescription:
        'Short 6 nm hop to Ilovik — population under 100, no cars, oleander-lined waterfront. The narrow channel between Ilovik and the uninhabited Sveti Petar islet is one of the best protected anchorages in the entire Kvarner.',
      thingsToDo: [
        'Kayak the Ilovik–Sveti Petar channel',
        'Picnic under Sveti Petar olives',
        'Snorkel the shallow Paradise Bay',
        'Lamb peka dinner at a family konoba',
      ],
      mooringTip:
        'Pick up a free restaurant buoy in the channel — pay for dinner ashore and the buoy is included. Channel is fully sheltered from all directions.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/ilovik.webp', alt: 'Ilovik' }],
    },
    {
      id: 'ilovik-rab',
      routeFrom: 'Ilovik',
      routeTo: 'Rab',
      day: 4,
      mapPin: {
        desktop: { left: 55.6, top: 41.9 },
        mobile: { left: 60.2, top: 43.1 },
      },
      description:
        "Follow the horizon to Rab, a mediaeval wonder where four bell towers cut the heavens. Go through Romanesque palaces and stone lanes in Rab Town. One of Croatia's rare sandy beaches, Sahara Beach cools down; then, ascend Kamenjak Hill for views of the Kvarner Gulf sunset. Feast on Rapska torta (Rab cake), its almond filling a delectable legacy of nun-baked custom.",
      shortDescription:
        "Long 25 nm leg across to Rab — the medieval town with four iconic bell towers rising over a thin peninsula. Rab is one of Croatia's rare sandy-beach islands; the Lopar/Sahara dunes on the north shore are a 2 nm dinghy from the marina.",
      thingsToDo: [
        'Climb the Sveti Ivan bell tower',
        'Beach day at Lopar Sahara dunes',
        'Walk the Rab medieval ramparts',
        'Rapska torta at the cathedral square',
      ],
      mooringTip:
        'ACI Marina Rab — book ahead in July-August. Anchor in Sveti Eufemija bay (north of town) for a quieter night.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/rab.webp', alt: 'Rab' }],
    },
    {
      id: 'rab-krk',
      routeFrom: 'Rab',
      routeTo: 'Krk',
      day: 5,
      mapPin: {
        desktop: { left: 51.5, top: 29 },
        mobile: { left: 51.5, top: 29 },
      },
      description:
        'Sail to Krk, the "Golden Island," where ruins and vines record Roman troops. Anchor at the fjord-like port of Baska and climb the Moon Plateau, a lunar scene strewn with ancient Glagolitic writings. swim in the pebbled coves of Vela Plaza, then enjoy hand-rolled pasta called šurlice in a konoba fashioned from a stone basement. Let the aroma of sea salt and sage calm you into Krk\'s ageless rhythm.',
      shortDescription:
        'Twenty nautical mile leg up to the southern shore of Krk and the deep Baška Bay. Vela Plaža is one of the longest pebble beaches on the Adriatic; the limestone Bašćanska Ploča (Glagolitic stone tablet) is one of the oldest written records of the Croatian language.',
      thingsToDo: [
        'Walk the Vela Plaža pebble shore',
        'Hike the lunar Moon Plateau trail',
        'Wine tasting in Vrbnik old town',
        'Šurlice pasta at a stone konoba',
      ],
      mooringTip:
        'Baška has a small marina + town quay; pre-book in peak. Anchor in front of the beach in light winds — exposed to S/SE.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/krk.webp', alt: 'Krk' }],
    },
    {
      id: 'krk-cres',
      routeFrom: 'Krk',
      routeTo: 'Cres',
      day: 6,
      mapPin: {
        desktop: { left: 42.8, top: 34.6 },
        mobile: { left: 42.8, top: 34.6 },
      },
      description:
        "Glide west to Cres, where wild horses of the Tramuntana forest abound. From Valun Bay, snorkel above submerged Roman mosaics, then sail to Grbinj's fjord-like strait. Trekking to Lubenice's cliffside town for panoramic views of the Kvarner, kayak through mangroves to a secret waterfall. Dine on Cres lamb, its taste ingrained in island herbs, under a star-filled sky canvas.",
      shortDescription:
        'West across the Krk-Cres channel to the western shore of Cres. Valun Bay sits in a horseshoe under 350-metre cliffs; the village above (Lubenice) is one of the oldest continuously inhabited settlements on the Adriatic — population still under 30.',
      thingsToDo: [
        'Hike up to the Lubenice cliff village',
        'See the 10th-century Valun Tablet',
        'Snorkel the natural-amphitheatre bay',
        'Cres lamb dinner ashore',
      ],
      mooringTip:
        'Restaurant moorings off Valun village — free with dinner ashore. Free anchoring further out on sand at 7-10 metres.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/cres.webp', alt: 'Cres' }],
    },
    {
      id: 'cres-pomer',
      routeFrom: 'Cres',
      routeTo: 'Pomer',
      day: 7,
      mapPin: {
        desktop: { left: 24.5, top: 39.2 },
        mobile: { left: 24.5, top: 39.2 },
      },
      description:
        "Sail homeward, following the rough northern shore of Cres. Stop to Plavnik Island, where falcons soar over cliffs, then plunge into Pomer's aquamarine embrace one more time. With a sunset glass of Malvasia wine, the whispers of the Adriatic suggest that your trip is beginning rather than ending.",
      shortDescription:
        "Long return passage 25 nm back across the Kvarner Gulf to Pomer. Stop at Plavnik 'Moon Bay' for a swim if weather allows, or push straight through with the morning thermal northwesterly behind you.",
      thingsToDo: [
        'Mid-passage swim at Plavnik Moon Bay',
        'Spot peregrine falcons on cliffs',
        'Last-night Malvasia at the marina',
        'Pack-and-clean for handover',
      ],
      mooringTip:
        'Marina Pomer — request berth + fuel slot 24h ahead. Final-night anchoring outside the marina is free if the wind is light.',
      gallery: [{ src: '/images/itinerary/croatia/destinations/marina-pomer.webp', alt: 'Marina Pomer' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/map.webp',
        alt: 'Pomer Route Image',
      },
      width: 1480,
      height: 1556,
    },
    mobile: {
      image: {
        src: '/images/itinerary/croatia/istria-itinerary/mobile-map.webp',
        alt: 'Pomer Route Image',
      },
      width: 1064,
      height: 1514,
    },
  },
};

export default computeItineraryNumberOfDays(pomerKrk);
