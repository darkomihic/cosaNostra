import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../assets/css/style.css"; // Ensure to import your CSS file
import knglava from '../assets/knglava.jpg';

export default function Navbar({ isLoggedIn, handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
<>
    <nav className="relative nav">
  <div className="flex justify-between items-center w-full p-4">
    <a href="/">
      <img src={knglava} className="w-16 h-16" alt="Logo" />
    </a>
    <button className="lg:hidden text-white text-2xl" onClick={toggleMenu}>
      ☰ {/* Hamburger icon */}
    </button>
  </div>

  <ul className={`fixed top-0 right-0 h-full w-3/4 lg:w-auto bg-zinc-900 lg:bg-transparent transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:flex lg:flex-row lg:space-x-4 lg:items-center lg:h-auto`}>
    <li className="lg:hidden flex justify-end p-4">
      <button onClick={closeMenu} className="text-white text-2xl">
        × {/* Close icon */}
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
          <a
            onClick={() => { handleLogoutClick(); closeMenu(); }}
            className="block text-white bg-zinc-900 hover:bg-zinc-700 active:bg-gray-500 px-4 py-2 rounded transition text-lg"
          >
            Odjavi se
          </a>
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

<div className="bg-red-500 text-white text-center p-4 text-lg lg:text-2xl font-semibold">
  <p>Ova stranica je još uvek u razvoju. Trenutno nije moguće zakazivanje termina.</p>
</div>

</>
  );
}
