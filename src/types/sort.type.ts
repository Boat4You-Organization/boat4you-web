// Wire-format value sent to backend as `sortBy` query param.
// Maps to tab index via `getTabValueFromParams` (see useQueryParams.ts).
// Order intentionally mirrors the `boatsTabs` config:
//   ''            → Recommended (index 0)
//   'asc'         → Lowest price (index 1)
//   'desc'        → Highest price (index 2)
//   'lengthAsc'   → Min length  (index 3)
//   'lengthDesc'  → Max length  (index 4)
// `lowestPrepayment` kept for backwards compat with deep-linked URLs.
export type SortByValue = '' | 'asc' | 'desc' | 'lengthAsc' | 'lengthDesc' | 'lowestPrepayment';
