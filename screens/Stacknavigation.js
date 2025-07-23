import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import Home from './DashboardScreen';
import SignUpScreen from './SignupScreen';
import ChooseScreen from './ChoosePlan';

import UploadAudioScreen from './UploadAudioScreen';
import DemoScreen from './DemoScreen';
import KhutbahArchive from './Achieve';
import DemoAnalysis from './DemoAnalysis';
import AnalysisResults from './AnalysisResults';
import SettingsScreen from './SettingsScreen';
import ChangePasswordScreen from './ChangePassword';
import WeeklyProgressScreen from './WeeklyProgressScreen';

const ProjectNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WelcomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ChooseScreen" component={ChooseScreen} />
        <Stack.Screen name="DemoScreen" component={DemoScreen} />
        <Stack.Screen name="UploadAudioScreen" component={UploadAudioScreen} />
        <Stack.Screen name="KhutbahArchive" component={KhutbahArchive} />
        <Stack.Screen name="DemoAnalysis" component={DemoAnalysis} />
        <Stack.Screen name="AnalysisResults" component={AnalysisResults} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen
          name="WeeklyProgressScreen"
          component={WeeklyProgressScreen}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProjectNavigation;
