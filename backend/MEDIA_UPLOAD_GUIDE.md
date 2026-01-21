# Media Upload Implementation Guide

## ✅ **Backend Media Support Added**

### **New Features:**
1. **Image Upload**: Support for PNG, JPG, JPEG, GIF, WebP (max 16MB)
2. **Video Upload**: Support for MP4, AVI, MOV, WMV, FLV, WebM (max 16MB)
3. **Secure File Handling**: Unique filenames, proper validation, organized folders

### **Updated API Endpoints:**

#### **Create Post with Media** (`POST /api/posts`)
**Now supports both JSON and Form-Data requests:**

**Form-Data (with files):**
```
title: "My Blog Post with Media"
content: "This is my blog post content with images and videos."
image: [select image file]
video: [select video file]
```

**JSON (backward compatibility):**
```json
{
  "title": "My Blog Post",
  "content": "This is my blog post content."
}
```

#### **Update Post with Media** (`PUT /api/posts/{id}`)
**Same dual format support - can update media files along with title/content**

### **File Storage Structure:**
```
uploads/
├── images/
│   ├── abc123.jpg
│   └── def456.png
└── videos/
    ├── ghi789.mp4
    └── jkl012.avi
```

## 🚀 **Updated Postman Collection**

### **New Collection Created:**
- **[postman_collection_with_media.json](c:\Users\ragha\Downloads\blog\blog\backend\postman_collection_with_media.json)**

### **New Requests Added:**
1. **"Create Post with Media (Form-Data)"** - Upload images/videos with posts
2. **"Update Post with Media (Form-Data)"** - Update existing posts with new media

### **How to Test Media Uploads:**

1. **Import the new collection** (or replace existing one)
2. **Login first** to get your JWT token
3. **Use "Create Post with Media (Form-Data)"** request
4. **Fill in the form fields:**
   - title: Your post title
   - content: Your post content
   - image: Click "Select Files" and choose an image
   - video: Click "Select Files" and choose a video
5. **Send the request** - your post will be created with media!

## 📋 **Testing Media Uploads**

### **Sample Test Data:**
- **Images**: Any JPG, PNG, GIF under 16MB
- **Videos**: Any MP4, AVI, MOV under 16MB
- **Title**: "My First Media Post"
- **Content**: "This post includes images and videos!"

### **Expected Response:**
```json
{
  "id": 1,
  "title": "My First Media Post",
  "content": "This post includes images and videos!",
  "user_id": 1,
  "image_url": "images/abc123.jpg",
  "video_url": "videos/def456.mp4",
  "created_at": "2024-01-09T12:00:00"
}
```

## 🔧 **Backend Status**
- ✅ **Server Running**: Flask app active on port 5000
- ✅ **Media Upload**: Image and video upload endpoints working
- ✅ **File Validation**: Extension and size validation active
- ✅ **Secure Storage**: Unique filenames and organized folders
- ✅ **Dual Format Support**: Both JSON and Form-Data requests supported

## 🎯 **Next Steps**
1. **Test media uploads** using the updated Postman collection
2. **Update frontend** to support file selection and upload
3. **Display media** in blog posts (frontend integration)

Your blog now supports rich media content! 🎉