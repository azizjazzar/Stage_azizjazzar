"use client"; 

import '../styles/globals.css';
import Navbar from '../components/Navbar';
import SignIn from "@/app/auth/signin/page";
import { SessionProvider } from "next-auth/react"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Your App Title</title>
      </head>
      <body>
        <SessionProvider>
          <Navbar />
          <SignIn />
          <main>{children}</main> {/* Afficher le contenu de chaque page ici */}

          {/* Footer intégré ici */}
          <footer style={{ padding: "1rem", textAlign: "center", backgroundColor: "#f1f1f1" }}>
            <p>© {new Date().getFullYear()} . All rights reserved.</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
