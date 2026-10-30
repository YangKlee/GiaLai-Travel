import { useLoaderData } from 'react-router-dom';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { formatDate } from '@/utils/format';
import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { adminBookingsLoader } from '@/routes/adminLoaders';
import { completeAdminBooking, reviewAdminBooking } from '@/services/bookings';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatVnd } from '@/utils/format';
import { ApiError } from '@/services/api';
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AdminBookingsPage() {
  const initialData = useLoaderData<typeof adminBookingsLoader>();
  const [bookings, setBookings] = useState(initialData.data);
  const [bookingFilter, setBookingFilter] = useState('ALL');
  const [bookingActionId, setBookingActionId] = useState<string | null>(null);
  const [bookingRejectReason, setBookingRejectReason] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  async function handleReviewBooking(bookingId: string, decision: 'APPROVE' | 'REJECT') {
    setErrorMessage(null);
    setStatusMessage(null);
    setBookingActionId(bookingId);
    try {
      const reason = bookingRejectReason[bookingId];
      const res = await reviewAdminBooking(bookingId, { decision, rejectionReason: reason });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? res.data : b)));
      setStatusMessage(
        decision === 'APPROVE'
          ? `Đã duyệt đơn #${bookingId.slice(0, 8)} và chuyển sang giữ chỗ 30 phút.`
          : `Đã từ chối đơn #${bookingId.slice(0, 8)}.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể duyệt đơn đặt dịch vụ'));
    } finally {
      setBookingActionId(null);
    }
  }

  async function handleCompleteBooking(bookingId: string) {
    setErrorMessage(null);
    setStatusMessage(null);
    setBookingActionId(bookingId);
    try {
      const res = await completeAdminBooking(bookingId);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? res.data : b)));
      setStatusMessage(`Đơn #${bookingId.slice(0, 8)} đã hoàn tất và ghi nhận hoa hồng 10%.`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể đánh dấu hoàn tất đơn'));
    } finally {
      setBookingActionId(null);
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    if (bookingFilter === 'DA_HUY') {
      return b.status === 'DA_HUY' || b.status === 'TU_CHOI' || b.status === 'HET_HAN';
    }
    return b.status === bookingFilter;
  });

  return (
    <section className="account-shell">
      <AdminPageHeader
        title="Quản lý đặt chỗ & hoa hồng"
        description="Duyệt đơn đặt dịch vụ, theo dõi thanh toán và xác nhận hoàn tất."
      />
      {statusMessage && (
        <p className="success-note" role="status">
          {statusMessage}
        </p>
      )}
      {errorMessage && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}

      <div style={{ marginTop: '16px' }}>
        <div className="place-grid">
          <div className="content-card">
            <p className="muted">Tổng đơn đặt</p>
            <h2>{bookings.length}</h2>
          </div>
          <div className="content-card">
            <p className="muted">Chờ duyệt (24h)</p>
            <h2>{bookings.filter((b) => b.status === 'CHO_DUYET').length}</h2>
          </div>
          <div className="content-card">
            <p className="muted">Đang giữ chỗ 30p</p>
            <h2>{bookings.filter((b) => b.status === 'CHO_THANH_TOAN').length}</h2>
          </div>
          <div className="content-card">
            <p className="muted">Đã xác nhận / Hoàn tất</p>
            <h2>
              {
                bookings.filter((b) => b.status === 'DA_XAC_NHAN' || b.status === 'HOAN_THANH')
                  .length
              }
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', margin: '20px 0', flexWrap: 'wrap' }}>
          {['ALL', 'CHO_DUYET', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'HOAN_THANH', 'DA_HUY'].map(
            (st) => (
              <button
                key={st}
                type="button"
                className={`button ${bookingFilter === st ? 'button-primary' : 'button-outline'}`}
                onClick={() => setBookingFilter(st)}
              >
                {st === 'ALL'
                  ? `Tất cả (${bookings.length})`
                  : st === 'CHO_DUYET'
                    ? `Chờ duyệt (${bookings.filter((b) => b.status === 'CHO_DUYET').length})`
                    : st === 'CHO_THANH_TOAN'
                      ? `Chờ thanh toán (${bookings.filter((b) => b.status === 'CHO_THANH_TOAN').length})`
                      : st === 'DA_XAC_NHAN'
                        ? `Đã xác nhận (${bookings.filter((b) => b.status === 'DA_XAC_NHAN').length})`
                        : st === 'HOAN_THANH'
                          ? `Hoàn tất (${bookings.filter((b) => b.status === 'HOAN_THANH').length})`
                          : `Đã hủy / Quá hạn (${bookings.filter((b) => b.status === 'DA_HUY' || b.status === 'TU_CHOI' || b.status === 'HET_HAN').length})`}
              </button>
            ),
          )}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '36px' }}>
            <p className="muted">Không có đơn đặt nào trong danh mục này.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map((b) => {
              const isBusy = bookingActionId === b.id;
              const canComplete = b.status === 'DA_XAC_NHAN' && new Date() >= new Date(b.endsAt);

              return (
                <div key={b.id} className="content-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Badge>{b.status}</Badge>
                        <strong style={{ fontSize: '1.05rem' }}>{b.serviceTitle}</strong>
                        <span className="muted">({b.partnerName})</span>
                      </div>
                      <p style={{ margin: '6px 0', fontSize: '0.9rem' }}>
                        Khách đặt: <strong>{b.contactName}</strong> (
                        {b.contactEmail ?? b.contactPhone ?? 'Không có'}){' · '}Số lượng:{' '}
                        <strong>{b.quantity} suất</strong>
                        {' · '}Thời gian: {formatDate(b.startsAt)} → {formatDate(b.endsAt)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          color: 'var(--color-primary)',
                        }}
                      >
                        {formatVnd(b.totalVnd)}
                      </div>
                      <small className="muted">
                        Hoa hồng 10%: {formatVnd(String(Math.round(Number(b.totalVnd) * 0.1)))}
                      </small>
                    </div>
                  </div>

                  {b.status === 'CHO_DUYET' && (
                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Button
                        variant="primary"
                        disabled={isBusy}
                        onClick={() => void handleReviewBooking(b.id, 'APPROVE')}
                      >
                        <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
                        Phê duyệt &amp; Giữ chỗ 30 phút
                      </Button>
                      <input
                        type="text"
                        placeholder="Lý do từ chối (nếu từ chối)..."
                        value={bookingRejectReason[b.id] ?? ''}
                        onChange={(e) =>
                          setBookingRejectReason((prev) => ({
                            ...prev,
                            [b.id]: e.target.value,
                          }))
                        }
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border-subtle)',
                          fontSize: '0.88rem',
                          flex: '1 1 200px',
                        }}
                      />
                      <Button
                        variant="secondary"
                        disabled={isBusy}
                        onClick={() => void handleReviewBooking(b.id, 'REJECT')}
                      >
                        <XCircle size={16} style={{ marginRight: '6px' }} />
                        Từ chối đơn
                      </Button>
                    </div>
                  )}

                  {b.status === 'DA_XAC_NHAN' && (
                    <div
                      style={{
                        marginTop: '14px',
                        paddingTop: '12px',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <span className="muted" style={{ fontSize: '0.85rem' }}>
                        {new Date() < new Date(b.endsAt)
                          ? `Dịch vụ đang diễn ra. Hoàn tất khả dụng sau ${formatDate(b.endsAt)}`
                          : 'Dịch vụ đã kết thúc. Sẵn sàng hoàn tất đơn & hạch toán hoa hồng.'}
                      </span>
                      <Button
                        variant="primary"
                        disabled={isBusy || !canComplete}
                        onClick={() => void handleCompleteBooking(b.id)}
                      >
                        <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
                        Xác nhận hoàn thành &amp; Ghi nhận hoa hồng
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
