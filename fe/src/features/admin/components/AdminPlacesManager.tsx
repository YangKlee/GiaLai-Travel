import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  CloudUpload,
  Edit3,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDuration, formatVnd } from '@/utils/format';
import { CATEGORY_NAMES } from '@/features/explore/types/catalog';
import type {
  AdminContentMeta,
  AdminPlaceItem,
  Category,
} from '@/features/explore/types/catalog';
import {
  createAdminPlace,
  deleteAdminPlace,
  updateAdminPlace,
  uploadAdminR2Image,
} from '@/services/admin';
import { ApiError } from '@/services/api';

interface Props {
  initialPlaces: AdminPlaceItem[];
  meta: AdminContentMeta;
}

export function AdminPlacesManager({ initialPlaces, meta }: Props) {
  const [places, setPlaces] = useState<AdminPlaceItem[]>(initialPlaces);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<AdminPlaceItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('NATURE');
  const [formRegionId, setFormRegionId] = useState(meta.regions[0]?.id ?? '');
  const [formLat, setFormLat] = useState('13.9833');
  const [formLon, setFormLon] = useState('108.0000');
  const [formPrice, setFormPrice] = useState('');
  const [formDuration, setFormDuration] = useState('90');
  const [formBannerUrl, setFormBannerUrl] = useState('');
  const [formBannerMode, setFormBannerMode] = useState<'URL' | 'UPLOAD'>('URL');
  const [formSource, setFormSource] = useState('https://gialai.gov.vn/diem-den');

  const [uploadingR2, setUploadingR2] = useState(false);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  function openCreateModal() {
    setEditingPlace(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('NATURE');
    setFormRegionId(meta.regions[0]?.id ?? '');
    setFormLat('13.9833');
    setFormLon('108.0000');
    setFormPrice('50000');
    setFormDuration('90');
    setFormBannerUrl('');
    setFormBannerMode('URL');
    setFormSource('https://gialai.gov.vn/diem-den');
    setUploadNote(null);
    setIsModalOpen(true);
  }

  function openEditModal(place: AdminPlaceItem) {
    setEditingPlace(place);
    setFormTitle(place.title);
    setFormDescription(place.description);
    setFormCategory(place.category);
    setFormRegionId(place.regionId);
    setFormLat(String(place.latitude));
    setFormLon(String(place.longitude));
    setFormPrice(place.referencePriceVnd ?? '');
    setFormDuration(place.typicalDurationMinutes ? String(place.typicalDurationMinutes) : '90');
    setFormBannerUrl(place.bannerUrl || place.imageUrl || '');
    setFormBannerMode('URL');
    setFormSource(place.sourceReference || 'https://gialai.gov.vn/diem-den');
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
      const res = await uploadAdminR2Image(file, 'places');
      setFormBannerUrl(res.url);
      setUploadNote(
        res.provider === 'cloudflare-r2'
          ? `✓ Đã tải lên Cloudflare R2: ${res.key}`
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    setSubmitting(true);
    setNotification(null);

    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory,
      regionId: formRegionId,
      latitude: Number(formLat),
      longitude: Number(formLon),
      referencePriceVnd: formPrice.trim() ? formPrice.trim() : null,
      typicalDurationMinutes: formDuration.trim() ? Number(formDuration.trim()) : null,
      bannerUrl: formBannerUrl.trim() || null,
      imageUrl: formBannerUrl.trim() || null,
      sourceReference: formSource.trim() || null,
      openingHours: [{ weekday: 1, opensAt: '07:30:00', closesAt: '17:30:00', crossesMidnight: false }],
    };

    try {
      if (editingPlace) {
        const updated = await updateAdminPlace(editingPlace.id, payload);
        setPlaces((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setNotification({
          type: 'success',
          message: `Đã cập nhật địa điểm "${updated.title}" thành công!`,
        });
      } else {
        const created = await createAdminPlace(payload);
        setPlaces((prev) => [created, ...prev]);
        setNotification({
          type: 'success',
          message: `Đã tạo mới địa điểm "${created.title}" thành công!`,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Không thể lưu địa điểm.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(placeId: string, placeTitle: string) {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa địa điểm "${placeTitle}" không? Hành động này sẽ xóa dữ liệu và không thể hoàn tác.`)) {
      return;
    }

    setActionBusyId(placeId);
    setNotification(null);
    try {
      await deleteAdminPlace(placeId);
      setPlaces((prev) => prev.filter((p) => p.id !== placeId));
      setNotification({
        type: 'success',
        message: `Đã xóa địa điểm "${placeTitle}" thành công!`,
      });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Không thể xóa địa điểm này.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionBusyId(null);
    }
  }

  // Filtered places
  const filteredPlaces = places.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (regionFilter && p.regionId !== regionFilter) return false;
    return true;
  });

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
            Quản trị Địa điểm Du lịch (Places CRUD)
          </h2>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
            Thêm mới, cập nhật toạ độ, giá vé, giờ mở cửa và xóa các điểm đến trên bản đồ Gia Lai.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Thêm địa điểm mới
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
            placeholder="Tìm theo tên địa điểm, mô tả..."
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '0.9rem',
          }}
        >
          <option value="">Tất cả danh mục ({places.length})</option>
          {(Object.keys(CATEGORY_NAMES) as Category[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_NAMES[cat]}
            </option>
          ))}
        </select>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '0.9rem',
          }}
        >
          <option value="">Tất cả khu vực</option>
          {meta.regions.map((reg) => (
            <option key={reg.id} value={reg.id}>
              {reg.name}
            </option>
          ))}
        </select>

        {(searchQuery || categoryFilter || regionFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setRegionFilter('');
            }}
          >
            Xóa lọc
          </Button>
        )}
      </div>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="content-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="muted">Không tìm thấy địa điểm nào phù hợp.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredPlaces.map((place) => {
            const isBusy = actionBusyId === place.id;
            const banner = place.bannerUrl || place.imageUrl;
            return (
              <div
                key={place.id}
                className="content-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '12px',
                }}
              >
                {/* Banner Thumbnail */}
                <div
                  style={{
                    height: '140px',
                    width: '100%',
                    backgroundColor: '#f0f4f2',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {banner ? (
                    <img
                      src={banner}
                      alt={place.title}
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
                        color: '#999',
                      }}
                    >
                      <ImageIcon size={36} strokeWidth={1.5} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                    <Badge>{CATEGORY_NAMES[place.category]}</Badge>
                  </div>
                  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.9)',
                        color: '#333',
                      }}
                    >
                      {place.regionName}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 6px', fontWeight: 700 }}>
                    {place.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: '#555',
                      margin: '0 0 12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {place.description}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: '#666', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>
                      💰 Giá tham khảo: <strong>{formatVnd(place.referencePriceVnd)}</strong>
                    </div>
                    <div>
                      ⏱️ Thời lượng: <strong>{formatDuration(place.typicalDurationMinutes)}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} />
                      <small>({place.latitude.toFixed(4)}, {place.longitude.toFixed(4)})</small>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Button
                      variant="secondary"
                      disabled={isBusy}
                      onClick={() => openEditModal(place)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem' }}
                    >
                      <Edit3 size={14} style={{ marginRight: '4px' }} />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={isBusy}
                      onClick={() => void handleDelete(place.id, place.title)}
                      style={{ color: '#dc3545', padding: '6px 10px', fontSize: '0.85rem' }}
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

      {/* Modal Create / Edit Place */}
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
                {editingPlace ? `Chỉnh sửa địa điểm: ${editingPlace.title}` : 'Thêm địa điểm du lịch mới'}
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
                <label htmlFor="place-title">Tiêu đề địa điểm (Tiếng Việt) *</label>
                <input
                  id="place-title"
                  type="text"
                  required
                  minLength={2}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Đồi thông Hà Tam, Núi lửa Chư Đang Ya..."
                />
              </div>

              <div className="form-field">
                <label htmlFor="place-desc">Mô tả điểm đến chi tiết *</label>
                <textarea
                  id="place-desc"
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Thông tin giới thiệu, cảnh quan, nét đặc sắc..."
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field">
                  <label htmlFor="place-cat">Danh mục</label>
                  <select
                    id="place-cat"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Category)}
                  >
                    {(Object.keys(CATEGORY_NAMES) as Category[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_NAMES[cat]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="place-reg">Vùng / Huyện</label>
                  <select
                    id="place-reg"
                    value={formRegionId}
                    onChange={(e) => setFormRegionId(e.target.value)}
                  >
                    {meta.regions.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field">
                  <label htmlFor="place-lat">Vĩ độ (Latitude) *</label>
                  <input
                    id="place-lat"
                    type="number"
                    step="0.000001"
                    required
                    value={formLat}
                    onChange={(e) => setFormLat(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="place-lon">Kinh độ (Longitude) *</label>
                  <input
                    id="place-lon"
                    type="number"
                    step="0.000001"
                    required
                    value={formLon}
                    onChange={(e) => setFormLon(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field">
                  <label htmlFor="place-price">Giá tham khảo (VND, 0 nếu miễn phí)</label>
                  <input
                    id="place-price"
                    type="number"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Ví dụ: 20000"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="place-dur">Thời lượng ghé thăm (phút)</label>
                  <input
                    id="place-dur"
                    type="number"
                    min="1"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="90"
                  />
                </div>
              </div>

              {/* Banner section */}
              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border-subtle)',
                  background: '#fbfcfb',
                  marginBottom: '16px',
                }}
              >
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  Ảnh Banner / Ảnh đại diện địa điểm
                </label>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    className={`button ${formBannerMode === 'URL' ? 'button-primary' : 'button-outline'}`}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => setFormBannerMode('URL')}
                  >
                    <LinkIcon size={14} style={{ marginRight: '6px' }} />
                    Dán URL ảnh
                  </button>
                  <button
                    type="button"
                    className={`button ${formBannerMode === 'UPLOAD' ? 'button-primary' : 'button-outline'}`}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => setFormBannerMode('UPLOAD')}
                  >
                    <CloudUpload size={14} style={{ marginRight: '6px' }} />
                    Tải ảnh lên Cloudflare R2
                  </button>
                </div>

                {formBannerMode === 'URL' ? (
                  <div className="form-field" style={{ marginBottom: 0 }}>
                    <input
                      type="url"
                      placeholder="Dán liên kết ảnh (https://...)"
                      value={formBannerUrl}
                      onChange={(e) => setFormBannerUrl(e.target.value)}
                    />
                    <small className="muted" style={{ display: 'block', marginTop: '4px' }}>
                      Có thể dán liên kết ảnh từ Unsplash, báo Gia Lai hoặc CDN.
                    </small>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      disabled={uploadingR2}
                      onChange={(e) => void handleR2Upload(e)}
                      style={{
                        padding: '10px',
                        border: '2px dashed var(--color-border-subtle)',
                        borderRadius: '8px',
                        width: '100%',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                      }}
                    />
                    {uploadingR2 && (
                      <p style={{ margin: '6px 0 0', color: 'var(--color-primary)', fontSize: '0.88rem' }}>
                        ⏳ Đang tải ảnh lên Cloudflare R2...
                      </p>
                    )}
                    {uploadNote && (
                      <p style={{ margin: '6px 0 0', color: '#28a745', fontSize: '0.88rem' }}>
                        {uploadNote}
                      </p>
                    )}
                  </div>
                )}

                {/* Banner Preview */}
                {formBannerUrl && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
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
                      <small style={{ fontWeight: 600, color: '#555' }}>Xem trước ảnh banner:</small>
                      <button
                        type="button"
                        onClick={() => setFormBannerUrl('')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        Xóa ảnh
                      </button>
                    </div>
                    <img
                      src={formBannerUrl}
                      alt="Banner Preview"
                      style={{
                        width: '100%',
                        height: '160px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                      }}
                    />
                    <small
                      className="muted"
                      style={{
                        display: 'block',
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formBannerUrl}
                    </small>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="place-src">Nguồn dữ liệu xác minh</label>
                <input
                  id="place-src"
                  type="text"
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  placeholder="https://gialai.gov.vn/..."
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
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary" loading={submitting}>
                  {editingPlace ? 'Lưu cập nhật' : 'Tạo địa điểm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
