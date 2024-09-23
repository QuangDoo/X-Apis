export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'], // Định dạng file test là .test.ts
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1' // Map alias ~ đến thư mục src
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
}
