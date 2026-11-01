-- Migration 002: Bo sung bang wards (Phuong / Xa) va cac cot ward_id, best_time_to_visit vao bang places
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS wards (
    id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    region_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
    KEY ix_wards_region (region_id),
    CONSTRAINT ck_wards_guid CHECK (id REGEXP '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE places
    ADD COLUMN ward_id CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL AFTER region_id,
    ADD COLUMN best_time_to_visit VARCHAR(255) NULL AFTER typical_duration_minutes,
    ADD CONSTRAINT fk_places_ward FOREIGN KEY (ward_id) REFERENCES wards(id) ON DELETE SET NULL;

