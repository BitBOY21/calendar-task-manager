import React, { useState, useRef, useEffect } from 'react';
import { buttonSecondary } from '../../../components/ui/DesignSystem';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", 
    "Finance 💰", "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const TaskFilters = ({ 
    statusFilter, setStatusFilter, // can be object or separate props
    priorityFilter, setPriorityFilter,
    activeTags, toggleTag,
    // Support for object-based state (like in WorkView)
    filters, setFilters,
    showTitle = false // New prop to control visibility of the header and extra filters
}) => {
    
    // Normalize props
    const currentStatus = filters ? filters.status : statusFilter;
    const currentPriority = filters ? filters.priority : priorityFilter;
    const currentTags = filters ? filters.tags : activeTags;
    const currentSearch = filters ? filters.search : '';
    const currentDate = filters ? filters.date : 'all'; 
    const customStartDate = filters ? filters.customStartDate : '';
    const customEndDate = filters ? filters.customEndDate : '';

    const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
    const tagsDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
                setIsTagsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const handleSearchChange = (e) => {
        if (setFilters) setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleDateChange = (val) => {
        if (setFilters) setFilters(prev => ({ ...prev, date: val }));
    };

    const handleCustomStartDateChange = (e) => {
        if (setFilters) setFilters(prev => ({ ...prev, customStartDate: e.target.value }));
    };

    const handleCustomEndDateChange = (e) => {
        if (setFilters) setFilters(prev => ({ ...prev, customEndDate: e.target.value }));
    };

    const handleResetAll = () => {
        if (setFilters) {
            setFilters({
                status: 'all',
                priority: 'all',
                tags: [],
                search: '',
                date: 'all',
                customStartDate: '',
                customEndDate: ''
            });
        } else {
            setStatusFilter('all');
            setPriorityFilter('all');
        }
    };

    const getPriorityColor = (priority, isActive) => {
        if (!isActive) return '#f1f3f5';
        switch (priority) {
            case 'High': return '#ff4d4d'; // Red
            case 'Medium': return '#ffad33'; // Orange/Yellow
            case 'Low': return '#28a745'; // Green
            case 'All': return 'linear-gradient(135deg, #007bff, #6f42c1)'; // Same as Status All
            default: return '#6c757d';
        }
    };

    return (
        <div style={styles.container}>
            {showTitle && (
                <>
                    <div style={styles.headerRow}>
                        <h4 style={styles.headerTitle}>Filter Tasks</h4>
                        <button onClick={handleResetAll} style={styles.resetBtn}>
                            Reset All
                        </button>
                    </div>
                    
                    <div style={styles.searchRow}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#999" />
                            <input 
                                type="text" 
                                placeholder="Search task..." 
                                value={currentSearch || ''}
                                onChange={handleSearchChange}
                                style={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.group}>
                            <span style={styles.label}>Days:</span>
                            <div style={styles.dateBtnGroup}>
                                {['Today', 'Week', 'Month', 'Custom'].map(d => {
                                    const val = d.toLowerCase();
                                    const isActive = currentDate === val;
                                    return (
                                        <button
                                            key={d}
                                            onClick={() => handleDateChange(val)}
                                            style={{
                                                ...styles.filterBtn,
                                                background: isActive ? 'linear-gradient(135deg, #28a745, #20c997)' : '#f1f3f5',
                                                color: isActive ? 'white' : '#555',
                                                flex: 1,
                                                textAlign: 'center',
                                                padding: '6px 8px',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {d}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {currentDate === 'custom' && (
                        <div style={styles.customDateRow}>
                             <div style={styles.dateInputGroup}>
                                <span style={styles.dateLabel}>From:</span>
                                <input 
                                    type="date" 
                                    value={customStartDate || ''}
                                    onChange={handleCustomStartDateChange}
                                    style={styles.dateInput}
                                />
                             </div>
                             <div style={styles.dateInputGroup}>
                                <span style={styles.dateLabel}>To:</span>
                                <input 
                                    type="date" 
                                    value={customEndDate || ''}
                                    onChange={handleCustomEndDateChange}
                                    style={styles.dateInput}
                                />
                             </div>
                        </div>
                    )}
                </>
            )}

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
            </div>
            
            <div style={styles.row}>
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
                                    background: getPriorityColor(p, isActive),
                                    color: isActive ? 'white' : '#555',
                                }}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            </div>

            {showTitle ? (
                <div style={styles.row}>
                    <div style={styles.group}>
                        <span style={styles.label}>Tags:</span>
                        <div style={{ position: 'relative', width: '100%' }} ref={tagsDropdownRef}>
                            <button 
                                onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                                style={styles.multiSelectBtn}
                            >
                                {currentTags.length > 0 
                                    ? `${currentTags.length} Selected` 
                                    : 'Select Tags'}
                                <FaChevronDown size={12} color="#666" />
                            </button>
                            
                            {isTagsDropdownOpen && (
                                <div style={styles.dropdownMenu}>
                                    {TAG_OPTIONS.map(tag => {
                                        const isActive = currentTags.includes(tag);
                                        return (
                                            <div 
                                                key={tag} 
                                                onClick={() => handleTagToggle(tag)}
                                                style={{
                                                    ...styles.dropdownItem,
                                                    backgroundColor: isActive ? '#e3f2fd' : 'white',
                                                    color: isActive ? '#1565c0' : '#333'
                                                }}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={isActive} 
                                                    readOnly 
                                                    style={{ marginRight: '8px', cursor: 'pointer' }}
                                                />
                                                {tag}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
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
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '15px' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' },
    headerTitle: { margin: 0, fontSize: '0.9rem', fontWeight: '700', color: 'black', letterSpacing: '0.5px' },
    resetBtn: { 
        background: '#f8f9fa', 
        border: '1px solid #ddd', 
        color: '#333', 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        cursor: 'pointer', 
        padding: '4px 10px', 
        borderRadius: '4px',
        transition: 'all 0.2s'
    },
    
    searchRow: { marginBottom: '5px' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8f9fa', padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee', width: '100%' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '100%', color: '#333' },

    row: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
    group: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' },
    label: { fontWeight: '700', color: '#888', fontSize: '0.75rem', marginRight: '5px', minWidth: '60px', letterSpacing: '0.5px' },
    filterBtn: { ...buttonSecondary, padding: '6px 16px', fontWeight: '500', fontSize: '0.85rem' },
    divider: { width: '1px', height: '25px', backgroundColor: '#e0e0e0' },
    
    dateBtnGroup: { display: 'flex', gap: '5px', width: '100%' },
    
    customDateRow: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '-5px' },
    dateInputGroup: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
    dateLabel: { fontSize: '0.7rem', color: '#666', fontWeight: '600' },
    dateInput: { padding: '6px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', color: '#555', outline: 'none', width: '100%' },

    tagsRow: { display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' },
    tagsWrapper: { display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 },
    tagBtn: { border: '1px solid', padding: '5px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', backgroundColor: 'transparent', fontWeight: '500', transition: 'all 0.2s ease' },

    multiSelectBtn: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: '#555'
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        width: '100%',
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginTop: '4px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    dropdownItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
    }
};

export default TaskFilters;