import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarGrid from '../CalendarGrid';
import '@testing-library/jest-dom';

describe('CalendarGrid', () => {
  const baseDate = new Date(2025, 4, 1); 
  const tasks = [
    { id: '1', date: '2025-05-01', title: 'Task 1', description: 'Desc 1' },
    { id: '2', date: '2025-05-02', title: 'Task 2', description: 'Desc 2' },
  ];

  it('рендерит сетку дней', () => {
    render(
      <CalendarGrid
        currentDate={baseDate}
        tasks={[]}
        onDoubleClickDate={() => {}}
      />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('отображает задачи в ячейках', () => {
    render(
      <CalendarGrid
        currentDate={baseDate}
        tasks={tasks}
        onDoubleClickDate={() => {}}
      />,
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('вызывает onDoubleClickDate по двойному клику', () => {
    const onDoubleClickDate = jest.fn();
    render(
      <CalendarGrid
        currentDate={baseDate}
        tasks={[]}
        onDoubleClickDate={onDoubleClickDate}
      />,
    );
    const dayCell = screen.getAllByText('1')[0];
    fireEvent.doubleClick(dayCell);
    expect(onDoubleClickDate).toHaveBeenCalled();
  });
});
