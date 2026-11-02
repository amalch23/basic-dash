// Simule l'arrivée de nouvelles commandes (pas de vrai serveur).

// Élément au hasard dans une liste.
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Taille maximale du tableau.
const MAX_ORDERS = 200;

// Modifie les données en mémoire et renvoie le n° de la nouvelle commande.
export function simulateActivity(dashboard, orders) {
  // Une commande en cours est parfois livrée.
  const pending = orders.filter((o) => o.status === "pending");
  if (pending.length && Math.random() < 0.5) pick(pending).status = "delivered";

  // Nouvelle commande au hasard.
  const item = pick(dashboard.catalog);
  const order = {
    id: Math.max(...orders.map((o) => o.id)) + 1,
    date: orders.reduce((latest, o) => (o.date > latest ? o.date : latest), ""),
    customer: pick(dashboard.customers),
    product: item.product,
    category: item.category,
    amount: item.price,
    status: "pending"
  };
  orders.unshift(order); // en haut de la liste
  if (orders.length > MAX_ORDERS) orders.length = MAX_ORDERS;

  // Mise à jour des ventes et des compteurs.
  dashboard.months[dashboard.months.length - 1].sales += item.price;
  dashboard.categories.find((c) => c.name === item.category).sales += item.price;
  dashboard.kpis.orders += 1;
  if (Math.random() < 0.3) dashboard.kpis.customers += 1;

  return order.id;
}
