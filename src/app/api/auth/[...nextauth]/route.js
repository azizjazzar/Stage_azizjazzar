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
  secret: process.env.SECRET, 
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token; 
        token.id = profile.sub; 
        token.email = profile.email; 
        token.nom = profile.given_name || ""; 
        token.prenom = profile.family_name || ""; 
        token.datenaissance = profile.birthday || ""; 

       
        try {
          await auth.registerUser(profile);
        } catch (error) {
          console.error("Error registering user:", error);
        }
      }
      return token; 
    },
    async session({ session, token }) {
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
        return session; 
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    },
  },
};

export const GET = (req, res) => NextAuth(req, res, authOptions);
export const POST = (req, res) => NextAuth(req, res, authOptions);
