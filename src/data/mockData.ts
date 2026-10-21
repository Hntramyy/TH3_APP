import type {
  Account,
  AppNotification,
  Contact,
  Conversation,
  Message,
} from '../types';

/**
 * Dữ liệu mẫu — ứng dụng không kết nối máy chủ.
 * Thời gian được tính tương đối so với lúc mở app để danh sách luôn "mới".
 */

export const CURRENT_USER_ID = 'me';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const ago = (ms: number) => Date.now() - ms;

/** Avatar minh hoạ (DiceBear – Notionists), nền pastel chọn theo seed. */
const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/png?size=160&seed=${seed}` +
  '&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,c1f0d5';

export const ACCOUNTS: Account[] = [
  {
    id: CURRENT_USER_ID,
    username: 'admin',
    password: '123456',
    name: 'Trà My',
    email: 'hntramyy@gmail.com',
    phone: '0373 090 128',
    avatar: avatar('TraMy'),
  },
];

export function createContacts(): Contact[] {
  return [
    {
      id: 'u1',
      name: 'Bình',
      avatar: avatar('Binh-girl'),
      online: true,
      lastSeen: ago(0),
    },
    {
      id: 'u2',
      name: 'Hoàng Cường',
      avatar: avatar('Cuong'),
      online: false,
      lastSeen: ago(25 * MINUTE),
    },
    {
      id: 'u3',
      name: 'Minh Đức',
      avatar: avatar('Duc'),
      online: true,
      lastSeen: ago(0),
    },
    {
      id: 'u4',
      name: 'Thu Hà',
      avatar: avatar('Ha'),
      online: false,
      lastSeen: ago(3 * HOUR),
    },
    {
      id: 'u5',
      name: 'Quang Huy',
      avatar: avatar('Huy'),
      online: true,
      lastSeen: ago(0),
    },
    {
      id: 'u6',
      name: 'Ngọc Lan',
      avatar: avatar('Lan'),
      online: false,
      lastSeen: ago(1 * DAY),
    },
    {
      id: 'u7',
      name: 'Tuấn Minh',
      avatar: avatar('Minh'),
      online: false,
      lastSeen: ago(2 * DAY),
    },
    {
      id: 'u8',
      name: 'Nga',
      avatar: avatar('Nga'),
      online: true,
      lastSeen: ago(0),
    },
    {
      id: 'u9',
      name: 'Phúc',
      avatar: avatar('Phuc'),
      online: false,
      lastSeen: ago(45 * MINUTE),
    },
    {
      id: 'u10',
      name: 'Mai Quỳnh',
      avatar: avatar('Quynh'),
      online: true,
      lastSeen: ago(0),
    },
    {
      id: 'u11',
      name: 'Gia Sơn',
      avatar: avatar('Son'),
      online: false,
      lastSeen: ago(5 * DAY),
    },
    {
      id: 'u12',
      name: 'Anh Thư',
      avatar: avatar('Thu'),
      online: false,
      lastSeen: ago(6 * HOUR),
    },
  ];
}

type Seed = [sender: 'me' | 'them', text: string, agoMs: number];

function buildMessages(
  convId: string,
  contactId: string,
  seeds: Seed[],
): Message[] {
  return seeds.map(([sender, text, agoMs], index) => ({
    id: `${convId}_m${index}`,
    senderId: sender === 'me' ? CURRENT_USER_ID : contactId,
    text,
    createdAt: ago(agoMs),
  }));
}

function conversation(
  id: string,
  contactId: string,
  unreadCount: number,
  seeds: Seed[],
): Conversation {
  return {
    id,
    contactId,
    unreadCount,
    messages: buildMessages(id, contactId, seeds),
  };
}

export function createConversations(): Conversation[] {
  return [
    conversation('c1', 'u1', 2, [
      ['them', 'Chào My, chiều nay họp lúc mấy giờ nhỉ?', 40 * MINUTE],
      ['me', '3h chiều nha Bình, ở phòng họp tầng 5.', 35 * MINUTE],
      ['them', 'Ok, mình sẽ chuẩn bị slide.', 6 * MINUTE],
      ['them', 'Nhớ mang theo laptop nhé 😄', 2 * MINUTE],
    ]),
    conversation('c2', 'u3', 0, [
      ['them', 'Code review xong chưa bạn?', 2 * HOUR],
      ['me', 'Xong rồi, mình đã comment trên PR.', 90 * MINUTE],
    ]),
    conversation('c3', 'u2', 5, [
      ['them', 'Tối nay đi đá bóng không?', 5 * HOUR],
      ['them', 'Sân cũ nhé', 5 * HOUR - MINUTE],
      ['them', '7h tối', 5 * HOUR - 2 * MINUTE],
      ['them', 'Thiếu 1 người nữa', 4 * HOUR],
      ['them', 'Trả lời đi My ơi!', 3 * HOUR],
    ]),
    conversation('c4', 'u4', 0, [
      ['me', 'Cảm ơn Hà về tài liệu hôm trước nhé.', 1 * DAY + 2 * HOUR],
      ['them', 'Không có gì đâu 🙌', 1 * DAY + HOUR],
    ]),
    conversation('c5', 'u5', 1, [
      ['me', 'Huy gửi mình file thiết kế với.', 2 * DAY],
      ['them', 'Đây nhé, bản mới nhất trên Figma.', 2 * DAY - 30 * MINUTE],
    ]),
    conversation('c6', 'u8', 0, [
      ['them', 'Sinh nhật vui vẻ nha!! 🎂', 4 * DAY],
      ['me', 'Cảm ơn Nga nhiều nha ❤️', 4 * DAY - HOUR],
    ]),
    conversation('c7', 'u6', 0, [
      ['them', 'Tuần sau team mình đi team building ở Đà Lạt.', 9 * DAY],
      ['me', 'Tuyệt vời, mình đăng ký luôn.', 9 * DAY - 10 * MINUTE],
    ]),
  ];
}

export function createNotifications(): AppNotification[] {
  return [
    {
      id: 'n1',
      type: 'message',
      title: 'Tin nhắn mới',
      content: 'Bình đã gửi cho bạn 2 tin nhắn mới.',
      createdAt: ago(2 * MINUTE),
      read: false,
    },
    {
      id: 'n2',
      type: 'friend',
      title: 'Lời mời kết bạn',
      content: 'Anh Thư đã gửi cho bạn lời mời kết bạn.',
      createdAt: ago(50 * MINUTE),
      read: false,
    },
    {
      id: 'n3',
      type: 'security',
      title: 'Đăng nhập mới',
      content: 'Tài khoản của bạn vừa được đăng nhập trên thiết bị Android.',
      createdAt: ago(3 * HOUR),
      read: false,
    },
    {
      id: 'n4',
      type: 'message',
      title: 'Nhóm "Dự án Mobile"',
      content: 'Minh Đức đã nhắc đến bạn trong một tin nhắn.',
      createdAt: ago(8 * HOUR),
      read: true,
    },
    {
      id: 'n5',
      type: 'system',
      title: 'Cập nhật ứng dụng',
      content: 'Phiên bản 1.1.0 đã sẵn sàng với nhiều cải tiến về hiệu năng.',
      createdAt: ago(1 * DAY + 3 * HOUR),
      read: true,
    },
    {
      id: 'n6',
      type: 'friend',
      title: 'Kết bạn thành công',
      content: 'Bạn và Mai Quỳnh đã trở thành bạn bè.',
      createdAt: ago(3 * DAY),
      read: true,
    },
    {
      id: 'n7',
      type: 'system',
      title: 'Chào mừng',
      content: 'Chào mừng bạn đến với ChatApp! Hãy bắt đầu trò chuyện ngay.',
      createdAt: ago(10 * DAY),
      read: true,
    },
  ];
}

/** Câu trả lời tự động để mô phỏng đối phương đang chat. */
export const AUTO_REPLIES = [
  'Ok bạn 👍',
  'Mình hiểu rồi.',
  'Để mình xem lại rồi báo bạn nhé.',
  'Haha, chuẩn luôn 😂',
  'Cảm ơn bạn nhiều!',
  'Lát nữa mình gọi lại nha.',
];
