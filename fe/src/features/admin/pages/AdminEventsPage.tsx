import { useLoaderData } from 'react-router-dom';
import { AdminEventsManager } from '../components/AdminEventsManager';
import { AdminPageHeader } from '../components/AdminPageHeader';
import type { adminEventsLoader } from '@/routes/adminLoaders';
export default function AdminEventsPage() {
  const { meta, data } = useLoaderData<typeof adminEventsLoader>();
  return (
    <section className="account-shell">
      <AdminPageHeader
        title="Quản lý sự kiện & banner"
        description="Quản lý lịch sự kiện và hình ảnh giới thiệu."
      />
      <AdminEventsManager initialEvents={data} meta={meta} />
    </section>
  );
}
