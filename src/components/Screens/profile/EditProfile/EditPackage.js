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
      name: 'ROOME', 
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
      color: '#1e40af'
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
      color: '#6d28d9'
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
      color: '#be185d'
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
      color: '#d97706'
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
        { borderColor: selectedPackage.id === item.id ? item.color : 'transparent' }
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
            opacity: selectedPackage.id === item.id ? 1 : 0.85
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
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header with title aligned with back button */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#7DD1F0" />
            </TouchableOpacity>
            <Text style={styles.title}>Upgrade Your Plan</Text>
          </View>
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
                    style={[styles.payButton, { backgroundColor: selectedPackage.color }]} 
                    onPress={handlePayment}
                  >
                    <Text style={styles.payButtonText}>PAY ${selectedPackage.price}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={80} color="#7DD1F0" />
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
    backgroundColor: '#060B11',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7DD1F0',
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  packageCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 2,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  packageHeader: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  packagePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  featuresContainer: {
    padding: 18
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  featureText: {
    color: '#fff',
    fontSize: 15,
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
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)'
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#0D1721',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(125, 209, 240, 0.3)',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7DD1F0',
    marginBottom: 20,
    textAlign: 'center'
  },
  packageSummary: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  summaryTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 8
  },
  summaryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6
  },
  summaryPrice: {
    color: '#7DD1F0',
    fontSize: 22,
    fontWeight: 'bold'
  },
  paymentForm: {
    marginBottom: 25
  },
  paymentTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
  },
  cardInput: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardDetailInput: {
    width: '48%',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16
  },
  cardText: {
    color: '#e6e6e6',
    fontSize: 16
  },
  payButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  successContainer: {
    alignItems: 'center',
    padding: 15
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7DD1F0',
    marginTop: 15,
    marginBottom: 12,
    textAlign: 'center'
  },
  successText: {
    color: '#e6e6e6',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24
  },
  doneButton: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  }
});

export default EditPackage;