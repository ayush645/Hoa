import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">Property Management</Link>
        </div>

        {/* Menu for large screens */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/print" className="hover:text-gray-200">
              Print
            </Link>
          </li>
          <li>
            <Link to="/upload" className="hover:text-gray-200">
              Upload
            </Link>
          </li>
        </ul>

        {/* Hamburger Menu for small screens */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Dropdown Menu for small screens */}
      {isMenuOpen && (
        <ul className="md:hidden bg-gray-800 space-y-2 px-4 py-3">
          <li>
            <Link
              to="/"
              className="block hover:text-gray-200"
              onClick={toggleMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/print"
              className="block hover:text-gray-200"
              onClick={toggleMenu}
            >
              Print
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="block hover:text-gray-200"
              onClick={toggleMenu}
            >
              Upload
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
