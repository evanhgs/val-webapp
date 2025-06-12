// affiche dans une liste les abonnés et abonnements de x personne 
// renvoie un boolean si le current user et abonné à cette personne 
// renvoie le nombre de followers et de followed + liste des followers et followed + boolean

import { FollowPropertiesData } from "../types/followProps"
import axios from "axios";
import config from '../config';

export const useFollowProperties = async (
    username: string,
    currentUserId?: string
): Promise<FollowPropertiesData> => {
    try {
        const [followerResponse, followedResponse] = await Promise.all([
            axios.get(`${config.serverUrl}/follow/get-follow/${username}`),
            axios.get(`${config.serverUrl}/follow/get-followed/${username}`)
        ]);

        const followers = followerResponse.data;
        const followed = followedResponse.data;

        const isFollowed = followers?.followers?.some((f: any) => f.id === currentUserId) ?? false;

        return {
            followers,
            followed,
            isFollowed
        };
    } catch (error) {
        console.error('Erreur lors du chargement des propriétés de suivi:', error);
        throw error;
    }
};