import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import TaskModal from './TaskModal';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import { getTasks, addTask as addTaskToStorage } from '../utils/localStorage';
import { searchTasks } from '../utils/fuzzySearch';

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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const { from, to } = getMonthRange(currentDate);
    try {
      const loadedTasks = getTasks(from, to);
      setTasks(loadedTasks.map((t) => ({ ...t, date: t.date.slice(0, 10) })));
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
      setTasks([]);
    }
  }, [currentDate]);

  const filteredTasks = useMemo(() => {
    return searchTasks(tasks, searchQuery);
  }, [tasks, searchQuery]);

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
    try {
      const newTask = addTaskToStorage(date, { title, description });
      setTasks((prev) => [
        ...prev,
        {
          ...newTask,
          date: newTask.date.slice(0, 10),
        },
      ]);
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
    }
  };

  const handleTaskClick = (task) => {
    const taskDate = new Date(task.date);
    setCurrentDate(new Date(taskDate.getFullYear(), taskDate.getMonth(), 1));

    setSearchQuery('');
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
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Поиск задач по названию или описанию..."
      />
      {searchQuery && (
        <>
          <SearchResults
            tasks={filteredTasks}
            searchQuery={searchQuery}
            onTaskClick={handleTaskClick}
          />
          <div className="search-stats">
            Найдено задач: {filteredTasks.length} из {tasks.length}
          </div>
        </>
      )}
      <CalendarGrid
        currentDate={currentDate}
        tasks={searchQuery ? filteredTasks : tasks}
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
