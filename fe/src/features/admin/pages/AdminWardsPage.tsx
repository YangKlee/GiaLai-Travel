import { useLoaderData } from 'react-router-dom';
import { AdminWardsManager } from '../components/AdminWardsManager';
import { AdminPageHeader } from '../components/AdminPageHeader';
import type { adminWardsLoader } from '@/routes/adminLoaders';

export default function AdminWardsPage() {
  const { meta, data } = useLoaderData<typeof adminWardsLoader>();
  return (
    <section className="account-shell">
      <AdminPageHeader
        title="Quản lý Phường / Xã"
        description="Quản lý danh mục đơn vị hành chính cấp xã, phường, thị trấn theo phương án sáp nhập mới nhất."
      />
      <AdminWardsManager initialWards={data} meta={meta} />
    </section>
  );
}

