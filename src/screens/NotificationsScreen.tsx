import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EmptyState from '../components/EmptyState';
import Icon, { type IconName } from '../components/Icon';
import Separator from '../components/Separator';
import { useChat } from '../context/ChatContext';
import type { MainTabScreenProps } from '../navigation/types';
import { colors, fontSize, radius, spacing } from '../theme';
import type { AppNotification, NotificationType } from '../types';
import { formatRelative } from '../utils/format';

type Filter = 'all' | 'unread';

const FullSeparator = () => <Separator inset={0} />;

const TYPE_ICONS: Record<NotificationType, IconName> = {
  message: 'chatbubble-ellipses-outline',
  friend: 'person-add-outline',
  system: 'megaphone-outline',
  security: 'lock-closed-outline',
};

export default function NotificationsScreen({
  navigation,
}: MainTabScreenProps<'Notifications'>) {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useChat();
  const [filter, setFilter] = useState<Filter>('all');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        unreadNotificationCount > 0 ? (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={markAllNotificationsRead}
          >
            <Text style={styles.headerButtonText}>Đọc tất cả</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, unreadNotificationCount, markAllNotificationsRead]);

  const data = useMemo(
    () =>
      [...notifications]
        .filter(n => (filter === 'unread' ? !n.read : true))
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications, filter],
  );

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[styles.row, !item.read && styles.rowUnread]}
      activeOpacity={0.7}
      onPress={() => markNotificationRead(item.id)}
    >
      <View style={[styles.iconWrap, !item.read && styles.iconWrapUnread]}>
        <Icon
          name={TYPE_ICONS[item.type]}
          size={20}
          color={item.read ? colors.textMuted : colors.primary}
        />
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, !item.read && styles.titleUnread]}>
          {item.title}
        </Text>
        <Text
          style={[styles.content, !item.read && styles.contentUnread]}
          numberOfLines={2}
        >
          {item.content}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.time, !item.read && styles.timeUnread]}>
            {formatRelative(item.createdAt)}
          </Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={[styles.state, !item.read && styles.stateUnread]}>
            {item.read ? 'Đã đọc' : 'Chưa đọc'}
          </Text>
        </View>
      </View>

      {!item.read && (
        <TouchableOpacity
          style={styles.markButton}
          onPress={() => markNotificationRead(item.id)}
          hitSlop={8}
          accessibilityLabel="Đánh dấu đã đọc"
        >
          <View style={styles.unreadDot} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {(
          [
            ['all', 'Tất cả'],
            ['unread', `Chưa đọc (${unreadNotificationCount})`],
          ] as const
        ).map(([key, label]) => {
          const active = filter === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(key)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={FullSeparator}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title={
              filter === 'unread'
                ? 'Bạn đã đọc hết thông báo'
                : 'Chưa có thông báo'
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerButton: {
    paddingHorizontal: spacing.lg,
  },
  headerButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  rowUnread: {
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: {
    backgroundColor: colors.surface,
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  titleUnread: {
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    marginTop: 2,
    fontSize: fontSize.sm + 1,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  contentUnread: {
    color: colors.text,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '600',
  },
  metaDot: {
    marginHorizontal: 6,
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  state: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  stateUnread: {
    color: colors.primary,
    fontWeight: '600',
  },
  markButton: {
    paddingLeft: spacing.sm,
    paddingTop: spacing.xs,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
