import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 70px)' }}>
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    padding: '2rem' 
                }}
            >
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Join Wryto community today</p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fef2f2', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    className="input"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Choose a strong password"
                                    required
                                />
                            </div>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            className="btn"
                            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', backgroundColor: 'var(--success)', color: 'white' }}
                        >
                            <UserPlus size={18} />
                            Register
                        </motion.button>
                    </form>

                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login</Link>
                    </p>
                </div>
            </motion.div>

            <div style={{ 
                background: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderTopLeftRadius: '2rem',
                borderBottomLeftRadius: '2rem',
                margin: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                <div style={{ position: 'relative', zIndex: 1, color: 'white', padding: '2rem', maxWidth: '400px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>"Innovation distinguishes between a leader and a follower."</h3>
                    <p style={{ opacity: 0.8 }}>- Steve Jobs</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
