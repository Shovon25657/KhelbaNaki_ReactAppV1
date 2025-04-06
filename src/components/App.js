import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './screens/Loginpage';
import HomeScreen from './screens/HomeScreen'; 
import Registration from './screens/Registration'; 
import ProfilePage from './screens/Profile';  
import EditProfile from './screens/EditProfile'; 



const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Home" component={HomeScreen} /> 
        <Stack.Screen name="Profile" component={ProfilePage} /> 
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Registration" component={Registration} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;