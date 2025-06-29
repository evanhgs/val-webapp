import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import { Footer } from "../components/FooterComp";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import config from '../config';
import { FollowersModal } from '../components/FollowersModal';
import { NavPosts } from "../components/NavPosts";
import FollowButton from "../components/FollowButton.tsx";
import { UserProfile } from '../types/user.ts';
import { Post } from '../types/post.ts';
import { useAlert } from "../components/AlertContext.tsx";
import { FollowPropertiesData } from "../types/followProps.ts";

const ForeignProfile = () => {

  const [userData, setUserData] = useState<UserProfile | null>(null); // donnée du profil de la page
  const [followData, setFollowData] = useState<FollowPropertiesData | null>(null);
  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowed, setShowFollowed] = useState(false);

  // Récupérer le paramètre username de l'URL
  const { username } = useParams<{ username: string }>();
  const [post, setPost] = useState<Post[]>([]);

  // setup le profil du frero de la page
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !username) {
        showAlert("Vous devez etre connecté pour voir votre profil.", "info");
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(
          `${config.serverUrl}/user/profile/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({
          username: response.data.username,
          bio: response.data.bio || "Aucune bio disponible.",
          website: response.data.website || "",
          created_at: response.data.created_at || "",
          profile_picture: response.data.profile_picture || "default.jpg",
        });
      } catch (error) {
        showAlert("Impossible de récupérer les infos du profil.", "error");
      }
    };
    fetchProfile();
  }, [token, username, navigate]);


  // fetch les posts de l'utilisateur de la page
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userData?.username || !token) return;
      try {
        setIsLoading(true);
        const postResponse = await axios.get(
          `${config.serverUrl}/post/feed/${userData.username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPost(postResponse.data.post || []);
      } catch (error) {
        showAlert('Une erreur est survenue lors du chargement des posts', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [userData?.username, token]);

  if (!userData) {
    return (
      <div className="text-white text-center mt-10">
        <p>Chargement...</p>
      </div>
    )
  }
  console.log("followData complet", followData);

  return (
    <div className="min-h-screen bg-black text-white w-full md:ml-[20px] ml-0">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 pl-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 transition duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8">
          <div className="flex justify-center sm:justify-start mb-6 sm:mb-0">
            <img
              src={`${config.serverUrl}/user/picture/${userData.profile_picture}` || `${config.serverUrl}/user/picture/default.jpg`}
              alt="Profile"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-gray-600"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <h2 className="text-xl font-bold text-center sm:text-left mb-3 sm:mb-0">{userData?.username}</h2>
              <FollowButton username={userData?.username}/>
            </div>

            <div className="flex justify-center sm:justify-start space-x-6 mt-4 text-gray-300">
              {isLoading ? (
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
                    <strong>{followData?.followers?.count ?? 0}</strong> abonnés
                  </span>

                  <span
                    className="hover:text-white cursor-pointer"
                    onClick={() => setShowFollowed(true)}>
                    <strong>{followData?.followed?.count ?? 0}</strong> abonnements
                  </span>
                </>
              )}
            </div>

            <div className="mt-4 text-center sm:text-left">
              <p>{userData.bio || "Vous n'avez pas de bio !"}</p>
              <p className="text-sm mt-2 text-blue-400">{userData.website || ""}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center sm:justify-start space-x-6 overflow-x-auto pb-2">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-gray-600 flex items-center justify-center rounded-full">
              <span className="text-2xl">➕</span>
            </div>
            <p className="text-sm mt-2">Nouveau</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 flex justify-center space-x-2 sm:space-x-10 py-2 overflow-x-auto">
          <span className="text-white font-bold p-2 hover:border hover:border-white rounded-lg cursor-pointer whitespace-nowrap">📷 POSTS</span>
          <span className="text-gray-500 p-2 hover:border hover:border-white rounded-lg cursor-pointer whitespace-nowrap">🏷️ IDENTIFIÉ</span>
        </div>
        <NavPosts post={post} />

      </div>

      {showFollowers && (
        <FollowersModal
          users={followData?.followers?.followers || []}
          title="Abonnés"
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowed && (
        <FollowersModal
          users={followData?.followed?.followed || []}
          title="Abonnements"
          onClose={() => setShowFollowed(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default ForeignProfile;
