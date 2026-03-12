<p align="center">
  <img src="asfm-fe/src/assets/logo.png" alt="Shelter Sync Logo" width="200" />
</p>

<h1 align="center">Shelter Sync</h1>

<p align="center">Foster program management for animal shelters — built to keep animals, staff, and foster families in sync.</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributors](#contributors)

---

## Overview

Running a shelter foster program means juggling a lot: which animals are available, who's fostering what, whether medical data is up to date, and whether foster families have the supplies they need. Shelter Sync replaces spreadsheets and scattered communication with a single, role-aware platform.

**Shelter staff** get a full admin dashboard to manage animals, assign fosters, track medical histories, process inventory, and oversee all active loans in one place.

**Foster families** get a personal dashboard showing only their animals and supplies — no noise, just what they need to care for the animals in their home. An AI chat assistant backed by Google Gemini is available to both roles to quickly answer questions about shelter operations.

---

## Features

- **Animal Management** — Add, edit, and remove animals; track status and details
- **Foster Assignment** — Assign and unassign animals to foster families (loan system)
- **Medical Logs** — Record and review veterinary treatments and check-ups per animal
- **Inventory Management** — Track shelter supplies, record intake, and distribute to foster homes
- **Role-Based Access** — Separate experiences for shelter staff and foster family users
- **AI Chat Assistant** — Powered by Google Gemini to answer questions about animals and shelter operations
- **Admin Dashboard** — Staff portal for managing all animals, users, transactions, and inventory

---

## Screenshots

<p align="center">
  <img src="asfm-fe/src/assets/admin-dash.png" alt="Admin Dash" width="200" />
</p>

<p align="center">
  <img src="asfm-fe/src/assets/home-page.png" alt="Home Page" width="200" />
</p>

<p align="center">
  <img src="asfm-fe/src/assets/transactions-page.png" alt="Transactions" width="200" />
</p>

---

## Tech Stack

### Frontend

| Tool                     | Purpose                             |
| ------------------------ | ----------------------------------- |
| React 19 + Vite          | UI framework and build tooling      |
| TanStack Router          | File-based client-side routing      |
| Zustand                  | Lightweight global state management |
| TanStack Form + Zod      | Form handling and validation        |
| Tailwind CSS + Shadcn/ui | Styling and component library       |
| Axios                    | HTTP client for API requests        |
| Supabase JS              | Authentication client               |

### Backend

| Tool                  | Purpose                    |
| --------------------- | -------------------------- |
| Node.js + Express 5   | Server and REST API        |
| Prisma                | ORM for database access    |
| PostgreSQL (Supabase) | Relational database        |
| Zod                   | Request validation schemas |
| Jose                  | JWT verification           |
| Google Gemini API     | AI chat feature            |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+
- A [Supabase](https://supabase.com/) project (free tier works)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone the repo

```bash
git clone https://github.com/dsd-cohort-2026/animal-shelter-foster-management.git
cd animal-shelter-foster-management
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# Supabase project credentials
SUPABASE_PROJECT_ID=your_supabase_project_id
SUPABASE_PASSWORD=your_supabase_password

# Database connections (from your Supabase project settings)
DATABASE_URL=postgresql://postgres.[project_id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project_id]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Supabase Auth
SUPABASE_PROJECT_URL=https://your_project_id.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# AI Chat
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Configure the frontend

```bash
cd ../asfm-fe
npm install
```

Create a `.env` file in the `asfm-fe/` directory:

```env
# Supabase Auth (same project as backend)
VITE_SUPABASE_URL=https://your_project_id.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```

### 5. Run database migrations

```bash
cd ../server
npm run migrate
```

Follow the prompts to apply migrations to your Supabase database.

### 6. Start the development servers

**Terminal 1 — Backend** (runs on `http://localhost:8080`):

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend** (runs on `http://localhost:5173`):

```bash
cd asfm-fe
npm run dev
```

> The frontend Vite config proxies all `/api` requests to the backend automatically.

### Optional: Mock API

If you want to run the frontend without a live backend:

```bash
# From the project root
npm run mock:api
```

This starts a JSON Server mock on `http://localhost:3001`.

---

## Environment Variables

### Backend (`server/.env`)

| Variable                   | Description                               | Where to find it                                                      |
| -------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| `SUPABASE_PROJECT_ID`      | Your Supabase project ID                  | Supabase dashboard → Project Settings                                 |
| `SUPABASE_PASSWORD`        | Your Supabase database password           | Supabase dashboard → Project Settings → Database                      |
| `DATABASE_URL`             | Pooled connection string (for CRUD)       | Supabase dashboard → Project Settings → Database → Connection pooling |
| `DIRECT_URL`               | Direct connection string (for migrations) | Supabase dashboard → Project Settings → Database → Direct connection  |
| `SUPABASE_PROJECT_URL`     | Your Supabase project URL                 | Supabase dashboard → Project Settings → API                           |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key                  | Supabase dashboard → Project Settings → API                           |
| `GEMINI_API_KEY`           | Google Gemini API key                     | [Google AI Studio](https://aistudio.google.com/app/apikey)            |

### Frontend (`asfm-fe/.env`)

| Variable                                | Description               | Where to find it                            |
| --------------------------------------- | ------------------------- | ------------------------------------------- |
| `VITE_SUPABASE_URL`                     | Your Supabase project URL | Supabase dashboard → Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon/public key  | Supabase dashboard → Project Settings → API |

---

## API Endpoints

Base URL: `http://localhost:8080/api`

All endpoints require an `Authorization: Bearer <token>` header unless marked as **public**.

### Animals

| Method  | Path                    | Description                      | Auth       |
| ------- | ----------------------- | -------------------------------- | ---------- |
| `GET`   | `/animals`              | List all animals                 | Any user   |
| `GET`   | `/animals/:id`          | Get a single animal              | Any user   |
| `POST`  | `/animals/create`       | Create a new animal              | Staff only |
| `PATCH` | `/animals/:id`          | Update an animal                 | Staff only |
| `PATCH` | `/animals/:id/assign`   | Assign animal to a foster home   | Staff only |
| `PATCH` | `/animals/:id/unassign` | Remove animal from a foster home | Staff only |

### Users

| Method  | Path         | Description       | Auth       |
| ------- | ------------ | ----------------- | ---------- |
| `GET`   | `/users`     | List all users    | Staff only |
| `GET`   | `/users/:id` | Get a single user | Any user   |
| `POST`  | `/users`     | Create a user     | Any user   |
| `PATCH` | `/users/:id` | Update a user     | Any user   |

### Items

| Method   | Path         | Description       | Auth       |
| -------- | ------------ | ----------------- | ---------- |
| `GET`    | `/items`     | List all items    | Any user   |
| `POST`   | `/items`     | Create a new item | Staff only |
| `PATCH`  | `/items/:id` | Update an item    | Staff only |
| `DELETE` | `/items/:id` | Delete an item    | Staff only |

### Medical Logs

| Method  | Path                | Description           | Auth     |
| ------- | ------------------- | --------------------- | -------- |
| `GET`   | `/medical-logs`     | List all medical logs | Any user |
| `GET`   | `/medical-logs/:id` | Get a single log      | Any user |
| `POST`  | `/medical-logs`     | Create a medical log  | Any user |
| `PATCH` | `/medical-logs/:id` | Update a medical log  | Any user |

### Inventory

| Method  | Path         | Description           | Auth       |
| ------- | ------------ | --------------------- | ---------- |
| `GET`   | `/inventory` | Get current inventory | Any user   |
| `PATCH` | `/inventory` | Update inventory      | Staff only |

### Inventory Transactions

| Method | Path                                 | Description                  | Auth       |
| ------ | ------------------------------------ | ---------------------------- | ---------- |
| `GET`  | `/inventory-transactions`            | List all transactions        | Staff only |
| `POST` | `/inventory-transactions/intake`     | Record a supply intake       | Staff only |
| `POST` | `/inventory-transactions/distribute` | Record a supply distribution | Staff only |

### Chat

| Method | Path    | Description                        | Auth     |
| ------ | ------- | ---------------------------------- | -------- |
| `POST` | `/chat` | Send a message to the AI assistant | Any user |

### Health

| Method | Path      | Description         | Auth   |
| ------ | --------- | ------------------- | ------ |
| `GET`  | `/health` | Server health check | Public |

## Contributors

### Team Leads

- [Yoon](https://github.com/CloudyBae)
- [Michael](https://github.com/CodeDiversity)

### The Team

- [Rami](https://github.com/Rami-Ismael)
- [Leon](https://github.com/leonz92)
- [Devan](https://github.com/devanrivera98)
- [Ryan](https://github.com/ryan-griego)
- [Dylan](https://github.com/dylanyng)
- [Kyle](https://github.com/anjo-mi)
