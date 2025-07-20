import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <ImageBackground
        source={require('../utils/First.png')}
        style={styles.background}
        resizeMode="cover"
        blurRadius={2}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Khutba.AI</Text>
          <Text style={styles.subtitle}>Your Digital Spiritual Companion</Text>

          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Begin Your Spiritual Journey</Text>
            <Text style={styles.cardText}>
              Let us guide you on your path to deeper understanding and
              spiritual growth through the power of modern technology.
            </Text>

            <View style={styles.featureRow}>
              <View style={styles.iconWrapper}>
                <Icon name="book-open-page-variant" size={20} color="#00c781" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Smart Transcription</Text>
                <Text style={styles.featureSubtitle}>
                  Capture and preserve every word of wisdom
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.iconWrapper}>
                <Icon name="message" size={20} color="#00c781" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>AI-Powered Insights</Text>
                <Text style={styles.featureSubtitle}>
                  Gain deeper understanding through analysis
                </Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.iconWrapper}>
                <Icon name="heart-outline" size={20} color="#00c781" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Personal Growth</Text>
                <Text style={styles.featureSubtitle}>
                  Track your spiritual journey
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.buttonText}>Begin Your Journey</Text>
            </TouchableOpacity>

            <Text style={styles.privacyText}>
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 150,
    paddingBottom: 80,
  },
  title: {
    fontSize: 59,
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 17,
    color: '#ccc',
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: 'rgba(36, 36, 39, 0.83)',
    borderRadius: 20,
    padding: 30,
    width: '92%',
  },
  cardTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  cardText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'left',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    backgroundColor: 'rgba(0, 199, 129, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    padding: 5,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  featureSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#218838',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',

    fontSize: 20,
  },
  privacyText: {
    marginTop: 20,
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
  },
});
