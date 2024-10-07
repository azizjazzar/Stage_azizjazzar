import { signOut } from "next-auth/react";

const Dropbox = ({ user, onClose }) => {

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    if (onClose) onClose(); 
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
      <div className="p-4">
        <h3 className="font-bold">{user.nom} {user.prenom}</h3>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div className="border-t">
        <button
          onClick={handleSignOut} 
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Dropbox;
