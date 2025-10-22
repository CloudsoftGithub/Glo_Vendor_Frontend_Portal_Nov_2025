'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load token and user info from localStorage
    const storedToken = localStorage.getItem('glovendor_token');
    const storedUser = localStorage.getItem('glovendor_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newToken, userObj) => {
    localStorage.setItem('glovendor_token', newToken);
    localStorage.setItem('glovendor_user', JSON.stringify(userObj));
    setToken(newToken);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem('glovendor_token');
    localStorage.removeItem('glovendor_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
