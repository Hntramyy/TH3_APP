export interface Account {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

/** Thông tin tài khoản sau khi đăng nhập (không giữ mật khẩu). */
export type CurrentUser = Omit<Account, 'password'>;

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  /** Thời điểm hoạt động gần nhất (ms) — dùng khi offline. */
  lastSeen: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  contactId: string;
  /** Sắp xếp tăng dần theo thời gian. */
  messages: Message[];
  unreadCount: number;
}

export type NotificationType = 'message' | 'friend' | 'system' | 'security';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  createdAt: number;
  read: boolean;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  showOnlineStatus: boolean;
}
