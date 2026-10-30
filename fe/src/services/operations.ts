import { get, patch, post } from './api';

export type IssueCategory =
  | 'INACCURATE_INFO'
  | 'CLOSED_DOWN'
  | 'INAPPROPRIATE'
  | 'OUTDATED_PRICE'
  | 'OTHER';

export type IssueStatus =
  | 'NEW'
  | 'PROCESSING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CLOSED';

export interface IssueItem {
  id: string;
  reporterId: string;
  reporterName?: string | null;
  contentId: string;
  contentTitle: string;
  contentKind?: string | null;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
  assigneeId?: string | null;
  assigneeName?: string | null;
  duplicateOf?: string | null;
  response?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueListResponse {
  data: IssueItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface IssueCreateInput {
  contentId: string;
  category: IssueCategory;
  description: string;
}

export interface IssueReviewInput {
  status: IssueStatus;
  response?: string;
  duplicateOf?: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  result: 'SUCCESS' | 'FAILURE';
  correlationId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogListResponse {
  data: AuditLogItem[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export async function createIssueReport(
  input: IssueCreateInput,
): Promise<{ data: IssueItem }> {
  return post<{ data: IssueItem }, IssueCreateInput>('/v1/issues', input);
}

export async function listMyIssues(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<IssueListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return get<IssueListResponse>(`/v1/issues/me${qs ? `?${qs}` : ''}`);
}

export async function listAdminIssues(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  category?: string;
}): Promise<IssueListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.status) query.set('status', params.status);
  if (params?.category) query.set('category', params.category);
  const qs = query.toString();
  return get<IssueListResponse>(`/v1/admin/issues${qs ? `?${qs}` : ''}`);
}

export async function reviewAdminIssue(
  id: string,
  input: IssueReviewInput,
): Promise<{ data: IssueItem }> {
  return patch<{ data: IssueItem }, IssueReviewInput>(`/v1/admin/issues/${id}`, input);
}

export async function listAdminAuditLogs(params?: {
  page?: number;
  pageSize?: number;
  targetType?: string;
  action?: string;
  result?: string;
}): Promise<AuditLogListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  if (params?.targetType) query.set('targetType', params.targetType);
  if (params?.action) query.set('action', params.action);
  if (params?.result) query.set('result', params.result);
  const qs = query.toString();
  return get<AuditLogListResponse>(`/v1/admin/audit-logs${qs ? `?${qs}` : ''}`);
}
