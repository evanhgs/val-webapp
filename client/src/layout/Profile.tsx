import  { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { Footer } from "../components/FooterComp";
import { Logout } from "../components/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm";
import UploadButton from "../components/UploadProfilePic";
import config from '../config';
import { FollowersModal } from '../components/FollowersModal';

// type pour l'utilisateur
interface UserProfile {
  username: string;
  email: string;
  bio: string;
  website: string;
  created_at: string;
  profile_picture: string;
}

interface FollowUser {
  username: string;
  profile_picture?: string;
}

const Profile = () => {
  
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // pour le form du profil 
  const [isUploading, setIsUploading] = useState(false); // pour l'upload de la pp 

  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false)

  const [followers, setFollowers] = useState<FollowUser[]>([]); // liste des utilisateurs 
  const [followersCount, setFollowersCount] = useState(0); // count (precook in route) 

  const [followed, setFollowed] = useState<FollowUser[]>([]);
  const [followedCount, setFollowedCount] = useState(0);
  
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowed, setShowFollowed] = useState(false);
  



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
          `${config.serverUrl}/user/profile`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({
          username: response.data.username,
          email: response.data.email,
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
    <div className="min-h-screen bg-black text-white w-full md:ml-[20px] ml-0">
      
      {/* page de profil */}
      {isEditing ? (
        <EditProfileForm userData={userData} setIsEditing={setIsEditing} />
      ) : isUploading ? ( 
          <UploadButton 
            userData={userData} 
            setIsUploading={setIsUploading} 
          /> ) : (
        
        <div className="max-w-4xl mx-auto p-4">
          {/* Section du profil header - adaptée pour mobile et desktop */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8">
            {/* Photo de profil - centrée sur mobile, alignée à gauche sur desktop */}
            <div className="flex justify-center sm:justify-start mb-6 sm:mb-0">
              <img
                src={`${config.serverUrl}/user/profile-picture/${userData.profile_picture}` || `${config.serverUrl}/user/profile-picture/default.jpg`}
                alt="Profile"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-gray-600"
              />
            </div>

            {/* Infos du profil */}
            <div className="flex-1">
              {/* Nom d'utilisateur et boutons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <h2 className="text-xl font-bold text-center sm:text-left mb-3 sm:mb-0">{userData.username}</h2>

                {/* Buttons groupés dans un flex-wrap pour s'adapter aux petits écrans */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <button   
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm cursor-pointer">
                    Modifier le profil
                  </button>
                  
                  <button 
                    onClick={() => setIsUploading(true)}
                    className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm cursor-pointer">
                    Photo de profil
                  </button> 

                  <button className="text-gray-400 text-xl cursor-pointer">⚙️</button>
                </div>
              </div>

              {/* Statistiques - adaptées pour être responsives */}
              <div className="flex justify-center sm:justify-start space-x-6 mt-4 text-gray-300">
                {isLoadingFollowers ? (
                  <>
                    <span><strong>...</strong> posts</span>
                    <span><strong>...</strong> abonnés</span>
                    <span><strong>...</strong> abonnements</span>
                  </>
                ) : (
                  <>
                    <span><strong>0</strong> posts</span>

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

              {/* Bio et site web - alignés au centre sur mobile, à gauche sur desktop */}
              <div className="mt-4 text-center sm:text-left">
                <p>{userData.bio || "Vous n'avez pas de bio !"}</p>
                <p className="text-sm mt-2 text-blue-400">{userData.website || ""}</p>
              </div>
            </div>
          </div>

          {/* Stories Highlights - adaptées pour être responsives */}
          <div className="mt-8 flex justify-center sm:justify-start space-x-6 overflow-x-auto pb-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-gray-600 flex items-center justify-center rounded-full">
                <span className="text-2xl">➕</span>
              </div>
              <p className="text-sm mt-2">Nouveau</p>
            </div>
          </div>

          {/* Navigation Posts - adaptée pour être responsive */}
          <div className="border-t border-gray-700 mt-8 flex justify-center space-x-2 sm:space-x-10 py-2 overflow-x-auto">
            <span className="text-white font-bold p-2 hover:border hover:border-white rounded-lg cursor-pointer whitespace-nowrap">📷 POSTS</span>
            <span className="text-gray-500 p-2 hover:border hover:border-white rounded-lg cursor-pointer whitespace-nowrap">🔖 SAUVEGARDÉS</span>
            <span className="text-gray-500 p-2 hover:border hover:border-white rounded-lg cursor-pointer whitespace-nowrap">🏷️ IDENTIFIÉ</span>
          </div>

          {/* Section Share Photos - adaptée pour être responsive */}
          <div className="text-center mt-8 px-4">
            <h3 className="text-xl font-bold mt-2">Partage tes photos</h3>
            <p className="text-gray-400 mt-2">
              Quand tu partages des photos et vidéos, elles apparaissent sur ton profil.
            </p>
            <button className="text-blue-500 mt-3 cursor-pointer font-semibold">Partager ta première photo</button>
          </div>
        </div>
      )}

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

export default Profile;
