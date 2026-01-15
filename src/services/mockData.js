// This simulates a database where data is partitioned by Tenant ID
const DB = {
  org_a: {
    leads: [
      { id: 1, name: "Acme Corp", status: "New", value: "$5,000" },
      { id: 2, name: "Globex", status: "Closed", value: "$12,000" },
    ],
    calls: [
      { id: 101, lead: "Acme Corp", duration: "12m", outcome: "Meeting Set" },
    ],
  },
  org_b: {
    leads: [
      { id: 3, name: "Soylent Corp", status: "Negotiation", value: "$45,000" },
    ],
    calls: [], // Org B has no calls yet
  },
};

// Simulate API Latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockLogin = async (email) => {
  await delay(500);
  // Simple mock logic
  if (email.includes("admin")) {
    return {
      id: 1,
      name: "Alice Admin",
      role: "admin",
      tenants: ["org_a", "org_b"], // Admin sees both
    };
  }
  if (email.includes("agent")) {
    return {
      id: 2,
      name: "Bob Agent",
      role: "agent",
      tenants: ["org_a"], // Agent sees only one
    };
  }
  throw new Error("User not found (Try admin@test.com or agent@test.com)");
};

// Data Fetchers - NOTICE they require tenantId
export const fetchLeads = async (tenantId) => {
  await delay(300);
  return DB[tenantId]?.leads || [];
};

export const fetchCalls = async (tenantId) => {
  await delay(300);
  return DB[tenantId]?.calls || [];
};

// NEW: Function to update lead status
export const updateLeadStatus = async (tenantId, leadId, newStatus) => {
  await delay(500); // Simulate network saving time

  const tenantData = DB[tenantId];
  if (!tenantData) throw new Error("Tenant not found");

  const lead = tenantData.leads.find((l) => l.id === leadId);
  if (lead) {
    lead.status = newStatus; // Update the mock DB
  }

  return lead;
};
