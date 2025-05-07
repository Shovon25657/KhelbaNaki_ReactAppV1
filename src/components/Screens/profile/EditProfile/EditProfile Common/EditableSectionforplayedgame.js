import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { responsiveFont, responsiveWidth, responsiveHeight } from '../EditProfile Common/Metrics';

const EditableSectionforplayedgame = ({ 
  title, 
  data,
  onEdit,
  showEditButton = true,
  editIcon = "edit-2",
  editIconColor = 'rgba(169, 209, 244, 0.82)',
  titleColor = 'rgb(1, 225, 255)'
}) => {
  // Access games from the correct path in the data structure
  const games = data?.gamesPlayed || [];

  const renderGameItem = ({ item }) => (
    <View style={styles.gameItem}>
      <View style={styles.gameHeader}>
        <View style={styles.gameIconContainer}>
          <FontAwesome5 
            name="gamepad" 
            size={responsiveFont(14)} 
            color="#fff"
          />
        </View>
        <Text style={styles.gameName}>{item.playedGameName}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <FontAwesome5 
            name="trophy" 
            size={responsiveFont(12)} 
            color="rgba(169, 209, 244, 0.82)"
          />
          <Text style={styles.detailText}>{item.levelofGaming}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.detailItem}>
          <FontAwesome5 
            name="clock" 
            size={responsiveFont(12)} 
            color="rgba(169, 209, 244, 0.82)"
          />
          <Text style={styles.detailText}>{item.frequency}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
        {showEditButton && (
          <TouchableOpacity onPress={onEdit} testID="edit-games-button">
            <Feather 
              name={editIcon}
              size={responsiveFont(18)} 
              color={editIconColor} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {games.length > 0 ? (
          <FlatList
            data={games}
            keyExtractor={(item) => item._id || Math.random().toString()}
            scrollEnabled={false}
            renderItem={renderGameItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <FontAwesome5 
                name="gamepad" 
                size={responsiveFont(24)} 
                color="rgba(169, 209, 244, 0.82)"
              />
            </View>
            <Text style={styles.emptyText}>No games added yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'rgba(47, 7, 226, 0.05)',
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(10),
    borderRadius: responsiveWidth(10),
    marginHorizontal: responsiveWidth(10),
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(15),
    paddingHorizontal: responsiveWidth(16),
    paddingTop: responsiveHeight(15),
  },
  sectionTitle: {
    fontSize: responsiveFont(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: responsiveWidth(14),
  },
  listContent: {
    paddingBottom: responsiveHeight(4),
  },
  gameItem: {
    backgroundColor: 'rgba(14, 113, 226, 0.05)',
    borderRadius: responsiveWidth(10),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(14, 113, 226, 0.2)',
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveWidth(12),
  },
  gameIconContainer: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(15),
    backgroundColor: 'rgba(14, 113, 226, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(10),
  },
  gameName: {
    color: '#fff',
    fontSize: responsiveFont(16),
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(14, 113, 226, 0.2)',
    marginHorizontal: responsiveWidth(12),
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveWidth(10),
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(6),
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(14, 113, 226, 0.2)',
  },
  detailText: {
    color: '#fff',
    fontSize: responsiveFont(12),
    fontWeight: '500',
    marginLeft: responsiveWidth(6),
  },
  itemSeparator: {
    height: responsiveHeight(10),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: responsiveHeight(24),
  },
  emptyIconContainer: {
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    borderRadius: responsiveWidth(30),
    backgroundColor: 'rgba(14, 113, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
  },
  emptyText: {
    color: 'rgba(206, 201, 201, 0.7)',
    fontSize: responsiveFont(14),
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EditableSectionforplayedgame;