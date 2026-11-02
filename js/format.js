// Mise en forme à la française.

// Ex. 158 630
const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export const formatNumber = (n) => numberFormat.format(n);

// Ex. 120 DT
export const formatDT = (n) => `${formatNumber(n)} DT`;

// Ex. 9,1
export const formatDecimal = (n) => n.toFixed(1).replace(".", ",");

// "2026-10-18" -> "18/10/2026"
export const formatDate = (iso) => iso.split("-").reverse().join("/");
