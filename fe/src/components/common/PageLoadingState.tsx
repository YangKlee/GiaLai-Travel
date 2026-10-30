import { LoaderCircle } from 'lucide-react';

export function PageLoadingState() {
  return <div className="empty-state" role="status"><LoaderCircle className="animate-spin" aria-hidden="true" />Đang tải hành trình…</div>;
}
