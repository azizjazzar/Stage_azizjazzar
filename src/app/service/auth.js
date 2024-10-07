import axios from "axios";
import jwt from 'jsonwebtoken';

class Auth {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "https://stageazizjazzar-backend-production.up.railway.app",
    });
  }

  generateToken(payload) {
    return jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '1h' });
  }

  async registerUser(profile) {
    try {
      const payload = {
        email: profile.email,
        nom: profile.given_name,
        prenom: profile.family_name,
        datenaissance: profile.birthday || "",
      };

      const tokenBackend = this.generateToken(payload);
      
      const response = await this.api.post("/auth/register", {
        email: profile.email,
        nom: profile.given_name,
        prenom: profile.family_name,
        telephone: "",
        adresse: "",
        datenaissance: profile.birthday || "",
      }, {
        headers: {
          Authorization: `Bearer ${tokenBackend}`, 
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
      throw error; 
    }
  }

  async getUserByEmail(email) {
    try {
      // Créez un payload pour générer le token
      const payload = {
        email: email, // Utilisez l'email que vous voulez récupérer
      };
      
      const tokenBackend = this.generateToken(payload); // Générez le token
      
      const response = await this.api.get("/auth/getuser", {
        headers: {
          Authorization: `Bearer ${tokenBackend}`, // Envoyez le token dans l'en-tête
        },
        data: { email }, // Envoyez l'email dans le corps de la requête
      });

      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      throw error; 
    }
  }
}

export default Auth;
