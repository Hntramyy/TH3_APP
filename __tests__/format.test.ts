import {
  formatListTime,
  formatRelative,
  getInitials,
  matchesQuery,
} from '../src/utils/format';

describe('matchesQuery', () => {
  it('bỏ qua dấu và hoa thường', () => {
    expect(matchesQuery('Trần Thị Bình', 'binh')).toBe(true);
    expect(matchesQuery('Đặng Ngọc Lan', 'dang ngoc')).toBe(true);
    expect(matchesQuery('Vũ Quang Huy', 'lan')).toBe(false);
  });

  it('chuỗi rỗng khớp mọi thứ', () => {
    expect(matchesQuery('bất kỳ', '   ')).toBe(true);
  });
});

describe('formatListTime', () => {
  const now = new Date(2026, 9, 21, 15, 0).getTime();

  it('hôm nay hiển thị giờ', () => {
    expect(formatListTime(new Date(2026, 9, 21, 9, 5).getTime(), now)).toBe(
      '09:05',
    );
  });

  it('hôm qua', () => {
    expect(formatListTime(new Date(2026, 9, 20, 23, 0).getTime(), now)).toBe(
      'Hôm qua',
    );
  });

  it('quá 7 ngày hiển thị ngày tháng', () => {
    expect(formatListTime(new Date(2026, 8, 1).getTime(), now)).toBe(
      '01/09/2026',
    );
  });
});

describe('formatRelative', () => {
  const now = Date.now();
  it('phút / giờ trước', () => {
    expect(formatRelative(now - 10 * 1000, now)).toBe('Vừa xong');
    expect(formatRelative(now - 5 * 60 * 1000, now)).toBe('5 phút trước');
    expect(formatRelative(now - 3 * 60 * 60 * 1000, now)).toBe('3 giờ trước');
    expect(formatRelative(now - 2 * 24 * 60 * 60 * 1000, now)).toBe(
      '2 ngày trước',
    );
  });
});

it('getInitials', () => {
  expect(getInitials('Nguyễn Văn An')).toBe('NA');
  expect(getInitials('Lan')).toBe('L');
});
