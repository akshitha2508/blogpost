from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Post, Comment
from file_utils import save_uploaded_file

api = Blueprint('api', __name__)

@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400
        
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    
    # First user is admin for simplicity
    if User.query.count() == 0:
        new_user.is_admin = True
        
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User created successfully"}), 201

@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, user=user.to_dict()), 200
        
    return jsonify({"message": "Invalid credentials"}), 401

@api.route('/test', methods=['GET'])
def test_connection():
    return jsonify({"message": "API connection working!", "status": "success"}), 200

@api.route('/posts', methods=['GET'])
def get_posts():
    # Get query parameters for filtering
    category = request.args.get('category')
    search = request.args.get('search')
    status = request.args.get('status', 'published')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    # Build query
    query = Post.query
    
    # Filter by status
    if status:
        query = query.filter(Post.status == status)
    
    # Filter by category
    if category and category != 'all':
        query = query.filter(Post.category == category)
    
    # Search in title and content
    if search:
        query = query.filter(
            db.or_(
                Post.title.contains(search),
                Post.content.contains(search)
            )
        )
    
    # Order by creation date
    query = query.order_by(Post.created_at.desc())
    
    # Paginate
    posts = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [post.to_dict() for post in posts.items],
        'total': posts.total,
        'pages': posts.pages,
        'current_page': page,
        'has_next': posts.has_next,
        'has_prev': posts.has_prev
    }), 200

@api.route('/posts/<int:id>', methods=['GET'])
def get_post(id):
    post = Post.query.get_or_404(id)
    # Increment view count
    post.views += 1
    db.session.commit()
    return jsonify(post.to_dict()), 200

@api.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    current_user_id = get_jwt_identity()
    
    # Handle both JSON and multipart/form-data requests
    if request.content_type and 'multipart/form-data' in request.content_type:
        # Handle file uploads
        title = request.form.get('title')
        content = request.form.get('content')
        category = request.form.get('category', 'General')
        tags = request.form.get('tags', '')
        status = request.form.get('status', 'published')
        
        new_post = Post(
            title=title,
            content=content,
            category=category,
            tags=tags,
            status=status,
            user_id=current_user_id
        )
        
        # Handle image upload
        if 'image' in request.files:
            image_file = request.files['image']
            image_url = save_uploaded_file(image_file, 'image')
            if image_url:
                new_post.image_url = image_url
        
        # Handle video upload
        if 'video' in request.files:
            video_file = request.files['video']
            video_url = save_uploaded_file(video_file, 'video')
            if video_url:
                new_post.video_url = video_url
                
    else:
        # Handle JSON requests (backward compatibility)
        data = request.get_json()
        new_post = Post(
            title=data.get('title'),
            content=data.get('content'),
            category=data.get('category', 'General'),
            tags=data.get('tags', ''),
            status=data.get('status', 'published'),
            user_id=current_user_id
        )
    
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify(new_post.to_dict()), 201

@api.route('/posts/<int:id>', methods=['PUT'])
@jwt_required()
def update_post(id):
    current_user_id = get_jwt_identity()
    post = Post.query.get_or_404(id)
    
    # Check permission (user owns post or is admin)
    user = User.query.get(current_user_id)
    if int(post.user_id) != int(current_user_id) and not (user and user.is_admin):
        return jsonify({"message": "Permission denied"}), 403
    
    # Handle both JSON and multipart/form-data requests
    if request.content_type and 'multipart/form-data' in request.content_type:
        post.title = request.form.get('title', post.title)
        post.content = request.form.get('content', post.content)
        post.category = request.form.get('category', post.category)
        post.tags = request.form.get('tags', post.tags)
        post.status = request.form.get('status', post.status)
        
        # Handle image upload
        if 'image' in request.files:
            image_file = request.files['image']
            image_url = save_uploaded_file(image_file, 'image')
            if image_url:
                post.image_url = image_url
        
        # Handle video upload
        if 'video' in request.files:
            video_file = request.files['video']
            video_url = save_uploaded_file(video_file, 'video')
            if video_url:
                post.video_url = video_url
                
    else:
        # Handle JSON requests (backward compatibility)
        data = request.get_json()
        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)
        post.category = data.get('category', post.category)
        post.tags = data.get('tags', post.tags)
        post.status = data.get('status', post.status)
    
    db.session.commit()
    return jsonify(post.to_dict()), 200

@api.route('/posts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    current_user_id = get_jwt_identity()
    post = Post.query.get_or_404(id)
    
    # Check permission
    user = User.query.get(current_user_id)
    if int(post.user_id) != int(current_user_id) and not (user and user.is_admin):
        return jsonify({"message": "Permission denied"}), 403
        
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({"message": "Post deleted"}), 200




# Get categories
@api.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Post.category).distinct().all()
    return jsonify([cat[0] for cat in categories if cat[0]]), 200

# Comments endpoints
@api.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id, parent_id=None).order_by(Comment.created_at.desc()).all()
    return jsonify([comment.to_dict() for comment in comments]), 200

@api.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    new_comment = Comment(
        content=data.get('content'),
        user_id=current_user_id,
        post_id=post_id,
        parent_id=data.get('parent_id')  # For replies
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify(new_comment.to_dict()), 201

@api.route('/comments/<int:id>', methods=['PUT'])
@jwt_required()
def update_comment(id):
    current_user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(id)
    
    # Check permission
    if int(comment.user_id) != int(current_user_id):
        return jsonify({"message": "Permission denied"}), 403
    
    data = request.get_json()
    comment.content = data.get('content', comment.content)
    
    db.session.commit()
    return jsonify(comment.to_dict()), 200

@api.route('/comments/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_comment(id):
    current_user_id = get_jwt_identity()
    comment = Comment.query.get_or_404(id)
    
    # Check permission (user owns comment or is admin)
    user = User.query.get(current_user_id)
    if int(comment.user_id) != int(current_user_id) and not (user and user.is_admin):
        return jsonify({"message": "Permission denied"}), 403
        
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({"message": "Comment deleted"}), 200

# User profile endpoints
@api.route('/users/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    posts = Post.query.filter_by(user_id=user_id, status='published').order_by(Post.created_at.desc()).all()
    
    return jsonify({
        'user': user.to_dict(),
        'posts': [post.to_dict() for post in posts],
        'post_count': len(posts)
    }), 200

@api.route('/users/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    # Handle both JSON and multipart/form-data requests
    if request.content_type and 'multipart/form-data' in request.content_type:
        user.username = request.form.get('username', user.username)
        user.email = request.form.get('email', user.email)
        user.bio = request.form.get('bio', user.bio)
        
        # Handle avatar upload
        if 'avatar' in request.files:
            avatar_file = request.files['avatar']
            avatar_url = save_uploaded_file(avatar_file, 'avatar')
            if avatar_url:
                user.avatar_url = avatar_url
    else:
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.bio = data.get('bio', user.bio)
    
    db.session.commit()
    return jsonify(user.to_dict()), 200

# Dashboard stats for admin
@api.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or not user.is_admin:
        return jsonify({"message": "Admin access required"}), 403
    
    total_posts = Post.query.count()
    total_users = User.query.count()
    total_comments = Comment.query.count()
    published_posts = Post.query.filter_by(status='published').count()
    draft_posts = Post.query.filter_by(status='draft').count()
    
    # Recent activity
    recent_posts = Post.query.order_by(Post.created_at.desc()).limit(5).all()
    recent_comments = Comment.query.order_by(Comment.created_at.desc()).limit(5).all()
    
    return jsonify({
        'stats': {
            'total_posts': total_posts,
            'total_users': total_users,
            'total_comments': total_comments,
            'published_posts': published_posts,
            'draft_posts': draft_posts
        },
        'recent_posts': [post.to_dict() for post in recent_posts],
        'recent_comments': [comment.to_dict() for comment in recent_comments]
    }), 200