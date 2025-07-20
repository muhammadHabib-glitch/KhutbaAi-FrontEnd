import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

export default function ChangePasswordScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Load user ID on mount
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('user_id');
      setUserId(id);
    })();
  }, []);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation', 'New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = global.MyIpAddress.startsWith('http')
        ? `${global.MyIpAddress}/change-password/${userId}`
        : `http://${global.MyIpAddress}/change-password/${userId}`;

      const res = await axios.put(apiUrl, {
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (res.status === 200) {
        Alert.alert('Success', 'Your password has been changed.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', res.data.error || 'Failed to change password.');
      }
    } catch (err) {
      const message =
        err.response?.data?.error === 'Old password is incorrect'
          ? 'Old password is incorrect.'
          : 'Server error. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../utils/myimg2.png')} // <-- Make sure the path is correct
      style={{
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
      }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
        </View>

        {/* Centered Form Container */}
        <View style={styles.centerContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text
              style={{
                color: 'white',
                marginRight: 10,
                marginBottom: 10,
                fontSize: 30,
                fontWeight: '400',
              }}
            >
              Change Password
            </Text>
            <Icon name="delete-circle" size={40} color="white" />
          </View>

          <Text
            style={{
              color: 'grey',
              textAlign: 'center',
              marginBottom: 20,
              fontSize: 15,
              fontWeight: '400',
            }}
          >
            Fill the blacks to change your password
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Icon name="lock-outline" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Old Password"
                placeholderTextColor="white"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Icon name="lock-reset" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="white"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Icon name="lock-check-outline" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="white"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Updating…' : 'Update Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 16,
  },
  centerContainer: {
    flex: 1,

    justifyContent: 'center', // <-- vertical centering
    alignItems: 'center', // <-- horizontal centering
    marginBottom: 50,
  },
  form: {
    height: '45%',
    width: '110%', // or use a fixed width like 300
    maxWidth: 350,
    backgroundColor: '#1e1c1cff',
    borderRadius: 26,
    padding: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#388E3C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
