import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Search as SearchIcon, MapPin, Briefcase, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock data for search results
const mockSearchResults = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 27,
    location: 'Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    education: 'B.Tech Computer Science',
    religion: 'Hindu',
    height: '5\'4"',
    image: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'Anita Patel',
    age: 25,
    location: 'Ahmedabad, Gujarat',
    occupation: 'Doctor',
    education: 'MBBS',
    religion: 'Hindu',
    height: '5\'2"',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'Meera Singh',
    age: 29,
    location: 'Delhi, India',
    occupation: 'Marketing Manager',
    education: 'MBA Marketing',
    religion: 'Sikh',
    height: '5\'6"',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: { min: 18, max: 35 },
    religion: '',
    occupation: '',
    location: '',
    education: '',
  });

  const handleSearch = () => {
    console.log('Searching with query:', searchQuery, 'and filters:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      ageRange: { min: 18, max: 35 },
      religion: '',
      occupation: '',
      location: '',
      education: '',
    });
  };

  const renderProfile = (profile: any) => (
    <TouchableOpacity
      key={profile.id}
      style={styles.profileCard}
      onPress={() => router.push(`/profile-details/${profile.id}`)}
    >
      <Image source={{ uri: profile.image }} style={styles.profileImage} />
      
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
        
        <View style={styles.infoRow}>
          <MapPin color="#6B7280" size={14} />
          <Text style={styles.infoText}>{profile.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Briefcase color="#6B7280" size={14} />
          <Text style={styles.infoText}>{profile.occupation}</Text>
        </View>
        
        <View style={styles.profileTags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{profile.religion}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{profile.height}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filters</Text>
        <TouchableOpacity onPress={() => setShowFilters(false)}>
          <X color="#6B7280" size={24} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Age Range</Text>
          <View style={styles.rangeContainer}>
            <TextInput
              style={styles.rangeInput}
              value={filters.ageRange.min.toString()}
              onChangeText={(value) => 
                setFilters(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange, min: parseInt(value) || 18 }
                }))
              }
              keyboardType="numeric"
              placeholder="18"
            />
            <Text style={styles.rangeSeparator}>to</Text>
            <TextInput
              style={styles.rangeInput}
              value={filters.ageRange.max.toString()}
              onChangeText={(value) => 
                setFilters(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange, max: parseInt(value) || 35 }
                }))
              }
              keyboardType="numeric"
              placeholder="35"
            />
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Religion</Text>
          <TextInput
            style={styles.filterInput}
            value={filters.religion}
            onChangeText={(value) => setFilters(prev => ({ ...prev, religion: value }))}
            placeholder="Any religion"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Occupation</Text>
          <TextInput
            style={styles.filterInput}
            value={filters.occupation}
            onChangeText={(value) => setFilters(prev => ({ ...prev, occupation: value }))}
            placeholder="Any occupation"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Location</Text>
          <TextInput
            style={styles.filterInput}
            value={filters.location}
            onChangeText={(value) => setFilters(prev => ({ ...prev, location: value }))}
            placeholder="Any location"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Education</Text>
          <TextInput
            style={styles.filterInput}
            value={filters.education}
            onChangeText={(value) => setFilters(prev => ({ ...prev, education: value }))}
            placeholder="Any education"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.filterActions}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilters(false)}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.headerSubtitle}>Find profiles that match your preferences</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, location, profession..."
            placeholderTextColor="#9CA3AF"
            onSubmitEditing={handleSearch}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter color="#E11D48" size={20} />
        </TouchableOpacity>
      </View>

      <Text style={styles.resultsCount}>{mockSearchResults.length} profiles found</Text>

      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {mockSearchResults.map(renderProfile)}
      </ScrollView>

      {showFilters && (
        <View style={styles.overlay}>
          {renderFilters()}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsCount: {
    fontSize: 16,
    color: '#6B7280',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  results: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#E11D48',
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  rangeSeparator: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E11D48',
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#E11D48',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#E11D48',
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});