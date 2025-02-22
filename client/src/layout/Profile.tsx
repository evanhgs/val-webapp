import { Header } from "../components/Header";
import  { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    bio: "",
    created_at: "",
    profile_picture: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {

      try {
        if (!token) {
          setError("Vous devez etre connecté pour voir votre profil.");
          navigate("/login");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:5000/user/profile",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile({
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio || "Aucune bio disponible.",
          created_at: new Date(response.data.created_at).toLocaleDateString(),
          profile_picture: response.data.profile_picture || "default.jpg",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du profil: ", error);
        setError("Impossible de récupérer les infos du profil.");
      }
    };
    fetchProfile();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="mt-16 p-6 max-w-2xl mx-auto text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="rounded-full w-32 h-32 mx-auto border-4 border-gray-600 shadow-lg"
            />
            <h1 className="text-3xl font-bold mt-4">{profile.username}</h1>
            <p className="text-gray-400">{profile.email}</p>
            <p className="mt-2 italic text-gray-300">{profile.bio}</p>
            <p className="mt-4 text-sm text-gray-500">
              Membre depuis : {profile.created_at}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
