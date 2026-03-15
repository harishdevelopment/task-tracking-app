import { useState, useEffect } from 'react';
import { api } from '../api.js';

const SAMPLE_TASKS = [
  {
    id: '1',
    title: "Children's Sunday School Competition",
    dueDate: '2026-03-16',
    time: '10:00 AM',
    category: 'Family',
    assignees: ['Alice', 'Bob'],
    status: 'todo',
    notes: 'Annual Sunday school competition at the community center.',
    prepSteps: [
      { id: 'p1', text: 'Register participants', done: true },
      { id: 'p2', text: 'Prepare materials', done: false },
    ],
  },
  {
    id: '2',
    title: 'Friends Weekend Visit',
    dueDate: '2026-03-22',
    time: 'All day',
    category: 'Social',
    assignees: ['Carol', 'Dave'],
    status: 'todo',
    notes: 'Weekend get-together with college friends.',
    prepSteps: [
      { id: 'p3', text: 'Book accommodation', done: false },
      { id: 'p4', text: 'Plan activities', done: false },
    ],
  },
  {
    id: '3',
    title: 'Church International Day',
    dueDate: '2026-03-30',
    time: '9:00 AM',
    category: 'Church',
    assignees: [],
    status: 'todo',
    notes: 'Annual international day celebration at church.',
    prepSteps: [
      { id: 'p5', text: 'Prepare cultural display', done: false },
      { id: 'p6', text: 'Coordinate with team', done: false },
    ],
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Migrate any existing localStorage tasks into SQLite (runs once)
      await api.migrateFromLocalStorage();

      // Load tasks from SQLite via API
      let loaded = await api.getTasks();

      // If DB is empty (very first run with no localStorage data), seed samples
      if (loaded.length === 0) {
        await fetch('/api/tasks/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tasks: SAMPLE_TASKS }),
        });
        loaded = await api.getTasks();
      }

      setTasks(loaded);
      setLoading(false);
    }
    init().catch((err) => {
      console.error('Failed to load tasks from server:', err);
      setLoading(false);
    });
  }, []);

  const addTask = async (task) => {
    const newTask = {
      time: 'All day',
      category: 'Other',
      ...task,
      id: crypto.randomUUID(),
      prepSteps: task.prepSteps || [],
    };
    const saved = await api.createTask(newTask);
    setTasks((prev) => [saved, ...prev]);
  };

  const updateTask = async (id, updates) => {
    const saved = await api.updateTask(id, updates);
    setTasks((prev) => prev.map((t) => (t.id === id ? saved : t)));
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePrepStep = async (taskId, stepId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newPrepSteps = task.prepSteps.map((s) =>
      s.id === stepId ? { ...s, done: !s.done } : s
    );
    const saved = await api.updateTask(taskId, { prepSteps: newPrepSteps });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? saved : t)));
  };

  return { tasks, loading, addTask, updateTask, deleteTask, togglePrepStep };
}

export function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getUrgencyClass(days) {
  if (days < 0) return 'overdue';
  if (days <= 1) return 'urgent';
  if (days <= 3) return 'soon';
  return 'normal';
}
