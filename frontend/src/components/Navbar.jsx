import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Home, LogIn, UserPlus, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} style={{ position: 'relative' }}>
                <motion.div
                    className={`btn btn-ghost ${isActive ? 'active' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: isActive ? 600 : 500
                    }}
                >
                    <Icon size={18} />
                    {children}
                    {isActive && (
                        <motion.div
                            layoutId="navbar-indicator"
                            style={{
                                position: 'absolute',
                                bottom: -4,
                                left: 0,
                                right: 0,
                                height: '2px',
                                backgroundColor: 'var(--primary)',
                                borderRadius: '2px'
                            }}
                        />
                    )}
                </motion.div>
            </Link>
        );
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{ 
                backgroundColor: 'var(--surface)', 
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                padding: '0.75rem 0'
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.25rem' }}
                    >
                        <BookOpen size={24} />
                        <span>BlogSpace</span>
                    </motion.div>
                </Link>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <NavLink to="/" icon={Home}>Home</NavLink>
                    
                    {user ? (
                        <>
                            <NavLink to="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
                            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)', margin: '0 0.5rem' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <User size={16} />
                                <span>{user.username}</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="btn btn-ghost"
                                style={{ color: 'var(--danger)' }}
                            >
                                <LogOut size={18} />
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" icon={LogIn}>Login</NavLink>
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-primary"
                                >
                                    <UserPlus size={18} />
                                    Register
                                </motion.button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
