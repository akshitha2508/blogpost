import os
from flask import current_app
from werkzeug.utils import secure_filename
import uuid

def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def save_uploaded_file(file, upload_type='image'):
    if not file or file.filename == '':
        return None
    
    if upload_type == 'image':
        allowed_extensions = current_app.config['ALLOWED_IMAGE_EXTENSIONS']
        upload_folder = current_app.config['UPLOADED_IMAGES_DEST']
    elif upload_type == 'video':
        allowed_extensions = current_app.config['ALLOWED_VIDEO_EXTENSIONS']
        upload_folder = current_app.config['UPLOADED_VIDEOS_DEST']
    elif upload_type == 'avatar':
        allowed_extensions = current_app.config['ALLOWED_IMAGE_EXTENSIONS']
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'avatars')
    else:
        return None
    
    if not allowed_file(file.filename, allowed_extensions):
        return None
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    file_extension = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
    
    # Create upload directory if it doesn't exist
    os.makedirs(upload_folder, exist_ok=True)
    
    # Save file
    file_path = os.path.join(upload_folder, unique_filename)
    file.save(file_path)
    
    # Return relative path for database storage
    if upload_type == 'avatar':
        return f"avatars/{unique_filename}"
    else:
        return f"{upload_type}s/{unique_filename}"