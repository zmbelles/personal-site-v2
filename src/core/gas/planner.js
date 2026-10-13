import { haversineMiles, positionOnSegment } from "./geo.js";

// Only for estimates when no routing service answered: straight-line distance
// × 1.3 is a common stand-in for driving distance. Such stations are flagged.
export const DEFAULT_ROAD_FACTOR = 1.3;

/**
 * Ranks stations by the cost of a fill-up including the fuel burned on the detour.
 *
 * For each station:
 *   need          = tank × (1 − percentFull)       gallons to fill from here
 *   detourMiles   = extra driving the stop adds, in road miles:
 *                     no destination  -> there (and back, if roundTrip)
 *                     destination     -> (start→station) + (station→destination)
 *                                        − (start→destination); the trip itself
 *                                        is never charged
 *
 * Road miles come from `roads` (see measureRoads). A station without them is
 * estimated from straight-line distance and returned with `estimated: true`.
 *   detourGallons = detourMiles / mpg
 *   totalCost     = price × (need + detourGallons)
 *
 * Stations without a price for the chosen grade are returned in `unpriced`.
 *
 * @param {object}  args
 * @param {{ mpg: number, tankGallons: number }} args.vehicle
 * @param {number}  args.tankPercent  0–100
 * @param {{ lat: number, lng: number }} args.origin
 * @param {Array}   args.stations     { id, name, lat, lng, prices: { [grade]: { price } } }
 * @param {string}  args.grade        "regular" | "midgrade" | "premium" | "diesel"
 * @param {{ lat: number, lng: number }} [args.destination]  plan a stop on the way here
 * @param {boolean} [args.roundTrip=true]  without a destination: count the drive back to the start
 * @param {{ tripMiles?: number, legs: Map }} [args.roads]  measured road miles
 * @param {number}  [args.roadFactor]
 */
export function planFillUp({
  vehicle,
  tankPercent,
  origin,
  destination = null,
  stations,
  grade,
  roundTrip = true,
  roads = null,
  roadFactor = DEFAULT_ROAD_FACTOR,
}) {
  const { mpg, tankGallons } = vehicle;
  const fraction = Math.min(Math.max(tankPercent, 0), 100) / 100;
  const fuelOnBoard = tankGallons * fraction;
  const needGallons = tankGallons - fuelOnBoard;
  const rangeMiles = fuelOnBoard * mpg;
  const guess = (a, b) => haversineMiles(a, b) * roadFactor;
  const measuredTrip = destination ? roads?.tripMiles ?? null : 0;
  const tripMiles = measuredTrip ?? guess(origin, destination);

  // Road miles for one station, measured when possible, otherwise estimated.
  function distancesFor(station) {
    const leg = roads?.legs.get(station.id);
    const measured =
      leg?.fromOrigin != null && (!destination || (leg.toDestination != null && measuredTrip != null));
    if (measured) {
      const oneWayMiles = leg.fromOrigin;
      const detourMiles = destination
        ? Math.max(0, leg.fromOrigin + leg.toDestination - measuredTrip)
        : roundTrip ? oneWayMiles * 2 : oneWayMiles;
      return { oneWayMiles, detourMiles, alongMiles: destination ? oneWayMiles : null, estimated: false };
    }

    const oneWayMiles = guess(origin, station);
    if (!destination) {
      return { oneWayMiles, detourMiles: roundTrip ? oneWayMiles * 2 : oneWayMiles, alongMiles: null, estimated: true };
    }
    // Out to the station and back to the straight line between start and destination.
    const onRoute = positionOnSegment(station, origin, destination);
    return {
      oneWayMiles,
      detourMiles: onRoute.offMiles * 2 * roadFactor,
      alongMiles: onRoute.alongMiles * roadFactor,
      estimated: true,
    };
  }

  const priced = [];
  const unpriced = [];

  for (const station of stations) {
    const { oneWayMiles, detourMiles, alongMiles, estimated } = distancesFor(station);
    const price = station.prices?.[grade]?.price;
    if (!(price > 0)) {
      unpriced.push({ station, oneWayMiles, detourMiles, alongMiles, estimated });
      continue;
    }

    const detourGallons = detourMiles / mpg;
    const fillCost = price * needGallons;
    const travelCost = price * detourGallons;

    priced.push({
      station,
      price,
      oneWayMiles,
      alongMiles,
      detourMiles,
      estimated,
      detourGallons,
      fillCost,
      travelCost,
      totalCost: fillCost + travelCost,
      reachable: oneWayMiles <= rangeMiles,
    });
  }

  priced.sort((a, b) => b.reachable - a.reachable || a.totalCost - b.totalCost);
  unpriced.sort((a, b) =>
    destination ? a.detourMiles - b.detourMiles || a.oneWayMiles - b.oneWayMiles : a.oneWayMiles - b.oneWayMiles
  );

  const reachable = priced.filter((o) => o.reachable);
  const best = reachable[0] || null;
  const cheapestSticker =
    reachable.reduce((min, o) => (!min || o.price < min.price ? o : min), null) || null;

  for (const o of priced) o.extraVsBest = best ? o.totalCost - best.totalCost : 0;

  return {
    needGallons,
    rangeMiles,
    tripMiles,
    tripEstimated: Boolean(destination) && measuredTrip == null,
    options: priced,
    unpriced,
    best,
    cheapestSticker,
    stickerIsMisleading: Boolean(best && cheapestSticker && best !== cheapestSticker),
  };
}
