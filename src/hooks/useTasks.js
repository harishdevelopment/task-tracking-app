import { useState, useEffect } from 'react';

const STORAGE_KEY = 'task-tracker-tasks';

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
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SAMPLE_TASKS;
    } catch {
      return SAMPLE_TASKS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    const newTask = {
      time: 'All day',
      category: 'Other',
      ...task,
      id: crypto.randomUUID(),
      prepSteps: task.prepSteps || [],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePrepStep = (taskId, stepId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          prepSteps: t.prepSteps.map((s) =>
            s.id === stepId ? { ...s, done: !s.done } : s
          ),
        };
      })
    );
  };

  return { tasks, addTask, updateTask, deleteTask, togglePrepStep };
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
