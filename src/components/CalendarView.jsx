import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const CATEGORY_COLORS = {
  Family:  { bg: '#e8f0fe', color: '#4285f4' },
  Social:  { bg: '#f3e8fd', color: '#9333ea' },
  Event:  { bg: '#fef3c7', color: '#d97706' },
  Work:    { bg: '#dcfce7', color: '#16a34a' },
  Health:  { bg: '#fee2e2', color: '#ef4444' },
  Other:   { bg: '#f1f5f9', color: '#64748b' },
};

export default function CalendarView({ tasks }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // Map day number -> tasks for current month
  const tasksByDay = {};
  tasks.forEach((t) => {
    const d = new Date(t.dueDate + 'T00:00:00');
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!tasksByDay[day]) tasksByDay[day] = [];
      tasksByDay[day].push(t);
    }
  });

  // Build grid cells
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  let trailing = 1;
  while (cells.length < 42) {
    cells.push({ day: trailing++, current: false });
  }

  const isToday = (day) =>
    day.current &&
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day.day;

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h2 className="calendar-month">{MONTHS[month]} {year}</h2>
        <div className="calendar-nav">
          <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">&#8249;</button>
          <button className="cal-today-btn" onClick={goToday}>Today</button>
          <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">&#8250;</button>
        </div>
      </div>

      <div className="calendar-grid">
        {DAYS.map((d) => (
          <div key={d} className="cal-day-header">{d}</div>
        ))}
        {cells.map((cell, i) => {
          const dayTasks = cell.current ? (tasksByDay[cell.day] || []) : [];
          return (
            <div
              key={i}
              className={[
                'cal-cell',
                !cell.current ? 'other-month' : '',
                isToday(cell) ? 'today' : '',
                dayTasks.length > 0 ? 'has-event' : '',
              ].filter(Boolean).join(' ')}
            >
              <span className="cal-date">{cell.day}</span>
              {dayTasks.map((t) => {
                const catStyle = CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Other;
                return (
                  <span
                    key={t.id}
                    className="cal-event-label"
                    style={{ background: catStyle.bg, color: catStyle.color }}
                    title={t.title}
                  >
                    {t.title}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
