import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Animated, PanResponder, Dimensions, Vibration, Platform, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_OUT_DURATION = 250;

const CardSwiper = forwardRef(({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onSwipeComplete,
  currentIndex,
  nextCardScale,
  onAnimationComplete
}, ref) => {
  const swipe = useRef(new Animated.ValueXY()).current;
  const tilt = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const tapTimestamp = useRef(0);

  // Expose functions via ref
  useImperativeHandle(ref, () => ({
    triggerSwipe: (direction) => {
      performSwipe(direction);
    }
  }));

  // Reset animation values when currentIndex changes
  useEffect(() => {
    swipe.setValue({ x: 0, y: 0 });
    tilt.setValue(0);
    cardOpacity.setValue(1);
    cardScale.setValue(1);
  }, [currentIndex]);

  const performSwipe = (direction) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Vibration.vibrate(50);
    }

    Animated.parallel([
      Animated.timing(swipe, {
        toValue: { x: direction * (width + 100), y: 0 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: true
      }),
      Animated.spring(nextCardScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      })
    ]).start(() => {
      direction > 0 ? onSwipeRight() : onSwipeLeft();
      onSwipeComplete();
      if (onAnimationComplete) onAnimationComplete();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        tapTimestamp.current = Date.now();
        return true;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const hasMovedEnough = Math.abs(gestureState.dx) > 10;
        const isDraggingHorizontally = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        const isQuickTap = Date.now() - tapTimestamp.current < 150;
        return hasMovedEnough && isDraggingHorizontally && !isQuickTap;
      },
      onPanResponderMove: (_, { dx, dy }) => {
        swipe.setValue({ x: dx, y: dy / 3 });
        tilt.setValue(dx / 10);
        
        const swipeDistance = Math.abs(dx);
        const maxDistance = width * 0.5;
        const progressRatio = Math.min(swipeDistance / maxDistance, 1);
        
        cardScale.setValue(1 - 0.05 * progressRatio);
        nextCardScale.setValue(0.9 + 0.1 * progressRatio);
      },
      onPanResponderRelease: (_, { dx, dy, vx }) => {
        const direction = Math.sign(dx);
        const speed = Math.abs(vx);
        const isActionActive = Math.abs(dx) > SWIPE_THRESHOLD || speed > 0.5;
        
        if (isActionActive) {
          performSwipe(direction);
        } else {
          resetCardPosition();
        }
      },
      onPanResponderTerminate: resetCardPosition
    })
  ).current;

  const resetCardPosition = () => {
    Animated.parallel([
      Animated.spring(swipe, {
        toValue: { x: 0, y: 0 },
        friction: 7,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.spring(tilt, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.spring(nextCardScale, {
        toValue: 0.9,
        friction: 7,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();
  };

  const rotateCard = tilt.interpolate({
    inputRange: [-width/2, 0, width/2],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp'
  });

  const animatedCardStyles = {
    transform: [
      { translateX: swipe.x },
      { translateY: swipe.y },
      { rotate: rotateCard },
      { scale: cardScale }
    ],
    opacity: cardOpacity
  };

  // Swipe indicator animations
  const likeOpacity = swipe.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const dislikeOpacity = swipe.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const likeScale = swipe.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD, width/2],
    outputRange: [0.8, 1, 1.2],
    extrapolate: 'clamp'
  });

  const dislikeScale = swipe.x.interpolate({
    inputRange: [-width/2, -SWIPE_THRESHOLD, 0],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View 
      style={animatedCardStyles}
      {...panResponder.panHandlers}
      key={`profile-card-${currentIndex}`}
    >
      {children}
      {/* Swipe Indicators */}
      <Animated.View 
        style={[
          styles.likeBadge, 
          { 
            opacity: likeOpacity,
            transform: [{ scale: likeScale }]
          }
        ]}
      >
        <Text style={styles.likeText}>LIKE</Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.dislikeBadge, 
          { 
            opacity: dislikeOpacity,
            transform: [{ scale: dislikeScale }]
          }
        ]}
      >
        <Text style={styles.dislikeText}>NOPE</Text>
      </Animated.View>
    </Animated.View>
  );
});

const styles = {
    likeBadge: {
        position: 'absolute',
        top: '22%',
        left: 20,
        zIndex: 2,
        backgroundColor: 'rgba(76, 175, 80, 0.15)', // soft green tint
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.5)',
        backdropFilter: 'blur(6px)', // for web, ignored on native
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      
      likeText: {
        color: '#4CAF50',
        fontWeight: '700',
        fontSize: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 1,
      },
      
      dislikeBadge: {
        position: 'absolute',
        top: '22%',
        right: 20,
        zIndex: 2,
        backgroundColor: 'rgba(244, 67, 54, 0.15)', // soft red tint
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(244, 67, 54, 0.5)',
        backdropFilter: 'blur(6px)', // for web, ignored on native
        shadowColor: '#F44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      
      dislikeText: {
        color: '#F44336',
        fontWeight: '700',
        fontSize: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0.5, height: 0.5 },
        textShadowRadius: 1,
      },
      
};

export default CardSwiper;