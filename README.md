# Photography Portfolio — Full-Stack Web Application

> **🇬🇧 English** · [🇫🇷 Français](#-français)

A full-stack editorial & fashion photography portfolio with a custom content-management admin panel, built from scratch with Next.js, TypeScript, Prisma, and a serverless SQLite (Turso) database.

**🔗 Live demo:** https://veliihsanuysal-demo.vercel.app

### 🔑 Admin panel access (for reviewers)

The site includes a private admin panel for managing projects and images. You are welcome to explore it:

- **URL:** https://veliihsanuysal-demo.vercel.app/admin
- **Password:** `admin123`

> This is a **demo deployment** hosted on a free `vercel.app` domain, created specifically for portfolio review. It runs on its own isolated database and credentials, completely separate from any production site.

---

### 👤 About this project

I designed and developed this website end-to-end as the sole developer — front-end, back-end, database, authentication, and deployment. It was originally built in a separate private Git repository and later pushed to this account to share as part of my university application portfolio.

The photographs shown are used **with the photographer's permission**; the codebase and application architecture are my own work.

### 🛠️ Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Database | SQLite via [Turso / libSQL](https://turso.tech) (serverless) |
| ORM | [Prisma 7](https://www.prisma.io) with the libSQL driver adapter |
| Auth | JWT sessions (HTTP-only cookies) via [`jose`](https://github.com/panva/jose) |
| Image storage | [Vercel Blob](https://vercel.com/docs/vercel-blob) |
| Hosting | [Vercel](https://vercel.com) (CI/CD from Git) |

### ✨ Features

- **Responsive public portfolio** — a work grid, per-project gallery pages with configurable image layouts (column / wide), a contact page, and mobile navigation.
- **Custom admin CMS** — password-protected dashboard to create, edit, reorder, and delete projects and gallery images. No third-party CMS.
- **Secure authentication** — server-verified password with signed JWT session cookies (`httpOnly`, `secure`, `sameSite`).
- **Image uploads** — direct-to-cloud uploads handled through Vercel Blob.
- **RESTful API routes** — clean `/api` endpoints for auth, projects, works, uploads, and reordering.
- **Type-safe data layer** — end-to-end types from the database through Prisma to the React components.

### 🏗️ Architecture

```
src/
├── app/
│   ├── (public)/          # Public site: portfolio grid, project pages, contact
│   ├── admin/             # Password-protected admin dashboard
│   └── api/               # REST API (auth, projects, works, upload, reorder)
├── lib/                   # Prisma client + auth helpers
└── generated/prisma/      # Generated Prisma client
prisma/
├── schema.prisma          # Project + GalleryImage models
└── migrations/            # SQL migrations
```

### ▶️ Running locally

```bash
npm install
npx prisma generate
npm run dev          # http://localhost:3000
```

Local development uses a bundled SQLite file (`dev.db`); production uses Turso. Configure via `.env`:

```
DATABASE_URL="file:./dev.db"      # or a libsql:// URL in production
DATABASE_AUTH_TOKEN="..."         # Turso token (production only)
ADMIN_PASSWORD="..."              # admin panel password
JWT_SECRET="..."                  # session signing secret
```

---
---

## 🇫🇷 Français

> [🇬🇧 English](#photography-portfolio--full-stack-web-application) · **🇫🇷 Français**

Un portfolio de photographie éditoriale et de mode *full-stack*, doté d'un panneau d'administration sur mesure pour la gestion de contenu, développé entièrement avec Next.js, TypeScript, Prisma et une base de données SQLite *serverless* (Turso).

**🔗 Démo en ligne :** https://veliihsanuysal-demo.vercel.app

### 🔑 Accès au panneau d'administration (pour les évaluateurs)

Le site comprend un panneau d'administration privé permettant de gérer les projets et les images. Vous êtes invité·e à l'explorer :

- **URL :** https://veliihsanuysal-demo.vercel.app/admin
- **Mot de passe :** `admin123`

> Il s'agit d'un **déploiement de démonstration** hébergé sur un domaine gratuit `vercel.app`, créé spécifiquement pour l'évaluation de mon portfolio. Il fonctionne avec sa propre base de données et ses propres identifiants isolés, totalement distincts de tout site de production.

---

### 👤 À propos du projet

J'ai conçu et développé ce site de bout en bout en tant que seul développeur — interface, back-end, base de données, authentification et déploiement. Il a d'abord été créé dans un dépôt Git privé distinct, puis transféré vers ce compte afin de l'intégrer à mon dossier de candidature universitaire.

Les photographies présentées sont utilisées **avec l'autorisation du photographe** ; le code et l'architecture de l'application sont mon propre travail.

### 🛠️ Technologies

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Langage | TypeScript 5 |
| Interface | React 19, Tailwind CSS v4 |
| Base de données | SQLite via [Turso / libSQL](https://turso.tech) (*serverless*) |
| ORM | [Prisma 7](https://www.prisma.io) avec l'adaptateur libSQL |
| Authentification | Sessions JWT (cookies *HTTP-only*) via [`jose`](https://github.com/panva/jose) |
| Stockage d'images | [Vercel Blob](https://vercel.com/docs/vercel-blob) |
| Hébergement | [Vercel](https://vercel.com) (CI/CD depuis Git) |

### ✨ Fonctionnalités

- **Portfolio public responsive** — grille de projets, pages galerie par projet avec mises en page configurables (colonne / pleine largeur), page de contact et navigation mobile.
- **CMS d'administration sur mesure** — tableau de bord protégé par mot de passe pour créer, modifier, réordonner et supprimer projets et images. Aucun CMS tiers.
- **Authentification sécurisée** — mot de passe vérifié côté serveur avec cookies de session JWT signés (`httpOnly`, `secure`, `sameSite`).
- **Téléversement d'images** — envoi direct vers le cloud via Vercel Blob.
- **Routes API RESTful** — points d'accès `/api` clairs pour l'authentification, les projets, les œuvres, les téléversements et le réordonnancement.
- **Couche de données typée** — types de bout en bout, de la base de données jusqu'aux composants React via Prisma.

### 🏗️ Architecture

```
src/
├── app/
│   ├── (public)/          # Site public : grille du portfolio, pages projet, contact
│   ├── admin/             # Tableau de bord d'administration protégé
│   └── api/               # API REST (auth, projets, œuvres, téléversement, tri)
├── lib/                   # Client Prisma + utilitaires d'authentification
└── generated/prisma/      # Client Prisma généré
prisma/
├── schema.prisma          # Modèles Project + GalleryImage
└── migrations/            # Migrations SQL
```

### ▶️ Exécution en local

```bash
npm install
npx prisma generate
npm run dev          # http://localhost:3000
```

Le développement local utilise un fichier SQLite (`dev.db`) ; la production utilise Turso. Configuration via `.env` :

```
DATABASE_URL="file:./dev.db"      # ou une URL libsql:// en production
DATABASE_AUTH_TOKEN="..."         # jeton Turso (production uniquement)
ADMIN_PASSWORD="..."              # mot de passe du panneau d'administration
JWT_SECRET="..."                  # clé de signature des sessions
```
