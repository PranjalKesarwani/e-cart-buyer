import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import ShopListScreen from "../screens/ShopListScreen";
import ShopScreen from "../screens/ShopScreen";
import { RootDrawerParamList } from "../types";
import ProductScreen from "../screens/ProductScreen";
import AllChatScreen from "../screens/AllChatScreen";
import ChatScreen from "../screens/ChatScreen";
import CartScreen from "../screens/CartScreen";
import WishListScreen from "../screens/WishLIstScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import AddressScreen from "../screens/AddressScreen";
import PaymentScreen from "../screens/PaymentScreen";
import OrderStatusScreen from "../screens/OrderStatusScreen";
import YourOrdersScreen from "../screens/YourOrdersScreen";






const Drawer = createDrawerNavigator<RootDrawerParamList>();


const DrawerNavigator = () => {
  return (
    <Drawer.Navigator >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
      />
      <Drawer.Screen
        name="AllChatScreen"
        component={AllChatScreen}
      />
      <Drawer.Screen
        name="YourOrdersScreen"
        component={YourOrdersScreen}
      />
      {/* <Drawer.Screen
        name="ShopListScreen"
        component={ShopListScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      /> */}
      <Drawer.Screen
        name="ShopScreen"
        component={ShopScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="ProductScreen"
        component={ProductScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />

      <Drawer.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="WishListScreen"
        component={WishListScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="AddressScreen"
        component={AddressScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Screen
        name="OrderStatusScreen"
        component={OrderStatusScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { height: 0 } }}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;