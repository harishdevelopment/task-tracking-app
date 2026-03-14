import { useState, useEffect } from 'react';

function requestAndSchedule(tasks) {
  if (!('Notification' in window)) return;

  Notification.requestPermission().then((perm) => {
    if (perm !== 'granted') return;

    const upcoming = tasks
      .filter((t) => t.status !== 'done')
      .map((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(t.dueDate + 'T00:00:00');
        const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return { ...t, daysLeft: days };
      })
      .filter((t) => t.daysLeft >= 0 && t.daysLeft <= 7);

    if (upcoming.length === 0) return;

    const lines = upcoming.map((t) => {
      const pending = t.prepSteps.filter((s) => !s.done).length;
      const dayLabel = t.daysLeft === 0 ? 'today' : t.daysLeft === 1 ? 'tomorrow' : `in ${t.daysLeft} days`;
      return `• ${t.title} (${dayLabel}${pending > 0 ? `, ${pending} steps left` : ' ✅'})`;
    });

    new Notification('📅 Daily Task Reminder', {
      body: lines.join('\n'),
      icon: '/vite.svg',
    });
  });
}

export default function NotificationSetup({ tasks }) {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    const handler = () => setPermission(Notification.permission);
    // Re-check after a short delay (permission changes are async)
    const id = setTimeout(handler, 500);
    return () => clearTimeout(id);
  }, []);

  if (permission === 'unsupported') return null;

  const enable = () => {
    requestAndSchedule(tasks);
    setTimeout(() => setPermission(Notification.permission), 600);
  };

  if (permission === 'granted') {
    return (
      <div className="notification-bar granted">
        🔔 Notifications enabled.{' '}
        <button className="btn-link" onClick={() => requestAndSchedule(tasks)}>
          Send reminder now
        </button>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="notification-bar denied">
        🔕 Notifications blocked. Enable them in your browser settings to receive daily reminders.
      </div>
    );
  }

  return (
    <div className="notification-bar prompt">
      🔔 Enable daily notifications to stay on top of your tasks.{' '}
      <button className="btn-primary small" onClick={enable}>
        Enable Notifications
      </button>
    </div>
  );
}
