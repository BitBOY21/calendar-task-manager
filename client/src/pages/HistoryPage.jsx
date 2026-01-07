import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext'; 
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { FaSearch, FaUndo } from 'react-icons/fa';

const HistoryPage = () => { 
    const { tasks, updateTask } = useTaskContext();
    const [searchQuery, setSearchQuery] = useState('');
    
    const completedTasks = tasks
        .filter(task => task.isCompleted)
        .filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt);
            const dateB = new Date(b.updatedAt || b.createdAt);
            return dateB - dateA;
        });

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRestore = async (id) => {
        await updateTask(id, { isCompleted: false });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">History</span> 📜
                </h1>
                <p style={styles.subtitle}>View and restore completed tasks</p>
            </div>

            <Card style={{ marginBottom: '24px', padding: '20px' }}>
                <div style={styles.searchContainer}>
                    <FaSearch style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search completed tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
            </Card>

            <Card style={{ padding: '25px' }}>
                <h3 style={styles.listTitle}>
                    Completed Tasks ({completedTasks.length})
                </h3>
                
                {completedTasks.length > 0 ? (
                    <div style={styles.listContainer}>
                        {completedTasks.map(task => (
                            <div key={task._id} style={styles.taskRow}>
                                <div style={styles.taskContent}>
                                    <div style={styles.taskHeader}>
                                        <span style={styles.taskTitle}>{task.title}</span>
                                        <span style={styles.taskDate}>
                                            {formatDate(task.updatedAt || task.createdAt)}
                                        </span>
                                    </div>
                                    {task.description && (
                                        <p style={styles.taskDescription}>{task.description}</p>
                                    )}
                                    <div style={styles.taskMeta}>
                                        {task.priority && (
                                            <Badge variant={task.priority.toLowerCase()}>{task.priority}</Badge>
                                        )}
                                        {task.tags && task.tags.map(tag => (
                                            <Badge key={tag} variant="neutral">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button 
                                    variant="secondary" 
                                    onClick={() => handleRestore(task._id)}
                                    style={{ border: '1px solid #007bff', color: '#007bff', background: 'transparent' }}
                                >
                                    <FaUndo /> Restore
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        {searchQuery ? 'No tasks match your search.' : 'No completed tasks yet.'}
                    </div>
                )}
            </Card>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
        // Removed backgroundColor
        height: '100%', 
        overflowY: 'auto',
        paddingBottom: '80px' 
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center'
    },
    subtitle: {
        color: '#666',
        fontSize: '1.1rem',
        fontWeight: '400'
    },
    searchContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    searchIcon: {
        position: 'absolute',
        left: '18px',
        color: '#999',
        fontSize: '1rem'
    },
    searchInput: {
        width: '100%',
        padding: '12px 18px 12px 45px',
        borderRadius: '12px',
        border: '1px solid #eee',
        fontSize: '1rem',
        outline: 'none',
        backgroundColor: '#f8f9fa'
    },
    listTitle: {
        fontSize: '1.3rem',
        color: '#333',
        fontWeight: '700',
        marginBottom: '24px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '12px'
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    taskRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        transition: 'all 0.2s ease',
        gap: '16px'
    },
    taskContent: {
        flex: 1,
        minWidth: 0
    },
    taskHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '8px'
    },
    taskTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333',
        textDecoration: 'line-through',
        opacity: 0.7,
        wordBreak: 'break-word'
    },
    taskDate: {
        fontSize: '0.85rem',
        color: '#999',
        fontWeight: '500',
        whiteSpace: 'nowrap'
    },
    taskDescription: {
        fontSize: '0.95rem',
        color: '#666',
        marginBottom: '12px',
        lineHeight: '1.5',
        wordBreak: 'break-word'
    },
    taskMeta: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#999',
        fontSize: '1rem',
        fontStyle: 'italic'
    }
};

export default HistoryPage;