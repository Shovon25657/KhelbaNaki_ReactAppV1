import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authContext";


// Import Screens
import SplashScreen from '../screens/SplashScreen'; // New splash screen
import WelcomePage from '../screens/WelcomePage';
import LoginPage from '../screens/Loginpage';
import Registration from '../screens/registration/Registration';
import HomeScreen from '../screens/HomeScreen';
import ProfilePage from '../screens/profile/Profile';
import EditProfile from '../screens/profile/EditProfile/EditProfile';
import EditAbout from '../screens/EditAbout';
import EditLookingFor from '../screens/EditLookingFor';
import EditGames from '../screens/EditGames';
import EditPackage from '../screens/EditPackage';




const ScreenMenu = () => {
  //global state
  const [state] = useContext(AuthContext);
  //auth condition true false
  const authenticatedUser = state?.user && state?.token;
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Welcome">
      {authenticatedUser ? (
        <>
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfile} 
          />

          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            />
          <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          />
          <Stack.Screen 
          name="Profile" 
          component={ProfilePage} 
          />
          
          <Stack.Screen 
          name="EditAbout" 
          component={EditAbout} 
          />
          <Stack.Screen 
          name="EditLookingFor" 
          component={EditLookingFor} 
          />
          <Stack.Screen 
          name="EditGames" 
          component={EditGames} 
          />
          <Stack.Screen 
          name="EditPackage" 
          component={EditPackage} 
          />

          
          {/* <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "Full Stack App",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Post"
            component={Post}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="About"
            component={About}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Myposts"
            component={Myposts}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          /> */}


        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>


  );
};

export default ScreenMenu;


{/* <Stack.Navigator 
initialRouteName={isLoggedIn ? 'EditProfile' : 'Splash'} 
screenOptions={{ headerShown: false }}
>
</Stack.Navigator> */}