import Fuse from 'fuse.js';

// Настройки 
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'description', weight: 0.3 },
  ],
  threshold: 0.3, 
  distance: 100, 
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  findAllMatches: true,
};

export const createFuzzySearch = (tasks) => {
  return new Fuse(tasks, fuseOptions);
};

export const searchTasks = (tasks, query) => {
  if (!query || query.trim().length === 0) {
    return tasks;
  }

  const fuse = createFuzzySearch(tasks);
  const results = fuse.search(query.trim());

  return results.map((result) => result.item);
};

export const highlightMatches = (text, matches = []) => {
  if (!matches.length) return text;

  let highlightedText = text;
  const highlights = [];

  matches.forEach((match) => {
    if (match.indices) {
      match.indices.forEach(([start, end]) => {
        highlights.push({ start, end });
      });
    }
  });

  highlights.sort((a, b) => b.start - a.start);

  highlights.forEach(({ start, end }) => {
    const before = highlightedText.slice(0, start);
    const highlight = highlightedText.slice(start, end + 1);
    const after = highlightedText.slice(end + 1);
    highlightedText = before + `<mark>${highlight}</mark>` + after;
  });

  return highlightedText;
};
