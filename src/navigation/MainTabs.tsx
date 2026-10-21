import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import Icon, { type IconName } from '../components/Icon';
import { useChat } from '../context/ChatContext';
import ContactsScreen from '../screens/ContactsScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { colors } from '../theme';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

/** [icon khi chọn, icon khi không chọn] — đơn sắc, màu theo tint của tab. */
const TAB_ICONS: Record<keyof MainTabParamList, [IconName, IconName]> = {
  Home: ['chatbubbles', 'chatbubbles-outline'],
  Contacts: ['people', 'people-outline'],
  Notifications: ['notifications', 'notifications-outline'],
  Settings: ['settings', 'settings-outline'],
};

const badge = (count: number) => (count > 0 ? count : undefined);

export default function MainTabs() {
  const { unreadConversationCount, unreadNotificationCount } = useChat();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'left',
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => (
          <Icon
            name={TAB_ICONS[route.name][focused ? 0 : 1]}
            size={24}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Tin nhắn',
          tabBarBadge: badge(unreadConversationCount),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ title: 'Danh bạ' }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Thông báo',
          tabBarBadge: badge(unreadNotificationCount),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Cài đặt' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
