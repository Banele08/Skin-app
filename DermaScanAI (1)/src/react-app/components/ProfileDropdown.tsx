import { useState, useRef, useEffect } from 'react';
import { User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/react-app/hooks/useAuth';
import AuthModal from './AuthModal';

export default function ProfileDropdown() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    setShowAuthModal(true);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const getInitials = (user?: any) => {
    if (user?.google_user_data?.given_name && user?.google_user_data?.family_name) {
      return `${user.google_user_data.given_name[0]}${user.google_user_data.family_name[0]}`.toUpperCase();
    }
    if (user?.google_user_data?.name) {
      return user.google_user_data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserName = (user?: any) => {
    return user?.google_user_data?.name || user?.google_user_data?.given_name || 'User';
  };

  const getUserImage = (user?: any) => {
    return user?.google_user_data?.picture;
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isAuthenticated && user ? (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {getUserImage(user) ? (
                <img
                  src={getUserImage(user)}
                  alt={getUserName(user)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(user)}
                </div>
              )}
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            {isAuthenticated && user ? (
              <>
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      {getUserImage(user) ? (
                        <img
                          src={getUserImage(user)}
                          alt={getUserName(user)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                          {getInitials(user)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getUserName(user)}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Guest Menu */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">
                    Sign in to save your analysis history and get personalized recommendations
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
