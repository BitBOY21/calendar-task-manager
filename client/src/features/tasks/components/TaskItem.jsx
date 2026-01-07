import React, { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Same tags as in the form
const TAG_OPTIONS = ["Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", "Finance 💰", "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"];

const TaskItem = ({ task, onDelete, onUpdate }) => {
    const [localSubtasks, setLocalSubtasks] = useState(task.subtasks || []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Edit Fields
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description || '');
    const [editSubtasks, setEditSubtasks] = useState(task.subtasks || []);
    const [editLocation, setEditLocation] = useState(task.location || ''); 
    const [editPriority, setEditPriority] = useState(task.priority || 'Medium');
    const [editTags, setEditTags] = useState(task.tags || []);
    
    // Times
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editEndTime, setEditEndTime] = useState('');

    // Sync Props
    useEffect(() => {
        setLocalSubtasks(task.subtasks || []);
        setEditTitle(task.title);
        setEditDesc(task.description || '');
        setEditSubtasks(task.subtasks || []);
        setEditLocation(task.location || '');
        setEditPriority(task.priority || 'Medium');
        setEditTags(task.tags || []);

        if (task.dueDate) {
            const d = new Date(task.dueDate);
            setEditDate(d.toISOString().slice(0, 10)); 
            setEditTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })); 
        } else {
            setEditDate('');
            setEditTime('');
        }

        if (task.endDate) {
            const endD = new Date(task.endDate);
            setEditEndTime(endD.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
        } else {
            setEditEndTime('');
        }
    }, [task]);

    // Save Handler
    const handleSave = () => {
        let finalDueDate = null;
        let finalEndDate = null;

        if (editDate) {
            finalDueDate = new Date(`${editDate}T${editTime || '09:00'}`);
            if (editEndTime) {
                finalEndDate = new Date(`${editDate}T${editEndTime}`);
            }
        }

        onUpdate(task._id, {
            title: editTitle,
            description: editDesc,
            subtasks: editSubtasks,
            location: editLocation,
            priority: editPriority,
            tags: editTags,
            dueDate: finalDueDate,
            endDate: finalEndDate
        });
        setIsEditing(false);
    };

    const handleQuickComplete = (e) => {
        e.stopPropagation();
        onUpdate(task._id, { isCompleted: !task.isCompleted, status: !task.isCompleted ? 'Completed' : 'Active' });
    };

    // Subtasks logic
    const handleSubtaskTextChange = (index, text) => {
        const updated = [...editSubtasks];
        updated[index].text = text;
        setEditSubtasks(updated);
    };
    const handleDeleteSubtask = (index) => {
        setEditSubtasks(editSubtasks.filter((_, i) => i !== index));
    };
    const handleAddSubtask = () => {
        setEditSubtasks([...editSubtasks, { text: '', isCompleted: false }]);
    };
    const toggleSubtask = (index) => {
        const newSubtasks = [...localSubtasks];
        newSubtasks[index].isCompleted = !newSubtasks[index].isCompleted;
        setLocalSubtasks(newSubtasks);
        onUpdate(task._id, { subtasks: newSubtasks });
    };

    // Tags Logic
    const handleAddTag = (e) => {
        const val = e.target.value;
        if (val && !editTags.includes(val)) {
            setEditTags([...editTags, val]);
        }
        e.target.value = "";
    };
    const handleRemoveTag = (tagToRemove) => {
        setEditTags(editTags.filter(t => t !== tagToRemove));
    };

    const getPriorityColor = (p) => {
        if (p === 'High') return '#ffebee';
        if (p === 'Medium') return '#fff3e0';
        return '#e8f5e9';
    };
    
    const getPriorityTextColor = (p) => {
        if (p === 'High') return '#c62828';
        if (p === 'Medium') return '#ef6c00';
        return '#2e7d32';
    };

    const completedCount = localSubtasks.filter(s => s.isCompleted).length;
    const totalCount = localSubtasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // --- Render Edit Mode ---
    if (isEditing) {
        return (
            <div style={styles.editContainer}>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={styles.editInputTitle} placeholder="Task Title" autoFocus />
                
                <div style={styles.editRow}>
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={styles.editInput} />
                    <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} style={styles.editInput} />
                    <span>-</span>
                    <input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} style={styles.editInput} />
                </div>

                <div style={styles.editRow}>
                    <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} style={styles.editSelect}>
                        <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                    </select>
                    <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="📍 Location" style={{...styles.editInput, flex: 1}} />
                </div>

                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description..." rows="2" style={styles.editTextarea} />

                {/* Subtasks Edit */}
                <div style={styles.subtasksEditBox}>
                    {editSubtasks.map((subtask, i) => (
                        <div key={i} style={{display: 'flex', gap: '5px', marginBottom: '5px'}}>
                            <input type="text" value={subtask.text} onChange={(e) => handleSubtaskTextChange(i, e.target.value)} style={styles.editSubtaskInput} />
                            <button onClick={() => handleDeleteSubtask(i)} style={styles.iconBtn}>🗑️</button>
                        </div>
                    ))}
                    <button onClick={handleAddSubtask} style={styles.addStepBtn}>+ Add Step</button>
                </div>

                <div style={styles.editActions}>
                    <button onClick={handleSave} style={styles.saveBtn}>Save</button>
                    <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                </div>
            </div>
        );
    }

    // --- Render View Mode (New Design) ---
    return (
        <div style={styles.taskRow} className="task-row-hover">
            {/* 1. Check Circle */}
            <div 
                onClick={handleQuickComplete}
                style={{
                    ...styles.checkCircle,
                    borderColor: task.isCompleted ? '#28a745' : '#ddd',
                    backgroundColor: task.isCompleted ? '#28a745' : 'transparent',
                }}
                title={task.isCompleted ? "Mark as Incomplete" : "Mark as Done"}
            >
                <FaCheck style={{...styles.checkIcon, color: task.isCompleted ? 'white' : 'transparent'}} />
            </div>

            {/* 2. Task Info */}
            <div style={styles.taskInfo} onClick={() => setIsExpanded(!isExpanded)}>
                <span style={{
                    ...styles.taskTitle,
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    color: task.isCompleted ? '#999' : '#333'
                }}>
                    {task.title}
                </span>
                
                <div style={styles.taskMeta}>
                    {task.dueDate && (
                        <span style={styles.metaItem}>
                            <FaClock style={{fontSize: '0.7rem', marginRight: '4px'}} />
                            {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    )}
                    {task.location && (
                        <span style={styles.metaItem}>
                            <FaMapMarkerAlt style={{fontSize: '0.7rem', marginRight: '4px'}} />
                            {task.location}
                        </span>
                    )}
                    {totalCount > 0 && (
                        <span style={styles.metaItem}>
                            📝 {completedCount}/{totalCount}
                        </span>
                    )}
                </div>
            </div>

            {/* 3. Actions & Priority */}
            <div style={styles.rightSide}>
                <span style={{
                    ...styles.priorityTag,
                    backgroundColor: getPriorityColor(task.priority),
                    color: getPriorityTextColor(task.priority),
                }}>
                    {task.priority}
                </span>
                
                <div style={styles.hoverActions}>
                    <button onClick={() => setIsEditing(true)} style={styles.iconActionBtn} title="Edit"><FaEdit /></button>
                    <button onClick={() => onDelete(task._id)} style={styles.iconActionBtn} title="Delete"><FaTrash /></button>
                </div>
                
                <button onClick={() => setIsExpanded(!isExpanded)} style={styles.expandBtn}>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {/* 4. Expanded Details */}
            {isExpanded && (
                <div style={styles.expandedDetails}>
                    {task.description && <div style={styles.descText}>{task.description}</div>}
                    
                    {task.tags && task.tags.length > 0 && (
                        <div style={styles.tagsRow}>
                            {task.tags.map(tag => <span key={tag} style={styles.tagPill}>{tag}</span>)}
                        </div>
                    )}

                    {totalCount > 0 && (
                        <div style={styles.subtasksList}>
                            <div style={styles.progressBar}><div style={{...styles.progressFill, width: `${progress}%`}} /></div>
                            {localSubtasks.map((subtask, i) => (
                                <div key={i} style={styles.subtaskRow} onClick={() => toggleSubtask(i)}>
                                    <div style={{
                                        ...styles.miniCheck,
                                        backgroundColor: subtask.isCompleted ? '#28a745' : 'transparent',
                                        borderColor: subtask.isCompleted ? '#28a745' : '#ccc'
                                    }}>
                                        {subtask.isCompleted && <FaCheck style={{fontSize: '8px', color: 'white'}} />}
                                    </div>
                                    <span style={{
                                        textDecoration: subtask.isCompleted ? 'line-through' : 'none',
                                        color: subtask.isCompleted ? '#999' : '#333',
                                        fontSize: '0.9rem'
                                    }}>
                                        {subtask.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    // --- View Mode Styles ---
    taskRow: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '12px 10px',
        borderBottom: '1px solid #f5f5f5',
        backgroundColor: 'white',
        transition: 'background-color 0.2s ease',
        position: 'relative'
    },
    checkCircle: {
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        border: '2px solid #ddd',
        marginRight: '15px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0,
    },
    checkIcon: { fontSize: '10px' },
    
    taskInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer', minWidth: '150px' },
    taskTitle: { fontSize: '0.95rem', fontWeight: '600', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    taskMeta: { fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '10px' },
    metaItem: { display: 'flex', alignItems: 'center' },

    rightSide: { display: 'flex', alignItems: 'center', gap: '10px' },
    priorityTag: { padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', minWidth: '60px', textAlign: 'center' },
    
    hoverActions: { display: 'flex', gap: '5px', opacity: 0, transition: 'opacity 0.2s' }, // Hidden by default, shown on hover via CSS
    iconActionBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '0.9rem', padding: '5px' },
    expandBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '0.8rem', padding: '5px' },

    // --- Expanded Details ---
    expandedDetails: { width: '100%', marginTop: '10px', paddingLeft: '37px', paddingRight: '10px', animation: 'fadeIn 0.2s ease' },
    descText: { fontSize: '0.9rem', color: '#555', marginBottom: '10px', lineHeight: '1.4' },
    tagsRow: { display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' },
    tagPill: { backgroundColor: '#f1f3f5', color: '#555', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px' },
    
    subtasksList: { backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '8px' },
    progressBar: { height: '4px', backgroundColor: '#e9ecef', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' },
    progressFill: { height: '100%', backgroundColor: '#28a745', transition: 'width 0.3s ease' },
    subtaskRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', cursor: 'pointer' },
    miniCheck: { width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    // --- Edit Mode Styles ---
    editContainer: { padding: '15px', border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '10px' },
    editInputTitle: { width: '100%', fontSize: '1rem', fontWeight: 'bold', padding: '8px', marginBottom: '10px', border: '1px solid #eee', borderRadius: '4px' },
    editRow: { display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' },
    editInput: { padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' },
    editSelect: { padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' },
    editTextarea: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', marginBottom: '10px', resize: 'vertical' },
    subtasksEditBox: { backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '6px', marginBottom: '10px' },
    editSubtaskInput: { flex: 1, padding: '5px', border: '1px solid #ddd', borderRadius: '4px' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer' },
    addStepBtn: { background: 'none', border: '1px dashed #007bff', color: '#007bff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', width: '100%' },
    editActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
    saveBtn: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer' },
    cancelBtn: { backgroundColor: '#eee', color: '#333', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer' }
};

export default TaskItem;