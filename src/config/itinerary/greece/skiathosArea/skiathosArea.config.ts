import { Itinerary } from '@/types/itinerary.type';

import { skiathosRoute, volosSkopelosRoute } from './routes';

const skiathosItinerary: Itinerary = {
  metaTitle: 'Sporades Yacht Charter Itineraries | Greece Sailing Routes',
  metaDesc:
    'Yacht charter itineraries in the Sporades — Skiathos, Skopelos, Alonissos and the Northern Marine National Park. Sheltered meltemi, monk-seal waters, family-friendly cruising.',
  id: 'sporades',
  sailingArea: 'Sporades',
  image: {
    src: '/images/itinerary/greece/skiathos-itinerary/itinerary-card.webp',
    alt: 'Sporades',
  },
  title: 'Sporades area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/greece/greece-banner.webp',
    alt: 'Sporades area banner image',
  },
  description: `The Sporades sit in the central-Aegean cluster between mainland Greece and the Northern Aegean — Skiathos, Skopelos, Alonissos and the Marine National Park of Alonissos. Charters depart from Skiathos Marina (the standout commercial base, 5 minutes from Skiathos airport JSI with direct EU flights April through October) or from Volos on the mainland (a 90 NM transit from Athens that lands the same fleet at 20–30% lower weekly rates — worth it for charters with one-way time or budget pressure). The chain is short enough that a 7-day week comfortably covers the four main islands without one-way logistics, with passages typically 15–25 NM and harbour density allowing every-night-in-port if the crew wants it.

Two factors set the Sporades apart from the rest of Greece. First, the meltemi reaches here only in moderated form — typically 3–4 Bft on the protected southwest sides, occasional 5 Bft on the exposed eastern beaches — making this the second-gentlest Greek charter ground after the Ionian and the obvious first-week pick for crews moving up from light-wind cruising grounds. Second, the Northern Sporades National Marine Park (Greece's first marine reserve, established 1992) covers waters around Alonissos and offers reliable Mediterranean monk seal sightings — a critically endangered species with one of its last viable Mediterranean populations here. Mooring inside the park requires advance permits handled by the charter base; a ranger-piloted patrol enforces the no-anchor zones.

Classic 7-day week from Skiathos: Day 1 short hop to Tsougria for the shake-down swim and lunch, Day 2 across to Skopelos town (the harbour the Mamma Mia! film made famous — yes, the church scenes are filmed at Agios Ioannis on the eastern side, sailable from Skopelos), Day 3 Alonissos's Patitiri with a Marine Park boat-tour booking for monk-seal waters, Day 4 lay-day Alonissos or shore-side hike up to the Old Town (Chora), Day 5 west to Glossa on Skopelos's north tip, Day 6 back to Skiathos via Koukounaries beach, Day 7 return. Total roughly 90 NM over the week.

Vessel mix runs catamarans (Lagoon 40-46, Bali 4.2) for families and crews wanting stable anchoring at shallow Tsougria-style coves; sailing yachts (40–50 ft Bavarias, Jeanneaus, Bénéteaus) for sailing-first crews; small motor cruisers in the 35–45 ft range for cooler-week charters. Gulet weeks run from the mainland (Volos) but the Sporades fleet is more bareboat-and-skippered than gulet.

Best season May–early July and September. May has the lightest wind and smallest crowds (water 19–21 °C, swimmable but cool). September brings the warmest swim (23–24 °C) with the meltemi already retreating. July is hot and crowded around Skiathos town nightlife (and the Mamma Mia! day-trip traffic on Skopelos), August is full-rate with Skiathos airport gridlocked Saturday — avoid if possible.

Pine-forested island slopes, traditional fishing-village ports (Skopelos town and Alonissos's Patitiri stand out), and shallow turquoise anchorages around Tsougria suit families with kids, first-Med crews, and nature-and-culture-focused charters wanting an alternative to the meltemi pressure of the Cyclades. Skiathos itself has 60+ beaches catalogued by the tourism board — Koukounaries, Lalaria (accessible only by boat from the north coast), Mandraki and Banana Bay are the standout swim stops.`,
  routes: [skiathosRoute, volosSkopelosRoute],
};

export default skiathosItinerary;
