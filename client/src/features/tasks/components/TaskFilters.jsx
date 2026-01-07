import React from 'react';
import { buttonSecondary } from '../../../components/ui/DesignSystem';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", 
    "Finance 💰", "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const TaskFilters = ({ 
    statusFilter, setStatusFilter, // can be object or separate props
    priorityFilter, setPriorityFilter,
    activeTags, toggleTag,
    // Support for object-based state (like in WorkView)
    filters, setFilters 
}) => {
    
    // Normalize props
    const currentStatus = filters ? filters.status : statusFilter;
    const currentPriority = filters ? filters.priority : priorityFilter;
    const currentTags = filters ? filters.tags : activeTags;

    const handleStatusChange = (val) => {
        if (setFilters) setFilters(prev => ({ ...prev, status: val }));
        else setStatusFilter(val);
    };

    const handlePriorityChange = (val) => {
        if (setFilters) setFilters(prev => ({ ...prev, priority: val }));
        else setPriorityFilter(val);
    };

    const handleTagToggle = (tag) => {
        if (setFilters) {
            const newTags = currentTags.includes(tag) 
                ? currentTags.filter(t => t !== tag) 
                : [...currentTags, tag];
            setFilters(prev => ({ ...prev, tags: newTags }));
        } else {
            toggleTag(tag);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <div style={styles.group}>
                    <span style={styles.label}>Status:</span>
                    {['All', 'Active', 'Completed'].map(status => {
                        const val = status.toLowerCase();
                        const isActive = currentStatus === val;
                        return (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(val)}
                                style={{
                                    ...styles.filterBtn,
                                    background: isActive ? 'linear-gradient(135deg, #007bff, #6f42c1)' : '#f1f3f5',
                                    color: isActive ? 'white' : '#555',
                                }}
                            >
                                {status}
                            </button>
                        );
                    })}
                </div>

                <div style={styles.divider}></div>

                <div style={styles.group}>
                    <span style={styles.label}>Priority:</span>
                    {['All', 'High', 'Medium', 'Low'].map(p => {
                        const val = p === 'All' ? 'all' : p;
                        const isActive = currentPriority === val;
                        return (
                            <button
                                key={p}
                                onClick={() => handlePriorityChange(val)}
                                style={{
                                    ...styles.filterBtn,
                                    background: isActive ? 'linear-gradient(135deg, #6c757d, #5a6268)' : '#f1f3f5',
                                    color: isActive ? 'white' : '#555',
                                }}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={styles.tagsRow}>
                <span style={styles.label}>Tags:</span>
                <div style={styles.tagsWrapper}>
                    {TAG_OPTIONS.map(tag => {
                        const isActive = currentTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                style={{
                                    ...styles.tagBtn,
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
    container: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
    group: { display: 'flex', alignItems: 'center', gap: '10px' },
    label: { fontWeight: '600', color: '#555', fontSize: '0.85rem', marginRight: '5px' },
    filterBtn: { ...buttonSecondary, padding: '6px 16px', fontWeight: '500' },
    divider: { width: '1px', height: '25px', backgroundColor: '#e0e0e0' },
    tagsRow: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
    tagsWrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    tagBtn: { border: '1px solid', padding: '5px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', backgroundColor: 'transparent', fontWeight: '500', transition: 'all 0.2s ease' }
};

export default TaskFilters;