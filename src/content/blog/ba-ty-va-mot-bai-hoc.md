-----

title: “Ba tỷ và một bài học”
date: 2026-06-03
tags: [“Thất bại”, “Chuyển đổi số”, “Logistics”]
readTime: “~8 phút đọc”
description: “Một công ty forwarder hai mươi năm tuổi, sáu mươi nhân viên, vừa ký hợp đồng phần mềm ba tỷ đồng. Tám tháng sau, hợp đồng chấm dứt. Đây là cách chuyện diễn ra.”
series: “”
seriesOrder: 0
relatedSlugs:

- “phan-mem-bat-dau-hoc-con-nguoi”
  callToAction: “đang cân nhắc hoặc đang triển khai một dự án số hóa trong doanh nghiệp của mình”

-----

Tháng ba một năm gần đây, một công ty forwarder ở Hà Nội ký hợp đồng phần mềm trị giá hơn ba tỷ đồng. Họ không phải startup. Hai mươi năm trong nghề, sáu mươi nhân viên, doanh thu hàng năm gần năm trăm tỷ. Mỗi tháng chạy khoảng một ngàn hai trăm lô hàng đi các cửa khẩu phía Bắc. Một cái tên được nhắc trong hội nghị ngành.

Tháng mười một cùng năm, họ chấm dứt hợp đồng. Hai tỷ rưỡi đã trả không lấy lại được. Phần mềm bỏ giữa chừng.

Đây là cách chuyện diễn ra.

## Người biết nhiều nhất là vấn đề lớn nhất

Người sáng lập — gọi là anh T — bốn mươi tám tuổi khi ký hợp đồng. Anh bắt đầu nghề năm hai mươi sáu với một chiếc xe máy và một cuốn sổ tay ghi giá cước. Hai mươi năm sau anh tự hào nói với khách rằng không ai trong công ty hiểu quy trình rõ hơn anh.

Điều đó đúng. Và đó là vấn đề.

Đối tác phần mềm — một công ty có uy tín, đã làm cho vài tập đoàn lớn — hỏi anh T tuần đầu một câu hỏi rất bình thường: muốn số hóa quy trình hiện tại, hay thiết kế lại quy trình rồi mới build? Anh T trả lời không cần suy nghĩ.

*“Cách chúng tôi đang làm đang chạy được. Các anh cứ làm theo cái đó.”*

Trong phòng có sáu người. Trưởng phòng vận hành — mười hai năm theo anh T — gật đầu. Kế toán trưởng — mười năm — cũng gật. Phó giám đốc trẻ vừa về từ Singapore — người duy nhất đề xuất làm ngược lại — không nói gì. Cô biết tranh luận trong phòng đó là vô ích.

## Tuần đầu mọi thứ trông ổn

Sáu tháng sau, phần mềm go-live cho hai tuyến đầu tiên. Sale báo giá nhanh hơn vì hệ thống pull rate từ Excel cũ. CS thấy được status shipment thay vì gọi điện hỏi. Anh T đi các cuộc họp ngành khoe rằng công ty mình đã “chuyển đổi số xong”.

Tuần thứ hai, vấn đề đầu tiên xuất hiện.

Một xe đến cửa khẩu thì phát hiện thiếu giấy phép biên. Vendor đổi sang xe khác. Trên hệ thống, biển số xe nằm cứng ở bốn chỗ: bảng kê nội bộ, tờ khai hải quan, lệnh điều xe, và file gửi khách. CS phải sửa tay từng cái. Họ sửa được ba, quên một. Tờ khai hải quan đi với biển cũ. Hải quan giữ hàng hai mươi tiếng. Khách gọi — xin lỗi không xong.

Trưởng phòng vận hành báo cáo lên: *“Cái này hệ thống mới làm chậm hơn cách cũ.”*

Vendor đến giải thích rằng cấu trúc dữ liệu hiện tại không cho phép đổi xe cascade. Phải design lại data model. Anh T nghe nửa câu thì cắt: *“Các anh đã làm theo cách chúng tôi yêu cầu rồi. Bây giờ tự đi mà sửa.”*

Vendor sửa. Họ thêm một chức năng cho phép edit biển số ở bốn chỗ cùng lúc. Họ không nói rằng cách đó là patch trên patch.

## Tháng thứ ba, thứ tư, thứ năm

Tháng thứ ba: một lô hàng có chi phí phát sinh tại biên. CS nhập vào hệ thống dưới dạng “phí khác”. Không ai biết “phí khác” này có trong rate sheet hay không, vì rate sheet không có version — chỉ là một file Excel chia sẻ chung. Cuối tháng kế toán phát hiện chi phí lô này vượt báo giá hai mươi sáu phần trăm. Sale phụ trách đã chuyển công ty, không liên lạc được. Lô đó lỗ chín mươi triệu.

Anh T họp khẩn. Anh không hỏi vì sao cấu trúc dữ liệu cho phép việc đó. Anh hỏi vì sao CS lại nhập “phí khác” mà không gọi cho anh trước. Cô CS đó nghỉ việc sau hai tuần.

Tháng thứ tư: mọi shipment đều có thể có “phí khác” hợp thức hóa sau đó. Mọi đổi xe vẫn phải sửa tay ba bốn chỗ. Mọi bảng kê đối soát với khách vẫn phải làm cuối tháng bằng Excel — vì hệ thống không tự sinh được. Phó giám đốc trẻ trình một slide trong HĐQT: chi phí vận hành tăng mười bốn phần trăm so với trước khi có phần mềm. Năng suất CS giảm. Hai người kế toán xin nghỉ vì burn-out.

Anh T nói với HĐQT rằng đây là vấn đề “đào tạo người dùng”, không phải vấn đề hệ thống. HĐQT yên lặng.

Tháng thứ năm: một khách hàng lớn — chiếm hai mươi hai phần trăm doanh thu — chuyển bốn mươi phần trăm volume sang đối thủ. Đối thủ là công ty nhỏ hơn, mới hơn, nhưng họ có hệ thống cho phép khách track real-time với độ chính xác đến phút. Họ build hệ thống đó hai năm trước — và dành tám tháng đầu chỉ để thiết kế lại quy trình, không viết một dòng code.

Lúc đó họ là công ty thứ hai mươi mấy trong ngành. Bây giờ họ là công ty thứ năm.

## Câu trong báo cáo cuối dự án

Tháng thứ sáu, anh T gặp phó giám đốc trẻ ở quán cà phê đối diện văn phòng. Sau cuộc họp đó, công ty đình chỉ dự án. Vendor được trả nốt phí chấm dứt sớm. Hai tỷ rưỡi đã trả không thể đòi lại — vì hợp đồng yêu cầu vendor build theo yêu cầu của khách hàng, và vendor đã làm đúng.

Trong báo cáo cuối dự án, vendor viết một dòng mà về sau cô phó giám đốc đóng khung treo trong văn phòng:

> “Khách hàng yêu cầu chúng tôi số hóa quy trình hiện tại. Chúng tôi đã làm như vậy. Tiếc rằng quy trình hiện tại của khách hàng có những điểm không thể số hóa mà vẫn vận hành tốt.”

Câu đó không phải lời chỉ trích. Nó là sự thật kỹ thuật. Một quy trình dựa vào “anh T quyết định khi nào thì sai” thì không có cách nào code được — vì code cần rule, không cần intuition.

## Bây giờ họ đang làm lại

Công ty đó đang build lại từ đầu. Lần này họ dành bốn tháng đầu thiết kế quy trình chuẩn, build data model, định nghĩa role — rồi mới viết code. Anh T không còn ngồi trong các cuộc họp design. Cô phó giám đốc — giờ là COO — dẫn dắt.

Họ chậm hơn đối thủ thứ năm hai năm.

Trong ngành lan ra một câu không biết xuất xứ từ đâu, có lẽ từ chính vendor cũ:

> “Phần mềm không sửa được quy trình sai. Nó chỉ làm cho quy trình sai chạy nhanh hơn.”

Bốn tháng thiết kế quy trình mà họ đang dành ra bây giờ — lẽ ra đã có thể dành ra ba năm trước, với chi phí bằng một phần mười. Lựa chọn giữa “khó ngay từ đầu” và “rất khó về sau” không phải là lựa chọn giữa chuẩn và thực dụng. Nó chỉ là lựa chọn về *thời điểm trả giá*.

-----

Đó là toàn bộ câu chuyện. Không có cao trào kịch tính, không có khoảnh khắc thức tỉnh, không có ai khóc trong phòng họp. Chỉ có hai tỷ rưỡi, sáu tháng, một khách hàng lớn ra đi, và một câu trong báo cáo cuối dự án.

Hầu hết các thất bại số hóa trong ngành logistics Việt Nam diễn ra y hệt như vậy. Chậm, im lặng, có thể tránh được.

-----

**Trong doanh nghiệp của bạn, có quy trình nào đang chạy được nhờ một người biết “khi nào thì sai” — nhưng chưa bao giờ được viết thành rule không?**
