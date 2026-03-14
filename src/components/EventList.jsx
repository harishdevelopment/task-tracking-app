const CATEGORY_STYLES = {
  Family:  { bg: '#e8f0fe', color: '#4285f4', icon: 'F' },
  Social:  { bg: '#f3e8fd', color: '#9333ea', icon: 'S' },
  Church:  { bg: '#fef3c7', color: '#d97706', icon: 'C' },
  Work:    { bg: '#dcfce7', color: '#16a34a', icon: 'W' },
  Health:  { bg: '#fee2e2', color: '#ef4444', icon: 'H' },
  Other:   { bg: '#f1f5f9', color: '#64748b', icon: 'O' },
};

function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
}

function formatEventDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function EventList({ tasks, onEdit, onDelete, stats }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in30Days = new Date(today);
  in30Days.setDate(today.getDate() + 30);

  const upcoming = tasks
    .filter((t) => {
      if (t.status === 'done') return false;
      const due = new Date(t.dueDate + 'T00:00:00');
      return due >= today && due <= in30Days;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const header = (
    <div className="events-card-header">
      <h2 className="events-title">Upcoming Events <span className="events-title-sub">— next 30 days</span></h2>
      <div className="events-header-right">
        {stats && (
          <div className="events-stats">
            <div className="events-stat">
              <span className="events-stat-num">{stats.total}</span>
              <span className="events-stat-label">Total</span>
            </div>
            <div className="events-stat accent-blue">
              <span className="events-stat-num">{stats.upcoming}</span>
              <span className="events-stat-label">Upcoming</span>
            </div>
            <div className="events-stat accent-amber">
              <span className="events-stat-num">{stats.inProgress}</span>
              <span className="events-stat-label">In Progress</span>
            </div>
            <div className="events-stat accent-green">
              <span className="events-stat-num">{stats.done}</span>
              <span className="events-stat-label">Done</span>
            </div>
          </div>
        )}
        <span className="events-count-badge">{upcoming.length} event{upcoming.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );

  if (upcoming.length === 0) {
    return (
      <div className="events-card">
        {header}
        <div className="events-empty">No events in the next 30 days.</div>
      </div>
    );
  }

  return (
    <div className="events-card">
      {header}
      <ul className="events-list">
        {upcoming.map((task, idx) => {
          const style = getCategoryStyle(task.category || 'Other');
          return (
            <li key={task.id} className={`event-row ${idx < upcoming.length - 1 ? 'with-divider' : ''}`}>
              <div
                className="event-icon"
                style={{ background: style.bg, color: style.color }}
                title={task.category}
              >
                {style.icon}
              </div>
              <div className="event-info">
                <span className="event-name">{task.title}</span>
                <span className="event-meta">
                  {formatEventDate(task.dueDate)}
                  {task.time ? <> &bull; {task.time}</> : null}
                  {task.category ? <> &bull; {task.category}</> : null}
                </span>
              </div>
              <div className="event-actions">
                <button className="event-action-btn" onClick={() => onEdit(task)} title="Edit">&#9998;</button>
                <button className="event-action-btn danger" onClick={() => onDelete(task.id)} title="Delete">&#10005;</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
