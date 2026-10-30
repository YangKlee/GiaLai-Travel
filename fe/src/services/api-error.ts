import axios from 'axios';

export interface FieldError {
  field: string;
  message: string;
}
interface ErrorEnvelope {
  error?: { code?: string; message?: string; fields?: FieldError[]; requestId?: string };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: FieldError[];
  readonly requestId?: string;
  constructor(
    status: number,
    code: string,
    message: string,
    fields: FieldError[] = [],
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
    this.requestId = requestId;
  }
}

export function toApiError(error: unknown): Error {
  if (error instanceof ApiError || axios.isCancel(error)) return error;
  if (axios.isAxiosError<ErrorEnvelope>(error)) {
    const detail = error.response?.data?.error;
    return new ApiError(
      error.response?.status ?? 0,
      detail?.code ?? 'NETWORK_ERROR',
      detail?.message ?? 'Chưa kết nối được máy chủ. Hãy kiểm tra kết nối và thử lại.',
      detail?.fields,
      detail?.requestId,
    );
  }
  return new ApiError(0, 'UNKNOWN_ERROR', 'Chưa tải được nội dung.');
}
