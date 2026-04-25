export const generateGoogleMapsLink = (location: string): string => {
  const encodedLocation = encodeURIComponent(location);

  // t=k opens Google Maps in satellite view by default so users see the actual
  // marina from above (boat charter context — aerial shot reads faster than map).
  return `https://www.google.com/maps?q=${encodedLocation}&t=k`;
};
