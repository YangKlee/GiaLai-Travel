import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookmarkCheck,
  Calendar,
  CheckCircle2,
  Clock3,
  Copy,
  Edit2,
  Info,
  MapPin,
  MapPinned,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { APP_PATHS } from '@/constants/path';
import { buttonVariants } from '@/components/ui/button-variants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import type { tripsLoader } from '@/routes/catalogLoaders';
import { MAX_DRAFT_STOPS, useTripDraftStore } from '@/store/useTripDraftStore';
import { formatDuration, formatVnd, formatDate } from '@/utils/format';
import { PlaceArtwork } from '@/features/explore/components/PlaceArtwork';
import {
  copyMyItinerary,
  createMyItinerary,
  deleteMyItinerary,
  generateItineraryProposal,
  getMyItinerary,
  renameMyItinerary,
  revalidateItineraryProposal,
  updateMyItineraryRevision,
} from '@/services/itineraries';
import type {
  ItineraryDay,
  ItineraryProposal,
  ProposalInput,
  SavedItineraryDetail,
  SavedItinerarySummary,
  TransportMode,
} from '@/services/itineraries';
import type { Category } from '@/features/explore/types/catalog';
import { CATEGORY_NAMES } from '@/features/explore/types/catalog';
import { ApiError } from '@/services/api';

type TabMode = 'DRAFT' | 'AI_PLANNER' | 'SAVED';

const TRANSPORT_MODE_NAMES: Record<TransportMode, string> = {
  MOTORBIKE: 'Xe máy',
  CAR: 'Ô tô riêng',
  TAXI: 'Taxi / Xe công nghệ',
  BUS: 'Xe buýt / Công cộng',
  WALK: 'Đi bộ',
  MIXED: 'Kết hợp linh hoạt',
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function TripsPage() {
  const {
    dataset,
    savedItineraries: initialSaved,
    isAuthenticated,
  } = useLoaderData<typeof tripsLoader>();
  const [tab, setTab] = useState<TabMode>('DRAFT');

  // 1. In-session draft state (backed by Zustand useTripDraftStore)
  const draft = useTripDraftStore((state) => state.drafts[dataset]);
  const remove = useTripDraftStore((state) => state.remove);
  const move = useTripDraftStore((state) => state.move);
  const rename = useTripDraftStore((state) => state.rename);
  const priced = draft.places.filter((place) => place.referencePriceVnd !== null);
  const subtotal = priced.reduce((sum, place) => sum + BigInt(place.referencePriceVnd!), 0n);
  const durations = draft.places.filter((place) => place.typicalDurationMinutes !== null);
  const duration = durations.reduce((sum, place) => sum + (place.typicalDurationMinutes ?? 0), 0);

  // 2. AI Generator state (7 inputs)
  const [startDate, setStartDate] = useState('2026-11-01');
  const [daysCount, setDaysCount] = useState(2);
  const [partySize, setPartySize] = useState(2);
  const [totalBudgetVnd, setTotalBudgetVnd] = useState('3000000');
  const [originLat, setOriginLat] = useState('13.9833');
  const [originLon, setOriginLon] = useState('108.0000');
  const [originLabel, setOriginLabel] = useState('Quảng trường Đại Đoàn Kết, TP. Pleiku');
  const [transportMode, setTransportMode] = useState<TransportMode>('MOTORBIKE');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    'NATURE',
    'CULTURE',
    'FOOD',
  ]);
  const [pace, setPace] = useState<'RELAXED' | 'BALANCED' | 'FAST'>('BALANCED');
  const [dietaryNotes, setDietaryNotes] = useState('Thích cà phê và ẩm thực Tây Nguyên');

  const [aiGenerating, setAiGenerating] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [savingToAccount, setSavingToAccount] = useState(false);
  const [proposal, setProposal] = useState<ItineraryProposal | null>(null);

  // 3. Saved Itineraries state
  const [savedList, setSavedList] = useState<SavedItinerarySummary[]>(initialSaved);
  const [selectedDetail, setSelectedDetail] = useState<SavedItineraryDetail | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('Chuyến du lịch Gia Lai');

  function toggleCategory(cat: Category) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  async function handleGenerateProposal(event: FormEvent) {
    event.preventDefault();
    setAiGenerating(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const input: ProposalInput = {
        startDate,
        daysCount,
        partySize,
        totalBudgetVnd,
        origin: {
          latitude: Number(originLat),
          longitude: Number(originLon),
          label: originLabel,
        },
        transportMode,
        preferences: {
          categories: selectedCategories,
          pace,
          dietaryNotes: dietaryNotes.trim() ? dietaryNotes.trim() : null,
        },
      };
      const result = await generateItineraryProposal(input);
      setProposal(result);
      setSaveName(`Khám phá Gia Lai ${daysCount}N${daysCount - 1}Đ`);
      setActionMessage('Đã tạo đề xuất lịch trình thành công với AI!');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể tạo gợi ý lịch trình AI.'));
    } finally {
      setAiGenerating(false);
    }
  }

  async function handleRevalidate() {
    if (!proposal) return;
    setRevalidating(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const input = {
        startDate: proposal.startDate,
        daysCount: proposal.daysCount,
        partySize: proposal.partySize,
        totalBudgetVnd: proposal.totalBudgetVnd,
        origin: proposal.origin,
        transportMode: proposal.transportMode,
        preferences: proposal.preferences,
        days: proposal.days,
      };
      const result = await revalidateItineraryProposal(input);
      setProposal(result);
      setActionMessage('Đã kiểm tra lại tính khả thi và cập nhật chi phí di chuyển/thời gian.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể kiểm tra lại lịch trình.'));
    } finally {
      setRevalidating(false);
    }
  }

  function handleRemoveStop(dayIndex: number, stopIndex: number) {
    if (!proposal) return;
    const updatedDays: ItineraryDay[] = proposal.days.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      const filteredStops = day.stops
        .filter((_, sIdx) => sIdx !== stopIndex)
        .map((s, idx) => ({ ...s, sequenceNo: idx + 1 }));
      return { ...day, stops: filteredStops };
    });
    setProposal({ ...proposal, days: updatedDays });
  }

  async function handleSaveItinerary() {
    if (!proposal) return;
    setSavingToAccount(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const saved = await createMyItinerary({
        name: saveName.trim() || 'Chuyến du lịch Gia Lai',
        startDate: proposal.startDate,
        daysCount: proposal.daysCount,
        partySize: proposal.partySize,
        totalBudgetVnd: proposal.totalBudgetVnd,
        origin: proposal.origin,
        transportMode: proposal.transportMode,
        preferences: proposal.preferences,
        aiRequestId: proposal.aiRequestId,
        days: proposal.days,
      });
      setSelectedDetail(saved);
      setSavedList((prev) => [
        {
          id: saved.id,
          name: saved.name,
          lockVersion: saved.lockVersion,
          currentRevisionId: saved.currentRevisionId,
          startDate: saved.revision?.startDate ?? null,
          daysCount: saved.revision?.daysCount ?? 1,
          partySize: saved.revision?.partySize ?? 1,
          totalBudgetVnd: saved.revision?.totalBudgetVnd ?? '0',
          estimatedTotalVnd: saved.revision?.estimatedTotalVnd ?? '0',
          createdAt: saved.createdAt,
          updatedAt: saved.updatedAt,
        },
        ...prev,
      ]);
      setTab('SAVED');
      setActionMessage(`Đã lưu "${saved.name}" vào danh sách chuyến đi của bạn trong CSDL!`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể lưu chuyến đi lên tài khoản.'));
    } finally {
      setSavingToAccount(false);
    }
  }

  async function handleUpdateSavedRevision() {
    if (!selectedDetail || !selectedDetail.revision) return;
    setSavingToAccount(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const rev = selectedDetail.revision;
      const updated = await updateMyItineraryRevision(selectedDetail.id, {
        baseLockVersion: selectedDetail.lockVersion,
        name: selectedDetail.name,
        startDate: rev.startDate,
        daysCount: rev.daysCount,
        partySize: rev.partySize,
        totalBudgetVnd: rev.totalBudgetVnd,
        origin: rev.origin,
        transportMode: rev.transportMode,
        preferences: rev.preferences,
        aiRequestId: rev.aiRequestId,
        days: rev.days,
      });
      setSelectedDetail(updated);
      setSavedList((prev) =>
        prev.map((item) =>
          item.id === updated.id
            ? {
                ...item,
                name: updated.name,
                lockVersion: updated.lockVersion,
                updatedAt: updated.updatedAt,
              }
            : item,
        ),
      );
      setActionMessage(
        `Đã cập nhật phiên bản mới (Lock Version #${updated.lockVersion}) thành công!`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể cập nhật phiên bản lịch trình.'));
    } finally {
      setSavingToAccount(false);
    }
  }

  async function handleLoadDetail(id: string) {
    setErrorMessage(null);
    try {
      const detail = await getMyItinerary(id);
      setSelectedDetail(detail);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể tải chi tiết chuyến đi.'));
    }
  }

  async function handleRename(id: string) {
    const current = savedList.find((i) => i.id === id);
    const newName = window.prompt('Nhập tên mới cho chuyến đi:', current?.name ?? '');
    if (!newName || !newName.trim()) return;
    try {
      const res = await renameMyItinerary(id, newName.trim());
      setSavedList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: res.name } : item)),
      );
      if (selectedDetail?.id === id) {
        setSelectedDetail({ ...selectedDetail, name: res.name });
      }
      setActionMessage(`Đã đổi tên thành "${res.name}".`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể đổi tên chuyến đi.'));
    }
  }

  async function handleCopy(id: string) {
    try {
      const cloned = await copyMyItinerary(id);
      setSavedList((prev) => [
        {
          id: cloned.id,
          name: cloned.name,
          lockVersion: cloned.lockVersion,
          currentRevisionId: cloned.currentRevisionId,
          startDate: cloned.revision?.startDate ?? null,
          daysCount: cloned.revision?.daysCount ?? 1,
          partySize: cloned.revision?.partySize ?? 1,
          totalBudgetVnd: cloned.revision?.totalBudgetVnd ?? '0',
          estimatedTotalVnd: cloned.revision?.estimatedTotalVnd ?? '0',
          createdAt: cloned.createdAt,
          updatedAt: cloned.updatedAt,
        },
        ...prev,
      ]);
      setActionMessage(`Đã tạo bản sao "${cloned.name}".`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể sao chép chuyến đi.'));
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Bạn có chắc muốn xóa chuyến đi này khỏi tài khoản?')) return;
    try {
      await deleteMyItinerary(id);
      setSavedList((prev) => prev.filter((item) => item.id !== id));
      if (selectedDetail?.id === id) setSelectedDetail(null);
      setActionMessage('Đã xóa mềm chuyến đi.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể xóa chuyến đi.'));
    }
  }

  return (
    <>
      <DatasetNotice dataset={dataset} />
      <div className="section-heading trips-heading">
        <div>
          <p className="eyebrow text-primary-hover">LÊN KẾ HOẠCH &amp; ĐIỀU HÀNH CHUYẾN ĐI</p>
          <h1>Chuyến đi &amp; Lịch trình AI</h1>
          <p>
            Chọn điểm vào bản nháp nhanh hoặc sử dụng trợ lý AI tạo hành trình hoàn chỉnh theo ngân
            sách và giờ mở cửa thực tế.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link className={buttonVariants({ variant: 'secondary' })} to={APP_PATHS.EXPLORE}>
            <Plus size={18} aria-hidden="true" />
            Thêm điểm đến
          </Link>
          <Button
            variant={tab === 'DRAFT' ? 'primary' : 'secondary'}
            onClick={() => setTab('DRAFT')}
          >
            <BookmarkCheck size={16} aria-hidden="true" />
            Bản nháp trong phiên ({draft.places.length})
          </Button>
          <Button
            variant={tab === 'AI_PLANNER' ? 'primary' : 'secondary'}
            onClick={() => setTab('AI_PLANNER')}
          >
            <Sparkles size={16} aria-hidden="true" />
            Tạo lịch trình AI
          </Button>
          {isAuthenticated && (
            <Button
              variant={tab === 'SAVED' ? 'primary' : 'secondary'}
              onClick={() => setTab('SAVED')}
            >
              <Calendar size={16} aria-hidden="true" />
              Đã lưu ({savedList.length})
            </Button>
          )}
        </div>
      </div>

      {actionMessage && (
        <p className="success-note" role="status">
          {actionMessage}
        </p>
      )}
      {errorMessage && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}

      {/* TAB 1: IN-SESSION DRAFT */}
      {tab === 'DRAFT' && (
        <>
          <div className="info-note">
            <Info size={18} aria-hidden="true" />
            <p>
              <strong>Bản nháp trong phiên mở trang.</strong> Tải lại trang sẽ xóa bản nháp. Chưa
              lưu lên tài khoản, chưa tính tuyến hoặc kiểm tra lịch trình khả thi.
            </p>
          </div>
          {!draft.places.length ? (
            <section className="empty-state empty-card">
              <MapPinned size={40} aria-hidden="true" />
              <h2>Hành trình bắt đầu từ một điểm đến</h2>
              <p>Khám phá và chọn những nơi bạn muốn ghé thăm.</p>
              <Link className={buttonVariants()} to={APP_PATHS.EXPLORE}>
                Khám phá địa điểm
              </Link>
            </section>
          ) : (
            <div className="trip-grid">
              <section className="content-card">
                <label className="trip-name">
                  <span>Tên bản nháp</span>
                  <input
                    value={draft.name}
                    onChange={(event) => rename(dataset, event.target.value)}
                    maxLength={100}
                  />
                </label>
                <p className="muted">
                  {draft.places.length}/{MAX_DRAFT_STOPS} điểm · Dùng nút lên/xuống để đổi thứ tự
                </p>
                <ol className="trip-stops">
                  {draft.places.map((place, index) => (
                    <li key={place.id}>
                      <span className="stop-number">{String(index + 1).padStart(2, '0')}</span>
                      <div className="stop-art">
                        <PlaceArtwork category={place.category} />
                      </div>
                      <div className="stop-info">
                        <h3>
                          <Link to={APP_PATHS.place(place.id)}>{place.title}</Link>
                        </h3>
                        <p className="meta-line">
                          <MapPin size={14} aria-hidden="true" />
                          {place.region.name}
                        </p>
                        <p className="muted">
                          {formatDuration(place.typicalDurationMinutes)} ·{' '}
                          {formatVnd(place.referencePriceVnd)}
                        </p>
                      </div>
                      <div className="stop-actions">
                        <Button
                          variant="ghost"
                          aria-label={`Đưa ${place.title} lên`}
                          disabled={index === 0}
                          onClick={() => move(dataset, place.id, -1)}
                        >
                          <ArrowUp size={18} aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          aria-label={`Đưa ${place.title} xuống`}
                          disabled={index === draft.places.length - 1}
                          onClick={() => move(dataset, place.id, 1)}
                        >
                          <ArrowDown size={18} aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          aria-label={`Bỏ ${place.title}`}
                          onClick={() => remove(dataset, place.id)}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
              <aside className="content-card trip-summary">
                <p className="eyebrow text-primary-hover">BẢN NHÁP CỦA BẠN</p>
                <h2>{draft.name.trim() || 'Chuyến đi chưa đặt tên'}</h2>
                <dl className="facts">
                  <div>
                    <dt>
                      <MapPinned size={16} aria-hidden="true" />
                      Điểm dừng
                    </dt>
                    <dd>{draft.places.length} điểm</dd>
                  </div>
                  <div>
                    <dt>
                      <Clock3 size={16} aria-hidden="true" />
                      Thời gian tham quan đã biết
                    </dt>
                    <dd>{durations.length ? formatDuration(duration) : 'Chưa có dữ liệu'}</dd>
                  </div>
                  <div>
                    <dt>Tổng giá tham khảo đã biết</dt>
                    <dd className="summary-price">
                      {priced.length ? formatVnd(subtotal.toString()) : 'Chưa có dữ liệu'}
                    </dd>
                  </div>
                </dl>
                <p className="muted">
                  {priced.length}/{draft.places.length} điểm có giá, {durations.length}/
                  {draft.places.length} điểm có thời lượng.
                </p>
                <Button
                  style={{ width: '100%', marginTop: '16px' }}
                  onClick={() => setTab('AI_PLANNER')}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  Chuyển sang Trợ lý AI lập lịch
                </Button>
              </aside>
            </div>
          )}
        </>
      )}

      {/* TAB 2: AI PLANNER */}
      {tab === 'AI_PLANNER' && (
        <div className="account-grid">
          {/* Form 7 inputs */}
          <div className="content-card account-section-card">
            <div className="card-header-inline">
              <Sparkles size={22} aria-hidden="true" />
              <div>
                <h2>Thông số chuyến đi (7 thông tin cốt lõi)</h2>
                <p className="muted">
                  AI sử dụng giờ mở cửa, đóng cửa tạm thời và tuyến đường thực tế để tối ưu.
                </p>
              </div>
            </div>

            <form className="auth-form" onSubmit={(event) => void handleGenerateProposal(event)}>
              <div className="form-field">
                <label htmlFor="ai-start-date">1. Ngày khởi hành (YYYY-MM-DD)</label>
                <input
                  id="ai-start-date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="ai-days-count">2. Số ngày du lịch ({daysCount} ngày)</label>
                <input
                  id="ai-days-count"
                  type="number"
                  min={1}
                  max={7}
                  required
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label htmlFor="ai-party-size">3. Số lượng du khách ({partySize} người)</label>
                <input
                  id="ai-party-size"
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label htmlFor="ai-budget">4. Tổng ngân sách dự kiến (VND)</label>
                <input
                  id="ai-budget"
                  type="text"
                  required
                  value={totalBudgetVnd}
                  onChange={(e) => setTotalBudgetVnd(e.target.value)}
                />
                <small className="muted">Ước tính: {formatVnd(totalBudgetVnd)}</small>
              </div>

              <div className="form-field">
                <label htmlFor="ai-origin-label">5. Điểm xuất phát</label>
                <input
                  id="ai-origin-label"
                  type="text"
                  value={originLabel}
                  onChange={(e) => setOriginLabel(e.target.value)}
                  placeholder="Ví dụ: Quảng trường Đại Đoàn Kết, TP. Pleiku"
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    aria-label="Vĩ độ xuất phát"
                    type="text"
                    value={originLat}
                    onChange={(e) => setOriginLat(e.target.value)}
                    placeholder="Vĩ độ"
                  />
                  <input
                    aria-label="Kinh độ xuất phát"
                    type="text"
                    value={originLon}
                    onChange={(e) => setOriginLon(e.target.value)}
                    placeholder="Kinh độ"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="ai-transport">6. Phương tiện di chuyển chính</label>
                <select
                  id="ai-transport"
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value as TransportMode)}
                >
                  {(Object.keys(TRANSPORT_MODE_NAMES) as TransportMode[]).map((mode) => (
                    <option key={mode} value={mode}>
                      {TRANSPORT_MODE_NAMES[mode]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>7. Sở thích du lịch &amp; Nhịp độ</label>
                <div className="preference-chips">
                  {(Object.keys(CATEGORY_NAMES) as Category[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`preference-chip ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {CATEGORY_NAMES[cat]}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <label className="preference-chip">
                    <input
                      type="radio"
                      name="pace"
                      checked={pace === 'RELAXED'}
                      onChange={() => setPace('RELAXED')}
                    />
                    <span>Thong thả</span>
                  </label>
                  <label className="preference-chip">
                    <input
                      type="radio"
                      name="pace"
                      checked={pace === 'BALANCED'}
                      onChange={() => setPace('BALANCED')}
                    />
                    <span>Cân bằng</span>
                  </label>
                  <label className="preference-chip">
                    <input
                      type="radio"
                      name="pace"
                      checked={pace === 'FAST'}
                      onChange={() => setPace('FAST')}
                    />
                    <span>Năng động</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Ghi chú sở thích (cà phê, ẩm thực...)"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </div>

              <Button type="submit" loading={aiGenerating}>
                <Sparkles size={16} aria-hidden="true" />
                Lập lịch trình với AI
              </Button>
            </form>
          </div>

          {/* Proposal Result & Timeline */}
          <div className="content-card account-section-card">
            <div className="card-header-inline">
              <Calendar size={22} aria-hidden="true" />
              <div>
                <h2>Đề xuất lịch trình thông minh</h2>
                <p className="muted">
                  Hệ thống kiểm tra độc lập các điều kiện mở cửa, thời gian di chuyển và ngân sách.
                </p>
              </div>
            </div>

            {!proposal ? (
              <p className="muted">
                Điền 7 thông số bên trái và nhấn &quot;Lập lịch trình với AI&quot; để tạo đề xuất.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="consent-title-row">
                  <div>
                    <Badge>
                      {proposal.isValid ? (
                        <>
                          <CheckCircle2 size={14} aria-hidden="true" /> Lịch trình hợp lệ
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={14} aria-hidden="true" /> Có cảnh báo
                        </>
                      )}
                    </Badge>
                    <h3>{saveName}</h3>
                    <p className="muted">
                      Ngân sách: <strong>{formatVnd(proposal.totalBudgetVnd)}</strong> · Chi phí dự
                      tính: <strong>{formatVnd(proposal.estimatedTotalVnd)}</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Button
                      variant="secondary"
                      loading={revalidating}
                      onClick={() => void handleRevalidate()}
                    >
                      <RefreshCw size={14} aria-hidden="true" />
                      Kiểm tra lại (Revalidate)
                    </Button>
                    {isAuthenticated ? (
                      <Button loading={savingToAccount} onClick={() => void handleSaveItinerary()}>
                        <BookmarkCheck size={14} aria-hidden="true" />
                        Lưu vào tài khoản
                      </Button>
                    ) : (
                      <Link
                        to={APP_PATHS.LOGIN}
                        className={buttonVariants({ variant: 'secondary' })}
                      >
                        Đăng nhập để lưu
                      </Link>
                    )}
                  </div>
                </div>

                {proposal.warnings.length > 0 && (
                  <div className="form-error" style={{ borderColor: 'var(--color-warning)' }}>
                    <strong>Cảnh báo khả thi &amp; Ngân sách:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                      {proposal.warnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {proposal.violations.length > 0 && (
                  <div className="form-error">
                    <strong>Vi phạm điều kiện mở cửa / tuyến:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                      {proposal.violations.map((v, idx) => (
                        <li key={idx}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Days timeline */}
                <div className="consent-list">
                  {proposal.days.map((day, dIdx) => (
                    <div key={day.dayNumber} className="consent-item">
                      <h4>
                        Ngày {day.dayNumber} — {formatDate(day.travelDate)}
                      </h4>
                      <ol className="trip-stops" style={{ margin: '8px 0 0' }}>
                        {day.stops.map((stop, sIdx) => {
                          const leg = day.legs.find((l) => l.toStopSequence === stop.sequenceNo);
                          return (
                            <li
                              key={stop.placeId + stop.sequenceNo}
                              style={{ paddingBlock: '12px' }}
                            >
                              <span className="stop-number">#{stop.sequenceNo}</span>
                              <div className="stop-info">
                                <strong>{stop.placeTitle || stop.placeId}</strong>
                                <p className="muted">
                                  {new Date(stop.arrivesAt).toISOString().slice(11, 16)} →{' '}
                                  {new Date(stop.departsAt).toISOString().slice(11, 16)} · Chi phí:{' '}
                                  {formatVnd(String(stop.estimatedCostVnd))}
                                </p>
                                {leg && (
                                  <p className="meta-line">
                                    <ArrowRight size={12} aria-hidden="true" /> Di chuyển: khoảng{' '}
                                    {Math.round(leg.distanceMeters / 1000)} km (
                                    {Math.ceil(leg.durationSeconds / 60)} phút) bằng{' '}
                                    {TRANSPORT_MODE_NAMES[leg.transportMode as TransportMode] ||
                                      leg.transportMode}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                aria-label={`Bỏ điểm ${stop.placeTitle}`}
                                onClick={() => handleRemoveStop(dIdx, sIdx)}
                              >
                                <Trash2 size={16} aria-hidden="true" />
                              </Button>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SAVED ITINERARIES (MARIADB) */}
      {tab === 'SAVED' && (
        <div className="account-grid">
          <div className="content-card account-section-card">
            <div className="card-header-inline">
              <Calendar size={22} aria-hidden="true" />
              <div>
                <h2>Danh sách chuyến đi đã lưu trong CSDL</h2>
                <p className="muted">
                  Hỗ trợ lưu nhiều revision và cơ chế khóa lạc quan (Optimistic Lock) chống ghi đè
                  tab song song.
                </p>
              </div>
            </div>

            {savedList.length === 0 ? (
              <p className="muted">Bạn chưa có chuyến đi nào được lưu trong tài khoản.</p>
            ) : (
              <div className="consent-list">
                {savedList.map((item) => (
                  <div key={item.id} className="consent-item">
                    <div className="consent-title-row">
                      <div>
                        <h3>{item.name}</h3>
                        <p className="muted">
                          {item.daysCount} ngày · {item.partySize} khách · Ngân sách:{' '}
                          {formatVnd(item.totalBudgetVnd)} · Dự tính:{' '}
                          {formatVnd(item.estimatedTotalVnd)}
                          <br />
                          Khóa phiên bản (Lock Version): <strong>#{item.lockVersion}</strong>
                        </p>
                      </div>
                      <div className="consent-actions">
                        <Button variant="secondary" onClick={() => void handleLoadDetail(item.id)}>
                          Xem chi tiết
                        </Button>
                        <Button variant="ghost" onClick={() => void handleRename(item.id)}>
                          <Edit2 size={15} aria-hidden="true" /> Đổi tên
                        </Button>
                        <Button variant="ghost" onClick={() => void handleCopy(item.id)}>
                          <Copy size={15} aria-hidden="true" /> Bản sao
                        </Button>
                        <Button variant="ghost" onClick={() => void handleDelete(item.id)}>
                          <Trash2 size={15} aria-hidden="true" /> Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Itinerary Detail */}
          <div className="content-card account-section-card">
            <div className="card-header-inline">
              <BookmarkCheck size={22} aria-hidden="true" />
              <div>
                <h2>Chi tiết lịch trình đang xem</h2>
                <p className="muted">Xem các ngày dừng, chân chặng và lưu revision mới.</p>
              </div>
            </div>

            {!selectedDetail ? (
              <p className="muted">Chọn một chuyến đi ở cột bên trái để xem chi tiết.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="consent-title-row">
                  <div>
                    <Badge>Lock Version #{selectedDetail.lockVersion}</Badge>
                    <h3>{selectedDetail.name}</h3>
                    <p className="muted">
                      Tạo lúc: {formatDate(selectedDetail.createdAt)} · Cập nhật:{' '}
                      {formatDate(selectedDetail.updatedAt)}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    loading={savingToAccount}
                    onClick={() => void handleUpdateSavedRevision()}
                  >
                    Lưu Revision mới (+1)
                  </Button>
                </div>

                {selectedDetail.revision && (
                  <div className="consent-list">
                    {selectedDetail.revision.days.map((day) => (
                      <div key={day.id || day.dayNumber} className="consent-item">
                        <h4>
                          Ngày {day.dayNumber} ({formatDate(day.travelDate)})
                        </h4>
                        <ol className="trip-stops" style={{ margin: '8px 0 0' }}>
                          {day.stops.map((stop) => (
                            <li key={stop.id || stop.sequenceNo} style={{ paddingBlock: '8px' }}>
                              <span className="stop-number">#{stop.sequenceNo}</span>
                              <div className="stop-info">
                                <strong>{stop.placeTitle || stop.placeId}</strong>
                                <p className="muted">
                                  {new Date(stop.arrivesAt).toISOString().slice(11, 16)} →{' '}
                                  {new Date(stop.departsAt).toISOString().slice(11, 16)} · Chi phí:{' '}
                                  {formatVnd(String(stop.estimatedCostVnd))}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
