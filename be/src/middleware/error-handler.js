import { AppError } from '../shared/app-error.js';

export const notFound = (_req, _res, next) => next(new AppError(404, 'NOT_FOUND', 'Không tìm thấy API.'));

export function errorHandler(logger) {
  return (error, req, res, next) => {
    if (res.headersSent) return next(error);
    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Lỗi máy chủ.';
    let fields;
    if (error instanceof AppError) {
      ({ status, code, message, fields } = error);
    } else if (error.type === 'entity.parse.failed') {
      status = 400; code = 'INVALID_JSON'; message = 'Yêu cầu không hợp lệ.';
    } else if (error.type === 'entity.too.large') {
      status = 413; code = 'PAYLOAD_TOO_LARGE'; message = 'Dữ liệu vượt dung lượng cho phép.';
    } else if (error.status >= 400 && error.status < 500) {
      status = error.status; code = 'INVALID_REQUEST'; message = 'Yêu cầu không hợp lệ.';
    }
    // Raw DB errors may include SQL parameters or secrets; log only safe metadata.
    if (status >= 500) logger.error({ requestId: req.requestId, errorCode: code }, 'request failed');
    res.status(status).json({ error: { code, message, ...(fields ? { fields } : {}), requestId: req.requestId } });
  };
}
