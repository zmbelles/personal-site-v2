/** Browser-only parts of the gas finder; a native app replaces this file. */

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("This browser can't share your location. Search by ZIP code instead."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: "Your location" }),
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? "Location access was blocked. Search by ZIP code instead."
              : "Couldn't get your location. Search by ZIP code instead."
          )
        ),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 }
    );
  });
}

const STORAGE_KEY = "gas-finder-v1";

// localStorage can throw (private mode, blocked storage), so settings are best-effort.
export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function clearSettings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* not fatal */
  }
}

// Live-price searches used today on this device. A courtesy limit only: it's
// per browser, so clearing site data or switching browsers resets it.
const USAGE_KEY = "gas-finder-usage-v1";
const today = () => new Date().toLocaleDateString("en-CA");

export function usesToday() {
  try {
    const usage = JSON.parse(localStorage.getItem(USAGE_KEY));
    return usage?.date === today() ? usage.count : 0;
  } catch {
    return 0;
  }
}

export function recordUse() {
  const count = usesToday() + 1;
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today(), count }));
  } catch {
    /* not fatal */
  }
  return count;
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* not fatal */
  }
}
