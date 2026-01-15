# Multi-Tenant SaaS Sales Dashboard

A frontend-only simulation of a multi-tenant SaaS platform. This project demonstrates advanced React patterns for **Logical Data Isolation**, **Role-Based Access Control (RBAC)**, and **State Management**.

## 🚀 Features

- **Multi-Tenancy:** Instant context switching between organizations (e.g., Organization A vs. Organization B). Data is strictly isolated by the selected Tenant ID.
- **RBAC (Role-Based Access Control):**
  - **Admins** have full access to multiple tenants and can **Edit** lead statuses.
  - **Agents** are restricted to a single tenant and have **View-Only** access.
- **Inline Editing:** Optimistic UI updates with simulated API latency.
- **Global State Management:** Uses **Zustand** to manage user sessions and active tenant context outside the React render tree.

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## 🏗️ Architecture & Design Decisions

### 1. Handling Multi-Tenancy (Logical Isolation)

The application enforces tenancy at the "mock API" level, avoiding client-side filtration of all data. Here’s how:

- **Global Context:** The `activeTenantId` is stored in a global Zustand store.
- **Data Subscription:** All data-fetching hooks (e.g., `useLeads`) implicitly depend on the `activeTenantId`.
- **Result:** Switching between tenants triggers a global state update, instantly invalidating old data and fetching data for the new context.

### 2. Security (RBAC)

Instead of spreading logic like `if (user.role === 'admin')` throughout the codebase, the project uses a **Compositional Guard Pattern**:

- **Component:** `<RBACGuard requiredRole="admin">`
- **Behavior:** If the policy fails, the wrapped component (e.g., "Edit" button) simply does not render.

### 3. Folder Structure (Feature-Sliced)

The project is scalable and organizes code by **Domain**, not by **Type**, making it easier to maintain and grow:

```text
src/
├── components/      # Shared Atomic UI (RBACGuard, Buttons)
├── features/        # Business Logic Modules
│   ├── LeadsModule/ # Leads List, Filters, Inline Edit Logic
│   └── CallsModule/ # Call Logs
├── layouts/         # Dashboard Shell & Tenant Switcher
├── services/        # Mock API & Database Simulation
└── stores/          # Global State (User Session, Tenant ID)
```

## 📦 Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Gauravmishra01/saas-dashboard.git
   cd saas-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

## 🧪 How to Test (Login Credentials)

Authentication is mocked. Use the following email addresses to simulate different roles and tenancy scopes:

### Scenario A: The Super User

- **Email:** `admin@test.com`
- **Role:** Admin
- **Capabilities:**
  - Can switch between `ORG_A` and `ORG_B`.
  - Can see the Edit (Pencil) icon on leads.
  - Can update lead statuses.

### Scenario B: The Restricted User

- **Email:** `agent@test.com`
- **Role:** Agent
- **Capabilities:**
  - Locked to `ORG_A` (Dropdown will show only one option).
  - Cannot see Edit buttons (hidden by RBAC Guard).
  - View-only access to Call Logs.

## ⚡ Optimization Notes

- **Memoization:** Lead filtering logic is wrapped in `useMemo` to prevent unnecessary recalculations during unrelated renders.
- **Mock Latency:** Artificial delays (e.g., `await delay(500)`) are added at the service layer to simulate loading states (`isLoading`) and demonstrate optimistic UI handling.
