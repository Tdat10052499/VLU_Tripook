# 🐳 Hướng dẫn Deploy Tripook với Docker

## 📋 Mục lục
- [Tổng quan](#-tổng-quan)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cấu trúc Docker](#-cấu-trúc-docker)
- [Cài đặt và Chạy](#-cài-đặt-và-chạy)
- [Quản lý Container](#-quản-lý-container)
- [Cấu hình](#-cấu-hình)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Tổng quan

Dự án Tripook được đóng gói thành 3 container Docker:
- **Frontend**: React app chạy trên Nginx (Port 80)
- **Backend**: Flask API (Port 5000)
- **Database**: MongoDB (Port 27017)

## 💻 Yêu cầu hệ thống

- Docker Engine 20.10+ hoặc Docker Desktop
- Docker Compose 2.0+
- RAM tối thiểu: 4GB
- Dung lượng đĩa: ~2GB

### Kiểm tra cài đặt Docker:
```bash
docker --version
docker-compose --version
```

---

## 📦 Cấu trúc Docker

```
VLU_Tripook-1/
├── docker-compose.yml          # Orchestration file
├── .env.docker                 # Environment template
├── .dockerignore              # Ignore files cho root
├── backend/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore
└── frontend/
    ├── Dockerfile             # Frontend container
    ├── nginx.conf             # Nginx config
    └── .dockerignore
```

---

## 🚀 Cài đặt và Chạy

### Bước 1: Chuẩn bị môi trường

1. **Copy file environment:**
```bash
cp .env.docker .env
```

2. **Cấu hình file .env** (xem chi tiết [Cấu hình](#-cấu-hình))
   - Thay đổi MongoDB password
   - Cập nhật SECRET_KEY và JWT_SECRET_KEY
   - Cấu hình reCAPTCHA keys
   - Cấu hình Email (nếu cần)

### Bước 2: Build và chạy containers

**Development mode (với hot-reload):**
```bash
# Build và start tất cả services
docker-compose up --build

# Hoặc chạy ở background
docker-compose up -d --build
```

**Production mode:**
```bash
# Build với production settings
docker-compose -f docker-compose.yml up -d --build
```

### Bước 3: Truy cập ứng dụng

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api
- **MongoDB**: mongodb://localhost:27017

---

## 🔧 Quản lý Container

### Xem logs
```bash
# Xem tất cả logs
docker-compose logs

# Xem logs của service cụ thể
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb

# Theo dõi logs realtime
docker-compose logs -f
```

### Kiểm tra trạng thái
```bash
# Xem trạng thái containers
docker-compose ps

# Kiểm tra health check
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Dừng và khởi động lại
```bash
# Dừng tất cả services
docker-compose stop

# Khởi động lại
docker-compose start

# Khởi động lại service cụ thể
docker-compose restart backend

# Dừng và xóa containers (giữ data)
docker-compose down

# Dừng và xóa containers + volumes (mất data!)
docker-compose down -v
```

### Rebuild containers
```bash
# Rebuild một service cụ thể
docker-compose build backend
docker-compose up -d backend

# Rebuild tất cả services
docker-compose build --no-cache
docker-compose up -d
```

---

## ⚙️ Cấu hình

### File `.env` - Environment Variables

#### 1. MongoDB Configuration
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-strong-password-here
MONGO_DATABASE=tripook
```

**🔒 Bảo mật:** Đổi password mặc định ngay!

#### 2. Flask Backend
```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
```

**Tạo secret key ngẫu nhiên:**
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

#### 3. CORS Origins
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:80,https://yourdomain.com
```

Thêm domain của bạn vào danh sách!

#### 4. reCAPTCHA
```env
RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

**Lấy keys tại:** https://www.google.com/recaptcha/admin

#### 5. Email Configuration (Gmail)
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@tripook.com
```

**Cấu hình Gmail App Password:**
1. Bật 2FA cho Gmail account
2. Tạo App Password: https://myaccount.google.com/apppasswords
3. Sử dụng App Password (16 ký tự)

#### 6. Frontend Configuration
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Tripook
REACT_APP_VERSION=1.0.0
```

**Lưu ý:** Với production, đổi `localhost` thành domain thực tế.

---

## 🗄️ Database Management

### Kết nối MongoDB từ host
```bash
# Sử dụng mongosh (MongoDB Shell)
mongosh "mongodb://admin:your-password@localhost:27017/tripook?authSource=admin"
```

### Backup database
```bash
# Backup
docker-compose exec mongodb mongodump --username=admin --password=your-password --authenticationDatabase=admin --db=tripook --out=/tmp/backup

# Copy backup ra host
docker cp tripook-mongodb:/tmp/backup ./mongodb-backup
```

### Restore database
```bash
# Copy backup vào container
docker cp ./mongodb-backup tripook-mongodb:/tmp/backup

# Restore
docker-compose exec mongodb mongorestore --username=admin --password=your-password --authenticationDatabase=admin --db=tripook /tmp/backup/tripook
```

### Xem database size
```bash
docker-compose exec mongodb mongosh --username admin --password your-password --authenticationDatabase admin --eval "db.stats()"
```

---

## 🐛 Troubleshooting

### Backend không kết nối được MongoDB
**Triệu chứng:** Backend logs hiển thị connection error

**Giải pháp:**
```bash
# 1. Kiểm tra MongoDB đã sẵn sàng chưa
docker-compose logs mongodb

# 2. Kiểm tra MongoDB health
docker inspect tripook-mongodb | grep -A 10 Health

# 3. Restart backend sau khi MongoDB ready
docker-compose restart backend
```

### Frontend không gọi được API
**Triệu chứng:** CORS errors hoặc Network errors

**Giải pháp:**
1. Kiểm tra `REACT_APP_API_URL` trong `.env`
2. Đảm bảo backend đang chạy: `docker-compose ps`
3. Kiểm tra CORS_ORIGINS trong backend config
4. Clear browser cache và rebuild frontend:
```bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Port đã được sử dụng
**Triệu chứng:** `Bind for 0.0.0.0:80 failed: port is already allocated`

**Giải pháp:**
```bash
# Tìm process đang dùng port
# Windows
netstat -ano | findstr :80
taskkill /PID <PID> /F

# Linux/Mac
sudo lsof -i :80
sudo kill -9 <PID>

# Hoặc đổi port trong docker-compose.yml
# frontend:
#   ports:
#     - "8080:80"
```

### Container tự động tắt
**Triệu chứng:** Container exit ngay sau khi start

**Giải pháp:**
```bash
# Xem logs để tìm lỗi
docker-compose logs --tail=100 backend

# Xem exit code
docker ps -a

# Chạy container interactive để debug
docker-compose run --rm backend sh
```

### MongoDB data bị mất sau restart
**Giải pháp:** Đảm bảo volumes được cấu hình đúng
```bash
# Kiểm tra volumes
docker volume ls | grep tripook

# Nếu cần tạo lại
docker-compose down
docker-compose up -d
```

### Permission denied errors (Linux)
```bash
# Fix permissions cho volumes
sudo chown -R $USER:$USER ./backend ./frontend

# Hoặc chạy với sudo
sudo docker-compose up -d
```

---

## 🔍 Monitoring và Logging

### Xem resource usage
```bash
# Realtime stats
docker stats

# Specific containers
docker stats tripook-frontend tripook-backend tripook-mongodb
```

### Logs location
Logs được lưu trong volumes:
- Backend logs: `tripook-backend-logs` volume
- MongoDB logs: Trong container tại `/var/log/mongodb/`

### Access container shell
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh

# MongoDB
docker-compose exec mongodb mongosh
```

---

## 🚀 Production Deployment

### Checklist trước khi deploy:
- [ ] Đổi tất cả passwords và secret keys
- [ ] Cấu hình CORS_ORIGINS với domain thực
- [ ] Set `FLASK_DEBUG=False`
- [ ] Cấu hình SSL/HTTPS (reverse proxy)
- [ ] Backup strategy cho MongoDB
- [ ] Monitoring và logging
- [ ] Rate limiting và security headers

### Khuyến nghị Production:
1. **Sử dụng Docker Swarm hoặc Kubernetes** cho scaling
2. **Reverse proxy (Nginx/Traefik)** cho SSL termination
3. **Persistent volumes** cho MongoDB trên network storage
4. **Container orchestration** cho auto-restart và health checks
5. **Monitoring tools** như Prometheus + Grafana

---

## 📚 Tài liệu tham khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

## 💡 Tips

1. **Development**: Sử dụng volumes mount để hot-reload
2. **Production**: Build images với specific tags
3. **Security**: Never commit `.env` file to git
4. **Performance**: Use multi-stage builds để giảm image size
5. **Backup**: Automate MongoDB backups với cron jobs

---

## 📞 Support

Nếu gặp vấn đề, hãy:
1. Check logs: `docker-compose logs`
2. Restart services: `docker-compose restart`
3. Rebuild if needed: `docker-compose up -d --build`
4. Tạo issue trên GitHub repository

---

**Happy Dockerizing! 🐳**
