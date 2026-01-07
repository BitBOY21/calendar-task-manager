import React from 'react';

const Card = ({ children, className = '', style = {}, onClick }) => {
    return (
        <div 
            onClick={onClick}
            style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                border: '1px solid #f0f0f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                ...style
            }}
            className={className}
        >
            {children}
        </div>
    );
};

export default Card;