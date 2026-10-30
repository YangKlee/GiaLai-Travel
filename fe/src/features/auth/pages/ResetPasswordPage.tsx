import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';
import { APP_PATHS } from '@/constants/path';
import { resetPassword } from '@/services/auth';
import { ApiError } from '@/services/api-error';
import { useAuthStore } from '@/store/useAuthStore';

export default function ResetPasswordPage() {
  const { token } = useLoaderData() as { token: string };
  const enabled = useAuthStore((state) => state.enabled);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const fieldError = (name: string) => error?.fields.find((field) => field.field === name)?.message;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !token) return;
    setPending(true);
    setError(null);
    try {
      await resetPassword({ token, password });
      setPassword('');
      await navigate(`${APP_PATHS.LOGIN}?reset=1`, { replace: true });
    } catch (failure) {
      setError(
        failure instanceof ApiError
          ? failure
          : new ApiError(0, 'UNKNOWN_ERROR', 'Chưa cập nhật được mật khẩu. Vui lòng thử lại.'),
      );
    } finally {
      setPending(false);
    }
  }

  if (!enabled) {
    return (
      <section className="empty-state">
        <h1>Tài khoản chưa khả dụng</h1>
        <p>Máy chủ hiện chưa mở tính năng tài khoản.</p>
        <Link to={APP_PATHS.EXPLORE}>Tiếp tục khám phá</Link>
      </section>
    );
  }

  if (!token) {
    return (
      <section className="empty-state">
        <h1>Liên kết khôi phục không hợp lệ</h1>
        <p>
          Liên kết đặt lại mật khẩu bị thiếu hoặc đã hết hiệu lực. Vui lòng yêu cầu gửi lại liên kết
          mới.
        </p>
        <Link to={APP_PATHS.FORGOT_PASSWORD} className={buttonVariants()}>
          Yêu cầu liên kết mới
        </Link>
      </section>
    );
  }

  return (
    <>
      <p className="eyebrow text-primary-hover">BẢO MẬT TÀI KHOẢN</p>
      <h1>Đặt lại mật khẩu</h1>
      <p className="muted auth-description">
        Nhập mật khẩu mới cho tài khoản. Tất cả phiên đăng nhập trước đó sẽ được thu hồi.
      </p>
      <form onSubmit={(event) => void submit(event)} className="auth-form">
        <div className="password-field">
          <Input
            label="Mật khẩu mới"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            name="password"
            required
            minLength={12}
            maxLength={128}
            value={password}
            hint="Dùng 12–128 ký tự. Bạn có thể dùng một cụm từ dễ nhớ."
            error={fieldError('password')}
            onChange={(event) => setPassword(event.target.value)}
            disabled={pending}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        {error ? (
          <div role="alert" className="form-error">
            <p>{error.message}</p>
            {error.requestId ? <small>Mã hỗ trợ: {error.requestId}</small> : null}
          </div>
        ) : null}
        <Button type="submit" loading={pending}>
          <KeyRound size={18} aria-hidden="true" />
          Cập nhật mật khẩu
        </Button>
      </form>
      <p className="auth-switch">
        Cần gửi lại liên kết? <Link to={APP_PATHS.FORGOT_PASSWORD}>Quên mật khẩu</Link>
      </p>
    </>
  );
}
