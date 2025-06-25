import React from 'react';
import '../styles/CalendarSection.css';

const CalendarToggle = ({ isOpen, onToggle, selectedDate }) => {
  const day = selectedDate.getDate();
  const month = selectedDate.toLocaleString('en-US', { month: 'short' });
  const year = selectedDate.getFullYear();

  return (
    <div className="calendar-toggle-bar" onClick={onToggle}>
      <div className="calendar-toggle-info">
        <span className="calendar-toggle-day">{day}</span>
        <span className="calendar-toggle-month">
          {month} / {year}
        </span>
      </div>
      <div className="calendar-fab" role="button" aria-label="calendar icon">
        📅
      </div>
    </div>
  );
};

export default CalendarToggle;
