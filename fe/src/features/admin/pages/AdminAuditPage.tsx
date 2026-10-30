import { useLoaderData } from 'react-router-dom';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { formatDate } from '@/utils/format';
import { History } from 'lucide-react';
import type { adminAuditLoader } from '@/routes/adminLoaders';
export default function AdminAuditPage() {
  const { data: auditLogs } = useLoaderData<typeof adminAuditLoader>();
  return (
    <section className="account-shell">
      <AdminPageHeader
        title="Nhật ký kiểm toán"
        description="Theo dõi lịch sử thao tác quản trị trên hệ thống."
      />
      <div style={{ marginTop: '16px' }}>
        <div className="card-header-inline" style={{ marginBottom: '16px' }}>
          <History size={22} className="text-primary" />
          <div>
            <h2>Nhật ký Kiểm toán Hệ thống (Audit Logs)</h2>
            <p className="muted">
              Lịch sử các thao tác nghiệp vụ, bảo mật, và kiểm duyệt trên hệ thống (đã che giấu dữ
              liệu nhạy cảm).
            </p>
          </div>
        </div>

        {auditLogs.length === 0 ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '36px' }}>
            <p className="muted">Chưa có nhật ký kiểm toán nào.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="content-card"
                style={{ padding: '12px 16px', fontSize: '0.88rem' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        background:
                          log.result === 'SUCCESS'
                            ? 'rgba(40, 167, 69, 0.1)'
                            : 'rgba(220, 53, 69, 0.1)',
                        color: log.result === 'SUCCESS' ? '#28a745' : '#dc3545',
                      }}
                    >
                      {log.result}
                    </span>
                    <strong>{log.action}</strong>
                    <span className="muted">
                      ({log.targetType}
                      {log.targetId ? `: ${log.targetId.slice(0, 8)}…` : ''})
                    </span>
                  </div>
                  <span className="muted">{formatDate(log.createdAt)}</span>
                </div>

                {log.metadata && (
                  <pre
                    style={{
                      margin: '8px 0 0',
                      padding: '8px',
                      background: '#f8f9fa',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      overflowX: 'auto',
                    }}
                  >
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
