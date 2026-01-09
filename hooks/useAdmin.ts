import { useAuth } from '../contexts/AdminAuthContext';

export const useAdmin = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    // Legacy compatibility for existing components
    credentials: auth.accessToken ? { 
      authorization: `Bearer ${auth.accessToken}` 
    } : null
  };
};