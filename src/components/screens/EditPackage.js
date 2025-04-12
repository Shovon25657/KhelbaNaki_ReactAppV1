import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const EditPackage = ({ navigation, route }) => {
  const initialPlan = route.params?.plan || { name: '', features: [] };
  const [selectedPackage, setSelectedPackage] = useState(initialPlan);

  const packages = [
    { id: '1', name: 'Bronze Package', features: ['Basic Features', 'Limited Access'] },
    { id: '2', name: 'Silver Package', features: ['Intermediate Features', 'Priority Support'] },
    { id: '3', name: 'Gold Package', features: ['Advanced Features', 'Unlimited Access'] },
  ];

  const handleSave = () => {
    navigation.navigate('EditProfile', { updatedPlan: selectedPackage });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Package</Text>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.packageCard,
              selectedPackage.id === item.id && styles.selectedPackageCard,
            ]}
            onPress={() => setSelectedPackage(item)}
          >
            <Text style={styles.packageName}>{item.name}</Text>
            <View style={styles.featuresContainer}>
              {item.features.map((feature, index) => (
                <Text key={index} style={styles.featureText}>
                  - {feature}
                </Text>
              ))}
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00ff88', marginBottom: 20 },
  packageCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#00ff88',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#16213e',
  },
  selectedPackageCard: { backgroundColor: '#00ff88' },
  packageName: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  featuresContainer: { marginTop: 10 },
  featureText: { color: '#ccc' },
  saveButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: { color: '#16213e', fontWeight: 'bold' },
});

export default EditPackage;
