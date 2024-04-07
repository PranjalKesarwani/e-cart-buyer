import type { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
    SplashScreen: undefined;
    OtpScreen: {phoneNumber:string};
    LoginScreen:undefined;
    NameInfoScreen:undefined;
    ShopsScreen:undefined;
    DrawerNavigator:undefined;
    ShopListScreen:undefined;

};

export type RootDrawerParamList = {
    HomeScreen: undefined;
    ShopListScreen:undefined;
   
  };

