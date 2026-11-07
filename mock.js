/* Mock interview + JD coverage ledger.
   Tách khỏi data.js vì mỗi câu ở đây bắt buộc có `why` = dòng JD sinh ra nó.
   Ngân hàng câu hỏi (data.js) trả lời "biết gì"; file này trả lời "họ sẽ hỏi gì và chấm ra sao". */
window.MOCK = (function () {
  'use strict';

  /* ============================================================
     VÒNG 3 — BÀI KIỂM TRA CHUYÊN MÔN (viết)
     JD verbatim: "Bạn được mời làm bài kiểm tra chuyên môn để đội ngũ
     hiểu rõ hơn cách bạn làm việc."
     Chú ý chữ "cách bạn làm việc" — họ chấm quy trình, không chỉ kết quả.
     ============================================================ */
  var written = {
    note: 'Đây là vòng dễ hụt nhất vì nó không phải hỏi đáp — bạn phải tự dựng một thứ chạy được. Nhưng nó cũng là vòng dễ đoán nhất: chỉ có ba dạng, và cả ba đều xoay quanh đúng 5 dịch vụ ghi trong tag JD.',
    forms: [
      {
        p: 'Cao nhất',
        name: 'Dạng A — Bài tập về nhà 3–5 ngày',
        brief: 'Một spec nhỏ: "Viết service nhận file upload, lưu S3, ghi metadata, có endpoint tra cứu, deploy được, có test." Nộp kèm README.',
        they: [
          'Repo có chạy được từ README trên máy sạch không (họ clone và chạy thật)',
          'Có IaC không, hay toàn bấm console rồi chụp ảnh màn hình',
          'Test có thật không, hay chỉ test hàm cộng hai số',
          'README có nói rõ giả định và chỗ chưa làm không',
          'Commit history có bị dồn thành một commit "final" không'
        ],
        risk: 'Điểm liệt thường là README thiếu biến môi trường. Họ clone, chạy, lỗi → loại.'
      },
      {
        p: 'Trung bình',
        name: 'Dạng B — Live coding 60–90 phút',
        brief: 'Một bài nhỏ có người ngồi cùng: viết endpoint FastAPI + một truy vấn DynamoDB/RDS + một component Vue đọc dữ liệu đó. Có thể cho phép tra Google.',
        they: [
          'Bạn nói ra suy nghĩ trong lúc làm, không im lặng gõ',
          'Bạn hỏi lại yêu cầu trước khi code (dấu hiệu rất tốt)',
          'Bạn chạy thử trước khi nói "xong"',
          'Bạn xử lý lỗi nhập liệu, không chỉ happy path'
        ],
        risk: 'Đừng tối ưu hóa sớm. Họ chấm khả năng đi từ chạy được → đúng → mới đẹp.'
      },
      {
        p: 'Thấp hơn',
        name: 'Dạng C — Trắc nghiệm + sửa code có sẵn',
        brief: 'Đưa một đoạn code có 3–5 lỗi (thiếu validation, N+1 query, secret hardcode, thiếu error handling) và hỏi bạn sửa gì, vì sao.',
        they: [
          'Bạn có thấy lỗi bảo mật không (secret trong code, log lộ dữ liệu)',
          'Bạn có thấy vấn đề hiệu năng không (N+1, Scan thay vì Query)',
          'Bạn giải thích được vì sao, không chỉ nói "sửa chỗ này"'
        ],
        risk: 'Đừng sửa hết rồi im. Nêu thứ tự ưu tiên: bảo mật → đúng → hiệu năng → đẹp.'
      }
    ],
    /* Bất biến chung: dù dạng nào, 6 thứ này luôn được chấm */
    rubric: [
      ['Chạy được từ đầu', 'Người khác clone repo và làm theo README là chạy. Không có bước "hỏi tác giả".'],
      ['Có test thật', 'Ít nhất một test chạm DB/HTTP, không chỉ unit test hàm thuần. Họ ghi rõ trong JD: "Viết kiểm thử".'],
      ['Có IaC hoặc lệnh triển khai lặp lại được', 'Dù chỉ một file CloudFormation/SAM/script. "Tôi bấm console" là điểm trừ nặng với vị trí có tag CloudFormation.'],
      ['Không có secret trong repo', '.env.example có, .env không. Nếu lỡ commit thì phải nói ra và rotate.'],
      ['README nói được giới hạn', 'Mục "chưa làm / đã cắt" là dấu hiệu kỹ sư trưởng thành. Người viết "xong hết" thường là chưa hiểu bài.'],
      ['Chi phí được nghĩ tới', 'JD ghi "theo dõi chi phí". Nêu 1 câu về chi phí chạy bài này (Lambda free tier, DynamoDB on-demand) là điểm cộng miễn phí.']
    ],
    /* Kế hoạch 4 giờ nếu nhận đề lúc tối */
    plan: [
      ['0:00–0:20', 'Đọc đề, viết ra 3 giả định, gửi mail hỏi lại nếu mơ hồ. Bắt đầu bằng việc này — hỏi sớm được tính là chuyên nghiệp, hỏi muộn là lúng túng.'],
      ['0:20–1:40', 'Dựng khung chạy được end-to-end với dữ liệu giả: endpoint trả hardcode. Mục tiêu là có thứ bấm được, chưa cần DB.'],
      ['1:40–3:00', 'Thay dữ liệu giả bằng thật (S3/DynamoDB), thêm validation và error handling.'],
      ['3:00–3:40', 'Viết 3–5 test: happy path, thiếu field, không có quyền.'],
      ['3:40–4:00', 'README + danh sách "chưa làm". Dừng. Đừng thêm tính năng.']
    ]
  };

  /* ============================================================
     VÒNG 4 — PHỎNG VẤN
     JD verbatim: "Bạn được mời trao đổi trực tiếp với đội ngũ tuyển dụng
     và quản lý bộ phận."
     → hai người, hai kiểu chấm: recruiter chấm ổn định/khớp văn hóa,
       quản lý chấm độ sâu kỹ thuật và khả năng tự chịu trách nhiệm.
     ============================================================ */
  var phases = [
    ['A', 'Mở đầu', '5–8 phút', 'Ấn tượng đầu. Đừng kể lể.'],
    ['B', 'AWS thực chiến', '25–30 phút', 'Phần nặng nhất. Hỏi theo đúng 5 dịch vụ trong tag JD.'],
    ['C', 'Container & phát hành', '10 phút', 'JD: "Docker và quy trình phát hành tự động".'],
    ['D', 'Python & Vue', '15 phút', 'Ngôn ngữ chính và framework chính.'],
    ['E', 'Tình huống & trực ca', '10 phút', 'JD có ghi trực hệ thống theo ca — sẽ hỏi thật.'],
    ['F', 'Bạn hỏi ngược', '5 phút', 'Cũng được chấm điểm.']
  ];

  var qs = [
    /* ---------- A ---------- */
    {
      id: 'm01', ph: 'A', secs: 90,
      q: 'Giới thiệu bản thân trong 1–2 phút.',
      why: 'Mọi buổi đều mở bằng câu này. Không có ngoại lệ.',
      must: [
        'Nêu nghề + số năm + chỗ mạnh nhất, trong 3 câu đầu',
        'Một bằng chứng có số hoặc quyết định kỹ thuật cụ thể',
        'Một câu nối với họ (thứ chỉ đọc site/JD của họ mới biết)',
        'Kết bằng câu mời hỏi tiếp'
      ],
      red: ['Kể lần lượt 7 dự án', 'Nói "em học nhanh"', 'Đọc như bài văn thuộc lòng'],
      follow: ['Em mạnh nhất ở đâu, nói cụ thể hơn?', 'Vì sao rời chỗ cũ?'],
      model: 'Dùng nguyên bản 45 giây ở mục 08: "Em là Đạt, làm fullstack hai năm, mạnh nhất Python/FastAPI phía backend và TypeScript phía frontend. Gần nhất em xây hệ RAG tư vấn tuyển sinh — phần em tự hào nhất không phải mô hình mà là vòng đo: log chi phí theo từng route và dựng eval để biết thay đổi nào thật sự làm câu trả lời tốt lên. Trước đó em làm luồng thanh toán fintech ở Thái Lan và HRM cho khách Nhật trên AWS với S3, EC2, Lambda."'
    },
    {
      id: 'm02', ph: 'A', secs: 120,
      q: 'Vì sao bạn chọn vị trí này, và bạn biết gì về công ty?',
      why: 'Recruiter hỏi để lọc người nộp hàng loạt. Trả lời chung chung là điểm trừ nhẹ nhưng chắc chắn.',
      must: [
        'Nêu một chi tiết cụ thể về công ty: khách Nhật, onsite Tokyo/Osaka/Fukuoka/Seoul/Sydney, hoặc tự trả tiền chứng chỉ',
        'Nối chi tiết đó với điều bạn muốn: "em muốn làm hạ tầng cloud trực tiếp, không chỉ dùng API của nó"',
        'Nói rõ bạn chấp nhận được trực ca (vì JD ghi, họ sẽ để ý phản ứng của bạn)'
      ],
      red: ['"Em thấy công ty lớn"', 'Không biết công ty làm gì', 'Né câu trực ca'],
      follow: ['Bạn thấy điểm nào ở công ty là khó khăn nhất với bạn?'],
      model: 'Công ty có khách Nhật và có onsite Nhật/Hàn/Úc — nghĩa là code phải viết cho người khác đọc và bàn giao được, không chỉ chạy ở máy em. Em muốn làm ở môi trường mà hạ tầng là việc của mình: JD ghi rõ theo dõi log, chỉ số và chi phí phần mình phụ trách, đó đúng là phần em thích. Trực ca em chấp nhận được.'
    },

    /* ---------- B: AWS ---------- */
    {
      id: 'm03', ph: 'B', secs: 300,
      q: 'Thiết kế end-to-end: người dùng upload một file, hệ thống xử lý bất đồng bộ, trả kết quả. Bạn dùng dịch vụ nào và vì sao?',
      why: 'JD dòng 1: "Phát triển tính năng đầu cuối cho các ứng dụng web triển khai trên AWS." Đây là câu hỏi bao trùm cả buổi — trả lời tốt thì 20 phút sau là hỏi sâu vào phần bạn vừa vẽ.',
      must: [
        'Vẽ được luồng: client → presigned URL → S3 → event notification → Lambda/SQS → xử lý → DynamoDB (trạng thái) → client poll hoặc WebSocket',
        'Nêu vì sao KHÔNG đẩy file qua API Gateway (giới hạn payload ~10MB, tốn tiền, chặn request lâu)',
        'Dùng S3 event hoặc SQS làm điểm nối — nói rõ vì sao chọn hàng đợi (retry, DLQ, tách tải)',
        'Lưu trạng thái job ở DynamoDB với job_id, status, updated_at',
        'Idempotency: nếu event đến hai lần thì xử lý thế nào'
      ],
      red: [
        'Đẩy toàn bộ file qua Lambda (giới hạn 6MB payload)',
        'Đồng bộ hóa toàn bộ luồng và nói "xử lý mất 2 phút" — Lambda timeout 15 phút nhưng API Gateway timeout 29 giây',
        'Không có trạng thái job, client chờ vô hạn'
      ],
      follow: [
        'Nếu file 5GB thì sao? (multipart upload, Lambda không phù hợp → ECS/Fargate hoặc Step Functions)',
        'Nếu xử lý lỗi thì event đi đâu? (DLQ + alarm trên DLQ depth)',
        'Client biết khi nào xong bằng cách nào? (poll DynamoDB hoặc AppSync/WebSocket)'
      ],
      model: 'Bốn tầng. Client xin presigned URL, đẩy trực tiếp lên S3 — không qua API Gateway vì payload và vì giữ request ngắn. S3 event bắn vào SQS chứ không gọi thẳng Lambda để có retry và DLQ. Lambda đọc message, xử lý, ghi trạng thái vào DynamoDB theo job_id. Client poll một endpoint nhẹ đọc DynamoDB, hoặc WebSocket nếu cần realtime. Idempotency bằng cách kiểm tra job_id đã ở trạng thái done chưa trước khi ghi.'
    },
    {
      id: 'm04', ph: 'B', secs: 180,
      q: 'Khi nào bạn KHÔNG dùng Lambda?',
      why: 'JD: "Xây dựng API bằng Python, chạy trên container hoặc theo mô hình không máy chủ." Câu hỏi này phân biệt người biết Lambda với người chỉ biết cú pháp Lambda — và nó nối thẳng sang phần container của JD.',
      must: [
        'Tác vụ dài: quá 15 phút → ECS/Fargate, Batch, Step Functions',
        'Tải đều, liên tục: Lambda rẻ khi rảnh, đắt khi chạy 24/7 → container/EC2 rẻ hơn',
        'Cold start không chấp nhận được (giao dịch tài chính độ trễ thấp) → provisioned concurrency hoặc container',
        'Cần kiểm soát runtime sâu: binary lớn, GPU, cache trong RAM giữa các request',
        'Cần kết nối DB lâu dài: hàng nghìn Lambda mở connection → dùng RDS Proxy hoặc DynamoDB'
      ],
      red: ['"Lambda không giới hạn gì"', 'Không biết timeout 15 phút', 'Không biết cold start'],
      follow: ['Bạn từng gặp cold start chưa, xử lý thế nào?', 'Provisioned concurrency tốn tiền thế nào?'],
      model: 'Bốn trường hợp. Một, việc dài hơn 15 phút. Hai, tải đều 24/7 — Lambda tính theo thời gian chạy nên tải liên tục thì container rẻ hơn. Ba, độ trễ phải ổn định, cold start không chấp nhận được — có thể dùng provisioned concurrency nhưng nó tính tiền cả khi rảnh nên cân nhắc. Bốn, cần giữ trạng thái trong RAM hoặc binary lớn hơn giới hạn layer.'
    },
    {
      id: 'm05', ph: 'B', secs: 150,
      q: 'API Gateway REST API và HTTP API khác nhau gì, bạn chọn cái nào?',
      why: 'JD tag: API Gateway. Câu này hỏi để biết bạn có tự dựng chứ không chỉ đọc tutorial.',
      must: [
        'HTTP API rẻ hơn khoảng 70%, độ trễ thấp hơn, hợp proxy sang Lambda',
        'REST API có: API key + usage plan, request validation, mapping template, caching, WAF tích hợp',
        'Cả hai đều có authorizer; HTTP API có JWT authorizer gốc, REST API dùng Lambda authorizer hoặc Cognito',
        'Giới hạn quan trọng: integration timeout 29 giây (cả hai) — đây là lý do phải làm bất đồng bộ'
      ],
      red: ['Nói REST API luôn tốt hơn', 'Không biết 29 giây', 'Nhầm API Gateway với ALB'],
      follow: ['Bạn chặn spam thế nào? (throttle + usage plan + WAF)', 'JWT được kiểm ở đâu, Lambda có phải kiểm lại không?'],
      model: 'Mặc định em chọn HTTP API vì rẻ và đủ cho proxy Lambda. Chỉ chuyển sang REST API khi cần usage plan theo API key, request validation ở gateway, hoặc WAF. Điều quan trọng hơn cả hai: integration timeout 29 giây, nên mọi việc dài phải đẩy sang hàng đợi. Còn JWT: gateway kiểm chữ ký và hạn, nhưng Lambda vẫn phải kiểm quyền theo tài nguyên — gateway không biết user này có được xóa đơn của người khác không.'
    },
    {
      id: 'm06', ph: 'B', secs: 240,
      q: 'Thiết kế bảng DynamoDB cho một hệ đơn hàng: chọn partition key thế nào?',
      why: 'JD tag: DynamoDB, và dòng "Cấu hình tài nguyên AWS cần thiết cho tính năng: lưu trữ, hàng đợi, cơ sở dữ liệu". Đây là câu DynamoDB hay được hỏi nhất.',
      must: [
        'Partition key quyết định phân mảnh vật lý — chọn khóa phân bố đều, tránh khóa thấp như status/ngày',
        'Ví dụ đúng: PK = customer_id, SK = order_id#timestamp → một khách hàng nhiều đơn, query theo khách',
        'Hoặc PK = order_id nếu truy cập luôn theo đơn — nhưng khi đó query "đơn của khách X" phải dùng GSI',
        'Nêu hot partition: một khóa nhận quá nhiều request (ví dụ PK = "PENDING") → dồn vào một partition',
        'Nêu khái niệm item 400KB, và single-table design nếu họ hỏi sâu'
      ],
      red: ['Chọn status làm partition key', 'Nói "DynamoDB giống SQL nhưng nhanh hơn"', 'Không biết GSI là gì'],
      follow: ['Query khác Scan thế nào, chi phí khác ra sao?', 'Bạn đọc dữ liệu theo khoảng thời gian thì sao? (SK dạng timestamp, begins_with/BETWEEN)'],
      model: 'Em chọn khóa theo truy cập chứ không theo thực thể. Nếu màn hình chính là "đơn của tôi", PK = customer_id, SK = order_id — như vậy lấy danh sách đơn của một khách là một Query, không phải Scan. Nếu cần tra theo trạng thái thì đó là GSI, và phải nhớ GSI là eventually consistent. Em tránh khóa có ít giá trị như status vì nó tạo hot partition.'
    },
    {
      id: 'm07', ph: 'B', secs: 180,
      q: 'GSI khác LSI thế nào, và vì sao GSI có thể làm bạn bất ngờ?',
      why: 'JD tag DynamoDB — câu này tách người đọc docs với người đã dùng thật.',
      must: [
        'LSI: cùng partition key, khác sort key, tạo lúc tạo bảng, giới hạn 10GB mỗi partition',
        'GSI: partition key và sort key khác hoàn toàn, tạo thêm được sau, không giới hạn 10GB',
        'GSI là eventually consistent — đọc ngay sau khi ghi có thể chưa thấy. Đây là cái bẫy thật.',
        'GSI có dung lượng riêng → tốn tiền riêng, và khi ghi vào bảng chính thì ghi cả GSI',
        'GSI có thể bị throttle riêng dù bảng chính còn dư'
      ],
      red: ['Nói GSI strongly consistent được', 'Không biết giới hạn 10GB của LSI'],
      follow: ['Nếu cần đọc ngay sau ghi mà vẫn phải query theo khóa khác thì sao? (đọc từ bảng chính, hoặc chấp nhận, hoặc dùng Stream + bảng phụ)'],
      model: 'LSI cùng partition key, tạo lúc tạo bảng, giới hạn 10GB. GSI khóa khác hoàn toàn và tạo thêm được. Cái làm người ta bất ngờ là GSI eventually consistent: vừa ghi xong query GSI có thể chưa thấy, nên nếu luồng cần đọc-ngay-sau-ghi thì phải đọc bảng chính. GSI cũng có IOPS riêng nên có thể bị throttle dù bảng chính còn dư.'
    },
    {
      id: 'm08', ph: 'B', secs: 180,
      q: 'Một Lambda nằm trong private subnet cần gọi S3 và ghi log. Bạn phải làm gì?',
      why: 'JD dòng: "Cấu hình tài nguyên AWS cần thiết cho tính năng: lưu trữ, hàng đợi, cơ sở dữ liệu". Câu này là câu phân loại mạnh nhất trong nhóm VPC — rất nhiều người trả lời sai.',
      must: [
        'Private subnet không có route ra internet → Lambda mất kết nối ra ngoài',
        'Cần NAT Gateway (tốn tiền theo giờ + theo GB) HOẶC VPC endpoint',
        'Đúng hơn: S3 Gateway Endpoint (miễn phí) và CloudWatch Logs Interface Endpoint',
        'Security group của Lambda phải cho phép outbound; SG phải nằm trong VPC',
        'Nêu ENI: Lambda trong VPC cần ENI, ngày xưa cold start chậm hơn, hiện đã cải thiện'
      ],
      red: ['Nói "chỉ cần gắn role là xong"', 'Quên NAT hoặc endpoint', 'Không biết S3 gateway endpoint miễn phí'],
      follow: ['Nếu không muốn trả tiền NAT thì sao?', 'Lambda cần gọi API bên ngoài internet thì sao?'],
      model: 'Lambda trong private subnet không có đường ra internet, nên mặc định nó không gọi được S3 và không ghi được log. Hai cách: NAT Gateway hoặc VPC endpoint. Em ưu tiên endpoint — S3 Gateway Endpoint miễn phí, CloudWatch Logs Interface Endpoint tốn ít hơn NAT rất nhiều. Ngoài ra role IAM vẫn phải đủ quyền; VPC chỉ giải quyết đường mạng, không giải quyết quyền.'
    },
    {
      id: 'm09', ph: 'B', secs: 180,
      q: 'Bạn quản lý hạ tầng bằng CloudFormation thế nào? Stack lỗi giữa chừng thì sao?',
      why: 'JD tag: CloudFormation. JD không nói "biết" mà nói "cấu hình tài nguyên" — nghĩa là làm thật.',
      must: [
        'Không sửa tay trên console — mọi thay đổi qua template, nếu không sẽ drift',
        'Change set trước khi apply: xem nó định xóa/sửa gì',
        'Rollback mặc định khi lỗi; DeletionPolicy: Retain cho DB để không mất dữ liệu',
        'Nêu drift detection để phát hiện ai đó sửa tay',
        'Với Lambda/API: SAM hoặc dùng nested stack để tách nhỏ',
        'Tham số lấy từ SSM/Secrets Manager, không hardcode'
      ],
      red: ['Sửa tay rồi nói "vẫn chạy mà"', 'Không biết change set', 'Không biết rollback'],
      follow: ['Bạn lưu secret thế nào trong template?', 'Làm sao rollback một thay đổi đã lên prod mà không mất dữ liệu?'],
      model: 'Mọi thay đổi qua template, không sửa console — nếu sửa tay thì phải có drift detection để biết. Trước khi apply em xem change set, nhất là các resource bị replace vì replace DB là mất dữ liệu. Em đặt DeletionPolicy Retain cho RDS và S3 để stack xóa không kéo theo dữ liệu. Secret lấy từ SSM hoặc Secrets Manager bằng tham số động, không nằm trong template.'
    },
    {
      id: 'm10', ph: 'B', secs: 240,
      q: '3 giờ sáng, alarm kêu: Lambda lỗi 20%. Bạn làm gì, theo thứ tự nào?',
      why: 'JD: "Theo dõi nhật ký, chỉ số và chi phí của phần hệ thống mình phụ trách" + "Xử lý lỗi" + JD ghi rõ phải trực ca. Câu này gần như chắc chắn có.',
      must: [
        'Đầu tiên: xác nhận ảnh hưởng thật hay alarm nhiễu — xem số liệu, không sửa ngay',
        'Mở CloudWatch Logs, lọc theo request id / error, tìm lỗi đại diện chứ không đọc từng dòng',
        'Xem métrics: Errors, Throttles, Duration, ConcurrentExecutions — phân biệt lỗi do code với do throttle/timeout',
        'Kiểm tra thay đổi gần nhất: deploy nào vừa xảy ra, config nào vừa đổi',
        'Giảm thiểu trước, sửa gốc sau: rollback version trước nếu deploy mới là nghi phạm',
        'Ghi lại timeline, thông báo cho người liên quan',
        'Sau đó: thêm alarm/test để lỗi này không lặp'
      ],
      red: ['Sửa code ngay trên prod lúc 3h sáng', 'Không xem log mà đoán', 'Không phân biệt throttle với exception'],
      follow: ['Làm sao biết lỗi bắt đầu từ lúc nào?', 'Bạn viết alarm thế nào để lần sau bắt được sớm hơn?'],
      model: 'Em chia ba bước. Một, xác định phạm vi: bao nhiêu request, bắt đầu từ mấy giờ, có trùng deploy không. Hai, tìm lỗi đại diện trong log theo error message, đối chiếu metric để biết là exception hay throttle hay timeout. Ba, cắt triệu chứng trước: nếu nghi deploy thì rollback version trước, rồi mới tìm gốc. Xong thì ghi timeline và thêm test để tái hiện.'
    },
    {
      id: 'm11', ph: 'B', secs: 150,
      q: 'Kể một lần bạn làm giảm chi phí AWS. Bằng cách nào, giảm bao nhiêu?',
      why: 'JD: "Theo dõi nhật ký, chỉ số và chi phí". Đây là dòng dễ bị bỏ qua nhất khi chuẩn bị, và người phỏng vấn sẽ hỏi vì nó ghi trong JD.',
      must: [
        'Nêu cách bạn tìm ra chỗ tốn: Cost Explorer theo service/tag, hoặc bật tag chi phí',
        'Nêu một hành động cụ thể: log retention (giữ log 7 ngày thay vì vô hạn), chuyển S3 sang IA/Glacier, xóa NAT thay bằng endpoint, đổi tần suất, reserved capacity',
        'Nêu con số — nếu không nhớ chính xác thì nói "khoảng X%" và nói rõ là ước lượng',
        'Nêu đánh đổi: rẻ hơn nhưng chậm hơn / khó debug hơn'
      ],
      red: ['Bịa số chính xác', 'Nói "em chưa từng làm" rồi thôi', 'Chỉ nói chung "tối ưu hóa"'],
      follow: ['Bạn làm gì để chi phí không tăng lại?', 'Log nào bạn giữ lâu, log nào xóa?'],
      model: 'Chỗ tốn nhất thường là thứ không ai nhìn: log retention mặc định là không bao giờ xóa, và CloudWatch tính tiền lưu trữ theo GB. Em đặt retention 7–14 ngày và giữ lâu chỉ ở log lỗi. Thứ hai là NAT Gateway nếu có nhiều traffic S3 — thay bằng gateway endpoint. Đánh đổi là mất log cũ, nên em phải chắc là metric đã đủ để debug.'
    },

    /* ---------- C: container & release ---------- */
    {
      id: 'm12', ph: 'C', secs: 210,
      q: 'Viết Dockerfile cho một app FastAPI. Bạn quan tâm điều gì?',
      why: 'JD: "Hiểu về Docker và quy trình phát hành tự động." Đây là câu gần như chắc chắn.',
      must: [
        'Multi-stage build: stage build cài compiler, stage runtime chỉ copy cần thiết',
        'Thứ tự layer để cache: copy requirements.txt + pip install TRƯỚC, copy source SAU',
        'Base image slim/alpine (cẩn thận alpine + wheel), ghim version để build lặp lại được',
        'Không chạy root: tạo user và USER app',
        '.dockerignore: bỏ .git, venv, test, .env',
        'Không COPY .env vào image; truyền biến lúc chạy',
        'HEALTHCHECK hoặc để orchestrator lo, nhưng phải có endpoint health',
        'CMD dùng exec form, không shell form (để nhận SIGTERM)'
      ],
      red: ['COPY . . ở đầu', 'Chạy root', 'Nhét secret vào image', 'Dùng :latest'],
      follow: ['Image 1.2GB thì bạn làm gì?', 'Làm sao app nhận SIGTERM và tắt sạch?'],
      model: 'Multi-stage: stage build cài gcc và dependencies, stage runtime chỉ copy site-packages và code. Thứ tự quan trọng hơn cả: copy requirements.txt rồi pip install trước, copy code sau — nhờ vậy sửa code không phải cài lại thư viện. Chạy bằng user không phải root, có .dockerignore, không có .env trong image. CMD dạng exec để container nhận SIGTERM và đóng connection đúng cách.'
    },
    {
      id: 'm13', ph: 'C', secs: 180,
      q: 'Cùng một API Python: khi nào bạn chọn ECS Fargate, khi nào chọn Lambda?',
      why: 'JD: "chạy trên container hoặc theo mô hình không máy chủ" — JD nêu cả hai nên sẽ hỏi bạn chọn thế nào.',
      must: [
        'Lambda: tải không đều, chạy theo sự kiện, muốn không quản lý server, chấp nhận cold start',
        'Fargate: tải đều hoặc cần độ trễ ổn định, cần > 15 phút, cần binary lớn, cần giữ connection pool/DB',
        'Fargate tốn tiền theo task-giờ kể cả khi rảnh; Lambda tốn theo request + thời gian chạy',
        'Vận hành: Fargate cần ALB, autoscaling, image pipeline; Lambda ít việc hơn nhưng khó debug hơn khi lỗi phức tạp',
        'Có thể kết hợp: API trên Fargate, job nền trên Lambda'
      ],
      red: ['Nói Fargate luôn rẻ hơn', 'Không biết Fargate không cần quản lý EC2 nhưng vẫn tính tiền khi rảnh'],
      follow: ['Bạn autoscale Fargate dựa trên gì?', 'Lambda nối RDS thì làm sao tránh cạn connection?'],
      model: 'Em chọn theo hình dạng tải. Tải theo sự kiện, lúc có lúc không → Lambda. Tải đều và cần độ trễ ổn định, hoặc việc dài hơn 15 phút, hoặc cần connection pool → Fargate. Chi phí: Fargate tính theo task-giờ nên chạy rảnh vẫn tốn, còn Lambda rẻ khi rảnh. Vận hành thì Fargate cần ALB và autoscaling, Lambda ít việc hơn nhưng debug khó hơn.'
    },
    {
      id: 'm14', ph: 'C', secs: 180,
      q: 'Mô tả pipeline từ lúc bạn push code tới lúc nó chạy trên production.',
      why: 'JD: "quy trình phát hành tự động". Câu này kiểm tra bạn có hình dung được một pipeline thật hay chỉ biết khái niệm CI/CD.',
      must: [
        'Push → CI: lint, test (unit + integration với container DB), build image',
        'Build image một lần, tag bằng commit sha (không dùng latest), push ECR',
        'CD: deploy theo môi trường, có bước chờ duyệt cho prod nếu cần',
        'Migration DB chạy tách biệt, có thể rollback, không chạy trong bước deploy app',
        'Rollback: deploy lại image sha cũ, hoặc ECS deployment circuit breaker, hoặc Lambda alias/version',
        'Có smoke test sau deploy và alarm tự rollback'
      ],
      red: ['Deploy bằng tay lên prod', 'Build lại image mỗi môi trường', 'Migration chạy không kiểm soát'],
      follow: ['Deploy lỗi giữa chừng thì sao?', 'Bạn rollback DB migration thế nào?'],
      model: 'Push mở PR → CI chạy lint và test, trong đó test integration dùng container Postgres thật. Merge xong build image một lần, tag theo commit sha, đẩy lên ECR. CD deploy image đó. Migration chạy thành bước riêng trước khi deploy app, và phải viết theo kiểu tiến-lùi được. Rollback là deploy lại tag cũ, không build lại. ECS em bật circuit breaker để tự rollback nếu task không lên khỏe.'
    },

    /* ---------- D: Python & Vue ---------- */
    {
      id: 'm15', ph: 'D', secs: 180,
      q: 'Trong FastAPI, khác nhau giữa khai báo `async def` và `def` cho một endpoint là gì?',
      why: 'JD: "Xây dựng API bằng Python". Đây là câu phân loại Python-backend mạnh nhất — người dùng async mà không hiểu sẽ trả lời sai.',
      must: [
        'async def chạy trên event loop; nếu bên trong gọi thư viện blocking (requests, psycopg2 đồng bộ, đọc file lớn) thì CHẶN cả event loop',
        'def (đồng bộ) được FastAPI đẩy vào threadpool → không chặn loop, nhưng tốn thread',
        'Quy tắc: async def chỉ khi mọi I/O bên trong là async (httpx, asyncpg). Còn lại dùng def.',
        'Nêu hậu quả thật: một endpoint blocking làm cả service chậm, không chỉ endpoint đó'
      ],
      red: ['"async luôn nhanh hơn"', 'Dùng requests trong async def mà không biết là sai', 'Không biết có threadpool'],
      follow: ['Nếu bắt buộc phải gọi thư viện blocking trong async def thì sao? (run_in_executor)', 'CPU-bound thì xử lý ở đâu? (worker riêng, không phải event loop)'],
      model: 'Khác biệt không phải nhanh hay chậm mà là chặn hay không chặn. async def chạy trên event loop, nên nếu trong đó gọi requests hay driver đồng bộ thì cả service đứng, không chỉ một request. def thì FastAPI đẩy vào threadpool nên không chặn loop. Quy tắc của em: async def chỉ khi toàn bộ I/O bên trong là async. Việc nặng CPU thì đẩy sang worker riêng, không để trong request.'
    },
    {
      id: 'm16', ph: 'D', secs: 150,
      q: 'Bạn xử lý validate và lỗi trong một API FastAPI thế nào?',
      why: 'JD: "Viết kiểm thử và tham gia rà soát mã nguồn" + "Xử lý lỗi". Câu này kiểm tra bạn có viết API cho người khác dùng hay chỉ cho mình chạy.',
      must: [
        'Pydantic model cho request/response — validate ở biên, không tin dữ liệu vào',
        'Exception handler trả về format lỗi thống nhất (mã lỗi + message + request id)',
        'Phân biệt 4xx do người dùng và 5xx do hệ thống — 5xx phải log kèm stack, 4xx thì không cần stack',
        'Không trả stack trace ra ngoài, không log dữ liệu nhạy cảm (token, mật khẩu, số thẻ)',
        'Error response có request id để tra log'
      ],
      red: ['Để exception lọt ra thành 500 mặc định', 'Log cả body request có mật khẩu', 'Trả nguyên stack cho client'],
      follow: ['Làm sao client biết lỗi gì để hiển thị?', 'Bạn test các nhánh lỗi thế nào?'],
      model: 'Pydantic validate ở biên nên dữ liệu sai bị chặn trước khi vào logic. Em có một exception handler chung trả format thống nhất: mã lỗi, message cho người dùng, request id. 5xx thì log kèm stack và request id, 4xx thì log mức thấp hơn. Không trả stack ra ngoài, và log phải lọc bỏ field nhạy cảm — em từng thấy log ghi nguyên token vì log cả body.'
    },
    {
      id: 'm17', ph: 'D', secs: 150,
      q: 'Bạn viết test gì cho một endpoint có gọi DB?',
      why: 'JD nêu đích danh "Viết kiểm thử".',
      must: [
        'Test happy path, thiếu field bắt buộc, không có quyền, không tìm thấy',
        'Integration test dùng DB thật trong container (Testcontainers) — không mock DB, vì mock sẽ che lỗi SQL',
        'Fixtures: dữ liệu sạch mỗi test, rollback transaction',
        'Test cả hành vi biên: trùng key, payload quá lớn, unicode',
        'Không test implementation detail — test qua HTTP để refactor được'
      ],
      red: ['Chỉ mock tất cả và test 100% xanh', 'Không có test lỗi', 'Test phụ thuộc thứ tự chạy'],
      follow: ['Bạn test cái gì khi không có thời gian?', 'Làm sao test được phần gọi S3?'],
      model: 'Bốn nhánh tối thiểu: thành công, thiếu field, không có quyền, không tìm thấy. Với DB em dùng container thật thay vì mock, vì mock che mất lỗi SQL và lỗi transaction — đúng loại lỗi mình cần bắt. Mỗi test có dữ liệu sạch và rollback. Còn S3 thì em dùng localstack hoặc một lớp adapter mỏng để test được logic mà không gọi AWS thật.'
    },
    {
      id: 'm18', ph: 'D', secs: 180,
      q: 'Vue 3: `ref` và `reactive` khác nhau gì, khi nào dùng cái nào? `computed` và `watch` khác nhau ở đâu?',
      why: 'JD: "Thành thạo VueJS" — đây là câu kiểm tra mức cơ bản của Composition API, gần như chắc chắn có.',
      must: [
        'ref bọc mọi kiểu, truy cập qua .value trong JS (template tự unwrap); reactive chỉ với object, mất reactivity khi destructure',
        'ref an toàn khi truyền qua hàm và khi thay toàn bộ giá trị; reactive tiện cho object lớn nhưng dễ mất track',
        'computed: dẫn xuất, cache theo dependency, không có side effect',
        'watch: chạy side effect khi giá trị đổi, có thể async, có thể deep',
        'Quy tắc: dùng computed để tính, watch để làm việc'
      ],
      red: ['Nói reactive dùng được cho primitive', 'Dùng watch để tính giá trị dẫn xuất', 'Quên .value'],
      follow: ['Destructure một reactive thì sao?', 'watch và watchEffect khác nhau?'],
      model: 'ref bọc được mọi kiểu và truy cập bằng .value trong JS, template tự unwrap. reactive chỉ dùng cho object và sẽ mất reactivity nếu destructure — đây là lỗi rất hay gặp. Về computed với watch: computed để tính ra giá trị từ state khác và có cache, watch để chạy side effect như gọi API khi filter đổi. Dùng watch để tính giá trị là dấu hiệu chưa quen Composition API.'
    },
    {
      id: 'm19', ph: 'D', secs: 180,
      q: 'Trong Vue 3, `v-if` và `v-for` cùng trên một element thì sao? Và `key` để làm gì?',
      why: 'Câu bẫy kinh điển, và nó liên quan trực tiếp tới khoảng trống Vue của bạn. Người phỏng vấn hỏi đúng chỗ này để xem bạn đọc docs hay đoán.',
      must: [
        'Vue 3: v-if có độ ưu tiên CAO hơn v-for (Vue 2 thì ngược lại) — nên v-if không truy cập được biến của vòng lặp',
        'Cách đúng: đặt v-if ở thẻ cha, hoặc dùng computed lọc trước rồi mới v-for',
        'key giúp Vue nhận diện phần tử khi re-render; dùng index làm key gây lỗi khi chèn/xóa/đổi thứ tự',
        'key phải ổn định và duy nhất, thường là id từ server'
      ],
      red: ['Nói v-for ưu tiên cao hơn (đúng với Vue 2, sai với Vue 3)', 'Dùng index làm key mà không biết rủi ro'],
      follow: ['Vì sao dùng index làm key lại gây lỗi?', 'Em lọc danh sách ở đâu, trong computed hay template?'],
      model: 'Trong Vue 3, v-if ưu tiên cao hơn v-for, nên đặt cả hai trên một thẻ là sai — v-if không thấy biến vòng lặp. Em lọc bằng computed rồi mới v-for, hoặc đặt v-if ở thẻ cha. Key dùng để Vue biết phần tử nào là phần tử nào khi danh sách đổi; dùng index làm key thì khi chèn hay xóa, Vue giữ nhầm state của phần tử cũ — lỗi này rất khó thấy với danh sách đơn giản và rất dễ thấy với input.'
    },
    {
      id: 'm20', ph: 'D', secs: 150,
      q: 'Component Vue gọi API: bạn xử lý loading, lỗi và race condition thế nào?',
      why: 'JD: "Dựng giao diện bằng VueJS và tích hợp với các dịch vụ AWS." Chữ "tích hợp" chính là chỗ này.',
      must: [
        'Ba trạng thái tường minh: loading, error, data — không dùng một cờ boolean rồi suy ra',
        'Race: filter đổi nhanh thì request cũ về sau ghi đè kết quả mới → dùng AbortController hoặc so sánh request id',
        'Không gọi API trong template; gọi trong onMounted hoặc watch có kiểm soát',
        'Hiển thị lỗi cho người dùng bằng câu hiểu được, và có cách thử lại',
        'Không để lộ message lỗi thô từ server'
      ],
      red: ['Chỉ có loading và data', 'Không xử lý race', 'Hiển thị nguyên stack lỗi'],
      follow: ['Bạn debounce tìm kiếm ở đâu?', 'Nếu API chậm 10 giây thì UI thế nào?'],
      model: 'Em giữ ba trạng thái riêng: loading, error, data. Race condition là chỗ hay bị bỏ: gõ tìm kiếm nhanh thì request cũ về sau và ghi đè kết quả mới, nên em hủy request cũ bằng AbortController hoặc bỏ kết quả nếu request id không còn khớp. Lỗi thì hiển thị câu người dùng hiểu được và có nút thử lại, không đẩy message thô của server ra.'
    },

    /* ---------- E: tình huống ---------- */
    {
      id: 'm21', ph: 'E', secs: 180,
      q: 'Bạn phát hiện chính mình vừa gây ra một lỗi trên production. Bạn nói gì, làm gì?',
      why: 'JD: "Xử lý lỗi và cải tiến tính năng theo phản hồi người dùng" + quản lý bộ phận sẽ hỏi để biết bạn có giấu lỗi không.',
      must: [
        'Nói ra ngay, không chờ ai phát hiện — kèm phạm vi ảnh hưởng',
        'Cắt triệu chứng trước: rollback/feature flag, rồi mới điều tra',
        'Nêu timeline và nguyên nhân gốc, không đổ lỗi cho người khác',
        'Nêu biện pháp ngăn lặp lại: test, alarm, thay đổi quy trình',
        'Không hứa "sẽ không tái diễn" — hứa bằng cơ chế'
      ],
      red: ['"Em sẽ cẩn thận hơn"', 'Giấu và tự sửa lén', 'Đổ lỗi cho QA/reviewer'],
      follow: ['Làm sao để lần sau phát hiện sớm hơn?', 'Bạn có bao giờ phải nói với khách chưa?'],
      model: 'Em báo ngay, kèm phạm vi: bao nhiêu người bị, từ lúc nào. Rồi cắt triệu chứng trước — rollback hoặc tắt bằng feature flag — vì lúc đó ưu tiên là dừng thiệt hại, chưa phải tìm gốc. Sau đó mới viết timeline và tìm nguyên nhân. Cuối cùng là cơ chế: test tái hiện, alarm sớm hơn, hoặc đổi quy trình review. Em không hứa cẩn thận hơn vì câu đó không kiểm chứng được.'
    },
    {
      id: 'm22', ph: 'E', secs: 180,
      q: 'Bạn bất đồng kỹ thuật với một senior. Bạn xử lý thế nào?',
      why: 'JD: "Chủ động học công nghệ mới và tự chịu trách nhiệm với phần việc được giao." Quản lý hỏi để biết bạn có tranh luận được mà không phá đội.',
      must: [
        'Tách vấn đề khỏi người: nêu tiêu chí (độ trễ, chi phí, thời gian, khả năng bảo trì)',
        'Đưa bằng chứng đo được, không đưa cảm giác',
        'Nêu rõ đánh đổi của cả hai phương án',
        'Biết lúc dừng: nếu họ quyết và bạn đã nêu đủ, làm theo và ghi lại giả định',
        'Không nói xấu sau lưng, không im rồi làm khác'
      ],
      red: ['"Em luôn nghe theo senior"', 'Cãi tới cùng không có dữ liệu', 'Im và làm theo cách của mình'],
      follow: ['Nếu sau đó chứng minh được bạn đúng thì sao?', 'Bạn từng thay đổi ý vì dữ liệu chưa?'],
      model: 'Em đưa tiêu chí trước: chúng ta đang tối ưu cho cái gì. Rồi đưa số đo hoặc thử nghiệm nhỏ thay vì tranh luận bằng cảm giác. Điều em học được là nêu đủ rồi thì dừng — quyết định thuộc người chịu trách nhiệm, và em ghi lại giả định để sau nếu sai thì có cái mà xem lại, chứ không phải để nói "em đã bảo rồi".'
    },
    {
      id: 'm23', ph: 'F', secs: 120,
      q: 'Bạn có câu hỏi gì cho chúng tôi?',
      why: 'Mọi buổi đều kết bằng câu này. Trả lời "không có gì" là điểm trừ thật, vì JD nói họ chấm "cách bạn làm việc".',
      must: [
        'Hỏi về hạ tầng thật: "Hệ thống hiện chạy Lambda hay container, và điều gì khó nhất khi vận hành?"',
        'Hỏi về trực ca: "Ca trực xoay thế nào, có runbook chưa?"',
        'Hỏi về quy trình: "Một thay đổi từ PR tới production mất bao lâu?"',
        'Hỏi về đánh giá: "Sau 3 tháng, thế nào là làm tốt?"',
        'Hỏi về chứng chỉ: công ty chi trả — "em có thể đăng ký AWS sau khi vào không?"'
      ],
      red: ['"Không có gì ạ"', 'Hỏi lương ngay câu đầu', 'Hỏi câu mà Google trả lời được (công ty làm gì)'],
      follow: [],
      model: 'Ba câu em luôn hỏi: hệ thống hiện chạy Lambda hay container và điều gì khó nhất khi vận hành; ca trực xoay thế nào và đã có runbook chưa; sau ba tháng thì thế nào là làm tốt. Ba câu đó cho em biết công việc thật, và cũng cho họ thấy em đang nghĩ tới việc vận hành chứ không chỉ viết code.'
    }
  ];

  /* ============================================================
     COVERAGE LEDGER — mỗi dòng JD, có câu nào phủ
     tier: A = gần như chắc chắn, B = rất cao, C = có thể
     ============================================================ */
  var coverage = [
    { tier: 'A', line: 'Phát triển tính năng đầu cuối cho các ứng dụng web triển khai trên AWS.', qs: ['m03', 'm12'] },
    { tier: 'A', line: 'Xây dựng API bằng Python, chạy trên container hoặc theo mô hình không máy chủ.', qs: ['m15', 'm16'] },
    { tier: 'A', line: 'Dựng giao diện bằng VueJS và tích hợp với các dịch vụ AWS.', qs: ['m18', 'm19', 'm20'] },
    { tier: 'A', line: 'Cấu hình tài nguyên AWS cho tính năng: lưu trữ, hàng đợi, cơ sở dữ liệu, phân phối nội dung.', qs: ['m03', 'm06', 'm07', 'm08'] },
    { tier: 'A', line: 'Viết kiểm thử và tham gia rà soát mã nguồn.', qs: ['m17'] },
    { tier: 'A', line: 'Theo dõi nhật ký, chỉ số và chi phí của phần hệ thống mình phụ trách.', qs: ['m10', 'm11'] },
    { tier: 'A', line: 'Xử lý lỗi và cải tiến tính năng theo phản hồi người dùng.', qs: ['m21', 'm16'] },
    { tier: 'A', line: 'Tối thiểu 2 năm phát triển web với Python và một framework giao diện JavaScript.', qs: ['m01', 'm15'] },
    { tier: 'A', line: 'Có kinh nghiệm thực tế triển khai ứng dụng trên AWS.', qs: ['m03', 'm09', 'm13'] },
    { tier: 'A', line: 'Thành thạo VueJS; biết TypeScript là điểm cộng.', qs: ['m18', 'm19'] },
    { tier: 'A', line: 'Nắm được các dịch vụ AWS thông dụng: Lambda, API Gateway, S3, RDS hoặc DynamoDB.', qs: ['m04', 'm05', 'm06', 'm07', 'm08'] },
    { tier: 'A', line: 'Hiểu về Docker và quy trình phát hành tự động.', qs: ['m12', 'm14'] },
    { tier: 'A', line: 'Chủ động học công nghệ mới và tự chịu trách nhiệm với phần việc được giao.', qs: ['m22', 'm02'] },
    { tier: 'A', line: 'Tag kỹ năng: AWS · Lambda · Python · VueJS · DynamoDB · API Gateway · S3 · CloudFormation · Docker', qs: ['m03', 'm04', 'm05', 'm06', 'm07', 'm09', 'm10', 'm12', 'm14'] },
    { tier: 'B', line: 'Trực hệ thống theo ca (ghi trong mục thời gian làm việc).', qs: ['m10', 'm23'] },
    { tier: 'B', line: 'Hai vòng: "đội ngũ tuyển dụng" + "quản lý bộ phận".', qs: ['m01', 'm02', 'm22'] },
    { tier: 'C', line: 'Onsite/luân chuyển Nhật–Hàn–Úc–Mỹ; khách Nhật cần bàn giao được.', qs: ['m02', 'm02'] }
  ];

  /* Điều tuyệt đối không đoán được — nói thẳng trong UI */
  var unknowable = [
    ['Câu chữ chính xác', 'Cùng một chủ đề, người phỏng vấn khác nhau hỏi khác nhau. Không ai đoán được câu chữ.'],
    ['Bài tập về nhà cụ thể', 'Đề bài do họ nghĩ ra cho đúng dự án đang làm. Chỉ đoán được dạng và tiêu chí chấm.'],
    ['Người phỏng vấn là ai', 'Quản lý bộ phận có thể là backend, frontend hoặc DevOps — trọng tâm đổi theo người.'],
    ['Câu hỏi về dự án nội bộ họ', 'Phần này bạn không chuẩn bị được, và cũng không cần: họ đánh giá cách bạn hỏi lại.']
  ];

  /* ============================================================
     RENDER
     ============================================================ */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var KEY = 'hiTechCloudMock_v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { }
  }

  function renderCoverage() {
    var host = document.getElementById('covTable');
    if (!host) return;
    var state = load();
    var done = state.scores || {};
    var covered = 0, total = 0;

    var html = '';
    coverage.forEach(function (c) {
      var hit = c.qs.filter(function (id, i, a) { return a.indexOf(id) === i; });
      total++;
      if (hit.length) covered++;
      html += '<tr>' +
        '<td><span class="tier t' + c.tier + '">' + c.tier + '</span></td>' +
        '<td class="covline">' + esc(c.line) + '</td>' +
        '<td class="covqs">' + hit.map(function (id) {
          var sc = done[id];
          var cls = sc === undefined ? 'unseen' : (sc >= 2 ? 'good' : 'weak');
          return '<span class="pill ' + cls + '">' + id + '</span>';
        }).join(' ') + '</td>' +
        '</tr>';
    });
    host.innerHTML = html;

    var aCount = coverage.filter(function (c) { return c.tier === 'A'; }).length;
    document.getElementById('covSummary').innerHTML =
      '<b>' + covered + '/' + total + '</b> dòng JD có câu hỏi phủ · ' +
      '<b>' + aCount + '</b> dòng mức A (gần như chắc chắn xuất hiện).';
  }

  function renderWritten() {
    var forms = document.getElementById('wrForms');
    if (!forms) return;
    forms.innerHTML = written.forms.map(function (f) {
      return '<div class="wrform">' +
        '<div class="wrform-head"><b>' + esc(f.name) + '</b><span class="prob">' + esc(f.p) + '</span></div>' +
        '<p class="wrform-brief">' + esc(f.brief) + '</p>' +
        '<div class="wrlab">Họ chấm gì</div><ul>' + f.they.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<div class="wrlab risk">Rủi ro</div><p class="wrrisk">' + esc(f.risk) + '</p>' +
        '</div>';
    }).join('');

    var rub = document.getElementById('wrRubric');
    if (rub) rub.innerHTML = written.rubric.map(function (r) {
      return '<div class="rubrow"><b>' + esc(r[0]) + '</b><p>' + esc(r[1]) + '</p></div>';
    }).join('');

    var plan = document.getElementById('wrPlan');
    if (plan) plan.innerHTML = written.plan.map(function (p) {
      return '<div class="planrow"><span class="plant">' + esc(p[0]) + '</span><p>' + esc(p[1]) + '</p></div>';
    }).join('');
  }

  /* phiên phỏng vấn */
  var idx = 0, revealed = false, timer = null, elapsed = 0;

  function cur() { return qs[idx]; }

  function paintTimer() {
    var m = Math.floor(elapsed / 60), s = elapsed % 60;
    var el = document.getElementById('mkTimer');
    if (!el) return;
    el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    var lim = cur() ? cur().secs : 0;
    el.classList.toggle('over', elapsed > lim);
    var pct = lim ? Math.min(100, Math.round(elapsed / lim * 100)) : 0;
    var bar = document.getElementById('mkBar');
    if (bar) bar.style.width = pct + '%';
  }

  function stopTimer() { clearInterval(timer); timer = null; }

  function startTimer() {
    stopTimer(); elapsed = 0; paintTimer();
    timer = setInterval(function () { elapsed++; paintTimer(); }, 1000);
  }

  function renderQ() {
    var q = cur();
    var host = document.getElementById('mkBody');
    if (!q || !host) return;
    var st = load();
    var scored = st.scores || {};

    host.innerHTML =
      '<div class="mk-meta"><span class="mk-ph">Khối ' + q.ph + '</span>' +
      '<span class="mk-id">' + q.id + '</span>' +
      '<span class="mk-idx">' + (idx + 1) + ' / ' + qs.length + '</span></div>' +
      '<h3 class="mk-q">' + esc(q.q) + '</h3>' +
      '<div class="mk-why"><span>Vì sao họ hỏi</span><p>' + esc(q.why) + '</p></div>' +
      '<div class="mk-ctrls">' +
      '<button class="btn" id="mkReveal">' + (revealed ? 'Ẩn điểm phải chạm' : 'Hiện điểm phải chạm') + '</button>' +
      '<button class="btn ghost" id="mkReset">Đặt lại đồng hồ</button>' +
      '</div>' +
      '<div class="mk-answer' + (revealed ? ' on' : '') + '">' +
      '<div class="mk-block"><div class="mk-lab">Phải chạm</div><ul>' +
      q.must.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>' +
      (q.red.length ? '<div class="mk-block red"><div class="mk-lab">Mất điểm nếu</div><ul>' +
        q.red.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>' : '') +
      (q.follow.length ? '<div class="mk-block"><div class="mk-lab">Họ sẽ hỏi tiếp</div><ul>' +
        q.follow.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="mk-block model"><div class="mk-lab">Câu trả lời mẫu</div><p>' + esc(q.model) + '</p></div>' +
      '</div>' +
      '<div class="mk-score"><span>Tự chấm:</span>' +
      [0, 1, 2, 3].map(function (n) {
        var lab = ['Chưa nói được', 'Nói được một nửa', 'Đủ ý', 'Đủ ý + ví dụ'][n];
        var on = scored[q.id] === n ? ' on' : '';
        return '<button class="sc' + on + '" data-sc="' + n + '" title="' + lab + '">' + n + '</button>';
      }).join('') +
      '<span class="sc-hint" id="scHint">' + (scored[q.id] === undefined ? 'Chưa chấm' :
        ['Chưa nói được', 'Nói được một nửa', 'Đủ ý', 'Đủ ý + ví dụ'][scored[q.id]]) + '</span></div>' +
      '<div class="mk-nav">' +
      '<button class="btn ghost" id="mkPrev"' + (idx === 0 ? ' disabled' : '') + '>← Trước</button>' +
      '<button class="btn" id="mkNext">' + (idx === qs.length - 1 ? 'Xem kết quả' : 'Tiếp →') + '</button>' +
      '</div>';

    document.getElementById('mkReveal').onclick = function () { revealed = !revealed; renderQ(); };
    document.getElementById('mkReset').onclick = function () { startTimer(); };
    document.getElementById('mkPrev').onclick = function () { if (idx > 0) { idx--; revealed = false; startTimer(); renderQ(); paintNav(); } };
    document.getElementById('mkNext').onclick = function () {
      if (idx < qs.length - 1) { idx++; revealed = false; startTimer(); renderQ(); paintNav(); }
      else renderResult();
    };
    Array.prototype.forEach.call(host.querySelectorAll('.sc'), function (b) {
      b.onclick = function () {
        var st2 = load();
        st2.scores = st2.scores || {};
        st2.scores[q.id] = +b.dataset.sc;
        save(st2);
        renderQ();
        paintNav();
        renderCoverage();
      };
    });
    paintTimer();
  }

  function paintNav() {
    var nav = document.getElementById('mkDots');
    if (!nav) return;
    var st = load();
    var scored = st.scores || {};
    nav.innerHTML = qs.map(function (q, i) {
      var cls = 'dot';
      if (i === idx) cls += ' cur';
      if (scored[q.id] !== undefined) cls += scored[q.id] >= 2 ? ' good' : ' weak';
      return '<button class="' + cls + '" data-i="' + i + '" title="' + esc(q.q.slice(0, 60)) + '">' + q.id.replace('m', '') + '</button>';
    }).join('');
    Array.prototype.forEach.call(nav.querySelectorAll('.dot'), function (b) {
      b.onclick = function () { idx = +b.dataset.i; revealed = false; startTimer(); renderQ(); paintNav(); };
    });
  }

  function renderResult() {
    stopTimer();
    document.getElementById('mkTimer').textContent = 'kết quả';
    document.getElementById('mkTimer').classList.remove('over');
    document.getElementById('mkBar').style.width = '100%';
    var st = load();
    var scored = st.scores || {};
    var got = 0, max = qs.length * 3, missed = [];
    qs.forEach(function (q) {
      var s = scored[q.id];
      if (s === undefined) { missed.push(q); return; }
      got += s;
      if (s < 2) missed.push(q);
    });
    var pct = Math.round(got / max * 100);
    var verdict = pct >= 75 ? 'Sẵn sàng — phần còn lại là diễn đạt.' :
      pct >= 50 ? 'Đủ nền, còn lỗ hổng ở danh sách dưới.' :
        'Chưa nên đi phỏng vấn tuần này. Học lại mục 00 trước.';

    document.getElementById('mkBody').innerHTML =
      '<div class="mk-result"><div class="mk-pct">' + pct + '%</div>' +
      '<p class="mk-verdict">' + verdict + '</p>' +
      '<p class="mk-sub">' + got + ' / ' + max + ' điểm · ' +
      qs.filter(function (q) { return scored[q.id] !== undefined; }).length + '/' + qs.length + ' câu đã chấm</p></div>' +
      (missed.length ? '<div class="mk-block red"><div class="mk-lab">Cần siết lại</div><ul>' +
        missed.map(function (q) { return '<li><b>' + q.id + '</b> — ' + esc(q.q) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="mk-nav"><button class="btn" id="mkRestart">Làm lại từ đầu</button></div>';
    document.getElementById('mkRestart').onclick = function () { idx = 0; revealed = false; startTimer(); renderQ(); paintNav(); };
  }

  function render() {
    renderWritten();
    renderCoverage();
    var st = load();
    if (st.scores && Object.keys(st.scores).length) {
      var first = qs.filter(function (q) { return st.scores[q.id] === undefined; })[0];
      idx = first ? qs.indexOf(first) : 0;
    }
    startTimer();
    renderQ();
    paintNav();

    var un = document.getElementById('unknowable');
    if (un) un.innerHTML = unknowable.map(function (u) {
      return '<div class="unkrow"><b>' + esc(u[0]) + '</b><p>' + esc(u[1]) + '</p></div>';
    }).join('');

    var ph = document.getElementById('mkPhases');
    if (ph) ph.innerHTML = phases.map(function (p) {
      return '<div class="phrow"><span class="phn">' + p[0] + '</span><b>' + esc(p[1]) +
        '</b><span class="pht">' + esc(p[2]) + '</span><p>' + esc(p[3]) + '</p></div>';
    }).join('');
  }

  return { render: render, qs: qs, coverage: coverage };
})();
