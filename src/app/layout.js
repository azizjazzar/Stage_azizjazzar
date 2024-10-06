"use client"; 

import '../styles/globals.css';
import { SessionProvider } from "next-auth/react"; 
import Navbar from '../components/Navbar';

// Ceci est un layout global pour votre application
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
        <Navbar />
          {children} 
        </SessionProvider>
      </body>
    </html>
  );
}
