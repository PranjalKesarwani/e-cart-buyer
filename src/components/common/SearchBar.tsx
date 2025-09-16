// components/common/SearchBar.tsx
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  Text,
  AccessibilityProps,
} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import {Theme} from '../../theme/theme';

export type SearchBarProps = {
  /**
   * Controlled value. If not provided, component will manage its own internal state.
   */
  value?: string;

  /**
   * Called on every keystroke (immediate).
   */
  onChangeText?: (text: string) => void;

  /**
   * Called when user submits via keyboard (presses search).
   */
  onSubmit?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;

  /**
   * Called after debounce timeout with latest value (useful for API search).
   */
  onDebouncedChange?: (text: string) => void;

  /**
   * Debounce milliseconds for onDebouncedChange. Default 300ms. Set to 0 to disable.
   */
  debounceMs?: number;

  placeholder?: string;
  /**
   * Whether to show the clear (x) button when there is text.
   */
  showClear?: boolean;

  /**
   * Small style overrides, not meant for heavy layout changes.
   */
  containerStyle?: object;
  inputStyle?: object;

  /**
   * Accessibility label for the whole search control.
   */
  accessibilityLabel?: string;
};

/**
 * SearchBar: compact, accessible, debounced (optional).
 * - Works controlled or uncontrolled.
 * - onDebouncedChange is fired after debounceMs.
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  onDebouncedChange,
  debounceMs = 300,
  placeholder = 'Search shops, products...',
  showClear = true,
  containerStyle,
  inputStyle,
  accessibilityLabel = 'Search',
}) => {
  const isControlled = typeof value === 'string';
  const [internal, setInternal] = useState<string>(value ?? '');
  const current = isControlled ? value! : internal;

  // Debounce timer
  const timer = useRef<number | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        // @ts-ignore - clearTimeout returns void; in RN typing timer is number
        timer.current = null;
      }
    };
  }, []);

  // When parent controls value, keep internal in sync (so clear button works visually in either mode)
  useEffect(() => {
    if (isControlled) setInternal(value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback(
    (text: string) => {
      if (!isControlled) setInternal(text);
      onChangeText?.(text);

      if (onDebouncedChange) {
        if (debounceMs <= 0) {
          onDebouncedChange(text);
          return;
        }
        if (timer.current) {
          clearTimeout(timer.current);
        }
        // @ts-ignore setTimeout returns number in RN/Browser
        timer.current = setTimeout(() => {
          onDebouncedChange(text);
          // @ts-ignore
          timer.current = null;
        }, debounceMs) as unknown as number;
      }
    },
    [isControlled, onChangeText, onDebouncedChange, debounceMs],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) setInternal('');
    onChangeText?.('');
    if (onDebouncedChange) {
      // fire debounced with empty immediately to reset results
      onDebouncedChange('');
    }
  }, [isControlled, onChangeText, onDebouncedChange]);

  return (
    <View
      style={[styles.container, containerStyle]}
      accessible
      accessibilityRole="search"
      accessibilityLabel={accessibilityLabel}>
      <Icons name="search1" size={16} color={Theme.colors.primary} />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        value={current}
        onChangeText={handleChange}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        underlineColorAndroid="transparent"
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor="#888"
        numberOfLines={1}
      />
      {showClear && current.length > 0 ? (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
          accessibilityRole="button"
          accessibilityLabel="Clear search">
          <Icons name="closecircle" size={16} />
        </TouchableOpacity>
      ) : (
        // small spacer so layout doesn't jump when clear appears
        <View style={{width: 18}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    minWidth: 200,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    color: '#111',
  },
});

export default SearchBar;
