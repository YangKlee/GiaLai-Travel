import { useState } from 'react';
import type { FormEvent } from 'react';
import { KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { APP_PATHS } from '@/constants/path';
import { requestPasswordReset } from '@/services/auth';
import { ApiError } from '@/services/api-error';
import { useAuthStore } from '@/store/useAuthStore';

export default function ForgotPasswordPage() {
  const enabled = useAuthStore((state) => state.enabled);
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const fieldError = (name: string) => error?.fields.find((field) => field.field === name)?.message;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    setConfirmation(null);
    try {
      const response = await requestPasswordReset({ email });
      setConfirmation(response.message);
    } catch (failure) {
      setError(
        failure instanceof ApiError
          ? failure
          : new ApiError(0, 'UNKNOWN_ERROR', 'Chưa gửi được yêu cầu khôi phục. Vui lòng thử lại.'),
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

  return (
    <>
      <p className="eyebrow text-primary-hover">KHÔI PHỤC TÀI KHOẢN</p>
      <h1>Quên mật khẩu</h1>
      <p className="muted auth-description">
        Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu có hiệu lực trong 15 phút.
      </p>
      {confirmation ? (
        <p role="status" className="success-note">
          {confirmation}
        </p>
      ) : null}
      <form onSubmit={(event) => void submit(event)} className="auth-form">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          name="email"
          required
          maxLength={254}
          value={email}
          error={fieldError('email')}
          onChange={(event) => setEmail(event.target.value)}
          disabled={pending}
        />
        {error ? (
          <div role="alert" className="form-error">
            <p>{error.message}</p>
            {error.requestId ? <small>Mã hỗ trợ: {error.requestId}</small> : null}
          </div>
        ) : null}
        <Button type="submit" loading={pending}>
          <KeyRound size={18} aria-hidden="true" />
          Gửi liên kết đặt lại
        </Button>
      </form>
      <p className="auth-switch">
        Đã nhớ mật khẩu? <Link to={APP_PATHS.LOGIN}>Quay lại đăng nhập</Link>
      </p>
    </>
  );
}
