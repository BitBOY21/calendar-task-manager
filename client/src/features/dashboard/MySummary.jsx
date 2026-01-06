import React, { useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import SummaryFilters from './SummaryFilters';
import TaskFormModal from './TaskFormModal'; // Import Modal for editing
import { cardStyle } from '../../components/ui/DesignSystem';
import { FaFire, FaCheckCircle, FaHourglassHalf, FaSearch, FaSortAmountDown, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

const MySummary = ({ tasks, user, onUpdate, onDelete }) => {
    const userName = user?.name || 'User';
    const [filter, setFilter] = useState('All'); 
    const [visibleTasksCount, setVisibleTasksCount] = useState(5); 
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [activeTags, setActiveTags] = useState([]);
    
    // New States for Search & Sort
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, priority, name
    const [editingTask, setEditingTask] = useState(null); // For edit modal

    // --- חישוב נתונים (כלליים) ---
    const total = tasks.length;
    const totalUrgent = tasks.filter(t => t.priority === 'High').length;
    const pendingUrgent = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;
    const completedCount = tasks.filter(t => t.isCompleted).length;
    const pendingCount = tasks.filter(t => !t.isCompleted).length;
    
    // נתונים לגרפים
    const priorityData = [
        { name: 'High', value: pendingUrgent, color: '#ff4d4d' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium' && !t.isCompleted).length, color: '#ffad33' },
        { name: 'Low', value: tasks.filter(t => t.priority === 'Low' && !t.isCompleted).length, color: '#28a745' },
    ].filter(d => d.value > 0);

    const weeklyActivity = [
        { day: 'Sun', tasks: 2 }, { day: 'Mon', tasks: 5 }, { day: 'Tue', tasks: 3 },
        { day: 'Wed', tasks: completedCount > 5 ? 6 : completedCount }, { day: 'Thu', tasks: 4 },
        { day: 'Fri', tasks: 1 }, { day: 'Sat', tasks: 0 },
    ];

    // --- לוגיקת סינון ומיון ---
    const filteredTasks = tasks
        .filter(task => {
            // 1. Existing Filters
            if (filter === 'Completed' && !task.isCompleted) return false;
            if (filter === 'Pending' && task.isCompleted) return false;
            if (filter === 'High Priority' && task.priority !== 'High') return false;
            if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
            if (activeTags.length > 0) {
                const hasTag = task.tags && task.tags.some(t => activeTags.includes(t));
                if (!hasTag) return false;
            }
            // 2. Search Filter
            if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            return true;
        })
        .sort((a, b) => {
            // 3. Sorting Logic
            switch (sortBy) {
                case 'date_desc': return new Date(b.dueDate || 0) - new Date(a.dueDate || 0);
                case 'date_asc': return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
                case 'priority': 
                    const pMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    return pMap[b.priority] - pMap[a.priority];
                case 'name': return a.title.localeCompare(b.title);
                default: return 0;
            }
        });

    const toggleTag = (tag) => {
        setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const recentActivity = tasks
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 10)
        .map(t => ({
            id: t._id,
            action: t.isCompleted ? 'Completed' : 'Created',
            taskTitle: t.title,
            time: new Date(t.updatedAt || t.createdAt).toLocaleDateString('en-GB')
        }));

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">Your Summary, {userName}</span> 📊
                </h1>
                <p style={styles.subtitle}>A detailed look at your overall performance.</p>
            </div>

            {/* --- Stats Row --- */}
            <div style={styles.statsRow}>
                <div style={{...styles.statCard, borderLeft: '4px solid #ffc107'}}>
                    <div style={{...styles.statIconBox, color: '#ffc107'}}><FaHourglassHalf /></div>
                    <div><span style={styles.statLabel}>Total Pending</span><div style={styles.statValue}>{pendingCount} <span style={styles.subValue}>/ {total}</span></div></div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #dc3545'}}>
                    <div style={{...styles.statIconBox, color: '#dc3545'}}><FaFire /></div>
                    <div><span style={styles.statLabel}>Total Urgent</span><div style={styles.statValue}>{pendingUrgent} <span style={styles.subValue}>/ {totalUrgent}</span></div></div>
                </div>
                <div style={{...styles.statCard, borderLeft: '4px solid #28a745'}}>
                    <div style={{...styles.statIconBox, color: '#28a745'}}><FaCheckCircle /></div>
                    <div><span style={styles.statLabel}>Total Completed</span><div style={styles.statValue}>{completedCount} <span style={styles.subValue}>/ {total}</span></div></div>
                </div>
            </div>

            {/* --- Filters --- */}
            <div style={styles.compactSection}>
                <SummaryFilters
                    statusFilter={filter} setStatusFilter={setFilter}
                    priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                    activeTags={activeTags} toggleTag={toggleTag}
                />
            </div>

            {/* --- All Tasks List (Upgraded) --- */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>📋 All Tasks ({filteredTasks.length})</h3>
                    
                    {/* Search & Sort Controls */}
                    <div style={styles.controls}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#999" />
                            <input 
                                type="text" 
                                placeholder="Search tasks..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <div style={styles.sortBox}>
                            <FaSortAmountDown color="#999" />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
                                <option value="date_desc">Newest First</option>
                                <option value="date_asc">Oldest First</option>
                                <option value="priority">Priority</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div style={styles.scrollableList}>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.slice(0, visibleTasksCount).map(task => (
                            <div key={task._id} style={styles.taskRow}>
                                {/* Status Toggle */}
                                <button
                                    onClick={() => onUpdate(task._id, { isCompleted: !task.isCompleted })}
                                    style={{
                                        ...styles.checkBtn,
                                        backgroundColor: task.isCompleted ? '#4caf50' : 'transparent',
                                        borderColor: task.isCompleted ? '#4caf50' : '#ccc'
                                    }}
                                >
                                    {task.isCompleted && <FaCheck color="white" size={10} />}
                                </button>

                                <div style={styles.taskInfo}>
                                    <span style={{
                                        ...styles.taskTitle,
                                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                                        color: task.isCompleted ? '#999' : '#333'
                                    }}>
                                        {task.title}
                                    </span>
                                    <span style={styles.taskDate}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                                </div>

                                <span style={{
                                    ...styles.tag, 
                                    backgroundColor: task.priority === 'High' ? '#ffebee' : '#e3f2fd',
                                    color: task.priority === 'High' ? '#c62828' : '#1565c0'
                                }}>
                                    {task.priority}
                                </span>

                                {/* Actions */}
                                <div style={styles.actions}>
                                    <button onClick={() => setEditingTask(task)} style={styles.iconBtn} title="Edit"><FaEdit /></button>
                                    <button onClick={() => { if(window.confirm('Delete?')) onDelete(task._id) }} style={{...styles.iconBtn, color: '#dc3545'}} title="Delete"><FaTrash /></button>
                                </div>
                            </div>
                        ))
                    ) : <p style={styles.emptyText}>No tasks match your filters.</p>}
                    
                    {filteredTasks.length > visibleTasksCount && (
                        <div style={styles.moreText} onClick={() => setVisibleTasksCount(prev => prev + 5)}>
                            + Load more tasks...
                        </div>
                    )}
                </div>
            </div>

            {/* --- Graphs --- */}
            <div style={styles.chartsRow}>
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Task Priorities</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                                    {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={styles.legend}>
                        {priorityData.map(d => <span key={d.name} style={{color: d.color, fontSize:'0.85rem', margin:'0 5px'}}>● {d.name}</span>)}
                    </div>
                </div>

                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Weekly Activity</h3>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={weeklyActivity}>
                                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="tasks" fill="#007bff" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- My Activity --- */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📜 My Activity</h3>
                <div style={styles.scrollableList}>
                    {recentActivity.map(item => (
                        <div key={item.id} style={styles.activityItem}>
                            <div style={styles.activityIcon}>
                                {item.action === 'Completed' ? '✅' : '✨'}
                            </div>
                            <div style={styles.activityContent}>
                                <span style={styles.activityText}>
                                    You <strong>{item.action}</strong> the task "{item.taskTitle}"
                                </span>
                                <span style={styles.activityTime}>{item.time}</span>
                            </div>
                        </div>
                    ))}
                    {recentActivity.length === 0 && <div style={styles.emptyText}>No recent activity.</div>}
                </div>
            </div>

            {/* Edit Modal */}
            <TaskFormModal
                isOpen={!!editingTask} 
                onClose={() => setEditingTask(null)}
                onUpdate={onUpdate}
                onDelete={onDelete}
                taskToEdit={editingTask}
            />
        </div>
    );
};

const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px', height: '100%', overflowY: 'auto', background: '#f4f6f9' },
    header: { marginBottom: '25px', textAlign: 'center' },
    subtitle: { color: '#666', fontSize: '1.1rem', fontWeight: '400' },
    
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' },
    statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '15px', width: '100%' },
    statIconBox: { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 },
    statLabel: { fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px', fontWeight: '600', whiteSpace: 'nowrap' },
    statValue: { fontSize: '1.5rem', fontWeight: '800', color: '#333', lineHeight: '1' },
    subValue: { fontSize: '0.9rem', color: '#999', fontWeight: '500' },

    compactSection: { marginBottom: '20px' },

    section: { ...cardStyle, padding: '25px', marginBottom: '20px' },
    sectionHeader: { marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
    sectionTitle: { fontSize: '1.3rem', color: '#333', fontWeight: '700', margin: 0 },
    
    controls: { display: 'flex', gap: '10px' },
    searchBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8f9fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #eee' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', width: '150px' },
    sortBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8f9fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #eee' },
    sortSelect: { border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', cursor: 'pointer', color: '#555' },

    scrollableList: { maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' },

    taskRow: { display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0', gap: '15px' },
    checkBtn: { width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 },
    taskInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
    taskTitle: { fontSize: '1rem', fontWeight: '500' },
    taskDate: { fontSize: '0.8rem', color: '#888' },
    tag: { padding: '4px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '600' },
    
    actions: { display: 'flex', gap: '8px', opacity: 0.6, transition: 'opacity 0.2s' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '0.9rem' },

    moreText: { textAlign: 'center', marginTop: '20px', color: '#007bff', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s ease' },
    emptyText: { textAlign: 'center', color: '#999', fontStyle: 'italic', padding: '20px' },

    chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' },
    chartCard: { ...cardStyle, padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    chartTitle: { fontSize: '1.1rem', color: '#333', marginBottom: '16px', fontWeight: '700' },
    legend: { marginTop: '16px', textAlign: 'center' },

    activityItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    activityIcon: { background: 'linear-gradient(135deg, rgba(0,123,255,0.1), rgba(111,66,193,0.1))', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' },
    activityContent: { display: 'flex', flexDirection: 'column' },
    activityText: { fontSize: '0.95rem', color: '#333', fontWeight: '500' },
    activityTime: { fontSize: '0.85rem', color: '#999', marginTop: '2px' }
};

export default MySummary;