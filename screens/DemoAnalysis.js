import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const DemoAnalysis = ({ navigation }) => {
  const [khutbahs, setKhutbahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const response = await axios.get(
          'http://192.168.18.97:5000/demo-khutbahs',
        );
        setKhutbahs(response.data.demo_khutbahs);
      } catch (err) {
        setError('Failed to load demos.');
      } finally {
        setLoading(false);
      }
    };
    fetchDemos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Demo Khutbahs</Text>

        {khutbahs.map((item, idx) => (
          <View key={idx} style={styles.card}>
            {/* Title */}
            <Text style={styles.sectionHeading}>Title</Text>
            <View style={styles.cardHeader}>
              <Icon name="star-outline" size={22} color="#00C853" />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>

            {/* Transcription */}
            <Text style={styles.sectionHeading}>Transcription</Text>
            <View style={styles.section}>
              <Icon name="text-to-speech" size={20} color="#00C853" />
              <Text style={styles.sectionText}>{item.transcription}</Text>
            </View>

            {/* Summary */}
            <Text style={styles.sectionHeading}>Summary</Text>
            <View style={styles.section}>
              <Icon name="format-list-bulleted" size={20} color="#00C853" />
              <Text style={styles.sectionText}>{item.summary}</Text>
            </View>

            {/* Duration */}
            <Text style={styles.sectionHeading}>Duration</Text>
            <View style={styles.section}>
              <Icon name="clock-outline" size={20} color="#00C853" />
              <Text style={styles.sectionText}>{item.duration}</Text>
            </View>

            {/* Tags */}
            <Text style={styles.sectionHeading}>Tags</Text>
            <View style={styles.section}>
              <Icon name="tag-multiple" size={20} color="#00C853" />
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, tIdx) => (
                  <View key={tIdx} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="arrow-left"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#ff5252',
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fbfbfb',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00C853',
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  sectionText: {
    fontSize: 16,
    color: '#ccc',
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  tagBadge: {
    backgroundColor: '#252525',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00C853',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DemoAnalysis;
