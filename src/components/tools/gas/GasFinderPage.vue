<template>
  <div class="gf">
    <header class="container page-hero">
      <p class="eyebrow">Helpful pages</p>
      <h1>Cheapest Gas Finder</h1>
      <p>
        The lowest price on the sign isn't always the cheapest fill-up. Pick
        your car, say how full the tank is, and this ranks nearby stations by
        what you'll actually spend once the gas burned driving there is
        counted.
      </p>
    </header>

    <div class="container gf-steps">
      <section class="card gf-step">
        <h2>
          <span class="gf-num">1</span> Your car
          <button v-if="hasSavedState" type="button" class="btn btn--ghost btn--sm gf-reset" @click="startOver">
            Start over
          </button>
        </h2>
        <GasVehiclePicker
          :key="pickerKey"
          :vehicles="vehicles"
          :selected-id="vehicle?.id || ''"
          :selected-variant-id="variant?.id || ''"
          @select="selectVehicle"
        />
        <p v-if="loadError" class="gf-error">{{ loadError }}</p>

        <div class="gf-car">
          <p class="gf-car-name">
            <template v-if="vehicle">{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</template>
            <template v-else>Pick your car above, or type its numbers in yourself.</template>
          </p>
          <label v-if="vehicle && vehicle.variants.length > 1" class="field gf-variant">
            <span>Engine &amp; transmission · {{ vehicle.variants.length }} versions, {{ vehicle.mpgMin }}–{{ vehicle.mpgMax }} mpg</span>
            <select :value="variant?.id" @change="selectVariant(vehicle.variants.find((v) => v.id === $event.target.value))">
              <option v-for="v in vehicle.variants" :key="v.id" :value="v.id">
                {{ v.label }} · {{ v.mpg }} mpg · {{ v.fuel }}
              </option>
            </select>
          </label>
          <p v-else-if="variant" class="gf-variant-one">{{ variant.label }}</p>
          <p v-if="variant" class="gf-variant-mpg">
            EPA: {{ variant.city }} city / {{ variant.hwy }} highway / {{ variant.mpg }} combined ·
            {{ FUEL_LABELS[variant.fuel].toLowerCase() }} fuel
          </p>
          <div class="gf-car-fields">
            <label class="field">
              <span>Miles per gallon</span>
              <input v-model.number="mpg" type="number" inputmode="decimal" min="1" step="1" />
            </label>
            <label class="field">
              <span>Tank size (gal)<template v-if="tankIsEstimate"> · est.</template></span>
              <input
                v-model.number="tankGallons"
                type="number"
                inputmode="decimal"
                min="1"
                step="0.5"
                @input="tankIsEstimate = false"
              />
            </label>
          </div>
          <label class="gf-gauge">
            <span class="gf-gauge-label">
              Tank is <b>{{ tankPercent }}%</b> full
              <template v-if="carReady"> · {{ needGallons.toFixed(1) }} gal to fill</template>
            </span>
            <input v-model.number="tankPercent" type="range" min="0" max="100" step="5" />
            <span class="gf-gauge-ends" aria-hidden="true"><span>E</span><span>½</span><span>F</span></span>
          </label>
        </div>
      </section>

      <section class="card gf-step">
        <h2><span class="gf-num">2</span> Where you are</h2>
        <div class="gf-loc">
          <button type="button" class="btn btn--primary" :disabled="locating" @click="useMyLocation">
            {{ locating ? "Finding you…" : "Use my location" }}
          </button>
          <span class="gf-or">or</span>
          <form class="gf-zip" @submit.prevent="searchPlace">
            <label class="sr-only" for="gf-place">ZIP code or address</label>
            <input id="gf-place" v-model="placeQuery" type="text" placeholder="ZIP code or address" autocomplete="postal-code" />
            <button type="submit" class="btn btn--ghost" :disabled="locating || !placeQuery.trim()">Search</button>
          </form>
        </div>
        <p v-if="origin" class="gf-origin">
          {{ destination ? "Starting from" : "Searching near" }} <b>{{ origin.label }}</b>
        </p>
        <p v-if="locationError" class="gf-error">{{ locationError }}</p>

        <div class="gf-dest">
          <p class="gf-dest-label">
            <b>Going somewhere?</b> Add a destination to find the cheapest stop on the way.
          </p>
          <form class="gf-zip" @submit.prevent="searchDestination">
            <label class="sr-only" for="gf-dest">Destination address or ZIP code</label>
            <input id="gf-dest" v-model="destQuery" type="text" placeholder="Destination address or ZIP code" />
            <button type="submit" class="btn btn--ghost" :disabled="destLocating || !destQuery.trim()">
              {{ destLocating ? "Finding…" : "Set" }}
            </button>
            <button v-if="destination" type="button" class="btn btn--ghost" @click="clearDestination">Clear</button>
          </form>
          <p v-if="destination" class="gf-origin">
            Heading to <b>{{ destination.label }}</b>
            <template v-if="origin && roads.tripMiles != null"> · {{ Math.round(roads.tripMiles) }} miles by road</template>
          </p>
          <p v-if="destError" class="gf-error">{{ destError }}</p>
        </div>

        <div class="gf-options">
          <label class="field">
            <span>Fuel</span>
            <select v-model="grade">
              <option v-for="g in FUEL_GRADES" :key="g" :value="g">{{ FUEL_LABELS[g] }}</option>
            </select>
          </label>
          <label v-if="!destination" class="field">
            <span>Search within</span>
            <select v-model.number="radiusMiles">
              <option v-for="r in RADIUS_OPTIONS" :key="r" :value="r">{{ r }} miles</option>
            </select>
          </label>
          <label v-else class="field">
            <span>Stations up to</span>
            <select v-model.number="corridorMiles">
              <option v-for="r in [1, 2, 3, 5, 10]" :key="r" :value="r">{{ r }} mi off the route</option>
            </select>
          </label>
          <label v-if="!destination" class="gf-check">
            <input v-model="roundTrip" type="checkbox" />
            <span>Count the drive back too</span>
          </label>
        </div>
      </section>

      <section class="card gf-step" aria-live="polite">
        <h2><span class="gf-num">3</span> Where to fill up</h2>
        <p v-if="!carReady" class="gf-hint">Pick a car (or enter its MPG and tank size) to see results.</p>
        <p v-else-if="!origin" class="gf-hint">Share your location or search a ZIP code to find stations.</p>
        <p v-else-if="searching" class="gf-hint">Looking for stations…</p>
        <p v-else-if="searchError" class="gf-error">
          {{ searchError }}
          <button type="button" class="btn btn--ghost btn--sm gf-retry" @click="runSearch">Try again</button>
        </p>
        <p v-else-if="!stations.length" class="gf-hint">
          <template v-if="destination">No gas stations found within {{ corridorMiles }} miles of the route. Try allowing a bigger detour.</template>
          <template v-else>No gas stations found within {{ radiusMiles }} miles. Try a wider search.</template>
        </p>
        <template v-else>
          <p v-if="!livePricesOn" class="gf-note">
            Live prices aren't switched on for this site yet, so stations come
            from OpenStreetMap without prices. Add the prices you see and the
            ranking updates as you type.
          </p>
          <p v-else-if="!lastSearchLive" class="gf-note">
            You've used today's {{ DAILY_LIVE_SEARCHES }} live-price searches,
            so these stations don't have prices. Add the prices you see and the
            ranking updates as you type. Live prices are back tomorrow.
          </p>
          <p v-else-if="!anyLivePrices" class="gf-note">
            Live prices didn't come through for this search, so these stations
            have none yet. Add the prices you see and the ranking updates as
            you type, or try again in a minute.
          </p>
          <p v-if="measuring" class="gf-hint gf-measuring">Measuring driving distances…</p>
          <p v-else-if="routingFailed && plan.options.some((o) => o.estimated)" class="gf-note">
            Couldn't reach the routing service, so distances marked ≈ are
            estimates from straight-line distance. Try again in a minute for
            exact driving distances.
          </p>
          <GasResults
            :plan="plan"
            :grade="grade"
            :origin="origin"
            :destination="destination"
            :loading-more="loadingMore"
            @set-price="setPrice"
          />
          <p class="gf-credits">
            <template v-if="lastSearchLive">
              Prices: Google Maps ({{ liveSearchesLeft }} live-price
              {{ liveSearchesLeft === 1 ? "search" : "searches" }} left today) ·
            </template>
            Stations, address search and driving distances:
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>,
            routing by <a href="https://project-osrm.org/" target="_blank" rel="noopener">OSRM</a> ·
            Vehicles: <a href="https://www.fueleconomy.gov/feg/download.shtml" target="_blank" rel="noopener">U.S. EPA</a> ·
            ZIP codes: U.S. Census Bureau
          </p>
        </template>
      </section>
    </div>

    <section class="container gf-how">
      <h2>How the math works</h2>
      <p>
        Every station is scored on the same thing: what it costs to end up back
        where you started with a full tank. That's the gas you need to fill up,
        plus the gas the round trip burns, all at that station's price.
      </p>
      <p>
        Say you need 11 gallons and get 25 mpg. Station A is $5.00 and 2 miles
        away; station B is $4.95 and 10 miles away. The trip to B and back burns
        0.8 gallons against A's 0.16, which costs more than the 5¢ a gallon
        saves, so A wins by about $2.60. Distances are real driving distances
        from a routing service (OpenStreetMap's OSRM, with Google as a
        backup); if neither answers, estimates are marked ≈.
      </p>
      <p>
        With a destination, the drive itself costs the same whichever station
        you pick, so only the detour counts: the drive from your start to the
        station and on to your destination, minus the drive you'd make anyway.
        A station half a mile off the route adds about a mile; one right on
        your way adds nothing.
      </p>
    </section>

    <section class="container gf-how">
      <h2>Questions</h2>
      <div v-for="item in faq" :key="item.q" class="gf-faq">
        <h3>{{ item.q }}</h3>
        <p>
          {{ item.a }}
          <a v-if="item.link" :href="item.link.url" target="_blank" rel="noopener">{{ item.link.text }}</a>
        </p>
      </div>
    </section>

    <CoffeeRail>
      Free, no sign-up, and nothing you enter is saved on a server. If it
      saved you a few bucks at the pump, a coffee goes a long way.
    </CoffeeRail>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import seo from "@/seo/pages.json";
import {
  createNominatimGeocoder,
  createPlaceSearch,
  createStationSearch,
  createZipLookup,
  createGoogleRouter,
  createOsrmRouter,
  createRouter,
  decodeVehicles,
  FUEL_GRADES,
  FUEL_LABELS,
  measureRoads,
  planFillUp,
} from "@/core/gas";
import {
  clearSettings,
  getCurrentPosition,
  loadSettings,
  recordUse,
  saveSettings,
  usesToday,
} from "./browserAdapters.js";
import GasVehiclePicker from "./GasVehiclePicker.vue";
import GasResults from "./GasResults.vue";
import CoffeeRail from "@/components/support/CoffeeRail.vue";

const faq = seo.pages["/tools/gas-finder"].faq;

// The Google key comes from .env at build time and ends up in the public
// bundle (and the public gh-pages branch). That's expected for a browser key
// and it's still safe: in Google Cloud it only accepts requests from
// thenetsuiteguy.com (plus localhost:8080), only works for Places and Routes,
// and has daily quota caps, so a copied key is useless elsewhere.
const googleApiKey = process.env.VUE_APP_GOOGLE_PLACES_KEY;
const livePricesOn = Boolean(googleApiKey);
// Searches that use Google (prices, backup routing) are limited per device per day;
// past that, searches carry on with the free OpenStreetMap services only.
const DAILY_LIVE_SEARCHES = 3;
const osrm = createOsrmRouter();
const liveSearch = createStationSearch({ googleApiKey });
const freeSearch = createStationSearch();
// Driving distances: OSRM first, Google Routes if it fails.
const liveRouter = createRouter([osrm, ...(livePricesOn ? [createGoogleRouter({ apiKey: googleApiKey })] : [])]);
const freeRouter = createRouter([osrm]);
const geocoder = createPlaceSearch({
  zipLookup: createZipLookup({
    load: () => import(/* webpackChunkName: "zips" */ "@/core/gas/data/zips.json").then((m) => m.default || m),
  }),
  geocoder: createNominatimGeocoder(),
});

const saved = loadSettings();

const vehicles = ref(null);
const loadError = ref("");
const vehicle = ref(null);
const variant = ref(null);
const mpg = ref(saved.mpg || null);
const tankGallons = ref(saved.tankGallons || null);
const tankIsEstimate = ref(saved.tankIsEstimate ?? false);
const tankPercent = ref(saved.tankPercent ?? 25);

const carReady = computed(() => mpg.value > 0 && tankGallons.value > 0);
const needGallons = computed(() => tankGallons.value * (1 - tankPercent.value / 100));

function selectVehicle(v, chosenVariant) {
  if (vehicle.value !== v) {
    vehicle.value = v;
    tankGallons.value = v.tankGallons;
    tankIsEstimate.value = v.tankEstimated;
  }
  // Smallest engine first, usually the base trim.
  selectVariant(chosenVariant || v.variants[0]);
}

function selectVariant(v) {
  variant.value = v;
  mpg.value = v.mpg;
  grade.value = v.fuel;
}

onMounted(async () => {
  try {
    const data = await import(/* webpackChunkName: "vehicles" */ "@/core/gas/data/vehicles.json");
    vehicles.value = decodeVehicles(data.default || data);
    if (saved.vehicleId) {
      vehicle.value = vehicles.value.find((v) => v.id === saved.vehicleId) || null;
      variant.value = vehicle.value?.variants.find((v) => v.id === saved.variantId) || null;
    }
  } catch {
    loadError.value = "The vehicle list didn't load. You can still type your MPG and tank size below.";
  }
});

const origin = ref(null);
const locating = ref(false);
const locationError = ref("");
const placeQuery = ref("");

async function locate(fn) {
  locating.value = true;
  locationError.value = "";
  try {
    const point = await fn();
    if (point) origin.value = point;
    else locationError.value = "Couldn't find that place. Try a ZIP code.";
  } catch (err) {
    locationError.value = err.message;
  } finally {
    locating.value = false;
  }
}

const useMyLocation = () => locate(getCurrentPosition);
const searchPlace = () => locate(() => geocoder.geocode(placeQuery.value.trim()));

const destination = ref(null);
const destQuery = ref("");
const destLocating = ref(false);
const destError = ref("");

async function searchDestination() {
  destLocating.value = true;
  destError.value = "";
  try {
    const point = await geocoder.geocode(destQuery.value.trim());
    if (point) destination.value = point;
    else destError.value = "Couldn't find that place. Try a ZIP code or a fuller address.";
  } catch (err) {
    destError.value = err.message;
  } finally {
    destLocating.value = false;
  }
}

function clearDestination() {
  destination.value = null;
  destQuery.value = "";
  destError.value = "";
}

const grade = ref(saved.grade || "regular");
const RADIUS_OPTIONS = [5, 10, 15, 25, 50];
const radiusMiles = ref(RADIUS_OPTIONS.includes(saved.radiusMiles) ? saved.radiusMiles : 10);
const roundTrip = ref(saved.roundTrip ?? true);
const corridorMiles = ref(saved.corridorMiles || 3);

const stations = ref([]);
const searching = ref(false);
const loadingMore = ref(false);
const searchError = ref("");
const manualPrices = ref({});
const pickerKey = ref(0);
let searchId = 0;

const lastSearchLive = ref(false);
const liveSearchesLeft = ref(Math.max(0, DAILY_LIVE_SEARCHES - usesToday()));

async function runSearch() {
  if (!origin.value) return;
  const id = ++searchId;
  const live = livePricesOn && usesToday() < DAILY_LIVE_SEARCHES;
  if (live) liveSearchesLeft.value = Math.max(0, DAILY_LIVE_SEARCHES - recordUse());
  lastSearchLive.value = live;
  const search = live ? liveSearch : freeSearch;
  searching.value = true;
  searchError.value = "";
  try {
    loadingMore.value = false;
    const showFirst = (list) => {
      if (id !== searchId) return;
      stations.value = list;
      searching.value = false;
      loadingMore.value = true;
    };
    const found = destination.value
      ? await search.findStationsAlongRoute(origin.value, destination.value, corridorMiles.value, {
          onPartial: showFirst,
        })
      : await search.findStations(origin.value, radiusMiles.value, { onPartial: showFirst });
    if (id === searchId) stations.value = found;
  } catch {
    if (id === searchId) searchError.value = "Station search isn't responding right now.";
  } finally {
    if (id === searchId) {
      searching.value = false;
      loadingMore.value = false;
    }
  }
}

watch([origin, destination, radiusMiles, corridorMiles], runSearch);

const hasSavedState = computed(() => Boolean(vehicle.value || mpg.value || tankGallons.value || origin.value));

async function startOver() {
  searchId++;
  vehicle.value = null;
  variant.value = null;
  mpg.value = null;
  tankGallons.value = null;
  tankIsEstimate.value = false;
  tankPercent.value = 25;
  grade.value = "regular";
  radiusMiles.value = 10;
  roundTrip.value = true;
  corridorMiles.value = 3;
  origin.value = null;
  placeQuery.value = "";
  locationError.value = "";
  clearDestination();
  stations.value = [];
  searching.value = false;
  loadingMore.value = false;
  searchError.value = "";
  manualPrices.value = {};
  resetRoads();
  pickerKey.value++;
  // The settings watcher re-saves the defaults on this tick; clear after it runs.
  await nextTick();
  clearSettings();
}

const anyLivePrices = computed(() => stations.value.some((s) => Object.keys(s.prices).length));

function setPrice(stationId, price) {
  const forStation = { ...(manualPrices.value[stationId] || {}), [grade.value]: { price } };
  manualPrices.value = { ...manualPrices.value, [stationId]: forStation };
}

const pricedStations = computed(() =>
  stations.value.map((s) =>
    manualPrices.value[s.id] ? { ...s, prices: { ...s.prices, ...manualPrices.value[s.id] } } : s
  )
);

// Measured road miles for the current start/destination. Only stations with a
// price are ranked, so only those are sent to the routing service.
const roads = ref({ tripMiles: null, legs: new Map() });
const measuring = ref(false);
const routingFailed = ref(false);
let roadsKey = "";
const inFlight = new Set();
let tripInFlight = false;

function resetRoads() {
  roadsKey = origin.value ? JSON.stringify([origin.value, destination.value]) : "";
  roads.value = { tripMiles: null, legs: new Map() };
  routingFailed.value = false;
  inFlight.clear();
  tripInFlight = false;
  measuring.value = false;
}

async function measureMissing() {
  if (!origin.value) return;
  const key = JSON.stringify([origin.value, destination.value]);
  if (key !== roadsKey) resetRoads();

  const todo = pricedStations.value.filter(
    (s) => s.prices[grade.value]?.price > 0 && !roads.value.legs.has(s.id) && !inFlight.has(s.id)
  );
  const needTrip =
    Boolean(destination.value) && roads.value.tripMiles == null && !tripInFlight && !routingFailed.value;
  if (!todo.length && !needTrip) return;

  todo.forEach((s) => inFlight.add(s.id));
  if (needTrip) tripInFlight = true;
  measuring.value = true;
  let result = null;
  try {
    result = await measureRoads(lastSearchLive.value ? liveRouter : freeRouter, {
      origin: origin.value,
      destination: destination.value,
      stations: todo,
      tripMiles: roads.value.tripMiles,
    });
  } catch {
    routingFailed.value = true;
  }
  if (key !== roadsKey) return;

  const legs = new Map(roads.value.legs);
  // Failed stations are recorded too (as unmeasured) so they aren't retried in a loop.
  for (const s of todo) legs.set(s.id, result?.legs.get(s.id) || { fromOrigin: null, toDestination: null });
  roads.value = { tripMiles: result?.tripMiles ?? roads.value.tripMiles, legs };
  todo.forEach((s) => inFlight.delete(s.id));
  if (needTrip) tripInFlight = false;
  measuring.value = inFlight.size > 0 || tripInFlight;
}

watch([pricedStations, grade, origin, destination], measureMissing);

const plan = computed(() =>
  planFillUp({
    vehicle: { mpg: mpg.value, tankGallons: tankGallons.value },
    tankPercent: tankPercent.value,
    origin: origin.value,
    destination: destination.value,
    grade: grade.value,
    roundTrip: roundTrip.value,
    roads: roads.value,
    stations: pricedStations.value,
  })
);

watch(
  () => ({
    vehicleId: vehicle.value?.id,
    variantId: variant.value?.id,
    mpg: mpg.value,
    tankGallons: tankGallons.value,
    tankIsEstimate: tankIsEstimate.value,
    tankPercent: tankPercent.value,
    grade: grade.value,
    radiusMiles: radiusMiles.value,
    roundTrip: roundTrip.value,
    corridorMiles: corridorMiles.value,
  }),
  saveSettings
);
</script>

<style scoped>
.gf-steps {
  display: grid;
  gap: 16px;
}

.gf-step h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 18px;
  font-size: 1.375rem;
  font-weight: 600;
}

.gf-reset {
  margin-left: auto;
  font-family: var(--font-sans);
}

.gf-num {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--gradient);
  color: #1b1830;
  font-size: 0.9375rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-muted);
}

.field input,
.field select,
.gf-zip input {
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  color: var(--text);
  font: inherit;
  font-size: 0.9375rem;
}

.gf-car {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.gf-car-name {
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: 1.125rem;
  color: var(--text);
}

.gf-variant {
  max-width: 560px;
  margin-bottom: 8px;
}

.gf-variant select {
  width: 100%;
}

.gf-variant-one,
.gf-variant-mpg {
  margin: 0 0 14px;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.gf-variant-one {
  margin-bottom: 4px;
  color: var(--text-soft);
}

.gf-car-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 200px));
  gap: 12px;
}

.gf-gauge {
  display: block;
  margin-top: 20px;
  max-width: 412px;
}

.gf-gauge-label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-soft);
  font-size: 0.9375rem;
}

.gf-gauge input {
  width: 100%;
  accent-color: var(--mauve);
}

.gf-gauge-ends {
  display: flex;
  justify-content: space-between;
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.gf-loc {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.gf-or {
  color: var(--text-faint);
  font-size: 0.875rem;
}

.gf-zip {
  display: flex;
  flex: 1 1 260px;
  gap: 8px;
}

.gf-zip input {
  flex: 1;
  min-width: 0;
}

.gf-origin {
  margin: 12px 0 0;
  color: var(--text-muted);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
}

.gf-dest {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.gf-dest-label {
  margin: 0 0 10px;
  color: var(--text-muted);
  font-size: 0.9375rem;
}

.gf-dest-label b {
  color: var(--text);
}

.gf-options {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px 16px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}

.gf-options .field {
  min-width: 150px;
}

.gf-check {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  color: var(--text-soft);
  font-size: 0.9375rem;
  cursor: pointer;
}

.gf-check input {
  width: 18px;
  height: 18px;
  accent-color: var(--mauve);
}

.gf-measuring {
  margin-bottom: 12px !important;
  font-size: 0.875rem;
}

.gf-hint,
.gf-note {
  margin: 0;
  color: var(--text-muted);
}

.gf-note {
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: var(--bg-deep);
  font-size: 0.875rem;
}

.gf-retry {
  margin-left: 8px;
}

.gf-credits {
  margin: 20px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  color: var(--text-faint);
  font-size: 0.75rem;
}

.gf-credits a {
  color: var(--text-muted);
}

.gf-error {
  margin: 12px 0 0;
  color: #ef8f8f;
  font-size: 0.875rem;
}

.gf-how {
  padding-block: clamp(40px, 7vw, 72px) 0;
}

.gf-how h2 {
  margin: 0 0 14px;
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  font-weight: 600;
}

.gf-how p {
  max-width: 760px;
  margin: 0 0 1em;
  color: var(--text-muted);
}

.gf-faq h3 {
  margin: 20px 0 6px;
  font-size: 1.0625rem;
  font-weight: 600;
}

@media (max-width: 560px) {
  .gf-car-fields {
    grid-template-columns: 1fr 1fr;
  }

  .gf-options .field {
    flex: 1 1 calc(50% - 8px);
    min-width: 0;
  }
}
</style>
