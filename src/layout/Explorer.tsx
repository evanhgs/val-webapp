import { useContext, useEffect, useState } from "react";
import { UserFeedProps } from "../types/feed";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";
import axios from "axios";
import { NavPosts } from "../components/NavPosts";

const Explorer = () => {
    
    const [error, setError] = useState<string|null>(null);
    const [globalFeed, setGlobalFeed] = useState<UserFeedProps | null>(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext) || {};
    const token = user?.token;

    useEffect(() => {
        const fetchExplorerFeed = async () => {
            try {
                if (!token) {
                    setError("Vous devez vous connecter pour voir le feed global");
                    navigate("/login");
                    return;
                }
                const response = await axios.get(
                    `${config.serverUrl}/post/feed/global`,
                    { headers: { Authorization: `Bearer ${token}`}}
                );
                setGlobalFeed({
                    userFeed: response.data.content
                });
            } catch (error) {
                setError("Error lors du chargement de la page d'exploration");
            }
        };
        fetchExplorerFeed();
    }, []);

    return (
        <>
            {error && <div className="error-message">{error}</div>}
            <NavPosts post={globalFeed?.userFeed || []}/>
        </>
    );
}

export default Explorer;
