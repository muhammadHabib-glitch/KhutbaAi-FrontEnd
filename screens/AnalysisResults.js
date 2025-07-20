import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AnalysisResults = ({ route, navigation }) => {
  const { analysisData, audioPath } = route.params;
  const {
    transcript = '',
    summary = '',
    keywords = [],
    sentiment = { score: 'N/A' },
    tips = '',
    verses = { quran: [], hadith: [] },
  } = analysisData || {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Analysis Results</Text>

        {/* Transcript Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="text-box-multiple-outline" size={22} color="#00C853" />
            <Text style={styles.cardTitle}>Transcript</Text>
          </View>
          <Text style={styles.cardText}>{transcript}</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="format-list-bulleted" size={22} color="#00C853" />
            <Text style={styles.cardTitle}>Summary</Text>
          </View>
          <Text style={styles.cardText}>{summary}</Text>
        </View>

        {/* Keywords Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="tag-multiple" size={22} color="#00C853" />
            <Text style={styles.cardTitle}>Keywords</Text>
          </View>
          <View style={styles.keywordsContainer}>
            {Array.isArray(keywords) && keywords.length > 0 ? (
              keywords.map((kw, idx) => (
                <View key={idx} style={styles.keywordBadge}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.cardText}>No keywords found.</Text>
            )}
          </View>
        </View>

        {/* Sentiment Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="emoticon-outline" size={22} color="#00C853" />
            <Text style={styles.cardTitle}>Sentiment</Text>
          </View>
          <Text style={styles.cardText}>Score: {sentiment.score}</Text>
        </View>

        {/* Tips Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="lightbulb-on-outline" size={22} color="#00C853" />
            <Text style={styles.cardTitle}>Tips</Text>
          </View>
          <Text style={styles.cardText}>{tips}</Text>
        </View>

        {/* Verses Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="book-open-page-variant" size={22} color="#00C853" />
            <Text style={styles.cardTitle}>Verses Detected</Text>
          </View>
          {Array.isArray(verses?.quran) || Array.isArray(verses?.hadith) ? (
            [...(verses.quran || []), ...(verses.hadith || [])].map((v, i) => (
              <Text key={i} style={styles.cardText}>
                {v}
              </Text>
            ))
          ) : (
            <Text style={styles.cardText}>No verses detected.</Text>
          )}
        </View>

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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fbfbfbff',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 22,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keywordBadge: {
    backgroundColor: '#252525',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
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

export default AnalysisResults;
