import { Link, isRouteErrorResponse, useRouteError, useRevalidator } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import { APP_PATHS } from '@/constants/path';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';

function ErrorState({ code, title, description }: { code: string; title: string; description: string }) {
  return <section className="empty-state error-state"><CircleAlert size={40} aria-hidden="true" /><p className="eyebrow">{code}</p><h1>{title}</h1><p>{description}</p><Link className={buttonVariants()} to={APP_PATHS.EXPLORE}>Về trang khám phá</Link></section>;
}

export function UnauthorizedPage() { return <ErrorState code="401" title="Bạn cần đăng nhập" description="Tính năng tài khoản sẽ được mở trong mốc phát triển tiếp theo." />; }
export function ForbiddenPage() { return <ErrorState code="403" title="Khu vực chưa khả dụng" description="Khu vực quản trị chưa được mở trong bản demo này." />; }
export function NotFoundPage() { return <ErrorState code="404" title="Chưa tìm thấy trang này" description="Liên kết có thể đã thay đổi. Hãy chọn một điểm đến khác." />; }
export function ServerErrorPage() {
  const error: unknown = useRouteError();
  const revalidator = useRevalidator();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;
  return <section className="empty-state error-state"><CircleAlert size={40} aria-hidden="true" /><h1>Chưa tải được nội dung</h1><p>Hãy kiểm tra kết nối và thử lại.</p><Button loading={revalidator.state === 'loading'} onClick={() => void revalidator.revalidate()}>Thử lại</Button><Link to={APP_PATHS.EXPLORE}>Về trang khám phá</Link></section>;
}
