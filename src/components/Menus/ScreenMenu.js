import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authContext";

// Import Screens - Fix any case sensitivity issues here
import SplashScreen from '../screens/SplashScreen';
import WelcomePage from '../screens/WelcomePage';
import LoginPage from '../screens/Loginpage'; // Fixed case
import Registration from '../screens/registration/Registration';
import HomeScreen from '../screens/HomeScreen';
import ProfilePage from '../screens/profile/Profile';
import EditProfile from '../screens/profile/EditProfile/EditProfile';
import EditAbout from '../screens/EditAbout';
import EditLookingFor from '../screens/EditLookingFor';
import EditGames from '../screens/EditGames';
import EditPackage from '../screens/EditPackage';
import HeaderMenu from '../Menus/HeaderMenu';

const Stack = createNativeStackNavigator();

const ScreenMenu = () => {
  const [state] = useContext(AuthContext);
  const authenticatedUser = state?.user && state?.token;

  return (
    <Stack.Navigator initialRouteName="Welcome">
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Full Stack App",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfilePage}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
          <Stack.Screen
            name="Account"
            component={EditProfile}
            options={{
              headerBackTitle: "Back",
              headerRight: () => <HeaderMenu />,
            }}
          />
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
            name="Register"
            component={Registration}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ScreenMenu;