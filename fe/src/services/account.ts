import { get, patch, post, put } from './api';
import type {
  ConsentDecision,
  ConsentPurpose,
  ConsentState,
  PreferenceCatalog,
  PrivacyExportPackage,
  PrivacyRequestItem,
  PrivacyRequestListState,
  PrivacyRequestType,
  PrivacyRetentionSummary,
  UserPreferences,
  UserProfile,
} from '@/features/auth/types/auth';

export async function getMyProfile(signal?: AbortSignal): Promise<UserProfile> {
  const response = await get<{ data: UserProfile }>('/api/v1/me/profile', signal);
  return response.data;
}

export async function updateMyProfile(input: {
  displayName: string;
  phone: string | null;
}): Promise<UserProfile> {
  const response = await patch<{ data: UserProfile }, typeof input>('/api/v1/me/profile', input);
  return response.data;
}

export async function getMyPreferences(
  signal?: AbortSignal,
): Promise<{ preferences: UserPreferences; catalog: PreferenceCatalog }> {
  const response = await get<{
    data: { preferences: UserPreferences; catalog: PreferenceCatalog };
  }>('/api/v1/me/preferences', signal);
  return response.data;
}

export async function updateMyPreferences(
  input: UserPreferences,
): Promise<{ preferences: UserPreferences; catalog: PreferenceCatalog }> {
  const response = await put<
    { data: { preferences: UserPreferences; catalog: PreferenceCatalog } },
    UserPreferences
  >('/api/v1/me/preferences', input);
  return response.data;
}

export async function getMyConsents(signal?: AbortSignal): Promise<ConsentState> {
  const response = await get<{ data: ConsentState }>('/api/v1/me/consents', signal);
  return response.data;
}

export async function recordMyConsent(input: {
  purpose: ConsentPurpose;
  granted: boolean;
}): Promise<ConsentState & { decision: ConsentDecision }> {
  const response = await post<{ data: ConsentState & { decision: ConsentDecision } }, typeof input>(
    '/api/v1/me/consents',
    input,
  );
  return response.data;
}

export async function listMyPrivacyRequests(
  signal?: AbortSignal,
): Promise<PrivacyRequestListState> {
  const response = await get<{ data: PrivacyRequestListState }>(
    '/api/v1/me/privacy-requests',
    signal,
  );
  return response.data;
}

export async function createMyPrivacyRequest(input: {
  requestType: PrivacyRequestType;
  password: string;
}): Promise<{ request: PrivacyRequestItem; retentionSummary: PrivacyRetentionSummary }> {
  const response = await post<
    { data: { request: PrivacyRequestItem; retentionSummary: PrivacyRetentionSummary } },
    typeof input
  >('/api/v1/me/privacy-requests', input);
  return response.data;
}

export async function downloadMyPrivacyExport(requestId: string): Promise<PrivacyExportPackage> {
  const response = await get<{ data: PrivacyExportPackage }>(
    `/api/v1/me/privacy-requests/${encodeURIComponent(requestId)}/export`,
  );
  return response.data;
}
