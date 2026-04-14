export const formatNumber = (num: number) => num.toLocaleString();

export const formatPrice = (num: number): string =>
  num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
