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
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Profile" component={Profile} /> 
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
