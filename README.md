# Tripook - Travel Planning App

Tripook is a comprehensive travel planning application built with React, Flask, and MongoDB. Plan your perfect trip with our intuitive interface and powerful backend.

## 🚀 Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Custom JWT** authentication
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Flask** with Flask-RESTful
- **PyMongo** for MongoDB integration
- **Custom JWT** authentication
- **Flask-CORS** for cross-origin requests

### Database
- **MongoDB Atlas** (Cloud database)

## 📁 Project Structure

```
tripook/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Flask Python backend
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── requirements.txt     # Python dependencies
│   └── app.py              # Flask application entry point
├── package.json            # Root package.json with scripts
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB Atlas** account
- **JWT** secret key

### 1. Clone the Repository
```bash
git clone https://github.com/Tdat10052499/VLU_Tripook.git
cd VLU_Tripook
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install separately
npm run install:frontend
npm run install:backend
```

### 3. Environment Configuration

#### Frontend Environment (.env)
Copy `frontend/.env.example` to `frontend/.env` and configure:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend Environment (.env)
Copy `backend/.env.example` to `backend/.env` and configure:
```env
SECRET_KEY=your-super-secret-key-here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tripook?retryWrites=true&w=majority
MONGO_DATABASE=tripook
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

### 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP address
4. Get your connection string and update `MONGO_URI` in backend `.env`

## 🚀 Running the Application

### Development Mode
```bash
# Run both frontend and backend simultaneously
npm run dev

# Or run separately
npm run dev:frontend  # Starts React app on http://localhost:3000
npm run dev:backend   # Starts Flask app on http://localhost:5000
```

### Production Build
```bash
# Build frontend for production
npm run build:frontend
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/user` - Get current user profile
- `PUT /api/user` - Update user profile

### Trips
- `GET /api/trips` - Get all user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get specific trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Activities
- `GET /api/trips/:tripId/activities` - Get trip activities
- `POST /api/trips/:tripId/activities` - Create new activity
- `GET /api/trips/:tripId/activities/:id` - Get specific activity
- `PUT /api/trips/:tripId/activities/:id` - Update activity
- `DELETE /api/trips/:tripId/activities/:id` - Delete activity

## 🔧 Available Scripts

```bash
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run only frontend
npm run dev:backend      # Run only backend
npm run install:all      # Install all dependencies
npm run build:frontend   # Build frontend for production
npm run test:frontend    # Run frontend tests
```

## 🏗️ Features

- ✅ User authentication with JWT
- ✅ Create and manage trips
- ✅ Add activities to trips
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript support
- ✅ REST API with proper error handling
- ✅ MongoDB integration

## 🔐 Security Features

- JWT-based authentication
- Protected API routes
- CORS configuration
- Environment-based configuration
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@tripook.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Trip sharing functionality
- [ ] Travel recommendations
- [ ] Budget tracking and analytics
- [ ] Integration with travel APIs
- [ ] Mobile app development
- [ ] Offline support
- [ ] Social features

---

**Happy Planning! 🌍✈️**