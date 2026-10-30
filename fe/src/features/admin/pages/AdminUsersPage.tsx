import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Form,
  useLoaderData,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from 'react-router-dom';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import type { adminUsersLoader } from '@/routes/adminLoaders';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/services/api';
import { createAdminUser, deleteAdminUser, updateAdminUser } from '@/services/adminUsers';
import { USER_ROLE_LABELS } from '../types/users';
import type { AdminUser, UserRole } from '../types/users';
import { useAuthStore } from '@/store/useAuthStore';
import { clearAuthSession } from '@/services/auth';
import { APP_PATHS } from '@/constants/path';
import { formatDate } from '@/utils/format';

const roleOptions = Object.entries(USER_ROLE_LABELS) as [UserRole, string][];
const emptyForm = {
  displayName: '',
  email: '',
  phone: '',
  password: '',
  status: 'ACTIVE' as AdminUser['status'],
  roles: ['TOURIST'] as UserRole[],
};

export default function AdminUsersPage() {
  const { data: users, meta } = useLoaderData<typeof adminUsersLoader>();
  const [params, setParams] = useSearchParams();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [editing, setEditing] = useState<AdminUser | 'NEW' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isSelf = editing !== 'NEW' && editing?.id === currentUser?.id;

  function openEditor(user: AdminUser | 'NEW') {
    setEditing(user);
    setForm(
      user === 'NEW'
        ? { ...emptyForm, roles: ['TOURIST'] }
        : {
            ...user,
            email: user.email ?? '',
            phone: user.phone ?? '',
            password: '',
            roles: [...user.roles],
          },
    );
    setError(null);
    dialogRef.current?.showModal();
  }
  function closeEditor() {
    dialogRef.current?.close();
    setEditing(null);
    setForm({ ...emptyForm, roles: ['TOURIST'] });
  }
  function showError(caught: unknown) {
    setError(
      caught instanceof ApiError ? caught.message : 'Không thể xử lý người dùng. Vui lòng thử lại.',
    );
  }
  async function refreshList(afterDelete = false) {
    if (afterDelete && users.length === 1 && meta.page > 1) {
      const next = new URLSearchParams(params);
      next.set('page', String(meta.page - 1));
      setParams(next);
    } else await revalidator.revalidate();
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || pending) return;
    setPending(true);
    setError(null);
    setMessage(null);
    const input = {
      displayName: form.displayName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      status: form.status,
      roles: form.roles,
      ...(form.password ? { password: form.password } : {}),
    };
    try {
      const saved =
        editing === 'NEW'
          ? await createAdminUser({ ...input, password: form.password })
          : await updateAdminUser(editing.id, input);
      closeEditor();
      const ownRolesChanged =
        editing !== 'NEW' && [...editing.roles].sort().join() !== [...input.roles].sort().join();
      if (isSelf && (form.password || input.email !== currentUser?.email || ownRolesChanged)) {
        clearAuthSession('Thông tin đăng nhập đã thay đổi. Vui lòng đăng nhập lại.');
        await navigate(APP_PATHS.LOGIN);
        return;
      }
      if (isSelf)
        useAuthStore.setState({
          user: {
            id: saved.id,
            email: saved.email ?? input.email,
            displayName: saved.displayName,
            roles: saved.roles,
          },
        });
      setMessage(editing === 'NEW' ? 'Đã thêm người dùng.' : 'Đã cập nhật người dùng.');
      await refreshList();
    } catch (caught) {
      showError(caught);
    } finally {
      setPending(false);
    }
  }
  async function remove(user: AdminUser) {
    if (
      pending ||
      !window.confirm(
        `Xóa tài khoản "${user.displayName}"? Thông tin cá nhân sẽ được ẩn danh và mọi phiên đăng nhập sẽ kết thúc. Lịch sử giao dịch được giữ lại.`,
      )
    )
      return;
    setPending(true);
    setError(null);
    setMessage(null);
    try {
      await deleteAdminUser(user.id);
      setMessage('Đã xóa người dùng.');
      await refreshList(true);
    } catch (caught) {
      showError(caught);
    } finally {
      setPending(false);
    }
  }
  return (
    <section className="account-shell">
      <AdminPageHeader
        title="Quản trị người dùng"
        description="Quản lý tài khoản, vai trò và trạng thái truy cập."
      />
      {message && (
        <p className="success-note" role="status">
          {message}
        </p>
      )}
      {error && !editing && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="content-card admin-user-summary">
        <Users aria-hidden="true" />
        <div>
          <p className="muted">Tổng người dùng theo bộ lọc</p>
          <h2>{meta.total}</h2>
        </div>
      </div>
      <div className="content-card account-section-card">
        <div className="admin-users-toolbar">
          <Form method="get" className="admin-users-filters" key={params.toString()}>
            <label>
              Tìm người dùng
              <input
                name="q"
                defaultValue={params.get('q') ?? ''}
                placeholder="Tên, email hoặc số điện thoại"
                maxLength={150}
              />
            </label>
            <label>
              Trạng thái
              <select name="status" defaultValue={params.get('status') ?? ''}>
                <option value="">Tất cả</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Đã khóa</option>
              </select>
            </label>
            <label>
              Vai trò
              <select name="role" defaultValue={params.get('role') ?? ''}>
                <option value="">Tất cả</option>
                {roleOptions.map(([role, label]) => (
                  <option key={role} value={role}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit">
              <Search size={16} aria-hidden="true" /> Tìm kiếm
            </Button>
          </Form>
          <Button disabled={pending} onClick={() => openEditor('NEW')}>
            <Plus size={16} aria-hidden="true" /> Thêm người dùng
          </Button>
        </div>
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <caption className="sr-only">Danh sách người dùng</caption>
            <thead>
              <tr>
                <th scope="col">Người dùng</th>
                <th scope="col">Liên hệ</th>
                <th scope="col">Vai trò</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Ngày tạo</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.displayName}</strong>
                    {user.id === currentUser?.id && <p className="muted">Tài khoản của bạn</p>}
                  </td>
                  <td>
                    {user.email ?? 'Chưa có email'}
                    <p className="muted">{user.phone ?? 'Chưa có số điện thoại'}</p>
                  </td>
                  <td>
                    {user.roles.map((role) => (
                      <Badge key={role}>{USER_ROLE_LABELS[role]}</Badge>
                    ))}
                  </td>
                  <td>
                    <span
                      className={`admin-user-status ${user.status === 'ACTIVE' ? 'is-active' : 'is-locked'}`}
                    >
                      <span aria-hidden="true" />
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="admin-user-actions">
                      <Button
                        variant="secondary"
                        disabled={pending}
                        onClick={() => openEditor(user)}
                        aria-label={`Sửa ${user.displayName}`}
                      >
                        <Pencil size={16} aria-hidden="true" /> Sửa
                      </Button>
                      <Button
                        variant="danger"
                        disabled={pending || user.id === currentUser?.id}
                        onClick={() => void remove(user)}
                        aria-label={`Xóa ${user.displayName}`}
                      >
                        <Trash2 size={16} aria-hidden="true" /> Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && <p className="empty-state">Không tìm thấy người dùng phù hợp.</p>}
        </div>
        <div className="admin-users-pagination">
          <span className="muted">
            Trang {meta.page} / {Math.max(1, meta.totalPages)} · {meta.total} người dùng
          </span>
          <div className="admin-user-actions">
            {[-1, 1].map((delta) => (
              <Button
                key={delta}
                variant="secondary"
                disabled={
                  pending ||
                  revalidator.state !== 'idle' ||
                  (delta < 0 ? meta.page <= 1 : meta.page >= meta.totalPages)
                }
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set('page', String(meta.page + delta));
                  setParams(next);
                }}
              >
                {delta < 0 ? 'Trang trước' : 'Trang sau'}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="admin-user-dialog"
        aria-labelledby="admin-user-dialog-title"
        onCancel={(event) => {
          if (pending) event.preventDefault();
          else setEditing(null);
        }}
      >
        <form onSubmit={(event) => void save(event)} className="account-section-card">
          <div className="card-header-inline">
            <h2 id="admin-user-dialog-title">
              {editing === 'NEW' ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'}
            </h2>
            <Button
              type="button"
              variant="ghost"
              onClick={closeEditor}
              disabled={pending}
              aria-label="Đóng"
            >
              <X size={20} aria-hidden="true" />
            </Button>
          </div>
          {error && editing && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <fieldset disabled={pending} className="admin-user-fields">
            <label>
              Tên hiển thị
              <input
                autoFocus
                required
                maxLength={150}
                value={form.displayName}
                onChange={(event) => setForm({ ...form, displayName: event.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                maxLength={254}
                autoComplete="off"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label>
              Số điện thoại
              <input
                type="tel"
                maxLength={20}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </label>
            <label htmlFor="admin-user-password">
              {editing === 'NEW' ? 'Mật khẩu' : 'Mật khẩu mới (bỏ trống để giữ nguyên)'}
              <input
                id="admin-user-password"
                aria-describedby="admin-user-password-help"
                type="password"
                required={editing === 'NEW'}
                minLength={12}
                maxLength={128}
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </label>
            <small id="admin-user-password-help" className="muted">
              Từ 12 đến 128 ký tự.
            </small>
            <label>
              Trạng thái
              <select
                disabled={isSelf}
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as AdminUser['status'] })
                }
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Đã khóa</option>
              </select>
            </label>
            <fieldset className="admin-user-roles">
              <legend>Vai trò (chọn ít nhất một)</legend>
              {roleOptions.map(([role, label]) => (
                <label key={role}>
                  <input
                    type="checkbox"
                    checked={form.roles.includes(role)}
                    disabled={isSelf && role === 'ADMIN'}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        roles: event.target.checked
                          ? [...form.roles, role]
                          : form.roles.filter((value) => value !== role),
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            {isSelf && (
              <p className="muted">Đổi email, mật khẩu hoặc vai trò sẽ yêu cầu đăng nhập lại.</p>
            )}
          </fieldset>
          <div className="admin-user-actions">
            <Button type="button" variant="secondary" onClick={closeEditor} disabled={pending}>
              Hủy
            </Button>
            <Button type="submit" loading={pending} disabled={!form.roles.length}>
              {editing === 'NEW' ? 'Tạo người dùng' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
