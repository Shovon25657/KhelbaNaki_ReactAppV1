import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const EditLookingFor = ({ navigation }) => {
  const [availability, setAvailability] = React.useState('');
  const [playerStyle, setPlayerStyle] = React.useState('');
  const [playMode, setPlayMode] = React.useState('');

  const handleSave = () => {
    navigation.navigate('EditProfile', {
      updatedLookingFor: { availability, playerStyle, playMode },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Looking For</Text>

      {/* Availability */}
      <View style={styles.section}>
        <Text>Availability</Text>
        <TextInput
          placeholder="Night/Day/Custom"
          value={availability}
          onChangeText={(text) => setAvailability(text)}
          style={styles.input}
        />
      </View>

      {/* Player Style */}
      <View style={styles.section}>
        <Text>Player Style</Text>
        <TextInput
          placeholder="Enter your player style"
          value={playerStyle}
          onChangeText={(text) => setPlayerStyle(text)}
          style={styles.input}
        />
      </View>

      {/* Play Mode */}
      <View style={styles.section}>
        <Text>Play Mode</Text>
        <TextInput
          placeholder="Enter your play mode"
          value={playMode}
          onChangeText={(text) => setPlayMode(text)}
          style={styles.input}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={{ color: '#fff' }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 24 },
  section: { marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 10 },
  saveButton: { backgroundColor: '#00ff88', paddingVertical: 10 },
});

export default EditLookingFor;
