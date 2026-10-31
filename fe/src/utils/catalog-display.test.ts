import { expect, it } from 'vitest';
import { catalogImageUrl } from './catalog-image';
import { eventStatusLabel } from './event-status';

it('suppresses seeded stock photos and preserves separately supplied images', () => {
  expect(
    catalogImageUrl('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300'),
  ).toBeNull();
  expect(catalogImageUrl('/uploads/bien-ho.jpg')).toBe('/uploads/bien-ho.jpg');
  expect(catalogImageUrl('javascript:alert(1)')).toBeNull();
});

it('distinguishes upcoming, ongoing, ended and cancelled events across timezones', () => {
  const event = {
    eventStatus: 'SCHEDULED' as const,
    startsAt: '2026-10-31T08:00:00+07:00',
    endsAt: '2026-10-31T10:00:00+07:00',
  };
  expect(eventStatusLabel(event, Date.parse('2026-10-31T00:00:00Z'))).toBe('Sắp diễn ra');
  expect(eventStatusLabel(event, Date.parse('2026-10-31T02:00:00Z'))).toBe('Đang diễn ra');
  expect(eventStatusLabel(event, Date.parse('2026-10-31T03:00:00Z'))).toBe('Đã kết thúc');
  expect(eventStatusLabel({ ...event, eventStatus: 'CANCELLED' })).toBe('Đã hủy / tạm hoãn');
});
