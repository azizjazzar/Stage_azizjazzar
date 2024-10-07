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
            const payload = {
                email: email,
            };

            const tokenBackend = this.generateToken(payload);

            const response = await this.api.get("/auth/getuser", {
                headers: {
                    Authorization: `Bearer ${tokenBackend}`,
                },
                data: { email },
            });

            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            throw error;
        }
    }

    async updateUserProfile(userData) {
        if (!userData.email) {
            console.error("Aucun email fourni dans userData :", userData);
            throw new Error("Email requis.");
        }
    
    
        try {
            const response = await this.api.post("/auth/update", userData);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
            throw error;
        }
    }
    
    
}
export default Auth;
