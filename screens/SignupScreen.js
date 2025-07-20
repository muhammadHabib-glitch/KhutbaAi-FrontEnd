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
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      );
      return;
    }

    setLoading(true);
    try {
      const apiUrl = global.MyIpAddress.startsWith('http')
        ? `${global.MyIpAddress}/signup`
        : `http://${global.MyIpAddress}/signup`;

      const response = await axios.post(apiUrl, {
        email,
        password,
        fullName, // 👈 include this field
      });

      if (response.status === 201) {
        Alert.alert(
          'Verify Your Email',
          'Signup successful. A confirmation email has been sent to your inbox. Please verify your email to activate your account.',
          [{ text: 'OK', onPress: () => navigation.replace('LoginScreen') }],
        );
      } else {
        Alert.alert('Error', response.data?.error || 'Unexpected response');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Signup failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../utils/SignUp.png')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community of believers</Text>
          </View>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="account-outline"
                size={20}
                color="#555"
                style={styles.icon}
              />
              <TextInput
                placeholder="- Enter your Full name"
                placeholderTextColor="#888"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Email */}

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
                placeholder="- Enter your email"
                placeholderTextColor="#888"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
              />
            </View>
          </View>

          {/* Password */}
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
                placeholder="- Create a password"
                placeholderTextColor="#888"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
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
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.link}>
              Already have an account?{' '}
              <Text style={styles.linkHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 150,
    paddingBottom: 80,
  },
  container: { flex: 1, justifyContent: 'center' },
  content: {
    backgroundColor: 'rgb(56, 56, 57)',
    width: '90%',
    padding: 30,
    borderRadius: 40,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 34, fontWeight: '400', color: 'white', marginBottom: 10 },
  subtitle: { fontSize: 18, color: 'rgb(242, 242, 255)', textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
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
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#218838',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 18 },
  link: { color: 'white', textAlign: 'center', marginTop: 25, fontSize: 16 },
  linkHighlight: { color: '#218838', fontWeight: '600' },
});
