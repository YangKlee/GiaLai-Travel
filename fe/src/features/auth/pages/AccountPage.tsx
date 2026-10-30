import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  CheckCircle2,
  Compass,
  Download,
  LogOut,
  MapPinned,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { logout } from '@/services/auth';
import {
  createMyPrivacyRequest,
  downloadMyPrivacyExport,
  recordMyConsent,
  updateMyPreferences,
  updateMyProfile,
} from '@/services/account';
import { ApiError } from '@/services/api';
import { APP_PATHS } from '@/constants/path';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';
import type {
  AccountLoaderData,
  ConsentPurpose,
  ConsentState,
  PreferenceCategoryCode,
  PrivacyExportPackage,
  PrivacyRequestListState,
  PrivacyRequestStatus,
  PrivacyRequestType,
  TravelGroup,
  TravelPace,
  UserPreferences,
  UserProfile,
} from '@/features/auth/types/auth';

const roles: Record<string, string> = {
  TOURIST: 'Du khách',
  ADMIN: 'Quản trị viên',
  PARTNER: 'Đối tác',
  CONTRIBUTOR: 'Cộng tác viên',
  B2G: 'Báo cáo',
};

const privacyStatusLabels: Record<PrivacyRequestStatus, string> = {
  NEW: 'Mới tiếp nhận',
  VERIFIED: 'Đã xác minh mật khẩu',
  PROCESSING: 'Đang xử lý',
  COMPLETED: 'Hoàn tất',
  REJECTED: 'Từ chối',
};

const privacyTypeLabels: Record<PrivacyRequestType, string> = {
  EXPORT: 'Xuất dữ liệu cá nhân',
  DELETE: 'Xóa / ẩn danh tài khoản',
};

function formatDateTime(value: string | null): string {
  if (!value) return 'Chưa có';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('vi-VN');
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AccountPage() {
  const loaderData = useLoaderData() as AccountLoaderData | null;
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(loaderData?.profile ?? null);
  const [displayName, setDisplayName] = useState(
    loaderData?.profile.displayName ?? user?.displayName ?? '',
  );
  const [phone, setPhone] = useState(loaderData?.profile.phone ?? '');
  const [profilePending, setProfilePending] = useState(false);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>(
    loaderData?.preferences.preferences ?? {
      categories: [],
      pace: 'BALANCED',
      travelGroup: 'SOLO',
      dietaryNotes: null,
    },
  );
  const catalog = loaderData?.preferences.catalog ?? {
    categories: [],
    paces: [],
    travelGroups: [],
  };
  const [prefPending, setPrefPending] = useState(false);
  const [prefStatus, setPrefStatus] = useState<string | null>(null);
  const [prefError, setPrefError] = useState<string | null>(null);

  const [consents, setConsents] = useState<ConsentState>(
    loaderData?.consents ?? { current: [], history: [] },
  );
  const [consentPendingPurpose, setConsentPendingPurpose] = useState<ConsentPurpose | null>(null);
  const [consentStatus, setConsentStatus] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);

  const [privacyState, setPrivacyState] = useState<PrivacyRequestListState>(
    loaderData?.privacy ?? {
      requests: [],
      retentionSummary: {
        activeBookingsCount: 0,
        historicalBookingsCount: 0,
        slaDays: 7,
        policyNote: '',
      },
    },
  );
  const [requestType, setRequestType] = useState<PrivacyRequestType>('EXPORT');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [privacyPending, setPrivacyPending] = useState(false);
  const [privacyStatus, setPrivacyStatus] = useState<string | null>(null);
  const [privacyError, setPrivacyError] = useState<string | null>(null);
  const [exportPackage, setExportPackage] = useState<PrivacyExportPackage | null>(null);
  const [exportLoadingId, setExportLoadingId] = useState<string | null>(null);

  const [signOutPending, setSignOutPending] = useState(false);

  if (!user) return null;

  async function signOut() {
    setSignOutPending(true);
    try {
      await logout();
      await navigate(APP_PATHS.EXPLORE, { replace: true });
    } catch {
      /* TouristLayout shows the coordinator's logout status after clearing private state. */
    } finally {
      setSignOutPending(false);
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfilePending(true);
    setProfileStatus(null);
    setProfileError(null);
    try {
      const updated = await updateMyProfile({
        displayName: displayName.trim(),
        phone: phone.trim() ? phone.trim() : null,
      });
      setProfile(updated);
      setDisplayName(updated.displayName);
      setPhone(updated.phone ?? '');
      useAuthStore.setState((state) => ({
        user: state.user
          ? {
              ...state.user,
              displayName: updated.displayName,
              roles: updated.roles,
            }
          : state.user,
      }));
      setProfileStatus('Đã lưu thông tin hồ sơ.');
    } catch (error) {
      setProfileError(getErrorMessage(error, 'Không thể cập nhật hồ sơ.'));
    } finally {
      setProfilePending(false);
    }
  }

  function toggleCategory(code: PreferenceCategoryCode) {
    setPreferences((current) => {
      const exists = current.categories.includes(code);
      return {
        ...current,
        categories: exists
          ? current.categories.filter((item) => item !== code)
          : [...current.categories, code],
      };
    });
  }

  async function handlePreferencesSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrefPending(true);
    setPrefStatus(null);
    setPrefError(null);
    try {
      const updated = await updateMyPreferences({
        categories: preferences.categories,
        pace: preferences.pace,
        travelGroup: preferences.travelGroup,
        dietaryNotes: preferences.dietaryNotes?.trim() ? preferences.dietaryNotes.trim() : null,
      });
      setPreferences(updated.preferences);
      setPrefStatus('Đã lưu sở thích du lịch.');
    } catch (error) {
      setPrefError(getErrorMessage(error, 'Không thể cập nhật sở thích du lịch.'));
    } finally {
      setPrefPending(false);
    }
  }

  async function handleConsentDecision(purpose: ConsentPurpose, granted: boolean) {
    setConsentPendingPurpose(purpose);
    setConsentStatus(null);
    setConsentError(null);
    try {
      const updated = await recordMyConsent({ purpose, granted });
      setConsents({ current: updated.current, history: updated.history });
      setConsentStatus(
        granted
          ? `Đã ghi nhận đồng ý #${updated.decision.decisionNo} cho mục đích ${purpose}.`
          : `Đã rút lại đồng ý (#${updated.decision.decisionNo}) cho mục đích ${purpose}.`,
      );
    } catch (error) {
      setConsentError(getErrorMessage(error, 'Không thể ghi nhận lựa chọn đồng ý dữ liệu.'));
    } finally {
      setConsentPendingPurpose(null);
    }
  }

  async function handlePrivacySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrivacyPending(true);
    setPrivacyStatus(null);
    setPrivacyError(null);
    try {
      const created = await createMyPrivacyRequest({
        requestType,
        password: verifyPassword,
      });
      setVerifyPassword('');
      setPrivacyState((current) => ({
        requests: [
          created.request,
          ...current.requests.filter((item) => item.id !== created.request.id),
        ],
        retentionSummary: created.retentionSummary,
      }));
      setPrivacyStatus(
        created.request.resultNote ??
          'Yêu cầu quyền riêng tư của bạn đã được xác minh và tiếp nhận.',
      );
    } catch (error) {
      setPrivacyError(getErrorMessage(error, 'Không thể tạo yêu cầu quyền riêng tư.'));
    } finally {
      setPrivacyPending(false);
    }
  }

  async function handleDownloadExport(requestId: string) {
    setExportLoadingId(requestId);
    setPrivacyError(null);
    try {
      const pkg = await downloadMyPrivacyExport(requestId);
      setExportPackage(pkg);
      setPrivacyStatus('Đã tải gói dữ liệu cá nhân (JSON).');
    } catch (error) {
      setPrivacyError(getErrorMessage(error, 'Không thể tải gói dữ liệu cá nhân.'));
    } finally {
      setExportLoadingId(null);
    }
  }

  const activeUser = profile ?? {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    roles: user.roles,
    phone: null,
    createdAt: '',
    updatedAt: '',
  };

  return (
    <section className="account-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow text-primary-hover">KHÔNG GIAN CỦA BẠN</p>
          <h1>Tài khoản của tôi</h1>
          <p>Chào {activeUser.displayName}, hôm nay mình đi đâu?</p>
        </div>
        <Button variant="secondary" loading={signOutPending} onClick={() => void signOut()}>
          <LogOut size={18} aria-hidden="true" />
          Đăng xuất
        </Button>
      </div>

      <div className="account-grid">
        <div className="content-card account-card">
          <UserRound size={40} aria-hidden="true" />
          <h2>{activeUser.displayName}</h2>
          <dl className="facts">
            <div>
              <dt>Email</dt>
              <dd>{activeUser.email}</dd>
            </div>
            <div>
              <dt>Số điện thoại</dt>
              <dd>{activeUser.phone || 'Chưa cập nhật'}</dd>
            </div>
            <div>
              <dt>Vai trò hiện tại</dt>
              <dd>
                {activeUser.roles.map((role) => roles[role] ?? role).join(', ') ||
                  'Chưa được cấp vai trò'}
              </dd>
            </div>
          </dl>

          <form className="auth-form" onSubmit={(event) => void handleProfileSubmit(event)}>
            <h3>Cập nhật hồ sơ</h3>
            {profileStatus && (
              <p className="success-note" role="status">
                {profileStatus}
              </p>
            )}
            {profileError && (
              <p className="form-error" role="alert">
                {profileError}
              </p>
            )}
            <div className="form-field">
              <label htmlFor="profile-display-name">Tên hiển thị</label>
              <input
                id="profile-display-name"
                name="displayName"
                type="text"
                required
                minLength={2}
                maxLength={120}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="profile-phone">Số điện thoại liên hệ</label>
              <input
                id="profile-phone"
                name="phone"
                type="tel"
                placeholder="+84901234567"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            <Button type="submit" loading={profilePending}>
              Lưu hồ sơ
            </Button>
          </form>

          <div className="account-quick-link">
            <Link to={APP_PATHS.TRIPS} className={buttonVariants({ variant: 'secondary' })}>
              <MapPinned size={18} aria-hidden="true" />
              Xem bản nháp chuyến đi
            </Link>
          </div>
        </div>

        <div className="content-card account-section-card">
          <div className="card-header-inline">
            <Compass size={24} aria-hidden="true" />
            <div>
              <h2>Sở thích du lịch</h2>
              <p className="muted">
                Dùng cho gợi ý lịch trình Gia Lai khi bạn cho phép cá nhân hóa.
              </p>
            </div>
          </div>

          <form className="auth-form" onSubmit={(event) => void handlePreferencesSubmit(event)}>
            {prefStatus && (
              <p className="success-note" role="status">
                {prefStatus}
              </p>
            )}
            {prefError && (
              <p className="form-error" role="alert">
                {prefError}
              </p>
            )}

            <fieldset className="preference-fieldset">
              <legend>Nhóm trải nghiệm yêu thích</legend>
              <div className="preference-chips">
                {catalog.categories.map((item) => {
                  const checked = preferences.categories.includes(item.code);
                  return (
                    <label
                      key={item.code}
                      className={`preference-chip${checked ? ' selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(item.code)}
                      />
                      <span>{item.name}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="form-field">
              <label htmlFor="preference-pace">Nhịp độ chuyến đi</label>
              <select
                id="preference-pace"
                value={preferences.pace}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    pace: event.target.value as TravelPace,
                  }))
                }
              >
                {catalog.paces.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="preference-group">Nhóm đồng hành</label>
              <select
                id="preference-group"
                value={preferences.travelGroup}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    travelGroup: event.target.value as TravelGroup,
                  }))
                }
              >
                {catalog.travelGroups.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="preference-dietary">Ghi chú ẩm thực / dị ứng</label>
              <input
                id="preference-dietary"
                type="text"
                maxLength={240}
                placeholder="Ví dụ: Ăn chay, ít cay, ưu tiên cà phê địa phương"
                value={preferences.dietaryNotes ?? ''}
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    dietaryNotes: event.target.value,
                  }))
                }
              />
            </div>

            <Button type="submit" loading={prefPending}>
              Lưu sở thích
            </Button>
          </form>
        </div>
      </div>

      <div className="account-grid">
        <div className="content-card account-section-card">
          <div className="card-header-inline">
            <ShieldCheck size={24} aria-hidden="true" />
            <div>
              <h2>Đồng ý xử lý dữ liệu (Consent)</h2>
              <p className="muted">
                Mặc định chưa chọn sẵn. Bạn có thể cấp hoặc rút lại đồng ý bất kỳ lúc nào; mọi quyết
                định được lưu tuần tự theo số thứ tự (decision_no).
              </p>
            </div>
          </div>

          {consentStatus && (
            <p className="success-note" role="status">
              {consentStatus}
            </p>
          )}
          {consentError && (
            <p className="form-error" role="alert">
              {consentError}
            </p>
          )}

          <div className="consent-list">
            {consents.current.map((item) => {
              const isBusy = consentPendingPurpose === item.purpose;
              return (
                <div key={item.purpose} className="consent-item">
                  <div className="consent-info">
                    <div className="consent-title-row">
                      <h3>{item.title}</h3>
                      <span className="badge">
                        <span className="badge-dot" />
                        {item.decisionNo === 0
                          ? 'Mặc định: Chưa đồng ý'
                          : item.granted
                            ? `Đang đồng ý (Quyết định #${item.decisionNo})`
                            : `Đã rút đồng ý (Quyết định #${item.decisionNo})`}
                      </span>
                    </div>
                    <p className="muted">{item.description}</p>
                    <p className="muted">
                      Phiên bản chính sách: <strong>{item.policyVersion}</strong> · Cập nhật:{' '}
                      {formatDateTime(item.decidedAt)}
                    </p>
                  </div>
                  <div className="consent-actions">
                    <Button
                      variant={item.granted ? 'secondary' : 'primary'}
                      loading={isBusy}
                      disabled={isBusy || (item.decisionNo > 0 && item.granted)}
                      onClick={() => void handleConsentDecision(item.purpose, true)}
                    >
                      Đồng ý {item.purpose}
                    </Button>
                    <Button
                      variant="secondary"
                      loading={isBusy}
                      disabled={isBusy || !item.granted}
                      onClick={() => void handleConsentDecision(item.purpose, false)}
                    >
                      Rút đồng ý {item.purpose}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {consents.history.length > 0 && (
            <div className="consent-history">
              <h3>Lịch sử quyết định (mới nhất trước)</h3>
              <ul className="history-list">
                {consents.history.slice(0, 6).map((entry) => (
                  <li key={entry.id}>
                    <span>
                      <strong>{entry.purpose}</strong> · Quyết định #{entry.decisionNo}:{' '}
                      {entry.granted ? 'Đồng ý' : 'Rút đồng ý'}
                    </span>
                    <span className="muted">{formatDateTime(entry.decidedAt)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="content-card account-section-card">
          <div className="card-header-inline">
            <ShieldAlert size={24} aria-hidden="true" />
            <div>
              <h2>Quyền riêng tư: Xuất &amp; Xóa dữ liệu</h2>
              <p className="muted">
                Yêu cầu xác minh lại mật khẩu hiện tại. Thời hạn xử lý tối đa{' '}
                {privacyState.retentionSummary.slaDays} ngày.
              </p>
            </div>
          </div>

          <div className="info-note">
            <CheckCircle2 size={18} aria-hidden="true" />
            <div>
              <strong>Chính sách lưu giữ giao dịch &amp; lịch sử đặt chỗ:</strong>
              <p>{privacyState.retentionSummary.policyNote}</p>
              <p>
                Đơn đặt chỗ đang hoạt động:{' '}
                <strong>{privacyState.retentionSummary.activeBookingsCount}</strong> · Đơn lịch sử
                được lưu giữ đối soát:{' '}
                <strong>{privacyState.retentionSummary.historicalBookingsCount}</strong>
              </p>
            </div>
          </div>

          <form className="auth-form" onSubmit={(event) => void handlePrivacySubmit(event)}>
            {privacyStatus && (
              <p className="success-note" role="status">
                {privacyStatus}
              </p>
            )}
            {privacyError && (
              <p className="form-error" role="alert">
                {privacyError}
              </p>
            )}

            <div className="form-field">
              <label htmlFor="privacy-request-type">Loại yêu cầu</label>
              <select
                id="privacy-request-type"
                value={requestType}
                onChange={(event) => setRequestType(event.target.value as PrivacyRequestType)}
              >
                <option value="EXPORT">Xuất gói dữ liệu cá nhân (JSON)</option>
                <option value="DELETE">Xóa / ẩn danh tài khoản cá nhân</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="privacy-verify-password">Xác nhận mật khẩu hiện tại</label>
              <input
                id="privacy-verify-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={verifyPassword}
                onChange={(event) => setVerifyPassword(event.target.value)}
                placeholder="Nhập mật khẩu để xác minh chủ tài khoản"
              />
            </div>

            <Button type="submit" loading={privacyPending}>
              Gửi yêu cầu quyền riêng tư
            </Button>
          </form>

          <div className="privacy-requests-list">
            <h3>Trạng thái yêu cầu đã gửi</h3>
            {privacyState.requests.length === 0 ? (
              <p className="muted">Chưa có yêu cầu xuất hoặc xóa dữ liệu nào.</p>
            ) : (
              <ul className="history-list">
                {privacyState.requests.map((req) => (
                  <li key={req.id} className="privacy-request-item">
                    <div>
                      <strong>{privacyTypeLabels[req.requestType]}</strong> ·{' '}
                      <span className="badge">{privacyStatusLabels[req.status]}</span>
                      <p className="muted">
                        Tạo lúc: {formatDateTime(req.createdAt)} · Hạn SLA:{' '}
                        {formatDateTime(req.slaDueAt)}
                      </p>
                      {req.resultNote && <p className="muted">{req.resultNote}</p>}
                    </div>
                    {req.requestType === 'EXPORT' && req.status === 'COMPLETED' && (
                      <Button
                        variant="secondary"
                        loading={exportLoadingId === req.id}
                        onClick={() => void handleDownloadExport(req.id)}
                      >
                        <Download size={16} aria-hidden="true" />
                        Tải gói dữ liệu JSON
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {exportPackage && (
            <div className="export-preview" aria-label="Gói dữ liệu cá nhân đã xuất">
              <h3>Gói dữ liệu cá nhân ({exportPackage.subject.email})</h3>
              <pre tabIndex={0}>{JSON.stringify(exportPackage, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
