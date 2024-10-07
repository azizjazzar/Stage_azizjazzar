"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Auth from "@/app/service/auth";

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    datenaissance: '',
    telephone: '', // Ajout du champ téléphone
    adresse: '', // Ajout du champ adresse
  });
  const [message, setMessage] = useState("");

  const auth = new Auth();

  useEffect(() => {
    if (session?.user) {
      setUserData({
        nom: session.user.nom || '',
        prenom: session.user.prenom || '',
        email: session.user.email || '',
        datenaissance: session.user.datenaissance || '',
        telephone: session.user.telephone || '', // Récupération du téléphone
        adresse: session.user.adresse || '', // Récupération de l'adresse
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;

    try {
      const response = await auth.updateUserProfile(userData, session.accessToken); 
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Error updating profile");
      console.error(error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; 
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-[90px]">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h1 className="text-xl font-bold mb-4 text-center">User Profile</h1>
        {session.user.image && <img src={session.user.image} alt="User avatar" className="rounded-full w-24 h-24 mx-auto my-4" />}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block mb-1">
              Nom:
              <input
                type="text"
                name="nom"
                value={userData.nom}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Prénom:
              <input
                type="text"
                name="prenom"
                value={userData.prenom}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Email:
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
                disabled 
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Date de naissance:
              <input
                type="date"
                name="datenaissance"
                value={userData.datenaissance}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Téléphone:
              <input
                type="tel"
                name="telephone"
                value={userData.telephone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Adresse:
              <input
                type="text"
                name="adresse"
                value={userData.adresse}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </label>
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-md p-2 w-full hover:bg-blue-600">Modifier le profil</button>
        </form>

        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default UserProfile;
