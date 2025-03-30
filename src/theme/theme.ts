import {StyleSheet} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

// Define colors first as a constant
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
};

export const Theme = {
  colors: BASE_COLORS,

  spacing: {
    s: 8,
    m: 16,
    l: 24,
  },

  textVariants: {
    headline: {
      fontSize: 24,
      fontWeight: '700',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
  },
  showBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
  buttons: {
    primary: {
      backgroundColor: BASE_COLORS.baseYellow,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginRight: 12,
    },
    secondary: {
      backgroundColor: BASE_COLORS.mainYellow,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    text: {
      color: BASE_COLORS.purityWhite,
      fontSize: 16,
      fontWeight: '700',
    },
  },

  gradients: {
    primary: {
      colors: [
        BASE_COLORS.saffron,
        BASE_COLORS.purityWhite,
        BASE_COLORS.harvestGreen,
      ],
      start: {x: 0, y: 0},
      end: {x: 1, y: 1},
    },
    festive: {
      colors: ['#E21717', '#6D327D'],
      start: {x: 0, y: 0.5},
      end: {x: 1, y: 0.5},
    },
  } as Record<string, LinearGradientProps>,
};

// Usage example
// const AppScreen = () => (
//   <LinearGradient
//     {...Theme.gradients.primary}
//     style={{ flex: 1, padding: Theme.spacing.m }}
//   >
//     <Text style={Theme.textVariants.headline}>
//       स्वागत हे! (Welcome!)
//     </Text>
//   </LinearGradient>
// );
