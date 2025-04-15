import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import WelcomePage from './screens/WelcomePage';
import LoginPage from './screens/Loginpage';
import Registration from './screens/registration/Registration';
import HomeScreen from './screens/HomeScreen';
import ProfilePage from './screens/Profile';
import EditProfile from './screens/EditProfile';
import { AuthProvider } from './context/authContext';
import EditAbout from './screens/EditAbout';
import EditLookingFor from './screens/EditLookingFor';
import EditGames from './screens/EditGames';
import EditPackage from './screens/EditPackage';
import SettingsScreen from './screens/Settings';
import PrivacyPolicy from './screens/Privacy';
import Explore from './screens/Explore';
import Marketplace from './screens/Marketplace';
import Chat from './screens/Chat';

// Create Stack Navigator
const Stack = createStackNavigator();

function App() {
  const [appReady, setAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await Promise.all([
          AsyncStorage.getItem('@auth'),
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

  if (!appReady) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#1a1a2e'
      }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? 'Home' : 'Splash'} 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#1a1a2e' }
          }}
        >
          {/* Auth Screens */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Registration" component={Registration} />

          {/* Main App Screens with Bottom Navigation */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfilePage} />
          <Stack.Screen name="Explore" component={Explore} />
          <Stack.Screen name="Marketplace" component={Marketplace} />
          <Stack.Screen name="Chat" component={Chat} />

          {/* Edit/Setting Screens */}
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="EditAbout" component={EditAbout} />
          <Stack.Screen name="EditLookingFor" component={EditLookingFor} />
          <Stack.Screen name="EditGames" component={EditGames} />
          <Stack.Screen name="EditPackage" component={EditPackage} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyPolicy} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;