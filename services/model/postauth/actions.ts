import { UserProfile } from '../../../contexts/model/userProfile';

export interface SwipeAction {
  profileId: string;
  action: 'like' | 'pass';
}

export interface MatchResult {
  isMatch: boolean;
  matchId?: string;
  profile?: UserProfile;
}
