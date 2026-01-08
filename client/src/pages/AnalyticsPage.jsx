import React, { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext'; 
import NewSummaryFilters from '../features/dashboard/NewSummaryFilters'; 
import TaskForm from '../features/tasks/components/TaskForm'; 
import TaskList from '../features/tasks/components/TaskList'; // Import TaskList
import Card from '../components/ui/Card';
import SummaryStats from '../features/analytics/components/summary/SummaryStats';
import SummaryCharts from '../features/analytics/components/summary/SummaryCharts';
import ActivityLog from '../features/analytics/components/summary/ActivityLog';
import { isToday, isThisWeek, isThisMonth, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const AnalyticsPage = ({ user, onRequestDelete, onEditTask }) => { 
    const { tasks, updateTask, deleteTask, generateAI } = useTaskContext();
    const userName = user?.name || 'User';
    
    // Filter States
    const [filter, setFilter] = useState('All'); 
    const [visibleTasksCount, setVisibleTasksCount] = useState(5); 
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [activeTags, setActiveTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); 
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [sortBy, setSortBy] = useState('date_desc'); 
    
    const [editingTask, setEditingTask] = useState(null); 

    const filteredTasks = useMemo(() => {
        return tasks
            .filter(task => {
                // Status
                if (filter === 'Completed' && !task.isCompleted) return false;
                if (filter === 'Pending' && task.isCompleted) return false;
                if (filter === 'High Priority' && task.priority !== 'High') return false;
                
                // Priority
                if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
                
                // Tags
                if (activeTags.length > 0) {
                    const hasTag = task.tags && task.tags.some(t => activeTags.includes(t));
                    if (!hasTag) return false;
                }
                
                // Search
                if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

                // Date Filter
                if (dateFilter && dateFilter !== 'all') {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);

                    switch (dateFilter) {
                        case 'today':
                            if (!isToday(taskDate)) return false;
                            break;
                        case 'week':
                            if (!isThisWeek(taskDate, { weekStartsOn: 0 })) return false;
                            break;
                        case 'month':
                            if (!isThisMonth(taskDate)) return false;
                            break;
                        case 'custom':
                            if (customStartDate && customEndDate) {
                                const start = startOfDay(new Date(customStartDate));
                                const end = endOfDay(new Date(customEndDate));
                                if (!isWithinInterval(taskDate, { start, end })) return false;
                            } else if (customStartDate) {
                                 const start = startOfDay(new Date(customStartDate));
                                 if (taskDate < start) return false;
                            } else if (customEndDate) {
                                const end = endOfDay(new Date(customEndDate));
                                if (taskDate > end) return false;
                            }
                            break;
                        default:
                            break;
                    }
                }

                return true;
            })
            .sort((a, b) => {
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
    }, [tasks, filter, priorityFilter, activeTags, searchTerm, sortBy, dateFilter, customStartDate, customEndDate]);

    const toggleTag = (tag) => {
        setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleResetAll = () => {
        setFilter('All');
        setPriorityFilter('all');
        setActiveTags([]);
        setSearchTerm('');
        setDateFilter('all');
        setCustomStartDate('');
        setCustomEndDate('');
        setSortBy('date_desc');
    };

    // Use the passed onEditTask or fallback to local state (though onEditTask from App is preferred for consistency)
    const handleEdit = (task) => {
        if (onEditTask) {
            onEditTask(task);
        } else {
            setEditingTask(task);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">Your Summary, {userName}</span> 📊
                </h1>
                <p style={styles.subtitle}>A detailed look at your overall performance.</p>
            </div>

            <SummaryStats tasks={tasks} />

            {/* Swapped SummaryCharts and All Tasks Card */}
            <SummaryCharts tasks={tasks} />

            <Card style={{ padding: '25px', marginBottom: '20px' }}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>📋 All Tasks ({filteredTasks.length})</h3>
                </div>

                <div style={styles.filtersWrapper}>
                    <NewSummaryFilters 
                        statusFilter={filter} setStatusFilter={setFilter}
                        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                        activeTags={activeTags} toggleTag={toggleTag}
                        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                        dateFilter={dateFilter} setDateFilter={setDateFilter}
                        customStartDate={customStartDate} setCustomStartDate={setCustomStartDate}
                        customEndDate={customEndDate} setCustomEndDate={setCustomEndDate}
                        sortBy={sortBy} setSortBy={setSortBy}
                        onReset={handleResetAll}
                    />
                </div>
                
                <div style={styles.scrollableList}>
                    {filteredTasks.length > 0 ? (
                        <TaskList
                            tasks={filteredTasks.slice(0, visibleTasksCount)}
                            onDelete={onRequestDelete || deleteTask}
                            onUpdate={updateTask}
                            onGenerateAI={generateAI}
                            onEdit={handleEdit}
                        />
                    ) : <p style={styles.emptyText}>No tasks match your filters.</p>}
                    
                    {filteredTasks.length > visibleTasksCount && (
                        <div style={styles.moreText} onClick={() => setVisibleTasksCount(prev => prev + 5)}>
                            + Load more tasks...
                        </div>
                    )}
                </div>
            </Card>

            <ActivityLog tasks={tasks} />

            {/* Only render local TaskForm if we are managing editing locally (fallback) */}
            {editingTask && !onEditTask && (
                <TaskForm 
                    isOpen={!!editingTask} 
                    onClose={() => setEditingTask(null)}
                    onUpdate={updateTask}
                    onRequestDelete={onRequestDelete}
                    onDelete={deleteTask}
                    taskToEdit={editingTask}
                />
            )}
        </div>
    );
};

const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px', height: '100%', overflowY: 'auto' }, // Transparent background
    header: { marginBottom: '25px', textAlign: 'center' },
    subtitle: { color: '#666', fontSize: '1.1rem', fontWeight: '400' },
    
    sectionHeader: { marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }, // Reverted to left-aligned
    sectionTitle: { fontSize: '1.3rem', color: '#333', fontWeight: '700', margin: 0 }, // Reverted to left-aligned
    
    filtersWrapper: { marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' },

    scrollableList: { maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }, // Increased height for better view

    moreText: { textAlign: 'center', marginTop: '20px', color: '#007bff', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s ease' },
    emptyText: { textAlign: 'center', color: '#999', fontStyle: 'italic', padding: '20px' },
};

export default AnalyticsPage;