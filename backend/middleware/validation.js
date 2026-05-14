const validateTask = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required and cannot be empty' });
  }
  next();
};

module.exports = { validateTask };
