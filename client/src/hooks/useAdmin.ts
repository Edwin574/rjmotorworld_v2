import { useState, useEffect } from 'react';

interface AdminCredentials {
  username: string;
  password: string;
}

export const useAdmin = () => {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored credentials on mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem('admin_credentials');
    if (storedCredentials) {
      try {
        const parsed = JSON.parse(storedCredentials);
        setCredentials(parsed);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('admin_credentials');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication check - in production, this would be API-based
    const validUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin@example.com';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (username === validUsername && password === validPassword) {
      const creds: AdminCredentials = { username, password };
      setCredentials(creds);
      setIsAuthenticated(true);
      localStorage.setItem('admin_credentials', JSON.stringify(creds));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCredentials(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_credentials');
  };

  return {
    credentials,
    isAuthenticated,
    login,
    logout
  };
};