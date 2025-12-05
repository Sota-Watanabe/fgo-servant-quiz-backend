/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { JsonLogger } from './json-logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger('TestContext');
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log INFO level message', () => {
    logger.log('Test message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.severity).toBe('INFO');
    expect(logOutput.message).toBe('Test message');
    expect(logOutput.context).toBe('TestContext');
    expect(logOutput.timestamp).toBeDefined();
  });

  it('should log ERROR level message with trace', () => {
    const errorTrace = 'Error: Something went wrong\n    at test.ts:10:5';
    logger.error('Error occurred', errorTrace);

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.severity).toBe('ERROR');
    expect(logOutput.message).toBe('Error occurred');
    expect(logOutput.trace).toBe(errorTrace);
  });

  it('should log WARNING level message', () => {
    logger.warn('Warning message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.severity).toBe('WARNING');
    expect(logOutput.message).toBe('Warning message');
  });

  it('should log DEBUG level message', () => {
    logger.debug('Debug message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.severity).toBe('DEBUG');
    expect(logOutput.message).toBe('Debug message');
  });

  it('should log with additional parameters', () => {
    logger.log('Test message', { userId: 123, action: 'fetch' });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.params).toEqual([{ userId: 123, action: 'fetch' }]);
  });

  it('should override context from parameters', () => {
    logger.log('Test message', 'OverriddenContext');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.context).toBe('OverriddenContext');
  });

  it('should format Error object as message', () => {
    const error = new Error('Test error');
    logger.log(error);

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.message).toBe('Test error');
  });

  it('should format object as JSON string', () => {
    logger.log({ key: 'value', nested: { prop: 123 } });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.message).toBe('{"key":"value","nested":{"prop":123}}');
  });

  it('should create logger without context', () => {
    const noContextLogger = new JsonLogger();
    noContextLogger.log('Test message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);

    expect(logOutput.context).toBeUndefined();
  });
});
