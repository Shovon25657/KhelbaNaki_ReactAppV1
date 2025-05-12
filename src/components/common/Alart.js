import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  Dimensions,
  Animated,
  Vibration,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CustomAlert = ({
  visible,
  title,
  message,
  onClose,
  buttons = [{ text: 'OK', onPress: onClose }],
  type = 'default', // default, success, error, warning, match
  icon,
  vibrate = true,
}) => {
  const [animation] = React.useState(new Animated.Value(0));
  
  React.useEffect(() => {
    if (visible) {
      // Optional vibration feedback
      if (vibrate && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        Vibration.vibrate(70);
      }
      
      // Animate in
      Animated.spring(animation, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animation when alert is hidden
      animation.setValue(0);
    }
  }, [visible, animation, vibrate]);
  
  // Get icon and colors based on alert type
  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return { 
          icon: icon || 'check-circle', 
          color: '#01e1ff',
          containerBg: 'rgba(1, 225, 255, 0.1)',
          borderColor: 'rgb(1, 225, 255)'
        };
      case 'error':
        return { 
          icon: icon || 'error-outline', 
          color: '#ff3b30',
          containerBg: 'rgba(255, 59, 48, 0.1)',
          borderColor: 'rgb(255, 58, 48)'
        };
      case 'warning':
        return { 
          icon: icon || 'warning', 
          color: '#ffcc00',
          containerBg: 'rgba(255, 204, 0, 0.1)',
          borderColor: 'rgb(255, 204, 0)'
        };
      case 'match':
        return { 
          icon: icon || 'favorite', 
          color: '#ff3b80',
          containerBg: 'rgba(255, 59, 128, 0.1)',
          borderColor: 'rgb(255, 59, 128)'
        };
      default:
        return { 
          icon: icon || 'info', 
          color: '#01e1ff',
          containerBg: 'rgba(1, 225, 255, 0.1)',
          borderColor: 'rgb(1, 225, 255)'
        };
    }
  };

  const alertConfig = getAlertConfig();
  
  const animatedStyles = {
    transform: [
      { scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1]
        })
      },
      { translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })
      }
    ],
    opacity: animation
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View 
          style={[
            styles.alertContainer, 
            { backgroundColor: alertConfig.containerBg, borderColor: alertConfig.borderColor },
            animatedStyles
          ]}
        >
          <View style={styles.iconContainer}>
            <Icon name={alertConfig.icon} size={35} color={alertConfig.color} />
          </View>
          
          <Text style={[styles.title, { color: alertConfig.color }]}>
            {title}
          </Text>
          
          <Text style={styles.message}>{message}</Text>
          
          <View style={[
            styles.buttonsContainer, 
            buttons.length > 1 ? styles.multipleButtons : styles.singleButton
          ]}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  { backgroundColor: button.primary ? alertConfig.color : 'transparent' },
                  button.style === 'cancel' && styles.cancelButton,
                  index > 0 && styles.buttonMargin,
                  button.buttonStyle
                ]}
                onPress={() => {
                  if (button.onPress) button.onPress();
                  else onClose();
                }}
              >
                <Text style={[
                  styles.buttonText,
                  { color: button.primary ? 'rgb(4, 1, 21)' : alertConfig.color },
                  button.style === 'cancel' && styles.cancelButtonText,
                  button.textStyle
                ]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgb(0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgb(4, 1, 21)',
    borderWidth: .5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    marginTop: 5,
    width: '100%',
  },
  singleButton: {
    alignItems: 'center',
  },
  multipleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonMargin: {
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default CustomAlert;