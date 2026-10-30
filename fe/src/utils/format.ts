export function formatVnd(value: string | null): string {
  return value === null
    ? 'Chưa có giá tham khảo'
    : `${new Intl.NumberFormat('vi-VN').format(BigInt(value))} ₫`;
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null) return 'Chưa có thời lượng';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return [hours ? `${hours} giờ` : '', rest ? `${rest} phút` : ''].filter(Boolean).join(' ');
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value));
}

export function safeHttpUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
