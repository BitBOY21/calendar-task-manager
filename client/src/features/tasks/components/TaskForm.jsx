import React, { useState, useEffect } from 'react';
import { taskService } from '../../../services/taskService';
import { FaTimes, FaMagic, FaTrash, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaTag } from 'react-icons/fa';

const TAG_OPTIONS = [
    "Work 💼", "Personal 🏠", "Shopping 🛒", "Health 💪", "Finance 💰",
    "Study 📚", "Urgent 🔥", "Family 👨‍👩‍👧‍👦", "Errands 🏃"
];

const TaskForm = ({ isOpen, onClose, onAdd, onUpdate, onDelete, taskToEdit, initialDate }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dateStr, setDateStr] = useState('');
    const [timeStr, setTimeStr] = useState('');
    const [endTimeStr, setEndTimeStr] = useState('');
    const [showEndTime, setShowEndTime] = useState(false);
    const [location, setLocation] = useState('');
    const [subtasks, setSubtasks] = useState([]); 
    const [loadingAI, setLoadingAI] = useState(false);
    const [manualStep, setManualStep] = useState('');
    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setTitle(taskToEdit.title || '');
                setDesc(taskToEdit.description || '');
                setPriority(taskToEdit.priority || 'Medium');
                setLocation(taskToEdit.location || '');
                setTags(taskToEdit.tags || []);
                setSubtasks(taskToEdit.subtasks ? taskToEdit.subtasks.map(s => s.text) : []);

                if (taskToEdit.dueDate) {
                    const d = new Date(taskToEdit.dueDate);
                    setDateStr(d.toISOString().slice(0, 10));
                    setTimeStr(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                }
                if (taskToEdit.endDate) {
                    const d = new Date(taskToEdit.endDate);
                    setEndTimeStr(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
                    setShowEndTime(true);
                }
            } else {
                resetForm();
                const d = initialDate ? new Date(initialDate) : new Date();
                setDateStr(d.toISOString().slice(0, 10));
            }
        }
    }, [isOpen, taskToEdit, initialDate]);

    const resetForm = () => {
        setTitle(''); setDesc(''); setLocation(''); setTags([]);
        setTimeStr(''); setEndTimeStr(''); setShowEndTime(false);
        setPriority('Medium'); setSubtasks([]); setManualStep('');
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
        const finalEndDate = showEndTime ? combineDateTime(dateStr, endTimeStr) : null; 

        const taskData = {
            title, description: desc, location, tags, priority,
            dueDate: finalStartDate, 
            endDate: finalEndDate,
            subtasks: subtasks.map(text => ({ text, isCompleted: false }))
        };

        taskToEdit ? onUpdate(taskToEdit._id, taskData) : onAdd(taskData);
        onClose();
    };

    const handleSelectTag = (e) => {
        const val = e.target.value;
        if (val && !tags.includes(val)) setTags([...tags, val]);
        e.target.value = "";
    };

    const addManualStep = () => {
        if (!manualStep.trim()) return;
        setSubtasks([...subtasks, manualStep]);
        setManualStep('');
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>{taskToEdit ? '✏️ Edit Task' : '✨ New Task'}</h2>
                    <div style={styles.actions}>
                        {taskToEdit && (
                            <button onClick={() => { if(window.confirm('Delete?')) { onDelete(taskToEdit._id); onClose(); }}} style={styles.iconBtn} title="Delete">
                                <FaTrash color="#dc3545" />
                            </button>
                        )}
                        <button onClick={onClose} style={styles.iconBtn}><FaTimes /></button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    {/* Main Inputs */}
                    <input 
                        type="text" placeholder="What needs to be done?" 
                        value={title} onChange={(e) => setTitle(e.target.value)} 
                        style={styles.mainInput} autoFocus
                    />
                    <textarea 
                        placeholder="Add details..." 
                        value={desc} onChange={(e) => setDesc(e.target.value)} 
                        style={styles.descInput} rows={2}
                    />

                    {/* Meta Grid */}
                    <div style={styles.grid}>
                        <div style={styles.field}>
                            <label style={styles.label}><FaCalendarAlt /> Date</label>
                            <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}><FaClock /> Time</label>
                            <div style={styles.timeRow}>
                                <input type="time" value={timeStr} onChange={e => setTimeStr(e.target.value)} style={styles.input} />
                                {!showEndTime ? (
                                    <button type="button" onClick={() => setShowEndTime(true)} style={styles.linkBtn}>+ End Time</button>
                                ) : (
                                    <>
                                        <span style={{color:'#999'}}>to</span>
                                        <input type="time" value={endTimeStr} onChange={e => setEndTimeStr(e.target.value)} style={styles.input} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}><FaMapMarkerAlt /> Location</label>
                        <input type="text" placeholder="Where?" value={location} onChange={e => setLocation(e.target.value)} style={styles.input} />
                    </div>

                    {/* Priority & Tags */}
                    <div style={styles.grid}>
                        <div style={styles.field}>
                            <label style={styles.label}>Priority</label>
                            <div style={styles.pills}>
                                {['Low', 'Medium', 'High'].map(p => (
                                    <button key={p} type="button" onClick={() => setPriority(p)} 
                                        style={{...styles.pill, ...(priority === p ? styles[`pill${p}`] : {})}}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}><FaTag /> Tags</label>
                            <select onChange={handleSelectTag} style={styles.select}>
                                <option value="" disabled selected>+ Add Tag</option>
                                {TAG_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <div style={styles.tagsWrapper}>
                                {tags.map(tag => (
                                    <span key={tag} style={styles.tag}>
                                        {tag} <span onClick={() => setTags(tags.filter(t => t !== tag))} style={styles.removeTag}>×</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Subtasks */}
                    <div style={styles.aiBox}>
                        <div style={styles.aiHeader}>
                            <span style={styles.label}>⚡ AI Breakdown</span>
                            <button type="button" onClick={handleAiBreakdown} disabled={!title || loadingAI} style={styles.aiBtn}>
                                <FaMagic /> {loadingAI ? 'Generating...' : 'Auto-Generate'}
                            </button>
                        </div>
                        <div style={styles.subtaskList}>
                            {subtasks.map((step, i) => (
                                <div key={i} style={styles.subtaskItem}>
                                    <input type="checkbox" disabled />
                                    <span>{step}</span>
                                    <button type="button" onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))} style={styles.delSub}>×</button>
                                </div>
                            ))}
                        </div>
                        <div style={styles.addSubtask}>
                            <input 
                                type="text" placeholder="Add subtask manually..." 
                                value={manualStep} onChange={e => setManualStep(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addManualStep())}
                                style={styles.subInput} 
                            />
                            <button type="button" onClick={addManualStep} style={styles.addBtn}>+</button>
                        </div>
                    </div>

                    <button type="submit" disabled={!title} style={styles.submitBtn}>
                        {taskToEdit ? 'Save Changes' : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: '#fff', width: '550px', maxWidth: '95%', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#333' },
    actions: { display: 'flex', gap: '10px' },
    iconBtn: { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#666', padding: '5px', borderRadius: '50%', transition: 'background 0.2s' },
    
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    mainInput: { fontSize: '1.2rem', border: 'none', borderBottom: '2px solid #eee', padding: '8px 0', outline: 'none', fontWeight: '600', width: '100%' },
    descInput: { border: '1px solid #eee', borderRadius: '8px', padding: '10px', fontSize: '0.95rem', resize: 'none', outline: 'none', transition: 'border 0.2s' },
    
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' },
    input: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
    timeRow: { display: 'flex', alignItems: 'center', gap: '8px' },
    linkBtn: { background: 'none', border: 'none', color: '#007bff', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' },

    pills: { display: 'flex', gap: '5px', background: '#f8f9fa', padding: '4px', borderRadius: '8px' },
    pill: { flex: 1, border: 'none', background: 'none', padding: '6px', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#666', fontWeight: '500' },
    pillLow: { backgroundColor: '#28a745', color: 'white' },
    pillMedium: { backgroundColor: '#ffc107', color: '#333' },
    pillHigh: { backgroundColor: '#dc3545', color: 'white' },

    select: { padding: '6px', borderRadius: '6px', border: '1px solid #eee', fontSize: '0.85rem' },
    tagsWrapper: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' },
    tag: { backgroundColor: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' },
    removeTag: { cursor: 'pointer', fontWeight: 'bold' },

    aiBox: { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '12px', border: '1px solid #eee' },
    aiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    aiBtn: { backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
    subtaskList: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' },
    subtaskItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', padding: '4px 0' },
    delSub: { background: 'none', border: 'none', color: '#999', cursor: 'pointer', marginLeft: 'auto' },
    addSubtask: { display: 'flex', gap: '5px' },
    subInput: { flex: 1, border: 'none', background: 'transparent', borderBottom: '1px solid #ddd', padding: '4px', fontSize: '0.9rem', outline: 'none' },
    addBtn: { backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer' },

    submitBtn: { marginTop: '10px', background: 'linear-gradient(135deg, #007bff, #0056b3)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,123,255,0.2)' }
};

export default TaskForm;