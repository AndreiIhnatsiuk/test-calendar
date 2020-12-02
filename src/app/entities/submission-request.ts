export class SubmissionRequest {
  problemId: number;
  solution: string;

  constructor(problemId: number, solution: string) {
    this.problemId = problemId;
    this.solution = solution;
  }
}
