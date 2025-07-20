import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KhutbahArchive = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedKhutbah, setSelectedKhutbah] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userPlan, setUserPlan] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const plan = await AsyncStorage.getItem('plan');
        console.log('User plan:', plan); // For debugging
        setUserPlan(plan || '');
      } catch (error) {
        console.error('Error loading user plan:', error);
      }
    };
    loadUserData();
  }, []);

  // Sample data with key takeaways
  const categories = ['Brotherhood', 'Community', 'Daily Life', 'Spirituality'];
  const khutbahs = [
    {
      id: '1',
      title: 'The Importance of Gratitude',
      date: 'Friday, March 15, 2024',
      description:
        'Exploring the significance of being grateful in Islam and how it affects our daily lives. Understanding the deeper meaning of "Alhamdulillah" and its impact on our spiritual growth.',
      tags: ['Gratitude', 'Spirituality', 'Daily Life'],
      keyTakeaways: [
        'Gratitude increases our blessings',
        'Being thankful improves mental well-being',
        'Ways to practice gratitude daily',
      ],
    },
    {
      id: '2',
      title: 'Building Strong Communities',
      date: 'Friday, March 8, 2024',
      description:
        'Understanding the foundations of Islamic brotherhood and the importance of community unity.',
      tags: ['Community', 'Unity', 'Brotherhood'],
      keyTakeaways: [
        'The importance of unity in Islam',
        'How to strengthen community bonds',
        'Practical steps to build brotherhood',
      ],
    },
    {
      id: '3',
      title: 'Patience in Adversity',
      date: 'Friday, March 1, 2024',
      description:
        'Lessons on maintaining patience during difficult times from Islamic teachings.',
      tags: ['Patience', 'Faith', 'Daily Life'],
      keyTakeaways: [
        'The rewards of patience in Islam',
        'Examples of patience from the Quran',
        'Practical ways to develop patience',
      ],
    },
  ];

  // Filter khutbahs based on active filters, search, and favorites
  const getFilteredKhutbahs = () => {
    return khutbahs.filter(khutbah => {
      // Apply favorites filter if in favorites mode
      if (showFavorites && !favorites.includes(khutbah.id)) return false;

      // Apply search filter
      if (appliedSearch) {
        const searchLower = appliedSearch.toLowerCase();
        const matchesSearch =
          khutbah.title.toLowerCase().includes(searchLower) ||
          khutbah.description.toLowerCase().includes(searchLower) ||
          khutbah.tags.some(tag => tag.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Apply category filter
      if (activeFilters.length > 0) {
        const matchesCategory = khutbah.tags.some(tag =>
          activeFilters.includes(tag),
        );

        if (!matchesCategory) return false;
      }

      return true;
    });
  };

  const toggleFilter = filter => {
    // Single selection behavior
    if (activeFilters.includes(filter)) {
      setActiveFilters([]);
    } else {
      setActiveFilters([filter]);
    }
  };

  const toggleFavorite = id => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const openKhutbahDetails = khutbah => {
    setSelectedKhutbah(khutbah);
    setModalVisible(true);
  };

  const handleSearch = () => {
    setAppliedSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeFilters.includes(item) && styles.activeCategory,
      ]}
      onPress={() => toggleFilter(item)}
    >
      <Text style={styles.categoryText}>{item}</Text>
      {activeFilters.includes(item) && (
        <Icon name="check" size={16} color="white" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  const renderKhutbahCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {/* FIXED: Always show star button for demo users */}
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Icon
            name={favorites.includes(item.id) ? 'star' : 'star-outline'}
            size={24}
            color={favorites.includes(item.id) ? '#4CAF50' : '#888'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <Icon name="calendar" size={16} color="#888" />
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>

      <Text style={styles.cardDescription}>{item.description}</Text>

      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>
            {tag}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        style={styles.readMoreButton}
        onPress={() => openKhutbahDetails(item)}
      >
        <Text style={styles.readMoreText}>Read more</Text>
        <Icon name="chevron-right" size={16} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Khutbah Archive</Text>
          <Text style={styles.headerSubtitle}>
            Your collection of spiritual wisdom
          </Text>
        </View>

        {/* Conditionally show favorites toggle for demo users */}
        {userPlan === 'demo' && (
          <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
            <Icon
              name={showFavorites ? 'star' : 'star-outline'}
              size={34}
              color="#4CAF50"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={25} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search khutbahs..."
          placeholderTextColor="gray"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
        />
        {searchInput ? (
          <TouchableOpacity onPress={clearSearch}>
            <Icon
              name="close"
              size={20}
              color="gray"
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Khutbah Cards */}
      <FlatList
        data={getFilteredKhutbahs()}
        renderItem={renderKhutbahCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.khutbahList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {showFavorites
              ? 'No favorite khutbahs found'
              : 'No khutbahs match your search'}
          </Text>
        }
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DemoScreen')}
          style={styles.tabItem}
        >
          <Icon name="home" size={28} color="#aaa" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UploadAudioScreen')}
          style={styles.tabItem}
        >
          <Icon name="microphone" size={28} color="#aaa" />
          <Text style={styles.tabLabel}>Record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('KhutbahArchive')}
        >
          <Icon name="folder-multiple" size={28} color="#4CAF50" />
          <Text style={styles.tabLabelActive}>Archive</Text>
        </TouchableOpacity>
      </View>

      {/* Key Takeaways Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color="#4CAF50" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{selectedKhutbah?.title}</Text>

            <View style={styles.dateContainer}>
              <Icon name="calendar" size={16} color="#888" />
              <Text style={styles.modalDate}>{selectedKhutbah?.date}</Text>
            </View>

            <Text style={styles.modalDescription}>
              {selectedKhutbah?.description}
            </Text>

            <View style={styles.tagsContainer}>
              {selectedKhutbah?.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>

            <Text style={styles.keyTakeawaysTitle}>Key Takeaways</Text>
            <View style={styles.keyTakeawaysContainer}>
              {selectedKhutbah?.keyTakeaways.map((point, index) => (
                <View key={index} style={styles.takeawayItem}>
                  <Icon
                    name="check-circle"
                    size={16}
                    color="#4CAF50"
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.takeawayText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    color: '#aaa',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 25,
  },
  searchContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: 'white',
    fontSize: 17,
  },
  clearIcon: {
    marginHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    height: 50,
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  activeCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  khutbahList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 15,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#333',
    color: '#4CAF50',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  readMoreText: {
    color: '#4CAF50',
    marginRight: 5,
    fontWeight: '500',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  modalDate: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  modalDescription: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 15,
    lineHeight: 20,
  },
  keyTakeawaysTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  keyTakeawaysContainer: {
    marginBottom: 10,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  takeawayText: {
    flex: 1,
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  tabLabelActive: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
});

export default KhutbahArchive;
