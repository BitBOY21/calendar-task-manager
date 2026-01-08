import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import CalendarView from '../features/tasks/components/CalendarView';
import TaskList from '../features/tasks/components/TaskList';
import TaskFilters from '../features/tasks/components/TaskFilters';
import TaskForm from '../features/tasks/components/TaskForm';
import Card from '../components/ui/Card';
import { isToday, isThisWeek, isThisMonth, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const WorkPage = ({ onDateSelect, onEventDrop, onEventClick, onRequestDelete }) => {
    const { tasks, updateTask, deleteTask } = useTaskContext();

    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        tags: [],
        search: '',
        date: 'all', // 'today', 'week', 'month', 'custom'
        customStartDate: '',
        customEndDate: ''
    });

    const [editingTask, setEditingTask] = useState(null);

    const filteredTasks = tasks.filter(task => {
        // Status Filter
        if (filters.status === 'active' && task.isCompleted) return false;
        if (filters.status === 'completed' && !task.isCompleted) return false;

        // Priority Filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

        // Tags Filter
        if (filters.tags.length > 0) {
            const hasTag = task.tags && task.tags.some(t => filters.tags.includes(t));
            if (!hasTag) return false;
        }

        // Search Filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            if (!task.title.toLowerCase().includes(searchLower)) return false;
        }

        // Date/Timeframe Filter
        if (filters.date && filters.date !== 'all') {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);

            switch (filters.date) {
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
                    if (filters.customStartDate && filters.customEndDate) {
                        const start = startOfDay(new Date(filters.customStartDate));
                        const end = endOfDay(new Date(filters.customEndDate));

                        // Check if task date is within the range [start, end]
                        if (!isWithinInterval(taskDate, { start, end })) return false;
                    } else if (filters.customStartDate) {
                         // Only start date provided
                         const start = startOfDay(new Date(filters.customStartDate));
                         if (taskDate < start) return false;
                    } else if (filters.customEndDate) {
                        // Only end date provided
                        const end = endOfDay(new Date(filters.customEndDate));
                        if (taskDate > end) return false;
                    }
                    break;
                default:
                    break;
            }
        }

        return true;
    });

    const handleEventClick = (task) => {
        setEditingTask(task);
    };

    return (
        <div style={styles.container}>
            {/* --- Left: Calendar --- */}
            <Card style={styles.calendarArea}>
                <CalendarView
                    tasks={filteredTasks}
                    onDateSelect={onDateSelect}
                    onEventDrop={onEventDrop}
                    onEventClick={handleEventClick}
                    unified={true}
                />
            </Card>

            {/* --- Right: Sidebar (Filters + Tasks) --- */}
            <Card style={styles.sidebarArea}>
                <div style={styles.filtersSection}>
                    <TaskFilters
                        filters={filters}
                        setFilters={setFilters}
                        selectedDate={null}
                        onClearDate={() => {}}
                        showTitle={true}
                    />
                </div>

                <div style={styles.divider}></div>

                <div style={styles.tasksSection}>
                    <h3 style={styles.listTitle}>Tasks ({filteredTasks.length})</h3>
                    <div style={styles.taskListWrapper}>
                        <TaskList
                            tasks={filteredTasks}
                            onUpdate={updateTask}
                            onDelete={deleteTask}
                            onDragEnd={() => {}}
                        />
                    </div>
                </div>
            </Card>

            {/* Edit Modal */}
            {editingTask && (
                <TaskForm
                    isOpen={!!editingTask}
                    taskToEdit={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdate={updateTask}
                    onRequestDelete={onRequestDelete}
                    onAdd={() => {}}
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        gap: '20px',
        padding: '20px',
        overflow: 'hidden',
        // Removed backgroundColor
        maxWidth: '1600px',
        margin: '0 auto'
    },

    calendarArea: {
        flex: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px'
    },

    sidebarArea: {
        flex: 1,
        minWidth: '320px',
        maxWidth: '450px', // Increased width
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        padding: '0'
    },

    filtersSection: {
        flexShrink: 0,
        maxHeight: '60%',
        overflowY: 'auto',
        padding: '20px'
    },

    divider: {
        height: '1px',
        backgroundColor: '#f0f0f0',
        flexShrink: 0
    },

    tasksSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent double scrollbar
        padding: '20px',
        paddingBottom: '0' // Remove bottom padding to let list scroll to edge
    },

    listTitle: {
        margin: '0 0 15px 0',
        fontSize: '1.1rem',
        color: '#333',
        fontWeight: '700',
        flexShrink: 0 // Prevent title from shrinking
    },

    taskListWrapper: {
        flex: 1,
        overflowY: 'auto',
        paddingRight: '5px' // Space for scrollbar
    }
};

export default WorkPage;