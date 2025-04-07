import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Screens/Loginpage';
import HomeScreen from './Screens/HomeScreen'; 
import Registration from './Screens/Registration'; 
import ProfilePage from './Screens/Profile';  
import EditProfile from './Screens/EditProfile'; 
import { AuthProvider } from './context/authContext';



const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Profile" component={ProfilePage} /> 
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;