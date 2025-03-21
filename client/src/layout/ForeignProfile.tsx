import  { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { Footer } from "../components/FooterComp";
import { Logout } from "../components/Logout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import config from '../config';
import { FollowersModal } from '../components/FollowersModal';
// page copié collé à quelques détails de Profil

// type pour l'utilisateur
interface UserProfile {
  username: string;
  bio: string;
  website: string;
  created_at: string;
  profile_picture: string;
}

interface FollowUser {
  username: string;
  profile_picture?: string;
}

// récupérer le username directement dans la route
const ForeignProfile = () => {
  
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const navigate = useNavigate();

  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false)

  const [followers, setFollowers] = useState<FollowUser[]>([]); // liste des utilisateurs 
  const [followersCount, setFollowersCount] = useState(0); // count (precook in route) 

  const [followed, setFollowed] = useState<FollowUser[]>([]);
  const [followedCount, setFollowedCount] = useState(0);
  
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowed, setShowFollowed] = useState(false);
  
  // Récupérer le paramètre username de l'URL
  const { username } = useParams<{ username: string }>();



  {/** premier hook ajoutat les info de l'affichage du profil */}
  useEffect(() => {
    const fetchProfile = async () => {

      try {
        if (!token) {
          setError("Vous devez etre connecté pour voir votre profil.");
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${config.serverUrl}/user/profile/${username}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({
          username: response.data.username,
          bio: response.data.bio || "Aucune bio disponible.",
          website: response.data.website || "",
          created_at: new Date(response.data.created_at).toLocaleDateString(),
          profile_picture: response.data.profile_picture || "default.jpg",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du profil: ", error);
        setError("Impossible de récupérer les infos du profil.");
      }
    };
    fetchProfile();
  }, [token, navigate]); // dependance du hook pour s'assurer que la requete est bien relancée apres l'effet


  useEffect(() => {
    const fetchFollowers =async () => {
      if (!token || !userData) return;

      try {
        setIsLoadingFollowers(true);

        const followerResponse = await axios.get(`${config.serverUrl}/user/get-follow/${userData.username}`);
        const followedResponse = await axios.get(`${config.serverUrl}/user/get-followed/${userData.username}`);

        setFollowers(followerResponse.data.followers);
        setFollowersCount(followerResponse.data.count);
        setFollowed(followedResponse.data.followed);
        setFollowedCount(followedResponse.data.count);

      } catch (error) {
          console.error("Erreur lors de la récupération des abonnés/abonnements", error);
      } finally {
        setIsLoadingFollowers(false);
      }
    };
    fetchFollowers();
  }, [token, userData]); // userData comme dépendance pour s'assurer que les données du profil sont chargées d'abord

  if (error) {
    return (
      <div className="text-white text-center mt-10">
        <p>{error}</p>
        <p>Si vous rencontrez plusieurs erreur à la suite essayez de vous reconnecter</p>
        < Logout />
      </div>
    );
  }

  if (!userData){
    return (
      <div className="text-white text-center mt-10">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex-col md:flex-row min-h-screen bg-black text-white flex-grow ml-[250px]">
        
        <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="flex items-center space-x-10">

          <img
            src={`${config.serverUrl}/user/profile-picture/${userData.profile_picture}` || `${config.serverUrl}/user/profile-picture/default.jpg`}
            alt="Profile"
            className="w-28 h-28 rounded-full border-2 border-gray-600"
          />

          {/* Infos du profil */}
          <div>
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold">{userData.username}</h2>
            </div>

            <div className="flex space-x-6 mt-3 text-gray-300">
              {isLoadingFollowers ? (
                <>
                  <span>
                    <strong>...</strong> posts
                  </span>
                  <span>
                    <strong>...</strong> abonnés
                  </span>
                  <span>
                    <strong>...</strong> abonnements
                  </span>
                </>
              ) : (
                <>
                  <span>
                    <strong>0</strong> posts
                  </span>

                  <span 
                    className="hover:text-white cursor-pointer"
                    onClick={() => setShowFollowers(true)}>
                    <strong>{followersCount}</strong> abonnés
                  </span>

                  <span 
                    className="hover:text-white cursor-pointer"
                    onClick={() => setShowFollowed(true)}>
                    <strong>{followedCount}</strong> abonnements
                  </span>
                </>
              )}
            </div>

            {/* bio affichée*/}
            <p className="mt-2">{userData.bio || "Vous n'avez pas de bio !"}</p>
            <div className="my-4"></div>
            <p className="text-sm">{userData.website || ""}</p>
          </div>
        </div>
      </div>


      {showFollowers && (
        <FollowersModal 
          users={followers} 
          title="Abonnés" 
          onClose={() => setShowFollowers(false)} 
        />
      )}
      
      {showFollowed && (
        <FollowersModal 
          users={followed} 
          title="Abonnements" 
          onClose={() => setShowFollowed(false)} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default ForeignProfile;
