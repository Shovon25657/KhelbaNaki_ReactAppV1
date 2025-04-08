import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Loginpage';
import HomeScreen from './HomeScreen'; // Create this screen
import Profile from './Profile'; // Create this screen
import Registration from './Registration'; // Create this screen


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Welcome'}>
        {/* Define the stack screens here */}
        <Stack.Screen name="Welcome" component={WelcomePage}
        options={{ headerShown:false}} />
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
    </NavigationContainer>
  );
}
