import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { getInitials } from '../utils/format';

interface Props {
  uri: string;
  name: string;
  size?: number;
  /** Bỏ trống để ẩn chấm trạng thái. */
  online?: boolean;
}

export default function Avatar({ uri, name, size = 52, online }: Props) {
  const [failed, setFailed] = useState(false);
  const dot = Math.max(10, Math.round(size * 0.26));
  const circle = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={{ width: size, height: size }}>
      {failed ? (
        <View style={[styles.fallback, circle]}>
          <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
            {getInitials(name)}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={[styles.image, circle]}
          onError={() => setFailed(true)}
        />
      )}
      {online !== undefined && (
        <View
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: online ? colors.online : colors.textMuted,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.border,
  },
  fallback: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.primary,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
