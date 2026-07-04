# Tennis Stats API

## Prérequis

- Node.js ≥ 20
- npm

## Installation

```bash
npm install
```

## Lancer en local

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000` (ou le port défini via la variable d'environnement `PORT`).

## Build & production

```bash
npm run build
npm run start
```

## Tests

```bash
npm test          # lance toute la suite une fois
npm run test:watch # mode watch
```

## Endpoints

| Méthode | Route          | Description                                                         |
|---------|----------------|---------------------------------------------------------------------|
| GET     | `/players`     | Liste des joueurs, triée du meilleur au moins bon (rank croissant)  |
| GET     | `/players/:id` | Détail d'un joueur par son id                                       |
| GET     | `/stats`       | Pays au meilleur ratio de victoires, IMC moyen, médiane des tailles |
| POST    | `/players`     | Ajoute un nouveau joueur                                            |

---

## Paradigme de programmation

Le code est écrit en **programmation fonctionnelle** : fonctions pures, immutabilité, pas de classes ni d'état mutable
partagé. Concrètement :

- Toutes les fonctions du domaine (`sortByRank`, `createPlayer`, calculs de stats...) sont pures — même entrée, même
  sortie, aucun effet de bord.
- Aucune mutation directe des structures de données : les objets sont typés `Readonly`, et toute transformation (tri,
  ajout, mise à jour) retourne une nouvelle valeur plutôt que de modifier l'existante.
- Les erreurs métier ne sont jamais levées (`throw`) — elles sont retournées explicitement via un **Result pattern**, ce
  qui rend chaque cas d'échec visible dans la signature de la fonction plutôt que caché dans un flux d'exceptions.
- Les dépendances (repository, handlers) sont injectées par closure (factories) plutôt que par classes/héritage — pas de
  `this`, pas d'état interne caché.

Ce choix vise une meilleure prévisibilité et testabilité : chaque fonction peut être testée isolément, sans setup
complexe ni risque d'effet de bord entre les tests.

## Choix d'architecture

Le projet suit une **architecture hexagonale** (ports & adapters), organisée en trois couches :

- **`domain/`** — logique métier pure (types, règles, calculs). Aucune dépendance externe, aucun I/O. C'est le cœur de
  l'application.
- **`application/`** — les *use cases* (handlers), qui orchestrent le domaine et les ports (repository), sans connaître
  Express ni aucun détail d'infrastructure.
- **`infrastructure/`** — les adapters concrets : serveur Express, controllers, repository in-memory, container
  d'injection de dépendances.

Les erreurs métier prévisibles (joueur introuvable, aucun joueur, règle métier violée) sont modélisées via un **Result
pattern** (`Result<Error, Value>`) plutôt que des exceptions — ça force à traiter explicitement chaque cas d'échec côté
appelant, et ça garde le domaine 100% pur (pas de `throw`).

L'injection de dépendances passe par un **container** (`dependencies.container.ts`) qui construit et lie repository →
handlers → controllers au démarrage. Ça permet de tester chaque couche isolément (handlers avec un faux repository,
controllers avec un faux handler) sans jamais mocker de module.

## Stratégie de tests

- **Tests unitaires** sur le domaine/handlers — tests des règles métiers
- **Tests d'intégration côté gauche (HTTP)** — les controllers testés via `supertest`, avec l'app construite par
  `createApp(dependencies)` et un handler mocké injecté (pas de vrai repository, pas de `vi.mock`).
- **Tests d'intégration côté droit (repository)** — le repository in-memory testé en boîte noire contre les vraies
  données, sans connaître les détails du mapping interne.

## Validation des entrées

Double couche de validation, avec des responsabilités bien séparées :

- **Zod**, au niveau HTTP (middleware), valide la **forme** du payload entrant : types, présence des champs, structure
  de `last`. Il ne connaît aucune règle métier.
- **Le domaine** (`createPlayer`) valide les **invariants métier** : `weight > 0`, `height > 0`, `age > 0`, `rank > 0`,
  `points >= 0`. Il ne revalide jamais la forme (déjà garantie par Zod en amont).

Un payload malformé est rejeté en `400 InvalidRequestBody` avant même d'atteindre le use case ; une règle métier violée
est rejetée en `400 PlayerAddingError` avec le détail des champs en tort.

## Sécurité

Pas d'authentification sur cette API — hors périmètre de l'exercice. Un middleware de **rate limiting** (
`express-rate-limit`) est en place pour limiter l'abus depuis une même IP (protection basique)