import React, { useState } from 'react';
import { 
  ScrollView, 
  Text, 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('privacy'); // 'privacy' or 'terms'

  const renderPrivacyPolicy = () => (
    <ScrollView style={styles.contentScrollView}>
      <Text style={styles.policyTitle}>Privacy Policy for KhelbaNaki</Text>
      <Text style={styles.effectiveDate}>Effective Date: 01/05/2025</Text>
      
      <Text style={styles.introText}>
        Welcome to KhelbaNaki, a platform designed to connect gamers, esports professionals, and
        communities. We value your privacy and are committed to protecting your personal data. This Privacy
        Policy explains how we collect, use, share, and safeguard your information when you use the KhelbaNaki
        mobile application or website (collectively, the "Service").
      </Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.subSectionTitle}>1.1. Personal Information</Text>
      <Text style={styles.sectionText}>
        • Name, email address, username{'\n'}
        • Profile details (avatar, bio, games you play, skill level){'\n'}
        • Payment information (for subscription or gig transactions){'\n'}
        • Contact lists (if you allow importing friends or inviting others)
      </Text>

      <Text style={styles.subSectionTitle}>1.2. Usage Data</Text>
      <Text style={styles.sectionText}>
        • Log files (device info, IP address, browser type, access times){'\n'}
        • In-app activity (matchmaking actions, messages sent, games selected){'\n'}
        • Interactions with gigs, posts, tournaments, or recruiters
      </Text>

      <Text style={styles.subSectionTitle}>1.3. Content You Provide</Text>
      <Text style={styles.sectionText}>
        • Messages, voice calls (not stored unless flagged for abuse){'\n'}
        • Posts, comments, reviews, and feedback{'\n'}
        • Uploaded files such as gameplay videos, screenshots, or resumes
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.sectionText}>
        We use the collected data to:{'\n'}
        • Provide matchmaking and partner suggestions{'\n'}
        • Facilitate esports recruitment and gig transactions{'\n'}
        • Improve app features and personalize your experience{'\n'}
        • Send important updates, alerts, and promotional offers{'\n'}
        • Detect and prevent fraud, abuse, or illegal activities
      </Text>

      <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
      <Text style={styles.sectionText}>
        We do not sell your personal data. We may share your data with:{'\n'}
        • Service providers (e.g., hosting, payment processing, analytics){'\n'}
        • Recruiters or coaches, only with your consent or application{'\n'}
        • Law enforcement, if required by applicable laws or to protect rights{'\n'}
        • Other users, based on your chosen visibility settings (e.g., profile, posts)
      </Text>

      <Text style={styles.sectionTitle}>4. Your Rights and Choices</Text>
      <Text style={styles.sectionText}>
        You have the right to:{'\n'}
        • Access or correct your personal information{'\n'}
        • Delete your account and associated data{'\n'}
        • Opt out of non-essential communications{'\n'}
        • Manage cookie and tracking preferences{'\n'}
        {'\n'}
        To exercise your rights, go to Settings {'>'} Privacy Controls or contact us at khelbanakiinfo@gmail.com.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Retention</Text>
      <Text style={styles.sectionText}>
        We retain your data as long as your account is active or as needed for legal, business, or operational
        purposes. After deletion requests, we will remove or anonymize your data within 30 days, unless
        otherwise required.
      </Text>

      <Text style={styles.sectionTitle}>6. Security</Text>
      <Text style={styles.sectionText}>
        We implement industry-standard safeguards to protect your data. However, no system is completely
        secure. You are also responsible for keeping your password and account secure.
      </Text>

      <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
      <Text style={styles.sectionText}>
        KhelbaNaki is not intended for users under the age of 13 (or the legal age in your jurisdiction). We do not
        knowingly collect data from minors. If you believe we have, contact us to delete the data immediately.
      </Text>

      <Text style={styles.sectionTitle}>8. Changes to This Privacy Policy</Text>
      <Text style={styles.sectionText}>
        We may update this Privacy Policy periodically. When we do, we will notify users through in-app
        messages or email. Continued use of the Service after updates constitutes agreement to the new terms.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact Us</Text>
      <Text style={styles.sectionText}>
        If you have questions about this Privacy Policy or your data, contact us at:{'\n'}
        📧 khelbanakiinfo@gmail.com
      </Text>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );

  const renderTermsOfService = () => (
    <ScrollView style={styles.contentScrollView}>
      <Text style={styles.policyTitle}>Terms of Service for KhelbaNaki</Text>
      <Text style={styles.effectiveDate}>Effective Date: 01/05/2025</Text>
      <Text style={styles.effectiveDate}>Last Updated: 01/05/2025</Text>
      
      <Text style={styles.introText}>
        Welcome to KhelbaNaki! These Terms of Service ("Terms") govern your access to and use of the
        KhelbaNaki mobile application, website, and services (collectively, the "Platform"). By using KhelbaNaki,
        you agree to be bound by these Terms.
      </Text>

      <Text style={styles.sectionTitle}>1. Eligibility</Text>
      <Text style={styles.sectionText}>
        You must be at least 13 years old (or the minimum legal age in your country) to use KhelbaNaki. If you're
        under the required age, do not use the platform. Parents or guardians may supervise underage users.
      </Text>

      <Text style={styles.sectionTitle}>2. User Accounts</Text>
      <Text style={styles.sectionText}>
        • You must provide accurate and complete registration information.{'\n'}
        • You're responsible for maintaining the confidentiality of your account and password.{'\n'}
        • You agree not to impersonate others or create multiple fake accounts.
      </Text>

      <Text style={styles.sectionTitle}>3. User Conduct</Text>
      <Text style={styles.sectionText}>
        You agree to use KhelbaNaki responsibly and not to:{'\n'}
        • Harass, abuse, threaten, or harm others{'\n'}
        • Post or share content that is illegal, hateful, pornographic, or violent{'\n'}
        • Use bots, cheats, or exploits in any matchmaking or gaming activity{'\n'}
        • Impersonate others or misrepresent your identity or gaming credentials{'\n'}
        • Spam, scam, or misuse the messaging or gig systems{'\n'}
        {'\n'}
        Violating these rules may result in account suspension or termination.
      </Text>

      <Text style={styles.sectionTitle}>4. Paid Plans & Subscriptions</Text>
      <Text style={styles.sectionText}>
        KhelbaNaki offers free and premium subscription plans. By purchasing a plan:{'\n'}
        • You authorize us to charge your payment method on a recurring basis (if applicable).{'\n'}
        • You may cancel anytime, but refunds are subject to our refund policy.{'\n'}
        • Plan features and prices are subject to change with notice.
      </Text>

      <Text style={styles.sectionTitle}>5. Gigs & Payments (Coaching Marketplace)</Text>
      <Text style={styles.sectionText}>
        • KhelbaNaki provides a platform to connect gig sellers (e.g. pro coaches) and buyers (general
        players).{'\n'}
        • We are not responsible for the accuracy, delivery, or quality of any gig services.{'\n'}
        • Users must resolve disputes independently unless they violate platform rules.{'\n'}
        • KhelbaNaki may charge a service fee or commission on transactions.
      </Text>

      <Text style={styles.sectionTitle}>6. Tournaments & Recruitment Tools</Text>
      <Text style={styles.sectionText}>
        • Tournament hosts and recruiters are responsible for their own terms, eligibility, and fair practices.{'\n'}
        • KhelbaNaki is not liable for outcomes, disputes, or violations unless directly involved.{'\n'}
        • Misuse of tournament tools or offers can lead to a permanent ban.
      </Text>

      <Text style={styles.sectionTitle}>7. Content Ownership</Text>
      <Text style={styles.sectionText}>
        • You retain ownership of the content (posts, gameplay, videos) you upload.{'\n'}
        • You grant KhelbaNaki a non-exclusive license to use, display, and promote your content on the
        platform.{'\n'}
        • We may remove content that violates our community guidelines without notice.
      </Text>

      <Text style={styles.sectionTitle}>8. Termination</Text>
      <Text style={styles.sectionText}>
        We may suspend or terminate your account at any time for:{'\n'}
        • Violating these Terms{'\n'}
        • Engaging in harmful or unlawful behavior{'\n'}
        • Using the platform in a way that risks other users or the service{'\n'}
        {'\n'}
        You may also delete your account anytime via Settings.
      </Text>

      <Text style={styles.sectionTitle}>9. Disclaimer of Warranties</Text>
      <Text style={styles.sectionText}>
        The platform is provided "as is" without warranties of any kind. We do not guarantee:{'\n'}
        • Continuous or error-free access{'\n'}
        • Matchmaking or recruitment success{'\n'}
        • That all content is safe, legal, or accurate
      </Text>

      <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
      <Text style={styles.sectionText}>
        To the maximum extent allowed by law, KhelbaNaki shall not be liable for:{'\n'}
        • Any indirect, incidental, or consequential damages{'\n'}
        • Loss of data, profits, or business from using the platform{'\n'}
        • Actions of other users or third parties
      </Text>

      <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
      <Text style={styles.sectionText}>
        We may update these Terms from time to time. If we do, we'll notify users via email or in-app notification.
        Continued use of KhelbaNaki after changes means you accept the updated Terms.
      </Text>

      <Text style={styles.sectionTitle}>12. Contact</Text>
      <Text style={styles.sectionText}>
        For questions about these Terms, contact us at:{'\n'}
        📧 khelbanakiinfo@gmail.com
      </Text>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="rgb(14, 3, 52)" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={28} color="rgb(1, 225, 255)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>LEGAL DOCUMENTS</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
            onPress={() => setActiveTab('privacy')}
          >
            <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'terms' && styles.activeTab]}
            onPress={() => setActiveTab('terms')}
          >
            <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {activeTab === 'privacy' ? renderPrivacyPolicy() : renderTermsOfService()}
        </View>
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
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgb(14, 3, 52)',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'rgb(1, 225, 255)',
  },
  tabText: {
    color: '#AAA',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'rgb(1, 225, 255)',
  },
  content: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  contentScrollView: {
    padding: 20,
  },
  policyTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  effectiveDate: {
    color: '#AAA',
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  introText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'rgb(1, 225, 255)',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  subSectionTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default PrivacyPolicy;