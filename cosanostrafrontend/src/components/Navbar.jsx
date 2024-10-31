import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import "../assets/css/style.css";
import knglava from '../assets/knglava.jpg';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative nav">
      <div className="flex justify-between items-center w-full p-4">
        <a href='/'><img src={knglava} className="w-16 h-16" alt="Logo" /></a>
        <button className="lg:hidden text-white text-2xl" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <ul className={`fixed top-0 right-0 h-full w-3/4 lg:w-auto bg-zinc-900 lg:bg-transparent transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:flex lg:flex-row lg:space-x-4 lg:items-center lg:h-auto`}>
        <li className="lg:hidden flex justify-end p-4">
          <button onClick={closeMenu} className="text-white text-2xl">
            ×
          </button>
        </li>
        {isLoggedIn ? (
          <>
            <li className="mt-12 lg:mt-0 whitespace-nowrap">
              <Link
                to="/schedule"
                className="block text-white bg-zinc-900 hover:bg-zinc-700 active:bg-gray-500 px-4 py-2 rounded transition text-lg"
                onClick={closeMenu}
              >
                Zakaži termin
              </Link>
            </li>
            <li className="mt-4 lg:mt-0 whitespace-nowrap">
              <Link
                to="/appointments"
                className="block text-white bg-zinc-900 hover:bg-zinc-700 active:bg-gray-500 px-4 py-2 rounded transition text-lg"
                onClick={closeMenu}
              >
                Pogledaj termin
              </Link>
            </li>
            <li className="mt-4 lg:mt-0 whitespace-nowrap">
              <button onClick={() => { handleLogoutClick(); closeMenu(); }} 
                className="block text-white bg-zinc-900 hover:bg-zinc-700 active:bg-gray-500 px-4 py-2 rounded transition text-lg">
                Odjavi se
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="mt-12 lg:mt-0 whitespace-nowrap">
              <Link
                to="/login"
                className="block text-white bg-zinc-900 hover:bg-zinc-700 active:bg-gray-500 px-4 py-2 rounded transition text-lg"
                onClick={closeMenu}
              >
                Prijavi se
              </Link>
            </li>
            <li className="mt-4 lg:mt-0 whitespace-nowrap">
              <Link
                to="/register"
                className="block text-white bg-zinc-900 hover:bg-zinc-700 active:bg-gray-500 px-4 py-2 rounded transition text-lg"
                onClick={closeMenu}
              >
                Kreiraj nalog
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
