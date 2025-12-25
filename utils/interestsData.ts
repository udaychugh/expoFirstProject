// Import all data sources from models
import {
  HOBBIES,
  SPORTS_FITNESS,
  LANGUAGES,
} from '@/app/(onboarding)/models/interests';
import {
  BOOKS,
  SONGS,
  MOVIES,
  VACATION_DESTINATIONS,
} from '@/app/(onboarding)/models/fav';

// Export a centralized object with all data sources
export const INTERESTS_DATA = {
  hobbies: HOBBIES,
  sportsAndFitness: SPORTS_FITNESS,
  languages: LANGUAGES,
  favoriteBooks: BOOKS,
  favoriteSongs: SONGS,
  favoriteMovies: MOVIES,
  vacationDestination: VACATION_DESTINATIONS,
};

// Type for the keys
export type InterestDataKey = keyof typeof INTERESTS_DATA;
