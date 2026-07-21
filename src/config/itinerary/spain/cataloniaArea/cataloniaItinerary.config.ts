import { Itinerary } from '@/types/itinerary.type';

import { barcelonaRoute, costaBrava14Route, marbellaRoute, palamosRoute, sitgesRoute } from './routes';

const cataloniaItinerary: Itinerary = {
  metaTitle: 'Catalonia Yacht Charter Itineraries | Barcelona & Costa Brava Sailing',
  metaDesc:
    'Yacht charter itineraries from Catalonia — Barcelona, Sitges, Palamós, Costa Brava, Cap de Creus. Easy big-city embarkation at BCN, reliable thermal winds, clear-water coves.',
  id: 'catalonia',
  sailingArea: 'Catalonia',
  image: {
    src: '/images/itinerary/spain/catalonia-itinerary/itinerary-card.webp',
    alt: 'Catalonia',
  },
  title: 'Catalonia area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/spain/spain-banner.webp',
    alt: 'Catalonia',
  },
  description: `The Catalan coast — Costa Brava in the north (240 km of cliff-and-cove coastline from Blanes to the French border), Barcelona's Port Olímpic / Port Vell in the centre, Sitges and the Costa Daurada south — gives charters the easiest big-city embarkation in Spain. Direct EU flights into Barcelona-El Prat (BCN) make Saturday-afternoon check-in painless from London, Manchester, Dublin, Paris, Berlin, Munich, Vienna, Amsterdam, Brussels, Zürich, Geneva, Stockholm, Milan and Rome year-round. The marina cluster around Port Forum, Port Vell and Marina Vela handles the bulk of bareboat departures; Marina 92 and Port Ginesta (15 km south at Sitges) are the bareboat-friendly alternatives with lower overnight rates.

From the Barcelona embarkation a 7-day week typically heads north along the Costa Brava — Day 1 short hop to Sitges (the standout shore-evening town, walkable from Port Ginesta), Day 2 longer leg to Palamós (the langoustine port — Palamós shrimp Gambas de Palamós is a Spanish DO product, the cooperative on the harbour serves the morning auction), Day 3 onward to L'Escala (anchovies-and-Roman-ruins, Empúries archaeological park 10 minutes from the marina), Day 4 Roses (the wide protected anchorage and the foothills of the Pyrenees rising behind), Day 5 Cadaqués (Salvador Dalí country, the most photographed cove village in Catalonia — the Dalí house at Portlligat is walkable), Day 6 Cap de Creus (the easternmost point of the Iberian peninsula, dramatic schist-rock coastline, Cap de Creus Natural Park with multiple cove anchorages), Day 7 return south via Aiguablava and Tossa de Mar. Roughly 130 NM total.

The unique pull of Catalonia is what's ashore. Barcelona's Gothic Quarter, Gaudí's Sagrada Família, Park Güell, Casa Batlló and Palau de la Música are all reachable as half-day stops from Port Vell (walking distance to most). The Costa Brava restaurants give Spanish charters Catalonia's standout meals — Empordà cuisine (suquet de peix, sea-and-mountain stews, escalivada), the Roca brothers' three-Michelin Celler de Can Roca influence (the daughter restaurants and trained-by-the-Rocas alumni populate the small Empordà towns), and the standout dock-side bistros at Palamós and L'Escala. Wine pairings move through the Empordà DO whites (Garnatxa Blanca, Macabeu) and the Penedès region's cavas south of Barcelona.

Cap de Creus and the Aiguamolls Natural Park deserve their own paragraph. The Cap de Creus Natural Park (Spain's first marine-and-terrestrial combined Natural Park) protects the rocky north Catalan tip — the schist-cliff anchorages, the wind-twisted vegetation that inspired Dalí's surrealist landscapes, and the underwater ecology around Roses Bay. Aiguamolls Natural Park (just south of Roses) is the bird-migration wetland — flamingos, herons, storks visible from the boat at the right season (April-May and September-October).

The summer thermal-wind pattern is reliable (5–7 Bft most afternoons, light morning calm) and the water clarity in the Costa Brava coves matches the Balearics (8–12 m visibility on a settled day). Crowds stay below the Ibiza/Mallorca summer pressure — the Costa Brava coves rarely have more than 5–10 boats at any single anchorage even in August, and Cap de Creus often has the bay to your crew and one other yacht.

Catalonia suits motor yachts (the Barcelona harbour and the Costa Brava cove combination works well for shore-evening-heavy charters) and sailing yachts (45–50 ft Bavarias and Jeanneaus dominate the bareboat fleet — the reliable thermals make sailing-first weeks rewarding). Catamaran demand is lower here than the Balearics; the cluster has fewer than the Ibiza/Mallorca corner can offer. Crewed luxury yachts (50+ ft) work the Barcelona-Sitges-Palamós shore-evening circuit.

Best season May–early July and September. August Barcelona heat (32–35 °C onshore) and tourist-density are the trade-off for peak weather; many crews start or end in Barcelona but spend the bulk of the week 60+ NM north up the Costa Brava where the city density disappears. May has the lightest crowds and the cooler swim (water 19–21 °C); September is the broker's preferred window — water 23–24 °C, light afternoon thermals, restaurants reopening from their late-August closure.

The Tramuntana wind risk is the one weather caveat. A few times per season a Pyrenean front sends a north-east 7–8 Bft Tramuntana down the Costa Brava — pins the fleet in for 24 hours typically (the Costa Brava harbours all have safe enough overnight protection). The captain reads the forecast 48 hours ahead and reroutes south if needed. Spring shoulder weeks (May, early June) carry higher Tramuntana risk than late summer.`,
  routes: [barcelonaRoute, marbellaRoute, palamosRoute, sitgesRoute, costaBrava14Route],
};

export default cataloniaItinerary;
