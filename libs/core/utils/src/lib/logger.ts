export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_WEIGHTS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export interface LoggerContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context: LoggerContext;
  timestamp: Date;
  error?: Error;
}

export type LogWriter = (entry: LogEntry) => void;

const consoleWriter: LogWriter = ({ level, message, context, error, timestamp }) => {
  const payload = { ...context };
  if (error) {
    Object.assign(payload, { error });
  }

  const line = `[${timestamp.toISOString()}] ${message}`;

  switch (level) {
    case 'debug':
      console.debug(line, payload);
      break;
    case 'info':
      console.info(line, payload);
      break;
    case 'warn':
      console.warn(line, payload);
      break;
    case 'error':
      console.error(line, payload);
      break;
    default:
      console.log(line, payload);
      break;
  }
};

export interface LoggerOptions {
  level?: LogLevel;
  context?: LoggerContext;
  writer?: LogWriter;
}

export interface Logger {
  debug(message: string, context?: LoggerContext): void;
  info(message: string, context?: LoggerContext): void;
  warn(message: string, context?: LoggerContext): void;
  error(message: string, error?: Error | LoggerContext, context?: LoggerContext): void;
  child(context: LoggerContext): Logger;
}

const shouldLog = (configuredLevel: LogLevel, messageLevel: LogLevel) =>
  LEVEL_WEIGHTS[messageLevel] >= LEVEL_WEIGHTS[configuredLevel];

const mergeContext = (parent: LoggerContext, child?: LoggerContext) => ({ ...parent, ...(child ?? {}) });

const normaliseError = (errorOrContext?: Error | LoggerContext) => {
  if (errorOrContext instanceof Error) {
    return { error: errorOrContext };
  }

  return { context: errorOrContext };
};

export const createLogger = ({ level = 'info', context = {}, writer = consoleWriter }: LoggerOptions = {}): Logger => {
  const log = (messageLevel: LogLevel, message: string, extraContext?: LoggerContext, error?: Error) => {
    if (!shouldLog(level, messageLevel)) {
      return;
    }

    writer({
      level: messageLevel,
      message,
      context: mergeContext(context, extraContext),
      timestamp: new Date(),
      error,
    });
  };

  return {
    debug(message, extra) {
      log('debug', message, extra);
    },
    info(message, extra) {
      log('info', message, extra);
    },
    warn(message, extra) {
      log('warn', message, extra);
    },
    error(message, errorOrContext, extraContext) {
      const { error: maybeError, context: maybeContext } = normaliseError(errorOrContext);
      const mergedContext = mergeContext(maybeContext ?? {}, extraContext);
      log('error', message, mergedContext, maybeError);
    },
    child(childContext) {
      return createLogger({
        level,
        writer,
        context: mergeContext(context, childContext),
      });
    },
  };
};
