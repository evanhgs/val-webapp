import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../components/AuthContext';
import config from '../config';
import PhoneCarousel from '../components/Carousel';



const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext) || {};
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (username && password) {
        const response = await axios.post(`${config.serverUrl}/auth/login`, { username, password });
        if (login) {
          login(
            response.data.token,
            response.data.user_id,
            response.data.profile_picture,
            response.data.username
          );
          navigate("/");
        } else {
          setError("Nom d'utilisateur ou mot de passe incorrect.");
        }
      } else {
        setError('Veuillez remplir tous les champs.');
      }
    } catch (error) {
      console.error('Error: ', error);
      setError("Une erreur s'est produite lors de la connexion.");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {/* Conteneur principal */}
      <div className="flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-10">
        {/* Carousel de téléphone */}
        <PhoneCarousel />

        {/* Formulaire de connexion */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80 text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
            >
              Se connecter
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}

          <div className="mt-6 text-center">
            <p>
              Vous n'avez pas de compte ?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-500 cursor-pointer"
              >
                S'inscrire
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
