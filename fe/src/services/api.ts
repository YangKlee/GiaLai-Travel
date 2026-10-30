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

const client = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, ''),
  timeout: 12_000,
  headers: { Accept: 'application/json' },
});

// Public read client: no retry or session persistence. Auth will add its own refresh flow.
client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    if (axios.isAxiosError<ErrorEnvelope>(error)) {
      const detail = error.response?.data?.error;
      return Promise.reject(
        new ApiError(
          error.response?.status ?? 0,
          detail?.code ?? 'NETWORK_ERROR',
          detail?.message ?? 'Chưa kết nối được máy chủ. Hãy kiểm tra kết nối và thử lại.',
          detail?.fields,
          detail?.requestId,
        ),
      );
    }
    return Promise.reject(new ApiError(0, 'UNKNOWN_ERROR', 'Chưa tải được nội dung.'));
  },
);

export async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await client.get<T>(path, { signal });
  return response.data;
}
