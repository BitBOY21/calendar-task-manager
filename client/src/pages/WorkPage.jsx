import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext'; 
import CalendarView from '../features/tasks/components/CalendarView'; 
import TaskList from '../features/tasks/components/TaskList'; 
import TaskFilters from '../features/tasks/components/TaskFilters'; 
import TaskForm from '../features/tasks/components/TaskForm'; 
import Card from '../components/ui/Card';

const WorkPage = ({ onDateSelect, onEventDrop, onEventClick }) => { 
    const { tasks, updateTask, deleteTask } = useTaskContext();
    
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        tags: []
    });

    const [editingTask, setEditingTask] = useState(null);

    const filteredTasks = tasks.filter(task => {
        if (filters.status === 'active' && task.isCompleted) return false;
        if (filters.status === 'completed' && !task.isCompleted) return false;
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        if (filters.tags.length > 0) {
            const hasTag = task.tags && task.tags.some(t => filters.tags.includes(t));
            if (!hasTag) return false;
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
                    />
                </div>

                <div style={styles.divider}></div>

                <div style={styles.tasksSection}>
                    <h3 style={styles.listTitle}>Tasks ({filteredTasks.length})</h3>
                    <TaskList 
                        tasks={filteredTasks} 
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                        onDragEnd={() => {}} 
                    />
                </div>
            </Card>

            {/* Edit Modal */}
            {editingTask && (
                <TaskForm 
                    isOpen={!!editingTask}
                    taskToEdit={editingTask}
                    onClose={() => setEditingTask(null)}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
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
        maxWidth: '400px',
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        height: '100%',
        padding: '0' 
    },
    
    filtersSection: {
        flexShrink: 0,
        maxHeight: '40%',
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
        overflowY: 'auto',
        padding: '20px'
    },

    listTitle: {
        margin: '0 0 15px 0',
        fontSize: '1.1rem',
        color: '#333',
        fontWeight: '700'
    }
};

export default WorkPage;