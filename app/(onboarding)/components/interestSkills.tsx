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

export default function InterestSkills({
  handleNext,
}: {
  handleNext: () => void;
}) {
  // Interests states
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [sportsAndFitness, setSportsAndFitness] = useState<string[]>([]);
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>([]);

  const [isLoading, setLoading] = useState(false);

  // Data arrays with Unsplash images
  const HOBBIES = [
    {
      id: 'Reading',
      name: 'Reading',
      image:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    },
    {
      id: 'Photography',
      name: 'Photography',
      image:
        'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
    },
    {
      id: 'Traveling',
      name: 'Traveling',
      image:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
    },
    {
      id: 'Cooking',
      name: 'Cooking',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    },
    {
      id: 'Music',
      name: 'Music',
      image:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    },
    {
      id: 'Dancing',
      name: 'Dancing',
      image:
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
    },
    {
      id: 'Gaming',
      name: 'Gaming',
      image:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    },
    {
      id: 'Painting',
      name: 'Painting',
      image:
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
    },
    {
      id: 'Gardening',
      name: 'Gardening',
      image:
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    },
    {
      id: 'Writing',
      name: 'Writing',
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    },
    {
      id: 'Blogging',
      name: 'Blogging',
      image:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    },
    {
      id: 'Movies',
      name: 'Movies',
      image:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
    },
  ];

  const SPORTS_FITNESS = [
    {
      id: 'Gym',
      name: 'Gym',
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    },
    {
      id: 'Running',
      name: 'Running',
      image:
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
    },
    {
      id: 'Cricket',
      name: 'Cricket',
      image:
        'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
    },
    {
      id: 'Football',
      name: 'Football',
      image:
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    },
    {
      id: 'Yoga',
      name: 'Yoga',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    },
    {
      id: 'Swimming',
      name: 'Swimming',
      image:
        'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400',
    },
    {
      id: 'Cycling',
      name: 'Cycling',
      image:
        'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=400',
    },
    {
      id: 'Badminton',
      name: 'Badminton',
      image:
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
    },
    {
      id: 'Basketball',
      name: 'Basketball',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    },
    {
      id: 'Tennis',
      name: 'Tennis',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
    },
  ];

  const LANGUAGES = [
    {
      id: 'English',
      name: 'English',
      image:
        'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=400',
    },
    {
      id: 'Hindi',
      name: 'Hindi',
      image: 'https://images.unsplash.com/photo-1548690596-b24753f6b0be?w=400',
    },
    {
      id: 'Punjabi',
      name: 'Punjabi',
      image:
        'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400',
    },
    {
      id: 'Tamil',
      name: 'Tamil',
      image:
        'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400',
    },
    {
      id: 'Telugu',
      name: 'Telugu',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    },
    {
      id: 'Marathi',
      name: 'Marathi',
      image:
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    },
    {
      id: 'Bengali',
      name: 'Bengali',
      image:
        'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=400',
    },
    {
      id: 'Gujarati',
      name: 'Gujarati',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    },
    {
      id: 'Other',
      name: 'Other',
      image: 'https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=400',
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
      hobbies,
      sportsAndFitness,
      languagesSpoken,
    });
    handleNext();
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[profileStyles.stepContent, { paddingBottom: 20 }]}>
          <Text style={profileStyles.stepTitle}>Interests & Skills</Text>
          <Text style={profileStyles.stepSubtitle}>
            Share your hobbies and interests
          </Text>

          <View style={profileStyles.form}>
            {/* Interests Section */}
            <View style={styles.section}>
              {/* Hobbies */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Hobbies & Interests </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={HOBBIES}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = hobbies.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(item.id, hobbies, setHobbies)
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

              {/* Sports & Fitness */}
              <View style={profileStyles.inputGroup}>
                <Text style={profileStyles.label}>Sports & Fitness </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={SPORTS_FITNESS}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = sportsAndFitness.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            sportsAndFitness,
                            setSportsAndFitness
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

              {/* Languages Spoken */}
              <View style={[profileStyles.inputGroup, { marginBottom: 20 }]}>
                <Text style={profileStyles.label}>Languages Spoken </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={LANGUAGES}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.horizontalList}
                  renderItem={({ item }) => {
                    const isSelected = languagesSpoken.includes(item.id);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.imageCard,
                          isSelected && styles.selectedImageCard,
                        ]}
                        onPress={() =>
                          toggleSelection(
                            item.id,
                            languagesSpoken,
                            setLanguagesSpoken
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
        title={isLoading ? 'Saving...' : 'Save & Continue'}
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
  optionalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
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
