import { IUser } from "./user.types";

/**
 * Interface for authentication credentials.
 */
export interface AuthCredentials {
  /**
   * Email address of the user.
   */
  email: string;
  /**
   * Password of the user.
   */
  password: string;
}

/**
 * Interface for signup credentials, same as AuthCredentials for now.
 */
export type SignupCredentials = AuthCredentials;

/**
 * Interface for authentication response.
 */
export interface AuthResponse {
  /**
   * Whether the authentication was successful.
   */
  success: boolean;
  /**
   * Data returned upon successful authentication.
   */
  data?: {
    /**
     * Authentication token.
     */
    token: string;
    /**
     * User data.
     */
    user: IUser;
  };
  /**
   * Error message returned upon failed authentication.
   */
  error?: string;
}

/**
 * Interface for authentication context type.
 */
export interface AuthContextType {
  /**
   * Currently authenticated user, or null if not authenticated.
   */
  user: IUser | null;
  /**
   * Whether the user is authenticated.
   */
  isAuthenticated: boolean;
  /**
   * Whether the authentication is currently loading.
   */
  isLoading: boolean;
  /**
   * Function to sign in with authentication credentials.
   */
  signin: (credentials: AuthCredentials) => Promise<void>;
  /**
   * Function to sign up with signup credentials.
   */
  signup: (credentials: SignupCredentials) => Promise<void>;
  /**
   * Function to sign out.
   */
  signout: () => void;
}