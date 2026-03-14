import { getDaysUntil, getUrgencyClass } from '../hooks/useTasks';

const STATUS_LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

function CountdownBadge({ dueDate }) {
  const days = getDaysUntil(dueDate);
  const cls = getUrgencyClass(days);
  let label;
  if (days < 0) label = `${Math.abs(days)}d overdue`;
  else if (days === 0) label = 'Due today!';
  else if (days === 1) label = 'Due tomorrow';
  else label = `${days} days left`;

  return <span className={`countdown ${cls}`}>{label}</span>;
}

export default function TaskList({ tasks, onEdit, onDelete, onToggleStep, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Click <strong>+ New Task</strong> to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const totalSteps = task.prepSteps.length;
        const doneSteps = task.prepSteps.filter((s) => s.done).length;
        const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : null;

        return (
          <div key={task.id} className={`task-card status-${task.status}`}>
            <div className="task-card-header">
              <div className="task-title-row">
                <h3 className="task-title">{task.title}</h3>
                <CountdownBadge dueDate={task.dueDate} />
              </div>
              <div className="task-meta">
                <span className="due-date">
                  📅 {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric',
                  })}
                </span>
                {task.assignees.length > 0 && (
                  <span className="assignees">
                    👥 {task.assignees.join(', ')}
                  </span>
                )}
              </div>
            </div>

            {task.notes && <p className="task-notes">{task.notes}</p>}

            <div className="task-status-row">
              <select
                className={`status-select ${task.status}`}
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {progress !== null && (
                <div className="progress-wrap">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-label">{doneSteps}/{totalSteps} prep steps</span>
                </div>
              )}
            </div>

            {task.prepSteps.length > 0 && (
              <ul className="prep-checklist">
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

            <div className="task-actions">
              <button className="btn-secondary" onClick={() => onEdit(task)}>Edit</button>
              <button className="btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
