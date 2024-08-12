import * as CryptoJS from 'crypto-js';

import { ApplicantReviewedResponse } from './types';

export function toWordArray(bytes: Buffer) {
  const words: number[] = [];
  for (let j = 0; j < bytes.length; j++) {
    words[j >>> 2] |= bytes[j] << (24 - 8 * (j % 4));
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length);
}

/**
 * Sanitize the KYC object to remove any sensitive information.
 * @param kyc The KYC object to sanitize.
 * @returns The sanitized KYC object.
 */
export function castKYC2SafeKYC(kyc: KYC): SafeKYC {
  return {
    externalUserId: kyc.externalUserId,
    reviewStatus: kyc.reviewStatus,
    reviewAnswer: kyc.reviewAnswer,
    moderationComment: kyc.moderationComment,
    createdAtMs: kyc.createdAtMs,
  };
}

/**
 *
 * @param webhook
 * @returns
 */
export function castWebhook2KYC(webhook: ApplicantReviewedResponse): KYC {
  return {
    inspectionId: webhook.inspectionId,
    applicantId: webhook.applicantId,
    correlationId: webhook.correlationId,
    externalUserId: webhook.externalUserId,
    levelName: webhook.levelName,
    type: webhook.type,
    reviewStatus: webhook.reviewStatus,
    moderationComment: webhook.reviewResult.moderationComment ?? null,
    clientComment: webhook.reviewResult.clientComment ?? null,
    reviewAnswer: webhook.reviewResult.reviewAnswer,
    rejectLabels: webhook.reviewResult.rejectLabels ?? null,
    reviewRejectType: webhook.reviewResult.reviewRejectType ?? null,
    createdAtMs: webhook.createdAtMs,
  };
}
