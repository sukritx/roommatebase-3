import { IUser } from "./user.types";
import { ApiResponse } from "./api.types";

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
 * Type for authentication response.
 */
export type AuthResponse = ApiResponse<{
  token: string;
  user: IUser;
}>;

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