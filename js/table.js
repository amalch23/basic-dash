// Tableau des commandes : tri, filtres et recherche.

import { STATUSES } from "./data.js";
import { formatDT, formatDate } from "./format.js";
import { readPreferences, savePreferences } from "./storage.js";

const tbody = document.querySelector("#commandes tbody");
const headers = [...document.querySelectorAll("#commandes th[data-key]")];
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("status-filter");
const categoryFilter = document.getElementById("category-filter");
const monthFilter = document.getElementById("month-filter");
const counter = document.getElementById("row-count");

// Par défaut : plus récentes en premier, aucun filtre.
const DEFAULTS = { key: "id", direction: "desc", status: "all", category: "all", month: "all", search: "" };
let prefs = { ...DEFAULTS, ...readPreferences() };
let orders = [];
let onFiltersChange = () => {}; // prévient les graphiques

// Le statut est trié sur son texte affiché.
const sortValue = (o, key) => (key === "status" ? STATUSES[o.status].label : o[key]);

// Compare deux commandes pour le tri.
function compare(a, b) {
  const va = sortValue(a, prefs.key);
  const vb = sortValue(b, prefs.key);
  const order = typeof va === "number" ? va - vb : va.localeCompare(vb, "fr");
  return prefs.direction === "asc" ? order : -order;
}

// Commandes filtrées et triées (aussi pour l'export CSV).
export function visibleRows() {
  const text = prefs.search.trim().toLowerCase();
  return orders
    .filter((o) => prefs.status === "all" || o.status === prefs.status)
    .filter((o) => prefs.category === "all" || o.category === prefs.category)
    .filter((o) => prefs.month === "all" || o.date.slice(5, 7) === prefs.month) // mois de la date
    .filter((o) => !text || `#${o.id} ${o.customer} ${o.product}`.toLowerCase().includes(text))
    .sort(compare);
}

// Une ligne du tableau ; la nouvelle commande est surlignée.
function rowHTML(o, highlightId) {
  const status = STATUSES[o.status];
  return `<tr${o.id === highlightId ? ' class="new-row"' : ""}>
    <td>#${o.id}</td><td>${formatDate(o.date)}</td><td>${o.customer}</td>
    <td>${o.product}</td><td>${formatDT(o.amount)}</td>
    <td><span class="badge ${status.badge}">${status.label}</span></td>
  </tr>`;
}

// Affiche le tableau et le nombre de lignes.
export function renderTable(highlightId = null) {
  const rows = visibleRows();
  tbody.innerHTML = rows.length
    ? rows.map((o) => rowHTML(o, highlightId)).join("")
    : '<tr><td colspan="6" class="empty">Aucune commande ne correspond aux filtres.</td></tr>';
  counter.textContent = `${rows.length} commande${rows.length > 1 ? "s" : ""} sur ${orders.length}`;

  // Flèche ▲ / ▼ sur la colonne triée.
  headers.forEach((th) => {
    const sorted = th.dataset.key === prefs.key;
    th.setAttribute("aria-sort", sorted ? (prefs.direction === "asc" ? "ascending" : "descending") : "none");
  });
}

// Change une préférence : sauvegarde et nouvel affichage.
function update(changes) {
  prefs = { ...prefs, ...changes };
  savePreferences(prefs);
  renderTable();
  onFiltersChange(prefs);
}

// Préférence enregistrée invalide = valeur par défaut.
function validatePreferences() {
  const isOption = (select, value) => [...select.options].some((option) => option.value === value);
  const checks = {
    key: headers.some((th) => th.dataset.key === prefs.key),
    direction: prefs.direction === "asc" || prefs.direction === "desc",
    status: isOption(statusFilter, prefs.status),
    category: isOption(categoryFilter, prefs.category),
    month: isOption(monthFilter, prefs.month),
    search: typeof prefs.search === "string"
  };
  for (const [name, valid] of Object.entries(checks)) {
    if (!valid) prefs[name] = DEFAULTS[name];
  }
}

// Affiche les préférences dans les champs.
function syncInputs() {
  searchInput.value = prefs.search;
  statusFilter.value = prefs.status;
  categoryFilter.value = prefs.category;
  monthFilter.value = prefs.month;
}

// Clic sur une part : filtre (2e clic = retire le filtre).
export function filterByCategory(name) {
  update({ category: prefs.category === name ? "all" : name });
  syncInputs();
}

// Clic sur une barre : filtre (2e clic = retire le filtre).
export function filterByMonth(month) {
  update({ month: prefs.month === month ? "all" : month });
  syncInputs();
}

// Prépare le tableau : listes, préférences et événements.
export function initTable(list, categories, monthNames, filtersChanged) {
  orders = list;
  onFiltersChange = filtersChanged;
  categoryFilter.insertAdjacentHTML("beforeend", categories.map((name) => `<option>${name}</option>`).join(""));
  monthFilter.insertAdjacentHTML("beforeend", monthNames
    .map((name, i) => `<option value="${String(i + 1).padStart(2, "0")}">${name}</option>`).join(""));
  validatePreferences();
  syncInputs();

  // Clic sur un titre : tri croissant, puis décroissant.
  headers.forEach((th) => {
    th.querySelector("button").addEventListener("click", () => {
      const key = th.dataset.key;
      const direction = prefs.key === key && prefs.direction === "asc" ? "desc" : "asc";
      update({ key, direction });
    });
  });

  searchInput.addEventListener("input", () => update({ search: searchInput.value }));
  statusFilter.addEventListener("change", () => update({ status: statusFilter.value }));
  categoryFilter.addEventListener("change", () => update({ category: categoryFilter.value }));
  monthFilter.addEventListener("change", () => update({ month: monthFilter.value }));
  document.getElementById("reset-filters").addEventListener("click", () => {
    update(DEFAULTS);
    syncInputs();
  });

  renderTable();
  onFiltersChange(prefs); // les graphiques montrent les filtres restaurés
}
