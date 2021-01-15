module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
		'!<rootDir>/src/**/*-protocols.ts',
		'!<rootDir>/src/main/**',
    '!<rootDir>/src/infra/db/psql/repository/**',
    '!**/protocols/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
