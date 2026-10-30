import { expect, it } from 'vitest';
import { APP_PATHS } from '@/constants/path';
import { safeReturnPath } from './return-path';

it('return URL stays on this app and avoids auth loops', () => {
  for (const value of [
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
    'javascript:alert(1)',
    APP_PATHS.LOGIN,
    APP_PATHS.REGISTER,
  ])
    expect(safeReturnPath(value)).toBe(APP_PATHS.ACCOUNT);
  expect(safeReturnPath(APP_PATHS.TRIPS)).toBe(APP_PATHS.TRIPS);
  expect(safeReturnPath(`${APP_PATHS.EXPLORE}?category=NATURE`)).toBe(
    `${APP_PATHS.EXPLORE}?category=NATURE`,
  );
});
