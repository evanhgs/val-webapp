{/* ce composant est un simple bouton qui permet d'ajouter une image pour la photo de profil */}
import { useState } from 'react';

export function uploadButton() {
    const [error, setError ] = useState('');

    return (
        <>
            <p>Veuillez choisir votre nouvelle photo de profil en cliquant sur le bouton.</p>
            <input 
                type='file' 
                className='bg-gray-800 text-white px-3 py-1 rounded-md text-sm cursor-pointer'
                onChange={(e) => {
                    const file = e.target.files?.[0]; {/** déclenchement de l'évent quand un fichier est upload */}
                    if (file) {
                        console.log(file.name);
                    } else {
                        setError('No file selected');
                    }
                }}
            />


        </>
    );
}







{ /**  requete à faire coté serveur 
    const response = await axios.post(
        "http://127.0.0.1:5000/user/upload-profile-picture",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      
      */}