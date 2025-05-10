import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BuyGig = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gig } = route.params || {
    image: require('../../../../assets/game1.png'),
    price: '$25',
    title: 'I will teach you to go for Radiant Level in Valorant',
    seller: 'ValorantPro',
  };

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [shakeAnimation] = useState(new Animated.Value(0));

  const handleBackPress = () => {
    navigation.goBack();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!cardNumber || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!expiryDate || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cvv || !/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3 or 4 digits)';
    }
    
    if (!nameOnCard || nameOnCard.trim().length < 3) {
      newErrors.nameOnCard = 'Please enter the name on card';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      triggerShake();
      return false;
    }
    
    return true;
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePayment = () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const formatCardNumber = (text) => {
    // Remove all non-digit characters
    const cleanedText = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formattedText = cleanedText.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedText);
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digit characters
    const cleanedText = text.replace(/\D/g, '');
    // Add slash after 2 digits if length > 2
    let formattedText = cleanedText;
    if (cleanedText.length > 2) {
      formattedText = `${cleanedText.substring(0, 2)}/${cleanedText.substring(2, 4)}`;
    }
    setExpiryDate(formattedText);
  };

  if (paymentSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Feather name="check" size={48} color="#1a1a2e" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successText}>Your order has been placed successfully.</Text>
          <Text style={styles.successText}>You will receive a confirmation email shortly.</Text>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('Marketplace')}
          >
            <Text style={styles.continueButtonText}>Continue Browsing</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.orderButton}
            onPress={() => navigation.navigate('MyLibrary')}
          >
            <Text style={styles.orderButtonText}>View Your Orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="rgb(1, 225, 255)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Purchase</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.gigInfo}>
              <Image source={gig.image} style={styles.gigImage} />
              <View style={styles.gigDetails}>
                <Text style={styles.gigTitle} numberOfLines={2}>{gig.title}</Text>
                <Text style={styles.gigSeller}>by {gig.seller}</Text>
              </View>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.priceValue}>{gig.price}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{gig.price}</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            
            <View style={styles.paymentMethod}>
              <FontAwesome name="credit-card" size={20} color="rgb(1, 225, 255)" />
              <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
            </View>
            
            <View style={styles.cardForm}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={formatCardNumber}
                maxLength={19}
                placeholderTextColor="#666"
              />
              {errors.cardNumber && (
                <Animated.View 
                  style={[
                    styles.errorContainer,
                    { transform: [{ translateX: shakeAnimation }] }
                  ]}
                >
                  <Text style={styles.errorText}>{errors.cardNumber}</Text>
                </Animated.View>
              )}
              
              <View style={styles.row}>
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={[styles.halfInput, errors.expiryDate && styles.inputError]}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={formatExpiryDate}
                    maxLength={5}
                    placeholderTextColor="#666"
                  />
                  {errors.expiryDate && (
                    <Animated.View 
                      style={[
                        styles.errorContainer,
                        { transform: [{ translateX: shakeAnimation }] }
                      ]}
                    >
                      <Text style={styles.errorText}>{errors.expiryDate}</Text>
                    </Animated.View>
                  )}
                </View>
                
                <View style={styles.halfInputContainer}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={[styles.halfInput, errors.cvv && styles.inputError]}
                    placeholder="123"
                    keyboardType="numeric"
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={4}
                    secureTextEntry={true}
                    placeholderTextColor="#666"
                  />
                  {errors.cvv && (
                    <Animated.View 
                      style={[
                        styles.errorContainer,
                        { transform: [{ translateX: shakeAnimation }] }
                      ]}
                    >
                      <Text style={styles.errorText}>{errors.cvv}</Text>
                    </Animated.View>
                  )}
                </View>
              </View>
              
              <Text style={styles.inputLabel}>Name on Card</Text>
              <TextInput
                style={[styles.input, errors.nameOnCard && styles.inputError]}
                placeholder="John Doe"
                value={nameOnCard}
                onChangeText={setNameOnCard}
                placeholderTextColor="#666"
              />
              {errors.nameOnCard && (
                <Animated.View 
                  style={[
                    styles.errorContainer,
                    { transform: [{ translateX: shakeAnimation }] }
                  ]}
                >
                  <Text style={styles.errorText}>{errors.nameOnCard}</Text>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.paymentButtonText}>Processing Payment...</Text>
          ) : (
            <Text style={styles.paymentButtonText}>Pay {gig.price}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
    backgroundColor: 'rgb(14, 3, 52)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholderButton: {
    width: 34,
    height: 34,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: '#2c2c54',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    marginBottom: 16,
  },
  gigInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gigImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  gigDetails: {
    flex: 1,
  },
  gigTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  gigSeller: {
    fontSize: 14,
    color: '#aaa',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 15,
    color: '#ddd',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#3d3d5c',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
  },
  paymentSection: {
    backgroundColor: '#2c2c54',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  cardForm: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#3d3d5c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 8,
  },
  inputError: {
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  halfInput: {
    backgroundColor: '#3d3d5c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 8,
  },
  paymentButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2c2c54',
  },
  paymentButton: {
    backgroundColor: 'rgb(1, 225, 255)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIcon: {
    backgroundColor: 'rgb(1, 225, 255)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(1, 225, 255)',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: 'rgb(1, 225, 255)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: '#2c2c54',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(1, 225, 255)',
  },
  orderButtonText: {
    color: 'rgb(1, 225, 255)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#FF5252',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default BuyGig;
