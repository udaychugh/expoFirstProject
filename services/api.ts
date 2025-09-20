import AuthService from './auth';

const API_BASE_URL = 'https://your-api-domain.com/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  religion: string;
  caste?: string;
  height: string;
  weight?: string;
  maritalStatus: string;
  bio: string;
  images: string[];
  interests: string[];
  lifestyle: {
    smoking: string;
    drinking: string;
    diet: string;
  };
  phoneNumber?: string;
  email?: string;
  bloodGroup?: string;
  languagesSpoken: string[];
  dressStyle?: string;
  favoriteBooks?: string;
  favoriteSongs?: string;
  favoriteMovies?: string;
  vacationDestination?: string;
  bodyType?: string;
  complexion?: string;
  hasDisability: boolean;
  drinkingHabit?: string;
  smokingHabit?: string;
  hobbies: string[];
  sportsAndFitness: string[];
  hasChildren?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SwipeAction {
  profileId: string;
  action: 'like' | 'pass';
}

interface MatchResult {
  isMatch: boolean;
  matchId?: string;
  profile?: UserProfile;
}
class ApiService {
  private static instance: ApiService;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = AuthService.getToken();
      
      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      // Handle token expiration
      if (response.status === 401) {
        const refreshed = await AuthService.refreshAuthToken();
        if (refreshed) {
          // Retry the request with new token
          const newToken = AuthService.getToken();
          return this.makeRequest(endpoint, {
            ...options,
            headers: {
              ...defaultHeaders,
              Authorization: `Bearer ${newToken}`,
              ...options.headers,
            },
          });
        } else {
          // Redirect to login
          throw new Error('Authentication expired');
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // User Profile APIs
  async getCurrentUserProfile(): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile');
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest(`/users/${userId}`);
  }

  async updateBasicInfo(data: {
    name?: string;
    location?: string;
    occupation?: string;
    education?: string;
    bio?: string;
  }): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile/basic-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updatePersonalDetails(data: {
    religion?: string;
    caste?: string;
    height?: string;
    weight?: string;
    maritalStatus?: string;
    bloodGroup?: string;
    bodyType?: string;
    complexion?: string;
    hasDisability?: boolean;
  }): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile/personal-details', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateLifestyle(data: {
    diet?: string;
    drinkingHabit?: string;
    smokingHabit?: string;
    dressStyle?: string;
  }): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile/lifestyle', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateInterests(data: {
    hobbies?: string[];
    sportsAndFitness?: string[];
    languagesSpoken?: string[];
  }): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile/interests', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateFavorites(data: {
    favoriteBooks?: string;
    favoriteSongs?: string;
    favoriteMovies?: string;
    vacationDestination?: string;
  }): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile/favorites', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateContactInfo(data: {
    phoneNumber?: string;
    email?: string;
  }): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest('/profile/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  async uploadProfileImage(imageUri: string): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    return this.makeRequest('/profile/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  async uploadMultipleImages(imageUris: string[]): Promise<ApiResponse> {
    const formData = new FormData();
    
    imageUris.forEach((uri, index) => {
      formData.append('images', {
        uri: uri,
        type: 'image/jpeg',
        name: `profile-${index}.jpg`,
      } as any);
    });

    return this.makeRequest('/profile/upload-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  async deleteProfileImage(imageId: string): Promise<ApiResponse> {
    return this.makeRequest(`/profile/images/${imageId}`, {
      method: 'DELETE',
    });
  }
  // Verification APIs
  async submitVerification(data: {
    idCardImage: string;
    selfieImage: string;
  }): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('idCard', {
      uri: data.idCardImage,
      type: 'image/jpeg',
      name: 'id-card.jpg',
    } as any);
    formData.append('selfie', {
      uri: data.selfieImage,
      type: 'image/jpeg',
      name: 'selfie.jpg',
    } as any);

    return this.makeRequest('/verification/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  async getVerificationStatus(): Promise<ApiResponse> {
    return this.makeRequest('/verification/status');
  }

  // Discovery & Match APIs
  async getDiscoveryProfiles(filters?: {
    ageMin?: number;
    ageMax?: number;
    location?: string;
    religion?: string;
    education?: string;
    occupation?: string;
    maritalStatus?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<UserProfile[]>> {
    const queryParams = filters
      ? `?${new URLSearchParams(
          Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [key, value !== undefined ? String(value) : ''])
          )
        ).toString()}`
      : '';
    return this.makeRequest(`/discovery/profiles${queryParams}`);
  }

  async swipeProfile(data: SwipeAction): Promise<ApiResponse<MatchResult>> {
    return this.makeRequest('/discovery/swipe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likeProfile(profileId: string): Promise<ApiResponse<MatchResult>> {
    return this.makeRequest('/discovery/swipe', {
      method: 'POST',
      body: JSON.stringify({ profileId, action: 'like' }),
    });
  }

  async passProfile(profileId: string): Promise<ApiResponse> {
    return this.makeRequest('/discovery/swipe', {
      method: 'POST',
      body: JSON.stringify({ profileId, action: 'pass' }),
    });
  }

  async undoLastSwipe(): Promise<ApiResponse> {
    return this.makeRequest('/discovery/undo', {
      method: 'POST',
    });
  }

  async getMatches(): Promise<ApiResponse<UserProfile[]>> {
    return this.makeRequest('/matches');
  }

  async getMatchDetails(matchId: string): Promise<ApiResponse<UserProfile>> {
    return this.makeRequest(`/matches/${matchId}`);
  }

  async unmatch(matchId: string): Promise<ApiResponse> {
    return this.makeRequest(`/matches/${matchId}`, {
      method: 'DELETE',
    });
  }

  // Search APIs
  async searchProfiles(query: string, filters?: any): Promise<ApiResponse<UserProfile[]>> {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.makeRequest(`/search/profiles?${params.toString()}`);
  }

  async getRecommendations(): Promise<ApiResponse<UserProfile[]>> {
    return this.makeRequest('/recommendations');
  }

  // Profile Views & Interactions
  async viewProfile(profileId: string): Promise<ApiResponse> {
    return this.makeRequest('/interactions/view', {
      method: 'POST',
      body: JSON.stringify({ profileId }),
    });
  }

  async getProfileViews(): Promise<ApiResponse> {
    return this.makeRequest('/interactions/views');
  }

  async getWhoLikedMe(): Promise<ApiResponse<UserProfile[]>> {
    return this.makeRequest('/interactions/liked-me');
  }

  async reportProfile(profileId: string, reason: string): Promise<ApiResponse> {
    return this.makeRequest('/interactions/report', {
      method: 'POST',
      body: JSON.stringify({ profileId, reason }),
    });
  }

  async blockProfile(profileId: string): Promise<ApiResponse> {
    return this.makeRequest('/interactions/block', {
      method: 'POST',
      body: JSON.stringify({ profileId }),
    });
  }
  // Chat APIs
  async getConversations(): Promise<ApiResponse> {
    return this.makeRequest('/chat/conversations');
  }

  async getMessages(conversationId: string): Promise<ApiResponse> {
    return this.makeRequest(`/chat/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, message: string): Promise<ApiResponse> {
    return this.makeRequest(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Settings APIs
  async updateNotificationSettings(settings: any): Promise<ApiResponse> {
    return this.makeRequest('/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async updatePrivacySettings(settings: any): Promise<ApiResponse> {
    return this.makeRequest('/settings/privacy', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async deleteAccount(): Promise<ApiResponse> {
    return this.makeRequest('/account/delete', {
      method: 'DELETE',
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.makeRequest('/account/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

export default ApiService.getInstance();