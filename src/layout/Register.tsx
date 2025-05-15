import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../components/AuthContext';
import config from '../config';
import PhoneCarousel from '../components/Carousel';

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.serverUrl}/auth/register`, { username, email, password });
      if (login) {
        login(
          response.data.token,
          response.data.username,
          response.data.profilePicture,
          response.data.id
        );
        navigate("/");
      } else {
        setError('Login function is not available')
      }

    } catch (error) {
      console.error('Error: ', error);
      setError('Failed to register, please check your details and try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {/* Conteneur principal */}
      <div className="flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-10">
        
        <PhoneCarousel />

        {/* Formulaire d'inscription */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-80 text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Inscription</h1>
          <form onSubmit={handleSubmit} >
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="text"
              placeholder="Adresse mail"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded"
            >
              S'inscrire
            </button>
            {error && <p className='text-red-500 mt-3'>{error}</p>}
          </form>
          <div className="text-center my-4">OU</div>
          <button className="w-full flex items-center justify-center bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded">
            <span className="mr-2">🔵</span> S'inscrire avec Facebook
          </button>
        </div>
      </div>

      {/* Lien connexion */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg w-80 text-center text-white">
        Vous avez déjà un compte ?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Connectez-vous
        </a>
      </div>
    </div>
  );
};

export default Register;