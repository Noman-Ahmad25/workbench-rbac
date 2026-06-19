# System Architecture & Tech Stack Decisions

This document outlines the architectural decisions and technology choices made for the Workbench RBAC prototype. The primary goal was to build a highly responsive, easily maintainable system that satisfies the assessment constraints (no external databases) while remaining modular enough to scale.

---

## 1. Frontend Tech Stack Decisions

The frontend is built to handle a dynamic, matrix-style UI that requires rapid re-rendering and complex state management.

* **React:** Chosen for its component-based architecture. The RBAC interface requires isolating state (like the `RoleBuilder` vs. the `EffectivePermissionViewer`) so that editing a role does not unnecessarily re-render the entire user directory.
* **Vite:** Selected over Create React App or Webpack for its underlying esbuild compiler. Vite provides near-instant Hot Module Replacement (HMR) and significantly optimized build times, creating a seamless developer experience for modern web development.
* **Tailwind CSS v4:** Selected for utility-first styling. It eliminates the need for context-switching between CSS files and component files, allowing for rapid, consistent UI prototyping. The v4 Vite plugin integration allows for a zero-config setup that keeps the repository lightweight.

## 2. Backend Tech Stack Decisions

The backend is designed to be a lightweight, strictly typed REST API that acts as a secure gatekeeper for the permission logic.

* **Node.js & Express:** Chosen for their asynchronous, non-blocking I/O, which is ideal for an API serving JSON data. Express provides a minimalist routing layer, making it easy to completely decouple network transport (`server.ts`) from application logic (`app.ts` and routers).
* **TypeScript:** Essential for a security-focused domain like RBAC. Defining strict `User` and `Role` interfaces ensures that data structures are predictable across the entire application lifecycle.
* **Zod (Cross-Boundary Validation):** TypeScript only provides compile-time safety. Zod was chosen to enforce **runtime** validation at the API boundary. By placing Zod schemas in a `/shared` directory, the backend securely parses incoming payloads (`req.body`) while the frontend can potentially use the exact same schemas for form validation.
* **Morgan:** Implemented for HTTP request logging. It provides immediate, structured visibility into API traffic and security events (e.g., tracking `403 Forbidden` responses) without the overhead of a heavy monitoring stack.

## 3. Authorization Architecture (RBAC Logic)

The core permission resolution engine utilizes an **Additive Union** strategy.

* **The Logic:** When a user is assigned multiple roles, the system calculates their effective permissions by taking the union of all granted actions. If Role A grants `Projects:view` and Role B grants `Projects:edit`, the user effectively receives `['view', 'edit']`.
* **The Justification:** This is the industry standard for modern, composable access control (similar to AWS IAM policies). It allows administrators to create granular, modular roles (e.g., "Content Reader" + "Billing Admin") rather than managing overlapping, monolithic roles.

## 4. Storage & Persistence Strategy

To strictly adhere to the "no external database" constraint while maintaining a viable testing environment:

* **In-Memory Maps:** The primary data stores for Users and Roles are native JavaScript `Map` objects. This provides $O(1)$ time complexity for direct lookups and lightning-fast read/write operations during API calls.
* **JSON Syncing:** To prevent data loss during development server restarts, the backend implements a localized persistence layer. Upon any mutation (creating a role, assigning a user), the in-memory Maps are asynchronously serialized and written to a `data.json` file. On boot, the server hydrates the Maps from this file, mimicking the persistence of a real database.

## 5. Future Production Path

If this prototype were to be scaled into a production environment, the architecture is already decoupled enough to support the following seamless upgrades:
1.  **Database Layer:** The file-based syncing would be replaced by a robust relational database (such as PostgreSQL or MySQL) utilizing a join table for user_roles.
2.  **Authentication Layer:** The spoofed `x-user-id` header would be replaced with a standard JWT authentication middleware.
3.  **Caching:** The additive union calculation could be cached in Redis, keyed by the user's ID, and invalidated only when their roles are explicitly updated.
