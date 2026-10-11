import React, { useState, useEffect } from 'react';

const API_BASE = '/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task (POST /api/tasks)
  const handleAddTask = async (e) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add task');
      }

      const createdTask = await res.json();
      // Update screen state without full reload
      setTasks((prev) => [createdTask, ...prev]);
      setNewTitle('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle task completion (PUT /api/tasks/:id)
  const handleToggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_BASE}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update task');
      }

      const updatedTask = await res.json();
      // Update screen state without full reload
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updatedTask : t))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Start editing title
  const handleStartEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  // Save edited title (PUT /api/tasks/:id)
  const handleSaveEdit = async (taskId) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update title');
      }

      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updatedTask : t))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Delete a task (DELETE /api/tasks/:id)
  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete task');
      }

      // Update screen state without full reload
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Computed counts & filtered list
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="app-container">
      <div className="card">
        {/* Header */}
        <header className="header">
          <div className="badge-row">
            <span className="tech-badge">MERN STACK</span>
          </div>
          <h1 className="title">To-Do List</h1>
          <p className="subtitle">Manage your daily tasks efficiently and stay organized</p>

          {/* Progress Bar & Stats */}
          {totalTasks > 0 && (
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Task Progress</span>
                <span className="progress-count">
                  {completedTasks} of {totalTasks} completed ({progressPercent}%)
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Error notification */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button
              className="error-dismiss"
              onClick={() => setError(null)}
              title="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Task Form */}
        <form className="task-form" onSubmit={handleAddTask}>
          <div className="input-group">
            <input
              id="new-task-input"
              type="text"
              className="task-input"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={submitting}
              autoFocus
            />
            <button
              id="add-task-btn"
              type="submit"
              className="add-btn"
              disabled={submitting || !newTitle.trim()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>{submitting ? 'Adding...' : 'Add Task'}</span>
            </button>
          </div>
        </form>

        {/* Filter Tabs */}
        {totalTasks > 0 && (
          <div className="filter-tabs">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({totalTasks})
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({totalTasks - completedTasks})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedTasks})
            </button>
          </div>
        )}

        {/* Task List */}
        <div className="task-list-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <p className="empty-title">
                {filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'All tasks are completed!'
                  : 'No tasks yet'}
              </p>
              <p className="empty-hint">
                {filter === 'all'
                  ? 'Add your first task above to get started'
                  : 'Tasks will appear here once updated'}
              </p>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  {/* Complete/Incomplete Checkbox */}
                  <button
                    className={`checkbox-btn ${task.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleComplete(task)}
                    title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  >
                    {task.completed && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>

                  {/* Task Content / Inline Edit */}
                  <div className="task-content">
                    {editingId === task._id ? (
                      <div className="edit-box">
                        <input
                          type="text"
                          className="edit-input"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(task._id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                        />
                        <button
                          className="edit-save-btn"
                          onClick={() => handleSaveEdit(task._id)}
                        >
                          Save
                        </button>
                        <button
                          className="edit-cancel-btn"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        className="task-title-group"
                        onDoubleClick={() => handleStartEdit(task)}
                      >
                        <span className="task-title">{task.title}</span>
                        <span className="task-date">
                          {new Date(task.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Task Actions */}
                  <div className="task-actions">
                    {editingId !== task._id && (
                      <button
                        className="action-btn edit-action"
                        onClick={() => handleStartEdit(task)}
                        title="Edit title"
                        aria-label={`Edit task "${task.title}"`}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      className="action-btn delete-action"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete task"
                      aria-label={`Delete task "${task.title}"`}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer info */}
        <footer className="footer">
          <span>MongoDB • Express • React • Node.js</span>
        </footer>
      </div>
    </div>
  );
}
