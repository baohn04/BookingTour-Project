# BookingTour

Nền tảng đặt tour du lịch gồm website dành cho khách hàng và trang quản trị vận hành tour, danh mục, đơn hàng, tài khoản quản trị và phân quyền.

## Tổng quan

Project được tổ chức theo mô hình monorepo:

- `frontend/app`: ứng dụng React dành cho khách hàng và admin.
- `backend`: REST API và realtime server.
- MongoDB: lưu trữ tour, danh mục, đơn hàng, đánh giá, admin và cấu hình hệ thống.

### Tính năng chính

- Duyệt, tìm kiếm và xem chi tiết tour.
- Giỏ hàng và đặt tour.
- Đánh giá tour.
- Thông báo đơn hàng realtime qua Socket.IO.
- Admin dashboard.
- CRUD tour, danh mục, đơn hàng, tài khoản admin và role/permission.
- Đăng nhập, refresh token, đăng xuất, quên và đặt lại mật khẩu.
- Upload hình ảnh qua Cloudinary.
- Gửi email qua SMTP/Nodemailer.

## Tech stack

| Layer | Công nghệ |
| --- | --- |
| Frontend | React 19, React Router, Redux, TanStack React Query, Ant Design, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP cookie |
| Realtime | Socket.IO |
| Media | Cloudinary |
| Email | Nodemailer |

## Yêu cầu môi trường

- Node.js 18+ và npm.
- MongoDB 6+ hoặc MongoDB Atlas.
- Tài khoản Cloudinary nếu cần upload ảnh.
- SMTP account nếu cần chức năng email.

## Cấu trúc thư mục

```text
.
├── backend/
│   ├── api/v1/
│   │   ├── controller/       # Xử lý request
│   │   ├── middlewares/      # Auth, upload
│   │   ├── models/           # Mongoose models
│   │   ├── routes/            # Client/admin routes
│   │   └── sockets/           # Socket.IO handlers
│   ├── config/               # Database và system config
│   ├── helpers/              # JWT, mail, payment, upload, pagination...
│   ├── validates/            # Request validation
│   └── index.ts              # Entry point
└── frontend/app/
    ├── src/components/       # Shared layouts và components
    ├── src/features/         # Các feature theo nghiệp vụ
    ├── src/pages/            # Client/admin pages
    ├── src/services/         # API clients
    ├── src/hooks/            # Custom hooks
    └── src/redux/            # Redux store/actions/reducers
```

## Cài đặt

Clone repository và cài dependencies cho từng package:

```bash
git clone <repository-url>
cd BookingTour-Project

cd backend
npm ci

cd ../frontend/app
npm ci
```

## Cấu hình biến môi trường

### Backend

Tạo file `backend/.env`:

```env
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:3000

MONGO_URL=mongodb://127.0.0.1:27017/booking-tour

ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-another-long-random-secret
TRAVELLAND_SECRET=replace-with-a-cookie-secret

CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

EMAIL_USER=your-smtp-user
EMAIL_PASSWORD=your-smtp-password
```

`PORT=8080` được dùng trong ví dụ để khớp với URL mặc định của frontend. Backend sẽ dùng port `3000` nếu không cấu hình `PORT`.

### Frontend

Tạo hoặc cập nhật `frontend/app/.env`:

```env
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=http://localhost:8080/api/v1/
REACT_APP_SERVER_URL=http://localhost:8080
REACT_APP_TINYMCE_API_KEY=your-tinymce-api-key
```

Không commit secret, API key hoặc thông tin SMTP vào Git. Các file `.env*` nên được đưa vào `.gitignore` theo chính sách của môi trường triển khai.

## Chạy local

Mở hai terminal riêng.

### Backend

```bash
cd backend
npm run dev
```

API mặc định: `http://localhost:8080/api/v1` nếu đã dùng cấu hình ở trên.

### Frontend

```bash
cd frontend/app
npm start
```

Frontend mặc định chạy tại `http://localhost:3000`.

## Build và chạy production

Build backend:

```bash
cd backend
npm run build
npm start
```

Build frontend:

```bash
cd frontend/app
npm run build
```

Thư mục build frontend là `frontend/app/build`. Có thể deploy thư mục này lên static hosting hoặc phục vụ qua reverse proxy/web server. Backend cần được chạy như một Node.js service và phải có kết nối đến MongoDB.

## API overview

Tất cả endpoint hiện được version tại `/api/v1`.

### Client API

| Nhóm | Base path | Mục đích |
| --- | --- | --- |
| Home | `/api/v1/home` | Dữ liệu trang chủ |
| Tours | `/api/v1/tours` | Danh sách, tìm kiếm và chi tiết tour |
| Categories | `/api/v1/categories` | Danh sách danh mục |
| Cart | `/api/v1/cart` | Xử lý dữ liệu giỏ hàng |
| Orders | `/api/v1/order` | Tạo và kiểm tra đơn hàng |
| Reviews | `/api/v1/reviews` | Đọc và tạo đánh giá |

### Admin API

Các route admin bắt đầu bằng `/api/v1/admin`. Ngoại trừ auth/public settings, các nhóm nghiệp vụ được bảo vệ bằng JWT middleware.

| Nhóm | Base path |
| --- | --- |
| Auth | `/api/v1/admin/auth` |
| Dashboard | `/api/v1/admin/dashboard` |
| Categories | `/api/v1/admin/categories` |
| Tours | `/api/v1/admin/tours` |
| Orders | `/api/v1/admin/orders` |
| Roles | `/api/v1/admin/roles` |
| Admin accounts | `/api/v1/admin/account-admin` |
| Admin profile | `/api/v1/admin/info-admin` |
| General settings | `/api/v1/admin/setting` |

## Realtime events

Socket.IO sử dụng cùng server backend:

- Client phát sự kiện `CLIENT_ORDER_SUCCESS` sau khi đặt hàng thành công.
- Server broadcast sự kiện `SERVER_ORDER_SUCCESS` tới các client khác để cập nhật thông báo realtime.

## Scripts

### Backend (`backend`)

- `npm run dev`: chạy development mode bằng Nodemon.
- `npm run build`: compile TypeScript vào `dist`.
- `npm start`: chạy bản build production.
- `npm test`: hiện chưa có test suite được cấu hình.

### Frontend (`frontend/app`)

- `npm start`: chạy development server.
- `npm run build`: tạo production build.
- `npm test`: chạy test bằng React Testing Library/Jest.

## Quy ước phát triển

- Giữ API backward-compatible trong cùng một version; thay đổi breaking nên tạo version API mới.
- Không commit credentials, token, file dump database hoặc dữ liệu khách hàng.
- Validate input ở boundary của API trước khi gọi controller/service.
- Với endpoint admin, luôn kiểm tra authentication và quyền truy cập tương ứng.
- Khi thêm route, cập nhật controller, validation, service/helper liên quan và tài liệu API.
- Trước khi mở pull request, chạy build backend, build frontend và test liên quan.

## Troubleshooting

### Frontend gọi sai backend

Kiểm tra `REACT_APP_API_URL`, `REACT_APP_SERVER_URL`, `CLIENT_URL` và `PORT`. Sau khi sửa `.env`, cần restart dev server của React.

### Không kết nối được MongoDB

Kiểm tra `MONGO_URL`, trạng thái MongoDB và quyền truy cập mạng nếu dùng MongoDB Atlas. Backend chỉ log lỗi kết nối; ứng dụng cần được kiểm tra thêm log runtime.

### Cookie/JWT không hoạt động

Đảm bảo frontend và backend dùng đúng origin, `CLIENT_URL` chính xác và request client bật credentials. Với production, cấu hình HTTPS và cookie security phù hợp.

## License

Chưa khai báo license cho repository. Hãy bổ sung license trước khi phân phối hoặc sử dụng project trong phạm vi thương mại.

