import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow text-primary-hover">QUẢN TRỊ</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <Badge>
        <ShieldCheck size={14} aria-hidden="true" /> Quản trị viên
      </Badge>
    </div>
  );
}
