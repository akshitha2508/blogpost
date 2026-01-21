import { useEffect, useState } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Video, Eye, MessageCircle, BarChart3, Users, FileText, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import { debugToken } from '../utils/tokenDebug';

const Admin = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState({ 
        title: '', 
        content: '', 
        category: 'General', 
        tags: '', 
        status: 'published' 
    });
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [filterStatus, setFilterStatus] = useState('all');
    const { user, logout, isTokenValid } = useAuth();
    
    // Check token validity on component mount and periodically
    useEffect(() => {
        if (user && !isTokenValid()) {
            alert('Your session has expired. Please log in again.');
            logout();
            return;
        }
        
        // Set up periodic token validation (every 5 minutes)
        const tokenCheckInterval = setInterval(() => {
            if (user && !isTokenValid()) {
                alert('Your session has expired. Please log in again.');
                logout();
            }
        }, 5 * 60 * 1000); // 5 minutes
        
        return () => clearInterval(tokenCheckInterval);
    }, [user, isTokenValid, logout]);
    
    useEffect(() => {
        // Debug token on component mount
        debugToken();
        
        fetchPosts();
        fetchCategories();
        fetchStats();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            
            // Check token before making request
            if (user && !isTokenValid()) {
                alert('Your session has expired. Please log in again.');
                logout();
                return;
            }
            
            const response = await api.get('/posts', {
                params: { status: filterStatus === 'all' ? '' : filterStatus }
            });
            setPosts(response.data.posts || response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching posts:', error);
            
            // Handle authentication errors
            if (error.response?.status === 401) {
                alert('Your session has expired. Please log in again.');
                logout();
                return;
            }
            
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [filterStatus]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                fetchPosts();
                // Show success message
                setError(null);
            } catch (error) {
                console.error('Delete post error:', error);
                const message = error.response?.data?.message || error.response?.data?.msg || 'Failed to delete post';
                
                // Handle token expiration specifically
                if (error.response?.status === 401 || 
                    message.includes('token') || 
                    message.includes('expired') || 
                    message.includes('invalid')) {
                    alert('Your session has expired. Please log in again.');
                    logout();
                    return;
                }
                
                setError(message);
                alert(message);
            }
        }
    };

    const handleEdit = (post) => {
        setIsEditing(true);
        setCurrentPost({
            ...post,
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || ''
        });
        setActiveTab('editor');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', currentPost.title);
            formData.append('content', currentPost.content);
            formData.append('category', currentPost.category);
            formData.append('tags', currentPost.tags);
            formData.append('status', currentPost.status);
            if (image) formData.append('image', image);
            if (video) formData.append('video', video);

            if (isEditing) {
                await api.put(`/posts/${currentPost.id}`, formData);
            } else {
                await api.post('/posts', formData);
            }
            
            setIsEditing(false);
            setCurrentPost({ title: '', content: '', category: 'General', tags: '', status: 'published' });
            setImage(null);
            setVideo(null);
            setActiveTab('posts');
            setError(null);
            fetchPosts();
            fetchStats();
        } catch (error) {
            console.error('Save post error:', error);
            const message = error.response?.data?.message || error.response?.data?.msg || 'Failed to save post';
            
            // Handle token expiration specifically
            if (error.response?.status === 401 || 
                message.includes('token') || 
                message.includes('expired') || 
                message.includes('invalid') ||
                message.includes('Subject must be a string') || 
                message.includes('Signature verification failed')) {
                alert('Your session has expired. Please log in again.');
                logout();
                return;
            }
            
            setError(message);
            alert(message);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color = 'var(--primary)' }) => (
        <motion.div 
            whileHover={{ y: -2 }}
            className="card"
            style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                background: 'white',
                border: '1px solid var(--border)'
            }}
        >
            <div style={{ 
                padding: '0.75rem', 
                borderRadius: '50%', 
                backgroundColor: `${color}20`,
                color: color
            }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--text-main)' }}>{value}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{title}</p>
            </div>
        </motion.div>
    );

    if (loading && !posts.length) {
        return (
            <div className="container" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '2rem auto' }}></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            {error && (
                <div style={{ 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fecaca', 
                    color: '#dc2626', 
                    padding: '1rem', 
                    borderRadius: 'var(--radius)', 
                    marginBottom: '2rem' 
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: isTokenValid() ? '#22c55e' : '#ef4444'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: isTokenValid() ? '#22c55e' : '#ef4444'
                        }} />
                        Session: {isTokenValid() ? 'Active' : 'Expired'}
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setIsEditing(false);
                        setCurrentPost({ title: '', content: '', category: 'General', tags: '', status: 'published' });
                        setActiveTab('editor');
                    }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={18} />
                    New Post
                </motion.button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <StatCard icon={FileText} title="Total Posts" value={stats.stats.total_posts} />
                    <StatCard icon={Users} title="Total Users" value={stats.stats.total_users} color="#10b981" />
                    <StatCard icon={MessageCircle} title="Comments" value={stats.stats.total_comments} color="#f59e0b" />
                    <StatCard icon={Eye} title="Published" value={stats.stats.published_posts} color="#8b5cf6" />
                </div>
            )}

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                {[
                    { id: 'posts', label: 'Posts', icon: FileText },
                    { id: 'editor', label: isEditing ? 'Edit Post' : 'New Post', icon: isEditing ? Edit2 : Plus },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.75rem 1rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: activeTab === tab.id ? '600' : '400'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'posts' && (
                    <motion.div
                        key="posts"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Filter Controls */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Filter by status:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="input"
                                style={{ width: 'auto', padding: '0.5rem' }}
                            >
                                <option value="all">All Posts</option>
                                <option value="published">Published</option>
                                <option value="draft">Drafts</option>
                            </select>
                        </div>

                        {/* Posts List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <AnimatePresence>
                                {posts.map((post, index) => (
                                    <motion.div 
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="card"
                                        style={{ padding: '1.5rem' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                    <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{post.title}</h4>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500',
                                                        backgroundColor: post.status === 'published' ? '#dcfce7' : '#fef3c7',
                                                        color: post.status === 'published' ? '#166534' : '#92400e'
                                                    }}>
                                                        {post.status}
                                                    </span>
                                                </div>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                    <small style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Calendar size={12} />
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </small>
                                                    <small style={{ color: 'var(--text-secondary)' }}>
                                                        Category: {post.category}
                                                    </small>
                                                    {post.views > 0 && (
                                                        <small style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                            <Eye size={12} />
                                                            {post.views} views
                                                        </small>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {post.image_url && <ImageIcon size={14} color="var(--primary)" />}
                                                    {post.video_url && <Video size={14} color="var(--primary)" />}
                                                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                            {post.tags.slice(0, 3).map((tag, i) => (
                                                                <span key={i} style={{
                                                                    padding: '0.125rem 0.375rem',
                                                                    backgroundColor: '#f1f5f9',
                                                                    color: 'var(--text-secondary)',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.75rem'
                                                                }}>
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEdit(post)} 
                                                    className="btn btn-ghost"
                                                    style={{ color: 'var(--primary)', padding: '0.5rem' }}
                                                >
                                                    <Edit2 size={18} />
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDelete(post.id)} 
                                                    className="btn btn-ghost"
                                                    style={{ color: 'var(--danger)', padding: '0.5rem' }}
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'editor' && (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                        style={{ padding: '2rem' }}
                    >
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isEditing ? <Edit2 size={24} /> : <Plus size={24} />}
                            {isEditing ? 'Edit Post' : 'Create New Post'}
                        </h3>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Post Title"
                                    value={currentPost.title}
                                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                    required
                                />
                                <select
                                    className="input"
                                    value={currentPost.status}
                                    onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value })}
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <select
                                    className="input"
                                    value={currentPost.category}
                                    onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Food">Food</option>
                                    <option value="Health">Health</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Tags (comma separated)"
                                    value={currentPost.tags}
                                    onChange={(e) => setCurrentPost({ ...currentPost, tags: e.target.value })}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <RichTextEditor
                                    value={currentPost.content}
                                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                    placeholder="Write your post content here..."
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer', color: 'var(--primary)' }}>
                                        <ImageIcon size={20} /> Upload Image
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    {image ? (
                                        <span style={{ fontSize: '0.8rem', color: 'green' }}>Selected: {image.name}</span>
                                    ) : currentPost.image_url && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current: {currentPost.image_url.split('/').pop()}</span>
                                    )}
                                </div>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer', color: 'var(--primary)' }}>
                                        <Video size={20} /> Upload Video
                                        <input 
                                            type="file" 
                                            accept="video/*"
                                            onChange={(e) => setVideo(e.target.files[0])}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    {video ? (
                                        <span style={{ fontSize: '0.8rem', color: 'green' }}>Selected: {video.name}</span>
                                    ) : currentPost.video_url && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current: {currentPost.video_url.split('/').pop()}</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    className="btn btn-primary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    <Save size={18} />
                                    {isEditing ? 'Update Post' : 'Publish Post'}
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button" 
                                    onClick={() => setActiveTab('posts')}
                                    className="btn btn-ghost"
                                    style={{ border: '1px solid var(--border)' }}
                                >
                                    <X size={18} />
                                    Cancel
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {activeTab === 'analytics' && (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <BarChart3 size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
                            <h3 style={{ marginBottom: '0.5rem' }}>Analytics Coming Soon</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Detailed analytics and insights about your blog performance will be available here.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
