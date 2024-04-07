import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";




type RootDrawerParamList = {
    HomeScreen: undefined;
   
  };

const Drawer = createDrawerNavigator<RootDrawerParamList>();


const DrawerNavigator = () => {
    return (
        <Drawer.Navigator >
          <Drawer.Screen name="HomeScreen" component={HomeScreen} />
        </Drawer.Navigator>
    );
  };
  export default DrawerNavigator;