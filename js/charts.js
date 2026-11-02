// Graphiques Chart.js : histogramme des ventes et anneau des catégories.

import { formatDT, formatDecimal } from "./format.js";

// Couleurs pastel de la partie 1 (a = foncée, m = moyenne, b = claire).
const TONES = {
  good: { a: "#9cc496", m: "#b3d2ae", b: "#cfe4cb" },
  neutral: { a: "#98a2e0", m: "#b0b8e8", b: "#c9cef1" },
  bad: { a: "#eaa3bc", m: "#f0bccf", b: "#f7d6e0" }
};

// Mois au-dessus de la moyenne = vert, en dessous = rose.
function monthTone(value, average) {
  if (value > average * 1.1) return "good";
  if (value < average * 0.9) return "bad";
  return "neutral";
}

// Grande part = vert, petite part = rose.
function categoryTone(share, count) {
  const equal = 100 / count;
  if (share > equal * 1.2) return "good";
  if (share < equal * 0.6) return "bad";
  return "neutral";
}

// Valeurs -> pourcentages du total.
const shares = (values) => {
  const total = values.reduce((s, v) => s + v, 0);
  return values.map((v) => (v / total) * 100);
};

// 0 -> "01" (janvier).
const monthKey = (index) => String(index + 1).padStart(2, "0");

// Curseur main au survol d'un élément cliquable.
const pointerCursor = (event, elements) => {
  event.native.target.style.cursor = elements.length ? "pointer" : "default";
};

let barChart = null;
let donutChart = null;

// Police, couleurs et animations des graphiques.
function globalSettings() {
  Chart.defaults.font.family = '"Segoe UI", Arial, sans-serif';
  Chart.defaults.color = "#9496b0";
  Chart.defaults.plugins.tooltip.backgroundColor = "#5c6094";
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) Chart.defaults.animation = false;
}

// Couleur d'une barre : dégradé selon le mois.
function barColor(context) {
  const { chart, dataIndex } = context;
  const values = chart.data.datasets[0].data;
  const average = values.reduce((s, v) => s + v, 0) / values.length;
  const tone = TONES[monthTone(values[dataIndex], average)];
  const area = chart.chartArea;
  if (!area) return tone.a; // graphique pas encore dessiné

  const gradient = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, tone.a);
  gradient.addColorStop(1, tone.b);
  return gradient;
}

function createBarChart(dashboard, onMonthClick) {
  barChart = new Chart(document.getElementById("sales-chart"), {
    type: "bar",
    data: {
      labels: dashboard.months.map((m) => m.short),
      datasets: [{
        label: "Ventes (milliers de DT)",
        data: dashboard.months.map((m) => m.sales / 1000),
        backgroundColor: barColor,
        borderColor: "#5c6094", // contour du mois filtré
        borderRadius: { topLeft: 6, topRight: 6 },
        borderSkipped: "bottom"
      }]
    },
    options: {
      maintainAspectRatio: false, // hauteur fixée en CSS
      onClick: (event, elements) => {
        if (elements.length) onMonthClick(monthKey(elements[0].index));
      },
      onHover: pointerCursor,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: (items) => dashboard.months[items[0].dataIndex].name,
            label: (item) => formatDT(dashboard.months[item.dataIndex].sales)
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: "#efecf6" }, border: { display: false } }
      }
    }
  });
}

// Fait ressortir une part (null = aucune).
function highlightSlice(index) {
  const active = index === null ? [] : [{ datasetIndex: 0, index }];
  donutChart.setActiveElements(active);
  donutChart.tooltip.setActiveElements(active, { x: 0, y: 0 });
  donutChart.update();
}

// Légende : un bouton par catégorie (clic = masquer la part).
function createLegend(dashboard) {
  const legend = document.getElementById("category-legend");
  legend.innerHTML = dashboard.categories.map((c, i) => `
    <li><button type="button" aria-pressed="true">
      <i class="dot c${i + 1}"></i>${c.name} <b></b>
    </button></li>`).join("");

  legend.querySelectorAll("button").forEach((button, i) => {
    button.addEventListener("click", () => {
      donutChart.toggleDataVisibility(i);
      donutChart.update();
      button.setAttribute("aria-pressed", String(donutChart.getDataVisibility(i)));
    });
    button.addEventListener("mouseenter", () => highlightSlice(i));
    button.addEventListener("focus", () => highlightSlice(i));
    button.addEventListener("mouseleave", () => highlightSlice(null));
    button.addEventListener("blur", () => highlightSlice(null));
  });
}

// Couleurs et pourcentages des catégories.
function updateCategoryColors(dashboard) {
  const parts = shares(dashboard.categories.map((c) => c.sales));
  const tones = parts.map((p) => categoryTone(p, parts.length));
  // une part sur deux plus claire, pour les distinguer
  donutChart.data.datasets[0].backgroundColor = tones.map((t, i) => TONES[t][i % 2 ? "m" : "a"]);

  document.querySelectorAll("#category-legend li").forEach((li, i) => {
    li.querySelector(".dot").dataset.tone = tones[i];
    li.querySelector("b").textContent = `${Math.round(parts[i])} %`;
  });
}

function createDonutChart(dashboard, onCategoryClick) {
  donutChart = new Chart(document.getElementById("category-chart"), {
    type: "doughnut",
    data: {
      labels: dashboard.categories.map((c) => c.name),
      datasets: [{
        data: dashboard.categories.map((c) => c.sales),
        borderColor: "#ffffff", // trait blanc entre les parts
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      cutout: "62%", // trou central
      maintainAspectRatio: false,
      layout: { padding: 16 },
      onClick: (event, elements) => {
        if (elements.length) onCategoryClick(dashboard.categories[elements[0].index].name);
      },
      onHover: pointerCursor,
      plugins: {
        legend: { display: false }, // on utilise notre légende HTML
        tooltip: {
          callbacks: {
            label: (item) => {
              const share = shares(item.dataset.data)[item.dataIndex];
              return ` ${formatDecimal(share)} % (${formatDT(item.raw)})`;
            }
          }
        }
      }
    }
  });
  createLegend(dashboard);
  updateCategoryColors(dashboard);
  donutChart.update();
}

// Crée les deux graphiques et leurs actions au clic.
export function createCharts(dashboard, onMonthClick, onCategoryClick) {
  globalSettings();
  createBarChart(dashboard, onMonthClick);
  createDonutChart(dashboard, onCategoryClick);
}

// Montre le filtre actif : barre entourée, part décalée.
export function highlightFilters({ month, category }) {
  const bars = barChart.data.datasets[0];
  bars.borderWidth = bars.data.map((v, i) => (monthKey(i) === month ? 2 : 0));
  barChart.update();

  donutChart.data.datasets[0].offset = donutChart.data.labels.map((label) => (label === category ? 14 : 0));
  donutChart.update();
}

// Met à jour les graphiques avec les nouvelles données.
export function updateCharts(dashboard) {
  barChart.data.datasets[0].data = dashboard.months.map((m) => m.sales / 1000);
  barChart.update();

  donutChart.data.datasets[0].data = dashboard.categories.map((c) => c.sales);
  updateCategoryColors(dashboard);
  donutChart.update();
}
