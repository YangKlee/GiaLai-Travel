import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  CheckCircle2,
  EyeOff,
  FileEdit,
  Flag,
  History,
  Layers,
  ShieldCheck,
  Ticket,
  XCircle,
} from 'lucide-react';
import { useLoaderData } from 'react-router-dom';
import type { adminContentLoader } from '@/routes/catalogLoaders';
import {
  createAdminContent,
  createAdminRevision,
  reviewAdminRevision,
  submitAdminRevision,
  updateAdminContentVisibility,
} from '@/services/admin';
import { completeAdminBooking, reviewAdminBooking } from '@/services/bookings';
import type { BookingRecord } from '@/services/bookings';
import { listAdminAuditLogs, listAdminIssues, reviewAdminIssue } from '@/services/operations';
import type { AuditLogItem, IssueItem, IssueStatus } from '@/services/operations';
import { ApiError } from '@/services/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatVnd } from '@/utils/format';
import { CATEGORY_NAMES } from '@/features/explore/types/catalog';
import type {
  AdminContentItem,
  Category,
  ContentKind,
  ServiceType,
} from '@/features/explore/types/catalog';

const KIND_LABELS: Record<ContentKind, string> = {
  PLACE: 'Địa điểm (POI)',
  EVENT: 'Sự kiện / Lễ hội',
  AUDIO: 'Thuyết minh âm thanh',
  PARTNER: 'Đối tác dịch vụ',
  SERVICE: 'Dịch vụ / Trải nghiệm',
  ARTICLE: 'Bài viết văn hóa',
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AdminContentPage() {
  const initialData = useLoaderData<typeof adminContentLoader>();
  const [items, setItems] = useState<AdminContentItem[]>(initialData.contents.data);
  const meta = initialData.meta;

  const [kind, setKind] = useState<ContentKind>('PLACE');
  const [targetContentId, setTargetContentId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [transcript, setTranscript] = useState('');
  const [sourceReference, setSourceReference] = useState('https://gialai.gov.vn/nguon-xac-minh');
  const [submitImmediately, setSubmitImmediately] = useState(true);

  const [regionId, setRegionId] = useState(meta.regions[0]?.id ?? '');
  const [category, setCategory] = useState<Category>('NATURE');
  const [latitude, setLatitude] = useState('13.9833');
  const [longitude, setLongitude] = useState('108.0000');
  const [referencePriceVnd, setReferencePriceVnd] = useState('50000');
  const [typicalDurationMinutes, setTypicalDurationMinutes] = useState('90');

  const [placeId, setPlaceId] = useState(meta.places[0]?.id ?? '');
  const [partnerId, setPartnerId] = useState(meta.partners[0]?.id ?? '');
  const [serviceType, setServiceType] = useState<ServiceType>('EXPERIENCE');
  const [priceUnit, setPriceUnit] = useState('khách');
  const [unitPriceVnd, setUnitPriceVnd] = useState('200000');
  const [startsAt, setStartsAt] = useState('2026-11-15T08:00:00.000Z');
  const [endsAt, setEndsAt] = useState('2026-11-15T12:00:00.000Z');

  const [formPending, setFormPending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const [adminTab, setAdminTab] = useState<'CMS' | 'BOOKINGS' | 'ISSUES' | 'AUDIT'>('CMS');
  const [bookings, setBookings] = useState<BookingRecord[]>(initialData.bookings ?? []);
  const [bookingFilter, setBookingFilter] = useState<string>('ALL');
  const [bookingActionId, setBookingActionId] = useState<string | null>(null);
  const [bookingRejectReason, setBookingRejectReason] = useState<Record<string, string>>({});

  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [issuesLoaded, setIssuesLoaded] = useState(false);
  const [issueResponse, setIssueResponse] = useState<Record<string, string>>({});
  const [issueBusyId, setIssueBusyId] = useState<string | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [auditLoaded, setAuditLoaded] = useState(false);

  async function loadIssues() {
    try {
      const res = await listAdminIssues({ pageSize: 50 });
      setIssues(res.data);
      setIssuesLoaded(true);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Không thể tải danh sách báo lỗi.'));
    }
  }

  async function loadAuditLogs() {
    try {
      const res = await listAdminAuditLogs({ pageSize: 50 });
      setAuditLogs(res.data);
      setAuditLoaded(true);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Không thể tải nhật ký kiểm toán.'));
    }
  }

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

  function upsertItem(updated: AdminContentItem) {
    setItems((current) => {
      const exists = current.some((item) => item.id === updated.id);
      if (!exists) return [updated, ...current];
      return current.map((item) => (item.id === updated.id ? updated : item));
    });
  }

  function buildPayload(selectedKind: ContentKind): Record<string, unknown> {
    if (selectedKind === 'PLACE') {
      return {
        regionId,
        category,
        latitude: Number(latitude),
        longitude: Number(longitude),
        referencePriceVnd: referencePriceVnd.trim() ? referencePriceVnd.trim() : null,
        typicalDurationMinutes: typicalDurationMinutes.trim()
          ? Number(typicalDurationMinutes)
          : null,
        openingHours: [{ weekday: 1, opensAt: '07:30:00', closesAt: '17:30:00' }],
      };
    }
    if (selectedKind === 'AUDIO') {
      return {
        placeId,
        premiumOnly: false,
      };
    }
    if (selectedKind === 'EVENT') {
      return {
        placeId,
        startsAt,
        endsAt,
        eventStatus: 'SCHEDULED',
      };
    }
    if (selectedKind === 'PARTNER') {
      return {
        status: 'ACTIVE',
        contactEmail: 'partner@gialai.test',
      };
    }
    if (selectedKind === 'SERVICE') {
      return {
        partnerId,
        placeId: placeId || null,
        serviceType,
        priceUnit,
        unitPriceVnd,
        active: true,
        slots: [
          {
            startsAt,
            endsAt,
            capacity: 12,
          },
        ],
      };
    }
    return {};
  }

  async function handleEditorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormPending(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const targetItem = items.find((i) => i.id === targetContentId);
      const effectiveKind = targetItem ? targetItem.kind : kind;
      const payload = buildPayload(effectiveKind);

      const saved = targetContentId
        ? await createAdminRevision(targetContentId, {
            title,
            body,
            transcript: transcript.trim() ? transcript.trim() : null,
            sourceReference: sourceReference.trim() ? sourceReference.trim() : null,
            submitImmediately,
            payload,
          })
        : await createAdminContent({
            kind,
            title,
            body,
            transcript: transcript.trim() ? transcript.trim() : null,
            sourceReference: sourceReference.trim() ? sourceReference.trim() : null,
            submitImmediately,
            payload,
          });
      upsertItem(saved);
      setTitle('');
      setBody('');
      setTranscript('');
      setStatusMessage(
        targetContentId
          ? `Đã tạo phiên bản mới cho "${saved.title}" (bản công bố hiện hành được giữ nguyên cho tới khi duyệt).`
          : `Đã tạo mục nội dung "${saved.title}" (#1).`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể lưu phiên bản nội dung.'));
    } finally {
      setFormPending(false);
    }
  }

  async function handleSubmitRevision(contentId: string, revisionId: string) {
    setActionBusyId(revisionId);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const updated = await submitAdminRevision(contentId, revisionId);
      upsertItem(updated);
      setStatusMessage('Đã chuyển phiên bản sang hàng đợi chờ duyệt (PENDING).');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể gửi duyệt phiên bản.'));
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleReview(
    contentId: string,
    revisionId: string,
    decision: 'APPROVE' | 'REJECT',
  ) {
    setActionBusyId(revisionId);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const reason = rejectionReasons[revisionId]?.trim() ?? '';
      const updated = await reviewAdminRevision(contentId, revisionId, {
        decision,
        ...(decision === 'REJECT' ? { rejectionReason: reason } : {}),
      });
      upsertItem(updated);
      setStatusMessage(
        decision === 'APPROVE'
          ? `Đã duyệt công bố "${updated.title}" và đồng bộ bảng hiển thị công khai.`
          : `Đã từ chối phiên bản nội dung "${updated.title}".`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể xử lý kết quả kiểm duyệt.'));
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleToggleVisibility(item: AdminContentItem) {
    const nextVisibility = item.visibility === 'PUBLIC' ? 'HIDDEN' : 'PUBLIC';
    setActionBusyId(item.id);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const updated = await updateAdminContentVisibility(item.id, nextVisibility);
      upsertItem(updated);
      setStatusMessage(
        nextVisibility === 'HIDDEN'
          ? `Đã ẩn "${updated.title}" khỏi danh sách công khai và ngữ cảnh AI.`
          : `Đã mở lại hiển thị công khai cho "${updated.title}".`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể cập nhật trạng thái hiển thị.'));
    } finally {
      setActionBusyId(null);
    }
  }

  const publicCount = items.filter((i) => i.visibility === 'PUBLIC').length;
  const pendingCount = items.filter((i) =>
    i.revisions.some((rev) => rev.status === 'PENDING'),
  ).length;
  const hiddenCount = items.filter((i) => i.visibility === 'HIDDEN').length;

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    if (bookingFilter === 'DA_HUY') {
      return b.status === 'DA_HUY' || b.status === 'TU_CHOI' || b.status === 'HET_HAN';
    }
    return b.status === bookingFilter;
  });

  return (
    <section className="account-shell">
      <div className="section-heading">
        <div>
          <p className="eyebrow text-primary-hover">QUẢN TRỊ NỘI DUNG &amp; KIỂM DUYỆT (CMS)</p>
          <h1>Quản trị nội dung &amp; Hàng đợi duyệt</h1>
          <p>
            Mọi chỉnh sửa tạo revision mới bất biến; chỉ phiên bản được duyệt mới cập nhật bảng công
            bố công khai.
          </p>
        </div>
        <Badge>
          <ShieldCheck size={14} aria-hidden="true" /> Quyền Quản trị viên (ADMIN)
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: '8px', margin: '16px 0 24px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`button ${adminTab === 'CMS' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setAdminTab('CMS')}
        >
          <Layers size={16} style={{ marginRight: '6px' }} />
          Nội dung &amp; Bản sửa đổi (CMS)
        </button>
        <button
          type="button"
          className={`button ${adminTab === 'BOOKINGS' ? 'button-primary' : 'button-outline'}`}
          onClick={() => setAdminTab('BOOKINGS')}
        >
          <Ticket size={16} style={{ marginRight: '6px' }} />
          Quản lý Đặt chỗ &amp; Hoa hồng ({bookings.length})
        </button>
        <button
          type="button"
          className={`button ${adminTab === 'ISSUES' ? 'button-primary' : 'button-outline'}`}
          onClick={() => {
            setAdminTab('ISSUES');
            if (!issuesLoaded) void loadIssues();
          }}
        >
          <Flag size={16} style={{ marginRight: '6px' }} />
          Báo lỗi &amp; Góp ý dữ liệu
        </button>
        <button
          type="button"
          className={`button ${adminTab === 'AUDIT' ? 'button-primary' : 'button-outline'}`}
          onClick={() => {
            setAdminTab('AUDIT');
            if (!auditLoaded) void loadAuditLogs();
          }}
        >
          <History size={16} style={{ marginRight: '6px' }} />
          Nhật ký Kiểm toán (Audit)
        </button>
      </div>

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

      {adminTab === 'CMS' ? (
        <>
          <div className="place-grid">
            <div className="content-card">
              <p className="muted">Tổng mục nội dung</p>
              <h2>{items.length}</h2>
            </div>
            <div className="content-card">
              <p className="muted">Đang công bố (PUBLIC)</p>
              <h2>{publicCount}</h2>
            </div>
            <div className="content-card">
              <p className="muted">Chờ duyệt (PENDING) / Đã ẩn</p>
              <h2>
                {pendingCount} chờ duyệt · {hiddenCount} ẩn
              </h2>
            </div>
          </div>

      <div className="account-grid">
        <div className="content-card account-section-card">
          <div className="card-header-inline">
            <FileEdit size={22} aria-hidden="true" />
            <div>
              <h2>Soạn thảo nội dung / Tạo revision mới</h2>
              <p className="muted">
                Tạo mục nội dung mới hoặc thêm phiên bản sửa đổi cho mục hiện có mà không ghi đè bản
                đang công bố.
              </p>
            </div>
          </div>

          <form className="auth-form" onSubmit={(event) => void handleEditorSubmit(event)}>
            <div className="form-field">
              <label htmlFor="cms-target-item">Chế độ soạn thảo</label>
              <select
                id="cms-target-item"
                value={targetContentId}
                onChange={(event) => setTargetContentId(event.target.value)}
              >
                <option value="">+ Tạo mục nội dung mới</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    Tạo revision mới cho: [{item.kind}] {item.title}
                  </option>
                ))}
              </select>
            </div>

            {!targetContentId && (
              <div className="form-field">
                <label htmlFor="cms-kind">Loại nội dung</label>
                <select
                  id="cms-kind"
                  value={kind}
                  onChange={(event) => setKind(event.target.value as ContentKind)}
                >
                  {(Object.keys(KIND_LABELS) as ContentKind[]).map((code) => (
                    <option key={code} value={code}>
                      {KIND_LABELS[code]}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="cms-title">Tiêu đề nội dung (Tiếng Việt)</label>
              <input
                id="cms-title"
                type="text"
                required
                minLength={2}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ví dụ: Thác Phú Cường hoặc Lễ hội Cồng chiêng"
              />
            </div>

            <div className="form-field">
              <label htmlFor="cms-body">Mô tả chi tiết</label>
              <input
                id="cms-body"
                type="text"
                required
                minLength={2}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Mô tả đã xác minh..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="cms-transcript">Bản chép lời (Transcript cho Audio / Tư liệu)</label>
              <input
                id="cms-transcript"
                type="text"
                value={transcript}
                onChange={(event) => setTranscript(event.target.value)}
                placeholder="Nội dung bản chép lời thuyết minh..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="cms-source">Nguồn tham chiếu xác minh (bắt buộc khi duyệt)</label>
              <input
                id="cms-source"
                type="text"
                value={sourceReference}
                onChange={(event) => setSourceReference(event.target.value)}
                placeholder="https://gialai.gov.vn/..."
              />
            </div>

            {(targetContentId
              ? items.find((i) => i.id === targetContentId)?.kind === 'PLACE'
              : kind === 'PLACE') && (
              <>
                <div className="form-field">
                  <label htmlFor="cms-region">Vùng địa lý (Giai đoạn 1)</label>
                  <select
                    id="cms-region"
                    value={regionId}
                    onChange={(event) => setRegionId(event.target.value)}
                  >
                    {meta.regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="cms-category">Nhóm địa điểm</label>
                  <select
                    id="cms-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value as Category)}
                  >
                    {(Object.keys(CATEGORY_NAMES) as Category[]).map((code) => (
                      <option key={code} value={code}>
                        {CATEGORY_NAMES[code]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="cms-price">Giá tham khảo (VND)</label>
                  <input
                    id="cms-price"
                    type="text"
                    value={referencePriceVnd}
                    onChange={(event) => setReferencePriceVnd(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="cms-lat">Vĩ độ (Latitude)</label>
                  <input
                    id="cms-lat"
                    type="text"
                    value={latitude}
                    onChange={(event) => setLatitude(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="cms-lon">Kinh độ (Longitude)</label>
                  <input
                    id="cms-lon"
                    type="text"
                    value={longitude}
                    onChange={(event) => setLongitude(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="cms-duration">Thời lượng ghé thăm (phút)</label>
                  <input
                    id="cms-duration"
                    type="text"
                    value={typicalDurationMinutes}
                    onChange={(event) => setTypicalDurationMinutes(event.target.value)}
                  />
                </div>
              </>
            )}

            {['AUDIO', 'EVENT', 'SERVICE'].includes(
              targetContentId ? (items.find((i) => i.id === targetContentId)?.kind ?? '') : kind,
            ) && (
              <div className="form-field">
                <label htmlFor="cms-place-id">Địa điểm liên kết</label>
                <select
                  id="cms-place-id"
                  value={placeId}
                  onChange={(event) => setPlaceId(event.target.value)}
                >
                  {meta.places.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(targetContentId
              ? items.find((i) => i.id === targetContentId)?.kind === 'SERVICE'
              : kind === 'SERVICE') && (
              <>
                <div className="form-field">
                  <label htmlFor="cms-partner-id">Đối tác cung cấp</label>
                  <select
                    id="cms-partner-id"
                    value={partnerId}
                    onChange={(event) => setPartnerId(event.target.value)}
                  >
                    {meta.partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="cms-service-type">Loại dịch vụ</label>
                  <select
                    id="cms-service-type"
                    value={serviceType}
                    onChange={(event) => setServiceType(event.target.value as ServiceType)}
                  >
                    <option value="EXPERIENCE">Trải nghiệm bản địa</option>
                    <option value="GUIDE">Hướng dẫn viên</option>
                    <option value="HOMESTAY">Lưu trú Homestay</option>
                    <option value="RENTAL">Thuê phương tiện</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="cms-unit-price">Đơn giá dịch vụ (VND)</label>
                  <input
                    id="cms-unit-price"
                    type="text"
                    value={unitPriceVnd}
                    onChange={(event) => setUnitPriceVnd(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="cms-price-unit">Đơn vị tính</label>
                  <input
                    id="cms-price-unit"
                    type="text"
                    value={priceUnit}
                    onChange={(event) => setPriceUnit(event.target.value)}
                  />
                </div>
              </>
            )}

            {['EVENT', 'SERVICE'].includes(
              targetContentId ? (items.find((i) => i.id === targetContentId)?.kind ?? '') : kind,
            ) && (
              <>
                <div className="form-field">
                  <label htmlFor="cms-starts-at">Thời gian bắt đầu (ISO UTC)</label>
                  <input
                    id="cms-starts-at"
                    type="text"
                    value={startsAt}
                    onChange={(event) => setStartsAt(event.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="cms-ends-at">Thời gian kết thúc (ISO UTC)</label>
                  <input
                    id="cms-ends-at"
                    type="text"
                    value={endsAt}
                    onChange={(event) => setEndsAt(event.target.value)}
                  />
                </div>
              </>
            )}

            <label className="preference-chip">
              <input
                type="checkbox"
                checked={submitImmediately}
                onChange={(event) => setSubmitImmediately(event.target.checked)}
              />
              <span>Gửi vào hàng đợi chờ duyệt (PENDING) ngay khi lưu</span>
            </label>

            <Button type="submit" loading={formPending}>
              {targetContentId ? 'Lưu revision mới' : 'Tạo mục nội dung'}
            </Button>
          </form>
        </div>

        <div className="content-card account-section-card">
          <div className="card-header-inline">
            <Layers size={22} aria-hidden="true" />
            <div>
              <h2>Hàng đợi kiểm duyệt &amp; Lịch sử Revision</h2>
              <p className="muted">
                Duyệt công bố sẽ cập nhật con trỏ <code>published_revision_id</code> và bảng hiển
                thị trong cùng một giao dịch.
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="muted">Chưa có mục nội dung nào trong hệ thống.</p>
          ) : (
            <div className="consent-list">
              {items.map((item) => (
                <div key={item.id} className="consent-item">
                  <div className="consent-title-row">
                    <div>
                      <Badge>
                        {item.kind} · {item.visibility}
                      </Badge>
                      <h3>{item.title}</h3>
                      <p className="muted">
                        ID công bố hiện hành:{' '}
                        <strong>
                          {item.publishedRevisionId
                            ? `#${item.revisions.find((r) => r.id === item.publishedRevisionId)?.revisionNo ?? '?'}`
                            : 'Chưa công bố'}
                        </strong>
                      </p>
                    </div>
                    {item.publishedRevisionId && (
                      <Button
                        type="button"
                        variant="secondary"
                        loading={actionBusyId === item.id}
                        onClick={() => void handleToggleVisibility(item)}
                      >
                        <EyeOff size={15} aria-hidden="true" />
                        {item.visibility === 'PUBLIC' ? 'Ẩn khỏi công khai' : 'Mở lại công khai'}
                      </Button>
                    )}
                  </div>

                  <ul className="history-list">
                    {item.revisions.map((rev) => {
                      const isReviewable = rev.status === 'DRAFT' || rev.status === 'PENDING';
                      return (
                        <li key={rev.id}>
                          <div>
                            <strong>
                              Revision #{rev.revisionNo} ({rev.status})
                            </strong>{' '}
                            — {rev.title}
                            <p className="muted">
                              Nguồn: {rev.sourceReference || 'Chưa có'} · Tạo lúc:{' '}
                              {formatDate(rev.createdAt)}
                            </p>
                            {rev.rejectionReason && (
                              <p className="field-error">Lý do từ chối: {rev.rejectionReason}</p>
                            )}
                          </div>

                          {isReviewable && (
                            <div className="consent-actions">
                              {rev.status === 'DRAFT' && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  loading={actionBusyId === rev.id}
                                  onClick={() => void handleSubmitRevision(item.id, rev.id)}
                                >
                                  Gửi duyệt
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="primary"
                                loading={actionBusyId === rev.id}
                                onClick={() => void handleReview(item.id, rev.id, 'APPROVE')}
                              >
                                <CheckCircle2 size={15} aria-hidden="true" />
                                Duyệt công bố #{rev.revisionNo}
                              </Button>
                              <input
                                type="text"
                                aria-label={`Lý do từ chối #${rev.revisionNo}`}
                                placeholder="Lý do từ chối..."
                                value={rejectionReasons[rev.id] ?? ''}
                                onChange={(event) =>
                                  setRejectionReasons((prev) => ({
                                    ...prev,
                                    [rev.id]: event.target.value,
                                  }))
                                }
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  border: '1px solid var(--color-border-subtle)',
                                  fontSize: '12px',
                                }}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                loading={actionBusyId === rev.id}
                                onClick={() => void handleReview(item.id, rev.id, 'REJECT')}
                              >
                                <XCircle size={15} aria-hidden="true" />
                                Từ chối #{rev.revisionNo}
                              </Button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </>
      ) : adminTab === 'BOOKINGS' ? (
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
                  bookings.filter(
                    (b) => b.status === 'DA_XAC_NHAN' || b.status === 'HOAN_THANH',
                  ).length
                }
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', margin: '20px 0', flexWrap: 'wrap' }}>
            {['ALL', 'CHO_DUYET', 'CHO_THANH_TOAN', 'DA_XAC_NHAN', 'HOAN_THANH', 'DA_HUY'].map((st) => (
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
            ))}
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
                          {b.contactEmail ?? b.contactPhone ?? 'Không có'})
                          {' · '}Số lượng: <strong>{b.quantity} suất</strong>
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
      ) : adminTab === 'ISSUES' ? (
        <div style={{ marginTop: '16px' }}>
          <div className="card-header-inline" style={{ marginBottom: '16px' }}>
            <Flag size={22} className="text-primary" />
            <div>
              <h2>Quản lý Phản ánh chất lượng nội dung &amp; Báo lỗi</h2>
              <p className="muted">
                Tiếp nhận và giải quyết các phản ánh đóng góp từ du khách đối với thông tin điểm đến, giá cả, và giờ mở cửa.
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
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
                          Người gửi: {issue.reporterName ?? 'Ẩn danh'} · Ngày gửi: {formatDate(issue.createdAt)}
                        </small>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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
      ) : (
        <div style={{ marginTop: '16px' }}>
          <div className="card-header-inline" style={{ marginBottom: '16px' }}>
            <History size={22} className="text-primary" />
            <div>
              <h2>Nhật ký Kiểm toán Hệ thống (Audit Logs)</h2>
              <p className="muted">
                Lịch sử các thao tác nghiệp vụ, bảo mật, và kiểm duyệt trên hệ thống (đã che giấu dữ liệu nhạy cảm).
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
                <div key={log.id} className="content-card" style={{ padding: '12px 16px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          background: log.result === 'SUCCESS' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                          color: log.result === 'SUCCESS' ? '#28a745' : '#dc3545',
                        }}
                      >
                        {log.result}
                      </span>
                      <strong>{log.action}</strong>
                      <span className="muted">({log.targetType}{log.targetId ? `: ${log.targetId.slice(0, 8)}…` : ''})</span>
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
      )}
    </section>
  );
}
