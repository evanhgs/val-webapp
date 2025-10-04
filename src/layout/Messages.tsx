import {Chat} from "./Chat.tsx";
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
    const [selectedConvId, setSelectedConvId] = useState<number | null>(null);

    useEffect(() => {
        if (!token) return;
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const allConvResponse = await AxiosInstance.get(ApiEndpoints.message.getAllConversation());
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
        <div className="max-w-4xl mx-auto my-8 min-h-[650px] h-auto rounded-2xl flex flex-col md:flex-row">
            <div className={selectedConvId ? ("md:w-1/3 w-full overflow-auto max-h-[100px] md:max-h-none "): ("w-full")}>
                { isLoading ? (
                    <span className="loading loading-spinner loading-xl "></span>
                ) : (
                    <Conversations
                        conversations={conversationList || []}
                        onSelectConv={(id) => setSelectedConvId(id)}
                    />
                )}
            </div>

            <div className="divider lg:divider-horizontal"></div>

            {selectedConvId ? (
                <div className="w-full mb-6">
                    <Chat convId={selectedConvId} /> {/*charge la conversation avec l'utilisateur sélectionné et va s'abonner au topic de la conv*/}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default Messages;
