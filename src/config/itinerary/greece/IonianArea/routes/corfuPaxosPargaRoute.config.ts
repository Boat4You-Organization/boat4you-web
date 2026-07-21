import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const corfuPaxosPargaRoute: ItineraryRoute = {
  metaTitle: '7-Day Corfu–Paxos–Parga Yacht Charter Route | Ionian Sailing',
  metaDesc:
    'Sail a yacht charter from Corfu to Paxos and Parga. Explore turquoise coves, olive-groved Paxos, Venetian castles & coastal charm of the Ionian Sea',
  id: 'corfu-paxos-parga',
  startingPoint: 'Corfu',
  otherPoints: ['Paxos', 'Antipaxos', 'Parga'],
  cardImage: {
    src: '/images/itinerary/greece/ionian-itinerary/routes/corfu-paxos-antipaxos-parga.webp',
    alt: 'Card image',
  },
  gallery: [
    { src: '/images/itinerary/greece/banners/antipaxos-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/corfu-banner-large.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/parga-banner.webp', alt: '' },
    { src: '/images/itinerary/greece/banners/corfu-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'corfu-paxos',
      routeFrom: 'Corfu (Gouvia Marina)',
      routeTo: 'Paxos',
      day: 1,
      mapPin: {
        desktop: { left: 40.5, top: 10.9 },
        mobile: { left: 27.8, top: 11.5 },
      },
      description:
        "From the Gouvia Marina in Corfu, cut over the turquoise waves of the Ionian toward Paxos, an emerald island filled with olive farms. Dock at Gaios, a harbor so lovely it feels taken from a storybook—pastel structures, Venetian architecture, fishing boats painted sky-blue. Swim the Blue Caves close to Lakka; their waters sparkle like liquid sapphire; then, at a taverna under a canopy of vines, savor ladotyri cheese drizzled with locally olive oil. Anchor early; Gaios's harbor is small yet enchanted.",
      shortDescription:
        'Long 30 nm leg south out of Gouvia Marina to Gaios on Paxos — the main harbour of the smallest Ionian inhabited island. Gaios sits behind a natural breakwater of two small wooded islets (Panagia and Agios Nikolaos), forming a near-perfect protected harbour.',
      thingsToDo: [
        'Walk the Gaios pastel waterfront',
        'Visit Panagia islet church',
        'Snorkel the Blue Caves near Lakka',
        'Ladotyri cheese tasting at a taverna',
      ],
      mooringTip:
        'Gaios town quay is small — anchor early; long stern-to wait in peak. Lakka and Loggos as alternative northern Paxos overnights.',
      gallery: [{ src: '/images/itinerary/greece/destinations/paxos.webp', alt: 'Paxos' }],
    },
    {
      id: 'paxos-antipaxos',
      routeFrom: 'Paxos',
      routeTo: 'Antipaxos',
      day: 2,
      mapPin: {
        desktop: { left: 49.3, top: 27.5 },
        mobile: { left: 41.6, top: 27.8 },
      },
      description:
        'A little trip to Antipaxos, where the beaches compete with the Caribbean. Drop anchor at Voutoumi Bay; its cerulean shallows and sugar-white sand call for a lazy floating day. Spot darting fish, climb to a hillside vineyard for a drink of fresh Verdea wine, then snorkel above seagrass meadows. Local secret: The sole taverna on the island offers lobster pasta deserving of the sail by itself.',
      shortDescription:
        'Short 3 nm hop south to Antipaxos — population around 20 year-round, two beaches that rival the Caribbean for sand-and-water clarity (Voutoumi and Vrika), and three small tavernas. Day-stop only — no overnight harbour, return to Paxos for the night.',
      thingsToDo: [
        'Anchor and float in Voutoumi Bay',
        'Walk to Vrika sandy beach',
        'Hillside Verdea wine tasting',
        'Lobster pasta at the seasonal taverna',
      ],
      mooringTip: 'No overnight harbour. Anchor on sand at 4-6 m for the day; return to Paxos for the night.',
      gallery: [{ src: '/images/itinerary/greece/destinations/antipaxos.webp', alt: 'Antipaxos' }],
    },
    {
      id: 'antipaxos-parga',
      routeFrom: 'Antipaxos',
      routeTo: 'Parga',
      day: 3,
      mapPin: {
        desktop: { left: 53.4, top: 30.8 },
        mobile: { left: 46.8, top: 33.3 },
      },
      description:
        'Sail east to Parga, a treasure on the mainland where candy-colored homes ascend toward a Venetian castle. Explore Valtos Beach, its golden arc lapped by soft waves, then ascend to the castle ruins for views of the Ionian Sea at sunset. Dinner calls for Saganaki shrimp on a waterfront table, the harbor lights flickering like fireflies.',
      shortDescription:
        'Easy 12 nm coastal leg east to Parga — a mainland resort town set on a horseshoe bay below a 16th-century Venetian castle. The pastel buildings climbing the hillside look almost Italian; Valtos Beach on the far side of the headland is the Adriatic-scale sandy shore.',
      thingsToDo: [
        'Climb the Venetian castle ruins',
        'Walk over the headland to Valtos Beach',
        'Boat to the Acheron river necromanteion',
        'Saganaki shrimp at a harbour table',
      ],
      mooringTip:
        'Parga has no marina; town quay short-stay only. Anchor in Valtos Bay or Lichnos Bay on sand at 5-7 m for an overnight.',
      gallery: [{ src: '/images/itinerary/greece/destinations/parga.webp', alt: 'Parga' }],
    },
    {
      id: 'parga-sivota',
      routeFrom: 'Parga',
      routeTo: 'Sivota',
      day: 4,
      mapPin: {
        desktop: { left: 58.1, top: 24.5 },
        mobile: { left: 52.4, top: 24.1 },
      },
      description:
        'Slide south from Sivota, a horseshoe bay surrounded by cypress trees. Swim the Blue Lagoon; its waters are so pure you will see your shadow on the seabed; then, land in the village for bourdeto, a local specialty—a spicy fish stew. Sip a mastiha cocktail as yachts shine under the amber heavens in evening tones.',
      shortDescription:
        'Short coastal hop north to Sivota — the headline cluster of islets and bays on the mainland coast opposite Paxos. The natural Blue Lagoon between Mavro Oros and Pissina islets is the most photographed bay on the Greek mainland.',
      thingsToDo: [
        'Swim the Blue Lagoon',
        'Paddleboard between Sivota islets',
        'Bourdeto scorpionfish stew',
        'Mastiha cocktail on a yacht-bay terrace',
      ],
      mooringTip:
        'Sivota harbour quay or stern-to inside the bay. Anchor in the Blue Lagoon for swim stop; pick a different cove for overnight.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sivota.webp', alt: 'Sivota' }],
    },
    {
      id: 'sivota-plataria',
      routeFrom: 'Sivota',
      routeTo: 'Plataria',
      day: 5,
      mapPin: {
        desktop: { left: 52.1, top: 18 },
        mobile: { left: 46.7, top: 16.7 },
      },
      description:
        "Head north to Plataria, a tiny fishing community on the edge of the continent. Anchor in the still bay; lapping waves and goat bells are the only sounds there. Lunch at a family taverna on fasolada, or bean soup, then paddleboard to Sykia Cave, a sea tunnel where sunshine gold-painted walls. For panoramic views of Corfu's silhouette, hike the neighboring olive grove walk.",
      shortDescription:
        'Short 8 nm hop north to Plataria — a quiet fishing community on the mainland 6 km from the Igoumenitsa ferry port. Few tourists; the bay opens west toward Corfu and is sheltered from the prevailing northwesterly.',
      thingsToDo: [
        'Walk the quiet harbourfront',
        'Paddleboard to Sykia sea cave',
        'Olive-grove hill walk for Corfu views',
        'Fasolada bean soup at a family taverna',
      ],
      mooringTip: 'Plataria has a small marina + town quay; pre-book for an overnight in summer.',
      gallery: [{ src: '/images/itinerary/greece/destinations/sivota.webp', alt: 'Plataria' }],
    },
    {
      id: 'plataria-corfu',
      routeFrom: 'Plataria',
      routeTo: 'Corfu',
      day: 6,
      mapPin: {
        desktop: { left: 52.1, top: 13.7 },
        mobile: { left: 43.9, top: 10.5 },
      },
      description:
        'Retrace your steps to Paleokastritsa, where legend holds Odysseus shipwrecked. Return to Corfu. Swim in the cobalt waves of Agios Spiridon Beach, then sail into Old Port of Corfu Town. Sample kumquat liqueur and hunt Venetian masks as you stroll the arcades of the Liston. Sofrito, garlicky veal, in a courtyard taverna accompanied by accordion music marks farewell meal.',
      shortDescription:
        'Long 18 nm coastal sail back to Corfu Town. Optional Paleokastritsa swim stop on the western shore (where Homer placed the shipwreck of Odysseus on Phaeacian shores). Final-night dinner in the UNESCO Corfu Old Town.',
      thingsToDo: [
        'Stop at Paleokastritsa azure coves',
        'Walk the UNESCO Corfu Old Town',
        'Tour the Old Fortress',
        'Sofrito veal stew at a Liston taverna',
      ],
      mooringTip: 'Gouvia Marina is the standard charter berth; Corfu Town quay is short-stay only.',
      gallery: [{ src: '/images/itinerary/greece/destinations/corfu.webp', alt: 'Corfu' }],
    },
    {
      id: 'checkout',
      routeFrom: 'Corfu',
      routeTo: 'Check-out',
      day: 7,
      description:
        "One farewell espresso at Café Liston, its Habsburg-era grace an homage to Corfu's varied soul. Walk the Spianada Square, where players of cricket play under the Old Fortress, then pick a jar of thyme honey from the market. Because Corfu never really lets you leave, set off with salt-streaked hair, a camera roll of Ionian blues, and a promise to come back.",
      shortDescription:
        'Final morning at Gouvia Marina. Optional walk in Corfu Town: cricket on the Spianada square, last espresso at Café Liston, thyme honey shopping at the market.',
      thingsToDo: [
        'Espresso on the Liston arcades',
        'Walk the Spianada (largest square in Europe)',
        'Browse Corfu market for thyme honey',
        'Pack-and-clean for handover',
      ],
      mooringTip: 'Gouvia Marina handover — confirm fuel slot and clean-time the evening before.',
      gallery: [{ src: '/images/itinerary/greece/destinations/corfu-town.webp', alt: 'Corfu' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/map.webp',
        alt: 'Corfu Kassiopi Sagiada Route Image',
      },
      width: 1060,
      height: 1125,
    },
    mobile: {
      image: {
        src: '/images/itinerary/greece/ionian-itinerary/mobile-map.webp',
        alt: 'Corfu Kassiopi Sagiada Route Image',
      },
      width: 716,
      height: 1145,
    },
  },
};

export default computeItineraryNumberOfDays(corfuPaxosPargaRoute);
