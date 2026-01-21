import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.post('/auth/login', formData);
            login(response.data.user, response.data.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                minHeight: 'calc(100vh - 70px)',
                gap: '2rem',
                padding: '2rem'
            }}
            className="login-grid"
        >
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: '2rem' 
                }}
            >
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        style={{ marginBottom: '2rem', textAlign: 'center' }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                Welcome Back
                            </h2>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            >
                                <Sparkles size={28} style={{ color: 'var(--primary)' }} />
                            </motion.div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Sign in to continue your blogging journey
                        </p>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                style={{ 
                                    backgroundColor: '#fef2f2', 
                                    color: 'var(--danger)', 
                                    padding: '1rem', 
                                    borderRadius: '12px', 
                                    marginBottom: '1.5rem', 
                                    fontSize: '0.875rem',
                                    border: '1px solid #fecaca',
                                    boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        onSubmit={handleSubmit}
                    >
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem', 
                                fontSize: '0.875rem', 
                                fontWeight: '600',
                                color: 'var(--text-main)'
                            }}>
                                Username
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ 
                                    position: 'absolute', 
                                    left: '1rem', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: 'var(--text-secondary)' 
                                }} />
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type="text"
                                    className="input"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    style={{ 
                                        paddingLeft: '2.5rem',
                                        fontSize: '1rem',
                                        height: '48px'
                                    }}
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.5rem', 
                                fontSize: '0.875rem', 
                                fontWeight: '600',
                                color: 'var(--text-main)'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ 
                                    position: 'absolute', 
                                    left: '1rem', 
                                    top: '50%', 
                                    transform: 'translateY(-50%)', 
                                    color: 'var(--text-secondary)' 
                                }} />
                                <motion.input
                                    whileFocus={{ scale: 1.02 }}
                                    type={showPassword ? 'text' : 'password'}
                                    className="input"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ 
                                        paddingLeft: '2.5rem',
                                        paddingRight: '2.5rem',
                                        fontSize: '1rem',
                                        height: '48px'
                                    }}
                                    placeholder="Enter your password"
                                    required
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </motion.button>
                            </div>
                        </div>
                        
                        <motion.button 
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            disabled={isLoading}
                            className="btn btn-primary"
                            style={{ 
                                width: '100%', 
                                justifyContent: 'center', 
                                padding: '0.875rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                height: '48px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    ⚡ Signing in...
                                </motion.div>
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        style={{ 
                            marginTop: '2rem', 
                            textAlign: 'center', 
                            fontSize: '0.875rem', 
                            color: 'var(--text-secondary)' 
                        }}
                    >
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            style={{ 
                                color: 'var(--primary)', 
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}
                        >
                            Create one now
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="login-hero"
                style={{ 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9)), url(https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Floating elements */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [-20, -100, -20],
                                x: [0, 30, 0],
                                opacity: [0, 0.3, 0]
                            }}
                            transition={{
                                duration: 4 + i,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                            style={{
                                position: 'absolute',
                                left: `${10 + i * 12}%`,
                                top: '100%',
                                width: '6px',
                                height: '6px',
                                backgroundColor: 'rgba(255,255,255,0.4)',
                                borderRadius: '50%'
                            }}
                        />
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{ 
                        position: 'relative', 
                        zIndex: 1, 
                        color: 'white', 
                        padding: '3rem', 
                        maxWidth: '400px', 
                        textAlign: 'center' 
                    }}
                >
                    <motion.h3 
                        style={{ 
                            fontSize: '1.8rem', 
                            fontWeight: '700', 
                            marginBottom: '1.5rem',
                            lineHeight: '1.3'
                        }}
                    >
                        "The only way to do great work is to love what you do."
                    </motion.h3>
                    <motion.p 
                        style={{ 
                            opacity: 0.9, 
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}
                    >
                        - Steve Jobs
                    </motion.p>
                    
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ 
                            marginTop: '2rem',
                            fontSize: '2rem'
                        }}
                    >
                        ✨
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Login;
