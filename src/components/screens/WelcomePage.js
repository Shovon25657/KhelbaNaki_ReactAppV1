import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AnimatedButton from '../common/AnimatedButon'; // Adjust the path as necessary

const { width } = Dimensions.get('window');

const features = [
  {
    id: 1,
    title: "Gaming Partner Finder",
    description: "Connect with like-minded gamers to team up and play together",
    image: require('../../../assets/partner.png'), // Make sure this path is correct
  },
  {
    id: 2,
    title: "Marketplace",
    description: "Buy, sell, and trade gaming items and accounts securely",
    image: require('../../../assets/partner.png'), // Make sure this path is correct
  },
  {
    id: 3,
    title: "Recruitment",
    description: "Find teammates or join esports organizations",
    image: require('../../../assets/partner.png'), // Make sure this path is correct
  }
];

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  const texts = [
    "Gaming is not just a hobby...",
    "It's a lifestyle. Let's connect & play."
  ];
  
  const typingSpeed = 100;
  const deletingSpeed = 600;
  const pauseDuration = 3000;

  // Auto-scroll features
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % features.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Blink cursor effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);

    return () => clearInterval(blinkInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    let timeout;
    let currentCharIndex = 0;
    const currentText = texts[currentTextIndex];

    const typeText = () => {
      if (!isDeleting) {
        // Typing phase
        if (currentCharIndex < currentText.length) {
          setDisplayText(currentText.substring(0, currentCharIndex + 1));
          currentCharIndex++;
          timeout = setTimeout(typeText, typingSpeed);
        } else {
          // Switch to deleting after pause
          timeout = setTimeout(() => {
            setIsDeleting(true);
            currentCharIndex = currentText.length - 1;
            typeText();
          }, pauseDuration);
        }
      } else {
        // Deleting phase
        if (currentCharIndex >= 0) {
          setDisplayText(currentText.substring(0, currentCharIndex));
          currentCharIndex--;
          timeout = setTimeout(typeText, deletingSpeed);
        } else {
          // Switch to next text
          setIsDeleting(false);
          setCurrentTextIndex(prevIndex => 
            prevIndex === texts.length - 1 ? 0 : prevIndex + 1
          );
        }
      }
    };

    timeout = setTimeout(typeText, typingSpeed);
    return () => clearTimeout(timeout);
  }, [isDeleting, currentTextIndex]);

  const renderItem = ({ item }) => (
    <View style={styles.featureSlide}>
      <Image 
        source={item.image} 
        style={styles.featureImage} 
        resizeMode="contain"
      />
      <Text style={styles.featureTitle}>{item.title}</Text>
      <Text style={styles.featureDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.gradientTop}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>KhelbaNaki</Text>
        </View>
        
        <View style={styles.mottoContainer}>
          <Text style={styles.mottoLine1}>
            {displayText}
            {showCursor && <Text style={styles.cursor}>|</Text>}
          </Text>
        </View>

        <View style={styles.featureContainer}>
          <FlatList
            ref={flatListRef}
            data={features}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={0}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index
            })}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentIndex(newIndex);
            }}
          />
          
          <View style={styles.indicatorContainer}>
            {features.map((_, i) => (
              <View
                key={`indicator-${i}`}
                style={[
                  styles.indicator,
                  currentIndex === i && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.gradientBottom}>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity> */}

          <AnimatedButton 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
            title='Login' 
          />

            <AnimatedButton  onPress={() => navigation.navigate('Registration')}
            title='Sign Up' />
    
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(21, 4, 53)',
  },
  gradientTop: {
    height: '60%',
    width: '100%',
    paddingTop: '15%',
    paddingBottom: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(43, 7, 100)',
    shadowColor: 'rgb(1, 21, 24)',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  gradientBottom: {
    height: '40%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgb(21, 4, 53)',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  mottoContainer: {
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mottoLine1: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    minHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featureContainer: {
    height: 200,
    width: '100%',
    marginTop: 10,
  },
  featureSlide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  featureImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#DDDDDD',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    opacity: 0.3,
  },
  activeIndicator: {
    width: 16,
    opacity: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '80%',
    borderRadius: 25,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgb(87, 60, 238)',
  },
  signUpButton: {
    width: '80%',
    padding: 16,
    borderRadius: 25,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cursor: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textShadowColor: 'rgb(26, 216, 230)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});

export default WelcomeScreen;