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
import EditAbout from '../screens/profile/EditProfile/EditAbout';
import EditLookingFor from '../screens/profile/EditProfile/EditLookingFor';
import EditGames from '../screens/profile/EditProfile/EditGames';
import EditPackage from '../screens/profile/EditProfile/EditPackage';
import HeaderMenu from '../Menus/HeaderMenu';
import Chat from '../screens/Chat';
import Explore from '../screens/Explore';
import Settings from '../screens/Settings';
import Marketplace from '../screens/Marketplace';
import PrivacyPolicy from '../screens/Privacy';

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
              options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
              options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Explore"
            component={Explore}
              options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
              options={{ headerShown: false }}
          />
           <Stack.Screen
            name="Privacy"
            component={PrivacyPolicy}
              options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Marketplace"
            component={Marketplace}
              options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditAbout"
            component={EditAbout}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EditLookingFor"
            component={EditLookingFor}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EditGames"
            component={EditGames}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="EditPackage"
            component={EditPackage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfilePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Account"
            component={EditProfile}
            options={{ headerShown: false }}
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