import { Itinerary } from '@/types/itinerary.type';

import { genovaRoute, lavagnaRoute, salernoRoute, salernoSouthRoute, sorentoRoute } from './routes';

const amalfiItinerary: Itinerary = {
  metaTitle: 'Amalfi Coast Yacht Charter Itineraries | Italy Sailing Routes',
  metaDesc:
    'Yacht charter itineraries on the Amalfi Coast — Positano, Capri, Ischia, Procida, Sorrento. Marina di Stabia / Sorrento / Salerno bases plus northern Liguria one-ways. Short-leg cuisine cruising.',
  id: 'amalfi',
  sailingArea: 'Amalfi',
  image: {
    src: '/images/itinerary/italy/amalfi-itinerary/itinerary-card.webp',
    alt: 'Amalfi',
  },
  title: 'Amalfi area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/italy/italy-banner.webp',
    alt: 'Amalfi',
  },
  description: `The Amalfi Coast and the Gulf of Naples form Italy's most photographed charter ground — a 50-NM crescent of cliffside villages (Positano, Amalfi, Ravello, Praiano, Atrani, Cetara, Maiori, Minori, Furore), the islands of Capri, Ischia and Procida, and the Sorrento peninsula's pastel ports. Charters launch from Marina di Stabia (Castellammare, 30 minutes from Naples airport NAP), from Sorrento (15 minutes further south on the peninsula, smaller marina but walkable to the town centre), or from Salerno on the south side of the peninsula (the standout for crews wanting to start the loop at Amalfi-town itself or extending south toward Cilento). Northern long-week one-ways launch from Genoa or Lavagna, adding the Cinque Terre, Portofino, Portovenere and the upper Tyrrhenian to the standard Amalfi route.

The Tyrrhenian here is small-distance sailing — most legs are 10–20 NM — but charter logistics are dense (advance mooring booking is essential in July–August at every Amalfi-coast port; the harbour at Positano is too small to handle drop-in arrivals at peak season, and the Marina Piccola anchorage at Capri can be standing-room-only by late morning). The classic 7-day Amalfi week from Marina di Stabia loops Sorrento → Capri (overnight at Marina Grande or anchor at Marina Piccola) → Positano → Amalfi-town → Praiano → Maiori → Cetara → return; alternative weeks add Ischia (the larger and quieter sister to Capri, with the Aragonese Castle approach and Sant'Angelo on the south side) and Procida (the smallest and most photogenic island of the trio, Italy's 2022 Capital of Culture).

What separates Amalfi from other Italian charter regions is the food. Campania cuisine peaks at the seaside trattorie of Praiano (La Brace, La Tagliata for the multi-course view-meal), Cetara (Acquapazza for the colatura di alici, Cetara's anchovy-sauce DOC), and Marina del Cantone (Lo Scoglio, the Pasta family's tomato-and-zucchini-pasta institution since 1953 — Stanley Tucci puts it on the show). The Sorrento limoncello distilleries (I Giardini di Cataldo, Limonoro) sell direct from the lemon-grove production sites; Capri's Da Paolino lemon-grove restaurant — the canopy-of-lemon-trees roof — sets the gastronomic standard for Mediterranean dining. Ischia delivers the Campanian volcanic-soil wines (Biancolella, Forastera) and the Negombo thermal-spring spa for a charter rest day.

Positano, Amalfi-town, Ravello and Capri have their own charter-week role. Positano is the postcard photograph everyone has seen — pastel houses stacked on the cliffside, the Spiaggia Grande beach at the foot, Le Sirenuse hotel's terrace as the sunset cocktail anchor; charterers usually do one overnight there with a long shore-evening. Amalfi-town offers the larger harbour and the cathedral piazza, plus the Path of the Gods cliff-walk above for energetic crews. Ravello sits inland (Villa Cimbrone gardens, the summer Festival on the Belvedere terrace) — reachable by car or scooter from Amalfi-town. Capri delivers the Blue Grotto morning row-boat tour (4-6 AM ideal for the light angle), the Via Tragara coastal walk to the Faraglioni viewpoint, and Anacapri on the higher side for the quieter shore-evening.

Vessel mix here leans heavily on motor yachts and crewed luxury yachts (40–80 ft Princess, Sunseeker, Azimut, Pershing) for couples and small groups celebrating something — anniversary trips, family milestones, honeymoons, friends' 40th-birthday weeks. Sailing yachts and catamarans are present but bareboat is rare on this coast; the dense mooring logistics, the swell exposure on the Amalfi-side anchorages (especially Praiano and Furore), and the cuisine-and-shore-evening focus of most charterers all push the segment toward crewed motor yachts. Crewed mega yachts (30+ m) work the Capri-Positano-Portofino long-distance corridor.

Best season May–early July and September. August is high-glamour but high-cost (mooring fees triple at Capri's Marina Grande — €150+ for a 45 ft yacht in peak August, €250+ at Marina Piccola anchorage), and the Sorrento traffic ashore peaks (the SS163 cliffside coastal road becomes single-lane-with-30-minute-waits in August). June and September are the sweet spot for value, weather and food — water 23–25 °C, the Capri tour-boat density still manageable, and the Praiano and Cetara trattorie holding evening tables instead of turning crews away.

Permits and paperwork: no special National Park permits for the Amalfi side (the Punta Campanella Marine Protected Area on the Sorrento peninsula's tip does have anchoring restrictions in marked zones — the broker pre-checks). Tourist-tax line items appear on the marina overnight invoice (€2–5/person/night, varies by port). Standard Italian charter VAT and APA reconciliation handled per Italian charter regulations.`,
  routes: [genovaRoute, lavagnaRoute, salernoRoute, salernoSouthRoute, sorentoRoute],
};

export default amalfiItinerary;
