// src/components/Navbar.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Dropbox from "./Dropbox"; 

const Navbar = () => {
  const { data: session } = useSession(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(()=>{
    console.log(session)
  })
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setDropdownOpen(false); 
  }, [session]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full p-4 transition-colors duration-300 ${scrolled ? 'bg-gray-900' : 'bg-custom-dark'} z-50`} style={{ userSelect: 'none' }}>
      <div className="container mx-auto flex items-center">
        <div className="lg:hidden ml-auto">
          <button className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={scrolled ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
        <div className="lg:flex lg:items-center lg:justify-center hidden flex-grow">
          <a href="/profil" className="text-custom-gray block px-4 py-2 rounded hover:text-white transition duration-300">Profil</a>
       
          <a href="https://azizjazzar.netlify.app" className="text-custom-gray block px-4 py-2 rounded hover:text-white transition duration-300">Potfolio</a>
          <a href="https://github.com/azizjazzar" className="flex items-center space-x-2 text-custom-gray px-4 py-2 rounded hover:text-white transition duration-300">
            <span>GitHub</span>
          </a>
         
        </div>

        {session ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center space-x-2">
              <img src={session.user.image} alt="User Avatar" className="w-8 h-8 rounded-full" />
              <span className="text-custom-gray">{session.user.nom} {session.user.prenom}</span>
            </button>
            {dropdownOpen && (
              <Dropbox user={session.user} onClose={() => setDropdownOpen(false)} />
            )}
          </div>
        ):null}

      </div>
    </nav>
  );
};

export default Navbar;
