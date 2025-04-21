import React, { useContext } from "react";
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { AuthContext } from "../context/authContext";

// Import your screens
import SplashScreen from '../Screens/SplashScreen';
import WelcomePage from '../Screens/WelcomePage';
import LoginPage from '../Screens/Loginpage';
import Registration from '../Screens/registration/Registration';
import HomeScreen from '../Screens/home/HomeScreen';
import ProfilePage from '../Screens/profile/Profile';
import EditProfile from '../Screens/profile/EditProfile/EditProfile';
// ... other imports

// Import your footer menu component
import FooterMenu from '../Menus/FooterMenu';

// Use SharedElement stack for animations
const Stack = createSharedElementStackNavigator();

// Main app container with fixed footer
const AppContainer = ({ children, showFooter = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {children}
      </View>
      {showFooter && <FooterMenu />}
    </View>
  );
};

const ScreenMenu = () => {
  const [state] = useContext(AuthContext);
  const authenticatedUser = state?.user && state?.token;

  // Helper function to wrap screen component with AppContainer
  const wrapWithContainer = (Component, showFooter = true) => {
    return (props) => (
      <AppContainer showFooter={showFooter}>
        <Component {...props} />
      </AppContainer>
    );
  };

  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        // This makes only the content area animate, not the footer
        cardStyleInterpolator: ({ current, layouts }) => {
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
          };
        },
      }}
    >
      {authenticatedUser ? (
        <>
          <Stack.Screen 
            name="Home" 
            component={wrapWithContainer(HomeScreen)} 
          />
          
          <Stack.Screen 
            name="Chat" 
            component={wrapWithContainer(Chat)}
            sharedElements={(route) => {
              return ['chat-header-icon'];
            }}
          />

          <Stack.Screen 
            name="Explore" 
            component={wrapWithContainer(Explore)}
          />
          
          <Stack.Screen 
            name="Settings" 
            component={wrapWithContainer(Settings)}
          />
          
          <Stack.Screen 
            name="Privacy" 
            component={wrapWithContainer(PrivacyPolicy)}
          />

          <Stack.Screen 
            name="Marketplace" 
            component={wrapWithContainer(Marketplace)}
            sharedElements={(route) => {
              return ['marketplace-header', 'marketplace-search'];
            }}
          />

          <Stack.Screen 
            name="PurchaseGig" 
            component={wrapWithContainer(PurchaseGig)}
            sharedElements={(route) => {
              const { gigId } = route.params;
              return [`gig-image-${gigId}`, `gig-title-${gigId}`];
            }}
          />

          <Stack.Screen 
            name="BuyGig" 
            component={wrapWithContainer(BuyGig)}
          />
          
          <Stack.Screen 
            name="MyLibrary" 
            component={wrapWithContainer(MyLibrary)}
          />

          <Stack.Screen 
            name="EditProfile" 
            component={wrapWithContainer(EditProfile)}
            sharedElements={(route) => {
              return ['profile-picture', 'profile-name', 'edit-button'];
            }}
          />
          
          <Stack.Screen 
            name="EditAbout" 
            component={wrapWithContainer(EditAbout)}
          />
          
          <Stack.Screen 
            name="EditLookingFor" 
            component={wrapWithContainer(EditLookingFor)}
          />
          
          <Stack.Screen 
            name="EditGames" 
            component={wrapWithContainer(EditGames)}
          />
          
          <Stack.Screen 
            name="EditPackage" 
            component={wrapWithContainer(EditPackage)}
          />

          <Stack.Screen 
            name="ChatInterface" 
            component={wrapWithContainer(ChatInterface)}
            sharedElements={(route) => {
              const { chatId } = route.params || {};
              return chatId ? [`chat-avatar-${chatId}`, `chat-name-${chatId}`] : [];
            }}
          />
          
          <Stack.Screen 
            name="CreateGroup" 
            component={wrapWithContainer(CreateGroup)}
          />

          <Stack.Screen 
            name="Profile" 
            component={wrapWithContainer(ProfilePage)}
            sharedElements={(route) => {
              const { userId } = route.params || {};
              return [
                `user-avatar-${userId}`,
                `user-name-${userId}`,
                `user-bio-${userId}`
              ];
            }}
          />
          
          <Stack.Screen 
            name="Account" 
            component={wrapWithContainer(EditProfile)}
          />
        </>
      ) : (
        <>
          {/* For auth screens, don't show the footer */}
          <Stack.Screen 
            name="Welcome" 
            component={wrapWithContainer(WelcomePage, false)}
            options={{
              cardStyleInterpolator: ({ current }) => ({
                cardStyle: {
                  opacity: current.progress,
                },
              }),
            }}
          />
          
          <Stack.Screen 
            name="Login" 
            component={wrapWithContainer(LoginPage, false)}
          />
          
          <Stack.Screen 
            name="Register" 
            component={wrapWithContainer(Registration, false)}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default ScreenMenu;