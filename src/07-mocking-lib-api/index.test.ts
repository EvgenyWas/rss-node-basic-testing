import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({ throttle: jest.fn((fn) => fn) }));

describe('throttledGetDataFromApi', () => {
  const relativePath = 'relativePath';
  const mockAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockAxios.create.mockReturnValue(mockAxios);
  });

  test('should create instance with provided base url', async () => {
    mockAxios.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(relativePath);
    expect(mockAxios.create).toHaveBeenCalledTimes(1);
    expect(mockAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    mockAxios.get.mockResolvedValue({ data: {} });

    await throttledGetDataFromApi(relativePath);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const response = 'response';
    mockAxios.get.mockResolvedValue({ data: response });

    await expect(throttledGetDataFromApi(relativePath)).resolves.toBe(response);
  });
});
