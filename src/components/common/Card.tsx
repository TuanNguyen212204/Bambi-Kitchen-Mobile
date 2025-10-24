import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS, SIZES } from '@constants';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevation?: number;
}

const Card: React.FC<CardProps> = ({ children, elevation = 3, style, ...props }) => {
  return (
    <View
      style={[
        styles.card,
        {
          shadowOpacity: 0.1 * elevation,
          shadowRadius: 2 * elevation,
          elevation: elevation,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMD,
    padding: SIZES.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

export default Card;

