import { NavLink } from 'react-router-dom';
import config from '../config';
import { NavPostsProps } from '../types/post';

export const NavPosts = ({post}: NavPostsProps) => {
    return (
        <div className=""> {/** todo: implement tags */}
            

            <div className="text-center mt-8 px-4">
              {/** get all post from user and display like/comment relation in galery &&&&& clickable comp that redirect onto the post*/}
              {post.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                  {post.map((p, index) => (
                    <div key={`post-${index}`} className="aspect-square relative group cursor-pointer">
                      <NavLink to={`/post/${p.id}`}>
                    <img 
                      src={`${config.serverUrl}/user/profile-picture/${p.image_url}`}
                      alt={p.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <div className="text-white flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="mr-1">❤️</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-1">💬</span>
                        <span className="font-semibold">0</span>
                      </div>
                      </div>
                    </div>
                    </NavLink>
                    </div>
                  ))}
                  </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-2">Partage tes photos</h3>
                  <p className="text-gray-400 mt-2">
                    Quand tu partages des photos et vidéos, elles apparaissent sur ton profil.
                  </p>
                  <NavLink
                    to="/upload"
                    className="text-blue-500 mt-3 cursor-pointer font-semibold"
                  >
                      Partager ta première photo
                  </NavLink>
                </>
              )} 
            </div>
          </div>
    )
}