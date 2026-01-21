# 🚀 VS Code Setup Guide for Blog Application

## 📋 Prerequisites
- VS Code installed
- Python 3.7+ installed
- Node.js 14+ installed
- npm or yarn installed

## 🎯 Quick Start (2 Terminal Setup)

### Terminal 1: Backend Server
```bash
cd c:\Users\ragha\Downloads\blog\blog\backend
python app.py
```

### Terminal 2: Frontend Server
```bash
cd c:\Users\ragha\Downloads\blog\blog\frontend
npm run dev
```

## 🔧 Step-by-Step VS Code Setup

### 1. Open Project in VS Code
1. Open VS Code
2. File → Open Folder → Select `c:\Users\ragha\Downloads\blog\blog`
3. You'll see both `backend` and `frontend` folders in the explorer

### 2. Install Extensions (Recommended)
Install these VS Code extensions for better development experience:
- Python (Microsoft)
- Pylance (Microsoft)
- JavaScript and TypeScript Language Features
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag

### 3. Setup Terminal Split View
1. Open integrated terminal: `Ctrl + `` ` (backtick)
2. Split terminal: Click the split icon or `Ctrl + Shift + 5`
3. Now you have 2 terminals side by side

### 4. Backend Setup (Left Terminal)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 5. Frontend Setup (Right Terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Your Application

### Backend API
- **URL**: http://localhost:5000
- **API Endpoints**: http://localhost:5000/api/posts
- **Status**: Should show "Starting production server with Waitress"

### Frontend Web Interface
- **URL**: http://localhost:5173
- **React App**: Modern blog interface
- **Hot Reload**: Changes update automatically

## 📁 Project Structure in VS Code
```
blog/
├── backend/           # Flask API Server
│   ├── app.py        # Main server file
│   ├── routes.py     # API endpoints
│   ├── models.py     # Database models
│   ├── config.py     # Configuration
│   ├── file_utils.py # File upload utilities
│   └── requirements.txt
├── frontend/         # React Frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── api.js       # API calls
│   ├── package.json
│   └── vite.config.js
└── VSCODE_SETUP.md   # This file
```

## 🚀 Available Scripts

### Backend Scripts
```bash
# Start production server
python app.py

# Development server (if needed)
python app.py  # Already configured with Waitress
```

### Frontend Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔍 Testing the Setup

### Test Backend API
1. Open browser: http://localhost:5000/api/posts
2. Should return JSON with posts (empty array if no posts)

### Test Frontend
1. Open browser: http://localhost:5173
2. Should show React blog interface

### Test Postman Integration
1. Import `postman_collection.json` into Postman
2. Test API endpoints with the collection

## 🛠️ Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change port in `app.py`
- **Database errors**: Delete `backend/instance/blog.db` and restart
- **Import errors**: Run `pip install -r requirements.txt`

### Frontend Issues
- **Port 5173 in use**: Vite will auto-select another port
- **Node modules missing**: Run `npm install`
- **Build errors**: Check console for specific errors

### VS Code Terminal Issues
- **Terminal not opening**: Check VS Code settings
- **Commands not working**: Ensure Python/Node are in PATH
- **Split terminal not working**: Use `Ctrl + Shift + 5`

## 📱 Features Available

### ✅ Currently Working
- ✅ Backend API server (Flask + Waitress)
- ✅ Frontend React interface (Vite)
- ✅ CRUD operations for posts
- ✅ User authentication (JWT)
- ✅ File upload support (images/videos)
- ✅ Postman integration
- ✅ Database (SQLite)

### 🔄 Next Steps
- Test media uploads
- Update frontend for file uploads
- Add more frontend features

## 🎯 Quick Commands Summary

```bash
# Start both servers (in separate terminals)
cd backend && python app.py
cd frontend && npm run dev

# Access applications
# Backend: http://localhost:5000
# Frontend: http://localhost:5173
# API: http://localhost:5000/api/posts
```

Happy coding! 🎉