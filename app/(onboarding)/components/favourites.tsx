import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import { profileStyles } from './styles';
import { Colors } from '@/assets/colors/colors';
import PrimaryButton from '@/components/PrimaryButton';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';

export default function Favourites({ handleNext }: { handleNext: () => void }) {
  // Favourites states
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>([]);
  const [vacationDestination, setVacationDestination] = useState<string[]>([]);

  const [isLoading, setLoading] = useState(false);

  // Data arrays with Unsplash images
  const BOOKS = [
    {
      id: 'Fiction',
      name: 'Fiction',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    },
    {
      id: 'Non-Fiction',
      name: 'Non-Fiction',
      image:
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400',
    },
    {
      id: 'Mystery',
      name: 'Mystery',
      image:
        'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400',
    },
    {
      id: 'Romance',
      name: 'Romance',
      image:
        'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400',
    },
    {
      id: 'Sci-Fi',
      name: 'Sci-Fi',
      image:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    },
    {
      id: 'Biography',
      name: 'Biography',
      image:
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400',
    },
    {
      id: 'Self-Help',
      name: 'Self-Help',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    },
    {
      id: 'History',
      name: 'History',
      image:
        'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
    },
    {
      id: 'Poetry',
      name: 'Poetry',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    },
    {
      id: 'Comics',
      name: 'Comics',
      image:
        'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
    },
  ];

  const SONGS = [
    {
      id: 'English Pop',
      name: 'English Pop',
      image:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    },
    {
      id: 'Hindi',
      name: 'Hindi',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    },
    {
      id: 'Punjabi',
      name: 'Punjabi',
      image:
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
    },
    {
      id: 'Bollywood',
      name: 'Bollywood',
      image:
        'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400',
    },
    {
      id: 'Rock',
      name: 'Rock',
      image:
        'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400',
    },
    {
      id: 'Classical',
      name: 'Classical',
      image:
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400',
    },
    {
      id: 'Jazz',
      name: 'Jazz',
      image:
        'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
    },
    {
      id: 'Hip-Hop',
      name: 'Hip-Hop',
      image:
        'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400',
    },
    {
      id: 'EDM',
      name: 'EDM',
      image:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    },
    {
      id: 'Indie',
      name: 'Indie',
      image:
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    },
  ];

  const MOVIES = [
    {
      id: 'Hollywood',
      name: 'Hollywood',
      image:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    },
    {
      id: 'Bollywood',
      name: 'Bollywood',
      image:
        'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400',
    },
    {
      id: 'Action',
      name: 'Action',
      image:
        'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400',
    },
    {
      id: 'Comedy',
      name: 'Comedy',
      image:
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    },
    {
      id: 'Drama',
      name: 'Drama',
      image:
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
    },
    {
      id: 'Thriller',
      name: 'Thriller',
      image:
        'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
    },
    {
      id: 'Horror',
      name: 'Horror',
      image:
        'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400',
    },
    {
      id: 'Romance',
      name: 'Romance',
      image:
        'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400',
    },
    {
      id: 'Sci-Fi',
      name: 'Sci-Fi',
      image:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400',
    },
    {
      id: 'Animated',
      name: 'Animated',
      image:
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    },
  ];

  const VACATION_DESTINATIONS = [
    {
      id: 'Mountains',
      name: 'Mountains',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    },
    {
      id: 'Beach',
      name: 'Beach',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    },
    {
      id: 'City',
      name: 'City',
      image:
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
    },
    {
      id: 'Desert',
      name: 'Desert',
      image:
        'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
    },
    {
      id: 'Countryside',
      name: 'Countryside',
      image:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
    },
    {
      id: 'Islands',
      name: 'Islands',
      image: 'https://images.unsplash.com/photo-1559827260-dc066d6d1e27?w=400',
    },
    {
      id: 'Historical Sites',
      name: 'Historical Sites',
      image:
        'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=400',
    },
    {
      id: 'Adventure',
      name: 'Adventure',
      image:
        'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400',
    },
    {
      id: 'Wildlife',
      name: 'Wildlife',
      image:
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400',
    },
    {
      id: 'Spiritual',
      name: 'Spiritual',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
    },
  ];

  // Toggle selection for arrays
  const toggleSelection = (
    item: string,
    selectedArray: string[],
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selectedArray.includes(item)) {
      setSelectedArray(selectedArray.filter((i) => i !== item));
    } else {
      setSelectedArray([...selectedArray, item]);
    }
  };

  const handleSaveButton = () => {
    // TODO: Implement save functionality
    console.log({
      favoriteBooks,
      favoriteSongs,
      favoriteMovies,
      vacationDestination,
    });
    handleNext();
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Your Favourites</Text>
          <Text style={profileStyles.stepSubtitle}>Share what you love</Text>

          <View style={profileStyles.form}>
            {/* Favourites Section */}
            <View style={styles.section}>
              {/* Favorite Books */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Favorite Books </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={BOOKS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = favoriteBooks.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            favoriteBooks,
                            setFavoriteBooks
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Favorite Songs */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Favorite Music </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={SONGS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = favoriteSongs.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            favoriteSongs,
                            setFavoriteSongs
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Favorite Movies */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Favorite Movies </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={MOVIES}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = favoriteMovies.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            favoriteMovies,
                            setFavoriteMovies
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Vacation Destinations */}
              <View style={[profileStyles.inputGroup, { marginBottom: 20 }]}>
                <Text style={profileStyles.label}>Dream Vacation </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={VACATION_DESTINATIONS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = vacationDestination.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            vacationDestination,
                            setVacationDestination
                          )
                        }
                      >
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.cardImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.checkmarkOverlay}>
                              <View style={styles.checkmarkCircle}>
                                <Check color="#FFFFFF" size={16} />
                              </View>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.cardText,
                            isSelected && styles.selectedCardText,
                          ]}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        title={isLoading ? 'Saving...' : 'Complete Profile'}
        enabled={!isLoading}
        onPress={handleSaveButton}
      />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  horizontalList: {
    paddingVertical: 8,
    gap: 12,
  },
  imageCard: {
    width: 120,
    marginRight: 12,
  },
  selectedImageCard: {
    transform: [{ scale: 0.95 }],
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  checkmarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(225, 29, 72, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  selectedCardText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
