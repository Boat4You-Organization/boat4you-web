export interface AmenitieModel {
  navigation: {
    autopilot: boolean;
    outsideGpsPlotter: boolean;
    generator: boolean;
    bimini: boolean;
    dinghy: boolean;
    electricWinches: boolean;
  };
  saloon: {
    airConditioning: boolean;
    coffeeMachine: boolean;
    outsideShower: boolean;
    cooker: boolean;
    kitchenUtensils: boolean;
    oven: boolean;
  };
  entertainment: {
    waterToys: boolean;
    outsideSpeakers: boolean;
    snorkelSets: boolean;
    audioSystem: boolean;
  };
}

export type AmenitieCategory = keyof AmenitieModel;
export type AmenitieKey = {
  category: AmenitieCategory;
  field: keyof AmenitieModel[AmenitieCategory];
};

export interface AmenitieDescriptor {
  category: AmenitieCategory;
  field: string;
  label: string;
}
