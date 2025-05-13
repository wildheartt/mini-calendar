import React from 'react';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getMonthMatrix(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let dayOfWeek = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

const CalendarGrid = ({ currentDate, tasks, onDoubleClickDate }) => {
  const matrix = getMonthMatrix(currentDate);

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        borderRadius: 8,
      }}
    >
      <thead>
        <tr>
          {days.map((day) => (
            <th key={day} style={{ padding: 4, fontWeight: 500 }}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((week, i) => (
          <tr key={i}>
            {week.map((date, j) => (
              <td
                key={j}
                style={{
                  height: 60,
                  verticalAlign: 'top',
                  border: '1px solid #eee',
                  padding: 4,
                  background: date ? '#f9f9f9' : '#f6f6f6',
                  cursor: date ? 'pointer' : 'default',
                }}
                onDoubleClick={() =>
                  date && onDoubleClickDate(date.toISOString().slice(0, 10))
                }
              >
                {date && (
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {date.getDate()}
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      {tasks
                        .filter(
                          (task) =>
                            task.date === date.toISOString().slice(0, 10),
                        )
                        .map((task, index) => (
                          <div
                            key={task.id || index}
                            style={{
                              background: '#e6eaff',
                              borderRadius: 4,
                              margin: '2px 0',
                              padding: '0 4px',
                              textAlign: 'left',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CalendarGrid;
