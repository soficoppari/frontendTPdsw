import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

interface AuthContextType {
  isLoggedIn: boolean | null;
  role: string | null;
  login: (token: string, userRole: string) => void; // Ajusta la firma de la función
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, [isLoggedIn, role]); // Dependencias para garantizar la re-renderización

  const login = (token: string, userRole: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
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
