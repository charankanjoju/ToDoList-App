import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', category: '' });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [search, categoryFilter]);
  const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  document.body.className = darkMode ? 'dark' : '';
}, [darkMode]);

  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:5000/tasks?search=${search}&category=${categoryFilter}`);
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!form.title.trim()) return;
  
    const taskToAdd = {
      ...form,
      dueDate: new Date(form.dueDate), // Convert to Date object
    };
  
    await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskToAdd),
    });
  
    setForm({ title: '', description: '', dueDate: '', category: '' });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const toggleComplete = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}/toggle`, { method: 'PATCH' });
    fetchTasks();
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <button
  onClick={() => setDarkMode(!darkMode)}
  style={{ float: 'right', marginBottom: '1rem' }}
>
  {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
</button>

      <div className="inputs-container">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input name="dueDate" value={form.dueDate} onChange={handleChange} placeholder="Due Date" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="filters-container">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks" />
        <input value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} placeholder="Filter by Category" />
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={`task ${task.completed ? 'completed' : ''}`}>
            <div className="task-details">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <small>{task.dueDate} | {task.category}</small>
            </div>
            <div>
              <button className="complete" onClick={() => toggleComplete(task._id)}>✔</button>
              <button className="delete" onClick={() => deleteTask(task._id)}>✖</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
