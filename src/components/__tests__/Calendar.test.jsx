import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calendar from '../Calendar';
import axios from 'axios';
jest.mock('axios');

describe('Calendar', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });
  it('открывает модалку по двойному клику', async () => {
    render(<Calendar />);
    const dayCell = await screen.findAllByText('1');
    fireEvent.doubleClick(dayCell[0]);
    expect(screen.getByText(/Создать задачу/i)).toBeInTheDocument();
  });

  it('добавляет задачу', async () => {
    axios.post.mockResolvedValue({
      data: {
        id: '1',
        date: '2025-05-01',
        text: JSON.stringify({ title: 'Test', description: 'Desc' }),
      },
    });
    render(<Calendar />);
    const dayCell = await screen.findAllByText('1');
    fireEvent.doubleClick(dayCell[0]);
    fireEvent.change(screen.getByPlaceholderText('Заголовок'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Описание'), {
      target: { value: 'Desc' },
    });
    fireEvent.click(screen.getByText('Сохранить'));
    await waitFor(() =>
      expect(screen.queryByText('Сохранить')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
