import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Platform,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const OPTION_CAMERA = 'camera';
const OPTION_GALLERY = 'gallery';
const OPTION_AVATAR = 'avatar';

export default function SettingsScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const storedName = await AsyncStorage.getItem('full_name');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedImage) setProfileImage(storedImage);
    })();
  }, []);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleOption = async option => {
    closeMenu();
    if (option === OPTION_CAMERA) {
      const res = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
      });
      if (res.assets?.[0]?.uri) {
        await AsyncStorage.setItem('profileImage', res.assets[0].uri);
        setProfileImage(res.assets[0].uri);
      }
    } else if (option === OPTION_GALLERY) {
      const res = await launchImageLibrary({ mediaType: 'photo' });
      if (res.assets?.[0]?.uri) {
        await AsyncStorage.setItem('profileImage', res.assets[0].uri);
        setProfileImage(res.assets[0].uri);
      }
    } else {
      await AsyncStorage.removeItem('profileImage');
      setProfileImage(null);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  return (
    <ImageBackground
      source={require('../utils/myimg2.png')}
      style={styles.background}
      imageStyle={styles.greetingCardImage}
      blurRadius={2}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Profile</Text>
          <Icon name="account-outline" size={40} color="white" />
        </View>
        <Text style={styles.subtitle}>Welcome to your Profile</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <TouchableOpacity onPress={openMenu} style={styles.avatarWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={60} color="#fff" />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{name || 'Brother Abdullah'}</Text>
          <Text style={styles.email}>{email || 'abdullah@example.com'}</Text>
        </View>

        {/* Change Password */}
        <TouchableOpacity
          style={styles.changeBtn}
          onPress={handleChangePassword}
        >
          <Icon name="lock-reset" size={20} color="white" />
          <Text style={styles.changeText}>Change Password</Text>
        </TouchableOpacity>

        {/* Upload Modal */}
        <Modal
          transparent
          visible={menuVisible}
          animationType="slide"
          onRequestClose={closeMenu}
        >
          <Pressable style={styles.backdrop} onPress={closeMenu} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>Profile photo</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOption(OPTION_CAMERA)}
              >
                <Icon name="camera" size={28} color="#fff" />
                <Text style={styles.label}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOption(OPTION_GALLERY)}
              >
                <Icon name="image-multiple" size={28} color="#fff" />
                <Text style={styles.label}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOption(OPTION_AVATAR)}
              >
                <Icon name="account-circle-outline" size={28} color="#fff" />
                <Text style={styles.label}>Avatar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  greetingCardImage: {
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 16,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    color: 'white',
    marginRight: 10,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: '400',
  },
  subtitle: {
    color: 'grey',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 15,
    fontWeight: '400',
  },
  card: {
    backgroundColor: '#0f2123ff',
    borderRadius: 16,
    padding: 54,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2E7D32',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#388E3C',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#121212',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  email: {
    color: '#ccc',
    fontSize: 16,
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f2123ff',
    padding: 26,
    borderRadius: 12,
    marginTop: 30,
  },
  changeText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#000a',
  },
  sheet: {
    backgroundColor: '#1F1F1F',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#555',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
  },
  option: {
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    marginTop: 6,
    fontSize: 14,
  },
});
