// src/components/Navbar.js
"use client"; // Ajoutez cette ligne

import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full p-4 transition-colors duration-300 ${scrolled ? 'bg-gray-900' : 'bg-custom-dark'} z-50`} style={{ userSelect: 'none' }}>
      <div className="container mx-auto flex items-center">
        <div className="text-white text-2xl font-bold">Aziz Jazzar</div>
        <div className="lg:hidden ml-auto">
          <button className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={scrolled ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
        <div className="lg:flex lg:items-center lg:justify-center hidden flex-grow">
          <a href="#project" className="text-custom-gray block px-4 py-2 rounded hover:text-white transition duration-300">Projects</a>
          <a href="#about" className="text-custom-gray block px-4 py-2 rounded hover:text-white transition duration-300">About</a>
          <a href="#contact" className="text-custom-gray block px-4 py-2 rounded hover:text-white transition duration-300">Contact</a>
          <a href="#hosted" className="text-custom-gray block px-4 py-2 rounded hover:text-white transition duration-300">Hosted</a>
          <a href="#skills" className="text-custom-gray block px-4 py-2 rounded hover:text-white transition duration-300">Skills</a>
          <a href="https://github.com/azizjazzar" className="flex items-center space-x-2 text-custom-gray  px-4 py-2 rounded hover:text-white transition duration-300">
            <img src="/img/github.png" alt="GitHub" className="w-6 h-6" />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/jazzar-aziz-268141219/" className="flex items-center space-x-2 text-custom-gray  px-4 py-2 rounded hover:text-white transition duration-300">
            <img src="/img/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
