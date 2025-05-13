import React from 'react';
import { useState, useEffect } from 'react';

const TaskModal = ({ open, onClose, onSave, initial }) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
  }, [initial, open]);

  if (!open) return null;

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onSave({ title, description });
    setLoading(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
        }}
      >
        <h2>{initial ? 'Редактировать' : 'Создать'} задачу</h2>
        <input
          autoFocus
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8, minHeight: 60 }}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={loading}>
            Отмена
          </button>
          <button
            onClick={handleSave}
            style={{ background: '#646cff', color: '#fff' }}
            disabled={!title.trim() || loading}
          >
            {loading ? 'Сохраняю...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
