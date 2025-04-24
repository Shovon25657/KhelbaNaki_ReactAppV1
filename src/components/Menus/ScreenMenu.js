import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authContext";
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

// Import Screens (all your imports remain the same)
import SplashScreen from '../Screens/SplashScreen';
import WelcomePage from '../Screens/WelcomePage';
import LoginPage from '../Screens/Loginpage';
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
import Explore from '../Screens/newsfeed/Explore';
import Settings from '../Screens/home/Settings';
import Marketplace from '../Screens/marketplace/Marketplace';
import PrivacyPolicy from '../Screens/home/Privacy';
import ChatInterface from "../Screens/chat/ChatInterface";
import CreateGroup from "../Screens/chat/CreateGroup";
import PurchaseGig from "../Screens/marketplace/PurchaseGig";
import BuyGig from "../Screens/marketplace/BuyGig";
import MyLibrary from "../Screens/marketplace/MyLibrary";
import FeedProfile from "../Screens/newsfeed/FeedProfile";


// Use SharedElement stack navigator for smart animations
const Stack = createSharedElementStackNavigator();

const ScreenMenu = () => {
  const [state] = useContext(AuthContext);
  const authenticatedUser = state?.user && state?.token;

  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        // Default transition configuration
        cardStyleInterpolator: ({ current, next, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          };
        },
      }}
    >
      {authenticatedUser ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          
          <Stack.Screen 
            name="Chat" 
            component={Chat} 
            sharedElements={(route) => {
              return ['chat-header-icon'];
            }}
          />

          <Stack.Screen
            name="Explore"
            component={Explore}
              options={{ headerShown: false }}
          />

          <Stack.Screen
            name="FeedProfile"
            component={FeedProfile}
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

          
          
          
         

          

          
          <Stack.Screen name="MyLibrary" component={MyLibrary} />

          <Stack.Screen 
            name="EditProfile" 
            component={EditProfile}
            options={{
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    transform: [
                      {
                        translateY: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.height, 0],
                        }),
                      },
                    ],
                  },
                };
              },
            }}
            sharedElements={(route) => {
              return ['profile-picture', 'profile-name', 'edit-button'];
            }}
          />
          
          <Stack.Screen name="EditAbout" component={EditAbout} />
          <Stack.Screen name="EditLookingFor" component={EditLookingFor} />
          <Stack.Screen name="EditGames" component={EditGames} />
          <Stack.Screen name="EditPackage" component={EditPackage} />

          <Stack.Screen 
            name="ChatInterface" 
            component={ChatInterface}
            sharedElements={(route) => {
              const { chatId } = route.params || {};
              return chatId ? [`chat-avatar-${chatId}`, `chat-name-${chatId}`] : [];
            }}
          />
          
          <Stack.Screen name="CreateGroup" component={CreateGroup} />

          <Stack.Screen 
            name="Profile" 
            component={ProfilePage}
            sharedElements={(route) => {
              const { userId } = route.params || {};
              return [
                `user-avatar-${userId}`,
                `user-name-${userId}`,
                `user-bio-${userId}`
              ];
            }}
          />
          
          <Stack.Screen name="Account" component={EditProfile} />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomePage}
            options={{
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: {
                  opacity: current.progress,
                },
              }),
            }}
          />
          
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Register" component={Registration} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default ScreenMenu;