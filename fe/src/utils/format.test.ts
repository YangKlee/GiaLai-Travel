import { expect, it } from 'vitest';
import { formatVnd, safeHttpUrl } from './format';

it('giữ chính xác tiền vượt giới hạn Number và phân biệt null với 0', () => {
  expect(formatVnd('9007199254740993')).toBe('9.007.199.254.740.993 ₫');
  expect(formatVnd(null)).toBe('Chưa có giá tham khảo');
  expect(formatVnd('0')).toBe('0 ₫');
});

it('chỉ mở nguồn HTTP(S), từ chối script và URL tương đối', () => {
  expect(safeHttpUrl('javascript:alert(1)')).toBeNull();
  expect(safeHttpUrl('/private')).toBeNull();
  expect(safeHttpUrl('https://example.test/source')).toBe('https://example.test/source');
});
