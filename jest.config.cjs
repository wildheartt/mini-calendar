module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+.[jt]sx?$': 'babel-jest' },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.jsx'],
  testPathIgnorePatterns: ['/node_modules/'],
};
