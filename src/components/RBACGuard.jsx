import { useAppStore } from "../stores/useAppStore";

export const RBACGuard = ({ requiredRole, children, fallback = null }) => {
  const user = useAppStore((state) => state.user);

  // If role matches (or user is admin and admin has override), show content
  if (user?.role === requiredRole || user?.role === "admin") {
    return children;
  }

  return fallback;
};
