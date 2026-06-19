# Workbench Custom RBAC

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack Role-Based Access Control (RBAC) prototype built for the SDE Intern assessment. Administrators can dynamically create custom roles, assign them to users, and instantly compute each user's effective system permissions.

---

## 🚀 Key Features

* **Dynamic Permission Matrix** — A scrollable grid UI that scales automatically as new resources and actions are added.
* **Additive Union Resolution** — Computes the exact superset of allowed actions for users holding multiple, overlapping roles.
* **File-Based Persistence** — Avoids external database overhead by keeping data in-memory (`Map`) while auto-syncing to local JSON files.
* **Protected Core API** — Role creation and assignment endpoints are secured behind custom authorization middleware.
* **Modern Interface** — Built with Tailwind CSS v4 for accessible, responsive layouts out of the box.

---

## 🛠 Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| **Frontend** | React, Vite, Tailwind CSS v4 |
| **Backend**  | Node.js, Express, TypeScript, Zod (validation), Morgan (logging) |
| **Data**     | In-memory JavaScript `Map`s backed by auto-syncing `data.json` files |

---

## 🏁 Getting Started

### Prerequisites

* [Node.js v18+](https://nodejs.org/) and npm

### Installation & Execution

```bash
# Clone the repository
git clone https://github.com/<your-username>/workbench-rbac.git
cd workbench-rbac

# Step 1: Start the backend
cd backend
npm install
npm run dev          # API server → http://localhost:3000

# Step 2: Start the frontend (in a separate terminal)
cd ../frontend
npm install
npm run dev           # Vite client → http://localhost:5173
```


---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|--------------|----------------|
| `GET`  | `/api/roles` | List all roles | No |
| `POST` | `/api/roles` | Create a custom role | Yes |
| `PUT`  | `/api/roles/:id` | Update an existing role | Yes |
| `GET`  | `/api/users` | List all users | No |
| `PUT`  | `/api/users/:id/roles` | Assign roles to a user | Yes |
| `GET`  | `/api/users/:id/permissions` | Get a user's effective (union) permissions | No |

> Full request/response schemas are defined with Zod in the `shared/` directory and documented in **[Architecture.md](./Architecture.md)**.

---

## 📂 Repository Layout

```text
workbench-rbac/
├── backend/          # Express API, services, auth middleware, and JSON storage
├── frontend/          # React application, Tailwind v4 config, and API clients
├── shared/            # Cross-boundary Zod validation schemas
├── Architecture.md    # Architectural decisions, data models, and system design docs
└── README.md          # Project documentation and setup guide
```

---

## 🧪 Scripts

| Command | Location | Description |
|---------|----------|--------------|
| `npm run dev` | `backend/`, `frontend/` | Start the dev server with hot reload |
| `npm run build` | `backend/`, `frontend/` | Compile/bundle for production |
| `npm run lint` | `backend/`, `frontend/` | Run ESLint checks |

---

## 🗺 Roadmap

* [ ] Persist data to a real database (e.g., PostgreSQL) behind the same storage interface
* [ ] Add role hierarchy / inheritance support
* [ ] Add authentication (JWT-based) in place of stubbed middleware

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
