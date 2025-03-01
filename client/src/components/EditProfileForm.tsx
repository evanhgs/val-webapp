import React, { useState } from "react";
import axios from "axios";


const EditProfileForm = ({ userData, setIsEditing }: any) => {
  const [formData, setFormData] = useState({
    username: userData.username,
    bio: userData.bio || "",
    website: userData.website || "",
    gender: userData.gender || "Autre",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/user/edit-profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Profil mis à jour !");
      setIsEditing(false); 
    } catch (error) {
      console.error("Echec de la mise à jour du profil: ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Modifier le profil</h2>
        <button
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setIsEditing(false)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="text-gray-400">Nom d'utilisateur</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            maxLength={20}
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          />
          <p className="text-gray-500 text-sm">
            {formData.username.length} / 20
          </p>
        </div>

        {/* Website */}
        <div>
          <label className="text-gray-400">Site web</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            maxLength={32}
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          />
          <p className="text-gray-500 text-sm">
            {formData.website.length} / 20
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="text-gray-400">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={100}
            className="w-full p-2 rounded-md bg-gray-800 text-white h-20"
          />
          <p className="text-gray-500 text-sm">
            {formData.bio.length} / 100
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="text-gray-400">Genre</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          >
            <option>Je préfère ne pas le dire</option>
            <option>Homme</option>
            <option>Femme</option>
            <option>Autre</option>
          </select>
        </div>


        {/* Submit */}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
          Confirmer
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
