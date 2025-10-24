import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS, SIZES } from '@constants';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  padding?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, padding = true, style, ...props }) => {
  return (
    <View style={[styles.container, padding && styles.padding, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  padding: {
    padding: SIZES.lg,
  },
});

export default Container;

