const bcrypt = require('bcryptjs');

// In-memory users array with a hardcoded test user
const users = [
  {
    email: 'test@example.com',
    passwordHash: bcrypt.hashSync('password123', 10)
  }
];

const User = {
  findByEmail: (email) => users.find(u => u.email === email),
  create: (email, passwordHash) => {
    const newUser = { email, passwordHash };
    users.push(newUser);
    return newUser;
  }
};

module.exports = User;
