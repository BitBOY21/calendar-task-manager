import React, { useState, useEffect } from 'react';
import { FaCheck, FaClock, FaMapMarkerAlt, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaCalendarAlt } from 'react-icons/fa';

// Same tags as in the form
const TAG_OPTIONS = ["Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", "Finance 💰", "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"];

const TaskItem = ({ task, onDelete, onUpdate, onEdit }) => {
    const [localSubtasks, setLocalSubtasks] = useState(task.subtasks || []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isHoveringCheck, setIsHoveringCheck] = useState(false);
    
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

    const handleQuickComplete = async (e) => {
        e.stopPropagation();
        const newCompletedState = !task.isCompleted;
        await onUpdate(task._id, { isCompleted: newCompletedState });
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

    // Updated colors to match TaskFilters
    const getPriorityColor = (p) => {
        if (p === 'High') return '#ff4d4d'; // Red
        if (p === 'Medium') return '#ffad33'; // Orange/Yellow
        if (p === 'Low') return '#28a745'; // Green
        return '#6c757d';
    };
    
    const getPriorityTextColor = (p) => {
        return 'white'; // White text for better contrast with vibrant colors
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

    // --- Render View Mode (Compact Design) ---
    return (
        <div style={styles.taskRow} className="task-row-hover" onClick={() => setIsExpanded(!isExpanded)}>
            {/* 1. Check Circle */}
            <div 
                onClick={handleQuickComplete}
                onMouseEnter={() => setIsHoveringCheck(true)}
                onMouseLeave={() => setIsHoveringCheck(false)}
                style={{
                    ...styles.checkCircle,
                    borderColor: task.isCompleted ? '#28a745' : (isHoveringCheck ? '#28a745' : '#ddd'),
                    backgroundColor: task.isCompleted ? '#28a745' : 'transparent',
                }}
                title={task.isCompleted ? "Mark as Incomplete" : "Mark as Done"}
            >
                <FaCheck style={{
                    ...styles.checkIcon, 
                    color: task.isCompleted ? 'white' : (isHoveringCheck ? '#28a745' : 'transparent')
                }} />
            </div>

            {/* 2. Center Content */}
            <div style={styles.centerContent}>
                {/* Row 1: Title */}
                <span style={{
                    ...styles.taskTitle,
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    color: task.isCompleted ? '#999' : '#333'
                }}>
                    {task.title}
                </span>
                
                {/* Row 2: Metadata (Priority + Date + Time + Location) */}
                <div style={styles.metaRow}>
                    <span style={{
                        ...styles.priorityPill,
                        backgroundColor: getPriorityColor(task.priority),
                        color: getPriorityTextColor(task.priority),
                    }}>
                        {task.priority}
                    </span>

                    {task.dueDate && (
                        <span style={styles.metaItem}>
                            <FaCalendarAlt style={{fontSize: '0.7rem'}} />
                            {new Date(task.dueDate).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit'})}
                        </span>
                    )}
                    
                    {task.dueDate && (
                        <span style={styles.metaItem}>
                            <FaClock style={{fontSize: '0.7rem'}} />
                            {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    )}

                    {task.location && (
                        <span style={styles.metaItem}>
                            <FaMapMarkerAlt style={{fontSize: '0.7rem'}} />
                            {task.location}
                        </span>
                    )}
                </div>
            </div>

            {/* 3. Right Side (Actions) */}
            <div style={styles.rightActions}>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) {
                            onEdit(task);
                        } else {
                            setIsEditing(true);
                        }
                    }} 
                    style={styles.actionIconBtn} 
                    title="Edit"
                >
                    <FaEdit />
                </button>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        // Ensure we send the ID as a string. If it's an object, convert it.
                        const idToSend = typeof task._id === 'object' ? task._id.toString() : task._id;
                        onDelete(idToSend); 
                    }} 
                    style={styles.actionIconBtn} 
                    title="Delete"
                >
                    <FaTrash />
                </button>
            </div>

            {/* 4. Expanded Details (Conditional) */}
            {isExpanded && (
                <div style={styles.expandedDetails} onClick={(e) => e.stopPropagation()}>
                    {/* Details Section */}
                    {task.description && (
                        <div style={{ marginBottom: '12px' }}>
                            <div style={styles.sectionHeader}>Details:</div>
                            <div style={{...styles.descText, whiteSpace: 'pre-wrap'}}>{task.description}</div>
                        </div>
                    )}
                    
                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                        <div style={styles.tagsRow}>
                            {task.tags.map(tag => <span key={tag} style={styles.tagPill}>{tag}</span>)}
                        </div>
                    )}

                    {/* Subtasks Section */}
                    {totalCount > 0 && (
                        <div style={styles.subtasksList}>
                            <div style={styles.sectionHeader}>Subtasks:</div>
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
    // --- View Mode Styles (תצוגה רגילה) ---
    
    // השורה הראשית של המשימה
    taskRow: {
        display: 'flex',
        flexWrap: 'wrap', // מאפשר שבירת שורות אם התוכן ארוך
        alignItems: 'flex-start', // יישור למעלה (חשוב כשיש תיאור ארוך)
        padding: '12px 16px', // ריווח פנימי נוח
        borderBottom: '1px solid #f0f0f0', // קו מפריד עדין בין משימות
        backgroundColor: 'white',
        transition: 'background-color 0.2s ease', // אנימציה חלקה ב-Hover
        position: 'relative',
        cursor: 'pointer', // מראה שזה לחיץ
        gap: '12px' // מרווח בין האלמנטים (צ'קבוקס, תוכן, כפתורים)
    },
    
    // עיגול הצ'קבוקס (לסימון בוצע/לא בוצע)
    checkCircle: {
        width: '20px',
        height: '20px',
        borderRadius: '50%', // הופך את הריבוע לעיגול מושלם
        border: '2px solid #ddd',
        marginTop: '2px', // יישור אופטי מול השורה הראשונה של הטקסט
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        flexShrink: 0, // מונע מהעיגול להתכווץ אם אין מקום
    },
    checkIcon: { fontSize: '10px' },
    
    // האזור המרכזי (כותרת + מידע נוסף)
    centerContent: {
        flex: 1, // תופס את כל המקום הפנוי
        display: 'flex',
        flexDirection: 'column', // מסדר את הכותרת מעל המידע הנוסף
        gap: '4px',
        minWidth: 0 // טריק ב-Flexbox שמאפשר לטקסט להתקצר עם ...
    },
    
    // כותרת המשימה
    taskTitle: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#333',
        lineHeight: '1.4' // גובה שורה לקריאות טובה
    },
    
    // שורת המידע (תאריך, שעה, מיקום, עדיפות)
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px', // מרווח בין הפריטים השונים
        fontSize: '0.75rem', // טקסט קטן יותר למידע משני
        color: '#666',
        flexWrap: 'wrap' // יורד שורה אם אין מקום
    },
    
    // תווית העדיפות (High/Medium/Low)
    priorityPill: {
        padding: '1px 6px',
        borderRadius: '4px',
        fontSize: '0.65rem',
        fontWeight: '600',
        textTransform: 'uppercase', // אותיות גדולות
        letterSpacing: '0.5px'
    },
    
    // פריט מידע בודד (אייקון + טקסט)
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },

    // כפתורי הפעולה בצד ימין (עריכה, מחיקה)
    rightActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: 0.6, // שקוף חלקית כברירת מחדל (פחות בולט)
        transition: 'opacity 0.2s'
    },
    actionIconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#999',
        fontSize: '0.9rem',
        padding: '6px',
        borderRadius: '4px',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ':hover': {
            backgroundColor: '#f5f5f5',
            color: '#333'
        }
    },

    // --- Expanded Details (פירוט מורחב שנפתח בלחיצה) ---
    
    expandedDetails: {
        width: '100%',
        marginTop: '0px',
        paddingLeft: '32px', // הזחה שמאלה כדי להתיישר עם הטקסט (מתחת לצ'קבוקס)
        animation: 'fadeIn 0.2s ease', // אנימציית כניסה
        cursor: 'default' // סמן רגיל (לא יד)
    },
    sectionHeader: {
        fontSize: '0.85rem',
        fontWeight: 'bold',
        color: '#555',
        marginBottom: '4px',
        marginTop: '10px'
    },
    descText: { 
        fontSize: '0.9rem', 
        color: '#555', 
        marginBottom: '10px', 
        lineHeight: '1.5' 
    },
    tagsRow: { 
        display: 'flex', 
        gap: '6px', 
        marginBottom: '10px', 
        flexWrap: 'wrap' 
    },
    tagPill: { 
        backgroundColor: '#e9ecef', 
        color: '#495057', 
        fontSize: '0.75rem', 
        padding: '2px 8px', 
        borderRadius: '12px' 
    },
    
    // רשימת תתי-המשימות
    subtasksList: { 
        backgroundColor: '#f8f9fa', // רקע אפור בהיר להפרדה
        borderRadius: '8px',
        marginTop: '10px' 
    },
    subtaskRow: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '6px', 
        cursor: 'pointer', 
        padding: '4px 0' 
    },
    miniCheck: { 
        width: '16px', 
        height: '16px', 
        borderRadius: '4px', // ריבוע עם פינות עגולות
        border: '1px solid #ccc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },

    // --- Edit Mode Styles (מצב עריכה מהירה) ---
    
    editContainer: { 
        padding: '15px', 
        border: '1px solid #007bff', // מסגרת כחולה שמסמנת עריכה
        borderRadius: '8px', 
        backgroundColor: '#fff', 
        marginBottom: '10px' 
    },
    editInputTitle: { 
        width: '100%', 
        fontSize: '1rem', 
        fontWeight: 'bold', 
        padding: '8px', 
        marginBottom: '10px', 
        border: '1px solid #eee', 
        borderRadius: '4px' 
    },
    editRow: { 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '10px', 
        alignItems: 'center' 
    },
    editInput: { 
        padding: '6px', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        fontSize: '0.9rem' 
    },
    editSelect: { 
        padding: '6px', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        fontSize: '0.9rem' 
    },
    editTextarea: { 
        width: '100%', 
        padding: '8px', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        fontSize: '0.9rem', 
        marginBottom: '10px', 
        resize: 'vertical' // מאפשר למשתמש לשנות את הגובה
    },
    subtasksEditBox: { 
        backgroundColor: '#f9f9f9', 
        padding: '10px', 
        borderRadius: '6px', 
        marginBottom: '10px' 
    },
    editSubtaskInput: { 
        flex: 1, 
        padding: '5px', 
        border: '1px solid #ddd', 
        borderRadius: '4px' 
    },
    iconBtn: { 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer' 
    },
    addStepBtn: { 
        background: 'none', 
        border: '1px dashed #007bff', // מסגרת מקווקוות
        color: '#007bff', 
        padding: '5px 10px', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontSize: '0.85rem', 
        width: '100%' 
    },
    editActions: { 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'flex-end' // מיישר את כפתורי השמירה לשמאל (או ימין תלוי ב-RTL/LTR)
    },
    saveBtn: { 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        padding: '6px 15px', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    },
    cancelBtn: { 
        backgroundColor: '#eee', 
        color: '#333', 
        border: 'none', 
        padding: '6px 15px', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    }
};

export default TaskItem;