import { useAdminContext } from "@/contexts/AdminContext";

export const useAdmin = () => {
  const context = useAdminContext();
  
  // Simple wrapper around the context
  return {
    isAuthenticated: context.isAuthenticated,
    credentials: context.credentials,
    login: context.login,
    logout: context.logout
  };
};
