import { del, get, post, put } from './api';
import type {
  AdminContentItem,
  AdminContentMeta,
  AdminEventItem,
  AdminMediaAsset,
  AdminPlaceItem,
  AdminR2UploadResult,
  AdminWardItem,
  Category,
  ContentKind,
  ContentVisibility,
  EventStatus,
  OpeningHour,
} from '@/features/explore/types/catalog';

export async function getAdminContentMeta(signal?: AbortSignal): Promise<AdminContentMeta> {
  const response = await get<{ data: AdminContentMeta }>('/api/v1/admin/meta', signal);
  return response.data;
}

export async function listAdminContents(
  query?: URLSearchParams,
  signal?: AbortSignal,
): Promise<{
  data: AdminContentItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}> {
  const qs = query?.toString() ? `?${query.toString()}` : '';
  return get(`/api/v1/admin/contents${qs}`, signal);
}

export async function createAdminContent(input: {
  kind: ContentKind;
  title: string;
  body: string;
  transcript?: string | null;
  audioAssetId?: string | null;
  sourceReference?: string | null;
  submitImmediately?: boolean;
  payload: Record<string, unknown>;
}): Promise<AdminContentItem> {
  const response = await post<{ data: AdminContentItem }, typeof input>(
    '/api/v1/admin/contents',
    input,
  );
  return response.data;
}

export async function createAdminRevision(
  contentId: string,
  input: {
    title: string;
    body: string;
    transcript?: string | null;
    audioAssetId?: string | null;
    sourceReference?: string | null;
    submitImmediately?: boolean;
    payload: Record<string, unknown>;
  },
): Promise<AdminContentItem> {
  const response = await post<{ data: AdminContentItem }, typeof input>(
    `/api/v1/admin/contents/${encodeURIComponent(contentId)}/revisions`,
    input,
  );
  return response.data;
}

export async function submitAdminRevision(
  contentId: string,
  revisionId: string,
): Promise<AdminContentItem> {
  const response = await post<{ data: AdminContentItem }, Record<string, never>>(
    `/api/v1/admin/contents/${encodeURIComponent(contentId)}/revisions/${encodeURIComponent(revisionId)}/submit`,
    {},
  );
  return response.data;
}

export async function reviewAdminRevision(
  contentId: string,
  revisionId: string,
  input: {
    decision: 'APPROVE' | 'REJECT';
    rejectionReason?: string;
    sourceReference?: string;
  },
): Promise<AdminContentItem> {
  const response = await post<{ data: AdminContentItem }, typeof input>(
    `/api/v1/admin/contents/${encodeURIComponent(contentId)}/revisions/${encodeURIComponent(revisionId)}/review`,
    input,
  );
  return response.data;
}

export async function updateAdminContentVisibility(
  contentId: string,
  visibility: ContentVisibility,
): Promise<AdminContentItem> {
  const response = await post<{ data: AdminContentItem }, { visibility: ContentVisibility }>(
    `/api/v1/admin/contents/${encodeURIComponent(contentId)}/visibility`,
    { visibility },
  );
  return response.data;
}

export async function createAdminMediaAsset(input: {
  mediaType: 'IMAGE' | 'AUDIO' | 'DOCUMENT';
  mimeType: string;
  storageKey: string;
  byteSize?: number;
  sha256Hex?: string;
  contentBase64?: string;
  sourceReference: string;
  licenseNote: string;
  offlineAllowed?: boolean;
}): Promise<AdminMediaAsset> {
  const response = await post<{ data: AdminMediaAsset }, typeof input>(
    '/api/v1/admin/media-assets',
    input,
  );
  return response.data;
}

export interface CreateAdminPlaceInput {
  title: string;
  description: string;
  category: Category;
  regionId: string;
  wardId?: string | null;
  latitude: number;
  longitude: number;
  referencePriceVnd?: string | number | null;
  typicalDurationMinutes?: number | null;
  bestTimeToVisit?: string | null;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  sourceReference?: string | null;
  openingHours?: OpeningHour[];
}

export interface CreateAdminEventInput {
  title: string;
  description: string;
  placeId: string;
  startsAt: string;
  endsAt: string;
  eventStatus?: EventStatus;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  sourceReference?: string | null;
}

export async function listAdminPlaces(
  params?: { q?: string; category?: string; regionId?: string; page?: number; pageSize?: number },
  signal?: AbortSignal,
): Promise<{
  data: AdminPlaceItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.category) query.set('category', params.category);
  if (params?.regionId) query.set('regionId', params.regionId);
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  const qs = query.toString() ? `?${query.toString()}` : '';
  return get(`/api/v1/admin/places${qs}`, signal);
}

export async function getAdminPlace(id: string, signal?: AbortSignal): Promise<AdminPlaceItem> {
  const res = await get<{ data: AdminPlaceItem }>(
    `/api/v1/admin/places/${encodeURIComponent(id)}`,
    signal,
  );
  return res.data;
}

export async function createAdminPlace(input: CreateAdminPlaceInput): Promise<AdminPlaceItem> {
  const res = await post<{ data: AdminPlaceItem }, CreateAdminPlaceInput>(
    '/api/v1/admin/places',
    input,
  );
  return res.data;
}

export async function updateAdminPlace(
  id: string,
  input: Partial<CreateAdminPlaceInput>,
): Promise<AdminPlaceItem> {
  const res = await put<{ data: AdminPlaceItem }, Partial<CreateAdminPlaceInput>>(
    `/api/v1/admin/places/${encodeURIComponent(id)}`,
    input,
  );
  return res.data;
}

export async function deleteAdminPlace(id: string): Promise<{ success: boolean; message: string }> {
  const res = await del<{ data: { success: boolean; message: string } }>(
    `/api/v1/admin/places/${encodeURIComponent(id)}`,
  );
  return res.data;
}

export async function listAdminWards(
  params?: { q?: string; regionId?: string; status?: string; page?: number; pageSize?: number },
  signal?: AbortSignal,
): Promise<{
  data: AdminWardItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.regionId) query.set('regionId', params.regionId);
  if (params?.status) query.set('status', params.status);
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  const qs = query.toString() ? `?${query.toString()}` : '';
  return get(`/api/v1/admin/wards${qs}`, signal);
}

export async function getAdminWard(id: string, signal?: AbortSignal): Promise<AdminWardItem> {
  const res = await get<{ data: AdminWardItem }>(
    `/api/v1/admin/wards/${encodeURIComponent(id)}`,
    signal,
  );
  return res.data;
}

export async function createAdminWard(input: {
  regionId: string;
  code: string;
  name: string;
  status?: 'ACTIVE' | 'INACTIVE';
}): Promise<AdminWardItem> {
  const res = await post<{ data: AdminWardItem }, typeof input>(
    '/api/v1/admin/wards',
    input,
  );
  return res.data;
}

export async function updateAdminWard(
  id: string,
  input: Partial<{
    regionId: string;
    code: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
  }>,
): Promise<AdminWardItem> {
  const res = await put<{ data: AdminWardItem }, typeof input>(
    `/api/v1/admin/wards/${encodeURIComponent(id)}`,
    input,
  );
  return res.data;
}

export async function deleteAdminWard(id: string): Promise<{ success: boolean; message: string }> {
  const res = await del<{ data: { success: boolean; message: string } }>(
    `/api/v1/admin/wards/${encodeURIComponent(id)}`,
  );
  return res.data;
}

export async function listAdminEvents(
  params?: { q?: string; status?: string; placeId?: string; page?: number; pageSize?: number },
  signal?: AbortSignal,
): Promise<{
  data: AdminEventItem[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.status) query.set('status', params.status);
  if (params?.placeId) query.set('placeId', params.placeId);
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  const qs = query.toString() ? `?${query.toString()}` : '';
  return get(`/api/v1/admin/events${qs}`, signal);
}

export async function getAdminEvent(id: string, signal?: AbortSignal): Promise<AdminEventItem> {
  const res = await get<{ data: AdminEventItem }>(
    `/api/v1/admin/events/${encodeURIComponent(id)}`,
    signal,
  );
  return res.data;
}

export async function createAdminEvent(input: CreateAdminEventInput): Promise<AdminEventItem> {
  const res = await post<{ data: AdminEventItem }, CreateAdminEventInput>(
    '/api/v1/admin/events',
    input,
  );
  return res.data;
}

export async function updateAdminEvent(
  id: string,
  input: Partial<CreateAdminEventInput>,
): Promise<AdminEventItem> {
  const res = await put<{ data: AdminEventItem }, Partial<CreateAdminEventInput>>(
    `/api/v1/admin/events/${encodeURIComponent(id)}`,
    input,
  );
  return res.data;
}

export async function deleteAdminEvent(id: string): Promise<{ success: boolean; message: string }> {
  const res = await del<{ data: { success: boolean; message: string } }>(
    `/api/v1/admin/events/${encodeURIComponent(id)}`,
  );
  return res.data;
}

export async function uploadAdminR2Image(
  file: File,
  folder: 'events' | 'places' | 'banners' = 'events',
): Promise<AdminR2UploadResult> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error('Không thể đọc tệp hình ảnh.'));
    reader.readAsDataURL(file);
  });

  const response = await post<
    { data: AdminR2UploadResult },
    { fileName: string; mimeType: string; contentBase64: string; folder: string }
  >('/api/v1/admin/upload-r2', {
    fileName: file.name,
    mimeType: file.type,
    contentBase64: base64,
    folder,
  });
  return response.data;
}
