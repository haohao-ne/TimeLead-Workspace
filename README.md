🎨 Hướng dẫn Kích hoạt Workspace Cá Nhân
Chào bạn! Đây là bộ công cụ quản lý công việc tối ưu cho Designer. Để sở hữu bản riêng, bạn chỉ cần làm theo 3 bước "mì ăn liền" sau:

🛠 Bước 1: Tạo Database riêng (Supabase)
Dữ liệu của bạn sẽ do chính bạn quản lý, cực kỳ bảo mật:

Truy cập Supabase.com và tạo một Project mới (miễn phí).

Vào mục SQL Editor (biểu tượng >_ bên trái).

Dán đoạn mã dưới đây vào và bấm Run:

SQL
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  starttime text,
  duedate text,
  status text,
  priority text,
  creator_name text,
  pics text[] default '{}',
  client text,
  actualtime int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
🚀 Bước 2: Deploy lên Web (Vercel)
Bấm vào nút Deploy (mình đã thiết lập sẵn trong Repo).

Vercel sẽ hỏi 2 biến môi trường, bạn lấy ở mục Project Settings > API trong Supabase:

VITE_SUPABASE_URL: (Copy URL dự án của bạn).

VITE_SUPABASE_ANON_KEY: (Copy mã Anon Key).

🔑 Bước 3: Kích hoạt Tên định danh
Khi mở trang web lần đầu, bạn chỉ cần nhập tên của mình (Ví dụ: TUAN ANH).

Cơ chế: Mọi task bạn tạo sẽ được gắn mã theo tên này. Nếu bạn đổi tên, bạn sẽ bắt đầu một Workspace hoàn toàn mới.

Giao diện: Tối ưu hoàn hảo cho Mobile với Header Slim và Lịch tháng kiểu Outlook.