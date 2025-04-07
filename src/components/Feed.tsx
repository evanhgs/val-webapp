import React from "react";
import config from "../config";



interface UserFeedProps { // cette interface n'accepte que les props avec le type array et NON un objet contenant un tableau 
  userFeed: Array<any>
}

export const Feed: React.FC<UserFeedProps> = ({userFeed}) => {

  {/** structuration idéale d'un post
      const examplePosts = [
    {
      id: 1,
      username: 'utilisateur_1',
      avatar: 'default.jpg',
      image: 'placeholder1',
      caption: 'Belle journée aujourd\'hui! #sunshine',
      likes: 124,
      comments: 23,
      timeAgo: '2h',
    },
  ]; 
  
  // vrai tableau json renvoyé pour l'instant 
  // {
            "caption": "Look this cool picture !",
            "created_at": "2025-03-17 15:15:51.394491",
            "id": "c7013664-db3d-45c5-a3c5-2680448170c6",
            "image_url": "colin-watts-F7Sg9CovAVA-unsplash.jpg",
            "user_id": "28ff42af-b87c-4e4c-8051-3365547674d2",
            "user_profile": "colin-watts-eYXrvDWeJWs-unsplash.jpg",
            "username": "test"
        },
  */}
  

  return (
    <div className="flex flex-col space-y-6">
      {userFeed.map((post) => (
        <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          {/* Header du post */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <img 
                src={post.user_profile ? `${config.serverUrl}/user/profile-picture/${post.user_profile}` : `${config.serverUrl}/user/profile-picture/default.jpg`}
                alt={post.username}
                className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-700"
              />
              <span className="font-semibold text-sm">{post.username}</span>
            </div>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
          
          {/* Image du post */}
          <div className="aspect-square bg-gray-800 w-full flex items-center justify-center">
            <img 
              src={post.image_url ? `${config.serverUrl}/user/profile-picture/${post.image_url}` : `${config.serverUrl}/user/profile-picture/default.jpg`} 
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Actions du post */}
          <div className="p-3">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-4">
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
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
            <p className="font-semibold text-sm mb-1">{post.likes} J'aime</p>
            
            {/* Caption */}
            <p className="text-sm">
              <span className="font-semibold mr-1">{post.username}</span>
              {post.caption}
            </p>
            
            {/* Voir les commentaires */}
            <p className="text-gray-400 text-sm mt-1 cursor-pointer">
              Voir les {post.comments} commentaires
            </p>
            
            {/* Temps écoulé */}
            <p className="text-gray-500 text-xs mt-2">Il y a {post.timeAgo}</p>
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
            <button className="text-blue-500 font-semibold text-sm">Publier</button>
          </div>
        </div>
      ))}
    </div>
  );
};