import React from 'react';
import { cardStyle, buttonSecondary, buttonActive, colors, gradients } from '../../components/ui/DesignSystem';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", 
    "Finance 💰", "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const SummaryFilters = ({ 
    statusFilter, setStatusFilter, // 'all', 'active', 'completed'
    activeTags, toggleTag,
    priorityFilter, setPriorityFilter // 'all', 'High', 'Medium', 'Low'
}) => {
    return (
        <div style={styles.container}>
            {/* Row 1: Status and Priority */}
            <div style={styles.row}>
                <div style={styles.group}>
                    <span style={styles.label}>Status:</span>
                    {['All', 'Active', 'Completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status.toLowerCase())}
                            style={{
                                ...styles.filterBtn,
                                background: statusFilter === status.toLowerCase() 
                                    ? 'linear-gradient(135deg, #007bff, #6f42c1)' 
                                    : '#f1f3f5',
                                color: statusFilter === status.toLowerCase() ? 'white' : '#555',
                                fontWeight: statusFilter === status.toLowerCase() ? '600' : '500'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div style={styles.divider}></div>

                <div style={styles.group}>
                    <span style={styles.label}>Priority:</span>
                    {['All', 'High', 'Medium', 'Low'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPriorityFilter(p === 'All' ? 'all' : p)}
                            style={{
                                ...styles.filterBtn,
                                background: priorityFilter === (p === 'All' ? 'all' : p) 
                                    ? 'linear-gradient(135deg, #6c757d, #5a6268)' 
                                    : '#f1f3f5',
                                color: priorityFilter === (p === 'All' ? 'all' : p) ? 'white' : '#555',
                                fontWeight: priorityFilter === (p === 'All' ? 'all' : p) ? '600' : '500'
                            }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Row 2: Tags */}
            <div style={styles.tagsRow}>
                <span style={styles.label}>Tags:</span>
                <div style={styles.tagsWrapper}>
                    {TAG_OPTIONS.map(tag => {
                        const isActive = activeTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                style={{
                                    ...styles.tagBtn,
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(0,123,255,0.15), rgba(111,66,193,0.15))'
                                        : 'transparent',
                                    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                                    color: isActive ? '#1565c0' : '#666',
                                    borderColor: isActive ? '#007bff' : '#e0e0e0',
                                    fontWeight: isActive ? '600' : '500'
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        ...cardStyle,
        marginBottom: '24px'
    },
    row: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
    },
    group: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px'
    },
    label: { 
        fontWeight: '700',
        color: '#333',
        fontSize: '0.9rem',
        marginRight: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    filterBtn: { 
        ...buttonSecondary,
        padding: '8px 18px'
    },
    divider: { 
        width: '1px', 
        height: '30px',
        backgroundColor: '#e0e0e0' 
    },
    
    tagsRow: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        flexWrap: 'wrap'
    },
    tagsWrapper: { 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px'
    },
    tagBtn: { 
        border: '1px solid', 
        padding: '6px 14px',
        borderRadius: '12px',
        cursor: 'pointer', 
        fontSize: '0.8rem', 
        backgroundColor: 'transparent',
        fontWeight: '500',
        transition: 'all 0.2s ease'
    }
};

export default SummaryFilters;