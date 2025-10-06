import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/react-app/hooks/useAuth';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { exchangeCodeForSessionToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        // Redirect to home page after successful authentication
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication failed:', error);
        // Redirect to home page even if auth fails
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" text="Completing sign in..." />
        <p className="mt-4 text-gray-600">
          Please wait while we finish setting up your account
        </p>
      </div>
    </div>
  );
}
