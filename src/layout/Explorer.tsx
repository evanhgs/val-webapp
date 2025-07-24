import { useContext, useEffect, useState } from "react";
import { UserFeedProps } from "../types/feed";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { NavPosts } from "../components/NavPosts";
import {useAlert} from "../components/AlertContext.tsx";
import {ApiEndpoints, AxiosInstance} from "../services/apiEndpoints.ts";

const Explorer = () => {

    const [error] = useState<string | null>(null);
    const [globalFeed, setGlobalFeed] = useState<UserFeedProps | null>(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;
    const { showAlert } = useAlert();
    
    useEffect(() => {
        const fetchExplorerFeed = async () => {
            try {
                if (!token) {
                    showAlert("Vous devez vous connecter pour voir le feed global", "info");
                    navigate("/login");
                    return;
                }
                const response = await AxiosInstance.get(ApiEndpoints.post.feedGlobal());
                
                setGlobalFeed({
                    userFeed: response.data.content
                });
            } catch (error) {
                showAlert(`Error lors du chargement de la page d'exploration: ${error}`, "error");
            }
        };
        fetchExplorerFeed();
    }, []);

    return (
        <>
            {error && <div className="error-message">{error}</div>}

            <div className="px-[20%]">
                <div className="my-6 pl-2 ">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center text-white bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2 transition duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour
                    </button>
                </div>
                <NavPosts post={globalFeed?.userFeed || []} />
            </div>

        </>
    );
}

export default Explorer;
