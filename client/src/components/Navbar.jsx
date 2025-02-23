import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaCogs, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide text-center">
          <Link to="/"  style={{ marginLeft:'500px' }}>Homeowners Association </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-lg">
          <li className="flex items-center gap-2 hover:text-gray-300 transition-all">
            <FaHome />
            <Link to="/">Home</Link>
          </li>
          {token && (
            <li className="flex items-center gap-2 hover:text-gray-300 transition-all">
              <FaUser />
              <Link to="/profile">Profile</Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-800 px-6 py-4 space-y-3"
          >
            <li className="flex items-center gap-2 text-lg">
              <FaHome />
              <Link to="/" className="hover:text-gray-300" onClick={toggleMenu}>
                Home
              </Link>
            </li>
            {token && (
              <li className="flex items-center gap-2 text-lg">
                <FaUser />
                <Link
                  to="/profile"
                  className="hover:text-gray-300"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
