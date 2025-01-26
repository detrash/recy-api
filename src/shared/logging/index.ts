import { RequestMethod } from '@nestjs/common';
import { getLoggerToken, Logger, LoggerModule, PinoLogger } from 'nestjs-pino';

export { getLoggerToken, Logger, LoggerModule, PinoLogger };

interface LoggerSettings {
  serviceName: string;
  version: string;
}

const loggingLevelArr = ['error', 'warn', 'info', 'verbose', 'debug'];

const loggingLevelSet = {
  error: 50,
  warn: 40,
  info: 30,
  verbose: 20,
  debug: 10,
};

export function getLogLevel(): string {
  let logLevel = process.env.LOGGING_LEVEL ?? 'info';

  if (!loggingLevelArr.includes(logLevel)) {
    logLevel = 'info';
  }

  return logLevel;
}

export function createNestLoggingModuleOptions(settings: LoggerSettings) {
  const environment = process.env.NODE_ENV ?? 'local';

  return {
    exclude: [{ path: '*/health', method: RequestMethod.GET }],
    pinoHttp: {
      customLevels: loggingLevelSet,
      level: getLogLevel(),
      base: {
        serviceName: settings.serviceName,
        serviceVersion: settings.version,
        environment,
      },
      transport: ['local', 'test'].includes(environment) ? { target: 'pino-pretty' } : undefined,
    },
  };
}
