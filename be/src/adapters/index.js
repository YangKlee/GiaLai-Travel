import { setTimeout as delay } from 'node:timers/promises';
import { AppError } from '../shared/app-error.js';

export function createMailAdapter({
  mode = 'disabled',
  send,
  maxAttempts = 2,
  retryDelayMs = 20,
} = {}) {
  if (!['disabled', 'outbox', 'smtp'].includes(mode)) throw new TypeError('Invalid mail adapter mode');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 3) {
    throw new TypeError('maxAttempts must be 1..3');
  }
  if (mode === 'smtp' && typeof send !== 'function') {
    throw new TypeError('SMTP mail adapter requires a send(message) transport');
  }
  const outbox = [];
  return {
    mode,
    enabled: mode !== 'disabled',
    simulated: mode === 'outbox',
    outbox,
    async sendPasswordReset({ to, displayName, resetUrl, expiresAt, requestId }) {
      if (mode === 'disabled') {
        throw new AppError(503, 'MAIL_UNAVAILABLE', 'Dịch vụ gửi thư khôi phục chưa được cấu hình.');
      }
      if (mode === 'outbox') {
        if (outbox.length >= 100) outbox.shift();
        outbox.push({ to, displayName, resetUrl, expiresAt, requestId, simulated: true });
        return { delivered: false, simulated: true, attempts: 1 };
      }
      let lastError;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await send({ to, displayName, resetUrl, expiresAt, requestId, attempt });
          return { delivered: true, simulated: false, attempts: attempt };
        } catch (error) {
          lastError = error;
          if (attempt < maxAttempts) await delay(retryDelayMs * attempt);
        }
      }
      const failure = new Error('MAIL_DELIVERY_FAILED');
      failure.cause = lastError;
      throw failure;
    },
  };
}

export function createAiAdapter({ generateProposal, provider = null, model = null } = {}) {
  return {
    enabled: typeof generateProposal === 'function',
    provider,
    model,
    async generateItineraryProposal(context) {
      if (typeof generateProposal !== 'function') {
        throw new AppError(503, 'AI_UNAVAILABLE', 'Dịch vụ tạo lịch trình AI chưa được cấu hình.');
      }
      return generateProposal(context);
    },
  };
}

export function createRoutingAdapter({ estimateLeg, provider = null } = {}) {
  return {
    enabled: typeof estimateLeg === 'function',
    provider,
    async estimateRouteLeg(input) {
      if (typeof estimateLeg !== 'function') {
        throw new AppError(503, 'ROUTING_UNAVAILABLE', 'Dịch vụ ước tính tuyến đường chưa được cấu hình.');
      }
      return estimateLeg(input);
    },
  };
}

export function createStorageAdapter({ storeObject, readObject, removeObject } = {}) {
  return {
    enabled: typeof storeObject === 'function' && typeof readObject === 'function',
    async put(asset) {
      if (typeof storeObject !== 'function') {
        throw new AppError(503, 'STORAGE_UNAVAILABLE', 'Kho lưu trữ tệp chưa được cấu hình.');
      }
      return storeObject(asset);
    },
    async get(storageKey) {
      if (typeof readObject !== 'function') {
        throw new AppError(503, 'STORAGE_UNAVAILABLE', 'Kho lưu trữ tệp chưa được cấu hình.');
      }
      return readObject(storageKey);
    },
    async remove(storageKey) {
      if (typeof removeObject === 'function') await removeObject(storageKey);
    },
  };
}
