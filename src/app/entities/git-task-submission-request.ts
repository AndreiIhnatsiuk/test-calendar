export class GitTaskSubmissionRequest {
  problemId: number;
  pullRequestId: number;

  constructor(problemId: number, pullRequestId: number) {
    this.problemId = problemId;
    this.pullRequestId = pullRequestId;
  }
}
