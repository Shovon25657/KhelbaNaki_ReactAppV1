import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { AuthContext } from '../context/authContext'; // Import the AuthContext

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const HeaderMenu = () => {
  const [state, setState] = useContext(AuthContext);

// Function to handle logout
const handleLogout = async () => {
  try {
    // Remove token from AsyncStorage
    await AsyncStorage.removeItem('@auth'); 

    // Clear the user data and token in the global state
    setState({ ...state, user: null, token: '' });

    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
  return (
    <View>
      <TouchableOpacity onPress={handleLogout}>
        <FontAwesome5
          name="sign-out-alt"
          color={"red"}
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
  },
  iconStyle: {
    marginBottom: 3,
    alignSelf: "center",
    fontSize: 25,
  },
});

export default HeaderMenu;
