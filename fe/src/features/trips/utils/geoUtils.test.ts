import { describe, expect, it } from 'vitest';
import { deduceAddressFromCoords, parseCoordinatesOrGoogleMapsUrl } from './geoUtils';
import type { Place } from '@/features/explore/types/catalog';

describe('geoUtils', () => {
  describe('parseCoordinatesOrGoogleMapsUrl', () => {
    it('trích xuất tọa độ từ chuỗi dạng "lat, lon"', () => {
      const res = parseCoordinatesOrGoogleMapsUrl('13.9833, 108.0000');
      expect(res).toEqual({ lat: 13.9833, lon: 108.0 });
    });

    it('trích xuất tọa độ từ URL Google Maps chứa @lat,lon', () => {
      const res = parseCoordinatesOrGoogleMapsUrl(
        'https://www.google.com/maps/@13.9833,108.0000,16z/data=!3m1!4b1',
      );
      expect(res).toEqual({ lat: 13.9833, lon: 108.0 });
    });

    it('trích xuất tọa độ từ URL Google Maps chứa ?q=lat,lon', () => {
      const res = parseCoordinatesOrGoogleMapsUrl('https://maps.google.com/?q=14.0462,108.0002');
      expect(res).toEqual({ lat: 14.0462, lon: 108.0002 });
    });

    it('trả về null nếu không phải tọa độ hay link bản đồ hợp lệ', () => {
      expect(parseCoordinatesOrGoogleMapsUrl('Khách sạn Pleiku')).toBeNull();
      expect(parseCoordinatesOrGoogleMapsUrl('')).toBeNull();
    });
  });

  describe('deduceAddressFromCoords', () => {
    const mockPlaces: Place[] = [
      {
        id: 'place-1',
        title: 'Quảng trường Đại Đoàn Kết',
        description: 'Trung tâm Pleiku',
        category: 'CULTURE',
        region: { id: 'reg-1', name: 'TP. Pleiku' },
        latitude: 13.9833,
        longitude: 108.0,
        referencePriceVnd: null,
        typicalDurationMinutes: 60,
        sourceReference: null,
        updatedAt: '2026-10-30T00:00:00Z',
      },
    ];

    it('nhận diện địa điểm gần nhất trong kho Gia Lai nếu khoảng cách < 60m', async () => {
      const address = await deduceAddressFromCoords(13.9833, 108.0, mockPlaces);
      expect(address).toBe('Quảng trường Đại Đoàn Kết');
    });

    it('suy ra địa chỉ dạng "Gần [Tên]" nếu khoảng cách từ 60m đến 400m', async () => {
      const address = await deduceAddressFromCoords(13.9845, 108.001, mockPlaces);
      expect(address).toContain('Gần Quảng trường Đại Đoàn Kết');
    });

    it('trả về nhãn tọa độ mặc định nếu không có điểm nào gần và không có mạng', async () => {
      const address = await deduceAddressFromCoords(10.0, 105.0, []);
      expect(address).toContain('10.0000');
      expect(address).toContain('105.0000');
    });
  });
});
