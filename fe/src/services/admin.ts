import { get, post } from './api';
import type {
  AdminContentItem,
  AdminContentMeta,
  AdminMediaAsset,
  ContentKind,
  ContentVisibility,
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
