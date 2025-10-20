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
        <>
            <ul className="list bg-base-100 rounded-box shadow-md" key="conversation">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide" key="title">Mes conversations</li>
                {conversations.length === 0 ? (
                    <li className="p-4 text-sm opacity-70" key="nothing">Aucune conversation pour l'instant</li>
                ) : (
                    conversations.map((conversation: Conversation) => {
                        const otherUser = getOtherUser(conversation);
                        return (
                            <li
                                className="list-row hover:cursor-pointer hover:bg-gray-500"
                                key={conversation.id}
                                onClick={() => onSelectConv(conversation.id)}
                            >
                                <div>
                                    <img
                                        className="size-10 rounded-box"
                                        src={ApiEndpoints.user.picture(otherUser.profile_picture) ?? ApiEndpoints.user.defaultPicture()}
                                        alt={otherUser.username}
                                    />
                                </div>
                                <div>
                                    <div>{otherUser.username}</div>
                                    <div className="text-xs uppercase font-semibold opacity-60"></div> {/*put the last message sent?*/}
                                </div>
                                <button className="btn btn-square btn-ghost">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </>
    );
};
