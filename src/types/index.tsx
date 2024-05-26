import type { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
    SplashScreen: undefined;
    OtpScreen: {phoneNumber:string};
    LoginScreen:undefined;
    NameInfoScreen:undefined;
    SelectedProductScreen:undefined;
    DrawerNavigator: { screen: keyof RootDrawerParamList } | undefined;
    ShopListScreen:undefined;
    ShopScreen:undefined;
    ProductScreen:undefined;
    AllChatScreen:undefined;
    CartScreen:undefined;
    WishListScreen:undefined;
    ChatScreen:undefined;
    OrderDetailsScreen:undefined;
    AddressScreen:undefined;
    PaymentScreen: undefined;
    OrderStatusScreen: undefined;
    YourOrdersScreen: undefined;
    PersonalChatScreen: undefined;
    OrderedItemDetailScreen:undefined;


};

export type RootDrawerParamList = {
    HomeScreen: undefined;
    ShopListScreen:undefined;
    ShopScreen:undefined;
    AllChatScreen:undefined;
    CartScreen:undefined;
    WishListScreen:undefined;
    ChatScreen:undefined;
    YourOrdersScreen: undefined;


   
  };

