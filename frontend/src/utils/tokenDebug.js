// Token debugging utility
export const debugToken = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('=== TOKEN DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    
    if (token) {
        try {
            const parts = token.split('.');
            console.log('Token parts:', parts.length);
            
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                console.log('Token payload:', payload);
                
                const currentTime = Date.now() / 1000;
                console.log('Current time:', currentTime);
                console.log('Token exp:', payload.exp);
                console.log('Token expired:', payload.exp < currentTime);
                console.log('Time until expiry:', payload.exp - currentTime, 'seconds');
            }
        } catch (error) {
            console.log('Token parsing error:', error);
        }
    }
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            console.log('User data:', userData);
        } catch (error) {
            console.log('User parsing error:', error);
        }
    }
    
    console.log('=== END DEBUG ===');
};

// Call this function in browser console to debug token issues
window.debugToken = debugToken;