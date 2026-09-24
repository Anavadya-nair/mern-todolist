const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todolist';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected (MongoDB)' : 'in-memory fallback (offline)',
    timestamp: new Date().toISOString(),
  });
});

// Start listening immediately
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB asynchronously
console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 2000,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.warn(`Could not connect to MongoDB at ${MONGODB_URI}: ${err.message}`);
    console.log('App is running with in-memory fallback. Connect MongoDB anytime by updating .env and restarting.');
  });
