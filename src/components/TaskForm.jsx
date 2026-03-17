import { useState, useEffect } from 'react';

const EMPTY_TASK = {
  title: '',
  dueDate: '',
  time: '',
  category: 'Other',
  assignees: '',
  status: 'todo',
  notes: '',
  prepSteps: [],
};

const CATEGORIES = ['Family', 'Social', 'Event', 'Work', 'Health', 'Other'];

export default function TaskForm({ task, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_TASK);
  const [newStep, setNewStep] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        ...task,
        time: task.time || '',
        category: task.category || 'Other',
        assignees: task.assignees.join(', '),
      });
    } else {
      setForm(EMPTY_TASK);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addStep = () => {
    const text = newStep.trim();
    if (!text) return;
    setForm((prev) => ({
      ...prev,
      prepSteps: [
        ...prev.prepSteps,
        { id: crypto.randomUUID(), text, done: false },
      ],
    }));
    setNewStep('');
  };

  const removeStep = (id) => {
    setForm((prev) => ({
      ...prev,
      prepSteps: prev.prepSteps.filter((s) => s.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    onSave({
      ...form,
      assignees: form.assignees
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task / Event Title *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Saturday Team Event"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM or All day"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assignees">Involved Parties (comma-separated)</label>
            <input
              id="assignees"
              name="assignees"
              value={form.assignees}
              onChange={handleChange}
              placeholder="e.g. Alice, Bob, Carol"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Additional details..."
            />
          </div>

          <div className="form-group">
            <label>Preparation Steps</label>
            <ul className="prep-step-list">
              {form.prepSteps.map((s) => (
                <li key={s.id}>
                  <span>{s.text}</span>
                  <button
                    type="button"
                    className="btn-icon danger"
                    onClick={() => removeStep(s.id)}
                    aria-label="Remove step"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="add-step-row">
              <input
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Add preparation step..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
              />
              <button type="button" className="btn-secondary" onClick={addStep}>
                Add
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
