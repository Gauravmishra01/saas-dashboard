# Multi-Tenant SaaS Sales Dashboard

A frontend-only simulation of a multi-tenant SaaS platform. This project demonstrates advanced React patterns for **Logical Data Isolation**, **Role-Based Access Control (RBAC)**, and **State Management** without a physical backend.

## 🚀 Features

- **Multi-Tenancy:** Instant context switching between organizations (e.g., Organization A vs. Organization B). Data is strictly isolated by the selected Tenant ID.
- **RBAC (Role-Based Access Control):**
  - **Admins** have full access to multiple tenants and can **Edit** lead statuses.
  - **Agents** are restricted to a single tenant and have **View-Only** access.
- **Inline Editing:** Optimistic UI updates with mock API latency simulation.
- **Global State Management:** Uses **Zustand** to manage User Sessions and Active Tenant context outside the React render tree.

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## 🏗️ Architecture & Design Decisions

### 1. Handling Multi-Tenancy (Logical Isolation)

Instead of fetching "all data" and filtering on the client, the application enforces tenancy at the "Mock API" level.

- **Global Context:** The `activeTenantId` is stored in a global Zustand store.
- **Data Subscription:** All data fetching hooks (e.g., `useLeads`) implicitly require the `activeTenantId` as a dependency.
- **Result:** Switching tenants triggers a global state update, instantly invalidating old data and fetching the new context.

### 2. Security (RBAC)

We avoid scattering `if (user.role === 'admin')` logic throughout the business logic. Instead, we use a Compositional Guard Pattern.

- **Component:** `<RBACGuard requiredRole="admin">`
- **Behavior:** If the policy fails, the wrapped component (e.g., the "Edit" button) simply does not render.

### 3. Folder Structure (Feature-Sliced)

The project allows for scalability by grouping code by **Domain**, not by **Type**.

```text
src/
├── components/      # Shared Atomic UI (RBACGuard, Buttons)
├── features/        # Business Logic Modules
│   ├── LeadsModule/ # Leads List, Filters, Inline Edit Logic
│   └── CallsModule/ # Call Logs
├── layouts/         # Dashboard Shell & Tenant Switcher
├── services/        # Mock API & Database Simulation
└── stores/          # Global State (User Session, Tenant ID)
📦 Installation & Setup
Clone the repository (or navigate to folder):

Bash

cd saas-dashboard
Install dependencies:

Bash

npm install
Run the development server:

Bash

npm run dev
🧪 How to Test (Login Credentials)
The authentication is mocked. Use these email addresses to simulate different roles and tenancy scopes:

Scenario A: The Super User
Email: admin@test.com

Role: Admin

Capabilities:

Can switch between ORG_A and ORG_B.

Can see the Edit (Pencil) icon on leads.

Can update lead status.

Scenario B: The Restricted User
Email: agent@test.com

Role: Agent

Capabilities:

Locked to ORG_A (Dropdown will likely show only one option).

Cannot see Edit buttons (RBAC Guard hides them).

View-only access to Call Logs.

⚡ Optimization Notes
Memoization: Lead filtering logic is wrapped in useMemo to prevent recalculation during unrelated renders.

Mock Latency: Artificial delays (await delay(500)) are added to the service layer to demonstrate loading states (isLoading) and optimistic UI handling.
```
