import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const Dashboard = ({ userEmail, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTaskTitle })
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      const data = await response.json();
      setTasks(prev => [...prev, data.task]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tasks/${task.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      // Revert on failure
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
      setError(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    // Optimistic UI update
    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    } catch (err) {
      // Revert on failure
      setTasks(previousTasks);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Logged in as: <span className="font-medium text-indigo-600">{userEmail}</span></p>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors font-medium shadow-sm"
          >
            Sign Out
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Task Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    id="title"
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="E.g., Review pull requests..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Task
                </button>
              </form>
            </div>
          </div>

          {/* Task List */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              Your Tasks
              <span className="bg-indigo-100 text-indigo-800 text-xs py-1 px-2 rounded-full">{tasks.length}</span>
            </h2>
            
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white p-10 text-center rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-gray-500">You don't have any tasks yet.</p>
                <p className="text-sm text-gray-400 mt-1">Create one using the form on the left.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`bg-white p-5 rounded-xl shadow-sm border ${task.status === 'Completed' ? 'border-green-100 bg-green-50/30' : 'border-gray-100'} transition-all hover:shadow-md flex justify-between items-center group`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button 
                        onClick={() => handleToggleStatus(task)}
                        className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none ${task.status === 'Completed' ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-indigo-400'}`}
                        aria-label="Toggle status"
                      >
                        {task.status === 'Completed' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <div className={`flex-1 transition-all ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                      aria-label="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
