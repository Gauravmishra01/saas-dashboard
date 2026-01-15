import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  user: null,
  activeTenantId: null,
  isLoading: false,

  setUser: (user) => {
    // When logging in, default to their first available tenant
    set({
      user,
      activeTenantId: user.tenants[0],
    });
  },

  // The Critical Tenant Switcher
  switchTenant: (tenantId) => {
    const { user } = get();
    // Security check: Does user actually have access to this tenant?
    if (user?.tenants.includes(tenantId)) {
      set({ activeTenantId: tenantId });
    }
  },

  logout: () => set({ user: null, activeTenantId: null }),
}));
