import { useLoaderData } from 'react-router-dom';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { formatDate } from '@/utils/format';
import { useState } from 'react';
import { CheckCircle2, XCircle, Flag } from 'lucide-react';
import type { adminIssuesLoader } from '@/routes/adminLoaders';
import { reviewAdminIssue } from '@/services/operations';
import type { IssueStatus } from '@/services/operations';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/services/api';
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AdminIssuesPage() {
  const initialData = useLoaderData<typeof adminIssuesLoader>();
  const [issues, setIssues] = useState(initialData.data);
  const [issueResponse, setIssueResponse] = useState<Record<string, string>>({});
  const [issueBusyId, setIssueBusyId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  async function handleReviewIssue(issueId: string, status: IssueStatus) {
    setErrorMessage(null);
    setStatusMessage(null);
    setIssueBusyId(issueId);
    try {
      const resp = issueResponse[issueId];
      const res = await reviewAdminIssue(issueId, { status, response: resp });
      setIssues((prev) => prev.map((i) => (i.id === issueId ? res.data : i)));
      setStatusMessage(`Đã cập nhật trạng thái phiếu phản hồi thành ${status}.`);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Không thể xử lý phản hồi.'));
    } finally {
      setIssueBusyId(null);
    }
  }

  return (
    <section className="account-shell">
      <AdminPageHeader
        title="Báo lỗi & góp ý"
        description="Tiếp nhận và xử lý phản ánh từ du khách."
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
        <div className="card-header-inline" style={{ marginBottom: '16px' }}>
          <Flag size={22} className="text-primary" />
          <div>
            <h2>Quản lý Phản ánh chất lượng nội dung &amp; Báo lỗi</h2>
            <p className="muted">
              Tiếp nhận và giải quyết các phản ánh đóng góp từ du khách đối với thông tin điểm đến,
              giá cả, và giờ mở cửa.
            </p>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="content-card" style={{ textAlign: 'center', padding: '36px' }}>
            <p className="muted">Chưa có phản ánh báo lỗi nào cần xử lý.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {issues.map((issue) => {
              const isBusy = issueBusyId === issue.id;
              return (
                <div key={issue.id} className="content-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Badge>{issue.status}</Badge>
                        <strong style={{ fontSize: '1.05rem' }}>{issue.contentTitle}</strong>
                        <span className="muted">({issue.category})</span>
                      </div>
                      <p style={{ margin: '8px 0', fontSize: '0.92rem', color: '#333' }}>
                        {issue.description}
                      </p>
                      <small className="muted">
                        Người gửi: {issue.reporterName ?? 'Ẩn danh'} · Ngày gửi:{' '}
                        {formatDate(issue.createdAt)}
                      </small>
                    </div>
                  </div>

                  <div
                    style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #eee' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Phản hồi của ban quản trị gửi cho du khách..."
                        value={issueResponse[issue.id] ?? issue.response ?? ''}
                        onChange={(e) =>
                          setIssueResponse((prev) => ({
                            ...prev,
                            [issue.id]: e.target.value,
                          }))
                        }
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border-subtle)',
                          fontSize: '0.88rem',
                          flex: '1 1 250px',
                        }}
                      />
                      <Button
                        variant="primary"
                        disabled={isBusy}
                        onClick={() => void handleReviewIssue(issue.id, 'ACCEPTED')}
                      >
                        <CheckCircle2 size={16} style={{ marginRight: '4px' }} />
                        Chấp thuận
                      </Button>
                      <Button
                        variant="secondary"
                        disabled={isBusy}
                        onClick={() => void handleReviewIssue(issue.id, 'REJECTED')}
                      >
                        <XCircle size={16} style={{ marginRight: '4px' }} />
                        Từ chối
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={isBusy}
                        onClick={() => void handleReviewIssue(issue.id, 'CLOSED')}
                      >
                        Đóng phiếu
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
