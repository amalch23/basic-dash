// Export CSV des commandes affichées.

import { STATUSES } from "./data.js";
import { formatDate } from "./format.js";

// Met une cellule entre guillemets si besoin.
const csvCell = (value) => {
  const text = String(value);
  return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function exportCSV(orders) {
  const header = ["N°", "Date", "Cliente", "Produit", "Catégorie", "Montant (DT)", "Statut"];
  const rows = orders.map((o) => [
    `#${o.id}`, formatDate(o.date), o.customer, o.product, o.category, o.amount, STATUSES[o.status].label
  ]);

  // ";" = séparateur d'Excel en français ; "\uFEFF" = accents bien affichés.
  const csv = "\uFEFF" + [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n");

  // Pour télécharger le fichier : on crée un lien vers le CSV, puis on clique dessus avec le code.
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = "commandes-boutique-demo.csv";
  link.click();
  URL.revokeObjectURL(link.href); // libère la mémoire
}
