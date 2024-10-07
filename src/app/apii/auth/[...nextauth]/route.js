import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import Auth from "@/app/service/auth";

const auth = new Auth();

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET, // Assurez-vous que cette variable est définie dans votre environnement
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token; // Stocke le token d'accès
        token.id = profile.sub; // ID utilisateur
        token.email = profile.email; // Email
        token.nom = profile.given_name || ""; // Nom
        token.prenom = profile.family_name || ""; // Prénom
        token.datenaissance = profile.birthday || ""; // Date de naissance

        // Enregistrer l'utilisateur dans votre backend
        try {
          await auth.registerUser(profile);
        } catch (error) {
          console.error("Error registering user:", error);
        }
      }
      return token; // Retourne le token modifié
    },
    async session({ session, token }) {
      // Récupérer les données de l'utilisateur par email
      try {
        const user = await auth.getUserByEmail(token.email);
        if (user) {
          session.user.nom = user.user.nom || null; 
          session.user.email = user.user.email || null; 
          session.user.prenom = user.user.prenom || null; 
          session.user.telephone = user.user.telephone || null; 
          session.user.adresse = user.user.adresse || null; 
          session.user.datenaissance = user.user.datenaissance || null; 
        }
        return session; // Retourne la session modifiée
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    },
  },
};

// Gérer les requêtes GET et POST pour l'authentification
export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
