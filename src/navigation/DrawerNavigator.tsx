import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import ShopListScreen from "../screens/ShopListScreen";




type RootDrawerParamList = {
    HomeScreen: undefined;
    ShopListScreen:undefined;
   
  };

const Drawer = createDrawerNavigator<RootDrawerParamList>();


const DrawerNavigator = () => {
    return (
        <Drawer.Navigator >
          <Drawer.Screen name="HomeScreen" component={HomeScreen} />
          <Drawer.Screen 
          name="ShopListScreen" 
          component={ShopListScreen} 
          options={{ drawerLabel: () => null }}
          />
        </Drawer.Navigator>
    );
  };
  export default DrawerNavigator;