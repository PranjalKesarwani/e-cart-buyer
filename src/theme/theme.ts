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
