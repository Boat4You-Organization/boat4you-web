import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const genovaRoute: ItineraryRoute = {
  metaTitle: 'Genoa to Riviera Yacht Charter Route | Italian Riviera Sailing',
  metaDesc:
    'Sail a 7-day yacht charter from Genoa west along the Ligurian Riviera through Arenzano, Varazze, Savona, Albenga, Imperia and Vado Ligure. Mainland Liguria loop.',
  id: 'genova',
  startingPoint: 'Genova',
  otherPoints: [],
  cardImage: { src: '/images/itinerary/italy/amalfi-itinerary/routes/genova.webp', alt: 'Card image' },
  gallery: [
    { src: '/images/itinerary/italy/banners/genova-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/varazze-banner-large.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/albenga-banner.webp', alt: '' },
    { src: '/images/itinerary/italy/banners/genova-banner.webp', alt: '' },
  ],
  routeDays: [
    {
      id: 'genova-arenzano',
      routeFrom: 'Genova',
      routeTo: 'Arenzano',
      day: 1,
      mapPin: {
        desktop: { left: 51.3, top: 26.1 },
        mobile: { left: 50.9, top: 40.1 },
      },
      description:
        '12 nm shake-down west from Marina Porto Antico to Arenzano — Ligurian Riviera coast, summer wind regime is the libeccio from SW (more fickle than Adriatic Maestral) at 10-15 knots. Marina di Arenzano stern-to is the standard charter overnight; Parco Negrotto Cambiaso Renaissance gardens behind the village.',
      shortDescription:
        '12 nm shake-down W from Marina Porto Antico to Arenzano. Libeccio wind regime, 10-15 kn. Marina di Arenzano for overnight; Parco Negrotto Cambiaso behind village.',
      thingsToDo: [
        'Walk the Parco Negrotto Cambiaso gardens',
        'Swim Spiaggia Libera pebble beach',
        'Focaccia al formaggio at a hole-in-the-wall bakery',
        'Hike the Beigua Park ridge trail',
      ],
      mooringTip:
        'Marina di Arenzano stern-to, €60-100/night, sheltered from N. Marina Porto Antico (Genoa) is the larger alternative for handover prep.',
      gallery: [{ src: '/images/itinerary/italy/destinations/arenzano.webp', alt: 'Arenzano' }],
    },
    {
      id: 'arenzano-varazze',
      routeFrom: 'Arenzano',
      routeTo: 'Varazze',
      day: 2,
      mapPin: {
        desktop: { left: 41.8, top: 24.2 },
        mobile: { left: 30.7, top: 38.7 },
      },
      description:
        '8 nm short west to Varazze — Marina di Varazze is one of the largest Ligurian charter marinas, full services, lazy lines, 800 berths. The town behind the marina is a working-class Liguria seaside village; nonnas knit on seawalls in summer afternoons.',
      shortDescription:
        '8 nm short W to Varazze. Marina di Varazze (800 berths) one of largest Ligurian charter marinas, full services, lazy lines. Plenty of slot capacity. Plan to beachcomb sea glass at Spiaggia di Ponente and snorkel the hidden reef off Capo Santo Stefano.',
      thingsToDo: [
        'Beachcomb sea glass at Spiaggia di Ponente',
        'Snorkel the hidden reef off Capo Santo Stefano',
        'Lemon-fritto-misto eaten from paper cones',
        'Walk the Lungomare Europa promenade',
      ],
      mooringTip:
        'Marina di Varazze stern-to with lazy lines, €70-120/night peak, fully sheltered. Plenty of slot capacity.',
      gallery: [{ src: '/images/itinerary/italy/destinations/varazze.webp', alt: 'Varazze' }],
    },
    {
      id: 'varazze-savona',
      routeFrom: 'Varazze',
      routeTo: 'Savona',
      day: 3,
      mapPin: {
        desktop: { left: 24.1, top: 30.6 },
        mobile: { left: 26.1, top: 41.2 },
      },
      description:
        '8 nm short west to Savona — historic Ligurian port, Christopher Columbus mended ships here. Old Port Marina (Marina di Savona) is the standard charter overnight, fully sheltered. Priamar Fortress on the headland (16th-c, originally to defend against Barbary pirates) is the headline shore activity.',
      shortDescription:
        '8 nm short W to Savona. Historic port (Columbus). Old Port Marina fully sheltered. 16th-c Priamar Fortress on headland is the headline. Vado Ligure 3 nm south is the smaller alternative.',
      thingsToDo: [
        'Climb the 16th-c Priamar Fortress walls',
        "Swim the Mermaid's Grotto cove (south of port)",
        "Salt-cured anchovies at Osteria dell'Acciughetta",
        'Tasting Vermentino in a Riviera vineyard',
      ],
      mooringTip:
        'Marina di Savona stern-to, €70-110/night, fully sheltered. Vado Ligure 3 nm south is the smaller alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/savona.webp', alt: 'Savona' }],
    },
    {
      id: 'savona-albenga',
      routeFrom: 'Savona',
      routeTo: 'Albenga',
      day: 4,
      mapPin: {
        desktop: { left: 13.8, top: 38.9 },
        mobile: { left: 19.9, top: 44.5 },
      },
      description:
        '20 nm west to Albenga — Roman heritage town, Battistero Paleocristiano (5th-c Christian baptistery with original mosaics still in place) and the Centum Pagine Roman ruins underwater off the coast. Anchor near the underwater ruins for snorkel; mooring at Marina di Albenga stern-to.',
      shortDescription:
        '20 nm W to Albenga. Roman heritage town — 5th-c baptistery + Centum Pagine Roman ruins underwater. Snorkel ruins, moor at marina. Highlights: Visit the 5th-c Battistero Paleocristiano and Snorkel Centum Pagine Roman underwater ruins.',
      thingsToDo: [
        'Visit the 5th-c Battistero Paleocristiano',
        'Snorkel Centum Pagine Roman underwater ruins',
        'Buridda fish stew at a medieval-tower trattoria',
        'Tasting Pigato wine in a sea-spray vineyard',
      ],
      mooringTip:
        'Marina di Albenga stern-to, €50-80/night, sheltered from N. Anchor over Centum Pagine ruins on sand at 4-6 m for snorkel.',
      gallery: [{ src: '/images/itinerary/italy/destinations/albenga.webp', alt: 'Albenga' }],
    },
    {
      id: 'albenga-imperia',
      routeFrom: 'Albenga',
      routeTo: 'Imperia',
      day: 5,
      mapPin: {
        desktop: { left: 11.3, top: 48.1 },
        mobile: { left: 7.9, top: 63.9 },
      },
      description:
        "15 nm west to Imperia — twin-city, Oneglia (east) + Porto Maurizio (west) divided by the Prino River. Olive-oil capital of Liguria; the Museo dell'Olivo at Oneglia documents the local taggiasca olive tradition. Marina di Imperia is centred between the two halves.",
      shortDescription:
        "15 nm W to Imperia twin-city. Olive-oil capital of Liguria. Museo dell'Olivo + taggiasca olive tradition. Marina between Oneglia + Porto Maurizio halves. Plenty of slot capacity even in peak.",
      thingsToDo: [
        "Visit the Museo dell'Olivo (taggiasca tradition)",
        'Tasting peppery taggiasca olive oil',
        "Swim Spiaggia d'Oro golden-sand bay",
        'Sardenaira (Ligurian pizza) at a port trattoria',
      ],
      mooringTip: 'Marina di Imperia stern-to, €80-130/night, fully sheltered. Plenty of slot capacity even in peak.',
      gallery: [{ src: '/images/itinerary/italy/destinations/imperia.webp', alt: 'Imperia' }],
    },
    {
      id: 'imperia-vado-ligure',
      routeFrom: 'Imperia',
      routeTo: 'Vado Ligure',
      day: 6,
      mapPin: {
        desktop: { left: 21.2, top: 34.3 },
        mobile: { left: 16, top: 55.4 },
      },
      description:
        '24 nm east back to Vado Ligure — small working-class Riviera port (yachts secondary to fishing trawlers). Pista Ciclabile bike path runs from Vado east through 19th-century railway tunnels to San Lorenzo al Mare; rent a bike at the marina.',
      shortDescription:
        '24 nm E back to Vado Ligure — working-class port (fishing trawlers). Pista Ciclabile bike path through 19th-c railway tunnels. Stern-to in Vado Ligure marina, €40-60/night, sheltered from N. Plan to anchor swim at Baia dei Saraceni and seafood salad at Trattoria della Nonna.',
      thingsToDo: [
        'Cycle the Pista Ciclabile coastal bike path',
        'Anchor swim at Baia dei Saraceni',
        'Seafood salad at Trattoria della Nonna',
        "Walk the Vado old fishermen's quarter",
      ],
      mooringTip:
        'Stern-to in Vado Ligure marina, €40-60/night, sheltered from N. Marina di Savona 3 nm north is the larger alternative.',
      gallery: [{ src: '/images/itinerary/italy/destinations/vado-ligure.webp', alt: 'Vado Ligure' }],
    },
    {
      id: 'vado-ligure-cogoleto-genova',
      routeFrom: 'Vado Ligure',
      routeTo: 'Cogoleto',
      day: 7,
      mapPin: {
        desktop: { left: 30.6, top: 25.2 },
        mobile: { left: 43.2, top: 35.2 },
      },
      description:
        "20 nm east back to Genova via Cogoleto. Bergeggi Island marine reserve on the way — sea caves, snorkel-only access. Cogoleto is the birthplace of Christopher Columbus's grandfather; small Punta Martinetto watchtower above the village. Refuel at Marina Porto Antico before tying up.",
      shortDescription:
        '20 nm E back to Genova via Cogoleto. Bergeggi Island marine reserve sea caves on the way. Cogoleto = Columbus grandfather. Refuel at Marina Porto Antico.',
      thingsToDo: [
        'Snorkel Bergeggi Island sea caves',
        'Swim under the Punta Martinetto watchtower',
        'Pesto lasagna at a caruggi trattoria',
        'Visit the historic Lanterna lighthouse (Genoa)',
      ],
      mooringTip:
        'Marina Porto Antico Genoa stern-to, €100-150/night peak, sheltered from N. Refuel at the entrance fuel berth before mooring.',
      gallery: [{ src: '/images/itinerary/italy/destinations/cogoleto.webp', alt: 'Cogoleto' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/genoa/map.webp',
        alt: 'Genova Route Image',
      },
      width: 1588,
      height: 1230,
    },
    mobile: {
      image: {
        src: '/images/itinerary/italy/amalfi-itinerary/genoa/mobile-map.webp',
        alt: 'Genova Route Image',
      },
      width: 1252,
      height: 1300,
    },
  },
};

export default computeItineraryNumberOfDays(genovaRoute);
