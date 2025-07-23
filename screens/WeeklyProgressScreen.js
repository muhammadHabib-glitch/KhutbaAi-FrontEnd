import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function WeeklyProgressScreen({ navigation }) {
  const [goalInput, setGoalInput] = useState('');
  const [maxAllowedGoal, setMaxAllowedGoal] = useState(6);
  const [isSaturday, setIsSaturday] = useState(false);

  useEffect(() => {
    const checkDayAndLoadKhutbahs = async () => {
      const today = new Date();
      setIsSaturday(today.getDay() === 6); // Saturday = 6
      console.log(isSaturday);
      //   console.log(today);
      console.log('🕒 Full Date:', today);
      console.log('📆 Day:', today.getDay()); // Should log 6 for Saturday

      try {
        const userId = await AsyncStorage.getItem('user_id');
        const { data } = await axios.get(`${global.MyIpAddress}/get-khutbahs`, {
          params: { user_id: userId },
        });

        const khutbahCount = data.khutbahs.length;
        console.log('Total Khutbas :   ', khutbahCount);
        let max = 6;

        if (khutbahCount <= 4) max = 2;
        else if (khutbahCount <= 6) max = 3;
        else if (khutbahCount <= 10) max = 4;
        else if (khutbahCount <= 15) max = 5;

        setMaxAllowedGoal(max);
      } catch (error) {
        console.error('Failed to load khutbah count:', error);
      }
    };

    checkDayAndLoadKhutbahs();
  }, []);

  const saveGoal = async () => {
    const goal = parseInt(goalInput, 10);
    if (!goal || goal <= 0) {
      return Alert.alert(
        'Invalid Goal',
        'Please enter a number greater than 0',
      );
    }

    if (!isSaturday) {
      return Alert.alert('Too Late', 'You can only set your goal on Saturday.');
    }

    if (goal > maxAllowedGoal) {
      return Alert.alert(
        'Goal Too High',
        `Your current level allows a max of ${maxAllowedGoal} reflections.`,
      );
    }

    try {
      const userId = await AsyncStorage.getItem('user_id');
      const response = await axios.post(`${global.MyIpAddress}/set-intention`, {
        user_id: userId,
        goal,
      });

      await AsyncStorage.setItem('current_goal', goal.toString());

      Alert.alert('Success', response.data.message, [
        { text: 'OK', onPress: () => navigation.navigate('DemoScreen') },
      ]);
    } catch (err) {
      console.error('Error setting intention:', err);
      Alert.alert('Error', 'Could not update your weekly goal');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon
          name="calendar-check"
          size={80}
          color="#00C853"
          style={styles.icon}
        />
        <Text style={styles.title}>Set Your Weekly Reflections Goal</Text>
        <Text style={styles.subtext}>
          Max allowed based on your khutbah archive: {maxAllowedGoal}
        </Text>
        <TextInput
          keyboardType="number-pad"
          value={goalInput}
          onChangeText={setGoalInput}
          placeholder="e.g. 3"
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
          <Text style={styles.saveText}>Save Weekly Goal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center' },
  content: { padding: 20, alignItems: 'center' },
  icon: { marginBottom: 20 },
  title: { color: '#fff', fontSize: 20, marginBottom: 10, textAlign: 'center' },
  subtext: { color: '#aaa', marginBottom: 10, fontSize: 14 },
  input: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#00C853',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#00C853',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
