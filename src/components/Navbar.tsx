import { useState } from 'react';
import { Link } from 'react-router-dom';
import pirateLogo from '../assets/PIRATE-LOGO.png';
import EncircleButton from './ui/EncircleButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black p-4 border-b border-black">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo only (no text) */}
        <div className="flex items-center">
          <Link to="/">
            <img src={pirateLogo} alt="Pirate Logo" className="h-14 w-auto" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Navigation with updated options and encircle effect */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <EncircleButton to="/">Home</EncircleButton>
          <EncircleButton to="/creative">Creative</EncircleButton>
          <EncircleButton to="/computer">Computer</EncircleButton>
          <EncircleButton to="/research">Research</EncircleButton>
          <EncircleButton to="/contact">Contact</EncircleButton>
        </div>
      </div>

      {/* Mobile Navigation with updated options */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-2">
          <Link to="/" className="block py-2 px-4 hover:bg-gray-100 transition-colors duration-200">Home</Link>
          <Link to="/creative" className="block py-2 px-4 hover:bg-gray-100 transition-colors duration-200">Creative</Link>
          <Link to="/computer" className="block py-2 px-4 hover:bg-gray-100 transition-colors duration-200">Computer</Link>
          <Link to="/research" className="block py-2 px-4 hover:bg-gray-100 transition-colors duration-200">Research</Link>
          <Link to="/contact" className="block py-2 px-4 hover:bg-gray-100 transition-colors duration-200">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 