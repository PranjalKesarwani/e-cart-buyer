import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  SplashScreen: undefined;
  OtpScreen: {phoneNumber: string};
  LoginScreen: undefined;
  NameInfoScreen: undefined;
  SelectedProductScreen: undefined;
  DrawerNavigator: {screen: keyof RootDrawerParamList} | undefined;
  ShopListScreen: undefined;
  ShopScreen: {shop: any};
  ProductScreen: {product: any; category: any};
  AllChatScreen: undefined;
  CartScreen: undefined;
  WishListScreen: undefined;
  ChatScreen: undefined;
  OrderDetailsScreen: undefined;
  AddressScreen: undefined;
  PaymentScreen: undefined;
  OrderStatusScreen: undefined;
  YourOrdersScreen: undefined;
  PersonalChatScreen: undefined;
  OrderedItemDetailScreen: undefined;
};

export type RootDrawerParamList = {
  HomeScreen: undefined;
  ShopListScreen: {category: any};
  ShopScreen: {shop: any};
  AllChatScreen: undefined;
  CartScreen: undefined;
  WishListScreen: undefined;
  ChatScreen: undefined;
  YourOrdersScreen: undefined;
  MainTabsNavigator: undefined;
};
export type MainTabsParamList = {
  AllChatScreen: undefined;
  Status: undefined;
  Bid: undefined;
};
export interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface Buyer {
  _id: string | null;
  name: string | null;
  success: boolean;
  profilePic: string | null;
  createdAt: string | null;
  activeSessions: string[];
  loading: boolean;
  error: any;
}

export type Product = {
  _id: string;
  productName: string;
  price: number;
  description: string;
  imageUrls: string[];
  rating: number;
  media: any;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  parentCatId: string;
  image: string;
  status: Boolean;
  path: string;
};

export interface ProductAttribute {
  attributes: Map<string, any>;
}
