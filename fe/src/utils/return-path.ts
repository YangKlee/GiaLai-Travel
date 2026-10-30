import { APP_PATHS } from '@/constants/path';

export function safeReturnPath(value: string | null): string {
  if (!value?.startsWith('/') || value.startsWith('//')) return APP_PATHS.ACCOUNT;
  try {
    const url = new URL(value, 'https://gialai.invalid');
    if (
      url.origin !== 'https://gialai.invalid' ||
      [APP_PATHS.LOGIN, APP_PATHS.REGISTER].some((path) => path === url.pathname)
    )
      return APP_PATHS.ACCOUNT;
    return url.pathname + url.search + url.hash;
  } catch {
    return APP_PATHS.ACCOUNT;
  }
}
