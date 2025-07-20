import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.85;

const ChooseScreen = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Choose Your Plan</Text>
    <Text style={styles.subtitle}>
      Select the perfect plan for your spiritual journey
    </Text>

    {/* Monthly */}
    <View
      style={[styles.cardBase, styles.cardGreenBorder, { height: CARD_HEIGHT }]}
    >
      <Icon name="star-outline" size={40} color="#00C853" style={styles.icon} />
      <Text style={styles.planTextGreen}>Monthly</Text>
      <Text style={styles.priceTextGreen}>
        $ 9.99
        <Text style={styles.periodText}> /month</Text>
      </Text>
      <View style={styles.divider} />
      {[
        'Unlimited Khutbah Recordings',
        'AI-Powered Transcription',
        'Basic Analytics',
        'Cloud Storage',
      ].map((feat, i) => (
        <View key={i} style={styles.featureRow}>
          <Icon name="check-circle" size={20} color="#00C853" />
          <Text style={styles.featureText}>{feat}</Text>
        </View>
      ))}
      <TouchableOpacity style={[styles.button, styles.buttonGreen]}>
        <Text style={styles.buttonTextWhite}>Select Monthly</Text>
      </TouchableOpacity>
    </View>

    {/* Yearly */}
    <View
      style={[
        styles.cardBase,
        styles.cardYellowBorder,
        { height: CARD_HEIGHT },
      ]}
    >
      <View style={styles.ribbon}>
        <Text style={styles.ribbonText}>Most Popular</Text>
      </View>
      <Icon
        name="crown-outline"
        size={40}
        color="#FFD600"
        style={styles.icon}
      />
      <Text style={styles.planTextYellow}>Yearly</Text>
      <Text style={styles.priceTextYellow}>
        $ 89.99
        <Text style={styles.periodText}> /year</Text>
      </Text>
      <View style={styles.divider} />
      {[
        'Everything in Monthly',
        'Advanced Analytics',
        'Priority Support',
        'Early Access Features',
        'Offline Downloads',
      ].map((feat, i) => (
        <View key={i} style={styles.featureRow}>
          <Icon name="check-circle" size={20} color="#FFD600" />
          <Text style={styles.featureText}>{feat}</Text>
        </View>
      ))}
      <TouchableOpacity style={[styles.button, styles.buttonYellow]}>
        <Text style={styles.buttonTextBlack}>Select Yearly</Text>
      </TouchableOpacity>
    </View>

    {/* Lifetime */}
    <View
      style={[
        styles.cardBase,
        styles.cardOrangeBorder,
        { height: CARD_HEIGHT },
      ]}
    >
      <Icon
        name="rocket-outline"
        size={40}
        color="#AC790D"
        style={styles.icon}
      />
      <Text style={styles.planTextOrange}>Lifetime</Text>
      <Text style={styles.priceTextOrange}>
        $ 249.99
        <Text style={styles.periodText}> /one-time</Text>
      </Text>
      <View style={styles.divider} />
      {[
        'Everything in Yearly',
        'Lifetime Updates',
        'Personal Consultation',
        'Custom Analytics',
        'API Access',
      ].map((feat, i) => (
        <View key={i} style={styles.featureRow}>
          <Icon name="check-circle" size={20} color="#AC790D" />
          <Text style={styles.featureText}>{feat}</Text>
        </View>
      ))}
      <TouchableOpacity style={[styles.button, styles.buttonOrange]}>
        <Text style={styles.buttonTextWhite}>Select Lifetime</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',

    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 50,
    fontSize: 16,
    color: '#AAAAAA',

    textAlign: 'center',
    maxWidth: 300,
  },

  cardBase: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    marginBottom: 30,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  icon: {
    marginTop: 100,
    alignSelf: 'center',
    marginBottom: 15,
  },

  // Green Card
  planTextGreen: {
    fontSize: 20,
    color: '#00C853',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  priceTextGreen: {
    fontSize: 32,
    color: '#00C853',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Yellow Card
  cardYellowBorder: {
    borderWidth: 2,
    borderColor: '#FFD600',
  },
  planTextYellow: {
    fontSize: 20,
    color: '#FFD600',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  priceTextYellow: {
    fontSize: 32,
    color: '#FFD600',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Orange Card
  planTextOrange: {
    fontSize: 20,
    color: '#AC790D',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  priceTextOrange: {
    fontSize: 32,
    color: '#AC790D',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Ribbon
  ribbon: {
    position: 'absolute',
    top: 15,
    right: -38,
    backgroundColor: '#FFD600',
    paddingVertical: 4,
    paddingHorizontal: 32,
    transform: [{ rotate: '45deg' }],
    zIndex: 2,
  },
  ribbonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },

  // Borders
  cardGreenBorder: {
    borderWidth: 2,
    borderColor: '#00C853',
  },
  cardOrangeBorder: {
    borderWidth: 2,
    borderColor: '#AC790D',
  },

  // Common styles
  periodText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 5,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  // Buttons
  button: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonGreen: {
    backgroundColor: '#218838',
  },
  buttonYellow: {
    backgroundColor: '#FFD600',
  },
  buttonOrange: {
    backgroundColor: '#AC790D',
  },
  buttonTextWhite: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonTextBlack: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ChooseScreen;
