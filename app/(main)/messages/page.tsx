'use client';

import {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/components/providers/AuthProvider";
import {useAlert} from "@/components/providers/AlertContext";
import {Conversation} from "@/types/Message";
import {ApiEndpoints, AxiosInstance} from "@/lib/endpoints";
import Chats from "@/components/ui/Chats";
import {Conversations} from "@/components/ui/Conversations";

export default function MessagesPage(){

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
        <div className="max-w-5xl mx-auto my-12 px-4">
            <div className="relative rounded-2xl overflow-hidden
                    bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
                    border border-white/5
                    shadow-[0_0_40px_rgba(255,255,255,0.05)]
                    min-h-[650px] flex flex-col md:flex-row">

                {/* Liste conversations */}
                <div className={`${selectedConvId ? "md:w-1/3 w-full max-h-[160px] md:max-h-none" : "w-full md:w-1/3"}
                       border-r border-white/5 overflow-y-auto`}>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-zinc-400">
                            Chargement...
                        </div>
                    ) : (
                        <Conversations
                            conversations={conversationList || []}
                            onSelectConv={(id) => setSelectedConvId(id)}
                        />
                    )}
                </div>

                {/* Chat */}
                <div className="flex-1">
                    {selectedConvId ? (
                        <Chats convId={selectedConvId} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-500">
                            Sélectionne une conversation
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

