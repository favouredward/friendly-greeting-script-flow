
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/placeholder.svg" 
              alt="BlacTech Logo" 
              className="h-10 w-10 rounded-full border-2 border-white/20"
            />
            <span className="text-xl font-bold">BlacTech Scholars</span>
          </Link>
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
              href="#" 
              className="hover:text-purple-200 transition-colors duration-300 relative group"
            >
              BTIA-Official
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
