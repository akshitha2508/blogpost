import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, User, Tag, Image, Video, Sparkles, TrendingUp } from 'lucide-react';
import api from '../api';

const SimpleHome = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            console.log('Fetching posts from:', 'http://localhost:5000/api/posts');
            const response = await api.get('/posts');
            console.log('API Response:', response.data);
            
            // Handle both paginated and simple array responses
            if (response.data.posts) {
                setPosts(response.data.posts);
            } else {
                setPosts(response.data);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching posts:', error);
            console.error('Error details:', error.response?.data, error.response?.status);
            setError('Failed to load posts. Please try again later.');
            // Set some sample posts for demo
            setPosts([
                {
                    id: 1,
                    title: 'Welcome to BlogSpace',
                    content: 'This is a sample blog post to get you started. Create your first post to see it here!',
                    author: 'Admin',
                    category: 'General',
                    created_at: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-transition" style={{ padding: '2rem' }}>
                {/* Hero Skeleton */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ 
                        textAlign: 'center', 
                        padding: '3rem 2rem', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        marginBottom: '3rem'
                    }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Sparkles size={24} />
                        Loading amazing content...
                    </motion.div>
                </motion.div>

                {/* Posts Skeleton */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                    gap: '2rem' 
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid var(--border)'
                            }}
                        >
                            <div style={{ 
                                height: '220px', 
                                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s infinite'
                            }} />
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ 
                                    height: '24px', 
                                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: '4px',
                                    marginBottom: '1rem'
                                }} />
                                <div style={{ 
                                    height: '16px', 
                                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: '4px',
                                    width: '60%',
                                    marginBottom: '1rem'
                                }} />
                                <div style={{ 
                                    height: '60px', 
                                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'shimmer 1.5s infinite',
                                    borderRadius: '4px'
                                }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="page-transition" 
            style={{ padding: '2rem', minHeight: '100vh' }}
        >
            {/* Enhanced Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ 
                    textAlign: 'center', 
                    padding: '4rem 2rem', 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    borderRadius: '20px',
                    color: 'white',
                    marginBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Floating particles effect */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-20, -100, -20],
                                x: [0, 30, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 4 + i,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                            style={{
                                position: 'absolute',
                                left: `${20 + i * 15}%`,
                                top: '100%',
                                width: '4px',
                                height: '4px',
                                backgroundColor: 'rgba(255,255,255,0.3)',
                                borderRadius: '50%'
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <motion.h1 
                        style={{ 
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                            marginBottom: '1rem',
                            fontWeight: '700',
                            background: 'linear-gradient(45deg, #fff, #e0e7ff)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Welcome to Wryto
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            style={{ display: 'inline-block', marginLeft: '0.5rem' }}
                        >
                            ✨
                        </motion.span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ 
                            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', 
                            opacity: 0.9,
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Discover stories, thinking, and expertise from writers on any topic.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        style={{ 
                            display: 'flex', 
                            gap: '1rem', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            marginTop: '2rem',
                            flexWrap: 'wrap'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                            <TrendingUp size={20} />
                            <span>{posts.length} Stories</span>
                        </div>
                        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
                            <Sparkles size={20} />
                            <span>Fresh Content Daily</span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
            
            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ 
                        backgroundColor: '#fef2f2', 
                        border: '1px solid #fecaca', 
                        color: '#dc2626', 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        marginBottom: '2rem',
                        boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)'
                    }}
                >
                    {error}
                </motion.div>
            )}
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ marginBottom: '2rem' }}
            >
                <h2 style={{ 
                    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <TrendingUp size={28} style={{ color: 'var(--primary)' }} />
                    Latest Stories
                </h2>
            </motion.div>
            
            {/* Enhanced Posts Grid */}
            <AnimatePresence>
                <motion.div 
                    layout
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                        gap: '2rem'
                    }}
                    className="posts-grid"
                >
                    {posts.map((post, index) => (
                        <motion.div 
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ 
                                duration: 0.5, 
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{ 
                                y: -8,
                                transition: { duration: 0.2 }
                            }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                                border: '1px solid var(--border)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                            onClick={() => navigate(`/post/${post.id}`)}
                        >
                            {/* Media Section with Overlay */}
                            <div style={{ 
                                height: '220px', 
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {post.image_url ? (
                                    <>
                                        <motion.img 
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                            src={`http://localhost:5000/uploads/${post.image_url}`} 
                                            alt={post.title}
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <Image size={16} style={{ color: 'var(--primary)' }} />
                                        </div>
                                    </>
                                ) : post.video_url ? (
                                    <>
                                        <motion.video 
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                            src={`http://localhost:5000/uploads/${post.video_url}`} 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover'
                                            }}
                                            muted
                                            poster=""
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <Video size={16} style={{ color: 'var(--primary)' }} />
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ 
                                        height: '100%',
                                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#64748b',
                                        fontSize: '1.1rem',
                                        fontWeight: '500'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Sparkles size={32} style={{ marginBottom: '0.5rem', opacity: 0.6 }} />
                                            <div>Story Content</div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Gradient overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '60px',
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.1))'
                                }} />
                            </div>
                            
                            <div style={{ padding: '1.5rem' }}>
                                <motion.h3 
                                    style={{ 
                                        fontSize: '1.4rem', 
                                        marginBottom: '0.75rem', 
                                        color: 'var(--text-main)',
                                        fontWeight: '600',
                                        lineHeight: '1.3',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {post.title}
                                </motion.h3>
                                
                                <div style={{ 
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    fontSize: '0.875rem', 
                                    color: 'var(--text-secondary)', 
                                    marginBottom: '1rem',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <User size={14} />
                                        <span>{post.author}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={14} />
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {post.category && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.25rem',
                                            backgroundColor: 'var(--primary)',
                                            color: 'white',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            <Tag size={12} />
                                            <span>{post.category}</span>
                                        </div>
                                    )}
                                </div>

                                <p style={{ 
                                    color: 'var(--text-secondary)', 
                                    lineHeight: '1.6', 
                                    marginBottom: '1.5rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {post.content.substring(0, 150)}...
                                </p>

                                <motion.button 
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/post/${post.id}`);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.25rem',
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Read Story
                                    <ArrowRight size={16} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {posts.length === 0 && !loading && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                        textAlign: 'center', 
                        padding: '4rem 2rem',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        border: '2px dashed var(--border)',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Sparkles size={48} style={{ marginBottom: '1rem', opacity: 0.6 }} />
                    </motion.div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        No stories yet
                    </h3>
                    <p>Be the first to share your amazing story with the world!</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SimpleHome;