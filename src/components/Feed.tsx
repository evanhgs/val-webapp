import config from "../config";
import FollowButton from "./FollowButton";
import { PostSettings } from "./PostSettings";
import { UserFeedProps } from '../types/feed';
import { LikeButton } from "./LikeButton";
import { useNavigate } from "react-router-dom";

export const Feed: React.FC<UserFeedProps> = ({ userFeed }) => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-6">
      {userFeed.map((post) => (
        <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          {/* Header du post */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <img
                src={post.user_profile_url ? `${config.serverUrl}/user/picture/${post.user_profile_url}` : `${config.serverUrl}/user/picture/default.jpg`}
                alt={post.username}
                className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-700"
              />
              <div className="ml-3 cursor-pointer">
                <button className="font-bold text-sm" onClick={() => { navigate(`/profile/${post.username}`) }}>{post?.username}</button>
              </div>
            </div>
            <div className="ml-auto mr-16">
              <FollowButton username={post.username}/>
            </div>
            {/* settings of your own post */}
            {post && <PostSettings post={post} />}
          </div>

          {/* Image du post */}
          <div className="aspect-square bg-gray-800 w-full flex items-center justify-center">
            <img
              src={post.image_url ? `${config.serverUrl}/user/picture/${post.image_url}` : `${config.serverUrl}/user/picture/default.jpg`}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Actions du post */}
          <div className="p-3">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-4">

                <LikeButton postId={post?.id} userId="" id="" createdAt="" />
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>

            {/* Nombres de likes */}
            <p className="font-semibold text-sm mb-1">{/*post.likes*/} J'aime</p>

            {/* Caption */}
            <p className="text-sm">
              <span className="font-semibold mr-1">{post.username}</span>
              {post.caption}
            </p>

            {/* Voir les commentaires */}
            <p className="text-gray-400 text-sm mt-1 cursor-pointer">
              Voir les {/*post.comments*/} commentaires
            </p>

            {/* Temps écoulé */}
            <p className="text-gray-500 text-xs mt-2">Post publié le {post?.created_at.substring(5, 10) || 'YYYY/MM/dd'} à {post?.created_at.substring(10, 16) || 'hh/mm'}</p>
          </div>

          {/* Ajouter un commentaire */}
          <div className="flex items-center border-t border-gray-800 p-3">
            <button className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Ajouter un commentaire..."
              className="bg-transparent flex-grow outline-none text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};