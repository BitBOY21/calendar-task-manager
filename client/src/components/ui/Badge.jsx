import React from 'react';

const Badge = ({ children, variant = 'default', style = {} }) => {
    
    const variants = {
        default: { backgroundColor: '#e3f2fd', color: '#007bff' },
        high: { backgroundColor: '#ffebee', color: '#dc3545' },
        medium: { backgroundColor: '#fff3e0', color: '#ef6c00' },
        low: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
        neutral: { backgroundColor: '#f8f9fa', color: '#666' }
    };

    // Auto-detect variant based on text content if not provided
    let activeVariant = variants[variant] || variants.default;
    
    if (variant === 'default' && typeof children === 'string') {
        const lower = children.toLowerCase();
        if (lower === 'high' || lower === 'urgent') activeVariant = variants.high;
        if (lower === 'medium') activeVariant = variants.medium;
        if (lower === 'low' || lower === 'completed') activeVariant = variants.low;
    }

    return (
        <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            ...activeVariant,
            ...style
        }}>
            {children}
        </span>
    );
};

export default Badge;