import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ProjectNavigation from './screens/Stacknavigation';

const DEFAULT_IP = 'http://192.168.18.97:5000';

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // ← Use the same key for getItem and setItem
        let storedIp = await AsyncStorage.getItem('MyIpAddress');
        console.log('STOREDDDDDDDDDD IPPPPPP', storedIp);

        if (!storedIp) {
          await AsyncStorage.setItem('MyIpAddress', DEFAULT_IP);
          storedIp = DEFAULT_IP;
        }
        global.MyIpAddress = storedIp;
        console.log('✅ Loaded IP:', global.MyIpAddress);
      } catch (error) {
        console.error('❌ Failed to load IP:', error);
        global.MyIpAddress = DEFAULT_IP;
      }
      setIsReady(true);
    };
    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ProjectNavigation />
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
