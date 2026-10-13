const EARTH_RADIUS_MILES = 3958.8;
export const METERS_PER_MILE = 1609.344;

const rad = (deg) => (deg * Math.PI) / 180;

/** Straight-line ("as the crow flies") distance in miles between two { lat, lng } points. */
export function haversineMiles(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

/**
 * Where point p sits relative to the straight line from a to b, in miles:
 * how far it is from the line (offMiles) and how far along it the nearest
 * point is (alongMiles). Uses a flat projection, fine at road-trip distances.
 */
export function positionOnSegment(p, a, b) {
  const milesPerLat = (Math.PI / 180) * EARTH_RADIUS_MILES;
  const milesPerLng = milesPerLat * Math.cos(rad(a.lat));
  const bx = (b.lng - a.lng) * milesPerLng;
  const by = (b.lat - a.lat) * milesPerLat;
  const px = (p.lng - a.lng) * milesPerLng;
  const py = (p.lat - a.lat) * milesPerLat;
  const lengthSq = bx * bx + by * by;
  const t = lengthSq ? Math.min(Math.max((px * bx + py * by) / lengthSq, 0), 1) : 0;
  return {
    offMiles: Math.hypot(px - t * bx, py - t * by),
    alongMiles: t * Math.sqrt(lengthSq),
  };
}

/** Evenly spaced points from a to b, ends included. */
export function pointsAlong(a, b, count) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
  });
}

/** Google Maps directions to a station, or through it when there's a destination. */
export function directionsUrl({ lat, lng }, { origin, destination } = {}) {
  const ll = (p) => `${p.lat},${p.lng}`;
  if (destination) {
    const from = origin ? `&origin=${ll(origin)}` : "";
    return `https://www.google.com/maps/dir/?api=1${from}&destination=${ll(destination)}&waypoints=${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
