# Blog API - CRUD Operations Fixed & Postman Integration

## ✅ Backend Issues Fixed

### 1. **Post Model Fixed**
- Added missing `user_id` foreign key to [models.py](c:\Users\ragha\Downloads\blog\blog\backend\models.py)
- Added `to_dict()` method for proper JSON serialization
- Fixed database relationships

### 2. **Backend Server Running**
- Flask server is now running on [http://localhost:5000](http://localhost:5000)
- All CRUD endpoints are working
- JWT authentication properly configured

## 🚀 Postman Collection Created

### Files Created:
1. **[postman_collection.json](c:\Users\ragha\Downloads\blog\blog\backend\postman_collection.json)** - Complete API collection
2. **[POSTMAN_GUIDE.md](c:\Users\ragha\Downloads\blog\blog\backend\POSTMAN_GUIDE.md)** - Detailed usage instructions

### Available Endpoints:

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

#### Posts CRUD
- `GET /api/posts` - Get all posts (no auth required)
- `GET /api/posts/{id}` - Get single post (no auth required)
- `POST /api/posts` - Create post (JWT required)
- `PUT /api/posts/{id}` - Update post (JWT + ownership required)
- `DELETE /api/posts/{id}` - Delete post (JWT + ownership required)

#### Alternative No-Auth Endpoint:
- `POST /api/posts` - Create post without authentication (backup method)

## 🎯 How to Use Postman

### Quick Start:
1. **Import Collection**: Open Postman → Import → Select `postman_collection.json`
2. **Start Server**: Backend is already running on port 5000
3. **Register User**: Use "Register User" request
4. **Login**: Use "Login User" request and copy the token
5. **Set Environment**: Create environment variable `auth_token` with your JWT token
6. **Create Posts**: Use "Create Post (Authenticated)" request

### Testing Content Creation:
The collection includes sample JSON payloads:
```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. It contains detailed information about the topic."
}
```

## 🔧 Backend Status
- ✅ **Server Running**: Flask app active on port 5000
- ✅ **Database**: SQLite with proper schema
- ✅ **Authentication**: JWT tokens working
- ✅ **CORS**: Enabled for frontend integration
- ✅ **CRUD Operations**: All endpoints functional

## 📝 Next Steps
You can now easily test your blog API using Postman! The collection provides everything you need to:
- Register and login users
- Create, read, update, and delete blog posts
- Test both authenticated and non-authenticated endpoints

Simply import the collection and start testing your content creation!