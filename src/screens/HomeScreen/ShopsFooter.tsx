// inside HomeScreen.tsx (or create a small file and import it)
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ShopList from '../../components/common/ShopList';
import {Theme} from '../../theme/theme';
import {navigate} from '../../navigation/navigationService';

const ShopsFooter: React.FC = () => {
  return (
    <View style={styles.footerWrap}>
      {/* Divider with centered text */}
      <View style={styles.dividerRow} accessible accessibilityRole="header">
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Essentials</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Space between divider and shops */}
      <View style={{height: 8}} />

      {/* Shop list (reusable component) */}
      <ShopList
        endpoint={`/buyer/categories/cooking-essentials/shops`}
        queryParams={{}}
        pageSize={12}
        // If you want a tiny header inside the ShopList (above shop cards),
        // pass ListHeaderComponent={<Text style={{paddingVertical:8}}>Top Picks</Text>}
        onShopPress={shop => navigate('ShopScreen', {shop})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrap: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28, // leave breathing room below shops
    backgroundColor: 'transparent',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6E6E6', // subtle line
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
    color: Theme?.colors?.darkGray ?? '#666',
  },
});

export default ShopsFooter;
