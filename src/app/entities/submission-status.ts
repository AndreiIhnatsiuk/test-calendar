export enum SubmissionStatus {
  InQueue,
  Running,
  InternalError,
  Accepted,
  RunError,
  CompilationError,
  RuntimeError,
  TimeLimit,
  MemoryLimit,
  WrongAnswer
}

export type SubmissionStatusStrings = keyof typeof SubmissionStatus;
