/**
 * Next.js Instrumentation File
 *
 * This file is used to hook into the Next.js server startup lifecycle.
 * The `register` function is called once when a new Next.js server instance is bootstrapped.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on the server (Node.js runtime or edge)
  if (typeof window === 'undefined') {
    // Dynamically import to avoid bundling issues
    const { log } = await import('@/lib/logger');

    log.withMetadata({
      event: 'server_startup',
      nodeEnv: process.env.NODE_ENV,
      cfPages: process.env.CF_PAGES,
      cfPagesBranch: process.env.CF_PAGES_BRANCH,
    }).info('Next.js server instrumentation registered');

    // Set up global unhandled rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      log.withMetadata({
        event: 'unhandled_rejection',
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      }).error('Unhandled Promise Rejection');
    });

    // Set up global uncaught exception handler
    process.on('uncaughtException', (error) => {
      log.withError(error).withMetadata({
        event: 'uncaught_exception',
      }).fatal('Uncaught Exception');
    });
  }
}

/**
 * Optional: Called when the instrumentation is about to be registered.
 * Can be used for additional setup or validation.
 */
export function onRequestError({
  err,
  request,
  context,
}: {
  err: Error;
  request: Request;
  context: { routerKind: 'Pages Router' | 'App Router'; routePath: string };
}) {
  // This function is called for errors that occur during request handling
  // Note: This requires Next.js 14.1+ and experimental.instrumentationHook enabled

  // Dynamically import to avoid issues
  import('@/lib/logger').then(({ log }) => {
    log.withError(err).withMetadata({
      event: 'request_error',
      routerKind: context.routerKind,
      routePath: context.routePath,
      url: request.url,
      method: request.method,
    }).error('Request error occurred');
  });
}
