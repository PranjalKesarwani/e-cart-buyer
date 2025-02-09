import Toast from 'react-native-toast-message';

/**
 * Show a toast message
 * @param type "success" | "error" | "info"
 * @param text1 Main title of the toast
 * @param text2 Subtitle or description
 * @param position "top" | "bottom" (default: top)
 */
export const showToast = (
  type: 'success' | 'error' | 'info',
  text1: string,
  text2?: string,
  position: 'top' | 'bottom' = 'top',
) => {
  Toast.show({
    type,
    text1,
    text2,
    position,
    visibilityTime: 4000, // Default duration
  });
};
