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
      name: 'ROOKIE', 
      features: [
        'Basic matchmaking',
        'Access to public social feed',
        'Post/comment on feed',
        'Send/receive messages',
        'Group chat & voice calls',
        'View and purchase gigs',
        'Limited matchmaking filters'
      ],
      price: 0,
      color: '#6366f1'
    },
    { 
      id: '2', 
      name: 'CHALLENGER', 
      features: [
        'Ad-free experience',
        'Full matchmaking filters',
        'Basic recruitment tools',
        'All ROOME features',
        'Priority support'
      ],
      price: 4.99,
      color: '#8b5cf6'
    },
    { 
      id: '3', 
      name: 'PROFESSIONAL', 
      features: [
        'Offer gigs',
        'Advanced recruitment tools',
        'Create tournaments/scrims',
        'Advanced profile analytics',
        'Limited profile highlighting',
        'All CHALLENGER features'
      ],
      price: 9.99,
      color: '#ec4899'
    },
    { 
      id: '4', 
      name: 'HALL OF FAMER', 
      features: [
        'Exclusive "Hall of Fame" badge',
        'Custom branding tools',
        'Featured profile spots',
        'Early access to new features',
        'VIP community access',
        'All PROFESSIONAL features'
      ],
      price: 19.99,
      color: '#f59e0b'
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    if (pkg.price > 0) {
      setShowPaymentModal(true);
      setPaymentSuccess(false);
    } else {
      // Free package - immediately complete
      navigation.navigate('EditProfile', { updatedPlan: pkg });
    }
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
          borderColor: item.color,
          shadowColor: item.color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8
        }
      ]}
      onPress={() => handleSelectPackage(item)}
    >
      <View style={[styles.packageHeader, { backgroundColor: item.color }]}>
        <Text style={styles.packageName}>{item.name}</Text>
        <Text style={styles.packagePrice}>
          {item.price > 0 ? `$${item.price}/month` : 'FREE'}
        </Text>
      </View>
      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color={item.color} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity 
        style={[
          styles.selectButton,
          { 
            backgroundColor: item.color,
            opacity: selectedPackage.id === item.id ? 1 : 0.8
          }
        ]}
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
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={styles.title}>Upgrade Your Plan</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        
        <Text style={styles.subtitle}>Choose the perfect package for your gaming journey</Text>
        
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={renderPackage}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Payment Modal */}
        <Modal
          animationType="fade"
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
                    style={[styles.payButton, { backgroundColor: selectedPackage.color }]} 
                    onPress={handlePayment}
                  >
                    <Text style={styles.payButtonText}>PAY ${selectedPackage.price}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={80} color="#10b981" />
                  <Text style={styles.successTitle}>Payment Successful!</Text>
                  <Text style={styles.successText}>
                    Thank you for subscribing to {selectedPackage.name}. 
                    Your account has been upgraded.
                  </Text>
                  <TouchableOpacity 
                    style={[styles.doneButton, { backgroundColor: selectedPackage.color }]} 
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
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerRightPlaceholder: {
    width: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    textAlign: 'center',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 25,
    paddingHorizontal: 30,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  packageCard: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: '#1e293b',
  },
  packageHeader: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  featuresContainer: {
    padding: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureText: {
    color: '#e2e8f0',
    fontSize: 14,
    marginLeft: 10,
    flexShrink: 1,
    lineHeight: 20,
  },
  selectButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 25,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 20,
    textAlign: 'center',
  },
  packageSummary: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  summaryTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 5,
  },
  summaryName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  summaryPrice: {
    color: '#10b981',
    fontSize: 22,
    fontWeight: '700',
  },
  paymentForm: {
    marginBottom: 25,
  },
  paymentTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
  },
  cardInput: {
    backgroundColor: '#334155',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetailInput: {
    width: '48%',
    backgroundColor: '#334155',
    borderRadius: 10,
    padding: 16,
  },
  cardText: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  payButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    padding: 10,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: '#e2e8f0',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  doneButton: {
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditPackage;