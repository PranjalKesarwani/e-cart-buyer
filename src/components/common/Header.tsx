import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/AntDesign';
import {Theme} from '../../theme/theme';

export type HeaderProps = {
  title?: string;
  subtitle?: string;
  onBack?: (e?: GestureResponderEvent) => void;
  leftIconName?: string; // AntDesign icon name
  rightIcon?: React.ReactNode; // custom node (badge, cart, etc.)
  centerComponent?: React.ReactNode; // custom center content (e.g. search input)
  showDivider?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  accessibilityLabel?: string;
};

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  leftIconName = 'arrowleft',
  rightIcon,
  showDivider = true,
  centerComponent,
  containerStyle,
  titleStyle,
  subtitleStyle,
  accessibilityLabel,
}) => {
  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea]}>
      <View
        style={[styles.container, containerStyle]}
        accessibilityLabel={accessibilityLabel}>
        {/* Left: Back (optional) */}
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.left}
            hitSlop={{top: 12, left: 12, right: 12, bottom: 12}}
            accessibilityRole="button"
            accessibilityLabel={'Go back'}>
            <Icons name={leftIconName} size={22} color="#111" />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftPlaceholder} />
        )}

        {/* Center: Title + Subtitle */}
        <View style={[styles.center]} pointerEvents="none">
          {centerComponent ? (
            <View style={{width: '100%'}} pointerEvents="box-none">
              {centerComponent}
            </View>
          ) : (
            <>
              {title ? (
                <Text
                  style={[styles.title, titleStyle]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {title}
                </Text>
              ) : null}

              {subtitle ? (
                <Text
                  style={[styles.subtitle, subtitleStyle]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {subtitle}
                </Text>
              ) : null}
            </>
          )}
        </View>

        {/* Right: optional action */}
        {rightIcon ? (
          <View style={[styles.right]}>
            {rightIcon ? (
              <View pointerEvents="box-none">{rightIcon}</View>
            ) : (
              <View style={styles.rightPlaceholder} />
            )}
          </View>
        ) : null}
      </View>

      {showDivider ? <View style={styles.divider} /> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  left: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  leftPlaceholder: {
    width: 44,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  right: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightPlaceholder: {
    width: 44,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e6e6e6',
  },
});

export default Header;
