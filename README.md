# ChatApp — Ứng dụng chat (React Native CLI)

Bài thực hành React Native: ứng dụng chat gồm 5 màn hình chính, dùng dữ liệu mẫu (không cần server).

## Công nghệ

| Thành phần | Phiên bản |
| --- | --- |
| React Native (CLI, New Architecture) | 0.88 |
| React | 19 |
| TypeScript | 6 |
| React Navigation (native-stack + bottom-tabs) | 7 |
| Icon: @react-native-vector-icons/ionicons | 14 |

## Chạy dự án

Yêu cầu: Node ≥ 22.11, JDK 17+, Android SDK, máy ảo Android hoặc thiết bị thật.

```sh
npm install
npm start            # terminal 1: Metro bundler
npm run android      # terminal 2: build & cài lên máy ảo/thiết bị
```

iOS (chỉ trên macOS): `cd ios && bundle install && bundle exec pod install && cd .. && npm run ios`.

**Tài khoản đăng nhập:** `admin` / `123456` (không hiển thị trên giao diện).

Kiểm tra chất lượng:

```sh
npx tsc --noEmit   # kiểm tra kiểu
npm run lint       # ESLint
npm test           # Jest
```

## Chức năng theo đề bài

| Màn hình | Chức năng |
| --- | --- |
| **Đăng nhập** | Tên ứng dụng, ô tài khoản/mật khẩu (icon ẩn/hiện), kiểm tra bỏ trống từng ô, báo sai tài khoản, trạng thái đang đăng nhập → chuyển sang Home |
| **Home (Tin nhắn)** | Danh sách hội thoại: ảnh đại diện, tên, tin nhắn gần nhất, thời gian, badge số tin chưa đọc; tìm kiếm theo tên/nội dung (không phân biệt dấu); nhấn để vào chat |
| **Chat** | Xem & gửi tin nhắn, tự đánh dấu đã đọc, giả lập đối phương trả lời |
| **Danh bạ** | Ảnh đại diện, tên, trạng thái trực tuyến/lần hoạt động cuối; tìm kiếm; lọc "Đang hoạt động"; nhấn để mở (hoặc tạo) cuộc trò chuyện |
| **Thông báo** | Nội dung, thời gian, trạng thái đã đọc/chưa đọc (nền + chấm xanh + chữ đậm); nhấn để đánh dấu đã đọc, nút "Đọc tất cả", lọc chưa đọc |
| **Cài đặt** | Thông tin tài khoản (họ tên, email, số điện thoại), các tuỳ chọn bằng `Switch`, nút Đăng xuất (xác nhận) → quay về Đăng nhập |

Badge số lượng chưa đọc hiển thị trên tab *Tin nhắn* và *Thông báo*.

## Cấu trúc thư mục

```
App.tsx                      # Providers + RootNavigator
src/
├── components/              # Avatar, Icon, SearchBar, Badge, EmptyState, Separator
├── context/
│   ├── AuthContext.tsx      # đăng nhập / đăng xuất
│   └── ChatContext.tsx      # hội thoại, tin nhắn, thông báo, cài đặt (useReducer)
├── data/mockData.ts         # dữ liệu mẫu
├── navigation/
│   ├── RootNavigator.tsx    # Stack: Login | (Main tabs + Chat) — auth flow
│   ├── MainTabs.tsx         # Bottom tabs: Home, Danh bạ, Thông báo, Cài đặt
│   └── types.ts             # kiểu tham số route
├── screens/                 # Login, Home, Contacts, Notifications, Settings, Chat
├── theme/                   # màu sắc, khoảng cách, cỡ chữ dùng chung
├── types/                   # kiểu dữ liệu domain
└── utils/format.ts          # định dạng thời gian, tìm kiếm không dấu
```

### Ghi chú thiết kế

- **Auth flow**: `RootNavigator` render màn hình theo `user` — đăng xuất thì stack tự quay về Login, không thể "Back" vào app.
- `ChatProvider` được gắn `key` theo user nên đăng xuất sẽ reset dữ liệu chat về ban đầu.
- Ảnh đại diện minh hoạ từ DiceBear (Notionists); nếu không có mạng sẽ tự hiển thị chữ cái viết tắt.
- Toàn bộ icon dùng Ionicons đơn sắc, màu lấy từ theme để đồng bộ giữa các màn hình. Font icon được autolinking chép vào bản build Android — sau khi cài thư viện cần build lại native.
