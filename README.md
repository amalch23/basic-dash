# Tableau de Bord interactif - Boutique Demo

Mini-projet Web, sujet n° 3 : **Tableau de bord (dashboard)**.

La partie 1 était un tableau de bord statique en HTML5 / CSS3. Cette partie 2 le rend interactif avec JavaScript : données chargées depuis des fichiers JSON, graphiques Chart.js, tableau triable et filtrable, actualisation automatique et préférences mémorisées.

Thème : une boutique en ligne de vêtements pour jeunes femmes. Toutes les données (ventes, commandes, clientes) sont fictives.

## Fonctionnalités

### Obligatoires

- **Tri, filtrage et mise à jour dynamique du tableau** : tri par colonne (clic sur le titre), recherche (n°, cliente, produit), filtres par statut, catégorie et mois.
- **Graphiques interactifs (Chart.js)** : infobulles au survol ; un clic sur une barre filtre le tableau sur ce mois, un clic sur une part de l'anneau filtre sur cette catégorie.
- **Actualisation automatique** : toutes les 5 secondes (`setInterval`), une nouvelle commande est simulée, puis les indicateurs, les graphiques et le tableau se mettent à jour. Un bouton dans l'en-tête permet de mettre l'actualisation en pause et de la reprendre.
- **Sauvegarde des préférences avec `localStorage`** : tri, filtres et recherche sont retrouvés au rechargement de la page.

### Bonus

- **Plusieurs types de graphiques** : histogramme (ventes mensuelles) et anneau (ventes par catégorie).
- **Export CSV** des commandes affichées (après tri et filtres), lisible directement dans Excel.

### Autres

- Design responsive (mobile, tablette, desktop) repris de la partie 1.
- Page utilisable au clavier (touche Tab).

## Lancer le projet

Les modules JavaScript et `fetch` ne fonctionnent pas en ouvrant `index.html` par double-clic (`file://`). Il faut un serveur local :

1. Ouvrir le dossier `interactive` dans VS Code ou Cursor.
2. Installer l'extension **Live Server** (Ritwick Dey).
3. Clic droit sur `index.html` puis **Open with Live Server**.

Une connexion Internet est nécessaire pour charger Chart.js depuis le CDN.

## Structure

```
interactive/
├── index.html          structure de la page
├── style.css           mise en forme et responsive
├── images/
│   └── logo.svg        logo de la boutique
├── data/
│   ├── dashboard.json  indicateurs, ventes mensuelles, catégories, catalogue
│   └── orders.json     liste des commandes
└── js/
    ├── main.js         point d'entrée : relie les modules
    ├── data.js         chargement des fichiers JSON (fetch)
    ├── stats.js        cartes d'indicateurs
    ├── charts.js       graphiques Chart.js
    ├── table.js        tableau : tri, filtres, recherche
    ├── storage.js      préférences dans localStorage
    ├── simulation.js   simulation des nouvelles commandes
    ├── refresh.js      actualisation automatique (setInterval)
    ├── export.js       export CSV
    └── format.js       mise en forme des nombres et des dates
```

## Technologies

- HTML5, CSS3 (Grid, variables CSS, media queries)
- JavaScript (modules ES, DOM, `fetch`, `localStorage`, `setInterval`)
- [Chart.js 4.4.1](https://www.chartjs.org/) (bibliothèque de graphiques, chargée depuis le CDN jsDelivr)

## Qualité

- HTML validé avec le validateur W3C (validator.w3.org) : aucune erreur.
- CSS validé avec le validateur W3C (jigsaw.w3.org) : aucune erreur.
- Audit Lighthouse réalisé : aucune erreur.
