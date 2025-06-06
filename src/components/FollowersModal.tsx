import config from "../config";
import { useNavigate } from 'react-router-dom';
import FollowButton from "./FollowButton";
import UseOutsideClickDetector from "./OutsideClickDetector";
import { FollowUser } from '../types/followProps';

// pop up des listes des abonnés / abonnements
export const FollowersModal = ({ users, title, onClose }: { users: FollowUser[], title: string, onClose: () => void }) => {
    const navigate = useNavigate();
    const foreignProfile = (username: string): void => {
        navigate(`/profile/${username}`);
    };
    const searchContainerRef = UseOutsideClickDetector(() => {
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
                        users.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                                onClick={() => {
                                    foreignProfile(user.username);
                                    onClose();
                                }}
                            >
                                <img
                                    src={user.profile_picture ? `${config.serverUrl}/user/profile-picture/${user.profile_picture}` : `${config.serverUrl}/user/profile-picture/default.jpg`}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{user.username}</span>
                                <FollowButton user={user} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

