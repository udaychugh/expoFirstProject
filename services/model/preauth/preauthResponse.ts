export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      fullName: string;
      phone: string;
      isVerified: boolean;
      profileComplete: boolean;
    };
    token: string;
    refreshToken: string;
  };
  message?: string;
  error?: string;
}