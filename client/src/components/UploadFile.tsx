{/* ce composant est un simple bouton qui permet d'ajouter une image pour la photo de profil */}
import { useState } from 'react';

const UploadButton = ({userData, setIsUploading}: any ) => {
    
    const [error, setError ] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<string>(
        userData.profile_picture || "",
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        const file = e.target.files?.[0];
        if (file) {
            console.log(file.name);
            setProfilePicture(URL.createObjectURL(file));
            setIsUploading(false);
        } else {
            setError('Aucune image sélectionnée')
        }
    }

    return (
        <>
            <p>Veuillez choisir votre nouvelle photo de profil en cliquant sur le bouton.</p>
            <input 
                type='file' 
                className='bg-gray-800 text-white px-3 py-1 rounded-md text-sm cursor-pointer'
                onChange={handleChange}
            />
            {error && <p className='text-red-500'>{error}</p>}
        </>
    );
}

export default UploadButton 





{ /**  requete à faire coté serveur 
    const response = await axios.post(
        "http://127.0.0.1:5000/user/upload-profile-picture",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      
      */}