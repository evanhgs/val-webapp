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
        <div className="fixed inset-0 z-50 bg-zinc-950/70 flex items-center justify-center backdrop-blur-sm">
            <div
                ref={searchContainerRef}
                className="w-[26rem] max-h-[80vh] rounded-2xl overflow-hidden
                 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
                 border border-white/5
                 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-white/5">
                    <h3 className="text-lg font-semibold text-white tracking-wide">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">
                    {users.length === 0 ? (
                        <p className="text-center text-zinc-500 py-10">
                            Aucun résultat
                        </p>
                    ) : (
                        users.map((userFetched, index) => (
                            <div
                                key={userFetched?.id ?? index}
                                onClick={() => {
                                    foreignProfile(userFetched.username);
                                    onClose();
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer
                         bg-zinc-800 border border-white/5
                         shadow-inner shadow-black/30
                         hover:bg-zinc-700 hover:shadow-[0_10px_25px_rgba(255,255,255,0.08)]
                         transition"
                            >
                                <img
                                    src={
                                        userFetched.profile_picture
                                            ? ApiEndpoints.user.picture(userFetched.profile_picture)
                                            : ApiEndpoints.user.defaultPicture()
                                    }
                                    alt={userFetched.username}
                                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">
                                        {userFetched.username}
                                    </p>
                                </div>

                                <div onClick={(e) => e.stopPropagation()}>
                                    <FollowButton username={userFetched.username} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};