const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');

// In-memory fallback storage in case MongoDB server is not running locally
let memoryTasks = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    title: 'Review project requirements and setup MERN stack',
    completed: true,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d2',
    title: 'Build clean React user interface',
    completed: false,
    createdAt: new Date(Date.now() - 1800000),
  },
];

// Helper to check if connected to MongoDB
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/tasks — fetch all tasks
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    }
    // Fallback if MongoDB is not running
    res.status(200).json([...memoryTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
});

// POST /api/tasks — add a new task
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (isDbConnected()) {
      const newTask = new Task({
        title: title.trim(),
      });
      const savedTask = await newTask.save();
      return res.status(201).json(savedTask);
    }

    // Fallback if MongoDB is not running
    const fallbackTask = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };
    memoryTasks.unshift(fallbackTask);
    res.status(201).json(fallbackTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

// PUT /api/tasks/:id — update a task (mark complete/incomplete, or edit the title)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (isDbConnected()) {
      const updates = {};
      if (typeof title === 'string') {
        if (!title.trim()) {
          return res.status(400).json({ error: 'Title cannot be empty' });
        }
        updates.title = title.trim();
      }
      if (typeof completed === 'boolean') {
        updates.completed = completed;
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json(updatedTask);
    }

    // Fallback if MongoDB is not running
    const taskIndex = memoryTasks.findIndex((t) => t._id.toString() === id.toString());
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (typeof title === 'string') {
      if (!title.trim()) return res.status(400).json({ error: 'Title cannot be empty' });
      memoryTasks[taskIndex].title = title.trim();
    }
    if (typeof completed === 'boolean') {
      memoryTasks[taskIndex].completed = completed;
    }

    res.status(200).json(memoryTasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    }

    // Fallback if MongoDB is not running
    const taskIndex = memoryTasks.findIndex((t) => t._id.toString() === id.toString());
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [deletedTask] = memoryTasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});

module.exports = router;
