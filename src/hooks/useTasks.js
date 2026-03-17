import { useState, useEffect } from 'react';
import { api } from '../api.js';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const loaded = await api.getTasks();

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
