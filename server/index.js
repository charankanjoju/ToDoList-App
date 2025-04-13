// /todo-app/server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;




// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date, // 👈 Must be Date type
  category: String,
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', taskSchema);



// Routes

// Get all tasks with optional search and category filter
app.get('/tasks', async (req, res) => {
  const { search = '', category = '' } = req.query;

  const filter = {
    title: { $regex: search, $options: 'i' },
    category: { $regex: category, $options: 'i' },
  };

  try {
    const tasks = await Task.find(filter).sort({ dueDate: 1 }); // Sort by dueDate ascending
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Add a task
app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Toggle task completion
app.patch('/tasks/:id/toggle', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
