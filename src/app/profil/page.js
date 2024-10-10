"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Auth from "@/app/service/auth";
import adresseService from "../service/geolocalisation"; // Import du service d'adresse

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    datenaissance: '',
    telephone: '',
    adresse: '',
  });
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressValid, setAddressValid] = useState(true);
  const [addressSelected, setAddressSelected] = useState(false);
  const [errors, setErrors] = useState({
    nom: '',
    prenom: '',
    email: '',
    datenaissance: '',
    telephone: '',
    adresse: '',
  });

  const auth = new Auth();

  useEffect(() => {
    if (session?.user) {
      setUserData({
        nom: session.user.nom || '',
        prenom: session.user.prenom || '',
        email: session.user.email || '',
        datenaissance: session.user.datenaissance || '',
        telephone: session.user.telephone || '',
        adresse: session.user.adresse || '',
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;

    let formIsValid = true;

    setErrors({
      nom: '',
      prenom: '',
      email: '',
      datenaissance: '',
      telephone: '',
      adresse: '',
    });

    if (!addressSelected) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        adresse: "Vous devez sélectionner une adresse parmi les suggestions.",
      }));
      formIsValid = false;
    }

    if (!addressValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        adresse: "L'adresse doit être située à moins de 50 km de Paris.",
      }));
      formIsValid = false;
    }

    if (!userData.nom) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nom: "Le nom est requis.",
      }));
      formIsValid = false;
    }

    if (!userData.prenom) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        prenom: "Le prénom est requis.",
      }));
      formIsValid = false;
    }

    if (!/^\d+$/.test(userData.telephone)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        telephone: "Le téléphone doit être numérique.",
      }));
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    try {
      const response = await auth.updateUserProfile(userData);
      setMessage("Profil mis à jour avec succès !");
    } catch (error) {
      setMessage("Erreur lors de la mise à jour du profil");
      console.error(error);
    }
  };

  const searchAddress = async (e) => {
    const query = e.target.value;
    setUserData((prevData) => ({ ...prevData, adresse: query }));

    if (query.length < 3) {
      setSuggestions([]);
      setAddressSelected(false);
      return;
    }

    setLoading(true);
    try {
      const suggestions = await adresseService.searchAddress(query); // Utilisation du service
      setSuggestions(suggestions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = async (address) => {
    setUserData((prevData) => ({ ...prevData, adresse: address.properties.label }));
    setSuggestions([]);
    setAddressSelected(true);

    const addressCoordinates = address.geometry.coordinates;
    const parisCoordinates = [2.3522, 48.8566];

    const distance = calculateDistance(parisCoordinates, addressCoordinates);

    if (distance <= 50) {
      setAddressValid(true);
    } else {
      setAddressValid(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        adresse: "L'adresse sélectionnée est à plus de 50 km de Paris.",
      }));
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2[1] - coord1[1]) * (Math.PI / 180);
    const dLon = (coord2[0] - coord1[0]) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1[1] * (Math.PI / 180)) * Math.cos(coord2[1] * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
        <h1 className="text-xl font-bold mb-4 text-center">Profil Utilisateur</h1>
        {session.user.image && <img src={session.user.image} alt="User avatar" className="rounded-full w-24 h-24 mx-auto my-4" />}

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-4">
          <div className="mb-4 col-span-2 flex justify-between">
            <label className="block mb-1 w-1/2 pr-2">
              Nom:
              <input
                type="text"
                name="nom"
                value={userData.nom}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              {errors.nom && <p className="text-red-600">{errors.nom}</p>}
            </label>
            <label className="block mb-1 w-1/2 pl-2">
              Prénom:
              <input
                type="text"
                name="prenom"
                value={userData.prenom}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              {errors.prenom && <p className="text-red-600">{errors.prenom}</p>}
            </label>
          </div>

          <div className="mb-4 col-span-2">
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
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </label>
          </div>

          <div className="mb-4 col-span-2 flex justify-between">
            <label className="block mb-1 w-1/2 pr-2">
              Téléphone:
              <input
                type="tel"
                name="telephone"
                value={userData.telephone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              {errors.telephone && <p className="text-red-600">{errors.telephone}</p>}
            </label>
            <label className="block mb-1 w-1/2 pl-2">
              Date de Naissance:
              <input
                type="date"
                name="datenaissance"
                value={userData.datenaissance}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              {errors.datenaissance && <p className="text-red-600">{errors.datenaissance}</p>}
            </label>
          </div>

          <div className="mb-4 col-span-2">
            <label className="block mb-1">
              Adresse:
              <input
                type="text"
                name="adresse"
                value={userData.adresse}
                onChange={searchAddress}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              {errors.adresse && <p className="text-red-600">{errors.adresse}</p>}
            </label>
            {loading && <p>Recherche en cours...</p>}
            {!loading && suggestions.length > 0 && (
              <ul className="border border-gray-300 rounded-md mt-2">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectAddress(suggestion)}
                  >
                    {suggestion.properties.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Mettre à jour le profil
            </button>
          </div>

          {message && <p className="col-span-2 mt-2 text-center text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
