import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

/** Đường kẻ mảnh giữa các item, thụt lề theo ảnh đại diện. */
export default function Separator({ inset = 80 }: { inset?: number }) {
  return <View style={[styles.line, { marginLeft: inset }]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
