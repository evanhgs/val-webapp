'use client';

import {UserFeedProps} from "@/types/Feed";
import React from "react";
import {useRouter} from "next/navigation";
import {ApiEndpoints} from "@/lib/endpoints";
import {pipeDate} from "@/lib/pipe-dates";
import FollowButton from "@/components/ui/FollowButton";
import {PostSettings} from "@/components/ui/PostSettings";
import {PostActions} from "@/components/ui/PostActions";

export const Feed: React.FC<UserFeedProps> = ({ userFeed }) => {

    const navigate = useRouter();

    if (userFeed.length === 0) {
        return (
            <div className="flex w-52 flex-col gap-4">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-6">
            {userFeed.map((post) => (
                <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                    {/* Header du post */}
                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center">
                            <img
                                src={post.user_profile ? ApiEndpoints.user.picture(post.user_profile) : ApiEndpoints.user.defaultPicture()}
                                alt={post.username}
                                className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-700"
                            />
                            <div className="ml-3 cursor-pointer">
                                <button className="font-bold text-sm" onClick={() => { navigate.push(`/profile/${post.username}`) }}>{post?.username}</button>
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
                            src={post.image_url ? ApiEndpoints.user.picture(post.image_url) : ApiEndpoints.user.defaultPicture()}
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
