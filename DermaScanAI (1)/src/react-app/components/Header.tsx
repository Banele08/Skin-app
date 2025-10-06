import { Link, useLocation } from 'react-router';
import { Camera, History, Home } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DermaScanAI
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link
              to="/analysis"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/analysis') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Analyze</span>
            </Link>
            
            <Link
              to="/history"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/history') 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </Link>

            <ProfileDropdown />
          </nav>
        </div>
      </div>
    </header>
  );
}
