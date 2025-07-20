import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import DocumentPicker from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const audioRecorderPlayer = new AudioRecorderPlayer();

const TabBar = ({ navigation, activeTab }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate('DemoScreen')}
        style={styles.tabItem}
      >
        <Icon
          name="home"
          size={28}
          color={activeTab === 'Home' ? '#00C853' : '#aaa'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'Home' && styles.tabLabelActive,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('UploadAudioScreen')}
      >
        <Icon
          name="microphone"
          size={28}
          color={activeTab === 'Record' ? '#00C853' : '#aaa'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'Record' && styles.tabLabelActive,
          ]}
        >
          Record
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate('KhutbahArchive')}
      >
        <Icon
          name="folder-multiple"
          size={28}
          color={activeTab === 'Achieve' ? '#00C853' : '#aaa'}
        />
        <Text
          style={[
            styles.tabLabel,
            activeTab === 'Archive' && styles.tabLabelActive,
          ]}
        >
          Archive
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const UploadAudioScreen = ({ navigation }) => {
  const [recordingState, setRecordingState] = useState('ready');
  const [recordingTime, setRecordingTime] = useState(0);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveOption, setSaveOption] = useState('discard');
  const [recordedFilePath, setRecordedFilePath] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userPlan, setUserPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [showProfile, setShowProfile] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [uploadUrl, setUploadUrl] = useState(null);
  const [fullName, setFullName] = useState(''); // NEW: User's full name
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const id = await AsyncStorage.getItem('user_id');
      const plan = await AsyncStorage.getItem('plan');
      const ip = await AsyncStorage.getItem('MyIpAddress');
      const name = await AsyncStorage.getItem('full_name');
      const email = await AsyncStorage.getItem('email');

      setUserId(id);
      setUserPlan(plan);
      setEmail(email);
      setFullName(name || 'User'); // NEW: Set full name or default

      if (ip) {
        setUploadUrl(`${ip}/upload-audio`);
        console.log('📡 Loaded IP:', ip);
      } else {
        Alert.alert('Error', 'No IP address found in storage');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    let timer;
    if (recordingState === 'recording') {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [recordingState]);

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

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Microphone permission is required to record audio',
        );
        return;
      }

      const path = Platform.select({
        ios: 'hello.m4a',
        android: `${RNFS.ExternalDirectoryPath}/hello.mp3`,
      });

      const uri = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener(e => {
        return;
      });

      setRecordingState('recording');
      setRecordingTime(0);
      animateButton();
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert(
        'Error',
        'Failed to start recording. Please check permissions.',
      );
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();

      setRecordedFilePath(result);
      setRecordingState('after');
      setSaveModalVisible(true);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };
  const handleUpload = async (fileUri, fileName) => {
    // 1️⃣ Ensure upload URL is ready
    if (!uploadUrl) {
      Alert.alert('Upload Error', 'Upload URL is not configured yet.');
      return;
    }

    // 2️⃣ Ensure user data is present
    if (!userId || !userPlan) {
      Alert.alert('Error', 'User information not found');
      return;
    }
    if (userPlan === 'demo') {
      Alert.alert(
        'Demo Account',
        'Demo users cannot upload audio. Showing example analysis.',
        [{ text: 'OK', onPress: () => navigation.navigate('DemoAnalysis') }],
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 3️⃣ Normalize file URI for Android
      let uploadUri = fileUri;
      if (Platform.OS === 'android' && !uploadUri.startsWith('file://')) {
        uploadUri = 'file://' + uploadUri;
      }

      // 4️⃣ Build form data
      const formData = new FormData();
      formData.append('file', {
        uri: uploadUri, // ← use uploadUri here
        name: fileName || 'recording.mp3',
        type: 'audio/mp3',
      });
      formData.append('user_id', userId);

      // 5️⃣ Send the request
      const response = await axios.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 6️⃣ Navigate on success
      navigation.navigate('AnalysisResults', {
        analysisData: response.data,
        audioPath: uploadUri,
      });
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed',
        error.message || 'An error occurred during upload',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickAudioFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      if (userPlan === 'demo') {
        Alert.alert(
          'Demo Account',
          'Demo users cannot upload audio. Showing example analysis.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('DemoAnalysis'),
            },
          ],
        );
        return;
      }

      await handleUpload(res.uri, res.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.error('Document picker error:', err);
        Alert.alert('Error', 'Failed to pick audio file');
      }
    }
  };

  const handleSave = async () => {
    setSaveModalVisible(false);
    if (saveOption === 'save' && recordedFilePath) {
      await handleUpload(recordedFilePath);
    }
    setRecordingState('ready');
    setRecordedFilePath(null);
  };

  const handleDiscard = () => {
    setSaveModalVisible(false);
    setRecordingState('ready');
    setRecordedFilePath(null);
  };

  const animateButton = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: 700,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 700,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <ImageBackground
          source={require('../utils/1.png')}
          style={styles.greetingCardBackground}
          imageStyle={styles.greetingCardImage}
          blurRadius={2}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.headerTopRow}>
              <View style={styles.topIconsRow}>
                <TouchableOpacity onPress={toggleProfile}>
                  <Icon name="account-eye-outline" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('SettingsScreen')}
              >
                <Icon name="cog-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.jumuahCountdown}>Next Jumu'ah in 1 day</Text>
              <Text style={styles.jumuahTime}>6:45 PM</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentCard}>
          <Text style={styles.readyText}>
            {isProcessing ? 'Processing...' : 'Ready to Record'}
          </Text>

          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#00C853" />
              <Text style={styles.processingText}>
                Analyzing your khutbah...
              </Text>
            </View>
          ) : (
            <>
              {recordingState === 'ready' && (
                <View style={styles.recordButtonContainer}>
                  <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <TouchableOpacity
                      style={[styles.circleButton, styles.startButton]}
                      onPress={startRecording}
                      disabled={isProcessing}
                    >
                      <Icon name="microphone" size={40} color="white" />
                    </TouchableOpacity>
                  </Animated.View>
                  <Text style={styles.buttonLabel}>Start Recording</Text>
                </View>
              )}

              {recordingState === 'recording' && (
                <View style={styles.recordButtonContainer}>
                  <Text style={styles.timerText}>
                    {formatTime(recordingTime)}
                  </Text>
                  <TouchableOpacity
                    style={[styles.circleButton, styles.stopButton]}
                    onPress={stopRecording}
                  >
                    <Icon name="stop" size={40} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.buttonLabel}>Stop Recording</Text>
                </View>
              )}

              {recordingState === 'after' && (
                <View style={styles.recordButtonContainer}>
                  <TouchableOpacity
                    style={[styles.circleButton, styles.playButton]}
                    onPress={() => setSaveModalVisible(true)}
                  >
                    <Icon name="play" size={40} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.buttonLabel}>Review Recording</Text>
                </View>
              )}

              <View style={styles.orDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.orText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePickAudioFile}
                disabled={isProcessing}
              >
                <Icon name="upload" size={20} color="#3498db" />
                <Text style={styles.uploadButtonText}>Upload Audio File</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.guidelines}>
            <Text style={styles.guidelinesTitle}>Recording Guidelines</Text>
            <View style={styles.guidelineItem}>
              <Icon name="check-circle" size={16} color="#00C853" />
              <Text style={styles.guidelinesText}>
                Ensure you have permission to record
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Icon name="check-circle" size={16} color="#00C853" />
              <Text style={styles.guidelinesText}>
                Place device close to speaker
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Icon name="check-circle" size={16} color="#00C853" />
              <Text style={styles.guidelinesText}>
                Minimize background noise
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Icon name="check-circle" size={16} color="#00C853" />
              <Text style={styles.guidelinesText}>
                Keep device stationary while recording
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Icon name="check-circle" size={16} color="#00C853" />
              <Text style={styles.guidelinesText}>
                Test audio levels before main recording
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TabBar navigation={navigation} activeTab="Record" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={saveModalVisible}
        onRequestClose={() => setSaveModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Recording?</Text>
            <Text style={styles.modalText}>
              Would you like to save this {recordingTime} second recording for
              AI transcription?
            </Text>

            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setSaveOption('discard')}
              >
                <View style={styles.radioCircle}>
                  {saveOption === 'discard' && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.optionText}>Discard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => setSaveOption('save')}
              >
                <View style={styles.radioCircle}>
                  {saveOption === 'save' && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.optionText}>Save & Analyze</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleDiscard}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSave}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
              <Text style={styles.profileName}>Hi</Text>
              <Text style={styles.profileName}>{fullName}</Text>
              <Text style={{ color: 'grey' }}> {email}</Text>
            </View>
            <View style={styles.profileDivider} />
            <TouchableOpacity style={styles.profileItem}>
              <Text style={styles.profileItemText}>Profile</Text>
            </TouchableOpacity>
            <View style={styles.settingsRow}>
              <Text style={styles.settingsText}>Light Mode</Text>
              <Icon name="weather-sunny" size={24} color="#FFD600" />
            </View>
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
              <Icon name="logout" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerBackground: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  headerImage: {
    borderRadius: 20,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greetingCardBackground: {
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    color: '#FFD600',
    fontWeight: 'bold',
    marginTop: 10,
  },
  greetingCardImage: { borderRadius: 20 },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#00C853',
  },
  headerTextContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  jumuahCountdown: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
  },
  jumuahTime: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: '700',
  },
  contentCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  readyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  recordButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circleButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  startButton: {
    backgroundColor: '#00C853',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  playButton: {
    backgroundColor: '#3498db',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 18,
    marginTop: 15,
    fontWeight: '500',
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    letterSpacing: 2,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: '#aaa',
    marginHorizontal: 10,
    fontSize: 16,
  },
  uploadButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  uploadButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  guidelines: {
    width: '100%',
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guidelinesText: {
    fontSize: 16,
    color: '#aaa',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    width: '85%',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 25,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#252525',
    marginBottom: 15,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  radioSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3498db',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#252525',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: '#3498db',
  },
  cancelButtonText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
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
    color: '#00C853',
  },
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
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  profileEmail: {
    fontSize: 14,
    color: '#ccc',
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  profileItem: {
    paddingVertical: 12,
  },
  profileItemText: {
    color: '#fff',
    fontSize: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingsText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginRight: 8,
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});

export default UploadAudioScreen;
