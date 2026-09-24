# MERN Stack To-Do List Application

A full-stack personal task management web application built with the **MERN** stack:
- **MongoDB & Mongoose**: Database and object modeling for task documents.
- **Express.js**: REST API server handling CRUD operations.
- **React.js**: Modern, reactive user interface with state management and dynamic UI updates (no full page reloads).
- **Node.js**: JavaScript runtime environment powering the backend.

---

## 📁 Project Structure

```text
to dodlist/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose schema (title, completed, createdAt)
│   ├── routes/
│   │   └── taskRoutes.js    # REST API endpoints (GET, POST, PUT, DELETE)
│   ├── .env                 # Environment variables (PORT, MONGODB_URI)
│   ├── package.json         # Backend dependencies & start script
│   └── server.js            # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component (CRUD handlers, UI)
│   │   ├── index.css        # Modern, responsive styling
│   │   └── main.jsx         # React DOM mount point
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies & start script
│   └── vite.config.js       # Vite build configuration with API proxy
├── screenshots/             # Screenshots of working application
│   ├── 01_add_task.png      # Adding new tasks
│   ├── 02_complete_task.png # Completing tasks & progress tracking
│   └── 03_delete_task.png   # Deleting tasks & active list
└── README.md                # Project documentation & instructions
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher installed on your computer.
- **MongoDB**: Either a local MongoDB instance running on `localhost:27017` or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

---

### 2. Backend Setup

1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Open or create `.env` in `backend/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todolist
   ```
   *(If you are using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string, e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/todolist`)*

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Open a second terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   *(or `npm run dev`)*

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetch all tasks | *None* |
| **POST** | `/api/tasks` | Add a new task | `{"title": "Buy groceries"}` |
| **PUT** | `/api/tasks/:id` | Update task completion or title | `{"completed": true}` or `{"title": "Updated title"}` |
| **DELETE** | `/api/tasks/:id` | Delete a task | *None* |

---

## ✨ Features & Functionality

- **Live CRUD without page reload**: All actions communicate with the backend via REST API (`fetch`) and update React component state instantly.
- **Task Schema**:
  - `title` (`String`, required, trimmed)
  - `completed` (`Boolean`, default: `false`)
  - `createdAt` (`Date`, default: `Date.now`)
- **Filter Tabs**: Filter by "All", "Active", or "Completed" tasks.
- **Progress Counter**: Real-time completion percentage and progress bar.
- **Inline Editing**: Double-click or click the edit icon on any task to update its title.
- **Modern Clean Design**: Card layout, subtle shadows, responsive typography, and mobile-friendly interface.
