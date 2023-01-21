/* eslint-disable */
export default {
  displayName: 'shared',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    }
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/shared',
  moduleNameMapper: {
    "^@lib/(.*)": "<rootDir>/src/$1/public-api.ts"
  }
};
