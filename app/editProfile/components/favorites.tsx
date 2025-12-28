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

export default function Favorites() {
  const { profile } = useAuth();

  const [books, setBooks] = useState(profile?.favoriteBooks ?? []);
  const [songs, setSongs] = useState(profile?.favoriteSongs ?? []);
  const [movies, setMovies] = useState(profile?.favoriteMovies ?? []);
  const [vacationDestinations, setVacationDestinations] = useState(
    profile?.vacationDestination ?? []
  );

  return (
    <RenderSection title="Favorites" isExpanded={false}>
      <>
        <SelectList
          title="Favorite Books"
          listData={BOOKS}
          setItemData={setBooks}
          preSelectedData={books}
        />

        <SelectList
          title="Favorite Songs"
          listData={SONGS}
          setItemData={setSongs}
          preSelectedData={songs}
        />

        <SelectList
          title="Favorite Movies"
          listData={MOVIES}
          setItemData={setMovies}
          preSelectedData={movies}
        />

        <SelectList
          title="Favorite Vacation Destination"
          listData={VACATION_DESTINATIONS}
          setItemData={setVacationDestinations}
          preSelectedData={vacationDestinations}
        />
      </>
    </RenderSection>
  );
}
