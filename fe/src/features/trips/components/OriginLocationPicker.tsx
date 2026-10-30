import { useEffect, useRef, useState } from 'react';
import type { Place } from '@/features/explore/types/catalog';
import {
  Check,
  Compass,
  ExternalLink,
  Layers,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import 'leaflet/dist/leaflet.css';

interface OriginLocationPickerProps {
  label: string;
  latitude: string;
  longitude: string;
  onChange: (update: { label: string; latitude: string; longitude: string }) => void;
  availablePlaces?: Place[];
}

interface SearchResult {
  label: string;
  lat: number;
  lon: number;
  source: 'catalog' | 'nominatim' | 'coords';
}

type MapTileLayerType = 'google-roadmap' | 'google-hybrid' | 'osm';

/**
 * Trích xuất tọa độ từ chuỗi văn bản (ví dụ "13.9833, 108.0000" hoặc Google Maps URL)
 */
export function parseCoordinatesOrGoogleMapsUrl(input: string): { lat: number; lon: number } | null {
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

export function OriginLocationPicker({
  label,
  latitude,
  longitude,
  onChange,
  availablePlaces = [],
}: OriginLocationPickerProps) {
  const [showMap, setShowMap] = useState(false);
  const [mapLayer, setMapLayer] = useState<MapTileLayerType>('google-roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [reverseGeocoding, setReverseGeocoding] = useState(false);
  const [pickerStatus, setPickerStatus] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null);

  const currentLat = Number(latitude) || 13.9833;
  const currentLon = Number(longitude) || 108.0;

  // Lấy link mở trực tiếp trên Google Maps
  const googleMapsUrl = `https://www.google.com/maps?q=${currentLat},${currentLon}`;

  // Reverse geocoding: Suy ra tên địa chỉ từ tọa độ
  async function deduceAddressFromCoords(lat: number, lon: number): Promise<string> {
    // 1. Kiểm tra địa điểm gần nhất trong kho Gia Lai (< 300m)
    let nearest: { place: Place; dist: number } | null = null;
    for (const p of availablePlaces) {
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

  // Khởi tạo và đồng bộ Leaflet map
  useEffect(() => {
    if (!showMap || !mapContainerRef.current) return;

    let isSubscribed = true;

    async function initMap() {
      try {
        const L = await import('leaflet');
        if (!isSubscribed || !mapContainerRef.current) return;

        // Nếu bản đồ đã tồn tại, chỉ cần invalidateSize và flyTo
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
          leafletMapRef.current.setView([currentLat, currentLon], 14);
          if (markerRef.current) {
            markerRef.current.setLatLng([currentLat, currentLon]);
          }
          return;
        }

        const map = L.map(mapContainerRef.current, {
          center: [currentLat, currentLon],
          zoom: 14,
          attributionControl: false,
        });
        leafletMapRef.current = map;

        const tileUrls: Record<MapTileLayerType, string> = {
          'google-roadmap': 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          'google-hybrid': 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        };

        const tileLayer = L.tileLayer(tileUrls[mapLayer], {
          maxZoom: 20,
          subdomains: mapLayer === 'osm' ? ['a', 'b', 'c'] : ['mt0', 'mt1', 'mt2', 'mt3'],
        }).addTo(map);
        tileLayerRef.current = tileLayer;

        // Custom Pin SVG Icon
        const pinIcon = L.divIcon({
          className: 'origin-marker-pin',
          html: `
            <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: grab;">
              <div style="background: #ef4444; color: white; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.35); border: 2px solid #ffffff;">
                <span style="transform: rotate(45deg); font-size: 16px;">🚩</span>
              </div>
              <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; margin-top: -2px;"></div>
            </div>
          `,
          iconSize: [34, 40],
          iconAnchor: [17, 38],
        });

        const marker = L.marker([currentLat, currentLon], {
          draggable: true,
          icon: pinIcon,
        }).addTo(map);
        markerRef.current = marker;

        // Click trên bản đồ để chọn tọa độ mới
        map.on('click', async (e: { latlng: { lat: number; lng: number } }) => {
          const newLat = Number(e.latlng.lat.toFixed(6));
          const newLon = Number(e.latlng.lng.toFixed(6));
          marker.setLatLng([newLat, newLon]);
          setReverseGeocoding(true);
          setPickerStatus(`Đang suy ra địa chỉ cho ${newLat}, ${newLon}...`);
          try {
            const newLabel = await deduceAddressFromCoords(newLat, newLon);
            onChange({
              label: newLabel,
              latitude: String(newLat),
              longitude: String(newLon),
            });
            setPickerStatus(`Đã chọn: ${newLabel}`);
          } finally {
            setReverseGeocoding(false);
          }
        });

        // Kéo thả marker
        marker.on('dragend', async () => {
          const pos = marker.getLatLng();
          const newLat = Number(pos.lat.toFixed(6));
          const newLon = Number(pos.lng.toFixed(6));
          setReverseGeocoding(true);
          setPickerStatus(`Đang suy ra địa chỉ cho ${newLat}, ${newLon}...`);
          try {
            const newLabel = await deduceAddressFromCoords(newLat, newLon);
            onChange({
              label: newLabel,
              latitude: String(newLat),
              longitude: String(newLon),
            });
            setPickerStatus(`Đã ghim: ${newLabel}`);
          } finally {
            setReverseGeocoding(false);
          }
        });

        // Đảm bảo kích thước hiển thị đúng sau khi modal/div mở
        setTimeout(() => {
          map.invalidateSize();
        }, 150);
      } catch (err) {
        // Trong môi trường jsdom / test không có canvas/DOM đầy đủ
        console.warn('Map initialization skipped in test environment', err);
      }
    }

    void initMap();

    return () => {
      isSubscribed = false;
    };
  }, [showMap]);

  // Cập nhật vị trí marker khi latitude / longitude thay đổi từ bên ngoài (ví dụ gõ phím hoặc chọn search)
  useEffect(() => {
    if (leafletMapRef.current && markerRef.current) {
      const lat = Number(latitude);
      const lon = Number(longitude);
      if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        markerRef.current.setLatLng([lat, lon]);
        leafletMapRef.current.panTo([lat, lon]);
      }
    }
  }, [latitude, longitude]);

  // Đổi tile layer (Google Maps / OSM)
  async function handleChangeMapLayer(layer: MapTileLayerType) {
    setMapLayer(layer);
    if (!leafletMapRef.current || !tileLayerRef.current) return;
    try {
      const L = await import('leaflet');
      leafletMapRef.current.removeLayer(tileLayerRef.current);
      const tileUrls: Record<MapTileLayerType, string> = {
        'google-roadmap': 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        'google-hybrid': 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      };
      tileLayerRef.current = L.tileLayer(tileUrls[layer], {
        maxZoom: 20,
        subdomains: layer === 'osm' ? ['a', 'b', 'c'] : ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(leafletMapRef.current);
    } catch {
      // ignore
    }
  }

  // Tìm kiếm địa điểm hoặc suy ra tọa độ từ chuỗi nhập
  async function handleSearch(queryText: string) {
    const q = queryText.trim();
    if (!q) {
      setSearchResults([]);
      setShowResultsDropdown(false);
      return;
    }

    // 1. Kiểm tra nếu người dùng dán tọa độ hoặc link Google Maps
    const parsedCoords = parseCoordinatesOrGoogleMapsUrl(q);
    if (parsedCoords) {
      const result: SearchResult = {
        label: `Tọa độ trích xuất: ${parsedCoords.lat.toFixed(6)}, ${parsedCoords.lon.toFixed(6)}`,
        lat: parsedCoords.lat,
        lon: parsedCoords.lon,
        source: 'coords',
      };
      setSearchResults([result]);
      setShowResultsDropdown(true);
      return;
    }

    setSearching(true);
    const results: SearchResult[] = [];
    const cleanQ = q.toLowerCase();

    // 2. Tìm kiếm trong danh mục địa điểm Gia Lai (55 địa điểm)
    for (const p of availablePlaces) {
      const matchTitle = p.title.toLowerCase().includes(cleanQ);
      const matchAddress = p.address?.toLowerCase().includes(cleanQ);
      const matchRegion = p.region?.name?.toLowerCase().includes(cleanQ);
      if (matchTitle || matchAddress || matchRegion) {
        results.push({
          label: `${p.title}${p.address ? ` (${p.address})` : ''}`,
          lat: p.latitude,
          lon: p.longitude,
          source: 'catalog',
        });
        if (results.length >= 5) break;
      }
    }

    // 3. Tìm kiếm mở rộng qua Geocoding (Nominatim OpenStreetMap)
    if (results.length < 5 && q.length >= 3) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const searchQueryStr =
          cleanQ.includes('gia lai') || cleanQ.includes('pleiku') ? cleanQ : `${cleanQ}, Gia Lai`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQueryStr,
          )}&countrycodes=vn&limit=4`,
          {
            signal: controller.signal,
            headers: { 'Accept-Language': 'vi,en' },
          },
        );
        clearTimeout(timeout);
        if (res.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const items: any[] = await res.json();
          for (const item of items) {
            const lat = Number(item.lat);
            const lon = Number(item.lon);
            if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
              const isDuplicate = results.some(
                (r) => Math.abs(r.lat - lat) < 0.0005 && Math.abs(r.lon - lon) < 0.0005,
              );
              if (!isDuplicate) {
                const shortLabel = (item.display_name as string)
                  .split(',')
                  .slice(0, 3)
                  .join(', ')
                  .trim();
                results.push({
                  label: shortLabel,
                  lat,
                  lon,
                  source: 'nominatim',
                });
              }
            }
          }
        }
      } catch {
        // network / timeout error silently ignored
      }
    }

    setSearchResults(results);
    setShowResultsDropdown(results.length > 0);
    setSearching(false);
  }

  // Chọn 1 kết quả từ danh sách tìm kiếm
  function handleSelectSearchResult(result: SearchResult) {
    onChange({
      label: result.label,
      latitude: String(result.lat),
      longitude: String(result.lon),
    });
    setSearchQuery('');
    setShowResultsDropdown(false);
    setPickerStatus(`Đã suy ra tọa độ: ${result.lat}, ${result.lon}`);

    if (leafletMapRef.current && markerRef.current) {
      markerRef.current.setLatLng([result.lat, result.lon]);
      leafletMapRef.current.flyTo([result.lat, result.lon], 15);
    }
  }

  // Lấy vị trí GPS hiện tại của thiết bị
  function handleGetCurrentLocationGps() {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }
    setLocatingGps(true);
    setPickerStatus('Đang định vị GPS thiết bị của bạn...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lon = Number(pos.coords.longitude.toFixed(6));
        setLocatingGps(false);
        const deducedLabel = await deduceAddressFromCoords(lat, lon);
        onChange({
          label: deducedLabel || 'Vị trí hiện tại của tôi (GPS)',
          latitude: String(lat),
          longitude: String(lon),
        });
        setPickerStatus(`Đã lấy vị trí GPS: ${lat}, ${lon}`);

        if (leafletMapRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lon]);
          leafletMapRef.current.flyTo([lat, lon], 15);
        }
      },
      (error) => {
        setLocatingGps(false);
        setPickerStatus(`Không thể lấy GPS: ${error.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }

  return (
    <div className="origin-picker-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Search & Address Input */}
      <div>
        <label htmlFor="ai-origin-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          5. Điểm xuất phát (Tìm kiếm địa chỉ hoặc chọn trực tiếp trên Google Maps)
        </label>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                id="ai-origin-label"
                type="text"
                value={label}
                onChange={(e) => {
                  const val = e.target.value;
                  // Tự động kiểm tra nếu dán tọa độ hoặc link Google Maps
                  const parsed = parseCoordinatesOrGoogleMapsUrl(val);
                  if (parsed) {
                    onChange({
                      label: `Vị trí tọa độ (${parsed.lat}, ${parsed.lon})`,
                      latitude: String(parsed.lat),
                      longitude: String(parsed.lon),
                    });
                    setPickerStatus(`Đã tự động suy ra tọa độ từ liên kết: ${parsed.lat}, ${parsed.lon}`);
                  } else {
                    onChange({ label: val, latitude, longitude });
                  }
                }}
                placeholder="Nhập địa chỉ, khách sạn, hoặc dán link Google Maps / tọa độ..."
                style={{ width: '100%', paddingRight: '32px' }}
              />
              {label && (
                <button
                  type="button"
                  aria-label="Xóa điểm xuất phát"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted, #94a3b8)',
                  }}
                  onClick={() => onChange({ label: '', latitude, longitude })}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant={showMap ? 'primary' : 'secondary'}
              onClick={() => setShowMap((prev) => !prev)}
              title="Mở bản đồ trực quan để chọn vị trí và lấy tọa độ"
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <MapIcon size={16} aria-hidden="true" />
              {showMap ? 'Đóng bản đồ' : 'Chọn trên bản đồ'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              loading={locatingGps}
              onClick={handleGetCurrentLocationGps}
              title="Lấy tọa độ vị trí thực tế của bạn bằng GPS"
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <LocateFixed size={16} aria-hidden="true" />
              GPS
            </Button>
          </div>
        </div>
      </div>

      {/* Tìm kiếm & Suy ra tọa độ (Search to Deduce Coordinates) */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              aria-label="Tìm kiếm địa điểm hoặc địa chỉ để suy ra tọa độ"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                void handleSearch(e.target.value);
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowResultsDropdown(true);
              }}
              placeholder="🔍 Tìm kiếm địa điểm ở Gia Lai hoặc địa chỉ để tự động suy ra tọa độ..."
              style={{
                width: '100%',
                fontSize: '0.86rem',
                padding: '6px 12px 6px 32px',
                borderRadius: '6px',
                border: '1px dashed var(--color-border, #cbd5e1)',
              }}
            />
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted, #94a3b8)',
              }}
            />
            {searching && (
              <span
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted, #94a3b8)',
                }}
              >
                Đang tìm...
              </span>
            )}
          </div>
        </div>

        {/* Dropdown kết quả tìm kiếm & suy ra tọa độ */}
        {showResultsDropdown && searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              background: 'var(--color-surface, #ffffff)',
              border: '1px solid var(--color-border, #e2e8f0)',
              borderRadius: '8px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              maxHeight: '230px',
              overflowY: 'auto',
              marginTop: '4px',
            }}
          >
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                type="button"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: 'none',
                  borderBottom: '1px solid var(--color-border-subtle, #f1f5f9)',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                }}
                onClick={() => handleSelectSearchResult(res)}
              >
                <MapPin size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div>{res.label}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted, #64748b)' }}>
                    Tọa độ: {res.lat.toFixed(6)}, {res.lon.toFixed(6)} ·{' '}
                    {res.source === 'catalog'
                      ? 'Điểm đến Gia Lai'
                      : res.source === 'coords'
                        ? 'Tọa độ trích xuất'
                        : 'Địa chỉ tìm thấy'}
                  </div>
                </div>
                <Check size={14} style={{ color: 'var(--color-primary, #059669)' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hiển thị tọa độ đã suy ra + Link Google Maps */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: '0.85rem',
          marginTop: '2px',
        }}
      >
        <span style={{ color: 'var(--color-text-muted, #64748b)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Compass size={14} /> Tọa độ xuất phát:
        </span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            aria-label="Vĩ độ xuất phát"
            type="text"
            value={latitude}
            onChange={(e) => onChange({ label, latitude: e.target.value, longitude })}
            placeholder="Vĩ độ (Lat)"
            style={{ width: '110px', padding: '4px 8px', fontSize: '0.82rem', borderRadius: '4px' }}
          />
          <input
            aria-label="Kinh độ xuất phát"
            type="text"
            value={longitude}
            onChange={(e) => onChange({ label, latitude, longitude: e.target.value })}
            placeholder="Kinh độ (Lon)"
            style={{ width: '110px', padding: '4px 8px', fontSize: '0.82rem', borderRadius: '4px' }}
          />
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Mở tọa độ xuất phát này trên Google Maps để xem vị trí thực tế"
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem',
            color: 'var(--color-primary, #059669)',
            textDecoration: 'none',
          }}
        >
          <span>Xem trên Google Maps</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {pickerStatus && (
        <div style={{ fontSize: '0.78rem', color: 'var(--color-primary, #059669)', fontStyle: 'italic' }}>
          {pickerStatus}
        </div>
      )}

      {/* BẢN ĐỒ TƯƠNG TÁC ĐỂ CHỌN VỊ TRÍ & SUY RA TỌA ĐỘ (Interactive Leaflet Map with Google Maps / OSM tiles) */}
      {showMap && (
        <div
          style={{
            marginTop: '8px',
            border: '1px solid var(--color-border, #cbd5e1)',
            borderRadius: '10px',
            overflow: 'hidden',
            background: 'var(--color-surface, #ffffff)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header thanh công cụ bản đồ */}
          <div
            style={{
              padding: '8px 12px',
              background: 'var(--color-background-soft, #f8fafc)',
              borderBottom: '1px solid var(--color-border, #e2e8f0)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
              <MapPin size={16} style={{ color: '#ef4444' }} />
              <span>Chạm / Nhấp chuột hoặc kéo ghim để chọn tọa độ xuất phát</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} style={{ color: 'var(--color-text-muted, #64748b)' }} />
              <button
                type="button"
                className={`preference-chip ${mapLayer === 'google-roadmap' ? 'selected' : ''}`}
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => void handleChangeMapLayer('google-roadmap')}
              >
                Google Maps
              </button>
              <button
                type="button"
                className={`preference-chip ${mapLayer === 'google-hybrid' ? 'selected' : ''}`}
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => void handleChangeMapLayer('google-hybrid')}
              >
                Vệ tinh
              </button>
              <button
                type="button"
                className={`preference-chip ${mapLayer === 'osm' ? 'selected' : ''}`}
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                onClick={() => void handleChangeMapLayer('osm')}
              >
                OpenStreetMap
              </button>
            </div>
          </div>

          {/* Vùng hiển thị bản đồ */}
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '300px',
              position: 'relative',
              cursor: 'crosshair',
            }}
          />

          <div
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted, #64748b)',
              background: 'var(--color-background-soft, #f8fafc)',
              borderTop: '1px solid var(--color-border, #e2e8f0)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              Tọa độ hiện tại: <strong>{currentLat.toFixed(6)}</strong>, <strong>{currentLon.toFixed(6)}</strong>
              {reverseGeocoding && ' (Đang suy ra địa chỉ...)'}
            </span>
            <span>Kéo ghim hoặc click để di chuyển điểm xuất phát</span>
          </div>
        </div>
      )}
    </div>
  );
}
