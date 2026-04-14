import { AgencyModel } from '@/models/agency.model';
import { BoatImage, BoatLocation, BoatModel, Location } from '@/models/boat.model';
import { LOCATION_TYPE_ARRAY } from '@/types/location.type';
import { MAIN_SAIL_TYPE_ARRAY } from '@/types/main-sail.type';

import { _boatModels, _boatNames } from './_assets';

export const _mockAgency = (index: number): AgencyModel => ({
  id: index,
  name: `Agency ${index}`,
  address: `Address ${index}`,
  city: `City ${index}`,
  country: `Country ${index}`,
  zip: `2100${index}`,
  vatCode: `VAT-${index}`,
  web: `https://agency${index}.com`,
  email: `agency${index}@email.com`,
  phone: `+385 91 0000 00${index}`,
  mobile: `+385 98 0000 00${index}`,
  iban: `HR00 1001 0000 0000 ${index.toString().padStart(4, '0')}`,
  active: 'YES',
  discount: index % 10,
  director: `Director ${index}`,
  skipExternalSystem: index % 2 === 0,
});

export const _mockLocation = (index: number): Location => ({
  id: index,
  countryCode: 'HR',
  lat: 43.5 + index * 0.1,
  lon: 16.0 + index * 0.1,
});

export const _mockBoatImage = (i: number, boatIndex: number): BoatImage => {
  const urls = [
    'https://www.booking-manager.com/cbm/documents/6259149640000107392_lagoon-50--3.jpg',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1729351905574-e7824c5baf47?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1630301547373-ca91fb398a29?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  return {
    id: boatIndex * 10 + i,
    url: urls[i % urls.length],
    position: i + 1,
    mainImage: i === 0,
  };
};

export const _mockBoatLocation = (index: number): BoatLocation => ({
  id: index,
  realId: index,
  name: `Location ${index}`,
  locationType: LOCATION_TYPE_ARRAY[index % LOCATION_TYPE_ARRAY.length],
  countryCode: 'HR',
});

export const _mockBoat = (index: number): BoatModel => ({
  id: index,
  name: _boatNames[index],
  buildYear: 2000 + (index % 25),
  maxPersons: 6 + (index % 4),
  cabins: 3 + (index % 2),
  wc: 1 + (index % 2),
  berths: 4 + (index % 2),
  enginePower: 100 + index * 10,
  fuelTank: 80 + index * 10,
  beam: 80 + index * 10,
  waterTank: 120 + index * 5,
  mainSailType: MAIN_SAIL_TYPE_ARRAY[index % MAIN_SAIL_TYPE_ARRAY.length],
  length: 12 + index * 0.5,
  model: _boatModels[index],
  clientPriceEur: 1000 + index * 100,
  totalPriceEur: 1200 + index * 100,
  clientPriceInfo: 950 + index * 100,
  totalPriceCalcInfo: 1250 + index * 100,
  agency: _mockAgency(index),
  location: _mockLocation(index),
  yachtImages: Array.from({ length: 7 }, (_, i) => _mockBoatImage(i, index)),
  sysDescription:
    "Lagoon 55 ADEL (2023) is a luxury catamaran, which can accommodate up to 8 guests in 1 Queen and 3 VIP cabins, all with ensuite facilities. She is offered with a crew of 3, who are accommodated in separate quarters. ADEL is a unique sailing catamaran, being the first floating art-gallery. She is housing original artwork from well-known contemporary Chech artists - from the owner's country of origin. The aim is to create an environment where the pleasure of the sailing experience will be combined with the visual pleasures created by original works of art. The yacht decoration is by Erika Voith, who has also created original works, some of which are hanging on the walls of ADEL. The guests have the opportunity to enjoy the artwork by Erika Voith, in cooperation with ArtLine institute.",
  fixedPrice: 1500 + index * 100,
  locations: [_mockBoatLocation(index)],
});
