import {Chat} from "../components/Chat.tsx";
import {useContext, useEffect, useState} from "react";
import {Conversation} from "../types/message.ts";
import {AuthContext} from "../components/AuthContext.tsx";
import {useAlert} from "../components/AlertContext.tsx";
import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";
import {Conversations} from "../components/Conversations.tsx";


const Messages = () => {

    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [conversationList, setConversationList] = useState<Conversation[]>();
    //const [conversationContent, setConversationContent] = useState<ConversationContent | null>(null);

    useEffect(() => {
        if (!token) return;
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const allConvResponse = await AxiosInstance.get(ApiEndpoints.message.getAllConversation());
                console.log("API response:", allConvResponse.data);
                setConversationList(allConvResponse.data ?? []);
            } catch (error) {
                showAlert(`Une erreur est survenue: ${error}`, 'error')
            } finally {
                setIsLoading(false);
        }
    }
    fetchConversations();
    }, [token]);

    return (
        <div className="max-w-4xl mx-auto my-8 flex min-h-[650px] h-auto rounded-2xl">
            <div className="w-full">
                { isLoading ? (
                    <span className="loading loading-spinner loading-xl "></span>
                ) : (
                    <Conversations conversations={conversationList || []} />
                )}
            </div>

            <div className="divider lg:divider-horizontal"></div>

            <div className="w-full">
                <Chat />
            </div>
        </div>
    );
};

export default Messages;
