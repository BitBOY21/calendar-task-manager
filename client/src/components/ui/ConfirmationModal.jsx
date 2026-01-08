import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.title}>{title || 'Are you sure?'}</h3>
                    <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    <p style={styles.text}>{message || 'This action cannot be undone.'}</p>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                    <button onClick={onConfirm} style={styles.confirmBtn}>Delete</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // רקע כהה חצי שקוף
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)' // אפקט טשטוש מודרני לרקע
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    title: {
        margin: 0,
        fontSize: '1.2rem',
        color: '#333',
        fontWeight: '600'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#999'
    },
    body: {
        marginBottom: '25px',
        color: '#666',
        fontSize: '0.95rem',
        lineHeight: '1.5'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px'
    },
    cancelBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontWeight: '500',
        color: '#333',
        transition: 'background 0.2s'
    },
    confirmBtn: {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#dc3545', // צבע אדום למחיקה
        color: 'white',
        cursor: 'pointer',
        fontWeight: '500',
        boxShadow: '0 4px 10px rgba(220, 53, 69, 0.3)'
    }
};

export default ConfirmationModal;