import { Link, isRouteErrorResponse, useRouteError, useRevalidator } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import { APP_PATHS } from '@/constants/path';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';
import { ApiError } from '@/services/api';

const fieldLabels: Record<string, string> = {
  q: 'Tên địa điểm',
  category: 'Loại địa điểm',
  regionId: 'Khu vực',
  minPrice: 'Giá tối thiểu',
  maxPrice: 'Giá tối đa',
  page: 'Trang',
  pageSize: 'Số kết quả mỗi trang',
  sort: 'Sắp xếp',
  id: 'Địa điểm',
};

function ErrorState({
  code,
  title,
  description,
}: {
  code: string;
  title: string;
  description: string;
}) {
  return (
    <section className="empty-state error-state">
      <CircleAlert size={40} aria-hidden="true" />
      <p className="eyebrow">{code}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className={buttonVariants()} to={APP_PATHS.EXPLORE}>
        Về trang khám phá
      </Link>
    </section>
  );
}

export function UnauthorizedPage() {
  return (
    <ErrorState
      code="401"
      title="Bạn cần đăng nhập"
      description="Tính năng tài khoản sẽ được mở trong mốc phát triển tiếp theo."
    />
  );
}
export function ForbiddenPage() {
  return (
    <ErrorState
      code="403"
      title="Khu vực chưa khả dụng"
      description="Khu vực quản trị chưa được mở trong bản demo này."
    />
  );
}
export function NotFoundPage() {
  return (
    <ErrorState
      code="404"
      title="Chưa tìm thấy trang này"
      description="Liên kết có thể đã thay đổi. Hãy chọn một điểm đến khác."
    />
  );
}
export function ServerErrorPage() {
  const error: unknown = useRouteError();
  const revalidator = useRevalidator();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;
  if (error instanceof ApiError && error.status === 404) return <NotFoundPage />;
  const invalidFilter = error instanceof ApiError && error.status === 422;
  return (
    <section className="empty-state error-state" role="alert">
      <CircleAlert size={40} aria-hidden="true" />
      <h1>{invalidFilter ? 'Bộ lọc chưa hợp lệ' : 'Chưa tải được nội dung'}</h1>
      <p>{error instanceof ApiError ? error.message : 'Hãy kiểm tra kết nối và thử lại.'}</p>
      {error instanceof ApiError && error.fields.length ? (
        <ul>
          {error.fields.map((field, index) => (
            <li key={`${field.field}-${index}`}>
              {fieldLabels[field.field] ?? 'Bộ lọc'}: {field.message}
            </li>
          ))}
        </ul>
      ) : null}
      <Button
        loading={revalidator.state === 'loading'}
        onClick={() => void revalidator.revalidate()}
      >
        Thử lại
      </Button>
      <Link className={buttonVariants({ variant: 'secondary' })} to={APP_PATHS.EXPLORE}>
        {invalidFilter ? 'Xóa bộ lọc và khám phá lại' : 'Về trang khám phá'}
      </Link>
      {error instanceof ApiError && error.requestId ? (
        <p className="muted">Mã hỗ trợ: {error.requestId}</p>
      ) : null}
    </section>
  );
}
