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
    const [profilePicture, setProfilePicture] = useState<string>(userData.profile_picture || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    

    // s'execute quand un fichier est sélectionné dans (input type=file)
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>)=> {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setProfilePicture(URL.createObjectURL(file)); // création d'une url temp pour l'aperçu
            setError('');
        } else {
            setError('Aucune image sélectionnée');
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError('Veuillez sélectionner une image avant de valider');
            return;
        }
        try {
            const formData = new FormData(); // form precook pour envoyer des medias (??)
            formData.append("file", selectedFile); // coté serveur on attend "file" comme nom /!\

            const response = await axios.post(
                `${config.serverUrl}/user/upload-profile-picture`,
                 formData, 
                {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem("token")}`, 
                        "Content-Type": "multipart/form-data" }, // indique bien qu'on envoie un média (combinaison de texte) : merci google
            }
        );
            
        console.log(response.data);
        setIsUploading(false); // Ferme le modal après succès
    } catch (error) {
        console.error(error);
        setError("Erreur lors de l'upload de la photo de profil");
    } 
};

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

            {/* section pour afficher l'aperçu */}
            <div className="mb-4">
                <h3 className="text-white mb-2">Aperçu de l'image:</h3>
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                    {profilePicture ? (
                        <img 
                            src={profilePicture} 
                            alt="Aperçu" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">Aucune image</span>
                        </div>
                    )}
                </div>
            </div>

            <div className='mb-4'>
                <input 
                    type='file' 
                    className='w-full cursor-pointer rounded-md border border-gray-600 bg-gray-800 text-white outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-gray-600 file:bg-gray-700 file:py-3 file:px-5 file:text-white file:hover:bg-blue-500 file:hover:bg-opacity-20'
                    onChange={handleChange}
                />
                {error && <p className='text-red-500 mt-2'>{error}</p>}
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3">
                <button 
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                    onClick={() => setIsUploading(false)}
                >
                    Annuler
                </button>
                <button 
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSubmit}
                    disabled={!selectedFile}
                >  Valider et enregistrer
                </button>
            </div>
        </div>
    );
}

export default UploadButton