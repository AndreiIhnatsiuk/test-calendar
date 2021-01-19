export class RunSubmissionRequest {
  problemId: number;
  solution: string;
  input: string;

  constructor(problemId: number, solution: string, input: string) {
    this.problemId = problemId;
    this.solution = solution;
    this.input = input;
  }
}
