// Cartes d'indicateurs et évolution par rapport à 2025.

import { formatDT, formatNumber, formatDecimal } from "./format.js";

// Remplit une carte : valeur et tendance.
function writeCard(name, value, change, unit) {
  const card = document.querySelector(`[data-kpi="${name}"]`);
  const trend = card.querySelector(".trend");
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const arrow = { up: "▲", down: "▼", flat: "=" }[direction];

  card.querySelector(".value").textContent = value;
  trend.className = `trend ${direction}`; // couleur : vert, rose ou gris
  trend.textContent = `${arrow} ${formatDecimal(Math.abs(change))} ${unit} vs 2025`;
}

// Évolution en %.
const percentChange = (current, previous) => ((current - previous) / previous) * 100;

// Recalcule les quatre cartes.
export function updateKpis(dashboard) {
  const { kpis, reference2025: ref } = dashboard;
  // Chiffre d'affaires = somme des ventes mensuelles.
  const revenue = dashboard.months.reduce((sum, m) => sum + m.sales, 0);

  writeCard("revenue", formatDT(revenue), percentChange(revenue, ref.revenue), "%");
  writeCard("orders", formatNumber(kpis.orders), percentChange(kpis.orders, ref.orders), "%");
  writeCard("customers", formatNumber(kpis.customers), percentChange(kpis.customers, ref.customers), "%");
  // Déjà en % : évolution en points (pt).
  writeCard("conversion", `${formatDecimal(kpis.conversion)} %`, kpis.conversion - ref.conversion, "pt");
}
