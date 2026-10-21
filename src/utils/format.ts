const pad = (n: number) => String(n).padStart(2, '0');

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const DAY_MS = 24 * 60 * 60 * 1000;

/** Giờ dạng HH:mm. */
export function formatClock(ts: number): string {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Thời gian ngắn gọn cho danh sách: hôm nay → HH:mm, hôm qua, thứ trong tuần, hoặc dd/MM/yyyy. */
export function formatListTime(ts: number, now: number = Date.now()): string {
  const d = new Date(ts);
  const diffDays = Math.round(
    (startOfDay(new Date(now)) - startOfDay(d)) / DAY_MS,
  );

  if (diffDays <= 0) {
    return formatClock(ts);
  }
  if (diffDays === 1) {
    return 'Hôm qua';
  }
  if (diffDays < 7) {
    return WEEKDAYS[d.getDay()];
  }
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Thời gian tương đối: "Vừa xong", "5 phút trước", "2 giờ trước"... */
export function formatRelative(ts: number, now: number = Date.now()): string {
  const minutes = Math.floor((now - ts) / 60000);
  if (minutes < 1) {
    return 'Vừa xong';
  }
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} giờ trước`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ngày trước`;
  }
  return formatListTime(ts, now);
}

/** Chuẩn hoá chuỗi để tìm kiếm không phân biệt hoa thường và dấu tiếng Việt. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

export function matchesQuery(text: string, query: string): boolean {
  const q = normalizeText(query);
  return q.length === 0 || normalizeText(text).includes(q);
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

let idCounter = 0;
export function createId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}`;
}
