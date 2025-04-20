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
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  lightGray: '#D3D3D3',
  lightBackground: '#F0F0F0',
  darkGray: '#A9A9A9',
  darkText: '#2D2D2D', // Added for text contrast
  primary: '#FF9933',
  background: '#F5F5F5',
};

export const Theme = {
  colors: BASE_COLORS,

  fonts: {
    heading: 'Poppins-Bold',
    body: 'Poppins-Regular',
  }, // Fixed missing comma here

  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
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

  shadows: {
    small: {
      shadowColor: BASE_COLORS.black,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: BASE_COLORS.black,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  radii: {
    s: 8,
    m: 15,
    l: 25,
    xl: 40,
  },
};
