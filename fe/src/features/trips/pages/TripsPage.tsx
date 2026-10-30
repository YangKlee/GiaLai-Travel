import { Link } from 'react-router-dom';
import { MapPinned } from 'lucide-react';
import { APP_PATHS } from '@/constants/path';
import { buttonVariants } from '@/components/ui/button-variants';

export default function TripsPage() {
  return <section className="empty-state"><MapPinned size={40} aria-hidden="true" /><h1>Hành trình bắt đầu từ một điểm đến</h1><p>Khám phá và chọn những nơi bạn muốn ghé thăm.</p><Link className={buttonVariants()} to={APP_PATHS.EXPLORE}>Khám phá địa điểm</Link></section>;
}
