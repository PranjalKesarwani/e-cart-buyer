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
  PersonalChatScreen: {shop: TShop};
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

export interface TBuyer {
  _id: string | null;
  name: string | null;
  success: boolean;
  profilePic: string | null;
  createdAt: string | null;
  activeSessions: string[];
  loading: boolean;
  error: any;
  cart: TCart[];
  wishlist: TWishlist[];
  cartItemsCount: number;
  selectedCart: TCart | null;
  selectedShop: TShop | null;
}

export type TWishlist = {
  _id: string;
  addedAt: number;
  productId: TProduct;
};

export type TCartItem = {
  productId: TProduct | string; // Can be either the ObjectId or populated Product
  quantity: number;
  priceSnapshot?: number | null;
  addedAt: number;
};

export type TCart = {
  _id: string;
  buyerId: string;
  items: TCartItem[];
  shopId: TShop;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
};

export type TCategory = {
  _id: string;
  name: string;
  slug: string;
  parentCatId: string;
  image: string;
  status: Boolean;
  path: string;
};

export interface TProductAttribute {
  attributes: Map<string, any>;
}

export type TMedia = {
  images: string[];
  videos?: string[];
  documents?: string[];
  vrAssets?: string[];
  voiceDescriptions?: string[];
};

export type TVariant = {
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

export type TProduct = {
  _id?: string | any;
  sellerId?: string | any;
  shopId?: string | any;
  productName: string;
  productShortDescription?: string;
  productId?: number | any;
  slug?: string;
  price: number;
  productMrp: number;
  discountPercentage?: number;
  currency?: string;
  sku?: string;
  categories?: {categoryId: string}[];
  attributes: Record<string, any>;
  media: TMedia;
  variants?: TVariant[];
  searchTerms?: SearchTerms;
  seo?: SEO;
  offers?: any[];
  deliveryOptions?: DeliveryOptions;
  warranty?: Warranty;
  version?: number;
  previousVersions?: any[];
  requiredAttributes?: string[];
};

export type TChosenCategory = {
  categoryId: string; // Can be ObjectId or populated Category
};

export enum TDeliveryService {
  Self = 'self',
  ThirdParty = 'thirdParty',
  NoDelivery = 'noDelivery',
  Both = 'both',
}

export type TShopLocation = {
  type: 'Point';
  coordinates: [number, number];
};

export type TShop = {
  _id: string;
  sellerId: TSeller | string;
  shopName: string;
  shopTiming: {
    open: string;
    close: string;
  };
  slug: string;
  dailyShopStatus: 'open' | 'closed';
  chosenCategories: TChosenCategory[];
  deliveryService: TDeliveryService;
  titleMsg: string;
  shopVoiceDescription: string;
  featuredCategories: string[]; // Can be ObjectIds or populated Categories
  location: TShopLocation;
  shopPic: string;
  createdAt: string;
  updatedAt: string;
};
export type TSeller = {
  _id: String;
  sellerName: string;
  mobile: string;
  isMobileVerified: boolean;
  email: string;
  password: string;
  isEmailVerified: boolean;
  adhaarId: string;
  upi: string;
  status: 'pending' | 'approved' | 'rejected';
  adminApproval: 'approved' | 'rejected' | 'pending';
  profilePic: string;
  dailyViewCounts: {date: Date; count: number}[];
  address: {
    street: string;
    landmark?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  activeSessions?: string[];
};
