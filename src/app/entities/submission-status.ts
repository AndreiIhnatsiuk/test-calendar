export enum SubmissionStatus {
  IN_QUEUE,
  RUNNING,
  INTERNAL_ERROR,
  ACCEPTED,
  RUN_ERROR,
  COMPILATION_ERROR,
  RUNTIME_ERROR,
  TIME_LIMIT,
  MEMORY_LIMIT,
  WRONG_ANSWER
}

export type SubmissionStatusStrings = keyof typeof SubmissionStatus;
