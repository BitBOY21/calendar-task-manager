const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { taskSchema, taskUpdateSchema } = require('../utils/validationSchemas');

const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks
} = require('../controllers/taskController');

// Special route for reordering
router.put('/reorder', protect, reorderTasks);

router.route('/')
    .get(protect, getTasks)
    .post(protect, validate(taskSchema), createTask); // Added Validation

router.route('/:id')
    .put(protect, validate(taskUpdateSchema), updateTask) // Use update schema (all fields optional)
    .delete(protect, deleteTask);

module.exports = router;