const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';


const users = [
  {
    email: 'test@example.com',
    passwordHash: bcrypt.hashSync('password123', 10)
  }
];

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ email, passwordHash });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header missing' });
  }
};

app.get('/api/profile', authenticateJWT, (req, res) => {
  res.json({
    message: 'Profile access granted',
    user: req.user
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
