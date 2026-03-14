import { getDaysUntil } from '../hooks/useTasks';

function getDailyTips(tasks) {
  const upcoming = tasks
    .filter((t) => t.status !== 'done')
    .map((t) => ({ ...t, daysLeft: getDaysUntil(t.dueDate) }))
    .filter((t) => t.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return upcoming;
}

export default function PrepPlan({ tasks }) {
  const upcoming = getDailyTips(tasks);

  if (upcoming.length === 0) {
    return (
      <div className="prep-plan empty-state">
        <p>No upcoming tasks. All caught up! 🎉</p>
      </div>
    );
  }

  return (
    <div className="prep-plan">
      <div className="prep-summary">
        <h2>📋 Preparation Plan</h2>
        <p className="prep-subtitle">
          {upcoming.length} upcoming task{upcoming.length !== 1 ? 's' : ''} — here's what to focus on today:
        </p>
      </div>

      {upcoming.map((task) => {
        const pending = task.prepSteps.filter((s) => !s.done);
        const done = task.prepSteps.filter((s) => s.done);
        const urgency = task.daysLeft <= 1 ? 'urgent' : task.daysLeft <= 3 ? 'soon' : 'normal';

        return (
          <div key={task.id} className={`prep-card urgency-${urgency}`}>
            <div className="prep-card-header">
              <div>
                <h3>{task.title}</h3>
                <p className="prep-date">
                  Due in <strong>{task.daysLeft === 0 ? 'today' : `${task.daysLeft} day${task.daysLeft !== 1 ? 's' : ''}`}</strong>
                  {' '}· {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {urgency === 'urgent' && <span className="urgency-badge">⚠️ Urgent</span>}
            </div>

            {task.assignees.length > 0 && (
              <p className="prep-assignees">👥 Involved: {task.assignees.join(', ')}</p>
            )}

            {pending.length > 0 ? (
              <>
                <h4 className="prep-section-title">🔲 Still to do:</h4>
                <ul className="prep-steps">
                  {pending.map((s) => <li key={s.id}>{s.text}</li>)}
                </ul>
              </>
            ) : (
              <p className="all-done">✅ All preparation steps complete!</p>
            )}

            {done.length > 0 && pending.length > 0 && (
              <>
                <h4 className="prep-section-title completed">✅ Completed:</h4>
                <ul className="prep-steps completed">
                  {done.map((s) => <li key={s.id}>{s.text}</li>)}
                </ul>
              </>
            )}

            {task.daysLeft <= 3 && pending.length > 0 && (
              <div className="daily-action">
                <strong>Today's focus:</strong> {pending[0].text}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
