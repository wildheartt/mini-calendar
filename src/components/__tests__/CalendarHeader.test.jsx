import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarHeader from '../CalendarHeader';
import '@testing-library/jest-dom';

describe('CalendarHeader', () => {
  const baseDate = new Date(2025, 4, 1); // май 2025
  it('рендерит месяц и год', () => {
    render(
      <CalendarHeader
        currentDate={baseDate}
        onPrevMonth={() => {}}
        onNextMonth={() => {}}
        onPrevYear={() => {}}
        onNextYear={() => {}}
      />,
    );
    expect(screen.getByText(/Май 2025/)).toBeInTheDocument();
  });

  it('вызывает onPrevMonth/onNextMonth/onPrevYear/onNextYear', () => {
    const prevMonth = jest.fn();
    const nextMonth = jest.fn();
    const prevYear = jest.fn();
    const nextYear = jest.fn();
    render(
      <CalendarHeader
        currentDate={baseDate}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onPrevYear={prevYear}
        onNextYear={nextYear}
      />,
    );
    fireEvent.click(screen.getByText('«'));
    fireEvent.click(screen.getByText('‹'));
    fireEvent.click(screen.getByText('›'));
    fireEvent.click(screen.getByText('»'));
    expect(prevYear).toHaveBeenCalled();
    expect(prevMonth).toHaveBeenCalled();
    expect(nextMonth).toHaveBeenCalled();
    expect(nextYear).toHaveBeenCalled();
  });
});
