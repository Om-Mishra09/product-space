const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateJWT } = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

// Protect all task routes
router.use(authenticateJWT);

router.get('/', taskController.getTasks);
router.post('/', validateTask, taskController.createTask);
router.put('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
