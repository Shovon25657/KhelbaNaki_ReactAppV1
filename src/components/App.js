import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

// Import Screens
import LoginPage from './screens/Loginpage';
import Registration from './screens/Registration';
import HomeScreen from './screens/HomeScreen';
import ProfilePage from './screens/Profile';
import EditProfile from './screens/EditProfile';
import { AuthProvider } from './context/authContext';

// Create Stack Navigator
const Stack = createStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Check if the user is logged in when the app starts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('@auth');
        if (userToken) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // While the login status is being checked, show a loading screen
  if (isLoggedIn === null) {
    return <Text>Loading...</Text>;
  }



  return (
    <NavigationContainer>
      <AuthProvider>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={LoginPage}
        options={{ headerShown:false}} />
        <Stack.Screen name="Registration" component={Registration}
        options={{ headerShown:false}} />
        <Stack.Screen name="Home" component={HomeScreen} 
        options={{ headerShown:false}}/>
        <Stack.Screen name="Profile" component={ProfilePage} 
        options={{ headerShown:false}}/>
        <Stack.Screen name="EditProfile" component={EditProfile}
        options={{ headerShown:false}} />
      </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;
