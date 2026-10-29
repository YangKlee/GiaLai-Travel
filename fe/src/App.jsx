import { useEffect, useState } from 'react';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export default function App() {
  const [status, setStatus] = useState('Đang kết nối backend…');

  useEffect(() => {
    const controller = new AbortController();
    async function checkHealth() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/health`, { signal: controller.signal });
        if (!response.ok) throw new Error('API unavailable');
        const data = await response.json();
        if (data.status !== 'ok') throw new Error('API unhealthy');
        setStatus('Backend đã kết nối');
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('Chưa kết nối được backend. Hãy kiểm tra máy chủ API.');
      }
    }
    checkHealth();
    return () => controller.abort();
  }, []);

  return (
    <main>
      <p className="eyebrow">GIALAI TRAVEL</p>
      <h1>Khởi đầu hành trình khám phá Gia Lai</h1>
      <p>Nền tảng React đã sẵn sàng để phát triển.</p>
      <p className="status" role="status">{status}</p>
    </main>
  );
}
