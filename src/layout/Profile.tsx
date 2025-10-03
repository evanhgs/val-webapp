import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { Footer } from "../components/FooterComp";
import { useNavigate, useParams } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm";
import UploadButton from "../components/UploadProfilePic";
import { FollowersModal } from '../components/FollowersModal';
import { NavPosts } from "../components/NavPosts";
import { useAlert } from "../components/AlertContext";
import { FollowUser } from "../types/followProps";
import { PostDetails} from "../types/post";
import { UserProfile } from "../types/user";
import FollowButton from "../components/FollowButton";
import { ApiEndpoints, AxiosInstance } from "../services/apiEndpoints";
import SendMessageButton from "../components/SendMessageButton.tsx";

const Profile = () => {

  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // etats pour les modales et formulaire
  const [userData, setUserData] = useState<UserProfile | null>(null); // utilisateur affiché
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowed, setShowFollowed] = useState(false);

  // etats pour les followers data et posts 
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false)
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [followed, setFollowed] = useState<FollowUser[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followedCount, setFollowedCount] = useState(0);
  const [post, setPost] = useState<PostDetails[]>([]);

  const { username: urlUsername } = useParams<{ username: string }>();

  const isOwnProfile = !urlUsername || urlUsername === user?.username;
  const targetUsername = urlUsername || user?.username; // own user to default (mieux que rien) 



  /** tout en parallèle
   * fetch les posts (plus lourd)
   * fetch les données du profil
   * fetch les abonnés et abonnements
   * gestion des erreurs
  */

  // récupérer les données du profil
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        showAlert('Vous devez être connecté pour voir se profil', 'info');
        navigate('/login');
        return;
      }

      if (!targetUsername) {
        showAlert('Nom d\'utilisateur introuvable', 'error');
        return;
      }

      try {
        const endpoint = isOwnProfile ? ApiEndpoints.user.currentUserProfile() : ApiEndpoints.user.profile(targetUsername);
        
        const response = await AxiosInstance.get(endpoint);

        setUserData({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio || "",
          website: response.data.website || "",
          created_at: response.data.created_at,
          profile_picture: response.data.profile_picture,
        });
      } catch (error) {
        showAlert(`Impossible de récupérer les informations du profil : ${error}`, 'error');
      }
    };

    fetchProfile();
  }, [token, targetUsername, isOwnProfile, navigate]);


  // récupération des abonnés abonnements et posts
  useEffect(() => {
    if (!token || !userData?.username) return;
    const fetchProfileData = async () => {
      try {
        setIsLoadingFollowers(true);

        const [followedResponse, followerResponse, postResponse] = await Promise.all([ // ordre very important ^^
          AxiosInstance.get(ApiEndpoints.follow.getFollowed(userData.username)),
          AxiosInstance.get(ApiEndpoints.follow.getFollowers(userData.username)),
          AxiosInstance.get(ApiEndpoints.post.feed(userData.username))
        ]);

        setFollowed(followedResponse.data.followed || []);
        setFollowedCount(followedResponse.data.count || 0);
        setFollowers(followerResponse.data.followers || []);
        setFollowersCount(followerResponse.data.count || 0);
        const posts = (postResponse.data.content || []).map((item: {
          post: PostDetails;
          likes: number;
          comments: number
        }) => ({
          ...item.post,
          likes: item.likes,
          comments: item.comments,
        }));
        setPost(posts);

      } catch (error) {
        showAlert(`Une erreur est survenue lors de la récupération des données de l'utilisateur: ${error}`, 'error');
      } finally {
        setIsLoadingFollowers(false);
      }
    };
    fetchProfileData();
  }, [token, userData?.username]);

  if (!userData) {
    return (
      <div className="text-white text-center mt-10">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white w-full md:ml-[20px] ml-0">
      {/* Formulaires modaux pour le profil personnel uniquement */}
      {isOwnProfile && isEditing ? (
        <EditProfileForm
          userData={userData as UserProfile}
          setIsEditing={setIsEditing}
          onUpdateAlert={showAlert}
        />
      ) : isOwnProfile && isUploading ? (
        <UploadButton
          userData={userData as UserProfile}
          setIsUploading={setIsUploading}
        />
      ) : (
        <div className="max-w-4xl mx-auto p-4">
          {/* Bouton retour */}
          <div className="mb-4 pl-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </button>
          </div>

          {/* Section header du profil */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8">
            {/* Photo de profil */}
            <div className="flex justify-center sm:justify-start mb-6 sm:mb-0">
              <img
                src={userData.profile_picture ? ApiEndpoints.user.picture(userData.profile_picture) : ApiEndpoints.user.defaultPicture()}
                alt="Profile"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-gray-600"
              />
            </div>

            {/* Informations du profil */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <h2 className="text-xl font-bold text-center sm:text-left mb-3 sm:mb-0">
                  {userData.username}
                </h2>

                {/* Boutons d'action selon le type de profil */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {isOwnProfile ? (
                    // Boutons pour son propre profil
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
                      >
                        Modifier le profil
                      </button>
                      <button
                        onClick={() => setIsUploading(true)}
                        className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
                      >
                        Photo de profil
                      </button>
                      <button className="text-gray-400 text-xl hover:text-white transition-colors cursor-pointer">
                        ⚙️
                      </button>
                    </>
                  ) : (
                    // Bouton de suivi pour les autres profils
                      <>
                          <FollowButton username={userData.username} />
                          <SendMessageButton username={userData.id} />
                      </>
                  )}
                </div>
              </div>

              {/* Statistiques */}
              <div className="flex justify-center sm:justify-start space-x-6 mt-4 text-gray-300">
                {isLoadingFollowers ? (
                  <>
                    <span><strong>...</strong> posts</span>
                    <span><strong>...</strong> abonnés</span>
                    <span><strong>...</strong> abonnements</span>
                  </>
                ) : (
                  <>
                    <span><strong>{post?.length ?? 0}</strong> posts</span>
                    <span
                      className="hover:text-white cursor-pointer transition-colors"
                      onClick={() => setShowFollowers(true)}
                    >
                      <strong>{followersCount}</strong> abonnés
                    </span>
                    <span
                      className="hover:text-white cursor-pointer transition-colors"
                      onClick={() => setShowFollowed(true)}
                    >
                      <strong>{followedCount}</strong> abonnements
                    </span>
                  </>
                )}
              </div>

              {/* Bio et site web */}
              <div className="mt-4 text-center sm:text-left">
                <p>{userData.bio}</p>
                {userData.website && (
                  <p className="text-sm mt-2 text-blue-400 hover:text-blue-300 transition-colors">
                    {userData.website}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stories Highlights (affiché uniquement sur son propre profil) */}
          {isOwnProfile && (
            <div className="mt-8 flex justify-center sm:justify-start space-x-6 overflow-x-auto pb-2">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-2 border-gray-600 flex items-center justify-center rounded-full hover:border-gray-500 transition-colors cursor-pointer">
                  <span className="text-2xl">➕</span>
                </div>
                <p className="text-sm mt-2">Nouveau</p>
              </div>
            </div>
          )}

          {/* Navigation Posts */}
          <div className="border-t border-gray-700 mt-8 flex justify-center space-x-2 sm:space-x-10 py-2 overflow-x-auto">
            <span className="text-white font-bold p-2 hover:border hover:border-white rounded-lg cursor-pointer whitespace-nowrap transition-all">
              📷 POSTS
            </span>
            {isOwnProfile && (
              <span className="text-gray-500 p-2 hover:border hover:border-white hover:text-white rounded-lg cursor-pointer whitespace-nowrap transition-all">
                🔖 SAUVEGARDÉS
              </span>
            )}
            <span className="text-gray-500 p-2 hover:border hover:border-white hover:text-white rounded-lg cursor-pointer whitespace-nowrap transition-all">
              🏷️ IDENTIFIÉ
            </span>
          </div>

          {/* Grille des posts */}
          <NavPosts post={post} />
        </div>
      )}

      {/* Modales des abonnés/abonnements */}
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
