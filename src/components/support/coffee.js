/**
 * The "buy me a coffee" ask that the free tools show before handing over a file.
 *
 * Two rules keep it from turning into a nag:
 *  - it appears once per browser session, across the whole site, not once per
 *    download and not once per tool;
 *  - once someone actually clicks through to Buy Me a Coffee it goes quiet for
 *    QUIET_DAYS, because there is nothing ruder than asking a supporter again.
 *
 * The download always happens either way. These pages promise "free, no
 * sign-up" and holding the file hostage would make that a lie.
 */

export const COFFEE_URL = "https://www.buymeacoffee.com/zmbelles";

/** Change this to 0 to ask on every download, or raise it to ask less often. */
const QUIET_DAYS = 90;

const ASKED_KEY = "tng.coffee.asked";
const QUIET_KEY = "tng.coffee.quietUntil";
const NEVER_KEY = "tng.coffee.never";

// Storage is blocked outright in some privacy modes, and a thrown exception
// here must never stop someone getting their file, so every read fails to
// "do not ask" and every write fails silently.
function read(store, key) {
  try {
    return window[store].getItem(key);
  } catch {
    return null;
  }
}

function write(store, key, value) {
  try {
    window[store].setItem(key, value);
  } catch {
    // Nothing to do: the ask just reappears next session.
  }
}

export function shouldAsk() {
  // They asked to be left alone. That answer outlives the session.
  if (read("localStorage", NEVER_KEY)) return false;

  if (read("sessionStorage", ASKED_KEY)) return false;

  const quietUntil = Number(read("localStorage", QUIET_KEY) || 0);
  if (quietUntil && Date.now() < quietUntil) return false;

  return true;
}

/** Called as the dialog opens, so one session only ever sees it once. */
export function markAsked() {
  write("sessionStorage", ASKED_KEY, "1");
}

/** Called when someone takes us up on it. */
export function markSupported() {
  write("localStorage", QUIET_KEY, String(Date.now() + QUIET_DAYS * 864e5));
}

/**
 * Called when someone picks "Don't ask again". Unlike the other two this has
 * no expiry; the only way back is clearing site data, which is the right
 * trade for a prompt nobody is obliged to see.
 */
export function markNeverAsk() {
  write("localStorage", NEVER_KEY, "1");
}
