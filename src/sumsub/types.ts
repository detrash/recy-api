export const reviewAnswers = ['RED', 'GREEN'] as const;
export type ReviewAnswer = (typeof reviewAnswers)[number];

export const reviewRejectTypes = ['FINAL', 'RETRY'] as const;
export type ReviewRejectType = (typeof reviewRejectTypes)[number];

export interface SumsubWebhookResponse<T = string> {
  applicantId: string;
  inspectionId: string;
  correlationId: string;
  externalUserId: string;
  levelName: string;
  type: T;
  reviewStatus: string;
  createdAtMs: string;
}

export interface ApplicantReviewedResponse
  extends SumsubWebhookResponse<'applicantReviewed'> {
  reviewResult: ReviewResult;
}

export interface ReviewResult {
  /** a human-readable comment that can be shown to your applicants.  */
  moderationComment?: string;
  /** a human-readable comment that should not be shown to your applicants.  */
  clientComment?: string;
  reviewAnswer: ReviewAnswer;
  rejectLabels?: string[];
  reviewRejectType?: ReviewRejectType;
}
