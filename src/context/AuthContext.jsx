import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('penpal_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const email = credentials.identifier || credentials.email || 'aravinda@penpalplus.lk';
      let role = credentials.role || credentials.accountType;

      if (!role) {
        const lowerEmail = email.toLowerCase();
        if (lowerEmail.includes('sarasavi') || lowerEmail.includes('supplier') || lowerEmail.includes('paper') || lowerEmail.includes('lanka')) {
          role = 'Supplier';
        } else if (lowerEmail.includes('kumari') || lowerEmail.includes('customer') || lowerEmail.includes('stannes') || lowerEmail.includes('nimal')) {
          role = 'Customer';
        } else if (lowerEmail.includes('staff') || lowerEmail.includes('sunil') || lowerEmail.includes('kasun')) {
          role = 'Staff';
        } else {
          role = 'Owner / Admin';
        }
      } else {
        // Normalize role title
        if (role.toLowerCase() === 'owner') role = 'Owner / Admin';
        else if (role.toLowerCase() === 'staff') role = 'Staff';
        else if (role.toLowerCase() === 'customer') role = 'Customer';
        else if (role.toLowerCase() === 'supplier') role = 'Supplier';
      }

      let name = credentials.fullName;
      if (!name) {
        if (role === 'Customer') name = 'Kumari Fonseka';
        else if (role === 'Supplier') name = 'Sarasavi Wholesalers';
        else name = 'Aravinda Perera';
      }

      // Create user session object
      const userData = {
        email,
        name,
        role,
      };
      setUser(userData);
      localStorage.setItem('penpal_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('penpal_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
