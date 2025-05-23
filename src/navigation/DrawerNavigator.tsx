import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ShopListScreen from '../screens/ShopListScreen';
import ShopScreen from '../screens/ShopScreen';
import {RootDrawerParamList} from '../types';
import ProductScreen from '../screens/ProductScreen';
import AllChatScreen from '../screens/AllChatScreen';
import ChatScreen from '../screens/ChatScreen';
import CartScreen from '../screens/CartScreen';
import WishListScreen from '../screens/WishLIstScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import AddressScreen from '../screens/AddressScreen';
import PaymentScreen from '../screens/PaymentScreen';
import OrderStatusScreen from '../screens/OrderStatusScreen';
import YourOrdersScreen from '../screens/YourOrdersScreen';
import MainTabsNavigator from './MainTabsNavigator';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      {/* <Drawer.Screen
        name="AllChatScreen"
        component={AllChatScreen}
      /> */}
      <Drawer.Screen
        name="MainTabsNavigator"
        component={MainTabsNavigator}
        options={{drawerLabel: 'Chats'}} // Optional: Customize the label in the drawer
      />
      <Drawer.Screen name="YourOrdersScreen" component={YourOrdersScreen} />

      <Drawer.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{drawerLabel: () => null, drawerItemStyle: {height: 0}}}
      />
      <Drawer.Screen name="CartScreen" component={CartScreen} />
      <Drawer.Screen
        name="WishListScreen"
        component={WishListScreen}
        options={{drawerLabel: 'Wishlist'}} // Visible in the drawer
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
