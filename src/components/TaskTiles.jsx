import { useState } from 'react';
import { getDaysUntil, getUrgencyClass } from '../hooks/useTasks';

const CATEGORY_STYLES = {
  Family:  { bg: '#e8f0fe', color: '#4285f4' },
  Social:  { bg: '#f3e8fd', color: '#9333ea' },
  Event:  { bg: '#fef3c7', color: '#d97706' },
  Work:    { bg: '#dcfce7', color: '#16a34a' },
  Health:  { bg: '#fee2e2', color: '#ef4444' },
  Other:   { bg: '#f1f5f9', color: '#64748b' },
};

const STATUS_OPTIONS = ['todo', 'in-progress', 'done'];
const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

function getCategoryStyle(cat) {
  return CATEGORY_STYLES[cat] || CATEGORY_STYLES.Other;
}

function CountdownPill({ dueDate }) {
  const days = getDaysUntil(dueDate);
  const cls = getUrgencyClass(days);
  let label;
  if (days < 0) label = `${Math.abs(days)}d overdue`;
  else if (days === 0) label = 'Today';
  else if (days === 1) label = 'Tomorrow';
  else label = `${days} days`;
  return <span className={`tile-countdown ${cls}`}>{label}</span>;
}

export default function TaskTiles({ tasks, onEdit, onDelete, onToggleStep, onStatusChange }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = tasks
    .filter((t) => filter === 'all' || t.status === filter)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="task-tiles-section">
      <div className="tiles-header">
        <h2 className="tiles-title">All Tasks</h2>
        <div className="tiles-filter">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className="filter-count">{tasks.length}</span>
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {STATUS_LABELS[s]}{' '}
              <span className="filter-count">{tasks.filter((t) => t.status === s).length}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="tiles-empty">No tasks match this filter.</div>
      ) : (
        <div className="tiles-grid">
          {filtered.map((task) => {
            const catStyle = getCategoryStyle(task.category);
            const totalSteps = task.prepSteps.length;
            const doneSteps = task.prepSteps.filter((s) => s.done).length;
            const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : null;
            const isExpanded = expandedId === task.id;

            return (
              <div key={task.id} className={`task-tile status-${task.status}`}>
                {/* Tile header */}
                <div className="tile-top">
                  <span
                    className="tile-category-badge"
                    style={{ background: catStyle.bg, color: catStyle.color }}
                  >
                    {task.category || 'Other'}
                  </span>
                  <CountdownPill dueDate={task.dueDate} />
                </div>

                {/* Title */}
                <h3 className="tile-name">{task.title}</h3>

                {/* Date + time */}
                <p className="tile-date">
                  {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  })}
                  {task.time ? ` · ${task.time}` : ''}
                </p>

                {/* Assignees */}
                {task.assignees && task.assignees.length > 0 && (
                  <p className="tile-assignees">
                    {task.assignees.map((a, i) => (
                      <span key={i} className="tile-avatar" title={a}>
                        {a[0].toUpperCase()}
                      </span>
                    ))}
                    <span className="tile-assignee-names">{task.assignees.join(', ')}</span>
                  </p>
                )}

                {/* Progress bar */}
                {progress !== null && (
                  <div className="tile-progress-wrap">
                    <div className="tile-progress-bar">
                      <div className="tile-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="tile-progress-label">{doneSteps}/{totalSteps} steps</span>
                  </div>
                )}

                {/* Status + actions in one row */}
                <div className="tile-bottom-row">
                  <select
                    className={`tile-status-select ${task.status}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <div className="tile-actions">
                    {totalSteps > 0 && (
                      <button
                        className="tile-expand-btn"
                        onClick={() => setExpandedId(isExpanded ? null : task.id)}
                      >
                        {isExpanded ? '▲ Hide' : '▼'} Steps ({doneSteps}/{totalSteps})
                      </button>
                    )}
                    <button className="tile-btn-edit" onClick={() => onEdit(task)}>Edit</button>
                    <button className="tile-btn-delete" onClick={() => onDelete(task.id)}>Delete</button>
                  </div>
                </div>

                {/* Prep steps (collapsible) */}
                {isExpanded && totalSteps > 0 && (
                  <ul className="tile-prep-list">
                    {task.prepSteps.map((step) => (
                      <li key={step.id} className={step.done ? 'done' : ''}>
                        <label>
                          <input
                            type="checkbox"
                            checked={step.done}
                            onChange={() => onToggleStep(task.id, step.id)}
                          />
                          {step.text}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
