import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 2, action: Action.Add })).toBe(3);
    expect(simpleCalculator({ a: 0, b: 9999.5, action: Action.Add })).toBe(
      9999.5,
    );
    expect(simpleCalculator({ a: 1000.703, b: 0, action: Action.Add })).toBe(
      1000.703,
    );
    expect(simpleCalculator({ a: 999.74, b: 100.26, action: Action.Add })).toBe(
      1100,
    );
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 5, b: 3, action: Action.Subtract })).toBe(2);
    expect(simpleCalculator({ a: 1000, b: 500, action: Action.Subtract })).toBe(
      500,
    );
    expect(
      simpleCalculator({ a: 1.565, b: 0.565, action: Action.Subtract }),
    ).toBe(1);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 4, b: 2, action: Action.Multiply })).toBe(8);
    expect(simpleCalculator({ a: 3.5, b: 2, action: Action.Multiply })).toBe(7);
    expect(simpleCalculator({ a: 0, b: 2.5, action: Action.Multiply })).toBe(0);
    expect(simpleCalculator({ a: 100, b: 0, action: Action.Multiply })).toBe(0);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 10, b: 2, action: Action.Divide })).toBe(5);
    expect(simpleCalculator({ a: 9, b: 0, action: Action.Divide })).toBe(
      Infinity,
    );
    expect(simpleCalculator({ a: 0, b: 9, action: Action.Divide })).toBe(0);
    expect(simpleCalculator({ a: 1.565, b: 2.5, action: Action.Divide })).toBe(
      0.626,
    );
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 2, b: 3, action: Action.Exponentiate })).toBe(
      8,
    );
    expect(simpleCalculator({ a: 5, b: 0, action: Action.Exponentiate })).toBe(
      1,
    );
    expect(simpleCalculator({ a: 0, b: 5, action: Action.Exponentiate })).toBe(
      0,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 2, b: 3, action: '%' })).toBeNull();
    expect(simpleCalculator({ a: 2, b: 3, action: 'add' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(simpleCalculator({ a: '2', b: 3, action: Action.Add })).toBeNull();
    expect(
      simpleCalculator({ a: 2, b: '3', action: Action.Multiply }),
    ).toBeNull();
    expect(
      simpleCalculator({ a: null, b: undefined, action: Action.Subtract }),
    ).toBeNull();
  });
});
