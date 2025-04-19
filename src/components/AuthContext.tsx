import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';


interface AuthContextType {
  user: any;                            //  information de l'utilisateur
  login: (token: string) => void;       //  fonction de login qui stock le token
  logout: ()=> void;                    //  fonction pour deco en supprimant le token
}

// création du contexte avec comme valeur null par defaut
export const AuthContext = createContext<AuthContextType | null>(null); 


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // gere l'etat de l'utilisateur, vérifie si un token est déjà stocké et initie l'état 
  const [user, setUser] = useState(() => {
    return localStorage.getItem("token") ? { 
      token: localStorage.getItem("token") } : null;
  });

  // Fonction pour valider le token (envoie au backend)
  const validateToken = async (token: string) => {
    try {
      const response = await axios.post(`${config.serverUrl}/auth/token`, { token });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  };

  // Utiliser useEffect pour valider le token au chargement
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const isValid = await validateToken(token);
        if (!isValid) {
          logout();
        }
      }
    };
    checkToken();
  }, []);

  // stock le token dans localstorage et update l'utilisateur
  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser({ token });
  };

  // supprime le token dans localstorage et reset l'état de user à null
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // fournit les valeurs user, login, logout a tous les comps enfants
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};