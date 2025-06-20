import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskModal from '../TaskModal';

describe('TaskModal', () => {
  it('не рендерит модалку если open=false', () => {
    render(<TaskModal open={false} onClose={() => {}} onSave={() => {}} />);
    expect(screen.queryByPlaceholderText('Заголовок')).not.toBeInTheDocument();
  });

  it('рендерит модалку если open=true', () => {
    render(<TaskModal open={true} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByPlaceholderText('Заголовок')).toBeInTheDocument();
  });

  it('вызывает onClose', () => {
    const onClose = jest.fn();
    render(<TaskModal open={true} onClose={onClose} onSave={() => {}} />);
    fireEvent.click(screen.getByText('Отмена'));
    expect(onClose).toHaveBeenCalled();
  });

  it('вызывает onSave с введёнными данными', async () => {
    const onSave = jest.fn();
    render(<TaskModal open={true} onClose={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByPlaceholderText('Заголовок'), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByPlaceholderText('Описание'), {
      target: { value: 'Desc' },
    });
    fireEvent.click(screen.getByText('Сохранить'));
    expect(onSave).toHaveBeenCalledWith({ title: 'Test', description: 'Desc' });
  });
});
