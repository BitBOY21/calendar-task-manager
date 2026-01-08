import React from 'react';
import TaskItem from '../../features/tasks/components/TaskItem'; // Updated path

// קומפוננטת "מגירה" שנפתחת מצד ימין להצגת פרטי משימה
const TaskDrawer = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
    return (
        <>
            {/* שכבת הרקע הכהה (Overlay) - מכסה את שאר המסך */}
            <div 
                style={{
                    ...styles.overlay,
                    // אם המגירה פתוחה - הרקע נראה ולחיץ. אם סגורה - הוא שקוף ולא מפריע
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none'
                }} 
                onClick={onClose}
            />

            {/* המגירה עצמה - החלון הלבן שנכנס מצד ימין */}
            <div style={{
                ...styles.drawer,
                // אנימציית הכניסה: אם פתוח - במיקום 0. אם סגור - זז 100% ימינה (מחוץ למסך)
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
            }}>
                <div style={styles.header}>
                    <h3>Edit Task</h3>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {/* תוכן המגירה - מציג את המשימה או הודעה ריקה */}
                <div style={styles.content}>
                    {task ? (
                        <TaskItem 
                            task={task} 
                            onUpdate={onUpdate} 
                            onDelete={(id) => { onDelete(id); onClose(); }} 
                        />
                    ) : (
                        <p style={{padding: '20px', color: '#999'}}>No task selected</p>
                    )}
                </div>
            </div>
        </>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 998,
        transition: 'opacity 0.3s ease'
    },
    drawer: {
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '500px', // Wide and comfortable drawer
        maxWidth: '90%',
        backgroundColor: 'white',
        boxShadow: '-5px 0 30px rgba(0,0,0,0.1)',
        zIndex: 999,
        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', // Smooth animation
        display: 'flex', flexDirection: 'column'
    },
    header: {
        padding: '20px',
        borderBottom: '1px solid #eee',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    closeBtn: {
        background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666'
    },
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f9f9f9'
    }
};

export default TaskDrawer;