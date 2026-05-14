// In-memory tasks array
let tasks = [];
let nextId = 1;

const Task = {
  findAllByUser: (userEmail) => tasks.filter(t => t.userEmail === userEmail),
  create: (userEmail, title) => {
    const newTask = {
      id: nextId++,
      userEmail,
      title,
      status: 'Pending'
    };
    tasks.push(newTask);
    return newTask;
  },
  findById: (id) => tasks.find(t => t.id === parseInt(id, 10)),
  updateStatus: (id, status) => {
    const task = tasks.find(t => t.id === parseInt(id, 10));
    if (task) {
      task.status = status;
    }
    return task;
  },
  delete: (id) => {
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== parseInt(id, 10));
    return tasks.length < initialLength;
  }
};

module.exports = Task;
