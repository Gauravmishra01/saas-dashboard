import React, { useState } from "react";
import { useAppStore } from "./stores/useAppStore";
import { mockLogin } from "./services/mockData";
import { DashboardLayout } from "./layouts/DashboardLayout";

function App() {
  const { user, setUser } = useAppStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await mockLogin(email);
      setUser(userData);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // If logged in, show Dashboard
  if (user) {
    return <DashboardLayout />;
  }

  // Otherwise, show Login
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              placeholder="admin@test.com or agent@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500">
          <p>
            Try: <b>admin@test.com</b> (Access to Org A & B)
          </p>
          <p>
            Try: <b>agent@test.com</b> (Access to Org A only)
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
