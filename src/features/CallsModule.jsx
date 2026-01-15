import React, { useState, useEffect } from "react";
import { useAppStore } from "../stores/useAppStore";
import { fetchCalls } from "../services/mockData";
import { Phone } from "lucide-react";

export const CallsModule = () => {
  const { activeTenantId } = useAppStore();
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    if (activeTenantId) fetchCalls(activeTenantId).then(setCalls);
  }, [activeTenantId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        <Phone size={20} />
        <h2 className="text-lg font-bold">Call Logs</h2>
      </div>

      <div className="space-y-3">
        {calls.length === 0 && (
          <p className="text-gray-400 text-sm">No calls recorded.</p>
        )}
        {calls.map((call) => (
          <div
            key={call.id}
            className="text-sm border-l-2 border-green-500 pl-3"
          >
            <span className="font-medium">{call.lead}</span>
            <span className="text-gray-500 block">
              {call.duration} - {call.outcome}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
