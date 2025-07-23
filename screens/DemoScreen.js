import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const START_SECONDS = 20;

export default function DemoScreen({ navigation }) {
  const prevNurbitRef = useRef(0);
  // Profile Drawer state
  const [showProfile, setShowProfile] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // User & Stats state
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [khutbahCount, setKhutbahCount] = useState(0);
  const [reflectionsCount, setReflectionsCount] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [weeklyBest, setWeeklyBest] = useState(0); // NEW
  const [currentGoal, setCurrentGoal] = useState(1);
  const [nurbitCount, setNurbitCount] = useState(0);
  const [completedSummaries, setCompletedSummaries] = useState([]);
  const [lastGoalSet, setLastGoalSet] = useState('');
  const [reflectionList, setReflectionList] = useState([]);

  // Timer & animations
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [running, setRunning] = useState(false);
  const gaugeAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(1)).current;

  // Reflection modal & summary state
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [currentSummary, setCurrentSummary] = useState('');
  const [canMarkRead, setCanMarkRead] = useState(false);
  const [isPlaceholderSummary, setIsPlaceholderSummary] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const [currentSummaryId, setCurrentSummaryId] = useState('');

  // Fetch and hydrate on focus
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const id = await AsyncStorage.getItem('user_id');
          const name = await AsyncStorage.getItem('full_name');
          const emailAddr = await AsyncStorage.getItem('email');

          // Hydrate cached stats
          const keys = [
            'weekly_progress',
            'nurbit_count',
            'current_goal',
            'weekly_best',
            'completed_summaries',
            'last_goal_set',
          ];

          const values = await AsyncStorage.multiGet(keys);

          const getValue = key => values.find(([k]) => k === key)?.[1];

          const wp = getValue('weekly_progress');
          const nc = getValue('nurbit_count');
          const cg = getValue('current_goal');
          const wb = getValue('weekly_best');
          const completed = getValue('completed_summaries');
          const lastSet = getValue('last_goal_set');

          if (wp) setWeeklyProgress(+wp);
          if (nc) setNurbitCount(+nc);
          if (cg) setCurrentGoal(+cg);

          if (wb != null) setWeeklyBest(+wb); // Safe check
          setCompletedSummaries(completed ? JSON.parse(completed) : []);
          setLastGoalSet(lastSet || '');

          setUserId(id);
          setFullName(name || 'User');
          setEmail(emailAddr || '');

          if (!id) return;

          // 1️⃣ Fetch khutbah count
          const { data: khutData } = await axios.get(
            `${global.MyIpAddress}/get-khutbahs`,
            { params: { user_id: id } },
          );

          setKhutbahCount(khutData.khutbahs.length);

          // 2️⃣ Fetch user stats
          const { data: stats } = await axios.get(
            `${global.MyIpAddress}/user-stats`,
            { params: { user_id: id } },
          );
          setGoalReached(stats.goal_reached);

          // 3️⃣ Fetch reflections count
          const { data: reflectionStats } = await axios.get(
            `${global.MyIpAddress}/get-reflections`,
            { params: { user_id: id } },
          );

          console.log(
            'TOTAL REFLECTIONNNNNNN',
            reflectionStats.reflections_count,
          );
          setReflectionsCount(reflectionStats.reflections_count);

          const {
            weekly_progress,
            weekly_best,
            nurbits,
            current_goal,
            completed: srvCompleted,
            last_goal_set,
          } = stats;

          setWeeklyProgress(weekly_progress);
          if (weekly_best != null) setWeeklyBest(weekly_best); // Safe set
          setNurbitCount(nurbits);
          setCurrentGoal(current_goal);
          setCompletedSummaries(srvCompleted);
          setLastGoalSet(last_goal_set || '');

          // Prepare multiSet safely
          const kvs = [
            ['weekly_progress', weekly_progress.toString()],
            ['nurbit_count', nurbits.toString()],
            ['current_goal', current_goal.toString()],
            ['completed_summaries', JSON.stringify(srvCompleted)],
            ['last_goal_set', last_goal_set || ''],
          ];

          if (weekly_best != null) {
            kvs.push(['weekly_best', weekly_best.toString()]);
          }

          await AsyncStorage.multiSet(kvs);

          // Animate gauge
          Animated.timing(gaugeAnim, {
            toValue: Math.min(weekly_progress / current_goal, 1),
            duration: 400,
            useNativeDriver: false,
          }).start();
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      })();
    }, []),
  );

  // Star pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(starAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [starAnim]);

  // Reflection countdown
  useEffect(() => {
    let interval;
    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => {
          const next = s - 1;
          gaugeAnim.setValue(next / START_SECONDS);
          return next;
        });
      }, 1000);
    } else if (running && seconds === 0) {
      setRunning(false);
      setShowSummaryModal(true);
      setCanMarkRead(true);
    }
    return () => clearInterval(interval);
  }, [gaugeAnim]);

  // NEW: Logout function
  // NEW: Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Profile drawer toggle
  const toggleProfile = () => {
    if (showProfile) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SCREEN_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setShowProfile(false));
    } else {
      setShowProfile(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Countdown and gauge animation
  useEffect(() => {
    let interval;
    if (running && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => {
          const next = s - 1;
          gaugeAnim.setValue(next / START_SECONDS);
          return next;
        });
      }, 1000);
    } else if (running && seconds === 0) {
      setRunning(false);
      setShowSummaryModal(true);
      setCanMarkRead(true);
    }
    return () => clearInterval(interval);
  }, [running, seconds, gaugeAnim]);

  const startReflection = async () => {
    if (!userId) {
      console.warn('⚠️ No User ID found. Cannot start reflection.');
      return;
    }

    // Prevent reflection if no khutbahs available
    if (khutbahCount === 0) {
      Alert.alert(
        'No Khutbahs',
        'Upload at least one khutbah before reflecting',
      );
      return;
    }

    const reflectURL = `${global.MyIpAddress}/reflect`;
    console.log('🧠 Starting Reflection');
    console.log('🔗 Endpoint:', reflectURL);
    console.log('👤 User ID:', userId);

    try {
      const response = await axios.post(reflectURL, { user_id: userId });
      const data = response.data;

      setGoalReached(data.goal_reached);
      console.log('✅ Reflection data received:', data);
      console.log('GOAL REACHEDDDDDDDDDDDDDDD', data.goal_reached);

      // Handle placeholder response from backend
      if (data.placeholder) {
        setCurrentSummary(data.summary);
        setCurrentSummaryId(data.summary_id || '');
        setShowSummaryModal(true);
        setIsPlaceholderSummary(true);
        setCanMarkRead(false);
        return;
      }

      if (data?.summary && data?.timer) {
        setCurrentSummary(data.summary);
        setCurrentSummaryId(data.summary_id); // ✅ make sure this is set!
        setSeconds(data.timer);
        gaugeAnim.setValue(1);
        setRunning(true);
        setIsPlaceholderSummary(false);
        setCanMarkRead(false);
      } else {
        console.warn('⚠️ Incomplete data received:', data);
        Alert.alert(
          'Warning',
          'Incomplete reflection data received from server.',
        );
      }
    } catch (err) {
      console.error('❌ Reflection error:', err);

      if (err.response) {
        const status = err.response.status;
        const errorMessage =
          err.response.data?.error || 'Unknown error from server';

        if (status === 404) {
          if (errorMessage === 'User not found') {
            Alert.alert(
              'User Not Found',
              'The user ID was not found in the database.',
            );
          } else if (errorMessage === 'No khutbahs with summary found') {
            Alert.alert('No Data', 'No khutbah summaries found for this user.');
          } else {
            Alert.alert('Error', errorMessage);
          }
        } else {
          Alert.alert('Server Error', `Status ${status}: ${errorMessage}`);
        }
      } else if (err.request) {
        Alert.alert('Network Error', 'No response received from the server.');
      } else {
        Alert.alert('Error', err.message || 'An unexpected error occurred.');
      }
    }
  };

  const animateStar = () => {
    Animated.sequence([
      Animated.timing(starAnim, {
        toValue: 1.5, // Bigger size
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(starAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const markAsRead = async () => {
    const updated = [...completedSummaries, currentSummary];
    setCompletedSummaries(updated);

    setShowSummaryModal(false);
    setCanMarkRead(false);
    await AsyncStorage.setItem('completed_summaries', JSON.stringify(updated));

    try {
      console.log('📤 Sending reflection to backend:', {
        user_id: userId,
        summary_id: currentSummaryId,
        reflection: currentSummary,
      });

      const res = await axios.post(`${global.MyIpAddress}/save-reflection`, {
        user_id: userId,
        summary_id: currentSummaryId,
        reflection: currentSummary,
      });

      const data = res.data;

      setWeeklyProgress(data.weekly_progress);
      setCurrentGoal(data.goal);
      setNurbitCount(data.nurbits);
      setReflectionsCount(data.total_reflection); // ✅ Correct way

      console.log('🎯 Progress:', data.weekly_progress, '/', data.goal);

      const prevNurbit = prevNurbitRef.current;
      const newNurbit = data.nurbits;

      if (newNurbit > prevNurbit) {
        console.log('🎉 User gained Nurbits!');
        animateStar(); // ✅ call animation
      }

      prevNurbitRef.current = newNurbit;
      setNurbitCount(newNurbit);
    } catch (error) {
      console.error('❌ Failed to save reflection:', error);
      console.log('🔎 Error response:', error?.response?.data);
    }
  };

  // Close the summary modal
  const closeSummaryModal = () => {
    setShowSummaryModal(false);
    setCanMarkRead(false);
    setIsPlaceholderSummary(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Greeting Card */}
        <ImageBackground
          source={require('../utils/backg.jpg')}
          style={styles.greetingCardBackground}
          imageStyle={styles.greetingCardImage}
          blurRadius={2}
        >
          <View style={styles.greetingOverlay}>
            <View style={styles.topIconsRow}>
              <TouchableOpacity onPress={toggleProfile}>
                <Icon name="account-eye-outline" size={30} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingsScreen')}
              >
                <Icon name="cog-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.centerText}>
              <Text style={styles.urduGreeting}>السلام علیکم</Text>
              <Text style={styles.greeting}>Assalamu Alaikum</Text>
              <Text style={styles.welcome}>Welcome Back</Text>
              <Text style={styles.subWelcome}>
                Your spiritual journey awaits
              </Text>
              <Text style={styles.blessing}>Have a blessed evening</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <StatCard
            value={khutbahCount}
            label="Khutbas"
            icon="book-open-variant"
          />
          <StatCard
            value={reflectionsCount}
            label="Reflections"
            icon="chat-outline"
          />
          <StatCard
            value={weeklyBest}
            label="Weekly Best"
            icon="medal-outline"
          />
        </View>

        {/* Total Nurbits */}
        <View style={styles.nurbitCard}>
          <Animated.View style={{ transform: [{ scale: starAnim }] }}>
            <Icon
              name="star-circle"
              size={60}
              color={getStarGradientColor(nurbitCount)}
            />
          </Animated.View>
          <Text style={styles.nurbitCount}>{nurbitCount}</Text>
          <Text style={styles.nurbitLabel}>Total Nurbits</Text>
        </View>

        {/* Weekly Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Weekly Progress</Text>

          <View style={styles.progressPill}>
            <Icon name="heart" size={16} color="#00C853" />
            <Text style={styles.progressPillText}>Nurbits : {nurbitCount}</Text>
          </View>

          <View style={styles.gaugeContainer}>
            <View style={styles.gaugeBackground} />
            <Animated.View
              style={[
                styles.gaugeFill,
                {
                  width: gaugeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
            <View style={styles.gaugeCircle}>
              <Text style={styles.gaugeText}>
                {running ? `${seconds}s` : `${START_SECONDS}s`}
              </Text>
              <Text style={styles.reflectionsLeft}>
                {Math.max(currentGoal - weeklyProgress, 0)} Reflections Left
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.reflectionButton,
              (running || khutbahCount === 0) && styles.disabledButton,
            ]}
            onPress={startReflection}
            disabled={running || khutbahCount === 0}
          >
            <Text style={styles.reflectionButtonText}>
              {khutbahCount === 0
                ? 'Upload Khutbah First'
                : running
                ? 'Reading…'
                : 'Start Reflection →'}
            </Text>
          </TouchableOpacity>
          {/* 🎉 Success Message */}
          {goalReached && (
            <View style={styles.goalMessageContainer}>
              <Text style={styles.goalMessageText}>
                ✨ Congratulations! ✨{'\n'}Goal is Achieved, MashaAllah 🌟
              </Text>
            </View>
          )}
        </View>

        {/* Current Intention Card */}
        <View style={styles.intentionCard}>
          <View style={styles.intentionHeader}>
            <Icon name="target" size={28} color="#00C853" />
            <Text style={styles.intentionTitle}>Current Intention</Text>
          </View>
          <Text style={styles.intentionBody}>
            Improve my understanding of Tawheed and implement its teachings in
            my daily life.
          </Text>
          <TouchableOpacity style={styles.intentionButton}>
            <Text style={styles.intentionButtonText}>Update Intention →</Text>
          </TouchableOpacity>
        </View>

        {/* Reflection Summary Modal */}
        <Modal visible={showSummaryModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Close button at top-right corner */}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeSummaryModal}
              >
                <Icon name="close" size={24} color="#aaa" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Reflection Summary</Text>
              <ScrollView style={styles.modalBodyContainer}>
                <Text style={styles.modalBody}>{currentSummary}</Text>
              </ScrollView>

              {/* Only show Mark as Read for non-placeholder summaries */}
              {canMarkRead && !isPlaceholderSummary && (
                <TouchableOpacity
                  style={styles.markReadButton}
                  onPress={markAsRead}
                >
                  <Text style={styles.markReadText}>
                    Mark as Read (+10 Nurbits)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DemoScreen')}
          style={styles.tabItem}
        >
          <Icon name="home" size={28} color="#00C853" />
          <Text style={styles.tabLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UploadAudioScreen')}
          style={styles.tabItem}
        >
          <Icon name="microphone" size={28} color="#aaa" />
          <Text style={styles.tabLabel}>Record</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('KhutbahArchive')}
          style={styles.tabItem}
        >
          <Icon name="folder-multiple" size={28} color="#aaa" />
          <Text style={styles.tabLabel}>Archive</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Drawer */}
      {showProfile && (
        <>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
          <Animated.View
            style={[
              styles.profileContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleProfile}
            >
              <Icon name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.profileHeader}>
              {/* UPDATED: Removed profile image */}
              <Text style={styles.profileName}>Hi</Text>
              <Text style={styles.profileName}>{fullName}</Text>
              <Text style={{ color: 'grey' }}> {email}</Text>
              {/* UPDATED: Removed email display */}
            </View>

            <View style={styles.profileDivider} />

            {/* UPDATED: Settings button */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('WeeklyProgressScreen')}
            >
              <Icon name="calendar-check" size={24} color="#fff" />
              <Text style={styles.settingsButtonText}>Set Weekly Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('SettingsScreen')}
            >
              <Icon name="cog" size={24} color="#fff" />
              <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>

            {/* UPDATED: Logout button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
              <Icon name="logout" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const getStarGradientColor = n => {
  if (n < 100) return '#FF69B4';
  if (n < 500) return '#802191ff';
  return '#2196F3';
};

const StatCard = ({ value, label, icon }) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={28} color="#00C853" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  mainContent: { padding: 20, paddingBottom: 100 },
  greetingCardBackground: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  greetingCardImage: { borderRadius: 20 },
  greetingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  topIconsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00C853',
  },
  centerText: { alignItems: 'center', marginBottom: 20 },
  urduGreeting: { fontSize: 25, color: '#00C853', marginBottom: 4 },
  greeting: { fontSize: 14, color: '#fff', marginBottom: 8 },
  welcome: { fontSize: 30, color: '#fff', marginBottom: 4 },
  subWelcome: { fontSize: 17, color: '#ccc', marginBottom: 4 },
  blessing: { fontSize: 14, color: '#ccc' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  goalMessageContainer: {
    marginTop: 17,
    padding: 10,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
  },

  goalMessageText: {
    color: '#DAA520',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  statCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '30%',
  },
  statValue: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#aaa', marginTop: 4 },
  nurbitCard: {
    height: 350,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 30,
  },
  nurbitCount: { fontSize: 58, color: '#fff', marginTop: 86 },
  nurbitLabel: { fontSize: 14, color: '#aaa' },
  progressCard: {
    height: 550,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 12,
    marginTop: 50,
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a2f10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  progressPillText: { color: '#00C853', marginLeft: 6, fontSize: 14 },
  gaugeContainer: {
    marginTop: 30,
    width: 140,
    height: 140,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 70,
    borderWidth: 8,
    borderColor: '#333',
  },
  gaugeFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 70,
    borderWidth: 8,
    borderColor: '#00C853',
    left: 0,
    top: 0,
  },
  gaugeCircle: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gaugeText: { color: '#00C853', fontSize: 24, fontWeight: '600' },
  reflectionsLeft: { color: '#ccc', fontSize: 16, marginTop: 4 },
  reflectionButton: {
    borderWidth: 2,
    borderColor: '#00C853',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  reflectionButtonText: { color: '#00C853', fontSize: 16, fontWeight: '600' },
  disabledButton: {
    opacity: 0.5,
    borderColor: '#777',
  },
  intentionCard: {
    height: 350,
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginBottom: 30,
  },
  intentionHeader: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  intentionTitle: { fontSize: 20, color: '#fff', marginLeft: 12 },
  intentionBody: {
    marginTop: 10,
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  intentionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00C853',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  intentionButtonText: {
    color: '#00C853',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, color: '#aaa', marginTop: 4 },
  tabLabelActive: { fontSize: 12, color: '#00C853', marginTop: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBodyContainer: { maxHeight: 200, marginBottom: 20 },
  modalBody: { color: '#ccc', fontSize: 16, lineHeight: 22 },
  markReadButton: {
    backgroundColor: '#00C853',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  markReadText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  profileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  // UPDATED: Removed profileImage style
  profileName: {
    fontSize: 22,
    color: '#FFD600',
    fontWeight: 'bold',
    marginTop: 10,
  },
  // UPDATED: Removed profileEmail style
  profileDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
    marginTop: 30,
  },

  // NEW: Settings button style
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#2a2a2a',
    marginTop: 10,
    marginBottom: 5,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
    markReadButton: 10,
  },

  // UPDATED: Logout button style
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 300,
    borderRadius: 10,
    backgroundColor: '#2a2a2a',
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold',
  },
});
