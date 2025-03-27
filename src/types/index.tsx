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
  cart: TCart[];
  wishlist: Product[];
}

export type WishlistItem = {
  productId: string | Product; // Can be either ObjectId or populated Product
  addedAt: number;
};

export type Wishlist = {
  _id: string;
  buyerId: string;
  shopId: string | Shop; // Can be either ObjectId or populated Shop
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
};
// export type Product = {
//   _id: string;
//   productName: string;
//   price: number;
//   description: string;
//   imageUrls: string[];
//   rating: number;
//   media: any;
// };

export type CartItem = {
  productId: string | Product; // Can be either the ObjectId or populated Product
  quantity: number;
  priceSnapshot?: number | null;
  addedAt: number;
};

export type TCart = {
  _id: string;
  buyerId: string;
  items: CartItem[];
  shopId: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
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

export type Media = {
  images: string[];
  videos?: string[];
  documents?: string[];
  vrAssets?: string[];
  voiceDescriptions?: string[];
};

export type Variant = {
  sku: string;
  attributes: Record<string, any>;
  priceOffset?: number;
  stock: number;
  images?: string[];
};

export type SearchTerms = {
  primary?: string;
  synonyms?: string[];
  spellingVariants?: string[];
};

export type SEO = {
  title?: string;
  description?: string;
  keywords?: string[];
  structuredData?: Record<string, any>;
};

export type DeliveryOptions = Record<string, any>;
export type Warranty = Record<string, any>;

export type Product = {
  _id: string;
  sellerId: string;
  shopId: string;
  productName: string;
  productShortDescription?: string;
  productId: number;
  slug: string;
  price: number;
  productMrp: number;
  discountPercentage?: number;
  currency: string;
  sku?: string;
  categories: {categoryId: string}[];
  attributes: Record<string, any>;
  media: Media;
  variants?: Variant[];
  searchTerms?: SearchTerms;
  seo?: SEO;
  offers?: any[];
  deliveryOptions?: DeliveryOptions;
  warranty?: Warranty;
  version: number;
  previousVersions?: any[];
  requiredAttributes?: string[];
};

export type ChosenCategory = {
  categoryId: string; // Can be ObjectId or populated Category
};

export enum DeliveryService {
  Self = 'self',
  ThirdParty = 'thirdParty',
  NoDelivery = 'noDelivery',
  Both = 'both',
}

export type ShopLocation = {
  type: 'Point';
  coordinates: [number, number];
};

export type Shop = {
  _id: string;
  sellerId: string;
  shopName: string;
  shopTiming: {
    open: string;
    close: string;
  };
  slug: string;
  dailyShopStatus: 'open' | 'closed';
  chosenCategories: ChosenCategory[];
  deliveryService: DeliveryService;
  titleMsg: string;
  shopVoiceDescription: string;
  featuredCategories: string[]; // Can be ObjectIds or populated Categories
  location: ShopLocation;
  shopPic: string;
  createdAt: string;
  updatedAt: string;
};
