import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Calendar, Eye, Tag, MessageCircle, Send, Heart, Share2, Bookmark } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const SimplePostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            setPost(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Failed to load post.');
            // Fallback sample post
            setPost({
                id: parseInt(id),
                title: 'Sample Post',
                content: 'This is a sample post for demonstration. The actual post could not be loaded from the API.',
                author: 'Admin',
                category: 'General',
                views: 42,
                created_at: new Date().toISOString()
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await api.get(`/posts/${id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please log in to comment');
            return;
        }
        
        if (!newComment.trim()) return;

        try {
            await api.post(`/posts/${id}/comments`, {
                content: newComment
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        }
    };

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="page-transition"
                style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}
            >
                {/* Back Button Skeleton */}
                <div style={{
                    width: '120px',
                    height: '40px',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }} />

                {/* Post Skeleton */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    border: '1px solid var(--border)'
                }}>
                    {/* Title Skeleton */}
                    <div style={{
                        height: '40px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }} />
                    
                    {/* Meta Skeleton */}
                    <div style={{
                        height: '20px',
                        width: '60%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '4px',
                        marginBottom: '2rem'
                    }} />

                    {/* Content Skeleton */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{
                            height: '20px',
                            width: i === 5 ? '40%' : '100%',
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            borderRadius: '4px',
                            marginBottom: '0.75rem'
                        }} />
                    ))}
                </div>

                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ display: 'inline-block', marginBottom: '1rem' }}
                    >
                        ⚡
                    </motion.div>
                    <p>Loading amazing content...</p>
                </div>
            </motion.div>
        );
    }

    if (!post) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    maxWidth: '800px', 
                    margin: '0 auto', 
                    padding: '2rem',
                    textAlign: 'center'
                }}
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        fontSize: '4rem',
                        marginBottom: '1rem'
                    }}
                >
                    📝
                </motion.div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                    Post not found
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    The story you're looking for doesn't exist or has been removed.
                </p>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        margin: '0 auto',
                        fontSize: '1rem',
                        fontWeight: '500'
                    }}
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}
        >
            {/* Enhanced Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '500',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease'
                }}
            >
                <ArrowLeft size={18} />
                Back to Stories
            </motion.button>

            {/* Enhanced Post Content */}
            <motion.article 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    marginBottom: '2rem'
                }}
            >
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ 
                            backgroundColor: '#fef2f2', 
                            border: '1px solid #fecaca', 
                            color: '#dc2626', 
                            padding: '1rem', 
                            margin: '2rem 2rem 0',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Post Media */}
                {(post.image_url || post.video_url) && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        style={{ position: 'relative', overflow: 'hidden' }}
                    >
                        {post.image_url && (
                            <img
                                src={`http://localhost:5000/uploads/${post.image_url}`}
                                alt={post.title}
                                style={{ 
                                    width: '100%', 
                                    height: '400px', 
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                        {post.video_url && (
                            <video
                                src={`http://localhost:5000/uploads/${post.video_url}`}
                                controls
                                style={{ 
                                    width: '100%', 
                                    height: '400px', 
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
                        }} />
                    </motion.div>
                )}

                <div style={{ padding: '2rem' }}>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        style={{ 
                            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', 
                            marginBottom: '1.5rem', 
                            color: 'var(--text-main)',
                            fontWeight: '700',
                            lineHeight: '1.2'
                        }}
                    >
                        {post.title}
                    </motion.h1>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap',
                            gap: '1rem', 
                            marginBottom: '1.5rem', 
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <User size={16} />
                            <span style={{ fontWeight: '500' }}>{post.author}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <Calendar size={16} />
                            <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                        {post.views && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                <Eye size={16} />
                                <span>{post.views.toLocaleString()} views</span>
                            </div>
                        )}
                    </motion.div>

                    {post.category && (
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                marginBottom: '2rem'
                            }}
                        >
                            <Tag size={14} />
                            {post.category}
                        </motion.span>
                    )}

                    {/* Post Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        style={{ 
                            fontSize: '1.125rem', 
                            lineHeight: '1.8', 
                            color: 'var(--text-main)',
                            whiteSpace: 'pre-wrap',
                            marginBottom: '2rem'
                        }}
                    >
                        {post.content}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid var(--border)',
                            flexWrap: 'wrap'
                        }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setLiked(!liked)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                backgroundColor: liked ? '#fef2f2' : 'var(--background)',
                                color: liked ? '#dc2626' : 'var(--text-secondary)',
                                border: `1px solid ${liked ? '#fecaca' : 'var(--border)'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Heart size={18} fill={liked ? '#dc2626' : 'none'} />
                            {liked ? 'Liked' : 'Like'}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setBookmarked(!bookmarked)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                backgroundColor: bookmarked ? '#f0f9ff' : 'var(--background)',
                                color: bookmarked ? 'var(--primary)' : 'var(--text-secondary)',
                                border: `1px solid ${bookmarked ? 'var(--primary)' : 'var(--border)'}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Bookmark size={18} fill={bookmarked ? 'var(--primary)' : 'none'} />
                            {bookmarked ? 'Saved' : 'Save'}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                backgroundColor: 'var(--background)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Share2 size={18} />
                            Share
                        </motion.button>
                    </motion.div>
                </div>
            </motion.article>

            {/* Enhanced Comments Section */}
            <motion.section 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)',
                    padding: '2rem'
                }}
            >
                <h3 style={{ 
                    fontSize: '1.5rem', 
                    marginBottom: '1.5rem',
                    color: 'var(--text-main)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <MessageCircle size={24} style={{ color: 'var(--primary)' }} />
                    Comments ({comments.length})
                </h3>

                {/* Enhanced Comment Form */}
                {user ? (
                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        onSubmit={handleCommentSubmit} 
                        style={{ marginBottom: '2rem' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <textarea
                                    placeholder="Share your thoughts..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid var(--border)',
                                        borderRadius: '12px',
                                        minHeight: '120px',
                                        resize: 'vertical',
                                        fontSize: '1rem',
                                        fontFamily: 'inherit',
                                        transition: 'border-color 0.2s ease',
                                        backgroundColor: 'var(--background)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                    required
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    alignSelf: 'flex-start',
                                    fontWeight: '500',
                                    fontSize: '1rem'
                                }}
                            >
                                <Send size={18} />
                                Post Comment
                            </motion.button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ 
                            padding: '1.5rem', 
                            backgroundColor: 'var(--background)', 
                            borderRadius: '12px', 
                            marginBottom: '2rem',
                            textAlign: 'center',
                            border: '2px dashed var(--border)'
                        }}
                    >
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Join the conversation! Please log in to share your thoughts.
                        </p>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            style={{ 
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Log In to Comment
                        </motion.button>
                    </motion.div>
                )}

                {/* Enhanced Comments List */}
                <AnimatePresence>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comments.map((comment, index) => (
                            <motion.div 
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                whileHover={{ scale: 1.01 }}
                                style={{
                                    padding: '1.5rem',
                                    backgroundColor: 'var(--background)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    marginBottom: '0.75rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '0.875rem'
                                        }}>
                                            {comment.author.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                            {comment.author}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p style={{ 
                                    color: 'var(--text-main)', 
                                    lineHeight: '1.6',
                                    fontSize: '1rem'
                                }}>
                                    {comment.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {comments.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            textAlign: 'center', 
                            padding: '3rem 2rem',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ fontSize: '3rem', marginBottom: '1rem' }}
                        >
                            💬
                        </motion.div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                            No comments yet
                        </h4>
                        <p>Be the first to share your thoughts on this story!</p>
                    </motion.div>
                )}
            </motion.section>
        </motion.div>
    );
};

export default SimplePostDetail;