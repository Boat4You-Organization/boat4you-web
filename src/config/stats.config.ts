export interface Stats {
  title: number;
  description:
    | 'premiumYachtsFleet'
    | 'worldwideDestinations'
    | 'teamExperience'
    | 'customersServed'
    | 'charterPartners';
}

export const stats: Stats[] = [
  {
    title: 23982,
    description: 'premiumYachtsFleet',
  },
  {
    title: 100,
    description: 'worldwideDestinations',
  },
  {
    title: 50,
    description: 'teamExperience',
  },
  {
    title: 10000,
    description: 'customersServed',
  },
  {
    title: 500,
    description: 'charterPartners',
  },
];
