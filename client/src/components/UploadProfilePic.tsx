import { useState } from 'react';
import axios from 'axios';
import config from '../config';

// Typage des données utilisateur et des props du composant
interface UserData { profile_picture: string}
interface UploadButtonProps {
    userData: UserData;
    setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadButton: React.FC<UploadButtonProps> = ({userData, setIsUploading}) => {

    // états locaux des composants, stockage de variable temporaire
    const [error, setError ] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<string>(userData.profile_picture || "",);

    // s'execute quand un fichier est sélectionné dans (input type=file)
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>)=> {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(URL.createObjectURL(file)); // création d'une url temp pour l'aperçu
            try {
                const formData = new FormData(); // form precook pour envoyer des medias (??)
                formData.append("file", file); // coté serveur on attend "file" comme nom /!\

                await axios.post(`${config.serverUrl}/user/upload-profile-picture`, formData, {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem("token")}`, 
                        "Content-Type": "multipart/form-data" }, // indique bien qu'on envoie un média (combinaison de texte) : merci google
                }).then(response => {
                    console.log(response.data);
                }).catch(error => {
                    console.log(error);
                });
                setIsUploading(false);
            } catch (error) {
                setError("Erreur de l'upload de la photo de profil")
            }
        } else {
            setError('Aucune image sélectionnée')
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Modifier la photo de profil</h2>
                <button
                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsUploading(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                </button>
            </div>
            <p>Veuillez choisir votre nouvelle photo de profil en cliquant sur le bouton.</p>
            <input 
                type='file' 
                className='bg-gray-800 text-white px-3 py-1 rounded-md text-sm cursor-pointer'
                onChange={handleChange}
            />
            {error && <p className='text-red-500'>{error}</p>}
        </div>
    );
}

export default UploadButton 