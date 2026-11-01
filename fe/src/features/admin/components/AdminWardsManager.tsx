import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Building2,
  Edit3,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { AdminContentMeta, AdminWardItem } from '@/features/explore/types/catalog';
import {
  createAdminWard,
  deleteAdminWard,
  updateAdminWard,
} from '@/services/admin';
import { ApiError } from '@/services/api';

interface Props {
  initialWards: AdminWardItem[];
  meta: AdminContentMeta;
}

export function AdminWardsManager({ initialWards, meta }: Props) {
  const [wards, setWards] = useState<AdminWardItem[]>(initialWards);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<AdminWardItem | null>(null);

  // Form state
  const [formRegionId, setFormRegionId] = useState(meta.regions[0]?.id ?? '');
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const [submitting, setSubmitting] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  function openCreateModal() {
    setEditingWard(null);
    setFormRegionId(meta.regions[0]?.id ?? '');
    setFormCode('');
    setFormName('');
    setFormStatus('ACTIVE');
    setIsModalOpen(true);
  }

  function openEditModal(ward: AdminWardItem) {
    setEditingWard(ward);
    setFormRegionId(ward.regionId);
    setFormCode(ward.code);
    setFormName(ward.name);
    setFormStatus(ward.status);
    setIsModalOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!formName.trim() || !formCode.trim() || !formRegionId) {
      setNotification({
        type: 'error',
        message: 'Vui lòng điền đầy đủ Tên, Mã và Vùng/Huyện cho Phường / Xã.',
      });
      return;
    }

    setSubmitting(true);
    setNotification(null);

    const payload = {
      regionId: formRegionId,
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      status: formStatus,
    };

    try {
      if (editingWard) {
        const updated = await updateAdminWard(editingWard.id, payload);
        // Find region name for optimistic update
        const region = meta.regions.find((r) => r.id === updated.regionId);
        const enriched: AdminWardItem = {
          ...updated,
          regionName: region ? region.name : updated.regionName,
        };
        setWards((prev) => prev.map((w) => (w.id === enriched.id ? enriched : w)));
        setNotification({
          type: 'success',
          message: `Đã cập nhật phường/xã "${enriched.name}" thành công!`,
        });
      } else {
        const created = await createAdminWard(payload);
        const region = meta.regions.find((r) => r.id === created.regionId);
        const enriched: AdminWardItem = {
          ...created,
          regionName: region ? region.name : created.regionName,
        };
        setWards((prev) => [enriched, ...prev]);
        setNotification({
          type: 'success',
          message: `Đã thêm phường/xã "${enriched.name}" thành công!`,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Không thể lưu thông tin phường/xã.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(wardId: string, wardName: string) {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa "${wardName}"? Hành động này không thể hoàn tác nếu có dữ liệu liên quan.`,
      )
    ) {
      return;
    }

    setActionBusyId(wardId);
    setNotification(null);

    try {
      await deleteAdminWard(wardId);
      setWards((prev) => prev.filter((w) => w.id !== wardId));
      setNotification({
        type: 'success',
        message: `Đã xóa phường/xã "${wardName}" thành công!`,
      });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'Không thể xóa phường/xã này (có thể đang được liên kết với địa điểm du lịch).';
      setNotification({ type: 'error', message: msg });
    } finally {
      setActionBusyId(null);
    }
  }

  // Filtered wards
  const filteredWards = wards.filter((w) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = w.name.toLowerCase().includes(q);
      const matchCode = w.code.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }
    if (regionFilter && w.regionId !== regionFilter) return false;
    if (statusFilter && w.status !== statusFilter) return false;
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
            Quản lý Phường / Xã / Thị trấn
          </h2>
          <p className="muted" style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
            Danh mục đơn vị hành chính cấp xã trực thuộc các quận, huyện, thị xã của tỉnh Gia Lai (cập nhật theo NQ sáp nhập mới nhất).
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Thêm phường / xã mới
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
            placeholder="Tìm theo tên hoặc mã phường/xã..."
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
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '0.9rem',
            minWidth: '180px',
          }}
        >
          <option value="">Tất cả Vùng / Huyện ({meta.regions.length})</option>
          {meta.regions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '0.9rem',
            minWidth: '150px',
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động (ACTIVE)</option>
          <option value="INACTIVE">Vô hiệu (INACTIVE)</option>
        </select>

        <span className="muted" style={{ fontSize: '0.88rem', marginLeft: 'auto' }}>
          Hiển thị <strong>{filteredWards.length}</strong> / {wards.length} đơn vị
        </span>
      </div>

      {/* Table view */}
      {filteredWards.length === 0 ? (
        <div
          className="content-card"
          style={{
            padding: '48px 16px',
            textAlign: 'center',
            color: '#666',
          }}
        >
          <Building2 size={40} style={{ opacity: 0.35, marginBottom: '12px' }} />
          <p style={{ margin: 0, fontWeight: 500 }}>Không tìm thấy phường / xã nào phù hợp.</p>
        </div>
      ) : (
        <div className="content-card" style={{ overflowX: 'auto', padding: 0 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid var(--color-border-subtle)',
                  backgroundColor: 'var(--color-bg-subtle, #f9fafb)',
                  color: '#475569',
                }}
              >
                <th style={{ padding: '12px 16px', width: '180px' }}>Mã định danh</th>
                <th style={{ padding: '12px 16px' }}>Tên Phường / Xã</th>
                <th style={{ padding: '12px 16px' }}>Thuộc Quận / Huyện / TP</th>
                <th style={{ padding: '12px 16px', width: '130px' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px', width: '140px', textAlign: 'right' }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWards.map((ward) => {
                const isBusy = actionBusyId === ward.id;
                return (
                  <tr
                    key={ward.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <code
                        style={{
                          background: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.84rem',
                          fontFamily: 'monospace',
                          color: '#0f172a',
                        }}
                      >
                        {ward.code}
                      </code>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                      {ward.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} style={{ color: '#64748b' }} />
                        {ward.regionName || meta.regions.find((r) => r.id === ward.regionId)?.name || 'Gia Lai'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {ward.status === 'ACTIVE' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            background: '#e6f4ea',
                            color: '#137333',
                            fontWeight: 600,
                          }}
                        >
                          ● Hoạt động
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            background: '#f1f3f4',
                            color: '#5f6368',
                            fontWeight: 600,
                          }}
                        >
                          ○ Vô hiệu
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Button
                        variant="ghost"
                        onClick={() => openEditModal(ward)}
                        disabled={isBusy}
                        style={{ padding: '6px 8px', fontSize: '0.85rem', marginRight: '4px' }}
                      >
                        <Edit3 size={14} style={{ marginRight: '4px' }} />
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => void handleDelete(ward.id, ward.name)}
                        disabled={isBusy}
                        style={{
                          color: '#dc3545',
                          padding: '6px 8px',
                          fontSize: '0.85rem',
                        }}
                      >
                        <Trash2 size={14} style={{ marginRight: '4px' }} />
                        Xóa
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Create / Edit Ward */}
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
              maxWidth: '520px',
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
                {editingWard
                  ? `Chỉnh sửa: ${editingWard.name}`
                  : 'Thêm Phường / Xã mới'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#666',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => void handleSubmit(e)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Thuộc Quận / Huyện / TP *
                  </label>
                  <select
                    value={formRegionId}
                    onChange={(e) => setFormRegionId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-subtle)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {meta.regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Tên Phường / Xã / Thị trấn *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ví dụ: Phường Hội Thương, Xã Biển Hồ..."
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-subtle)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Mã định danh (Code) *
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="Ví dụ: PLEIKU_HOITHUONG, CHUPAH_CHUDANGYA..."
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-subtle)',
                      fontSize: '0.9rem',
                    }}
                  />
                  <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    Mã dùng để tra cứu và định danh hệ thống (tự động chuyển thành chữ hoa).
                  </small>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    Trạng thái hoạt động
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-subtle)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="INACTIVE">Vô hiệu hóa (INACTIVE)</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border-subtle)',
                }}
              >
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button variant="primary" type="submit" loading={submitting}>
                  {editingWard ? 'Lưu thay đổi' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

