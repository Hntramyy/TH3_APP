import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ACCOUNTS } from '../data/mockData';
import type { CurrentUser } from '../types';

type LoginResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: CurrentUser | null;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Giả lập độ trễ mạng để thể hiện trạng thái đang đăng nhập. */
const FAKE_LATENCY_MS = 600;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const login = useCallback(
    async (username: string, password: string): Promise<LoginResult> => {
      await new Promise<void>(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

      const account = ACCOUNTS.find(
        a => a.username.toLowerCase() === username.trim().toLowerCase(),
      );
      if (!account || account.password !== password) {
        return { ok: false, error: 'Tài khoản hoặc mật khẩu không đúng.' };
      }

      setUser({
        id: account.id,
        username: account.username,
        name: account.name,
        email: account.email,
        phone: account.phone,
        avatar: account.avatar,
      });
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  }
  return ctx;
}
