import {StyleSheet} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

// Base color definitions
const BASE_COLORS = {
  saffron: '#FF9933',
  chakraBlue: '#000080',
  harvestGreen: '#138808',
  bharatPurple: '#6D327D',
  festivalRed: '#E21717',
  earthBrown: '#6D4C3D',
  purityWhite: '#FFFFFF',
  baseYellow: '#FFD65A',
  mainYellow: '#FFB200',
  mainOrange: '#FB641B',
  black: '#000000',
  lightBackground: '#F0F0F0',
  darkGray: '#A9A9A9',
  primary: '#FF9933',
  secondary: '#FF9F43',
  background: '#F8F9FA',
  darkText: '#2D3436',
  gray: '#636E72',
  lightGray: '#DFE6E9',
  white: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.7)',
  warning: '#FFA725',
  success: '#1F7D53',
  lightPrimary: '#FFD65A',
  warningText: '#856404',
  warningBackground: '#fff3cd',
  warningBorder: '#ffeeba',
  text: '#333333',
  red: 'red',
  orangeDark: '#fa8b1c',
  orangeLight: '#FF9933',
  themeColor: '',
  error: 'red',
};

export const Theme = {
  colors: BASE_COLORS,

  fonts: {
    heading: 'Poppins-Bold',
    body: 'Poppins-Regular',
    // heading: 'System',
    // body: 'System'
  }, // Fixed missing comma here
  defaultImages: {
    shop: 'https://d27k8xmh3cuzik.cloudfront.net/wp-content/uploads/2018/03/street-shopping-in-india-cover.jpg',
    product:
      'https://i.pinimg.com/1200x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg',
    avatar:
      'https://i.pinimg.com/736x/2b/72/47/2b7247bc9f74aaac262a35a7f91cc185.jpg',
  },
  showBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 24,
    full: 50,
  },
  shadows: {
    primary: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    card: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    button: {
      elevation: 5,
      shadowColor: '#4a90e2',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
  },

  textVariants: {
    header: {
      fontSize: 42,
      fontFamily: 'Poppins-Bold',
      color: BASE_COLORS.darkText,
    },
    subtitle: {
      fontSize: 18,
      fontFamily: 'Poppins-Regular',
      color: BASE_COLORS.gray,
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      lineHeight: 24,
      color: BASE_COLORS.darkText,
    },
  },

  buttons: {
    primary: {
      backgroundColor: BASE_COLORS.baseYellow,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 15,
      shadowColor: BASE_COLORS.black,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    secondary: {
      backgroundColor: BASE_COLORS.mainYellow,
      padding: 16,
      borderRadius: 15,
      alignItems: 'center',
    },
    text: {
      color: BASE_COLORS.purityWhite,
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
    },
  },

  gradients: {
    primary: {
      colors: [BASE_COLORS.saffron, BASE_COLORS.mainYellow],
      start: {x: 0, y: 0},
      end: {x: 1, y: 1},
    },
    festive: {
      colors: [BASE_COLORS.festivalRed, BASE_COLORS.bharatPurple],
      start: {x: 0, y: 0.5},
      end: {x: 1, y: 0.5},
    },
  } as Record<string, LinearGradientProps>,

  // shadows: {
  //   small: {
  //     shadowColor: BASE_COLORS.black,
  //     shadowOffset: {width: 0, height: 2},
  //     shadowOpacity: 0.1,
  //     shadowRadius: 4,
  //     elevation: 2,
  //   },
  //   medium: {
  //     shadowColor: BASE_COLORS.black,
  //     shadowOffset: {width: 0, height: 4},
  //     shadowOpacity: 0.1,
  //     shadowRadius: 8,
  //     elevation: 5,
  //   },
  // },

  radii: {
    s: 8,
    m: 15,
    l: 25,
    xl: 40,
  },

  typography: {
    h4: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: 'Inter-Bold',
    },
    h5: {
      fontSize: 20,
      lineHeight: 28,
      fontFamily: 'Inter-Bold',
    },
    body1: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter-Regular',
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Inter-Medium',
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter-SemiBold',
    },
    body2: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Inter-Regular',
    },
  },
};
