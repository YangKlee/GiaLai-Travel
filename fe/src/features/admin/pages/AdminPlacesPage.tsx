import { useLoaderData } from 'react-router-dom';
import { AdminPlacesManager } from '../components/AdminPlacesManager';
import { AdminPageHeader } from '../components/AdminPageHeader';
import type { adminPlacesLoader } from '@/routes/adminLoaders';
export default function AdminPlacesPage() {
  const { meta, data } = useLoaderData<typeof adminPlacesLoader>();
  return (
    <section className="account-shell">
      <AdminPageHeader
        title="Quản lý địa điểm"
        description="Thêm, chỉnh sửa và quản lý các điểm đến du lịch."
      />
      <AdminPlacesManager initialPlaces={data} meta={meta} />
    </section>
  );
}
