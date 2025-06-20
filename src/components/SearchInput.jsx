import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Поиск задач...' }) => {
  return (
    <div
      style={{
        marginBottom: '16px',
        position: 'relative',
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#666',
            padding: '0',
            lineHeight: '1',
          }}
          title="Очистить поиск"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
