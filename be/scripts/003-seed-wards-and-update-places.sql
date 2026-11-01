-- Seed Wards (Phuong / Xa) theo Nghi quyet sap nhap don vi hanh chinh moi nhat (NQ 1195/NQ-UBTVQH15)
-- va cap nhat ward_id, best_time_to_visit cho toan bo 55 dia diem hien co.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET time_zone = '+00:00';

START TRANSACTION;

-- ==============================================================================
-- 1. SEED DANH MUC PHUONG / XA (WARDS) THEO DON VI HANH CHINH
-- ==============================================================================

-- 1.1 TP. Pleiku (20000000-0000-4000-8000-000000000001) - 14 Phuong + 7 Xa (Xa Tan Son da sap nhap vao Bien Ho)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'PLEIKU_DIENHONG', 'Phường Diên Hồng', 'ACTIVE'),
('50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'PLEIKU_DONGDA', 'Phường Đống Đa', 'ACTIVE'),
('50000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'PLEIKU_HOALU', 'Phường Hoa Lư', 'ACTIVE'),
('50000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', 'PLEIKU_HOIPHU', 'Phường Hội Phú', 'ACTIVE'),
('50000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', 'PLEIKU_HOITHUONG', 'Phường Hội Thương', 'ACTIVE'),
('50000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000001', 'PLEIKU_IAKRING', 'Phường Ia Kring', 'ACTIVE'),
('50000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000001', 'PLEIKU_PHUDONG', 'Phường Phù Đổng', 'ACTIVE'),
('50000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000001', 'PLEIKU_TAYSON', 'Phường Tây Sơn', 'ACTIVE'),
('50000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000001', 'PLEIKU_THANGLOI', 'Phường Thắng Lợi', 'ACTIVE'),
('50000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000001', 'PLEIKU_THONGNHAT', 'Phường Thống Nhất', 'ACTIVE'),
('50000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000001', 'PLEIKU_TRABA', 'Phường Trà Bá', 'ACTIVE'),
('50000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000001', 'PLEIKU_YENDO', 'Phường Yên Đỗ', 'ACTIVE'),
('50000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000001', 'PLEIKU_YENTHE', 'Phường Yên Thế', 'ACTIVE'),
('50000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000001', 'PLEIKU_CHILANG', 'Phường Chi Lăng', 'ACTIVE'),
('50000000-0000-4000-8000-000000000015', '20000000-0000-4000-8000-000000000001', 'PLEIKU_BIENHO', 'Xã Biển Hồ (đã sáp nhập Tân Sơn)', 'ACTIVE'),
('50000000-0000-4000-8000-000000000016', '20000000-0000-4000-8000-000000000001', 'PLEIKU_ANPHU', 'Xã An Phú', 'ACTIVE'),
('50000000-0000-4000-8000-000000000017', '20000000-0000-4000-8000-000000000001', 'PLEIKU_CHUA', 'Xã Chư Á', 'ACTIVE'),
('50000000-0000-4000-8000-000000000018', '20000000-0000-4000-8000-000000000001', 'PLEIKU_DIENPHU', 'Xã Diên Phú', 'ACTIVE'),
('50000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000001', 'PLEIKU_GAO', 'Xã Gào', 'ACTIVE'),
('50000000-0000-4000-8000-000000000020', '20000000-0000-4000-8000-000000000001', 'PLEIKU_IAKENH', 'Xã Ia Kênh', 'ACTIVE'),
('50000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-000000000001', 'PLEIKU_TRADA', 'Xã Trà Đa', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.2 Huyen Chu Pah (20000000-0000-4000-8000-000000000002)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000002', 'CHUPAH_PHUHOA', 'Thị trấn Phú Hòa', 'ACTIVE'),
('50000000-0000-4000-8000-000000000023', '20000000-0000-4000-8000-000000000002', 'CHUPAH_IALY', 'Thị trấn Ia Ly', 'ACTIVE'),
('50000000-0000-4000-8000-000000000024', '20000000-0000-4000-8000-000000000002', 'CHUPAH_CHUDANGYA', 'Xã Chư Đang Ya', 'ACTIVE'),
('50000000-0000-4000-8000-000000000025', '20000000-0000-4000-8000-000000000002', 'CHUPAH_NGHIAHUNG', 'Xã Nghĩa Hưng', 'ACTIVE'),
('50000000-0000-4000-8000-000000000026', '20000000-0000-4000-8000-000000000002', 'CHUPAH_IAKHUOL', 'Xã Ia Khươl', 'ACTIVE'),
('50000000-0000-4000-8000-000000000027', '20000000-0000-4000-8000-000000000002', 'CHUPAH_IAMONONG', 'Xã Ia Mơ Nông', 'ACTIVE'),
('50000000-0000-4000-8000-000000000028', '20000000-0000-4000-8000-000000000002', 'CHUPAH_IAKA', 'Xã Ia Ka', 'ACTIVE'),
('50000000-0000-4000-8000-000000000029', '20000000-0000-4000-8000-000000000002', 'CHUPAH_IAPHI', 'Xã Ia Phí', 'ACTIVE'),
('50000000-0000-4000-8000-000000000030', '20000000-0000-4000-8000-000000000002', 'CHUPAH_HATAY', 'Xã Hà Tây', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.3 Huyen Kbang (20000000-0000-4000-8000-000000000003) - Xa Dak Hlo da sap nhap vao Nghia An & Kong Bo La
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000031', '20000000-0000-4000-8000-000000000003', 'KBANG_TT', 'Thị trấn Kbang', 'ACTIVE'),
('50000000-0000-4000-8000-000000000032', '20000000-0000-4000-8000-000000000003', 'KBANG_SONLANG', 'Xã Sơn Lang', 'ACTIVE'),
('50000000-0000-4000-8000-000000000033', '20000000-0000-4000-8000-000000000003', 'KBANG_KRONG', 'Xã Krong', 'ACTIVE'),
('50000000-0000-4000-8000-000000000034', '20000000-0000-4000-8000-000000000003', 'KBANG_TOTUNG', 'Xã Tơ Tung', 'ACTIVE'),
('50000000-0000-4000-8000-000000000035', '20000000-0000-4000-8000-000000000003', 'KBANG_KONGBLA', 'Xã Kông Bơ La (sáp nhập)', 'ACTIVE'),
('50000000-0000-4000-8000-000000000036', '20000000-0000-4000-8000-000000000003', 'KBANG_NGHIAAN', 'Xã Nghĩa An (sáp nhập)', 'ACTIVE'),
('50000000-0000-4000-8000-000000000037', '20000000-0000-4000-8000-000000000003', 'KBANG_DAKROONG', 'Xã Đăk Roong', 'ACTIVE'),
('50000000-0000-4000-8000-000000000038', '20000000-0000-4000-8000-000000000003', 'KBANG_KONPNE', 'Xã Kon Pne', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.4 Huyen Dak Doa (20000000-0000-4000-8000-000000000004)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000039', '20000000-0000-4000-8000-000000000004', 'DAKDOA_TT', 'Thị trấn Đak Đoa', 'ACTIVE'),
('50000000-0000-4000-8000-000000000040', '20000000-0000-4000-8000-000000000004', 'DAKDOA_GLAR', 'Xã Glar', 'ACTIVE'),
('50000000-0000-4000-8000-000000000041', '20000000-0000-4000-8000-000000000004', 'DAKDOA_TRANG', 'Xã Trang', 'ACTIVE'),
('50000000-0000-4000-8000-000000000042', '20000000-0000-4000-8000-000000000004', 'DAKDOA_HNENG', 'Xã Hneng', 'ACTIVE'),
('50000000-0000-4000-8000-000000000043', '20000000-0000-4000-8000-000000000004', 'DAKDOA_TANBINH', 'Xã Tân Bình', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.5 Huyen Chu Se (20000000-0000-4000-8000-000000000005)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000044', '20000000-0000-4000-8000-000000000005', 'CHUSE_TT', 'Thị trấn Chư Sê', 'ACTIVE'),
('50000000-0000-4000-8000-000000000045', '20000000-0000-4000-8000-000000000005', 'CHUSE_DUN', 'Xã Dun', 'ACTIVE'),
('50000000-0000-4000-8000-000000000046', '20000000-0000-4000-8000-000000000005', 'CHUSE_ALBA', 'Xã Al Bá', 'ACTIVE'),
('50000000-0000-4000-8000-000000000047', '20000000-0000-4000-8000-000000000005', 'CHUSE_BONGOONG', 'Xã Bờ Ngoong', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.6 Huyen Ia Grai (20000000-0000-4000-8000-000000000006)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000048', '20000000-0000-4000-8000-000000000006', 'IAGRAI_IAKHA', 'Thị trấn Ia Kha', 'ACTIVE'),
('50000000-0000-4000-8000-000000000049', '20000000-0000-4000-8000-000000000006', 'IAGRAI_IASAO', 'Xã Ia Sao', 'ACTIVE'),
('50000000-0000-4000-8000-000000000050', '20000000-0000-4000-8000-000000000006', 'IAGRAI_IAO', 'Xã Ia O', 'ACTIVE'),
('50000000-0000-4000-8000-000000000051', '20000000-0000-4000-8000-000000000006', 'IAGRAI_IADER', 'Xã Ia Dêr', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.7 Huyen Mang Yang (20000000-0000-4000-8000-000000000007)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000052', '20000000-0000-4000-8000-000000000007', 'MANGYANG_KONDONG', 'Thị trấn Kon Dơng', 'ACTIVE'),
('50000000-0000-4000-8000-000000000053', '20000000-0000-4000-8000-000000000007', 'MANGYANG_HRA', 'Xã Hra', 'ACTIVE'),
('50000000-0000-4000-8000-000000000054', '20000000-0000-4000-8000-000000000007', 'MANGYANG_AYUN', 'Xã Ayun', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.8 Thi xa An Khe (20000000-0000-4000-8000-000000000008)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000055', '20000000-0000-4000-8000-000000000008', 'ANKHE_TAYSON', 'Phường Tây Sơn', 'ACTIVE'),
('50000000-0000-4000-8000-000000000056', '20000000-0000-4000-8000-000000000008', 'ANKHE_ANBINH', 'Phường An Bình', 'ACTIVE'),
('50000000-0000-4000-8000-000000000057', '20000000-0000-4000-8000-000000000008', 'ANKHE_ANTAN', 'Phường An Tân', 'ACTIVE'),
('50000000-0000-4000-8000-000000000058', '20000000-0000-4000-8000-000000000008', 'ANKHE_ANPHU', 'Phường An Phú', 'ACTIVE'),
('50000000-0000-4000-8000-000000000059', '20000000-0000-4000-8000-000000000008', 'ANKHE_XUANAN', 'Xã Xuân An', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.9 Thi xa Ayun Pa (20000000-0000-4000-8000-000000000009)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000060', '20000000-0000-4000-8000-000000000009', 'AYUNPA_CHEOREO', 'Phường Cheo Reo', 'ACTIVE'),
('50000000-0000-4000-8000-000000000061', '20000000-0000-4000-8000-000000000009', 'AYUNPA_HOABINH', 'Phường Hòa Bình', 'ACTIVE'),
('50000000-0000-4000-8000-000000000062', '20000000-0000-4000-8000-000000000009', 'AYUNPA_CHUBAH', 'Xã Chư Băh', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.10 Huyen Phu Thien (20000000-0000-4000-8000-000000000010)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000063', '20000000-0000-4000-8000-000000000010', 'PHUTHIEN_AYUNHA', 'Xã Ayun Hạ', 'ACTIVE'),
('50000000-0000-4000-8000-000000000064', '20000000-0000-4000-8000-000000000010', 'PHUTHIEN_TT', 'Thị trấn Phú Thiện', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.11 Huyen Chu Prong (20000000-0000-4000-8000-000000000011)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000065', '20000000-0000-4000-8000-000000000011', 'CHUPRONG_BAUCAN', 'Xã Bàu Cạn', 'ACTIVE'),
('50000000-0000-4000-8000-000000000066', '20000000-0000-4000-8000-000000000011', 'CHUPRONG_TT', 'Thị trấn Chư Prông', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.12 Huyen Duc Co (20000000-0000-4000-8000-000000000012)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000067', '20000000-0000-4000-8000-000000000012', 'DUCCO_IADOM', 'Xã Ia Dom', 'ACTIVE'),
('50000000-0000-4000-8000-000000000068', '20000000-0000-4000-8000-000000000012', 'DUCCO_TT', 'Thị trấn Chư Ty', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.13 TP. Quy Nhon (20000000-0000-4000-8000-000000000018)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000069', '20000000-0000-4000-8000-000000000018', 'QUYNHON_NHONLY', 'Xã Nhơn Lý', 'ACTIVE'),
('50000000-0000-4000-8000-000000000070', '20000000-0000-4000-8000-000000000018', 'QUYNHON_NHONHAI', 'Xã Nhơn Hải', 'ACTIVE'),
('50000000-0000-4000-8000-000000000071', '20000000-0000-4000-8000-000000000018', 'QUYNHON_GHENHRANG', 'Phường Ghềnh Ráng', 'ACTIVE'),
('50000000-0000-4000-8000-000000000072', '20000000-0000-4000-8000-000000000018', 'QUYNHON_DONGDA', 'Phường Đống Đa', 'ACTIVE'),
('50000000-0000-4000-8000-000000000073', '20000000-0000-4000-8000-000000000018', 'QUYNHON_NHONCHAU', 'Xã Nhơn Châu (Cù Lao Xanh)', 'ACTIVE'),
('50000000-0000-4000-8000-000000000074', '20000000-0000-4000-8000-000000000018', 'QUYNHON_NHONBINH', 'Phường Nhơn Bình', 'ACTIVE'),
('50000000-0000-4000-8000-000000000075', '20000000-0000-4000-8000-000000000018', 'QUYNHON_NHONHOI', 'Phường Nhơn Hội', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.14 Huyen Tay Son (20000000-0000-4000-8000-000000000019)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000076', '20000000-0000-4000-8000-000000000019', 'TAYSON_PHUPHONG', 'Thị trấn Phú Phong', 'ACTIVE'),
('50000000-0000-4000-8000-000000000077', '20000000-0000-4000-8000-000000000019', 'TAYSON_TAYPHU', 'Xã Tây Phú', 'ACTIVE'),
('50000000-0000-4000-8000-000000000078', '20000000-0000-4000-8000-000000000019', 'TAYSON_BINHTUONG', 'Xã Bình Tường', 'ACTIVE'),
('50000000-0000-4000-8000-000000000079', '20000000-0000-4000-8000-000000000019', 'TAYSON_TAYBINH', 'Xã Tây Bình', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.15 Thi xa An Nhon (20000000-0000-4000-8000-000000000020)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000080', '20000000-0000-4000-8000-000000000020', 'ANNHON_NHONHAU', 'Xã Nhơn Hậu', 'ACTIVE'),
('50000000-0000-4000-8000-000000000081', '20000000-0000-4000-8000-000000000020', 'ANNHON_NHONHUNG', 'Phường Nhơn Hưng', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.16 Thi xa Hoai Nhon (20000000-0000-4000-8000-000000000021)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000082', '20000000-0000-4000-8000-000000000021', 'HOAINHON_TAMQUAN', 'Phường Tam Quan', 'ACTIVE'),
('50000000-0000-4000-8000-000000000083', '20000000-0000-4000-8000-000000000021', 'HOAINHON_HOAICHAUBAC', 'Xã Hoài Châu Bắc', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.17 Huyen Phu Cat (20000000-0000-4000-8000-000000000022)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000084', '20000000-0000-4000-8000-000000000022', 'PHUCAT_CATTIEN', 'Xã Cát Tiến', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.18 Huyen Phu My (20000000-0000-4000-8000-000000000023)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000085', '20000000-0000-4000-8000-000000000023', 'PHUMY_MYTHO', 'Xã Mỹ Thọ', 'ACTIVE'),
('50000000-0000-4000-8000-000000000086', '20000000-0000-4000-8000-000000000023', 'PHUMY_MYTHANH', 'Xã Mỹ Thành', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.19 Huyen Tuy Phuoc (20000000-0000-4000-8000-000000000024)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000087', '20000000-0000-4000-8000-000000000024', 'TUYPHUOC_PHUOCHIEP', 'Xã Phước Hiệp', 'ACTIVE'),
('50000000-0000-4000-8000-000000000088', '20000000-0000-4000-8000-000000000024', 'TUYPHUOC_PHUOCTHUAN', 'Xã Phước Thuận', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

-- 1.20 Huyen Vinh Thanh (20000000-0000-4000-8000-000000000027)
INSERT INTO wards (id, region_id, code, name, status) VALUES
('50000000-0000-4000-8000-000000000089', '20000000-0000-4000-8000-000000000027', 'VINHTHANH_VINHTHINH', 'Xã Vĩnh Thịnh', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);


-- ==============================================================================
-- 2. CAP NHAT WARD_ID VA BEST_TIME_TO_VISIT CHO TAT CA 55 DIA DIEM HIEN CO
-- ==============================================================================

-- 1: Biển Hồ Pleiku (Hồ T’Nưng) -> Xã Biển Hồ (đã sáp nhập Tân Sơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000015',
  best_time_to_visit = '06:00 - 08:30 (Bình minh mờ sương) hoặc 16:30 - 17:45 (Hoàng hôn)'
WHERE id = '30000000-0000-4000-8000-000000000001';

-- 2: Núi lửa Chư Đang Ya -> Xã Chư Đang Ya (Chư Păh)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000024',
  best_time_to_visit = 'Tháng 10 - Tháng 12 (Mùa hoa dã quỳ vàng nở rộ khắp sườn núi lửa)'
WHERE id = '30000000-0000-4000-8000-000000000002';

-- 3: Chùa Minh Thành -> Phường Hội Phú (Pleiku)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000004',
  best_time_to_visit = '07:30 - 09:30 hoặc 15:30 - 17:00 (Nắng sớm thanh tịnh, tôn nghiêm)'
WHERE id = '30000000-0000-4000-8000-000000000003';

-- 4: Biển Hồ Chè & Hàng Thông Trăm Tuổi -> Xã Nghĩa Hưng (Chư Păh)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000025',
  best_time_to_visit = '05:30 - 07:30 (Săn sương sớm rọi qua tán thông và đồi chè)'
WHERE id = '30000000-0000-4000-8000-000000000004';

-- 5: Quảng trường Đại Đoàn Kết -> Phường Tây Sơn (Pleiku)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000008',
  best_time_to_visit = '17:00 - 21:30 (Buổi chiều tà và đêm lộng gió, lung linh ánh đèn)'
WHERE id = '30000000-0000-4000-8000-000000000005';

-- 6: Thác K50 (Thác Hang Én) -> Xã Sơn Lang (Kbang)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000032',
  best_time_to_visit = 'Tháng 1 - Tháng 5 (Mùa khô suối êm, dễ trekking rừng nguyên sinh)'
WHERE id = '30000000-0000-4000-8000-000000000006';

-- 7: Thác Phú Cường -> Xã Dun (Chư Sê)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000045',
  best_time_to_visit = 'Tháng 11 - Tháng 4 (Mùa khô Tây Nguyên nước xanh trong vắt)'
WHERE id = '30000000-0000-4000-8000-000000000007';

-- 8: Vườn Quốc gia Kon Ka Kinh -> Xã Krong (Kbang)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000033',
  best_time_to_visit = 'Tháng 2 - Tháng 6 (Thời tiết khô ráo, hoa rừng khoe sắc)'
WHERE id = '30000000-0000-4000-8000-000000000008';

-- 9: Quần thể Di tích Quốc gia Đặc biệt Tây Sơn Thượng Đạo -> Phường Tây Sơn (TX An Khê)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000055',
  best_time_to_visit = '08:00 - 11:00 hoặc 14:30 - 16:30 (Thời tiết dịu mát)'
WHERE id = '30000000-0000-4000-8000-000000000009';

-- 10: Nhà máy Thủy điện Ialy -> Thị trấn Ia Ly (Chư Păh)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000023',
  best_time_to_visit = '08:00 - 11:30 hoặc 14:00 - 16:30'
WHERE id = '30000000-0000-4000-8000-000000000010';

-- 11: Đồi Cỏ Hồng Đak Đoa (Rừng Thông Glar) -> Xã Glar (Đak Đoa)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000040',
  best_time_to_visit = 'Tháng 11 - Tháng 12 (Bình minh 06:00 - 08:00 ngắm thảm cỏ hồng đọng sương)'
WHERE id = '30000000-0000-4000-8000-000000000011';

-- 12: Di tích Lịch sử Nhà tù Pleiku -> Phường Yên Đỗ (Pleiku)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000012',
  best_time_to_visit = '08:00 - 11:00 hoặc 14:00 - 16:30'
WHERE id = '30000000-0000-4000-8000-000000000012';

-- 13: Đỉnh núi Chư Nâm -> Xã Chư Đang Ya (Chư Păh)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000024',
  best_time_to_visit = '05:00 - 07:30 (Săn biển mây sáng sớm) hoặc Tháng 11 - Tháng 3'
WHERE id = '30000000-0000-4000-8000-000000000013';

-- 14: Làng Kháng chiến Stơr & Nhà lưu niệm Anh hùng Núp -> Xã Tơ Tung (Kbang)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000034',
  best_time_to_visit = '08:30 - 11:30 hoặc 14:00 - 16:30'
WHERE id = '30000000-0000-4000-8000-000000000014';

-- 15: Di tích Lịch sử Quốc gia Plei Ơi (Vua Lửa) -> Xã Ayun Hạ (Phú Thiện)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000063',
  best_time_to_visit = '08:00 - 10:30 hoặc 15:00 - 17:00'
WHERE id = '30000000-0000-4000-8000-000000000015';

-- 16: Thác Chín Tầng (Ia Sao) -> Xã Ia Sao (Ia Grai)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000049',
  best_time_to_visit = 'Tháng 11 - Tháng 4 (Mùa khô suối hiền hòa, thuận tiện khám phá thác)'
WHERE id = '30000000-0000-4000-8000-000000000016';

-- 17: Lòng hồ Sê San 4 & Bến thuyền Sông Pô Cô -> Xã Ia O (Ia Grai)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000050',
  best_time_to_visit = '06:30 - 09:00 (Du thuyền sáng sớm đón bình minh) hoặc 15:30 - 17:30'
WHERE id = '30000000-0000-4000-8000-000000000017';

-- 18: Đập Tân Sơn (Hồ Tân Sơn) -> Xã Biển Hồ (đã sáp nhập Tân Sơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000015',
  best_time_to_visit = '06:00 - 08:00 hoặc 16:00 - 17:30 (Mặt hồ êm đềm, cảnh sắc yên bình)'
WHERE id = '30000000-0000-4000-8000-000000000018';

-- 19: Chùa Bửu Minh -> Xã Nghĩa Hưng (Chư Păh)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000025',
  best_time_to_visit = '07:00 - 09:30 (Nắng sớm chiếu rọi ngôi chùa cổ giữa đồi chè)'
WHERE id = '30000000-0000-4000-8000-000000000019';

-- 20: Công viên Diên Hồng (Hồ Đức An) -> Phường Diên Hồng (Pleiku)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000001',
  best_time_to_visit = '06:00 - 08:00 hoặc 16:30 - 18:30 (Không khí mát mẻ, ngắm hồ ban mai)'
WHERE id = '30000000-0000-4000-8000-000000000020';

-- 21: Đỉnh núi Hàm Rồng (Chư H’Drông) -> Phường Chi Lăng (Pleiku)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000014',
  best_time_to_visit = '05:30 - 07:30 (Săn mây sáng sớm) hoặc 16:30 - 17:45 (Hoàng hôn ngắm trọn Pleiku)'
WHERE id = '30000000-0000-4000-8000-000000000021';

-- 22: Hồ thủy lợi Ayun Hạ -> Xã Chư Băh (Ayun Pa)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000062',
  best_time_to_visit = '07:00 - 09:30 hoặc 15:30 - 17:30'
WHERE id = '30000000-0000-4000-8000-000000000022';

-- 23: Khu Di tích Khảo cổ Sơ kỳ Đá cũ Rộc Tưng - Gò Đá -> Xã Xuân An (An Khê)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000059',
  best_time_to_visit = '08:00 - 11:00 hoặc 14:00 - 16:30'
WHERE id = '30000000-0000-4000-8000-000000000023';

-- 24: Đồi chè Bàu Cạn & Mùa Hoa Muồng Vàng -> Xã Bàu Cạn (Chư Prông)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000065',
  best_time_to_visit = 'Tháng 10 - Tháng 11 (Mùa hoa muồng vàng nở rực rỡ bên nương chè)'
WHERE id = '30000000-0000-4000-8000-000000000024';

-- 25: Thác Mơ Chư Păh -> Xã Ia Khươl (Chư Păh)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000026',
  best_time_to_visit = 'Tháng 11 - Tháng 4 (Mùa khô suối mát trong, dòng thác êm đềm)'
WHERE id = '30000000-0000-4000-8000-000000000025';

-- 26: Thác Kon Bông (Thác Ba Tầng Kbang) -> Xã Sơn Lang (Kbang)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000032',
  best_time_to_visit = 'Tháng 1 - Tháng 5 (Mùa khô đường rừng khô ráo)'
WHERE id = '30000000-0000-4000-8000-000000000026';

-- 27: Cửa khẩu Quốc tế Lệ Thanh -> Xã Ia Dom (Đức Cơ)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000067',
  best_time_to_visit = '08:00 - 11:30 hoặc 13:30 - 16:30'
WHERE id = '30000000-0000-4000-8000-000000000027';

-- 28: Làng Văn hóa Du lịch Plei Ốp -> Phường Hoa Lư (Pleiku)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000003',
  best_time_to_visit = '16:00 - 21:00 (Giao lưu văn hóa cồng chiêng, ẩm thực rượu cần đêm)'
WHERE id = '30000000-0000-4000-8000-000000000028';

-- 29: Khu Du lịch Sinh thái Đồng Xanh -> Xã An Phú (Pleiku)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000016',
  best_time_to_visit = '08:00 - 11:30 hoặc 14:30 - 17:30'
WHERE id = '30000000-0000-4000-8000-000000000029';

-- 30: Đèo Mang Yang (Cổng Trời Tây Nguyên) -> Xã Hra (Mang Yang)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000053',
  best_time_to_visit = '06:00 - 08:00 (Sương giăng bồng bềnh cổng trời) hoặc 16:30 - 17:30'
WHERE id = '30000000-0000-4000-8000-000000000030';

-- 31: Bãi biển Kỳ Co -> Xã Nhơn Lý (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000069',
  best_time_to_visit = 'Tháng 3 - Tháng 9 (Biển êm, nước trong như ngọc bích)'
WHERE id = '30000000-0000-4000-8000-000000000031';

-- 32: Danh thắng Eo Gió -> Xã Nhơn Lý (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000069',
  best_time_to_visit = '05:30 - 07:00 (Bình minh rực rỡ) hoặc 16:30 - 18:00 (Hoàng hôn lộng gió)'
WHERE id = '30000000-0000-4000-8000-000000000032';

-- 33: Đảo Hòn Khô -> Xã Nhơn Hải (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000070',
  best_time_to_visit = 'Tháng 3 - Tháng 8 (Mùa lặn ngắm san hô và đi bộ trên con đường xuyên biển)'
WHERE id = '30000000-0000-4000-8000-000000000033';

-- 34: KDL Ghềnh Ráng - Tiên Sa & Mộ Hàn Mặc Tử -> Phường Ghềnh Ráng (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000071',
  best_time_to_visit = '07:00 - 09:30 hoặc 15:30 - 17:30 (Nắng dịu, ngắm trọn vịnh biển Quy Nhơn)'
WHERE id = '30000000-0000-4000-8000-000000000034';

-- 35: Tháp Đôi Quy Nhơn -> Phường Đống Đa (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000072',
  best_time_to_visit = '08:00 - 10:30 hoặc 15:00 - 17:00'
WHERE id = '30000000-0000-4000-8000-000000000035';

-- 36: Tháp Bánh Ít -> Xã Phước Hiệp (Tuy Phước)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000087',
  best_time_to_visit = '07:30 - 09:30 hoặc 15:30 - 17:00 (Nắng chiều tôn vinh gạch tháp Chăm)'
WHERE id = '30000000-0000-4000-8000-000000000036';

-- 37: Bảo tàng Quang Trung -> Thị trấn Phú Phong (Tây Sơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000076',
  best_time_to_visit = '08:00 - 11:00 hoặc 14:00 - 16:30 (Xem biểu diễn nhạc võ Tây Sơn)'
WHERE id = '30000000-0000-4000-8000-000000000037';

-- 38: KDL Sinh thái Hầm Hô -> Xã Tây Phú (Tây Sơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000077',
  best_time_to_visit = 'Tháng 2 - Tháng 8 (Mùa chèo thuyền ngắm vương quốc đá hoa cương lòng suối)'
WHERE id = '30000000-0000-4000-8000-000000000038';

-- 39: Đảo Cù Lao Xanh -> Xã Nhơn Châu (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000073',
  best_time_to_visit = 'Tháng 3 - Tháng 8 (Mùa biển lặng, nước trong vắt tận đáy)'
WHERE id = '30000000-0000-4000-8000-000000000039';

-- 40: Chùa Linh Phong (Chùa Ông Núi) -> Xã Cát Tiến (Phù Cát)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000084',
  best_time_to_visit = '06:30 - 09:00 hoặc 16:00 - 17:30 (Leo núi ngắm tượng Phật cao nhất ĐNA)'
WHERE id = '30000000-0000-4000-8000-000000000040';

-- 41: Tiểu Chủng viện Làng Sông -> Xã Phước Thuận (Tuy Phước)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000088',
  best_time_to_visit = '08:00 - 10:30 hoặc 14:30 - 16:30 (Kiến trúc Gothic cổ kính rợp bóng sao đen)'
WHERE id = '30000000-0000-4000-8000-000000000041';

-- 42: Khu dã ngoại Trung Lương -> Xã Cát Tiến (Phù Cát)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000084',
  best_time_to_visit = '15:30 - 18:30 (Cắm trại đón gió biển, ngắm hoàng hôn)'
WHERE id = '30000000-0000-4000-8000-000000000042';

-- 43: Đồi cát Phương Mai -> Xã Nhơn Lý (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000069',
  best_time_to_visit = '05:30 - 07:30 hoặc 16:30 - 18:00 (Trượt cát và check-in nắng dịu)'
WHERE id = '30000000-0000-4000-8000-000000000043';

-- 44: Đầm Thị Nại & Cầu Thị Nại -> Phường Nhơn Bình (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000074',
  best_time_to_visit = '16:30 - 18:00 (Hoàng hôn nhuộm vàng mặt đầm Thị Nại)'
WHERE id = '30000000-0000-4000-8000-000000000044';

-- 45: Di tích Thành Hoàng Đế & Tháp Cánh Tiên -> Xã Nhơn Hậu (An Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000080',
  best_time_to_visit = '08:00 - 11:00 hoặc 14:30 - 16:30'
WHERE id = '30000000-0000-4000-8000-000000000045';

-- 46: Thắng cảnh Mũi Vi Rồng -> Xã Mỹ Thọ (Phù Mỹ)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000085',
  best_time_to_visit = '06:00 - 08:30 hoặc 15:30 - 17:30'
WHERE id = '30000000-0000-4000-8000-000000000046';

-- 47: Chùa Thiên Hưng -> Phường Nhơn Hưng (An Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000081',
  best_time_to_visit = '08:00 - 10:30 hoặc 15:00 - 17:00 (Cảnh quan bồng lai thanh tịnh)'
WHERE id = '30000000-0000-4000-8000-000000000047';

-- 48: Đàn Tế Trời Đất Tây Sơn -> Xã Bình Tường (Tây Sơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000078',
  best_time_to_visit = '07:30 - 10:00 hoặc 15:30 - 17:30'
WHERE id = '30000000-0000-4000-8000-000000000048';

-- 49: Làng chài Bãi Xép -> Phường Ghềnh Ráng (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000071',
  best_time_to_visit = 'Tháng 4 - Tháng 9 (Mùa hè tắm biển, hải sản tươi ngon)'
WHERE id = '30000000-0000-4000-8000-000000000049';

-- 50: Tháp Dương Long -> Xã Tây Bình (Tây Sơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000079',
  best_time_to_visit = '07:30 - 09:30 hoặc 15:30 - 17:00'
WHERE id = '30000000-0000-4000-8000-000000000050';

-- 51: Ngọn Hải đăng Hòn Nước -> Xã Mỹ Thành (Phù Mỹ)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000086',
  best_time_to_visit = '05:30 - 07:30 (Bình minh tráng lệ ngắm sóng biển xô bờ đá)'
WHERE id = '30000000-0000-4000-8000-000000000051';

-- 52: KDL Cửa Biển (Seagate Park) -> Phường Nhơn Hội (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000075',
  best_time_to_visit = '14:30 - 18:30 (Vui chơi ngoài trời mát mẻ ven đầm)'
WHERE id = '30000000-0000-4000-8000-000000000052';

-- 53: Làng nghề Chiếu cói & Rừng dừa Tam Quan -> Phường Tam Quan (Hoài Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000082',
  best_time_to_visit = '08:00 - 11:30 hoặc 14:00 - 17:00'
WHERE id = '30000000-0000-4000-8000-000000000053';

-- 54: Thắng cảnh Hòn Sẹo -> Xã Nhơn Lý (Quy Nhơn)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000069',
  best_time_to_visit = 'Tháng 3 - Tháng 8 (08:00 - 12:00 lặn ngắm san hô bãi đá ngũ sắc)'
WHERE id = '30000000-0000-4000-8000-000000000054';

-- 55: Thành đá Tà Kơn & Suối nước nóng Vĩnh Thạnh -> Xã Vĩnh Thịnh (Vĩnh Thạnh)
UPDATE places SET ward_id = '50000000-0000-4000-8000-000000000089',
  best_time_to_visit = '07:00 - 10:00 hoặc 15:00 - 17:30 (Tắm khoáng nóng phục hồi sức khỏe)'
WHERE id = '30000000-0000-4000-8000-000000000055';

COMMIT;
