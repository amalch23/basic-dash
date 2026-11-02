// Chargement des données depuis les fichiers JSON.

// Statuts d'une commande : texte affiché et couleur du badge.
export const STATUSES = {
  delivered: { label: "Livrée", badge: "ok" },
  pending: { label: "En cours", badge: "wait" },
  cancelled: { label: "Annulée", badge: "ko" }
};

// Lit un fichier JSON avec fetch.
async function readJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Cannot read ${path} (${response.status})`);
  return response.json();
}

// Charge les deux fichiers en même temps.
export async function loadData() {
  const [dashboard, orders] = await Promise.all([
    readJSON("data/dashboard.json"),
    readJSON("data/orders.json")
  ]);
  return { dashboard, orders };
}
