import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from '../components/Avatar';
import Icon, { type IconName } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { colors, fontSize, radius, spacing } from '../theme';
import type { AppSettings } from '../types';

const APP_VERSION = '1.0.0';

const TOGGLES: {
  key: keyof AppSettings;
  label: string;
  description: string;
}[] = [
  {
    key: 'notificationsEnabled',
    label: 'Thông báo',
    description: 'Nhận thông báo khi có tin nhắn mới',
  },
  {
    key: 'soundEnabled',
    label: 'Âm thanh',
    description: 'Phát âm thanh khi nhận tin nhắn',
  },
  {
    key: 'showOnlineStatus',
    label: 'Trạng thái trực tuyến',
    description: 'Hiển thị chấm trạng thái trên ảnh đại diện',
  },
];

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { settings, updateSetting } = useChat();

  if (!user) {
    return null;
  }

  const confirmLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  const infoRows: { icon: IconName; label: string; value: string }[] = [
    { icon: 'person-outline', label: 'Họ tên', value: user.name },
    { icon: 'mail-outline', label: 'Email', value: user.email },
    { icon: 'call-outline', label: 'Số điện thoại', value: user.phone },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profile}>
        <Avatar uri={user.avatar} name={user.name} size={84} online />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.status}>Đang hoạt động</Text>
      </View>

      <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
      <View style={styles.card}>
        {infoRows.map(({ icon, label, value }, index) => (
          <View
            key={label}
            style={[styles.item, index > 0 && styles.itemBorder]}
          >
            <Icon
              name={icon}
              size={20}
              color={colors.textSecondary}
              style={styles.itemIcon}
            />
            <Text style={styles.itemLabel}>{label}</Text>
            <Text style={styles.itemValue}>{value}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tuỳ chọn</Text>
      <View style={styles.card}>
        {TOGGLES.map((toggle, index) => (
          <View
            key={toggle.key}
            style={[styles.item, index > 0 && styles.itemBorder]}
          >
            <View style={styles.toggleText}>
              <Text style={styles.itemLabelStrong}>{toggle.label}</Text>
              <Text style={styles.itemDescription}>{toggle.description}</Text>
            </View>
            <Switch
              value={settings[toggle.key]}
              onValueChange={value => updateSetting(toggle.key, value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Ứng dụng</Text>
      <View style={styles.card}>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Phiên bản</Text>
          <Text style={styles.itemValue}>{APP_VERSION}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={confirmLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profile: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
  },
  name: {
    marginTop: spacing.md,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  status: {
    marginTop: 2,
    fontSize: fontSize.sm,
    color: colors.online,
    fontWeight: '500',
  },
  sectionTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md + 2,
  },
  itemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  itemIcon: {
    marginRight: spacing.md,
  },
  itemLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  itemLabelStrong: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
  itemValue: {
    flexShrink: 1,
    marginLeft: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'right',
  },
  itemDescription: {
    marginTop: 2,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  toggleText: {
    flex: 1,
    marginRight: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.xl,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.danger,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
