import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminCredentials {
  username: string;
  password: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  credentials: AdminCredentials | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<AdminCredentials | null>(null);

  // Check if admin is already authenticated on component mount
  useEffect(() => {
    const storedCredentials = localStorage.getItem('autoEliteAdminCredentials');
    if (storedCredentials) {
      try {
        const parsedCredentials = JSON.parse(storedCredentials);
        setCredentials(parsedCredentials);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing admin credentials:', error);
        localStorage.removeItem('autoEliteAdminCredentials');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.authenticated) {
        const newCredentials = { username, password };
        setCredentials(newCredentials);
        setIsAuthenticated(true);
        
        // Store credentials in localStorage for persistence
        localStorage.setItem('autoEliteAdminCredentials', JSON.stringify(newCredentials));
        
        return true;
      } else {
        console.error('Authentication failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCredentials(null);
    localStorage.removeItem('autoEliteAdminCredentials');
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        credentials,
        login,
        logout
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};
