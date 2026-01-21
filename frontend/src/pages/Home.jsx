import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Search, Filter, Eye, MessageCircle, Tag } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [searchTerm, selectedCategory, currentPage]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                per_page: 6,
                status: 'published'
            };
            
            if (searchTerm) params.search = searchTerm;
            if (selectedCategory !== 'all') params.category = selectedCategory;

            const response = await api.get('/posts', { params });
            
            // Handle both paginated and simple array responses
            if (response.data.posts) {
                setPosts(response.data.posts);
                setTotalPages(response.data.pages || 1);
            } else {
                setPosts(response.data);
                setTotalPages(1);
            }
            setError(null);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load posts. Please try again later.');
            // Set some sample posts for demo
            setPosts([
                {
                    id: 1,
                    title: 'Welcome to BlogSpace',
                    content: 'This is a sample blog post to get you started. Create your first post to see it here!',
                    author: 'Admin',
                    category: 'General',
                    tags: ['welcome', 'blog'],
                    views: 42,
                    created_at: new Date().toISOString()
                }
            ]);
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

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchPosts();
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const renderPostContent = (content) => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px;">$1</code>');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    if (loading && posts.length === 0) {
        return (
            <div className="container" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '2rem auto' }}></div>
                <p>Loading posts...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    marginBottom: '3rem', 
                    textAlign: 'center', 
                    padding: '4rem 2rem', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 'var(--radius)',
                    color: 'white',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Welcome to BlogSpace</h1>
                <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>Discover stories, thinking, and expertise from writers on any topic.</p>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: 'var(--radius)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Search
                    </motion.button>
                </form>
            </motion.div>
            
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

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={16} />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Filter by category:</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategoryChange('all')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            background: selectedCategory === 'all' ? 'var(--primary)' : 'white',
                            color: selectedCategory === 'all' ? 'white' : 'var(--text-main)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        All
                    </motion.button>
                    {categories.map(category => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategoryChange(category)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid var(--border)',
                                borderRadius: '20px',
                                background: selectedCategory === category ? 'var(--primary)' : 'white',
                                color: selectedCategory === category ? 'white' : 'var(--text-main)',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
            </div>
            
            <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}
            >
                {searchTerm ? `Search results for "${searchTerm}"` : 'Latest Stories'}
                {posts.length > 0 && (
                    <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '1rem' }}>
                        ({posts.length} post{posts.length !== 1 ? 's' : ''})
                    </span>
                )}
            </motion.h2>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}
            >
                {posts.map(post => (
                    <motion.div 
                        key={post.id} 
                        variants={itemVariants}
                        className="card"
                        whileHover={{ y: -5 }}
                        style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
                    >
                        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                            {post.image_url ? (
                                <img 
                                    src={`http://localhost:5000/uploads/${post.image_url}`} 
                                    alt={post.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            ) : post.video_url ? (
                                <video 
                                    src={`http://localhost:5000/uploads/${post.video_url}`} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    controls={false}
                                    muted
                                    onMouseOver={(e) => e.target.play()}
                                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                />
                            ) : (
                                <img 
                                    src={`https://picsum.photos/seed/${post.id}/600/400`} 
                                    alt={post.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                />
                            )}
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {/* Category Badge */}
                            <div style={{ marginBottom: '0.75rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: '#f1f5f9',
                                    color: 'var(--primary)',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                }}>
                                    {post.category || 'General'}
                                </span>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)', lineHeight: '1.3' }}>{post.title}</h2>
                            
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <User size={14} />
                                    <span>{post.author}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Calendar size={14} />
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                {post.views > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Eye size={14} />
                                        <span>{post.views}</span>
                                    </div>
                                )}
                            </div>

                            <div 
                                style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem', flex: 1 }}
                                dangerouslySetInnerHTML={{ 
                                    __html: renderPostContent(post.content.substring(0, 150) + '...') 
                                }}
                            />

                            {/* Tags */}
                            {Array.isArray(post.tags) && post.tags.length > 0 && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                    {post.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: '#f8fafc',
                                            color: 'var(--text-secondary)',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem'
                                        }}>
                                            <Tag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <motion.button 
                                className="btn btn-ghost"
                                whileHover={{ x: 5 }}
                                onClick={() => navigate(`/post/${post.id}`)}
                                style={{ padding: 0, color: 'var(--primary)', alignSelf: 'flex-start' }}
                            >
                                Read more <ArrowRight size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <motion.button
                            key={page}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                background: currentPage === page ? 'var(--primary)' : 'white',
                                color: currentPage === page ? 'white' : 'var(--text-main)',
                                cursor: 'pointer'
                            }}
                        >
                            {page}
                        </motion.button>
                    ))}
                </div>
            )}

            {posts.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
