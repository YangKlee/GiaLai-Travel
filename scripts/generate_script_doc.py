# -*- coding: utf-8 -*-
import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_borders(cell, top="CBD5E1", bottom="CBD5E1", left="none", right="none", sz="4"):
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    
    borders = {'top': top, 'bottom': bottom, 'left': left, 'right': right}
    for b_name, b_val in borders.items():
        if b_val == "none":
            b_element = parse_xml(f'<w:{b_name} {nsdecls("w")} w:val="none"/>')
        else:
            b_element = parse_xml(f'<w:{b_name} {nsdecls("w")} w:val="single" w:sz="{sz}" w:space="0" w:color="{b_val}"/>')
        tcBorders.append(b_element)
    tcPr.append(tcBorders)

def create_script_document():
    doc = Document()
    
    # Page setup - Margins (1.8 cm = ~0.71 in)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)
        section.different_first_page_header_footer = False
        
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("GiaLaiTravel | Kịch bản Video Khởi nghiệp (3 Phút) - Start Fest Z 2026")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Dự án Khởi nghiệp Sáng tạo GiaLaiTravel - Trang kịch bản tiền kỳ & sản xuất video")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
    normal_style.paragraph_format.line_spacing = 1.2
    normal_style.paragraph_format.space_after = Pt(4)

    # Title Block
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_after = Pt(2)
    p_pre.paragraph_format.space_before = Pt(0)
    r_pre = p_pre.add_run("CUỘC THI KHỞI NGHIỆP ĐỔI MỚI SÁNG TẠO - START FEST Z 2026")
    r_pre.font.size = Pt(10)
    r_pre.font.bold = True
    r_pre.font.color.rgb = RGBColor(15, 118, 110) # Teal 700

    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_after = Pt(4)
    p_title.paragraph_format.space_before = Pt(0)
    r_title = p_title.add_run("KỊCH BẢN VIDEO QUẢNG CÁO SẢN PHẨM KHỞI NGHIỆP\n(ĐỊNH DẠNG 1 NGƯỜI DẪN - PHONG THÁI CHUYÊN NGHIỆP)")
    r_title.font.size = Pt(18)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(27, 54, 93) # Deep Navy

    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("Dự án: GiaLaiTravel – Ứng dụng du lịch thông minh chuyên sâu cho tỉnh Gia Lai mới\nThời lượng chuẩn: 03 phút (180 giây) | Cấu trúc: Vấn đề → Giới thiệu sản phẩm → Giải pháp sản phẩm → Kêu gọi hành động")
    r_sub.font.size = Pt(10.5)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    # Info card table
    info_table = doc.add_table(rows=2, cols=2)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_widths = [Inches(3.4), Inches(3.5)]
    
    row0 = info_table.rows[0]
    row0.cells[0].paragraphs[0].add_run("Đơn vị thực hiện: Nhóm dự án GiaLaiTravel\nĐại diện: Phan Ngọc Mai\nThành viên: Nguyễn Khánh Dương, Nguyễn Khánh Tân").font.size = Pt(9.5)
    row0.cells[1].paragraphs[0].add_run("Chủ đề Năm Du lịch 2026: 'Gia Lai - Đại ngàn chạm biển xanh'\nĐơn vị dự thi: Cuộc thi Start Fest Z 2026\nĐịa bàn: Tỉnh Gia Lai mới (Quy Nhơn - Pleiku)").font.size = Pt(9.5)
    
    row1 = info_table.rows[1]
    row1.cells[0].paragraphs[0].add_run("Thể loại: Video Quảng cáo / Pitching Sản phẩm (1 Diễn viên chính)\nĐịnh dạng hiển thị: 16:9 (Youtube / Trình chiếu) & 9:16 (Reels / TikTok)").font.size = Pt(9.5)
    row1.cells[1].paragraphs[0].add_run("Tông giọng: Tự tin, chuyên nghiệp, đĩnh đạc, truyền cảm hứng\nTốc độ nói: 125 - 135 từ/phút (Khoảng 380 - 410 từ toàn bài)").font.size = Pt(9.5)

    for row in info_table.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = info_widths[idx]
            set_cell_background(cell, "F1F5F9")
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            set_cell_borders(cell, top="CBD5E1", bottom="CBD5E1", left="CBD5E1", right="CBD5E1")

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Section 1: Thông số kỹ thuật & Tiền kỳ
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(4)
    r_h1 = h1.add_run("I. THÔNG SỐ KỸ THUẬT & YÊU CẦU TIỀN KỲ (PRE-PRODUCTION)")
    r_h1.font.bold = True
    r_h1.font.size = Pt(13)
    r_h1.font.color.rgb = RGBColor(27, 54, 93)

    bullets1 = [
        ("Nhân vật xuất hiện (01 người dẫn duy nhất):", " Founder/Đại diện dự án (hoặc người phát ngôn trẻ trung, phong thái đĩnh đạc, tự tin, phát âm chuẩn tiếng Việt, có khả năng diễn đạt ngôn ngữ hình thể phóng khoáng)."),
        ("Trang phục & Diện mạo:", " Phong cách Doanh nhân Công nghệ trẻ (Smart Casual) – Áo blazer cách điệu màu trung tính (navy, xám hoặc xanh rêu sẫm), bên trong áo thun trơn chất liệu cao cấp, có thể phối nhẹ một huy hiệu cài áo biểu trưng của dự án hoặc chi tiết hoa văn thổ cẩm tinh tế."),
        ("Bối cảnh ghi hình (Set quay kết hợp):", " Không gian studio hiện đại với tông xám bạc/xanh biển tối giản, bố trí 1 bục đứng và màn hình LED phụ phía sau chạy logo động GiaLaiTravel. Ngoài ra, xen kẽ các đoạn B-roll chất lượng cao quay thực tế tại Biển Hồ, đỉnh núi Chư Đang Ya (Pleiku) và bờ biển Kỳ Co, Tháp Đôi (Quy Nhơn)."),
        ("Thiết bị & Đạo cụ:", " Máy quay độ phân giải 4K, 2 góc máy (Góc 1: Chính diện toàn/trung cảnh; Góc 2: Lệch 30 độ cận cảnh). Đạo cụ chính: 01 chiếc Smartphone cao cấp cài sẵn bản demo/mockup ứng dụng GiaLaiTravel hiển thị các thao tác lướt, kéo - thả trực quan."),
        ("Âm nhạc & Xử lý âm thanh (Soundtrack & SFX):", " Nhạc nền sử dụng phong cách Corporate Modern Tech kết hợp nhẹ nhàng âm sắc nhạc cụ dân tộc Tây Nguyên (tiếng sáo, cồng chiêng điện tử cách tân). Sound effects: Âm thanh 'click', 'swish', thông báo lịch trình hoàn thành công nghệ cao.")
    ]
    for b_title, b_desc in bullets1:
        p_b = doc.add_paragraph(style='List Bullet')
        p_b.paragraph_format.space_after = Pt(3)
        run_bt = p_b.add_run(b_title)
        run_bt.font.bold = True
        run_bt.font.color.rgb = RGBColor(15, 118, 110)
        p_b.add_run(b_desc)

    # Section 2: Tổng quan cấu trúc
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(14)
    h2.paragraph_format.space_after = Pt(4)
    r_h2 = h2.add_run("II. CẤU TRÚC PHÂN PHỐI THỜI LƯỢNG (TIMELINE BREAKDOWN - 180 GIÂY)")
    r_h2.font.bold = True
    r_h2.font.size = Pt(13)
    r_h2.font.color.rgb = RGBColor(27, 54, 93)

    timeline_data = [
        ("Màn 1: VẤN ĐỀ (The Problem & Pain Points)", "00:00 - 00:45 (45s)", "Nỗi đau của du khách: Thông tin phân mảnh, tốn thời gian lập kế hoạch (82.9%), app du lịch vô dụng khi phát sinh thay đổi (37%), mất sóng đèo dốc và thiếu chiều sâu văn hóa sau sáp nhập tỉnh mới."),
        ("Màn 2: GIỚI THIỆU SẢN PHẨM (Product Introduction)", "00:45 - 01:10 (25s)", "Sự ra đời của GiaLaiTravel – Trợ lý du lịch thông minh, chuyên sâu 100% cho tỉnh Gia Lai mới, đồng hành cùng Năm Du lịch Quốc gia 2026 'Đại ngàn chạm biển xanh'."),
        ("Màn 3: GIẢI PHÁP SẢN PHẨM (Solution & Core Features)", "01:10 - 02:25 (75s)", "4 trụ cột giải pháp: (1) AI gợi ý lịch trình 30s; (2) Tùy biến Kéo - Thả tự tính lại độc quyền; (3) Công nghệ Offline-First xóa tan mất sóng; (4) Audio Guide đa ngôn ngữ & kết nối homestay bản địa."),
        ("Màn 4: TẦM NHÌN & KÊU GỌI HÀNH ĐỘNG (Vision & Call-To-Action)", "02:25 - 03:00 (35s)", "Giải phóng du khách khỏi âu lo, tạo động lực phát triển kinh tế số địa phương; Kêu gọi trải nghiệm, quét mã QR tải app GiaLaiTravel.")
    ]

    t_table = doc.add_table(rows=len(timeline_data)+1, cols=3)
    t_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_widths = [Inches(2.2), Inches(1.3), Inches(3.4)]

    # Header
    t_headers = ["Phân đoạn", "Thời lượng", "Mục tiêu truyền thông & Nội dung cốt lõi"]
    for i, h_text in enumerate(t_headers):
        cell = t_table.rows[0].cells[i]
        cell.width = t_widths[i]
        set_cell_background(cell, "1B365D")
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        set_cell_borders(cell, top="1B365D", bottom="1B365D", left="none", right="none")
        cp = cell.paragraphs[0]
        crun = cp.add_run(h_text)
        crun.font.bold = True
        crun.font.size = Pt(9.5)
        crun.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, data in enumerate(timeline_data, start=1):
        row = t_table.rows[row_idx]
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            cell.width = t_widths[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
            set_cell_borders(cell, top="E2E8F0", bottom="E2E8F0", left="none", right="none")
            cp = cell.paragraphs[0]
            crun = cp.add_run(text)
            crun.font.size = Pt(9.5)
            if col_idx == 0:
                crun.font.bold = True
                crun.font.color.rgb = RGBColor(15, 118, 110)
            elif col_idx == 1:
                crun.font.bold = True
                crun.font.color.rgb = RGBColor(217, 119, 6)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Section 3: Bảng phân cảnh chi tiết
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(14)
    h3.paragraph_format.space_after = Pt(4)
    r_h3 = h3.add_run("III. KỊCH BẢN PHÂN CẢNH CHI TIẾT (SHOOTING SCRIPT 3 PHÚT)")
    r_h3.font.bold = True
    r_h3.font.size = Pt(13)
    r_h3.font.color.rgb = RGBColor(27, 54, 93)

    script_scenes = [
        # Scene 1
        ("CẢNH 1: THE HOOK\n(Mở đầu khơi gợi)",
         "00:00 - 00:20\n(20 giây)",
         "• Góc máy: Trung cận (Medium Close-up) chính diện.\n• Hình ảnh: Người dẫn xuất hiện tự tin trong trang phục smart casual, bước nhẹ 2 bước lại gần máy quay, nhìn thẳng vào người xem với ánh mắt đồng cảm.\n• B-roll lồng ghép (3s): Cảnh một bạn trẻ ngồi bên đống tab điện thoại mở lộn xộn, vẻ mặt mệt mỏi.",
         "[Người dẫn - Giọng ấm áp, truyền cảm, gợi mở]:\n\n\"Bạn đã bao giờ dành cả tuần lễ, mở hàng chục bài review, lưu lại vô số video trên mạng để chuẩn bị cho một chuyến du lịch... nhưng khi đặt chân đến nơi, mọi thứ lại hoàn toàn chệch hướng?\n\nChuyến đi trong mơ bỗng trở thành những chuỗi ngày loay hoay vì thông tin rời rạc, điểm đến không như kỳ vọng, và lịch trình thì dày đặc nhưng thiếu tính thực tế?\"",
         "• Âm thanh: Nhạc nền chậm rãi, tiếng lướt màn hình điện thoại dồn dập, tiếng thở dài nhẹ.\n• VFX/Text: Dòng chữ đồ họa hiện mờ: 'Kỳ nghỉ thư giãn hay thêm một gánh nặng?'"),

        # Scene 2
        ("CẢNH 2: NỖI ĐAU THỊ TRƯỜNG\n(Số liệu thực chứng)",
         "00:20 - 00:45\n(25 giây)",
         "• Góc máy: Góc nghiêng 30 độ (Camera 2) chuyển cận cảnh (Close-up).\n• Hình ảnh: Người dẫn giơ tay nhấn mạnh các con số.\n• B-roll lồng ghép: Cảnh thực tế du khách cầm điện thoại đứng ngơ ngác giữa một ngã ba đường đèo, màn hình quay tròn báo mất kết nối 4G.",
         "[Người dẫn - Giọng đanh thép, nghiêm túc]:\n\n\"Đó không phải là câu chuyện của riêng bạn. Các khảo sát mới nhất cho thấy:\n- Hơn 82.9% du khách thừa nhận việc tự lên lịch trình tiêu tốn quá nhiều thời gian.\n- Gần 67% cảm thấy kiệt sức vì tình trạng quá tải thông tin.\n- Và có tới 37% người dùng khẳng định các ứng dụng hiện tại trở nên vô dụng ngay khi kế hoạch chuyến đi bị thay đổi!\n\nĐặc biệt tại Gia Lai mới – tỉnh có diện tích lớn thứ hai cả nước nối liền Pleiku với Quy Nhơn – các app lớn chỉ chăm chăm đặt phòng, còn bản đồ thì không thể kể chuyện văn hóa, và sóng điện thoại thì chập chờn khi qua đèo dốc.\"",
         "• Âm thanh: Tiếng cảnh báo 'Warning' nhẹ, hiệu ứng chuyển số nhảy tăng dần trên màn hình.\n• VFX/Text: Đồ họa số liệu ấn tượng xuất hiện bên cạnh người dẫn:\n+ 82.9% Tốn thời gian\n+ 67% Căng thẳng thông tin\n+ 37% App vô dụng khi đổi lịch"),

        # Scene 3
        ("CẢNH 3: BƯỚC NGOẶT & SỰ RA ĐỜI\n(Giới thiệu sản phẩm)",
         "00:45 - 01:10\n(25 giây)",
         "• Góc máy: Trở lại Camera 1 (Trung cảnh), nụ cười rạng rỡ, thần thái tự tin, tràn đầy năng lượng đổi mới sáng tạo.\n• B-roll điện ảnh: Thước phim Cinematic Flycam chuyển cảnh mượt mà: Từ đồi chè Biển Hồ xanh ngút ngàn, qua miệng núi lửa Chư Đang Ya vàng rực dã quỳ, rồi đổ dài xuống bờ biển Kỳ Co - Eo Gió xanh biếc của Quy Nhơn.",
         "[Người dẫn - Giọng dứt khoát, hào hứng]:\n\n\"Chúng tôi tin rằng: Du lịch là để tận hưởng, không phải để âu lo!\n\nĐứng trước cơ hội lịch sử của Năm Du lịch Quốc gia 2026 với chủ đề 'Gia Lai - Đại ngàn chạm biển xanh', chúng tôi mang đến một giải pháp hoàn toàn mới:\n\nXin giới thiệu GiaLaiTravel – Ứng dụng di động thông minh thế hệ mới, được thiết kế chuyên sâu 100% cho hành trình kết nối cao nguyên và biển cả!\"",
         "• Âm thanh: Nhạc nền bùng nổ sang điệu Modern Corporate Uplifting (nhịp trống trẻ trung, hiện đại hòa cùng âm vang cồng chiêng điện tử).\n• VFX: Logo 3D của GiaLaiTravel xoay tròn tinh tế, slogan hiện rõ: 'Trợ lý du lịch thông minh - Chạm đại ngàn, mở biển xanh'."),

        # Scene 4
        ("CẢNH 4: TRỤ CỘT 1 - AI ĐỀ XUẤT 30S\n(Giải pháp cá nhân hóa)",
         "00:10 - 01:30\n(20 giây)",
         "• Góc máy: Góc cận vừa, người dẫn cầm chiếc smartphone trên tay, thao tác ngón tay chạm nhẹ vào màn hình.\n• Kỹ xảo: Mockup màn hình điện thoại 3D trôi nổi bên cạnh người dẫn, mô phỏng giao diện app cực mượt.",
         "[Người dẫn - Giọng chuyên nghiệp, chỉ dẫn mạch lạc]:\n\n\"Điểm đột phá đầu tiên: Bạn không cần mất hàng đêm để đọc review nữa.\n\nVới GiaLaiTravel, bạn chỉ cần nhập số ngày đi, ngân sách dự kiến và sở thích – từ nghỉ dưỡng biển, ẩm thực bản địa cho đến trekking khám phá đại ngàn. Trí tuệ nhân tạo sẽ tự động thiết kế lộ trình chi tiết từng ngày, từng giờ di chuyển và điểm ăn nghỉ hoàn hảo... chỉ sau đúng 30 giây!\"",
         "• Âm thanh: Tiếng AI scan, tiếng 'ting' hoàn thành lộ trình cực nhanh và êm tai.\n• VFX: Màn hình app lướt mượt: Chọn '3 ngày 2 đêm - Thiên nhiên & Văn hóa' $\rightarrow$ Lịch trình Pleiku - Quy Nhơn xuất hiện sắc nét trong 30s."),

        # Scene 5
        ("CẢNH 5: TRỤ CỘT 2 - KÉO THẢ TÙY BIẾN\n(Tính năng độc quyền 'ăn tiền')",
         "01:30 - 01:50\n(20 giây)",
         "• Góc máy: Cận cảnh bàn tay thao tác trên điện thoại kết hợp góc nhìn biểu cảm tự tin của người dẫn.\n• Kỹ xảo UI: Hiệu ứng phóng to ngón tay chạm giữ một thẻ địa điểm, kéo sang vị trí khác, toàn bộ thanh thời gian và lộ trình tự động chạy lại số liệu trong nháy mắt.",
         "[Người dẫn - Nhấn mạnh, tràn đầy thuyết phục]:\n\n\"Và đây chính là sự khác biệt lớn nhất mà chưa ứng dụng nào làm được: Toàn quyền kiểm soát nằm trong tay bạn.\n\nTrời bất ngờ đổ mưa? Bạn muốn nán lại ngắm hoàng hôn Eo Gió thêm 1 tiếng? Rất đơn giản: Chỉ cần Kéo và Thả địa điểm. Thuật toán thông minh của GiaLaiTravel sẽ lập tức tự động tính toán lại toàn bộ cung đường, thời gian di chuyển và phương tiện phù hợp nhất. AI đề xuất – nhưng chính bạn là người làm chủ chuyến đi!\"",
         "• Âm thanh: Hiệu ứng âm thanh kéo thả 'Swish - Snap', tiếng tính toán nhảy số lộ trình cực kỳ công nghệ.\n• VFX: Text nổi bật: 'KÉO - THẢ LINH HOẠT: HỆ THỐNG TỰ TÍNH LẠI 100%'"),

        # Scene 6
        ("CẢNH 6: TRỤ CỘT 3 - OFFLINE-FIRST\n(Xóa tan nỗi lo mất mạng)",
         "01:50 - 02:08\n(18 giây)",
         "• Góc máy: Trung cảnh, người dẫn mỉm cười nhẹ nhõm, làm động tác ngắt biểu tượng Wifi trên tay.\n• B-roll lồng ghép: Du khách đứng giữa rừng nguyên sinh Kon Ka Kinh hoặc đèo An Khê, điện thoại vẫn hiển thị bản đồ sắc nét, chỉ đường chuẩn xác từng mét.",
         "[Người dẫn - Giọng chân tình, thấu hiểu thực tế địa phương]:\n\n\"Chúng tôi hiểu rất rõ địa hình cao nguyên. Khi băng qua những cánh rừng Kon Ka Kinh hay những cung đường đèo hùng vĩ, sóng điện thoại chắc chắn sẽ chập chờn.\n\nĐó là lý do GiaLaiTravel được xây dựng với kiến trúc Offline-First: Cho phép bạn tải trước toàn bộ bản đồ số, lộ trình và dữ liệu âm thanh. Dù không có một vạch sóng nào, bạn vẫn luôn an tâm vi vu mà không sợ lạc lối.\"",
         "• Âm thanh: Tiếng chim rừng hót trong trẻo hòa âm nhạc công nghệ.\n• VFX: Biểu tượng Offline Mode sáng đèn xanh '100% Hoạt động không cần mạng 4G/Wifi'."),

        # Scene 7
        ("CẢNH 7: TRỤ CỘT 4 - VĂN HÓA BẢN ĐỊA\n(Audio Guide & Cộng đồng)",
         "02:08 - 02:25\n(17 giây)",
         "• Góc máy: Góc nghiêng nghệ thuật.\n• B-roll: Cảnh cận nghệ nhân dệt thổ cẩm làng Plei Ơp, nụ cười em bé Jrai, bếp lửa bập bùng trong ngôi nhà rông và tiếng cồng chiêng ngân vang.\n• Hình ảnh app: Giao diện Audio Guide phát sóng âm với tùy chọn 4 ngôn ngữ.",
         "[Người dẫn - Giọng lắng đọng, tự hào bản sắc]:\n\n\"Không chỉ dẫn đường, GiaLaiTravel còn là một người kể chuyện văn hóa sâu sắc.\n\nHệ thống thuyết minh Audio Guide đa ngôn ngữ sẽ đưa bạn hòa mình vào không gian cồng chiêng Tây Nguyên, lắng nghe những sử thi Ba Na, Jrai bất hủ; đồng thời kết nối trực tiếp bạn với những homestay bản địa, những nghệ nhân dệt thổ cẩm mộc mạc – những nét đẹp chân thực mà các trang web thương mại chưa bao giờ chạm tới.\"",
         "• Âm thanh: Tiếng cồng chiêng vang ngân trầm hùng, hòa giọng thuyết minh audio guide mẫu (tiếng Anh và tiếng Việt).\n• VFX: Icon đa ngôn ngữ: Việt - Anh - Hàn - Trung - Jrai."),

        # Scene 8
        ("CẢNH 8: TẦM NHÌN & GIÁ TRỊ XÃ HỘI\n(Start Fest Z Impact)",
         "02:25 - 02:45\n(20 giây)",
         "• Góc máy: Góc toàn cảnh (Wide shot) vững chãi, người dẫn đứng thẳng, hai tay khép nhẹ trước ngực biểu thị sự cam kết vững bền.\n• B-roll: Hình ảnh các sự kiện lễ hội nhộn nhịp của Năm Du lịch Quốc gia 2026, các bạn trẻ trải nghiệm du lịch vui vẻ.",
         "[Người dẫn - Giọng truyền cảm hứng, trang trọng]:\n\n\"GiaLaiTravel sinh ra không chỉ là một ứng dụng du lịch cho người trẻ, mà còn là khát vọng đóng góp vào chuyển đổi số du lịch của tỉnh nhà, là đòn bẩy kinh tế cho cộng đồng bà con địa phương trong chuỗi 244 sự kiện của Năm Du lịch Quốc gia 2026.\n\nChúng tôi mang công nghệ phục vụ và tôn vinh bản sắc bản địa!\"",
         "• Âm thanh: Âm nhạc dâng trào cao trào, thôi thúc tinh thần dân tộc và khởi nghiệp trẻ.\n• VFX: Huy hiệu bảo chứng: 'Đồng hành cùng Năm Du lịch Quốc gia 2026' - 'Top ý tưởng Start Fest Z 2026'."),

        # Scene 9
        ("CẢNH 9: KÊU GỌI HÀNH ĐỘNG\n(Call To Action & Ending)",
         "02:45 - 03:00\n(15 giây)",
         "• Góc máy: Cận cảnh chính diện (Direct to camera), nụ cười tươi tắn, bàn tay hướng về phía màn hình chứa mã QR code.\n• Khung hình kết thúc (Outro): Màn hình đồ họa chuẩn chỉn chu, logo GiaLaiTravel sắc nét, mã QR lớn, huy hiệu App Store và Google Play.",
         "[Người dẫn - Giọng rạng rỡ, thôi thúc hành động]:\n\n\"Hành trình 'Cao nguyên chạm biển' tuyệt đẹp đang chờ đón bạn. Hãy quét mã QR trên màn hình ngay bây giờ hoặc tải ứng dụng GiaLaiTravel trên App Store và Google Play.\n\nGiaLaiTravel – Người bạn đồng hành thông minh trên mọi nẻo đường Gia Lai mới!\nXin chân thành cảm ơn!\"",
         "• Âm thanh: Nhạc kết cao trào, tiếng chuông kết thúc thanh thoát.\n• VFX/Graphics Outro:\n+ Logo GiaLaiTravel & Start Fest Z 2026\n+ QR Code tải ứng dụng\n+ Hotline: 0886 815 653\n+ Website: gialaitravel.vn")
    ]

    # Script table layout (4 columns to fit comfortably in portrait)
    s_table = doc.add_table(rows=len(script_scenes)+1, cols=4)
    s_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    s_widths = [Inches(1.3), Inches(1.8), Inches(2.6), Inches(1.3)]

    # Headers
    s_headers = ["Phân cảnh & Thời gian", "Hình ảnh & Góc máy (Visual)", "Lời thoại người dẫn & Diễn xuất (Voice)", "Âm thanh & Đồ họa (SFX & VFX)"]
    for i, h_text in enumerate(s_headers):
        cell = s_table.rows[0].cells[i]
        cell.width = s_widths[i]
        set_cell_background(cell, "1B365D")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        set_cell_borders(cell, top="1B365D", bottom="1B365D", left="none", right="none")
        cp = cell.paragraphs[0]
        crun = cp.add_run(h_text)
        crun.font.bold = True
        crun.font.size = Pt(9)
        crun.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, (sc_name, sc_time, sc_vis, sc_voice, sc_sfx) in enumerate(script_scenes, start=1):
        row = s_table.rows[row_idx]
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        
        # Col 0: Cảnh & Time
        cell0 = row.cells[0]
        cell0.width = s_widths[0]
        set_cell_background(cell0, bg)
        set_cell_margins(cell0, top=80, bottom=80, left=100, right=100)
        set_cell_borders(cell0, top="CBD5E1", bottom="CBD5E1", left="none", right="none")
        p0 = cell0.paragraphs[0]
        r0a = p0.add_run(sc_name + "\n\n")
        r0a.font.bold = True
        r0a.font.size = Pt(9)
        r0a.font.color.rgb = RGBColor(15, 118, 110)
        r0b = p0.add_run(sc_time)
        r0b.font.bold = True
        r0b.font.size = Pt(8.5)
        r0b.font.color.rgb = RGBColor(217, 119, 6)

        # Col 1: Visual & Camera
        cell1 = row.cells[1]
        cell1.width = s_widths[1]
        set_cell_background(cell1, bg)
        set_cell_margins(cell1, top=80, bottom=80, left=100, right=100)
        set_cell_borders(cell1, top="CBD5E1", bottom="CBD5E1", left="none", right="none")
        p1 = cell1.paragraphs[0]
        r1 = p1.add_run(sc_vis)
        r1.font.size = Pt(8.5)

        # Col 2: Voice & Script
        cell2 = row.cells[2]
        cell2.width = s_widths[2]
        set_cell_background(cell2, bg)
        set_cell_margins(cell2, top=80, bottom=80, left=100, right=100)
        set_cell_borders(cell2, top="CBD5E1", bottom="CBD5E1", left="none", right="none")
        p2 = cell2.paragraphs[0]
        r2 = p2.add_run(sc_voice)
        r2.font.size = Pt(8.5)

        # Col 3: SFX & VFX
        cell3 = row.cells[3]
        cell3.width = s_widths[3]
        set_cell_background(cell3, bg)
        set_cell_margins(cell3, top=80, bottom=80, left=100, right=100)
        set_cell_borders(cell3, top="CBD5E1", bottom="CBD5E1", left="none", right="none")
        p3 = cell3.paragraphs[0]
        r3 = p3.add_run(sc_sfx)
        r3.font.size = Pt(8.5)
        r3.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # Section 4: Hướng dẫn hậu kỳ & Kỹ thuật diễn xuất
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(14)
    h4.paragraph_format.space_after = Pt(4)
    r_h4 = h4.add_run("IV. CHỈ DẪN KỸ THUẬT HẬU KỲ & LƯU Ý DIỄN XUẤT CHO DIỄN VIÊN")
    r_h4.font.bold = True
    r_h4.font.size = Pt(13)
    r_h4.font.color.rgb = RGBColor(27, 54, 93)

    tips = [
        ("Kỹ thuật điều khiển ánh mắt & Giao tiếp ống kính:", " Diễn viên cần nhìn thẳng vào tâm ống kính như đang trò chuyện 1-1 với một nhà đầu tư hoặc một du khách bạn bè thân thiết. Tránh nhìn đảo mắt sang máy nhắc chữ quá lộ liễu. Ở các câu chuyển đoạn, có thể nghiêng nhẹ đầu sang góc máy 2 để tạo sự năng động và giữ nhịp thu hút."),
        ("Phân bố năng lượng giọng nói (Voice modulation):", " \n• Đoạn 1 (0-45s): Giọng có độ lắng, tông trầm ấm, thể hiện sự đồng cảm với nỗi khổ của người đi du lịch.\n• Đoạn 2 & 3 (45s-2p25s): Giọng đẩy tông sáng, nhấn mạnh vào các từ khóa công nghệ: '30 giây', 'Kéo - Thả', 'Offline-First', 'Tự tính lại', 'Văn hóa độc bản'. Tốc độ dứt khoát, thể hiện sự am tường sản phẩm.\n• Đoạn 4 (2p25s-3p00s): Giọng ấm áp, truyền lửa tự hào quê hương và thôi thúc người xem hành động ngay lập tức."),
        ("Chỉ dẫn ghi hình Mockup ứng dụng di động (Crucial UI/UX):", " Ở Cảnh 5 (Kéo thả), bộ phận hậu kỳ cần chèn màn hình UI điện thoại thật có animation ngón tay rê ngón kéo điểm tham quan từ vị trí số 3 lên số 1, kèm theo thanh loading tính toán lại cung đường trong vòng 0.5 giây. Đây là bằng chứng công nghệ quan trọng nhất giúp dự án ghi điểm tuyệt đối với ban giám khảo Start Fest Z 2026."),
        ("Quy chuẩn xuất file & Khung hình đa nền tảng:", " \n• Bản Master: 16:9 Full HD/4K (1920x1080 hoặc 3840x2160), 24fps hoặc 30fps phục vụ trình chiếu sân khấu cuộc thi và Youtube.\n• Bản Cắt ngắn / Re-frame: 9:16 (1080x1920) cắt riêng các phân cảnh 30 giây (AI Plan, Kéo Thả, Offline) dùng chạy chiến dịch Reels/TikTok Marketing cho Năm Du lịch 2026.")
    ]

    for t_title, t_desc in tips:
        p_t = doc.add_paragraph(style='List Bullet')
        p_t.paragraph_format.space_after = Pt(4)
        run_tt = p_t.add_run(t_title)
        run_tt.font.bold = True
        run_tt.font.color.rgb = RGBColor(15, 118, 110)
        p_t.add_run(t_desc)

    # Section 5: Ký duyệt
    p_sign = doc.add_paragraph()
    p_sign.paragraph_format.space_before = Pt(20)
    p_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_date = p_sign.add_run("Quy Nhơn, Ngày 31 tháng 10 năm 2026\nĐẠI DIỆN DỰ ÁN KHỞI NGHIỆP GIALAITRAVEL\n\n\n\n")
    r_date.font.italic = True
    r_name = p_sign.add_run("Phan Ngọc Mai")
    r_name.font.bold = True
    r_name.font.size = Pt(11)

    # Output paths
    output_docs = r"d:\GiaLai-Travel\docs\Kich_Ban_Video_Quang_Cao_GiaLaiTravel_3Phut.docx"
    output_root = r"d:\GiaLai-Travel\Kich_Ban_Video_Quang_Cao_GiaLaiTravel_3Phut.docx"
    
    doc.save(output_docs)
    doc.save(output_root)
    print(f"Successfully generated Word document at:\n1. {output_docs}\n2. {output_root}")

if __name__ == "__main__":
    create_script_document()
