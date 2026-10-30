-- GiaLaiTravel | MariaDB 10.5.26 / MySQL 8.0.16+ | utf8mb4 | InnoDB
-- Pham vi: ca GĐ1 va GĐ2 cua docs/srs. Khong thu/chuyen/hoan tien that.
-- Chon CSDL rong da tao tren cPanel/phpMyAdmin truoc khi Import file nay.
-- CLI: mysql --default-character-set=utf8mb4 -u USER -p TEN_DATABASE < be/schema.sql
-- Khong DROP, khong tat FOREIGN_KEY_CHECKS; khong dung file nay nhu migration chay lap.
-- ID: CHAR(36) ASCII, GUID chu thuong do backend sinh; khong AUTO_INCREMENT/default UUID.
-- DATETIME(6) luu UTC; backend doi gio Asia/Ho_Chi_Minh khi hien thi.
-- Quy tac giao dich/phan quyen o docs/srs/07-class-diagram.md va be/README.md.
-- DDL MySQL tu commit; neu gap loi, sua tren CSDL thu nghiem moi, khong rerun vao du lieu that.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET time_zone = '+00:00';
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- Khong CREATE DATABASE/USE: giu nguyen CSDL nguoi dung da chon, ke ca ten co prefix cPanel.

-- Tai khoan; email NULL chi sau an danh hoa.
CREATE TABLE users (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    email VARCHAR(254) COLLATE utf8mb4_bin NULL,
    email_key VARCHAR(254) COLLATE utf8mb4_bin GENERATED ALWAYS AS (LOWER(TRIM(email))) STORED,
    password_hash VARCHAR(255) NULL,
    display_name VARCHAR(150) NOT NULL,
    phone VARCHAR(32) NULL,
    status ENUM('ACTIVE','LOCKED','ANONYMIZED') NOT NULL DEFAULT 'ACTIVE',
    preferences JSON NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_users_email (email_key),
    CONSTRAINT ck_users_identity CHECK ((status = 'ANONYMIZED' AND email IS NULL AND password_hash IS NULL) OR (status <> 'ANONYMIZED' AND email IS NOT NULL AND password_hash IS NOT NULL)),
    CONSTRAINT ck_users_email_trim CHECK (email IS NULL OR CHAR_LENGTH(email) = CHAR_LENGTH(TRIM(email))),
    CONSTRAINT ck_users_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Danh muc vai tro.
CREATE TABLE roles (
    code VARCHAR(30) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Vai tro toan cuc; pham vi doi tac/vung o bang rieng.
CREATE TABLE user_roles (
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    role_code VARCHAR(30) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    PRIMARY KEY (user_id, role_code),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_code) REFERENCES roles(code)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Pham vi dia ly, khong seed Mang Den trong GĐ1.
CREATE TABLE regions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    parent_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    phase TINYINT UNSIGNED NOT NULL DEFAULT 1,
    FOREIGN KEY (parent_id) REFERENCES regions(id),
    CONSTRAINT ck_regions_phase CHECK (phase IN (1,2)),
    CONSTRAINT ck_regions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Pham vi vung duoc cap cho tai khoan B2G.
CREATE TABLE user_region_scopes (
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    region_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    PRIMARY KEY (user_id, region_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (region_id) REFERENCES regions(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- JWT access token chua sid = auth_sessions.id; kiem tra phien/user moi request.
-- expires_at la han tuyet doi cua phien refresh, khong truot khi rotate.
CREATE TABLE auth_sessions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    revoked_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    KEY ix_session_user (user_id, expires_at),
    CONSTRAINT ck_session_expiry CHECK (expires_at > created_at),
    CONSTRAINT ck_auth_sessions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Refresh token opaque ngau nhien; chi luu SHA-256, giu token da dung de phat hien replay.
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

-- Token khoi phuc dung mot lan; TTL mac dinh 15 phut do backend cap.
CREATE TABLE password_reset_tokens (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    token_hash BINARY(32) NOT NULL UNIQUE,
    expires_at DATETIME(6) NOT NULL,
    used_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT ck_reset_expiry CHECK (expires_at > created_at),
    CONSTRAINT ck_password_reset_tokens_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Lich su dong y; trang thai hien tai theo decision_no, khong sap xep GUID de suy ra thoi gian.
CREATE TABLE consents (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    purpose ENUM('PERSONALIZATION','ADVERTISING') NOT NULL,
    decision_no INT UNSIGNED NOT NULL,
    granted BOOLEAN NOT NULL,
    policy_version VARCHAR(50) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY uq_consent_decision (user_id, purpose, decision_no),
    CONSTRAINT ck_consent_decision CHECK (decision_no > 0),
    CONSTRAINT ck_consent_bool CHECK (granted IN (0,1)),
    CONSTRAINT ck_consents_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Yeu cau xuat/xoa; artifact_key la khoa kho bao ve, khong phai URL cong khai.
CREATE TABLE privacy_requests (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    request_type ENUM('EXPORT','DELETE') NOT NULL,
    status ENUM('NEW','VERIFIED','PROCESSING','COMPLETED','REJECTED') NOT NULL DEFAULT 'NEW',
    verified_at DATETIME(6) NULL,
    completed_at DATETIME(6) NULL,
    result_note TEXT NULL,
    artifact_key VARCHAR(500) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT ck_privacy_requests_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dinh danh noi dung; du lieu cong khai doc tu published_revision_id.
CREATE TABLE content_items (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    kind ENUM('PLACE','ARTICLE','AUDIO','EVENT','PARTNER','SERVICE','JRAI_PHRASE') NOT NULL,
    visibility ENUM('DRAFT','PUBLIC','HIDDEN') NOT NULL DEFAULT 'DRAFT',
    published_revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    created_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT ck_content_public CHECK (visibility <> 'PUBLIC' OR published_revision_id IS NOT NULL),
    CONSTRAINT ck_content_items_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Ban noi dung bat bien sau duyet; payload chua snapshot cac thuoc tinh chuyen biet.
CREATE TABLE content_revisions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    revision_no INT UNSIGNED NOT NULL,
    status ENUM('DRAFT','PENDING','PUBLISHED','REJECTED') NOT NULL DEFAULT 'DRAFT',
    source_reference VARCHAR(1000) NULL,
    payload JSON NOT NULL,
    submitted_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    reviewed_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    reviewed_at DATETIME(6) NULL,
    rejection_reason TEXT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_revision_number (content_id, revision_no),
    UNIQUE KEY uq_revision_owner (content_id, id),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    CONSTRAINT ck_revision_number CHECK (revision_no > 0),
    CONSTRAINT ck_revision_review CHECK (status NOT IN ('PUBLISHED','REJECTED') OR (reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)),
    CONSTRAINT ck_revision_source CHECK (status <> 'PUBLISHED' OR (source_reference IS NOT NULL AND CHAR_LENGTH(TRIM(source_reference)) > 0)),
    CONSTRAINT ck_revision_rejection CHECK (status <> 'REJECTED' OR (rejection_reason IS NOT NULL AND CHAR_LENGTH(TRIM(rejection_reason)) > 0)),
    CONSTRAINT ck_content_revisions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tep anh/audio va quyen su dung; khong luu binary trong CSDL.
CREATE TABLE media_assets (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    storage_key VARCHAR(500) NOT NULL UNIQUE,
    media_type ENUM('IMAGE','AUDIO','DOCUMENT') NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    byte_size BIGINT UNSIGNED NOT NULL,
    sha256 BINARY(32) NOT NULL,
    source_reference VARCHAR(1000) NOT NULL,
    license_note TEXT NOT NULL,
    offline_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    CONSTRAINT ck_media_size CHECK (byte_size > 0),
    CONSTRAINT ck_media_offline CHECK (offline_allowed IN (0,1)),
    CONSTRAINT ck_media_assets_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bai viet, ban chep loi va cum tu Jrai theo revision/ngon ngu.
CREATE TABLE content_translations (
    revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    language_code ENUM('vi','en','ko','zh','jra') NOT NULL,
    title VARCHAR(255) NOT NULL,
    body MEDIUMTEXT NOT NULL,
    transcript MEDIUMTEXT NULL,
    audio_asset_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    PRIMARY KEY (revision_id, language_code),
    FOREIGN KEY (revision_id) REFERENCES content_revisions(id),
    FOREIGN KEY (audio_asset_id) REFERENCES media_assets(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Anh/tai nguyen cua mot ban noi dung.
CREATE TABLE content_media (
    revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    asset_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (revision_id, asset_id),
    FOREIGN KEY (revision_id) REFERENCES content_revisions(id),
    FOREIGN KEY (asset_id) REFERENCES media_assets(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Projection dang cong bo; chi cap nhat khi duyet revision trong cung transaction.
CREATE TABLE places (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    region_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    category ENUM('NATURE','CULTURE','FOOD','STAY','ADVENTURE','OTHER') NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    reference_price_vnd BIGINT UNSIGNED NULL,
    typical_duration_minutes SMALLINT UNSIGNED NULL,
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    KEY ix_place_region_category (region_id, category),
    CONSTRAINT ck_place_lat CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT ck_place_lon CHECK (longitude BETWEEN -180 AND 180),
    CONSTRAINT ck_place_duration CHECK (typical_duration_minutes IS NULL OR typical_duration_minutes > 0),
    CONSTRAINT ck_places_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Gio dia phuong Viet Nam; khong co dong khong dong nghia mo ca ngay.
CREATE TABLE place_opening_hours (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    place_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    weekday TINYINT UNSIGNED NOT NULL,
    opens_at TIME NOT NULL,
    closes_at TIME NOT NULL,
    crosses_midnight BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (place_id) REFERENCES places(id),
    UNIQUE KEY uq_opening_interval (place_id, weekday, opens_at),
    CONSTRAINT ck_opening_weekday CHECK (weekday BETWEEN 0 AND 6),
    CONSTRAINT ck_opening_times CHECK ((crosses_midnight = 0 AND closes_at > opens_at) OR (crosses_midnight = 1 AND closes_at < opens_at)),
    CONSTRAINT ck_place_opening_hours_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thong tin dong cua co nguon.
CREATE TABLE place_closures (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    place_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    starts_at DATETIME(6) NOT NULL,
    ends_at DATETIME(6) NOT NULL,
    reason TEXT NOT NULL,
    source_reference VARCHAR(1000) NOT NULL,
    recorded_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    KEY ix_closure_place_time (place_id, starts_at, ends_at),
    CONSTRAINT ck_closure_times CHECK (ends_at > starts_at),
    CONSTRAINT ck_place_closures_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Doi tac; projection ho so cong bo.
CREATE TABLE partners (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    status ENUM('PENDING','ACTIVE','SUSPENDED') NOT NULL DEFAULT 'PENDING',
    contact_email VARCHAR(254) NULL,
    contact_phone VARCHAR(32) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    CONSTRAINT ck_partners_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Pham vi so huu doi tac, khong suy tu role toan cuc.
CREATE TABLE partner_members (
    partner_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    membership_role ENUM('OWNER','STAFF') NOT NULL,
    PRIMARY KEY (partner_id, user_id),
    FOREIGN KEY (partner_id) REFERENCES partners(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dich vu ban theo slot; chi so projection cap nhat sau duyet.
CREATE TABLE services (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    partner_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    place_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    service_type ENUM('HOMESTAY','EXPERIENCE','GUIDE','RENTAL','OTHER') NOT NULL,
    price_unit VARCHAR(80) NOT NULL,
    unit_price_vnd BIGINT UNSIGNED NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    KEY ix_services_partner (partner_id, active),
    CONSTRAINT ck_service_active CHECK (active IN (0,1)),
    CONSTRAINT ck_services_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Inventory theo khoang phuc vu; backend khoa slot truoc moi thay doi so luong.
CREATE TABLE service_slots (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    service_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    starts_at DATETIME(6) NOT NULL,
    ends_at DATETIME(6) NOT NULL,
    capacity INT UNSIGNED NOT NULL,
    held_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    sold_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_slot_owner (id, service_id),
    UNIQUE KEY uq_slot_time (service_id, starts_at, ends_at),
    FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT ck_slot_times CHECK (ends_at > starts_at),
    CONSTRAINT ck_slot_capacity CHECK (capacity > 0 AND held_quantity + sold_quantity <= capacity),
    CONSTRAINT ck_service_slots_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Nguon su kien/thoi tiet/ban do; api_secret_ref chi tham chieu secret store.
CREATE TABLE external_sources (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    code VARCHAR(80) NOT NULL UNIQUE,
    source_type ENUM('EVENT','WEATHER','MAP','CROWD') NOT NULL,
    endpoint_url VARCHAR(1000) NOT NULL,
    license_note TEXT NOT NULL,
    api_secret_ref VARCHAR(255) NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT ck_source_enabled CHECK (enabled IN (0,1)),
    CONSTRAINT ck_external_sources_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Su kien theo dia diem; du lieu cong bo va trang thai nguon.
CREATE TABLE events (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    place_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    starts_at DATETIME(6) NOT NULL,
    ends_at DATETIME(6) NOT NULL,
    event_status ENUM('SCHEDULED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
    external_source_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    external_key VARCHAR(190) NULL,
    synced_at DATETIME(6) NULL,
    UNIQUE KEY uq_event_external (external_source_id, external_key),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (external_source_id) REFERENCES external_sources(id),
    CONSTRAINT ck_event_times CHECK (ends_at > starts_at),
    CONSTRAINT ck_event_source CHECK ((external_source_id IS NULL AND external_key IS NULL) OR (external_source_id IS NOT NULL AND external_key IS NOT NULL)),
    CONSTRAINT ck_events_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Noi dung audio theo dia diem; asset theo ngon ngu o content_translations.
CREATE TABLE audio_guides (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    place_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    premium_only BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    CONSTRAINT ck_audio_premium CHECK (premium_only IN (0,1)),
    CONSTRAINT ck_audio_guides_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Cau hinh nghiep vu co phien ban; khong chua secret.
CREATE TABLE config_versions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL,
    version_no INT UNSIGNED NOT NULL,
    effective_from DATETIME(6) NOT NULL,
    payload JSON NOT NULL,
    approved_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_config_version (config_key, version_no),
    KEY ix_config_effective (config_key, effective_from),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    CONSTRAINT ck_config_version CHECK (version_no > 0),
    CONSTRAINT ck_config_versions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Chuyen di rieng; xoa mem de dong bo offline va khong xoa don.
CREATE TABLE itineraries (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    owner_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    name VARCHAR(255) NOT NULL,
    current_revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    lock_version INT UNSIGNED NOT NULL DEFAULT 0,
    deleted_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    KEY ix_itinerary_owner (owner_id, deleted_at),
    CONSTRAINT ck_itineraries_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Metadata AI that; input/output da loai thong tin lien he.
CREATE TABLE ai_requests (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    itinerary_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    purpose ENUM('GENERATE','CHAT','ADAPT') NOT NULL,
    provider VARCHAR(80) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prompt_version VARCHAR(50) NOT NULL,
    status ENUM('RUNNING','SUCCEEDED','FAILED','TIMEOUT') NOT NULL DEFAULT 'RUNNING',
    input_context JSON NOT NULL,
    output_payload JSON NULL,
    error_code VARCHAR(80) NULL,
    latency_ms INT UNSIGNED NULL,
    cost_vnd DECIMAL(16,4) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    completed_at DATETIME(6) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id),
    CONSTRAINT ck_ai_cost CHECK (cost_vnd IS NULL OR cost_vnd >= 0),
    CONSTRAINT ck_ai_requests_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Truy vet revision da dung cho AI.
CREATE TABLE ai_request_sources (
    ai_request_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    content_revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    PRIMARY KEY (ai_request_id, content_revision_id),
    FOREIGN KEY (ai_request_id) REFERENCES ai_requests(id),
    FOREIGN KEY (content_revision_id) REFERENCES content_revisions(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Snapshot bat bien; muc dau vao ca doan va ket qua da xac thuc.
CREATE TABLE itinerary_revisions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    itinerary_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    revision_no INT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    day_count SMALLINT UNSIGNED NOT NULL,
    traveler_count SMALLINT UNSIGNED NOT NULL,
    budget_vnd BIGINT UNSIGNED NOT NULL,
    estimated_total_vnd BIGINT UNSIGNED NOT NULL,
    departure_latitude DECIMAL(9,6) NOT NULL,
    departure_longitude DECIMAL(10,6) NOT NULL,
    transport_mode ENUM('MOTORBIKE','CAR','TAXI','BUS','WALK','MIXED') NOT NULL,
    preferences JSON NOT NULL,
    warnings JSON NULL,
    ai_request_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    created_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    validated_at DATETIME(6) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_itinerary_version (itinerary_id, revision_no),
    UNIQUE KEY uq_itinerary_revision_owner (itinerary_id, id),
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id),
    FOREIGN KEY (ai_request_id) REFERENCES ai_requests(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT ck_itinerary_counts CHECK (revision_no > 0 AND day_count > 0 AND traveler_count > 0),
    CONSTRAINT ck_itinerary_budget CHECK (budget_vnd > 0 AND estimated_total_vnd <= budget_vnd),
    CONSTRAINT ck_itinerary_departure CHECK (departure_latitude BETWEEN -90 AND 90 AND departure_longitude BETWEEN -180 AND 180),
    CONSTRAINT ck_itinerary_revisions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Ngay cua mot revision; backend doi chieu ngay voi start_date/day_count.
CREATE TABLE itinerary_days (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    day_number SMALLINT UNSIGNED NOT NULL,
    travel_date DATE NOT NULL,
    UNIQUE KEY uq_itinerary_day (revision_id, day_number),
    UNIQUE KEY uq_itinerary_date (revision_id, travel_date),
    FOREIGN KEY (revision_id) REFERENCES itinerary_revisions(id),
    CONSTRAINT ck_day_number CHECK (day_number > 0),
    CONSTRAINT ck_itinerary_days_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Diem dung; tham chieu POI va revision nguon de truy vet gia/noi dung.
CREATE TABLE itinerary_stops (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    day_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    place_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    content_revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    event_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    sequence_no SMALLINT UNSIGNED NOT NULL,
    arrives_at DATETIME(6) NOT NULL,
    departs_at DATETIME(6) NOT NULL,
    estimated_cost_vnd BIGINT UNSIGNED NOT NULL DEFAULT 0,
    cost_breakdown JSON NULL,
    note TEXT NULL,
    UNIQUE KEY uq_stop_sequence (day_id, sequence_no),
    UNIQUE KEY uq_stop_day (day_id, id),
    FOREIGN KEY (day_id) REFERENCES itinerary_days(id),
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (content_revision_id) REFERENCES content_revisions(id),
    FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT ck_stop_sequence CHECK (sequence_no > 0),
    CONSTRAINT ck_stop_times CHECK (departs_at > arrives_at),
    CONSTRAINT ck_itinerary_stops_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Chang tu diem xuat phat (from_stop_id NULL) hoac diem dung truoc.
CREATE TABLE itinerary_legs (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    day_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    from_stop_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    to_stop_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    distance_meters INT UNSIGNED NOT NULL,
    duration_seconds INT UNSIGNED NOT NULL,
    transport_mode VARCHAR(30) NOT NULL,
    provider VARCHAR(80) NOT NULL,
    source_reference VARCHAR(1000) NOT NULL,
    verified_at DATETIME(6) NOT NULL,
    estimated_cost_vnd BIGINT UNSIGNED NOT NULL DEFAULT 0,
    UNIQUE KEY uq_leg_destination (day_id, to_stop_id),
    FOREIGN KEY (day_id) REFERENCES itinerary_days(id),
    FOREIGN KEY (day_id, from_stop_id) REFERENCES itinerary_stops(day_id, id),
    FOREIGN KEY (day_id, to_stop_id) REFERENCES itinerary_stops(day_id, id),
    CONSTRAINT ck_leg_distinct CHECK (from_stop_id IS NULL OR from_stop_id <> to_stop_id),
    CONSTRAINT ck_itinerary_legs_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Don mot dich vu/mot slot; backend chiu trach nhiem state machine va stock transaction.
CREATE TABLE bookings (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    customer_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    service_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    slot_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    status ENUM('CHO_DUYET','CHO_THANH_TOAN','DA_XAC_NHAN','TU_CHOI','HET_HAN','DA_HUY','HOAN_THANH') NOT NULL DEFAULT 'CHO_DUYET',
    quantity INT UNSIGNED NOT NULL,
    unit_price_vnd BIGINT UNSIGNED NOT NULL,
    total_vnd BIGINT UNSIGNED NOT NULL,
    commission_percent DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    policy_snapshot JSON NOT NULL,
    service_snapshot JSON NOT NULL,
    contact_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(254) NULL,
    contact_phone VARCHAR(32) NULL,
    starts_at DATETIME(6) NOT NULL,
    ends_at DATETIME(6) NOT NULL,
    review_deadline DATETIME(6) NOT NULL,
    payment_deadline DATETIME(6) NULL,
    reviewed_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    reviewed_at DATETIME(6) NULL,
    rejection_reason TEXT NULL,
    cancelled_at DATETIME(6) NULL,
    completed_at DATETIME(6) NULL,
    idempotency_key VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    lock_version INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_booking_request (customer_id, idempotency_key),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (slot_id, service_id) REFERENCES service_slots(id, service_id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    KEY ix_booking_expiry (status, review_deadline, payment_deadline),
    KEY ix_booking_slot (slot_id, status),
    CONSTRAINT ck_booking_quantity CHECK (quantity > 0),
    CONSTRAINT ck_booking_total CHECK (total_vnd = quantity * unit_price_vnd),
    CONSTRAINT ck_booking_commission CHECK (commission_percent BETWEEN 0 AND 100),
    CONSTRAINT ck_booking_time CHECK (ends_at > starts_at AND review_deadline > created_at AND review_deadline < starts_at),
    CONSTRAINT ck_booking_contact CHECK (contact_email IS NOT NULL OR contact_phone IS NOT NULL),
    CONSTRAINT ck_booking_payment_deadline CHECK (status <> 'CHO_THANH_TOAN' OR (payment_deadline IS NOT NULL AND payment_deadline < starts_at)),
    CONSTRAINT ck_booking_rejected CHECK (status <> 'TU_CHOI' OR (rejection_reason IS NOT NULL AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL)),
    CONSTRAINT ck_booking_cancel CHECK (status <> 'DA_HUY' OR (cancelled_at IS NOT NULL AND cancelled_at < starts_at)),
    CONSTRAINT ck_booking_complete CHECK (status <> 'HOAN_THANH' OR (completed_at IS NOT NULL AND completed_at >= ends_at)),
    CONSTRAINT ck_bookings_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Lich su state machine; ghi cung transaction voi don.
CREATE TABLE booking_status_history (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    booking_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    from_status VARCHAR(30) NULL,
    to_status VARCHAR(30) NOT NULL,
    actor_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    reason TEXT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (actor_id) REFERENCES users(id),
    CONSTRAINT ck_booking_status_history_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dinh danh goi; gia va features theo revision.
CREATE TABLE plans (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    audience ENUM('TOURIST','PARTNER') NOT NULL,
    name VARCHAR(150) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT ck_plan_active CHECK (active IN (0,1)),
    CONSTRAINT ck_plans_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Gia VND va thoi han theo thang lich; NULL price cho goi doi tac chua cau hinh.
CREATE TABLE plan_versions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    plan_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    version_no INT UNSIGNED NOT NULL,
    price_vnd BIGINT UNSIGNED NULL,
    period_months SMALLINT UNSIGNED NOT NULL,
    features JSON NOT NULL,
    effective_from DATETIME(6) NOT NULL,
    approved_by CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_plan_version (plan_id, version_no),
    FOREIGN KEY (plan_id) REFERENCES plans(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    CONSTRAINT ck_plan_period CHECK (period_months > 0 AND version_no > 0),
    CONSTRAINT ck_plan_versions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Don mua premium/goi doi tac; khong dung state machine dat dich vu.
CREATE TABLE purchase_orders (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    buyer_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    partner_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    plan_version_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    amount_vnd BIGINT UNSIGNED NOT NULL,
    status ENUM('PENDING','SUCCEEDED','CANCELLED','EXPIRED') NOT NULL DEFAULT 'PENDING',
    expires_at DATETIME(6) NOT NULL,
    idempotency_key VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_purchase_request (buyer_id, idempotency_key),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id),
    FOREIGN KEY (plan_version_id) REFERENCES plan_versions(id),
    CONSTRAINT ck_purchase_expiry CHECK (expires_at > created_at),
    CONSTRAINT ck_purchase_orders_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Mock duy nhat; generated UNIQUE cho toi da mot lan thanh cong tren moi don.
CREATE TABLE payment_attempts (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    booking_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    purchase_order_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    amount_vnd BIGINT UNSIGNED NOT NULL,
    status ENUM('CHO_KET_QUA','THANH_CONG','THAT_BAI','DA_HUY_LAN_THU') NOT NULL,
    is_mock BOOLEAN NOT NULL DEFAULT TRUE,
    idempotency_key VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    successful_booking_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin GENERATED ALWAYS AS (CASE WHEN status = 'THANH_CONG' THEN RTRIM(booking_id) ELSE NULL END) STORED,
    successful_purchase_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin GENERATED ALWAYS AS (CASE WHEN status = 'THANH_CONG' THEN RTRIM(purchase_order_id) ELSE NULL END) STORED,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    completed_at DATETIME(6) NULL,
    UNIQUE KEY uq_payment_request (idempotency_key),
    UNIQUE KEY uq_successful_booking (successful_booking_id),
    UNIQUE KEY uq_successful_purchase (successful_purchase_id),
    UNIQUE KEY uq_payment_booking (id, booking_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    CONSTRAINT ck_payment_target CHECK ((booking_id IS NOT NULL AND purchase_order_id IS NULL) OR (booking_id IS NULL AND purchase_order_id IS NOT NULL)),
    CONSTRAINT ck_payment_mock CHECK (is_mock = 1),
    CONSTRAINT ck_payment_finished CHECK (status = 'CHO_KET_QUA' OR completed_at IS NOT NULL),
    CONSTRAINT ck_payment_attempts_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Hoan gia lap cho payment thuoc dung booking; chi mot lan/payment.
CREATE TABLE refunds (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    payment_attempt_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    booking_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    amount_vnd BIGINT UNSIGNED NOT NULL,
    status ENUM('HOAN_GIA_LAP_THANH_CONG') NOT NULL DEFAULT 'HOAN_GIA_LAP_THANH_CONG',
    is_mock BOOLEAN NOT NULL DEFAULT TRUE,
    idempotency_key VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (payment_attempt_id, booking_id) REFERENCES payment_attempts(id, booking_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT ck_refund_mock CHECK (is_mock = 1),
    CONSTRAINT ck_refunds_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Hoa hong mo phong duy nhat tren don hoan thanh.
CREATE TABLE commissions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    booking_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
    base_amount_vnd BIGINT UNSIGNED NOT NULL,
    rate_percent DECIMAL(5,2) NOT NULL,
    amount_vnd BIGINT UNSIGNED NOT NULL,
    is_mock BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT ck_commission_rate CHECK (rate_percent BETWEEN 0 AND 100),
    CONSTRAINT ck_commission_amount CHECK (amount_vnd = ROUND(base_amount_vnd * rate_percent / 100, 0)),
    CONSTRAINT ck_commission_mock CHECK (is_mock = 1),
    CONSTRAINT ck_commissions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bao loi; duplicate_of dung cho gom bao loi cung van de truoc thuong.
CREATE TABLE issue_reports (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    reporter_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('NEW','PROCESSING','ACCEPTED','REJECTED','CLOSED') NOT NULL DEFAULT 'NEW',
    assignee_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    duplicate_of CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    response TEXT NULL,
    resolved_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    FOREIGN KEY (assignee_id) REFERENCES users(id),
    FOREIGN KEY (duplicate_of) REFERENCES issue_reports(id),
    CONSTRAINT ck_issue_reports_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dieu kien va quyen loi thuong co phien ban.
CREATE TABLE reward_programs (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    code VARCHAR(80) NOT NULL,
    version_no INT UNSIGNED NOT NULL,
    program_type ENUM('REFERRAL','ISSUE_REPORT') NOT NULL,
    conditions JSON NOT NULL,
    benefits JSON NOT NULL,
    starts_at DATETIME(6) NOT NULL,
    ends_at DATETIME(6) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE KEY uq_reward_program (code, version_no),
    CONSTRAINT ck_reward_program_time CHECK (ends_at > starts_at AND version_no > 0),
    CONSTRAINT ck_reward_program_enabled CHECK (enabled IN (0,1)),
    CONSTRAINT ck_reward_programs_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Khong tu gioi thieu; moi nguoi duoc gioi thieu mot lan/chuong trinh.
CREATE TABLE referrals (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    program_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    referrer_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    referred_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    qualified_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_referral_recipient (program_id, referred_id),
    FOREIGN KEY (program_id) REFERENCES reward_programs(id),
    FOREIGN KEY (referrer_id) REFERENCES users(id),
    FOREIGN KEY (referred_id) REFERENCES users(id),
    CONSTRAINT ck_referral_not_self CHECK (referrer_id <> referred_id),
    CONSTRAINT ck_referrals_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Khoa source_key duoc backend tinh tu su kien/canonical issue, khong do client tu cap.
CREATE TABLE reward_grants (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    program_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    beneficiary_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    referral_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    issue_report_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    source_key VARCHAR(190) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    benefit_snapshot JSON NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_reward_source (program_id, source_key),
    FOREIGN KEY (program_id) REFERENCES reward_programs(id),
    FOREIGN KEY (beneficiary_id) REFERENCES users(id),
    FOREIGN KEY (referral_id) REFERENCES referrals(id),
    FOREIGN KEY (issue_report_id) REFERENCES issue_reports(id),
    CONSTRAINT ck_reward_source CHECK ((referral_id IS NOT NULL AND issue_report_id IS NULL) OR (referral_id IS NULL AND issue_report_id IS NOT NULL)),
    CONSTRAINT ck_reward_grants_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Quyen goi theo khoang thoi gian, tu mua hoac thuong; khong tu gia han.
CREATE TABLE entitlements (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    partner_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    plan_version_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    purchase_order_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL UNIQUE,
    reward_grant_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL UNIQUE,
    starts_at DATETIME(6) NOT NULL,
    ends_at DATETIME(6) NOT NULL,
    revoked_at DATETIME(6) NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (partner_id) REFERENCES partners(id),
    FOREIGN KEY (plan_version_id) REFERENCES plan_versions(id),
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id),
    FOREIGN KEY (reward_grant_id) REFERENCES reward_grants(id),
    KEY ix_entitlement_user (user_id, starts_at, ends_at),
    KEY ix_entitlement_partner (partner_id, starts_at, ends_at),
    CONSTRAINT ck_entitlement_time CHECK (ends_at > starts_at),
    CONSTRAINT ck_entitlement_renew CHECK (auto_renew = 0),
    CONSTRAINT ck_entitlement_source CHECK ((purchase_order_id IS NOT NULL AND reward_grant_id IS NULL) OR (purchase_order_id IS NULL AND reward_grant_id IS NOT NULL)),
    CONSTRAINT ck_entitlements_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Manifest goi nang cao phat hanh; storage_key luu ngoai CSDL.
CREATE TABLE offline_packages (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    region_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    language_code ENUM('vi','en','ko','zh','jra') NOT NULL,
    version_no INT UNSIGNED NOT NULL,
    tier ENUM('BASIC','PREMIUM') NOT NULL,
    status ENUM('DRAFT','READY','RETIRED') NOT NULL DEFAULT 'DRAFT',
    manifest JSON NOT NULL,
    byte_size BIGINT UNSIGNED NOT NULL,
    sha256 BINARY(32) NOT NULL,
    license_reference VARCHAR(1000) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_offline_package (region_id, language_code, tier, version_no),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    CONSTRAINT ck_package_version CHECK (version_no > 0),
    CONSTRAINT ck_offline_packages_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Backend chi them asset offline_allowed sau kiem tra quyen.
CREATE TABLE offline_package_assets (
    package_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    asset_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    PRIMARY KEY (package_id, asset_id),
    FOREIGN KEY (package_id) REFERENCES offline_packages(id),
    FOREIGN KEY (asset_id) REFERENCES media_assets(id)
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Trang thai dong bo metadata; trang thai offline thuc te nam o IndexedDB/Cache API.
CREATE TABLE offline_downloads (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    device_key VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    package_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    itinerary_revision_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    entitlement_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    status ENUM('DOWNLOADING','READY','FAILED','REMOVED') NOT NULL DEFAULT 'DOWNLOADING',
    completed_at DATETIME(6) NULL,
    local_manifest_version VARCHAR(80) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES offline_packages(id),
    FOREIGN KEY (itinerary_revision_id) REFERENCES itinerary_revisions(id),
    FOREIGN KEY (entitlement_id) REFERENCES entitlements(id),
    KEY ix_download_device (user_id, device_key),
    CONSTRAINT ck_download_target CHECK ((package_id IS NOT NULL AND itinerary_revision_id IS NULL) OR (package_id IS NULL AND itinerary_revision_id IS NOT NULL)),
    CONSTRAINT ck_download_ready CHECK (status <> 'READY' OR completed_at IS NOT NULL),
    CONSTRAINT ck_offline_downloads_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Chat rieng cua du khach; khong seed lich su nguoi dung.
CREATE TABLE chat_conversations (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT ck_chat_conversations_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Cau tra loi lien ket ai_requests va revision nguon qua ai_request_sources.
CREATE TABLE chat_messages (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    conversation_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    speaker ENUM('USER','ASSISTANT') NOT NULL,
    body TEXT NOT NULL,
    ai_request_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id),
    FOREIGN KEY (ai_request_id) REFERENCES ai_requests(id),
    CONSTRAINT ck_chat_messages_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thoi tiet/mat do co nguon va policy; khong du du lieu thi value NULL.
CREATE TABLE condition_observations (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    place_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    source_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    config_version_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    kind ENUM('WEATHER','CROWD','CLOSURE') NOT NULL,
    observed_at DATETIME(6) NOT NULL,
    valid_until DATETIME(6) NOT NULL,
    quality ENUM('SUFFICIENT','INSUFFICIENT','STALE') NOT NULL,
    value_payload JSON NULL,
    source_reference VARCHAR(1000) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (place_id) REFERENCES places(id),
    FOREIGN KEY (source_id) REFERENCES external_sources(id),
    FOREIGN KEY (config_version_id) REFERENCES config_versions(id),
    KEY ix_condition_place (place_id, kind, observed_at),
    CONSTRAINT ck_observation_time CHECK (valid_until > observed_at),
    CONSTRAINT ck_observation_quality CHECK (quality <> 'INSUFFICIENT' OR value_payload IS NULL),
    CONSTRAINT ck_condition_observations_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Lich su dong bo API; khong xoa du lieu hop le khi nguon loi.
CREATE TABLE external_sync_runs (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    source_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    status ENUM('RUNNING','SUCCEEDED','FAILED') NOT NULL,
    started_at DATETIME(6) NOT NULL,
    finished_at DATETIME(6) NULL,
    imported_count INT UNSIGNED NOT NULL DEFAULT 0,
    updated_count INT UNSIGNED NOT NULL DEFAULT 0,
    error_code VARCHAR(80) NULL,
    FOREIGN KEY (source_id) REFERENCES external_sources(id),
    CONSTRAINT ck_external_sync_runs_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Quang cao gan nhan tai tro; budget/spent deu mo phong.
CREATE TABLE ad_campaigns (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    partner_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    placement VARCHAR(80) NOT NULL,
    starts_at DATETIME(6) NOT NULL,
    ends_at DATETIME(6) NOT NULL,
    budget_vnd BIGINT UNSIGNED NOT NULL,
    spent_vnd BIGINT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('DRAFT','ACTIVE','PAUSED','ENDED') NOT NULL DEFAULT 'DRAFT',
    config_snapshot JSON NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (partner_id) REFERENCES partners(id),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    CONSTRAINT ck_ad_time CHECK (ends_at > starts_at),
    CONSTRAINT ck_ad_budget CHECK (spent_vnd <= budget_vnd),
    CONSTRAINT ck_ad_campaigns_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Chi ghi hanh vi ca nhan cho quang cao khi co consent; hien thi ngữ canh co the user NULL.
CREATE TABLE ad_impressions (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    campaign_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    consent_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    personalized BOOLEAN NOT NULL DEFAULT FALSE,
    charge_vnd BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (campaign_id) REFERENCES ad_campaigns(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (consent_id) REFERENCES consents(id),
    CONSTRAINT ck_ad_personalized CHECK (personalized IN (0,1) AND (personalized = 0 OR (user_id IS NOT NULL AND consent_id IS NOT NULL))),
    CONSTRAINT ck_ad_impressions_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Du lieu hanh vi rieng; backend xac minh consent hien tai truoc khi ghi.
CREATE TABLE behavior_events (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    consent_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    content_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    region_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    event_kind VARCHAR(60) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (consent_id) REFERENCES consents(id),
    FOREIGN KEY (content_id) REFERENCES content_items(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    KEY ix_behavior_user_time (user_id, created_at),
    CONSTRAINT ck_behavior_events_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Du lieu noi bo tong hop; complement_safe do pipeline kiem tra, khong tu dong suy tu nguong10.
CREATE TABLE aggregate_metrics (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    region_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    metric_date DATE NOT NULL,
    metric_code VARCHAR(80) NOT NULL,
    metric_value DECIMAL(20,4) NOT NULL,
    distinct_account_count INT UNSIGNED NOT NULL,
    complement_safe BOOLEAN NOT NULL DEFAULT FALSE,
    config_version_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_metric_bucket (region_id, metric_date, metric_code, config_version_id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (config_version_id) REFERENCES config_versions(id),
    CONSTRAINT ck_metric_value CHECK (metric_value >= 0),
    CONSTRAINT ck_metric_safe CHECK (complement_safe IN (0,1)),
    CONSTRAINT ck_aggregate_metrics_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thong bao trong web; tham chieu polymorphic can kiem tra quyen tai API.
CREATE TABLE notifications (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    user_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    event_key VARCHAR(190) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    kind VARCHAR(60) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    target_type VARCHAR(50) NULL,
    target_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    read_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    UNIQUE KEY uq_notification_event (user_id, event_key),
    FOREIGN KEY (user_id) REFERENCES users(id),
    KEY ix_notification_inbox (user_id, read_at, created_at),
    CONSTRAINT ck_notifications_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    CONSTRAINT ck_notifications_target_guid CHECK (target_id IS NULL OR target_id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Chi metadata da che du lieu; cap quyen append-only bang DB account luc trien khai.
CREATE TABLE audit_logs (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    actor_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    action VARCHAR(80) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
    result ENUM('SUCCESS','FAILURE') NOT NULL,
    correlation_id VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    redacted_metadata JSON NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (actor_id) REFERENCES users(id),
    KEY ix_audit_target (target_type, target_id, created_at),
    KEY ix_audit_correlation (correlation_id),
    CONSTRAINT ck_audit_logs_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    CONSTRAINT ck_audit_logs_target_guid CHECK (target_id IS NULL OR target_id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Con tro revision dung chu so huu; khong cho tro nham content/itinerary.
ALTER TABLE content_items
    ADD CONSTRAINT fk_content_public_revision
    FOREIGN KEY (id, published_revision_id) REFERENCES content_revisions(content_id, id);
ALTER TABLE itineraries
    ADD CONSTRAINT fk_itinerary_current_revision
    FOREIGN KEY (id, current_revision_id) REFERENCES itinerary_revisions(itinerary_id, id);

-- B2G chi truy cap qua API va view nay sau ap scope; khong cap SELECT bang goc.
CREATE VIEW b2g_released_metrics AS
SELECT region_id, metric_date, metric_code, metric_value, created_at
FROM aggregate_metrics
WHERE distinct_account_count >= 10 AND complement_safe = TRUE;

-- Seed danh muc/cau hinh, khong tao tai khoan quan tri hay du lieu ca nhan.
INSERT INTO roles (code, name) VALUES
('TOURIST', 'Du khach'), ('ADMIN', 'Quan tri'),
('PARTNER', 'Doi tac'), ('CONTRIBUTOR', 'Cong tac vien'), ('B2G', 'Nguoi xem bao cao');

INSERT INTO config_versions (id, config_key, version_no, effective_from, payload) VALUES
('12406c9b-79e4-49ee-837b-7ea4c9a9ceef', 'BOOKING_POLICY', 1, '2026-10-29 00:00:00', JSON_OBJECT('review_hours',24,'payment_minutes',30,'free_cancel_before_start',TRUE,'refund_percent',100,'commission_percent',10)),
('7be804d3-318e-486e-a0f9-fedeef990850', 'B2G_PRIVACY', 1, '2026-10-29 00:00:00', JSON_OBJECT('min_distinct_accounts',10,'complementary_suppression_required',TRUE)),
('7b8f16cd-2d47-417c-a034-841ff4bfd9ef', 'AUTH_LIMITS', 1, '2026-10-29 00:00:00', JSON_OBJECT('failed_logins',5,'login_window_minutes',15,'ai_requests_per_hour',10,'reset_token_minutes',15));

INSERT INTO plans (id, code, audience, name, active) VALUES
('21e22dc5-2613-4ebc-b8d4-04f2e4cf8bda', 'PREMIUM_MONTHLY', 'TOURIST', 'Premium thang', TRUE),
('7598bfe5-c38c-4f73-a1de-3fa62195765d', 'PREMIUM_YEARLY', 'TOURIST', 'Premium nam', TRUE),
('fe1ead4a-ec65-4158-ba63-2c68a7e2a50a', 'PARTNER_BASIC', 'PARTNER', 'Doi tac co ban', FALSE),
('189ef0d1-d8f8-4715-9ada-369f6b485901', 'PARTNER_STANDARD', 'PARTNER', 'Doi tac tieu chuan', FALSE),
('9f73ea09-6b47-4f8b-b88f-3a9a6afd1fc9', 'PARTNER_PRO', 'PARTNER', 'Doi tac pro', FALSE);

INSERT INTO plan_versions (id, plan_id, version_no, price_vnd, period_months, features, effective_from)
SELECT '99ebdbbe-2c1d-45c0-9bc8-1d2c0e26637b', id, 1, 49000, 1, JSON_OBJECT('offline_maps',TRUE,'offline_audio',TRUE,'ad_free',TRUE), '2026-10-29 00:00:00'
FROM plans WHERE code = 'PREMIUM_MONTHLY';
INSERT INTO plan_versions (id, plan_id, version_no, price_vnd, period_months, features, effective_from)
SELECT 'ba4c8f0f-c5eb-4636-99a4-d2dcd010d030', id, 1, 199000, 12, JSON_OBJECT('offline_maps',TRUE,'offline_audio',TRUE,'ad_free',TRUE), '2026-10-29 00:00:00'
FROM plans WHERE code = 'PREMIUM_YEARLY';

-- Goi doi tac/thuong/quang cao chi kich hoat khi quan tri chot cau hinh.
-- Khong seed gia doi tac, dia diem, nguong mat do, du bao thoi tiet hoac API gia.
