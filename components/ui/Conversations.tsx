import {useContext} from "react";
import {AuthContext} from "@/components/providers/AuthProvider";
import {Conversation} from "@/types/Message";
import {ApiEndpoints} from "@/lib/endpoints";

export const Conversations = ({conversations, onSelectConv}: {conversations: Conversation[], onSelectConv: (id: number) => void }) => {

    const { user } = useContext(AuthContext) || {};

    // only display a different user
    const getOtherUser = (conversation: Conversation) => {
        if (String(user?.id) === String(conversation.user1.id)) {
            return conversation.user2;
        }
        return conversation.user1;
    };

    return (
        <ul className="divide-y divide-white/5">

            <li className="p-4 text-xs text-zinc-400 tracking-wide">
                Mes conversations
            </li>

            {conversations.length === 0 ? (
                <li className="p-4 text-sm text-zinc-500">
                    Aucune conversation pour l’instant
                </li>
            ) : (
                conversations.map((conversation: Conversation) => {
                    const otherUser = getOtherUser(conversation);

                    return (
                        <li
                            key={conversation.id}
                            onClick={() => onSelectConv(conversation.id)}
                            className="flex items-center gap-3 p-4 cursor-pointer
                       hover:bg-zinc-800 transition"
                        >
                            <img
                                src={ApiEndpoints.user.picture(otherUser.profile_picture) ?? ApiEndpoints.user.defaultPicture()}
                                alt={otherUser.username}
                                className="w-11 h-11 rounded-full object-cover border border-white/10"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {otherUser.username}
                                </p>
                                <p className="text-xs text-zinc-500 truncate">
                                    {conversation?.last_message || "Aucun message"}
                                </p>
                            </div>

                            <button className="p-2 rounded-lg hover:bg-white/10 transition text-zinc-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="6" r="1"></circle>
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="12" cy="18" r="1"></circle>
                                </svg>
                            </button>
                        </li>
                    );
                })
            )}
        </ul>
    );
};
