import React, { useState, useEffect, useMemo } from "react";
import { useAppStore } from "../stores/useAppStore";
import { fetchLeads, updateLeadStatus } from "../services/mockData"; // Import the update function
import { RBACGuard } from "../components/RBACGuard";
import { Save, X, Edit2, Loader2 } from "lucide-react"; // Icons for UI

export const LeadsModule = () => {
  const { activeTenantId } = useAppStore();
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("All");

  // NEW: State to track which row is being edited
  const [editingId, setEditingId] = useState(null);
  const [tempStatus, setTempStatus] = useState(""); // Holds the dropdown value
  const [isSaving, setIsSaving] = useState(false);

  // Fetch data only when Tenant changes
  useEffect(() => {
    if (activeTenantId) {
      setEditingId(null); // Cancel any edits if tenant switches
      fetchLeads(activeTenantId).then(setLeads);
    }
  }, [activeTenantId]);

  // Handle entering edit mode
  const startEditing = (lead) => {
    setEditingId(lead.id);
    setTempStatus(lead.status);
  };

  // Handle Cancel
  const cancelEdit = () => {
    setEditingId(null);
    setTempStatus("");
  };

  // Handle Save
  const saveEdit = async (leadId) => {
    setIsSaving(true);
    try {
      // 1. Call API
      await updateLeadStatus(activeTenantId, leadId, tempStatus);

      // 2. Update Local State (Optimistic UI or re-fetch)
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: tempStatus } : l))
      );

      // 3. Close Edit Mode
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save", error);
      alert("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter Logic
  const visibleLeads = useMemo(() => {
    return filter === "All" ? leads : leads.filter((l) => l.status === filter);
  }, [leads, filter]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Leads ({activeTenantId.toUpperCase()})
        </h2>
        <select
          className="border p-1 rounded text-sm"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="space-y-2">
        {visibleLeads.map((lead) => {
          const isEditing = editingId === lead.id;

          return (
            <div
              key={lead.id}
              className={`flex justify-between items-center p-3 rounded border ${
                isEditing
                  ? "bg-indigo-50 border-indigo-200"
                  : "bg-gray-50 border-transparent"
              }`}
            >
              {/* Left Side: Lead Info */}
              <div>
                <div className="font-semibold text-gray-800">{lead.name}</div>
                <div className="text-sm text-gray-500">{lead.value}</div>
              </div>

              {/* Right Side: Status & Actions */}
              <div className="flex items-center gap-3">
                {/* --- EDIT MODE --- */}
                {isEditing ? (
                  <>
                    <select
                      value={tempStatus}
                      onChange={(e) => setTempStatus(e.target.value)}
                      className="text-sm border border-indigo-300 rounded px-2 py-1 outline-none"
                      disabled={isSaving}
                    >
                      <option value="New">New</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <div className="flex gap-1">
                      <button
                        onClick={() => saveEdit(lead.id)}
                        disabled={isSaving}
                        className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        {isSaving ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Save size={16} />
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isSaving}
                        className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  /* --- VIEW MODE --- */
                  <>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium 
                      ${
                        lead.status === "Closed"
                          ? "bg-green-100 text-green-800"
                          : lead.status === "New"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {lead.status}
                    </span>

                    {/* RBAC Protected Edit Button */}
                    <RBACGuard requiredRole="admin">
                      <button
                        onClick={() => startEditing(lead)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit Status"
                      >
                        <Edit2 size={16} />
                      </button>
                    </RBACGuard>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {visibleLeads.length === 0 && (
          <p className="text-center text-gray-400 py-4">
            No leads match filter.
          </p>
        )}
      </div>
    </div>
  );
};
