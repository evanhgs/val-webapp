import FollowButton from "../../components/UIX/FollowButton.tsx";
import {PostSettings} from "../../components/Forms/PostSettings.tsx";
import {UserFeedProps} from '../../types/Feed.ts';
import {PostActions} from "../../components/Forms/PostActions.tsx";
import {useNavigate} from "react-router-dom";
import React from "react";
import {Config} from "../../config/config.ts";
import {pipeDate} from "../../config/PipeDate.ts";

export const Page: React.FC<UserFeedProps> = ({ userFeed }) => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-6">
      {userFeed.map((post) => (
        <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          {/* Header du post */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <img
                src={post.user_profile ? Config.user.picture(post.user_profile) : Config.user.defaultPicture()}
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
              src={post.image_url ? Config.user.picture(post.image_url) : Config.user.defaultPicture()}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>

            {/* Caption */}
            {post?.caption && (
                <div className="p-4 border-b">
                    <p className="text-sm">
                        <span className="font-bold mr-1">{post.username || '...'}: </span>
                        <span>{post.caption || '...'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Post publié le : {pipeDate(post?.created_at) || 'dd/mm/YYYY'}
                    </p>
                </div>
            )}
            {/* Post actions */}
            <div className="p-4 ">
                <div className="flex items-center">
                    <PostActions postId={post?.id}/>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};
