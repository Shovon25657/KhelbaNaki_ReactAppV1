import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { responsiveWidth, responsiveHeight, responsiveFont } from './responsiveDimensions';

const GamesSection = ({ title, games }) => {
  const gamesScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const scrollGamesRight = () => {
    if (gamesScrollRef.current) {
      gamesScrollRef.current.scrollTo({
        x: responsiveWidth(150),
        y: 0,
        animated: true
      });
    }
  };

  const scrollGamesLeft = () => {
    if (gamesScrollRef.current) {
      gamesScrollRef.current.scrollTo({
        x: 0,
        y: 0,
        animated: true
      });
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    setCanScrollLeft(scrollPosition > 10);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ position: 'relative' }}>
        <ScrollView  
          ref={gamesScrollRef}
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesScrollContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {games.map((game, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.smallGameCard}
              activeOpacity={0.7}
            >
              {game.isFavorite && (
                <View style={styles.favoriteBadge}>
                  <MaterialCommunityIcons 
                    name="heart" 
                    size={responsiveFont(14)} 
                    color="#e94560" 
                  />
                </View>
              )}
              <Image source={game.image} style={styles.smallGameImage} />
              <Text style={styles.frequencyTag}>{game.frequency}</Text>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{game.name}</Text>
                <View style={styles.gameLevel}>
                  <MaterialCommunityIcons 
                    name="medal" 
                    size={responsiveFont(14)} 
                    color="#FFD700" 
                  />
                  <Text style={styles.levelText}>{game.level}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {canScrollLeft && (
          <TouchableOpacity 
            style={[styles.scrollIndicator, styles.scrollIndicatorLeft]}
            onPress={scrollGamesLeft}
            activeOpacity={0.7}
          >
            <Feather 
              name="chevron-left" 
              size={responsiveFont(20)} 
              color="rgb(232, 230, 230)" 
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.scrollIndicator}
          onPress={scrollGamesRight}
          activeOpacity={0.7}
        >
          <Feather 
            name="chevron-right" 
            size={responsiveFont(20)} 
            color="rgb(232, 230, 230)" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'rgba(47, 7, 226, 0.05)',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    marginBottom: responsiveHeight(10),
    borderRadius: responsiveWidth(10),
    marginHorizontal: responsiveWidth(10),
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(15),
    color: 'rgb(1, 225, 255)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gamesScrollContainer: {
    paddingRight: responsiveWidth(20),
    paddingLeft: responsiveWidth(5),
  },
  scrollIndicator: {
    position: 'absolute',
    right: responsiveWidth(10),
    top: '50%',
    transform: [{ translateY: -responsiveHeight(15) }],
    backgroundColor: 'rgba(214, 229, 222, 0.2)',
    borderRadius: responsiveWidth(15),
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(214, 229, 222, 0.2)',
    zIndex: 2,
  },
  scrollIndicatorLeft: {
    right: 'auto',
    left: responsiveWidth(10),
  },
  smallGameCard: {
    width: responsiveWidth(120),
    height: responsiveHeight(170),
    marginRight: responsiveWidth(12),
    marginBottom: responsiveHeight(10),
    backgroundColor: 'rgba(42, 16, 216, 0.42)',
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(14, 113, 226, 0.42)',
  },
  smallGameImage: {
    width: '100%',
    height: responsiveHeight(110),
    resizeMode: 'cover',
  },
  favoriteBadge: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: responsiveWidth(10),
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  frequencyTag: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: responsiveWidth(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    fontSize: responsiveFont(10),
    fontWeight: 'bold',
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(3),
    borderRadius: responsiveWidth(10),
  },
  gameInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: responsiveWidth(8),
  },
  gameLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  gameName: {
    fontSize: responsiveFont(12),
    fontWeight: 'bold',
    color: '#fff',
  },
  levelText: {
    fontSize: responsiveFont(10),
    color: '#fff',
    marginLeft: responsiveWidth(3),
  },
});

export default GamesSection;