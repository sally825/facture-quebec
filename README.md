# Facture Québec

Outil simple de facturation et suivi de dépenses pour freelances et travailleurs autonomes du Québec.

## Fonctionnalités (MVP)

- Création de factures avec calcul automatique de la **TPS (5 %)** et de la **TVQ (9,975 %)**
- Gestion des clients
- Suivi des dépenses par catégorie
- Tableau de bord (revenus, à encaisser, dépenses, bénéfice)
- Aperçu de facture
- Données stockées localement dans le navigateur (localStorage)

## Stack

- React + TypeScript + Vite
- Tailwind CSS

## Développement local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Déploiement

Prêt pour Netlify (build command: `npm run build`, publish directory: `dist`).
