import { clearAllData, storeToken, storeUserInfo } from "./db/dataManager";
import { API_BASE_URL } from "./model/constants";
import { LoginRequest, RegisterRequest } from "./model/preauth/preauthRequest";
import { AuthResponse } from "./model/preauth/preauthResponse";
import { UserProfile, UserResponse } from "../contexts/model/userProfile";

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      console.debug("login request at = ", API_BASE_URL + "/auth/login");
      console.debug("login credentials = ",  JSON.stringify(credentials));
      console.debug("login response = ", data);

      if (response.ok && data.success) {
        this.token = data.data.token;
        this.refreshToken = data.data.refreshToken;

        storeToken(this.token, this.refreshToken)
        storeUserInfo(data.data.user)

        return data;
      } else {
        console.error('Login failed:', data.message);
        return {
          success: false,
          error: data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data;
      } else {
        return {
          success: false,
          error: data.message || 'Registration failed',
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.unsetTokens();
      // Clear stored tokens
      // await SecureStore.deleteItemAsync('auth_token');
      // await SecureStore.deleteItemAsync('refresh_token');
    }
  }

  async unsetTokens(): Promise<void> {
    await clearAllData();
    this.token = null;
    this.refreshToken = null;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.token = data.data.token;
        this.refreshToken = data.data.refreshToken;
        storeToken(this.token, this.refreshToken)
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    return forgotPassword(email);
  }

  async verifyResetOTP(email: string, otp: string): Promise<AuthResponse> {
    return verifyResetOTP(email, otp);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<AuthResponse> {
    return resetPassword(email, otp, newPassword);
  }
}

// Forgot password - send reset email/OTP
const forgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return data;
    } else {
      return {
        success: false,
        error: data.message || 'Failed to send reset email',
      };
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
};

// Verify OTP for password reset
const verifyResetOTP = async (email: string, otp: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return data;
    } else {
      return {
        success: false,
        error: data.message || 'Invalid or expired OTP',
      };
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
};

// Reset password with new password
const resetPassword = async (email: string, otp: string, newPassword: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return data;
    } else {
      return {
        success: false,
        error: data.message || 'Failed to reset password',
      };
    }
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
};

export default AuthService.getInstance();