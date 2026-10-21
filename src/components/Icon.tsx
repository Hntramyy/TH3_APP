import { Ionicons } from '@react-native-vector-icons/ionicons/static';
import type { ComponentProps } from 'react';

/** Bộ icon đơn sắc dùng chung toàn app (Ionicons) — màu lấy từ theme. */
export type IconName = ComponentProps<typeof Ionicons>['name'];

export default Ionicons;
