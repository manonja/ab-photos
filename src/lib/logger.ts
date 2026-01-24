import { ConsoleTransport, LogLayer, LogLevel } from 'loglayer'

/**
 * Get the log level from environment variable or default based on environment.
 * - Production: 'warn' (only warnings and errors)
 * - Preview/Development: 'info' (info, warnings, and errors)
 */
function getLogLevel(): LogLevel {
  // Check for explicit LOG_LEVEL environment variable
  const envLogLevel = process.env.LOG_LEVEL?.toLowerCase()

  const levelMap: Record<string, LogLevel> = {
    trace: LogLevel.trace,
    debug: LogLevel.debug,
    info: LogLevel.info,
    warn: LogLevel.warn,
    error: LogLevel.error,
    fatal: LogLevel.fatal,
  }

  if (envLogLevel && envLogLevel in levelMap) {
    return levelMap[envLogLevel]
  }

  // Default based on NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return LogLevel.warn
  }

  return LogLevel.info
}

/**
 * Determine if we're in a production environment.
 * Used to decide between JSON output (production) and pretty output (development).
 */
function isProductionLike(): boolean {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.CF_PAGES === '1' ||
    !!process.env.CF_PAGES_BRANCH
  )
}

/**
 * Create the LogLayer instance with appropriate configuration.
 * - In production/Cloudflare: JSON output for Workers Observability indexing
 * - In development: Structured but readable output
 */
function createLogger(): LogLayer {
  const shouldStringify = isProductionLike()

  return new LogLayer({
    transport: new ConsoleTransport({
      logger: console,
      level: getLogLevel(),
      messageField: 'msg',
      levelField: 'level',
      dateField: 'timestamp',
      stringify: shouldStringify,
    }),
  })
}

/**
 * The main logger instance.
 *
 * Usage:
 * ```typescript
 * import { log } from '@/lib/logger';
 *
 * // Simple logging
 * log.info('User logged in');
 *
 * // With metadata
 * log.withMetadata({ userId: '123', action: 'login' }).info('User logged in');
 *
 * // With errors
 * log.withError(error).error('Failed to process request');
 *
 * // Chained
 * log.withMetadata({ requestId: 'abc123' })
 *    .withError(error)
 *    .error('Request failed');
 * ```
 */
export const log = createLogger()

/**
 * Create a child logger with pre-configured metadata.
 * Useful for adding consistent context like request ID, user ID, etc.
 *
 * @param metadata - Initial metadata to include in all logs from this logger
 * @returns A new LogLayer instance with the metadata pre-applied
 *
 * Usage:
 * ```typescript
 * const requestLogger = createChildLogger({ requestId: 'abc123' });
 * requestLogger.info('Processing started');
 * requestLogger.withMetadata({ step: 1 }).debug('Step 1 complete');
 * ```
 */
export function createChildLogger(metadata: Record<string, unknown>): LogLayer {
  return log.child().withMetadata(metadata) as unknown as LogLayer
}

/**
 * Create a request-scoped logger with common request context.
 *
 * @param requestId - Unique identifier for the request
 * @param additionalContext - Optional additional context (userId, path, etc.)
 * @returns A LogLayer instance configured for this request
 */
export function createRequestLogger(
  requestId: string,
  additionalContext?: Record<string, unknown>,
): LogLayer {
  return createChildLogger({
    requestId,
    ...additionalContext,
  })
}

export type { LogLevel }
