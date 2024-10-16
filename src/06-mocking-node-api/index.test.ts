import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const cb = () => 'Hello World!';
    const timeout = 53;
    const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout');

    doStuffByTimeout(cb, timeout);
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(setTimeoutSpy).toHaveBeenCalledWith(cb, timeout);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    const timeout = 1234;

    doStuffByTimeout(cb, timeout);
    expect(cb).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = () => 'Hello Hell!';
    const interval = 53;
    const setIntervalSpy = jest.spyOn(globalThis, 'setInterval');

    doStuffByInterval(cb, interval);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(cb, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    const interval = 12345;

    doStuffByInterval(cb, interval);
    expect(cb).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'Hello RSS!';
  const fullPath = 'my full path';

  let joinSpy: jest.SpyInstance;
  let existsSyncSpy: jest.SpyInstance;
  let readFileSpy: jest.SpyInstance;

  beforeEach(() => {
    global.__dirname = 'my dirname';
    joinSpy = jest.spyOn(path, 'join');
    existsSyncSpy = jest.spyOn(fs, 'existsSync');
    readFileSpy = jest.spyOn(fsp, 'readFile');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(pathToFile);
    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    joinSpy.mockReturnValue(fullPath);
    existsSyncSpy.mockReturnValue(false);

    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
    expect(existsSyncSpy).toHaveBeenCalledTimes(1);
    expect(existsSyncSpy).toHaveBeenCalledWith(fullPath);
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const fileContent = ['hello', 'guys!'];
    joinSpy.mockReturnValue(fullPath);
    existsSyncSpy.mockReturnValue(true);
    readFileSpy.mockResolvedValue(fileContent);

    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(
      fileContent.toString(),
    );
    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
    expect(existsSyncSpy).toHaveBeenCalledTimes(1);
    expect(existsSyncSpy).toHaveBeenCalledWith(fullPath);
    expect(readFileSpy).toHaveBeenCalledTimes(1);
    expect(readFileSpy).toHaveBeenCalledWith(fullPath);
  });
});
