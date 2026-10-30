import { SignJWT, jwtVerify, errors } from 'jose';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/app-error.js';
import { guidSchema } from '../../shared/identifiers.js';

export function createTokens(config) {
  return {
    async issue(userId, sessionId, now, sessionExpiry) {
      const issuedAt = Math.floor(now.getTime() / 1000);
      const expiration = Math.min(issuedAt + config.accessSeconds, Math.floor(sessionExpiry.getTime() / 1000));
      const accessToken = await new SignJWT({ sid: sessionId }).setProtectedHeader({ alg: 'RS256', typ: 'at+jwt', kid: config.kid })
        .setSubject(userId).setJti(randomUUID()).setIssuer(config.issuer).setAudience(config.audience)
        .setIssuedAt(issuedAt).setExpirationTime(expiration).sign(config.privateKey);
      return { accessToken, tokenType: 'Bearer', expiresIn: expiration - issuedAt };
    },
    async verify(token, now = new Date()) {
      try {
        const { payload, protectedHeader } = await jwtVerify(token, (header) => {
          if (!config.publicKeys.has(header.kid) || header.jku || header.x5u || header.jwk) throw new Error('Unknown key');
          return config.publicKeys.get(header.kid);
        }, { algorithms: ['RS256'], issuer: config.issuer, audience: config.audience,
          typ: 'at+jwt', requiredClaims: ['sub', 'sid', 'jti', 'iat', 'exp'], clockTolerance: 0, currentDate: now });
        if (protectedHeader.typ !== 'at+jwt' || !guidSchema.safeParse(payload.sub).success || !guidSchema.safeParse(payload.sid).success ||
          !guidSchema.safeParse(payload.jti).success || !Number.isInteger(payload.iat) || !Number.isInteger(payload.exp) ||
          payload.iat > Math.floor(now.getTime() / 1000) + 30 || payload.exp <= payload.iat || payload.exp - payload.iat > config.accessSeconds) throw new Error('Invalid claims');
        return { userId: payload.sub, sessionId: payload.sid };
      } catch (error) {
        if (error instanceof errors.JWTExpired) throw new AppError(401, 'ACCESS_TOKEN_EXPIRED', 'Phiên truy cập cần được làm mới.');
        throw new AppError(401, 'INVALID_ACCESS_TOKEN', 'Phiên truy cập không hợp lệ. Vui lòng đăng nhập lại.');
      }
    },
  };
}
