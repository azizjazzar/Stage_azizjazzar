"use client"; 

import { useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // Si l'utilisateur n'est pas connecté, n'affiche rien
  if (!session) {
    return null; // Ou afficher un message comme "Not signed in"
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <img src={session.user.image} alt="User avatar" />
    </div>
  );
};

export default UserProfile;

