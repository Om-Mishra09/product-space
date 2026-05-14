const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'An unexpected internal server error occurred' });
};

module.exports = errorHandler;
