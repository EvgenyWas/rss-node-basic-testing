import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList([])).toStrictEqual({ value: null, next: null });
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(['first', 'second', 'third'])).toMatchSnapshot();
  });
});
