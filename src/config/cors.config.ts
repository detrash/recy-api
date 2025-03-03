import { INestApplication } from '@nestjs/common';
import { Request } from 'express';

import { HttpRequestHeaderKeysEnum } from '@/shared/http';

export const corsOptionsDelegate: Parameters<INestApplication['enableCors']>[0] = function (req: Request, callback) {
  const corsOptions: Parameters<typeof callback>[1] = {
    preflightContinue: false,
    credentials: true,
    maxAge: 86400,
    allowedHeaders: Object.values(HttpRequestHeaderKeysEnum),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  const origin = extractOrigin(req);

  if (enableWildcard()) {
    corsOptions.origin = '*';
  } else {
    if (getAllowedOrigins().includes(origin)) {
      corsOptions.origin = origin;
    } else {
      corsOptions.origin = false;
    }
  }

  callback(null as unknown as Error, corsOptions);
};

function getAllowedOrigins(): string[] {
  const allowedOrigins = ['https://partner1.com', 'https://partner2.com'];

  const partnerOrigins = process.env.PARTNER_ORIGINS ? process.env.PARTNER_ORIGINS.split(',') : [];

  return [...allowedOrigins, ...partnerOrigins];
}

function enableWildcard(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';
}

function extractOrigin(req: Request): string {
  return req.headers.origin || '';
}
