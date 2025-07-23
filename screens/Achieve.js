import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';

const KhutbahArchive = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedKhutbah, setSelectedKhutbah] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userPlan, setUserPlan] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [khutbahs, setKhutbahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedKhutbahs, setExpandedKhutbahs] = useState({});
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);

  const categories = ['Brotherhood', 'Community', 'Daily Life', 'Spirituality'];
  const demoKhutbahs = [
    {
      id: '1',
      title: 'The Importance of Gratitude',
      date: 'Friday, March 15, 2024',
      description:
        'Exploring the significance of being grateful in Islam and how it affects our daily lives.',
      tags: ['Gratitude', 'Spirituality', 'Daily Life'],
      keyTakeaways: [
        'Gratitude increases our blessings',
        'Being thankful improves mental well-being',
        'Ways to practice gratitude daily',
      ],
      transcript: 'Full transcript for The Importance of Gratitude...',
      is_favorite: false,
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
      transcript: 'Full transcript for Building Strong Communities...',
      is_favorite: false,
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
      transcript: 'Full transcript for Patience in Adversity...',
      is_favorite: false,
    },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const ip = await AsyncStorage.getItem('MyIpAddress');
        console.log('IIIIIIIIIIPPPPPPPPPPPPPPPPP', ip);
        const plan = await AsyncStorage.getItem('plan');
        const id = await AsyncStorage.getItem('user_id');
        console.log('USER IDDDDDDDDDDDDDDDDDDDD', id);
        setUserPlan(plan || '');
        setUserId(id || '');
        if (!ip) {
          console.error('No IP found in AsyncStorage');
          setError('Server configuration missing');
          setLoading(false);
          return;
        }

        if (plan === 'premium') {
          setLoading(true);
          setError(null);

          const response = await fetch(`${ip}/get-khutbahs?user_id=${id}`);

          if (!response.ok) throw new Error(`Status ${response.status}`);

          const data = await response.json();
          console.log('DATAAAAA', data);
          //          const formattedKhutbahs = data.khutbahs.map(k => ({
          //   id: k.id,
          //   title: k.summary
          //     ? k.summary.split(' ').slice(0, 5).join(' ') + (k.summary.split(' ').length > 5 ? '...' : '')
          //     : 'Untitled Khutbah', // Handle null summary
          //   date: formatDate(k.created),
          //   description: k.summary || '', // Handle null summary
          //   tags: k.keywords?.slice(0, 3) || [],
          //   keyTakeaways: k.tips
          //     ? k.tips.split('\n').filter(p => p.trim() !== '')
          //     : [],
          //   transcript: k.transcript || '',
          //   is_favorite: k.is_favorite || false,
          // }));
          const formattedKhutbahs = data.khutbahs.map(k => ({
            id: k.id,
            title: k.summary
              ? k.summary.split(' ').slice(0, 5).join(' ') +
                (k.summary.split(' ').length > 5 ? '...' : '')
              : 'Untitled Khutbah', // Handle null summary
            date: formatDate(k.created),
            description: k.summary || '', // Handle null summary
            tags: k.keywords?.slice(0, 3) || [],
            keyTakeaways: k.tips
              ? k.tips.split('\n').filter(p => p.trim() !== '')
              : [],
            transcript: k.transcript || '',
            is_favorite: k.is_favorite || false,
          }));

          setKhutbahs(formattedKhutbahs);
          const favs = formattedKhutbahs
            .filter(k => k.is_favorite)
            .map(k => k.id);
          setFavorites(favs);
        } else {
          const demoData = [
            {
              id: '1',
              title: 'The Importance of Gratitude',
              date: 'Friday, March 15, 2024',
              description:
                'Exploring the significance of being grateful in Islam and how it affects our daily lives.',
              tags: ['Gratitude', 'Spirituality', 'Daily Life'],
              keyTakeaways: [
                'Gratitude increases our blessings',
                'Being thankful improves mental well-being',
                'Ways to practice gratitude daily',
              ],
              transcript: 'Full transcript for The Importance of Gratitude...',
              is_favorite: false,
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
              transcript: 'Full transcript for Building Strong Communities...',
              is_favorite: false,
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
              transcript: 'Full transcript for Patience in Adversity...',
              is_favorite: false,
            },
          ];

          setKhutbahs(demoData);
        }
      } catch (error) {
        console.error('Error loading khutbahs:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadUserData();
  }, []);

  const refetchPremiumKhutbahs = async () => {
    try {
      const ip = await AsyncStorage.getItem('MyIpAddress');

      const url = `${ip}/get-khutbahs?user_id=${userId}`;
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const data = await response.json();

      const formattedKhutbahs = data.khutbahs.map(k => ({
        id: k.id,
        title: k.summary
          ? k.summary.split(' ').slice(0, 5).join(' ') +
            (k.summary.split(' ').length > 5 ? '...' : '')
          : 'Untitled Khutbah',
        date: formatDate(k.created),
        description: k.summary,
        tags: k.keywords?.slice(0, 3) || [],
        keyTakeaways: k.tips
          ? k.tips.split('\n').filter(p => p.trim() !== '')
          : [],
        transcript: k.transcript,
        is_favorite: k.is_favorite || false,
      }));

      setKhutbahs(formattedKhutbahs);
      const favs = formattedKhutbahs.filter(k => k.is_favorite).map(k => k.id);
      setFavorites(favs);
    } catch (err) {
      console.error('❌ Refetch Error:', err.message);
      setError('Failed to load khutbahs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const searchKhutbahs = async () => {
    if (!searchInput.trim()) {
      setAppliedSearch('');
      if (userPlan === 'premium') {
        await refetchPremiumKhutbahs();
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const ip = await AsyncStorage.getItem('MyIpAddress');
      const url = `${ip}/search-khutbahs?user_id=${userId}&query=${encodeURIComponent(
        searchInput,
      )}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const data = await response.json();

      const formattedResults = data.khutbahs.map(k => ({
        id: k.id,
        title:
          k.summary.split(' ').slice(0, 5).join(' ') +
          (k.summary.split(' ').length > 5 ? '...' : ''),
        date: formatDate(k.created),
        description: k.summary,
        tags: k.tags || [],
        keyTakeaways: [],
        transcript: '',
        is_favorite: k.is_favorite || false,
      }));

      setKhutbahs(formattedResults);
      setAppliedSearch(searchInput);
    } catch (err) {
      console.error('❌ Search Error:', err.message);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavoritePremium = async id => {
    try {
      const ip = await AsyncStorage.getItem('MyIpAddress');
      const url = `${ip}/khutbah/favorite`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, khutbah_id: id }),
      });

      if (!response.ok) throw new Error('Toggle failed');

      const result = await response.json();

      const updatedKhutbahs = khutbahs.map(k =>
        k.id === id ? { ...k, is_favorite: result.is_favorite } : k,
      );
      setKhutbahs(updatedKhutbahs);

      if (result.is_favorite) {
        setFavorites([...favorites, id]);
      } else {
        setFavorites(favorites.filter(item => item !== id));
      }
    } catch (err) {
      console.error('❌ Favorite Toggle Error:', err.message);
      setError('Failed to update favorite');
    }
  };

  const formatDate = dateString => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const toggleExpand = id => {
    setExpandedKhutbahs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getFilteredKhutbahs = () => {
    return khutbahs.filter(k => {
      if (showFavorites && !favorites.includes(k.id)) return false;
      if (userPlan === 'demo' && appliedSearch) {
        const s = appliedSearch.toLowerCase();
        const match =
          k.title.toLowerCase().includes(s) ||
          k.description.toLowerCase().includes(s) ||
          (k.tags && k.tags.some(t => t.toLowerCase().includes(s)));
        if (!match) return false;
      }
      if (userPlan === 'demo' && activeFilters.length > 0) {
        const match = k.tags.some(tag => activeFilters.includes(tag));
        if (!match) return false;
      }
      return true;
    });
  };

  const toggleFilter = filter => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const toggleFavorite = async id => {
    if (userPlan === 'premium') await toggleFavoritePremium(id);
    else {
      const updated = khutbahs.map(k =>
        k.id === id ? { ...k, is_favorite: !k.is_favorite } : k,
      );
      setKhutbahs(updated);
      if (favorites.includes(id)) {
        setFavorites(favorites.filter(i => i !== id));
      } else {
        setFavorites([...favorites, id]);
      }
    }
  };

  const handleSearch = () => {
    if (userPlan === 'premium') searchKhutbahs();
    else setAppliedSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
    if (userPlan === 'premium') refetchPremiumKhutbahs();
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (userPlan === 'premium') refetchPremiumKhutbahs();
    else {
      setKhutbahs(demoKhutbahs);
      setRefreshing(false);
    }
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
  const renderKhutbahCard = ({ item }) => {
    const isExpanded = expandedKhutbahs[item.id];
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Icon
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? '#4CAF50' : '#888'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.dateContainer}>
          <Icon name="calendar" size={16} color="#888" />
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>

        <Text style={styles.cardDescription}>{item.description}</Text>

        {item.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        )}

        {isExpanded && item.keyTakeaways?.length > 0 && (
          <>
            <Text style={styles.keyTakeawaysTitle}>Key Takeaways</Text>
            <View style={styles.keyTakeawaysContainer}>
              {item.keyTakeaways.map((point, index) => (
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
          </>
        )}

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => toggleExpand(item.id)}
        >
          <Text style={styles.readMoreText}>
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#4CAF50"
          />
        </TouchableOpacity>

        {isExpanded && (
          <TouchableOpacity
            style={styles.transcriptButton}
            onPress={() => {
              setSelectedKhutbah(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.transcriptButtonText}>
              View Full Transcript
            </Text>
            <Icon name="text" size={16} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={
              userPlan === 'premium' ? refetchPremiumKhutbahs : onRefresh
            }
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
        <TouchableOpacity onPress={() => setShowFavorites(!showFavorites)}>
          <Icon
            name={showFavorites ? 'star' : 'star-outline'}
            size={34}
            color="#4CAF50"
          />
        </TouchableOpacity>
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

      {/* Categories (demo users only) */}
      {userPlan === 'demo' && (
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
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Khutbah Cards List */}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      />

      {/* Bottom Tab Bar */}
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

      {/* Transcript Modal */}
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

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalDescription}>
                {selectedKhutbah?.transcript}
              </Text>
            </ScrollView>
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
  keyTakeawaysTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 10,
  },
  keyTakeawaysContainer: {
    marginBottom: 15,
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
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  readMoreText: {
    color: '#4CAF50',
    marginRight: 5,
    fontWeight: '500',
  },
  transcriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  transcriptButtonText: {
    color: '#4CAF50',
    marginRight: 8,
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
  modalScroll: {
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
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 22,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default KhutbahArchive;
