/* Due-diligence pack: dự đoán domain + bộ câu hỏi hỏi lại + kiểm chứng pháp lý.
   Tách khỏi data.js (nội dung học) và mock.js (mô phỏng phỏng vấn):
   file này là thứ bạn mở ra ĐỌC TRONG PHÒNG khi họ trả lời. */
window.ASK = (function () {
  'use strict';

  /* ------------------------------------------------------------
     1. DỰ ĐOÁN DOMAIN
     Xác suất là ước lượng từ bằng chứng công khai, không phải số liệu nội bộ.
     ------------------------------------------------------------ */
  var evidence = [
    ['Pháp nhân', 'Công ty CP Giải pháp Công nghệ và Phần mềm Phổ Tuệ · MST 0318222903 · ĐKKD 128 Bình Mỹ, TP.HCM · văn phòng Landmark 81.'],
    ['Mô hình', 'Công ty mẹ nắm nhiều thương hiệu: HiTechCloud, HiTech POS, HiTech Pay, vKai.VN. Tự mô tả: "invests in, develops and manages specialist technology brands".'],
    ['Quy mô', '85.000+ khách hàng · 30+ sản phẩm trong hệ sinh thái · 162 vị trí đang tuyển cùng lúc.'],
    ['Hạ tầng tự vận hành', 'Data Center Tier III tại Việt Nam · VMware/OpenStack/CloudStack/KVM · Ceph · ASN/IP và BGP riêng · cáp biển AAE-1, APG, AAG, ADC, SJC2.'],
    ['Đối tác', 'Đại lý uỷ quyền của Microsoft, NVIDIA, AWS, Google Cloud, GreenNode, VMware, Sectigo, cPanel, DirectAdmin.'],
    ['Vận hành', 'SOC 24/7 · Managed Services 24/7/365 · vMonitor, vAPM · "Observability & IaC, Terraform & CI/CD".'],
    ['Văn phòng nước ngoài', 'Tokyo, Osaka, Seoul, Singapore, Dubai, California · site có bản JA, KO, ZH.'],
    ['Sản phẩm tự xây', '"Cloud Portal tự động hoá 100% quy trình cấp phát tài nguyên" · white-label cho đối tác · vCloudstack · AgentBase · vKS/vMKS.']
  ];

  var hypotheses = [
    {
      pct: 50,
      name: 'Nền tảng & portal của chính HiTechCloud',
      short: 'Cổng khách hàng, cấp phát tài nguyên, billing, dashboard, white-label',
      why: [
        'Họ tự viết "Cloud Portal tự động hoá 100% quy trình cấp phát tài nguyên" — đó là một sản phẩm web fullstack liên tục phải sửa.',
        '30+ sản phẩm, mỗi sản phẩm cần portal, API, bảng giá, quản lý tài khoản, thông báo, thống kê.',
        'JD ghi "ứng dụng web triển khai trên AWS" — họ là đại lý uỷ quyền AWS, bán và dựng giải pháp trên AWS cho khách.',
        'VueJS cho frontend portal, Python cho API cấp phát/billing, DynamoDB + S3 cho dữ liệu phiên và tài liệu, Lambda cho tác vụ theo sự kiện — khớp chính xác bộ tag JD.',
        'Tuyển 6 người cùng lúc cho một title = dựng một nhóm cho một dòng sản phẩm, không phải thay một người nghỉ việc.'
      ],
      falsify: 'họ nói vị trí thuộc Managed Services hoặc gắn với một khách hàng cụ thể.'
    },
    {
      pct: 25,
      name: 'Managed Services & công cụ vận hành (SOC)',
      short: 'Giám sát, cảnh báo, ticket, tự động hoá xử lý sự cố',
      why: [
        'JD ghi nguyên một dòng: "Theo dõi nhật ký, chỉ số và chi phí của phần hệ thống mình phụ trách" — đó là mô tả công việc ops, không phải feature work.',
        'JD ghi trực hệ thống theo ca, có phụ cấp ca và ngày nghỉ bù. Đây là ràng buộc cấu trúc, không phải "thỉnh thoảng".',
        'Họ bán Managed Services 24/7/365 và có SOC 24/7 — nghĩa là có đội trực thật, và có công cụ nội bộ để đội đó dùng.',
        'vMonitor, vAPM là sản phẩm giám sát của chính họ — cần người làm dashboard, alert rule, báo cáo.'
      ],
      falsify: 'họ nói ca trực do bộ phận khác lo và vị trí này không on-call.'
    },
    {
      pct: 15,
      name: 'Dự án giao cho khách (Nhật / Hàn / Singapore)',
      short: 'Làm theo hợp đồng cho khách nước ngoài, có thể onsite',
      why: [
        'Có văn phòng Tokyo, Osaka, Seoul, Singapore, Dubai; site có bản tiếng Nhật/Hàn/Trung.',
        'Có nguyên nhóm dịch vụ "phát triển phần mềm, web app, ứng dụng di động, game" — tức là họ nhận cả gia công.',
        'JD nhắc onsite/luân chuyển sang Nhật, Hàn, Úc, Mỹ — dấu hiệu có khách nước ngoài thật.'
      ],
      falsify: 'JD KHÔNG yêu cầu tiếng Nhật hay tiếng Hàn. Nếu làm cho khách Nhật, họ gần như luôn ghi "tiếng Nhật là lợi thế". Vì không ghi, xác suất thấp hơn vẻ ngoài.'
    },
    {
      pct: 10,
      name: 'Một thương hiệu khác: POS / Pay / vKai',
      short: 'Bán lẻ, thanh toán, thị giác máy tính',
      why: [
        'HiTech POS tuyển Trưởng bộ phận Logistics; HiTech Pay tuyển Backend hệ thống thanh toán 30–65tr; vKai tuyển Computer Vision 30–70tr.',
        'Các thương hiệu này tuyển bằng JD riêng, nên JD này nhiều khả năng không phải cho họ.',
        'Nhưng "6 người" có thể chia sang nhiều thương hiệu nếu tuyển theo nhóm năng lực.'
      ],
      falsify: 'họ nói rõ vị trí thuộc một trong các thương hiệu này. Nếu vậy, hãy hỏi lại bằng JD tương ứng của thương hiệu đó.'
    }
  ];

  var decision = [
    ['Họ nêu tên một sản phẩm cụ thể và người dùng của nó', 'Nền tảng/portal', 'Đây là câu trả lời tốt nhất. Ghi lại tên sản phẩm, về tra xem có thật.'],
    ['Họ nói "dự án cho khách Nhật", "khách Hàn"', 'Giao cho khách', 'Hỏi tiếp: hợp đồng còn bao lâu, bạn có phải onsite không.'],
    ['Họ nói "bên anh tuyển chung, vào sẽ phân"', 'Nhóm năng lực', 'Không phải cờ đỏ, nhưng phải đòi ghi nhóm dự kiến vào offer.'],
    ['Họ nói ca trực do bộ phận khác lo', 'Bớt giả thuyết SOC', 'Hỏi tiếp: vậy vị trí này có on-call ngoài giờ không.'],
    ['Họ không nêu được sản phẩm nào, không nêu được nhóm', 'Cảnh báo', 'Có thể họ cũng chưa biết. Yêu cầu gặp người quản lý trực tiếp trước khi nhận offer.']
  ];

  /* ------------------------------------------------------------
     2. BỘ CÂU HỎI
     ------------------------------------------------------------ */
  var groups = [
    {
      id: 'g1',
      name: 'Việc thật sự làm gì',
      note: 'Nhóm này để phá đúng chỗ JD mơ hồ: không có domain. Hỏi cho tới khi có tên sản phẩm.',
      items: [
        { q: 'Vị trí này thuộc thương hiệu nào — HiTechCloud, HiTech POS, HiTech Pay, vKai, hay khối dùng chung?',
          why: 'Xác định bạn thuộc pháp nhân/thương hiệu nào. Ảnh hưởng tới hợp đồng, quản lý và lộ trình.',
          good: 'Nêu tên thương hiệu + tên người quản lý trực tiếp.',
          bad: '"Bên anh tuyển chung cho cả tập đoàn" mà không nêu ví dụ cụ thể nào.' },
        { q: 'Sản phẩm tôi làm là sản phẩm nội bộ của công ty, hay dự án giao cho khách?',
          why: 'Hai môi trường khác hẳn nhau: sản phẩm nội bộ thì bạn sở hữu lâu dài; dự án khách thì hết hợp đồng là hết việc, và có thể phải onsite.',
          good: 'Trả lời dứt khoát một trong hai, kèm ví dụ sản phẩm đang chạy.',
          bad: '"Cả hai, tuỳ dự án" mà không nêu tỉ lệ.' },
        { q: 'Tháng đầu tiên tôi sẽ làm gì cụ thể? Có ticket hay backlog nào đang chờ không?',
          why: 'Buộc họ nói việc thật. Câu trả lời mơ hồ ở đây là tín hiệu mạnh nhất cho thấy vị trí chưa được định nghĩa.',
          good: 'Nêu được một hạng mục cụ thể: "mở API cho cổng khách hàng", "chuyển phần billing sang Lambda".',
          bad: '"Vào rồi sẽ biết", "làm quen hệ thống trước đã".' },
        { q: 'Sáu người được tuyển chia cho mấy nhóm, mỗi nhóm mấy người, có team lead chưa?',
          why: 'Cho biết đây là dựng một đội cho một sản phẩm, hay rải ra nhiều nơi. Cũng cho biết bạn có người review code hay không.',
          good: 'Nêu số nhóm và tên/vai trò lead từng nhóm.',
          bad: '"Chưa chia", "tuyển xong mới tính" — nghĩa là bạn có thể vào một nhóm chưa có ai dẫn.' },
        { q: 'Người quyết định kỹ thuật của nhóm là ai — có tech lead hay kiến trúc sư chưa?',
          why: 'Không có lead nghĩa là bạn phải tự quyết kiến trúc trong 3 tháng đầu. Với 2 năm kinh nghiệm, đó là rủi ro thật.',
          good: 'Có người cụ thể, có thể gặp trong buổi phỏng vấn này.',
          bad: '"Bạn sẽ là người quyết" — nói thẳng ra thì tốt, nhưng bạn phải biết mình nhận gì.' },
        { q: 'Có ai đang làm vị trí này chưa, hay tôi là người đầu tiên?',
          why: 'Người đầu tiên = cơ hội và rủi ro đều cao. Người thứ hai = có người dọn đường.',
          good: 'Trả lời rõ, có số người hiện tại trong nhóm.',
          bad: 'Né câu hỏi.' },
        { q: 'Hệ thống hiện chạy chủ yếu trên AWS dịch vụ nào, và có dùng CloudFormation hay CDK?',
          why: 'JD tag có CloudFormation. Nếu thực tế họ bấm console, JD đang mô tả một thứ chưa tồn tại.',
          good: 'Nêu tên dịch vụ và công cụ IaC đang dùng.',
          bad: '"Đang chuyển dần", "còn nhiều thứ làm tay" — không sai, nhưng biết để lượng sức.' },
        { q: 'Tỉ lệ công việc giữa làm tính năng mới, bảo trì, và xử lý sự cố là bao nhiêu?',
          why: 'Vị trí fullstack ở công ty hạ tầng rất dễ trôi thành 80% trực sự cố.',
          good: 'Nêu tỉ lệ ước lượng và ai chịu phần sự cố.',
          bad: '"Chủ yếu làm feature" mà mô tả công việc lại có trực ca — hai điều này mâu thuẫn.' }
      ]
    },
    {
      id: 'g2',
      name: 'Vòng bài kiểm tra chuyên môn',
      note: 'Vòng này đến TRƯỚC vòng phỏng vấn. Hỏi trước để không bị động về thời gian và công sức.',
      items: [
        { q: 'Bài kiểm tra là làm tại nhà hay làm trực tiếp, thời lượng bao lâu?',
          why: 'Quyết định bạn cần dành bao nhiêu thời gian. Bài 5 ngày trong khi bạn còn đang đi làm là chi phí thật.',
          good: 'Nêu rõ dạng và thời lượng ngay.',
          bad: '"Cứ làm xong gửi" không có hạn — dấu hiệu quy trình chưa chuẩn.' },
        { q: 'Bài test chấm theo tiêu chí nào? Có được dùng Internet và công cụ AI không?',
          why: 'Nếu không cho dùng AI nhưng chấm theo tốc độ, tiêu chí không nhất quán. Nếu cho dùng, bạn nên dùng.',
          good: 'Nêu tiêu chí: chạy được, có test, có IaC, README.',
          bad: 'Không biết tiêu chí chấm.' },
        { q: 'Bài test có bắt buộc deploy thật lên AWS không, hay chỉ cần chạy local?',
          why: 'Nếu bắt deploy mà họ không cấp tài khoản sandbox, bạn sẽ phải tự trả tiền. Họ có ghi "tài khoản hạ tầng đám mây nội bộ để tự học" — hỏi xem có dùng được cho bài test không.',
          good: 'Có tài khoản sandbox hoặc chỉ yêu cầu chạy local.',
          bad: '"Em tự dựng đi, tiền không đáng bao nhiêu".' },
        { q: 'Sau bài test bao lâu có kết quả, và có phản hồi dù trượt không?',
          why: 'Không có cam kết phản hồi là dấu hiệu bạn sẽ bị treo. JD ghi sàng lọc trong 5 ngày làm việc — đối chiếu với câu trả lời này.',
          good: 'Nêu mốc thời gian cụ thể.',
          bad: '"Khi nào có kết quả bên anh báo".' },
        { q: 'Nếu bài test trượt, có giữ liên lạc cho vị trí khác không?',
          why: 'Họ tuyển 162 vị trí. Một bài test dùng được cho nhiều vị trí là dấu hiệu quy trình trưởng thành.',
          good: 'Có, nêu ví dụ.',
          bad: 'Không quan tâm.' }
      ]
    },
    {
      id: 'g3',
      name: 'Vận hành, trực ca, sự cố',
      note: 'JD ghi rõ có trực ca và có phụ cấp. Đây là điều kiện làm việc, không phải chi tiết nhỏ.',
      items: [
        { q: 'Ca trực xoay thế nào — mấy người một ca, bao nhiêu tuần đổi một lần, có ca đêm không?',
          why: 'Ảnh hưởng trực tiếp tới sức khoẻ và đời sống. Phải biết trước khi ký.',
          good: 'Nêu lịch cụ thể: số người, chu kỳ xoay, khung giờ ca đêm.',
          bad: '"Thỉnh thoảng thôi" — trong khi JD ghi hẳn "phải trực hệ thống theo ca".' },
        { q: 'Đã có runbook cho các sự cố thường gặp chưa, hay mỗi lần xử lý từ đầu?',
          why: 'Có runbook nghĩa là vận hành trưởng thành. Không có nghĩa là 3h sáng bạn tự mò.',
          good: 'Có, và có thể mô tả một runbook.',
          bad: '"Tuỳ anh em xử lý" — bạn sẽ là người viết runbook đầu tiên.' },
        { q: 'SLA với khách là bao lâu, và ai chịu trách nhiệm khi trễ?',
          why: 'SLA quyết định áp lực thật của ca trực. Không biết SLA nghĩa là bạn không biết mình đang hứa gì.',
          good: 'Nêu con số: ví dụ phản hồi 15 phút, khắc phục 4 giờ.',
          bad: 'Không biết hoặc né.' },
        { q: 'Sự cố 3 giờ sáng thì escalation lên ai, và ai được quyền gọi dậy?',
          why: 'Câu này cho biết họ có quy trình thật hay chỉ có khẩu hiệu 24/7.',
          good: 'Có danh sách escalation và người trực cấp 2.',
          bad: '"Gọi quản lý" nhưng không có ai cụ thể.' },
        { q: 'Phụ cấp ca tính theo ca hay theo tháng? Ngày nghỉ bù cho ca đêm tính thế nào?',
          why: 'JD ghi có phụ cấp ca và ngày nghỉ bù. Phải có con số trong offer, không chỉ trong lời nói.',
          good: 'Nêu mức cụ thể và cách tính.',
          bad: '"Có chính sách" mà không nêu số.' },
        { q: 'Trực ca có tính là giờ làm thêm không, và được trả thế nào?',
          why: 'Đây là điểm dễ phát sinh tranh chấp nhất. Hỏi rõ trước, đừng hỏi sau khi đã nhận việc.',
          good: 'Trả lời rõ cơ chế: tính vào lương, hoặc nghỉ bù, hoặc phụ cấp riêng.',
          bad: 'Lảng tránh hoặc nói "anh em tự sắp xếp".' }
      ]
    },
    {
      id: 'g4',
      name: 'Tiền và hợp đồng',
      note: 'Chỗ dễ hiểu sai nhất: JD ghi lương là thu nhập THỰC NHẬN và công ty chịu BHXH/thuế. Phải hỏi cho rõ mức đóng.',
      items: [
        { q: 'Khoảng 25–50 triệu là net hay gross, và mức cụ thể của tôi là bao nhiêu?',
          why: 'JD ghi "thu nhập thực nhận". Nhưng khoảng rộng 25–50 là gấp đôi — bạn cần con số của mình, bằng văn bản.',
          good: 'Nêu một con số cụ thể trong offer.',
          bad: '"Trong khoảng đó, tuỳ năng lực" kéo dài tới lúc ký.' },
        { q: 'Lương đóng BHXH được tính trên mức nào?',
          why: 'Câu quan trọng nhất trong nhóm này. Nếu công ty chịu BHXH nhưng đóng trên mức tối thiểu vùng thay vì lương thật, bạn mất quyền lợi dài hạn: lương hưu, ốm đau, thai sản, trợ cấp thất nghiệp.',
          good: 'Nêu mức đóng cụ thể, bằng số.',
          bad: '"Đóng đầy đủ theo luật" mà không nêu mức — cụm này che rất nhiều khác biệt.' },
        { q: 'Thưởng quý và tháng 13 có ghi trong hợp đồng hay chỉ là chính sách công ty?',
          why: 'Chính sách có thể đổi; hợp đồng thì không. Thưởng tháng 13 không bắt buộc theo luật, nên chỉ có giá trị nếu ghi.',
          good: 'Ghi trong hợp đồng hoặc có quy chế bằng văn bản.',
          bad: '"Công ty năm nào cũng thưởng" — không có gì ràng buộc.' },
        { q: 'Thử việc 2 tháng hưởng 100% — có ghi trong hợp đồng thử việc không?',
          why: 'Theo Bộ luật Lao động 2019, thử việc tối đa 60 ngày với công việc cần trình độ cao đẳng trở lên, lương thử việc tối thiểu 85%. Con số 100% trong 60 ngày là hợp pháp và tốt hơn mức sàn — nhưng vẫn phải ghi.',
          good: 'Có hợp đồng thử việc riêng, ghi rõ 100%.',
          bad: 'Thử việc không hợp đồng, hoặc trả thấp hơn cam kết.' },
        { q: 'Xét điều chỉnh lương 2 lần/năm dựa trên tiêu chí gì?',
          why: 'Không có tiêu chí nghĩa là không có cam kết. Hỏi để biết kỳ vọng.',
          good: 'Nêu tiêu chí và mức tăng trung bình.',
          bad: '"Tuỳ đánh giá" mà không nói ai đánh giá, theo thang nào.' },
        { q: 'Công ty chi trả chứng chỉ AWS — trả trước hay hoàn lại sau, có ràng buộc thời gian làm việc không?',
          why: 'Đây là chỗ phát sinh "cam kết" (bond). Nhiều công ty trả tiền thi rồi buộc bạn làm 1–2 năm, hoặc hoàn lại nếu nghỉ sớm.',
          good: 'Trả trước, không ràng buộc — hoặc có ràng buộc nhưng ghi rõ trong hợp đồng.',
          bad: 'Chỉ nói miệng, sau đó đưa bản cam kết riêng để ký.' }
      ]
    },
    {
      id: 'g5',
      name: 'Kiểm chứng pháp lý — chống bị lừa',
      note: 'Không phải vì hồ sơ có dấu hiệu xấu. Đây là bước bắt buộc với mọi offer, và họ sẽ thấy bạn chuyên nghiệp.',
      items: [
        { q: 'Hợp đồng lao động ký với pháp nhân nào, mã số thuế bao nhiêu?',
          why: 'Phải là Công ty CP Giải pháp Công nghệ và Phần mềm Phổ Tuệ (MST 0318222903). Nếu tên trên hợp đồng là một công ty khác không liên quan, dừng lại và hỏi vì sao.',
          good: 'Đúng pháp nhân, có MST, khớp với tra cứu công khai.',
          bad: 'Tên công ty khác lạ, hoặc "ký với bên dịch vụ nhân sự".' },
        { q: 'Địa điểm làm việc ghi trong hợp đồng là địa chỉ nào?',
          why: 'ĐKKD tại 128 Bình Mỹ; văn phòng làm việc tại Landmark 81. Cần biết bạn làm ở đâu, và điều khoản chuyển địa điểm thế nào.',
          good: 'Địa chỉ cụ thể, khớp với nơi bạn tới phỏng vấn.',
          bad: 'Địa chỉ không tồn tại, hoặc phỏng vấn ở quán cà phê rồi mời ký.' },
        { q: 'Có khoản nào tôi phải trả trước không — đào tạo, thiết bị, đặt cọc, đồng phục?',
          why: 'Nguyên tắc cứng: người lao động không phải trả tiền để được nhận việc. Bất kỳ khoản thu nào cũng là cờ đỏ.',
          good: 'Không có khoản nào.',
          bad: 'Bất kỳ con số nào, dù nhỏ, dù gọi là "phí tài liệu".' },
        { q: 'Có yêu cầu nộp giữ bằng gốc hay giấy tờ tuỳ thân gốc không?',
          why: 'Giữ bản gốc bằng cấp/CCCD là thực hành trái luật và là dấu hiệu kiểm soát. Chỉ cần bản sao có công chứng.',
          good: 'Chỉ cần bản sao.',
          bad: 'Đòi giữ bản gốc "để đảm bảo".' },
        { q: 'Tôi có thể gặp người quản lý trực tiếp trước khi nhận offer không?',
          why: 'Câu này lọc được rất nhiều. Công ty thật luôn sắp xếp được; nơi mập mờ thì né.',
          good: 'Có, sắp xếp được trong tuần.',
          bad: '"Không cần, vào rồi gặp".' }
      ]
    }
  ];

  var redflags = [
    ['Có khoản thu tiền', 'Bất kỳ lý do gì', 'Dừng. Không có ngoại lệ.'],
    ['Đòi giữ bằng gốc / CCCD gốc', 'Để đảm bảo cam kết', 'Từ chối. Chỉ bản sao công chứng.'],
    ['Không nêu được tên sản phẩm nào', 'Vào rồi sẽ biết', 'Yêu cầu gặp quản lý trực tiếp trước.'],
    ['Offer không ghi mức lương cụ thể', 'Thoả thuận sau', 'Không ký.'],
    ['Không nêu mức đóng BHXH', 'Đóng đầy đủ theo luật', 'Hỏi bằng văn bản. Ảnh hưởng lương hưu.'],
    ['Phỏng vấn ở nơi không phải văn phòng', 'Quán cà phê, nhà riêng', 'Đề nghị tới văn phòng.'],
    ['Giục ký ngay trong buổi', 'Cần người gấp', 'Xin 1–2 ngày đọc. Công ty thật không ép.'],
    ['Cam kết làm 1–2 năm vì chứng chỉ', 'Chỉ đưa giấy cam kết sau khi nhận', 'Đòi xem trước khi ký hợp đồng chính.']
  ];

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render() {
    var host = document.getElementById('askHyp');
    if (!host) return;

    host.innerHTML = hypotheses.map(function (h) {
      return '<div class="dom-card">' +
        '<div class="dom-head"><b>' + esc(h.name) + '</b>' +
        '<span class="dom-p">' + h.pct + '%</span></div>' +
        '<div class="dom-barwrap"><div class="dom-bar" style="width:' + h.pct + '%"></div></div>' +
        '<p class="dom-short">' + esc(h.short) + '</p>' +
        '<div class="dom-lab">Vì sao</div><ul>' +
        h.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' +
        '<div class="dom-falsify"><b>Cái gì sẽ bác bỏ giả thuyết này:</b> ' + esc(h.falsify) + '</div>' +
        '</div>';
    }).join('');

    var ev = document.getElementById('askEvidence');
    if (ev) ev.innerHTML = evidence.map(function (e) {
      return '<div class="evrow"><b>' + esc(e[0]) + '</b><p>' + esc(e[1]) + '</p></div>';
    }).join('');

    var dec = document.getElementById('askDecision');
    if (dec) dec.innerHTML = decision.map(function (d) {
      return '<tr><td class="dl">' + esc(d[0]) + '</td>' +
        '<td><span class="pill ' + (d[1] === 'Cảnh báo' ? 'weak' : 'good') + '">' + esc(d[1]) + '</span></td>' +
        '<td class="da">' + esc(d[2]) + '</td></tr>';
    }).join('');

    var g = document.getElementById('askGroups');
    if (!g) return;
    g.innerHTML = groups.map(function (grp, gi) {
      return '<div class="ask-group">' +
        '<div class="ask-ghead"><span class="ask-gn">' + (gi + 1 < 10 ? '0' : '') + (gi + 1) + '</span>' +
        '<div><b>' + esc(grp.name) + '</b><p>' + esc(grp.note) + '</p></div></div>' +
        grp.items.map(function (it, ii) {
          return '<div class="ask-item">' +
            '<div class="ask-q"><span class="ask-n">' + (gi + 1) + '.' + (ii + 1) + '</span>' + esc(it.q) + '</div>' +
            '<div class="ask-why">' + esc(it.why) + '</div>' +
            '<div class="ask-ab"><div class="ask-good"><b>Trả lời tốt</b><p>' + esc(it.good) + '</p></div>' +
            '<div class="ask-bad"><b>Cảnh báo</b><p>' + esc(it.bad) + '</p></div></div>' +
            '</div>';
        }).join('') +
        '</div>';
    }).join('');

    var total = groups.reduce(function (a, x) { return a + x.items.length; }, 0);
    var cnt = document.getElementById('askCount');
    if (cnt) cnt.textContent = total + ' câu, chia ' + groups.length + ' nhóm';

    var rf = document.getElementById('askRed');
    if (rf) rf.innerHTML = redflags.map(function (r) {
      return '<tr><td class="dl">' + esc(r[0]) + '</td><td class="da">' + esc(r[1]) + '</td>' +
        '<td class="dr">' + esc(r[2]) + '</td></tr>';
    }).join('');
  }

  return { render: render, groups: groups };
})();
