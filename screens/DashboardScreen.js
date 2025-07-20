import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ChooseScreen from './ChoosePlan';

const Home = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample carousel images
  const carouselImages = [
    require('../utils/hadithe.png'),
    require('../utils/Hadithe2.png'),
    require('../utils/Hadithe3.png'),
  ];

  // Premium benefits data with MaterialCommunityIcons
  const premiumBenefits = [
    {
      title: 'Complete Library',
      description: 'Access all Friday Khutbahs and exclusive content',
      icon: 'bookshelf',
    },
    {
      title: 'Personalized Journey',
      description: 'Custom learning path tailored to your needs',
      icon: 'chart-timeline',
    },
    {
      title: 'AI-Powered Insights',
      description: 'Deep understanding through advanced AI analysis',
      icon: 'robot',
    },
    {
      title: 'Offline Access',
      description: 'Download and listen anywhere, anytime',
      icon: 'download',
    },
    {
      title: 'Priority Support',
      description: 'Direct access to our scholarly team',
      icon: 'headset',
    },
  ];

  // Handle scroll to update current slide indicator
  const handleScroll = event => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
    setCurrentSlide(slide);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with gradient background */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Elevate Your Journey</Text>
        <Text style={styles.subtitleText}>
          Join thousands of believers on their path to knowledge
        </Text>
      </View>

      {/* Quote Section */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          "The best among you are those who learn the Quran and teach it"
        </Text>
        <Text style={styles.quoteSource}>- Sahih al-Bukhari</Text>
      </View>

      {/* Horizontal Image Carousel */}
      <View style={styles.carouselWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carouselContainer}
        >
          {carouselImages.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Slide Indicators */}
        <View style={styles.pagination}>
          {carouselImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Premium Benefits Section */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>Premium Benefits</Text>

        {premiumBenefits.map((benefit, index) => (
          <View key={index} style={styles.benefitCard}>
            <View style={styles.iconContainer}>
              <Icon name={benefit.icon} size={30} color="#1E897A" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDescription}>
                {benefit.description}
              </Text>
            </View>
          </View>
        ))}

        {/* Action Buttons */}
        <TouchableOpacity style={styles.premiumButton}>
          <Text
            onPress={() => navigation.navigate(ChooseScreen)}
            style={styles.buttonText}
          >
            Unlock Premium Access
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.demoButton}>
          <Text
            style={styles.demoButtonText}
            onPress={() => navigation.navigate('DemoScreen')}
          >
            Try Demo Version
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    backgroundColor: '#1E897A',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: '80%',
  },
  quoteContainer: {
    backgroundColor: '#121212',
    margin: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#1E897A',
  },
  quoteText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  quoteSource: {
    fontSize: 16,
    color: '#1E897A',
    textAlign: 'right',
    marginTop: 10,
    fontWeight: 'bold',
  },
  carouselWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  carouselContainer: {
    height: 200,
  },
  carouselImage: {
    width: width - 40,
    height: '100%',
    marginHorizontal: 20,
    borderRadius: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#1E897A',
    width: 20,
  },
  benefitsContainer: {
    backgroundColor: '#121212',
    borderRadius: 30,
    margin: 20,
    marginTop: 30,
    padding: 25,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E897A',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(30, 137, 122, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: '#1E897A',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  demoButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  demoButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E897A',
  },
});

export default Home;
