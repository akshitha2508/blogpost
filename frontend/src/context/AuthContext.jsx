import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            // Check if token is expired (basic check)
            try {
                const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
                const currentTime = Date.now() / 1000;
                
                if (tokenPayload.exp && tokenPayload.exp < currentTime) {
                    // Token is expired, clear it
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    console.log('Token expired, cleared from storage');
                } else {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                }
            } catch (error) {
                // If token parsing fails, clear it
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                console.log('Invalid token format, cleared from storage');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
            window.location.href = '/login';
        }
    };

    const isTokenValid = () => {
        if (!token) return false;
        
        try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return tokenPayload.exp && tokenPayload.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            loading, 
            isTokenValid 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
