import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TaskDrawer from './components/layout/TaskDrawer';
import Dashboard from './features/dashboard/Dashboard'; 
import DashboardStats from './features/dashboard/DashboardStats';
import WorkView from './features/dashboard/WorkView';
import Settings from './features/dashboard/Settings';
import TaskFormModal from './features/dashboard/TaskFormModal';
import MySummary from './features/dashboard/MySummary';
import History from './features/dashboard/History';
import Login from './features/auth/Login';
import { authService } from './services/authService';
import { taskService } from './services/taskService';
import { FaPlus } from 'react-icons/fa';
import './index.css';

function App() {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({ name: 'User' }); // User state
    const [currentView, setCurrentView] = useState('dashboard'); 
    const [tasks, setTasks] = useState([]);
    
    // UI States
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); 

    useEffect(() => {
        const savedToken = authService.getToken();
        if (savedToken) {
            setToken(savedToken);
            setUser({ name: authService.getUserName() }); // Load user name
        }
    }, []);

    useEffect(() => {
        if (token) fetchTasks();
    }, [token]);

    const fetchTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) { console.error(error); }
    };

    // --- Handlers ---
    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    const handleAddTask = async (newTask) => {
        await taskService.create(newTask);
        await fetchTasks();
        setIsAddModalOpen(false); 
        setSelectedDate(null); 
    };

    const handleUpdateTask = async (taskId, updatedData) => { 
        try {
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updatedData } : t));
            await taskService.update(taskId, updatedData);
            if (selectedTask && selectedTask._id === taskId) {
                setSelectedTask(prev => ({ ...prev, ...updatedData }));
            }
        } catch (error) { fetchTasks(); }
     };
    const handleDeleteTask = async (id) => { 
        await taskService.delete(id);
        setTasks(prev => prev.filter(t => t._id !== id));
        setIsDrawerOpen(false);
     };
    const handleEventDrop = async ({ event, start, end }) => { 
        await handleUpdateTask(event.id, { dueDate: start, endDate: end });
     };

    const handleLogout = () => {
        authService.logout();
        setToken(null);
        setUser({ name: 'User' });
    };

    // --- Render Content ---
    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard onChangeView={setCurrentView} user={user} />;
            
            case 'calendar': 
                return <WorkView 
                            tasks={tasks} 
                            onDateSelect={(date) => {
                                setSelectedDate(date);
                                setIsAddModalOpen(true);
                            }}
                            onEventDrop={handleEventDrop}
                            onEventClick={handleTaskClick}
                            onUpdate={handleUpdateTask}
                            onDelete={handleDeleteTask}
                       />;
            
            case 'list': 
                return <MySummary 
                            tasks={tasks} 
                            user={user} 
                            onUpdate={handleUpdateTask} // Pass update handler
                            onDelete={handleDeleteTask} // Pass delete handler
                       />;

            case 'history':
                return <History tasks={tasks} onRestore={async (id) => {
                    await handleUpdateTask(id, { isCompleted: false });
                }} />;

            case 'settings':
                return <Settings user={user} />;
            
            case 'stats':
                return <DashboardStats tasks={tasks} user={user} />;

            default:
                return <Dashboard onChangeView={setCurrentView} user={user} />;
        }
    };

    if (!token) return <Login onLogin={(newToken) => {
        setToken(newToken);
        setUser({ name: authService.getUserName() }); // Update user on login
    }} />;

    return (
        <div className="app-layout" style={{display: 'flex', height: '100vh', overflow: 'hidden'}}>
            
            {/* Sidebar Navigation */}
            <Sidebar 
                currentView={currentView} 
                onChangeView={setCurrentView} 
                onLogout={handleLogout} 
            />

            {/* Main Content Area */}
            <div style={{flex: 1, position: 'relative', backgroundColor: '#f4f6f9', overflow: 'hidden'}}>
                {renderContent()}

                {/* FAB is now handled inside Dashboard for that view */}
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

            {/* Drawers & Modals */}
            <TaskDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                task={selectedTask}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
            />

            <TaskFormModal 
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