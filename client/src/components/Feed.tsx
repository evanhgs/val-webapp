import React from "react";

export const Feed: React.FC = () => {
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
    {
      id: 2,
      username: 'utilisateur_2',
      avatar: 'default.jpg',
      image: 'placeholder2',
      caption: 'Moment parfait en ville #citylife #weekend',
      likes: 89,
      comments: 12,
      timeAgo: '4h',
    },
    {
      id: 3,
      username: 'utilisateur_3',
      avatar: 'default.jpg',
      image: 'placeholder3',
      caption: 'Nouvelle création! Qu\'en pensez-vous? #art #creation',
      likes: 245,
      comments: 42,
      timeAgo: '6h',
    }
  ];

  return (
    <div className="flex flex-col space-y-6">
      {examplePosts.map((post) => (
        <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          {/* Header du post */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <img 
                src={`/api/placeholder/${32}/${32}`} 
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
              src={`/api/placeholder/${470}/${470}`} 
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