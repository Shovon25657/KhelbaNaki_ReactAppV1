import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authContext";
// Import Screens - Fix any case sensitivity issues here
import SplashScreen from '../Screens/SplashScreen';
import WelcomePage from '../Screens/WelcomePage';
import LoginPage from '../Screens/Loginpage'; // Fixed case
import Registration from '../Screens/registration/Registration';
import HomeScreen from '../Screens/home/HomeScreen';
import ProfilePage from '../Screens/profile/Profile';
import EditProfile from '../Screens/profile/EditProfile/EditProfile';
import EditAbout from '../Screens/profile/EditProfile/EditAbout';
import EditLookingFor from '../Screens/profile/EditProfile/EditLookingFor';
import EditGames from '../Screens/profile/EditProfile/EditGames';
import EditPackage from '../Screens/profile/EditProfile/EditPackage';
import HeaderMenu from '../Menus/HeaderMenu';
import Chat from '../Screens/chat/Chat';
import Explore from '../Screens/Explore';
import Settings from '../Screens/home/Settings';
import Marketplace from '../Screens/marketplace/Marketplace';
import PrivacyPolicy from '../Screens/home/Privacy';
import ChatInterface from "../Screens/chat/ChatInterface";
import CreateGroup from "../Screens/chat/CreateGroup";
import PurchaseGig from "../Screens/marketplace/PurchaseGig";
import BuyGig from "../Screens/marketplace/BuyGig";
import MyLibrary from "../Screens/marketplace/MyLibrary";


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
            name="PurchaseGig"
            component={PurchaseGig}
              options={{ headerShown: false }}
          />

          <Stack.Screen
            name="BuyGig"
            component={BuyGig}
              options={{ headerShown: false }}
          />

          
          <Stack.Screen
            name="MyLibrary"
            component={MyLibrary}
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
            name="ChatInterface"
            component={ChatInterface}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="CreateGroup"
            component={CreateGroup}
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