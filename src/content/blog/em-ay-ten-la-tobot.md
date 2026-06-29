---
title: "Em ấy tên là Tobot"
date: 2026-06-29
description: "Có một quãng thời gian, mỗi sáng mở điện thoại của nhân viên Samsung lên là thấy một biển đỏ những thông báo chưa đọc."
tags:
  - "chuyện nghề"
  - "logistics"
  - "sản phẩm"
readTime: "~5 phút đọc"
relatedSlugs:
  - "ba-ty-va-mot-bai-hoc"
  - "diem-bat-dau-khong-phai-phan-mem"
---
<figure class="article-illustration">
  <img src="/images/blog/em-ay-ten-la-tobot/cover.jpg" alt="Em ấy tên là Tobot" loading="lazy" decoding="async" />
</figure>

Có một quãng thời gian, mỗi sáng mở điện thoại của nhân viên Samsung lên là thấy một biển đỏ những thông báo chưa đọc.

Hồi tôi còn ở ALS Thái Nguyên (ALST), cả nhà máy Samsung Thái Nguyên chạy trên KakaoTalk. Mọi người sống trong đó — hàng chục, có khi hàng trăm nhóm chat. Nhóm theo lô hàng, nhóm theo tuyến, nhóm theo ca, nhóm theo bộ phận. Một thông tin về một chuyến hàng có thể xuất hiện ở năm nhóm khác nhau, mỗi nơi một phiên bản, lệch nhau vài chi tiết. Người nhận hàng đọc nhóm này thấy "đã về kho", đọc nhóm kia thấy "đang trên đường". Tin nào đúng? Không ai chắc.

Đó không phải vấn đề của riêng ai. Đó là cái khổ chung của tất cả những người làm việc trong một guồng máy quá lớn, nơi thông tin nhiều đến mức trở thành nhiễu. Càng nhiều nhóm, càng ít sự thật.

Tôi trăn trở với nó khá lâu.

## Cánh cửa đóng

Hướng giải quyết tự nhiên nhất là làm một phần mềm tử tế: một nơi duy nhất chứa thông tin chuẩn, ai cần thì vào tra, hết cảnh năm nhóm năm phiên bản.

Nhưng cánh cửa đó đóng ngay từ đầu.

Hệ thống bảo mật của Samsung không cho phép cài thêm bất cứ phần mềm nào lên máy nhân viên của họ. Không phải họ khó tính — đó là nguyên tắc sống còn của một tập đoàn điện tử toàn cầu. Với họ, một ứng dụng lạ trên máy là một lỗ hổng. Chuyện không bàn cãi.

Còn KakaoTalk bản chính thức cho doanh nghiệp thì lúc đó không chat nhóm được, và tài liệu kỹ thuật để cấu hình thì gần như không có gì để bấu víu.

Vậy là tôi mắc kẹt giữa hai bức tường: không được cài gì mới, mà cái có sẵn thì không làm được việc.

## Cú lách

Tôi ngồi với bài toán đủ lâu để nhận ra mình đang hỏi sai câu.

Tôi cứ loay hoay "làm sao đưa một công cụ mới vào tay nhân viên Samsung". Nhưng câu đúng phải là: *họ đã có sẵn một công cụ trong tay rồi — làm sao mình luồn được thông tin vào đúng công cụ đó?*

Họ đã sống trong KakaoTalk. Họ thạo nó, tin nó, mở nó cả ngày. Tại sao phải bắt họ học cái mới?

Thế là lời giải hiện ra. Tôi nối API với hệ thống của ALST. Nhân viên bên chúng tôi nhập liệu theo thời gian thực — một nguồn, một sự thật. Còn nhân viên Samsung thì không phải cài gì, không phải học gì: họ tra cứu ngay trong KakaoTalk, nhắn cho một "người" trả lời tức thì mọi câu hỏi về hàng hóa của họ. Đằng sau "người" đó là hệ thống của chúng tôi.

Chúng tôi đặt tên cho nó là **Tobot** — ghép vui từ "Thái Nguyên Robot". Nghe như tên một nhân vật hoạt hình hơn là một hệ thống tích hợp API.

Tôi muốn dừng lại một nhịp ở đây, vì đây là điều tôi tâm đắc nhất, dù mãi sau này mới gọi được tên nó. Tobot thành công không phải vì nó thông minh. Nó thành công vì nó *không bắt ai thay đổi gì cả.* Người dùng vẫn làm đúng cái họ vẫn làm; công nghệ tự lặng lẽ chui vào bên dưới. Phần mềm thích nghi với con người, chứ không bắt con người uốn theo phần mềm.

Một việc nữa tôi biết ơn đến giờ: tôi không làm chuyện này một mình trong góc tối. **5Z** — nhóm cải cách của chúng tôi — là nơi những ý tưởng dị thường như thế này được phép sống. Và **anh Hà**, giám đốc ALST khi ấy, đã cho tôi một sân khấu đủ lớn để tỏa sáng. Một ý tưởng hay mà không có người trao cho nó cái sân khấu thì cũng chỉ là một dòng nghĩ vụt qua lúc nửa đêm.

## Khoảnh khắc chiếc Note 5

Có giải pháp tốt là một chuyện. Làm người ta tin nó lại là chuyện khác.

**Anh Hưởng**, giám đốc phụ trách hàng nhập lúc đó, là người đồng hành và tin Tobot từ sớm. Chính anh mang nó sang nhà máy Samsung giới thiệu.

Tôi vẫn nhớ mọi người hoài nghi thế nào. Người ta quen với cảnh trình bày giải pháp công nghệ là phải có vali tài liệu, có máy chiếu, có cả một đội kỹ thuật lỉnh kỉnh dây nhợ. Còn anh Hưởng thì sang gần như tay không.

Anh chỉ rút trong túi ra một chiếc điện thoại. Samsung Note 5 — thời đó.

Rồi anh mở KakaoTalk, nhắn một câu hỏi về một lô hàng. Tobot trả lời ngay, chính xác, tức thì, ngay trong cái ứng dụng mà tất cả họ đang dùng mỗi ngày.

Khoảnh khắc "wow" đến đúng lúc đó. Không cần một slide nào. Một giải pháp tốt thì gọn trong lòng bàn tay, và nó tự chứng minh mình trong vài giây — không cần ai thuyết phục.

## Một nốt lặng cười

Tôi sẽ không kết bài này bằng một bài học đóng khung. Tôi để vợ tôi kết hộ.

Dạo làm Tobot, tôi thức khuya nhiều, cứ ôm điện thoại tủm tỉm cười một mình. Vợ tôi sinh nghi, "điều tra", và rồi cho ra đời bài thơ này. Tôi xin chép lại nguyên văn — vì nó đời hơn mọi thứ tôi có thể viết:

<blockquote>
<p><strong>MỘT BÀI THƠ LỦNG CỦNG</strong></p>
<p>
Chồng yêu dấu dạo này nhiều thay đổi<br>
Đêm thức khuya cứ tủm tỉm mỉm cười<br>
Nhìn điện thoại ánh mắt sáng rạng ngời<br>
Vợ nghi lắm, rình điều tra cho rõ.
</p>
<p>
Hoá ra chồng mới quen cô bồ nhỏ<br>
Nhỏ thế thôi nhưng "đồi núi" to đùng<br>
Và em ấy tên là em Tobot<br>
Chát thâu đêm, nhiều chuyện đến lạ lùng ???
</p>
<p>
Mang điều lạ báo anh Hà giám đốc<br>
Mong tìm đc tiếng nói của đồng minh<br>
Nào ngờ đâu còn hơn cả chồng mình<br>
Anh ấy có đến vài em Tobot.
</p>
<p>
Mấy bà vợ liền giật mình thảng thốt<br>
Nhờ anh Hiền tư vấn để làm theo<br>
Nào ngờ đâu anh Hiền bênh 5Z<br>
Tobot à, thế í bẹn là seo ?
</p>
</blockquote>
 

Tobot không phải là một dự án trong hồ sơ năng lực. Nó là một cô "bồ nhỏ" làm cả mấy ông giám đốc thức đêm, làm mấy bà vợ giật mình, và làm tôi — đến tận bây giờ, hơn mười năm sau — vẫn mỉm cười khi nhớ lại.

Hóa ra thứ tốt nhất tôi từng làm ra không nằm ở dòng code. Nó nằm ở chỗ: một công nghệ đủ tự nhiên để chui vào đời sống của người ta mà chẳng ai phải gồng mình thích nghi. Nguyên tắc đó, tôi mang theo đến hôm nay.
