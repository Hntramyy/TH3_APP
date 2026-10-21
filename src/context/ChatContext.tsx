import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {
  AUTO_REPLIES,
  CURRENT_USER_ID,
  createContacts,
  createConversations,
  createNotifications,
} from '../data/mockData';
import type {
  AppNotification,
  AppSettings,
  Contact,
  Conversation,
  Message,
} from '../types';
import { createId } from '../utils/format';

interface ChatState {
  contacts: Contact[];
  conversations: Conversation[];
  notifications: AppNotification[];
  settings: AppSettings;
}

type Action =
  | {
      type: 'ADD_MESSAGE';
      conversationId: string;
      message: Message;
      unread: boolean;
    }
  | { type: 'MARK_CONVERSATION_READ'; conversationId: string }
  | { type: 'CREATE_CONVERSATION'; conversation: Conversation }
  | { type: 'MARK_NOTIFICATION_READ'; id: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'UPDATE_SETTING'; key: keyof AppSettings; value: boolean };

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === action.conversationId
            ? {
                ...c,
                messages: [...c.messages, action.message],
                unreadCount: action.unread ? c.unreadCount + 1 : c.unreadCount,
              }
            : c,
        ),
      };
    case 'MARK_CONVERSATION_READ':
      return {
        ...state,
        conversations: state.conversations.map(c =>
          c.id === action.conversationId && c.unreadCount > 0
            ? { ...c, unreadCount: 0 }
            : c,
        ),
      };
    case 'CREATE_CONVERSATION':
      return {
        ...state,
        conversations: [...state.conversations, action.conversation],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.id ? { ...n, read: true } : n,
        ),
      };
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.read ? n : { ...n, read: true },
        ),
      };
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: { ...state.settings, [action.key]: action.value },
      };
  }
}

function createInitialState(): ChatState {
  return {
    contacts: createContacts(),
    conversations: createConversations(),
    notifications: createNotifications(),
    settings: {
      notificationsEnabled: true,
      soundEnabled: true,
      showOnlineStatus: true,
    },
  };
}

interface ChatContextValue extends ChatState {
  unreadConversationCount: number;
  unreadNotificationCount: number;
  getContact: (contactId: string) => Contact | undefined;
  getConversation: (conversationId: string) => Conversation | undefined;
  /** Trả về id cuộc trò chuyện với contact, tạo mới nếu chưa có. */
  openConversationWith: (contactId: string) => string;
  sendMessage: (conversationId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSetting: (key: keyof AppSettings, value: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const AUTO_REPLY_DELAY_MS = 1500;

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  // Giữ tham chiếu mới nhất để các callback ổn định không bị stale.
  const stateRef = useRef(state);
  stateRef.current = state;

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const getContact = useCallback(
    (contactId: string) => state.contacts.find(c => c.id === contactId),
    [state.contacts],
  );

  const getConversation = useCallback(
    (conversationId: string) =>
      state.conversations.find(c => c.id === conversationId),
    [state.conversations],
  );

  const openConversationWith = useCallback((contactId: string) => {
    const existing = stateRef.current.conversations.find(
      c => c.contactId === contactId,
    );
    if (existing) {
      return existing.id;
    }
    const conversation: Conversation = {
      id: createId('c'),
      contactId,
      messages: [],
      unreadCount: 0,
    };
    // Cập nhật ref ngay để lần gọi liên tiếp không tạo trùng.
    stateRef.current = {
      ...stateRef.current,
      conversations: [...stateRef.current.conversations, conversation],
    };
    dispatch({ type: 'CREATE_CONVERSATION', conversation });
    return conversation.id;
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    dispatch({
      type: 'ADD_MESSAGE',
      conversationId,
      unread: false,
      message: {
        id: createId('m'),
        senderId: CURRENT_USER_ID,
        text: trimmed,
        createdAt: Date.now(),
      },
    });

    // Mô phỏng đối phương trả lời.
    const conversation = stateRef.current.conversations.find(
      c => c.id === conversationId,
    );
    if (!conversation) {
      return;
    }
    const timer = setTimeout(() => {
      dispatch({
        type: 'ADD_MESSAGE',
        conversationId,
        unread: true,
        message: {
          id: createId('m'),
          senderId: conversation.contactId,
          text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
          createdAt: Date.now(),
        },
      });
    }, AUTO_REPLY_DELAY_MS);
    timers.current.push(timer);
  }, []);

  const markConversationRead = useCallback(
    (conversationId: string) =>
      dispatch({ type: 'MARK_CONVERSATION_READ', conversationId }),
    [],
  );

  const markNotificationRead = useCallback(
    (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', id }),
    [],
  );

  const markAllNotificationsRead = useCallback(
    () => dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' }),
    [],
  );

  const updateSetting = useCallback(
    (key: keyof AppSettings, value: boolean) =>
      dispatch({ type: 'UPDATE_SETTING', key, value }),
    [],
  );

  const value = useMemo<ChatContextValue>(
    () => ({
      ...state,
      unreadConversationCount: state.conversations.filter(
        c => c.unreadCount > 0,
      ).length,
      unreadNotificationCount: state.notifications.filter(n => !n.read).length,
      getContact,
      getConversation,
      openConversationWith,
      sendMessage,
      markConversationRead,
      markNotificationRead,
      markAllNotificationsRead,
      updateSetting,
    }),
    [
      state,
      getContact,
      getConversation,
      openConversationWith,
      sendMessage,
      markConversationRead,
      markNotificationRead,
      markAllNotificationsRead,
      updateSetting,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat phải được dùng bên trong <ChatProvider>');
  }
  return ctx;
}
