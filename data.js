/* HitechCloud prep — dữ liệu học. Sửa ở đây, không sửa index.html. */
window.PREP = {

concepts: [
  {
    title: "Component cơ bản",
    vue: `<script setup>
const props = defineProps({ name: String })
</script>

<template>
  <h1>{{ name }}</h1>
</template>`,
    react: `export default function Hello({ name }) {
  return <h1>{name}</h1>
}`,
    note: "Vue tách template khỏi logic, React trộn JSX vào hàm. Không có khác biệt về mô hình."
  },
  {
    title: "State cục bộ",
    vue: `const count = ref(0)
const form = reactive({ email: '' })

function inc() { count.value++ }`,
    react: `const [count, setCount] = useState(0)
const [form, setForm] = useState({ email: '' })

const inc = () => setCount(c => c + 1)`,
    note: "ref phải .value trong JS, không cần trong template. React luôn bất biến — phải tạo object mới."
  },
  {
    title: "Giá trị dẫn xuất (derived)",
    vue: `const total = computed(() =>
  items.value.reduce((s, i) => s + i.price, 0)
)`,
    react: `const total = useMemo(
  () => items.reduce((s, i) => s + i.price, 0),
  [items]
)`,
    note: "Vue tự track dependency; React phải khai báo mảng deps. Quên deps = tính sai. Đây là câu hay bị hỏi."
  },
  {
    title: "Side effect",
    vue: `onMounted(() => { load() })

watch(userId, (id) => { load(id) })

onUnmounted(() => clearInterval(t))`,
    react: `useEffect(() => { load(id) }, [id])

useEffect(() => {
  const t = setInterval(tick, 1000)
  return () => clearInterval(t)
}, [])`,
    note: "Vue tách onMounted / watch / onUnmounted; React gói tất cả vào useEffect với cleanup. Cả hai đều 'sau khi render'."
  },
  {
    title: "Truyền dữ liệu xuống",
    vue: `<script setup>
defineProps({ item: Object, active: Boolean })
</script>

<template><Row :item="item" :active="active" /></template>`,
    react: `<Row item={item} active={active} />

function Row({ item, active }) {
  return <div className={active ? 'on' : ''}>{item.name}</div>
}`,
    note: "Vue dùng :prop (bind), React dùng prop={}. Vue có runtime type check; React cần TypeScript."
  },
  {
    title: "Báo sự kiện lên cha",
    vue: `const emit = defineEmits(['save'])
function onClick() { emit('save', id) }`,
    react: `function Row({ onSave }) {
  return <button onClick={() => onSave(id)}>Lưu</button>
}`,
    note: "Vue là emit theo tên; React là truyền callback xuống. React không có khái niệm emit."
  },
  {
    title: "Form two-way",
    vue: `<input v-model="email" />
<select v-model="role">...</select>
<MyInput v-model="q" />

// trong MyInput:
const model = defineModel()`,
    react: `<input value={email} onChange={e => setEmail(e.target.value)} />

<MyInput value={q} onChange={setQ} />`,
    note: "v-model là cú pháp đường (sugar) cho value + onInput. React không có — phải viết tay."
  },
  {
    title: "Render danh sách",
    vue: `<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>`,
    react: `{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}`,
    note: "key ở cả hai. Vue dùng :key, React dùng key={}. Dùng index làm key là lỗi kinh điển khi list thay đổi thứ tự."
  },
  {
    title: "Render có điều kiện",
    vue: `<p v-if="loading">Đang tải...</p>
<p v-else-if="error">{{ error }}</p>
<p v-else>{{ data }}</p>

<div v-show="open">...</div>`,
    react: `{loading ? <p>Đang tải...</p>
 : error ? <p>{error}</p>
 : <p>{data}</p>}

{open && <div>...</div>}`,
    note: "v-if xoá khỏi DOM, v-show chỉ ẩn (display:none). React không có v-show — dùng style hoặc class."
  },
  {
    title: "Store toàn cục",
    vue: `export const useUser = defineStore('user', {
  state: () => ({ me: null }),
  getters: { isAdmin: s => s.me?.role === 'admin' },
  actions: { async load() { this.me = await api.me() } }
})`,
    react: `// Zustand (phổ biến nhất hiện nay)
export const useUser = create(set => ({
  me: null,
  isAdmin: () => get().me?.role === 'admin',
  load: async () => set({ me: await api.me() })
}))

const me = useUser(s => s.me)`,
    note: "Pinia ≈ NgRx nhưng nhẹ hơn nhiều. Bên React không có store chuẩn — Zustand/Redux đều được, phải nói rõ bạn chọn cái nào và vì sao."
  },
  {
    title: "Routing",
    vue: `const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/jobs/:id', component: JobDetail }]
})

router.beforeEach((to) => {
  if (to.meta.auth && !auth.isLogged) return '/login'
})`,
    react: `// react-router v7
<BrowserRouter>
  <Routes>
    <Route path="/jobs/:id" element={<JobDetail />} />
  </Routes>
</BrowserRouter>

const id = useParams().id`,
    note: "Vue Router là một package chính thức; React dùng react-router (bên thứ ba nhưng chuẩn de facto)."
  },
  {
    title: "Gọi API + 3 trạng thái",
    vue: `const data = ref(null)
const loading = ref(false)
const error = ref(null)

async function load() {
  loading.value = true
  error.value = null
  try { data.value = await api.get('/jobs') }
  catch (e) { error.value = e.message }
  finally { loading.value = false }
}
onMounted(load)`,
    react: `const [state, setState] = useState({ data: null, loading: true, error: null })

useEffect(() => {
  let alive = true
  api.get('/jobs')
    .then(d => alive && setState({ data: d, loading: false, error: null }))
    .catch(e => alive && setState({ data: null, loading: false, error: e.message }))
  return () => { alive = false }
}, [])`,
    note: "Câu 'cờ alive để chống setState sau unmount' là điểm cộng — chứng tỏ đã làm React thật, không chỉ đọc docs."
  }
],

basics: [
  { t: "AWS", a: "Thuê máy tính và ổ đĩa của người khác, trả tiền theo giờ dùng.",
    p: "Một tập hàng trăm dịch vụ hạ tầng: máy chủ, ổ đĩa, mạng, cơ sở dữ liệu, hàng đợi — tất cả thuê qua API, không mua thiết bị.",
    w: "Vì sao nó tồn tại: mua server thì phải đoán trước tải, mua thiếu thì sập, mua thừa thì tiền chết. Thuê theo giờ thì co giãn theo tải thật.",
    l: "AWS là hạ tầng dạng dịch vụ — em không quản máy, em quản cấu hình và quyền." },
  { t: "Region và Availability Zone", a: "Region là thành phố; AZ là các toà nhà khác nhau trong cùng thành phố đó, không chung đường điện.",
    p: "Region là một khu vực địa lý (Singapore, Tokyo). Mỗi region có nhiều AZ — trung tâm dữ liệu độc lập về điện, mạng, làm mát.",
    w: "Vì sao: đặt hai bản sao ở hai AZ thì mất điện một toà vẫn chạy. Đặt cả hai ở một AZ thì đó chỉ là hai cái máy trong cùng một nhà.",
    l: "Em luôn rải instance ở ít nhất hai AZ trong cùng region." },
  { t: "VPC", a: "Mạng riêng trong nhà bạn, có cửa khoá và danh sách ai được vào phòng nào.",
    p: "Một mạng ảo riêng trong AWS account. Chia thành subnet; subnet public có đường ra internet, subnet private thì không. Đi ra ngoài phải qua NAT gateway.",
    w: "Vì sao: không phải thứ gì cũng nên nhìn thấy từ internet. Database nằm trong private subnet, chỉ ALB được gọi vào.",
    l: "DB em để private subnet, chỉ nhận traffic từ security group của tầng app." },
  { t: "EC2", a: "Một cái máy tính thuê theo giờ — bật lên là có, tắt là hết tính tiền máy (nhưng ổ đĩa vẫn tính).",
    p: "Máy chủ ảo toàn quyền: bạn chọn hệ điều hành, cài gì cũng được, quản patch, quản process. Khác Lambda ở chỗ nó sống liên tục.",
    w: "Vì sao chọn EC2: cần chạy thứ dài hơi, cần kiểm soát máy, hoặc app hiện tại viết cho server truyền thống. Đổi lại là bạn phải tự lo vá lỗi và scale.",
    l: "Bên em app chạy trên EC2 đặt sau ALB, nhiều máy ở hai AZ, truy cập bằng SSM chứ không mở SSH ra ngoài." },
  { t: "S3", a: "Một ổ cứng khổng lồ trên mạng, mỗi file có một địa chỉ riêng, và không có giới hạn dung lượng tổng.",
    p: "Lưu object (file bất kỳ) theo bucket. Không có thư mục thật — dấu / chỉ là một phần của tên. Mặc định là private, muốn cho ai đọc thì phải cấp quyền.",
    w: "Vì sao: file không nên nằm trong ổ của server app (mất máy là mất file, và không scale ngang được).",
    l: "File để trên S3 bucket private, client tải bằng presigned URL có hạn, quyền kiểm ở API trước khi ký." },
  { t: "Lambda", a: "Một cái hàm chỉ tồn tại lúc có người gọi. Không gọi thì không có máy nào chạy và không mất tiền.",
    p: "Bạn upload code, AWS chạy nó khi có sự kiện (HTTP request, file mới trong S3, message trong hàng đợi). Mỗi lần gọi có giới hạn 15 phút.",
    w: "Vì sao: với traffic lúc có lúc không, thuê máy thường trực là lãng phí. Nhưng lần gọi đầu phải khởi tạo môi trường — đó là cold start.",
    l: "Lambda hợp việc ngắn và gián đoạn; việc dài hơn 15 phút hoặc cần kết nối thường trực thì phải sang container." },
  { t: "API Gateway", a: "Lễ tân của toà nhà: nhận khách, kiểm giấy tờ, chỉ đúng phòng, và ghi lại ai đã vào.",
    p: "Cổng HTTP đứng trước backend. Lo định tuyến, xác thực token, giới hạn tần suất, CORS — để backend không phải lặp lại mấy việc đó.",
    w: "Vì sao: tách phần 'cổng' khỏi phần 'nghiệp vụ'. Đổi backend (Lambda sang container) mà client không biết.",
    l: "Gateway chặn token sai, nhưng phân quyền theo vai trò vẫn nằm trong app — gateway không biết user được xem bản ghi nào." },
  { t: "IAM", a: "Thẻ nhân viên cộng với danh sách phòng được phép vào.",
    p: "Hệ thống quyền của AWS: ai (user/role) được làm gì (policy) trên tài nguyên nào. Role là thẻ tạm, tự hết hạn; access key là chìa khoá photo, không hết hạn.",
    w: "Vì sao: mọi lỗi bảo mật trên cloud đều là lỗi quyền. Cấp thừa quyền là rủi ro lớn hơn cấp thiếu.",
    l: "Em dùng IAM role gắn vào instance hoặc task, không đặt access key trong code." },
  { t: "RDS và DynamoDB", a: "RDS giống một cái tủ có người quản lý và tra cứu được mọi kiểu câu hỏi; DynamoDB giống tủ hồ sơ chỉ tra được theo mã đã in sẵn.",
    p: "RDS là database quan hệ do AWS trông hộ (backup, failover, vá lỗi). DynamoDB là database khoá-giá trị dạng managed, không có join, truy vấn phải theo khoá đã thiết kế.",
    w: "Vì sao có hai: RDS linh hoạt khi câu hỏi chưa biết trước; DynamoDB rẻ và cực nhanh khi câu hỏi đã biết và dữ liệu rất lớn.",
    l: "Em chọn theo truy vấn: cần join và báo cáo linh hoạt thì PostgreSQL trên RDS; biết chắc access pattern và cần độ trễ thấp ở quy mô lớn thì DynamoDB." },
  { t: "CloudWatch", a: "Camera cộng đồng hồ đo cộng chuông báo cháy — gắn vào mọi thứ để biết cái gì đang sai.",
    p: "Thu log, lưu metric, đặt alarm, xem trace. Là chỗ đầu tiên bạn mở khi có sự cố.",
    w: "Vì sao: không đo thì không biết hỏng, và không biết hỏng thì người dùng phát hiện trước bạn.",
    l: "Em đặt alarm trên triệu chứng người dùng thấy (tỉ lệ lỗi, p95) chứ không chỉ CPU, và đặt retention cho log để không đốt tiền." },
  { t: "Docker và container", a: "Đóng gói app cùng mọi thứ nó cần vào một cái hộp, hộp chạy ở đâu cũng giống nhau.",
    p: "Image là bản đóng gói; container là một tiến trình chạy từ image đó. Khác máy ảo ở chỗ dùng chung nhân hệ điều hành nên nhẹ và bật nhanh.",
    w: "Vì sao: hết cảnh 'máy em chạy được'. Dockerfile mô tả môi trường bằng file, review được, build lại được.",
    l: "Em build image nhiều tầng, đẩy lên registry, và deploy bằng cách cập nhật revision — rollback là trỏ về tag cũ." },
  { t: "CloudFormation", a: "Bản thiết kế ngôi nhà bằng file, để lần sau xây lại y hệt thay vì nhớ từng viên gạch.",
    p: "Mô tả hạ tầng trong template (JSON/YAML). AWS đọc file và tạo/sửa/xoá tài nguyên cho khớp. Một lần triển khai là một stack.",
    w: "Vì sao: hạ tầng dựng tay trên console thì không ai review được, không tái lập được, và lệch dần theo thời gian (drift).",
    l: "Em review change set trước khi apply, bật bảo vệ xoá cho stack và Retain cho dữ liệu." },
  { t: "Component (Vue và React)", a: "Một khối giao diện tự lo phần của nó: tự giữ dữ liệu, tự vẽ lại khi dữ liệu đổi.",
    p: "Hàm (React) hoặc file .vue (Vue) nhận props từ cha, giữ state bên trong, trả về giao diện. Ghép nhiều component thành trang.",
    w: "Vì sao: giao diện lớn chia thành phần nhỏ thì sửa một chỗ không phá chỗ khác. Khi state đổi, framework tự cập nhật DOM — bạn không tự sờ vào DOM.",
    l: "Cả hai đều cùng mô hình: dữ liệu xuống bằng props, sự kiện lên bằng callback hoặc emit, state đổi thì render lại." },
  { t: "Store dùng chung", a: "Một kho dữ liệu chung đặt giữa các phòng, mọi phòng đọc từ đó thay vì mỗi phòng giữ bản sao.",
    p: "Khi nhiều màn hình cần cùng dữ liệu (user đăng nhập, giỏ hàng), đưa nó ra store thay vì truyền props qua nhiều tầng. Vue: Pinia. React: Zustand/Redux.",
    w: "Vì sao: truyền props qua 5 tầng chỉ để một component sâu dùng là mệt và dễ lệch. Nhưng không phải state nào cũng nên vào store — state cục bộ thì để cục bộ.",
    l: "Em chỉ đưa vào store state dùng ở nhiều nơi hoặc cần giữ qua điều hướng; còn lại giữ cục bộ cho dễ đọc." }
],

questions: [
  /* ---------------- AWS ---------------- */
  { t: "aws", lv: "core", q: "S3 presigned URL là gì và vì sao dùng nó?",
    a: "URL được ký bằng credential của IAM principal, có thời hạn, cấp quyền cho đúng một thao tác trên đúng một object. Dùng để user tải/lên file <b>trực tiếp</b> từ S3 mà không cần mở public bucket và không đẩy bytes qua server app.",
    trap: "Nếu nói 'để cho public' là sai bản chất — presigned URL tồn tại chính vì bucket private." },
  { t: "aws", lv: "core", q: "Bucket private, user cần tải tài liệu — luồng đầy đủ?",
    a: "① Xác thực user → ② kiểm quyền ở tầng ứng dụng (người này có được xem tài liệu này không) → ③ server gọi <code>generate_presigned_url</code> hạn 5–15 phút → ④ trả URL → ⑤ client tải thẳng từ S3. Quyền của S3 không biết user của bạn là ai, nên bước ② <b>không được bỏ</b>.",
    trap: "Bỏ bước kiểm quyền = ai có link cũng tải được trong thời hạn URL. Đây là lỗ hổng hay bị bắt." },
  { t: "aws", lv: "core", q: "Versioning và lifecycle để làm gì?",
    a: "Versioning giữ mọi phiên bản object → chống ghi đè và xoá nhầm (xoá chỉ đặt delete marker). Lifecycle tự chuyển storage class (Standard → IA → Glacier) hoặc xoá sau N ngày → đòn giảm chi phí trực tiếp. Mặc định nên bật versioning cho dữ liệu không tái tạo được.",
    trap: "Versioning làm tăng chi phí: mọi phiên bản đều tính tiền. Phải đi kèm lifecycle." },
  { t: "aws", lv: "core", q: "S3 có nhất quán mạnh không?",
    a: "Có. Từ 2020 S3 strongly consistent cho mọi thao tác PUT, overwrite, DELETE và LIST. Đừng nhắc mô hình 'read-after-write cho object mới, eventual cho overwrite' — đó là kiến thức cũ và bị coi là lỗi thời.",
    trap: "Trả lời theo docs cũ là mất điểm oan." },
  { t: "aws", lv: "deep", q: "Khi nào cần multipart upload?",
    a: "File lớn (khuyến nghị >100 MB, bắt buộc với >5 GB vì một PUT đơn giới hạn 5 GB). Chia part, upload song song, retry từng part. Object tối đa 5 TB.",
    trap: "ETag của object multipart không phải MD5 của cả file — đừng dùng ETag để so sánh checksum." },
  { t: "aws", lv: "core", q: "EC2 trong private subnet vẫn ghi được S3 bằng gì?",
    a: "Hai cách: <b>NAT Gateway</b> (ra internet, tính tiền theo GB) hoặc <b>VPC Gateway Endpoint cho S3</b> (miễn phí, traffic không rời mạng AWS, không cần internet). Chuẩn production là endpoint.",
    trap: "Không có endpoint và không có NAT thì instance private im lặng timeout — lỗi rất hay gặp khi dựng VPC." },
  { t: "aws", lv: "core", q: "Security group khác NACL thế nào?",
    a: "Security group: gắn theo instance/ENI, <b>stateful</b> (cho phép vào thì tự cho phép ra), chỉ có luật allow, đánh giá toàn bộ luật trước khi quyết định. NACL: theo subnet, <b>stateless</b> (phải mở cả hai chiều), có cả allow và deny, đánh giá theo số thứ tự.",
    trap: "Stateful/stateless là điểm phân biệt duy nhất người ta thật sự muốn nghe." },
  { t: "aws", lv: "core", q: "Ứng dụng trên EC2 lấy quyền AWS thế nào cho đúng?",
    a: "Gắn <b>IAM role</b> vào instance qua instance profile; SDK tự lấy credential tạm từ metadata service và tự xoay vòng, không có khoá nào trong code. Access key tĩnh trong <code>.env</code> là nợ kỹ thuật vì khoá gắn với <b>principal chứ không gắn với máy</b>: ai đọc được file là dùng được từ bất kỳ đâu, không tự xoay vòng, phải nhớ revoke thủ công. (CloudTrail vẫn log access key id nên vẫn truy được ai dùng — vấn đề là phạm vi và vòng đời, không phải khả năng audit.)",
    trap: "Nếu bạn từng làm sai cách này, nói thẳng 'đó là chỗ em biết phải sửa' — ăn điểm hơn là giấu." },
  { t: "aws", lv: "core", q: "Một EC2 chạy production có đủ không?",
    a: "Không — là single point of failure và không có AZ redundancy. Chuẩn: nhiều instance ở ≥2 AZ sau <b>ALB</b>, trong <b>Auto Scaling Group</b> với health check; DB dùng Multi-AZ. Nói thêm: rolling deploy dùng ASG + instance refresh với MinHealthyPercentage cao để <b>giảm</b> downtime — không phải zero-downtime tuyệt đối, connection đang xử lý vẫn có thể bị cắt.",
    trap: "Chỉ nói 'thêm máy' là chưa đủ; phải có health check và cơ chế thay thế instance hỏng." },
  { t: "aws", lv: "deep", q: "Tắt EC2 có hết tiền không? EBS khác instance store thế nào?",
    a: "Không. Compute dừng nhưng EBS vẫn tính tiền; và từ 01/02/2024 AWS tính 0,005 USD/giờ cho <b>mọi</b> public IPv4, gắn hay không gắn — nên IP của instance đang stop vẫn tốn tiền. EBS là ổ mạng bền, sống qua stop/start, snapshot được; instance store là đĩa vật lý gắn máy, nhanh nhưng <b>mất dữ liệu khi stop/terminate</b>.",
    trap: "Câu này kiểm tra bạn đã từng nhìn hoá đơn hay chưa." },
  { t: "aws", lv: "core", q: "Lambda cold start là gì, giảm thế nào?",
    a: "Khi không có sandbox sẵn, Lambda phải tạo môi trường, tải code và chạy phần khởi tạo (import thư viện, tạo client) → độ trễ thêm. Giảm: package nhỏ và ít dependency, khởi tạo SDK ngoài handler (dùng lại qua các lần gọi), <b>provisioned concurrency</b> cho đường nóng, hoặc chuyển sang container nếu vẫn chậm.",
    trap: "'Dùng warm' không phải câu trả lời — warm không đảm bảo, và scale-out luôn tạo sandbox mới." },
  { t: "aws", lv: "core", q: "Giới hạn cứng của Lambda mà bạn phải biết?",
    a: "Timeout tối đa <b>15 phút</b>; bộ nhớ 128 MB–10 GB (CPU scale theo RAM); <code>/tmp</code> tối đa 10 GB; payload đồng bộ ~6 MB; một event SQS tối đa 10 message; mỗi vùng có hạn mức concurrency. Vì thế job dài phải tách sang Fargate/Batch hoặc Step Functions.",
    trap: "Không biết 15 phút là lỗi nặng với người từng 'làm Lambda'." },
  { t: "aws", lv: "deep", q: "FastAPI trên Lambda: khi nào KHÔNG nên?",
    a: "Khi request dài (ảnh, video, batch), khi cần websocket/streaming lâu, khi cold start phá SLA, hoặc khi app giữ connection pool DB lớn (mỗi sandbox một pool → cạn connection; phải dùng RDS Proxy). Nếu không vướng mấy điều đó thì Lambda + API Gateway rất hợp và rẻ khi tải thấp.",
    trap: "Câu này dành cho người đã thật sự deploy — trả lời được là điểm cộng lớn vì JD yêu cầu cả Python và Lambda." },
  { t: "aws", lv: "core", q: "API Gateway: HTTP API khác REST API thế nào?",
    a: "HTTP API rẻ hơn, độ trễ thấp hơn, đủ cho phần lớn trường hợp (route, CORS, JWT authorizer, Lambda proxy). REST API có thêm API key + usage plan, request validation, caching, private endpoint và request/response transformer. Chọn HTTP API trước, chỉ lên REST API khi cần đúng mấy thứ đó. (WAF đừng đem ra so — cả hai loại đều gắn được WAF.)",
    trap: "Trả lời 'API Gateway là cổng vào' mà không phân biệt hai loại là câu trả lời của người chưa dùng." },
  { t: "aws", lv: "core", q: "RDS hay DynamoDB — chọn thế nào?",
    a: "RDS/PostgreSQL khi cần join, giao dịch nhiều bảng, truy vấn linh hoạt, đã có schema rõ. DynamoDB khi truy cập theo khoá với quy mô rất lớn, độ trễ một chữ số ms, và <b>access pattern biết trước</b>. Tiêu chí quyết định là 'truy vấn của bạn có cố định không', không phải 'cái nào mới hơn'.",
    trap: "Chọn DynamoDB rồi lại cần báo cáo ad-hoc là sai lầm kinh điển — câu này dùng để bắt điều đó." },
  { t: "aws", lv: "deep", q: "Thiết kế bảng DynamoDB cho 'đơn hàng theo khách, và theo ngày'?",
    a: "Access pattern quyết định khoá. Một bảng: PK = <code>CUSTOMER#&lt;id&gt;</code>, SK = <code>ORDER#&lt;ngày&gt;#&lt;id&gt;</code> → lấy đơn của một khách theo thời gian bằng <code>Query</code> + <code>begins_with</code>. Thêm GSI: PK = <code>DATE#&lt;ngày&gt;</code> cho truy vấn theo ngày toàn hệ thống. Không bao giờ <code>Scan</code> trên bảng production.",
    trap: "Nếu nói 'tạo bảng orders rồi scan theo điều kiện' là chưa hiểu DynamoDB." },
  { t: "aws", lv: "deep", q: "CloudFormation: stack, change set, drift là gì?",
    a: "Template mô tả hạ tầng; <b>stack</b> là một lần triển khai template. <b>Change set</b> là bản xem trước thay đổi (thêm/sửa/xoá tài nguyên nào) — review rồi mới apply, đúng tinh thần review code. <b>Drift</b> là khi ai đó sửa tay trên console làm hạ tầng lệch template.",
    trap: "Không có change set thì mọi lần deploy là mù — đây là lý do IaC được yêu cầu trong JD." },
  { t: "aws", lv: "core", q: "Bạn theo dõi log, chỉ số và CHI PHÍ của phần mình phụ trách thế nào?",
    a: "Log tập trung (CloudWatch Logs, có retention chứ không giữ mãi), metric nghiệp vụ + hạ tầng, alarm trên triệu chứng người dùng thấy (p95 latency, tỉ lệ lỗi) chứ không chỉ CPU. Chi phí: log theo từng route/tenant, đặt alarm trên chi phí, và tắt/giảm tài nguyên không dùng. Bạn <b>đã làm</b> phần cost-per-route ở UniGuide — kể đúng chỗ này.",
    trap: "Đây là bullet hiếm trong JD. Trả lời chung chung là bỏ phí lợi thế lớn nhất của bạn." },
  { t: "aws", lv: "deep", q: "Ba đòn giảm chi phí AWS mạnh nhất?",
    a: "① Đúng kích thước: bỏ instance/volume mồ côi, chọn instance type theo tải thật, Reserved/Savings Plan cho tải nền ổn định, Spot cho batch. ② Dữ liệu: lifecycle S3, xoá snapshot cũ, retention log thay vì giữ vô hạn. ③ Kiến trúc: cache ở biên (CloudFront), tránh NAT Gateway cho traffic nội bộ AWS, dùng endpoint.",
    trap: "Câu này là câu phân biệt người đọc blog với người từng nhìn hoá đơn." },
  { t: "aws", lv: "core", q: "VPC cơ bản: public subnet khác private subnet thế nào?",
    a: "Public subnet có route ra Internet Gateway và instance có thể có public IP. Private subnet không có route trực tiếp ra internet — muốn ra ngoài phải qua NAT Gateway, và vẫn nhận được traffic vào qua ALB. DB nên nằm ở private subnet.",
    trap: "Nói 'public subnet là subnet có internet' là chưa đủ — cái quyết định là route table." },
  { t: "aws", lv: "deep", q: "Khi nào dùng SQS, và DLQ để làm gì?",
    a: "Khi cần tách producer khỏi consumer, chịu được tải đỉnh, retry tự động. <b>DLQ</b> nhận message thất bại sau N lần thử, để không mất dữ liệu và để người vận hành xử lý riêng. Chuẩn: SQS chuẩn (at-least-once) → consumer phải <b>idempotent</b>.",
    trap: "At-least-once nghĩa là có thể trùng — nếu consumer không idempotent thì payment sẽ trừ tiền hai lần." },

  /* ---------------- VUE ---------------- */
  { t: "vue", lv: "core", q: "ref khác reactive thế nào?",
    a: "<code>ref</code> bọc một giá trị bất kỳ (kể cả primitive) và truy cập qua <code>.value</code> trong JS; <code>reactive</code> bọc object và truy cập trực tiếp nhưng <b>không</b> dùng được với primitive, và mất reactivity nếu bạn destructure. Thực tế: dùng <code>ref</code> mặc định, <code>reactive</code> cho object nhiều trường.",
    trap: "Quên <code>.value</code> là lỗi đầu tiên của mọi người mới học Vue." },
  { t: "vue", lv: "core", q: "computed khác watch và watchEffect thế nào?",
    a: "<code>computed</code> sinh ra <b>giá trị</b> dẫn xuất, có cache, chỉ tính lại khi dependency đổi. <code>watch</code> chạy <b>side effect</b> khi một nguồn cụ thể đổi, có old/new value. <code>watchEffect</code> tự thu thập dependency và chạy ngay lần đầu. Quy tắc: cần giá trị → computed; cần hành động → watch.",
    trap: "Dùng watch để tính một giá trị hiển thị là anti-pattern — phải dùng computed." },
  { t: "vue", lv: "core", q: "v-model trên component hoạt động thế nào?",
    a: "Là cú pháp đường cho <code>:modelValue</code> + <code>@update:modelValue</code>. Trong Vue 3.4+ dùng <code>defineModel()</code> để khai báo gọn. Có thể đặt tên: <code>v-model:title</code> → prop <code>title</code>, event <code>update:title</code>.",
    trap: "Trả lời 'v-model là binding hai chiều' mà không nói prop/event là chưa đủ độ sâu." },
  { t: "vue", lv: "core", q: "Pinia khác NgRx/Redux ở đâu?",
    a: "Cùng mô hình tập trung state, nhưng Pinia không cần action type, reducer thuần hay boilerplate: state là một hàm trả object, getters là computed, actions là hàm async sửa state trực tiếp. Có devtools, SSR, TypeScript tốt. Bạn đã làm NgRx nên phần khái niệm không mới — chỉ là ít nghi lễ hơn.",
    trap: "Câu này là chỗ bạn chuyển từ Angular sang Vue tự tin nhất — nói đúng chỗ đó." },
  { t: "vue", lv: "core", q: "vòng đời Vue tương ứng gì bên React?",
    a: "<code>onMounted</code> ≈ useEffect deps [] chạy sau render đầu; <code>onUpdated</code> ≈ effect không deps; <code>onUnmounted</code> ≈ hàm cleanup trong useEffect. Vue chạy <b>sau</b> khi DOM đã cập nhật, nên đọc kích thước phần tử trong onMounted là an toàn.",
    trap: "Nói 'onMounted là constructor' là sai — setup() mới là chỗ chạy trước render." },
  { t: "vue", lv: "core", q: "v-if khác v-show thế nào?",
    a: "<code>v-if</code> thêm/xoá khỏi DOM, có chi phí tạo lại component và chạy lại hook; <code>v-show</code> chỉ đổi <code>display:none</code>, giữ nguyên DOM và state. Dùng v-show cho thứ bật/tắt liên tục (dropdown, tab), v-if cho thứ ít đổi hoặc cần giải phóng tài nguyên.",
    trap: "Đừng đặt v-if và v-for trên cùng một element: trong Vue 3 <b>v-if có độ ưu tiên cao hơn v-for</b> (ngược hẳn Vue 2), nên điều kiện bị đánh giá trước khi có item. Trả lời an toàn: tách ra, hoặc dùng computed lọc danh sách trước." },
  { t: "vue", lv: "deep", q: "Vì sao phải có :key trong v-for?",
    a: "Key cho Vue biết phần tử nào là phần tử nào khi danh sách đổi thứ tự, để patch đúng DOM node thay vì dùng lại sai vị trí. Dùng index làm key chỉ an toàn khi danh sách không đổi thứ tự và không chèn/xoá ở giữa.",
    trap: "Key trùng nhau gây lỗi render khó tìm — hay gặp khi hai nguồn dữ liệu có id trùng." },
  { t: "vue", lv: "core", q: "Chặn route chưa đăng nhập thế nào?",
    a: "Dùng navigation guard <code>router.beforeEach((to) => ...)</code>, kiểm tra <code>to.meta.requiresAuth</code> và trả về <code>'/login'</code> để chuyển hướng. Guard chạy trước khi component được render nên không bị nháy nội dung.",
    trap: "Chỉ ẩn menu mà không chặn route là lỗi bảo mật — API vẫn phải kiểm quyền lần nữa." },
  { t: "vue", lv: "deep", q: "Bạn chưa viết Vue production — vì sao vẫn nhận được việc này?",
    a: "Nói đúng, không phóng đại: 'Em viết React/Next và Angular/NgRx. Phần khó của Vue với em là cú pháp chứ không phải mô hình — Pinia tương đương NgRx, ref/computed/watch ánh xạ 1-1 sang useState/useMemo/useEffect. Em đã dựng thử một CRUD Vue 3 + Pinia + Vue Router để kiểm tra đúng điều đó.' Rồi đưa repo.",
    trap: "Đừng nói 'em học nhanh'. Hãy nói cái bạn đã làm để kiểm chứng." },
  { t: "vue", lv: "core", q: "Composition API khác Options API thế nào, và nên dùng cái nào?",
    a: "Options API chia code theo loại (data/methods/computed); Composition API gom theo <b>tính năng</b>, tái sử dụng logic bằng composable (<code>useX()</code>) thay vì mixin. Vue 3 khuyến nghị Composition API + <code>&lt;script setup&gt;</code>; codebase mới nên theo hướng này.",
    trap: "Nói 'Options API là cũ nên bỏ' là quá tay — nhiều codebase lớn vẫn chạy tốt với nó." },

  /* ---------------- REACT ---------------- */
  { t: "react", lv: "core", q: "useState khác useRef thế nào?",
    a: "<code>useState</code> gây render lại khi đổi; <code>useRef</code> giữ giá trị qua các lần render <b>mà không</b> gây render. Dùng ref để giữ timer id, DOM node, hoặc giá trị 'previous'. Đọc/ghi ref trong lúc render là anti-pattern.",
    trap: "Dùng ref cho dữ liệu cần hiển thị → UI không cập nhật. Lỗi rất hay gặp." },
  { t: "react", lv: "core", q: "useEffect: dependency và cleanup?",
    a: "Effect chạy sau render khi deps đổi; <code>[]</code> = một lần sau mount; không có mảng = mọi render. Cleanup chạy trước lần chạy kế tiếp và khi unmount — dùng để huỷ subscription, clear timer, abort request. Thiếu deps → stale closure; thêm object/function vào deps → chạy vô hạn nếu không memo.",
    trap: "Đây là câu hỏi phân loại số 1 ở React. Trả lời được 'stale closure' là qua." },
  { t: "react", lv: "deep", q: "Khi nào useMemo/useCallback thật sự cần?",
    a: "Khi phép tính đắt, hoặc khi reference ổn định là điều kiện để effect không chạy lại, hoặc khi truyền prop xuống component đã <code>memo()</code>. Không phải mặc định — bọc mọi thứ làm code khó đọc mà lợi ích gần bằng 0.",
    trap: "Trả lời 'dùng để tối ưu hiệu năng' mà không nêu điều kiện cụ thể là câu trả lời học thuộc." },
  { t: "react", lv: "deep", q: "'Stale closure' là gì?",
    a: "Callback giữ biến từ lần render cũ. Ví dụ setInterval tạo một lần với <code>count = 0</code> sẽ mãi thấy 0. Sửa: dùng functional update <code>setCount(c =&gt; c + 1)</code>, hoặc đưa biến vào deps, hoặc giữ giá trị mới nhất trong ref.",
    trap: "Câu này chỉ trả lời trôi chảy được nếu đã thật sự debug React." },
  { t: "react", lv: "core", q: "Controlled hay uncontrolled input?",
    a: "Controlled: giá trị nằm trong state, React là nguồn sự thật duy nhất → validate/format ngay được, nhưng mỗi lần gõ là một render. Uncontrolled: DOM giữ giá trị, đọc qua ref → hợp form lớn hoặc file input. Vue v-model chính là controlled.",
    trap: "File input luôn uncontrolled — không set value được vì lý do bảo mật." },
  { t: "react", lv: "core", q: "Vì sao component render lại?",
    a: "State hoặc props đổi; cha render lại (con render theo trừ khi <code>memo</code>); context mà nó đọc đổi; hoặc hook nội bộ đổi. Không phải 'cứ setState là render' — React bail out nếu state không đổi (Object.is).",
    trap: "Nói 'React render lại toàn bộ cây' là sai — nó render lại nhánh bị ảnh hưởng." },
  { t: "react", lv: "core", q: "Context có thay được store không?",
    a: "Context là cơ chế <b>truyền</b> giá trị, không phải quản lý state: mọi consumer render lại khi value đổi, không có selector, không có devtools, không có middleware. Vài giá trị ít đổi (theme, auth) thì đủ; state nghiệp vụ nhiều và cập nhật liên tục thì dùng Zustand/Redux.",
    trap: "Đây là câu so sánh Vue↔React hay gặp: Pinia ≈ store, provide/inject ≈ context." },
  { t: "react", lv: "deep", q: "React 19 có gì đáng chú ý?",
    a: "<b>Actions</b> (dùng async function trực tiếp trong form/transition, có pending state tự động), hook <code>use()</code> để đọc promise/context, <code>useOptimistic</code> cho cập nhật lạc quan, và ref là prop thường (không cần forwardRef). Nếu chưa dùng thật, nói rõ 'em biết ở mức đọc tài liệu'.",
    trap: "Đừng khoe tính năng bạn chưa chạm — người phỏng vấn sẽ hỏi tiếp một câu cụ thể." },

  /* ---------------- PYTHON / FASTAPI ---------------- */
  { t: "py", lv: "core", q: "FastAPI dependency injection dùng để làm gì?",
    a: "Khai báo <code>Depends()</code> cho thứ cần dùng chung: DB session, user hiện tại, cấu hình. Framework tự tạo/huỷ theo vòng đời request, tự cache trong một request, và cho phép override khi test. Đây là chỗ đặt kiểm tra quyền gọn nhất.",
    trap: "Mở session DB ở tầng module thay vì dependency → leak connection khi lỗi." },
  { t: "py", lv: "deep", q: "Khi nào async không giúp gì?",
    a: "Khi công việc là CPU-bound (tính toán nặng) hoặc khi bạn gọi thư viện đồng bộ bên trong <code>async def</code> — nó chặn cả event loop. Xử lý: dùng <code>run_in_threadpool</code> cho I/O đồng bộ, hoặc process pool cho CPU-bound.",
    trap: "Gọi <code>requests</code> trong async def là lỗi kinh điển — phải dùng httpx/async client." },
  { t: "py", lv: "core", q: "Pydantic lo gì trong FastAPI?",
    a: "Parse + validate request, serialize response, sinh JSON Schema cho OpenAPI. Type hint chính là hợp đồng: sai kiểu là 422 tự động, không cần if-else kiểm tra. Dùng model riêng cho input và output để không lộ field nội bộ.",
    trap: "Trả response bằng ORM object trực tiếp dễ lộ field nhạy cảm — luôn có response_model." },
  { t: "py", lv: "deep", q: "N+1 query trong SQLAlchemy — nhận ra và sửa thế nào?",
    a: "Nhận ra bằng log SQL (thấy hàng trăm câu giống nhau) hoặc số query tăng theo số bản ghi. Sửa bằng eager loading: <code>selectinload</code>/<code>joinedload</code> cho quan hệ, hoặc một câu join. Đo bằng cách đếm query trong test.",
    trap: "Lazy loading mặc định rất tiện ở dev và rất chậm ở production — đây là câu hỏi thực chiến." },
  { t: "py", lv: "core", q: "Fixture trong pytest để làm gì?",
    a: "Dựng và dọn tài nguyên cho test (DB tạm, client, dữ liệu mẫu) theo phạm vi function/module/session, có teardown tự động. Kèm <code>parametrize</code> để chạy cùng logic trên nhiều input.",
    trap: "Fixture phạm vi session mà sửa dữ liệu → test phụ thuộc thứ tự. Test phải độc lập." },
  { t: "py", lv: "deep", q: "GIL ảnh hưởng gì tới service Python của bạn?",
    a: "Một process chỉ chạy một thread Python tại một thời điểm → CPU-bound không nhanh hơn khi thêm thread. I/O thì vẫn tốt vì nhả GIL khi chờ. Vì vậy: async/thread cho I/O, process pool hoặc nhiều worker cho CPU.",
    trap: "Nói 'Python không đa luồng' là sai — nó đa luồng, chỉ không song song CPU." },

  /* ---------------- THIẾT KẾ ---------------- */
  { t: "sys", lv: "deep", q: "Thiết kế luồng upload file cho ứng dụng nhiều tenant.",
    a: "Client xin presigned PUT từ API → API kiểm quyền và giới hạn dung lượng/loại file → trả URL có key theo <code>tenant/&lt;id&gt;/&lt;uuid&gt;</code> → client PUT thẳng lên S3 → client báo API để lưu metadata (kích thước, mime, checksum) → worker quét virus/kiểm tra. Prefix theo tenant để dễ phân quyền và tính chi phí.",
    trap: "Không kiểm tra content-type ở server và không giới hạn dung lượng trước khi ký = bị lạm dụng." },
  { t: "sys", lv: "deep", q: "Làm sao đảm bảo API thanh toán không trừ tiền hai lần?",
    a: "Idempotency key do client sinh, server lưu (bảng riêng, unique constraint) và trả lại kết quả cũ nếu key lặp; cộng với trạng thái giao dịch có máy trạng thái rõ (pending → success/failed), và khóa lạc quan để tránh cập nhật đè. Bạn đã làm đúng mô hình này ở Crossedutech — kể bằng ví dụ đó.",
    trap: "Chỉ nói 'dùng transaction' là chưa đủ: retry của client vẫn tạo giao dịch mới." },
  { t: "sys", lv: "core", q: "Rate limiting đặt ở đâu?",
    a: "Ở biên: API Gateway throttling, hoặc WAF, hoặc middleware dùng Redis (sliding window/token bucket) khi cần giới hạn theo user/tenant. Giới hạn theo API key cho đối tác, theo user cho người dùng cuối, luôn trả 429 kèm Retry-After.",
    trap: "Rate limit trong process đơn lẻ không có tác dụng khi scale ngang — phải dùng store chung." },
  { t: "sys", lv: "deep", q: "Cache: đặt ở đâu và làm sao tránh dữ liệu cũ?",
    a: "Đặt ở biên (CloudFront) cho nội dung công khai, ở tầng ứng dụng (Redis) cho dữ liệu đọc nhiều. Tránh dữ liệu cũ bằng TTL ngắn + chủ động invalidation khi ghi, hoặc cache-aside với version key. Chấp nhận nhất quán cuối ở chỗ không ảnh hưởng tiền và quyền.",
    trap: "Cache không có chiến lược xoá là bug chờ ngày bung. Luôn nói được 'khi nào xoá'." },
  { t: "sys", lv: "deep", q: "Thiết kế hệ thống RAG cho tài liệu nội bộ — các tầng chính?",
    a: "① Ingest: parse → chunk theo cấu trúc → embed → lưu vector + metadata (tenant, nguồn, phiên bản). ② Truy vấn: hybrid search (BM25 + dense) → rerank → đóng gói ngữ cảnh có trích nguồn. ③ Sinh: LLM trả lời <b>kèm trích dẫn</b>, từ chối khi không có căn cứ. ④ Đo: eval set, độ trễ và chi phí theo route. Bạn đã làm đúng vòng này ở UniGuide.",
    trap: "Không có tầng đo (eval + cost) thì không thể cải tiến — đây là điểm khác biệt của bạn." },
  { t: "sys", lv: "core", q: "Log, metric, trace khác nhau và bạn dùng cái nào để tìm lỗi?",
    a: "Log = sự kiện chi tiết; metric = số tổng hợp theo thời gian (phát hiện bất thường); trace = đường đi một request qua nhiều service (tìm chỗ chậm). Quy trình: alarm từ metric → xem trace để khoanh vùng → đọc log có trace id để biết nguyên nhân.",
    trap: "Không có correlation id trong log thì trace vô dụng — đây là việc phải làm từ đầu." },

  /* ---------------- HÀNH VI ---------------- */
  { t: "be", lv: "core", q: "Kể một sự cố production do chính bạn gây ra.",
    a: "Chọn thật, nêu: nguyên nhân gốc, thiệt hại, cách bạn phát hiện, cách sửa, và <b>thay đổi hệ thống</b> để không lặp lại (test, alarm, review, feature flag). Điều người ta chấm là quy trình sau sự cố, không phải việc bạn hoàn hảo.",
    trap: "Nói 'em chưa từng gây sự cố' là mất điểm — hoặc bạn chưa làm thật, hoặc bạn không nhận ra." },
  { t: "be", lv: "core", q: "Bất đồng kỹ thuật với leader — bạn xử lý thế nào?",
    a: "Nêu trade-off bằng dữ liệu chứ không bằng ý kiến, đề xuất thử nghiệm nhỏ để có bằng chứng, và chấp nhận quyết định sau khi đã nói rõ rủi ro. Ghi lại quyết định để sau này đối chiếu.",
    trap: "Kể chuyện 'em thắng' hoặc 'em im lặng' đều là tín hiệu xấu." },
  { t: "be", lv: "core", q: "Deadline không kịp — bạn làm gì?",
    a: "Báo sớm khi còn cửa xoay, kèm 2-3 phương án (cắt phạm vi, giảm chất lượng ở chỗ nào, thêm người), để người quyết định chọn. Không âm thầm trượt hạn.",
    trap: "Câu này kiểm tra bạn có dám mang tin xấu lên hay không." },
  { t: "be", lv: "core", q: "Bạn học công nghệ mới thế nào? (áp cho Vue)",
    a: "Nêu quy trình thật: đọc mô hình trước cú pháp, ánh xạ sang thứ đã biết, rồi dựng một artifact nhỏ có tiêu chí hoàn thành. Ví dụ đang làm: CRUD Vue 3 + Pinia + Router, vì Vue không có gì mới về kiến trúc so với NgRx.",
    trap: "Đừng nói 'em đọc docs'. Hãy nói cái bạn đã dựng và cách bạn biết nó đúng." },
  { t: "be", lv: "core", q: "Vì sao công ty này?",
    a: "Nêu thứ chỉ đọc site mới biết: hạ tầng cloud + DC + bảo mật cho doanh nghiệp Việt; sản phẩm trải từ Cloud GPU, container, cloud database tới SOC; tuân thủ Luật 91/2025 và Nghị định 356/2025 về dữ liệu cá nhân; có lộ trình chứng chỉ AWS. Rồi nối với bạn: muốn làm trên hạ tầng thật, và phần đo chi phí/observability bạn đã có.",
    trap: "Nói 'em thích cloud' là câu ai cũng nói được." },
  { t: "be", lv: "core", q: "Mức lương mong muốn?",
    a: "JD ghi 25–50tr <b>net</b>, công ty chịu BHXH/BHYT/BHTN và thuế TNCN. Hỏi lại band cho 'chuyên viên 2+ năm' trước; nếu buộc nêu số, chọn trong khoảng và gắn với bằng chứng (Python + TS + AI/RAG có đo chi phí + payment). Nhắc rõ net khác gross.",
    trap: "So 50tr net với 50tr gross ở chỗ khác mà không quy đổi là sai một khoản rất lớn." },

  /* ---------------- BỔ SUNG SAU REVIEW ---------------- */
  { t: "aws", lv: "deep", q: "Đưa một container FastAPI lên ECS Fargate thì cần những gì?",
    a: "① Dockerfile multi-stage, image nhỏ; ② push lên <b>ECR</b>; ③ task definition: image tag, CPU/RAM, biến môi trường, log driver <code>awslogs</code>, task role; ④ service + ALB target group + health check; ⑤ deploy = revision mới + rolling update; rollback = trỏ về revision cũ. Nối CI/CD: build → test → image → ECR → update service.",
    trap: "Quên <b>health check path</b> là lỗi hay gặp: ALB đánh dấu task không khoẻ và vòng deploy quay mãi." },
  { t: "aws", lv: "deep", q: "API Gateway đã xác thực JWT rồi, FastAPI có phải kiểm lại không?",
    a: "Có. Gateway chỉ biết <b>token hợp lệ</b>, không biết user đó được làm gì. FastAPI vẫn phải kiểm quyền nghiệp vụ: scope, tenant, vai trò, quyền trên đúng bản ghi. Token hết hạn hoặc sai chữ ký bị chặn ở gateway (401) trước khi tới app — đó là phần gateway lo.",
    trap: "Nói 'gateway lo auth xong rồi' là lỗ hổng phân quyền — interviewer của một công ty bảo mật sẽ bắt ngay." },
  { t: "aws", lv: "core", q: "Secret (DB password, API key) để ở đâu?",
    a: "SSM Parameter Store (SecureString) hoặc Secrets Manager khi cần tự xoay vòng; inject vào task/env hoặc đọc lúc khởi động, không commit vào repo. Secrets Manager có rotation tự động cho RDS — đó là lý do nó đắt hơn Parameter Store.",
    trap: "<code>chmod 600 .env</code> không đủ trên máy dùng chung: ai vào được host cũng đọc được. Đây là câu hỏi an ninh, không phải câu hỏi cấu hình." },
  { t: "aws", lv: "deep", q: "Container ở private subnet cần pull image từ ECR và ghi log — cần gì?",
    a: "Interface endpoints (PrivateLink) cho <code>ecr.api</code>, <code>ecr.dkr</code>, <code>logs</code>; layer của ECR nằm trên S3 nên cần thêm <b>S3 gateway endpoint</b>. Thiếu một cái là task kẹt ở PROVISIONING hoặc không có log.",
    trap: "Câu rất thực chiến — dựng VPC private mà quên endpoint thì im lặng, không có lỗi rõ ràng để đọc." },
  { t: "aws", lv: "deep", q: "Làm sao để một thay đổi hạ tầng CloudFormation lùi được?",
    a: "Review <b>change set</b> trước khi apply; bật <b>termination protection</b> cho stack và <code>DeletionPolicy: Retain</code> cho DB/bucket để xoá stack không mất dữ liệu; stack tự rollback khi tạo resource thất bại. Và không sửa tay trên console — đó là drift, lần deploy sau sẽ ghi đè hoặc lỗi.",
    trap: "Nói 'apply rồi sửa lại template' chưa phải chiến lược rollback: update có thể đã xoá resource trước khi bạn kịp sửa." },
  { t: "be", lv: "core", q: "Nhận alarm lúc 3h sáng, bạn làm gì trước?",
    a: "① Khoanh phạm vi: dashboard, tỉ lệ lỗi, bao nhiêu user bị ảnh hưởng. ② Xem <b>deploy gần nhất</b> — phần lớn sự cố đêm đến từ thay đổi vừa lên. ③ Đọc log/trace theo correlation id. ④ <b>Giảm thiệt hại trước</b> (rollback, feature flag, tăng tài nguyên), tìm nguyên nhân sau. ⑤ Viết timeline khi còn nhớ.",
    trap: "JD ghi rõ có trực ca — câu này chắc chắn được hỏi, và họ muốn nghe thứ tự ưu tiên, không phải danh sách công cụ." }
],

star: [
  { title: "Real Estate Chatbot & CRM — sở hữu đầu-cuối",
    s: "Sản phẩm cần chatbot có căn cứ dữ liệu, gắn với dự án, khách và lead.",
    t: "Một mình làm từ kiến trúc tới triển khai.",
    a: "Next.js/TypeScript cho UI, FastAPI cho AI, Firebase Auth/Firestore + PostgreSQL, role-aware flows, đồng bộ số điện thoại sang lead thời gian thực.",
    r: "Luồng client/sales chạy được, có kiểm tra hồi quy cho câu trả lời.",
    serves: "JD bullet 1: tính năng đầu-cuối" },
  { title: "UniGuide AI v2 — đo chất lượng và chi phí",
    s: "Câu trả lời RAG không có căn cứ thì không dùng được.",
    t: "Làm cho câu trả lời kiểm chứng được và biết tốn bao nhiêu.",
    a: "BM25 + dense, cross-encoder rerank, provenance-aware packing, LangGraph; định tuyến model theo chi phí/độ trễ; evidence-anchor/NLI check; eval harness; log chi phí theo từng route.",
    r: "Giảm câu trả lời không có căn cứ; có số liệu độ trễ và chi phí để quyết định.",
    serves: "JD bullet 6: log, chỉ số, chi phí" },
  { title: "Rental Management — API, RBAC, CI/CD",
    s: "Cần hệ quản lý thuê nhà nhiều vai trò.",
    t: "Thiết kế API và quyền.",
    a: "Django/DRF, model PostgreSQL, 3 vai trò Admin/Landlord/Tenant, hoá đơn tiện ích, workflow duyệt; React/TS + AntD; GitHub Actions; Render/Vercel + Neon.",
    r: "Deploy được cả hai đầu, phân quyền ở tầng API chứ không chỉ ẩn nút.",
    serves: "JD bullet 2, 5" },
  { title: "Kintai Attendance — dự án cá nhân: test và container",
    s: "Dự án cá nhân về chấm công và tính lương; cần các luật tăng ca/ca đêm được tính đúng.",
    t: "Làm phần tính toán đúng và có test.",
    a: "Spring Boot/MyBatis, JWT/RBAC, Docker Compose, Testcontainers, xuất CSV Shift_JIS, i18n JP/EN.",
    r: "Logic lương có test tích hợp chạy trên container thật.",
    serves: "JD bullet 5: test, review" },
  { title: "Crossedutech — payment flow production",
    s: "Sản phẩm fintech Thái Lan, lỗi giao dịch là lỗi tiền.",
    t: "Làm luồng nạp tiền chịu được trạng thái dở dang.",
    a: "Riverpod, trạng thái loading/pending/success/failure/retry, validation giao dịch, Patrol E2E cho luồng tiền, review code, gỡ lỗi sát release.",
    r: "Luồng tiền có phủ E2E trước khi release.",
    serves: "JD bullet 7: xử lý lỗi theo phản hồi" },
  { title: "Jinjer HRM — frontend dashboard production",
    s: "Rikkeisoft, tháng 08/2023–04/2024: Jinjer HRM và AKAS Bank là hai sản phẩm em làm frontend.",
    t: "Dashboard nhân sự, bảng chấm công và biểu đồ dữ liệu HR cho khách Nhật.",
    a: "React, Redux/Saga giữ trạng thái request riêng với UI state, Recharts/Highcharts vẽ trend và ngưỡng, Ant Design cho form tái sử dụng, React Hook Form/Yup kiểm tra dữ liệu ở client.",
    r: "HR nhìn overtime vượt ngưỡng trước khi chốt payroll; bảng dày dùng phân trang phía server để màn hình không lag.",
    serves: "JD bullet 1: tính năng đầu-cuối" }
],

intro: {
  structure: [
    { beat: "1", name: "Bạn là ai", secs: "5–8 giây", why: "Người phỏng vấn cần một cái khung để gắn mọi câu sau vào. Không có câu này thì mọi thứ sau đó rời rạc.", say: "Em là Đạt, làm fullstack hai năm, mạnh nhất ở Python/FastAPI phía backend và TypeScript phía frontend." },
    { beat: "2", name: "Bằng chứng", secs: "25–40 giây", why: "Đây là phần quyết định. Phải có một kết quả đo được hoặc một quyết định kỹ thuật cụ thể — không phải danh sách công nghệ.", say: "Gần nhất em xây một hệ RAG cho tư vấn tuyển sinh; phần em làm kỹ nhất không phải mô hình mà là vòng đo — log chi phí theo từng route và eval để biết một thay đổi làm câu trả lời tốt lên hay tệ đi." },
    { beat: "3", name: "Nối với họ", secs: "10–15 giây", why: "Cho họ biết bạn không đọc JD của 20 công ty. Nối bằng thứ chỉ đọc site của họ mới biết.", say: "Em ứng tuyển vì muốn làm trực tiếp trên hạ tầng cloud — và ở đây cloud vừa là sản phẩm vừa là thứ công ty tự vận hành, nên em học được cả hai phía." },
    { beat: "4", name: "Mở cửa", secs: "5 giây", why: "Kết thúc bằng một câu mời hỏi, để buổi nói chuyện thành hai chiều thay vì bạn độc thoại.", say: "Phần em muốn đào sâu trong buổi này là hạ tầng và Vue — anh/chị muốn em kể chi tiết phần nào trước?" }
  ],
  vn45: "Em là Đạt, làm fullstack hai năm, mạnh nhất ở Python/FastAPI phía backend và TypeScript phía frontend. Gần nhất em xây một hệ RAG cho tư vấn tuyển sinh — phần em tự hào nhất không phải mô hình mà là vòng đo: em log chi phí theo từng route và dựng eval để biết thay đổi nào thật sự làm câu trả lời tốt lên. Trước đó em làm luồng thanh toán cho một sản phẩm fintech ở Thái Lan. Ở Rikkeisoft em làm frontend React cho Jinjer HRM — dashboard, biểu đồ dữ liệu và form tái sử dụng cho khách Nhật.",
  vn90: "Em là Đạt, làm fullstack hai năm, mạnh nhất ở Python/FastAPI phía backend và TypeScript phía frontend. Hai năm gần đây em làm sản phẩm AI có người dùng thật: em xây một hệ RAG cho tư vấn tuyển sinh, trong đó phần em làm kỹ nhất là vòng đo — em log chi phí theo từng route, dựng eval để biết một thay đổi làm câu trả lời tốt lên hay tệ đi, và đó là thứ giúp em sửa hệ thống bằng dữ liệu thay vì bằng cảm giác. Trước đó em làm fintech ở Thái Lan với luồng nạp tiền có trạng thái pending, success, failure, retry và test end-to-end, nên em quen với việc lỗi ở luồng tiền phải xử lý khác lỗi thường. Ở Rikkeisoft em làm frontend React cho Jinjer HRM và AKAS Bank: dashboard nhân sự, biểu đồ dữ liệu HR và form tái sử dụng; em chưa có AWS production và đang tự dựng S3, EC2, Lambda trên sandbox từng bước. Em ứng tuyển vị trí này vì muốn làm trực tiếp trên hạ tầng cloud, và vì ở đây cloud vừa là sản phẩm vừa là thứ công ty tự vận hành.",
  en: "I'm Dat, a fullstack engineer with two years of experience, strongest in Python and FastAPI on the backend and TypeScript on the frontend. Most recently I built a retrieval-augmented system for university admissions advice — what I'm proudest of isn't the model, it's the measurement loop: I logged cost per route and built an eval harness so every change could be judged on evidence rather than intuition. Before that I worked on a payment flow for a fintech product in Thailand, where transactions move through pending, success, failure and retry states with end-to-end coverage. At Rikkeisoft I worked on the React frontend for Jinjer HRM and AKAS Bank — HR dashboards, data charts and reusable forms. I do not have AWS production experience and am building S3, EC2 and Lambda on a sandbox step by step. I'm applying because I want to work directly on cloud infrastructure, and here cloud is both the product and something the company runs itself.",
  followups: [
    { q: "Kể sâu hơn về dự án RAG đó.", a: "Đừng kể lại toàn bộ. Chọn một quyết định: 'Vấn đề là câu trả lời không có căn cứ. Em làm ba việc: hybrid search vì chỉ vector thì mất từ khoá chính xác, rerank vì top-k thô còn nhiễu, và bắt buộc trích nguồn. Sau đó em đo bằng eval set và log chi phí từng route — nhờ vậy em biết rerank đắt nhưng đáng.' Rồi dừng, để họ hỏi tiếp." },
    { q: "Bạn mạnh nhất ở đâu?", a: "Nêu một thứ và chứng minh bằng kết quả: 'Backend Python và phần đo lường. Em làm hệ thống sao cho biết được nó đang tốn bao nhiêu và sai ở đâu — cái đó em áp dụng được ngay vào observability cho hạ tầng.' Không nói 'em học nhanh'." },
    { q: "Bạn chưa có kinh nghiệm Vue production.", a: "Thừa nhận, rồi chuyển: 'Đúng, em chưa viết Vue production. Em viết React/Next và Angular/NgRx — Pinia tương đương NgRx, ref/computed/watch ánh xạ 1-1 sang useState/useMemo/useEffect. Em dựng thử một CRUD Vue 3 + Pinia + Router để kiểm tra đúng điều đó, đây là repo.'" },
    { q: "Vì sao rời chỗ cũ?", a: "Hướng tới, không nói xấu: 'Em muốn làm trên hạ tầng thật ở quy mô thật. Ở vị trí hiện tại em chủ yếu deploy lên PaaS, còn phần hạ tầng và vận hành thì em chưa được chạm.'" },
    { q: "Bạn biết gì về AWS?", a: "Nói đúng khoảng trống: em chưa có AWS production và chưa tự dựng S3/EC2/Lambda từ đầu. Em học trên sandbox theo thứ tự bucket private và presigned URL có kiểm quyền, máy chủ container, rồi hàm xử lý sự kiện; mỗi bước đều làm kiểm tra và log chi phí theo thói quen per-route từ UniGuide. Phần đã làm thật là PostgreSQL, container cục bộ và CI/CD." }
  ],
  avoid: [
    "Liệt kê cả 7 dự án trong 90 giây — người nghe không nhớ gì và bạn mất phần sâu.",
    "Nói 'em học nhanh' hoặc 'em nhiệt tình' — hai câu này không có bằng chứng nào phía sau.",
    "Nói mơ hồ về AWS — nói đúng khoảng trống: chưa có AWS production, đang tự dựng S3/EC2/Lambda trên sandbox từng bước.",
    "Đọc thuộc như bài văn — dấu hiệu rõ nhất của người chưa hiểu nội dung mình đang nói.",
    "Nói xấu công ty cũ, kể cả khi được hỏi thẳng.",
    "Mở đầu bằng 'Em tên là..., sinh năm..., quê ở...' — đó là CV, không phải câu trả lời."
  ],
  drill: "Bấm đồng hồ 90 giây, nói thành tiếng, ghi âm. Nghe lại và chỉ chấm hai điểm: (1) có một con số hoặc hành động cụ thể không, (2) có câu nào bạn không giải thích được khi bị hỏi tiếp không. Câu nào không giải thích được thì cắt bỏ — không phải học thuộc thêm."
},

contract: [
  ["Tên pháp nhân trên hợp đồng", "Phải là Công ty CP Giải pháp Công nghệ và Phần mềm Phổ Tuệ — MST 0318222903"],
  ["Lương net hay gross", "JD ghi net; phải thấy đúng câu đó trong hợp đồng"],
  ["Ai chịu BHXH/BHYT/BHTN + thuế TNCN", "Ghi rõ trong hợp đồng, không chỉ nói miệng"],
  ["Thử việc", "2 tháng, hưởng 100% lương"],
  ["Trực hệ thống theo ca", "Lịch ca, phụ cấp ca, ai chịu escalation ngoài giờ"],
  ["Xét lương 2 lần/năm", "Đưa vào văn bản hoặc email xác nhận"],
  ["Tài trợ chứng chỉ AWS", "Điều kiện, thời gian cam kết, có ràng buộc hoàn tiền không"],
  ["Thưởng", "Cấu trúc tháng 13 / thưởng hiệu suất, không chỉ 'có không'"]
],

askThem: [
  "Đội Software đang chạy workload chủ yếu trên dịch vụ AWS nào, và có dùng CloudFormation hay CDK?",
  "Tỉ lệ công việc giữa dự án mới và bảo trì hệ thống đang chạy là bao nhiêu?",
  "Vị trí này trực hệ thống theo ca thế nào — luân phiên ra sao, phụ cấp ca tính thế nào?",
  "Sáu người được tuyển cho vị trí này nằm ở những nhóm sản phẩm nào?",
  "Lộ trình chứng chỉ AWS của công ty: thi trong 6 tháng đầu có khả thi không?"
]
};
