// Préférences du tableau (tri, filtres) dans localStorage.

const KEY = "boutique-demo-preferences";

// try/catch : localStorage peut être bloqué.
export function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch (e) {
    return {};
  }
}

export function savePreferences(preferences) {
  try {
    localStorage.setItem(KEY, JSON.stringify(preferences));
  } catch (e) {
    console.warn("Préférences non sauvegardées : localStorage indisponible.");
  }
}
