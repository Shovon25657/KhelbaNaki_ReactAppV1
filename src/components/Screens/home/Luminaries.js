import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Dimensions,
  Animated,
  TouchableOpacity,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '../home/common/Header';

const { width } = Dimensions.get('window');

const luminariesData = [
  {
    id: 1,
    name: 'K M Monoarul Islam Shovon',
    role: 'Founder & Project Manager',
    description: 'Visionary leader behind KhelbaNaki, overseeing the project implementation and strategic direction.',
    image: require('../../../../assets/Shovon.jpg') 
  },
  {
    id: 2,
    name: 'Ryan Hasan Sunny',
    role: 'Co-Founder & Developer/Designer',
    description: 'Technical architect of KhelbaNaki, responsible for development and design implementation.',
    image: require('../../../../assets/Sunny.jpg') 
  },
  {
    id: 3,
    name: 'Faysal Hossain Tomal',
    role: 'Co-Founder & QA/Document Specialist',
    description: 'Ensuring quality standards and documentation for KhelbaNaki application.',
    image: require('../../../../assets/Faysal.jpg') 
  }
];

const Luminaries = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(luminariesData.map(() => new Animated.Value(0))).current;
  const textAnim = useRef(luminariesData.map(() => new Animated.Value(0))).current;
  const emailAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Card stagger animation
    Animated.stagger(150, 
      cardAnim.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        })
      )
    ).start();

    // Text stagger animation
    Animated.stagger(200, 
      textAnim.map(anim => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      )
    ).start();

    // Email animation
    Animated.timing(emailAnim, {
      toValue: 1,
      duration: 1200,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:Contact.Luminaries@gmail.com');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="LUMINARIES" 
        onMenuPress={handleBack}
        showBack={true}
        showActionButton={false}  // This ensures no right-side icon appears
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.subHeader}>The Minds Behind KhelbaNaki</Text>
        </Animated.View>
        
        {luminariesData.map((person, index) => (
          <Animated.View 
            key={person.id} 
            style={[
              styles.card,
              {
                opacity: cardAnim[index],
                transform: [
                  {
                    translateY: cardAnim[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.imageContainer}>
              <Image source={person.image} style={styles.image} />
            </View>
            
            <Animated.View style={[styles.infoContainer, { opacity: textAnim[index] }]}>
              <Text style={styles.name}>{person.name}</Text>
              
              <Animated.View 
                style={[
                  styles.roleContainer,
                  { 
                    transform: [
                      {
                        translateX: textAnim[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        })
                      }
                    ] 
                  }
                ]}
              >
                <Icon name="work" size={16} color="#4CAF50" />
                <Text style={styles.role}>{person.role}</Text>
              </Animated.View>
              
              <Animated.Text 
                style={[
                  styles.description,
                  { 
                    opacity: textAnim[index],
                    transform: [
                      {
                        translateY: textAnim[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      }
                    ] 
                  }
                ]}
              >
                {person.description}
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        ))}
        
        <Animated.View 
          style={[
            styles.emailContainer,
            { 
              opacity: emailAnim,
              transform: [
                {
                  translateY: emailAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                }
              ] 
            }
          ]}
        >
          <Text style={styles.emailTitle}>Contact the Luminaries</Text>
          
          <TouchableOpacity 
            style={styles.emailButton}
            onPress={handleEmailPress}
          >
            <Icon name="email" size={20} color="#64FFDA" style={styles.emailIcon} />
            <Text style={styles.emailText}>Contact.Luminaries@gmail.com</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(1, 12, 20)',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  subHeader: {
    color: '#64FFDA',
    fontSize: 16,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: 'rgba(10, 25, 47)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    flexDirection: 'colume',
    alignItems: 'center',
    
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
   
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#64FFDA',
    backgroundColor: '#112240',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    textAlign:'center'
  },
  name: {
    color: '#E6F1FF',
    fontSize: 18,
    fontWeight: 'bold',
     alignItems:'center',
    textAlign:'center',
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
     alignItems:'center',
    textAlign:'center'
  },
  role: {
    color: '#4CAF50',
    fontSize: 14,
    marginLeft: 5,
    fontStyle: 'italic',
     alignItems:'center',
    textAlign:'center'
  },
  description: {
    color: '#CCD6F6',
    fontSize: 14,
    lineHeight: 20,
     alignItems:'center',
    textAlign:'center'
  },
  emailContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    alignItems: 'center',
  },
  emailTitle: {
    color: '#64FFDA',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
  },
  emailIcon: {
    marginRight: 10,
  },
  emailText: {
    color: '#E6F1FF',
    fontSize: 14,
  },
});

export default Luminaries;