import { AuthProvider as MochaAuthProvider, useAuth as useMochaAuth } from '@getmocha/users-service/react';
import type { MochaUser } from '@getmocha/users-service/shared';

// Re-export the Mocha auth hook with our interface
export const useAuth = () => {
  const auth = useMochaAuth();
  
  return {
    ...auth,
    isAuthenticated: !!auth.user,
    login: auth.redirectToLogin,
    register: auth.redirectToLogin, // Same as login for OAuth
  };
};

// Re-export the Mocha auth provider
export const AuthProvider = MochaAuthProvider;

// Export the user type
export type User = MochaUser;
