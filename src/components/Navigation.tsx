
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-blue-600 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold">
            BTIA_Scholars
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`hover:text-blue-200 transition-colors ${
                location.pathname === '/' ? 'text-blue-200' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/apply/personal" 
              className={`hover:text-blue-200 transition-colors ${
                location.pathname.includes('/apply') ? 'text-blue-200' : ''
              }`}
            >
              Apply
            </Link>
            <a 
              href="#" 
              className="hover:text-blue-200 transition-colors"
            >
              BTIA-Official
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
