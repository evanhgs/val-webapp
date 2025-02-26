{/* ce composant est un simple bouton qui permet d'ajouter une image pour la photo de profil */}
import { useState } from 'react';

export default function uploadButton() {
    const [error, setError ] = useState('');

    return (<></>);
}


{ /**  requete à faire coté serveur 
    const response = await axios.post(
        "http://127.0.0.1:5000/user/upload-profile-picture",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      
      */}