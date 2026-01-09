import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshTokenValue(null);
    
    // Only remove from localStorage on client side
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rj-admin-access-token');
      localStorage.removeItem('rj-admin-refresh-token');
      localStorage.removeItem('rj-admin-user');
    }
  }, []);

  // Check if admin is already authenticated on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const storedAccessToken = localStorage.getItem('rj-admin-access-token');
    const storedRefreshToken = localStorage.getItem('rj-admin-refresh-token');
    const storedUser = localStorage.getItem('rj-admin-user');

    if (storedAccessToken && storedRefreshToken && storedUser) {
      try {
        setAccessToken(storedAccessToken);
        setRefreshTokenValue(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        logout();
      }
    }
  }, [logout]);

  const login = async (user: User, accessToken: string): Promise<void> => {
    setUser(user);
    setAccessToken(accessToken);
    
    // Store tokens and user info (only on client side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('rj-admin-access-token', accessToken);
      localStorage.setItem('rj-admin-user', JSON.stringify(user));
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!refreshTokenValue) return false;

    try {
      const response = await fetch('/api/admin/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const data = await response.json();

      setAccessToken(data.accessToken);
      setRefreshTokenValue(data.refreshToken);

      if (typeof window !== 'undefined') {
        localStorage.setItem('rj-admin-access-token', data.accessToken);
        localStorage.setItem('rj-admin-refresh-token', data.refreshToken);
      }

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const isAuthenticated = !!user && !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        login,
        logout,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};