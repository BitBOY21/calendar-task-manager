const taskService = require('../services/taskService');
const asyncHandler = require('../middleware/asyncHandler');
const crypto = require('crypto');
const Task = require('../models/Task');
const { calculateUrgency } = require('../utils/taskUtils');

// --- Controller Functions ---

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getAllTasks(req.user.id);
    res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
    let { recurrence, dueDate, endDate } = req.body;

    // Ensure recurrence is valid
    if (!recurrence || typeof recurrence !== 'string' || recurrence.trim() === '') {
        recurrence = 'none';
    } else {
        recurrence = recurrence.toLowerCase();
    }
    
    // Update req.body.recurrence so it propagates to service/logic
    req.body.recurrence = recurrence;

    // Scenario A: Normal Task (No recurrence)
    if (recurrence === 'none') {
        const task = await taskService.createTask(req.user.id, req.body);
        return res.status(201).json(task);
    }

    // Scenario B: Recurring Task
    const recurrenceId = crypto.randomUUID();
    const tasksToCreate = [];
    
    // Determine number of instances based on recurrence type
    let instancesCount = 12; // Default fallback
    
    switch (recurrence) {
        case 'daily':
            instancesCount = 365; // 1 year
            break;
        case 'weekly':
            instancesCount = 52; // 1 year
            break;
        case 'monthly':
            instancesCount = 24; // 2 years
            break;
        case 'yearly':
            instancesCount = 5; // 5 years
            break;
        default:
            instancesCount = 12;
    }

    let currentDueDate = dueDate ? new Date(dueDate) : null;
    let currentEndDate = endDate ? new Date(endDate) : null;

    // Fetch last order once
    const lastTask = await Task.findOne({ user: req.user.id }).sort({ order: -1 });
    let nextOrder = lastTask && lastTask.order !== undefined ? lastTask.order + 1 : 1;

    for (let i = 0; i < instancesCount; i++) {
        // Clone the task data
        const taskData = {
            ...req.body,
            user: req.user.id,
            recurrenceId,
            dueDate: currentDueDate ? new Date(currentDueDate) : null,
            endDate: currentEndDate ? new Date(currentEndDate) : null,
            order: nextOrder++
        };

        // Ensure defaults and urgency score
        if (taskData.urgencyScore === undefined) {
            taskData.urgencyScore = calculateUrgency(taskData.dueDate, taskData.priority);
        }
        if (!taskData.priority) taskData.priority = 'Medium';
        if (!taskData.tags) taskData.tags = [];
        if (!taskData.subtasks) taskData.subtasks = [];
        if (!taskData.isAllDay) taskData.isAllDay = false;
        if (!taskData.recurrence) taskData.recurrence = recurrence;

        tasksToCreate.push(taskData);

        // Calculate next date based on interval
        if (currentDueDate) {
            if (recurrence === 'daily') {
                currentDueDate.setDate(currentDueDate.getDate() + 1);
                if (currentEndDate) currentEndDate.setDate(currentEndDate.getDate() + 1);
            } else if (recurrence === 'weekly') {
                currentDueDate.setDate(currentDueDate.getDate() + 7);
                if (currentEndDate) currentEndDate.setDate(currentEndDate.getDate() + 7);
            } else if (recurrence === 'monthly') {
                currentDueDate.setMonth(currentDueDate.getMonth() + 1);
                if (currentEndDate) currentEndDate.setMonth(currentEndDate.getMonth() + 1);
            } else if (recurrence === 'yearly') {
                currentDueDate.setFullYear(currentDueDate.getFullYear() + 1);
                if (currentEndDate) currentEndDate.setFullYear(currentEndDate.getFullYear() + 1);
            }
        }
    }

    // Bulk insert all instances
    const createdTasks = await Task.insertMany(tasksToCreate);

    // Return the first created task
    res.status(201).json(createdTasks[0]);
});

const updateTask = asyncHandler(async (req, res) => {
    const updatedTask = await taskService.updateTask(req.user.id, req.params.id, req.body);
    res.status(200).json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
    const { scope } = req.query;
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    if (scope === 'series' && task.recurrenceId) {
        await Task.deleteMany({ recurrenceId: task.recurrenceId, user: req.user.id });
        res.status(200).json({ message: 'Series deleted', id: req.params.id });
    } else {
        await task.deleteOne();
        res.status(200).json({ id: req.params.id });
    }
});

const reorderTasks = asyncHandler(async (req, res) => {
    const result = await taskService.reorderTasks(req.user.id, req.body.tasks);
    res.status(200).json(result);
});

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks
};