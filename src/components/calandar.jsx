import React, { useState } from 'react';

function Calendar({ onDateSelect }) {
  // Define state variables
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Function to get the first day of the month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Function to get the number of days in the month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Function to handle date selection
  const handleDateClick = (day) => {
    // Check if the selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates accurately
    if (day < today) {
      // If the selected date is in the past, do not update the state
      return;
    }

    // Check if the selected date is a Friday (day index 5)
    if (day.getDay() === 5) {
      // If the selected date is a Friday, do not update the state
      return;
    }
    
    setSelectedDate(day);
    // Call the callback function with the selected date
    onDateSelect(day);
  };

  // Render calendar grid
  const renderCalendarGrid = () => {
    const firstDay = getFirstDayOfMonth(selectedDate);
    const totalDays = getDaysInMonth(selectedDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="empty-cell"></div>);
    }

    // Add cells for each day in the month
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      days.push(
        <div
          key={date.toDateString()}
          className={`calendar-day ${date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      {/* Calendar Header (Month and Year) */}
      <div className="calendar-header">
        <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}>&lt;</button>
        <h2>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>&gt;</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Weekday Headers */}
        <div className="weekday-header">Sun</div>
        <div className="weekday-header">Mon</div>
        <div className="weekday-header">Tue</div>
        <div className="weekday-header">Wed</div>
        <div className="weekday-header">Thu</div>
        <div className="weekday-header">Fri</div>
        <div className="weekday-header">Sat</div>

        {/* Calendar Days */}
        {renderCalendarGrid()}
      </div>
    </div>
  );
}

export default Calendar;
