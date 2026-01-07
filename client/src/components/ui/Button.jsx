import React from 'react';

const Button = ({ children, onClick, variant = 'primary', size = 'medium', style = {}, title, disabled }) => {
    
    const baseStyle = {
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: disabled ? 0.6 : 1,
        ...style
    };

    const variants = {
        primary: {
            background: 'linear-gradient(135deg, #007bff, #6f42c1)',
            color: 'white',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(0,123,255,0.3)'
        },
        secondary: {
            backgroundColor: '#f1f3f5',
            color: '#555',
            borderRadius: '50px'
        },
        danger: {
            backgroundColor: '#ffebee',
            color: '#dc3545',
            borderRadius: '8px'
        },
        icon: {
            background: 'transparent',
            color: '#666',
            padding: '5px',
            borderRadius: '50%'
        },
        fab: {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #007bff, #6f42c1)',
            color: 'white',
            fontSize: '24px',
            boxShadow: '0 6px 20px rgba(0,123,255,0.4)',
            zIndex: 1000
        }
    };

    const sizes = {
        small: { padding: '4px 10px', fontSize: '0.85rem' },
        medium: { padding: '8px 20px', fontSize: '1rem' },
        large: { padding: '12px 30px', fontSize: '1.1rem' },
        icon: { padding: '8px', fontSize: '1.1rem' } // Special size for icon variant
    };

    const finalStyle = {
        ...baseStyle,
        ...variants[variant],
        ...(variant !== 'fab' ? sizes[variant === 'icon' ? 'icon' : size] : {})
    };

    return (
        <button onClick={onClick} style={finalStyle} title={title} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;