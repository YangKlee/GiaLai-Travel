import { get, post } from './api';

export type BookingStatus =
  | 'CHO_DUYET'
  | 'CHO_THANH_TOAN'
  | 'DA_XAC_NHAN'
  | 'TU_CHOI'
  | 'HET_HAN'
  | 'DA_HUY'
  | 'HOAN_THANH';

export interface BookingQuoteInput {
  serviceId: string;
  slotId: string;
  quantity: number;
}

export interface BookingQuoteData {
  serviceId: string;
  slotId: string;
  serviceTitle: string;
  partnerName: string;
  startsAt: string;
  endsAt: string;
  quantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  unitPriceVnd: string;
  totalVnd: string;
  currency: string;
  cancellationPolicy: string;
}

export interface BookingQuoteResponse {
  data: BookingQuoteData;
}

export interface BookingCreateInput {
  serviceId: string;
  slotId: string;
  quantity: number;
  contactName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  idempotencyKey: string;
}

export interface PaymentAttemptInput {
  outcome: 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  idempotencyKey: string;
}

export interface BookingStatusHistoryItem {
  id: string;
  fromStatus: BookingStatus | null;
  toStatus: BookingStatus;
  reason?: string | null;
  createdAt: string;
}

export interface PaymentAttemptItem {
  id: string;
  amountVnd: string;
  status: string;
  isMock: boolean;
  idempotencyKey: string;
  completedAt: string | null;
}

export interface RefundItem {
  id: string;
  amountVnd: string;
  status: string;
  isMock: boolean;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  customerId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  serviceId: string;
  serviceTitle: string;
  partnerName: string;
  slotId: string;
  status: BookingStatus;
  quantity: number;
  unitPriceVnd: string;
  totalVnd: string;
  commissionPercent: number;
  contactName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  startsAt: string;
  endsAt: string;
  reviewDeadline: string;
  paymentDeadline: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  idempotencyKey: string;
  lockVersion: number;
  createdAt: string;
  updatedAt: string;
  history?: BookingStatusHistoryItem[];
  payments?: PaymentAttemptItem[];
  refunds?: RefundItem[];
}

export interface BookingDetailResponse {
  data: BookingRecord;
}

export interface BookingListResponse {
  data: BookingRecord[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export async function quoteBooking(input: BookingQuoteInput): Promise<BookingQuoteResponse> {
  return post<BookingQuoteResponse, BookingQuoteInput>('/v1/booking-quotes', input);
}

export async function createBooking(input: BookingCreateInput): Promise<BookingDetailResponse> {
  return post<BookingDetailResponse, BookingCreateInput>('/v1/bookings', input);
}

export async function recordPaymentAttempt(
  bookingId: string,
  input: PaymentAttemptInput,
): Promise<BookingDetailResponse> {
  return post<BookingDetailResponse, PaymentAttemptInput>(
    `/v1/bookings/${bookingId}/payment-attempts`,
    input,
  );
}

export async function cancelBooking(
  bookingId: string,
  reason?: string,
): Promise<BookingDetailResponse> {
  return post<BookingDetailResponse, { reason?: string }>(`/v1/bookings/${bookingId}/cancel`, {
    reason,
  });
}

export async function listMyBookings(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<BookingListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return get<BookingListResponse>(`/v1/me/bookings${qs ? `?${qs}` : ''}`);
}

export async function getMyBooking(bookingId: string): Promise<BookingDetailResponse> {
  return get<BookingDetailResponse>(`/v1/me/bookings/${bookingId}`);
}

export async function listAdminBookings(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<BookingListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return get<BookingListResponse>(`/v1/admin/bookings${qs ? `?${qs}` : ''}`);
}

export async function reviewAdminBooking(
  bookingId: string,
  input: { decision: 'APPROVE' | 'REJECT'; rejectionReason?: string },
): Promise<BookingDetailResponse> {
  return post<BookingDetailResponse, { decision: 'APPROVE' | 'REJECT'; rejectionReason?: string }>(
    `/v1/admin/bookings/${bookingId}/review`,
    input,
  );
}

export async function completeAdminBooking(bookingId: string): Promise<BookingDetailResponse> {
  return post<BookingDetailResponse, Record<string, never>>(
    `/v1/admin/bookings/${bookingId}/complete`,
    {},
  );
}
