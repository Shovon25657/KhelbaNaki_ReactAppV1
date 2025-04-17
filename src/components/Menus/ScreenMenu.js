import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authContext";
// Import Screens - Fix any case sensitivity issues here
import SplashScreen from '../Screens/SplashScreen';
import WelcomePage from '../Screens/WelcomePage';
import LoginPage from '../Screens/Loginpage'; // Fixed case
import Registration from '../Screens/registration/Registration';
import HomeScreen from '../Screens/HomeScreen';
import ProfilePage from '../Screens/profile/Profile';
import EditProfile from '../Screens/profile/EditProfile/EditProfile';
import EditAbout from '../Screens/profile/EditProfile/EditAbout';
import EditLookingFor from '../Screens/profile/EditProfile/EditLookingFor';
import EditGames from '../Screens/profile/EditProfile/EditGames';
import EditPackage from '../Screens/profile/EditProfile/EditPackage';
import HeaderMenu from '../Menus/HeaderMenu';
import Chat from '../Screens/Chat';
import Explore from '../Screens/Explore';
import Settings from '../Screens/Settings';

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
            name="EditAbout"
            component={EditAbout}
            options={{
              title: "Full Stack App",
              headerRight: () => <HeaderMenu />,
            }}
          />

          <Stack.Screen
            name="EditLookingFor"
            component={EditLookingFor}
            options={{
              title: "Full Stack App",
              headerRight: () => <HeaderMenu />,
            }}
          />

          <Stack.Screen
            name="EditGames"
            component={EditGames}
            options={{
              title: "Full Stack App",
              headerRight: () => <HeaderMenu />,
            }}
          />

          <Stack.Screen
            name="EditPackage"
            component={EditPackage}
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