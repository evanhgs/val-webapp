import config from "../config";
import { useNavigate } from 'react-router-dom';
import FollowButton from "./FollowButton";
import UseOutsideClickDetector from "./OutsideClickDetector";
import { FollowPropertiesData, FollowUser } from '../types/followProps';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useFollowProperties } from "./FollowProperties";

// pop up des listes des abonnés / abonnements
export const FollowersModal = ({ users, title, onClose }: { users: FollowUser[], title: string, onClose: () => void }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext) || {};
    const foreignProfile = (username: string): void => {
        navigate(`/profile/${username}`);
    };
    const searchContainerRef = UseOutsideClickDetector(() => {
        onClose();
    });

    const [followDataMap, setFollowDataMap] = useState<Record<string, FollowPropertiesData | undefined>>({});

    useEffect(() => {                // users => list 
        if (!users || !user) return; // user => current user 
        const fetchAllFollowData = async () => {
            const newMap: Record<string, FollowPropertiesData | undefined> = {};
            await Promise.all(users.map(async (u) => { // lance en meme temps toutes les requetes 
                try {
                    const followInfo = await useFollowProperties(u?.username, user?.id);
                    newMap[u.id] = followInfo;
                } catch {
                    newMap[u.id] = undefined;
                }
            }));
            setFollowDataMap(newMap);
        };
        fetchAllFollowData();
    }, [users, user?.id]);


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
                                    src={userFetched.profile_picture ? `${config.serverUrl}/user/picture/${userFetched.profile_picture}` : `${config.serverUrl}/user/picture/default.jpg`}
                                    alt={userFetched.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{userFetched.username}</span>
                                <FollowButton
                                    user={userFetched}
                                    isFollowed={followDataMap[userFetched.id]?.isFollowed || false} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

