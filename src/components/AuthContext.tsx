import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

// stockage du contexte global de l'utilisateur connecté 
// un simple objet full string ^^ (jsp si je mets tous les champs possible comme au lieu de faire une requete pour les cherchers j'aurais tout ce dont j'ai besoin et oui ce commentaire est super long, c'est normal j'aime bien embeter les gens et évidemment on oublie pas de fermer la parenthèse)
interface UserType  {
  username: string;
  token: string;
  profilePicture: string;
  id: string;
}

interface AuthContextType {
  user: UserType | null;                            
  login: (token: string, username: string, profilePicture: string, id: string) => void;
  logout: ()=> void;
}

export const AuthContext = createContext<AuthContextType | null>(null); 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // lazy loading, check les logins a chaque refresh/nouvelle page, évite de faire connecter l'utilisateur à chaque fois 
  const [user, setUser] = useState<UserType | null>(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedProfilePicture = localStorage.getItem("profilePicture");
    const storedId = localStorage.getItem("id");

    if (storedToken && storedUsername && storedProfilePicture && storedId) {
      return {
        token: storedToken,
        username: storedUsername,
        profilePicture: storedProfilePicture,
        id: storedId
      };
    }
    return null;
    
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
  }, []);  // Empty dependency array means this effect runs once on mount

  // stock le token dans localstorage et update l'utilisateur
  const login = (token: string, id: string, profilePicture: string, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("profilePicture", profilePicture);
    localStorage.setItem("id", id);
    setUser({
      username,
      token,
      profilePicture,
      id
    });
  };

  // supprime le token dans localstorage et reset l'état de user à null
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("id");
    setUser(null);
  };

  // fournit les valeurs user, login, logout a tous les comps enfants
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};