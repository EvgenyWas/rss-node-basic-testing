import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 0, b: 2, action: Action.Add, expected: 2 },
  { a: 3, b: 0, action: Action.Add, expected: 3 },
  { a: 100.55, b: 0.55, action: Action.Add, expected: 101.1 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 1000.2, b: 5.2, action: Action.Subtract, expected: 995 },
  { a: 1.565, b: 0.565, action: Action.Subtract, expected: 1 },
  { a: 0, b: 100000, action: Action.Subtract, expected: -100000 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },
  { a: 10, b: 0, action: Action.Divide, expected: Infinity },
  { a: 0, b: 1984, action: Action.Divide, expected: 0 },
  { a: 1.565, b: 2.5, action: Action.Divide, expected: 0.626 },
  { a: 2, b: 3, action: Action.Multiply, expected: 6 },
  { a: 0, b: 2, action: Action.Multiply, expected: 0 },
  { a: 999, b: 0, action: Action.Multiply, expected: 0 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
  { a: 0, b: 6, action: Action.Exponentiate, expected: 0 },
  // invalid test cases
  { a: '2', b: 3, action: Action.Add, expected: null },
  { a: 2, b: '3', action: Action.Add, expected: null },
  { a: 2, b: 3, action: '%', expected: null },
  { a: null, b: undefined, action: Action.Add, expected: null },
  { a: 2, b: null, action: Action.Multiply, expected: null },
  { a: 'test', b: 'case', action: Action.Divide, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected when action is $action with $a and $b values',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
