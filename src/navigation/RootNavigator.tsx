import {
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatProvider } from '../context/ChatContext';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import { colors } from '../theme';
import MainTabs from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    // key theo user: đăng xuất / đăng nhập lại sẽ reset toàn bộ dữ liệu chat.
    <ChatProvider key={user?.id ?? 'guest'}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
          {user ? (
            <>
              <Stack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Chat" component={ChatScreen} />
            </>
          ) : (
            // Auth flow: khi user = null, navigator tự chuyển về Login.
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false, animationTypeForReplace: 'pop' }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ChatProvider>
  );
}
