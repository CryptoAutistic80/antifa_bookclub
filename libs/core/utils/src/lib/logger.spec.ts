import { createLogger } from './logger';

describe('createLogger', () => {
  it('respects log levels', () => {
    const writes: unknown[] = [];
    const logger = createLogger({ level: 'warn', writer: (entry) => writes.push(entry) });

    logger.info('info message');
    logger.error('error message');

    expect(writes).toHaveLength(1);
    expect((writes[0] as { message: string }).message).toBe('error message');
  });

  it('merges context when using child loggers', () => {
    const writes: unknown[] = [];
    const logger = createLogger({ level: 'debug', context: { service: 'api' }, writer: (entry) => writes.push(entry) });

    const child = logger.child({ requestId: 'req-1' });
    child.info('message', { userId: 'user-1' });

    expect(writes).toHaveLength(1);
    expect((writes[0] as { context: Record<string, unknown> }).context).toEqual({
      service: 'api',
      requestId: 'req-1',
      userId: 'user-1',
    });
  });

  it('handles error arguments gracefully', () => {
    const writes: unknown[] = [];
    const logger = createLogger({ writer: (entry) => writes.push(entry) });
    const error = new Error('boom');

    logger.error('failed', error, { job: 'sync' });

    expect(writes).toHaveLength(1);
    const entry = writes[0] as { error: Error; context: Record<string, unknown> };
    expect(entry.error).toBe(error);
    expect(entry.context).toEqual({ job: 'sync' });
  });
});
