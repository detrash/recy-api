import { INestApplication } from '@nestjs/common';
import { Request } from 'express';

import { HttpRequestHeaderKeysEnum } from '@/shared/http';

export const corsOptionsDelegate: Parameters<
  INestApplication['enableCors']
>[0] = function (req: Request, callback) {
  const corsOptions: Parameters<typeof callback>[1] = {
    origin: false as boolean | string | string[],
    preflightContinue: false,
    credentials: true,
    maxAge: 86400,
    allowedHeaders: Object.values(HttpRequestHeaderKeysEnum),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  const origin = extractOrigin(req);

  // Se wildcard estiver habilitado (para dev ou staging)
  if (enableWildcard()) {
    corsOptions.origin = '*';
  } else {
    // Lista de origens, incluindo as origens dos parceiros
    corsOptions.origin = getAllowedOrigins();

    // Adiciona a origem do Frontend se disponível
    if (process.env.FRONT_BASE_URL) {
      corsOptions.origin.push(process.env.FRONT_BASE_URL);
    }
  }

  // TODO: esperando recurso do pino logger
  console.log({
    curEnv: process.env.NODE_ENV,
    previewUrlRoot: process.env.PR_PREVIEW_ROOT_URL,
    origin,
  });

  callback(null as unknown as Error, corsOptions);
};

function getAllowedOrigins(): string[] {
  const allowedOrigins = ['https://partner1.com', 'https://partner2.com'];

  const partnerOrigins = process.env.PARTNER_ORIGINS
    ? process.env.PARTNER_ORIGINS.split(',')
    : [];

  return [...allowedOrigins, ...partnerOrigins];
}

function enableWildcard(): boolean {
  return process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'staging';
}

function extractOrigin(req: Request): string {
  return req.headers.origin || '';
}
