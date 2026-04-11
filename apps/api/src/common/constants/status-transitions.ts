import { ApplicationStatus } from '@prisma/client';

export const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.DRAFT]: [ApplicationStatus.SUBMITTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.SUBMITTED]: [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.UNDER_REVIEW]: [ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.INTERVIEW]: [ApplicationStatus.OFFERED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.OFFERED]: [ApplicationStatus.WITHDRAWN],
  [ApplicationStatus.REJECTED]: [],
  [ApplicationStatus.WITHDRAWN]: [],
};

export const VALID_STATUS_TRANSITIONS = STATUS_TRANSITIONS;

export function isValidTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
