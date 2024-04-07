import type { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
    SplashScreen: undefined;
    OtpScreen: {phoneNumber:string};
    LoginScreen:undefined;
    NameInfoScreen:undefined;
    ShopsScreen:undefined;
    DrawerNavigator:undefined;

};

export type RootDrawerParamList = {
    HomeScreen: undefined;
   
  };

