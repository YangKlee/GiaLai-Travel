import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { APP_PATHS } from '@/constants/path';
import { login, register } from '@/services/auth';
import { ApiError } from '@/services/api-error';
import { useAuthStore } from '@/store/useAuthStore';
import { safeReturnPath } from '@/utils/return-path';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const registering = mode === 'register';
  const enabled = useAuthStore((state) => state.enabled);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({ displayName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const fieldError = (name: string) => error?.fields.find((field) => field.field === name)?.message;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      if (registering) {
        await register(values);
        setValues({ displayName: '', email: '', password: '' });
        await navigate(`${APP_PATHS.LOGIN}?registered=1`, { replace: true });
      } else {
        await login({ email: values.email, password: values.password });
        setValues({ displayName: '', email: '', password: '' });
        await navigate(safeReturnPath(params.get('returnTo')), { replace: true });
      }
    } catch (failure) {
      setError(
        failure instanceof ApiError
          ? failure
          : new ApiError(0, 'UNKNOWN_ERROR', 'Chưa thực hiện được yêu cầu. Vui lòng thử lại.'),
      );
    } finally {
      setPending(false);
    }
  }
  if (!enabled)
    return (
      <section className="empty-state">
        <h1>Tài khoản chưa khả dụng</h1>
        <p>
          Máy chủ hiện chưa mở tính năng tài khoản. Bạn vẫn có thể khám phá địa điểm và tạo bản nháp
          chuyến đi.
        </p>
        <Link to={APP_PATHS.EXPLORE}>Tiếp tục khám phá</Link>
      </section>
    );
  return (
    <>
      <p className="eyebrow text-primary-hover">
        {registering ? 'BẮT ĐẦU HÀNH TRÌNH' : 'CHÀO MỪNG BẠN TRỞ LẠI'}
      </p>
      <h1>{registering ? 'Tạo tài khoản' : 'Đăng nhập'}</h1>
      <p className="muted auth-description">
        {registering
          ? 'Đăng ký bằng email để bắt đầu khám phá.'
          : 'Tiếp tục hành trình với tài khoản của bạn.'}
      </p>
      {params.get('registered') === '1' ? (
        <p role="status" className="success-note">
          Tài khoản đã được tạo. Bạn có thể đăng nhập ngay.
        </p>
      ) : null}
      <form onSubmit={(event) => void submit(event)} className="auth-form">
        {registering ? (
          <Input
            label="Tên hiển thị"
            autoComplete="name"
            name="displayName"
            required
            maxLength={150}
            value={values.displayName}
            error={fieldError('displayName')}
            onChange={(event) => setValues({ ...values, displayName: event.target.value })}
            disabled={pending}
          />
        ) : null}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          name="email"
          required
          maxLength={254}
          value={values.email}
          error={fieldError('email')}
          onChange={(event) => setValues({ ...values, email: event.target.value })}
          disabled={pending}
        />
        <div className="password-field">
          <Input
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            autoComplete={registering ? 'new-password' : 'current-password'}
            name="password"
            required
            minLength={registering ? 12 : 1}
            maxLength={128}
            value={values.password}
            hint={registering ? 'Dùng 12–128 ký tự. Bạn có thể dùng một cụm từ dễ nhớ.' : undefined}
            error={fieldError('password')}
            onChange={(event) => setValues({ ...values, password: event.target.value })}
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
          {registering ? (
            <UserPlus size={18} aria-hidden="true" />
          ) : (
            <LogIn size={18} aria-hidden="true" />
          )}
          {registering ? 'Tạo tài khoản' : 'Đăng nhập'}
        </Button>
      </form>
      <p className="auth-switch">
        {registering ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?'}{' '}
        <Link to={registering ? APP_PATHS.LOGIN : APP_PATHS.REGISTER}>
          {registering ? 'Đăng nhập' : 'Đăng ký ngay'}
        </Link>
      </p>
    </>
  );
}
