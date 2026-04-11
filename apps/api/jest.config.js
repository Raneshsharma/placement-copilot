module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/*.spec.ts', '!**/*.test.ts', '!**/node_modules/**'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/tests/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/../tests/setup.ts'],
};
