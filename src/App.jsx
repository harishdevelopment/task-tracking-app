import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import EventList from './components/EventList';
import CalendarView from './components/CalendarView';
import TaskTiles from './components/TaskTiles';
import TaskForm from './components/TaskForm';
import NotificationSetup from './components/NotificationSetup';
import './App.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function App() {
  const { tasks, loading, addTask, updateTask, deleteTask, togglePrepStep } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const openNew = () => { setEditingTask(null); setShowForm(true); };
  const openEdit = (task) => { setEditingTask(task); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingTask(null); };
  const handleSave = (data) => {
    if (editingTask) updateTask(editingTask.id, data);
    else addTask(data);
    closeForm();
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const upcoming = tasks.filter((t) => t.status !== 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;

  return (
    <div className="app">
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, textAlign: 'center', padding: '8px', background: '#1a1a2e', color: '#aaa', fontSize: '13px' }}>
          Loading tasks from database…
        </div>
      )}
      {/* Top nav */}
      <nav className="topnav">
        <div className="topnav-inner">
          <div className="topnav-brand">
            <span className="brand-icon">&#128197;</span>
            <span className="brand-name">PlanTrack</span>
          </div>
          <div className="topnav-right">
            <NotificationSetup tasks={tasks} />
            <button className="btn-add" onClick={openNew}>+ Add Event</button>
            <div className="avatar">R</div>
          </div>
        </div>
      </nav>

      <main className="page-content">
        {/* Greeting */}
        <div className="hero">
          <div className="hero-text">
            <h1 className="greeting-title">{getGreeting()}´!</h1>
            <p className="greeting-sub">Here's what's on your plate. Stay organized and on track.</p>
          </div>
        </div>

        {/* Upcoming events list with stats in header */}
        <EventList
          tasks={tasks}
          onEdit={openEdit}
          onDelete={deleteTask}
          stats={{ total, upcoming, inProgress, done }}
        />

        {/* Calendar + Task tiles side by side */}
        <div className="bottom-grid">
          <CalendarView tasks={tasks} />
          <TaskTiles
            tasks={tasks}
            onEdit={openEdit}
            onDelete={deleteTask}
            onToggleStep={togglePrepStep}
            onStatusChange={(id, status) => updateTask(id, { status })}
          />
        </div>
      </main>

      {showForm && (
        <TaskForm task={editingTask} onSave={handleSave} onClose={closeForm} />
      )}
    </div>
  );
}
