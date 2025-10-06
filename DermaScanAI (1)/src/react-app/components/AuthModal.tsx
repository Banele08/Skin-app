import { useState } from 'react';
import { X, Chrome } from 'lucide-react';
import { useAuth } from '@/react-app/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, isFetching } = useAuth();
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await login();
      onClose();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Sign In to DermaScanAI
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Sign in to save your analysis history and get personalized skincare recommendations
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isFetching}
              className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Chrome className="w-5 h-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our terms of service and privacy policy.
              Your data is stored securely and never shared without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
