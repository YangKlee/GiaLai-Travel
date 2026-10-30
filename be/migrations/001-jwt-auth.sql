-- GUID baseline (58 tables) -> JWT (59 tables). Run ONCE in maintenance.
-- Check baseline and backup; stop old application writers first.
-- DDL auto-commits: this is NOT an atomic transaction.
-- All legacy sessions are deliberately revoked; users must log in again.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET time_zone = '+00:00';

CREATE TABLE auth_refresh_tokens (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    session_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    token_hash BINARY(32) NOT NULL UNIQUE,
    expires_at DATETIME(6) NOT NULL,
    used_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (session_id) REFERENCES auth_sessions(id),
    KEY ix_refresh_session (session_id, expires_at),
    KEY ix_refresh_expiry (expires_at),
    CONSTRAINT ck_refresh_expiry CHECK (expires_at > created_at),
    CONSTRAINT ck_refresh_used CHECK (used_at IS NULL OR (used_at >= created_at AND used_at < expires_at)),
    CONSTRAINT ck_auth_refresh_tokens_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

UPDATE auth_sessions SET revoked_at = CURRENT_TIMESTAMP(6) WHERE revoked_at IS NULL;
ALTER TABLE auth_sessions DROP COLUMN token_hash;
