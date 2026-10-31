import type { EventItem } from '@/features/explore/types/catalog';

export function eventStatusLabel(
  event: Pick<EventItem, 'eventStatus' | 'startsAt' | 'endsAt'>,
  now = Date.now(),
): string {
  if (event.eventStatus === 'CANCELLED') return 'Đã hủy / tạm hoãn';
  if (event.eventStatus === 'COMPLETED' || Date.parse(event.endsAt) <= now) return 'Đã kết thúc';
  return Date.parse(event.startsAt) <= now ? 'Đang diễn ra' : 'Sắp diễn ra';
}
