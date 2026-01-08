import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext'; 
import TaskForm from '../features/tasks/components/TaskForm'; 
import TaskList from '../features/tasks/components/TaskList'; 
import DailySummaryAI from '../features/dashboard/components/DailySummaryAI'; 
import StatsRow from '../features/dashboard/components/StatsRow'; 
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FaPlus } from 'react-icons/fa';

const DashboardPage = ({ user, onChangeView, onRequestDelete }) => { 
    const { tasks, addTask, updateTask, deleteTask, generateAI } = useTaskContext();
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    const userName = user?.name || 'User'; 

    const handleAddTask = async (newTask) => {
        if (selectedDate && !newTask.dueDate) {
            const d = new Date(selectedDate);
            const offset = d.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(d - offset)).toISOString();
            newTask.dueDate = localISOTime;
        }
        await addTask(newTask);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    });

    const sortedTodayTasks = [...todayTasks].sort((a, b) => {
        const timeA = new Date(a.dueDate).getTime();
        const timeB = new Date(b.dueDate).getTime();
        if (timeA !== timeB) return timeA - timeB;
        const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
    });

    return (
        <div style={styles.container}>
            
            <div style={styles.headerContainer}>
                <h1 style={styles.greeting}>
                    <span className="text-gradient">{greeting}</span> <span className="text-gradient">{userName}</span> 👋
                </h1>
                <p style={styles.subGreeting}>Here's your daily overview</p>
            </div>

            <div style={styles.contentWrapper}>
                
                <StatsRow tasks={tasks} />

                <Card style={{ padding: '25px' }}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>📅 Today's Focus</h3>
                        <span style={styles.badge}>{sortedTodayTasks.length} tasks</span>
                    </div>
                    
                    <div style={styles.listWrapper}>
                        {sortedTodayTasks.length > 0 ? (
                            <TaskList
                                tasks={sortedTodayTasks}
                                onDelete={onRequestDelete || deleteTask} // Use onRequestDelete if available (for modals), fallback to direct delete
                                onUpdate={updateTask}
                                onGenerateAI={generateAI}
                                onEdit={handleEditTask}
                            />
                        ) : (
                            <div style={styles.emptyState}>
                                <span style={{fontSize: '2rem'}}>☕</span>
                                <p>No tasks scheduled for today. Enjoy!</p>
                            </div>
                        )}
                    </div>
                </Card>

                <DailySummaryAI tasks={tasks} />

            </div>

            <Button 
                variant="fab" 
                onClick={() => { setSelectedDate(new Date()); setIsAddModalOpen(true); }} 
                title="Add New Task"
            >
                <FaPlus />
            </Button>

            <TaskForm 
                isOpen={isAddModalOpen || !!editingTask} 
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingTask(null);
                }}
                onAdd={handleAddTask}
                onUpdate={updateTask}
                onRequestDelete={onRequestDelete} // Pass the modal handler
                onDelete={deleteTask} // Fallback
                taskToEdit={editingTask}
                initialDate={selectedDate} 
            />
        </div>
    );
};

const styles = {
    container: { 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '20px', 
        position: 'relative', 
        height: '100%', // Changed from minHeight to height
        overflowY: 'auto', // Added scrolling
        display: 'flex', 
        flexDirection: 'column' 
    },
    
    headerContainer: { textAlign: 'center', marginBottom: '25px', flexShrink: 0 },
    greeting: { margin: 0, fontSize: '2.2rem', fontWeight: '800', color: '#333' },
    subGreeting: { margin: '5px 0 0 0', fontSize: '1.1rem', color: '#666' },

    contentWrapper: { display: 'flex', flexDirection: 'column', gap: '25px', paddingBottom: '80px' },

    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' },
    sectionTitle: { margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#333' },
    badge: { backgroundColor: '#e3f2fd', color: '#007bff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600' },
    
    listWrapper: { minHeight: '200px' },
    emptyState: { textAlign: 'center', padding: '40px', color: '#888' },
};

export default DashboardPage;