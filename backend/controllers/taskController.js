const Task = require('../models/Task');

const getTasks = (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const tasks = Task.findAllByUser(userEmail);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

const createTask = (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const { title } = req.body;
    const newTask = Task.create(userEmail, title);
    res.status(201).json({ task: newTask });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Ensure task exists and belongs to user
    const task = Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.userEmail !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized to update this task' });
    }

    const updatedTask = Task.updateStatus(id, status);
    res.json({ task: updatedTask });
  } catch (error) {
    next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Ensure task exists and belongs to user
    const task = Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.userEmail !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized to delete this task' });
    }

    Task.delete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTaskStatus, deleteTask };
