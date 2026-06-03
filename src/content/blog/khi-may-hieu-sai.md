---
title: "Một lần hệ thống hiểu đúng ý tôi — nhưng sai hoàn toàn điều tôi cần."
date: 2026-06-08
tags: ["AI", "Vận hành", "Nghề"]
readTime: "~7 phút đọc"
description: "Phần mềm thích ứng không có nghĩa là phần mềm luôn đúng. Nguy hiểm không nằm ở chỗ máy không hiểu bạn — mà ở chỗ máy hiểu một nửa rồi tự tin đi tiếp."
series: "phan-mem-thich-ung"
seriesOrder: 2
seriesTitle: "Phần mềm thích ứng"
relatedSlugs:
  - "quy-trinh-viet-va-quy-trinh-that"
callToAction: "lo ngại về độ tin cậy khi triển khai AI vào vận hành thực tế"
---

Khách hàng gửi email lúc 11 giờ đêm. Tiêu đề: "Hệ thống làm đúng rồi — mà sao tôi vẫn thấy sợ?"

Tôi đọc xong, ngồi một lúc, không trả lời ngay. Không phải vì không biết nói gì. Mà vì tôi hiểu chính xác cảm giác đó — và biết rằng giải thích nó không đơn giản.

## Điều đã xảy ra

Họ vừa triển khai một hệ thống AI xử lý yêu cầu hỗ trợ từ khách hàng. Hệ thống hoạt động tốt — theo mọi chỉ số đo được. Tỷ lệ phản hồi đúng chủ đề: 94%. Thời gian xử lý giảm 60%. Khách hàng không phàn nàn. Trên giấy tờ, đây là thành công.

Nhưng tuần trước, hệ thống nhận được một yêu cầu từ một khách hàng lớn. Nội dung: họ muốn hủy hợp đồng, nhưng cách họ viết không rõ ràng — vừa hỏi về điều khoản hủy, vừa than phiền về dịch vụ, vừa hỏi về gói mới. Hệ thống phân loại đây là "yêu cầu thông tin" và trả lời bằng bảng giá các gói dịch vụ hiện có.

Kỹ thuật mà nói: phân loại đó không sai. Khách hàng *có* hỏi về gói mới. Nhưng điều khách hàng *cần* là một cuộc gọi từ account manager trong vòng 24 giờ.

Hợp đồng đó bị hủy ba ngày sau.

## Cái máy không thể thấy

Người làm dịch vụ lâu năm đọc email đó sẽ nhận ra ngay: đây là khách hàng đang *lưỡng lự*. Không phải khách hàng đã quyết định. Lưỡng lự là cơ hội — nhưng chỉ khi bạn đọc được tín hiệu đó và phản ứng đúng cách, đúng thời điểm.

Hệ thống AI không đọc được lưỡng lự. Nó đọc được *nội dung*. Và hai thứ đó khác nhau hoàn toàn.

Nội dung là thứ được viết ra. Lưỡng lự là thứ *không được viết ra* — nó nằm ở nhịp điệu câu văn, ở sự mâu thuẫn giữa các câu, ở việc người ta hỏi quá nhiều thứ trong một email duy nhất lúc gần nửa đêm.

> Hiểu đúng ý — và hiểu đúng người — là hai khả năng khác nhau. Phần mềm thích ứng đang nhanh chóng có được cái trước. Cái sau, chúng ta vẫn chưa biết.

## Điều tôi không kỳ vọng bạn nghe

Thông thường đến đây, một bài viết về AI sẽ nói: "Vì vậy hãy thêm human-in-the-loop." Hoặc: "AI chỉ là công cụ, con người vẫn là trung tâm." Những câu đó đúng — và gần như vô nghĩa vì quá chung.

Điều tôi muốn nói khác hơn một chút.

Vấn đề không nằm ở việc hệ thống AI *thiếu* gì. Vấn đề nằm ở chỗ nó *tự tin* như thế nào về phần nó làm được — và điều đó ảnh hưởng đến cách người vận hành đặt niềm tin vào nó.

Một hệ thống không chắc chắn sẽ nói "tôi không chắc, cần người xem lại." Một hệ thống tự tin — kể cả khi tự tin nhầm — sẽ trả lời và đóng ticket. Cái nguy hiểm không phải là sự thiếu hiểu biết. Cái nguy hiểm là sự tự tin không tương xứng với giới hạn thực sự.

## Cái tôi thấy ở những triển khai hoạt động tốt

Không phải ngẫu nhiên mà một số hệ thống AI vận hành tốt trong thực tế còn những cái khác thì không — dù về mặt kỹ thuật chúng gần tương đương nhau.

Những cái hoạt động tốt thường có một đặc điểm chung: chúng được thiết kế với sự *khiêm tốn có chủ đích*. Không phải khiêm tốn giả tạo kiểu "chúng tôi luôn cần con người phê duyệt mọi thứ" — cái đó chỉ là chuyển gánh nặng từ chỗ này sang chỗ khác. Mà là: hệ thống biết rõ ranh giới của mình, và khi tiếp cận ranh giới đó, nó dừng lại theo cách đúng.

Hệ thống trong câu chuyện trên không có ranh giới đó. Nó không được dạy để nhận ra sự lưỡng lự như một tín hiệu đặc biệt cần xử lý khác đi. Và vì vậy, nó làm đúng mọi thứ nó biết làm — trong khi bỏ qua thứ quan trọng nhất.

## Trả lời email lúc 11 giờ đêm

Tôi viết lại cho họ: "Cảm giác đó không phải lo lắng vô cớ. Nó là trực giác của người vận hành — và trực giác đó thường đúng trước cả khi dữ liệu cho thấy vấn đề."

Thứ cần làm không phải là tắt hệ thống hay thêm người kiểm tra tất cả. Thứ cần làm là ngồi lại và xác định: *hệ thống đang tự tin ở những điểm nào mà nó không nên tự tin?* Không phải để phán xét hệ thống. Mà để thiết kế lại ranh giới cho nó.

---

Phần mềm thích ứng là một tiến bộ thật. Nhưng thích ứng không phải là hiểu. Và hiểu không phải là phán xét được. Ba thứ đó là ba bậc thang khác nhau — và chúng ta đang ở đâu đó giữa bậc một và bậc hai.

Trong doanh nghiệp bạn, hệ thống nào đang tự tin ở điểm nó không nên tự tin — và bạn có biết điểm đó ở đâu không?
