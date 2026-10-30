import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  RotateCcw,
  Ticket,
  XCircle,
} from 'lucide-react';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import type { bookingsLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { Button } from '@/components/ui/Button';
import { formatDate, formatVnd } from '@/utils/format';
import { cancelBooking, recordPaymentAttempt } from '@/services/bookings';
import type { BookingStatus } from '@/services/bookings';
import { ApiError } from '@/services/api';
import { DatasetNotice } from '@/components/common/DatasetNotice';

const STATUS_LABELS: Record<BookingStatus, { label: string; color: string }> = {
  CHO_DUYET: { label: 'Chờ duyệt', color: '#ffc107' },
  CHO_THANH_TOAN: { label: 'Chờ thanh toán', color: '#17a2b8' },
  DA_XAC_NHAN: { label: 'Đã xác nhận', color: '#28a745' },
  TU_CHOI: { label: 'Từ chối', color: '#dc3545' },
  HET_HAN: { label: 'Hết hạn', color: '#6c757d' },
  DA_HUY: { label: 'Đã hủy', color: '#6c757d' },
  HOAN_THANH: { label: 'Hoàn thành', color: '#20c997' },
};

function makePaymentIdempotencyKey(bookingId: string, outcome: string): string {
  return `pay-${bookingId}-${outcome}-${Date.now()}`;
}

export default function BookingsPage() {
  const { dataset, bookings: initialBookings } = useLoaderData<typeof bookingsLoader>();
  const revalidator = useRevalidator();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'HISTORY'>('ALL');
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredBookings = initialBookings.filter((b) => {
    if (activeTab === 'PENDING') return b.status === 'CHO_DUYET' || b.status === 'CHO_THANH_TOAN';
    if (activeTab === 'CONFIRMED') return b.status === 'DA_XAC_NHAN' || b.status === 'HOAN_THANH';
    if (activeTab === 'HISTORY')
      return b.status === 'TU_CHOI' || b.status === 'HET_HAN' || b.status === 'DA_HUY';
    return true;
  });

  async function handlePayment(bookingId: string, outcome: 'SUCCEEDED' | 'FAILED' | 'CANCELLED') {
    setErrorMsg(null);
    setSuccessMsg(null);
    setActionBookingId(bookingId);

    try {
      const idempotencyKey = makePaymentIdempotencyKey(bookingId, outcome);
      await recordPaymentAttempt(bookingId, { outcome, idempotencyKey });
      if (outcome === 'SUCCEEDED') {
        setSuccessMsg('Thanh toán mô phỏng thành công! Đơn đặt đã được xác nhận.');
      } else {
        setErrorMsg(`Thanh toán mô phỏng ${outcome === 'FAILED' ? 'thất bại' : 'đã hủy'}.`);
      }
      revalidator.revalidate();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Không thể xử lý thanh toán mô phỏng. Vui lòng thử lại.');
      }
    } finally {
      setActionBookingId(null);
    }
  }

  async function handleCancel(bookingId: string) {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt dịch vụ này không?')) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setActionBookingId(bookingId);

    try {
      await cancelBooking(bookingId, 'Du khách yêu cầu hủy từ giao diện');
      setSuccessMsg('Đã hủy đơn đặt dịch vụ thành công.');
      revalidator.revalidate();
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Không thể hủy đơn đặt dịch vụ. Vui lòng thử lại.');
      }
    } finally {
      setActionBookingId(null);
    }
  }

  return (
    <>
      <DatasetNotice dataset={dataset} />

      <header className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Ticket size={28} className="text-primary" />
          <div>
            <h1>Đơn đặt dịch vụ của tôi</h1>
            <p className="lead">Quản lý lịch đặt chỗ, thanh toán giữ chỗ và hoàn hủy dịch vụ.</p>
          </div>
        </div>
      </header>

      {errorMsg && (
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(220, 53, 69, 0.1)',
            color: '#dc3545',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(40, 167, 69, 0.1)',
            color: '#28a745',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`button ${activeTab === 'ALL' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setActiveTab('ALL')}
        >
          Tất cả ({initialBookings.length})
        </button>
        <button
          type="button"
          className={`button ${activeTab === 'PENDING' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setActiveTab('PENDING')}
        >
          Chờ xử lý (
          {
            initialBookings.filter((b) => b.status === 'CHO_DUYET' || b.status === 'CHO_THANH_TOAN')
              .length
          }
          )
        </button>
        <button
          type="button"
          className={`button ${activeTab === 'CONFIRMED' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setActiveTab('CONFIRMED')}
        >
          Đã xác nhận (
          {
            initialBookings.filter((b) => b.status === 'DA_XAC_NHAN' || b.status === 'HOAN_THANH')
              .length
          }
          )
        </button>
        <button
          type="button"
          className={`button ${activeTab === 'HISTORY' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setActiveTab('HISTORY')}
        >
          Đã hủy / Quá hạn (
          {
            initialBookings.filter(
              (b) => b.status === 'TU_CHOI' || b.status === 'HET_HAN' || b.status === 'DA_HUY',
            ).length
          }
          )
        </button>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="content-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Ticket size={48} className="muted" style={{ margin: '0 auto 16px' }} />
          <h3>Chưa có đơn đặt dịch vụ nào trong mục này</h3>
          <p className="muted" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
            Khám phá các tour trải nghiệm, homestay và dịch vụ bản địa của đối tác Gia Lai để đặt
            chỗ.
          </p>
          <Link to={APP_PATHS.EXPLORE} className="button button-primary">
            Khám phá dịch vụ ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBookings.map((booking) => {
            const statusConfig = STATUS_LABELS[booking.status] ?? {
              label: booking.status,
              color: '#666',
            };
            const isProcessing = actionBookingId === booking.id;
            const canCancel =
              ['CHO_DUYET', 'CHO_THANH_TOAN', 'DA_XAC_NHAN'].includes(booking.status) &&
              new Date() < new Date(booking.startsAt);

            return (
              <article key={booking.id} className="content-card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    flexWrap: 'wrap',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          backgroundColor: `${statusConfig.color}20`,
                          color: statusConfig.color,
                        }}
                      >
                        {statusConfig.label}
                      </span>
                      <small className="muted">Mã đơn: {booking.id.slice(0, 8)}…</small>
                    </div>
                    <h3 style={{ margin: '8px 0 4px', fontSize: '1.2rem' }}>
                      {booking.serviceTitle}
                    </h3>
                    <p className="meta-line" style={{ margin: 0 }}>
                      Đối tác: <strong>{booking.partnerName}</strong> · Thời gian:{' '}
                      {formatDate(booking.startsAt)} → {formatDate(booking.endsAt)}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                      }}
                    >
                      {formatVnd(booking.totalVnd)}
                    </div>
                    <small className="muted">
                      {booking.quantity} suất × {formatVnd(booking.unitPriceVnd)}
                    </small>
                  </div>
                </div>

                {/* Status Guidance Banner */}
                {booking.status === 'CHO_DUYET' && (
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 193, 7, 0.1)',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Clock size={16} color="#856404" />
                    <span>
                      Đơn đang được ban quản trị xét duyệt. Hạn duyệt:{' '}
                      <strong>{formatDate(booking.reviewDeadline)}</strong> (trong 24 giờ kể từ khi
                      gửi).
                    </span>
                  </div>
                )}

                {booking.status === 'CHO_THANH_TOAN' && (
                  <div
                    style={{
                      padding: '14px',
                      background: 'rgba(23, 162, 184, 0.1)',
                      border: '1px solid rgba(23, 162, 184, 0.3)',
                      borderRadius: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        color: '#0c5460',
                      }}
                    >
                      <CreditCard size={18} />
                      <strong>Đơn đã được duyệt! Khung giờ đang giữ chỗ cho bạn.</strong>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#0c5460' }}>
                      Vui lòng thanh toán mô phỏng trước hạn:{' '}
                      <strong>
                        {booking.paymentDeadline ? formatDate(booking.paymentDeadline) : '30 phút'}
                      </strong>
                      . Nếu quá hạn, suất giữ chỗ sẽ tự động hủy và trả về kho khả dụng.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <Button
                        variant="primary"
                        disabled={isProcessing}
                        onClick={() => handlePayment(booking.id, 'SUCCEEDED')}
                      >
                        <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
                        Thanh toán mô phỏng thành công
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={isProcessing}
                        onClick={() => handlePayment(booking.id, 'FAILED')}
                      >
                        <AlertTriangle size={16} style={{ marginRight: '6px' }} />
                        Mô phỏng thanh toán thất bại
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={isProcessing}
                        onClick={() => handlePayment(booking.id, 'CANCELLED')}
                      >
                        <XCircle size={16} style={{ marginRight: '6px' }} />
                        Hủy thanh toán
                      </Button>
                    </div>
                  </div>
                )}

                {booking.status === 'TU_CHOI' && (
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(220, 53, 69, 0.1)',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      fontSize: '0.88rem',
                      color: '#721c24',
                    }}
                  >
                    <strong>Lý do từ chối:</strong>{' '}
                    {booking.rejectionReason ?? 'Không có lý do cụ thể.'}
                  </div>
                )}

                {/* Refunds info if cancelled after confirmation */}
                {booking.refunds && booking.refunds.length > 0 && (
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(40, 167, 69, 0.08)',
                      borderRadius: '6px',
                      marginBottom: '12px',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <RotateCcw size={16} color="#28a745" />
                    <span>
                      Đã hoàn tiền mô phỏng 100%:{' '}
                      <strong>{formatVnd(booking.refunds[0].amountVnd)}</strong> (Mã hoàn:{' '}
                      <code>{booking.refunds[0].id.slice(0, 8)}…</code>).
                    </span>
                  </div>
                )}

                {/* Details Footer & Cancel action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    fontSize: '0.85rem',
                    color: '#666',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div>
                    Người nhận: <strong>{booking.contactName}</strong>
                    {booking.contactPhone ? ` · ${booking.contactPhone}` : ''}
                    {booking.contactEmail ? ` · ${booking.contactEmail}` : ''}
                  </div>

                  {canCancel && (
                    <Button
                      variant="secondary"
                      disabled={isProcessing}
                      onClick={() => handleCancel(booking.id)}
                      style={{ color: '#dc3545', borderColor: '#dc3545' }}
                    >
                      Hủy đơn đặt
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
