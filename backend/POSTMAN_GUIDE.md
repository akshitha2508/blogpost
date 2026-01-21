# Blog API Postman Collection

This Postman collection provides ready-to-use API endpoints for testing the Blog application.

## Setup Instructions

1. **Import the Collection**:
   - Open Postman
   - Click "Import" button
   - Select the `postman_collection.json` file
   - Click "Import"

2. **Start the Backend Server**:
   ```bash
   cd backend
   python app.py
   ```

3. **Environment Setup**:
   - Create a new environment in Postman
   - Add a variable called `auth_token` (leave value empty initially)

## Usage Workflow

### 1. Register a User
- Use the "Register User" request
- Default credentials: username: `testuser`, password: `password123`

### 2. Login
- Use the "Login User" request
- Copy the `access_token` from the response

### 3. Set Auth Token
- Go to your environment and set the `auth_token` variable with the token from login
- Or manually add it to the Authorization header: `Bearer YOUR_TOKEN`

### 4. Create Posts
- Use "Create Post (Authenticated)" request
- The token will be automatically included

### 5. Test Other Operations
- Get All Posts: No authentication required
- Get Single Post: No authentication required  
- Update/Delete Posts: Requires authentication and ownership

## Alternative No-Auth Endpoint
- If you want to test without authentication, use "Create Post (No Auth - Alternative)"
- This uses the `/api/posts` endpoint without JWT requirement

## Troubleshooting

### Common Issues:
1. **"Failed to save post" error**: Check if backend is running on port 5000
2. **"Permission denied"**: Ensure you're using a valid JWT token
3. **Database errors**: Delete `blog.db` file and restart server

### Backend Issues Fixed:
- Added missing `user_id` field to Post model
- Fixed `to_dict()` method for Post serialization
- Proper JWT authentication setup
- CORS enabled for frontend integration