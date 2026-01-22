import React, { useState } from 'react';
import RenderSection from './core/renderSection';
import SelectList from '@/app/(onboarding)/components/selectList';
import {
  BOOKS,
  SONGS,
  MOVIES,
  VACATION_DESTINATIONS,
} from '@/app/(onboarding)/models/fav';
import { useAuth } from '@/contexts/AuthContext';

import ApiService from '@/services/api';
import { ShowAlert } from '@/components/Alert';

export default function Favorites() {
  const { profile, updateProfile } = useAuth();

  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  const [books, setBooks] = useState(profile?.favoriteBooks ?? []);
  const [songs, setSongs] = useState(profile?.favoriteSongs ?? []);
  const [movies, setMovies] = useState(profile?.favoriteMovies ?? []);
  const [vacationDestinations, setVacationDestinations] = useState(
    profile?.vacationDestination ?? []
  );

  const updateState = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string[]
  ) => {
    setAction('Save');
    setter(value);
  };

  const handleSaveAction = async () => {
    setLoading(true);
    try {
      const updateData = {
        favoriteBooks: books,
        favoriteSongs: songs,
        favoriteMovies: movies,
        vacationDestination: vacationDestinations,
      }
      const response = await ApiService.updateFavorites(updateData);

      if (response.success) {
        setAction('');
        updateProfile(updateData);
        ShowAlert({
          type: 'success',
          title: 'Success',
          message: 'Favorites updated successfully',
        });
      } else {
        ShowAlert({
          type: 'error',
          title: 'Error',
          message: response.error || 'Failed to update favorites',
        });
      }
    } catch (error) {
      ShowAlert({
        type: 'error',
        title: 'Error',
        message: 'Network error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RenderSection
      title="Favorites"
      isExpanded={false}
      loading={loading}
      action={action}
      onActionClick={handleSaveAction}
    >
      <>
        <SelectList
          title="Favorite Books"
          listData={BOOKS}
          setItemData={(value) => updateState(setBooks, value)}
          preSelectedData={books}
        />

        <SelectList
          title="Favorite Songs"
          listData={SONGS}
          setItemData={(value) => updateState(setSongs, value)}
          preSelectedData={songs}
        />

        <SelectList
          title="Favorite Movies"
          listData={MOVIES}
          setItemData={(value) => updateState(setMovies, value)}
          preSelectedData={movies}
        />

        <SelectList
          title="Favorite Vacation Destination"
          listData={VACATION_DESTINATIONS}
          setItemData={(value) => updateState(setVacationDestinations, value)}
          preSelectedData={vacationDestinations}
        />
      </>
    </RenderSection>
  );
}
