import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Tasks
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await taskService.getAll();
            setTasks(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err.message || "Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial Load
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Add Task
    const addTask = async (newTask) => {
        try {
            const createdTask = await taskService.create(newTask);
            setTasks(prev => [createdTask, ...prev]);
            return createdTask;
        } catch (err) {
            console.error("Error adding task:", err);
            throw err;
        }
    };

    // Update Task
    const updateTask = async (id, updatedData) => {
        try {
            // Optimistic Update
            setTasks(prev => prev.map(t => t._id === id ? { ...t, ...updatedData } : t));
            
            const result = await taskService.update(id, updatedData);
            
            // Re-sync with server response (optional, ensures consistency)
            setTasks(prev => prev.map(t => t._id === id ? result : t));
            return result;
        } catch (err) {
            console.error("Error updating task:", err);
            // Revert on error (would need previous state, keeping simple for now)
            fetchTasks(); 
            throw err;
        }
    };

    // Delete Task
    const deleteTask = async (id) => {
        try {
            // Optimistic Update
            setTasks(prev => prev.filter(t => t._id !== id));
            await taskService.delete(id);
        } catch (err) {
            console.error("Error deleting task:", err);
            fetchTasks(); // Revert
            throw err;
        }
    };

    // Generate AI
    const generateAI = async (id) => {
        try {
            const updatedTask = await taskService.generateAI(id);
            setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
            return updatedTask;
        } catch (err) {
            console.error("AI Error:", err);
            throw err;
        }
    };

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        generateAI
    };
};