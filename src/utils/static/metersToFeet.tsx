export function metersToFeet(meters: number, decimalPlaces: number = 2): number {
  const feet = meters * 3.28084;

  return Math.round(feet * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function feetToMeters(feet: number, decimalPlaces: number = 2): number {
  const meters = feet / 3.28084;

  return Math.round(meters * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}
