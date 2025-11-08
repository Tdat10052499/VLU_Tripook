# VLU_Tripook 🌍✈️

**Tripook** - Your Ultimate Travel Planning Companion

A modern full-stack travel planning application built with React, Flask, and MongoDB.

## 🚀 Quick Start with Docker

The easiest way to run the entire application:

### Windows (PowerShell)
```powershell
.\scripts\start-docker.ps1
```

### Linux/Mac
```bash
chmod +x ./scripts/start-docker.sh
./scripts/start-docker.sh
```

### Manual Docker Start
```bash
# Copy environment file
cp .env.docker .env

# Edit .env with your configurations

# Start all services
docker-compose up -d --build
```

**Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017

📖 **Full Docker documentation:** [DOCKER_README.md](./DOCKER_README.md)

---

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │ ───> │   Backend   │ ───> │   MongoDB   │
│  React+TS   │      │    Flask    │      │  Database   │
│   (Port 80) │      │  (Port 5000)│      │ (Port 27017)│
└─────────────┘      └─────────────┘      └─────────────┘
```

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- JWT authentication with cookies

**Backend:**
- Flask (Python 3.11)
- Flask-RESTful for API
- PyMongo for MongoDB
- JWT for authentication
- Email verification system
- reCAPTCHA integration

**Database:**
- MongoDB 7.0
- Collections: users, trips, activities, bookings, reviews, services

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.11+
- MongoDB (local or Atlas)
- Docker (optional, recommended)

### Option 1: Docker (Recommended)
See [Quick Start with Docker](#-quick-start-with-docker) above.

### Option 2: Manual Installation

#### 1. Clone Repository
```bash
git clone https://github.com/Tdat10052499/VLU_Tripook.git
cd VLU_Tripook-1
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your MongoDB URI and other configs

# Run backend
python run.py
```

Backend will run on http://localhost:5000

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env if needed

# Start development server
npm start
```

Frontend will run on http://localhost:3000

---

## ⚙️ Configuration

### Backend Environment Variables (`.env`)
```env
# MongoDB
MONGO_LOCAL_URI=mongodb://localhost:27017/tripook
MONGO_DATABASE=tripook

# JWT
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# reCAPTCHA
RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key

# Email (Gmail)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend Environment Variables (`.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Tripook
```

---

## 🎯 Features

### User Features
- 👤 User registration and authentication
- 🔐 Email verification
- 📱 Profile management
- 🗺️ Browse trips and activities
- 💳 Booking system
- ⭐ Reviews and ratings
- ❤️ Favorites list

### Provider Features
- 🏢 Provider registration with approval system
- 📊 Provider dashboard
- 🛎️ Service management
- 📅 Booking management
- 📈 Analytics and insights

### Admin Features
- ✅ Provider approval system
- 👥 User management
- 📊 System monitoring

---

## 🛠️ Development

### Project Structure
```
VLU_Tripook-1/
├── backend/               # Flask API
│   ├── app/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             # React app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── contexts/    # React contexts
│   │   └── types/       # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── scripts/             # Utility scripts
├── docker-compose.yml   # Docker orchestration
└── DOCKER_README.md     # Docker documentation
```

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if available)
cd backend
python -m pytest
```

### Building for Production
```bash
# Using Docker (recommended)
docker-compose -f docker-compose.prod.yml up -d --build

# Manual build
cd frontend && npm run build
cd backend && # Deploy with gunicorn or similar
```

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify?token=xxx` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email

### User Endpoints
- `GET /api/user` - Get current user profile
- `PUT /api/user` - Update user profile

### Trip Endpoints
- `GET /api/trips` - List all trips
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create trip (authenticated)
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Provider Endpoints
- `POST /api/provider/register` - Provider registration
- `GET /api/provider/dashboard` - Provider dashboard
- `GET /api/provider/services` - List provider services
- `POST /api/provider/services` - Create service

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# Stop and remove
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Backup MongoDB
.\scripts\backup-mongodb.ps1  # Windows
./scripts/backup-mongodb.sh   # Linux/Mac
```

---

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Email verification required
- reCAPTCHA protection
- CORS configuration
- SQL injection prevention (NoSQL)
- XSS protection

---

## 📈 Roadmap

- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced search and filters
- [ ] Social media integration
- [ ] Multi-language support
- [ ] AI-powered recommendations

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**Tripook Team** - VLU University

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: [Repository Issues](https://github.com/Tdat10052499/VLU_Tripook/issues)

---

**Made with ❤️ by Tripook Team**