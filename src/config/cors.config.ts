import { INestApplication } from '@nestjs/common';
import { Request } from 'express';

import { HttpRequestHeaderKeysEnum } from '@/shared/http';

export const corsOptionsDelegate: Parameters<INestApplication['enableCors']>[0] = function (req: Request, callback) {
  const corsOptions: Parameters<typeof callback>[1] = {
    origin: false as boolean | string | string[],
    preflightContinue: false,
    credentials: true,
    maxAge: 86400,
    allowedHeaders: Object.values(HttpRequestHeaderKeysEnum),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Métodos aceitos
  };

  const origin = extractOrigin(req);

  // Se wildcard estiver habilitado (para dev ou staging)
  if (enableWildcard()) {
    corsOptions.origin = '*'; // Aceita todas as origens em dev/staging
  } else {
    // Lista de origens permitidas
    corsOptions.origin = getAllowedOrigins();

    // Adiciona a origem recebida (se estiver na lista permitida)
    if (corsOptions.origin.includes(origin)) {
      corsOptions.origin = origin;
    } else {
      corsOptions.origin = false; // Bloqueia se a origem não for permitida
    }
  }

  // Log para depuração
  console.log({
    environment: process.env.NODE_ENV,
    origin,
    corsConfig: corsOptions,
  });

  callback(null as unknown as Error, corsOptions);
};

function getAllowedOrigins(): string[] {
  const allowedOrigins = ['https://partner1.com', 'https://partner2.com'];

  const partnerOrigins = process.env.PARTNER_ORIGINS ? process.env.PARTNER_ORIGINS.split(',') : [];

  const swaggerOrigin = process.env.SWAGGER_ORIGIN || 'http://localhost:3333';

  return [...allowedOrigins, ...partnerOrigins, swaggerOrigin];
}

function enableWildcard(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';
}

function extractOrigin(req: Request): string {
  return req.headers.origin || '';
}
