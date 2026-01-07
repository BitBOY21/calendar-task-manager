import React, { useState, useEffect } from 'react';
import { useTaskContext } from './context/TaskContext'; 
import Sidebar from './components/layout/Sidebar';
import TaskDrawer from './components/layout/TaskDrawer';
import DashboardPage from './pages/DashboardPage'; // Updated path
import WorkPage from './pages/WorkPage'; // Updated path
import AnalyticsPage from './pages/AnalyticsPage'; // Updated path
import HistoryPage from './pages/HistoryPage'; // Updated path
import SettingsPage from './pages/SettingsPage'; // Updated path
import TaskForm from './features/tasks/components/TaskForm'; 
import Login from './features/auth/Login';
import { authService } from './services/authService';
import { FaPlus } from 'react-icons/fa';
import './index.css';

function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({ name: 'User' });
    const [currentView, setCurrentView] = useState('dashboard'); 
    
    const { addTask, updateTask, deleteTask } = useTaskContext();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); 

    useEffect(() => {
        const savedToken = authService.getToken();
        if (savedToken) {
            setToken(savedToken);
            setUser({ name: authService.getUserName() });
        }
    }, []);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    const handleAddTask = async (newTask) => {
        await addTask(newTask);
        setIsAddModalOpen(false); 
        setSelectedDate(null); 
    };

    const handleUpdateTask = async (taskId, updatedData) => { 
        await updateTask(taskId, updatedData);
        if (selectedTask && selectedTask._id === taskId) {
            setSelectedTask(prev => ({ ...prev, ...updatedData }));
        }
    };

    const handleDeleteTask = async (id) => { 
        await deleteTask(id);
        setIsDrawerOpen(false);
    };

    const handleEventDrop = async ({ event, start, end }) => { 
        await updateTask(event.id, { dueDate: start, endDate: end });
    };

    const handleLogout = () => {
        authService.logout();
        setToken(null);
        setUser({ name: 'User' });
    };

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardPage onChangeView={setCurrentView} user={user} />;
            
            case 'calendar': 
                return <WorkPage 
                            onDateSelect={(date) => {
                                setSelectedDate(date);
                                setIsAddModalOpen(true);
                            }}
                            onEventDrop={handleEventDrop}
                            onEventClick={handleTaskClick}
                       />;
            
            case 'list': 
                return <AnalyticsPage user={user} />;

            case 'history':
                return <HistoryPage />;

            case 'settings':
                return <SettingsPage user={user} />;
            
            case 'stats':
                return <AnalyticsPage user={user} />;

            default:
                return <DashboardPage onChangeView={setCurrentView} user={user} />;
        }
    };

    if (!token) return <Login onLogin={(newToken) => {
        setToken(newToken);
        setUser({ name: authService.getUserName() });
    }} />;

    return (
        <div className="app-layout" style={{display: 'flex', height: '100vh', overflow: 'hidden'}}>
            
            <Sidebar 
                currentView={currentView} 
                onChangeView={setCurrentView} 
                onLogout={handleLogout} 
            />

            <div style={{flex: 1, position: 'relative', backgroundColor: '#f4f6f9', overflow: 'hidden'}}>
                {renderContent()}

                {currentView !== 'dashboard' && (
                    <button 
                        onClick={() => {
                            setSelectedDate(new Date()); 
                            setIsAddModalOpen(true);
                        }}
                        style={fabStyle}
                        title="Add New Task"
                    >
                        <FaPlus />
                    </button>
                )}
            </div>

            <TaskDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                task={selectedTask}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
            />

            <TaskForm
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setSelectedDate(null);
                }}
                onAdd={handleAddTask}
                initialDate={selectedDate}
            />
        </div>
    );
}

const fabStyle = {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,123,255,0.4)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    zIndex: 1000
};

export default App;