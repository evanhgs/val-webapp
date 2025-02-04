/* cette page gère l'état de connexion global */

import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  login: (token: string) => void;
  logout: ()=> void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("token") ? { token: localStorage.getItem("token") } : null;
  });

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};