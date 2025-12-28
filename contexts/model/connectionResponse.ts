export interface ConnectionResponse {
  id: string;
  to: {
    id: string;
    fullName: string;
    location: {
      city: string | null;
      state: string | null;
      country: string | null;
    };
    dateOfBirth: string | null;
    education: string | null;
    occupation: string | null;
    mainImage: string | null;
    isVerified: boolean;
    email: string | null;
    phone: string | null;
  };
  from?: {
    // Adding optional from in case received connections use 'from' instead of 'to'
    id: string;
    fullName: string;
    location: {
      city: string | null;
      state: string | null;
      country: string | null;
    };
    dateOfBirth: string | null;
    education: string | null;
    occupation: string | null;
    mainImage: string | null;
    isVerified: boolean;
    email: string | null;
    phone: string | null;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  message: string | null;
  responseReason: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
