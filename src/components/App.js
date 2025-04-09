import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

// Import Screens
import SplashScreen from './screens/SplashScreen'; // New splash screen
import WelcomePage from './screens/WelcomePage';
import LoginPage from './screens/Loginpage';
import Registration from './screens/Registration';
import HomeScreen from './screens/HomeScreen';
import ProfilePage from './screens/Profile';
import EditProfile from './screens/EditProfile';
import { AuthProvider } from './context/authContext';

// Create Stack Navigator
const Stack = createStackNavigator();

function App() {
  const [appReady, setAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Check if the user is logged in and prepare app
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Simulate loading resources
        await Promise.all([
          AsyncStorage.getItem('@auth'),
          // Add other async tasks here if needed
        ]);

        const userToken = await AsyncStorage.getItem('@auth');
        setIsLoggedIn(!!userToken);
      } catch (error) {
        console.error('Error preparing app:', error);
        setIsLoggedIn(false);
      } finally {
        setAppReady(true);
      }
    };

    prepareApp();
  }, []);

  // Show loading indicator while checking auth status
  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? 'Home' : 'Splash'} 
          screenOptions={{ headerShown: false }}
        >
          {/* Splash screen shows first, then navigates automatically */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          
          {/* Auth screens */}
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Registration" component={Registration} />
          
          {/* App screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;