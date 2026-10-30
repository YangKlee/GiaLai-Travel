import { useState } from 'react';
import { Bell, CheckCheck, CheckCircle2, Info, Ticket } from 'lucide-react';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import type { notificationsLoader } from '@/routes/catalogLoaders';
import { APP_PATHS } from '@/constants/path';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/format';
import { markAllNotificationsRead, markNotificationRead } from '@/services/notifications';
import { DatasetNotice } from '@/components/common/DatasetNotice';

export default function NotificationsPage() {
  const { dataset, notifications, unreadCount } = useLoaderData<typeof notificationsLoader>();
  const revalidator = useRevalidator();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  async function handleMarkRead(id: string) {
    setBusyId(id);
    try {
      await markNotificationRead(id);
      revalidator.revalidate();
    } finally {
      setBusyId(null);
    }
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      revalidator.revalidate();
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <>
      <DatasetNotice dataset={dataset} />

      <header
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Bell size={28} className="text-primary" />
          <div>
            <h1>Hộp thư thông báo hệ thống</h1>
            <p className="lead">
              Thông báo cập nhật lịch trình, trạng thái đơn đặt chỗ và hệ thống.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="secondary"
            disabled={markingAll}
            onClick={() => void handleMarkAllRead()}
          >
            <CheckCheck size={16} style={{ marginRight: '6px' }} />
            Đánh dấu tất cả đã đọc ({unreadCount})
          </Button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="content-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Bell size={48} className="muted" style={{ margin: '0 auto 16px' }} />
          <h3>Bạn chưa có thông báo nào</h3>
          <p className="muted" style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
            Khi có cập nhật về lịch trình, phê duyệt đơn đặt hoặc phản hồi báo lỗi, thông báo sẽ
            hiển thị tại đây.
          </p>
          <Link to={APP_PATHS.EXPLORE} className="button button-primary">
            Khám phá Gia Lai ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => {
            const isUnread = !n.readAt;
            const isBusy = busyId === n.id;

            return (
              <article
                key={n.id}
                className="content-card"
                style={{
                  borderLeft: isUnread ? '4px solid var(--color-primary)' : '4px solid transparent',
                  background: isUnread ? 'rgba(40, 167, 69, 0.03)' : undefined,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    {n.kind === 'BOOKING' ? (
                      <Ticket size={16} className="text-primary" />
                    ) : n.kind === 'ISSUE' ? (
                      <Info size={16} style={{ color: '#17a2b8' }} />
                    ) : (
                      <Bell size={16} className="muted" />
                    )}
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: '#666',
                      }}
                    >
                      {n.kind}
                    </span>
                    <span className="muted" style={{ fontSize: '0.8rem' }}>
                      · {formatDate(n.createdAt)}
                    </span>
                    {isUnread && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          background: 'var(--color-primary)',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        Mới
                      </span>
                    )}
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem' }}>{n.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#444', lineHeight: 1.5 }}>
                    {n.body}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {n.targetType === 'BOOKING' && (
                    <Link
                      to={APP_PATHS.BOOKINGS}
                      className="button button-outline"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Xem đơn đặt
                    </Link>
                  )}
                  {isUnread && (
                    <Button
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() => void handleMarkRead(n.id)}
                      title="Đánh dấu đã đọc"
                    >
                      <CheckCircle2 size={16} />
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
