// Point d'entrée : charge les données et relie les modules.

import { loadData } from "./data.js";
import { updateKpis } from "./stats.js";
import { createCharts, updateCharts, highlightFilters } from "./charts.js";
import { initTable, renderTable, visibleRows, filterByCategory, filterByMonth } from "./table.js";
import { exportCSV } from "./export.js";
import { simulateActivity } from "./simulation.js";
import { startAutoRefresh } from "./refresh.js";

// 5 secondes
const REFRESH_DELAY = 5000;

function showError(message) {
  const box = document.getElementById("load-error");
  box.textContent = message;
  box.hidden = false;
}

async function start() {
  // Chart.js absent = pas de connexion Internet.
  if (typeof Chart === "undefined") {
    showError("La bibliothèque de graphiques (Chart.js) n'a pas pu être chargée. Vérifiez la connexion Internet puis rechargez la page.");
    return;
  }

  try {
    const { dashboard, orders } = await loadData();

    updateKpis(dashboard);
    // Clic sur un graphique = filtre du tableau, et inversement.
    createCharts(dashboard, filterByMonth, filterByCategory);
    initTable(
      orders,
      dashboard.categories.map((c) => c.name),
      dashboard.months.map((m) => m.name),
      highlightFilters
    );

    document.getElementById("export-csv").addEventListener("click", () => exportCSV(visibleRows()));

    // Toutes les 5 s : nouvelle commande, puis mise à jour de l'affichage.
    startAutoRefresh(() => {
      const newId = simulateActivity(dashboard, orders);
      updateKpis(dashboard);
      updateCharts(dashboard);
      renderTable(newId);
    }, REFRESH_DELAY);
  } catch (error) {
    // Souvent : page ouverte sans serveur local.
    showError("Les données n'ont pas pu être chargées. Ouvrez la page avec un serveur local (par exemple Live Server).");
  }
}

start();
