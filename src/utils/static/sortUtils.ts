export const sortByObligatoryExtras =
  (obligatoryExtrasKeys: string[]) =>
  <T extends { key: string }>(a: T, b: T) => {
    const aIsObligatory = obligatoryExtrasKeys.includes(a.key);
    const bIsObligatory = obligatoryExtrasKeys.includes(b.key);

    if (aIsObligatory && !bIsObligatory) return -1;

    if (!aIsObligatory && bIsObligatory) return 1;

    return a.key.localeCompare(b.key);
  };
