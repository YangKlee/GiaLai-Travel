import { Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function NetworkStatusBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (!isOnline) {
    return (
      <aside
        role="status"
        aria-live="polite"
        className="network-banner network-banner-offline"
        style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderBottom: '1px solid #fde68a',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        <WifiOff size={16} aria-hidden="true" />
        <span>
          Mất kết nối Internet. Đang hoạt động ở chế độ <strong>Ngoại tuyến (Chỉ đọc)</strong> cho
          các chuyến đi đã tải.
        </span>
      </aside>
    );
  }

  if (wasOffline) {
    return (
      <aside
        role="status"
        aria-live="polite"
        className="network-banner network-banner-online"
        style={{
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderBottom: '1px solid #bbf7d0',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        <Wifi size={16} aria-hidden="true" />
        <span>Đã khôi phục kết nối Internet.</span>
      </aside>
    );
  }

  return null;
}
