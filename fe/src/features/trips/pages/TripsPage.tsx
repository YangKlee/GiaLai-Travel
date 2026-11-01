import { useEffect, useMemo, useState } from 'react';
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
  Download,
  Edit2,
  ExternalLink,
  HardDriveDownload,
  Info,
  Map as MapIcon,
  MapPin,
  MapPinned,
  Navigation,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Utensils,
  WifiOff,
} from 'lucide-react';
import { APP_PATHS } from '@/constants/path';
import { buttonVariants } from '@/components/ui/button-variants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DatasetNotice } from '@/components/common/DatasetNotice';
import type { tripsLoader } from '@/routes/catalogLoaders';
import { MAX_DRAFT_STOPS, useTripDraftStore } from '@/store/useTripDraftStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import {
  deleteOfflineItinerary,
  downloadItineraryForOffline,
  getOfflineItinerary,
  listOfflineItineraries,
  saveProposalOfflineDirectly,
} from '@/services/offlineStorage';
import type { OfflineItineraryPackage } from '@/services/offlineStorage';
import { formatDuration, formatVnd, formatDate } from '@/utils/format';
import { PlaceArtwork } from '@/features/explore/components/PlaceArtwork';
import { OriginLocationPicker } from '../components/OriginLocationPicker';
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
  ItineraryStop,
  ProposalInput,
  SavedItineraryDetail,
  SavedItinerarySummary,
  TransportMode,
} from '@/services/itineraries';
import type { Category, Place } from '@/features/explore/types/catalog';
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

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  BREAKFAST: '🍜 Ăn sáng / Cà phê sáng',
  CAFE: '☕ Thưởng thức cà phê',
  VISIT: '🌲 Tham quan & Trải nghiệm',
  LUNCH: '🍲 Ăn trưa & Nghỉ ngơi',
  DINNER: '🍽️ Ăn tối ẩm thực bản địa',
  STAY: '🏨 Lưu trú & Nghỉ đêm',
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * Format ISO UTC timestamp into Vietnam local time (GMT+7) HH:mm
 */
function formatVnTime(isoString?: string): string {
  if (!isoString) return '08:00';
  const ms = Date.parse(isoString);
  if (Number.isNaN(ms)) return '08:00';
  const vnDate = new Date(ms + 7 * 3600000);
  return vnDate.toISOString().slice(11, 16);
}

/**
 * Convert Vietnam local time (GMT+7) HH:mm on a given YYYY-MM-DD date to UTC ISO string
 */
function vnTimeToUtcIso(travelDate: string, hhmm: string): string {
  const cleanTime = /^\d{2}:\d{2}$/.test(hhmm) ? hhmm : '08:00';
  const utcEquivalentMs = Date.parse(`${travelDate}T${cleanTime}:00.000Z`) - 7 * 3600000;
  return new Date(utcEquivalentMs).toISOString();
}

function buildFallbackDayGoogleMapsUrl(
  origin: { latitude: number; longitude: number },
  stops: ItineraryStop[],
  transportMode: string,
): string {
  const validStops = stops.filter((s) => s.latitude != null && s.longitude != null);
  const mode =
    transportMode === 'WALK' ? 'walking' : transportMode === 'BUS' ? 'transit' : 'driving';
  if (validStops.length === 0) {
    return `https://www.google.com/maps/search/?api=1&query=${origin.latitude},${origin.longitude}`;
  }
  const last = validStops[validStops.length - 1];
  const waypoints = validStops
    .slice(0, -1)
    .map((s) => `${s.latitude},${s.longitude}`)
    .join('|');
  const wp = waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : '';
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${last.latitude},${last.longitude}${wp}&travelmode=${mode}`;
}

export default function TripsPage() {
  const {
    dataset,
    availablePlaces = [],
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

  // 2. AI Generator state (7 core inputs + pre-selected places + custom natural prompt)
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
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);
  const [showPlacePicker, setShowPlacePicker] = useState(false);

  const [aiGenerating, setAiGenerating] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [savingToAccount, setSavingToAccount] = useState(false);
  const [savingOfflineDirect, setSavingOfflineDirect] = useState(false);
  const [proposal, setProposal] = useState<ItineraryProposal | null>(null);

  // Step 2 customization state (inline stop editor & add-stop form + Google Maps preview)
  const [editingStopKey, setEditingStopKey] = useState<string | null>(null);
  const [editArriveTime, setEditArriveTime] = useState('07:00');
  const [editDepartTime, setEditDepartTime] = useState('07:30');
  const [editActivityType, setEditActivityType] = useState('BREAKFAST');
  const [editStopNote, setEditStopNote] = useState('');

  const [addingToDayIndex, setAddingToDayIndex] = useState<number | null>(null);
  const [newStopPlaceId, setNewStopPlaceId] = useState<string>('');
  const [newStopActivityType, setNewStopActivityType] = useState<string>('BREAKFAST');
  const [newStopArriveTime, setNewStopArriveTime] = useState<string>('07:00');
  const [newStopDepartTime, setNewStopDepartTime] = useState<string>('07:30');
  const [newStopNote, setNewStopNote] = useState<string>('');

  const [activeMapDay, setActiveMapDay] = useState<number>(1);
  const [showEmbeddedMap, setShowEmbeddedMap] = useState<boolean>(true);

  // 3. Saved Itineraries & Offline packages state
  const [savedList, setSavedList] = useState<SavedItinerarySummary[]>(initialSaved);
  const [selectedDetail, setSelectedDetail] = useState<SavedItineraryDetail | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveName, setSaveName] = useState('Chuyến du lịch Gia Lai');

  const currentUser = useAuthStore((s) => s.user);
  const effectiveUserId = currentUser?.id || 'guest-local';
  const { isOnline } = useNetworkStatus();
  const [offlinePackages, setOfflinePackages] = useState<Record<string, OfflineItineraryPackage>>(
    {},
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isViewingOffline, setIsViewingOffline] = useState(false);

  // Merge availablePlaces from loader with draft places so picker always has options
  const allKnownPlaces = useMemo(() => {
    const map = new Map<string, Place>();
    for (const p of availablePlaces) map.set(p.id, p);
    for (const p of draft.places) {
      if (!map.has(p.id)) map.set(p.id, p);
    }
    return Array.from(map.values());
  }, [availablePlaces, draft.places]);

  useEffect(() => {
    let mounted = true;
    void listOfflineItineraries(effectiveUserId).then((pkgs) => {
      if (!mounted) return;
      const map: Record<string, OfflineItineraryPackage> = {};
      for (const p of pkgs) map[p.itineraryId] = p;
      setOfflinePackages(map);
    });
    return () => {
      mounted = false;
    };
  }, [effectiveUserId]);

  function toggleCategory(cat: Category) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function togglePreselectedPlace(placeId: string) {
    setSelectedPlaceIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId],
    );
  }

  function handleImportFromDraft() {
    const ids = draft.places.map((p) => p.id);
    setSelectedPlaceIds(ids);
    setShowPlacePicker(true);
    setTab('AI_PLANNER');
    setActionMessage(
      `Đã nạp ${ids.length} địa điểm từ Bản nháp vào bộ lập lịch AI. Nhấn "Lập lịch trình với AI" để sắp xếp giờ đến/đi và tuyến đường!`,
    );
  }

  async function handleGenerateProposal(event: FormEvent) {
    event.preventDefault();
    setAiGenerating(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const cleanNotes = dietaryNotes.trim() ? dietaryNotes.trim() : null;
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
          dietaryNotes: cleanNotes,
          ...(cleanNotes ? { customPrompt: cleanNotes } : {}),
          ...(selectedPlaceIds.length > 0 ? { selectedPlaceIds } : {}),
        },
        ...(selectedPlaceIds.length > 0 ? { selectedPlaceIds } : {}),
        ...(cleanNotes ? { customPrompt: cleanNotes } : {}),
      };
      const result = await generateItineraryProposal(input);
      setProposal(result);
      setActiveMapDay(1);
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

  function handleMoveStop(dayIndex: number, stopIndex: number, direction: -1 | 1) {
    if (!proposal) return;
    const updatedDays: ItineraryDay[] = proposal.days.map((day, dIdx) => {
      if (dIdx !== dayIndex) return day;
      const targetIdx = stopIndex + direction;
      if (targetIdx < 0 || targetIdx >= day.stops.length) return day;
      const nextStops = [...day.stops];
      // Swap the two stops while keeping their time slots in chronological sequence
      const slotA = {
        arrivesAt: nextStops[stopIndex].arrivesAt,
        departsAt: nextStops[stopIndex].departsAt,
      };
      const slotB = {
        arrivesAt: nextStops[targetIdx].arrivesAt,
        departsAt: nextStops[targetIdx].departsAt,
      };
      const temp = nextStops[stopIndex];
      nextStops[stopIndex] = {
        ...nextStops[targetIdx],
        arrivesAt: slotA.arrivesAt,
        departsAt: slotA.departsAt,
      };
      nextStops[targetIdx] = {
        ...temp,
        arrivesAt: slotB.arrivesAt,
        departsAt: slotB.departsAt,
      };
      return {
        ...day,
        stops: nextStops.map((s, idx) => ({ ...s, sequenceNo: idx + 1 })),
      };
    });
    setProposal({ ...proposal, days: updatedDays });
    setActionMessage(
      'Đã đổi thứ tự địa điểm trong ngày. Nhấn "Kiểm tra lại (Revalidate)" để cập nhật khoảng cách & thời gian di chuyển thực tế.',
    );
  }

  function startEditingStop(dayIndex: number, stopIndex: number, stop: ItineraryStop) {
    const key = `${dayIndex}-${stopIndex}`;
    setEditingStopKey(key);
    setEditArriveTime(formatVnTime(stop.arrivesAt));
    setEditDepartTime(formatVnTime(stop.departsAt));
    setEditActivityType(stop.activityType || 'VISIT');
    setEditStopNote(stop.note || '');
  }

  function saveEditedStop(dayIndex: number, stopIndex: number) {
    if (!proposal) return;
    const day = proposal.days[dayIndex];
    if (!day) return;
    const arrivesAt = vnTimeToUtcIso(day.travelDate, editArriveTime);
    const departsAt = vnTimeToUtcIso(day.travelDate, editDepartTime);
    if (new Date(departsAt) <= new Date(arrivesAt)) {
      setErrorMessage('Giờ rời đi phải sau giờ đến (ví dụ: 07:00 → 07:30).');
      return;
    }
    setErrorMessage(null);
    const updatedDays: ItineraryDay[] = proposal.days.map((d, dIdx) => {
      if (dIdx !== dayIndex) return d;
      const stops = d.stops.map((s, sIdx) => {
        if (sIdx !== stopIndex) return s;
        return {
          ...s,
          arrivesAt,
          departsAt,
          activityType: editActivityType,
          note:
            editStopNote.trim() ||
            `${editArriveTime} - ${editDepartTime}: ${s.placeTitle || 'Tham quan'}`,
        };
      });
      return { ...d, stops };
    });
    setProposal({ ...proposal, days: updatedDays });
    setEditingStopKey(null);
    setActionMessage(
      'Đã cập nhật khung giờ & hoạt động của điểm dừng. Nhấn "Kiểm tra lại (Revalidate)" để tính lại lộ trình.',
    );
  }

  function openAddStopForm(dayIndex: number) {
    setAddingToDayIndex(dayIndex);
    if (!newStopPlaceId && allKnownPlaces.length > 0) {
      setNewStopPlaceId(allKnownPlaces[0].id);
    }
    setNewStopActivityType('BREAKFAST');
    setNewStopArriveTime('07:00');
    setNewStopDepartTime('07:30');
    setNewStopNote('07:00 - 07:30: Ăn sáng & chuẩn bị xuất phát');
  }

  function handleAddStopToDay(dayIndex: number) {
    if (!proposal || !newStopPlaceId) return;
    const day = proposal.days[dayIndex];
    if (!day) return;
    const chosenPlace = allKnownPlaces.find((p) => p.id === newStopPlaceId);
    if (!chosenPlace) return;

    const arrivesAt = vnTimeToUtcIso(day.travelDate, newStopArriveTime);
    const departsAt = vnTimeToUtcIso(day.travelDate, newStopDepartTime);
    if (new Date(departsAt) <= new Date(arrivesAt)) {
      setErrorMessage('Giờ rời đi phải sau giờ đến (ví dụ: 07:00 → 07:30).');
      return;
    }
    setErrorMessage(null);

    const unitCost = Number(chosenPlace.referencePriceVnd || 0);
    const newStop: ItineraryStop = {
      placeId: chosenPlace.id,
      placeTitle: chosenPlace.title,
      placeCategory: chosenPlace.category,
      latitude: chosenPlace.latitude,
      longitude: chosenPlace.longitude,
      activityType: newStopActivityType,
      sequenceNo: day.stops.length + 1,
      arrivesAt,
      departsAt,
      estimatedCostVnd: unitCost * proposal.partySize,
      note:
        newStopNote.trim() || `${newStopArriveTime} - ${newStopDepartTime}: ${chosenPlace.title}`,
    };

    const updatedDays: ItineraryDay[] = proposal.days.map((d, dIdx) => {
      if (dIdx !== dayIndex) return d;
      const merged = [...d.stops, newStop]
        .sort((a, b) => Date.parse(a.arrivesAt) - Date.parse(b.arrivesAt))
        .map((s, idx) => ({ ...s, sequenceNo: idx + 1 }));
      return { ...d, stops: merged };
    });

    setProposal({ ...proposal, days: updatedDays });
    setAddingToDayIndex(null);
    setActionMessage(
      `Đã thêm "${chosenPlace.title}" (${newStopArriveTime} - ${newStopDepartTime}) vào Ngày ${day.dayNumber}. Nhấn "Kiểm tra lại (Revalidate)" để cập nhật tuyến đường!`,
    );
  }

  async function handleSaveProposalOfflineDirect() {
    if (!proposal) return;
    setSavingOfflineDirect(true);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const pkg = await saveProposalOfflineDirectly(effectiveUserId, saveName, proposal);
      setOfflinePackages((prev) => ({ ...prev, [pkg.itineraryId]: pkg }));
      setSelectedDetail(pkg.detail);
      setSavedList((prev) => {
        if (prev.some((i) => i.id === pkg.itineraryId)) return prev;
        return [
          {
            id: pkg.itineraryId,
            name: pkg.name,
            lockVersion: pkg.packageVersion,
            currentRevisionId: pkg.detail.currentRevisionId,
            startDate: proposal.startDate,
            daysCount: proposal.daysCount,
            partySize: proposal.partySize,
            totalBudgetVnd: proposal.totalBudgetVnd,
            estimatedTotalVnd: proposal.estimatedTotalVnd,
            createdAt: pkg.downloadedAt,
            updatedAt: pkg.downloadedAt,
          },
          ...prev,
        ];
      });
      setActionMessage(
        `Đã lưu lộ trình "${pkg.name}" vào bộ nhớ ngoại tuyến trên thiết bị (${Math.max(1, Math.round(pkg.sizeBytes / 1024))} KB) phòng khi không có mạng!`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể lưu lộ trình ngoại tuyến vào máy.'));
    } finally {
      setSavingOfflineDirect(false);
    }
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
      // Also cache offline snapshot automatically for resilience when offline
      try {
        const offlineSnap = await saveProposalOfflineDirectly(
          effectiveUserId,
          saved.name,
          proposal,
          saved.id,
        );
        setOfflinePackages((prev) => ({ ...prev, [saved.id]: offlineSnap }));
      } catch {
        // Ignore offline cache fallback error
      }
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

  async function handleDownloadOffline(itineraryId: string) {
    if (!currentUser?.id) return;
    setDownloadingId(itineraryId);
    setDownloadProgress(10);
    setErrorMessage(null);
    setActionMessage(null);
    try {
      const pkg = await downloadItineraryForOffline(currentUser.id, itineraryId, (_step, pct) => {
        setDownloadProgress(pct);
      });
      setOfflinePackages((prev) => ({ ...prev, [itineraryId]: pkg }));
      setActionMessage(
        `Đã tải trọn gói ngoại tuyến cho "${pkg.name}" (${Math.round(pkg.sizeBytes / 1024)} KB) thành công!`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể tải gói ngoại tuyến.'));
    } finally {
      setDownloadingId(null);
      setDownloadProgress(0);
    }
  }

  async function handleDeleteOffline(itineraryId: string) {
    try {
      await deleteOfflineItinerary(effectiveUserId, itineraryId);
      setOfflinePackages((prev) => {
        const next = { ...prev };
        delete next[itineraryId];
        return next;
      });
      if (itineraryId.startsWith('local-')) {
        setSavedList((prev) => prev.filter((item) => item.id !== itineraryId));
      }
      if (selectedDetail?.id === itineraryId && isViewingOffline) {
        setIsViewingOffline(false);
      }
      setActionMessage('Đã xóa dữ liệu ngoại tuyến của chuyến đi khỏi thiết bị.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể xóa dữ liệu ngoại tuyến.'));
    }
  }

  async function handleLoadDetail(id: string, forceOffline = false) {
    setErrorMessage(null);
    if (forceOffline || !isOnline || id.startsWith('local-')) {
      const pkg = offlinePackages[id] || (await getOfflineItinerary(effectiveUserId, id));
      if (pkg) {
        setSelectedDetail(pkg.detail);
        setIsViewingOffline(true);
        setActionMessage(
          `Đang xem bản ngoại tuyến của "${pkg.name}" (Lưu lúc: ${formatDate(pkg.downloadedAt)}).`,
        );
        return;
      }
      if (!isOnline) {
        setErrorMessage(
          'Thiết bị đang ngoại tuyến và chuyến đi này chưa được tải về máy trước đó.',
        );
        return;
      }
    }
    try {
      const detail = await getMyItinerary(id);
      setSelectedDetail(detail);
      setIsViewingOffline(false);
    } catch (error) {
      const pkg = offlinePackages[id] || (await getOfflineItinerary(effectiveUserId, id));
      if (pkg) {
        setSelectedDetail(pkg.detail);
        setIsViewingOffline(true);
        setActionMessage(
          `Mạng gián đoạn. Đã chuyển sang bản ngoại tuyến (tải lúc ${formatDate(pkg.downloadedAt)}).`,
        );
        return;
      }
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
      if (id.startsWith('local-')) {
        await handleDeleteOffline(id);
        return;
      }
      await deleteMyItinerary(id);
      setSavedList((prev) => prev.filter((item) => item.id !== id));
      if (selectedDetail?.id === id) setSelectedDetail(null);
      setActionMessage('Đã xóa mềm chuyến đi.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Không thể xóa chuyến đi.'));
    }
  }

  const currentMapDayObj =
    proposal?.days.find((d) => d.dayNumber === activeMapDay) ?? proposal?.days[0] ?? null;

  return (
    <>
      <DatasetNotice dataset={dataset} />
      <div className="section-heading trips-heading">
        <div>
          <h1>Chuyến đi &amp; Lịch trình AI</h1>
          <p>
            Chọn điểm vào bản nháp nhanh hoặc sử dụng trợ lý AI tối ưu hóa lộ trình theo ngân sách,
            giờ đến/đi và bản đồ Google Maps.
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
            Bản nháp ({draft.places.length})
          </Button>
          <Button
            variant={tab === 'AI_PLANNER' ? 'primary' : 'secondary'}
            onClick={() => setTab('AI_PLANNER')}
          >
            <Sparkles size={16} aria-hidden="true" />
            Tạo lịch trình AI
          </Button>
          {(isAuthenticated || Object.keys(offlinePackages).length > 0 || savedList.length > 0) && (
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
              Chọn trước các địa điểm yêu thích rồi chuyển sang AI để tự động tối ưu hóa lộ trình,
              thời gian di chuyển và Google Maps.
            </p>
          </div>
          {!draft.places.length ? (
            <section className="empty-state empty-card">
              <MapPinned size={40} aria-hidden="true" />
              <h2>Hành trình bắt đầu từ một điểm đến</h2>
              <p>
                Khám phá và chọn những nơi bạn muốn ghé thăm hoặc để AI đề xuất toàn bộ lộ trình.
              </p>
              <div
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}
              >
                <Link className={buttonVariants()} to={APP_PATHS.EXPLORE}>
                  Khám phá địa điểm
                </Link>
                <Button variant="secondary" onClick={() => setTab('AI_PLANNER')}>
                  <Sparkles size={16} aria-hidden="true" />
                  Nhờ AI gợi ý lộ trình hoàn toàn
                </Button>
              </div>
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
                        {place.bestTimeToVisit && (
                          <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#b45309' }}>
                            ✨ Thời gian vàng: <strong>{place.bestTimeToVisit}</strong>
                          </p>
                        )}
                      </div>
                      <div className="stop-actions">
                        <Button
                          variant="ghost"
                          className="stop-action-btn"
                          aria-label={`Đưa ${place.title} lên`}
                          disabled={index === 0}
                          onClick={() => move(dataset, place.id, -1)}
                        >
                          <ArrowUp size={18} aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="stop-action-btn"
                          aria-label={`Đưa ${place.title} xuống`}
                          disabled={index === draft.places.length - 1}
                          onClick={() => move(dataset, place.id, 1)}
                        >
                          <ArrowDown size={18} aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="stop-action-btn stop-delete-btn"
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
                  onClick={() => handleImportFromDraft()}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  AI lập lộ trình từ {draft.places.length} điểm này
                </Button>
              </aside>
            </div>
          )}
        </>
      )}

      {/* TAB 2: AI PLANNER (3-STEP SMART ITINERARY WORKFLOW) */}
      {tab === 'AI_PLANNER' && (
        <>
          {/* 3-Step Workflow Stepper */}
          <div className="ai-stepper" aria-label="Quy trình lập lịch trình">
            <div className="ai-step active">
              <span className="ai-step-num">1</span>
              <div>
                <strong>Thông số &amp; Sở thích</strong>
                <small>Thời gian, người, ngân sách &amp; điểm đón</small>
              </div>
            </div>
            <div className="ai-step">
              <span className="ai-step-num">2</span>
              <div>
                <strong>Lộ trình AI &amp; Bản đồ</strong>
                <small>Khung giờ, quãng đường &amp; Google Maps</small>
              </div>
            </div>
            <div className="ai-step">
              <span className="ai-step-num">3</span>
              <div>
                <strong>Lưu &amp; Ngoại tuyến</strong>
                <small>Tải về máy dùng khi mất sóng</small>
              </div>
            </div>
          </div>

          <div className="account-grid ai-planner-grid">
            {/* STEP 1: Form 7 inputs + Custom AI Demand + Pre-selected Places */}
            <div className="content-card account-section-card">
              <div className="card-header-inline">
                <Sparkles size={22} aria-hidden="true" />
                <div>
                  <h2>Thông số chuyến đi</h2>
                  <p className="muted">
                    Dữ liệu giờ mở cửa, giá vé và khoảng cách thực tế tại Gia Lai.
                  </p>
                </div>
              </div>

              <form className="auth-form" onSubmit={(event) => void handleGenerateProposal(event)}>
                <div className="form-field">
                  <label htmlFor="ai-start-date">Ngày khởi hành (YYYY-MM-DD)</label>
                  <input
                    id="ai-start-date"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div className="form-field">
                    <label htmlFor="ai-days-count">Số ngày ({daysCount} ngày)</label>
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
                    <label htmlFor="ai-party-size">Số khách ({partySize} người)</label>
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
                </div>

                <div className="form-field">
                  <label htmlFor="ai-budget">Tổng ngân sách dự kiến (VND)</label>
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
                  <OriginLocationPicker
                    label={originLabel}
                    latitude={originLat}
                    longitude={originLon}
                    onChange={({ label, latitude, longitude }) => {
                      setOriginLabel(label);
                      setOriginLat(latitude);
                      setOriginLon(longitude);
                    }}
                    availablePlaces={allKnownPlaces}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="ai-transport">Phương tiện di chuyển chính</label>
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
                  <label>Sở thích du lịch &amp; Nhịp độ</label>
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
                  <div className="pace-options">
                    <label className="preference-chip">
                      <input
                        type="radio"
                        name="pace"
                        checked={pace === 'RELAXED'}
                        onChange={() => setPace('RELAXED')}
                      />
                      <span>Thong thả (2-3 điểm/ngày)</span>
                    </label>
                    <label className="preference-chip">
                      <input
                        type="radio"
                        name="pace"
                        checked={pace === 'BALANCED'}
                        onChange={() => setPace('BALANCED')}
                      />
                      <span>Cân bằng (3-4 điểm/ngày)</span>
                    </label>
                    <label className="preference-chip">
                      <input
                        type="radio"
                        name="pace"
                        checked={pace === 'FAST'}
                        onChange={() => setPace('FAST')}
                      />
                      <span>Năng động (4-5 điểm/ngày)</span>
                    </label>
                  </div>
                </div>

                {/* Natural Language Prompt / Specific Schedule Demand */}
                <div className="form-field">
                  <label htmlFor="ai-custom-prompt">
                    8. Nói nhu cầu &amp; lịch trình mong muốn cho AI (Ăn sáng / Giờ xuất phát / Ăn
                    nghỉ)
                  </label>
                  <textarea
                    id="ai-custom-prompt"
                    rows={3}
                    placeholder="Nhập yêu cầu cụ thể cho AI (giờ ăn sáng, giờ xuất phát, món ăn, nơi nghỉ...)"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    <button
                      type="button"
                      className="preference-chip"
                      style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                      onClick={() =>
                        setDietaryNotes((prev) =>
                          prev
                            ? `${prev}. Ưu tiên xếp đúng thời gian vàng để ngắm bình minh và hoàng hôn đẹp nhất.`
                            : 'Ưu tiên xếp các điểm tham quan theo đúng thời gian vàng (săn mây, ngắm bình minh và hoàng hôn).',
                        )
                      }
                    >
                      ✨ Tối ưu theo thời gian vàng (bình minh / hoàng hôn)
                    </button>
                    <button
                      type="button"
                      className="preference-chip"
                      style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                      onClick={() =>
                        setDietaryNotes((prev) =>
                          prev
                            ? `${prev}. Ăn sáng đặc sản lúc 07:00, xuất phát lúc 07:30.`
                            : '07:00 ăn sáng đặc sản Pleiku, 07:30 xuất phát tham quan.',
                        )
                      }
                    >
                      🍜 Ăn sáng 07:00, xuất phát 07:30
                    </button>
                  </div>
                </div>

                {/* Optional Pre-selected Places ("Hoặc chọn các địa điểm trước, xong AI đưa ra lộ trình") */}
                <div className="form-field">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <label style={{ margin: 0 }}>
                      9. Chọn trước địa điểm muốn đi ({selectedPlaceIds.length} đã chọn — Tùy chọn)
                    </label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {draft.places.length > 0 && (
                        <button
                          type="button"
                          className="preference-chip"
                          onClick={() => {
                            setSelectedPlaceIds(draft.places.map((p) => p.id));
                            setShowPlacePicker(true);
                          }}
                        >
                          Lấy từ Bản nháp ({draft.places.length})
                        </button>
                      )}
                      <button
                        type="button"
                        className="preference-chip"
                        onClick={() => setShowPlacePicker((prev) => !prev)}
                      >
                        {showPlacePicker ? 'Thu gọn danh sách' : 'Chọn địa điểm trước'}
                      </button>
                      {selectedPlaceIds.length > 0 && (
                        <button
                          type="button"
                          className="preference-chip"
                          onClick={() => setSelectedPlaceIds([])}
                        >
                          Bỏ chọn tất cả
                        </button>
                      )}
                    </div>
                  </div>
                  <small className="muted">
                    Để trống nếu muốn AI tự động gợi ý 100%, hoặc tích chọn trước các điểm bạn muốn
                    ghé để AI sắp xếp lộ trình tối ưu.
                  </small>

                  {showPlacePicker && allKnownPlaces.length > 0 && (
                    <div
                      style={{
                        maxHeight: '210px',
                        overflowY: 'auto',
                        border: '1px solid var(--color-border, #e2e8f0)',
                        borderRadius: '8px',
                        padding: '8px',
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {allKnownPlaces.map((place) => {
                        const checked = selectedPlaceIds.includes(place.id);
                        return (
                          <label
                            key={place.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              background: checked ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePreselectedPlace(place.id)}
                            />
                            <div style={{ flex: 1 }}>
                              <strong>{place.title}</strong>{' '}
                              <span className="muted" style={{ fontSize: '0.82rem' }}>
                                ({CATEGORY_NAMES[place.category]} ·{' '}
                                {formatDuration(place.typicalDurationMinutes)} ·{' '}
                                {formatVnd(place.referencePriceVnd)})
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={!isOnline} loading={aiGenerating}>
                  <Sparkles size={16} aria-hidden="true" />
                  {isOnline ? 'Lập lịch trình với AI' : 'AI cần kết nối mạng'}
                </Button>
              </form>
            </div>

            {/* STEP 2 & 3: Proposal Result, Google Maps Route Integration, Customize & Save Offline */}
            <div className="content-card account-section-card">
              <div className="card-header-inline">
                <Calendar size={22} aria-hidden="true" />
                <div>
                  <h2>Đề xuất lịch trình thông minh </h2>
                  <p className="muted">
                    Chi tiết giờ đến/đi (GMT+7), khoảng cách, thời gian xuất phát di chuyển thực tế,
                    địa điểm ăn/nghỉ và tùy chỉnh trực tiếp.
                  </p>
                </div>
              </div>

              {!proposal ? (
                <p className="muted">
                  Điền thông số bên trái và nhấn &quot;Lập lịch trình với AI&quot; để AI tạo lộ
                  trình chi tiết theo ngày.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Header & Step 3 Save Actions */}
                  <div className="consent-title-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                      >
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
                        {proposal.aiProvider && (
                          <Badge>
                            <Sparkles size={12} aria-hidden="true" /> AI:{' '}
                            {proposal.aiProvider === 'google-gemini'
                              ? `Google Gemini (${proposal.aiModel || 'gemini'})`
                              : proposal.aiProvider === 'openai'
                                ? `OpenAI (${proposal.aiModel || 'gpt'})`
                                : 'GiaLai Smart Planner AI'}
                          </Badge>
                        )}
                      </div>

                      <div style={{ marginTop: '8px' }}>
                        <label
                          htmlFor="save-itinerary-name"
                          className="muted"
                          style={{ fontSize: '0.82rem', display: 'block' }}
                        >
                          Tên lộ trình để lưu:
                        </label>
                        <input
                          id="save-itinerary-name"
                          type="text"
                          value={saveName}
                          onChange={(e) => setSaveName(e.target.value)}
                          style={{
                            fontWeight: 600,
                            fontSize: '1.05rem',
                            padding: '6px 10px',
                            marginTop: '2px',
                            width: '100%',
                            maxWidth: '360px',
                          }}
                        />
                      </div>

                      <p className="muted" style={{ marginTop: '6px' }}>
                        Ngân sách: <strong>{formatVnd(proposal.totalBudgetVnd)}</strong> · Chi phí
                        dự tính: <strong>{formatVnd(proposal.estimatedTotalVnd)}</strong> · Phương
                        tiện:{' '}
                        <strong>
                          {TRANSPORT_MODE_NAMES[proposal.transportMode] || proposal.transportMode}
                        </strong>
                      </p>
                      {proposal.summary && (
                        <p
                          style={{
                            margin: '8px 0 0',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.08)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <strong>Gợi ý từ AI:</strong> {proposal.summary}
                        </p>
                      )}
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
                      <Button
                        variant="secondary"
                        loading={savingOfflineDirect}
                        onClick={() => void handleSaveProposalOfflineDirect()}
                        title="Lưu lộ trình trực tiếp vào bộ nhớ thiết bị để mở xem khi không có mạng"
                      >
                        <HardDriveDownload size={14} aria-hidden="true" />
                        Lưu Offline vào máy
                      </Button>
                      {isAuthenticated ? (
                        <Button
                          loading={savingToAccount}
                          onClick={() => void handleSaveItinerary()}
                        >
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

                  {/* Integrated Google Maps Multi-Stop Route Panel */}
                  {currentMapDayObj && (
                    <div
                      style={{
                        border: '1px solid var(--color-border, #cbd5e1)',
                        borderRadius: '12px',
                        padding: '14px',
                        background: 'var(--color-surface, #f8fafc)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <MapIcon size={18} aria-hidden="true" />
                          <strong>Lộ trình tích hợp Google Maps:</strong>
                          {proposal.days.map((d) => (
                            <button
                              key={d.dayNumber}
                              type="button"
                              className={`preference-chip ${activeMapDay === d.dayNumber ? 'selected' : ''}`}
                              style={{ padding: '4px 10px', fontSize: '0.82rem' }}
                              onClick={() => setActiveMapDay(d.dayNumber)}
                            >
                              Ngày {d.dayNumber}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="preference-chip"
                            style={{ fontSize: '0.82rem', padding: '4px 10px' }}
                            onClick={() => setShowEmbeddedMap((prev) => !prev)}
                          >
                            {showEmbeddedMap ? 'Ẩn bản đồ nhúng' : 'Hiện bản đồ nhúng'}
                          </button>
                          <a
                            href={
                              currentMapDayObj.googleMapsDayRouteUrl ||
                              buildFallbackDayGoogleMapsUrl(
                                proposal.origin,
                                currentMapDayObj.stops,
                                proposal.transportMode,
                              )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({ variant: 'secondary' })}
                            style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                          >
                            <Navigation size={14} aria-hidden="true" />
                            Mở lộ trình Ngày {currentMapDayObj.dayNumber} trên Google Maps
                            <ExternalLink size={12} aria-hidden="true" />
                          </a>
                        </div>
                      </div>

                      {/* Route chain summary (Origin -> Stop 1 -> Stop 2 -> ...) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap',
                          fontSize: '0.85rem',
                          marginBottom: showEmbeddedMap ? '10px' : '0',
                        }}
                      >
                        <Badge>🚩 Xuất phát: {proposal.origin.label || 'Trung tâm Pleiku'}</Badge>
                        {currentMapDayObj.stops.map((st) => {
                          const leg = currentMapDayObj.legs.find(
                            (l) => l.toStopSequence === st.sequenceNo,
                          );
                          return (
                            <span
                              key={st.placeId + st.sequenceNo}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <span className="muted">
                                ➔{' '}
                                {leg
                                  ? `(${(leg.distanceMeters / 1000).toFixed(1)}km · ${Math.ceil(leg.durationSeconds / 60)}p)`
                                  : ''}{' '}
                                ➔
                              </span>
                              <Badge>
                                #{st.sequenceNo} {formatVnTime(st.arrivesAt)}-
                                {formatVnTime(st.departsAt)}: {st.placeTitle || st.placeId}
                              </Badge>
                            </span>
                          );
                        })}
                      </div>

                      {showEmbeddedMap && (
                        <div
                          style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border, #e2e8f0)',
                          }}
                        >
                          <iframe
                            title={`Bản đồ lộ trình Ngày ${currentMapDayObj.dayNumber}`}
                            width="100%"
                            height="250"
                            style={{ border: 0, display: 'block' }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://maps.google.com/maps?q=${
                              currentMapDayObj.stops[0]?.latitude ?? proposal.origin.latitude
                            },${
                              currentMapDayObj.stops[0]?.longitude ?? proposal.origin.longitude
                            }&z=12&output=embed`}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Days timeline with explicit Departure/Transit blocks & Step 2 Customization */}
                  <div className="consent-list">
                    {proposal.days.map((day, dIdx) => (
                      <div key={day.dayNumber} className="consent-item">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          <div>
                            <h4>
                              Ngày {day.dayNumber} — {formatDate(day.travelDate)}
                            </h4>
                            {day.daySummary && (
                              <p
                                className="muted"
                                style={{ margin: '2px 0 0', fontSize: '0.88rem' }}
                              >
                                {day.daySummary}
                              </p>
                            )}
                          </div>
                          <a
                            href={
                              day.googleMapsDayRouteUrl ||
                              buildFallbackDayGoogleMapsUrl(
                                proposal.origin,
                                day.stops,
                                proposal.transportMode,
                              )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="preference-chip"
                            style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                          >
                            <MapPin size={13} aria-hidden="true" /> Lộ trình Google Maps Ngày{' '}
                            {day.dayNumber}
                          </a>
                        </div>

                        <ol className="trip-stops" style={{ margin: '10px 0 0' }}>
                          {day.stops.map((stop, sIdx) => {
                            const leg = day.legs.find((l) => l.toStopSequence === stop.sequenceNo);
                            const prevStop = sIdx > 0 ? day.stops[sIdx - 1] : null;
                            const stopArriveVn = formatVnTime(stop.arrivesAt);
                            const stopDepartVn = formatVnTime(stop.departsAt);
                            const transitStartVn = prevStop
                              ? formatVnTime(prevStop.departsAt)
                              : leg?.departsAt
                                ? formatVnTime(leg.departsAt)
                                : stopArriveVn;
                            const isEditing = editingStopKey === `${dIdx}-${sIdx}`;
                            const activityBadge =
                              ACTIVITY_TYPE_LABELS[stop.activityType || ''] ||
                              (stop.placeCategory === 'FOOD'
                                ? '🍜 Ẩm thực / Ăn nghỉ'
                                : stop.placeCategory === 'STAY'
                                  ? '🏨 Lưu trú / Nghỉ ngơi'
                                  : '📍 Điểm tham quan');

                            return (
                              <li
                                key={stop.placeId + stop.sequenceNo}
                                style={{
                                  paddingBlock: '12px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'stretch',
                                  gap: '8px',
                                }}
                              >
                                {/* Explicit Departure & Transit Leg Banner */}
                                {leg && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      flexWrap: 'wrap',
                                      gap: '8px',
                                      padding: '8px 12px',
                                      borderRadius: '8px',
                                      background: 'rgba(59, 130, 246, 0.08)',
                                      fontSize: '0.84rem',
                                      lineHeight: 1.45,
                                    }}
                                  >
                                    <span style={{ minWidth: 0, flex: '1 1 200px' }}>
                                      <ArrowRight
                                        size={13}
                                        aria-hidden="true"
                                        style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}
                                      />
                                      <strong>
                                        {transitStartVn} → {stopArriveVn} · Xuất phát di chuyển:
                                      </strong>{' '}
                                      Từ{' '}
                                      <em>
                                        {leg.fromLabel ||
                                          (prevStop
                                            ? prevStop.placeTitle
                                            : proposal.origin.label || 'Điểm xuất phát')}
                                      </em>{' '}
                                      đến <em>{stop.placeTitle || stop.placeId}</em> · Khoảng cách:{' '}
                                      <strong>
                                        {Math.max(
                                          0.1,
                                          Number((leg.distanceMeters / 1000).toFixed(1)),
                                        )}{' '}
                                        km
                                      </strong>{' '}
                                      ({Math.ceil(leg.durationSeconds / 60)} phút thực tế bằng{' '}
                                      {TRANSPORT_MODE_NAMES[leg.transportMode as TransportMode] ||
                                        leg.transportMode}
                                      {leg.estimatedCostVnd > 0
                                        ? ` · ~${formatVnd(String(leg.estimatedCostVnd))}`
                                        : ''}
                                      )
                                    </span>
                                    {leg.googleMapsDirectionsUrl && (
                                      <a
                                        href={leg.googleMapsDirectionsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          fontWeight: 600,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          flexShrink: 0,
                                          padding: '4px 8px',
                                          borderRadius: '6px',
                                          background: 'rgba(59, 130, 246, 0.12)',
                                          textDecoration: 'none',
                                        }}
                                      >
                                        <Navigation size={12} aria-hidden="true" /> Bản đồ chặng
                                      </a>
                                    )}
                                  </div>
                                )}

                                {/* Main Stop Row */}
                                <div className="itinerary-stop-row">
                                  <div className="itinerary-stop-main">
                                    <span className="stop-number">#{stop.sequenceNo}</span>
                                    <div className="stop-info">
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          flexWrap: 'wrap',
                                        }}
                                      >
                                        <strong className="stop-title">{stop.placeTitle || stop.placeId}</strong>
                                        <Badge>{activityBadge}</Badge>
                                        <Badge>
                                          <Clock3 size={12} aria-hidden="true" /> {stopArriveVn} →{' '}
                                          {stopDepartVn}
                                        </Badge>
                                        {stop.bestTimeToVisit && (
                                          <span
                                            style={{
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                              padding: '2px 8px',
                                              borderRadius: '12px',
                                              fontSize: '0.78rem',
                                              background: '#fef3c7',
                                              color: '#92400e',
                                              fontWeight: 600,
                                              border: '1px solid #fde68a',
                                            }}
                                          >
                                            ✨ Thời gian vàng: {stop.bestTimeToVisit}
                                          </span>
                                        )}
                                      </div>

                                      <p className="muted" style={{ marginTop: '4px' }}>
                                        Khung giờ: <strong>{stopArriveVn}</strong> →{' '}
                                        <strong>{stopDepartVn}</strong> · Chi phí dự tính:{' '}
                                        <strong>{formatVnd(String(stop.estimatedCostVnd))}</strong>
                                        {stop.latitude != null && stop.longitude != null && (
                                          <>
                                            {' '}
                                            ·{' '}
                                            <a
                                              href={`https://www.google.com/maps/search/?api=1&query=${stop.latitude},${stop.longitude}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Tọa độ ({Number(stop.latitude).toFixed(4)},{' '}
                                              {Number(stop.longitude).toFixed(4)})
                                            </a>
                                          </>
                                        )}
                                      </p>

                                      {stop.note && (
                                        <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>
                                          <Utensils
                                            size={13}
                                            aria-hidden="true"
                                            style={{
                                              display: 'inline',
                                              verticalAlign: 'middle',
                                              marginRight: '4px',
                                            }}
                                          />
                                          {stop.note}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Step 2 Customize Controls: Up / Down / Edit / Remove */}
                                  <div className="itinerary-stop-actions">
                                    <Button
                                      variant="ghost"
                                      className="stop-action-btn"
                                      disabled={sIdx === 0}
                                      aria-label={`Đưa điểm ${stop.placeTitle} lên`}
                                      title="Đổi lên trước"
                                      onClick={() => handleMoveStop(dIdx, sIdx, -1)}
                                    >
                                      <ArrowUp size={15} aria-hidden="true" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="stop-action-btn"
                                      disabled={sIdx === day.stops.length - 1}
                                      aria-label={`Đưa điểm ${stop.placeTitle} xuống`}
                                      title="Đổi xuống sau"
                                      onClick={() => handleMoveStop(dIdx, sIdx, 1)}
                                    >
                                      <ArrowDown size={15} aria-hidden="true" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="stop-action-btn"
                                      aria-label={`Chỉnh giờ điểm ${stop.placeTitle}`}
                                      title="Tùy chỉnh giờ đến/đi & ghi chú ăn/nghỉ"
                                      onClick={() => startEditingStop(dIdx, sIdx, stop)}
                                    >
                                      <Edit2 size={15} aria-hidden="true" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="stop-action-btn stop-delete-btn"
                                      aria-label={`Bỏ điểm ${stop.placeTitle}`}
                                      title="Xóa điểm dừng này"
                                      onClick={() => handleRemoveStop(dIdx, sIdx)}
                                    >
                                      <Trash2 size={16} aria-hidden="true" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Inline Stop Time & Activity Editor */}
                                {isEditing && (
                                  <div
                                    style={{
                                      padding: '10px',
                                      borderRadius: '8px',
                                      border: '1px solid var(--color-border, #cbd5e1)',
                                      background: 'var(--color-surface, #f8fafc)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '8px',
                                    }}
                                  >
                                    <strong>
                                      Tùy chỉnh khung giờ &amp; hoạt động cho {stop.placeTitle}:
                                    </strong>
                                    <div
                                      style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                        gap: '8px',
                                      }}
                                    >
                                      <label className="form-field" style={{ margin: 0 }}>
                                        <span>Giờ đến (GMT+7)</span>
                                        <input
                                          type="time"
                                          value={editArriveTime}
                                          onChange={(e) => setEditArriveTime(e.target.value)}
                                        />
                                      </label>
                                      <label className="form-field" style={{ margin: 0 }}>
                                        <span>Giờ đi / xuất phát</span>
                                        <input
                                          type="time"
                                          value={editDepartTime}
                                          onChange={(e) => setEditDepartTime(e.target.value)}
                                        />
                                      </label>
                                      <label className="form-field" style={{ margin: 0 }}>
                                        <span>Loại hoạt động</span>
                                        <select
                                          value={editActivityType}
                                          onChange={(e) => setEditActivityType(e.target.value)}
                                        >
                                          {Object.entries(ACTIVITY_TYPE_LABELS).map(
                                            ([code, label]) => (
                                              <option key={code} value={code}>
                                                {label}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </label>
                                    </div>
                                    <label className="form-field" style={{ margin: 0 }}>
                                      <span>
                                        Ghi chú hoạt động (VD: 07:00-07:30 ăn sáng, 07:30 xuất phát)
                                      </span>
                                      <input
                                        type="text"
                                        value={editStopNote}
                                        onChange={(e) => setEditStopNote(e.target.value)}
                                      />
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                      <Button
                                        variant="primary"
                                        onClick={() => saveEditedStop(dIdx, sIdx)}
                                      >
                                        Áp dụng thay đổi
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        onClick={() => setEditingStopKey(null)}
                                      >
                                        Hủy
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ol>

                        {/* Add Stop to Day Form (Step 2 Customization) */}
                        <div style={{ marginTop: '10px' }}>
                          {addingToDayIndex === dIdx ? (
                            <div
                              style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border, #cbd5e1)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                              }}
                            >
                              <strong>
                                Thêm điểm ăn sáng / tham quan / nghỉ ngơi vào Ngày {day.dayNumber}:
                              </strong>
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                  gap: '8px',
                                }}
                              >
                                <label className="form-field" style={{ margin: 0 }}>
                                  <span>Chọn địa điểm</span>
                                  <select
                                    value={newStopPlaceId}
                                    onChange={(e) => setNewStopPlaceId(e.target.value)}
                                  >
                                    {allKnownPlaces.map((p) => (
                                      <option key={p.id} value={p.id}>
                                        {p.title} ({CATEGORY_NAMES[p.category]})
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="form-field" style={{ margin: 0 }}>
                                  <span>Hoạt động</span>
                                  <select
                                    value={newStopActivityType}
                                    onChange={(e) => setNewStopActivityType(e.target.value)}
                                  >
                                    {Object.entries(ACTIVITY_TYPE_LABELS).map(([code, label]) => (
                                      <option key={code} value={code}>
                                        {label}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="form-field" style={{ margin: 0 }}>
                                  <span>Giờ đến (GMT+7)</span>
                                  <input
                                    type="time"
                                    value={newStopArriveTime}
                                    onChange={(e) => setNewStopArriveTime(e.target.value)}
                                  />
                                </label>
                                <label className="form-field" style={{ margin: 0 }}>
                                  <span>Giờ đi / xuất phát</span>
                                  <input
                                    type="time"
                                    value={newStopDepartTime}
                                    onChange={(e) => setNewStopDepartTime(e.target.value)}
                                  />
                                </label>
                              </div>
                              <label className="form-field" style={{ margin: 0 }}>
                                <span>Ghi chú hoạt động</span>
                                <input
                                  type="text"
                                  value={newStopNote}
                                  onChange={(e) => setNewStopNote(e.target.value)}
                                  placeholder="VD: 07:00 - 07:30 ăn sáng, 07:30 xuất phát đi điểm tiếp theo"
                                />
                              </label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <Button variant="primary" onClick={() => handleAddStopToDay(dIdx)}>
                                  Thêm vào Ngày {day.dayNumber}
                                </Button>
                                <Button variant="ghost" onClick={() => setAddingToDayIndex(null)}>
                                  Đóng
                                </Button>
                              </div>
                            </div>
                          ) : (
                            allKnownPlaces.length > 0 && (
                              <Button variant="ghost" onClick={() => openAddStopForm(dIdx)}>
                                <Plus size={15} aria-hidden="true" /> Thêm điểm ăn sáng / tham quan
                                / nghỉ ngơi vào Ngày {day.dayNumber}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* TAB 3: SAVED ITINERARIES (MARIADB & OFFLINE STORAGE) */}
      {tab === 'SAVED' && (
        <div className="account-grid">
          <div className="content-card account-section-card">
            <div className="card-header-inline">
              <Calendar size={22} aria-hidden="true" />
              <div>
                <h2>Danh sách chuyến đi đã lưu trong CSDL</h2>
                <p className="muted">
                  Hỗ trợ lưu nhiều revision, khóa lạc quan (Optimistic Lock) và lưu trữ ngoại tuyến
                  (Offline) phòng khi mất kết nối mạng.
                </p>
              </div>
            </div>

            {savedList.length === 0 ? (
              <p className="muted">Bạn chưa có chuyến đi nào được lưu.</p>
            ) : (
              <div className="consent-list">
                {savedList.map((item) => {
                  const offlinePkg = offlinePackages[item.id];
                  const isDownloading = downloadingId === item.id;
                  const isLocalOnly = item.id.startsWith('local-');
                  return (
                    <div key={item.id} className="consent-item">
                      <div className="consent-title-row">
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <h3>{item.name}</h3>
                            {offlinePkg && (
                              <Badge>
                                <HardDriveDownload size={12} aria-hidden="true" /> Đã lưu ngoại
                                tuyến (v{offlinePkg.packageVersion} ·{' '}
                                {Math.max(1, Math.round(offlinePkg.sizeBytes / 1024))} KB)
                              </Badge>
                            )}
                          </div>
                          <p className="muted">
                            {item.daysCount} ngày · {item.partySize} khách · Ngân sách:{' '}
                            {formatVnd(item.totalBudgetVnd)} · Dự tính:{' '}
                            {formatVnd(item.estimatedTotalVnd)}
                            <br />
                            Khóa phiên bản (Lock Version): <strong>#{item.lockVersion}</strong>
                          </p>
                        </div>
                        <div className="consent-actions" style={{ flexWrap: 'wrap' }}>
                          <Button
                            variant="secondary"
                            onClick={() => void handleLoadDetail(item.id, isLocalOnly)}
                          >
                            Xem chi tiết
                          </Button>
                          {offlinePkg ? (
                            <>
                              <Button
                                variant="ghost"
                                onClick={() => void handleLoadDetail(item.id, true)}
                                title="Mở bản đọc ngoại tuyến lưu trên máy"
                              >
                                <HardDriveDownload size={15} aria-hidden="true" /> Đọc offline
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => void handleDeleteOffline(item.id)}
                                title="Xóa dữ liệu ngoại tuyến của chuyến đi này"
                              >
                                Xóa offline
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              disabled={!isOnline || isDownloading}
                              onClick={() => void handleDownloadOffline(item.id)}
                              title="Tải trọn gói để xem khi mất sóng tại Gia Lai"
                            >
                              <Download size={15} aria-hidden="true" />
                              {isDownloading ? `Đang tải ${downloadProgress}%` : 'Tải offline'}
                            </Button>
                          )}
                          {!isLocalOnly && (
                            <>
                              <Button
                                variant="ghost"
                                disabled={!isOnline}
                                onClick={() => void handleRename(item.id)}
                              >
                                <Edit2 size={15} aria-hidden="true" /> Đổi tên
                              </Button>
                              <Button
                                variant="ghost"
                                disabled={!isOnline}
                                onClick={() => void handleCopy(item.id)}
                              >
                                <Copy size={15} aria-hidden="true" /> Bản sao
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            disabled={!isOnline && !isLocalOnly}
                            onClick={() => void handleDelete(item.id)}
                          >
                            <Trash2 size={15} aria-hidden="true" /> Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Itinerary Detail */}
          <div className="content-card account-section-card">
            <div className="card-header-inline">
              <BookmarkCheck size={22} aria-hidden="true" />
              <div>
                <h2>Chi tiết lịch trình đang xem</h2>
                <p className="muted">
                  Xem các ngày dừng, chân chặng di chuyển, lộ trình Google Maps và lưu revision mới.
                </p>
              </div>
            </div>

            {!selectedDetail ? (
              <p className="muted">Chọn một chuyến đi ở cột bên trái để xem chi tiết.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="consent-title-row">
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Badge>Lock Version #{selectedDetail.lockVersion}</Badge>
                      {(isViewingOffline || !isOnline) && (
                        <Badge>
                          <WifiOff size={12} aria-hidden="true" /> Bản Ngoại tuyến (Chỉ đọc)
                        </Badge>
                      )}
                    </div>
                    <h3>{selectedDetail.name}</h3>
                    <p className="muted">
                      Tạo lúc: {formatDate(selectedDetail.createdAt)} · Cập nhật:{' '}
                      {formatDate(selectedDetail.updatedAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedDetail.revision && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setProposal(selectedDetail.revision);
                          setSaveName(selectedDetail.name);
                          setTab('AI_PLANNER');
                        }}
                      >
                        <Edit2 size={14} aria-hidden="true" /> Mở trong bộ tùy chỉnh
                      </Button>
                    )}
                    {!selectedDetail.id.startsWith('local-') && (
                      <Button
                        variant="primary"
                        disabled={isViewingOffline || !isOnline}
                        title={
                          isViewingOffline || !isOnline
                            ? 'Cần kết nối mạng để lưu bản sửa đổi'
                            : undefined
                        }
                        loading={savingToAccount}
                        onClick={() => void handleUpdateSavedRevision()}
                      >
                        Lưu Revision mới (+1)
                      </Button>
                    )}
                  </div>
                </div>

                {selectedDetail.revision && (
                  <div className="consent-list">
                    {selectedDetail.revision.days.map((day) => (
                      <div key={day.id || day.dayNumber} className="consent-item">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px',
                          }}
                        >
                          <h4>
                            Ngày {day.dayNumber} ({formatDate(day.travelDate)})
                          </h4>
                          {day.googleMapsDayRouteUrl && (
                            <a
                              href={day.googleMapsDayRouteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="preference-chip"
                              style={{ fontSize: '0.8rem', textDecoration: 'none' }}
                            >
                              <Navigation size={12} aria-hidden="true" /> Mở lộ trình Google Maps
                            </a>
                          )}
                        </div>
                        <ol className="trip-stops" style={{ margin: '8px 0 0' }}>
                          {day.stops.map((stop) => {
                            const leg = day.legs?.find((l) => l.toStopSequence === stop.sequenceNo);
                            return (
                              <li key={stop.id || stop.sequenceNo} style={{ paddingBlock: '8px', alignItems: 'flex-start' }}>
                                <span className="stop-number">#{stop.sequenceNo}</span>
                                <div className="stop-info">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <strong>{stop.placeTitle || stop.placeId}</strong>
                                    {stop.bestTimeToVisit && (
                                      <span
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          padding: '1px 7px',
                                          borderRadius: '10px',
                                          fontSize: '0.75rem',
                                          background: '#fef3c7',
                                          color: '#92400e',
                                          fontWeight: 600,
                                          border: '1px solid #fde68a',
                                        }}
                                      >
                                        ✨ Thời gian vàng: {stop.bestTimeToVisit}
                                      </span>
                                    )}
                                  </div>
                                  <p className="muted">
                                    {formatVnTime(stop.arrivesAt)} → {formatVnTime(stop.departsAt)}{' '}
                                    · Chi phí: {formatVnd(String(stop.estimatedCostVnd))}
                                  </p>
                                  {stop.note && <p style={{ margin: '2px 0 0' }}>{stop.note}</p>}
                                  {leg && (
                                    <p className="meta-line">
                                      <ArrowRight size={12} aria-hidden="true" /> Di chuyển:{' '}
                                      {Math.max(
                                        0.1,
                                        Number((leg.distanceMeters / 1000).toFixed(1)),
                                      )}{' '}
                                      km (~{Math.ceil(leg.durationSeconds / 60)} phút)
                                    </p>
                                  )}
                                </div>
                              </li>
                            );
                          })}
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
