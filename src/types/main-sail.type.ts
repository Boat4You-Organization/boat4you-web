export enum MainSailType {
  UNKNOWN = 'UNKNOWN',
  CLASSIC_SAIL = 'CLASSIC_SAIL',
  ROLLING_SAIL = 'ROLLING_SAIL',
}

export const MAIN_SAIL_TYPE_LABEL_MAP = {
  [MainSailType.UNKNOWN]: 'Classic',
  [MainSailType.CLASSIC_SAIL]: 'Classic Sail',
  [MainSailType.ROLLING_SAIL]: 'Rolling Sail',
} as const;

export const MAIN_SAIL_TYPE_ARRAY = Object.values(MainSailType);
