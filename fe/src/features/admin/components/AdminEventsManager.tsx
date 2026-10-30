import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  CloudUpload,
  Edit3,
  Link as LinkIcon,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/format';
import { EVENT_STATUS_NAMES } from '@/features/explore/types/catalog';
import type {
  AdminContentMeta,
  AdminEventItem,
  EventStatus,
} from '@/features/explore/types/catalog';
import {
  createAdminEvent,
  deleteAdminEvent,
  updateAdminEvent,
  uploadAdminR2Image,
} from '@/services/admin';
import { ApiError } from '@/services/api';

interface Props {
  initialEvents: AdminEventItem[];
  meta: AdminContentMeta;
}

function toDatetimeLocal(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

function fromDatetimeLocal(localString: string): string {
  try {
    const d = new Date(localString);
    return d.toISOString();
  } catch {
    return localString;
  }
}

export function AdminEventsManager({ initialEvents, meta }: Props) {
  const [events, setEvents] = useState<AdminEventItem[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEventItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPlaceId, setFormPlaceId] = useState(meta.places[0]?.id ?? '');
  const [formStartsAt, setFormStartsAt] = useState('');
  const [formEndsAt, setFormEndsAt] = useState('');
  const [formStatus, setFormStatus] = useState<EventStatus>('SCHEDULED');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [formBannerMode, setFormBannerMode] = useState<'URL' | 'UPLOAD'>('URL');
  const [formSource, setFormSource] = useState('https://baogialai.com.vn/su-kien');

  const [uploadingR2, setUploadingR2] = useState(false);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  function openCreateModal() {
    setEditingEvent(null);
    setFormTitle('');
    setFormDescription('');
    setFormPlaceId(meta.places[0]?.id ?? '');

    // Default: starts tomorrow 08:00, ends tomorrow 22:00
    const tomorrow = new Date(Date.now() + 86400000);
    const startStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}T08:00`;
    const endStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}T22:00`;

    setFormStartsAt(startStr);
    setFormEndsAt(endStr);
    setFormStatus('SCHEDULED');
    setFormBannerUrl('');
    setFormBannerMode('URL');
    setFormSource('https://baogialai.com.vn/su-kien');
    setUploadNote(null);
    setIsModalOpen(true);
  }

  function openEditModal(ev: AdminEventItem) {
    setEditingEvent(ev);
    setFormTitle(ev.title);
    setFormDescription(ev.description);
    setFormPlaceId(ev.placeId);
    setFormStartsAt(toDatetimeLocal(ev.startsAt));
    setFormEndsAt(toDatetimeLocal(ev.endsAt));
    setFormStatus(ev.eventStatus);
    setFormBannerUrl(ev.bannerUrl || ev.imageUrl || '');
    setFormBannerMode('URL');
    setFormSource(ev.sourceReference || 'https://baogialai.com.vn/su-kien');
    setUploadNote(null);
    setIsModalOpen(true);
  }

  async function handleR2Upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingR2(true);
    setUploadNote(null);
    setNotification(null);
    try {
      const res = await uploadAdminR2Image(file, 'events');
      setFormBannerUrl(res.url);
      setUploadNote(
        res.provider === 'cloudflare-r2'
          ? `✓ Đã upload lên Cloudflare R2: ${res.key}`
          : `✓ Đã lưu trữ thành công: ${res.url}`,
      );
    } catch (err) {
      setNotification({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Tải ảnh lên Cloudflare R2 thất bại. Vui lòng kiểm tra lại.',
      });
    } finally {
      setUploadingR2(false);
      event.target.value = '';
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    const startsIso = fromDatetimeLocal(formStartsAt);
    const endsIso = fromDatetimeLocal(formEndsAt);

    if (new Date(endsIso) <= new Date(startsIso)) {
      setNotification({
        type: 'error',
        message: 'Thời gian kết thúc sự kiện phải sau thời gian bắt đầu.',
      });
      return;
    }

    setSubmitting(true);
    setNotification(null);

    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      placeId: formPlaceId,
      startsAt: startsIso,
      endsAt: endsIso,
      eventStatus: formStatus,
      bannerUrl: formBannerUrl.trim() || null,
      imageUrl: formBannerUrl.trim() || null,
      sourceReference: formSource.trim() || null,
    };

    try {
      if (editingEvent) {
        const updated = await updateAdminEvent(editingEvent.id, payload);
        setEvents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setNotification({
          type: 'success',
          message: `Đã cập nhật sự kiện "${updated.title}" thành công!`,
        });
      } else {
        const created = await createAdminEvent(payload);
        setEvents((prev) => [created, ...prev]);
        setNotification({
          type: 'success',
          message: `Đã tạo mới sự kiện "${created.title}" thành công!`,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Không thể lưu sự kiện.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuickStatusChange(eventId: string, newStatus: EventStatus) {
    setActionBusyId(eventId);
    setNotification(null);
    try {
      const updated = await updateAdminEvent(eventId, { eventStatus: newStatus });
      setEvents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setNotification({
        type: 'success',
        message: `Đã đổi trạng thái sự kiện sang "${EVENT_STATUS_NAMES[newStatus]}".`,
      });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Không thể cập nhật trạng thái sự kiện.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleDelete(eventId: string, eventTitle: string) {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${eventTitle}" không?`)) {
      return;
    }

    setActionBusyId(eventId);
    setNotification(null);
    try {
      await deleteAdminEvent(eventId);
      setEvents((prev) => prev.filter((item) => item.id !== eventId));
      setNotification({
        type: 'success',
        message: `Đã xóa sự kiện "${eventTitle}" thành công!`,
      });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Không thể xóa sự kiện.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionBusyId(null);
    }
  }

  const filteredEvents = events.filter((ev) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchDesc = ev.description.toLowerCase().includes(q);
      const matchPlace = ev.placeTitle.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchPlace) return false;
    }
    if (statusFilter && ev.eventStatus !== statusFilter) return false;
    if (placeFilter && ev.placeId !== placeFilter) return false;
    return true;
  });

  const scheduledCount = events.filter((e) => e.eventStatus === 'SCHEDULED').length;
  const completedCount = events.filter((e) => e.eventStatus === 'COMPLETED').length;
  const cancelledCount = events.filter((e) => e.eventStatus === 'CANCELLED').length;

  return (
    <div style={{ marginTop: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Quản trị Sự kiện &amp; Banner (Events CRUD)
          </h2>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
            Tạo mới, chỉnh sửa sự kiện, dán liên kết hoặc tải ảnh banner trực tiếp lên Cloudflare R2.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Thêm sự kiện mới
        </Button>
      </div>

      {notification && (
        <div
          className={notification.type === 'success' ? 'success-note' : 'form-error'}
          role="status"
          style={{ marginBottom: '16px' }}
        >
          {notification.message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="place-grid" style={{ marginBottom: '20px' }}>
        <div className="content-card">
          <p className="muted">Tổng số sự kiện</p>
          <h2>{events.length}</h2>
        </div>
        <div className="content-card">
          <p className="muted">Sắp diễn ra (SCHEDULED)</p>
          <h2 style={{ color: '#28a745' }}>{scheduledCount}</h2>
        </div>
        <div className="content-card">
          <p className="muted">Đã kết thúc / Đã hủy</p>
          <h2>
            {completedCount} kết thúc · {cancelledCount} hủy
          </h2>
        </div>
      </div>

      {/* Filter panel */}
      <div
        className="content-card"
        style={{
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
            }}
          />
          <input
            type="search"
            placeholder="Tìm theo tên sự kiện, lễ hội, địa điểm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid var(--color-border-subtle)',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '0.9rem',
          }}
        >
          <option value="">Tất cả trạng thái</option>
          {(Object.keys(EVENT_STATUS_NAMES) as EventStatus[]).map((st) => (
            <option key={st} value={st}>
              {EVENT_STATUS_NAMES[st]}
            </option>
          ))}
        </select>

        <select
          value={placeFilter}
          onChange={(e) => setPlaceFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '0.9rem',
          }}
        >
          <option value="">Tất cả địa điểm tổ chức</option>
          {meta.places.map((pl) => (
            <option key={pl.id} value={pl.id}>
              {pl.title}
            </option>
          ))}
        </select>

        {(searchQuery || statusFilter || placeFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setPlaceFilter('');
            }}
          >
            Xóa lọc
          </Button>
        )}
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="content-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="muted">Không có sự kiện nào phù hợp với bộ lọc hiện tại.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredEvents.map((ev) => {
            const isBusy = actionBusyId === ev.id;
            const banner = ev.bannerUrl || ev.imageUrl;

            return (
              <div
                key={ev.id}
                className="content-card"
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  padding: '16px',
                }}
              >
                {/* Banner Thumbnail */}
                <div
                  style={{
                    width: '180px',
                    height: '110px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  {banner ? (
                    <img
                      src={banner}
                      alt={ev.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#aaa',
                      }}
                    >
                      <CalendarDays size={32} />
                    </div>
                  )}
                  {banner?.includes('r2') && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: 'rgba(0, 81, 212, 0.85)',
                        color: '#fff',
                        padding: '1px 5px',
                        borderRadius: '4px',
                      }}
                    >
                      R2
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <Badge>{EVENT_STATUS_NAMES[ev.eventStatus]}</Badge>
                    <strong style={{ fontSize: '1.1rem' }}>{ev.title}</strong>
                  </div>

                  <p className="meta-line" style={{ margin: '6px 0', fontSize: '0.88rem' }}>
                    <MapPin size={14} aria-hidden="true" />
                    <strong>{ev.placeTitle || 'Chưa gắn địa điểm'}</strong>
                    {ev.regionName ? ` · ${ev.regionName}` : ''}
                    {' · '}
                    <CalendarDays size={14} aria-hidden="true" />
                    {formatDate(ev.startsAt)} → {formatDate(ev.endsAt)}
                  </p>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#444',
                      margin: '6px 0 12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {ev.description}
                  </p>

                  {/* Quick Status and Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: '8px',
                    }}
                  >
                    <Button
                      variant="secondary"
                      disabled={isBusy}
                      onClick={() => openEditModal(ev)}
                      style={{ padding: '5px 10px', fontSize: '0.84rem' }}
                    >
                      <Edit3 size={14} style={{ marginRight: '4px' }} />
                      Chỉnh sửa
                    </Button>

                    {/* Quick status switch */}
                    {ev.eventStatus !== 'SCHEDULED' && (
                      <Button
                        variant="secondary"
                        disabled={isBusy}
                        onClick={() => void handleQuickStatusChange(ev.id, 'SCHEDULED')}
                        style={{ padding: '5px 8px', fontSize: '0.8rem', color: '#28a745' }}
                      >
                        <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
                        Sắp diễn ra
                      </Button>
                    )}
                    {ev.eventStatus !== 'COMPLETED' && (
                      <Button
                        variant="secondary"
                        disabled={isBusy}
                        onClick={() => void handleQuickStatusChange(ev.id, 'COMPLETED')}
                        style={{ padding: '5px 8px', fontSize: '0.8rem' }}
                      >
                        Đã kết thúc
                      </Button>
                    )}
                    {ev.eventStatus !== 'CANCELLED' && (
                      <Button
                        variant="secondary"
                        disabled={isBusy}
                        onClick={() => void handleQuickStatusChange(ev.id, 'CANCELLED')}
                        style={{ padding: '5px 8px', fontSize: '0.8rem', color: '#dc3545' }}
                      >
                        <XCircle size={13} style={{ marginRight: '4px' }} />
                        Tạm hoãn/Hủy
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() => void handleDelete(ev.id, ev.title)}
                      style={{ color: '#dc3545', padding: '5px 10px', fontSize: '0.84rem' }}
                    >
                      <Trash2 size={14} style={{ marginRight: '4px' }} />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create / Edit Event */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflowY: 'auto',
          }}
        >
          <div
            className="content-card"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                {editingEvent ? `Chỉnh sửa sự kiện: ${editingEvent.title}` : 'Thêm sự kiện / Lễ hội mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => void handleSubmit(e)} className="auth-form">
              <div className="form-field">
                <label htmlFor="ev-title">Tiêu đề sự kiện (Tiếng Việt) *</label>
                <input
                  id="ev-title"
                  type="text"
                  required
                  minLength={2}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Tuần lễ Hoa Dã Quỳ - Núi lửa Chư Đang Ya..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="ev-desc">Mô tả chi tiết sự kiện *</label>
                <textarea
                  id="ev-desc"
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Thời gian, địa điểm, các hoạt động biểu diễn, trải nghiệm..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div className="form-field">
                <label htmlFor="ev-place">Địa điểm tổ chức liên kết *</label>
                <select
                  id="ev-place"
                  value={formPlaceId}
                  onChange={(e) => setFormPlaceId(e.target.value)}
                >
                  {meta.places.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field">
                  <label htmlFor="ev-start">Thời gian bắt đầu *</label>
                  <input
                    id="ev-start"
                    type="datetime-local"
                    required
                    value={formStartsAt}
                    onChange={(e) => setFormStartsAt(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="ev-end">Thời gian kết thúc *</label>
                  <input
                    id="ev-end"
                    type="datetime-local"
                    required
                    value={formEndsAt}
                    onChange={(e) => setFormEndsAt(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="ev-status">Trạng thái sự kiện</label>
                <select
                  id="ev-status"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as EventStatus)}
                >
                  <option value="SCHEDULED">Sắp diễn ra (SCHEDULED)</option>
                  <option value="COMPLETED">Đã kết thúc (COMPLETED)</option>
                  <option value="CANCELLED">Tạm hoãn / Đã hủy (CANCELLED)</option>
                </select>
              </div>

              {/* PHẦN ẢNH BANNER SỰ KIỆN: 1 là sao chép liên kết dán vào, 2 là upload lên cloudflare r2 */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border-subtle)',
                  background: '#f9fbf9',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    Ảnh Banner Sự Kiện
                  </label>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    Chọn 1 trong 2 cách
                  </span>
                </div>

                {/* Option Toggle Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    className={`button ${formBannerMode === 'URL' ? 'button-primary' : 'button-outline'}`}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
                    onClick={() => setFormBannerMode('URL')}
                  >
                    <LinkIcon size={15} style={{ marginRight: '6px' }} />
                    Cách 1: Sao chép liên kết dán vào
                  </button>
                  <button
                    type="button"
                    className={`button ${formBannerMode === 'UPLOAD' ? 'button-primary' : 'button-outline'}`}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
                    onClick={() => setFormBannerMode('UPLOAD')}
                  >
                    <CloudUpload size={15} style={{ marginRight: '6px' }} />
                    Cách 2: Upload ảnh lên Cloudflare R2
                  </button>
                </div>

                {/* Mode 1: Paste Link */}
                {formBannerMode === 'URL' && (
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <label htmlFor="ev-banner-url" style={{ fontSize: '0.85rem' }}>
                      Đường dẫn URL ảnh banner:
                    </label>
                    <input
                      id="ev-banner-url"
                      type="url"
                      placeholder="Dán liên kết ảnh vào đây: https://images.unsplash.com/... hoặc link ảnh CDN"
                      value={formBannerUrl}
                      onChange={(e) => setFormBannerUrl(e.target.value)}
                    />
                    <small className="muted" style={{ display: 'block', marginTop: '4px' }}>
                      💡 Sao chép địa chỉ hình ảnh từ bất kỳ trang nào và dán vào đây để hiển thị.
                    </small>
                  </div>
                )}

                {/* Mode 2: Upload to Cloudflare R2 */}
                {formBannerMode === 'UPLOAD' && (
                  <div>
                    <label htmlFor="ev-file-upload" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                      Chọn tệp ảnh từ máy tính (PNG, JPEG, WEBP, GIF tối đa 10MB):
                    </label>
                    <input
                      id="ev-file-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      disabled={uploadingR2}
                      onChange={(e) => void handleR2Upload(e)}
                      style={{
                        padding: '12px',
                        border: '2px dashed var(--color-primary)',
                        borderRadius: '8px',
                        width: '100%',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        background: '#fff',
                      }}
                    />
                    {uploadingR2 && (
                      <div style={{ marginTop: '8px', color: 'var(--color-primary)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} />
                        <strong>Đang tải tệp lên kho lưu trữ Cloudflare R2...</strong>
                      </div>
                    )}
                    {uploadNote && (
                      <p style={{ margin: '8px 0 0', color: '#28a745', fontWeight: 600, fontSize: '0.88rem' }}>
                        {uploadNote}
                      </p>
                    )}
                  </div>
                )}

                {/* Banner Preview Box */}
                {formBannerUrl && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      background: '#fff',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#333' }}>
                        Xem trước ảnh banner:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormBannerUrl('');
                          setUploadNote(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Xóa ảnh banner
                      </button>
                    </div>

                    <div style={{ borderRadius: '6px', overflow: 'hidden', height: '180px', backgroundColor: '#f0f0f0' }}>
                      <img
                        src={formBannerUrl}
                        alt="Event Banner Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: formBannerUrl.includes('r2') ? '#0051d4' : '#666',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        {formBannerUrl.includes('r2') ? 'Cloudflare R2' : 'Link Web'}
                      </span>
                      <small
                        className="muted"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {formBannerUrl}
                      </small>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="ev-src">Nguồn thông tin tham chiếu</label>
                <input
                  id="ev-src"
                  type="text"
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  placeholder="https://baogialai.com.vn/..."
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  disabled={submitting || uploadingR2}
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary" loading={submitting || uploadingR2}>
                  {editingEvent ? 'Lưu cập nhật sự kiện' : 'Tạo sự kiện'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
