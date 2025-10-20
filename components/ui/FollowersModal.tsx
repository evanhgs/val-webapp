'use client';

import {FollowUser} from "@/types/Follow";
import {useRouter} from "next/navigation";
import outsideClick from "@/components/ui/OutsideClick";
import {ApiEndpoints} from "@/lib/endpoints";
import FollowButton from "@/components/ui/FollowButton";

export const FollowersModal = (
    { users, title, onClose }: {
        users: FollowUser[],
        title: string,
        onClose: () => void
    }) => {

    const navigate = useRouter();

    const foreignProfile = (username: string): void => {
        navigate.push(`/profile/${username}`);
    };
    const searchContainerRef = outsideClick(() => {
        onClose();
    });



    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-96 max-h-[80vh] overflow-y-auto" ref={searchContainerRef}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-xl">×</button>
                </div>
                <div className="p-4">
                    {users.length === 0 ? (
                        <p className="text-center text-gray-400">Aucun résultat</p>
                    ) : (
                        users.map((userFetched, index) => (
                            <div
                                key={userFetched?.id ?? index}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                                onClick={() => {
                                    foreignProfile(userFetched.username);
                                    onClose();
                                }}
                            >
                                <img
                                    src={userFetched.profile_picture ? ApiEndpoints.user.picture(userFetched.profile_picture) : ApiEndpoints.user.defaultPicture()}
                                    alt={userFetched.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{userFetched.username}</span>
                                <FollowButton username={userFetched.username}/>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};