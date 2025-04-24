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
import { AlertContext } from "../components/AlertContext.tsx";
import { NavPosts } from "../components/NavPosts";


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

// type pour la popup
interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface Post {
  caption: string;
  created_at: string;
  image_url: string;
  user_profile: string;
  username: string;
  id: string;
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
  
  const [alert, setAlert] = useState<AlertProps | null>(null);

  const [post, setPost] = useState<Post[]>([]);
  


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
  }, [token, navigate]);


  useEffect(() => {
    const fetchFollowers =async () => {
      if (!token || !userData) return;

      try {
        setIsLoadingFollowers(true);

        const followerResponse = await axios.get(`${config.serverUrl}/follow/get-follow/${userData.username}`);
        const followedResponse = await axios.get(`${config.serverUrl}/follow/get-followed/${userData.username}`);
        const postResponse = await axios.post(
          `${config.serverUrl}/post/get-user/${userData.username}`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        //console.log(postResponse);

        setFollowers(followerResponse.data.followers);
        setFollowersCount(followerResponse.data.count);
        setFollowed(followedResponse.data.followed);
        setFollowedCount(followedResponse.data.count);
        setPost(postResponse.data.post || []);

      } catch (error) {
          console.error("Erreur lors de la récupération des abonnés/abonnements", error);
      } finally {
        setIsLoadingFollowers(false);
      }
    };
    fetchFollowers();
  }, [token, userData]); 

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

  // fonction de callback pour envoyer l'alert à l'enfant (-> récupérer le message et le type ) 
  // et ensuite le conserver puis l'afficher ici
  // Interface for the alert popup handler parameters
  interface AlertHandlerParams {
    message: string;
    type: 'success' | 'error' | 'info';
  }


  const handleAlertPopup = ({ message, type }: AlertHandlerParams): void => {
    setAlert({
      message,
      type
    });
  };

  return (
    <div className="min-h-screen bg-black text-white w-full md:ml-[20px] ml-0">
      {alert && <AlertContext message={alert.message} type={alert.type}/>}
      {/* page de profil */}
      {isEditing ? (
        <EditProfileForm 
          userData={userData} 
          setIsEditing={setIsEditing} 
          onUpdateAlert={handleAlertPopup}/>
      ) : isUploading ? ( 
          <UploadButton 
            userData={userData} 
            setIsUploading={setIsUploading} 
          /> ) : (
        
        <div className="max-w-4xl mx-auto p-4">
          {/* Section du profil header*/}
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8">
            {/* Photo de profil  */}
            <div className="flex justify-center sm:justify-start mb-6 sm:mb-0">
              <img
                src={`${config.serverUrl}/user/profile-picture/${userData.profile_picture}` || `${config.serverUrl}/user/profile-picture/default.jpg`}
                alt="Profile"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-gray-600"
              />
            </div>

            {/* Infos du profil */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <h2 className="text-xl font-bold text-center sm:text-left mb-3 sm:mb-0">{userData.username}</h2>
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

              {/* Statistiques  */}
              <div className="flex justify-center sm:justify-start space-x-6 mt-4 text-gray-300">
                {isLoadingFollowers ? (
                  <>
                    <span><strong>...</strong> posts</span>
                    <span><strong>...</strong> abonnés</span>
                    <span><strong>...</strong> abonnements</span>
                  </>
                ) : (
                  <>
                    <span><strong>{(post?.length ?? 0)}</strong> posts</span>

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

              {/* Bio et site web */}
              <div className="mt-4 text-center sm:text-left">
                <p>{userData.bio || "Vous n'avez pas de bio !"}</p>
                <p className="text-sm mt-2 text-blue-400">{userData.website || ""}</p>
              </div>
            </div>
          </div>

          {/* Stories Highlights */}
          <div className="mt-8 flex justify-center sm:justify-start space-x-6 overflow-x-auto pb-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-gray-600 flex items-center justify-center rounded-full">
                <span className="text-2xl">➕</span>
              </div>
              <p className="text-sm mt-2">Nouveau</p>
            </div>
          </div>

          {/* Navigation Posts */}
          <NavPosts post={post}/>
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
