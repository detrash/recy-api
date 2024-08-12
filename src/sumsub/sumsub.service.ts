'use server';

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import FormData from 'form-data';
import { catchError, firstValueFrom } from 'rxjs';

import { PrismaService } from '@/database';

import { toWordArray } from './utils';

@Injectable()
export class SumsubService {
  logger = new Logger(SumsubService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.httpService.axiosRef.interceptors.request.use(
      this.createSignature.bind(this),
      function (error) {
        return Promise.reject(error);
      },
    );
  }

  async getSDKAccessToken({
    userId,
    levelName = 'basic-kyc-level',
    ttlInSecs = 600,
  }: {
    userId: string;
    levelName?: string;
    ttlInSecs?: number;
  }): Promise<string> {
    const response = await firstValueFrom(
      this.httpService
        .post<{ token: string }>(`/resources/accessTokens`, undefined, {
          params: { userId, levelName, ttlInSecs },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return response.data.token;
  }

  async getSignature({
    secretKey,
    digestAlg,
    content,
  }: {
    secretKey: string;
    digestAlg: string;
    content: any;
  }) {
    const { data } = await firstValueFrom(
      this.httpService.post<{ digest: string; digestAlg: string }>(
        `/resources/inspectionCallbacks/testDigest`,
        content,
        {
          params: { secretKey, digestAlg },
        },
      ),
    );

    return data;
  }

  async addKYC(newKYC: KYC): Promise<SafeKYC> {
    // TODO
  }

  async getKYCByUserId(userId: string): Promise<SafeKYC> {
    // TODO
  }

  createSignature(config: InternalAxiosRequestConfig) {
    const ts = Math.floor(Date.now() / 1000);

    const hmac = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      this.configService.get('SUMSUB_SECRET_KEY'),
    );
    hmac.update(ts + config.method!.toUpperCase() + config.url);

    if (config.params) {
      hmac.update(`?${new URLSearchParams(config.params).toString()}`);
    }

    if (config.data instanceof FormData) {
      hmac.update(toWordArray(config.data.getBuffer()));
    } else if (config.data) {
      hmac.update(JSON.stringify(config.data));
    }

    config.headers['X-App-Access-Ts'] = ts;
    config.headers['X-App-Access-Sig'] = hmac
      .finalize()
      .toString(CryptoJS.enc.Hex);
    return config;
  }

  async checkDigest(req: Request): Promise<boolean> {
    const secret = this.configService.get('SUMSUB_SECRET_KEY');
    const secretKey = req.headers.get('SUMSUB_SECRET_KEY');

    // For now check API request secret key in the header
    if (secretKey === secret) {
      return true;
    }

    const algo = req.headers.get('X-Payload-Digest-Alg');
    if (!algo) {
      throw new Error('Missing digest algorithm');
    }

    const hasher = {
      HMAC_SHA1_HEX: CryptoJS.algo.SHA1,
      HMAC_SHA256_HEX: CryptoJS.algo.SHA256,
      HMAC_SHA512_HEX: CryptoJS.algo.SHA512,
    }[algo!];

    if (!hasher) {
      throw new Error('Unsupported algorithm');
    }

    const digest = req.headers.get('x-payload-digest');
    const body = await req.json();
    const hmac = CryptoJS.algo.HMAC.create(hasher, secret);

    const calculatedDigest = hmac
      .update(JSON.stringify(body))
      .finalize()
      .toString(CryptoJS.enc.Hex);

    console.log({
      calculatedDigest,
      digest,
      secret,
      algo,
      body: JSON.stringify(body),
    });

    return calculatedDigest === digest;
  }
}
