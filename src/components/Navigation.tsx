
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/placeholder.svg" 
              alt="Logo" 
              className="h-10 w-10 rounded-full border-2 border-white/20"
            />
            {/* Space reserved for your SVG logo */}
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`hover:text-purple-200 transition-colors duration-300 relative group ${
                location.pathname === '/' ? 'text-purple-200' : ''
              }`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/apply/personal" 
              className={`hover:text-purple-200 transition-colors duration-300 relative group ${
                location.pathname.includes('/apply') ? 'text-purple-200' : ''
              }`}
            >
              Apply
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a 
              href="https://blactechafrica.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-200 transition-colors duration-300 relative group"
            >
              BTIA
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-purple-200 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden mt-4 pb-4 border-t border-purple-500/30">
          <div className="flex flex-col space-y-4 pt-4">
            <Link 
              to="/" 
              className={`hover:text-purple-200 transition-colors duration-300 ${
                location.pathname === '/' ? 'text-purple-200' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/apply/personal" 
              className={`hover:text-purple-200 transition-colors duration-300 ${
                location.pathname.includes('/apply') ? 'text-purple-200' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Apply
            </Link>
            <a 
              href="https://blactechafrica.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-200 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              BTIA
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
