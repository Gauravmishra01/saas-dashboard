import React from "react";
import { useAppStore } from "../stores/useAppStore";
import { LeadsModule } from "../features/LeadsModule";
import { CallsModule } from "../features/CallsModule";
import { LogOut } from "lucide-react";

export const DashboardLayout = () => {
  const { user, activeTenantId, switchTenant, logout } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-indigo-600">SaaSFilter</h1>

          {/* TENANT SWITCHER */}
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded">
            <span className="text-xs font-bold text-indigo-900">TENANT:</span>
            <select
              value={activeTenantId}
              onChange={(e) => switchTenant(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none text-indigo-700 cursor-pointer"
            >
              {user.tenants.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-bold text-gray-800">{user.name}</div>
            <div className="text-xs text-gray-500 uppercase">{user.role}</div>
          </div>
          <button onClick={logout} className="text-gray-500 hover:text-red-500">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <LeadsModule />
        </div>
        <div>
          <CallsModule />
        </div>
      </main>
    </div>
  );
};
