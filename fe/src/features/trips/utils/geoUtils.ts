import type { Place } from '@/features/explore/types/catalog';

/**
 * Trích xuất tọa độ từ chuỗi văn bản (ví dụ "13.9833, 108.0000" hoặc Google Maps URL)
 */
export function parseCoordinatesOrGoogleMapsUrl(
  input: string,
): { lat: number; lon: number } | null {
  if (!input) return null;
  const trimmed = input.trim();

  // 1. Google Maps URL (@lat,lon, or ?q=lat,lon, or ?ll=lat,lon)
  const urlMatch =
    trimmed.match(/@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/) ||
    trimmed.match(/[?&](?:q|ll)=(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/);
  if (urlMatch) {
    const lat = Number(urlMatch[1]);
    const lon = Number(urlMatch[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      return { lat, lon };
    }
  }

  // 2. Tọa độ số dạng "13.9833, 108.0000" hoặc "13.9833 108.0000"
  const coordMatch = trimmed.match(/^(-?\d{1,2}\.\d+)\s*[,;\s]\s*(-?\d{1,3}\.\d+)$/);
  if (coordMatch) {
    const lat = Number(coordMatch[1]);
    const lon = Number(coordMatch[2]);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      return { lat, lon };
    }
  }

  return null;
}

/**
 * Suy ra tên địa chỉ hoặc địa điểm gần nhất từ tọa độ vĩ độ/kinh độ
 */
export async function deduceAddressFromCoords(
  lat: number,
  lon: number,
  availablePlaces: Place[] = [],
): Promise<string> {
  // 1. Kiểm tra địa điểm gần nhất trong kho Gia Lai (< 400m)
  let nearest: { place: Place; dist: number } | null = null;
  for (const p of availablePlaces) {
    if (p.latitude === null || p.longitude === null) continue;
    const dLat = (p.latitude - lat) * 111000;
    const dLon = (p.longitude - lon) * 111000 * Math.cos((lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    if (dist < 400) {
      if (!nearest || dist < nearest.dist) {
        nearest = { place: p, dist };
      }
    }
  }
  if (nearest) {
    if (nearest.dist < 60) return nearest.place.title;
    return `Gần ${nearest.place.title} (khoảng ${Math.round(nearest.dist)}m)`;
  }

  // 2. Gọi OpenStreetMap Nominatim reverse geocode
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=17&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'vi,en' },
      },
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data?.display_name) {
        const addr = data.address || {};
        const road = addr.road || addr.suburb || addr.quarter || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.county || 'Pleiku, Gia Lai';
        if (road) return `${road}, ${city}`;
        const parts = (data.display_name as string).split(',').map((s) => s.trim());
        return parts.slice(0, 3).join(', ');
      }
    }
  } catch {
    // offline / timeout
  }

  return `Vị trí tại tọa độ ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}
