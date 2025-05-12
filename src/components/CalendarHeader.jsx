const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const CalendarHeader = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
      }}
    >
      <button onClick={onPrevYear}>&laquo;</button>
      <button onClick={onPrevMonth}>&lsaquo;</button>
      <span style={{ minWidth: 120, textAlign: 'center', fontWeight: 600 }}>
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
      </span>
      <button onClick={onNextMonth}>&rsaquo;</button>
      <button onClick={onNextYear}>&raquo;</button>
    </div>
  );
};

export default CalendarHeader;
