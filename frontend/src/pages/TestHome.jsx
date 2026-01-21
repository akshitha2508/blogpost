import React from 'react';

const TestHome = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Wryto Test</h1>
            <p>If you can see this, React is working!</p>
            <div style={{ 
                padding: '1rem', 
                margin: '1rem 0', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '8px' 
            }}>
                <p>Frontend server is running on localhost:5173</p>
                <p>Backend server is running on localhost:5000</p>
            </div>
        </div>
    );
};

export default TestHome;