# Ma trận truy vết triển khai

Nguồn: [FR/BR](../srs/01-tong-quan-va-yeu-cau-chuc-nang.md), [NFR/hồ sơ đo](../srs/02-yeu-cau-phi-chuc-nang.md). Mã task tham chiếu [BE](backend-tasks.md), [FE](frontend-tasks.md) và [nghiệm thu](integration-and-acceptance.md).

Ma trận liệt kê toàn bộ FR con hiện có trong SRS. Trạng thái ban đầu Chưa làm vì chưa triển khai nghiệp vụ. Khi thực hiện, bổ sung testcase, bằng chứng, build và kết quả thực tế cho từng dòng. Task nền tảng áp dụng xuyên suốt dù không lặp trong mọi ô.

## Yêu cầu chức năng

| Yêu cầu | GĐ | Task BE | Task FE | Cổng nghiệm thu | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| FR-01.01 | 1 | BE-05 | FE-05 | X-03 | Chưa làm |
| FR-01.02 | 1 | BE-05 | FE-05 | X-03 | Chưa làm |
| FR-01.03 | 1 | BE-05 | FE-05, FE-19 | X-03, X-06 | Chưa làm |
| FR-01.04 | 1 | BE-06 | FE-06 | X-03 | Chưa làm |
| FR-01.05 | 1 | BE-06 | FE-06 | X-03 | Chưa làm |
| FR-02.01 | 1 | BE-07 | FE-07 | X-03 | Chưa làm |
| FR-02.02 | 1 | BE-07 | FE-07 | X-03 | Chưa làm |
| FR-02.03 | 1 | BE-07 | FE-07 | X-03, X-11c | Chưa làm |
| FR-02.04 | 1 | BE-08 | FE-07 | X-03, X-08 | Chưa làm |
| FR-02.05 | 1 | BE-08 | FE-07 | X-03, X-08 | Chưa làm |
| FR-03.01 | 1 | BE-11, BE-12 | FE-08, FE-09 | X-04 | Chưa làm |
| FR-03.02 | 1 | BE-11, BE-12 | FE-08, FE-09 | X-04 | Chưa làm |
| FR-03.03 | 1 | BE-11, BE-12 | FE-08, FE-09 | X-04 | Chưa làm |
| FR-03.04 | 1 | BE-11, BE-12 | FE-08, FE-09 | X-04 | Chưa làm |
| FR-04.01 | 1 | BE-11 | FE-09 | X-04 | Chưa làm |
| FR-04.02 | 1 | BE-11 | FE-09 | X-04 | Chưa làm |
| FR-04.03 | 1 | BE-11 | FE-09 | X-04 | Chưa làm |
| FR-05.01 | 1 | BE-15, BE-16, BE-17 | FE-14, FE-15 | X-05 | Chưa làm |
| FR-05.02 | 1 | BE-15, BE-16, BE-17 | FE-14, FE-15 | X-05 | Chưa làm |
| FR-05.03 | 1 | BE-15, BE-16, BE-17 | FE-14, FE-15 | X-05 | Chưa làm |
| FR-05.04 | 1 | BE-15, BE-16, BE-17 | FE-14, FE-15 | X-05 | Chưa làm |
| FR-05.05 | 1 | BE-15, BE-16, BE-17 | FE-14, FE-15 | X-05 | Chưa làm |
| FR-06.01 | 1 | BE-16, BE-17, BE-18 | FE-15, FE-16 | X-05 | Chưa làm |
| FR-06.02 | 1 | BE-16, BE-17, BE-18 | FE-15, FE-16 | X-05 | Chưa làm |
| FR-06.03 | 1 | BE-16, BE-17, BE-18 | FE-15, FE-16 | X-05 | Chưa làm |
| FR-06.04 | 1 | BE-16, BE-17, BE-18 | FE-15, FE-16 | X-05 | Chưa làm |
| FR-06.05 | 1 | BE-18 | FE-16 | X-05 | Chưa làm |
| FR-07.01 | 1 | BE-18 | FE-16, FE-17 | X-05 | Chưa làm |
| FR-07.02 | 1 | BE-18 | FE-16, FE-17 | X-05 | Chưa làm |
| FR-07.03 | 1 | BE-18 | FE-16, FE-17 | X-05 | Chưa làm |
| FR-07.04 | 1 | BE-18 | FE-16, FE-17 | X-05 | Chưa làm |
| FR-07.05 | 1 | BE-18 | FE-16, FE-17 | X-05 | Chưa làm |
| FR-08.01 | 1 | BE-19 | FE-18, FE-19 | X-06 | Chưa làm |
| FR-08.02 | 1 | BE-19 | FE-18, FE-19 | X-06 | Chưa làm |
| FR-08.03 | 1 | BE-19 | FE-18, FE-19 | X-06 | Chưa làm |
| FR-08.04 | 1 | BE-19 | FE-18, FE-19 | X-06 | Chưa làm |
| FR-08.05 | 1 | BE-19 | FE-18, FE-19 | X-06 | Chưa làm |
| FR-09.01 | 1 | BE-09, BE-13 | FE-10 | X-04 | Chưa làm |
| FR-09.02 | 1 | BE-09, BE-13 | FE-10 | X-04 | Chưa làm |
| FR-09.03 | 1 | BE-09, BE-13 | FE-10 | X-04 | Chưa làm |
| FR-10.01 | 1 | BE-13 | FE-11 | X-04 | Chưa làm |
| FR-10.02 | 1 | BE-13 | FE-11 | X-04 | Chưa làm |
| FR-10.03 | 1 | BE-18 | FE-11, FE-15, FE-16 | X-05 | Chưa làm |
| FR-10.04 | 1 | BE-13, BE-18 | FE-11 | X-05 | Chưa làm |
| FR-11.01 | 1 | BE-12 | FE-09 | X-04 | Chưa làm |
| FR-11.02 | 1 | BE-12, BE-20 | FE-09, FE-20 | X-07 | Chưa làm |
| FR-11.03 | 1 | BE-12, BE-20 | FE-09, FE-20 | X-07 | Chưa làm |
| FR-11.04 | 1 | BE-12, BE-20 | FE-09, FE-20 | X-07 | Chưa làm |
| FR-12.01 | 1 | BE-21 | FE-23 | X-07 | Chưa làm |
| FR-12.02 | 1 | BE-21 | FE-23 | X-07 | Chưa làm |
| FR-12.03 | 1 | BE-21, BE-24 | FE-21, FE-23 | X-07 | Chưa làm |
| FR-12.04 | 1 | BE-24 | FE-21 | X-07 | Chưa làm |
| FR-13.01 | 1 | BE-22 | FE-21 | X-07 | Chưa làm |
| FR-13.02 | 1 | BE-22 | FE-21 | X-07 | Chưa làm |
| FR-13.03 | 1 | BE-22 | FE-21 | X-07 | Chưa làm |
| FR-13.04 | 1 | BE-22 | FE-21 | X-07 | Chưa làm |
| FR-13.05 | 1 | BE-22 | FE-21 | X-07 | Chưa làm |
| FR-14.01 | 1 | BE-25 | FE-21 | X-07 | Chưa làm |
| FR-14.02 | 1 | BE-23 | FE-22 | X-07 | Chưa làm |
| FR-14.03 | 1 | BE-23 | FE-22 | X-07 | Chưa làm |
| FR-14.04 | 1 | BE-24 | FE-23 | X-07 | Chưa làm |
| FR-15.01 | 1 | BE-04, BE-26 | FE-24 | X-08 | Chưa làm |
| FR-15.02 | 1 | BE-04, BE-26 | FE-24 | X-08 | Chưa làm |
| FR-15.03 | 1 | BE-04, BE-26 | FE-24 | X-08 | Chưa làm |
| FR-16.01 | 1 | BE-26 | FE-24 | X-08 | Chưa làm |
| FR-16.02 | 1 | BE-26 | FE-24 | X-08 | Chưa làm |
| FR-16.03 | 1 | BE-26 | FE-24 | X-08 | Chưa làm |
| FR-16.04 | 1 | BE-26 | FE-24 | X-08 | Chưa làm |
| FR-17.01 | 1 | BE-09, BE-10 | FE-12 | X-04 | Chưa làm |
| FR-17.02 | 1 | BE-09, BE-10 | FE-12 | X-04 | Chưa làm |
| FR-17.03 | 1 | BE-09, BE-10 | FE-12 | X-04 | Chưa làm |
| FR-17.04 | 1 | BE-09, BE-10 | FE-12 | X-04 | Chưa làm |
| FR-17.05 | 1 | BE-09, BE-10 | FE-12 | X-04 | Chưa làm |
| FR-18.01 | 1 | BE-05, BE-14 | FE-13 | X-03, X-08 | Chưa làm |
| FR-18.02 | 1 | BE-05, BE-14 | FE-13 | X-03, X-08 | Chưa làm |
| FR-18.03 | 1 | BE-05, BE-14 | FE-13 | X-03, X-04, X-08 | Chưa làm |
| FR-18.04 | 1 | BE-05, BE-14 | FE-13 | X-03, X-04, X-08 | Chưa làm |
| FR-19.01 | 2 | BE-29 | FE-27 | X-11a | Chưa làm |
| FR-19.02 | 2 | BE-29 | FE-27 | X-11a | Chưa làm |
| FR-19.03 | 2 | BE-29 | FE-27 | X-11a | Chưa làm |
| FR-19.04 | 2 | BE-29 | FE-27 | X-11a | Chưa làm |
| FR-20.01 | 2 | BE-30, BE-34 | FE-28, FE-32 | X-11a, X-11b | Chưa làm |
| FR-20.02 | 2 | BE-30, BE-34 | FE-28, FE-32 | X-11a, X-11b | Chưa làm |
| FR-20.03 | 2 | BE-30, BE-34 | FE-28, FE-32 | X-11a, X-11b | Chưa làm |
| FR-20.04 | 2 | BE-30, BE-34 | FE-28, FE-32 | X-11a, X-11b | Chưa làm |
| FR-20.05 | 2 | BE-30, BE-34 | FE-28, FE-32 | X-11a, X-11b | Chưa làm |
| FR-21.01 | 2 | BE-31 | FE-29 | X-11a | Chưa làm |
| FR-21.02 | 2 | BE-31 | FE-29 | X-11a | Chưa làm |
| FR-21.03 | 2 | BE-31 | FE-29 | X-11a | Chưa làm |
| FR-21.04 | 2 | BE-31 | FE-29 | X-11a | Chưa làm |
| FR-22.01 | 2 | BE-07, BE-36 | FE-07, FE-33 | X-11c | Chưa làm |
| FR-22.02 | 2 | BE-07, BE-36 | FE-07, FE-33 | X-11c | Chưa làm |
| FR-22.03 | 2 | BE-07, BE-36 | FE-07, FE-33 | X-11c | Chưa làm |
| FR-22.04 | 2 | BE-07, BE-36 | FE-07, FE-33 | X-11c | Chưa làm |
| FR-23.01 | 2 | BE-37 | FE-34 | X-11c | Chưa làm |
| FR-23.02 | 2 | BE-37 | FE-34 | X-11c | Chưa làm |
| FR-23.03 | 2 | BE-37 | FE-34 | X-11c | Chưa làm |
| FR-23.04 | 2 | BE-37 | FE-34 | X-11c | Chưa làm |
| FR-24.01 | 2 | BE-37 | FE-34 | X-11c | Chưa làm |
| FR-24.02 | 2 | BE-37 | FE-34 | X-11c | Chưa làm |
| FR-25.01 | 2 | BE-38 | FE-35 | X-11c | Chưa làm |
| FR-25.02 | 2 | BE-38 | FE-35 | X-11c | Chưa làm |
| FR-25.03 | 2 | BE-38 | FE-35 | X-11c | Chưa làm |
| FR-25.04 | 2 | BE-38 | FE-35 | X-11c | Chưa làm |
| FR-25.05 | 2 | BE-38 | FE-35 | X-11c | Chưa làm |
| FR-26.01 | 2 | BE-32 | FE-30 | X-11b | Chưa làm |
| FR-26.02 | 2 | BE-32 | FE-30 | X-11b | Chưa làm |
| FR-26.03 | 2 | BE-32 | FE-30 | X-11b | Chưa làm |
| FR-26.04 | 2 | BE-32 | FE-30 | X-11b | Chưa làm |
| FR-27.01 | 2 | BE-33 | FE-31 | X-11b | Chưa làm |
| FR-27.02 | 2 | BE-33 | FE-31 | X-11b | Chưa làm |
| FR-27.03 | 2 | BE-33 | FE-31 | X-11b | Chưa làm |
| FR-27.04 | 2 | BE-33 | FE-31 | X-11b | Chưa làm |
| FR-28.01 | 2 | BE-34 | FE-32 | X-11b | Chưa làm |
| FR-28.02 | 2 | BE-34 | FE-32 | X-11b | Chưa làm |
| FR-28.03 | 2 | BE-34 | FE-32 | X-11b | Chưa làm |
| FR-28.04 | 2 | BE-34 | FE-32 | X-11b | Chưa làm |
| FR-28.05 | 2 | BE-34 | FE-32 | X-11b | Chưa làm |
| FR-29.01 | 2 | BE-35 | FE-32 | X-11b | Chưa làm |
| FR-29.02 | 2 | BE-35 | FE-32 | X-11b | Chưa làm |
| FR-29.03 | 2 | BE-35 | FE-32 | X-11b | Chưa làm |
| FR-29.04 | 2 | BE-35 | FE-32 | X-11b | Chưa làm |
| FR-29.05 | 2 | BE-35 | FE-32 | X-11b | Chưa làm |
| FR-30.01 | 2 | BE-39 | FE-36 | X-12 | Chưa làm |
| FR-30.02 | 2 | BE-39 | FE-36 | X-12 | Chưa làm |
| FR-30.03 | 2 | BE-39 | FE-36 | X-12 | Chưa làm |
| FR-30.04 | 2 | BE-39 | FE-36 | X-12 | Chưa làm |

## Yêu cầu phi chức năng

Áp dụng toàn bộ mã con trong mỗi nhóm NFR; testcase phải mở rộng thành từng mã con trước nghiệm thu. Ngưỡng định lượng giữ trạng thái đề xuất tới khi X-01 khóa baseline. Phần áp dụng GĐ1/GĐ2 theo đúng tệp NFR; task GĐ2 trong một dòng không làm phần GĐ1 phải chờ GĐ2.

| Nhóm | Task BE | Task FE | Cổng kiểm chứng | Trọng tâm kiểm chứng |
| --- | --- | --- | --- | --- |
| NFR-01 | BE-02, BE-12, BE-27 | FE-03, FE-25 | X-09 | E-01, p95 đọc 2s/ghi 3s |
| NFR-02 | BE-15, BE-16, BE-17, BE-27 | FE-14 | X-05 | E-02, 95/100 trong 30s; timeout 45s |
| NFR-03 | BE-19 | FE-18, FE-19, FE-25 | X-06 | E-03, 19/20 mở offline trong 2s |
| NFR-04 | BE-27, BE-28 | FE-09, FE-14, FE-26 | X-09, X-10 | E-04, suy giảm và availability tháng |
| NFR-05 | BE-02, BE-20, BE-21, BE-22, BE-23, BE-24, BE-25 | FE-20, FE-21, FE-22, FE-23 | X-07 | E-05, transaction/khóa/retry/rollback |
| NFR-06 | BE-03, BE-28 | FE-26 | X-10 | E-06, backup DB+media/RPO/RTO |
| NFR-07 | BE-01, BE-05, BE-06, BE-15, BE-27, BE-28 | FE-03, FE-05, FE-26 | X-03, X-08, X-10 | HTTPS/hash/secret/log redaction |
| NFR-08 | BE-05, BE-14, BE-25, BE-32, BE-39 | FE-05, FE-13, FE-30, FE-36 | X-03, X-08, X-11b, X-12 | RBAC/owner/scope/thu hồi/CSRF |
| NFR-09 | BE-05, BE-06, BE-15, BE-27 | FE-05, FE-06, FE-14 | X-03, X-05, X-08 | 5 fail/15 phút; AI 10/giờ; reset 15 phút |
| NFR-10 | BE-09, BE-10, BE-16, BE-27, BE-36 | FE-02, FE-12, FE-15, FE-33 | X-04, X-05, X-08, X-11c | Schema/file/XSS/prompt injection |
| NFR-11 | BE-07, BE-15, BE-34, BE-36 | FE-07, FE-14, FE-32, FE-33 | X-03, X-05, X-08, X-11b, X-11c | Nhập tay vị trí/không PII/consent hiện tại |
| NFR-12 | BE-08, BE-28, BE-36 | FE-07, FE-19 | X-03, X-06, X-08 | Xác minh/7 ngày/log 90 ngày/logout/giữ giao dịch |
| NFR-13 | BE-39 | FE-36 | X-12 | Nhóm 9/10 và tổng/chênh lệch bộ lọc |
| NFR-14 | BE-04, BE-21, BE-22, BE-23, BE-26, BE-28, BE-39 | FE-13, FE-23, FE-36 | X-07, X-08, X-10, X-12 | Audit đủ trường/quyền/bất biến/180 ngày |
| NFR-15 | BE-01 | FE-01, FE-02, FE-25, FE-37 | X-09, X-12 | E-07, browser/OS/viewport thực tế |
| NFR-16 | BE-13 | FE-02, FE-10, FE-15, FE-25, FE-37 | X-04, X-05, X-09, X-12 | Label/error/keyboard/focus/contrast/transcript |
| NFR-17 | BE-19 | FE-18, FE-19, FE-29 | X-06, X-11a | API offline/account/version/quota/eviction |
| NFR-18 | BE-09, BE-31 | FE-29 | X-11a | License nguồn/quyền/browser support |
| NFR-19 | BE-20, BE-22, BE-25, BE-30, BE-33 | FE-20, FE-21, FE-22, FE-28, FE-31 | X-07, X-11a, X-11b | Đơn vị/tổng/mock label/deadline/không thẻ |
| NFR-20 | BE-16, BE-17, BE-36, BE-37 | FE-15, FE-33, FE-34 | X-05, X-11c | E-08, ID/giờ/tổng/cảnh báo |
| NFR-21 | BE-15, BE-17, BE-18, BE-37 | FE-14, FE-15, FE-17, FE-34 | X-05, X-11c | Lỗi provider giữ lịch/không booking/mẫu giả |
| NFR-22 | BE-01, BE-04, BE-15, BE-27, BE-40 | FE-26 | X-09, X-10, X-12 | Latency/error/timeout/cost, alert 5xx, không PII |
| NFR-23 | BE-04, BE-14, BE-15, BE-29, BE-30, BE-33, BE-34, BE-35 | FE-03, FE-13, FE-27, FE-31, FE-32 | X-02, X-04, X-08, X-11a, X-11b | Config version/snapshot/adapter tách biệt |
| NFR-24 | BE-39 | FE-36 | X-12 | CSV metadata và công thức = + - @ |

## Quy tắc nghiệp vụ và quyết định thiết kế

| BR | Task chính |
| --- | --- |
| BR-01 | BE-02, FE-03, X-02, X-07 |
| BR-02 đến BR-04 | BE-15 đến BE-18, FE-14 đến FE-16, X-05 |
| BR-05 | BE-19, FE-18/19, X-06 |
| BR-06 đến BR-09 | BE-20 đến BE-25, FE-20 đến FE-23, X-07 |
| BR-10 đến BR-11 | BE-18, BE-20, BE-23, FE-17, FE-20/22, X-05, X-07 |
| BR-12 | BE-10, FE-12, X-04 |
| BR-13 | BE-05, BE-14, BE-32, FE-13/30, X-08, X-11b |
| BR-14 đến BR-15 | BE-30/31, FE-28/29, X-11a |
| BR-16 đến BR-17 | BE-14, BE-33/34/35, FE-13/31/32, X-11b |
| BR-18 | BE-39, FE-36, X-12 |

D-20/D-21 (MariaDB và GUID): BE-02/03, FE-03, X-02. SEQ-01/02: X-05; SEQ-03: X-06; SEQ-04/05/06/08: X-07; SEQ-07: X-04 và X-11b; SEQ-09: X-11a; SEQ-10: X-11c. UC-01 đến UC-22 có task và cổng kiểm chứng ở các backlog, gồm UC-22 tại X-03/X-08.

Tổng kiểm kê: 127 FR con, 30 nhóm FR, 24 nhóm NFR và 18 BR. Đối chiếu lại khi SRS thay đổi, không suy đoán thêm yêu cầu.
