import React, { useState, useEffect, useRef } from 'react';
import { taskService } from '../../../services/taskService';
import { FaTimes, FaMagic, FaTrash, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaTag, FaChevronDown, FaFlag, FaListUl, FaAlignLeft, FaPen, FaPlus, FaRedo } from 'react-icons/fa';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", "Finance 💰",
    "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const TaskForm = ({ isOpen, onClose, onAdd, onUpdate, onDelete, taskToEdit, initialDate }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dateStr, setDateStr] = useState('');
    const [endDateStr, setEndDateStr] = useState('');
    const [showEndDate, setShowEndDate] = useState(false);
    const [timeStr, setTimeStr] = useState('');
    const [endTimeStr, setEndTimeStr] = useState('');
    const [showEndTime, setShowEndTime] = useState(false);
    const [location, setLocation] = useState('');
    const [subtasks, setSubtasks] = useState([]); 
    const [loadingAI, setLoadingAI] = useState(false);
    const [manualStep, setManualStep] = useState('');
    const [tags, setTags] = useState([]);
    const [isAllDay, setIsAllDay] = useState(false);
    const [recurrence, setRecurrence] = useState('none');
    
    const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
    const tagsDropdownRef = useRef(null);

    // Confirmation Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Helper to format date as YYYY-MM-DD using local time
    const toLocalDateString = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setTitle(taskToEdit.title || '');
                setDesc(taskToEdit.description || '');
                setPriority(taskToEdit.priority || 'Medium');
                setLocation(taskToEdit.location || '');
                setTags(taskToEdit.tags || []);
                setSubtasks(taskToEdit.subtasks ? taskToEdit.subtasks.map(s => s.text) : []);
                setIsAllDay(taskToEdit.isAllDay || false);
                setRecurrence(taskToEdit.recurrence || 'none');

                if (taskToEdit.dueDate) {
                    setDateStr(toLocalDateString(taskToEdit.dueDate));
                    const d = new Date(taskToEdit.dueDate);
                    setTimeStr(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                }
                if (taskToEdit.endDate) {
                    const d = new Date(taskToEdit.endDate);
                    
                    // Check if end date is different from start date
                    const startDate = new Date(taskToEdit.dueDate);
                    const isSameDay = d.toDateString() === startDate.toDateString();
                    
                    if (!isSameDay) {
                        setEndDateStr(toLocalDateString(taskToEdit.endDate));
                        setShowEndDate(true);
                    }
                    
                    setEndTimeStr(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                    setShowEndTime(true);
                }
            } else {
                resetForm();
                // Use initialDate if provided, otherwise default to today
                const d = initialDate ? new Date(initialDate) : new Date();
                setDateStr(toLocalDateString(d));
            }
        }
    }, [isOpen, taskToEdit, initialDate]);

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

    // Effect to handle Repeat locking when End Date is selected
    useEffect(() => {
        if (showEndDate) {
            setRecurrence('none');
        }
    }, [showEndDate]);

    // Effect to validate End Date against Start Date
    useEffect(() => {
        if (showEndDate && dateStr && endDateStr) {
            if (endDateStr < dateStr) {
                setEndDateStr(dateStr);
            }
        }
    }, [dateStr, endDateStr, showEndDate]);

    const resetForm = () => {
        setTitle(''); setDesc(''); setLocation(''); setTags([]);
        setTimeStr(''); setEndTimeStr(''); setShowEndTime(false);
        setDateStr(''); setEndDateStr(''); setShowEndDate(false);
        setPriority('Medium'); setSubtasks([]); setManualStep('');
        setIsAllDay(false); setRecurrence('none');
    };

    const combineDateTime = (dResult, tResult) => {
        if (!dResult) return null;
        const timeToUse = tResult || '09:00'; 
        return new Date(`${dResult}T${timeToUse}`).toISOString();
    };

    const handleAiBreakdown = async () => {
        if (!title.trim()) return;
        setLoadingAI(true);
        try {
            const steps = await taskService.getAiBreakdown(title);
            setSubtasks(prev => [...prev, ...steps]);
        } catch (error) { alert("AI Failed"); } 
        finally { setLoadingAI(false); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const finalStartDate = combineDateTime(dateStr, timeStr);
        let finalEndDate = null;
        
        if (showEndDate && endDateStr) {
             // Explicit end date
             finalEndDate = combineDateTime(endDateStr, endTimeStr || '23:59');
        } else if (showEndTime && endTimeStr) {
            // Same day end time
            finalEndDate = combineDateTime(dateStr, endTimeStr);
        }

        const taskData = {
            title, description: desc, location, tags, priority,
            isAllDay, recurrence,
            dueDate: finalStartDate,
            endDate: finalEndDate,
            subtasks: subtasks.map(text => ({ text, isCompleted: false }))
        };

        taskToEdit ? onUpdate(taskToEdit._id, taskData) : onAdd(taskData);
        onClose();
    };

    const handleTagToggle = (tag) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };

    const addManualStep = () => {
        if (!manualStep.trim()) return;
        setSubtasks([...subtasks, manualStep]);
        setManualStep('');
    };

    const getDayName = () => {
        if (!dateStr) return 'Day';
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
    };

    // Handle delete button click
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    // Handle confirm delete
    const handleConfirmDelete = () => {
        if (taskToEdit) {
            onDelete(taskToEdit._id);
            onClose();
        }
        setIsDeleteModalOpen(false);
    };

    if (!isOpen) return null;

    return (
        // המעטפת החיצונית (Overlay) - אחראית על הרקע הכהה והמיקום במרכז
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    {/* --- חלק עליון: כותרת המשימה --- */}
                    <div style={styles.field}>
                        <label style={styles.label}><FaPen /> Task Name</label>
                        <div style={styles.inputRow}>
                            <input
                                type="text" placeholder="Add task"
                                value={title} onChange={(e) => setTitle(e.target.value)}
                                style={styles.mainInput} autoFocus
                            />
                            
                            <div style={styles.actions}>
                                {taskToEdit && (
                                    <button type="button" onClick={handleDeleteClick} style={styles.iconBtn} title="Delete">
                                        <FaTrash color="#dc3545" />
                                    </button>
                                )}
                                <button type="button" onClick={onClose} style={styles.iconBtn}><FaTimes /></button>
                            </div>
                        </div>
                    </div>

                    {/* --- שורה 1: תאריך וחזרתיות --- */}
                    <div style={styles.grid}>
                        <div style={styles.field}>
                            <label style={styles.label}><FaCalendarAlt /> Date</label>
                            <div style={styles.timeRow}>
                                <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} style={styles.dateInput} />
                                {!showEndDate ? (
                                    <button type="button" onClick={() => setShowEndDate(true)} style={styles.linkBtn}>+ End Date</button>
                                ) : (
                                    <>
                                        <span style={{color:'#999'}}>to</span>
                                        <input 
                                            type="date" 
                                            value={endDateStr} 
                                            min={dateStr} // Prevent selecting date before start date
                                            onChange={e => setEndDateStr(e.target.value)} 
                                            style={styles.dateInput} 
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}><FaRedo /> Repeat</label>
                            {showEndDate ? (
                                <div style={{...styles.input, color: '#999', backgroundColor: '#f1f3f5', display: 'flex', alignItems: 'center'}}>
                                    Does not repeat
                                </div>
                            ) : (
                                <select value={recurrence} onChange={e => setRecurrence(e.target.value)} style={styles.input}>
                                    <option value="none">Does not repeat</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly on {getDayName()}</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* --- שורה 2: שעה וכל היום --- */}
                    <div style={styles.grid}>
                        <div style={styles.field}>
                            <label style={styles.label}><FaClock /> Time</label>
                            {!isAllDay ? (
                                <div style={styles.timeRow}>
                                    <input type="time" value={timeStr} onChange={e => setTimeStr(e.target.value)} style={styles.timeInput} />
                                    {!showEndTime ? (
                                        <button type="button" onClick={() => setShowEndTime(true)} style={styles.linkBtn}>+ End Time</button>
                                    ) : (
                                        <>
                                            <span style={{color:'#999'}}>to</span>
                                            <input type="time" value={endTimeStr} onChange={e => setEndTimeStr(e.target.value)} style={styles.timeInput} />
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div style={{...styles.input, color: '#999', backgroundColor: '#f1f3f5', display: 'flex', alignItems: 'center'}}>
                                    All Day Event
                                </div>
                            )}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', height: '100%', paddingTop: '25px'}}>
                            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem', color: '#555', fontWeight: '600'}}>
                                <input type="checkbox" checked={isAllDay} onChange={e => setIsAllDay(e.target.checked)} style={{width: '18px', height: '18px', accentColor: '#007bff', cursor: 'pointer'}} />
                                All Day
                            </label>
                        </div>
                    </div>

                    {/* --- מיקום (שורה מלאה) --- */}
                    <div style={styles.field}>
                        <label style={styles.label}><FaMapMarkerAlt /> Location</label>
                        <input type="text" placeholder="Add location" value={location} onChange={e => setLocation(e.target.value)} style={styles.input} />
                    </div>

                    {/* --- גריד: עדיפות ותגיות --- */}
                    <div style={styles.grid}>
                        <div style={styles.field}>
                            <label style={styles.label}><FaFlag /> Priority</label>
                            <div style={styles.pills}>
                                {['Low', 'Medium', 'High'].map(p => (
                                    <button key={p} type="button" onClick={() => setPriority(p)}
                                        style={{
                                            ...styles.pill,
                                            ...(priority === p ? styles.activePill : {}),
                                            ...(priority === p && p === 'Low' ? { backgroundColor: '#28a745', color: 'white' } : {}),
                                            ...(priority === p && p === 'Medium' ? { backgroundColor: '#ffc107', color: '#333' } : {}),
                                            ...(priority === p && p === 'High' ? { backgroundColor: '#dc3545', color: 'white' } : {}),
                                        }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}><FaTag /> Tags</label>
                            <div style={{ position: 'relative', width: '100%' }} ref={tagsDropdownRef}>
                                <button 
                                    type="button"
                                    onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)}
                                    style={styles.multiSelectBtn}
                                >
                                    {tags.length > 0 
                                        ? `${tags.length} Selected` 
                                        : 'Select Tags'}
                                    <FaChevronDown size={12} color="#666" />
                                </button>
                                
                                {isTagsDropdownOpen && (
                                    <div style={styles.dropdownMenu}>
                                        {TAG_OPTIONS.map(tag => {
                                            const isActive = tags.includes(tag);
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

                    {/* --- תיאור המשימה (עבר למטה) --- */}
                    <div style={styles.field}>
                        <label style={styles.label}><FaAlignLeft /> Details</label>
                        <textarea
                            placeholder="Add details"
                            value={desc} onChange={(e) => setDesc(e.target.value)}
                            style={styles.descInput} rows={2}
                        />
                    </div>

                    {/* --- תתי משימות --- */}
                    <div style={styles.subtasksContainer}>
                        <div style={styles.aiHeader}>
                            <span style={styles.label}><FaListUl /> Subtasks</span>
                        </div>
                        <div style={styles.subtaskList}>
                            {subtasks.map((step, i) => (
                                <div key={i} style={styles.subtaskItem}>
                                    <input type="checkbox" disabled />
                                    <span>{step}</span>
                                    <button type="button" onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))} style={styles.iconBtn} title="Delete">
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div style={styles.addSubtask}>
                            <input 
                                type="text" placeholder="Add subtask"
                                value={manualStep} onChange={e => setManualStep(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addManualStep())}
                                style={styles.input} 
                            />
                            <div style={styles.subtaskActions}>
                                {manualStep && (
                                    <button type="button" onClick={() => setManualStep('')} style={styles.iconBtn} title="Clear">
                                        <FaTimes />
                                    </button>
                                )}
                                <button type="button" onClick={addManualStep} style={styles.iconBtn} title="Add">
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={!title} style={styles.submitBtn}>
                        {taskToEdit ? 'Save Changes' : 'Create Task'}
                    </button>
                </form>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Task?"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
        </div>
    );
};

const styles = {
    // --- 1. מיכלים ורקעים (Containers) ---

    // מסך הרקע הכהה - ממקד את תשומת הלב בטופס
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', // כהות נעימה
        backdropFilter: 'blur(5px)', // אפקט זכוכית מודרני
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },

    // החלון הצף עצמו
    modal: {
        backgroundColor: '#fff',
        width: '550px',
        maxWidth: '95%',
        borderRadius: '20px', // פינות עגולות יותר למראה רך
        padding: '28px', // ריווח פנימי נדיב
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', // צל עמוק שנותן תחושת ריחוף
        maxHeight: '90vh',
        overflowY: 'auto' // גלילה אם הטופס ארוך מדי
    },
    
    // פריסת הטופס הראשי
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },

    // גריד לשדות שמופיעים אחד ליד השני (כמו תאריך ושעה)
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },

    // עטיפה לכל שדה בודד (תווית + קלט)
    field: { display: 'flex', flexDirection: 'column', gap: '8px' },

    // שורת קלט (למשל כותרת + כפתור מחיקה)
    inputRow: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' },

    // --- 2. טיפוגרפיה ותוויות (Typography) ---

    // התווית מעל כל שדה (למשל "TASK NAME")
    label: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase', // אותיות גדולות למראה מקצועי
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },

    // --- 3. שדות קלט (Inputs) ---

    // הקלט הראשי (כותרת המשימה) - גדול ובולט יותר
    mainInput: { 
        flex: 1, 
        fontSize: '1.2rem',
        border: '1px solid #eee', 
        borderRadius: '10px',
        padding: '12px 14px',
        outline: 'none', 
        fontWeight: '600', 
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s'
    },
    
    // אזור הטקסט (תיאור)
    descInput: {
        border: '1px solid #eee', 
        borderRadius: '10px',
        padding: '12px',
        fontSize: '0.95rem',
        resize: 'none', 
        outline: 'none', 
        transition: 'border 0.2s', 
        width: '100%', 
        boxSizing: 'border-box', 
        fontFamily: 'inherit' 
    },
    
    // שדה קלט סטנדרטי (תאריך, שעה, מיקום)
    input: {
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #eee', 
        fontSize: '0.95rem',
        outline: 'none', 
        width: '100%', 
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        backgroundColor: '#f9f9f9' // רקע אפור בהיר מאוד להפרדה
    },

    // שדה קלט לתאריך (רחב יותר)
    dateInput: {
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #eee', 
        fontSize: '0.95rem',
        outline: 'none', 
        width: '137px', // כאן משנים את רוחב התאריך
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        backgroundColor: '#f9f9f9'
    },

    // שדה קלט לשעה (צר יותר)
    timeInput: {
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #eee', 
        fontSize: '0.95rem',
        outline: 'none', 
        width: '100px', // כאן משנים את רוחב השעה
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        backgroundColor: '#f9f9f9'
    },

    // --- 4. כפתורים ופעולות (Buttons & Actions) ---

    actions: { display: 'flex', gap: '5px', flexShrink: 0 },

    // כפתורי אייקון קטנים (מחיקה, סגירה)
    iconBtn: {
        background: 'none',
        border: 'none',
        fontSize: '1.1rem',
        cursor: 'pointer',
        color: '#666',
        padding: '6px',
        borderRadius: '50%',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    // כפתור טקסט ללא מסגרת (הוספת תאריך סיום)
    timeRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    linkBtn: {
        background: 'none',
        border: 'none',
        color: '#007bff',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },

    // --- 5. בחירת עדיפות (Priority Pills) ---

    pills: {
        display: 'flex',
        gap: '4px',
        backgroundColor: '#f1f3f5',
        padding: '4px',
        borderRadius: '12px'
    },
    pill: { 
        flex: 1, 
        border: 'none', 
        background: 'transparent', 
        padding: '7px 14px', 
        borderRadius: '10px',
        fontSize: '0.8125rem', 
        cursor: 'pointer', 
        color: '#666', 
        fontWeight: '500',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit'
    },
    activePill: {
        fontWeight: '700',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transform: 'scale(1.02)'
    },

    // --- 6. תפריט תגיות (Tags Dropdown) ---

    multiSelectBtn: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #eee',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '0.95rem',
        color: '#555',
        boxSizing: 'border-box'
    },
    dropdownMenu: {
        position: 'absolute',
        top: '105%',
        left: 0,
        width: '100%',
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #eee',
        borderRadius: '10px',
        zIndex: 100,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    dropdownItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
    },

    // --- 7. תתי משימות (Subtasks) ---

    subtasksContainer: {
        marginTop: '10px',
        padding: '16px',
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        backgroundColor: '#fafafa'
    },
    aiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    aiBtn: { backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(111, 66, 193, 0.3)' },
    subtaskList: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' },
    subtaskItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', padding: '4px 0' },
    addSubtask: { display: 'flex', gap: '10px', alignItems: 'center' },
    subtaskActions: { display: 'flex', gap: '5px' },

    // --- 8. כפתור שליחה (Submit) ---

    submitBtn: {
        marginTop: '20px',
        background: 'linear-gradient(135deg, #007bff, #0056b3)',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,123,255,0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        width: '100%'
    }
};

export default TaskForm;