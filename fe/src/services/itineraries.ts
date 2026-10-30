import { get, post, put, patch, del } from './api';
import type { Category } from '@/features/explore/types/catalog';

export type TransportMode = 'MOTORBIKE' | 'CAR' | 'TAXI' | 'BUS' | 'WALK' | 'MIXED';

export interface ProposalInput {
  startDate: string;
  daysCount: number;
  partySize: number;
  totalBudgetVnd: string;
  origin: {
    latitude: number;
    longitude: number;
    label?: string;
  };
  transportMode: TransportMode;
  preferences?: {
    categories?: Category[];
    pace?: 'RELAXED' | 'BALANCED' | 'FAST';
    dietaryNotes?: string | null;
  };
}

export interface ItineraryStop {
  id?: string;
  placeId: string;
  placeTitle?: string;
  contentRevisionId?: string;
  eventId?: string | null;
  sequenceNo: number;
  arrivesAt: string;
  departsAt: string;
  estimatedCostVnd: number;
  note?: string | null;
}

export interface ItineraryLeg {
  id?: string;
  fromStopSequence?: number | null;
  toStopSequence: number;
  distanceMeters: number;
  durationSeconds: number;
  transportMode: string;
  provider: string;
  sourceReference: string;
  estimatedCostVnd: number;
}

export interface ItineraryDay {
  id?: string;
  dayNumber: number;
  travelDate: string;
  stops: ItineraryStop[];
  legs: ItineraryLeg[];
}

export interface ItineraryProposal {
  startDate: string;
  daysCount: number;
  partySize: number;
  totalBudgetVnd: string;
  estimatedTotalVnd: string;
  origin: {
    latitude: number;
    longitude: number;
    label?: string;
  };
  transportMode: TransportMode;
  preferences: {
    categories?: Category[];
    pace?: 'RELAXED' | 'BALANCED' | 'FAST';
    dietaryNotes?: string | null;
  };
  warnings: string[];
  violations: string[];
  isValid: boolean;
  aiRequestId: string | null;
  promptExcerpt?: string | null;
  days: ItineraryDay[];
}

export interface SavedItinerarySummary {
  id: string;
  name: string;
  lockVersion: number;
  currentRevisionId: string | null;
  startDate: string | null;
  daysCount: number;
  partySize: number;
  totalBudgetVnd: string;
  estimatedTotalVnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedItineraryDetail {
  id: string;
  ownerId: string;
  name: string;
  lockVersion: number;
  currentRevisionId: string | null;
  createdAt: string;
  updatedAt: string;
  revision:
    | (ItineraryProposal & {
        id: string;
        revisionNo: number;
        validatedAt: string;
      })
    | null;
}

export async function generateItineraryProposal(input: ProposalInput): Promise<ItineraryProposal> {
  const response = await post<{ data: ItineraryProposal }, ProposalInput>(
    '/api/v1/itinerary-proposals',
    input,
  );
  return response.data;
}

export async function revalidateItineraryProposal(
  input: ProposalInput & { days: ItineraryDay[] },
): Promise<ItineraryProposal> {
  const response = await post<{ data: ItineraryProposal }, typeof input>(
    '/api/v1/itinerary-proposals/revalidate',
    input,
  );
  return response.data;
}

export async function listMyItineraries(signal?: AbortSignal): Promise<SavedItinerarySummary[]> {
  const response = await get<{ data: SavedItinerarySummary[] }>('/api/v1/me/itineraries', signal);
  return response.data;
}

export async function getMyItinerary(
  id: string,
  signal?: AbortSignal,
): Promise<SavedItineraryDetail> {
  const response = await get<{ data: SavedItineraryDetail }>(
    `/api/v1/me/itineraries/${encodeURIComponent(id)}`,
    signal,
  );
  return response.data;
}

export async function createMyItinerary(
  input: {
    name: string;
  } & ProposalInput & {
      days: ItineraryDay[];
      aiRequestId?: string | null;
    },
): Promise<SavedItineraryDetail> {
  const response = await post<{ data: SavedItineraryDetail }, typeof input>(
    '/api/v1/me/itineraries',
    input,
  );
  return response.data;
}

export async function updateMyItineraryRevision(
  id: string,
  input: {
    baseLockVersion: number;
    name?: string;
  } & ProposalInput & {
      days: ItineraryDay[];
      aiRequestId?: string | null;
    },
): Promise<SavedItineraryDetail> {
  const response = await put<{ data: SavedItineraryDetail }, typeof input>(
    `/api/v1/me/itineraries/${encodeURIComponent(id)}/revisions`,
    input,
  );
  return response.data;
}

export async function renameMyItinerary(
  id: string,
  name: string,
): Promise<{ id: string; name: string }> {
  const response = await patch<{ data: { id: string; name: string } }, { name: string }>(
    `/api/v1/me/itineraries/${encodeURIComponent(id)}`,
    { name },
  );
  return response.data;
}

export async function copyMyItinerary(id: string): Promise<SavedItineraryDetail> {
  const response = await post<{ data: SavedItineraryDetail }, Record<string, never>>(
    `/api/v1/me/itineraries/${encodeURIComponent(id)}/copy`,
    {},
  );
  return response.data;
}

export async function deleteMyItinerary(id: string): Promise<{ id: string; deleted: boolean }> {
  const response = await del<{ data: { id: string; deleted: boolean } }>(
    `/api/v1/me/itineraries/${encodeURIComponent(id)}`,
  );
  return response.data;
}

export interface OfflineManifestData {
  manifestVersion: string;
  packageId: string;
  itineraryName: string;
  startDate: string;
  daysCount: number;
  partySize: number;
  totalBudgetVnd: string;
  transportMode: string;
  origin: {
    latitude: number;
    longitude: number;
    label?: string;
  };
  days: Array<{
    dayNumber: number;
    date: string;
    title: string;
    notes?: string;
    stops: Array<{
      id: string;
      stopOrder: number;
      placeId: string;
      placeTitle?: string;
      contentRevisionId?: string | null;
      lat: number | null;
      lng: number | null;
      arrivalMinutes: number;
      departureMinutes: number;
      estimatedCostVnd: string;
    }>;
    legs: Array<{
      fromStopId: string;
      toStopId: string;
      transportMode: string;
      durationMinutes: number;
      distanceMeters: number;
      estimatedCostVnd: string;
    }>;
  }>;
  checksum: string;
  generatedAt: string;
}

export async function getItineraryOfflineManifest(id: string): Promise<{ data: OfflineManifestData }> {
  return get<{ data: OfflineManifestData }>(`/api/v1/me/itineraries/${encodeURIComponent(id)}/manifest`);
}
