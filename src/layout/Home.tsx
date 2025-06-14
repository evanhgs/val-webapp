import { Stories } from "../components/Stories";
import { Feed } from "../components/Feed";
import { Suggestions } from "../components/Suggestions";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import config from "../config";
import { UserProfile } from '../types/user';
import { UserFeedProps } from '../types/feed';

const Home = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [userFeed, setUserFeed] = useState<UserFeedProps | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError("Vous devez être connecté pour voir votre profil.");
          navigate("/login");
          return;
        }
        // récupération du profil de l'utilisateur connecté
        const response = await axios.get(
          `${config.serverUrl}/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // récupération du feed personnalisé en fonction de l'utilisateur connecté
        const responseFeed = await axios.get(
          `${config.serverUrl}/post/feed`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({
          username: response.data.username,
          profile_picture: response.data.profile_picture || "default.jpg",
          bio: response.data.bio || "",
          website: response.data.website || "",
          created_at: response.data.created_at || "",
        });
        setUserFeed({
          userFeed: responseFeed.data.content,
          currentUsername: userData?.username
        });

      } catch (error) {
        console.error("Erreur lors de la récupération du compte: ", error);
        setError("Impossible de récupérer les infos du compte.");
      }
    };
    fetchProfile();
  }, [token, navigate]);

  return (
    <div className="flex flex-col w-full items-center pt-4">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded max-w-[600px] w-full mb-4 relative z-10">
          {error}
        </div>
      )}

      <div className="w-full max-w-[470px] md:max-w-[600px] lg:max-w-[820px] xl:max-w-[1000px] px-2 md:px-4 relative z-10">
        <div className="mb-6">
          <Stories
            username={userData?.username}
            profile_picture={userData?.profile_picture}
          />
        </div>

        <div className="flex w-full">
          <div className="w-full lg:mr-8">
            <Feed
              userFeed={userFeed?.userFeed || []}
              currentUsername={userData?.username}
            />
            {/* Passe le tableau de posts au composant Feed, ou un tableau vide si les données ne sont pas encore chargées 
             + envoie de l'utilisateur courant dans le feed pour la vérif de la propriété du post */}
          </div>

          <div className="hidden lg:block w-[320px] flex-shrink-0">
            <div className="sticky top-20">
              <Suggestions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;