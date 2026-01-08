import React, { useState } from 'react';

const DeleteRecurringModal = ({ isOpen, onClose, onConfirm }) => {
    const [deletePolicy, setDeletePolicy] = useState('single'); // 'single' = This task, 'series' = All tasks

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(deletePolicy);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={styles.title}>Delete recurring task</h3>
                
                <div style={styles.content}>
                    <label style={styles.option}>
                        <input 
                            type="radio" 
                            name="deletePolicy" 
                            value="single" 
                            checked={deletePolicy === 'single'}
                            onChange={() => setDeletePolicy('single')}
                            style={styles.radio}
                        />
                        <span>This task</span>
                    </label>
                    
                    <label style={styles.option}>
                        <input 
                            type="radio" 
                            name="deletePolicy" 
                            value="series" 
                            checked={deletePolicy === 'series'}
                            onChange={() => setDeletePolicy('series')}
                            style={styles.radio}
                        />
                        <span>All tasks</span>
                    </label>
                </div>

                <div style={styles.actions}>
                    <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                    <button onClick={handleConfirm} style={styles.okBtn}>OK</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(2px)'
    },
    modal: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        width: '320px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    title: {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#333',
        textAlign: 'center'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    option: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        color: '#3c4043',
        padding: '8px',
        borderRadius: '6px',
        transition: 'background 0.1s',
        ':hover': { backgroundColor: '#f5f5f5' }
    },
    radio: {
        accentColor: '#1a73e8',
        width: '18px',
        height: '18px',
        cursor: 'pointer'
    },
    actions: {
        display: 'flex',
        justifyContent: 'center', // Center buttons
        gap: '12px',
        marginTop: '10px'
    },
    cancelBtn: {
        padding: '10px 24px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontWeight: '500',
        color: '#555',
        fontSize: '0.95rem',
        flex: 1, // Equal width
        transition: 'background 0.2s'
    },
    okBtn: {
        padding: '10px 24px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#1a73e8', // Blue primary color
        color: 'white',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.95rem',
        flex: 1, // Equal width
        boxShadow: '0 2px 5px rgba(26, 115, 232, 0.3)',
        transition: 'background 0.2s'
    }
};

export default DeleteRecurringModal;