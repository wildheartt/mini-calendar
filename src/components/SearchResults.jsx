import React from 'react';

const SearchResults = ({ tasks, searchQuery, onTaskClick }) => {
  if (!searchQuery || tasks.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        Результаты поиска ({tasks.length})
      </div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="search-result-item"
          onClick={() => onTaskClick && onTaskClick(task)}
        >
          <div
            style={{
              fontWeight: '500',
              marginBottom: '4px',
              fontSize: '14px',
            }}
          >
            <HighlightText text={task.title} query={searchQuery} />
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '4px',
            }}
          >
            Дата: {new Date(task.date).toLocaleDateString('ru-RU')}
          </div>
          {task.description && (
            <div
              style={{
                fontSize: '12px',
                color: '#888',
                lineHeight: '1.4',
              }}
            >
              <HighlightText text={task.description} query={searchQuery} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Компонент для подсветки найденного текста
const HighlightText = ({ text, query }) => {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="search-highlight">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export default SearchResults;
