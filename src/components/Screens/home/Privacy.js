import React from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity // Make sure this is imported
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrivacyPolicy = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1a1a2e" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="rgb(1, 225, 255)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect personal information you provide when you register, use our services, or communicate with us. This may include:
            - Name, email, and contact details
            - Profile information and preferences
            - Usage data and analytics
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use the information we collect to:
            - Provide and improve our services
            - Personalize your experience
            - Communicate with you
            - Ensure security and prevent fraud
          </Text>

          <Text style={styles.sectionTitle}>3. Data Sharing</Text>
          <Text style={styles.sectionText}>
            We do not sell your personal information. We may share data with:
            - Service providers assisting our operations
            - Legal authorities when required by law
            - Affiliates and partners with your consent
          </Text>

          <Text style={styles.sectionTitle}>4. Your Rights</Text>
          <Text style={styles.sectionText}>
            You have the right to:
            - Access and update your information
            - Request deletion of your data
            - Opt-out of marketing communications
            - Withdraw consent where applicable
          </Text>

          <Text style={styles.sectionTitle}>5. Security Measures</Text>
          <Text style={styles.sectionText}>
            We implement appropriate security measures to protect your data, including encryption and access controls. However, no system is completely secure.
          </Text>

          <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
          <Text style={styles.sectionText}>
            We may update this policy periodically. We'll notify you of significant changes through our platform or via email.
          </Text>

          <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  container: {
    flex: 1,
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
  headerTitle: {
   fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  sectionTitle: {
    color: 'rgb(1, 225, 255)',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  lastUpdated: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PrivacyPolicy;
