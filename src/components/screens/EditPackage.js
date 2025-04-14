import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const EditPackage = ({ navigation, route }) => {
  const initialPlan = route.params?.plan || { id: '', name: '', features: [], price: 0 };
  const [selectedPackage, setSelectedPackage] = useState(initialPlan);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const packages = [
    { 
      id: '1', 
      name: 'Bronze Package', 
      features: [
        'Basic Features',
        'Limited Access',
        'Standard Support',
        '5 GB Storage'
      ],
      price: 4.99,
      color: '#cd7f32'
    },
    { 
      id: '2', 
      name: 'Silver Package', 
      features: [
        'Intermediate Features',
        'Priority Support',
        'Advanced Analytics',
        '50 GB Storage',
        'Ad-free Experience'
      ],
      price: 9.99,
      color: '#c0c0c0'
    },
    { 
      id: '3', 
      name: 'Gold Package', 
      features: [
        'Advanced Features',
        'Unlimited Access',
        '24/7 VIP Support',
        '1 TB Storage',
        'Exclusive Content',
        'Early Access'
      ],
      price: 19.99,
      color: '#ffd700'
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
    setPaymentSuccess(false);
  };

  const handlePayment = () => {
    setTimeout(() => {
      setPaymentSuccess(true);
    }, 1500);
  };

  const handleComplete = () => {
    setShowPaymentModal(false);
    navigation.navigate('EditProfile', { updatedPlan: selectedPackage });
  };

  const renderPackage = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.packageCard,
        { 
          backgroundColor: '#16213e',
          borderColor: item.color,
          borderWidth: selectedPackage.id === item.id ? 3 : 1
        }
      ]}
      onPress={() => handleSelectPackage(item)}
    >
      <View style={[styles.packageHeader, { backgroundColor: item.color }]}>
        <Text style={styles.packageName}>{item.name}</Text>
        <Text style={styles.packagePrice}>${item.price}/month</Text>
      </View>
      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#00ff88" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={[styles.selectButton, { backgroundColor: item.color }]}
        onPress={() => handleSelectPackage(item)}
      >
        <Text style={styles.selectButtonText}>
          {selectedPackage.id === item.id ? 'SELECTED' : 'SELECT'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header with spacing from status bar */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#00ff88" />
            </TouchableOpacity>
            <Text style={styles.title}>Choose Your Package</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>
        </View>
        
        <Text style={styles.subtitle}>Select the plan that fits your needs</Text>
        
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={renderPackage}
          contentContainerStyle={styles.listContainer}
        />

        {/* Payment Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPaymentModal}
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {!paymentSuccess ? (
                <>
                  <Text style={styles.modalTitle}>Payment Details</Text>
                  <View style={styles.packageSummary}>
                    <Text style={styles.summaryTitle}>Selected Package:</Text>
                    <Text style={styles.summaryName}>{selectedPackage.name}</Text>
                    <Text style={styles.summaryPrice}>${selectedPackage.price}/month</Text>
                  </View>
                  
                  <View style={styles.paymentForm}>
                    <Text style={styles.paymentTitle}>Enter Card Details</Text>
                    <View style={styles.cardInput}>
                      <Text style={styles.cardText}>4242 4242 4242 4242</Text>
                    </View>
                    <View style={styles.cardDetails}>
                      <View style={styles.cardDetailInput}>
                        <Text style={styles.cardText}>MM/YY</Text>
                      </View>
                      <View style={styles.cardDetailInput}>
                        <Text style={styles.cardText}>CVC</Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.payButton} 
                    onPress={handlePayment}
                  >
                    <Text style={styles.payButtonText}>PAY ${selectedPackage.price}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={80} color="#00ff88" />
                  <Text style={styles.successTitle}>Payment Successful!</Text>
                  <Text style={styles.successText}>
                    Thank you for subscribing to {selectedPackage.name}. 
                    Your account has been upgraded.
                  </Text>
                  <TouchableOpacity 
                    style={styles.doneButton} 
                    onPress={handleComplete}
                  >
                    <Text style={styles.doneButtonText}>DONE</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e'
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e'
  },
  headerContainer: {
    paddingTop: 50, // Additional padding below status bar
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10
  },
  backButton: {
    padding: 5
  },
  headerRightPlaceholder: {
    width: 24
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ff88',
    textAlign: 'center',
    marginTop: 4 // Fine-tuning vertical alignment
  },
  subtitle: {
    fontSize: 16,
    color: '#b892ff',
    marginBottom: 25,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: -4 // Adjust spacing from header
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  packageCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  packageHeader: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16213e'
  },
  packagePrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#16213e'
  },
  featuresContainer: {
    padding: 15
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  featureText: {
    color: '#e6e6e6',
    fontSize: 16,
    marginLeft: 10
  },
  selectButton: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectButtonText: {
    color: '#16213e',
    fontWeight: 'bold',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 25,
    borderWidth: 2,
    borderColor: '#6e44ff'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 20,
    textAlign: 'center'
  },
  packageSummary: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#6e44ff'
  },
  summaryTitle: {
    color: '#b892ff',
    fontSize: 16,
    marginBottom: 5
  },
  summaryName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  summaryPrice: {
    color: '#00ff88',
    fontSize: 22,
    fontWeight: 'bold'
  },
  paymentForm: {
    marginBottom: 25
  },
  paymentTitle: {
    color: '#b892ff',
    fontSize: 16,
    marginBottom: 15
  },
  cardInput: {
    backgroundColor: 'rgba(30, 30, 60, 0.7)',
    borderWidth: 1,
    borderColor: '#6e44ff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardDetailInput: {
    width: '48%',
    backgroundColor: 'rgba(30, 30, 60, 0.7)',
    borderWidth: 1,
    borderColor: '#6e44ff',
    borderRadius: 8,
    padding: 15
  },
  cardText: {
    color: '#e6e6e6',
    fontSize: 16
  },
  payButton: {
    backgroundColor: '#00ff88',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  payButtonText: {
    color: '#16213e',
    fontWeight: 'bold',
    fontSize: 18
  },
  successContainer: {
    alignItems: 'center',
    padding: 10
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff88',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center'
  },
  successText: {
    color: '#e6e6e6',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24
  },
  doneButton: {
    backgroundColor: '#6e44ff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default EditPackage;