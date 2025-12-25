export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  profileComplete: boolean;
  isNRI: boolean;
  annualSalary: string;

  location: {
    city: string;
    state: string;
    country: string;
  };
  jobLocation?: string;
  permanentLocation?: string;

  income: {
    amount: number;
    currency: string;
  };

  preferences: {
    ageRange: { min: number; max: number };
    religion: string[];
    education: string[];
    occupation: string[];
    location: string[];
    maritalStatus: string[];
    maxDistance: number;
  };

  _id: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  languagesSpoken: string[];
  maritalStatus: string;
  manglik: boolean;
  hasChildren: string;
  hasDisability: boolean;
  hobbies: string[];
  sportsAndFitness: string[];

  verificationStatus: string;
  profileVisibility: boolean;
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  isOnline: boolean;
  profileViews: number;
  isActive: boolean;
  isPremium: boolean;

  images: {
    url: string;
    publicId: string;
    isMain: boolean;
    _id: string;
    id: string;
  }[];

  lastActive: string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  resetPasswordOTP?: string;
  resetPasswordOTPExpiry?: string;

  bio: string;

  education: string;
  occupation: string;
  caste: string;
  height: string;
  religion: string;
  bloodGroup: string;
  bodyType: string;
  complexion: string;
  diet: string;
  dressStyle: string;
  drinkingHabit: string;
  smokingHabit: string;

  favoriteBooks: string[];
  favoriteMovies: string[];
  favoriteSongs: string[];
  vacationDestination: string[];

  mainImage: string;

  family?: {
    fatherName: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    familyIncome: string;
    siblings: {
      name: string;
      occupation: string;
    }[];
    createdBy: string;
  };
}

export interface UserResponse {
  success: boolean;
  error?: string;
  data?: UserProfile;
}
