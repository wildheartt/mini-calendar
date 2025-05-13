import React from 'react';
import { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import TaskModal from './TaskModal';
import { fetchTasks, createTask } from '../api';

const getMonthRange = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const from = new Date(year, month, 1);
  const to = new Date(year, month + 1, 0);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
};

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState({ open: false, date: null });

  useEffect(() => {
    const { from, to } = getMonthRange(currentDate);
    fetchTasks(from, to)
      .then((data) =>
        setTasks(data.map((t) => ({ ...t, date: t.date.slice(0, 10) }))),
      )
      .catch(() => setTasks([]));
  }, [currentDate]);

  const handlePrevMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  const handleNextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  const handlePrevYear = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1),
    );
  const handleNextYear = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1),
    );

  const addTask = async (date, { title, description }) => {
    const res = await createTask(date, JSON.stringify({ title, description }));
    setTasks((prev) => [
      ...prev,
      {
        ...res,
        ...JSON.parse(res.text),
        date: res.date.slice(0, 10),
      },
    ]);
  };

  return (
    <div>
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
      />
      <CalendarGrid
        currentDate={currentDate}
        tasks={tasks}
        onDoubleClickDate={(date) => setModal({ open: true, date })}
      />
      <TaskModal
        open={modal.open}
        onClose={() => setModal({ open: false, date: null })}
        onSave={async (data) => {
          await addTask(modal.date, data);
          setModal({ open: false, date: null });
        }}
      />
    </div>
  );
};

export default Calendar;
