export class SubmissionRequest {
  problemId: number;
  solution: string;
  type: string;

  constructor(problemId: number, solution: string) {
    this.problemId = problemId;
    this.solution = solution;
    this.type = 'Task';
  }
}
