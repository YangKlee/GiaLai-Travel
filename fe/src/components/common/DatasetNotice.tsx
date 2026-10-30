import { FlaskConical } from 'lucide-react';
import type { Dataset } from '@/features/explore/types/catalog';

export function DatasetNotice({ dataset }: { dataset: Dataset }) {
  if (dataset !== 'demo') return null;
  return (
    <aside className="dataset-notice">
      <FlaskConical size={18} aria-hidden="true" />
      <p>
        <strong>Bản demo · Dữ liệu mẫu.</strong> Giá, thời lượng và nội dung chỉ để trải nghiệm,
        chưa dùng làm thông tin du lịch thực tế.
      </p>
    </aside>
  );
}
