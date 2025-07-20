import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = global.MyIpAddress.startsWith('http')
        ? `${global.MyIpAddress}/login`
        : `http://${global.MyIpAddress}/login`;

      console.log('📧 Email:', email);
      console.log('🔑 Password:', password);

      const res = await axios.post(apiUrl, { email, password });

      console.log('📥 Full Login Response:', res.data);

      if (res.status === 200 && !!res.data?.userId) {
        await AsyncStorage.setItem('user_id', res.data.userId);
        await AsyncStorage.setItem('plan', res.data.plan);
        await AsyncStorage.setItem('full_name', res.data.fullName || '');
        await AsyncStorage.setItem('email', res.data.email || '');
        await AsyncStorage.setItem('imageUrl', res.data.imageUrl || '');

        console.log('✅ Login Successful');
        console.log('User ID:', res.data.userId);
        console.log('Plan:', res.data.plan);

        // ✅ Navigate based on plan
        if (res.data.plan === 'demo') {
          navigation.replace('Home');
        } else if (res.data.plan === 'premium') {
          navigation.replace('DemoScreen');
        } else {
          Alert.alert('Plan Error', 'Unknown subscription plan.');
        }
      } else {
        Alert.alert(
          'Login Failed',
          res.data.error || 'Login failed. Please try again.',
        );
      }
    } catch (error) {
      console.log('❌ Login error:', error?.response?.data || error.message);

      const errorMsg =
        error?.response?.data?.error === 'Please confirm your email first'
          ? 'Please verify your email before logging in.'
          : 'Invalid email or password';
      Alert.alert('Login Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../utils/Second.png')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.overlay} />
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="email-outline"
                size={20}
                color="#555"
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#888"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
                autoComplete="email"
                importantForAutofill="yes"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="lock-outline"
                size={20}
                color="#555"
                style={styles.icon}
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#888"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                textContentType="password"
                autoComplete="password"
                importantForAutofill="yes"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.link}>
              Don't have an account?{' '}
              <Text style={styles.linkHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 150,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'rgb(56, 56, 57)',
    width: '90%',
    padding: 30,
    height: '50%',
    borderRadius: 40,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '400',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgb(242, 242, 255)',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#218838',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  link: {
    color: 'white',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 16,
  },
  linkHighlight: {
    color: '#218838',
    fontWeight: '600',
  },
});
