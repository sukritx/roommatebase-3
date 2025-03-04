import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { AuthContextType, AuthCredentials, SignupCredentials } from '../types/auth.types';
import { IUser } from '../types/user.types';

const AuthContext = createContext<AuthContextType | null>(null);

const useAuthProvider = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          apiService.setAuthToken(token);
          // TODO: Implement token validation endpoint
          setIsLoading(false);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          apiService.setAuthToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signin = async (credentials: AuthCredentials) => {
    try {
      const response = await apiService.signin(credentials);
      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        apiService.setAuthToken(token);
        setUser(user);
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Authentication failed');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Authentication failed');
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const response = await apiService.signup(credentials);
      if (response.success) {
        navigate('/signin');
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Signup failed');
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    apiService.setAuthToken(null);
    setUser(null);
    navigate('/signin');
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signin,
    signup,
    signout,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};